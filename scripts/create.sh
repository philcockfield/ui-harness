#!/usr/bin/env sh

# ------------------------------------------------------
#
#   Creates a basic NPM module with the UIHarness
#   and startup script installed.
#
#   A great starting point for an isolated set of React
#   components either for your application or published
#   as a library on NPM.
#
#   Are you looking at this in your web browser and would
#   like to create a module with a UIHarness?
#
#   Open your terminal and run:
#
#       curl -L http://j.mp/ui-harness | sh
#
# ------------------------------------------------------

# Get the current version of Node.
NODE_VERSION=$(node --version)
NODE_VERSION=${NODE_VERSION:1} # Remove the "v" prefix (eg. "v0.0.1" => "0.0.1").

GREEN='\033[0;32m'
CYAN='\033[0;36m'
LIGHT_GREY='\033[0;37m'
NC='\033[0m' # No Color.


#
#   NOTE: This is run within a function to ensure the entire
#   script is fully downloaded before execution starts.
#
function createModule() {

#
# Ensure the correct version of node is installed.
#
semverGT "4.0.0" $NODE_VERSION
if [ $? -eq 0 ]; then
  echo ""
  echo "Please ensure you have Node (version >= 4.0.0) installed."
  echo ""
  exit -1
fi


#
# Module already exists.
#
if [ -f ./package.json ]; then
  echo ""
  echo "Ooops, this folder is already an NPM module."
  echo "Instead run:"
  echo ""
  echo "     ${CYAN}npm start${NC}"
  echo ""
  exit -1
fi

echo ""
echo "Creating new UI component module."


#
# Create [package.json] file.
#
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

cat > ".gitignore" <<- EOM
.DS_Store
lib
node_modules
npm-debug.log
EOM

#
# Insert the startup script.
# This boots the UIHarness.
#
echo 'require("ui-harness/server").start({ babel: 1 });' > index.js

#
# Install the `ui-harness` module.
#
echo "${LIGHT_GREY}Running NPM install... (this may take a moment as Babel gets built)${NC}"
npm install ui-harness --save --loglevel error >&-

#
# Copy in the quick-start samples (JSX files).
#
node ./node_modules/ui-harness/server --samples


echo ""
echo "+|-------------------------------------------------------"
echo "   Module created and initialized successfully."
echo "   Automaticaly starting the server now using:"
echo ""
echo "      ${CYAN}npm start${NC}"
echo ""
echo "   Open your browser at ${GREEN}http://localhost:3030${NC}"
echo "-|-------------------------------------------------------"

#
# Start the server.
#
npm start
}







# ---------------------------------------------------------------------------------
# Semantic version checking:
# Source: https://github.com/cloudflare/semver_bash
# ---------------------------------------------------------------------------------
# Copyright (c) 2013, Ray Bejjani
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# 1. Redistributions of source code must retain the above copyright notice, this
#    list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
# ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
# The views and conclusions contained in the software and documentation are those
# of the authors and should not be interpreted as representing official policies,
# either expressed or implied, of the FreeBSD Project.
# ---------------------------------------------------------------------------------
function semverParseInto() {
    local RE='[^0-9]*\([0-9]*\)[.]\([0-9]*\)[.]\([0-9]*\)\([0-9A-Za-z-]*\)'
    #MAJOR
    eval $2=`echo $1 | sed -e "s#$RE#\1#"`
    #MINOR
    eval $3=`echo $1 | sed -e "s#$RE#\2#"`
    #MINOR
    eval $4=`echo $1 | sed -e "s#$RE#\3#"`
    #SPECIAL
    eval $5=`echo $1 | sed -e "s#$RE#\4#"`
}
function semverEQ() {
    local MAJOR_A=0
    local MINOR_A=0
    local PATCH_A=0
    local SPECIAL_A=0

    local MAJOR_B=0
    local MINOR_B=0
    local PATCH_B=0
    local SPECIAL_B=0

    semverParseInto $1 MAJOR_A MINOR_A PATCH_A SPECIAL_A
    semverParseInto $2 MAJOR_B MINOR_B PATCH_B SPECIAL_B

    if [ $MAJOR_A -ne $MAJOR_B ]; then
        return 1
    fi

    if [ $MINOR_A -ne $MINOR_B ]; then
        return 1
    fi

    if [ $PATCH_A -ne $PATCH_B ]; then
        return 1
    fi

    if [[ "_$SPECIAL_A" != "_$SPECIAL_B" ]]; then
        return 1
    fi


    return 0

}
function semverLT() {
    local MAJOR_A=0
    local MINOR_A=0
    local PATCH_A=0
    local SPECIAL_A=0

    local MAJOR_B=0
    local MINOR_B=0
    local PATCH_B=0
    local SPECIAL_B=0

    semverParseInto $1 MAJOR_A MINOR_A PATCH_A SPECIAL_A
    semverParseInto $2 MAJOR_B MINOR_B PATCH_B SPECIAL_B

    if [ $MAJOR_A -lt $MAJOR_B ]; then
        return 0
    fi

    if [[ $MAJOR_A -le $MAJOR_B  && $MINOR_A -lt $MINOR_B ]]; then
        return 0
    fi

    if [[ $MAJOR_A -le $MAJOR_B  && $MINOR_A -le $MINOR_B && $PATCH_A -lt $PATCH_B ]]; then
        return 0
    fi

    if [[ "_$SPECIAL_A"  == "_" ]] && [[ "_$SPECIAL_B"  == "_" ]] ; then
        return 1
    fi
    if [[ "_$SPECIAL_A"  == "_" ]] && [[ "_$SPECIAL_B"  != "_" ]] ; then
        return 1
    fi
    if [[ "_$SPECIAL_A"  != "_" ]] && [[ "_$SPECIAL_B"  == "_" ]] ; then
        return 0
    fi

    if [[ "_$SPECIAL_A" < "_$SPECIAL_B" ]]; then
        return 0
    fi

    return 1
}
function semverGT() {
    semverEQ $1 $2
    local EQ=$?

    semverLT $1 $2
    local LT=$?

    if [ $EQ -ne 0 ] && [ $LT -ne 0 ]; then
        return 0
    else
        return 1
    fi
}
# END: Semantic version checking.
# ---------------------------------------------------------------------------------





#
# Run the script.
#
createModule
