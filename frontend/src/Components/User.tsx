import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { user as userType } from "../../tools/lib";

type backendtype = {
    data: userType
} 

let backend: backendtype = {
    data: {
        id: -1 + "",
        username: "Demo",
        apiKey: "demo",
        money: 100000,
        trades: [],
        stocks: [],
    },
};

export const CURRENT_USER_QUERY = gql`
    query {
        authenticatedItem {
            ... on User {
                id 
                username
                money
                apiKey
                trades {
                    id
                    symbol
                    amount
                    price
                    buySell
                    dateOfTrade
                },
                stocks {
                    id
                    symbol
                    amount
                    price
                    dateOfTrade
                    createdAt
                }
            }
        }
    }
`;

export function useUser() {
    let { data } = useQuery(CURRENT_USER_QUERY);

    if (!data || !data.authenticatedItem) {
        data = {...backend.data};
    }

    return data.authenticatedItem || data;
}
