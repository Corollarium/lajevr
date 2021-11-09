#!/bin/bash

IMAGES=$(find ./assets ./static -type f \( -iname \*.jpg -o -iname \*.png \) | wc -l)
VIDEOS=$(find ./assets ./static -type f \( -iname \*.mp4 -o -iname \*.avi \) | wc -l)
MODELS=$(find ./assets ./static -type f \( -iname \*.glb \) | wc -l)
LOCS=$(cloc *.js assets/css/ components/ layouts/ pages/ plugins/ --json)

VR_IMAGES=$(find /home/corollarium/Pictures/laje -type f \( -iname \*.jpg -o -iname \*.png \) | wc -l)
VR_VIDEOS=$(find /home/corollarium/Pictures/laje -type f \( -iname \*.mp4 -o -iname \*.avi \) | wc -l)
VR_MODELS=1
VR_DATA=$(( $(cd /home/corollarium/Pictures/laje && du -BM --max-depth=0 | awk '{print substr($1, 1, length($1)-1);}') + $(cd /home/corollarium/Documents/laje/ && du -BM --max-depth=0 | awk '{print substr($1, 1, length($1)-1);}') ))

echo "{
  \"site\": { \"images\": $IMAGES, \"videos\": $VIDEOS, \"models\": $MODELS, \"locs\": $LOCS},
  \"vr\": { \"images\": $VR_IMAGES, \"videos\": $VR_VIDEOS, \"models\": $VR_MODELS, \"data\": $VR_DATA}
} " > components/statistics.json


