import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import state, { id, now } from '../store.js';

const SECRET = process.env.JWT_SECRET || 'menuify-local-secret';

export function slugify(value) {
  return String(value || 'restaurant').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'restaurant';
}

export function uniqueSlug(name) {
  const base = slugify(name);
  let slug = base, n = 2;
  while (state.restaurants.some(r => r.slug === slug)) slug = `${base}-${n++}`;
  return slug;
}

export function sign(userId) { return jwt.sign({ userId }, SECRET, { expiresIn: '7d' }); }
export function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Please log in.' });
  try {
    const payload = jwt.verify(token, SECRET);
    const user = state.users.find(u => u.id === payload.userId);
    if (!user) return res.status(401).json({ message: 'Session expired.' });
    req.user = user;
    next();
  } catch { return res.status(401).json({ message: 'Invalid or expired session.' }); }
}

export function publicRestaurant(r) {
  return { id: r.id, name: r.name, slug: r.slug, description: r.description || '' };
}

export function session(user, restaurant) {
  return { token: sign(user.id), user: { id: user.id, name: user.name, email: user.email }, restaurant: publicRestaurant(restaurant) };
}

export async function passwordHash(password) { return bcrypt.hash(password, 10); }
export async function passwordMatch(password, hash) { return bcrypt.compare(password, hash); }
export function restaurantForUser(userId) { return state.restaurants.find(r => r.ownerId === userId); }
export function menuItemForUser(userId, itemId) {
  const restaurant = restaurantForUser(userId);
  return { restaurant, item: state.menuItems.find(i => i.id === itemId && i.restaurantId === restaurant?.id) };
}
export function orderForRestaurant(userId, orderId) {
  const restaurant = restaurantForUser(userId);
  return { restaurant, order: state.orders.find(o => o.id === orderId && o.restaurantId === restaurant?.id) };
}
export { state, id, now };
