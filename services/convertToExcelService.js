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
    let worksheet = workbook.getWorksheet(documentType);

    // 1 to 1, each prop is pair of another on same index
    let flattenedJSONprops = APIservices.flattenJSONandGetProps(obj);
    let flattenedJSONvalues = APIservices.flattenJSONvalues(obj);

    let propsExistingOnDocument;

    const doctypeExists = txtFileService.docTypeExists(documentType);
    if (!doctypeExists) {
        //#region Adding Fields To Document And Creating Document
        txtFileService.createDocumentType(documentType);
        txtFileService.addPropsToDoc(flattenedJSONprops, documentType);
        //#endregion
    } else {
        //#region Update Missing Fields On Txt File If Needed
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
        //#endregion
    }


    try {
        fs.statSync("ExcelFiles/export.xlsx");
        await workbook.xlsx.readFile("ExcelFiles/export.xlsx");
    } catch (error) {
        const newWorksheet = workbook.addWorksheet("test");
        newWorksheet.columns = xlsxFileService.extractColumnsFromJSON(obj);
        await workbook.xlsx.writeFile("ExcelFiles/export.xlsx");
        console.log("Error finding file -> main.xlsx", error.message);
        console.log("CREATE FILE ExcelFiles/export.xlsx");
    }

    await workbook.xlsx.readFile("ExcelFiles/export.xlsx");

    worksheet = workbook.getWorksheet(documentType);

    if (!worksheet) {
        console.log("Nema worksheeta");
        let newWorksheet = workbook.addWorksheet(documentType);
        const columns = xlsxFileService.extractColumnsFromJSON(obj);
        newWorksheet.columns = columns;
        await workbook.xlsx.writeFile("ExcelFiles/export.xlsx");
    };

    worksheet = workbook.getWorksheet(documentType);

    // let rowObj = {};

    // flattenedJSONprops.forEach(element => {
    //     rowObj[`${element}`] = 
    // })

    // console.log(rowObj);


    let newRow = worksheet.addRow(obj);

    await newRow.commit();

    await workbook.xlsx.writeFile("ExcelFiles/export.xlsx");

}

