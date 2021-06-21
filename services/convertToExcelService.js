const Excel = require("exceljs");
const fs = require("fs");
const txtFileService = require("../services/txtFileServices");
const xlsxFileService = require("../services/xlsxFileServices");
const APIservices = require("../services/APIservices");


exports.getDocumentType = (JSONobj) => {
    const doctype = JSONobj.PkePredlozakTip;
    if (doctype) {
        return doctype.toString();
    }
    return "0";
}

exports.convertJSONobjectToExcel = async (obj, documentType) => {

    let workbook = new Excel.Workbook();
    let worksheet = workbook.getWorksheet(documentType.toString());

    // 1 to 1, each prop is pair of another on same index
    let flattenedJSONprops = APIservices.flattenJSONandGetProps(obj);
    let flattenedJSONvalues = APIservices.flattenJSONvalues(obj);

    let propsExistingOnDocument;

    const doctypeExists = txtFileService.docTypeExists(documentType);
    if (!doctypeExists) {
        //#region Adding Fields To Document
        txtFileService.createDocumentType(documentType);
        txtFileService.addPropsToDoc(flattenedJSONprops, documentType);

        // TODO: add those props to headers in xlsx file

        //#endregion
    } else {
        //#region Updating Missing Fields On Document
        propsExistingOnDocument = txtFileService.getExistingProps(documentType).filter(e => e.length > 1);

        let missingPropsOnDocument = [];

        flattenedJSONprops.forEach(element => {
            if (!(propsExistingOnDocument.includes(element))) {
                missingPropsOnDocument.push(element);
            }
        });

        if (missingPropsOnDocument.length > 0) {
            txtFileService.addPropsToDoc(missingPropsOnDocument, documentType);
        }

        // TODO: add those missing props to excel header

        //#endregion
    }


    try {
        fs.statSync("ExcelFiles/main.xlsx");
        await workbook.xlsx.readFile("ExcelFiles/main.xlsx");
    } catch (error) {
        const newWorksheet = workbook.addWorksheet(documentType.toString());
        newWorksheet.columns = xlsxFileService.extractColumnsFromJSON(obj);
        await workbook.xlsx.writeFile("ExcelFiles/main.xlsx");
    }

    await workbook.xlsx.readFile("ExcelFiles/main.xlsx");

    worksheet = workbook.getWorksheet(documentType.toString());

    if (!worksheet) {
        let newWorksheet = workbook.addWorksheet(documentType.toString());
        newWorksheet.columns = xlsxFileService.extractColumnsFromJSON(obj);
    } else {
        console.log("Postojeci worksheet");
    }

    await workbook.xlsx.writeFile("ExcelFiles/main.xlsx");

}

