from typing import Optional
from sqlmodel import Field, SQLModel


class IssueBase(SQLModel):
    username: str
    email: str
    section: str
    title: str
    issue: str
    attachments: str
    solved: bool
    timestamp: int


class IssueInDb(IssueBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class IssueIn(IssueBase):
    pass


class IssueOut(IssueBase):
    id: int


class IssueUpdate(IssueBase):
    pass
