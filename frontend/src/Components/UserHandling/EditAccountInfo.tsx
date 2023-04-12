// EditAccountInfo.tsx
import React, { useState, MouseEvent, FormEvent } from "react";
import { user } from "../../../tools/lib";
import { CURRENT_USER_QUERY } from "../User";
import { useMutation } from "@apollo/client";
import { SIGNIN_MUTATION } from "./SignIn";

interface EditAccountInfoProps {
    onUpdate: (username: string, password: string) => void;
    user: user;
}

const EditAccountInfo: React.FC<EditAccountInfoProps> = ({
    onUpdate,
    user,
}) => {
    const [isPasswordValidated, setIsPasswordValidated] = useState(false);
    const [password, setPassword] = useState("");
    const [newUsername, setNewUsername] = useState(user?.username || "");
    const [newPassword, setNewPassword] = useState("");

    const [newSignIn, { data, error, loading }] = useMutation(SIGNIN_MUTATION);

    const validatePassword = async (event: FormEvent) => {
        // Call your Apollo GraphQL mutation to check the password here.
        // If the password is correct, set isPasswordValidated to true.
        event.preventDefault();
        if (!user) {
            alert("You Must Be Signed In");

            return;
        }

        let res = await newSignIn({
            variables: {
                username: user.username,
                password,
            },
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });

        if (
            res.data.authenticateUserWithPassword.__typename ===
            "UserAuthenticationWithPasswordSuccess"
        ) {
            setIsPasswordValidated(true);
        }
    };

    const handleUpdate = () => {
        onUpdate(newUsername, newPassword);
    };

    console.log(data);

    return (
        <div className="bg-snow font-open rounded-lg p-6">
            {isPasswordValidated &&
            data?.authenticateUserWithPassword &&
            data?.authenticateUserWithPassword.item.username ===
                user.username ? (
                <>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                    }}>
                        <label
                            htmlFor="newUsername"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Change Username
                        </label>
                        <input
                            id="newUsername"
                            type="text"
                            placeholder="New username"
                            autoComplete="username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Update Username
                        </button>
                    </form>

                    <form onSubmit={(e) => {
                        e.preventDefault()
                    }}>
                        <label
                            htmlFor="newPassword"
                            className="block mt-4 text-sm font-medium text-gray-700"
                        >
                            Change Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            autoComplete="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                        className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Update Password
                    </button>
                    </form>
                </>
            ) : (
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
                        className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default EditAccountInfo;
