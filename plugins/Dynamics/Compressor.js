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
        root.Compressor = loader(root.JSAP);
    }
})(this, function(JSAP) {
    var Compressor = function (factory, owner) {
        /*
            Each plugin is passed two arguments on construction:
                1 - > Factory: The factory that built this plugin
                2 - > Owner: The SubFactory that this plugin is registered too (if given)
        */

        // This attaches the base plugin items to the Object
        JSAP.BasePlugin.call(this, factory, owner);

        /* USER MODIFIABLE BEGIN */


        // Create 2 gain nodes and a compressor node
        var inputGain = this.context.createGain(),
            compressor = this.context.createDynamicsCompressor(),
            makeUpGain = this.context.createGain();

        // Connect all of the nodes together
        inputGain.connect(compressor);
        compressor.connect(makeUpGain);
        this.addInput(inputGain);
        this.addOutput(makeUpGain);

        // Create the parameters
        var inputGainParam = this.parameters.createNumberParameter("Input gain", 0, -20, 20),
            attackParam = this.parameters.createNumberParameter("Attack", 0.3, 0, 1),
            releaseParam = this.parameters.createNumberParameter("Release", 0.25, 0, 1),
            ratioParam = this.parameters.createNumberParameter("Ratio", 2, 1, 30),
            thresholdParam = this.parameters.createNumberParameter("Thresh", 0, -50, 0),
            kneeParam = this.parameters.createNumberParameter("Knee", 0, 0, 40),
            makeUpGainParam = this.parameters.createNumberParameter("Make Up Gain", 0, -20, 20);

        // convert between dB and lin for I/O gains
        function linTodB(e) {
            return 20.0 * Math.log10(e);
        }
        function dBToLin(e) {
            return Math.pow(10, e / 20.0);
        }
        inputGainParam.translate = linTodB;
        inputGainParam.update = dBToLin;
        makeUpGainParam.translate = linTodB;
        makeUpGainParam.update = dBToLin;

        // Bind the parameters to the web audio node params
        inputGainParam.bindToAudioParam(inputGain.gain);
        attackParam.bindToAudioParam(compressor.attack);
        releaseParam.bindToAudioParam(compressor.release);
        ratioParam.bindToAudioParam(compressor.ratio);
        thresholdParam.bindToAudioParam(compressor.threshold);
        kneeParam.bindToAudioParam(compressor.knee);
        makeUpGainParam.bindToAudioParam(makeUpGain.gain);

    };

    // Also update the prototype function here!
    Compressor.prototype = Object.create(JSAP.BasePlugin.prototype);
    Compressor.prototype.constructor = Compressor;
    Compressor.prototype.name = "Compressor";
    Compressor.prototype.version = "1.0.0";
    Compressor.prototype.uniqueID = "JSCM";
    return Compressor;
});
