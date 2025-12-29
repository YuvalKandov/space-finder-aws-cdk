import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function updateSpace(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const params = event.queryStringParameters;

  if (!params || !params.id || !event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing 'id' query parameter or request body",
      }),
    };
  }

  const spaceId = params.id;

  let parsedBody: Record<string, unknown>;
  try {
    parsedBody = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON in request body" }),
    };
  }

  const keys = Object.keys(parsedBody);
  if (keys.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Request body must have at least one field" }),
    };
  }

  const requestBodyKey = keys[0];
  const requestBodyValue = parsedBody[requestBodyKey];

  if (typeof requestBodyValue !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Only string values are supported for updates in this endpoint",
      }),
    };
  }

  try {
    const updateResult = await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.SPACES_TABLE_NAME, 
        Key: {
          id: { S: spaceId },
        },

        UpdateExpression: "SET #attr = :value",
        ExpressionAttributeNames: {
          "#attr": requestBodyKey,
        },
        ExpressionAttributeValues: {
          ":value": { S: requestBodyValue },
        },
        ReturnValues: "ALL_NEW", 
      })
    );
    const updatedAttributes = unmarshall(updateResult.Attributes!);

    console.log("Space updated:", JSON.stringify(updatedAttributes, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Space updated successfully",
        updatedSpace: updatedAttributes,
      }),
    };
    } catch (error) {
    console.error("Failed to update space:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update space" }),
    };
  }
}