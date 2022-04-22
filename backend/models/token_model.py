from typing import Optional
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class TokenOut(BaseModel):
    access_token: str
    token_type: str
    username: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
