import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import useForm from "../../../tools/useForm";
import { CURRENT_USER_QUERY } from "../User";
import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import { stringifyForDisplay } from "@apollo/client/utilities";
import PasswordChecklist from "react-password-checklist";
import { capitalize } from "../../../tools/capitalize";

interface signUp {
    username: string;
    password: string;
}


export const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($username: String!, $password: String!) {
        createUser(data: { username: $name, password: $password }) {
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
    });

    const [signup, { data, error, loading }] = useMutation(SIGNUP_MUTATION);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let vars = {
            username: inputs.username,
            password: inputs.password,
        };

        if (inputs.password.length < 8) {
            setError("Password required to be a minimum of 8 characters");
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
        <form method="POST" onSubmit={
            
            handleSubmit
            
            }>
            <h2>Sign Up For An Account</h2>
            {submitError ? <div>{submitError}</div> : <></>}
            <fieldset>
                {data?.createUser && (
                    <p data-testid="success-signup-message">
                        Signed Up With {data.createUser.email} - Please Go Ahead
                        And Sign In
                    </p>
                )}

                <div className="input">
                    <input
                        type="name"
                        name="name"
                        placeholder="Name"
                        autoComplete="name"
                        value={inputs.username}
                        onChange={handleChange}
                        className="input_field"
                        required
                    />
                    <label className="input_label" htmlFor="name">
                        Username
                    </label>
                </div>

                <div className="input">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="password"
                        value={inputs.password}
                        onChange={handleChange}
                        className="input_field"
                        required
                    />
                    <label className="input_label" htmlFor="password">
                        Password
                    </label>
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
                <button type="submit" disabled={!isValid} aria-disabled={!isValid}>Sign Up</button>
            </fieldset>
        </form>
    );
}
