import React from "react";

type DateOffersProps = {
    dateOffering: {
        weekly: Date[];
        monthly: Date[];
    };
    updateSelectedDate: (m: number, d: number, y: number) => void;
};

const DateOffers: React.FC<DateOffersProps> = ({
    dateOffering,
    updateSelectedDate,
}) => {
    if (!dateOffering) {
        return;
    }

    return (
        <div className="date-offers">
            <h3>
                Sorry, after 90 days the dates are more strict in requirements,
                please select one to use
            </h3>
            <h6>Weekly Options (Month-Date-Year)</h6>
            <ul>
                {dateOffering.weekly?.map((x, i) => {
                    return (
                        <li
                            onClick={() =>
                                updateSelectedDate(
                                    +x.getMonth(),
                                    +x.getDate(),
                                    +x.getFullYear()
                                )
                            }
                            key={i}
                        >
                            {+x.getMonth() + 1} - {+x.getDate()} -{" "}
                            {+x.getFullYear()}
                        </li>
                    );
                })}
            </ul>
            <h6>Monthly Options (Month-Date-Year)</h6>
            <ul>
                {dateOffering.monthly?.map((x, i) => {
                    return (
                        <li
                            onClick={() =>
                                updateSelectedDate(
                                    x.getMonth(),
                                    x.getDate(),
                                    x.getFullYear()
                                )
                            }
                            key={i}
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
