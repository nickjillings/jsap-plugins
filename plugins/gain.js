/*
    HelloWorld Gain
    This is a simple gain node with only one input and output block and one parameter
    The parameter is a gain in dB.
*/
var GainPlugin = function (factory, owner) {
    /* 
        Each plugin is passed two arguments on construction:
            1 - > Factory: The factory that built this plugin
            2 - > Owner: The SubFactory that this plugin is registered too (if given)
    */

    // This attaches the base plugin items to the Object
    this.__proto__ = new BasePlugin(factory, owner);

    /* USER MODIFIABLE BEGIN */
    // Only modify between this line and the end of the object!

    /// IMPORTANT ///
    // Change this to the name of this object
    this.constructor = GainPlugin;

    // The current web audio API context is available to the plugin through the this.context object
    // We are using it to create a web audio API gain node.
    var node = this.context.createGain();

    // This defines a new parameter. The arguments passed are, in order:
    // Data Type, Name, Default value, minimum and maximum values
    // Parameters are exposed by default
    var gain_parameter = this.parameters.createParameter("Number", "gain", 0, -12, 12)

    // Attaching some number conversions on the parameter to shift between dB and linear gains
    gain_parameter.translate = function (e) {
        return 20.0 * Math.log10(e);
    }
    gain_parameter.update = function (e) {
        return Math.pow(10, e / 20.0);
    }

    // Binding the parameter to the Web Audio API gain nodes' gain parameter
    gain_parameter.bindToAudioParam(node.gain);

    // Set the gain node as the input point. All connections to the plugin are made
    // to this node.
    this.addInput(node);
    // Set the gain node as the output point. All connections from the plugin are
    // made from this node
    this.addOutput(node);
    /* USER MODIFIABLE END */
}

// Also update the prototype function here!
GainPlugin.prototype.name = "Gain";
