import React from "react";
import StockSearch from "../../Components/StockSearch";
import { databaseUser, localUser } from "../mockUser";
import { MockedProvider } from "@apollo/react-testing";
import { verifyAPIHandler, verifyFetch } from "../../helpers/fetchHelper";

import {
    render,
    screen,
    fireEvent,
    waitFor,
    prettyDOM,
    within,
} from "@testing-library/react";

import "@testing-library/jest-dom";
import { ADD_CACHE, GET_CACHES_BY_IDENTIFIERS } from "../../Components/Cache";

let current = new Date(Date.now());
let dateString = `${current.getFullYear()}-${
    current.getMonth() + 1
}-${current.getDate()}`;
let date = new Date(dateString);

const mocks = [
    {
        request: {
            query: GET_CACHES_BY_IDENTIFIERS,
            variables: {
                ids: [
                    `AAPL-${
                        current.getMonth() + 1
                    }-${current.getDate()}-${current.getFullYear()}`,
                ],
            },
        },
        result: {
            data: {
                cacheStorages: [],
            },
        },
    },
    {
        request: {
            query: ADD_CACHE,
            variables: {
                symbol: "AAPL",
                price: 400,
                date: date,
                identifier: `AAPL-${
                    current.getMonth() + 1
                }-${current.getDate()}-${current.getFullYear()}`,
            },
        },
        result: {
            data: {
                createCacheStorage: {
                    id: "1",
                    symbol: "AAPL",
                    price: 400,
                    createdAt: date,
                    date: date,
                    identifier: `AAPL-${
                        current.getMonth() + 1
                    }-${current.getDate()}-${current.getFullYear()}`,
                },
            },
        },
    },
    {
        request: {
            query: ADD_CACHE,
            variables: {
                symbol: "AAPL",
                price: null,
                date: date,
                identifier: `AAPL-${
                    current.getMonth() + 1
                }-${current.getDate()}-${current.getFullYear()}`,
            },
        },
        result: {
            data: {
                createCacheStorage: {
                    id: "1",
                    symbol: "AAPL",
                    price: null,
                    createdAt: date,
                    date: date,
                    identifier: `AAPL-${
                        current.getMonth() + 1
                    }-${current.getDate()}-${current.getFullYear()}`,
                },
            },
        },
    },
];

jest.mock("../../helpers/fetchHelper", () => ({
    ...jest.requireActual("../../helpers/fetchHelper"),
    verifyAPIHandler: jest.fn(),
    verifyFetch: jest.fn(),
}));

describe("StockSearch", () => {
    const setDateToUse = jest.fn();
    const setSelector = jest.fn();
    const setUser = jest.fn();
    const setVerifiedDates = jest.fn();
    const setCheckedStocks = jest.fn();
    it("renders the Stock Search component", () => {
        const { container, debug } = render(
            <MockedProvider mocks={mocks}>
                <StockSearch
                    user={databaseUser}
                    dateToUse={{ month: "05", day: "04", year: "2023" }}
                    setDateToUse={setDateToUse}
                    selector="Day"
                    setSelector={setSelector}
                    verifiedDates="false"
                    setVerifiedDates={setVerifiedDates}
                    checkedStocks={[]}
                    setCheckedStocks={setCheckedStocks}
                    storedCache={[]}
                    setUser={setUser}
                />
            </MockedProvider>
        );

        // Correct Header

        expect(screen.getByText("Check Date To Use:")).toBeInTheDocument();
    });

    it("correctly advances the UI", async () => {
        const { container, debug } = render(
            <MockedProvider>
                <StockSearch
                    user={databaseUser}
                    dateToUse={{ month: "05", day: "04", year: "2023" }}
                    setDateToUse={setDateToUse}
                    selector="Day"
                    setSelector={setSelector}
                    verifiedDates="false"
                    setVerifiedDates={setVerifiedDates}
                    checkedStocks={[]}
                    setCheckedStocks={setCheckedStocks}
                    storedCache={[]}
                    setUser={setUser}
                />
            </MockedProvider>
        );

        // Correct Header
        fireEvent.click(screen.getByTestId("date-controller-form-submit"));

        await waitFor(() => {
            expect(screen.getByText("Check Stock Symbol")).toBeInTheDocument();
        });
    });

    it("correctly advances the UI with API Call", async () => {
        let currentDate = `${current.getFullYear()}-${
            current.getUTCMonth() + 1
        }-${current.getDate()}`;

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        "Time Series (Daily)": {
                            [currentDate]: {
                                "4. close": 5,
                            },
                        },
                    }),
            })
        );

        verifyFetch.mockResolvedValueOnce(4);

        const { container, debug } = render(
            <MockedProvider mocks={mocks}>
                <StockSearch
                    user={databaseUser}
                    dateToUse={{
                        month: current.getMonth() + 1,
                        day: current.getDate(),
                        year: current.getFullYear(),
                    }}
                    setDateToUse={setDateToUse}
                    selector="Day"
                    setSelector={setSelector}
                    verifiedDates="false"
                    setVerifiedDates={setVerifiedDates}
                    checkedStocks={[]}
                    setCheckedStocks={setCheckedStocks}
                    storedCache={[]}
                    setUser={setUser}
                />
            </MockedProvider>
        );

        // Correct Header
        fireEvent.click(screen.getByTestId("date-controller-form-submit"));

        await waitFor(() => {
            expect(screen.getByText("Check Stock Symbol")).toBeInTheDocument();
        });

        fireEvent.change(screen.getByTestId("handle-stock-change-amount"), {
            target: { value: "1" },
        });

        fireEvent.click(screen.getByTestId("verify-stock-button"));

        await waitFor(() => {
            expect(screen.getAllByText("$4.00").length).toBe(2);
        });
    });
});
