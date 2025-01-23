// All these helper functions are available inside of actions 
{
  var questionId = null;
  var questionTags = null;
  var defaultFormat = "defaultFormat"; // default format - the GIFT specs say [moodle] is default, we'll set it later
  var format = defaultFormat;
  const escapedCharacters = {
    "\\\\"  : "&&092;",
    "\\:"  : "&&058;",
    "\\#"  : "&&035;",
    "\\="  : "&&061;",
    "\\{"  : "&&123;",
    "\\}"  : "&&125;",
    "\\~"  : "&&126;",
    "\\n"  : "&&010"
  };
  function escapedCharacterDecode(text) {
    // Replace escaped characters with their original values, except for the newline character which should return a real (not escaped newline)
    return text.replace(/&&092;/g, '\\')
               .replace(/&&058;/g, ':')
               .replace(/&&035;/g, '#')
               .replace(/&&061;/g, '=')
               .replace(/&&123;/g, '{')
               .replace(/&&125;/g, '}')
               .replace(/&&126;/g, '~')
               .replace(/&&010/g, '\n');
  }
  function postProcessQuestion(question, answers) {
    // check for MC that's actually a short answer (all correct answers)
    if (question.type == "MC" && areAllCorrect(answers.choices)) {
      question.type = "Short";
      // Convert the text of each choice to remove the format, and make it the same as PlainText (FIXME)
      for (let i = 0; i < answers.choices.length; i++) {
        let choice = answers.choices[i];
        choice.text = (choice.formattedText.format === defaultFormat ? "" : `[${choice.formattedText.format}]`) + removeNewLinesDuplicateSpaces(choice.formattedText.text.trim());
        delete choice.formattedText; // remove the property
        answers.choices[i] = choice;
      }
    }

      question.formattedStem = convertFormat(question.formattedStem, 'moodle');
    let questionFormat = question.formattedStem.format; // will be either the question's defined format, or 'moodle' by default 

    question.formattedGlobalFeedback = convertFormat(answers.formattedGlobalFeedback, questionFormat);
    switch(question.type) {
      case "TF":
        question.isTrue = answers.isTrue;
          question.trueFormattedFeedback = convertFormat(answers.formattedFeedback[0], questionFormat);
          question.falseFormattedFeedback = convertFormat(answers.formattedFeedback[1], questionFormat);
        break;
      case "Numerical":        
      case "MC":
      case "Short":
        if (!answers.choices) throw new Error (`question of type ${question.type} has answers with no choices.`);
        for (let i = 0; i < answers.choices.length; i++) {
          // numerical choices aren't formatted
          if (question.type !== "Numerical") {
            answers.choices[i].formattedText = convertFormat(answers.choices[i].formattedText, questionFormat);
          }
          answers.choices[i].formattedFeedback = convertFormat(answers.choices[i].formattedFeedback, questionFormat);
        }
        question.choices = answers.choices;
        break;
      case "Matching":
        if (!answers.matchPairs) throw new Error (`question of type ${question.type} has answers with no matchPairs.`);
        for (let i = 0; i < answers.matchPairs.length; i++) {
          answers.matchPairs[i].formattedSubquestion = convertFormat(answers.matchPairs[i].formattedSubquestion, questionFormat);
        }
        question.matchPairs = answers.matchPairs;
        break;
    }
    question.id = questionId;
    question.tags = questionTags;
    return question;
  }
  // the text formats should inherit the format of the question if they're not defined
  function convertFormat(richText, questionFormat) {
    if (!questionFormat) throw new Error (`questionFormat not defined in convertFormat.`);
    // console.log(`convertFormat: ${JSON.stringify(richText)}`);
    if (richText && richText.format === defaultFormat) {
      richText.format = questionFormat;
    }
    return richText;
  }
  function areAllCorrect(choices) {
    if (!choices) throw new Error (`areAllCorrect has invalid choices.`);
    var allAreCorrect = true;
    for (var i = 0; i < choices.length; i++) {
      allAreCorrect &= choices[i].isCorrect;
    }
    return allAreCorrect;
  }
  function removeNewLinesDuplicateSpaces(text) {
    text = text.replace(/[\n\r]/g,' '); // replace newlines with spaces
    return text.replace(/\s\s+/g,' ');
  }
  function setLastQuestionTextFormat(fmt) {
    format = fmt;
  }
  function getLastQuestionTextFormat() {
    return format;
  }
  function resetLastQuestionTextFormat() {
    format = defaultFormat;
  }
  function formattedText(format, txt) {
    let inferredFormat = (format !== null ? format : getLastQuestionTextFormat());
    let joinedText = txt.join('')
      .replace(/\r\n/g, '\n')  // replace Windows newlines with Unix newlines
      .trim();
    return {
      format:(inferredFormat), 
      text:(
          ((inferredFormat == "html") || (inferredFormat == "markdown")) ? 
            // keep whitespace and newlines for html and markdown
            escapedCharacterDecode(joinedText) :
            escapedCharacterDecode(removeNewLinesDuplicateSpaces(joinedText))
          )}
  }
}

GIFTQuestions
  = questions:(Category / Description / Question)+ _ __ { return questions; }

Category "Category"
  = ResetIdsTags __ '$' 'CATEGORY:' _ cat:CategoryText QuestionSeparator? {return {type:"Category", title:cat}}

Description "Description"
  = ResetIdsTags __
    TagComment*
    title:QuestionTitle? _
    text:QuestionStem
    QuestionSeparator
    { var question = {id: questionId, tags: questionTags, type:"Description", title:title, formattedStem:convertFormat(text, 'moodle'), hasEmbeddedAnswers:false};
      resetLastQuestionTextFormat(); 
      questionId = null; questionTags = null;
      return question }

Question
  = ResetIdsTags __
    TagComment*
    title:QuestionTitle? _
    stem1:QuestionStem? _ 
    '{' _
    answers:(MatchingAnswers / TrueFalseAnswer / MCAnswers / NumericalAnswerType / SingleCorrectShortAnswer / EssayAnswer ) _
    '}' _
    stem2:(
      Comment / 
      QuestionStem)?
    QuestionSeparator
  {    
    var embedded = (stem2 !== null);    
    var stem1Text = stem1 ? (stem1.text + (embedded ? " " : "")) : "";

    var format = (stem1 && stem1.format) || (stem2 && stem2.format) || "moodle";
    var text = stem1Text + ( embedded ? "_____ " + stem2.text : "");
    
    var question = {type:answers.type, title:title, formattedStem: {format: format, text: text}, hasEmbeddedAnswers:embedded};
    question = postProcessQuestion(question, answers);
    resetLastQuestionTextFormat();
    return question;
  }

MatchingAnswers "{= match1 -> Match1\n...}"
  = matchPairs:Matches _ globalFeedback:GlobalFeedback? _
  { return { type: "Matching", matchPairs:matchPairs, formattedGlobalFeedback:globalFeedback }; }

Matches "matches"
  = matchPairs:(Match)+  { return matchPairs }
  
Match "match"
  = _ '=' _ left:MatchRichText? _ '->' _ right:PlainText _ 
    { var matchPair = { 
        formattedSubquestion:{
          format:(left !== null ? left.format : getLastQuestionTextFormat()), 
          text:(left !== null ? left.text : "")
        }, 
        subanswer:right}; 
        return matchPair } 

///////////
TrueFalseAnswer "{T} or {F} or {TRUE} or {FALSE}"
  = isTrue:TrueOrFalseType _ 
    feedback:(Feedback? Feedback?) _
    globalFeedback:GlobalFeedback?
  { return { type:"TF", isTrue: isTrue, formattedFeedback:feedback, formattedGlobalFeedback:globalFeedback}; }
  
TrueOrFalseType 
  = isTrue:(TrueType / FalseType) { return isTrue }
  
TrueType
  = ('TRUE' / 'T') {return true}

FalseType
  = ('FALSE' / 'F') {return false}

////////////////////
MCAnswers "{=correct choice ~incorrect choice ... }"
  = choices:Choices _ 
    globalFeedback:GlobalFeedback? _
  { return { type: "MC", choices:choices, formattedGlobalFeedback:globalFeedback}; }

Choices "Choices"
  = choices:(Choice)+ { return choices; }
 
Choice "Choice"
  = _ choice:([=~] _ Weight? _ RichText) feedback:Feedback? _ 
    { var wt = choice[2];
      var txt = choice[4];
      var choice = { isCorrect: (choice[0] == '='), 
                     weight:wt, 
                     formattedText: txt,
                     formattedFeedback:feedback };
      return choice } 

Weight "(weight)"
  = '%' percent:(PercentValue) '%' {
	return percent;
  }

PercentValue "(percent)"
    = percent:(!'%' .)* {
      let error = 'a value between -100 and 100'
      if (percent.length == 0) expected(error + ' (did you forget to put a value?)');
      // the !'%' shows up as a 0th element in the percent array (of arrays), so we have to join the 1th elements
	  const pct = parseFloat(percent.map(innerArray => innerArray[1]).join(""));
      if (pct >= -100 && pct <= 100) {
        return pct;
      } else {
        expected(error)
      }
    }

Feedback "(formatted feedback)" 
  = '#' !'###' _ feedback:RichText? { return feedback }

////////////////////
EssayAnswer "Essay question { ... }"
  = '' _
    globalFeedback:GlobalFeedback? _ 
  { return { type: "Essay", formattedGlobalFeedback:globalFeedback}; }

///////////////////
SingleCorrectShortAnswer "Single short answer { ... }"
  = answer:PlainText _ 
    feedback:Feedback? _ 
    globalFeedback:GlobalFeedback? _
  { var choices = [];
    choices.push({isCorrect:true, text:answer, formattedFeedback:feedback, weight:null});
    return { type: "Short", choices:choices, formattedGlobalFeedback:globalFeedback}; }

///////////////////
NumericalAnswerType "{#... }" // Number ':' Range / Number '..' Number / Number
  = '#' _
    numericalAnswers:NumericalAnswers _ 
    globalFeedback:GlobalFeedback? 
  { return { type:"Numerical", 
             choices:numericalAnswers, 
             formattedGlobalFeedback:globalFeedback}; }

NumericalAnswers "Numerical Answers"
  = choices:(MultipleNumericalChoices / SingleNumericalAnswer)
  { return Array.isArray(choices) ? choices : [choices]; }

MultipleNumericalChoices "Multiple Numerical Choices"
  = choices:(NumericalChoice)+ { return choices; }

SingleNumericalAnswer "Single numeric answer"
  = NumberWithRange / NumberHighLow / NumberAlone

NumberWithRange "(number with range)"
  = number:Number ':' range:Number 
  { var numericAnswer = {type: 'range', number: number, range:range}; return numericAnswer}

NumberHighLow "(number with high-low)"
  = numberLow:Number '..' numberHigh:Number 
  { var numericAnswer = {type: 'high-low', numberHigh: numberHigh, numberLow:numberLow}; return numericAnswer}

NumberAlone "(number answer)"
  = number:Number
  { var numericAnswer = {type: 'simple', number: number}; return numericAnswer}  

NumericalChoice "Numerical Choice"
  = _ choice:([=~] Weight? SingleNumericalAnswer?) _ feedback:Feedback? _ 
    { var symbol = choice[0];
      var wt = choice[1];
      var txt = choice[2];
      var choice = { isCorrect:(symbol == '='), 
                     weight:wt, 
                     answer: 
                         (txt !== null ? txt : '*'), // Moodle unit tests show this, not in documentation
                     formattedFeedback: feedback };
      return choice }

//////////////
QuestionTitle ":: Title ::"
  = '::' title:TitleText+ '::' { return escapedCharacterDecode(title.join('')) }
  
QuestionStem "Question formatted stem"
  = stem:RichText 
    { return stem }

QuestionSeparator "(blank lines separator)"
  = BlankLines  
    / EndOfLine? EndOfFile

BlankLines "(blank lines)"
  = EndOfLine BlankLine+

BlankLine "blank line"
  = Space* EndOfLine

TitleText "(Title text)"
  = !'::' t:(EscapeSequence / UnescapedChar) {return t}

TextChar "(text character)"
  = (UnescapedChar / EscapeSequence / EscapeChar)

MatchTextChar "(text character)"
  = (UnescapedMatchChar / EscapeSequence / EscapeChar)

Format "format"
  = '[' format:('html' /
                'markdown' /
                'plain' / 
                'moodle') 
    ']' {return format}

EscapeChar "(escape character)"
  = '\\' 

EscapeSequence "escape sequence"
  = "\\" char: ("\\" / ":" / "#" / "=" / "{" / "}" / "~" / "n") {
    return escapedCharacters['\\' + char];
    }

// return the text if it's not escaped
UnescapedChar ""
  = !(EscapeSequence / ControlChar / QuestionSeparator) . {return text()}

// return the text if it's not escaped
UnescapedMatchChar ""
  = !(EscapeSequence / ControlChar / '->' / QuestionSeparator) . {return text()}

ControlChar 
  = '=' / '~' / "#" / '{' / '}' / '\\' / ':'

MatchRichText "(formatted text excluding '->')"
  = format:Format? _ txt:MatchTextChar+ { return formattedText(format, txt) } 

RichText "(formatted text)"
  = format:Format? _ txt:TextChar+ { return formattedText(format, txt) }

PlainText "(unformatted text)"
  = txt:TextChar+ { return removeNewLinesDuplicateSpaces(txt.join('').trim())} 

CategoryText "(category text)"
  = txt:(!EndOfLine .)* &(EndOfLine / EndOfFile) { return txt.flat().join('') } 

Number
  = Sign? DecimalValue { return parseFloat(text()); }

DecimalValue
  = Digits ('.' Digits)?

Digits
  = [0-9]+

Sign
  = [+-]

GlobalFeedback
    = '####' _ rt:RichText _ {return rt;}

_ "(single line whitespace)"
  = (Space / EndOfLine !BlankLine)*

__ "(multiple line whitespace)"
  = (TagComment / EndOfLine / Space )*

ResetIdsTags 
  = &' '*     // useless match to reset any previously parsed tags/ids
    {questionId = null; questionTags = null}

Comment "(comment)"
  = '//' p:([^\n\r]*)
 {return null}

TagComment "(comment)"
  = '//' p:([^\n\r]*)
  {
    var comment = p.join("");
    // use a regex like the Moodle parser
    var idIsFound = comment.match(/\[id:([^\x00-\x1F\x7F]+?)]/); 
    if(idIsFound) {
        questionId = idIsFound[1].trim().replace('\\]', ']');
    }
    
    // use a regex like the Moodle parser
    var tagMatches = comment.matchAll(/\[tag:([^\x00-\x1F\x7F]+?)]/g);
    Array.from(
      comment.matchAll(/\[tag:([^\x00-\x1F\x7F]+?)]/g), 
                       function(m) { return m[1] })
              .forEach(function(element) {
                if(!questionTags) questionTags = [];
                questionTags.push(element);
              });
    return null // hacking, must "reset" values each time a partial match happens
  }

Space "(space)"
  = ' ' / '\t'
EndOfLine "(end of line)"
  = '\r\n' / '\n' / '\r'
EndOfFile 
  = !. { return "EOF"; }
