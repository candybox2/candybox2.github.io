import os
import sys
from jsFormat import *

tupleList = []
rootdir = "./../ascii/"
finalFileName = "./../code/gen/genAscii.ts"

# We get the list of files in each subdirectory
for root, subFolders, files in os.walk(rootdir):
    for file in files:
        fullPath = os.path.join(root, file)
        tupleList.append((fullPath, os.path.splitext(fullPath)[0].replace(rootdir, "")))
        
# We open the output file
outfile = open(finalFileName, mode='w', encoding="utf-8")
        
# We copy the content of each file in a big "genAscii.ts" file
for tup in tupleList:
    # Open, read and close the input file
    infile = open(tup[0], 'r')
    infileLines = infile.readlines()
    infile.close()
    # Check if there's an @author instruction or not
    author = False;
    if(infileLines[0].startswith("@author")):
        author = True;
    # Calc the max width of this ascii art
    maxwidth = 0
    for index, line in enumerate(infileLines):
        if(len(line) > maxwidth and (author == False or index > 0)):
            maxwidth = len(line)
    # Cal the height of the ascii art
    height = len(infileLines)
    if(author == True):
        height -= 1
    # Write the beginning of the Database.addAscii() call
    outfile.write("Database.addAscii(\"" + tup[1] + "\", " + str(maxwidth-1) + ", " + str(height) + ", \n[\n")
    # Write the ascii art itself to the function call
    for index, line in enumerate(infileLines):
        if(line.startswith("@author") == False or index > 0): # We don't write the line if it starts with @author and its the first line
            outfile.write("\"" + jsFormat(line.rstrip()) + "\"");
            if(index < len(infileLines)-1): # We don't write the "," if we're the last line
                outfile.write(",");
            outfile.write("\n");
    # Write the end of the function call
    outfile.write("]);\n");

# We close the output file
outfile.close()
