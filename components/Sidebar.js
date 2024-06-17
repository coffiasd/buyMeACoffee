import { FaCoffee, FaHome, FaCertificate } from "react-icons/fa";
import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from '@rainbow-me/rainbowkit';
import { useAccount, useSwitchChain } from 'wagmi';
import { useEffect, useState } from "react";
import { FaBars, FaTree, FaTwitter, FaBlog, FaQuora } from "react-icons/fa";
import { useRouter } from 'next/router';
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css';

export default function Sidebar() {
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();
    const { address, isConnected, chain } = useAccount();
    const [tab, setTab] = useState(false);
    const { switchNetwork } = useSwitchChain()

    const [login, setLogin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isConnected) {
            setLogin(true);
        }
        setTab(router.asPath);
    }, [isConnected])

    return (
        <aside className="absolute hidden flex-col w-64 h-full px-4 py-8 overflow-y-auto border-r rtl:border-r-0 rtl:border-l top-0 left-0 md:flex lg:flex bg-primary-content">

            <div className="m-auto text-cyan-50">
                <Link href='/' className={styles.leftToRight2}><FaCoffee size="1.6rem" className='m-1 cursor-pointer text-yellow-400' /></Link>
            </div>

            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>

                    <Link className='' href="/my">
                        <div className={`cursor-pointer flex flex-row ${tab == '/my' ? 'bg-green-100' : 'text-cyan-50'} flex items-center px-4 py-2 rounded-md`}>
                            <FaCertificate size="1rem" />
                            <span className="mx-4">MyPage</span>
                        </div>
                    </Link>

                    <Link className='' href="/list">
                        <div className={`cursor-pointer flex flex-row ${tab == '/list' ? 'bg-green-100' : 'text-cyan-50'} flex items-center px-4 py-2 rounded-md`}>
                            <FaBars size="1rem" />
                            <span className="mx-4">List</span>
                        </div>
                    </Link>

                </nav>


            </div>
        </aside>
    )
}