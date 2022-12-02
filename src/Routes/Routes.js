const { Router } = require("express");
const { createHardware, deleteHardware, updateHardware, getHardware } = require("../Controllers/HardwareController/hardwareController");
const { createMovimentation, updateMovimentation, getMovimentation, deleteMovi, getMovimentationsAdmin, getMovimentationPerDay } = require("../Controllers/MovementsController/movimentsController");
const { updateOperation, createOperation, deleteOperation, getOperation } = require("../Controllers/OperationController/operationController");
const { tableController } = require("../Controllers/TableController/TableController");
const {createUser, userLogon, getTecnicos, updateTecnico, deleteTecnico, updateNomeTecnico} = require("../Controllers/UserController/userController");
const { JwtMiddleware, JwtVerify } = require("../Middleware/jwt");
const routes = Router();

routes.get('/status',(req, res)=>res.send("Funcionando"))
routes.post('/jwtverify', JwtVerify);
// Rotas Hardware
routes.post('/createhardware', JwtMiddleware, createHardware);
routes.post('/deletehardware', JwtMiddleware, deleteHardware);
routes.post('/updatehardware', JwtMiddleware, updateHardware);
routes.post('/gethardwares', JwtMiddleware, getHardware);

// Rotas Tecnicos
routes.post('/createuser', JwtMiddleware, createUser);
routes.post('/userlogin', userLogon);
routes.post('/updateuser', JwtMiddleware, updateTecnico);
routes.post('/updatenome', JwtMiddleware, updateNomeTecnico);
routes.post('/deletetecnico', JwtMiddleware, deleteTecnico);
routes.post('/gettecnicos', JwtMiddleware, getTecnicos);

// Rotas Operacao
routes.post('/crateoperation', JwtMiddleware, createOperation);
routes.post('/deleteoperation', JwtMiddleware, deleteOperation);
routes.post('/updateoperation', JwtMiddleware, updateOperation);
routes.post('/getoperations', JwtMiddleware, getOperation);

// Rotas Movimentações
routes.post('/createmovi', JwtMiddleware, createMovimentation);
routes.post('/updatemovi', JwtMiddleware, updateMovimentation);
routes.post('/getmovi', JwtMiddleware, getMovimentation);
routes.post('/getadmmovi', JwtMiddleware, getMovimentationsAdmin);
routes.post('/deletemovi', JwtMiddleware, deleteMovi);
routes.post('/getmovimentationperday', JwtMiddleware, getMovimentationPerDay);





// Rotas Tabelas
routes.get('/downloadtable', tableController);


module.exports = routes