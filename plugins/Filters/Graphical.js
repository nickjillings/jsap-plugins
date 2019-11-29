/*globals BasePlugin */
/*
    GraphicalEQ
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
    var GraphicalEQ = function (factory, owner) {
        /*
            Each plugin is passed two arguments on construction:
                1 - > Factory: The factory that built this plugin
                2 - > Owner: The SubFactory that this plugin is registered too (if given)
        */

        // This attaches the base plugin items to the Object
        JSAP.BasePlugin.call(this, factory, owner);

        /* USER MODIFIABLE BEGIN */
        // Only modify between this line and the end of the object!

        var input = this.context.createGain();
        var output = this.context.createGain();

        // Create a bunch of filter nodes
        var filters = [],
            N = 10,
            i;

        for (i = 0; i < N; i++) {
            filters[i] = new PeakingFilter(factory, this);
            var f = 20.0 * Math.pow(2, i);
            filters[i].parameters.parameters.frequency.value = f;
            filters[i].parameters.parameters.Q.value = 1.414;
            var g = this.parameters.createNumberParameter(f.toFixed(2) + "Hz", 0, -12, +12);
            g.bindToAudioParam(filters[i].parameters.parameters.gain);
        }

        for (i = 0; i < N - 1; i++) {
            filters[i].getOutputs()[0].connect(filters[i + 1].getInputs()[0]);
        }
        input.connect(filters[0].getInputs()[0]);
        filters[N - 1].getOutputs()[0].connect(output);

        this.addInput(input);
        this.addOutput(output);

        /* USER MODIFIABLE END */
    };

    // Also update the prototype function here!
    GraphicalEQ.prototype = Object.create(JSAP.BasePlugin.prototype);
    GraphicalEQ.prototype.constructor = GraphicalEQ;
    GraphicalEQ.prototype.name = "GraphicalEQ";
    GraphicalEQ.prototype.version = "0.0.0";
    GraphicalEQ.prototype.uniqueID = "GREQ";
    GraphicalEQ.prototype.resources = [{
        'url': "plugins/Filters/peaking.js",
        'type': "javascript",
        'test': function () {
            return typeof PeakingFilter === "function";
        }
    }];
    return GraphicalEQ;
});
