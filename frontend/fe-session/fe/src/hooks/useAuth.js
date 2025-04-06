// import { useQuery } from "@tanstack/react-query";
// import { getUser } from "../lib/api";

// export const AUTH = "auth";

// const useAuth = (opts = {}) => {
//   const { data: user, ...rest } = useQuery({
//     queryKey: [AUTH],
//     queryFn: getUser,
//     staleTime: Infinity,
//     ...opts,
//   });
//   return {
//     user,
//     ...rest,
//   };
// };

// export default useAuth;

import { useQuery } from "@tanstack/react-query";
import { getUser } from "../lib/api";

export const AUTH = "auth";

const useAuth = (opts = {}) => {
  const { data: user, ...rest } = useQuery({
    queryKey: [AUTH],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5, // Cache user trong 5 phút
    retry: false, // Không retry nếu gặp lỗi 401
    ...opts,
  });

  return { user, ...rest };
};

export default useAuth;
