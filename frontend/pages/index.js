import React from "react";
import Head from "next/head";
import App from "../src/Components/App"

function index(props) {
    const user = {
        id: 1,
        api_key: process.env.REACT_APP_user_api_key || 'some_key,_i_give_up,_hydration'
    };

    return (
        <div>
            <Head>
                <title>Reddit:Clone</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />

            </Head>

            <App user={user} />


        </div>
    );
}

export default index;

