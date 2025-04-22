@echo off
echo ===========================
echo Running Frontend Tests
echo ===========================

:: Remove old frontend container if it exists
docker ps -a -q -f name=voxtea-frontend-tests | findstr . && docker rm -f voxtea-frontend-tests

:: Build the frontend test image
docker build -f frontend/Dockerfile.frontend.test -t voxtea-frontend-tests .

:: Run the frontend test container
docker run --rm --name voxtea-frontend-tests voxtea-frontend-tests

echo ===========================
echo Running Backend Tests
echo ===========================

:: Remove old backend container if it exists
docker ps -a -q -f name=voxtea-backend-tests | findstr . && docker rm -f voxtea-backend-tests

:: Build the backend test image
docker build -f backend/Dockerfile.backend.test -t voxtea-backend-tests .

:: Run the backend test container
docker run --rm --name voxtea-backend-tests voxtea-backend-tests

echo ===========================
echo All Tests Complete
echo ===========================
pause
