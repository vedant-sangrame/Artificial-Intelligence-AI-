# Linear Regression with Graph (VS Code)
import matplotlib.pyplot as plt
# Data (Pizza size vs price)
x = [8, 10, 12]
y = [10, 13, 16]
# Mean
mean_x = sum(x) / len(x)
mean_y = sum(y) / len(y)
# Calculate slope (m)
num = sum((x[i] - mean_x) * (y[i] - mean_y) for i in range(len(x)))
den = sum((x[i] - mean_x) ** 2 for i in range(len(x)))
m = num / den
# Calculate intercept (b)
b = mean_y - (m * mean_x)
# Prediction
x_new = 20
y_pred = m * x_new + b
# Print results
print("Slope (m):", m)
print("Intercept (b):", b)
print("Predicted price:", y_pred)
# Plot graph
plt.scatter(x, y)
plt.plot(x, [m*i + b for i in x])
# Mark predicted point
plt.scatter(x_new, y_pred)
plt.xlabel("Pizza Size")
plt.ylabel("Price")
plt.title("Linear Regression")
plt.show()