import { readFileSync } from "node:fs";
import { lexer } from "../lexer.ts";

const code = readFileSync("tests/code-example-1.txt", "utf8");
const tokens = lexer(code);

console.log(JSON.stringify(tokens, null, 2));