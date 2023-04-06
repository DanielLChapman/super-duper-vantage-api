import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";

export const ADD_CACHE = gql`
    mutation ADD_CACHE(
        $symbol: String!
        $price: Int!
        $date: DateTime!
        $identifier: String!
    ) {
        createCacheStorage(
            data: {
                symbol: $symbol
                price: $price
                date: $date
                identifier: $identifier
            }
        ) {
            id
            symbol
            price
            createdAt
            date
            identifier
        }
    }
`;

export const GET_CACHES_BY_IDENTIFIERS = gql`
    query GetCachesByIdentifiers($ids: [String!]) {
        cacheStorages(where: { identifier: { in: $ids } }) {
            id
            symbol
            price
            identifier
            createdAt
            date
        }
    }
`;

export function addToCache(symbol: string, date: Date, price) {
    let newPrice = price * 100;
    let identifier = `${symbol.toUpperCase}-${
        date.getMonth() + 1
    }-${date.getDay()}-${date.getFullYear()}`;

    const [addCache] = useMutation(ADD_CACHE, {
        variables: {
            symbol,
            price: newPrice,
            identifier,
            dateOfTrade: date,
        },
    });

    addCache();
}

export function getCachesByIdentifiers(identifiers: string[]) {
    const { data, error, loading } = useQuery(GET_CACHES_BY_IDENTIFIERS, {
        variables: { identifiers },
    });

    // throw an error if there was a problem with the query
    if (error) {
        throw new Error(error.message);
    }

    // return the data array
    return data?.caches || [];
}
