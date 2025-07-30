// src/components/useCalculator.ts
import { useState } from "react";
import { Calculator as CalculatorLogic, Operator } from "../logic/calculator";

export const useCalculator = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [expression, setExpression] = useState<string>("");

  const calculator = new CalculatorLogic();

  const handleNumber = (value: string) => {
    if (result !== null && operator === null && input === "") {
      setResult(null);
    }
    setInput((prev) => prev + value);
  };

  const handleDecimal = () => {
    if (!input.includes(".")) {
      setInput((prev) => prev + ".");
    }
  };

  const handleOperator = (value: Operator) => {
    const displayOp = getDisplayOperator(value);

    if (input !== "") {
      const currentOperand = Number(input);

      if (operator && firstOperand !== null) {
        // Perform previous calculation first
        calculator.set(firstOperand);
        const newResult = calculator.calculate(operator, currentOperand);
        setResult(newResult);
        setFirstOperand(newResult);
        setExpression(`${newResult} ${displayOp}`);
      } else {
        setFirstOperand(currentOperand);
        setExpression(`${currentOperand} ${displayOp}`);
      }

      setInput("");
    } else if (result !== null) {
      setFirstOperand(result);
      setExpression(`${result} ${displayOp}`);
    }

    setOperator(value);
  };

  const handleEquals = () => {
    if (operator && firstOperand !== null && input !== "") {
      try {
        const secondOperand = Number(input);
        calculator.set(firstOperand);
        const newResult = calculator.calculate(operator, secondOperand);
        setResult(newResult);
        setExpression(
          `${firstOperand} ${getDisplayOperator(operator)} ${input} =`
        );
        setInput("");
        setFirstOperand(newResult);
        setOperator(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setInput("Err");
        }
      }
    }
  };

  const handleControl = (value: "AC" | "⌫") => {
    if (value === "AC") {
      setInput("");
      setResult(null);
      setOperator(null);
      setFirstOperand(null);
      setExpression("");
    } else if (value === "⌫") {
      setInput((prev) => prev.slice(0, -1));
    }
  };

  const handlePercent = () => {
    if (input !== "") {
      const percentValue = Number(input) / 100;
      setInput(percentValue.toString());
    }
  };

  const handleNegate = () => {
    if (input !== "") {
      const negatedValue = (-1 * Number(input)).toString();
      setInput(negatedValue);
    }
  };

  const handleClick = (value: string) => {
    if (!isNaN(Number(value))) return handleNumber(value);
    if (value === ".") return handleDecimal();
    if (value === "=") return handleEquals();
    if (["+", "-", "*", "/"].includes(value))
      return handleOperator(value as Operator);
    if (value === "AC" || value === "⌫")
      return handleControl(value as "AC" | "⌫");
    if (value === "%") return handlePercent();
    if (value === "+/-") return handleNegate();
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
