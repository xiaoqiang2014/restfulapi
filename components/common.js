const util = require('util');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jwt-simple');
const md5 = require('md5');

const STR_CONNECT = 'mongodb://localhost:27017/backend';
const secret = 'demo';

module.exports = {
    JSONOUT: function () {
        var output = {
            error: false,
            code: 200,
            message: "Bad request",
            key_message: "",
            data: [],
            optional: []
        };
        output.key_message = md5.digest_s(output.message);
        return output;
    },
    mongodb: function () {
        return util.promisify(MongoClient.connect)(STR_CONNECT);
    },
    jwtEncode: function (payload) {
        payload = payload || {};
        payload.exp =  Math.round(Date.now() / 1000 + 5 * 60 * 60);
        payload.iat =Math.round(Date.now() / 1000)
        return jwt.encode(payload, secret);
    },
    jwtDecode: function (token) {
        return jwt.decode(token, secret);
    },
    guid: function () {
        var date = new Date();
        return date.getTime() % 100000000;
    },
    checkPermission: function (token) {
        var data = this.JSONOUT();
        var payload;
        try {
            payload = jwt.decode(token, secret);
        } catch (e) {
            data.error = true;
            data.code = 401;
            data.message = "Invalid token to access the api";
            return Promise.reject(data);
        }

        var self = this;
        return this.mongodb()
            .then(function (db) {
                var collection = db.collection('users');
                return collection.find({ "email": payload.email, "password": payload.password })
                    .toArray(function (err, result) {
                        if (err) {
                            data.error = true;
                            data.message = err.message;
                            data.code = 401;
                            data.data = {};
                            throw data;
                        }

                        if (result.length > 0) {
                            data.error = false;
                            data.code = 200;
                            data.data = result;
                        } else {
                            data.error = true;
                            data.code = 401;
                            data.message = "Invalid token to access the api";
                        }
                        return { data: data, db: db };
                    });
            });
    }
};