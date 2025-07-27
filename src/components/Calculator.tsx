import React, { useState } from "react";
import { Calculator as CalculatorLogic, Operator } from "../calculator";

const Calculator: React.FC = () => {
  const buttons = [
    "AC",
    "⌫",
    "%",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "=",
  ];

  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [firstOperand, setFirstOperand] = useState<number | null>(null);

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
    } else if (value === "⌫") {
      setInput((prev) => prev.slice(0, -1));
    } else if (value === "=") {
      if (operator && firstOperand !== null && input !== "") {
        try {
          const secondOperand = Number(input);
          calculator.set(firstOperand);
          const newResult = calculator.calculate(operator, secondOperand);
          setResult(newResult);
          setInput("");
          setFirstOperand(newResult); // allow chaining
          setOperator(null); // reset operator after calculation
        } catch (err: unknown) {
          if (err instanceof Error) {
            setInput("Err");
          }
        }
      }
    } else if (["+", "-", "*", "/"].includes(value)) {
      if (input === "") return;
      setFirstOperand(Number(input));
      setOperator(value as Operator);
      setInput("");
    }
  };

  // Determine what to display
  const getDisplayValue = () => {
    if (input) return input; // Show current input if user is typing
    if (result !== null) return result.toString(); // Show result after "="
    if (firstOperand !== null) return firstOperand.toString(); // Show first operand after operator
    return "0"; // Default to 0
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xs">
        {/* Display */}
        <div className="bg-gray-100 h-24 mb-4 rounded-xl flex flex-col justify-center px-4 shadow-inner overflow-x-auto">
          <div className="text-right text-sm text-gray-500 font-mono">
            {firstOperand !== null && operator
              ? `${firstOperand} ${operator}`
              : ""}
          </div>
          <div className="text-right text-2xl text-gray-800 font-mono font-bold">
            {getDisplayValue()}
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <button
              key={btn}
              className="bg-gray-200 text-xl font-semibold py-4 rounded-xl hover:bg-gray-300 active:bg-gray-400 transition"
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
