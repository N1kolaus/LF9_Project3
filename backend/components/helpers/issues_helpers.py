from database_context.db_context import engine
from models.ticket_model import IssueInDb
from sqlmodel import Session, select

from models.user_model import UserRead


async def get_all_issues():
    with Session(engine) as session:
        values = session.exec(select(IssueInDb)).all()

        return values


async def get_single_issue(issue_id: int, user: UserRead):
    with Session(engine) as session:
        results = session.exec(select(IssueInDb).where(IssueInDb.id == issue_id))
        ticket = results.first()

        if ticket is None:
            raise FileNotFoundError(f"there is no ticket with id: {issue_id}")
        if user.username != ticket.username and user.role != "admin":
            raise PermissionError("user is not admin and not creator of ticket.")

        return ticket


async def get_issues_with_username(username: str):
    with Session(engine) as session:
        tickets = session.exec(select(IssueInDb).where(IssueInDb.username == username))

        return tickets.all()


async def update_single_issue(issue_id: int, update: bool, user: UserRead):
    with Session(engine) as session:
        results = session.exec(select(IssueInDb).where(IssueInDb.id == issue_id))
        ticket = results.one()

        if ticket is None:
            raise FileNotFoundError(f"there is no ticket with id: {issue_id}")
        if user.username != ticket.username and user.role != "admin":
            raise PermissionError("user is not admin and not creator of ticket.")

        ticket.solved = update
        session.add(ticket)
        session.commit()
        session.refresh(ticket)

        return ticket
