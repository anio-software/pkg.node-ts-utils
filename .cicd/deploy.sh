#!/bin/bash -euf

./node_modules/.bin/fourtune .

npm publish --provenance --access public
