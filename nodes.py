import sys
import random


class Node:
    def __init__(self, level):
        self.level = level
        self.connections = set()

    def __repr__(self):
        return "(L{0},d{1})".format(self.level, self.degree())

    def details(self):
        return "{1}".format(self.level, self.connections)

    def degree(self):
        return len(self.connections)
    
    def connect(self, LocationTuple):
        self.connections.add(LocationTuple)

        
        
class TreeTable:
    def __init__(self, numLevels, minNodesPerLvl, maxNodesPerLvl):
        self.table = makeTable(numLevels, minNodesPerLvl, maxNodesPerLvl)

    def __repr__(self):
        s = ""
        for i, row in enumerate(self.table):
            for j, node in enumerate(row):
                s+= "{0}{1}: {2}\n".format(i*'\t', j, node.details())
        return s

    def info(self):
        print('Table Info:')
        for i, v in enumerate(self.table):
            print('\tlevel {0} : number of nodes = {1}'.format(i, len(v)))

    def depth(self):
        return len(self.table)
    
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
        n1.connect(Loc2)
        n2.connect(Loc1)

    def createSinglePath(self):
        prev = (0, 0)
        for i in range(1, len(self.table)):
            nNodes = len(self.table[i]) - 1
            j = random.randint(0, nNodes)
            current = (i, j)
            self.connect(prev, current)
            prev = current

    def randConnectsThisLevel(self, node1, nConnects):
        """make random connections between nodes on the same level."""
        row, col = node1
        nNodes = len(self.table[row]) - 1
        for _ in range(nConnects):
            node2 = (row, random.randint(0, nNodes))
            if node1 != node2:
                self.connect(node1, node2)

    def createSinglePathWithDeadEnds(self, nConnects):
        prev = (0, 0)
        for i in range(1, len(self.table)):
            nNodes = len(self.table[i]) - 1
            current = (i, random.randint(0, nNodes))
            self.connect(prev, current)
            self.randConnectsThisLevel(current, nConnects)
            prev = current
    
        
    
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

levels = 5
minNodes = 3
maxNodes = 9
startDegree = 4
exitDegree = 4



tree = TreeTable(levels, minNodes, maxNodes)
tree.info()
print(tree)
tree.createSinglePathWithDeadEnds(5)
print(tree)
