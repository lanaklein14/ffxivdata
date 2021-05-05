const HuntnetProxy = require('../lib/huntnetProxy');

const log4js = require('log4js');
log4js.configure({
    appenders: {
        console: { type: 'console' },
        logfile: { type: 'file', filename: './logs/debug.log' },
    },
    categories: { default: { appenders: ['console', 'logfile'], level: 'debug' } }
});

//main
(async () => {
    //const userInfo = await UserInfo.generate();
    //console.log(JSON.stringify(userInfo));
    const huntnetProxy = new HuntnetProxy();
    //console.log(huntnetProxy._mobs);

    const world = huntnetProxy._worlds.find(w => w.id == 47);
    const cache = huntnetProxy.logsCache(world.id);
    console.log(cache);
    await cache.update();
    console.log(cache);
    

//    const userInfo = new UserInfo("c7c065ac-41cf-4050-b4f1-6ebb993ea9ba", 1849232016);
//    console.log(userInfo);
//    const touchedInfo = await userInfo.touch();
//    console.log(touchedInfo);

})()