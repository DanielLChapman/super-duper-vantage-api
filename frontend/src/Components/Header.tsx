import Router from 'next/router';
import React from 'react';
import {user as userType} from '../../tools/lib';
import SignOut from './UserHandling/SignOut';

export type UserOnlyProps = {
    user: userType | null,
}

const Header:React.FC<UserOnlyProps>  = ({user}) => {

    return (
        <>
        <header className="header-content">header</header>
        {
            (user.id === "-1") && (
            <button onClick={() => {
                Router.push('./user/signin')
            }}>SignIn</button>
            )
        }
        {
            user.id !== "-1" && (
                
                <SignOut />
            )
        }
        
        
        </>
    );
};

export default Header;