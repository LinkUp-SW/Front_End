# Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run lint
RUN npm run test
RUN npm run build


FROM alpine:3.18
COPY --from=builder /app/dist /dist
