import { Schema } from "mongoose"

export interface Role{
    name: string
}

export interface User{
    name: String,
    email: String,
    password: String,
    role: [
        {
            type: Schema.Types.ObjectId,
            ref: String
        }
    ]
}