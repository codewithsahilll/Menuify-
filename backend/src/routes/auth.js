import { Router } from 'express';
import { auth, id, now, uniqueSlug, passwordHash, passwordMatch, restaurantForUser, session, state } from './_helpers.js';

const router = Router();

router.post('/signup', async (req, res) => {
  const { name, restaurantName, email, password } = req.body || {};
  if (!name || !restaurantName || !email || !password) return res.status(400).json({ message: 'All fields are required.' });
  if (String(password).length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  const normalized = String(email).trim().toLowerCase();
  if (state.users.some(u => u.email === normalized)) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = { id: id(), name: String(name).trim(), email: normalized, passwordHash: await passwordHash(password), createdAt: now() };
  const restaurant = { id: id(), ownerId: user.id, name: String(restaurantName).trim(), slug: uniqueSlug(restaurantName), description: 'Fresh food. Simple ordering.', createdAt: now() };
  state.users.push(user); state.restaurants.push(restaurant);
  res.status(201).json(session(user, restaurant));
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = state.users.find(u => u.email === String(email || '').trim().toLowerCase());
  if (!user || !(await passwordMatch(String(password || ''), user.passwordHash))) return res.status(401).json({ message: 'Incorrect email or password.' });
  const restaurant = restaurantForUser(user.id);
  res.json(session(user, restaurant));
});

router.post('/demo', async (_req, res) => {
  let user = state.users.find(u => u.email === 'owner@menuify.demo');
  let restaurant = user && restaurantForUser(user.id);
  if (!user) {
    user = { id: id(), name: 'Demo Owner', email: 'owner@menuify.demo', passwordHash: await passwordHash('menuify123'), createdAt: now() };
    restaurant = { id: id(), ownerId: user.id, name: 'Brew & Bite Cafe', slug: 'brew-bite-cafe', description: 'Coffee, comfort food and quick bites.', createdAt: now() };
    state.users.push(user); state.restaurants.push(restaurant);
    const demoItems = [
      ['Cappuccino','Coffee','Espresso with steamed milk foam.',149],
      ['Masala Maggi','Quick Bites','Classic masala noodles.',99],
      ['Paneer Sandwich','Snacks','Grilled sandwich with spiced paneer.',179],
      ['Cold Coffee','Beverages','Chilled creamy coffee.',159],
      ['Veg Burger','Main Course','Crispy patty with fresh vegetables.',199],
      ['French Fries','Sides','Golden crispy fries.',119]
    ];
    for (const [name, category, description, price] of demoItems) state.menuItems.push({ id:id(), restaurantId:restaurant.id, name, category, description, price, available:true, imageUrl:'', createdAt:now(), updatedAt:now() });
  }
  res.json(session(user, restaurant));
});

router.get('/me', auth, (req, res) => {
  const restaurant = restaurantForUser(req.user.id);
  res.json(session(req.user, restaurant));
});

export default router;
