const services = require("../services/convertToExcelService");

exports.postJSONData = async (req, res) => {
    const JSONobjects = req.body;

    await JSONobjects.forEach(JSONobject => {

        const documentType = services.getDocumentType(JSONobject);
        services.convertJSONobjectToExcel(JSONobject, documentType)
    });

    res.sendStatus(200);

}