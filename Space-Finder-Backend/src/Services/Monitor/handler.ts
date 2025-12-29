import { SNSEvent } from "aws-lambda";


export async function handler(event: SNSEvent, context) {
  for (const record of event.Records) {
    const alarm = JSON.parse(record.Sns.Message);

    const emoji = alarm.NewStateValue === "ALARM" ? "🚨" : "✅";

    const text = `
${emoji} *API Alarm Update*

*Alarm:* ${alarm.AlarmName}
*State:* ${alarm.NewStateValue}
*Reason:* ${alarm.NewStateReason}
*Metric:* ${alarm.Trigger?.MetricName}
*Region:* ${alarm.Region}
*Time:* ${alarm.StateChangeTime}
`.trim();

    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  }
}