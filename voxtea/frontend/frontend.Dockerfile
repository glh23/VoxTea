# This top version was working until 30/03/25

# FROM node:18

# WORKDIR /app
# COPY package.json ./
# RUN npm install
# COPY . .

# EXPOSE 3000
# # Change to test for testing and start for running
# CMD ["npm", "start"]




# Alternative approach

FROM node:18

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

COPY . . 

RUN npm run build  

EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-l", "3000"]  
