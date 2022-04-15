from fastapi import APIRouter, Depends
import logging

from dependencies import get_token_header
from components.tags import Tags

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/auth",
    tags=[Tags.auth],
    dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)