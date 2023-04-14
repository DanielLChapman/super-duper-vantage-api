export const verifyAPIHandler = async (url) => {
    console.log('here')
    let dataFromApi: object;
    await fetch(url)
        .then((response) => response.json())
        .then((data) => dataFromApi = data);

    return dataFromApi;
} 

export async function verifyFetch(symbol: string, selector: string, apiKey: string, dateToUse: {month: number, day: number, year: number}) {
    let url: string;
    let jsonKey: string; 
    let key = apiKey || 'demo';
    switch(selector) {
        //maybe toggle for adjusted
        case 'Intraday':
            jsonKey = "Time Series (5min)"
            url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`
            break;
        case 'Day':
            jsonKey = "Time Series (Daily)";
            url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${key}`
            break;
        case 'Monthly':
            jsonKey = "Monthly Adjusted Time Series"
            url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=${key}`
            break;
        case 'Weekly':
            jsonKey = "Weekly Adjusted Time Series"
            url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=${key}`
            break;
        default: 
            alert('error');
            console.log(selector);
            return;
    }
    
    let dateToUseForSearch = `${dateToUse.year}-${dateToUse.month < 10 ? "0" + dateToUse.month : dateToUse.month}-${dateToUse.day < 10 ? "0" + dateToUse.day : dateToUse.day}`;
    let dataFromApi = await verifyAPIHandler(url);

    if (dataFromApi['Note']) {
        return {
            error: 'Please wait, maximum of 5 api calls for free API key'
        }
    }

    if (dataFromApi['Error Message']) {
        return {
            error: dataFromApi['Error Message']
        }
    }

    if (!dataFromApi[jsonKey]) {
        return {
            error: 'Please alert admin with date and symbol used. May also be using a demo account in which case the api endpoint can not be used.',
        }
    }
    
    if (!dataFromApi[jsonKey][dateToUseForSearch]) {
        dateToUseForSearch = Object.keys(dataFromApi[jsonKey])[0];
    }

    let closingPrice = selector === 'Day' || selector === 'Intraday' ? dataFromApi[jsonKey][dateToUseForSearch]['4. close'] : dataFromApi[jsonKey][dateToUseForSearch]['5. adjusted close'];

    return closingPrice;
    /*
    setStockData({
        ...stockData,
        price: closingPrice
    });
    setBuySellAppear(true);
    return {
        symbol: stockData.symbol,
        close: closingPrice
    }
*/
}