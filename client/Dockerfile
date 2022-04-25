FROM node:16-alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV CI=true
CMD ["npm", "run", "dev"]