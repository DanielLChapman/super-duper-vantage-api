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

const DataContainerLocal: React.FC<{
    verifiedDates: boolean;
    selector: string | "day" | "monthly" | "weekly" | "intraday";
    user: user;
    dateToUse: { month: number; day: number; year: number };
    checkedStocks: Array<[string, number, string]>;
    storedCache: any;
    setCheckedStocks: React.Dispatch<
        React.SetStateAction<Array<[string, number, string]>>
    >;
    setUser: any;
}> = ({
    verifiedDates,
    user,
    dateToUse,
    selector,
    checkedStocks,
    setUser,
    setCheckedStocks,
    storedCache,
}) => {
    const [showStocks, setShowStocks] = useState(false);
    const [showTrades, setShowTrades] = useState(false);
    const [verifyThePrice, setTheVerifiedPrice] = useState(-1);

    if (!user) {
        return <span>Loading....</span>;
    }

    const { stocks, trades } = user;

    const [stockPage, setStockPage] = useState(1);
    const [tradePage, setTradePage] = useState(1);
    const stockItemsPerPage = 10;
    const tradeItemsPerPage = 10;

    const displayedStocks = stocks.slice(
        (stockPage - 1) * stockItemsPerPage,
        stockPage * stockItemsPerPage
    );
    const displayedTrades = trades.slice(
        (tradePage - 1) * tradeItemsPerPage,
        tradePage * tradeItemsPerPage
    );

    const handleSell = async (stock: stock, sellAmount) => {
        if (verifyThePrice === -1) {
            alert('No Price Found')
            return;
        }
        let convertedPrice = +(roundToTwo(+verifyThePrice) * 100).toFixed(0);
    };

    return (
        <div className="data-container container flex flex-col font-open">
            <div className="stock-search-view-container border-4 border-t-0 border-electricBlue rounded-lg container max-w-[1500px] mx-auto p-6 flex flex-col">
                <h2 className="font-bold text-2xl text-jet dark:text-snow">
                    Stocks // Trade History
                </h2>
                <section
                    id="data-container"
                    className="data-container font-bold"
                >
                    <ul>
                        <li className="mb-5">
                            <h6
                                onClick={() => setShowStocks(!showStocks)}
                                className={`text-xl font-semibold text-jet dark:text-snow 
                            transition-colors duration-150 hover:text-persianRed cursor-pointer hover:text-2xl 
                            ${
                                showStocks
                                    ? "text-xl text-persianRed"
                                    : ""
                            }`}
                            >
                                Stocks
                            </h6>
                            {showStocks && (
                                <>
                                    {displayedStocks.length > 0 ? (
                                        <ul className="data-container-table">
                                            {displayedStocks.map((stock, index) => (
                                                <li key={index + stock.id}>
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
                                    {displayedStocks.length > 0 && (
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
                                                    stockPage * stockItemsPerPage >=
                                                    stocks.length
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
                            <h6
                                id="data-container-trades"
                                onClick={() => {
                                    setShowTrades(!showTrades);
                                }}
                                className={`text-xl font-semibold text-jet dark:text-snow transition-colors duration-150
                             hover:text-delftBlue cursor-pointer hover:text-2xl
                             ${
                                  showTrades
                                     ? "text-xl text-delftBlue"
                                     : ""
                             }`}
                            >
                                Trades
                            </h6>
                            {showTrades && (
                                <>
                                    {displayedTrades.length > 0 ? (
                                        <>
                                            <ul className="data-container-table">
                                                {displayedTrades.map((trade, index) => (
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
                                    {displayedTrades.length > 0 && (
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
                                                    tradePage * tradeItemsPerPage >=
                                                    trades.length
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

export default DataContainerLocal;
