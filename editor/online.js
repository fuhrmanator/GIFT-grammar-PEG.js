/*jshint esversion: 6 */
$(document).ready(function() {
    var KB = 1024;
    var MS_IN_S = 1000;

    var parseTimer = null;


    var parser = null;

    /* load a grammar and generate a parser */
    fetch('../GIFT.pegjs')
        .then(response => response.text())
        .then(grammar => {
            // console.log(grammar);
            var parser = peg.generate(grammar);
            setParser(parser);
            // console.log(parser.parse("hello {}"));
            parse(); // safe to call when promise is done
        });

    var oldGrammar = null;
    var oldParserVar = null;
    var oldOptionCache = null;
    var oldOptionOptimize = null;
    var oldInput = null;

    // var editor = CodeMirror.fromTextArea($("#gift").get(0), {
    //     lineNumbers: true,
    //     mode: "pegjs"
    // });

    function setParser(p) {
        console.log("Setting parser to " + p);
        parser = p;
    }

    function buildSizeAndTimeInfoHtml(title, size, time) {
        return $("<span/>", {
            "class": "size-and-time",
            title: title,
            html: (size / KB).toPrecision(2) + "&nbsp;kB, " +
                time + "&nbsp;ms, " +
                ((size / KB) / (time / MS_IN_S)).toPrecision(2) + "&nbsp;kB/s"
        });
    }

    function buildErrorMessage(e) {
        return e.location !== undefined ?
            "Line " + e.location.start.line + ", column " + e.location.start.column + ": " + e.message :
            e.message;
    }

    function parse() {
        oldInput = $("#gift").val();

        $("#gift").removeAttr("disabled");
        $("#parse-message").attr("class", "message progress").text("Parsing the input...");
        $("#output").addClass("disabled").text("Output not available.");

        try {
            console.log("Trying to parse...");
            var timeBefore = (new Date).getTime();
            var output = parser.parse($("#gift").val());
            var timeAfter = (new Date).getTime();

            $("#parse-message")
                .attr("class", "message info")
                .text("Input parsed successfully.")
                .append(buildSizeAndTimeInfoHtml(
                    "Parsing time and speed",
                    $("#gift").val().length,
                    timeAfter - timeBefore
                ));
            $("#output").removeClass("disabled").text(jsDump.parse(output));

            var result = true;
        } catch (e) {
            $("#parse-message").attr("class", "message error").text(buildErrorMessage(e));

            var result = false;
        }

        doLayout();
        return result;
    }

    function scheduleParse() {
        console.log("scheduleParse");
        console.log($("#gift").val());
        // if ($("#gift").val() === oldInput) { console.log("no change detected"); return; }
        // if (buildAndParseTimer !== null) { return; }

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
        /*
         * This forces layout of the page so that the |#columns| table gets a chance
         * make itself smaller when the browser window shrinks.
         */
        $("#left-column").height("0px"); // needed for IE
        $("#right-column").height("0px"); // needed for IE
        //        $(".CodeMirror").height("0px");
        //        $("#gift").height("0px");

        $("#left-column").height(($("#left-column").parent().innerHeight() - 2) + "px"); // needed for IE
        $("#right-column").height(($("#right-column").parent().innerHeight() - 2) + "px"); // needed for IE
        //        $(".CodeMirror").height(($(".CodeMirror").parent().parent().innerHeight() - 14) + "px");
        // $("#gift").height(($("#gift").parent().parent().parent().innerHeight() - 14) + "px");
    }

    function getGrammar() {
        return editor.getValue();
    }

    // editor.on("change", scheduleParse);

    $("#parser-var, #option-cache, #option-optimize")
        .change(scheduleParse)
        .mousedown(scheduleParse)
        .mouseup(scheduleParse)
        .click(scheduleParse)
        .keydown(scheduleParse)
        .keyup(scheduleParse)
        .keypress(scheduleParse);

    $("#gift")
        .change(scheduleParse)
        .mousedown(scheduleParse)
        .mouseup(scheduleParse)
        .click(scheduleParse)
        .keydown(scheduleParse)
        .keyup(scheduleParse)
        .keypress(scheduleParse);

    // JQuery LinedTextArea
    $("#gift").linedtextarea();
    doLayout();
    $(window).resize(doLayout);

    $("#loader").hide();
    $("#content").show();

    $("#gift, #parser-var, #option-cache, #option-optimize").removeAttr("disabled");

    //    buildAndParse();


    // editor.refresh();
    // editor.focus();
});