/*globals BasePlugin */
/*
    MultibandCompressor
*/
var MultibandCompressor = function (factory, owner) {

    // This attaches the base plugin items to the Object
    BasePlugin.call(this, factory, owner);

    /* USER MODIFIABLE BEGIN */
    // Only modify between this line and the end of the object!

    var input = this.context.createGain(),
        output = this.context.createGain();

    var filters = [];
    filters[0] = this.context.createBiquadFilter();
    filters[1] = this.context.createBiquadFilter();

    filters[0].type = "lowpass";
    filters[1].type = "highpass";

    var compressors = [],
        compressorPrototype = factory.getPrototypes().find(function (a) {
            return a.name == "Compressor" && a.uniqueID == "JSCM";
        });
    if (compressorPrototype === undefined) {
        throw ("Compressor JSAP plugin, JSCM, not loaded!");
    }
    compressors[0] = new compressorPrototype.proto(factory, this);
    compressors[1] = new compressorPrototype.proto(factory, this);

    input.connect(filters[0]);
    input.connect(filters[1]);
    filters[0].connect(compressors[0].getInputs()[0]);
    filters[1].connect(compressors[1].getInputs()[0]);
    compressors[0].getOutputs()[0].connect(output);
    compressors[1].getOutputs()[0].connect(output);

    this.addInput(input);
    this.addOutput(output);

    // Create the parameters
    var inputGainParam = this.parameters.createNumberParameter("Input gain", 0, -20, 20),
        attackParam = this.parameters.createNumberParameter("Attack", 0.3, 0, 1),
        releaseParam = this.parameters.createNumberParameter("Release", 0.25, 0, 1),
        ratioParam = this.parameters.createNumberParameter("Ratio", 2, 1, 30),
        thresholdParam = this.parameters.createNumberParameter("Threshold", 0, -50, 0),
        kneeParam = this.parameters.createNumberParameter("Knee", 0, 0, 40),
        makeUpGainParam = this.parameters.createNumberParameter("Make Up Gain", 0, -20, 20),
        filterParam = this.parameters.createNumberParameter("X-Over", 1000, 100, 5000);

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

    inputGainParam.bindToAudioParam(input.gain);
    makeUpGainParam.bindToAudioParam(output.gain);
    attackParam.trigger = function () {
        compressors[0].parameters.getParameterByName("Attack").value = attackParam.value;
        compressors[1].parameters.getParameterByName("Attack").value = attackParam.value;
    };
    releaseParam.trigger = function () {
        compressors[0].parameters.getParameterByName("Release").value = releaseParam.value;
        compressors[1].parameters.getParameterByName("Release").value = releaseParam.value;
    };
    ratioParam.trigger = function () {
        compressors[0].parameters.getParameterByName("Ratio").value = ratioParam.value;
        compressors[1].parameters.getParameterByName("Ratio").value = ratioParam.value;
    };
    thresholdParam.trigger = function () {
        compressors[0].parameters.getParameterByName("Thresh").value = thresholdParam.value;
        compressors[1].parameters.getParameterByName("Thresh").value = thresholdParam.value;
    };
    kneeParam.trigger = function () {
        compressors[0].parameters.getParameterByName("Knee").value = kneeParam.value;
        compressors[1].parameters.getParameterByName("Knee").value = kneeParam.value;
    };
    filterParam.trigger = function () {
        filters[0].frequency.value = filterParam.value;
        filters[1].frequency.value = filterParam.value;
    }

    /* USER MODIFIABLE END */
};

// Also update the prototype function here!
MultibandCompressor.prototype = Object.create(BasePlugin.prototype);
MultibandCompressor.prototype.constructor = MultibandCompressor;
MultibandCompressor.prototype.name = "MultibandCompressor";
MultibandCompressor.prototype.version = "0.0.1";
MultibandCompressor.prototype.uniqueID = "MBCP";
