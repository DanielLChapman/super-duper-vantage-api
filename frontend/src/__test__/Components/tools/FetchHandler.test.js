import { verifyAPIHandler, verifyFetch } from "../../../helpers/fetchHelper";

jest.mock("../../../helpers/fetchHelper", () => ({
    ...jest.requireActual("../../../helpers/fetchHelper"),
    verifyAPIHandler: jest.fn(),
}));

describe("verifyFetch", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should correctly handle Notes", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ Note: "sample data" }),
            })
        );

        verifyAPIHandler.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ Note: "sample data" }),
            })
        );

        const symbol = "test";
        const selector = "Day";
        const apiKey = "test-api-key";
        const dateToUse = { month: 5, day: 11, year: 2023 };
        const closingPrice = await verifyFetch(
            symbol,
            selector,
            apiKey,
            dateToUse
        );

        const message = {
            error: "Please wait, maximum of 5 api calls for free API key",
        };

        expect(closingPrice.error).toEqual(message.error);
    });

    it("should correctly handle Errors", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ "Error Message": "sample data" }),
            })
        );

        verifyAPIHandler.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ "Error Message": "sample data" }),
            })
        );

        const symbol = "test";
        const selector = "Day";
        const apiKey = "test-api-key";
        const dateToUse = { month: 5, day: 11, year: 2023 };
        const closingPrice = await verifyFetch(
            symbol,
            selector,
            apiKey,
            dateToUse
        );

        const message = {
            error: "sample data",
        };

        expect(closingPrice.error).toEqual(message.error);
    });

    it("should correctly handle Errors", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ "a": "sample data" }),
            })
        );

        verifyAPIHandler.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ "a": "sample data" }),
            })
        );

        const symbol = "test";
        const selector = "Day";
        const apiKey = "test-api-key";
        const dateToUse = { month: 5, day: 11, year: 2023 };
        const closingPrice = await verifyFetch(
            symbol,
            selector,
            apiKey,
            dateToUse
        );

        const message = {
            error: 'Please alert admin with date and symbol used. May also be using a demo account in which case the api endpoint can not be used.',
        } 

        expect(closingPrice.error).toEqual(message.error);
    });

    it("should correctly handle finding the data", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ "Time Series (Daily)": {
                    "2023-05-11": {
                        '4. close': 5
                    }
                } }),
            })
        );

        verifyAPIHandler.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ "Time Series (Daily)": {
                    "2023-05-11": {
                        '4. close': 5
                    }
                } }),
            })
        );

        const symbol = "test";
        const selector = "Day";
        const apiKey = "test-api-key";
        const dateToUse = { month: 5, day: 11, year: 2023 };
        const closingPrice = await verifyFetch(
            symbol,
            selector,
            apiKey,
            dateToUse
        );

        expect(closingPrice).toEqual(5);
    });

    it("should correctly handle finding the data", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ "Monthly Adjusted Time Series": {
                    "2023-05-11": {
                        '5. adjusted close': 5
                    }
                } }),
            })
        );

        verifyAPIHandler.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ "Monthly Adjusted Time Series": {
                    "2023-05-11": {
                        '5. adjusted close': 5
                    }
                } }),
            })
        );

        const symbol = "test";
        const selector = "Monthly";
        const apiKey = "test-api-key";
        const dateToUse = { month: 5, day: 11, year: 2023 };
        const closingPrice = await verifyFetch(
            symbol,
            selector,
            apiKey,
            dateToUse
        );

        expect(closingPrice).toEqual(5);
    });
});
