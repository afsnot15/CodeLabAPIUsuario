#!/bin/bash

echo "Container Started"

npm install --legacy-peer-deps

npm run migration:run

npm run start:debug

