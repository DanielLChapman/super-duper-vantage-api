import Head from "next/head";
import React, { useEffect, useState } from "react";
import { user, CacheStorage, stock } from "../../tools/lib";
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
    const [checkedStocks, setCheckedStocks] = useState<
        Array<[string, number, string]>
    >([]);

    //this was above taxes, will check later (b-a)/(31556952000)
   
    const [selector, setSelector] = useState("Day");

    //const caches = getCachesByIdentifiers(lazyData)

    const [dataFromCache, setDataFromCache] = useState<Cache[]>([]);
    const [identifierArray, setIdentifierArray] = useState<String[]>([""]);

    const [called, setCalled] = useState(false);
    const {
        data,
        error,
        loading,
        variables,
        refetch: newCaches,
    } = useQuery(GET_CACHES_BY_IDENTIFIERS, {
        variables: {
            ids: identifierArray,
        },
        skip: !user || called,
        onCompleted: (data) => {
            if (data && data?.cacheStorages?.length > 0) {
                console.log(data, variables);
                setCalled(true);
            }
        },
        onError: (error) => {
            console.log(error);
        },
    });

    if (
        user &&
        user.stocks.length > 0 &&
        identifierArray[0] === "" &&
        !called
    ) {
        let identifierSet: Set<string> = new Set();

        user.stocks.forEach((x: stock) => {
            let t = new Date(x.dateOfTrade);
            let identifier = `${x.symbol.toUpperCase()}-${
                t.getMonth() + 1
            }-${t.getDate()}-${t.getFullYear()}`;
            identifierSet.add(identifier);
        });

        let identifierArrayFromSet: String[] = Array.from(identifierSet);
        setIdentifierArray(identifierArrayFromSet);
        newCaches();
    }

    return (
        <div className="App flex flex-col min-h-screen justify-between">
            <Header user={user} />
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
                    storedCache={data}
                />
                <DataContainer
                    checkedStocks={checkedStocks}
                    setCheckedStocks={setCheckedStocks}
                    verifiedDates={verifiedDates}
                    selector={selector}
                    user={user}
                    dateToUse={dateToUse}
                    storedCache={data}
                />
            </main>
            <Footer />
        </div>
    );
};

export default App;
