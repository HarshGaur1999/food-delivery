@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM   http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.

@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Script
@REM
@REM This script is used to execute Maven commands via the Maven Wrapper.
@REM It ensures that the correct Maven version is downloaded and used.
@REM ----------------------------------------------------------------------------

@echo off

set DIRNAME=%%~dp0
set APP_BASE_NAME=%%~nx0

@REM Find the Java executable
if "%JAVA_HOME%" == "" (
  set JAVA_CMD=java
) else (
  set JAVA_CMD="%JAVA_HOME%\bin\java"
)

@REM Find the Maven Wrapper JAR
set WRAPPER_JAR="%DIRNAME%.mvn\wrapper\maven-wrapper.jar"

@REM Make sure the Maven Wrapper JAR exists
if not exist %WRAPPER_JAR% (
  echo The Maven Wrapper JAR does not exist at '%WRAPPER_JAR%'.
  echo Please run 'mvn wrapper:wrapper' to generate it.
  exit /b 1
)

@REM Execute the Maven Wrapper
%JAVA_CMD% %JAVA_OPTS% -jar %WRAPPER_JAR% %*

