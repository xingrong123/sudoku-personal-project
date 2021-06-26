const jwt = require("jsonwebtoken");
require("dotenv").config();


function jwtRefreshGenerator(user_id) {
    const payload = {
        user: user_id,
    };
    
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
}

module.exports = jwtRefreshGenerator;