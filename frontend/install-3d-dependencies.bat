@echo off
echo Installing React Three Fiber and Headless UI Dependencies...
echo.

echo Installing 3D visualization dependencies...
npm install @react-three/fiber@^8.15.11
npm install @react-three/drei@^9.88.17
npm install three@^0.158.0

echo.
echo Installing Headless UI components...
npm install @headlessui/react@^1.7.17
npm install @heroicons/react@^2.0.18

echo.
echo Installing TypeScript types for Three.js...
npm install --save-dev @types/three

echo.
echo All dependencies installed successfully!
echo.
echo Features added:
echo - 3D cyber threat visualizations (phishing hooks, fake websites, chat bubbles, AI brains)
echo - Modern onboarding flow with progress steps
echo - Avatar selection with Headless UI RadioGroup
echo - Company assignment with Headless UI Listbox
echo - Interactive 3D scenes with React Three Fiber
echo.
echo Next steps:
echo 1. Run 'npm run dev' to start the development server
echo 2. Visit /onboarding to see the new onboarding flow
echo 3. Check updated pages with 3D visualizations
echo.
pause