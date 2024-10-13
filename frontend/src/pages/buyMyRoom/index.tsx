import {useEffect, useState} from 'react';
// import {Button, Image} from 'antd';
import {buyMyRoomContract,myERC721Contract,web3} from "../../utils/contracts";
const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'
const BuyMyRoomPage = () =>{
    const [account, setAccount] = useState('')
    const [a,seta] = useState('')
    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts()
    }, [])
    const onClick = async () => {
        const p = await buyMyRoomContract.methods.helloworld().call()
        seta(p)
    }
    return (
        <div className='container'>
            <div className='main'>
                <h1>房屋买卖网站</h1>
                <button onClick={onClick}>{account === '' ? '无用户连接':account}</button><br/>
                <h2>{a}</h2>
            </div>
        </div>
    )
}
export default BuyMyRoomPage