const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const TokenSchema=new mongoose.Schema({
    name:String,
    token:String,
    expire_in:Number,
    meta:{
        createdAt:{
            type:Date,
            default:Date.now()
        },
        updatedAt:{
            type:Date,
            default:Date.now()
        }
    }
})
TokenSchema.pre('save',function (next) {
    console.log(this)
    if(this.isNew){
        this.meta.createdAt=this.meta.updatedAt=Date.now();
    }else{
        this.meta.updatedAt=Date.now();
    }
    next();
})

TokenSchema.statics={
    async getAccessToken(){
        const token=await this.findOne({
            name:'access_token'
        }).exec()
        if(token&&token.token){
            token.access_token=token.token;
        }
        return token
    },
    async saveAccessToken(data){
        let token=await this.findOne({
            name:'access_token'
        }).exec()
        if(token){
            token.token=data.access_token
            token.expire_in=data.expire_in
        }else{
            token=new Token({
                name:'access_token',
                token:data.access_token,
                expires_in:data.expire_in
            })
        }
        try{
            await token.save()
        }catch(e){
            console.log('存储失败')
            console.log(e)
        }
        return data;
    }
}

const Token=mongoose.model('Token',TokenSchema)