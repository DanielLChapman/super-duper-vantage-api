import type { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import type { Lists, Context } from '.keystone/types';
import { Session } from '../types';

const graphql = String.raw;

async function sellStock(
    root: any,
    {
        stockPrice,
        stockSymbol,
        amount,
        dateOfTrade}: {stockPrice: number, stockSymbol: string, amount: number, dateOfTrade: string},
    context: Context
) {
    if (amount <= 0 || amount % 1 !== 0) {
        throw new Error('Error in amount, must be greater than 0 and not a decimal');
    }
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
    if (stockPrice.toString().indexOf('.') !== -1) {
        stockPrice = +((Math.round(stockPrice * 100) / 100)*100).toFixed(0);
    } 
    let totalPrice = (stockPrice* amount);
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
            price: stockPrice,
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