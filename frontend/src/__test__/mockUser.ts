import { user } from '../../tools/lib';

export const databaseUser: user = {
  id: '1',
  apiKey: 'test-api-key',
  username: 'test-user',
  money: 1000,
  trades: [],
  stocks: [],
  shortTermTaxes: 0,
  longTermTaxes: 0,
  createdAt: new Date(),
  email: 'test@test.com',
  useTaxes: true,
  darkMode: false,
};

export const localUser: user = {
    id: '-1',
    apiKey: 'test-api-key',
    username: 'test-user',
    money: 1000,
    trades: [],
    stocks: [],
    shortTermTaxes: 0,
    longTermTaxes: 0,
    createdAt: new Date(),
    email: 'test@test.com',
    useTaxes: true,
    darkMode: false,
  };
  