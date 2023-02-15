import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { stock, tradeHistory, user } from "../../../tools/lib";
import StockCard from "./DataStockDisplay";
import TradeCard from "./DataTradeDisplay";

export const GET_TRADES = gql`
    query Trades($userID: ID!, $limit: Int!, $offset: Int!) {
        trades(
            where: { owner: { id: { equals: $userID } } }
            skip: $offset
            take: $limit
            orderBy: { dateOfTrade: desc }
        ) {
            id
            symbol
            amount
            price
            buySell
            dateOfTrade
        }
    }
`;

export const GET_STOCKS = gql`
    query Stocks($userID: ID!, $limit: Int!, $offset: Int!) {
        stocks(
            where: { owner: { id: { equals: $userID } } }
            skip: $offset
            take: $limit
            orderBy: { dateOfTrade: desc }
        ) {
            id
            symbol
            amount
            price
            dateOfTrade
        }
    }
`;

const DataContainer: React.FC<{
    verifiedDates: boolean;
    selector: string | "day" | "monthly" | "weekly" | "intraday";
    user: user;
    dateToUse: { month: number; day: number; year: number };
    checkedStocks: Array<[string, number]>;
    setCheckedStocks: React.Dispatch<
        React.SetStateAction<Array<[string, number]>>>
}> = ({ verifiedDates, user, dateToUse, selector, checkedStocks, setCheckedStocks }) => {
    if (!user) {
        return <span>Loading....</span>;
    }
    const [showStocks, setShowStocks] = useState(false);
    const [showTrades, setShowTrades] = useState(false);
    

    const [tradePage, setTradePage] = useState(1);
    const [tradeItemsPerPage, setTradeItemsPerPage] = useState(10);

    const [stockPage, setStockPage] = useState(1);
    const [stockItemsPerPage, setStockItemsPerPage] = useState(10);

    const {
        loading: tradesLoading,
        error: tradesError,
        data: tradesData,
    } = useQuery(GET_TRADES, {
        variables: {
            userID: user.id,
            limit: tradeItemsPerPage,
            offset: (tradePage - 1) * tradeItemsPerPage,
        },
    });

    const {
        loading: stockLoading,
        error: stockError,
        data: stockData,
    } = useQuery(GET_STOCKS, {
        variables: {
            userID: user.id,
            limit: stockItemsPerPage,
            offset: (stockPage - 1) * stockItemsPerPage,
        },
    });


    let trades = [] as tradeHistory[];
    let stocks = [] as stock[];

    if (tradesLoading || tradesError) {
        trades = [];
    } else {
        trades = tradesData.trades;
    }

    if (stockLoading || stockError) {
        stocks = [];
    } else {
        stocks = stockData.stocks;
    }

    const totalTrades = trades.length;
    const totalStocks = stocks.length;



    useEffect(() => {
        setCheckedStocks([]);
    }, [dateToUse, selector]);

    return (
        <>
            <h2>Stocks // Trade History</h2>
            <section className="data-container">
                <ul>
                    <li>
                        <span onClick={() => setShowStocks(!showStocks)}>
                            Stocks
                        </span>
                        {!stockError && !stockLoading && showStocks && (
                            <>
                                {stocks.length > 0 ? (
                                    <ul>
                                        {stocks.map((stock, index) => (
                                            <li key={index}>
                                                <StockCard
                                                    checkedStocks={
                                                        checkedStocks
                                                    }
                                                    setCheckedStocks={
                                                        setCheckedStocks
                                                    }
                                                    verifiedDates={
                                                        verifiedDates
                                                    }
                                                    apiKey={user.apiKey}
                                                    dateToUse={dateToUse}
                                                    selector={selector}
                                                    stock={stock}
                                                    userID={user.id}
                                                    stockPage={stockPage}
                                                    stockItemsPerPage={stockItemsPerPage}
                                                    tradePage={stockPage}
                                                    tradeItemsPerPage={stockItemsPerPage}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No stocks found</p>
                                )}
                                {totalStocks > 0 && (
                                    <>
                                        <button
                                            disabled={stockPage === 1}
                                            onClick={() =>
                                                setTradePage(stockPage - 1)
                                            }
                                        >
                                            Previous
                                        </button>
                                        <button
                                            disabled={
                                                totalStocks < stockItemsPerPage
                                            }
                                            onClick={() =>
                                                setTradePage(tradePage + 1)
                                            }
                                        >
                                            Next
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </li>
                    <li>
                        <span onClick={() => setShowTrades(!showTrades)}>
                            Trades
                        </span>
                        {!tradesLoading && !tradesError && showTrades && (
                            <>
                                {trades.length > 0 ? (
                                    <>
                                        <ul>
                                            {trades.map((trade, index) => (
                                                <li key={index}>
                                                    <TradeCard trade={trade} />
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p>No trades found</p>
                                )}
                                {totalTrades > 0 && (
                                    <>
                                        <button
                                            disabled={tradePage === 1}
                                            onClick={() =>
                                                setTradePage(tradePage - 1)
                                            }
                                        >
                                            Previous
                                        </button>
                                        <button
                                            disabled={
                                                totalTrades < tradeItemsPerPage
                                            }
                                            onClick={() =>
                                                setTradePage(tradePage + 1)
                                            }
                                        >
                                            Next
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </li>
                </ul>
            </section>
        </>
    );
};

export default DataContainer;
