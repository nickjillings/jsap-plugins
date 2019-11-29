/*globals BasePlugin */
/*
    Amplitude Modulation
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
    var AmplitudeModulation = function (factory, owner) {

        // This attaches the base plugin items to the Object
        JSAP.BasePlugin.call(this, factory, owner);

        /* USER MODIFIABLE BEGIN */
        // Only modify between this line and the end of the object!

        var inputNode = this.context.createGain(),
            outputNode = this.context.createGain(),
            oscil = this.context.createOscillator(),
            oscilAmp = this.context.createGain(),
            mixer = this.context.createGain();

        oscilAmp.gain.value = 0.5;
        mixer.gain.value = 0.5;
        oscil.connect(oscilAmp);
        oscilAmp.connect(mixer.gain);

        inputNode.connect(mixer);
        mixer.connect(outputNode);

        var LFO = this.parameters.createNumberParameter("LFO", 1, 0.1, 10);

        LFO.bindToAudioParam(oscil.frequency);

        var depth = this.parameters.createNumberParameter("depth", 1, 0, 1);
        depth.update = function (e) {
            return e * 0.5;
        };
        depth.translate = function (e) {
            return e * 2;
        };
        depth.bindToAudioParam(oscilAmp.gain);

        oscil.start();

        this.addInput(inputNode);
        this.addOutput(outputNode);
    };

    // Also update the prototype function here!
    AmplitudeModulation.prototype = Object.create(BasePlugin.prototype);
    AmplitudeModulation.prototype.constructor = AmplitudeModulation;
    AmplitudeModulation.prototype.name = "Amplitude Modulation";
    AmplitudeModulation.prototype.version = "1.0.0";
    AmplitudeModulation.prototype.uniqueID = "JSAM";
    return AmplitudeModulation;
});
