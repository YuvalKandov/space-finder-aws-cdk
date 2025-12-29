import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";
import { MissingFieldError } from "../Shared/Validator";
import { addCorsHeaders } from "../Shared/Utills";

const ddbClient = new DynamoDBClient({});

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let message: string;
  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getSpaces(event, ddbClient);
        response = getResponse;
        break;
  
      case 'POST':
        const postResponse = await postSpaces(event, ddbClient);
        response = postResponse;
      break;  

      case 'PUT':
        const putResponse = await updateSpace(event, ddbClient);
        response = putResponse;
        break;

        case 'DELETE':
          const deleteResponse = await deleteSpace(event, ddbClient);
          response = deleteResponse;
          break;
  
  
      default:
        break;
    }  
  } catch (error) {
    console.error('Error processing request:', error);
    if (error instanceof MissingFieldError) {
      return{
        statusCode: 400,
        body: JSON.stringify(error.message)
      }
    }
    return{
      statusCode: 500,
      body: JSON.stringify(error.message || 'Internal Server Error')
    }
  }

  addCorsHeaders(response);

  return response;
}
