def magic_square(n):
    magic = [[0] * n for _ in range(n)]

    i, j = 0, n // 2

    for num in range(1, n * n + 1):
        magic[i][j] = num

        new_i = (i - 1) % n
        new_j = (j + 1) % n

        if magic[new_i][new_j]:
            i = (i + 1) % n
        else:
            i, j = new_i, new_j

    # print with message
    print(f"\nMagic Square of order {n} (Rows = {n}, Columns = {n}):\n")

    for row in magic:
        print(" ".join(f"{num:2}" for num in row))


# input
n = int(input("Enter the no. of rows and columns (odd number only): "))
if n % 2 == 0:
    print("Magic square works only for odd numbers")
else:
    magic_square(n)