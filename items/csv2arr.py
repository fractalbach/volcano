import sys

matrix = []
for line in sys.stdin:
    line = line.replace('\n', '')
    arr = line.split(',')
    matrix += [arr]
for arr in matrix:
    print(arr)
