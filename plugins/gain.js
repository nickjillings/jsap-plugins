var GainPlugin = function (owner) {
    var _inputList = [];
    var _outputList = [];
    var _parameters = [];
    var _features = [];
    var _owner = owner;
    /* USER MODIFIABLE BEGIN */
    // Place your code between these lines

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

    _parameters.push(gain_parameter);
    _inputList[0] = node;
    _outputList[0] = node;
    /* USER MODIFIABLE END */
    (function () {
        var i;
        for (i = 0; i < _outputList.length; i++) {
            var node = this.context.createAnalyser();
            _features.push(node);
            _outputList[i].connect(node);
        }
    })();

    Object.defineProperty(this, "numInputs", {
        get: function () {
            return _inputList.length;
        },
        set: function () {
            console.error("Cannot set the number of inputs of BasePlugin");
        }
    })
    Object.defineProperty(this, "numOutputs", {
        get: function () {
            return _outputList.length;
        },
        set: function () {
            console.error("Cannot set the number of outputs of BasePlugin");
        }
    })
    Object.defineProperty(this, "numParameters", {
        get: function () {
            return _parameters.length;
        },
        set: function () {
            console.error("Cannot set the number of parameters of BasePlugin");
        }
    })

    Object.defineProperty(this, "owner", {
        get: function () {
            return _owner;
        },
        set: function (owner) {
            if (typeof owner == "object") {
                _owner = owner;
            }
            return _owner;
        }
    })

    Object.defineProperty(this, "inputs", {
        get: function (index) {
            return _inputList;
        },
        set: function () {
            console.error("Illegal attempt to modify BasePlugin");
        }
    })

    Object.defineProperty(this, "outputs", {
        get: function (index) {
            return _outputList;
        },
        set: function () {
            console.error("Illegal attempt to modify BasePlugin");
        }
    })

    Object.defineProperty(this, "features", {
        get: function (index) {
            return _features;
        },
        set: function () {
            console.error("Illegal attempt to modify BasePlugin");
        }
    })

    Object.defineProperty(this, "parameters", {
        get: function (index) {
            return _parameters;
        },
        set: function () {
            console.error("Illegal attempt to modify BasePlugin");
        }
    })
}

GainPlugin.prototype = new BasePlugin(context);
GainPlugin.prototype.name = "Gain";
GainPlugin.prototype.constructor = GainPlugin;
