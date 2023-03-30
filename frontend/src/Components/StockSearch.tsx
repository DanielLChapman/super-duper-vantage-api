import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useContext } from "react";
import { CacheStorage, user as userType } from "../../tools/lib";
import { verifyFetch } from "../helpers/fetchHelper";
import {
    ADD_CACHE,
    getCachesByIdentifiers,
    GET_CACHES_BY_IDENTIFIERS,
} from "./Cache";
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

    const [addCache] = useMutation(ADD_CACHE);
    const [identifiers, setIdentifiers] = useState([]);

    const [verifyError, setVerifyError] = useState(null)

    const {
        data: cacheCheck,
        error: cacheError,
        loading: cacheLoading,
        refetch,
    } = useQuery(GET_CACHES_BY_IDENTIFIERS, {
        variables: { identifiers },
        onCompleted: (data) => {
            if (data && data?.cacheStorages?.length === 1) {
                const cache = data.cacheStorages[0];
                postVerify(cache.price / 100);
            } else if(identifiers[0]) {
                postVerify(-1);
            }
        },
    });

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

    const postVerify = async (cP) => {
        let closingPrice = cP;

        if (closingPrice === -1) {
            closingPrice = await verifyFetch(
                stockData.symbol,
                selector,
                user.apiKey,
                dateToUse
            );

            if (closingPrice.error) {
                setVerifyError(closingPrice);
                return;
            } else {
                setVerifyError(null);
            }

            /*cache adding */
            if (!cacheCheck) {
                let newPrice = closingPrice * 100;
                let nudate = new Date(
                    `${dateToUse.month}-${dateToUse.day}-${dateToUse.year}`
                );
    
                let identifierNew = `${stockData.symbol.toUpperCase()}-${
                    dateToUse.month
                }-${dateToUse.day}-${dateToUse.year}`;
    
                const variables: CacheStorage = {
                    symbol: stockData.symbol,
                    price: Math.floor(newPrice),
                    date: nudate,
                    identifier: identifierNew,
                };
                
                const { data } = await addCache({ variables });
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

    const verify = async () => {
        let closingPrice: any = -1;

        for (let [s, price] of checkedStocks) {
            if (s === stockData.symbol) {
                closingPrice = +price;
            }
        }

        //check if its in the cache
        let identifierNew = `${stockData.symbol.toUpperCase()}-${
            dateToUse.month
        }-${dateToUse.day}-${dateToUse.year}`;

        if (identifiers[0] === identifierNew || closingPrice !== -1) {
            postVerify(closingPrice !== -1 ? closingPrice : cacheCheck.cacheStorages[0].price / 100)

            
        }

        setIdentifiers([identifierNew]);
        refetch();
    };

    const buySellHandler = () => {};

    console.log(cacheCheck)

    

    return (
        <div className="stock-search-container container flex flex-col ">
            <div className="stock-search-view-container border-4 font-open border-electricBlue rounded-lg container max-w-[1500px] mx-auto p-2 py-6 md:px-0 flex flex-col">
                {viewStateManager !== views["dates"] && (
                    <button
                        className="go-back font-merriweather text-persianGreen cursor-pointer hover:text-persianRed hover:scale-105 hover:ml-3"
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
                                verifyError={verifyError}
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
                    className="reset-button mt-1 font-merriweather lg:mt-4 w-2/3 max-w-lg relative mx-auto text-white  bg-delftBlue hover:bg-electricBlue hover:text-jet border-delftBlue focus:border-delftBlue
                focus:ring-4 transition duration-150 focus:outline-none focus:scale-105 font-medium rounded-lg text-sm px-4 py-2 "
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default StockSearch;
