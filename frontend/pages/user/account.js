import React from "react";
import Head from "next/head";
import Account from '../../src/Components/Account'



function accountPage(props) {

    return (
        <div>
            <Head>
                <title>Reddit:Clone</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />

            </Head>

            <Account />


        </div>
    );
}

export default accountPage;

