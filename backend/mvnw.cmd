@REM Licensed to the Apache Software Foundation (ASF)
@REM under one or more contributor license agreements.
@REM See the NOTICE file distributed with this work
@REM for additional information regarding copyright ownership.
@REM The ASF licenses this file to You under the Apache License, Version 2.0
@REM (the "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.

@echo off
setlocal enabledelayedexpansion

for %%i in (%*) do (
  if "%%~1"=="-h" (
    echo Usage: mvnw [--help] [--quiet] [--verbose] [--settings SETTINGS] [--global-settings SETTINGS] [--update-snapshots] [--fail-fast] [--fail-at-end] [--offline] [--legacy-local-repository] [--no-snapshot-updates] [--strict-checksums] [--strict-checksum-policy] [--suppress-metadata-output] [--check-plugin-updates] [--define DEFINITION] [--log-file FILE] [--version] [GOAL]
    exit /b 0
  )
)

setlocal enableextensions enabledelayedexpansion
set MAVEN_CMD_LINE_ARGS=%*

for /f "tokens=* delims= " %%a in ('findstr /r "." "%~dp0.mvn\wrapper\maven-wrapper.properties"') do (
  if "%%a" neq "" (
    for /f "tokens=1,2 delims==" %%b in ("%%a") do (
      if "%%b"=="distributionUrl" set MAVEN_WRAPPER_DIST_URL=%%c
      if "%%b"=="wrapperUrl" set MAVEN_WRAPPER_JAR_URL=%%c
    )
  )
)

set MAVEN_JAVA_EXE=%JAVA_HOME%\bin\java.exe
if exist "%MAVEN_JAVA_EXE%" goto foundJavaHome

for /f "tokens=* delims= " %%i in ('where java') do (
  set MAVEN_JAVA_EXE=%%i
  goto foundJavaHome
)

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
exit /b 1

:foundJavaHome
if exist "%MAVEN_JAVA_EXE%" goto mavenHome

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
exit /b 1

:mavenHome
setlocal enableextensions
for /f "delims=" %%i in ('cd /d "%~dp0" ^& cd') do set MAVEN_BASEDIR=%%i
if not "%MAVEN_BASEDIR:~-1%"=="\" set "MAVEN_BASEDIR=%MAVEN_BASEDIR%\"

set MAVEN_WRAPPER_JAR="%MAVEN_BASEDIR%.mvn\wrapper\maven-wrapper.jar"

if not exist "%MAVEN_WRAPPER_JAR%" (
  if not "%MAVEN_WRAPPER_JAR_URL%" == "" (
    echo Downloading from: "%MAVEN_WRAPPER_JAR_URL%"
    powershell -Command "&{'[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile(\"%MAVEN_WRAPPER_JAR_URL%\", \"%MAVEN_WRAPPER_JAR%\")'}` " || exit /b 1
  )
  if not exist "%MAVEN_WRAPPER_JAR%" (
    echo.
    echo ERROR: Unable to get Maven wrapper JAR
    echo.
    exit /b 1
  )
)

"%MAVEN_JAVA_EXE%" ^
  -classpath "%MAVEN_WRAPPER_JAR%" ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_BASEDIR%" ^
  org.apache.maven.wrapper.MavenWrapperMain %MAVEN_CMD_LINE_ARGS%

if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & exit /b %ERROR_CODE%
