@echo off
echo.
echo             .------.____
echo         .-'       \\ ___)
echo      .-'         \\\\
echo   .-'        ___  \\\\)
echo.-'          /  |\\ \\ |)
echo         __  \\\\  | | |
echo        /  \\  \\__'| |
echo       /    \\____).-' 
echo     .'       /   |
echo    /     .  /    |
echo  .'     / \\/     |
echo /      /   \\     |
echo       /    /    _|_
echo       \\   /    /\\ /\\
echo        \\ /    /__v__\\
echo         '    |       |
echo              |     .#|
echo              |#.  .##|
echo              |#######|
echo              |#######|



echo ::::::::::::::::::::::::::::::::::::::::::::::::::::::
echo Running Frontend Tests
echo ::::::::::::::::::::::::::::::::::::::::::::::::::::::

:: Remove old frontend container if it exists
docker ps -a -q -f name=voxtea-frontend-tests | findstr . && docker rm -f voxtea-frontend-tests

:: Build the frontend test image
docker build -f frontend/Dockerfile.frontend.test -t voxtea-frontend-tests .

:: Run the frontend test container
docker run --rm --name voxtea-frontend-tests voxtea-frontend-tests

echo ::::::::::::::::::::::::::::::::::::::::::::::::::::::
echo Frontend Tests Complete
echo ::::::::::::::::::::::::::::::::::::::::::::::::::::::

pause
