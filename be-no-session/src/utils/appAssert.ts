// //path : be-no-session/src/utils/appAssert.ts
// import assert from "node:assert";
// import AppError from "./AppError";
// import { HttpStatusCode } from "../constants/http";
// import appErrorCode from "../constants/appErrorCode";

// type AppAssert = (
//   condition: any,
//   httpStatusCode: HttpStatusCode,
//   message: string,
//   appErrorCode?: string
// ) => asserts condition;
// /**
//  * Asserts a condition and throws an AppError if the condition is falsy.
//  */
// const appAssert: AppAssert = (
//   condition,
//   httpStatusCode,
//   message,
//   appErrorCode
// ) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));
// export default appAssert;

// path: be-no-session/src/utils/appAssert.ts

import assert from "node:assert";
import AppError from "./AppError";
import { HttpStatusCode } from "../constants/http";
import { generateErrorCode } from "./stringHelper";

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: string
) => asserts condition;

/**
 * Kiểm tra điều kiện và ném ra AppError (bao gồm cả mã lỗi) nếu điều kiện không thỏa mãn.
 * Nếu không truyền vào appErrorCode, tự động tạo mã lỗi dựa trên message.
 */
const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode
) => {
  if (!condition) {
    throw new AppError(
      httpStatusCode,
      message,
      appErrorCode || generateErrorCode(message)
    );
  }
};

export default appAssert;
