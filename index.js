const express = require('express');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const app = express();
const port = 3000;
app.use(bodyParser.json());

const contas = {
    '12345':{saldo:1000},
    '76789':{saldo:500}
}

const transacoes = [];

app.post('/api/transferir', (req, res) => {
    const {contaOrigem, contaDestino, valor} = req.body;

    if (!contaOrigem || !contaDestino || valor === undefined) {
        return res.status(400).json({erro: 'dados incompletos'});
    }

    if (!contas[contaOrigem] || !contas[contaDestino]) {
        return res.status(400).json({erro: 'Conta inválida'});
    }

    if(valor <= 0){
        return res.status(400).json({erro: 'Valor inválido'});
    }

    if (contas[contaOrigem].saldo < valor) {
        return res.status(400).json({erro: 'Saldo insuficiente'});
    }

    const idTransacao = uuidv4();
    const novaTransacao = {
        id: idTransacao,
        contaOrigem,
        contaDestino,
        valor,
        data: new Date().toISOString(),
        status: 'concluída'
    };

    transacoes.push(novaTransacao);
    contas[contaOrigem].saldo -= valor;
    contas[contaDestino].saldo += valor;

    return res.status(200).json({
        mensagem: 'Transferência realizada com sucesso', 
        idTransacao,
        novoSaldoOrigem : contas[contaOrigem].saldo,
        novoSaldoDestino : contas[contaDestino].saldo
    });   
});

app.listen(port, () => {
    console.log('API rodando em http://localhost:' + port);
})