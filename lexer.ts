const tokens = [];

const isAlphabetCharacter = (input: string, index: number): boolean => {
  return input.charCodeAt(index) >= 97 && input.charCodeAt(index) <= 122;
};

const isNumberCharacter = (input: string, index: number): boolean => {
  return input.charCodeAt(index) >= 48 && input.charCodeAt(index) <= 57;
};

export function lexer(input: string) {
  let currIndex = 0;
  while (currIndex < input.length) {
    const currChar = input[currIndex];
    // whitespace - skip
    if (currChar === " ") {
      currIndex += 1;
      continue;
    }

    // comments - skip
    if (currChar === "/") {
      // if index+1 also equals / then its a comment
      if (currIndex + 1 < input.length && input[currIndex + 1]) {
        // skip until end of line
        while (currIndex < input.length && input[currIndex] !== "\n") {
          currIndex += 1;
        }
      }
    }

    // number
    if (isNumberCharacter(input, currIndex)) {
      // get the rest of the number
      const startIdx = currIndex;
      while (isNumberCharacter(input, currIndex)) {
        currIndex += 1;
        // break if we reach the end of the file
        if (currIndex >= input.length) {
          // error
          throw new Error("Unexpected end of file");
        }
      }
      const entireNum = input.slice(startIdx, currIndex - 1);

      tokens.push(`NUMBER (${entireNum})`);
    }

    // identifiers
    if (isAlphabetCharacter(input, currIndex)) {
      const startIdx = currIndex;
      while (isAlphabetCharacter(input, currIndex)) {
        currIndex += 1;
        if (currIndex >= input.length) {
          throw new Error("Unexpected end of file");
        }
      }
      const entireIdent = input.slice(startIdx, currIndex - 1);

      // handle functions etc e.g. look for specific chars like ( and ) and params and { and }

      tokens.push(`IDENTIFIER (${entireIdent})`);
    }

    // strings
    if (currChar === '"') {
      const startIdx = currIndex
      while (input[currIndex] !== '"') {
        currIndex += 1;
        if (currIndex >= input.length) {
          throw new Error("Unexpected end of file");
        }
      }
      if (startIdx + 1 <= currIndex - 1) {
        const entireString = input.slice(startIdx + 1, currIndex - 1);

        tokens.push(`STRING (${entireString})`)
      }
    }

    if (currIndex >= input.length) {
      tokens.push("EOF")
      break;
    }
  }
}