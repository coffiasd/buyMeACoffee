import Head from 'next/head'
import Footer from '../../components/Footer.js';
import dynamic from 'next/dynamic';
import React from "react";
import { Alert } from '../../components/alert.jsx';
import { FaCoffee } from "react-icons/fa";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import { createClient } from "@libsql/client";
import axios from 'axios';

const Header = dynamic(() => import('../../components/Header.js'), {
    ssr: false,
})

export default function View() {
    const router = useRouter()
    const { id } = router.query
    const [db, setDb] = useState('');
    const [addrs, setAddrs] = useState('');
    const [amt, setAmt] = useState(1);
    const [msg, setMsg] = useState('');
    const [pending, setPending] = useState('');

    //client init.
    const turso = createClient({
        url: process.env.NEXT_PUBLIC_TURSO_DATABASE_URL,
        authToken: process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN,
    });

    const getUserInfo = async () => {
        console.log("SELECT * FROM users where name='" + id + "'");
        const ft = await turso.execute("SELECT * FROM users where name='" + id + "'");
        console.log(ft.rows);
        if (ft.rows.length > 0) {
            setDb(ft.rows[0].db);
            setAddrs(ft.rows[0].address);
        }
    }

    const createCharge = async () => {
        if (!addrs){
            return;
        }
        setPending("loading");
        setTimeout(() => { setPending() }, 10000);

        let data = JSON.stringify({
            "local_price": {
                "amount": amt,
                "currency": "usd"
            },
            "pricing_type": "fixed_price",
            "metadata": {
                "custom_field": addrs,
                "custom_field_two": msg
            }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.commerce.coinbase.com/charges',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CC-Api-Key': process.env.NEXT_PUBLIC_CC
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                setPending();
                console.log("res:");
                console.log(JSON.stringify(response.data));
                window.open(response.data.data.hosted_url, '_blank')
            })
            .catch((error) => {
                setPending();
                console.log(error);
            });
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    return (
        <div className="min-h-screen" data-theme="wireframe">
            <Head>
                <title>buyMeACoffeeUsingCrypto</title>
                <meta name="description" content="buyMeACoffeeUsingCrypto" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />

            <Alert />

            <div className='flex justify-center m-auto'>
                <div className='min-h-screen w-4/12 mt-10'>

                    <div className="flex justify-center bg-white px-10 mb-10 mt-1">
                        <div className="xl:max-w-7xl bg-white drop-shadow-xl border border-solid w-full rounded-lg flex justify-between items-stretch px-10 xl:px-10 py-10 flex-col">
                            <div className='flex flex-col'>
                                <h1 className='my-1 font-bold'>Buy {id} a coffee</h1>
                                <p className='font-'>{db}</p>
                                <div className='my-1'>
                                    <div className="flex items-center justify-center mt-5 w-full p-4 border border-solid border-pageTheme25 bg-pageTheme05 rounded-xl">
                                        <div className='text-yellow-400'><FaCoffee size="2rem" /></div>
                                        <div className="flex items-center ml-4 text-2xl text-grey71 opacity-60 font-cr-medium xs:ml-3">x</div>
                                        <div className="flex items-center ml-6 xs:ml-4">
                                            <div className="flex">
                                                <div className="relative flex items-center justify-center w-12 h-12 mr-2.5 rounded-full border border-pageTheme25 hover:border-pageTheme bg-pageTheme text-themeTextColor xs:w-10 xs:h-10 xs:mr-2" onClick={e => { setAmt(1) }}>
                                                    <span className="text-lg font-cr-bold xs:text-sm xs:font-cr-medium">1</span>
                                                    <input type="radio" className="absolute w-full h-full opacity-0 cursor-pointer" value="1" />
                                                </div>
                                                <div className="relative flex items-center justify-center w-12 h-12 mr-2.5 rounded-full border border-pageTheme25 hover:border-pageTheme bg-white text-pageTheme xs:w-10 xs:h-10 xs:mr-2" onClick={e => { setAmt(3) }}>
                                                    <span className="text-lg font-cr-bold xs:text-sm xs:font-cr-medium">3</span>
                                                    <input type="radio" className="absolute w-full h-full opacity-0 cursor-pointer" value="3" />
                                                </div>
                                                <div className="relative flex items-center justify-center w-12 h-12 mr-2.5 rounded-full border border-pageTheme25 hover:border-pageTheme bg-white text-pageTheme xs:w-10 xs:h-10 xs:mr-2" onClick={e => { setAmt(5) }}>
                                                    <span className="text-lg font-cr-bold xs:text-sm xs:font-cr-medium">5</span>
                                                    <input type="radio" className="absolute w-full h-full opacity-0 cursor-pointer" value="5" />
                                                </div>
                                            </div>
                                            <input className="w-full p-3 ml-5 text-lg text-center bg-white border rounded-xl cursor-text font-cr-medium placeholder:font-cr-book placeholder:text-dark/30 hover:border-greyE5 focus:border-greyE5 xs:w-10 xs:h-10 xs:ml-2" type="number" min="1" max="9999" placeholder="1" value={amt} onChange={e => { setAmt(e.target.value) }} />
                                        </div>
                                    </div>


                                </div>


                                <div className='my-5'>
                                    <textarea className="textarea textarea-bordered w-full" placeholder="Say something to the creator" value={msg} onChange={e => { setMsg(e.target.value) }} ></textarea>
                                </div>


                                <div className='my-1 m-auto'>
                                    <button className={`btn btn-wide ${pending}`} onClick={createCharge}>Support ${amt}</button>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </div >
    )
}
