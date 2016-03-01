'use strict';

var async = require('./async');
var http = require('./http').http;
var urlUtils = require('./url-utils');
var utilities = require('./utility-functions');


/**
 * dataSource is a helper object that unifies the way to get data no matter if we have to do a http request of if we
 * already have the data.
 *
 * It ensures that:
 *    - The data is always returned asynchronously
 *    - It always return the same data object
 *
 * @param data {Url|Object} if it is a url the dataSource will do a GET request appending the geo location to get the data the first time is called.
 *                          if it is an object the data will pass the data obj to the cb every time we 'get'
 */
function dataSource(data) {
  var pendingRequests = [];

  if (!data) {
    data = null;
  }

  return {

    /**
     * Getter function to retrieve the data.
     * @param cb {function} to call once the data is ready. We expect a node like function the first arg will be the error or null if there was no problem getting the data
     *                      and the second arg will be the data itself.
     * @returns undefined the data will always be passed to the cb.
     */
    get: function (cb) {
      sanityCheck(cb);

      pendingRequests.push(cb);

      if (utilities.isString(data)) { // it is an URL
        return requestData(data);
      }

      resolvePendingRequests(null, data);

      /*** Local functions ***/
      function sanityCheck(cb) {
        if (!utilities.isFunction(cb)) {
          throw new Error('dataSource Error: on get method, missing callback');
        }
      }

      function requestData(data) {
        var url = data;
        if (pendingRequests.length > 1) {
          return;
        }

        http.get(urlUtils.appendGeolocation(url), function (err, responseData) {
          if (err) {
            return resolvePendingRequests(err, null);
          }

          try {
            data = JSON.parse(responseData);
            return resolvePendingRequests(null, data);
          } catch (e) {
            data = url;
            return resolvePendingRequests(e, null);
          }
        });
      }

      function resolvePendingRequests(error, data) {
        pendingRequests.forEach(function (cb) {
          async.setImmediate(function () {
            cb(error, data);
          });
        });
        pendingRequests.length = 0;
      }
    }
  };
}

module.exports = dataSource;