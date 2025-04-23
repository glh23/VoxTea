@echo off
echo ::::::::::::::::::::::::::::::::::::::::::::::::::::::
echo Running Backend Tests
echo ::::::::::::::::::::::::::::::::::::::::::::::::::::::

:: Remove old backend container if it exists
docker ps -a -q -f name=voxtea-backend-tests | findstr . && docker rm -f voxtea-backend-tests

:: Build the backend test image
docker build -f backend/Dockerfile.backend.test -t voxtea-backend-tests .

:: Run the backend test container
docker run --rm --name voxtea-backend-tests voxtea-backend-tests

echo ::::::::::::::::::::::::::::::::::::::::::::::::::::::
echo Backend Tests Complete
echo ::::::::::::::::::::::::::::::::::::::::::::::::::::::

pause