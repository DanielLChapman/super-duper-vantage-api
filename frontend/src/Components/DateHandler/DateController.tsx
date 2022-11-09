import React, { useState } from "react";
import { isValidDate, Month, months } from "../../../tools/lib";
import DateOffers from "./DateOffers";

type DateControllersProps = {
    dateBuild: {
        month: number;
        day: number;
        year: number;
    };
    updateHandler: (val: number, selector: string) => void;
    updateAllDates: (m: number, d: number, y: number) => void;
};

const DateController: React.FC<DateControllersProps> = ({
    dateBuild,
    updateHandler,
    updateAllDates,
}) => {
    const dateObject = new Date(Date.now());
    if (!dateBuild) return <span className="loading-span">Loading...</span>;

    //0-11, so plus one on API call
    //const [month, setMonth] = useState(dateObject.getMonth() + 1);

    //For converting to Fridays,
    //sunday - saturday: 0 - 6, August 19 2019 is a Monday so it would be 1.
    //const [day, setDay] = useState(dateObject.getDate());

    //const [year, setYear] = useState(dateObject.getFullYear());

    /*
    const [dateToUse, setDateToUse] = useState({
        month: dateObject.getMonth() + 1,
        day: dateObject.getDate(),
        year: dateObject.getFullYear(),
    });*/
    let month = dateBuild.month;
    let day = dateBuild.day;
    let year = dateBuild.year;

    const [dateOptions, setDateOptions] = useState(null);

    const getWeekly = (tempDateOfWeek: Date): Date[] => {
        let tempDayOfWeek = tempDateOfWeek.getDay();
        let monthTemp = month;
        let dayTemp = day;
        let yearTemp = year;

        let advanced = new Date(
            `${monthTemp}-${dayTemp + (5 - tempDayOfWeek)}-${yearTemp}`
        );
        let previous = new Date(
            `${monthTemp}-${dayTemp - tempDayOfWeek - 2}-${yearTemp}`
        );
        if (!isValidDate(advanced)) {
            return [previous];
        }
        if (!isValidDate(previous)) {
            return [advanced];
        }
        return [previous, advanced];
    };

    const getMonthly = (tempDateOfWeek: Date): Date[] => {
        let monthTemp = month;
        let dayTemp = day;
        let yearTemp = year;
        //month
        let curMonth = months[monthTemp - 1] as Month;

        if (monthTemp === 2) {
            curMonth.numDays = curMonth.special(yearTemp);
        }

        let advanced = new Date(`${monthTemp}-${curMonth.numDays}-${yearTemp}`);
        let previous: Date;
        if (monthTemp === 0) {
            previous = new Date(`${12}-${months[11].numDays}-${yearTemp - 1}`);
        } else {
            previous = new Date(
                `${monthTemp - 1}-${months[monthTemp - 2].numDays}-${yearTemp}`
            );
        }

        return [previous, advanced];
    };

    const convertToAfter90 = (
        tempDateOfWeek: Date
    ): { weekly: Date[]; monthly: Date[] } => {
        //convert to day
        //let tempDateOfWeek = new Date(`${month}-${day}-${year}`);
        let returnArr;

        const monthReturn = getMonthly(tempDateOfWeek);
        const weekReturn = getWeekly(tempDateOfWeek);
        //weeks

        return { weekly: weekReturn, monthly: monthReturn };
    };

    const formHandler = (event: React.FormEvent) => {
        event.preventDefault();
        let monthTemp = month;
        let dayTemp = day;
        let yearTemp = year;

        //quick validation
        if (monthTemp < 1 || monthTemp > 12) {
            alert("Invalid month, please choose between 1 - 12");
            return;
        }
        if (yearTemp < 2000 || yearTemp > 2022) {
            alert("Invalid year, please choose between 2000 - 2022");
            return;
        }
        if (dayTemp < 1 || dayTemp > months[monthTemp - 1].numDays) {
            alert(
                "Invalid day selector, please choose between 1 and " +
                    months[monthTemp - 1].numDays
            );
            return;
        }

        let tempDateOfWeek = new Date(`${monthTemp}-${dayTemp}-${yearTemp}`);
        let dateObject2 = new Date(Date.now());

        if (dateObject2 < tempDateOfWeek) {
            alert(
                `Can't select a future date, we are adjusting this request to todays values`
            );
            tempDateOfWeek = dateObject2;
        }

        //setApproved(false);

        let miliDiff = Math.abs(
            dateObject2.getTime() - tempDateOfWeek.getTime()
        );
        let dayDiff = Math.ceil(miliDiff / (1000 * 60 * 60 * 24));

        if (dayDiff < 90) {
            //if under 90 days
            //make sure its not a weekend, otherwise go the Friday before
            //we can pull the stock and just try the date - 1 until it works

            let tempDayOfWeek = tempDateOfWeek.getDay();
            if (tempDayOfWeek === 0 || tempDayOfWeek === 6) {
                updateAllDates(month, day - (tempDayOfWeek === 0 ? 2 : 1), year);
            } else {
                updateAllDates(month, day, year);
            }

            

            //higher function call here
        } else {
            //if over 90 days

            //check if it is an end of the month:
            let curMonth = months[monthTemp - 1] as Month;

            if (monthTemp === 2) {
                curMonth.numDays = curMonth.special(yearTemp);
            }

            if (dayTemp === curMonth.numDays) {
                //End of Month, use monthly
                /* 

                CALL THE OKAY DATE FUNCTION
                RETURN
                */
            }

            //check if it is a friday:
            let tempDayOfWeek = tempDateOfWeek.getDay();
            if (tempDayOfWeek === 5) {
                //already a friday, no need to offer anything else
                /* 

                CALL THE OKAY DATE FUNCTION
                RETURN
                */
            }

            //Check if its a friday or end of the month already, otherwise do this
            let datesToOffer = convertToAfter90(tempDateOfWeek);
            setDateOptions(datesToOffer);
        }
    };

    const handleChange = (event, selector: string) => {
        event.preventDefault();
        let val = +event.target.value;

        updateHandler(val, selector);
    };

    const updateDateByOffering = (m: number, d: number, y: number) => {
        updateAllDates(+m, +d, +y);
        setDateOptions(null);
        //higher function call
    };

    return (
        <section className="date-selector">
            <form onSubmit={formHandler}>
                <div className="form-control">
                    <label htmlFor="month">Month</label>
                    <input
                        name="month"
                        type="number"
                        min={1}
                        max={12}
                        id="month-selector"
                        value={month}
                        onChange={(e) => handleChange(e, "month")}
                    />
                </div>
                <div className="form-control">
                    <label htmlFor="month">Day</label>
                    <input
                        name="day"
                        type="number"
                        min={1}
                        max={months[month - 1].numDays + 1}
                        id="day-selector"
                        value={day}
                        onChange={(e) => handleChange(e, "day")}
                    />
                </div>
                <div className="form-control">
                    <label htmlFor="month">Year</label>
                    <input
                        name="day"
                        type="number"
                        min={1900}
                        max={dateObject.getFullYear()}
                        id="year-selector"
                        value={year}
                        onChange={(e) => handleChange(e, "year")}
                    />
                </div>
                <button type="submit">Set Sell Date</button>
            </form>
            <DateOffers
                dateOffering={dateOptions}
                updateSelectedDate={updateDateByOffering}
            />
        </section>
    );
};

export default DateController;
