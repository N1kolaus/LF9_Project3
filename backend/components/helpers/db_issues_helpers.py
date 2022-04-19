from database_context.db_context import engine
from models.ticket_model import IssueInDb, IssueUpdate
from sqlmodel import Session, select


def get_all_issues():
    with Session(engine) as session:
        values = session.exec(select(IssueInDb)).all()

        return values


def get_single_issue(id: int):
    with Session(engine) as session:
        ticket = session.exec(select(IssueInDb).where(IssueInDb.id == id))

        return ticket.first()


def update_single_issue(id: int, update: IssueUpdate):
    with Session(engine) as session:
        results = session.exec(select(IssueInDb).where(IssueInDb.id == id))
        ticket = results.one()
        ticket.solved = update.solved
        session.add(ticket)
        session.commit()
        session.refresh(ticket)

        return ticket
