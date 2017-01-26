# GIFT-grammar-PEG.js
Development of PEG grammar to parse [GIFT (quiz question) file format](https://en.wikipedia.org/wiki/GIFT_(file_format)). The goal is to find an intuitive and fun way to create quiz questions.

Initial hacking done using https://pegjs.org/online

The grammar.txt file goes on the left and the test input.txt goes on the right (intuitive?) 

## Background information
See these discussions in the Moodle forums: 
 - https://moodle.org/mod/forum/discuss.php?d=259533 ["Creating 100 multichoice questions is quicker using GIFT."](https://moodle.org/mod/forum/discuss.php?d=259533#p1177669) --[Derek Chirnside](https://moodle.org/user/view.php?id=191052&course=5)
 - https://moodle.org/mod/forum/discuss.php?d=346431 (suggesting using PEG.js with the GIFT spec)
 
 Here's a test file from Moodle's code base: https://git.moodle.org/gw?p=moodle.git;a=blob;f=question/format/gift/examples.txt;h=e65d4f0db6415e2f318f1d024864b33c75f80c69;hb=refs/heads/MOODLE_26_STABLE
