import Router from "next/router";
import React, { useState } from "react";
import formatAmounts from "../../tools/convertAmounts";
import { user as userType } from "../../tools/lib";
import SignOut from "./UserHandling/SignOut";

export type UserOnlyProps = {
    user: userType | null;
};

const Header: React.FC<UserOnlyProps> = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSignInClick = () => {
        Router.push("./user/signin");
    };

    const handleAccountClick = () => {
        Router.push("./user/account");
    };

    return (
        <>
            <header className="header-content">
                <span>LOGO</span>
                <section
                    className="header-dropdown dropdown"
                    onMouseEnter={toggleMenu}
                    onMouseLeave={toggleMenu}
                >
                    <span className="dropdown-toggle" onClick={toggleMenu}>
                        {user.username}
                        <br />
                        <span className="user-money">{formatAmounts( user.money)}</span>
                    </span>
                    {isMenuOpen && (
                        <ul className="dropdown-menu">
                            <li onClick={handleAccountClick}>Account</li>
                            {user.id === "-1" && (
                                <li onClick={handleSignInClick}>Sign In</li>
                            )}
                            {user.id !== "-1" && (
                                <li>
                                    <SignOut />
                                </li>
                            )}
                        </ul>
                    )}
                </section>
            </header>
        </>
    );
};

export default Header;
