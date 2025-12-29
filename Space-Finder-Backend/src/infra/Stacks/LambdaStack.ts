import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

interface LambdaStackProps extends StackProps {
    spacesTable: ITable;
}

export class LambdaStack extends Stack {

    public readonly SpacesLambdaIntegration: LambdaIntegration;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        const SpacesLambda = new NodejsFunction(this, 'SpacesHandler', {
            runtime: Runtime.NODEJS_LATEST,
            entry: 'src/Services/spaces/handler.ts',
            handler: 'handler',
            environment: {
                SPACES_TABLE_NAME: props.spacesTable.tableName
            }
        });

        SpacesLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.spacesTable.tableArn],
            actions: [
                'dynamodb:PutItem',
                'dynamodb:GetItem',
                'dynamodb:Scan',
                'dynamodb:DeleteItem',
                'dynamodb:UpdateItem'
            ]
        }));
    
        this.SpacesLambdaIntegration = new LambdaIntegration(SpacesLambda);
    }
}