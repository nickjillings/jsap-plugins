/*globals BasePlugin */

var Compressor = function (factory, owner) {
    /* 
        Each plugin is passed two arguments on construction:
            1 - > Factory: The factory that built this plugin
            2 - > Owner: The SubFactory that this plugin is registered too (if given)
    */

    // This attaches the base plugin items to the Object
    BasePlugin.call(this, factory, owner);

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
        ratioParam = this.parameters.createNumberParameter("Ratio", 2, 1, 20), 
        thresholdParam = this.parameters.createNumberParameter("Thresh", 0, -50, 0), 
        makeUpGainParam = this.parameters.createNumberParameter("Make Up Gain", 0, -20, 20);
    
    // Attaching some number conversions on the parameter to shift between dB and linear gains    
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
    ratioParam.bindToAudioParam(compressor.ratio);
    thresholdParam.bindToAudioParam(compressor.threshold);
    makeUpGainParam.bindToAudioParam(makeUpGain.gain);    
    
};

// Also update the prototype function here!
Compressor.prototype = Object.create(BasePlugin.prototype);
Compressor.prototype.constructor = Compressor;
Compressor.prototype.name = "Compressor";
Compressor.prototype.version = "1.0.0";
Compressor.prototype.uniqueID = "JSCM";