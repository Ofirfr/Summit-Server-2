const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token')

    // CHECK IF WE EVEN HAVE A TOKEN
    if(!token){
        res.status(401).json({
            errors: [
                {
                    msg: "No token found"
                }
            ]
        })
    }

    try {
        const connection = await jwt.verify(token, process.env.secret)
        req.loggedCoach = connection.name
        next()
    } catch (error) {
        res.status(400).json({
            errors: [
                {
                    msg: 'Invalid Token'
                }
            ]
        })
    }
}