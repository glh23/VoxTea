# FROM node:18

# # Install SoX
# RUN apt-get update && apt-get install -y sox libsox-fmt-all

# WORKDIR /app
# COPY package.json ./
# RUN npm install
# COPY . .

# EXPOSE 5000

# CMD ["node", "./index.js"]
#CMD ["npm", "test"]




# Use Node.js 18
FROM node:18

# Install SoX and FFmpeg
RUN apt-get update && apt-get install -y sox libsox-fmt-all ffmpeg

# Set the working directory
WORKDIR /app

# Copy package.json and install 
COPY package.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["node", "./index.js"]
