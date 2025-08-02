@echo off
echo Installing Enhanced Dashboard and Phishing Simulator Dependencies...
echo.

echo Installing drag and drop functionality...
npm install @dnd-kit/core@^6.1.0
npm install @dnd-kit/sortable@^8.0.0
npm install @dnd-kit/utilities@^3.2.2

echo.
echo Installing progress indicators...
npm install react-circular-progressbar@^2.1.0

echo.
echo All enhanced dependencies installed successfully!
echo.
echo New Features Added:
echo.
echo MULTI-TENANT DASHBOARD:
echo - Role-aware dashboard (Admin, User, Trainer, Compliance)
echo - Tabbed interface with animated transitions
echo - Tenant-specific content and permissions
echo - Cyberpunk-themed role indicators
echo.
echo ENHANCED PHISHING SIMULATOR:
echo - Draggable inbox interface with reordering
echo - AI-generated urgency scores (0-100)
echo - Circular progress indicators for threat levels
echo - Fake attachment previews with malware detection
echo - Interactive attachment management
echo - Enhanced email metadata and previews
echo.
echo Usage:
echo - Visit /dashboard to see role-based interface
echo - Visit /phishing for enhanced email simulator
echo - Drag emails to reorder in inbox
echo - View urgency meters and attachment previews
echo.
pause