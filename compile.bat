:: Windows version of compile.sh

@echo off

:: Check if all required programs are installed

call yuicompressor >nul 2>&1 && (echo Yuicompressor ok) || (echo Yuicompressor is not installed ! && goto end)

call tsc >nul 2>&1 && (echo Typescript compiler ok) || (echo The typescript compiler is not installed ! && goto end)

call 7z >nul 2>&1 && (echo 7zip ok) || (echo 7zip is not installed ! && goto end)

:: Update the version written in the cacheManifest.mf file to force update of the whole game (see https://developer.mozilla.org/en-US/docs/HTML/Using_the_application_cache )

cd pythonScripts
python updateCacheManifestVersion.py
cd ..

:: Generate genAscii.ts and genText.ts from the ascii and text files
:: They will be added in the code/gen dir

cd pythonScripts
python genAscii.py
python genText.py
cd ..

:: Compile the game using tsc
:: It will generate the candybox2_uncompressed.js.temp script

dir /B /S libs\*.ts > libs.txt
dir /B /S code\main\*.ts > main.txt
dir /B /S code\gen\*.ts > gen.txt
dir /B /S code\arena\*\*.ts > arena.txt
call tsc @libs.txt @main.txt @gen.txt @arena.txt --out candybox2_uncompressed.js.temp
del libs.txt
del main.txt
del gen.txt
del arena.txt

:: Minify the script with yuicompressor, we get a candybox2.js.temp script

call yuicompressor ./candybox2_uncompressed.js.temp --type js --line-break 80 -o candybox2.js.temp

:: Create the candybox2.js file from the license and the temp file

type candybox2_sourceCodeLicense.txt > candybox2.js
type candybox2.js.temp >> candybox2.js

:: Create the candybox2_uncompressed.js file from the license and the temp file

type candybox2_sourceCodeLicense.txt > candybox2_uncompressed.js
type candybox2_uncompressed.js.temp >> candybox2_uncompressed.js

:: Remove the temp files

del candybox2.js.temp
del candybox2_uncompressed.js.temp

:: Create the .zip file we will give to others if they want to work on the game too :)

call 7z a candybox2.zip ascii code css libs pythonScripts text ascii_art.html cacheManifest.mf candybox2.js candybox2_sourceCodeLicense.txt candybox2_uncompressed.js compile.bat compile.sh create_quest.html faq.html favicon.png index.html install_tsc.html source_code.html | findstr /b /r /c:"\<Everything is Ok" /c:"\<Scanning" /c:"\<Creating archive"

:: Create the .zip file we will give to others if they want to work on the ascii art :)

call 7z a ascii_art.zip ascii

:end
pause