import { mergeSchemas } from "@graphql-tools/schema";
import { KeystoneContext } from "@keystone-6/core/types";
import type { GraphQLSchema } from "graphql";
import { Session } from "./types";
import { Lists, Context } from ".keystone/types";
import buyStock from "./mutations/buyStock";

const graphql = String.raw;

export const extendGraphqlSchema = (schema: GraphQLSchema) => {
    mergeSchemas({
        schemas: [schema],
        typeDefs: `
      type Mutation {
        buyStock(stockPrice: Float!, stockSymbol: String!, amount: Float!): Stock
      }
      `,
        resolvers: {
            buyStock
        },
    });
};
