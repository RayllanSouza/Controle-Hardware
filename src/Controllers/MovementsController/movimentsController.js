const { connection, SyncSQL } = require("../../Database/Database");

function createMovimentation(req, res){
    const {nomeoperacao, nomehardware, numchamado} = req.body;
	const today = new Date();
	let yy = today.getFullYear();
	let mm = today.getMonth() + 1;
	let dd = today.getDate();
	if(dd < 10) dd = '0'+dd;
	if(mm < 10) mm = '0'+mm;
    if(nomeoperacao.length < 1 || nomehardware.length < 1 || numchamado.length < 5){
        return res.status(500).json({
            Error: "Falha ao inserir dados, verifique as entradas."
        })
    }else{
        connection.query("SELECT codoperacao FROM operacao WHERE nomeoperacao = ?", nomeoperacao, (err, idoperacao, fields)=>{
            if(err) throw err;
            connection.query("SELECT codhardware FROM hardware WHERE nomehardware = ?", nomehardware, async(err, idhardware, fields)=>{
                if(err) throw err;
                const arrTecnico = {
                    codtecnico: req.headers.decoded.codTecnico,
                    codoperacao: idoperacao[0].codoperacao,
                    codhardware: idhardware[0].codhardware,
                    num_chamado: numchamado,
		    data_chamado: dd+'/'+mm+'/'+yy
                }
                try{
                    const moviment = await SyncSQL("SELECT * FROM tecnico_operacao_hardware WHERE num_chamado = ?", numchamado);
                    const movimentAlreadyExist = moviment.length > 0;
                    if(movimentAlreadyExist){
                        return res.status(400).json({
                            error: true,
                            message: "O chamado já foi utilizado para outra movimentação"
                        })
                    }
                        await SyncSQL("INSERT INTO tecnico_operacao_hardware SET ?", arrTecnico);
                        return res.status(201).json(arrTecnico)
                }catch(err){
                    console.log(err)
                    return res.status(500).json({
                        Error: "Falha ao criar movimentacao!"
                    })
                }
            })
        })
    }
}

async function updateMovimentation(req, res){
    const {codoperacao, codhardware, numchamado, num_chamado} = req.body;
    if(codoperacao.length < 1 || codhardware.length < 1 || numchamado.length < 1 || num_chamado.length < 5){
        return res.status(500).json({
            Error: "Falha ao inserir dados, verifique as entradas."
        })
    }else{
        const data={
            codtecnico: req.headers.decoded.codTecnico,
            codoperacao: codoperacao,
            codhardware: codhardware,
            num_chamado: numchamado
        }
        try{
            await SyncSQL("UPDATE tecnico_operacao_hardware SET ? WHERE num_chamado = ?", [data, num_chamado])
            return res.status(200).json({
                Sucesso: "Movimentação editada com sucesso!"
            })
        }catch(err){
            console.log(err);
            return res.status(500).json({Erro: "Server Internal Error!"})
        }
    }
}


function getMovimentation(req, res){
    const codtecnico = req.headers.decoded.codTecnico;
    try{
        connection.query("Select * FROM tecnico WHERE codtecnico = ?", codtecnico, (err, result, fields)=>{
            if(err) throw err;
            const nome = result[0].nometecnico;
            connection.query("SELECT * FROM tecnico INNER JOIN tecnico_operacao_hardware ON tecnico_operacao_hardware.codtecnico = tecnico.codtecnico INNER JOIN hardware ON hardware.codhardware = tecnico_operacao_hardware.codhardware INNER JOIN operacao ON operacao.codoperacao = tecnico_operacao_hardware.codoperacao WHERE nometecnico = ?", nome, (err, result, fields)=>{
                return res.status(200).json(result);
            })
        })
        // connection.query("SELECT a.nometecnico, a.codtecnico, b.* FROM tecnico as A INNER JOIN tecnico_operacao_hardware as B on ? = b.codtecnico;", codtecnico, (err, result, fields)=>{
        //     if(err) throw err;
        //     return res.status(200).json(result);
        // })
    }catch(err){
        if(err) throw err;
    }
}

function getMovimentationsAdmin(req, res){
    const codtecnico = req.headers.decoded.codTecnico;
    const roletecnico = req.headers.decoded.roleTecnico
    try{
        connection.query("SELECT tecnico_operacao_hardware.*, tecnico.nometecnico, operacao.nomeoperacao, hardware.nomehardware FROM tecnico_operacao_hardware INNER JOIN tecnico INNER JOIN operacao INNER JOIN hardware ON tecnico_operacao_hardware.codtecnico = tecnico.codtecnico AND tecnico_operacao_hardware.codoperacao = operacao.codoperacao AND tecnico_operacao_hardware.codhardware = hardware.codhardware", (err, result, fields)=>{
            if(err) throw err;
            return res.status(200).json(result);
        })
    }catch(err){
        if(err) throw err;
    }
}
function deleteMovi(req, res){
    const {numchamado} = req.body;
    try{
        connection.query("DELETE FROM tecnico_operacao_hardware WHERE num_chamado = ?", numchamado,(err, result, field)=>{   
            if(err) throw err;  
            return res.status(200).json({
                Status: "Deleted"
            })
        })
    }catch(err){
        if(err) throw err;
    }
}

function getMovimentationPerDay(req, res){
    try{
        connection.query("SELECT COUNT(*), data_chamado FROM tecnico_operacao_hardware GROUP BY data_chamado", (err, result, fields)=>{
            if(err) throw err;
            return res.status(200).json(result);
        })
    }catch(err){
        if(err) throw err;
    }
}

module.exports = {createMovimentation, updateMovimentation, getMovimentation, getMovimentationsAdmin, deleteMovi, getMovimentationPerDay}