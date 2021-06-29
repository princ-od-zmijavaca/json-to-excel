const fs = require('fs');
const path = require('path');
const APIservices = require("../services/APIservices");

exports.docTypeExists = (documentType) => {
    const exists = fs.existsSync(`DocumentTypes/${documentType}.txt`);
    if (exists) {
        return true;
    } else {
        return false;
    }
}

exports.createDocumentType = async (documentType) => {
    await fs.writeFileSync(`DocumentTypes/${documentType.toString()}.txt`, "", 'utf8');
}

exports.addPropsToDoc = (propsArr, documentType) => {
    const data = propsArr.join() + ",";
    try {
        fs.appendFileSync(path.join("DocumentTypes", `${documentType.toString()}.txt`), data);
    } catch (error) {
        if (error) console.log("Error joining files");
    }
}

exports.txtFileNeedsUpdate = (JSONobj, documentType) => {
    const incomingPropArr = APIservices.flattenJSONandGetProps(JSONobj);
    let existingProps = [];
    try {
        existingProps = fs.readFileSync(path.join("DocumentTypes", `${documentType.toString()}.txt`), 'utf8');
    } catch (error) {
        console.log("Error reading file");
    }

    const existingPropArr = existingProps.split(",");

    let missingFields = [];

    incomingPropArr.forEach(element => {
        if (!(existingPropArr.includes[element])) {
            missingFields.push(element);
        }
    });

    if (missingFields.length > 0) {
        this.addPropsToDoc(missingFields, documentType);
        return true;
    } else {
        return false;
    }

}

exports.getExistingProps = (documentType) => {
    try {
        const existingProps = fs.readFileSync(path.join("DocumentTypes", `${documentType.toString()}.txt`), 'utf8');
        return existingProps.split(",");

    } catch (error) {
        console.log("Error");
        return [];
    }
}