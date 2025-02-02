// import { z } from "zod";
// import { NOT_FOUND, OK } from "../constants/http";
// import SessionModel from "../models/session.model";
// import catchErrors from "../utils/catchErrors";
// import appAssert from "../utils/appAssert";

// export const getSessionsHandler = catchErrors(async (req, res) => {
//   const sessions = await SessionModel.find(
//     {
//       userId: req.userId,
//       expiresAt: { $gt: Date.now() },
//     },
//     {
//       _id: 1,
//       userAgent: 1,
//       createdAt: 1,
//     },
//     {
//       sort: { createdAt: -1 },
//     }
//   );

//   return res.status(OK).json(
//     // mark the current session
//     sessions.map((session) => ({
//       ...session.toObject(),
//       ...(session.id === req.sessionId && {
//         isCurrent: true,
//       }),
//     }))
//   );
// });

// export const deleteSessionHandler = catchErrors(async (req, res) => {
//   const sessionId = z.string().parse(req.params.id);
//   const deleted = await SessionModel.findOneAndDelete({
//     _id: sessionId,
//     userId: req.userId,
//   });
//   appAssert(deleted, NOT_FOUND, "Session not found");
//   return res.status(OK).json({ message: "Session removed" });
// });

import { NOT_FOUND, OK } from "../constants/http";
import catchErrors from "../utils/catchErrors";

// Vì chúng ta đã loại bỏ session khỏi auth flow nên không cần truy xuất hay xoá session.
// Ta có thể trả về dữ liệu rỗng hoặc thông báo rằng chức năng này đã bị vô hiệu hóa.

export const getSessionsHandler = catchErrors(async (req, res) => {
  // Trả về danh sách session rỗng vì không còn lưu trữ session nào
  return res.status(OK).json([]);
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
  // Không có session để xoá, nên trả về thông báo thích hợp
  return res.status(OK).json({ message: "Session management is disabled." });
});
