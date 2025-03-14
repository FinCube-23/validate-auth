import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";

export function ValidateAuth(options?: any): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const [req] = args;
      const headers = req.headers;
      const authHeader = headers["authorization"];
      if (!authHeader) {
        throw new Error("Authorization header is missing");
      }

      // Inject umsRabbitClient dynamically during method execution
      const umsRabbitClient: ClientProxy =
        target.constructor.prototype["umsRabbitClient"];

      if (!umsRabbitClient) {
        throw new Error("RmqClient is missing");
      }

      const packet = {
        access_token: authHeader,
        options,
      };

      const messageResponse = await firstValueFrom(
        umsRabbitClient.send("validate-authorization", packet),
      );

      console.log("messageResponse", messageResponse);

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
