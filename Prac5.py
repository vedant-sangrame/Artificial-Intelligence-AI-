from itertools import permutations
def solve_cryptarithmetic():
    letters = ('S', 'E', 'N', 'D', 'M', 'O', 'R', 'Y')
    digits = range(10)
    for perm in permutations(digits, len(letters)):
        mapping = dict(zip(letters, perm))
        # Constraint 1: Leading digits cannot be zero
        if mapping['S'] == 0 or mapping['M'] == 0:
            continue
        # Form numbers
        SEND = (mapping['S']*1000 +
                mapping['E']*100 +
                mapping['N']*10 +
                mapping['D'])
        MORE = (mapping['M']*1000 +
                mapping['O']*100 +
                mapping['R']*10 +
                mapping['E'])
        MONEY = (mapping['M']*10000 +
                 mapping['O']*1000 +
                 mapping['N']*100 +
                 mapping['E']*10 +
                 mapping['Y'])
        # Constraint 2: Equation must satisfy
        if SEND + MORE == MONEY:
            print("Solution Found:")
            print(mapping)
            print(f"{SEND} + {MORE} = {MONEY}")
            return
solve_cryptarithmetic()
