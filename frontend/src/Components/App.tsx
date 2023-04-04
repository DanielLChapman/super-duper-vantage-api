import Head from "next/head";
import React, { useEffect, useState } from "react";
import { user, CacheStorage } from "../../tools/lib";
import { GET_CACHES_BY_IDENTIFIERS, getCachesByIdentifiers } from "./Cache";
import DataContainer from "./DataDisplay/DataContainer";
import DateController from "./DateHandler/DateController";
import Footer from "./Footer";
import Header from "./Header";
import StockSearch from "./StockSearch";
import { useUser } from "./User";
import { useQuery } from "@apollo/client";

type AppInitialProps = {};

const App: React.FC<AppInitialProps> = () => {
    //user entry

    let user: user = useUser();

    const dateObject = new Date(Date.now());
    //DATES:
    const [dateToUse, setDateToUse] = useState({
        month: dateObject.getMonth() + 1,
        day: dateObject.getDate(),
        year: dateObject.getFullYear(),
    });
    const [verifiedDates, setVerifiedDates] = useState(true);
    const [checkedStocks, setCheckedStocks] = useState([]);

    //(b-a)/(31556952000)
    const [taxes, setTaxes] = useState(false);

    const [selector, setSelector] = useState("Day");

    //const caches = getCachesByIdentifiers(lazyData)

    const [dataFromCache, setDataFromCache] = useState<Cache[]>([]);
    const [identifierArray, setIdentifierArray] = useState<String[]>([""]);

    if (!user ) {
        if (setDataFromCache.length !== 0) {
            setDataFromCache([]);
            setIdentifierArray([]);
        }
    } else if (user && user.stocks.length > 0 && identifierArray.length === 0)  {
        let identifiers: String[] = [];
        user.stocks.forEach((x) => {
            let t = new Date(x.dateOfTrade);
            identifiers.push(
                `${x.symbol.toUpperCase}-${
                    t.getMonth() + 1
                }-${t.getDay()}-${t.getFullYear()}`
            );
        });
        setIdentifierArray(identifiers)
    }

    const {
        data,
        error,
        loading,
        refetch: newCaches,
    } = useQuery(GET_CACHES_BY_IDENTIFIERS, {
        variables: { 
            identifierArray 
        },
        skip: !user,
        onCompleted: (data) => {
            if (data && data?.cacheStorages?.length > 0) {
                console.log(data);
                setDataFromCache(dataFromCache);
            }
        },
        onError: (error) => {
            console.log(error);
        }
    });


    return (
        <div className="App flex flex-col min-h-screen justify-between">
            <Header user={user} taxes={taxes} setTaxes={setTaxes} />
            <main className="main-content container mx-auto bg-snow dark:bg-jet mb-auto">
                <StockSearch
                    checkedStocks={checkedStocks}
                    setCheckedStocks={setCheckedStocks}
                    verifiedDates={verifiedDates}
                    setVerifiedDates={setVerifiedDates}
                    selector={selector}
                    setSelector={setSelector}
                    setDateToUse={setDateToUse}
                    dateToUse={dateToUse}
                    user={user}
                />
                <DataContainer
                    checkedStocks={checkedStocks}
                    setCheckedStocks={setCheckedStocks}
                    verifiedDates={verifiedDates}
                    selector={selector}
                    user={user}
                    dateToUse={dateToUse}
                />
            </main>
            <Footer />
        </div>
    );
};

export default App;
