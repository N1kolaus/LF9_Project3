from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import logging

from dependencies import get_token_header
from components.tags import Tags
from models.user_model import UserIn, UserOut, UserBase, UserUpdate
from components.auth_helpers import authenticate_user, create_access_token, create_new_user, get_current_user, get_current_active_user, update_user_in_db
from models.token import Token
from library.oauth2_scheme import oauth2_scheme


# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/users",
    tags=[Tags.users],
    dependencies=[Depends(get_current_active_user)],
    responses={404: {"description": "Not found"}},
)


@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: UserBase = Depends(get_current_active_user)):
    return current_user


@router.patch("/patch_user", response_model=UserOut)
async def patch_user(user_update: UserUpdate, current_user: UserBase = Depends(get_current_active_user)):
    try:
        user = update_user_in_db(current_user.username, user_update)
    except Exception as exception:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=exception,
        headers={"WWW-Authenticate": "Bearer"},
    )

    return user
