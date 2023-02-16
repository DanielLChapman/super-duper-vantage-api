// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  checkbox,
} from '@keystone-6/core/fields';

// the document field is a more complicated field, so it has it's own package
import { document } from '@keystone-6/fields-document';
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from '.keystone/types';
import { mergeSchemas } from '@graphql-tools/schema';
import type { GraphQLSchema } from 'graphql';
import buyStock from './mutations/buyStock';
import sellStock from './mutations/sellStock';
import sellFromStock from './mutations/sellFromStock';
import sellAllStock from './mutations/sellAllStock';

export const lists: Lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      username: text({ validation: { isRequired: true}, isIndexed: 'unique' }),

      password: password({ validation: { isRequired: true } }),
      apiKey: text({ validation: { isRequired: true } }),
      money: integer({
        //in pennies, so have to convert, $100,000 = 10000000
        defaultValue: 10000000,
          validation: {
            isRequired: true,
          },
      }),

      trades: relationship({ ref: 'Trade.owner', many: true }),
      stocks: relationship({ ref: 'Stock.owner', many: true }),
      shortTermTaxes: integer({
        defaultValue: 35,
      }),
      longTermTaxes: integer({
        defaultValue: 15,
      }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Trade: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our Post list
    fields: {
      symbol: text({ validation: { isRequired: true } }),
      amount: integer({ validation: { isRequired: true } }),
      //converting to pennies
      price: integer({ validation: { isRequired: true } }),

      dateOfTrade: timestamp({
        // this sets the timestamp to Date.now() when the trade is first created
        defaultValue: { kind: 'now' },
      }),
      

      buySell: checkbox({
        //true - buy, sell - false
        defaultValue: true,
        graphql: {
          read: {
            isNonNull: true
          },
          create: {
            isNonNull: true
          },
        }
      }),


      // with this field, you can set a User as the author for a Post
      owner: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: 'User.trades',

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['username'],
          inlineEdit: { fields: ['username'] },
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

    },
  }),

  Stock: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our Post list
    fields: {
      symbol: text({ validation: { isRequired: true } }),
      amount: integer({ validation: { isRequired: true } }),
      //converting to pennies
      price: integer({ validation: { isRequired: true } }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),

      dateOfTrade: timestamp({
        // this sets the timestamp to Date.now() when the trade is first created
        defaultValue: { kind: 'now' },
      }),


      // with this field, you can set a User as the author for a Post
      owner: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: 'User.stocks',

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['username'],
          inlineEdit: { fields: ['username'] },
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

    },
  }),

};


export const extendGraphqlSchema = (schema: GraphQLSchema) =>
  mergeSchemas({
    schemas: [schema],
    typeDefs: `
    type Mutation {
      buyStock(stockPrice: Float!, stockSymbol: String!, amount: Float!, dateOfTrade: String): Trade
      sellStock(taxes: Boolean, stockPrice: Float!, stockSymbol: String!, amount: Float!, dateOfTrade: String): Trade
      sellFromStock(taxes: Boolean, stockPrice: Float!, stockSymbol: String!, amount: Float!, dateOfTrade: String, stockID: ID!): Trade
      sellAllStock(taxes: Boolean, stockPrice: Float!, stockSymbol: String!, dateOfTrade: String, stockID: ID!): Trade
    }
    
    `,
    resolvers: {
      Mutation: {
        buyStock: buyStock,
        sellStock: sellStock,
        sellFromStock: sellFromStock,
        sellAllStock: sellAllStock,
      },
      Query: {

      },
    },
  });