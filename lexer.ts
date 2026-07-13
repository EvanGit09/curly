const tokens = [];

export function lexer(input: string) {
  let currIndex = 0;
  while (currIndex < input.length) {
    const currChar = input[currIndex]
    // whitespace - skip
    if (currChar === " ") {
      currIndex += 1
      continue;
    }

    // comments - skip
    if (currChar === "/") {
      // if index+1 also equals / then its a comment
      if (currIndex + 1 < input.length && input[currIndex + 1]) {
        // skip until end of line
        while (currIndex < input.length && input[currIndex] !== "\n") {
          currIndex += 1
        }
      }
    }

    // number
    if ((typeof currChar) === "number") {
      // get the rest of the number

    }
  }
}