const UUID = require('./uuid');
const HuntLog = require('./huntLog');
const fetchWrapper = require('./fetchWrapper');
const logger = require('log4js').getLogger();

const BASE_URL = 'https://ffxiv-the-hunt.net/api';

class CreateReport {
    constructor(userid, secret, worldid, mobid, instance, scale, time, ctime, x, y) {
        this.userid = userid;
        this.secret = secret;
        this.worldid = worldid;
        this.mobid = mobid;
        this.instance = instance;
        this.scale = scale ? scale : 10;
        this.time = time;
        this.ctime = ctime;
        this.x = x;
        this.y = y;
    }

    async submit() {
        const body = new ArrayBuffer(40)
        const dv = new DataView(body)
        const uuid = UUID.parse(this.userid);
        uuid.writeToBuffer(body, 0); // +16 -> 16
        dv.setUint32(16, this.secret); // secret: +4 -> 20
        dv.setUint32(20, this.worldid) // world: +4 -> 24
        dv.setUint32(24, this.mobid) // mob: +4 -> 28
        dv.setUint8(28, this.instance) // instance: +1 -> 29
        dv.setUint8(29, this.scale) // scale: +1 -> 30
        dv.setInt32(30, Math.floor(this.time / 1000)) // time: +4 -> 34
        dv.setInt32(34, Math.floor(this.ctime / 1000)) // client time: +4 -> 38
        dv.setUint8(38, this.x) // x: +1 -> 39
        dv.setUint8(39, this.y) // y: +1 -> 40

        const url = `${BASE_URL}/hunt/2/new`;
        const option = {
            method: 'POST',
            body: body
        };

        const response = await fetchWrapper(url, option);
        const buf = await response.arrayBuffer();

        return new HuntLog(buf);
    }
}

module.exports = CreateReport;