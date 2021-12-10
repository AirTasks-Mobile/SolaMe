const anchor = require('@project-serum/anchor');
const assert = require('assert');
const { SystemProgram } = anchor.web3;

describe('SolaMe', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolaMe;

  it('Is initialized!', async () => {
    // Add your test here.
    const baseAccount = anchor.web3.Keypair.generate();
    const tx = await program.rpc.initialize('Hello world !', {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    console.log("Your transaction signature", tx);

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Data : ', account.data);
    assert.ok(account.data == 'Hello world !');
    _baseAccount = baseAccount;
  });

  // it('Create  a counter', async() => {
  //   const baseAccount = anchor.web3.Keypair.generate();
  //   await program.rpc.create({
  //     accounts:{
  //       baseAccount: baseAccount.publicKey,
  //       user: provider.wallet.publicKey,
  //       systemProgram: SystemProgram.programId,
  //     },
  //     signers: [baseAccount],
  //   });
  //
  //   const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  //   console.log('Count 0:', account.count.toString());
  //   assert.ok(account.count.toString() == '0');
  //   _baseAccount = baseAccount;
  // });
  //
  // it('Increase count ', async() => {
  //   const baseAccount = _baseAccount;
  //   await program.rpc.increment({
  //     accounts: {
  //       baseAccount: baseAccount.publicKey,
  //     }
  //   });
  //
  //   const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  //   console.log('Count 1 : ', account.count.toString());
  //   assert.ok(account.count.toString() == '1');
  //
  // });

  it('Update account', async () => {
    const baseAccount = _baseAccount;
    await program.rpc.update('Some new data', {
      accounts: {
        baseAccount: baseAccount.publicKey,
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('new data : ', account.data);
    console.log('all data 2 : ', account.dataList);
    console.log(' ');
    console.log('acount : ', account);
    assert.ok(account.dataList.length == 2);
  });

});
