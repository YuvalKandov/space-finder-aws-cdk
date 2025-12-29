import { Fn, Stack } from "aws-cdk-lib";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export function addCorsHeaders(response: APIGatewayProxyResult) {
    if (!response.headers) {
        response.headers = {};
    }
    response.headers['Access-Control-Allow-Origin'] = '*';
    response.headers['Access-Control-Allow-Methods'] = '*';
}

export function hasAdminGroup(event: APIGatewayProxyEvent){
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    if (groups) {
        return (groups as string).includes('admins');
    }
    return false;
}