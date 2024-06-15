import Head from 'next/head'
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import React from "react";
import { Alert } from '../components/alert.jsx';
import Sidebar from '../components/Sidebar';
import MyDash from '../components/My.js';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = dynamic(() => import('../components/Header'), {
    ssr: false,
})

export default function MyPage() {
    return (
        <div className="min-h-screen" data-theme="wireframe">
            <Head>
                <title>MyPage</title>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className='relative'>
                <div className=''>
                    <div className="navbar bg-base-100">
                        <div className="navbar-end ml-auto">
                            <ConnectButton />
                        </div>
                    </div>
                </div>

                <Sidebar />
                <div className='flex justify-center m-auto'>
                    <div className='min-h-screen w-6/12'>
                        <MyDash />
                    </div>
                </div>
            </div>

            <Alert />
            <Footer />
        </div >
    )
}
