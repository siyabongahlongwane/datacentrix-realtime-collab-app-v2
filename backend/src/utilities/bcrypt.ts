import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string | unknown> => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err: unknown, hash: string) => {
            if (err) {
                reject(err);
            }
            resolve(hash);
        }
        )
    })
}

const comparePasswords = (password: string, hash: string): Promise<string | unknown> => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }
        )
    })
}

export { hashPassword, comparePasswords };