const excelJS = require("exceljs");
var flatten = require("flat");
const txtFileService = require("../services/txtFileServices");

exports.getDocumentType = (JSONobj) => {
    const doctype = JSONobj.PkePredlozakTip;
    if (doctype) {
        return doctype.toString();
    }
    return "0";
}

exports.convertJSONobjectToExcel = async (obj, documentType) => {
    let workbook = new excelJS.Workbook();

    try {
        await workbook.xlsx.readFile('ExcelFiles/export.xlsx');
    } catch (error) {
        console.log("New export file is being made...");
        await workbook.xlsx.writeFile('ExcelFiles/export.xlsx');
    }

    const flatObject = flatten(obj)

    const listOfProps = Object.getOwnPropertyNames(flatObject);

    filteredProps = [];

    listOfProps.forEach(element => {
        if (element.includes('.')) {
            let extractedFiled = element.split('.')[2];
            if (!extractedFiled) {
                extractedFiled = element.split('.')[1];
            }
            filteredProps.push(extractedFiled);
        } else {
            filteredProps.push(element);
        }
    });

    const doctypeExists = txtFileService.docTypeExists(documentType);
    if (!doctypeExists) {
        txtFileService.createDocumentType(documentType);
    }

    const existingPropsByDoctype = txtFileService.getExistingProps(documentType).filter(e => e.length > 1);

    let missingProps = [];

    filteredProps.forEach(element => {
        if (!existingPropsByDoctype.includes(element)) {
            missingProps.push(element);
        }
    });

    if (missingProps.length > 0) {
        txtFileService.addPropsToDoc(missingProps, documentType);
    }


    //Prepare to add rows

}

