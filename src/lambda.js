import serverlessExpress from "@codegenie/serverless-express";
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";
import app from "./server.js"; // Imports the express app

const ssmClient = new SSMClient();
let serverlessExpressInstance;

async function setup() {
  // 1. Fetch values from SSM Parameter Store (Decrypted)
  const command = new GetParametersCommand({
    Names: [
      process.env.MONGO_URI_PARAM_NAME,
      process.env.JWT_SECRET_PARAM_NAME,
    ],
    WithDecryption: true,
  });

  const response = await ssmClient.send(command);

  // 2. Set environment variables dynamically inside Lambda execution scope
  response.Parameters?.forEach((param) => {
    if (param.Name === process.env.MONGO_URI_PARAM_NAME) {
      process.env.MONGO_URI = param.Value;
    }
    if (param.Name === process.env.JWT_SECRET_PARAM_NAME) {
      process.env.JWT_SECRET = param.Value;
    }
  });

  // 3. Initialize serverlessExpress instance once during cold start
  serverlessExpressInstance = serverlessExpress({ app });
}

export const handler = async (event, context, callback) => {
  // Run SSM setup only on cold start
  if (!serverlessExpressInstance) {
    await setup();
  }

  // Pass request to express app
  return serverlessExpressInstance(event, context, callback);
};
