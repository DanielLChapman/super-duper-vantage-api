export const views = {
    dates: "DATE_VIEW",
    stockSymbol: "STOCK_SYMBOL",
    buySell: "BUY_SELL",
};

export const handleStateManager = (viewStateManager:string, setViewStateManager, trigger: "advance" | "back") => {
    const v = [views['dates'], views["stockSymbol"], views["buySell"]];

    const currentIndex = v.indexOf(viewStateManager);

    const nextIndex =
        trigger === "advance"
            ? (currentIndex + 1) % v.length
            : (currentIndex - 1 + v.length) % v.length;

    setViewStateManager(v[nextIndex]);
};

