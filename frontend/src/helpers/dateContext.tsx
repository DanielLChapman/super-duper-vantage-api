import React, {createContext} from 'react';

const dateObject = new Date(Date.now());

export const dateContext = React.createContext({
    month: dateObject.getMonth() + 1,
    day: dateObject.getDate(),
    year: dateObject.getFullYear(),
});

export const handleDateChange = (val: any, selector: any, dateToUse: any, setDateToUse: (arg0: any) => void, setVerifiedDates: (arg0: boolean) => void, setCheckedStocks: (arg0: any[]) => void, setViewStateManager: (arg0: any) => void, views: any) => {
    setDateToUse({
        ...dateToUse,
        [selector]: val,
    });
    setVerifiedDates(false);
    setCheckedStocks([]);
    setViewStateManager(views);
  };
  
  export const updateAllDates = (m: number, d: number, y: number, setDateToUse: any, setVerifiedDates: any, setCheckedStocks: any, handleStateManager: any) => {
    setDateToUse({
      month: m,
      day: d,
      year: y,
    });
    setVerifiedDates(true);
    setCheckedStocks([]);
    handleStateManager("advance");
  };
  
  export const resetDate = (setDateToUse: any, views: any, setVerifiedDates: any, setCheckedStocks: any, setViewStateManager: any, setNuKey: any, dateObject: any) => {
    setDateToUse({
      month: dateObject.getMonth() + 1,
      day: dateObject.getDate(),
      year: dateObject.getFullYear(),
    });
    setVerifiedDates(true);
    setCheckedStocks([]);
    setViewStateManager(views);
    setNuKey(Math.random() * 1000);
  
    //hide symbol window
    //hide sell windows
  };
  