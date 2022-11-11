const excel = require('exceljs');

async function tableController(req, res){
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tutorials");
    const tutorials = [
        {
            id: 01,
            title: "teste01",
            description: "adadawcawdawcadawcawdawcawdawcawdcawd",
            published: "adadawcawdawcadawcawdawcawdawcawdcawd",
        },{
            id: 02,
            title: "teste02",
            description: "adadawcawdawcadawcawdawcawdawcawdcawd",
            published: "adadawcawdawcadawcawdawcawdawcawdcawd",
        },{
            id: 03,
            title: "teste03",
            description: "adadawcawdawcadawcawdawcawdawcawdcawd",
            published: "adadawcawdawcadawcawdawcawdawcawdcawd",
        },{
            id: 04,
            title: "teste04",
            description: "adadawcawdawcadawcawdawcawdawcawdcawd",
            published: "adadawcawdawcadawcawdawcawdawcawdcawd",
        },{
            id: 05,
            title: "teste05",
            description: "adadawcawdawcadawcawdawcawdawcawdcawd",
            published: "adadawcawdawcadawcawdawcawdawcawdcawd",
        }
    ]
    worksheet.columns = [
      { header: "Id", key: "id", width: 5 },
      { header: "Title", key: "title", width: 25 },
      { header: "Description", key: "description", width: 25 },
      { header: "Published", key: "published", width: 35 },
    ];
    
    // Add Array Rows
    worksheet.addRows(tutorials);
    
    // res is a Stream object
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "tutorials.xlsx"
    );
    
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
}

module.exports = {tableController};