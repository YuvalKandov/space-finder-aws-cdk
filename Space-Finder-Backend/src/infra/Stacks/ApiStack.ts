import { Stack, StackProps } from 'aws-cdk-lib';
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, MethodOptions, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
  SpacesLambdaIntegration: LambdaIntegration
  userPool: IUserPool
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const ApiSpaces = new RestApi(this, 'ApiSpaces');

    const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer', {
      cognitoUserPools:[props.userPool],
      identitySource: 'method.request.header.Authorization'
    });

    authorizer._attachToApi(ApiSpaces);

    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
          authorizerId: authorizer.authorizerId
      }
    };

    const optionsWithCORS: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS
      }
    };

    const spacesResource = ApiSpaces.root.addResource('spaces', optionsWithCORS);
    spacesResource.addMethod('GET', props.SpacesLambdaIntegration, optionsWithAuth);
    spacesResource.addMethod('POST', props.SpacesLambdaIntegration,optionsWithAuth);
    spacesResource.addMethod('PUT', props.SpacesLambdaIntegration, optionsWithAuth);
    spacesResource.addMethod('DELETE', props.SpacesLambdaIntegration, optionsWithAuth);
}
}