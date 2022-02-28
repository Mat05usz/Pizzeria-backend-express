import mongoose, {Schema, model} from "mongoose";
import { Role, User } from '../Interfaces/UserInterfaces';

const roleSchema = new Schema<Role>({
    name: {
        type: String,
        required: true
    }
});

const userSchema = new Schema<User>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
});

export const userModel = model<User>('User', userSchema);
export const roleModel = model<Role>('Role', roleSchema);