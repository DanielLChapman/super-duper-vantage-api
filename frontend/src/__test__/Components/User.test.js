import { databaseUser, localUser } from "../mockUser";
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
import { CURRENT_USER_QUERY, useUser } from "../../Components/User";

const mocks = [
    {
        request: {
            query: CURRENT_USER_QUERY,
        },
        result: {
            data: {
                authenticatedItem: {
                    __typename: "User",
                    ...databaseUser,
                },
            },
        },
    },
];

describe("User Component", () => {
    beforeEach(() => {
        // Clear and mock localStorage
        localStorage.clear();
        jest.spyOn(window.localStorage.__proto__, 'getItem');
        jest.spyOn(window.localStorage.__proto__, 'setItem');
    });

    it("correctly returns the database user", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useUser(), {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks} addTypename={false}>
                    {children}
                </MockedProvider>
            ),
        });

        await waitFor(() => {
            let temp = {...databaseUser};
            delete temp.createdAt;
            expect(result.current.user).toEqual(temp);
        });
    });

    it("should set and get user data from localStorage", () => {
        const { result } = renderHook(() => useUser(), {
            wrapper: ({ children }) => (
                <MockedProvider mocks={[]} addTypename={false}>
                    {children}
                </MockedProvider>
            ),
        });

        act(() => {
            result.current.setUser({ data: localUser });
        });

        expect(localStorage.setItem).toHaveBeenCalledWith(
            "user",
            JSON.stringify({ data: localUser })
        );
        expect(localStorage.getItem).toHaveBeenCalledWith("user");
    });

    it("should recheck localStorage when recheckLocalStorage is called", () => {
        const { result } = renderHook(() => useUser(), {
            wrapper: ({ children }) => (
                <MockedProvider mocks={[]} addTypename={false}>
                    {children}
                </MockedProvider>
            ),
        });

        act(() => {
            result.current.recheckLocalStorage();
        });

        expect(localStorage.getItem).toHaveBeenCalledTimes(4);
    });
});
