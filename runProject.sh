#!/bin/bash

# Project Paths
CLIENT_DIR="./client"
SERVER_DIR="./server"

# Check if gnome-terminal is available
if ! command -v gnome-terminal &> /dev/null
then
    echo "gnome-terminal could not be found. Please install it or use a different terminal emulator."
    exit 1
fi

# open two tabs and run 'npm run dev'
gnome-terminal --tab --title="Server" -- bash -ic "cd $SERVER_DIR && npm run dev; exec bash"
gnome-terminal --tab --title="Client" -- bash -ic "cd $CLIENT_DIR && npm run dev; exec bash"

