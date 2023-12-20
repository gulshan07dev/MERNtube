import fs from "fs"

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
            .finally(() => {
                if (req.files) {
                    Object.entries(req.files)
                        .map((key) => key[1])
                        .map(([file]) => file.path)
                        .forEach(path => fs.unlinkSync(path))
                }
                if (req.file) {
                    fs.unlinkSync(req.file?.path);
                }
            })
    }
}


export default asyncHandler