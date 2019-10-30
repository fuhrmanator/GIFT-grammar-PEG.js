/*jshint esversion: 6 */
var giftEditor;
var pagePrefix;

$(document).ready(function() {

    pagePrefix = window.location.protocol + "//" + window.location.host + window.location.pathname + "?text=";
    var isDirty = false;
    var sampleGift = "//-----------------------------------------//\n// Examples from gift/format.php.\n//-----------------------------------------//\n\nWho's buried in Grant's tomb?{~Grant ~Jefferson =no one}\n\nGrant is {~buried =entombed ~living} in Grant's tomb.\n\nGrant is buried in Grant's tomb.{FALSE}\n\nWho's buried in Grant's tomb?{=no one =nobody}\n\nWhen was Ulysses S. Grant born?{#1822:5}\n\nMatch the following countries with their corresponding capitals. {\n    =Canada -> Ottawa\n    =Italy  -> Rome\n    =Japan  -> Tokyo\n    =India  -> New Delhi\n    ####It's good to know the capitals\n}\n\n//-----------------------------------------//\n// More complicated examples.\n//-----------------------------------------//\n\n::Grant's Tomb::Grant is {\n        ~buried#No one is buried there.\n        =entombed#Right answer!\n        ~living#We hope not!\n} in Grant's tomb.\n\nDifficult multiple choice question.{\n        ~wrong answer           #comment on wrong answer\n        ~%50%half credit answer #comment on answer\n        =full credit answer     #well done!}\n\n::Jesus' hometown (Short answer ex.):: Jesus Christ was from {\n        =Nazareth#Yes! That's right!\n        =%75%Nazereth#Right, but misspelled.\n        =%25%Bethlehem#He was born here, but not raised here.\n}.\n\n//this comment will be ignored by the filter\n::Numerical example::\nWhen was Ulysses S. Grant born? {#\n        =1822:0      #Correct! 100% credit\n        =%50%1822:2  #He was born in 1822.\n                    You get 50% credit for being close.\n}";

    var parseTimer = null;
    var parser = null;

    initExamplesDropdown();

    var ta = document.getElementById('gift');

    var editor = CodeMirror.fromTextArea(ta, {
        lineNumbers: true,
        // styleActiveLine: true,
        // styleActiveSelected: true,
        mode: "text/plain",
        gutters: ["CodeMirror-linenumbers", "guttererrormarker"]
    });

    giftEditor = editor;

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
        $("#parse-message").attr("class", "alert alert-info d-print-none").text("Parsing the input...");
        $("#output").val('Output not available.');

        var result;

        try {
            var output = parser.parse(oldInput);

            $("#parse-message")
                .attr("class", "alert alert-success d-print-none")
                .text("GIFT input parsed successfully!");
//                $("#output").removeClass("disabled").val(jsDump.parse(output));
//            $("#output").removeClass("disabled").html(giftPreviewHTML(output));
                $("#output").removeClass("disabled");
                giftPreviewHTML(output, $("#output"));
                result = true;
        } catch (e) {
            $("#parse-message").attr("class", "alert alert-warning d-print-none").text(buildErrorMessage(e));
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
        isDirty = true;
        clearErrors();

        $("#parse-message").attr("class", "alert alert-info d-print-none").text("Output is not updated until you click submit to validate...");
        $("#output").val('Output not available. Click Submit to validate.');
    }

    function doLayout() {
        $(".CodeMirror").height(($(".CodeMirror").parent().parent().parent().innerHeight() - 175) + "px");
        $("#output").height(($(".CodeMirror").height()) + "px");
        editor.refresh();
    }

    function doneLoadingGrammar() {
        var grammar = this.response;
        var parser = peg.generate(grammar);
        setParser(parser);
        parse();
    }

    var xmlhttp;
    xmlhttp = new XMLHttpRequest();   // fetch doesn't work on old iPads because it's not supported in old Safari
    xmlhttp.addEventListener("load", doneLoadingGrammar, false);
    xmlhttp.open("GET","../../GIFT.pegjs",true);
    xmlhttp.send();

    var textKey = $.getUrlVar('text');
    // console.log("textKey = " + textKey);

    editor.setValue(typeof textKey !== 'undefined' ? decompress(textKey) : sampleGift);

    $("#gift").removeAttr("disabled");

    $(window).resize(doLayout);
    editor.on("change", scheduleParse);
    editor.focus();

    function initExamplesDropdown() {
        // Init the examples drop-down menu
        var options = [
            {
                "groupName": "MC",
                "label": "Multiple choice",
                "options": [
                    {
                        "txtKey": "NOsnIWL134Lhvojkf_x2WbXOMrldZT49P9DbadKLqMztd0SFj4fEoBsdBClZ0quKKfUbF3LAI20ROoKnLDg3uI_p4apX5d2RoDIptGEVvUhxmjS1LfKjfPBY9bHUM-e7_8tq5jvFag3kkpsVAtSh073t2ocQmtKfedS9798DdMFZcaZ_avfQypv6DpHU9RQnCXe5yf3Ayrrfs5QA64HsRl3zVwXybV83",
                        "html": "Multiple choice (simple)"
                    },
                    {
                        "txtKey": "NOmn2y8m44Rt_8fFId4gnC4b3WwTdPrRSwI1CoUNj4L4VxijE4XlVE--Pvoxj6Y5HJCQY7fIvynrwCe-ewSo4wK5ToaGkkJHyqYGX38GffXZpmIEOIZ83xeL7Uzdyp9OxbCVRHrqtLVGzUM48E9tFziShAsLF2hCAYdyuoaAKzcO9VSaPfctlRSnNm00",
                        "html": "Multiple choice, multiple correct, weights, feedback"
                    },
                    {
                        "txtKey": "XLInRjjA4Epr5GkfS6DPlM0xC9m0IM4aATAbMHrNv4N7MxxTFT56yFBjsICKoL8Z0Y9ulD7CtEo0i_NwvHasf0Q3OB0OIDVhsLC8B4tCBHZ3FK8djFtvCE_C1bslLc5hTtlC3Sac9hkZfgpQ4XlIfPRDSi2MT3LAD2TOjipDiY_9uf1e6JfsYQMvuFA_ulV8MLVpH-kYtg_myHPcOuS6A0JMqOKpsBB0WHWkEE58zm5-py2l1y2K_6Sa6Itk2RJZaXedXI5XqRX910juEY4Kx9zwx4-OXlEDWP8u1xgBaaDLmWHDLAlkMFJkAFgExgIeXaODX4GewGqm-pFd49LyjO1Fhu5KgybnIjuNqAFZLEkZ44xZG0yysXi8MaTItUOffygQAu0tloXKxIjs-c85aqlJQqXb4bx0rpr9mc6eH6xEA1l4V4vHJINc7QIu8q2OcyImczUYJ5CrtD7LC3hkkQNCHPt_ABM0p-JmkaE-TNmVCCCWl8yDGIYadW8NcyuTM8I20MOTIQweReNgZNi8wKGpTZ5q8AG3PoM8UYHTmCUutP9G3ZGPRGNx7kKM4kNMkjlQnnwjrd4QQCBS5cm93fKyC-wIXrZ-d1kSrvhojfwdMjhJV2ARPyvqyVvqbgBKkC5lA1OnmIxpcAXfJt-O0b7eA0twVZA08YuBjUONyS4OpGNC2-wEIcuSRfXhyQuaEmWfPQDcgWiaRcF012nEuIv_A075gR6OXWutP8TzoAKdUGSs1jnpTDQ8wgiHfL4898OnJpwFxLhuzSLk5Eedng5J2F3o_Ftyg-7e_sUplm00",
                        "html": "Multiple choice, multiple correct answers, feedback"
                    },
                     ]
            },
            {
                "groupName": "TF",
                "label": "True/False",
                "options": [{
                        "txtKey": "umh9I5KeBirJACeiJYrMoCnJA04Af2OMb-WfL8VKSd410000",
                        "html": "True answer"
                    },
                    {
                        "txtKey": "umh9I5KeBirJACeiJYrMoCnJA04AbASMb-WfLBlLSd410000",
                        "html": "False answer"
                    },
                    {
                        "txtKey": "umh9I5KeBirJACeiJYrMoCnJA04Af2OMb-WfL8TmAIWe1-SN5LNgA6IMg1Shb1ILfkg11DsBKXDB5BBoa_GK7FDIW98AnQabSEtbgSKbNBLSN000",
                        "html": "True answer, feedback"
                    },
                ]
            },
            {
                "groupName": "shortanswer",
                "label": "Short answer",
                "options": [{
                    "txtKey": "uxAo2ix8BofHICmhBayjKZ3IDhAouWefprSeo2ajLYW1Cb8BInDpYXMgRKqKRDtoIujgzRYu0000",
                    "html": "Embedded short answer"
                },
                {
                    "txtKey": "LP1DI-j058Rt-HLlMugR4jo8476X2qNTo4KGboUPasPiSYRC1wLSxd_t7AkbTn6OZoVlEy-fckQ5HTWTCFdK1UbupZv8q-0v38A76Z_t5mdx45t2ygaRq7e1wtVFSVJ2SOcA8YDb4aVHuP7ZH88-HEL14mX_Azp-ugiFJWky3PGrDlhja1Twkxw-MXy9G_xOyGPjoVQqDFCuigiDkrn_wkO05wJarNiCibtWJb1YIuAHjomE0oNuZAmTS8MH0mQVK18Zz7hCyEAuz-8pWsBstSYcj3avGV4SIT98cHqqxwns0pKzfblM7EQYc0zYwSS4x2cfkZOwj0SObiey1zkhKQOTrpe3XitrlrO96LsOfY1QLum_ZTey8lSSRM6Hf_zUUnBPbMvWkS6tQI5xRaSsE5CxH-hgNrKlg-eB",
                    "html": "Embedded short answer, weights"
                }, 
            ]
            },
            {
                "groupName": "matching",
                "label": "Matching",
                "options": [{
                    "txtKey": "NP31IZGn48JFVvwYmOiUidDVK52yU124nGV89ZsPXYGzTdTs3-Axczb5nByFELHzHOLohy7Y0hOWOC6ApHHuXW2r5wEr8CI5AIAGOOKpsOKbWPcbXW8jL5G8CR8aQXcCOJ5RTJzDSRRTARI4SgHYEqnzofqIgjT-z6l8gDDPo4RCP-RaVohzjT8RglcFFbxYfjCUFjs_UtWJFXQiu1_WO5WtwT1p7XGcK2xzGc_sOp6K5enEg1lsD1W8l-A5QNf6sToN5ba4ey4j2r2RKOZbxl_0Cwb9YCRYODpDE7XNQldl8WkMLQzxHQwrDufX-zZEVJdt3G00",
                    "html": "Matching, general feedback"
                }, 
            ]
            }
        ];

        //        ["", "Matching, general feedback"]
        var selectList = $('#examples');
        selectList.empty();
        selectList.append($('<option></option>').val("label").html("Insert sample question at cursor..."));
        $.each(options, function (i, p) {
            var $newElem;
            $newElem = $(document.createElement('optgroup')).attr('value', p.groupName)
                .attr('label', p.label)
                .appendTo(selectList);
            $.each(p.options, function (j, q) {
                $newElem.append($('<option></option>').val(q.txtKey).html(q.html));
            });
        });
    }

});

function submitButtonClick() {
    compress(giftEditor.getValue());
}

// from PlantUML's online editor with keys for text
function compress(s) {
    //UTF8
    s = unescape(encodeURIComponent(s));
    var arr = [];
    for (var i = 0; i < s.length; i++) {
        arr.push(s.charCodeAt(i));
    }
    var compressor = new Zopfli.RawDeflate(arr);
    var compressed = compressor.compress();
    dest = pagePrefix + encode64_(compressed);
    window.location.href = dest;
}
function backto(s) {
    var i = s.lastIndexOf("/");
    if (i != -1) s = s.substring(i + 1);
    dest = pagePrefix + s;
    window.location.href = dest;
}
function decompress(s) {
    //console.log("decoded s: '" + decode64(s) + "'");
    return decode64(s);
}

// https://snipplr.com/view/33365/
$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});

// Based on PlantUML Gizmo's code

/**
 * Puts a sample GIFT in the source editor
 */
function updateSourceFromSample(theMenu) {
	theMenu.disabled = true;
	giftEditor.replaceSelection(decode64(theMenu.value));
	theMenu.disabled = false;
}
