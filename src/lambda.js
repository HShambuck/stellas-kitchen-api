import serverlessExpress from "@codegenie/serverless-express";
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";
import app from "./server.js";

const ssmClient = new SSMClient();
let serverlessExpressInstance;

async function setup() {
  try {
    const command = new GetParametersCommand({
      Names: [
        process.env.MONGO_URI_PARAM_NAME,
        process.env.JWT_SECRET_PARAM_NAME,
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
    console.error("SSM Fetch Warning:", err.message);
  }

  serverlessExpressInstance = serverlessExpress({ app });
}

export const handler = async (event, context) => {
  if (!serverlessExpressInstance) {
    await setup();
  }
  return serverlessExpressInstance(event, context);
};