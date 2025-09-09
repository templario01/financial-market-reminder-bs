###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:22-alpine3.22 AS development

ENV PORT=3000
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:22-alpine3.22 AS build

WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npx prisma generate
RUN npm run build
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force
USER node

###################
# PRODUCTION
###################

FROM node:22-alpine3.22 AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

# Puedes usar un archivo de entrada, como un script shell, para ejecutar varios comandos.
# Por ejemplo, crea un archivo llamado entrypoint.sh con tus comandos:

# entrypoint.sh
# #!/bin/sh
# npx prisma db push
# node dist/main.js

# Luego, en el Dockerfile:
COPY --chown=node:node entrypoint.sh ./
RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]
