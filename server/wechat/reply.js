
export default async(ctx, next) => {

    const message = ctx.weixin

    let mp = require('../wechat')
    let client = mp.getWechat()
 

    if (message.MsgType == 'event') {
        //  console.log(message.Event)
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫码进来：' + message.EventKey + '' + message.ticket)
            }
            ctx.body = "你是一个有品位的人，才会关注这个公众号！哈哈"
        } else if (message.Event === 'unsubscribe') {
            console.log('取关了')
        } else if (message.Event === 'LOCATION') {
            ctx.body = message.Latitude + ':' + message.Longitude
        } else if (message.Event === 'VIEW') {
            // console.log(message.EventKey+''+message.MenuId)
            // ctx.body=message.EventKey+message.MenuId
        } else if (message.Event === 'pic_weixin') {
            // ctx.body=message.Count+'图片发送的了'
        }
    } else if (message.MsgType === 'text') {
        if (message.Content == '炒饭') {
       
          const data=await client.handle('uploadMaterial','image',__dirname+'./../source/img\/timg.jpg')
        //   console.log(data)
            ctx.body = {
                type:'image',
                mediaId:data.media_id
            }
        } else if (message.Content === '老公') {
            ctx.body = '我爱你哦 宝宝'
        }else if (message.Content === '3') {
          const data=await client.handle('getUserInfo',message.FromUserName)
          const content=JSON.stringify(data)
            ctx.body=content
        }

        //ctx.body = message.Content // 此方法 用于自动回复相同的内容
    } else if (message.MsgType === 'image') {
        ctx.body = {
            type: 'image',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'voice') {
        ctx.body = {
            type: 'voice',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'video') {
        ctx.body = {
            type: message.ThumbMediaId,
            MsgType: 'image',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'location') {
        ctx.body = message.Location_x + ':' + message.Location_y + ':' + Label
    } else if (message.MsgType === 'link') {
        ctx.body = message.title
    }

}