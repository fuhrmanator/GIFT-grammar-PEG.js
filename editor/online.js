/*jshint esversion: 6 */
$(document).ready(function() {

    var parseTimer = null;
    var parser = null;

    /* load the grammar and generate a parser */
    fetch('../GIFT.pegjs')
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
        console.log("Setting parser to " + p);
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
                .text("Input parsed successfully.");
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
        console.log("scheduleParse");
        if ($("#gift").val() === oldInput) { console.log("no change detected"); return; }

        if (parseTimer !== null) {
            clearTimeout(parseTimer);
            parseTimer = null;
        }

        parseTimer = setTimeout(function() {
            // parser loads asynchronously
            if (parser !== null) {
                console.log("calling parse from timeout");
                parse();
            } else console.log("parser was null...");
            parseTimer = null;
        }, 500);
    }

    function doLayout() {
        $("#gift").height(($(".container").innerHeight() - 140) + "px");
        $("#output").height(($("#gift").height()) + "px");
    }

    // JQuery numberedTextarea
    $("#gift").numberedtextarea();  // options don't work when passed, modify the .css
    $(window).resize(doLayout);

    $("#loader").hide();
    $("#content").show();

    $("#gift").removeAttr("disabled");

    $("#gift")
    .change(scheduleParse)
    .mousedown(scheduleParse)
    .mouseup(scheduleParse)
    .click(scheduleParse)
    .keydown(scheduleParse)
    .keyup(scheduleParse)
    .keypress(scheduleParse);

});