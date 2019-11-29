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
    var HardClipping = function (factory, owner) {
        // This attaches the base plugin items to the Object
        JSAP.BasePlugin.call(this, factory, owner);

        /* USER MODIFIABLE BEGIN */

        // Place your code between this line...
        var drive = this.context.createGain(),
            waveshaper = this.context.createWaveShaper(),
            output = this.context.createGain();

        drive.connect(waveshaper);
        waveshaper.connect(output);
        this.addInput(drive);
        this.addOutput(output);

        this.onloaded = function () {};

        function calculateWaveform() {
            var N = 1025,
                curve = new Float32Array(N),
                T = threshParam.value,
                n;
            for (n = 0; n < N; n++) {
                var K = (N - 1) / 2;
                var k = (n - K) / K;
                if (Math.abs(k) >= T) {
                    if (k < 0) {
                        curve[n] = -T;
                    } else {
                        curve[n] = T;
                    }
                } else {
                    curve[n] = k;
                }
            }
            waveshaper.curve = curve;
            waveshaper.oversample = "4x";
        }


        var threshParam = this.parameters.createNumberParameter("Thresh", 1, 0, 1);
        threshParam.trigger = function () {
            calculateWaveform();
        };
        var outputParam = this.parameters.createNumberParameter("Output", 0, -24, 24);
        outputParam.update = function (v) {
            return Math.pow(10, v / 20.0);
        };
        outputParam.translate = function (v) {
            return 20.0 * Math.log10(v);
        };
        outputParam.bindToAudioParam(output.gain);


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
    HardClipping.prototype = Object.create(JSAP.BasePlugin.prototype);
    HardClipping.prototype.constructor = HardClipping;
    HardClipping.prototype.name = "Hard Clipping";
    HardClipping.prototype.version = "1.0.0";
    HardClipping.prototype.uniqueID = "JSHC";
    return HardClipping;
});
