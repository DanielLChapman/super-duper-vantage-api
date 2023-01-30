import type { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import type { Lists, Context } from '.keystone/types';
import { Session } from '../types';

const graphql = String.raw;

type ID = string;

async function sellFromStock(
    root: any,
    {stockPrice, stockSymbol, dateOfTrade, stockID, amount}: { amount: number, stockPrice: number, stockSymbol: string, dateOfTrade: string, stockID: ID},
    context: Context
) {

    const sesh = context.session as Session;
    const userId = context.session.itemId;
    if (!sesh.itemId) {
        throw new Error('You must be logged in to do this!');
    }

    //Pull the user information
    // @ts-ignore
    const user = await context.db.User.findOne({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new Error('Please let an admin know, Error finding user on buyStock')
    }

    const stock = await context.db.Stock.findOne({
        where: {
            id: stockID
        }
    });

    if (!stock) {
        throw new Error('Invalid stock');
    } 

    if (stock.ownerId !== userId) {
        throw new Error('Invalid stock');
    }

    if (stock.amount < amount) {
        throw new Error('Not enough to sell');
    }

    //MAKE SURE YOU HAVE MONEY FOR SALE
    let totalPrice = (stockPrice*100 * amount);
    if (totalPrice < 0) 
    {totalPrice = 0;}

    let newMoney = +user.money + +totalPrice;

    //UPDATE USERS MONEY
    const newUser = await context.db.User.updateOne({
        where: {
            id: userId,
        },
        data: {
            money: newMoney
        }
    })

    if (!newUser) {
        throw new Error("Issue Updating User's Money")
    }


    //CREATE THE TRADE
    
    let tempDate = new Date(Date.now());
    if (dateOfTrade && dateOfTrade.length > 0) {
        tempDate = new Date(dateOfTrade);
    } 

    const trade = await context.db.Trade.createOne({
        data: {
            symbol: stockSymbol,
            amount: amount,
            // @ts-ignore
            dateOfTrade: tempDate,
            price: stockPrice,
            buySell: false,
            owner: {
                connect: {
                    id: userId,
                }
            }
        }
    });

    // @ts-ignore
    if (!trade || trade.errors) {
        throw new Error("Something happened here with creating a trade, let an admin know")
    }

    //UPDATE STOCK
    return await context.db.Stock.updateOne({
        where: {
            id: stockID
        },
        data: {
            amount: stock.amount - amount
        }
    })

}

export default sellFromStock;