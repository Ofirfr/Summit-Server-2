const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token')

    // Check if token filled is not empty
    if(!token){
        return res.status(400).json({
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
        req.loggedCoachId = connection.id
        req.isAdmin = connection.isAdmin
        next()
    } catch (error) {
        return res.status(400).json({
            errors: [
                {
                    msg: 'Invalid Token'
                }
            ]
        })
    }
}