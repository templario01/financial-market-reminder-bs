#!/bin/bash
set -e

npx prisma db push
node dist/main.js