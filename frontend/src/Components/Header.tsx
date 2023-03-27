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
                 {/*"flex flex-row justify-center space-x-20 my-6 md:justify-between"*/}
                <div className="flex flex-col flex-wrap sm:flex-row items-center justify-between mx-auto">
                    <a href="localhost:7777" className="z-30 flex items-center">
                        <img
                            src="./fauxfolio-logo.svg"
                            alt=""
                            className="logo"
                        />
                    </a>

                    <div
                        className="header-dropdown dropdown relative z-20 pt-2 sm:pt-4"
                        onMouseEnter={toggleMenu}
                        onMouseLeave={toggleMenu}
                    >
                        <div
                            className="dropdown-toggle text-center sm:text-right  tracking-wide"
                            onClick={toggleMenu}
                        >
                            <h3 className="text-2xl">
                                {" "}
                                <a href="#" className="text-jet hover:text-persianRed font-bold font-open">
                                    {user.username}
                                </a>{" "}
                            </h3>
                            <p className="user-money text-persianGreen font-semibold font-open">
                                {formatAmounts(user.money)}
                            </p>
                        </div>
                        {isMenuOpen && (
                            <ul className="bg-snow font-merriweather dropdown-menu pt-1 sm:pt-1 z-30 sm:absolute text-center sm:text-right text-lg sm:w-[200px] text-jet font-semibold  sm:right-0 bg-opacity-60 group hover:bg-opacity-100">
                                <li className="text-jet hover:text-persianRed cursor-pointer">
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
                                <li  className="cursor-pointer hover:text-persianRed" onClick={handleAccountClick}>Account</li>
                                {user.id === "-1" && (
                                    <li  className="cursor-pointer hover:text-persianRed" onClick={handleSignInClick}>Sign In</li>
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
