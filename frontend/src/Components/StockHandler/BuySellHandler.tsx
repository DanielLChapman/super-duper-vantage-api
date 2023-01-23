import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { CURRENT_USER_QUERY } from '../User';
import { user as userType} from "../../../tools/lib";

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
            data: {
                stockPrice: $stockPrice
                stockSymbol: $stockSymbol
                amount: $amount
                dateOfTrade: $dateOfTrade
            }
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
            data: {
                stockPrice: $stockPrice
                stockSymbol: $stockSymbol
                amount: $amount
                dateOfTrade: $dateOfTrade
            }
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

    const [buyStock, {data: buyData, error: buyError, loading: buyLoading}] = useMutation(
        BUY_STOCK_HANDLER,
        {
            variables: {
                stockPrice: price,
                stockSymbol: symbol,
                amount: amount,
                dateOfTrade: date,
            },
            refetchQueries: [{query: CURRENT_USER_QUERY}]
        }
    );

    const [sellStock, {data: sellData, error: sellError, loading: sellLoading}] = useMutation(
        SELL_STOCK_HANDLER,
        {
            variables: {
                stockPrice: price,
                stockSymbol: symbol,
                amount: amount,
                dateOfTrade: date,
            },
            refetchQueries: [{query: CURRENT_USER_QUERY}]
        }
    )

    //graphql call to update user
    const buyHandler = async (swapOption) => {  
        if (swapOption === 'buy') {
            let res = await buyStock()
            console.log(res);
            console.log(user);
        }
    }
    return (
        <div>
            <button className="buy-button" onClick={() => {console.log('buy')}}>Buy {amount}</button>
            <button className="sell-button" onClick={() => {console.log('sell')}}>Sell {amount}</button>
            <h5 className='buy-sell-text'>of {symbol} for {price * amount}</h5>
        </div>
    );
};

export default BuySellHandler;