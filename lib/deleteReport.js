const UUID = require('./uuid');
const fetchWrapper = require('./fetchWrapper');
const logger = require('log4js').getLogger();

const BASE_URL = 'https://ffxiv-the-hunt.net/api';

class DeleteReport {
    constructor(id, userid, secret) {
        this.id = id;
        this.userid = userid;
        this.secret = secret;
    }

    async submit() {
        const body = new ArrayBuffer(36);
        const dv = new DataView(body);
        const uuid = UUID.parse(this.userid);
        const loguuid = UUID.parse(this.id);
        uuid.writeToBuffer(body, 0); // +16 -> 16
        dv.setUint32(16, this.secret); // secret: +4 -> 20
        loguuid.writeToBuffer(body, 20); // +16 -> 36

        const url = `${BASE_URL}/hunt/0/delete`;
        const option = {
            method: 'POST',
            body: body
        };

        const response = await fetchWrapper(url, option);
        logger.debug('response', reponse);

        return response;
    }

}

module.exports = DeleteReport;