const sha256 = require('sha256')

class Blockchain {
    constructor() {
        this.chain = new Array()
        this.pendingTransactions = new Array()

        // Genesis block
        this.generateBlock(0, '0000', '0000')
    }

    generateBlock = (nonce, prevBlockHash, hash) => {
        const block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce,
            prevBlockHash,
            hash,
        }

        this.pendingTransactions = []
        this.chain.push(block)

        return block
    }

    getLastBlock = () => {
        return this.chain[this.chain.length - 1]
    }

    generateTransaction = (amount, sender, recipient) => {
        const transaction = {
            amount,
            sender,
            recipient,
        }

        this.pendingTransactions.push(transaction)
        return this.getLastBlock().index + 1
    }

    hashBlock = (prevBlockHash, currBlockData, nonce) => {
        const dataAsString = prevBlockHash + JSON.stringify(currBlockData) + nonce.toString()
        const hash = sha256(dataAsString)

        return hash
    }

    proofOfWork = (prevBlockHash, currBlockData) => {
        let nonce = 0
        let hash = this.hashBlock(prevBlockHash, currBlockData, nonce)

        while (hash.substring(0, 4) !== '0000') {
            nonce++
            hash = this.hashBlock(prevBlockHash, currBlockData, nonce)
        }

        return nonce
    }
}

module.exports = Blockchain
