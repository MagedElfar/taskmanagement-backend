

const formatDbError = (err: any) => {
    if (err.message) console.warn(err.message);
    else console.warn(err.sqlMessage);
    return {
        code: 500,
        message: "Database failure",
    };
}

const requestErrorFormat = (err: any) => {
    const error = Object.assign({}, { type: "error" },
        err.errors && err.message ? {
            message: err.response?.data.message || err.message,
            errors: err.response?.data.message || err.errors
        } :
            err.errors ? {
                errors: err.response?.data.message || err.errors
            } : {
                message: err.response?.data.message || err.message
            }
    );

    return error;
}

const setError = (status: number, message: string | string[]): object => {
    return { status, message };
}


export { formatDbError, requestErrorFormat, setError }