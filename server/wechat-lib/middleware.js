import sha1 from 'sha1'
import getRawBody from 'raw-body'
import {
    get
} from 'mongoose';
import * as util from './util';
export default function (opts, reply) {
    return async function wechatMiddle(ctx, next) {
        const token = opts.Token;
        //    console.log(ctx.query);
        const {
            signature,
            echostr,
            timestamp,
            nonce
        } = ctx.query;
        const str = [token, timestamp, nonce].sort().join('');
        const sha = sha1(str);
        // console.log(ctx.method)
        if (ctx.method === 'GET') {
            if (sha === signature) {
                //  console.log(11)
                ctx.body = echostr
            } else {
                ctx.body = 'error'
            }
        } else if (ctx.method === 'POST') {
            if (sha !== signature) {
                ctx.body = 'error'
                return false;
            }
        }

        const data = await getRawBody(ctx.req, {
            length: ctx.length,
            limit: '1mb',
            encoding: ctx.charset
        })
        const content = await util.parseXML(data);

        //    { xml:
        //     { ToUserName: [ 'gh_182ae9ce750c' ],
        //       FromUserName: [ 'oyINo1lAdrF0UDaP8Yct8btmsUck' ],
        //       CreateTime: [ '1511508569' ],
        //       MsgType: [ 'text' ],
        //       Content: [ '111' ],
        //       MsgId: [ '6491879871990998827' ] } }
        const message = util.formatMessage(content.xml) //格式化content
     //   console.log(message)

        ctx.weixin = message
        //获取access_token
        await reply.apply(ctx, [ctx, next])
        const replyBody = ctx.body
        const msg = ctx.weixin
        const xml = util.tpl(replyBody, msg)
        ctx.status = 200
        ctx.type = 'application/xml'
        ctx.body = xml
    }
}