Directory structure:
└── be-no-session/
    ├── README.md
    ├── Dockerfile
    ├── code-flow.md
    ├── docker-compose.yml
    ├── index.d.ts
    ├── package-lock.json
    ├── package.json
    ├── postman.json
    ├── sample.env
    ├── test-api.http
    ├── tsconfig.json
    ├── .nvmrc
    ├── mongo/
    │   └── Dockerfile
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
    │   │   ├── role.ts
    │   │   └── verificationCodeType.ts
    │   ├── controllers/
    │   │   ├── auth.controller.ts
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
    │   ├── schemas/
    │   │   └── auth.schemas.ts
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
    │       ├── sendMail.ts
    │       └── stringHelper.ts
    └── .vscode/
        └── settings.json
