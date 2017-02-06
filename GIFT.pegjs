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
    switch(answers.type) {
      case "TF":
        question.isTrue = answers.isTrue;
        question.feedBack1 = answers.feedback[1];
        question.feedBack2 = answers.feedback[2];
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
  = _ questions:(Question)+ _ { return questions }

Question "(question)"
  =  EssayQuestion / Description / QuestionEmbeddedAnswers / QuestionAnswersAtEnd    // order is important here

EssayQuestion 
  = title:QuestionTitle? _ stem:QuestionStem _ "{" _ "}" QuestionSeparator
 {
    var question = createQuestion("Essay", title, stem, false);
    return question;
 }
 
Description
  = stem:Text QuestionSeparator
 {
    var question = createQuestion("Description", null, stem, false);
    return question;
 }

QuestionAnswersAtEnd "(question with answers at end)" 
  = title:QuestionTitle? _ stem:QuestionStem _ answers:AnswerDetails QuestionSeparator
  {
    var question = createQuestion(answers.type, title, stem, false);
    question = processAnswers(question, answers);
    return question;
 }

QuestionEmbeddedAnswers "(question with embedded answers)" 
  = title:QuestionTitle? _ stem1:QuestionStem _ answers:AnswerDetails !QuestionSeparator _  
      stem2:QuestionStem QuestionSeparator
  {
    var question = createQuestion(answers.type, title, stem1 + " _____ " + stem2, true);
    question = processAnswers(question, answers);
    return question;
 }

QuestionTitle
  = _ '::' title:Text '::' { return title }
  
QuestionStem
  = stem:RichText { return stem }

QuestionSeparator "(question separator)"
  = EndOfLine EndOfLine* / EndOfLine? EndOfFile

AnswerDetails "(answer details)"
  = MatchingQuestion / TrueFalseQuestion / MCQuestion / NumericalQuestion

MatchingQuestion "Matching Question"
  = '{' _ matchPairs:Matches _ '}'
  { var answers = { type: "Matching", matchPairs:matchPairs}; return answers }

Matches "matches"
  = matchPairs:(Match)+  { return matchPairs }
  
Match "match"
  = _ '=' _ left:Text _ '->' _ right:Text _ 
    { var matchPair = { subquestion:left, subanswer:right }; return matchPair } 

MCQuestion "Multiple-choice Question"
  = '{' _ choices:Choices _ '}' 
  { var answers = { type: "MC", choices: choices}; return answers }

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

TrueFalseQuestion "True/False Question"
  = '{' _ isTrue:TrueOrFalseType feedback:(Feedback? Feedback?) _ '}' 
    { var answers = { type: "TF", isTrue: isTrue, feedback:feedback}; return answers }

TrueOrFalseType "(true or false type)"
  = isTrue:(TrueType / FalseType) { return isTrue }
  
TrueType "(true type)"
  = ('TRUE'i / 'T'i) {return true} // appending i after a literal makes it case insensitive

FalseType "(false type)"
  = ('FALSE'i / 'F'i) {return false}

NumericalQuestion "Numerical question" // Number ':' Range / Number '..' Number / Number
  = '{' _ '#' _ numericalAnswers:NumericalAnswers _ '}' { var answers = { type: "Numerical", choices: numericalAnswers};return answers }

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
  = numberHigh:Number '..' numberLow:Number 
  { var numericAnswer = {type: 'high-low', numberHigh: numberHigh, numberLow:numberLow}; return numericAnswer}

NumberAlone "(number answer)"
  = number:Number
  { var numericAnswer = {type: 'simple', number: number}; return numericAnswer}  

Text "(text)"
  = txt:TextChar+ { return removeDuplicateSpaces(txt.join('').trim()) } 

TextChar "(text character)"
  = (UnescapedChar / EscapeSequence)

EscapeChar "(escape character)"
  = '\\' 

EscapeSequence "escape sequence" 
  = EscapeChar sequence:( 
  "\\" 
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

//Title
//  = Text { return text() }

// folllowing inspired by http://nathansuniversity.com/turtle1.html
Number
    = chars:[0-9]+ frac:NumberFraction?
        { return parseFloat(chars.join('') + frac); }

NumberFraction
    = "." chars:[0-9]*
        { return "." + chars.join(''); }

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
