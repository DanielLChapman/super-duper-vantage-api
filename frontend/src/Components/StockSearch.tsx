import React, { useState , useContext} from "react";
import { user as userType} from "../../tools/lib";
import { verifyFetch } from "../helpers/fetchHelper";
import DateController from "./DateHandler/DateController";
import BuySellHandler from "./StockHandler/BuySellHandler";
import StockSymbolForm from "./StockHandler/StockSymbolForm";

type StockSearchProps = {
    user: userType | null,
    dateToUse: {
        month: number,
        day: number,
        year: number
    },
    setDateToUse: React.Dispatch<React.SetStateAction<object>>,
    selector: string ,
    setSelector:  React.Dispatch<React.SetStateAction<string>>,
    verifiedDates: boolean ,
    setVerifiedDates:  React.Dispatch<React.SetStateAction<boolean>>,
}


const StockSearch: React.FC<StockSearchProps> = ({verifiedDates, setVerifiedDates, selector, setSelector, user, dateToUse, setDateToUse}) => {
    const dateObject = new Date(Date.now());
    const [allowStockSymbol, setAllowStockSymbol] = useState(true); //default if using today, it should be allowed
    const [stockData, setStockData] = useState({
        symbol: 'AAPL',
        amount: 0,
        price: 0,
    });
   
    const [buySellAppear, setBuySellAppear] = useState(false);

    //DATES:
    
   
    const handleDateChange = (val: number, selector: string) => {
        setDateToUse({
            ...dateToUse,
            [selector]: val,
        });
        setVerifiedDates(false);
        setAllowStockSymbol(false);
        setBuySellAppear(false);
    };

    const updateAllDates = (m: number, d: number, y: number) => {
        setDateToUse({
            month: m,
            day: d,
            year: y,
        });
        setVerifiedDates(true);
        setAllowStockSymbol(true);
        setBuySellAppear(false);
    };

    const resetDate = () => {
        setDateToUse({
            month: dateObject.getMonth() + 1,
            day: dateObject.getDate(),
            year: dateObject.getFullYear(),
        });
        setVerifiedDates(true);
        setAllowStockSymbol(true);
        setBuySellAppear(false);

        //hide symbol window
        //hide sell windows
    }

    //STOCK AND AMOUNT
    const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let val = event.target.value;
        if (event.target.name === 'symbol') {
            console.log(/^[a-z0-9]+$/i.test(val))
            if (/^[a-z0-9]+$/i.test(val) || val === '') {
                val = val;
            } else {
                val = stockData.symbol;
            }
        }
        
        setBuySellAppear(false);
        setStockData({
            ...stockData,
            price: 0,
            [event.target.name]: val,
        });
    }

    const verify = async () => {
        const closingPrice = await verifyFetch(stockData.symbol, selector, user.apiKey, dateToUse);

        if (closingPrice.error) {
            return closingPrice;
        }

        setStockData({
            ...stockData,
            price: closingPrice
        });

        setVerifiedDates(true);
        setBuySellAppear(true);

        return {
            symbol: stockData.symbol,
            close: closingPrice
        }
    }

    const buySellHandler = () => {
        
    }


    return (
        <div>
            <DateController
                dateBuild={dateToUse}
                updateHandler={handleDateChange}
                updateAllDates={updateAllDates}
                setURLSelector={setSelector}
            />
            <button onClick={resetDate}>Reset Date</button>
            {
                allowStockSymbol && <StockSymbolForm stockSymbol={stockData.symbol} amount={stockData.amount} handleStockChange={handleStockChange} verify={verify} />
            }
            {
                buySellAppear && <BuySellHandler date={`${dateToUse.month}-${dateToUse.day}-${dateToUse.year}`} user={user} buySellHandler={buySellHandler} symbol={stockData.symbol} amount={stockData.amount} price={stockData.price} />
            }
        </div>
    );
};

export default StockSearch;
