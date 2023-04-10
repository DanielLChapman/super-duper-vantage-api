import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import useForm from "../../../tools/useForm";
import { CURRENT_USER_QUERY } from "../User";
import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import { stringifyForDisplay } from "@apollo/client/utilities";
import PasswordChecklist from "react-password-checklist";
import { capitalize } from "../../../tools/capitalize";
import Link from "next/link";

interface signUp {
    username: string;
    password: string;
    apiKey: string;
}

export const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION(
        $username: String!
        $apiKey: String!
        $password: String!
    ) {
        createUser(
            data: { username: $username, password: $password, apiKey: $apiKey }
        ) {
            id
            username
        }
    }
`;

export default function SignUp(props) {
    let [submitError, setError] = useState("");
    let [isValid, setIsValid] = useState(false);

    const {
        inputs,
        handleChange,
        resetForm,
    }: {
        inputs: signUp;
        handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
        resetForm: () => void;
    } = useForm({
        username: "",
        password: "",
        apiKey: "",
    });

    const [signup, { data, error, loading }] = useMutation(SIGNUP_MUTATION);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let vars = {
            username: inputs.username,
            password: inputs.password,
            apiKey: inputs.apiKey,
        };

        if (inputs.password.length < 8) {
            setError("Password required to be a minimum of 8 characters");
            return;
        }

        if (inputs.apiKey.length === 0) {
            setError("Need an API key");
            return;
        }

        let errorMessage;
        const res = await signup({
            variables: vars,
        }).catch((error) => {
            //let a = error.graphQLErrors[0].message.splice(0,6);

            errorMessage = error.graphQLErrors[0];
            let a;
            let b;
            try {
                a = error.graphQLErrors[0].message.substring(0, 6);
                b = Object.keys(errorMessage.extensions.exception.keyValue)[0];
            } catch (e) {
                console.log(error.graphQLErrors[0]);
            }
            if (a === "E11000") {
                return setError(
                    `${capitalize(b)} is already taken, please choose a new one`
                );
            }
        });
        if (errorMessage) {
            console.log(errorMessage);
            return;
        }
        resetForm();
    };

    return (
        <form method="POST" onSubmit={handleSubmit}>
            {submitError ? <div>{submitError}</div> : <></>}
            <fieldset className="flex flex-col space-y-6">
                {data?.createUser && (
                    <p data-testid="success-signup-message">
                        Signed Up With {data.createUser.email} - Please Go Ahead
                        And Sign In
                    </p>
                )}

                <div className="input flex flex-col-reverse">
                    <input
                        type="name"
                        name="username"
                        placeholder="username"
                        autoComplete="username"
                        value={inputs.username}
                        onChange={handleChange}
                        className="input_field font-merriweather"
                        required
                    />
                    <label
                        className="input_label font-semibold text-lg font-open"
                        htmlFor="name"
                    >
                        Username
                    </label>
                </div>

                <div className="input flex flex-col-reverse">
                    <input
                        type="text"
                        name="apiKey"
                        placeholder="apiKey"
                        autoComplete="apiKey"
                        value={inputs.apiKey}
                        onChange={handleChange}
                        className="input_field font-merriweather"
                        required
                    />
                    <label
                        className="input_label font-semibold text-lg font-open"
                        htmlFor="apiKey"
                    >
                        API Key from{" "}
                        <a
                            target="_blank"
                            className="text-persianGreen dark:text-electricBlue"
                            href="https://www.alphavantage.co/"
                        >
                            Alpha Vantage (free)
                        </a>
                    </label>
                </div>

                <div className="input flex flex-col">
                    <label
                        className="input_label font-semibold text-lg font-open"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="password"
                        value={inputs.password}
                        onChange={handleChange}
                        className="input_field font-merriweather"
                        required
                    />
                    <div className="mt-2 border-2 border-gray-300 p-2 font-open">
                        <PasswordChecklist
                            rules={[
                                "minLength",
                                "specialChar",
                                "number",
                                "capital",
                            ]}
                            minLength={5}
                            value={inputs.password}
                            onChange={(isValid) => setIsValid(isValid)}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={!isValid}
                    aria-disabled={!isValid}
                    className="cursor-pointer transform rounded-lg bg-electricBlue dark:bg-delftBlue dark:text-white py-2 font-bold duration-300 hover:bg-delftBlue hover:text-white dark:hover:bg-electricBlue dark:hover:text-jet"
                >
                    Sign Up
                </button>
            </fieldset>
        </form>
    );
}
