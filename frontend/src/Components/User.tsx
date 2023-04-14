import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { user as userType } from "../../tools/lib";
import { useLocalStorage } from "./Tools/useLocalStorage";

export type backendtype = {
    data: userType;
};

let backend: backendtype = {
    data: {
        id: -1 + "",
        username: "Demo",
        apiKey: "demo",
        money: 100000,
        email: "",
        trades: [],
        shortTermTaxes: 35,
        longTermTaxes: 15,
        stocks: [],
        darkMode: false,
        useTaxes: false,
    },
};

export const CURRENT_USER_QUERY = gql`
    query {
        authenticatedItem {
            ... on User {
                id
                username
                shortTermTaxes
                longTermTaxes
                money
                apiKey
                email
                darkMode
                useTaxes
                trades {
                    id
                    symbol
                    amount
                    price
                    buySell
                    dateOfTrade
                }
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
export function useUser(): { user: userType; setUser: (value: backendtype) => void } {
    const { data } = useQuery(CURRENT_USER_QUERY);
    const [storedUser, setStoredUser] = useLocalStorage<backendtype | null>(
        "user",
        null
    );

    if (!data || !data.authenticatedItem) {
        if (!storedUser) {
            setStoredUser(backend);
            return { user: backend.data, setUser: setStoredUser };
        } else {
            return { user: storedUser.data, setUser: setStoredUser };
        }
    }

    return { user: data.authenticatedItem, setUser: setStoredUser };
}

export function getUserAPIKey() {
    const { user } = useUser();
    return user.apiKey;
}
/* old 
export function useUser() {
    let { data } = useQuery(CURRENT_USER_QUERY);

    if (!data || !data.authenticatedItem) {
        data = {...backend.data};
    }

    return data.authenticatedItem || data;
}

export function getUserAPIKey() {
    let { data } = useQuery(CURRENT_USER_QUERY);

    if (!data || !data.authenticatedItem) {
        data = {...backend.data};
    }

    return data.authenticatedItem.apiKey || data.apiKey;
}
*/
