import React, { useState } from 'react';
import { stock } from '../../../tools/lib';



interface Props {
  stock: stock;
}

const StockCard: React.FC<Props> = ({ stock }) => {
  const [sellAmount, setSellAmount] = useState(0);

  const handleSellAll = () => {
    // Implement logic for selling all stock
  };

  const handleSellSome = () => {
    // Implement logic for selling some stock
  };

  

  return (
    <div className="stock-card">
      <div className="stock-card__header">
        <h2 className="stock-card__symbol">{stock.symbol}</h2>
        <p className="stock-card__current-value">
          Current Value: $
          {(stock.amount * (stock.price/100)).toFixed(2)}
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