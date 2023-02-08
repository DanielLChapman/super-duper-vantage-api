import React, { useEffect, useState } from "react";
import { user } from "../../../tools/lib";
import StockCard from "./DataStockDisplay";
import TradeCard from "./DataTradeDisplay";

const DataContainer: React.FC<{ verifiedDates: 'boolean', selector: string | 'day' | 'monthly' | 'weekly' | 'intraday', user: user, dateToUse: {month: number, day: number, year: number} }> = ({ verifiedDates, user, dateToUse, selector }) => {
    if (!user) {
        return <span>Loading....</span>;
    }
    const [showStocks, setShowStocks] = useState(false);
    const [showTrades, setShowTrades] = useState(false);
    const [checkedStocks, setCheckedStocks ] = useState([]);

    useEffect(() => {
        setCheckedStocks([]);
    }, [dateToUse, selector]);

    return (
        <>
            <h2>Stocks // Trade History</h2>
            <section className="data-container">
                <ul>
                    <li >
                        <span onClick={() => setShowStocks(!showStocks)}>Stocks</span>
                        {showStocks && (
                            <>
                                {user.stocks.length > 0 ? (
                                    <ul>
                                        {user.stocks.map((stock, index) => (
                                            <li key={index}><StockCard checkedStocks={checkedStocks} setCheckedStocks={setCheckedStocks} verifiedDates={verifiedDates} apiKey={user.apiKey} dateToUse={dateToUse} selector={selector} stock={stock} /></li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No stocks found</p>
                                )}
                            </>
                        )}
                    </li>
                    <li>
                        <span>Trades</span>
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
