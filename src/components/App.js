import React, { Component } from "react";
import Web3 from "web3";
import Identicon from "identicon.js";
import "./App.css";
import Tgthr from "../abis/Tgthr.json";
import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      tgthr: null,
      images: [],
      loading: false,
    };
  }

  async componentDidMount() {
    this.loadWeb3();
    this.loadEthereumData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. Condider isntalling Metamask!"
      );
    }
  }

  async loadEthereumData() {
    const web3 = window.web3;
    // Loads account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Gets contract address per selected network
    const networkId = await web3.eth.net.getId();
    const networkData = Tgthr.networks[networkId];

    if (networkData) {
      const tgthr = web3.eth.Contract(
        Tgthr.abi,
        Tgthr.networks["5777"].address
      );
      const imageCount = await tgthr.methods.imageCount().call();
      this.setState({ tgthr, imageCount });
    } else {
      window.alert("Tgthr contract not deployed on this network.");
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <Main
            images={[]}
            // Code...
          />
        )}
      </div>
    );
  }
}

export default App;
