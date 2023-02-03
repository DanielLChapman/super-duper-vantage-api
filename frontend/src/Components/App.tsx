import React from "react";
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

    console.log(user.money/100);

    return (
        <div className="App">
            <Header user={user} />
            <main className="main-content">
                <StockSearch user={user} />
                <DataContainer user={user} />
            </main>
            <footer className="footer-content">footer</footer>
        </div>
    );
};

export default App;
