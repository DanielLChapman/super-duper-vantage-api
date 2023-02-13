import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { tradeHistory, user } from "../../../tools/lib";
import StockCard from "./DataStockDisplay";
import TradeCard from "./DataTradeDisplay";

const GET_TRADES = gql`
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

const DataContainer: React.FC<{
    verifiedDates: boolean;
    selector: string | "day" | "monthly" | "weekly" | "intraday";
    user: user;
    dateToUse: { month: number; day: number; year: number };
}> = ({ verifiedDates, user, dateToUse, selector }) => {
    if (!user) {
        return <span>Loading....</span>;
    }
    const [showStocks, setShowStocks] = useState(false);
    const [showTrades, setShowTrades] = useState(false);
    const [checkedStocks, setCheckedStocks] = useState([]);

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { loading, error, data } = useQuery(GET_TRADES, {
        variables: {
            userID: user.id,
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
        },
    });

    let trades = [] as tradeHistory[];

    if (loading || error)
    {
        trades = [];
    } else {
        trades = data.trades;
    }

    

    const totalTrades = trades.length;

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
                        {showStocks && (
                            <>
                                {user.stocks.length > 0 ? (
                                    <ul>
                                        {user.stocks.map((stock, index) => (
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
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No stocks found</p>
                                )}
                            </>
                        )}
                    </li>
                    <li>
                        <span onClick={() => setShowTrades(!showTrades)}>
                            Trades
                        </span>
                        {!loading && !error && showTrades && (
                            <>
                                {data.trades.length > 0 ? (
                                    <>
                                        <ul>
                                            {data.trades.map((trade, index) => (
                                                <li key={index}>
                                                    <TradeCard trade={trade} />
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            disabled={
                                                totalTrades < itemsPerPage
                                            }
                                            onClick={() => setPage(page + 1)}
                                        >
                                            Next
                                        </button>
                                    </>
                                ) : (
                                    <p>No trades found</p>
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
