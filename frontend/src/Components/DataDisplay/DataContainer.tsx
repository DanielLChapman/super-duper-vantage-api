import React, { useState } from "react";
import { user } from "../../../tools/lib";
import StockCard from "./DataStockDisplay";
import TradeCard from "./DataTradeDisplay";

const DataContainer: React.FC<{ user: user, dateToUse: {month: number, day: number, year: number} }> = ({ user, dateToUse }) => {
    if (!user) {
        return <span>Loading....</span>;
    }
    const [showStocks, setShowStocks] = useState(false);
    const [showTrades, setShowTrades] = useState(false);

    return (
        <>
            <h2>Stocks // Trade History</h2>
            <section className="data-container">
                <ul>
                    <li onClick={() => setShowStocks(!showStocks)}>
                        Stocks
                        {showStocks && (
                            <>
                                {user.stocks.length > 0 ? (
                                    <ul>
                                        {user.stocks.map((stock, index) => (
                                            <li key={index}><StockCard stock={stock} /></li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No stocks found</p>
                                )}
                            </>
                        )}
                    </li>
                    <li onClick={() => setShowTrades(!showTrades)}>
                        Trades
                        {showTrades && (
                            <>
                                {user.trades.length > 0 ? (
                                    <ul>
                                        {user.trades.map((trade, index) => (
                                            <li key={index}><TradeCard trade={trade} /></li>
                                        ))}
                                    </ul>
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
