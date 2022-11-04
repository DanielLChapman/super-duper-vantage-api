import React, { useState } from "react";
import { Month, months } from "../../tools/lib";

const DateController = () => {
    const dateObject = new Date(Date.now());

    //0-11, so plus one on API call
    //const [month, setMonth] = useState(dateObject.getMonth() + 1);

    //For converting to Fridays,
    //sunday - saturday: 0 - 6, August 19 2019 is a Monday so it would be 1.
    //const [day, setDay] = useState(dateObject.getDate());

    //const [year, setYear] = useState(dateObject.getFullYear());

    const [dateToUse, setDateToUse] = useState({
        month: dateObject.getMonth() + 1,
        day: dateObject.getDate(),
        year: dateObject.getFullYear(),
    });

    const [dateOptions, setDateOptions] = useState(null);

    const getWeekly = (tempDateOfWeek: Date): Date[] => {
        let tempDayOfWeek = tempDateOfWeek.getDay();
        let month = dateToUse.month;
        let day = dateToUse.day;
        let year = dateToUse.year;

        if (tempDayOfWeek === 5) {
            //already a friday, no need to offer anything else
            return [tempDateOfWeek];
        } else {
            let advanced = new Date(
                `${month}-${day + (5 - tempDayOfWeek)}-${year}`
            );
            let previous = new Date(
                `${month}-${day - tempDayOfWeek - 2}-${year}`
            );
            return [previous, advanced];
        }
    };

    const getMonthly = (tempDateOfWeek: Date): Date[] => {
        let month = dateToUse.month;
        let day = dateToUse.day;
        let year = dateToUse.year;
        //month
        let curMonth = months[month - 1] as Month;

        if (month === 2) {
            curMonth.numDays = curMonth.special(year);
        }

        if (day === curMonth.numDays) {
            //End of Month, use monthly
            return [tempDateOfWeek];
        } else {
            let advanced = new Date(`${month}-${curMonth.numDays}-${year}`);
            let previous: Date;
            if (month === 0) {
                previous = new Date(`${12}-${months[11].numDays}-${year - 1}`);
            } else {
                previous = new Date(
                    `${month - 1}-${months[month - 2].numDays}-${year}`
                );
            }

            return [previous, advanced];
        }
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
        let month = dateToUse.month;
        let day = dateToUse.day;
        let year = dateToUse.year;
        //setApproved(false);
        let tempDateOfWeek = new Date(`${month}-${day}-${year}`);
        let dateObject2 = new Date(Date.now());
        let miliDiff = Math.abs(
            dateObject2.getTime() - tempDateOfWeek.getTime()
        );
        let dayDiff = Math.ceil(miliDiff / (1000 * 60 * 60 * 24));

        if (dayDiff < 90) {
            //if under 90 days
            //make sure its not a weekend, otherwise go the Friday before
            //we can pull the stock and just try the date - 1 until it works
            /*

            let tempDayOfWeek = tempDateOfWeek.getDay();
            if (tempDayOfWeek === 0 || tempDayOfWeek === 6) {
                tempDateOfWeek = new Date(`${month}-${day-(tempDayOfWeek === 0 ? 1 : 2)}-${year}`);
            }
            setDay(day - 2);
            setApproved(true);
            setApprovedDate(tempDateOfWeek);
            */
            //if any of the days are holidays, tell them to pick another date
        } else {
            //if over 90 days
            let datesToOffer = convertToAfter90(tempDateOfWeek);
            setDateOptions(datesToOffer);
        }
    };

    const handleChange = (event, selector: string) => {
        event.preventDefault();
        let val = event.target.value();
        setDateToUse({
            ...dateToUse,
            [selector]: val,
        });
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
                        value={dateToUse.month}
                        onChange={(e) => handleChange(e, "month")}
                    />
                </div>
                <div className="form-control">
                    <label htmlFor="month">Day</label>
                    <input
                        name="day"
                        type="number"
                        min={1}
                        max={months[dateToUse.month - 1].numDays+1}
                        id="day-selector"
                        value={dateToUse.day}
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
                        value={dateToUse.year}
                        onChange={(e) => handleChange(e, "year")}
                    />
                </div>
                <button type="submit">Set Sell Date</button>
            </form>
        </section>
    );
};

export default DateController;
