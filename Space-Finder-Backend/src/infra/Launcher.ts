import { App } from 'aws-cdk-lib';
import { DataStack } from './Stacks/DataStack';
import { LambdaStack } from './Stacks/LambdaStack';
import { ApiStack } from './Stacks/ApiStack';
import { AuthStack } from './Stacks/AuthStack';
import { UiDeploymentStack } from './Stacks/UiDeploymentStack';
import { MonitorStack } from './Stacks/MonitorStack';


const app = new App();

const dataStack = new DataStack(app, 'DataStack');

const SpacesLambda = new LambdaStack(app, 'LambdaStack', {
  spacesTable: dataStack.spacesTable
});

const authStack = new AuthStack(app, 'AuthStack', {
  photosBucket: dataStack.photosBucket
});

new ApiStack(app, 'ApiStack', {
  SpacesLambdaIntegration: SpacesLambda.SpacesLambdaIntegration,
    userPool: authStack.userPool
});

new UiDeploymentStack(app, 'UiDeploymentStack');
new MonitorStack(app, 'MonitorStack');