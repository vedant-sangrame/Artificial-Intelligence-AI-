from heapq import heappush, heappop
JUG1, JUG2 = 4, 3
TARGET = 2
def heuristic(state):
    x, y = state
    return min(abs(x - TARGET), abs(y - TARGET))
def get_neighbors(state):
    x, y = state
    neighbors = []
    neighbors.append((JUG1, y))
    neighbors.append((x, JUG2))
    neighbors.append((0, y))
    neighbors.append((x, 0))
    pour = min(x, JUG2 - y)
    neighbors.append((x - pour, y + pour))
    pour = min(y, JUG1 - x)
    neighbors.append((x + pour, y - pour))
    return neighbors
def a_star():
    start = (0, 0)
    pq = []
    heappush(pq, (heuristic(start), 0, start, [start]))
    visited = set()
    while pq:
        f, g, state, path = heappop(pq)
        if state in visited:
            continue
        visited.add(state)
        x, y = state
        if x == TARGET or y == TARGET:
            return path
        for next_state in get_neighbors(state):
            if next_state not in visited:
                heappush(pq, (g + 1 + heuristic(next_state), g + 1, next_state, path + [next_state]))
    return None
solution = a_star()
print("Solution Path:")
for step in solution:
    print(step)
