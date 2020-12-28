/**
 * @description redis cache implementation
 * @method get is used to check for key in the redis
 * @method set is used to set the data if it is not set
 */
const redis = require('redis')
const client = redis.createClient()
const maxAge = 1400

class RedisCache{
    /**
     * @description Get data from redis cache
     * @param userName is holding user emailId 
     */
    get = (userName, callBack) => {
        client.get(`UserDetails: ${userName}`, (error, data) => {
            if(error)
                return callBack(error, null)
            else 
                return callBack(null, data)
        })
    }

    /**
     * @description Set key in redis if not present
     * @param userName is holding user emailId 
     * @var maxAge is the expire time for key
     */
    set = (userName, data) => {
        client.setex(`UserDetails: ${userName}`, maxAge, JSON.stringify(data))
    }
}

module.exports = new RedisCache()
