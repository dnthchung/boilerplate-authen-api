import { Response, ErrorRequestHandler } from "express";
import { z } from "zod";
import AppError from "../utils/AppError";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { REFRESH_PATH, clearAuthCookies } from "../utils/cookies";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  return res.status(BAD_REQUEST).json({
    errors,
    message: error.message,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

//custom error handler
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // console.log(`PATH => ${req.path}`, error);
  console.log(
    `[PATH: ${req.path}] =>`,
    `Error Message: ${error.message} =>`,
    error.stack.split("\n")[1]
  );
  //result : PATH /user Not authorized at appAssert (D:\Workspace\Github_folder\boilerplate-authen-api\be\src\utils\appAssert.ts:20:24)
  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }

  if (error instanceof AppError) {
    return handleAppError(res, error);
  }

  return res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
};

export default errorHandler;
