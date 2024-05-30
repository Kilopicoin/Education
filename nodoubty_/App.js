import './App.css';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import NoDoubt from './noDoubt.json';



const NoDoubtAddress = '0xd41B70C3a324e320caD866652FcbBa726F403dD3';

const ChainRPC = 'https://api.s0.b.hmny.io';


function App() {

  const [initialSupplyG, setinitialSupplyG] = useState(0);
  const [cekimlerG, setcekimlerG] = useState([]);
  const [dagilanG, setdagilanG] = useState('');
  const [kalanG, setkalanG] = useState('');



useEffect (() => {


  const handleContract = async ()  => {


    const web3 = new Web3(ChainRPC);
    const contract = new web3.eth.Contract(NoDoubt.abi, NoDoubtAddress);


    const initialSupply = await contract.methods.initialSupply().call();
    let initialSupplyS = parseInt(initialSupply) / 1000000;



    const initialSupplyT = initialSupplyS.toLocaleString();
    setinitialSupplyG(initialSupplyT);



    const cekimAdedi = await contract.methods.withdrawalCount().call();
    const cekimAdediS = parseInt(cekimAdedi);

    const cekimler = [];

    let dagilan = 0;


    for ( var i=1; i <= cekimAdediS; i++ ) {

      const cekim = await contract.methods.withdrawals(i).call();

      const cekimId = parseInt(cekim.id);
      const cekimAmount = parseInt(cekim.amount) / 1000000;

      dagilan = dagilan + cekimAmount;

      const cekimAmountT = cekimAmount.toLocaleString();
      const cekimDate = parseInt(cekim.dateW)*1000;
      let dateWx = new Intl.DateTimeFormat(['ban', 'id'], { year: 'numeric', month: '2-digit', day: '2-digit' }).format(cekimDate);


      const cekimSebebi = (cekim.reason).toString();


      cekimler.push({

        cekimIdG : cekimId,
        cekimAmountG : cekimAmountT,
        cekimDateG : dateWx,
        cekimSebebiG : cekimSebebi

      })


    }

    const dagilanT = dagilan.toLocaleString();


    const kalan = initialSupplyS - dagilan;
    const kalanT = kalan.toLocaleString();

    setdagilanG(dagilanT);

    setkalanG(kalanT);


    setcekimlerG(cekimler);




  }




  handleContract();

});





  return (
    <div className="App">
    
      <div className="baslik1">Pluton No Doubt</div>
      <div className="veriler">
        
        Initial Supply: {initialSupplyG}  &nbsp; Total Distributed: {dagilanG} &nbsp; Remaining Supply: {kalanG}
        
        
        </div>
      <div className="baslik2">Distribution History</div>
      <div className="tablo">





      <table className="table" id="table-1">



        <thead>


        <tr className="trx">
          <th className="th" id="numera" style={{width: "30%"}}>
            Date
          </th>
          <th className="th" style={{width: "35%"}}>Reason</th>
          <th className="th" style={{width: "30%"}}>Amount</th>
        </tr>


        </thead>



        <tbody>


          {cekimlerG.map((cekim) => {
            return (

                <tr className="cikti" key={cekim.cekimIdG}>

                  <td className="id">{cekim.cekimDateG}</td>
                  <td className="ortaİcerik">{cekim.cekimSebebiG}</td>
                  <td className="vauleTablo">{cekim.cekimAmountG}</td>
                  
                </tr>

            );
          })}



        </tbody>




      </table>


















      </div>





    </div>
  );
}

export default App;
