//path be-no-session/src/utils/stringHelper.ts
export function generateErrorCode(input: string): string {
  if (!input) {
    return input;
  }

  let result = "";
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (i > 0 && c >= "A" && c <= "Z") {
      result += "_";
    }
    result += c.toUpperCase();
  }

  return result;
}
