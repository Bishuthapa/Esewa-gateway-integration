import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt : Date
}

const MessageSchema: Schema<Message> = new Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type: Date,
        required :true,
        default: Date.now 

    }

})


export interface User extends Document {
    userName: string;
    email : string;
    password : string;
    verifyedCode: string;
    verifycodeExpiration : Date;
    isVerified : boolean;
    isAcceptingMessages : boolean;
    messages : Message[]
}

const UserSchema: Schema<User> = new Schema({
    userName : {
        type : String,
        required : [true, "userName is required"],
    },
    email : {
        type: String,
        required : [true, "email is required"],
        unique : true,
        match : [/.+@.+\..+/, "Please enter a valid email address"] 

    },

    password : {
        type: String,
        required :true, 
        match: [/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, "Please enter a valid password"]
    },

    verifyedCode : {
        type: String,
        required :[true, "verify code is required"], 

        
    },
    verifycodeExpiration : {
        type: Date,
        required :[true, "verify code expire date is required"], 
        
    },
    
    isVerified : {
        type: Boolean,
        default : false,
        
    },

    isAcceptingMessages : {
        type: Boolean,
        required :true,
    },

    messages :
         [MessageSchema],
    

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;