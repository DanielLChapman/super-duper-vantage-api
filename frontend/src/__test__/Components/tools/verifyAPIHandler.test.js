import { verifyAPIHandler } from "../../../helpers/fetchHelper";

describe("verifyAPIHandler", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: 'sample data' }),
            })
        );
    });

    it("should fetch and return data from API", async () => {
        const url = "http://test.url";
        const data = await verifyAPIHandler(url);
        expect(data).toEqual({ data: "sample data" });
        expect(fetch).toHaveBeenCalledWith(url);
    });
});
