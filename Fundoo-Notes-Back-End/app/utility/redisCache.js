/*************************************************************************
* Purpose : implementing redis cache
*
* @file : redisCache.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const redis = require('redis');
const client = redis.createClient();
const config = require('../../config').get();
const { logger } = config;
const maxAge = 1400;

class RedisCache {
    /**
     * @description Get data from redis cache
     * @param userName is holding user emailId 
     */
    get = (inputData, callBack) => {
        client.get(inputData, (error, data) => {
            if (error) {
                logger.error('Error while retrieving data from redis cache');
                return callBack(error, null);
            }
            else
                return callBack(null, data);
        });
    }

    /**
     * @description Set key in redis if not present
     * @param userName is holding user emailId 
     * @var maxAge is the expire time for key
     */
    set = (userName, key, data) => {
        logger.info('Setting data to redis cache');
        client.setex(`${key} ${userName}`, maxAge, JSON.stringify(data));
    }
}

module.exports = new RedisCache();
