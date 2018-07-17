var converter;

function giftPreviewHTML(qArray) {
    converter = new showdown.Converter();
    var html = "";
    var q;
    for (var i=0; i<qArray.length; i++) {
        console.log("i = " + i + " and qArray[i] is '" + qArray[i] );
        q = qArray[i];
        console.log("q.type is '" + q.type );
        switch (q.type) {
            case "MC":
                html += makeTitle("Multiple choice", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                html += formatAnswers(q.choices);
                html += formatFeedback(q.globalFeedback);
                break;
            case "Short":
                html += makeTitle("Short answer", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                html += formatAnswers(q.choices);
                html += formatFeedback(q.globalFeedback);
                break;
            case "Essay":
                html += makeTitle("Essay", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                html += formatFeedback(q.globalFeedback);
                // html += formatAnswers(q.choices);
                break;
           case "TF":
                html += makeTitle("True/False", q.title);
                html +="<p>" + "<em>(" + (q.isTrue ? "True" : "False") + ")</em> " + applyFormat(q.stem) + "</p>";
                html += formatFeedback(q.globalFeedback);
                // html += formatAnswers(q.choices);
                break;
            // for case "Matching": see https://stackoverflow.com/a/35493737/1168342
            default:
                break;
        }
    
    }
    return html;
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

function applyFormat(giftText) {
    console.log("applyFormat: " + giftText.format + " to " + giftText.text);
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
    return html;
}

function formatFeedback(feedback) {
    return feedback !== null ? 
            '<p style="margin-left: 40px"><em>General feedback:</em> ' + 
            applyFormat(feedback) + '</p>' : '';
}