/*
const DataContainer: React.FC<{
    verifiedDates: boolean;
    selector: string | "day" | "monthly" | "weekly" | "intraday";
    user: user;
    dateToUse: { month: number; day: number; year: number };
    checkedStocks: Array<[string, number, string]>;
    storedCache: any;
    setCheckedStocks: React.Dispatch<
        React.SetStateAction<Array<[string, number, string]>>
    >;
    setUser: any,
*/

import {
    render,
    screen,
    fireEvent,
    waitFor,
    renderHook,
    act,
} from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import "@testing-library/jest-dom";
import DataContainer, {
    GET_STOCKS,
    GET_TRADES,
} from "../../../Components/DataDisplay/DataContainer";
import { databaseUser } from "../../mockUser";
import { getMockStockData } from "../../mockStockData";

const mockData = getMockStockData();

const emptyMocks = [
    {
        request: {
            query: GET_STOCKS,
            variables: {
                userID: "1",
                limit: 10,
                offset: 0,
            },
        },
        result: {
            data: {
                stocks: [],
            },
        },
    },
    {
        request: {
            query: GET_TRADES,
            variables: {
                userID: "1",
                limit: 10,
                offset: 0,
            },
        },
        result: {
            data: {
                trades: [],
            },
        },
    },
];

const oneMocks = [
    {
        request: {
            query: GET_STOCKS,
            variables: {
                userID: "1",
                limit: 10,
                offset: 0,
            },
        },
        result: {
            data: {
                stocks: [
                    {
                        id: "22",
                        symbol: "AAPL",
                        price: 15000,
                        amount: 0,
                        dateOfTrade: new Date(Date.now()),
                    },
                ],
            },
        },
    },
    {
        request: {
            query: GET_TRADES,
            variables: {
                userID: "1",
                limit: 10,
                offset: 0,
            },
        },
        result: {
            data: {
                trades: [
                    {
                        id: "22",
                        symbol: "VZ",
                        price: 15000,
                        amount: 0,
                        dateOfTrade: new Date(Date.now()),
                        buySell: true,
                    },
                ],
            },
        },
    },
];

const paginationMocks = [
    {
        request: {
            query: GET_STOCKS,
            variables: {
                userID: "1",
                limit: 10,
                offset: 0,
            },
        },
        result: {
            data: {
                stocks: mockData.slice(0,10),
            },
        },
    },
    {
        request: {
            query: GET_STOCKS,
            variables: {
                userID: "1",
                limit: 10,
                offset: 10,
            },
        },
        result: {
            data: {
                stocks: mockData.slice(10,20),
            },
        },
    },
    {
        request: {
            query: GET_TRADES,
            variables: {
                userID: "1",
                limit: 10,
                offset: 0,
            },
        },
        result: {
            data: {
                trades: [
                    {
                        id: "22",
                        symbol: "VZ",
                        price: 15000,
                        amount: 0,
                        dateOfTrade: new Date(Date.now()),
                        buySell: true,
                    },
                ],
            },
        },
    },
];

describe("Data Container Component", () => {
    const verifiedDates = false;
    const selector = "Day";
    const user = databaseUser;
    const dateToUse = {
        month: "05",
        day: "04",
        year: "2023",
    };
    const checkedStocks = [];
    const storedCache = [];
    const setCheckedStocks = jest.fn();
    const setUser = jest.fn();

    it("renders correctly", async () => {
        render(
            <MockedProvider mocks={emptyMocks} addTypename={false}>
                <DataContainer
                    verifiedDates={verifiedDates}
                    user={user}
                    dateToUse={dateToUse}
                    selector={selector}
                    checkedStocks={checkedStocks}
                    setUser={setUser}
                    setCheckedStocks={setCheckedStocks}
                    storedCache={storedCache}
                />
            </MockedProvider>
        );

        expect(screen.getByText("Stocks // Trade History")).toBeInTheDocument();

        fireEvent.click(
            screen.getByTestId("stock-datacontainer-reveal-button")
        );

        fireEvent.click(
            screen.getByTestId("trade-datacontainer-reveal-button")
        );

        await waitFor(() => {
            expect(screen.getByText("No stocks found")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("No trades found")).toBeInTheDocument();
        });
    });

    it("renders correctly with one stock one trade", async () => {
        render(
            <MockedProvider mocks={oneMocks} addTypename={false}>
                <DataContainer
                    verifiedDates={verifiedDates}
                    user={user}
                    dateToUse={dateToUse}
                    selector={selector}
                    checkedStocks={checkedStocks}
                    setUser={setUser}
                    setCheckedStocks={setCheckedStocks}
                    storedCache={storedCache}
                />
            </MockedProvider>
        );

        expect(screen.getByText("Stocks // Trade History")).toBeInTheDocument();

        fireEvent.click(
            screen.getByTestId("stock-datacontainer-reveal-button")
        );

        fireEvent.click(
            screen.getByTestId("trade-datacontainer-reveal-button")
        );

        await waitFor(() => {
            expect(screen.getByText("AAPL")).toBeInTheDocument();
            expect(screen.getByText("Bought For:")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("VZ")).toBeInTheDocument();
        });

        //expand

        fireEvent.click(screen.getByText("Expand"));
        await waitFor(() => {
            expect(
                screen.getByText("Total Amount Of Shares:")
            ).toBeInTheDocument();
        });
    });

    it("renders correctly with 30 stocks and paginates", async () => {
        render(
            <MockedProvider mocks={paginationMocks} addTypename={false}>
                <DataContainer
                    verifiedDates={verifiedDates}
                    user={user}
                    dateToUse={dateToUse}
                    selector={selector}
                    checkedStocks={checkedStocks}
                    setUser={setUser}
                    setCheckedStocks={setCheckedStocks}
                    storedCache={storedCache}
                />
            </MockedProvider>
        );

        fireEvent.click(
            screen.getByTestId("stock-datacontainer-reveal-button")
        );

        await waitFor(() => {
            // Check that the first page of data is displayed
            mockData.slice(0, 10).forEach((item) => {
                expect(screen.getByText(item.symbol)).toBeInTheDocument();
            });
        });

        // Check that the second page of data is not displayed
        mockData.slice(10, 20).forEach((item) => {
            expect(screen.queryByText(item.symbol)).not.toBeInTheDocument();
        });

        // 3. Next button
        fireEvent.click(screen.getByText("Next"));

        // Wait for the second page of data to be displayed
        await waitFor(() => {
            mockData.slice(10, 20).forEach((item) => {
                expect(screen.getByText(item.symbol)).toBeInTheDocument();
            });
        });

        // Check that the first page of data is not displayed
        mockData.slice(0, 10).forEach((item) => {
            expect(screen.queryByText(item.symbol)).not.toBeInTheDocument();
        });

        // 4. Previous button
        fireEvent.click(screen.getByText("Previous"));

        // Wait for the first page of data to be displayed again
        await waitFor(() => {
            mockData.slice(0, 10).forEach((item) => {
                expect(screen.getByText(item.symbol)).toBeInTheDocument();
            });
        });
    });
});
