"""
Database connection utility.
Provides database engine and session management.
For development, uses SQLite; for production, uses PostgreSQL.
"""

import os
from typing import Generator

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Get database URL from environment variable, default to SQLite for development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

def get_engine():
    """Get or create the database engine based on the database URL."""
    from sqlmodel import create_engine

    if DATABASE_URL.startswith("sqlite"):
        # SQLite doesn't support pool_pre_ping and pool_recycle
        return create_engine(
            DATABASE_URL,
            echo=True if os.getenv("ENVIRONMENT") == "development" else False,
        )
    else:
        # PostgreSQL configuration
        return create_engine(
            DATABASE_URL,
            echo=True if os.getenv("ENVIRONMENT") == "development" else False,
            pool_pre_ping=True,  # Verify connections before using them
            pool_recycle=3600,   # Recycle connections after 1 hour
        )


def get_session() -> Generator:
    """
    Dependency function to get database session.
    Used in FastAPI dependency injection.

    Yields:
        Session: Database session (SQLModel)
    """
    from sqlmodel import Session

    engine = get_engine()
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    """
    Create all database tables defined in SQLModel models.
    Called during application startup or database initialization.
    """
    engine = get_engine()
    # Only import SQLModel models when creating tables
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)
