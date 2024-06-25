import json
from datetime import datetime

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError

from models import User
from schemas import TokenPayload
from utils import (
    ALGORITHM,
    JWT_SECRET_KEY
)

reuseable_oauth = OAuth2PasswordBearer(
    tokenUrl="/api/login",
    scheme_name="JWT"
)


async def get_current_user(token: str = Depends(reuseable_oauth)) -> User:
    try:
        payload = jwt.decode(
            token, JWT_SECRET_KEY, ALGORITHM, options={"verify_signature": False}
        )
        token_data = TokenPayload(**payload)

        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Токен просрочен",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Невозможно проверить учетные данные",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_details = json.loads(token_data.sub)
    user = User(user_details['yandex_id'], user_details['name'], user_details['access_token'])
    return user
