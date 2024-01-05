import fs from "fs"

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
            .finally(() => {
                if (req.files) {
                    Object.values(req.files)
                        .map(([file]) => file.path)
                        .forEach(path => path && fs.unlinkSync(path))
                }
                if (req.file) {
                    fs.unlinkSync(req.file?.path);
                }
            })
    }
}


export default asyncHandler