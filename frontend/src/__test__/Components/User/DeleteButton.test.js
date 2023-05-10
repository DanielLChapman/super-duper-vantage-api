// DeleteButton.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { databaseUser } from "../../mockUser";
import { CURRENT_USER_QUERY } from "../../../Components/User";
import { SIGNIN_MUTATION } from "../../../Components/UserHandling/SignIn";
import DeleteButton, {
    DELETE_USER_MUTATION,
} from "../../../Components/UserHandling/DeleteButton";
import { useRouter } from "next/router";

import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

const userMock = {
    id: databaseUser.id,
    username: databaseUser.username,
};

const mocks = [
    {
        request: {
            query: CURRENT_USER_QUERY,
        },
        result: {
            data: {
                authenticatedItem: {
                    __typename: "User",
                    ...databaseUser
                },
            },
        },
    },
    {
        request: {
            query: SIGNIN_MUTATION,
            variables: {
                username: userMock.username,
                password: "testpassword",
            },
        },
        result: {
            data: {
                authenticateUserWithPassword: {
                    __typename: "UserAuthenticationWithPasswordSuccess",
                    item: {
                        id: "1",
                        username: userMock.username,
                    },
                },
            },
        },
    },
    {
        request: {
            query: DELETE_USER_MUTATION,
            variables: {
                id: userMock.id,
            },
        },
        result: {
            data: {
                deleteUser: {
                    id: userMock.id,
                },
            },
        },
    },
];

describe("DeleteButton component", () => {
    it("renders DeleteButton component and validates the password", async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <DeleteButton user={userMock} />
            </MockedProvider>
        );

        const deleteButton = screen.getByText("Delete Account");
        fireEvent.click(deleteButton);

        const passwordInput = screen.getByPlaceholderText(
            "Enter your password"
        );
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });

        const submitButton = screen.getByText("Submit");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText("Confirm Account Deletion")
            ).toBeInTheDocument();
        });
    });

    it("deletes the user account and navigates to the homepage", async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <DeleteButton user={userMock} />
            </MockedProvider>
        );

        const deleteButton = screen.getByText("Delete Account");
        fireEvent.click(deleteButton);

        const passwordInput = screen.getByPlaceholderText(
            "Enter your password"
        );
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });

        const submitButton = screen.getByText("Submit");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText("Confirm Account Deletion")
            ).toBeInTheDocument();
        });

        // Mock the window.alert function
        window.alert = jest.fn();
        window.confirm = jest.fn(() => true);

        // Get the mocked router.push function
        const mockedRouterPush = useRouter().push;

        // Click the "Confirm Account Deletion" button
        const confirmDeletionButton = screen.getByText(
            "Confirm Account Deletion"
        );
        fireEvent.click(confirmDeletionButton);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("User deleted successfully.");
        });

        // Expect the alert to be called with the expected message
    });
});
