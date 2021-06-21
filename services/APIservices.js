const flatten = require("flat");

exports.flattenJSONandGetProps = (JSON) => {
    const flattenObject = flatten(JSON);
    const flattenObjectProps = Object.getOwnPropertyNames(flattenObject);

    let propsArr = [];

    flattenObjectProps.forEach(prop => {
        if (prop.includes(".")) {
            const requiredProp = prop.split('.');
            propsArr.push(requiredProp[requiredProp.length - 1]);
        } else {
            propsArr.push(prop);
        }
    });

    return propsArr;

}

exports.flattenJSONvalues = (JSON) => {
    const flattenObject = flatten(JSON);
    const flattenObjectValues = Object.values(flattenObject);

    return flattenObjectValues;
}