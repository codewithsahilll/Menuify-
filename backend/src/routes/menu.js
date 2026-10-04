import { Router } from 'express';
import { auth, id, menuItemForUser, now, publicRestaurant, restaurantForUser, state } from './_helpers.js';
const router = Router();

router.get('/mine', auth, (req,res)=>{
  const restaurant = restaurantForUser(req.user.id);
  res.json({ restaurant: publicRestaurant(restaurant), items: state.menuItems.filter(i=>i.restaurantId===restaurant?.id).sort((a,b)=>a.name.localeCompare(b.name)) });
});
router.post('/', auth, (req,res)=>{
  const restaurant = restaurantForUser(req.user.id);
  if (!restaurant) return res.status(404).json({message:'Restaurant not found.'});
  const {name,category,description,price,available=true,imageUrl=''}=req.body||{};
  const numeric=Number(price);
  if(!name || !Number.isFinite(numeric) || numeric<0) return res.status(400).json({message:'Item name and valid price are required.'});
  const item={id:id(),restaurantId:restaurant.id,name:String(name).trim(),category:String(category||'Main Course').trim(),description:String(description||'').trim(),price:numeric,available:Boolean(available),imageUrl:String(imageUrl||''),createdAt:now(),updatedAt:now()};
  state.menuItems.push(item); res.status(201).json(item);
});
router.put('/:id', auth, (req,res)=>{
  const {item}=menuItemForUser(req.user.id,req.params.id);
  if(!item) return res.status(404).json({message:'Menu item not found.'});
  const {name,category,description,price,available,imageUrl}=req.body||{};
  if(name!==undefined)item.name=String(name).trim(); if(category!==undefined)item.category=String(category).trim(); if(description!==undefined)item.description=String(description).trim(); if(price!==undefined && Number.isFinite(Number(price)))item.price=Number(price); if(available!==undefined)item.available=Boolean(available); if(imageUrl!==undefined)item.imageUrl=String(imageUrl||''); item.updatedAt=now(); res.json(item);
});
router.delete('/:id',auth,(req,res)=>{const {item}=menuItemForUser(req.user.id,req.params.id);if(!item)return res.status(404).json({message:'Menu item not found.'});state.menuItems=state.menuItems.filter(i=>i.id!==item.id);res.json({ok:true});});
router.get('/public/:slug',(req,res)=>{const restaurant=state.restaurants.find(r=>r.slug===req.params.slug);if(!restaurant)return res.status(404).json({message:'Restaurant not found.'});const items=state.menuItems.filter(i=>i.restaurantId===restaurant.id);res.json({restaurant:publicRestaurant(restaurant),items});});
export default router;
