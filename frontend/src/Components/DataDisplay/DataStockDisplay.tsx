import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { stock } from "../../../tools/lib";
import roundToTwo from "../../../tools/roundToTwo";
import { verifyFetch } from "../../helpers/fetchHelper";
import { CURRENT_USER_QUERY } from "../User";
import { GET_STOCKS, GET_TRADES } from "./DataContainer";

export const SELL_ALL_HANDLER = gql`
    mutation SELL_ALL_MUTATION(
        $stockPrice: Float!
        $stockSymbol: String!
        $stockID: ID!
        $taxes: Boolean
        $dateOfTrade: String!
    ) {
        sellAllStock(
            stockPrice: $stockPrice
            stockSymbol: $stockSymbol
            stockID: $stockID
            taxes: $taxes
            dateOfTrade: $dateOfTrade
        ) {
            id
            symbol
            amount
            price
        }
    }
`;

export const SELL_SOME_HANDLER = gql`
    mutation SELL_SOME_MUTATION(
        $stockPrice: Float!
        $stockSymbol: String!
        $amount: Float!
        $stockID: ID!
        $taxes: Boolean
        $dateOfTrade: String!
    ) {
        sellFromStock(
            stockPrice: $stockPrice
            stockSymbol: $stockSymbol
            amount: $amount
            stockID: $stockID
            dateOfTrade: $dateOfTrade
            taxes: $taxes
        ) {
            id
            symbol
            amount
            price
        }
    }
`;

interface Props {
    stock: stock;
    dateToUse: {
        month: number;
        day: number;
        year: number;
    };
    apiKey: string;
    selector: string;
    verifiedDates: boolean;
    checkedStocks: Array<[string, number, string]>;
    setCheckedStocks: React.Dispatch<
        React.SetStateAction<Array<[string, number, string]>>
    >;
    verifyThePrice: number;
    setTheVerifiedPrice: React.Dispatch<React.SetStateAction<number>>;
    handleSell: (stock, number) => {};
}

const StockCard: React.FC<Props> = ({
    checkedStocks,
    setCheckedStocks,
    verifiedDates,
    stock,
    apiKey,
    selector,
    dateToUse,
    verifyThePrice,
    setTheVerifiedPrice,
    handleSell,
}) => {
    const [sellAmount, setSellAmount] = useState(0);

    const [expand, setExpand] = useState(false);

    useEffect(() => {
        setTheVerifiedPrice(-1);
    }, [dateToUse, selector]);

    //Logic to call API, or let user know to wait
    //get price, have state manager to switch between verify and sell button
    const verifyPrice = async () => {
        if (!verifiedDates) {
            alert(
                "Please verify that the date is confirmed by selecting Set Sell Date"
            );
            return;
        }
        let closingPrice: any = -1;

        let nudate = new Date(
            `${dateToUse.month}-${dateToUse.day}-${dateToUse.year}`
        );

        let identifierNew = `${stock.symbol.toUpperCase()}-${
            dateToUse.month
        }-${dateToUse.day}-${dateToUse.year}`;

        for (let [s, price, identifier] of checkedStocks) {
            if (identifier === identifierNew) {
                console.log('here')
                closingPrice = +price;
                setTheVerifiedPrice(closingPrice);
            }
        }

        if (closingPrice !== -1) {
            //it works!
            return;
        }

        closingPrice = await verifyFetch(
            stock.symbol,
            selector,
            apiKey,
            dateToUse
        );

        if (closingPrice.error) {
            return closingPrice;
        }

        

        setTheVerifiedPrice(closingPrice);
        setCheckedStocks([...checkedStocks, [stock.symbol, closingPrice, identifierNew]]);
    };

    //if the props change, setState back to verify.
    useEffect(() => {
        if (verifiedDates && checkedStocks.length > 0) {
            verifyPrice();
        }
    }, [dateToUse, checkedStocks]);

    const stockDate = new Date(stock.dateOfTrade) || new Date(Date.now());

    return (
        <>
            {expand && (
                <div
                    className={`stock-card border-2 border-gray-600 px-2 py-2 rounded-lg expanded-stock-card pt-1 text-jet`}
                >
                    <div
                        className="stock-card-header flex flex-row items-center justify-between text-sm sm:text-base "
                        onClick={() => {
                            setExpand(!expand);
                        }}
                    >
                        <h2 className="expanded-stock-card-symbol text-darkOrange font-bold ">
                            {stock.symbol}
                        </h2>

                        <p
                            className={`stock-card-current-value font-bold ${
                                expand ? "hidden sm:block" : ""
                            }`}
                        >
                            <span
                                className={` ${
                                    expand
                                        ? "expanded-stock-card-value"
                                        : "collapsed-stock-card-value"
                                }`}
                            >
                                Bought For:{" "}
                                <span className="text-persianGreen">
                                    $
                                    {(
                                        stock.amount *
                                        (stock.price / 100)
                                    ).toFixed(2)}
                                </span>
                                {expand && (
                                    <span className=" ">
                                        {" "}
                                        On {stockDate.getMonth() + 1} /{" "}
                                        {stockDate.getDay()} /{" "}
                                        {stockDate.getFullYear()}
                                    </span>
                                )}
                            </span>
                        </p>

                        <button
                            className={`py-2 mt-1 px-6 bg-delftBlue text-white rounded-lg`}
                        >
                            {" "}
                            {expand ? "Collapse" : "Expand"}{" "}
                        </button>
                    </div>
                    {expand && (
                        <div className=" flex flex-col space-y-2 text-sm sm:text-base">
                            <div className="stock-card-details flex flex-col space-y-2 font-semibold sm:-mt-2">
                                <span
                                    className={`block sm:hidden ${
                                        expand
                                            ? "expanded-stock-card-value"
                                            : "collapsed-stock-card-value"
                                    }`}
                                >
                                    Bought For:{" "}
                                    <span className="text-persianGreen">
                                        $
                                        {(
                                            stock.amount *
                                            (stock.price / 100)
                                        ).toFixed(2)}
                                    </span>
                                    {expand && (
                                        <span>
                                            {" "}
                                            On {stockDate.getMonth() + 1} /{" "}
                                            {stockDate.getDay()} /{" "}
                                            {stockDate.getFullYear()}
                                        </span>
                                    )}
                                </span>
                                <p className="stock-card-amount">
                                    Total Amount Of Shares:{" "}
                                    <span className="text-persianRed">
                                        {" "}
                                        {stock.amount}
                                    </span>
                                </p>
                                <p className="stock-card-price">
                                    Price Per Share:{" "}
                                    <span className="text-persianGreen">
                                        {" "}
                                        ${(stock.price / 100).toFixed(2)}
                                    </span>
                                </p>
                            </div>
                            <div className="stock-card-actions font-merriweather">
                                <div className="stock-card-sell-container stock-card-sell-all-container pb-1">
                                    <span className="stock-card-sell-all-button-container">
                                        Total Price At Selected Date Above:{" "}
                                        {verifyThePrice === -1 ? (
                                            <button
                                                className="stock-card-sell-button get-price-button"
                                                onClick={verifyPrice}
                                            >
                                                Get Price
                                            </button>
                                        ) : (
                                            <>
                                                <span className="px-2 text-persianGreen">
                                                    $
                                                    {(
                                                        verifyThePrice *
                                                        stock.amount
                                                    ).toFixed(2)}
                                                </span>
                                                <button
                                                    className="stock-card-sell-button get-price-button stock-card-sell-all-button -ml-1 px-4"
                                                    onClick={() => {
                                                        handleSell(
                                                            stock,
                                                            stock.amount
                                                        );
                                                    }}
                                                >
                                                    Sell All
                                                </button>
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className="stock-card-sell-some-container">
                                    <span className="stock-card-sell-some-button-container">
                                        Sell{" "}
                                    </span>
                                    <input
                                        type="number"
                                        value={sellAmount}
                                        max={stock.amount}
                                        onChange={(e) =>
                                            setSellAmount(+e.target.value)
                                        }
                                        className="stock-card-sell-input w-24"
                                    />
                                    <span>
                                        {verifyThePrice === -1
                                            ? " Shares"
                                            : " Shares"}{" "}
                                        At Selected Date Above For:{" "}
                                        {verifyThePrice === -1 ? (
                                            <button
                                                className="stock-card-sell-button get-price-button"
                                                onClick={verifyPrice}
                                            >
                                                Get Price
                                            </button>
                                        ) : (
                                            <button
                                                className="stock-card-sell-button stock-card-sell-some-button get-price-button border-2 border-delftBlue bg-transparent text-persianGreen"
                                                onClick={() => {
                                                    handleSell(
                                                        stock,
                                                        sellAmount
                                                    );
                                                }}
                                            >
                                                $
                                                {(
                                                    verifyThePrice * sellAmount
                                                ).toFixed(2)}
                                            </button>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {!expand && (
                <div
                    className={`stock-card border-2 border-gray-600 px-2 py-2 rounded-lg ${
                        expand ? "hidden" : "collapsed-stock-card font-semibold"
                    } text-jet`}
                >
                    <div
                        className="stock-card-header flex flex-row items-center justify-between align-center text-sm sm:text-base "
                        onClick={() => {
                            setExpand(!expand);
                        }}
                    >
                        <p
                            className={`stock-card-current-value font-bold flex flex-row justify-between flex-grow`}
                        >
                            <span className="collapsed-stock-symbol py-2 text-darkOrange">
                                {stock.symbol}{" "}
                            </span>

                            <span className="py-2"> 
                                Bought For:{" "}
                                <span className="text-persianGreen ">
                                    $
                                    {(stock.amount * stock.price / 100).toFixed(2)}
                                </span>
                            </span>
                            <button
                                className={`py-2 px-6 bg-delftBlue text-white rounded-lg`}
                            >
                                {" "}
                                {expand ? "Collapse" : "Expand"}{" "}
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default StockCard;
