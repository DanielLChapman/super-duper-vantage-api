import React from 'react';

const Page = (props) => {
    return (
        <div>
        {/*<Header />*/}
        <main>{props.children}</main>
        {/*<link rel="stylesheet" href="main.css" />*/}
        
    </div>
    );
};

export default Page;