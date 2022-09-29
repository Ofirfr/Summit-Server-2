FROM node


WORKDIR /main
# COPY package.json and package-lock.json files
COPY package*.json ./
# generated prisma files
COPY prisma ./prisma/
# COPY ENV variable
# COPY .env /main/src
# COPY .env /main/prisma
# COPY
COPY . .

# Add docker-compose-wait tool
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait


RUN npm install
RUN npx prisma generate

EXPOSE 5000

CMD node /main/src/app.js
