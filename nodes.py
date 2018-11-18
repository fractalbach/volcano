import sys
import random


class Node:
    def __init__(self, level):
        self.level = level
        self.connections = []

    def __repr__(self):
        return "(L{0},d{1})".format(self.level, self.degree())

    def degree(self):
        return len(self.connections)
    
    def connect(self, LocationTuple):
        self.connections += [LocationTuple]

        
        
class TreeTable:
    def __init__(self, numLevels, minNodesPerLvl, maxNodesPerLvl):
        self.table = makeTable(numLevels, minNodesPerLvl, maxNodesPerLvl)

    def __repr__(self):
        s = ""
        for row in self.table:
            s += repr(row) + '\n'
        return s

    def info(self):
        print('Table Info:')
        for i, v in enumerate(self.table):
            print('\tlevel {0} : number of nodes = {1}'.format(i, len(v)))
        
    def getFirstNode(self):
        return self.table[0][0]

    def getLastNode(self):
        lastLvl = len(table) - 1
        return self.table[lastLvl][0]

    def getNode(self, Loc):
        row, col = Loc
        return self.table[row][col]

    def connect(self, Loc1, Loc2):
        n1 = self.getNode(Loc1)
        n2 = self.getNode(Loc2)
        n1.connect(Loc1)
        n2.connect(Loc2)
        
    
def makeTable(levels, minNodesPerLevel, maxNodesPerLevel):
    table = []
    startNode = Node(0)
    table += [[startNode]]
    for levelIndex in range(1, levels+1):
        numNodes = random.randint(minNodesPerLevel, maxNodesPerLevel)
        nodes = []
        for i in range(numNodes):
            nodes.append(Node(levelIndex))
        table += [nodes]
    finalNode = Node(len(table))
    table += [[finalNode]]
    return table



# ----------------------------------------------------------------------
#  Main
# ______________________________________________________________________

levels = 3
minNodes = 3
maxNodes = 9
startDegree = 4
exitDegree = 4



tree = TreeTable(levels, minNodes, maxNodes)
tree.info()

print("Table after initial creation:")
print(tree)

print("After adding some connections:")
tree.connect([0,0], [1,1])
tree.connect([0,0], [1,2])
print(tree)
