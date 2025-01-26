Directory structure:
└── dnthchung-boilerplate-authen-api/
    └── be/
        ├── README.md
        ├── index.d.ts
        ├── package-lock.json
        ├── package.json
        ├── postman.json
        ├── sample.env
        ├── tsconfig.json
        ├── .nvmrc
        ├── src/
        │   ├── index.ts
        │   ├── config/
        │   │   ├── db.ts
        │   │   └── resend.ts
        │   ├── constants/
        │   │   ├── appErrorCode.ts
        │   │   ├── audience.ts
        │   │   ├── env.ts
        │   │   ├── http.ts
        │   │   └── verificationCodeType.ts
        │   ├── controllers/
        │   │   ├── auth.controller.ts
        │   │   ├── auth.schemas.ts
        │   │   ├── session.controller.ts
        │   │   └── user.controller.ts
        │   ├── middleware/
        │   │   ├── authenticate.ts
        │   │   └── errorHandler.ts
        │   ├── models/
        │   │   ├── session.model.ts
        │   │   ├── user.model.ts
        │   │   └── verificationCode.model.ts
        │   ├── routes/
        │   │   ├── auth.route.ts
        │   │   ├── session.route.ts
        │   │   └── user.route.ts
        │   ├── services/
        │   │   └── auth.service.ts
        │   └── utils/
        │       ├── AppError.ts
        │       ├── appAssert.ts
        │       ├── bcrypt.ts
        │       ├── catchErrors.ts
        │       ├── cookies.ts
        │       ├── date.ts
        │       ├── emailTemplates.ts
        │       ├── jwt.ts
        │       └── sendMail.ts
        └── .vscode/
            └── settings.json
