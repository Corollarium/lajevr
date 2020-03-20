#!/bin/bash

IMAGES=$(find ./assets ./static -type f \( -iname \*.jpg -o -iname \*.png \) | wc -l)
VIDEOS=$(find ./assets ./static -type f \( -iname \*.mp4 -o -iname \*.avi \) | wc -l)
MODELS=$(find ./assets ./static -type f \( -iname \*.glb \) | wc -l)
LOCS=$(cloc *.js assets/css/ components/ layouts/ pages/ plugins/ --json)
echo "{\"images\": $IMAGES, \"videos\": $VIDEOS, \"models\": $MODELS, \"locs\": $LOCS}" > components/statistics.json

