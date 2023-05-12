import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useState, useContext } from "react";
import { CacheStorage, user as userType } from "../../tools/lib";
import { handleDateChange, resetDate, updateAllDates } from "../helpers/dateContext";
import { verifyFetch } from "../helpers/fetchHelper";
import { handleStateManager, views } from "../helpers/handleStateView";
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
    checkedStocks: Array<[string, number, string]>;
    setCheckedStocks: React.Dispatch<
        React.SetStateAction<Array<[string, number, string]>>
    >;
    storedCache: any,
    setUser: any,
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
    setUser,
    storedCache,
}) => {
    const dateObject = new Date(Date.now());
    const [allowStockSymbol, setAllowStockSymbol] = useState(true); //default if using today, it should be allowed
    const [stockData, setStockData] = useState({
        symbol: "AAPL",
        amount: 0,
        price: 0,
    });

    const [viewStateManager, setViewStateManager] = useState(views["dates"]);
    const [nuKey, setNuKey] = useState(Math.random() * 1000);

    const [addCache] = useMutation(ADD_CACHE);
    const [identifiers, setIdentifiers] = useState([]);

    const [verifyError, setVerifyError] = useState(null);
    const [submitCalled, setSubmitCalled] = useState(false);

    const [getCaches, {
        data: cacheCheck,
        error: cacheError,
        loading: cacheLoading,
        refetch,
    }] = useLazyQuery(GET_CACHES_BY_IDENTIFIERS, {
        variables: { ids: identifiers },
        onCompleted: (data) => {
            if (data && data?.cacheStorages?.length === 1) {

                postVerify(data.cacheStorages[0].price / 100);
            } else {
                postVerify(-1);
            }
        },
    });

    const handleStateManagerWrapper = (trigger: "advance" | "back") => {
        handleStateManager(viewStateManager, setViewStateManager, trigger)

    };

    //DATES:
    
    const handleDateChangeWrapper = (val: number, selector: string) => {
        handleDateChange(val, selector, dateToUse, setDateToUse, setVerifiedDates, setCheckedStocks, setViewStateManager, views["dates"])
    }
    /*
    const handleDateChange = (val: number, selector: string) => {
        setDateToUse({
            ...dateToUse,
            [selector]: val,
        });
        setVerifiedDates(false);
        setCheckedStocks([]);
        setViewStateManager(views["dates"]);
    };*/

    const updateAllDatesWrapper = (m: number, d: number, y: number) => {
        updateAllDates(m, d, y, setDateToUse, setVerifiedDates, setCheckedStocks, handleStateManagerWrapper);
      };

    const resetDateWrapper = () => {
        resetDate(setDateToUse, views["dates"], setVerifiedDates, setCheckedStocks, setViewStateManager, setNuKey, dateObject);
    };

    //STOCK AND AMOUNT
    const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let val = event.target.value;
        if (event.target.name === "symbol") {
            
            if (/^[a-z0-9]+$/i.test(val) || val === "") {
                val = val;
            } else {
                val = stockData.symbol;
            }
        }

        setStockData({
            ...stockData,
            price: 0,
            [event.target.name]: val,
        });
    };

    const postVerify = async (cP) => {
 
        let closingPrice = cP;

        let nudate = new Date(
            `${dateToUse.month}-${dateToUse.day}-${dateToUse.year}`
        );

        let identifierNew = `${stockData.symbol.toUpperCase()}-${
            dateToUse.month
        }-${dateToUse.day}-${dateToUse.year}`;


        if (closingPrice === -1) {
            closingPrice = await verifyFetch(
                stockData.symbol,
                selector,
                user.apiKey,
                dateToUse
            );

            if (closingPrice.error) {
                setVerifyError(closingPrice);
                setTimeout(() => {
                    setVerifyError(null);
                }, 5000)
                return;
            } else {
                setVerifyError(null);
            }

            /*cache adding */
            if (!cacheCheck) {
                let newPrice = closingPrice * 100;
                

                const variables: CacheStorage = {
                    symbol: stockData.symbol,
                    price: Math.floor(newPrice),
                    date: nudate,
                    identifier: identifierNew,
                };

                if (variables.price !== null) {
                    const { data } = await addCache({ variables });
                }

                
            }

            setCheckedStocks([
                ...checkedStocks,
                [stockData.symbol, closingPrice, identifierNew],
            ]);
        }

        setStockData({
            ...stockData,
            price: closingPrice,
        });

        setVerifiedDates(true);
        
        handleStateManagerWrapper("advance");

        return {
            symbol: stockData.symbol,
            close: closingPrice,
        };
    };

    const verify = async () => {
        if (+user.id === -1) {
            alert('Demo APIKey, will check cache. Otherwise please make an account')
        }

        let closingPrice: any = -1;


        //check if its in the cache
        let identifierNew = `${stockData.symbol.toUpperCase()}-${
            dateToUse.month
        }-${dateToUse.day}-${dateToUse.year}`;

        for (let [s, price, d] of checkedStocks) {
            if (d === identifierNew) {
                closingPrice = +price;
            }
        }
        if (cacheCheck && cacheCheck.cacheStorages.length > 0) {
            for (let {price, identifier, symbol} of cacheCheck.cacheStorages) {
                if (identifier === identifierNew) {
                    closingPrice = +price;
                }
            }
        }
        
        

        let found = false;
        
        if (closingPrice !== -1) {
            //means we've searched it before or 
            postVerify(
                closingPrice !== -1
                    ? closingPrice
                    : cacheCheck.cacheStorages[0].price / 100
            );
        } else {
      
            setIdentifiers([identifierNew]);
            getCaches()
        }

        
    };

    return (
        <div className="stock-search-container container flex flex-col ">
            <div className="stock-search-view-container border-4 font-open border-electricBlue rounded-lg container max-w-[1500px] mx-auto p-2 py-6 md:px-0 flex flex-col">
                {viewStateManager !== views["dates"] && (
                    <button
                        className="go-back font-merriweather text-persianGreen cursor-pointer hover:text-persianRed hover:scale-105 hover:ml-3"
                        onClick={() => {
                            handleStateManagerWrapper("back");
                        }}
                    >
                        Go Back To Previous Form
                    </button>
                )}
                <div className="flex justify-center items-center " key={nuKey}>
                    {viewStateManager === views["dates"] && (
                        <DateController
                            dateBuild={dateToUse}
                            updateHandler={handleDateChangeWrapper}
                            updateAllDates={updateAllDatesWrapper}
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
                                submitCalled={submitCalled}
                                setSubmitCalled={setSubmitCalled}
                            />
                        </>
                    )}
                    {viewStateManager === views["buySell"] && (
                        <>
                            <BuySellHandler
                                date={`${dateToUse.month}-${dateToUse.day}-${dateToUse.year}`}
                                user={user}
                                setUser={setUser}
                                symbol={stockData.symbol}
                                amount={stockData.amount}
                                price={stockData.price}
                            />
                        </>
                    )}
                </div>
                <button
                    onClick={resetDateWrapper}
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
