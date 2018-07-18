var converter;

function giftPreviewHTML(qArray, theDiv) {
    converter = new showdown.Converter();
    var html = "";
    var q;
    for (var i=0; i<qArray.length; i++) {
        // console.log("i = " + i + " and qArray[i] is '" + qArray[i] );
        q = qArray[i];
        // console.log("q.type is '" + q.type );
        switch (q.type) {
            case "MC":
                html += makeTitle("Multiple choice", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                html += formatAnswers(q.choices);
                html += formatFeedback(q.globalFeedback);
                theDiv.append(html); html = "";
                break;
            case "Short":
                html += makeTitle("Short answer", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                html += formatAnswers(q.choices);
                html += formatFeedback(q.globalFeedback);
                theDiv.append(html); html = "";
                break;
            case "Essay":
                html += makeTitle("Essay", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                html += formatFeedback(q.globalFeedback);
                theDiv.append(html); html = "";
                // html += formatAnswers(q.choices);
                break;
           case "TF":
                html += makeTitle("True/False", q.title);
                html +="<p>" + "<em>(" + (q.isTrue ? "True" : "False") + ")</em> " + applyFormat(q.stem) + "</p>";
                html += formatFeedback(q.globalFeedback);
                theDiv.append(html); html = "";
                // html += formatAnswers(q.choices);
                break;
            case "Matching":
                html += makeTitle("Matching", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                theDiv.append(html); html = "";
                formatMatchingAnswers(q, theDiv);
                html += formatFeedback(q.globalFeedback);
                theDiv.append(html); html = "";
                break;
            // for case "Matching": see https://stackoverflow.com/a/35493737/1168342
            default:
                break;
        }
    
    }
    // return html;
}

function makeTitle(type, title) {
    return "<b>" + type + (title !== null ? ' "' + title + '"' : "" ) + "</b>";
}

function formatAnswers(choices) {
    var html = "<ul>";
    for (var a=0; a<choices.length; a++) {
        var answer = choices[a];
        html += '<li class="' +
          (answer.isCorrect ? 'rightAnswer' : 'wrongAnswer') +
          '">' + (answer.weight !== null ? "<em>(" + answer.weight + "%)</em> " : '') +
          applyFormat(answer.text) + 
          (answer.feedback !== null ? " [" + applyFormat(answer.feedback) + "]" : '') +
          "</li>";
    }
    html += "</ul>";
    return html;
}

function formatMatchingAnswers(q, theDiv) {
    var rightSideChoices = new Set();
    var html ='';
    var htmlLines = '';
    for (var i=0; i<q.matchPairs.length; i++) {
        htmlLines += '<line id="line' + i + '" stroke="red"/>';
    }
    html += '<svg id="theSVG" style="position: absolute; z-index: -1;" width="100%" height="100%" z-index="-1">' + htmlLines + '</svg>';

    html +='<div class="row"><div class="col-md-5">';  // left side
    for (var i=0; i<q.matchPairs.length; i++) {
        var pair = q.matchPairs[i];
        html += '<div id="left' + i + '" style="background:#ddddff">';
        html += '<p>' + applyFormat(pair.subquestion) + '</p>';
//        html += applyFormat(pair.subquestion);
        html += '</div>';
        rightSideChoices.add(pair.subanswer);
    }
    console.log('Found rightSideChoices: ' + rightSideChoices.size);
    html += '</div>'

    html += '<div class="col-md-5 col-md-offset-6">'; // right side
    for (var it = rightSideChoices.values(), val= null; val=it.next().value;) {
        //console.log('answer: ' + val);
        html += '<div id="right_' + val.replace(/\s/g, '_') + '" style="background:#ddddff">';
        html += '<p>' + val + '</p>';
//        html += val;
        html += '</div>';
    }
    html += '</div></div>'
    // make the SVG for lines, see https://stackoverflow.com/a/35493737/1168342
    theDiv.append(html); html = "";  // force the HTML into the DOM

    // set the lines up 
    for (var i=0; i<q.matchPairs.length; i++) {
        var pair = q.matchPairs[i];
        var line = $("#line" + i);
        var leftDiv = $("#left" + i); 
        var rightDiv = $("#right_" + pair.subanswer.replace(/\s/g, '_'));
        var pos1 = leftDiv.offset();
        var pos2 = rightDiv.offset();
        var svg = $("#theSVG").offset();
        line
          .attr('x1', pos1.left - svg.left + leftDiv.width())
          .attr('y1', pos1.top + leftDiv.height()/2 - svg.top)
          .attr('x2', pos2.left - svg.left)
          .attr('y2', pos2.top + rightDiv.height()/2 - svg.top);
        $("#theSVG").attr('height', pos1.top + leftDiv.height() - svg.top);
    }
    // return html;
}

function applyFormat(giftText) {
    // console.log("applyFormat: " + giftText.format + " to " + giftText.text);
    var html = "";
    switch (giftText.format) {
        case "moodle":
        case "plain":
        case "html":
            html = giftText.text;
            break;

        case "markdown":
            html = converter.makeHtml(giftText.text);
            break;

        default:
            break;
    }
    if (html=="") html="&nbsp;";  // special case so div's aren't empty
    return html;
}

function formatFeedback(feedback) {
    return feedback !== null ? 
            '<p style="margin-left: 40px"><em>General feedback:</em> ' + 
            applyFormat(feedback) + '</p>' : '';
}