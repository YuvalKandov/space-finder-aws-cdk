import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateAsSpaceEntry } from "../Shared/Validator";
import { marshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";



export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

    const randomId = randomUUID();
    const item = JSON.parse(event.body || '{}');
    item.id = randomId;
    validateAsSpaceEntry(item);

    const result = await ddbClient.send(new PutItemCommand({
        TableName: process.env.SPACES_TABLE_NAME,
        Item: marshall(item)
    }));
    console.log('DynamoDB PutItemCommand result:', result);

    const response: APIGatewayProxyResult = {
        statusCode: 201,
        body: JSON.stringify({
            message: 'Space created successfully',
            spaceId: randomId,
            location: item.location, 
            describe: item.description
        })
    };

    return response;
}
