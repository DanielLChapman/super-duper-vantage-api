import type { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import type { Lists, Context } from '.keystone/types';
import { Session } from '../types';

const graphql = String.raw;

type ID = string;

async function sellAllStock(
    root: any,
    {stockPrice, taxes, stockSymbol, dateOfTrade, stockID}: {taxes:boolean, stockPrice: number, stockSymbol: string, dateOfTrade: string, stockID: ID},
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

    if (stock.amount <= 0 || stock.amount % 1 !== 0) {
        throw new Error('Error in amount, must be greater than 0 and not a decimal');
    }

    //MAKE SURE YOU HAVE MONEY FOR SALE
    if (stockPrice.toString().indexOf('.') !== -1) {
        stockPrice = +((Math.round(stockPrice * 100) / 100)*100).toFixed(0);
    } 
    let totalPrice = (stockPrice * stock.amount);

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

    //UPDATE STOCK
    await context.db.Stock.deleteOne({
        where: {
            id: stockID
        }
    });

    //CREATE THE TRADE
    
    let tempDate = new Date(Date.now());
    if (dateOfTrade && dateOfTrade.length > 0) {
        tempDate = new Date(dateOfTrade);
    } 


    return await context.db.Trade.createOne({
        data: {
            symbol: stockSymbol,
            amount: stock.amount,
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

}

export default sellAllStock;