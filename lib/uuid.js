const b2h = ((i, n, a) => {
    while (i < n) {
        a[i] = (i++ + 0x100).toString(16).substr(1);
    }
    return a
})(0, 256, []);

const h2b = ((b2h, h2b) => {
    b2h.forEach(function (h, i) {
        h2b[h] = i;
    });
    return h2b;
})(b2h, {});

const regexp = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})-([a-f0-9]{2})([a-f0-9]{2})-([a-f0-9]{2})([a-f0-9]{2})-([a-f0-9]{2})([a-f0-9]{2})-([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/;

class UUID {

    constructor(bytes) {
        this.bytes = bytes;
    }

    get string() {
        return this.toString();
    }

    get ellipsis() {
        return this.string.split(/-/).slice(0, 2).join("-") + "-...";
    }

    toJSON() {
        return this.toString();
    }

    toString() {
        if (this._string) {
            return this._string;
        }
        const ba = new Uint8Array(this.bytes);
        let i = 0;
        const s =   b2h[ba[i++]] + b2h[ba[i++]] +
                    b2h[ba[i++]] + b2h[ba[i++]] + "-" +
                    b2h[ba[i++]] + b2h[ba[i++]] + "-" +
                    b2h[ba[i++]] + b2h[ba[i++]] + "-" +
                    b2h[ba[i++]] + b2h[ba[i++]] + "-" +
                    b2h[ba[i++]] + b2h[ba[i++]] +
                    b2h[ba[i++]] + b2h[ba[i++]] +
                    b2h[ba[i++]] + b2h[ba[i++]];
        return this._string = s;
    }

    equals(target) {
        const a = new Uint8Array(this.bytes);
        const b = new Uint8Array(target.bytes);
        for (let i = 0; i < 16; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        } 
        return true;
    }

    writeToBuffer(buf, offset) {
        const from = new Uint8Array(this.bytes);
        const to = new Uint8Array(buf, offset);
        const len = from.length;
        for (let i = 0; i < len; i++) {
            to[i] = from[i];
        }
    }

    static parse(str) {
        let ba = new Uint8Array(16);
        const md = str.toLowerCase().match(regexp);
        if (md === null) {
            throw (`invalid uuid string. ${str}`);
        }
        for (let i = 0; i < 16; i++) {
            ba[i] = h2b[md[i + 1]];
        }
        return new UUID(ba.buffer);
    }
}

module.exports = UUID;