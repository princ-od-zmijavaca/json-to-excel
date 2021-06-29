const services = require("../services/convertToExcelService");
const Excel = require("exceljs");

exports.postJSONData = async (req, res) => {
    const JSONobjects = req.body;
    let book = null;
    for (const JSONobject of JSONobjects) {
        const documentType = services.getDocumentType(JSONobject);
        const workbook = new Excel.Workbook();

        book = await services.convertJSONobjectToExcel(JSONobject, documentType, workbook);
        console.log(book.worksheets.map(w => w.actualRowCount));
    }
    await book.xlsx.writeFile("./ExcelFiles/export.xlsx");

    res.sendStatus(200);

}