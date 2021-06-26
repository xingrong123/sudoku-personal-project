const jwt = require("jsonwebtoken");
require("dotenv").config();


function jwtAccessGenerator(user_id) {
    const payload = {
        user: user_id,
    };

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1m"});
}

module.exports = jwtAccessGenerator;