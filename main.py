#!/usr/bin/env python3
"""
UV-compatible entry point for the Agentic Todo Application - Phase I.

This script allows the application to be run with uv run command.
"""

import sys
from src.main import main


def run():
    """
    Run the main application.
    """
    sys.exit(main())


if __name__ == "__main__":
    run()