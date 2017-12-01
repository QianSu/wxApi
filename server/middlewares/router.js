import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import {signature,redirect,oauth} from '../controllers/wechat'
export const router=app=>{
    const router=new Router()
    router.all('/wechat-hear',wechatMiddle(config.wechat,reply))
    router.get('/wechat-signature',signature)//获取签名算法
    router.get('/wechat-redirect',redirect)//网页授权进行2跳
   // 测试地址http://huangshan.free.ngrok.cc/wechat-redirect?a=1&b=2
    router.get('/wechat-oauth',oauth)//网页授权获取用户信息

    app.use(router.routes(),router.allowedMethods())
}