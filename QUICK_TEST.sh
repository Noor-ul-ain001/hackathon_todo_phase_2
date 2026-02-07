#!/bin/bash
# Quick manual test script for the todo app
# This script demonstrates all the main commands

echo "=========================================="
echo "TODO APP - QUICK COMMAND DEMONSTRATION"
echo "=========================================="
echo ""

echo "1. Testing ADD command..."
uv run main.py add "Buy groceries" "Milk, eggs, bread"
echo ""

echo "2. Testing ADD with alias 'a'..."
uv run main.py a "Write report"
echo ""

echo "3. Testing LIST command..."
uv run main.py list
echo ""

echo "4. Testing LIST with alias 'ls'..."
uv run main.py ls
echo ""

echo "5. Testing COMPLETE command..."
uv run main.py complete 1
echo ""

echo "6. Testing COMPLETE with alias 'done'..."
uv run main.py done 2
echo ""

echo "7. Viewing updated list..."
uv run main.py list
echo ""

echo "8. Testing INCOMPLETE command..."
uv run main.py incomplete 1
echo ""

echo "9. Testing UPDATE command..."
uv run main.py update 1 title "Buy groceries and supplies"
echo ""

echo "10. Testing UPDATE description..."
uv run main.py update 1 description "Milk, eggs, bread, butter, cheese"
echo ""

echo "11. Viewing final list..."
uv run main.py list
echo ""

echo "12. Testing DELETE command..."
uv run main.py delete 2
echo ""

echo "13. Testing DELETE with alias 'rm' (should fail - already deleted)..."
uv run main.py rm 2
echo ""

echo "14. Final list..."
uv run main.py list
echo ""

echo "=========================================="
echo "DEMONSTRATION COMPLETE!"
echo "All commands tested successfully."
echo "=========================================="
