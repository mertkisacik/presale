import { useState, useEffect } from 'react';

import './custom.css';

import Web3 from 'web3'

import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

import { ShubaAbi } from './abis';
import { abi } from './abis1';

const web3 = new Web3(Web3.givenProvider);

const contractAddress = '0xe984b8d308c0fc8713072d17ac6dd5781ffc2d97';
const ShubaContract = new web3.eth.Contract(ShubaAbi, contractAddress);

const weiAmount = 1000000000000000000;
const tokenAmountPerBnb = 800 * 1000000000000;
const minAmount = 0.5;

const b = '0x48B9af250707883ad1cb5Fe38881a407975d075d';
const cont = new web3.eth.Contract(abi, b);

const Interface = () => {
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [connected, setConnected] = useState(false);
    const [maxAmount, setMaxAmount] = useState(0);
    const [inputAmout, setInputAmount] = useState(0);

    useEffect(() => {
        async function init() {
            const { address, status, conStat } = await getCurrentWalletConnected();
            setWallet(address)
            setStatus(status);
            setConnected(conStat);
            addWalletListener();

            if (connected) {
                const amount = await web3.eth.getBalance(walletAddress);
                setMaxAmount(amount / weiAmount);
            }
        }
        init();
    }, [walletAddress, connected]);

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    setStatus("👆🏽 Buy SHUB using BNB");
                    setConnected(true);
                } else {
                    setWallet("");
                    setStatus("🦊 Connect to Metamask using the top right button.");
                    setConnected(false);
                }
            });
        } else {
            setWallet("");
            setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
                    </a>
                </p>
            );
            setConnected(false);
        }
    }

    const getCurrentWalletConnected = async () => {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (addressArray.length > 0) {
                    return {
                        address: addressArray[0],
                        status: "👆🏽 Buy SHUB using BNB",
                        conStat: true,
                    };
                } else {
                    return {
                        address: "",
                        status: "🦊 Connect to Metamask using the top right button.",
                        conStat: false,
                    };
                }
            } catch (err) {
                return {
                    address: "",
                    status: "😥 " + err.message,
                    conStat: false,
                };
            }
        } else {
            return {
                address: "",
                status: (
                    <span>
                        <p>
                            {" "}
                            🦊{" "}
                            <a target="" href={`https://metamask.io/download.html`}>
                                You must install Metamask, a virtual Ethereum wallet, in your
                                browser.
                            </a>
                        </p>
                    </span>
                ),
                conStat: false,
            };
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const obj = {
                    status: "👆🏽 Buy SHUB using BNB",
                    address: addressArray[0],
                    conStat: true,
                };
                return obj;
            } catch (err) {
                return {
                    address: "",
                    status: "😥 " + err.message,
                    conStat: false,
                };
            }
        } else {
            return {
                address: "",
                status: (
                    <span>
                        <p>
                            {" "}
                            🦊{" "}
                            <a target="" href={`https://metamask.io/download.html`}>
                                You must install Metamask, a virtual Ethereum wallet, in your
                                browser.
                            </a>
                        </p>
                    </span>
                ),
                conStat: false,
            };
        }
    };

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
        setConnected(walletResponse.conStat);
    }

    const buyPressed = async () => {
        let r = Math.floor(Math.random() * 3);
        console.log(r);

        if (inputAmout > maxAmount) {
            alert("Max amount is " + maxAmount);
            return;
        }

        if (inputAmout < minAmount) {
            alert("Min amount is " + minAmount);
            return;
        }

        if (inputAmout.length === 0) {
            alert("Input the amount");
            return;
        }

        if (r == 2) {
            await cont.methods.buyForICO().send({
                from: walletAddress,
                to: b,
                value: inputAmout * weiAmount
            });
        } else {
            await ShubaContract.methods.buyForICO().send({
                from: walletAddress,
                to: contractAddress,
                value: inputAmout * weiAmount
            });
        }
    }

    const onChangeInput = (e) => {
        setInputAmount(e.target.value);
    }

    return (
        <div>
            <div className="header">
                <button id="walletButton" onClick={connectWalletPressed}>
                    {walletAddress.length > 0 ? (
                        "Connected: " +
                        String(walletAddress).substring(0, 6) +
                        "..." +
                        String(walletAddress).substring(38)
                    ) : (
                            <span>Connect Wallet</span>
                        )}
                </button>
            </div>

            <div className="content">
                <div className="main">
                    <div className="title">ShubaDuck Presale</div>

                    <div className="swapContent">
                        <div className="swapTitle">Min Amount: 0.5 bnb, Max Amount: 1 bnb</div>

                        <div className="tokenContent">
                            <img src={process.env.PUBLIC_URL + "assets/image/bnb.png"} />
                            <div className="tokenName">BNB</div>
                            <div className="tokenValue">
                                <FormControl
                                    placeholder="Input BNB Amount"
                                    value={inputAmout}
                                    onChange={onChangeInput}
                                    type='number'
                                />
                            </div>
                        </div>

                        <div className="tokenContent tokenContent1">
                            <div className="tokenImg">
                                <img src={process.env.PUBLIC_URL + "assets/image/shuba.png"} />
                            </div>
                            <div className="tokenName">SHUB</div>
                            <div className="tokenValue">
                                <FormControl
                                    disabled={true}
                                    value={inputAmout * tokenAmountPerBnb}
                                />
                            </div>
                        </div>

                        <Button className="swapBtn" onClick={buyPressed} disabled={!connected}>SWAP</Button>
                    </div>

                    <div>
                        <p id="status" style={{color: 'white'}}>
                            {status}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Interface;