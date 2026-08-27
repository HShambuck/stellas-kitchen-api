import serverlessExpress from "@codegenie/serverless-express";
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";
import app from "./server.js";

const ssmClient = new SSMClient();
let serverlessExpressInstance;

async function setup() {
  const mongoParam = process.env.MONGO_URI_PARAM_NAME;
  const jwtParam = process.env.JWT_SECRET_PARAM_NAME;

  if (!mongoParam || !jwtParam) {
    console.warn("SSM Parameter environment variables missing. Falling back to default env.");
    return serverlessExpress({ app });
  }

  try {
    const command = new GetParametersCommand({
      Names: [mongoParam, jwtParam],
      WithDecryption: true,
    });

    const response = await ssmClient.send(command);

    if (response.InvalidParameters && response.InvalidParameters.length > 0) {
      console.error("Invalid SSM Parameter names:", response.InvalidParameters);
    }

    response.Parameters?.forEach((param) => {
      if (param.Name === mongoParam) {
        process.env.MONGO_URI = param.Value;
      }
      if (param.Name === jwtParam) {
        process.env.JWT_SECRET = param.Value;
      }
    });

    if (!process.env.MONGO_URI) {
      throw new Error(`Failed to hydrate MONGO_URI from SSM parameter: ${mongoParam}`);
    }
  } catch (err) {
    console.error("CRITICAL: Failed to initialize SSM parameters:", err);
    throw err;
  }

  return serverlessExpress({ app });
}

export const handler = async (event, context, callback) => {
  if (!serverlessExpressInstance) {
    serverlessExpressInstance = await setup();
  }
  return serverlessExpressInstance(event, context, callback);
};