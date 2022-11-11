const {SyncSQL, connection} = require('../../Database/Database');

function createHardware(req, res){
    const { hardware } = req.body;
    const hard = hardware.toUpperCase();
    const arrop={
        nomehardware: hard
    }
    try{
        connection.query("SELECT * FROM hardware WHERE nomehardware = ?", hard, async (err, result, fields)=>{
            if(err) throw err;
            if(result.length > 0){
                return res.status(401).json({Erro: "Hardware já existe"})
            }else{
                try{
                    const sql = await SyncSQL("INSERT INTO hardware SET ?", arrop);
                    return res.status(201).json(sql);
                }catch(err){
                    console.log(err);
                    return res.status(500).json({Erro: "Falha ao adicionar hardware, verifique o banco de dados"})
                }
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({Erro: "Server Internal Error!"})
    }
}

async function deleteHardware(req, res){
    const { codhardware } = req.body;
    try{
        await SyncSQL("DELETE FROM hardware WHERE codhardware = ?", codhardware);
        return res.status(200).json({
            Sucesso: "Hardware excluido com sucesso!"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({Erro: "Server Internal Error!"})
    }
}

async function updateHardware(req, res){
    const {codhardware, nomehardware} = req.body;
    const nomehard = nomehardware.toUpperCase();
    const data={
        codhardware: codhardware,
        nomehardware: nomehard,
    }
    try{
        await SyncSQL("UPDATE hardware SET ? WHERE codhardware = ?", [data, codhardware])
        return res.status(200).json({
            Sucesso: "Hardware editado com sucesso!"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({Erro: "Server Internal Error!"})
    }
}


async function getHardware(req, res){
    try{
        connection.query("SELECT * FROM hardware", (err, results, fields)=>{
            if(err) throw err;
            return res.status(200).json(results);
        })
    }catch(err){
        return res.status(500).json({
            Erro: "Server internal error"
        })
    }
}






module.exports = {createHardware, updateHardware, deleteHardware, getHardware};