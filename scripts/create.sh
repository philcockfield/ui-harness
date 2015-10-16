create() {
echo ""
echo "Creating new UIHarness component module..."
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

#  Install the `ui-harness` module and start the server.
npm install --save ui-harness
npm start
}

# Run the script
#   NOTE: This is run within a function to ensure the entire
#   script is downloaded before execution starts.
create
