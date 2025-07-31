import React, { useEffect } from "react";
import { useCalculator } from "./useCalculator";

const Calculator: React.FC = () => {
  const { expression, handleClick, getDisplayValue } = useCalculator();

  const buttons: string[] = [
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
    "+/-",
    "0",
    ".",
    "=",
  ];

  const getButtonStyles = (btn: string) => {
    if (["+", "-", "*", "/"].includes(btn))
      return "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700";
    if (btn === "=")
      return "bg-green-500 text-white hover:bg-green-600 active:bg-green-700";
    if (btn === "AC" || btn === "⌫")
      return "bg-red-500 text-white hover:bg-red-600 active:bg-red-700";
    if (btn === "%" || btn === "+/-")
      return "bg-yellow-400 text-white hover:bg-yellow-500 active:bg-yellow-600";
    return "bg-gray-200 hover:bg-gray-300 active:bg-gray-400";
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) handleClick(e.key);
      else if (["+", "-", "*", "/"].includes(e.key)) handleClick(e.key);
      else if (e.key === ".") handleClick(".");
      else if (e.key === "Enter") handleClick("=");
      else if (e.key === "Backspace") handleClick("⌫");
      else if (e.key === "Escape") handleClick("AC");
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleClick]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="bg-gray-100 h-32 mb-4 rounded-xl flex flex-col justify-between px-2 py-4 shadow-inner">
          <div className="text-right text-lg text-gray-600 font-mono overflow-hidden whitespace-nowrap">
            {expression}
          </div>
          <div
            className={`text-right text-5xl font-mono font-medium overflow-hidden whitespace-nowrap ${
              getDisplayValue() === "Error" ? "text-red-500" : "text-gray-800"
            }`}
          >
            {getDisplayValue()}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <button
              key={btn}
              className={`text-xl font-semibold py-4 rounded-xl transition ${getButtonStyles(
                btn
              )} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label={btn}
              onClick={() => handleClick(btn)}
            >
              {btn === "*" ? "×" : btn === "/" ? "÷" : btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
