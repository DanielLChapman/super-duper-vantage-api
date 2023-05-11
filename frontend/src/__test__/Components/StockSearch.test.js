import React from "react";
import StockSearch from "../../Components/StockSearch";
import { databaseUser, localUser } from "../mockUser";
import { MockedProvider } from "@apollo/react-testing";

import {
    render,
    screen,
    fireEvent,
    waitFor,
    prettyDOM,
    within,
} from "@testing-library/react";

import "@testing-library/jest-dom";

const mocks = [];

/*
type StockSearchProps = {
    user: userType | null;
    dateToUse: {
        month: number;
        day: number;
        year: number;
    };
    setDateToUse: React.Dispatch<React.SetStateAction<object>>;
    selector: string;
    setSelector: React.Dispatch<React.SetStateAction<string>>;
    verifiedDates: boolean;
    setVerifiedDates: React.Dispatch<React.SetStateAction<boolean>>;
    checkedStocks: Array<[string, number, string]>;
    setCheckedStocks: React.Dispatch<
        React.SetStateAction<Array<[string, number, string]>>
    >;
    storedCache: any,
    setUser: any,
};
*/


describe("StockSearch", () => {
    const setDateToUse = jest.fn();
    const setSelector = jest.fn();
    const setUser = jest.fn();
    const setVerifiedDates = jest.fn();
    const setCheckedStocks = jest.fn();
    it("renders the Account component", () => {
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
});
