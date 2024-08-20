#!/usr/bin/env bash

# Directory to list files from
DIRECTORY="$(pwd)/email-templates"

# List all files in the directory
for FILE in "$DIRECTORY"/*
do
  if [ -f "$FILE" ]; then
    filename="${FILE##*/}"

    # TODO: make bucket name and auth token configurable
    npx wrangler r2 object put piclockr-common-data/email-templates/landingpage/waitlist/$filename --file $FILE
  fi
done