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

// // path: be-no-session/src/utils/stringHelper.ts

// /**
//  * Chuyển một chuỗi camelCase hoặc PascalCase thành dạng UPPER_CASE_SNAKE.
//  * Nếu không có input, trả về chuỗi rỗng.
//  */
// export const generateErrorCode = (input: string): string => {
//   if (!input) return "";
//   return input.replace(/(?!^)([A-Z])/g, "_$1").toUpperCase();
// };
