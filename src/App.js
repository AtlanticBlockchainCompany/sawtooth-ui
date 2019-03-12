import React, { Component } from 'react';
import { createContext, CryptoFactory } from 'sawtooth-sdk/signing';
import protobuf from 'sawtooth-sdk/protobuf';
import cbor from 'cbor';
import { createHash } from 'crypto';
import request from 'request';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    const context = createContext('secp256k1');
    const privateKey = context.newRandomPrivateKey();
    const signer = new CryptoFactory(context).newSigner(privateKey);

    this.state = {
      context, privateKey, signer,
      response: null
    };
  }

  componentWillMount() {

    const { signer } = this.state;

    const payload = {
      Verb: 'inc',
      Name: 'foo',
      Value: 1
      // Value: Math.floor((Math.random() * 100) + 1)
    };

    const payloadBytes = cbor.encode(payload);

    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
      familyName: 'intkey',
      familyVersion: '1.0',
      inputs: ['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
      outputs: ['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
      signerPublicKey: signer.getPublicKey().asHex(),
      // In this example, we're signing the batch with the same private key,
      // but the batch can be signed by another party, in which case, the
      // public key will need to be associated with that key.
      batcherPublicKey: signer.getPublicKey().asHex(),
      // In this example, there are no dependencies.  This list should include
      // an previous transaction header signatures that must be applied for
      // this transaction to successfully commit.
      // For example,
      // dependencies: ['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
      dependencies: [],
      payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
    }).finish();

    const signature = signer.sign(transactionHeaderBytes);

    const transaction = protobuf.Transaction.create({
      header: transactionHeaderBytes,
      headerSignature: signature,
      payload: payloadBytes
    });

    const transactions = [transaction];

    const batchHeaderBytes = protobuf.BatchHeader.encode({
      signerPublicKey: signer.getPublicKey().asHex(),
      transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish();

    const batchHeaderSignature = signer.sign(batchHeaderBytes);

    const batch = protobuf.Batch.create({
      header: batchHeaderBytes,
      headerSignature: batchHeaderSignature,
      transactions: transactions
    });

    const batchListBytes = protobuf.BatchList.encode({
      batches: [batch]
    }).finish();

    request.post({
      url: 'http://localhost:3000/api/batches',
      body: batchListBytes,
      headers: { 'Content-Type': 'application/octet-stream' }
    }, (err, response) => {
      if (err) return console.log(err)
      console.log(response.body)
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Sawtooth</h1>
        <p>Private Key: {this.state.privateKey.asHex()}</p>
        <div>{this.state.response &&
          <ul>
            {
              this.state.response.data.map((item, index) => {
                return <li key={index}>{index + 1} : {item.header_signature}</li>;
              })
            }
          </ul>
        }
        </div>
      </div>
    );
  }
}

export default App;
