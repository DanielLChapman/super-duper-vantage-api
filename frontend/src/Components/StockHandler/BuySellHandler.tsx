import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { CURRENT_USER_QUERY } from "../User";
import { user as userType } from "../../../tools/lib";
import roundToTwo from "../../../tools/roundToTwo";
import { GET_STOCKS, GET_TRADES } from "../DataDisplay/DataContainer";

type BuySellProps = {
    amount: number;
    symbol: string;
    price: number;
    user: userType;
    date: string;
    buySellHandler: () => void;
};

export const BUY_STOCK_HANDLER = gql`
    mutation BUY_STOCK_MUTATION(
        $stockPrice: Float!
        $stockSymbol: String!
        $amount: Float!
        $dateOfTrade: String
    ) {
        buyStock(
            stockPrice: $stockPrice
            stockSymbol: $stockSymbol
            amount: $amount
            dateOfTrade: $dateOfTrade
        ) {
            id
            symbol
            amount
            price
            buySell
        }
    }
`;

export const SELL_STOCK_HANDLER = gql`
    mutation SELL_STOCK_MUTATION(
        $stockPrice: Float!
        $stockSymbol: String!
        $amount: Float!
        $taxes: Boolean
        $dateOfTrade: String
    ) {
        sellStock(
            stockPrice: $stockPrice
            stockSymbol: $stockSymbol
            amount: $amount
            dateOfTrade: $dateOfTrade
            taxes: $taxes
        ) {
            id
            symbol
            amount
            price
            buySell
        }
    }
`;

const BuySellHandler: React.FC<BuySellProps> = ({
    user,
    amount,
    symbol,
    price,
    date,
}) => {
    if (!user) {
        return <span>Please log in</span>;
    }

    let dateCheck = Date.now() + "";
    if (date) {
        dateCheck = date;
    }

    let convertedPrice = +(roundToTwo(+price) * 100).toFixed(0);

    const [buyStock, { data: buyData, error: buyError, loading: buyLoading }] =
        useMutation(BUY_STOCK_HANDLER, {
            variables: {
                stockPrice: convertedPrice,
                stockSymbol: symbol,
                amount: +amount,
                dateOfTrade: dateCheck,
            },
            refetchQueries: [
                { query: CURRENT_USER_QUERY },
                {
                    query: GET_STOCKS,
                    variables: {
                        userID: user.id,
                        limit: 10,
                        offset: 0,
                    },
                },
            ],
        });

    if (buyError) {
        console.log(buyError);
    }
    const [
        sellStock,
        { data: sellData, error: sellError, loading: sellLoading },
    ] = useMutation(SELL_STOCK_HANDLER, {
        variables: {
            stockPrice: convertedPrice,
            stockSymbol: symbol,
            amount: +amount,
            dateOfTrade: dateCheck,
        },
        refetchQueries: [
            { query: CURRENT_USER_QUERY },
            {
                query: GET_TRADES,
                variables: {
                    userID: user.id,
                    limit: 10,
                    offset: 0,
                },
            },
        ],
    });

    //graphql call to update user
    const buyHandler = async (swapOption) => {
        let res;
        switch (swapOption) {
            case "buy":
                res = await buyStock();
                break;
            case "sell":
                res = await sellStock();
                break;
            default:
                console.log("error", swapOption);
        }
    };

    return (
        <div>
            <h5 className="buy-sell-info-text pt-4 px-2 text-lg font-semibold">
                <span className="text-darkOrange ">
                    {symbol.replace(/^\w/, (c) => c.toUpperCase())}
                </span>{" "}
                has a price of{" "}
                <span className="text-persianGreen">
                    $
                    {price.toLocaleString("USD", {
                        style: "currency",
                        currency: "USD",
                    })}{" "}
                </span>
                for each share on this{" "}
                <span className="text-persianRed">date</span>:{" "}
            </h5>
            <h5 className="buy-sell-info-text pb-4 px-2 text-lg font-semibold w-full text-center">
                {dateCheck.split("-").join(" / ")} (adjusted)
            </h5>
            <div className="flex flex-row justify-center align-middle w-full">
                <button
                    className="buy-button bg-persianGreen py-2 px-4 text-lg font-semibold text-white rounded-lg  hover:bg-olive hover:text-jet  focus:outline-none focus:ring-4 focus:ring-persianGreen "
                    onClick={() => {
                        buyHandler("buy");
                    }}
                >
                    Buy {amount}
                </button>
                <button
                    className="sell-button bg-persianRed  py-2 px-4 text-lg font-semibold text-white rounded-lg hover:bg-olive hover:text-jet focus:ring-opacity-100 focus:outline-none focus:ring-4 focus:ring-persianRed"
                    onClick={() => {
                        buyHandler("sell");
                    }}
                >
                    Sell {amount}
                </button>
            </div>

            <h5 className="buy-sell-text text-center text-lg py-4 font-semibold">
                Of <span className="text-darkOrange">{symbol}</span> for{" "}
                <span className="text-persianGreen">
                    {roundToTwo(price * amount).toLocaleString("USD", {
                        style: "currency",
                        currency: "USD",
                    })}
                </span>
            </h5>
        </div>
    );
};

export default BuySellHandler;
