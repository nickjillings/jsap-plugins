/*globals BasePlugin */
var ToneControl = function (factory, owner) {
    // This attaches the base plugin items to the Object
    BasePlugin.call(this, factory, owner);

    /* USER MODIFIABLE BEGIN */

    // Place your code between this line...
    var drive = this.context.createGain(),
        waveshaper = this.context.createWaveShaper(),
        filter = this.context.createBiquadFilter(),
        output = this.context.createGain();

    drive.connect(waveshaper);
    waveshaper.connect(filter);
    filter.connect(output);
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
    var frequency = this.parameters.createNumberParameter("frequency", 1000, 300, 20000);
    frequency.bindToAudioParam(filter.frequency);


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
ToneControl.prototype = Object.create(BasePlugin.prototype);
ToneControl.prototype.constructor = ToneControl;
ToneControl.prototype.name = "Tone Clipping";
ToneControl.prototype.version = "1.0.0";
ToneControl.prototype.uniqueID = "JSTC";
