import { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import { lists } from '../schema';
import { Session } from '../types';

const graphql = String.raw;

async function buyStock(
    root: any,
    {stockPrice}: {stockPrice: number},
    {stockSymbol}: {stockSymbol: string},
    {amount}: {amount: number},
    context: KeystoneContext
) {

    const sesh = context.session as Session;
    const userId = context.session.itemId;
    if (!sesh.itemId) {
        throw new Error('You must be logged in to do this!');
    }

    //Pull the user information
    // @ts-ignore
    const user = await context.lists.User.findOne({
        where: {
            id: userId,
        },
        resolveFields: graphql`
            id
            money
        `,
    });

    //MAKE SURE YOU HAVE MONEY FOR SALE
    let totalPrice = (stockPrice * amount);
    if (totalPrice < 0) 
    {totalPrice = 0;}

    if (user.money < totalPrice) {
        throw new Error("You don't have enough money for this trade");
    }

    let newMoney = +user.money - +totalPrice;

    //UPDATE USERS MONEY
    // @ts-ignore
    const newUser = await context.lists.User.updateOne({
        id: userId,
        data: {
            money: newMoney
        }
    })

    if (!newUser) {
        throw new Error("Issue Updating User's Money")
    }


    //CREATE THE TRADE
    // @ts-ignore
    const trade = await context.lists.Trade.createOne({
        data: {
            symbol: stockSymbol,
            amount: amount,
            price: stockPrice,
            buySell: true,
            user: {
                connect: {
                    iid: userId,
                }
            }
        }
    });

    if (!trade) {
        throw new Error("Something happened here with creating a trade, let an admin know")
    }

    //CREATE THE STOCK
    // @ts-ignore
    return await context.lists.Stock.createOne({
        data: {
            symbol: stockSymbol,
            amount: amount,
            price: stockPrice,
            user: {
                connect: {
                    iid: userId,
                }
            }
        }
    });

}

export default buyStock;