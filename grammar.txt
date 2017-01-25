Expression
  = Spacing Rule+ EndOfFile

Rule
  = title:QuestionTitle? stem:QuestionStem questionType:SpecificQuestionDetails Space* EndOfLine* 
  { return questionType + ' question:\n ' + title + "\n" + stem }
   / Comment EndOfLine*

SpecificQuestionDetails "(specific question details)"
  = TrueFalseQuestion / MCQuestion
 
TrueFalseQuestion "True/False Question"
  = '{' __ answer:(TrueOrFalseType Feedback? Feedback?) __ '}' { return answer[0] + "\nfeedback1:" + answer[1] + "\nfeedback2:" + answer[2] + "\n"; }

TrueOrFalseType "(true or false type)"
  = TrueType / FalseType
  
TrueType "(true type)"
  = 'TRUE'i / 't'i {return "TRUE"} // appending i after a literal makes it case insensitive

FalseType "(false type)"
  = 'FALSE'i / 'F'i {return "FALSE"}

MCQuestion "Multiple-choice Question"
  = '{' choices:(Choices)+ '}' { return "Multiple-choice:" + choices; }

Choices "Choices"
  = choices:(Choice)+ { return choices; }
 
Choice "Choice"
  = __ choice:([=~] Text) feedback:Feedback? __ 
    { return '\n' + (choice[0]=='=' ? 'correct ' : 'incorrect ') + 'choice: ' 
        + choice[1] + '\nfeedback:' + feedback }
//  = __ choice:(CorrectChoice / IncorrectChoice) feedback:Feedback? __

Feedback "feedback" 
  = '#' feedback:Text { return feedback }

QuestionTitle
  = '::' title:Title '::' { return ' title: ' + title }
  
QuestionStem
  = stem:RichText { return ' stem: ' + stem; }

Text "(text)"
  = [A-Za-z0-9 .+!?]+ { return text() } 

RichText
  = Text* { return 'RichText:' + text() } 

Title
  = Text* { return text() }

_ "whitespace"
  = [ \t]*

__ "(whitespace)"
  = (EndOfLine / Space)*

Spacing 
  = (Space / Comment)*
Comment 
  = '//' (!EndOfLine .)* EndOfLine { return null }
Space "(space)"
  = ' ' / '\t'
EndOfLine "(end of line)"
  = '\r\n' / '\n' / '\r'
EndOfFile 
  = !. { return "EOF"; }
