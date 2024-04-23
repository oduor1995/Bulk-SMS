FROM node:18.17.0-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache python3 make g++ && \
    npm install --force 
    
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]