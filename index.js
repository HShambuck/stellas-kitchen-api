import { handler as lambdaHandler } from "./src/lambda.js";

export const handler = async (event, context, callback) => {
  return await lambdaHandler(event, context, callback);
};