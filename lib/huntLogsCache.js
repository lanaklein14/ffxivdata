const UUID = require('./uuid');
const HuntLog = require('./huntLog');
const fetchWrapper = require('./fetchWrapper');
const logger = require('log4js').getLogger();

const BASE_URL = 'https://ffxiv-the-hunt.net/api';

/*
class HuntLogsOldCache {
    constructor(cache) {
        this.mobids = cache.mobids;
        this.mobids.forEach(id => {
            this[id] = cache[id];
        });
        this.diff = {};
        this.eTag = cache.eTag;
    }

    generateDiff(cacheLatest) {
        this.diff = {};
        this.mobids.forEach(id => {
            const logsCurrent = this[id];
            const logsLatest = cacheLatest[id];
            //console.log(`mobid: ${id} => current: ${logsCurrent.length} vs latest: ${logsLatest.length}`)
            this.diff[id] = {
                logsToAdd: logsLatest.filter(logLatest => { return logsCurrent.find(logCurrent => {
                    return logLatest.equals(logCurrent);
                }) == null}),
                logsToRemove: logsCurrent.filter(logCurrent => { return logsLatest.find(logLatest => {
                    return logCurrent.equals(logLatest);
                }) == null})
            };
            // clean up this.diff[id] if empty
            if (this.diff[id].logsToAdd.length == 0 && this.diff[id].logsToRemove.length == 0) {
                delete this.diff[id];
            }
        });
    }
}
*/

class HuntLogsCache {
    constructor(world) {
        this.world = world;
        this.etag = null;
        this.data = null;
        this.timestamp = null;
        this.mobs = null;
    }

    init(etag, data, timestamp) {
        this.etag = etag;
        this.data = data;
        this.timestamp = timestamp;
        this.mobs = null;
    }

    async update() {
        const url = `${BASE_URL}/data/2/world/${this.world.name}`
        const option = {
            method: 'GET'
        }
        if (this.etag) {
            option.headers = { 'If-None-Match': this.etag }
        }

        const response = await fetchWrapper(url, option);
        if (response.status == 304) {
            logger.trace(`${this.world.name} -> no update 304.`);
            return false;
        }
        else {
            let ab = await response.arrayBuffer();
            this.etag = response.headers.get("etag");
            this.data = Buffer.from(ab);
            this.timestamp = new Date();
            this.mobs = null;
            logger.debug(`${this.world.name} -> update with new etag. ${this.etag}`);
            return true;
        }
    }

    getLogs() {
        if (!this.mobs) {
            this.mobs = {};
            // Convert Buffer to ArrayBuffer
            let buf = new ArrayBuffer(this.data.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < this.data.length; ++i) {
                view[i] = this.data[i];
            }
            while (buf.byteLength) {
                const dv = new DataView(buf);
                const mobId = dv.getUint32(0);
                const logLength = dv.getUint32(4);
                let logBuffer = buf.slice(8, 8 + logLength);
                const logs = [];
                while (logBuffer.byteLength > 0) {
                    logs.push(new HuntLog(logBuffer));
                    logBuffer = logBuffer.slice(41);
                }
                buf = buf.slice(8 + logLength);
                if (!this.mobs[mobId]) {
                    this.mobs[mobId] = logs;
                }
            }
        }
        return this.mobs;
    }
}
module.exports = HuntLogsCache;
