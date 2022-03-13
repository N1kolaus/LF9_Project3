from database_context.db_context import engine, create_db_and_tables
from fastapi import FastAPI, Request, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import logging
from models.ticket_model import Issue
from models.update_model import UpdateModel
import os
from pathlib import Path
from sqlmodel import Session, select
from typing import List, Optional
import uvicorn


logging.basicConfig(filename="./logs/log.txt", encoding="utf-8", level=logging.DEBUG)
logger = logging.getLogger("main")

app = FastAPI()


# TODO: Maybe add IPFire as origins to allow CORS, right now it's a wildcard
origins = [
    "*",
    # "http://192.168.72.3:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    logger.info("DB created.")


@app.get("/", response_class=HTMLResponse)
async def serve_spa(request: Request):
    logger.info("Frontend called.")
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/api/postIssue")
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


@app.get("/api/allData")
def get_all_tickets():
    issues = get_all_issues()
    return {"Issues": issues}


@app.get("/api/getData/{id}")
def get_single_ticket(id: int):
    ticket = get_single_issue(int(id))

    return {"Ticket": ticket}


@app.get("/api/getFiles/{timestamp}/{picture}")
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


@app.patch("/api/updateData/{id}", response_model=Issue)
def update_single_ticket(id: int, update: UpdateModel):
    ticket = update_single_issue(id, update)

    return ticket


def save_file(filename: str, data: Issue, timestamp: str):
    Path(f"{os.getcwd()}/pictures/{timestamp}/").mkdir(parents=True, exist_ok=True)
    file = os.path.join(f"{os.getcwd()}/pictures/{timestamp}/", filename)
    with open(file, "wb") as f:
        f.write(data)


def get_all_issues():
    with Session(engine) as session:
        values = session.exec(select(Issue)).all()

        return values


def get_single_issue(id: int):
    with Session(engine) as session:
        ticket = session.exec(select(Issue).where(Issue.id == id))

        return ticket.first()


def update_single_issue(id: int, update: UpdateModel):
    with Session(engine) as session:
        results = session.exec(select(Issue).where(Issue.id == id))
        ticket = results.one()
        ticket.solved = update.solved
        session.add(ticket)
        session.commit()
        session.refresh(ticket)

        return ticket


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
