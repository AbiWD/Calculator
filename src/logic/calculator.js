// src/calculator.ts
import { add } from "./addition";
import { subtract } from "./substraction";
import { multiply } from "./multiplication";
import { divide } from "./division";
/**
 * A class to manage calculator state and operations.
 */
export class Calculator {
    constructor() {
        this.currentResult = 0;
        this.history = [];
    }
    /**
     * Performs a calculation and updates the current result.
     * @param operator The operator to use.
     * @param operand The number to operate with.
     * @returns The new result.
     */
    calculate(operator, operand) {
        const operationString = `${this.currentResult} ${operator} ${operand}`;
        this.currentResult = Calculator.perform(this.currentResult, operator, operand);
        this.history.push(`${operationString} = ${this.currentResult}`);
        return this.currentResult;
    }
    /**
     * A static method to perform a one-off calculation.
     * @param a The first operand.
     * @param operator The operator.
     * @param b The second operand.
     * @returns The result of the operation.
     */
    static perform(a, operator, b) {
        switch (operator) {
            case "+":
                return add(a, b);
            case "-":
                return subtract(a, b);
            case "*":
                return multiply(a, b);
            case "/":
                return divide(a, b);
            default:
                throw new Error("Invalid operator");
        }
    }
    /**
     * Sets the current value of the calculator.
     * @param value The new value.
     */
    set(value) {
        this.currentResult = value;
        // Only add to history if it's a direct set, not part of a calculation chain
        // This might need more sophisticated logic depending on desired history behavior
        // For now, we'll let `calculate` handle history for operations.
    }
    /**
     * Clears the current result and history.
     */
    clear() {
        this.currentResult = 0;
        this.history = [];
    }
    /**
     * Gets the current result.
     * @returns The current result.
     */
    getResult() {
        return this.currentResult;
    }
    /**
     * Gets the calculation history.
     * @returns A copy of the history array.
     */
    getHistory() {
        return [...this.history];
    }
}
