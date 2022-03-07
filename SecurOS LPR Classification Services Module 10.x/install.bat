@echo off

cls

echo ====================================================
echo Installing SecurOS LPR Classification Services
echo ====================================================
echo.
echo This module will install SecurOS LPR Classification Services and the create 
echo necessary Databases to wokr with this modules. 
echo.
echo This will require about 100 MB of free disk space, plus any space necessary to
echo install databases. This will take a while to run.
echo.
echo You can close this window to stop now. 
pause

cls

call create_db.bat

SET F="deamon"
 
IF EXIST %F% RMDIR  %F%

node install.js

echo Install successfull. 
pause