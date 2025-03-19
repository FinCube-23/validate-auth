import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";

export async function validateAuth(
  req: any,
  client: ClientProxy,
  options?: any,
) {
  const headers = req.headers;
  const authHeader = headers["authorization"];
  if (!authHeader) {
    throw new Error("Authorization header is missing");
  }

  if (!client) {
    throw new Error("RmqClient is missing");
  }

  const packet = {
    access_token: authHeader.split(" ")[1],
    options,
  };

  try {
    const res = await firstValueFrom(
      client.send("validate-authorization", packet),
    );

    return res;
  } catch (err: any) {
    throw new Error(err);
  }
}
