import { GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { getSpaces } from "../../../src/Services/spaces/GetSpaces";

const scanResponseMock = {
  Items: [
    {
      id: { S: "123" },
      location: { S: "Paris" },
    },
  ],
};

const getItemResponseMock = {
  Item: {
    id: { S: "123" },
    location: { S: "Paris" },
  },
};

describe("GetSpaces test suite", () => {
  const ddbClientMock = { send: jest.fn() };

  beforeAll(() => {
    process.env.SPACES_TABLE_NAME = "SpacesTableTest";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return spaces (Scan) when no queryStringParameters", async () => {
    ddbClientMock.send.mockResolvedValueOnce(scanResponseMock);

    const result = await getSpaces({} as any, ddbClientMock as any);

    expect(result.statusCode).toBe(200);

    const body = JSON.parse(result.body);
    expect(body.message).toBe("Spaces retrieved successfully");
    expect(body.spaces).toEqual([{ id: "123", location: "Paris" }]);

    expect(ddbClientMock.send).toHaveBeenCalledWith(expect.any(ScanCommand));
    const scanInput = (ddbClientMock.send.mock.calls[0][0] as ScanCommand).input;
    expect(scanInput.TableName).toBe("SpacesTableTest");
  });

  test("should return spaces (Scan) when queryStringParameters has no id", async () => {
    ddbClientMock.send.mockResolvedValueOnce(scanResponseMock);

    const result = await getSpaces(
      { queryStringParameters: { notId: "123" } } as any,
      ddbClientMock as any
    );

    expect(result.statusCode).toBe(200);

    const body = JSON.parse(result.body);
    expect(body.message).toBe("Spaces retrieved successfully");
    expect(body.spaces).toEqual([{ id: "123", location: "Paris" }]);

    expect(ddbClientMock.send).toHaveBeenCalledWith(expect.any(ScanCommand));
  });

  test("should return 404 when id provided but item not found", async () => {
    ddbClientMock.send.mockResolvedValueOnce({}); // no Item

    const result = await getSpaces(
      { queryStringParameters: { id: "123" } } as any,
      ddbClientMock as any
    );

    expect(result.statusCode).toBe(404);

    const body = JSON.parse(result.body);
    expect(body.message).toBe("Space with id 123 not found");

    expect(ddbClientMock.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
  });

  test("should return 200 when id provided and item found", async () => {
    ddbClientMock.send.mockResolvedValueOnce(getItemResponseMock);

    const result = await getSpaces(
      { queryStringParameters: { id: "123" } } as any,
      ddbClientMock as any
    );

    expect(result.statusCode).toBe(200);

    const body = JSON.parse(result.body);
    expect(body.message).toBe("Space retrieved successfully");
    expect(body.space).toEqual({ id: "123", location: "Paris" });

    expect(ddbClientMock.send).toHaveBeenCalledWith(expect.any(GetItemCommand));

    const getInput = (ddbClientMock.send.mock.calls[0][0] as GetItemCommand).input;
    expect(getInput.TableName).toBe("SpacesTableTest");
    expect(getInput.Key).toEqual({ id: { S: "123" } });
  });
});