{
  function makeInteger(o) {
    return parseInt(o.join(""), 10);
  }
}


GIFTQuestions
  = (Question)+

Question "(question)"
  = title:QuestionTitle? __ stem:QuestionStem answers:AnswerDetails Spacing QuestionSeparator
  {
    var question = {
      type: answers.type,
      title: title,
      stem: stem
    }
    switch(answers.type) {
      case "TF":
        question.isTrue = answers.isTrue;
        question.feedBack1 = answers.feedback[1];
        question.feedBack2 = answers.feedback[2];
        break;
      case "MC":
        question.choices = answers.choices;
    }
    return question;
 }

QuestionSeparator "(blank line)"
  = EndOfLine EndOfLine* / EndOfLine? EndOfFile

AnswerDetails "(specific question details)"
  = TrueFalseQuestion / MCQuestion
 
TrueFalseQuestion "True/False Question"
  = '{' __ isTrue:TrueOrFalseType feedback:(Feedback? Feedback?) __ '}' 
    { var answers = { type: "TF", isTrue: isTrue, feedback:feedback}; return answers }

TrueOrFalseType "(true or false type)"
  = TrueType / FalseType
  
TrueType "(true type)"
  = 'TRUE'i / 't'i {return true} // appending i after a literal makes it case insensitive

FalseType "(false type)"
  = 'FALSE'i / 'F'i {return false}

MCQuestion "Multiple-choice Question"
  = '{' choices:(Choices) '}' 
  { var answers = { type: "MC", choices: choices}; return answers }

Choices "Choices"
  = choices:(Choice)+ { return choices; }
 
Choice "Choice"
  = __ choice:([=~] Weight? Text) feedback:Feedback? __ 
    { var choice = { isCorrect: (choice[0] == '='), weight: choice[1], text: choice[2], feedback: feedback }; return choice } 
//    return '\n' + (choice[0]=='=' ? 'correct ' : 'incorrect ') + 'choice: ' 
//        + choice[1] + '\nfeedback:' + feedback }
//  = __ choice:(CorrectChoice / IncorrectChoice) feedback:Feedback? __

Weight "(weight)"
  = '%' percent:([-]? PercentValue) '%' { return makeInteger(percent) }
  
PercentValue "(percent)"
  = '100' / [1-9][0-9]?  { return text() }

Feedback "(feedback)" 
  = '#' feedback:Text { return feedback }

QuestionTitle
  = '::' title:Title EndOfLine? '::' { return title }
  
QuestionStem
  = stem:RichText { return stem; }

Text "(text)"
  = [A-Za-z0-9 .+!?']+ { return text() } 

RichText
  = Text* { return text() } 

Title
  = Text* { return text() }

_ "whitespace"
  = [ \t]*

__ "(whitespace)"
  = (EndOfLine / Space)*

Spacing 
  = (Space / Comment)*
Comment "(comment)"
  = '//' (!EndOfLine .)* EndOfLine { return null }
Space "(space)"
  = ' ' / '\t'
EndOfLine "(end of line)"
  = '\r\n' / '\n' / '\r'
EndOfFile 
  = !. { return "EOF"; }
