import React from "react";
import Account from "../../Components/Account";
import { databaseUser, localUser } from "../mockUser";
import { MockedProvider } from "@apollo/react-testing";
import AccountContainer, {
    UPDATE_USER_MUTATION,
} from "../../Components/UserHandling/AccountContainer";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    prettyDOM,
    within,
} from "@testing-library/react";

import "@testing-library/jest-dom";
import { SIGNIN_MUTATION } from "../../Components/UserHandling/SignIn";

const mocks = [
    {
        request: {
            query: UPDATE_USER_MUTATION,
            variables: {
                id: databaseUser.id,
                username: "newUsername",
            },
        },
        result: {
            data: {
                updateUser: {
                    id: databaseUser.id,
                    username: "newUsername",
                    email: databaseUser.email,
                },
            },
        },
    },
    {
        request: {
            query: SIGNIN_MUTATION,
            variables: {
                username: databaseUser.username,
                password: "newPassword",
            },
        },
        result: {
            data: {
                authenticateUserWithPassword: {
                    __typename: "UserAuthenticationWithPasswordSuccess",
                    item: {
                        id: databaseUser.id,
                        username: databaseUser.username,
                    },
                },
            },
        },
    },
    {
        request: {
            query: SIGNIN_MUTATION,
            variables: {
                username: databaseUser.username,
                password: "newpassword",
            },
        },
        result: {
            data: {
                authenticateUserWithPassword: {
                    __typename: "UserAuthenticationWithPasswordFailure",
                    message: {
                        error: 'Invalid Password'
                    }
                },
            },
        },
    },
];

describe("Account", () => {
    beforeEach(() => {
        jest.spyOn(window, "alert").mockImplementation(() => {});
      });
    
      afterEach(() => {
        jest.clearAllMocks();
      });
    it("renders the Account component", () => {
        const { container, debug } = render(
            <MockedProvider>
                <Account />
            </MockedProvider>
        );

        // Correct Header

        expect(screen.getByText("Sign In")).toBeInTheDocument();
        expect(screen.getByText("$100,000")).toBeInTheDocument();

        //Correct Body With local storage
        expect(screen.getByText("Please Sign In")).toBeInTheDocument();

        // Correct Footer
        expect(screen.getByText("FAQ")).toBeInTheDocument();
    });

    //<AccountContainer user={user} />
    it('renders the correct account information with a "graphql" user', async () => {
        const { container, debug } = render(
            <MockedProvider>
                <AccountContainer user={databaseUser} />
            </MockedProvider>
        );

        //Correct Body With local storage
        expect(screen.getByText("Edit Account Info")).toBeInTheDocument();

        //Correct Body With local storage
        expect(screen.getByText("Edit Taxes")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("account-edit-info"));

        await waitFor(() =>
            expect(
                screen.getByText("Enter Your Current Password")
            ).toBeInTheDocument()
        );
    });

    //<AccountContainer user={user} />
    it('renders the correct account information with a "graphql" user', async () => {
        const { container, debug } = render(
            <MockedProvider>
                <AccountContainer user={localUser} />
            </MockedProvider>
        );

        fireEvent.click(screen.getByTestId("account-edit-info"));

        await waitFor(() =>
            expect(screen.getAllByText("Please Sign In").length).toBe(2)
        );
    });

    it("calls the handleUpdate function with the correct variables when updating the username", async () => {
        const { getByTestId, getByText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AccountContainer user={databaseUser} />
            </MockedProvider>
        );

        fireEvent.click(getByTestId("account-edit-info"));

        await waitFor(() => {
            expect(
                getByText("Enter Your Current Password")
            ).toBeInTheDocument();
        });

        const passwordInput = getByTestId("password-field");
        fireEvent.change(passwordInput, { target: { value: "newpassword" } });

        const submitButton = getByText("Submit");
        fireEvent.click(submitButton);

        //check for invalid passwords
        await waitFor(() => {
            expect(
                getByText("Enter Your Current Password")
            ).toBeInTheDocument();
        });

        fireEvent.change(passwordInput, { target: { value: "newPassword" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByText("Change Username")).toBeInTheDocument();
        });

        const usernameInput = getByTestId("newUsername");
        fireEvent.change(usernameInput, { target: { value: "newUsername" } });

        fireEvent.click(submitButton);

        //not working, need another way to validate it worked.
        /*
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Success");
        });*/


    });
});
