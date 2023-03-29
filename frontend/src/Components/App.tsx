import Head from "next/head";
import React, { useState } from "react";
import { user } from "../../tools/lib";
import DataContainer from "./DataDisplay/DataContainer";
import DateController from "./DateHandler/DateController";
import Footer from "./Footer";
import Header from "./Header";
import StockSearch from "./StockSearch";
import { useUser } from "./User";

type AppInitialProps = {};

const App: React.FC<AppInitialProps> = () => {
    //user entry

    let  user = useUser();

    const refetchUser = () => {
        user = useUser();
    }

    const dateObject = new Date(Date.now());
    //DATES:
    const [dateToUse, setDateToUse] = useState({
        month: dateObject.getMonth() + 1,
        day: dateObject.getDate(),
        year: dateObject.getFullYear(),
    });
    const [verifiedDates, setVerifiedDates ] = useState(true);
    const [checkedStocks, setCheckedStocks] = useState([]);

    //(b-a)/(31556952000)
    const [taxes, setTaxes] = useState(false);

    const [selector, setSelector] = useState('Day');

    return (
        <div className="App flex flex-col min-h-screen justify-between">
            
            <Header user={user} taxes={taxes} setTaxes={setTaxes} />
            <main className="main-content container mx-auto bg-snow dark:bg-jet mb-auto">
                <StockSearch checkedStocks={checkedStocks} setCheckedStocks={setCheckedStocks} verifiedDates={verifiedDates} setVerifiedDates={setVerifiedDates} selector={selector} setSelector={setSelector} setDateToUse={setDateToUse} dateToUse={dateToUse} user={user} />
                <DataContainer checkedStocks={checkedStocks} setCheckedStocks={setCheckedStocks} verifiedDates={verifiedDates} selector={selector} user={user} dateToUse={dateToUse} />
            </main>
            <Footer />
        </div>
    );
};

export default App;
