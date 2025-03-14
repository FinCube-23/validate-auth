import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";

export function ValidateAuth(): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    // Modify the method to add validation logic before execution
    descriptor.value = function(...args: any[]) {
      // Access headers in the context of the request
      const [req] = args;
      const headers = req.headers;

      console.log("Request headers:", headers);

      // You can validate the headers or check for Authorization, etc.
      const authHeader = headers["authorization"];
      if (!authHeader) {
        throw new Error("Authorization header is missing");
      }

      // If the headers are valid, proceed with the original method
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
