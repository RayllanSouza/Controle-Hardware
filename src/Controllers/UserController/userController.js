const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {SyncSQL, connection} = require('../../Database/Database');
require('dotenv').config();

function hashPassword(password){
    const salt = 10;
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, salt, (error, hash)=>{
            if(error) return reject(error)
            resolve(hash);
        })
    })
}

async function createUser(req, res){
    const {nomeTecnico, usuarioTecnico, senhaTecnico, adminStatus} = req.body;
    if(nomeTecnico.length < 1 || usuarioTecnico.length < 1 || senhaTecnico.length < 1){
        return res.status(500).json({
            Error: "Falha ao inserir dados, verifique as entradas."
        })
    }else{
        const hashedPassword = await hashPassword(senhaTecnico);
        const user = {
            nometecnico: nomeTecnico,
            usertecnico: usuarioTecnico,
            senhatecnico: hashedPassword,
            admin: adminStatus
        }
        try{
            let admin_rule = await SyncSQL("SELECT * FROM tecnico WHERE codtecnico = ?", req.headers.decoded.codTecnico);
            const isAdmin = admin_rule[0].admin === 1;
            if(isAdmin){
                let tecnicos_rows = await SyncSQL("SELECT * FROM tecnico WHERE usertecnico = ?", usuarioTecnico);
                let already_exist_usertecnico = tecnicos_rows.length > 0;
                if(already_exist_usertecnico){
                    return res.status(400).json({
                        error: true,
                        message: "Usuario já existe!"
                    })
                }
                await SyncSQL("INSERT INTO tecnico SET ?", user)
                return res.status(201).json(user);
            }
            return res.status(400).json({
                erro: "Voce não possui acesso a este recurso!"
            });
                
        }catch(err){
            return res.json({
                Error: "Server internal Error"
            })
        }
    }
}

async function deleteTecnico(req, res){
    const { codtecnico } = req.body;
    if(codtecnico.length < 1){
        return res.status(500).json({
            Error: "Falha ao inserir dados, verifique as entradas."
        })
    }else{
        try{
            await SyncSQL("DELETE FROM tecnico WHERE codtecnico = ?", codtecnico);
            return res.status(200).json({
                Sucesso: "tecnico excluido com sucesso!"
            })
        }catch(err){
            console.log(err);
            return res.status(500).json({Erro: "Server Internal Error!"})
        }
    }
}

function userLogon(req, res){
    const { usuarioTecnico, senhaTecnico } = req.body;
    if(usuarioTecnico.length < 1 || senhaTecnico.length < 1){
        return res.status(500).json({
            Error: "Falha ao inserir dados, verifique as entradas."
        })
    }else{
        try{
            connection.query("SELECT * FROM tecnico WHERE usertecnico = ?", usuarioTecnico, (err, result, fields)=>{
                if(err) throw err;
                if(result.length > 0){
                    const passwordIsValid = bcrypt.compareSync(senhaTecnico, result[0].senhatecnico);
                    if(passwordIsValid){
                        var token = jwt.sign(
                        {
                            nomeTecnico: result[0].nometecnico,
                            userTecnico: result[0].usertecnico,
                            codTecnico: result[0].codtecnico,
                            admin: result[0].admin
                        },
                        process.env.secret_key,
                        {
                            expiresIn: 60*15
                        });
                        return res.status(200).json({
                            token: token,
                            nome: result[0].nometecnico,
                            role: result[0].admin
                        });
                    }else{
                        return res.status(401).json({
                            Erro: "Usuario ou senha incorreto!"
                        })
                    }
                    
                }else{
                    return res.status(404).json({
                        Erro: "Usuario não encontrado!"
                    })
                }
            })
        }catch(err){
            return res.status(500).json({Erro: "Server Internal Error!"})
        }
    }
}

async function updateTecnico(req, res){
    try{
        const { senhaatual, novasenha} = req.body;
        if(senhaatual.length < 1 || novasenha.length < 1){
            return res.status(500).json({
                Error: "Falha ao inserir dados, verifique as entradas."
            })
        }else{
            const sql = SyncSQL("SELECT * FROM tecnico WHERE codtecnico = ?", req.headers.decoded.codTecnico);
            connection.query("SELECT * FROM tecnico WHERE codtecnico = ?", req.headers.decoded.codTecnico, async(err, result, fields)=>{
                const passwordIsValid = await bcrypt.compare(senhaatual, result[0].senhatecnico);
                if(passwordIsValid){
                    const hashedPassword = await hashPassword(novasenha);
                    const data={
                        senhatecnico: hashedPassword
                    }
                    try{
                        await SyncSQL("UPDATE tecnico SET ? WHERE codtecnico = ?", [data, req.headers.decoded.codTecnico])
                        return res.status(200).json({
                            Sucesso: "Tecnico editado com sucesso!"
                        })
                    }catch(err){
                        console.log(err);
                        return res.status(500).json({Erro: "Server Internal Error!"})
                    }
                }
                return res.status(400).json({Erro: "Senha atual não corresponde a do cadastro."})
            })
            // const passwordIsValid = await bcrypt.compare(senhaatual, sql[0].senhatecnico);
        }
    }catch(err){
        return res.status(400).json({
            Erro: "Não foi possivel validar os campos"
        })
    }
}

async function updateNomeTecnico(req, res){
        const { nomeatual, novonome} = req.body;
        if(nomeatual.length < 1 || novonome.length < 1){
            return res.status(500).json({
                Error: "Falha ao inserir dados, verifique as entradas."
            })
        }else{
            try{
                const data={
                    nometecnico: novonome
                }
                await SyncSQL("UPDATE tecnico SET ? WHERE codtecnico = ?", [data, req.headers.decoded.codTecnico])
                return res.status(200).json({
                    Sucesso: "Nome Alterado com sucesso!"
                })
            }catch(err){
                if(err) throw err;
            }
        }           
}


async function getTecnicos(req, res){
    try{
        connection.query("SELECT * FROM tecnico", (err, results, fields)=>{
            if(err) throw err;
            return res.status(200).json(results);
        })
    }catch(err){
        return res.status(500).json({
            Erro: "Server internal error"
        })
    }
}


module.exports = {createUser, userLogon, updateTecnico, updateNomeTecnico, getTecnicos, deleteTecnico};