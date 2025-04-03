const {
    validationResult,
    check
} = require('express-validator');

module.exports = (req, res, next) => {

    console.log(req.body);
    

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({
            errors: result.array()
        });
    };

    next();
}