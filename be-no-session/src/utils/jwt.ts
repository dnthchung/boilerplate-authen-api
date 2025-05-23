// //path: be/src/constants/jwt.ts
// import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
// import Audience from "../constants/audience";
// import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
// import { UserDocument } from "../models/user.model";
// // import { SessionDocument } from "../models/session.model";

// export type RefreshTokenPayload = {
//   sessionId: SessionDocument["_id"];
// };

// export type AccessTokenPayload = {
//   userId: UserDocument["_id"];
//   sessionId: SessionDocument["_id"];
// };

// type SignOptionsAndSecret = SignOptions & {
//   secret: string;
// };

// const defaults: SignOptions = {
//   audience: [Audience.User],
// };

// // Thiết lập thời gian hết hạn cho AccessToken (15 phút)
// const accessTokenSignOptions: SignOptionsAndSecret = {
//   expiresIn: "30s", // AccessToken hết hạn sau 15 phút
//   secret: JWT_SECRET,
// };

// // Thiết lập thời gian hết hạn cho RefreshToken (30 ngày)
// export const refreshTokenSignOptions: SignOptionsAndSecret = {
//   expiresIn: "30d", // RefreshToken hết hạn sau 30 ngày
//   secret: JWT_REFRESH_SECRET,
// };

// // Hàm ký token
// export const signToken = (
//   payload: AccessTokenPayload | RefreshTokenPayload,
//   options?: SignOptionsAndSecret
// ) => {
//   const { secret, ...signOpts } = options || accessTokenSignOptions;
//   return jwt.sign(payload, secret, {
//     ...defaults,
//     ...signOpts,
//   });
// };

// // Hàm xác thực token
// export const verifyToken = <TPayload extends object = AccessTokenPayload>(
//   token: string,
//   options?: VerifyOptions & {
//     secret?: string;
//   }
// ) => {
//   const { secret = JWT_SECRET, ...verifyOpts } = options || {};
//   try {
//     const payload = jwt.verify(token, secret, {
//       ...defaults,
//       ...verifyOpts,
//     }) as TPayload;
//     return {
//       payload,
//     };
//   } catch (error: any) {
//     return {
//       error: error.message,
//     };
//   }
// };
// path: be/src/constants/jwt.ts

import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
import Audience from "../constants/audience";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { UserDocument } from "../models/user.model";

// Định nghĩa payload cho RefreshToken chỉ chứa userId
export type RefreshTokenPayload = {
  userId: UserDocument["_id"];
};

// Định nghĩa payload cho AccessToken chỉ chứa userId
export type AccessTokenPayload = {
  userId: UserDocument["_id"];
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: [Audience.User],
};

// Thiết lập thời gian hết hạn cho AccessToken (ví dụ 30 giây)
const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "3000s",
  secret: JWT_SECRET,
};

// Thiết lập thời gian hết hạn cho RefreshToken (ví dụ 30 ngày)
export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

// Hàm ký token
export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts,
  });
};

// Hàm xác thực token
export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & {
    secret?: string;
  }
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOpts,
    }) as TPayload;
    return { payload };
  } catch (error: any) {
    return { error: error.message };
  }
};
