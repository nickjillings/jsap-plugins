/*globals BasePlugin */
/*
    HelloWorld Gain
    This is a simple gain node with only one input and output block and one parameter
    The parameter is a gain in dB.
*/
(function(root, loader) {
    if (typeof define === "function" && define.amd) {
        define(["JSAP"], loader);
    } else if (typeof module == "object" && module.exports) {
        module.exports = loader(require("JSAP"));
    } else {
        if (root === undefined) {
            root = window;
        }
        root.GainPlugin = loader(root.JSAP);
    }
})(this, function(JSAP) {
    var GainPlugin = function (factory, owner) {
        /*
            Each plugin is passed two arguments on construction:
                1 - > Factory: The factory that built this plugin
                2 - > Owner: The SubFactory that this plugin is registered too (if given)
        */

        // This attaches the base plugin items to the Object
        JSAP.BasePlugin.call(this, factory, owner);

        /* USER MODIFIABLE BEGIN */
        // Only modify between this line and the end of the object!

        // The current web audio API context is available to the plugin through the this.context object
        // We are using it to create a web audio API gain node.
        var node = this.context.createGain();

        // This defines a new parameter. The arguments passed are, in order:
        // Name, Default value, minimum and maximum values
        // Parameters are exposed by default
        var gain_parameter = this.parameters.createNumberParameter("gain", 0, -12, 12);

        // Attaching some number conversions on the parameter to shift between dB and linear gains
        gain_parameter.translate = function (e) {
            return 20.0 * Math.log10(e);
        };
        gain_parameter.update = function (e) {
            return Math.pow(10, e / 20.0);
        };

        // Binding the parameter to the Web Audio API gain nodes' gain parameter
        gain_parameter.bindToAudioParam(node.gain);

        // Set the gain node as the input point. All connections to the plugin are made
        // to this node.
        this.addInput(node);
        // Set the gain node as the output point. All connections from the plugin are
        // made from this node
        this.addOutput(node);
        /* USER MODIFIABLE END */
    };

    // Also update the prototype function here!
    GainPlugin.prototype = Object.create(JSAP.BasePlugin.prototype);
    GainPlugin.prototype.constructor = GainPlugin;
    GainPlugin.prototype.name = "Gain";
    GainPlugin.prototype.version = "1.0.0";
    GainPlugin.prototype.uniqueID = "JSGN";
    return GainPlugin;
});
