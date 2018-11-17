import sys
import random


def infoTable(table):
    print('Table Info:')
    for i, v in enumerate(table):
        print('\tlevel {0} : number of nodes = {1}'.format(i, len(v)))

        
def displayTable(table):
    for row in table:
        print(row)


def makeTable(levels, minNodesPerLevel, maxNodesPerLevel):
    table = []
    startNode = (0, [])
    table += [[startNode]]
    for levelIndex in range(1, levels+1):
        numNodes = random.randint(minNodesPerLevel, maxNodesPerLevel)
        nodes = []
        for i in range(numNodes):
            nodes.append((levelIndex, []))
        table += [nodes]
    finalNode = (len(table), [])
    table += [[finalNode]]
    return table


def addConnections(table, maxDegree):
    pass


levels = 3
minNodes = 3
maxNodes = 9
startDegree = 4
exitDegree = 4

table = makeTable(levels, minNodes, maxNodes)
infoTable(table)
displayTable(table)


