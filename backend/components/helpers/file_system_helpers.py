import os
from pathlib import Path
import logging


logger = logging.getLogger(__name__)


def save_file(filename: str, data: str | bytes, timestamp: int):
    logger.info(f"save_file filename: {filename}, timestamp: {timestamp} called.")
    Path(f"{os.getcwd()}/pictures/{timestamp}/").mkdir(parents=True, exist_ok=True)
    file = os.path.join(f"{os.getcwd()}/pictures/{timestamp}/", filename)
    with open(file, "wb") as f:
        f.write(data)
