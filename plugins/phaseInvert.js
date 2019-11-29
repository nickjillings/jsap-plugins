/*globals BasePlugin */
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
    var PhaseInvert = function (factory, owner) {
        /*
            Each plugin is passed two arguments on construction:
                1 - > Factory: The factory that built this plugin
                2 - > Owner: The SubFactory that this plugin is registered too (if given)
        */

        // This attaches the base plugin items to the Object
        JSAP.BasePlugin.call(this, factory, owner);

        /* USER MODIFIABLE BEGIN */
        // Only modify between this line and the end of the object!

        var node = this.context.createGain();
        var phase_parameter = this.parameters.createSwitchParameter("Phase", 0, 0, 1);
        phase_parameter.trigger = function () {
            if (phase_parameter.value === 1) {
                node.gain.value = -1.0;
            } else {
                node.gain.value = 1.0;
            }
        };

        // Set the gain node as the input point. All connections to the plugin are made
        // to this node.
        this.addInput(node);
        // Set the gain node as the output point. All connections from the plugin are
        // made from this node
        this.addOutput(node);
        /* USER MODIFIABLE END */
    };

    // Also update the prototype function here!
    PhaseInvert.prototype = Object.create(JSAP.BasePlugin.prototype);
    PhaseInvert.prototype.constructor = PhaseInvert;
    PhaseInvert.prototype.name = "PhaseInvert";
    PhaseInvert.prototype.version = "1.0.0";
    PhaseInvert.prototype.uniqueID = "JSPH";
    return PhaseInvert;
});
