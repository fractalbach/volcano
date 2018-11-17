import sys


class Item:
    def __init__(self, name="", weight=0, itemid=-1):
        self.name = name
        self.weight = weight
        self.itemid = itemid


class Knapsack:
    def __init__(self, cap=100, items={}):
        self.cap = cap
        self.items = items
    def addItem(item):
        self.items.add(item)

        
def createKeyNames(line):
    line = line.replace('\n', '')
    arr = line.split(',')
    return arr

    
def parseLine(keynames, line):
    line = line.replace('\n', '')
    arr = line.split(',')
    m = {}
    for i, v in enumerate(arr):
        key = keynames[i]
        m[key] = v
    return m


itemdefs = []
keynames = []
for line in sys.stdin:
    keynames = createKeyNames(line)
    break
for line in sys.stdin:
    itemdefs += [parseLine(keynames, line)]
print('keynames:\n\t', keynames)
print('objects:')
for item in itemdefs:
    print('\t', item)
    


