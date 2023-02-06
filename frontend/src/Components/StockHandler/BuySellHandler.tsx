import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { CURRENT_USER_QUERY } from '../User';
import { user as userType} from "../../../tools/lib";
import roundToTwo from '../../../tools/roundToTwo';

type BuySellProps = {
    amount: number,
    symbol: string,
    price: number,
    user: userType,
    date: string,
    buySellHandler: () => void
}

export const BUY_STOCK_HANDLER = gql`
    mutation BUY_STOCK_MUTATION (
        $stockPrice: Float!
        $stockSymbol: String!
        $amount: Float!
        $dateOfTrade: String
    ) {
        buyStock(
                stockPrice: $stockPrice
                stockSymbol: $stockSymbol
                amount: $amount
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

export const SELL_STOCK_HANDLER = gql`
    mutation SELL_STOCK_MUTATION (
        $stockPrice: Float!
        $stockSymbol: String!
        $amount: Float!
        $dateOfTrade: String
    ) {
        sellStock(
                stockPrice: $stockPrice
                stockSymbol: $stockSymbol
                amount: $amount
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

const BuySellHandler: React.FC<BuySellProps>  = ({user, amount, symbol, price, date}) => {

    if (!user) {
        return <span>Please log in</span>
    }

    let dateCheck = Date.now() + "";
    if (date) {
        dateCheck = date;
    }

    const [buyStock, {data: buyData, error: buyError, loading: buyLoading}] = useMutation(
        BUY_STOCK_HANDLER,
        {
            variables: {
                stockPrice: roundToTwo(+price),
                stockSymbol: symbol,
                amount: +amount,
                dateOfTrade: dateCheck,
            },
            refetchQueries: [{query: CURRENT_USER_QUERY}]
        }
    );

    if (buyError) {
        console.log(buyError);
    }
    const [sellStock, {data: sellData, error: sellError, loading: sellLoading}] = useMutation(
        SELL_STOCK_HANDLER,
        {
            variables: {
                stockPrice: roundToTwo(+price),
                stockSymbol: symbol,
                amount: +amount,
                dateOfTrade: dateCheck,
            },
            refetchQueries: [{query: CURRENT_USER_QUERY}]
        }
    )

    //graphql call to update user
    const buyHandler = async (swapOption) => {  
        let res;
        switch (swapOption ) {
            case 'buy' :
                res = await buyStock()
                break;
            case 'sell' :
                res = await sellStock();
                break;
            default:
                console.log('error', swapOption);
        }
    }
    return (
        <div>
            <button className="buy-button" onClick={() => {buyHandler('buy')}}>Buy {amount}</button>
            <button className="sell-button" onClick={() => {buyHandler('sell')}}>Sell {amount}</button>
            <h5 className='buy-sell-text'>of {symbol} for {price * amount}</h5>
        </div>
    );
};

export default BuySellHandler;