import {
    useConnectModal,
    useAccountModal,
    useChainModal,
} from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'
import { FaTwitter, FaGithub, FaYoutube, FaCoffee } from "react-icons/fa";
import styles from '../styles/Home.module.css';

export default function Header() {
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();

    const { address, isConnected } = useAccount();

    return (
        <div className="navbar text-neutral-content bg-primary-content">
            <div className="flex-1 ml-3 text-gray-50">
                <ul className='flex flex-row justify-between gap-6'>
                    <li><a className='text-yellow-400' href="#"><FaCoffee size="1.7rem" /></a></li>
                    <li><a className={styles.leftToRight} href="https://twitter.com/coffiasse"><FaTwitter size="1rem" className='m-0.5' />TWITTER</a></li>
                    <li><a className={styles.leftToRight} href="https://github.com/coffiasd"><FaGithub size="1rem" className='m-0.5' />GITHUB</a></li>
                    <li><a className={styles.leftToRight} href="#"><FaYoutube size="1rem" className='m-0.5' />YOUTUBE</a></li>
                </ul>
            </div>
        </div >
    )
}