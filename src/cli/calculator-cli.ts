// src/calculator-cli.ts
import readline from "readline";
import { Calculator, Operator } from "./calculator";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const calculator = new Calculator();

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function runCLI() {
  console.log(`\n🧮 Welcome to Abhii's Calculator CLI`);
  console.log(`💡 Type "exit" anytime to quit\n`);

  while (true) {
    try {
      const input1 = await ask("👉 Enter first number: ");
      if (input1.trim().toLowerCase() === "exit") break;
      const num1 = Number(input1);
      if (isNaN(num1)) {
        console.log("❌ Invalid number.\n");
        continue;
      }

      const operator = (await ask(
        "➕ Choose operator (+, -, *, /): "
      )) as Operator;
      if (operator.trim().toLowerCase() === "exit") break;
      if (!["+", "-", "*", "/"].includes(operator)) {
        console.log("❌ Invalid operator.\n");
        continue;
      }

      const input2 = await ask("👉 Enter second number: ");
      if (input2.trim().toLowerCase() === "exit") break;
      const num2 = Number(input2);
      if (isNaN(num2)) {
        console.log("❌ Invalid number.\n");
        continue;
      }

      const result = Calculator.perform(num1, operator, num2);
      const operation = `${num1} ${operator} ${num2} = ${result}`;
      calculator.set(result); // update internal result
      console.log(`✅ Result: ${result}\n`);
      calculator.getHistory().push(operation);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(`💥 Error: ${err.message}\n`);
      } else {
        console.log("💥 An unknown error occurred.\n");
      }
    }
  }

  console.log("\n📜 Final History:");
  calculator
    .getHistory()
    .forEach((entry, i) => console.log(` ${i + 1}. ${entry}`));
  console.log("\n👋 Exiting. Thanks for calculating with style, Abhii!");
  rl.close();
}

runCLI();
