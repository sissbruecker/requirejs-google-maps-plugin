/**
 * Created with JetBrains WebStorm.
 * User: Sascha Ißbrücker
 * Date: 30.11.13
 * Time: 11:30
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
define(function () {

    var GOOGLE_MAPS_CALLBACK_PARAM = 'callback';
    var GOOGLE_MAPS_CALLBACK_NAME = '__requirejs_google_maps_callback';

    return {

        load: function (name, req, onLoad, config) {

            // Do nothing in optimizer
            if (config.isBuild) {
                onload(null);
                return;
            }

            // Resolve url from config, or just use name
            var url = (config.paths && config.paths[name]) ? config.paths[name] : name;

            // Add callback parameter that Google Maps script calls when it finished loading
            url += (url.indexOf('?') >= 0 ? '&' : '?') + GOOGLE_MAPS_CALLBACK_PARAM + '=' + GOOGLE_MAPS_CALLBACK_NAME;

            // Register said callback function on window, here we tell require we are finished
            window[GOOGLE_MAPS_CALLBACK_NAME] = function () {
                onLoad();
            };

            // Create script element for loading the Google Maps script
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = url;

            // Add listener for loading errors, in this case we also tell require we are finished
            // This means that code using this plugin has to check by itself if window.google.maps is defined to know if the script was loaded successfully
            s.addEventListener('error', function () {
                onLoad();
            });

            // Add script to DOM
            var t = document.getElementsByTagName('script')[0];
            t.parentNode.insertBefore(s, t);
        }
    };
});