@echo off
echo Checking for running development servers...
echo.
echo If you have the playground dev server running (npm run playground),
echo please STOP it now to avoid cache file locking issues.
echo.
pause

echo Clearing cache directories...
if exist dist rmdir /s /q dist
if exist .parcel-cache rmdir /s /q .parcel-cache

echo Building...
npm run build && npm pack

