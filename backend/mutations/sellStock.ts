import type { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import type { Lists, Context } from '.keystone/types';
import { Session } from '../types';

const graphql = String.raw;

async function sellStock(
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

    //CALCULATINIG MONEY
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

    return await context.db.Trade.createOne({
        data: {
            symbol: stockSymbol,
            amount: amount,
            // @ts-ignore
            dateOfTrade: tempDate,
            price: stockPrice * 100,
            buySell: false,
            owner: {
                connect: {
                    id: userId,
                }
            }
        }
    });

    //DONT NEED TO CREATE THE STOCK AS WE ARE SELLING OFF

}

export default sellStock;