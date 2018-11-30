let env = process.env;

export default {
    port: env.PORT || 3000,
    mongoUri: "mongodb://0.0.0.0:27017/games"
};