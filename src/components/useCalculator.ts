import { useState } from "react";
import { Calculator as CalculatorLogic } from "../logic/calculator";

// Declare electronAPI type to satisfy TypeScript
declare global {
  interface Window {
    electronAPI: {
      saveOperation: (operation: {
        expression: string;
        result: string;
      }) => Promise<void>;
      getHistory: () => Promise<any[]>;
    };
  }
}

const electronAPI = (window as any)?.electronAPI || null;

export const useCalculator = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [expression, setExpression] = useState<string>("");

  const calculator = new CalculatorLogic();

  const handleClick = (value: string) => {
    // Number input
    if (!isNaN(Number(value))) {
      setInput((prev) => prev + value);
    }
    // Decimal point
    else if (value === ".") {
      if (!input.includes(".")) setInput((prev) => prev + ".");
    }
    // Clear all
    else if (value === "AC") {
      setInput("");
      setResult(null);
      setOperator(null);
      setFirstOperand(null);
      setExpression("");
    }
    // Backspace
    else if (value === "⌫") {
      setInput((prev) => prev.slice(0, -1));
    }
    // Percentage
    else if (value === "%") {
      if (input !== "" && !isNaN(Number(input))) {
        const num = Number(input) / 100;
        setInput(num.toString());
        if (firstOperand !== null && operator) {
          setExpression(
            `${firstOperand} ${getDisplayOperator(operator)} ${num}`
          );
        }
      }
    }
    // Negate
    else if (value === "+/-") {
      if (input !== "" && !isNaN(Number(input))) {
        const num = -Number(input);
        setInput(num.toString());
        if (firstOperand !== null && operator) {
          setExpression(
            `${firstOperand} ${getDisplayOperator(operator)} ${num}`
          );
        }
      }
    }
    // Equals
    else if (value === "=") {
      if (
        operator &&
        firstOperand !== null &&
        input !== "" &&
        !isNaN(Number(input))
      ) {
        try {
          const secondOperand = Number(input);
          if (isNaN(secondOperand)) {
            setInput("Error");
            setTimeout(() => setInput(""), 1000);
            return;
          }
          calculator.set(firstOperand);
          const newResult = calculator.calculate(operator, secondOperand);
          const exp = `${expression} ${input}`; // Use the full expression up to this point

          setResult(newResult);
          setExpression(`${exp} =`);
          setInput("");
          setFirstOperand(newResult);
          setOperator(null);

          if (electronAPI) {
            electronAPI
              .saveOperation({ expression: exp, result: String(newResult) })
              .then(() => {
                console.log("Operation saved:", exp, newResult);
              })
              .catch((err: Error) => {
                console.error("Failed to save operation to DB:", err);
              });
          }
        } catch (error: unknown) {
          setInput("Error");
          setTimeout(() => setInput(""), 1000);
        }
      }
    }
    // Operators
    else if (["+", "-", "*", "/"].includes(value)) {
      if (input === "" && result !== null) {
        // Chained operation after =
        setFirstOperand(result);
        setResult(null);
        const internalOperator =
          value === "*" ? "x" : value === "/" ? "÷" : value;
        setOperator(value as Operator);
        setInput("");
        setExpression(`${result} ${internalOperator}`);
      } else if (input !== "" && !isNaN(Number(input))) {
        const currentOperand = Number(input);
        if (firstOperand !== null && operator) {
          // Evaluate previous operation for chained calculations
          try {
            calculator.set(firstOperand);
            const newResult = calculator.calculate(operator, currentOperand);
            const exp = `${firstOperand} ${getDisplayOperator(
              operator
            )} ${currentOperand}`;
            setResult(newResult);
            setFirstOperand(newResult);
            const internalOperator =
              value === "*" ? "x" : value === "/" ? "÷" : value;
            setOperator(value as Operator);
            setInput("");
            setExpression(`${newResult} ${internalOperator}`);
            // No save here, only on =
          } catch (error: unknown) {
            setInput("Error");
            setTimeout(() => setInput(""), 1000);
            return;
          }
        } else {
          // First operator in sequence
          setFirstOperand(currentOperand);
          const internalOperator =
            value === "*" ? "x" : value === "/" ? "÷" : value;
          setOperator(value as Operator);
          setInput("");
          setExpression(`${currentOperand} ${internalOperator}`);
        }
      }
    }
  };

  const getDisplayValue = () => {
    if (input) return input;
    if (result !== null) return result.toString();
    if (firstOperand !== null && operator) return firstOperand.toString();
    return "0";
  };

  const getDisplayOperator = (op: Operator | null): string => {
    if (!op) return "";
    return op === "*" ? "x" : op === "/" ? "÷" : op;
  };

  return {
    input,
    result,
    expression,
    handleClick,
    getDisplayValue,
    getDisplayOperator,
  };
};
