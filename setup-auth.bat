@echo off
echo Setting up CyberSentinel AI Authentication System...

echo.
echo Installing backend dependencies...
cd backend
pip install -r requirements.txt

echo.
echo Installing frontend dependencies...
cd ..\frontend
npm install

echo.
echo Setup complete!
echo.
echo To start the application:
echo 1. Backend: cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000
echo 2. Frontend: cd frontend && npm run dev
echo.
echo The application will be available at:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - API Documentation: http://localhost:8000/docs