import React from "react";
import UpdateFieldForm from "./UpdateFieldForm";
import { user } from "../../../tools/lib";


interface EditTaxesInfoProps {
    formValues: {
        password: string;
        newUsername: string;
        newPassword: string;
        newEmail: string;
        newApiKey: string;
        shortTermTaxes: number;
        longTermTaxes: number;
    };
    setFormValues: React.Dispatch<
        React.SetStateAction<{
            password: string;
            newUsername: string;
            newPassword: string;
            newEmail: string;
            newApiKey: string;
            shortTermTaxes: number;
            longTermTaxes: number;
        }>
    >;
    setFormErrors: React.Dispatch<
        React.SetStateAction<{
            username: string;
            password: string;
            email: string;
            api: string;
            shortTermTaxes: string;
            longTermTaxes: string;
        }>
    >;
    formErrors: {
        username: string;
        password: string;
        email: string;
        api: string;
        shortTermTaxes: string;
        longTermTaxes: string;
    };
    handleUpdate: (type: string) => Promise<void>;
}

const EditTaxes: React.FC<EditTaxesInfoProps> = ({
    formValues,
    formErrors,
    setFormValues,
    setFormErrors,
    handleUpdate,
}) => {
    const updateFormValue = (key: string, value: string) => {
        setFormValues((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <div className="bg-snow font-open rounded-lg p-6">
            <UpdateFieldForm
                label="Change Short Term Taxes (out of 100)"
                placeholder="0"
                value={formValues.shortTermTaxes}
                error={formErrors["shortTermTaxes"]}
                fieldType="number"
                onChange={(value) => updateFormValue("shortTermTaxes", value)}
                onSubmit={() => handleUpdate("username")}
            />

            <UpdateFieldForm
                label="Change Long Term Taxes (out of 100)"
                placeholder="0"
                value={formValues.longTermTaxes}
                error={formErrors["longTermTaxes"]}
                fieldType="number"
                onChange={(value) => updateFormValue("longTermTaxes", value)}
                onSubmit={() => handleUpdate("username")}
            />
        </div>
    );
};

export default EditTaxes;
