import { add } from "./addition";
import { subtract } from "./substraction";
import { multiply } from "./multiplication";
import { divide } from "./division";

export type Operator = "+" | "-" | "*" | "/";

/**
 * A class to manage calculator state and operations.
 */
export class Calculator {
  private currentResult = 0;
  private history: string[] = [];

  /**
   * Performs a calculation and updates the current result.
   * @param operator The operator to use.
   * @param operand The number to operate with.
   * @returns The new result.
   */
  calculate(operator: Operator, operand: number): number {
    const operationString = `${this.currentResult} ${operator} ${operand}`;
    this.currentResult = Calculator.perform(
      this.currentResult,
      operator,
      operand
    );
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
  static perform(a: number, operator: Operator, b: number): number {
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
  set(value: number): void {
    this.currentResult = value;
    this.history.push(`Set to ${value}`);
  }

  /**
   * Clears the current result and history.
   */
  clear(): void {
    this.currentResult = 0;
    this.history = [];
  }

  /**
   * Gets the current result.
   * @returns The current result.
   */
  getResult(): number {
    return this.currentResult;
  }

  /**
   * Gets the calculation history.
   * @returns A copy of the history array.
   */
  getHistory(): string[] {
    return [...this.history];
  }
}
