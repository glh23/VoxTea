@echo off
echo ===========================
echo Running Frontend Tests
echo ===========================
:: Remove old frontend container if it exists
FOR /F "tokens=*" %%i IN ('docker ps -aq -f name=voxtea-frontend-test') DO (
  echo Removing old frontend test container...
  docker rm -f %%i
)

:: Remove old frontend test image if it exists
FOR /F "tokens=*" %%i IN ('docker images -q voxtea-frontend-tests') DO (
  echo Removing old frontend test image...
  docker rmi -f %%i
)

:: Build the frontend test image
echo Building frontend test image...
docker build -f frontend/Dockerfile.frontend.test -t voxtea-frontend-tests .

:: Run the frontend test container
echo Running frontend tests...
docker run --rm --name voxtea-frontend-test voxtea-frontend-tests

echo ===========================
echo Running Backend Tests
echo ===========================
:: Remove old backend container if it exists
FOR /F "tokens=*" %%i IN ('docker ps -aq -f name=voxtea-backend-test') DO (
  echo Removing old backend test container...
  docker rm -f %%i
)

:: Remove old backend test image if it exists
FOR /F "tokens=*" %%i IN ('docker images -q voxtea-backend-tests') DO (
  echo Removing old backend test image...
  docker rmi -f %%i
)

:: Build the backend test image
echo Building backend test image...
docker build -f backend/Dockerfile.backend.test -t voxtea-backend-tests .

:: Run the backend test container
echo Running backend tests...
docker run --rm --name voxtea-backend-test voxtea-backend-tests

echo ===========================
echo All Tests Complete
echo ===========================
pause
