import type { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import type { Lists, Context } from '.keystone/types';
import { Session } from '../types';

const graphql = String.raw;

async function buyStock(
    root: any,
    {stockPrice}: {stockPrice: number},
    {stockSymbol}: {stockSymbol: string},
    {amount}: {amount: number},
    {dateOfTrade}: {dateOfTrade: string},
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

    //MAKE SURE YOU HAVE MONEY FOR SALE
    let totalPrice = (stockPrice * amount);
    if (totalPrice < 0) 
    {totalPrice = 0;}

    if (user.money < totalPrice) {
        throw new Error("You don't have enough money for this trade");
    }

    let newMoney = +user.money - +totalPrice;

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
            buySell: true,
            owner: {
                connect: {
                    id: userId,
                }
            }
        }
    });

    if (!trade) {
        throw new Error("Something happened here with creating a trade, let an admin know")
    }

    //CREATE THE STOCK*/
    //NOT GOING TO CHECK IF USER HAS STOCK ALREADY,
    //CAN IN THE FRONTEND DO A COST BASIS, BUT MAYBE SHOULD BE KEPT SEPARATE.
    //CAN CHANGE IN THE FUTURE

    return await context.db.Stock.createOne({
        data: {
            symbol: stockSymbol,
            amount: amount,
            price: stockPrice,
            owner: {
                connect: {
                    id: userId,
                }
            }
        }
    });

}

export default buyStock;