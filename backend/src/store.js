import crypto from 'crypto';

const state = {
  users: [],
  restaurants: [],
  menuItems: [],
  orders: [],
  reviews: []
};

export function id() { return crypto.randomUUID(); }
export function now() { return new Date().toISOString(); }
export default state;
