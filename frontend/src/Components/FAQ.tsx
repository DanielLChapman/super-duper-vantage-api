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
import CondensedHeader from "./CondensedHeader";

type AppInitialProps = {};

const FAQ: React.FC<AppInitialProps> = () => {
    

    return (
        <div className="App flex flex-col min-h-screen justify-between">
            <CondensedHeader />
            
            <Footer />
        </div>
    );
};

export default FAQ;
