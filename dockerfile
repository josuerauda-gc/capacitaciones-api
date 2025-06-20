FROM node:slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node


RUN apt-get update && apt-get install -y locales locales-all nano

RUN echo "es_SV.UTF-8 UTF-8" > /etc/locale.gen && locale-gen

# Configurar la variable de entorno

ENV LANG es_SV.UTF-8

ENV LANGUAGE es_SV:es

ENV LC_ALL=

WORKDIR /app

# Copia el script de inicialización

RUN npm install pm2 -g

COPY --from=builder /app/dist ./

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package*.json ./

EXPOSE 3000

ENTRYPOINT [ "pm2-runtime", "start", "main.js"]
