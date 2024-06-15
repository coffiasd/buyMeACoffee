import { base } from 'viem/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import '@coinbase/onchainkit/styles.css';
import { Name } from '@coinbase/onchainkit/identity';
import { Avatar } from '@coinbase/onchainkit/identity';
import { FaShareSquare, FaYenSign } from "react-icons/fa";
import { createClient } from "@libsql/client";
import { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from 'wagmi';
import { alertService } from '../services';

export default function MyDash() {
    const [name, setName] = useState('');
    const [pd, setPd] = useState(0);
    const [confirm, setConfirm] = useState(0);
    const [db, setDb] = useState('');
    const [created, setCreated] = useState(false);
    const { address } = useAccount();
    const [pending, setPending] = useState('');

    //client init.
    const turso = createClient({
        url: process.env.NEXT_PUBLIC_TURSO_DATABASE_URL,
        authToken: process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN,
    });

    //alert.
    const options = {
        autoClose: true,
        keepAfterRouteChange: false
    }


    const getUserInfo = async () => {
        const ft = await turso.execute("SELECT * FROM users where address='" + address + "'");
        console.log(ft.rows.length);
        if (ft.rows.length > 0) {
            setCreated(true);
            setName(ft.rows[0].name);
            setDb(ft.rows[0].db);
        }else{
            console.log("cleaning...");
            // setCreated(false);
            setName('');
            setDb('');
        }
    }

    const saveUserInfo = async () => {
        setPending("loading");
        setTimeout(() => { setPending() }, 10000);

        let sql;
        if (created) {
            sql = "UPDATE users SET name = '" + name + "', db = '" + db + "' WHERE address = '" + address + "'";
        } else {
            sql = "INSERT INTO users (`address`, `name`, `db`) VALUES ('" + address + "', '" + name + "', '" + db + "')";
        }
        const ft = await turso.execute(sql);
        alertService.info("saved", options);
        setPending();
    }

    const getStat = async () => {
        if (!address) {
            setPd();
            setConfirm();
            return;
        }
        const sql = `SELECT receiver,
            SUM(CASE WHEN state = 'charge:pending' THEN amount ELSE 0 END) AS sum_pending_amount,
            SUM(CASE WHEN state = 'charge:confirmed' THEN amount ELSE 0 END) AS sum_confirm_amount
        FROM orders
        WHERE receiver = '`+ address + `'
        GROUP BY receiver`;
        console.log(sql);
        const ft = await turso.execute(sql);
        console.log(ft);
        setPd(ft.rows[0].sum_pending_amount);
        setConfirm(ft.rows[0].sum_confirm_amount);
    }

    const viewPage = () => {
        const url = '/view/' + name;
        window.open(url, '_blank')
    }

    useEffect(() => {
        getUserInfo();
        getStat();
    }, [address])

    return (
        <>
            <OnchainKitProvider apiKey="jcnq7au1b3d30RJrCD1g_EhHxrhFn3q1" chain={base}>
                <h1 className='px-5 font-bold'>Overview</h1>
                <div className="flex justify-center bg-white px-5 mb-10 mt-1">
                    <div className="xl:max-w-7xl bg-white drop-shadow-xl border border-solid w-full rounded-lg flex justify-between items-stretch px-5 xl:px-5 py-5 flex-col">
                        {!address && <div className='h-10 m-auto'>Please log in to view</div> }
                        <div className='flex flex-row'>
                            {address && <div className="flex h-10 items-center space-x-4">
                                <Avatar address={address} showAttestation />
                                <div className="flex flex-col text-sm">
                                    <Name address={address} showAddress />
                                </div>
                            </div> }
                            
                            {address && <div className='ml-auto'>
                                <div className="tooltip" data-tip="reach $100 can click to claim">
                                    <button className="btn btn-xs rounded-lg mx-5 btn-disabled">
                                        <FaYenSign className='mx-1' size="0.7rem" />
                                        <span>
                                            Claim
                                        </span>
                                    </button>
                                </div>

                                <div className="tooltip" data-tip="fulfill portfolio to view">
                                    {created ?
                                        <button onClick={viewPage} className="btn btn-xs rounded-lg">
                                            <FaShareSquare className='mx-1' size=".7rem" />
                                            <span className='text-white-500 font-semibold'>view</span>
                                        </button>
                                        : <button className="btn btn-xs rounded-lg btn-disabled">
                                            <FaShareSquare className='mx-1' size=".7rem" />
                                            View
                                        </button>
                                    }
                                </div>
                            </div>}
                           


                        </div>

                        <div className="divider"></div>

                        <div className='flex flex-col'>
                            <div className='font-bold text-xl'>Earnings</div>
                            <div className='font-bold text-2xl my-2'>${confirm}</div>
                            <div className='flex flex-row'>
                                <div className="mt-2 w-3 h-3 rounded-md mr-1 bg-red-500"></div>
                                <div className='text-sm mt-1'>${confirm} confirmed</div>
                                <div className="ml-5 mt-2 w-3 h-3 rounded-md mr-1 bg-yellow-400"></div>
                                <div className='text-sm mt-1'>${pd} pending</div>

                            </div>
                        </div>
                    </div>

                </div>

                <h1 className='px-5 font-bold'>Portfolio</h1>
                <div className="flex justify-center bg-white px-5 mb-10 mt-1">
                    <div className="xl:max-w-7xl bg-white drop-shadow-xl border border-solid w-full rounded-lg flex justify-between items-stretch px-5 xl:px-5 py-5 flex-col">
                        <div className='flex flex-col'>
                            <div>
                                <input type="text" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-1/4" placeholder="name or @social" required value={name} onChange={e => { setName(e.target.value) }} />
                            </div>

                            <textarea className="focus:border-orange-500 textarea textarea-bordered mt-5 w-1/2" placeholder="describe yourself" value={db} onChange={e => { setDb(e.target.value) }} ></textarea>

                            <button className={`btn btn-wide mt-5 ${pending}`} onClick={saveUserInfo}>Save</button>

                        </div>
                    </div>

                </div>
            </OnchainKitProvider>
        </>
    );
}