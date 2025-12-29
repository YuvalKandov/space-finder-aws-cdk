import { handler } from "../../../src/Services/Monitor/handler";

describe("Lambda monitor Tests", () => {
  const fetchSpy = jest.spyOn(global, "fetch");

  beforeEach(() => {
    fetchSpy.mockResolvedValue({} as any);
    process.env.SLACK_WEBHOOK_URL = "https://example.com/webhook";
  });

  afterEach(() => {
    fetchSpy.mockClear();
  });

  test("sends formatted Slack message for SNS alarm", async () => {
    const alarmMessage = {
      AlarmName: "SpacesApi4xxAlarm",
      NewStateValue: "ALARM",
      NewStateReason: "Threshold crossed",
      Region: "EU (Frankfurt)",
      StateChangeTime: "2025-12-24T12:00:00Z",
      Trigger: {
        MetricName: "4XXError"
      }
    };

    await handler(
      {
        Records: [
          {
            Sns: {
              Message: JSON.stringify(alarmMessage),
            },
          },
        ],
      } as any,
      {} as any
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const expectedText = `
🚨 *API Alarm Update*

*Alarm:* SpacesApi4xxAlarm
*State:* ALARM
*Reason:* Threshold crossed
*Metric:* 4XXError
*Region:* EU (Frankfurt)
*Time:* 2025-12-24T12:00:00Z
`.trim();

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://example.com/webhook",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: expectedText }),
      }
    );
  });

  test("no snsRecords, no fetch call", async () => {
    await handler(
      {
        Records: [],
      } as any,
      {} as any
    );

    expect(fetchSpy).not.toHaveBeenCalled();
  });

});