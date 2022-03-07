@echo off

cls

echo ====================================================
echo Installing SecurOS LPR Classification Services
echo ====================================================
echo.
echo This module will install SecurOS LPR Classification Services and the create 
echo necessary Databases to wokr with this modules. 
echo
echo This will require about 100 MB of free disk space, plus any space necessary to
echo install databases. This will take a while to run.
echo.
echo You can close this window to stop now. 
pause

cls

create_db.bat
node index.js

cls

"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command Start-Process '%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe' -ArgumentList '-NoProfile -InputFormat None -ExecutionPolicy Bypass -Command iex ((New-Object System.Net.WebClient).DownloadString(''https://chocolatey.org/install.ps1'')); choco upgrade -y python visualstudio2017-workload-vctools; Read-Host ''Type ENTER to exit'' ' -Verb RunAs
