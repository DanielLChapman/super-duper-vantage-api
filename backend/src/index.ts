import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    type TradeHistory {
        id: string,
        symbol: string,
        amount: number,
        price: number,
        date: Date,
        buySell: 'buy' | 'sell',
    }
    
    type User {
        id: String,
        apiKey: String,
        username: String,
        money: Number,
        tradeHistory: [TradeHistory] | [],
        currentStocks: [Stock] | []
    }

    type Stock {
        symbol: string,
        amount: number,
        price: number,
        purchaseDate: Date,
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
    #type Query {
    #    books: [Book]
    #}
`;
