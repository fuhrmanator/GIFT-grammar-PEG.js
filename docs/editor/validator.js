/*jshint esversion: 6 */
$(document).ready(function() {

    var isDirty = false;
    var sampleGift = "//-----------------------------------------//\n// Examples from gift/format.php.\n//-----------------------------------------//\n\nWho's buried in Grant's tomb?{~Grant ~Jefferson =no one}\n\nGrant is {~buried =entombed ~living} in Grant's tomb.\n\nGrant is buried in Grant's tomb.{FALSE}\n\nWho's buried in Grant's tomb?{=no one =nobody}\n\nWhen was Ulysses S. Grant born?{#1822:5}\n\nMatch the following countries with their corresponding capitals. {\n    =Canada -> Ottawa\n    =Italy  -> Rome\n    =Japan  -> Tokyo\n    =India  -> New Delhi\n    ####It's good to know the capitals\n}\n\n//-----------------------------------------//\n// More complicated examples.\n//-----------------------------------------//\n\n::Grant's Tomb::Grant is {\n        ~buried#No one is buried there.\n        =entombed#Right answer!\n        ~living#We hope not!\n} in Grant's tomb.\n\nDifficult multiple choice question.{\n        ~wrong answer           #comment on wrong answer\n        ~%50%half credit answer #comment on answer\n        =full credit answer     #well done!}\n\n::Jesus' hometown (Short answer ex.):: Jesus Christ was from {\n        =Nazareth#Yes! That's right!\n        =%75%Nazereth#Right, but misspelled.\n        =%25%Bethlehem#He was born here, but not raised here.\n}.\n\n//this comment will be ignored by the filter\n::Numerical example::\nWhen was Ulysses S. Grant born? {#\n        =1822:0      #Correct! 100% credit\n        =%50%1822:2  #He was born in 1822.\n                    You get 50% credit for being close.\n}";

    window.onbeforeunload = function (evt) {
        if (isDirty) {
            return 'If you continue your changes will not be saved.';
        }
    }

    var parseTimer = null;
    var parser = null;

    /* load the grammar and generate a parser */
    fetch('../../GIFT.pegjs')
        .then(response => response.text())
        .then(grammar => {
            // console.log(grammar);
            var parser = peg.generate(grammar);
            setParser(parser);
            // console.log(parser.parse("hello {}"));
            parse(); // safe to call when promise is done
        });

    var oldInput = null;

    function setParser(p) {
        parser = p;
    }

    function buildErrorMessage(e) {
        return e.location !== undefined ?
            "Line " + e.location.start.line + ", column " + e.location.start.column + ": " + e.message :
            e.message;
    }

    function parse() {
        oldInput = $("#gift").val();

        $("#gift").removeAttr("disabled");
        $("#parse-message").attr("class", "alert alert-info").text("Parsing the input...");
        $("#output").val('Output not available.');

        var result;

        try {
            var output = parser.parse($("#gift").val());

            $("#parse-message")
                .attr("class", "alert alert-success")
                .text("GIFT input parsed successfully!");
            $("#output").removeClass("disabled").val(jsDump.parse(output));
            result = true;
        } catch (e) {
            $("#parse-message").attr("class", "alert alert-warning").text(buildErrorMessage(e));

            result = false;
        } finally {
            doLayout();
        }

        return result;
    }

    function scheduleParse() {
        // console.log("scheduleParse");
        if ($("#gift").val() === oldInput) { 
            // console.log("no change detected"); 
            return; 
        }

        isDirty = true;

        $("#parse-message").attr("class", "alert alert-info").text("Waiting...");

        if (parseTimer !== null) {
            clearTimeout(parseTimer);
            parseTimer = null;
        }

        parseTimer = setTimeout(function() {
            // parser loads asynchronously
            if (parser !== null) {
                // console.log("calling parse from timeout");
                parse();
            } else console.log("parser was null...");
            parseTimer = null;
        }, 500);
    }

    function doLayout() {
        $("#gift").height(($(".container").innerHeight() - 145) + "px");
        $("#output").height(($("#gift").height()) + "px");
    }

    $("#gift").val(sampleGift);
    // JQuery numberedTextarea
    $("#gift").numberedtextarea( {allowTabChar:true});  // not all options work when passed, modify the .css
    $(window).resize(doLayout);

    // $("#loader").hide();
    // $("#content").show();

    $("#gift").removeAttr("disabled");

    // $("#giftForm").areYouSure();

    $("#gift")
    .change(scheduleParse)
    .mousedown(scheduleParse)
    .mouseup(scheduleParse)
    .click(scheduleParse)
    .keydown(scheduleParse)
    .keyup(scheduleParse)
    .keypress(scheduleParse);

});