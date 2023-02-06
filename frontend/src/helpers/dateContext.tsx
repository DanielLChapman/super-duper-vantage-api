import React, {createContext} from 'react';

const dateObject = new Date(Date.now());

export const dateContext = React.createContext({
    month: dateObject.getMonth() + 1,
    day: dateObject.getDate(),
    year: dateObject.getFullYear(),
});
