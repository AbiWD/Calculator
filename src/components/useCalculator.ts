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

  const handleClick = (value: string) => {
    if (!isNaN(Number(value))) {
      setInput((prev) => prev + value);
    } else if (value === ".") {
      if (!input.includes(".")) setInput((prev) => prev + ".");
    } else if (value === "AC") {
      setInput("");
      setResult(null);
      setOperator(null);
      setFirstOperand(null);
      setExpression("");
    } else if (value === "⌫") {
      setInput((prev) => prev.slice(0, -1));
    } else if (value === "=") {
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
    } else if (["+", "-", "*", "/"].includes(value)) {
      if (input === "") return;
      const currentOperand = Number(input);
      setFirstOperand(currentOperand);
      const internalOperator =
        value === "*" ? "x" : value === "/" ? "÷" : value;
      setOperator(value as Operator);
      setInput("");
      setExpression(`${currentOperand} ${internalOperator}`);
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
