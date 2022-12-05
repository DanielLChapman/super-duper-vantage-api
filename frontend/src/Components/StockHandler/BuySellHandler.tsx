import React from 'react';

type BuySellProps = {
    amount: number,
    symbol: string,
    price: number,
    buySellHandler: () => void
}

const BuySellHandler: React.FC<BuySellProps>  = ({amount, symbol, price}) => {
    return (
        <div>
            <button className="buy-button" onClick={() => {console.log('buy')}}>Buy {amount}</button>
            <button className="sell-button" onClick={() => {console.log('sell')}}>Sell {amount}</button>
            <h5 className='buy-sell-text'>of {symbol} for {price * amount}</h5>
        </div>
    );
};

export default BuySellHandler;