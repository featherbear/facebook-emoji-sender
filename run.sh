#!/bin/sh
cd "$(dirname "$0")"

while true; do
    nodejs bot.js
    [ $? -ne 137 ] && break
done
