const appConfig={};

appConfig.port=3000;
appConfig.allowedCorsOrigin="*";
appConfig.env="dev";
appConfig.db={
    uri: 'mongodb://localhost:27017/testDatabase'
}
appConfig.apiVersion='/api/v1';

module.exports={
    port:appConfig.port,
    allowedCorsOrigin:appConfig.allowedCorsOrigin,
    env:appConfig.env,
    db:appConfig.db,
    apiVersion:appConfig.apiVersion
};
