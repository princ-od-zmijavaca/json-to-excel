const excelJS = require("exceljs");
const flatten = require("flat");
const txtFileService = require("../services/txtFileServices");

exports.getRowsFromJSON = (JSONobject, documentType) => {

    const fileds = txtFileService.getExistingProps(fileType);
    console.log(fileds);
}

exports.generateWorksheet = async (worksheetName) => {
    let workbook = new excelJS.Workbook();

    try {
        await workbook.xlsx.readFile('ExcelFiles/export.xlsx');
    } catch (error) {
        console.log("Workbook not found at updataing exccel file", error);
    }

    console.log("Dodajemo worksheet");
    workbook.addWorksheet(worksheetName);

    await workbook.xlsx.writeFile('ExcelFiles/export.xlsx');
    console.log("Dodano");
}

exports.addColumnsToXLSX = async (columnsToBeAdded, documentType) => {

    let workbook = new excelJS.Workbook();

    try {
        await workbook.xlsx.readFile('ExcelFiles/export.xlsx');
    } catch (error) {
        console.log("Workbook not found at updataing excel file", error);
    }

    let worksheet = workbook.getWorksheet(documentType);
    let columns = [];

    columnsToBeAdded.forEach(column => {
        columns.push({ header: `${column}`, key: `${column}`, width: 10 });
    });

    worksheet.columns = columns;

    await workbook.xlsx.writeFile('ExcelFiles/export.xlsx');
    console.log("Added columns");
}

exports.extractColumnsFromJSON = (JSON) => {
    const flattenObject = flatten(JSON);
    const flattenObjectProps = Object.getOwnPropertyNames(flattenObject);

    let columnsArray = [];

    flattenObjectProps.forEach(prop => {
        if (prop.includes(".")) {
            const requiredProp = prop.split('.');
            columnsArray.push(requiredProp[requiredProp.length - 1]);
        } else {
            columnsArray.push(prop);
        }
    });

    let columns = [];

    columnsArray.forEach(element => {
        columns.push({ header: `${element}`, key: `${element}`, width: 10 })
    });

    return columns;
}