import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  const spaceId = event.queryStringParameters?.id;


  if (spaceId) {
    const getItemResponse = await ddbClient.send(new GetItemCommand({
      TableName: process.env.SPACES_TABLE_NAME,
      Key: { id: { S: spaceId } }
    }));

    if (!getItemResponse.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `Space with id ${spaceId} not found` })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Space retrieved successfully",
        space: unmarshall(getItemResponse.Item)
      })
    };
  }

  const scanResponse = await ddbClient.send(new ScanCommand({
    TableName: process.env.SPACES_TABLE_NAME,
  }));

  const spaces = (scanResponse.Items ?? []).map(item => unmarshall(item));

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Spaces retrieved successfully",
      spaces
    })
  };
}