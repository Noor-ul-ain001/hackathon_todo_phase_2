"""
JWT utilities for token verification.
Verifies JWT tokens issued by Better Auth on the frontend.
"""

import os
from jose import JWTError, jwt
from typing import Optional
from datetime import datetime, timezone

# Get secret from environment (MUST match frontend BETTER_AUTH_SECRET)
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

if not SECRET_KEY:
    raise ValueError("BETTER_AUTH_SECRET environment variable is not set")


def decode_jwt(token: str) -> Optional[dict]:
    """
    Decode and verify JWT token.

    Args:
        token: JWT token string (without "Bearer " prefix)

    Returns:
        dict: Decoded JWT payload containing user_id in "sub" claim
        None: If token is invalid or expired

    Example payload:
        {
            "sub": "<user_id>",
            "email": "<user_email>",
            "iat": <issued_at>,
            "exp": <expiration>
        }
    """
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        # Verify expiration
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(timezone.utc):
            return None

        return payload

    except JWTError:
        return None


def get_user_id_from_token(token: str) -> Optional[str]:
    """
    Extract user_id from JWT token.

    Args:
        token: JWT token string

    Returns:
        str: User ID from "sub" claim
        None: If token is invalid or user_id not found
    """
    payload = decode_jwt(token)
    if payload:
        return payload.get("sub")
    return None


def verify_token(token: str) -> bool:
    """
    Verify if JWT token is valid.

    Args:
        token: JWT token string

    Returns:
        bool: True if token is valid, False otherwise
    """
    return decode_jwt(token) is not None
