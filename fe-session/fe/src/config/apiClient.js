// //path : MERN-Stack-Projects/Project-3/frontend/src/config/apiClient.js
// import axios from "axios";
// import queryClient from "./queryClient";
// import { UNAUTHORIZED } from "../constants/http.mjs";
// import { navigate } from "../lib/navigation";

// const options = {
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// };

// // create a separate client for refreshing the access token
// // to avoid infinite loops with the error interceptor
// const TokenRefreshClient = axios.create(options);
// TokenRefreshClient.interceptors.response.use((response) => response.data);

// const API = axios.create(options);

// API.interceptors.response.use(
//   (response) => response.data,
//   async (error) => {
//     const { config, response } = error;
//     const { status, data } = response || {};

//     // try to refresh the access token behind the scenes
//     if (status === UNAUTHORIZED && data?.errorCode === "InvalidAccessToken") {
//       try {
//         // refresh the access token, then retry the original request
//         await TokenRefreshClient.get("/auth/refresh");
//         return TokenRefreshClient(config);
//       } catch (error) {
//         // handle refresh errors by clearing the query cache & redirecting to login
//         queryClient.clear();
//         navigate("/login", {
//           state: {
//             redirectUrl: window.location.pathname,
//           },
//         });
//       }
//     }

//     return Promise.reject({ status, ...data });
//   }
// );

// export default API;

import axios from "axios";
import { navigate } from "../lib/navigation";

const API_URL = import.meta.env.VITE_API_URL;

// Hàm logout nếu refresh token thất bại
const logoutUser = () => {
  navigate("/login", {
    state: {
      redirectUrl: window.location.pathname,
    },
  });
};

// Tạo instance Axios
const API = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Quan trọng: Để gửi cookie HttpOnly kèm request
});

// Xử lý lỗi nếu accessToken hết hạn
API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu request này đã thử refresh

      try {
        // Gọi API refresh token (FE không cần gửi gì vì token có trong HttpOnly Cookie)
        await axios.get(`${API_URL}/auth/refresh`, {
          withCredentials: true,
        });

        // Gửi lại request cũ sau khi refresh thành công
        return API(originalRequest);
      } catch (refreshError) {
        // Nếu refresh thất bại ➝ logout người dùng
        logoutUser();
      }
    }

    return Promise.reject(error);
  }
);

export default API;
