"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var import_schema = require("@graphql-tools/schema");

// mutations/buyStock.ts
var graphql = String.raw;
async function buyStock(root, { stockPrice }, { stockSymbol }, { amount }, context) {
  const sesh = context.session;
  const userId = context.session.itemId;
  if (!sesh.itemId) {
    throw new Error("You must be logged in to do this!");
  }
  const user = await context.db.User.findOne({
    where: {
      id: userId
    }
  });
  if (!user) {
    throw new Error("Please let an admin know, Error finding user on buyStock");
  }
  let totalPrice = stockPrice * amount;
  if (totalPrice < 0) {
    totalPrice = 0;
  }
  if (user.money < totalPrice) {
    throw new Error("You don't have enough money for this trade");
  }
  let newMoney = +user.money - +totalPrice;
  return await context.db.Stock.createOne({
    data: {
      symbol: stockSymbol,
      amount,
      price: stockPrice,
      owner: {
        connect: {
          id: userId
        }
      }
    }
  });
}
var buyStock_default = buyStock;

// schema.ts
var lists = {
  User: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      username: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      apiKey: (0, import_fields.text)({ validation: { isRequired: true } }),
      money: (0, import_fields.integer)({
        defaultValue: 1e7,
        validation: {
          isRequired: true
        }
      }),
      trades: (0, import_fields.relationship)({ ref: "Trade.owner", many: true }),
      stocks: (0, import_fields.relationship)({ ref: "Stock.owner", many: true }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  }),
  Trade: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      symbol: (0, import_fields.text)({ validation: { isRequired: true } }),
      amount: (0, import_fields.integer)({ validation: { isRequired: true } }),
      price: (0, import_fields.integer)({ validation: { isRequired: true } }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      buySell: (0, import_fields.checkbox)({
        defaultValue: true,
        graphql: {
          read: {
            isNonNull: true
          },
          create: {
            isNonNull: true
          }
        }
      }),
      owner: (0, import_fields.relationship)({
        ref: "User.trades",
        ui: {
          displayMode: "cards",
          cardFields: ["username"],
          inlineEdit: { fields: ["username"] },
          linkToItem: true,
          inlineConnect: true
        },
        many: false
      })
    }
  }),
  Stock: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      symbol: (0, import_fields.text)({ validation: { isRequired: true } }),
      amount: (0, import_fields.integer)({ validation: { isRequired: true } }),
      price: (0, import_fields.integer)({ validation: { isRequired: true } }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      owner: (0, import_fields.relationship)({
        ref: "User.stocks",
        ui: {
          displayMode: "cards",
          cardFields: ["username"],
          inlineEdit: { fields: ["username"] },
          linkToItem: true,
          inlineConnect: true
        },
        many: false
      })
    }
  })
};
var extendGraphqlSchema = (schema) => (0, import_schema.mergeSchemas)({
  schemas: [schema],
  typeDefs: `
    type Mutation {
      buyStock(stockPrice: Float!, stockSymbol: String!, amount: Float!): Stock
    }
    `,
  resolvers: {
    Mutation: {
      buyStock: buyStock_default
    },
    Query: {}
  }
});

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "username",
  sessionData: "username createdAt",
  secretField: "password",
  initFirstItem: {
    fields: ["username", "apiKey", "password"]
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "sqlite",
      url: "file:./keystone.db"
    },
    lists,
    session,
    extendGraphqlSchema
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
