from database_context.db_context import create_db_and_tables
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import logging
import uvicorn
from passlib.context import CryptContext

from routes import auth, issues, users

logging.basicConfig(filename="./logs/log.txt", encoding="utf-8", level=logging.DEBUG)
logger = logging.getLogger("main")

app = FastAPI()

app.include_router(auth.router)
app.include_router(issues.router)
app.include_router(users.router)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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


@app.get(
    "/",
    summary="Serve main site.",
    description="Serve main website with all the necessary routes for getting, posting and updating issues.",
    response_class=HTMLResponse,
)
async def serve_spa(request: Request):
    logger.info("Frontend called.")
    return templates.TemplateResponse("index.html", {"request": request})


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
