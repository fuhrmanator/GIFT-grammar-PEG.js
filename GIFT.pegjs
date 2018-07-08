// All these helper functions are available inside of actions 
{
  function makeInteger(o) {
    return parseInt(o.join(""), 10);
  }
  function createQuestion(type, title, stem, hasEmbeddedAnswers) {
    var question = {
      type: type,
      title: title,
      stem: stem,
      hasEmbeddedAnswers: hasEmbeddedAnswers
    }
    return question;
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
  function removeDuplicateSpaces(text) {
    return text.replace(/\s\s+/g,' ');
  }
}

GIFTQuestions
  = _ questions:(Description / Question)+ _ { return questions; }

Description "Description"
  = stem:Text QuestionSeparator
  { return createQuestion("Description", null, stem, false); }

Question
  = title:QuestionTitle? _ 
    stem1:QuestionStem _ 
    '{' 
    answers:(MatchingAnswers / TrueFalseAnswer / MCAnswers / NumericalAnswerType / EssayAnswer ) 
    '}' _
    stem2:QuestionStem?
    QuestionSeparator
  {
    var embedded = (stem2 != null);
    var stem = stem1 + ( embedded ? " _____ " + stem2 : "");
    var question = createQuestion(answers.type, title, stem, (stem2 != null));
    question = processAnswers(question, answers);
    return question;
  }

MatchingAnswers "{= match1 -> Match1\n...}"
  = matchPairs:Matches _ globalFeedback:GlobalFeedback? _
  { return { type: "Matching", matchPairs:matchPairs, globalFeedback:globalFeedback }; }

Matches "matches"
  = matchPairs:(Match)+  { return matchPairs }
  
Match "match"
  = _ '=' _ left:Text _ '->' _ right:Text _ 
    { var matchPair = { subquestion:left, subanswer:right }; return matchPair } 

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
  { return { type: "MC", choices: choices, globalFeedback:globalFeedback}; }

Choices "Choices"
  = choices:(Choice)+ { return choices; }
 
Choice "Choice"
  = _ choice:([=~] Weight? Text) feedback:Feedback? _ 
    { var choice = { isCorrect: (choice[0] == '='), weight: choice[1], text: choice[2], feedback: feedback }; return choice } 

Weight "(weight)"
  = '%' percent:([-]? PercentValue) '%' { return makeInteger(percent) }
  
PercentValue "(percent)"
  = '100' / [1-9][0-9]?  { return text() }

Feedback "(feedback)" 
  = '#' feedback:Text { return feedback }

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
  { return { type: "Numerical", choices: numericalAnswers, globalFeedback: 
             globalFeedback}; }

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
  = _ '::' title:Text '::' { return title }
  
QuestionStem "Question stem"
  = stem:RichText { return stem }

QuestionSeparator "(blank line separator)"
  = EndOfLine EndOfLine+ / EndOfLine? EndOfFile

Text "(text)"
  = txt:TextChar+ { return removeDuplicateSpaces(txt.join('').trim()) } 

TextChar "(text character)"
  = (UnescapedChar / EscapeSequence / EscapeChar)

EscapeChar "(escape character)"
  = '\\' 

EscapeSequence "escape sequence" 
  = EscapeChar sequence:( 
  "\\" 
   / ":" 
   / "~" 
   / "="
   / "#"
   / "{"
   / "}" )
  { return sequence; }
 
UnescapedChar ""
  = [\u0080-\u024f] / [A-Z]i / [0-9] / ' ' / [.+><()!?'"%,] / '*' / ('-' !'>') { return '-'} / (EndOfLine !EndOfLine) {return ' '}

ControlChar 
  = '=' / '~' / "#" / '{' / '}' / '\\'  

//SpecialTokens "(special chars)"
//  = "->" / "=" / "~" / "#" / "%" / "#" / "::" // do not include "{" / "}"

RichText
  = Text // { return replaceLineBreaksWithSpace(text().trim()) } 

// folllowing inspired by http://nathansuniversity.com/turtle1.html
Number
    = chars:[0-9]+ frac:NumberFraction?
        { return parseFloat(chars.join('') + frac); }

NumberFraction
    = "." !"." chars:[0-9]*
        { return "." + chars.join(''); }

GlobalFeedback
    = '####' _ rt:RichText _ {return rt;}

_ "(whitespace)"
  = (EndOfLine !EndOfLine / Space / Comment / Ignore)*

Ignore 
  = "[markdown]"  // ignoring this for now

Comment "(comment)"
  = '//' (!EndOfLine .)* ( EndOfLine / EndOfFile) 
Space "(space)"
  = ' ' / '\t'
EndOfLine "(end of line)"
  = '\r\n' / '\n' / '\r'
EndOfFile 
  = !. { return "EOF"; }