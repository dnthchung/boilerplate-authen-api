================================================
File: README.md
================================================
# boilerplate-authen-fe

================================================
File: fe/README.md
================================================
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


================================================
File: fe/index.html
================================================
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>


================================================
File: fe/package.json
================================================
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@chakra-ui/react": "2.8.2",
    "@emotion/react": "11.11.4",
    "@emotion/styled": "11.11.5",
    "@tanstack/react-query": "5.36.0",
    "@tanstack/react-query-devtools": "5.36.0",
    "axios": "1.6.8",
    "framer-motion": "11.1.9",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-router-dom": "6.23.1"
  },
  "devDependencies": {
    "@types/react": "18.2.66",
    "@types/react-dom": "18.2.22",
    "@vitejs/plugin-react": "4.2.1",
    "eslint": "8.57.0",
    "eslint-plugin-react": "7.34.1",
    "eslint-plugin-react-hooks": "4.6.0",
    "eslint-plugin-react-refresh": "0.4.6",
    "vite": "5.2.0"
  }
}


================================================
File: fe/sample.env
================================================
VITE_API_URL=http://localhost:4004

================================================
File: fe/vite.config.js
================================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})


================================================
File: fe/.eslintrc.cjs
================================================
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react/prop-types": "off",
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};


================================================
File: fe/.gitignore
================================================
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?


================================================
File: fe/src/App.jsx
================================================
import { Route, Routes, useNavigate } from "react-router-dom";
import AppContainer from "./components/AppContainer";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import { setNavigate } from "./lib/navigation";

function App() {
  // set the navigate function on our API client for use in the axios error interceptor
  // this allows us to redirect to the login page when an auth error occurs
  const navigate = useNavigate();
  setNavigate(navigate);
  return (
    <Routes>
      <Route path="/" element={<AppContainer />}>
        <Route index element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email/verify/:code" element={<VerifyEmail />} />
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/password/reset" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;


================================================
File: fe/src/main.jsx
================================================
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import theme from "./theme/index.js";
import queryClient from "./config/queryClient.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>
  </ChakraProvider>
);


================================================
File: fe/src/components/AppContainer.jsx
================================================
import { Box, Center, Spinner } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import UserMenu from "./UserMenu";

const AppContainer = () => {
  const { user, isLoading } = useAuth();

  return isLoading ? (
    <Center w="100vw" h="90vh" flexDir="column">
      <Spinner mb={4} />
    </Center>
  ) : user ? (
    <Box p={4} minH="100vh">
      <UserMenu />
      <Outlet />
    </Box>
  ) : (
    <Navigate
      to="/login"
      replace
      state={{
        redirectUrl: window.location.pathname,
      }}
    />
  );
};
export default AppContainer;


================================================
File: fe/src/components/ResetPasswordForm.jsx
================================================
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Link as ChakraLink,
  AlertIcon,
} from "@chakra-ui/react";
import { resetPassword } from "../lib/api";

const ResetPasswordForm = ({ code }) => {
  const [password, setPassword] = useState("");
  const {
    mutate: resetUserPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: resetPassword,
  });
  return (
    <>
      <Heading fontSize="4xl" mb={8}>
        Change your password
      </Heading>
      <Box rounded="lg" bg="gray.700" boxShadow="lg" p={8}>
        {isError && (
          <Box mb={3} color="red.400">
            {error.message || "An error occurred"}
          </Box>
        )}
        {isSuccess ? (
          <Box>
            <Alert status="success" borderRadius={12} mb={3}>
              <AlertIcon />
              Password updated successfully!
            </Alert>
            <ChakraLink as={Link} to="/login" replace>
              Sign in
            </ChakraLink>
          </Box>
        ) : (
          <Stack spacing={4}>
            <FormControl id="password">
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  resetUserPassword({ password, verificationCode: code })
                }
                autoFocus
              />
            </FormControl>
            <Button
              my={2}
              isLoading={isPending}
              isDisabled={password.length < 6}
              onClick={() =>
                resetUserPassword({
                  password,
                  verificationCode: code,
                })
              }
            >
              Reset Password
            </Button>
          </Stack>
        )}
      </Box>
    </>
  );
};
export default ResetPasswordForm;


================================================
File: fe/src/components/SessionCard.jsx
================================================
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import useDeleteSession from "../hooks/useDeleteSession";

const SessionCard = ({ session }) => {
  const { _id, createdAt, userAgent, isCurrent } = session;

  const { deleteSession, isPending } = useDeleteSession(_id);

  return (
    <Flex p={3} borderWidth="1px" borderRadius="md">
      <Box flex={1}>
        <Text fontWeight="bold" fontSize="sm" mb={1}>
          {new Date(createdAt).toLocaleString("en-US")}
          {isCurrent && " (current session)"}
        </Text>
        <Text color="gray.500" fontSize="xs">
          {userAgent}
        </Text>
      </Box>
      {!isCurrent && (
        <Button
          size="sm"
          variant="ghost"
          ml={4}
          alignSelf="center"
          fontSize="xl"
          color="red.400"
          title="Delete Session"
          onClick={deleteSession}
          isLoading={isPending}
        >
          &times;
        </Button>
      )}
    </Flex>
  );
};
export default SessionCard;


================================================
File: fe/src/components/UserMenu.jsx
================================================
import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/api";

const UserMenu = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  return (
    <Menu isLazy placement="right-start">
      <MenuButton position="absolute" left="1.5rem" bottom="1.5rem">
        <Avatar src="#" />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => navigate("/")}>Profile</MenuItem>
        <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
        <MenuItem onClick={signOut}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};
export default UserMenu;


================================================
File: fe/src/config/apiClient.js
================================================
//path : MERN-Stack-Projects/Project-3/frontend/src/config/apiClient.js
import axios from "axios";
import queryClient from "./queryClient";
import { UNAUTHORIZED } from "../constants/http.mjs";
import { navigate } from "../lib/navigation";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

// create a separate client for refreshing the access token
// to avoid infinite loops with the error interceptor
const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const API = axios.create(options);

API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error;
    const { status, data } = response || {};

    // try to refresh the access token behind the scenes
    if (status === UNAUTHORIZED && data?.errorCode === "InvalidAccessToken") {
      try {
        // refresh the access token, then retry the original request
        await TokenRefreshClient.get("/auth/refresh");
        return TokenRefreshClient(config);
      } catch (error) {
        // handle refresh errors by clearing the query cache & redirecting to login
        queryClient.clear();
        navigate("/login", {
          state: {
            redirectUrl: window.location.pathname,
          },
        });
      }
    }

    return Promise.reject({ status, ...data });
  }
);

export default API;


================================================
File: fe/src/config/queryClient.js
================================================
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default queryClient;


================================================
File: fe/src/constants/http.mjs
================================================
export const UNAUTHORIZED = 401;


================================================
File: fe/src/hooks/useAuth.js
================================================
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../lib/api";

export const AUTH = "auth";

const useAuth = (opts = {}) => {
  const { data: user, ...rest } = useQuery({
    queryKey: [AUTH],
    queryFn: getUser,
    staleTime: Infinity,
    ...opts,
  });
  return {
    user,
    ...rest,
  };
};

export default useAuth;


================================================
File: fe/src/hooks/useDeleteSession.js
================================================
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession } from "../lib/api";
import { SESSIONS } from "./useSessions";

const useDeleteSession = (sessionId) => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.setQueryData([SESSIONS], (cache) =>
        cache.filter((session) => session._id !== sessionId)
      );
    },
  });

  return { deleteSession: mutate, ...rest };
};

export default useDeleteSession;


================================================
File: fe/src/hooks/useSessions.js
================================================
import { useQuery } from "@tanstack/react-query";
import { getSessions } from "../lib/api";

export const SESSIONS = "sessions";

const useSessions = (opts = {}) => {
  const { data: sessions = [], ...rest } = useQuery({
    queryKey: [SESSIONS],
    queryFn: getSessions,
    ...opts,
  });

  return { sessions, ...rest };
};
export default useSessions;


================================================
File: fe/src/lib/api.js
================================================
import API from "../config/apiClient";

export const register = async (data) => API.post("/auth/register", data);
export const login = async (data) => API.post("/auth/login", data);
export const logout = async () => API.get("/auth/logout");
export const verifyEmail = async (verificationCode) => API.get(`/auth/email/verify/${verificationCode}`);
export const sendPasswordResetEmail = async (email) => API.post("/auth/password/forgot", { email });
export const resetPassword = async ({ verificationCode, password }) => API.post("/auth/password/reset", { verificationCode, password });

export const getUser = async () => API.get("/user");
export const getSessions = async () => API.get("/sessions");
export const deleteSession = async (id) => API.delete(`/sessions/${id}`);


================================================
File: fe/src/lib/navigation.js
================================================
export let navigate = () => {};

export const setNavigate = (fn) => {
  navigate = fn;
};


================================================
File: fe/src/pages/ForgotPassword.jsx
================================================
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Link as ChakraLink,
  Container,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { sendPasswordResetEmail } from "../lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const {
    mutate: sendPasswordReset,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: sendPasswordResetEmail,
  });

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        <Heading fontSize="4xl" mb={8}>
          Reset your password
        </Heading>
        <Box rounded="lg" bg="gray.700" boxShadow="lg" p={8}>
          {isError && (
            <Box mb={3} color="red.400">
              {error.message || "An error occurred"}
            </Box>
          )}
          <Stack spacing={4}>
            {isSuccess ? (
              <Alert status="success" borderRadius={12}>
                <AlertIcon />
                Email sent! Check your inbox for further instructions.
              </Alert>
            ) : (
              <>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </FormControl>
                <Button
                  my={2}
                  isLoading={isPending}
                  isDisabled={!email}
                  onClick={() => sendPasswordReset(email)}
                >
                  Reset Password
                </Button>
              </>
            )}
            <Text align="center" fontSize="sm" color="text.muted">
              Go back to{" "}
              <ChakraLink as={Link} to="/login" replace>
                Sign in
              </ChakraLink>
              &nbsp;or&nbsp;
              <ChakraLink as={Link} to="/register" replace>
                Sign up
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};
export default ForgotPassword;


================================================
File: fe/src/pages/Login.jsx
================================================
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, Heading, Text, Link as ChakraLink, Container } from "@chakra-ui/react";
import { login } from "../lib/api";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirectUrl = location.state?.redirectUrl || "/";

  const {
    mutate: signIn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(redirectUrl, {
        replace: true,
      });
    },
  });

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        <Heading fontSize="4xl" mb={8}>
          Sign in to your account
        </Heading>
        <Box rounded="lg" bg="gray.700" boxShadow="lg" p={8}>
          {isError && (
            <Box mb={3} color="red.400">
              Invalid email or password
            </Box>
          )}
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && signIn({ email, password })} />
            </FormControl>

            <ChakraLink
              as={Link}
              to="/password/forgot"
              fontSize="sm"
              textAlign={{
                base: "center",
                sm: "right",
              }}
            >
              Forgot password?
            </ChakraLink>
            <Button my={2} isLoading={isPending} isDisabled={!email || password.length < 6} onClick={() => signIn({ email, password })}>
              Sign in
            </Button>
            <Text align="center" fontSize="sm" color="text.muted">
              Don&apos;t have an account?{" "}
              <ChakraLink as={Link} to="/register">
                Sign up
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};
export default Login;


================================================
File: fe/src/pages/Profile.jsx
================================================
import { Alert, AlertIcon, Center, Heading, Text } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const { email, verified, createdAt } = user;
  return (
    <Center mt={16} flexDir="column">
      <Heading mb={4}>My Account</Heading>
      {!verified && (
        <Alert status="warning" w="fit-content" borderRadius={12} mb={3}>
          <AlertIcon />
          Please verify your email
        </Alert>
      )}
      <Text color="white" mb={2}>
        Email:{" "}
        <Text as="span" color="gray.300">
          {email}
        </Text>
      </Text>
      <Text color="white">
        Created on{" "}
        <Text as="span" color="gray.300">
          {new Date(createdAt).toLocaleDateString("en-US")}
        </Text>
      </Text>
    </Center>
  );
};
export default Profile;


================================================
File: fe/src/pages/Register.jsx
================================================
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Link as ChakraLink,
  Container,
} from "@chakra-ui/react";
import { register } from "../lib/api";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    mutate: createAccount,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/", {
        replace: true,
      });
    },
  });
  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        <Heading fontSize="4xl" mb={6}>
          Create an account
        </Heading>
        <Box rounded="lg" bg="gray.700" boxShadow="lg" p={8}>
          {isError && (
            <Box mb={3} color="red.400">
              {error?.message || "An error occurred"}
            </Box>
          )}
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Text color="text.muted" fontSize="xs" textAlign="left" mt={2}>
                - Must be at least 6 characters long.
              </Text>
            </FormControl>
            <FormControl id="confirmPassword">
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  createAccount({ email, password, confirmPassword })
                }
              />
            </FormControl>
            <Button
              my={2}
              isLoading={isPending}
              isDisabled={
                !email || password.length < 6 || password !== confirmPassword
              }
              onClick={() =>
                createAccount({ email, password, confirmPassword })
              }
            >
              Create Account
            </Button>
            <Text align="center" fontSize="sm" color="text.muted">
              Already have an account?{" "}
              <ChakraLink as={Link} to="/login">
                Sign in
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};
export default Register;


================================================
File: fe/src/pages/ResetPassword.jsx
================================================
import { useSearchParams, Link } from "react-router-dom";
import {
  Container,
  Flex,
  Link as ChakraLink,
  VStack,
  Alert,
  AlertIcon,
  Text,
} from "@chakra-ui/react";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;

  return (
    <Flex minH="100vh" justify="center">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        {linkIsValid ? (
          <ResetPasswordForm code={code} />
        ) : (
          <VStack align="center" spacing={6}>
            <Alert status="error" w="fit-content" borderRadius={12}>
              <AlertIcon />
              Invalid Link
            </Alert>
            <Text color="gray.400">The link is either invalid or expired.</Text>
            <ChakraLink as={Link} to="/password/forgot" replace>
              Request a new password reset link
            </ChakraLink>
          </VStack>
        )}
      </Container>
    </Flex>
  );
};
export default ResetPassword;


================================================
File: fe/src/pages/Settings.jsx
================================================
import { Container, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import useSessions from "../hooks/useSessions";
import SessionCard from "../components/SessionCard";

const Settings = () => {
  const { sessions, isPending, isSuccess, isError } = useSessions();
  return (
    <Container mt={16}>
      <Heading mb={6}>My Sessions</Heading>
      {isPending && <Spinner />}
      {isError && <Text color="red.400">Failed to get sessions.</Text>}
      {isSuccess && (
        <VStack spacing={3} align="flex-start">
          {sessions.map((session) => (
            <SessionCard key={session._id} session={session} />
          ))}
        </VStack>
      )}
    </Container>
  );
};
export default Settings;


================================================
File: fe/src/pages/VerifyEmail.jsx
================================================
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Flex,
  Link as ChakraLink,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import { verifyEmail } from "../lib/api";

const VerifyEmail = () => {
  const { code } = useParams();
  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code),
  });

  return (
    <Flex minH="100vh" justify="center" mt={12}>
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        {isPending ? (
          <Spinner />
        ) : (
          <VStack align="center" spacing={6}>
            <Alert
              status={isSuccess ? "success" : "error"}
              w="fit-content"
              borderRadius={12}
            >
              <AlertIcon />
              {isSuccess ? "Email Verified!" : "Invalid Link"}
            </Alert>
            {isError && (
              <Text color="gray.400">
                The link is either invalid or expired.{" "}
                <ChakraLink as={Link} to="/password/forgot" replace>
                  Get a new link
                </ChakraLink>
              </Text>
            )}
            <ChakraLink as={Link} to="/" replace>
              Back to home
            </ChakraLink>
          </VStack>
        )}
      </Container>
    </Flex>
  );
};
export default VerifyEmail;


================================================
File: fe/src/theme/buttonTheme.js
================================================
import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
  color: "white",
  bg: "theme.primary",
  _hover: {
    bg: "theme.primaryDark",
    _disabled: {
      bg: "theme.primaryDark",
    },
  },
});

const buttonTheme = defineStyleConfig({
  variants: {
    primary,
  },
  defaultProps: {
    variant: "primary",
  },
});

export default buttonTheme;


================================================
File: fe/src/theme/index.js
================================================
import { baseTheme, extendTheme } from "@chakra-ui/react";
import buttonTheme from "./buttonTheme";
import linkTheme from "./linkTheme";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  theme: {
    primary: baseTheme.colors.blue[500],
    primaryDark: baseTheme.colors.blue[600],
  },
  text: {
    muted: baseTheme.colors.gray[400],
  },
};

const theme = extendTheme({
  config,
  colors,
  components: {
    Button: buttonTheme,
    Link: linkTheme,
  },
});

export default theme;


================================================
File: fe/src/theme/linkTheme.js
================================================
import { baseTheme, defineStyleConfig } from "@chakra-ui/react";

const linkTheme = defineStyleConfig({
  baseStyle: {
    color: baseTheme.colors.blue[300],
  },
});

export default linkTheme;


