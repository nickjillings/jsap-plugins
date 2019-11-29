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
        root.GainPlugin = loader(root.JSAP);
    }
})(this, function(JSAP) {
    var PeakingFilter = function (factory, owner) {

        // This attaches the base plugin items to the Object
        JSAP.BasePlugin.call(this, factory, owner);

        /* USER MODIFIABLE BEGIN */
        // Only modify between this line and the end of the object!

        var inputNode = this.context.createGain(),
            outputNode = this.context.createGain(),
            filter = this.context.createBiquadFilter();

        filter.type = "peaking";

        inputNode.connect(filter);
        filter.connect(outputNode);

        var frequency = this.parameters.createNumberParameter("frequency", 1000, 10, 20000);
        var gain = this.parameters.createNumberParameter("gain", 0, -24, +24);
        var Q = this.parameters.createNumberParameter("Q", 1.414, 0.1, +12);

        frequency.bindToAudioParam(filter.frequency);
        gain.bindToAudioParam(filter.gain);
        Q.bindToAudioParam(filter.Q);

        this.addInput(inputNode);
        this.addOutput(outputNode);
    };

    // Also update the prototype function here!
    PeakingFilter.prototype = Object.create(JSAP.BasePlugin.prototype);
    PeakingFilter.prototype.constructor = PeakingFilter;
    PeakingFilter.prototype.name = "PeakingFilter";
    PeakingFilter.prototype.version = "1.0.0";
    PeakingFilter.prototype.uniqueID = "JSHP";
    return PeakingFilter;
});
