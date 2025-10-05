// creating hook for adding token automatically:: 

import axios from 'axios'
const url = import.meta.env.VITE_API_URL;
const API = axios.create({ baseURL: url })

API.interceptors.request.use(
  (config)=>{
    const token = localStorage.getItem('loginToken');
    if(token){
        config.headers.Authorization =  `Bearer ${token}`;  
    }
    return config;
  },
  (error)=>Promise.reject(error)
)

export default API;

