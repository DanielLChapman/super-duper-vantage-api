import React, { useState } from "react";
import EditAccountInfo from "./EditAccountInfo";
import { useMutation } from "@apollo/client";
import { SIGNIN_MUTATION } from "./SignIn";
import { user } from "../../../tools/lib";

interface EditAccountInfoProps {
    user: user;
}

const AccountContainer: React.FC<EditAccountInfoProps> = ({ user }) => {
    const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
    const [isEditTaxesOpen, setIsEditTaxesOpen] = useState(false);

    const handleAccountUpdate = (username: string, password: string) => {
        console.log("Account updated:", { username, password });
        // Call your Apollo GraphQL mutation to update the user's account here.
        setIsEditAccountOpen(false);
    };

    return (
        <section className="account-page w-full max-w-[1500px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Edit Account Info */}
                <div className="account-info border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <button
                        onClick={() => setIsEditAccountOpen(!isEditAccountOpen)}
                        className="text-lg font-semibold text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                        Edit Account Info
                    </button>
                    {isEditAccountOpen && (
                        <EditAccountInfo onUpdate={handleAccountUpdate} user={user} />
                    )}
                </div>

                {/* Edit Taxes Info */}
                <div className="account-info border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <button
                        onClick={() => setIsEditTaxesOpen(!isEditTaxesOpen)}
                        className="text-lg font-semibold text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                        Edit Taxes
                    </button>
                    {isEditTaxesOpen && (
                        <span>taxes</span>
                    )}
                </div>

                {/* Edit Delete */}
                <div className="account-info border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <button
                        onClick={() => {}}
                        className="text-lg font-semibold text-red-600 hover:text-red-800 focus:outline-none"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AccountContainer;
