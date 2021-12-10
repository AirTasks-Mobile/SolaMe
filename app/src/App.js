import './App.css';
import { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';

import idl from './idl.json';
import kp from './keypair.json'

import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  getPhantomWallet()
]

// const arr = Object.values(kp._keypair.secretKey)
// const secret = new Uint8Array(arr)
// const pair = web3.Keypair.fromSecretKey(secret)

const network = clusterApiUrl('devnet');
//const network = 'http://127.0.0.1:8899';

const { SystemProgram, Keypair } = web3;
/* create an account  */
const pair = Keypair.generate();

const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue] = useState('');
  const [dataList, setDataList] = useState([]);
  const [input, setInput] = useState('');
  // const [connected, setConnected] = useState(false)
  // useEffect(() => {
  //   console.log('solana:', window.solana)
  //   if (window.solana) {
  //     window.solana.on("connect", () => {
  //       console.log('updated...')
  //     })
  //   }
  //   return () => {
  //     window.solana.disconnect();
  //   }
  // }, [])

  const wallet = useWallet();

  console.log('Start');

  // async function getProvider() {
  //   const wallet = window.solana
  //   const network = "http://127.0.0.1:8899"
  //   const connection = new Connection(network, opts.preflightCommitment);
  //
  //   const provider = new Provider(
  //     connection, wallet, opts.preflightCommitment,
  //   )
  //   return provider
  // }

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  async function initialize(){
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.initialize('Start !', {
        accounts:{
          baseAccount: pair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers:[pair],
      });

      const account = await program.account.baseAccount.fetch(pair.publicKey);
      console.log('aacount : ', account);
      console.log(' ');
      setValue(account.count.toString() + ' : ' + account.data.toString());
      setDataList(account.dataList);
    }
    catch(err){
      console.log('init err : ', err);
    }
  }

  async function update(){
    if(!input) {
      return;
    }

    const provider = await getProvider();
    const program = new Program(idl, programID, provider);

    await program.rpc.update(input, {
      accounts: {
        baseAccount: pair.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(pair.publicKey);
    setValue(account.count.toString() + ' : ' + account.data.toString());
    setDataList(account.dataList);
    setInput('');
  }

  async function createCounter() {
    const provider = await getProvider()
    console.log('Create !!!!!');
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);
    try {
      /* interact with the program via rpc */

      await program.rpc.create({
        accounts: {
          baseAccount: pair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [pair]
      });

      const account = await program.account.baseAccount.fetch(pair.publicKey);
      console.log('account: ', account);
      setValue(account.count.toString());
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function increment() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.increment({
      accounts: {
        baseAccount: pair.publicKey
      }
    });

    const account = await program.account.baseAccount.fetch(pair.publicKey);
    console.log('account: ', account);
    setValue(account.count.toString());
  }

 //  async function getWallet() {
 //   await window.solana.connect();
 //   try {
 //     const wallet = typeof window !== 'undefined' && window.solana;
 //     await wallet.connect()
 //     setConnected(true)
 //   } catch (err) {
 //     console.log('err: ', err)
 //   }
 // }

 if (!wallet.connected) {
  /* If the user's wallet is not connected, display connect wallet button. */
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
      <WalletMultiButton />
    </div>
  )
  } else {
    return (
      <div className="App">
        <div>
          {
            !value && (<button onClick={initialize}> Let's Start !</button>)
          }
          {
            value ? (
              <div>
                <h2>Current value: {value}</h2>
                <input
                  placeholder="Add new data"
                  onChange={e => setInput(e.target.value)}
                  value={input}
                />
                <button onClick={update}>Add data</button>
              </div>
            ) : (
              <h3>Please Inialize.</h3>
            )
          }

          {
            dataList.map((d, i) => <h4 key={i}>{d}</h4>)
          }
        </div>
      </div>
    );
  }

}

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */

const AppWithProvider = () => (
  <ConnectionProvider endpoint={network}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;
