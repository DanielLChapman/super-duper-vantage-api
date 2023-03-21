import React from "react";
import Head from "next/head";
import App from "../src/Components/App"


function index(props) {

    return (
        <div>
            <Head>
                <title>Reddit:Clone</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />

            </Head>

            <App />


        </div>
    );
}

export default index;

