import React, { useState } from "react";
import { user as userType} from "../../tools/lib";
import DateController from "./DateHandler/DateController";
import BuySellHandler from "./StockHandler/BuySellHandler";
import StockSymbolForm from "./StockHandler/StockSymbolForm";

type StockSearchProps = {
    user: userType | null,
}

const StockSearch: React.FC<StockSearchProps> = ({user}) => {
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
    const [dateToUse, setDateToUse] = useState({
        month: dateObject.getMonth() + 1,
        day: dateObject.getDate(),
        year: dateObject.getFullYear(),
    });
   
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
        let url: string;
        let jsonKey: string; 
        let key = user?.apiKey || 'demo';
        switch(selector) {
            //maybe toggle for adjusted
            case 'Intraday':
                jsonKey = "Time Series (5min)"
                url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockData.symbol}&apikey=${key}`
                break;
            case 'Day':
                jsonKey = "Time Series (Daily)";
                url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockData.symbol}&apikey=${key}`
                break;
            case 'Monthly':
                jsonKey = "Monthly Adjusted Time Series"
                url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${stockData.symbol}&apikey=${key}`
                break;
            case 'Weekly':
                jsonKey = "Weekly Adjusted Time Series"
                url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${stockData.symbol}&apikey=${key}`
                break;
            default: 
                alert('error');
                console.log(selector);
                return;
        }
        let dateToUseForSearch = `${dateToUse.year}-${dateToUse.month}-${dateToUse.day}`;
        let dataFromApi = await verifyAPIHandler(url);

        if (dataFromApi['Note']) {
            return {
                error: 'Please wait, maximum of 5 api calls for free API key'
            }
        }

        if (dataFromApi['Error Message']) {
            return dataFromApi['Error Message']
        }

        if (!dataFromApi[jsonKey]) {
            return {
                error: 'Please alert admin with date and symbol used',
            }
        }
        
        if (!dataFromApi[jsonKey][dateToUseForSearch]) {
            dateToUseForSearch = Object.keys(dataFromApi[jsonKey])[0];
        }

        
        let closingPrice = dataFromApi[jsonKey][dateToUseForSearch]['4. close'];
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
                buySellAppear && <BuySellHandler user={user} buySellHandler={buySellHandler} symbol={stockData.symbol} amount={stockData.amount} price={stockData.price} />
            }
        </div>
    );
};

export default StockSearch;
