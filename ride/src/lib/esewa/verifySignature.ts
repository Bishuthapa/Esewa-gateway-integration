import CryptoJS from 'crypto-js';


/*
@params message
@return
*/

export function generateEsewaSignature(message : string) : string {

    const secretKey = process.env.ESEWA_SECREAT_KEY;

    if(!secretKey){
        throw new Error('Missing esewa ESEWA_SECREAT_KEY in enviroment variable');
    }
    
    return CryptoJS.HmacSHA256(message, secretKey).toString(CryptoJS.enc.Base64);
}