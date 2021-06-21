const fs = require('fs');
const path = require('path');

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

    fs.appendFile(path.join("DocumentTypes", `${documentType.toString()}.txt`), data, (err, data) => {
        if (err) console.log("Error joining files");
    });
}

exports.txtFileNeedsUpdate = (JSONobj, documentType) => {
    const incomingPropArr = Object.getOwnPropertyNames(JSONobj);
    const existingProps = fs.readFileSync(path.join("DocumentTypes", `${documentType.toString()}.txt`), 'utf8', (err, data) => {
        if (err) {
            console.log("Error reading file");
        } else {
            return data;
        }
    });

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
    const existingProps = fs.readFileSync(path.join("DocumentTypes", `${documentType.toString()}.txt`), 'utf8', (err, data) => {
        if (err) {
            console.log("Error");
        } else {
            return data;
        }
    })

    return existingProps.split(",");
}