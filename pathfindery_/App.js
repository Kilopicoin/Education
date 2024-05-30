
import './App.css';
import Web3 from 'web3';
import pathfinder from './pathfinder.json';
import Token from './token.json';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';


const ChainRPC = 'https://api.s0.b.hmny.io';

const pathfinderAddress = '0x9A82B4E438f9c012Ee2AbdE9020531bFD1f00F6f';

const TokenAddress = '0xbeFB5A87aB21ab33f548362c4CcbE5468961C2bc';

function App() {

  const [tumSatirBilgileriG, settumSatirBilgileriG] = useState([]);
  const [tumSatirBilgileri2G, settumSatirBilgileri2G] = useState([]);

  const [projectNameG, setprojectNameG] = useState('');

  const [projectVoteG, setprojectVoteG] = useState(0);

  const [projectIDG, setprojectIDG] = useState(0);

  const [projectVoteIDG, setprojectVoteIDG] = useState(0);
  const [publishedG, setpublishedG] = useState(0);

  const [toplamYananMiktarG, settoplamYananMiktarG] = useState(0);

  const [Ilave, setIlave] = useState(0);

  const [loadingG, setloadingG] = useState(0);


  useEffect (() => {


    const handleContract = async ()  => {


      setloadingG(1);
  
  
      const web3 = new Web3(ChainRPC);
      const contract = new web3.eth.Contract(pathfinder.abi, pathfinderAddress);
  
  
      const anketSatirSayisi = await contract.methods.ProjectCount().call();
      const anketSatirSayisiS = parseInt(anketSatirSayisi);


      const tumSatirBilgileri = [];

      for ( var i=1; i <= anketSatirSayisiS; i++ ) {


        const tekSatirdakiBilgiler = await contract.methods.Projects(i).call();

        const tekSatirdakiID = parseInt(tekSatirdakiBilgiler.id);
        const tekSatirdakiName = (tekSatirdakiBilgiler.name).toString();
        const tekSatirdakiVote = parseInt(tekSatirdakiBilgiler.vote) / 1000000;


        tumSatirBilgileri.push ({

          ID: tekSatirdakiID,
          Name: tekSatirdakiName,
          Vote: tekSatirdakiVote

        })



      }


      tumSatirBilgileri.sort((a, b) => {
        if (a.Vote < b.Vote) {
          return 1;
        }
        if (a.Vote > b.Vote) {
          return -1;
        }
        return 0;
      });


      settumSatirBilgileriG(tumSatirBilgileri);


      setloadingG(0);


  
  
    }
  
  
  
  
    handleContract();
  
  }, [Ilave]);





  const addProject = async ()  => {


    setloadingG(1);



    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const address = signer.getAddress();

    const contract = new ethers.Contract(pathfinderAddress, pathfinder.abi, signer);


    const contractToken = new ethers.Contract(TokenAddress, Token.abi, signer);



    const projectName = projectNameG;
    const projectVote = projectVoteG * 1000000;


    const izin = await contractToken.increaseAllowance(pathfinderAddress, projectVote, {
      from: address,
      gasPrice: 101000000000,
    });


    await izin.wait();


    const ilave = await contract.addProject(projectName, projectVote, {
      from: address,
      gasPrice: 101000000000,
    });


    await ilave.wait();

    setIlave(Ilave + 1);


    setloadingG(0);

  



  }




  const inputNameChanged = async (evt)  => {

    setprojectNameG(evt.target.value);

  };





const inputVoteChanged = async (evt)  => {

    setprojectVoteG(evt.target.value);

  };



  const inputIDChanged = async (evt)  => {

    setprojectIDG(evt.target.value);

  };





const inputVoteIDChanged = async (evt)  => {

    setprojectVoteIDG(evt.target.value);

  };



  const addtoProject = async ()  => {




    setloadingG(1);



    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const address = signer.getAddress();

    const contract = new ethers.Contract(pathfinderAddress, pathfinder.abi, signer);


    const contractToken = new ethers.Contract(TokenAddress, Token.abi, signer);



    const projectID = projectIDG;
    const projectVoteID = projectVoteIDG * 1000000;


    const izin = await contractToken.increaseAllowance(pathfinderAddress, projectVoteID, {
      from: address,
      gasPrice: 101000000000,
    });


    await izin.wait();


    const ilave = await contract.addtoProject(projectID, projectVoteID, {
      from: address,
      gasPrice: 101000000000,
    });


    await ilave.wait();

    setIlave(Ilave + 1);


    setloadingG(0);







  }






  const listPublished = async ()  => {


    setloadingG(1);


    const web3 = new Web3(ChainRPC);
    const contract = new web3.eth.Contract(pathfinder.abi, pathfinderAddress);


    const anketSatirSayisi = await contract.methods.ProjectDoneCount().call();
    const anketSatirSayisiS = parseInt(anketSatirSayisi);


    const tumSatirBilgileri = [];

    let toplamYananMiktar = 0;

    for ( var i=1; i <= anketSatirSayisiS; i++ ) {


      const tekSatirdakiBilgiler = await contract.methods.ProjectsDone(i).call();

      const tekSatirdakiID = parseInt(tekSatirdakiBilgiler.id);
      const tekSatirdakiName = (tekSatirdakiBilgiler.name).toString();
      const tekSatirdakiBurnt = parseInt(tekSatirdakiBilgiler.burnt) / 1000000;
      const tekSatirdakiLink = (tekSatirdakiBilgiler.link).toString();


      tumSatirBilgileri.push ({

        ID: tekSatirdakiID,
        Name: tekSatirdakiName,
        Burnt: tekSatirdakiBurnt,
        Link: tekSatirdakiLink

      })

      toplamYananMiktar = toplamYananMiktar + tekSatirdakiBurnt;

    }


    tumSatirBilgileri.sort((a, b) => {
      if (a.Burnt < b.Burnt) {
        return 1;
      }
      if (a.Burnt > b.Burnt) {
        return -1;
      }
      return 0;
    });

    settoplamYananMiktarG(toplamYananMiktar);
    settumSatirBilgileri2G(tumSatirBilgileri);


    setloadingG(0);




  }








  return (
    <div className="App">



{loadingG === 1 && (

<div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

)}



      
      <div className="Baslik"> BASLIK </div>



      <div className="Icerik"> 
      
      
      <div className="KolonSOL"> 
      
      <p> Voting List </p>
      <p>  
        
        
        <input className="inputC" placeholder='Name'
        
        onChange={inputNameChanged}
        
        
        
        ></input>
        <input className="inputC" placeholder='0'
        
        onChange={inputVoteChanged}
        
        ></input>
        <button className="buttonC" 
        onClick={(event) => {
          event.preventDefault();
          addProject();
        }}
        >Create</button>
        
        
        
        
        
        
        
         </p>
      <p>  
        
        
      <input className="inputC" placeholder='ID'
        
        onChange={inputIDChanged}
        
        
        
        ></input>

        <input className="inputC" placeholder='0'
        
        onChange={inputVoteIDChanged}
        
        ></input>


        <button className="buttonC" 
        onClick={(event) => {
          event.preventDefault();
          addtoProject();
        }}
        >Add</button>
        
        
        
        
        
        
        
         </p>
      <div className="tablex"> 
        
        
        


      <table className="table" id="table-1">



<thead>


<tr className="trx">
  <th className="th" id="numera" >
    No
  </th>
  <th className="th">Project Request</th>
  <th className="th" >Vote</th>
</tr>


</thead>



<tbody>


  {tumSatirBilgileriG.map((satir) => {
    return (

        <tr className="cikti" key={satir.ID}>

          <td className="id">{satir.ID}</td>
          <td className="ortaİcerik">{satir.Name}</td>
          <td className="vauleTablo">{satir.Vote}</td>
          
        </tr>

    );
  })}



</tbody>




</table>




        
        
        
        
        
        
        
        
         </div>
      
      
      
       </div>

      <div className="KolonSAG"> 
      
      
      
      <p>Published Videos</p>
      

      <div className="tablex">


        {publishedG === 0 ? (

          <div className="buttonz">

<p>Total Burnt LOP Tokens = List Published Videos to see</p>
          
          
          <button className="buttonS" 
        onClick={(event) => {
          event.preventDefault();
          listPublished();
          setpublishedG(1);
          
        }}
        >List Published Videos</button>


          
          </div>



        ) : (

          <>
          
    

          <p>Total Burnt LOP Tokens = {toplamYananMiktarG}</p>

          <table className="table" id="table-1">



<thead>


<tr className="trx">
  <th className="th">Project</th>
  <th className="th" >Burnt</th>
</tr>


</thead>



<tbody>


  {tumSatirBilgileri2G.map((satir) => {
    return (

        <tr className="cikti" key={satir.ID}>


          <td className="ortaİcerik">
            
            
            <a href={satir.Link} target='_blank' rel="noreferrer">{satir.Name}</a>
            
            
          
          
          
          
          </td>





          <td className="vauleTablo">{satir.Burnt}</td>
          
        </tr>

    );
  })}



</tbody>




</table>





          
          
          </>



        )}





      








      </div>
      
      
      
      
      
      
      
        </div>
      
      
      
      
       </div>






    </div>
  );
}

export default App;
