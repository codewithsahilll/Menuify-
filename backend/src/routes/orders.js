import { Router } from 'express';
import { auth, id, now, orderForRestaurant, restaurantForUser, state } from './_helpers.js';
const router=Router();
const allowed=['PLACED','ACCEPTED','PREPARING','READY','REJECTED'];
function cleanOrder(o){return {...o,items:o.items.map(i=>({...i}))};}
router.get('/mine',auth,(req,res)=>{const r=restaurantForUser(req.user.id);res.json(state.orders.filter(o=>o.restaurantId===r?.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(cleanOrder));});
router.post('/public',(req,res)=>{
 const {slug,customerName,customerPhone,items}=req.body||{}; const r=state.restaurants.find(x=>x.slug===slug);
 if(!r)return res.status(404).json({message:'Restaurant not found.'}); if(!customerName||!Array.isArray(items)||!items.length)return res.status(400).json({message:'Name and at least one item are required.'});
 const snapshot=[]; for(const line of items){const item=state.menuItems.find(i=>i.id===line.menuItemId&&i.restaurantId===r.id);const qty=Math.max(1,Math.floor(Number(line.quantity)||1));if(!item)return res.status(400).json({message:'One of the selected items is no longer available.'});if(!item.available)return res.status(400).json({message:`${item.name} is sold out.`});snapshot.push({menuItemId:item.id,name:item.name,price:item.price,quantity:qty});}
 const total=snapshot.reduce((s,i)=>s+i.price*i.quantity,0);const order={id:id(),restaurantId:r.id,customerName:String(customerName).trim(),customerPhone:String(customerPhone||'').trim(),items:snapshot,total,status:'PLACED',createdAt:now(),updatedAt:now()};state.orders.push(order);res.status(201).json(cleanOrder(order));
});
router.get('/:id',(req,res)=>{const o=state.orders.find(x=>x.id===req.params.id);if(!o)return res.status(404).json({message:'Order not found.'});res.json(cleanOrder(o));});
router.patch('/:id/status',auth,(req,res)=>{const {order}=orderForRestaurant(req.user.id,req.params.id);if(!order)return res.status(404).json({message:'Order not found.'});const next=req.body?.status;if(!allowed.includes(next))return res.status(400).json({message:'Invalid order status.'});const transitions={PLACED:['ACCEPTED','REJECTED'],ACCEPTED:['PREPARING'],PREPARING:['READY'],READY:[],REJECTED:[]};if(!transitions[order.status]?.includes(next))return res.status(400).json({message:`Cannot change ${order.status} to ${next}.`});order.status=next;order.updatedAt=now();res.json(cleanOrder(order));});
export default router;
