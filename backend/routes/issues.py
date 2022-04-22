from database_context.db_context import engine
from fastapi import HTTPException, File, UploadFile, Form, APIRouter, Depends, status
from fastapi.responses import FileResponse
from models.ticket_model import IssueOut, IssueInDb
import os
from sqlmodel import Session
from typing import List, Optional
import logging

from components.helpers.auth_helpers import get_current_active_user
from components.helpers.issues_helpers import (
    get_all_issues,
    get_single_issue,
    get_issues_with_username,
    update_single_issue,
)
from components.helpers.file_system_helpers import save_file
from components.schemas.tags import Tags
from models.user_model import UserRead

logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="/api/issues",
    tags=[Tags.issues],
    dependencies=[Depends(get_current_active_user)],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/postIssue",
    summary="Create an issue.",
    description="Create an issue with all the information, email, section, title and attachments.",
    response_model=IssueOut,
)
async def post_issue(
    username: str = Form(...),
    email: str = Form(...),
    section: str = Form(...),
    title: str = Form(...),
    issue: str = Form(...),
    attachments: str = Form(...),
    solved: bool = Form(...),
    timestamp: int = Form(...),
    files: Optional[List[UploadFile]] = File(None),
):
    logger.info("Data posted.")
    try:
        issue = IssueInDb(
            username=username,
            email=email,
            section=section,
            title=title,
            issue=issue,
            attachments=attachments,
            solved=solved,
            timestamp=timestamp,
        )

        if files is not None:
            for file in files:
                contents = await file.read()
                save_file(file.filename, contents, timestamp)

        with Session(engine) as session:
            session.add(issue)
            session.commit()
            session.refresh(issue)
            logger.info("Issue saved to DB.")

        return issue
    except Exception as e:
        logger.debug(f"Couldn't save data: {str(e)}")
        return HTTPException(status_code=404, detail="Couldn't save data.")


@router.get(
    "/allData",
    summary="Get all issues for specific user / all for admins.",
    description="Get all issues from db.",
    response_model=list[IssueOut],
)
async def get_all_tickets(user: UserRead = Depends(get_current_active_user)):
    logger.info(f"get users issues username: {user.username} called.")
    issues = []

    if user.role == "user":
        issues = await get_issues_with_username(user.username)
    elif user.role == "admin":
        issues = await get_all_issues()

    return issues


@router.get(
    "/getData/{issue_id}",
    summary="Get an issue by its id.",
    description="Get an issue by its id for further information and the possibility to update.",
    response_model=IssueOut,
)
async def get_single_ticket(
    issue_id: int, user: UserRead = Depends(get_current_active_user)
):
    print(user)

    logger.info(f"getData id: {issue_id} called.")
    try:
        ticket = await get_single_issue(int(issue_id), user)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    return ticket


@router.get(
    "/getFiles/{timestamp}/{picture}",
    summary="Get attachments of an issue.",
    description="Get the attachments of an issue for visualization in the frontend.",
    response_class=FileResponse,
)
async def return_file(timestamp: str, picture: str):
    try:
        file_path = os.path.join(os.getcwd(), "pictures", timestamp)

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"there no file with name: {picture}")

        if picture.split(".")[-1] == "png":
            file_path = os.path.join(file_path, picture)
            return FileResponse(file_path, media_type="image/png")
        else:
            file_path = os.path.join(file_path, picture)
            return FileResponse(file_path, media_type="image/jpeg")
    except FileNotFoundError as e:
        logger.debug(f"Couldn't find file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"couldn't find requested file {picture}",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.patch(
    "/updateData/{issue_id}",
    summary="Update the status of an issue.",
    description="Being able to update the status of an issue.",
    response_model=IssueOut,
)
async def update_single_ticket(
    issue_id: int, update: bool, user: UserRead = Depends(get_current_active_user)
):
    logger.info(f"updateData id: {issue_id} called.")
    try:
        ticket = await update_single_issue(issue_id, update, user)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    return ticket
