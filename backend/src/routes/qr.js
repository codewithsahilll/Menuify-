import { Router } from 'express';
import { auth, restaurantForUser, state } from './_helpers.js';
const router=Router();
router.get('/:slug',auth,async(req,res)=>{const r=restaurantForUser(req.user.id);if(!r||r.slug!==req.params.slug)return res.status(403).json({message:'Not your restaurant.'});const base=process.env.CLIENT_URL||'http://localhost:5173';const url=`${base.replace(/\/$/,'')}/menu/${r.slug}`;res.json({url,qr:null,restaurant:{id:r.id,name:r.name,slug:r.slug}});});
export default router;
