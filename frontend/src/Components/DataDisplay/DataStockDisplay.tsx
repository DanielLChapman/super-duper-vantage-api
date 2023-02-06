import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { stock } from '../../../tools/lib';
import roundToTwo from '../../../tools/roundToTwo';
import { CURRENT_USER_QUERY } from '../User';


export const SELL_ALL_HANDLER = gql`
    mutation SELL_ALL_MUTATION (
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
  date: {
    month: number,
    day: number,
    year: number,
  }
}

const StockCard: React.FC<Props> = ({ stock }) => {
    console.log(stock);
  const [sellAmount, setSellAmount] = useState(0);


  const [sellAllStock, {data: sellAllData, error: sellAllError, loading: sellAllLoading}] = useMutation(
    SELL_ALL_HANDLER,
    {
        variables: {
            stockPrice: roundToTwo(+stock.price),
            stockSymbol: stock.symbol,
            amount: +stock.amount,
            dateOfTrade:Date.now() + "",
        },
        refetchQueries: [{query: CURRENT_USER_QUERY}]
    }
);

  const handleSellAll = () => {
    // Implement logic for selling all stock
  };

  const handleSellSome = () => {
    // Implement logic for selling some stock
  };

  
  const dateToUse = new Date(stock.dateOfTrade) || new Date(Date.now());

  return (
    <div className="stock-card">
      <div className="stock-card__header">
        <h2 className="stock-card__symbol">{stock.symbol}</h2>
        <p className="stock-card__current-value">
          Bought For:  $
          {(stock.amount * (stock.price/100)).toFixed(2)}
          <span> On {dateToUse.getMonth() + 1} / {dateToUse.getDay()} / {dateToUse.getFullYear()}</span>
        </p>
      </div>
      <div className="stock-card__details">
        <p className="stock-card__amount">Amount: {stock.amount}</p>
        <p className="stock-card__price">Price: ${(stock.price/100).toFixed(2)}</p>
      </div>
      <div className="stock-card__actions">
        <button className="stock-card__sell-all-button" onClick={handleSellAll}>
          Sell All 
        </button>
        <div className="stock-card__sell-some-container">
          <input
            type="number"
            value={sellAmount}
            onChange={e => setSellAmount(+e.target.value)}
            className="stock-card__sell-input"
          />
          <button className="stock-card__sell-some-button" onClick={handleSellSome}>
            Sell Some
          </button>
        </div>
      </div>
    </div>
  );
};


export default StockCard;