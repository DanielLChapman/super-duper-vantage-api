import React from 'react';
import {user as userType} from '../../tools/lib';

export type UserOnlyProps = {
    user: userType | null,
}

const Header:React.FC<UserOnlyProps>  = ({user}) => {
    return (
        <header className="header-content">header</header>
    );
};

export default Header;