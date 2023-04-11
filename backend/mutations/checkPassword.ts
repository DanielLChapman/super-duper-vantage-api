import type { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import type { Lists, Context } from '.keystone/types';
import { Session } from '../types';


const graphql = String.raw;

async function buyStock(
    root: any,
    {
    password
    }: {password: string},
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

    //verify if passed in password is equal to user.password


}

export default buyStock;