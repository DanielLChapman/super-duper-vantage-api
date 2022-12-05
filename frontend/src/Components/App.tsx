import React from "react";
import DateController from "./DateHandler/DateController";
import StockSearch from "./StockSearch";

type AppInitialProps = {
    user: {
        id: number;
        api_key: string;
    };
};

const App: React.FC<AppInitialProps> = ({ user }) => {

  const checkUser = () => {
    console.log(user);
  }
    return (
        <div className="App">
            <header className="header-content">header</header>
            <main className="main-content">
                <StockSearch checkUser={checkUser} />
            </main>
            <footer className="footer-content">footer</footer>
        </div>
    );
};

export default App;
