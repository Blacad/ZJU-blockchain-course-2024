import {useEffect, useState} from 'react';
// import {Button, Image} from 'antd';
import {buyMyRoomContract,myERC721Contract,web3,myERC721Address,buyMyRoomAddress} from "../../utils/contracts";
import { render } from 'react-dom';
const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const BuyMyRoomPage = () =>{
    interface House{
        id : number;
        token: number;
    }
    const [HousesNL,setHousesNL] = useState<House[]>([]);
    let ID =0;
        
    const [account, setAccount] = useState('');
    const [a,seta] = useState('');
    const [accountBalance,setAccountBalance] = useState(0);
    
    const [totalhouse,setTotalhouse] = useState(0);
    const [money,setMoney] = useState(30);
    const [HousesOwner,setHousesOwner] = useState([]);
    const [ownerof0,setOwnerof0] = useState('');
    const [Render,setRender] = useState(0);
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
    
    useEffect(() => {
        const getAccountInfo = async () => {
            if (myERC721Contract) {
                const ab = await myERC721Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
                const p = await myERC721Contract.methods.getTotalid().call()
                setTotalhouse(p);
                console.log(p);
                for(let i = 0;i<p;i++){
                    if(account === await myERC721Contract.methods.ownerOf(i).call()){
                      HousesNL.push({id:ID,token:i});
                        ID++;
                    }
                    
                }
                console.log(HousesNL);
            } else {
                alert('Contract not exists.')
            }
        }
        if(account !== '') {
            getAccountInfo()
        }
    }, [account])
  
    const onClick = async () => {
        const p = await buyMyRoomContract.methods.helloworld().call()
        seta(p)
    }
    const getHouse = async () => {
        if(account === ''){
            alert('无用户请连接钱包')
            return
        }
        if(myERC721Contract){
            try{
                await myERC721Contract.methods.mint(account).send({
                    from:account
                })
                
                alert('获得成功')
            }catch (error: any){
                alert(error.message)
            }
        }else{
            alert('合约不存在')
        }
    }
   
    const Owerofhouse0 = async () => {
        const p = await myERC721Contract.methods.ownerOf(0).call()
        setOwnerof0(p)
    }
    const getHouse0 = async () => {
        const p = await buyMyRoomContract.methods.getHouse(myERC721Address,0).call()
        console.log(p);
    }
    const approve0toplayform = async () => {
        const p = await myERC721Contract.methods.approve(buyMyRoomAddress,0).send({
            from:account
        })
        alert("授予成功");
    }
    const list0 = async() =>{
        await buyMyRoomContract.methods.list(myERC721Address,0,23).send({
            from:account
        })
        alert("上架成功");
    }
    const purchase0 = async () => {
        await buyMyRoomContract.methods.purchase(myERC721Address,0).send({
            from:account,
            value: money
        })
        alert("购买成功");
    }
    function Rende(){
        setRender(1);
    }
    return (
        <div className='container'>
            <div className='main'>
                <h1>房屋买卖网站</h1>
                {/* <button onClick={getTotal}>输出</button> */}
                <h1>授予房产总量：{totalhouse}</h1>
                <button onClick={onClick}>当前账户：{account === '' ? '无用户连接':account}</button><br/>
                <button onClick={getHouse}> 得到房产 </button><br/>
                <h2>{a}</h2>
                <h2>房产总量：{accountBalance}</h2>
                
                <button onClick={approve0toplayform}>授予房产</button><br/>
                <button onClick={list0}>挂单房屋</button><br/>
                <button onClick={purchase0}>购买房屋</button><br/>
                <button onClick={Owerofhouse0}>显示token:{ownerof0}</button><br/>
                <button onClick={getHouse0}>输出token:0信息</button><br/>
                <button onClick={Rende}>刷新</button><br/>
            <div>
                未挂单房产
            {HousesNL.map(house => (
            <ul key={house.id}>
                <li>TokenID: {house.token}</li>
            </ul>
            ))}
            </div>
            </div>
        </div>
    )
}
export default BuyMyRoomPage