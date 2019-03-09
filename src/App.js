import React, { Component } from 'react';

import { createContext, CryptoFactory } from 'sawtooth-sdk/signing';

const { protobuf } = require('sawtooth-sdk');
// import cbor from 'cbor';
// import { createHash } from 'crypto';

class App extends Component {

  constructor(props) {
    super(props);

    const context = createContext('secp256k1');
    const privateKey = context.newRandomPrivateKey();
    const signer = new CryptoFactory(context).newSigner(privateKey);

    this.state = {
      context, privateKey, signer
    };
  }

  componentWillMount() {

    // const { signer } = this.state;

    // const payload = {
    //   Verb: 'set',
    //   Name: 'foo',
    //   Value: 42
    // };

    // const payloadBytes = cbor.encode(payload);

    // const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    //   familyName: 'intkey',
    //   familyVersion: '1.0',
    //   inputs: ['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    //   outputs: ['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    //   signerPublicKey: signer.getPublicKey().asHex(),
    //   // In this example, we're signing the batch with the same private key,
    //   // but the batch can be signed by another party, in which case, the
    //   // public key will need to be associated with that key.
    //   batcherPublicKey: signer.getPublicKey().asHex(),
    //   // In this example, there are no dependencies.  This list should include
    //   // an previous transaction header signatures that must be applied for
    //   // this transaction to successfully commit.
    //   // For example,
    //   // dependencies: ['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
    //   dependencies: [],
    //   payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
    // }).finish();

    // const signature = signer.sign(transactionHeaderBytes);

    // const transaction = protobuf.Transaction.create({
    //   header: transactionHeaderBytes,
    //   headerSignature: signature,
    //   payload: payloadBytes
    // });
  }

  render() {
    return (
      <div className="App">
        <h1>Sawtooth</h1>
        <p>Private Key: { this.state.privateKey.asHex() }</p>
      </div>
    );
  }
}

export default App;
