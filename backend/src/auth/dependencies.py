"""
FastAPI authentication dependencies.
Provides dependency injection for JWT verification.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated
from src.auth.jwt_utils import get_user_id_from_token

security = HTTPBearer()


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> str:
    """
    Dependency to get authenticated user ID from JWT token.

    Used in FastAPI routes to require authentication:
        @app.get("/api/{user_id}/tasks")
        def get_tasks(user_id: str, current_user: str = Depends(get_current_user)):
            # current_user contains authenticated user_id from JWT
            if user_id != current_user:
                raise HTTPException(status_code=403, detail="Access denied")
            ...

    Args:
        credentials: HTTP Bearer token from Authorization header

    Returns:
        str: Authenticated user ID from JWT "sub" claim

    Raises:
        HTTPException: 401 if token is missing or invalid
    """
    token = credentials.credentials

    # Decode JWT and extract user_id
    user_id = get_user_id_from_token(token)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id


def verify_user_id_match(url_user_id: str, authenticated_user_id: str):
    """
    Verify that user_id in URL matches authenticated user_id from JWT.

    This enforces user data isolation: users can only access their own data.

    Args:
        url_user_id: user_id from URL path parameter
        authenticated_user_id: user_id from JWT token

    Raises:
        HTTPException: 403 if user_id mismatch (attempted unauthorized access)
    """
    if url_user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: user_id mismatch"
        )
