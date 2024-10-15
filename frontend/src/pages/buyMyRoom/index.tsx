import {useEffect, useState} from 'react';

import {buyMyRoomContract,myERC721Contract,web3,myERC721Address,buyMyRoomAddress} from "../../utils/contracts";
import './index.css'
const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const BuyMyRoomPage = () =>{
    interface House{
        id : number;
        token: number;
    }
    interface House1{
        id : number;
        token: number;
        price: number;
        owner: string;
        listtime: number;
    }
    const [HousesNL,setHousesNL] = useState<House[]>([]);
    let ID =0;
    let ID1 = 10000;
    const [account, setAccount] = useState('');
    const [a,seta] = useState('');
    const [accountBalance,setAccountBalance] = useState(0);
    const [totalhouse,setTotalhouse] = useState(0);
    //const [money,setMoney] = useState(30);
    const [Houses,setHouses] = useState<House1[]>([]);
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
                for(let i = 0;i<p;i++){
                    if(account === await myERC721Contract.methods.ownerOf(i).call()){
                      HousesNL.push({id:ID,token:i});
                        ID++;
                    }
                    if(buyMyRoomAddress === await myERC721Contract.methods.ownerOf(i).call()){    
                            const p1 = await buyMyRoomContract.methods.getHouse(myERC721Address,i).call()
                            console.log(p1);
                            Houses.push({id:ID1,token:i,price:p1[1],owner:p1[0],listtime:p1[2]});
                            ID1++;
                    }
                    
                }
               
                console.log(myERC721Address);
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
    async function approvetoplayform (number:number) {
        const p = await myERC721Contract.methods.approve(buyMyRoomAddress,number).send({
            from:account
        })
        alert("授予成功");
    }
    async function list(number:number,price:number){
        await buyMyRoomContract.methods.list(myERC721Address,number,price).send({
            from:account
        })
        alert("上架成功");
    }
    async function purchase(number:number,money:number) {
        await buyMyRoomContract.methods.purchase(myERC721Address,number).send({
            from:account,
            value: money
        })
        alert("购买成功");
    }
    async function revoke(number:number){
        await buyMyRoomContract.methods.revoke(myERC721Address,number).send({
            from:account
        })
        alert("撤单成功");
    }
 // 定义状态数组，存储每个输入框的值
 const [inputValues1, setInputValues1] = useState<number>(20);    
 const [inputValues2, setInputValues2] = useState<number>(30);
    return (
        
        <div>
            <div className="head" style={{alignItems:"center",textAlign:"center"}}>
                <h1>房屋买卖网站</h1>
                <button onClick={getHouse}> 得到房产 </button>
                <p >授予房产总量：{totalhouse}</p>
                <p>您未挂单的房产总量：{accountBalance}</p>
                <p >{a}</p>
                <button onClick={onClick}>账户：{account === '' ? '无用户连接':account}</button><br/>
                
            </div>
            <a className='line'></a>
         <div style={{marginLeft:"5%",marginTop:"5%"}}>
        <table align='left' border={parseInt("1")}>
      <caption>
        未挂单房产
      </caption>
      <tr>
        <th>NFT</th>
        <th>Approve</th>
        <th>Action</th>
    </tr>
            {HousesNL.map(house => (
            <tr key={house.id}>
                <td align='center'>{house.token}</td>
                <td align='center'><button onClick={() => approvetoplayform(house.token)}>授权</button></td>
                <td align='center'><input type="text" onChange={(e) => setInputValues1(parseInt(e.target.value))}/><button onClick={() => list(house.token,inputValues1)}>挂单</button></td>
            </tr>
            ))}
            </table>
        </div>
            <div style={{marginRight:"5%",marginTop:"5%"}}>
                
               <table align="right" border={parseInt("1")}> 
                
                    <caption>房屋市场</caption>
                    <tr>
                        <th>NFT</th>
                        <th>Price</th>
                        <th>Owner</th>
                        <th>ListTime</th>
                        <th>Action</th>
                    </tr>
            {Houses.map(house => (
            <tbody key={house.id}>
                {account===house.owner?(
                <tr>
                    <td align='center'>{house.token}</td>
                    <td align='center'>{house.price}</td>
                    <td align='center'>{house.owner}</td>
                    <td align='center'>{(new Date(house.listtime*1000).toLocaleDateString())}</td>
                    <td align='center'><button onClick={()=>revoke(house.token)}>撤单</button></td>
                </tr>
                    )
                    :(<tr>
                    <td align='center'>{house.token}</td>
                    <td align='center'>{house.price}</td>
                    <td align='center'>{house.owner}</td>
                    <td align='center'>{(new Date(house.listtime*1000).toLocaleDateString())}</td>
                    <td align='center'><input type="text" onChange={(e) => setInputValues2(parseInt(e.target.value))}/></td>
                    <button onClick={()=>purchase(house.token,inputValues2)}>购买</button></tr>
                )}
            </tbody>
            ))}
            </table>
            </div>
        </div>
    )
}
export default BuyMyRoomPage