import React, { useState } from "react";

type ErrorHandler = { error: string};
type SuccessHandler = {symbol: string, close: number};


type VerifyError = () => ErrorHandler;
type VerifySuccess = () => SuccessHandler;
type FetchBoth = VerifyError & VerifySuccess | (() => Promise<any>);

type DateControllersProps = {
    stockSymbol: string;
    amount: number;
    handleStockChange: (e) => void;
    verify: FetchBoth,
};

const StockSymbolForm: React.FC<DateControllersProps> = ({
    stockSymbol,
    amount,
    handleStockChange,
    verify,
}) => {
    const [enabled, setEnabled ] = useState(true);
    const [error, setError] = useState(null);
    return (
        <form
            onSubmit={async (e: React.SyntheticEvent) => {
                e.preventDefault();
                //let val = +e.currentTarget.value;
                //handleSymbolChange(stockData.symbol, stockData.amount);
                setEnabled(false);
                let output = await verify();
                if (output.error) {
                    setEnabled(true);
                    setError(output.error);
                    return;
                }

                setEnabled(true);
                setError(null);
            }}
        >
            <div>
                {error && <span className="form-error-message">{error}</span>}
                <label>
                    Stock Symbol:
                    <input
                        type="text"
                        name="symbol"
                        value={stockSymbol}
                        onChange={handleStockChange}
                    />
                </label>
                <label>
                    Amount Symbol:
                    <input
                        type="number"
                        name="amount"
                        value={amount}
                        onChange={handleStockChange}
                    />
                </label>
            </div>
            <button aria-disabled={!enabled} disabled={!enabled} type="submit">Verify</button>
        </form>
    );
};

export default StockSymbolForm;
