from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import logging

from components.schemas.tags import Tags
from models.user_model import UserIn, UserOut
from components.helpers.auth_helpers import (
    authenticate_user,
    create_access_token,
    create_new_user,
    create_refresh_token,
)
from models.token import Token


# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/auth",
    tags=[Tags.auth],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/refresh_token", response_model=Token)
async def refresh_access_token(form_data):
    refreshed_token = create_refresh_token(form_data)

    return {"access_token": refreshed_token, "token_type": "bearer"}


@router.post("/user/", response_model=UserOut)
async def create_user(user_in: UserIn):
    try:
        user_saved = create_new_user(user_in)
        return user_saved
    except Exception as exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exception),
            headers={"WWW-Authenticate": "Bearer"},
        )
