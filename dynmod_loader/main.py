import os

import requests
import uvicorn
import yadisk
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, Depends, Form
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from starlette import status

import schemas
from database import get_db, Base, engine, create_db
from deps import get_current_user
from models import User
from schemas import CodeYandex
from utils import create_access_token, get_access_token, extract_file_info
from io import BytesIO

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
load_dotenv()

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
available_modules = {'module1', 'module2'}
d = dict([(i, __import__(i, globals(), locals(), ['calculate', 'desc'], 0)) for i in available_modules])


@app.get('/modules/list')
def modules_list():
    return dict([(i, d[i].desc) for i in d])


@app.post("/modules/{module_name}")
def calculate(module_name: str, q: str = ""):
    if module_name not in available_modules:
        raise HTTPException(status_code=404, detail="Module {} not available!".format(module_name))
    module = d[module_name]
    return {"ans": module.calculate(q)}


@app.get("/yadisk/ls")
def ls(dir_name: str, user: User = Depends(get_current_user)):
    client = yadisk.Client(token=user.access_token)
    dirs = list(map(lambda m: extract_file_info(m.FIELDS), client.listdir(dir_name)))
    return { "dir": dirs }


@app.post("/yadisk/upload")
async def save_file(file: UploadFile, dst: str = Form(), user: User = Depends(get_current_user)):
    if file.size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Файл не должен быть пустым"
        )
    file_bytes = await file.read(file.size)
    inp_b = BytesIO(file_bytes)
    client = yadisk.Client(token=user.access_token)
    client.upload(inp_b, dst, overwrite=True)
    return dst


@app.get("/yadisk/download_link")
def download_file(dst: str, user: User = Depends(get_current_user)):
    client = yadisk.Client(token=user.access_token)
    return client.get_download_link(dst)


@app.get("/yadisk/diskinfo")
def dinfo(user: User = Depends(get_current_user)):
    client = yadisk.Client(token=user.access_token)
    return client.get_disk_info()


@app.post('/register')
def register(body: CodeYandex, db: Session = Depends(get_db)):
    access_token = get_access_token(body.code)
    info = requests.get("https://login.yandex.ru/info?format=json", headers={
        "Authorization": f"OAuth {access_token['access_token']}"
    }).json()
    user = User(info['id'], info['first_name'], access_token['access_token'])
    db.add(user)
    db.commit()
    return {
        "name": user.name,
        "tokens": {
            "access_token": create_access_token({
                "yandex_id": user.id,
                "name": user.name,
                "access_token": user.access_token
            }),
        }
    }


@app.post('/update_token')
def update_token(body: CodeYandex, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    access_token = get_access_token(body.code)
    user.access_token = access_token['access_token']
    db.add(user)
    db.commit()
    return {
        "name": user.name,
        "tokens": {
            "access_token": create_access_token({
                "yandex_id": user.id,
                "name": user.name,
                "access_token": user.access_token
            }),
        }
    }


@app.post('/login', summary="Create access and refresh tokens for user")
async def login(body: CodeYandex, db: Session = Depends(get_db)):
    access_token = get_access_token(body.code)
    info = requests.get("https://login.yandex.ru/info?format=json", headers={
        "Authorization": f"OAuth {access_token['access_token']}"
    }).json()
    user = db.query(User).filter(User.id == info['id']).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неправильный логин или пароль"
        )
    return {
        "name": user.name,
        "tokens": {
            "access_token": create_access_token({
                "yandex_id": user.id,
                "name": user.name,
                "access_token": user.access_token
            }),
        }
    }


@app.get('/me', summary='Get details of currently logged in user', response_model=schemas.UserShort)
async def get_me(user: User = Depends(get_current_user)):
    return user


if __name__ == "__main__":
    create_db()
    uvicorn.run(app)
