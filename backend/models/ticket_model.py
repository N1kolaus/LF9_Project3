from typing import Optional
from sqlmodel import Field, SQLModel


class Issue(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    section: str
    title: str
    issue: str
    attachments: str
    solved: bool
    timestamp: int
