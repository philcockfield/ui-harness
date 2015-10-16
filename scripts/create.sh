#!/bin/bash
# ------------------------------------------------------
#
#   Creates a basic NPM module with the UIHarness
#   and startup script installed.
#
#   Are you looking at this in your web browser and would
#   like to install UIHarness?  Open your termain and run:
#
#       curl http://j.mp/ui-harness | sh
#
# ------------------------------------------------------

create() {
echo ""
echo "Creating new UI component module..."
echo ""

# Create [package.json] file.
FOLDER_NAME=${PWD##*/}
cat > "package.json" <<- EOM
{
  "name": "${FOLDER_NAME}",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node ."
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
EOM

# Insert the startup script.
# This boots the UIHarness.
echo 'require("ui-harness/server").start({ babel: 1 });' > index.js

# Install the `ui-harness` module.
npm install --save ui-harness

echo ""
echo "-------------------------------------------------------"
echo "Module created and initialized successfully."
echo "To start the UIHarness run:"
echo ""
echo "    npm start"
echo ""

# Start the server.
npm start
}



# Run the script
#   NOTE: This is run within a function to ensure the entire
#   script is downloaded before execution starts.
create
