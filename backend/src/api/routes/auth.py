"""
Authentication API endpoints.
Handles user registration and token issuance.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel, EmailStr, Field
import bcrypt
from jose import jwt
from datetime import datetime, timedelta, timezone
import os

from src.database.connection import get_session
from src.models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])

# JWT configuration
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days


# Request/Response models
class UserRegister(BaseModel):
    """Request model for user registration."""
    email: EmailStr = Field(description="User email address")
    password: str = Field(min_length=8, description="Password (min 8 characters)")


class UserLogin(BaseModel):
    """Request model for user login."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Response model for authentication."""
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str


def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(user_id: str, email: str) -> str:
    """
    Create JWT access token.

    Args:
        user_id: User's unique identifier
        email: User's email address

    Returns:
        JWT token string
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": user_id,  # User ID in "sub" claim
        "email": email,
        "iat": datetime.now(timezone.utc),
        "exp": expire
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# POST /api/auth/register - User registration
@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserRegister,
    session: Session = Depends(get_session)
):
    """
    Register a new user account.

    - Creates user in database with hashed password
    - Issues JWT token automatically
    - Returns token and user information

    Raises:
        400: Email already registered
    """
    # Check if email already exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user with hashed password
    hashed_password = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        password_hash=hashed_password,
        created_at=datetime.now(timezone.utc)
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Create JWT token
    access_token = create_access_token(user.id, user.email)

    return TokenResponse(
        access_token=access_token,
        user_id=user.id,
        email=user.email
    )


# POST /api/auth/login - User login
@router.post("/login", response_model=TokenResponse)
def login(
    credentials: UserLogin,
    session: Session = Depends(get_session)
):
    """
    Sign in with email and password.

    - Verifies credentials
    - Issues JWT token
    - Returns token and user information

    Raises:
        401: Invalid credentials (does not reveal if email exists)
    """
    # Find user by email
    statement = select(User).where(User.email == credentials.email)
    user = session.exec(statement).first()

    # Verify password
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT token
    access_token = create_access_token(user.id, user.email)

    return TokenResponse(
        access_token=access_token,
        user_id=user.id,
        email=user.email
    )
