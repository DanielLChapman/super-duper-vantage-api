import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useCallback, useState } from "react";
import { stock, tradeHistory, user as userType } from "../../tools/lib";
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
export function useUser(): {
    user: userType;
    setUser: (value: backendtype) => void;
} {
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

export function useStock(): {
    addStock: (stockData: stock, tradeData: tradeHistory) => void;
    sellUserStock: (tradeData: tradeHistory, moneyToAdd: number) => void;
    removeStock: (stockId: string, amountToRemove?: number) => void;
} {
    const { user, setUser } = useUser();

    const addStock = useCallback(
        (stockData: stock, tradeData: tradeHistory) => {
            if (user.money < (stockData.price * stockData.amount)/100) {
                return;
            }
            // Add the stock to the user's stocks array
            const updatedStocks = user.stocks
                ? [...user.stocks, stockData]
                : [stockData];

            // Add the trade to the user's trade history
            const updatedTrades = user.trades
                ? [...user.trades, tradeData]
                : [tradeData];

            // Update the user object with the new stocks and trades
            const updatedUser = {
                ...user,
                stocks: updatedStocks,
                trades: updatedTrades,
                money: user.money - ((stockData.price * stockData.amount)/100)
            };

            // Wrap the updated user object in a data property to match the backendtype
            const updatedUserBackend = { data: updatedUser };

            // Save the updated user object to local storage
            console.log(updatedUser)
            setUser(updatedUserBackend);
        },
        [user, setUser]
    );

    const sellUserStock = useCallback(
        (tradeData: tradeHistory, moneyToAdd: number) => {
            // Add the trade to the user's trade history
            const updatedTrades = user.trades
                ? [...user.trades, tradeData]
                : [tradeData];
            // Update the user's money based on the stock's value
            const updatedMoney = user.money + moneyToAdd/100;

            // Update the user object with the new stocks array and updated money
            const updatedUser = {
                ...user,
                trades: updatedTrades,
                money: updatedMoney,
            };

            // Wrap the updated user object in a data property to match the backendtype
            const updatedUserBackend = { data: updatedUser };

            // Save the updated user object to local storage
            setUser(updatedUserBackend);
        },
        [user, setUser]
    );

    // Helper function to update the user's money and trade history
    const updateUserMoneyAndTrades = (
        stockValue: number,
        trade: tradeHistory
    ) => {
        // Update the user's money based on the stock's value
        const updatedMoney = user.money + stockValue;

        // Add the trade to the user's trade history
        const updatedTrades = user.trades ? [...user.trades, trade] : [trade];

        // Update the user object with the updated money and updated trades
        const updatedUser = {
            ...user,
            money: updatedMoney,
            trades: updatedTrades,
        };

        // Wrap the updated user object in a data property to match the backendtype
        const updatedUserBackend = { data: updatedUser };

        // Save the updated user object to local storage
        setUser(updatedUserBackend);
    };

    const removeStock = useCallback(
        (stockId: string, amountToRemove?: number) => {
            if (!user.stocks) return;

            // Find the stock with the specified ID
            const stockToRemove = (user.stocks as stock[]).find(
                (stock) => stock.id === stockId
            );

            if (!stockToRemove) return;

            // Calculate the value of the removed stock amount (amountToRemove * price)
            const stockValue =
                (amountToRemove || stockToRemove.amount) * stockToRemove.price;

            // Create a trade object using the stockToRemove data and amountToRemove or stockToRemove.amount
            const trade: tradeHistory = {
                id: (Date.now() + Math.random()).toString(36), // Generate a random ID
                symbol: stockToRemove.symbol,
                amount: amountToRemove && amountToRemove < stockToRemove.amount ? amountToRemove : stockToRemove.amount,
                price: stockToRemove.price,
                dateOfTrade: new Date(), // Set the current date as the date of the trade
                buySell: false, // Set to false for sell
            };

            // If amountToRemove is not specified or greater than the stock's amount, remove the entire stock
            if (!amountToRemove || amountToRemove >= stockToRemove.amount) {
                // Filter the user's stocks array to exclude the stock with the specified ID
                const updatedStocks = (user.stocks as stock[]).filter(
                    (stock) => stock.id !== stockId
                );

                // Update the user object with the new stocks array
                const updatedUser = { ...user, stocks: updatedStocks };

                // Wrap the updated user object in a data property to match the backendtype
                const updatedUserBackend = { data: updatedUser };

                // Save the updated user object to local storage
                setUser(updatedUserBackend);
            } else {
                // Update the stock's amount by subtracting the amountToRemove
                const updatedStockAmount =
                    stockToRemove.amount - amountToRemove;

                // Update the user's stocks array with the new stock amount
                const updatedStocks = user.stocks.map((stock) =>
                    stock.id === stockId
                        ? { ...stock, amount: updatedStockAmount }
                        : stock
                );

                // Update the user object with the new stocks array
                const updatedUser = { ...user, stocks: updatedStocks };

                // Wrap the updated user object in a data property to match the backendtype
                const updatedUserBackend = { data: updatedUser };

                // Save the updated user object to local storage
                setUser(updatedUserBackend);
            }

            // Call the helper function to update the user's money and trade history
            updateUserMoneyAndTrades(stockValue, trade);
        },
        [user, setUser]
    );

    return { addStock, sellUserStock, removeStock };
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
