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
    var StereoDelay = function (factory, owner) {
        // This attaches the base plugin items to the Object
        JSAP.BasePlugin.call(this, factory, owner);

        /* USER MODIFIABLE BEGIN */

        // Place your code between this line...


        var input = this.context.createGain(),
            output = this.context.createGain(),
            csplit = this.context.createChannelSplitter(2),
            cmerge = this.context.createChannelMerger(2),
            delayL = this.context.createDelay(),
            delayR = this.context.createDelay(),
            dry = this.context.createGain(),
            wet = this.context.createGain();

        input.channelCountMode = "explicit";
        input.connect(dry);
        dry.connect(output);
        input.connect(csplit);
        csplit.connect(delayL, 0, 0);
        csplit.connect(delayR, 1, 0);
        delayL.connect(cmerge, 0, 0);
        delayR.connect(cmerge, 0, 1);
        cmerge.connect(wet);
        wet.connect(output);

        var delayParam1 = this.parameters.createNumberParameter("DelayL", 10, 10, 500);
        delayParam1.update = function (e) {
            return e / 1000.0;
        };
        delayParam1.translate = function (e) {
            return e * 1000.0;
        };
        delayParam1.bindToAudioParam(delayL.delayTime);

        var delayParam2 = this.parameters.createNumberParameter("DelayR", 10, 10, 500);
        delayParam2.update = function (e) {
            return e / 1000.0;
        };
        delayParam2.translate = function (e) {
            return e * 1000.0;
        };
        delayParam2.bindToAudioParam(delayR.delayTime);

        var mixParam = this.parameters.createNumberParameter("Dry/Wet", 50, 0, 100);
        mixParam.trigger = function () {

            var g = mixParam.value / 100.0;
            dry.gain.value = 1 - g;
            wet.gain.value = g;
        };

        this.addInput(input);
        this.addOutput(output);

        // ... and this line!
        /* USER MODIFIABLE END */
        (function () {
            var i;
            for (i = 0; i < this.numOutputs; i++) {
                var node = this.context.createAnalyser();
                this.features.push(node);
                this.outputs[i].connect(node);
            }
        })();
    };

    // Also update the prototype function here!
    StereoDelay.prototype = Object.create(JSAP.BasePlugin.prototype);
    StereoDelay.prototype.constructor = StereoDelay;
    StereoDelay.prototype.name = "StereoDelay";
    StereoDelay.prototype.version = "1.0.0";
    StereoDelay.prototype.uniqueID = "JSSD";
    return StereoDelay;
});
