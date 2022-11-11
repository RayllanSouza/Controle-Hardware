const excel = require('exceljs');
const { connection, SyncSQL } = require('../../Database/Database');

async function tableController(req, res){
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Relatorio");
    let quantidade = []
    worksheet.columns = [
      { header: "Nome Hardware", key: "nomehardware", width: 25 },
      { header: "Nome Operação", key: "nomeoperacao", width: 25 },
      { header: "Qtde.", key: "qtde", width: 35 },
    ];


    let operacoes = await SyncSQL("SELECT * FROM operacao");
    let hardware = await SyncSQL("SELECT * FROM hardware");
    operacoes.map(item =>
        connection.query("SELECT tecnico_operacao_hardware.*, operacao.nomeoperacao, hardware.nomehardware FROM tecnico_operacao_hardware INNER JOIN tecnico INNER JOIN operacao INNER JOIN hardware ON tecnico_operacao_hardware.codtecnico = tecnico.codtecnico AND tecnico_operacao_hardware.codoperacao = operacao.codoperacao AND tecnico_operacao_hardware.codhardware = hardware.codhardware WHERE operacao.codoperacao = ?", item.codoperacao, (err, results, fields)=>{
            if(err) throw err;
            quantidade = results;
        })
    )
    

    setTimeout(()=>{
        worksheet.addRows(quantidade)
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Relatorio.xlsx"
          );
          
          return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
          });
    },5000)
}

module.exports = {tableController};