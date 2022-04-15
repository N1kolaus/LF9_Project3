from database_context.db_context import engine
from fastapi import HTTPException, File, UploadFile, Form, APIRouter
from fastapi.responses import FileResponse
from models.ticket_model import Issue
from models.update_model import UpdateModel
import os
from sqlmodel import Session
from typing import List, Optional
import logging

from components.database_helpers import (
    get_all_issues,
    get_single_issue,
    update_single_issue,
)
from components.file_system_helpers import save_file

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/api/issues/postIssue")
async def post_issue(
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
        issue = Issue(
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


@router.get("/api/issues/allData")
def get_all_tickets():
    logger.info("allData called.")
    issues = get_all_issues()

    return {"Issues": issues}


@router.get("/api/issues/getData/{id}")
def get_single_ticket(id: int):
    logger.info(f"getData id: {id} called.")
    ticket = get_single_issue(int(id))

    return {"Ticket": ticket}


@router.get("/api/issues/getFiles/{timestamp}/{picture}")
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


@router.patch("/api/issues/updateData/{id}", response_model=Issue)
def update_single_ticket(id: int, update: UpdateModel):
    logger.info(f"updateData id: {id} called.")
    ticket = update_single_issue(id, update)

    return ticket
