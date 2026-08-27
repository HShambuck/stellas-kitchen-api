import { handler as lambdaHandler } from "./src/lambda.js";

export const handler = async (event, context) => {
  return await lambdaHandler(event, context);
};