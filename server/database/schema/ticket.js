//微信sdk接入
const mongoose=require('mongoose')

const Schema=mongoose.Scheam;
 const TicketSchema=new mongoose.Schema({
     name:String,
     ticket:String,
     expires_in:Number,
     meta:{
        createdAt:{
             type:Date,
             dafault:Date.now()
         },
         updatedAt:{
             type:Date,
             dafault:Date.now()
         }
     }
 })
 TicketSchema.pre('save',function(next){
     if(this.isNew){
         this.meta.createdAt=this.meta.updatedAt=Date.now()
     }else{
        this.meta.updatedAt=Date.now()
     }
     next()
 })
 TicketSchema.statics={
     async getTicket(){
         const ticket=await this.findOne({
             name:'ticket'
         }).exec()
         if(ticket&&ticket.ticket){
             ticket.ticket=ticket.ticket
         }
         return ticket
     },
     async saveTicket(data){
        let ticket=await this.findOne({
            name:'ticket'
        }).exec()
  
        if(ticket){
            ticket.ticket=data.ticket
            ticket.expires_in=data.expires_in
        }else{
            ticket=new Ticket({
                name:'ticket',
                ticket:data.ticket,
                expires_in:data.expires_in
            })
        }
        try {
            await ticket.save()
          } catch (e) {
            console.log('存储失败')
            console.log(e)
          }
        return data
     }
 }

 const Ticket=mongoose.model('Ticket',TicketSchema)