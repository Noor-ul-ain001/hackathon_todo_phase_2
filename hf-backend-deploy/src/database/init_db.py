"""
Database initialization script.
Creates all tables defined in SQLModel models.

Usage:
    uv run python -m src.database.init_db
"""

from src.database.connection import create_db_and_tables
from src.models import User, Task  # Import models to register them

def main():
    """Initialize database tables."""
    print("Creating database tables...")
    create_db_and_tables()
    print("✅ Database tables created successfully!")
    print("Tables created: users, tasks")

if __name__ == "__main__":
    main()
