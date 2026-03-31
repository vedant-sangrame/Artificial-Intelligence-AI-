from collections import deque
def solve_water_jug(cap_x, cap_y, target):
    start_state = (0, 0)
    visited = set()
    queue = deque([(start_state, [])])
    while queue:
        (curr_x, curr_y), path = queue.popleft()
        if curr_x == target:
            return path + [(curr_x, curr_y)]
        if (curr_x, curr_y) in visited:
            continue
        visited.add((curr_x, curr_y))
        rules = [
            (cap_x, curr_y, "Fill Jug 1"),
            (curr_x, cap_y, "Fill Jug 2"),
            (0, curr_y, "Empty Jug 1"),
            (curr_x, 0, "Empty Jug 2"),
            (curr_x - min(curr_x, cap_y - curr_y), 
             curr_y + min(curr_x, cap_y - curr_y), "Pour Jug 1 into Jug 2"),
            (curr_x + min(curr_y, cap_x - curr_x), 
             curr_y - min(curr_y, cap_x - curr_x), "Pour Jug 2 into Jug 1")
        ]
        for next_x, next_y, msg in rules:
            if (next_x, next_y) not in visited:
                queue.append(((next_x, next_y), path + [(curr_x, curr_y, msg)]))
    return None
j1 = int(input("Enter capacity of Jug 1: "))
j2 = int(input("Enter capacity of Jug 2: "))
t = int(input("Enter target amount: "))
solution = solve_water_jug(j1, j2, t)
if solution:
    print(f"\nSteps to get {t} gallons:")
    for x, y, msg in solution[:-1]:
        print(f"({x}, {y}) -> {msg}")
    print(f"Final State: {solution[-1]}")
else:
    print("No solution possible with these inputs.")
