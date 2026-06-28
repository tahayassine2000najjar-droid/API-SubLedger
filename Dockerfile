FROM node:20

WORKDIR /app 

COPY package*.json ./

COPY . .

CMD ["npm", "run", "dev"]