import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Alarm, Metric, Unit } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Sns } from "aws-cdk-lib/aws-ses-actions";
import { Topic } from "aws-cdk-lib/aws-sns";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";



export class MonitorStack extends Stack {


    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const webHookLambda = new NodejsFunction(this, 'WebHookLambda', {
            runtime: Runtime.NODEJS_LATEST,
            entry: 'src/services/monitor/handler.ts',
            handler: 'handler',
            functionName: 'SpaceFinderSlackWebhookLambda',
            environment: {
                SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL ?? ""
            }
        });

        const alarmTopic = new Topic(this, 'AlarmTopic', {
            topicName: 'AlarmTopic',
            displayName: 'AlarmTopic'
        });
        alarmTopic.addSubscription(new LambdaSubscription(webHookLambda));


        const spacesApi4xxAlarm = new Alarm(this, 'SpacesApi4xxAlarm', {
            metric: new Metric({
                metricName: '4XXError',
                namespace: 'AWS/ApiGateway',
                dimensionsMap: {
                    'ApiName': 'ApiSpaces'
                },
                period: Duration.minutes(1),
                statistic: 'Sum', 
                unit: Unit.COUNT
            }),
            threshold: 5,
            evaluationPeriods: 1,
            alarmName: 'SpacesApi4xxAlarm',
            alarmDescription: 'Alarm for more than 5 4XX errors in 1 minute for Spaces API'
        });
        const topicAction = new SnsAction(alarmTopic);
        spacesApi4xxAlarm.addAlarmAction(topicAction);
        spacesApi4xxAlarm.addOkAction(topicAction);
    }
}