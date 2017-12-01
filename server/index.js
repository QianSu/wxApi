import Koa from 'koa'
import config from './config' 
import R from 'ramda'
import {resolve} from 'path'
const r=path=>resolve(__dirname,path)
const host=process.env.host||'127.0.0.1'
const port=process.env.PORT|| 3006
import serve  from 'koa-static'
const MIDDLEWARES=['database','router'];

class Server {
    constructor(){
        this.app=new Koa();
        this.useMiddleWares(this.app)(MIDDLEWARES);
    }
    useMiddleWares(app){
        return R.map(R.compose(
            R.map(i=>i(app)),
            require,
            i=>`${r('./middlewares')}/${i}`
        ))
        
    }
    async start(){
        this.app.use(serve(__dirname + '/static'));
        this.app.use(async(ctx)=>{
            ctx.body='你好！世界'
        })
        this.app.listen(port,host)
        console.log('正在运行'+host+':'+port)

    }
}
const app=new Server();

app.start();