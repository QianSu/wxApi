import mongoose from 'mongoose'
mongoose.Promise = global.Promise;
import config from '../config'
import fs from 'fs'
import {resolve} from 'path'
const models=resolve(__dirname,'../database/schema')

fs.readdirSync(models)
.filter(file=>~file.search(/^[^\.].*js$/))
.forEach(file=>require(resolve(models,file)))

export const database=app=>{
    mongoose.set('debug',true)

    mongoose.connect(config.db,{useMongoClient:true})
    mongoose.connection.on('disconnected',()=>{
        mongoose.connect(config.db,{useMongoClient:true})
    })
    mongoose.connection.on('error',err=>{
        console.error(err)
    })
    mongoose.connection.on('open',async=>{
        console.log('connected to MongoDB',config.db)
    })

}