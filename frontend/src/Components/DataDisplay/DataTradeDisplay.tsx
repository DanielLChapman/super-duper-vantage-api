import gql from "graphql-tag";
import React, { useState } from "react";
import { tradeHistory } from "../../../tools/lib";

interface Props {
    trade: tradeHistory;
}

const TradeCard: React.FC<Props> = ({ trade }) => {
  let date = (trade.dateOfTrade + "").slice(0, 10);
  if (date === null) {
    date = "Lost Created Date";
  }
  
    return (
        <div
            className={`trade-card ${
                trade.buySell ? "trade-card-buy" : "trade-card-sell"
            }`}
        >
            <div className="trade-card-details">
                <span className="trade-card-date">{(trade?.dateOfTrade + "").slice(0, 10) || Date.now()} </span>
                <span className="trade-card-symbol">{trade.symbol}</span>
                <span className="trade-card-amount">
                    {trade.buySell ? "Bought " : "Sold "}
                    {trade.amount} for ${(trade.price / 100).toFixed(2)} ea.
                </span>
            </div>
        </div>
    );
};

export default TradeCard;
