#!/bin/bash

# Function to create directories
create_directories() {
    local base_path="$1"

    # Create directory structure
    mkdir -p "$base_path/src/config" "$base_path/src/api/v1" "$base_path/src/core" "$base_path/src/db" "$base_path/src/models" "$base_path/src/schemas" "$base_path/src/repositories" "$base_path/src/utils" "$base_path/tests"
    
    # Create __init__.py files
    touch "$base_path/src/__init__.py"
    touch "$base_path/src/config/__init__.py"
    touch "$base_path/src/api/__init__.py"
    touch "$base_path/src/api/v1/__init__.py"
    touch "$base_path/src/core/__init__.py"
    touch "$base_path/src/db/__init__.py"
    touch "$base_path/src/models/__init__.py"
    touch "$base_path/src/schemas/__init__.py"
    touch "$base_path/src/repositories/__init__.py"
    touch "$base_path/src/utils/__init__.py"

    # Create placeholder files (you can add more templates as needed)
    touch "$base_path/src/config/settings.py" "$base_path/src/config/logging.py"
    touch "$base_path/src/core/security.py" "$base_path/src/core/jwt.py" "$base_path/src/core/pagination.py"
    touch "$base_path/src/db/session.py" "$base_path/src/db/base.py"
    touch "$base_path/src/api/deps.py" "$base_path/src/api/exceptions.py"
    touch "$base_path/src/repositories/base.py"
    touch "$base_path/src/utils/helpers.py"

    # Create test files
    touch "$base_path/tests/__init__.py"

    # Create project README.md file
    touch "$base_path/README.md"
}

# Default directory to current working directory
directory="."

# Check if a directory path is provided as a parameter
if [ -n "$1" ]; then
    directory="$1"
fi

# Ensure the directory path ends with a slash
directory=$(realpath "$directory")

# Create the directory structure
create_directories "$directory"

echo "Project structure created in '$directory/src'."
