import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import useForm from "../../../tools/useForm";
import { CURRENT_USER_QUERY } from "../User";
import { useState } from "react";

export const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($username: String!, $password: String!) {
        createUser(data: { username: $name, password: $password }) {
            id
            username
        }
    }
`;
