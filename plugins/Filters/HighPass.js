/*globals BasePlugin */
/*
    HPF
    A 2nd order biquad high pass filter
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
        root.HPF = loader(root.JSAP);
    }
})(this, function(JSAP) {
    var HPF = function (factory, owner) {

        // This attaches the base plugin items to the Object
        JSAP.BasePlugin.call(this, factory, owner);

        /* USER MODIFIABLE BEGIN */
        // Only modify between this line and the end of the object!

        var inputNode = this.context.createGain(),
            outputNode = this.context.createGain(),
            filter = this.context.createBiquadFilter();

        filter.type = "highpass";

        inputNode.connect(filter);
        filter.connect(outputNode);

        var frequency = this.parameters.createNumberParameter("frequency", 1000, 300, 20000);

        frequency.bindToAudioParam(filter.frequency);

        this.addInput(inputNode);
        this.addOutput(outputNode);
    };

    // Also update the prototype function here!
    HPF.prototype = Object.create(JSAP.BasePlugin.prototype);
    HPF.prototype.constructor = HPF;
    HPF.prototype.name = "HPF";
    HPF.prototype.version = "1.0.0";
    HPF.prototype.uniqueID = "JSHP";
    return HPF;
});
