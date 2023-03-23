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
        React.SetStateAction<Array<[string, number]>>
    >;
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
    const [nuKey, setNuKey] = useState(Math.random() * 1000);

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
        setNuKey(Math.random() * 1000);

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

            setCheckedStocks([
                ...checkedStocks,
                [stockData.symbol, closingPrice],
            ]);
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
        <div className="stock-search-container container flex flex-col ">
            <section className="stock-search-view-container border-4 border-electricBlue rounded-lg container max-w-[1500px] mx-auto p-2 py-6 md:px-0 flex flex-col">
                {viewStateManager !== views["dates"] && (
                    <button
                        className="go-back text-persianGreen cursor-pointer hover:text-persianRed hover:scale-105 hover:ml-3"
                        onClick={() => {
                            handleStateManager("back");
                        }}
                    >
                        Go Back To Previous Form
                    </button>
                )}
                <div className="flex justify-center items-center " key={nuKey}>
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
                </div>
                <button
                    onClick={resetDate}
                    className="reset-button mt-1  lg:mt-4 w-2/3 max-w-lg relative mx-auto text-white  bg-delftBlue hover:bg-electricBlue hover:text-jet border-delftBlue focus:border-delftBlue
                focus:ring-4 transition duration-150 focus:outline-none focus:scale-105 font-medium rounded-lg text-sm px-4 py-2 "
                >
                    Reset
                </button>
            </section>
        </div>
    );
};

export default StockSearch;
