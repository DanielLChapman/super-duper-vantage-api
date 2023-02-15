import React, { useState, useContext } from "react";
import { user as userType } from "../../tools/lib";
import { verifyFetch } from "../helpers/fetchHelper";
import DateController from "./DateHandler/DateController";
import BuySellHandler from "./StockHandler/BuySellHandler";
import StockSymbolForm from "./StockHandler/StockSymbolForm";

type StockSearchProps = {
    user: userType | null;
    dateToUse: {
        month: number;
        day: number;
        year: number;
    };
    setDateToUse: React.Dispatch<React.SetStateAction<object>>;
    selector: string;
    setSelector: React.Dispatch<React.SetStateAction<string>>;
    verifiedDates: boolean;
    setVerifiedDates: React.Dispatch<React.SetStateAction<boolean>>;
    checkedStocks: Array<[string, number]>;
    setCheckedStocks: React.Dispatch<
        React.SetStateAction<Array<[string, number]>>>
};

const views = {
    dates: "DATE_VIEW",
    stockSymbol: "STOCK_SYMBOL",
    buySell: "BUY_SELL",
};

const StockSearch: React.FC<StockSearchProps> = ({
    verifiedDates,
    setVerifiedDates,
    checkedStocks,
    setCheckedStocks,
    selector,
    setSelector,
    user,
    dateToUse,
    setDateToUse,
}) => {
    const dateObject = new Date(Date.now());
    const [allowStockSymbol, setAllowStockSymbol] = useState(true); //default if using today, it should be allowed
    const [stockData, setStockData] = useState({
        symbol: "AAPL",
        amount: 0,
        price: 0,
    });

    const [buySellAppear, setBuySellAppear] = useState(false);
    const [viewStateManager, setViewStateManager] = useState(views["dates"]);
    

    const handleStateManager = (trigger: "advance" | "back") => {
        if (trigger === "advance") {
            if (viewStateManager === views["dates"]) {
                setViewStateManager(views["stockSymbol"]);
            } else {
                setViewStateManager(views["buySell"]);
            }
        } else {
            if (viewStateManager === views["buySell"]) {
                setViewStateManager(views["stockSymbol"]);
            } else {
                setViewStateManager(views["dates"]);
            }
        }
    };

    //DATES:

    const handleDateChange = (val: number, selector: string) => {
        setDateToUse({
            ...dateToUse,
            [selector]: val,
        });
        setVerifiedDates(false);
        setCheckedStocks([]);
        setViewStateManager(views["dates"]);
    };

    const updateAllDates = (m: number, d: number, y: number) => {
        setDateToUse({
            month: m,
            day: d,
            year: y,
        });
        setVerifiedDates(true);
        setCheckedStocks([]);
        handleStateManager("advance");
    };

    const resetDate = () => {
        setDateToUse({
            month: dateObject.getMonth() + 1,
            day: dateObject.getDate(),
            year: dateObject.getFullYear(),
        });
        setVerifiedDates(true);
        setCheckedStocks([]);
        setViewStateManager(views["dates"]);

        //hide symbol window
        //hide sell windows
    };

    //STOCK AND AMOUNT
    const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let val = event.target.value;
        if (event.target.name === "symbol") {
            console.log(/^[a-z0-9]+$/i.test(val));
            if (/^[a-z0-9]+$/i.test(val) || val === "") {
                val = val;
            } else {
                val = stockData.symbol;
            }
        }

        setBuySellAppear(false);
        setStockData({
            ...stockData,
            price: 0,
            [event.target.name]: val,
        });
    };

    const verify = async () => {
        let closingPrice: any = -1;

        for (let [s, price] of checkedStocks) {
            if (s === stockData.symbol) {
                closingPrice = +price;
            }
        }

        if (closingPrice === -1) {
            closingPrice = await verifyFetch(
                stockData.symbol,
                selector,
                user.apiKey,
                dateToUse
            );

            if (closingPrice.error) {
                return closingPrice;
            }

            setCheckedStocks([...checkedStocks, [stockData.symbol, closingPrice]]);
        }

        setStockData({
            ...stockData,
            price: closingPrice,
        });

        
        setVerifiedDates(true);
        handleStateManager("advance");

        return {
            symbol: stockData.symbol,
            close: closingPrice,
        };
    };

    const buySellHandler = () => {};

    return (
        <div className="stock-search-container">
            <section className="stock-search-view-container">
                {viewStateManager === views["dates"] && (
                    <DateController
                        dateBuild={dateToUse}
                        updateHandler={handleDateChange}
                        updateAllDates={updateAllDates}
                        setURLSelector={setSelector}
                    />
                )}
                {viewStateManager === views["stockSymbol"] && (
                    <>
                        <button className="go-back" onClick={() => {handleStateManager('back')}}>Go Back</button>
                        <StockSymbolForm
                            stockSymbol={stockData.symbol}
                            amount={stockData.amount}
                            handleStockChange={handleStockChange}
                            verify={verify}
                        />
                    </>
                )}
                {viewStateManager === views["buySell"] && (
                    <>
                        <button className="go-back" onClick={() => {handleStateManager('back')}}>Go Back</button>
                        <BuySellHandler
                            date={`${dateToUse.month}-${dateToUse.day}-${dateToUse.year}`}
                            user={user}
                            buySellHandler={buySellHandler}
                            symbol={stockData.symbol}
                            amount={stockData.amount}
                            price={stockData.price}
                        />
                    </>
                )}
                <button className="reset-button" onClick={resetDate}>Reset</button>
            </section>
        </div>
    );
};

export default StockSearch;
