from pydantic import BaseModel


class CodeYandex(BaseModel):
    code: str


class TokenSchema(BaseModel):
    access_token: str


class TokenPayload(BaseModel):
    sub: str = None
    exp: int = None


class UserShort(BaseModel):
    id: int
    name: str
    access_token: str
