import { NOT_FOUND, OK } from "../constants/http";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  console.log("user");
  appAssert(user, NOT_FOUND, "User's account not found!");
  return res.status(OK).json(user.omitPassword());
});
