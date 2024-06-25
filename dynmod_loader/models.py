from sqlalchemy import Column, String

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    name = Column(String)
    access_token = Column(String)

    def __init__(self, yandex_id, name, access_token):
        self.id = yandex_id
        self.name = name
        self.access_token = access_token
