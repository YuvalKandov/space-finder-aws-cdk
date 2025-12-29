import { DeleteItemCommand, DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from "../Shared/Utills";

export async function deleteSpace(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  if (!hasAdminGroup(event)) {
    return {
        statusCode: 401,
        body: JSON.stringify(`Not authorized!`)
    } };

  const params = event.queryStringParameters;

  if (!params || !params.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing 'id' query parameter or request body",
      }),
    };
  }

  const spaceId = params.id;

  try {
    const deleteResult = await ddbClient.send(
      new DeleteItemCommand({
        TableName: process.env.SPACES_TABLE_NAME, 
        Key: {
          id: { S: spaceId },
        }})
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Space deleted successfully",
        deletedID: spaceId
      }),
    };
  } catch (error) {
    console.error("Failed to delete space:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to delete space" }),
    };
  }
}