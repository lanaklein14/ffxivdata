const UUID = require('./uuid');
const fetchWrapper = require('./fetchWrapper');
const logger = require('log4js').getLogger();

const BASE_URL = 'https://ffxiv-the-hunt.net/api';

class UserInfo {
    constructor(id, secret) {
        this.id = id;
        this.secret = secret;
    }

    static async generate() {
        const url = `${BASE_URL}/user/1/new`;
        const option = {
            method: 'POST'
        };
        const response = await fetchWrapper(url, option);
        const buf = await response.arrayBuffer();
        const dv = new DataView(buf);
        const id = (new UUID(buf.slice(0, 16))).toString();
        const secret = dv.getUint32(16);
        return new UserInfo(id, secret);
    }

    async touch() {
        const body = new ArrayBuffer(20);
        const uuid = UUID.parse(this.id);
        const dv = new DataView(body);
        uuid.writeToBuffer(body, 0);
        dv.setUint32(16, this.secret);

        const url = `${BASE_URL}/user/1/touch`;
        const option = {
            method: 'POST',
            body: body
        };
        const response = await fetchWrapper(url, option);
        
        const buf = await response.arrayBuffer();
        if (buf.byteLength > 0) {
            // buf returns new user (length>0) if auth failed.
            const dv = new DataView(buf);
            const id = (new UUID(buf.slice(0, 16))).toString()
            const secret = dv.getUint32(16)
            return new UserInfo(id, secret)
        }
        return this
    }
}

module.exports = UserInfo