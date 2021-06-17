const services = require("../services/convertToExcelService");

exports.postJSONData = async (req, res) => {

    const JSONobjects = req.body;

    JSONobjects.forEach(JSONobject => {
        documentType = services.getDocumentType(JSONobject);
        services.convertJSONobjectToExcel(JSONobject, documentType)
    });

}