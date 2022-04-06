import jwt from "jsonwebtoken";

export function verifyJWT(token: string, secret: string): Promise<string | jwt.JwtPayload | undefined>{

    return new Promise((resolve, reject)=> {
        
        jwt.verify(token, secret, (err, decoded)=>{
            if(err)
            {
                reject(err);
            }
            resolve(decoded);
        })

    })
}