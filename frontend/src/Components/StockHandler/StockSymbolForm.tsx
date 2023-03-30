import React, { useEffect, useState } from "react";

type ErrorHandler = { error: string };
type SuccessHandler = { symbol: string; close: number };

type VerifyError = () => ErrorHandler;
type VerifySuccess = () => SuccessHandler;
type FetchBoth = (VerifyError & VerifySuccess) | (() => Promise<any>);

type DateControllersProps = {
    stockSymbol: string;
    amount: number;
    handleStockChange: (e) => void;
    verify: FetchBoth;
    verifyError: any;
};

const StockSymbolForm: React.FC<DateControllersProps> = ({
    stockSymbol,
    amount,
    handleStockChange,
    verify,
    verifyError,
}) => {
    const [enabled, setEnabled] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (verifyError && verifyError.error) {
            setEnabled(true);
            setError(verifyError.error);
            return;
            // update state here
        } else {
            setEnabled(true);
            setError(null);
        }
    }, [verifyError]);

    return (
        <form
            onSubmit={async (e: React.SyntheticEvent) => {
                e.preventDefault();
                if (amount <= 0) {
                    alert("Amount must be 1 or greater");
                    return;
                }
                if (amount % 1 !== 0) {
                    alert("Amount must not be a decimal");
                    return;
                }
                //let val = +e.currentTarget.value;
                //handleSymbolChange(stockData.symbol, stockData.amount);
                setEnabled(false);
                let output = await verify();
            }}
        >
            <div className="flex flex-col">
                <h2 className="py-4 mb-0 w-full text-center text-xl font-bold text-jet">
                    Check Stock Symbol
                </h2>
                {error && (
                    <span className="form-error-message mb-4 font-extrabold text-persianRed">
                        {error}
                    </span>
                )}
                <label>
                    <span className="font-semibold text-lg p-2 pl-0 w-[150px] lg:w-auto">
                        Stock Symbol:
                    </span>
                    <input
                        type="text"
                        name="symbol"
                        value={stockSymbol}
                        onChange={handleStockChange}
                        className="flex-grow block p-2 pl-7 w-full text-md text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                    />
                </label>
                <label>
                    <span className="font-semibold text-lg p-2 pl-0 w-[150px] lg:w-auto">
                        Amount:
                    </span>
                    <input
                        type="number"
                        name="amount"
                        value={amount}
                        onChange={handleStockChange}
                        className="flex-grow block p-2 pl-7 w-full text-md text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                    />
                </label>
            </div>
            <div className="flex justify-center align-middle my-4">
                <button
                    aria-disabled={!enabled}
                    disabled={!enabled}
                    className="group relative h-10 w-48 overflow-hidden rounded-lg bg-delftBlue shadow hover:bg-"
                >
                    <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-persianGreen rounded-lg"></div>
                    <span className="relative text-white group-hover:text-white">
                        Verify This Works
                    </span>
                </button>
            </div>
        </form>
    );
};

export default StockSymbolForm;
