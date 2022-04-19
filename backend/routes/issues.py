from database_context.db_context import engine
from fastapi import HTTPException, File, UploadFile, Form, APIRouter, Depends
from fastapi.responses import FileResponse
from models.ticket_model import IssueOut, IssueInDb
from models.update_model import UpdateModel
import os
from sqlmodel import Session
from typing import List, Optional
import logging

from components.helpers.auth_helpers import get_current_active_user
from components.helpers.db_issues_helpers import (
    get_all_issues,
    get_single_issue,
    update_single_issue,
)
from components.helpers.file_system_helpers import save_file
from components.schemas.tags import Tags

logger = logging.getLogger(__name__)

router = APIRouter()


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
    summary="Get all issues.",
    description="Get all issues from db.",
    response_model=list[IssueOut],
)
def get_all_tickets():
    logger.info("allData called.")
    issues = get_all_issues()

    return issues


@router.get(
    "/getData/{id}",
    summary="Get an issue by its id.",
    description="Get an issue by its id for further information and the possibility to update.",
    response_model=IssueOut,
)
def get_single_ticket(id: int):
    logger.info(f"getData id: {id} called.")
    ticket = get_single_issue(int(id))

    return ticket


@router.get(
    "/getFiles/{timestamp}/{picture}",
    summary="Get attachments of an issue.",
    description="Get the attachmetns of an issue for visualization in the frontend.",
    response_class=FileResponse,
)
def return_file(timestamp: str, picture: str):
    try:
        file_path = os.path.join(os.getcwd(), "pictures", timestamp)

        if picture.split(".")[-1] == "png":
            file_path = os.path.join(file_path, picture)

            return FileResponse(file_path)
        else:
            file_path = os.path.join(file_path, picture)

            return FileResponse(file_path)
    except Exception as e:
        logger.debug(f"Couldn't find file: {str(e)}")
        return HTTPException(status_code=404, detail="Couldn't find requested file.")


@router.patch(
    "/updateData/{id}",
    summary="Update the status of an issue.",
    description="Being able to update the status of an issue.",
    response_model=IssueOut,
)
def update_single_ticket(id: int, update: UpdateModel):
    logger.info(f"updateData id: {id} called.")
    ticket = update_single_issue(id, update)

    return ticket
