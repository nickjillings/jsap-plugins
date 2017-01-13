/*
    LPF
    A 2nd order biquad low pass filter
*/
var LPF = function (factory, owner) {

    // This attaches the base plugin items to the Object
    this.__proto__ = new BasePlugin(factory, owner);

    /* USER MODIFIABLE BEGIN */
    // Only modify between this line and the end of the object!

    /// IMPORTANT ///
    // Change this to the name of this object
    this.constructor = LPF;

    var inputNode = this.context.createGain(),
        outputNode = this.context.createGain(),
        filter = this.context.createBiquadFilter();

    inputNode.connect(filter);
    filter.connect(outputNode);

    var frequency = this.parameters.createParameter("Number", "frequency", 1000, 300, 20000);

    frequency.bindToAudioParam(filter.frequency);

    this.addInput(inputNode);
    this.addOutput(outputNode);
}

// Also update the prototype function here!
LPF.prototype.name = "LPF";
