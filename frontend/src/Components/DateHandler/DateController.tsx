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
    setURLSelector: (action: any | ((prevState: any) => any)) => void;
    
};

const DateController: React.FC<DateControllersProps> = ({
    dateBuild,
    updateHandler,
    updateAllDates,
    setURLSelector,
    
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
        //advanced
        let advanced: Date;

        let rewindTime = 5 - tempDayOfWeek;
        if (tempDayOfWeek === 6) {
            rewindTime = 6;
        }
        advanced = new Date(`${monthTemp}-${dayTemp}-${yearTemp}`);
        advanced.setDate(advanced.getDate() + rewindTime)


        let previous: Date;
        rewindTime = -tempDayOfWeek - 2;

        if (tempDayOfWeek === 6) {
            rewindTime = 1
        }
        
        previous = new Date(`${monthTemp}-${dayTemp}-${yearTemp}`);


        previous.setDate(previous.getDate() - Math.abs(rewindTime));
    
        let returnArr = [];
        if (isValidDate(previous)) {
            returnArr.push(previous);
        }
        if (isValidDate(advanced)) {
            returnArr.push(advanced)
        }
        
        return returnArr;
    };

    const getMonthly = (tempDateOfWeek: Date): Date[] => {
        //ERROR AT 1/1/2022
        let monthTemp = month;
        let dayTemp = day;
        let yearTemp = year;
        //month
        let curMonth = months[monthTemp - 1].special(yearTemp) as number;


        let advanced = new Date(`${monthTemp}-${curMonth}-${yearTemp}`);
        let previous: Date;

        if (monthTemp === 1) {
            previous = new Date(`${12}-31-${yearTemp - 1}`);
        } else {
            previous = new Date(
                `${monthTemp - 1}-${months[monthTemp - 2].special(yearTemp)}-${yearTemp}`
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

    const dateFixer = (m: number, d:number, y:number) => {
        //set temp values that have the potential to change so we dont mess with the state until the logic iis done
        let monthTemp = m;
        let dayTemp = d;
        let yearTemp = y;

        
        //establish a dateObject of the temp days, as they can be different than state
        let tempDateOfWeek = new Date(`${monthTemp}-${dayTemp}-${yearTemp}`);
        //establish a current time
        let dateObject2 = new Date(Date.now());
        if (dateObject2.getMonth()+1 === m && dateObject2.getDate() === d && dateObject2.getFullYear() === y) {
            setURLSelector('Day');
            /*
            
            RETURN FUNCTION HERE TO MOVE ONTO STOCK HIGHER FUNCTION CALL
            
            */
           updateAllDates(m, d, y);
           return;
        }
       
        //if the dateRequested is in the future, correct to today
        if (dateObject2 < tempDateOfWeek) {
            alert(
                `Can't select a future date, we are adjusting this request to todays values`
            );
            tempDateOfWeek = dateObject2;

            day = tempDateOfWeek.getDate();
            month = tempDateOfWeek.getMonth() + 1;
            year = tempDateOfWeek.getFullYear();

            updateDateByOffering(month, day, year);

            setURLSelector('Day');
            return;
        } 
        
        
        //For calculating the 90 day difference, convert to mili-seconds difference and then convert that to days
        let miliDiff = Math.abs(
            dateObject2.getTime() - tempDateOfWeek.getTime()
        );
        let dayDiff = Math.ceil(miliDiff / (1000 * 60 * 60 * 24));

        if (dayDiff < 90) {
            
            //if under 90 days
            //make sure its not a weekend, otherwise go the Friday before

            let tempDayOfWeek = tempDateOfWeek.getDay();
            if (tempDayOfWeek === 0 || tempDayOfWeek === 6) {
                tempDateOfWeek.setDate(tempDateOfWeek.getDate() - (tempDayOfWeek === 0 ? 2 : 1));
            }
            

            updateAllDates(tempDateOfWeek.getMonth()+1, tempDateOfWeek.getDate(), tempDateOfWeek.getFullYear());
            setURLSelector('Day');
        } else {
            //if over 90 days
            
            //check if it is an end of the month:
            let curMonth = months[monthTemp - 1] as Month;

            if (monthTemp === 2) {
                curMonth.numDays = curMonth.special(yearTemp);
            }

            if (dayTemp === curMonth.numDays) {
                setURLSelector('Month');
                //End of Month, use monthly
                updateDateByOffering(
                    +month,
                    +day,
                    +year
                );
                setURLSelector("Weekly");
                return
                /* 

                CALL THE OKAY DATE FUNCTION
                RETURN
                */
            }

            //check if it is a friday:
            let tempDayOfWeek = tempDateOfWeek.getDay();
            if (tempDayOfWeek === 5) {
                //already a friday, no need to offer anything else
                setURLSelector('Weekly');
                /* 

                CALL THE OKAY DATE FUNCTION
                RETURN
                */
                updateDateByOffering(
                    +month,
                    +day,
                    +year
                );
                setURLSelector("Weekly");
                return;
            }

            //Check if its a friday or end of the month already, otherwise do this
            let datesToOffer = convertToAfter90(tempDateOfWeek);
            setDateOptions(datesToOffer);
        }

    }

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
        if (yearTemp < 2000 || yearTemp > 2023) {
            alert("Invalid year, please choose between 2000 - 2023");
            return;
        }
        if (dayTemp < 1 || dayTemp > months[monthTemp - 1].numDays) {
            alert(
                "Invalid day selector, please choose between 1 and " +
                    months[monthTemp - 1].numDays
            );
            return;
        }

        
        

        dateFixer(monthTemp, dayTemp, yearTemp);
        
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
        <div className="date-selector w-2/3 pb-4 max-auto flex flex-col space-y-4">
            <h2 className="text-1xl text-jet dark:text-snow font-semibold text-center lg:text-2xl lg:text-left">Check Date To Use: </h2>
            <form onSubmit={formHandler} className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row align-middle justify-between">
                <div className="form-control flex">
                    <label htmlFor="month" className="font-semibold text-lg p-2 w-[150px] lg:w-auto dark:text-snow">Month: </label>
                    <input
                        name="month"
                        type="number"
                        min={1}
                        max={12}
                        id="month-selector"
                        value={month}
                        onChange={(e) => handleChange(e, "month")}
                        data-testid="date-controller-form-month"
                        className="flex-grow block p-2 pl-7 w-full text-md text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                    />
                </div>
                <div className="form-control  flex">
                    <label htmlFor="month" className="font-semibold text-lg p-2 w-[150px] lg:w-auto dark:text-snow">Day: </label>
                    <input
                        name="day"
                        type="number"
                        min={1}
                        max={months[month - 1]?.special(year) || 31}
                        id="day-selector"
                        value={day}
                        onChange={(e) => handleChange(e, "day")}
                        data-testid="date-controller-form-day"
                        className="flex-grow block p-2 pl-7 w-full text-md text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "

                    />
                </div>
                <div className="form-control flex">
                    <label htmlFor="year" className="font-semibold text-lg p-2 w-[150px] lg:w-auto dark:text-snow">Year: </label>
                    <input
                        name="year"
                        type="number"
                        min={1900}
                        max={dateObject.getFullYear()}
                        id="year-selector"
                        value={year}
                        onChange={(e) => handleChange(e, "year")}
                        data-testid="date-controller-form-year"
                        className="flex-grow block p-2 pl-7 w-full text-md text-gray-900 rounded-lg border border-lavenderWebBlueish focus:ring-blue-500 focus:border-blue-500 "

                    />
                </div>
                <button data-testid="date-controller-form-submit" type="submit"
                className="text-white  bg-delftBlue hover:bg-electricBlue hover:text-jet border-delftBlue focus:border-delftBlue
                focus:ring-4 transition duration-150 focus:outline-none focus:scale-105 font-medium rounded-lg text-sm px-4 py-2 "
                >Set Sell Date</button>
            </form>
            <DateOffers
                dateOffering={dateOptions}
                updateSelectedDate={updateDateByOffering}
                setURLSelector={setURLSelector}
            />
        </div>
    );
};

export default DateController;
