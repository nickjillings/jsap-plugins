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
        root.SoftClipping = loader(root.JSAP);
    }
})(this, function(JSAP) {
    var SoftClipping = function (factory, owner) {
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

        this.onloaded = function () {
            if (waveshaper.curve) {
                return;
            }
            var N = 1025,
                curve = new Float32Array(N);
            for (var n = 0; n < N; n++) {
                var k = (n - 1024) / 1024;
                curve[n] = Math.cos(k * Math.PI);
            }
            waveshaper.curve = curve;
            waveshaper.oversample = "4x";
        };


        var driveParam = this.parameters.createNumberParameter("Drive", 0, -6, 24);
        driveParam.update = function (v) {
            return Math.pow(10, v / 20.0);
        };
        driveParam.translate = function (v) {
            return 20.0 * Math.log10(v);
        };
        driveParam.bindToAudioParam(drive.gain);
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
    SoftClipping.prototype = Object.create(JSAP.BasePlugin.prototype);
    SoftClipping.prototype.constructor = SoftClipping;
    SoftClipping.prototype.name = "Soft Clipping";
    SoftClipping.prototype.version = "1.0.0";
    SoftClipping.prototype.uniqueID = "JSSC";
    return SoftClipping;
});
