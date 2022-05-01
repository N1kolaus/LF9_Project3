from sqlmodel import SQLModel, create_engine

# SQLite
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

# POSTGRESQL
# postgre_url = "postgresql://ticketadmin:adminadmin@192.168.17.3/tickets?sslmode=require"
# engine = create_engine(postgre_url, pool_size=3, max_overflow=0)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
