// //path : be-no-session/src/index.ts
// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import connectToDatabase from "./config/db";
// import errorHandler from "./middleware/errorHandler";
// import authenticate from "./middleware/authenticate";
// import authRoutes from "./routes/auth.route";
// import userRoutes from "./routes/user.route";
// import sessionRoutes from "./routes/session.route";
// import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";

// const app = express();

// // add middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     //multiple domains
//     origin: APP_ORIGIN,
//     credentials: true,
//   })
// );
// app.use(cookieParser());

// // health check
// app.get("/", (_, res) => {
//   return res.status(200).json({
//     status: "healthy",
//   });
// });

// // auth routes
// app.use("/auth", authRoutes);

// // protected routes
// app.use("/user", authenticate, userRoutes);
// app.use("/sessions", authenticate, sessionRoutes);

// // error handler
// app.use(errorHandler);

// app.listen(PORT, async () => {
//   console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
//   await connectToDatabase();
// });

import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";
import errorHandler from "./middleware/errorHandler";
import authenticate from "./middleware/authenticate";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import sessionRoutes from "./routes/session.route";
import { NODE_ENV, PORT } from "./constants/env";

const app = express();

// Lấy danh sách các APP_ORIGIN từ process.env
const allowedOrigins = Object.keys(process.env)
  .filter((key) => key.startsWith("APP_ORIGIN"))
  .map((key) => process.env[key])
  .filter((value): value is string => typeof value === "string");

console.log("Allowed Origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/", (_, res) => {
  return res.status(200).json({ status: "healthy" });
});

// Auth routes
app.use("/auth", authRoutes);

// Protected routes
app.use("/user", authenticate, userRoutes);
app.use("/sessions", authenticate, sessionRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
