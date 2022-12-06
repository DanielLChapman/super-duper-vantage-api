import React, { useState } from "react";
import { user as userType } from "../../tools/lib";

type backendtype = {
    data: userType
} 

let backend: backendtype = {
    data: {
        id: Math.random() * 1000000 + " ",
        username: "Demo",
        apiKey: "demo",
        money: 100000,
        tradeHistory: [
            {
                id: Math.random() * 1000000 + " ",
                symbol: "IBM",
                buySell: "sell",
                amount: 1000,
                price: 137.52,
                date: new Date(Date.now()),
            },
        ],
        currentStocks: [],
    },
};

export function useUser() {
    let data: userType;
    //const { data } = useQuery(CURRENT_USER_QUERY);

    if (!data) {
        data = {...backend.data};
    }

    return data;
}
