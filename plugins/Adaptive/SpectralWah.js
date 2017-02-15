/*globals BasePlugin */
/*
    SpectralWah
    An adaptive Wah-Wah effect
*/
var SpectralWah = function (factory, owner) {
    /* 
        Each plugin is passed two arguments on construction:
            1 - > Factory: The factory that built this plugin
            2 - > Owner: The SubFactory that this plugin is registered too (if given)
    */

    // This attaches the base plugin items to the Object
    BasePlugin.call(this, factory, owner);

    /* USER MODIFIABLE BEGIN */
    // Only modify between this line and the end of the object!

    // The current web audio API context is available to the plugin through the this.context object
    // We are using it to create a web audio API gain node.
    var filter = this.context.createBiquadFilter();
    filter.type = "peaking";
    filter.Q.value = 2.0;
    filter.gain.value = 24;
    var input = this.context.createGain(),
        output = this.context.createGain();

    input.connect(filter);
    filter.connect(output);

    this.onloaded = function () {
        var plugin_index = this.owner.getPluginIndex(this.pluginInstance);

        // Register the Features:
        var request = {
            "outputIndex": 0,
            "frameSize": 512,
            "features": [{
                "name": "spectrum",
                "features": [{
                    "name": "spectral_centroid"
            }]
        }]
        };
        if (plugin_index === 0) {
            this.featureMap.Receiver.requestFeaturesFromPlugin(this.owner.featureSender, request);
        } else {
            this.featureMap.Receiver.requestFeaturesFromPlugin(this.owner.getPlugins()[plugin_index - 1], request);
        }
    };

    this.onunloaded = function () {
        this.featureMap.Receiver.cancelAllFeatures();
    };

    // Create the function for the callback and setting the filter:
    function updateFrequency(f) {
        // y[n] = x[n]*(1-a) + y[n-1]*(a);
        // This can be called to update the filter information
        // First, check the number we are getting is valid
        if (!isFinite(f)) {
            return;
        }
        var a = 0.9;
        // Ensure it fits within some sensible bounds
        f = Math.min(f, 5000);
        f = Math.max(f, 100);
        // Apply to the filter
        f = f * (1 - a) + filter.frequency.value * a;
        filter.frequency.value = f;
    }

    this.featureMap.onfeatures = function (message) {
        // Get the results of each channel, for simplicity we will assume a mono system
        var channelresults = message.features.results;
        var spectral_centroid = channelresults[0].spectrum.spectral_centroid;
        // Now some processing
        updateFrequency(Number(spectral_centroid));
    };

    // Set the gain node as the input point. All connections to the plugin are made
    // to this node.
    this.addInput(input);
    // Set the gain node as the output point. All connections from the plugin are
    // made from this node
    this.addOutput(output);
    /* USER MODIFIABLE END */
};

// Also update the prototype function here!
SpectralWah.prototype = Object.create(BasePlugin.prototype);
SpectralWah.prototype.constructor = SpectralWah;
SpectralWah.prototype.name = "SpectralWah";
SpectralWah.prototype.version = "1.0.0";
SpectralWah.prototype.uniqueID = "JSPW";
