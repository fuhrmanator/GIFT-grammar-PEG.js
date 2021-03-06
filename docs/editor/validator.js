/*jshint esversion: 6 */
$(document).ready(function() {

    var isDirty = false;
    var sampleGift = "//-----------------------------------------//\n// Examples from gift/format.php.\n//-----------------------------------------//\n\nWho's buried in Grant's tomb?{~Grant ~Jefferson =no one}\n\nGrant is {~buried =entombed ~living} in Grant's tomb.\n\nGrant is buried in Grant's tomb.{FALSE}\n\nWho's buried in Grant's tomb?{=no one =nobody}\n\nWhen was Ulysses S. Grant born?{#1822:5}\n\nMatch the following countries with their corresponding capitals. {\n    =Canada -> Ottawa\n    =Italy  -> Rome\n    =Japan  -> Tokyo\n    =India  -> New Delhi\n    ####It's good to know the capitals\n}\n\n//-----------------------------------------//\n// More complicated examples.\n//-----------------------------------------//\n\n::Grant's Tomb::Grant is {\n        ~buried#No one is buried there.\n        =entombed#Right answer!\n        ~living#We hope not!\n} in Grant's tomb.\n\nDifficult multiple choice question.{\n        ~wrong answer           #comment on wrong answer\n        ~%50%half credit answer #comment on answer\n        =full credit answer     #well done!}\n\n::Jesus' hometown (Short answer ex.):: Jesus Christ was from {\n        =Nazareth#Yes! That's right!\n        =%75%Nazereth#Right, but misspelled.\n        =%25%Bethlehem#He was born here, but not raised here.\n}.\n\n//this comment will be ignored by the filter\n::Numerical example::\nWhen was Ulysses S. Grant born? {#\n        =1822:0      #Correct! 100% credit\n        =%50%1822:2  #He was born in 1822.\n                    You get 50% credit for being close.\n}";

    window.onbeforeunload = function (evt) {
        if (isDirty) {
            return 'If you continue your changes will not be saved.';
        }
    };

    var parseTimer = null;
    var parser = null;

    var ta = document.getElementById('gift');

    var editor = CodeMirror.fromTextArea(ta, {
        lineNumbers: true,
        // styleActiveLine: true,
        // styleActiveSelected: true,
        mode: "text/plain",
        gutters: ["CodeMirror-linenumbers", "guttererrormarker"]
    });


    var errorMark = null;

    var oldInput = null;

    function setParser(p) {
        parser = p;
    }

    function buildErrorMessage(e) {
        // todo: add line squiggles in CodeMirror : https://stackoverflow.com/questions/41405016/how-to-underline-errors-with-codemirror
        return e.location !== undefined ?
            "Line " + e.location.start.line + ", column " + e.location.start.column + ": " + e.message :
            e.message;
    }

    function parse() {
        // oldInput = $("#gift").val();
        oldInput = editor.getValue();

        $("#gift").removeAttr("disabled");
        $("#parse-message").attr("class", "alert alert-info").text("Parsing the input...");
        $("#output").val('Output not available.');

        var result;

        try {
            var output = parser.parse(oldInput);

            $("#parse-message")
                .attr("class", "alert alert-success")
                .text("GIFT input parsed successfully!");
            $("#output").removeClass("disabled").val(jsDump.parse(output));
            result = true;
        } catch (e) {
            $("#parse-message").attr("class", "alert alert-warning").text(buildErrorMessage(e));
            var loc = e.location;
            var from = {line: loc.start.line-1, ch: loc.start.column-1 - (loc.start.offset === loc.end.offset)};
            var to = {line: loc.end.line-1, ch: loc.end.column-1};
            // console.log(from);
            // console.log(to);
            errorMark = editor.markText(from, to, {className:'syntax-error', title: e.message /*.replace(/"/g, '&quot;') */});
            errorGutter = editor.setGutterMarker(loc.start.line-1, "guttererrormarker", makeMarker());
            result = false;
        } finally {
            doLayout();
        }

        return result;
    }

    function makeMarker() {
        var marker = document.createElement("div");
        marker.style.color = "#822";
        marker.innerHTML = "❌";
        return marker;
      }

    function clearErrors () {
        if (errorMark !== null) {
            errorMark.clear();
            errorMark = null;
        }
        editor.clearGutter("guttererrormarker");
    }

    function scheduleParse() {
        // console.log("scheduleParse");
        if (editor.getValue() === oldInput) { 
            // console.log("no change detected"); 
            return; 
        }

        isDirty = true;
        clearErrors();

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
        // $("#gift").height(($(".container").innerHeight() - 145) + "px");
        $(".CodeMirror").height(($(".CodeMirror").parent().parent().parent().innerHeight() - 145) + "px");
        $("#output").height(($(".CodeMirror").height()) + "px");
        editor.refresh();
    }

    function doneLoadingGrammar()
    {
        var grammar = this.response;
        var parser = peg.generate(grammar);
        setParser(parser);
        parse();
    }
    
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();   // fetch doesn't work on old iPads because it's not supported in old Safari
    xmlhttp.addEventListener("load", doneLoadingGrammar, false);
    xmlhttp.open("GET","https://raw.githubusercontent.com/fuhrmanator/GIFT-grammar-PEG.js/master/GIFT.pegjs",true);
    xmlhttp.send();

    editor.setValue(sampleGift);

    $("#gift").removeAttr("disabled");

    $(window).resize(doLayout);
    editor.on("change", scheduleParse);
    editor.focus();

});
