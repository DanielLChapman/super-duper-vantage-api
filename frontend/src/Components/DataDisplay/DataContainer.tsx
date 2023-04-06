import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { stock, tradeHistory, user } from "../../../tools/lib";
import roundToTwo from "../../../tools/roundToTwo";
import { CURRENT_USER_QUERY } from "../User";
import StockCard, {
    SELL_ALL_HANDLER,
    SELL_SOME_HANDLER,
} from "./DataStockDisplay";
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
    checkedStocks: Array<[string, number, string]>;
    storedCache: any;
    setCheckedStocks: React.Dispatch<
        React.SetStateAction<Array<[string, number, string]>>
    >;
}> = ({
    verifiedDates,
    user,
    dateToUse,
    selector,
    checkedStocks,
    setCheckedStocks,
    storedCache,
}) => {
    if (!user) {
        return <span>Loading....</span>;
    }
    const [showStocks, setShowStocks] = useState(false);
    const [showTrades, setShowTrades] = useState(false);

    const [tradePage, setTradePage] = useState(1);
    const [tradeItemsPerPage, setTradeItemsPerPage] = useState(10);

    const [stockPage, setStockPage] = useState(1);
    const [stockItemsPerPage, setStockItemsPerPage] = useState(10);
    const [verifyThePrice, setTheVerifiedPrice] = useState(-1);

    const [
        sellAllStock,
        { data: sellAllData, error: sellAllError, loading: sellAllLoading },
    ] = useMutation(SELL_ALL_HANDLER);

    const [
        sellSomeStock,
        { data: sellSomeData, error: sellSomeError, loading: sellSomeLoading },
    ] = useMutation(SELL_SOME_HANDLER);

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

    const handleSell = async (stock: stock, sellAmount) => {
        if (verifyThePrice === -1) {
            return;
        }
        let convertedPrice = +(roundToTwo(+verifyThePrice) * 100).toFixed(0);

        let res;
        if (stock.amount === sellAmount) {
            res = await sellSomeStock({
                variables: {
                    stockPrice: convertedPrice,
                    stockSymbol: stock.symbol,
                    stockID: stock.id,
                    amount: sellAmount,
                    dateOfTrade: Date.now() + "",
                },
                refetchQueries: [
                    { query: CURRENT_USER_QUERY },
                    {
                        query: GET_STOCKS,
                        variables: {
                            userID: user.id,
                            limit: stockItemsPerPage,
                            offset: (stockPage - 1) * stockItemsPerPage,
                        },
                    },
                    {
                        query: GET_TRADES,
                        variables: {
                            userID: user.id,
                            limit: tradeItemsPerPage,
                            offset: (tradePage - 1) * tradeItemsPerPage,
                        },
                    },
                ],
            });
        } else {
            res = await sellAllStock({
                variables: {
                    stockPrice: convertedPrice,
                    stockSymbol: stock.symbol,
                    stockID: stock.id,
                    dateOfTrade: Date.now() + "",
                },
                refetchQueries: [
                    { query: CURRENT_USER_QUERY },
                    {
                        query: GET_STOCKS,
                        variables: {
                            userID: user.id,
                            limit: stockItemsPerPage,
                            offset: (stockPage - 1) * stockItemsPerPage,
                        },
                    },
                    {
                        query: GET_TRADES,
                        variables: {
                            userID: user.id,
                            limit: tradeItemsPerPage,
                            offset: (tradePage - 1) * tradeItemsPerPage,
                        },
                    },
                ],
            });
        }

        if (res.data) {
            alert("Success!");
        }
    };

    let t = storedCache?.cacheStorages?.map((x) => {
        return [x.symbol, x.price, x.identifier];
    })
    
    let newCheckedStocks = [...checkedStocks];
    if (t && t.length > 0) {
        newCheckedStocks = [...newCheckedStocks, ...t]
    }

    useEffect(() => {
        setCheckedStocks([]);
    }, [dateToUse, selector]);

    return (
        <div className="data-container container flex flex-col font-open">
            <div className="stock-search-view-container border-4 border-t-0 border-electricBlue rounded-lg container max-w-[1500px] mx-auto p-6 flex flex-col">
                <h2 className="font-bold text-2xl text-jet dark:text-snow">Stocks // Trade History</h2>
                <section id="data-container" className="data-container font-bold">
                    <ul>
                        <li className="mb-5">
                            <h6 onClick={() => setShowStocks(!showStocks)} className={`text-xl font-semibold text-jet dark:text-snow 
                            transition-colors duration-150 hover:text-persianRed cursor-pointer hover:text-2xl 
                            ${!stockError && !stockLoading && showStocks ? 'text-xl text-persianRed' : ''}`}>
                                Stocks
                            </h6>
                            {!stockError && !stockLoading && showStocks && (
                                <>
                                    {stocks.length > 0 ? (
                                        <ul className="data-container-table">
                                            {stocks.map((stock, index) => (
                                                <li key={index + stock.id}>
                                                    <StockCard
                                                        checkedStocks={
                                                            newCheckedStocks
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
                                                        verifyThePrice={
                                                            verifyThePrice
                                                        }
                                                        setTheVerifiedPrice={
                                                            setTheVerifiedPrice
                                                        }
                                                        handleSell={handleSell}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No stocks found</p>
                                    )}
                                    {totalStocks > 0 && (
                                        <div className="ml-4">
                                            <button
                                                aria-disabled={stockPage === 1}
                                                disabled={stockPage === 1}
                                                onClick={() =>
                                                    setStockPage(stockPage - 1)
                                                }
                                                className="disabled:opacity-50 get-price-button w-[100px] hover:scale-105 hover:ml-1 hover:bg-darkOrange disabled:hover:bg-delftBlue hover:shadow-md"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                disabled={
                                                    totalStocks <
                                                    stockItemsPerPage
                                                }
                                                aria-disabled={stockPage === 1}
                                                onClick={() =>
                                                    setStockPage(stockPage + 1)
                                                }
                                                className="disabled:opacity-50 get-price-button w-[100px] hover:scale-105 hover:ml-1 hover:bg-darkOrange disabled:hover:bg-delftBlue hover:shadow-md"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                        <li>
                            <h6 id="data-container-trades" onClick={() => {
                                setShowTrades(!showTrades)
                            }} className={`text-xl font-semibold text-jet dark:text-snow transition-colors duration-150
                             hover:text-delftBlue cursor-pointer hover:text-2xl
                             ${!tradesLoading && !tradesError && showTrades ? 'text-xl text-delftBlue' : ''}`}>
                                Trades
                            </h6>
                            {!tradesLoading && !tradesError && showTrades && (
                                <>
                                    {trades.length > 0 ? (
                                        <>
                                            <ul className="data-container-table">
                                                {trades.map((trade, index) => (
                                                    <li key={index}>
                                                        <TradeCard
                                                            trade={trade}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <p>No trades found</p>
                                    )}
                                    {totalTrades > 0 && (
                                        <div className="ml-4">
                                            <button
                                                disabled={tradePage === 1}
                                                onClick={() =>
                                                    setTradePage(tradePage - 1)
                                                }
                                                className="disabled:opacity-50 get-price-button w-[100px] hover:scale-105 hover:ml-1 hover:bg-darkOrange disabled:hover:bg-delftBlue hover:shadow-md"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                disabled={
                                                    totalTrades <
                                                    tradeItemsPerPage
                                                }
                                                onClick={() =>
                                                    setTradePage(tradePage + 1)
                                                }
                                                className="disabled:opacity-50 get-price-button w-[100px] hover:scale-105 hover:ml-1 hover:bg-darkOrange disabled:hover:bg-delftBlue hover:shadow-md"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default DataContainer;
