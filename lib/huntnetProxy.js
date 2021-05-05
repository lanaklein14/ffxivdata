const UserInfo = require('./userInfo');
const CreateReport = require('./createReport');
const DeleteReport = require('./deleteReport');
const HuntLogsCache = require('./huntLogsCache');
const zonesJson = require('../dist/zones.json');

const logger = require('log4js').getLogger()

const BASE_URL = 'https://ffxiv-the-hunt.net/api'

require('tls').DEFAULT_ECDH_CURVE = 'auto'

class HuntnetProxy {
    constructor(userInfo) {
        this._userInfo = userInfo;
        this._worlds = require('../dist/worlds.json');
        this._cache = {};
        for (let world of this._worlds) {
            this._cache[world.id] = new HuntLogsCache(world);
        }
        const knownElements = {};
        this._mobs = [];
        for (let zone of zonesJson) {
            for (let mob of zone.mobs) {
                if (mob.rank == 'S' || mob.rank == 'A') {
                    if (knownElements[mob.id]) {
                        continue;
                    }
                    this._mobs.push(mob);
                    knownElements[mob.id] = true;
                }
            }
            if (zone.mobs2) {
                for (let mob of zone.mobs2) {
                    if (mob.rank == 'SS') {
                        if (knownElements[mob.id]) {
                            continue;
                        }
                        this._mobs.push(mob);
                        knownElements[mob.id] = true;
                    }
                }
            }
            if (zone.fates) {
                for (let mob of zone.fates) {
                    if (knownElements[mob.id]) {
                        continue;
                    }
                    this._mobs.push(mob);
                    knownElements[mob.id] = true;
                }
            }
        }
    }

    logsCache(worldid) {
        return this._cache[worldid];
    }

    async createUser() {
        return await UserInfo.generate()
    }

    async touchUser(id, secret) {
        const userInfo = new UserInfo(id, secret)
        return await userInfo.touch()
    }

    async createReport(
        worldid,
        mobid,
        userid = this._userInfo.id,
        secret = this._userInfo.secret,
        instance = 1,
        time = Date.now(),
        x = 0,
        y = 0) {
        const world = this._worlds.fins(w => w.id == worldid);
        if (!world) {
            throw new Error(`invalid world id ${worldid}.`);
        }
        const mob = this._mobs.find(m => m.id == mobid);
        if (!mob) {
            throw new Error(`invalid mob id ${mobid}.`);
        }
        const scale = mob.rank == 'A' ? 1 : 10;
        const ctime = Date.now();
        const createReport = new CreateReport(
            userid,
            secret,
            worldid,
            mobid,
            instance,
            scale,
            time,
            ctime,
            x,
            y
        );
        return huntlog = await createReport.submit();
    }

    async deleteReport(
        id,
        userid = this._userInfo.id,
        secret = this._userInfo.secret) {
        try {
            const deleteReport = new DeleteReport(
                id,
                userid,
                secret
            );
            const res = await deleteReport.submit()
            return res;
        }
        catch (err) {
            console.log(err)
        }
    }


    /*
    async LoadBlacklist() {
        const data = new ArrayBuffer(20)
        const dv = new DataView(data)
        const userinfo = await LoadOrNewUser()
        userinfo.id.writeToBuffer(data, 0) // +16 -> 16
        dv.setUint32(16, userinfo.secret) // +4 -> 20
    
        const res = await fetch("https://ffxiv-the-hunt.net/api/blacklist/0/load", {
            method: "POST",
            body: data,
        })
    
        AlertIfError(res)
    
        let buf = await res.arrayBuffer()
    
        const uids: UUID[] = []
        if (buf.byteLength % 16 === 0)
            while (buf.byteLength > 0) {
                const id = new UUID(buf.slice(0, 16))
                uids.push(id)
                buf = buf.slice(16)
            }
        return uids
    }
    
    async SaveBlacklist(uids: UUID[]) {
        const data = new ArrayBuffer(20 + uids.length * 16)
        const dv = new DataView(data)
        const userinfo = await LoadOrNewUser()
        userinfo.id.writeToBuffer(data, 0) // +16 -> 16
        dv.setUint32(16, userinfo.secret) // +4 -> 20
        uids.forEach((uid, i) => uid.writeToBuffer(data, 20 + i * 16)) // +16*N
    
        const res = await fetch("https://ffxiv-the-hunt.net/api/blacklist/0/save", {
            method: "POST",
            body: data,
        })
    
        AlertIfError(res)
    }
*/
}

module.exports = HuntnetProxy;