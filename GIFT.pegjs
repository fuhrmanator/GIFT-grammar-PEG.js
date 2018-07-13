// All these helper functions are available inside of actions 
{
  var defaultFormat = "moodle"; // default format - the GIFT specs say [moodle] is default, but not sure what that means for other applications
  var format = defaultFormat;
  function makeInteger(o) {
    return parseInt(o.join(""), 10);
  }
  function processAnswers(question, answers) {
    question.globalFeedback = answers.globalFeedback;
    switch(answers.type) {
      case "TF":
        question.isTrue = answers.isTrue;
        question.incorrectFeedback = answers.feedback[1];
        question.correctFeedback = answers.feedback[2];
        break;
      case "MC":
      case "Numerical":
        question.choices = answers.choices;
        break;
      case "Matching":
        question.matchPairs = answers.matchPairs;
        break;
    }
    return question;
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
}

GIFTQuestions
  = questions:(Category / Description / Question)+ _ __ { return questions; }

Category "Category"
  = __ '$' 'CATEGORY:' _ cat:PlainText QuestionSeparator {return {type:"Category", title:cat}}

Description "Description"
  = __
    text:RichText QuestionSeparator
    { resetLastQuestionTextFormat(); return {type:"Description", title:null, stem:text, hasEmbeddedAnswers:false} }

Question
  = __
    title:QuestionTitle? _
    stem1:QuestionStem _ 
    '{' 
    answers:(MatchingAnswers / TrueFalseAnswer / MCAnswers / NumericalAnswerType / EssayAnswer ) 
    '}' _
    stem2:(Comment / QuestionStem)?
    QuestionSeparator
  {
    var embedded = (stem2 != null);
    var stem = {format:stem1.format, text:stem1.text + ( embedded ? " _____ " + stem2.text : "")};
    var question = {type:answers.type, title:title, stem:stem, hasEmbeddedAnswers:(stem2 != null)};
    question = processAnswers(question, answers);
    resetLastQuestionTextFormat();
    return question;
  }

MatchingAnswers "{= match1 -> Match1\n...}"
  = matchPairs:Matches _ globalFeedback:GlobalFeedback? _
  { return { type: "Matching", matchPairs:matchPairs, globalFeedback:globalFeedback }; }

Matches "matches"
  = matchPairs:(Match)+  { return matchPairs }
  
Match "match"
  = _ '=' _ left:RichText? _ '->' _ right:PlainText _ 
    { var matchPair = { 
        subquestion:{
          format:(left !== null ? left.format : getLastQuestionTextFormat()), 
          text:(left !== null ? left.text : "")
        }, 
        subanswer:right}; 
        return matchPair } 

///////////
TrueFalseAnswer "{T} or {F} or {True} or {False}"
  = isTrue:TrueOrFalseType _ 
    feedback:(_ Feedback? Feedback?) _
    globalFeedback:GlobalFeedback?
  { return { type:"TF", isTrue: isTrue, feedback:feedback, globalFeedback:globalFeedback}; }
  
TrueOrFalseType 
  = isTrue:(TrueType / FalseType) { return isTrue }
  
TrueType
  = ('TRUE'i / 'T'i) {return true} // appending i after a literal makes it case insensitive

FalseType
  = ('FALSE'i / 'F'i) {return false}

////////////////////
MCAnswers "{=correct choice ~incorrect choice ... }"
  = choices:Choices _ 
    globalFeedback:GlobalFeedback? _
  { return { type: "MC", choices:choices, globalFeedback:globalFeedback}; }

Choices "Choices"
  = choices:(Choice)+ { return choices; }
 
Choice "Choice"
  = _ choice:([=~] _ Weight? _ RichText) feedback:Feedback? _ 
    { var choice = { isCorrect: (choice[0] == '='), weight:choice[2], text:choice[4], feedback:feedback }; return choice } 

Weight "(weight)"
  = '%' percent:([-]? PercentValue) '%' { return makeInteger(percent) }
  
PercentValue "(percent)"
  = '100' / [0-9][0-9]?  { return text() }

Feedback "(feedback)" 
  = '#' !'###' _ feedback:RichText? { return feedback }

////////////////////
EssayAnswer "Essay question { ... }"
  = '' _
    globalFeedback:GlobalFeedback? _ 
  { return { type: "Essay", globalFeedback:globalFeedback}; }

///////////////////
NumericalAnswerType "{#... }" // Number ':' Range / Number '..' Number / Number
  = '#' _
    numericalAnswers:NumericalAnswers _ 
    globalFeedback:GlobalFeedback? 
  { return { type:"Numerical", 
             choices:numericalAnswers, 
             globalFeedback:globalFeedback}; }

NumericalAnswers "Numerical Answers"
  = MultipleNumericalChoices / SingleNumericalAnswer

MultipleNumericalChoices "Multiple Numerical Choices"
  = choices:(NumericalChoice)+ { return choices; }

NumericalChoice "Numerical Choice"
  = _ choice:([=~] Weight? SingleNumericalAnswer) _ feedback:Feedback? _ 
    { var choice = { isCorrect: (choice[0] == '='), weight: choice[1], text: choice[2], feedback: feedback }; return choice } 

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

//////////////
QuestionTitle ":: Title ::"
  = '::' title:TitleText+ '::' { return title.join('') }
  
QuestionStem "Question stem"
  = stem:RichText 
    { setLastQuestionTextFormat(stem.format); // save format for question, for default of other non-formatted text
      return stem }

QuestionSeparator "(blank line separator)"
  = EndOfLine EndOfLine+ / EndOfLine? EndOfFile

TitleText "(Title text)"
  = !'::' t:UnescapedChar {return t}

TextChar "(text character)"
  = (UnescapedChar / EscapeSequence / EscapeChar)

Format "format"
  = '[' format:('html' /
                'markdown' /
                'plain' / 
                'moodle') 
    ']' {return format}

EscapeChar "(escape character)"
  = '\\' 

EscapeSequence "escape sequence" 
  = EscapeChar 
    sequence:( 
      EscapeChar 
      / ":" 
      / "~" 
      / "="
      / "#"
      / "["
      / "]"
      / "{"
      / "}" )
  { return sequence }
 
UnescapedChar ""
  = !(EscapeSequence / ControlChar / QuestionSeparator) . {return text()}

ControlChar 
  = '=' / '~' / "#" / '{' / '}' / '\\' / '->'

RichText "(formatted text)"
  = format:Format? _ txt:TextChar+ { return {
      format:(format!==null ? format : getLastQuestionTextFormat()), 
      text:removeNewLinesDuplicateSpaces(txt.join('').trim())}} 

PlainText "(unformatted text)"
  = txt:TextChar+ { return removeNewLinesDuplicateSpaces(txt.join('').trim())} 

// folllowing inspired by http://nathansuniversity.com/turtle1.html
Number
    = chars:[0-9]+ frac:NumberFraction?
        { return parseFloat(chars.join('') + frac); }

NumberFraction
    = "." !"." chars:[0-9]*
        { return "." + chars.join(''); }

GlobalFeedback
    = '####' _ rt:RichText _ {return rt;}

_ "(single line whitespace)"
  = (EndOfLine !EndOfLine / Space )*

__ "(multiple line whitespace)"
  = (Comment / EndOfLine / Space )*

Comment "(comment)"
  = '//' (!EndOfLine .)* (EndOfLine / EndOfFile) {return null}
Space "(space)"
  = ' ' / '\t'
EndOfLine "(end of line)"
  = '\r\n' / '\n' / '\r'
EndOfFile 
  = !. { return "EOF"; }