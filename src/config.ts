let env = process.env;

export default {
    port: env.PORT || 8100,
    mongoUri: "mongodb://breiner:muP3htdqo@mongodb-breiner.alwaysdata.net/breiner_site"
    //"mongodb://breiner:haZkdh!7fa$61P00nS.N@mongodb-breiner.alwaysdata.net/breiner_site"


    /*port: env.PORT || 3000,
    mongoUri: "mongodb://0.0.0.0:27017/games"*/
};