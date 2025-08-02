@echo off
echo Creating test users...
cd backend
python create_test_users.py
echo.
echo Test users created with the following credentials:
echo.
echo SuperAdmin: superadmin / Super@123
echo User: testuser / User@123  
echo LimitedUser: limited / Limit@123
echo.
pause