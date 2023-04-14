import React from "react";
import Head from "next/head";
import FAQ from "../src/Components/FAQ"


function index(props) {

    return (
        <div>
            <Head>
                <title>FAQ : Faux Folio</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />

            </Head>

            <FAQ />


        </div>
    );
}

export default index;

