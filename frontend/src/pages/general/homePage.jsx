
import React, { useState } from "react";
import landingImg from '../../assets/landing_page.png'
import API from "../../hooks/api";

const Home_page = ()=>{
        API.get('/allservice')
        .then((res)=>{
         console.log(res.data);
         
        })
    return(
    <>
    <button>hi</button>
    </>
    )
}

export default Home_page;

