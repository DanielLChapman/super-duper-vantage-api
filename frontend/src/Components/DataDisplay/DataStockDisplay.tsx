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
    checkedStocks: Array<[string, number]>;
    setCheckedStocks: React.Dispatch<
        React.SetStateAction<Array<[string, number]>>
    >;
    verifyThePrice: number;
    setTheVerifiedPrice: React.Dispatch<
    React.SetStateAction<number>
>;
    handleSell: (stock, number) => {}
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

        for (let [s, price] of checkedStocks) {
            if (s === stock.symbol) {
                closingPrice = +price;
                setTheVerifiedPrice(closingPrice);
            }
        }

        if (closingPrice !== -1) return;

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
        setCheckedStocks([...checkedStocks, [stock.symbol, closingPrice]]);
    };

    //if the props change, setState back to verify.
    useEffect(() => {
        if (verifiedDates && checkedStocks.length > 0) {
            verifyPrice();
        }
    }, [checkedStocks]);

    const stockDate = new Date(stock.dateOfTrade) || new Date(Date.now());

    return (
        <div className={`stock-card ${expand ? 'expanded-stock-card' : 'collapsed-stock-card'}`}>
            <div className="stock-card-header">
                {
                    expand && (
                        <h2 className="expanded-stock-card-symbol">{stock.symbol}</h2>
                    )
                }
               
                <p className="stock-card-current-value">
                    {!expand && (
                        <span className='collapsed-stock-symbol'>{stock.symbol} </span>
                    )}
                    <span className={`${expand ? 'expanded-stock-card-value' : 'collapsed-stock-card-value'}`}>
                    Bought For: $
                    {(stock.amount * (stock.price / 100)).toFixed(2)}
                    {expand && (
                        <span>
                            {" "}
                            On {stockDate.getMonth() + 1} / {stockDate.getDay()}{" "}
                            / {stockDate.getFullYear()}
                        </span>
                    )}
                    </span>
                </p>
                <button
                    onClick={() => {
                        setExpand(!expand);
                    }}
                >
                    {" "}
                    {expand ? "Collapse" : "Expand"}{" "}
                </button>
            </div>
            {expand && (
                <>
                    <div className="stock-card-details">
                        <p className="stock-card-amount">
                            Amount: {stock.amount}
                        </p>
                        <p className="stock-card-price">
                            Price: ${(stock.price / 100).toFixed(2)}
                        </p>
                    </div>
                    <div className="stock-card-actions">
                        <div className="stock-card-sell-container stock-card-sell-all-container">
                            <span className="stock-card-sell-all-button-container">
                                Total Price At Selected Date Above:
                                {verifyThePrice === -1 ? (
                                    <button
                                        className="stock-card-sell-button"
                                        onClick={verifyPrice}
                                    >
                                        Get Price
                                    </button>
                                ) : (
                                    <>
                                        <span>
                                            {(
                                                verifyThePrice * stock.amount
                                            ).toFixed(2)}
                                        </span>
                                        <button
                                            className="stock-card-sell-button stock-card-sell-all-button"
                                            onClick={() => {
                                                handleSell(stock, stock.amount)
                                            }}
                                        >
                                            Sell All
                                        </button>
                                    </>
                                )}
                            </span>
                        </div>
                        <div className="stock-card-sell-some-container">
                            <input
                                type="number"
                                value={sellAmount}
                                max={stock.amount}
                                onChange={(e) => setSellAmount(+e.target.value)}
                                className="stock-card-sell-input"
                            />
                            <span className="stock-card-sell-some-button-container">
                                Sell{" "}
                                {verifyThePrice === -1 ? "Some" : sellAmount} At
                                Selected Date Above:{" "}
                                {verifyThePrice === -1 ? (
                                    <button
                                        className="stock-card-sell-button"
                                        onClick={verifyPrice}
                                    >
                                        Get Price
                                    </button>
                                ) : (
                                    <button
                                        className="stock-card-sell-button stock-card-sell-some-button"
                                        onClick={() => {
                                            handleSell(stock, sellAmount)
                                        }}
                                    >
                                        {(verifyThePrice * sellAmount).toFixed(
                                            2
                                        )}
                                    </button>
                                )}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StockCard;
