const {SyncSQL, connection} = require('../../Database/Database');

function createOperation(req, res){
    const { operacao } = req.body;
    const op = operacao.toUpperCase();
    const arrop={
        nomeoperacao: op
    }
    try{
        connection.query("SELECT * FROM operacao WHERE nomeoperacao = ?", operacao, async (err, result, fields)=>{
            if(err) throw err;
            if(result.length > 0){
                return res.status(401).json({Erro: "Operação já existe"})
            }else{
                try{
                    const sql = await SyncSQL("INSERT INTO operacao SET ?", arrop);
                    return res.status(201).json(sql);
                }catch(err){
                    console.log(err);
                    return res.status(500).json({Erro: "Falha ao adicionar operacao, verifique o banco de dados"})
                }
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({Erro: "Server Internal Error!"})
    }
}

async function deleteOperation(req, res){
    const { codoperacao } = req.body;
    try{
        await SyncSQL("DELETE FROM operacao WHERE codoperacao = ?", codoperacao);
        return res.status(200).json({
            Sucesso: "Operacao excluida com sucesso!"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({Erro: "Server Internal Error!"})
    }
}

async function updateOperation(req, res){
    const {codoperacao, nomeoperacao} = req.body;
    const nomeop = nomeoperacao.toUpperCase();
    const data={
        codoperacao: codoperacao,
        nomeoperacao: nomeop,
    }
    try{
        await SyncSQL("UPDATE operacao SET ? WHERE codoperacao = ?", [data, codoperacao])
        return res.status(200).json({
            Sucesso: "Operacao editada com sucesso!"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({Erro: "Server Internal Error!"})
    }
}


async function getOperation(req, res){
    try{
        connection.query("SELECT * FROM operacao", (err, results, fields)=>{
            if(err) throw err;
            return res.status(200).json(results);
        })
    }catch(err){
        return res.status(500).json({
            Erro: "Server internal error"
        })
    }
}






module.exports = {createOperation, deleteOperation, updateOperation, getOperation};