const express = require('express')
const { v4 } = require('uuid')
const Blockchain = require('../src/blockchain')

const nodeAddress = v4().split('-').join('')

const app = express()
app.use(express.json())

const Naises = new Blockchain()

const PORT = process.env.PORT || 3001

app.get('/blockchain', (req, res) => {
    res.json(Naises)
})

app.get('/mine', (req, res) => {
    const lastBlock = Naises.getLastBlock()
    const prevBlockHash = lastBlock.hash
    const currBlockData = {
        index: lastBlock.index + 1,
        transactions: Naises.pendingTransactions,
    }

    const nonce = Naises.proofOfWork(prevBlockHash, currBlockData)
    const blockHash = Naises.hashBlock(prevBlockHash, currBlockData, nonce)

    Naises.generateTransaction(1, '#', nodeAddress)

    const block = Naises.generateBlock(nonce, prevBlockHash, blockHash)

    res.json({
        note: 'Block mined successfully',
        block,
    })
})

app.post('/transaction', (req, res) => {
    const data = req.body
    const blockIndex = Naises.generateTransaction(data.amount, data.sender, data.recipient)

    res.json({ note: 'Transaction added', blockIndex: blockIndex })
})

app.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`)
})
