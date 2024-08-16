"use strict";function peg$subclass(r,t){function n(){this.constructor=r}n.prototype=t.prototype,r.prototype=new n}function peg$SyntaxError(r,t,n,e){this.message=r,this.expected=t,this.found=n,this.location=e,this.name="SyntaxError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(this,peg$SyntaxError)}function peg$parse(r,t){t=void 0!==t?t:{};var n,e={},u={GIFTQuestions:yn},c=yn,o=function(r){return r},a=vn("Category"),i="$",l=gn("$",!1),s="CATEGORY:",f=gn("CATEGORY:",!1),h=function(r){return{type:"Category",title:r}},p=vn("Description"),d=function(r,t){var n={id:te,tags:ne,type:"Description",title:r,stem:t,hasEmbeddedAnswers:!1};return le(),te=null,ne=null,n},g="{",A=gn("{",!1),v="}",m=gn("}",!1),b=function(r,t,n,e){var u=null!==e,c=t?t.text+(u?" ":""):"",o=t&&t.format||e&&e.format||"moodle",a=c+(u?"_____ "+e.text:""),i={type:n.type,title:r,stem:{format:o,text:a},hasEmbeddedAnswers:u};return i=function(r,t){switch(r.globalFeedback=t.globalFeedback,r.type){case"TF":r.isTrue=t.isTrue,r.trueFeedback=t.feedback[0],r.falseFeedback=t.feedback[1];break;case"MC":case"Numerical":case"Short":r.choices=t.choices;break;case"Matching":r.matchPairs=t.matchPairs}"MC"==r.type&&function(r){for(var t=!0,n=0;n<r.length;n++)t&=r[n].isCorrect;return t}(r.choices)&&(r.type="Short");return r.id=te,r.tags=ne,r}(i,n),le(),i},C=vn("{= match1 -> Match1\n...}"),x=function(r,t){return{type:"Matching",matchPairs:r,globalFeedback:t}},y=vn("matches"),F=function(r){return r},w=vn("match"),E="=",k=gn("=",!1),S="->",T=gn("->",!1),$=function(r,t){return{subquestion:{format:null!==r?r.format:ie(),text:null!==r?r.text:""},subanswer:t}},M=vn("{T} or {F} or {TRUE} or {FALSE}"),R=function(r,t,n){return{type:"TF",isTrue:r,feedback:t,globalFeedback:n}},j=function(r){return r},N="TRUE",_=gn("TRUE",!1),L="T",U=gn("T",!1),q=function(){return!0},G="FALSE",O=gn("FALSE",!1),P="F",D=gn("F",!1),Q=function(){return!1},Y=vn("{=correct choice ~incorrect choice ... }"),H=function(r,t){return{type:"MC",choices:r,globalFeedback:t}},I=vn("Choices"),z=function(r){return r},B=vn("Choice"),J=/^[=~]/,K=An(["=","~"],!1,!1),V=function(r,t){var n=r[2],e=r[4];return r={isCorrect:"="==r[0],weight:n,text:e,feedback:t}},W=vn("(weight)"),X="%",Z=gn("%",!1),rr=/^[\-]/,tr=An(["-"],!1,!1),nr=function(r){return parseFloat(r.join(""))},er=vn("(percent)"),ur="100",cr=gn("100",!1),or=/^[0-9]/,ar=An([["0","9"]],!1,!1),ir=/^[.]/,lr=An(["."],!1,!1),sr=function(){return dn()},fr=vn("(feedback)"),hr="#",pr=gn("#",!1),dr="###",gr=gn("###",!1),Ar=function(r){return r},vr=vn("Essay question { ... }"),mr="",br=function(r){return{type:"Essay",globalFeedback:r}},Cr=vn("Single short answer { ... }"),xr=function(r,t,n){var e=[];return e.push({isCorrect:!0,text:r,feedback:t,weight:null}),{type:"Short",choices:e,globalFeedback:n}},yr=vn("{#... }"),Fr=function(r,t){return{type:"Numerical",choices:r,globalFeedback:t}},wr=vn("Numerical Answers"),Er=vn("Multiple Numerical Choices"),kr=vn("Numerical Choice"),Sr=function(r,t){var n=r[0],e=r[1],u=r[2];return r={isCorrect:"="==n,weight:e,text:null!==u?u:{format:ie(),text:"*"},feedback:t}},Tr=vn("Single numeric answer"),$r=vn("(number with range)"),Mr=":",Rr=gn(":",!1),jr=function(r,t){return{type:"range",number:r,range:t}},Nr=vn("(number with high-low)"),_r="..",Lr=gn("..",!1),Ur=function(r,t){return{type:"high-low",numberHigh:t,numberLow:r}},qr=vn("(number answer)"),Gr=function(r){return{type:"simple",number:r}},Or=vn(":: Title ::"),Pr="::",Dr=gn("::",!1),Qr=function(r){return oe(r.join(""))},Yr=vn("Question stem"),Hr=function(r){var t;return t=r.format,ue=t,r},Ir=vn("(blank lines separator)"),zr=vn("(blank lines)"),Br=vn("blank line"),Jr=vn("(Title text)"),Kr=function(r){return r},Vr=vn("(text character)"),Wr=vn("format"),Xr="[",Zr=gn("[",!1),rt="html",tt=gn("html",!1),nt="markdown",et=gn("markdown",!1),ut="plain",ct=gn("plain",!1),ot="moodle",at=gn("moodle",!1),it="]",lt=gn("]",!1),st=function(r){return r},ft=vn("(escape character)"),ht="\\",pt=gn("\\",!1),dt=vn("escape sequence"),gt="~",At=gn("~",!1),vt="n",mt=gn("n",!1),bt=function(r){return ce["\\"+r]},Ct=vn(""),xt={type:"any"},yt=function(){return dn()},Ft=vn("(formatted text excluding '->')"),wt=function(r,t){return function(r,t){let n=null!==r?r:ie(),e=t.join("").replace(/\r\n/g,"\n").trim();return{format:n,text:oe("html"==n||"markdown"==n?e:ae(e))}}(r,t)},Et=vn("(formatted text)"),kt=vn("(unformatted text)"),St=function(r){return ae(r.join("").trim())},Tt=vn("(category text)"),$t=function(r){return r.flat().join("")},Mt=function(){return parseFloat(dn())},Rt=".",jt=gn(".",!1),Nt=/^[+\-]/,_t=An(["+","-"],!1,!1),Lt="####",Ut=gn("####",!1),qt=function(r){return r},Gt=vn("(single line whitespace)"),Ot=vn("(multiple line whitespace)"),Pt=" ",Dt=gn(" ",!1),Qt=function(){te=null,ne=null},Yt=vn("(comment)"),Ht="//",It=gn("//",!1),zt=/^[^\n\r]/,Bt=An(["\n","\r"],!0,!1),Jt=function(r){return null},Kt=function(r){var t=r.join(""),n=t.match(/\[id:([^\x00-\x1F\x7F]+?)]/);n&&(te=n[1].trim().replace("\\]","]"));t.matchAll(/\[tag:([^\x00-\x1F\x7F]+?)]/g);return Array.from(t.matchAll(/\[tag:([^\x00-\x1F\x7F]+?)]/g),(function(r){return r[1]})).forEach((function(r){ne||(ne=[]),ne.push(r)})),null},Vt=vn("(space)"),Wt="\t",Xt=gn("\t",!1),Zt=vn("(end of line)"),rn="\r\n",tn=gn("\r\n",!1),nn="\n",en=gn("\n",!1),un="\r",cn=gn("\r",!1),on=function(){return"EOF"},an=0,ln=0,sn=[{line:1,column:1}],fn=0,hn=[],pn=0;if("startRule"in t){if(!(t.startRule in u))throw new Error("Can't start parsing from rule \""+t.startRule+'".');c=u[t.startRule]}function dn(){return r.substring(ln,an)}function gn(r,t){return{type:"literal",text:r,ignoreCase:t}}function An(r,t,n){return{type:"class",parts:r,inverted:t,ignoreCase:n}}function vn(r){return{type:"other",description:r}}function mn(t){var n,e=sn[t];if(e)return e;for(n=t-1;!sn[n];)n--;for(e={line:(e=sn[n]).line,column:e.column};n<t;)10===r.charCodeAt(n)?(e.line++,e.column=1):e.column++,n++;return sn[t]=e,e}function bn(r,t){var n=mn(r),e=mn(t);return{start:{offset:r,line:n.line,column:n.column},end:{offset:t,line:e.line,column:e.column}}}function Cn(r){an<fn||(an>fn&&(fn=an,hn=[]),hn.push(r))}function xn(r,t,n){return new peg$SyntaxError(peg$SyntaxError.buildMessage(r,t),r,t,n)}function yn(){var r,t,n;if(r=an,t=[],(n=Fn())===e&&(n=wn())===e&&(n=En()),n!==e)for(;n!==e;)t.push(n),(n=Fn())===e&&(n=wn())===e&&(n=En());else t=e;return t!==e&&(n=Jn())!==e&&Kn()!==e?(ln=r,r=t=o(t)):(an=r,r=e),r}function Fn(){var t,n,u,c;return pn++,t=an,Vn()!==e&&Kn()!==e?(36===r.charCodeAt(an)?(n=i,an++):(n=e,0===pn&&Cn(l)),n!==e?(r.substr(an,9)===s?(u=s,an+=9):(u=e,0===pn&&Cn(f)),u!==e&&Jn()!==e?(c=function(){var t,n,u,c,o;pn++,t=an,n=[],u=an,c=an,pn++,o=Zn(),pn--,o===e?c=void 0:(an=c,c=e);c!==e?(r.length>an?(o=r.charAt(an),an++):(o=e,0===pn&&Cn(xt)),o!==e?u=c=[c,o]:(an=u,u=e)):(an=u,u=e);for(;u!==e;)n.push(u),u=an,c=an,pn++,o=Zn(),pn--,o===e?c=void 0:(an=c,c=e),c!==e?(r.length>an?(o=r.charAt(an),an++):(o=e,0===pn&&Cn(xt)),o!==e?u=c=[c,o]:(an=u,u=e)):(an=u,u=e);n!==e?(u=an,pn++,(c=Zn())===e&&(c=re()),pn--,c!==e?(an=u,u=void 0):u=e,u!==e?(ln=t,t=n=$t(n)):(an=t,t=e)):(an=t,t=e);pn--,t===e&&(n=e,0===pn&&Cn(Tt));return t}(),c!==e&&_n()!==e?(ln=t,t=h(c)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e),pn--,t===e&&(e,0===pn&&Cn(a)),t}function wn(){var r,t,n,u;if(pn++,r=an,Vn()!==e)if(Kn()!==e){for(t=[],n=Wn();n!==e;)t.push(n),n=Wn();t!==e?((n=jn())===e&&(n=null),n!==e&&Jn()!==e&&(u=Nn())!==e&&_n()!==e?(ln=r,r=d(n,u)):(an=r,r=e)):(an=r,r=e)}else an=r,r=e;else an=r,r=e;return pn--,r===e&&(e,0===pn&&Cn(p)),r}function En(){var t,n,u,c,o,a,i,l;if(t=an,Vn()!==e)if(Kn()!==e){for(n=[],u=Wn();u!==e;)n.push(u),u=Wn();n!==e?((u=jn())===e&&(u=null),u!==e&&Jn()!==e?((c=Nn())===e&&(c=null),c!==e&&Jn()!==e?(123===r.charCodeAt(an)?(o=g,an++):(o=e,0===pn&&Cn(A)),o!==e&&Jn()!==e?(a=function(){var r,t,n;pn++,r=an,t=function(){var r,t,n;if(pn++,r=an,t=[],n=kn(),n!==e)for(;n!==e;)t.push(n),n=kn();else t=e;t!==e&&(ln=r,t=F(t));r=t,pn--,r===e&&(t=e,0===pn&&Cn(y));return r}(),t!==e&&Jn()!==e?((n=Bn())===e&&(n=null),n!==e&&Jn()!==e?(ln=r,r=t=x(t,n)):(an=r,r=e)):(an=r,r=e);pn--,r===e&&(t=e,0===pn&&Cn(C));return r}(),a===e&&(a=function(){var t,n,u,c,o;pn++,t=an,n=function(){var t,n;t=an,n=function(){var t,n;t=an,r.substr(an,4)===N?(n=N,an+=4):(n=e,0===pn&&Cn(_));n===e&&(84===r.charCodeAt(an)?(n=L,an++):(n=e,0===pn&&Cn(U)));n!==e&&(ln=t,n=q());return t=n,t}(),n===e&&(n=function(){var t,n;t=an,r.substr(an,5)===G?(n=G,an+=5):(n=e,0===pn&&Cn(O));n===e&&(70===r.charCodeAt(an)?(n=P,an++):(n=e,0===pn&&Cn(D)));n!==e&&(ln=t,n=Q());return t=n,t}());n!==e&&(ln=t,n=j(n));return t=n,t}(),n!==e&&Jn()!==e?(u=an,(c=$n())===e&&(c=null),c!==e?((o=$n())===e&&(o=null),o!==e?u=c=[c,o]:(an=u,u=e)):(an=u,u=e),u!==e&&(c=Jn())!==e?((o=Bn())===e&&(o=null),o!==e?(ln=t,t=n=R(n,u,o)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e);pn--,t===e&&(n=e,0===pn&&Cn(M));return t}(),a===e&&(a=function(){var r,t,n;pn++,r=an,t=function(){var r,t,n;if(pn++,r=an,t=[],n=Sn(),n!==e)for(;n!==e;)t.push(n),n=Sn();else t=e;t!==e&&(ln=r,t=z(t));r=t,pn--,r===e&&(t=e,0===pn&&Cn(I));return r}(),t!==e&&Jn()!==e?((n=Bn())===e&&(n=null),n!==e&&Jn()!==e?(ln=r,r=t=H(t,n)):(an=r,r=e)):(an=r,r=e);pn--,r===e&&(t=e,0===pn&&Cn(Y));return r}(),a===e&&(a=function(){var t,n,u,c;pn++,t=an,35===r.charCodeAt(an)?(n=hr,an++):(n=e,0===pn&&Cn(pr));n!==e&&Jn()!==e?(u=function(){var r;pn++,r=function(){var r,t,n;if(pn++,r=an,t=[],n=Mn(),n!==e)for(;n!==e;)t.push(n),n=Mn();else t=e;t!==e&&(ln=r,t=z(t));r=t,pn--,r===e&&(t=e,0===pn&&Cn(Er));return r}(),r===e&&(r=Rn());pn--,r===e&&(e,0===pn&&Cn(wr));return r}(),u!==e&&Jn()!==e?((c=Bn())===e&&(c=null),c!==e?(ln=t,t=n=Fr(u,c)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e);pn--,t===e&&(n=e,0===pn&&Cn(yr));return t}(),a===e&&(a=function(){var r,t,n,u;pn++,r=an,t=Hn(),t!==e&&Jn()!==e?((n=$n())===e&&(n=null),n!==e&&Jn()!==e?((u=Bn())===e&&(u=null),u!==e&&Jn()!==e?(ln=r,r=t=xr(t,n,u)):(an=r,r=e)):(an=r,r=e)):(an=r,r=e);pn--,r===e&&(t=e,0===pn&&Cn(Cr));return r}(),a===e&&(a=function(){var r,t,n;pn++,r=an,t=mr,t!==e&&Jn()!==e?((n=Bn())===e&&(n=null),n!==e&&Jn()!==e?(ln=r,r=t=br(n)):(an=r,r=e)):(an=r,r=e);pn--,r===e&&(t=e,0===pn&&Cn(vr));return r}()))))),a!==e&&Jn()!==e?(125===r.charCodeAt(an)?(i=v,an++):(i=e,0===pn&&Cn(m)),i!==e&&Jn()!==e?(l=function(){var t,n,u,c;pn++,t=an,r.substr(an,2)===Ht?(n=Ht,an+=2):(n=e,0===pn&&Cn(It));if(n!==e){for(u=[],zt.test(r.charAt(an))?(c=r.charAt(an),an++):(c=e,0===pn&&Cn(Bt));c!==e;)u.push(c),zt.test(r.charAt(an))?(c=r.charAt(an),an++):(c=e,0===pn&&Cn(Bt));u!==e?(ln=t,t=n=Jt(u)):(an=t,t=e)}else an=t,t=e;pn--,t===e&&(n=e,0===pn&&Cn(Yt));return t}(),l===e&&(l=Nn()),l===e&&(l=null),l!==e&&_n()!==e?(ln=t,t=b(u,c,a,l)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e)}else an=t,t=e;else an=t,t=e;return t}function kn(){var t,n,u,c,o;return pn++,t=an,Jn()!==e?(61===r.charCodeAt(an)?(n=E,an++):(n=e,0===pn&&Cn(k)),n!==e&&Jn()!==e?(u=function(){var r,t,n,u;pn++,r=an,t=On(),t===e&&(t=null);if(t!==e)if(Jn()!==e){if(n=[],(u=Gn())!==e)for(;u!==e;)n.push(u),u=Gn();else n=e;n!==e?(ln=r,r=t=wt(t,n)):(an=r,r=e)}else an=r,r=e;else an=r,r=e;pn--,r===e&&(t=e,0===pn&&Cn(Ft));return r}(),u===e&&(u=null),u!==e&&Jn()!==e?(r.substr(an,2)===S?(c=S,an+=2):(c=e,0===pn&&Cn(T)),c!==e&&Jn()!==e?(o=function(){var r,t,n;if(pn++,r=an,t=[],n=qn(),n!==e)for(;n!==e;)t.push(n),n=qn();else t=e;t!==e&&(ln=r,t=St(t));r=t,pn--,r===e&&(t=e,0===pn&&Cn(kt));return r}(),o!==e&&Jn()!==e?(ln=t,t=$(u,o)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e),pn--,t===e&&(e,0===pn&&Cn(w)),t}function Sn(){var t,n,u,c,o,a,i;return pn++,t=an,Jn()!==e?(n=an,J.test(r.charAt(an))?(u=r.charAt(an),an++):(u=e,0===pn&&Cn(K)),u!==e&&(c=Jn())!==e?((o=Tn())===e&&(o=null),o!==e&&(a=Jn())!==e&&(i=Hn())!==e?n=u=[u,c,o,a,i]:(an=n,n=e)):(an=n,n=e),n!==e?((u=$n())===e&&(u=null),u!==e&&(c=Jn())!==e?(ln=t,t=V(n,u)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e),pn--,t===e&&(e,0===pn&&Cn(B)),t}function Tn(){var t,n,u,c,o;return pn++,t=an,37===r.charCodeAt(an)?(n=X,an++):(n=e,0===pn&&Cn(Z)),n!==e?(u=an,rr.test(r.charAt(an))?(c=r.charAt(an),an++):(c=e,0===pn&&Cn(tr)),c===e&&(c=null),c!==e?(o=function(){var t,n,u,c,o,a;pn++,r.substr(an,3)===ur?(t=ur,an+=3):(t=e,0===pn&&Cn(cr));if(t===e)if(t=an,or.test(r.charAt(an))?(n=r.charAt(an),an++):(n=e,0===pn&&Cn(ar)),n!==e)if(or.test(r.charAt(an))?(u=r.charAt(an),an++):(u=e,0===pn&&Cn(ar)),u===e&&(u=null),u!==e)if(ir.test(r.charAt(an))?(c=r.charAt(an),an++):(c=e,0===pn&&Cn(lr)),c===e&&(c=null),c!==e){for(o=[],or.test(r.charAt(an))?(a=r.charAt(an),an++):(a=e,0===pn&&Cn(ar));a!==e;)o.push(a),or.test(r.charAt(an))?(a=r.charAt(an),an++):(a=e,0===pn&&Cn(ar));o!==e?(ln=t,t=n=sr()):(an=t,t=e)}else an=t,t=e;else an=t,t=e;else an=t,t=e;pn--,t===e&&(n=e,0===pn&&Cn(er));return t}(),o!==e?u=c=[c,o]:(an=u,u=e)):(an=u,u=e),u!==e?(37===r.charCodeAt(an)?(c=X,an++):(c=e,0===pn&&Cn(Z)),c!==e?(ln=t,t=n=nr(u)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e),pn--,t===e&&(n=e,0===pn&&Cn(W)),t}function $n(){var t,n,u,c,o;return pn++,t=an,35===r.charCodeAt(an)?(n=hr,an++):(n=e,0===pn&&Cn(pr)),n!==e?(u=an,pn++,r.substr(an,3)===dr?(c=dr,an+=3):(c=e,0===pn&&Cn(gr)),pn--,c===e?u=void 0:(an=u,u=e),u!==e&&(c=Jn())!==e?((o=Hn())===e&&(o=null),o!==e?(ln=t,t=n=Ar(o)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e),pn--,t===e&&(n=e,0===pn&&Cn(fr)),t}function Mn(){var t,n,u,c,o;return pn++,t=an,Jn()!==e?(n=an,J.test(r.charAt(an))?(u=r.charAt(an),an++):(u=e,0===pn&&Cn(K)),u!==e?((c=Tn())===e&&(c=null),c!==e?((o=Rn())===e&&(o=null),o!==e?n=u=[u,c,o]:(an=n,n=e)):(an=n,n=e)):(an=n,n=e),n!==e&&(u=Jn())!==e?((c=$n())===e&&(c=null),c!==e&&(o=Jn())!==e?(ln=t,t=Sr(n,c)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e),pn--,t===e&&(e,0===pn&&Cn(kr)),t}function Rn(){var t;return pn++,t=function(){var t,n,u,c;pn++,t=an,n=In(),n!==e?(58===r.charCodeAt(an)?(u=Mr,an++):(u=e,0===pn&&Cn(Rr)),u!==e&&(c=In())!==e?(ln=t,t=n=jr(n,c)):(an=t,t=e)):(an=t,t=e);pn--,t===e&&(n=e,0===pn&&Cn($r));return t}(),t===e&&(t=function(){var t,n,u,c;pn++,t=an,n=In(),n!==e?(r.substr(an,2)===_r?(u=_r,an+=2):(u=e,0===pn&&Cn(Lr)),u!==e&&(c=In())!==e?(ln=t,t=n=Ur(n,c)):(an=t,t=e)):(an=t,t=e);pn--,t===e&&(n=e,0===pn&&Cn(Nr));return t}(),t===e&&(t=function(){var r,t;pn++,r=an,t=In(),t!==e&&(ln=r,t=Gr(t));r=t,pn--,r===e&&(t=e,0===pn&&Cn(qr));return r}())),pn--,t===e&&(e,0===pn&&Cn(Tr)),t}function jn(){var t,n,u,c;if(pn++,t=an,r.substr(an,2)===Pr?(n=Pr,an+=2):(n=e,0===pn&&Cn(Dr)),n!==e){if(u=[],(c=Un())!==e)for(;c!==e;)u.push(c),c=Un();else u=e;u!==e?(r.substr(an,2)===Pr?(c=Pr,an+=2):(c=e,0===pn&&Cn(Dr)),c!==e?(ln=t,t=n=Qr(u)):(an=t,t=e)):(an=t,t=e)}else an=t,t=e;return pn--,t===e&&(n=e,0===pn&&Cn(Or)),t}function Nn(){var r,t;return pn++,r=an,(t=Hn())!==e&&(ln=r,t=Hr(t)),pn--,(r=t)===e&&(t=e,0===pn&&Cn(Yr)),r}function _n(){var r,t,n;return pn++,r=function(){var r,t,n,u;if(pn++,r=an,t=Zn(),t!==e){if(n=[],(u=Ln())!==e)for(;u!==e;)n.push(u),u=Ln();else n=e;n!==e?r=t=[t,n]:(an=r,r=e)}else an=r,r=e;pn--,r===e&&(t=e,0===pn&&Cn(zr));return r}(),r===e&&(r=an,(t=Zn())===e&&(t=null),t!==e&&(n=re())!==e?r=t=[t,n]:(an=r,r=e)),pn--,r===e&&(t=e,0===pn&&Cn(Ir)),r}function Ln(){var r,t,n;for(pn++,r=an,t=[],n=Xn();n!==e;)t.push(n),n=Xn();return t!==e&&(n=Zn())!==e?r=t=[t,n]:(an=r,r=e),pn--,r===e&&(t=e,0===pn&&Cn(Br)),r}function Un(){var t,n,u;return pn++,t=an,n=an,pn++,r.substr(an,2)===Pr?(u=Pr,an+=2):(u=e,0===pn&&Cn(Dr)),pn--,u===e?n=void 0:(an=n,n=e),n!==e?((u=Dn())===e&&(u=Qn()),u!==e?(ln=t,t=n=Kr(u)):(an=t,t=e)):(an=t,t=e),pn--,t===e&&(n=e,0===pn&&Cn(Jr)),t}function qn(){var r;return pn++,(r=Qn())===e&&(r=Dn())===e&&(r=Pn()),pn--,r===e&&(e,0===pn&&Cn(Vr)),r}function Gn(){var t;return pn++,t=function(){var t,n,u;pn++,t=an,n=an,pn++,(u=Dn())===e&&(u=Yn())===e&&(r.substr(an,2)===S?(u=S,an+=2):(u=e,0===pn&&Cn(T)),u===e&&(u=_n()));pn--,u===e?n=void 0:(an=n,n=e);n!==e?(r.length>an?(u=r.charAt(an),an++):(u=e,0===pn&&Cn(xt)),u!==e?(ln=t,t=n=yt()):(an=t,t=e)):(an=t,t=e);pn--,t===e&&(n=e,0===pn&&Cn(Ct));return t}(),t===e&&(t=Dn())===e&&(t=Pn()),pn--,t===e&&(e,0===pn&&Cn(Vr)),t}function On(){var t,n,u,c;return pn++,t=an,91===r.charCodeAt(an)?(n=Xr,an++):(n=e,0===pn&&Cn(Zr)),n!==e?(r.substr(an,4)===rt?(u=rt,an+=4):(u=e,0===pn&&Cn(tt)),u===e&&(r.substr(an,8)===nt?(u=nt,an+=8):(u=e,0===pn&&Cn(et)),u===e&&(r.substr(an,5)===ut?(u=ut,an+=5):(u=e,0===pn&&Cn(ct)),u===e&&(r.substr(an,6)===ot?(u=ot,an+=6):(u=e,0===pn&&Cn(at))))),u!==e?(93===r.charCodeAt(an)?(c=it,an++):(c=e,0===pn&&Cn(lt)),c!==e?(ln=t,t=n=st(u)):(an=t,t=e)):(an=t,t=e)):(an=t,t=e),pn--,t===e&&(n=e,0===pn&&Cn(Wr)),t}function Pn(){var t;return pn++,92===r.charCodeAt(an)?(t=ht,an++):(t=e,0===pn&&Cn(pt)),pn--,t===e&&(e,0===pn&&Cn(ft)),t}function Dn(){var t,n,u;return pn++,t=an,92===r.charCodeAt(an)?(n=ht,an++):(n=e,0===pn&&Cn(pt)),n!==e?(92===r.charCodeAt(an)?(u=ht,an++):(u=e,0===pn&&Cn(pt)),u===e&&(58===r.charCodeAt(an)?(u=Mr,an++):(u=e,0===pn&&Cn(Rr)),u===e&&(35===r.charCodeAt(an)?(u=hr,an++):(u=e,0===pn&&Cn(pr)),u===e&&(61===r.charCodeAt(an)?(u=E,an++):(u=e,0===pn&&Cn(k)),u===e&&(123===r.charCodeAt(an)?(u=g,an++):(u=e,0===pn&&Cn(A)),u===e&&(125===r.charCodeAt(an)?(u=v,an++):(u=e,0===pn&&Cn(m)),u===e&&(126===r.charCodeAt(an)?(u=gt,an++):(u=e,0===pn&&Cn(At)),u===e&&(110===r.charCodeAt(an)?(u=vt,an++):(u=e,0===pn&&Cn(mt))))))))),u!==e?(ln=t,t=n=bt(u)):(an=t,t=e)):(an=t,t=e),pn--,t===e&&(n=e,0===pn&&Cn(dt)),t}function Qn(){var t,n,u;return pn++,t=an,n=an,pn++,(u=Dn())===e&&(u=Yn())===e&&(u=_n()),pn--,u===e?n=void 0:(an=n,n=e),n!==e?(r.length>an?(u=r.charAt(an),an++):(u=e,0===pn&&Cn(xt)),u!==e?(ln=t,t=n=yt()):(an=t,t=e)):(an=t,t=e),pn--,t===e&&(n=e,0===pn&&Cn(Ct)),t}function Yn(){var t;return 61===r.charCodeAt(an)?(t=E,an++):(t=e,0===pn&&Cn(k)),t===e&&(126===r.charCodeAt(an)?(t=gt,an++):(t=e,0===pn&&Cn(At)),t===e&&(35===r.charCodeAt(an)?(t=hr,an++):(t=e,0===pn&&Cn(pr)),t===e&&(123===r.charCodeAt(an)?(t=g,an++):(t=e,0===pn&&Cn(A)),t===e&&(125===r.charCodeAt(an)?(t=v,an++):(t=e,0===pn&&Cn(m)),t===e&&(92===r.charCodeAt(an)?(t=ht,an++):(t=e,0===pn&&Cn(pt)),t===e&&(58===r.charCodeAt(an)?(t=Mr,an++):(t=e,0===pn&&Cn(Rr)))))))),t}function Hn(){var r,t,n,u;if(pn++,r=an,(t=On())===e&&(t=null),t!==e)if(Jn()!==e){if(n=[],(u=qn())!==e)for(;u!==e;)n.push(u),u=qn();else n=e;n!==e?(ln=r,r=t=wt(t,n)):(an=r,r=e)}else an=r,r=e;else an=r,r=e;return pn--,r===e&&(t=e,0===pn&&Cn(Et)),r}function In(){var t,n,u;return t=an,n=function(){var t;Nt.test(r.charAt(an))?(t=r.charAt(an),an++):(t=e,0===pn&&Cn(_t));return t}(),n===e&&(n=null),n!==e?(u=function(){var t,n,u,c,o;t=an,n=zn(),n!==e?(u=an,46===r.charCodeAt(an)?(c=Rt,an++):(c=e,0===pn&&Cn(jt)),c!==e&&(o=zn())!==e?u=c=[c,o]:(an=u,u=e),u===e&&(u=null),u!==e?t=n=[n,u]:(an=t,t=e)):(an=t,t=e);return t}(),u!==e?(ln=t,t=n=Mt()):(an=t,t=e)):(an=t,t=e),t}function zn(){var t,n;if(t=[],or.test(r.charAt(an))?(n=r.charAt(an),an++):(n=e,0===pn&&Cn(ar)),n!==e)for(;n!==e;)t.push(n),or.test(r.charAt(an))?(n=r.charAt(an),an++):(n=e,0===pn&&Cn(ar));else t=e;return t}function Bn(){var t,n,u;return t=an,r.substr(an,4)===Lt?(n=Lt,an+=4):(n=e,0===pn&&Cn(Ut)),n!==e&&Jn()!==e&&(u=Hn())!==e&&Jn()!==e?(ln=t,t=n=qt(u)):(an=t,t=e),t}function Jn(){var r,t,n,u,c;for(pn++,r=[],(t=Xn())===e&&(t=an,(n=Zn())!==e?(u=an,pn++,c=Ln(),pn--,c===e?u=void 0:(an=u,u=e),u!==e?t=n=[n,u]:(an=t,t=e)):(an=t,t=e));t!==e;)r.push(t),(t=Xn())===e&&(t=an,(n=Zn())!==e?(u=an,pn++,c=Ln(),pn--,c===e?u=void 0:(an=u,u=e),u!==e?t=n=[n,u]:(an=t,t=e)):(an=t,t=e));return pn--,r===e&&(t=e,0===pn&&Cn(Gt)),r}function Kn(){var r,t;for(pn++,r=[],(t=Wn())===e&&(t=Zn())===e&&(t=Xn());t!==e;)r.push(t),(t=Wn())===e&&(t=Zn())===e&&(t=Xn());return pn--,r===e&&(t=e,0===pn&&Cn(Ot)),r}function Vn(){var t,n,u,c;for(t=an,n=an,pn++,u=[],32===r.charCodeAt(an)?(c=Pt,an++):(c=e,0===pn&&Cn(Dt));c!==e;)u.push(c),32===r.charCodeAt(an)?(c=Pt,an++):(c=e,0===pn&&Cn(Dt));return pn--,u!==e?(an=n,n=void 0):n=e,n!==e&&(ln=t,n=Qt()),t=n}function Wn(){var t,n,u,c;if(pn++,t=an,r.substr(an,2)===Ht?(n=Ht,an+=2):(n=e,0===pn&&Cn(It)),n!==e){for(u=[],zt.test(r.charAt(an))?(c=r.charAt(an),an++):(c=e,0===pn&&Cn(Bt));c!==e;)u.push(c),zt.test(r.charAt(an))?(c=r.charAt(an),an++):(c=e,0===pn&&Cn(Bt));u!==e?(ln=t,t=n=Kt(u)):(an=t,t=e)}else an=t,t=e;return pn--,t===e&&(n=e,0===pn&&Cn(Yt)),t}function Xn(){var t;return pn++,32===r.charCodeAt(an)?(t=Pt,an++):(t=e,0===pn&&Cn(Dt)),t===e&&(9===r.charCodeAt(an)?(t=Wt,an++):(t=e,0===pn&&Cn(Xt))),pn--,t===e&&(e,0===pn&&Cn(Vt)),t}function Zn(){var t;return pn++,r.substr(an,2)===rn?(t=rn,an+=2):(t=e,0===pn&&Cn(tn)),t===e&&(10===r.charCodeAt(an)?(t=nn,an++):(t=e,0===pn&&Cn(en)),t===e&&(13===r.charCodeAt(an)?(t=un,an++):(t=e,0===pn&&Cn(cn)))),pn--,t===e&&(e,0===pn&&Cn(Zt)),t}function re(){var t,n,u;return t=an,n=an,pn++,r.length>an?(u=r.charAt(an),an++):(u=e,0===pn&&Cn(xt)),pn--,u===e?n=void 0:(an=n,n=e),n!==e&&(ln=t,n=on()),t=n}var te=null,ne=null,ee="moodle",ue=ee;const ce={"\\\\":"&&092;","\\:":"&&058;","\\#":"&&035;","\\=":"&&061;","\\{":"&&123;","\\}":"&&125;","\\~":"&&126;","\\n":"&&010"};function oe(r){return r.replace(/&&092;/g,"\\").replace(/&&058;/g,":").replace(/&&035;/g,"#").replace(/&&061;/g,"=").replace(/&&123;/g,"{").replace(/&&125;/g,"}").replace(/&&126;/g,"~").replace(/&&010/g,"\n")}function ae(r){return(r=r.replace(/[\n\r]/g," ")).replace(/\s\s+/g," ")}function ie(){return ue}function le(){ue=ee}if((n=c())!==e&&an===r.length)return n;throw n!==e&&an<r.length&&Cn({type:"end"}),xn(hn,fn<r.length?r.charAt(fn):null,fn<r.length?bn(fn,fn+1):bn(fn,fn))}peg$subclass(peg$SyntaxError,Error),peg$SyntaxError.buildMessage=function(r,t){var n={literal:function(r){return'"'+u(r.text)+'"'},class:function(r){var t,n="";for(t=0;t<r.parts.length;t++)n+=r.parts[t]instanceof Array?c(r.parts[t][0])+"-"+c(r.parts[t][1]):c(r.parts[t]);return"["+(r.inverted?"^":"")+n+"]"},any:function(r){return"any character"},end:function(r){return"end of input"},other:function(r){return r.description}};function e(r){return r.charCodeAt(0).toString(16).toUpperCase()}function u(r){return r.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(r){return"\\x0"+e(r)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(r){return"\\x"+e(r)}))}function c(r){return r.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(r){return"\\x0"+e(r)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(r){return"\\x"+e(r)}))}return"Expected "+function(r){var t,e,u,c=new Array(r.length);for(t=0;t<r.length;t++)c[t]=(u=r[t],n[u.type](u));if(c.sort(),c.length>0){for(t=1,e=1;t<c.length;t++)c[t-1]!==c[t]&&(c[e]=c[t],e++);c.length=e}switch(c.length){case 1:return c[0];case 2:return c[0]+" or "+c[1];default:return c.slice(0,-1).join(", ")+", or "+c[c.length-1]}}(r)+" but "+function(r){return r?'"'+u(r)+'"':"end of input"}(t)+" found."},module.exports={SyntaxError:peg$SyntaxError,parse:peg$parse};
