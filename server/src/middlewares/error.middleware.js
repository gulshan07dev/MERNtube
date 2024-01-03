const errorMiddleware = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        statusCode: err.statusCode || 500,
        success: false,
        message: err.message,
        errors: err.errors
    })
}

export default errorMiddleware;