# @mskits/validate-auth

[![npm version](https://badge.fury.io/js/@mskits%2Fvalidate-auth.svg)](https://badge.fury.io/js/@mskits%2Fvalidate-auth)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A lightweight, TypeScript-ready authentication validation utility for NestJS microservices architecture.

## ✨ Features

- 🚀 **Simple & Fast** - Minimal setup with maximum efficiency
- 🔒 **Secure** - Built-in authorization header validation
- 🏗️ **Microservices Ready** - Designed for NestJS microservices
- 📦 **TypeScript Support** - Full type definitions included
- ⚡ **RxJS Integration** - Reactive programming support
- 🛠️ **Configurable** - Flexible options support

## 📦 Installation

```bash
npm install @mskits/validate-auth
```

```bash
yarn add @mskits/validate-auth
```

```bash
pnpm add @mskits/validate-auth
```

## 🚀 Quick Start

```typescript
import { validateAuth } from '@mskits/validate-auth';
import { ClientProxy } from '@nestjs/microservices';

// In your controller or service
async function protectedRoute(req: any, authClient: ClientProxy) {
  try {
    const user = await validateAuth(req, authClient);
    // User is authenticated, proceed with your logic
    return user;
  } catch (error) {
    // Handle authentication error
    throw new UnauthorizedException('Invalid authentication');
  }
}
```

## 📖 API Reference

### `validateAuth(req, client, options?)`

Validates the authorization header from a request using a NestJS microservice client.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `req` | `any` | ✅ | The request object containing headers |
| `client` | `ClientProxy` | ✅ | NestJS microservice client for auth validation |
| `options` | `any` | ❌ | Optional configuration object |

#### Returns

- **Promise** - Resolves with user data on successful validation
- **Throws** - Error on validation failure or missing requirements

#### Example with Options

```typescript
const user = await validateAuth(req, authClient, {
  skipExpiry: false,
  requiredRoles: ['admin', 'user']
});
```

## 🔧 Usage Examples

### Basic Guard Implementation

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { validateAuth } from '@mskits/validate-auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const user = await validateAuth(request, this.authClient);
      request.user = user; // Attach user to request
      return true;
    } catch {
      return false;
    }
  }
}
```

### Controller Usage

```typescript
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { validateAuth } from '@mskits/validate-auth';

@Controller('protected')
export class ProtectedController {
  constructor(private readonly authClient: ClientProxy) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    const user = await validateAuth(req, this.authClient);
    return { message: 'Access granted', user };
  }
}
```

## 🏗️ Microservice Setup

Your authentication microservice should handle the `validate-authorization` message pattern:

```typescript
@MessagePattern('validate-authorization')
async validateToken(data: { access_token: string; options?: any }) {
  // Your token validation logic here
  return userData;
}
```

## 🛡️ Error Handling

The function throws errors in the following cases:

- **Missing Authorization Header**: When no `Authorization` header is present
- **Missing Client**: When the microservice client is not provided
- **Validation Failure**: When the microservice returns an error

```typescript
try {
  const user = await validateAuth(req, client);
} catch (error) {
  if (error.message === 'Authorization header is missing') {
    // Handle missing header
  } else if (error.message === 'RmqClient is missing') {
    // Handle missing client
  } else {
    // Handle validation errors
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**@antonin686**

---

<div align="center">

**[⭐ Star this repo](https://github.com/FinCube-23/validate-auth)** if you find it helpful!

</div>
