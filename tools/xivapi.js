const log4js = require('log4js')
const fs = require('fs')
const XIVAPI = require('xivapi-js')
const datacenters = require('../data/datacenters.json')
const zones = require('../data/zones.json')
const regions = require('../data/regions.json')

log4js.configure({
    appenders: {
        console: { type: 'console' },
        logfile: { type: 'file', filename: './logs/debug.log' },
    },
    categories: { default: { appenders: ['console', 'logfile'], level: 'debug' } }
})
const logger = log4js.getLogger()

const xiv = new XIVAPI()

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const outDcAndWorlds = async (dcNames) => {
    const worldList = await xiv.data.list('World', { columns: "ID,Name", limit: 1000 })
    const datacenterList = await xiv.data.datacenters()
    const outWorlds = []
    const outDcs = {}
    Object.entries(datacenterList).filter(
        ([name]) => dcNames.includes(capitalize(name))
    ).forEach(
        ([name, worldNames]) => {
            outDcs[name] = []
            worldNames.forEach(worldName => {
                const world = worldList.Results.find(w => w.Name === worldName);
                outWorlds.push({
                    id: world.ID,
                    name: world.Name,
                    dc: name
                })
                outDcs[name].push({
                    id: world.ID,
                    name: world.Name
                })
            })
        }
    )
    fs.writeFileSync('./dist/worlds.json', JSON.stringify(outWorlds, null, 2));
    logger.debug('out file => ./dist/worlds.json');
    fs.writeFileSync('./dist/datacenters.json', JSON.stringify(outDcs, null, 2));
    logger.debug('out file => ./dist/datacenters.json');
}

const outMessages = async (zones, regions) => {
    const messages = {
        ja: { mob: {}, zone: {}, region: {} },
        en: { mob: {}, zone: {}, region: {} },
        fr: { mob: {}, zone: {}, region: {} },
        de: { mob: {}, zone: {}, region: {} }
    }

    for (region of regions) {
        const key = region.key
        messages.ja.region[String(key)] = region.name_ja
        messages.en.region[String(key)] = region.name_en
        messages.fr.region[String(key)] = region.name_fr
        messages.de.region[String(key)] = region.name_de
    }

    for (zone of zones) {
        const res = await xiv.data.get('PlaceName', zone.id)
        const id = res.Maps[0].TerritoryTypeTargetID
        //zone.url = ('' + res.Maps[0].MapFilename)

        messages.ja.zone[String(id)] = res.Name_ja
        messages.en.zone[String(id)] = res.Name_en
        messages.fr.zone[String(id)] = res.Name_fr
        messages.de.zone[String(id)] = res.Name_de

        logger.debug(`zone ${id} - ${zone.id} -> ${res.Name_ja}`)

        for (mob of zone.mobs) {
            if (messages.ja.mob[String(mob.id)]) {
                continue
            }
            const res = await xiv.data.get('BNpcName', mob.id)
            messages.ja.mob[String(mob.id)] = res.Name_ja
            messages.en.mob[String(mob.id)] = res.Name_en
            messages.fr.mob[String(mob.id)] = res.Name_fr
            messages.de.mob[String(mob.id)] = res.Name_de

            logger.debug(`mob ${mob.id} -> ${res.Name_ja}`)
        }

        if (zone.mobs2) {
            for (mob of zone.mobs2) {
                if (messages.ja.mob[String(mob.id)]) {
                    continue
                }
                const res = await xiv.data.get('BNpcName', mob.id)
                messages.ja.mob[String(mob.id)] = res.Name_ja
                messages.en.mob[String(mob.id)] = res.Name_en
                messages.fr.mob[String(mob.id)] = res.Name_fr
                messages.de.mob[String(mob.id)] = res.Name_de

                logger.debug(`mob ${mob.id} -> ${res.Name_ja}`)
            }
        }

        if (zone.fates) {
            for (mob of zone.fates) {
                if (messages.ja.mob[String(mob.id)]) {
                    continue
                }
                const res = await xiv.data.get('BNpcName', mob.id)
                messages.ja.mob[String(mob.id)] = res.Name_ja
                messages.en.mob[String(mob.id)] = res.Name_en
                messages.fr.mob[String(mob.id)] = res.Name_fr
                messages.de.mob[String(mob.id)] = res.Name_de

                logger.debug(`mob ${mob.id} -> ${res.Name_ja}`)
            }
        }        
    }

    fs.writeFileSync('./dist/messages.json', JSON.stringify(messages, null, 2));
    logger.debug('out file => ./dist/messages.json');
}

//main
(async function () {
    await outDcAndWorlds(datacenters)
    await outMessages(zones, regions)
}())
