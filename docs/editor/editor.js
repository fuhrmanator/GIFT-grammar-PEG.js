/*jshint esversion: 6 */
var giftEditor;
var pagePrefix;

$(document).ready(function() {

    pagePrefix = window.location.protocol + "//" + window.location.host + window.location.pathname + "?text=";
    var sampleGift = "//-----------------------------------------//\n// Examples from gift/format.php.\n//-----------------------------------------//\n\nWho's buried in Grant's tomb?{~Grant ~Jefferson =no one}\n\nGrant is {~buried =entombed ~living} in Grant's tomb.\n\nGrant is buried in Grant's tomb.{FALSE}\n\nWho's buried in Grant's tomb?{=no one =nobody}\n\nWhen was Ulysses S. Grant born?{#1822:5}\n\nMatch the following countries with their corresponding capitals. {\n    =Canada -> Ottawa\n    =Italy  -> Rome\n    =Japan  -> Tokyo\n    =India  -> New Delhi\n    ####It's good to know the capitals\n}\n\n//-----------------------------------------//\n// More complicated examples.\n//-----------------------------------------//\n\n::Grant's Tomb::Grant is {\n        ~buried#No one is buried there.\n        =entombed#Right answer!\n        ~living#We hope not!\n} in Grant's tomb.\n\nDifficult multiple choice question.{\n        ~wrong answer           #comment on wrong answer\n        ~%50%half credit answer #comment on answer\n        =full credit answer     #well done!}\n\n::Jesus' hometown (Short answer ex.):: Jesus Christ was from {\n        =Nazareth#Yes! That's right!\n        =%75%Nazereth#Right, but misspelled.\n        =%25%Bethlehem#He was born here, but not raised here.\n}.\n\n//this comment will be ignored by the filter\n::Numerical example::\nWhen was Ulysses S. Grant born? {#\n        =1822:0      #Correct! 100% credit\n        =%50%1822:2  #He was born in 1822.\n                    You get 50% credit for being close.\n}";

    var parser = null;

    initExamplesDropdown();

    var ta = document.getElementById('gift');

    var editor = CodeMirror.fromTextArea(ta, {
        lineNumbers: true,
        styleActiveLine: true,
        styleActiveSelected: true,
        mode: "text/plain",
        lineWrapping: true,
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
        //console.log("oldInput: " + oldInput);

        $("#gift").removeAttr("disabled");
        $("#parse-message").attr("class", "alert alert-info d-print-none").text("Parsing the input...");
        $("#output").val('Output not available.');

        var result = false;

        try {
            var output = parser.parse(oldInput);

            $("#parse-message")
                .attr("class", "alert alert-success d-print-none")
                .text("GIFT input parsed successfully!");
                $("#output").removeClass("disabled");
        } catch (e) {
            console.log("Exception at parser.parse: " + e);
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
        }

	if (output) {
            giftPreviewHTML(output, $("#output"));
            result = true;
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
    xmlhttp.open("GET","https://raw.githubusercontent.com/fuhrmanator/GIFT-grammar-PEG.js/master/GIFT.pegjs",true);
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
                        "txtKey": "XLJ1Rjiw4BpxAnRs8PSulXj97eAy1xmUWhQ7td9Pask9DKMgkqihGT5-UvTCQiU-M805KHpF36S7cgtNJu-m8L4O6Pq6Hx9UpnwSo-n3wa0pt2BqJDldktclEihpUhLoMxtPO_B4cn3rXdnPTILuagMKpNB4ZcGrSL1ZM7Ov--LGeeOnqjBrsJIMQehB7yNk8ITPpU-r3tAxmljhc4qzAY0JQ4zdrc2R6Tw9uOmJ3dJ_mCyPs7K76AFzb3YXXZs1zBb4RwGmHYmIDf5W0Gz7X83-LG_34UDpkb8GOkD0Sr6IgqeOmGVHwYwpt1n4ZtGV54LHoOEBX1nV0PCzv-I2aAqMyD-B8v5gSchHsm86D9n8VMJ2DW-qm8E-0gFsnDLjQZbLrbG1UVETNDM-O6SeMZ2QDBsuM9hm0ZxlYIEEen5LSqf98QHJYcegvho367O427Fbu7RpsfGsLSKTNGoZpqFkAEKYnd-GMi3_PF2wGxPrUEymmSXv7po1AoIMGYxQpkqoCpa5J38HNr3TCjLR7i358ytK1zS3aumv2K6G0-a2_WtRBJ4bHyrenpWCoDSGANNQNzS-3gYrZcsW4LDNi2Dug-IfyIhvPl3tgS5vhMdUrlDKItkQDx9voedEtX_FKeIy6Vo2h04Zx5AU8ldk-8SMY41FSPIFam5ahjEkDJ-B3wQW9g1MS7DKaZUuOgh5kv3io2IKb7oh2yJS1OSHCXk5kVmc11HQOp6EFMv8t_SXbO7u2AurmdqEnXfGR3KXUm57h1XIytberyAkJtebK3yn1cqXmDFZrzElXg5_pMP_0000",
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
                    "txtKey": "NP0nImD148LhxrSCs2J5vlg0Wc9Z8GZ1AacnsPlR6zpTEMTcSuNutxrB4D4fjdZlUxpbDVlivRtZgHnVl8K1R430X1cBAN0F7d9DHcD220DJG23331FPXIM1dYNx1CLdLF0Xi7HK8XZ3tWRIusem6_MmRTlGs-RiIuToecGRx6eRAtMeJkl9ZJwYjfEGpN4NcJltK-skrSvGpNtK-IKksguFM_XiRkxWLVYKC8ExXvrXNgHTZN7ci0FbL2_yOZyaGodUw8owO8yp0_vNl3159vJ5VIw1HJ0Oh5Y0Iez2BEl_WITI4n-CfO7vRkU3DwKI_supO1hrkbpWd6kXu9UFRPglfla6",
                    "html": "Matching (markdown), general feedback"
                }, 
            ]
            }
        ];
        
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
    theMenu.selectedIndex = 0;
	theMenu.disabled = false;
}
