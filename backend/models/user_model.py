from sqlmodel import Field, SQLModel
from typing import Optional


class UserBase(SQLModel):
    username: str
    email: Optional[str] = None


class UserCreate(UserBase):
    hashed_password: str
    role: Optional[str] = "user"


class UserRead(UserBase):
    id: int
    role: str


class UserUpdate(SQLModel):
    username: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    old_password: Optional[str] = None
    new_password: Optional[str] = None


class UserInDb(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    role: str


class UserIn(UserBase):
    password: str


class UserOut(UserBase):
    role: str
