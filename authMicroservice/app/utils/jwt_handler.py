from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt

import os


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


def get_expiry():
    start_time = datetime.now(timezone.utc)
    expiry = start_time + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return int(start_time.timestamp()), int(expiry.timestamp())


def create_access_token(to_encode: dict):
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
