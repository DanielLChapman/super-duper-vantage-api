// EditAccountInfo.tsx
import React, { useState, MouseEvent, FormEvent } from "react";
import { user } from "../../../tools/lib";
import { CURRENT_USER_QUERY } from "../User";
import { gql, useMutation } from "@apollo/client";
import { SIGNIN_MUTATION } from "./SignIn";
import { MutationTuple } from '@apollo/client';
import UpdateFieldForm from "./UpdateFieldForm";
//import ReactPasswordChecklist from "react-password-checklist";


interface EditAccountInfoProps {
    formValues: {
      password: string;
      newUsername: string;
      newPassword: string;
      newEmail: string;
      newApiKey: string;
      shortTermTaxes: number;
      longTermTaxes: number;
    };
    setFormValues: React.Dispatch<React.SetStateAction<{
      password: string;
      newUsername: string;
      newPassword: string;
      newEmail: string;
      newApiKey: string;
      shortTermTaxes: number;
      longTermTaxes: number;
    }>>;
    setFormErrors: React.Dispatch<React.SetStateAction<{
      username: string;
      password: string;
      email: string;
      api: string;
      shortTermTaxes: string;
      longTermTaxes: string;
    }>>;
    formErrors: {
      username: string;
      password: string;
      email: string;
      api: string;
      shortTermTaxes: string;
      longTermTaxes: string;
    };
    handleUpdate: (type: string) => Promise<void>;
    user: user;
    data: any; // Replace 'any' with the specific type of data returned by the 'authenticateUserWithPassword' mutation.
    newSignIn: MutationTuple<any, any>; // Replace the two 'any' types with the specific types of your SIGNIN_MUTATION.
  }

const EditAccountInfo: React.FC<EditAccountInfoProps> = ({
    formValues,
    formErrors,
    setFormValues,
    setFormErrors,
    handleUpdate,
    user,
    data,
    newSignIn
}) => {
    const [isPasswordValidated, setIsPasswordValidated] = useState(false);


    let [isValid, setIsValid] = useState(true);

    const [signInError, setSignInError] = useState("");
    

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
                password: formValues.password,
            },
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });

        if (
            res.data.authenticateUserWithPassword.__typename ===
            "UserAuthenticationWithPasswordSuccess"
        ) {
            setSignInError("");
            setIsPasswordValidated(true);
        } else {
            setSignInError("Invalid Password");
        }
    };
    /*
    const handleUpdate = async (type) => {
        if (!isValid && type === "password") {
            setFormErrors({
                ...formErrors,
                password: "Not a Valid Password",
            });
            return;
        }

        let variables: UserUpdateInput = { id: user?.id };
        switch (type) {
            case "username":
                variables.username = formValues.newUsername;
                break;
            case "password":
                variables.password = formValues.newPassword;
                break;
            case "email":
                //weird error, should be caught on the backend but it flashes an error that isn't fun for the user
                //look into later, finish this now
                variables.email = formValues.newEmail;
                break;
            case "api":
                variables.apiKey = formValues.newApiKey;
                break;
            default:
                console.log(type);
        }

        let res = await updateUser({
            variables,
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });

        if (res.data) {
            alert("Success");
            if (type === "password") {
                setFormValues({
                    ...formValues,
                    password: formValues.newPassword,
                });
            }
            if (type === "username") {
                let res2 = await newSignIn({
                    variables: {
                        username: formValues.newUsername,
                        password: formValues.password,
                    },
                    refetchQueries: [{ query: CURRENT_USER_QUERY }],
                });
            }
            setFormErrors({
                ...formErrors,
                [type]: "",
            });
        } else {
            alert("huh");
            setFormErrors({
                ...formErrors,
                [type]: res.errors,
            });
        }
    };*/

    const updateFormValue = (key: string, value: string) => {
        setFormValues((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <div className="bg-snow font-open rounded-lg p-6">
            {isPasswordValidated &&
            data?.authenticateUserWithPassword &&
            data?.authenticateUserWithPassword.item.username ===
                user.username ? (
                <>
                    {" "}
                    <div className="-mt-4">
                        <UpdateFieldForm
                            label="Change Username"
                            placeholder="New username"
                            value={formValues.newUsername}
                            error={formErrors["username"]}
                            fieldType="newUsername"
                            onChange={(value) =>
                                updateFormValue("newUsername", value)
                            }
                            onSubmit={() => handleUpdate("username")}
                        />
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate("password");
                        }}
                    >
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
                            value={formValues.newPassword}
                            onChange={(e) =>
                                updateFormValue("newPassword", e.target.value)
                            }
                            className={`block w-full mt-1 px-3 py-2 border ${
                                formErrors["password"]
                                    ? "border-persianRed"
                                    : "border-gray-300"
                            }  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 `}
                        />
                        <div className="mt-2 border-2 border-gray-300 p-2 font-open">
                            {/*  <ReactPasswordChecklist
                                rules={[
                                    "minLength",
                                    "specialChar",
                                    "number",
                                    "capital",
                                ]}
                                minLength={5}
                                value={newPassword}
                                onChange={(isValid) => setIsValid(isValid)}
                            />*/}
                        </div>
                        <button className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Update Password
                        </button>
                        {formErrors["password"] && (
                            <span className="font-bold text-persianRed text-lg">
                                Error: {formErrors["password"]}
                            </span>
                        )}
                    </form>
                    <UpdateFieldForm
                        label="Add / Change Email (for recovery)"
                        placeholder="New Email"
                        value={formValues.newEmail}
                        error={formErrors["email"]}
                        fieldType="newEmail"
                        onChange={(value) => updateFormValue("newEmail", value)}
                        onSubmit={() => handleUpdate("email")}
                    />
                    <UpdateFieldForm
                        label="Add / Change Apikey"
                        placeholder="New APIKey"
                        value={formValues.newApiKey}
                        error={formErrors["apikey"]}
                        fieldType="newApiKey"
                        onChange={(value) =>
                            updateFormValue("newApiKey", value)
                        }
                        onSubmit={() => handleUpdate("api")}
                    />
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
                        value={formValues.password}
                        autoComplete="password"
                        onChange={(e) =>
                            updateFormValue("password", e.target.value)
                        }
                        className={`block w-full mt-1 px-3 py-2 border border-gray-300 ${
                            signInError
                                ? "border-persianRed"
                                : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"`}
                    />
                    <button className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Submit
                    </button>
                    {signInError.length > 0 && (
                        <span className="font-bold text-persianRed text-lg">
                            Error: Invalid Password
                        </span>
                    )}
                </form>
            )}
        </div>
    );
};

export default EditAccountInfo;
