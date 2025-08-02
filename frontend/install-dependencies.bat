@echo off
echo Installing CyberSentinel AI Frontend Dependencies...
echo.

echo Installing core dependencies...
npm install framer-motion@^10.16.5
npm install @lottiefiles/react-lottie-player@^3.5.3
npm install lucide-react@^0.294.0
npm install clsx@^2.0.0
npm install tailwind-merge@^2.0.0

echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Run 'npm run dev' to start the development server
echo 2. Open http://localhost:3000 to view the application
echo.
pause