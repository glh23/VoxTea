FROM node:18

# Install SoX
RUN apt-get update && apt-get install -y sox libsox-fmt-all

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

EXPOSE 5000

CMD ["node", "./index.js"]
#CMD ["npm", "test"]