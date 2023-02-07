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
    setDateToUse: React.Dispatch<React.SetStateAction<object>>
}


const StockSearch: React.FC<StockSearchProps> = ({user, dateToUse, setDateToUse}) => {
    const dateObject = new Date(Date.now());
    const [allowStockSymbol, setAllowStockSymbol] = useState(true); //default if using today, it should be allowed
    const [stockData, setStockData] = useState({
        symbol: 'AAPL',
        amount: 0,
        price: 0,
    });
    const [selector, setSelector] = useState('Day');
    const [buySellAppear, setBuySellAppear] = useState(false);

    //DATES:
    
   
    const handleDateChange = (val: number, selector: string) => {
        setDateToUse({
            ...dateToUse,
            [selector]: val,
        });
        setAllowStockSymbol(false);
        setBuySellAppear(false);
    };

    const updateAllDates = (m: number, d: number, y: number) => {
        setDateToUse({
            month: m,
            day: d,
            year: y,
        });
        setAllowStockSymbol(true);
        setBuySellAppear(false);
    };

    const resetDate = () => {
        setDateToUse({
            month: dateObject.getMonth() + 1,
            day: dateObject.getDate(),
            year: dateObject.getFullYear(),
        });
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

    const verifyAPIHandler = async (url) => {
        let dataFromApi: object;
        await fetch(url)
            .then((response) => response.json())
            .then((data) => dataFromApi = data);

        return dataFromApi;
    } 

    const verify = async () => {
        const closingPrice = await verifyFetch(stockData.symbol, selector, user.apiKey, dateToUse);

        if (closingPrice.errro) {
            return closingPrice;
        }

        setStockData({
            ...stockData,
            price: closingPrice
        });

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
