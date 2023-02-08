import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { stock } from "../../../tools/lib";
import roundToTwo from "../../../tools/roundToTwo";
import { verifyFetch } from "../../helpers/fetchHelper";
import { CURRENT_USER_QUERY } from "../User";

export const SELL_ALL_HANDLER = gql`
    mutation SELL_ALL_MUTATION(
        $stockPrice: Float!
        $stockSymbol: String!
        $stockID: ID!
        $dateOfTrade: String
    ) {
        sellAllStock(
            stockPrice: $stockPrice
            stockSymbol: $stockSymbol
            stockID: $stockID
            dateOfTrade: $dateOfTrade
        ) {
            id
            symbol
            amount
            price
            buySell
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
    verifiedDates: 'boolean';
    checkedStocks: Array<[string, number]>;
    setCheckedStocks:  React.Dispatch<React.SetStateAction<Array<[string, number]>>>;
}

const StockCard: React.FC<Props> = ({ checkedStocks, setCheckedStocks, verifiedDates, stock, apiKey, selector, dateToUse }) => {   
    
    const [sellAmount, setSellAmount] = useState(0);
    const [verifyThePrice, setTheVerifiedPrice] = useState(-1);

    useEffect(() => {
        setTheVerifiedPrice(-1);
    }, [dateToUse, selector]);
    
    const [
        sellAllStock,
        { data: sellAllData, error: sellAllError, loading: sellAllLoading },
    ] = useMutation(SELL_ALL_HANDLER, {
        variables: {
            stockPrice: roundToTwo(+stock.price),
            stockSymbol: stock.symbol,
            amount: +stock.amount,
            dateOfTrade: Date.now() + "",
        },
        refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });



    const handleSellAll = () => {
        // Implement logic for selling all stock
    };

    const handleSellSome = () => {
        // Implement logic for selling some stock
    };

    //Logic to call API, or let user know to wait
     //get price, have state manager to switch between verify and sell button
    const verifyPrice = async () => {
        if (!verifiedDates) {
            alert('Please verify that the date is confirmed by selecting Set Sell Date');
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

        closingPrice = await verifyFetch(stock.symbol, selector, apiKey, dateToUse);

        if (closingPrice.error) {
            return closingPrice;
        }


        setTheVerifiedPrice(closingPrice);
        setCheckedStocks(
            [...checkedStocks, [stock.symbol, closingPrice]]
        );

    };

   

    //if the props change, setState back to verify.
    useEffect(() => {
        if (verifiedDates && checkedStocks.length > 0) {
            verifyPrice()
        }
        
    }, [checkedStocks]);
    

    const stockDate = new Date(stock.dateOfTrade) || new Date(Date.now());

    return (
        <div className="stock-card">
            <div className="stock-card-header">
                <h2 className="stock-card-symbol">{stock.symbol}</h2>
                <p className="stock-card-current-value">
                    Bought For: $
                    {(stock.amount * (stock.price / 100)).toFixed(2)}
                    <span>
                        {" "}
                        On {stockDate.getMonth() + 1} / {stockDate.getDay()} /{" "}
                        {stockDate.getFullYear()}
                    </span>
                </p>
            </div>
            <div className="stock-card-details">
                <p className="stock-card-amount">Amount: {stock.amount}</p>
                <p className="stock-card-price">
                    Price: ${(stock.price / 100).toFixed(2)}
                </p>
            </div>
            <div className="stock-card-actions">
                <div className="stock-card-sell-container stock-card-sell-all-container">
                    <span className="stock-card-sell-all-button-container">
                        Total Price At Selected Date Above:
                        {verifyThePrice === -1 ? (
                            <button className="stock-card-sell-button" onClick={verifyPrice}>Get Price</button>
                        ) : (
                            <>
                                <span>{verifyThePrice * stock.amount}</span>
                                <button
                                className="stock-card-sell-button stock-card-sell-all-button"
                                onClick={handleSellAll}
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
                        onChange={(e) => setSellAmount(+e.target.value)}
                        className="stock-card-sell-input"
                    />
                    <span className="stock-card-sell-some-button-container">
                        Sell {verifyThePrice === - 1 ? 'Some' : sellAmount} At Selected Date Above:{" "}
                        {verifyThePrice === -1 ? (
                            <button className="stock-card-sell-button" onClick={verifyPrice}>Get Price</button>
                        ) : (
                            <button
                                className="stock-card-sell-button stock-card-sell-some-button"
                                onClick={handleSellSome}
                            >
                                {verifyThePrice * stock.amount}
                            </button>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StockCard;
