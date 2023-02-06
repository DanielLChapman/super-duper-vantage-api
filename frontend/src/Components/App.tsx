import React, { useState } from "react";
import { user } from "../../tools/lib";
import DataContainer from "./DataDisplay/DataContainer";
import DateController from "./DateHandler/DateController";
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

    return (
        <div className="App">
            <Header user={user} />
            <main className="main-content">
                <StockSearch setDateToUse={setDateToUse} dateToUse={dateToUse} user={user} />
                <DataContainer user={user} />
            </main>
            <footer className="footer-content">footer</footer>
        </div>
    );
};

export default App;
