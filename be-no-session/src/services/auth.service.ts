// // ==================== Imports ====================

// // 1. Constants
// import { APP_ORIGIN } from "../constants/env";
// import { Role, RoleType } from "../constants/role";
// import {
//   CONFLICT,
//   INTERNAL_SERVER_ERROR,
//   NOT_FOUND,
//   TOO_MANY_REQUESTS,
//   UNAUTHORIZED,
//   UNPROCESSABLE_CONTENT,
// } from "../constants/http";
// import VerificationCodeType from "../constants/verificationCodeType";

// // 2. Models
// import SessionModel, { SessionDocument } from "../models/session.model";
// import UserModel, { UserDocument } from "../models/user.model";
// import VerificationCodeModel from "../models/verificationCode.model";

// // 3. Utils
// import appAssert from "../utils/appAssert";
// import { hashValue } from "../utils/bcrypt";
// import {
//   ONE_DAY_MS,
//   fiveMinutesAgo,
//   oneHourFromNow,
//   oneYearFromNow,
//   thirtyDaysFromNow,
// } from "../utils/date";
// import {
//   getPasswordResetTemplate,
//   getVerifyEmailTemplate,
// } from "../utils/emailTemplates";
// import {
//   RefreshTokenPayload,
//   refreshTokenSignOptions,
//   signToken,
//   verifyToken,
// } from "../utils/jwt";
// import { sendMail } from "../utils/sendMail";

// // ==================== Types ====================
// type CreateAccountParams = {
//   email: string;
//   password: string;
//   role: RoleType;
//   userAgent?: string;
// };

// type LoginParams = {
//   email: string;
//   password: string;
//   userAgent?: string;
// };

// type ResetPasswordParams = {
//   password: string;
//   verificationCode: string;
// };

// // ==================== Functions ====================

// /**
//  * Tạo tài khoản người dùng mới, gửi email xác thực và tạo session.
//  */
// export const createAccount = async (data: CreateAccountParams) => {
//   // Kiểm tra email đã tồn tại hay chưa
//   const existingUser = await UserModel.exists({ email: data.email });
//   appAssert(!existingUser, CONFLICT, "Email already in use");

//   // Tạo user
//   const user = await UserModel.create({
//     email: data.email,
//     password: data.password,
//     role: data.role,
//   });

//   // Tạo mã xác thực email
//   const verificationCode = await VerificationCodeModel.create({
//     userId: user._id,
//     type: VerificationCodeType.EmailVerification,
//     expiresAt: oneYearFromNow(),
//   });
//   const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;

//   // Gửi email xác thực (bỏ qua lỗi nếu có)
//   const { error } = await sendMail({
//     to: user.email,
//     ...getVerifyEmailTemplate(url),
//   });
//   if (error) console.error(error);

//   // Tạo session mới
//   const session = await SessionModel.create({
//     userId: user._id,
//     userAgent: data.userAgent,
//   });

//   // Tạo token
//   const refreshToken = signToken(
//     { sessionId: session._id },
//     refreshTokenSignOptions
//   );
//   const accessToken = signToken({
//     userId: user._id,
//     sessionId: session._id,
//   });

//   return {
//     user: user.omitPassword(),
//     accessToken,
//     refreshToken,
//   };
// };

// /**
//  * Đăng nhập người dùng bằng email và password, tạo session và trả về token.
//  */
// export const loginUser = async ({
//   email,
//   password,
//   userAgent,
// }: LoginParams) => {
//   const user = await UserModel.findOne({ email });
//   appAssert(user, UNAUTHORIZED, "Invalid email or password");

//   const isValid = await user.comparePassword(password);
//   appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

//   const session = await SessionModel.create({
//     userId: user._id,
//     userAgent,
//   });

//   // Tạo token
//   const refreshToken = signToken(
//     { sessionId: session._id },
//     refreshTokenSignOptions
//   );
//   const accessToken = signToken({
//     userId: user._id,
//     sessionId: session._id,
//   });

//   return {
//     user: user.omitPassword(),
//     accessToken,
//     refreshToken,
//   };
// };

// /**
//  * Xác thực email của người dùng thông qua mã xác thực.
//  */
// export const verifyEmail = async (code: string) => {
//   const validCode = await VerificationCodeModel.findOne({
//     _id: code,
//     type: VerificationCodeType.EmailVerification,
//     expiresAt: { $gt: new Date() },
//   });
//   appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

//   const updatedUser = await UserModel.findByIdAndUpdate(
//     validCode.userId,
//     { verified: true },
//     { new: true }
//   );
//   appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

//   await validCode.deleteOne();

//   return {
//     user: updatedUser.omitPassword(),
//   };
// };

// /**
//  * Refresh lại access token cho người dùng, nếu phiên sắp hết hạn thì cấp refresh token mới.
//  */
// export const refreshUserAccessToken = async (refreshToken: string) => {
//   const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
//     secret: refreshTokenSignOptions.secret,
//   });
//   appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

//   const session = await SessionModel.findById(payload.sessionId);
//   const now = Date.now();
//   appAssert(
//     session && session.expiresAt.getTime() > now,
//     UNAUTHORIZED,
//     "Session expired"
//   );

//   // Nếu session sắp hết hạn (< 24h), gia hạn thêm
//   const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
//   if (sessionNeedsRefresh) {
//     session.expiresAt = thirtyDaysFromNow();
//     await session.save();
//   }

//   // Nếu gia hạn session, cấp refresh token mới
//   const newRefreshToken = sessionNeedsRefresh
//     ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
//     : undefined;

//   // Tạo access token mới
//   const accessToken = signToken({
//     userId: session.userId,
//     sessionId: session._id,
//   });

//   return {
//     accessToken,
//     newRefreshToken,
//   };
// };

// /**
//  * Gửi email đặt lại mật khẩu; giới hạn số lần gửi trong một khoảng thời gian.
//  */
// export const sendPasswordResetEmail = async (email: string) => {
//   try {
//     const user = await UserModel.findOne({ email });
//     appAssert(user, NOT_FOUND, "User not found");

//     // Giới hạn 2 email / 5 phút
//     const fiveMinAgoTime = fiveMinutesAgo();
//     const count = await VerificationCodeModel.countDocuments({
//       userId: user._id,
//       type: VerificationCodeType.PasswordReset,
//       createdAt: { $gt: fiveMinAgoTime },
//     });
//     appAssert(
//       count <= 1,
//       TOO_MANY_REQUESTS,
//       "Too many requests, please try again later"
//     );

//     // Tạo mã reset
//     const expiresAt = oneHourFromNow();
//     const verificationCode = await VerificationCodeModel.create({
//       userId: user._id,
//       type: VerificationCodeType.PasswordReset,
//       expiresAt,
//     });

//     const url = `${APP_ORIGIN}/password/reset?code=${
//       verificationCode._id
//     }&exp=${expiresAt.getTime()}`;
//     const { data, error } = await sendMail({
//       to: email,
//       ...getPasswordResetTemplate(url),
//     });

//     appAssert(
//       data?.id,
//       INTERNAL_SERVER_ERROR,
//       `${error?.name} - ${error?.message}`
//     );
//     return {
//       url,
//       emailId: data.id,
//     };
//   } catch (error: any) {
//     // Luôn trả về thành công để tránh lộ thông tin nhạy cảm
//     console.log("SendPasswordResetError:", error.message);
//     return {};
//   }
// };

// /**
//  * Đặt lại mật khẩu cho người dùng khi có mã xác thực hợp lệ.
//  */
// export const resetPassword = async ({
//   verificationCode,
//   password,
// }: ResetPasswordParams) => {
//   const validCode = await VerificationCodeModel.findOne({
//     _id: verificationCode,
//     type: VerificationCodeType.PasswordReset,
//     expiresAt: { $gt: new Date() },
//   });
//   appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

//   const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
//     password: await hashValue(password),
//   });
//   appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password");

//   // Xoá mã xác thực sau khi dùng
//   await validCode.deleteOne();

//   // Xoá tất cả session hiện có của user
//   await SessionModel.deleteMany({ userId: validCode.userId });

//   return { user: updatedUser.omitPassword() };
// };

// ==================== Imports ====================

// 1. Constants
import { APP_ORIGIN } from "../constants/env";
import { Role, RoleType } from "../constants/role";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
  UNPROCESSABLE_CONTENT,
} from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeType";

// 2. Models
// Đã loại bỏ SessionModel vì không còn sử dụng session
import UserModel, { UserDocument } from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";

// 3. Utils
import appAssert from "../utils/appAssert";
import { hashValue } from "../utils/bcrypt";
import { fiveMinutesAgo, oneHourFromNow, oneYearFromNow } from "../utils/date";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplates";
import { refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
import { sendMail } from "../utils/sendMail";

// ==================== Types ====================
type CreateAccountParams = {
  email: string;
  password: string;
  role: RoleType;
  userAgent?: string;
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

// ==================== Functions ====================

/**
 * Tạo tài khoản người dùng mới, gửi email xác thực và trả về token.
 */
export const createAccount = async (data: CreateAccountParams) => {
  // Kiểm tra email đã tồn tại hay chưa
  const existingUser = await UserModel.exists({ email: data.email });
  appAssert(!existingUser, CONFLICT, "Email already in use");

  // Tạo user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
    role: data.role,
  });

  // Tạo mã xác thực email
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });
  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;

  // Gửi email xác thực (bỏ qua lỗi nếu có)
  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });
  if (error) console.error(error);

  // Tạo token trực tiếp dựa trên user, không tạo session
  const refreshToken = signToken({ userId: user._id }, refreshTokenSignOptions);
  const accessToken = signToken({ userId: user._id });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

/**
 * Đăng nhập người dùng bằng email và password, trả về token.
 */
export const loginUser = async ({ email, password }: LoginParams) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  // Tạo token trực tiếp dựa trên user, không tạo session
  const refreshToken = signToken({ userId: user._id }, refreshTokenSignOptions);
  const accessToken = signToken({ userId: user._id });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

/**
 * Xác thực email của người dùng thông qua mã xác thực.
 */
export const verifyEmail = async (code: string) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    { verified: true },
    { new: true }
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

  await validCode.deleteOne();

  return {
    user: updatedUser.omitPassword(),
  };
};

/**
 * Refresh lại access token cho người dùng.
 */
export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload && payload.userId, UNAUTHORIZED, "Invalid refresh token");

  const user = await UserModel.findById(payload.userId);
  appAssert(user, UNAUTHORIZED, "User not found");

  // Tạo access token mới và cấp refresh token mới
  const accessToken = signToken({ userId: user._id });
  const newRefreshToken = signToken(
    { userId: user._id },
    refreshTokenSignOptions
  );

  return {
    accessToken,
    newRefreshToken,
  };
};

/**
 * Gửi email đặt lại mật khẩu; giới hạn số lần gửi trong một khoảng thời gian.
 */
export const sendPasswordResetEmail = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    appAssert(user, NOT_FOUND, "User not found");

    // Giới hạn 2 email / 5 phút
    const fiveMinAgoTime = fiveMinutesAgo();
    const count = await VerificationCodeModel.countDocuments({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      createdAt: { $gt: fiveMinAgoTime },
    });
    appAssert(
      count <= 1,
      TOO_MANY_REQUESTS,
      "Too many requests, please try again later"
    );

    // Tạo mã reset
    const expiresAt = oneHourFromNow();
    const verificationCode = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      expiresAt,
    });

    const url = `${APP_ORIGIN}/password/reset?code=${
      verificationCode._id
    }&exp=${expiresAt.getTime()}`;
    const { data, error } = await sendMail({
      to: email,
      ...getPasswordResetTemplate(url),
    });

    appAssert(
      data?.id,
      INTERNAL_SERVER_ERROR,
      `${error?.name} - ${error?.message}`
    );
    return {
      url,
      emailId: data.id,
    };
  } catch (error: any) {
    // Luôn trả về thành công để tránh lộ thông tin nhạy cảm
    console.log("SendPasswordResetError:", error.message);
    return {};
  }
};

/**
 * Đặt lại mật khẩu cho người dùng khi có mã xác thực hợp lệ.
 */
export const resetPassword = async ({
  verificationCode,
  password,
}: ResetPasswordParams) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password),
  });
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password");

  // Xoá mã xác thực sau khi dùng
  await validCode.deleteOne();

  // Không cần xoá session vì không sử dụng session trong authen flow
  // await SessionModel.deleteMany({ userId: validCode.userId });

  return { user: updatedUser.omitPassword() };
};
