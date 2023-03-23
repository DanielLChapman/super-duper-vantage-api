import React from "react";

type DateOffersProps = {
    dateOffering: {
        weekly: Date[];
        monthly: Date[];
    };
    updateSelectedDate: (m: number, d: number, y: number) => void;
    setURLSelector: (action: any | ((prevState: any) => any)) => void;
};

const DateOffers: React.FC<DateOffersProps> = ({
    dateOffering,
    updateSelectedDate,
    setURLSelector,
}) => {
    if (!dateOffering) {
        return;
    }

    return (
        <div className="date-offers">
            <h3 className="text-red-700 font-bold text-lg">
                Sorry, after 90 days the dates are more strict in requirements,
                please select one to use:
            </h3>
            <h6 className="mt-1 font-semibold text-jet">Weekly Options (Month-Date-Year)</h6>
            <ul className="text-jet">
                {dateOffering.weekly?.map((x, i) => {
                    return (
                        <li
                            className="cursor-pointer hover:text-darkOrange hover:scale-105 hover:ml-3 font-medium"
                            onClick={() => {
                                updateSelectedDate(
                                    +x.getMonth() + 1,
                                    +x.getDate(),
                                    +x.getFullYear()
                                );
                                setURLSelector("Weekly");
                            }}
                            key={i}
                        >
                            {+x.getMonth() + 1} - {+x.getDate()} -{" "}
                            {+x.getFullYear()}
                        </li>
                    );
                })}
            </ul>
            <h6 className="mt-1 font-semibold text-jet">Monthly Options (Month-Date-Year)</h6>
            <ul>
                {dateOffering.monthly?.map((x, i) => {
                    return (
                        <li
                        className="cursor-pointer hover:text-darkOrange hover:scale-105 hover:ml-3 font-medium"
                            onClick={() => {
                                updateSelectedDate(
                                    +x.getMonth() + 1,
                                    +x.getDate(),
                                    +x.getFullYear()
                                );
                                setURLSelector("Monthly");
                            }}
                            key={i}
                            data-testid={`monthly-offering-${i + 1}`}
                        >
                            {+x.getMonth() + 1} - {+x.getDate()} -{" "}
                            {+x.getFullYear()}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default DateOffers;
