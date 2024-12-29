import React, { useEffect } from 'react'
import { sendLiteHealth,sendDetailHealth } from '../../utils/sendHealth'

const Home = () => {

    setTimeout(()=>{
        sendLiteHealth()
    },3000)

    // useEffect(()=>{
    //     return ()=>{
    //         sendDetailHealth()
    //     }
    // },[])

  return (
    <div>
        <h1>THis is home</h1>
    </div>
  )
}

export default Home