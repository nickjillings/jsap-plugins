/*globals BasePlugin */
/*
    LPF
    A 2nd order biquad low pass filter
*/
var LPF = function (factory, owner) {

    // This attaches the base plugin items to the Object
    BasePlugin.call(this, factory, owner);

    /* USER MODIFIABLE BEGIN */
    // Only modify between this line and the end of the object!

    var inputNode = this.context.createGain(),
        outputNode = this.context.createGain(),
        filter = this.context.createBiquadFilter();

    inputNode.connect(filter);
    filter.connect(outputNode);

    var frequency = this.parameters.createNumberParameter("frequency", 1000, 300, 20000);

    frequency.bindToAudioParam(filter.frequency);

    this.addInput(inputNode);
    this.addOutput(outputNode);
};

// Also update the prototype function here!
LPF.prototype = Object.create(BasePlugin.prototype);
LPF.prototype.constructor = LPF;
LPF.prototype.name = "LPF";
LPF.prototype.version = "1.0.0";
LPF.prototype.uniqueID = "JSLP";
