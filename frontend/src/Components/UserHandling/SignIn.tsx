import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import useForm from "../../../tools/useForm";
import { CURRENT_USER_QUERY } from "../User";
import Router from "next/router";

export const SIGNIN_MUTATION = gql`
    mutation SignInMutation($username: String!, $password: String!) {
        authenticateUserWithPassword(username: $username, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
                item {
                    id
                    username
                }
            }
            ... on UserAuthenticationWithPasswordFailure {
                message
            }
        }
    }
`;

const SignIn: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [signIn, { data, error, loading }] = useMutation(SIGNIN_MUTATION);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let res = await signIn({
            variables: { username, password },
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });
        console.log(res);
        if (
            res.data.authenticateUserWithPassword.__typename ===
            "UserAuthenticationWithPasswordSuccess"
        ) {
            alert("success");
            Router.push({
                pathname: `/`,
            });
        }
    };

    const errorM =
        data?.authenticateUserWithPassword.__typename ===
        "UserAuthenticationWithPasswordFailure"
            ? data?.authenticateUserWithPassword
            : undefined;

    return (
        <form
            onSubmit={handleSubmit}
            aria-disabled={loading}
            className="flex flex-col space-y-6"
        >
            {errorM && (
                <section className="form-error-message">
                    <span>Error Signing In: {errorM.message}</span>
                </section>
            )}
            <div className="w-full transform border-b-2 flex flex-col bg-transparent text-lg duration-300 focus-within:border-indigo-500">
                <label
                    className="input_label font-semibold text-lg font-open"
                    htmlFor="name"
                >
                    Username
                </label>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none font-merriweather"
                />
            </div>
            <div className="w-full transform border-b-2 flex flex-col bg-transparent text-xl duration-300 focus-within:border-indigo-500">
                <label
                    className="input_label font-semibold text-lg font-open"
                    htmlFor="name"
                >
                    Password
                </label>
                <input
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none font-merriweather text-xl"
                />
            </div>
            <button
                className="transform rounded-lg bg-electricBlue dark:bg-delftBlue dark:text-white py-2 font-bold duration-300 hover:bg-delftBlue hover:text-white dark:hover:bg-electricBlue dark:hover:text-jet"
                disabled={loading}
                aria-disabled={loading}
                type="submit"
            >
                Sign In
            </button>
        </form>
    );
};

export default SignIn;
