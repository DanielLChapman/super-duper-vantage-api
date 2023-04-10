import React, { useState } from "react";

import { useRouter } from "next/router";

import { useUser } from "../../src/Components/User";
import dynamic from "next/dynamic";
import SignIn from "../../src/Components/UserHandling/SignIn";
import Footer from "../../src/Components/Footer";
import CondensedHeader from "../../src/Components/CondensedHeader";
const SignUp = dynamic(
    () => import("../../src/Components/UserHandling/SignUp"),
    {
        ssr: false,
    }
);

function signin(props) {
    let [needToRegister, setNeedToRegister] = useState(false);
    const router = useRouter();
    let user = useUser();

    React.useEffect(() => {
        if (user.id !== "-1") {
            router.push("/");
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen justify-between">
            <CondensedHeader />
            <div className="flex-grow-1 text-jet dark:text-snow">
                <section className="SignInContainer mx-auto flex flex-col min-h-100  w-full items-center justify-center">
                    <div className="flex w-[30rem] flex-col space-y-10">
                        <div className="text-center text-4xl font-medium font-open">
                            {" "}
                            {!needToRegister ? "Sign In" : "Sign Up"}
                        </div>
                        {!needToRegister ? <SignIn /> : <SignUp />}

                        <button
                            onClick={() => {
                                setNeedToRegister(!needToRegister);
                            }}
                            className="transform text-center font-semibold text-gray-500 duration-300 hover:text-gray-300"
                        >
                            {!needToRegister
                                ? "Need to Register?"
                                : "Sign In Instead?"}
                        </button>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}

export default signin;
