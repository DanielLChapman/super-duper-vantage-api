const originalObject = {
    id: '01',
    symbol: 'AAPL',
    price: 15000,
    amount: 0,
    dateOfTrade: new Date(Date.now())
};

export const getMockStockData = () => {

    const objectArray = [];

    for (let i = 0; i < 30; i++) {
        const duplicatedObject = {
            ...originalObject,
            id: String(i + 1),
            symbol: 'AAPL' + i, 
            price: originalObject.price + (i * 100), // Changing the price for each duplicated object
            dateOfTrade: new Date(Date.now() )
        };
    
        objectArray.push(duplicatedObject);
    }

    return objectArray
}