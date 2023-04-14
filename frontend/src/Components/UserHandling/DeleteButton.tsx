import React, { useState } from "react";
import { CURRENT_USER_QUERY } from "../User";
import { gql, useMutation } from "@apollo/client";
import { SIGNIN_MUTATION } from "./SignIn";
import { Router, useRouter } from "next/router";
import { user } from "../../../tools/lib";

const DELETE_USER_MUTATION = gql`
    mutation deleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
        }
    }
`;

interface DeleteAccountProps {
    user: user;
}

const DeleteButton: React.FC<DeleteAccountProps> = ({ user }) => {
    //PROBABLY NOT NECESSARY TO KEEP SEPARATE, BUT TO AVOID ANY ACCIDENTAL DELETIONS AFTER EDITING
    //WILL MAKE THEM DO IT TWICE

    // State to track if the password has been validated
    const [isPasswordValidated, setIsPasswordValidated] = useState(false);
    // Define the deleteUser mutation and handle loading and error states
    const [deleteUser, { loading: deleteLoading, error: deleteError }] =
        useMutation(DELETE_USER_MUTATION);

    // State for the password input field
    const [password, setPassword] = useState("");
    // Define the signIn mutation and handle data, error, and loading states
    const [newSignIn, { data, error: signInError, loading: signInLoading }] =
        useMutation(SIGNIN_MUTATION);
    // State to track if the sign-in prompt should be displayed
    const [signInPrompt, setSignInPrompt] = useState(false);
    // useRouter hook to enable navigation after successful deletion
    const router = useRouter();

    // Function to validate the password
    const validatePassword = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user) {
            alert("You Must Be Signed In");
            return;
        }

        // Call the signIn mutation with the entered password
        let res = await newSignIn({
            variables: {
                username: user.username,
                password: password,
            },
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });

        // Check if the password is correct and update the state accordingly
        if (
            res.data.authenticateUserWithPassword.__typename ===
            "UserAuthenticationWithPasswordSuccess"
        ) {
            setIsPasswordValidated(true);
            setSignInPrompt(false);
            setPassword("");
        }
    };

    // Function to delete the account
    const deleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser({ variables: { id: user.id } });
                alert("User deleted successfully.");
                router.push("/");
            } catch (e) {
                console.error("Error deleting user:", e);
                alert(
                    "An error occurred while deleting the user. Please try again."
                );
            }
        }
    };
    if (+user.id === -1) {
        return <a href="/user/signin"><h3 className="text-jet dark:text-snow font-bold text-2xl w-full text-center">Please Sign In</h3></a>
    }

    return (
        <>
            
            {deleteError && (
                <span className="text-persianRed font-bold font-open text-lg">
                    Error Deleting Account
                </span>
            )}
            <button
                onClick={() => {
                    if (
                        isPasswordValidated &&
                        data?.authenticateUserWithPassword &&
                        data?.authenticateUserWithPassword.item.username ===
                            user.username
                    ) {
                        deleteAccount();
                    } else {
                        setSignInPrompt(true);
                    }
                }}
                className="text-lg font-semibold  w-full text-center text-red-600 hover:text-red-800 focus:outline-none"
            >
                {isPasswordValidated
                    ? "Confirm Account Deletion"
                    : "Delete Account"}
            </button>
            {signInPrompt && (
                <div className="bg-snow font-open rounded-lg p-6">
                    <form
                        onSubmit={(e) => {
                            validatePassword(e);
                        }}
                    >
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Enter Your Current Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            autoComplete="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className={`block w-full mt-1 px-3 py-2 border border-gray-300 ${
                                signInError
                                    ? "border-persianRed"
                                    : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"`}
                        />
                        <button className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Submit
                        </button>
                        {signInError  && (
                            <span className="font-bold text-persianRed text-lg">
                                Error: Invalid Password
                            </span>
                        )}
                    </form>
                </div>
            )}
        </>
    );
};

export default DeleteButton;
