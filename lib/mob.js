class Mob {
    constructor(
        id, 
        rank, 
        name_ja, 
        name_en, 
        respawn_min, 
        respawn_max, 
        scale, 
        zone) {
        Object.assign(this, {id, rank, name_ja, name_en, respawn_min, respawn_max, scale, zone});
    }
}

module.exports = Mob;