const UUID = require('./uuid');

class HuntLog {
    constructor(logBuffer) {
        this.id = new UUID(logBuffer.slice(0, 16));
        this.uid = new UUID(logBuffer.slice(16, 32));
        const dv = new DataView(logBuffer);
        this.instance = dv.getUint8(32) != 0 ? dv.getUint8(32) : 1;
        this.time = dv.getUint32(33) * 1000;
        this.x = dv.getUint8(37);
        this.y = dv.getUint8(38);
        this.score = dv.getUint16(39) / 1000; // +2 -> 41
    }

    equals(target) {
        return this.id.equals(target.id);
    }
}

module.exports = HuntLog;