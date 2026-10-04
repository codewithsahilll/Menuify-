const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export async function api(path,options={}){const token=localStorage.getItem('menuify_token');const headers={'Content-Type':'application/json',...(options.headers||{})};if(token)headers.Authorization=`Bearer ${token}`;const r=await fetch(`${API}${path}`,{...options,headers});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.message||'Request failed');return data;}
export const money=n=>`₹${Number(n||0).toFixed(0)}`;
export function restaurantFromStorage(){try{return JSON.parse(localStorage.getItem('menuify_restaurant')||'null')}catch{return null}}
export function setSession(data){localStorage.setItem('menuify_token',data.token);localStorage.setItem('menuify_user',JSON.stringify(data.user));localStorage.setItem('menuify_restaurant',JSON.stringify(data.restaurant));}
export function logout(){localStorage.removeItem('menuify_token');localStorage.removeItem('menuify_user');localStorage.removeItem('menuify_restaurant');}
