const isAlphabetCharacter = (input: string, index: number): boolean => {
  return ((input.charCodeAt(index) >= 97 && input.charCodeAt(index) <= 122)
    // or uppercase letter
    || (input.charCodeAt(index) >= 65 && input.charCodeAt(index) <= 90)
    // or underscore
    || input[index] === "_");
};

const isNumberCharacter = (input: string, index: number): boolean => {
  return input.charCodeAt(index) >= 48 && input.charCodeAt(index) <= 57;
};

const breakChars: Set<string> = new Set([" ", "\t", "\n", "\r"]);

const keywords: Record<string, string> = {
  if: "IF",
  else: "ELSE",
  for: "FOR",
  fn: "FN",
  return: "RETURN",
  true: "TRUE",
  false: "FALSE",
};

const twoCharOperators: Record<string, string> = {
  "==": "EQUAL_EQUAL",
  "!=": "BANG_EQUAL",
  ">=": "GREATER_EQUAL",
  "<=": "LESS_EQUAL",
  "&&": "AND_AND",
  "||": "OR_OR",
};

const oneCharOperators: Record<string, string> = {
  "=": "EQUAL",
  "+": "PLUS",
  "-": "MINUS",
  "*": "STAR",
  "/": "SLASH",
  "%": "PERCENT",
  "<": "LESS",
  ">": "GREATER",
  "!": "BANG",
};


const punctuationChars: Record<string, string> = {
  "(": "LEFT_PAREN",
  ")": "RIGHT_PAREN",
  "{": "LEFT_BRACE",
  "}": "RIGHT_BRACE",
  "[": "LEFT_BRACKET",
  "]": "RIGHT_BRACKET",
  ",": "COMMA",
  ";": "SEMICOLON",
};

const booleans: Set<string> = new Set(["true", "false"]);

export function lexer(input: string) {
  const tokens: { type: string, value?: string }[] = [];

  let currIndex = 0;
  while (currIndex < input.length) {
    const currChar = input[currIndex];
    // whitespace - skip
    if (breakChars.has(currChar)) {
      currIndex += 1;
      continue;
    }

    const twoChars = input.slice(currIndex, currIndex + 2);
    // comments - skip
    if (twoChars === "//") {
      // skip until end of line
      while (currIndex < input.length && input[currIndex] !== "\n") {
        currIndex += 1;
      }
      continue;
    }
    // two char operators - check before one char operators
    if (twoCharOperators[twoChars]) {
      tokens.push({ type: twoCharOperators[twoChars], value: twoChars });
      currIndex += 2;
      continue;
    }

    // one char operators
    if (oneCharOperators[currChar]) {
      tokens.push({ type: oneCharOperators[currChar], value: currChar });
      currIndex += 1;
      continue;
    }

    // punctuation
    if (punctuationChars[currChar]) {
      tokens.push({ type: punctuationChars[currChar], value: currChar });
      currIndex += 1;
      continue;
    }

    // number
    if (isNumberCharacter(input, currIndex)) {
      // get the rest of the number
      const startIdx = currIndex;
      while (isNumberCharacter(input, currIndex)) {
        currIndex += 1;
        // break if we reach the end of the file
        if (currIndex >= input.length) {
          break;
        }
      }
      const entireNum = input.slice(startIdx, currIndex);

      tokens.push({ type: "NUMBER", value: entireNum });
    }

    // strings
    else if (currChar === '"') {
      const startIdx = currIndex
      // move past the opening quote
      currIndex += 1;

      // while not closing quote
      while (input[currIndex] !== '"') {
        currIndex += 1;
        if (currIndex >= input.length) {
          // error since no closing quote
          throw new Error("Unexpected end of file");
        }
      }

      // if there is content between the quotes
      if (startIdx + 1 <= currIndex - 1) {
        const entireString = input.slice(startIdx + 1, currIndex);

        tokens.push({ type: "STRING", value: entireString })
      }
      // else push empty string
      else {
        tokens.push({ type: "STRING", value: "" });
      }

      // move past the closing quote
      currIndex += 1;
    }

    // identifiers
    else if (isAlphabetCharacter(input, currIndex)) {
      const startIdx = currIndex;
      currIndex += 1;
      // while letter, number, or _
      while (isAlphabetCharacter(input, currIndex) || isNumberCharacter(input, currIndex) || input[currIndex] === "_") {
        currIndex += 1;
        if (currIndex >= input.length) {
          break;
        }
      }
      const entireIdent = input.slice(startIdx, currIndex);

      // booleans
      if (booleans.has(entireIdent)) {
        tokens.push({ type: "BOOLEAN", value: entireIdent });
        continue;
      }

      const tokenType = keywords[entireIdent] ?? "IDENTIFIER";
      tokens.push({ type: tokenType, value: entireIdent })
    }

    // else unexpected char throw error
    else {
      throw new Error("Unexpected character");
    }
  }
  tokens.push({ type: "EOF", value: undefined });
  return tokens;
}