from sqlmodel import SQLModel


class UpdateModel(SQLModel):
    solved: bool
