const telegraf = require('telegraf')
const data = require('./data')
const Stage = require('telegraf/stage')
const session = require('telegraf/session')
const Scene = require('telegraf/scenes/base')
const { leave } = Stage
const stage = new Stage()
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
    // const MongoClient = require('mongodb').MongoClient;
    // const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    // const client = new MongoClient(uri, { useNewUrlParser: true });

function send_course(group, ctx) {
    arr = [];
    group.forEach(element => {
        array = [];
        array.push(element.group_id)
        arr.push(array)
    });

    ctx.reply(
        'Выбери группу:', {
            reply_markup: {
                keyboard: arr,
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }

    )

}

Date.prototype.getWeekNumber = function() {
    let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    let dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return week

};



function getWeek() {
    oddeven = new Date().getWeekNumber()
    if (oddeven % 2 == 1) {
        weektype = "нижняя"
            // console.log("нижняя")
        return weektype
    } else {
        weektype = "верхняя"
            // console.log("верхняя")
        return weektype
    }

}

let request = require("request")

let url = "http://raspmath.isu.ru/getSchedule"
const SocksAgent = require('socks5-https-client/lib/Agent');
const socksAgent = new SocksAgent({
    socksHost: '163.172.50.9', // Defaults to 'localhost'.
    socksPort: 22345 // Defaults to 1080.
        // socksHost: data.proxy.host,
        // socksPort: data.proxy.port,
        // socksUsername: data.proxy.login,
        // socksPassword: data.proxy.psswd,
});
const bot = new telegraf(data.token, {
    telegram: { agent: socksAgent }
});

const getGroup = new Scene('getGroup')
stage.register(getGroup)
const getGroupM = new Scene('getGroupM')
stage.register(getGroupM)
const getStage = new Scene('getStage')
stage.register(getStage)
const getSchedule = new Scene('getSchedule')
stage.register(getSchedule)
const getDay = new Scene('getDay')
stage.register(getDay)
const getDayCurr = new Scene('getDayCurr')
stage.register(getDayCurr)
const star = new Scene('star')
stage.register(star)
const sess = new Scene('sess')
stage.register(sess)




bot.use(session())
bot.use(stage.middleware())
    // 221482087
bot.start((ctx) => {
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        // console.log(ctx.from.id)
        const collection = client.db("schedule").collection("users_tg");
        collection.find({ tg_id: `${ctx.from.id}` }).toArray(function(err, results) {
            if (results.length !== 0) {
                ctx.reply(
                    'Выбери день', {
                        reply_markup: {
                            keyboard: [
                                ['📢Распиcание экзаменов'],
                                ['Понедельник', 'Вторник'],
                                ['Среда', 'Четверг'],
                                ['Пятница', 'Суббота'],
                                ['Сменить группу']
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    }

                )

                ctx.scene.enter('getSchedule')
            } else {
                // console.log(ctx.from.id)
                ctx.reply(
                    'Для того чтобы получить расписание нужно указать группу и выбрать день недели', {
                        reply_markup: {
                            keyboard: [
                                ['️🤡Бакалавриат', '🤓Магистратура']
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    }
                )

                ctx.scene.enter('getStage')
            }
        });
        client.close();
    });

})


bot.hears('️◀️ Назад', (ctx) => {
    ctx.reply(
        'Для того чтобы получить расписание нужно указать группу и выбрать день недели', {
            reply_markup: {
                keyboard: [
                    ['️🤡Бакалавриат', '🤓Магистратура']
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }
    )
    ctx.scene.enter('getStage')
})

getStage.hears('️🤡Бакалавриат', async(ctx) => {
    ctx.reply(
        'Осталось выбрать курс и группу', {
            reply_markup: {
                keyboard: [
                    ['️🤡Первач', '🤓Двач'],
                    ['️👽Трич', '😈Форч'],
                    ['◀️ Назад']

                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }

    )
    await ctx.scene.leave('getStage')
    ctx.scene.enter('getGroup')
})


getStage.hears('🤓Магистратура', async(ctx) => {
    ctx.reply(
        'Осталось выбрать курс и группу', {
            reply_markup: {
                keyboard: [
                    ['️🤡Первач', '🤓Двач'],
                    ['◀️ Назад']
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }

    )
    await ctx.scene.leave('getStage')
    ctx.scene.enter('getGroupM')
})

getGroup.hears('◀️ Назад', async(ctx) => {
    ctx.reply(
        'Для того чтобы получить расписание нужно указать группу и выбрать день недели', {
            reply_markup: {
                keyboard: [
                    ['️🤡Бакалавриат', '🤓Магистратура']

                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }

    )
    ctx.scene.enter('getStage')
})
getGroupM.hears('◀️ Назад', async(ctx) => {
    ctx.reply(
        'Для того чтобы получить расписание нужно указать группу и выбрать день недели', {
            reply_markup: {
                keyboard: [
                    ['️🤡Бакалавриат', '🤓Магистратура']

                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }

    )
    ctx.scene.enter('getStage')
})
getDay.hears('◀️ Назад', async(ctx) => {
    ctx.reply(
        'Для того чтобы получить расписание нужно указать группу и выбрать день недели', {
            reply_markup: {
                keyboard: [
                    ['️🤡Бакалавриат', '🤓Магистратура']

                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }

    )
    ctx.scene.enter('getStage')
})

getGroup.hears('️🤡Первач', async(ctx) => {

    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("schedule").collection("group");
        collection.find({ course: "1" }).toArray(function(err, results) {
            send_course(results, ctx);
        });
        client.close();
    });

    await ctx.scene.leave('getGroup')

    ctx.scene.enter('getDay')

})

getGroupM.hears('️🤡Первач', async(ctx) => {

    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("schedule").collection("group");
        collection.find({ course: "5" }).toArray(function(err, results) {
            send_course(results, ctx);
        });
        client.close();
    });

    await ctx.scene.leave('getGroupM')

    ctx.scene.enter('getDay')

})

getGroup.hears('🤓Двач', async(ctx) => {

    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("schedule").collection("group");
        collection.find({ course: "2" }).toArray(function(err, results) {
            send_course(results, ctx);
        });
        client.close();
    });

    // client.connect(err => {
    //     const collection = client.db("schedule").collection("group");
    //     // perform actions on the collection object

    //     collection.find({ course: "2" }).toArray(function(err, results) {
    //         send_course(results);
    //     });
    //     client.close();
    // });

    await ctx.scene.leave('getGroup')

    ctx.scene.enter('getDay')

})

getGroupM.hears('🤓Двач', async(ctx) => {
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("schedule").collection("group");
        collection.find({ course: "6" }).toArray(function(err, results) {
            send_course(results, ctx);
        });
        client.close();
    });

    await ctx.scene.leave('getGroup')

    ctx.scene.enter('getDay')

})

getGroup.hears('️👽Трич', async(ctx) => {

    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("schedule").collection("group");
        collection.find({ course: "3" }).toArray(function(err, results) {
            send_course(results, ctx);
        });
        client.close();
    });

    await ctx.scene.leave('getGroup')

    ctx.scene.enter('getDay')

})

getGroup.hears('😈Форч', async(ctx) => {

        const MongoClient = require('mongodb').MongoClient;
        const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("schedule").collection("group");
            collection.find({ course: "4" }).toArray(function(err, results) {
                send_course(results, ctx);
            });
            client.close();
        });

        await ctx.scene.leave('getGroup')

        ctx.scene.enter('getDay')

    })
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv.insert( { item: "card", qty: 15 } )
getDay.on('text', async(ctx) => {
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("schedule").collection("users_tg");
        collection.insertOne({ tg_id: `${ctx.from.id}`, group: ctx.message.text })
        client.close();
    });
    // group = ctx.message.text

    ctx.reply(
        'Выбери день', {
            reply_markup: {
                keyboard: [
                    ['📢Распиcание экзаменов'],
                    ['Понедельник', 'Вторник'],
                    ['Среда', 'Четверг'],
                    ['Пятница', 'Суббота'],
                    ['Сменить группу']
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }

    )

    ctx.scene.enter('getSchedule')
})

getSchedule.hears('Сменить группу', (ctx) => {
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("schedule").collection("users_tg");
        collection.deleteOne({ tg_id: `${ctx.from.id}` })
        client.close();
    });
    ctx.session = null
    ctx.reply('Нажми на /start')

})

getSchedule.hears('📢Распиcание экзаменов', async(ctx) => {
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("schedule").collection("users_tg");
        collection.find({ tg_id: `${ctx.from.id}` }).toArray(function(err, results) {

            request({
                url: 'http://raspmath.isu.ru/getSessionSchedule',
                json: true,
            }, async function(err, res, body) {

                const getSession = body.filter(e => e.group_name === results[0].group && e.date !== '').sort(async function(obj1, obj2) {
                    return new Date(obj1.date).getTime() - new Date(obj2.date).getTime();
                    // console.log(new Date(obj1.date).getTime() - new Date(obj2.date).getTime())
                    // console.log()

                })
                getSession.map(e => ctx.reply(`❗${e.date}-${e.time} ${e.subject_name} \n ${e.report_type}`))

            })

        });
        client.close();
    });


})

getSchedule.hears(['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'], async(ctx) => {
    const day = ctx.message.text

    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("schedule").collection("users_tg");
        collection.find({ tg_id: `${ctx.from.id}` }).toArray(function(err, results) {

            request({
                url: 'https://raw.githubusercontent.com/ojenya/tg/master/sevice/schedule_imei.json',
                json: true,
            }, async function(err, res, body) {



                const getSchedule = body.filter(e => e.group_name === results[0].group && e.weekday === day).filter(e => {

                    if (e.week_type === "") {
                        return e
                    }
                    if (e.week_type === getWeek()) {
                        return e
                    }
                }).sort(function(obj1, obj2) {
                    return obj1.pair_start_time - obj2.pair_start_time;
                })
                getSchedule.map(e => ctx.reply(`${e.pair_start_time}-${e.pair_end_time} ${e.subject_name} \n ${e.class_name} ${e.pair_type} `))

            })

        });
        client.close();
    });


    // request({
    //     url: url,
    //     json: true
    // }, async function(error, response, body) {
    //     body.sort(function(obj1, obj2) {
    //         return obj1.pair_start_time - obj2.pair_start_time;
    //     });
    //     if (!error && response.statusCode === 200) {
    //         for (let i = 0; i < body.length; i++) {
    //             if (body[i].group_name === group) {
    //                 if (day === body[i].weekday) {

    //                     var all = ""
    //                     weektype = getWeek();

    //                     if (body[i].week_type === all) {

    // await ctx.reply(body[i].pair_start_time + "-" + body[i].pair_end_time + "\n" + body[i].subject_name + " " + "\n" + body[i].pair_type + "\n" + body[i].class_name + "\n" + body[i].week_type + "\n")

    //                     } else if (body[i].week_type === weektype) {
    //                         await ctx.reply(body[i].pair_start_time + "-" + body[i].pair_end_time + "\n" + body[i].subject_name + " " + "\n" + body[i].pair_type + "\n" + body[i].class_name + "\n" + body[i].week_type + "\n")
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // })
    // ctx.scene.enter('getSchedule')
})

bot.command('kp', async(ctx) => {
    for (let key of data.admins) {
        bot.telegram.sendMessage(
            key,
            `Новый запрос от преподавателя! \n\nID: [${ctx.from.id}](tg://user?id=${ctx.from.id})`, { parse_mode: 'markdown' }
        )
    }
    ctx.session = null
})

bot.command('ks', async(ctx) => {
    ctx.reply("Напиши сообщение для группы")
    ctx.scene.enter('star')
        // for (let key of data.star) {
        // bot.telegram.sendMessage(
        //     key,
        //     `Новый запрос от старосты! \n ${group}
        //     \nID: [${ctx.from.id}](tg://user?id=${ctx.from.id})`, { parse_mode: 'markdown' }
        // )


    // }
    // ctx.reply(`Новый запрос от старосты группы ${group}`, Extra.HTML().markup((m) =>
    //     m.inlineKeyboard([
    //         m.callbackButton('ДА', 'ДА'),
    //         m.callbackButton('НЕТ', 'НЕТ')
    //     ])))
    // ctx.session = null
})
star.on('text', async(ctx) => {
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://j3nqa:093zheka4067@cluster0-ksudn.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const schedule = client.db("schedule")
            // const star = client.db("schedule").collection("star");

        schedule.collection("star").find({ tg_id: `${ctx.from.id}` }).toArray(async function(err, results) {

                if (results[0].group) {

                    let st_group = results[0].group
                        // const collection = client.db("schedule").collection("users_tg");

                    schedule.collection("users_tg").find({ group: `${st_group}` }).toArray(async function(err, res) {

                        // console.log(err)
                        for (let r in res) {

                            await bot.telegram.sendMessage(
                                    res[r].tg_id,
                                    `${ctx.message.text}`, { parse_mode: 'markdown' }
                                )
                                // await ctx.scene.leave('star')

                            ctx.scene.leave()
                        }
                    })

                } else {
                    ctx.reply("Вы не староста")
                }
                await client.close();

                // for (let res in results) {

                //     bot.telegram.sendMessage(
                //             results[res].tg_id,
                //             `${ctx.message.text}`, { parse_mode: 'markdown' }
                //         )
                //         // await ctx.scene.leave('star')

                //     ctx.scene.leave()
                // }
                // for (let key of data.star) {
                //     bot.telegram.sendMessage(
                //             key,
                //             `${ctx.message.text}`, { parse_mode: 'markdown' }
                //         )
                //         // await ctx.scene.leave('star')

                //     ctx.scene.leave()

                // }

            })
            // client.close();
    });

})

bot.startPolling()