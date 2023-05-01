import Router from "next/router";
import React, { useEffect, useState } from "react";
import formatAmounts from "../../tools/convertAmounts";
import { user as userType } from "../../tools/lib";
import SignOut from "./UserHandling/SignOut";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "./UserHandling/AccountContainer";
import { CURRENT_USER_QUERY, backendtype } from "./User";

export type UserOnlyProps = {
    user: userType | null;
    setUser: (value: backendtype) => void;
};

const Header: React.FC<UserOnlyProps> = ({ user, setUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const [
        updateUser,
        {
            data: updateUserData,
            error: updateUserError,
            loading: updateUserLoading,
        },
    ] = useMutation(UPDATE_USER_MUTATION);

    const handleTaxesSwitch = async () => {
        if (!user) {
            alert("Must Be Signed In");
            return;
        }
        if (+user.id === -1) {
            const updatedUser = { ...user, useTaxes: !user.useTaxes };
            setUser({ data: updatedUser }); // Update the stored user in local storage
            return;
        }
        const variables = {
            id: user.id,
            useTaxes: !user.useTaxes,
        };

        let res = await updateUser({
            variables,
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });
    };

    const handleDarkModeSwitch = async () => {
        if (!user) {
            alert("Must Be Signed In");
            return;
        }
        
        if (+user.id === -1) {
            const updatedUser = { ...user, darkMode: !user.darkMode };
            setUser({ data: updatedUser }); // Update the stored user in local storage
            return;
        }

        console.log('here')

        const variables = {
            id: user.id,
            darkMode: !user.darkMode,
        };

        let res = await updateUser({
            variables,
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    useEffect(() => {
        if (user.darkMode && document.querySelectorAll(".dark").length === 0) {
            document.querySelector("#htmlDocument").classList.add("dark");
        } else if (
            !user.darkMode &&
            document.querySelectorAll(".dark").length === 1
        ) {
            document.querySelector("#htmlDocument").classList.remove("dark");
        }
    }, [user]);

    return (
        <>
            <nav className="container relative mx-auto p-6 bg-snow dark:bg-jet dark:text-snow">
                {/*"flex flex-row justify-center space-x-20 my-6 md:justify-between"*/}
                <div className="flex flex-col flex-wrap sm:flex-row items-center justify-between mx-auto">
                    <a href="/" className="z-30 flex items-center">
                        <img
                            src="/fauxfolio-logo.svg"
                            alt=""
                            className="logo dark:hidden"
                        />
                        <img
                            src="/fauxfolio-logo-svg-dark.svg"
                            alt=""
                            className="logo hidden dark:block"
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
                                {+user.id !== -1 && (
                                    <>
                                        {" "}
                                        <a
                                            href="/user/account"
                                            className="text-jet dark:text-snow hover:text-persianRed font-bold font-open"
                                        >
                                            {user.username}
                                        </a>{" "}
                                    </>
                                )}
                                {+user.id === -1 && (
                                    <>
                                        {" "}
                                        <a
                                            href="/user/signin"
                                            className="text-jet dark:text-snow hover:text-persianRed font-bold font-open"
                                        >
                                            Sign In
                                        </a>{" "}
                                    </>
                                )}∂
                            </h3>
                            <p className="user-money text-persianGreen font-semibold font-open">
                                {formatAmounts(user.money)}
                            </p>
                        </div>
                        {isMenuOpen && (
                            <ul className="bg-snow dark:bg-jet rounded-lg font-merriweather text-semibold dropdown-menu pt-1 ml-2 sm:pt-1 z-30 sm:absolute text-center sm:text-right text-lg sm:w-[200px] text-jet dark:text-snow font-normal sm:-right-2 bg-opacity-60 group hover:bg-opacity-100 pr-2">
                                <li className="text-jet dark:text-snow hover:text-persianRed dark:hover:text-persianRed cursor-pointer hover:font-semibold">
                                    {/* Maybe a hover window to initially set it up */}
                                    <button
                                        onClick={() => {
                                            handleTaxesSwitch();
                                        }}
                                    >
                                        {user.useTaxes
                                            ? "Disable Taxes"
                                            : "Enable Taxes"}
                                    </button>
                                </li>
                                <li
                                    className="cursor-pointer hover:text-persianRed hover:font-semibold"
                                    
                                >
                                    <a
                                            href="/user/account"
                                             >
                                            Account
                                        </a>
                                </li>
                                {user.id === "-1" && (
                                    <li
                                        className="cursor-pointer hover:text-persianRed hover:font-semibold"
                                        
                                    >
                                        <a
                                            href="/user/signin"
                                            className=""
                                        >
                                            Sign In
                                        </a>
                                    </li>
                                )}
                                {user.id !== "-1" && (
                                    <li className="">
                                        <SignOut />
                                    </li>
                                )}
                                <li className="">
                                    <button
                                        onClick={() => {
                                            if (user.darkMode) {
                                                document
                                                    .querySelector(
                                                        "#htmlDocument"
                                                    )
                                                    .classList.remove("dark");
                                            } else {
                                                document
                                                    .querySelector(
                                                        "#htmlDocument"
                                                    )
                                                    .classList.add("dark");
                                            }
                                            handleDarkModeSwitch();
                                        }}
                                    >
                                        {user.darkMode
                                            ? "Light Mode"
                                            : "Dark Mode"}
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
