import { Router } from 'express';
import { id, now, state } from './_helpers.js';
const router=Router();
router.get('/public/:slug',(req,res)=>{const r=state.restaurants.find(x=>x.slug===req.params.slug);if(!r)return res.status(404).json({message:'Restaurant not found.'});res.json(state.reviews.filter(x=>x.restaurantId===r.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));});
router.post('/public',(req,res)=>{const {slug,customerName,rating,comment}=req.body||{};const r=state.restaurants.find(x=>x.slug===slug);const n=Number(rating);if(!r)return res.status(404).json({message:'Restaurant not found.'});if(!customerName||!Number.isInteger(n)||n<1||n>5)return res.status(400).json({message:'Name and a rating from 1 to 5 are required.'});const review={id:id(),restaurantId:r.id,customerName:String(customerName).trim(),rating:n,comment:String(comment||'').trim(),createdAt:now()};state.reviews.push(review);res.status(201).json(review);});
export default router;
