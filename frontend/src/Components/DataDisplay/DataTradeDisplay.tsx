import gql from 'graphql-tag';
import React from 'react';
import { tradeHistory } from '../../../tools/lib';

interface Props {
  trade: tradeHistory;
}

const TradeCard: React.FC<Props> = ({ trade }) => {
  return (
    <div className={`trade-card ${trade.buySell ? 'trade-card-buy' : 'trade-card-sell'}`}>
      <div className="trade-card__header">
        <h2 className="trade-card__symbol">{trade.symbol}</h2>
      </div>
      <div className="trade-card__details">

        <p className="trade-card__amount">{trade.buySell ? 'Bought ' : 'Sold '}Amount: {trade.amount}</p>
        <p className="trade-card__price">Price: ${trade.price.toFixed(2)}</p>
        <p className="trade-card__date">Date: {trade.dateOfTrade}</p>
      </div>
    </div>
  );
};

export default TradeCard;
