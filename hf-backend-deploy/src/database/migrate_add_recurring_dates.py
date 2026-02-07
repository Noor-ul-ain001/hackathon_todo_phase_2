"""
Migration script to add recurring tasks and due dates fields.
Adds new columns to the existing tasks table without losing data.

Usage:
    uv run python -m src.database.migrate_add_recurring_dates
"""

import sqlite3
import os

def run_migration():
    """Add new columns for recurring tasks and due dates."""

    # Get database path
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "agentic_todo.db")

    print(f"Connecting to database: {db_path}")

    if not os.path.exists(db_path):
        print(f"WARNING: Database not found at {db_path}")
        print("Run 'uv run python -m src.database.init_db' first to create the database.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        print("\nAdding new columns to tasks table...")

        # Check if columns already exist
        cursor.execute("PRAGMA table_info(tasks)")
        existing_columns = [col[1] for col in cursor.fetchall()]

        migrations = [
            ("due_date", "ALTER TABLE tasks ADD COLUMN due_date TIMESTAMP NULL"),
            ("reminder_time", "ALTER TABLE tasks ADD COLUMN reminder_time TIMESTAMP NULL"),
            ("recurrence_type", "ALTER TABLE tasks ADD COLUMN recurrence_type VARCHAR(20) DEFAULT 'none'"),
            ("recurrence_interval", "ALTER TABLE tasks ADD COLUMN recurrence_interval INTEGER DEFAULT 1"),
            ("parent_task_id", "ALTER TABLE tasks ADD COLUMN parent_task_id INTEGER NULL"),
        ]

        for column_name, sql in migrations:
            if column_name in existing_columns:
                print(f"  SKIP: Column '{column_name}' already exists")
            else:
                cursor.execute(sql)
                print(f"  ADDED: Column '{column_name}'")

        conn.commit()
        print("\nSUCCESS: Migration completed successfully!")
        print("New columns added: due_date, reminder_time, recurrence_type, recurrence_interval, parent_task_id")

    except Exception as e:
        conn.rollback()
        print(f"\nERROR: Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    run_migration()
