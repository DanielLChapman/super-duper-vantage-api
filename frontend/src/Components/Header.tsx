import Router from "next/router";
import React, { useState } from "react";
import formatAmounts from "../../tools/convertAmounts";
import { user as userType } from "../../tools/lib";
import SignOut from "./UserHandling/SignOut";

export type UserOnlyProps = {
    user: userType | null;
    taxes: boolean;
    setTaxes: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: React.FC<UserOnlyProps> = ({ user, taxes, setTaxes }) => {
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
            <nav className="container relative mx-auto p-6">
                <div className="flex justify-between space-x-20 my-6">
                    <div className="z-30">
                        <img
                            src="./fauxfolio-logo.svg"
                            alt=""
                            className="logo"
                        />
                    </div>

                    <div
                        className="header-dropdown dropdown relative mt-1 z-20"
                        onMouseEnter={toggleMenu}
                        onMouseLeave={toggleMenu}
                    >
                        <div className="dropdown-toggle text-right border" onClick={toggleMenu}>
                            <h3 className="text-2xl">{user.username}</h3>
                            <p className="user-money">{formatAmounts(user.money)}</p>
                        </div>
                        {isMenuOpen && (
                            <ul className="dropdown-menu absolute text-right text-lg w-[300px] right-0  border">
                                <li>
                                    {/* Maybe a hover window to initially set it up */}
                                    <button
                                        onClick={() => {
                                            setTaxes(!taxes);
                                        }}
                                    >
                                        {taxes
                                            ? "Disable Taxes"
                                            : "Enable Taxes"}
                                    </button>
                                </li>
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
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
