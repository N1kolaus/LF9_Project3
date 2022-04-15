from sqlmodel import Field, SQLModel
from typing import Optional


class UserBase(SQLModel):
    username: str
    email: Optional[str] = None
    role: Optional[list[str]] = []


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class UserCreate(UserBase):
    pass


class UserRead(UserBase):
    id: int


class UserUpdate(SQLModel):
    username: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


class UserInDb(UserBase):
    hashed_password: str


class UserIn(UserBase):
    password: str


class UserOut(UserBase):
    pass
