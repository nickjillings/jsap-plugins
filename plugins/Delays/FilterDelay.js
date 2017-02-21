/*globals BasePlugin */
var FilterDelay = function (factory, owner) {
    // This attaches the base plugin items to the Object
    BasePlugin.call(this, factory, owner);

    /* USER MODIFIABLE BEGIN */

    // Place your code between this line...


    var input = this.context.createGain(),
        output = this.context.createGain(),
        delay = this.context.createDelay(),
        feedback = this.context.createGain(),
        filter = this.context.createBiquadFilter(),
        dry = this.context.createGain(),
        wet = this.context.createGain();

    input.connect(dry);
    dry.connect(output);
    input.connect(delay);
    delay.connect(filter);
    filter.connect(wet);
    filter.connect(feedback);
    feedback.connect(delay);
    wet.connect(output);

    var delayParam = this.parameters.createNumberParameter("Delay", 10, 10, 500);
    delayParam.update = function (e) {
        return e / 1000.0;
    };
    delayParam.translate = function (e) {
        return e * 1000.0;
    };
    delayParam.bindToAudioParam(delay.delayTime);

    var mixParam = this.parameters.createNumberParameter("DryWet", 50, 0, 100);
    mixParam.trigger = function () {

        var g = mixParam.value / 100.0;
        dry.gain.value = 1 - g;
        wet.gain.value = g;
    };

    var feedbackParam = this.parameters.createNumberParameter("FeedbackGain", -12, -40, 0);
    feedbackParam.translate = function (e) {
        return 20.0 * Math.log10(e);
    };
    feedbackParam.update = function (e) {
        return Math.pow(10, e / 20.0);
    };
    feedbackParam.bindToAudioParam(feedback.gain);

    var frequencyParam = this.parameters.createNumberParameter("FilterFrequency", 500, 200, 1000);
    frequencyParam.bindToAudioParam(filter.frequency);

    this.addInput(input);
    this.addOutput(output);

    // ... and this line!
    /* USER MODIFIABLE END */
    (function () {
        var i;
        for (i = 0; i < this.numOutputs; i++) {
            var node = this.context.createAnalyser();
            this.features.push(node);
            this.outputs[i].connect(node);
        }
    })();
};

// Also update the prototype function here!
FilterDelay.prototype = Object.create(BasePlugin.prototype);
FilterDelay.prototype.constructor = FilterDelay;
FilterDelay.prototype.name = "FilterDelay";
FilterDelay.prototype.version = "1.0.0";
FilterDelay.prototype.uniqueID = "JSSD";
