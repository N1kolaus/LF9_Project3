from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

from models.token import TokenData
from database_context.db_context import engine
from models.user_model import UserBase, UserInDb, UserIn, UserUpdate
from library.oauth2_scheme import oauth2_scheme



# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user(username: str):
    with Session(engine) as session:
        user = session.exec(select(UserInDb).where(UserInDb.username == username))

        return user.first()


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


def create_new_user(user_in: UserIn):
    hashed_password = get_password_hash(user_in.password)
    user_create = UserInDb(**user_in.dict(), hashed_password=hashed_password)

    with Session(engine) as session:
        session.add(user_create)
        session.commit()
        session.refresh(user_create)

    return user_create


async def get_current_active_user(current_user: UserBase = Depends(get_current_user)):
    return current_user


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def update_user_in_db(username: str, user_update: UserUpdate):
    with Session(engine) as session:
        result = session.exec(select(UserInDb).where(UserInDb.username == username))
        user = result.one()

        if not user:
            raise Exception("user does not exist.")

        user = update_user(user, user_update)

        session.add(user)
        session.commit()
        session.refresh(user)

        return user


def update_user(user: UserInDb, user_update: UserUpdate):
    if user_update.username != "":
        if not get_user(user_update.username):
            user.username = user_update.username
        else:
            raise Exception("username already taken!")
    if user_update.email != "":
        user.email = user_update.email
    if user_update.role != "" and user.role == "admin":
        user.role = user_update.role
    elif user_update.role != "" and user.role != "admin":
        raise Exception("rights insufficient.")
    if user_update.new_password != "":
        if verify_password(user_update.old_password, user.hashed_password):
            user.hashed_password = get_password_hash(user_update.new_password)
        else:
            raise Exception("Old passwort incorrect.")

    return user
