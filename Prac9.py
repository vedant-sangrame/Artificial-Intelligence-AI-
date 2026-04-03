# Bayes Theorem for Rain Prediction

P_cloudy = 0.40
P_rain = 0.20
P_cloudy_given_rain = 0.85

P_rain_given_cloudy = (P_rain * P_cloudy_given_rain) / P_cloudy

print("Given:")
print("P(Cloudy) =", P_cloudy)
print("P(Rain) =", P_rain)
print("P(Cloudy | Rain) =", P_cloudy_given_rain)

print("\nUsing Bayes Theorem:")

print("\nP(Rain | Cloudy) =", P_rain_given_cloudy)

print("\nIf it is cloudy, the probability that it will rain is:",
      P_rain_given_cloudy * 100, "%")