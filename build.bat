@echo off
echo Checking for running development servers...
echo.
echo If you have the playground dev server running (npm run playground),
echo please STOP it now to avoid cache file locking issues.
echo.

echo Clearing dist directory...
if exist dist rmdir /s /q dist

echo Building...
npm run build && npm pack

