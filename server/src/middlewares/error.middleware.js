const errorMiddleware = (err, req, res, next) => { 
    res.status(err.statusCode).json({
        success: err.success,
        message: err.message,
        errors: err.errors
    })
}

export default errorMiddleware;