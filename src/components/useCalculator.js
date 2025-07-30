// src/components/useCalculator.ts
import { useState } from "react";
import { Calculator as CalculatorLogic } from "../logic/calculator";
export const useCalculator = () => {
    const [input, setInput] = useState("");
    const [result, setResult] = useState(null);
    const [operator, setOperator] = useState(null);
    const [firstOperand, setFirstOperand] = useState(null);
    const [expression, setExpression] = useState("");
    const calculator = new CalculatorLogic();
    const handleClick = (value) => {
        if (!isNaN(Number(value))) {
            setInput((prev) => prev + value);
        }
        else if (value === ".") {
            if (!input.includes("."))
                setInput((prev) => prev + ".");
        }
        else if (value === "AC") {
            setInput("");
            setResult(null);
            setOperator(null);
            setFirstOperand(null);
            setExpression("");
        }
        else if (value === "⌫") {
            setInput((prev) => prev.slice(0, -1));
        }
        else if (value === "=") {
            if (operator && firstOperand !== null && input !== "") {
                try {
                    const secondOperand = Number(input);
                    calculator.set(firstOperand);
                    const newResult = calculator.calculate(operator, secondOperand);
                    setResult(newResult);
                    setExpression(`${firstOperand} ${getDisplayOperator(operator)} ${input} =`);
                    setInput("");
                    setFirstOperand(newResult);
                    setOperator(null);
                }
                catch (err) {
                    if (err instanceof Error) {
                        setInput("Err");
                    }
                }
            }
        }
        else if (["+", "-", "*", "/"].includes(value)) {
            if (input === "")
                return;
            const currentOperand = Number(input);
            setFirstOperand(currentOperand);
            const internalOperator = value === "*" ? "x" : value === "/" ? "÷" : value;
            setOperator(value);
            setInput("");
            setExpression(`${currentOperand} ${internalOperator}`);
        }
    };
    const getDisplayValue = () => {
        if (input)
            return input;
        if (result !== null)
            return result.toString();
        if (firstOperand !== null && operator)
            return firstOperand.toString();
        return "0";
    };
    const getDisplayOperator = (op) => {
        if (!op)
            return "";
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
