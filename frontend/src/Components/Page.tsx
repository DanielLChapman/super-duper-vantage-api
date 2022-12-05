import React from "react";

const Page = (props) => {
    return (
        <main>
            {/*<Header />*/}
            {props.children}
            {/*<link rel="stylesheet" href="main.css" />*/}
        </main>
    );
};

export default Page;
