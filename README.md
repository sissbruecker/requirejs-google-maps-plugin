Problem
=======

Loading the Google Maps API is an asynchronous process which means the API is not defined after you have loaded the initial script. Instead you have to provide a reference to a callback function in the scripts URL that the API will call after it has finished loading:

*HTML*
```html
<script src="http://maps.googleapis.com/maps/api/js?key={your-api-key}&callback=onMapsLoaded"></script>
```

*JS*
```javascript
    onMapsLoaded = function() {
        console.log('Google Maps API is ready');
    }
```

This behaviour is not supported by the default requirejs loader.

Solution
========

The solution is that the plugin dynamically creates the script tag that loads the Google Maps script and registers said callback function. Only after the callback is executed it tells requirejs that the API is loaded.

Another feature of the plugin is that it also handles the case where the script can not be loaded because no internet connection is available. In this case it fails silently and still tells requirejs that the script was loaded. This means when using this plugin you must check if window.google.maps is defined to find out whether the script was loaded or not.

I got the basic idea for the plugin from @millerdedeiros async plugin (https://github.com/millermedeiros/requirejs-plugins).

Usage
=====

```javascript
require.config({
    paths: {
        'gmaps-plugin': 'require-gmaps-plugin',
        'gmaps-api': 'http://maps.googleapis.com/maps/api/js?key={your-api-key}&sensor=false'
    }
});

require(['gmaps-plugin!gmaps-api'], function() {

    if(window.google && window.google.maps) {
        console.log('Loaded gmaps');
    } else {
        console.log('Error loading gmaps');
    }
});
```