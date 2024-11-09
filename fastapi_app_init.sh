#!/bin/bash

# Function to create the applet files
create_applet_files() {
    local base_path="$1"
    local applet_name="$2"

    # Create the applet directory structure
    mkdir -p "$base_path/src/api/v1/$applet_name" "$base_path/src/models" "$base_path/src/schemas" "$base_path/src/repositories"

    # Create __init__.py files
    touch "$base_path/src/api/v1/$applet_name/__init__.py"
    touch "$base_path/src/models/__init__.py"
    touch "$base_path/src/models/base.py"
    touch "$base_path/src/schemas/__init__.py"
    touch "$base_path/src/repositories/__init__.py"

    # Create the applet-specific files
    touch "$base_path/src/api/v1/$applet_name/routes.py" "$base_path/src/api/v1/$applet_name/services.py"
    touch "$base_path/src/models/$applet_name.py"
    touch "$base_path/src/schemas/$applet_name.py"
    touch "$base_path/src/repositories/$applet_name.py"
}

# Check if applet name is provided
if [ -z "$1" ]; then
    echo "Error: Applet name is required."
    echo "Usage: $0 <applet_name> [<directory_path>]"
    exit 1
fi

# Set the applet name from the first parameter
applet_name="$1"

# Default directory to current working directory
directory="."

# Check if a directory path is provided as a second parameter
if [ -n "$2" ]; then
    directory="$2"
fi

# Ensure the directory path ends with a slash
directory=$(realpath "$directory")

# Create the applet files in the directory
create_applet_files "$directory" "$applet_name"

# Output success message
echo "Applet '$applet_name' has been added to the project at '$directory/src'."
