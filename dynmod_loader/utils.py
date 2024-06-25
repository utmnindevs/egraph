import json
import os
from datetime import datetime, timedelta
from typing import Union, Any

import requests
from dotenv import load_dotenv
from jose import jwt
from passlib.context import CryptContext

load_dotenv()

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ACCESS_TOKEN_EXPIRE_MINUTES = float(os.environ['ACCESS_TOKEN_EXPIRE_MINUTES'])
JWT_SECRET_KEY = os.environ['JWT_SECRET_KEY']
ALGORITHM = os.environ['ALGORITHM']
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)


def create_access_token(subject: Union[dict[str], Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.now() + timedelta(minutes=expires_delta)
    else:
        expires_delta = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {"exp": expires_delta, "sub": json.dumps(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, ALGORITHM)
    return encoded_jwt


def get_access_token(code: str):
    resp = requests.post("https://oauth.yandex.ru/token", {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }, headers={
        'Content-Type': 'application/x-www-form-urlencoded'
    }).json()

    # Токен необходимо сохранить для использования в запросах к API Директа
    return resp


def extract_file_info(fields: dict):
    share = None
    if fields["share"]:
        share = fields["share"].FIELDS
    return {
        "type": fields["type"],
        "name": fields["name"],
        "size": fields["size"],
        "share": share,
        "path": fields["path"],
        "mime_type": fields["mime_type"],
        "preview": fields["preview"],
        "media_type": fields["media_type"],
        "created": str(fields["created"]),
        "modified": str(fields["modified"])
    }