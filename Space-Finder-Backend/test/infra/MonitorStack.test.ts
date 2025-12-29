import { App } from "aws-cdk-lib";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";
import { MonitorStack } from "../../src/infra/Stacks/MonitorStack";

describe("Initial test", () => {
  let monitorStackTemplate: Template;

  beforeAll(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });
    const monitorStack = new MonitorStack(testApp, "MonitorStackTest");
    monitorStackTemplate = Template.fromStack(monitorStack);
  });

  test("Lambda properties", () => {
    monitorStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "SpaceFinderSlackWebhookLambda",
      Handler: "index.handler",
      Runtime: "nodejs22.x",
    });
  });

  test("Sns topic properties", () => {
    monitorStackTemplate.hasResourceProperties("AWS::SNS::Topic", {
      DisplayName: "AlarmTopic",
      TopicName: "AlarmTopic",
    });
  });

  test("Sns subscription properties - with matchers", () => {
    monitorStackTemplate.hasResourceProperties(
      "AWS::SNS::Subscription",
      Match.objectLike({
        Protocol: "lambda",
        TopicArn: {
          Ref: Match.stringLikeRegexp("AlarmTopic"),
        },
        Endpoint: {
          "Fn::GetAtt": [Match.stringLikeRegexp("WebHookLambda"), "Arn"],
        },
      })
    );
  });

  test("Sns subscription properties - with exact values", () => {
    const snsTopic = monitorStackTemplate.findResources("AWS::SNS::Topic");
    const snsTopicKey = Object.keys(snsTopic)[0];

    const lambdaFunction = monitorStackTemplate.findResources("AWS::Lambda::Function");
    const lambdaFunctionKey = Object.keys(lambdaFunction)[0];

    monitorStackTemplate.hasResourceProperties("AWS::SNS::Subscription", {
      Protocol: "lambda",
      TopicArn: {
        Ref: snsTopicKey,
      },
      Endpoint: {
        "Fn::GetAtt": [lambdaFunctionKey, "Arn"],
      },
    });
  });

  test("Alarm action", () => {
    const alarmActionsCapture = new Capture();
    monitorStackTemplate.hasResourceProperties("AWS::CloudWatch::Alarm", {
      AlarmActions: alarmActionsCapture,
    });
    expect(alarmActionsCapture.asArray()).toEqual([{
      Ref: expect.stringMatching(/^AlarmTopic/)
    }]);
  });

  test("Monitor stack snapshot", () => {
    expect(monitorStackTemplate.toJSON()).toMatchSnapshot();
  });

  test("Lambda stack snapshot", () => {
    const lambdaStackTemplate = monitorStackTemplate.findResources("AWS::Lambda::Function");
    expect(lambdaStackTemplate).toMatchSnapshot();
  });

  test("snsTopic stack snapshot", () => {
    const snsTopic = monitorStackTemplate.findResources("AWS::SNS::Topic");
    expect(snsTopic).toMatchSnapshot();
  });
});