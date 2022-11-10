import React, { useState } from "react";
import DateController from "./DateHandler/DateController";

const StockSearch: React.FC = () => {
    const dateObject = new Date(Date.now());

    const [dateToUse, setDateToUse] = useState({
        month: dateObject.getMonth() + 1,
        day: dateObject.getDate(),
        year: dateObject.getFullYear(),
    });

    const handleChange = (val: number, selector: string) => {
        setDateToUse({
            ...dateToUse,
            [selector]: val,
        });
    };

    const updateAllDates = (m: number, d: number, y: number) => {
        setDateToUse({
            month: m,
            day: d,
            year: y,
        });
    };

    const resetDate = () => {
        setDateToUse({
            month: dateObject.getMonth() + 1,
            day: dateObject.getDate(),
            year: dateObject.getFullYear(),
        });

        //hide symbol window
        //hide sell windows
    }

    return (
        <div>
            <DateController
                dateBuild={dateToUse}
                updateHandler={handleChange}
                updateAllDates={updateAllDates}
            />
            <button onClick={resetDate}>Reset Date</button>
        </div>
    );
};

export default StockSearch;
