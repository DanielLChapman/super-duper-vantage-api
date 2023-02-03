export const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export type Month = {
    name: string;
    numDays: number;
    special: (number) => number | null;
};

export const months = {
    "0": {
        name: "January",
        numDays: 31,
        special() {
            return 31;
        },
    },
    "1": {
        name: "February",
        numDays: 28,
        special(year) {
            if (year % 4 === 0) {
                return 29;
            } else {
                return 28;
            }
        },
    },
    "2": {
        name: "March",
        numDays: 31,
        special() {
            return 31;
        },
    },
    "3": {
        name: "April",
        numDays: 30,
        special() {
            return 30;
        },
    },
    "4": {
        name: "May",
        numDays: 31,
        special() {
            return 31;
        },
    },
    "5": {
        name: "June",
        numDays: 30,
        special() {
            return 30;
        },
    },
    "6": {
        name: "July",
        numDays: 31,
        special() {
            return 31;
        },
    },
    "7": {
        name: "August",
        numDays: 31,
        special() {
            return 31;
        },
    },
    "8": {
        name: "September",
        numDays: 30,
        special() {
            return 30;
        },
    },
    "9": {
        name: "October",
        numDays: 31,
        special() {
            return 31;
        },
    },
    "10": {
        name: "November",
        numDays: 30,
        special() {
            return 30;
        },
    },
    "11": {
        name: "December",
        numDays: 31,
        special() {
            return 31;
        },
    },
};

export const isValidDate = (d) => {
    return d instanceof Date && !isNaN(d.getDate());
};

export type tradeHistory = {
    id: string,
    symbol: string,
    amount: number,
    //sell price or buy price
    price: number,
    dateOfTrade?: Date,
    buySell: boolean
}

export type stock = {
    //default buy since you cant own a sold stock right now
    symbol: string,
    amount: number,
    price: number,
    createdAt?: Date,
}

export type user = {
    id: string,
    apiKey: string,
    username: string,
    money: number,
    trades?: [tradeHistory] | [],
    stocks?: [stock] | [],
    createdAt?: Date
}