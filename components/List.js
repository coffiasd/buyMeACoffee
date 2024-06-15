import { base } from 'viem/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import '@coinbase/onchainkit/styles.css';
import { Name } from '@coinbase/onchainkit/identity';
import { Avatar } from '@coinbase/onchainkit/identity';
import { createClient } from "@libsql/client";
import { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from 'wagmi';

export default function MyList() {
    const { address, isConnected, chain } = useAccount();
    const [rows,setRows] = useState([]);
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

    const getList = async()=>{
        const ft = await turso.execute("SELECT * FROM orders where receiver ='"+address+"'");
        console.log(ft.rows);
        setRows(ft.rows);
    }

    useEffect(() => {
        getList();
    },[])


    return(
        <>
            <OnchainKitProvider apiKey="jcnq7au1b3d30RJrCD1g_EhHxrhFn3q1" chain={base}>
            <h1 className='my-5 font-bold'>My Supports List</h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Pid
                            </th>
                            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                Support
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Time
                            </th>
                            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                Message
                            </th>
                            <th scope="col" className="px-6 py-3">
                                State
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                       {rows.map((item, index) => (
                        <tr className="border-b border-gray-200 dark:border-gray-700" key={index}>
                            <td className="px-6 py-4">
                               {item.pid}
                            </td>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                
                                    <div className="flex h-10 items-center space-x-4">
                                        <Avatar address={item.support} showAttestation />
                                        <div className="flex flex-col text-sm">
                                            <b>
                                                <Name address={item.support}  />
                                            </b>
                                            <Name address={item.support}  showAddress />
                                        </div>
                                    </div>

                            </th>
                            <td className="px-6 py-4">
                               {item.TIME}
                            </td>
                            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                                {item.message}
                            </td>
                            <td className="px-6 py-4">
                                <button className="btn btn-xs btn-success">{item.state}</button>
                            </td>

                            <td className="px-6 py-4">
                                ${item.amount}
                            </td>
                        </tr>
                        ))}
                        
                    </tbody>
                </table>

            </div>

                <div className="mt-5 join float-right">
                    <button className="join-item btn">«</button>
                    <button className="join-item btn">Page 1</button>
                    <button className="join-item btn">»</button>
                </div>


            </OnchainKitProvider>
        </>
    );
}