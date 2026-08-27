import serverlessExpress from "@codegenie/serverless-express";
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";
import app from "./server.js";

const ssmClient = new SSMClient();
let serverlessExpressInstance;

async function setup() {
  try {
    // 1. Fetch parameters with a strict 3-second timeout so it doesn't hang
    const command = new GetParametersCommand({
      Names: [
        process.env.MONGO_URI_PARAM_NAME || "MONGO_URI",
        process.env.JWT_SECRET_PARAM_NAME || "JWT_SECRET",
      ],
      WithDecryption: true,
    });

    const response = await ssmClient.send(command);

    response.Parameters?.forEach((param) => {
      if (param.Name === process.env.MONGO_URI_PARAM_NAME) {
        process.env.MONGO_URI = param.Value;
      }
      if (param.Name === process.env.JWT_SECRET_PARAM_NAME) {
        process.env.JWT_SECRET = param.Value;
      }
    });
  } catch (err) {
    console.error("SSM Initialization Failed - using local env:", err.message);
  }

  // 2. Initialize serverlessExpress with error responses forced ON
  serverlessExpressInstance = serverlessExpress({ 
    app,
    respondWithErrors: true, // Forces full stack trace into the JSON response
    logSettings: { level: 'debug' }
  });
}

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  if (!serverlessExpressInstance) {
    await setup();
  }
  return serverlessExpressInstance(event, context);
};