Directory structure:
└── dnthchung-boilerplate-authen-fe/
    ├── README.md
    └── fe/
        ├── README.md
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── sample.env
        ├── vite.config.js
        ├── .eslintrc.cjs
        ├── .gitignore
        ├── public/
        └── src/
            ├── App.jsx
            ├── main.jsx
            ├── components/
            │   ├── AppContainer.jsx
            │   ├── ResetPasswordForm.jsx
            │   ├── SessionCard.jsx
            │   └── UserMenu.jsx
            ├── config/
            │   ├── apiClient.js
            │   └── queryClient.js
            ├── constants/
            │   └── http.mjs
            ├── hooks/
            │   ├── useAuth.js
            │   ├── useDeleteSession.js
            │   └── useSessions.js
            ├── lib/
            │   ├── api.js
            │   └── navigation.js
            ├── pages/
            │   ├── ForgotPassword.jsx
            │   ├── Login.jsx
            │   ├── Profile.jsx
            │   ├── Register.jsx
            │   ├── ResetPassword.jsx
            │   ├── Settings.jsx
            │   └── VerifyEmail.jsx
            └── theme/
                ├── buttonTheme.js
                ├── index.js
                └── linkTheme.js
