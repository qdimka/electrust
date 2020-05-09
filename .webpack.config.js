module.exports = config => {

    console.log(config);

    config.target = 'electron-renderer';
    return config;
};