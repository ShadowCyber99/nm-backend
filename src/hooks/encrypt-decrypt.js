import React, { Component } from 'react';
import * as CryptoJS from 'crypto-js';

class EncryptDecrypt extends Component {
  constructor() {
    super();
    this.state = {
      inputText: '',
      inputKey: 'admin123',
      encryptedBase64Input: '',
      encryptedBase64: '',
      decryptKey: 'admin123',
      key: 'admin123',
      decryptedText: '',
    };
  }

  /*
   * Encrypt a derived hd private key with a given pin and return it in Base64 form
   */
  encryptAES = (text, key) => {
    return CryptoJS.AES.encrypt(text, key).toString();
  };

  /**
   * Decrypt an encrypted message
   * @param encryptedBase64 encrypted data in base64 format
   * @param key The secret key
   * @return The decrypted content
   */
  decryptAES = (encryptedBase64, key) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key);
    if (decrypted) {
      try {
        const str = decrypted.toString(CryptoJS.enc.Utf8);
        if (str.length > 0) {
          return str;
        } else {
          return 'error 1';
        }
      } catch (e) {
        return 'error 2';
      }
    }
    return 'error 3';
  };

  handleInputTextChange = (event) => {
    this.setState(
      {
        inputText: event.target.value,
      },
      this.encryptInputText,
    );
  };

  handleInputKeyChange = (event) => {
    this.setState(
      {
        inputKey: event.target.value,
      },
      this.encryptInputText,
    );
  };

  encryptInputText = () => {
    this.setState({
      encryptedBase64Input: this.encryptAES(
        this.state.inputText,
        this.state.inputKey,
      ),
    });
  };

  handleDecryptKeyChange = (event) => {
    this.setState(
      {
        decryptKey: event.target.value,
      },
      this.decryptOutputText,
    );
  };

  handleMsgChange = (event) => {
    this.setState(
      {
        encryptedBase64: event.target.value,
      },
      this.decryptOutputText,
    );
  };

  decryptOutputText = () => {
    this.setState({
      outputText: this.decryptAES(
        this.state.encryptedBase64,
        this.state.decryptKey,
      ),
    });
  };

  testForProblems = () => {
    // eslint-disable-next-line no-const-assign
    for (const i = 0; i < 20000; i++) {
      setTimeout(() => {
        const key = '123';
        const passphrase =
          'this is a very long passphrase with a ton of words in it but it shouldnt really matter';
        const encrypted = this.encryptAES(passphrase, key);

        setTimeout(() => {
          if (passphrase !== this.decryptAES(encrypted, key)) {
          }
        }, 1000 + i);
      }, 100 + i);
    }
  };

  render() {
    const { error} = this.state;
    if (error) {
      return <h3>{error}</h3>;
    }
    return (
      <>
        <h1>Crypto-JS encryptAES</h1>
        <div className="form-group">
          <input
            className="form-control"
            value={this.state.inputText}
            onChange={this.handleInputTextChange}
            style={{ width: '40%', height: 40, marginRight: 20 }}
            placeholder="Input Text"
          />
          <input
            className="form-control"
            value={this.state.inputKey}
            onChange={this.handleInputKeyChange}
            style={{ width: '40%', height: 40 }}
            placeholder="Key"
          />
        </div>

        <pre className="output">
          <code>{this.state.encryptedBase64Input}</code>
        </pre>

        <h1>Crypto-JS decryptAES</h1>
        <div className="form-group">
          <input
            className="form-control"
            value={this.state.encryptedBase64}
            onChange={this.handleMsgChange}
            style={{ width: '40%', height: 40, marginRight: 20 }}
            placeholder="Encrypted String"
          />
          <input
            className="form-control"
            value={this.state.key}
            onChange={this.handleDecryptKeyChange}
            style={{ width: '40%', height: 40 }}
            placeholder="Key"
          />
        </div>

        <pre className="output">
          <code>{this.state.outputText}</code>
        </pre>
      </>
    );
  }
}

export default EncryptDecrypt;
