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
            } w-full`}
        >
            <div className="text-sm text-jet sm:text-md md:text-base trade-card-details flex flex-row align-center w-full border-2 justify-between p-2 px-3">
                <span className="trade-card-date">{(trade?.dateOfTrade + "").slice(0, 10) || Date.now()} </span>
                <span className="trade-card-symbol md:w-[150px] align-center text-darkOrange">{trade.symbol}</span>
                <span className={`trade-card-amount text-xs sm:text-sm md:text-base w-[150px] md:w-[250px] text-right ${trade.buySell ? 'text-persianGreen' : 'text-persianRed'}`}>
                    {trade.buySell ? "Bought " : "Sold "}
                    {trade.amount} for ${(trade.price / 100).toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default TradeCard;
