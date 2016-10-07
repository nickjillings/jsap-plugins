var GainPlugin = function (factory, owner) {
    this.__proto__ = new BasePlugin(factory, owner);

    /* USER MODIFIABLE BEGIN */

    /// IMPORTANT ///
    // Change this to the name of this object
    this.constructor = GainPlugin;

    // This example creates an empty DSP module plugin
    var node = this.context.createGain();

    var gain_parameter = new PluginParameter(0, "number", "gain", -80.0, 12, this);

    gain_parameter.translate = function (e) {
        return 20.0 * Math.log10(e);
    }
    gain_parameter.update = function (e) {
        return Math.pow(10, e / 20.0);
    }

    gain_parameter.bindToAudioParam(node.gain);

    this.parameters.push(gain_parameter);
    this.addInput(node);
    this.addOutput(node);
    /* USER MODIFIABLE END */
    (function () {
        var i;
        for (i = 0; i < this.numOutputs; i++) {
            var node = this.context.createAnalyser();
            this.features.push(node);
            this.outputs[i].connect(node);
        }
    })();
}

// Also update the prototype function here!
GainPlugin.prototype.name = "Gain";
