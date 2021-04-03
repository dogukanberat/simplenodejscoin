const SHA256 = require('crypto-js/sha256');
const express = require("express");
const path = require("path");
const port = process.env.PORT || 3000;
const app = express();

class CryptoBlock {
    constructor(index, timestamp, data, precedingHash = " ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = precedingHash;
        this.hash = this.computeHash();
        this.nonce = 0;
    }

    computeHash() {
        return SHA256(
            this.index +
            this.precedingHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).toString();
    }

    proofOfWork(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
            ) {
            this.nonce++;
            this.hash = this.computeHash();
        }
    }
}

class CryptoBlockchain {
    constructor() {
        this.blockchain = [this.startGenesisBlock()];
        this.difficulty = 4;
    }
    startGenesisBlock() {
        return new CryptoBlock(0, "01/01/2020", "Initial Block in the Chain", "0");
    }

    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }
    addNewBlock(newBlock) {
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        //newBlock.hash = newBlock.computeHash();
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
        console.log(this.blockchain)
    }

    checkChainValidity() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i - 1];

            if (currentBlock.hash !== currentBlock.computeHash()) {
                return false;
            }
            if (currentBlock.precedingHash !== precedingBlock.hash) return false;
        }
        return true;
    }
}

let odeCoin = new CryptoBlockchain();

// console.log(JSON.stringify(odeCoin, null, 4));


app.use("/", express.static(path.resolve(__dirname, "")));

app.post("/*", (req, res) => {

    odeCoin.addNewBlock(new CryptoBlock(1, "01/06/2020", {sender: "Dogukan Elbasan", recipient: "Berat Elbasan", quantity: 100}));


    //it's for just a button if u click button it creates a new block
    res.sendFile(path.resolve(__dirname, "", "index.html"));
});

app.listen(port, () => console.log("Odecall is running on port " + port));

