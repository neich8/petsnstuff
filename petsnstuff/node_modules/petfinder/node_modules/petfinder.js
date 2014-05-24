var http = require("http");
var url = require("url");

var _ = require("lodash");

exports.petfinder = petfinder;

/**
 * @constructor
 * Our simple petfinder class. For more information on the Petfinder API and all
 * of its options, see http://www.petfinder.com/developers/api-docs
 *
 * The following usage restrictions apply to users of the API:
 * - Total requests per day: 10,000
 * - Records per request: 1,000
 * - Maximum records per search: 2,000
 * 
 * @param  {String} key Your Petfinder API key. For more information, see
 * http://www.petfinder.com/developers/api-key
 * @return {Object} A petfinder instance.
 */
function petfinder(key) {
    var self = this;
    self.KEY = key;

    /**
     * @private
     * Internal method which merges the supplied object with a default set of
     * HTTP request parameters for the Petfinder API.
     * 
     * @param {Object} opts The object to merge into our default set of HTTP 
     * request variables.
     * @return {Object} The merged default and supplied objects.
     */
    self._httpOptions = function (opts) {
        var defaultOpts = {
            "protocol": "http:",
            "host": "api.petfinder.com",
            "query": {
                "format": "json",
                "key": self.KEY
            }
        };
        // Seems underscore.js/lodash don't really handle nested object
        // merging too well, so lets merge the nested query objects ourselves.
        _.defaults(defaultOpts.query, opts.query);
        _.defaults(defaultOpts, opts);
        return defaultOpts;
    };

    /**
     * @private
     * Internal method which creates an HTTP GET request from the supplied URL
     * object and calls the specified callback function with the chunked data as
     * a JSON object.
     * 
     * @param {Object} options The URL object to pass to the `http.get()` 
     * method.
     * @param {Function} callback The callback function to call with the JSON
     * output from the HTTP request.
     */
    self._httpGet = function (options, callback) {
        var uri = url.format(options);
        http.get(uri, function (res) {
            var data = "";
            res.on("data", function (chunk) {
                // Save the chunked data (as a string) to the data variable.
                data += chunk.toString();
            });
            res.on("end", function () {
                // Convert the data string to a JSON object and pass it to the
                // specified callback function.
                callback(JSON.parse(data));
            });
        });
    };

    self.breed = {
        /**
         * The "/breed.list" route. This route calls the Petfinder "/breed.list"
         * API to query for a list of dogs.
         *
         * @param {Function} callback The callback function to call once the
         * list of animals has been received from the Petfinder API.
         */
        list: function (callback) {
            var options = self._httpOptions({
                "pathname": "/breed.list",
                "query": {
                    "animal": "dog"
                }
            });

            // Invoke the HTTP GET request and call the specified callback when
            // finished.
            self._httpGet(options, callback);
        }
    };

    self.pet = {
        // "/pet.find"
        /**
         * The "/pet.find" route. This route calls the Petfinder "/pet.find" API
         * to find dogs for the specified zip-code.
         * 
         * @param {Number} location The zip-code to search.
         * @param {Object} opts An object containing a bunch of optional
         * arguments to send to the "/pet.find" request.
         * @param {Function} callback The callback function to call after we
         * get a response from the HTTP GET request.
         */
        find: function (location, opts, callback) {
            var options = self._httpOptions({
                "pathname": "/pet.find",
                "query": {
                    "animal": "dog",
                    "location": location
                }
            });

            opts = opts || {};

            // Merge the optional `opts` in to the `options.query` object.
            _.extend(options.query, opts);

            // Invoke the HTTP GET request and call the specified callback when
            // finished.
            self._httpGet(options, callback);
        },

        /**
         * The "/pet.get" route. This route calls the Petfinder "/pet.get" API 
         * to get the pet with a specified `id`.
         * 
         * @param {Number} id The id of the animal that we want to get info for.
         * @param {Function} callback The callback function to call after we
         * get a response from the HTTP GET request. 
         */
        get: function (id, callback) {
            var options = self._httpOptions({
                "pathname": "/pet.get",
                "query": {
                    "id": id
                }
            });

            // Invoke the HTTP GET request and call the specified callback when
            // finished.
            self._httpGet(options, callback);
        },

        /**
         * The "/pet.getRandom" route. This route calls the Petfinder 
         * "/pet.getRandom" API to get a random dog and return its basic info.
         *
         * @param {Function} callback The callback function to call after we
         * get a response from the HTTP GET request.
         */
        getRandom: function (callback) {
            var options = self._httpOptions({
                "pathname": "/pet.getRandom",
                "query": {
                    "animal": "dog",
                    "output": "basic"
                }
            });

            // Invoke the HTTP GET request and call the specified callback when
            // finished.
            self._httpGet(options, callback);
        }
    };
}