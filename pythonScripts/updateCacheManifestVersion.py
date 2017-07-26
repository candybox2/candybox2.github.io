import re

manifestFileName = "./../cacheManifest.mf"
        
# We open the input file, read it and close it
inputFile = open(manifestFileName, 'r')
lines = inputFile.readlines()
inputFile.close()

# We open the output file
outputFile = open(manifestFileName, 'w')
        
# We read the lines
for line in lines:
    if(line.startswith("# Version ")):
        fullVersionList = re.findall(r'[0-9]+', line)
        line = "# Version " + fullVersionList[0] + "." + str(int(fullVersionList[1])+1) + "\n"
    outputFile.write(line)

# We close the output file
outputFile.close()
