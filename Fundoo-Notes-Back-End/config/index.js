/*************************************************************************
* Purpose : Index Configuration setup is required to run your server.
*
* @file : index.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 06/02/2021
*
**************************************************************************/

let config;

/**
 * @description It return true if the current system is production
 * @param {*} config
 */
const isProduction = config => {
    return config.name == 'production';
};

/**
 * @description It return true if the current system is production
 * @param {*} config
 */
const isDevelopement = config => {
	return config.name == 'development';
};

// Combine all the require config files.
const envConfig = {
    production() {
        return require('./production')(config);
    },
    development() {
        return require('./development')(config);
    }
};

/**
 * @description Set the config.
 * @param {Object} obj
 */
const setConfig = obj => {
    config = obj;
};

// Return the config.
getConfig = () => this.config;

/**
 *  @exports : Exports the Config Environment based Configuration
 */
module.exports = {
    set: (env, _app) => {
        if (config == null) {
            this.config = typeof envConfig[env] !== 'undefined' ? envConfig[env]() : envConfig.development();
            this.config.app = _app;
            this.config.isProduction = isProduction(this.config);
            this.config.isDevelopment = isDevelopement(this.config);
            this.ename = this.config.name ? this.config.name : '';
            //this.config.domainURL = getDomainURL(this);
        }
        setConfig(this.config);
       // return config;
    },
    get: () => getConfig()
}
