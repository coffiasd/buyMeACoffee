import Head from 'next/head'
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import React from "react";
import { Alert } from '../components/alert.jsx';
import axios from 'axios';

const Header = dynamic(() => import('../components/Header'), {
  ssr: false,
})

export default function Home() {
  let data = JSON.stringify({
    "local_price": {
      "amount": "0.01",
      "currency": "USD"
    },
    "metadata": {
      "custom_field": "0xB315fBA4A6514100BdceA5C438E89dd9dd9F216F"
    },
    "pricing_type": "fixed_price",
    "requested_info": "address",
    "name": "The Human Fund",
    "description": "Money For People",
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.commerce.coinbase.com/charges',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CC-Api-Key': 'ebdb01b0-5159-40e7-b8f7-4b1ae3554b40'
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      console.log("res:");
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });


  return (
    <div className="min-h-screen" data-theme="wireframe">
      <Head>
        <title>buyMeACoffeeUsingCrypto</title>
        <meta name="description" content="buyMeACoffeeUsingCrypto" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <Alert />

      <div className="hero min-h-screen">
        <div className="hero-content text-center flex flex-col">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Fund your creative work</h1>
            <p className="py-6 text-xl font-normal leading-normal mt-0 mb-2">Accept support. Start a membership. Setup a shop. It is easier than you think.</p>
          </div>

          <div className="flex flex-col mt-5">
        <button onClick={e=>{window.open('/my','_self')}}
            className={"py-3 lg:py-4 px-12 lg:px-16 text-white-500 font-semibold rounded-lg bg-yellow-400 hover:shadow-yellow-md transition-all outline-none "}>
            Start My Page
        </button>
          </div>
        </div>

      </div>

      <Footer />
    </div >
  )
}
