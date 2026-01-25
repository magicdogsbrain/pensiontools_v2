(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();function Cp(n){const t=(n.sippDraw||0)+(n.other||0)+(n.statePension||0),e=t*12,r=n.pa||12570,s=n.brl||50270,i=n.hrl||125140;let a=0;e>r&&(e<=s?a=(e-r)*.2:e<=i?a=(s-r)*.2+(e-s)*.4:a=(s-r)*.2+(i-s)*.4+(e-i)*.45);const l=a/12,c=t-l+(n.isaDraw||0);return{date:n.date,taxYear:n.taxYear,yearNum:n.yearNumber,equity:n.equity,bond:n.bond,cash:n.cash,total:n.equity+n.bond+n.cash,adjEquity:n.adjEquityMin,adjBond:n.adjBondMin,adjCash:n.adjCashTarget,source:n.source,dEquity:n.drawFromEquity||0,dBond:n.drawFromBond||0,dCash:n.drawFromCash||0,sipp:n.sippDraw,stdSipp:n.stdSipp||n.sippDraw,isa:n.isaDraw,other:n.other,state:n.statePension,pa:r,brl:s,monthlyTax:l,monthlyNet:c,mode:n.taxEfficient?"Tax-Efficient":"Standard",inProtection:n.inProtection,reason:n.protectionReason||"",consecutiveDraws:n.consecutiveCashDraws||0,boostAmount:n.boostAmount,boostEligible:n.boostEligible||!1,rebal:n.rebalanceActions?n.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:n.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:n.isaDraw||0,cumulativeIsaSavingsUsed:n.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxPaidYTD:n.taxPaidYTD||l,taxProjectedAnnual:n.taxProjectedAnnual||a,taxSavedMonthly:n.taxSavedMonthly||0,taxSavedYTD:n.taxSavedYTD||0,taxSavedProjectedAnnual:n.taxSavedProjectedAnnual||0,isTaxEfficientYear:n.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:n.protectionInducedTaxEfficiency||!1,remainingMonths:n.remainingMonths||12}}const Ti={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},Ed="6.0.0",ie={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},bd={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},te={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},Qo={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},Cs={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},Ha={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},kp={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},Ae={START_MONTH:4,START_DAY:6};function Dp(n,t,e,r=ie.HIGHER_RATE_LIMIT){if(n<=0)return 0;let s=t;if(n>ie.PA_TAPER_THRESHOLD){const f=(n-ie.PA_TAPER_THRESHOLD)*ie.PA_TAPER_RATE;s=Math.max(0,t-f)}const i=Math.max(0,n-s),a=Math.max(0,e-s),l=r-e;let c=0;const d=Math.min(i,a);if(c+=d*ie.BASIC_RATE,i>a){const f=Math.min(i-a,l);c+=f*ie.HIGHER_RATE}if(i>a+l){const f=i-a-l;c+=f*ie.ADDITIONAL_RATE}return c}function Wa(n){const t=typeof n=="string"?new Date(n):n,e=t.getFullYear(),r=t.getMonth()+1,s=t.getDate();if(r<Ae.START_MONTH||r===Ae.START_MONTH&&s<Ae.START_DAY){const i=e-1;return`${String(i).slice(-2)}/${String(e).slice(-2)}`}return`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function Mp(n){const t=parseInt(n.split("/")[0]),e=t<50?2e3+t:1900+t;return new Date(e,Ae.START_MONTH-1,Ae.START_DAY)}function Np(n){const t=parseInt(n.split("/")[1]),e=t<50?2e3+t:1900+t;return new Date(e,Ae.START_MONTH-1,Ae.START_DAY-1)}function Lp(){const n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function Td(n){const[t,e]=n.split("-").map(Number);return new Date(t,e-1,15)}function Vp(n){const e=(typeof n=="string"?new Date(n):n).getMonth()+1;return e>=Ae.START_MONTH?12-(e-Ae.START_MONTH):Ae.START_MONTH-e}function Op(n){const{baseSalary:t,cumulativeInflation:e,yearlyInflation:r=[],other:s=0,statePension:i=0,statePensionYear:a=12,yearNumber:l=0,pa:c,brl:d,hrl:f,taxMode:m="inflates"}=n,v=m==="frozen"?c:c*e,E=m==="frozen"?d:d*e,T=m==="frozen"?f:f*e,x=t*e,R=Bp(s,r),A=l>=a?i*e:0,D=R+A,C=Math.max(0,E-D),V=Math.max(0,x-D),O=Math.min(C,V);return{pa:v,brl:E,hrl:T,targetGross:x,other:R,statePension:A,fixedIncome:D,annualSippDraw:O,monthlySippDraw:O/12,sippPlusfixedAtBRL:C+D===E}}function Bp(n,t,e=bd.OTHER_INCOME_CAP){let r=n;for(const s of t)r*=1+Math.min(s,e);return r}function Fp(n,t,e=.025){const r=[],s=[];for(let i=0;i<=t;i++){i>0&&s.push(e);const a=Math.pow(1+e,i),l=Op({baseSalary:n.baseSalary,cumulativeInflation:a,yearlyInflation:[...s],other:n.other,statePension:n.statePension,statePensionYear:n.statePensionYear,yearNumber:i,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode}),c=l.annualSippDraw+l.other+l.statePension,d=Dp(c,l.pa,l.brl,l.hrl);r.push({year:i,brl:l.brl,other:l.other,statePension:l.statePension,sippDraw:l.annualSippDraw,totalTaxable:c,tax:d,netIncome:c-d})}return r}function xr(n,t,e,r,s){if(s){const i=Math.max(0,1-t/e);return n*r*i}return n*r}function Up(n,t,e){const r=xr(n.equityMin,t,n.duration,e,!0),s=xr(n.bondMin,t,n.duration,e,!0),i=xr(n.cashTarget,t,n.duration,e,!1);return{equity:r,bond:s,cash:i,totalGrowth:r+s,total:r+s+i}}function zp(n,t=bd.ASSUMED_CPI){const e=[];for(let r=0;r<=n.duration;r++){const s=Math.pow(1+t,r),i=Up(n,r,s);e.push({year:r,cumulativeInflation:s,equityMin:i.equity,bondMin:i.bond,cashTarget:i.cash,totalMin:i.total})}return e}const $p="modulepreload",qp=function(n,t){return new URL(n,t).href},Hc={},Wc=function(t,e,r){let s=Promise.resolve();if(e&&e.length>0){const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=Promise.allSettled(e.map(d=>{if(d=qp(d,r),d in Hc)return;Hc[d]=!0;const f=d.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!r)for(let T=a.length-1;T>=0;T--){const x=a[T];if(x.href===d&&(!f||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const E=document.createElement("link");if(E.rel=f?"stylesheet":$p,f||(E.as="script"),E.crossOrigin="",E.href=d,c&&E.setAttribute("nonce",c),document.head.appendChild(E),f)return new Promise((T,x)=>{E.addEventListener("load",T),E.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return s.then(a=>{for(const l of a||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})};function Ya(n){let t=n;return function(){return t=Math.sin(t)*1e4,t-Math.floor(t)}}function fs(n,t,e){const r=e(),s=e(),i=Math.sqrt(-2*Math.log(r))*Math.cos(2*Math.PI*s);return n+t*i}function Id(n){const t=JSON.stringify(n);let e=0;for(let r=0;r<t.length;r++){const s=t.charCodeAt(r);e=(e<<5)-e+s,e=e&e}return e.toString(16)}var Yc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sd=function(n){const t=[];let e=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},jp=function(n){const t=[];let e=0,r=0;for(;e<n.length;){const s=n[e++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[e++];t[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[e++],a=n[e++],l=n[e++],c=((s&7)<<18|(i&63)<<12|(a&63)<<6|l&63)-65536;t[r++]=String.fromCharCode(55296+(c>>10)),t[r++]=String.fromCharCode(56320+(c&1023))}else{const i=n[e++],a=n[e++];t[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return t.join("")},Ad={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,t){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,l=a?n[s+1]:0,c=s+2<n.length,d=c?n[s+2]:0,f=i>>2,m=(i&3)<<4|l>>4;let v=(l&15)<<2|d>>6,E=d&63;c||(E=64,a||(v=64)),r.push(e[f],e[m],e[v],e[E])}return r.join("")},encodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(n):this.encodeByteArray(Sd(n),t)},decodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(n):jp(this.decodeStringToByteArray(n,t))},decodeStringToByteArray(n,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=e[n.charAt(s++)],l=s<n.length?e[n.charAt(s)]:0;++s;const d=s<n.length?e[n.charAt(s)]:64;++s;const m=s<n.length?e[n.charAt(s)]:64;if(++s,i==null||l==null||d==null||m==null)throw new Hp;const v=i<<2|l>>4;if(r.push(v),d!==64){const E=l<<4&240|d>>2;if(r.push(E),m!==64){const T=d<<6&192|m;r.push(T)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Hp extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Wp=function(n){const t=Sd(n);return Ad.encodeByteArray(t,!0)},Ui=function(n){return Wp(n).replace(/\./g,"")},xd=function(n){try{return Ad.decodeString(n,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yp(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gp=()=>Yp().__FIREBASE_DEFAULTS__,Kp=()=>{if(typeof process>"u"||typeof Yc>"u")return;const n=Yc.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Qp=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=n&&xd(n[1]);return t&&JSON.parse(t)},ao=()=>{try{return Gp()||Kp()||Qp()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Rd=n=>{var t,e;return(e=(t=ao())===null||t===void 0?void 0:t.emulatorHosts)===null||e===void 0?void 0:e[n]},Jp=n=>{const t=Rd(n);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),r]:[t.substring(0,e),r]},Pd=()=>{var n;return(n=ao())===null||n===void 0?void 0:n.config},Cd=n=>{var t;return(t=ao())===null||t===void 0?void 0:t[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,r)=>{e?this.reject(e):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zp(n,t){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},r=t||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Ui(JSON.stringify(e)),Ui(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function tm(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Xt())}function em(){var n;const t=(n=ao())===null||n===void 0?void 0:n.forceEnvironment;if(t==="node")return!0;if(t==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function nm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function rm(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function sm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function im(){const n=Xt();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function om(){return!em()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function am(){try{return typeof indexedDB=="object"}catch{return!1}}function lm(){return new Promise((n,t)=>{try{let e=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{var i;t(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(e){t(e)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cm="FirebaseError";class Je extends Error{constructor(t,e,r){super(e),this.code=t,this.customData=r,this.name=cm,Object.setPrototypeOf(this,Je.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,zs.prototype.create)}}class zs{constructor(t,e,r){this.service=t,this.serviceName=e,this.errors=r}create(t,...e){const r=e[0]||{},s=`${this.service}/${t}`,i=this.errors[t],a=i?um(i,r):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new Je(s,l,r)}}function um(n,t){return n.replace(dm,(e,r)=>{const s=t[r];return s!=null?String(s):`<${r}?>`})}const dm=/\{\$([^}]+)}/g;function hm(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}function zi(n,t){if(n===t)return!0;const e=Object.keys(n),r=Object.keys(t);for(const s of e){if(!r.includes(s))return!1;const i=n[s],a=t[s];if(Gc(i)&&Gc(a)){if(!zi(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!e.includes(s))return!1;return!0}function Gc(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $s(n){const t=[];for(const[e,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function gs(n){const t={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");t[decodeURIComponent(s)]=decodeURIComponent(i)}}),t}function ys(n){const t=n.indexOf("?");if(!t)return"";const e=n.indexOf("#",t);return n.substring(t,e>0?e:void 0)}function fm(n,t){const e=new pm(n,t);return e.subscribe.bind(e)}class pm{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(r=>{this.error(r)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,r){let s;if(t===void 0&&e===void 0&&r===void 0)throw new Error("Missing Observer.");mm(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:r},s.next===void 0&&(s.next=Jo),s.error===void 0&&(s.error=Jo),s.complete===void 0&&(s.complete=Jo);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function mm(n,t){if(typeof n!="object"||n===null)return!1;for(const e of t)if(e in n&&typeof n[e]=="function")return!0;return!1}function Jo(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pt(n){return n&&n._delegate?n._delegate:n}class Yn{constructor(t,e,r){this.name=t,this.instanceFactory=e,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gm{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const r=new Xp;if(this.instancesDeferred.set(e,r),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){var e;const r=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),s=(e=t==null?void 0:t.optional)!==null&&e!==void 0?e:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(vm(t))try{this.getOrInitializeService({instanceIdentifier:Fn})}catch{}for(const[e,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(t=Fn){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Fn){return this.instances.has(t)}getOptions(t=Fn){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:e});for(const[i,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);r===l&&a.resolve(s)}return s}onInit(t,e){var r;const s=this.normalizeInstanceIdentifier(e),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(t),this.onInitCallbacks.set(s,i);const a=this.instances.get(s);return a&&t(a,s),()=>{i.delete(t)}}invokeOnInitCallbacks(t,e){const r=this.onInitCallbacks.get(e);if(r)for(const s of r)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:ym(t),options:e}),this.instances.set(t,r),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=Fn){return this.component?this.component.multipleInstances?t:Fn:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function ym(n){return n===Fn?void 0:n}function vm(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _m{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new gm(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var et;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(et||(et={}));const wm={debug:et.DEBUG,verbose:et.VERBOSE,info:et.INFO,warn:et.WARN,error:et.ERROR,silent:et.SILENT},Em=et.INFO,bm={[et.DEBUG]:"log",[et.VERBOSE]:"log",[et.INFO]:"info",[et.WARN]:"warn",[et.ERROR]:"error"},Tm=(n,t,...e)=>{if(t<n.logLevel)return;const r=new Date().toISOString(),s=bm[t];if(s)console[s](`[${r}]  ${n.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Ga{constructor(t){this.name=t,this._logLevel=Em,this._logHandler=Tm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in et))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?wm[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,et.DEBUG,...t),this._logHandler(this,et.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,et.VERBOSE,...t),this._logHandler(this,et.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,et.INFO,...t),this._logHandler(this,et.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,et.WARN,...t),this._logHandler(this,et.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,et.ERROR,...t),this._logHandler(this,et.ERROR,...t)}}const Im=(n,t)=>t.some(e=>n instanceof e);let Kc,Qc;function Sm(){return Kc||(Kc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Am(){return Qc||(Qc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const kd=new WeakMap,ya=new WeakMap,Dd=new WeakMap,Xo=new WeakMap,Ka=new WeakMap;function xm(n){const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{e(mn(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",a)});return t.then(e=>{e instanceof IDBCursor&&kd.set(e,n)}).catch(()=>{}),Ka.set(t,n),t}function Rm(n){if(ya.has(n))return;const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{e(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});ya.set(n,t)}let va={get(n,t,e){if(n instanceof IDBTransaction){if(t==="done")return ya.get(n);if(t==="objectStoreNames")return n.objectStoreNames||Dd.get(n);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return mn(n[t])},set(n,t,e){return n[t]=e,!0},has(n,t){return n instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in n}};function Pm(n){va=n(va)}function Cm(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const r=n.call(Zo(this),t,...e);return Dd.set(r,t.sort?t.sort():[t]),mn(r)}:Am().includes(n)?function(...t){return n.apply(Zo(this),t),mn(kd.get(this))}:function(...t){return mn(n.apply(Zo(this),t))}}function km(n){return typeof n=="function"?Cm(n):(n instanceof IDBTransaction&&Rm(n),Im(n,Sm())?new Proxy(n,va):n)}function mn(n){if(n instanceof IDBRequest)return xm(n);if(Xo.has(n))return Xo.get(n);const t=km(n);return t!==n&&(Xo.set(n,t),Ka.set(t,n)),t}const Zo=n=>Ka.get(n);function Dm(n,t,{blocked:e,upgrade:r,blocking:s,terminated:i}={}){const a=indexedDB.open(n,t),l=mn(a);return r&&a.addEventListener("upgradeneeded",c=>{r(mn(a.result),c.oldVersion,c.newVersion,mn(a.transaction),c)}),e&&a.addEventListener("blocked",c=>e(c.oldVersion,c.newVersion,c)),l.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const Mm=["get","getKey","getAll","getAllKeys","count"],Nm=["put","add","delete","clear"],ta=new Map;function Jc(n,t){if(!(n instanceof IDBDatabase&&!(t in n)&&typeof t=="string"))return;if(ta.get(t))return ta.get(t);const e=t.replace(/FromIndex$/,""),r=t!==e,s=Nm.includes(e);if(!(e in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Mm.includes(e)))return;const i=async function(a,...l){const c=this.transaction(a,s?"readwrite":"readonly");let d=c.store;return r&&(d=d.index(l.shift())),(await Promise.all([d[e](...l),s&&c.done]))[0]};return ta.set(t,i),i}Pm(n=>({...n,get:(t,e,r)=>Jc(t,e)||n.get(t,e,r),has:(t,e)=>!!Jc(t,e)||n.has(t,e)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(Vm(e)){const r=e.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(e=>e).join(" ")}}function Vm(n){const t=n.getComponent();return(t==null?void 0:t.type)==="VERSION"}const _a="@firebase/app",Xc="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const We=new Ga("@firebase/app"),Om="@firebase/app-compat",Bm="@firebase/analytics-compat",Fm="@firebase/analytics",Um="@firebase/app-check-compat",zm="@firebase/app-check",$m="@firebase/auth",qm="@firebase/auth-compat",jm="@firebase/database",Hm="@firebase/data-connect",Wm="@firebase/database-compat",Ym="@firebase/functions",Gm="@firebase/functions-compat",Km="@firebase/installations",Qm="@firebase/installations-compat",Jm="@firebase/messaging",Xm="@firebase/messaging-compat",Zm="@firebase/performance",tg="@firebase/performance-compat",eg="@firebase/remote-config",ng="@firebase/remote-config-compat",rg="@firebase/storage",sg="@firebase/storage-compat",ig="@firebase/firestore",og="@firebase/vertexai-preview",ag="@firebase/firestore-compat",lg="firebase",cg="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wa="[DEFAULT]",ug={[_a]:"fire-core",[Om]:"fire-core-compat",[Fm]:"fire-analytics",[Bm]:"fire-analytics-compat",[zm]:"fire-app-check",[Um]:"fire-app-check-compat",[$m]:"fire-auth",[qm]:"fire-auth-compat",[jm]:"fire-rtdb",[Hm]:"fire-data-connect",[Wm]:"fire-rtdb-compat",[Ym]:"fire-fn",[Gm]:"fire-fn-compat",[Km]:"fire-iid",[Qm]:"fire-iid-compat",[Jm]:"fire-fcm",[Xm]:"fire-fcm-compat",[Zm]:"fire-perf",[tg]:"fire-perf-compat",[eg]:"fire-rc",[ng]:"fire-rc-compat",[rg]:"fire-gcs",[sg]:"fire-gcs-compat",[ig]:"fire-fst",[ag]:"fire-fst-compat",[og]:"fire-vertex","fire-js":"fire-js",[lg]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $i=new Map,dg=new Map,Ea=new Map;function Zc(n,t){try{n.container.addComponent(t)}catch(e){We.debug(`Component ${t.name} failed to register with FirebaseApp ${n.name}`,e)}}function Nr(n){const t=n.name;if(Ea.has(t))return We.debug(`There were multiple attempts to register component ${t}.`),!1;Ea.set(t,n);for(const e of $i.values())Zc(e,n);for(const e of dg.values())Zc(e,n);return!0}function Qa(n,t){const e=n.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),n.container.getProvider(t)}function _e(n){return n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},gn=new zs("app","Firebase",hg);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fg{constructor(t,e,r){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},e),this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Yn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw gn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jr=cg;function Md(n,t={}){let e=n;typeof t!="object"&&(t={name:t});const r=Object.assign({name:wa,automaticDataCollectionEnabled:!1},t),s=r.name;if(typeof s!="string"||!s)throw gn.create("bad-app-name",{appName:String(s)});if(e||(e=Pd()),!e)throw gn.create("no-options");const i=$i.get(s);if(i){if(zi(e,i.options)&&zi(r,i.config))return i;throw gn.create("duplicate-app",{appName:s})}const a=new _m(s);for(const c of Ea.values())a.addComponent(c);const l=new fg(e,r,a);return $i.set(s,l),l}function Nd(n=wa){const t=$i.get(n);if(!t&&n===wa&&Pd())return Md();if(!t)throw gn.create("no-app",{appName:n});return t}function yn(n,t,e){var r;let s=(r=ug[n])!==null&&r!==void 0?r:n;e&&(s+=`-${e}`);const i=s.match(/\s|\//),a=t.match(/\s|\//);if(i||a){const l=[`Unable to register library "${s}" with version "${t}":`];i&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&a&&l.push("and"),a&&l.push(`version name "${t}" contains illegal characters (whitespace or "/")`),We.warn(l.join(" "));return}Nr(new Yn(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pg="firebase-heartbeat-database",mg=1,ks="firebase-heartbeat-store";let ea=null;function Ld(){return ea||(ea=Dm(pg,mg,{upgrade:(n,t)=>{switch(t){case 0:try{n.createObjectStore(ks)}catch(e){console.warn(e)}}}}).catch(n=>{throw gn.create("idb-open",{originalErrorMessage:n.message})})),ea}async function gg(n){try{const e=(await Ld()).transaction(ks),r=await e.objectStore(ks).get(Vd(n));return await e.done,r}catch(t){if(t instanceof Je)We.warn(t.message);else{const e=gn.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});We.warn(e.message)}}}async function tu(n,t){try{const r=(await Ld()).transaction(ks,"readwrite");await r.objectStore(ks).put(t,Vd(n)),await r.done}catch(e){if(e instanceof Je)We.warn(e.message);else{const r=gn.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});We.warn(r.message)}}}function Vd(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yg=1024,vg=30*24*60*60*1e3;class _g{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new Eg(e),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,e;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=eu();return((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const l=new Date(a.date).valueOf();return Date.now()-l<=vg}),this._storage.overwrite(this._heartbeatsCache))}catch(r){We.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=eu(),{heartbeatsToSend:r,unsentEntries:s}=wg(this._heartbeatsCache.heartbeats),i=Ui(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return We.warn(e),""}}}function eu(){return new Date().toISOString().substring(0,10)}function wg(n,t=yg){const e=[];let r=n.slice();for(const s of n){const i=e.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),nu(e)>t){i.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),nu(e)>t){e.pop();break}r=r.slice(1)}return{heartbeatsToSend:e,unsentEntries:r}}class Eg{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return am()?lm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await gg(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return tu(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return tu(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...t.heartbeats]})}else return}}function nu(n){return Ui(JSON.stringify({version:2,heartbeats:n})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bg(n){Nr(new Yn("platform-logger",t=>new Lm(t),"PRIVATE")),Nr(new Yn("heartbeat",t=>new _g(t),"PRIVATE")),yn(_a,Xc,n),yn(_a,Xc,"esm2017"),yn("fire-js","")}bg("");var Tg="firebase",Ig="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */yn(Tg,Ig,"app");function Ja(n,t){var e={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.indexOf(r)<0&&(e[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)t.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(e[r[s]]=n[r[s]]);return e}function Od(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Sg=Od,Bd=new zs("auth","Firebase",Od());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qi=new Ga("@firebase/auth");function Ag(n,...t){qi.logLevel<=et.WARN&&qi.warn(`Auth (${jr}): ${n}`,...t)}function Pi(n,...t){qi.logLevel<=et.ERROR&&qi.error(`Auth (${jr}): ${n}`,...t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(n,...t){throw Za(n,...t)}function we(n,...t){return Za(n,...t)}function Xa(n,t,e){const r=Object.assign(Object.assign({},Sg()),{[t]:e});return new zs("auth","Firebase",r).create(t,{appName:n.name})}function je(n){return Xa(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function xg(n,t,e){const r=e;if(!(t instanceof r))throw r.name!==t.constructor.name&&pe(n,"argument-error"),Xa(n,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Za(n,...t){if(typeof n!="string"){const e=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(e,...r)}return Bd.create(n,...t)}function W(n,t,...e){if(!n)throw Za(t,...e)}function ze(n){const t="INTERNAL ASSERTION FAILED: "+n;throw Pi(t),new Error(t)}function Ye(n,t){n||ze(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ba(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Rg(){return ru()==="http:"||ru()==="https:"}function ru(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pg(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Rg()||rm()||"connection"in navigator)?navigator.onLine:!0}function Cg(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(t,e){this.shortDelay=t,this.longDelay=e,Ye(e>t,"Short delay should be less than long delay!"),this.isMobile=tm()||sm()}get(){return Pg()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tl(n,t){Ye(n.emulator,"Emulator should always be set here");const{url:e}=n.emulator;return t?`${e}${t.startsWith("/")?t.slice(1):t}`:e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fd{static initialize(t,e,r){this.fetchImpl=t,e&&(this.headersImpl=e),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ze("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ze("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ze("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kg={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dg=new qs(3e4,6e4);function Xe(n,t){return n.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:n.tenantId}):t}async function Ne(n,t,e,r,s={}){return Ud(n,s,async()=>{let i={},a={};r&&(t==="GET"?a=r:i={body:JSON.stringify(r)});const l=$s(Object.assign({key:n.config.apiKey},a)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:t,headers:c},i);return nm()||(d.referrerPolicy="no-referrer"),Fd.fetch()(zd(n,n.config.apiHost,e,l),d)})}async function Ud(n,t,e){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},kg),t);try{const s=new Ng(n),i=await Promise.race([e(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw Ii(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const l=i.ok?a.errorMessage:a.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ii(n,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw Ii(n,"email-already-in-use",a);if(c==="USER_DISABLED")throw Ii(n,"user-disabled",a);const f=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Xa(n,f,d);pe(n,f)}}catch(s){if(s instanceof Je)throw s;pe(n,"network-request-failed",{message:String(s)})}}async function js(n,t,e,r,s={}){const i=await Ne(n,t,e,r,s);return"mfaPendingCredential"in i&&pe(n,"multi-factor-auth-required",{_serverResponse:i}),i}function zd(n,t,e,r){const s=`${t}${e}?${r}`;return n.config.emulator?tl(n.config,s):`${n.config.apiScheme}://${s}`}function Mg(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Ng{constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((e,r)=>{this.timer=setTimeout(()=>r(we(this.auth,"network-request-failed")),Dg.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Ii(n,t,e){const r={appName:n.name};e.email&&(r.email=e.email),e.phoneNumber&&(r.phoneNumber=e.phoneNumber);const s=we(n,t,r);return s.customData._tokenResponse=e,s}function su(n){return n!==void 0&&n.enterprise!==void 0}class Lg{constructor(t){if(this.siteKey="",this.recaptchaEnforcementState=[],t.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=t.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=t.recaptchaEnforcementState}getProviderEnforcementState(t){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const e of this.recaptchaEnforcementState)if(e.provider&&e.provider===t)return Mg(e.enforcementState);return null}isProviderEnabled(t){return this.getProviderEnforcementState(t)==="ENFORCE"||this.getProviderEnforcementState(t)==="AUDIT"}}async function Vg(n,t){return Ne(n,"GET","/v2/recaptchaConfig",Xe(n,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Og(n,t){return Ne(n,"POST","/v1/accounts:delete",t)}async function $d(n,t){return Ne(n,"POST","/v1/accounts:lookup",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bs(n){if(n)try{const t=new Date(Number(n));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function Bg(n,t=!1){const e=Pt(n),r=await e.getIdToken(t),s=el(r);W(s&&s.exp&&s.auth_time&&s.iat,e.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:bs(na(s.auth_time)),issuedAtTime:bs(na(s.iat)),expirationTime:bs(na(s.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function na(n){return Number(n)*1e3}function el(n){const[t,e,r]=n.split(".");if(t===void 0||e===void 0||r===void 0)return Pi("JWT malformed, contained fewer than 3 sections"),null;try{const s=xd(e);return s?JSON.parse(s):(Pi("Failed to decode base64 JWT payload"),null)}catch(s){return Pi("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function iu(n){const t=el(n);return W(t,"internal-error"),W(typeof t.exp<"u","internal-error"),W(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Lr(n,t,e=!1){if(e)return t;try{return await t}catch(r){throw r instanceof Je&&Fg(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Fg({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ug{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){var e;if(t){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((e=this.user.stsTokenManager.expirationTime)!==null&&e!==void 0?e:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(t=!1){if(!this.isRunning)return;const e=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},e)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){(t==null?void 0:t.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ta{constructor(t,e){this.createdAt=t,this.lastLoginAt=e,this._initializeTime()}_initializeTime(){this.lastSignInTime=bs(this.lastLoginAt),this.creationTime=bs(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ji(n){var t;const e=n.auth,r=await n.getIdToken(),s=await Lr(n,$d(e,{idToken:r}));W(s==null?void 0:s.users.length,e,"internal-error");const i=s.users[0];n._notifyReloadListener(i);const a=!((t=i.providerUserInfo)===null||t===void 0)&&t.length?qd(i.providerUserInfo):[],l=$g(n.providerData,a),c=n.isAnonymous,d=!(n.email&&i.passwordHash)&&!(l!=null&&l.length),f=c?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new Ta(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function zg(n){const t=Pt(n);await ji(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function $g(n,t){return[...n.filter(r=>!t.some(s=>s.providerId===r.providerId)),...t]}function qd(n){return n.map(t=>{var{providerId:e}=t,r=Ja(t,["providerId"]);return{providerId:e,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qg(n,t){const e=await Ud(n,{},async()=>{const r=$s({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=zd(n,s,"/v1/token",`key=${i}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Fd.fetch()(a,{method:"POST",headers:l,body:r})});return{accessToken:e.access_token,expiresIn:e.expires_in,refreshToken:e.refresh_token}}async function jg(n,t){return Ne(n,"POST","/v2/accounts:revokeToken",Xe(n,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){W(t.idToken,"internal-error"),W(typeof t.idToken<"u","internal-error"),W(typeof t.refreshToken<"u","internal-error");const e="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):iu(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,e)}updateFromIdToken(t){W(t.length!==0,"internal-error");const e=iu(t);this.updateTokensAndExpiration(t,null,e)}async getToken(t,e=!1){return!e&&this.accessToken&&!this.isExpired?this.accessToken:(W(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,e){const{accessToken:r,refreshToken:s,expiresIn:i}=await qg(t,e);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(t,e,r){this.refreshToken=e||null,this.accessToken=t||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(t,e){const{refreshToken:r,accessToken:s,expirationTime:i}=e,a=new Rr;return r&&(W(typeof r=="string","internal-error",{appName:t}),a.refreshToken=r),s&&(W(typeof s=="string","internal-error",{appName:t}),a.accessToken=s),i&&(W(typeof i=="number","internal-error",{appName:t}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new Rr,this.toJSON())}_performRefresh(){return ze("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function on(n,t){W(typeof n=="string"||typeof n>"u","internal-error",{appName:t})}class $e{constructor(t){var{uid:e,auth:r,stsTokenManager:s}=t,i=Ja(t,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Ug(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ta(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(t){const e=await Lr(this,this.stsTokenManager.getToken(this.auth,t));return W(e,this.auth,"internal-error"),this.accessToken!==e&&(this.accessToken=e,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),e}getIdTokenResult(t){return Bg(this,t)}reload(){return zg(this)}_assign(t){this!==t&&(W(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(e=>Object.assign({},e)),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const e=new $e(Object.assign(Object.assign({},this),{auth:t,stsTokenManager:this.stsTokenManager._clone()}));return e.metadata._copy(this.metadata),e}_onReload(t){W(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,e=!1){let r=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),r=!0),e&&await ji(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(_e(this.auth.app))return Promise.reject(je(this.auth));const t=await this.getIdToken();return await Lr(this,Og(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>Object.assign({},t)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,e){var r,s,i,a,l,c,d,f;const m=(r=e.displayName)!==null&&r!==void 0?r:void 0,v=(s=e.email)!==null&&s!==void 0?s:void 0,E=(i=e.phoneNumber)!==null&&i!==void 0?i:void 0,T=(a=e.photoURL)!==null&&a!==void 0?a:void 0,x=(l=e.tenantId)!==null&&l!==void 0?l:void 0,R=(c=e._redirectEventId)!==null&&c!==void 0?c:void 0,A=(d=e.createdAt)!==null&&d!==void 0?d:void 0,D=(f=e.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:N,emailVerified:C,isAnonymous:V,providerData:O,stsTokenManager:b}=e;W(N&&b,t,"internal-error");const g=Rr.fromJSON(this.name,b);W(typeof N=="string",t,"internal-error"),on(m,t.name),on(v,t.name),W(typeof C=="boolean",t,"internal-error"),W(typeof V=="boolean",t,"internal-error"),on(E,t.name),on(T,t.name),on(x,t.name),on(R,t.name),on(A,t.name),on(D,t.name);const y=new $e({uid:N,auth:t,email:v,emailVerified:C,displayName:m,isAnonymous:V,photoURL:T,phoneNumber:E,tenantId:x,stsTokenManager:g,createdAt:A,lastLoginAt:D});return O&&Array.isArray(O)&&(y.providerData=O.map(_=>Object.assign({},_))),R&&(y._redirectEventId=R),y}static async _fromIdTokenResponse(t,e,r=!1){const s=new Rr;s.updateFromServerResponse(e);const i=new $e({uid:e.localId,auth:t,stsTokenManager:s,isAnonymous:r});return await ji(i),i}static async _fromGetAccountInfoResponse(t,e,r){const s=e.users[0];W(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?qd(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),l=new Rr;l.updateFromIdToken(r);const c=new $e({uid:s.localId,auth:t,stsTokenManager:l,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Ta(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ou=new Map;function qe(n){Ye(n instanceof Function,"Expected a class definition");let t=ou.get(n);return t?(Ye(t instanceof n,"Instance stored in cache mismatched with class"),t):(t=new n,ou.set(n,t),t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jd{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,e){this.storage[t]=e}async _get(t){const e=this.storage[t];return e===void 0?null:e}async _remove(t){delete this.storage[t]}_addListener(t,e){}_removeListener(t,e){}}jd.type="NONE";const au=jd;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ci(n,t,e){return`firebase:${n}:${t}:${e}`}class Pr{constructor(t,e,r){this.persistence=t,this.auth=e,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=Ci(this.userKey,s.apiKey,i),this.fullPersistenceKey=Ci("persistence",s.apiKey,i),this.boundEventHandler=e._onStorageEvent.bind(e),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);return t?$e._fromJSON(this.auth,t):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const e=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,e)return this.setCurrentUser(e)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,e,r="authUser"){if(!e.length)return new Pr(qe(au),t,r);const s=(await Promise.all(e.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=s[0]||qe(au);const a=Ci(r,t.config.apiKey,t.name);let l=null;for(const d of e)try{const f=await d._get(a);if(f){const m=$e._fromJSON(t,f);d!==i&&(l=m),i=d;break}}catch{}const c=s.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new Pr(i,t,r):(i=c[0],l&&await i._set(a,l.toJSON()),await Promise.all(e.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new Pr(i,t,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lu(n){const t=n.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Gd(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(Hd(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Qd(t))return"Blackberry";if(Jd(t))return"Webos";if(Wd(t))return"Safari";if((t.includes("chrome/")||Yd(t))&&!t.includes("edge/"))return"Chrome";if(Kd(t))return"Android";{const e=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(e);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Hd(n=Xt()){return/firefox\//i.test(n)}function Wd(n=Xt()){const t=n.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function Yd(n=Xt()){return/crios\//i.test(n)}function Gd(n=Xt()){return/iemobile/i.test(n)}function Kd(n=Xt()){return/android/i.test(n)}function Qd(n=Xt()){return/blackberry/i.test(n)}function Jd(n=Xt()){return/webos/i.test(n)}function nl(n=Xt()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Hg(n=Xt()){var t;return nl(n)&&!!(!((t=window.navigator)===null||t===void 0)&&t.standalone)}function Wg(){return im()&&document.documentMode===10}function Xd(n=Xt()){return nl(n)||Kd(n)||Jd(n)||Qd(n)||/windows phone/i.test(n)||Gd(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zd(n,t=[]){let e;switch(n){case"Browser":e=lu(Xt());break;case"Worker":e=`${lu(Xt())}-${n}`;break;default:e=n}const r=t.length?t.join(","):"FirebaseCore-web";return`${e}/JsCore/${jr}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yg{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,e){const r=i=>new Promise((a,l)=>{try{const c=t(i);a(c)}catch(c){l(c)}});r.onAbort=e,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const e=[];try{for(const r of this.queue)await r(t),r.onAbort&&e.push(r.onAbort)}catch(r){e.reverse();for(const s of e)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gg(n,t={}){return Ne(n,"GET","/v2/passwordPolicy",Xe(n,t))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kg=6;class Qg{constructor(t){var e,r,s,i;const a=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(e=a.minPasswordLength)!==null&&e!==void 0?e:Kg,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=t.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=t.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=t.schemaVersion}validatePassword(t){var e,r,s,i,a,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,c),this.validatePasswordCharacterOptions(t,c),c.isValid&&(c.isValid=(e=c.meetsMinPasswordLength)!==null&&e!==void 0?e:!0),c.isValid&&(c.isValid=(r=c.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsLowercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(t,e){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(e.meetsMinPasswordLength=t.length>=r),s&&(e.meetsMaxPasswordLength=t.length<=s)}validatePasswordCharacterOptions(t,e){this.updatePasswordCharacterOptionsStatuses(e,!1,!1,!1,!1);let r;for(let s=0;s<t.length;s++)r=t.charAt(s),this.updatePasswordCharacterOptionsStatuses(e,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(t,e,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=e)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jg{constructor(t,e,r,s){this.app=t,this.heartbeatServiceProvider=e,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new cu(this),this.idTokenSubscription=new cu(this),this.beforeStateQueue=new Yg(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Bd,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(t,e){return e&&(this._popupRedirectResolver=qe(e)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await Pr.create(this,t),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(e),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const e=await $d(this,{idToken:t}),r=await $e._fromGetAccountInfoResponse(this,e,t);await this.directlySetCurrentUser(r)}catch(e){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){var e;if(_e(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(e=this.redirectUser)===null||e===void 0?void 0:e._redirectEventId,l=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(t);(!a||a===l)&&(c!=null&&c.user)&&(s=c.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return W(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(t){let e=null;try{e=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return e}async reloadAndSetCurrentUserOrClear(t){try{await ji(t)}catch(e){if((e==null?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=Cg()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(_e(this.app))return Promise.reject(je(this));const e=t?Pt(t):null;return e&&W(e.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(e&&e._clone(this))}async _updateCurrentUser(t,e=!1){if(!this._deleted)return t&&W(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),e||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return _e(this.app)?Promise.reject(je(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return _e(this.app)?Promise.reject(je(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(qe(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const e=this._getPasswordPolicyInternal();return e.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):e.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await Gg(this),e=new Qg(t);this.tenantId===null?this._projectPasswordPolicy=e:this._tenantPasswordPolicies[this.tenantId]=e}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(t){this._errorFactory=new zs("auth","Firebase",t())}onAuthStateChanged(t,e,r){return this.registerStateListener(this.authStateSubscription,t,e,r)}beforeAuthStateChanged(t,e){return this.beforeStateQueue.pushCallback(t,e)}onIdTokenChanged(t,e,r){return this.registerStateListener(this.idTokenSubscription,t,e,r)}authStateReady(){return new Promise((t,e)=>{if(this.currentUser)t();else{const r=this.onAuthStateChanged(()=>{r(),t()},e)}})}async revokeAccessToken(t){if(this.currentUser){const e=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:e};this.tenantId!=null&&(r.tenantId=this.tenantId),await jg(this,r)}}toJSON(){var t;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(t=this._currentUser)===null||t===void 0?void 0:t.toJSON()}}async _setRedirectUser(t,e){const r=await this.getOrInitRedirectPersistenceManager(e);return t===null?r.removeCurrentUser():r.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const e=t&&qe(t)||this._popupRedirectResolver;W(e,this,"argument-error"),this.redirectPersistenceManager=await Pr.create(this,[qe(e._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){var e,r;return this._isInitialized&&await this.queue(async()=>{}),((e=this._currentUser)===null||e===void 0?void 0:e._redirectEventId)===t?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t,e;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(e=(t=this.currentUser)===null||t===void 0?void 0:t.uid)!==null&&e!==void 0?e:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,e,r,s){if(this._deleted)return()=>{};const i=typeof e=="function"?e:e.next.bind(e);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(W(l,this,"internal-error"),l.then(()=>{a||i(this.currentUser)}),typeof e=="function"){const c=t.addObserver(e,r,s);return()=>{a=!0,c()}}else{const c=t.addObserver(e);return()=>{a=!0,c()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return W(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=Zd(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var t;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const r=await((t=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getHeartbeatsHeader());r&&(e["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){var t;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getToken());return e!=null&&e.error&&Ag(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Ze(n){return Pt(n)}class cu{constructor(t){this.auth=t,this.observer=null,this.addObserver=fm(e=>this.observer=e)}get next(){return W(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let lo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Xg(n){lo=n}function th(n){return lo.loadJS(n)}function Zg(){return lo.recaptchaEnterpriseScript}function ty(){return lo.gapiScript}function ey(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const ny="recaptcha-enterprise",ry="NO_RECAPTCHA";class sy{constructor(t){this.type=ny,this.auth=Ze(t)}async verify(t="verify",e=!1){async function r(i){if(!e){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,l)=>{Vg(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new Lg(c);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,a(d.siteKey)}}).catch(c=>{l(c)})})}function s(i,a,l){const c=window.grecaptcha;su(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:t}).then(d=>{a(d)}).catch(()=>{a(ry)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,a)=>{r(this.auth).then(l=>{if(!e&&su(window.grecaptcha))s(l,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=Zg();c.length!==0&&(c+=l),th(c).then(()=>{s(l,i,a)}).catch(d=>{a(d)})}}).catch(l=>{a(l)})})}}async function uu(n,t,e,r=!1){const s=new sy(n);let i;try{i=await s.verify(e)}catch{i=await s.verify(e,!0)}const a=Object.assign({},t);return r?Object.assign(a,{captchaResp:i}):Object.assign(a,{captchaResponse:i}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Hi(n,t,e,r){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await uu(n,t,e,e==="getOobCode");return r(n,i)}else return r(n,t).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${e} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await uu(n,t,e,e==="getOobCode");return r(n,a)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iy(n,t){const e=Qa(n,"auth");if(e.isInitialized()){const s=e.getImmediate(),i=e.getOptions();if(zi(i,t??{}))return s;pe(s,"already-initialized")}return e.initialize({options:t})}function oy(n,t){const e=(t==null?void 0:t.persistence)||[],r=(Array.isArray(e)?e:[e]).map(qe);t!=null&&t.errorMap&&n._updateErrorMap(t.errorMap),n._initializeWithPersistence(r,t==null?void 0:t.popupRedirectResolver)}function ay(n,t,e){const r=Ze(n);W(r._canInitEmulator,r,"emulator-config-failed"),W(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const s=!1,i=eh(t),{host:a,port:l}=ly(t),c=l===null?"":`:${l}`;r.config.emulator={url:`${i}//${a}${c}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),cy()}function eh(n){const t=n.indexOf(":");return t<0?"":n.substr(0,t+1)}function ly(n){const t=eh(n),e=/(\/\/)?([^?#/]+)/.exec(n.substr(t.length));if(!e)return{host:"",port:null};const r=e[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:du(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:du(a)}}}function du(n){if(!n)return null;const t=Number(n);return isNaN(t)?null:t}function cy(){function n(){const t=document.createElement("p"),e=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",e.position="fixed",e.width="100%",e.backgroundColor="#ffffff",e.border=".1em solid #000000",e.color="#b50000",e.bottom="0px",e.left="0px",e.margin="0px",e.zIndex="10000",e.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(t,e){this.providerId=t,this.signInMethod=e}toJSON(){return ze("not implemented")}_getIdTokenResponse(t){return ze("not implemented")}_linkToIdToken(t,e){return ze("not implemented")}_getReauthenticationResolver(t){return ze("not implemented")}}async function uy(n,t){return Ne(n,"POST","/v1/accounts:signUp",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dy(n,t){return js(n,"POST","/v1/accounts:signInWithPassword",Xe(n,t))}async function hy(n,t){return Ne(n,"POST","/v1/accounts:sendOobCode",Xe(n,t))}async function fy(n,t){return hy(n,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function py(n,t){return js(n,"POST","/v1/accounts:signInWithEmailLink",Xe(n,t))}async function my(n,t){return js(n,"POST","/v1/accounts:signInWithEmailLink",Xe(n,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds extends rl{constructor(t,e,r,s=null){super("password",r),this._email=t,this._password=e,this._tenantId=s}static _fromEmailAndPassword(t,e){return new Ds(t,e,"password")}static _fromEmailAndCode(t,e,r=null){return new Ds(t,e,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t;if(e!=null&&e.email&&(e!=null&&e.password)){if(e.signInMethod==="password")return this._fromEmailAndPassword(e.email,e.password);if(e.signInMethod==="emailLink")return this._fromEmailAndCode(e.email,e.password,e.tenantId)}return null}async _getIdTokenResponse(t){switch(this.signInMethod){case"password":const e={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Hi(t,e,"signInWithPassword",dy);case"emailLink":return py(t,{email:this._email,oobCode:this._password});default:pe(t,"internal-error")}}async _linkToIdToken(t,e){switch(this.signInMethod){case"password":const r={idToken:e,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Hi(t,r,"signUpPassword",uy);case"emailLink":return my(t,{idToken:e,email:this._email,oobCode:this._password});default:pe(t,"internal-error")}}_getReauthenticationResolver(t){return this._getIdTokenResponse(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cr(n,t){return js(n,"POST","/v1/accounts:signInWithIdp",Xe(n,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gy="http://localhost";class Gn extends rl{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const e=new Gn(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(e.idToken=t.idToken),t.accessToken&&(e.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(e.nonce=t.nonce),t.pendingToken&&(e.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(e.accessToken=t.oauthToken,e.secret=t.oauthTokenSecret):pe("argument-error"),e}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t,{providerId:r,signInMethod:s}=e,i=Ja(e,["providerId","signInMethod"]);if(!r||!s)return null;const a=new Gn(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(t){const e=this.buildRequest();return Cr(t,e)}_linkToIdToken(t,e){const r=this.buildRequest();return r.idToken=e,Cr(t,r)}_getReauthenticationResolver(t){const e=this.buildRequest();return e.autoCreate=!1,Cr(t,e)}buildRequest(){const t={requestUri:gy,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const e={};this.idToken&&(e.id_token=this.idToken),this.accessToken&&(e.access_token=this.accessToken),this.secret&&(e.oauth_token_secret=this.secret),e.providerId=this.providerId,this.nonce&&!this.pendingToken&&(e.nonce=this.nonce),t.postBody=$s(e)}return t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yy(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function vy(n){const t=gs(ys(n)).link,e=t?gs(ys(t)).deep_link_id:null,r=gs(ys(n)).deep_link_id;return(r?gs(ys(r)).link:null)||r||e||t||n}class sl{constructor(t){var e,r,s,i,a,l;const c=gs(ys(t)),d=(e=c.apiKey)!==null&&e!==void 0?e:null,f=(r=c.oobCode)!==null&&r!==void 0?r:null,m=yy((s=c.mode)!==null&&s!==void 0?s:null);W(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(a=c.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(t){const e=vy(t);try{return new sl(e)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hr{constructor(){this.providerId=Hr.PROVIDER_ID}static credential(t,e){return Ds._fromEmailAndPassword(t,e)}static credentialWithLink(t,e){const r=sl.parseLink(e);return W(r,"argument-error"),Ds._fromEmailAndCode(t,r.code,r.tenantId)}}Hr.PROVIDER_ID="password";Hr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Hr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class il{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hs extends il{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn extends Hs{constructor(){super("facebook.com")}static credential(t){return Gn._fromParams({providerId:cn.PROVIDER_ID,signInMethod:cn.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return cn.credentialFromTaggedObject(t)}static credentialFromError(t){return cn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return cn.credential(t.oauthAccessToken)}catch{return null}}}cn.FACEBOOK_SIGN_IN_METHOD="facebook.com";cn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue extends Hs{constructor(){super("google.com"),this.addScope("profile")}static credential(t,e){return Gn._fromParams({providerId:Ue.PROVIDER_ID,signInMethod:Ue.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:e})}static credentialFromResult(t){return Ue.credentialFromTaggedObject(t)}static credentialFromError(t){return Ue.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:e,oauthAccessToken:r}=t;if(!e&&!r)return null;try{return Ue.credential(e,r)}catch{return null}}}Ue.GOOGLE_SIGN_IN_METHOD="google.com";Ue.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class un extends Hs{constructor(){super("github.com")}static credential(t){return Gn._fromParams({providerId:un.PROVIDER_ID,signInMethod:un.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return un.credentialFromTaggedObject(t)}static credentialFromError(t){return un.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return un.credential(t.oauthAccessToken)}catch{return null}}}un.GITHUB_SIGN_IN_METHOD="github.com";un.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dn extends Hs{constructor(){super("twitter.com")}static credential(t,e){return Gn._fromParams({providerId:dn.PROVIDER_ID,signInMethod:dn.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:e})}static credentialFromResult(t){return dn.credentialFromTaggedObject(t)}static credentialFromError(t){return dn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:e,oauthTokenSecret:r}=t;if(!e||!r)return null;try{return dn.credential(e,r)}catch{return null}}}dn.TWITTER_SIGN_IN_METHOD="twitter.com";dn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _y(n,t){return js(n,"POST","/v1/accounts:signUp",Xe(n,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,e,r,s=!1){const i=await $e._fromIdTokenResponse(t,r,s),a=hu(r);return new Kn({user:i,providerId:a,_tokenResponse:r,operationType:e})}static async _forOperation(t,e,r){await t._updateTokensIfNecessary(r,!0);const s=hu(r);return new Kn({user:t,providerId:s,_tokenResponse:r,operationType:e})}}function hu(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi extends Je{constructor(t,e,r,s){var i;super(e.code,e.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Wi.prototype),this.customData={appName:t.name,tenantId:(i=t.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:e.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(t,e,r,s){return new Wi(t,e,r,s)}}function nh(n,t,e,r){return(t==="reauthenticate"?e._getReauthenticationResolver(n):e._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Wi._fromErrorAndOperation(n,i,t,r):i})}async function wy(n,t,e=!1){const r=await Lr(n,t._linkToIdToken(n.auth,await n.getIdToken()),e);return Kn._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ey(n,t,e=!1){const{auth:r}=n;if(_e(r.app))return Promise.reject(je(r));const s="reauthenticate";try{const i=await Lr(n,nh(r,s,t,n),e);W(i.idToken,r,"internal-error");const a=el(i.idToken);W(a,r,"internal-error");const{sub:l}=a;return W(n.uid===l,r,"user-mismatch"),Kn._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&pe(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rh(n,t,e=!1){if(_e(n.app))return Promise.reject(je(n));const r="signIn",s=await nh(n,r,t),i=await Kn._fromIdTokenResponse(n,r,s);return e||await n._updateCurrentUser(i.user),i}async function by(n,t){return rh(Ze(n),t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sh(n){const t=Ze(n);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function Ty(n,t,e){const r=Ze(n);await Hi(r,{requestType:"PASSWORD_RESET",email:t,clientType:"CLIENT_TYPE_WEB"},"getOobCode",fy)}async function Iy(n,t,e){if(_e(n.app))return Promise.reject(je(n));const r=Ze(n),a=await Hi(r,{returnSecureToken:!0,email:t,password:e,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",_y).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&sh(n),c}),l=await Kn._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(l.user),l}function Sy(n,t,e){return _e(n.app)?Promise.reject(je(n)):by(Pt(n),Hr.credential(t,e)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&sh(n),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ay(n,t){return Ne(n,"POST","/v1/accounts:update",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xy(n,{displayName:t,photoURL:e}){if(t===void 0&&e===void 0)return;const r=Pt(n),i={idToken:await r.getIdToken(),displayName:t,photoUrl:e,returnSecureToken:!0},a=await Lr(r,Ay(r.auth,i));r.displayName=a.displayName||null,r.photoURL=a.photoUrl||null;const l=r.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=r.displayName,l.photoURL=r.photoURL),await r._updateTokensIfNecessary(a)}function Ry(n,t,e,r){return Pt(n).onIdTokenChanged(t,e,r)}function Py(n,t,e){return Pt(n).beforeAuthStateChanged(t,e)}function Cy(n,t,e,r){return Pt(n).onAuthStateChanged(t,e,r)}function ky(n){return Pt(n).signOut()}const Yi="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{constructor(t,e){this.storageRetriever=t,this.type=e}_isAvailable(){try{return this.storage?(this.storage.setItem(Yi,"1"),this.storage.removeItem(Yi),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,e){return this.storage.setItem(t,JSON.stringify(e)),Promise.resolve()}_get(t){const e=this.storage.getItem(t);return Promise.resolve(e?JSON.parse(e):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dy=1e3,My=10;class oh extends ih{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,e)=>this.onStorageEvent(t,e),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Xd(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const e of Object.keys(this.listeners)){const r=this.storage.getItem(e),s=this.localCache[e];r!==s&&t(e,s,r)}}onStorageEvent(t,e=!1){if(!t.key){this.forAllChangedKeys((a,l,c)=>{this.notifyListeners(a,c)});return}const r=t.key;e?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!e&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);Wg()&&i!==t.newValue&&t.newValue!==t.oldValue?setTimeout(s,My):s()}notifyListeners(t,e){this.localCache[t]=e;const r=this.listeners[t];if(r)for(const s of Array.from(r))s(e&&JSON.parse(e))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,e,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:e,newValue:r}),!0)})},Dy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,e){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,e){await super._set(t,e),this.localCache[t]=JSON.stringify(e)}async _get(t){const e=await super._get(t);return this.localCache[t]=JSON.stringify(e),e}async _remove(t){await super._remove(t),delete this.localCache[t]}}oh.type="LOCAL";const Ny=oh;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ah extends ih{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,e){}_removeListener(t,e){}}ah.type="SESSION";const lh=ah;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ly(n){return Promise.all(n.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(e){return{fulfilled:!1,reason:e}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class co{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const e=this.receivers.find(s=>s.isListeningto(t));if(e)return e;const r=new co(t);return this.receivers.push(r),r}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const e=t,{eventId:r,eventType:s,data:i}=e.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;e.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const l=Array.from(a).map(async d=>d(e.origin,i)),c=await Ly(l);e.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:c})}_subscribe(t,e){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(e)}_unsubscribe(t,e){this.handlersMap[t]&&e&&this.handlersMap[t].delete(e),(!e||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}co.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ol(n="",t=10){let e="";for(let r=0;r<t;r++)e+=Math.floor(Math.random()*10);return n+e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,e,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((l,c)=>{const d=ol("",20);s.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(m){const v=m;if(v.data.eventId===d)switch(v.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(v.data.response);break;default:clearTimeout(f),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:t,eventId:d,data:e},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xe(){return window}function Oy(n){xe().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ch(){return typeof xe().WorkerGlobalScope<"u"&&typeof xe().importScripts=="function"}async function By(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Fy(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function Uy(){return ch()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uh="firebaseLocalStorageDb",zy=1,Gi="firebaseLocalStorage",dh="fbase_key";class Ws{constructor(t){this.request=t}toPromise(){return new Promise((t,e)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{e(this.request.error)})})}}function uo(n,t){return n.transaction([Gi],t?"readwrite":"readonly").objectStore(Gi)}function $y(){const n=indexedDB.deleteDatabase(uh);return new Ws(n).toPromise()}function Ia(){const n=indexedDB.open(uh,zy);return new Promise((t,e)=>{n.addEventListener("error",()=>{e(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Gi,{keyPath:dh})}catch(s){e(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Gi)?t(r):(r.close(),await $y(),t(await Ia()))})})}async function fu(n,t,e){const r=uo(n,!0).put({[dh]:t,value:e});return new Ws(r).toPromise()}async function qy(n,t){const e=uo(n,!1).get(t),r=await new Ws(e).toPromise();return r===void 0?null:r.value}function pu(n,t){const e=uo(n,!0).delete(t);return new Ws(e).toPromise()}const jy=800,Hy=3;class hh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Ia(),this.db)}async _withRetries(t){let e=0;for(;;)try{const r=await this._openDb();return await t(r)}catch(r){if(e++>Hy)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ch()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=co._getInstance(Uy()),this.receiver._subscribe("keyChanged",async(t,e)=>({keyProcessed:(await this._poll()).includes(e.key)})),this.receiver._subscribe("ping",async(t,e)=>["keyChanged"])}async initializeSender(){var t,e;if(this.activeServiceWorker=await By(),!this.activeServiceWorker)return;this.sender=new Vy(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((t=r[0])===null||t===void 0)&&t.fulfilled&&!((e=r[0])===null||e===void 0)&&e.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||Fy()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const t=await Ia();return await fu(t,Yi,"1"),await pu(t,Yi),!0}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,e){return this._withPendingWrite(async()=>(await this._withRetries(r=>fu(r,t,e)),this.localCache[t]=e,this.notifyServiceWorker(t)))}async _get(t){const e=await this._withRetries(r=>qy(r,t));return this.localCache[t]=e,e}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(e=>pu(e,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(s=>{const i=uo(s,!1).getAll();return new Ws(i).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const e=[],r=new Set;if(t.length!==0)for(const{fbase_key:s,value:i}of t)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),e.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),e.push(s));return e}notifyListeners(t,e){this.localCache[t]=e;const r=this.listeners[t];if(r)for(const s of Array.from(r))s(e)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),jy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,e){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}hh.type="LOCAL";const Wy=hh;new qs(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fh(n,t){return t?qe(t):(W(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class al extends rl{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return Cr(t,this._buildIdpRequest())}_linkToIdToken(t,e){return Cr(t,this._buildIdpRequest(e))}_getReauthenticationResolver(t){return Cr(t,this._buildIdpRequest())}_buildIdpRequest(t){const e={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(e.idToken=t),e}}function Yy(n){return rh(n.auth,new al(n),n.bypassAuthState)}function Gy(n){const{auth:t,user:e}=n;return W(e,t,"internal-error"),Ey(e,new al(n),n.bypassAuthState)}async function Ky(n){const{auth:t,user:e}=n;return W(e,t,"internal-error"),wy(e,new al(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ph{constructor(t,e,r,s,i=!1){this.auth=t,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(e)?e:[e]}execute(){return new Promise(async(t,e)=>{this.pendingPromise={resolve:t,reject:e};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(t){const{urlResponse:e,sessionId:r,postBody:s,tenantId:i,error:a,type:l}=t;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:e,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return Yy;case"linkViaPopup":case"linkViaRedirect":return Ky;case"reauthViaPopup":case"reauthViaRedirect":return Gy;default:pe(this.auth,"internal-error")}}resolve(t){Ye(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){Ye(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qy=new qs(2e3,1e4);async function Jy(n,t,e){if(_e(n.app))return Promise.reject(we(n,"operation-not-supported-in-this-environment"));const r=Ze(n);xg(n,t,il);const s=fh(r,e);return new zn(r,"signInViaPopup",t,s).executeNotNull()}class zn extends ph{constructor(t,e,r,s,i){super(t,e,s,i),this.provider=r,this.authWindow=null,this.pollId=null,zn.currentPopupAction&&zn.currentPopupAction.cancel(),zn.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return W(t,this.auth,"internal-error"),t}async onExecution(){Ye(this.filter.length===1,"Popup operations only handle one event");const t=ol();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(we(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var t;return((t=this.authWindow)===null||t===void 0?void 0:t.associatedEvent)||null}cancel(){this.reject(we(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,zn.currentPopupAction=null}pollUserCancellation(){const t=()=>{var e,r;if(!((r=(e=this.authWindow)===null||e===void 0?void 0:e.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(we(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,Qy.get())};t()}}zn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xy="pendingRedirect",ki=new Map;class Zy extends ph{constructor(t,e,r=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],e,void 0,r),this.eventId=null}async execute(){let t=ki.get(this.auth._key());if(!t){try{const r=await tv(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(r)}catch(e){t=()=>Promise.reject(e)}ki.set(this.auth._key(),t)}return this.bypassAuthState||ki.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const e=await this.auth._redirectUserForId(t.eventId);if(e)return this.user=e,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function tv(n,t){const e=rv(t),r=nv(n);if(!await r._isAvailable())return!1;const s=await r._get(e)==="true";return await r._remove(e),s}function ev(n,t){ki.set(n._key(),t)}function nv(n){return qe(n._redirectPersistence)}function rv(n){return Ci(Xy,n.config.apiKey,n.name)}async function sv(n,t,e=!1){if(_e(n.app))return Promise.reject(je(n));const r=Ze(n),s=fh(r,t),a=await new Zy(r,s,e).execute();return a&&!e&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,t)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iv=10*60*1e3;class ov{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let e=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(t,r)&&(e=!0,this.sendToConsumer(t,r),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!av(t)||(this.hasHandledPotentialRedirect=!0,e||(this.queuedRedirectEvent=t,e=!0)),e}sendToConsumer(t,e){var r;if(t.error&&!mh(t)){const s=((r=t.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";e.onError(we(this.auth,s))}else e.onAuthEvent(t)}isEventForConsumer(t,e){const r=e.eventId===null||!!t.eventId&&t.eventId===e.eventId;return e.filter.includes(t.type)&&r}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=iv&&this.cachedEventUids.clear(),this.cachedEventUids.has(mu(t))}saveEventToCache(t){this.cachedEventUids.add(mu(t)),this.lastProcessedEventTime=Date.now()}}function mu(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(t=>t).join("-")}function mh({type:n,error:t}){return n==="unknown"&&(t==null?void 0:t.code)==="auth/no-auth-event"}function av(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return mh(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lv(n,t={}){return Ne(n,"GET","/v1/projects",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cv=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,uv=/^https?/;async function dv(n){if(n.config.emulator)return;const{authorizedDomains:t}=await lv(n);for(const e of t)try{if(hv(e))return}catch{}pe(n,"unauthorized-domain")}function hv(n){const t=ba(),{protocol:e,hostname:r}=new URL(t);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?e==="chrome-extension:"&&n.replace("chrome-extension://","")===t.replace("chrome-extension://",""):e==="chrome-extension:"&&a.hostname===r}if(!uv.test(e))return!1;if(cv.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fv=new qs(3e4,6e4);function gu(){const n=xe().___jsl;if(n!=null&&n.H){for(const t of Object.keys(n.H))if(n.H[t].r=n.H[t].r||[],n.H[t].L=n.H[t].L||[],n.H[t].r=[...n.H[t].L],n.CP)for(let e=0;e<n.CP.length;e++)n.CP[e]=null}}function pv(n){return new Promise((t,e)=>{var r,s,i;function a(){gu(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{gu(),e(we(n,"network-request-failed"))},timeout:fv.get()})}if(!((s=(r=xe().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)t(gapi.iframes.getContext());else if(!((i=xe().gapi)===null||i===void 0)&&i.load)a();else{const l=ey("iframefcb");return xe()[l]=()=>{gapi.load?a():e(we(n,"network-request-failed"))},th(`${ty()}?onload=${l}`).catch(c=>e(c))}}).catch(t=>{throw Di=null,t})}let Di=null;function mv(n){return Di=Di||pv(n),Di}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gv=new qs(5e3,15e3),yv="__/auth/iframe",vv="emulator/auth/iframe",_v={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},wv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ev(n){const t=n.config;W(t.authDomain,n,"auth-domain-config-required");const e=t.emulator?tl(t,vv):`https://${n.config.authDomain}/${yv}`,r={apiKey:t.apiKey,appName:n.name,v:jr},s=wv.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${e}?${$s(r).slice(1)}`}async function bv(n){const t=await mv(n),e=xe().gapi;return W(e,n,"internal-error"),t.open({where:document.body,url:Ev(n),messageHandlersFilter:e.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:_v,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=we(n,"network-request-failed"),l=xe().setTimeout(()=>{i(a)},gv.get());function c(){xe().clearTimeout(l),s(r)}r.ping(c).then(c,()=>{i(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Iv=500,Sv=600,Av="_blank",xv="http://localhost";class yu{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Rv(n,t,e,r=Iv,s=Sv){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const c=Object.assign(Object.assign({},Tv),{width:r.toString(),height:s.toString(),top:i,left:a}),d=Xt().toLowerCase();e&&(l=Yd(d)?Av:e),Hd(d)&&(t=t||xv,c.scrollbars="yes");const f=Object.entries(c).reduce((v,[E,T])=>`${v}${E}=${T},`,"");if(Hg(d)&&l!=="_self")return Pv(t||"",l),new yu(null);const m=window.open(t||"",l,f);W(m,n,"popup-blocked");try{m.focus()}catch{}return new yu(m)}function Pv(n,t){const e=document.createElement("a");e.href=n,e.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),e.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cv="__/auth/handler",kv="emulator/auth/handler",Dv=encodeURIComponent("fac");async function vu(n,t,e,r,s,i){W(n.config.authDomain,n,"auth-domain-config-required"),W(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:e,redirectUrl:r,v:jr,eventId:s};if(t instanceof il){t.setDefaultLanguage(n.languageCode),a.providerId=t.providerId||"",hm(t.getCustomParameters())||(a.customParameters=JSON.stringify(t.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(t instanceof Hs){const f=t.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),d=c?`#${Dv}=${encodeURIComponent(c)}`:"";return`${Mv(n)}?${$s(l).slice(1)}${d}`}function Mv({config:n}){return n.emulator?tl(n,kv):`https://${n.authDomain}/${Cv}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ra="webStorageSupport";class Nv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=lh,this._completeRedirectFn=sv,this._overrideRedirectResult=ev}async _openPopup(t,e,r,s){var i;Ye((i=this.eventManagers[t._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await vu(t,e,r,ba(),s);return Rv(t,a,ol())}async _openRedirect(t,e,r,s){await this._originValidation(t);const i=await vu(t,e,r,ba(),s);return Oy(i),new Promise(()=>{})}_initialize(t){const e=t._key();if(this.eventManagers[e]){const{manager:s,promise:i}=this.eventManagers[e];return s?Promise.resolve(s):(Ye(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(t);return this.eventManagers[e]={promise:r},r.catch(()=>{delete this.eventManagers[e]}),r}async initAndGetManager(t){const e=await bv(t),r=new ov(t);return e.register("authEvent",s=>(W(s==null?void 0:s.authEvent,t,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:r},this.iframes[t._key()]=e,r}_isIframeWebStorageSupported(t,e){this.iframes[t._key()].send(ra,{type:ra},s=>{var i;const a=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[ra];a!==void 0&&e(!!a),pe(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const e=t._key();return this.originValidationPromises[e]||(this.originValidationPromises[e]=dv(t)),this.originValidationPromises[e]}get _shouldInitProactively(){return Xd()||Wd()||nl()}}const Lv=Nv;var _u="@firebase/auth",wu="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vv{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){var t;return this.assertAuthConfigured(),((t=this.auth.currentUser)===null||t===void 0?void 0:t.uid)||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const e=this.auth.onIdTokenChanged(r=>{t((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(t,e),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const e=this.internalListeners.get(t);e&&(this.internalListeners.delete(t),e(),this.updateProactiveRefresh())}assertAuthConfigured(){W(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ov(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Bv(n){Nr(new Yn("auth",(t,{options:e})=>{const r=t.getProvider("app").getImmediate(),s=t.getProvider("heartbeat"),i=t.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=r.options;W(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Zd(n)},d=new Jg(r,s,i,c);return oy(d,e),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,r)=>{t.getProvider("auth-internal").initialize()})),Nr(new Yn("auth-internal",t=>{const e=Ze(t.getProvider("auth").getImmediate());return(r=>new Vv(r))(e)},"PRIVATE").setInstantiationMode("EXPLICIT")),yn(_u,wu,Ov(n)),yn(_u,wu,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fv=5*60,Uv=Cd("authIdTokenMaxAge")||Fv;let Eu=null;const zv=n=>async t=>{const e=t&&await t.getIdTokenResult(),r=e&&(new Date().getTime()-Date.parse(e.issuedAtTime))/1e3;if(r&&r>Uv)return;const s=e==null?void 0:e.token;Eu!==s&&(Eu=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function $v(n=Nd()){const t=Qa(n,"auth");if(t.isInitialized())return t.getImmediate();const e=iy(n,{popupRedirectResolver:Lv,persistence:[Wy,Ny,lh]}),r=Cd("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=zv(i.toString());Py(e,a,()=>a(e.currentUser)),Ry(e,l=>a(l))}}const s=Rd("auth");return s&&ay(e,`http://${s}`),e}function qv(){var n,t;return(t=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&t!==void 0?t:document}Xg({loadJS(n){return new Promise((t,e)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=t,r.onerror=s=>{const i=we("internal-error");i.customData=s,e(i)},r.type="text/javascript",r.charset="UTF-8",qv().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Bv("Browser");var bu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var qn,gh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(b,g){function y(){}y.prototype=g.prototype,b.D=g.prototype,b.prototype=new y,b.prototype.constructor=b,b.C=function(_,I,S){for(var w=Array(arguments.length-2),at=2;at<arguments.length;at++)w[at-2]=arguments[at];return g.prototype[I].apply(_,w)}}function e(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(r,e),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(b,g,y){y||(y=0);var _=Array(16);if(typeof g=="string")for(var I=0;16>I;++I)_[I]=g.charCodeAt(y++)|g.charCodeAt(y++)<<8|g.charCodeAt(y++)<<16|g.charCodeAt(y++)<<24;else for(I=0;16>I;++I)_[I]=g[y++]|g[y++]<<8|g[y++]<<16|g[y++]<<24;g=b.g[0],y=b.g[1],I=b.g[2];var S=b.g[3],w=g+(S^y&(I^S))+_[0]+3614090360&4294967295;g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[1]+3905402710&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[2]+606105819&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[3]+3250441966&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(S^y&(I^S))+_[4]+4118548399&4294967295,g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[5]+1200080426&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[6]+2821735955&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[7]+4249261313&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(S^y&(I^S))+_[8]+1770035416&4294967295,g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[9]+2336552879&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[10]+4294925233&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[11]+2304563134&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(S^y&(I^S))+_[12]+1804603682&4294967295,g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[13]+4254626195&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[14]+2792965006&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[15]+1236535329&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(I^S&(y^I))+_[1]+4129170786&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[6]+3225465664&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[11]+643717713&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[0]+3921069994&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(I^S&(y^I))+_[5]+3593408605&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[10]+38016083&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[15]+3634488961&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[4]+3889429448&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(I^S&(y^I))+_[9]+568446438&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[14]+3275163606&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[3]+4107603335&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[8]+1163531501&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(I^S&(y^I))+_[13]+2850285829&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[2]+4243563512&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[7]+1735328473&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[12]+2368359562&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(y^I^S)+_[5]+4294588738&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[8]+2272392833&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[11]+1839030562&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[14]+4259657740&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(y^I^S)+_[1]+2763975236&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[4]+1272893353&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[7]+4139469664&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[10]+3200236656&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(y^I^S)+_[13]+681279174&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[0]+3936430074&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[3]+3572445317&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[6]+76029189&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(y^I^S)+_[9]+3654602809&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[12]+3873151461&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[15]+530742520&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[2]+3299628645&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(I^(y|~S))+_[0]+4096336452&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[7]+1126891415&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[14]+2878612391&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[5]+4237533241&4294967295,y=I+(w<<21&4294967295|w>>>11),w=g+(I^(y|~S))+_[12]+1700485571&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[3]+2399980690&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[10]+4293915773&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[1]+2240044497&4294967295,y=I+(w<<21&4294967295|w>>>11),w=g+(I^(y|~S))+_[8]+1873313359&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[15]+4264355552&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[6]+2734768916&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[13]+1309151649&4294967295,y=I+(w<<21&4294967295|w>>>11),w=g+(I^(y|~S))+_[4]+4149444226&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[11]+3174756917&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[2]+718787259&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[9]+3951481745&4294967295,b.g[0]=b.g[0]+g&4294967295,b.g[1]=b.g[1]+(I+(w<<21&4294967295|w>>>11))&4294967295,b.g[2]=b.g[2]+I&4294967295,b.g[3]=b.g[3]+S&4294967295}r.prototype.u=function(b,g){g===void 0&&(g=b.length);for(var y=g-this.blockSize,_=this.B,I=this.h,S=0;S<g;){if(I==0)for(;S<=y;)s(this,b,S),S+=this.blockSize;if(typeof b=="string"){for(;S<g;)if(_[I++]=b.charCodeAt(S++),I==this.blockSize){s(this,_),I=0;break}}else for(;S<g;)if(_[I++]=b[S++],I==this.blockSize){s(this,_),I=0;break}}this.h=I,this.o+=g},r.prototype.v=function(){var b=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);b[0]=128;for(var g=1;g<b.length-8;++g)b[g]=0;var y=8*this.o;for(g=b.length-8;g<b.length;++g)b[g]=y&255,y/=256;for(this.u(b),b=Array(16),g=y=0;4>g;++g)for(var _=0;32>_;_+=8)b[y++]=this.g[g]>>>_&255;return b};function i(b,g){var y=l;return Object.prototype.hasOwnProperty.call(y,b)?y[b]:y[b]=g(b)}function a(b,g){this.h=g;for(var y=[],_=!0,I=b.length-1;0<=I;I--){var S=b[I]|0;_&&S==g||(y[I]=S,_=!1)}this.g=y}var l={};function c(b){return-128<=b&&128>b?i(b,function(g){return new a([g|0],0>g?-1:0)}):new a([b|0],0>b?-1:0)}function d(b){if(isNaN(b)||!isFinite(b))return m;if(0>b)return R(d(-b));for(var g=[],y=1,_=0;b>=y;_++)g[_]=b/y|0,y*=4294967296;return new a(g,0)}function f(b,g){if(b.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(b.charAt(0)=="-")return R(f(b.substring(1),g));if(0<=b.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(g,8)),_=m,I=0;I<b.length;I+=8){var S=Math.min(8,b.length-I),w=parseInt(b.substring(I,I+S),g);8>S?(S=d(Math.pow(g,S)),_=_.j(S).add(d(w))):(_=_.j(y),_=_.add(d(w)))}return _}var m=c(0),v=c(1),E=c(16777216);n=a.prototype,n.m=function(){if(x(this))return-R(this).m();for(var b=0,g=1,y=0;y<this.g.length;y++){var _=this.i(y);b+=(0<=_?_:4294967296+_)*g,g*=4294967296}return b},n.toString=function(b){if(b=b||10,2>b||36<b)throw Error("radix out of range: "+b);if(T(this))return"0";if(x(this))return"-"+R(this).toString(b);for(var g=d(Math.pow(b,6)),y=this,_="";;){var I=C(y,g).g;y=A(y,I.j(g));var S=((0<y.g.length?y.g[0]:y.h)>>>0).toString(b);if(y=I,T(y))return S+_;for(;6>S.length;)S="0"+S;_=S+_}},n.i=function(b){return 0>b?0:b<this.g.length?this.g[b]:this.h};function T(b){if(b.h!=0)return!1;for(var g=0;g<b.g.length;g++)if(b.g[g]!=0)return!1;return!0}function x(b){return b.h==-1}n.l=function(b){return b=A(this,b),x(b)?-1:T(b)?0:1};function R(b){for(var g=b.g.length,y=[],_=0;_<g;_++)y[_]=~b.g[_];return new a(y,~b.h).add(v)}n.abs=function(){return x(this)?R(this):this},n.add=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],_=0,I=0;I<=g;I++){var S=_+(this.i(I)&65535)+(b.i(I)&65535),w=(S>>>16)+(this.i(I)>>>16)+(b.i(I)>>>16);_=w>>>16,S&=65535,w&=65535,y[I]=w<<16|S}return new a(y,y[y.length-1]&-2147483648?-1:0)};function A(b,g){return b.add(R(g))}n.j=function(b){if(T(this)||T(b))return m;if(x(this))return x(b)?R(this).j(R(b)):R(R(this).j(b));if(x(b))return R(this.j(R(b)));if(0>this.l(E)&&0>b.l(E))return d(this.m()*b.m());for(var g=this.g.length+b.g.length,y=[],_=0;_<2*g;_++)y[_]=0;for(_=0;_<this.g.length;_++)for(var I=0;I<b.g.length;I++){var S=this.i(_)>>>16,w=this.i(_)&65535,at=b.i(I)>>>16,kt=b.i(I)&65535;y[2*_+2*I]+=w*kt,D(y,2*_+2*I),y[2*_+2*I+1]+=S*kt,D(y,2*_+2*I+1),y[2*_+2*I+1]+=w*at,D(y,2*_+2*I+1),y[2*_+2*I+2]+=S*at,D(y,2*_+2*I+2)}for(_=0;_<g;_++)y[_]=y[2*_+1]<<16|y[2*_];for(_=g;_<2*g;_++)y[_]=0;return new a(y,0)};function D(b,g){for(;(b[g]&65535)!=b[g];)b[g+1]+=b[g]>>>16,b[g]&=65535,g++}function N(b,g){this.g=b,this.h=g}function C(b,g){if(T(g))throw Error("division by zero");if(T(b))return new N(m,m);if(x(b))return g=C(R(b),g),new N(R(g.g),R(g.h));if(x(g))return g=C(b,R(g)),new N(R(g.g),g.h);if(30<b.g.length){if(x(b)||x(g))throw Error("slowDivide_ only works with positive integers.");for(var y=v,_=g;0>=_.l(b);)y=V(y),_=V(_);var I=O(y,1),S=O(_,1);for(_=O(_,2),y=O(y,2);!T(_);){var w=S.add(_);0>=w.l(b)&&(I=I.add(y),S=w),_=O(_,1),y=O(y,1)}return g=A(b,I.j(g)),new N(I,g)}for(I=m;0<=b.l(g);){for(y=Math.max(1,Math.floor(b.m()/g.m())),_=Math.ceil(Math.log(y)/Math.LN2),_=48>=_?1:Math.pow(2,_-48),S=d(y),w=S.j(g);x(w)||0<w.l(b);)y-=_,S=d(y),w=S.j(g);T(S)&&(S=v),I=I.add(S),b=A(b,w)}return new N(I,b)}n.A=function(b){return C(this,b).h},n.and=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],_=0;_<g;_++)y[_]=this.i(_)&b.i(_);return new a(y,this.h&b.h)},n.or=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],_=0;_<g;_++)y[_]=this.i(_)|b.i(_);return new a(y,this.h|b.h)},n.xor=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],_=0;_<g;_++)y[_]=this.i(_)^b.i(_);return new a(y,this.h^b.h)};function V(b){for(var g=b.g.length+1,y=[],_=0;_<g;_++)y[_]=b.i(_)<<1|b.i(_-1)>>>31;return new a(y,b.h)}function O(b,g){var y=g>>5;g%=32;for(var _=b.g.length-y,I=[],S=0;S<_;S++)I[S]=0<g?b.i(S+y)>>>g|b.i(S+y+1)<<32-g:b.i(S+y);return new a(I,b.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,gh=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,qn=a}).apply(typeof bu<"u"?bu:typeof self<"u"?self:typeof window<"u"?window:{});var Si=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var yh,vs,vh,Mi,Sa,_h,wh,Eh;(function(){var n,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function e(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Si=="object"&&Si];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=e(this);function s(o,u){if(u)t:{var h=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var P=o[p];if(!(P in h))break t;h=h[P]}o=o[o.length-1],p=h[o],u=u(p),u!=p&&u!=null&&t(h,o,{configurable:!0,writable:!0,value:u})}}function i(o,u){o instanceof String&&(o+="");var h=0,p=!1,P={next:function(){if(!p&&h<o.length){var k=h++;return{value:u(k,o[k]),done:!1}}return p=!0,{done:!0,value:void 0}}};return P[Symbol.iterator]=function(){return P},P}s("Array.prototype.values",function(o){return o||function(){return i(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function c(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function f(o,u,h){return o.call.apply(o.bind,arguments)}function m(o,u,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var P=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(P,p),o.apply(u,P)}}return function(){return o.apply(u,arguments)}}function v(o,u,h){return v=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,v.apply(null,arguments)}function E(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function T(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,P,k){for(var B=Array(arguments.length-2),dt=2;dt<arguments.length;dt++)B[dt-2]=arguments[dt];return u.prototype[P].apply(p,B)}}function x(o){const u=o.length;if(0<u){const h=Array(u);for(let p=0;p<u;p++)h[p]=o[p];return h}return[]}function R(o,u){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(c(p)){const P=o.length||0,k=p.length||0;o.length=P+k;for(let B=0;B<k;B++)o[P+B]=p[B]}else o.push(p)}}class A{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function D(o){return/^[\s\xa0]*$/.test(o)}function N(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function C(o){return C[" "](o),o}C[" "]=function(){};var V=N().indexOf("Gecko")!=-1&&!(N().toLowerCase().indexOf("webkit")!=-1&&N().indexOf("Edge")==-1)&&!(N().indexOf("Trident")!=-1||N().indexOf("MSIE")!=-1)&&N().indexOf("Edge")==-1;function O(o,u,h){for(const p in o)u.call(h,o[p],p,o)}function b(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function g(o){const u={};for(const h in o)u[h]=o[h];return u}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function _(o,u){let h,p;for(let P=1;P<arguments.length;P++){p=arguments[P];for(h in p)o[h]=p[h];for(let k=0;k<y.length;k++)h=y[k],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function I(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function S(o){l.setTimeout(()=>{throw o},0)}function w(){var o=ht;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class at{constructor(){this.h=this.g=null}add(u,h){const p=kt.get();p.set(u,h),this.h?this.h.next=p:this.g=p,this.h=p}}var kt=new A(()=>new Z,o=>o.reset());class Z{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let It,ct=!1,ht=new at,Nt=()=>{const o=l.Promise.resolve(void 0);It=()=>{o.then(ut)}};var ut=()=>{for(var o;o=w();){try{o.h.call(o.g)}catch(h){S(h)}var u=kt;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}ct=!1};function _t(){this.s=this.s,this.C=this.C}_t.prototype.s=!1,_t.prototype.ma=function(){this.s||(this.s=!0,this.N())},_t.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function $(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}$.prototype.h=function(){this.defaultPrevented=!0};var wt=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};l.addEventListener("test",h,u),l.removeEventListener("test",h,u)}catch{}return o}();function X(o,u){if($.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(V){t:{try{C(u.nodeName);var P=!0;break t}catch{}P=!1}P||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:ot[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&X.aa.h.call(this)}}T(X,$);var ot={2:"touch",3:"pen",4:"mouse"};X.prototype.h=function(){X.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Lt="closure_listenable_"+(1e6*Math.random()|0),ce=0;function ue(o,u,h,p,P){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!p,this.ha=P,this.key=++ce,this.da=this.fa=!1}function Vt(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function be(o){this.src=o,this.g={},this.h=0}be.prototype.add=function(o,u,h,p,P){var k=o.toString();o=this.g[k],o||(o=this.g[k]=[],this.h++);var B=or(o,u,p,P);return-1<B?(u=o[B],h||(u.fa=!1)):(u=new ue(u,this.src,k,!!p,P),u.fa=h,o.push(u)),u};function ir(o,u){var h=u.type;if(h in o.g){var p=o.g[h],P=Array.prototype.indexOf.call(p,u,void 0),k;(k=0<=P)&&Array.prototype.splice.call(p,P,1),k&&(Vt(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function or(o,u,h,p){for(var P=0;P<o.length;++P){var k=o[P];if(!k.da&&k.listener==u&&k.capture==!!h&&k.ha==p)return P}return-1}var Cn="closure_lm_"+(1e6*Math.random()|0),kn={};function Te(o,u,h,p,P){if(Array.isArray(u)){for(var k=0;k<u.length;k++)Te(o,u[k],h,p,P);return null}return h=hr(h),o&&o[Lt]?o.K(u,h,d(p)?!!p.capture:!1,P):ar(o,u,h,!1,p,P)}function ar(o,u,h,p,P,k){if(!u)throw Error("Invalid event type");var B=d(P)?!!P.capture:!!P,dt=dr(o);if(dt||(o[Cn]=dt=new be(o)),h=dt.add(u,h,p,B,k),h.proxy)return h;if(p=lr(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)wt||(P=B),P===void 0&&(P=!1),o.addEventListener(u.toString(),p,P);else if(o.attachEvent)o.attachEvent(tn(u.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function lr(){function o(h){return u.call(o.src,o.listener,h)}const u=Bo;return o}function cr(o,u,h,p,P){if(Array.isArray(u))for(var k=0;k<u.length;k++)cr(o,u[k],h,p,P);else p=d(p)?!!p.capture:!!p,h=hr(h),o&&o[Lt]?(o=o.i,u=String(u).toString(),u in o.g&&(k=o.g[u],h=or(k,h,p,P),-1<h&&(Vt(k[h]),Array.prototype.splice.call(k,h,1),k.length==0&&(delete o.g[u],o.h--)))):o&&(o=dr(o))&&(u=o.g[u.toString()],o=-1,u&&(o=or(u,h,p,P)),(h=-1<o?u[o]:null)&&ur(h))}function ur(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[Lt])ir(u.i,o);else{var h=o.type,p=o.proxy;u.removeEventListener?u.removeEventListener(h,p,o.capture):u.detachEvent?u.detachEvent(tn(h),p):u.addListener&&u.removeListener&&u.removeListener(p),(h=dr(u))?(ir(h,o),h.h==0&&(h.src=null,u[Cn]=null)):Vt(o)}}}function tn(o){return o in kn?kn[o]:kn[o]="on"+o}function Bo(o,u){if(o.da)o=!0;else{u=new X(u,this);var h=o.listener,p=o.ha||o.src;o.fa&&ur(o),o=h.call(p,u)}return o}function dr(o){return o=o[Cn],o instanceof be?o:null}var Xr="__closure_events_fn_"+(1e9*Math.random()>>>0);function hr(o){return typeof o=="function"?o:(o[Xr]||(o[Xr]=function(u){return o.handleEvent(u)}),o[Xr])}function Ft(){_t.call(this),this.i=new be(this),this.M=this,this.F=null}T(Ft,_t),Ft.prototype[Lt]=!0,Ft.prototype.removeEventListener=function(o,u,h,p){cr(this,o,u,h,p)};function Ut(o,u){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=u.type||u,typeof u=="string")u=new $(u,o);else if(u instanceof $)u.target=u.target||o;else{var P=u;u=new $(p,o),_(u,P)}if(P=!0,h)for(var k=h.length-1;0<=k;k--){var B=u.g=h[k];P=Zr(B,p,!0,u)&&P}if(B=u.g=o,P=Zr(B,p,!0,u)&&P,P=Zr(B,p,!1,u)&&P,h)for(k=0;k<h.length;k++)B=u.g=h[k],P=Zr(B,p,!1,u)&&P}Ft.prototype.N=function(){if(Ft.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],p=0;p<h.length;p++)Vt(h[p]);delete o.g[u],o.h--}}this.F=null},Ft.prototype.K=function(o,u,h,p){return this.i.add(String(o),u,!1,h,p)},Ft.prototype.L=function(o,u,h,p){return this.i.add(String(o),u,!0,h,p)};function Zr(o,u,h,p){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var P=!0,k=0;k<u.length;++k){var B=u[k];if(B&&!B.da&&B.capture==h){var dt=B.listener,zt=B.ha||B.src;B.fa&&ir(o.i,B),P=dt.call(zt,p)!==!1&&P}}return P&&!p.defaultPrevented}function Le(o,u,h){if(typeof o=="function")h&&(o=v(o,h));else if(o&&typeof o.handleEvent=="function")o=v(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(o,u||0)}function Ve(o){o.g=Le(()=>{o.g=null,o.i&&(o.i=!1,Ve(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class oi extends _t{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Ve(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function fr(o){_t.call(this),this.h=o,this.g={}}T(fr,_t);var ts=[];function ai(o){O(o.g,function(u,h){this.g.hasOwnProperty(h)&&ur(u)},o),o.g={}}fr.prototype.N=function(){fr.aa.N.call(this),ai(this)},fr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var es=l.JSON.stringify,pr=l.JSON.parse,ns=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function Dn(){}Dn.prototype.h=null;function li(o){return o.h||(o.h=o.i())}function rs(){}var en={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function mr(){$.call(this,"d")}T(mr,$);function gr(){$.call(this,"c")}T(gr,$);var J={},Dt=null;function mt(){return Dt=Dt||new Ft}J.La="serverreachability";function Oe(o){$.call(this,J.La,o)}T(Oe,$);function ge(o){const u=mt();Ut(u,new Oe(u))}J.STAT_EVENT="statevent";function ye(o,u){$.call(this,J.STAT_EVENT,o),this.stat=u}T(ye,$);function yt(o){const u=mt();Ut(u,new ye(u,o))}J.Ma="timingevent";function bt(o,u){$.call(this,J.Ma,o),this.size=u}T(bt,$);function gt(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},u)}function St(){this.g=!0}St.prototype.xa=function(){this.g=!1};function Zt(o,u,h,p,P,k){o.info(function(){if(o.g)if(k)for(var B="",dt=k.split("&"),zt=0;zt<dt.length;zt++){var rt=dt[zt].split("=");if(1<rt.length){var Wt=rt[0];rt=rt[1];var Yt=Wt.split("_");B=2<=Yt.length&&Yt[1]=="type"?B+(Wt+"="+rt+"&"):B+(Wt+"=redacted&")}}else B=null;else B=k;return"XMLHTTP REQ ("+p+") [attempt "+P+"]: "+u+`
`+h+`
`+B})}function Mn(o,u,h,p,P,k,B){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+P+"]: "+u+`
`+h+`
`+k+" "+B})}function At(o,u,h,p){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+yr(o,h)+(p?" "+p:"")})}function Nn(o,u){o.info(function(){return"TIMEOUT: "+u})}St.prototype.info=function(){};function yr(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var P=p[1];if(Array.isArray(P)&&!(1>P.length)){var k=P[0];if(k!="noop"&&k!="stop"&&k!="close")for(var B=1;B<P.length;B++)P[B]=""}}}}return es(h)}catch{return u}}var Ln={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},ci={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ss;function ui(){}T(ui,Dn),ui.prototype.g=function(){return new XMLHttpRequest},ui.prototype.i=function(){return{}},ss=new ui;function nn(o,u,h,p){this.j=o,this.i=u,this.l=h,this.R=p||1,this.U=new fr(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ac}function ac(){this.i=null,this.g="",this.h=!1}var lc={},Fo={};function Uo(o,u,h){o.L=1,o.v=pi(Be(u)),o.m=h,o.P=!0,cc(o,null)}function cc(o,u){o.F=Date.now(),di(o),o.A=Be(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),Tc(h.i,"t",p),o.C=0,h=o.j.J,o.h=new ac,o.g=zc(o.j,h?u:null,!o.m),0<o.O&&(o.M=new oi(v(o.Y,o,o.g),o.O)),u=o.U,h=o.g,p=o.ca;var P="readystatechange";Array.isArray(P)||(P&&(ts[0]=P.toString()),P=ts);for(var k=0;k<P.length;k++){var B=Te(h,P[k],p||u.handleEvent,!1,u.h||u);if(!B)break;u.g[B.key]=B}u=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),ge(),Zt(o.i,o.u,o.A,o.l,o.R,o.m)}nn.prototype.ca=function(o){o=o.target;const u=this.M;u&&Fe(o)==3?u.j():this.Y(o)},nn.prototype.Y=function(o){try{if(o==this.g)t:{const Yt=Fe(this.g);var u=this.g.Ba();const wr=this.g.Z();if(!(3>Yt)&&(Yt!=3||this.g&&(this.h.h||this.g.oa()||Cc(this.g)))){this.J||Yt!=4||u==7||(u==8||0>=wr?ge(3):ge(2)),zo(this);var h=this.g.Z();this.X=h;e:if(uc(this)){var p=Cc(this.g);o="";var P=p.length,k=Fe(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Vn(this),is(this);var B="";break e}this.h.i=new l.TextDecoder}for(u=0;u<P;u++)this.h.h=!0,o+=this.h.i.decode(p[u],{stream:!(k&&u==P-1)});p.length=0,this.h.g+=o,this.C=0,B=this.h.g}else B=this.g.oa();if(this.o=h==200,Mn(this.i,this.u,this.A,this.l,this.R,Yt,h),this.o){if(this.T&&!this.K){e:{if(this.g){var dt,zt=this.g;if((dt=zt.g?zt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!D(dt)){var rt=dt;break e}}rt=null}if(h=rt)At(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,$o(this,h);else{this.o=!1,this.s=3,yt(12),Vn(this),is(this);break t}}if(this.P){h=!0;let ve;for(;!this.J&&this.C<B.length;)if(ve=dp(this,B),ve==Fo){Yt==4&&(this.s=4,yt(14),h=!1),At(this.i,this.l,null,"[Incomplete Response]");break}else if(ve==lc){this.s=4,yt(15),At(this.i,this.l,B,"[Invalid Chunk]"),h=!1;break}else At(this.i,this.l,ve,null),$o(this,ve);if(uc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Yt!=4||B.length!=0||this.h.h||(this.s=1,yt(16),h=!1),this.o=this.o&&h,!h)At(this.i,this.l,B,"[Invalid Chunked Response]"),Vn(this),is(this);else if(0<B.length&&!this.W){this.W=!0;var Wt=this.j;Wt.g==this&&Wt.ba&&!Wt.M&&(Wt.j.info("Great, no buffering proxy detected. Bytes received: "+B.length),Go(Wt),Wt.M=!0,yt(11))}}else At(this.i,this.l,B,null),$o(this,B);Yt==4&&Vn(this),this.o&&!this.J&&(Yt==4?Oc(this.j,this):(this.o=!1,di(this)))}else Rp(this.g),h==400&&0<B.indexOf("Unknown SID")?(this.s=3,yt(12)):(this.s=0,yt(13)),Vn(this),is(this)}}}catch{}finally{}};function uc(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function dp(o,u){var h=o.C,p=u.indexOf(`
`,h);return p==-1?Fo:(h=Number(u.substring(h,p)),isNaN(h)?lc:(p+=1,p+h>u.length?Fo:(u=u.slice(p,p+h),o.C=p+h,u)))}nn.prototype.cancel=function(){this.J=!0,Vn(this)};function di(o){o.S=Date.now()+o.I,dc(o,o.I)}function dc(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=gt(v(o.ba,o),u)}function zo(o){o.B&&(l.clearTimeout(o.B),o.B=null)}nn.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(Nn(this.i,this.A),this.L!=2&&(ge(),yt(17)),Vn(this),this.s=2,is(this)):dc(this,this.S-o)};function is(o){o.j.G==0||o.J||Oc(o.j,o)}function Vn(o){zo(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,ai(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function $o(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||qo(h.h,o))){if(!o.K&&qo(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(u)}catch{p=null}if(Array.isArray(p)&&p.length==3){var P=p;if(P[0]==0){t:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)wi(h),vi(h);else break t;Yo(h),yt(18)}}else h.za=P[1],0<h.za-h.T&&37500>P[2]&&h.F&&h.v==0&&!h.C&&(h.C=gt(v(h.Za,h),6e3));if(1>=pc(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Bn(h,11)}else if((o.K||h.g==o)&&wi(h),!D(u))for(P=h.Da.g.parse(u),u=0;u<P.length;u++){let rt=P[u];if(h.T=rt[0],rt=rt[1],h.G==2)if(rt[0]=="c"){h.K=rt[1],h.ia=rt[2];const Wt=rt[3];Wt!=null&&(h.la=Wt,h.j.info("VER="+h.la));const Yt=rt[4];Yt!=null&&(h.Aa=Yt,h.j.info("SVER="+h.Aa));const wr=rt[5];wr!=null&&typeof wr=="number"&&0<wr&&(p=1.5*wr,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const ve=o.g;if(ve){const bi=ve.g?ve.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(bi){var k=p.h;k.g||bi.indexOf("spdy")==-1&&bi.indexOf("quic")==-1&&bi.indexOf("h2")==-1||(k.j=k.l,k.g=new Set,k.h&&(jo(k,k.h),k.h=null))}if(p.D){const Ko=ve.g?ve.g.getResponseHeader("X-HTTP-Session-Id"):null;Ko&&(p.ya=Ko,ft(p.I,p.D,Ko))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var B=o;if(p.qa=Uc(p,p.J?p.ia:null,p.W),B.K){mc(p.h,B);var dt=B,zt=p.L;zt&&(dt.I=zt),dt.B&&(zo(dt),di(dt)),p.g=B}else Lc(p);0<h.i.length&&_i(h)}else rt[0]!="stop"&&rt[0]!="close"||Bn(h,7);else h.G==3&&(rt[0]=="stop"||rt[0]=="close"?rt[0]=="stop"?Bn(h,7):Wo(h):rt[0]!="noop"&&h.l&&h.l.ta(rt),h.v=0)}}ge(4)}catch{}}var hp=class{constructor(o,u){this.g=o,this.map=u}};function hc(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function fc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function pc(o){return o.h?1:o.g?o.g.size:0}function qo(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function jo(o,u){o.g?o.g.add(u):o.h=u}function mc(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}hc.prototype.cancel=function(){if(this.i=gc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function gc(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return x(o.i)}function fp(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var u=[],h=o.length,p=0;p<h;p++)u.push(o[p]);return u}u=[],h=0;for(p in o)u[h++]=o[p];return u}function pp(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const p in o)u[h++]=p;return u}}}function yc(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=pp(o),p=fp(o),P=p.length,k=0;k<P;k++)u.call(void 0,p[k],h&&h[k],o)}var vc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function mp(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),P=null;if(0<=p){var k=o[h].substring(0,p);P=o[h].substring(p+1)}else k=o[h];u(k,P?decodeURIComponent(P.replace(/\+/g," ")):"")}}}function On(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof On){this.h=o.h,hi(this,o.j),this.o=o.o,this.g=o.g,fi(this,o.s),this.l=o.l;var u=o.i,h=new ls;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),_c(this,h),this.m=o.m}else o&&(u=String(o).match(vc))?(this.h=!1,hi(this,u[1]||"",!0),this.o=os(u[2]||""),this.g=os(u[3]||"",!0),fi(this,u[4]),this.l=os(u[5]||"",!0),_c(this,u[6]||"",!0),this.m=os(u[7]||"")):(this.h=!1,this.i=new ls(null,this.h))}On.prototype.toString=function(){var o=[],u=this.j;u&&o.push(as(u,wc,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(as(u,wc,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(as(h,h.charAt(0)=="/"?vp:yp,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",as(h,wp)),o.join("")};function Be(o){return new On(o)}function hi(o,u,h){o.j=h?os(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function fi(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function _c(o,u,h){u instanceof ls?(o.i=u,Ep(o.i,o.h)):(h||(u=as(u,_p)),o.i=new ls(u,o.h))}function ft(o,u,h){o.i.set(u,h)}function pi(o){return ft(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function os(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function as(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,gp),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function gp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var wc=/[#\/\?@]/g,yp=/[#\?:]/g,vp=/[#\?]/g,_p=/[#\?@]/g,wp=/#/g;function ls(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function rn(o){o.g||(o.g=new Map,o.h=0,o.i&&mp(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=ls.prototype,n.add=function(o,u){rn(this),this.i=null,o=vr(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function Ec(o,u){rn(o),u=vr(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function bc(o,u){return rn(o),u=vr(o,u),o.g.has(u)}n.forEach=function(o,u){rn(this),this.g.forEach(function(h,p){h.forEach(function(P){o.call(u,P,p,this)},this)},this)},n.na=function(){rn(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let p=0;p<u.length;p++){const P=o[p];for(let k=0;k<P.length;k++)h.push(u[p])}return h},n.V=function(o){rn(this);let u=[];if(typeof o=="string")bc(this,o)&&(u=u.concat(this.g.get(vr(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},n.set=function(o,u){return rn(this),this.i=null,o=vr(this,o),bc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function Tc(o,u,h){Ec(o,u),0<h.length&&(o.i=null,o.g.set(vr(o,u),x(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var p=u[h];const k=encodeURIComponent(String(p)),B=this.V(p);for(p=0;p<B.length;p++){var P=k;B[p]!==""&&(P+="="+encodeURIComponent(String(B[p]))),o.push(P)}}return this.i=o.join("&")};function vr(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function Ep(o,u){u&&!o.j&&(rn(o),o.i=null,o.g.forEach(function(h,p){var P=p.toLowerCase();p!=P&&(Ec(this,p),Tc(this,P,h))},o)),o.j=u}function bp(o,u){const h=new St;if(l.Image){const p=new Image;p.onload=E(sn,h,"TestLoadImage: loaded",!0,u,p),p.onerror=E(sn,h,"TestLoadImage: error",!1,u,p),p.onabort=E(sn,h,"TestLoadImage: abort",!1,u,p),p.ontimeout=E(sn,h,"TestLoadImage: timeout",!1,u,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else u(!1)}function Tp(o,u){const h=new St,p=new AbortController,P=setTimeout(()=>{p.abort(),sn(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:p.signal}).then(k=>{clearTimeout(P),k.ok?sn(h,"TestPingServer: ok",!0,u):sn(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(P),sn(h,"TestPingServer: error",!1,u)})}function sn(o,u,h,p,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),p(h)}catch{}}function Ip(){this.g=new ns}function Sp(o,u,h){const p=h||"";try{yc(o,function(P,k){let B=P;d(P)&&(B=es(P)),u.push(p+k+"="+encodeURIComponent(B))})}catch(P){throw u.push(p+"type="+encodeURIComponent("_badmap")),P}}function mi(o){this.l=o.Ub||null,this.j=o.eb||!1}T(mi,Dn),mi.prototype.g=function(){return new gi(this.l,this.j)},mi.prototype.i=function(o){return function(){return o}}({});function gi(o,u){Ft.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}T(gi,Ft),n=gi.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,us(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,cs(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,us(this)),this.g&&(this.readyState=3,us(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Ic(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Ic(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?cs(this):us(this),this.readyState==3&&Ic(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,cs(this))},n.Qa=function(o){this.g&&(this.response=o,cs(this))},n.ga=function(){this.g&&cs(this)};function cs(o){o.readyState=4,o.l=null,o.j=null,o.v=null,us(o)}n.setRequestHeader=function(o,u){this.u.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function us(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(gi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Sc(o){let u="";return O(o,function(h,p){u+=p,u+=":",u+=h,u+=`\r
`}),u}function Ho(o,u,h){t:{for(p in h){var p=!1;break t}p=!0}p||(h=Sc(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):ft(o,u,h))}function Et(o){Ft.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}T(Et,Ft);var Ap=/^https?$/i,xp=["POST","PUT"];n=Et.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,u,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ss.g(),this.v=this.o?li(this.o):li(ss),this.g.onreadystatechange=v(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(k){Ac(this,k);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var P in p)h.set(P,p[P]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const k of p.keys())h.set(k,p.get(k));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(k=>k.toLowerCase()=="content-type"),P=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(xp,u,void 0))||p||P||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[k,B]of h)this.g.setRequestHeader(k,B);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Pc(this),this.u=!0,this.g.send(o),this.u=!1}catch(k){Ac(this,k)}};function Ac(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,xc(o),yi(o)}function xc(o){o.A||(o.A=!0,Ut(o,"complete"),Ut(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Ut(this,"complete"),Ut(this,"abort"),yi(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),yi(this,!0)),Et.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Rc(this):this.bb())},n.bb=function(){Rc(this)};function Rc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||Fe(o)!=4||o.Z()!=2)){if(o.u&&Fe(o)==4)Le(o.Ea,0,o);else if(Ut(o,"readystatechange"),Fe(o)==4){o.h=!1;try{const B=o.Z();t:switch(B){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break t;default:u=!1}var h;if(!(h=u)){var p;if(p=B===0){var P=String(o.D).match(vc)[1]||null;!P&&l.self&&l.self.location&&(P=l.self.location.protocol.slice(0,-1)),p=!Ap.test(P?P.toLowerCase():"")}h=p}if(h)Ut(o,"complete"),Ut(o,"success");else{o.m=6;try{var k=2<Fe(o)?o.g.statusText:""}catch{k=""}o.l=k+" ["+o.Z()+"]",xc(o)}}finally{yi(o)}}}}function yi(o,u){if(o.g){Pc(o);const h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||Ut(o,"ready");try{h.onreadystatechange=p}catch{}}}function Pc(o){o.I&&(l.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function Fe(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<Fe(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),pr(u)}};function Cc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Rp(o){const u={};o=(o.g&&2<=Fe(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(D(o[p]))continue;var h=I(o[p]);const P=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const k=u[P]||[];u[P]=k,k.push(h)}b(u,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ds(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function kc(o){this.Aa=0,this.i=[],this.j=new St,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ds("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ds("baseRetryDelayMs",5e3,o),this.cb=ds("retryDelaySeedMs",1e4,o),this.Wa=ds("forwardChannelMaxRetries",2,o),this.wa=ds("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new hc(o&&o.concurrentRequestLimit),this.Da=new Ip,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=kc.prototype,n.la=8,n.G=1,n.connect=function(o,u,h,p){yt(0),this.W=o,this.H=u||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=Uc(this,null,this.W),_i(this)};function Wo(o){if(Dc(o),o.G==3){var u=o.U++,h=Be(o.I);if(ft(h,"SID",o.K),ft(h,"RID",u),ft(h,"TYPE","terminate"),hs(o,h),u=new nn(o,o.j,u),u.L=2,u.v=pi(Be(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=u.v,h=!0),h||(u.g=zc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),di(u)}Fc(o)}function vi(o){o.g&&(Go(o),o.g.cancel(),o.g=null)}function Dc(o){vi(o),o.u&&(l.clearTimeout(o.u),o.u=null),wi(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function _i(o){if(!fc(o.h)&&!o.s){o.s=!0;var u=o.Ga;It||Nt(),ct||(It(),ct=!0),ht.add(u,o),o.B=0}}function Pp(o,u){return pc(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=gt(v(o.Ga,o,u),Bc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const P=new nn(this,this.j,o);let k=this.o;if(this.S&&(k?(k=g(k),_(k,this.S)):k=this.S),this.m!==null||this.O||(P.H=k,k=null),this.P)t:{for(var u=0,h=0;h<this.i.length;h++){e:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break e}p=void 0}if(p===void 0)break;if(u+=p,4096<u){u=h;break t}if(u===4096||h===this.i.length-1){u=h+1;break t}}u=1e3}else u=1e3;u=Nc(this,P,u),h=Be(this.I),ft(h,"RID",o),ft(h,"CVER",22),this.D&&ft(h,"X-HTTP-Session-Id",this.D),hs(this,h),k&&(this.O?u="headers="+encodeURIComponent(String(Sc(k)))+"&"+u:this.m&&Ho(h,this.m,k)),jo(this.h,P),this.Ua&&ft(h,"TYPE","init"),this.P?(ft(h,"$req",u),ft(h,"SID","null"),P.T=!0,Uo(P,h,null)):Uo(P,h,u),this.G=2}}else this.G==3&&(o?Mc(this,o):this.i.length==0||fc(this.h)||Mc(this))};function Mc(o,u){var h;u?h=u.l:h=o.U++;const p=Be(o.I);ft(p,"SID",o.K),ft(p,"RID",h),ft(p,"AID",o.T),hs(o,p),o.m&&o.o&&Ho(p,o.m,o.o),h=new nn(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Nc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),jo(o.h,h),Uo(h,p,u)}function hs(o,u){o.H&&O(o.H,function(h,p){ft(u,p,h)}),o.l&&yc({},function(h,p){ft(u,p,h)})}function Nc(o,u,h){h=Math.min(o.i.length,h);var p=o.l?v(o.l.Na,o.l,o):null;t:{var P=o.i;let k=-1;for(;;){const B=["count="+h];k==-1?0<h?(k=P[0].g,B.push("ofs="+k)):k=0:B.push("ofs="+k);let dt=!0;for(let zt=0;zt<h;zt++){let rt=P[zt].g;const Wt=P[zt].map;if(rt-=k,0>rt)k=Math.max(0,P[zt].g-100),dt=!1;else try{Sp(Wt,B,"req"+rt+"_")}catch{p&&p(Wt)}}if(dt){p=B.join("&");break t}}}return o=o.i.splice(0,h),u.D=o,p}function Lc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;It||Nt(),ct||(It(),ct=!0),ht.add(u,o),o.v=0}}function Yo(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=gt(v(o.Fa,o),Bc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Vc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=gt(v(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,yt(10),vi(this),Vc(this))};function Go(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function Vc(o){o.g=new nn(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=Be(o.qa);ft(u,"RID","rpc"),ft(u,"SID",o.K),ft(u,"AID",o.T),ft(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&ft(u,"TO",o.ja),ft(u,"TYPE","xmlhttp"),hs(o,u),o.m&&o.o&&Ho(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=pi(Be(u)),h.m=null,h.P=!0,cc(h,o)}n.Za=function(){this.C!=null&&(this.C=null,vi(this),Yo(this),yt(19))};function wi(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function Oc(o,u){var h=null;if(o.g==u){wi(o),Go(o),o.g=null;var p=2}else if(qo(o.h,u))h=u.D,mc(o.h,u),p=1;else return;if(o.G!=0){if(u.o)if(p==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var P=o.B;p=mt(),Ut(p,new bt(p,h)),_i(o)}else Lc(o);else if(P=u.s,P==3||P==0&&0<u.X||!(p==1&&Pp(o,u)||p==2&&Yo(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),P){case 1:Bn(o,5);break;case 4:Bn(o,10);break;case 3:Bn(o,6);break;default:Bn(o,2)}}}function Bc(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function Bn(o,u){if(o.j.info("Error code "+u),u==2){var h=v(o.fb,o),p=o.Xa;const P=!p;p=new On(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||hi(p,"https"),pi(p),P?bp(p.toString(),h):Tp(p.toString(),h)}else yt(2);o.G=0,o.l&&o.l.sa(u),Fc(o),Dc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),yt(2)):(this.j.info("Failed to ping google.com"),yt(1))};function Fc(o){if(o.G=0,o.ka=[],o.l){const u=gc(o.h);(u.length!=0||o.i.length!=0)&&(R(o.ka,u),R(o.ka,o.i),o.h.i.length=0,x(o.i),o.i.length=0),o.l.ra()}}function Uc(o,u,h){var p=h instanceof On?Be(h):new On(h);if(p.g!="")u&&(p.g=u+"."+p.g),fi(p,p.s);else{var P=l.location;p=P.protocol,u=u?u+"."+P.hostname:P.hostname,P=+P.port;var k=new On(null);p&&hi(k,p),u&&(k.g=u),P&&fi(k,P),h&&(k.l=h),p=k}return h=o.D,u=o.ya,h&&u&&ft(p,h,u),ft(p,"VER",o.la),hs(o,p),p}function zc(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new Et(new mi({eb:h})):new Et(o.pa),u.Ha(o.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function $c(){}n=$c.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Ei(){}Ei.prototype.g=function(o,u){return new se(o,u)};function se(o,u){Ft.call(this),this.g=new kc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!D(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!D(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new _r(this)}T(se,Ft),se.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},se.prototype.close=function(){Wo(this.g)},se.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=es(o),o=h);u.i.push(new hp(u.Ya++,o)),u.G==3&&_i(u)},se.prototype.N=function(){this.g.l=null,delete this.j,Wo(this.g),delete this.g,se.aa.N.call(this)};function qc(o){mr.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){t:{for(const h in u){o=h;break t}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}T(qc,mr);function jc(){gr.call(this),this.status=1}T(jc,gr);function _r(o){this.g=o}T(_r,$c),_r.prototype.ua=function(){Ut(this.g,"a")},_r.prototype.ta=function(o){Ut(this.g,new qc(o))},_r.prototype.sa=function(o){Ut(this.g,new jc)},_r.prototype.ra=function(){Ut(this.g,"b")},Ei.prototype.createWebChannel=Ei.prototype.g,se.prototype.send=se.prototype.o,se.prototype.open=se.prototype.m,se.prototype.close=se.prototype.close,Eh=function(){return new Ei},wh=function(){return mt()},_h=J,Sa={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ln.NO_ERROR=0,Ln.TIMEOUT=8,Ln.HTTP_ERROR=6,Mi=Ln,ci.COMPLETE="complete",vh=ci,rs.EventType=en,en.OPEN="a",en.CLOSE="b",en.ERROR="c",en.MESSAGE="d",Ft.prototype.listen=Ft.prototype.K,vs=rs,Et.prototype.listenOnce=Et.prototype.L,Et.prototype.getLastError=Et.prototype.Ka,Et.prototype.getLastErrorCode=Et.prototype.Ba,Et.prototype.getStatus=Et.prototype.Z,Et.prototype.getResponseJson=Et.prototype.Oa,Et.prototype.getResponseText=Et.prototype.oa,Et.prototype.send=Et.prototype.ea,Et.prototype.setWithCredentials=Et.prototype.Ha,yh=Et}).apply(typeof Si<"u"?Si:typeof self<"u"?self:typeof window<"u"?window:{});const Tu="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}Kt.UNAUTHENTICATED=new Kt(null),Kt.GOOGLE_CREDENTIALS=new Kt("google-credentials-uid"),Kt.FIRST_PARTY=new Kt("first-party-uid"),Kt.MOCK_USER=new Kt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wr="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qn=new Ga("@firebase/firestore");function ps(){return Qn.logLevel}function z(n,...t){if(Qn.logLevel<=et.DEBUG){const e=t.map(ll);Qn.debug(`Firestore (${Wr}): ${n}`,...e)}}function Ge(n,...t){if(Qn.logLevel<=et.ERROR){const e=t.map(ll);Qn.error(`Firestore (${Wr}): ${n}`,...e)}}function Vr(n,...t){if(Qn.logLevel<=et.WARN){const e=t.map(ll);Qn.warn(`Firestore (${Wr}): ${n}`,...e)}}function ll(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(e){return JSON.stringify(e)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(n="Unexpected state"){const t=`FIRESTORE (${Wr}) INTERNAL ASSERTION FAILED: `+n;throw Ge(t),new Error(t)}function lt(n,t){n||Y()}function K(n,t){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class U extends Je{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bh{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class jv{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(Kt.UNAUTHENTICATED))}shutdown(){}}class Hv{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class Wv{constructor(t){this.t=t,this.currentUser=Kt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){lt(this.o===void 0);let r=this.i;const s=c=>this.i!==r?(r=this.i,e(c)):Promise.resolve();let i=new He;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new He,t.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const c=i;t.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},l=c=>{z("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(z("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new He)}},0),a()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(r=>this.i!==t?(z("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(lt(typeof r.accessToken=="string"),new bh(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return lt(t===null||typeof t=="string"),new Kt(t)}}class Yv{constructor(t,e,r){this.l=t,this.h=e,this.P=r,this.type="FirstParty",this.user=Kt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const t=this.T();return t&&this.I.set("Authorization",t),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Gv{constructor(t,e,r){this.l=t,this.h=e,this.P=r}getToken(){return Promise.resolve(new Yv(this.l,this.h,this.P))}start(t,e){t.enqueueRetryable(()=>e(Kt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Kv{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Qv{constructor(t){this.A=t,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(t,e){lt(this.o===void 0);const r=i=>{i.error!=null&&z("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.R;return this.R=i.token,z("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?e(i.token):Promise.resolve()};this.o=i=>{t.enqueueRetryable(()=>r(i))};const s=i=>{z("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):z("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(e=>e?(lt(typeof e.token=="string"),this.R=e.token,new Kv(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jv(n){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(n);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let r=0;r<n;r++)e[r]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Th{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=Math.floor(256/t.length)*t.length;let r="";for(;r.length<20;){const s=Jv(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<e&&(r+=t.charAt(s[i]%t.length))}return r}}function st(n,t){return n<t?-1:n>t?1:0}function Or(n,t,e){return n.length===t.length&&n.every((r,s)=>e(r,t[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new U(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new U(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<-62135596800)throw new U(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new U(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}static now(){return Mt.fromMillis(Date.now())}static fromDate(t){return Mt.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),r=Math.floor(1e6*(t-1e3*e));return new Mt(e,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(t){return this.seconds===t.seconds?st(this.nanoseconds,t.nanoseconds):st(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const t=this.seconds- -62135596800;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(t){this.timestamp=t}static fromTimestamp(t){return new G(t)}static min(){return new G(new Mt(0,0))}static max(){return new G(new Mt(253402300799,999999999))}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(t,e,r){e===void 0?e=0:e>t.length&&Y(),r===void 0?r=t.length-e:r>t.length-e&&Y(),this.segments=t,this.offset=e,this.len=r}get length(){return this.len}isEqual(t){return Ms.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Ms?t.forEach(r=>{e.push(r)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,r=this.limit();e<r;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const r=Math.min(t.length,e.length);for(let s=0;s<r;s++){const i=t.get(s),a=e.get(s);if(i<a)return-1;if(i>a)return 1}return t.length<e.length?-1:t.length>e.length?1:0}}class pt extends Ms{construct(t,e,r){return new pt(t,e,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const r of t){if(r.indexOf("//")>=0)throw new U(M.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);e.push(...r.split("/").filter(s=>s.length>0))}return new pt(e)}static emptyPath(){return new pt([])}}const Xv=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class qt extends Ms{construct(t,e,r){return new qt(t,e,r)}static isValidIdentifier(t){return Xv.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),qt.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new qt(["__name__"])}static fromServerFormat(t){const e=[];let r="",s=0;const i=()=>{if(r.length===0)throw new U(M.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(r),r=""};let a=!1;for(;s<t.length;){const l=t[s];if(l==="\\"){if(s+1===t.length)throw new U(M.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const c=t[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new U(M.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=c,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(r+=l,s++):(i(),s++)}if(i(),a)throw new U(M.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new qt(e)}static emptyPath(){return new qt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(t){this.path=t}static fromPath(t){return new q(pt.fromString(t))}static fromName(t){return new q(pt.fromString(t).popFirst(5))}static empty(){return new q(pt.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&pt.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return pt.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new q(new pt(t.slice()))}}function Zv(n,t){const e=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=G.fromTimestamp(r===1e9?new Mt(e+1,0):new Mt(e,r));return new En(s,q.empty(),t)}function t0(n){return new En(n.readTime,n.key,-1)}class En{constructor(t,e,r){this.readTime=t,this.documentKey=e,this.largestBatchId=r}static min(){return new En(G.min(),q.empty(),-1)}static max(){return new En(G.max(),q.empty(),-1)}}function e0(n,t){let e=n.readTime.compareTo(t.readTime);return e!==0?e:(e=q.comparator(n.documentKey,t.documentKey),e!==0?e:st(n.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const n0="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class r0{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ys(n){if(n.code!==M.FAILED_PRECONDITION||n.message!==n0)throw n;z("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&Y(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new L((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(t,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(e,i).next(r,s)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof L?e:L.resolve(e)}catch(e){return L.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):L.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):L.reject(e)}static resolve(t){return new L((e,r)=>{e(t)})}static reject(t){return new L((e,r)=>{r(t)})}static waitFor(t){return new L((e,r)=>{let s=0,i=0,a=!1;t.forEach(l=>{++s,l.next(()=>{++i,a&&i===s&&e()},c=>r(c))}),a=!0,i===s&&e()})}static or(t){let e=L.resolve(!1);for(const r of t)e=e.next(s=>s?L.resolve(s):r());return e}static forEach(t,e){const r=[];return t.forEach((s,i)=>{r.push(e.call(this,s,i))}),this.waitFor(r)}static mapArray(t,e){return new L((r,s)=>{const i=t.length,a=new Array(i);let l=0;for(let c=0;c<i;c++){const d=c;e(t[d]).next(f=>{a[d]=f,++l,l===i&&r(a)},f=>s(f))}})}static doWhile(t,e){return new L((r,s)=>{const i=()=>{t()===!0?e().next(()=>{i()},s):r()};i()})}}function s0(n){const t=n.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function Gs(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cl{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=r=>this.ie(r),this.se=r=>e.writeSequenceNumber(r))}ie(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.se&&this.se(t),t}}cl.oe=-1;function ho(n){return n==null}function Ki(n){return n===0&&1/n==-1/0}function i0(n){return typeof n=="number"&&Number.isInteger(n)&&!Ki(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iu(n){let t=0;for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t++;return t}function tr(n,t){for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t(e,n[e])}function Ih(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(t,e){this.comparator=t,this.root=e||$t.EMPTY}insert(t,e){return new vt(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,$t.BLACK,null,null))}remove(t){return new vt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,$t.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const r=this.comparator(t,e.key);if(r===0)return e.value;r<0?e=e.left:r>0&&(e=e.right)}return null}indexOf(t){let e=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(t,r.key);if(s===0)return e+r.left.size;s<0?r=r.left:(e+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,r)=>(t(e,r),!1))}toString(){const t=[];return this.inorderTraversal((e,r)=>(t.push(`${e}:${r}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new Ai(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new Ai(this.root,t,this.comparator,!1)}getReverseIterator(){return new Ai(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new Ai(this.root,t,this.comparator,!0)}}class Ai{constructor(t,e,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!t.isEmpty();)if(i=e?r(t.key,e):1,e&&s&&(i*=-1),i<0)t=this.isReverse?t.left:t.right;else{if(i===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class $t{constructor(t,e,r,s,i){this.key=t,this.value=e,this.color=r??$t.RED,this.left=s??$t.EMPTY,this.right=i??$t.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,r,s,i){return new $t(t??this.key,e??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,r){let s=this;const i=r(t,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(t,e,r),null):i===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return $t.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let r,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return $t.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,$t.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,$t.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Y();const t=this.left.check();if(t!==this.right.check())throw Y();return t+(this.isRed()?0:1)}}$t.EMPTY=null,$t.RED=!0,$t.BLACK=!1;$t.EMPTY=new class{constructor(){this.size=0}get key(){throw Y()}get value(){throw Y()}get color(){throw Y()}get left(){throw Y()}get right(){throw Y()}copy(t,e,r,s,i){return this}insert(t,e,r){return new $t(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt{constructor(t){this.comparator=t,this.data=new vt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,r)=>(t(e),!1))}forEachInRange(t,e){const r=this.data.getIteratorFrom(t[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let r;for(r=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();r.hasNext();)if(!t(r.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new Su(this.data.getIterator())}getIteratorFrom(t){return new Su(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(r=>{e=e.add(r)}),e}isEqual(t){if(!(t instanceof jt)||this.size!==t.size)return!1;const e=this.data.getIterator(),r=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new jt(this.comparator);return e.data=t,e}}class Su{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(t){this.fields=t,t.sort(qt.comparator)}static empty(){return new oe([])}unionWith(t){let e=new jt(qt.comparator);for(const r of this.fields)e=e.add(r);for(const r of t)e=e.add(r);return new oe(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return Or(this.fields,t.fields,(e,r)=>e.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Sh("Invalid base64 string: "+i):i}}(t);return new Ht(e)}static fromUint8Array(t){const e=function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i}(t);return new Ht(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const r=new Uint8Array(e.length);for(let s=0;s<e.length;s++)r[s]=e.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return st(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Ht.EMPTY_BYTE_STRING=new Ht("");const o0=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function bn(n){if(lt(!!n),typeof n=="string"){let t=0;const e=o0.exec(n);if(lt(!!e),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:Tt(n.seconds),nanos:Tt(n.nanos)}}function Tt(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Jn(n){return typeof n=="string"?Ht.fromBase64String(n):Ht.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ul(n){var t,e;return((e=(((t=n==null?void 0:n.mapValue)===null||t===void 0?void 0:t.fields)||{}).__type__)===null||e===void 0?void 0:e.stringValue)==="server_timestamp"}function dl(n){const t=n.mapValue.fields.__previous_value__;return ul(t)?dl(t):t}function Ns(n){const t=bn(n.mapValue.fields.__local_write_time__.timestampValue);return new Mt(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a0{constructor(t,e,r,s,i,a,l,c,d){this.databaseId=t,this.appId=e,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class Ls{constructor(t,e){this.projectId=t,this.database=e||"(default)"}static empty(){return new Ls("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(t){return t instanceof Ls&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xi={mapValue:{}};function Xn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?ul(n)?4:c0(n)?9007199254740991:l0(n)?10:11:Y()}function ke(n,t){if(n===t)return!0;const e=Xn(n);if(e!==Xn(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===t.booleanValue;case 4:return Ns(n).isEqual(Ns(t));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const a=bn(s.timestampValue),l=bn(i.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(n,t);case 5:return n.stringValue===t.stringValue;case 6:return function(s,i){return Jn(s.bytesValue).isEqual(Jn(i.bytesValue))}(n,t);case 7:return n.referenceValue===t.referenceValue;case 8:return function(s,i){return Tt(s.geoPointValue.latitude)===Tt(i.geoPointValue.latitude)&&Tt(s.geoPointValue.longitude)===Tt(i.geoPointValue.longitude)}(n,t);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return Tt(s.integerValue)===Tt(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const a=Tt(s.doubleValue),l=Tt(i.doubleValue);return a===l?Ki(a)===Ki(l):isNaN(a)&&isNaN(l)}return!1}(n,t);case 9:return Or(n.arrayValue.values||[],t.arrayValue.values||[],ke);case 10:case 11:return function(s,i){const a=s.mapValue.fields||{},l=i.mapValue.fields||{};if(Iu(a)!==Iu(l))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(l[c]===void 0||!ke(a[c],l[c])))return!1;return!0}(n,t);default:return Y()}}function Vs(n,t){return(n.values||[]).find(e=>ke(e,t))!==void 0}function Br(n,t){if(n===t)return 0;const e=Xn(n),r=Xn(t);if(e!==r)return st(e,r);switch(e){case 0:case 9007199254740991:return 0;case 1:return st(n.booleanValue,t.booleanValue);case 2:return function(i,a){const l=Tt(i.integerValue||i.doubleValue),c=Tt(a.integerValue||a.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,t);case 3:return Au(n.timestampValue,t.timestampValue);case 4:return Au(Ns(n),Ns(t));case 5:return st(n.stringValue,t.stringValue);case 6:return function(i,a){const l=Jn(i),c=Jn(a);return l.compareTo(c)}(n.bytesValue,t.bytesValue);case 7:return function(i,a){const l=i.split("/"),c=a.split("/");for(let d=0;d<l.length&&d<c.length;d++){const f=st(l[d],c[d]);if(f!==0)return f}return st(l.length,c.length)}(n.referenceValue,t.referenceValue);case 8:return function(i,a){const l=st(Tt(i.latitude),Tt(a.latitude));return l!==0?l:st(Tt(i.longitude),Tt(a.longitude))}(n.geoPointValue,t.geoPointValue);case 9:return xu(n.arrayValue,t.arrayValue);case 10:return function(i,a){var l,c,d,f;const m=i.fields||{},v=a.fields||{},E=(l=m.value)===null||l===void 0?void 0:l.arrayValue,T=(c=v.value)===null||c===void 0?void 0:c.arrayValue,x=st(((d=E==null?void 0:E.values)===null||d===void 0?void 0:d.length)||0,((f=T==null?void 0:T.values)===null||f===void 0?void 0:f.length)||0);return x!==0?x:xu(E,T)}(n.mapValue,t.mapValue);case 11:return function(i,a){if(i===xi.mapValue&&a===xi.mapValue)return 0;if(i===xi.mapValue)return 1;if(a===xi.mapValue)return-1;const l=i.fields||{},c=Object.keys(l),d=a.fields||{},f=Object.keys(d);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const v=st(c[m],f[m]);if(v!==0)return v;const E=Br(l[c[m]],d[f[m]]);if(E!==0)return E}return st(c.length,f.length)}(n.mapValue,t.mapValue);default:throw Y()}}function Au(n,t){if(typeof n=="string"&&typeof t=="string"&&n.length===t.length)return st(n,t);const e=bn(n),r=bn(t),s=st(e.seconds,r.seconds);return s!==0?s:st(e.nanos,r.nanos)}function xu(n,t){const e=n.values||[],r=t.values||[];for(let s=0;s<e.length&&s<r.length;++s){const i=Br(e[s],r[s]);if(i)return i}return st(e.length,r.length)}function Fr(n){return Aa(n)}function Aa(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(e){const r=bn(e);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(e){return Jn(e).toBase64()}(n.bytesValue):"referenceValue"in n?function(e){return q.fromName(e).toString()}(n.referenceValue):"geoPointValue"in n?function(e){return`geo(${e.latitude},${e.longitude})`}(n.geoPointValue):"arrayValue"in n?function(e){let r="[",s=!0;for(const i of e.values||[])s?s=!1:r+=",",r+=Aa(i);return r+"]"}(n.arrayValue):"mapValue"in n?function(e){const r=Object.keys(e.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${Aa(e.fields[a])}`;return s+"}"}(n.mapValue):Y()}function Ru(n,t){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${t.path.canonicalString()}`}}function xa(n){return!!n&&"integerValue"in n}function hl(n){return!!n&&"arrayValue"in n}function Pu(n){return!!n&&"nullValue"in n}function Cu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Ni(n){return!!n&&"mapValue"in n}function l0(n){var t,e;return((e=(((t=n==null?void 0:n.mapValue)===null||t===void 0?void 0:t.fields)||{}).__type__)===null||e===void 0?void 0:e.stringValue)==="__vector__"}function Ts(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const t={mapValue:{fields:{}}};return tr(n.mapValue.fields,(e,r)=>t.mapValue.fields[e]=Ts(r)),t}if(n.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(n.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=Ts(n.arrayValue.values[e]);return t}return Object.assign({},n)}function c0(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(t){this.value=t}static empty(){return new ee({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let r=0;r<t.length-1;++r)if(e=(e.mapValue.fields||{})[t.get(r)],!Ni(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=Ts(e)}setAll(t){let e=qt.emptyPath(),r={},s=[];t.forEach((a,l)=>{if(!e.isImmediateParentOf(l)){const c=this.getFieldsMap(e);this.applyChanges(c,r,s),r={},s=[],e=l.popLast()}a?r[l.lastSegment()]=Ts(a):s.push(l.lastSegment())});const i=this.getFieldsMap(e);this.applyChanges(i,r,s)}delete(t){const e=this.field(t.popLast());Ni(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return ke(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let r=0;r<t.length;++r){let s=e.mapValue.fields[t.get(r)];Ni(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(r)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,r){tr(e,(s,i)=>t[s]=i);for(const s of r)delete t[s]}clone(){return new ee(Ts(this.value))}}function Ah(n){const t=[];return tr(n.fields,(e,r)=>{const s=new qt([e]);if(Ni(r)){const i=Ah(r.mapValue).fields;if(i.length===0)t.push(s);else for(const a of i)t.push(s.child(a))}else t.push(s)}),new oe(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt{constructor(t,e,r,s,i,a,l){this.key=t,this.documentType=e,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=l}static newInvalidDocument(t){return new Qt(t,0,G.min(),G.min(),G.min(),ee.empty(),0)}static newFoundDocument(t,e,r,s){return new Qt(t,1,e,G.min(),r,s,0)}static newNoDocument(t,e){return new Qt(t,2,e,G.min(),G.min(),ee.empty(),0)}static newUnknownDocument(t,e){return new Qt(t,3,e,G.min(),G.min(),ee.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(G.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=ee.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=ee.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof Qt&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new Qt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{constructor(t,e){this.position=t,this.inclusive=e}}function ku(n,t,e){let r=0;for(let s=0;s<n.position.length;s++){const i=t[s],a=n.position[s];if(i.field.isKeyField()?r=q.comparator(q.fromName(a.referenceValue),e.key):r=Br(a,e.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function Du(n,t){if(n===null)return t===null;if(t===null||n.inclusive!==t.inclusive||n.position.length!==t.position.length)return!1;for(let e=0;e<n.position.length;e++)if(!ke(n.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(t,e="asc"){this.field=t,this.dir=e}}function u0(n,t){return n.dir===t.dir&&n.field.isEqual(t.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xh{}class Rt extends xh{constructor(t,e,r){super(),this.field=t,this.op=e,this.value=r}static create(t,e,r){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,r):new h0(t,e,r):e==="array-contains"?new m0(t,r):e==="in"?new g0(t,r):e==="not-in"?new y0(t,r):e==="array-contains-any"?new v0(t,r):new Rt(t,e,r)}static createKeyFieldInFilter(t,e,r){return e==="in"?new f0(t,r):new p0(t,r)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&this.matchesComparison(Br(e,this.value)):e!==null&&Xn(this.value)===Xn(e)&&this.matchesComparison(Br(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return Y()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ee extends xh{constructor(t,e){super(),this.filters=t,this.op=e,this.ae=null}static create(t,e){return new Ee(t,e)}matches(t){return Rh(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Rh(n){return n.op==="and"}function Ph(n){return d0(n)&&Rh(n)}function d0(n){for(const t of n.filters)if(t instanceof Ee)return!1;return!0}function Ra(n){if(n instanceof Rt)return n.field.canonicalString()+n.op.toString()+Fr(n.value);if(Ph(n))return n.filters.map(t=>Ra(t)).join(",");{const t=n.filters.map(e=>Ra(e)).join(",");return`${n.op}(${t})`}}function Ch(n,t){return n instanceof Rt?function(r,s){return s instanceof Rt&&r.op===s.op&&r.field.isEqual(s.field)&&ke(r.value,s.value)}(n,t):n instanceof Ee?function(r,s){return s instanceof Ee&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((i,a,l)=>i&&Ch(a,s.filters[l]),!0):!1}(n,t):void Y()}function kh(n){return n instanceof Rt?function(e){return`${e.field.canonicalString()} ${e.op} ${Fr(e.value)}`}(n):n instanceof Ee?function(e){return e.op.toString()+" {"+e.getFilters().map(kh).join(" ,")+"}"}(n):"Filter"}class h0 extends Rt{constructor(t,e,r){super(t,e,r),this.key=q.fromName(r.referenceValue)}matches(t){const e=q.comparator(t.key,this.key);return this.matchesComparison(e)}}class f0 extends Rt{constructor(t,e){super(t,"in",e),this.keys=Dh("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class p0 extends Rt{constructor(t,e){super(t,"not-in",e),this.keys=Dh("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function Dh(n,t){var e;return(((e=t.arrayValue)===null||e===void 0?void 0:e.values)||[]).map(r=>q.fromName(r.referenceValue))}class m0 extends Rt{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return hl(e)&&Vs(e.arrayValue,this.value)}}class g0 extends Rt{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Vs(this.value.arrayValue,e)}}class y0 extends Rt{constructor(t,e){super(t,"not-in",e)}matches(t){if(Vs(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&!Vs(this.value.arrayValue,e)}}class v0 extends Rt{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!hl(e)||!e.arrayValue.values)&&e.arrayValue.values.some(r=>Vs(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _0{constructor(t,e=null,r=[],s=[],i=null,a=null,l=null){this.path=t,this.collectionGroup=e,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=l,this.ue=null}}function Mu(n,t=null,e=[],r=[],s=null,i=null,a=null){return new _0(n,t,e,r,s,i,a)}function fl(n){const t=K(n);if(t.ue===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(r=>Ra(r)).join(","),e+="|ob:",e+=t.orderBy.map(r=>function(i){return i.field.canonicalString()+i.dir}(r)).join(","),ho(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(r=>Fr(r)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(r=>Fr(r)).join(",")),t.ue=e}return t.ue}function pl(n,t){if(n.limit!==t.limit||n.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<n.orderBy.length;e++)if(!u0(n.orderBy[e],t.orderBy[e]))return!1;if(n.filters.length!==t.filters.length)return!1;for(let e=0;e<n.filters.length;e++)if(!Ch(n.filters[e],t.filters[e]))return!1;return n.collectionGroup===t.collectionGroup&&!!n.path.isEqual(t.path)&&!!Du(n.startAt,t.startAt)&&Du(n.endAt,t.endAt)}function Pa(n){return q.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr{constructor(t,e=null,r=[],s=[],i=null,a="F",l=null,c=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function w0(n,t,e,r,s,i,a,l){return new Yr(n,t,e,r,s,i,a,l)}function ml(n){return new Yr(n)}function Nu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Mh(n){return n.collectionGroup!==null}function Is(n){const t=K(n);if(t.ce===null){t.ce=[];const e=new Set;for(const i of t.explicitOrderBy)t.ce.push(i),e.add(i.field.canonicalString());const r=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new jt(qt.comparator);return a.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(t).forEach(i=>{e.has(i.canonicalString())||i.isKeyField()||t.ce.push(new Os(i,r))}),e.has(qt.keyField().canonicalString())||t.ce.push(new Os(qt.keyField(),r))}return t.ce}function Re(n){const t=K(n);return t.le||(t.le=E0(t,Is(n))),t.le}function E0(n,t){if(n.limitType==="F")return Mu(n.path,n.collectionGroup,t,n.filters,n.limit,n.startAt,n.endAt);{t=t.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new Os(s.field,i)});const e=n.endAt?new Qi(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Qi(n.startAt.position,n.startAt.inclusive):null;return Mu(n.path,n.collectionGroup,t,n.filters,n.limit,e,r)}}function Ca(n,t){const e=n.filters.concat([t]);return new Yr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),e,n.limit,n.limitType,n.startAt,n.endAt)}function Ji(n,t,e){return new Yr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),t,e,n.startAt,n.endAt)}function fo(n,t){return pl(Re(n),Re(t))&&n.limitType===t.limitType}function Nh(n){return`${fl(Re(n))}|lt:${n.limitType}`}function br(n){return`Query(target=${function(e){let r=e.path.canonicalString();return e.collectionGroup!==null&&(r+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(r+=`, filters: [${e.filters.map(s=>kh(s)).join(", ")}]`),ho(e.limit)||(r+=", limit: "+e.limit),e.orderBy.length>0&&(r+=`, orderBy: [${e.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),e.startAt&&(r+=", startAt: ",r+=e.startAt.inclusive?"b:":"a:",r+=e.startAt.position.map(s=>Fr(s)).join(",")),e.endAt&&(r+=", endAt: ",r+=e.endAt.inclusive?"a:":"b:",r+=e.endAt.position.map(s=>Fr(s)).join(",")),`Target(${r})`}(Re(n))}; limitType=${n.limitType})`}function po(n,t){return t.isFoundDocument()&&function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):q.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)}(n,t)&&function(r,s){for(const i of Is(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(n,t)&&function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0}(n,t)&&function(r,s){return!(r.startAt&&!function(a,l,c){const d=ku(a,l,c);return a.inclusive?d<=0:d<0}(r.startAt,Is(r),s)||r.endAt&&!function(a,l,c){const d=ku(a,l,c);return a.inclusive?d>=0:d>0}(r.endAt,Is(r),s))}(n,t)}function b0(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Lh(n){return(t,e)=>{let r=!1;for(const s of Is(n)){const i=T0(s,t,e);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function T0(n,t,e){const r=n.field.isKeyField()?q.comparator(t.key,e.key):function(i,a,l){const c=a.data.field(i),d=l.data.field(i);return c!==null&&d!==null?Br(c,d):Y()}(n.field,t,e);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return Y()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gr{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,t))return i}}has(t){return this.get(t)!==void 0}set(t,e){const r=this.mapKeyFn(t),s=this.inner[r];if(s===void 0)return this.inner[r]=[[t,e]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],t))return void(s[i]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],t))return r.length===1?delete this.inner[e]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(t){tr(this.inner,(e,r)=>{for(const[s,i]of r)t(s,i)})}isEmpty(){return Ih(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I0=new vt(q.comparator);function Ke(){return I0}const Vh=new vt(q.comparator);function _s(...n){let t=Vh;for(const e of n)t=t.insert(e.key,e);return t}function Oh(n){let t=Vh;return n.forEach((e,r)=>t=t.insert(e,r.overlayedDocument)),t}function $n(){return Ss()}function Bh(){return Ss()}function Ss(){return new Gr(n=>n.toString(),(n,t)=>n.isEqual(t))}const S0=new vt(q.comparator),A0=new jt(q.comparator);function tt(...n){let t=A0;for(const e of n)t=t.add(e);return t}const x0=new jt(st);function R0(){return x0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gl(n,t){if(n.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ki(t)?"-0":t}}function Fh(n){return{integerValue:""+n}}function P0(n,t){return i0(t)?Fh(t):gl(n,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mo{constructor(){this._=void 0}}function C0(n,t,e){return n instanceof Xi?function(s,i){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&ul(i)&&(i=dl(i)),i&&(a.fields.__previous_value__=i),{mapValue:a}}(e,t):n instanceof Bs?zh(n,t):n instanceof Fs?$h(n,t):function(s,i){const a=Uh(s,i),l=Lu(a)+Lu(s.Pe);return xa(a)&&xa(s.Pe)?Fh(l):gl(s.serializer,l)}(n,t)}function k0(n,t,e){return n instanceof Bs?zh(n,t):n instanceof Fs?$h(n,t):e}function Uh(n,t){return n instanceof Zi?function(r){return xa(r)||function(i){return!!i&&"doubleValue"in i}(r)}(t)?t:{integerValue:0}:null}class Xi extends mo{}class Bs extends mo{constructor(t){super(),this.elements=t}}function zh(n,t){const e=qh(t);for(const r of n.elements)e.some(s=>ke(s,r))||e.push(r);return{arrayValue:{values:e}}}class Fs extends mo{constructor(t){super(),this.elements=t}}function $h(n,t){let e=qh(t);for(const r of n.elements)e=e.filter(s=>!ke(s,r));return{arrayValue:{values:e}}}class Zi extends mo{constructor(t,e){super(),this.serializer=t,this.Pe=e}}function Lu(n){return Tt(n.integerValue||n.doubleValue)}function qh(n){return hl(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function D0(n,t){return n.field.isEqual(t.field)&&function(r,s){return r instanceof Bs&&s instanceof Bs||r instanceof Fs&&s instanceof Fs?Or(r.elements,s.elements,ke):r instanceof Zi&&s instanceof Zi?ke(r.Pe,s.Pe):r instanceof Xi&&s instanceof Xi}(n.transform,t.transform)}class M0{constructor(t,e){this.version=t,this.transformResults=e}}class ae{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new ae}static exists(t){return new ae(void 0,t)}static updateTime(t){return new ae(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function Li(n,t){return n.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(n.updateTime):n.exists===void 0||n.exists===t.isFoundDocument()}class go{}function jh(n,t){if(!n.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return n.isNoDocument()?new yl(n.key,ae.none()):new Ks(n.key,n.data,ae.none());{const e=n.data,r=ee.empty();let s=new jt(qt.comparator);for(let i of t.fields)if(!s.has(i)){let a=e.field(i);a===null&&i.length>1&&(i=i.popLast(),a=e.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new An(n.key,r,new oe(s.toArray()),ae.none())}}function N0(n,t,e){n instanceof Ks?function(s,i,a){const l=s.value.clone(),c=Ou(s.fieldTransforms,i,a.transformResults);l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,t,e):n instanceof An?function(s,i,a){if(!Li(s.precondition,i))return void i.convertToUnknownDocument(a.version);const l=Ou(s.fieldTransforms,i,a.transformResults),c=i.data;c.setAll(Hh(s)),c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,t,e):function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()}(0,t,e)}function As(n,t,e,r){return n instanceof Ks?function(i,a,l,c){if(!Li(i.precondition,a))return l;const d=i.value.clone(),f=Bu(i.fieldTransforms,c,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,t,e,r):n instanceof An?function(i,a,l,c){if(!Li(i.precondition,a))return l;const d=Bu(i.fieldTransforms,c,a),f=a.data;return f.setAll(Hh(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(n,t,e,r):function(i,a,l){return Li(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(n,t,e)}function L0(n,t){let e=null;for(const r of n.fieldTransforms){const s=t.data.field(r.field),i=Uh(r.transform,s||null);i!=null&&(e===null&&(e=ee.empty()),e.set(r.field,i))}return e||null}function Vu(n,t){return n.type===t.type&&!!n.key.isEqual(t.key)&&!!n.precondition.isEqual(t.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Or(r,s,(i,a)=>D0(i,a))}(n.fieldTransforms,t.fieldTransforms)&&(n.type===0?n.value.isEqual(t.value):n.type!==1||n.data.isEqual(t.data)&&n.fieldMask.isEqual(t.fieldMask))}class Ks extends go{constructor(t,e,r,s=[]){super(),this.key=t,this.value=e,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class An extends go{constructor(t,e,r,s,i=[]){super(),this.key=t,this.data=e,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Hh(n){const t=new Map;return n.fieldMask.fields.forEach(e=>{if(!e.isEmpty()){const r=n.data.field(e);t.set(e,r)}}),t}function Ou(n,t,e){const r=new Map;lt(n.length===e.length);for(let s=0;s<e.length;s++){const i=n[s],a=i.transform,l=t.data.field(i.field);r.set(i.field,k0(a,l,e[s]))}return r}function Bu(n,t,e){const r=new Map;for(const s of n){const i=s.transform,a=e.data.field(s.field);r.set(s.field,C0(i,a,t))}return r}class yl extends go{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class V0 extends go{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O0{constructor(t,e,r,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(t,e){const r=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(t.key)&&N0(i,t,r[s])}}applyToLocalView(t,e){for(const r of this.baseMutations)r.key.isEqual(t.key)&&(e=As(r,t,e,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(t.key)&&(e=As(r,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const r=Bh();return this.mutations.forEach(s=>{const i=t.get(s.key),a=i.overlayedDocument;let l=this.applyToLocalView(a,i.mutatedFields);l=e.has(s.key)?null:l;const c=jh(a,l);c!==null&&r.set(s.key,c),a.isValidDocument()||a.convertToNoDocument(G.min())}),r}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),tt())}isEqual(t){return this.batchId===t.batchId&&Or(this.mutations,t.mutations,(e,r)=>Vu(e,r))&&Or(this.baseMutations,t.baseMutations,(e,r)=>Vu(e,r))}}class vl{constructor(t,e,r,s){this.batch=t,this.commitVersion=e,this.mutationResults=r,this.docVersions=s}static from(t,e,r){lt(t.mutations.length===r.length);let s=function(){return S0}();const i=t.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new vl(t,e,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B0{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F0{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xt,nt;function U0(n){switch(n){default:return Y();case M.CANCELLED:case M.UNKNOWN:case M.DEADLINE_EXCEEDED:case M.RESOURCE_EXHAUSTED:case M.INTERNAL:case M.UNAVAILABLE:case M.UNAUTHENTICATED:return!1;case M.INVALID_ARGUMENT:case M.NOT_FOUND:case M.ALREADY_EXISTS:case M.PERMISSION_DENIED:case M.FAILED_PRECONDITION:case M.ABORTED:case M.OUT_OF_RANGE:case M.UNIMPLEMENTED:case M.DATA_LOSS:return!0}}function Wh(n){if(n===void 0)return Ge("GRPC error has no .code"),M.UNKNOWN;switch(n){case xt.OK:return M.OK;case xt.CANCELLED:return M.CANCELLED;case xt.UNKNOWN:return M.UNKNOWN;case xt.DEADLINE_EXCEEDED:return M.DEADLINE_EXCEEDED;case xt.RESOURCE_EXHAUSTED:return M.RESOURCE_EXHAUSTED;case xt.INTERNAL:return M.INTERNAL;case xt.UNAVAILABLE:return M.UNAVAILABLE;case xt.UNAUTHENTICATED:return M.UNAUTHENTICATED;case xt.INVALID_ARGUMENT:return M.INVALID_ARGUMENT;case xt.NOT_FOUND:return M.NOT_FOUND;case xt.ALREADY_EXISTS:return M.ALREADY_EXISTS;case xt.PERMISSION_DENIED:return M.PERMISSION_DENIED;case xt.FAILED_PRECONDITION:return M.FAILED_PRECONDITION;case xt.ABORTED:return M.ABORTED;case xt.OUT_OF_RANGE:return M.OUT_OF_RANGE;case xt.UNIMPLEMENTED:return M.UNIMPLEMENTED;case xt.DATA_LOSS:return M.DATA_LOSS;default:return Y()}}(nt=xt||(xt={}))[nt.OK=0]="OK",nt[nt.CANCELLED=1]="CANCELLED",nt[nt.UNKNOWN=2]="UNKNOWN",nt[nt.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",nt[nt.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",nt[nt.NOT_FOUND=5]="NOT_FOUND",nt[nt.ALREADY_EXISTS=6]="ALREADY_EXISTS",nt[nt.PERMISSION_DENIED=7]="PERMISSION_DENIED",nt[nt.UNAUTHENTICATED=16]="UNAUTHENTICATED",nt[nt.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",nt[nt.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",nt[nt.ABORTED=10]="ABORTED",nt[nt.OUT_OF_RANGE=11]="OUT_OF_RANGE",nt[nt.UNIMPLEMENTED=12]="UNIMPLEMENTED",nt[nt.INTERNAL=13]="INTERNAL",nt[nt.UNAVAILABLE=14]="UNAVAILABLE",nt[nt.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z0(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $0=new qn([4294967295,4294967295],0);function Fu(n){const t=z0().encode(n),e=new gh;return e.update(t),new Uint8Array(e.digest())}function Uu(n){const t=new DataView(n.buffer),e=t.getUint32(0,!0),r=t.getUint32(4,!0),s=t.getUint32(8,!0),i=t.getUint32(12,!0);return[new qn([e,r],0),new qn([s,i],0)]}class _l{constructor(t,e,r){if(this.bitmap=t,this.padding=e,this.hashCount=r,e<0||e>=8)throw new ws(`Invalid padding: ${e}`);if(r<0)throw new ws(`Invalid hash count: ${r}`);if(t.length>0&&this.hashCount===0)throw new ws(`Invalid hash count: ${r}`);if(t.length===0&&e!==0)throw new ws(`Invalid padding when bitmap length is 0: ${e}`);this.Ie=8*t.length-e,this.Te=qn.fromNumber(this.Ie)}Ee(t,e,r){let s=t.add(e.multiply(qn.fromNumber(r)));return s.compare($0)===1&&(s=new qn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(t){return(this.bitmap[Math.floor(t/8)]&1<<t%8)!=0}mightContain(t){if(this.Ie===0)return!1;const e=Fu(t),[r,s]=Uu(e);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);if(!this.de(a))return!1}return!0}static create(t,e,r){const s=t%8==0?0:8-t%8,i=new Uint8Array(Math.ceil(t/8)),a=new _l(i,s,e);return r.forEach(l=>a.insert(l)),a}insert(t){if(this.Ie===0)return;const e=Fu(t),[r,s]=Uu(e);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);this.Ae(a)}}Ae(t){const e=Math.floor(t/8),r=t%8;this.bitmap[e]|=1<<r}}class ws extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yo{constructor(t,e,r,s,i){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(t,e,r){const s=new Map;return s.set(t,Qs.createSynthesizedTargetChangeForCurrentChange(t,e,r)),new yo(G.min(),s,new vt(st),Ke(),tt())}}class Qs{constructor(t,e,r,s,i){this.resumeToken=t,this.current=e,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(t,e,r){return new Qs(r,e,tt(),tt(),tt())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vi{constructor(t,e,r,s){this.Re=t,this.removedTargetIds=e,this.key=r,this.Ve=s}}class Yh{constructor(t,e){this.targetId=t,this.me=e}}class Gh{constructor(t,e,r=Ht.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=r,this.cause=s}}class zu{constructor(){this.fe=0,this.ge=qu(),this.pe=Ht.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(t){t.approximateByteSize()>0&&(this.we=!0,this.pe=t)}ve(){let t=tt(),e=tt(),r=tt();return this.ge.forEach((s,i)=>{switch(i){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:r=r.add(s);break;default:Y()}}),new Qs(this.pe,this.ye,t,e,r)}Ce(){this.we=!1,this.ge=qu()}Fe(t,e){this.we=!0,this.ge=this.ge.insert(t,e)}Me(t){this.we=!0,this.ge=this.ge.remove(t)}xe(){this.fe+=1}Oe(){this.fe-=1,lt(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class q0{constructor(t){this.Le=t,this.Be=new Map,this.ke=Ke(),this.qe=$u(),this.Qe=new vt(st)}Ke(t){for(const e of t.Re)t.Ve&&t.Ve.isFoundDocument()?this.$e(e,t.Ve):this.Ue(e,t.key,t.Ve);for(const e of t.removedTargetIds)this.Ue(e,t.key,t.Ve)}We(t){this.forEachTarget(t,e=>{const r=this.Ge(e);switch(t.state){case 0:this.ze(e)&&r.De(t.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(t.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(e);break;case 3:this.ze(e)&&(r.Ne(),r.De(t.resumeToken));break;case 4:this.ze(e)&&(this.je(e),r.De(t.resumeToken));break;default:Y()}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.Be.forEach((r,s)=>{this.ze(s)&&e(s)})}He(t){const e=t.targetId,r=t.me.count,s=this.Je(e);if(s){const i=s.target;if(Pa(i))if(r===0){const a=new q(i.path);this.Ue(e,a,Qt.newNoDocument(a,G.min()))}else lt(r===1);else{const a=this.Ye(e);if(a!==r){const l=this.Ze(t),c=l?this.Xe(l,t,a):1;if(c!==0){this.je(e);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(e,d)}}}}}Ze(t){const e=t.me.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=e;let a,l;try{a=Jn(r).toUint8Array()}catch(c){if(c instanceof Sh)return Vr("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new _l(a,s,i)}catch(c){return Vr(c instanceof ws?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(t,e,r){return e.me.count===r-this.nt(t,e.targetId)?0:2}nt(t,e){const r=this.Le.getRemoteKeysForTarget(e);let s=0;return r.forEach(i=>{const a=this.Le.tt(),l=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;t.mightContain(l)||(this.Ue(e,i,null),s++)}),s}rt(t){const e=new Map;this.Be.forEach((i,a)=>{const l=this.Je(a);if(l){if(i.current&&Pa(l.target)){const c=new q(l.target.path);this.ke.get(c)!==null||this.it(a,c)||this.Ue(a,c,Qt.newNoDocument(c,t))}i.be&&(e.set(a,i.ve()),i.Ce())}});let r=tt();this.qe.forEach((i,a)=>{let l=!0;a.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(i))}),this.ke.forEach((i,a)=>a.setReadTime(t));const s=new yo(t,e,this.Qe,this.ke,r);return this.ke=Ke(),this.qe=$u(),this.Qe=new vt(st),s}$e(t,e){if(!this.ze(t))return;const r=this.it(t,e.key)?2:0;this.Ge(t).Fe(e.key,r),this.ke=this.ke.insert(e.key,e),this.qe=this.qe.insert(e.key,this.st(e.key).add(t))}Ue(t,e,r){if(!this.ze(t))return;const s=this.Ge(t);this.it(t,e)?s.Fe(e,1):s.Me(e),this.qe=this.qe.insert(e,this.st(e).delete(t)),r&&(this.ke=this.ke.insert(e,r))}removeTarget(t){this.Be.delete(t)}Ye(t){const e=this.Ge(t).ve();return this.Le.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}xe(t){this.Ge(t).xe()}Ge(t){let e=this.Be.get(t);return e||(e=new zu,this.Be.set(t,e)),e}st(t){let e=this.qe.get(t);return e||(e=new jt(st),this.qe=this.qe.insert(t,e)),e}ze(t){const e=this.Je(t)!==null;return e||z("WatchChangeAggregator","Detected inactive target",t),e}Je(t){const e=this.Be.get(t);return e&&e.Se?null:this.Le.ot(t)}je(t){this.Be.set(t,new zu),this.Le.getRemoteKeysForTarget(t).forEach(e=>{this.Ue(t,e,null)})}it(t,e){return this.Le.getRemoteKeysForTarget(t).has(e)}}function $u(){return new vt(q.comparator)}function qu(){return new vt(q.comparator)}const j0={asc:"ASCENDING",desc:"DESCENDING"},H0={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},W0={and:"AND",or:"OR"};class Y0{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function ka(n,t){return n.useProto3Json||ho(t)?t:{value:t}}function to(n,t){return n.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Kh(n,t){return n.useProto3Json?t.toBase64():t.toUint8Array()}function G0(n,t){return to(n,t.toTimestamp())}function Pe(n){return lt(!!n),G.fromTimestamp(function(e){const r=bn(e);return new Mt(r.seconds,r.nanos)}(n))}function wl(n,t){return Da(n,t).canonicalString()}function Da(n,t){const e=function(s){return new pt(["projects",s.projectId,"databases",s.database])}(n).child("documents");return t===void 0?e:e.child(t)}function Qh(n){const t=pt.fromString(n);return lt(ef(t)),t}function Ma(n,t){return wl(n.databaseId,t.path)}function sa(n,t){const e=Qh(t);if(e.get(1)!==n.databaseId.projectId)throw new U(M.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+n.databaseId.projectId);if(e.get(3)!==n.databaseId.database)throw new U(M.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+n.databaseId.database);return new q(Xh(e))}function Jh(n,t){return wl(n.databaseId,t)}function K0(n){const t=Qh(n);return t.length===4?pt.emptyPath():Xh(t)}function Na(n){return new pt(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Xh(n){return lt(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function ju(n,t,e){return{name:Ma(n,t),fields:e.value.mapValue.fields}}function Q0(n,t){let e;if("targetChange"in t){t.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:Y()}(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],i=function(d,f){return d.useProto3Json?(lt(f===void 0||typeof f=="string"),Ht.fromBase64String(f||"")):(lt(f===void 0||f instanceof Buffer||f instanceof Uint8Array),Ht.fromUint8Array(f||new Uint8Array))}(n,t.targetChange.resumeToken),a=t.targetChange.cause,l=a&&function(d){const f=d.code===void 0?M.UNKNOWN:Wh(d.code);return new U(f,d.message||"")}(a);e=new Gh(r,s,i,l||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const s=sa(n,r.document.name),i=Pe(r.document.updateTime),a=r.document.createTime?Pe(r.document.createTime):G.min(),l=new ee({mapValue:{fields:r.document.fields}}),c=Qt.newFoundDocument(s,i,a,l),d=r.targetIds||[],f=r.removedTargetIds||[];e=new Vi(d,f,c.key,c)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const s=sa(n,r.document),i=r.readTime?Pe(r.readTime):G.min(),a=Qt.newNoDocument(s,i),l=r.removedTargetIds||[];e=new Vi([],l,a.key,a)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const s=sa(n,r.document),i=r.removedTargetIds||[];e=new Vi([],i,s,null)}else{if(!("filter"in t))return Y();{t.filter;const r=t.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new F0(s,i),l=r.targetId;e=new Yh(l,a)}}return e}function J0(n,t){let e;if(t instanceof Ks)e={update:ju(n,t.key,t.value)};else if(t instanceof yl)e={delete:Ma(n,t.key)};else if(t instanceof An)e={update:ju(n,t.key,t.data),updateMask:o_(t.fieldMask)};else{if(!(t instanceof V0))return Y();e={verify:Ma(n,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(r=>function(i,a){const l=a.transform;if(l instanceof Xi)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Bs)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Fs)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Zi)return{fieldPath:a.field.canonicalString(),increment:l.Pe};throw Y()}(0,r))),t.precondition.isNone||(e.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:G0(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Y()}(n,t.precondition)),e}function X0(n,t){return n&&n.length>0?(lt(t!==void 0),n.map(e=>function(s,i){let a=s.updateTime?Pe(s.updateTime):Pe(i);return a.isEqual(G.min())&&(a=Pe(i)),new M0(a,s.transformResults||[])}(e,t))):[]}function Z0(n,t){return{documents:[Jh(n,t.path)]}}function t_(n,t){const e={structuredQuery:{}},r=t.path;let s;t.collectionGroup!==null?(s=r,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=r.popLast(),e.structuredQuery.from=[{collectionId:r.lastSegment()}]),e.parent=Jh(n,s);const i=function(d){if(d.length!==0)return tf(Ee.create(d,"and"))}(t.filters);i&&(e.structuredQuery.where=i);const a=function(d){if(d.length!==0)return d.map(f=>function(v){return{field:Tr(v.field),direction:r_(v.dir)}}(f))}(t.orderBy);a&&(e.structuredQuery.orderBy=a);const l=ka(n,t.limit);return l!==null&&(e.structuredQuery.limit=l),t.startAt&&(e.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(t.endAt)),{_t:e,parent:s}}function e_(n){let t=K0(n.parent);const e=n.structuredQuery,r=e.from?e.from.length:0;let s=null;if(r>0){lt(r===1);const f=e.from[0];f.allDescendants?s=f.collectionId:t=t.child(f.collectionId)}let i=[];e.where&&(i=function(m){const v=Zh(m);return v instanceof Ee&&Ph(v)?v.getFilters():[v]}(e.where));let a=[];e.orderBy&&(a=function(m){return m.map(v=>function(T){return new Os(Ir(T.field),function(R){switch(R){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(T.direction))}(v))}(e.orderBy));let l=null;e.limit&&(l=function(m){let v;return v=typeof m=="object"?m.value:m,ho(v)?null:v}(e.limit));let c=null;e.startAt&&(c=function(m){const v=!!m.before,E=m.values||[];return new Qi(E,v)}(e.startAt));let d=null;return e.endAt&&(d=function(m){const v=!m.before,E=m.values||[];return new Qi(E,v)}(e.endAt)),w0(t,s,a,i,l,"F",c,d)}function n_(n,t){const e=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Y()}}(t.purpose);return e==null?null:{"goog-listen-tags":e}}function Zh(n){return n.unaryFilter!==void 0?function(e){switch(e.unaryFilter.op){case"IS_NAN":const r=Ir(e.unaryFilter.field);return Rt.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Ir(e.unaryFilter.field);return Rt.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Ir(e.unaryFilter.field);return Rt.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Ir(e.unaryFilter.field);return Rt.create(a,"!=",{nullValue:"NULL_VALUE"});default:return Y()}}(n):n.fieldFilter!==void 0?function(e){return Rt.create(Ir(e.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Y()}}(e.fieldFilter.op),e.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(e){return Ee.create(e.compositeFilter.filters.map(r=>Zh(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return Y()}}(e.compositeFilter.op))}(n):Y()}function r_(n){return j0[n]}function s_(n){return H0[n]}function i_(n){return W0[n]}function Tr(n){return{fieldPath:n.canonicalString()}}function Ir(n){return qt.fromServerFormat(n.fieldPath)}function tf(n){return n instanceof Rt?function(e){if(e.op==="=="){if(Cu(e.value))return{unaryFilter:{field:Tr(e.field),op:"IS_NAN"}};if(Pu(e.value))return{unaryFilter:{field:Tr(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(Cu(e.value))return{unaryFilter:{field:Tr(e.field),op:"IS_NOT_NAN"}};if(Pu(e.value))return{unaryFilter:{field:Tr(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Tr(e.field),op:s_(e.op),value:e.value}}}(n):n instanceof Ee?function(e){const r=e.getFilters().map(s=>tf(s));return r.length===1?r[0]:{compositeFilter:{op:i_(e.op),filters:r}}}(n):Y()}function o_(n){const t=[];return n.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function ef(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(t,e,r,s,i=G.min(),a=G.min(),l=Ht.EMPTY_BYTE_STRING,c=null){this.target=t,this.targetId=e,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(t){return new fn(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new fn(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new fn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new fn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a_{constructor(t){this.ct=t}}function l_(n){const t=e_({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Ji(t,t.limit,"L"):t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class c_{constructor(){this.un=new u_}addToCollectionParentIndex(t,e){return this.un.add(e),L.resolve()}getCollectionParents(t,e){return L.resolve(this.un.getEntries(e))}addFieldIndex(t,e){return L.resolve()}deleteFieldIndex(t,e){return L.resolve()}deleteAllFieldIndexes(t){return L.resolve()}createTargetIndexes(t,e){return L.resolve()}getDocumentsMatchingTarget(t,e){return L.resolve(null)}getIndexType(t,e){return L.resolve(0)}getFieldIndexes(t,e){return L.resolve([])}getNextCollectionGroupToUpdate(t){return L.resolve(null)}getMinOffset(t,e){return L.resolve(En.min())}getMinOffsetFromCollectionGroup(t,e){return L.resolve(En.min())}updateCollectionGroup(t,e,r){return L.resolve()}updateIndexEntries(t,e){return L.resolve()}}class u_{constructor(){this.index={}}add(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e]||new jt(pt.comparator),i=!s.has(r);return this.index[e]=s.add(r),i}has(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e];return s&&s.has(r)}getEntries(t){return(this.index[t]||new jt(pt.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ur{constructor(t){this.Ln=t}next(){return this.Ln+=2,this.Ln}static Bn(){return new Ur(0)}static kn(){return new Ur(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d_{constructor(){this.changes=new Gr(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,Qt.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const r=this.changes.get(e);return r!==void 0?L.resolve(r):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h_{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f_{constructor(t,e,r,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=r,this.indexManager=s}getDocument(t,e){let r=null;return this.documentOverlayCache.getOverlay(t,e).next(s=>(r=s,this.remoteDocumentCache.getEntry(t,e))).next(s=>(r!==null&&As(r.mutation,s,oe.empty(),Mt.now()),s))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.getLocalViewOfDocuments(t,r,tt()).next(()=>r))}getLocalViewOfDocuments(t,e,r=tt()){const s=$n();return this.populateOverlays(t,s,e).next(()=>this.computeViews(t,e,s,r).next(i=>{let a=_s();return i.forEach((l,c)=>{a=a.insert(l,c.overlayedDocument)}),a}))}getOverlayedDocuments(t,e){const r=$n();return this.populateOverlays(t,r,e).next(()=>this.computeViews(t,e,r,tt()))}populateOverlays(t,e,r){const s=[];return r.forEach(i=>{e.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(t,s).next(i=>{i.forEach((a,l)=>{e.set(a,l)})})}computeViews(t,e,r,s){let i=Ke();const a=Ss(),l=function(){return Ss()}();return e.forEach((c,d)=>{const f=r.get(d.key);s.has(d.key)&&(f===void 0||f.mutation instanceof An)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),As(f.mutation,d,f.mutation.getFieldMask(),Mt.now())):a.set(d.key,oe.empty())}),this.recalculateAndSaveOverlays(t,i).next(c=>(c.forEach((d,f)=>a.set(d,f)),e.forEach((d,f)=>{var m;return l.set(d,new h_(f,(m=a.get(d))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(t,e){const r=Ss();let s=new vt((a,l)=>a-l),i=tt();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(a=>{for(const l of a)l.keys().forEach(c=>{const d=e.get(c);if(d===null)return;let f=r.get(c)||oe.empty();f=l.applyToLocalView(d,f),r.set(c,f);const m=(s.get(l.batchId)||tt()).add(c);s=s.insert(l.batchId,m)})}).next(()=>{const a=[],l=s.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,f=c.value,m=Bh();f.forEach(v=>{if(!i.has(v)){const E=jh(e.get(v),r.get(v));E!==null&&m.set(v,E),i=i.add(v)}}),a.push(this.documentOverlayCache.saveOverlays(t,d,m))}return L.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.recalculateAndSaveOverlays(t,r))}getDocumentsMatchingQuery(t,e,r,s){return function(a){return q.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):Mh(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,r,s):this.getDocumentsMatchingCollectionQuery(t,e,r,s)}getNextDocuments(t,e,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,r,s).next(i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,r.largestBatchId,s-i.size):L.resolve($n());let l=-1,c=i;return a.next(d=>L.forEach(d,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(f)?L.resolve():this.remoteDocumentCache.getEntry(t,f).next(v=>{c=c.insert(f,v)}))).next(()=>this.populateOverlays(t,d,i)).next(()=>this.computeViews(t,c,d,tt())).next(f=>({batchId:l,changes:Oh(f)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new q(e)).next(r=>{let s=_s();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(t,e,r,s){const i=e.collectionGroup;let a=_s();return this.indexManager.getCollectionParents(t,i).next(l=>L.forEach(l,c=>{const d=function(m,v){return new Yr(v,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(e,c.child(i));return this.getDocumentsMatchingCollectionQuery(t,d,r,s).next(f=>{f.forEach((m,v)=>{a=a.insert(m,v)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(t,e,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,r.largestBatchId).next(a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,r,i,s))).next(a=>{i.forEach((c,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Qt.newInvalidDocument(f)))});let l=_s();return a.forEach((c,d)=>{const f=i.get(c);f!==void 0&&As(f.mutation,d,oe.empty(),Mt.now()),po(e,d)&&(l=l.insert(c,d))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p_{constructor(t){this.serializer=t,this.hr=new Map,this.Pr=new Map}getBundleMetadata(t,e){return L.resolve(this.hr.get(e))}saveBundleMetadata(t,e){return this.hr.set(e.id,function(s){return{id:s.id,version:s.version,createTime:Pe(s.createTime)}}(e)),L.resolve()}getNamedQuery(t,e){return L.resolve(this.Pr.get(e))}saveNamedQuery(t,e){return this.Pr.set(e.name,function(s){return{name:s.name,query:l_(s.bundledQuery),readTime:Pe(s.readTime)}}(e)),L.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m_{constructor(){this.overlays=new vt(q.comparator),this.Ir=new Map}getOverlay(t,e){return L.resolve(this.overlays.get(e))}getOverlays(t,e){const r=$n();return L.forEach(e,s=>this.getOverlay(t,s).next(i=>{i!==null&&r.set(s,i)})).next(()=>r)}saveOverlays(t,e,r){return r.forEach((s,i)=>{this.ht(t,e,i)}),L.resolve()}removeOverlaysForBatchId(t,e,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(r)),L.resolve()}getOverlaysForCollection(t,e,r){const s=$n(),i=e.length+1,a=new q(e.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!e.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>r&&s.set(c.getKey(),c)}return L.resolve(s)}getOverlaysForCollectionGroup(t,e,r,s){let i=new vt((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===e&&d.largestBatchId>r){let f=i.get(d.largestBatchId);f===null&&(f=$n(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const l=$n(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,f)=>l.set(d,f)),!(l.size()>=s)););return L.resolve(l)}ht(t,e,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new B0(e,r));let i=this.Ir.get(e);i===void 0&&(i=tt(),this.Ir.set(e,i)),this.Ir.set(e,i.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g_{constructor(){this.sessionToken=Ht.EMPTY_BYTE_STRING}getSessionToken(t){return L.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,L.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class El{constructor(){this.Tr=new jt(Bt.Er),this.dr=new jt(Bt.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(t,e){const r=new Bt(t,e);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(t,e){t.forEach(r=>this.addReference(r,e))}removeReference(t,e){this.Vr(new Bt(t,e))}mr(t,e){t.forEach(r=>this.removeReference(r,e))}gr(t){const e=new q(new pt([])),r=new Bt(e,t),s=new Bt(e,t+1),i=[];return this.dr.forEachInRange([r,s],a=>{this.Vr(a),i.push(a.key)}),i}pr(){this.Tr.forEach(t=>this.Vr(t))}Vr(t){this.Tr=this.Tr.delete(t),this.dr=this.dr.delete(t)}yr(t){const e=new q(new pt([])),r=new Bt(e,t),s=new Bt(e,t+1);let i=tt();return this.dr.forEachInRange([r,s],a=>{i=i.add(a.key)}),i}containsKey(t){const e=new Bt(t,0),r=this.Tr.firstAfterOrEqual(e);return r!==null&&t.isEqual(r.key)}}class Bt{constructor(t,e){this.key=t,this.wr=e}static Er(t,e){return q.comparator(t.key,e.key)||st(t.wr,e.wr)}static Ar(t,e){return st(t.wr,e.wr)||q.comparator(t.key,e.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y_{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.Sr=1,this.br=new jt(Bt.Er)}checkEmpty(t){return L.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,r,s){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new O0(i,e,r,s);this.mutationQueue.push(a);for(const l of s)this.br=this.br.add(new Bt(l.key,i)),this.indexManager.addToCollectionParentIndex(t,l.key.path.popLast());return L.resolve(a)}lookupMutationBatch(t,e){return L.resolve(this.Dr(e))}getNextMutationBatchAfterBatchId(t,e){const r=e+1,s=this.vr(r),i=s<0?0:s;return L.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return L.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(t){return L.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const r=new Bt(e,0),s=new Bt(e,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([r,s],a=>{const l=this.Dr(a.wr);i.push(l)}),L.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let r=new jt(st);return e.forEach(s=>{const i=new Bt(s,0),a=new Bt(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,a],l=>{r=r.add(l.wr)})}),L.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(t,e){const r=e.path,s=r.length+1;let i=r;q.isDocumentKey(i)||(i=i.child(""));const a=new Bt(new q(i),0);let l=new jt(st);return this.br.forEachWhile(c=>{const d=c.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(l=l.add(c.wr)),!0)},a),L.resolve(this.Cr(l))}Cr(t){const e=[];return t.forEach(r=>{const s=this.Dr(r);s!==null&&e.push(s)}),e}removeMutationBatch(t,e){lt(this.Fr(e.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return L.forEach(e.mutations,s=>{const i=new Bt(s.key,e.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)}).next(()=>{this.br=r})}On(t){}containsKey(t,e){const r=new Bt(e,0),s=this.br.firstAfterOrEqual(r);return L.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,L.resolve()}Fr(t,e){return this.vr(t)}vr(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Dr(t){const e=this.vr(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v_{constructor(t){this.Mr=t,this.docs=function(){return new vt(q.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const r=e.key,s=this.docs.get(r),i=s?s.size:0,a=this.Mr(e);return this.docs=this.docs.insert(r,{document:e.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(t,r.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const r=this.docs.get(e);return L.resolve(r?r.document.mutableCopy():Qt.newInvalidDocument(e))}getEntries(t,e){let r=Ke();return e.forEach(s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Qt.newInvalidDocument(s))}),L.resolve(r)}getDocumentsMatchingQuery(t,e,r,s){let i=Ke();const a=e.path,l=new q(a.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:f}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||e0(t0(f),r)<=0||(s.has(f.key)||po(e,f))&&(i=i.insert(f.key,f.mutableCopy()))}return L.resolve(i)}getAllFromCollectionGroup(t,e,r,s){Y()}Or(t,e){return L.forEach(this.docs,r=>e(r))}newChangeBuffer(t){return new __(this)}getSize(t){return L.resolve(this.size)}}class __ extends d_{constructor(t){super(),this.cr=t}applyChanges(t){const e=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?e.push(this.cr.addEntry(t,s)):this.cr.removeEntry(r)}),L.waitFor(e)}getFromCache(t,e){return this.cr.getEntry(t,e)}getAllFromCache(t,e){return this.cr.getEntries(t,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w_{constructor(t){this.persistence=t,this.Nr=new Gr(e=>fl(e),pl),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.Lr=0,this.Br=new El,this.targetCount=0,this.kr=Ur.Bn()}forEachTarget(t,e){return this.Nr.forEach((r,s)=>e(s)),L.resolve()}getLastRemoteSnapshotVersion(t){return L.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return L.resolve(this.Lr)}allocateTargetId(t){return this.highestTargetId=this.kr.next(),L.resolve(this.highestTargetId)}setTargetsMetadata(t,e,r){return r&&(this.lastRemoteSnapshotVersion=r),e>this.Lr&&(this.Lr=e),L.resolve()}Kn(t){this.Nr.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.kr=new Ur(e),this.highestTargetId=e),t.sequenceNumber>this.Lr&&(this.Lr=t.sequenceNumber)}addTargetData(t,e){return this.Kn(e),this.targetCount+=1,L.resolve()}updateTargetData(t,e){return this.Kn(e),L.resolve()}removeTargetData(t,e){return this.Nr.delete(e.target),this.Br.gr(e.targetId),this.targetCount-=1,L.resolve()}removeTargets(t,e,r){let s=0;const i=[];return this.Nr.forEach((a,l)=>{l.sequenceNumber<=e&&r.get(l.targetId)===null&&(this.Nr.delete(a),i.push(this.removeMatchingKeysForTargetId(t,l.targetId)),s++)}),L.waitFor(i).next(()=>s)}getTargetCount(t){return L.resolve(this.targetCount)}getTargetData(t,e){const r=this.Nr.get(e)||null;return L.resolve(r)}addMatchingKeys(t,e,r){return this.Br.Rr(e,r),L.resolve()}removeMatchingKeys(t,e,r){this.Br.mr(e,r);const s=this.persistence.referenceDelegate,i=[];return s&&e.forEach(a=>{i.push(s.markPotentiallyOrphaned(t,a))}),L.waitFor(i)}removeMatchingKeysForTargetId(t,e){return this.Br.gr(e),L.resolve()}getMatchingKeysForTargetId(t,e){const r=this.Br.yr(e);return L.resolve(r)}containsKey(t,e){return L.resolve(this.Br.containsKey(e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E_{constructor(t,e){this.qr={},this.overlays={},this.Qr=new cl(0),this.Kr=!1,this.Kr=!0,this.$r=new g_,this.referenceDelegate=t(this),this.Ur=new w_(this),this.indexManager=new c_,this.remoteDocumentCache=function(s){return new v_(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new a_(e),this.Gr=new p_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new m_,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let r=this.qr[t.toKey()];return r||(r=new y_(e,this.referenceDelegate),this.qr[t.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(t,e,r){z("MemoryPersistence","Starting transaction:",t);const s=new b_(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(i=>this.referenceDelegate.jr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Hr(t,e){return L.or(Object.values(this.qr).map(r=>()=>r.containsKey(t,e)))}}class b_ extends r0{constructor(t){super(),this.currentSequenceNumber=t}}class bl{constructor(t){this.persistence=t,this.Jr=new El,this.Yr=null}static Zr(t){return new bl(t)}get Xr(){if(this.Yr)return this.Yr;throw Y()}addReference(t,e,r){return this.Jr.addReference(r,e),this.Xr.delete(r.toString()),L.resolve()}removeReference(t,e,r){return this.Jr.removeReference(r,e),this.Xr.add(r.toString()),L.resolve()}markPotentiallyOrphaned(t,e){return this.Xr.add(e.toString()),L.resolve()}removeTarget(t,e){this.Jr.gr(e.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(t,e.targetId).next(s=>{s.forEach(i=>this.Xr.add(i.toString()))}).next(()=>r.removeTargetData(t,e))}zr(){this.Yr=new Set}jr(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return L.forEach(this.Xr,r=>{const s=q.fromPath(r);return this.ei(t,s).next(i=>{i||e.removeEntry(s,G.min())})}).next(()=>(this.Yr=null,e.apply(t)))}updateLimboDocument(t,e){return this.ei(t,e).next(r=>{r?this.Xr.delete(e.toString()):this.Xr.add(e.toString())})}Wr(t){return 0}ei(t,e){return L.or([()=>L.resolve(this.Jr.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Hr(t,e)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tl{constructor(t,e,r,s){this.targetId=t,this.fromCache=e,this.$i=r,this.Ui=s}static Wi(t,e){let r=tt(),s=tt();for(const i of e.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Tl(t,e.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class T_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I_{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return om()?8:s0(Xt())>0?6:4}()}initialize(t,e){this.Ji=t,this.indexManager=e,this.Gi=!0}getDocumentsMatchingQuery(t,e,r,s){const i={result:null};return this.Yi(t,e).next(a=>{i.result=a}).next(()=>{if(!i.result)return this.Zi(t,e,s,r).next(a=>{i.result=a})}).next(()=>{if(i.result)return;const a=new T_;return this.Xi(t,e,a).next(l=>{if(i.result=l,this.zi)return this.es(t,e,a,l.size)})}).next(()=>i.result)}es(t,e,r,s){return r.documentReadCount<this.ji?(ps()<=et.DEBUG&&z("QueryEngine","SDK will not create cache indexes for query:",br(e),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),L.resolve()):(ps()<=et.DEBUG&&z("QueryEngine","Query:",br(e),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(ps()<=et.DEBUG&&z("QueryEngine","The SDK decides to create cache indexes for query:",br(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Re(e))):L.resolve())}Yi(t,e){if(Nu(e))return L.resolve(null);let r=Re(e);return this.indexManager.getIndexType(t,r).next(s=>s===0?null:(e.limit!==null&&s===1&&(e=Ji(e,null,"F"),r=Re(e)),this.indexManager.getDocumentsMatchingTarget(t,r).next(i=>{const a=tt(...i);return this.Ji.getDocuments(t,a).next(l=>this.indexManager.getMinOffset(t,r).next(c=>{const d=this.ts(e,l);return this.ns(e,d,a,c.readTime)?this.Yi(t,Ji(e,null,"F")):this.rs(t,d,e,c)}))})))}Zi(t,e,r,s){return Nu(e)||s.isEqual(G.min())?L.resolve(null):this.Ji.getDocuments(t,r).next(i=>{const a=this.ts(e,i);return this.ns(e,a,r,s)?L.resolve(null):(ps()<=et.DEBUG&&z("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),br(e)),this.rs(t,a,e,Zv(s,-1)).next(l=>l))})}ts(t,e){let r=new jt(Lh(t));return e.forEach((s,i)=>{po(t,i)&&(r=r.add(i))}),r}ns(t,e,r,s){if(t.limit===null)return!1;if(r.size!==e.size)return!0;const i=t.limitType==="F"?e.last():e.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Xi(t,e,r){return ps()<=et.DEBUG&&z("QueryEngine","Using full collection scan to execute query:",br(e)),this.Ji.getDocumentsMatchingQuery(t,e,En.min(),r)}rs(t,e,r,s){return this.Ji.getDocumentsMatchingQuery(t,r,s).next(i=>(e.forEach(a=>{i=i.insert(a.key,a)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S_{constructor(t,e,r,s){this.persistence=t,this.ss=e,this.serializer=s,this.os=new vt(st),this._s=new Gr(i=>fl(i),pl),this.us=new Map,this.cs=t.getRemoteDocumentCache(),this.Ur=t.getTargetCache(),this.Gr=t.getBundleCache(),this.ls(r)}ls(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new f_(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.os))}}function A_(n,t,e,r){return new S_(n,t,e,r)}async function nf(n,t){const e=K(n);return await e.persistence.runTransaction("Handle user change","readonly",r=>{let s;return e.mutationQueue.getAllMutationBatches(r).next(i=>(s=i,e.ls(t),e.mutationQueue.getAllMutationBatches(r))).next(i=>{const a=[],l=[];let c=tt();for(const d of s){a.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}for(const d of i){l.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}return e.localDocuments.getDocuments(r,c).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:l}))})})}function x_(n,t){const e=K(n);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=t.batch.keys(),i=e.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,f){const m=d.batch,v=m.keys();let E=L.resolve();return v.forEach(T=>{E=E.next(()=>f.getEntry(c,T)).next(x=>{const R=d.docVersions.get(T);lt(R!==null),x.version.compareTo(R)<0&&(m.applyToRemoteDocument(x,d),x.isValidDocument()&&(x.setReadTime(d.commitVersion),f.addEntry(x)))})}),E.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(e,r,t,i).next(()=>i.apply(r)).next(()=>e.mutationQueue.performConsistencyCheck(r)).next(()=>e.documentOverlayCache.removeOverlaysForBatchId(r,s,t.batch.batchId)).next(()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let c=tt();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(t))).next(()=>e.localDocuments.getDocuments(r,s))})}function rf(n){const t=K(n);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Ur.getLastRemoteSnapshotVersion(e))}function R_(n,t){const e=K(n),r=t.snapshotVersion;let s=e.os;return e.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const a=e.cs.newChangeBuffer({trackRemovals:!0});s=e.os;const l=[];t.targetChanges.forEach((f,m)=>{const v=s.get(m);if(!v)return;l.push(e.Ur.removeMatchingKeys(i,f.removedDocuments,m).next(()=>e.Ur.addMatchingKeys(i,f.addedDocuments,m)));let E=v.withSequenceNumber(i.currentSequenceNumber);t.targetMismatches.get(m)!==null?E=E.withResumeToken(Ht.EMPTY_BYTE_STRING,G.min()).withLastLimboFreeSnapshotVersion(G.min()):f.resumeToken.approximateByteSize()>0&&(E=E.withResumeToken(f.resumeToken,r)),s=s.insert(m,E),function(x,R,A){return x.resumeToken.approximateByteSize()===0||R.snapshotVersion.toMicroseconds()-x.snapshotVersion.toMicroseconds()>=3e8?!0:A.addedDocuments.size+A.modifiedDocuments.size+A.removedDocuments.size>0}(v,E,f)&&l.push(e.Ur.updateTargetData(i,E))});let c=Ke(),d=tt();if(t.documentUpdates.forEach(f=>{t.resolvedLimboDocuments.has(f)&&l.push(e.persistence.referenceDelegate.updateLimboDocument(i,f))}),l.push(P_(i,a,t.documentUpdates).next(f=>{c=f.Ps,d=f.Is})),!r.isEqual(G.min())){const f=e.Ur.getLastRemoteSnapshotVersion(i).next(m=>e.Ur.setTargetsMetadata(i,i.currentSequenceNumber,r));l.push(f)}return L.waitFor(l).next(()=>a.apply(i)).next(()=>e.localDocuments.getLocalViewOfDocuments(i,c,d)).next(()=>c)}).then(i=>(e.os=s,i))}function P_(n,t,e){let r=tt(),s=tt();return e.forEach(i=>r=r.add(i)),t.getEntries(n,r).next(i=>{let a=Ke();return e.forEach((l,c)=>{const d=i.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(l)),c.isNoDocument()&&c.version.isEqual(G.min())?(t.removeEntry(l,c.readTime),a=a.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(t.addEntry(c),a=a.insert(l,c)):z("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:a,Is:s}})}function C_(n,t){const e=K(n);return e.persistence.runTransaction("Get next mutation batch","readonly",r=>(t===void 0&&(t=-1),e.mutationQueue.getNextMutationBatchAfterBatchId(r,t)))}function k_(n,t){const e=K(n);return e.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return e.Ur.getTargetData(r,t).next(i=>i?(s=i,L.resolve(s)):e.Ur.allocateTargetId(r).next(a=>(s=new fn(t,a,"TargetPurposeListen",r.currentSequenceNumber),e.Ur.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=e.os.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.os=e.os.insert(r.targetId,r),e._s.set(t,r.targetId)),r})}async function La(n,t,e){const r=K(n),s=r.os.get(t),i=e?"readwrite":"readwrite-primary";try{e||await r.persistence.runTransaction("Release target",i,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!Gs(a))throw a;z("LocalStore",`Failed to update sequence numbers for target ${t}: ${a}`)}r.os=r.os.remove(t),r._s.delete(s.target)}function Hu(n,t,e){const r=K(n);let s=G.min(),i=tt();return r.persistence.runTransaction("Execute query","readwrite",a=>function(c,d,f){const m=K(c),v=m._s.get(f);return v!==void 0?L.resolve(m.os.get(v)):m.Ur.getTargetData(d,f)}(r,a,Re(t)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(a,l.targetId).next(c=>{i=c})}).next(()=>r.ss.getDocumentsMatchingQuery(a,t,e?s:G.min(),e?i:tt())).next(l=>(D_(r,b0(t),l),{documents:l,Ts:i})))}function D_(n,t,e){let r=n.us.get(t)||G.min();e.forEach((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)}),n.us.set(t,r)}class Wu{constructor(){this.activeTargetIds=R0()}fs(t){this.activeTargetIds=this.activeTargetIds.add(t)}gs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Vs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class M_{constructor(){this.so=new Wu,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,r){}addLocalQueryTarget(t,e=!0){return e&&this.so.fs(t),this.oo[t]||"not-current"}updateQueryState(t,e,r){this.oo[t]=e}removeLocalQueryTarget(t){this.so.gs(t)}isLocalQueryTarget(t){return this.so.activeTargetIds.has(t)}clearQueryState(t){delete this.oo[t]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(t){return this.so.activeTargetIds.has(t)}start(){return this.so=new Wu,Promise.resolve()}handleUserChange(t,e,r){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N_{_o(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yu{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(t){this.ho.push(t)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){z("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const t of this.ho)t(0)}lo(){z("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const t of this.ho)t(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ri=null;function ia(){return Ri===null?Ri=function(){return 268435456+Math.round(2147483648*Math.random())}():Ri++,"0x"+Ri.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const L_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V_{constructor(t){this.Io=t.Io,this.To=t.To}Eo(t){this.Ao=t}Ro(t){this.Vo=t}mo(t){this.fo=t}onMessage(t){this.po=t}close(){this.To()}send(t){this.Io(t)}yo(){this.Ao()}wo(){this.Vo()}So(t){this.fo(t)}bo(t){this.po(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gt="WebChannelConnection";class O_ extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const r=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+e.host,this.vo=`projects/${s}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Fo(){return!1}Mo(e,r,s,i,a){const l=ia(),c=this.xo(e,r.toUriEncodedString());z("RestConnection",`Sending RPC '${e}' ${l}:`,c,s);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,a),this.No(e,c,d,s).then(f=>(z("RestConnection",`Received RPC '${e}' ${l}: `,f),f),f=>{throw Vr("RestConnection",`RPC '${e}' ${l} failed with error: `,f,"url: ",c,"request:",s),f})}Lo(e,r,s,i,a,l){return this.Mo(e,r,s,i,a)}Oo(e,r,s){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Wr}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((i,a)=>e[a]=i),s&&s.headers.forEach((i,a)=>e[a]=i)}xo(e,r){const s=L_[e];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(t){super(t),this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}No(t,e,r,s){const i=ia();return new Promise((a,l)=>{const c=new yh;c.setWithCredentials(!0),c.listenOnce(vh.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Mi.NO_ERROR:const f=c.getResponseJson();z(Gt,`XHR for RPC '${t}' ${i} received:`,JSON.stringify(f)),a(f);break;case Mi.TIMEOUT:z(Gt,`RPC '${t}' ${i} timed out`),l(new U(M.DEADLINE_EXCEEDED,"Request time out"));break;case Mi.HTTP_ERROR:const m=c.getStatus();if(z(Gt,`RPC '${t}' ${i} failed with status:`,m,"response text:",c.getResponseText()),m>0){let v=c.getResponseJson();Array.isArray(v)&&(v=v[0]);const E=v==null?void 0:v.error;if(E&&E.status&&E.message){const T=function(R){const A=R.toLowerCase().replace(/_/g,"-");return Object.values(M).indexOf(A)>=0?A:M.UNKNOWN}(E.status);l(new U(T,E.message))}else l(new U(M.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new U(M.UNAVAILABLE,"Connection failed."));break;default:Y()}}finally{z(Gt,`RPC '${t}' ${i} completed.`)}});const d=JSON.stringify(s);z(Gt,`RPC '${t}' ${i} sending request:`,s),c.send(e,"POST",d,r,15)})}Bo(t,e,r){const s=ia(),i=[this.Do,"/","google.firestore.v1.Firestore","/",t,"/channel"],a=Eh(),l=wh(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,e,r),c.encodeInitMessageHeaders=!0;const f=i.join("");z(Gt,`Creating RPC '${t}' stream ${s}: ${f}`,c);const m=a.createWebChannel(f,c);let v=!1,E=!1;const T=new V_({Io:R=>{E?z(Gt,`Not sending because RPC '${t}' stream ${s} is closed:`,R):(v||(z(Gt,`Opening RPC '${t}' stream ${s} transport.`),m.open(),v=!0),z(Gt,`RPC '${t}' stream ${s} sending:`,R),m.send(R))},To:()=>m.close()}),x=(R,A,D)=>{R.listen(A,N=>{try{D(N)}catch(C){setTimeout(()=>{throw C},0)}})};return x(m,vs.EventType.OPEN,()=>{E||(z(Gt,`RPC '${t}' stream ${s} transport opened.`),T.yo())}),x(m,vs.EventType.CLOSE,()=>{E||(E=!0,z(Gt,`RPC '${t}' stream ${s} transport closed`),T.So())}),x(m,vs.EventType.ERROR,R=>{E||(E=!0,Vr(Gt,`RPC '${t}' stream ${s} transport errored:`,R),T.So(new U(M.UNAVAILABLE,"The operation could not be completed")))}),x(m,vs.EventType.MESSAGE,R=>{var A;if(!E){const D=R.data[0];lt(!!D);const N=D,C=N.error||((A=N[0])===null||A===void 0?void 0:A.error);if(C){z(Gt,`RPC '${t}' stream ${s} received error:`,C);const V=C.status;let O=function(y){const _=xt[y];if(_!==void 0)return Wh(_)}(V),b=C.message;O===void 0&&(O=M.INTERNAL,b="Unknown error status: "+V+" with message "+C.message),E=!0,T.So(new U(O,b)),m.close()}else z(Gt,`RPC '${t}' stream ${s} received:`,D),T.bo(D)}}),x(l,_h.STAT_EVENT,R=>{R.stat===Sa.PROXY?z(Gt,`RPC '${t}' stream ${s} detected buffering proxy`):R.stat===Sa.NOPROXY&&z(Gt,`RPC '${t}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{T.wo()},0),T}}function oa(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vo(n){return new Y0(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sf{constructor(t,e,r=1e3,s=1.5,i=6e4){this.ui=t,this.timerId=e,this.ko=r,this.qo=s,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(t){this.cancel();const e=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,e-r);s>0&&z("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${e} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),t())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class of{constructor(t,e,r,s,i,a,l,c){this.ui=t,this.Ho=r,this.Jo=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new sf(t,e)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(t){this.u_(),this.stream.send(t)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(t,e){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,t!==4?this.t_.reset():e&&e.code===M.RESOURCE_EXHAUSTED?(Ge(e.toString()),Ge("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):e&&e.code===M.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.mo(e)}l_(){}auth(){this.state=1;const t=this.h_(this.Yo),e=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===e&&this.P_(r,s)},r=>{t(()=>{const s=new U(M.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(t,e){const r=this.h_(this.Yo);this.stream=this.T_(t,e),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(t){return z("PersistentStream",`close with error: ${t}`),this.stream=null,this.close(4,t)}h_(t){return e=>{this.ui.enqueueAndForget(()=>this.Yo===t?e():(z("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class B_ extends of{constructor(t,e,r,s,i,a){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,r,s,a),this.serializer=i}T_(t,e){return this.connection.Bo("Listen",t,e)}E_(t){return this.onNext(t)}onNext(t){this.t_.reset();const e=Q0(this.serializer,t),r=function(i){if(!("targetChange"in i))return G.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?G.min():a.readTime?Pe(a.readTime):G.min()}(t);return this.listener.d_(e,r)}A_(t){const e={};e.database=Na(this.serializer),e.addTarget=function(i,a){let l;const c=a.target;if(l=Pa(c)?{documents:Z0(i,c)}:{query:t_(i,c)._t},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=Kh(i,a.resumeToken);const d=ka(i,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(G.min())>0){l.readTime=to(i,a.snapshotVersion.toTimestamp());const d=ka(i,a.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,t);const r=n_(this.serializer,t);r&&(e.labels=r),this.a_(e)}R_(t){const e={};e.database=Na(this.serializer),e.removeTarget=t,this.a_(e)}}class F_ extends of{constructor(t,e,r,s,i,a){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,r,s,a),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(t,e){return this.connection.Bo("Write",t,e)}E_(t){return lt(!!t.streamToken),this.lastStreamToken=t.streamToken,lt(!t.writeResults||t.writeResults.length===0),this.listener.f_()}onNext(t){lt(!!t.streamToken),this.lastStreamToken=t.streamToken,this.t_.reset();const e=X0(t.writeResults,t.commitTime),r=Pe(t.commitTime);return this.listener.g_(r,e)}p_(){const t={};t.database=Na(this.serializer),this.a_(t)}m_(t){const e={streamToken:this.lastStreamToken,writes:t.map(r=>J0(this.serializer,r))};this.a_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U_ extends class{}{constructor(t,e,r,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new U(M.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(t,e,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,a])=>this.connection.Mo(t,Da(e,r),s,i,a)).catch(i=>{throw i.name==="FirebaseError"?(i.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new U(M.UNKNOWN,i.toString())})}Lo(t,e,r,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Lo(t,Da(e,r),s,a,l,i)).catch(a=>{throw a.name==="FirebaseError"?(a.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new U(M.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class z_{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(t){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.C_("Offline")))}set(t){this.x_(),this.S_=0,t==="Online"&&(this.D_=!1),this.C_(t)}C_(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}F_(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Ge(e),this.D_=!1):z("OnlineStateTracker",e)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $_{constructor(t,e,r,s,i){this.localStore=t,this.datastore=e,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(a=>{r.enqueueAndForget(async()=>{er(this)&&(z("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=K(c);d.L_.add(4),await Js(d),d.q_.set("Unknown"),d.L_.delete(4),await _o(d)}(this))})}),this.q_=new z_(r,s)}}async function _o(n){if(er(n))for(const t of n.B_)await t(!0)}async function Js(n){for(const t of n.B_)await t(!1)}function af(n,t){const e=K(n);e.N_.has(t.targetId)||(e.N_.set(t.targetId,t),xl(e)?Al(e):Kr(e).r_()&&Sl(e,t))}function Il(n,t){const e=K(n),r=Kr(e);e.N_.delete(t),r.r_()&&lf(e,t),e.N_.size===0&&(r.r_()?r.o_():er(e)&&e.q_.set("Unknown"))}function Sl(n,t){if(n.Q_.xe(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(G.min())>0){const e=n.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}Kr(n).A_(t)}function lf(n,t){n.Q_.xe(t),Kr(n).R_(t)}function Al(n){n.Q_=new q0({getRemoteKeysForTarget:t=>n.remoteSyncer.getRemoteKeysForTarget(t),ot:t=>n.N_.get(t)||null,tt:()=>n.datastore.serializer.databaseId}),Kr(n).start(),n.q_.v_()}function xl(n){return er(n)&&!Kr(n).n_()&&n.N_.size>0}function er(n){return K(n).L_.size===0}function cf(n){n.Q_=void 0}async function q_(n){n.q_.set("Online")}async function j_(n){n.N_.forEach((t,e)=>{Sl(n,t)})}async function H_(n,t){cf(n),xl(n)?(n.q_.M_(t),Al(n)):n.q_.set("Unknown")}async function W_(n,t,e){if(n.q_.set("Online"),t instanceof Gh&&t.state===2&&t.cause)try{await async function(s,i){const a=i.cause;for(const l of i.targetIds)s.N_.has(l)&&(await s.remoteSyncer.rejectListen(l,a),s.N_.delete(l),s.Q_.removeTarget(l))}(n,t)}catch(r){z("RemoteStore","Failed to remove targets %s: %s ",t.targetIds.join(","),r),await eo(n,r)}else if(t instanceof Vi?n.Q_.Ke(t):t instanceof Yh?n.Q_.He(t):n.Q_.We(t),!e.isEqual(G.min()))try{const r=await rf(n.localStore);e.compareTo(r)>=0&&await function(i,a){const l=i.Q_.rt(a);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const f=i.N_.get(d);f&&i.N_.set(d,f.withResumeToken(c.resumeToken,a))}}),l.targetMismatches.forEach((c,d)=>{const f=i.N_.get(c);if(!f)return;i.N_.set(c,f.withResumeToken(Ht.EMPTY_BYTE_STRING,f.snapshotVersion)),lf(i,c);const m=new fn(f.target,c,d,f.sequenceNumber);Sl(i,m)}),i.remoteSyncer.applyRemoteEvent(l)}(n,e)}catch(r){z("RemoteStore","Failed to raise snapshot:",r),await eo(n,r)}}async function eo(n,t,e){if(!Gs(t))throw t;n.L_.add(1),await Js(n),n.q_.set("Offline"),e||(e=()=>rf(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{z("RemoteStore","Retrying IndexedDB access"),await e(),n.L_.delete(1),await _o(n)})}function uf(n,t){return t().catch(e=>eo(n,e,t))}async function wo(n){const t=K(n),e=Tn(t);let r=t.O_.length>0?t.O_[t.O_.length-1].batchId:-1;for(;Y_(t);)try{const s=await C_(t.localStore,r);if(s===null){t.O_.length===0&&e.o_();break}r=s.batchId,G_(t,s)}catch(s){await eo(t,s)}df(t)&&hf(t)}function Y_(n){return er(n)&&n.O_.length<10}function G_(n,t){n.O_.push(t);const e=Tn(n);e.r_()&&e.V_&&e.m_(t.mutations)}function df(n){return er(n)&&!Tn(n).n_()&&n.O_.length>0}function hf(n){Tn(n).start()}async function K_(n){Tn(n).p_()}async function Q_(n){const t=Tn(n);for(const e of n.O_)t.m_(e.mutations)}async function J_(n,t,e){const r=n.O_.shift(),s=vl.from(r,t,e);await uf(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await wo(n)}async function X_(n,t){t&&Tn(n).V_&&await async function(r,s){if(function(a){return U0(a)&&a!==M.ABORTED}(s.code)){const i=r.O_.shift();Tn(r).s_(),await uf(r,()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s)),await wo(r)}}(n,t),df(n)&&hf(n)}async function Gu(n,t){const e=K(n);e.asyncQueue.verifyOperationInProgress(),z("RemoteStore","RemoteStore received new credentials");const r=er(e);e.L_.add(3),await Js(e),r&&e.q_.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.L_.delete(3),await _o(e)}async function Z_(n,t){const e=K(n);t?(e.L_.delete(2),await _o(e)):t||(e.L_.add(2),await Js(e),e.q_.set("Unknown"))}function Kr(n){return n.K_||(n.K_=function(e,r,s){const i=K(e);return i.w_(),new B_(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:q_.bind(null,n),Ro:j_.bind(null,n),mo:H_.bind(null,n),d_:W_.bind(null,n)}),n.B_.push(async t=>{t?(n.K_.s_(),xl(n)?Al(n):n.q_.set("Unknown")):(await n.K_.stop(),cf(n))})),n.K_}function Tn(n){return n.U_||(n.U_=function(e,r,s){const i=K(e);return i.w_(),new F_(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:K_.bind(null,n),mo:X_.bind(null,n),f_:Q_.bind(null,n),g_:J_.bind(null,n)}),n.B_.push(async t=>{t?(n.U_.s_(),await wo(n)):(await n.U_.stop(),n.O_.length>0&&(z("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rl{constructor(t,e,r,s,i){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new He,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,r,s,i){const a=Date.now()+r,l=new Rl(t,e,a,s,i);return l.start(r),l}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new U(M.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Pl(n,t){if(Ge("AsyncQueue",`${t}: ${n}`),Gs(n))return new U(M.UNAVAILABLE,`${t}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr{constructor(t){this.comparator=t?(e,r)=>t(e,r)||q.comparator(e.key,r.key):(e,r)=>q.comparator(e.key,r.key),this.keyedMap=_s(),this.sortedSet=new vt(this.comparator)}static emptySet(t){return new kr(t.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,r)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof kr)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),r=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const r=new kr;return r.comparator=this.comparator,r.keyedMap=t,r.sortedSet=e,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ku{constructor(){this.W_=new vt(q.comparator)}track(t){const e=t.doc.key,r=this.W_.get(e);r?t.type!==0&&r.type===3?this.W_=this.W_.insert(e,t):t.type===3&&r.type!==1?this.W_=this.W_.insert(e,{type:r.type,doc:t.doc}):t.type===2&&r.type===2?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):t.type===2&&r.type===0?this.W_=this.W_.insert(e,{type:0,doc:t.doc}):t.type===1&&r.type===0?this.W_=this.W_.remove(e):t.type===1&&r.type===2?this.W_=this.W_.insert(e,{type:1,doc:r.doc}):t.type===0&&r.type===1?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):Y():this.W_=this.W_.insert(e,t)}G_(){const t=[];return this.W_.inorderTraversal((e,r)=>{t.push(r)}),t}}class zr{constructor(t,e,r,s,i,a,l,c,d){this.query=t,this.docs=e,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(t,e,r,s,i){const a=[];return e.forEach(l=>{a.push({type:0,doc:l})}),new zr(t,e,kr.emptySet(e),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&fo(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,r=t.docChanges;if(e.length!==r.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==r[s].type||!e[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tw{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(t=>t.J_())}}class ew{constructor(){this.queries=Qu(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(e,r){const s=K(e),i=s.queries;s.queries=Qu(),i.forEach((a,l)=>{for(const c of l.j_)c.onError(r)})})(this,new U(M.ABORTED,"Firestore shutting down"))}}function Qu(){return new Gr(n=>Nh(n),fo)}async function ff(n,t){const e=K(n);let r=3;const s=t.query;let i=e.queries.get(s);i?!i.H_()&&t.J_()&&(r=2):(i=new tw,r=t.J_()?0:1);try{switch(r){case 0:i.z_=await e.onListen(s,!0);break;case 1:i.z_=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(a){const l=Pl(a,`Initialization of query '${br(t.query)}' failed`);return void t.onError(l)}e.queries.set(s,i),i.j_.push(t),t.Z_(e.onlineState),i.z_&&t.X_(i.z_)&&Cl(e)}async function pf(n,t){const e=K(n),r=t.query;let s=3;const i=e.queries.get(r);if(i){const a=i.j_.indexOf(t);a>=0&&(i.j_.splice(a,1),i.j_.length===0?s=t.J_()?0:1:!i.H_()&&t.J_()&&(s=2))}switch(s){case 0:return e.queries.delete(r),e.onUnlisten(r,!0);case 1:return e.queries.delete(r),e.onUnlisten(r,!1);case 2:return e.onLastRemoteStoreUnlisten(r);default:return}}function nw(n,t){const e=K(n);let r=!1;for(const s of t){const i=s.query,a=e.queries.get(i);if(a){for(const l of a.j_)l.X_(s)&&(r=!0);a.z_=s}}r&&Cl(e)}function rw(n,t,e){const r=K(n),s=r.queries.get(t);if(s)for(const i of s.j_)i.onError(e);r.queries.delete(t)}function Cl(n){n.Y_.forEach(t=>{t.next()})}var Va,Ju;(Ju=Va||(Va={})).ea="default",Ju.Cache="cache";class mf{constructor(t,e,r){this.query=t,this.ta=e,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(t){if(!this.options.includeMetadataChanges){const r=[];for(const s of t.docChanges)s.type!==3&&r.push(s);t=new zr(t.query,t.docs,t.oldDocs,r,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.na?this.ia(t)&&(this.ta.next(t),e=!0):this.sa(t,this.onlineState)&&(this.oa(t),e=!0),this.ra=t,e}onError(t){this.ta.error(t)}Z_(t){this.onlineState=t;let e=!1;return this.ra&&!this.na&&this.sa(this.ra,t)&&(this.oa(this.ra),e=!0),e}sa(t,e){if(!t.fromCache||!this.J_())return!0;const r=e!=="Offline";return(!this.options._a||!r)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}ia(t){if(t.docChanges.length>0)return!0;const e=this.ra&&this.ra.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}oa(t){t=zr.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.na=!0,this.ta.next(t)}J_(){return this.options.source!==Va.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gf{constructor(t){this.key=t}}class yf{constructor(t){this.key=t}}class sw{constructor(t,e){this.query=t,this.Ta=e,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=tt(),this.mutatedKeys=tt(),this.Aa=Lh(t),this.Ra=new kr(this.Aa)}get Va(){return this.Ta}ma(t,e){const r=e?e.fa:new Ku,s=e?e.Ra:this.Ra;let i=e?e.mutatedKeys:this.mutatedKeys,a=s,l=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal((f,m)=>{const v=s.get(f),E=po(this.query,m)?m:null,T=!!v&&this.mutatedKeys.has(v.key),x=!!E&&(E.hasLocalMutations||this.mutatedKeys.has(E.key)&&E.hasCommittedMutations);let R=!1;v&&E?v.data.isEqual(E.data)?T!==x&&(r.track({type:3,doc:E}),R=!0):this.ga(v,E)||(r.track({type:2,doc:E}),R=!0,(c&&this.Aa(E,c)>0||d&&this.Aa(E,d)<0)&&(l=!0)):!v&&E?(r.track({type:0,doc:E}),R=!0):v&&!E&&(r.track({type:1,doc:v}),R=!0,(c||d)&&(l=!0)),R&&(E?(a=a.add(E),i=x?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),r.track({type:1,doc:f})}return{Ra:a,fa:r,ns:l,mutatedKeys:i}}ga(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,r,s){const i=this.Ra;this.Ra=t.Ra,this.mutatedKeys=t.mutatedKeys;const a=t.fa.G_();a.sort((f,m)=>function(E,T){const x=R=>{switch(R){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Y()}};return x(E)-x(T)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(r),s=s!=null&&s;const l=e&&!s?this.ya():[],c=this.da.size===0&&this.current&&!s?1:0,d=c!==this.Ea;return this.Ea=c,a.length!==0||d?{snapshot:new zr(this.query,t.Ra,i,a,t.mutatedKeys,c===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Ku,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(t){return!this.Ta.has(t)&&!!this.Ra.has(t)&&!this.Ra.get(t).hasLocalMutations}pa(t){t&&(t.addedDocuments.forEach(e=>this.Ta=this.Ta.add(e)),t.modifiedDocuments.forEach(e=>{}),t.removedDocuments.forEach(e=>this.Ta=this.Ta.delete(e)),this.current=t.current)}ya(){if(!this.current)return[];const t=this.da;this.da=tt(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const e=[];return t.forEach(r=>{this.da.has(r)||e.push(new yf(r))}),this.da.forEach(r=>{t.has(r)||e.push(new gf(r))}),e}ba(t){this.Ta=t.Ts,this.da=tt();const e=this.ma(t.documents);return this.applyChanges(e,!0)}Da(){return zr.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class iw{constructor(t,e,r){this.query=t,this.targetId=e,this.view=r}}class ow{constructor(t){this.key=t,this.va=!1}}class aw{constructor(t,e,r,s,i,a){this.localStore=t,this.remoteStore=e,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new Gr(l=>Nh(l),fo),this.Ma=new Map,this.xa=new Set,this.Oa=new vt(q.comparator),this.Na=new Map,this.La=new El,this.Ba={},this.ka=new Map,this.qa=Ur.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function lw(n,t,e=!0){const r=Tf(n);let s;const i=r.Fa.get(t);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Da()):s=await vf(r,t,e,!0),s}async function cw(n,t){const e=Tf(n);await vf(e,t,!0,!1)}async function vf(n,t,e,r){const s=await k_(n.localStore,Re(t)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,e);let l;return r&&(l=await uw(n,t,i,a==="current",s.resumeToken)),n.isPrimaryClient&&e&&af(n.remoteStore,s),l}async function uw(n,t,e,r,s){n.Ka=(m,v,E)=>async function(x,R,A,D){let N=R.view.ma(A);N.ns&&(N=await Hu(x.localStore,R.query,!1).then(({documents:b})=>R.view.ma(b,N)));const C=D&&D.targetChanges.get(R.targetId),V=D&&D.targetMismatches.get(R.targetId)!=null,O=R.view.applyChanges(N,x.isPrimaryClient,C,V);return Zu(x,R.targetId,O.wa),O.snapshot}(n,m,v,E);const i=await Hu(n.localStore,t,!0),a=new sw(t,i.Ts),l=a.ma(i.documents),c=Qs.createSynthesizedTargetChangeForCurrentChange(e,r&&n.onlineState!=="Offline",s),d=a.applyChanges(l,n.isPrimaryClient,c);Zu(n,e,d.wa);const f=new iw(t,e,a);return n.Fa.set(t,f),n.Ma.has(e)?n.Ma.get(e).push(t):n.Ma.set(e,[t]),d.snapshot}async function dw(n,t,e){const r=K(n),s=r.Fa.get(t),i=r.Ma.get(s.targetId);if(i.length>1)return r.Ma.set(s.targetId,i.filter(a=>!fo(a,t))),void r.Fa.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await La(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),e&&Il(r.remoteStore,s.targetId),Oa(r,s.targetId)}).catch(Ys)):(Oa(r,s.targetId),await La(r.localStore,s.targetId,!0))}async function hw(n,t){const e=K(n),r=e.Fa.get(t),s=e.Ma.get(r.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(r.targetId),Il(e.remoteStore,r.targetId))}async function fw(n,t,e){const r=ww(n);try{const s=await function(a,l){const c=K(a),d=Mt.now(),f=l.reduce((E,T)=>E.add(T.key),tt());let m,v;return c.persistence.runTransaction("Locally write mutations","readwrite",E=>{let T=Ke(),x=tt();return c.cs.getEntries(E,f).next(R=>{T=R,T.forEach((A,D)=>{D.isValidDocument()||(x=x.add(A))})}).next(()=>c.localDocuments.getOverlayedDocuments(E,T)).next(R=>{m=R;const A=[];for(const D of l){const N=L0(D,m.get(D.key).overlayedDocument);N!=null&&A.push(new An(D.key,N,Ah(N.value.mapValue),ae.exists(!0)))}return c.mutationQueue.addMutationBatch(E,d,A,l)}).next(R=>{v=R;const A=R.applyToLocalDocumentSet(m,x);return c.documentOverlayCache.saveOverlays(E,R.batchId,A)})}).then(()=>({batchId:v.batchId,changes:Oh(m)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(s.batchId),function(a,l,c){let d=a.Ba[a.currentUser.toKey()];d||(d=new vt(st)),d=d.insert(l,c),a.Ba[a.currentUser.toKey()]=d}(r,s.batchId,e),await Xs(r,s.changes),await wo(r.remoteStore)}catch(s){const i=Pl(s,"Failed to persist write");e.reject(i)}}async function _f(n,t){const e=K(n);try{const r=await R_(e.localStore,t);t.targetChanges.forEach((s,i)=>{const a=e.Na.get(i);a&&(lt(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?a.va=!0:s.modifiedDocuments.size>0?lt(a.va):s.removedDocuments.size>0&&(lt(a.va),a.va=!1))}),await Xs(e,r,t)}catch(r){await Ys(r)}}function Xu(n,t,e){const r=K(n);if(r.isPrimaryClient&&e===0||!r.isPrimaryClient&&e===1){const s=[];r.Fa.forEach((i,a)=>{const l=a.view.Z_(t);l.snapshot&&s.push(l.snapshot)}),function(a,l){const c=K(a);c.onlineState=l;let d=!1;c.queries.forEach((f,m)=>{for(const v of m.j_)v.Z_(l)&&(d=!0)}),d&&Cl(c)}(r.eventManager,t),s.length&&r.Ca.d_(s),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function pw(n,t,e){const r=K(n);r.sharedClientState.updateQueryState(t,"rejected",e);const s=r.Na.get(t),i=s&&s.key;if(i){let a=new vt(q.comparator);a=a.insert(i,Qt.newNoDocument(i,G.min()));const l=tt().add(i),c=new yo(G.min(),new Map,new vt(st),a,l);await _f(r,c),r.Oa=r.Oa.remove(i),r.Na.delete(t),kl(r)}else await La(r.localStore,t,!1).then(()=>Oa(r,t,e)).catch(Ys)}async function mw(n,t){const e=K(n),r=t.batch.batchId;try{const s=await x_(e.localStore,t);Ef(e,r,null),wf(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await Xs(e,s)}catch(s){await Ys(s)}}async function gw(n,t,e){const r=K(n);try{const s=await function(a,l){const c=K(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return c.mutationQueue.lookupMutationBatch(d,l).next(m=>(lt(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>c.localDocuments.getDocuments(d,f))})}(r.localStore,t);Ef(r,t,e),wf(r,t),r.sharedClientState.updateMutationState(t,"rejected",e),await Xs(r,s)}catch(s){await Ys(s)}}function wf(n,t){(n.ka.get(t)||[]).forEach(e=>{e.resolve()}),n.ka.delete(t)}function Ef(n,t,e){const r=K(n);let s=r.Ba[r.currentUser.toKey()];if(s){const i=s.get(t);i&&(e?i.reject(e):i.resolve(),s=s.remove(t)),r.Ba[r.currentUser.toKey()]=s}}function Oa(n,t,e=null){n.sharedClientState.removeLocalQueryTarget(t);for(const r of n.Ma.get(t))n.Fa.delete(r),e&&n.Ca.$a(r,e);n.Ma.delete(t),n.isPrimaryClient&&n.La.gr(t).forEach(r=>{n.La.containsKey(r)||bf(n,r)})}function bf(n,t){n.xa.delete(t.path.canonicalString());const e=n.Oa.get(t);e!==null&&(Il(n.remoteStore,e),n.Oa=n.Oa.remove(t),n.Na.delete(e),kl(n))}function Zu(n,t,e){for(const r of e)r instanceof gf?(n.La.addReference(r.key,t),yw(n,r)):r instanceof yf?(z("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,t),n.La.containsKey(r.key)||bf(n,r.key)):Y()}function yw(n,t){const e=t.key,r=e.path.canonicalString();n.Oa.get(e)||n.xa.has(r)||(z("SyncEngine","New document in limbo: "+e),n.xa.add(r),kl(n))}function kl(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const t=n.xa.values().next().value;n.xa.delete(t);const e=new q(pt.fromString(t)),r=n.qa.next();n.Na.set(r,new ow(e)),n.Oa=n.Oa.insert(e,r),af(n.remoteStore,new fn(Re(ml(e.path)),r,"TargetPurposeLimboResolution",cl.oe))}}async function Xs(n,t,e){const r=K(n),s=[],i=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((l,c)=>{a.push(r.Ka(c,t,e).then(d=>{var f;if((d||e)&&r.isPrimaryClient){const m=d?!d.fromCache:(f=e==null?void 0:e.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){s.push(d);const m=Tl.Wi(c.targetId,d);i.push(m)}}))}),await Promise.all(a),r.Ca.d_(s),await async function(c,d){const f=K(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>L.forEach(d,v=>L.forEach(v.$i,E=>f.persistence.referenceDelegate.addReference(m,v.targetId,E)).next(()=>L.forEach(v.Ui,E=>f.persistence.referenceDelegate.removeReference(m,v.targetId,E)))))}catch(m){if(!Gs(m))throw m;z("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const v=m.targetId;if(!m.fromCache){const E=f.os.get(v),T=E.snapshotVersion,x=E.withLastLimboFreeSnapshotVersion(T);f.os=f.os.insert(v,x)}}}(r.localStore,i))}async function vw(n,t){const e=K(n);if(!e.currentUser.isEqual(t)){z("SyncEngine","User change. New user:",t.toKey());const r=await nf(e.localStore,t);e.currentUser=t,function(i,a){i.ka.forEach(l=>{l.forEach(c=>{c.reject(new U(M.CANCELLED,a))})}),i.ka.clear()}(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await Xs(e,r.hs)}}function _w(n,t){const e=K(n),r=e.Na.get(t);if(r&&r.va)return tt().add(r.key);{let s=tt();const i=e.Ma.get(t);if(!i)return s;for(const a of i){const l=e.Fa.get(a);s=s.unionWith(l.view.Va)}return s}}function Tf(n){const t=K(n);return t.remoteStore.remoteSyncer.applyRemoteEvent=_f.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=_w.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=pw.bind(null,t),t.Ca.d_=nw.bind(null,t.eventManager),t.Ca.$a=rw.bind(null,t.eventManager),t}function ww(n){const t=K(n);return t.remoteStore.remoteSyncer.applySuccessfulWrite=mw.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=gw.bind(null,t),t}class no{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=vo(t.databaseInfo.databaseId),this.sharedClientState=this.Wa(t),this.persistence=this.Ga(t),await this.persistence.start(),this.localStore=this.za(t),this.gcScheduler=this.ja(t,this.localStore),this.indexBackfillerScheduler=this.Ha(t,this.localStore)}ja(t,e){return null}Ha(t,e){return null}za(t){return A_(this.persistence,new I_,t.initialUser,this.serializer)}Ga(t){return new E_(bl.Zr,this.serializer)}Wa(t){return new M_}async terminate(){var t,e;(t=this.gcScheduler)===null||t===void 0||t.stop(),(e=this.indexBackfillerScheduler)===null||e===void 0||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}no.provider={build:()=>new no};class Ba{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Xu(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=vw.bind(null,this.syncEngine),await Z_(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new ew}()}createDatastore(t){const e=vo(t.databaseInfo.databaseId),r=function(i){return new O_(i)}(t.databaseInfo);return function(i,a,l,c){return new U_(i,a,l,c)}(t.authCredentials,t.appCheckCredentials,r,e)}createRemoteStore(t){return function(r,s,i,a,l){return new $_(r,s,i,a,l)}(this.localStore,this.datastore,t.asyncQueue,e=>Xu(this.syncEngine,e,0),function(){return Yu.D()?new Yu:new N_}())}createSyncEngine(t,e){return function(s,i,a,l,c,d,f){const m=new aw(s,i,a,l,c,d);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await async function(s){const i=K(s);z("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await Js(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(t=this.datastore)===null||t===void 0||t.terminate(),(e=this.eventManager)===null||e===void 0||e.terminate()}}Ba.provider={build:()=>new Ba};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class If{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ya(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ya(this.observer.error,t):Ge("Uncaught Error in snapshot listener:",t.toString()))}Za(){this.muted=!0}Ya(t,e){setTimeout(()=>{this.muted||t(e)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ew{constructor(t,e,r,s,i){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=r,this.databaseInfo=s,this.user=Kt.UNAUTHENTICATED,this.clientId=Th.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,async a=>{z("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(z("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new He;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const r=Pl(e,"Failed to shutdown persistence");t.reject(r)}}),t.promise}}async function aa(n,t){n.asyncQueue.verifyOperationInProgress(),z("FirestoreClient","Initializing OfflineComponentProvider");const e=n.configuration;await t.initialize(e);let r=e.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await nf(t.localStore,s),r=s)}),t.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=t}async function td(n,t){n.asyncQueue.verifyOperationInProgress();const e=await bw(n);z("FirestoreClient","Initializing OnlineComponentProvider"),await t.initialize(e,n.configuration),n.setCredentialChangeListener(r=>Gu(t.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>Gu(t.remoteStore,s)),n._onlineComponents=t}async function bw(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){z("FirestoreClient","Using user provided OfflineComponentProvider");try{await aa(n,n._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!function(s){return s.name==="FirebaseError"?s.code===M.FAILED_PRECONDITION||s.code===M.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(e))throw e;Vr("Error using user provided cache. Falling back to memory cache: "+e),await aa(n,new no)}}else z("FirestoreClient","Using default OfflineComponentProvider"),await aa(n,new no);return n._offlineComponents}async function Sf(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(z("FirestoreClient","Using user provided OnlineComponentProvider"),await td(n,n._uninitializedComponentsProvider._online)):(z("FirestoreClient","Using default OnlineComponentProvider"),await td(n,new Ba))),n._onlineComponents}function Tw(n){return Sf(n).then(t=>t.syncEngine)}async function Af(n){const t=await Sf(n),e=t.eventManager;return e.onListen=lw.bind(null,t.syncEngine),e.onUnlisten=dw.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=cw.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=hw.bind(null,t.syncEngine),e}function Iw(n,t,e={}){const r=new He;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new If({next:v=>{f.Za(),a.enqueueAndForget(()=>pf(i,m));const E=v.docs.has(l);!E&&v.fromCache?d.reject(new U(M.UNAVAILABLE,"Failed to get document because the client is offline.")):E&&v.fromCache&&c&&c.source==="server"?d.reject(new U(M.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(v)},error:v=>d.reject(v)}),m=new mf(ml(l.path),f,{includeMetadataChanges:!0,_a:!0});return ff(i,m)}(await Af(n),n.asyncQueue,t,e,r)),r.promise}function Sw(n,t,e={}){const r=new He;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new If({next:v=>{f.Za(),a.enqueueAndForget(()=>pf(i,m)),v.fromCache&&c.source==="server"?d.reject(new U(M.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(v)},error:v=>d.reject(v)}),m=new mf(l,f,{includeMetadataChanges:!0,_a:!0});return ff(i,m)}(await Af(n),n.asyncQueue,t,e,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xf(n){const t={};return n.timeoutSeconds!==void 0&&(t.timeoutSeconds=n.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ed=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rf(n,t,e){if(!e)throw new U(M.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${t}.`)}function Aw(n,t,e,r){if(t===!0&&r===!0)throw new U(M.INVALID_ARGUMENT,`${n} and ${e} cannot be used together.`)}function nd(n){if(!q.isDocumentKey(n))throw new U(M.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function rd(n){if(q.isDocumentKey(n))throw new U(M.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Eo(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const t=function(r){return r.constructor?r.constructor.name:null}(n);return t?`a custom ${t} object`:"an object"}}return typeof n=="function"?"a function":Y()}function Qe(n,t){if("_delegate"in n&&(n=n._delegate),!(n instanceof t)){if(t.name===n.constructor.name)throw new U(M.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=Eo(n);throw new U(M.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return n}function xw(n,t){if(t<=0)throw new U(M.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${t}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sd{constructor(t){var e,r;if(t.host===void 0){if(t.ssl!==void 0)throw new U(M.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=t.host,this.ssl=(e=t.ssl)===null||e===void 0||e;if(this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<1048576)throw new U(M.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}Aw("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=xf((r=t.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class bo{constructor(t,e,r,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new sd({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new U(M.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new U(M.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new sd(t),t.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new jv;switch(r.type){case"firstParty":return new Gv(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new U(M.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const r=ed.get(e);r&&(z("ComponentProvider","Removing Datastore"),ed.delete(e),r.terminate())}(this),Promise.resolve()}}function Rw(n,t,e,r={}){var s;const i=(n=Qe(n,bo))._getSettings(),a=`${t}:${e}`;if(i.host!=="firestore.googleapis.com"&&i.host!==a&&Vr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},i),{host:a,ssl:!1})),r.mockUserToken){let l,c;if(typeof r.mockUserToken=="string")l=r.mockUserToken,c=Kt.MOCK_USER;else{l=Zp(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new U(M.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new Kt(d)}n._authCredentials=new Hv(new bh(l,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(t,e,r){this.converter=e,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new xn(this.firestore,t,this._query)}}class re{constructor(t,e,r){this.converter=e,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new vn(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new re(this.firestore,t,this._key)}}class vn extends xn{constructor(t,e,r){super(t,e,ml(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new re(this.firestore,null,new q(t))}withConverter(t){return new vn(this.firestore,t,this._path)}}function Pw(n,t,...e){if(n=Pt(n),Rf("collection","path",t),n instanceof bo){const r=pt.fromString(t,...e);return rd(r),new vn(n,null,r)}{if(!(n instanceof re||n instanceof vn))throw new U(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(pt.fromString(t,...e));return rd(r),new vn(n.firestore,null,r)}}function Dr(n,t,...e){if(n=Pt(n),arguments.length===1&&(t=Th.newId()),Rf("doc","path",t),n instanceof bo){const r=pt.fromString(t,...e);return nd(r),new re(n,null,new q(r))}{if(!(n instanceof re||n instanceof vn))throw new U(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(pt.fromString(t,...e));return nd(r),new re(n.firestore,n instanceof vn?n.converter:null,new q(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class id{constructor(t=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new sf(this,"async_queue_retry"),this.Vu=()=>{const r=oa();r&&z("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=t;const e=oa();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.fu(),this.gu(t)}enterRestrictedMode(t){if(!this.Iu){this.Iu=!0,this.Au=t||!1;const e=oa();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.Vu)}}enqueue(t){if(this.fu(),this.Iu)return new Promise(()=>{});const e=new He;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Pu.push(t),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(t){if(!Gs(t))throw t;z("AsyncQueue","Operation failed with retryable error: "+t)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(t){const e=this.mu.then(()=>(this.du=!0,t().catch(r=>{this.Eu=r,this.du=!1;const s=function(a){let l=a.message||"";return a.stack&&(l=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),l}(r);throw Ge("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=e,e}enqueueAfterDelay(t,e,r){this.fu(),this.Ru.indexOf(t)>-1&&(e=0);const s=Rl.createAndSchedule(this,t,e,r,i=>this.yu(i));return this.Tu.push(s),s}fu(){this.Eu&&Y()}verifyOperationInProgress(){}async wu(){let t;do t=this.mu,await t;while(t!==this.mu)}Su(t){for(const e of this.Tu)if(e.timerId===t)return!0;return!1}bu(t){return this.wu().then(()=>{this.Tu.sort((e,r)=>e.targetTimeMs-r.targetTimeMs);for(const e of this.Tu)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.wu()})}Du(t){this.Ru.push(t)}yu(t){const e=this.Tu.indexOf(t);this.Tu.splice(e,1)}}class Qr extends bo{constructor(t,e,r,s){super(t,e,r,s),this.type="firestore",this._queue=new id,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new id(t),this._firestoreClient=void 0,await t}}}function Cw(n,t){const e=typeof n=="object"?n:Nd(),r=typeof n=="string"?n:"(default)",s=Qa(e,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=Jp("firestore");i&&Rw(s,...i)}return s}function To(n){if(n._terminated)throw new U(M.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||kw(n),n._firestoreClient}function kw(n){var t,e,r;const s=n._freezeSettings(),i=function(l,c,d,f){return new a0(l,c,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,xf(f.experimentalLongPollingOptions),f.useFetchStreams)}(n._databaseId,((t=n._app)===null||t===void 0?void 0:t.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((e=s.localCache)===null||e===void 0)&&e._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new Ew(n._authCredentials,n._appCheckCredentials,n._queue,i,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $r{constructor(t){this._byteString=t}static fromBase64String(t){try{return new $r(Ht.fromBase64String(t))}catch(e){throw new U(M.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new $r(Ht.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new U(M.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new qt(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dl{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ml{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new U(M.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new U(M.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(t){return st(this._lat,t._lat)||st(this._long,t._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nl{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0}(this._values,t._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dw=/^__.*__$/;class Mw{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return this.fieldMask!==null?new An(t,this.data,this.fieldMask,e,this.fieldTransforms):new Ks(t,this.data,e,this.fieldTransforms)}}class Pf{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return new An(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function Cf(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Y()}}class Ll{constructor(t,e,r,s,i,a){this.settings=t,this.databaseId=e,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(t){return new Ll(Object.assign(Object.assign({},this.settings),t),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(t){var e;const r=(e=this.path)===null||e===void 0?void 0:e.child(t),s=this.Fu({path:r,xu:!1});return s.Ou(t),s}Nu(t){var e;const r=(e=this.path)===null||e===void 0?void 0:e.child(t),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(t){return this.Fu({path:void 0,xu:!0})}Bu(t){return ro(t,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}vu(){if(this.path)for(let t=0;t<this.path.length;t++)this.Ou(this.path.get(t))}Ou(t){if(t.length===0)throw this.Bu("Document fields must not be empty");if(Cf(this.Cu)&&Dw.test(t))throw this.Bu('Document fields cannot begin and end with "__"')}}class Nw{constructor(t,e,r){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=r||vo(t)}Qu(t,e,r,s=!1){return new Ll({Cu:t,methodName:e,qu:r,path:qt.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function So(n){const t=n._freezeSettings(),e=vo(n._databaseId);return new Nw(n._databaseId,!!t.ignoreUndefinedProperties,e)}function Vl(n,t,e,r,s,i={}){const a=n.Qu(i.merge||i.mergeFields?2:0,t,e,s);Ol("Data must be an object, but it was:",a,r);const l=kf(r,a);let c,d;if(i.merge)c=new oe(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const v=Fa(t,m,e);if(!a.contains(v))throw new U(M.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);Mf(f,v)||f.push(v)}c=new oe(f),d=a.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=a.fieldTransforms;return new Mw(new ee(l),c,d)}class Ao extends Dl{_toFieldTransform(t){if(t.Cu!==2)throw t.Cu===1?t.Bu(`${this._methodName}() can only appear at the top level of your update data`):t.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof Ao}}function Lw(n,t,e,r){const s=n.Qu(1,t,e);Ol("Data must be an object, but it was:",s,r);const i=[],a=ee.empty();tr(r,(c,d)=>{const f=Bl(t,c,e);d=Pt(d);const m=s.Nu(f);if(d instanceof Ao)i.push(f);else{const v=Zs(d,m);v!=null&&(i.push(f),a.set(f,v))}});const l=new oe(i);return new Pf(a,l,s.fieldTransforms)}function Vw(n,t,e,r,s,i){const a=n.Qu(1,t,e),l=[Fa(t,r,e)],c=[s];if(i.length%2!=0)throw new U(M.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let v=0;v<i.length;v+=2)l.push(Fa(t,i[v])),c.push(i[v+1]);const d=[],f=ee.empty();for(let v=l.length-1;v>=0;--v)if(!Mf(d,l[v])){const E=l[v];let T=c[v];T=Pt(T);const x=a.Nu(E);if(T instanceof Ao)d.push(E);else{const R=Zs(T,x);R!=null&&(d.push(E),f.set(E,R))}}const m=new oe(d);return new Pf(f,m,a.fieldTransforms)}function Ow(n,t,e,r=!1){return Zs(e,n.Qu(r?4:3,t))}function Zs(n,t){if(Df(n=Pt(n)))return Ol("Unsupported field value:",t,n),kf(n,t);if(n instanceof Dl)return function(r,s){if(!Cf(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(n,t),null;if(n===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),n instanceof Array){if(t.settings.xu&&t.Cu!==4)throw t.Bu("Nested arrays are not supported");return function(r,s){const i=[];let a=0;for(const l of r){let c=Zs(l,s.Lu(a));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),a++}return{arrayValue:{values:i}}}(n,t)}return function(r,s){if((r=Pt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return P0(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=Mt.fromDate(r);return{timestampValue:to(s.serializer,i)}}if(r instanceof Mt){const i=new Mt(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:to(s.serializer,i)}}if(r instanceof Ml)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof $r)return{bytesValue:Kh(s.serializer,r._byteString)};if(r instanceof re){const i=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(i))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:wl(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Nl)return function(a,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return gl(l.serializer,c)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${Eo(r)}`)}(n,t)}function kf(n,t){const e={};return Ih(n)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):tr(n,(r,s)=>{const i=Zs(s,t.Mu(r));i!=null&&(e[r]=i)}),{mapValue:{fields:e}}}function Df(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Mt||n instanceof Ml||n instanceof $r||n instanceof re||n instanceof Dl||n instanceof Nl)}function Ol(n,t,e){if(!Df(e)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(e)){const r=Eo(e);throw r==="an object"?t.Bu(n+" a custom object"):t.Bu(n+" "+r)}}function Fa(n,t,e){if((t=Pt(t))instanceof Io)return t._internalPath;if(typeof t=="string")return Bl(n,t);throw ro("Field path arguments must be of type string or ",n,!1,void 0,e)}const Bw=new RegExp("[~\\*/\\[\\]]");function Bl(n,t,e){if(t.search(Bw)>=0)throw ro(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,e);try{return new Io(...t.split("."))._internalPath}catch{throw ro(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,e)}}function ro(n,t,e,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let l=`Function ${t}() called with invalid data`;e&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(i||a)&&(c+=" (found",i&&(c+=` in field ${r}`),a&&(c+=` in document ${s}`),c+=")"),new U(M.INVALID_ARGUMENT,l+n+c)}function Mf(n,t){return n.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nf{constructor(t,e,r,s,i){this._firestore=t,this._userDataWriter=e,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new re(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new Fw(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(xo("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class Fw extends Nf{data(){return super.data()}}function xo(n,t){return typeof t=="string"?Bl(n,t):t instanceof Io?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uw(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new U(M.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Fl{}class Ul extends Fl{}function xs(n,t,...e){let r=[];t instanceof Fl&&r.push(t),r=r.concat(e),function(i){const a=i.filter(c=>c instanceof $l).length,l=i.filter(c=>c instanceof Ro).length;if(a>1||a>0&&l>0)throw new U(M.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)n=s._apply(n);return n}class Ro extends Ul{constructor(t,e,r){super(),this._field=t,this._op=e,this._value=r,this.type="where"}static _create(t,e,r){return new Ro(t,e,r)}_apply(t){const e=this._parse(t);return Lf(t._query,e),new xn(t.firestore,t.converter,Ca(t._query,e))}_parse(t){const e=So(t.firestore);return function(i,a,l,c,d,f,m){let v;if(d.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new U(M.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){ld(m,f);const E=[];for(const T of m)E.push(ad(c,i,T));v={arrayValue:{values:E}}}else v=ad(c,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||ld(m,f),v=Ow(l,a,m,f==="in"||f==="not-in");return Rt.create(d,f,v)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}function zl(n,t,e){const r=t,s=xo("where",n);return Ro._create(s,r,e)}class $l extends Fl{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new $l(t,e)}_parse(t){const e=this._queryConstraints.map(r=>r._parse(t)).filter(r=>r.getFilters().length>0);return e.length===1?e[0]:Ee.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:(function(s,i){let a=s;const l=i.getFlattenedFilters();for(const c of l)Lf(a,c),a=Ca(a,c)}(t._query,e),new xn(t.firestore,t.converter,Ca(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class ql extends Ul{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new ql(t,e)}_apply(t){const e=function(s,i,a){if(s.startAt!==null)throw new U(M.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new U(M.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Os(i,a)}(t._query,this._field,this._direction);return new xn(t.firestore,t.converter,function(s,i){const a=s.explicitOrderBy.concat([i]);return new Yr(s.path,s.collectionGroup,a,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(t._query,e))}}function od(n,t="asc"){const e=t,r=xo("orderBy",n);return ql._create(r,e)}class jl extends Ul{constructor(t,e,r){super(),this.type=t,this._limit=e,this._limitType=r}static _create(t,e,r){return new jl(t,e,r)}_apply(t){return new xn(t.firestore,t.converter,Ji(t._query,this._limit,this._limitType))}}function zw(n){return xw("limit",n),jl._create("limit",n,"F")}function ad(n,t,e){if(typeof(e=Pt(e))=="string"){if(e==="")throw new U(M.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Mh(t)&&e.indexOf("/")!==-1)throw new U(M.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const r=t.path.child(pt.fromString(e));if(!q.isDocumentKey(r))throw new U(M.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Ru(n,new q(r))}if(e instanceof re)return Ru(n,e._key);throw new U(M.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Eo(e)}.`)}function ld(n,t){if(!Array.isArray(n)||n.length===0)throw new U(M.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Lf(n,t){const e=function(s,i){for(const a of s)for(const l of a.getFlattenedFilters())if(i.indexOf(l.op)>=0)return l.op;return null}(n.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(e!==null)throw e===t.op?new U(M.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new U(M.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}class $w{convertValue(t,e="none"){switch(Xn(t)){case 0:return null;case 1:return t.booleanValue;case 2:return Tt(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(Jn(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw Y()}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const r={};return tr(t,(s,i)=>{r[s]=this.convertValue(i,e)}),r}convertVectorValue(t){var e,r,s;const i=(s=(r=(e=t.fields)===null||e===void 0?void 0:e.value.arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map(a=>Tt(a.doubleValue));return new Nl(i)}convertGeoPoint(t){return new Ml(Tt(t.latitude),Tt(t.longitude))}convertArray(t,e){return(t.values||[]).map(r=>this.convertValue(r,e))}convertServerTimestamp(t,e){switch(e){case"previous":const r=dl(t);return r==null?null:this.convertValue(r,e);case"estimate":return this.convertTimestamp(Ns(t));default:return null}}convertTimestamp(t){const e=bn(t);return new Mt(e.seconds,e.nanos)}convertDocumentKey(t,e){const r=pt.fromString(t);lt(ef(r));const s=new Ls(r.get(1),r.get(3)),i=new q(r.popFirst(5));return s.isEqual(e)||Ge(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hl(n,t,e){let r;return r=n?e&&(e.merge||e.mergeFields)?n.toFirestore(t,e):n.toFirestore(t):t,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Es{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Vf extends Nf{constructor(t,e,r,s,i,a){super(t,e,r,s,a),this._firestore=t,this._firestoreImpl=t,this.metadata=i}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Oi(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const r=this._document.data.field(xo("DocumentSnapshot.get",t));if(r!==null)return this._userDataWriter.convertValue(r,e.serverTimestamps)}}}class Oi extends Vf{data(t={}){return super.data(t)}}class qw{constructor(t,e,r,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new Es(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach(r=>{t.call(e,new Oi(this._firestore,this._userDataWriter,r.key,r,new Es(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new U(M.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(l=>{const c=new Oi(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Es(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const c=new Oi(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Es(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,f=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),f=a.indexOf(l.doc.key)),{type:jw(l.type),doc:c,oldIndex:d,newIndex:f}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}}function jw(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Y()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Of(n){n=Qe(n,re);const t=Qe(n.firestore,Qr);return Iw(To(t),n._key).then(e=>Ww(t,n,e))}class Bf extends $w{constructor(t){super(),this.firestore=t}convertBytes(t){return new $r(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new re(this.firestore,null,e)}}function Po(n){n=Qe(n,xn);const t=Qe(n.firestore,Qr),e=To(t),r=new Bf(t);return Uw(n._query),Sw(e,n._query).then(s=>new qw(t,r,n,s))}function Wl(n,t,e){n=Qe(n,re);const r=Qe(n.firestore,Qr),s=Hl(n.converter,t,e);return Yl(r,[Vl(So(r),"setDoc",n._key,s,n.converter!==null,e).toMutation(n._key,ae.none())])}function Hw(n,t){const e=Qe(n.firestore,Qr),r=Dr(n),s=Hl(n.converter,t);return Yl(e,[Vl(So(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,ae.exists(!1))]).then(()=>r)}function Yl(n,t){return function(r,s){const i=new He;return r.asyncQueue.enqueueAndForget(async()=>fw(await Tw(r),s,i)),i.promise}(To(n),t)}function Ww(n,t,e){const r=e.docs.get(t._key),s=new Bf(n);return new Vf(n,s,t._key,r,new Es(e.hasPendingWrites,e.fromCache),t.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yw{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=So(t)}set(t,e,r){this._verifyNotCommitted();const s=la(t,this._firestore),i=Hl(s.converter,e,r),a=Vl(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,ae.none())),this}update(t,e,r,...s){this._verifyNotCommitted();const i=la(t,this._firestore);let a;return a=typeof(e=Pt(e))=="string"||e instanceof Io?Vw(this._dataReader,"WriteBatch.update",i._key,e,r,s):Lw(this._dataReader,"WriteBatch.update",i._key,e),this._mutations.push(a.toMutation(i._key,ae.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=la(t,this._firestore);return this._mutations=this._mutations.concat(new yl(e._key,ae.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new U(M.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function la(n,t){if((n=Pt(n)).firestore!==t)throw new U(M.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function so(n){return To(n=Qe(n,Qr)),new Yw(n,t=>Yl(n,t))}(function(t,e=!0){(function(s){Wr=s})(jr),Nr(new Yn("firestore",(r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),l=new Qr(new Wv(r.getProvider("auth-internal")),new Qv(r.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new U(M.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ls(d.options.projectId,f)}(a,s),a);return i=Object.assign({useFetchStreams:e},i),l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),yn(Tu,"4.7.3",t),yn(Tu,"4.7.3","esm2017")})();const Ff={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85",measurementId:"G-80XX542QZE"};function Ct(){return Ff.apiKey!=="YOUR_API_KEY"}let ca=null,le=null,ne=null;try{Ct()?(ca=Md(Ff),le=$v(ca),ne=Cw(ca)):console.warn("Firebase not configured. Login required to save data.")}catch(n){console.error("Firebase initialization error:",n)}const Gw=new Ue;let hn=null,Rs=[];function Kw(){if(!Ct()||!le){console.warn("Firebase not configured - auth disabled");return}Cy(le,n=>{console.log("onAuthStateChanged fired:",n?n.email:"null"),hn=n,console.log("Notifying",Rs.length,"listeners"),Rs.forEach(t=>t(n))})}function Qw(n){return console.log("onAuthStateChange: adding listener, currentUser is:",hn&&hn.email),Rs.push(n),hn&&(console.log("onAuthStateChange: immediately calling listener with user"),n(hn)),()=>{Rs=Rs.filter(t=>t!==n)}}function ti(){return hn}function me(){return hn!==null}async function Jw(n,t,e=null){if(!Ct()||!le)throw new Error("Firebase not configured");const r=await Iy(le,n,t);return e&&r.user&&await xy(r.user,{displayName:e}),r}async function Xw(n,t){if(!Ct()||!le)throw new Error("Firebase not configured");return Sy(le,n,t)}async function Zw(){if(!Ct()||!le)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const n=await Jy(le,Gw);return console.log("Google sign-in successful:",n.user.email),n}catch(n){throw console.error("signInWithPopup error:",n.code,n.message),n}}async function Uf(){if(!Ct()||!le)throw new Error("Firebase not configured");return ky(le)}async function tE(n){if(!Ct()||!le)throw new Error("Firebase not configured");return Ty(le,n)}Kw();function Co(n,t="settings"){const e=ti();return!e||!ne?null:Dr(ne,"users",e.uid,n,t)}function ko(n){const t=ti();return!t||!ne?null:Pw(ne,"users",t.uid,n)}async function zf(){if(!Ct())return null;const n=Co("decision");if(!n)return null;try{const t=await Of(n);return t.exists()?t.data():null}catch(t){return console.error("Error loading decision data:",t),null}}async function eE(n){if(!Ct())return;const t=Co("decision");if(t)try{await Wl(t,{...n,lastModified:new Date().toISOString()},{merge:!0})}catch(e){throw console.error("Error saving decision data:",e),e}}async function Gl(n={}){if(!Ct())return[];const t=ko("history");if(!t)return[];try{let e=xs(t,od("date",n.sortDesc?"desc":"asc"));n.taxYear&&(e=xs(t,zl("taxYear","==",n.taxYear),od("date",n.sortDesc?"desc":"asc"))),n.limit&&(e=xs(e,zw(n.limit)));const r=await Po(e),s=[];return r.forEach(i=>{s.push({id:i.id,...i.data()})}),s}catch(e){return console.error("Error loading decision history:",e),[]}}async function nE(n){if(!Ct())return null;const t=ko("history");if(!t)return null;try{const e=xs(t,zl("date","==",n.date)),r=await Po(e);if(!r.empty){const i=r.docs[0].id;return await Wl(Dr(ne,"users",ti().uid,"history",i),{...n,updatedAt:new Date().toISOString()}),i}return(await Hw(t,{...n,createdAt:new Date().toISOString()})).id}catch(e){throw console.error("Error adding history record:",e),e}}async function rE(n){if(!Ct())return;const t=ko("history");if(t)try{const e=xs(t,zl("date","==",n)),r=await Po(e),s=so(ne);r.forEach(i=>{s.delete(i.ref)}),await s.commit()}catch(e){throw console.error("Error deleting history record:",e),e}}async function sE(){if(!Ct())return;const n=ko("history");if(n)try{const t=await Po(n),e=500,r=[];let s=so(ne),i=0;t.forEach(a=>{s.delete(a.ref),i++,i>=e&&(r.push(s),s=so(ne),i=0)}),i>0&&r.push(s),await Promise.all(r.map(a=>a.commit()))}catch(t){throw console.error("Error clearing history:",t),t}}async function iE(){if(!Ct())return null;const n=Co("stress");if(!n)return null;try{const t=await Of(n);return t.exists()?t.data():null}catch(t){return console.error("Error loading stress data:",t),null}}async function $f(n){if(!Ct())return;const t=Co("stress");if(t)try{await Wl(t,{...n,lastModified:new Date().toISOString()},{merge:!0})}catch(e){throw console.error("Error saving stress data:",e),e}}async function oE(){if(!Ct())return;const n=ti();if(!(!n||!ne))try{await sE();const t=so(ne);t.delete(Dr(ne,"users",n.uid,"decision","settings")),t.delete(Dr(ne,"users",n.uid,"stress","settings")),t.delete(Dr(ne,"users",n.uid,"profile","settings")),await t.commit(),console.log("All user data wiped successfully")}catch(t){throw console.error("Error wiping user data:",t),t}}async function aE(){if(!Ct())return!1;const n=await zf(),t=await Gl({limit:1});return n!==null||t.length>0}let Jt=null,jn=null;const qf=5e3;function Bi(){return{settings:{equityMin:te.EQUITY_MIN,bondMin:te.BOND_MIN,cashTarget:te.CASH_TARGET,duration:te.DURATION_YEARS,baseSalary:te.BASE_SALARY,protectionFactor:te.PROTECTION_FACTOR,recoveryBuffer:te.RECOVERY_BUFFER,consecutiveLimit:te.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function ei(){return Ct()&&me()}function lE(){Jt=null,jn=null}function jf(){return Jt&&jn&&Date.now()-jn<qf?Jt:Bi()}async function nr(){if(Jt&&jn&&Date.now()-jn<qf)return Jt;if(!ei())return console.warn("Firebase not available - returning defaults"),Bi();try{const n=await zf(),t=await Gl();if(n){const e={settings:n.settings||Bi().settings,taxYears:n.taxYears||{},history:t||[],lastModified:n.lastModified,checksum:n.checksum};return Jt=e,jn=Date.now(),e}}catch(n){console.error("Error loading from Firebase:",n)}return Bi()}async function Do(n){if(!ei())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=cE(n),await eE({settings:n.settings,taxYears:n.taxYears,lastModified:n.lastModified,checksum:n.checksum}),Jt=n,jn=Date.now()}catch(t){throw console.error("Error saving to Firebase:",t),new Error("Failed to save decision data")}}function cE(n){const t={settings:n.settings,taxYears:n.taxYears,historyCount:n.history.length,lastHistoryDate:n.history.length>0?n.history[n.history.length-1].date:null};return Id(t)}async function rr(){return(await nr()).settings}async function Kl(n){const t=await nr();t.settings={...t.settings,...n},await Do(t)}function Ql(){return{pa:ie.PERSONAL_ALLOWANCE,brl:ie.BASIC_RATE_LIMIT,hrl:ie.HIGHER_RATE_LIMIT,cpi:.04,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function uE(n){const e=jf().taxYears[n];return e||Ql()}async function Mo(n){const e=(await nr()).taxYears[n];return e||Ql()}async function sr(n,t){console.log(`saveTaxYearConfig: Saving tax year ${n}`,t);const e=await nr();e.taxYears[n]={...uE(n),...t},await Do(e),console.log(`saveTaxYearConfig: Saved tax year ${n}, yearSetupComplete=${e.taxYears[n].yearSetupComplete}`)}async function dE(n){const t=Jt||await nr(),e=(t.history||[]).filter(s=>s.taxYear===n),r=e.reduce((s,i)=>s+(i.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${n}, found ${e.length} records, total ISA used: ${r}`),console.log("recalculateIsaSavingsUsed: History records:",e.map(s=>({date:s.date,isa:s.isa}))),t.taxYears[n]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${n}, creating default`),t.taxYears[n]=Ql()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${t.taxYears[n].isaSavingsUsed}`),t.taxYears[n].isaSavingsUsed=r,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${t.taxYears[n].isaSavingsUsed}`),await Do(t),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),r}async function hE(n){const t=await Mo(n),e=t.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${n}, yearSetupComplete=${t.yearSetupComplete}, result=${e}`),e}async function Rn(){return(await nr()).taxYears}function fE(n={}){let e=[...jf().history];return n.taxYear&&(e=e.filter(r=>r.taxYear===n.taxYear)),n.startDate&&(e=e.filter(r=>r.date>=n.startDate)),n.endDate&&(e=e.filter(r=>r.date<=n.endDate)),n.sortDesc?e.sort((r,s)=>s.date.localeCompare(r.date)):e.sort((r,s)=>r.date.localeCompare(s.date)),n.limit&&(e=e.slice(0,n.limit)),e}async function Jr(n={}){if(ei())try{return await Gl(n)}catch(t){console.error("Error loading history from Firebase:",t)}return fE(n)}async function pE(n){if(!ei())throw new Error("Must be logged in to save history");if(await nE(n),Jt){const t=Jt.history.findIndex(e=>e.date===n.date);t>=0?Jt.history[t]=n:Jt.history.push(n),Jt.history.sort((e,r)=>e.date.localeCompare(r.date))}}async function Hf(n){if(!ei())throw new Error("Must be logged in to delete history");await rE(n),Jt&&(Jt.history=Jt.history.filter(t=>t.date!==n))}async function Jl(n){const t=await rr(),e=await Rn(),r=t.spStartDate,s=t.spWeeklyAmount||0;if(!r||!s){let f=null;if(r){const{formatStatePensionDate:m}=await Wc(async()=>{const{formatStatePensionDate:v}=await Promise.resolve().then(()=>cd);return{formatStatePensionDate:v}},void 0,import.meta.url);f=m(r)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:f}}const{calculateStatePensionForTaxYear:i,getTimeUntilStatePension:a,parseStatePensionDate:l}=await Wc(async()=>{const{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:v}=await Promise.resolve().then(()=>cd);return{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:v}},void 0,import.meta.url),c=i({taxYear:n,spStartDate:r,weeklyAmount:s,taxYearConfigs:e}),d=a(r);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function mE(n){const t=Cp(n);t.stdSipp=n.stdSipp||n.sippDraw,await pE(t),n.taxYear&&await dE(n.taxYear)}function No(n,t,e=0){const r=Ya(e);let s=n.equityStart,i=n.bondStart,a=n.cashStart,l=n.hodlEnabled?n.hodlStart!==void 0?n.hodlStart:n.hodlValue:0,c=0,d=null,f=0,m=0,v=0,E=0,T=!1,x=!1,R=null,A=0,D=-1;const N=[],C=[];let V=1;N.push({year:0,month:0,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:0,source:"None",inProtection:!1,equityMin:n.equityMin,bondMin:n.bondMin,cashMax:n.cashTarget});for(let O=0;O<n.years*12;O++){const b=Math.floor(O/12),g=O%12,y=g>=3?b:b-1;if(y!==D&&(A=0,D=y),O>0&&O%12===0){const ot=t.inflation[b]||.025;C.push(ot),V*=1+ot}const _=t.equity[b]||0,I=t.inflation[b]||.025,S=b>0?t.inflation[b-1]||.025:I,w=xr(n.equityMin,b,n.duration,V,!0),at=xr(n.bondMin,b,n.duration,V,!0),kt=xr(n.cashTarget,b,n.duration,V,!1),Z=yE(n,b,V,C),It=Z;let ht=T?Z*n.protectionMult:Z;T&&(A+=It-ht);const Nt=gE(I,_,S,r),ut=Math.max(.005,I+.012);if(s*=1+Math.pow(1+_,1/12)-1,i*=1+Math.pow(1+Nt,1/12)-1,a*=1+Math.pow(1+ut,1/12)-1,l>0){const ce=(r()-.5)*2*.06;let ue=0;_<-.1?ue=Math.min(.15,Math.abs(_)*.4):_<-.05&&(ue=Math.abs(_)*.2);let Vt=.069+ce+ue;Vt=Math.max(-.08,Math.min(.18,Vt)),l*=1+Math.pow(1+Vt,1/12)-1}const _t=s+i,$=w+at;T&&_t>$+5e3&&(T=!1,E=0,m=Math.max(m,v),v=0),T&&(f++,v++);let wt=0;if(!T&&A>0&&_t>$+15e3){let ot=g>=3?15-g:3-g;ot<1&&(ot=1);const Lt=_t-$-15e3,ce=Math.min(A/ot,Lt/ot),ue=It*.5;wt=Math.min(ce,ue),wt>50&&(ht+=wt,A-=wt)}let X="Growth";if(!T&&_t>=$+ht){const ot=Math.max(0,s-w),Lt=Math.max(0,i-at),ce=ot+Lt;if(ce>0){if(s-=ht*ot/ce,i-=ht*Lt/ce,E=0,X="Growth",a<kt){const ue=_t-$-ht;if(ue>5e3){const Vt=Math.min((kt-a)*.3,ue*.5);s-=Vt*ot/ce,i-=Vt*Lt/ce,a+=Vt}}}else a-=ht,X="Cash"}else if(a>=ht)a-=ht,E++,X="Cash",!n.disableProtection&&E>=n.consecutiveLimit&&(T=!0);else{const ot=ht-a;a=0,i>ot?(i-=ot,X="Bond"):s>ot?(s-=ot,X="Equity"):l>ot?(l-=ot,c+=ot,d===null&&(d=O),X="HODL"):(x=!0,R=O)}if(s=Math.max(0,s),i=Math.max(0,i),a=Math.max(0,a),(g===0||O===n.years*12-1||x)&&N.push({year:b+g/12,month:O,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:ht,boostAmount:wt,source:X,inProtection:T,equityMin:w,bondMin:at,cashMax:kt}),x)break}return m=Math.max(m,v),{failed:x,years:x?R/12:n.years,failMonth:R,final:s+i+a,finalEquity:s,finalBond:i,finalCash:a,finalHodl:l,protMonths:f,maxConsec:m,hodlUsed:c,hodlUsedMonth:d,hist:N,seed:e}}function gE(n,t,e,r){let s=.15,i=.3,a=.2,l=.1,c=.1,d=.15;const f=e!==void 0?e:n,m=f>.045,v=f>.07;if(m){const N=r()>.3?1:.5;v?(s=.15+.35*N,i=.3-.2*N,d=.15-.1*N,l=.1+.05*N):(s=.15+.2*N,i=.3-.1*N,d=.15-.05*N)}m&&r()<.15&&(s=.2,i=.25,d=.12);const E=n+.005+fs(0,.03,r),T=.04-(n>.04?(n-.04)*.5:0)+fs(0,.05,r),x=.03+n*.3+fs(0,.08,r),R=n*.8+fs(0,.15,r),A=Math.max(.005,n+.005),D=t*.5+fs(0,.02,r);return s*E+i*T+a*x+l*R+c*A+d*D}function yE(n,t,e,r){n.taxMode==="frozen"?n.pa:n.pa*e;const s=n.taxMode==="frozen"?n.brl:n.brl*e,i=n.baseSalary*e;let a=n.other;for(const f of r)a*=1+Math.min(f,.04);let l=0;if(n.spStartYear!==void 0){if(t>=n.spStartYear&&n.spWeeklyAmount>0){const f=n.spWeeklyAmount*52;t===n.spStartYear&&n.spFirstYearRatio!==void 0?l=f*n.spFirstYearRatio*e:l=f*e}}else n.statePensionYear!==void 0&&(l=t>=n.statePensionYear?(n.statePension||0)*e:0);const c=a+l;return Math.max(0,Math.min(s,i)-c)/12}function Wf(n,t=1e3){const e=Object.keys(Cs).map(Number).sort((s,i)=>s-i),r=[];for(let s=0;s<t;s++){const i=Ya(s*12345),a={equity:{},inflation:{}};for(let l=0;l<n.years;l++){const c=e[Math.floor(i()*e.length)];a.equity[l]=Cs[c],a.inflation[l]=Ha[c]||.025}r.push(No(n,a,s))}return r}function Yf(n){const t=Object.keys(Cs).map(Number).sort((s,i)=>s-i),e=Math.max(...t),r=[];for(const s of t){if(s+n.years-1>e)continue;const i={equity:{},inflation:{}};for(let l=0;l<n.years;l++)i.equity[l]=Cs[s+l]||0,i.inflation[l]=Ha[s+l]||.025;const a=No(n,i,s);a.startYear=s,r.push(a)}return r}function vE(n,t){const e={equity:{},inflation:{}};for(let r=0;r<n.years;r++)e.equity[r]=t.equity[r%t.equity.length],e.inflation[r]=t.inflation[r%t.inflation.length];return No(n,e,999)}function _E(n){const t=n.filter(e=>e.failed).length;return(n.length-t)/n.length*100}function Gf(n){const t=n.filter(l=>!l.failed),e=n.filter(l=>l.failed),r=n.map(l=>l.years).sort((l,c)=>l-c),s=t.map(l=>l.final).sort((l,c)=>l-c),i=n.map(l=>l.protMonths).sort((l,c)=>l-c),a=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:n.length,successCount:t.length,failCount:e.length,successRate:_E(n),survival:{p5:a(r,.05),p10:a(r,.1),p25:a(r,.25),p50:a(r,.5),p75:a(r,.75),p90:a(r,.9),p95:a(r,.95),min:r[0],max:r[r.length-1]},finalValue:{p5:a(s,.05),p10:a(s,.1),p25:a(s,.25),p50:a(s,.5),p75:a(s,.75),p90:a(s,.9),p95:a(s,.95),min:s[0]||0,max:s[s.length-1]||0,avg:t.reduce((l,c)=>l+c.final,0)/(t.length||1)},minYears:r[0],p10Years:a(r,.1),medianYears:a(r,.5),medianFinal:a(s,.5),p10Final:a(s,.1),p90Final:a(s,.9),avgFinal:t.reduce((l,c)=>l+c.final,0)/(t.length||1),protection:{runsWithProtection:n.filter(l=>l.protMonths>0).length,pctWithProtection:n.filter(l=>l.protMonths>0).length/n.length*100,avgMonths:i.reduce((l,c)=>l+c,0)/n.length,maxMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,p50Months:a(i,.5),p90Months:a(i,.9),p95Months:a(i,.95)},runsWithProtection:n.filter(l=>l.protMonths>0).length,avgProtMonths:i.reduce((l,c)=>l+c,0)/n.length,maxProtMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,hodl:{runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,pctUsingHodl:n.filter(l=>l.hodlUsed>0).length/n.length*100,avgUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...n.map(l=>l.hodlUsed||0))},runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,avgHodlUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...n.map(l=>l.hodlUsed||0)),failures:e.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function ni(n){if(!n)return null;const t={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},e=n.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(e)){const s=new Date(e);if(!isNaN(s.getTime()))return s}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(e)){const[s,i,a]=e.split("/").map(Number);return new Date(a,i-1,s)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(e)){const[s,i,a]=e.split("-").map(Number);return new Date(a,i-1,s)}let r=e.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(r){const s=parseInt(r[1]),i=t[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}if(r=e.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),r){const s=t[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=e.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),r){const s=t[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=e.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),r){const s=parseInt(r[1]),i=t[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}return null}function Fi(n){const t=typeof n=="string"?ni(n):n;if(!t||isNaN(t.getTime()))return"";const e=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${t.getDate()} ${e[t.getMonth()]} ${t.getFullYear()}`}function wE(n){const{taxYear:t,spStartDate:e,weeklyAmount:r,taxYearConfigs:s={}}=n;if(!e||!r||r<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const i=typeof e=="string"?ni(e):e;if(!i||isNaN(i.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const a=Wa(i);Mp(t);const l=Np(t),c=[...new Set([a,t,...Object.keys(s)])].sort(),d=c.indexOf(a),f=c.indexOf(t);if(f<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:Fi(i)};let m=1;for(let x=d;x<f;x++){const R=c[x],A=s[R],D=(A==null?void 0:A.cpi)||.025;m*=1+D}const v=r*m;if(t===a){const R=Math.max(0,(l.getTime()-i.getTime())/6048e5),A=v*R;return{annual:A,monthly:A/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(R*10)/10,startDate:Fi(i)}}const T=v*52;return{annual:T,monthly:T/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:Fi(i)}}function EE(n,t=new Date){const e=typeof n=="string"?ni(n):n;if(!e||isNaN(e.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const r=e.getTime()-t.getTime(),s=r<=0;if(s)return{years:0,months:0,totalMonths:0,isPast:!0};const i=Math.floor(r/(30.44*24*60*60*1e3)),a=Math.floor(i/12),l=i%12;return{years:a,months:l,totalMonths:i,isPast:s}}const cd=Object.freeze(Object.defineProperty({__proto__:null,calculateStatePensionForTaxYear:wE,formatStatePensionDate:Fi,getTimeUntilStatePension:EE,parseStatePensionDate:ni},Symbol.toStringTag,{value:"Module"}));let pn=null,Hn=null;const Kf=5e3;function Mr(){return{settings:{equityMin:te.EQUITY_MIN,bondMin:te.BOND_MIN,cashTarget:te.CASH_TARGET,duration:te.DURATION_YEARS,baseSalary:te.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:ie.PERSONAL_ALLOWANCE,brl:ie.BASIC_RATE_LIMIT,hrl:ie.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Qo.PROTECTION_MULTIPLIER,consecutiveLimit:te.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Qo.HODL_ENABLED,hodlValue:Qo.HODL_VALUE},lastModified:null,checksum:null}}function Xl(){return Ct()&&me()}function bE(){pn=null,Hn=null}function TE(){return pn&&Hn&&Date.now()-Hn<Kf?pn:Mr()}async function Qf(){if(pn&&Hn&&Date.now()-Hn<Kf)return pn;if(!Xl())return console.warn("Firebase not available - returning defaults"),Mr();try{const n=await iE();if(n){const t={settings:n.settings||Mr().settings,lastModified:n.lastModified,checksum:n.checksum};return pn=AE(t),Hn=Date.now(),pn}}catch(n){console.error("Error loading stress data from Firebase:",n)}return Mr()}async function IE(n){if(!Xl())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=SE(n),await $f({settings:n.settings,lastModified:n.lastModified,checksum:n.checksum}),pn=n,Hn=Date.now()}catch(t){throw console.error("Error saving stress data to Firebase:",t),new Error("Failed to save stress data")}}function SE(n){return Id(n.settings)}function AE(n){const t={...Mr()};return n.settings&&(t.settings={...t.settings,...n.settings},n.settings.pacwMin!==void 0&&n.settings.equityMin===void 0&&(t.settings.equityMin=n.settings.pacwMin),n.settings.cgtMin!==void 0&&n.settings.bondMin===void 0&&(t.settings.bondMin=n.settings.cgtMin),n.settings.csh2Target!==void 0&&n.settings.cashTarget===void 0&&(t.settings.cashTarget=n.settings.csh2Target),t.settings.hodlEnabled===void 0&&(t.settings.hodlEnabled=!1),t.settings.hodlValue===void 0&&(t.settings.hodlValue=25e3)),t.lastModified=n.lastModified,t.checksum=n.checksum,t}function xE(){return TE().settings}async function Pn(){return(await Qf()).settings}async function Zl(n){const t=await Qf();t.settings={...t.settings,...n},await IE(t)}async function RE(){if(!Xl())throw new Error("Must be logged in to reset settings");const n=Mr();await $f({settings:n.settings,lastModified:new Date().toISOString()}),bE()}function PE(n){if(!n.spStartDate||!n.spWeeklyAmount)return{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const t=ni(n.spStartDate);if(!t)return console.warn("Could not parse spStartDate:",n.spStartDate),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const e=new Date,r=365.25*24*60*60*1e3,s=Math.max(0,(t.getTime()-e.getTime())/r),i=Math.floor(s),a=365,l=Math.floor((t-new Date(t.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function tc(n={},t=null){const e=t||xE(),r=PE(e);return{equityStart:n.equityStart??e.equityMin,bondStart:n.bondStart??e.bondMin,cashStart:n.cashStart??e.cashTarget,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,years:n.years??e.duration,duration:e.duration,baseSalary:e.baseSalary,other:e.other,spStartYear:r.spStartYear,spWeeklyAmount:r.spWeeklyAmount,spFirstYearRatio:r.spFirstYearRatio,pa:e.pa,brl:e.brl,hrl:e.hrl,taxMode:e.taxMode,protectionMult:e.protectionMult,consecutiveLimit:e.consecutiveLimit,disableProtection:e.disableProtection,hodlEnabled:e.hodlEnabled,hodlValue:e.hodlValue}}function H(n,t=null){const e=Math.abs(n),r=t!==null?t:e<100,s=Math.abs(n).toLocaleString("en-GB",{minimumFractionDigits:r?2:0,maximumFractionDigits:r?2:0});return n<0?`-£${s}`:`£${s}`}function ud(n,t){const e=CE(n);t.innerHTML=e}function CE(n){var I,S,w,at,kt;const t=n,e=t.calculationDetails||{};let r="";const s=t.isTaxEfficientYear??t.taxEfficient,i=t.protectionInducedTaxEfficiency||!1,a=t.boostAmount>0;let l,c,d;if(t.inProtection?(l="warning",c="Protection Mode",d="⚡"):a?(l="boost",c="Tax Boost (Catch-up)",d="↑"):i?(l="info",c="Protection-Induced Tax Efficiency",d="↑"):s?(l="success",c="Tax-Efficient Year",d="✓"):(l="warning",c="Tax-Inefficient Year",d="!"),r+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,s&&t.yearlyIsaSavingsAllocation>0){const Z=t.cumulativeIsaSavingsUsed||0,It=t.yearlyIsaSavingsAllocation,ct=Math.max(0,It-Z),ht=It>0?Z/It*100:0;r+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(ht,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${H(Z)} of ${H(It)}</span>
        <span>Remaining: ${H(ct)}</span>
      </div>
    </div>`}if(t.alerts&&t.alerts.length>0){r+='<div class="alerts">';for(const Z of t.alerts){const It=kE(Z.severity);r+=`<div class="alert ${It}">${Z.message}</div>`}r+="</div>"}r+='<div class="recommendation-card">',r+="<h3>Monthly Recommendation</h3>",r+='<div class="draw-row primary">',r+='<span class="label">SIPP Withdrawal</span>',r+=`<span class="value">${H(t.sippDraw)}</span>`,r+="</div>",t.isaDraw>0&&(r+='<div class="draw-row">',r+='<span class="label">ISA Top-up</span>',r+=`<span class="value">${H(t.isaDraw)}</span>`,r+="</div>"),t.other>0&&(r+='<div class="draw-row muted">',r+='<span class="label">Other Pension</span>',r+=`<span class="value">${H(t.other)}</span>`,r+="</div>"),t.statePension>0&&(r+='<div class="draw-row muted">',r+='<span class="label">State Pension</span>',r+=`<span class="value">${H(t.statePension)}</span>`,r+="</div>"),r+='<div class="divider"></div>';const f=t.sippDraw+t.other+t.statePension,m=f*12,v=t.pa||12570,E=t.brl||50270;let T=0;m>v&&(m<=E?T=(m-v)*.2:T=(E-v)*.2+(m-E)*.4);const x=f-T/12+t.isaDraw;r+='<div class="draw-row total">',r+='<span class="label">Total Monthly Income</span>',r+=`<span class="value">${H(x)}</span>`,r+="</div>",t.boostAmount>0&&(r+='<div class="boost-indicator">',r+='<span class="boost-label">Includes Tax Boost:</span>',r+=`<span class="boost-value">+${H(t.boostAmount)}</span>`,r+="</div>"),r+="</div>",r+='<div class="source-card">',r+="<h4>Withdraw From</h4>",r+=`<div class="source-label ${t.source.toLowerCase()}">${t.source}</div>`,t.source==="Growth"&&(t.drawFromEquity>0||t.drawFromBond>0)&&(r+='<div class="source-breakdown">',t.drawFromEquity>0&&(r+=`<div class="source-item">Equity: ${H(t.drawFromEquity)}</div>`),t.drawFromBond>0&&(r+=`<div class="source-item">Bond: ${H(t.drawFromBond)}</div>`),r+="</div>"),r+="</div>",r+='<div class="fund-status">',r+="<h4>Fund Status</h4>";const R=t.equity+t.bond+t.cash,A=t.adjEquityMin+t.adjBondMin+t.adjCashTarget,D=R-A,N=A>0?D/A*100:0;r+='<div class="fund-grid">';const C=t.equity-t.adjEquityMin;r+=ua("Equity",t.equity,t.adjEquityMin,C);const V=t.bond-t.adjBondMin;r+=ua("Bond",t.bond,t.adjBondMin,V);const O=t.cash-t.adjCashTarget;r+=ua("Cash",t.cash,t.adjCashTarget,O),r+="</div>";const b=D>=0?"healthy":"warning";r+=`<div class="overall-status ${b}">`,r+=`<span>Total Surplus: ${H(D)}</span>`,r+=`<span>(${N.toFixed(1)}% above target)</span>`,r+="</div>",r+="</div>",r+='<div class="tax-info">',r+="<h4>Tax Summary</h4>",r+='<div class="tax-thresholds">',r+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${H(t.pa)}</span></div>`,r+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${H(t.brl)}</span></div>`,e.taxInfo&&(r+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${e.taxInfo.headroomToBRL>0?"success":"warning"}">${H(e.taxInfo.headroomToBRL)}</span></div>`),r+="</div>",r+='<div class="tax-comparison">',r+='<div class="tax-comparison-header">',r+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",r+="</div>";const g=((I=e.taxInfo)==null?void 0:I.monthlyTax)||T/12,y=t.taxPaidYTD||g,_=t.taxProjectedAnnual||((S=e.taxInfo)==null?void 0:S.annualTax)||T;if(r+='<div class="tax-comparison-row">',r+='<div class="label">Tax Paid</div>',r+=`<div>${H(g)}</div>`,r+=`<div>${H(y)}</div>`,r+=`<div>${H(_)}</div>`,r+="</div>",s||((w=e.taxInfo)==null?void 0:w.taxSavedAnnual)>0){const Z=t.taxSavedMonthly||((at=e.taxInfo)==null?void 0:at.taxSavedMonthly)||0,It=t.taxSavedYTD||Z,ct=t.taxSavedProjectedAnnual||((kt=e.taxInfo)==null?void 0:kt.taxSavedAnnual)||0;ct>0&&(r+='<div class="tax-comparison-row saved">',r+='<div class="label">Tax Saved</div>',r+=`<div class="success">-${H(Z)}</div>`,r+=`<div class="success">-${H(It)}</div>`,r+=`<div class="success">-${H(ct)}</div>`,r+="</div>")}if(r+="</div>",e.taxInfo&&typeof e.taxInfo.effectiveRate=="number"&&!isNaN(e.taxInfo.effectiveRate)){const Z=e.taxInfo.effectiveRate*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${Z<=20?"success":Z<=40?"warning":"danger"}">${Z.toFixed(1)}%</span>
    </div>`}else if(e.taxInfo&&e.taxInfo.annualTaxable>0&&e.taxInfo.annualTax>=0){const Z=e.taxInfo.annualTax/e.taxInfo.annualTaxable*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${Z<=20?"success":Z<=40?"warning":"danger"}">${Z.toFixed(1)}%</span>
    </div>`}if(r+="</div>",t.rebalanceNeeded&&t.rebalanceActions.length>0){r+='<div class="rebalance-card">',r+="<h4>Rebalancing Suggestions</h4>",r+="<ul>";for(const Z of t.rebalanceActions)r+=`<li>${Z}</li>`;r+="</ul>",r+="</div>"}return r+='<div class="mode-explanation">',r+="<h4>Why This Recommendation?</h4>",r+=`<p>${e.reason||"Standard calculation based on your settings."}</p>`,!e.hasSufficientIsa&&e.isaNeededMonthly>0&&(r+=`<p class="isa-warning">To enable tax-efficient mode, you need ${H(e.totalIsaNeeded)} in your ISA (${t.remainingMonths} months remaining in tax year).</p>`),r+="</div>",r+='<details class="debug-section">',r+="<summary>Calculation Details</summary>",r+="<pre>"+JSON.stringify(e,null,2)+"</pre>",r+="</details>",r}function ua(n,t,e,r){return`<div class="fund-cell ${r>=0?"healthy":"deficit"}">
    <div class="fund-name">${n}</div>
    <div class="fund-current">${H(t)}</div>
    <div class="fund-min">Min: ${H(e)}</div>
    <div class="fund-surplus">${r>=0?"+":""}${H(r)}</div>
  </div>`}function kE(n){switch(n){case Ti.DANGER:return"alert-danger";case Ti.WARNING:return"alert-warning";case Ti.SUCCESS:return"alert-success";case Ti.INFO:default:return"alert-info"}}function DE(){return`
    .decision-mode {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-weight: 600;
    }

    .decision-mode.success {
      background: rgba(46, 160, 67, 0.15);
      border: 1px solid rgba(46, 160, 67, 0.3);
      color: #2ea043;
    }

    .decision-mode.warning {
      background: rgba(240, 198, 116, 0.15);
      border: 1px solid rgba(240, 198, 116, 0.3);
      color: #f0c674;
    }

    .mode-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: currentColor;
      color: #1a1a2e;
      font-size: 14px;
    }

    .protection-badge {
      margin-left: auto;
      padding: 4px 10px;
      background: rgba(248, 81, 73, 0.2);
      border: 1px solid rgba(248, 81, 73, 0.4);
      border-radius: 4px;
      color: #f85149;
      font-size: 12px;
      text-transform: uppercase;
    }

    .alerts {
      margin-bottom: 20px;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .alert-danger {
      background: rgba(248, 81, 73, 0.15);
      border-left: 4px solid #f85149;
      color: #f85149;
    }

    .alert-warning {
      background: rgba(240, 198, 116, 0.15);
      border-left: 4px solid #f0c674;
      color: #f0c674;
    }

    .alert-success {
      background: rgba(46, 160, 67, 0.15);
      border-left: 4px solid #2ea043;
      color: #2ea043;
    }

    .alert-info {
      background: rgba(126, 184, 218, 0.15);
      border-left: 4px solid #7eb8da;
      color: #7eb8da;
    }

    .recommendation-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .recommendation-card h3 {
      margin: 0 0 20px 0;
      color: var(--primary);
    }

    .draw-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }

    .draw-row.primary .label {
      font-weight: 600;
      color: var(--primary);
    }

    .draw-row.primary .value {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary);
    }

    .draw-row.muted {
      color: var(--text-muted);
    }

    .draw-row.total {
      border-bottom: none;
      padding-top: 16px;
    }

    .draw-row.total .label {
      font-weight: 600;
    }

    .draw-row.total .value {
      font-size: 20px;
      font-weight: 700;
      color: var(--success);
    }

    .divider {
      height: 2px;
      background: var(--border);
      margin: 8px 0;
    }

    .boost-indicator {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
      padding: 8px 12px;
      background: rgba(126, 184, 218, 0.1);
      border-radius: 6px;
      font-size: 14px;
      color: var(--info);
    }

    .source-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      text-align: center;
    }

    .source-card h4 {
      margin: 0 0 12px 0;
      color: var(--text-muted);
      font-size: 14px;
    }

    .source-label {
      display: inline-block;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
    }

    .source-label.growth {
      background: rgba(46, 160, 67, 0.2);
      color: #2ea043;
    }

    .source-label.cash {
      background: rgba(240, 198, 116, 0.2);
      color: #f0c674;
    }

    .source-label.mixed {
      background: rgba(126, 184, 218, 0.2);
      color: #7eb8da;
    }

    .source-breakdown {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 12px;
      color: var(--text-muted);
      font-size: 14px;
    }

    .fund-status {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .fund-status h4 {
      margin: 0 0 16px 0;
    }

    .fund-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .fund-cell {
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }

    .fund-cell.healthy {
      background: rgba(46, 160, 67, 0.1);
      border: 1px solid rgba(46, 160, 67, 0.2);
    }

    .fund-cell.deficit {
      background: rgba(248, 81, 73, 0.1);
      border: 1px solid rgba(248, 81, 73, 0.2);
    }

    .fund-name {
      font-weight: 600;
      margin-bottom: 8px;
    }

    .fund-current {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .fund-min {
      font-size: 12px;
      color: var(--text-muted);
    }

    .fund-surplus {
      font-size: 14px;
      margin-top: 8px;
    }

    .fund-cell.healthy .fund-surplus {
      color: #2ea043;
    }

    .fund-cell.deficit .fund-surplus {
      color: #f85149;
    }

    .overall-status {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;
      padding: 12px;
      border-radius: 8px;
    }

    .overall-status.healthy {
      background: rgba(46, 160, 67, 0.1);
      color: #2ea043;
    }

    .overall-status.warning {
      background: rgba(248, 81, 73, 0.1);
      color: #f85149;
    }

    .tax-info, .rebalance-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .tax-info h4, .rebalance-card h4 {
      margin: 0 0 16px 0;
    }

    .tax-grid {
      display: grid;
      gap: 8px;
    }

    .tax-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
    }

    .tax-item:last-child {
      border-bottom: none;
    }

    .rebalance-card ul {
      margin: 0;
      padding-left: 20px;
    }

    .rebalance-card li {
      margin-bottom: 8px;
      color: var(--text-muted);
    }

    .mode-explanation {
      background: var(--card-alt);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .mode-explanation h4 {
      margin: 0 0 12px 0;
      color: var(--primary);
    }

    .mode-explanation p {
      margin: 0 0 8px 0;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .isa-warning {
      color: var(--warning) !important;
    }

    .debug-section {
      margin-top: 20px;
      padding: 16px;
      background: var(--card-alt);
      border-radius: 8px;
    }

    .debug-section summary {
      cursor: pointer;
      color: var(--text-muted);
      font-size: 14px;
    }

    .debug-section pre {
      margin-top: 16px;
      padding: 16px;
      background: var(--card);
      border-radius: 6px;
      overflow-x: auto;
      font-size: 12px;
      color: var(--text-muted);
    }

    /* Info mode (protection-induced efficiency) */
    .decision-mode.info {
      background: rgba(126, 184, 218, 0.15);
      border: 1px solid rgba(126, 184, 218, 0.3);
      color: #7eb8da;
    }

    /* Tax Boost mode (catch-up after protection) */
    .decision-mode.boost {
      background: rgba(46, 204, 113, 0.15);
      border: 1px solid rgba(46, 204, 113, 0.3);
      color: #2ecc71;
    }

    /* ISA Progress Card */
    .isa-progress-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 20px;
    }

    .isa-progress-card h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: var(--text-muted);
    }

    .isa-progress-bar {
      height: 8px;
      background: var(--border);
      border-radius: 4px;
      overflow: hidden;
    }

    .isa-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), #5a9aba);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .isa-progress-stats {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 13px;
      color: var(--text-muted);
    }

    /* Tax Thresholds Row */
    .tax-thresholds {
      display: flex;
      gap: 20px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
      margin-bottom: 16px;
    }

    .tax-threshold-item {
      display: flex;
      gap: 8px;
      font-size: 14px;
    }

    .tax-threshold-item .label {
      color: var(--text-muted);
    }

    .tax-threshold-item .success {
      color: var(--success);
    }

    .tax-threshold-item .warning {
      color: var(--warning);
    }

    /* Tax Comparison Table */
    .tax-comparison {
      margin: 16px 0;
    }

    .tax-comparison-header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .tax-comparison-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
    }

    .tax-comparison-row:last-child {
      border-bottom: none;
    }

    .tax-comparison-row .label {
      color: var(--text-muted);
    }

    .tax-comparison-row.saved {
      background: rgba(46, 160, 67, 0.05);
    }

    .tax-comparison-row .success {
      color: var(--success);
    }

    .tax-comparison-row .warning {
      color: var(--warning);
    }

    .tax-comparison-row .danger {
      color: var(--danger);
    }

    /* Effective Rate */
    .effective-rate {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--card-alt);
      border-radius: 8px;
      margin-top: 16px;
      font-size: 14px;
    }

    .effective-rate .success {
      color: var(--success);
      font-weight: 600;
    }

    .effective-rate .warning {
      color: var(--warning);
      font-weight: 600;
    }

    .effective-rate .danger {
      color: var(--danger);
      font-weight: 600;
    }
  `}async function ME(n){const t=Td(n),e=Wa(t),r=t.getMonth()+1;return await hE(e)?{showWizard:!1,taxYear:e,isApril:r===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:e,isApril:r===4,reason:`Tax year ${e} has not been set up`}}function NE(n,t){return n*(1+t)}function LE(n){const{targetAnnualGross:t,brl:e,pa:r=12570,remainingMonths:s,grossIncomeToDate:i=0}=n,a=T=>T<=r?0:T<=e?(T-r)*.2:(e-r)*.2+(T-e)*.4,l=Math.max(0,e-i);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:e,reducedSalaryOption:e,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(t<=e)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:e,reducedSalaryOption:e,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=a(t),d=t-c,f=a(e),m=e-f,v=Math.max(0,d-m),E=v/12*s;return{isaNeeded:E,isaNeededAnnual:v,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:e,reducedSalaryOption:e,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:f,reason:`Need £${Math.round(E).toLocaleString()} ISA/Savings for tax efficiency`}}function VE(n,t,e){return e?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:n>=t?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:t-n,options:[{key:"increase",label:`Increase ISA to £${Math.round(t).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function OE(n){const t=Td(n),e=Wa(t),s=t.getMonth()+1===4,i=Vp(t),a=await rr(),l=await Mo(e),c=await Rn(),d=Object.keys(c).sort(),f=d.indexOf(e)-1,m=f>=0?c[d[f]]:null,v=await Jl(e),E=(m==null?void 0:m.cpi)||.025,T=NE(a.baseSalary,E);return{taxYear:e,selectedMonth:n,isApril:s,remainingMonths:i,baseSalary:a.baseSalary,suggestedSalary:T,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:E,other:(m==null?void 0:m.other)||0},statePension:v,existingConfig:l.yearSetupComplete?l:null}}function Jf(n){const{targetSalary:t,brl:e,pa:r=12570,other:s=0,statePension:i=0,isaSavingsAllocation:a=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=n,f=S=>S<=r?0:S<=e?(S-r)*.2:(e-r)*.2+(S-e)*.4,m=s/12,v=i/12,E=m+v;let T,x;if(!d)T=t/12-E,x=0;else{const S=Math.max(0,e-c),w=Math.max(0,S/l-E);T=Math.min(t/12-E,w),x=a/l}const R=(T+E)*12,D=f(R)/12,N=T+E,C=N>0?D/N:0,V=T*C,O=m*C,b=v*C,g=T-V,y=m-O,_=v-b,I=g+y+_+x;return{sipp:{gross:T,tax:V,net:g},other:{gross:m,tax:O,net:y},statePension:{gross:v,tax:b,net:_},isa:{gross:x,tax:0,net:x},totalGross:T+m+v+x,totalTax:D,totalNet:I,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:T,monthlyIsa:x,monthlyOther:m,monthlyStatePension:v,monthlyTotal:I}}function BE(n){var x,R,A,D,N,C,V,O,b,g,y;const{pa:t,brl:e,hrl:r,cpi:s,other:i,isaSavingsAllocation:a,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:f,confirmedSalary:m,remainingMonths:v,statePension:E,monthlyBreakdown:T}=n;return{pa:t,brl:e,hrl:r,cpi:s,other:i,isaSavingsAllocation:l?a:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:f||4,remainingMonths:v||12,yearSetupComplete:!0,confirmedSalary:m,statePension:E||0,expectedMonthly:T?{sipp:{gross:((x=T.sipp)==null?void 0:x.gross)||0,tax:((R=T.sipp)==null?void 0:R.tax)||0,net:((A=T.sipp)==null?void 0:A.net)||0},other:{gross:((D=T.other)==null?void 0:D.gross)||0,tax:((N=T.other)==null?void 0:N.tax)||0,net:((C=T.other)==null?void 0:C.net)||0},statePension:{gross:((V=T.statePension)==null?void 0:V.gross)||0,tax:((O=T.statePension)==null?void 0:O.tax)||0,net:((b=T.statePension)==null?void 0:b.net)||0},isa:{gross:((g=T.isa)==null?void 0:g.gross)||0,tax:0,net:((y=T.isa)==null?void 0:y.net)||0},totalGross:T.totalGross||0,totalTax:T.totalTax||0,totalNet:T.totalNet||0}:null}}let Wn=null,Us=null,fe=1,Q=null,F={};async function FE(n,t,e){Wn=n,Us=e,fe=1,F={},Q=await OE(t),F={pa:Q.defaults.pa,brl:Q.defaults.brl,hrl:Q.defaults.hrl,cpi:Q.defaults.cpi,other:Q.defaults.other,grossIncomeToDate:0,confirmedSalary:Q.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},Ps()}async function UE(n){return await ME(n)}function Ps(){if(!Wn||!Q)return;const n=Q.isApril?6:7;Wn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${Q.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${Q.isApril?"Setting up for the full tax year":`Starting in ${ec(Q.selectedMonth)} - ${Q.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${qE(n,fe)}
        </div>

        ${zE()}
      </div>
    </div>
  `,jE()}function zE(){if(Q.isApril,Q.isApril)switch(fe){case 1:return dd();case 2:return hd();case 3:return fd();case 4:return pd();case 5:return md();case 6:return gd();default:return""}else switch(fe){case 1:return dd();case 2:return $E();case 3:return hd();case 4:return fd();case 5:return pd();case 6:return md();case 7:return gd();default:return""}}function dd(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">Tax Thresholds for ${Q.taxYear}</div>
      <div class="wizard-step-desc">
        Enter the tax thresholds for this tax year. These are pre-filled with standard values.
      </div>

      <div class="wizard-grid">
        <div class="wizard-grid-item">
          <label>Personal Allowance</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizPA" value="${F.pa}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Basic Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBRL" value="${F.brl}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Higher Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizHRL" value="${F.hrl}">
          </div>
        </div>
      </div>

      <div class="wizard-example">
        <strong>Note:</strong> BRL is the threshold where 40% tax begins. Staying at or below BRL keeps you in the 20% tax band.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="cancel">Cancel</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function $E(){const n=ec(Q.selectedMonth),t=GE(Q.selectedMonth);return`
    <div class="wizard-step">
      <div class="wizard-step-title">Income Before Starting Pension</div>
      <div class="wizard-step-desc">
        You're starting your pension drawdown in ${n}. Enter any taxable income you've already received this tax year (April to ${t}).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizIncomeToDate" value="${F.grossIncomeToDate}" placeholder="0">
        <span class="wizard-unit">gross</span>
      </div>

      <div class="wizard-example">
        <strong>Include:</strong> Employment income, self-employment, rental income, dividends, etc. received since April.
        <br><strong>Exclude:</strong> Tax-free income like ISA withdrawals.
      </div>

      <div class="wizard-info-box">
        <p>This affects how much BRL headroom you have remaining. If you've already earned above the BRL, you cannot be tax-efficient this year.</p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function hd(){const n=F.cpi!==void 0?F.cpi:Q.defaults.cpi,t=(n*100).toFixed(1),e=Q.baseSalary,r=Math.round(e*(1+n));return`
    <div class="wizard-step">
      <div class="wizard-step-title">Inflation and Target Salary</div>
      <div class="wizard-step-desc">
        Enter last year's CPI (used to adjust your target salary for inflation).
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <span class="wizard-unit">CPI</span>
        <input type="number" id="wizCPI" value="${t}" step="0.1" style="max-width: 80px;" onchange="window._updateWizardSalary && window._updateWizardSalary()">
        <span class="wizard-unit">%</span>
      </div>

      <div class="wizard-info-box" id="salaryInfoBox">
        <p>Based on <span id="cpiDisplay">${t}</span>% inflation, your target salary should be:</p>
        <p style="font-size: 24px; color: var(--primary); margin: 12px 0;">£<span id="suggestedSalaryDisplay">${r.toLocaleString()}</span></p>
        <p>per year (gross)</p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Confirm or adjust your target salary:
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizSalary" value="${Math.round(F.confirmedSalary||r)}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function fd(){const n=Q.statePension,t=n.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(n.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${n.yearsUntil} years until state pension</span>`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Other Taxable Income</div>
      <div class="wizard-step-desc">
        Enter any other taxable income you'll receive this tax year (annual amount).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizOther" value="${F.other}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-example">
        <strong>Include:</strong> Private pensions, rental income, side hustles, dividends above allowance.
      </div>

      <div class="wizard-info-box">
        <strong>State Pension:</strong> ${t}
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
          (Based on your settings - edit in Settings if needed)
        </p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function pd(){ri();const n=LE({targetAnnualGross:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:Q.statePension.amount,remainingMonths:Q.remainingMonths,grossIncomeToDate:F.grossIncomeToDate});return F._isaCalc=n,n.brlExhausted?`
      <div class="wizard-step">
        <div class="wizard-step-title">BRL Already Exhausted</div>

        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2); border: 1px solid var(--danger);">
          <p style="color: var(--danger); font-weight: 500;">
            Your income to date (£${F.grossIncomeToDate.toLocaleString()}) has already exceeded the BRL (£${F.brl.toLocaleString()}).
          </p>
          <p style="margin-top: 8px;">
            You cannot be tax-efficient this tax year. Any pension income will be taxed at 40% or higher.
          </p>
        </div>

        <div class="wizard-buttons">
          <button class="wizard-btn secondary" data-action="back">Back</button>
          <button class="wizard-btn primary" data-action="next">Continue</button>
        </div>
      </div>
    `:n.targetAchievableAtBrl?`
      <div class="wizard-step">
        <div class="wizard-step-title">Good News!</div>

        <div class="wizard-info-box" style="background: rgba(46, 204, 113, 0.2); border: 1px solid var(--success);">
          <p style="color: var(--success); font-weight: 500;">
            Your target salary of £${Math.round(F.confirmedSalary).toLocaleString()} is achievable within the BRL.
          </p>
          <p style="margin-top: 8px;">
            No ISA/Savings allocation is needed for tax efficiency. All your income will be taxed at 20% or less.
          </p>
        </div>

        <div class="wizard-input" style="margin-top: 16px;">
          <span class="wizard-unit">ISA allocation (optional): £</span>
          <input type="number" id="wizISA" value="0">
        </div>

        <div class="wizard-buttons">
          <button class="wizard-btn secondary" data-action="back">Back</button>
          <button class="wizard-btn primary" data-action="next">Continue</button>
        </div>
      </div>
    `:`
    <div class="wizard-step">
      <div class="wizard-step-title">ISA/Savings Requirement</div>

      <div class="wizard-info-box" style="background: rgba(52, 152, 219, 0.2); border: 1px solid var(--primary);">
        <p>To be tax-efficient for the remaining <strong>${Q.remainingMonths} months</strong>, you need:</p>
        <p style="font-size: 28px; color: var(--primary); margin: 12px 0;">
          £${Math.round(n.isaNeeded).toLocaleString()}
        </p>
        <p>from ISA/Savings</p>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
          This keeps your SIPP draw at the BRL (£${F.brl.toLocaleString()}) while reaching your target salary.
        </p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        How much ISA/Savings can you allocate this tax year?
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizISA" value="${F.isaSavingsAllocation||Math.round(n.isaNeeded)}">
      </div>

      <div class="wizard-example">
        <strong>Tip:</strong> This is money you'll withdraw tax-free from ISA or savings to supplement your SIPP income.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function md(){ri();const n=F._isaCalc,t=VE(F.isaSavingsAllocation,(n==null?void 0:n.isaNeeded)||0,(n==null?void 0:n.brlExhausted)||!1);if(t.sufficient&&!t.isBrlExhausted)return F.isTaxEfficient=!0,F.taxEfficiencyChoice="efficient",setTimeout(()=>{fe++,Ps()},0),`
      <div class="wizard-step">
        <div class="wizard-step-title">Setting Up Tax Efficiency...</div>
        <div class="wizard-info-box">
          <p>Your ISA allocation is sufficient for tax efficiency.</p>
        </div>
      </div>
    `;const e=t.shortfall>0?`You entered £${F.isaSavingsAllocation.toLocaleString()} but need £${Math.round(n.isaNeeded).toLocaleString()}.`:"";return`
    <div class="wizard-step">
      <div class="wizard-step-title">Tax Efficiency Choice</div>

      ${t.isBrlExhausted?`
        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2);">
          <p style="color: var(--danger);">Your prior income has exhausted the BRL. You cannot be tax-efficient this year.</p>
        </div>
      `:`
        <div class="wizard-info-box" style="background: rgba(243, 156, 18, 0.2);">
          <p style="color: var(--warning);">${e}</p>
        </div>
      `}

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Choose how to proceed:
      </div>

      <div class="wizard-options">
        ${t.isBrlExhausted?"":`
          <label class="wizard-option">
            <input type="radio" name="taxChoice" value="increase" ${F.taxEfficiencyChoice==="increase"?"checked":""}>
            <div class="wizard-option-content">
              <strong>Increase ISA to £${Math.round(n.isaNeeded).toLocaleString()}</strong>
              <p>Provide enough ISA/Savings for tax efficiency</p>
            </div>
          </label>
        `}

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="reduced" ${F.taxEfficiencyChoice==="reduced"?"checked":""}>
          <div class="wizard-option-content">
            <strong>Reduce salary to BRL (£${F.brl.toLocaleString()})</strong>
            <p>Keep ISA/Savings to grow, accept lower income this year</p>
          </div>
        </label>

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="inefficient" ${F.taxEfficiencyChoice==="inefficient"?"checked":""}>
          <div class="wizard-option-content">
            <strong>Accept tax-inefficient year</strong>
            <p>Draw full SIPP to target, ISA stays untouched, pay 40% on excess</p>
          </div>
        </label>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="apply-choice">Continue</button>
      </div>
    </div>
  `}function gd(){ri();const n=Jf({targetSalary:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:Q.statePension.amount,isaSavingsAllocation:F.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:F.grossIncomeToDate,isTaxEfficient:F.isTaxEfficient}),t=F.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",e=F.isTaxEfficient?"success":"warning",r=s=>`£${Math.round(s).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${Q.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${ec(Q.selectedMonth)}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Remaining Months:</span>
          <span>${Q.remainingMonths}</span>
        </div>
        ${F.grossIncomeToDate>0?`
          <div class="wizard-summary-row">
            <span>Income to Date:</span>
            <span>${r(F.grossIncomeToDate)}</span>
          </div>
        `:""}
        <div class="wizard-summary-row">
          <span>Target Salary:</span>
          <span>${r(F.confirmedSalary)}/year</span>
        </div>
        <div class="wizard-summary-row">
          <span>Tax Mode:</span>
          <span class="${e}">${t}</span>
        </div>
        <div class="wizard-summary-row">
          <span>ISA Allocation:</span>
          <span>${r(F.isaSavingsAllocation)}</span>
        </div>
      </div>

      <div class="wizard-info-box" style="margin-top: 16px;">
        <strong>Expected Monthly Take-Home:</strong>
        <table style="width: 100%; margin-top: 12px; font-size: 13px;">
          <thead>
            <tr style="text-align: left; color: var(--text-muted);">
              <th style="padding: 4px 0;">Source</th>
              <th style="padding: 4px 0; text-align: right;">Gross</th>
              <th style="padding: 4px 0; text-align: right;">Tax</th>
              <th style="padding: 4px 0; text-align: right;">Net</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 4px 0;">SIPP</td>
              <td style="padding: 4px 0; text-align: right;">${r(n.sipp.gross)}</td>
              <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${r(n.sipp.tax)}</td>
              <td style="padding: 4px 0; text-align: right;">${r(n.sipp.net)}</td>
            </tr>
            ${n.other.gross>0?`
              <tr>
                <td style="padding: 4px 0;">Other</td>
                <td style="padding: 4px 0; text-align: right;">${r(n.other.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${r(n.other.tax)}</td>
                <td style="padding: 4px 0; text-align: right;">${r(n.other.net)}</td>
              </tr>
            `:""}
            ${n.statePension.gross>0?`
              <tr>
                <td style="padding: 4px 0;">State Pension</td>
                <td style="padding: 4px 0; text-align: right;">${r(n.statePension.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${r(n.statePension.tax)}</td>
                <td style="padding: 4px 0; text-align: right;">${r(n.statePension.net)}</td>
              </tr>
            `:""}
            ${n.isa.net>0?`
              <tr>
                <td style="padding: 4px 0;">ISA <span style="color: var(--success);">(tax-free)</span></td>
                <td style="padding: 4px 0; text-align: right;">${r(n.isa.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--success);">£0</td>
                <td style="padding: 4px 0; text-align: right;">${r(n.isa.net)}</td>
              </tr>
            `:""}
          </tbody>
          <tfoot>
            <tr style="border-top: 1px solid var(--border); font-weight: bold;">
              <td style="padding: 8px 0;">Total</td>
              <td style="padding: 8px 0; text-align: right;">${r(n.totalGross)}</td>
              <td style="padding: 8px 0; text-align: right; color: var(--danger);">-${r(n.totalTax)}</td>
              <td style="padding: 8px 0; text-align: right; color: var(--success);">${r(n.totalNet)}</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top: 12px; font-size: 14px; color: var(--text);">
          <strong>You'll receive ${r(n.totalNet)}/month</strong> in your bank
        </p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="finish">Confirm & Save</button>
      </div>
    </div>
  `}function qE(n,t){let e="";for(let r=1;r<=n;r++){const s=r<t?"done":r===t?"active":"";e+=`<div class="wizard-dot ${s}"></div>`}return e}function jE(){Wn.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",()=>HE(t.dataset.action))}),window._updateWizardSalary=function(){const t=document.getElementById("wizCPI"),e=document.getElementById("wizSalary"),r=document.getElementById("cpiDisplay"),s=document.getElementById("suggestedSalaryDisplay");if(t&&e&&r&&s){const i=parseFloat(t.value)||0,a=i/100,l=Q.baseSalary,c=Math.round(l*(1+a));r.textContent=i.toFixed(1),s.textContent=c.toLocaleString(),e.value=c,F.cpi=a,F.confirmedSalary=c}}}function HE(n){ri();const t=Q.isApril?6:7;switch(n){case"cancel":Xf(),Us&&Us({completed:!1,cancelled:!0});break;case"next":fe<t&&(fe++,Ps());break;case"back":fe>1&&(fe--,Ps());break;case"apply-choice":WE(),fe++,Ps();break;case"finish":YE();break}}function WE(){var t;const n=(t=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:t.value;switch(F.taxEfficiencyChoice=n,n){case"increase":F.isaSavingsAllocation=F._isaCalc.isaNeeded,F.isTaxEfficient=!0;break;case"reduced":F.confirmedSalary=F.brl,F.isaSavingsAllocation=0,F.isTaxEfficient=!0;break;case"inefficient":F.isaSavingsAllocation=0,F.isTaxEfficient=!1;break}}function ri(){const n=document.getElementById("wizPA");n&&(F.pa=parseFloat(n.value)||12570);const t=document.getElementById("wizBRL");t&&(F.brl=parseFloat(t.value)||50270);const e=document.getElementById("wizHRL");e&&(F.hrl=parseFloat(e.value)||125140);const r=document.getElementById("wizCPI");r&&(F.cpi=(parseFloat(r.value)||4)/100);const s=document.getElementById("wizSalary");s&&(F.confirmedSalary=parseFloat(s.value)||3e4);const i=document.getElementById("wizOther");i&&(F.other=parseFloat(i.value)||0);const a=document.getElementById("wizISA");a&&(F.isaSavingsAllocation=parseFloat(a.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(F.grossIncomeToDate=parseFloat(l.value)||0)}async function YE(){ri();const n=Jf({targetSalary:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:Q.statePension.amount,isaSavingsAllocation:F.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:F.grossIncomeToDate,isTaxEfficient:F.isTaxEfficient}),t=BE({pa:F.pa,brl:F.brl,hrl:F.hrl,cpi:F.cpi,other:F.other,isaSavingsAllocation:F.isaSavingsAllocation,isTaxEfficient:F.isTaxEfficient,taxEfficiencyChoice:F.taxEfficiencyChoice,grossIncomeToDate:F.grossIncomeToDate,startMonth:parseInt(Q.selectedMonth.split("-")[1]),confirmedSalary:F.confirmedSalary,remainingMonths:Q.remainingMonths,statePension:Q.statePension.amount,monthlyBreakdown:n});console.log(`Tax Year Wizard: Saving config for ${Q.taxYear}`,t);try{await sr(Q.taxYear,t),console.log(`Tax Year Wizard: Successfully saved config for ${Q.taxYear}`)}catch(e){console.error(`Tax Year Wizard: Failed to save config for ${Q.taxYear}`,e),alert(`Error saving tax year configuration: ${e.message}`);return}Xf(),Us&&Us({completed:!0,taxYear:Q.taxYear,config:t,wizardInputs:F})}function Xf(){Wn&&(Wn.innerHTML="",Wn.style.display="none")}function ec(n){const[t,e]=n.split("-").map(Number);return new Date(t,e-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function GE(n){const[t,e]=n.split("-").map(Number);return new Date(t,e-2,1).toLocaleString("default",{month:"long"})}function KE(){return`
    .wizard-summary {
      background: var(--card-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
    }

    .wizard-summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
    }

    .wizard-summary-row:last-child {
      border-bottom: none;
    }

    .wizard-summary-row .success {
      color: var(--success);
      font-weight: 500;
    }

    .wizard-summary-row .warning {
      color: var(--warning);
      font-weight: 500;
    }

    .wizard-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 16px 0;
    }

    .wizard-option {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: var(--card-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .wizard-option:hover {
      border-color: var(--primary);
    }

    .wizard-option input[type="radio"] {
      margin-top: 4px;
    }

    .wizard-option-content strong {
      display: block;
      color: var(--text);
      margin-bottom: 4px;
    }

    .wizard-option-content p {
      color: var(--text-muted);
      font-size: 13px;
      margin: 0;
    }
  `}function QE(n={},t=null){const e=tc(n,t),r=Wf(e),s=Gf(r);return{results:r,stats:s,config:e}}function JE(n={},t=null){const e=tc(n,t),r=Yf(e),s=Gf(r);return{results:r,stats:s,config:e}}function XE(n={}){const t=tc(n),e={};for(const[r,s]of Object.entries(kp))e[r]={...s,result:vE(t,s)};return e}let Ce=null,da=null,Sr=!1;function ZE(n,t){console.log("initAuthScreen: initializing"),Ce=n,da=t,Sr=!1,Qw(e=>{console.log("AuthScreen: auth state change received:",e?e.email:"null","processed:",Sr),e&&da&&!Sr?(console.log("AuthScreen: calling onAuthSuccessCallback"),Sr=!0,da(e)):e?console.log("AuthScreen: skipping callback, already processed or no callback"):(Sr=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),Zf(),console.log("initAuthScreen: complete")}function Zf(){if(Ce){if(!Ct()){Ce.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Firebase not configured</p>
          </div>
          <div class="auth-screen-error">
            <p>This app requires Firebase authentication to save your data.</p>
            <p>Please contact the administrator to configure Firebase.</p>
          </div>
        </div>
      </div>
    `;return}Ce.innerHTML=`
    <div class="auth-screen">
      <div class="auth-screen-box">
        <div class="auth-screen-header">
          <h1>Pension Planner</h1>
          <p>A tool to help you plan and manage your SIPP pension drawdown</p>
        </div>

        <div class="auth-screen-tabs">
          <button class="auth-screen-tab active" data-tab="signin">Sign In</button>
          <button class="auth-screen-tab" data-tab="signup">Sign Up</button>
        </div>

        <div id="authScreenError" class="auth-screen-error" style="display: none;"></div>

        <!-- Sign In Form -->
        <form id="signinForm" class="auth-screen-form">
          <div class="auth-screen-field">
            <label>Email</label>
            <input type="email" id="signinEmail" placeholder="your@email.com" required>
          </div>
          <div class="auth-screen-field">
            <label>Password</label>
            <input type="password" id="signinPassword" placeholder="Enter password" required>
          </div>
          <button type="submit" class="auth-screen-btn primary">Sign In</button>
          <button type="button" class="auth-screen-btn secondary" id="forgotPasswordBtn">Forgot Password?</button>
        </form>

        <!-- Sign Up Form -->
        <form id="signupForm" class="auth-screen-form" style="display: none;">
          <div class="auth-screen-field">
            <label>Name</label>
            <input type="text" id="signupName" placeholder="Your name" required>
          </div>
          <div class="auth-screen-field">
            <label>Email</label>
            <input type="email" id="signupEmail" placeholder="your@email.com" required>
          </div>
          <div class="auth-screen-field">
            <label>Password</label>
            <input type="password" id="signupPassword" placeholder="Create password (6+ chars)" required minlength="6">
          </div>
          <button type="submit" class="auth-screen-btn primary">Create Account</button>
        </form>

        <div class="auth-screen-divider">
          <span>or</span>
        </div>

        <button class="auth-screen-btn google" id="googleSigninBtn">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Sign in with Google
        </button>

        <div class="auth-screen-footer">
          <p>Your data is stored securely in the cloud and synced across devices.</p>
        </div>
      </div>
    </div>
  `,tb()}}function tb(){const n=Ce.querySelectorAll(".auth-screen-tab");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const a=document.getElementById("signinForm"),l=document.getElementById("signupForm");i.dataset.tab==="signin"?(a.style.display="block",l.style.display="none"):(a.style.display="none",l.style.display="block"),si()})}),document.getElementById("signinForm").addEventListener("submit",eb),document.getElementById("signupForm").addEventListener("submit",nb),document.getElementById("forgotPasswordBtn").addEventListener("click",rb),document.getElementById("googleSigninBtn").addEventListener("click",sb)}function _n(n){const t=document.getElementById("authScreenError");t&&(t.textContent=n,t.style.display="block")}function si(){const n=document.getElementById("authScreenError");n&&(n.style.display="none")}async function eb(n){n.preventDefault(),si();const t=document.getElementById("signinEmail").value.trim(),e=document.getElementById("signinPassword").value;if(!t||!e){_n("Please enter email and password");return}try{await Xw(t,e)}catch(r){console.error("Sign in error:",r),_n(Lo(r.code))}}async function nb(n){n.preventDefault(),si();const t=document.getElementById("signupName").value.trim(),e=document.getElementById("signupEmail").value.trim(),r=document.getElementById("signupPassword").value;if(!t||!e||!r){_n("Please fill in all fields");return}if(r.length<6){_n("Password must be at least 6 characters");return}try{await Jw(e,r,t)}catch(s){console.error("Sign up error:",s),_n(Lo(s.code))}}async function rb(){si();const n=document.getElementById("signinEmail").value.trim();if(!n){_n("Please enter your email address first");return}try{await tE(n),alert("Password reset email sent. Check your inbox.")}catch(t){console.error("Reset password error:",t),_n(Lo(t.code))}}async function sb(){si();try{await Zw()}catch(n){console.error("Google sign in error:",n),_n(Lo(n.code))}}function Lo(n){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[n]||"An error occurred. Please try again."}function Ua(){console.log("hideAuthScreen: hiding auth screen, element=",!!Ce),Ce&&(Ce.style.display="none",console.log("hideAuthScreen: set display to none"))}function tp(){Sr=!1,Ce&&(Ce.style.display="block",Zf())}function ib(){return`
    .auth-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .auth-screen-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      max-width: 440px;
      width: 100%;
    }

    .auth-screen-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-screen-header h1 {
      font-size: 28px;
      color: var(--primary);
      margin-bottom: 8px;
    }

    .auth-screen-header p {
      color: var(--text-muted);
      font-size: 14px;
    }

    .auth-screen-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 24px;
      background: var(--card-alt);
      padding: 4px;
      border-radius: 8px;
    }

    .auth-screen-tab {
      flex: 1;
      padding: 12px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .auth-screen-tab:hover {
      color: var(--text);
    }

    .auth-screen-tab.active {
      background: var(--primary);
      color: var(--bg);
    }

    .auth-screen-error {
      background: rgba(248, 81, 73, 0.15);
      border: 1px solid rgba(248, 81, 73, 0.3);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      color: var(--danger);
      font-size: 14px;
    }

    .auth-screen-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .auth-screen-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .auth-screen-field label {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .auth-screen-field input {
      padding: 12px 14px;
      background: var(--card-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-size: 14px;
      width: 100%;
    }

    .auth-screen-field input:focus {
      outline: none;
      border-color: var(--primary);
    }

    .auth-screen-btn {
      padding: 14px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
    }

    .auth-screen-btn.primary {
      background: var(--primary);
      color: var(--bg);
    }

    .auth-screen-btn.primary:hover {
      opacity: 0.9;
    }

    .auth-screen-btn.secondary {
      background: transparent;
      color: var(--text-muted);
      padding: 10px;
    }

    .auth-screen-btn.secondary:hover {
      color: var(--text);
    }

    .auth-screen-btn.google {
      background: white;
      color: #333;
      margin-top: 8px;
    }

    .auth-screen-btn.google:hover {
      background: #f5f5f5;
    }

    .auth-screen-divider {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 24px 0;
    }

    .auth-screen-divider::before,
    .auth-screen-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    .auth-screen-divider span {
      color: var(--text-muted);
      font-size: 12px;
    }

    .auth-screen-footer {
      margin-top: 24px;
      text-align: center;
    }

    .auth-screen-footer p {
      color: var(--text-muted);
      font-size: 12px;
    }

    @media (max-width: 480px) {
      .auth-screen-box {
        padding: 24px;
      }

      .auth-screen-header h1 {
        font-size: 24px;
      }
    }
  `}let In=null,za=null,j={introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35},Ie="intro",Ot=1;function ob(){Ie="intro",Ot=1,j={introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35}}function $a(n,t){In=n,za=t,ob(),an()}function an(){In&&(Ie==="intro"?ab():Ie==="stress"?ub():Ie==="decision"&&hb())}function ab(){In.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">A tool to help you plan and manage your SIPP pension drawdown</div>

        <div class="wizard-progress">
          ${nc(2,Ot)}
        </div>

        ${Ot===1?lb():cb()}
      </div>
    </div>
  `,rc()}function lb(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">What does this app do?</div>
      <div class="wizard-step-desc">
        This app helps you answer two important questions about your pension:
      </div>

      <div class="wizard-info-box">
        <div class="wizard-info-item">
          <strong>1. Stress Tester</strong>
          <p>"Can I afford to retire?" This tool runs 1,000 simulations using real historical market data to show you the range of possible outcomes for your pension.</p>
        </div>
        <div class="wizard-info-item">
          <strong>2. Decision Tool</strong>
          <p>"Where should I take money from this month?" Once you're retired, this tool helps you decide each month which fund to withdraw from to maximise tax efficiency.</p>
        </div>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="skip-all">Skip Setup</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function cb(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">Start with the Stress Tester</div>
      <div class="wizard-step-desc">
        Whether you're already retired or still planning, the Stress Tester is where you should start.
      </div>

      <div class="wizard-info-box">
        <p>The Stress Tester will help you understand:</p>
        <ul>
          <li>How much yearly income your pension could realistically provide</li>
          <li>How long your money might last under different market conditions</li>
          <li>What happens if markets crash early in your retirement</li>
          <li>Whether your current savings are on track</li>
        </ul>
      </div>

      <div class="wizard-example">
        <strong>Next:</strong> We'll set up your Stress Tester with some basic questions about your pension.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="start-stress">Set Up Stress Tester</button>
      </div>
    </div>
  `}function ub(){In.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${nc(6,Ot)}
        </div>

        ${db(Ot)}
      </div>
    </div>
  `,rc()}function db(n){switch(n){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            Think of this as your "salary" in retirement. This is the total amount before tax that you want to receive each year.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBaseSalary" value="${j.baseSalary}">
            <span class="wizard-unit">per year</span>
          </div>

          <div class="wizard-example">
            <strong>Example:</strong> If you want £2,500 per month, enter £30,000 here.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="skip-stress">Skip</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;case 2:return`
        <div class="wizard-step">
          <div class="wizard-step-title">Do you have other pension income?</div>
          <div class="wizard-step-desc">
            Enter any other guaranteed pension income you'll receive (like a workplace defined benefit pension).
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizOther" value="${j.otherIncome}">
            <span class="wizard-unit">per year</span>
          </div>

          <div class="wizard-example">
            <strong>Example:</strong> If you have a company pension paying £5,000/year, enter £5,000.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;case 3:return`
        <div class="wizard-step">
          <div class="wizard-step-title">What about the State Pension?</div>
          <div class="wizard-step-desc">
            Get your forecast from <a href="https://www.tax.service.gov.uk/check-your-state-pension/" target="_blank" style="color: var(--primary);">gov.uk/check-your-state-pension</a>
          </div>

          <div class="wizard-grid">
            <div class="wizard-grid-item">
              <label>Start Date (from HMRC)</label>
              <div class="wizard-input">
                <input type="text" id="wizSpStartDate" value="${j.spStartDate}" placeholder="e.g. 6 May 2040" style="width: 100%;">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Weekly Amount (from HMRC)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizSpWeeklyAmount" value="${j.spWeeklyAmount||""}" step="0.01" placeholder="e.g. 221.20">
              </div>
            </div>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> Copy the exact date and weekly amount from your HMRC State Pension forecast. Leave blank if you don't have one yet.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;case 4:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How big are your pension funds?</div>
          <div class="wizard-step-desc">
            Enter the minimum amount you want to keep in each type of investment at the start of retirement.
          </div>

          <div class="wizard-grid">
            <div class="wizard-grid-item">
              <label>Stocks/Shares (Higher Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizEquityMin" value="${j.equityMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds (Medium Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizBondMin" value="${j.bondMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash (Low Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizCashTarget" value="${j.cashTarget}">
              </div>
            </div>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> These are target minimums. The simulation draws from stocks/bonds first and keeps cash as an emergency buffer.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;case 5:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How long should your money last?</div>
          <div class="wizard-step-desc">
            How many years of retirement do you want to plan for?
          </div>

          <div class="wizard-input">
            <input type="number" id="wizDuration" value="${j.duration}" style="max-width: 100px;">
            <span class="wizard-unit">years</span>
          </div>

          <div class="wizard-example">
            <strong>Example:</strong> If you're 55 and want money until age 90, enter 35 years.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;case 6:return`
        <div class="wizard-step">
          <div class="wizard-step-title">One last thing: Tax thresholds</div>
          <div class="wizard-step-desc">
            Will the government raise tax thresholds with inflation, or keep them frozen?
          </div>

          <div class="wizard-input">
            <select id="wizTaxMode">
              <option value="inflates" ${j.taxMode==="inflates"?"selected":""}>Standard (rise with inflation)</option>
              <option value="frozen" ${j.taxMode==="frozen"?"selected":""}>Frozen (stay at current levels)</option>
            </select>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> "Frozen" is more pessimistic - you pay more tax over time as your income grows but thresholds don't.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="finish-stress">Continue to Decision Tool</button>
          </div>
        </div>
      `;default:return""}}function hb(){In.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${nc(4,Ot)}
        </div>

        ${fb(Ot)}
      </div>
    </div>
  `,rc()}function fb(n){switch(n){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            This is your target "salary" from your pension. The tool will calculate how much to withdraw each month.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizDBaseSalary" value="${j.decisionSalary}">
            <span class="wizard-unit">per year (before tax)</span>
          </div>

          <div class="wizard-example">
            <strong>Example:</strong> If you want about £2,000 per month after tax, you might need £30,000 gross.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="skip-decision">Skip</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;case 2:return`
        <div class="wizard-step">
          <div class="wizard-step-title">What are your fund size targets?</div>
          <div class="wizard-step-desc">
            Enter the minimum you want in each fund at the start of retirement. The tool uses these to decide when to enter "protection mode".
          </div>

          <div class="wizard-grid">
            <div class="wizard-grid-item">
              <label>Stocks/Shares</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDEquityMin" value="${j.decisionEquity}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDBondMin" value="${j.decisionBond}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDCashTarget" value="${j.decisionCash}">
              </div>
            </div>
          </div>

          <div class="wizard-example">
            <strong>Protection Mode:</strong> If your growth funds drop below these minimums, the tool recommends drawing from cash instead.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;case 3:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How long should your money last?</div>
          <div class="wizard-step-desc">
            The fund minimums will gradually reduce to zero over this period. This is your "depletion curve."
          </div>

          <div class="wizard-input">
            <input type="number" id="wizDDuration" value="${j.decisionDuration}" style="max-width: 100px;">
            <span class="wizard-unit">years</span>
          </div>

          <div class="wizard-example">
            <strong>Example:</strong> If you're 55 and planning to age 90, enter 35 years.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="next">Next</button>
          </div>
        </div>
      `;case 4:return`
        <div class="wizard-step">
          <div class="wizard-step-title">You're all set!</div>
          <div class="wizard-step-desc">
            The Decision Tool will now help you track monthly withdrawals. Each month, enter your current fund values and it will tell you:
          </div>

          <ul class="wizard-list">
            <li>How much to withdraw from your SIPP</li>
            <li>Whether you need ISA top-up</li>
            <li>Which fund to take money from</li>
            <li>Whether to enter protection mode</li>
          </ul>

          <div class="wizard-example">
            <strong>Next Step:</strong> Go to "Tax Years" to set up your personal tax details (allowance, other income, state pension dates).
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="finish">Finish Setup</button>
          </div>
        </div>
      `;default:return""}}function nc(n,t){let e="";for(let r=1;r<=n;r++){const s=r<t?"done":r===t?"active":"";e+=`<div class="wizard-dot ${s}"></div>`}return e}function rc(){In.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",()=>pb(t.dataset.action))})}function pb(n){switch(ep(),n){case"skip-all":ha();break;case"next":Ie==="intro"?Ot<2&&(Ot++,an()):Ie==="stress"?Ot<6&&(Ot++,an()):Ie==="decision"&&Ot<4&&(Ot++,an());break;case"back":Ot>1&&(Ot--,an());break;case"start-stress":Ie="stress",Ot=1,an();break;case"skip-stress":Ie="decision",Ot=1,j.decisionSalary=j.baseSalary,j.decisionEquity=j.equityMin,j.decisionBond=j.bondMin,j.decisionCash=j.cashTarget,j.decisionDuration=j.duration,an();break;case"finish-stress":Ie="decision",Ot=1,j.decisionSalary=j.baseSalary,j.decisionEquity=j.equityMin,j.decisionBond=j.bondMin,j.decisionCash=j.cashTarget,j.decisionDuration=j.duration,an();break;case"skip-decision":ha();break;case"finish":ha();break}}function ep(){const n=document.getElementById("wizBaseSalary");n&&(j.baseSalary=parseFloat(n.value)||3e4);const t=document.getElementById("wizOther");t&&(j.otherIncome=parseFloat(t.value)||0);const e=document.getElementById("wizSpStartDate");e&&(j.spStartDate=e.value.trim()||"");const r=document.getElementById("wizSpWeeklyAmount");r&&(j.spWeeklyAmount=parseFloat(r.value)||0);const s=document.getElementById("wizEquityMin");s&&(j.equityMin=parseFloat(s.value)||25e4);const i=document.getElementById("wizBondMin");i&&(j.bondMin=parseFloat(i.value)||2e5);const a=document.getElementById("wizCashTarget");a&&(j.cashTarget=parseFloat(a.value)||5e4);const l=document.getElementById("wizDuration");l&&(j.duration=parseInt(l.value)||35);const c=document.getElementById("wizTaxMode");c&&(j.taxMode=c.value);const d=document.getElementById("wizDBaseSalary");d&&(j.decisionSalary=parseFloat(d.value)||3e4);const f=document.getElementById("wizDEquityMin");f&&(j.decisionEquity=parseFloat(f.value)||25e4);const m=document.getElementById("wizDBondMin");m&&(j.decisionBond=parseFloat(m.value)||2e5);const v=document.getElementById("wizDCashTarget");v&&(j.decisionCash=parseFloat(v.value)||5e4);const E=document.getElementById("wizDDuration");E&&(j.decisionDuration=parseInt(E.value)||35)}function ha(){ep(),za&&za(j)}function mb(){In&&(In.style.display="none")}function gb(){return`
    .wizard-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 1001;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .wizard-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      max-width: 600px;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
    }

    .wizard-title {
      font-size: 24px;
      font-weight: 500;
      color: var(--primary);
      margin-bottom: 8px;
    }

    .wizard-subtitle {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 24px;
    }

    .wizard-progress {
      display: flex;
      gap: 6px;
      margin-bottom: 24px;
    }

    .wizard-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--border);
    }

    .wizard-dot.active {
      background: var(--primary);
    }

    .wizard-dot.done {
      background: var(--success);
    }

    .wizard-step {
      margin-bottom: 24px;
    }

    .wizard-step-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--text);
    }

    .wizard-step-desc {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .wizard-info-box {
      margin: 20px 0;
      padding: 16px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }

    .wizard-info-item {
      margin-bottom: 16px;
    }

    .wizard-info-item:last-child {
      margin-bottom: 0;
    }

    .wizard-info-item strong {
      color: var(--primary);
    }

    .wizard-info-item p {
      margin: 8px 0 0 0;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.6;
    }

    .wizard-info-box ul {
      margin: 12px 0 0 0;
      padding-left: 20px;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.8;
    }

    .wizard-list {
      margin: 16px 0;
      padding-left: 20px;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.8;
    }

    .wizard-input {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .wizard-input input,
    .wizard-input select {
      flex: 1;
      max-width: 200px;
      padding: 12px 14px;
      background: var(--card-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-size: 14px;
    }

    .wizard-input input:focus,
    .wizard-input select:focus {
      outline: none;
      border-color: var(--primary);
    }

    .wizard-unit {
      color: var(--text-muted);
      font-size: 13px;
    }

    .wizard-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .wizard-grid-item label {
      display: block;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .wizard-grid-item .wizard-input {
      margin-bottom: 0;
    }

    .wizard-grid-item .wizard-input input {
      max-width: none;
      width: 100%;
    }

    .wizard-example {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 8px;
    }

    .wizard-buttons {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      justify-content: space-between;
    }

    .wizard-btn {
      padding: 14px 28px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .wizard-btn.primary {
      background: linear-gradient(135deg, var(--primary) 0%, #5a9aba 100%);
      color: var(--bg);
    }

    .wizard-btn.primary:hover {
      opacity: 0.9;
    }

    .wizard-btn.secondary {
      background: var(--card-alt);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .wizard-btn.secondary:hover {
      background: var(--border);
    }

    @media (max-width: 600px) {
      .wizard-box {
        padding: 20px;
      }

      .wizard-title {
        font-size: 20px;
      }

      .wizard-grid {
        grid-template-columns: 1fr;
      }

      .wizard-buttons {
        flex-direction: column-reverse;
      }

      .wizard-btn {
        width: 100%;
      }
    }
  `}function Vo(){const t=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:t?"rgba(15,15,26,1)":"#ffffff",text:t?"#c9d1d9":"#1f2937",cardBg:t?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}const Zn=new Map;let Er=-1;function yd(n,t,e,r,s,i){const a=s-e,l=i-r,c=a*a+l*l;if(c===0)return Math.sqrt((n-e)*(n-e)+(t-r)*(t-r));const d=Math.max(0,Math.min(1,((n-e)*a+(t-r)*l)/c)),f=e+d*a,m=r+d*l;return Math.sqrt((n-f)*(n-f)+(t-m)*(t-m))}function yb(n,t,e={}){const r=Vo(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:45,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=e.title||"Fund Value Projections (Percentile Bands)";s.font="bold 14px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="center",s.fillText(f,l.left+c/2,22);const m=e.years||35,v={};for(let A=0;A<=m;A++)v[A]=[];t.forEach(A=>{A.hist.forEach(D=>{const N=Math.floor(D.year);v[N]!==void 0&&v[N].push(D.total)})});const E=[];for(let A=0;A<=m;A++){const D=v[A].sort((C,V)=>C-V);if(D.length===0)continue;const N=C=>D[Math.floor(D.length*C)]||0;E.push({year:A,p5:N(.05),p10:N(.1),p25:N(.25),p50:N(.5),p75:N(.75),p90:N(.9),p95:N(.95)})}if(E.length===0)return;const T=Math.max(...E.map(A=>A.p90))*1.15,x=A=>l.left+A/m*c,R=A=>a-l.bottom-A/T*d;s.strokeStyle=r.grid,s.lineWidth=1;for(let A=0;A<=5;A++){const D=l.top+A/5*d;s.beginPath(),s.moveTo(l.left,D),s.lineTo(i-l.right,D),s.stroke()}s.fillStyle=r.cone,s.beginPath(),E.forEach((A,D)=>{const N=x(A.year);D===0?s.moveTo(N,R(A.p95)):s.lineTo(N,R(A.p95))});for(let A=E.length-1;A>=0;A--)s.lineTo(x(E[A].year),R(E[A].p5));s.closePath(),s.fill(),s.fillStyle=r.coneMid,s.beginPath(),E.forEach((A,D)=>{const N=x(A.year);D===0?s.moveTo(N,R(A.p90)):s.lineTo(N,R(A.p90))});for(let A=E.length-1;A>=0;A--)s.lineTo(x(E[A].year),R(E[A].p10));s.closePath(),s.fill(),s.fillStyle=r.coneInner,s.beginPath(),E.forEach((A,D)=>{const N=x(A.year);D===0?s.moveTo(N,R(A.p75)):s.lineTo(N,R(A.p75))});for(let A=E.length-1;A>=0;A--)s.lineTo(x(E[A].year),R(E[A].p25));s.closePath(),s.fill(),e.glide&&e.glide.length>0&&(s.strokeStyle=r.glidepath,s.lineWidth=2,s.setLineDash([6,3]),s.beginPath(),e.glide.forEach((A,D)=>{const N=x(A.year),C=R(A.min);D===0?s.moveTo(N,C):s.lineTo(N,C)}),s.stroke(),s.setLineDash([])),s.strokeStyle=r.primary,s.lineWidth=3,s.beginPath(),E.forEach((A,D)=>{const N=x(A.year),C=R(A.p50);D===0?s.moveTo(N,C):s.lineTo(N,C)}),s.stroke(),s.strokeStyle="rgba(248,81,73,0.6)",s.lineWidth=1.5,s.setLineDash([4,2]),s.beginPath(),E.forEach((A,D)=>{const N=x(A.year);D===0?s.moveTo(N,R(A.p10)):s.lineTo(N,R(A.p10))}),s.stroke(),s.setLineDash([]),s.strokeStyle=r.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(l.left,R(0)),s.lineTo(i-l.right,R(0)),s.stroke(),s.setLineDash([]),s.fillStyle=r.muted,s.font="11px sans-serif",s.textAlign="right";for(let A=0;A<=5;A++){const D=T*(1-A/5);s.fillText(de(D),l.left-10,l.top+A/5*d+4)}s.textAlign="center";for(let A=0;A<=m;A+=5)s.fillText(`Yr ${A}`,x(A),a-l.bottom+20);Zn.set(n.id,{percentiles:E,xScale:x,yScale:R,padding:l,chartWidth:c,chartHeight:d,years:m,maxValue:T,type:"cone"}),bb(n)}function vb(n,t,e={}){const r=Vo(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:45,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=e.title||"Sample Trajectories (Green=Success, Red=Failed)";s.font="bold 14px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="center",s.fillText(f,l.left+c/2,22);const m=e.years||35,v=e.startValue||1e6,E=t.slice(0,100),T=E.filter(C=>C.failed),x=E.filter(C=>!C.failed);let R;if(T.length>0)R=v*2;else{const C=x.map(O=>O.final).sort((O,b)=>O-b),V=C[Math.floor(C.length*.5)]||v;R=Math.max(V*1.3,v*1.5)}const A=C=>l.left+C/m*c,D=C=>a-l.bottom-Math.min(C,R)/R*d;s.strokeStyle=r.grid,s.lineWidth=1;for(let C=0;C<=5;C++){const V=l.top+C/5*d;s.beginPath(),s.moveTo(l.left,V),s.lineTo(i-l.right,V),s.stroke()}s.fillStyle=r.muted,s.font="11px sans-serif",s.textAlign="right";for(let C=0;C<=5;C++){const V=R*(1-C/5);s.fillText(de(V),l.left-10,l.top+C/5*d+4)}s.textAlign="center";for(let C=0;C<=m;C+=5)s.fillText(`Yr ${C}`,A(C),a-l.bottom+20);const N=[];e.glide&&e.glide.length>0&&(s.strokeStyle=r.glidepath,s.lineWidth=3,s.setLineDash([8,4]),s.beginPath(),e.glide.forEach((C,V)=>{const O=A(C.year),b=D(C.min);V===0?s.moveTo(O,b):s.lineTo(O,b)}),s.stroke(),s.setLineDash([])),x.forEach((C,V)=>{const O=C.hist.map(b=>({x:A(b.year),y:D(b.total)}));N.push({run:C,pts:O,failed:!1,idx:V}),s.strokeStyle=r.trajectory,s.lineWidth=.5,s.beginPath(),O.forEach((b,g)=>{g===0?s.moveTo(b.x,b.y):s.lineTo(b.x,b.y)}),s.stroke()}),T.forEach((C,V)=>{const O=C.hist.map(b=>({x:A(b.year),y:D(b.total)}));N.push({run:C,pts:O,failed:!0,idx:x.length+V}),s.strokeStyle=r.trajectoryFailed,s.lineWidth=2,s.beginPath(),O.forEach((b,g)=>{g===0?s.moveTo(b.x,b.y):s.lineTo(b.x,b.y)}),s.stroke()}),s.strokeStyle=r.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(l.left,D(0)),s.lineTo(i-l.right,D(0)),s.stroke(),s.setLineDash([]),Zn.set(n.id,{results:E,paths:N,xScale:A,yScale:D,padding:l,chartWidth:c,chartHeight:d,years:m,maxValue:R,glide:e.glide,type:"trajectory"}),Tb(n,r)}function _b(n,t,e={}){const r=Vo(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:20,bottom:55,left:60},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=e.title||"Protection Months Distribution";s.font="bold 14px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="center",s.fillText(f,l.left+c/2,22);const m=t.map(C=>C.protMonths),v=m.length,E=Math.max(...m),T=Math.max(1,Math.ceil(E/15)),x={};m.forEach(C=>{const V=Math.floor(C/T)*T;x[V]=(x[V]||0)+1});const R=Object.keys(x).map(Number).sort((C,V)=>C-V),A=Math.max(...Object.values(x)),D=c/(R.length||1),N=[];s.strokeStyle=r.grid,s.lineWidth=1,s.fillStyle=r.muted,s.font="10px sans-serif",s.textAlign="right";for(let C=0;C<=4;C++){const V=l.top+C/4*d;s.beginPath(),s.moveTo(l.left,V),s.lineTo(i-l.right,V),s.stroke();const O=Math.round(A*(1-C/4));s.fillText(`${O} runs`,l.left-5,V+4)}R.forEach((C,V)=>{const O=x[C],b=O/A*d,g=l.left+V*D+2,y=a-l.bottom-b,_=D-4;s.fillStyle=C===0?r.success:r.warning,s.fillRect(g,y,_,b),N.push({x:g,y,w:_,h:b,months:C,monthsEnd:C+T-1,count:O,pct:(O/v*100).toFixed(1)})}),s.fillStyle=r.muted,s.font="10px sans-serif",s.textAlign="center",R.forEach((C,V)=>{if(V%2===0||R.length<12){const O=T>1?`${C}-${C+T-1}`:C.toString();s.fillText(O,l.left+V*D+D/2,a-l.bottom+15)}}),s.fillText("Protection Months",i/2,a-5),s.save(),s.translate(12,a/2),s.rotate(-Math.PI/2),s.textAlign="center",s.fillText("Number of Runs",0,0),s.restore(),Zn.set(n.id,{bars:N,totalRuns:v,type:"histogram"}),Ib(n)}function wb(n,t,e={}){const r=Vo(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:180,bottom:60,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle=r.bg,s.fillRect(0,0,i,a);const f=Object.keys(t),m=e.years||35;let v=0;f.forEach(R=>{const A=t[R].result;A&&A.hist&&A.hist.forEach(D=>{D.total>v&&(v=D.total)})}),v*=1.1;const E=R=>l.left+R/m*c,T=R=>l.top+d-R/v*d;Eb(s,l,c,d,m,v,e.title||"Scenario Comparison",r);const x=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];f.forEach((R,A)=>{const D=t[R].result;if(!D||!D.hist)return;s.beginPath(),s.strokeStyle=x[A%x.length],s.lineWidth=2.5,D.hist.forEach((C,V)=>{const O=E(C.year),b=T(C.total);V===0?s.moveTo(O,b):s.lineTo(O,b)}),s.stroke();const N=l.top+15+A*24;s.fillStyle=x[A%x.length],s.fillRect(i-l.right+15,N,20,4),s.font="11px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="left",s.fillText(t[R].name||R,i-l.right+40,N+5),D.final/1e3,s.fillStyle=r.muted,s.fillText(`${de(D.final)}`,i-l.right+40,N+18)})}function Eb(n,t,e,r,s,i,a,l){n.font="bold 14px system-ui, sans-serif",n.fillStyle=l.text,n.textAlign="center",n.fillText(a,t.left+e/2,t.top-20),n.strokeStyle=l.grid,n.lineWidth=1;for(let c=0;c<=5;c++){const d=t.top+r*c/5;n.beginPath(),n.moveTo(t.left,d),n.lineTo(t.left+e,d),n.stroke();const f=i*(5-c)/5;n.font="11px system-ui, sans-serif",n.fillStyle=l.muted,n.textAlign="right",n.fillText(de(f),t.left-10,d+4)}for(let c=0;c<=s;c+=5){const d=t.left+c/s*e;n.beginPath(),n.moveTo(d,t.top),n.lineTo(d,t.top+r),n.stroke(),n.textAlign="center",n.fillText(`Y${c}`,d,t.top+r+20)}n.font="12px system-ui, sans-serif",n.textAlign="center",n.fillText("Years",t.left+e/2,t.top+r+45),n.save(),n.translate(20,t.top+r/2),n.rotate(-Math.PI/2),n.fillText("Fund Value",0,0),n.restore()}function de(n){return n>=1e6?`£${(n/1e6).toFixed(1)}M`:n>=1e3?`£${(n/1e3).toFixed(0)}k`:`£${n.toFixed(0)}`}function bb(n,t){const e=n._coneHoverListener;e&&n.removeEventListener("mousemove",e);const r=s=>{const i=Zn.get(n.id);if(!i||i.type!=="cone")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=(s.clientX-a.left)*l,{percentiles:d,padding:f,chartWidth:m,years:v}=i,E=(c-f.left)/m*v,T=Math.round(E);if(T<0||T>v){wn();return}const x=d.find(A=>A.year===T);if(!x){wn();return}const R=`
      <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
        <strong style="color:#f0c674;">Year ${T}</strong>
      </div>
      <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
        <span style="color:#8b8b9b;">95th percentile:</span><span>${de(x.p95)}</span>
        <span style="color:#8b8b9b;">75th percentile:</span><span>${de(x.p75)}</span>
        <span style="color:#8b8b9b;">Median (50th):</span><span style="color:#f0c674;font-weight:bold;">${de(x.p50)}</span>
        <span style="color:#8b8b9b;">25th percentile:</span><span>${de(x.p25)}</span>
        <span style="color:#8b8b9b;">10th percentile:</span><span style="color:#f85149;">${de(x.p10)}</span>
        <span style="color:#8b8b9b;">5th percentile:</span><span>${de(x.p5)}</span>
      </div>
    `;sc(s.clientX,s.clientY,R)};n._coneHoverListener=r,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",wn)}function Tb(n,t){const e=n._trajHoverListener;e&&n.removeEventListener("mousemove",e);const r=n._trajLeaveListener;r&&n.removeEventListener("mouseleave",r);const s=a=>{const l=Zn.get(n.id);if(!l||l.type!=="trajectory")return;const c=n.getBoundingClientRect(),d=n.width/c.width,f=n.height/c.height,m=(a.clientX-c.left)*d,v=(a.clientY-c.top)*f,{paths:E,padding:T,chartWidth:x,chartHeight:R}=l;if(m<T.left||m>T.left+x||v<T.top||v>T.top+R){wn(),Er!==-1&&(Er=-1,fa(n,l,t,null));return}let A=null,D=12*d;E.filter(C=>C.failed).forEach(C=>{for(let V=0;V<C.pts.length-1;V++){const O=yd(m,v,C.pts[V].x,C.pts[V].y,C.pts[V+1].x,C.pts[V+1].y);O<D&&(D=O,A=C)}}),A||E.filter(C=>!C.failed).forEach(C=>{for(let V=0;V<C.pts.length-1;V++){const O=yd(m,v,C.pts[V].x,C.pts[V].y,C.pts[V+1].x,C.pts[V+1].y);O<D&&(D=O,A=C)}});const N=A?A.idx:-1;if(N!==Er&&(Er=N,fa(n,l,t,A)),A){const C=A.run,V=A.failed?"#f85149":"#2ea043",O=A.failed?"❌":"✅",b=A.failed?"FAILED":"SUCCESS";let g=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${V};">${O} ${b}</strong>
          <span style="float:right;color:#8b8b9b;font-size:11px;">Run #${A.idx+1}</span>
        </div>
        <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
      `;C.startYear&&(g+=`<span style="color:#8b8b9b;">Start year:</span><span>${C.startYear}</span>`),g+=`<span style="color:#8b8b9b;">Duration:</span><span>${C.years.toFixed(1)} years</span>`,g+=`<span style="color:#8b8b9b;">Final balance:</span><span>${de(C.final)}</span>`,g+=`<span style="color:#8b8b9b;">Protection months:</span><span>${C.protMonths}</span>`,g+=`<span style="color:#8b8b9b;">Longest streak:</span><span>${C.maxConsec} months</span>`,C.hodlUsed>0&&(g+=`<span style="color:#8b8b9b;">HODL used:</span><span>${de(C.hodlUsed)}</span>`),g+="</div>",A.failed&&C.failMonth&&(g+=`<div style="margin-top:8px;padding-top:8px;border-top:1px solid #555;color:#f0c674;">💀 Depleted at year ${(C.failMonth/12).toFixed(1)}</div>`),sc(a.clientX,a.clientY,g)}else wn()},i=()=>{if(wn(),Er!==-1){Er=-1;const a=Zn.get(n.id);a&&fa(n,a,t,null)}};n._trajHoverListener=s,n._trajLeaveListener=i,n.addEventListener("mousemove",s),n.addEventListener("mouseleave",i)}function Ib(n,t){const e=n._histHoverListener;e&&n.removeEventListener("mousemove",e);const r=s=>{const i=Zn.get(n.id);if(!i||i.type!=="histogram")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=n.height/a.height,d=(s.clientX-a.left)*l,f=(s.clientY-a.top)*c,{bars:m,totalRuns:v}=i;let E=null;if(m.forEach(T=>{d>=T.x&&d<=T.x+T.w&&f>=T.y&&f<=T.y+T.h&&(E=T)}),E){const T=E.months===0,x=T?"#2ea043":"#e1b12c",R=T?"🟢":"🟡",A=T?"No Protection":`${E.months}${E.monthsEnd>E.months?`-${E.monthsEnd}`:""} months`,D=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${x};">${R} ${A}</strong>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;">
          <span style="color:#8b8b9b;">Runs:</span><span>${E.count} of ${v}</span>
          <span style="color:#8b8b9b;">Percentage:</span><span>${E.pct}%</span>
        </div>
      `;sc(s.clientX,s.clientY,D)}else wn()};n._histHoverListener=r,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",wn)}function fa(n,t,e,r){const s=n.getContext("2d"),{width:i,height:a}=n,{paths:l,xScale:c,yScale:d,padding:f,chartWidth:m,chartHeight:v,years:E,maxValue:T,glide:x}=t;s.fillStyle="rgba(15,15,26,1)",s.fillRect(f.left,f.top,m,v),s.strokeStyle=e.grid,s.lineWidth=1;for(let R=0;R<=5;R++){const A=f.top+R/5*v;s.beginPath(),s.moveTo(f.left,A),s.lineTo(i-f.right,A),s.stroke()}x&&x.length>0&&(s.strokeStyle=e.glidepath,s.lineWidth=1.5,s.setLineDash([4,2]),s.beginPath(),x.forEach((R,A)=>{const D=c(R.year),N=d(R.min);A===0?s.moveTo(D,N):s.lineTo(D,N)}),s.stroke(),s.setLineDash([])),l.forEach(R=>{if(r&&R.idx===r.idx)return;const A=r?.15:R.failed?.8:.25;s.strokeStyle=R.failed?`rgba(248,81,73,${A})`:`rgba(46,160,67,${A})`,s.lineWidth=R.failed?2:.5,s.beginPath(),R.pts.forEach((D,N)=>{N===0?s.moveTo(D.x,D.y):s.lineTo(D.x,D.y)}),s.stroke()}),r&&(s.strokeStyle=r.failed?e.trajectoryFailedHover:e.trajectoryHover,s.lineWidth=4,s.shadowColor=r.failed?e.trajectoryFailedHover:e.trajectoryHover,s.shadowBlur=8,s.beginPath(),r.pts.forEach((R,A)=>{A===0?s.moveTo(R.x,R.y):s.lineTo(R.x,R.y)}),s.stroke(),s.shadowBlur=0),s.strokeStyle=e.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(f.left,d(0)),s.lineTo(i-f.right,d(0)),s.stroke(),s.setLineDash([])}function sc(n,t,e){let r=document.getElementById("chartTooltip");r||(r=document.createElement("div"),r.id="chartTooltip",document.body.appendChild(r)),r.innerHTML=e,r.style.display="block",r.style.left=n+15+"px",r.style.top=t-10+"px"}function wn(){const n=document.getElementById("chartTooltip");n&&(n.style.display="none")}function Sb(){return`
    /* Chart tooltip - PWA style */
    #chartTooltip {
      position: fixed;
      background: rgba(22,27,34,0.95);
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 13px;
      line-height: 1.5;
      color: #c9d1d9;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      pointer-events: none;
      z-index: 10000;
      display: none;
      max-width: 280px;
    }

    #chartTooltip strong {
      display: block;
      font-size: 14px;
    }

    /* Mobile-first chart containers */
    .chart-container {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .chart-container canvas {
      display: block;
      min-width: 600px;
      height: auto;
    }

    /* Scrollable wrapper for charts on mobile */
    .chart-scroll-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 0 -12px;
      padding: 0 12px;
    }

    /* Chart grid for side-by-side layout */
    .chart-grid {
      display: grid;
      gap: 16px;
    }

    @media (min-width: 1024px) {
      .chart-grid {
        grid-template-columns: 1fr 1fr;
      }
      .chart-container canvas {
        min-width: unset;
        width: 100%;
      }
    }

    @media (max-width: 600px) {
      .chart-container {
        padding: 8px;
        margin: 8px 0;
        border-radius: 6px;
      }

      .chart-container canvas {
        min-width: 500px;
      }

      #chartTooltip {
        font-size: 12px;
        padding: 10px 12px;
        max-width: 220px;
      }
    }

    /* Mobile scroll indicator */
    .chart-scroll-hint {
      display: none;
      text-align: center;
      color: var(--text-muted);
      font-size: 12px;
      padding: 4px;
    }

    @media (max-width: 768px) {
      .chart-scroll-hint {
        display: block;
      }
    }
  `}window._simEngine={runMonteCarlo:Wf,runHistorical:Yf,simulate:No};window._constants={EQUITY_RETURNS:Cs,INFLATION:Ha};window._mathUtils={seededRng:Ya};let Ab=null,xb=null;const np=document.createElement("style");np.textContent=DE()+ib()+gb()+KE()+Sb();document.head.appendChild(np);const ic=document.getElementById("globalLoadingOverlay"),Rb=ic.querySelector(".loading-text");function De(n="Loading..."){Rb.textContent=n,ic.classList.add("active")}function Me(){ic.classList.remove("active")}function it(n,t="info",e=3e3){const r=document.querySelector(".toast-notification");r&&r.remove();const s=document.createElement("div");s.className=`toast-notification ${t}`,s.innerHTML=`
        <span class="toast-icon">${t==="success"?"✓":t==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${n}</span>
      `,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("show")),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},e)}document.getElementById("versionDisplay").textContent=`v${Ed}`;document.getElementById("entryMonth").value=Lp();function io(n){const t=document.getElementById(n+"SpWeeklyAmount"),e=document.getElementById(n+"SpAnnualAmount");if(!t||!e)return;const r=parseFloat(t.value)||0,s=r*52;r>0?e.value="£"+s.toLocaleString("en-GB",{maximumFractionDigits:2}):e.value=""}["ds","ss"].forEach(n=>{const t=document.getElementById(n+"SpWeeklyAmount");t&&t.addEventListener("input",()=>io(n))});function Pb(n){const t=parseFloat(n);return isNaN(t)?"":t.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function rp(){document.querySelectorAll('input[type="number"]').forEach(t=>{t.value,t.addEventListener("focus",function(e){setTimeout(()=>{this.select()},0)}),t.addEventListener("click",function(e){!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&this.select()})})}function sp(){document.querySelectorAll('input[type="number"]').forEach(t=>{if(t.dataset.formatted)return;t.dataset.formatted="true";const e=t.closest(".input-with-unit")||t.parentElement,r=t.closest(".input-with-unit")!==null,s=document.createElement("span");s.className="number-format-overlay";const i=r?"34px":"14px";s.style.cssText=`
          position: absolute;
          left: ${i};
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: inherit;
          font-size: inherit;
          font-family: inherit;
          background: transparent;
          z-index: 1;
        `,getComputedStyle(e).position==="static"&&(e.style.position="relative");function a(){const l=parseFloat(t.value);!isNaN(l)&&l>=1e3&&document.activeElement!==t?(s.textContent=Pb(l),s.style.display="block",t.style.color="transparent"):(s.style.display="none",t.style.color="")}t._updateOverlay=a,t.addEventListener("focus",()=>{s.style.display="none",t.style.color=""}),t.addEventListener("blur",a),t.addEventListener("input",()=>{document.activeElement===t&&(s.style.display="none",t.style.color="")}),e.appendChild(s),a()})}function Oo(){document.querySelectorAll('input[type="number"]').forEach(n=>{n._updateOverlay&&n._updateOverlay()})}setTimeout(()=>{rp(),sp()},100);const Cb=new MutationObserver(n=>{let t=!1;n.forEach(e=>{e.addedNodes.forEach(r=>{var s,i;r.nodeType===1&&((s=r.matches)!=null&&s.call(r,'input[type="number"]')||(i=r.querySelector)!=null&&i.call(r,'input[type="number"]'))&&(t=!0)})}),t&&setTimeout(()=>{rp(),sp()},50)});Cb.observe(document.body,{childList:!0,subtree:!0});let Ar=null;async function ip(n,t="decision"){Ua(),mb(),document.getElementById("mainApp").classList.remove("hidden"),document.getElementById("userEmail").textContent=n.email,await Sn(),await ii(),kb(),t==="stress"&&(document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),document.querySelector('.tab[data-tab="stress"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById("stress-content").classList.add("active"))}async function kb(){try{const n=await Pn(),t=await rr();document.getElementById("entryEquity").value=t.equityMin||25e4,document.getElementById("entryBond").value=t.bondMin||2e5,document.getElementById("entryCash").value=t.cashTarget||5e4,document.getElementById("dsEquityMin").value=t.equityMin||25e4,document.getElementById("dsBondMin").value=t.bondMin||2e5,document.getElementById("dsCashTarget").value=t.cashTarget||5e4,document.getElementById("dsDuration").value=t.duration||35,document.getElementById("dsBaseSalary").value=t.baseSalary||3e4,document.getElementById("dsSpStartDate").value=t.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=t.spWeeklyAmount||"",io("ds"),document.getElementById("dsProtectionFactor").value=t.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=t.recoveryBuffer||1e4,document.getElementById("dsConsecutiveLimit").value=t.consecutiveLimit||3,["mc","hist","scen"].forEach(e=>{const r=document.getElementById(e+"Equity"),s=document.getElementById(e+"Bond"),i=document.getElementById(e+"Cash"),a=document.getElementById(e+"Years");r&&(r.value=n.equityMin),s&&(s.value=n.bondMin),i&&(i.value=n.cashTarget),a&&(a.value=n.duration)}),document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",io("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,Oo(),console.log("All inputs initialized from stored settings")}catch(n){console.error("Error initializing inputs from settings:",n)}}async function qa(n){console.log("Wizard completed with data:",n);try{await Kl({baseSalary:n.decisionSalary,equityMin:n.decisionEquity,bondMin:n.decisionBond,cashTarget:n.decisionCash,duration:n.decisionDuration,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount}),await Zl({baseSalary:n.baseSalary,other:n.otherIncome,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,duration:n.duration,taxMode:n.taxMode}),document.getElementById("entryEquity").value=n.decisionEquity,document.getElementById("entryBond").value=n.decisionBond,document.getElementById("entryCash").value=n.decisionCash,document.getElementById("mcEquity").value=n.equityMin,document.getElementById("mcBond").value=n.bondMin,document.getElementById("mcCash").value=n.cashTarget,document.getElementById("mcYears").value=n.duration,Oo()}catch(e){console.error("Error saving wizard settings:",e)}const t=ti();ip(t,"stress")}ZE(document.getElementById("authScreen"),async n=>{console.log("Auth success callback triggered for:",n.email);try{console.log("Checking for existing cloud data...");const t=await aE();console.log("Has cloud data:",t),t?(console.log("Existing user - showing main app"),ip(n)):(console.log("New user - showing setup wizard"),Ua(),document.getElementById("setupWizard").style.display="block",$a(document.getElementById("setupWizard"),qa))}catch(t){console.error("Error in auth callback:",t),Ua(),document.getElementById("setupWizard").style.display="block",$a(document.getElementById("setupWizard"),qa)}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{await Uf(),document.getElementById("mainApp").classList.add("hidden"),tp()}catch(n){console.error("Logout error:",n)}});const Db=60*60*1e3;let pa=null;function op(){pa&&clearTimeout(pa),me()&&(pa=setTimeout(async()=>{if(me()){alert("You have been logged out due to inactivity (1 hour).");try{await Uf(),document.getElementById("mainApp").classList.add("hidden"),tp()}catch(n){console.error("Auto-logout error:",n)}}},Db))}const Mb=["mousedown","mousemove","keydown","scroll","touchstart","click"];Mb.forEach(n=>{document.addEventListener(n,()=>{op()},{passive:!0})});op();document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await oE(),console.log("Data wiped successfully"),lE(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden"),document.getElementById("setupWizard").style.display="block",$a(document.getElementById("setupWizard"),qa),alert("All data has been deleted. Please complete the setup wizard to start fresh.")}catch(e){console.error("Reset error:",e),alert("Error resetting data: "+e.message)}});document.querySelectorAll(".tab").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active")),document.getElementById(`${n.dataset.tab}-content`).classList.add("active"),n.dataset.tab==="history"&&await Sn(),n.dataset.tab==="taxyears"&&await ii(),n.dataset.tab==="stress"&&await oc()})});const ms=document.querySelector(".tabs"),vd=document.querySelector(".tabs-wrapper");if(ms&&vd){const n=()=>{const t=ms.scrollLeft+ms.clientWidth>=ms.scrollWidth-10;vd.classList.toggle("scrolled-end",t)};ms.addEventListener("scroll",n),n()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>t.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(t=>t.classList.add("hidden")),document.getElementById(`stress-${n.dataset.stresstab}`).classList.remove("hidden"),n.dataset.stresstab==="stresssettings"&&await oc()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>t.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(t=>t.classList.add("hidden")),document.getElementById(`decision-${n.dataset.decisiontab}`).classList.remove("hidden"),n.dataset.decisiontab==="decisionsettings"&&await lp()})});function Nb(n){const[t,e]=n.split("-").map(Number);return e>=4?t%100+"/"+(t+1)%100:(t-1)%100+"/"+t%100}function Lb(n){const[t,e]=n.split("-").map(Number);return Math.max(0,(e>=4?t:t-1)-2026)}function ma(n,t,e,r,s){if(s){const i=Math.max(0,1-t/e);return n*r*i}return n*r}function _d(n,t,e){return n<=t?n:n<=e?t+(n-t)*.8:t+(e-t)*.8+(n-e)*.6}async function wd(n,t,e,r){var rs,en,mr,gr;const s=await rr(),i=await Jr(),a=await Rn(),l=Nb(n),c=Lb(n),[d,f]=n.split("-").map(Number);if(!a[l])throw new Error(`Tax year ${l} is not configured. Please add it in the Settings tab before calculating.`);const m=a[l],v=m.pa||12570,E=m.brl||50270,T=m.other||0,x=m.isTaxEfficient!==!1,R=m.isaSavingsAllocation||0,A=m.grossIncomeToDate||0,D=m.confirmedSalary||s.baseSalary,N=i.find(J=>J.date===n),C=(N==null?void 0:N.isa)||0,V=Math.max(0,(m.isaSavingsUsed||0)-C),b=(await Jl(l)).amount||0;let g=1;for(let J=0;J<c;J++){const Dt=String((26+J)%100).padStart(2,"0")+"/"+String((27+J)%100).padStart(2,"0"),mt=(a[Dt]||{}).cpi||.04;g*=1+mt}const y=Math.round(ma(s.equityMin,c,s.duration,g,!0)),_=Math.round(ma(s.bondMin,c,s.duration,g,!0)),I=Math.round(ma(s.cashTarget,c,s.duration,g,!1)),S=t+e,w=y+_;let at=!1,kt=0;const Z=i.filter(J=>J.date<n);for(let J=Z.length-1;J>=0&&Z[J].source==="Cash";J--)kt++;Z.length&&Z[Z.length-1].inProtection&&(at=S<=w+(s.recoveryBuffer||1e4)),!at&&S<w&&kt+1>=(s.consecutiveLimit||3)&&(at=!0);const It=f>=4?16-f:4-f,ct=Math.max(1,It),ht=D*g,Nt=T+b;let ut,_t,$,wt=0,X=0,ot=!1,Lt=0;const ue=Math.max(0,R-V)/ct;if(x){const J=Nt/12;i.filter(gt=>gt.taxYear===l&&gt.date<n);const Dt=ht/12;let mt;if(((en=(rs=m.expectedMonthly)==null?void 0:rs.sipp)==null?void 0:en.gross)>0)mt=m.expectedMonthly.sipp.gross;else{const St=Math.max(0,E-A-Nt)/12;mt=Math.min(Dt-J,St)}const Oe=_d(ht,v,E)/12,ge=Math.min(ht,E),ye=_d(ge,v,E)/12,yt=Math.max(0,Oe-ye),bt=Math.min(yt,ue);if(Lt=bt,wt=mt,at){const gt=(s.protectionFactor||20)/100;ut=mt*(1-gt),_t=bt,$="Protection"}else{ut=mt,_t=bt,$="Tax-Efficient";const gt=f>=4?d:d-1,St=Z.filter(At=>{const[Nn,yr]=At.date.split("-").map(Number);return(yr>=4?Nn:Nn-1)===gt});let Zt=0,Mn=0;if(St.forEach(At=>{Mn+=At.sipp||0,At.inProtection&&At.stdSipp&&(Zt+=At.stdSipp-At.sipp),At.boostAmount>0&&(Zt-=At.boostAmount)}),Zt>0){const At=Mn+ut*ct+Nt,Nn=E-At,yr=S-w-(s.recoveryBuffer||1e4);if(Nn>0&&yr>0){const Ln=Nn/ct,ci=Zt/ct,ss=yr/ct;X=Math.min(ci,Ln,ss),X>50&&(ut+=X,$="Tax Boost")}}}}else{const J=ht/12,Dt=Nt/12;let mt;if(((gr=(mr=m.expectedMonthly)==null?void 0:mr.sipp)==null?void 0:gr.gross)>0?mt=m.expectedMonthly.sipp.gross:mt=Math.max(0,J-Dt),wt=mt,_t=0,at){const Oe=(s.protectionFactor||20)/100;ut=mt*(1-Oe),$="Protection";const ge=f>=4?d:d-1,ye=Z.filter(gt=>{const[St,Zt]=gt.date.split("-").map(Number);return(Zt>=4?St:St-1)===ge});let yt=0;ye.forEach(gt=>{yt+=gt.sipp||0});const bt=yt+ut*ct+Nt;if(bt<E){const St=(E-bt)/ct,Zt=S-w-(s.recoveryBuffer||1e4);Zt>0&&St>50&&(X=Math.min(St,Zt/ct),X>50&&(ut+=X,ot=!0,$="Protection-Induced Efficiency"))}}else{ut=mt,$="Tax-Inefficient";const Oe=f>=4?d:d-1,ge=Z.filter(bt=>{const[gt,St]=bt.date.split("-").map(Number);return(St>=4?gt:gt-1)===Oe});let ye=0,yt=0;if(ge.forEach(bt=>{yt+=bt.sipp||0,bt.inProtection&&bt.stdSipp&&(ye+=bt.stdSipp-bt.sipp),bt.boostAmount>0&&(ye-=bt.boostAmount)}),ye>0){const bt=yt+ut*ct+Nt,gt=E-bt,St=S-w-(s.recoveryBuffer||1e4);if(gt>0&&St>0){const Zt=gt/ct,Mn=ye/ct,At=St/ct;X=Math.min(Mn,Zt,At),X>50&&(ut+=X,$="Tax Boost")}}}}let Vt,be,ir=0,or=0,Cn=0,kn="";if(!at&&S>=w+ut){Vt="Growth";const J=Math.max(0,t-y),Dt=Math.max(0,e-_),mt=J+Dt;mt>0?(ir=ut*J/mt,or=ut*Dt/mt,be="Healthy"):(Vt="Cash",Cn=ut,be="At min")}else Vt="Cash",Cn=ut,be=at?"Protection":"Below min",r<ut&&(kn="Cash low!");let Te="";const ar=t-y,lr=e-_;if(ar>5e3&&lr<-5e3){const J=Math.floor(Math.min(ar,-lr)/1e3)*1e3;J>=5e3&&(Te=`Move £${J.toLocaleString()} Equity→Bond`)}else if(lr>5e3&&ar<-5e3){const J=Math.floor(Math.min(lr,-ar)/1e3)*1e3;J>=5e3&&(Te=`Move £${J.toLocaleString()} Bond→Equity`)}let cr="";const ur=I-r;if(ur>5e3&&Vt==="Growth"&&!at){const J=S-w-ut;if(J>1e4){const Dt=Math.floor(Math.min(ur*.3,J*.5)/1e3)*1e3;Dt>=5e3&&(cr=`Replenish Cash: Move £${Dt.toLocaleString()} from growth funds`)}}const tn=[];kn&&tn.push({message:kn,severity:"danger",type:"low-cash"}),X>50&&tn.push({message:`Tax Boost: +£${Math.round(X).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),Te&&tn.push({message:Te,severity:"warning",type:"rebalance"}),cr&&tn.push({message:cr,severity:"info",type:"cash-replenish"});const Bo=f>=4?d:d-1,dr=Z.filter(J=>{const[Dt,mt]=J.date.split("-").map(Number);return(mt>=4?Dt:Dt-1)===Bo}),Xr=dr.reduce((J,Dt)=>J+(Dt.sipp||0),0),hr=dr.length+1,Ut=Math.max(0,12-hr)*wt,Le=Xr+ut+Ut+T+b;let Ve=0;Le>v&&(Le<=E?Ve=(Le-v)*.2:Ve=(E-v)*.2+(Le-E)*.4);const oi=Ve/12,ts=ut+T/12+b/12-oi+_t,ai=oi*hr,es=Ve,pr=ht/12;let ns=0;pr*12>v&&(pr*12<=E?ns=(pr*12-v)*.2:ns=(E-v)*.2+(pr*12-E)*.4);const Dn=Math.max(0,ns/12-Ve/12),li=V+Lt;return{date:n,taxYear:l,yearNumber:c,remainingMonths:ct,equity:t,bond:e,cash:r,isa:0,adjEquityMin:y,adjBondMin:_,adjCashTarget:I,pa:v,brl:E,other:T/12,statePension:b/12,sippDraw:ut,stdSipp:wt,isaDraw:_t,totalMonthlyNet:ts,isTaxEfficientYear:x,yearlyIsaSavingsAllocation:R,cumulativeIsaSavingsUsed:li,isaSavingsUsedThisMonth:Lt,taxPaidYTD:ai,taxProjectedAnnual:es,taxSavedMonthly:Dn,taxSavedYTD:Dn*hr,taxSavedProjectedAnnual:Dn*12,taxEfficient:x&&!ot,inProtection:at,protectionReason:at?be:null,consecutiveCashDraws:kt,protectionInducedTaxEfficiency:ot,boostAmount:X>50?X:0,boostEligible:X>50,source:Vt,drawFromEquity:ir,drawFromBond:or,drawFromCash:Cn,rebalanceNeeded:Te!=="",rebalanceActions:Te?[Te]:[],alerts:tn,calculationDetails:{mode:$,reason:`${be} | ${$}`,totalGrowth:S,minGrowth:w,consec:kt,stdSipp:ut,inputs:{baseSalary:s.baseSalary,confirmedSalary:D,targetGross:ht,cumInf:g,yearNum:c,taxYear:l,OTHER:T,STATE:b,PA:v,BRL:E,isTaxEfficientYear:x,yearlyIsaSavingsAllocation:R,grossIncomeToDate:A},taxInfo:{annualTaxable:Le,headroomToBRL:E-Le,annualTax:Ve,monthlyNet:ts}}}}window.handleDecisionSubmit=async function(n){n.preventDefault();const t=document.getElementById("entryMonth").value,e=parseFloat(document.getElementById("entryEquity").value)||0,r=parseFloat(document.getElementById("entryBond").value)||0,s=parseFloat(document.getElementById("entryCash").value)||0,i=[];if(t||i.push("Month"),!e&&e!==0&&i.push("Equity Fund"),!r&&r!==0&&i.push("Bond Balance"),!s&&s!==0&&i.push("Cash Balance"),i.length>0){it("Missing: "+i.join(", "),"error",4e3);return}if((await Jr({limit:1e3})).find(c=>c.date===t)){it(`${qr(t)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await UE(t)).showWizard){const f=document.getElementById("taxYearWizard");f.style.display="block",window._pendingDecisionForm={dateStr:t,equity:e,bond:r,cash:s},FE(f,t,async m=>{if(f.style.display="none",m&&m.completed)try{Ar=await wd(t,e,r,s);const v=document.getElementById("decisionOutput");ud(Ar,v),document.getElementById("saveBtn").disabled=!1}catch(v){console.error("Decision error after wizard:",v),it("Error: "+v.message,"error")}});return}Ar=await wd(t,e,r,s);const d=document.getElementById("decisionOutput");ud(Ar,d),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),it("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const n=document.getElementById("saveBtn");if(!Ar){it("No decision to save","error");return}if(!me()){it("Please sign in to save decisions","error");return}n.classList.add("loading"),n.disabled=!0;try{await mE(Ar),it("Decision saved to history","success"),await Sn()}catch(t){console.error("Save error:",t),it("Error saving: "+t.message,"error"),n.disabled=!1}finally{n.classList.remove("loading")}};window.runMonteCarloUI=async function(){const n={equityStart:parseFloat(document.getElementById("mcEquity").value)||25e4,bondStart:parseFloat(document.getElementById("mcBond").value)||2e5,cashStart:parseFloat(document.getElementById("mcCash").value)||5e4,years:parseInt(document.getElementById("mcYears").value)||35};document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await Pn(),setTimeout(()=>{try{const{results:t,stats:e}=QE(n);Ab=t,ap(e,t,"Monte Carlo (1000 runs)","mcResults",n.years)}catch(t){console.error("Simulation error:",t),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}},50)};window.runHistoricalUI=async function(){const n={equityStart:parseFloat(document.getElementById("histEquity").value)||25e4,bondStart:parseFloat(document.getElementById("histBond").value)||2e5,cashStart:parseFloat(document.getElementById("histCash").value)||5e4,years:parseInt(document.getElementById("histYears").value)||35};document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await Pn(),setTimeout(()=>{try{const{results:t,stats:e}=JE(n);xb=t,ap(e,t,"Historical Analysis","histResults",n.years)}catch(t){console.error("Simulation error:",t),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}},50)};window.runScenariosUI=async function(){const n={equityStart:parseFloat(document.getElementById("scenEquity").value)||25e4,bondStart:parseFloat(document.getElementById("scenBond").value)||2e5,cashStart:parseFloat(document.getElementById("scenCash").value)||5e4,years:35};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',await Pn(),setTimeout(()=>{try{const t=XE(n);Ub(t,"scenResults")}catch(t){console.error("Scenario error:",t),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}},50)};function Vb(n){if(!n.spStartDate||!n.spWeeklyAmount)return console.warn("State Pension not configured - spStartDate or spWeeklyAmount missing"),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const t=Ob(n.spStartDate);if(!t)return console.warn("Could not parse spStartDate:",n.spStartDate),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const e=new Date,r=365.25*24*60*60*1e3,s=Math.max(0,(t.getTime()-e.getTime())/r),i=Math.floor(s);t.getMonth(),t.getDate();const a=365,l=Math.floor((t-new Date(t.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function Ob(n){if(!n)return null;if(/^\d{4}-\d{2}-\d{2}$/.test(n))return new Date(n);if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,s,i]=n.split("/").map(Number);return new Date(i,s-1,r)}const t={january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};let e=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})$/i);if(e){const r=parseInt(e[1]),s=t[e[2].toLowerCase()],i=parseInt(e[3]);if(s!==void 0)return new Date(i,s,r)}if(e=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\d{4})$/i),e){const r=t[e[1].toLowerCase()],s=parseInt(e[2]),i=parseInt(e[3]);if(r!==void 0)return new Date(i,r,s)}return null}let ga=!1;window.runOptimisationUI=async function(n){if(ga)return;ga=!0;const t=document.getElementById("optimiseBtn"+n),e=document.getElementById("optimiseResults"+n);t&&(t.disabled=!0),t&&(t.textContent="Optimising...");let r,s,i,a;n==="MC"?(r=document.getElementById("mcEquity"),s=document.getElementById("mcBond"),i=document.getElementById("mcCash"),a=document.getElementById("mcYears")):(r=document.getElementById("histEquity"),s=document.getElementById("histBond"),i=document.getElementById("histCash"),a=document.getElementById("histYears"));const l=+r.value,c=+s.value,d=+i.value,f=+a.value,m=l+c+d;e.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations...</div>';const v=await Pn(),E=JSON.parse(JSON.stringify(v));setTimeout(()=>{try{let T=null,x={equity:l,bond:c,cash:d,rate:0,avgProt:0,withProt:0,totalRuns:0};const R=[];for(let I=5;I<=30;I+=5)for(let S=20;S<=95-I;S+=5){const w=100-I-S;w>=0&&R.push({equity:Math.round(m*S/100),bond:Math.round(m*w/100),cash:Math.round(m*I/100)})}const{EQUITY_RETURNS:A,INFLATION:D}=window._constants,{simulate:N}=window._simEngine,{seededRng:C}=window._mathUtils,V=Object.keys(A).map(Number).sort((I,S)=>I-S),O=Math.max(...V),b=I=>{const S={equityStart:I.equity,bondStart:I.bond,cashStart:I.cash,years:f,equityMin:E.equityMin,bondMin:E.bondMin,cashTarget:E.cashTarget,duration:E.duration,baseSalary:E.baseSalary,other:E.other,...Vb(E),pa:E.pa,brl:E.brl,hrl:E.hrl,taxMode:E.taxMode,protectionMult:E.protectionMult,consecutiveLimit:E.consecutiveLimit,disableProtection:E.disableProtection,hodlEnabled:E.hodlEnabled,hodlValue:E.hodlValue},w=[];if(n==="MC")for(let $=0;$<1e3;$++){const wt=C($*12345),X={equity:{},inflation:{}};for(let ot=0;ot<f;ot++){const Lt=V[Math.floor(wt()*V.length)];X.equity[ot]=A[Lt],X.inflation[ot]=D[Lt]||.025}w.push(N(S,X,$))}else V.forEach($=>{if($+f-1>O)return;const wt={equity:{},inflation:{}};for(let X=0;X<f;X++)wt.equity[X]=A[$+X]||0,wt.inflation[X]=D[$+X]||.025;w.push(N(S,wt,$))});const at=w.filter($=>$.failed),kt=w.filter($=>!$.failed),Z=(w.length-at.length)/w.length*100,ct=w.map($=>$.protMonths).reduce(($,wt)=>$+wt,0)/w.length,ht=w.filter($=>$.protMonths>0).length,Nt=kt.map($=>$.final).sort(($,wt)=>$-wt),ut=Nt.length>0?Nt[Math.floor(Nt.length*.5)]:0,_t=Nt.length>0?Nt[Math.floor(Nt.length*.9)]:0;return{equity:I.equity,bond:I.bond,cash:I.cash,rate:Z,avgProt:ct,withProt:ht,totalRuns:w.length,medianFinal:ut,p90Final:_t}},y=b({equity:l,bond:c,cash:d});x.avgProt=y.avgProt,x.withProt=y.withProt,x.totalRuns=y.totalRuns,x.rate=y.rate,x.medianFinal=y.medianFinal,x.p90Final=y.p90Final,R.forEach(I=>{const S=b(I);S.avgProt<=x.avgProt&&(!T||S.rate>T.rate)&&(T=S)});let _="";if(T&&T.rate>x.rate){const I=T.medianFinal-x.medianFinal,S=x.medianFinal>0?I/x.medianFinal*100:0;_+='<div class="card" style="margin-top:20px;border-color:var(--success);">',_+='<h3 style="color:var(--success);margin-top:0;">Better Allocation Found</h3>',_+='<p style="color:var(--text-muted);margin-bottom:16px;">A different fund split could improve your success rate without increasing protection usage:</p>',_+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">',_+='<div style="padding:16px;background:rgba(0,0,0,0.2);border-radius:8px;">',_+='<div style="font-weight:500;margin-bottom:12px;color:var(--text-muted);">Your Current Split</div>',_+='<div style="font-size:24px;font-weight:600;color:var(--warning);">'+x.rate.toFixed(1)+"%</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate</div>',_+='<div style="font-size:13px;">Equity: '+H(x.equity)+" ("+Math.round(x.equity/m*100)+"%)</div>",_+='<div style="font-size:13px;">Bonds: '+H(x.bond)+" ("+Math.round(x.bond/m*100)+"%)</div>",_+='<div style="font-size:13px;">Cash: '+H(x.cash)+" ("+Math.round(x.cash/m*100)+"%)</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+x.avgProt.toFixed(0)+" mo | Median final: "+H(x.medianFinal)+"</div>",_+="</div>",_+='<div style="padding:16px;background:rgba(46,160,67,0.1);border-radius:8px;border:1px solid var(--success);">',_+='<div style="font-weight:500;margin-bottom:12px;color:var(--success);">Optimised Split</div>',_+='<div style="font-size:24px;font-weight:600;color:var(--success);">'+T.rate.toFixed(1)+"%</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate (+'+(T.rate-x.rate).toFixed(1)+"%)</div>",_+='<div style="font-size:13px;">Equity: '+H(T.equity)+" ("+Math.round(T.equity/m*100)+"%)</div>",_+='<div style="font-size:13px;">Bonds: '+H(T.bond)+" ("+Math.round(T.bond/m*100)+"%)</div>",_+='<div style="font-size:13px;">Cash: '+H(T.cash)+" ("+Math.round(T.cash/m*100)+"%)</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+T.avgProt.toFixed(0)+" mo | Median final: "+H(T.medianFinal)+"</div>",_+="</div>",_+="</div>",I<0?(_+='<div class="alert alert-warning" style="margin-bottom:16px;">',_+="<strong>Trade-off:</strong> The optimised allocation has a "+Math.abs(S).toFixed(0)+"% lower median final value. ",_+="This is because it likely has less equity exposure. You gain safety but may sacrifice some upside.",_+="</div>"):I>0&&(_+='<div class="alert alert-info" style="margin-bottom:16px;">',_+="<strong>Bonus:</strong> The optimised allocation also has a "+S.toFixed(0)+"% higher median final value!",_+="</div>"),_+='<div class="alert alert-info" style="margin-bottom:16px;">',_+="<strong>To apply this allocation:</strong> Click the button below to update your Settings with these new fund minimums.",_+="</div>",_+='<button onclick="applyOptimisedAllocationUI('+T.equity+","+T.bond+","+T.cash+')" style="width:100%;">Apply Optimised Allocation to Settings</button>',_+="</div>"}else _+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',_+='<h3 style="color:var(--primary);margin-top:0;">Your Allocation is Already Optimal</h3>',_+='<p style="color:var(--text-muted);">We tested '+R.length+" different fund splits. Your current allocation achieves the best success rate ("+x.rate.toFixed(1)+"%) without increasing protection usage.</p>",_+='<p style="font-size:13px;color:var(--text-muted);">Your protection: '+x.avgProt.toFixed(0)+" months average</p>",_+="</div>";e.innerHTML=_}catch(T){console.error("Optimisation error:",T),e.innerHTML='<div class="alert alert-danger">Error: '+T.message+"</div>"}finally{ga=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation")}},50)};window.applyOptimisedAllocationUI=async function(n,t,e){if(document.getElementById("ssEquityMin").value=n,document.getElementById("ssBondMin").value=t,document.getElementById("ssCashTarget").value=e,document.getElementById("dsEquityMin").value=n,document.getElementById("dsBondMin").value=t,document.getElementById("dsCashTarget").value=e,document.getElementById("mcEquity").value=n,document.getElementById("mcBond").value=t,document.getElementById("mcCash").value=e,document.getElementById("histEquity").value=n,document.getElementById("histBond").value=t,document.getElementById("histCash").value=e,document.getElementById("scenEquity").value=n,document.getElementById("scenBond").value=t,document.getElementById("scenCash").value=e,me())try{await Zl({equityMin:n,bondMin:t,cashTarget:e})}catch(r){console.error("Error saving optimised settings:",r)}alert("Settings updated! Run the test again to see the full results with your new allocation.")};const Bb={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function Fb(n){if(!n||n.length===0)return"";const t=n.filter(i=>i.failed).sort((i,a)=>i.years-a.years),e=n.filter(i=>i.protMonths>0).sort((i,a)=>a.protMonths-i.protMonths),r=t.length>0?t.slice(0,5):e.slice(0,5);if(r.length===0)return"";let s=`
        <details style="margin-top: 24px;">
          <summary style="cursor: pointer; font-weight: 600; color: var(--danger); margin-bottom: 10px;">
            ${t.length>0?"Worst Periods (Failed)":"Worst Periods (Most Protection)"}
          </summary>
          <div style="overflow-x: auto;">
            <table class="data-table" style="width: 100%; margin-top: 10px;">
              <thead>
                <tr>
                  <th>Start Year</th>
                  <th>Event</th>
                  <th>Years Survived</th>
                  <th>Protection Months</th>
                  <th>Final Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
      `;return r.forEach(i=>{const a=i.startYear||i.seed,l=Bb[a]||"-",c=i.failed?"danger":"success";s+=`
          <tr>
            <td>${a}</td>
            <td style="font-size: 12px;">${l}</td>
            <td>${i.years.toFixed(1)}</td>
            <td>${i.protMonths}</td>
            <td>${H(i.final)}</td>
            <td style="color: var(--${c});">${i.failed?"FAILED":"OK"}</td>
          </tr>
        `}),s+=`
              </tbody>
            </table>
          </div>
        </details>
      `,s}function ap(n,t,e,r,s){const i=n.successRate>=90?"success":n.successRate>=80?"warning":"danger",a=r.replace("Results",""),l=n.survival||{},c=n.finalValue||{},d=n.protection||{};let f=`
        <div class="card">
          <h2>${e}</h2>

          <!-- Primary Stats -->
          <div class="grid-4" style="margin-bottom: 24px;">
            <div class="stat-box ${i}">
              <div class="stat-value">${n.successRate.toFixed(1)}%</div>
              <div class="stat-label">Success Rate</div>
            </div>
            <div class="stat-box danger">
              <div class="stat-value">${n.failCount}</div>
              <div class="stat-label">Failures</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${(l.p10||n.p10Years||0).toFixed(1)}</div>
              <div class="stat-label">10th %ile Years</div>
            </div>
            <div class="stat-box success">
              <div class="stat-value">${H(c.p50||n.medianFinal||0)}</div>
              <div class="stat-label">Median Final</div>
            </div>
          </div>

          <!-- 7-Point Percentile Stats -->
          <details style="margin-bottom: 20px;">
            <summary style="cursor: pointer; font-weight: 600; color: var(--primary); margin-bottom: 10px;">
              Detailed Percentile Statistics
            </summary>
            <div class="grid-7" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-top: 10px;">
              ${["p5","p10","p25","p50","p75","p90","p95"].map(m=>`
                <div class="stat-box mini">
                  <div class="stat-value" style="font-size: 14px;">${H(c[m]||0)}</div>
                  <div class="stat-label" style="font-size: 10px;">${m.toUpperCase()}</div>
                </div>
              `).join("")}
            </div>
          </details>

          <!-- Protection Stats -->
          <div class="grid-5" style="margin-bottom: 24px;">
            <div class="stat-box">
              <div class="stat-value">${d.runsWithProtection||n.runsWithProtection||0}</div>
              <div class="stat-label">Runs w/ Protection</div>
            </div>
            <div class="stat-box warning">
              <div class="stat-value">${(d.avgMonths||n.avgProtMonths||0).toFixed(0)}</div>
              <div class="stat-label">Avg Protection Mo</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${(d.avgConsecutive||n.avgConsecutive||0).toFixed(1)}</div>
              <div class="stat-label">Avg Consecutive</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${d.maxConsecutive||n.maxConsecutive||0}</div>
              <div class="stat-label">Max Consecutive</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${H(c.avg||n.avgFinal||0)}</div>
              <div class="stat-label">Avg Final (success)</div>
            </div>
          </div>

          <!-- Charts -->
          <div class="chart-row">
            <div class="chart-container">
              <canvas id="${a}ConeChart" width="800" height="400"></canvas>
            </div>
            <div class="chart-container">
              <canvas id="${a}TrajChart" width="800" height="400"></canvas>
            </div>
          </div>

          <div class="chart-container" style="max-width: 600px;">
            <canvas id="${a}HistChart" width="600" height="250"></canvas>
          </div>

          <!-- Worst Periods Table (for historical only) -->
          ${r==="histResults"?Fb(t):""}

          <!-- Result Summary -->
          <div class="alert ${i==="success"?"alert-success":i==="warning"?"alert-warning":"alert-danger"}" style="margin-top: 24px;">
            ${n.successRate>=90?"Excellent! Very high probability of success.":n.successRate>=80?"Good but some downside risk. Consider adjustments.":"Warning: Significant risk of depletion."}
          </div>
        </div>
      `;document.getElementById(r).innerHTML=f,setTimeout(()=>{const m=document.getElementById(`${a}ConeChart`),v=document.getElementById(`${a}TrajChart`),E=document.getElementById(`${a}HistChart`);m&&t&&t.length>0&&yb(m,t,{years:s,title:"Cone of Uncertainty (5th-95th Percentile)"}),v&&t&&t.length>0&&vb(v,t,{years:s,title:"Sample Trajectories (100 runs)"}),E&&t&&t.length>0&&_b(E,t,{title:"Protection Months Distribution"})},50)}function Ub(n,t){let e='<div class="card"><h2>Scenario Analysis</h2>';e+=`
        <div class="chart-container" style="margin-bottom: 24px;">
          <canvas id="scenCompChart" width="900" height="400"></canvas>
        </div>
      `,e+='<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">';for(const[r,s]of Object.entries(n)){const i=s.result,a=i.failed?"danger":"success";e+=`
          <div class="history-item" style="border-left: 4px solid ${s.color};">
            <div>
              <div class="history-date">${s.name}</div>
              <div class="history-details">
                Protection: ${i.protMonths} mo | Max streak: ${i.maxConsec} mo
                ${i.hodlUsed>0?` | HODL used: ${H(i.hodlUsed)}`:""}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 24px; color: var(--${a});">${i.years.toFixed(1)} yrs</div>
              <div style="font-size: 12px; color: var(--${a});">${i.failed?"FAILED":"OK"}</div>
              <div style="font-size: 11px; color: var(--text-muted);">Final: ${H(i.final)}</div>
            </div>
          </div>
        `}e+="</div></div>",document.getElementById(t).innerHTML=e,setTimeout(()=>{const r=document.getElementById("scenCompChart");r&&n&&wb(r,n,{years:35,title:"Scenario Comparison"})},50)}async function oc(){De("Loading settings...");try{const n=await Pn();document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",io("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,Oo()}catch(n){console.error("Error loading stress settings:",n)}finally{Me()}}window.saveStressSettingsUI=async function(){if(!me()){it("Please sign in to save settings","error");return}De("Saving settings...");try{await Zl({baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:+document.getElementById("ssEquityMin").value,bondMin:+document.getElementById("ssBondMin").value,cashTarget:+document.getElementById("ssCashTarget").value,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value}),it("Settings saved successfully","success")}catch(n){console.error("Error saving stress settings:",n),it("Error saving: "+n.message,"error")}finally{Me()}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){De("Resetting settings...");try{await RE(),await oc(),it("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),it("Error resetting: "+n.message,"error")}finally{Me()}}};async function lp(){De("Loading settings...");try{const n=await rr();document.getElementById("dsEquityMin").value=n.equityMin||25e4,document.getElementById("dsBondMin").value=n.bondMin||2e5,document.getElementById("dsCashTarget").value=n.cashTarget||5e4,document.getElementById("dsDuration").value=n.duration||35,document.getElementById("dsBaseSalary").value=n.baseSalary||3e4,document.getElementById("dsProtectionFactor").value=n.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=n.recoveryBuffer||15e3,document.getElementById("dsConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("entryEquity").value=n.equityMin||25e4,document.getElementById("entryBond").value=n.bondMin||2e5,document.getElementById("entryCash").value=n.cashTarget||5e4,Oo()}catch(n){console.error("Error loading decision settings:",n)}finally{Me()}}window.saveDecisionSettingsUI=async function(){if(!me()){it("Please sign in to save settings","error");return}De("Saving settings...");try{await Kl({equityMin:+document.getElementById("dsEquityMin").value,bondMin:+document.getElementById("dsBondMin").value,cashTarget:+document.getElementById("dsCashTarget").value,duration:+document.getElementById("dsDuration").value,baseSalary:+document.getElementById("dsBaseSalary").value,spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value}),it("Settings saved successfully","success")}catch(n){console.error("Error saving decision settings:",n),it("Error saving: "+n.message,"error")}finally{Me()}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){De("Resetting settings...");try{await Kl({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await lp(),it("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),it("Error resetting: "+n.message,"error")}finally{Me()}}};window.showDrawdownScheduleUI=async function(){const n=parseFloat(document.getElementById("ddInflation").value)/100||.025,t=parseInt(document.getElementById("ddDuration").value)||35;try{const e=await Pn();e.duration=t;const r=Fp(e,t,n);let s='<div class="card"><h2>Projected SIPP Drawdown Schedule</h2>';s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>BRL</th><th>Other</th><th>State</th><th>SIPP Draw</th><th>Tax</th><th>Net</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${H(i.brl)}</td>
            <td>${H(i.other)}</td>
            <td>${H(i.statePension)}</td>
            <td style="color: var(--primary); font-weight: 600;">${H(i.sippDraw)}</td>
            <td style="color: var(--danger);">-${H(i.tax)}</td>
            <td style="color: var(--success);">${H(i.netIncome)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=s}catch(e){console.error("Drawdown error:",e),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}};window.showGlidepathUI=async function(){const n=parseFloat(document.getElementById("gpInflation").value)/100||.025,t=parseInt(document.getElementById("gpDuration").value)||35;try{const e=await Pn();e.duration=t;const r=zp(e,n);let s='<div class="card"><h2>Fund Glidepath (Inflation-Adjusted Minimums)</h2>';s+='<div class="alert alert-info" style="margin-bottom: 20px;">',s+="<strong>Glidepath Logic:</strong> Equity & Bond minimums inflate with CPI but deplete linearly to £0. Cash inflates only (maintains real value).",s+="</div>",s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>Cum Inflation</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Total Min</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${(i.cumulativeInflation*100-100).toFixed(1)}%</td>
            <td style="color: var(--success);">${H(i.equityMin)}</td>
            <td style="color: var(--info);">${H(i.bondMin)}</td>
            <td style="color: var(--warning);">${H(i.cashTarget)}</td>
            <td style="font-weight: 600;">${H(i.totalMin)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=s}catch(e){console.error("Glidepath error:",e),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}};let he=null,ln=[],Se="all";async function Sn(){const n=document.getElementById("historyTabs"),t=document.getElementById("historyDetail"),e=document.getElementById("historyYearFilter"),r=document.getElementById("deleteAllHistoryBtn"),s=document.getElementById("deleteYearBtn");if(!n||!t)return;if(n.innerHTML='<span class="loading">Loading...</span>',ln=await Jr({sortDesc:!1,limit:500}),r&&(r.style.display=ln.length>0?"":"none"),s&&(s.style.display="none"),ln.length===0){n.innerHTML="",e&&(e.innerHTML='<option value="all">No entries</option>'),t.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const i=[...new Set(ln.map(d=>d.date.split("-")[0]))].sort().reverse();if(e){let d='<option value="all">All Years</option>';i.forEach(f=>{d+=`<option value="${f}">${f}</option>`}),e.innerHTML=d,e.value=Se}s&&(s.style.display=Se!=="all"&&ln.length>0?"":"none");const a=Se==="all"?ln:ln.filter(d=>d.date.startsWith(Se));if(a.length===0){n.innerHTML="",t.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${Se}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let l="";a.forEach(d=>{const f=d.date===he,m=["history-tab"];f&&m.push("active"),d.inProtection&&m.push("protection");const[v,E]=d.date.split("-").map(Number),T=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],x=Se==="all"?`${T[E-1]} ${v}`:T[E-1];l+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${d.date}')">${x}</button>`}),n.innerHTML=l;const c=document.getElementById("historyMobileSelector");if(c){let d="";a.forEach(f=>{const m=qr(f.date),v=f.inProtection?" (Protection)":"";d+=`<option value="${f.date}">${m}${v}</option>`}),c.innerHTML=d}(!he||!a.find(d=>d.date===he))&&(he=a[a.length-1].date),c&&(c.value=he),cp(he),setTimeout(()=>{const d=n.querySelector(".history-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(n){Se=n,he=null,Sn()};function qr(n){const[t,e]=n.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][e-1]} ${t}`}function cp(n){const t=document.getElementById("historyDetail"),e=ln.find(d=>d.date===n);if(!e){t.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const r=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",s=e.isTaxEfficientYear!==!1&&e.mode==="Tax-Efficient",i=e.inProtection?"warning":s?"efficient":"inefficient",a=e.inProtection?`Protection${e.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:s?"Tax-Efficient":"Standard";let l=e.source||"Unknown";e.source==="Growth"&&(e.dEquity>0||e.dBond>0)?l=`Growth (Equity: ${r(e.dEquity||0)}, Bond: ${r(e.dBond||0)})`:e.source==="Cash"&&(l=`Cash (${r(e.dCash||e.sipp||0)})`);let c=`
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${qr(e.date)}</h3>
              <div style="color:var(--text-muted);font-size:13px;">Tax Year ${e.taxYear} • Year ${e.yearNum||0}</div>
            </div>
            <span class="tax-mode-badge ${i}">${a}</span>
          </div>

          ${e.inProtection&&e.reason?`
            <div style="padding:12px;background:rgba(243,156,18,0.1);border-radius:8px;margin-bottom:16px;">
              <strong style="color:var(--warning);">Protection Reason:</strong>
              <span style="color:var(--text);">${e.reason}</span>
            </div>
          `:""}
        </div>

        <!-- Fund Balances -->
        <div class="history-detail-card">
          <h3>Fund Balances</h3>
          <div class="history-grid">
            <div class="history-field">
              <label>Equity</label>
              <span class="value">${r(e.equity)}</span>
            </div>
            <div class="history-field">
              <label>Bond</label>
              <span class="value">${r(e.bond)}</span>
            </div>
            <div class="history-field">
              <label>Cash</label>
              <span class="value">${r(e.cash)}</span>
            </div>
            <div class="history-field">
              <label>Total</label>
              <span class="value" style="color:var(--primary);">${r(e.total)}</span>
            </div>
          </div>

          <!-- Glidepath targets -->
          ${e.adjEquity||e.adjBond||e.adjCash?`
            <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">GLIDEPATH TARGETS</div>
              <div class="history-grid">
                <div class="history-field">
                  <label>Equity Min</label>
                  <span class="value">${r(e.adjEquity)}</span>
                </div>
                <div class="history-field">
                  <label>Bond Min</label>
                  <span class="value">${r(e.adjBond)}</span>
                </div>
                <div class="history-field">
                  <label>Cash Target</label>
                  <span class="value">${r(e.adjCash)}</span>
                </div>
                <div class="history-field">
                  <label>Surplus</label>
                  <span class="value ${(e.total||0)-(e.adjEquity||0)-(e.adjBond||0)-(e.adjCash||0)>=0?"success":"danger"}">
                    ${r((e.total||0)-(e.adjEquity||0)-(e.adjBond||0)-(e.adjCash||0))}
                  </span>
                </div>
              </div>
            </div>
          `:""}
        </div>

        <!-- Monthly Recommendation -->
        <div class="history-detail-card">
          <h3>Monthly Recommendation</h3>
          <div class="history-grid">
            <div class="history-field">
              <label>SIPP Withdrawal</label>
              <span class="value" style="color:var(--primary);">${r(e.sipp)}</span>
            </div>
            <div class="history-field">
              <label>ISA Top-up</label>
              <span class="value">${r(e.isa)}</span>
            </div>
            <div class="history-field">
              <label>Other Income</label>
              <span class="value">${r(e.other)}</span>
            </div>
            <div class="history-field">
              <label>State Pension</label>
              <span class="value">${r(e.state)}</span>
            </div>
          </div>

          <div style="margin-top:16px;padding:16px;background:var(--card-alt);border-radius:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:500;">Total Monthly Income</span>
              <span style="font-size:20px;font-weight:600;color:var(--success);">${r(e.monthlyNet)}</span>
            </div>
          </div>

          ${e.boostAmount>0?`
            <div style="margin-top:12px;padding:12px;background:rgba(46,204,113,0.1);border-radius:8px;">
              <strong style="color:var(--success);">Tax Boost:</strong>
              <span style="color:var(--success);">+${r(e.boostAmount)}</span>
              <span style="color:var(--text-muted);font-size:12px;">(Catch-up from protection periods)</span>
            </div>
          `:""}
        </div>

        <!-- ISA/Savings Allocation -->
        ${e.yearlyIsaSavingsAllocation>0?`
          <div class="history-detail-card">
            <h3>ISA/Savings Allocation</h3>
            <div class="history-grid">
              <div class="history-field">
                <label>Year Allocation</label>
                <span class="value">${r(e.yearlyIsaSavingsAllocation)}</span>
              </div>
              <div class="history-field">
                <label>Used This Month</label>
                <span class="value">${r(e.isaSavingsUsedThisMonth||e.isa)}</span>
              </div>
              <div class="history-field">
                <label>Cumulative Used</label>
                <span class="value">${r(e.cumulativeIsaSavingsUsed)}</span>
              </div>
              <div class="history-field">
                <label>Remaining</label>
                <span class="value ${(e.yearlyIsaSavingsAllocation||0)-(e.cumulativeIsaSavingsUsed||0)>0?"success":"warning"}">
                  ${r((e.yearlyIsaSavingsAllocation||0)-(e.cumulativeIsaSavingsUsed||0))}
                </span>
              </div>
            </div>
          </div>
        `:""}

        <!-- Tax Summary -->
        <div class="history-detail-card">
          <h3>Tax Summary</h3>
          <div class="history-grid">
            <div class="history-field">
              <label>Personal Allowance</label>
              <span class="value">${r(e.pa)}</span>
            </div>
            <div class="history-field">
              <label>Basic Rate Limit</label>
              <span class="value">${r(e.brl)}</span>
            </div>
          </div>

          <table class="monthly-breakdown-table" style="margin-top:16px;">
            <thead>
              <tr>
                <th></th>
                <th>Monthly</th>
                <th>YTD</th>
                <th>Projected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="source-name">Tax Paid</td>
                <td>${r(e.taxPaidMonthly||e.monthlyTax)}</td>
                <td>${r(e.taxPaidYTD)}</td>
                <td>${r(e.taxProjectedAnnual)}</td>
              </tr>
              ${e.taxSavedMonthly>0||e.taxSavedProjectedAnnual>0?`
                <tr>
                  <td class="source-name">Tax Saved</td>
                  <td class="net-col">-${r(e.taxSavedMonthly)}</td>
                  <td class="net-col">-${r(e.taxSavedYTD)}</td>
                  <td class="net-col">-${r(e.taxSavedProjectedAnnual)}</td>
                </tr>
              `:""}
            </tbody>
          </table>
        </div>

        <!-- Withdrawal Details -->
        <div class="history-detail-card">
          <h3>Withdrawal Details</h3>
          <div class="history-grid">
            <div class="history-field">
              <label>Source</label>
              <span class="value">${l}</span>
            </div>
            ${e.consecutiveDraws>0?`
              <div class="history-field">
                <label>Consecutive Cash Draws</label>
                <span class="value warning">${e.consecutiveDraws}</span>
              </div>
            `:""}
            <div class="history-field">
              <label>Remaining Months</label>
              <span class="value">${e.remainingMonths||12}</span>
            </div>
          </div>
        </div>

        <!-- Rebalancing -->
        ${e.rebal?`
          <div class="history-detail-card">
            <h3>Rebalancing Suggestions</h3>
            <div style="padding:12px;background:rgba(243,156,18,0.1);border-radius:8px;">
              ${e.rebal}
            </div>
          </div>
        `:""}

        <!-- Actions -->
        <div class="history-actions">
          <button class="btn secondary" onclick="deleteHistoryEntry('${e.date}')">Delete Entry</button>
        </div>
      `;t.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===qr(n))})}window.selectHistoryEntry=function(n){he=n,cp(n);const t=document.getElementById("historyMobileSelector");t&&(t.value=n);const r=document.getElementById("historyTabs").querySelector(".history-tab.active");r&&r.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(n){const t=document.getElementById("historyTabs"),e=200;n==="left"?t.scrollLeft-=e:t.scrollLeft+=e};function oo(n){const[t,e]=n.split("-").map(Number);return e>=4?`${t%100}/${(t+1)%100}`:`${(t-1)%100}/${t%100}`}async function ja(n){const t={};for(const r of n){const s=r.taxYear||oo(r.date);t[s]||(t[s]=0),t[s]+=r.isaSavingsUsedThisMonth||r.isa||0}for(const r of n)await Hf(r.date);const e=await Rn();for(const[r,s]of Object.entries(t))if(e[r]){const i=e[r].isaSavingsUsed||0,a=Math.max(0,i-s);await sr(r,{...e[r],isaSavingsUsed:a})}}window.deleteHistoryEntry=async function(n){if(!me()){it("Please sign in to delete entries","error");return}const t=await Jr({sortDesc:!1,limit:1e3}),e=oo(n),s=t.filter(c=>(c.taxYear||oo(c.date))===e).sort((c,d)=>c.date.localeCompare(d.date)),i=s.findIndex(c=>c.date===n);if(i===-1){it("Entry not found","error");return}const a=i===s.length-1,l=qr(n);if(a){if(!confirm(`Delete entry for ${l}?`))return;De("Deleting entry...");try{await ja([s[i]]),it(`Deleted ${l}`,"success"),he=null,await Sn()}catch(c){console.error("Delete error:",c),it("Error deleting: "+c.message,"error")}finally{Me()}}else{const c=s.slice(i),d=qr(c[c.length-1].date);if(!confirm(`This will delete ${c.length} entries from ${l} to ${d} in tax year ${e}.

Continue?`))return;De(`Deleting ${c.length} entries...`);try{await ja(c),it(`Deleted ${c.length} entries`,"success"),he=null,await Sn()}catch(f){console.error("Delete error:",f),it("Error deleting: "+f.message,"error")}finally{Me()}}};window.deleteHistoryForTaxYear=async function(n){if(!me()){it("Please sign in to delete entries","error");return}const e=(await Jr({sortDesc:!1,limit:1e3})).filter(r=>(r.taxYear||oo(r.date))===n);if(e.length===0){it(`No history entries for tax year ${n}`,"info");return}if(confirm(`Delete all ${e.length} history entries for tax year ${n}?`)){De(`Deleting tax year ${n}...`);try{await ja(e);const r=await Rn();r[n]&&await sr(n,{...r[n],isaSavingsUsed:0}),it(`Deleted all entries for ${n}`,"success"),he=null,await Sn()}catch(r){console.error("Delete error:",r),it("Error deleting: "+r.message,"error")}finally{Me()}}};window.deleteHistoryForSelectedYear=async function(){if(Se==="all"){it("Select a specific year first","error");return}const n=`${parseInt(Se)%100}/${(parseInt(Se)+1)%100}`;await deleteHistoryForTaxYear(n)};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!me()){it("Please sign in to delete entries","error");return}De("Deleting all history...");try{const n=await Jr({limit:1e3});for(const e of n)await Hf(e.date);const t=await Rn();for(const[e,r]of Object.entries(t))r.isaSavingsUsed>0&&await sr(e,{...r,isaSavingsUsed:0});it(`Deleted ${n.length} entries`,"success"),he=null,await Sn()}catch(n){console.error("Delete all error:",n),it("Error deleting: "+n.message,"error")}finally{Me()}}};let Un=null;async function ii(){const n=document.getElementById("taxYearTabs"),t=document.getElementById("taxYearDetail");if(!n||!t)return;n.innerHTML='<span class="loading">Loading...</span>';const e=await Rn();await rr();const r=Object.keys(e).sort(),s=zb(),i=$b(r,s,40);let a="";i.forEach(d=>{const f=e[d],m=f&&f.yearSetupComplete,v=d===Un,E=["tax-year-tab"];v&&E.push("active"),m||E.push("not-setup"),a+=`<button class="${E.join(" ")}" onclick="selectTaxYear('${d}')">${d}</button>`}),n.innerHTML=a;const l=document.getElementById("taxYearMobileSelector");if(l){let d="";i.forEach(f=>{const m=e[f],E=m&&m.yearSetupComplete?f:`${f} (not set up)`;d+=`<option value="${f}">${E}</option>`}),l.innerHTML=d}if(!Un){const d=r.filter(f=>{var m;return(m=e[f])==null?void 0:m.yearSetupComplete});Un=d.length>0?d[d.length-1]:s}l&&(l.value=Un),await up(Un,e);const c=n.querySelector(".tax-year-tab.active");c&&c.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function zb(){const n=new Date,t=n.getFullYear(),e=n.getMonth()+1;return e<4||e===4&&n.getDate()<6?`${String(t-1).slice(-2)}/${String(t).slice(-2)}`:`${String(t).slice(-2)}/${String(t+1).slice(-2)}`}function $b(n,t,e){const r=new Set(n),[s]=t.split("/").map(Number),i=s<50?2e3+s:1900+s;for(let a=0;a<e&&r.size<e;a++){const l=i+a,c=l+1;r.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(r).sort()}async function up(n,t,e){var m,v,E,T,x,R,A,D,N,C,V,O,b,g;const r=document.getElementById("taxYearDetail"),s=t[n];if(!s||!s.yearSetupComplete){r.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${n} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${n}')">Set Up ${n}</button>
          </div>
        `;return}const i=await Jl(n),a=Math.round(i.amount||0),l=i.startDate||"Not configured",c=i.isReceiving;i.yearsUntil;const d=y=>y!=null?"£"+Math.round(y).toLocaleString():"—";let f=`
        <!-- Tax Thresholds -->
        <div class="tax-year-detail-card">
          <h3>Tax Thresholds</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Personal Allowance</label>
              <input type="number" value="${s.pa||12570}" onchange="updateTaxYear('${n}','pa',this.value)">
            </div>
            <div class="tax-year-field">
              <label>Basic Rate Limit</label>
              <input type="number" value="${s.brl||50270}" onchange="updateTaxYear('${n}','brl',this.value)">
            </div>
            <div class="tax-year-field">
              <label>Higher Rate Limit</label>
              <input type="number" value="${s.hrl||125140}" onchange="updateTaxYear('${n}','hrl',this.value)">
            </div>
            <div class="tax-year-field">
              <label>CPI (Previous Year)</label>
              <input type="number" step="0.1" value="${((s.cpi||.04)*100).toFixed(1)}" onchange="updateTaxYear('${n}','cpi',this.value/100)">
            </div>
          </div>
        </div>

        <!-- Income Configuration -->
        <div class="tax-year-detail-card">
          <h3>Income Configuration</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Target Annual Salary</label>
              <span class="value">${d(s.confirmedSalary)}</span>
            </div>
            <div class="tax-year-field">
              <label>Other Taxable Income (Annual)</label>
              <input type="number" value="${s.other||0}" onchange="updateTaxYear('${n}','other',this.value)">
            </div>
            <div class="tax-year-field">
              <label>State Pension (Annual)</label>
              <span class="value">${c?d(a)+(i.isFirstYear?" (partial year)":""):l!=="Not configured"?`Starts ${l}`:"Not configured"}</span>
            </div>
            <div class="tax-year-field">
              <label>Income Before Pension Start</label>
              <span class="value">${d(s.grossIncomeToDate)}</span>
            </div>
          </div>
        </div>

        <!-- Tax Efficiency -->
        <div class="tax-year-detail-card">
          <h3>Tax Efficiency</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Mode</label>
              <span class="tax-mode-badge ${s.isTaxEfficient?"efficient":"inefficient"}">
                ${s.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient"}
              </span>
            </div>
            <div class="tax-year-field">
              <label>ISA/Savings Allocation</label>
              <span class="value">${d(s.isaSavingsAllocation)}</span>
            </div>
            <div class="tax-year-field">
              <label>ISA/Savings Used</label>
              <span class="value">${d(s.isaSavingsUsed||0)}</span>
            </div>
            <div class="tax-year-field">
              <label>Start Month</label>
              <span class="value">${qb(s.startMonth||4)}</span>
            </div>
            <div class="tax-year-field">
              <label>Remaining Months (at setup)</label>
              <span class="value">${s.remainingMonths||12}</span>
            </div>
          </div>
        </div>
      `;if(s.expectedMonthly){const y=s.expectedMonthly;f+=`
          <div class="tax-year-detail-card">
            <h3>Expected Monthly Breakdown</h3>
            <table class="monthly-breakdown-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Gross</th>
                  <th>Tax</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="source-name">SIPP</td>
                  <td>${d((m=y.sipp)==null?void 0:m.gross)}</td>
                  <td class="tax-col">-${d((v=y.sipp)==null?void 0:v.tax)}</td>
                  <td class="net-col">${d((E=y.sipp)==null?void 0:E.net)}</td>
                </tr>
                ${((T=y.other)==null?void 0:T.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${d((x=y.other)==null?void 0:x.gross)}</td>
                  <td class="tax-col">-${d((R=y.other)==null?void 0:R.tax)}</td>
                  <td class="net-col">${d((A=y.other)==null?void 0:A.net)}</td>
                </tr>
                `:""}
                ${((D=y.statePension)==null?void 0:D.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${d((N=y.statePension)==null?void 0:N.gross)}</td>
                  <td class="tax-col">-${d((C=y.statePension)==null?void 0:C.tax)}</td>
                  <td class="net-col">${d((V=y.statePension)==null?void 0:V.net)}</td>
                </tr>
                `:""}
                ${((O=y.isa)==null?void 0:O.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${d((b=y.isa)==null?void 0:b.gross)}</td>
                  <td style="color:var(--success);">£0</td>
                  <td class="net-col">${d((g=y.isa)==null?void 0:g.net)}</td>
                </tr>
                `:""}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>${d(y.totalGross)}</strong></td>
                  <td class="tax-col"><strong>-${d(y.totalTax)}</strong></td>
                  <td class="net-col"><strong>${d(y.totalNet)}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p style="margin-top:16px;font-size:14px;color:var(--text);">
              <strong>Monthly take-home: ${d(y.totalNet)}</strong>
            </p>
          </div>
        `}f+=`
        <div class="tax-year-actions">
          <button class="btn secondary" onclick="deleteTaxYear('${n}')">Delete Year</button>
          <button class="btn secondary" onclick="reconfigureTaxYear('${n}')">Reconfigure via Wizard</button>
        </div>
      `,r.innerHTML=f,document.querySelectorAll(".tax-year-tab").forEach(y=>{y.classList.toggle("active",y.textContent===n)})}window.selectTaxYear=async function(n){Un=n;const t=await Rn();await rr(),await up(n,t),document.querySelectorAll(".tax-year-tab").forEach(i=>{i.classList.toggle("active",i.textContent===n)});const e=document.getElementById("taxYearMobileSelector");e&&(e.value=n);const s=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${n}')"]`);s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(n){const t=document.getElementById("taxYearTabs"),e=200;n==="left"?t.scrollLeft-=e:t.scrollLeft+=e};function qb(n){return["January","February","March","April","May","June","July","August","September","October","November","December"][(n-1)%12]||"April"}window.triggerWizardForYear=async function(n){const[t]=n.split("/").map(Number),e=t<50?2e3+t:1900+t,r=`${e}-04`,s=document.getElementById("selectedMonth");s&&(s.value=r),document.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(i=>i.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(i=>i.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),alert(`Please click "Calculate" with April ${e} selected to set up tax year ${n}`)};window.reconfigureTaxYear=async function(n){if(confirm(`This will allow you to reconfigure tax year ${n}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const t=await Mo(n);t.yearSetupComplete=!1,await sr(n,t),await ii(),alert(`Tax year ${n} has been marked for reconfiguration. Calculate a decision for this year to run the wizard again.`)}catch(t){console.error("Error:",t),alert("Error: "+t.message)}};window.updateTaxYear=async function(n,t,e){try{const r=await Mo(n);r[t]=parseFloat(e),await sr(n,r)}catch(r){console.error("Error updating tax year:",r),alert("Error saving: "+r.message)}};window.deleteTaxYear=async function(n){if(confirm("Delete tax year "+n+"? This will remove all configuration for this year."))try{const t=await nr();delete t.taxYears[n],await Do(t),Un=null,await ii()}catch(t){console.error("Error deleting tax year:",t),alert("Error deleting: "+t.message)}};window.addTaxYear=async function(){if(!me()){alert("Please sign in to add tax years");return}const n=prompt("Enter tax year (e.g., 25/26):");if(!n||!/^\d{2}\/\d{2}$/.test(n)){alert("Invalid format. Use YY/YY (e.g., 25/26)");return}try{await sr(n,{}),await ii()}catch(t){console.error("Save error:",t),alert("Error saving: "+t.message)}};console.log("Pension Planner v"+Ed+" loaded");
