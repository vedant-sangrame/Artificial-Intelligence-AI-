import math

def alpha_beta_pruning(depth, node_index, maximizing_player, values, alpha, beta):
    # Base case: Leaf node reached or max depth attained
    if depth == 3:
        return values[node_index]

    if maximizing_player:
        best_eval = -math.inf
        # Evaluate child nodes (assuming a binary tree structure)
        for i in range(2):
            val = alpha_beta_pruning(depth + 1, node_index * 2 + i, 
                                     False, values, alpha, beta)
            best_eval = max(best_eval, val)
            alpha = max(alpha, best_eval)
            
            # Pruning condition: Beta cutoff
            if beta <= alpha:
                break
        return best_eval

    else:
        best_eval = math.inf
        for i in range(2):
            val = alpha_beta_pruning(depth + 1, node_index * 2 + i, 
                                     True, values, alpha, beta)
            best_eval = min(best_eval, val)
            beta = min(beta, best_eval)
            
            # Pruning condition: Alpha cutoff
            if beta <= alpha:
                break
        return best_eval

# Example usage:
if __name__ == "__main__":
    # Example leaf node values for a complete binary tree
    terminal_values = [3, 5, 6, 9, 1, 2, 0, -1]
    
    # Start pruning from root (depth 0, node index 0)
    result = alpha_beta_pruning(0, 0, True, terminal_values, -math.inf, math.inf)
    print(f"The optimal value found by Alpha-Beta Pruning is: {result}")