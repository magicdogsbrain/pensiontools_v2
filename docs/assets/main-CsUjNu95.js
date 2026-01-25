(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();function Rp(n){const t=(n.sippDraw||0)+(n.other||0)+(n.statePension||0),e=t*12,r=n.pa||12570,s=n.brl||50270,i=n.hrl||125140;let a=0;e>r&&(e<=s?a=(e-r)*.2:e<=i?a=(s-r)*.2+(e-s)*.4:a=(s-r)*.2+(i-s)*.4+(e-i)*.45);const l=a/12,c=t-l+(n.isaDraw||0);return{date:n.date,taxYear:n.taxYear,yearNum:n.yearNumber,equity:n.equity,bond:n.bond,cash:n.cash,total:n.equity+n.bond+n.cash,adjEquity:n.adjEquityMin,adjBond:n.adjBondMin,adjCash:n.adjCashTarget,source:n.source,dEquity:n.drawFromEquity||0,dBond:n.drawFromBond||0,dCash:n.drawFromCash||0,sipp:n.sippDraw,stdSipp:n.stdSipp||n.sippDraw,isa:n.isaDraw,other:n.other,state:n.statePension,pa:r,brl:s,monthlyTax:l,monthlyNet:c,mode:n.taxEfficient?"Tax-Efficient":"Standard",inProtection:n.inProtection,reason:n.protectionReason||"",consecutiveDraws:n.consecutiveCashDraws||0,boostAmount:n.boostAmount,boostEligible:n.boostEligible||!1,rebal:n.rebalanceActions?n.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:n.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:n.isaDraw||0,cumulativeIsaSavingsUsed:n.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxPaidYTD:n.taxPaidYTD||l,taxProjectedAnnual:n.taxProjectedAnnual||a,taxSavedMonthly:n.taxSavedMonthly||0,taxSavedYTD:n.taxSavedYTD||0,taxSavedProjectedAnnual:n.taxSavedProjectedAnnual||0,isTaxEfficientYear:n.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:n.protectionInducedTaxEfficiency||!1,remainingMonths:n.remainingMonths||12}}const vi={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},_d="6.0.0",oe={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},wd={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},te={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},Go={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},Is={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},$a={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},Pp={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},ke={START_MONTH:4,START_DAY:6};function Cp(n,t,e,r=oe.HIGHER_RATE_LIMIT){if(n<=0)return 0;let s=t;if(n>oe.PA_TAPER_THRESHOLD){const f=(n-oe.PA_TAPER_THRESHOLD)*oe.PA_TAPER_RATE;s=Math.max(0,t-f)}const i=Math.max(0,n-s),a=Math.max(0,e-s),l=r-e;let c=0;const d=Math.min(i,a);if(c+=d*oe.BASIC_RATE,i>a){const f=Math.min(i-a,l);c+=f*oe.HIGHER_RATE}if(i>a+l){const f=i-a-l;c+=f*oe.ADDITIONAL_RATE}return c}function qa(n){const t=typeof n=="string"?new Date(n):n,e=t.getFullYear(),r=t.getMonth()+1,s=t.getDate();if(r<ke.START_MONTH||r===ke.START_MONTH&&s<ke.START_DAY){const i=e-1;return`${String(i).slice(-2)}/${String(e).slice(-2)}`}return`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function kp(n){const t=parseInt(n.split("/")[0]),e=t<50?2e3+t:1900+t;return new Date(e,ke.START_MONTH-1,ke.START_DAY)}function Dp(n){const t=parseInt(n.split("/")[1]),e=t<50?2e3+t:1900+t;return new Date(e,ke.START_MONTH-1,ke.START_DAY-1)}function Mp(){const n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function Ed(n){const[t,e]=n.split("-").map(Number);return new Date(t,e-1,15)}function Np(n){const e=(typeof n=="string"?new Date(n):n).getMonth()+1;return e>=ke.START_MONTH?12-(e-ke.START_MONTH):ke.START_MONTH-e}function Lp(n){const{baseSalary:t,cumulativeInflation:e,yearlyInflation:r=[],other:s=0,statePension:i=0,statePensionYear:a=12,yearNumber:l=0,pa:c,brl:d,hrl:f,taxMode:m="inflates"}=n,v=m==="frozen"?c:c*e,E=m==="frozen"?d:d*e,T=m==="frozen"?f:f*e,x=t*e,I=Vp(s,r),P=l>=a?i*e:0,D=I+P,N=Math.max(0,E-D),F=Math.max(0,x-D),V=Math.min(N,F);return{pa:v,brl:E,hrl:T,targetGross:x,other:I,statePension:P,fixedIncome:D,annualSippDraw:V,monthlySippDraw:V/12,sippPlusfixedAtBRL:N+D===E}}function Vp(n,t,e=wd.OTHER_INCOME_CAP){let r=n;for(const s of t)r*=1+Math.min(s,e);return r}function Op(n,t,e=.025){const r=[],s=[];for(let i=0;i<=t;i++){i>0&&s.push(e);const a=Math.pow(1+e,i),l=Lp({baseSalary:n.baseSalary,cumulativeInflation:a,yearlyInflation:[...s],other:n.other,statePension:n.statePension,statePensionYear:n.statePensionYear,yearNumber:i,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode}),c=l.annualSippDraw+l.other+l.statePension,d=Cp(c,l.pa,l.brl,l.hrl);r.push({year:i,brl:l.brl,other:l.other,statePension:l.statePension,sippDraw:l.annualSippDraw,totalTaxable:c,tax:d,netIncome:c-d})}return r}function xr(n,t,e,r,s){if(s){const i=Math.max(0,1-t/e);return n*r*i}return n*r}function Bp(n,t,e){const r=xr(n.equityMin,t,n.duration,e,!0),s=xr(n.bondMin,t,n.duration,e,!0),i=xr(n.cashTarget,t,n.duration,e,!1);return{equity:r,bond:s,cash:i,totalGrowth:r+s,total:r+s+i}}function Fp(n,t=wd.ASSUMED_CPI){const e=[];for(let r=0;r<=n.duration;r++){const s=Math.pow(1+t,r),i=Bp(n,r,s);e.push({year:r,cumulativeInflation:s,equityMin:i.equity,bondMin:i.bond,cashTarget:i.cash,totalMin:i.total})}return e}const zp="modulepreload",Up=function(n,t){return new URL(n,t).href},jc={},Hc=function(t,e,r){let s=Promise.resolve();if(e&&e.length>0){const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=Promise.allSettled(e.map(d=>{if(d=Up(d,r),d in jc)return;jc[d]=!0;const f=d.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!r)for(let T=a.length-1;T>=0;T--){const x=a[T];if(x.href===d&&(!f||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const E=document.createElement("link");if(E.rel=f?"stylesheet":zp,f||(E.as="script"),E.crossOrigin="",E.href=d,c&&E.setAttribute("nonce",c),document.head.appendChild(E),f)return new Promise((T,x)=>{E.addEventListener("load",T),E.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return s.then(a=>{for(const l of a||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})};function ja(n){let t=n;return function(){return t=Math.sin(t)*1e4,t-Math.floor(t)}}function as(n,t,e){const r=e(),s=e(),i=Math.sqrt(-2*Math.log(r))*Math.cos(2*Math.PI*s);return n+t*i}function bd(n){const t=JSON.stringify(n);let e=0;for(let r=0;r<t.length;r++){const s=t.charCodeAt(r);e=(e<<5)-e+s,e=e&e}return e.toString(16)}var Wc={};/**
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
 */const Td=function(n){const t=[];let e=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},$p=function(n){const t=[];let e=0,r=0;for(;e<n.length;){const s=n[e++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[e++];t[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[e++],a=n[e++],l=n[e++],c=((s&7)<<18|(i&63)<<12|(a&63)<<6|l&63)-65536;t[r++]=String.fromCharCode(55296+(c>>10)),t[r++]=String.fromCharCode(56320+(c&1023))}else{const i=n[e++],a=n[e++];t[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return t.join("")},Id={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,t){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,l=a?n[s+1]:0,c=s+2<n.length,d=c?n[s+2]:0,f=i>>2,m=(i&3)<<4|l>>4;let v=(l&15)<<2|d>>6,E=d&63;c||(E=64,a||(v=64)),r.push(e[f],e[m],e[v],e[E])}return r.join("")},encodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(n):this.encodeByteArray(Td(n),t)},decodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(n):$p(this.decodeStringToByteArray(n,t))},decodeStringToByteArray(n,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=e[n.charAt(s++)],l=s<n.length?e[n.charAt(s)]:0;++s;const d=s<n.length?e[n.charAt(s)]:64;++s;const m=s<n.length?e[n.charAt(s)]:64;if(++s,i==null||l==null||d==null||m==null)throw new qp;const v=i<<2|l>>4;if(r.push(v),d!==64){const E=l<<4&240|d>>2;if(r.push(E),m!==64){const T=d<<6&192|m;r.push(T)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class qp extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const jp=function(n){const t=Td(n);return Id.encodeByteArray(t,!0)},Li=function(n){return jp(n).replace(/\./g,"")},Sd=function(n){try{return Id.decodeString(n,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
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
 */function Hp(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Wp=()=>Hp().__FIREBASE_DEFAULTS__,Yp=()=>{if(typeof process>"u"||typeof Wc>"u")return;const n=Wc.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Gp=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=n&&Sd(n[1]);return t&&JSON.parse(t)},no=()=>{try{return Wp()||Yp()||Gp()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Ad=n=>{var t,e;return(e=(t=no())===null||t===void 0?void 0:t.emulatorHosts)===null||e===void 0?void 0:e[n]},Kp=n=>{const t=Ad(n);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),r]:[t.substring(0,e),r]},xd=()=>{var n;return(n=no())===null||n===void 0?void 0:n.config},Rd=n=>{var t;return(t=no())===null||t===void 0?void 0:t[`_${n}`]};/**
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
 */class Qp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,r)=>{e?this.reject(e):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,r))}}}/**
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
 */function Jp(n,t){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},r=t||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Li(JSON.stringify(e)),Li(JSON.stringify(a)),""].join(".")}/**
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
 */function Jt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Xp(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Jt())}function Zp(){var n;const t=(n=no())===null||n===void 0?void 0:n.forceEnvironment;if(t==="node")return!0;if(t==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function tm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function em(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function nm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function rm(){const n=Jt();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function sm(){return!Zp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function im(){try{return typeof indexedDB=="object"}catch{return!1}}function om(){return new Promise((n,t)=>{try{let e=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{var i;t(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(e){t(e)}})}/**
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
 */const am="FirebaseError";class nn extends Error{constructor(t,e,r){super(e),this.code=t,this.customData=r,this.name=am,Object.setPrototypeOf(this,nn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ls.prototype.create)}}class Ls{constructor(t,e,r){this.service=t,this.serviceName=e,this.errors=r}create(t,...e){const r=e[0]||{},s=`${this.service}/${t}`,i=this.errors[t],a=i?lm(i,r):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new nn(s,l,r)}}function lm(n,t){return n.replace(cm,(e,r)=>{const s=t[r];return s!=null?String(s):`<${r}?>`})}const cm=/\{\$([^}]+)}/g;function um(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}function Vi(n,t){if(n===t)return!0;const e=Object.keys(n),r=Object.keys(t);for(const s of e){if(!r.includes(s))return!1;const i=n[s],a=t[s];if(Yc(i)&&Yc(a)){if(!Vi(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!e.includes(s))return!1;return!0}function Yc(n){return n!==null&&typeof n=="object"}/**
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
 */function Vs(n){const t=[];for(const[e,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function us(n){const t={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");t[decodeURIComponent(s)]=decodeURIComponent(i)}}),t}function ds(n){const t=n.indexOf("?");if(!t)return"";const e=n.indexOf("#",t);return n.substring(t,e>0?e:void 0)}function dm(n,t){const e=new hm(n,t);return e.subscribe.bind(e)}class hm{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(r=>{this.error(r)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,r){let s;if(t===void 0&&e===void 0&&r===void 0)throw new Error("Missing Observer.");fm(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:r},s.next===void 0&&(s.next=Ko),s.error===void 0&&(s.error=Ko),s.complete===void 0&&(s.complete=Ko);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function fm(n,t){if(typeof n!="object"||n===null)return!1;for(const e of t)if(e in n&&typeof n[e]=="function")return!0;return!1}function Ko(){}/**
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
 */function It(n){return n&&n._delegate?n._delegate:n}class Gn{constructor(t,e,r){this.name=t,this.instanceFactory=e,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
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
 */class pm{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const r=new Qp;if(this.instancesDeferred.set(e,r),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){var e;const r=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),s=(e=t==null?void 0:t.optional)!==null&&e!==void 0?e:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(gm(t))try{this.getOrInitializeService({instanceIdentifier:Fn})}catch{}for(const[e,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(t=Fn){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Fn){return this.instances.has(t)}getOptions(t=Fn){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:e});for(const[i,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);r===l&&a.resolve(s)}return s}onInit(t,e){var r;const s=this.normalizeInstanceIdentifier(e),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(t),this.onInitCallbacks.set(s,i);const a=this.instances.get(s);return a&&t(a,s),()=>{i.delete(t)}}invokeOnInitCallbacks(t,e){const r=this.onInitCallbacks.get(e);if(r)for(const s of r)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:mm(t),options:e}),this.instances.set(t,r),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=Fn){return this.component?this.component.multipleInstances?t:Fn:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function mm(n){return n===Fn?void 0:n}function gm(n){return n.instantiationMode==="EAGER"}/**
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
 */class ym{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new pm(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var et;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(et||(et={}));const vm={debug:et.DEBUG,verbose:et.VERBOSE,info:et.INFO,warn:et.WARN,error:et.ERROR,silent:et.SILENT},_m=et.INFO,wm={[et.DEBUG]:"log",[et.VERBOSE]:"log",[et.INFO]:"info",[et.WARN]:"warn",[et.ERROR]:"error"},Em=(n,t,...e)=>{if(t<n.logLevel)return;const r=new Date().toISOString(),s=wm[t];if(s)console[s](`[${r}]  ${n.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Ha{constructor(t){this.name=t,this._logLevel=_m,this._logHandler=Em,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in et))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?vm[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,et.DEBUG,...t),this._logHandler(this,et.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,et.VERBOSE,...t),this._logHandler(this,et.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,et.INFO,...t),this._logHandler(this,et.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,et.WARN,...t),this._logHandler(this,et.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,et.ERROR,...t),this._logHandler(this,et.ERROR,...t)}}const bm=(n,t)=>t.some(e=>n instanceof e);let Gc,Kc;function Tm(){return Gc||(Gc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Im(){return Kc||(Kc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Pd=new WeakMap,ma=new WeakMap,Cd=new WeakMap,Qo=new WeakMap,Wa=new WeakMap;function Sm(n){const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{e(En(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",a)});return t.then(e=>{e instanceof IDBCursor&&Pd.set(e,n)}).catch(()=>{}),Wa.set(t,n),t}function Am(n){if(ma.has(n))return;const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{e(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});ma.set(n,t)}let ga={get(n,t,e){if(n instanceof IDBTransaction){if(t==="done")return ma.get(n);if(t==="objectStoreNames")return n.objectStoreNames||Cd.get(n);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return En(n[t])},set(n,t,e){return n[t]=e,!0},has(n,t){return n instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in n}};function xm(n){ga=n(ga)}function Rm(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const r=n.call(Jo(this),t,...e);return Cd.set(r,t.sort?t.sort():[t]),En(r)}:Im().includes(n)?function(...t){return n.apply(Jo(this),t),En(Pd.get(this))}:function(...t){return En(n.apply(Jo(this),t))}}function Pm(n){return typeof n=="function"?Rm(n):(n instanceof IDBTransaction&&Am(n),bm(n,Tm())?new Proxy(n,ga):n)}function En(n){if(n instanceof IDBRequest)return Sm(n);if(Qo.has(n))return Qo.get(n);const t=Pm(n);return t!==n&&(Qo.set(n,t),Wa.set(t,n)),t}const Jo=n=>Wa.get(n);function Cm(n,t,{blocked:e,upgrade:r,blocking:s,terminated:i}={}){const a=indexedDB.open(n,t),l=En(a);return r&&a.addEventListener("upgradeneeded",c=>{r(En(a.result),c.oldVersion,c.newVersion,En(a.transaction),c)}),e&&a.addEventListener("blocked",c=>e(c.oldVersion,c.newVersion,c)),l.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const km=["get","getKey","getAll","getAllKeys","count"],Dm=["put","add","delete","clear"],Xo=new Map;function Qc(n,t){if(!(n instanceof IDBDatabase&&!(t in n)&&typeof t=="string"))return;if(Xo.get(t))return Xo.get(t);const e=t.replace(/FromIndex$/,""),r=t!==e,s=Dm.includes(e);if(!(e in(r?IDBIndex:IDBObjectStore).prototype)||!(s||km.includes(e)))return;const i=async function(a,...l){const c=this.transaction(a,s?"readwrite":"readonly");let d=c.store;return r&&(d=d.index(l.shift())),(await Promise.all([d[e](...l),s&&c.done]))[0]};return Xo.set(t,i),i}xm(n=>({...n,get:(t,e,r)=>Qc(t,e)||n.get(t,e,r),has:(t,e)=>!!Qc(t,e)||n.has(t,e)}));/**
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
 */class Mm{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(Nm(e)){const r=e.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(e=>e).join(" ")}}function Nm(n){const t=n.getComponent();return(t==null?void 0:t.type)==="VERSION"}const ya="@firebase/app",Jc="0.10.13";/**
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
 */const Je=new Ha("@firebase/app"),Lm="@firebase/app-compat",Vm="@firebase/analytics-compat",Om="@firebase/analytics",Bm="@firebase/app-check-compat",Fm="@firebase/app-check",zm="@firebase/auth",Um="@firebase/auth-compat",$m="@firebase/database",qm="@firebase/data-connect",jm="@firebase/database-compat",Hm="@firebase/functions",Wm="@firebase/functions-compat",Ym="@firebase/installations",Gm="@firebase/installations-compat",Km="@firebase/messaging",Qm="@firebase/messaging-compat",Jm="@firebase/performance",Xm="@firebase/performance-compat",Zm="@firebase/remote-config",tg="@firebase/remote-config-compat",eg="@firebase/storage",ng="@firebase/storage-compat",rg="@firebase/firestore",sg="@firebase/vertexai-preview",ig="@firebase/firestore-compat",og="firebase",ag="10.14.1";/**
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
 */const va="[DEFAULT]",lg={[ya]:"fire-core",[Lm]:"fire-core-compat",[Om]:"fire-analytics",[Vm]:"fire-analytics-compat",[Fm]:"fire-app-check",[Bm]:"fire-app-check-compat",[zm]:"fire-auth",[Um]:"fire-auth-compat",[$m]:"fire-rtdb",[qm]:"fire-data-connect",[jm]:"fire-rtdb-compat",[Hm]:"fire-fn",[Wm]:"fire-fn-compat",[Ym]:"fire-iid",[Gm]:"fire-iid-compat",[Km]:"fire-fcm",[Qm]:"fire-fcm-compat",[Jm]:"fire-perf",[Xm]:"fire-perf-compat",[Zm]:"fire-rc",[tg]:"fire-rc-compat",[eg]:"fire-gcs",[ng]:"fire-gcs-compat",[rg]:"fire-fst",[ig]:"fire-fst-compat",[sg]:"fire-vertex","fire-js":"fire-js",[og]:"fire-js-all"};/**
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
 */const Oi=new Map,cg=new Map,_a=new Map;function Xc(n,t){try{n.container.addComponent(t)}catch(e){Je.debug(`Component ${t.name} failed to register with FirebaseApp ${n.name}`,e)}}function Nr(n){const t=n.name;if(_a.has(t))return Je.debug(`There were multiple attempts to register component ${t}.`),!1;_a.set(t,n);for(const e of Oi.values())Xc(e,n);for(const e of cg.values())Xc(e,n);return!0}function Ya(n,t){const e=n.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),n.container.getProvider(t)}function ve(n){return n.settings!==void 0}/**
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
 */const ug={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},bn=new Ls("app","Firebase",ug);/**
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
 */class dg{constructor(t,e,r){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},e),this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Gn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw bn.create("app-deleted",{appName:this._name})}}/**
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
 */const qr=ag;function kd(n,t={}){let e=n;typeof t!="object"&&(t={name:t});const r=Object.assign({name:va,automaticDataCollectionEnabled:!1},t),s=r.name;if(typeof s!="string"||!s)throw bn.create("bad-app-name",{appName:String(s)});if(e||(e=xd()),!e)throw bn.create("no-options");const i=Oi.get(s);if(i){if(Vi(e,i.options)&&Vi(r,i.config))return i;throw bn.create("duplicate-app",{appName:s})}const a=new ym(s);for(const c of _a.values())a.addComponent(c);const l=new dg(e,r,a);return Oi.set(s,l),l}function Dd(n=va){const t=Oi.get(n);if(!t&&n===va&&xd())return kd();if(!t)throw bn.create("no-app",{appName:n});return t}function Tn(n,t,e){var r;let s=(r=lg[n])!==null&&r!==void 0?r:n;e&&(s+=`-${e}`);const i=s.match(/\s|\//),a=t.match(/\s|\//);if(i||a){const l=[`Unable to register library "${s}" with version "${t}":`];i&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&a&&l.push("and"),a&&l.push(`version name "${t}" contains illegal characters (whitespace or "/")`),Je.warn(l.join(" "));return}Nr(new Gn(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}/**
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
 */const hg="firebase-heartbeat-database",fg=1,Ss="firebase-heartbeat-store";let Zo=null;function Md(){return Zo||(Zo=Cm(hg,fg,{upgrade:(n,t)=>{switch(t){case 0:try{n.createObjectStore(Ss)}catch(e){console.warn(e)}}}}).catch(n=>{throw bn.create("idb-open",{originalErrorMessage:n.message})})),Zo}async function pg(n){try{const e=(await Md()).transaction(Ss),r=await e.objectStore(Ss).get(Nd(n));return await e.done,r}catch(t){if(t instanceof nn)Je.warn(t.message);else{const e=bn.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});Je.warn(e.message)}}}async function Zc(n,t){try{const r=(await Md()).transaction(Ss,"readwrite");await r.objectStore(Ss).put(t,Nd(n)),await r.done}catch(e){if(e instanceof nn)Je.warn(e.message);else{const r=bn.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});Je.warn(r.message)}}}function Nd(n){return`${n.name}!${n.options.appId}`}/**
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
 */const mg=1024,gg=30*24*60*60*1e3;class yg{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new _g(e),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,e;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=tu();return((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const l=new Date(a.date).valueOf();return Date.now()-l<=gg}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Je.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=tu(),{heartbeatsToSend:r,unsentEntries:s}=vg(this._heartbeatsCache.heartbeats),i=Li(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return Je.warn(e),""}}}function tu(){return new Date().toISOString().substring(0,10)}function vg(n,t=mg){const e=[];let r=n.slice();for(const s of n){const i=e.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),eu(e)>t){i.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),eu(e)>t){e.pop();break}r=r.slice(1)}return{heartbeatsToSend:e,unsentEntries:r}}class _g{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return im()?om().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await pg(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return Zc(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return Zc(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...t.heartbeats]})}else return}}function eu(n){return Li(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function wg(n){Nr(new Gn("platform-logger",t=>new Mm(t),"PRIVATE")),Nr(new Gn("heartbeat",t=>new yg(t),"PRIVATE")),Tn(ya,Jc,n),Tn(ya,Jc,"esm2017"),Tn("fire-js","")}wg("");var Eg="firebase",bg="10.14.1";/**
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
 */Tn(Eg,bg,"app");function Ga(n,t){var e={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.indexOf(r)<0&&(e[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)t.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(e[r[s]]=n[r[s]]);return e}function Ld(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Tg=Ld,Vd=new Ls("auth","Firebase",Ld());/**
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
 */const Bi=new Ha("@firebase/auth");function Ig(n,...t){Bi.logLevel<=et.WARN&&Bi.warn(`Auth (${qr}): ${n}`,...t)}function Ii(n,...t){Bi.logLevel<=et.ERROR&&Bi.error(`Auth (${qr}): ${n}`,...t)}/**
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
 */function me(n,...t){throw Qa(n,...t)}function _e(n,...t){return Qa(n,...t)}function Ka(n,t,e){const r=Object.assign(Object.assign({},Tg()),{[t]:e});return new Ls("auth","Firebase",r).create(t,{appName:n.name})}function Ke(n){return Ka(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Sg(n,t,e){const r=e;if(!(t instanceof r))throw r.name!==t.constructor.name&&me(n,"argument-error"),Ka(n,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Qa(n,...t){if(typeof n!="string"){const e=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(e,...r)}return Vd.create(n,...t)}function W(n,t,...e){if(!n)throw Qa(t,...e)}function We(n){const t="INTERNAL ASSERTION FAILED: "+n;throw Ii(t),new Error(t)}function Xe(n,t){n||We(t)}/**
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
 */function wa(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Ag(){return nu()==="http:"||nu()==="https:"}function nu(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function xg(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Ag()||em()||"connection"in navigator)?navigator.onLine:!0}function Rg(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class Os{constructor(t,e){this.shortDelay=t,this.longDelay=e,Xe(e>t,"Short delay should be less than long delay!"),this.isMobile=Xp()||nm()}get(){return xg()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Ja(n,t){Xe(n.emulator,"Emulator should always be set here");const{url:e}=n.emulator;return t?`${e}${t.startsWith("/")?t.slice(1):t}`:e}/**
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
 */class Od{static initialize(t,e,r){this.fetchImpl=t,e&&(this.headersImpl=e),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;We("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;We("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;We("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const Pg={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const Cg=new Os(3e4,6e4);function rn(n,t){return n.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:n.tenantId}):t}async function Oe(n,t,e,r,s={}){return Bd(n,s,async()=>{let i={},a={};r&&(t==="GET"?a=r:i={body:JSON.stringify(r)});const l=Vs(Object.assign({key:n.config.apiKey},a)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:t,headers:c},i);return tm()||(d.referrerPolicy="no-referrer"),Od.fetch()(Fd(n,n.config.apiHost,e,l),d)})}async function Bd(n,t,e){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},Pg),t);try{const s=new Dg(n),i=await Promise.race([e(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw _i(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const l=i.ok?a.errorMessage:a.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw _i(n,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw _i(n,"email-already-in-use",a);if(c==="USER_DISABLED")throw _i(n,"user-disabled",a);const f=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Ka(n,f,d);me(n,f)}}catch(s){if(s instanceof nn)throw s;me(n,"network-request-failed",{message:String(s)})}}async function Bs(n,t,e,r,s={}){const i=await Oe(n,t,e,r,s);return"mfaPendingCredential"in i&&me(n,"multi-factor-auth-required",{_serverResponse:i}),i}function Fd(n,t,e,r){const s=`${t}${e}?${r}`;return n.config.emulator?Ja(n.config,s):`${n.config.apiScheme}://${s}`}function kg(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Dg{constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((e,r)=>{this.timer=setTimeout(()=>r(_e(this.auth,"network-request-failed")),Cg.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function _i(n,t,e){const r={appName:n.name};e.email&&(r.email=e.email),e.phoneNumber&&(r.phoneNumber=e.phoneNumber);const s=_e(n,t,r);return s.customData._tokenResponse=e,s}function ru(n){return n!==void 0&&n.enterprise!==void 0}class Mg{constructor(t){if(this.siteKey="",this.recaptchaEnforcementState=[],t.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=t.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=t.recaptchaEnforcementState}getProviderEnforcementState(t){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const e of this.recaptchaEnforcementState)if(e.provider&&e.provider===t)return kg(e.enforcementState);return null}isProviderEnabled(t){return this.getProviderEnforcementState(t)==="ENFORCE"||this.getProviderEnforcementState(t)==="AUDIT"}}async function Ng(n,t){return Oe(n,"GET","/v2/recaptchaConfig",rn(n,t))}/**
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
 */async function Lg(n,t){return Oe(n,"POST","/v1/accounts:delete",t)}async function zd(n,t){return Oe(n,"POST","/v1/accounts:lookup",t)}/**
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
 */function gs(n){if(n)try{const t=new Date(Number(n));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function Vg(n,t=!1){const e=It(n),r=await e.getIdToken(t),s=Xa(r);W(s&&s.exp&&s.auth_time&&s.iat,e.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:gs(ta(s.auth_time)),issuedAtTime:gs(ta(s.iat)),expirationTime:gs(ta(s.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function ta(n){return Number(n)*1e3}function Xa(n){const[t,e,r]=n.split(".");if(t===void 0||e===void 0||r===void 0)return Ii("JWT malformed, contained fewer than 3 sections"),null;try{const s=Sd(e);return s?JSON.parse(s):(Ii("Failed to decode base64 JWT payload"),null)}catch(s){return Ii("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function su(n){const t=Xa(n);return W(t,"internal-error"),W(typeof t.exp<"u","internal-error"),W(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
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
 */async function Lr(n,t,e=!1){if(e)return t;try{return await t}catch(r){throw r instanceof nn&&Og(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Og({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class Bg{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){var e;if(t){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((e=this.user.stsTokenManager.expirationTime)!==null&&e!==void 0?e:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(t=!1){if(!this.isRunning)return;const e=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},e)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){(t==null?void 0:t.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Ea{constructor(t,e){this.createdAt=t,this.lastLoginAt=e,this._initializeTime()}_initializeTime(){this.lastSignInTime=gs(this.lastLoginAt),this.creationTime=gs(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Fi(n){var t;const e=n.auth,r=await n.getIdToken(),s=await Lr(n,zd(e,{idToken:r}));W(s==null?void 0:s.users.length,e,"internal-error");const i=s.users[0];n._notifyReloadListener(i);const a=!((t=i.providerUserInfo)===null||t===void 0)&&t.length?Ud(i.providerUserInfo):[],l=zg(n.providerData,a),c=n.isAnonymous,d=!(n.email&&i.passwordHash)&&!(l!=null&&l.length),f=c?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new Ea(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function Fg(n){const t=It(n);await Fi(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function zg(n,t){return[...n.filter(r=>!t.some(s=>s.providerId===r.providerId)),...t]}function Ud(n){return n.map(t=>{var{providerId:e}=t,r=Ga(t,["providerId"]);return{providerId:e,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
 */async function Ug(n,t){const e=await Bd(n,{},async()=>{const r=Vs({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=Fd(n,s,"/v1/token",`key=${i}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Od.fetch()(a,{method:"POST",headers:l,body:r})});return{accessToken:e.access_token,expiresIn:e.expires_in,refreshToken:e.refresh_token}}async function $g(n,t){return Oe(n,"POST","/v2/accounts:revokeToken",rn(n,t))}/**
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
 */class Rr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){W(t.idToken,"internal-error"),W(typeof t.idToken<"u","internal-error"),W(typeof t.refreshToken<"u","internal-error");const e="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):su(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,e)}updateFromIdToken(t){W(t.length!==0,"internal-error");const e=su(t);this.updateTokensAndExpiration(t,null,e)}async getToken(t,e=!1){return!e&&this.accessToken&&!this.isExpired?this.accessToken:(W(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,e){const{accessToken:r,refreshToken:s,expiresIn:i}=await Ug(t,e);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(t,e,r){this.refreshToken=e||null,this.accessToken=t||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(t,e){const{refreshToken:r,accessToken:s,expirationTime:i}=e,a=new Rr;return r&&(W(typeof r=="string","internal-error",{appName:t}),a.refreshToken=r),s&&(W(typeof s=="string","internal-error",{appName:t}),a.accessToken=s),i&&(W(typeof i=="number","internal-error",{appName:t}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new Rr,this.toJSON())}_performRefresh(){return We("not implemented")}}/**
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
 */function fn(n,t){W(typeof n=="string"||typeof n>"u","internal-error",{appName:t})}class Ye{constructor(t){var{uid:e,auth:r,stsTokenManager:s}=t,i=Ga(t,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Bg(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ea(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(t){const e=await Lr(this,this.stsTokenManager.getToken(this.auth,t));return W(e,this.auth,"internal-error"),this.accessToken!==e&&(this.accessToken=e,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),e}getIdTokenResult(t){return Vg(this,t)}reload(){return Fg(this)}_assign(t){this!==t&&(W(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(e=>Object.assign({},e)),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const e=new Ye(Object.assign(Object.assign({},this),{auth:t,stsTokenManager:this.stsTokenManager._clone()}));return e.metadata._copy(this.metadata),e}_onReload(t){W(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,e=!1){let r=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),r=!0),e&&await Fi(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ve(this.auth.app))return Promise.reject(Ke(this.auth));const t=await this.getIdToken();return await Lr(this,Lg(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>Object.assign({},t)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,e){var r,s,i,a,l,c,d,f;const m=(r=e.displayName)!==null&&r!==void 0?r:void 0,v=(s=e.email)!==null&&s!==void 0?s:void 0,E=(i=e.phoneNumber)!==null&&i!==void 0?i:void 0,T=(a=e.photoURL)!==null&&a!==void 0?a:void 0,x=(l=e.tenantId)!==null&&l!==void 0?l:void 0,I=(c=e._redirectEventId)!==null&&c!==void 0?c:void 0,P=(d=e.createdAt)!==null&&d!==void 0?d:void 0,D=(f=e.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:C,emailVerified:N,isAnonymous:F,providerData:V,stsTokenManager:b}=e;W(C&&b,t,"internal-error");const g=Rr.fromJSON(this.name,b);W(typeof C=="string",t,"internal-error"),fn(m,t.name),fn(v,t.name),W(typeof N=="boolean",t,"internal-error"),W(typeof F=="boolean",t,"internal-error"),fn(E,t.name),fn(T,t.name),fn(x,t.name),fn(I,t.name),fn(P,t.name),fn(D,t.name);const y=new Ye({uid:C,auth:t,email:v,emailVerified:N,displayName:m,isAnonymous:F,photoURL:T,phoneNumber:E,tenantId:x,stsTokenManager:g,createdAt:P,lastLoginAt:D});return V&&Array.isArray(V)&&(y.providerData=V.map(w=>Object.assign({},w))),I&&(y._redirectEventId=I),y}static async _fromIdTokenResponse(t,e,r=!1){const s=new Rr;s.updateFromServerResponse(e);const i=new Ye({uid:e.localId,auth:t,stsTokenManager:s,isAnonymous:r});return await Fi(i),i}static async _fromGetAccountInfoResponse(t,e,r){const s=e.users[0];W(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?Ud(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),l=new Rr;l.updateFromIdToken(r);const c=new Ye({uid:s.localId,auth:t,stsTokenManager:l,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Ea(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
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
 */const iu=new Map;function Ge(n){Xe(n instanceof Function,"Expected a class definition");let t=iu.get(n);return t?(Xe(t instanceof n,"Instance stored in cache mismatched with class"),t):(t=new n,iu.set(n,t),t)}/**
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
 */class $d{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,e){this.storage[t]=e}async _get(t){const e=this.storage[t];return e===void 0?null:e}async _remove(t){delete this.storage[t]}_addListener(t,e){}_removeListener(t,e){}}$d.type="NONE";const ou=$d;/**
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
 */function Si(n,t,e){return`firebase:${n}:${t}:${e}`}class Pr{constructor(t,e,r){this.persistence=t,this.auth=e,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=Si(this.userKey,s.apiKey,i),this.fullPersistenceKey=Si("persistence",s.apiKey,i),this.boundEventHandler=e._onStorageEvent.bind(e),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);return t?Ye._fromJSON(this.auth,t):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const e=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,e)return this.setCurrentUser(e)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,e,r="authUser"){if(!e.length)return new Pr(Ge(ou),t,r);const s=(await Promise.all(e.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=s[0]||Ge(ou);const a=Si(r,t.config.apiKey,t.name);let l=null;for(const d of e)try{const f=await d._get(a);if(f){const m=Ye._fromJSON(t,f);d!==i&&(l=m),i=d;break}}catch{}const c=s.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new Pr(i,t,r):(i=c[0],l&&await i._set(a,l.toJSON()),await Promise.all(e.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new Pr(i,t,r))}}/**
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
 */function au(n){const t=n.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Wd(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(qd(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Gd(t))return"Blackberry";if(Kd(t))return"Webos";if(jd(t))return"Safari";if((t.includes("chrome/")||Hd(t))&&!t.includes("edge/"))return"Chrome";if(Yd(t))return"Android";{const e=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(e);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function qd(n=Jt()){return/firefox\//i.test(n)}function jd(n=Jt()){const t=n.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function Hd(n=Jt()){return/crios\//i.test(n)}function Wd(n=Jt()){return/iemobile/i.test(n)}function Yd(n=Jt()){return/android/i.test(n)}function Gd(n=Jt()){return/blackberry/i.test(n)}function Kd(n=Jt()){return/webos/i.test(n)}function Za(n=Jt()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function qg(n=Jt()){var t;return Za(n)&&!!(!((t=window.navigator)===null||t===void 0)&&t.standalone)}function jg(){return rm()&&document.documentMode===10}function Qd(n=Jt()){return Za(n)||Yd(n)||Kd(n)||Gd(n)||/windows phone/i.test(n)||Wd(n)}/**
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
 */function Jd(n,t=[]){let e;switch(n){case"Browser":e=au(Jt());break;case"Worker":e=`${au(Jt())}-${n}`;break;default:e=n}const r=t.length?t.join(","):"FirebaseCore-web";return`${e}/JsCore/${qr}/${r}`}/**
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
 */class Hg{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,e){const r=i=>new Promise((a,l)=>{try{const c=t(i);a(c)}catch(c){l(c)}});r.onAbort=e,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const e=[];try{for(const r of this.queue)await r(t),r.onAbort&&e.push(r.onAbort)}catch(r){e.reverse();for(const s of e)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function Wg(n,t={}){return Oe(n,"GET","/v2/passwordPolicy",rn(n,t))}/**
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
 */const Yg=6;class Gg{constructor(t){var e,r,s,i;const a=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(e=a.minPasswordLength)!==null&&e!==void 0?e:Yg,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=t.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=t.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=t.schemaVersion}validatePassword(t){var e,r,s,i,a,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,c),this.validatePasswordCharacterOptions(t,c),c.isValid&&(c.isValid=(e=c.meetsMinPasswordLength)!==null&&e!==void 0?e:!0),c.isValid&&(c.isValid=(r=c.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsLowercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(t,e){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(e.meetsMinPasswordLength=t.length>=r),s&&(e.meetsMaxPasswordLength=t.length<=s)}validatePasswordCharacterOptions(t,e){this.updatePasswordCharacterOptionsStatuses(e,!1,!1,!1,!1);let r;for(let s=0;s<t.length;s++)r=t.charAt(s),this.updatePasswordCharacterOptionsStatuses(e,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(t,e,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=e)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=i))}}/**
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
 */class Kg{constructor(t,e,r,s){this.app=t,this.heartbeatServiceProvider=e,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new lu(this),this.idTokenSubscription=new lu(this),this.beforeStateQueue=new Hg(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Vd,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(t,e){return e&&(this._popupRedirectResolver=Ge(e)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await Pr.create(this,t),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(e),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const e=await zd(this,{idToken:t}),r=await Ye._fromGetAccountInfoResponse(this,e,t);await this.directlySetCurrentUser(r)}catch(e){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){var e;if(ve(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(e=this.redirectUser)===null||e===void 0?void 0:e._redirectEventId,l=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(t);(!a||a===l)&&(c!=null&&c.user)&&(s=c.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return W(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(t){let e=null;try{e=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return e}async reloadAndSetCurrentUserOrClear(t){try{await Fi(t)}catch(e){if((e==null?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=Rg()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(ve(this.app))return Promise.reject(Ke(this));const e=t?It(t):null;return e&&W(e.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(e&&e._clone(this))}async _updateCurrentUser(t,e=!1){if(!this._deleted)return t&&W(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),e||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return ve(this.app)?Promise.reject(Ke(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return ve(this.app)?Promise.reject(Ke(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ge(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const e=this._getPasswordPolicyInternal();return e.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):e.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await Wg(this),e=new Gg(t);this.tenantId===null?this._projectPasswordPolicy=e:this._tenantPasswordPolicies[this.tenantId]=e}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(t){this._errorFactory=new Ls("auth","Firebase",t())}onAuthStateChanged(t,e,r){return this.registerStateListener(this.authStateSubscription,t,e,r)}beforeAuthStateChanged(t,e){return this.beforeStateQueue.pushCallback(t,e)}onIdTokenChanged(t,e,r){return this.registerStateListener(this.idTokenSubscription,t,e,r)}authStateReady(){return new Promise((t,e)=>{if(this.currentUser)t();else{const r=this.onAuthStateChanged(()=>{r(),t()},e)}})}async revokeAccessToken(t){if(this.currentUser){const e=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:e};this.tenantId!=null&&(r.tenantId=this.tenantId),await $g(this,r)}}toJSON(){var t;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(t=this._currentUser)===null||t===void 0?void 0:t.toJSON()}}async _setRedirectUser(t,e){const r=await this.getOrInitRedirectPersistenceManager(e);return t===null?r.removeCurrentUser():r.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const e=t&&Ge(t)||this._popupRedirectResolver;W(e,this,"argument-error"),this.redirectPersistenceManager=await Pr.create(this,[Ge(e._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){var e,r;return this._isInitialized&&await this.queue(async()=>{}),((e=this._currentUser)===null||e===void 0?void 0:e._redirectEventId)===t?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t,e;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(e=(t=this.currentUser)===null||t===void 0?void 0:t.uid)!==null&&e!==void 0?e:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,e,r,s){if(this._deleted)return()=>{};const i=typeof e=="function"?e:e.next.bind(e);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(W(l,this,"internal-error"),l.then(()=>{a||i(this.currentUser)}),typeof e=="function"){const c=t.addObserver(e,r,s);return()=>{a=!0,c()}}else{const c=t.addObserver(e);return()=>{a=!0,c()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return W(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=Jd(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var t;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const r=await((t=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getHeartbeatsHeader());r&&(e["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){var t;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getToken());return e!=null&&e.error&&Ig(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function sn(n){return It(n)}class lu{constructor(t){this.auth=t,this.observer=null,this.addObserver=dm(e=>this.observer=e)}get next(){return W(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let ro={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Qg(n){ro=n}function Xd(n){return ro.loadJS(n)}function Jg(){return ro.recaptchaEnterpriseScript}function Xg(){return ro.gapiScript}function Zg(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const ty="recaptcha-enterprise",ey="NO_RECAPTCHA";class ny{constructor(t){this.type=ty,this.auth=sn(t)}async verify(t="verify",e=!1){async function r(i){if(!e){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,l)=>{Ng(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new Mg(c);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,a(d.siteKey)}}).catch(c=>{l(c)})})}function s(i,a,l){const c=window.grecaptcha;ru(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:t}).then(d=>{a(d)}).catch(()=>{a(ey)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,a)=>{r(this.auth).then(l=>{if(!e&&ru(window.grecaptcha))s(l,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=Jg();c.length!==0&&(c+=l),Xd(c).then(()=>{s(l,i,a)}).catch(d=>{a(d)})}}).catch(l=>{a(l)})})}}async function cu(n,t,e,r=!1){const s=new ny(n);let i;try{i=await s.verify(e)}catch{i=await s.verify(e,!0)}const a=Object.assign({},t);return r?Object.assign(a,{captchaResp:i}):Object.assign(a,{captchaResponse:i}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function zi(n,t,e,r){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await cu(n,t,e,e==="getOobCode");return r(n,i)}else return r(n,t).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${e} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await cu(n,t,e,e==="getOobCode");return r(n,a)}else return Promise.reject(i)})}/**
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
 */function ry(n,t){const e=Ya(n,"auth");if(e.isInitialized()){const s=e.getImmediate(),i=e.getOptions();if(Vi(i,t??{}))return s;me(s,"already-initialized")}return e.initialize({options:t})}function sy(n,t){const e=(t==null?void 0:t.persistence)||[],r=(Array.isArray(e)?e:[e]).map(Ge);t!=null&&t.errorMap&&n._updateErrorMap(t.errorMap),n._initializeWithPersistence(r,t==null?void 0:t.popupRedirectResolver)}function iy(n,t,e){const r=sn(n);W(r._canInitEmulator,r,"emulator-config-failed"),W(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const s=!1,i=Zd(t),{host:a,port:l}=oy(t),c=l===null?"":`:${l}`;r.config.emulator={url:`${i}//${a}${c}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),ay()}function Zd(n){const t=n.indexOf(":");return t<0?"":n.substr(0,t+1)}function oy(n){const t=Zd(n),e=/(\/\/)?([^?#/]+)/.exec(n.substr(t.length));if(!e)return{host:"",port:null};const r=e[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:uu(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:uu(a)}}}function uu(n){if(!n)return null;const t=Number(n);return isNaN(t)?null:t}function ay(){function n(){const t=document.createElement("p"),e=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",e.position="fixed",e.width="100%",e.backgroundColor="#ffffff",e.border=".1em solid #000000",e.color="#b50000",e.bottom="0px",e.left="0px",e.margin="0px",e.zIndex="10000",e.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class tl{constructor(t,e){this.providerId=t,this.signInMethod=e}toJSON(){return We("not implemented")}_getIdTokenResponse(t){return We("not implemented")}_linkToIdToken(t,e){return We("not implemented")}_getReauthenticationResolver(t){return We("not implemented")}}async function ly(n,t){return Oe(n,"POST","/v1/accounts:signUp",t)}/**
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
 */async function cy(n,t){return Bs(n,"POST","/v1/accounts:signInWithPassword",rn(n,t))}async function uy(n,t){return Oe(n,"POST","/v1/accounts:sendOobCode",rn(n,t))}async function dy(n,t){return uy(n,t)}/**
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
 */async function hy(n,t){return Bs(n,"POST","/v1/accounts:signInWithEmailLink",rn(n,t))}async function fy(n,t){return Bs(n,"POST","/v1/accounts:signInWithEmailLink",rn(n,t))}/**
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
 */class As extends tl{constructor(t,e,r,s=null){super("password",r),this._email=t,this._password=e,this._tenantId=s}static _fromEmailAndPassword(t,e){return new As(t,e,"password")}static _fromEmailAndCode(t,e,r=null){return new As(t,e,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t;if(e!=null&&e.email&&(e!=null&&e.password)){if(e.signInMethod==="password")return this._fromEmailAndPassword(e.email,e.password);if(e.signInMethod==="emailLink")return this._fromEmailAndCode(e.email,e.password,e.tenantId)}return null}async _getIdTokenResponse(t){switch(this.signInMethod){case"password":const e={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return zi(t,e,"signInWithPassword",cy);case"emailLink":return hy(t,{email:this._email,oobCode:this._password});default:me(t,"internal-error")}}async _linkToIdToken(t,e){switch(this.signInMethod){case"password":const r={idToken:e,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return zi(t,r,"signUpPassword",ly);case"emailLink":return fy(t,{idToken:e,email:this._email,oobCode:this._password});default:me(t,"internal-error")}}_getReauthenticationResolver(t){return this._getIdTokenResponse(t)}}/**
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
 */async function Cr(n,t){return Bs(n,"POST","/v1/accounts:signInWithIdp",rn(n,t))}/**
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
 */const py="http://localhost";class Kn extends tl{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const e=new Kn(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(e.idToken=t.idToken),t.accessToken&&(e.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(e.nonce=t.nonce),t.pendingToken&&(e.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(e.accessToken=t.oauthToken,e.secret=t.oauthTokenSecret):me("argument-error"),e}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t,{providerId:r,signInMethod:s}=e,i=Ga(e,["providerId","signInMethod"]);if(!r||!s)return null;const a=new Kn(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(t){const e=this.buildRequest();return Cr(t,e)}_linkToIdToken(t,e){const r=this.buildRequest();return r.idToken=e,Cr(t,r)}_getReauthenticationResolver(t){const e=this.buildRequest();return e.autoCreate=!1,Cr(t,e)}buildRequest(){const t={requestUri:py,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const e={};this.idToken&&(e.id_token=this.idToken),this.accessToken&&(e.access_token=this.accessToken),this.secret&&(e.oauth_token_secret=this.secret),e.providerId=this.providerId,this.nonce&&!this.pendingToken&&(e.nonce=this.nonce),t.postBody=Vs(e)}return t}}/**
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
 */function my(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function gy(n){const t=us(ds(n)).link,e=t?us(ds(t)).deep_link_id:null,r=us(ds(n)).deep_link_id;return(r?us(ds(r)).link:null)||r||e||t||n}class el{constructor(t){var e,r,s,i,a,l;const c=us(ds(t)),d=(e=c.apiKey)!==null&&e!==void 0?e:null,f=(r=c.oobCode)!==null&&r!==void 0?r:null,m=my((s=c.mode)!==null&&s!==void 0?s:null);W(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(a=c.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(t){const e=gy(t);try{return new el(e)}catch{return null}}}/**
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
 */class jr{constructor(){this.providerId=jr.PROVIDER_ID}static credential(t,e){return As._fromEmailAndPassword(t,e)}static credentialWithLink(t,e){const r=el.parseLink(e);return W(r,"argument-error"),As._fromEmailAndCode(t,r.code,r.tenantId)}}jr.PROVIDER_ID="password";jr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";jr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class nl{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Fs extends nl{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}/**
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
 */class mn extends Fs{constructor(){super("facebook.com")}static credential(t){return Kn._fromParams({providerId:mn.PROVIDER_ID,signInMethod:mn.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return mn.credentialFromTaggedObject(t)}static credentialFromError(t){return mn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return mn.credential(t.oauthAccessToken)}catch{return null}}}mn.FACEBOOK_SIGN_IN_METHOD="facebook.com";mn.PROVIDER_ID="facebook.com";/**
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
 */class He extends Fs{constructor(){super("google.com"),this.addScope("profile")}static credential(t,e){return Kn._fromParams({providerId:He.PROVIDER_ID,signInMethod:He.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:e})}static credentialFromResult(t){return He.credentialFromTaggedObject(t)}static credentialFromError(t){return He.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:e,oauthAccessToken:r}=t;if(!e&&!r)return null;try{return He.credential(e,r)}catch{return null}}}He.GOOGLE_SIGN_IN_METHOD="google.com";He.PROVIDER_ID="google.com";/**
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
 */class gn extends Fs{constructor(){super("github.com")}static credential(t){return Kn._fromParams({providerId:gn.PROVIDER_ID,signInMethod:gn.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return gn.credentialFromTaggedObject(t)}static credentialFromError(t){return gn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return gn.credential(t.oauthAccessToken)}catch{return null}}}gn.GITHUB_SIGN_IN_METHOD="github.com";gn.PROVIDER_ID="github.com";/**
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
 */class yn extends Fs{constructor(){super("twitter.com")}static credential(t,e){return Kn._fromParams({providerId:yn.PROVIDER_ID,signInMethod:yn.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:e})}static credentialFromResult(t){return yn.credentialFromTaggedObject(t)}static credentialFromError(t){return yn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:e,oauthTokenSecret:r}=t;if(!e||!r)return null;try{return yn.credential(e,r)}catch{return null}}}yn.TWITTER_SIGN_IN_METHOD="twitter.com";yn.PROVIDER_ID="twitter.com";/**
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
 */async function yy(n,t){return Bs(n,"POST","/v1/accounts:signUp",rn(n,t))}/**
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
 */class Qn{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,e,r,s=!1){const i=await Ye._fromIdTokenResponse(t,r,s),a=du(r);return new Qn({user:i,providerId:a,_tokenResponse:r,operationType:e})}static async _forOperation(t,e,r){await t._updateTokensIfNecessary(r,!0);const s=du(r);return new Qn({user:t,providerId:s,_tokenResponse:r,operationType:e})}}function du(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class Ui extends nn{constructor(t,e,r,s){var i;super(e.code,e.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Ui.prototype),this.customData={appName:t.name,tenantId:(i=t.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:e.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(t,e,r,s){return new Ui(t,e,r,s)}}function th(n,t,e,r){return(t==="reauthenticate"?e._getReauthenticationResolver(n):e._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Ui._fromErrorAndOperation(n,i,t,r):i})}async function vy(n,t,e=!1){const r=await Lr(n,t._linkToIdToken(n.auth,await n.getIdToken()),e);return Qn._forOperation(n,"link",r)}/**
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
 */async function _y(n,t,e=!1){const{auth:r}=n;if(ve(r.app))return Promise.reject(Ke(r));const s="reauthenticate";try{const i=await Lr(n,th(r,s,t,n),e);W(i.idToken,r,"internal-error");const a=Xa(i.idToken);W(a,r,"internal-error");const{sub:l}=a;return W(n.uid===l,r,"user-mismatch"),Qn._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&me(r,"user-mismatch"),i}}/**
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
 */async function eh(n,t,e=!1){if(ve(n.app))return Promise.reject(Ke(n));const r="signIn",s=await th(n,r,t),i=await Qn._fromIdTokenResponse(n,r,s);return e||await n._updateCurrentUser(i.user),i}async function wy(n,t){return eh(sn(n),t)}/**
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
 */async function nh(n){const t=sn(n);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function Ey(n,t,e){const r=sn(n);await zi(r,{requestType:"PASSWORD_RESET",email:t,clientType:"CLIENT_TYPE_WEB"},"getOobCode",dy)}async function by(n,t,e){if(ve(n.app))return Promise.reject(Ke(n));const r=sn(n),a=await zi(r,{returnSecureToken:!0,email:t,password:e,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",yy).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&nh(n),c}),l=await Qn._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(l.user),l}function Ty(n,t,e){return ve(n.app)?Promise.reject(Ke(n)):wy(It(n),jr.credential(t,e)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&nh(n),r})}/**
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
 */async function Iy(n,t){return Oe(n,"POST","/v1/accounts:update",t)}/**
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
 */async function Sy(n,{displayName:t,photoURL:e}){if(t===void 0&&e===void 0)return;const r=It(n),i={idToken:await r.getIdToken(),displayName:t,photoUrl:e,returnSecureToken:!0},a=await Lr(r,Iy(r.auth,i));r.displayName=a.displayName||null,r.photoURL=a.photoUrl||null;const l=r.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=r.displayName,l.photoURL=r.photoURL),await r._updateTokensIfNecessary(a)}function Ay(n,t,e,r){return It(n).onIdTokenChanged(t,e,r)}function xy(n,t,e){return It(n).beforeAuthStateChanged(t,e)}function Ry(n,t,e,r){return It(n).onAuthStateChanged(t,e,r)}function Py(n){return It(n).signOut()}const $i="__sak";/**
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
 */class rh{constructor(t,e){this.storageRetriever=t,this.type=e}_isAvailable(){try{return this.storage?(this.storage.setItem($i,"1"),this.storage.removeItem($i),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,e){return this.storage.setItem(t,JSON.stringify(e)),Promise.resolve()}_get(t){const e=this.storage.getItem(t);return Promise.resolve(e?JSON.parse(e):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const Cy=1e3,ky=10;class sh extends rh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,e)=>this.onStorageEvent(t,e),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Qd(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const e of Object.keys(this.listeners)){const r=this.storage.getItem(e),s=this.localCache[e];r!==s&&t(e,s,r)}}onStorageEvent(t,e=!1){if(!t.key){this.forAllChangedKeys((a,l,c)=>{this.notifyListeners(a,c)});return}const r=t.key;e?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!e&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);jg()&&i!==t.newValue&&t.newValue!==t.oldValue?setTimeout(s,ky):s()}notifyListeners(t,e){this.localCache[t]=e;const r=this.listeners[t];if(r)for(const s of Array.from(r))s(e&&JSON.parse(e))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,e,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:e,newValue:r}),!0)})},Cy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,e){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,e){await super._set(t,e),this.localCache[t]=JSON.stringify(e)}async _get(t){const e=await super._get(t);return this.localCache[t]=JSON.stringify(e),e}async _remove(t){await super._remove(t),delete this.localCache[t]}}sh.type="LOCAL";const Dy=sh;/**
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
 */class ih extends rh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,e){}_removeListener(t,e){}}ih.type="SESSION";const oh=ih;/**
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
 */function My(n){return Promise.all(n.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(e){return{fulfilled:!1,reason:e}}}))}/**
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
 */class so{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const e=this.receivers.find(s=>s.isListeningto(t));if(e)return e;const r=new so(t);return this.receivers.push(r),r}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const e=t,{eventId:r,eventType:s,data:i}=e.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;e.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const l=Array.from(a).map(async d=>d(e.origin,i)),c=await My(l);e.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:c})}_subscribe(t,e){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(e)}_unsubscribe(t,e){this.handlersMap[t]&&e&&this.handlersMap[t].delete(e),(!e||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}so.receivers=[];/**
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
 */function rl(n="",t=10){let e="";for(let r=0;r<t;r++)e+=Math.floor(Math.random()*10);return n+e}/**
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
 */class Ny{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,e,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((l,c)=>{const d=rl("",20);s.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(m){const v=m;if(v.data.eventId===d)switch(v.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(v.data.response);break;default:clearTimeout(f),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:t,eventId:d,data:e},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function De(){return window}function Ly(n){De().location.href=n}/**
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
 */function ah(){return typeof De().WorkerGlobalScope<"u"&&typeof De().importScripts=="function"}async function Vy(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Oy(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function By(){return ah()?self:null}/**
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
 */const lh="firebaseLocalStorageDb",Fy=1,qi="firebaseLocalStorage",ch="fbase_key";class zs{constructor(t){this.request=t}toPromise(){return new Promise((t,e)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{e(this.request.error)})})}}function io(n,t){return n.transaction([qi],t?"readwrite":"readonly").objectStore(qi)}function zy(){const n=indexedDB.deleteDatabase(lh);return new zs(n).toPromise()}function ba(){const n=indexedDB.open(lh,Fy);return new Promise((t,e)=>{n.addEventListener("error",()=>{e(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(qi,{keyPath:ch})}catch(s){e(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(qi)?t(r):(r.close(),await zy(),t(await ba()))})})}async function hu(n,t,e){const r=io(n,!0).put({[ch]:t,value:e});return new zs(r).toPromise()}async function Uy(n,t){const e=io(n,!1).get(t),r=await new zs(e).toPromise();return r===void 0?null:r.value}function fu(n,t){const e=io(n,!0).delete(t);return new zs(e).toPromise()}const $y=800,qy=3;class uh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ba(),this.db)}async _withRetries(t){let e=0;for(;;)try{const r=await this._openDb();return await t(r)}catch(r){if(e++>qy)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ah()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=so._getInstance(By()),this.receiver._subscribe("keyChanged",async(t,e)=>({keyProcessed:(await this._poll()).includes(e.key)})),this.receiver._subscribe("ping",async(t,e)=>["keyChanged"])}async initializeSender(){var t,e;if(this.activeServiceWorker=await Vy(),!this.activeServiceWorker)return;this.sender=new Ny(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((t=r[0])===null||t===void 0)&&t.fulfilled&&!((e=r[0])===null||e===void 0)&&e.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||Oy()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const t=await ba();return await hu(t,$i,"1"),await fu(t,$i),!0}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,e){return this._withPendingWrite(async()=>(await this._withRetries(r=>hu(r,t,e)),this.localCache[t]=e,this.notifyServiceWorker(t)))}async _get(t){const e=await this._withRetries(r=>Uy(r,t));return this.localCache[t]=e,e}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(e=>fu(e,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(s=>{const i=io(s,!1).getAll();return new zs(i).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const e=[],r=new Set;if(t.length!==0)for(const{fbase_key:s,value:i}of t)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),e.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),e.push(s));return e}notifyListeners(t,e){this.localCache[t]=e;const r=this.listeners[t];if(r)for(const s of Array.from(r))s(e)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),$y)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,e){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}uh.type="LOCAL";const jy=uh;new Os(3e4,6e4);/**
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
 */function dh(n,t){return t?Ge(t):(W(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class sl extends tl{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return Cr(t,this._buildIdpRequest())}_linkToIdToken(t,e){return Cr(t,this._buildIdpRequest(e))}_getReauthenticationResolver(t){return Cr(t,this._buildIdpRequest())}_buildIdpRequest(t){const e={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(e.idToken=t),e}}function Hy(n){return eh(n.auth,new sl(n),n.bypassAuthState)}function Wy(n){const{auth:t,user:e}=n;return W(e,t,"internal-error"),_y(e,new sl(n),n.bypassAuthState)}async function Yy(n){const{auth:t,user:e}=n;return W(e,t,"internal-error"),vy(e,new sl(n),n.bypassAuthState)}/**
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
 */class hh{constructor(t,e,r,s,i=!1){this.auth=t,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(e)?e:[e]}execute(){return new Promise(async(t,e)=>{this.pendingPromise={resolve:t,reject:e};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(t){const{urlResponse:e,sessionId:r,postBody:s,tenantId:i,error:a,type:l}=t;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:e,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return Hy;case"linkViaPopup":case"linkViaRedirect":return Yy;case"reauthViaPopup":case"reauthViaRedirect":return Wy;default:me(this.auth,"internal-error")}}resolve(t){Xe(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){Xe(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Gy=new Os(2e3,1e4);async function Ky(n,t,e){if(ve(n.app))return Promise.reject(_e(n,"operation-not-supported-in-this-environment"));const r=sn(n);Sg(n,t,nl);const s=dh(r,e);return new $n(r,"signInViaPopup",t,s).executeNotNull()}class $n extends hh{constructor(t,e,r,s,i){super(t,e,s,i),this.provider=r,this.authWindow=null,this.pollId=null,$n.currentPopupAction&&$n.currentPopupAction.cancel(),$n.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return W(t,this.auth,"internal-error"),t}async onExecution(){Xe(this.filter.length===1,"Popup operations only handle one event");const t=rl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(_e(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var t;return((t=this.authWindow)===null||t===void 0?void 0:t.associatedEvent)||null}cancel(){this.reject(_e(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,$n.currentPopupAction=null}pollUserCancellation(){const t=()=>{var e,r;if(!((r=(e=this.authWindow)===null||e===void 0?void 0:e.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(_e(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,Gy.get())};t()}}$n.currentPopupAction=null;/**
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
 */const Qy="pendingRedirect",Ai=new Map;class Jy extends hh{constructor(t,e,r=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],e,void 0,r),this.eventId=null}async execute(){let t=Ai.get(this.auth._key());if(!t){try{const r=await Xy(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(r)}catch(e){t=()=>Promise.reject(e)}Ai.set(this.auth._key(),t)}return this.bypassAuthState||Ai.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const e=await this.auth._redirectUserForId(t.eventId);if(e)return this.user=e,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Xy(n,t){const e=ev(t),r=tv(n);if(!await r._isAvailable())return!1;const s=await r._get(e)==="true";return await r._remove(e),s}function Zy(n,t){Ai.set(n._key(),t)}function tv(n){return Ge(n._redirectPersistence)}function ev(n){return Si(Qy,n.config.apiKey,n.name)}async function nv(n,t,e=!1){if(ve(n.app))return Promise.reject(Ke(n));const r=sn(n),s=dh(r,t),a=await new Jy(r,s,e).execute();return a&&!e&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,t)),a}/**
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
 */const rv=10*60*1e3;class sv{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let e=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(t,r)&&(e=!0,this.sendToConsumer(t,r),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!iv(t)||(this.hasHandledPotentialRedirect=!0,e||(this.queuedRedirectEvent=t,e=!0)),e}sendToConsumer(t,e){var r;if(t.error&&!fh(t)){const s=((r=t.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";e.onError(_e(this.auth,s))}else e.onAuthEvent(t)}isEventForConsumer(t,e){const r=e.eventId===null||!!t.eventId&&t.eventId===e.eventId;return e.filter.includes(t.type)&&r}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=rv&&this.cachedEventUids.clear(),this.cachedEventUids.has(pu(t))}saveEventToCache(t){this.cachedEventUids.add(pu(t)),this.lastProcessedEventTime=Date.now()}}function pu(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(t=>t).join("-")}function fh({type:n,error:t}){return n==="unknown"&&(t==null?void 0:t.code)==="auth/no-auth-event"}function iv(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return fh(n);default:return!1}}/**
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
 */async function ov(n,t={}){return Oe(n,"GET","/v1/projects",t)}/**
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
 */const av=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,lv=/^https?/;async function cv(n){if(n.config.emulator)return;const{authorizedDomains:t}=await ov(n);for(const e of t)try{if(uv(e))return}catch{}me(n,"unauthorized-domain")}function uv(n){const t=wa(),{protocol:e,hostname:r}=new URL(t);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?e==="chrome-extension:"&&n.replace("chrome-extension://","")===t.replace("chrome-extension://",""):e==="chrome-extension:"&&a.hostname===r}if(!lv.test(e))return!1;if(av.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const dv=new Os(3e4,6e4);function mu(){const n=De().___jsl;if(n!=null&&n.H){for(const t of Object.keys(n.H))if(n.H[t].r=n.H[t].r||[],n.H[t].L=n.H[t].L||[],n.H[t].r=[...n.H[t].L],n.CP)for(let e=0;e<n.CP.length;e++)n.CP[e]=null}}function hv(n){return new Promise((t,e)=>{var r,s,i;function a(){mu(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{mu(),e(_e(n,"network-request-failed"))},timeout:dv.get()})}if(!((s=(r=De().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)t(gapi.iframes.getContext());else if(!((i=De().gapi)===null||i===void 0)&&i.load)a();else{const l=Zg("iframefcb");return De()[l]=()=>{gapi.load?a():e(_e(n,"network-request-failed"))},Xd(`${Xg()}?onload=${l}`).catch(c=>e(c))}}).catch(t=>{throw xi=null,t})}let xi=null;function fv(n){return xi=xi||hv(n),xi}/**
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
 */const pv=new Os(5e3,15e3),mv="__/auth/iframe",gv="emulator/auth/iframe",yv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},vv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function _v(n){const t=n.config;W(t.authDomain,n,"auth-domain-config-required");const e=t.emulator?Ja(t,gv):`https://${n.config.authDomain}/${mv}`,r={apiKey:t.apiKey,appName:n.name,v:qr},s=vv.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${e}?${Vs(r).slice(1)}`}async function wv(n){const t=await fv(n),e=De().gapi;return W(e,n,"internal-error"),t.open({where:document.body,url:_v(n),messageHandlersFilter:e.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:yv,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=_e(n,"network-request-failed"),l=De().setTimeout(()=>{i(a)},pv.get());function c(){De().clearTimeout(l),s(r)}r.ping(c).then(c,()=>{i(a)})}))}/**
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
 */const Ev={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},bv=500,Tv=600,Iv="_blank",Sv="http://localhost";class gu{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Av(n,t,e,r=bv,s=Tv){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const c=Object.assign(Object.assign({},Ev),{width:r.toString(),height:s.toString(),top:i,left:a}),d=Jt().toLowerCase();e&&(l=Hd(d)?Iv:e),qd(d)&&(t=t||Sv,c.scrollbars="yes");const f=Object.entries(c).reduce((v,[E,T])=>`${v}${E}=${T},`,"");if(qg(d)&&l!=="_self")return xv(t||"",l),new gu(null);const m=window.open(t||"",l,f);W(m,n,"popup-blocked");try{m.focus()}catch{}return new gu(m)}function xv(n,t){const e=document.createElement("a");e.href=n,e.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),e.dispatchEvent(r)}/**
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
 */const Rv="__/auth/handler",Pv="emulator/auth/handler",Cv=encodeURIComponent("fac");async function yu(n,t,e,r,s,i){W(n.config.authDomain,n,"auth-domain-config-required"),W(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:e,redirectUrl:r,v:qr,eventId:s};if(t instanceof nl){t.setDefaultLanguage(n.languageCode),a.providerId=t.providerId||"",um(t.getCustomParameters())||(a.customParameters=JSON.stringify(t.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(t instanceof Fs){const f=t.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),d=c?`#${Cv}=${encodeURIComponent(c)}`:"";return`${kv(n)}?${Vs(l).slice(1)}${d}`}function kv({config:n}){return n.emulator?Ja(n,Pv):`https://${n.authDomain}/${Rv}`}/**
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
 */const ea="webStorageSupport";class Dv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=oh,this._completeRedirectFn=nv,this._overrideRedirectResult=Zy}async _openPopup(t,e,r,s){var i;Xe((i=this.eventManagers[t._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await yu(t,e,r,wa(),s);return Av(t,a,rl())}async _openRedirect(t,e,r,s){await this._originValidation(t);const i=await yu(t,e,r,wa(),s);return Ly(i),new Promise(()=>{})}_initialize(t){const e=t._key();if(this.eventManagers[e]){const{manager:s,promise:i}=this.eventManagers[e];return s?Promise.resolve(s):(Xe(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(t);return this.eventManagers[e]={promise:r},r.catch(()=>{delete this.eventManagers[e]}),r}async initAndGetManager(t){const e=await wv(t),r=new sv(t);return e.register("authEvent",s=>(W(s==null?void 0:s.authEvent,t,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:r},this.iframes[t._key()]=e,r}_isIframeWebStorageSupported(t,e){this.iframes[t._key()].send(ea,{type:ea},s=>{var i;const a=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[ea];a!==void 0&&e(!!a),me(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const e=t._key();return this.originValidationPromises[e]||(this.originValidationPromises[e]=cv(t)),this.originValidationPromises[e]}get _shouldInitProactively(){return Qd()||jd()||Za()}}const Mv=Dv;var vu="@firebase/auth",_u="1.7.9";/**
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
 */class Nv{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){var t;return this.assertAuthConfigured(),((t=this.auth.currentUser)===null||t===void 0?void 0:t.uid)||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const e=this.auth.onIdTokenChanged(r=>{t((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(t,e),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const e=this.internalListeners.get(t);e&&(this.internalListeners.delete(t),e(),this.updateProactiveRefresh())}assertAuthConfigured(){W(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function Lv(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Vv(n){Nr(new Gn("auth",(t,{options:e})=>{const r=t.getProvider("app").getImmediate(),s=t.getProvider("heartbeat"),i=t.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=r.options;W(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Jd(n)},d=new Kg(r,s,i,c);return sy(d,e),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,r)=>{t.getProvider("auth-internal").initialize()})),Nr(new Gn("auth-internal",t=>{const e=sn(t.getProvider("auth").getImmediate());return(r=>new Nv(r))(e)},"PRIVATE").setInstantiationMode("EXPLICIT")),Tn(vu,_u,Lv(n)),Tn(vu,_u,"esm2017")}/**
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
 */const Ov=5*60,Bv=Rd("authIdTokenMaxAge")||Ov;let wu=null;const Fv=n=>async t=>{const e=t&&await t.getIdTokenResult(),r=e&&(new Date().getTime()-Date.parse(e.issuedAtTime))/1e3;if(r&&r>Bv)return;const s=e==null?void 0:e.token;wu!==s&&(wu=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function zv(n=Dd()){const t=Ya(n,"auth");if(t.isInitialized())return t.getImmediate();const e=ry(n,{popupRedirectResolver:Mv,persistence:[jy,Dy,oh]}),r=Rd("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=Fv(i.toString());xy(e,a,()=>a(e.currentUser)),Ay(e,l=>a(l))}}const s=Ad("auth");return s&&iy(e,`http://${s}`),e}function Uv(){var n,t;return(t=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&t!==void 0?t:document}Qg({loadJS(n){return new Promise((t,e)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=t,r.onerror=s=>{const i=_e("internal-error");i.customData=s,e(i)},r.type="text/javascript",r.charset="UTF-8",Uv().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Vv("Browser");var Eu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var jn,ph;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(b,g){function y(){}y.prototype=g.prototype,b.D=g.prototype,b.prototype=new y,b.prototype.constructor=b,b.C=function(w,S,A){for(var _=Array(arguments.length-2),ot=2;ot<arguments.length;ot++)_[ot-2]=arguments[ot];return g.prototype[S].apply(w,_)}}function e(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(r,e),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(b,g,y){y||(y=0);var w=Array(16);if(typeof g=="string")for(var S=0;16>S;++S)w[S]=g.charCodeAt(y++)|g.charCodeAt(y++)<<8|g.charCodeAt(y++)<<16|g.charCodeAt(y++)<<24;else for(S=0;16>S;++S)w[S]=g[y++]|g[y++]<<8|g[y++]<<16|g[y++]<<24;g=b.g[0],y=b.g[1],S=b.g[2];var A=b.g[3],_=g+(A^y&(S^A))+w[0]+3614090360&4294967295;g=y+(_<<7&4294967295|_>>>25),_=A+(S^g&(y^S))+w[1]+3905402710&4294967295,A=g+(_<<12&4294967295|_>>>20),_=S+(y^A&(g^y))+w[2]+606105819&4294967295,S=A+(_<<17&4294967295|_>>>15),_=y+(g^S&(A^g))+w[3]+3250441966&4294967295,y=S+(_<<22&4294967295|_>>>10),_=g+(A^y&(S^A))+w[4]+4118548399&4294967295,g=y+(_<<7&4294967295|_>>>25),_=A+(S^g&(y^S))+w[5]+1200080426&4294967295,A=g+(_<<12&4294967295|_>>>20),_=S+(y^A&(g^y))+w[6]+2821735955&4294967295,S=A+(_<<17&4294967295|_>>>15),_=y+(g^S&(A^g))+w[7]+4249261313&4294967295,y=S+(_<<22&4294967295|_>>>10),_=g+(A^y&(S^A))+w[8]+1770035416&4294967295,g=y+(_<<7&4294967295|_>>>25),_=A+(S^g&(y^S))+w[9]+2336552879&4294967295,A=g+(_<<12&4294967295|_>>>20),_=S+(y^A&(g^y))+w[10]+4294925233&4294967295,S=A+(_<<17&4294967295|_>>>15),_=y+(g^S&(A^g))+w[11]+2304563134&4294967295,y=S+(_<<22&4294967295|_>>>10),_=g+(A^y&(S^A))+w[12]+1804603682&4294967295,g=y+(_<<7&4294967295|_>>>25),_=A+(S^g&(y^S))+w[13]+4254626195&4294967295,A=g+(_<<12&4294967295|_>>>20),_=S+(y^A&(g^y))+w[14]+2792965006&4294967295,S=A+(_<<17&4294967295|_>>>15),_=y+(g^S&(A^g))+w[15]+1236535329&4294967295,y=S+(_<<22&4294967295|_>>>10),_=g+(S^A&(y^S))+w[1]+4129170786&4294967295,g=y+(_<<5&4294967295|_>>>27),_=A+(y^S&(g^y))+w[6]+3225465664&4294967295,A=g+(_<<9&4294967295|_>>>23),_=S+(g^y&(A^g))+w[11]+643717713&4294967295,S=A+(_<<14&4294967295|_>>>18),_=y+(A^g&(S^A))+w[0]+3921069994&4294967295,y=S+(_<<20&4294967295|_>>>12),_=g+(S^A&(y^S))+w[5]+3593408605&4294967295,g=y+(_<<5&4294967295|_>>>27),_=A+(y^S&(g^y))+w[10]+38016083&4294967295,A=g+(_<<9&4294967295|_>>>23),_=S+(g^y&(A^g))+w[15]+3634488961&4294967295,S=A+(_<<14&4294967295|_>>>18),_=y+(A^g&(S^A))+w[4]+3889429448&4294967295,y=S+(_<<20&4294967295|_>>>12),_=g+(S^A&(y^S))+w[9]+568446438&4294967295,g=y+(_<<5&4294967295|_>>>27),_=A+(y^S&(g^y))+w[14]+3275163606&4294967295,A=g+(_<<9&4294967295|_>>>23),_=S+(g^y&(A^g))+w[3]+4107603335&4294967295,S=A+(_<<14&4294967295|_>>>18),_=y+(A^g&(S^A))+w[8]+1163531501&4294967295,y=S+(_<<20&4294967295|_>>>12),_=g+(S^A&(y^S))+w[13]+2850285829&4294967295,g=y+(_<<5&4294967295|_>>>27),_=A+(y^S&(g^y))+w[2]+4243563512&4294967295,A=g+(_<<9&4294967295|_>>>23),_=S+(g^y&(A^g))+w[7]+1735328473&4294967295,S=A+(_<<14&4294967295|_>>>18),_=y+(A^g&(S^A))+w[12]+2368359562&4294967295,y=S+(_<<20&4294967295|_>>>12),_=g+(y^S^A)+w[5]+4294588738&4294967295,g=y+(_<<4&4294967295|_>>>28),_=A+(g^y^S)+w[8]+2272392833&4294967295,A=g+(_<<11&4294967295|_>>>21),_=S+(A^g^y)+w[11]+1839030562&4294967295,S=A+(_<<16&4294967295|_>>>16),_=y+(S^A^g)+w[14]+4259657740&4294967295,y=S+(_<<23&4294967295|_>>>9),_=g+(y^S^A)+w[1]+2763975236&4294967295,g=y+(_<<4&4294967295|_>>>28),_=A+(g^y^S)+w[4]+1272893353&4294967295,A=g+(_<<11&4294967295|_>>>21),_=S+(A^g^y)+w[7]+4139469664&4294967295,S=A+(_<<16&4294967295|_>>>16),_=y+(S^A^g)+w[10]+3200236656&4294967295,y=S+(_<<23&4294967295|_>>>9),_=g+(y^S^A)+w[13]+681279174&4294967295,g=y+(_<<4&4294967295|_>>>28),_=A+(g^y^S)+w[0]+3936430074&4294967295,A=g+(_<<11&4294967295|_>>>21),_=S+(A^g^y)+w[3]+3572445317&4294967295,S=A+(_<<16&4294967295|_>>>16),_=y+(S^A^g)+w[6]+76029189&4294967295,y=S+(_<<23&4294967295|_>>>9),_=g+(y^S^A)+w[9]+3654602809&4294967295,g=y+(_<<4&4294967295|_>>>28),_=A+(g^y^S)+w[12]+3873151461&4294967295,A=g+(_<<11&4294967295|_>>>21),_=S+(A^g^y)+w[15]+530742520&4294967295,S=A+(_<<16&4294967295|_>>>16),_=y+(S^A^g)+w[2]+3299628645&4294967295,y=S+(_<<23&4294967295|_>>>9),_=g+(S^(y|~A))+w[0]+4096336452&4294967295,g=y+(_<<6&4294967295|_>>>26),_=A+(y^(g|~S))+w[7]+1126891415&4294967295,A=g+(_<<10&4294967295|_>>>22),_=S+(g^(A|~y))+w[14]+2878612391&4294967295,S=A+(_<<15&4294967295|_>>>17),_=y+(A^(S|~g))+w[5]+4237533241&4294967295,y=S+(_<<21&4294967295|_>>>11),_=g+(S^(y|~A))+w[12]+1700485571&4294967295,g=y+(_<<6&4294967295|_>>>26),_=A+(y^(g|~S))+w[3]+2399980690&4294967295,A=g+(_<<10&4294967295|_>>>22),_=S+(g^(A|~y))+w[10]+4293915773&4294967295,S=A+(_<<15&4294967295|_>>>17),_=y+(A^(S|~g))+w[1]+2240044497&4294967295,y=S+(_<<21&4294967295|_>>>11),_=g+(S^(y|~A))+w[8]+1873313359&4294967295,g=y+(_<<6&4294967295|_>>>26),_=A+(y^(g|~S))+w[15]+4264355552&4294967295,A=g+(_<<10&4294967295|_>>>22),_=S+(g^(A|~y))+w[6]+2734768916&4294967295,S=A+(_<<15&4294967295|_>>>17),_=y+(A^(S|~g))+w[13]+1309151649&4294967295,y=S+(_<<21&4294967295|_>>>11),_=g+(S^(y|~A))+w[4]+4149444226&4294967295,g=y+(_<<6&4294967295|_>>>26),_=A+(y^(g|~S))+w[11]+3174756917&4294967295,A=g+(_<<10&4294967295|_>>>22),_=S+(g^(A|~y))+w[2]+718787259&4294967295,S=A+(_<<15&4294967295|_>>>17),_=y+(A^(S|~g))+w[9]+3951481745&4294967295,b.g[0]=b.g[0]+g&4294967295,b.g[1]=b.g[1]+(S+(_<<21&4294967295|_>>>11))&4294967295,b.g[2]=b.g[2]+S&4294967295,b.g[3]=b.g[3]+A&4294967295}r.prototype.u=function(b,g){g===void 0&&(g=b.length);for(var y=g-this.blockSize,w=this.B,S=this.h,A=0;A<g;){if(S==0)for(;A<=y;)s(this,b,A),A+=this.blockSize;if(typeof b=="string"){for(;A<g;)if(w[S++]=b.charCodeAt(A++),S==this.blockSize){s(this,w),S=0;break}}else for(;A<g;)if(w[S++]=b[A++],S==this.blockSize){s(this,w),S=0;break}}this.h=S,this.o+=g},r.prototype.v=function(){var b=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);b[0]=128;for(var g=1;g<b.length-8;++g)b[g]=0;var y=8*this.o;for(g=b.length-8;g<b.length;++g)b[g]=y&255,y/=256;for(this.u(b),b=Array(16),g=y=0;4>g;++g)for(var w=0;32>w;w+=8)b[y++]=this.g[g]>>>w&255;return b};function i(b,g){var y=l;return Object.prototype.hasOwnProperty.call(y,b)?y[b]:y[b]=g(b)}function a(b,g){this.h=g;for(var y=[],w=!0,S=b.length-1;0<=S;S--){var A=b[S]|0;w&&A==g||(y[S]=A,w=!1)}this.g=y}var l={};function c(b){return-128<=b&&128>b?i(b,function(g){return new a([g|0],0>g?-1:0)}):new a([b|0],0>b?-1:0)}function d(b){if(isNaN(b)||!isFinite(b))return m;if(0>b)return I(d(-b));for(var g=[],y=1,w=0;b>=y;w++)g[w]=b/y|0,y*=4294967296;return new a(g,0)}function f(b,g){if(b.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(b.charAt(0)=="-")return I(f(b.substring(1),g));if(0<=b.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(g,8)),w=m,S=0;S<b.length;S+=8){var A=Math.min(8,b.length-S),_=parseInt(b.substring(S,S+A),g);8>A?(A=d(Math.pow(g,A)),w=w.j(A).add(d(_))):(w=w.j(y),w=w.add(d(_)))}return w}var m=c(0),v=c(1),E=c(16777216);n=a.prototype,n.m=function(){if(x(this))return-I(this).m();for(var b=0,g=1,y=0;y<this.g.length;y++){var w=this.i(y);b+=(0<=w?w:4294967296+w)*g,g*=4294967296}return b},n.toString=function(b){if(b=b||10,2>b||36<b)throw Error("radix out of range: "+b);if(T(this))return"0";if(x(this))return"-"+I(this).toString(b);for(var g=d(Math.pow(b,6)),y=this,w="";;){var S=N(y,g).g;y=P(y,S.j(g));var A=((0<y.g.length?y.g[0]:y.h)>>>0).toString(b);if(y=S,T(y))return A+w;for(;6>A.length;)A="0"+A;w=A+w}},n.i=function(b){return 0>b?0:b<this.g.length?this.g[b]:this.h};function T(b){if(b.h!=0)return!1;for(var g=0;g<b.g.length;g++)if(b.g[g]!=0)return!1;return!0}function x(b){return b.h==-1}n.l=function(b){return b=P(this,b),x(b)?-1:T(b)?0:1};function I(b){for(var g=b.g.length,y=[],w=0;w<g;w++)y[w]=~b.g[w];return new a(y,~b.h).add(v)}n.abs=function(){return x(this)?I(this):this},n.add=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],w=0,S=0;S<=g;S++){var A=w+(this.i(S)&65535)+(b.i(S)&65535),_=(A>>>16)+(this.i(S)>>>16)+(b.i(S)>>>16);w=_>>>16,A&=65535,_&=65535,y[S]=_<<16|A}return new a(y,y[y.length-1]&-2147483648?-1:0)};function P(b,g){return b.add(I(g))}n.j=function(b){if(T(this)||T(b))return m;if(x(this))return x(b)?I(this).j(I(b)):I(I(this).j(b));if(x(b))return I(this.j(I(b)));if(0>this.l(E)&&0>b.l(E))return d(this.m()*b.m());for(var g=this.g.length+b.g.length,y=[],w=0;w<2*g;w++)y[w]=0;for(w=0;w<this.g.length;w++)for(var S=0;S<b.g.length;S++){var A=this.i(w)>>>16,_=this.i(w)&65535,ot=b.i(S)>>>16,At=b.i(S)&65535;y[2*w+2*S]+=_*At,D(y,2*w+2*S),y[2*w+2*S+1]+=A*At,D(y,2*w+2*S+1),y[2*w+2*S+1]+=_*ot,D(y,2*w+2*S+1),y[2*w+2*S+2]+=A*ot,D(y,2*w+2*S+2)}for(w=0;w<g;w++)y[w]=y[2*w+1]<<16|y[2*w];for(w=g;w<2*g;w++)y[w]=0;return new a(y,0)};function D(b,g){for(;(b[g]&65535)!=b[g];)b[g+1]+=b[g]>>>16,b[g]&=65535,g++}function C(b,g){this.g=b,this.h=g}function N(b,g){if(T(g))throw Error("division by zero");if(T(b))return new C(m,m);if(x(b))return g=N(I(b),g),new C(I(g.g),I(g.h));if(x(g))return g=N(b,I(g)),new C(I(g.g),g.h);if(30<b.g.length){if(x(b)||x(g))throw Error("slowDivide_ only works with positive integers.");for(var y=v,w=g;0>=w.l(b);)y=F(y),w=F(w);var S=V(y,1),A=V(w,1);for(w=V(w,2),y=V(y,2);!T(w);){var _=A.add(w);0>=_.l(b)&&(S=S.add(y),A=_),w=V(w,1),y=V(y,1)}return g=P(b,S.j(g)),new C(S,g)}for(S=m;0<=b.l(g);){for(y=Math.max(1,Math.floor(b.m()/g.m())),w=Math.ceil(Math.log(y)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),A=d(y),_=A.j(g);x(_)||0<_.l(b);)y-=w,A=d(y),_=A.j(g);T(A)&&(A=v),S=S.add(A),b=P(b,_)}return new C(S,b)}n.A=function(b){return N(this,b).h},n.and=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],w=0;w<g;w++)y[w]=this.i(w)&b.i(w);return new a(y,this.h&b.h)},n.or=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],w=0;w<g;w++)y[w]=this.i(w)|b.i(w);return new a(y,this.h|b.h)},n.xor=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],w=0;w<g;w++)y[w]=this.i(w)^b.i(w);return new a(y,this.h^b.h)};function F(b){for(var g=b.g.length+1,y=[],w=0;w<g;w++)y[w]=b.i(w)<<1|b.i(w-1)>>>31;return new a(y,b.h)}function V(b,g){var y=g>>5;g%=32;for(var w=b.g.length-y,S=[],A=0;A<w;A++)S[A]=0<g?b.i(A+y)>>>g|b.i(A+y+1)<<32-g:b.i(A+y);return new a(S,b.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,ph=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,jn=a}).apply(typeof Eu<"u"?Eu:typeof self<"u"?self:typeof window<"u"?window:{});var wi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var mh,hs,gh,Ri,Ta,yh,vh,_h;(function(){var n,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function e(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof wi=="object"&&wi];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=e(this);function s(o,u){if(u)t:{var h=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var R=o[p];if(!(R in h))break t;h=h[R]}o=o[o.length-1],p=h[o],u=u(p),u!=p&&u!=null&&t(h,o,{configurable:!0,writable:!0,value:u})}}function i(o,u){o instanceof String&&(o+="");var h=0,p=!1,R={next:function(){if(!p&&h<o.length){var k=h++;return{value:u(k,o[k]),done:!1}}return p=!0,{done:!0,value:void 0}}};return R[Symbol.iterator]=function(){return R},R}s("Array.prototype.values",function(o){return o||function(){return i(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function c(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function f(o,u,h){return o.call.apply(o.bind,arguments)}function m(o,u,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var R=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(R,p),o.apply(u,R)}}return function(){return o.apply(u,arguments)}}function v(o,u,h){return v=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,v.apply(null,arguments)}function E(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function T(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,R,k){for(var O=Array(arguments.length-2),dt=2;dt<arguments.length;dt++)O[dt-2]=arguments[dt];return u.prototype[R].apply(p,O)}}function x(o){const u=o.length;if(0<u){const h=Array(u);for(let p=0;p<u;p++)h[p]=o[p];return h}return[]}function I(o,u){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(c(p)){const R=o.length||0,k=p.length||0;o.length=R+k;for(let O=0;O<k;O++)o[R+O]=p[O]}else o.push(p)}}class P{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function D(o){return/^[\s\xa0]*$/.test(o)}function C(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function N(o){return N[" "](o),o}N[" "]=function(){};var F=C().indexOf("Gecko")!=-1&&!(C().toLowerCase().indexOf("webkit")!=-1&&C().indexOf("Edge")==-1)&&!(C().indexOf("Trident")!=-1||C().indexOf("MSIE")!=-1)&&C().indexOf("Edge")==-1;function V(o,u,h){for(const p in o)u.call(h,o[p],p,o)}function b(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function g(o){const u={};for(const h in o)u[h]=o[h];return u}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(o,u){let h,p;for(let R=1;R<arguments.length;R++){p=arguments[R];for(h in p)o[h]=p[h];for(let k=0;k<y.length;k++)h=y[k],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function S(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function A(o){l.setTimeout(()=>{throw o},0)}function _(){var o=ct;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class ot{constructor(){this.h=this.g=null}add(u,h){const p=At.get();p.set(u,h),this.h?this.h.next=p:this.g=p,this.h=p}}var At=new P(()=>new X,o=>o.reset());class X{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let Et,at=!1,ct=new ot,xt=()=>{const o=l.Promise.resolve(void 0);Et=()=>{o.then(ht)}};var ht=()=>{for(var o;o=_();){try{o.h.call(o.g)}catch(h){A(h)}var u=At;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}at=!1};function yt(){this.s=this.s,this.C=this.C}yt.prototype.s=!1,yt.prototype.ma=function(){this.s||(this.s=!0,this.N())},yt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function $(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}$.prototype.h=function(){this.defaultPrevented=!0};var _t=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};l.addEventListener("test",h,u),l.removeEventListener("test",h,u)}catch{}return o}();function J(o,u){if($.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(F){t:{try{N(u.nodeName);var R=!0;break t}catch{}R=!1}R||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:it[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&J.aa.h.call(this)}}T(J,$);var it={2:"touch",3:"pen",4:"mouse"};J.prototype.h=function(){J.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var kt="closure_listenable_"+(1e6*Math.random()|0),ue=0;function de(o,u,h,p,R){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!p,this.ha=R,this.key=++ue,this.da=this.fa=!1}function Dt(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function be(o){this.src=o,this.g={},this.h=0}be.prototype.add=function(o,u,h,p,R){var k=o.toString();o=this.g[k],o||(o=this.g[k]=[],this.h++);var O=lr(o,u,p,R);return-1<O?(u=o[O],h||(u.fa=!1)):(u=new de(u,this.src,k,!!p,R),u.fa=h,o.push(u)),u};function ar(o,u){var h=u.type;if(h in o.g){var p=o.g[h],R=Array.prototype.indexOf.call(p,u,void 0),k;(k=0<=R)&&Array.prototype.splice.call(p,R,1),k&&(Dt(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function lr(o,u,h,p){for(var R=0;R<o.length;++R){var k=o[R];if(!k.da&&k.listener==u&&k.capture==!!h&&k.ha==p)return R}return-1}var Nn="closure_lm_"+(1e6*Math.random()|0),Ln={};function Te(o,u,h,p,R){if(Array.isArray(u)){for(var k=0;k<u.length;k++)Te(o,u[k],h,p,R);return null}return h=Jr(h),o&&o[kt]?o.K(u,h,d(p)?!!p.capture:!1,R):cr(o,u,h,!1,p,R)}function cr(o,u,h,p,R,k){if(!u)throw Error("Invalid event type");var O=d(R)?!!R.capture:!!R,dt=Ie(o);if(dt||(o[Nn]=dt=new be(o)),h=dt.add(u,h,p,O,k),h.proxy)return h;if(p=ur(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)_t||(R=O),R===void 0&&(R=!1),o.addEventListener(u.toString(),p,R);else if(o.attachEvent)o.attachEvent(on(u.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function ur(){function o(h){return u.call(o.src,o.listener,h)}const u=ei;return o}function dr(o,u,h,p,R){if(Array.isArray(u))for(var k=0;k<u.length;k++)dr(o,u[k],h,p,R);else p=d(p)?!!p.capture:!!p,h=Jr(h),o&&o[kt]?(o=o.i,u=String(u).toString(),u in o.g&&(k=o.g[u],h=lr(k,h,p,R),-1<h&&(Dt(k[h]),Array.prototype.splice.call(k,h,1),k.length==0&&(delete o.g[u],o.h--)))):o&&(o=Ie(o))&&(u=o.g[u.toString()],o=-1,u&&(o=lr(u,h,p,R)),(h=-1<o?u[o]:null)&&hr(h))}function hr(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[kt])ar(u.i,o);else{var h=o.type,p=o.proxy;u.removeEventListener?u.removeEventListener(h,p,o.capture):u.detachEvent?u.detachEvent(on(h),p):u.addListener&&u.removeListener&&u.removeListener(p),(h=Ie(u))?(ar(h,o),h.h==0&&(h.src=null,u[Nn]=null)):Dt(o)}}}function on(o){return o in Ln?Ln[o]:Ln[o]="on"+o}function ei(o,u){if(o.da)o=!0;else{u=new J(u,this);var h=o.listener,p=o.ha||o.src;o.fa&&hr(o),o=h.call(p,u)}return o}function Ie(o){return o=o[Nn],o instanceof be?o:null}var Se="__closure_events_fn_"+(1e9*Math.random()>>>0);function Jr(o){return typeof o=="function"?o:(o[Se]||(o[Se]=function(u){return o.handleEvent(u)}),o[Se])}function Mt(){yt.call(this),this.i=new be(this),this.M=this,this.F=null}T(Mt,yt),Mt.prototype[kt]=!0,Mt.prototype.removeEventListener=function(o,u,h,p){dr(this,o,u,h,p)};function Nt(o,u){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=u.type||u,typeof u=="string")u=new $(u,o);else if(u instanceof $)u.target=u.target||o;else{var R=u;u=new $(p,o),w(u,R)}if(R=!0,h)for(var k=h.length-1;0<=k;k--){var O=u.g=h[k];R=an(O,p,!0,u)&&R}if(O=u.g=o,R=an(O,p,!0,u)&&R,R=an(O,p,!1,u)&&R,h)for(k=0;k<h.length;k++)O=u.g=h[k],R=an(O,p,!1,u)&&R}Mt.prototype.N=function(){if(Mt.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],p=0;p<h.length;p++)Dt(h[p]);delete o.g[u],o.h--}}this.F=null},Mt.prototype.K=function(o,u,h,p){return this.i.add(String(o),u,!1,h,p)},Mt.prototype.L=function(o,u,h,p){return this.i.add(String(o),u,!0,h,p)};function an(o,u,h,p){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var R=!0,k=0;k<u.length;++k){var O=u[k];if(O&&!O.da&&O.capture==h){var dt=O.listener,Ft=O.ha||O.src;O.fa&&ar(o.i,O),R=dt.call(Ft,p)!==!1&&R}}return R&&!p.defaultPrevented}function Xr(o,u,h){if(typeof o=="function")h&&(o=v(o,h));else if(o&&typeof o.handleEvent=="function")o=v(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(o,u||0)}function ni(o){o.g=Xr(()=>{o.g=null,o.i&&(o.i=!1,ni(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class fr extends yt{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:ni(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Be(o){yt.call(this),this.h=o,this.g={}}T(Be,yt);var pr=[];function ri(o){V(o.g,function(u,h){this.g.hasOwnProperty(h)&&hr(u)},o),o.g={}}Be.prototype.N=function(){Be.aa.N.call(this),ri(this)},Be.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Z=l.JSON.stringify,Lt=l.JSON.parse,Xt=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function Ae(){}Ae.prototype.h=null;function ln(o){return o.h||(o.h=o.i())}function xe(){}var he={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Rt(){$.call(this,"d")}T(Rt,$);function se(){$.call(this,"c")}T(se,$);var jt={},Fe=null;function ge(){return Fe=Fe||new Mt}jt.La="serverreachability";function ze(o){$.call(this,jt.La,o)}T(ze,$);function Zt(o){const u=ge();Nt(u,new ze(u))}jt.STAT_EVENT="statevent";function Bt(o,u){$.call(this,jt.STAT_EVENT,o),this.stat=u}T(Bt,$);function ut(o){const u=ge();Nt(u,new Bt(u,o))}jt.Ma="timingevent";function Ue(o,u){$.call(this,jt.Ma,o),this.size=u}T(Ue,$);function Re(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},u)}function Pt(){this.g=!0}Pt.prototype.xa=function(){this.g=!1};function cn(o,u,h,p,R,k){o.info(function(){if(o.g)if(k)for(var O="",dt=k.split("&"),Ft=0;Ft<dt.length;Ft++){var rt=dt[Ft].split("=");if(1<rt.length){var Ht=rt[0];rt=rt[1];var Wt=Ht.split("_");O=2<=Wt.length&&Wt[1]=="type"?O+(Ht+"="+rt+"&"):O+(Ht+"=redacted&")}}else O=null;else O=k;return"XMLHTTP REQ ("+p+") [attempt "+R+"]: "+u+`
`+h+`
`+O})}function mr(o,u,h,p,R,k,O){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+R+"]: "+u+`
`+h+`
`+k+" "+O})}function $e(o,u,h,p){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+Lo(o,h)+(p?" "+p:"")})}function No(o,u){o.info(function(){return"TIMEOUT: "+u})}Pt.prototype.info=function(){};function Lo(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var R=p[1];if(Array.isArray(R)&&!(1>R.length)){var k=R[0];if(k!="noop"&&k!="stop"&&k!="close")for(var O=1;O<R.length;O++)R[O]=""}}}}return Z(h)}catch{return u}}var si={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},ic={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Vo;function ii(){}T(ii,Ae),ii.prototype.g=function(){return new XMLHttpRequest},ii.prototype.i=function(){return{}},Vo=new ii;function un(o,u,h,p){this.j=o,this.i=u,this.l=h,this.R=p||1,this.U=new Be(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new oc}function oc(){this.i=null,this.g="",this.h=!1}var ac={},Oo={};function Bo(o,u,h){o.L=1,o.v=ci(qe(u)),o.m=h,o.P=!0,lc(o,null)}function lc(o,u){o.F=Date.now(),oi(o),o.A=qe(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),bc(h.i,"t",p),o.C=0,h=o.j.J,o.h=new oc,o.g=zc(o.j,h?u:null,!o.m),0<o.O&&(o.M=new fr(v(o.Y,o,o.g),o.O)),u=o.U,h=o.g,p=o.ca;var R="readystatechange";Array.isArray(R)||(R&&(pr[0]=R.toString()),R=pr);for(var k=0;k<R.length;k++){var O=Te(h,R[k],p||u.handleEvent,!1,u.h||u);if(!O)break;u.g[O.key]=O}u=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),Zt(),cn(o.i,o.u,o.A,o.l,o.R,o.m)}un.prototype.ca=function(o){o=o.target;const u=this.M;u&&je(o)==3?u.j():this.Y(o)},un.prototype.Y=function(o){try{if(o==this.g)t:{const Wt=je(this.g);var u=this.g.Ba();const vr=this.g.Z();if(!(3>Wt)&&(Wt!=3||this.g&&(this.h.h||this.g.oa()||Pc(this.g)))){this.J||Wt!=4||u==7||(u==8||0>=vr?Zt(3):Zt(2)),Fo(this);var h=this.g.Z();this.X=h;e:if(cc(this)){var p=Pc(this.g);o="";var R=p.length,k=je(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Vn(this),Zr(this);var O="";break e}this.h.i=new l.TextDecoder}for(u=0;u<R;u++)this.h.h=!0,o+=this.h.i.decode(p[u],{stream:!(k&&u==R-1)});p.length=0,this.h.g+=o,this.C=0,O=this.h.g}else O=this.g.oa();if(this.o=h==200,mr(this.i,this.u,this.A,this.l,this.R,Wt,h),this.o){if(this.T&&!this.K){e:{if(this.g){var dt,Ft=this.g;if((dt=Ft.g?Ft.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!D(dt)){var rt=dt;break e}}rt=null}if(h=rt)$e(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,zo(this,h);else{this.o=!1,this.s=3,ut(12),Vn(this),Zr(this);break t}}if(this.P){h=!0;let ye;for(;!this.J&&this.C<O.length;)if(ye=cp(this,O),ye==Oo){Wt==4&&(this.s=4,ut(14),h=!1),$e(this.i,this.l,null,"[Incomplete Response]");break}else if(ye==ac){this.s=4,ut(15),$e(this.i,this.l,O,"[Invalid Chunk]"),h=!1;break}else $e(this.i,this.l,ye,null),zo(this,ye);if(cc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Wt!=4||O.length!=0||this.h.h||(this.s=1,ut(16),h=!1),this.o=this.o&&h,!h)$e(this.i,this.l,O,"[Invalid Chunked Response]"),Vn(this),Zr(this);else if(0<O.length&&!this.W){this.W=!0;var Ht=this.j;Ht.g==this&&Ht.ba&&!Ht.M&&(Ht.j.info("Great, no buffering proxy detected. Bytes received: "+O.length),Wo(Ht),Ht.M=!0,ut(11))}}else $e(this.i,this.l,O,null),zo(this,O);Wt==4&&Vn(this),this.o&&!this.J&&(Wt==4?Vc(this.j,this):(this.o=!1,oi(this)))}else Ap(this.g),h==400&&0<O.indexOf("Unknown SID")?(this.s=3,ut(12)):(this.s=0,ut(13)),Vn(this),Zr(this)}}}catch{}finally{}};function cc(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function cp(o,u){var h=o.C,p=u.indexOf(`
`,h);return p==-1?Oo:(h=Number(u.substring(h,p)),isNaN(h)?ac:(p+=1,p+h>u.length?Oo:(u=u.slice(p,p+h),o.C=p+h,u)))}un.prototype.cancel=function(){this.J=!0,Vn(this)};function oi(o){o.S=Date.now()+o.I,uc(o,o.I)}function uc(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=Re(v(o.ba,o),u)}function Fo(o){o.B&&(l.clearTimeout(o.B),o.B=null)}un.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(No(this.i,this.A),this.L!=2&&(Zt(),ut(17)),Vn(this),this.s=2,Zr(this)):uc(this,this.S-o)};function Zr(o){o.j.G==0||o.J||Vc(o.j,o)}function Vn(o){Fo(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,ri(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function zo(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||Uo(h.h,o))){if(!o.K&&Uo(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(u)}catch{p=null}if(Array.isArray(p)&&p.length==3){var R=p;if(R[0]==0){t:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)mi(h),fi(h);else break t;Ho(h),ut(18)}}else h.za=R[1],0<h.za-h.T&&37500>R[2]&&h.F&&h.v==0&&!h.C&&(h.C=Re(v(h.Za,h),6e3));if(1>=fc(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Bn(h,11)}else if((o.K||h.g==o)&&mi(h),!D(u))for(R=h.Da.g.parse(u),u=0;u<R.length;u++){let rt=R[u];if(h.T=rt[0],rt=rt[1],h.G==2)if(rt[0]=="c"){h.K=rt[1],h.ia=rt[2];const Ht=rt[3];Ht!=null&&(h.la=Ht,h.j.info("VER="+h.la));const Wt=rt[4];Wt!=null&&(h.Aa=Wt,h.j.info("SVER="+h.Aa));const vr=rt[5];vr!=null&&typeof vr=="number"&&0<vr&&(p=1.5*vr,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const ye=o.g;if(ye){const yi=ye.g?ye.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(yi){var k=p.h;k.g||yi.indexOf("spdy")==-1&&yi.indexOf("quic")==-1&&yi.indexOf("h2")==-1||(k.j=k.l,k.g=new Set,k.h&&($o(k,k.h),k.h=null))}if(p.D){const Yo=ye.g?ye.g.getResponseHeader("X-HTTP-Session-Id"):null;Yo&&(p.ya=Yo,ft(p.I,p.D,Yo))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var O=o;if(p.qa=Fc(p,p.J?p.ia:null,p.W),O.K){pc(p.h,O);var dt=O,Ft=p.L;Ft&&(dt.I=Ft),dt.B&&(Fo(dt),oi(dt)),p.g=O}else Nc(p);0<h.i.length&&pi(h)}else rt[0]!="stop"&&rt[0]!="close"||Bn(h,7);else h.G==3&&(rt[0]=="stop"||rt[0]=="close"?rt[0]=="stop"?Bn(h,7):jo(h):rt[0]!="noop"&&h.l&&h.l.ta(rt),h.v=0)}}Zt(4)}catch{}}var up=class{constructor(o,u){this.g=o,this.map=u}};function dc(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function hc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function fc(o){return o.h?1:o.g?o.g.size:0}function Uo(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function $o(o,u){o.g?o.g.add(u):o.h=u}function pc(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}dc.prototype.cancel=function(){if(this.i=mc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function mc(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return x(o.i)}function dp(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var u=[],h=o.length,p=0;p<h;p++)u.push(o[p]);return u}u=[],h=0;for(p in o)u[h++]=o[p];return u}function hp(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const p in o)u[h++]=p;return u}}}function gc(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=hp(o),p=dp(o),R=p.length,k=0;k<R;k++)u.call(void 0,p[k],h&&h[k],o)}var yc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function fp(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),R=null;if(0<=p){var k=o[h].substring(0,p);R=o[h].substring(p+1)}else k=o[h];u(k,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function On(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof On){this.h=o.h,ai(this,o.j),this.o=o.o,this.g=o.g,li(this,o.s),this.l=o.l;var u=o.i,h=new ns;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),vc(this,h),this.m=o.m}else o&&(u=String(o).match(yc))?(this.h=!1,ai(this,u[1]||"",!0),this.o=ts(u[2]||""),this.g=ts(u[3]||"",!0),li(this,u[4]),this.l=ts(u[5]||"",!0),vc(this,u[6]||"",!0),this.m=ts(u[7]||"")):(this.h=!1,this.i=new ns(null,this.h))}On.prototype.toString=function(){var o=[],u=this.j;u&&o.push(es(u,_c,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(es(u,_c,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(es(h,h.charAt(0)=="/"?gp:mp,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",es(h,vp)),o.join("")};function qe(o){return new On(o)}function ai(o,u,h){o.j=h?ts(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function li(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function vc(o,u,h){u instanceof ns?(o.i=u,_p(o.i,o.h)):(h||(u=es(u,yp)),o.i=new ns(u,o.h))}function ft(o,u,h){o.i.set(u,h)}function ci(o){return ft(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function ts(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function es(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,pp),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function pp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var _c=/[#\/\?@]/g,mp=/[#\?:]/g,gp=/[#\?]/g,yp=/[#\?@]/g,vp=/#/g;function ns(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function dn(o){o.g||(o.g=new Map,o.h=0,o.i&&fp(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=ns.prototype,n.add=function(o,u){dn(this),this.i=null,o=gr(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function wc(o,u){dn(o),u=gr(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Ec(o,u){return dn(o),u=gr(o,u),o.g.has(u)}n.forEach=function(o,u){dn(this),this.g.forEach(function(h,p){h.forEach(function(R){o.call(u,R,p,this)},this)},this)},n.na=function(){dn(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let p=0;p<u.length;p++){const R=o[p];for(let k=0;k<R.length;k++)h.push(u[p])}return h},n.V=function(o){dn(this);let u=[];if(typeof o=="string")Ec(this,o)&&(u=u.concat(this.g.get(gr(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},n.set=function(o,u){return dn(this),this.i=null,o=gr(this,o),Ec(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function bc(o,u,h){wc(o,u),0<h.length&&(o.i=null,o.g.set(gr(o,u),x(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var p=u[h];const k=encodeURIComponent(String(p)),O=this.V(p);for(p=0;p<O.length;p++){var R=k;O[p]!==""&&(R+="="+encodeURIComponent(String(O[p]))),o.push(R)}}return this.i=o.join("&")};function gr(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function _p(o,u){u&&!o.j&&(dn(o),o.i=null,o.g.forEach(function(h,p){var R=p.toLowerCase();p!=R&&(wc(this,p),bc(this,R,h))},o)),o.j=u}function wp(o,u){const h=new Pt;if(l.Image){const p=new Image;p.onload=E(hn,h,"TestLoadImage: loaded",!0,u,p),p.onerror=E(hn,h,"TestLoadImage: error",!1,u,p),p.onabort=E(hn,h,"TestLoadImage: abort",!1,u,p),p.ontimeout=E(hn,h,"TestLoadImage: timeout",!1,u,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else u(!1)}function Ep(o,u){const h=new Pt,p=new AbortController,R=setTimeout(()=>{p.abort(),hn(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:p.signal}).then(k=>{clearTimeout(R),k.ok?hn(h,"TestPingServer: ok",!0,u):hn(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(R),hn(h,"TestPingServer: error",!1,u)})}function hn(o,u,h,p,R){try{R&&(R.onload=null,R.onerror=null,R.onabort=null,R.ontimeout=null),p(h)}catch{}}function bp(){this.g=new Xt}function Tp(o,u,h){const p=h||"";try{gc(o,function(R,k){let O=R;d(R)&&(O=Z(R)),u.push(p+k+"="+encodeURIComponent(O))})}catch(R){throw u.push(p+"type="+encodeURIComponent("_badmap")),R}}function ui(o){this.l=o.Ub||null,this.j=o.eb||!1}T(ui,Ae),ui.prototype.g=function(){return new di(this.l,this.j)},ui.prototype.i=function(o){return function(){return o}}({});function di(o,u){Mt.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}T(di,Mt),n=di.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,ss(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,rs(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,ss(this)),this.g&&(this.readyState=3,ss(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Tc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Tc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?rs(this):ss(this),this.readyState==3&&Tc(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,rs(this))},n.Qa=function(o){this.g&&(this.response=o,rs(this))},n.ga=function(){this.g&&rs(this)};function rs(o){o.readyState=4,o.l=null,o.j=null,o.v=null,ss(o)}n.setRequestHeader=function(o,u){this.u.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function ss(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(di.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Ic(o){let u="";return V(o,function(h,p){u+=p,u+=":",u+=h,u+=`\r
`}),u}function qo(o,u,h){t:{for(p in h){var p=!1;break t}p=!0}p||(h=Ic(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):ft(o,u,h))}function vt(o){Mt.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}T(vt,Mt);var Ip=/^https?$/i,Sp=["POST","PUT"];n=vt.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,u,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Vo.g(),this.v=this.o?ln(this.o):ln(Vo),this.g.onreadystatechange=v(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(k){Sc(this,k);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var R in p)h.set(R,p[R]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const k of p.keys())h.set(k,p.get(k));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(k=>k.toLowerCase()=="content-type"),R=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Sp,u,void 0))||p||R||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[k,O]of h)this.g.setRequestHeader(k,O);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Rc(this),this.u=!0,this.g.send(o),this.u=!1}catch(k){Sc(this,k)}};function Sc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,Ac(o),hi(o)}function Ac(o){o.A||(o.A=!0,Nt(o,"complete"),Nt(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Nt(this,"complete"),Nt(this,"abort"),hi(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),hi(this,!0)),vt.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?xc(this):this.bb())},n.bb=function(){xc(this)};function xc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||je(o)!=4||o.Z()!=2)){if(o.u&&je(o)==4)Xr(o.Ea,0,o);else if(Nt(o,"readystatechange"),je(o)==4){o.h=!1;try{const O=o.Z();t:switch(O){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break t;default:u=!1}var h;if(!(h=u)){var p;if(p=O===0){var R=String(o.D).match(yc)[1]||null;!R&&l.self&&l.self.location&&(R=l.self.location.protocol.slice(0,-1)),p=!Ip.test(R?R.toLowerCase():"")}h=p}if(h)Nt(o,"complete"),Nt(o,"success");else{o.m=6;try{var k=2<je(o)?o.g.statusText:""}catch{k=""}o.l=k+" ["+o.Z()+"]",Ac(o)}}finally{hi(o)}}}}function hi(o,u){if(o.g){Rc(o);const h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||Nt(o,"ready");try{h.onreadystatechange=p}catch{}}}function Rc(o){o.I&&(l.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function je(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<je(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),Lt(u)}};function Pc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Ap(o){const u={};o=(o.g&&2<=je(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(D(o[p]))continue;var h=S(o[p]);const R=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const k=u[R]||[];u[R]=k,k.push(h)}b(u,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function is(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function Cc(o){this.Aa=0,this.i=[],this.j=new Pt,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=is("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=is("baseRetryDelayMs",5e3,o),this.cb=is("retryDelaySeedMs",1e4,o),this.Wa=is("forwardChannelMaxRetries",2,o),this.wa=is("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new dc(o&&o.concurrentRequestLimit),this.Da=new bp,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Cc.prototype,n.la=8,n.G=1,n.connect=function(o,u,h,p){ut(0),this.W=o,this.H=u||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=Fc(this,null,this.W),pi(this)};function jo(o){if(kc(o),o.G==3){var u=o.U++,h=qe(o.I);if(ft(h,"SID",o.K),ft(h,"RID",u),ft(h,"TYPE","terminate"),os(o,h),u=new un(o,o.j,u),u.L=2,u.v=ci(qe(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=u.v,h=!0),h||(u.g=zc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),oi(u)}Bc(o)}function fi(o){o.g&&(Wo(o),o.g.cancel(),o.g=null)}function kc(o){fi(o),o.u&&(l.clearTimeout(o.u),o.u=null),mi(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function pi(o){if(!hc(o.h)&&!o.s){o.s=!0;var u=o.Ga;Et||xt(),at||(Et(),at=!0),ct.add(u,o),o.B=0}}function xp(o,u){return fc(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=Re(v(o.Ga,o,u),Oc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const R=new un(this,this.j,o);let k=this.o;if(this.S&&(k?(k=g(k),w(k,this.S)):k=this.S),this.m!==null||this.O||(R.H=k,k=null),this.P)t:{for(var u=0,h=0;h<this.i.length;h++){e:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break e}p=void 0}if(p===void 0)break;if(u+=p,4096<u){u=h;break t}if(u===4096||h===this.i.length-1){u=h+1;break t}}u=1e3}else u=1e3;u=Mc(this,R,u),h=qe(this.I),ft(h,"RID",o),ft(h,"CVER",22),this.D&&ft(h,"X-HTTP-Session-Id",this.D),os(this,h),k&&(this.O?u="headers="+encodeURIComponent(String(Ic(k)))+"&"+u:this.m&&qo(h,this.m,k)),$o(this.h,R),this.Ua&&ft(h,"TYPE","init"),this.P?(ft(h,"$req",u),ft(h,"SID","null"),R.T=!0,Bo(R,h,null)):Bo(R,h,u),this.G=2}}else this.G==3&&(o?Dc(this,o):this.i.length==0||hc(this.h)||Dc(this))};function Dc(o,u){var h;u?h=u.l:h=o.U++;const p=qe(o.I);ft(p,"SID",o.K),ft(p,"RID",h),ft(p,"AID",o.T),os(o,p),o.m&&o.o&&qo(p,o.m,o.o),h=new un(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Mc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),$o(o.h,h),Bo(h,p,u)}function os(o,u){o.H&&V(o.H,function(h,p){ft(u,p,h)}),o.l&&gc({},function(h,p){ft(u,p,h)})}function Mc(o,u,h){h=Math.min(o.i.length,h);var p=o.l?v(o.l.Na,o.l,o):null;t:{var R=o.i;let k=-1;for(;;){const O=["count="+h];k==-1?0<h?(k=R[0].g,O.push("ofs="+k)):k=0:O.push("ofs="+k);let dt=!0;for(let Ft=0;Ft<h;Ft++){let rt=R[Ft].g;const Ht=R[Ft].map;if(rt-=k,0>rt)k=Math.max(0,R[Ft].g-100),dt=!1;else try{Tp(Ht,O,"req"+rt+"_")}catch{p&&p(Ht)}}if(dt){p=O.join("&");break t}}}return o=o.i.splice(0,h),u.D=o,p}function Nc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;Et||xt(),at||(Et(),at=!0),ct.add(u,o),o.v=0}}function Ho(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=Re(v(o.Fa,o),Oc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Lc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=Re(v(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,ut(10),fi(this),Lc(this))};function Wo(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function Lc(o){o.g=new un(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=qe(o.qa);ft(u,"RID","rpc"),ft(u,"SID",o.K),ft(u,"AID",o.T),ft(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&ft(u,"TO",o.ja),ft(u,"TYPE","xmlhttp"),os(o,u),o.m&&o.o&&qo(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=ci(qe(u)),h.m=null,h.P=!0,lc(h,o)}n.Za=function(){this.C!=null&&(this.C=null,fi(this),Ho(this),ut(19))};function mi(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function Vc(o,u){var h=null;if(o.g==u){mi(o),Wo(o),o.g=null;var p=2}else if(Uo(o.h,u))h=u.D,pc(o.h,u),p=1;else return;if(o.G!=0){if(u.o)if(p==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var R=o.B;p=ge(),Nt(p,new Ue(p,h)),pi(o)}else Nc(o);else if(R=u.s,R==3||R==0&&0<u.X||!(p==1&&xp(o,u)||p==2&&Ho(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),R){case 1:Bn(o,5);break;case 4:Bn(o,10);break;case 3:Bn(o,6);break;default:Bn(o,2)}}}function Oc(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function Bn(o,u){if(o.j.info("Error code "+u),u==2){var h=v(o.fb,o),p=o.Xa;const R=!p;p=new On(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||ai(p,"https"),ci(p),R?wp(p.toString(),h):Ep(p.toString(),h)}else ut(2);o.G=0,o.l&&o.l.sa(u),Bc(o),kc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),ut(2)):(this.j.info("Failed to ping google.com"),ut(1))};function Bc(o){if(o.G=0,o.ka=[],o.l){const u=mc(o.h);(u.length!=0||o.i.length!=0)&&(I(o.ka,u),I(o.ka,o.i),o.h.i.length=0,x(o.i),o.i.length=0),o.l.ra()}}function Fc(o,u,h){var p=h instanceof On?qe(h):new On(h);if(p.g!="")u&&(p.g=u+"."+p.g),li(p,p.s);else{var R=l.location;p=R.protocol,u=u?u+"."+R.hostname:R.hostname,R=+R.port;var k=new On(null);p&&ai(k,p),u&&(k.g=u),R&&li(k,R),h&&(k.l=h),p=k}return h=o.D,u=o.ya,h&&u&&ft(p,h,u),ft(p,"VER",o.la),os(o,p),p}function zc(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new vt(new ui({eb:h})):new vt(o.pa),u.Ha(o.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Uc(){}n=Uc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function gi(){}gi.prototype.g=function(o,u){return new ie(o,u)};function ie(o,u){Mt.call(this),this.g=new Cc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!D(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!D(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new yr(this)}T(ie,Mt),ie.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ie.prototype.close=function(){jo(this.g)},ie.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=Z(o),o=h);u.i.push(new up(u.Ya++,o)),u.G==3&&pi(u)},ie.prototype.N=function(){this.g.l=null,delete this.j,jo(this.g),delete this.g,ie.aa.N.call(this)};function $c(o){Rt.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){t:{for(const h in u){o=h;break t}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}T($c,Rt);function qc(){se.call(this),this.status=1}T(qc,se);function yr(o){this.g=o}T(yr,Uc),yr.prototype.ua=function(){Nt(this.g,"a")},yr.prototype.ta=function(o){Nt(this.g,new $c(o))},yr.prototype.sa=function(o){Nt(this.g,new qc)},yr.prototype.ra=function(){Nt(this.g,"b")},gi.prototype.createWebChannel=gi.prototype.g,ie.prototype.send=ie.prototype.o,ie.prototype.open=ie.prototype.m,ie.prototype.close=ie.prototype.close,_h=function(){return new gi},vh=function(){return ge()},yh=jt,Ta={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},si.NO_ERROR=0,si.TIMEOUT=8,si.HTTP_ERROR=6,Ri=si,ic.COMPLETE="complete",gh=ic,xe.EventType=he,he.OPEN="a",he.CLOSE="b",he.ERROR="c",he.MESSAGE="d",Mt.prototype.listen=Mt.prototype.K,hs=xe,vt.prototype.listenOnce=vt.prototype.L,vt.prototype.getLastError=vt.prototype.Ka,vt.prototype.getLastErrorCode=vt.prototype.Ba,vt.prototype.getStatus=vt.prototype.Z,vt.prototype.getResponseJson=vt.prototype.Oa,vt.prototype.getResponseText=vt.prototype.oa,vt.prototype.send=vt.prototype.ea,vt.prototype.setWithCredentials=vt.prototype.Ha,mh=vt}).apply(typeof wi<"u"?wi:typeof self<"u"?self:typeof window<"u"?window:{});const bu="@firebase/firestore";/**
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
 */class Gt{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}Gt.UNAUTHENTICATED=new Gt(null),Gt.GOOGLE_CREDENTIALS=new Gt("google-credentials-uid"),Gt.FIRST_PARTY=new Gt("first-party-uid"),Gt.MOCK_USER=new Gt("mock-user");/**
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
 */let Hr="10.14.0";/**
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
 */const Jn=new Ha("@firebase/firestore");function ls(){return Jn.logLevel}function U(n,...t){if(Jn.logLevel<=et.DEBUG){const e=t.map(il);Jn.debug(`Firestore (${Hr}): ${n}`,...e)}}function Ze(n,...t){if(Jn.logLevel<=et.ERROR){const e=t.map(il);Jn.error(`Firestore (${Hr}): ${n}`,...e)}}function Vr(n,...t){if(Jn.logLevel<=et.WARN){const e=t.map(il);Jn.warn(`Firestore (${Hr}): ${n}`,...e)}}function il(n){if(typeof n=="string")return n;try{/**
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
 */function Y(n="Unexpected state"){const t=`FIRESTORE (${Hr}) INTERNAL ASSERTION FAILED: `+n;throw Ze(t),new Error(t)}function lt(n,t){n||Y()}function K(n,t){return n}/**
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
 */const M={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class z extends nn{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Qe{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
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
 */class wh{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class $v{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(Gt.UNAUTHENTICATED))}shutdown(){}}class qv{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class jv{constructor(t){this.t=t,this.currentUser=Gt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){lt(this.o===void 0);let r=this.i;const s=c=>this.i!==r?(r=this.i,e(c)):Promise.resolve();let i=new Qe;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Qe,t.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const c=i;t.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},l=c=>{U("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(U("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Qe)}},0),a()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(r=>this.i!==t?(U("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(lt(typeof r.accessToken=="string"),new wh(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return lt(t===null||typeof t=="string"),new Gt(t)}}class Hv{constructor(t,e,r){this.l=t,this.h=e,this.P=r,this.type="FirstParty",this.user=Gt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const t=this.T();return t&&this.I.set("Authorization",t),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Wv{constructor(t,e,r){this.l=t,this.h=e,this.P=r}getToken(){return Promise.resolve(new Hv(this.l,this.h,this.P))}start(t,e){t.enqueueRetryable(()=>e(Gt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Yv{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Gv{constructor(t){this.A=t,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(t,e){lt(this.o===void 0);const r=i=>{i.error!=null&&U("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.R;return this.R=i.token,U("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?e(i.token):Promise.resolve()};this.o=i=>{t.enqueueRetryable(()=>r(i))};const s=i=>{U("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):U("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(e=>e?(lt(typeof e.token=="string"),this.R=e.token,new Yv(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function Kv(n){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(n);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let r=0;r<n;r++)e[r]=Math.floor(256*Math.random());return e}/**
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
 */class Eh{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=Math.floor(256/t.length)*t.length;let r="";for(;r.length<20;){const s=Kv(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<e&&(r+=t.charAt(s[i]%t.length))}return r}}function st(n,t){return n<t?-1:n>t?1:0}function Or(n,t,e){return n.length===t.length&&n.every((r,s)=>e(r,t[s]))}/**
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
 */class Ct{constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new z(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new z(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<-62135596800)throw new z(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new z(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}static now(){return Ct.fromMillis(Date.now())}static fromDate(t){return Ct.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),r=Math.floor(1e6*(t-1e3*e));return new Ct(e,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(t){return this.seconds===t.seconds?st(this.nanoseconds,t.nanoseconds):st(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const t=this.seconds- -62135596800;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class G{constructor(t){this.timestamp=t}static fromTimestamp(t){return new G(t)}static min(){return new G(new Ct(0,0))}static max(){return new G(new Ct(253402300799,999999999))}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class xs{constructor(t,e,r){e===void 0?e=0:e>t.length&&Y(),r===void 0?r=t.length-e:r>t.length-e&&Y(),this.segments=t,this.offset=e,this.len=r}get length(){return this.len}isEqual(t){return xs.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof xs?t.forEach(r=>{e.push(r)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,r=this.limit();e<r;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const r=Math.min(t.length,e.length);for(let s=0;s<r;s++){const i=t.get(s),a=e.get(s);if(i<a)return-1;if(i>a)return 1}return t.length<e.length?-1:t.length>e.length?1:0}}class pt extends xs{construct(t,e,r){return new pt(t,e,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const r of t){if(r.indexOf("//")>=0)throw new z(M.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);e.push(...r.split("/").filter(s=>s.length>0))}return new pt(e)}static emptyPath(){return new pt([])}}const Qv=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ut extends xs{construct(t,e,r){return new Ut(t,e,r)}static isValidIdentifier(t){return Qv.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ut.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ut(["__name__"])}static fromServerFormat(t){const e=[];let r="",s=0;const i=()=>{if(r.length===0)throw new z(M.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(r),r=""};let a=!1;for(;s<t.length;){const l=t[s];if(l==="\\"){if(s+1===t.length)throw new z(M.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const c=t[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new z(M.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=c,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(r+=l,s++):(i(),s++)}if(i(),a)throw new z(M.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new Ut(e)}static emptyPath(){return new Ut([])}}/**
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
 */class q{constructor(t){this.path=t}static fromPath(t){return new q(pt.fromString(t))}static fromName(t){return new q(pt.fromString(t).popFirst(5))}static empty(){return new q(pt.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&pt.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return pt.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new q(new pt(t.slice()))}}function Jv(n,t){const e=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=G.fromTimestamp(r===1e9?new Ct(e+1,0):new Ct(e,r));return new xn(s,q.empty(),t)}function Xv(n){return new xn(n.readTime,n.key,-1)}class xn{constructor(t,e,r){this.readTime=t,this.documentKey=e,this.largestBatchId=r}static min(){return new xn(G.min(),q.empty(),-1)}static max(){return new xn(G.max(),q.empty(),-1)}}function Zv(n,t){let e=n.readTime.compareTo(t.readTime);return e!==0?e:(e=q.comparator(n.documentKey,t.documentKey),e!==0?e:st(n.largestBatchId,t.largestBatchId))}/**
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
 */const t0="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class e0{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
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
 */async function Us(n){if(n.code!==M.FAILED_PRECONDITION||n.message!==t0)throw n;U("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class L{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&Y(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new L((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(t,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(e,i).next(r,s)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof L?e:L.resolve(e)}catch(e){return L.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):L.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):L.reject(e)}static resolve(t){return new L((e,r)=>{e(t)})}static reject(t){return new L((e,r)=>{r(t)})}static waitFor(t){return new L((e,r)=>{let s=0,i=0,a=!1;t.forEach(l=>{++s,l.next(()=>{++i,a&&i===s&&e()},c=>r(c))}),a=!0,i===s&&e()})}static or(t){let e=L.resolve(!1);for(const r of t)e=e.next(s=>s?L.resolve(s):r());return e}static forEach(t,e){const r=[];return t.forEach((s,i)=>{r.push(e.call(this,s,i))}),this.waitFor(r)}static mapArray(t,e){return new L((r,s)=>{const i=t.length,a=new Array(i);let l=0;for(let c=0;c<i;c++){const d=c;e(t[d]).next(f=>{a[d]=f,++l,l===i&&r(a)},f=>s(f))}})}static doWhile(t,e){return new L((r,s)=>{const i=()=>{t()===!0?e().next(()=>{i()},s):r()};i()})}}function n0(n){const t=n.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function $s(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class ol{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=r=>this.ie(r),this.se=r=>e.writeSequenceNumber(r))}ie(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.se&&this.se(t),t}}ol.oe=-1;function oo(n){return n==null}function ji(n){return n===0&&1/n==-1/0}function r0(n){return typeof n=="number"&&Number.isInteger(n)&&!ji(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */function Tu(n){let t=0;for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t++;return t}function er(n,t){for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t(e,n[e])}function bh(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}/**
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
 */class gt{constructor(t,e){this.comparator=t,this.root=e||zt.EMPTY}insert(t,e){return new gt(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,zt.BLACK,null,null))}remove(t){return new gt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,zt.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const r=this.comparator(t,e.key);if(r===0)return e.value;r<0?e=e.left:r>0&&(e=e.right)}return null}indexOf(t){let e=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(t,r.key);if(s===0)return e+r.left.size;s<0?r=r.left:(e+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,r)=>(t(e,r),!1))}toString(){const t=[];return this.inorderTraversal((e,r)=>(t.push(`${e}:${r}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new Ei(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new Ei(this.root,t,this.comparator,!1)}getReverseIterator(){return new Ei(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new Ei(this.root,t,this.comparator,!0)}}class Ei{constructor(t,e,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!t.isEmpty();)if(i=e?r(t.key,e):1,e&&s&&(i*=-1),i<0)t=this.isReverse?t.left:t.right;else{if(i===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class zt{constructor(t,e,r,s,i){this.key=t,this.value=e,this.color=r??zt.RED,this.left=s??zt.EMPTY,this.right=i??zt.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,r,s,i){return new zt(t??this.key,e??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,r){let s=this;const i=r(t,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(t,e,r),null):i===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return zt.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let r,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return zt.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,zt.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,zt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Y();const t=this.left.check();if(t!==this.right.check())throw Y();return t+(this.isRed()?0:1)}}zt.EMPTY=null,zt.RED=!0,zt.BLACK=!1;zt.EMPTY=new class{constructor(){this.size=0}get key(){throw Y()}get value(){throw Y()}get color(){throw Y()}get left(){throw Y()}get right(){throw Y()}copy(t,e,r,s,i){return this}insert(t,e,r){return new zt(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class $t{constructor(t){this.comparator=t,this.data=new gt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,r)=>(t(e),!1))}forEachInRange(t,e){const r=this.data.getIteratorFrom(t[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let r;for(r=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();r.hasNext();)if(!t(r.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new Iu(this.data.getIterator())}getIteratorFrom(t){return new Iu(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(r=>{e=e.add(r)}),e}isEqual(t){if(!(t instanceof $t)||this.size!==t.size)return!1;const e=this.data.getIterator(),r=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new $t(this.comparator);return e.data=t,e}}class Iu{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class ae{constructor(t){this.fields=t,t.sort(Ut.comparator)}static empty(){return new ae([])}unionWith(t){let e=new $t(Ut.comparator);for(const r of this.fields)e=e.add(r);for(const r of t)e=e.add(r);return new ae(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return Or(this.fields,t.fields,(e,r)=>e.isEqual(r))}}/**
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
 */class Th extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class qt{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Th("Invalid base64 string: "+i):i}}(t);return new qt(e)}static fromUint8Array(t){const e=function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i}(t);return new qt(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const r=new Uint8Array(e.length);for(let s=0;s<e.length;s++)r[s]=e.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return st(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}qt.EMPTY_BYTE_STRING=new qt("");const s0=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Rn(n){if(lt(!!n),typeof n=="string"){let t=0;const e=s0.exec(n);if(lt(!!e),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:wt(n.seconds),nanos:wt(n.nanos)}}function wt(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Xn(n){return typeof n=="string"?qt.fromBase64String(n):qt.fromUint8Array(n)}/**
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
 */function al(n){var t,e;return((e=(((t=n==null?void 0:n.mapValue)===null||t===void 0?void 0:t.fields)||{}).__type__)===null||e===void 0?void 0:e.stringValue)==="server_timestamp"}function ll(n){const t=n.mapValue.fields.__previous_value__;return al(t)?ll(t):t}function Rs(n){const t=Rn(n.mapValue.fields.__local_write_time__.timestampValue);return new Ct(t.seconds,t.nanos)}/**
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
 */class i0{constructor(t,e,r,s,i,a,l,c,d){this.databaseId=t,this.appId=e,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class Ps{constructor(t,e){this.projectId=t,this.database=e||"(default)"}static empty(){return new Ps("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(t){return t instanceof Ps&&t.projectId===this.projectId&&t.database===this.database}}/**
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
 */const bi={mapValue:{}};function Zn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?al(n)?4:a0(n)?9007199254740991:o0(n)?10:11:Y()}function Ve(n,t){if(n===t)return!0;const e=Zn(n);if(e!==Zn(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===t.booleanValue;case 4:return Rs(n).isEqual(Rs(t));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const a=Rn(s.timestampValue),l=Rn(i.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(n,t);case 5:return n.stringValue===t.stringValue;case 6:return function(s,i){return Xn(s.bytesValue).isEqual(Xn(i.bytesValue))}(n,t);case 7:return n.referenceValue===t.referenceValue;case 8:return function(s,i){return wt(s.geoPointValue.latitude)===wt(i.geoPointValue.latitude)&&wt(s.geoPointValue.longitude)===wt(i.geoPointValue.longitude)}(n,t);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return wt(s.integerValue)===wt(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const a=wt(s.doubleValue),l=wt(i.doubleValue);return a===l?ji(a)===ji(l):isNaN(a)&&isNaN(l)}return!1}(n,t);case 9:return Or(n.arrayValue.values||[],t.arrayValue.values||[],Ve);case 10:case 11:return function(s,i){const a=s.mapValue.fields||{},l=i.mapValue.fields||{};if(Tu(a)!==Tu(l))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(l[c]===void 0||!Ve(a[c],l[c])))return!1;return!0}(n,t);default:return Y()}}function Cs(n,t){return(n.values||[]).find(e=>Ve(e,t))!==void 0}function Br(n,t){if(n===t)return 0;const e=Zn(n),r=Zn(t);if(e!==r)return st(e,r);switch(e){case 0:case 9007199254740991:return 0;case 1:return st(n.booleanValue,t.booleanValue);case 2:return function(i,a){const l=wt(i.integerValue||i.doubleValue),c=wt(a.integerValue||a.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,t);case 3:return Su(n.timestampValue,t.timestampValue);case 4:return Su(Rs(n),Rs(t));case 5:return st(n.stringValue,t.stringValue);case 6:return function(i,a){const l=Xn(i),c=Xn(a);return l.compareTo(c)}(n.bytesValue,t.bytesValue);case 7:return function(i,a){const l=i.split("/"),c=a.split("/");for(let d=0;d<l.length&&d<c.length;d++){const f=st(l[d],c[d]);if(f!==0)return f}return st(l.length,c.length)}(n.referenceValue,t.referenceValue);case 8:return function(i,a){const l=st(wt(i.latitude),wt(a.latitude));return l!==0?l:st(wt(i.longitude),wt(a.longitude))}(n.geoPointValue,t.geoPointValue);case 9:return Au(n.arrayValue,t.arrayValue);case 10:return function(i,a){var l,c,d,f;const m=i.fields||{},v=a.fields||{},E=(l=m.value)===null||l===void 0?void 0:l.arrayValue,T=(c=v.value)===null||c===void 0?void 0:c.arrayValue,x=st(((d=E==null?void 0:E.values)===null||d===void 0?void 0:d.length)||0,((f=T==null?void 0:T.values)===null||f===void 0?void 0:f.length)||0);return x!==0?x:Au(E,T)}(n.mapValue,t.mapValue);case 11:return function(i,a){if(i===bi.mapValue&&a===bi.mapValue)return 0;if(i===bi.mapValue)return 1;if(a===bi.mapValue)return-1;const l=i.fields||{},c=Object.keys(l),d=a.fields||{},f=Object.keys(d);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const v=st(c[m],f[m]);if(v!==0)return v;const E=Br(l[c[m]],d[f[m]]);if(E!==0)return E}return st(c.length,f.length)}(n.mapValue,t.mapValue);default:throw Y()}}function Su(n,t){if(typeof n=="string"&&typeof t=="string"&&n.length===t.length)return st(n,t);const e=Rn(n),r=Rn(t),s=st(e.seconds,r.seconds);return s!==0?s:st(e.nanos,r.nanos)}function Au(n,t){const e=n.values||[],r=t.values||[];for(let s=0;s<e.length&&s<r.length;++s){const i=Br(e[s],r[s]);if(i)return i}return st(e.length,r.length)}function Fr(n){return Ia(n)}function Ia(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(e){const r=Rn(e);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(e){return Xn(e).toBase64()}(n.bytesValue):"referenceValue"in n?function(e){return q.fromName(e).toString()}(n.referenceValue):"geoPointValue"in n?function(e){return`geo(${e.latitude},${e.longitude})`}(n.geoPointValue):"arrayValue"in n?function(e){let r="[",s=!0;for(const i of e.values||[])s?s=!1:r+=",",r+=Ia(i);return r+"]"}(n.arrayValue):"mapValue"in n?function(e){const r=Object.keys(e.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${Ia(e.fields[a])}`;return s+"}"}(n.mapValue):Y()}function xu(n,t){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${t.path.canonicalString()}`}}function Sa(n){return!!n&&"integerValue"in n}function cl(n){return!!n&&"arrayValue"in n}function Ru(n){return!!n&&"nullValue"in n}function Pu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Pi(n){return!!n&&"mapValue"in n}function o0(n){var t,e;return((e=(((t=n==null?void 0:n.mapValue)===null||t===void 0?void 0:t.fields)||{}).__type__)===null||e===void 0?void 0:e.stringValue)==="__vector__"}function ys(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const t={mapValue:{fields:{}}};return er(n.mapValue.fields,(e,r)=>t.mapValue.fields[e]=ys(r)),t}if(n.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(n.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=ys(n.arrayValue.values[e]);return t}return Object.assign({},n)}function a0(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class ee{constructor(t){this.value=t}static empty(){return new ee({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let r=0;r<t.length-1;++r)if(e=(e.mapValue.fields||{})[t.get(r)],!Pi(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=ys(e)}setAll(t){let e=Ut.emptyPath(),r={},s=[];t.forEach((a,l)=>{if(!e.isImmediateParentOf(l)){const c=this.getFieldsMap(e);this.applyChanges(c,r,s),r={},s=[],e=l.popLast()}a?r[l.lastSegment()]=ys(a):s.push(l.lastSegment())});const i=this.getFieldsMap(e);this.applyChanges(i,r,s)}delete(t){const e=this.field(t.popLast());Pi(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return Ve(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let r=0;r<t.length;++r){let s=e.mapValue.fields[t.get(r)];Pi(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(r)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,r){er(e,(s,i)=>t[s]=i);for(const s of r)delete t[s]}clone(){return new ee(ys(this.value))}}function Ih(n){const t=[];return er(n.fields,(e,r)=>{const s=new Ut([e]);if(Pi(r)){const i=Ih(r.mapValue).fields;if(i.length===0)t.push(s);else for(const a of i)t.push(s.child(a))}else t.push(s)}),new ae(t)}/**
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
 */class Kt{constructor(t,e,r,s,i,a,l){this.key=t,this.documentType=e,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=l}static newInvalidDocument(t){return new Kt(t,0,G.min(),G.min(),G.min(),ee.empty(),0)}static newFoundDocument(t,e,r,s){return new Kt(t,1,e,G.min(),r,s,0)}static newNoDocument(t,e){return new Kt(t,2,e,G.min(),G.min(),ee.empty(),0)}static newUnknownDocument(t,e){return new Kt(t,3,e,G.min(),G.min(),ee.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(G.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=ee.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=ee.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof Kt&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new Kt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Hi{constructor(t,e){this.position=t,this.inclusive=e}}function Cu(n,t,e){let r=0;for(let s=0;s<n.position.length;s++){const i=t[s],a=n.position[s];if(i.field.isKeyField()?r=q.comparator(q.fromName(a.referenceValue),e.key):r=Br(a,e.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function ku(n,t){if(n===null)return t===null;if(t===null||n.inclusive!==t.inclusive||n.position.length!==t.position.length)return!1;for(let e=0;e<n.position.length;e++)if(!Ve(n.position[e],t.position[e]))return!1;return!0}/**
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
 */class ks{constructor(t,e="asc"){this.field=t,this.dir=e}}function l0(n,t){return n.dir===t.dir&&n.field.isEqual(t.field)}/**
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
 */class Sh{}class Tt extends Sh{constructor(t,e,r){super(),this.field=t,this.op=e,this.value=r}static create(t,e,r){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,r):new u0(t,e,r):e==="array-contains"?new f0(t,r):e==="in"?new p0(t,r):e==="not-in"?new m0(t,r):e==="array-contains-any"?new g0(t,r):new Tt(t,e,r)}static createKeyFieldInFilter(t,e,r){return e==="in"?new d0(t,r):new h0(t,r)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&this.matchesComparison(Br(e,this.value)):e!==null&&Zn(this.value)===Zn(e)&&this.matchesComparison(Br(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return Y()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class we extends Sh{constructor(t,e){super(),this.filters=t,this.op=e,this.ae=null}static create(t,e){return new we(t,e)}matches(t){return Ah(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Ah(n){return n.op==="and"}function xh(n){return c0(n)&&Ah(n)}function c0(n){for(const t of n.filters)if(t instanceof we)return!1;return!0}function Aa(n){if(n instanceof Tt)return n.field.canonicalString()+n.op.toString()+Fr(n.value);if(xh(n))return n.filters.map(t=>Aa(t)).join(",");{const t=n.filters.map(e=>Aa(e)).join(",");return`${n.op}(${t})`}}function Rh(n,t){return n instanceof Tt?function(r,s){return s instanceof Tt&&r.op===s.op&&r.field.isEqual(s.field)&&Ve(r.value,s.value)}(n,t):n instanceof we?function(r,s){return s instanceof we&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((i,a,l)=>i&&Rh(a,s.filters[l]),!0):!1}(n,t):void Y()}function Ph(n){return n instanceof Tt?function(e){return`${e.field.canonicalString()} ${e.op} ${Fr(e.value)}`}(n):n instanceof we?function(e){return e.op.toString()+" {"+e.getFilters().map(Ph).join(" ,")+"}"}(n):"Filter"}class u0 extends Tt{constructor(t,e,r){super(t,e,r),this.key=q.fromName(r.referenceValue)}matches(t){const e=q.comparator(t.key,this.key);return this.matchesComparison(e)}}class d0 extends Tt{constructor(t,e){super(t,"in",e),this.keys=Ch("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class h0 extends Tt{constructor(t,e){super(t,"not-in",e),this.keys=Ch("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function Ch(n,t){var e;return(((e=t.arrayValue)===null||e===void 0?void 0:e.values)||[]).map(r=>q.fromName(r.referenceValue))}class f0 extends Tt{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return cl(e)&&Cs(e.arrayValue,this.value)}}class p0 extends Tt{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Cs(this.value.arrayValue,e)}}class m0 extends Tt{constructor(t,e){super(t,"not-in",e)}matches(t){if(Cs(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&!Cs(this.value.arrayValue,e)}}class g0 extends Tt{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!cl(e)||!e.arrayValue.values)&&e.arrayValue.values.some(r=>Cs(this.value.arrayValue,r))}}/**
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
 */class y0{constructor(t,e=null,r=[],s=[],i=null,a=null,l=null){this.path=t,this.collectionGroup=e,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=l,this.ue=null}}function Du(n,t=null,e=[],r=[],s=null,i=null,a=null){return new y0(n,t,e,r,s,i,a)}function ul(n){const t=K(n);if(t.ue===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(r=>Aa(r)).join(","),e+="|ob:",e+=t.orderBy.map(r=>function(i){return i.field.canonicalString()+i.dir}(r)).join(","),oo(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(r=>Fr(r)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(r=>Fr(r)).join(",")),t.ue=e}return t.ue}function dl(n,t){if(n.limit!==t.limit||n.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<n.orderBy.length;e++)if(!l0(n.orderBy[e],t.orderBy[e]))return!1;if(n.filters.length!==t.filters.length)return!1;for(let e=0;e<n.filters.length;e++)if(!Rh(n.filters[e],t.filters[e]))return!1;return n.collectionGroup===t.collectionGroup&&!!n.path.isEqual(t.path)&&!!ku(n.startAt,t.startAt)&&ku(n.endAt,t.endAt)}function xa(n){return q.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class Wr{constructor(t,e=null,r=[],s=[],i=null,a="F",l=null,c=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function v0(n,t,e,r,s,i,a,l){return new Wr(n,t,e,r,s,i,a,l)}function hl(n){return new Wr(n)}function Mu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function kh(n){return n.collectionGroup!==null}function vs(n){const t=K(n);if(t.ce===null){t.ce=[];const e=new Set;for(const i of t.explicitOrderBy)t.ce.push(i),e.add(i.field.canonicalString());const r=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new $t(Ut.comparator);return a.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(t).forEach(i=>{e.has(i.canonicalString())||i.isKeyField()||t.ce.push(new ks(i,r))}),e.has(Ut.keyField().canonicalString())||t.ce.push(new ks(Ut.keyField(),r))}return t.ce}function Me(n){const t=K(n);return t.le||(t.le=_0(t,vs(n))),t.le}function _0(n,t){if(n.limitType==="F")return Du(n.path,n.collectionGroup,t,n.filters,n.limit,n.startAt,n.endAt);{t=t.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new ks(s.field,i)});const e=n.endAt?new Hi(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Hi(n.startAt.position,n.startAt.inclusive):null;return Du(n.path,n.collectionGroup,t,n.filters,n.limit,e,r)}}function Ra(n,t){const e=n.filters.concat([t]);return new Wr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),e,n.limit,n.limitType,n.startAt,n.endAt)}function Wi(n,t,e){return new Wr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),t,e,n.startAt,n.endAt)}function ao(n,t){return dl(Me(n),Me(t))&&n.limitType===t.limitType}function Dh(n){return`${ul(Me(n))}|lt:${n.limitType}`}function Er(n){return`Query(target=${function(e){let r=e.path.canonicalString();return e.collectionGroup!==null&&(r+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(r+=`, filters: [${e.filters.map(s=>Ph(s)).join(", ")}]`),oo(e.limit)||(r+=", limit: "+e.limit),e.orderBy.length>0&&(r+=`, orderBy: [${e.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),e.startAt&&(r+=", startAt: ",r+=e.startAt.inclusive?"b:":"a:",r+=e.startAt.position.map(s=>Fr(s)).join(",")),e.endAt&&(r+=", endAt: ",r+=e.endAt.inclusive?"a:":"b:",r+=e.endAt.position.map(s=>Fr(s)).join(",")),`Target(${r})`}(Me(n))}; limitType=${n.limitType})`}function lo(n,t){return t.isFoundDocument()&&function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):q.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)}(n,t)&&function(r,s){for(const i of vs(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(n,t)&&function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0}(n,t)&&function(r,s){return!(r.startAt&&!function(a,l,c){const d=Cu(a,l,c);return a.inclusive?d<=0:d<0}(r.startAt,vs(r),s)||r.endAt&&!function(a,l,c){const d=Cu(a,l,c);return a.inclusive?d>=0:d>0}(r.endAt,vs(r),s))}(n,t)}function w0(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Mh(n){return(t,e)=>{let r=!1;for(const s of vs(n)){const i=E0(s,t,e);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function E0(n,t,e){const r=n.field.isKeyField()?q.comparator(t.key,e.key):function(i,a,l){const c=a.data.field(i),d=l.data.field(i);return c!==null&&d!==null?Br(c,d):Y()}(n.field,t,e);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return Y()}}/**
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
 */class Yr{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,t))return i}}has(t){return this.get(t)!==void 0}set(t,e){const r=this.mapKeyFn(t),s=this.inner[r];if(s===void 0)return this.inner[r]=[[t,e]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],t))return void(s[i]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],t))return r.length===1?delete this.inner[e]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(t){er(this.inner,(e,r)=>{for(const[s,i]of r)t(s,i)})}isEmpty(){return bh(this.inner)}size(){return this.innerSize}}/**
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
 */const b0=new gt(q.comparator);function tn(){return b0}const Nh=new gt(q.comparator);function fs(...n){let t=Nh;for(const e of n)t=t.insert(e.key,e);return t}function Lh(n){let t=Nh;return n.forEach((e,r)=>t=t.insert(e,r.overlayedDocument)),t}function qn(){return _s()}function Vh(){return _s()}function _s(){return new Yr(n=>n.toString(),(n,t)=>n.isEqual(t))}const T0=new gt(q.comparator),I0=new $t(q.comparator);function tt(...n){let t=I0;for(const e of n)t=t.add(e);return t}const S0=new $t(st);function A0(){return S0}/**
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
 */function fl(n,t){if(n.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ji(t)?"-0":t}}function Oh(n){return{integerValue:""+n}}function x0(n,t){return r0(t)?Oh(t):fl(n,t)}/**
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
 */class co{constructor(){this._=void 0}}function R0(n,t,e){return n instanceof Yi?function(s,i){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&al(i)&&(i=ll(i)),i&&(a.fields.__previous_value__=i),{mapValue:a}}(e,t):n instanceof Ds?Fh(n,t):n instanceof Ms?zh(n,t):function(s,i){const a=Bh(s,i),l=Nu(a)+Nu(s.Pe);return Sa(a)&&Sa(s.Pe)?Oh(l):fl(s.serializer,l)}(n,t)}function P0(n,t,e){return n instanceof Ds?Fh(n,t):n instanceof Ms?zh(n,t):e}function Bh(n,t){return n instanceof Gi?function(r){return Sa(r)||function(i){return!!i&&"doubleValue"in i}(r)}(t)?t:{integerValue:0}:null}class Yi extends co{}class Ds extends co{constructor(t){super(),this.elements=t}}function Fh(n,t){const e=Uh(t);for(const r of n.elements)e.some(s=>Ve(s,r))||e.push(r);return{arrayValue:{values:e}}}class Ms extends co{constructor(t){super(),this.elements=t}}function zh(n,t){let e=Uh(t);for(const r of n.elements)e=e.filter(s=>!Ve(s,r));return{arrayValue:{values:e}}}class Gi extends co{constructor(t,e){super(),this.serializer=t,this.Pe=e}}function Nu(n){return wt(n.integerValue||n.doubleValue)}function Uh(n){return cl(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function C0(n,t){return n.field.isEqual(t.field)&&function(r,s){return r instanceof Ds&&s instanceof Ds||r instanceof Ms&&s instanceof Ms?Or(r.elements,s.elements,Ve):r instanceof Gi&&s instanceof Gi?Ve(r.Pe,s.Pe):r instanceof Yi&&s instanceof Yi}(n.transform,t.transform)}class k0{constructor(t,e){this.version=t,this.transformResults=e}}class le{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new le}static exists(t){return new le(void 0,t)}static updateTime(t){return new le(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function Ci(n,t){return n.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(n.updateTime):n.exists===void 0||n.exists===t.isFoundDocument()}class uo{}function $h(n,t){if(!n.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return n.isNoDocument()?new pl(n.key,le.none()):new qs(n.key,n.data,le.none());{const e=n.data,r=ee.empty();let s=new $t(Ut.comparator);for(let i of t.fields)if(!s.has(i)){let a=e.field(i);a===null&&i.length>1&&(i=i.popLast(),a=e.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new kn(n.key,r,new ae(s.toArray()),le.none())}}function D0(n,t,e){n instanceof qs?function(s,i,a){const l=s.value.clone(),c=Vu(s.fieldTransforms,i,a.transformResults);l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,t,e):n instanceof kn?function(s,i,a){if(!Ci(s.precondition,i))return void i.convertToUnknownDocument(a.version);const l=Vu(s.fieldTransforms,i,a.transformResults),c=i.data;c.setAll(qh(s)),c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,t,e):function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()}(0,t,e)}function ws(n,t,e,r){return n instanceof qs?function(i,a,l,c){if(!Ci(i.precondition,a))return l;const d=i.value.clone(),f=Ou(i.fieldTransforms,c,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,t,e,r):n instanceof kn?function(i,a,l,c){if(!Ci(i.precondition,a))return l;const d=Ou(i.fieldTransforms,c,a),f=a.data;return f.setAll(qh(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(n,t,e,r):function(i,a,l){return Ci(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(n,t,e)}function M0(n,t){let e=null;for(const r of n.fieldTransforms){const s=t.data.field(r.field),i=Bh(r.transform,s||null);i!=null&&(e===null&&(e=ee.empty()),e.set(r.field,i))}return e||null}function Lu(n,t){return n.type===t.type&&!!n.key.isEqual(t.key)&&!!n.precondition.isEqual(t.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Or(r,s,(i,a)=>C0(i,a))}(n.fieldTransforms,t.fieldTransforms)&&(n.type===0?n.value.isEqual(t.value):n.type!==1||n.data.isEqual(t.data)&&n.fieldMask.isEqual(t.fieldMask))}class qs extends uo{constructor(t,e,r,s=[]){super(),this.key=t,this.value=e,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class kn extends uo{constructor(t,e,r,s,i=[]){super(),this.key=t,this.data=e,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function qh(n){const t=new Map;return n.fieldMask.fields.forEach(e=>{if(!e.isEmpty()){const r=n.data.field(e);t.set(e,r)}}),t}function Vu(n,t,e){const r=new Map;lt(n.length===e.length);for(let s=0;s<e.length;s++){const i=n[s],a=i.transform,l=t.data.field(i.field);r.set(i.field,P0(a,l,e[s]))}return r}function Ou(n,t,e){const r=new Map;for(const s of n){const i=s.transform,a=e.data.field(s.field);r.set(s.field,R0(i,a,t))}return r}class pl extends uo{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class N0 extends uo{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class L0{constructor(t,e,r,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(t,e){const r=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(t.key)&&D0(i,t,r[s])}}applyToLocalView(t,e){for(const r of this.baseMutations)r.key.isEqual(t.key)&&(e=ws(r,t,e,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(t.key)&&(e=ws(r,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const r=Vh();return this.mutations.forEach(s=>{const i=t.get(s.key),a=i.overlayedDocument;let l=this.applyToLocalView(a,i.mutatedFields);l=e.has(s.key)?null:l;const c=$h(a,l);c!==null&&r.set(s.key,c),a.isValidDocument()||a.convertToNoDocument(G.min())}),r}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),tt())}isEqual(t){return this.batchId===t.batchId&&Or(this.mutations,t.mutations,(e,r)=>Lu(e,r))&&Or(this.baseMutations,t.baseMutations,(e,r)=>Lu(e,r))}}class ml{constructor(t,e,r,s){this.batch=t,this.commitVersion=e,this.mutationResults=r,this.docVersions=s}static from(t,e,r){lt(t.mutations.length===r.length);let s=function(){return T0}();const i=t.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new ml(t,e,r,s)}}/**
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
 */class V0{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
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
 */class O0{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
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
 */var bt,nt;function B0(n){switch(n){default:return Y();case M.CANCELLED:case M.UNKNOWN:case M.DEADLINE_EXCEEDED:case M.RESOURCE_EXHAUSTED:case M.INTERNAL:case M.UNAVAILABLE:case M.UNAUTHENTICATED:return!1;case M.INVALID_ARGUMENT:case M.NOT_FOUND:case M.ALREADY_EXISTS:case M.PERMISSION_DENIED:case M.FAILED_PRECONDITION:case M.ABORTED:case M.OUT_OF_RANGE:case M.UNIMPLEMENTED:case M.DATA_LOSS:return!0}}function jh(n){if(n===void 0)return Ze("GRPC error has no .code"),M.UNKNOWN;switch(n){case bt.OK:return M.OK;case bt.CANCELLED:return M.CANCELLED;case bt.UNKNOWN:return M.UNKNOWN;case bt.DEADLINE_EXCEEDED:return M.DEADLINE_EXCEEDED;case bt.RESOURCE_EXHAUSTED:return M.RESOURCE_EXHAUSTED;case bt.INTERNAL:return M.INTERNAL;case bt.UNAVAILABLE:return M.UNAVAILABLE;case bt.UNAUTHENTICATED:return M.UNAUTHENTICATED;case bt.INVALID_ARGUMENT:return M.INVALID_ARGUMENT;case bt.NOT_FOUND:return M.NOT_FOUND;case bt.ALREADY_EXISTS:return M.ALREADY_EXISTS;case bt.PERMISSION_DENIED:return M.PERMISSION_DENIED;case bt.FAILED_PRECONDITION:return M.FAILED_PRECONDITION;case bt.ABORTED:return M.ABORTED;case bt.OUT_OF_RANGE:return M.OUT_OF_RANGE;case bt.UNIMPLEMENTED:return M.UNIMPLEMENTED;case bt.DATA_LOSS:return M.DATA_LOSS;default:return Y()}}(nt=bt||(bt={}))[nt.OK=0]="OK",nt[nt.CANCELLED=1]="CANCELLED",nt[nt.UNKNOWN=2]="UNKNOWN",nt[nt.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",nt[nt.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",nt[nt.NOT_FOUND=5]="NOT_FOUND",nt[nt.ALREADY_EXISTS=6]="ALREADY_EXISTS",nt[nt.PERMISSION_DENIED=7]="PERMISSION_DENIED",nt[nt.UNAUTHENTICATED=16]="UNAUTHENTICATED",nt[nt.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",nt[nt.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",nt[nt.ABORTED=10]="ABORTED",nt[nt.OUT_OF_RANGE=11]="OUT_OF_RANGE",nt[nt.UNIMPLEMENTED=12]="UNIMPLEMENTED",nt[nt.INTERNAL=13]="INTERNAL",nt[nt.UNAVAILABLE=14]="UNAVAILABLE",nt[nt.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function F0(){return new TextEncoder}/**
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
 */const z0=new jn([4294967295,4294967295],0);function Bu(n){const t=F0().encode(n),e=new ph;return e.update(t),new Uint8Array(e.digest())}function Fu(n){const t=new DataView(n.buffer),e=t.getUint32(0,!0),r=t.getUint32(4,!0),s=t.getUint32(8,!0),i=t.getUint32(12,!0);return[new jn([e,r],0),new jn([s,i],0)]}class gl{constructor(t,e,r){if(this.bitmap=t,this.padding=e,this.hashCount=r,e<0||e>=8)throw new ps(`Invalid padding: ${e}`);if(r<0)throw new ps(`Invalid hash count: ${r}`);if(t.length>0&&this.hashCount===0)throw new ps(`Invalid hash count: ${r}`);if(t.length===0&&e!==0)throw new ps(`Invalid padding when bitmap length is 0: ${e}`);this.Ie=8*t.length-e,this.Te=jn.fromNumber(this.Ie)}Ee(t,e,r){let s=t.add(e.multiply(jn.fromNumber(r)));return s.compare(z0)===1&&(s=new jn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(t){return(this.bitmap[Math.floor(t/8)]&1<<t%8)!=0}mightContain(t){if(this.Ie===0)return!1;const e=Bu(t),[r,s]=Fu(e);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);if(!this.de(a))return!1}return!0}static create(t,e,r){const s=t%8==0?0:8-t%8,i=new Uint8Array(Math.ceil(t/8)),a=new gl(i,s,e);return r.forEach(l=>a.insert(l)),a}insert(t){if(this.Ie===0)return;const e=Bu(t),[r,s]=Fu(e);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);this.Ae(a)}}Ae(t){const e=Math.floor(t/8),r=t%8;this.bitmap[e]|=1<<r}}class ps extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class ho{constructor(t,e,r,s,i){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(t,e,r){const s=new Map;return s.set(t,js.createSynthesizedTargetChangeForCurrentChange(t,e,r)),new ho(G.min(),s,new gt(st),tn(),tt())}}class js{constructor(t,e,r,s,i){this.resumeToken=t,this.current=e,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(t,e,r){return new js(r,e,tt(),tt(),tt())}}/**
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
 */class ki{constructor(t,e,r,s){this.Re=t,this.removedTargetIds=e,this.key=r,this.Ve=s}}class Hh{constructor(t,e){this.targetId=t,this.me=e}}class Wh{constructor(t,e,r=qt.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=r,this.cause=s}}class zu{constructor(){this.fe=0,this.ge=$u(),this.pe=qt.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(t){t.approximateByteSize()>0&&(this.we=!0,this.pe=t)}ve(){let t=tt(),e=tt(),r=tt();return this.ge.forEach((s,i)=>{switch(i){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:r=r.add(s);break;default:Y()}}),new js(this.pe,this.ye,t,e,r)}Ce(){this.we=!1,this.ge=$u()}Fe(t,e){this.we=!0,this.ge=this.ge.insert(t,e)}Me(t){this.we=!0,this.ge=this.ge.remove(t)}xe(){this.fe+=1}Oe(){this.fe-=1,lt(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class U0{constructor(t){this.Le=t,this.Be=new Map,this.ke=tn(),this.qe=Uu(),this.Qe=new gt(st)}Ke(t){for(const e of t.Re)t.Ve&&t.Ve.isFoundDocument()?this.$e(e,t.Ve):this.Ue(e,t.key,t.Ve);for(const e of t.removedTargetIds)this.Ue(e,t.key,t.Ve)}We(t){this.forEachTarget(t,e=>{const r=this.Ge(e);switch(t.state){case 0:this.ze(e)&&r.De(t.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(t.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(e);break;case 3:this.ze(e)&&(r.Ne(),r.De(t.resumeToken));break;case 4:this.ze(e)&&(this.je(e),r.De(t.resumeToken));break;default:Y()}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.Be.forEach((r,s)=>{this.ze(s)&&e(s)})}He(t){const e=t.targetId,r=t.me.count,s=this.Je(e);if(s){const i=s.target;if(xa(i))if(r===0){const a=new q(i.path);this.Ue(e,a,Kt.newNoDocument(a,G.min()))}else lt(r===1);else{const a=this.Ye(e);if(a!==r){const l=this.Ze(t),c=l?this.Xe(l,t,a):1;if(c!==0){this.je(e);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(e,d)}}}}}Ze(t){const e=t.me.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=e;let a,l;try{a=Xn(r).toUint8Array()}catch(c){if(c instanceof Th)return Vr("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new gl(a,s,i)}catch(c){return Vr(c instanceof ps?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(t,e,r){return e.me.count===r-this.nt(t,e.targetId)?0:2}nt(t,e){const r=this.Le.getRemoteKeysForTarget(e);let s=0;return r.forEach(i=>{const a=this.Le.tt(),l=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;t.mightContain(l)||(this.Ue(e,i,null),s++)}),s}rt(t){const e=new Map;this.Be.forEach((i,a)=>{const l=this.Je(a);if(l){if(i.current&&xa(l.target)){const c=new q(l.target.path);this.ke.get(c)!==null||this.it(a,c)||this.Ue(a,c,Kt.newNoDocument(c,t))}i.be&&(e.set(a,i.ve()),i.Ce())}});let r=tt();this.qe.forEach((i,a)=>{let l=!0;a.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(i))}),this.ke.forEach((i,a)=>a.setReadTime(t));const s=new ho(t,e,this.Qe,this.ke,r);return this.ke=tn(),this.qe=Uu(),this.Qe=new gt(st),s}$e(t,e){if(!this.ze(t))return;const r=this.it(t,e.key)?2:0;this.Ge(t).Fe(e.key,r),this.ke=this.ke.insert(e.key,e),this.qe=this.qe.insert(e.key,this.st(e.key).add(t))}Ue(t,e,r){if(!this.ze(t))return;const s=this.Ge(t);this.it(t,e)?s.Fe(e,1):s.Me(e),this.qe=this.qe.insert(e,this.st(e).delete(t)),r&&(this.ke=this.ke.insert(e,r))}removeTarget(t){this.Be.delete(t)}Ye(t){const e=this.Ge(t).ve();return this.Le.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}xe(t){this.Ge(t).xe()}Ge(t){let e=this.Be.get(t);return e||(e=new zu,this.Be.set(t,e)),e}st(t){let e=this.qe.get(t);return e||(e=new $t(st),this.qe=this.qe.insert(t,e)),e}ze(t){const e=this.Je(t)!==null;return e||U("WatchChangeAggregator","Detected inactive target",t),e}Je(t){const e=this.Be.get(t);return e&&e.Se?null:this.Le.ot(t)}je(t){this.Be.set(t,new zu),this.Le.getRemoteKeysForTarget(t).forEach(e=>{this.Ue(t,e,null)})}it(t,e){return this.Le.getRemoteKeysForTarget(t).has(e)}}function Uu(){return new gt(q.comparator)}function $u(){return new gt(q.comparator)}const $0={asc:"ASCENDING",desc:"DESCENDING"},q0={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},j0={and:"AND",or:"OR"};class H0{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function Pa(n,t){return n.useProto3Json||oo(t)?t:{value:t}}function Ki(n,t){return n.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Yh(n,t){return n.useProto3Json?t.toBase64():t.toUint8Array()}function W0(n,t){return Ki(n,t.toTimestamp())}function Ne(n){return lt(!!n),G.fromTimestamp(function(e){const r=Rn(e);return new Ct(r.seconds,r.nanos)}(n))}function yl(n,t){return Ca(n,t).canonicalString()}function Ca(n,t){const e=function(s){return new pt(["projects",s.projectId,"databases",s.database])}(n).child("documents");return t===void 0?e:e.child(t)}function Gh(n){const t=pt.fromString(n);return lt(Zh(t)),t}function ka(n,t){return yl(n.databaseId,t.path)}function na(n,t){const e=Gh(t);if(e.get(1)!==n.databaseId.projectId)throw new z(M.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+n.databaseId.projectId);if(e.get(3)!==n.databaseId.database)throw new z(M.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+n.databaseId.database);return new q(Qh(e))}function Kh(n,t){return yl(n.databaseId,t)}function Y0(n){const t=Gh(n);return t.length===4?pt.emptyPath():Qh(t)}function Da(n){return new pt(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Qh(n){return lt(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function qu(n,t,e){return{name:ka(n,t),fields:e.value.mapValue.fields}}function G0(n,t){let e;if("targetChange"in t){t.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:Y()}(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],i=function(d,f){return d.useProto3Json?(lt(f===void 0||typeof f=="string"),qt.fromBase64String(f||"")):(lt(f===void 0||f instanceof Buffer||f instanceof Uint8Array),qt.fromUint8Array(f||new Uint8Array))}(n,t.targetChange.resumeToken),a=t.targetChange.cause,l=a&&function(d){const f=d.code===void 0?M.UNKNOWN:jh(d.code);return new z(f,d.message||"")}(a);e=new Wh(r,s,i,l||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const s=na(n,r.document.name),i=Ne(r.document.updateTime),a=r.document.createTime?Ne(r.document.createTime):G.min(),l=new ee({mapValue:{fields:r.document.fields}}),c=Kt.newFoundDocument(s,i,a,l),d=r.targetIds||[],f=r.removedTargetIds||[];e=new ki(d,f,c.key,c)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const s=na(n,r.document),i=r.readTime?Ne(r.readTime):G.min(),a=Kt.newNoDocument(s,i),l=r.removedTargetIds||[];e=new ki([],l,a.key,a)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const s=na(n,r.document),i=r.removedTargetIds||[];e=new ki([],i,s,null)}else{if(!("filter"in t))return Y();{t.filter;const r=t.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new O0(s,i),l=r.targetId;e=new Hh(l,a)}}return e}function K0(n,t){let e;if(t instanceof qs)e={update:qu(n,t.key,t.value)};else if(t instanceof pl)e={delete:ka(n,t.key)};else if(t instanceof kn)e={update:qu(n,t.key,t.data),updateMask:s_(t.fieldMask)};else{if(!(t instanceof N0))return Y();e={verify:ka(n,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(r=>function(i,a){const l=a.transform;if(l instanceof Yi)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Ds)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Ms)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Gi)return{fieldPath:a.field.canonicalString(),increment:l.Pe};throw Y()}(0,r))),t.precondition.isNone||(e.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:W0(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Y()}(n,t.precondition)),e}function Q0(n,t){return n&&n.length>0?(lt(t!==void 0),n.map(e=>function(s,i){let a=s.updateTime?Ne(s.updateTime):Ne(i);return a.isEqual(G.min())&&(a=Ne(i)),new k0(a,s.transformResults||[])}(e,t))):[]}function J0(n,t){return{documents:[Kh(n,t.path)]}}function X0(n,t){const e={structuredQuery:{}},r=t.path;let s;t.collectionGroup!==null?(s=r,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=r.popLast(),e.structuredQuery.from=[{collectionId:r.lastSegment()}]),e.parent=Kh(n,s);const i=function(d){if(d.length!==0)return Xh(we.create(d,"and"))}(t.filters);i&&(e.structuredQuery.where=i);const a=function(d){if(d.length!==0)return d.map(f=>function(v){return{field:br(v.field),direction:e_(v.dir)}}(f))}(t.orderBy);a&&(e.structuredQuery.orderBy=a);const l=Pa(n,t.limit);return l!==null&&(e.structuredQuery.limit=l),t.startAt&&(e.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(t.endAt)),{_t:e,parent:s}}function Z0(n){let t=Y0(n.parent);const e=n.structuredQuery,r=e.from?e.from.length:0;let s=null;if(r>0){lt(r===1);const f=e.from[0];f.allDescendants?s=f.collectionId:t=t.child(f.collectionId)}let i=[];e.where&&(i=function(m){const v=Jh(m);return v instanceof we&&xh(v)?v.getFilters():[v]}(e.where));let a=[];e.orderBy&&(a=function(m){return m.map(v=>function(T){return new ks(Tr(T.field),function(I){switch(I){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(T.direction))}(v))}(e.orderBy));let l=null;e.limit&&(l=function(m){let v;return v=typeof m=="object"?m.value:m,oo(v)?null:v}(e.limit));let c=null;e.startAt&&(c=function(m){const v=!!m.before,E=m.values||[];return new Hi(E,v)}(e.startAt));let d=null;return e.endAt&&(d=function(m){const v=!m.before,E=m.values||[];return new Hi(E,v)}(e.endAt)),v0(t,s,a,i,l,"F",c,d)}function t_(n,t){const e=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Y()}}(t.purpose);return e==null?null:{"goog-listen-tags":e}}function Jh(n){return n.unaryFilter!==void 0?function(e){switch(e.unaryFilter.op){case"IS_NAN":const r=Tr(e.unaryFilter.field);return Tt.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Tr(e.unaryFilter.field);return Tt.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Tr(e.unaryFilter.field);return Tt.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Tr(e.unaryFilter.field);return Tt.create(a,"!=",{nullValue:"NULL_VALUE"});default:return Y()}}(n):n.fieldFilter!==void 0?function(e){return Tt.create(Tr(e.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Y()}}(e.fieldFilter.op),e.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(e){return we.create(e.compositeFilter.filters.map(r=>Jh(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return Y()}}(e.compositeFilter.op))}(n):Y()}function e_(n){return $0[n]}function n_(n){return q0[n]}function r_(n){return j0[n]}function br(n){return{fieldPath:n.canonicalString()}}function Tr(n){return Ut.fromServerFormat(n.fieldPath)}function Xh(n){return n instanceof Tt?function(e){if(e.op==="=="){if(Pu(e.value))return{unaryFilter:{field:br(e.field),op:"IS_NAN"}};if(Ru(e.value))return{unaryFilter:{field:br(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(Pu(e.value))return{unaryFilter:{field:br(e.field),op:"IS_NOT_NAN"}};if(Ru(e.value))return{unaryFilter:{field:br(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:br(e.field),op:n_(e.op),value:e.value}}}(n):n instanceof we?function(e){const r=e.getFilters().map(s=>Xh(s));return r.length===1?r[0]:{compositeFilter:{op:r_(e.op),filters:r}}}(n):Y()}function s_(n){const t=[];return n.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function Zh(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class _n{constructor(t,e,r,s,i=G.min(),a=G.min(),l=qt.EMPTY_BYTE_STRING,c=null){this.target=t,this.targetId=e,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(t){return new _n(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new _n(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new _n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new _n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
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
 */class i_{constructor(t){this.ct=t}}function o_(n){const t=Z0({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Wi(t,t.limit,"L"):t}/**
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
 */class a_{constructor(){this.un=new l_}addToCollectionParentIndex(t,e){return this.un.add(e),L.resolve()}getCollectionParents(t,e){return L.resolve(this.un.getEntries(e))}addFieldIndex(t,e){return L.resolve()}deleteFieldIndex(t,e){return L.resolve()}deleteAllFieldIndexes(t){return L.resolve()}createTargetIndexes(t,e){return L.resolve()}getDocumentsMatchingTarget(t,e){return L.resolve(null)}getIndexType(t,e){return L.resolve(0)}getFieldIndexes(t,e){return L.resolve([])}getNextCollectionGroupToUpdate(t){return L.resolve(null)}getMinOffset(t,e){return L.resolve(xn.min())}getMinOffsetFromCollectionGroup(t,e){return L.resolve(xn.min())}updateCollectionGroup(t,e,r){return L.resolve()}updateIndexEntries(t,e){return L.resolve()}}class l_{constructor(){this.index={}}add(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e]||new $t(pt.comparator),i=!s.has(r);return this.index[e]=s.add(r),i}has(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e];return s&&s.has(r)}getEntries(t){return(this.index[t]||new $t(pt.comparator)).toArray()}}/**
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
 */class zr{constructor(t){this.Ln=t}next(){return this.Ln+=2,this.Ln}static Bn(){return new zr(0)}static kn(){return new zr(-1)}}/**
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
 */class c_{constructor(){this.changes=new Yr(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,Kt.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const r=this.changes.get(e);return r!==void 0?L.resolve(r):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
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
 */class u_{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
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
 */class d_{constructor(t,e,r,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=r,this.indexManager=s}getDocument(t,e){let r=null;return this.documentOverlayCache.getOverlay(t,e).next(s=>(r=s,this.remoteDocumentCache.getEntry(t,e))).next(s=>(r!==null&&ws(r.mutation,s,ae.empty(),Ct.now()),s))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.getLocalViewOfDocuments(t,r,tt()).next(()=>r))}getLocalViewOfDocuments(t,e,r=tt()){const s=qn();return this.populateOverlays(t,s,e).next(()=>this.computeViews(t,e,s,r).next(i=>{let a=fs();return i.forEach((l,c)=>{a=a.insert(l,c.overlayedDocument)}),a}))}getOverlayedDocuments(t,e){const r=qn();return this.populateOverlays(t,r,e).next(()=>this.computeViews(t,e,r,tt()))}populateOverlays(t,e,r){const s=[];return r.forEach(i=>{e.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(t,s).next(i=>{i.forEach((a,l)=>{e.set(a,l)})})}computeViews(t,e,r,s){let i=tn();const a=_s(),l=function(){return _s()}();return e.forEach((c,d)=>{const f=r.get(d.key);s.has(d.key)&&(f===void 0||f.mutation instanceof kn)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),ws(f.mutation,d,f.mutation.getFieldMask(),Ct.now())):a.set(d.key,ae.empty())}),this.recalculateAndSaveOverlays(t,i).next(c=>(c.forEach((d,f)=>a.set(d,f)),e.forEach((d,f)=>{var m;return l.set(d,new u_(f,(m=a.get(d))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(t,e){const r=_s();let s=new gt((a,l)=>a-l),i=tt();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(a=>{for(const l of a)l.keys().forEach(c=>{const d=e.get(c);if(d===null)return;let f=r.get(c)||ae.empty();f=l.applyToLocalView(d,f),r.set(c,f);const m=(s.get(l.batchId)||tt()).add(c);s=s.insert(l.batchId,m)})}).next(()=>{const a=[],l=s.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,f=c.value,m=Vh();f.forEach(v=>{if(!i.has(v)){const E=$h(e.get(v),r.get(v));E!==null&&m.set(v,E),i=i.add(v)}}),a.push(this.documentOverlayCache.saveOverlays(t,d,m))}return L.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.recalculateAndSaveOverlays(t,r))}getDocumentsMatchingQuery(t,e,r,s){return function(a){return q.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):kh(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,r,s):this.getDocumentsMatchingCollectionQuery(t,e,r,s)}getNextDocuments(t,e,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,r,s).next(i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,r.largestBatchId,s-i.size):L.resolve(qn());let l=-1,c=i;return a.next(d=>L.forEach(d,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(f)?L.resolve():this.remoteDocumentCache.getEntry(t,f).next(v=>{c=c.insert(f,v)}))).next(()=>this.populateOverlays(t,d,i)).next(()=>this.computeViews(t,c,d,tt())).next(f=>({batchId:l,changes:Lh(f)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new q(e)).next(r=>{let s=fs();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(t,e,r,s){const i=e.collectionGroup;let a=fs();return this.indexManager.getCollectionParents(t,i).next(l=>L.forEach(l,c=>{const d=function(m,v){return new Wr(v,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(e,c.child(i));return this.getDocumentsMatchingCollectionQuery(t,d,r,s).next(f=>{f.forEach((m,v)=>{a=a.insert(m,v)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(t,e,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,r.largestBatchId).next(a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,r,i,s))).next(a=>{i.forEach((c,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Kt.newInvalidDocument(f)))});let l=fs();return a.forEach((c,d)=>{const f=i.get(c);f!==void 0&&ws(f.mutation,d,ae.empty(),Ct.now()),lo(e,d)&&(l=l.insert(c,d))}),l})}}/**
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
 */class h_{constructor(t){this.serializer=t,this.hr=new Map,this.Pr=new Map}getBundleMetadata(t,e){return L.resolve(this.hr.get(e))}saveBundleMetadata(t,e){return this.hr.set(e.id,function(s){return{id:s.id,version:s.version,createTime:Ne(s.createTime)}}(e)),L.resolve()}getNamedQuery(t,e){return L.resolve(this.Pr.get(e))}saveNamedQuery(t,e){return this.Pr.set(e.name,function(s){return{name:s.name,query:o_(s.bundledQuery),readTime:Ne(s.readTime)}}(e)),L.resolve()}}/**
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
 */class f_{constructor(){this.overlays=new gt(q.comparator),this.Ir=new Map}getOverlay(t,e){return L.resolve(this.overlays.get(e))}getOverlays(t,e){const r=qn();return L.forEach(e,s=>this.getOverlay(t,s).next(i=>{i!==null&&r.set(s,i)})).next(()=>r)}saveOverlays(t,e,r){return r.forEach((s,i)=>{this.ht(t,e,i)}),L.resolve()}removeOverlaysForBatchId(t,e,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(r)),L.resolve()}getOverlaysForCollection(t,e,r){const s=qn(),i=e.length+1,a=new q(e.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!e.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>r&&s.set(c.getKey(),c)}return L.resolve(s)}getOverlaysForCollectionGroup(t,e,r,s){let i=new gt((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===e&&d.largestBatchId>r){let f=i.get(d.largestBatchId);f===null&&(f=qn(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const l=qn(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,f)=>l.set(d,f)),!(l.size()>=s)););return L.resolve(l)}ht(t,e,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new V0(e,r));let i=this.Ir.get(e);i===void 0&&(i=tt(),this.Ir.set(e,i)),this.Ir.set(e,i.add(r.key))}}/**
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
 */class p_{constructor(){this.sessionToken=qt.EMPTY_BYTE_STRING}getSessionToken(t){return L.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,L.resolve()}}/**
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
 */class vl{constructor(){this.Tr=new $t(Ot.Er),this.dr=new $t(Ot.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(t,e){const r=new Ot(t,e);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(t,e){t.forEach(r=>this.addReference(r,e))}removeReference(t,e){this.Vr(new Ot(t,e))}mr(t,e){t.forEach(r=>this.removeReference(r,e))}gr(t){const e=new q(new pt([])),r=new Ot(e,t),s=new Ot(e,t+1),i=[];return this.dr.forEachInRange([r,s],a=>{this.Vr(a),i.push(a.key)}),i}pr(){this.Tr.forEach(t=>this.Vr(t))}Vr(t){this.Tr=this.Tr.delete(t),this.dr=this.dr.delete(t)}yr(t){const e=new q(new pt([])),r=new Ot(e,t),s=new Ot(e,t+1);let i=tt();return this.dr.forEachInRange([r,s],a=>{i=i.add(a.key)}),i}containsKey(t){const e=new Ot(t,0),r=this.Tr.firstAfterOrEqual(e);return r!==null&&t.isEqual(r.key)}}class Ot{constructor(t,e){this.key=t,this.wr=e}static Er(t,e){return q.comparator(t.key,e.key)||st(t.wr,e.wr)}static Ar(t,e){return st(t.wr,e.wr)||q.comparator(t.key,e.key)}}/**
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
 */class m_{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.Sr=1,this.br=new $t(Ot.Er)}checkEmpty(t){return L.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,r,s){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new L0(i,e,r,s);this.mutationQueue.push(a);for(const l of s)this.br=this.br.add(new Ot(l.key,i)),this.indexManager.addToCollectionParentIndex(t,l.key.path.popLast());return L.resolve(a)}lookupMutationBatch(t,e){return L.resolve(this.Dr(e))}getNextMutationBatchAfterBatchId(t,e){const r=e+1,s=this.vr(r),i=s<0?0:s;return L.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return L.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(t){return L.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const r=new Ot(e,0),s=new Ot(e,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([r,s],a=>{const l=this.Dr(a.wr);i.push(l)}),L.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let r=new $t(st);return e.forEach(s=>{const i=new Ot(s,0),a=new Ot(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,a],l=>{r=r.add(l.wr)})}),L.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(t,e){const r=e.path,s=r.length+1;let i=r;q.isDocumentKey(i)||(i=i.child(""));const a=new Ot(new q(i),0);let l=new $t(st);return this.br.forEachWhile(c=>{const d=c.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(l=l.add(c.wr)),!0)},a),L.resolve(this.Cr(l))}Cr(t){const e=[];return t.forEach(r=>{const s=this.Dr(r);s!==null&&e.push(s)}),e}removeMutationBatch(t,e){lt(this.Fr(e.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return L.forEach(e.mutations,s=>{const i=new Ot(s.key,e.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)}).next(()=>{this.br=r})}On(t){}containsKey(t,e){const r=new Ot(e,0),s=this.br.firstAfterOrEqual(r);return L.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,L.resolve()}Fr(t,e){return this.vr(t)}vr(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Dr(t){const e=this.vr(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
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
 */class g_{constructor(t){this.Mr=t,this.docs=function(){return new gt(q.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const r=e.key,s=this.docs.get(r),i=s?s.size:0,a=this.Mr(e);return this.docs=this.docs.insert(r,{document:e.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(t,r.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const r=this.docs.get(e);return L.resolve(r?r.document.mutableCopy():Kt.newInvalidDocument(e))}getEntries(t,e){let r=tn();return e.forEach(s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Kt.newInvalidDocument(s))}),L.resolve(r)}getDocumentsMatchingQuery(t,e,r,s){let i=tn();const a=e.path,l=new q(a.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:f}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||Zv(Xv(f),r)<=0||(s.has(f.key)||lo(e,f))&&(i=i.insert(f.key,f.mutableCopy()))}return L.resolve(i)}getAllFromCollectionGroup(t,e,r,s){Y()}Or(t,e){return L.forEach(this.docs,r=>e(r))}newChangeBuffer(t){return new y_(this)}getSize(t){return L.resolve(this.size)}}class y_ extends c_{constructor(t){super(),this.cr=t}applyChanges(t){const e=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?e.push(this.cr.addEntry(t,s)):this.cr.removeEntry(r)}),L.waitFor(e)}getFromCache(t,e){return this.cr.getEntry(t,e)}getAllFromCache(t,e){return this.cr.getEntries(t,e)}}/**
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
 */class v_{constructor(t){this.persistence=t,this.Nr=new Yr(e=>ul(e),dl),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.Lr=0,this.Br=new vl,this.targetCount=0,this.kr=zr.Bn()}forEachTarget(t,e){return this.Nr.forEach((r,s)=>e(s)),L.resolve()}getLastRemoteSnapshotVersion(t){return L.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return L.resolve(this.Lr)}allocateTargetId(t){return this.highestTargetId=this.kr.next(),L.resolve(this.highestTargetId)}setTargetsMetadata(t,e,r){return r&&(this.lastRemoteSnapshotVersion=r),e>this.Lr&&(this.Lr=e),L.resolve()}Kn(t){this.Nr.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.kr=new zr(e),this.highestTargetId=e),t.sequenceNumber>this.Lr&&(this.Lr=t.sequenceNumber)}addTargetData(t,e){return this.Kn(e),this.targetCount+=1,L.resolve()}updateTargetData(t,e){return this.Kn(e),L.resolve()}removeTargetData(t,e){return this.Nr.delete(e.target),this.Br.gr(e.targetId),this.targetCount-=1,L.resolve()}removeTargets(t,e,r){let s=0;const i=[];return this.Nr.forEach((a,l)=>{l.sequenceNumber<=e&&r.get(l.targetId)===null&&(this.Nr.delete(a),i.push(this.removeMatchingKeysForTargetId(t,l.targetId)),s++)}),L.waitFor(i).next(()=>s)}getTargetCount(t){return L.resolve(this.targetCount)}getTargetData(t,e){const r=this.Nr.get(e)||null;return L.resolve(r)}addMatchingKeys(t,e,r){return this.Br.Rr(e,r),L.resolve()}removeMatchingKeys(t,e,r){this.Br.mr(e,r);const s=this.persistence.referenceDelegate,i=[];return s&&e.forEach(a=>{i.push(s.markPotentiallyOrphaned(t,a))}),L.waitFor(i)}removeMatchingKeysForTargetId(t,e){return this.Br.gr(e),L.resolve()}getMatchingKeysForTargetId(t,e){const r=this.Br.yr(e);return L.resolve(r)}containsKey(t,e){return L.resolve(this.Br.containsKey(e))}}/**
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
 */class __{constructor(t,e){this.qr={},this.overlays={},this.Qr=new ol(0),this.Kr=!1,this.Kr=!0,this.$r=new p_,this.referenceDelegate=t(this),this.Ur=new v_(this),this.indexManager=new a_,this.remoteDocumentCache=function(s){return new g_(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new i_(e),this.Gr=new h_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new f_,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let r=this.qr[t.toKey()];return r||(r=new m_(e,this.referenceDelegate),this.qr[t.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(t,e,r){U("MemoryPersistence","Starting transaction:",t);const s=new w_(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(i=>this.referenceDelegate.jr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Hr(t,e){return L.or(Object.values(this.qr).map(r=>()=>r.containsKey(t,e)))}}class w_ extends e0{constructor(t){super(),this.currentSequenceNumber=t}}class _l{constructor(t){this.persistence=t,this.Jr=new vl,this.Yr=null}static Zr(t){return new _l(t)}get Xr(){if(this.Yr)return this.Yr;throw Y()}addReference(t,e,r){return this.Jr.addReference(r,e),this.Xr.delete(r.toString()),L.resolve()}removeReference(t,e,r){return this.Jr.removeReference(r,e),this.Xr.add(r.toString()),L.resolve()}markPotentiallyOrphaned(t,e){return this.Xr.add(e.toString()),L.resolve()}removeTarget(t,e){this.Jr.gr(e.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(t,e.targetId).next(s=>{s.forEach(i=>this.Xr.add(i.toString()))}).next(()=>r.removeTargetData(t,e))}zr(){this.Yr=new Set}jr(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return L.forEach(this.Xr,r=>{const s=q.fromPath(r);return this.ei(t,s).next(i=>{i||e.removeEntry(s,G.min())})}).next(()=>(this.Yr=null,e.apply(t)))}updateLimboDocument(t,e){return this.ei(t,e).next(r=>{r?this.Xr.delete(e.toString()):this.Xr.add(e.toString())})}Wr(t){return 0}ei(t,e){return L.or([()=>L.resolve(this.Jr.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Hr(t,e)])}}/**
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
 */class wl{constructor(t,e,r,s){this.targetId=t,this.fromCache=e,this.$i=r,this.Ui=s}static Wi(t,e){let r=tt(),s=tt();for(const i of e.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new wl(t,e.fromCache,r,s)}}/**
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
 */class E_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
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
 */class b_{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return sm()?8:n0(Jt())>0?6:4}()}initialize(t,e){this.Ji=t,this.indexManager=e,this.Gi=!0}getDocumentsMatchingQuery(t,e,r,s){const i={result:null};return this.Yi(t,e).next(a=>{i.result=a}).next(()=>{if(!i.result)return this.Zi(t,e,s,r).next(a=>{i.result=a})}).next(()=>{if(i.result)return;const a=new E_;return this.Xi(t,e,a).next(l=>{if(i.result=l,this.zi)return this.es(t,e,a,l.size)})}).next(()=>i.result)}es(t,e,r,s){return r.documentReadCount<this.ji?(ls()<=et.DEBUG&&U("QueryEngine","SDK will not create cache indexes for query:",Er(e),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),L.resolve()):(ls()<=et.DEBUG&&U("QueryEngine","Query:",Er(e),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(ls()<=et.DEBUG&&U("QueryEngine","The SDK decides to create cache indexes for query:",Er(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Me(e))):L.resolve())}Yi(t,e){if(Mu(e))return L.resolve(null);let r=Me(e);return this.indexManager.getIndexType(t,r).next(s=>s===0?null:(e.limit!==null&&s===1&&(e=Wi(e,null,"F"),r=Me(e)),this.indexManager.getDocumentsMatchingTarget(t,r).next(i=>{const a=tt(...i);return this.Ji.getDocuments(t,a).next(l=>this.indexManager.getMinOffset(t,r).next(c=>{const d=this.ts(e,l);return this.ns(e,d,a,c.readTime)?this.Yi(t,Wi(e,null,"F")):this.rs(t,d,e,c)}))})))}Zi(t,e,r,s){return Mu(e)||s.isEqual(G.min())?L.resolve(null):this.Ji.getDocuments(t,r).next(i=>{const a=this.ts(e,i);return this.ns(e,a,r,s)?L.resolve(null):(ls()<=et.DEBUG&&U("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Er(e)),this.rs(t,a,e,Jv(s,-1)).next(l=>l))})}ts(t,e){let r=new $t(Mh(t));return e.forEach((s,i)=>{lo(t,i)&&(r=r.add(i))}),r}ns(t,e,r,s){if(t.limit===null)return!1;if(r.size!==e.size)return!0;const i=t.limitType==="F"?e.last():e.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Xi(t,e,r){return ls()<=et.DEBUG&&U("QueryEngine","Using full collection scan to execute query:",Er(e)),this.Ji.getDocumentsMatchingQuery(t,e,xn.min(),r)}rs(t,e,r,s){return this.Ji.getDocumentsMatchingQuery(t,r,s).next(i=>(e.forEach(a=>{i=i.insert(a.key,a)}),i))}}/**
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
 */class T_{constructor(t,e,r,s){this.persistence=t,this.ss=e,this.serializer=s,this.os=new gt(st),this._s=new Yr(i=>ul(i),dl),this.us=new Map,this.cs=t.getRemoteDocumentCache(),this.Ur=t.getTargetCache(),this.Gr=t.getBundleCache(),this.ls(r)}ls(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new d_(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.os))}}function I_(n,t,e,r){return new T_(n,t,e,r)}async function tf(n,t){const e=K(n);return await e.persistence.runTransaction("Handle user change","readonly",r=>{let s;return e.mutationQueue.getAllMutationBatches(r).next(i=>(s=i,e.ls(t),e.mutationQueue.getAllMutationBatches(r))).next(i=>{const a=[],l=[];let c=tt();for(const d of s){a.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}for(const d of i){l.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}return e.localDocuments.getDocuments(r,c).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:l}))})})}function S_(n,t){const e=K(n);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=t.batch.keys(),i=e.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,f){const m=d.batch,v=m.keys();let E=L.resolve();return v.forEach(T=>{E=E.next(()=>f.getEntry(c,T)).next(x=>{const I=d.docVersions.get(T);lt(I!==null),x.version.compareTo(I)<0&&(m.applyToRemoteDocument(x,d),x.isValidDocument()&&(x.setReadTime(d.commitVersion),f.addEntry(x)))})}),E.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(e,r,t,i).next(()=>i.apply(r)).next(()=>e.mutationQueue.performConsistencyCheck(r)).next(()=>e.documentOverlayCache.removeOverlaysForBatchId(r,s,t.batch.batchId)).next(()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let c=tt();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(t))).next(()=>e.localDocuments.getDocuments(r,s))})}function ef(n){const t=K(n);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Ur.getLastRemoteSnapshotVersion(e))}function A_(n,t){const e=K(n),r=t.snapshotVersion;let s=e.os;return e.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const a=e.cs.newChangeBuffer({trackRemovals:!0});s=e.os;const l=[];t.targetChanges.forEach((f,m)=>{const v=s.get(m);if(!v)return;l.push(e.Ur.removeMatchingKeys(i,f.removedDocuments,m).next(()=>e.Ur.addMatchingKeys(i,f.addedDocuments,m)));let E=v.withSequenceNumber(i.currentSequenceNumber);t.targetMismatches.get(m)!==null?E=E.withResumeToken(qt.EMPTY_BYTE_STRING,G.min()).withLastLimboFreeSnapshotVersion(G.min()):f.resumeToken.approximateByteSize()>0&&(E=E.withResumeToken(f.resumeToken,r)),s=s.insert(m,E),function(x,I,P){return x.resumeToken.approximateByteSize()===0||I.snapshotVersion.toMicroseconds()-x.snapshotVersion.toMicroseconds()>=3e8?!0:P.addedDocuments.size+P.modifiedDocuments.size+P.removedDocuments.size>0}(v,E,f)&&l.push(e.Ur.updateTargetData(i,E))});let c=tn(),d=tt();if(t.documentUpdates.forEach(f=>{t.resolvedLimboDocuments.has(f)&&l.push(e.persistence.referenceDelegate.updateLimboDocument(i,f))}),l.push(x_(i,a,t.documentUpdates).next(f=>{c=f.Ps,d=f.Is})),!r.isEqual(G.min())){const f=e.Ur.getLastRemoteSnapshotVersion(i).next(m=>e.Ur.setTargetsMetadata(i,i.currentSequenceNumber,r));l.push(f)}return L.waitFor(l).next(()=>a.apply(i)).next(()=>e.localDocuments.getLocalViewOfDocuments(i,c,d)).next(()=>c)}).then(i=>(e.os=s,i))}function x_(n,t,e){let r=tt(),s=tt();return e.forEach(i=>r=r.add(i)),t.getEntries(n,r).next(i=>{let a=tn();return e.forEach((l,c)=>{const d=i.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(l)),c.isNoDocument()&&c.version.isEqual(G.min())?(t.removeEntry(l,c.readTime),a=a.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(t.addEntry(c),a=a.insert(l,c)):U("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:a,Is:s}})}function R_(n,t){const e=K(n);return e.persistence.runTransaction("Get next mutation batch","readonly",r=>(t===void 0&&(t=-1),e.mutationQueue.getNextMutationBatchAfterBatchId(r,t)))}function P_(n,t){const e=K(n);return e.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return e.Ur.getTargetData(r,t).next(i=>i?(s=i,L.resolve(s)):e.Ur.allocateTargetId(r).next(a=>(s=new _n(t,a,"TargetPurposeListen",r.currentSequenceNumber),e.Ur.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=e.os.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.os=e.os.insert(r.targetId,r),e._s.set(t,r.targetId)),r})}async function Ma(n,t,e){const r=K(n),s=r.os.get(t),i=e?"readwrite":"readwrite-primary";try{e||await r.persistence.runTransaction("Release target",i,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!$s(a))throw a;U("LocalStore",`Failed to update sequence numbers for target ${t}: ${a}`)}r.os=r.os.remove(t),r._s.delete(s.target)}function ju(n,t,e){const r=K(n);let s=G.min(),i=tt();return r.persistence.runTransaction("Execute query","readwrite",a=>function(c,d,f){const m=K(c),v=m._s.get(f);return v!==void 0?L.resolve(m.os.get(v)):m.Ur.getTargetData(d,f)}(r,a,Me(t)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(a,l.targetId).next(c=>{i=c})}).next(()=>r.ss.getDocumentsMatchingQuery(a,t,e?s:G.min(),e?i:tt())).next(l=>(C_(r,w0(t),l),{documents:l,Ts:i})))}function C_(n,t,e){let r=n.us.get(t)||G.min();e.forEach((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)}),n.us.set(t,r)}class Hu{constructor(){this.activeTargetIds=A0()}fs(t){this.activeTargetIds=this.activeTargetIds.add(t)}gs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Vs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class k_{constructor(){this.so=new Hu,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,r){}addLocalQueryTarget(t,e=!0){return e&&this.so.fs(t),this.oo[t]||"not-current"}updateQueryState(t,e,r){this.oo[t]=e}removeLocalQueryTarget(t){this.so.gs(t)}isLocalQueryTarget(t){return this.so.activeTargetIds.has(t)}clearQueryState(t){delete this.oo[t]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(t){return this.so.activeTargetIds.has(t)}start(){return this.so=new Hu,Promise.resolve()}handleUserChange(t,e,r){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
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
 */class D_{_o(t){}shutdown(){}}/**
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
 */class Wu{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(t){this.ho.push(t)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){U("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const t of this.ho)t(0)}lo(){U("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const t of this.ho)t(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Ti=null;function ra(){return Ti===null?Ti=function(){return 268435456+Math.round(2147483648*Math.random())}():Ti++,"0x"+Ti.toString(16)}/**
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
 */const M_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
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
 */class N_{constructor(t){this.Io=t.Io,this.To=t.To}Eo(t){this.Ao=t}Ro(t){this.Vo=t}mo(t){this.fo=t}onMessage(t){this.po=t}close(){this.To()}send(t){this.Io(t)}yo(){this.Ao()}wo(){this.Vo()}So(t){this.fo(t)}bo(t){this.po(t)}}/**
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
 */const Yt="WebChannelConnection";class L_ extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const r=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+e.host,this.vo=`projects/${s}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Fo(){return!1}Mo(e,r,s,i,a){const l=ra(),c=this.xo(e,r.toUriEncodedString());U("RestConnection",`Sending RPC '${e}' ${l}:`,c,s);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,a),this.No(e,c,d,s).then(f=>(U("RestConnection",`Received RPC '${e}' ${l}: `,f),f),f=>{throw Vr("RestConnection",`RPC '${e}' ${l} failed with error: `,f,"url: ",c,"request:",s),f})}Lo(e,r,s,i,a,l){return this.Mo(e,r,s,i,a)}Oo(e,r,s){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Hr}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((i,a)=>e[a]=i),s&&s.headers.forEach((i,a)=>e[a]=i)}xo(e,r){const s=M_[e];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(t){super(t),this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}No(t,e,r,s){const i=ra();return new Promise((a,l)=>{const c=new mh;c.setWithCredentials(!0),c.listenOnce(gh.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Ri.NO_ERROR:const f=c.getResponseJson();U(Yt,`XHR for RPC '${t}' ${i} received:`,JSON.stringify(f)),a(f);break;case Ri.TIMEOUT:U(Yt,`RPC '${t}' ${i} timed out`),l(new z(M.DEADLINE_EXCEEDED,"Request time out"));break;case Ri.HTTP_ERROR:const m=c.getStatus();if(U(Yt,`RPC '${t}' ${i} failed with status:`,m,"response text:",c.getResponseText()),m>0){let v=c.getResponseJson();Array.isArray(v)&&(v=v[0]);const E=v==null?void 0:v.error;if(E&&E.status&&E.message){const T=function(I){const P=I.toLowerCase().replace(/_/g,"-");return Object.values(M).indexOf(P)>=0?P:M.UNKNOWN}(E.status);l(new z(T,E.message))}else l(new z(M.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new z(M.UNAVAILABLE,"Connection failed."));break;default:Y()}}finally{U(Yt,`RPC '${t}' ${i} completed.`)}});const d=JSON.stringify(s);U(Yt,`RPC '${t}' ${i} sending request:`,s),c.send(e,"POST",d,r,15)})}Bo(t,e,r){const s=ra(),i=[this.Do,"/","google.firestore.v1.Firestore","/",t,"/channel"],a=_h(),l=vh(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,e,r),c.encodeInitMessageHeaders=!0;const f=i.join("");U(Yt,`Creating RPC '${t}' stream ${s}: ${f}`,c);const m=a.createWebChannel(f,c);let v=!1,E=!1;const T=new N_({Io:I=>{E?U(Yt,`Not sending because RPC '${t}' stream ${s} is closed:`,I):(v||(U(Yt,`Opening RPC '${t}' stream ${s} transport.`),m.open(),v=!0),U(Yt,`RPC '${t}' stream ${s} sending:`,I),m.send(I))},To:()=>m.close()}),x=(I,P,D)=>{I.listen(P,C=>{try{D(C)}catch(N){setTimeout(()=>{throw N},0)}})};return x(m,hs.EventType.OPEN,()=>{E||(U(Yt,`RPC '${t}' stream ${s} transport opened.`),T.yo())}),x(m,hs.EventType.CLOSE,()=>{E||(E=!0,U(Yt,`RPC '${t}' stream ${s} transport closed`),T.So())}),x(m,hs.EventType.ERROR,I=>{E||(E=!0,Vr(Yt,`RPC '${t}' stream ${s} transport errored:`,I),T.So(new z(M.UNAVAILABLE,"The operation could not be completed")))}),x(m,hs.EventType.MESSAGE,I=>{var P;if(!E){const D=I.data[0];lt(!!D);const C=D,N=C.error||((P=C[0])===null||P===void 0?void 0:P.error);if(N){U(Yt,`RPC '${t}' stream ${s} received error:`,N);const F=N.status;let V=function(y){const w=bt[y];if(w!==void 0)return jh(w)}(F),b=N.message;V===void 0&&(V=M.INTERNAL,b="Unknown error status: "+F+" with message "+N.message),E=!0,T.So(new z(V,b)),m.close()}else U(Yt,`RPC '${t}' stream ${s} received:`,D),T.bo(D)}}),x(l,yh.STAT_EVENT,I=>{I.stat===Ta.PROXY?U(Yt,`RPC '${t}' stream ${s} detected buffering proxy`):I.stat===Ta.NOPROXY&&U(Yt,`RPC '${t}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{T.wo()},0),T}}function sa(){return typeof document<"u"?document:null}/**
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
 */function fo(n){return new H0(n,!0)}/**
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
 */class nf{constructor(t,e,r=1e3,s=1.5,i=6e4){this.ui=t,this.timerId=e,this.ko=r,this.qo=s,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(t){this.cancel();const e=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,e-r);s>0&&U("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${e} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),t())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class rf{constructor(t,e,r,s,i,a,l,c){this.ui=t,this.Ho=r,this.Jo=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new nf(t,e)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(t){this.u_(),this.stream.send(t)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(t,e){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,t!==4?this.t_.reset():e&&e.code===M.RESOURCE_EXHAUSTED?(Ze(e.toString()),Ze("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):e&&e.code===M.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.mo(e)}l_(){}auth(){this.state=1;const t=this.h_(this.Yo),e=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===e&&this.P_(r,s)},r=>{t(()=>{const s=new z(M.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(t,e){const r=this.h_(this.Yo);this.stream=this.T_(t,e),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(t){return U("PersistentStream",`close with error: ${t}`),this.stream=null,this.close(4,t)}h_(t){return e=>{this.ui.enqueueAndForget(()=>this.Yo===t?e():(U("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class V_ extends rf{constructor(t,e,r,s,i,a){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,r,s,a),this.serializer=i}T_(t,e){return this.connection.Bo("Listen",t,e)}E_(t){return this.onNext(t)}onNext(t){this.t_.reset();const e=G0(this.serializer,t),r=function(i){if(!("targetChange"in i))return G.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?G.min():a.readTime?Ne(a.readTime):G.min()}(t);return this.listener.d_(e,r)}A_(t){const e={};e.database=Da(this.serializer),e.addTarget=function(i,a){let l;const c=a.target;if(l=xa(c)?{documents:J0(i,c)}:{query:X0(i,c)._t},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=Yh(i,a.resumeToken);const d=Pa(i,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(G.min())>0){l.readTime=Ki(i,a.snapshotVersion.toTimestamp());const d=Pa(i,a.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,t);const r=t_(this.serializer,t);r&&(e.labels=r),this.a_(e)}R_(t){const e={};e.database=Da(this.serializer),e.removeTarget=t,this.a_(e)}}class O_ extends rf{constructor(t,e,r,s,i,a){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,r,s,a),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(t,e){return this.connection.Bo("Write",t,e)}E_(t){return lt(!!t.streamToken),this.lastStreamToken=t.streamToken,lt(!t.writeResults||t.writeResults.length===0),this.listener.f_()}onNext(t){lt(!!t.streamToken),this.lastStreamToken=t.streamToken,this.t_.reset();const e=Q0(t.writeResults,t.commitTime),r=Ne(t.commitTime);return this.listener.g_(r,e)}p_(){const t={};t.database=Da(this.serializer),this.a_(t)}m_(t){const e={streamToken:this.lastStreamToken,writes:t.map(r=>K0(this.serializer,r))};this.a_(e)}}/**
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
 */class B_ extends class{}{constructor(t,e,r,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new z(M.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(t,e,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,a])=>this.connection.Mo(t,Ca(e,r),s,i,a)).catch(i=>{throw i.name==="FirebaseError"?(i.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new z(M.UNKNOWN,i.toString())})}Lo(t,e,r,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Lo(t,Ca(e,r),s,a,l,i)).catch(a=>{throw a.name==="FirebaseError"?(a.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new z(M.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class F_{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(t){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.C_("Offline")))}set(t){this.x_(),this.S_=0,t==="Online"&&(this.D_=!1),this.C_(t)}C_(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}F_(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Ze(e),this.D_=!1):U("OnlineStateTracker",e)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class z_{constructor(t,e,r,s,i){this.localStore=t,this.datastore=e,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(a=>{r.enqueueAndForget(async()=>{nr(this)&&(U("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=K(c);d.L_.add(4),await Hs(d),d.q_.set("Unknown"),d.L_.delete(4),await po(d)}(this))})}),this.q_=new F_(r,s)}}async function po(n){if(nr(n))for(const t of n.B_)await t(!0)}async function Hs(n){for(const t of n.B_)await t(!1)}function sf(n,t){const e=K(n);e.N_.has(t.targetId)||(e.N_.set(t.targetId,t),Il(e)?Tl(e):Gr(e).r_()&&bl(e,t))}function El(n,t){const e=K(n),r=Gr(e);e.N_.delete(t),r.r_()&&of(e,t),e.N_.size===0&&(r.r_()?r.o_():nr(e)&&e.q_.set("Unknown"))}function bl(n,t){if(n.Q_.xe(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(G.min())>0){const e=n.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}Gr(n).A_(t)}function of(n,t){n.Q_.xe(t),Gr(n).R_(t)}function Tl(n){n.Q_=new U0({getRemoteKeysForTarget:t=>n.remoteSyncer.getRemoteKeysForTarget(t),ot:t=>n.N_.get(t)||null,tt:()=>n.datastore.serializer.databaseId}),Gr(n).start(),n.q_.v_()}function Il(n){return nr(n)&&!Gr(n).n_()&&n.N_.size>0}function nr(n){return K(n).L_.size===0}function af(n){n.Q_=void 0}async function U_(n){n.q_.set("Online")}async function $_(n){n.N_.forEach((t,e)=>{bl(n,t)})}async function q_(n,t){af(n),Il(n)?(n.q_.M_(t),Tl(n)):n.q_.set("Unknown")}async function j_(n,t,e){if(n.q_.set("Online"),t instanceof Wh&&t.state===2&&t.cause)try{await async function(s,i){const a=i.cause;for(const l of i.targetIds)s.N_.has(l)&&(await s.remoteSyncer.rejectListen(l,a),s.N_.delete(l),s.Q_.removeTarget(l))}(n,t)}catch(r){U("RemoteStore","Failed to remove targets %s: %s ",t.targetIds.join(","),r),await Qi(n,r)}else if(t instanceof ki?n.Q_.Ke(t):t instanceof Hh?n.Q_.He(t):n.Q_.We(t),!e.isEqual(G.min()))try{const r=await ef(n.localStore);e.compareTo(r)>=0&&await function(i,a){const l=i.Q_.rt(a);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const f=i.N_.get(d);f&&i.N_.set(d,f.withResumeToken(c.resumeToken,a))}}),l.targetMismatches.forEach((c,d)=>{const f=i.N_.get(c);if(!f)return;i.N_.set(c,f.withResumeToken(qt.EMPTY_BYTE_STRING,f.snapshotVersion)),of(i,c);const m=new _n(f.target,c,d,f.sequenceNumber);bl(i,m)}),i.remoteSyncer.applyRemoteEvent(l)}(n,e)}catch(r){U("RemoteStore","Failed to raise snapshot:",r),await Qi(n,r)}}async function Qi(n,t,e){if(!$s(t))throw t;n.L_.add(1),await Hs(n),n.q_.set("Offline"),e||(e=()=>ef(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{U("RemoteStore","Retrying IndexedDB access"),await e(),n.L_.delete(1),await po(n)})}function lf(n,t){return t().catch(e=>Qi(n,e,t))}async function mo(n){const t=K(n),e=Pn(t);let r=t.O_.length>0?t.O_[t.O_.length-1].batchId:-1;for(;H_(t);)try{const s=await R_(t.localStore,r);if(s===null){t.O_.length===0&&e.o_();break}r=s.batchId,W_(t,s)}catch(s){await Qi(t,s)}cf(t)&&uf(t)}function H_(n){return nr(n)&&n.O_.length<10}function W_(n,t){n.O_.push(t);const e=Pn(n);e.r_()&&e.V_&&e.m_(t.mutations)}function cf(n){return nr(n)&&!Pn(n).n_()&&n.O_.length>0}function uf(n){Pn(n).start()}async function Y_(n){Pn(n).p_()}async function G_(n){const t=Pn(n);for(const e of n.O_)t.m_(e.mutations)}async function K_(n,t,e){const r=n.O_.shift(),s=ml.from(r,t,e);await lf(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await mo(n)}async function Q_(n,t){t&&Pn(n).V_&&await async function(r,s){if(function(a){return B0(a)&&a!==M.ABORTED}(s.code)){const i=r.O_.shift();Pn(r).s_(),await lf(r,()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s)),await mo(r)}}(n,t),cf(n)&&uf(n)}async function Yu(n,t){const e=K(n);e.asyncQueue.verifyOperationInProgress(),U("RemoteStore","RemoteStore received new credentials");const r=nr(e);e.L_.add(3),await Hs(e),r&&e.q_.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.L_.delete(3),await po(e)}async function J_(n,t){const e=K(n);t?(e.L_.delete(2),await po(e)):t||(e.L_.add(2),await Hs(e),e.q_.set("Unknown"))}function Gr(n){return n.K_||(n.K_=function(e,r,s){const i=K(e);return i.w_(),new V_(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:U_.bind(null,n),Ro:$_.bind(null,n),mo:q_.bind(null,n),d_:j_.bind(null,n)}),n.B_.push(async t=>{t?(n.K_.s_(),Il(n)?Tl(n):n.q_.set("Unknown")):(await n.K_.stop(),af(n))})),n.K_}function Pn(n){return n.U_||(n.U_=function(e,r,s){const i=K(e);return i.w_(),new O_(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:Y_.bind(null,n),mo:Q_.bind(null,n),f_:G_.bind(null,n),g_:K_.bind(null,n)}),n.B_.push(async t=>{t?(n.U_.s_(),await mo(n)):(await n.U_.stop(),n.O_.length>0&&(U("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
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
 */class Sl{constructor(t,e,r,s,i){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new Qe,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,r,s,i){const a=Date.now()+r,l=new Sl(t,e,a,s,i);return l.start(r),l}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new z(M.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Al(n,t){if(Ze("AsyncQueue",`${t}: ${n}`),$s(n))return new z(M.UNAVAILABLE,`${t}: ${n}`);throw n}/**
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
 */class kr{constructor(t){this.comparator=t?(e,r)=>t(e,r)||q.comparator(e.key,r.key):(e,r)=>q.comparator(e.key,r.key),this.keyedMap=fs(),this.sortedSet=new gt(this.comparator)}static emptySet(t){return new kr(t.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,r)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof kr)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),r=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
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
 */class Gu{constructor(){this.W_=new gt(q.comparator)}track(t){const e=t.doc.key,r=this.W_.get(e);r?t.type!==0&&r.type===3?this.W_=this.W_.insert(e,t):t.type===3&&r.type!==1?this.W_=this.W_.insert(e,{type:r.type,doc:t.doc}):t.type===2&&r.type===2?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):t.type===2&&r.type===0?this.W_=this.W_.insert(e,{type:0,doc:t.doc}):t.type===1&&r.type===0?this.W_=this.W_.remove(e):t.type===1&&r.type===2?this.W_=this.W_.insert(e,{type:1,doc:r.doc}):t.type===0&&r.type===1?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):Y():this.W_=this.W_.insert(e,t)}G_(){const t=[];return this.W_.inorderTraversal((e,r)=>{t.push(r)}),t}}class Ur{constructor(t,e,r,s,i,a,l,c,d){this.query=t,this.docs=e,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(t,e,r,s,i){const a=[];return e.forEach(l=>{a.push({type:0,doc:l})}),new Ur(t,e,kr.emptySet(e),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&ao(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,r=t.docChanges;if(e.length!==r.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==r[s].type||!e[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
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
 */class X_{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(t=>t.J_())}}class Z_{constructor(){this.queries=Ku(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(e,r){const s=K(e),i=s.queries;s.queries=Ku(),i.forEach((a,l)=>{for(const c of l.j_)c.onError(r)})})(this,new z(M.ABORTED,"Firestore shutting down"))}}function Ku(){return new Yr(n=>Dh(n),ao)}async function df(n,t){const e=K(n);let r=3;const s=t.query;let i=e.queries.get(s);i?!i.H_()&&t.J_()&&(r=2):(i=new X_,r=t.J_()?0:1);try{switch(r){case 0:i.z_=await e.onListen(s,!0);break;case 1:i.z_=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(a){const l=Al(a,`Initialization of query '${Er(t.query)}' failed`);return void t.onError(l)}e.queries.set(s,i),i.j_.push(t),t.Z_(e.onlineState),i.z_&&t.X_(i.z_)&&xl(e)}async function hf(n,t){const e=K(n),r=t.query;let s=3;const i=e.queries.get(r);if(i){const a=i.j_.indexOf(t);a>=0&&(i.j_.splice(a,1),i.j_.length===0?s=t.J_()?0:1:!i.H_()&&t.J_()&&(s=2))}switch(s){case 0:return e.queries.delete(r),e.onUnlisten(r,!0);case 1:return e.queries.delete(r),e.onUnlisten(r,!1);case 2:return e.onLastRemoteStoreUnlisten(r);default:return}}function tw(n,t){const e=K(n);let r=!1;for(const s of t){const i=s.query,a=e.queries.get(i);if(a){for(const l of a.j_)l.X_(s)&&(r=!0);a.z_=s}}r&&xl(e)}function ew(n,t,e){const r=K(n),s=r.queries.get(t);if(s)for(const i of s.j_)i.onError(e);r.queries.delete(t)}function xl(n){n.Y_.forEach(t=>{t.next()})}var Na,Qu;(Qu=Na||(Na={})).ea="default",Qu.Cache="cache";class ff{constructor(t,e,r){this.query=t,this.ta=e,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(t){if(!this.options.includeMetadataChanges){const r=[];for(const s of t.docChanges)s.type!==3&&r.push(s);t=new Ur(t.query,t.docs,t.oldDocs,r,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.na?this.ia(t)&&(this.ta.next(t),e=!0):this.sa(t,this.onlineState)&&(this.oa(t),e=!0),this.ra=t,e}onError(t){this.ta.error(t)}Z_(t){this.onlineState=t;let e=!1;return this.ra&&!this.na&&this.sa(this.ra,t)&&(this.oa(this.ra),e=!0),e}sa(t,e){if(!t.fromCache||!this.J_())return!0;const r=e!=="Offline";return(!this.options._a||!r)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}ia(t){if(t.docChanges.length>0)return!0;const e=this.ra&&this.ra.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}oa(t){t=Ur.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.na=!0,this.ta.next(t)}J_(){return this.options.source!==Na.Cache}}/**
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
 */class pf{constructor(t){this.key=t}}class mf{constructor(t){this.key=t}}class nw{constructor(t,e){this.query=t,this.Ta=e,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=tt(),this.mutatedKeys=tt(),this.Aa=Mh(t),this.Ra=new kr(this.Aa)}get Va(){return this.Ta}ma(t,e){const r=e?e.fa:new Gu,s=e?e.Ra:this.Ra;let i=e?e.mutatedKeys:this.mutatedKeys,a=s,l=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal((f,m)=>{const v=s.get(f),E=lo(this.query,m)?m:null,T=!!v&&this.mutatedKeys.has(v.key),x=!!E&&(E.hasLocalMutations||this.mutatedKeys.has(E.key)&&E.hasCommittedMutations);let I=!1;v&&E?v.data.isEqual(E.data)?T!==x&&(r.track({type:3,doc:E}),I=!0):this.ga(v,E)||(r.track({type:2,doc:E}),I=!0,(c&&this.Aa(E,c)>0||d&&this.Aa(E,d)<0)&&(l=!0)):!v&&E?(r.track({type:0,doc:E}),I=!0):v&&!E&&(r.track({type:1,doc:v}),I=!0,(c||d)&&(l=!0)),I&&(E?(a=a.add(E),i=x?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),r.track({type:1,doc:f})}return{Ra:a,fa:r,ns:l,mutatedKeys:i}}ga(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,r,s){const i=this.Ra;this.Ra=t.Ra,this.mutatedKeys=t.mutatedKeys;const a=t.fa.G_();a.sort((f,m)=>function(E,T){const x=I=>{switch(I){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Y()}};return x(E)-x(T)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(r),s=s!=null&&s;const l=e&&!s?this.ya():[],c=this.da.size===0&&this.current&&!s?1:0,d=c!==this.Ea;return this.Ea=c,a.length!==0||d?{snapshot:new Ur(this.query,t.Ra,i,a,t.mutatedKeys,c===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Gu,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(t){return!this.Ta.has(t)&&!!this.Ra.has(t)&&!this.Ra.get(t).hasLocalMutations}pa(t){t&&(t.addedDocuments.forEach(e=>this.Ta=this.Ta.add(e)),t.modifiedDocuments.forEach(e=>{}),t.removedDocuments.forEach(e=>this.Ta=this.Ta.delete(e)),this.current=t.current)}ya(){if(!this.current)return[];const t=this.da;this.da=tt(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const e=[];return t.forEach(r=>{this.da.has(r)||e.push(new mf(r))}),this.da.forEach(r=>{t.has(r)||e.push(new pf(r))}),e}ba(t){this.Ta=t.Ts,this.da=tt();const e=this.ma(t.documents);return this.applyChanges(e,!0)}Da(){return Ur.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class rw{constructor(t,e,r){this.query=t,this.targetId=e,this.view=r}}class sw{constructor(t){this.key=t,this.va=!1}}class iw{constructor(t,e,r,s,i,a){this.localStore=t,this.remoteStore=e,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new Yr(l=>Dh(l),ao),this.Ma=new Map,this.xa=new Set,this.Oa=new gt(q.comparator),this.Na=new Map,this.La=new vl,this.Ba={},this.ka=new Map,this.qa=zr.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function ow(n,t,e=!0){const r=Ef(n);let s;const i=r.Fa.get(t);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Da()):s=await gf(r,t,e,!0),s}async function aw(n,t){const e=Ef(n);await gf(e,t,!0,!1)}async function gf(n,t,e,r){const s=await P_(n.localStore,Me(t)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,e);let l;return r&&(l=await lw(n,t,i,a==="current",s.resumeToken)),n.isPrimaryClient&&e&&sf(n.remoteStore,s),l}async function lw(n,t,e,r,s){n.Ka=(m,v,E)=>async function(x,I,P,D){let C=I.view.ma(P);C.ns&&(C=await ju(x.localStore,I.query,!1).then(({documents:b})=>I.view.ma(b,C)));const N=D&&D.targetChanges.get(I.targetId),F=D&&D.targetMismatches.get(I.targetId)!=null,V=I.view.applyChanges(C,x.isPrimaryClient,N,F);return Xu(x,I.targetId,V.wa),V.snapshot}(n,m,v,E);const i=await ju(n.localStore,t,!0),a=new nw(t,i.Ts),l=a.ma(i.documents),c=js.createSynthesizedTargetChangeForCurrentChange(e,r&&n.onlineState!=="Offline",s),d=a.applyChanges(l,n.isPrimaryClient,c);Xu(n,e,d.wa);const f=new rw(t,e,a);return n.Fa.set(t,f),n.Ma.has(e)?n.Ma.get(e).push(t):n.Ma.set(e,[t]),d.snapshot}async function cw(n,t,e){const r=K(n),s=r.Fa.get(t),i=r.Ma.get(s.targetId);if(i.length>1)return r.Ma.set(s.targetId,i.filter(a=>!ao(a,t))),void r.Fa.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Ma(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),e&&El(r.remoteStore,s.targetId),La(r,s.targetId)}).catch(Us)):(La(r,s.targetId),await Ma(r.localStore,s.targetId,!0))}async function uw(n,t){const e=K(n),r=e.Fa.get(t),s=e.Ma.get(r.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(r.targetId),El(e.remoteStore,r.targetId))}async function dw(n,t,e){const r=vw(n);try{const s=await function(a,l){const c=K(a),d=Ct.now(),f=l.reduce((E,T)=>E.add(T.key),tt());let m,v;return c.persistence.runTransaction("Locally write mutations","readwrite",E=>{let T=tn(),x=tt();return c.cs.getEntries(E,f).next(I=>{T=I,T.forEach((P,D)=>{D.isValidDocument()||(x=x.add(P))})}).next(()=>c.localDocuments.getOverlayedDocuments(E,T)).next(I=>{m=I;const P=[];for(const D of l){const C=M0(D,m.get(D.key).overlayedDocument);C!=null&&P.push(new kn(D.key,C,Ih(C.value.mapValue),le.exists(!0)))}return c.mutationQueue.addMutationBatch(E,d,P,l)}).next(I=>{v=I;const P=I.applyToLocalDocumentSet(m,x);return c.documentOverlayCache.saveOverlays(E,I.batchId,P)})}).then(()=>({batchId:v.batchId,changes:Lh(m)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(s.batchId),function(a,l,c){let d=a.Ba[a.currentUser.toKey()];d||(d=new gt(st)),d=d.insert(l,c),a.Ba[a.currentUser.toKey()]=d}(r,s.batchId,e),await Ws(r,s.changes),await mo(r.remoteStore)}catch(s){const i=Al(s,"Failed to persist write");e.reject(i)}}async function yf(n,t){const e=K(n);try{const r=await A_(e.localStore,t);t.targetChanges.forEach((s,i)=>{const a=e.Na.get(i);a&&(lt(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?a.va=!0:s.modifiedDocuments.size>0?lt(a.va):s.removedDocuments.size>0&&(lt(a.va),a.va=!1))}),await Ws(e,r,t)}catch(r){await Us(r)}}function Ju(n,t,e){const r=K(n);if(r.isPrimaryClient&&e===0||!r.isPrimaryClient&&e===1){const s=[];r.Fa.forEach((i,a)=>{const l=a.view.Z_(t);l.snapshot&&s.push(l.snapshot)}),function(a,l){const c=K(a);c.onlineState=l;let d=!1;c.queries.forEach((f,m)=>{for(const v of m.j_)v.Z_(l)&&(d=!0)}),d&&xl(c)}(r.eventManager,t),s.length&&r.Ca.d_(s),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function hw(n,t,e){const r=K(n);r.sharedClientState.updateQueryState(t,"rejected",e);const s=r.Na.get(t),i=s&&s.key;if(i){let a=new gt(q.comparator);a=a.insert(i,Kt.newNoDocument(i,G.min()));const l=tt().add(i),c=new ho(G.min(),new Map,new gt(st),a,l);await yf(r,c),r.Oa=r.Oa.remove(i),r.Na.delete(t),Rl(r)}else await Ma(r.localStore,t,!1).then(()=>La(r,t,e)).catch(Us)}async function fw(n,t){const e=K(n),r=t.batch.batchId;try{const s=await S_(e.localStore,t);_f(e,r,null),vf(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await Ws(e,s)}catch(s){await Us(s)}}async function pw(n,t,e){const r=K(n);try{const s=await function(a,l){const c=K(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return c.mutationQueue.lookupMutationBatch(d,l).next(m=>(lt(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>c.localDocuments.getDocuments(d,f))})}(r.localStore,t);_f(r,t,e),vf(r,t),r.sharedClientState.updateMutationState(t,"rejected",e),await Ws(r,s)}catch(s){await Us(s)}}function vf(n,t){(n.ka.get(t)||[]).forEach(e=>{e.resolve()}),n.ka.delete(t)}function _f(n,t,e){const r=K(n);let s=r.Ba[r.currentUser.toKey()];if(s){const i=s.get(t);i&&(e?i.reject(e):i.resolve(),s=s.remove(t)),r.Ba[r.currentUser.toKey()]=s}}function La(n,t,e=null){n.sharedClientState.removeLocalQueryTarget(t);for(const r of n.Ma.get(t))n.Fa.delete(r),e&&n.Ca.$a(r,e);n.Ma.delete(t),n.isPrimaryClient&&n.La.gr(t).forEach(r=>{n.La.containsKey(r)||wf(n,r)})}function wf(n,t){n.xa.delete(t.path.canonicalString());const e=n.Oa.get(t);e!==null&&(El(n.remoteStore,e),n.Oa=n.Oa.remove(t),n.Na.delete(e),Rl(n))}function Xu(n,t,e){for(const r of e)r instanceof pf?(n.La.addReference(r.key,t),mw(n,r)):r instanceof mf?(U("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,t),n.La.containsKey(r.key)||wf(n,r.key)):Y()}function mw(n,t){const e=t.key,r=e.path.canonicalString();n.Oa.get(e)||n.xa.has(r)||(U("SyncEngine","New document in limbo: "+e),n.xa.add(r),Rl(n))}function Rl(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const t=n.xa.values().next().value;n.xa.delete(t);const e=new q(pt.fromString(t)),r=n.qa.next();n.Na.set(r,new sw(e)),n.Oa=n.Oa.insert(e,r),sf(n.remoteStore,new _n(Me(hl(e.path)),r,"TargetPurposeLimboResolution",ol.oe))}}async function Ws(n,t,e){const r=K(n),s=[],i=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((l,c)=>{a.push(r.Ka(c,t,e).then(d=>{var f;if((d||e)&&r.isPrimaryClient){const m=d?!d.fromCache:(f=e==null?void 0:e.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){s.push(d);const m=wl.Wi(c.targetId,d);i.push(m)}}))}),await Promise.all(a),r.Ca.d_(s),await async function(c,d){const f=K(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>L.forEach(d,v=>L.forEach(v.$i,E=>f.persistence.referenceDelegate.addReference(m,v.targetId,E)).next(()=>L.forEach(v.Ui,E=>f.persistence.referenceDelegate.removeReference(m,v.targetId,E)))))}catch(m){if(!$s(m))throw m;U("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const v=m.targetId;if(!m.fromCache){const E=f.os.get(v),T=E.snapshotVersion,x=E.withLastLimboFreeSnapshotVersion(T);f.os=f.os.insert(v,x)}}}(r.localStore,i))}async function gw(n,t){const e=K(n);if(!e.currentUser.isEqual(t)){U("SyncEngine","User change. New user:",t.toKey());const r=await tf(e.localStore,t);e.currentUser=t,function(i,a){i.ka.forEach(l=>{l.forEach(c=>{c.reject(new z(M.CANCELLED,a))})}),i.ka.clear()}(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await Ws(e,r.hs)}}function yw(n,t){const e=K(n),r=e.Na.get(t);if(r&&r.va)return tt().add(r.key);{let s=tt();const i=e.Ma.get(t);if(!i)return s;for(const a of i){const l=e.Fa.get(a);s=s.unionWith(l.view.Va)}return s}}function Ef(n){const t=K(n);return t.remoteStore.remoteSyncer.applyRemoteEvent=yf.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=yw.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=hw.bind(null,t),t.Ca.d_=tw.bind(null,t.eventManager),t.Ca.$a=ew.bind(null,t.eventManager),t}function vw(n){const t=K(n);return t.remoteStore.remoteSyncer.applySuccessfulWrite=fw.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=pw.bind(null,t),t}class Ji{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=fo(t.databaseInfo.databaseId),this.sharedClientState=this.Wa(t),this.persistence=this.Ga(t),await this.persistence.start(),this.localStore=this.za(t),this.gcScheduler=this.ja(t,this.localStore),this.indexBackfillerScheduler=this.Ha(t,this.localStore)}ja(t,e){return null}Ha(t,e){return null}za(t){return I_(this.persistence,new b_,t.initialUser,this.serializer)}Ga(t){return new __(_l.Zr,this.serializer)}Wa(t){return new k_}async terminate(){var t,e;(t=this.gcScheduler)===null||t===void 0||t.stop(),(e=this.indexBackfillerScheduler)===null||e===void 0||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ji.provider={build:()=>new Ji};class Va{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Ju(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=gw.bind(null,this.syncEngine),await J_(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new Z_}()}createDatastore(t){const e=fo(t.databaseInfo.databaseId),r=function(i){return new L_(i)}(t.databaseInfo);return function(i,a,l,c){return new B_(i,a,l,c)}(t.authCredentials,t.appCheckCredentials,r,e)}createRemoteStore(t){return function(r,s,i,a,l){return new z_(r,s,i,a,l)}(this.localStore,this.datastore,t.asyncQueue,e=>Ju(this.syncEngine,e,0),function(){return Wu.D()?new Wu:new D_}())}createSyncEngine(t,e){return function(s,i,a,l,c,d,f){const m=new iw(s,i,a,l,c,d);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await async function(s){const i=K(s);U("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await Hs(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(t=this.datastore)===null||t===void 0||t.terminate(),(e=this.eventManager)===null||e===void 0||e.terminate()}}Va.provider={build:()=>new Va};/**
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
 */class bf{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ya(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ya(this.observer.error,t):Ze("Uncaught Error in snapshot listener:",t.toString()))}Za(){this.muted=!0}Ya(t,e){setTimeout(()=>{this.muted||t(e)},0)}}/**
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
 */class _w{constructor(t,e,r,s,i){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=r,this.databaseInfo=s,this.user=Gt.UNAUTHENTICATED,this.clientId=Eh.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,async a=>{U("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(U("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new Qe;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const r=Al(e,"Failed to shutdown persistence");t.reject(r)}}),t.promise}}async function ia(n,t){n.asyncQueue.verifyOperationInProgress(),U("FirestoreClient","Initializing OfflineComponentProvider");const e=n.configuration;await t.initialize(e);let r=e.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await tf(t.localStore,s),r=s)}),t.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=t}async function Zu(n,t){n.asyncQueue.verifyOperationInProgress();const e=await ww(n);U("FirestoreClient","Initializing OnlineComponentProvider"),await t.initialize(e,n.configuration),n.setCredentialChangeListener(r=>Yu(t.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>Yu(t.remoteStore,s)),n._onlineComponents=t}async function ww(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){U("FirestoreClient","Using user provided OfflineComponentProvider");try{await ia(n,n._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!function(s){return s.name==="FirebaseError"?s.code===M.FAILED_PRECONDITION||s.code===M.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(e))throw e;Vr("Error using user provided cache. Falling back to memory cache: "+e),await ia(n,new Ji)}}else U("FirestoreClient","Using default OfflineComponentProvider"),await ia(n,new Ji);return n._offlineComponents}async function Tf(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(U("FirestoreClient","Using user provided OnlineComponentProvider"),await Zu(n,n._uninitializedComponentsProvider._online)):(U("FirestoreClient","Using default OnlineComponentProvider"),await Zu(n,new Va))),n._onlineComponents}function Ew(n){return Tf(n).then(t=>t.syncEngine)}async function If(n){const t=await Tf(n),e=t.eventManager;return e.onListen=ow.bind(null,t.syncEngine),e.onUnlisten=cw.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=aw.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=uw.bind(null,t.syncEngine),e}function bw(n,t,e={}){const r=new Qe;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new bf({next:v=>{f.Za(),a.enqueueAndForget(()=>hf(i,m));const E=v.docs.has(l);!E&&v.fromCache?d.reject(new z(M.UNAVAILABLE,"Failed to get document because the client is offline.")):E&&v.fromCache&&c&&c.source==="server"?d.reject(new z(M.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(v)},error:v=>d.reject(v)}),m=new ff(hl(l.path),f,{includeMetadataChanges:!0,_a:!0});return df(i,m)}(await If(n),n.asyncQueue,t,e,r)),r.promise}function Tw(n,t,e={}){const r=new Qe;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new bf({next:v=>{f.Za(),a.enqueueAndForget(()=>hf(i,m)),v.fromCache&&c.source==="server"?d.reject(new z(M.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(v)},error:v=>d.reject(v)}),m=new ff(l,f,{includeMetadataChanges:!0,_a:!0});return df(i,m)}(await If(n),n.asyncQueue,t,e,r)),r.promise}/**
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
 */function Sf(n){const t={};return n.timeoutSeconds!==void 0&&(t.timeoutSeconds=n.timeoutSeconds),t}/**
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
 */const td=new Map;/**
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
 */function Af(n,t,e){if(!e)throw new z(M.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${t}.`)}function Iw(n,t,e,r){if(t===!0&&r===!0)throw new z(M.INVALID_ARGUMENT,`${n} and ${e} cannot be used together.`)}function ed(n){if(!q.isDocumentKey(n))throw new z(M.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function nd(n){if(q.isDocumentKey(n))throw new z(M.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function go(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const t=function(r){return r.constructor?r.constructor.name:null}(n);return t?`a custom ${t} object`:"an object"}}return typeof n=="function"?"a function":Y()}function en(n,t){if("_delegate"in n&&(n=n._delegate),!(n instanceof t)){if(t.name===n.constructor.name)throw new z(M.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=go(n);throw new z(M.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return n}function Sw(n,t){if(t<=0)throw new z(M.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${t}.`)}/**
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
 */class rd{constructor(t){var e,r;if(t.host===void 0){if(t.ssl!==void 0)throw new z(M.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=t.host,this.ssl=(e=t.ssl)===null||e===void 0||e;if(this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<1048576)throw new z(M.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}Iw("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Sf((r=t.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class yo{constructor(t,e,r,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new rd({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new z(M.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new z(M.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new rd(t),t.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new $v;switch(r.type){case"firstParty":return new Wv(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new z(M.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const r=td.get(e);r&&(U("ComponentProvider","Removing Datastore"),td.delete(e),r.terminate())}(this),Promise.resolve()}}function Aw(n,t,e,r={}){var s;const i=(n=en(n,yo))._getSettings(),a=`${t}:${e}`;if(i.host!=="firestore.googleapis.com"&&i.host!==a&&Vr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},i),{host:a,ssl:!1})),r.mockUserToken){let l,c;if(typeof r.mockUserToken=="string")l=r.mockUserToken,c=Gt.MOCK_USER;else{l=Jp(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new z(M.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new Gt(d)}n._authCredentials=new qv(new wh(l,c))}}/**
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
 */class Dn{constructor(t,e,r){this.converter=e,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new Dn(this.firestore,t,this._query)}}class re{constructor(t,e,r){this.converter=e,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new In(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new re(this.firestore,t,this._key)}}class In extends Dn{constructor(t,e,r){super(t,e,hl(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new re(this.firestore,null,new q(t))}withConverter(t){return new In(this.firestore,t,this._path)}}function xw(n,t,...e){if(n=It(n),Af("collection","path",t),n instanceof yo){const r=pt.fromString(t,...e);return nd(r),new In(n,null,r)}{if(!(n instanceof re||n instanceof In))throw new z(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(pt.fromString(t,...e));return nd(r),new In(n.firestore,null,r)}}function Dr(n,t,...e){if(n=It(n),arguments.length===1&&(t=Eh.newId()),Af("doc","path",t),n instanceof yo){const r=pt.fromString(t,...e);return ed(r),new re(n,null,new q(r))}{if(!(n instanceof re||n instanceof In))throw new z(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(pt.fromString(t,...e));return ed(r),new re(n.firestore,n instanceof In?n.converter:null,new q(r))}}/**
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
 */class sd{constructor(t=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new nf(this,"async_queue_retry"),this.Vu=()=>{const r=sa();r&&U("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=t;const e=sa();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.fu(),this.gu(t)}enterRestrictedMode(t){if(!this.Iu){this.Iu=!0,this.Au=t||!1;const e=sa();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.Vu)}}enqueue(t){if(this.fu(),this.Iu)return new Promise(()=>{});const e=new Qe;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Pu.push(t),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(t){if(!$s(t))throw t;U("AsyncQueue","Operation failed with retryable error: "+t)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(t){const e=this.mu.then(()=>(this.du=!0,t().catch(r=>{this.Eu=r,this.du=!1;const s=function(a){let l=a.message||"";return a.stack&&(l=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),l}(r);throw Ze("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=e,e}enqueueAfterDelay(t,e,r){this.fu(),this.Ru.indexOf(t)>-1&&(e=0);const s=Sl.createAndSchedule(this,t,e,r,i=>this.yu(i));return this.Tu.push(s),s}fu(){this.Eu&&Y()}verifyOperationInProgress(){}async wu(){let t;do t=this.mu,await t;while(t!==this.mu)}Su(t){for(const e of this.Tu)if(e.timerId===t)return!0;return!1}bu(t){return this.wu().then(()=>{this.Tu.sort((e,r)=>e.targetTimeMs-r.targetTimeMs);for(const e of this.Tu)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.wu()})}Du(t){this.Ru.push(t)}yu(t){const e=this.Tu.indexOf(t);this.Tu.splice(e,1)}}class Kr extends yo{constructor(t,e,r,s){super(t,e,r,s),this.type="firestore",this._queue=new sd,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new sd(t),this._firestoreClient=void 0,await t}}}function Rw(n,t){const e=typeof n=="object"?n:Dd(),r=typeof n=="string"?n:"(default)",s=Ya(e,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=Kp("firestore");i&&Aw(s,...i)}return s}function vo(n){if(n._terminated)throw new z(M.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Pw(n),n._firestoreClient}function Pw(n){var t,e,r;const s=n._freezeSettings(),i=function(l,c,d,f){return new i0(l,c,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Sf(f.experimentalLongPollingOptions),f.useFetchStreams)}(n._databaseId,((t=n._app)===null||t===void 0?void 0:t.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((e=s.localCache)===null||e===void 0)&&e._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new _w(n._authCredentials,n._appCheckCredentials,n._queue,i,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
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
 */class $r{constructor(t){this._byteString=t}static fromBase64String(t){try{return new $r(qt.fromBase64String(t))}catch(e){throw new z(M.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new $r(qt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}}/**
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
 */class _o{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new z(M.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ut(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
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
 */class Pl{constructor(t){this._methodName=t}}/**
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
 */class Cl{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new z(M.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new z(M.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(t){return st(this._lat,t._lat)||st(this._long,t._long)}}/**
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
 */class kl{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0}(this._values,t._values)}}/**
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
 */const Cw=/^__.*__$/;class kw{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return this.fieldMask!==null?new kn(t,this.data,this.fieldMask,e,this.fieldTransforms):new qs(t,this.data,e,this.fieldTransforms)}}class xf{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return new kn(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function Rf(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Y()}}class Dl{constructor(t,e,r,s,i,a){this.settings=t,this.databaseId=e,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(t){return new Dl(Object.assign(Object.assign({},this.settings),t),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(t){var e;const r=(e=this.path)===null||e===void 0?void 0:e.child(t),s=this.Fu({path:r,xu:!1});return s.Ou(t),s}Nu(t){var e;const r=(e=this.path)===null||e===void 0?void 0:e.child(t),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(t){return this.Fu({path:void 0,xu:!0})}Bu(t){return Xi(t,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}vu(){if(this.path)for(let t=0;t<this.path.length;t++)this.Ou(this.path.get(t))}Ou(t){if(t.length===0)throw this.Bu("Document fields must not be empty");if(Rf(this.Cu)&&Cw.test(t))throw this.Bu('Document fields cannot begin and end with "__"')}}class Dw{constructor(t,e,r){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=r||fo(t)}Qu(t,e,r,s=!1){return new Dl({Cu:t,methodName:e,qu:r,path:Ut.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function wo(n){const t=n._freezeSettings(),e=fo(n._databaseId);return new Dw(n._databaseId,!!t.ignoreUndefinedProperties,e)}function Ml(n,t,e,r,s,i={}){const a=n.Qu(i.merge||i.mergeFields?2:0,t,e,s);Nl("Data must be an object, but it was:",a,r);const l=Pf(r,a);let c,d;if(i.merge)c=new ae(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const v=Oa(t,m,e);if(!a.contains(v))throw new z(M.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);kf(f,v)||f.push(v)}c=new ae(f),d=a.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=a.fieldTransforms;return new kw(new ee(l),c,d)}class Eo extends Pl{_toFieldTransform(t){if(t.Cu!==2)throw t.Cu===1?t.Bu(`${this._methodName}() can only appear at the top level of your update data`):t.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof Eo}}function Mw(n,t,e,r){const s=n.Qu(1,t,e);Nl("Data must be an object, but it was:",s,r);const i=[],a=ee.empty();er(r,(c,d)=>{const f=Ll(t,c,e);d=It(d);const m=s.Nu(f);if(d instanceof Eo)i.push(f);else{const v=Ys(d,m);v!=null&&(i.push(f),a.set(f,v))}});const l=new ae(i);return new xf(a,l,s.fieldTransforms)}function Nw(n,t,e,r,s,i){const a=n.Qu(1,t,e),l=[Oa(t,r,e)],c=[s];if(i.length%2!=0)throw new z(M.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let v=0;v<i.length;v+=2)l.push(Oa(t,i[v])),c.push(i[v+1]);const d=[],f=ee.empty();for(let v=l.length-1;v>=0;--v)if(!kf(d,l[v])){const E=l[v];let T=c[v];T=It(T);const x=a.Nu(E);if(T instanceof Eo)d.push(E);else{const I=Ys(T,x);I!=null&&(d.push(E),f.set(E,I))}}const m=new ae(d);return new xf(f,m,a.fieldTransforms)}function Lw(n,t,e,r=!1){return Ys(e,n.Qu(r?4:3,t))}function Ys(n,t){if(Cf(n=It(n)))return Nl("Unsupported field value:",t,n),Pf(n,t);if(n instanceof Pl)return function(r,s){if(!Rf(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(n,t),null;if(n===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),n instanceof Array){if(t.settings.xu&&t.Cu!==4)throw t.Bu("Nested arrays are not supported");return function(r,s){const i=[];let a=0;for(const l of r){let c=Ys(l,s.Lu(a));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),a++}return{arrayValue:{values:i}}}(n,t)}return function(r,s){if((r=It(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return x0(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=Ct.fromDate(r);return{timestampValue:Ki(s.serializer,i)}}if(r instanceof Ct){const i=new Ct(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Ki(s.serializer,i)}}if(r instanceof Cl)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof $r)return{bytesValue:Yh(s.serializer,r._byteString)};if(r instanceof re){const i=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(i))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:yl(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof kl)return function(a,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return fl(l.serializer,c)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${go(r)}`)}(n,t)}function Pf(n,t){const e={};return bh(n)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):er(n,(r,s)=>{const i=Ys(s,t.Mu(r));i!=null&&(e[r]=i)}),{mapValue:{fields:e}}}function Cf(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Ct||n instanceof Cl||n instanceof $r||n instanceof re||n instanceof Pl||n instanceof kl)}function Nl(n,t,e){if(!Cf(e)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(e)){const r=go(e);throw r==="an object"?t.Bu(n+" a custom object"):t.Bu(n+" "+r)}}function Oa(n,t,e){if((t=It(t))instanceof _o)return t._internalPath;if(typeof t=="string")return Ll(n,t);throw Xi("Field path arguments must be of type string or ",n,!1,void 0,e)}const Vw=new RegExp("[~\\*/\\[\\]]");function Ll(n,t,e){if(t.search(Vw)>=0)throw Xi(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,e);try{return new _o(...t.split("."))._internalPath}catch{throw Xi(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,e)}}function Xi(n,t,e,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let l=`Function ${t}() called with invalid data`;e&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(i||a)&&(c+=" (found",i&&(c+=` in field ${r}`),a&&(c+=` in document ${s}`),c+=")"),new z(M.INVALID_ARGUMENT,l+n+c)}function kf(n,t){return n.some(e=>e.isEqual(t))}/**
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
 */class Df{constructor(t,e,r,s,i){this._firestore=t,this._userDataWriter=e,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new re(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new Ow(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(bo("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class Ow extends Df{data(){return super.data()}}function bo(n,t){return typeof t=="string"?Ll(n,t):t instanceof _o?t._internalPath:t._delegate._internalPath}/**
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
 */function Bw(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new z(M.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Vl{}class Ol extends Vl{}function Es(n,t,...e){let r=[];t instanceof Vl&&r.push(t),r=r.concat(e),function(i){const a=i.filter(c=>c instanceof Fl).length,l=i.filter(c=>c instanceof To).length;if(a>1||a>0&&l>0)throw new z(M.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)n=s._apply(n);return n}class To extends Ol{constructor(t,e,r){super(),this._field=t,this._op=e,this._value=r,this.type="where"}static _create(t,e,r){return new To(t,e,r)}_apply(t){const e=this._parse(t);return Mf(t._query,e),new Dn(t.firestore,t.converter,Ra(t._query,e))}_parse(t){const e=wo(t.firestore);return function(i,a,l,c,d,f,m){let v;if(d.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new z(M.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){ad(m,f);const E=[];for(const T of m)E.push(od(c,i,T));v={arrayValue:{values:E}}}else v=od(c,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||ad(m,f),v=Lw(l,a,m,f==="in"||f==="not-in");return Tt.create(d,f,v)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}function Bl(n,t,e){const r=t,s=bo("where",n);return To._create(s,r,e)}class Fl extends Vl{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new Fl(t,e)}_parse(t){const e=this._queryConstraints.map(r=>r._parse(t)).filter(r=>r.getFilters().length>0);return e.length===1?e[0]:we.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:(function(s,i){let a=s;const l=i.getFlattenedFilters();for(const c of l)Mf(a,c),a=Ra(a,c)}(t._query,e),new Dn(t.firestore,t.converter,Ra(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class zl extends Ol{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new zl(t,e)}_apply(t){const e=function(s,i,a){if(s.startAt!==null)throw new z(M.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new z(M.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ks(i,a)}(t._query,this._field,this._direction);return new Dn(t.firestore,t.converter,function(s,i){const a=s.explicitOrderBy.concat([i]);return new Wr(s.path,s.collectionGroup,a,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(t._query,e))}}function id(n,t="asc"){const e=t,r=bo("orderBy",n);return zl._create(r,e)}class Ul extends Ol{constructor(t,e,r){super(),this.type=t,this._limit=e,this._limitType=r}static _create(t,e,r){return new Ul(t,e,r)}_apply(t){return new Dn(t.firestore,t.converter,Wi(t._query,this._limit,this._limitType))}}function Fw(n){return Sw("limit",n),Ul._create("limit",n,"F")}function od(n,t,e){if(typeof(e=It(e))=="string"){if(e==="")throw new z(M.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!kh(t)&&e.indexOf("/")!==-1)throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const r=t.path.child(pt.fromString(e));if(!q.isDocumentKey(r))throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return xu(n,new q(r))}if(e instanceof re)return xu(n,e._key);throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${go(e)}.`)}function ad(n,t){if(!Array.isArray(n)||n.length===0)throw new z(M.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Mf(n,t){const e=function(s,i){for(const a of s)for(const l of a.getFlattenedFilters())if(i.indexOf(l.op)>=0)return l.op;return null}(n.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(e!==null)throw e===t.op?new z(M.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new z(M.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}class zw{convertValue(t,e="none"){switch(Zn(t)){case 0:return null;case 1:return t.booleanValue;case 2:return wt(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(Xn(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw Y()}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const r={};return er(t,(s,i)=>{r[s]=this.convertValue(i,e)}),r}convertVectorValue(t){var e,r,s;const i=(s=(r=(e=t.fields)===null||e===void 0?void 0:e.value.arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map(a=>wt(a.doubleValue));return new kl(i)}convertGeoPoint(t){return new Cl(wt(t.latitude),wt(t.longitude))}convertArray(t,e){return(t.values||[]).map(r=>this.convertValue(r,e))}convertServerTimestamp(t,e){switch(e){case"previous":const r=ll(t);return r==null?null:this.convertValue(r,e);case"estimate":return this.convertTimestamp(Rs(t));default:return null}}convertTimestamp(t){const e=Rn(t);return new Ct(e.seconds,e.nanos)}convertDocumentKey(t,e){const r=pt.fromString(t);lt(Zh(r));const s=new Ps(r.get(1),r.get(3)),i=new q(r.popFirst(5));return s.isEqual(e)||Ze(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),i}}/**
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
 */function $l(n,t,e){let r;return r=n?e&&(e.merge||e.mergeFields)?n.toFirestore(t,e):n.toFirestore(t):t,r}/**
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
 */class ms{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Nf extends Df{constructor(t,e,r,s,i,a){super(t,e,r,s,a),this._firestore=t,this._firestoreImpl=t,this.metadata=i}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Di(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const r=this._document.data.field(bo("DocumentSnapshot.get",t));if(r!==null)return this._userDataWriter.convertValue(r,e.serverTimestamps)}}}class Di extends Nf{data(t={}){return super.data(t)}}class Uw{constructor(t,e,r,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new ms(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach(r=>{t.call(e,new Di(this._firestore,this._userDataWriter,r.key,r,new ms(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new z(M.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(l=>{const c=new Di(s._firestore,s._userDataWriter,l.doc.key,l.doc,new ms(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const c=new Di(s._firestore,s._userDataWriter,l.doc.key,l.doc,new ms(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,f=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),f=a.indexOf(l.doc.key)),{type:$w(l.type),doc:c,oldIndex:d,newIndex:f}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}}function $w(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Y()}}/**
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
 */function Lf(n){n=en(n,re);const t=en(n.firestore,Kr);return bw(vo(t),n._key).then(e=>jw(t,n,e))}class Vf extends zw{constructor(t){super(),this.firestore=t}convertBytes(t){return new $r(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new re(this.firestore,null,e)}}function Io(n){n=en(n,Dn);const t=en(n.firestore,Kr),e=vo(t),r=new Vf(t);return Bw(n._query),Tw(e,n._query).then(s=>new Uw(t,r,n,s))}function ql(n,t,e){n=en(n,re);const r=en(n.firestore,Kr),s=$l(n.converter,t,e);return jl(r,[Ml(wo(r),"setDoc",n._key,s,n.converter!==null,e).toMutation(n._key,le.none())])}function qw(n,t){const e=en(n.firestore,Kr),r=Dr(n),s=$l(n.converter,t);return jl(e,[Ml(wo(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,le.exists(!1))]).then(()=>r)}function jl(n,t){return function(r,s){const i=new Qe;return r.asyncQueue.enqueueAndForget(async()=>dw(await Ew(r),s,i)),i.promise}(vo(n),t)}function jw(n,t,e){const r=e.docs.get(t._key),s=new Vf(n);return new Nf(n,s,t._key,r,new ms(e.hasPendingWrites,e.fromCache),t.converter)}/**
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
 */class Hw{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=wo(t)}set(t,e,r){this._verifyNotCommitted();const s=oa(t,this._firestore),i=$l(s.converter,e,r),a=Ml(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,le.none())),this}update(t,e,r,...s){this._verifyNotCommitted();const i=oa(t,this._firestore);let a;return a=typeof(e=It(e))=="string"||e instanceof _o?Nw(this._dataReader,"WriteBatch.update",i._key,e,r,s):Mw(this._dataReader,"WriteBatch.update",i._key,e),this._mutations.push(a.toMutation(i._key,le.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=oa(t,this._firestore);return this._mutations=this._mutations.concat(new pl(e._key,le.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new z(M.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function oa(n,t){if((n=It(n)).firestore!==t)throw new z(M.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
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
 */function Zi(n){return vo(n=en(n,Kr)),new Hw(n,t=>jl(n,t))}(function(t,e=!0){(function(s){Hr=s})(qr),Nr(new Gn("firestore",(r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),l=new Kr(new jv(r.getProvider("auth-internal")),new Gv(r.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new z(M.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ps(d.options.projectId,f)}(a,s),a);return i=Object.assign({useFetchStreams:e},i),l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),Tn(bu,"4.7.3",t),Tn(bu,"4.7.3","esm2017")})();const Of={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85",measurementId:"G-80XX542QZE"};function St(){return Of.apiKey!=="YOUR_API_KEY"}let aa=null,ce=null,ne=null;try{St()?(aa=kd(Of),ce=zv(aa),ne=Rw(aa)):console.warn("Firebase not configured. Login required to save data.")}catch(n){console.error("Firebase initialization error:",n)}const Ww=new He;let vn=null,bs=[];function Yw(){if(!St()||!ce){console.warn("Firebase not configured - auth disabled");return}Ry(ce,n=>{console.log("onAuthStateChanged fired:",n?n.email:"null"),vn=n,console.log("Notifying",bs.length,"listeners"),bs.forEach(t=>t(n))})}function Gw(n){return console.log("onAuthStateChange: adding listener, currentUser is:",vn&&vn.email),bs.push(n),vn&&(console.log("onAuthStateChange: immediately calling listener with user"),n(vn)),()=>{bs=bs.filter(t=>t!==n)}}function Gs(){return vn}function Ee(){return vn!==null}async function Kw(n,t,e=null){if(!St()||!ce)throw new Error("Firebase not configured");const r=await by(ce,n,t);return e&&r.user&&await Sy(r.user,{displayName:e}),r}async function Qw(n,t){if(!St()||!ce)throw new Error("Firebase not configured");return Ty(ce,n,t)}async function Jw(){if(!St()||!ce)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const n=await Ky(ce,Ww);return console.log("Google sign-in successful:",n.user.email),n}catch(n){throw console.error("signInWithPopup error:",n.code,n.message),n}}async function Bf(){if(!St()||!ce)throw new Error("Firebase not configured");return Py(ce)}async function Xw(n){if(!St()||!ce)throw new Error("Firebase not configured");return Ey(ce,n)}Yw();function So(n,t="settings"){const e=Gs();return!e||!ne?null:Dr(ne,"users",e.uid,n,t)}function Ao(n){const t=Gs();return!t||!ne?null:xw(ne,"users",t.uid,n)}async function Ff(){if(!St())return null;const n=So("decision");if(!n)return null;try{const t=await Lf(n);return t.exists()?t.data():null}catch(t){return console.error("Error loading decision data:",t),null}}async function Zw(n){if(!St())return;const t=So("decision");if(t)try{await ql(t,{...n,lastModified:new Date().toISOString()},{merge:!0})}catch(e){throw console.error("Error saving decision data:",e),e}}async function Hl(n={}){if(!St())return[];const t=Ao("history");if(!t)return[];try{let e=Es(t,id("date",n.sortDesc?"desc":"asc"));n.taxYear&&(e=Es(t,Bl("taxYear","==",n.taxYear),id("date",n.sortDesc?"desc":"asc"))),n.limit&&(e=Es(e,Fw(n.limit)));const r=await Io(e),s=[];return r.forEach(i=>{s.push({id:i.id,...i.data()})}),s}catch(e){return console.error("Error loading decision history:",e),[]}}async function tE(n){if(!St())return null;const t=Ao("history");if(!t)return null;try{const e=Es(t,Bl("date","==",n.date)),r=await Io(e);if(!r.empty){const i=r.docs[0].id;return await ql(Dr(ne,"users",Gs().uid,"history",i),{...n,updatedAt:new Date().toISOString()}),i}return(await qw(t,{...n,createdAt:new Date().toISOString()})).id}catch(e){throw console.error("Error adding history record:",e),e}}async function eE(n){if(!St())return;const t=Ao("history");if(t)try{const e=Es(t,Bl("date","==",n)),r=await Io(e),s=Zi(ne);r.forEach(i=>{s.delete(i.ref)}),await s.commit()}catch(e){throw console.error("Error deleting history record:",e),e}}async function nE(){if(!St())return;const n=Ao("history");if(n)try{const t=await Io(n),e=500,r=[];let s=Zi(ne),i=0;t.forEach(a=>{s.delete(a.ref),i++,i>=e&&(r.push(s),s=Zi(ne),i=0)}),i>0&&r.push(s),await Promise.all(r.map(a=>a.commit()))}catch(t){throw console.error("Error clearing history:",t),t}}async function rE(){if(!St())return null;const n=So("stress");if(!n)return null;try{const t=await Lf(n);return t.exists()?t.data():null}catch(t){return console.error("Error loading stress data:",t),null}}async function zf(n){if(!St())return;const t=So("stress");if(t)try{await ql(t,{...n,lastModified:new Date().toISOString()},{merge:!0})}catch(e){throw console.error("Error saving stress data:",e),e}}async function sE(){if(!St())return;const n=Gs();if(!(!n||!ne))try{await nE();const t=Zi(ne);t.delete(Dr(ne,"users",n.uid,"decision","settings")),t.delete(Dr(ne,"users",n.uid,"stress","settings")),t.delete(Dr(ne,"users",n.uid,"profile","settings")),await t.commit(),console.log("All user data wiped successfully")}catch(t){throw console.error("Error wiping user data:",t),t}}async function iE(){if(!St())return!1;const n=await Ff(),t=await Hl({limit:1});return n!==null||t.length>0}let Qt=null,Hn=null;const Uf=5e3;function Mi(){return{settings:{equityMin:te.EQUITY_MIN,bondMin:te.BOND_MIN,cashTarget:te.CASH_TARGET,duration:te.DURATION_YEARS,baseSalary:te.BASE_SALARY,protectionFactor:te.PROTECTION_FACTOR,recoveryBuffer:te.RECOVERY_BUFFER,consecutiveLimit:te.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function Ks(){return St()&&Ee()}function oE(){Qt=null,Hn=null}function $f(){return Qt&&Hn&&Date.now()-Hn<Uf?Qt:Mi()}async function rr(){if(Qt&&Hn&&Date.now()-Hn<Uf)return Qt;if(!Ks())return console.warn("Firebase not available - returning defaults"),Mi();try{const n=await Ff(),t=await Hl();if(n){const e={settings:n.settings||Mi().settings,taxYears:n.taxYears||{},history:t||[],lastModified:n.lastModified,checksum:n.checksum};return Qt=e,Hn=Date.now(),e}}catch(n){console.error("Error loading from Firebase:",n)}return Mi()}async function xo(n){if(!Ks())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=aE(n),await Zw({settings:n.settings,taxYears:n.taxYears,lastModified:n.lastModified,checksum:n.checksum}),Qt=n,Hn=Date.now()}catch(t){throw console.error("Error saving to Firebase:",t),new Error("Failed to save decision data")}}function aE(n){const t={settings:n.settings,taxYears:n.taxYears,historyCount:n.history.length,lastHistoryDate:n.history.length>0?n.history[n.history.length-1].date:null};return bd(t)}async function sr(){return(await rr()).settings}async function Wl(n){const t=await rr();t.settings={...t.settings,...n},await xo(t)}function Yl(){return{pa:oe.PERSONAL_ALLOWANCE,brl:oe.BASIC_RATE_LIMIT,hrl:oe.HIGHER_RATE_LIMIT,cpi:.04,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function lE(n){const e=$f().taxYears[n];return e||Yl()}async function Ro(n){const e=(await rr()).taxYears[n];return e||Yl()}async function Po(n,t){console.log(`saveTaxYearConfig: Saving tax year ${n}`,t);const e=await rr();e.taxYears[n]={...lE(n),...t},await xo(e),console.log(`saveTaxYearConfig: Saved tax year ${n}, yearSetupComplete=${e.taxYears[n].yearSetupComplete}`)}async function cE(n){const t=Qt||await rr(),e=(t.history||[]).filter(s=>s.taxYear===n),r=e.reduce((s,i)=>s+(i.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${n}, found ${e.length} records, total ISA used: ${r}`),console.log("recalculateIsaSavingsUsed: History records:",e.map(s=>({date:s.date,isa:s.isa}))),t.taxYears[n]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${n}, creating default`),t.taxYears[n]=Yl()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${t.taxYears[n].isaSavingsUsed}`),t.taxYears[n].isaSavingsUsed=r,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${t.taxYears[n].isaSavingsUsed}`),await xo(t),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),r}async function uE(n){const t=await Ro(n),e=t.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${n}, yearSetupComplete=${t.yearSetupComplete}, result=${e}`),e}async function Qs(){return(await rr()).taxYears}function dE(n={}){let e=[...$f().history];return n.taxYear&&(e=e.filter(r=>r.taxYear===n.taxYear)),n.startDate&&(e=e.filter(r=>r.date>=n.startDate)),n.endDate&&(e=e.filter(r=>r.date<=n.endDate)),n.sortDesc?e.sort((r,s)=>s.date.localeCompare(r.date)):e.sort((r,s)=>r.date.localeCompare(s.date)),n.limit&&(e=e.slice(0,n.limit)),e}async function Gl(n={}){if(Ks())try{return await Hl(n)}catch(t){console.error("Error loading history from Firebase:",t)}return dE(n)}async function hE(n){if(!Ks())throw new Error("Must be logged in to save history");if(await tE(n),Qt){const t=Qt.history.findIndex(e=>e.date===n.date);t>=0?Qt.history[t]=n:Qt.history.push(n),Qt.history.sort((e,r)=>e.date.localeCompare(r.date))}}async function qf(n){if(!Ks())throw new Error("Must be logged in to delete history");await eE(n),Qt&&(Qt.history=Qt.history.filter(t=>t.date!==n))}async function Kl(n){const t=await sr(),e=await Qs(),r=t.spStartDate,s=t.spWeeklyAmount||0;if(!r||!s){let f=null;if(r){const{formatStatePensionDate:m}=await Hc(async()=>{const{formatStatePensionDate:v}=await Promise.resolve().then(()=>ld);return{formatStatePensionDate:v}},void 0,import.meta.url);f=m(r)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:f}}const{calculateStatePensionForTaxYear:i,getTimeUntilStatePension:a,parseStatePensionDate:l}=await Hc(async()=>{const{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:v}=await Promise.resolve().then(()=>ld);return{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:v}},void 0,import.meta.url),c=i({taxYear:n,spStartDate:r,weeklyAmount:s,taxYearConfigs:e}),d=a(r);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function fE(n){const t=Rp(n);t.stdSipp=n.stdSipp||n.sippDraw,await hE(t),n.taxYear&&await cE(n.taxYear)}function Co(n,t,e=0){const r=ja(e);let s=n.equityStart,i=n.bondStart,a=n.cashStart,l=n.hodlEnabled?n.hodlStart!==void 0?n.hodlStart:n.hodlValue:0,c=0,d=null,f=0,m=0,v=0,E=0,T=!1,x=!1,I=null,P=0,D=-1;const C=[],N=[];let F=1;C.push({year:0,month:0,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:0,source:"None",inProtection:!1,equityMin:n.equityMin,bondMin:n.bondMin,cashMax:n.cashTarget});for(let V=0;V<n.years*12;V++){const b=Math.floor(V/12),g=V%12,y=g>=3?b:b-1;if(y!==D&&(P=0,D=y),V>0&&V%12===0){const it=t.inflation[b]||.025;N.push(it),F*=1+it}const w=t.equity[b]||0,S=t.inflation[b]||.025,A=b>0?t.inflation[b-1]||.025:S,_=xr(n.equityMin,b,n.duration,F,!0),ot=xr(n.bondMin,b,n.duration,F,!0),At=xr(n.cashTarget,b,n.duration,F,!1),X=mE(n,b,F,N),Et=X;let ct=T?X*n.protectionMult:X;T&&(P+=Et-ct);const xt=pE(S,w,A,r),ht=Math.max(.005,S+.012);if(s*=1+Math.pow(1+w,1/12)-1,i*=1+Math.pow(1+xt,1/12)-1,a*=1+Math.pow(1+ht,1/12)-1,l>0){const ue=(r()-.5)*2*.06;let de=0;w<-.1?de=Math.min(.15,Math.abs(w)*.4):w<-.05&&(de=Math.abs(w)*.2);let Dt=.069+ue+de;Dt=Math.max(-.08,Math.min(.18,Dt)),l*=1+Math.pow(1+Dt,1/12)-1}const yt=s+i,$=_+ot;T&&yt>$+5e3&&(T=!1,E=0,m=Math.max(m,v),v=0),T&&(f++,v++);let _t=0;if(!T&&P>0&&yt>$+15e3){let it=g>=3?15-g:3-g;it<1&&(it=1);const kt=yt-$-15e3,ue=Math.min(P/it,kt/it),de=Et*.5;_t=Math.min(ue,de),_t>50&&(ct+=_t,P-=_t)}let J="Growth";if(!T&&yt>=$+ct){const it=Math.max(0,s-_),kt=Math.max(0,i-ot),ue=it+kt;if(ue>0){if(s-=ct*it/ue,i-=ct*kt/ue,E=0,J="Growth",a<At){const de=yt-$-ct;if(de>5e3){const Dt=Math.min((At-a)*.3,de*.5);s-=Dt*it/ue,i-=Dt*kt/ue,a+=Dt}}}else a-=ct,J="Cash"}else if(a>=ct)a-=ct,E++,J="Cash",!n.disableProtection&&E>=n.consecutiveLimit&&(T=!0);else{const it=ct-a;a=0,i>it?(i-=it,J="Bond"):s>it?(s-=it,J="Equity"):l>it?(l-=it,c+=it,d===null&&(d=V),J="HODL"):(x=!0,I=V)}if(s=Math.max(0,s),i=Math.max(0,i),a=Math.max(0,a),(g===0||V===n.years*12-1||x)&&C.push({year:b+g/12,month:V,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:ct,boostAmount:_t,source:J,inProtection:T,equityMin:_,bondMin:ot,cashMax:At}),x)break}return m=Math.max(m,v),{failed:x,years:x?I/12:n.years,failMonth:I,final:s+i+a,finalEquity:s,finalBond:i,finalCash:a,finalHodl:l,protMonths:f,maxConsec:m,hodlUsed:c,hodlUsedMonth:d,hist:C,seed:e}}function pE(n,t,e,r){let s=.15,i=.3,a=.2,l=.1,c=.1,d=.15;const f=e!==void 0?e:n,m=f>.045,v=f>.07;if(m){const C=r()>.3?1:.5;v?(s=.15+.35*C,i=.3-.2*C,d=.15-.1*C,l=.1+.05*C):(s=.15+.2*C,i=.3-.1*C,d=.15-.05*C)}m&&r()<.15&&(s=.2,i=.25,d=.12);const E=n+.005+as(0,.03,r),T=.04-(n>.04?(n-.04)*.5:0)+as(0,.05,r),x=.03+n*.3+as(0,.08,r),I=n*.8+as(0,.15,r),P=Math.max(.005,n+.005),D=t*.5+as(0,.02,r);return s*E+i*T+a*x+l*I+c*P+d*D}function mE(n,t,e,r){n.taxMode==="frozen"?n.pa:n.pa*e;const s=n.taxMode==="frozen"?n.brl:n.brl*e,i=n.baseSalary*e;let a=n.other;for(const f of r)a*=1+Math.min(f,.04);let l=0;if(n.spStartYear!==void 0){if(t>=n.spStartYear&&n.spWeeklyAmount>0){const f=n.spWeeklyAmount*52;t===n.spStartYear&&n.spFirstYearRatio!==void 0?l=f*n.spFirstYearRatio*e:l=f*e}}else n.statePensionYear!==void 0&&(l=t>=n.statePensionYear?(n.statePension||0)*e:0);const c=a+l;return Math.max(0,Math.min(s,i)-c)/12}function jf(n,t=1e3){const e=Object.keys(Is).map(Number).sort((s,i)=>s-i),r=[];for(let s=0;s<t;s++){const i=ja(s*12345),a={equity:{},inflation:{}};for(let l=0;l<n.years;l++){const c=e[Math.floor(i()*e.length)];a.equity[l]=Is[c],a.inflation[l]=$a[c]||.025}r.push(Co(n,a,s))}return r}function Hf(n){const t=Object.keys(Is).map(Number).sort((s,i)=>s-i),e=Math.max(...t),r=[];for(const s of t){if(s+n.years-1>e)continue;const i={equity:{},inflation:{}};for(let l=0;l<n.years;l++)i.equity[l]=Is[s+l]||0,i.inflation[l]=$a[s+l]||.025;const a=Co(n,i,s);a.startYear=s,r.push(a)}return r}function gE(n,t){const e={equity:{},inflation:{}};for(let r=0;r<n.years;r++)e.equity[r]=t.equity[r%t.equity.length],e.inflation[r]=t.inflation[r%t.inflation.length];return Co(n,e,999)}function yE(n){const t=n.filter(e=>e.failed).length;return(n.length-t)/n.length*100}function Wf(n){const t=n.filter(l=>!l.failed),e=n.filter(l=>l.failed),r=n.map(l=>l.years).sort((l,c)=>l-c),s=t.map(l=>l.final).sort((l,c)=>l-c),i=n.map(l=>l.protMonths).sort((l,c)=>l-c),a=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:n.length,successCount:t.length,failCount:e.length,successRate:yE(n),survival:{p5:a(r,.05),p10:a(r,.1),p25:a(r,.25),p50:a(r,.5),p75:a(r,.75),p90:a(r,.9),p95:a(r,.95),min:r[0],max:r[r.length-1]},finalValue:{p5:a(s,.05),p10:a(s,.1),p25:a(s,.25),p50:a(s,.5),p75:a(s,.75),p90:a(s,.9),p95:a(s,.95),min:s[0]||0,max:s[s.length-1]||0,avg:t.reduce((l,c)=>l+c.final,0)/(t.length||1)},minYears:r[0],p10Years:a(r,.1),medianYears:a(r,.5),medianFinal:a(s,.5),p10Final:a(s,.1),p90Final:a(s,.9),avgFinal:t.reduce((l,c)=>l+c.final,0)/(t.length||1),protection:{runsWithProtection:n.filter(l=>l.protMonths>0).length,pctWithProtection:n.filter(l=>l.protMonths>0).length/n.length*100,avgMonths:i.reduce((l,c)=>l+c,0)/n.length,maxMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,p50Months:a(i,.5),p90Months:a(i,.9),p95Months:a(i,.95)},runsWithProtection:n.filter(l=>l.protMonths>0).length,avgProtMonths:i.reduce((l,c)=>l+c,0)/n.length,maxProtMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,hodl:{runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,pctUsingHodl:n.filter(l=>l.hodlUsed>0).length/n.length*100,avgUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...n.map(l=>l.hodlUsed||0))},runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,avgHodlUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...n.map(l=>l.hodlUsed||0)),failures:e.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function Js(n){if(!n)return null;const t={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},e=n.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(e)){const s=new Date(e);if(!isNaN(s.getTime()))return s}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(e)){const[s,i,a]=e.split("/").map(Number);return new Date(a,i-1,s)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(e)){const[s,i,a]=e.split("-").map(Number);return new Date(a,i-1,s)}let r=e.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(r){const s=parseInt(r[1]),i=t[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}if(r=e.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),r){const s=t[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=e.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),r){const s=t[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=e.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),r){const s=parseInt(r[1]),i=t[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}return null}function Ni(n){const t=typeof n=="string"?Js(n):n;if(!t||isNaN(t.getTime()))return"";const e=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${t.getDate()} ${e[t.getMonth()]} ${t.getFullYear()}`}function vE(n){const{taxYear:t,spStartDate:e,weeklyAmount:r,taxYearConfigs:s={}}=n;if(!e||!r||r<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const i=typeof e=="string"?Js(e):e;if(!i||isNaN(i.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const a=qa(i);kp(t);const l=Dp(t),c=[...new Set([a,t,...Object.keys(s)])].sort(),d=c.indexOf(a),f=c.indexOf(t);if(f<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:Ni(i)};let m=1;for(let x=d;x<f;x++){const I=c[x],P=s[I],D=(P==null?void 0:P.cpi)||.025;m*=1+D}const v=r*m;if(t===a){const I=Math.max(0,(l.getTime()-i.getTime())/6048e5),P=v*I;return{annual:P,monthly:P/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(I*10)/10,startDate:Ni(i)}}const T=v*52;return{annual:T,monthly:T/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:Ni(i)}}function _E(n,t=new Date){const e=typeof n=="string"?Js(n):n;if(!e||isNaN(e.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const r=e.getTime()-t.getTime(),s=r<=0;if(s)return{years:0,months:0,totalMonths:0,isPast:!0};const i=Math.floor(r/(30.44*24*60*60*1e3)),a=Math.floor(i/12),l=i%12;return{years:a,months:l,totalMonths:i,isPast:s}}const ld=Object.freeze(Object.defineProperty({__proto__:null,calculateStatePensionForTaxYear:vE,formatStatePensionDate:Ni,getTimeUntilStatePension:_E,parseStatePensionDate:Js},Symbol.toStringTag,{value:"Module"}));let wn=null,Wn=null;const Yf=5e3;function Mr(){return{settings:{equityMin:te.EQUITY_MIN,bondMin:te.BOND_MIN,cashTarget:te.CASH_TARGET,duration:te.DURATION_YEARS,baseSalary:te.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:oe.PERSONAL_ALLOWANCE,brl:oe.BASIC_RATE_LIMIT,hrl:oe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Go.PROTECTION_MULTIPLIER,consecutiveLimit:te.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Go.HODL_ENABLED,hodlValue:Go.HODL_VALUE},lastModified:null,checksum:null}}function Ql(){return St()&&Ee()}function wE(){wn=null,Wn=null}function EE(){return wn&&Wn&&Date.now()-Wn<Yf?wn:Mr()}async function Gf(){if(wn&&Wn&&Date.now()-Wn<Yf)return wn;if(!Ql())return console.warn("Firebase not available - returning defaults"),Mr();try{const n=await rE();if(n){const t={settings:n.settings||Mr().settings,lastModified:n.lastModified,checksum:n.checksum};return wn=IE(t),Wn=Date.now(),wn}}catch(n){console.error("Error loading stress data from Firebase:",n)}return Mr()}async function bE(n){if(!Ql())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=TE(n),await zf({settings:n.settings,lastModified:n.lastModified,checksum:n.checksum}),wn=n,Wn=Date.now()}catch(t){throw console.error("Error saving stress data to Firebase:",t),new Error("Failed to save stress data")}}function TE(n){return bd(n.settings)}function IE(n){const t={...Mr()};return n.settings&&(t.settings={...t.settings,...n.settings},n.settings.pacwMin!==void 0&&n.settings.equityMin===void 0&&(t.settings.equityMin=n.settings.pacwMin),n.settings.cgtMin!==void 0&&n.settings.bondMin===void 0&&(t.settings.bondMin=n.settings.cgtMin),n.settings.csh2Target!==void 0&&n.settings.cashTarget===void 0&&(t.settings.cashTarget=n.settings.csh2Target),t.settings.hodlEnabled===void 0&&(t.settings.hodlEnabled=!1),t.settings.hodlValue===void 0&&(t.settings.hodlValue=25e3)),t.lastModified=n.lastModified,t.checksum=n.checksum,t}function SE(){return EE().settings}async function Mn(){return(await Gf()).settings}async function Jl(n){const t=await Gf();t.settings={...t.settings,...n},await bE(t)}async function AE(){if(!Ql())throw new Error("Must be logged in to reset settings");const n=Mr();await zf({settings:n.settings,lastModified:new Date().toISOString()}),wE()}function xE(n){if(!n.spStartDate||!n.spWeeklyAmount)return{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const t=Js(n.spStartDate);if(!t)return console.warn("Could not parse spStartDate:",n.spStartDate),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const e=new Date,r=365.25*24*60*60*1e3,s=Math.max(0,(t.getTime()-e.getTime())/r),i=Math.floor(s),a=365,l=Math.floor((t-new Date(t.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function Xl(n={},t=null){const e=t||SE(),r=xE(e);return{equityStart:n.equityStart??e.equityMin,bondStart:n.bondStart??e.bondMin,cashStart:n.cashStart??e.cashTarget,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,years:n.years??e.duration,duration:e.duration,baseSalary:e.baseSalary,other:e.other,spStartYear:r.spStartYear,spWeeklyAmount:r.spWeeklyAmount,spFirstYearRatio:r.spFirstYearRatio,pa:e.pa,brl:e.brl,hrl:e.hrl,taxMode:e.taxMode,protectionMult:e.protectionMult,consecutiveLimit:e.consecutiveLimit,disableProtection:e.disableProtection,hodlEnabled:e.hodlEnabled,hodlValue:e.hodlValue}}function H(n,t=null){const e=Math.abs(n),r=t!==null?t:e<100,s=Math.abs(n).toLocaleString("en-GB",{minimumFractionDigits:r?2:0,maximumFractionDigits:r?2:0});return n<0?`-£${s}`:`£${s}`}function cd(n,t){const e=RE(n);t.innerHTML=e}function RE(n){var S,A,_,ot,At;const t=n,e=t.calculationDetails||{};let r="";const s=t.isTaxEfficientYear??t.taxEfficient,i=t.protectionInducedTaxEfficiency||!1,a=t.boostAmount>0;let l,c,d;if(t.inProtection?(l="warning",c="Protection Mode",d="⚡"):a?(l="boost",c="Tax Boost (Catch-up)",d="↑"):i?(l="info",c="Protection-Induced Tax Efficiency",d="↑"):s?(l="success",c="Tax-Efficient Year",d="✓"):(l="warning",c="Tax-Inefficient Year",d="!"),r+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,s&&t.yearlyIsaSavingsAllocation>0){const X=t.cumulativeIsaSavingsUsed||0,Et=t.yearlyIsaSavingsAllocation,at=Math.max(0,Et-X),ct=Et>0?X/Et*100:0;r+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(ct,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${H(X)} of ${H(Et)}</span>
        <span>Remaining: ${H(at)}</span>
      </div>
    </div>`}if(t.alerts&&t.alerts.length>0){r+='<div class="alerts">';for(const X of t.alerts){const Et=PE(X.severity);r+=`<div class="alert ${Et}">${X.message}</div>`}r+="</div>"}r+='<div class="recommendation-card">',r+="<h3>Monthly Recommendation</h3>",r+='<div class="draw-row primary">',r+='<span class="label">SIPP Withdrawal</span>',r+=`<span class="value">${H(t.sippDraw)}</span>`,r+="</div>",t.isaDraw>0&&(r+='<div class="draw-row">',r+='<span class="label">ISA Top-up</span>',r+=`<span class="value">${H(t.isaDraw)}</span>`,r+="</div>"),t.other>0&&(r+='<div class="draw-row muted">',r+='<span class="label">Other Pension</span>',r+=`<span class="value">${H(t.other)}</span>`,r+="</div>"),t.statePension>0&&(r+='<div class="draw-row muted">',r+='<span class="label">State Pension</span>',r+=`<span class="value">${H(t.statePension)}</span>`,r+="</div>"),r+='<div class="divider"></div>';const f=t.sippDraw+t.other+t.statePension,m=f*12,v=t.pa||12570,E=t.brl||50270;let T=0;m>v&&(m<=E?T=(m-v)*.2:T=(E-v)*.2+(m-E)*.4);const x=f-T/12+t.isaDraw;r+='<div class="draw-row total">',r+='<span class="label">Total Monthly Income</span>',r+=`<span class="value">${H(x)}</span>`,r+="</div>",t.boostAmount>0&&(r+='<div class="boost-indicator">',r+='<span class="boost-label">Includes Tax Boost:</span>',r+=`<span class="boost-value">+${H(t.boostAmount)}</span>`,r+="</div>"),r+="</div>",r+='<div class="source-card">',r+="<h4>Withdraw From</h4>",r+=`<div class="source-label ${t.source.toLowerCase()}">${t.source}</div>`,t.source==="Growth"&&(t.drawFromEquity>0||t.drawFromBond>0)&&(r+='<div class="source-breakdown">',t.drawFromEquity>0&&(r+=`<div class="source-item">Equity: ${H(t.drawFromEquity)}</div>`),t.drawFromBond>0&&(r+=`<div class="source-item">Bond: ${H(t.drawFromBond)}</div>`),r+="</div>"),r+="</div>",r+='<div class="fund-status">',r+="<h4>Fund Status</h4>";const I=t.equity+t.bond+t.cash,P=t.adjEquityMin+t.adjBondMin+t.adjCashTarget,D=I-P,C=P>0?D/P*100:0;r+='<div class="fund-grid">';const N=t.equity-t.adjEquityMin;r+=la("Equity",t.equity,t.adjEquityMin,N);const F=t.bond-t.adjBondMin;r+=la("Bond",t.bond,t.adjBondMin,F);const V=t.cash-t.adjCashTarget;r+=la("Cash",t.cash,t.adjCashTarget,V),r+="</div>";const b=D>=0?"healthy":"warning";r+=`<div class="overall-status ${b}">`,r+=`<span>Total Surplus: ${H(D)}</span>`,r+=`<span>(${C.toFixed(1)}% above target)</span>`,r+="</div>",r+="</div>",r+='<div class="tax-info">',r+="<h4>Tax Summary</h4>",r+='<div class="tax-thresholds">',r+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${H(t.pa)}</span></div>`,r+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${H(t.brl)}</span></div>`,e.taxInfo&&(r+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${e.taxInfo.headroomToBRL>0?"success":"warning"}">${H(e.taxInfo.headroomToBRL)}</span></div>`),r+="</div>",r+='<div class="tax-comparison">',r+='<div class="tax-comparison-header">',r+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",r+="</div>";const g=((S=e.taxInfo)==null?void 0:S.monthlyTax)||T/12,y=t.taxPaidYTD||g,w=t.taxProjectedAnnual||((A=e.taxInfo)==null?void 0:A.annualTax)||T;if(r+='<div class="tax-comparison-row">',r+='<div class="label">Tax Paid</div>',r+=`<div>${H(g)}</div>`,r+=`<div>${H(y)}</div>`,r+=`<div>${H(w)}</div>`,r+="</div>",s||((_=e.taxInfo)==null?void 0:_.taxSavedAnnual)>0){const X=t.taxSavedMonthly||((ot=e.taxInfo)==null?void 0:ot.taxSavedMonthly)||0,Et=t.taxSavedYTD||X,at=t.taxSavedProjectedAnnual||((At=e.taxInfo)==null?void 0:At.taxSavedAnnual)||0;at>0&&(r+='<div class="tax-comparison-row saved">',r+='<div class="label">Tax Saved</div>',r+=`<div class="success">-${H(X)}</div>`,r+=`<div class="success">-${H(Et)}</div>`,r+=`<div class="success">-${H(at)}</div>`,r+="</div>")}if(r+="</div>",e.taxInfo&&typeof e.taxInfo.effectiveRate=="number"&&!isNaN(e.taxInfo.effectiveRate)){const X=e.taxInfo.effectiveRate*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${X<=20?"success":X<=40?"warning":"danger"}">${X.toFixed(1)}%</span>
    </div>`}else if(e.taxInfo&&e.taxInfo.annualTaxable>0&&e.taxInfo.annualTax>=0){const X=e.taxInfo.annualTax/e.taxInfo.annualTaxable*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${X<=20?"success":X<=40?"warning":"danger"}">${X.toFixed(1)}%</span>
    </div>`}if(r+="</div>",t.rebalanceNeeded&&t.rebalanceActions.length>0){r+='<div class="rebalance-card">',r+="<h4>Rebalancing Suggestions</h4>",r+="<ul>";for(const X of t.rebalanceActions)r+=`<li>${X}</li>`;r+="</ul>",r+="</div>"}return r+='<div class="mode-explanation">',r+="<h4>Why This Recommendation?</h4>",r+=`<p>${e.reason||"Standard calculation based on your settings."}</p>`,!e.hasSufficientIsa&&e.isaNeededMonthly>0&&(r+=`<p class="isa-warning">To enable tax-efficient mode, you need ${H(e.totalIsaNeeded)} in your ISA (${t.remainingMonths} months remaining in tax year).</p>`),r+="</div>",r+='<details class="debug-section">',r+="<summary>Calculation Details</summary>",r+="<pre>"+JSON.stringify(e,null,2)+"</pre>",r+="</details>",r}function la(n,t,e,r){return`<div class="fund-cell ${r>=0?"healthy":"deficit"}">
    <div class="fund-name">${n}</div>
    <div class="fund-current">${H(t)}</div>
    <div class="fund-min">Min: ${H(e)}</div>
    <div class="fund-surplus">${r>=0?"+":""}${H(r)}</div>
  </div>`}function PE(n){switch(n){case vi.DANGER:return"alert-danger";case vi.WARNING:return"alert-warning";case vi.SUCCESS:return"alert-success";case vi.INFO:default:return"alert-info"}}function CE(){return`
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
  `}async function kE(n){const t=Ed(n),e=qa(t),r=t.getMonth()+1;return await uE(e)?{showWizard:!1,taxYear:e,isApril:r===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:e,isApril:r===4,reason:`Tax year ${e} has not been set up`}}function DE(n,t){return n*(1+t)}function ME(n){const{targetAnnualGross:t,brl:e,pa:r=12570,remainingMonths:s,grossIncomeToDate:i=0}=n,a=T=>T<=r?0:T<=e?(T-r)*.2:(e-r)*.2+(T-e)*.4,l=Math.max(0,e-i);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:e,reducedSalaryOption:e,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(t<=e)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:e,reducedSalaryOption:e,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=a(t),d=t-c,f=a(e),m=e-f,v=Math.max(0,d-m),E=v/12*s;return{isaNeeded:E,isaNeededAnnual:v,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:e,reducedSalaryOption:e,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:f,reason:`Need £${Math.round(E).toLocaleString()} ISA/Savings for tax efficiency`}}function NE(n,t,e){return e?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:n>=t?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:t-n,options:[{key:"increase",label:`Increase ISA to £${Math.round(t).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function LE(n){const t=Ed(n),e=qa(t),s=t.getMonth()+1===4,i=Np(t),a=await sr(),l=await Ro(e),c=await Qs(),d=Object.keys(c).sort(),f=d.indexOf(e)-1,m=f>=0?c[d[f]]:null,v=await Kl(e),E=(m==null?void 0:m.cpi)||.025,T=DE(a.baseSalary,E);return{taxYear:e,selectedMonth:n,isApril:s,remainingMonths:i,baseSalary:a.baseSalary,suggestedSalary:T,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:E,other:(m==null?void 0:m.other)||0},statePension:v,existingConfig:l.yearSetupComplete?l:null}}function Kf(n){const{targetSalary:t,brl:e,pa:r=12570,other:s=0,statePension:i=0,isaSavingsAllocation:a=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=n,f=A=>A<=r?0:A<=e?(A-r)*.2:(e-r)*.2+(A-e)*.4,m=s/12,v=i/12,E=m+v;let T,x;if(!d)T=t/12-E,x=0;else{const A=Math.max(0,e-c),_=Math.max(0,A/l-E);T=Math.min(t/12-E,_),x=a/l}const I=(T+E)*12,D=f(I)/12,C=T+E,N=C>0?D/C:0,F=T*N,V=m*N,b=v*N,g=T-F,y=m-V,w=v-b,S=g+y+w+x;return{sipp:{gross:T,tax:F,net:g},other:{gross:m,tax:V,net:y},statePension:{gross:v,tax:b,net:w},isa:{gross:x,tax:0,net:x},totalGross:T+m+v+x,totalTax:D,totalNet:S,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:T,monthlyIsa:x,monthlyOther:m,monthlyStatePension:v,monthlyTotal:S}}function VE(n){var x,I,P,D,C,N,F,V,b,g,y;const{pa:t,brl:e,hrl:r,cpi:s,other:i,isaSavingsAllocation:a,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:f,confirmedSalary:m,remainingMonths:v,statePension:E,monthlyBreakdown:T}=n;return{pa:t,brl:e,hrl:r,cpi:s,other:i,isaSavingsAllocation:l?a:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:f||4,remainingMonths:v||12,yearSetupComplete:!0,confirmedSalary:m,statePension:E||0,expectedMonthly:T?{sipp:{gross:((x=T.sipp)==null?void 0:x.gross)||0,tax:((I=T.sipp)==null?void 0:I.tax)||0,net:((P=T.sipp)==null?void 0:P.net)||0},other:{gross:((D=T.other)==null?void 0:D.gross)||0,tax:((C=T.other)==null?void 0:C.tax)||0,net:((N=T.other)==null?void 0:N.net)||0},statePension:{gross:((F=T.statePension)==null?void 0:F.gross)||0,tax:((V=T.statePension)==null?void 0:V.tax)||0,net:((b=T.statePension)==null?void 0:b.net)||0},isa:{gross:((g=T.isa)==null?void 0:g.gross)||0,tax:0,net:((y=T.isa)==null?void 0:y.net)||0},totalGross:T.totalGross||0,totalTax:T.totalTax||0,totalNet:T.totalNet||0}:null}}let Yn=null,Ns=null,pe=1,Q=null,B={};async function OE(n,t,e){Yn=n,Ns=e,pe=1,B={},Q=await LE(t),B={pa:Q.defaults.pa,brl:Q.defaults.brl,hrl:Q.defaults.hrl,cpi:Q.defaults.cpi,other:Q.defaults.other,grossIncomeToDate:0,confirmedSalary:Q.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},Ts()}async function BE(n){return await kE(n)}function Ts(){if(!Yn||!Q)return;const n=Q.isApril?6:7;Yn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${Q.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${Q.isApril?"Setting up for the full tax year":`Starting in ${Zl(Q.selectedMonth)} - ${Q.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${UE(n,pe)}
        </div>

        ${FE()}
      </div>
    </div>
  `,$E()}function FE(){if(Q.isApril,Q.isApril)switch(pe){case 1:return ud();case 2:return dd();case 3:return hd();case 4:return fd();case 5:return pd();case 6:return md();default:return""}else switch(pe){case 1:return ud();case 2:return zE();case 3:return dd();case 4:return hd();case 5:return fd();case 6:return pd();case 7:return md();default:return""}}function ud(){return`
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
            <input type="number" id="wizPA" value="${B.pa}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Basic Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBRL" value="${B.brl}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Higher Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizHRL" value="${B.hrl}">
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
  `}function zE(){const n=Zl(Q.selectedMonth),t=WE(Q.selectedMonth);return`
    <div class="wizard-step">
      <div class="wizard-step-title">Income Before Starting Pension</div>
      <div class="wizard-step-desc">
        You're starting your pension drawdown in ${n}. Enter any taxable income you've already received this tax year (April to ${t}).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizIncomeToDate" value="${B.grossIncomeToDate}" placeholder="0">
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
  `}function dd(){const n=B.cpi!==void 0?B.cpi:Q.defaults.cpi,t=(n*100).toFixed(1),e=Q.baseSalary,r=Math.round(e*(1+n));return`
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
        <input type="number" id="wizSalary" value="${Math.round(B.confirmedSalary||r)}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function hd(){const n=Q.statePension,t=n.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(n.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${n.yearsUntil} years until state pension</span>`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Other Taxable Income</div>
      <div class="wizard-step-desc">
        Enter any other taxable income you'll receive this tax year (annual amount).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizOther" value="${B.other}">
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
  `}function fd(){Xs();const n=ME({targetAnnualGross:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:Q.statePension.amount,remainingMonths:Q.remainingMonths,grossIncomeToDate:B.grossIncomeToDate});return B._isaCalc=n,n.brlExhausted?`
      <div class="wizard-step">
        <div class="wizard-step-title">BRL Already Exhausted</div>

        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2); border: 1px solid var(--danger);">
          <p style="color: var(--danger); font-weight: 500;">
            Your income to date (£${B.grossIncomeToDate.toLocaleString()}) has already exceeded the BRL (£${B.brl.toLocaleString()}).
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
            Your target salary of £${Math.round(B.confirmedSalary).toLocaleString()} is achievable within the BRL.
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
          This keeps your SIPP draw at the BRL (£${B.brl.toLocaleString()}) while reaching your target salary.
        </p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        How much ISA/Savings can you allocate this tax year?
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizISA" value="${B.isaSavingsAllocation||Math.round(n.isaNeeded)}">
      </div>

      <div class="wizard-example">
        <strong>Tip:</strong> This is money you'll withdraw tax-free from ISA or savings to supplement your SIPP income.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function pd(){Xs();const n=B._isaCalc,t=NE(B.isaSavingsAllocation,(n==null?void 0:n.isaNeeded)||0,(n==null?void 0:n.brlExhausted)||!1);if(t.sufficient&&!t.isBrlExhausted)return B.isTaxEfficient=!0,B.taxEfficiencyChoice="efficient",setTimeout(()=>{pe++,Ts()},0),`
      <div class="wizard-step">
        <div class="wizard-step-title">Setting Up Tax Efficiency...</div>
        <div class="wizard-info-box">
          <p>Your ISA allocation is sufficient for tax efficiency.</p>
        </div>
      </div>
    `;const e=t.shortfall>0?`You entered £${B.isaSavingsAllocation.toLocaleString()} but need £${Math.round(n.isaNeeded).toLocaleString()}.`:"";return`
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
            <input type="radio" name="taxChoice" value="increase" ${B.taxEfficiencyChoice==="increase"?"checked":""}>
            <div class="wizard-option-content">
              <strong>Increase ISA to £${Math.round(n.isaNeeded).toLocaleString()}</strong>
              <p>Provide enough ISA/Savings for tax efficiency</p>
            </div>
          </label>
        `}

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="reduced" ${B.taxEfficiencyChoice==="reduced"?"checked":""}>
          <div class="wizard-option-content">
            <strong>Reduce salary to BRL (£${B.brl.toLocaleString()})</strong>
            <p>Keep ISA/Savings to grow, accept lower income this year</p>
          </div>
        </label>

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="inefficient" ${B.taxEfficiencyChoice==="inefficient"?"checked":""}>
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
  `}function md(){Xs();const n=Kf({targetSalary:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:Q.statePension.amount,isaSavingsAllocation:B.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:B.grossIncomeToDate,isTaxEfficient:B.isTaxEfficient}),t=B.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",e=B.isTaxEfficient?"success":"warning",r=s=>`£${Math.round(s).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${Q.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${Zl(Q.selectedMonth)}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Remaining Months:</span>
          <span>${Q.remainingMonths}</span>
        </div>
        ${B.grossIncomeToDate>0?`
          <div class="wizard-summary-row">
            <span>Income to Date:</span>
            <span>${r(B.grossIncomeToDate)}</span>
          </div>
        `:""}
        <div class="wizard-summary-row">
          <span>Target Salary:</span>
          <span>${r(B.confirmedSalary)}/year</span>
        </div>
        <div class="wizard-summary-row">
          <span>Tax Mode:</span>
          <span class="${e}">${t}</span>
        </div>
        <div class="wizard-summary-row">
          <span>ISA Allocation:</span>
          <span>${r(B.isaSavingsAllocation)}</span>
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
  `}function UE(n,t){let e="";for(let r=1;r<=n;r++){const s=r<t?"done":r===t?"active":"";e+=`<div class="wizard-dot ${s}"></div>`}return e}function $E(){Yn.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",()=>qE(t.dataset.action))}),window._updateWizardSalary=function(){const t=document.getElementById("wizCPI"),e=document.getElementById("wizSalary"),r=document.getElementById("cpiDisplay"),s=document.getElementById("suggestedSalaryDisplay");if(t&&e&&r&&s){const i=parseFloat(t.value)||0,a=i/100,l=Q.baseSalary,c=Math.round(l*(1+a));r.textContent=i.toFixed(1),s.textContent=c.toLocaleString(),e.value=c,B.cpi=a,B.confirmedSalary=c}}}function qE(n){Xs();const t=Q.isApril?6:7;switch(n){case"cancel":Qf(),Ns&&Ns({completed:!1,cancelled:!0});break;case"next":pe<t&&(pe++,Ts());break;case"back":pe>1&&(pe--,Ts());break;case"apply-choice":jE(),pe++,Ts();break;case"finish":HE();break}}function jE(){var t;const n=(t=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:t.value;switch(B.taxEfficiencyChoice=n,n){case"increase":B.isaSavingsAllocation=B._isaCalc.isaNeeded,B.isTaxEfficient=!0;break;case"reduced":B.confirmedSalary=B.brl,B.isaSavingsAllocation=0,B.isTaxEfficient=!0;break;case"inefficient":B.isaSavingsAllocation=0,B.isTaxEfficient=!1;break}}function Xs(){const n=document.getElementById("wizPA");n&&(B.pa=parseFloat(n.value)||12570);const t=document.getElementById("wizBRL");t&&(B.brl=parseFloat(t.value)||50270);const e=document.getElementById("wizHRL");e&&(B.hrl=parseFloat(e.value)||125140);const r=document.getElementById("wizCPI");r&&(B.cpi=(parseFloat(r.value)||4)/100);const s=document.getElementById("wizSalary");s&&(B.confirmedSalary=parseFloat(s.value)||3e4);const i=document.getElementById("wizOther");i&&(B.other=parseFloat(i.value)||0);const a=document.getElementById("wizISA");a&&(B.isaSavingsAllocation=parseFloat(a.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(B.grossIncomeToDate=parseFloat(l.value)||0)}async function HE(){Xs();const n=Kf({targetSalary:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:Q.statePension.amount,isaSavingsAllocation:B.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:B.grossIncomeToDate,isTaxEfficient:B.isTaxEfficient}),t=VE({pa:B.pa,brl:B.brl,hrl:B.hrl,cpi:B.cpi,other:B.other,isaSavingsAllocation:B.isaSavingsAllocation,isTaxEfficient:B.isTaxEfficient,taxEfficiencyChoice:B.taxEfficiencyChoice,grossIncomeToDate:B.grossIncomeToDate,startMonth:parseInt(Q.selectedMonth.split("-")[1]),confirmedSalary:B.confirmedSalary,remainingMonths:Q.remainingMonths,statePension:Q.statePension.amount,monthlyBreakdown:n});console.log(`Tax Year Wizard: Saving config for ${Q.taxYear}`,t);try{await Po(Q.taxYear,t),console.log(`Tax Year Wizard: Successfully saved config for ${Q.taxYear}`)}catch(e){console.error(`Tax Year Wizard: Failed to save config for ${Q.taxYear}`,e),alert(`Error saving tax year configuration: ${e.message}`);return}Qf(),Ns&&Ns({completed:!0,taxYear:Q.taxYear,config:t,wizardInputs:B})}function Qf(){Yn&&(Yn.innerHTML="",Yn.style.display="none")}function Zl(n){const[t,e]=n.split("-").map(Number);return new Date(t,e-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function WE(n){const[t,e]=n.split("-").map(Number);return new Date(t,e-2,1).toLocaleString("default",{month:"long"})}function YE(){return`
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
  `}function GE(n={},t=null){const e=Xl(n,t),r=jf(e),s=Wf(r);return{results:r,stats:s,config:e}}function KE(n={},t=null){const e=Xl(n,t),r=Hf(e),s=Wf(r);return{results:r,stats:s,config:e}}function QE(n={}){const t=Xl(n),e={};for(const[r,s]of Object.entries(Pp))e[r]={...s,result:gE(t,s)};return e}let Le=null,ca=null,Ir=!1;function JE(n,t){console.log("initAuthScreen: initializing"),Le=n,ca=t,Ir=!1,Gw(e=>{console.log("AuthScreen: auth state change received:",e?e.email:"null","processed:",Ir),e&&ca&&!Ir?(console.log("AuthScreen: calling onAuthSuccessCallback"),Ir=!0,ca(e)):e?console.log("AuthScreen: skipping callback, already processed or no callback"):(Ir=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),Jf(),console.log("initAuthScreen: complete")}function Jf(){if(Le){if(!St()){Le.innerHTML=`
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
    `;return}Le.innerHTML=`
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
  `,XE()}}function XE(){const n=Le.querySelectorAll(".auth-screen-tab");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const a=document.getElementById("signinForm"),l=document.getElementById("signupForm");i.dataset.tab==="signin"?(a.style.display="block",l.style.display="none"):(a.style.display="none",l.style.display="block"),Zs()})}),document.getElementById("signinForm").addEventListener("submit",ZE),document.getElementById("signupForm").addEventListener("submit",tb),document.getElementById("forgotPasswordBtn").addEventListener("click",eb),document.getElementById("googleSigninBtn").addEventListener("click",nb)}function Sn(n){const t=document.getElementById("authScreenError");t&&(t.textContent=n,t.style.display="block")}function Zs(){const n=document.getElementById("authScreenError");n&&(n.style.display="none")}async function ZE(n){n.preventDefault(),Zs();const t=document.getElementById("signinEmail").value.trim(),e=document.getElementById("signinPassword").value;if(!t||!e){Sn("Please enter email and password");return}try{await Qw(t,e)}catch(r){console.error("Sign in error:",r),Sn(ko(r.code))}}async function tb(n){n.preventDefault(),Zs();const t=document.getElementById("signupName").value.trim(),e=document.getElementById("signupEmail").value.trim(),r=document.getElementById("signupPassword").value;if(!t||!e||!r){Sn("Please fill in all fields");return}if(r.length<6){Sn("Password must be at least 6 characters");return}try{await Kw(e,r,t)}catch(s){console.error("Sign up error:",s),Sn(ko(s.code))}}async function eb(){Zs();const n=document.getElementById("signinEmail").value.trim();if(!n){Sn("Please enter your email address first");return}try{await Xw(n),alert("Password reset email sent. Check your inbox.")}catch(t){console.error("Reset password error:",t),Sn(ko(t.code))}}async function nb(){Zs();try{await Jw()}catch(n){console.error("Google sign in error:",n),Sn(ko(n.code))}}function ko(n){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[n]||"An error occurred. Please try again."}function Ba(){console.log("hideAuthScreen: hiding auth screen, element=",!!Le),Le&&(Le.style.display="none",console.log("hideAuthScreen: set display to none"))}function Xf(){Ir=!1,Le&&(Le.style.display="block",Jf())}function rb(){return`
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
  `}let Cn=null,Fa=null,j={introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35},Pe="intro",Vt=1;function sb(){Pe="intro",Vt=1,j={introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35}}function za(n,t){Cn=n,Fa=t,sb(),pn()}function pn(){Cn&&(Pe==="intro"?ib():Pe==="stress"?lb():Pe==="decision"&&ub())}function ib(){Cn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">A tool to help you plan and manage your SIPP pension drawdown</div>

        <div class="wizard-progress">
          ${tc(2,Vt)}
        </div>

        ${Vt===1?ob():ab()}
      </div>
    </div>
  `,ec()}function ob(){return`
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
  `}function ab(){return`
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
  `}function lb(){Cn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${tc(6,Vt)}
        </div>

        ${cb(Vt)}
      </div>
    </div>
  `,ec()}function cb(n){switch(n){case 1:return`
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
      `;default:return""}}function ub(){Cn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${tc(4,Vt)}
        </div>

        ${db(Vt)}
      </div>
    </div>
  `,ec()}function db(n){switch(n){case 1:return`
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
      `;default:return""}}function tc(n,t){let e="";for(let r=1;r<=n;r++){const s=r<t?"done":r===t?"active":"";e+=`<div class="wizard-dot ${s}"></div>`}return e}function ec(){Cn.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",()=>hb(t.dataset.action))})}function hb(n){switch(Zf(),n){case"skip-all":ua();break;case"next":Pe==="intro"?Vt<2&&(Vt++,pn()):Pe==="stress"?Vt<6&&(Vt++,pn()):Pe==="decision"&&Vt<4&&(Vt++,pn());break;case"back":Vt>1&&(Vt--,pn());break;case"start-stress":Pe="stress",Vt=1,pn();break;case"skip-stress":Pe="decision",Vt=1,j.decisionSalary=j.baseSalary,j.decisionEquity=j.equityMin,j.decisionBond=j.bondMin,j.decisionCash=j.cashTarget,j.decisionDuration=j.duration,pn();break;case"finish-stress":Pe="decision",Vt=1,j.decisionSalary=j.baseSalary,j.decisionEquity=j.equityMin,j.decisionBond=j.bondMin,j.decisionCash=j.cashTarget,j.decisionDuration=j.duration,pn();break;case"skip-decision":ua();break;case"finish":ua();break}}function Zf(){const n=document.getElementById("wizBaseSalary");n&&(j.baseSalary=parseFloat(n.value)||3e4);const t=document.getElementById("wizOther");t&&(j.otherIncome=parseFloat(t.value)||0);const e=document.getElementById("wizSpStartDate");e&&(j.spStartDate=e.value.trim()||"");const r=document.getElementById("wizSpWeeklyAmount");r&&(j.spWeeklyAmount=parseFloat(r.value)||0);const s=document.getElementById("wizEquityMin");s&&(j.equityMin=parseFloat(s.value)||25e4);const i=document.getElementById("wizBondMin");i&&(j.bondMin=parseFloat(i.value)||2e5);const a=document.getElementById("wizCashTarget");a&&(j.cashTarget=parseFloat(a.value)||5e4);const l=document.getElementById("wizDuration");l&&(j.duration=parseInt(l.value)||35);const c=document.getElementById("wizTaxMode");c&&(j.taxMode=c.value);const d=document.getElementById("wizDBaseSalary");d&&(j.decisionSalary=parseFloat(d.value)||3e4);const f=document.getElementById("wizDEquityMin");f&&(j.decisionEquity=parseFloat(f.value)||25e4);const m=document.getElementById("wizDBondMin");m&&(j.decisionBond=parseFloat(m.value)||2e5);const v=document.getElementById("wizDCashTarget");v&&(j.decisionCash=parseFloat(v.value)||5e4);const E=document.getElementById("wizDDuration");E&&(j.decisionDuration=parseInt(E.value)||35)}function ua(){Zf(),Fa&&Fa(j)}function fb(){Cn&&(Cn.style.display="none")}function pb(){return`
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
  `}function Do(){const t=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:t?"rgba(15,15,26,1)":"#ffffff",text:t?"#c9d1d9":"#1f2937",cardBg:t?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}const tr=new Map;let _r=-1;function gd(n,t,e,r,s,i){const a=s-e,l=i-r,c=a*a+l*l;if(c===0)return Math.sqrt((n-e)*(n-e)+(t-r)*(t-r));const d=Math.max(0,Math.min(1,((n-e)*a+(t-r)*l)/c)),f=e+d*a,m=r+d*l;return Math.sqrt((n-f)*(n-f)+(t-m)*(t-m))}function mb(n,t,e={}){const r=Do(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:20,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=e.years||35,m={};for(let I=0;I<=f;I++)m[I]=[];t.forEach(I=>{I.hist.forEach(P=>{const D=Math.floor(P.year);m[D]!==void 0&&m[D].push(P.total)})});const v=[];for(let I=0;I<=f;I++){const P=m[I].sort((C,N)=>C-N);if(P.length===0)continue;const D=C=>P[Math.floor(P.length*C)]||0;v.push({year:I,p5:D(.05),p10:D(.1),p25:D(.25),p50:D(.5),p75:D(.75),p90:D(.9),p95:D(.95)})}if(v.length===0)return;const E=Math.max(...v.map(I=>I.p90))*1.15,T=I=>l.left+I/f*c,x=I=>a-l.bottom-I/E*d;s.strokeStyle=r.grid,s.lineWidth=1;for(let I=0;I<=5;I++){const P=l.top+I/5*d;s.beginPath(),s.moveTo(l.left,P),s.lineTo(i-l.right,P),s.stroke()}s.fillStyle=r.cone,s.beginPath(),v.forEach((I,P)=>{const D=T(I.year);P===0?s.moveTo(D,x(I.p95)):s.lineTo(D,x(I.p95))});for(let I=v.length-1;I>=0;I--)s.lineTo(T(v[I].year),x(v[I].p5));s.closePath(),s.fill(),s.fillStyle=r.coneMid,s.beginPath(),v.forEach((I,P)=>{const D=T(I.year);P===0?s.moveTo(D,x(I.p90)):s.lineTo(D,x(I.p90))});for(let I=v.length-1;I>=0;I--)s.lineTo(T(v[I].year),x(v[I].p10));s.closePath(),s.fill(),s.fillStyle=r.coneInner,s.beginPath(),v.forEach((I,P)=>{const D=T(I.year);P===0?s.moveTo(D,x(I.p75)):s.lineTo(D,x(I.p75))});for(let I=v.length-1;I>=0;I--)s.lineTo(T(v[I].year),x(v[I].p25));s.closePath(),s.fill(),e.glide&&e.glide.length>0&&(s.strokeStyle=r.glidepath,s.lineWidth=2,s.setLineDash([6,3]),s.beginPath(),e.glide.forEach((I,P)=>{const D=T(I.year),C=x(I.min);P===0?s.moveTo(D,C):s.lineTo(D,C)}),s.stroke(),s.setLineDash([])),s.strokeStyle=r.primary,s.lineWidth=3,s.beginPath(),v.forEach((I,P)=>{const D=T(I.year),C=x(I.p50);P===0?s.moveTo(D,C):s.lineTo(D,C)}),s.stroke(),s.strokeStyle="rgba(248,81,73,0.6)",s.lineWidth=1.5,s.setLineDash([4,2]),s.beginPath(),v.forEach((I,P)=>{const D=T(I.year);P===0?s.moveTo(D,x(I.p10)):s.lineTo(D,x(I.p10))}),s.stroke(),s.setLineDash([]),s.strokeStyle=r.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(l.left,x(0)),s.lineTo(i-l.right,x(0)),s.stroke(),s.setLineDash([]),s.fillStyle=r.muted,s.font="11px sans-serif",s.textAlign="right";for(let I=0;I<=5;I++){const P=E*(1-I/5);s.fillText(fe(P),l.left-10,l.top+I/5*d+4)}s.textAlign="center";for(let I=0;I<=f;I+=5)s.fillText(`Yr ${I}`,T(I),a-l.bottom+20);tr.set(n.id,{percentiles:v,xScale:T,yScale:x,padding:l,chartWidth:c,chartHeight:d,years:f,maxValue:E,type:"cone"}),wb(n)}function gb(n,t,e={}){const r=Do(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:20,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=e.years||35,m=e.startValue||1e6,v=t.slice(0,100),E=v.filter(C=>C.failed),T=v.filter(C=>!C.failed);let x;if(E.length>0)x=m*2;else{const C=T.map(F=>F.final).sort((F,V)=>F-V),N=C[Math.floor(C.length*.5)]||m;x=Math.max(N*1.3,m*1.5)}const I=C=>l.left+C/f*c,P=C=>a-l.bottom-Math.min(C,x)/x*d;s.strokeStyle=r.grid,s.lineWidth=1;for(let C=0;C<=5;C++){const N=l.top+C/5*d;s.beginPath(),s.moveTo(l.left,N),s.lineTo(i-l.right,N),s.stroke()}s.fillStyle=r.muted,s.font="11px sans-serif",s.textAlign="right";for(let C=0;C<=5;C++){const N=x*(1-C/5);s.fillText(fe(N),l.left-10,l.top+C/5*d+4)}s.textAlign="center";for(let C=0;C<=f;C+=5)s.fillText(`Yr ${C}`,I(C),a-l.bottom+20);const D=[];e.glide&&e.glide.length>0&&(s.strokeStyle=r.glidepath,s.lineWidth=3,s.setLineDash([8,4]),s.beginPath(),e.glide.forEach((C,N)=>{const F=I(C.year),V=P(C.min);N===0?s.moveTo(F,V):s.lineTo(F,V)}),s.stroke(),s.setLineDash([])),T.forEach((C,N)=>{const F=C.hist.map(V=>({x:I(V.year),y:P(V.total)}));D.push({run:C,pts:F,failed:!1,idx:N}),s.strokeStyle=r.trajectory,s.lineWidth=.5,s.beginPath(),F.forEach((V,b)=>{b===0?s.moveTo(V.x,V.y):s.lineTo(V.x,V.y)}),s.stroke()}),E.forEach((C,N)=>{const F=C.hist.map(V=>({x:I(V.year),y:P(V.total)}));D.push({run:C,pts:F,failed:!0,idx:T.length+N}),s.strokeStyle=r.trajectoryFailed,s.lineWidth=2,s.beginPath(),F.forEach((V,b)=>{b===0?s.moveTo(V.x,V.y):s.lineTo(V.x,V.y)}),s.stroke()}),s.strokeStyle=r.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(l.left,P(0)),s.lineTo(i-l.right,P(0)),s.stroke(),s.setLineDash([]),tr.set(n.id,{results:v,paths:D,xScale:I,yScale:P,padding:l,chartWidth:c,chartHeight:d,years:f,maxValue:x,glide:e.glide,type:"trajectory"}),Eb(n,r)}function yb(n,t,e={}){const r=Do(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:30,right:20,bottom:55,left:60},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=t.map(C=>C.protMonths),m=f.length,v=Math.max(...f),E=Math.max(1,Math.ceil(v/15)),T={};f.forEach(C=>{const N=Math.floor(C/E)*E;T[N]=(T[N]||0)+1});const x=Object.keys(T).map(Number).sort((C,N)=>C-N),I=Math.max(...Object.values(T)),P=c/(x.length||1),D=[];s.strokeStyle=r.grid,s.lineWidth=1,s.fillStyle=r.muted,s.font="10px sans-serif",s.textAlign="right";for(let C=0;C<=4;C++){const N=l.top+C/4*d;s.beginPath(),s.moveTo(l.left,N),s.lineTo(i-l.right,N),s.stroke();const F=Math.round(I*(1-C/4));s.fillText(`${F} runs`,l.left-5,N+4)}x.forEach((C,N)=>{const F=T[C],V=F/I*d,b=l.left+N*P+2,g=a-l.bottom-V,y=P-4;s.fillStyle=C===0?r.success:r.warning,s.fillRect(b,g,y,V),D.push({x:b,y:g,w:y,h:V,months:C,monthsEnd:C+E-1,count:F,pct:(F/m*100).toFixed(1)})}),s.fillStyle=r.muted,s.font="10px sans-serif",s.textAlign="center",x.forEach((C,N)=>{if(N%2===0||x.length<12){const F=E>1?`${C}-${C+E-1}`:C.toString();s.fillText(F,l.left+N*P+P/2,a-l.bottom+15)}}),s.fillText("Protection Months",i/2,a-5),s.save(),s.translate(12,a/2),s.rotate(-Math.PI/2),s.textAlign="center",s.fillText("Number of Runs",0,0),s.restore(),tr.set(n.id,{bars:D,totalRuns:m,type:"histogram"}),bb(n)}function vb(n,t,e={}){const r=Do(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:180,bottom:60,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle=r.bg,s.fillRect(0,0,i,a);const f=Object.keys(t),m=e.years||35;let v=0;f.forEach(I=>{const P=t[I].result;P&&P.hist&&P.hist.forEach(D=>{D.total>v&&(v=D.total)})}),v*=1.1;const E=I=>l.left+I/m*c,T=I=>l.top+d-I/v*d;_b(s,l,c,d,m,v,e.title||"Scenario Comparison",r);const x=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];f.forEach((I,P)=>{const D=t[I].result;if(!D||!D.hist)return;s.beginPath(),s.strokeStyle=x[P%x.length],s.lineWidth=2.5,D.hist.forEach((N,F)=>{const V=E(N.year),b=T(N.total);F===0?s.moveTo(V,b):s.lineTo(V,b)}),s.stroke();const C=l.top+15+P*24;s.fillStyle=x[P%x.length],s.fillRect(i-l.right+15,C,20,4),s.font="11px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="left",s.fillText(t[I].name||I,i-l.right+40,C+5),D.final/1e3,s.fillStyle=r.muted,s.fillText(`${fe(D.final)}`,i-l.right+40,C+18)})}function _b(n,t,e,r,s,i,a,l){n.font="bold 14px system-ui, sans-serif",n.fillStyle=l.text,n.textAlign="center",n.fillText(a,t.left+e/2,t.top-20),n.strokeStyle=l.grid,n.lineWidth=1;for(let c=0;c<=5;c++){const d=t.top+r*c/5;n.beginPath(),n.moveTo(t.left,d),n.lineTo(t.left+e,d),n.stroke();const f=i*(5-c)/5;n.font="11px system-ui, sans-serif",n.fillStyle=l.muted,n.textAlign="right",n.fillText(fe(f),t.left-10,d+4)}for(let c=0;c<=s;c+=5){const d=t.left+c/s*e;n.beginPath(),n.moveTo(d,t.top),n.lineTo(d,t.top+r),n.stroke(),n.textAlign="center",n.fillText(`Y${c}`,d,t.top+r+20)}n.font="12px system-ui, sans-serif",n.textAlign="center",n.fillText("Years",t.left+e/2,t.top+r+45),n.save(),n.translate(20,t.top+r/2),n.rotate(-Math.PI/2),n.fillText("Fund Value",0,0),n.restore()}function fe(n){return n>=1e6?`£${(n/1e6).toFixed(1)}M`:n>=1e3?`£${(n/1e3).toFixed(0)}k`:`£${n.toFixed(0)}`}function wb(n,t){const e=n._coneHoverListener;e&&n.removeEventListener("mousemove",e);const r=s=>{const i=tr.get(n.id);if(!i||i.type!=="cone")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=(s.clientX-a.left)*l,{percentiles:d,padding:f,chartWidth:m,years:v}=i,E=(c-f.left)/m*v,T=Math.round(E);if(T<0||T>v){An();return}const x=d.find(P=>P.year===T);if(!x){An();return}const I=`
      <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
        <strong style="color:#f0c674;">Year ${T}</strong>
      </div>
      <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
        <span style="color:#8b8b9b;">95th percentile:</span><span>${fe(x.p95)}</span>
        <span style="color:#8b8b9b;">75th percentile:</span><span>${fe(x.p75)}</span>
        <span style="color:#8b8b9b;">Median (50th):</span><span style="color:#f0c674;font-weight:bold;">${fe(x.p50)}</span>
        <span style="color:#8b8b9b;">25th percentile:</span><span>${fe(x.p25)}</span>
        <span style="color:#8b8b9b;">10th percentile:</span><span style="color:#f85149;">${fe(x.p10)}</span>
        <span style="color:#8b8b9b;">5th percentile:</span><span>${fe(x.p5)}</span>
      </div>
    `;nc(s.clientX,s.clientY,I)};n._coneHoverListener=r,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",An)}function Eb(n,t){const e=n._trajHoverListener;e&&n.removeEventListener("mousemove",e);const r=n._trajLeaveListener;r&&n.removeEventListener("mouseleave",r);const s=a=>{const l=tr.get(n.id);if(!l||l.type!=="trajectory")return;const c=n.getBoundingClientRect(),d=n.width/c.width,f=n.height/c.height,m=(a.clientX-c.left)*d,v=(a.clientY-c.top)*f,{paths:E,padding:T,chartWidth:x,chartHeight:I}=l;if(m<T.left||m>T.left+x||v<T.top||v>T.top+I){An(),_r!==-1&&(_r=-1,da(n,l,t,null));return}let P=null,D=12*d;E.filter(N=>N.failed).forEach(N=>{for(let F=0;F<N.pts.length-1;F++){const V=gd(m,v,N.pts[F].x,N.pts[F].y,N.pts[F+1].x,N.pts[F+1].y);V<D&&(D=V,P=N)}}),P||E.filter(N=>!N.failed).forEach(N=>{for(let F=0;F<N.pts.length-1;F++){const V=gd(m,v,N.pts[F].x,N.pts[F].y,N.pts[F+1].x,N.pts[F+1].y);V<D&&(D=V,P=N)}});const C=P?P.idx:-1;if(C!==_r&&(_r=C,da(n,l,t,P)),P){const N=P.run,F=P.failed?"#f85149":"#2ea043",V=P.failed?"❌":"✅",b=P.failed?"FAILED":"SUCCESS";let g=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${F};">${V} ${b}</strong>
          <span style="float:right;color:#8b8b9b;font-size:11px;">Run #${P.idx+1}</span>
        </div>
        <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
      `;N.startYear&&(g+=`<span style="color:#8b8b9b;">Start year:</span><span>${N.startYear}</span>`),g+=`<span style="color:#8b8b9b;">Duration:</span><span>${N.years.toFixed(1)} years</span>`,g+=`<span style="color:#8b8b9b;">Final balance:</span><span>${fe(N.final)}</span>`,g+=`<span style="color:#8b8b9b;">Protection months:</span><span>${N.protMonths}</span>`,g+=`<span style="color:#8b8b9b;">Longest streak:</span><span>${N.maxConsec} months</span>`,N.hodlUsed>0&&(g+=`<span style="color:#8b8b9b;">HODL used:</span><span>${fe(N.hodlUsed)}</span>`),g+="</div>",P.failed&&N.failMonth&&(g+=`<div style="margin-top:8px;padding-top:8px;border-top:1px solid #555;color:#f0c674;">💀 Depleted at year ${(N.failMonth/12).toFixed(1)}</div>`),nc(a.clientX,a.clientY,g)}else An()},i=()=>{if(An(),_r!==-1){_r=-1;const a=tr.get(n.id);a&&da(n,a,t,null)}};n._trajHoverListener=s,n._trajLeaveListener=i,n.addEventListener("mousemove",s),n.addEventListener("mouseleave",i)}function bb(n,t){const e=n._histHoverListener;e&&n.removeEventListener("mousemove",e);const r=s=>{const i=tr.get(n.id);if(!i||i.type!=="histogram")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=n.height/a.height,d=(s.clientX-a.left)*l,f=(s.clientY-a.top)*c,{bars:m,totalRuns:v}=i;let E=null;if(m.forEach(T=>{d>=T.x&&d<=T.x+T.w&&f>=T.y&&f<=T.y+T.h&&(E=T)}),E){const T=E.months===0,x=T?"#2ea043":"#e1b12c",I=T?"🟢":"🟡",P=T?"No Protection":`${E.months}${E.monthsEnd>E.months?`-${E.monthsEnd}`:""} months`,D=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${x};">${I} ${P}</strong>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;">
          <span style="color:#8b8b9b;">Runs:</span><span>${E.count} of ${v}</span>
          <span style="color:#8b8b9b;">Percentage:</span><span>${E.pct}%</span>
        </div>
      `;nc(s.clientX,s.clientY,D)}else An()};n._histHoverListener=r,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",An)}function da(n,t,e,r){const s=n.getContext("2d"),{width:i,height:a}=n,{paths:l,xScale:c,yScale:d,padding:f,chartWidth:m,chartHeight:v,years:E,maxValue:T,glide:x}=t;s.fillStyle="rgba(15,15,26,1)",s.fillRect(f.left,f.top,m,v),s.strokeStyle=e.grid,s.lineWidth=1;for(let I=0;I<=5;I++){const P=f.top+I/5*v;s.beginPath(),s.moveTo(f.left,P),s.lineTo(i-f.right,P),s.stroke()}x&&x.length>0&&(s.strokeStyle=e.glidepath,s.lineWidth=1.5,s.setLineDash([4,2]),s.beginPath(),x.forEach((I,P)=>{const D=c(I.year),C=d(I.min);P===0?s.moveTo(D,C):s.lineTo(D,C)}),s.stroke(),s.setLineDash([])),l.forEach(I=>{if(r&&I.idx===r.idx)return;const P=r?.15:I.failed?.8:.25;s.strokeStyle=I.failed?`rgba(248,81,73,${P})`:`rgba(46,160,67,${P})`,s.lineWidth=I.failed?2:.5,s.beginPath(),I.pts.forEach((D,C)=>{C===0?s.moveTo(D.x,D.y):s.lineTo(D.x,D.y)}),s.stroke()}),r&&(s.strokeStyle=r.failed?e.trajectoryFailedHover:e.trajectoryHover,s.lineWidth=4,s.shadowColor=r.failed?e.trajectoryFailedHover:e.trajectoryHover,s.shadowBlur=8,s.beginPath(),r.pts.forEach((I,P)=>{P===0?s.moveTo(I.x,I.y):s.lineTo(I.x,I.y)}),s.stroke(),s.shadowBlur=0),s.strokeStyle=e.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(f.left,d(0)),s.lineTo(i-f.right,d(0)),s.stroke(),s.setLineDash([])}function nc(n,t,e){let r=document.getElementById("chartTooltip");r||(r=document.createElement("div"),r.id="chartTooltip",document.body.appendChild(r)),r.innerHTML=e,r.style.display="block",r.style.left=n+15+"px",r.style.top=t-10+"px"}function An(){const n=document.getElementById("chartTooltip");n&&(n.style.display="none")}function Tb(){return`
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
  `}window._simEngine={runMonteCarlo:jf,runHistorical:Hf,simulate:Co};window._constants={EQUITY_RETURNS:Is,INFLATION:$a};window._mathUtils={seededRng:ja};let Ib=null,Sb=null;const tp=document.createElement("style");tp.textContent=CE()+rb()+pb()+YE()+Tb();document.head.appendChild(tp);const rc=document.getElementById("globalLoadingOverlay"),Ab=rc.querySelector(".loading-text");function ir(n="Loading..."){Ab.textContent=n,rc.classList.add("active")}function or(){rc.classList.remove("active")}function mt(n,t="info",e=3e3){const r=document.querySelector(".toast-notification");r&&r.remove();const s=document.createElement("div");s.className=`toast-notification ${t}`,s.innerHTML=`
        <span class="toast-icon">${t==="success"?"✓":t==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${n}</span>
      `,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("show")),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},e)}document.getElementById("versionDisplay").textContent=`v${_d}`;document.getElementById("entryMonth").value=Mp();function to(n){const t=document.getElementById(n+"SpWeeklyAmount"),e=document.getElementById(n+"SpAnnualAmount");if(!t||!e)return;const r=parseFloat(t.value)||0,s=r*52;r>0?e.value="£"+s.toLocaleString("en-GB",{maximumFractionDigits:2}):e.value=""}["ds","ss"].forEach(n=>{const t=document.getElementById(n+"SpWeeklyAmount");t&&t.addEventListener("input",()=>to(n))});function xb(n){const t=parseFloat(n);return isNaN(t)?"":t.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function ep(){document.querySelectorAll('input[type="number"]').forEach(t=>{t.value,t.addEventListener("focus",function(e){setTimeout(()=>{this.select()},0)}),t.addEventListener("click",function(e){!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&this.select()})})}function np(){document.querySelectorAll('input[type="number"]').forEach(t=>{if(t.dataset.formatted)return;t.dataset.formatted="true";const e=t.closest(".input-with-unit")||t.parentElement,r=t.closest(".input-with-unit")!==null,s=document.createElement("span");s.className="number-format-overlay";const i=r?"34px":"14px";s.style.cssText=`
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
        `,getComputedStyle(e).position==="static"&&(e.style.position="relative");function a(){const l=parseFloat(t.value);!isNaN(l)&&l>=1e3&&document.activeElement!==t?(s.textContent=xb(l),s.style.display="block",t.style.color="transparent"):(s.style.display="none",t.style.color="")}t._updateOverlay=a,t.addEventListener("focus",()=>{s.style.display="none",t.style.color=""}),t.addEventListener("blur",a),t.addEventListener("input",()=>{document.activeElement===t&&(s.style.display="none",t.style.color="")}),e.appendChild(s),a()})}function Mo(){document.querySelectorAll('input[type="number"]').forEach(n=>{n._updateOverlay&&n._updateOverlay()})}setTimeout(()=>{ep(),np()},100);const Rb=new MutationObserver(n=>{let t=!1;n.forEach(e=>{e.addedNodes.forEach(r=>{var s,i;r.nodeType===1&&((s=r.matches)!=null&&s.call(r,'input[type="number"]')||(i=r.querySelector)!=null&&i.call(r,'input[type="number"]'))&&(t=!0)})}),t&&setTimeout(()=>{ep(),np()},50)});Rb.observe(document.body,{childList:!0,subtree:!0});let Ar=null;async function rp(n,t="decision"){Ba(),fb(),document.getElementById("mainApp").classList.remove("hidden"),document.getElementById("userEmail").textContent=n.email,await Qr(),await ti(),Pb(),t==="stress"&&(document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),document.querySelector('.tab[data-tab="stress"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById("stress-content").classList.add("active"))}async function Pb(){try{const n=await Mn(),t=await sr();document.getElementById("entryEquity").value=t.equityMin||25e4,document.getElementById("entryBond").value=t.bondMin||2e5,document.getElementById("entryCash").value=t.cashTarget||5e4,document.getElementById("dsEquityMin").value=t.equityMin||25e4,document.getElementById("dsBondMin").value=t.bondMin||2e5,document.getElementById("dsCashTarget").value=t.cashTarget||5e4,document.getElementById("dsDuration").value=t.duration||35,document.getElementById("dsBaseSalary").value=t.baseSalary||3e4,document.getElementById("dsSpStartDate").value=t.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=t.spWeeklyAmount||"",to("ds"),document.getElementById("dsProtectionFactor").value=t.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=t.recoveryBuffer||1e4,document.getElementById("dsConsecutiveLimit").value=t.consecutiveLimit||3,["mc","hist","scen"].forEach(e=>{const r=document.getElementById(e+"Equity"),s=document.getElementById(e+"Bond"),i=document.getElementById(e+"Cash"),a=document.getElementById(e+"Years");r&&(r.value=n.equityMin),s&&(s.value=n.bondMin),i&&(i.value=n.cashTarget),a&&(a.value=n.duration)}),document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",to("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,Mo(),console.log("All inputs initialized from stored settings")}catch(n){console.error("Error initializing inputs from settings:",n)}}async function Ua(n){console.log("Wizard completed with data:",n);try{await Wl({baseSalary:n.decisionSalary,equityMin:n.decisionEquity,bondMin:n.decisionBond,cashTarget:n.decisionCash,duration:n.decisionDuration,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount}),await Jl({baseSalary:n.baseSalary,other:n.otherIncome,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,duration:n.duration,taxMode:n.taxMode}),document.getElementById("entryEquity").value=n.decisionEquity,document.getElementById("entryBond").value=n.decisionBond,document.getElementById("entryCash").value=n.decisionCash,document.getElementById("mcEquity").value=n.equityMin,document.getElementById("mcBond").value=n.bondMin,document.getElementById("mcCash").value=n.cashTarget,document.getElementById("mcYears").value=n.duration,Mo()}catch(e){console.error("Error saving wizard settings:",e)}const t=Gs();rp(t,"stress")}JE(document.getElementById("authScreen"),async n=>{console.log("Auth success callback triggered for:",n.email);try{console.log("Checking for existing cloud data...");const t=await iE();console.log("Has cloud data:",t),t?(console.log("Existing user - showing main app"),rp(n)):(console.log("New user - showing setup wizard"),Ba(),document.getElementById("setupWizard").style.display="block",za(document.getElementById("setupWizard"),Ua))}catch(t){console.error("Error in auth callback:",t),Ba(),document.getElementById("setupWizard").style.display="block",za(document.getElementById("setupWizard"),Ua)}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{await Bf(),document.getElementById("mainApp").classList.add("hidden"),Xf()}catch(n){console.error("Logout error:",n)}});const Cb=60*60*1e3;let ha=null;function sp(){ha&&clearTimeout(ha),Ee()&&(ha=setTimeout(async()=>{if(Ee()){alert("You have been logged out due to inactivity (1 hour).");try{await Bf(),document.getElementById("mainApp").classList.add("hidden"),Xf()}catch(n){console.error("Auto-logout error:",n)}}},Cb))}const kb=["mousedown","mousemove","keydown","scroll","touchstart","click"];kb.forEach(n=>{document.addEventListener(n,()=>{sp()},{passive:!0})});sp();document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await sE(),console.log("Data wiped successfully"),oE(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden"),document.getElementById("setupWizard").style.display="block",za(document.getElementById("setupWizard"),Ua),alert("All data has been deleted. Please complete the setup wizard to start fresh.")}catch(e){console.error("Reset error:",e),alert("Error resetting data: "+e.message)}});document.querySelectorAll(".tab").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active")),document.getElementById(`${n.dataset.tab}-content`).classList.add("active"),n.dataset.tab==="history"&&await Qr(),n.dataset.tab==="taxyears"&&await ti(),n.dataset.tab==="stress"&&await sc()})});const cs=document.querySelector(".tabs"),yd=document.querySelector(".tabs-wrapper");if(cs&&yd){const n=()=>{const t=cs.scrollLeft+cs.clientWidth>=cs.scrollWidth-10;yd.classList.toggle("scrolled-end",t)};cs.addEventListener("scroll",n),n()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>t.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(t=>t.classList.add("hidden")),document.getElementById(`stress-${n.dataset.stresstab}`).classList.remove("hidden"),n.dataset.stresstab==="stresssettings"&&await sc()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>t.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(t=>t.classList.add("hidden")),document.getElementById(`decision-${n.dataset.decisiontab}`).classList.remove("hidden"),n.dataset.decisiontab==="decisionsettings"&&await op()})});function Db(n){const[t,e]=n.split("-").map(Number);return e>=4?t%100+"/"+(t+1)%100:(t-1)%100+"/"+t%100}function Mb(n){const[t,e]=n.split("-").map(Number);return Math.max(0,(e>=4?t:t-1)-2026)}function fa(n,t,e,r,s){if(s){const i=Math.max(0,1-t/e);return n*r*i}return n*r}function wr(n,t,e){return n<=t?n:n<=e?t+(n-t)*.8:t+(e-t)*.8+(n-e)*.6}async function vd(n,t,e,r){const s=await sr(),i=await Gl(),a=await Qs(),l=Db(n),c=Mb(n),[d,f]=n.split("-").map(Number);if(!a[l])throw new Error(`Tax year ${l} is not configured. Please add it in the Settings tab before calculating.`);const m=a[l],v=m.pa||12570,E=m.brl||50270,T=m.other||0,x=m.isTaxEfficient!==!1,I=m.isaSavingsAllocation||0,P=m.grossIncomeToDate||0,D=m.confirmedSalary||s.baseSalary,C=i.find(Z=>Z.date===n),N=(C==null?void 0:C.isa)||0,F=Math.max(0,(m.isaSavingsUsed||0)-N),b=(await Kl(l)).amount||0;let g=1;for(let Z=0;Z<c;Z++){const Lt=String((26+Z)%100).padStart(2,"0")+"/"+String((27+Z)%100).padStart(2,"0"),Xt=(a[Lt]||{}).cpi||.04;g*=1+Xt}const y=Math.round(fa(s.equityMin,c,s.duration,g,!0)),w=Math.round(fa(s.bondMin,c,s.duration,g,!0)),S=Math.round(fa(s.cashTarget,c,s.duration,g,!1)),A=t+e,_=y+w;let ot=!1,At=0;const X=i.filter(Z=>Z.date<n);for(let Z=X.length-1;Z>=0&&X[Z].source==="Cash";Z--)At++;X.length&&X[X.length-1].inProtection&&(ot=A<=_+(s.recoveryBuffer||1e4)),!ot&&A<_&&At+1>=(s.consecutiveLimit||3)&&(ot=!0);const Et=f>=4?16-f:4-f,at=Math.max(1,Et),ct=D*g,xt=T+b;let ht,yt,$,_t=0,J=0,it=!1,kt=0;const de=Math.max(0,I-F)/at;if(x){const Z=xt/12,Xt=i.filter(Bt=>Bt.taxYear===l&&Bt.date<n).reduce((Bt,ut)=>Bt+(ut.sipp||0)+(ut.other||0)+(ut.state||0),0),Ae=P+Xt,ln=Math.max(0,E-Ae),xe=Z*at,he=Math.max(0,(ln-xe)/at),Rt=ct/12,se=Math.min(Rt-Z,he),jt=wr(ct,v,E)/12,Fe=Math.min(ct,E),ge=wr(Fe,v,E)/12,ze=Math.max(0,jt-ge),Zt=Math.min(ze,de);if(kt=Zt,_t=se,ot){const Bt=(s.protectionFactor||20)/100,ut=ct*(1-Bt),Re=wr(ut,v,E)/12,Pt=wr(xt,v,E)/12;ht=Math.max(0,Re-Pt)/.8,yt=Zt,$="Protection"}else{ht=se,yt=Zt,$="Tax-Efficient";const Bt=f>=4?d:d-1,ut=X.filter(Pt=>{const[cn,mr]=Pt.date.split("-").map(Number);return(mr>=4?cn:cn-1)===Bt});let Ue=0,Re=0;if(ut.forEach(Pt=>{Re+=Pt.sipp||0,Pt.inProtection&&Pt.stdSipp&&(Ue+=Pt.stdSipp-Pt.sipp),Pt.boostAmount>0&&(Ue-=Pt.boostAmount)}),Ue>0){const Pt=Re+ht*at+xt,cn=E-Pt,mr=A-_-(s.recoveryBuffer||1e4);if(cn>0&&mr>0){const $e=cn/at,No=Ue/at,Lo=mr/at;J=Math.min(No,$e,Lo),J>50&&(ht+=J,$="Tax Boost")}}}}else{const Z=ct/12,Lt=xt/12,Xt=Math.max(0,Z-Lt);if(_t=Xt,yt=0,ot){const Ae=(s.protectionFactor||20)/100,ln=ct*(1-Ae),he=wr(ln,v,E)/12,Rt=wr(xt,v,E)/12;ht=Math.max(0,he-Rt)/.8,$="Protection";const jt=f>=4?d:d-1,Fe=X.filter(Zt=>{const[Bt,ut]=Zt.date.split("-").map(Number);return(ut>=4?Bt:Bt-1)===jt});let ge=0;Fe.forEach(Zt=>{ge+=Zt.sipp||0});const ze=ge+ht*at+xt;if(ze<E){const Bt=(E-ze)/at,ut=A-_-(s.recoveryBuffer||1e4);ut>0&&Bt>50&&(J=Math.min(Bt,ut/at),J>50&&(ht+=J,it=!0,$="Protection-Induced Efficiency"))}}else{ht=Xt,$="Tax-Inefficient";const Ae=f>=4?d:d-1,ln=X.filter(Rt=>{const[se,jt]=Rt.date.split("-").map(Number);return(jt>=4?se:se-1)===Ae});let xe=0,he=0;if(ln.forEach(Rt=>{he+=Rt.sipp||0,Rt.inProtection&&Rt.stdSipp&&(xe+=Rt.stdSipp-Rt.sipp),Rt.boostAmount>0&&(xe-=Rt.boostAmount)}),xe>0){const Rt=he+ht*at+xt,se=E-Rt,jt=A-_-(s.recoveryBuffer||1e4);if(se>0&&jt>0){const Fe=se/at,ge=xe/at,ze=jt/at;J=Math.min(ge,Fe,ze),J>50&&(ht+=J,$="Tax Boost")}}}}let Dt,be,ar=0,lr=0,Nn=0,Ln="";if(!ot&&A>=_+ht){Dt="Growth";const Z=Math.max(0,t-y),Lt=Math.max(0,e-w),Xt=Z+Lt;Xt>0?(ar=ht*Z/Xt,lr=ht*Lt/Xt,be="Healthy"):(Dt="Cash",Nn=ht,be="At min")}else Dt="Cash",Nn=ht,be=ot?"Protection":"Below min",r<ht&&(Ln="Cash low!");let Te="";const cr=t-y,ur=e-w;if(cr>5e3&&ur<-5e3){const Z=Math.floor(Math.min(cr,-ur)/1e3)*1e3;Z>=5e3&&(Te=`Move £${Z.toLocaleString()} Equity→Bond`)}else if(ur>5e3&&cr<-5e3){const Z=Math.floor(Math.min(ur,-cr)/1e3)*1e3;Z>=5e3&&(Te=`Move £${Z.toLocaleString()} Bond→Equity`)}let dr="";const hr=S-r;if(hr>5e3&&Dt==="Growth"&&!ot){const Z=A-_-ht;if(Z>1e4){const Lt=Math.floor(Math.min(hr*.3,Z*.5)/1e3)*1e3;Lt>=5e3&&(dr=`Replenish Cash: Move £${Lt.toLocaleString()} from growth funds`)}}const on=[];Ln&&on.push({message:Ln,severity:"danger",type:"low-cash"}),J>50&&on.push({message:`Tax Boost: +£${Math.round(J).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),Te&&on.push({message:Te,severity:"warning",type:"rebalance"}),dr&&on.push({message:dr,severity:"info",type:"cash-replenish"});const ei=ht+T/12+b/12,Ie=ei*12;let Se=0;Ie>v&&(Ie<=E?Se=(Ie-v)*.2:Se=(E-v)*.2+(Ie-E)*.4);const Jr=ei-Se/12+yt,Mt=f>=4?d:d-1,Nt=X.filter(Z=>{const[Lt,Xt]=Z.date.split("-").map(Number);return(Xt>=4?Lt:Lt-1)===Mt});let an=Nt.reduce((Z,Lt)=>Z+(Lt.taxPaidMonthly||Lt.monthlyTax||0),0);an+=Se/12;const Xr=Nt.length+1,ni=an/Xr*12,fr=ct/12;let Be=0;fr*12>v&&(fr*12<=E?Be=(fr*12-v)*.2:Be=(E-v)*.2+(fr*12-E)*.4);const pr=Math.max(0,Be/12-Se/12),ri=F+kt;return{date:n,taxYear:l,yearNumber:c,remainingMonths:at,equity:t,bond:e,cash:r,isa:0,adjEquityMin:y,adjBondMin:w,adjCashTarget:S,pa:v,brl:E,other:T/12,statePension:b/12,sippDraw:ht,stdSipp:_t,isaDraw:yt,totalMonthlyNet:Jr,isTaxEfficientYear:x,yearlyIsaSavingsAllocation:I,cumulativeIsaSavingsUsed:ri,isaSavingsUsedThisMonth:kt,taxPaidYTD:an,taxProjectedAnnual:ni,taxSavedMonthly:pr,taxSavedYTD:pr*Xr,taxSavedProjectedAnnual:pr*12,taxEfficient:x&&!it,inProtection:ot,protectionReason:ot?be:null,consecutiveCashDraws:At,protectionInducedTaxEfficiency:it,boostAmount:J>50?J:0,boostEligible:J>50,source:Dt,drawFromEquity:ar,drawFromBond:lr,drawFromCash:Nn,rebalanceNeeded:Te!=="",rebalanceActions:Te?[Te]:[],alerts:on,calculationDetails:{mode:$,reason:`${be} | ${$}`,totalGrowth:A,minGrowth:_,consec:At,stdSipp:ht,inputs:{baseSalary:s.baseSalary,confirmedSalary:D,targetGross:ct,cumInf:g,yearNum:c,taxYear:l,OTHER:T,STATE:b,PA:v,BRL:E,isTaxEfficientYear:x,yearlyIsaSavingsAllocation:I,grossIncomeToDate:P},taxInfo:{annualTaxable:Ie,headroomToBRL:E-Ie,annualTax:Se,monthlyNet:Jr}}}}window.handleDecisionSubmit=async function(n){n.preventDefault();const t=document.getElementById("entryMonth").value,e=parseFloat(document.getElementById("entryEquity").value)||0,r=parseFloat(document.getElementById("entryBond").value)||0,s=parseFloat(document.getElementById("entryCash").value)||0,i=[];if(t||i.push("Month"),!e&&e!==0&&i.push("Equity Fund"),!r&&r!==0&&i.push("Bond Balance"),!s&&s!==0&&i.push("Cash Balance"),i.length>0){mt("Missing: "+i.join(", "),"error",4e3);return}try{if((await BE(t)).showWizard){const c=document.getElementById("taxYearWizard");c.style.display="block",window._pendingDecisionForm={dateStr:t,equity:e,bond:r,cash:s},OE(c,t,async d=>{if(c.style.display="none",d&&d.completed)try{Ar=await vd(t,e,r,s);const f=document.getElementById("decisionOutput");cd(Ar,f),document.getElementById("saveBtn").disabled=!1}catch(f){console.error("Decision error after wizard:",f),mt("Error: "+f.message,"error")}});return}Ar=await vd(t,e,r,s);const l=document.getElementById("decisionOutput");cd(Ar,l),document.getElementById("saveBtn").disabled=!1}catch(a){console.error("Decision error:",a),mt("Error: "+a.message,"error")}};window.saveCurrentDecision=async function(){const n=document.getElementById("saveBtn");if(!Ar){mt("No decision to save","error");return}if(!Ee()){mt("Please sign in to save decisions","error");return}n.classList.add("loading"),n.disabled=!0;try{await fE(Ar),mt("Decision saved to history","success"),await Qr()}catch(t){console.error("Save error:",t),mt("Error saving: "+t.message,"error"),n.disabled=!1}finally{n.classList.remove("loading")}};window.runMonteCarloUI=async function(){const n={equityStart:parseFloat(document.getElementById("mcEquity").value)||25e4,bondStart:parseFloat(document.getElementById("mcBond").value)||2e5,cashStart:parseFloat(document.getElementById("mcCash").value)||5e4,years:parseInt(document.getElementById("mcYears").value)||35};document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await Mn(),setTimeout(()=>{try{const{results:t,stats:e}=GE(n);Ib=t,ip(e,t,"Monte Carlo (1000 runs)","mcResults",n.years)}catch(t){console.error("Simulation error:",t),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}},50)};window.runHistoricalUI=async function(){const n={equityStart:parseFloat(document.getElementById("histEquity").value)||25e4,bondStart:parseFloat(document.getElementById("histBond").value)||2e5,cashStart:parseFloat(document.getElementById("histCash").value)||5e4,years:parseInt(document.getElementById("histYears").value)||35};document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await Mn(),setTimeout(()=>{try{const{results:t,stats:e}=KE(n);Sb=t,ip(e,t,"Historical Analysis","histResults",n.years)}catch(t){console.error("Simulation error:",t),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}},50)};window.runScenariosUI=async function(){const n={equityStart:parseFloat(document.getElementById("scenEquity").value)||25e4,bondStart:parseFloat(document.getElementById("scenBond").value)||2e5,cashStart:parseFloat(document.getElementById("scenCash").value)||5e4,years:35};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',await Mn(),setTimeout(()=>{try{const t=QE(n);Bb(t,"scenResults")}catch(t){console.error("Scenario error:",t),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}},50)};function Nb(n){if(!n.spStartDate||!n.spWeeklyAmount)return console.warn("State Pension not configured - spStartDate or spWeeklyAmount missing"),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const t=Lb(n.spStartDate);if(!t)return console.warn("Could not parse spStartDate:",n.spStartDate),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const e=new Date,r=365.25*24*60*60*1e3,s=Math.max(0,(t.getTime()-e.getTime())/r),i=Math.floor(s);t.getMonth(),t.getDate();const a=365,l=Math.floor((t-new Date(t.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function Lb(n){if(!n)return null;if(/^\d{4}-\d{2}-\d{2}$/.test(n))return new Date(n);if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,s,i]=n.split("/").map(Number);return new Date(i,s-1,r)}const t={january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};let e=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})$/i);if(e){const r=parseInt(e[1]),s=t[e[2].toLowerCase()],i=parseInt(e[3]);if(s!==void 0)return new Date(i,s,r)}if(e=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\d{4})$/i),e){const r=t[e[1].toLowerCase()],s=parseInt(e[2]),i=parseInt(e[3]);if(r!==void 0)return new Date(i,r,s)}return null}let pa=!1;window.runOptimisationUI=async function(n){if(pa)return;pa=!0;const t=document.getElementById("optimiseBtn"+n),e=document.getElementById("optimiseResults"+n);t&&(t.disabled=!0),t&&(t.textContent="Optimising...");let r,s,i,a;n==="MC"?(r=document.getElementById("mcEquity"),s=document.getElementById("mcBond"),i=document.getElementById("mcCash"),a=document.getElementById("mcYears")):(r=document.getElementById("histEquity"),s=document.getElementById("histBond"),i=document.getElementById("histCash"),a=document.getElementById("histYears"));const l=+r.value,c=+s.value,d=+i.value,f=+a.value,m=l+c+d;e.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations...</div>';const v=await Mn(),E=JSON.parse(JSON.stringify(v));setTimeout(()=>{try{let T=null,x={equity:l,bond:c,cash:d,rate:0,avgProt:0,withProt:0,totalRuns:0};const I=[];for(let S=5;S<=30;S+=5)for(let A=20;A<=95-S;A+=5){const _=100-S-A;_>=0&&I.push({equity:Math.round(m*A/100),bond:Math.round(m*_/100),cash:Math.round(m*S/100)})}const{EQUITY_RETURNS:P,INFLATION:D}=window._constants,{simulate:C}=window._simEngine,{seededRng:N}=window._mathUtils,F=Object.keys(P).map(Number).sort((S,A)=>S-A),V=Math.max(...F),b=S=>{const A={equityStart:S.equity,bondStart:S.bond,cashStart:S.cash,years:f,equityMin:E.equityMin,bondMin:E.bondMin,cashTarget:E.cashTarget,duration:E.duration,baseSalary:E.baseSalary,other:E.other,...Nb(E),pa:E.pa,brl:E.brl,hrl:E.hrl,taxMode:E.taxMode,protectionMult:E.protectionMult,consecutiveLimit:E.consecutiveLimit,disableProtection:E.disableProtection,hodlEnabled:E.hodlEnabled,hodlValue:E.hodlValue},_=[];if(n==="MC")for(let $=0;$<1e3;$++){const _t=N($*12345),J={equity:{},inflation:{}};for(let it=0;it<f;it++){const kt=F[Math.floor(_t()*F.length)];J.equity[it]=P[kt],J.inflation[it]=D[kt]||.025}_.push(C(A,J,$))}else F.forEach($=>{if($+f-1>V)return;const _t={equity:{},inflation:{}};for(let J=0;J<f;J++)_t.equity[J]=P[$+J]||0,_t.inflation[J]=D[$+J]||.025;_.push(C(A,_t,$))});const ot=_.filter($=>$.failed),At=_.filter($=>!$.failed),X=(_.length-ot.length)/_.length*100,at=_.map($=>$.protMonths).reduce(($,_t)=>$+_t,0)/_.length,ct=_.filter($=>$.protMonths>0).length,xt=At.map($=>$.final).sort(($,_t)=>$-_t),ht=xt.length>0?xt[Math.floor(xt.length*.5)]:0,yt=xt.length>0?xt[Math.floor(xt.length*.9)]:0;return{equity:S.equity,bond:S.bond,cash:S.cash,rate:X,avgProt:at,withProt:ct,totalRuns:_.length,medianFinal:ht,p90Final:yt}},y=b({equity:l,bond:c,cash:d});x.avgProt=y.avgProt,x.withProt=y.withProt,x.totalRuns=y.totalRuns,x.rate=y.rate,x.medianFinal=y.medianFinal,x.p90Final=y.p90Final,I.forEach(S=>{const A=b(S);A.avgProt<=x.avgProt&&(!T||A.rate>T.rate)&&(T=A)});let w="";if(T&&T.rate>x.rate){const S=T.medianFinal-x.medianFinal,A=x.medianFinal>0?S/x.medianFinal*100:0;w+='<div class="card" style="margin-top:20px;border-color:var(--success);">',w+='<h3 style="color:var(--success);margin-top:0;">Better Allocation Found</h3>',w+='<p style="color:var(--text-muted);margin-bottom:16px;">A different fund split could improve your success rate without increasing protection usage:</p>',w+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">',w+='<div style="padding:16px;background:rgba(0,0,0,0.2);border-radius:8px;">',w+='<div style="font-weight:500;margin-bottom:12px;color:var(--text-muted);">Your Current Split</div>',w+='<div style="font-size:24px;font-weight:600;color:var(--warning);">'+x.rate.toFixed(1)+"%</div>",w+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate</div>',w+='<div style="font-size:13px;">Equity: '+H(x.equity)+" ("+Math.round(x.equity/m*100)+"%)</div>",w+='<div style="font-size:13px;">Bonds: '+H(x.bond)+" ("+Math.round(x.bond/m*100)+"%)</div>",w+='<div style="font-size:13px;">Cash: '+H(x.cash)+" ("+Math.round(x.cash/m*100)+"%)</div>",w+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+x.avgProt.toFixed(0)+" mo | Median final: "+H(x.medianFinal)+"</div>",w+="</div>",w+='<div style="padding:16px;background:rgba(46,160,67,0.1);border-radius:8px;border:1px solid var(--success);">',w+='<div style="font-weight:500;margin-bottom:12px;color:var(--success);">Optimised Split</div>',w+='<div style="font-size:24px;font-weight:600;color:var(--success);">'+T.rate.toFixed(1)+"%</div>",w+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate (+'+(T.rate-x.rate).toFixed(1)+"%)</div>",w+='<div style="font-size:13px;">Equity: '+H(T.equity)+" ("+Math.round(T.equity/m*100)+"%)</div>",w+='<div style="font-size:13px;">Bonds: '+H(T.bond)+" ("+Math.round(T.bond/m*100)+"%)</div>",w+='<div style="font-size:13px;">Cash: '+H(T.cash)+" ("+Math.round(T.cash/m*100)+"%)</div>",w+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+T.avgProt.toFixed(0)+" mo | Median final: "+H(T.medianFinal)+"</div>",w+="</div>",w+="</div>",S<0?(w+='<div class="alert alert-warning" style="margin-bottom:16px;">',w+="<strong>Trade-off:</strong> The optimised allocation has a "+Math.abs(A).toFixed(0)+"% lower median final value. ",w+="This is because it likely has less equity exposure. You gain safety but may sacrifice some upside.",w+="</div>"):S>0&&(w+='<div class="alert alert-info" style="margin-bottom:16px;">',w+="<strong>Bonus:</strong> The optimised allocation also has a "+A.toFixed(0)+"% higher median final value!",w+="</div>"),w+='<div class="alert alert-info" style="margin-bottom:16px;">',w+="<strong>To apply this allocation:</strong> Click the button below to update your Settings with these new fund minimums.",w+="</div>",w+='<button onclick="applyOptimisedAllocationUI('+T.equity+","+T.bond+","+T.cash+')" style="width:100%;">Apply Optimised Allocation to Settings</button>',w+="</div>"}else w+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',w+='<h3 style="color:var(--primary);margin-top:0;">Your Allocation is Already Optimal</h3>',w+='<p style="color:var(--text-muted);">We tested '+I.length+" different fund splits. Your current allocation achieves the best success rate ("+x.rate.toFixed(1)+"%) without increasing protection usage.</p>",w+='<p style="font-size:13px;color:var(--text-muted);">Your protection: '+x.avgProt.toFixed(0)+" months average</p>",w+="</div>";e.innerHTML=w}catch(T){console.error("Optimisation error:",T),e.innerHTML='<div class="alert alert-danger">Error: '+T.message+"</div>"}finally{pa=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation")}},50)};window.applyOptimisedAllocationUI=async function(n,t,e){if(document.getElementById("ssEquityMin").value=n,document.getElementById("ssBondMin").value=t,document.getElementById("ssCashTarget").value=e,document.getElementById("dsEquityMin").value=n,document.getElementById("dsBondMin").value=t,document.getElementById("dsCashTarget").value=e,document.getElementById("mcEquity").value=n,document.getElementById("mcBond").value=t,document.getElementById("mcCash").value=e,document.getElementById("histEquity").value=n,document.getElementById("histBond").value=t,document.getElementById("histCash").value=e,document.getElementById("scenEquity").value=n,document.getElementById("scenBond").value=t,document.getElementById("scenCash").value=e,Ee())try{await Jl({equityMin:n,bondMin:t,cashTarget:e})}catch(r){console.error("Error saving optimised settings:",r)}alert("Settings updated! Run the test again to see the full results with your new allocation.")};const Vb={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function Ob(n){if(!n||n.length===0)return"";const t=n.filter(i=>i.failed).sort((i,a)=>i.years-a.years),e=n.filter(i=>i.protMonths>0).sort((i,a)=>a.protMonths-i.protMonths),r=t.length>0?t.slice(0,5):e.slice(0,5);if(r.length===0)return"";let s=`
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
      `;return r.forEach(i=>{const a=i.startYear||i.seed,l=Vb[a]||"-",c=i.failed?"danger":"success";s+=`
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
      `,s}function ip(n,t,e,r,s){const i=n.successRate>=90?"success":n.successRate>=80?"warning":"danger",a=r.replace("Results",""),l=n.survival||{},c=n.finalValue||{},d=n.protection||{};let f=`
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
          ${r==="histResults"?Ob(t):""}

          <!-- Result Summary -->
          <div class="alert ${i==="success"?"alert-success":i==="warning"?"alert-warning":"alert-danger"}" style="margin-top: 24px;">
            ${n.successRate>=90?"Excellent! Very high probability of success.":n.successRate>=80?"Good but some downside risk. Consider adjustments.":"Warning: Significant risk of depletion."}
          </div>
        </div>
      `;document.getElementById(r).innerHTML=f,setTimeout(()=>{const m=document.getElementById(`${a}ConeChart`),v=document.getElementById(`${a}TrajChart`),E=document.getElementById(`${a}HistChart`);m&&t&&t.length>0&&mb(m,t,{years:s}),v&&t&&t.length>0&&gb(v,t,{years:s}),E&&t&&t.length>0&&yb(E,t,{})},50)}function Bb(n,t){let e='<div class="card"><h2>Scenario Analysis</h2>';e+=`
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
        `}e+="</div></div>",document.getElementById(t).innerHTML=e,setTimeout(()=>{const r=document.getElementById("scenCompChart");r&&n&&vb(r,n,{years:35,title:"Scenario Comparison"})},50)}async function sc(){ir("Loading settings...");try{const n=await Mn();document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",to("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,Mo()}catch(n){console.error("Error loading stress settings:",n)}finally{or()}}window.saveStressSettingsUI=async function(){if(!Ee()){mt("Please sign in to save settings","error");return}ir("Saving settings...");try{await Jl({baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:+document.getElementById("ssEquityMin").value,bondMin:+document.getElementById("ssBondMin").value,cashTarget:+document.getElementById("ssCashTarget").value,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value}),mt("Settings saved successfully","success")}catch(n){console.error("Error saving stress settings:",n),mt("Error saving: "+n.message,"error")}finally{or()}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){ir("Resetting settings...");try{await AE(),await sc(),mt("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),mt("Error resetting: "+n.message,"error")}finally{or()}}};async function op(){ir("Loading settings...");try{const n=await sr();document.getElementById("dsEquityMin").value=n.equityMin||25e4,document.getElementById("dsBondMin").value=n.bondMin||2e5,document.getElementById("dsCashTarget").value=n.cashTarget||5e4,document.getElementById("dsDuration").value=n.duration||35,document.getElementById("dsBaseSalary").value=n.baseSalary||3e4,document.getElementById("dsProtectionFactor").value=n.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=n.recoveryBuffer||15e3,document.getElementById("dsConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("entryEquity").value=n.equityMin||25e4,document.getElementById("entryBond").value=n.bondMin||2e5,document.getElementById("entryCash").value=n.cashTarget||5e4,Mo()}catch(n){console.error("Error loading decision settings:",n)}finally{or()}}window.saveDecisionSettingsUI=async function(){if(!Ee()){mt("Please sign in to save settings","error");return}ir("Saving settings...");try{await Wl({equityMin:+document.getElementById("dsEquityMin").value,bondMin:+document.getElementById("dsBondMin").value,cashTarget:+document.getElementById("dsCashTarget").value,duration:+document.getElementById("dsDuration").value,baseSalary:+document.getElementById("dsBaseSalary").value,spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value}),mt("Settings saved successfully","success")}catch(n){console.error("Error saving decision settings:",n),mt("Error saving: "+n.message,"error")}finally{or()}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){ir("Resetting settings...");try{await Wl({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await op(),mt("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),mt("Error resetting: "+n.message,"error")}finally{or()}}};window.showDrawdownScheduleUI=async function(){const n=parseFloat(document.getElementById("ddInflation").value)/100||.025,t=parseInt(document.getElementById("ddDuration").value)||35;try{const e=await Mn();e.duration=t;const r=Op(e,t,n);let s='<div class="card"><h2>Projected SIPP Drawdown Schedule</h2>';s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>BRL</th><th>Other</th><th>State</th><th>SIPP Draw</th><th>Tax</th><th>Net</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${H(i.brl)}</td>
            <td>${H(i.other)}</td>
            <td>${H(i.statePension)}</td>
            <td style="color: var(--primary); font-weight: 600;">${H(i.sippDraw)}</td>
            <td style="color: var(--danger);">-${H(i.tax)}</td>
            <td style="color: var(--success);">${H(i.netIncome)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=s}catch(e){console.error("Drawdown error:",e),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}};window.showGlidepathUI=async function(){const n=parseFloat(document.getElementById("gpInflation").value)/100||.025,t=parseInt(document.getElementById("gpDuration").value)||35;try{const e=await Mn();e.duration=t;const r=Fp(e,n);let s='<div class="card"><h2>Fund Glidepath (Inflation-Adjusted Minimums)</h2>';s+='<div class="alert alert-info" style="margin-bottom: 20px;">',s+="<strong>Glidepath Logic:</strong> Equity & Bond minimums inflate with CPI but deplete linearly to £0. Cash inflates only (maintains real value).",s+="</div>",s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>Cum Inflation</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Total Min</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${(i.cumulativeInflation*100-100).toFixed(1)}%</td>
            <td style="color: var(--success);">${H(i.equityMin)}</td>
            <td style="color: var(--info);">${H(i.bondMin)}</td>
            <td style="color: var(--warning);">${H(i.cashTarget)}</td>
            <td style="font-weight: 600;">${H(i.totalMin)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=s}catch(e){console.error("Glidepath error:",e),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}};let Ce=null,zn=[],Sr="all";async function Qr(){const n=document.getElementById("historyTabs"),t=document.getElementById("historyDetail"),e=document.getElementById("historyYearFilter"),r=document.getElementById("deleteAllHistoryBtn");if(!n||!t)return;if(n.innerHTML='<span class="loading">Loading...</span>',zn=await Gl({sortDesc:!1,limit:500}),r&&(r.style.display=zn.length>0?"":"none"),zn.length===0){n.innerHTML="",e&&(e.innerHTML='<option value="all">No entries</option>'),t.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const s=[...new Set(zn.map(c=>c.date.split("-")[0]))].sort().reverse();if(e){let c='<option value="all">All Years</option>';s.forEach(d=>{c+=`<option value="${d}">${d}</option>`}),e.innerHTML=c,e.value=Sr}const i=Sr==="all"?zn:zn.filter(c=>c.date.startsWith(Sr));if(i.length===0){n.innerHTML="",t.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${Sr}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let a="";i.forEach(c=>{const d=c.date===Ce,f=["history-tab"];d&&f.push("active"),c.inProtection&&f.push("protection");const[m,v]=c.date.split("-").map(Number),E=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],T=Sr==="all"?`${E[v-1]} ${m}`:E[v-1];a+=`<button class="${f.join(" ")}" onclick="selectHistoryEntry('${c.date}')">${T}</button>`}),n.innerHTML=a;const l=document.getElementById("historyMobileSelector");if(l){let c="";i.forEach(d=>{const f=eo(d.date),m=d.inProtection?" (Protection)":"";c+=`<option value="${d.date}">${f}${m}</option>`}),l.innerHTML=c}(!Ce||!i.find(c=>c.date===Ce))&&(Ce=i[i.length-1].date),l&&(l.value=Ce),ap(Ce),setTimeout(()=>{const c=n.querySelector(".history-tab.active");c&&c.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(n){Sr=n,Ce=null,Qr()};function eo(n){const[t,e]=n.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][e-1]} ${t}`}function ap(n){const t=document.getElementById("historyDetail"),e=zn.find(d=>d.date===n);if(!e){t.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const r=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",s=e.isTaxEfficientYear!==!1&&e.mode==="Tax-Efficient",i=e.inProtection?"warning":s?"efficient":"inefficient",a=e.inProtection?`Protection${e.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:s?"Tax-Efficient":"Standard";let l=e.source||"Unknown";e.source==="Growth"&&(e.dEquity>0||e.dBond>0)?l=`Growth (Equity: ${r(e.dEquity||0)}, Bond: ${r(e.dBond||0)})`:e.source==="Cash"&&(l=`Cash (${r(e.dCash||e.sipp||0)})`);let c=`
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${eo(e.date)}</h3>
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
      `;t.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===eo(n))})}window.selectHistoryEntry=function(n){Ce=n,ap(n);const t=document.getElementById("historyMobileSelector");t&&(t.value=n);const r=document.getElementById("historyTabs").querySelector(".history-tab.active");r&&r.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(n){const t=document.getElementById("historyTabs"),e=200;n==="left"?t.scrollLeft-=e:t.scrollLeft+=e};window.deleteHistoryEntry=async function(n,t){const e=eo(n);if(confirm(`Delete entry for ${e}?`)){if(!Ee()){mt("Please sign in to delete entries","error");return}t&&(t.classList.add("loading"),t.disabled=!0);try{await qf(n),mt(`Deleted ${e}`,"success"),Ce=null,await Qr()}catch(r){console.error("Delete error:",r),mt("Error deleting: "+r.message,"error"),t&&(t.classList.remove("loading"),t.disabled=!1)}}};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!Ee()){mt("Please sign in to delete entries","error");return}ir("Deleting all history...");try{const n=await Gl({limit:1e3});for(const t of n)await qf(t.date);mt(`Deleted ${n.length} entries`,"success"),Ce=null,await Qr()}catch(n){console.error("Delete all error:",n),mt("Error deleting: "+n.message,"error")}finally{or()}}};let Un=null;async function ti(){const n=document.getElementById("taxYearTabs"),t=document.getElementById("taxYearDetail");if(!n||!t)return;n.innerHTML='<span class="loading">Loading...</span>';const e=await Qs();await sr();const r=Object.keys(e).sort(),s=Fb(),i=zb(r,s,40);let a="";i.forEach(d=>{const f=e[d],m=f&&f.yearSetupComplete,v=d===Un,E=["tax-year-tab"];v&&E.push("active"),m||E.push("not-setup"),a+=`<button class="${E.join(" ")}" onclick="selectTaxYear('${d}')">${d}</button>`}),n.innerHTML=a;const l=document.getElementById("taxYearMobileSelector");if(l){let d="";i.forEach(f=>{const m=e[f],E=m&&m.yearSetupComplete?f:`${f} (not set up)`;d+=`<option value="${f}">${E}</option>`}),l.innerHTML=d}if(!Un){const d=r.filter(f=>{var m;return(m=e[f])==null?void 0:m.yearSetupComplete});Un=d.length>0?d[d.length-1]:s}l&&(l.value=Un),await lp(Un,e);const c=n.querySelector(".tax-year-tab.active");c&&c.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function Fb(){const n=new Date,t=n.getFullYear(),e=n.getMonth()+1;return e<4||e===4&&n.getDate()<6?`${String(t-1).slice(-2)}/${String(t).slice(-2)}`:`${String(t).slice(-2)}/${String(t+1).slice(-2)}`}function zb(n,t,e){const r=new Set(n),[s]=t.split("/").map(Number),i=s<50?2e3+s:1900+s;for(let a=0;a<e&&r.size<e;a++){const l=i+a,c=l+1;r.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(r).sort()}async function lp(n,t,e){var m,v,E,T,x,I,P,D,C,N,F,V,b,g;const r=document.getElementById("taxYearDetail"),s=t[n];if(!s||!s.yearSetupComplete){r.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${n} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${n}')">Set Up ${n}</button>
          </div>
        `;return}const i=await Kl(n),a=Math.round(i.amount||0),l=i.startDate||"Not configured",c=i.isReceiving;i.yearsUntil;const d=y=>y!=null?"£"+Math.round(y).toLocaleString():"—";let f=`
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
              <span class="value">${Ub(s.startMonth||4)}</span>
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
                  <td class="tax-col">-${d((I=y.other)==null?void 0:I.tax)}</td>
                  <td class="net-col">${d((P=y.other)==null?void 0:P.net)}</td>
                </tr>
                `:""}
                ${((D=y.statePension)==null?void 0:D.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${d((C=y.statePension)==null?void 0:C.gross)}</td>
                  <td class="tax-col">-${d((N=y.statePension)==null?void 0:N.tax)}</td>
                  <td class="net-col">${d((F=y.statePension)==null?void 0:F.net)}</td>
                </tr>
                `:""}
                ${((V=y.isa)==null?void 0:V.net)>0?`
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
      `,r.innerHTML=f,document.querySelectorAll(".tax-year-tab").forEach(y=>{y.classList.toggle("active",y.textContent===n)})}window.selectTaxYear=async function(n){Un=n;const t=await Qs();await sr(),await lp(n,t),document.querySelectorAll(".tax-year-tab").forEach(i=>{i.classList.toggle("active",i.textContent===n)});const e=document.getElementById("taxYearMobileSelector");e&&(e.value=n);const s=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${n}')"]`);s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(n){const t=document.getElementById("taxYearTabs"),e=200;n==="left"?t.scrollLeft-=e:t.scrollLeft+=e};function Ub(n){return["January","February","March","April","May","June","July","August","September","October","November","December"][(n-1)%12]||"April"}window.triggerWizardForYear=async function(n){const[t]=n.split("/").map(Number),e=t<50?2e3+t:1900+t,r=`${e}-04`,s=document.getElementById("selectedMonth");s&&(s.value=r),document.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(i=>i.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(i=>i.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),alert(`Please click "Calculate" with April ${e} selected to set up tax year ${n}`)};window.reconfigureTaxYear=async function(n){if(confirm(`This will allow you to reconfigure tax year ${n}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const t=await Ro(n);t.yearSetupComplete=!1,await Po(n,t),await ti(),alert(`Tax year ${n} has been marked for reconfiguration. Calculate a decision for this year to run the wizard again.`)}catch(t){console.error("Error:",t),alert("Error: "+t.message)}};window.updateTaxYear=async function(n,t,e){try{const r=await Ro(n);r[t]=parseFloat(e),await Po(n,r)}catch(r){console.error("Error updating tax year:",r),alert("Error saving: "+r.message)}};window.deleteTaxYear=async function(n){if(confirm("Delete tax year "+n+"? This will remove all configuration for this year."))try{const t=await rr();delete t.taxYears[n],await xo(t),Un=null,await ti()}catch(t){console.error("Error deleting tax year:",t),alert("Error deleting: "+t.message)}};window.addTaxYear=async function(){if(!Ee()){alert("Please sign in to add tax years");return}const n=prompt("Enter tax year (e.g., 25/26):");if(!n||!/^\d{2}\/\d{2}$/.test(n)){alert("Invalid format. Use YY/YY (e.g., 25/26)");return}try{await Po(n,{}),await ti()}catch(t){console.error("Save error:",t),alert("Error saving: "+t.message)}};console.log("Pension Planner v"+_d+" loaded");
