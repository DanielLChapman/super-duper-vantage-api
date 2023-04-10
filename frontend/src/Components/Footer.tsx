import React from "react";
import { user } from "../../tools/lib";
import { useUser } from "./User";

const Footer = () => {
    let user: user = useUser();

    return (
        <footer className="py-16 mt-16 bg-delftBlue text-white font-open font-bold ">
            {/* Footer Flex Container */}
            <div className="container flex flex-col items-center justify-between mx-auto space-y-16 px-6 md:flex-row md:space-y-0">
                {/* Logo/Menu Container */}
                <div className="flex flex-col items-center justify-between space-y-8 text-lg font-bold md:flex-row md:space-y-0 md:space-x-10 text-grayishBlue">
                    <div className="z-30 flex items-center">
                        <img
                            src="/fauxfolio-logo.svg"
                            alt=""
                            className="mb-1 pt-2 block dark:hidden"
                        />
                        <img
                            src="/fauxfolio-logo-svg-dark.svg"
                            alt=""
                            className="mb-1 pt-2 hidden dark:block"
                        />
                    </div>

                    {/* Account / Sign In */}
                    {user ? (
                        <a
                            href="./user/settings/edit"
                            className="uppercase text-sm md:text-base hover:text-persianRed "
                        >
                            Account
                        </a>
                    ) : (
                        <a
                            href="./signin"
                            className="uppercase text-sm md:text-base hover:text-persianRed "
                        >
                            Sign In
                        </a>
                    )}

                    <a
                        href="./faq"
                        className="uppercase text-sm md:text-base hover:text-persianRed"
                    >
                        FAQ
                    </a>
                </div>

                {/* Social Container */}
                <div className="flex space-x-10 -top-0.5 pt-0.25 relative">
                    <a href="#">social-1</a>
                    <a href="#">social-2</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
