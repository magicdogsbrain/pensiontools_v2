(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();function Fp(n){const e=(n.sippDraw||0)+(n.other||0)+(n.statePension||0),t=e*12,r=n.pa||12570,s=n.brl||50270,i=n.hrl||125140;let a=0;t>r&&(t<=s?a=(t-r)*.2:t<=i?a=(s-r)*.2+(t-s)*.4:a=(s-r)*.2+(i-s)*.4+(t-i)*.45);const l=a/12,c=e-l+(n.isaDraw||0);return{date:n.date,taxYear:n.taxYear,yearNum:n.yearNumber,equity:n.equity,bond:n.bond,cash:n.cash,total:n.equity+n.bond+n.cash,adjEquity:n.adjEquityMin,adjBond:n.adjBondMin,adjCash:n.adjCashTarget,source:n.source,dEquity:n.drawFromEquity||0,dBond:n.drawFromBond||0,dCash:n.drawFromCash||0,sipp:n.sippDraw,stdSipp:n.stdSipp||n.sippDraw,isa:n.isaDraw,other:n.other,state:n.statePension,pa:r,brl:s,monthlyTax:l,monthlyNet:c,mode:n.taxEfficient?"Tax-Efficient":"Standard",inProtection:n.inProtection,reason:n.protectionReason||"",consecutiveDraws:n.consecutiveCashDraws||0,boostAmount:n.boostAmount,boostEligible:n.boostEligible||!1,rebal:n.rebalanceActions?n.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:n.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:n.isaDraw||0,cumulativeIsaSavingsUsed:n.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxPaidYTD:n.taxPaidYTD||l,taxProjectedAnnual:n.taxProjectedAnnual||a,taxSavedMonthly:n.taxSavedMonthly||0,taxSavedYTD:n.taxSavedYTD||0,taxSavedProjectedAnnual:n.taxSavedProjectedAnnual||0,isTaxEfficientYear:n.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:n.protectionInducedTaxEfficiency||!1,remainingMonths:n.remainingMonths||12}}const Ri={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},_d="6.0.0",Je={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},wd={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},le={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},Mr={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},Ls={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},Qa={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},zp={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},At={START_MONTH:4,START_DAY:6};function $p(n,e,t,r=Je.HIGHER_RATE_LIMIT){if(n<=0)return 0;let s=e;if(n>Je.PA_TAPER_THRESHOLD){const f=(n-Je.PA_TAPER_THRESHOLD)*Je.PA_TAPER_RATE;s=Math.max(0,e-f)}const i=Math.max(0,n-s),a=Math.max(0,t-s),l=r-t;let c=0;const d=Math.min(i,a);if(c+=d*Je.BASIC_RATE,i>a){const f=Math.min(i-a,l);c+=f*Je.HIGHER_RATE}if(i>a+l){const f=i-a-l;c+=f*Je.ADDITIONAL_RATE}return c}function Ja(n){const e=typeof n=="string"?new Date(n):n,t=e.getFullYear(),r=e.getMonth()+1,s=e.getDate();if(r<At.START_MONTH||r===At.START_MONTH&&s<At.START_DAY){const i=t-1;return`${String(i).slice(-2)}/${String(t).slice(-2)}`}return`${String(t).slice(-2)}/${String(t+1).slice(-2)}`}function Up(n){const e=parseInt(n.split("/")[0]),t=e<50?2e3+e:1900+e;return new Date(t,At.START_MONTH-1,At.START_DAY)}function qp(n){const e=parseInt(n.split("/")[1]),t=e<50?2e3+e:1900+e;return new Date(t,At.START_MONTH-1,At.START_DAY-1)}function jp(){const n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function bd(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,15)}function Hp(n){const t=(typeof n=="string"?new Date(n):n).getMonth()+1;return t>=At.START_MONTH?12-(t-At.START_MONTH):At.START_MONTH-t}function Wp(n){const{baseSalary:e,cumulativeInflation:t,yearlyInflation:r=[],other:s=0,statePension:i=0,statePensionYear:a=12,yearNumber:l=0,pa:c,brl:d,hrl:f,taxMode:m="inflates"}=n,v=m==="frozen"?c:c*t,b=m==="frozen"?d:d*t,T=m==="frozen"?f:f*t,A=e*t,R=Yp(s,r),x=l>=a?i*t:0,M=R+x,C=Math.max(0,b-M),O=Math.max(0,A-M),V=Math.min(C,O);return{pa:v,brl:b,hrl:T,targetGross:A,other:R,statePension:x,fixedIncome:M,annualSippDraw:V,monthlySippDraw:V/12,sippPlusfixedAtBRL:C+M===b}}function Yp(n,e,t=wd.OTHER_INCOME_CAP){let r=n;for(const s of e)r*=1+Math.min(s,t);return r}function Gp(n,e,t=.025){const r=[],s=[];for(let i=0;i<=e;i++){i>0&&s.push(t);const a=Math.pow(1+t,i),l=Wp({baseSalary:n.baseSalary,cumulativeInflation:a,yearlyInflation:[...s],other:n.other,statePension:n.statePension,statePensionYear:n.statePensionYear,yearNumber:i,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode}),c=l.annualSippDraw+l.other+l.statePension,d=$p(c,l.pa,l.brl,l.hrl);r.push({year:i,brl:l.brl,other:l.other,statePension:l.statePension,sippDraw:l.annualSippDraw,totalTaxable:c,tax:d,netIncome:c-d})}return r}function Dr(n,e,t,r,s){if(s){const i=Math.max(0,1-e/t);return n*r*i}return n*r}function Kp(n,e,t){const r=Dr(n.equityMin,e,n.duration,t,!0),s=Dr(n.bondMin,e,n.duration,t,!0),i=Dr(n.cashTarget,e,n.duration,t,!1);return{equity:r,bond:s,cash:i,totalGrowth:r+s,total:r+s+i}}function Qp(n,e=wd.ASSUMED_CPI){const t=[];for(let r=0;r<=n.duration;r++){const s=Math.pow(1+e,r),i=Kp(n,r,s);t.push({year:r,cumulativeInflation:s,equityMin:i.equity,bondMin:i.bond,cashTarget:i.cash,totalMin:i.total})}return t}const Jp="modulepreload",Xp=function(n,e){return new URL(n,e).href},Yc={},Gc=function(e,t,r){let s=Promise.resolve();if(t&&t.length>0){const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=Promise.allSettled(t.map(d=>{if(d=Xp(d,r),d in Yc)return;Yc[d]=!0;const f=d.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!r)for(let T=a.length-1;T>=0;T--){const A=a[T];if(A.href===d&&(!f||A.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const b=document.createElement("link");if(b.rel=f?"stylesheet":Jp,f||(b.as="script"),b.crossOrigin="",b.href=d,c&&b.setAttribute("nonce",c),document.head.appendChild(b),f)return new Promise((T,A)=>{b.addEventListener("load",T),b.addEventListener("error",()=>A(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return s.then(a=>{for(const l of a||[])l.status==="rejected"&&i(l.reason);return e().catch(i)})};function Xa(n){let e=n;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function _s(n,e,t){const r=t(),s=t(),i=Math.sqrt(-2*Math.log(r))*Math.cos(2*Math.PI*s);return n+e*i}function Ed(n){const e=JSON.stringify(n);let t=0;for(let r=0;r<e.length;r++){const s=e.charCodeAt(r);t=(t<<5)-t+s,t=t&t}return t.toString(16)}var Kc={};/**
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
 */const Td=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Zp=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[t++],a=n[t++],l=n[t++],c=((s&7)<<18|(i&63)<<12|(a&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{const i=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return e.join("")},Id={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,l=a?n[s+1]:0,c=s+2<n.length,d=c?n[s+2]:0,f=i>>2,m=(i&3)<<4|l>>4;let v=(l&15)<<2|d>>6,b=d&63;c||(b=64,a||(v=64)),r.push(t[f],t[m],t[v],t[b])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Td(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Zp(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=t[n.charAt(s++)],l=s<n.length?t[n.charAt(s)]:0;++s;const d=s<n.length?t[n.charAt(s)]:64;++s;const m=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||l==null||d==null||m==null)throw new em;const v=i<<2|l>>4;if(r.push(v),d!==64){const b=l<<4&240|d>>2;if(r.push(b),m!==64){const T=d<<6&192|m;r.push(T)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class em extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const tm=function(n){const e=Td(n);return Id.encodeByteArray(e,!0)},Hi=function(n){return tm(n).replace(/\./g,"")},Sd=function(n){try{return Id.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function nm(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const rm=()=>nm().__FIREBASE_DEFAULTS__,sm=()=>{if(typeof process>"u"||typeof Kc>"u")return;const n=Kc.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},im=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Sd(n[1]);return e&&JSON.parse(e)},po=()=>{try{return rm()||sm()||im()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},xd=n=>{var e,t;return(t=(e=po())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},om=n=>{const e=xd(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Ad=()=>{var n;return(n=po())===null||n===void 0?void 0:n.config},Rd=n=>{var e;return(e=po())===null||e===void 0?void 0:e[`_${n}`]};/**
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
 */class am{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
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
 */function lm(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Hi(JSON.stringify(t)),Hi(JSON.stringify(a)),""].join(".")}/**
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
 */function Ze(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function cm(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ze())}function um(){var n;const e=(n=po())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function dm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function hm(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function fm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function pm(){const n=Ze();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function mm(){return!um()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function gm(){try{return typeof indexedDB=="object"}catch{return!1}}function ym(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}/**
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
 */const vm="FirebaseError";class tn extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=vm,Object.setPrototypeOf(this,tn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Qs.prototype.create)}}class Qs{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],a=i?_m(i,r):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new tn(s,l,r)}}function _m(n,e){return n.replace(wm,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const wm=/\{\$([^}]+)}/g;function bm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Wi(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const i=n[s],a=e[s];if(Qc(i)&&Qc(a)){if(!Wi(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function Qc(n){return n!==null&&typeof n=="object"}/**
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
 */function Js(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Es(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function Ts(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Em(n,e){const t=new Tm(n,e);return t.subscribe.bind(t)}class Tm{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Im(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=sa),s.error===void 0&&(s.error=sa),s.complete===void 0&&(s.complete=sa);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Im(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function sa(){}/**
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
 */function Ne(n){return n&&n._delegate?n._delegate:n}class Kn{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const qn="[DEFAULT]";/**
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
 */class Sm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new am;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Am(e))try{this.getOrInitializeService({instanceIdentifier:qn})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=qn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=qn){return this.instances.has(e)}getOptions(e=qn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[i,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);r===l&&a.resolve(s)}return s}onInit(e,t){var r;const s=this.normalizeInstanceIdentifier(t),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(e),this.onInitCallbacks.set(s,i);const a=this.instances.get(s);return a&&e(a,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:xm(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=qn){return this.component?this.component.multipleInstances?e:qn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function xm(n){return n===qn?void 0:n}function Am(n){return n.instantiationMode==="EAGER"}/**
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
 */class Rm{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Sm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var te;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(te||(te={}));const Pm={debug:te.DEBUG,verbose:te.VERBOSE,info:te.INFO,warn:te.WARN,error:te.ERROR,silent:te.SILENT},Cm=te.INFO,km={[te.DEBUG]:"log",[te.VERBOSE]:"log",[te.INFO]:"info",[te.WARN]:"warn",[te.ERROR]:"error"},Mm=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=km[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Za{constructor(e){this.name=e,this._logLevel=Cm,this._logHandler=Mm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in te))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Pm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,te.DEBUG,...e),this._logHandler(this,te.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,te.VERBOSE,...e),this._logHandler(this,te.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,te.INFO,...e),this._logHandler(this,te.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,te.WARN,...e),this._logHandler(this,te.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,te.ERROR,...e),this._logHandler(this,te.ERROR,...e)}}const Dm=(n,e)=>e.some(t=>n instanceof t);let Jc,Xc;function Nm(){return Jc||(Jc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Lm(){return Xc||(Xc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Pd=new WeakMap,Ia=new WeakMap,Cd=new WeakMap,ia=new WeakMap,el=new WeakMap;function Om(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{t(_n(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Pd.set(t,n)}).catch(()=>{}),el.set(e,n),e}function Vm(n){if(Ia.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});Ia.set(n,e)}let Sa={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Ia.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Cd.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return _n(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Bm(n){Sa=n(Sa)}function Fm(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(oa(this),e,...t);return Cd.set(r,e.sort?e.sort():[e]),_n(r)}:Lm().includes(n)?function(...e){return n.apply(oa(this),e),_n(Pd.get(this))}:function(...e){return _n(n.apply(oa(this),e))}}function zm(n){return typeof n=="function"?Fm(n):(n instanceof IDBTransaction&&Vm(n),Dm(n,Nm())?new Proxy(n,Sa):n)}function _n(n){if(n instanceof IDBRequest)return Om(n);if(ia.has(n))return ia.get(n);const e=zm(n);return e!==n&&(ia.set(n,e),el.set(e,n)),e}const oa=n=>el.get(n);function $m(n,e,{blocked:t,upgrade:r,blocking:s,terminated:i}={}){const a=indexedDB.open(n,e),l=_n(a);return r&&a.addEventListener("upgradeneeded",c=>{r(_n(a.result),c.oldVersion,c.newVersion,_n(a.transaction),c)}),t&&a.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const Um=["get","getKey","getAll","getAllKeys","count"],qm=["put","add","delete","clear"],aa=new Map;function Zc(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(aa.get(e))return aa.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=qm.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Um.includes(t)))return;const i=async function(a,...l){const c=this.transaction(a,s?"readwrite":"readonly");let d=c.store;return r&&(d=d.index(l.shift())),(await Promise.all([d[t](...l),s&&c.done]))[0]};return aa.set(e,i),i}Bm(n=>({...n,get:(e,t,r)=>Zc(e,t)||n.get(e,t,r),has:(e,t)=>!!Zc(e,t)||n.has(e,t)}));/**
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
 */class jm{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Hm(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Hm(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const xa="@firebase/app",eu="0.10.13";/**
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
 */const Qt=new Za("@firebase/app"),Wm="@firebase/app-compat",Ym="@firebase/analytics-compat",Gm="@firebase/analytics",Km="@firebase/app-check-compat",Qm="@firebase/app-check",Jm="@firebase/auth",Xm="@firebase/auth-compat",Zm="@firebase/database",eg="@firebase/data-connect",tg="@firebase/database-compat",ng="@firebase/functions",rg="@firebase/functions-compat",sg="@firebase/installations",ig="@firebase/installations-compat",og="@firebase/messaging",ag="@firebase/messaging-compat",lg="@firebase/performance",cg="@firebase/performance-compat",ug="@firebase/remote-config",dg="@firebase/remote-config-compat",hg="@firebase/storage",fg="@firebase/storage-compat",pg="@firebase/firestore",mg="@firebase/vertexai-preview",gg="@firebase/firestore-compat",yg="firebase",vg="10.14.1";/**
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
 */const Aa="[DEFAULT]",_g={[xa]:"fire-core",[Wm]:"fire-core-compat",[Gm]:"fire-analytics",[Ym]:"fire-analytics-compat",[Qm]:"fire-app-check",[Km]:"fire-app-check-compat",[Jm]:"fire-auth",[Xm]:"fire-auth-compat",[Zm]:"fire-rtdb",[eg]:"fire-data-connect",[tg]:"fire-rtdb-compat",[ng]:"fire-fn",[rg]:"fire-fn-compat",[sg]:"fire-iid",[ig]:"fire-iid-compat",[og]:"fire-fcm",[ag]:"fire-fcm-compat",[lg]:"fire-perf",[cg]:"fire-perf-compat",[ug]:"fire-rc",[dg]:"fire-rc-compat",[hg]:"fire-gcs",[fg]:"fire-gcs-compat",[pg]:"fire-fst",[gg]:"fire-fst-compat",[mg]:"fire-vertex","fire-js":"fire-js",[yg]:"fire-js-all"};/**
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
 */const Yi=new Map,wg=new Map,Ra=new Map;function tu(n,e){try{n.container.addComponent(e)}catch(t){Qt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function $r(n){const e=n.name;if(Ra.has(e))return Qt.debug(`There were multiple attempts to register component ${e}.`),!1;Ra.set(e,n);for(const t of Yi.values())tu(t,n);for(const t of wg.values())tu(t,n);return!0}function tl(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function bt(n){return n.settings!==void 0}/**
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
 */const bg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},wn=new Qs("app","Firebase",bg);/**
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
 */class Eg{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Kn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw wn.create("app-deleted",{appName:this._name})}}/**
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
 */const Jr=vg;function kd(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Aa,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw wn.create("bad-app-name",{appName:String(s)});if(t||(t=Ad()),!t)throw wn.create("no-options");const i=Yi.get(s);if(i){if(Wi(t,i.options)&&Wi(r,i.config))return i;throw wn.create("duplicate-app",{appName:s})}const a=new Rm(s);for(const c of Ra.values())a.addComponent(c);const l=new Eg(t,r,a);return Yi.set(s,l),l}function Md(n=Aa){const e=Yi.get(n);if(!e&&n===Aa&&Ad())return kd();if(!e)throw wn.create("no-app",{appName:n});return e}function bn(n,e,t){var r;let s=(r=_g[n])!==null&&r!==void 0?r:n;t&&(s+=`-${t}`);const i=s.match(/\s|\//),a=e.match(/\s|\//);if(i||a){const l=[`Unable to register library "${s}" with version "${e}":`];i&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Qt.warn(l.join(" "));return}$r(new Kn(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const Tg="firebase-heartbeat-database",Ig=1,Os="firebase-heartbeat-store";let la=null;function Dd(){return la||(la=$m(Tg,Ig,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Os)}catch(t){console.warn(t)}}}}).catch(n=>{throw wn.create("idb-open",{originalErrorMessage:n.message})})),la}async function Sg(n){try{const t=(await Dd()).transaction(Os),r=await t.objectStore(Os).get(Nd(n));return await t.done,r}catch(e){if(e instanceof tn)Qt.warn(e.message);else{const t=wn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Qt.warn(t.message)}}}async function nu(n,e){try{const r=(await Dd()).transaction(Os,"readwrite");await r.objectStore(Os).put(e,Nd(n)),await r.done}catch(t){if(t instanceof tn)Qt.warn(t.message);else{const r=wn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Qt.warn(r.message)}}}function Nd(n){return`${n.name}!${n.options.appId}`}/**
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
 */const xg=1024,Ag=30*24*60*60*1e3;class Rg{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Cg(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=ru();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const l=new Date(a.date).valueOf();return Date.now()-l<=Ag}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Qt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ru(),{heartbeatsToSend:r,unsentEntries:s}=Pg(this._heartbeatsCache.heartbeats),i=Hi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return Qt.warn(t),""}}}function ru(){return new Date().toISOString().substring(0,10)}function Pg(n,e=xg){const t=[];let r=n.slice();for(const s of n){const i=t.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),su(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),su(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class Cg{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return gm()?ym().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Sg(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return nu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return nu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function su(n){return Hi(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function kg(n){$r(new Kn("platform-logger",e=>new jm(e),"PRIVATE")),$r(new Kn("heartbeat",e=>new Rg(e),"PRIVATE")),bn(xa,eu,n),bn(xa,eu,"esm2017"),bn("fire-js","")}kg("");var Mg="firebase",Dg="10.14.1";/**
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
 */bn(Mg,Dg,"app");function nl(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(t[r[s]]=n[r[s]]);return t}function Ld(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Ng=Ld,Od=new Qs("auth","Firebase",Ld());/**
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
 */const Gi=new Za("@firebase/auth");function Lg(n,...e){Gi.logLevel<=te.WARN&&Gi.warn(`Auth (${Jr}): ${n}`,...e)}function Ni(n,...e){Gi.logLevel<=te.ERROR&&Gi.error(`Auth (${Jr}): ${n}`,...e)}/**
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
 */function gt(n,...e){throw sl(n,...e)}function Et(n,...e){return sl(n,...e)}function rl(n,e,t){const r=Object.assign(Object.assign({},Ng()),{[e]:t});return new Qs("auth","Firebase",r).create(e,{appName:n.name})}function Gt(n){return rl(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Og(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&gt(n,"argument-error"),rl(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function sl(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Od.create(n,...e)}function W(n,e,...t){if(!n)throw sl(e,...t)}function Ht(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Ni(e),new Error(e)}function Jt(n,e){n||Ht(e)}/**
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
 */function Pa(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Vg(){return iu()==="http:"||iu()==="https:"}function iu(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function Bg(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Vg()||hm()||"connection"in navigator)?navigator.onLine:!0}function Fg(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class Xs{constructor(e,t){this.shortDelay=e,this.longDelay=t,Jt(t>e,"Short delay should be less than long delay!"),this.isMobile=cm()||fm()}get(){return Bg()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function il(n,e){Jt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class Vd{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ht("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ht("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ht("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const zg={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const $g=new Xs(3e4,6e4);function nn(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Vt(n,e,t,r,s={}){return Bd(n,s,async()=>{let i={},a={};r&&(e==="GET"?a=r:i={body:JSON.stringify(r)});const l=Js(Object.assign({key:n.config.apiKey},a)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:e,headers:c},i);return dm()||(d.referrerPolicy="no-referrer"),Vd.fetch()(Fd(n,n.config.apiHost,t,l),d)})}async function Bd(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},zg),e);try{const s=new qg(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw Pi(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const l=i.ok?a.errorMessage:a.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Pi(n,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw Pi(n,"email-already-in-use",a);if(c==="USER_DISABLED")throw Pi(n,"user-disabled",a);const f=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw rl(n,f,d);gt(n,f)}}catch(s){if(s instanceof tn)throw s;gt(n,"network-request-failed",{message:String(s)})}}async function Zs(n,e,t,r,s={}){const i=await Vt(n,e,t,r,s);return"mfaPendingCredential"in i&&gt(n,"multi-factor-auth-required",{_serverResponse:i}),i}function Fd(n,e,t,r){const s=`${e}${t}?${r}`;return n.config.emulator?il(n.config,s):`${n.config.apiScheme}://${s}`}function Ug(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class qg{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Et(this.auth,"network-request-failed")),$g.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Pi(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=Et(n,e,r);return s.customData._tokenResponse=t,s}function ou(n){return n!==void 0&&n.enterprise!==void 0}class jg{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Ug(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function Hg(n,e){return Vt(n,"GET","/v2/recaptchaConfig",nn(n,e))}/**
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
 */async function Wg(n,e){return Vt(n,"POST","/v1/accounts:delete",e)}async function zd(n,e){return Vt(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function Rs(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Yg(n,e=!1){const t=Ne(n),r=await t.getIdToken(e),s=ol(r);W(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:Rs(ca(s.auth_time)),issuedAtTime:Rs(ca(s.iat)),expirationTime:Rs(ca(s.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function ca(n){return Number(n)*1e3}function ol(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Ni("JWT malformed, contained fewer than 3 sections"),null;try{const s=Sd(t);return s?JSON.parse(s):(Ni("Failed to decode base64 JWT payload"),null)}catch(s){return Ni("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function au(n){const e=ol(n);return W(e,"internal-error"),W(typeof e.exp<"u","internal-error"),W(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Ur(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof tn&&Gg(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Gg({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class Kg{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Ca{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Rs(this.lastLoginAt),this.creationTime=Rs(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Ki(n){var e;const t=n.auth,r=await n.getIdToken(),s=await Ur(n,zd(t,{idToken:r}));W(s==null?void 0:s.users.length,t,"internal-error");const i=s.users[0];n._notifyReloadListener(i);const a=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?$d(i.providerUserInfo):[],l=Jg(n.providerData,a),c=n.isAnonymous,d=!(n.email&&i.passwordHash)&&!(l!=null&&l.length),f=c?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new Ca(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function Qg(n){const e=Ne(n);await Ki(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Jg(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function $d(n){return n.map(e=>{var{providerId:t}=e,r=nl(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
 */async function Xg(n,e){const t=await Bd(n,{},async()=>{const r=Js({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=Fd(n,s,"/v1/token",`key=${i}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Vd.fetch()(a,{method:"POST",headers:l,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Zg(n,e){return Vt(n,"POST","/v2/accounts:revokeToken",nn(n,e))}/**
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
 */class Nr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){W(e.idToken,"internal-error"),W(typeof e.idToken<"u","internal-error"),W(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):au(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){W(e.length!==0,"internal-error");const t=au(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(W(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:i}=await Xg(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:i}=t,a=new Nr;return r&&(W(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(W(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),i&&(W(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Nr,this.toJSON())}_performRefresh(){return Ht("not implemented")}}/**
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
 */function dn(n,e){W(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Wt{constructor(e){var{uid:t,auth:r,stsTokenManager:s}=e,i=nl(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Kg(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ca(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await Ur(this,this.stsTokenManager.getToken(this.auth,e));return W(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Yg(this,e)}reload(){return Qg(this)}_assign(e){this!==e&&(W(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Wt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){W(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Ki(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(bt(this.auth.app))return Promise.reject(Gt(this.auth));const e=await this.getIdToken();return await Ur(this,Wg(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,s,i,a,l,c,d,f;const m=(r=t.displayName)!==null&&r!==void 0?r:void 0,v=(s=t.email)!==null&&s!==void 0?s:void 0,b=(i=t.phoneNumber)!==null&&i!==void 0?i:void 0,T=(a=t.photoURL)!==null&&a!==void 0?a:void 0,A=(l=t.tenantId)!==null&&l!==void 0?l:void 0,R=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,x=(d=t.createdAt)!==null&&d!==void 0?d:void 0,M=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:D,emailVerified:C,isAnonymous:O,providerData:V,stsTokenManager:E}=t;W(D&&E,e,"internal-error");const g=Nr.fromJSON(this.name,E);W(typeof D=="string",e,"internal-error"),dn(m,e.name),dn(v,e.name),W(typeof C=="boolean",e,"internal-error"),W(typeof O=="boolean",e,"internal-error"),dn(b,e.name),dn(T,e.name),dn(A,e.name),dn(R,e.name),dn(x,e.name),dn(M,e.name);const y=new Wt({uid:D,auth:e,email:v,emailVerified:C,displayName:m,isAnonymous:O,photoURL:T,phoneNumber:b,tenantId:A,stsTokenManager:g,createdAt:x,lastLoginAt:M});return V&&Array.isArray(V)&&(y.providerData=V.map(_=>Object.assign({},_))),R&&(y._redirectEventId=R),y}static async _fromIdTokenResponse(e,t,r=!1){const s=new Nr;s.updateFromServerResponse(t);const i=new Wt({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Ki(i),i}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];W(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?$d(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),l=new Nr;l.updateFromIdToken(r);const c=new Wt({uid:s.localId,auth:e,stsTokenManager:l,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Ca(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
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
 */const lu=new Map;function Yt(n){Jt(n instanceof Function,"Expected a class definition");let e=lu.get(n);return e?(Jt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,lu.set(n,e),e)}/**
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
 */class Ud{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Ud.type="NONE";const cu=Ud;/**
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
 */function Li(n,e,t){return`firebase:${n}:${e}:${t}`}class Lr{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=Li(this.userKey,s.apiKey,i),this.fullPersistenceKey=Li("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Wt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Lr(Yt(cu),e,r);const s=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=s[0]||Yt(cu);const a=Li(r,e.config.apiKey,e.name);let l=null;for(const d of t)try{const f=await d._get(a);if(f){const m=Wt._fromJSON(e,f);d!==i&&(l=m),i=d;break}}catch{}const c=s.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new Lr(i,e,r):(i=c[0],l&&await i._set(a,l.toJSON()),await Promise.all(t.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new Lr(i,e,r))}}/**
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
 */function uu(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Wd(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(qd(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Gd(e))return"Blackberry";if(Kd(e))return"Webos";if(jd(e))return"Safari";if((e.includes("chrome/")||Hd(e))&&!e.includes("edge/"))return"Chrome";if(Yd(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function qd(n=Ze()){return/firefox\//i.test(n)}function jd(n=Ze()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Hd(n=Ze()){return/crios\//i.test(n)}function Wd(n=Ze()){return/iemobile/i.test(n)}function Yd(n=Ze()){return/android/i.test(n)}function Gd(n=Ze()){return/blackberry/i.test(n)}function Kd(n=Ze()){return/webos/i.test(n)}function al(n=Ze()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function ey(n=Ze()){var e;return al(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function ty(){return pm()&&document.documentMode===10}function Qd(n=Ze()){return al(n)||Yd(n)||Kd(n)||Gd(n)||/windows phone/i.test(n)||Wd(n)}/**
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
 */function Jd(n,e=[]){let t;switch(n){case"Browser":t=uu(Ze());break;case"Worker":t=`${uu(Ze())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Jr}/${r}`}/**
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
 */class ny{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=i=>new Promise((a,l)=>{try{const c=e(i);a(c)}catch(c){l(c)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function ry(n,e={}){return Vt(n,"GET","/v2/passwordPolicy",nn(n,e))}/**
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
 */const sy=6;class iy{constructor(e){var t,r,s,i;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:sy,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,s,i,a,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(r=c.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsLowercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
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
 */class oy{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new du(this),this.idTokenSubscription=new du(this),this.beforeStateQueue=new ny(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Od,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Yt(t)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await Lr.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await zd(this,{idToken:e}),r=await Wt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(bt(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(e);(!a||a===l)&&(c!=null&&c.user)&&(s=c.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return W(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Ki(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Fg()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(bt(this.app))return Promise.reject(Gt(this));const t=e?Ne(e):null;return t&&W(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&W(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return bt(this.app)?Promise.reject(Gt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return bt(this.app)?Promise.reject(Gt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Yt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await ry(this),t=new iy(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Qs("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Zg(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Yt(e)||this._popupRedirectResolver;W(t,this,"argument-error"),this.redirectPersistenceManager=await Lr.create(this,[Yt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(W(l,this,"internal-error"),l.then(()=>{a||i(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,r,s);return()=>{a=!0,c()}}else{const c=e.addObserver(t);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return W(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Jd(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&Lg(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function rn(n){return Ne(n)}class du{constructor(e){this.auth=e,this.observer=null,this.addObserver=Em(t=>this.observer=t)}get next(){return W(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let mo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ay(n){mo=n}function Xd(n){return mo.loadJS(n)}function ly(){return mo.recaptchaEnterpriseScript}function cy(){return mo.gapiScript}function uy(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const dy="recaptcha-enterprise",hy="NO_RECAPTCHA";class fy{constructor(e){this.type=dy,this.auth=rn(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,l)=>{Hg(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new jg(c);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,a(d.siteKey)}}).catch(c=>{l(c)})})}function s(i,a,l){const c=window.grecaptcha;ou(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:e}).then(d=>{a(d)}).catch(()=>{a(hy)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,a)=>{r(this.auth).then(l=>{if(!t&&ou(window.grecaptcha))s(l,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=ly();c.length!==0&&(c+=l),Xd(c).then(()=>{s(l,i,a)}).catch(d=>{a(d)})}}).catch(l=>{a(l)})})}}async function hu(n,e,t,r=!1){const s=new fy(n);let i;try{i=await s.verify(t)}catch{i=await s.verify(t,!0)}const a=Object.assign({},e);return r?Object.assign(a,{captchaResp:i}):Object.assign(a,{captchaResponse:i}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Qi(n,e,t,r){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await hu(n,e,t,t==="getOobCode");return r(n,i)}else return r(n,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await hu(n,e,t,t==="getOobCode");return r(n,a)}else return Promise.reject(i)})}/**
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
 */function py(n,e){const t=tl(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(Wi(i,e??{}))return s;gt(s,"already-initialized")}return t.initialize({options:e})}function my(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Yt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function gy(n,e,t){const r=rn(n);W(r._canInitEmulator,r,"emulator-config-failed"),W(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=Zd(e),{host:a,port:l}=yy(e),c=l===null?"":`:${l}`;r.config.emulator={url:`${i}//${a}${c}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),vy()}function Zd(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function yy(n){const e=Zd(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:fu(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:fu(a)}}}function fu(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function vy(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class ll{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ht("not implemented")}_getIdTokenResponse(e){return Ht("not implemented")}_linkToIdToken(e,t){return Ht("not implemented")}_getReauthenticationResolver(e){return Ht("not implemented")}}async function _y(n,e){return Vt(n,"POST","/v1/accounts:signUp",e)}/**
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
 */async function wy(n,e){return Zs(n,"POST","/v1/accounts:signInWithPassword",nn(n,e))}async function by(n,e){return Vt(n,"POST","/v1/accounts:sendOobCode",nn(n,e))}async function Ey(n,e){return by(n,e)}/**
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
 */async function Ty(n,e){return Zs(n,"POST","/v1/accounts:signInWithEmailLink",nn(n,e))}async function Iy(n,e){return Zs(n,"POST","/v1/accounts:signInWithEmailLink",nn(n,e))}/**
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
 */class Vs extends ll{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new Vs(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new Vs(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qi(e,t,"signInWithPassword",wy);case"emailLink":return Ty(e,{email:this._email,oobCode:this._password});default:gt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qi(e,r,"signUpPassword",_y);case"emailLink":return Iy(e,{idToken:t,email:this._email,oobCode:this._password});default:gt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function Or(n,e){return Zs(n,"POST","/v1/accounts:signInWithIdp",nn(n,e))}/**
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
 */const Sy="http://localhost";class Qn extends ll{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Qn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):gt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=t,i=nl(t,["providerId","signInMethod"]);if(!r||!s)return null;const a=new Qn(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Or(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Or(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Or(e,t)}buildRequest(){const e={requestUri:Sy,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Js(t)}return e}}/**
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
 */function xy(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Ay(n){const e=Es(Ts(n)).link,t=e?Es(Ts(e)).deep_link_id:null,r=Es(Ts(n)).deep_link_id;return(r?Es(Ts(r)).link:null)||r||t||e||n}class cl{constructor(e){var t,r,s,i,a,l;const c=Es(Ts(e)),d=(t=c.apiKey)!==null&&t!==void 0?t:null,f=(r=c.oobCode)!==null&&r!==void 0?r:null,m=xy((s=c.mode)!==null&&s!==void 0?s:null);W(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(a=c.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const t=Ay(e);try{return new cl(t)}catch{return null}}}/**
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
 */class Xr{constructor(){this.providerId=Xr.PROVIDER_ID}static credential(e,t){return Vs._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=cl.parseLink(t);return W(r,"argument-error"),Vs._fromEmailAndCode(e,r.code,r.tenantId)}}Xr.PROVIDER_ID="password";Xr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Xr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class ul{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class ei extends ul{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class fn extends ei{constructor(){super("facebook.com")}static credential(e){return Qn._fromParams({providerId:fn.PROVIDER_ID,signInMethod:fn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return fn.credentialFromTaggedObject(e)}static credentialFromError(e){return fn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return fn.credential(e.oauthAccessToken)}catch{return null}}}fn.FACEBOOK_SIGN_IN_METHOD="facebook.com";fn.PROVIDER_ID="facebook.com";/**
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
 */class jt extends ei{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Qn._fromParams({providerId:jt.PROVIDER_ID,signInMethod:jt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return jt.credentialFromTaggedObject(e)}static credentialFromError(e){return jt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return jt.credential(t,r)}catch{return null}}}jt.GOOGLE_SIGN_IN_METHOD="google.com";jt.PROVIDER_ID="google.com";/**
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
 */class pn extends ei{constructor(){super("github.com")}static credential(e){return Qn._fromParams({providerId:pn.PROVIDER_ID,signInMethod:pn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return pn.credentialFromTaggedObject(e)}static credentialFromError(e){return pn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return pn.credential(e.oauthAccessToken)}catch{return null}}}pn.GITHUB_SIGN_IN_METHOD="github.com";pn.PROVIDER_ID="github.com";/**
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
 */class mn extends ei{constructor(){super("twitter.com")}static credential(e,t){return Qn._fromParams({providerId:mn.PROVIDER_ID,signInMethod:mn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return mn.credentialFromTaggedObject(e)}static credentialFromError(e){return mn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return mn.credential(t,r)}catch{return null}}}mn.TWITTER_SIGN_IN_METHOD="twitter.com";mn.PROVIDER_ID="twitter.com";/**
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
 */async function Ry(n,e){return Zs(n,"POST","/v1/accounts:signUp",nn(n,e))}/**
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
 */class Jn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const i=await Wt._fromIdTokenResponse(e,r,s),a=pu(r);return new Jn({user:i,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=pu(r);return new Jn({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function pu(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class Ji extends tn{constructor(e,t,r,s){var i;super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Ji.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Ji(e,t,r,s)}}function eh(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Ji._fromErrorAndOperation(n,i,e,r):i})}async function Py(n,e,t=!1){const r=await Ur(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Jn._forOperation(n,"link",r)}/**
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
 */async function Cy(n,e,t=!1){const{auth:r}=n;if(bt(r.app))return Promise.reject(Gt(r));const s="reauthenticate";try{const i=await Ur(n,eh(r,s,e,n),t);W(i.idToken,r,"internal-error");const a=ol(i.idToken);W(a,r,"internal-error");const{sub:l}=a;return W(n.uid===l,r,"user-mismatch"),Jn._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&gt(r,"user-mismatch"),i}}/**
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
 */async function th(n,e,t=!1){if(bt(n.app))return Promise.reject(Gt(n));const r="signIn",s=await eh(n,r,e),i=await Jn._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}async function ky(n,e){return th(rn(n),e)}/**
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
 */async function nh(n){const e=rn(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function My(n,e,t){const r=rn(n);await Qi(r,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",Ey)}async function Dy(n,e,t){if(bt(n.app))return Promise.reject(Gt(n));const r=rn(n),a=await Qi(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Ry).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&nh(n),c}),l=await Jn._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(l.user),l}function Ny(n,e,t){return bt(n.app)?Promise.reject(Gt(n)):ky(Ne(n),Xr.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&nh(n),r})}/**
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
 */async function Ly(n,e){return Vt(n,"POST","/v1/accounts:update",e)}/**
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
 */async function Oy(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=Ne(n),i={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},a=await Ur(r,Ly(r.auth,i));r.displayName=a.displayName||null,r.photoURL=a.photoUrl||null;const l=r.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=r.displayName,l.photoURL=r.photoURL),await r._updateTokensIfNecessary(a)}function Vy(n,e,t,r){return Ne(n).onIdTokenChanged(e,t,r)}function By(n,e,t){return Ne(n).beforeAuthStateChanged(e,t)}function Fy(n,e,t,r){return Ne(n).onAuthStateChanged(e,t,r)}function zy(n){return Ne(n).signOut()}const Xi="__sak";/**
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
 */class rh{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Xi,"1"),this.storage.removeItem(Xi),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const $y=1e3,Uy=10;class sh extends rh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Qd(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,l,c)=>{this.notifyListeners(a,c)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);ty()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Uy):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},$y)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}sh.type="LOCAL";const qy=sh;/**
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
 */class ih extends rh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}ih.type="SESSION";const oh=ih;/**
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
 */function jy(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class go{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new go(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:i}=t.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const l=Array.from(a).map(async d=>d(t.origin,i)),c=await jy(l);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}go.receivers=[];/**
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
 */function dl(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class Hy{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((l,c)=>{const d=dl("",20);s.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(m){const v=m;if(v.data.eventId===d)switch(v.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(v.data.response);break;default:clearTimeout(f),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function Rt(){return window}function Wy(n){Rt().location.href=n}/**
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
 */function ah(){return typeof Rt().WorkerGlobalScope<"u"&&typeof Rt().importScripts=="function"}async function Yy(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Gy(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function Ky(){return ah()?self:null}/**
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
 */const lh="firebaseLocalStorageDb",Qy=1,Zi="firebaseLocalStorage",ch="fbase_key";class ti{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function yo(n,e){return n.transaction([Zi],e?"readwrite":"readonly").objectStore(Zi)}function Jy(){const n=indexedDB.deleteDatabase(lh);return new ti(n).toPromise()}function ka(){const n=indexedDB.open(lh,Qy);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Zi,{keyPath:ch})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Zi)?e(r):(r.close(),await Jy(),e(await ka()))})})}async function mu(n,e,t){const r=yo(n,!0).put({[ch]:e,value:t});return new ti(r).toPromise()}async function Xy(n,e){const t=yo(n,!1).get(e),r=await new ti(t).toPromise();return r===void 0?null:r.value}function gu(n,e){const t=yo(n,!0).delete(e);return new ti(t).toPromise()}const Zy=800,ev=3;class uh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ka(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>ev)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ah()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=go._getInstance(Ky()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await Yy(),!this.activeServiceWorker)return;this.sender=new Hy(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Gy()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await ka();return await mu(e,Xi,"1"),await gu(e,Xi),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>mu(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Xy(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>gu(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=yo(s,!1).getAll();return new ti(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Zy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}uh.type="LOCAL";const tv=uh;new Xs(3e4,6e4);/**
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
 */function dh(n,e){return e?Yt(e):(W(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class hl extends ll{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Or(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Or(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Or(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function nv(n){return th(n.auth,new hl(n),n.bypassAuthState)}function rv(n){const{auth:e,user:t}=n;return W(t,e,"internal-error"),Cy(t,new hl(n),n.bypassAuthState)}async function sv(n){const{auth:e,user:t}=n;return W(t,e,"internal-error"),Py(t,new hl(n),n.bypassAuthState)}/**
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
 */class hh{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:a,type:l}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return nv;case"linkViaPopup":case"linkViaRedirect":return sv;case"reauthViaPopup":case"reauthViaRedirect":return rv;default:gt(this.auth,"internal-error")}}resolve(e){Jt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Jt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const iv=new Xs(2e3,1e4);async function ov(n,e,t){if(bt(n.app))return Promise.reject(Et(n,"operation-not-supported-in-this-environment"));const r=rn(n);Og(n,e,ul);const s=dh(r,t);return new Hn(r,"signInViaPopup",e,s).executeNotNull()}class Hn extends hh{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,Hn.currentPopupAction&&Hn.currentPopupAction.cancel(),Hn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return W(e,this.auth,"internal-error"),e}async onExecution(){Jt(this.filter.length===1,"Popup operations only handle one event");const e=dl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Et(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Et(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Hn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Et(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,iv.get())};e()}}Hn.currentPopupAction=null;/**
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
 */const av="pendingRedirect",Oi=new Map;class lv extends hh{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Oi.get(this.auth._key());if(!e){try{const r=await cv(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Oi.set(this.auth._key(),e)}return this.bypassAuthState||Oi.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function cv(n,e){const t=hv(e),r=dv(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function uv(n,e){Oi.set(n._key(),e)}function dv(n){return Yt(n._redirectPersistence)}function hv(n){return Li(av,n.config.apiKey,n.name)}async function fv(n,e,t=!1){if(bt(n.app))return Promise.reject(Gt(n));const r=rn(n),s=dh(r,e),a=await new lv(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
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
 */const pv=10*60*1e3;class mv{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!gv(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!fh(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(Et(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=pv&&this.cachedEventUids.clear(),this.cachedEventUids.has(yu(e))}saveEventToCache(e){this.cachedEventUids.add(yu(e)),this.lastProcessedEventTime=Date.now()}}function yu(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function fh({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function gv(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return fh(n);default:return!1}}/**
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
 */async function yv(n,e={}){return Vt(n,"GET","/v1/projects",e)}/**
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
 */const vv=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,_v=/^https?/;async function wv(n){if(n.config.emulator)return;const{authorizedDomains:e}=await yv(n);for(const t of e)try{if(bv(t))return}catch{}gt(n,"unauthorized-domain")}function bv(n){const e=Pa(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!_v.test(t))return!1;if(vv.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const Ev=new Xs(3e4,6e4);function vu(){const n=Rt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Tv(n){return new Promise((e,t)=>{var r,s,i;function a(){vu(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{vu(),t(Et(n,"network-request-failed"))},timeout:Ev.get()})}if(!((s=(r=Rt().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=Rt().gapi)===null||i===void 0)&&i.load)a();else{const l=uy("iframefcb");return Rt()[l]=()=>{gapi.load?a():t(Et(n,"network-request-failed"))},Xd(`${cy()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw Vi=null,e})}let Vi=null;function Iv(n){return Vi=Vi||Tv(n),Vi}/**
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
 */const Sv=new Xs(5e3,15e3),xv="__/auth/iframe",Av="emulator/auth/iframe",Rv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Pv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Cv(n){const e=n.config;W(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?il(e,Av):`https://${n.config.authDomain}/${xv}`,r={apiKey:e.apiKey,appName:n.name,v:Jr},s=Pv.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${Js(r).slice(1)}`}async function kv(n){const e=await Iv(n),t=Rt().gapi;return W(t,n,"internal-error"),e.open({where:document.body,url:Cv(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Rv,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=Et(n,"network-request-failed"),l=Rt().setTimeout(()=>{i(a)},Sv.get());function c(){Rt().clearTimeout(l),s(r)}r.ping(c).then(c,()=>{i(a)})}))}/**
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
 */const Mv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Dv=500,Nv=600,Lv="_blank",Ov="http://localhost";class _u{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Vv(n,e,t,r=Dv,s=Nv){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const c=Object.assign(Object.assign({},Mv),{width:r.toString(),height:s.toString(),top:i,left:a}),d=Ze().toLowerCase();t&&(l=Hd(d)?Lv:t),qd(d)&&(e=e||Ov,c.scrollbars="yes");const f=Object.entries(c).reduce((v,[b,T])=>`${v}${b}=${T},`,"");if(ey(d)&&l!=="_self")return Bv(e||"",l),new _u(null);const m=window.open(e||"",l,f);W(m,n,"popup-blocked");try{m.focus()}catch{}return new _u(m)}function Bv(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const Fv="__/auth/handler",zv="emulator/auth/handler",$v=encodeURIComponent("fac");async function wu(n,e,t,r,s,i){W(n.config.authDomain,n,"auth-domain-config-required"),W(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Jr,eventId:s};if(e instanceof ul){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",bm(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof ei){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),d=c?`#${$v}=${encodeURIComponent(c)}`:"";return`${Uv(n)}?${Js(l).slice(1)}${d}`}function Uv({config:n}){return n.emulator?il(n,zv):`https://${n.authDomain}/${Fv}`}/**
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
 */const ua="webStorageSupport";class qv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=oh,this._completeRedirectFn=fv,this._overrideRedirectResult=uv}async _openPopup(e,t,r,s){var i;Jt((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await wu(e,t,r,Pa(),s);return Vv(e,a,dl())}async _openRedirect(e,t,r,s){await this._originValidation(e);const i=await wu(e,t,r,Pa(),s);return Wy(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(Jt(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await kv(e),r=new mv(e);return t.register("authEvent",s=>(W(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(ua,{type:ua},s=>{var i;const a=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[ua];a!==void 0&&t(!!a),gt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=wv(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Qd()||jd()||al()}}const jv=qv;var bu="@firebase/auth",Eu="1.7.9";/**
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
 */class Hv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){W(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function Wv(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Yv(n){$r(new Kn("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=r.options;W(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Jd(n)},d=new oy(r,s,i,c);return my(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),$r(new Kn("auth-internal",e=>{const t=rn(e.getProvider("auth").getImmediate());return(r=>new Hv(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),bn(bu,Eu,Wv(n)),bn(bu,Eu,"esm2017")}/**
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
 */const Gv=5*60,Kv=Rd("authIdTokenMaxAge")||Gv;let Tu=null;const Qv=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Kv)return;const s=t==null?void 0:t.token;Tu!==s&&(Tu=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Jv(n=Md()){const e=tl(n,"auth");if(e.isInitialized())return e.getImmediate();const t=py(n,{popupRedirectResolver:jv,persistence:[tv,qy,oh]}),r=Rd("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=Qv(i.toString());By(t,a,()=>a(t.currentUser)),Vy(t,l=>a(l))}}const s=xd("auth");return s&&gy(t,`http://${s}`),t}function Xv(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}ay({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const i=Et("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",Xv().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Yv("Browser");var Iu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Yn,ph;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,g){function y(){}y.prototype=g.prototype,E.D=g.prototype,E.prototype=new y,E.prototype.constructor=E,E.C=function(_,I,S){for(var w=Array(arguments.length-2),oe=2;oe<arguments.length;oe++)w[oe-2]=arguments[oe];return g.prototype[I].apply(_,w)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,g,y){y||(y=0);var _=Array(16);if(typeof g=="string")for(var I=0;16>I;++I)_[I]=g.charCodeAt(y++)|g.charCodeAt(y++)<<8|g.charCodeAt(y++)<<16|g.charCodeAt(y++)<<24;else for(I=0;16>I;++I)_[I]=g[y++]|g[y++]<<8|g[y++]<<16|g[y++]<<24;g=E.g[0],y=E.g[1],I=E.g[2];var S=E.g[3],w=g+(S^y&(I^S))+_[0]+3614090360&4294967295;g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[1]+3905402710&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[2]+606105819&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[3]+3250441966&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(S^y&(I^S))+_[4]+4118548399&4294967295,g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[5]+1200080426&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[6]+2821735955&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[7]+4249261313&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(S^y&(I^S))+_[8]+1770035416&4294967295,g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[9]+2336552879&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[10]+4294925233&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[11]+2304563134&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(S^y&(I^S))+_[12]+1804603682&4294967295,g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[13]+4254626195&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[14]+2792965006&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[15]+1236535329&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(I^S&(y^I))+_[1]+4129170786&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[6]+3225465664&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[11]+643717713&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[0]+3921069994&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(I^S&(y^I))+_[5]+3593408605&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[10]+38016083&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[15]+3634488961&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[4]+3889429448&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(I^S&(y^I))+_[9]+568446438&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[14]+3275163606&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[3]+4107603335&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[8]+1163531501&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(I^S&(y^I))+_[13]+2850285829&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[2]+4243563512&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[7]+1735328473&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[12]+2368359562&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(y^I^S)+_[5]+4294588738&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[8]+2272392833&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[11]+1839030562&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[14]+4259657740&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(y^I^S)+_[1]+2763975236&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[4]+1272893353&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[7]+4139469664&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[10]+3200236656&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(y^I^S)+_[13]+681279174&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[0]+3936430074&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[3]+3572445317&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[6]+76029189&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(y^I^S)+_[9]+3654602809&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[12]+3873151461&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[15]+530742520&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[2]+3299628645&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(I^(y|~S))+_[0]+4096336452&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[7]+1126891415&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[14]+2878612391&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[5]+4237533241&4294967295,y=I+(w<<21&4294967295|w>>>11),w=g+(I^(y|~S))+_[12]+1700485571&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[3]+2399980690&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[10]+4293915773&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[1]+2240044497&4294967295,y=I+(w<<21&4294967295|w>>>11),w=g+(I^(y|~S))+_[8]+1873313359&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[15]+4264355552&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[6]+2734768916&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[13]+1309151649&4294967295,y=I+(w<<21&4294967295|w>>>11),w=g+(I^(y|~S))+_[4]+4149444226&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[11]+3174756917&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[2]+718787259&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[9]+3951481745&4294967295,E.g[0]=E.g[0]+g&4294967295,E.g[1]=E.g[1]+(I+(w<<21&4294967295|w>>>11))&4294967295,E.g[2]=E.g[2]+I&4294967295,E.g[3]=E.g[3]+S&4294967295}r.prototype.u=function(E,g){g===void 0&&(g=E.length);for(var y=g-this.blockSize,_=this.B,I=this.h,S=0;S<g;){if(I==0)for(;S<=y;)s(this,E,S),S+=this.blockSize;if(typeof E=="string"){for(;S<g;)if(_[I++]=E.charCodeAt(S++),I==this.blockSize){s(this,_),I=0;break}}else for(;S<g;)if(_[I++]=E[S++],I==this.blockSize){s(this,_),I=0;break}}this.h=I,this.o+=g},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var g=1;g<E.length-8;++g)E[g]=0;var y=8*this.o;for(g=E.length-8;g<E.length;++g)E[g]=y&255,y/=256;for(this.u(E),E=Array(16),g=y=0;4>g;++g)for(var _=0;32>_;_+=8)E[y++]=this.g[g]>>>_&255;return E};function i(E,g){var y=l;return Object.prototype.hasOwnProperty.call(y,E)?y[E]:y[E]=g(E)}function a(E,g){this.h=g;for(var y=[],_=!0,I=E.length-1;0<=I;I--){var S=E[I]|0;_&&S==g||(y[I]=S,_=!1)}this.g=y}var l={};function c(E){return-128<=E&&128>E?i(E,function(g){return new a([g|0],0>g?-1:0)}):new a([E|0],0>E?-1:0)}function d(E){if(isNaN(E)||!isFinite(E))return m;if(0>E)return R(d(-E));for(var g=[],y=1,_=0;E>=y;_++)g[_]=E/y|0,y*=4294967296;return new a(g,0)}function f(E,g){if(E.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(E.charAt(0)=="-")return R(f(E.substring(1),g));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(g,8)),_=m,I=0;I<E.length;I+=8){var S=Math.min(8,E.length-I),w=parseInt(E.substring(I,I+S),g);8>S?(S=d(Math.pow(g,S)),_=_.j(S).add(d(w))):(_=_.j(y),_=_.add(d(w)))}return _}var m=c(0),v=c(1),b=c(16777216);n=a.prototype,n.m=function(){if(A(this))return-R(this).m();for(var E=0,g=1,y=0;y<this.g.length;y++){var _=this.i(y);E+=(0<=_?_:4294967296+_)*g,g*=4294967296}return E},n.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(T(this))return"0";if(A(this))return"-"+R(this).toString(E);for(var g=d(Math.pow(E,6)),y=this,_="";;){var I=C(y,g).g;y=x(y,I.j(g));var S=((0<y.g.length?y.g[0]:y.h)>>>0).toString(E);if(y=I,T(y))return S+_;for(;6>S.length;)S="0"+S;_=S+_}},n.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function T(E){if(E.h!=0)return!1;for(var g=0;g<E.g.length;g++)if(E.g[g]!=0)return!1;return!0}function A(E){return E.h==-1}n.l=function(E){return E=x(this,E),A(E)?-1:T(E)?0:1};function R(E){for(var g=E.g.length,y=[],_=0;_<g;_++)y[_]=~E.g[_];return new a(y,~E.h).add(v)}n.abs=function(){return A(this)?R(this):this},n.add=function(E){for(var g=Math.max(this.g.length,E.g.length),y=[],_=0,I=0;I<=g;I++){var S=_+(this.i(I)&65535)+(E.i(I)&65535),w=(S>>>16)+(this.i(I)>>>16)+(E.i(I)>>>16);_=w>>>16,S&=65535,w&=65535,y[I]=w<<16|S}return new a(y,y[y.length-1]&-2147483648?-1:0)};function x(E,g){return E.add(R(g))}n.j=function(E){if(T(this)||T(E))return m;if(A(this))return A(E)?R(this).j(R(E)):R(R(this).j(E));if(A(E))return R(this.j(R(E)));if(0>this.l(b)&&0>E.l(b))return d(this.m()*E.m());for(var g=this.g.length+E.g.length,y=[],_=0;_<2*g;_++)y[_]=0;for(_=0;_<this.g.length;_++)for(var I=0;I<E.g.length;I++){var S=this.i(_)>>>16,w=this.i(_)&65535,oe=E.i(I)>>>16,Ce=E.i(I)&65535;y[2*_+2*I]+=w*Ce,M(y,2*_+2*I),y[2*_+2*I+1]+=S*Ce,M(y,2*_+2*I+1),y[2*_+2*I+1]+=w*oe,M(y,2*_+2*I+1),y[2*_+2*I+2]+=S*oe,M(y,2*_+2*I+2)}for(_=0;_<g;_++)y[_]=y[2*_+1]<<16|y[2*_];for(_=g;_<2*g;_++)y[_]=0;return new a(y,0)};function M(E,g){for(;(E[g]&65535)!=E[g];)E[g+1]+=E[g]>>>16,E[g]&=65535,g++}function D(E,g){this.g=E,this.h=g}function C(E,g){if(T(g))throw Error("division by zero");if(T(E))return new D(m,m);if(A(E))return g=C(R(E),g),new D(R(g.g),R(g.h));if(A(g))return g=C(E,R(g)),new D(R(g.g),g.h);if(30<E.g.length){if(A(E)||A(g))throw Error("slowDivide_ only works with positive integers.");for(var y=v,_=g;0>=_.l(E);)y=O(y),_=O(_);var I=V(y,1),S=V(_,1);for(_=V(_,2),y=V(y,2);!T(_);){var w=S.add(_);0>=w.l(E)&&(I=I.add(y),S=w),_=V(_,1),y=V(y,1)}return g=x(E,I.j(g)),new D(I,g)}for(I=m;0<=E.l(g);){for(y=Math.max(1,Math.floor(E.m()/g.m())),_=Math.ceil(Math.log(y)/Math.LN2),_=48>=_?1:Math.pow(2,_-48),S=d(y),w=S.j(g);A(w)||0<w.l(E);)y-=_,S=d(y),w=S.j(g);T(S)&&(S=v),I=I.add(S),E=x(E,w)}return new D(I,E)}n.A=function(E){return C(this,E).h},n.and=function(E){for(var g=Math.max(this.g.length,E.g.length),y=[],_=0;_<g;_++)y[_]=this.i(_)&E.i(_);return new a(y,this.h&E.h)},n.or=function(E){for(var g=Math.max(this.g.length,E.g.length),y=[],_=0;_<g;_++)y[_]=this.i(_)|E.i(_);return new a(y,this.h|E.h)},n.xor=function(E){for(var g=Math.max(this.g.length,E.g.length),y=[],_=0;_<g;_++)y[_]=this.i(_)^E.i(_);return new a(y,this.h^E.h)};function O(E){for(var g=E.g.length+1,y=[],_=0;_<g;_++)y[_]=E.i(_)<<1|E.i(_-1)>>>31;return new a(y,E.h)}function V(E,g){var y=g>>5;g%=32;for(var _=E.g.length-y,I=[],S=0;S<_;S++)I[S]=0<g?E.i(S+y)>>>g|E.i(S+y+1)<<32-g:E.i(S+y);return new a(I,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,ph=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,Yn=a}).apply(typeof Iu<"u"?Iu:typeof self<"u"?self:typeof window<"u"?window:{});var Ci=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var mh,Is,gh,Bi,Ma,yh,vh,_h;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ci=="object"&&Ci];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function s(o,u){if(u)e:{var h=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var P=o[p];if(!(P in h))break e;h=h[P]}o=o[o.length-1],p=h[o],u=u(p),u!=p&&u!=null&&e(h,o,{configurable:!0,writable:!0,value:u})}}function i(o,u){o instanceof String&&(o+="");var h=0,p=!1,P={next:function(){if(!p&&h<o.length){var k=h++;return{value:u(k,o[k]),done:!1}}return p=!0,{done:!0,value:void 0}}};return P[Symbol.iterator]=function(){return P},P}s("Array.prototype.values",function(o){return o||function(){return i(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function c(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function f(o,u,h){return o.call.apply(o.bind,arguments)}function m(o,u,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var P=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(P,p),o.apply(u,P)}}return function(){return o.apply(u,arguments)}}function v(o,u,h){return v=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,v.apply(null,arguments)}function b(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function T(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,P,k){for(var B=Array(arguments.length-2),de=2;de<arguments.length;de++)B[de-2]=arguments[de];return u.prototype[P].apply(p,B)}}function A(o){const u=o.length;if(0<u){const h=Array(u);for(let p=0;p<u;p++)h[p]=o[p];return h}return[]}function R(o,u){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(c(p)){const P=o.length||0,k=p.length||0;o.length=P+k;for(let B=0;B<k;B++)o[P+B]=p[B]}else o.push(p)}}class x{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function M(o){return/^[\s\xa0]*$/.test(o)}function D(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function C(o){return C[" "](o),o}C[" "]=function(){};var O=D().indexOf("Gecko")!=-1&&!(D().toLowerCase().indexOf("webkit")!=-1&&D().indexOf("Edge")==-1)&&!(D().indexOf("Trident")!=-1||D().indexOf("MSIE")!=-1)&&D().indexOf("Edge")==-1;function V(o,u,h){for(const p in o)u.call(h,o[p],p,o)}function E(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function g(o){const u={};for(const h in o)u[h]=o[h];return u}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function _(o,u){let h,p;for(let P=1;P<arguments.length;P++){p=arguments[P];for(h in p)o[h]=p[h];for(let k=0;k<y.length;k++)h=y[k],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function I(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function S(o){l.setTimeout(()=>{throw o},0)}function w(){var o=he;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class oe{constructor(){this.h=this.g=null}add(u,h){const p=Ce.get();p.set(u,h),this.h?this.h.next=p:this.g=p,this.h=p}}var Ce=new x(()=>new Z,o=>o.reset());class Z{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let Se,ce=!1,he=new oe,Oe=()=>{const o=l.Promise.resolve(void 0);Se=()=>{o.then(ue)}};var ue=()=>{for(var o;o=w();){try{o.h.call(o.g)}catch(h){S(h)}var u=Ce;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}ce=!1};function we(){this.s=this.s,this.C=this.C}we.prototype.s=!1,we.prototype.ma=function(){this.s||(this.s=!0,this.N())},we.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function U(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}U.prototype.h=function(){this.defaultPrevented=!0};var be=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};l.addEventListener("test",h,u),l.removeEventListener("test",h,u)}catch{}return o}();function X(o,u){if(U.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(O){e:{try{C(u.nodeName);var P=!0;break e}catch{}P=!1}P||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:ie[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&X.aa.h.call(this)}}T(X,U);var ie={2:"touch",3:"pen",4:"mouse"};X.prototype.h=function(){X.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Ve="closure_listenable_"+(1e6*Math.random()|0),ut=0;function dt(o,u,h,p,P){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!p,this.ha=P,this.key=++ut,this.da=this.fa=!1}function Be(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function It(o){this.src=o,this.g={},this.h=0}It.prototype.add=function(o,u,h,p,P){var k=o.toString();o=this.g[k],o||(o=this.g[k]=[],this.h++);var B=dr(o,u,p,P);return-1<B?(u=o[B],h||(u.fa=!1)):(u=new dt(u,this.src,k,!!p,P),u.fa=h,o.push(u)),u};function ur(o,u){var h=u.type;if(h in o.g){var p=o.g[h],P=Array.prototype.indexOf.call(p,u,void 0),k;(k=0<=P)&&Array.prototype.splice.call(p,P,1),k&&(Be(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function dr(o,u,h,p){for(var P=0;P<o.length;++P){var k=o[P];if(!k.da&&k.listener==u&&k.capture==!!h&&k.ha==p)return P}return-1}var Nn="closure_lm_"+(1e6*Math.random()|0),Ln={};function St(o,u,h,p,P){if(Array.isArray(u)){for(var k=0;k<u.length;k++)St(o,u[k],h,p,P);return null}return h=yr(h),o&&o[Ve]?o.K(u,h,d(p)?!!p.capture:!1,P):hr(o,u,h,!1,p,P)}function hr(o,u,h,p,P,k){if(!u)throw Error("Invalid event type");var B=d(P)?!!P.capture:!!P,de=gr(o);if(de||(o[Nn]=de=new It(o)),h=de.add(u,h,p,B,k),h.proxy)return h;if(p=fr(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)be||(P=B),P===void 0&&(P=!1),o.addEventListener(u.toString(),p,P);else if(o.attachEvent)o.attachEvent(on(u.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function fr(){function o(h){return u.call(o.src,o.listener,h)}const u=Wo;return o}function pr(o,u,h,p,P){if(Array.isArray(u))for(var k=0;k<u.length;k++)pr(o,u[k],h,p,P);else p=d(p)?!!p.capture:!!p,h=yr(h),o&&o[Ve]?(o=o.i,u=String(u).toString(),u in o.g&&(k=o.g[u],h=dr(k,h,p,P),-1<h&&(Be(k[h]),Array.prototype.splice.call(k,h,1),k.length==0&&(delete o.g[u],o.h--)))):o&&(o=gr(o))&&(u=o.g[u.toString()],o=-1,u&&(o=dr(u,h,p,P)),(h=-1<o?u[o]:null)&&mr(h))}function mr(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[Ve])ur(u.i,o);else{var h=o.type,p=o.proxy;u.removeEventListener?u.removeEventListener(h,p,o.capture):u.detachEvent?u.detachEvent(on(h),p):u.addListener&&u.removeListener&&u.removeListener(p),(h=gr(u))?(ur(h,o),h.h==0&&(h.src=null,u[Nn]=null)):Be(o)}}}function on(o){return o in Ln?Ln[o]:Ln[o]="on"+o}function Wo(o,u){if(o.da)o=!0;else{u=new X(u,this);var h=o.listener,p=o.ha||o.src;o.fa&&mr(o),o=h.call(p,u)}return o}function gr(o){return o=o[Nn],o instanceof It?o:null}var ss="__closure_events_fn_"+(1e9*Math.random()>>>0);function yr(o){return typeof o=="function"?o:(o[ss]||(o[ss]=function(u){return o.handleEvent(u)}),o[ss])}function ze(){we.call(this),this.i=new It(this),this.M=this,this.F=null}T(ze,we),ze.prototype[Ve]=!0,ze.prototype.removeEventListener=function(o,u,h,p){pr(this,o,u,h,p)};function $e(o,u){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=u.type||u,typeof u=="string")u=new U(u,o);else if(u instanceof U)u.target=u.target||o;else{var P=u;u=new U(p,o),_(u,P)}if(P=!0,h)for(var k=h.length-1;0<=k;k--){var B=u.g=h[k];P=is(B,p,!0,u)&&P}if(B=u.g=o,P=is(B,p,!0,u)&&P,P=is(B,p,!1,u)&&P,h)for(k=0;k<h.length;k++)B=u.g=h[k],P=is(B,p,!1,u)&&P}ze.prototype.N=function(){if(ze.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],p=0;p<h.length;p++)Be(h[p]);delete o.g[u],o.h--}}this.F=null},ze.prototype.K=function(o,u,h,p){return this.i.add(String(o),u,!1,h,p)},ze.prototype.L=function(o,u,h,p){return this.i.add(String(o),u,!0,h,p)};function is(o,u,h,p){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var P=!0,k=0;k<u.length;++k){var B=u[k];if(B&&!B.da&&B.capture==h){var de=B.listener,Ue=B.ha||B.src;B.fa&&ur(o.i,B),P=de.call(Ue,p)!==!1&&P}}return P&&!p.defaultPrevented}function Ft(o,u,h){if(typeof o=="function")h&&(o=v(o,h));else if(o&&typeof o.handleEvent=="function")o=v(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(o,u||0)}function zt(o){o.g=Ft(()=>{o.g=null,o.i&&(o.i=!1,zt(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class di extends we{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:zt(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function vr(o){we.call(this),this.h=o,this.g={}}T(vr,we);var os=[];function hi(o){V(o.g,function(u,h){this.g.hasOwnProperty(h)&&mr(u)},o),o.g={}}vr.prototype.N=function(){vr.aa.N.call(this),hi(this)},vr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var as=l.JSON.stringify,_r=l.JSON.parse,ls=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function On(){}On.prototype.h=null;function fi(o){return o.h||(o.h=o.i())}function cs(){}var an={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function wr(){U.call(this,"d")}T(wr,U);function br(){U.call(this,"c")}T(br,U);var J={},ke=null;function pe(){return ke=ke||new ze}J.La="serverreachability";function $t(o){U.call(this,J.La,o)}T($t,U);function yt(o){const u=pe();$e(u,new $t(u))}J.STAT_EVENT="statevent";function vt(o,u){U.call(this,J.STAT_EVENT,o),this.stat=u}T(vt,U);function ye(o){const u=pe();$e(u,new vt(u,o))}J.Ma="timingevent";function Te(o,u){U.call(this,J.Ma,o),this.size=u}T(Te,U);function me(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},u)}function xe(){this.g=!0}xe.prototype.xa=function(){this.g=!1};function tt(o,u,h,p,P,k){o.info(function(){if(o.g)if(k)for(var B="",de=k.split("&"),Ue=0;Ue<de.length;Ue++){var re=de[Ue].split("=");if(1<re.length){var Ye=re[0];re=re[1];var Ge=Ye.split("_");B=2<=Ge.length&&Ge[1]=="type"?B+(Ye+"="+re+"&"):B+(Ye+"=redacted&")}}else B=null;else B=k;return"XMLHTTP REQ ("+p+") [attempt "+P+"]: "+u+`
`+h+`
`+B})}function Vn(o,u,h,p,P,k,B){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+P+"]: "+u+`
`+h+`
`+k+" "+B})}function Ae(o,u,h,p){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+Er(o,h)+(p?" "+p:"")})}function Bn(o,u){o.info(function(){return"TIMEOUT: "+u})}xe.prototype.info=function(){};function Er(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var P=p[1];if(Array.isArray(P)&&!(1>P.length)){var k=P[0];if(k!="noop"&&k!="stop"&&k!="close")for(var B=1;B<P.length;B++)P[B]=""}}}}return as(h)}catch{return u}}var Fn={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},pi={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},us;function mi(){}T(mi,On),mi.prototype.g=function(){return new XMLHttpRequest},mi.prototype.i=function(){return{}},us=new mi;function ln(o,u,h,p){this.j=o,this.i=u,this.l=h,this.R=p||1,this.U=new vr(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new cc}function cc(){this.i=null,this.g="",this.h=!1}var uc={},Yo={};function Go(o,u,h){o.L=1,o.v=_i(Ut(u)),o.m=h,o.P=!0,dc(o,null)}function dc(o,u){o.F=Date.now(),gi(o),o.A=Ut(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),Sc(h.i,"t",p),o.C=0,h=o.j.J,o.h=new cc,o.g=qc(o.j,h?u:null,!o.m),0<o.O&&(o.M=new di(v(o.Y,o,o.g),o.O)),u=o.U,h=o.g,p=o.ca;var P="readystatechange";Array.isArray(P)||(P&&(os[0]=P.toString()),P=os);for(var k=0;k<P.length;k++){var B=St(h,P[k],p||u.handleEvent,!1,u.h||u);if(!B)break;u.g[B.key]=B}u=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),yt(),tt(o.i,o.u,o.A,o.l,o.R,o.m)}ln.prototype.ca=function(o){o=o.target;const u=this.M;u&&qt(o)==3?u.j():this.Y(o)},ln.prototype.Y=function(o){try{if(o==this.g)e:{const Ge=qt(this.g);var u=this.g.Ba();const Sr=this.g.Z();if(!(3>Ge)&&(Ge!=3||this.g&&(this.h.h||this.g.oa()||Mc(this.g)))){this.J||Ge!=4||u==7||(u==8||0>=Sr?yt(3):yt(2)),Ko(this);var h=this.g.Z();this.X=h;t:if(hc(this)){var p=Mc(this.g);o="";var P=p.length,k=qt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){zn(this),ds(this);var B="";break t}this.h.i=new l.TextDecoder}for(u=0;u<P;u++)this.h.h=!0,o+=this.h.i.decode(p[u],{stream:!(k&&u==P-1)});p.length=0,this.h.g+=o,this.C=0,B=this.h.g}else B=this.g.oa();if(this.o=h==200,Vn(this.i,this.u,this.A,this.l,this.R,Ge,h),this.o){if(this.T&&!this.K){t:{if(this.g){var de,Ue=this.g;if((de=Ue.g?Ue.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!M(de)){var re=de;break t}}re=null}if(h=re)Ae(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Qo(this,h);else{this.o=!1,this.s=3,ye(12),zn(this),ds(this);break e}}if(this.P){h=!0;let _t;for(;!this.J&&this.C<B.length;)if(_t=wp(this,B),_t==Yo){Ge==4&&(this.s=4,ye(14),h=!1),Ae(this.i,this.l,null,"[Incomplete Response]");break}else if(_t==uc){this.s=4,ye(15),Ae(this.i,this.l,B,"[Invalid Chunk]"),h=!1;break}else Ae(this.i,this.l,_t,null),Qo(this,_t);if(hc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ge!=4||B.length!=0||this.h.h||(this.s=1,ye(16),h=!1),this.o=this.o&&h,!h)Ae(this.i,this.l,B,"[Invalid Chunked Response]"),zn(this),ds(this);else if(0<B.length&&!this.W){this.W=!0;var Ye=this.j;Ye.g==this&&Ye.ba&&!Ye.M&&(Ye.j.info("Great, no buffering proxy detected. Bytes received: "+B.length),na(Ye),Ye.M=!0,ye(11))}}else Ae(this.i,this.l,B,null),Qo(this,B);Ge==4&&zn(this),this.o&&!this.J&&(Ge==4?Fc(this.j,this):(this.o=!1,gi(this)))}else Vp(this.g),h==400&&0<B.indexOf("Unknown SID")?(this.s=3,ye(12)):(this.s=0,ye(13)),zn(this),ds(this)}}}catch{}finally{}};function hc(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function wp(o,u){var h=o.C,p=u.indexOf(`
`,h);return p==-1?Yo:(h=Number(u.substring(h,p)),isNaN(h)?uc:(p+=1,p+h>u.length?Yo:(u=u.slice(p,p+h),o.C=p+h,u)))}ln.prototype.cancel=function(){this.J=!0,zn(this)};function gi(o){o.S=Date.now()+o.I,fc(o,o.I)}function fc(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=me(v(o.ba,o),u)}function Ko(o){o.B&&(l.clearTimeout(o.B),o.B=null)}ln.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(Bn(this.i,this.A),this.L!=2&&(yt(),ye(17)),zn(this),this.s=2,ds(this)):fc(this,this.S-o)};function ds(o){o.j.G==0||o.J||Fc(o.j,o)}function zn(o){Ko(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,hi(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function Qo(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||Jo(h.h,o))){if(!o.K&&Jo(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(u)}catch{p=null}if(Array.isArray(p)&&p.length==3){var P=p;if(P[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)Si(h),Ti(h);else break e;ta(h),ye(18)}}else h.za=P[1],0<h.za-h.T&&37500>P[2]&&h.F&&h.v==0&&!h.C&&(h.C=me(v(h.Za,h),6e3));if(1>=gc(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Un(h,11)}else if((o.K||h.g==o)&&Si(h),!M(u))for(P=h.Da.g.parse(u),u=0;u<P.length;u++){let re=P[u];if(h.T=re[0],re=re[1],h.G==2)if(re[0]=="c"){h.K=re[1],h.ia=re[2];const Ye=re[3];Ye!=null&&(h.la=Ye,h.j.info("VER="+h.la));const Ge=re[4];Ge!=null&&(h.Aa=Ge,h.j.info("SVER="+h.Aa));const Sr=re[5];Sr!=null&&typeof Sr=="number"&&0<Sr&&(p=1.5*Sr,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const _t=o.g;if(_t){const Ai=_t.g?_t.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ai){var k=p.h;k.g||Ai.indexOf("spdy")==-1&&Ai.indexOf("quic")==-1&&Ai.indexOf("h2")==-1||(k.j=k.l,k.g=new Set,k.h&&(Xo(k,k.h),k.h=null))}if(p.D){const ra=_t.g?_t.g.getResponseHeader("X-HTTP-Session-Id"):null;ra&&(p.ya=ra,fe(p.I,p.D,ra))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var B=o;if(p.qa=Uc(p,p.J?p.ia:null,p.W),B.K){yc(p.h,B);var de=B,Ue=p.L;Ue&&(de.I=Ue),de.B&&(Ko(de),gi(de)),p.g=B}else Vc(p);0<h.i.length&&Ii(h)}else re[0]!="stop"&&re[0]!="close"||Un(h,7);else h.G==3&&(re[0]=="stop"||re[0]=="close"?re[0]=="stop"?Un(h,7):ea(h):re[0]!="noop"&&h.l&&h.l.ta(re),h.v=0)}}yt(4)}catch{}}var bp=class{constructor(o,u){this.g=o,this.map=u}};function pc(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function mc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function gc(o){return o.h?1:o.g?o.g.size:0}function Jo(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function Xo(o,u){o.g?o.g.add(u):o.h=u}function yc(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}pc.prototype.cancel=function(){if(this.i=vc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function vc(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return A(o.i)}function Ep(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var u=[],h=o.length,p=0;p<h;p++)u.push(o[p]);return u}u=[],h=0;for(p in o)u[h++]=o[p];return u}function Tp(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const p in o)u[h++]=p;return u}}}function _c(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=Tp(o),p=Ep(o),P=p.length,k=0;k<P;k++)u.call(void 0,p[k],h&&h[k],o)}var wc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ip(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),P=null;if(0<=p){var k=o[h].substring(0,p);P=o[h].substring(p+1)}else k=o[h];u(k,P?decodeURIComponent(P.replace(/\+/g," ")):"")}}}function $n(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof $n){this.h=o.h,yi(this,o.j),this.o=o.o,this.g=o.g,vi(this,o.s),this.l=o.l;var u=o.i,h=new ps;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),bc(this,h),this.m=o.m}else o&&(u=String(o).match(wc))?(this.h=!1,yi(this,u[1]||"",!0),this.o=hs(u[2]||""),this.g=hs(u[3]||"",!0),vi(this,u[4]),this.l=hs(u[5]||"",!0),bc(this,u[6]||"",!0),this.m=hs(u[7]||"")):(this.h=!1,this.i=new ps(null,this.h))}$n.prototype.toString=function(){var o=[],u=this.j;u&&o.push(fs(u,Ec,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(fs(u,Ec,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(fs(h,h.charAt(0)=="/"?Ap:xp,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",fs(h,Pp)),o.join("")};function Ut(o){return new $n(o)}function yi(o,u,h){o.j=h?hs(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function vi(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function bc(o,u,h){u instanceof ps?(o.i=u,Cp(o.i,o.h)):(h||(u=fs(u,Rp)),o.i=new ps(u,o.h))}function fe(o,u,h){o.i.set(u,h)}function _i(o){return fe(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function hs(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function fs(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,Sp),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Sp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Ec=/[#\/\?@]/g,xp=/[#\?:]/g,Ap=/[#\?]/g,Rp=/[#\?@]/g,Pp=/#/g;function ps(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function cn(o){o.g||(o.g=new Map,o.h=0,o.i&&Ip(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=ps.prototype,n.add=function(o,u){cn(this),this.i=null,o=Tr(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function Tc(o,u){cn(o),u=Tr(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Ic(o,u){return cn(o),u=Tr(o,u),o.g.has(u)}n.forEach=function(o,u){cn(this),this.g.forEach(function(h,p){h.forEach(function(P){o.call(u,P,p,this)},this)},this)},n.na=function(){cn(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let p=0;p<u.length;p++){const P=o[p];for(let k=0;k<P.length;k++)h.push(u[p])}return h},n.V=function(o){cn(this);let u=[];if(typeof o=="string")Ic(this,o)&&(u=u.concat(this.g.get(Tr(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},n.set=function(o,u){return cn(this),this.i=null,o=Tr(this,o),Ic(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function Sc(o,u,h){Tc(o,u),0<h.length&&(o.i=null,o.g.set(Tr(o,u),A(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var p=u[h];const k=encodeURIComponent(String(p)),B=this.V(p);for(p=0;p<B.length;p++){var P=k;B[p]!==""&&(P+="="+encodeURIComponent(String(B[p]))),o.push(P)}}return this.i=o.join("&")};function Tr(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function Cp(o,u){u&&!o.j&&(cn(o),o.i=null,o.g.forEach(function(h,p){var P=p.toLowerCase();p!=P&&(Tc(this,p),Sc(this,P,h))},o)),o.j=u}function kp(o,u){const h=new xe;if(l.Image){const p=new Image;p.onload=b(un,h,"TestLoadImage: loaded",!0,u,p),p.onerror=b(un,h,"TestLoadImage: error",!1,u,p),p.onabort=b(un,h,"TestLoadImage: abort",!1,u,p),p.ontimeout=b(un,h,"TestLoadImage: timeout",!1,u,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else u(!1)}function Mp(o,u){const h=new xe,p=new AbortController,P=setTimeout(()=>{p.abort(),un(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:p.signal}).then(k=>{clearTimeout(P),k.ok?un(h,"TestPingServer: ok",!0,u):un(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(P),un(h,"TestPingServer: error",!1,u)})}function un(o,u,h,p,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),p(h)}catch{}}function Dp(){this.g=new ls}function Np(o,u,h){const p=h||"";try{_c(o,function(P,k){let B=P;d(P)&&(B=as(P)),u.push(p+k+"="+encodeURIComponent(B))})}catch(P){throw u.push(p+"type="+encodeURIComponent("_badmap")),P}}function wi(o){this.l=o.Ub||null,this.j=o.eb||!1}T(wi,On),wi.prototype.g=function(){return new bi(this.l,this.j)},wi.prototype.i=function(o){return function(){return o}}({});function bi(o,u){ze.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}T(bi,ze),n=bi.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,gs(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,ms(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,gs(this)),this.g&&(this.readyState=3,gs(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;xc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function xc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?ms(this):gs(this),this.readyState==3&&xc(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,ms(this))},n.Qa=function(o){this.g&&(this.response=o,ms(this))},n.ga=function(){this.g&&ms(this)};function ms(o){o.readyState=4,o.l=null,o.j=null,o.v=null,gs(o)}n.setRequestHeader=function(o,u){this.u.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function gs(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(bi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Ac(o){let u="";return V(o,function(h,p){u+=p,u+=":",u+=h,u+=`\r
`}),u}function Zo(o,u,h){e:{for(p in h){var p=!1;break e}p=!0}p||(h=Ac(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):fe(o,u,h))}function Ee(o){ze.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}T(Ee,ze);var Lp=/^https?$/i,Op=["POST","PUT"];n=Ee.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,u,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():us.g(),this.v=this.o?fi(this.o):fi(us),this.g.onreadystatechange=v(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(k){Rc(this,k);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var P in p)h.set(P,p[P]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const k of p.keys())h.set(k,p.get(k));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(k=>k.toLowerCase()=="content-type"),P=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Op,u,void 0))||p||P||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[k,B]of h)this.g.setRequestHeader(k,B);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{kc(this),this.u=!0,this.g.send(o),this.u=!1}catch(k){Rc(this,k)}};function Rc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,Pc(o),Ei(o)}function Pc(o){o.A||(o.A=!0,$e(o,"complete"),$e(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,$e(this,"complete"),$e(this,"abort"),Ei(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ei(this,!0)),Ee.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Cc(this):this.bb())},n.bb=function(){Cc(this)};function Cc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||qt(o)!=4||o.Z()!=2)){if(o.u&&qt(o)==4)Ft(o.Ea,0,o);else if($e(o,"readystatechange"),qt(o)==4){o.h=!1;try{const B=o.Z();e:switch(B){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var h;if(!(h=u)){var p;if(p=B===0){var P=String(o.D).match(wc)[1]||null;!P&&l.self&&l.self.location&&(P=l.self.location.protocol.slice(0,-1)),p=!Lp.test(P?P.toLowerCase():"")}h=p}if(h)$e(o,"complete"),$e(o,"success");else{o.m=6;try{var k=2<qt(o)?o.g.statusText:""}catch{k=""}o.l=k+" ["+o.Z()+"]",Pc(o)}}finally{Ei(o)}}}}function Ei(o,u){if(o.g){kc(o);const h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||$e(o,"ready");try{h.onreadystatechange=p}catch{}}}function kc(o){o.I&&(l.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function qt(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<qt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),_r(u)}};function Mc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Vp(o){const u={};o=(o.g&&2<=qt(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(M(o[p]))continue;var h=I(o[p]);const P=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const k=u[P]||[];u[P]=k,k.push(h)}E(u,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ys(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function Dc(o){this.Aa=0,this.i=[],this.j=new xe,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ys("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ys("baseRetryDelayMs",5e3,o),this.cb=ys("retryDelaySeedMs",1e4,o),this.Wa=ys("forwardChannelMaxRetries",2,o),this.wa=ys("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new pc(o&&o.concurrentRequestLimit),this.Da=new Dp,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Dc.prototype,n.la=8,n.G=1,n.connect=function(o,u,h,p){ye(0),this.W=o,this.H=u||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=Uc(this,null,this.W),Ii(this)};function ea(o){if(Nc(o),o.G==3){var u=o.U++,h=Ut(o.I);if(fe(h,"SID",o.K),fe(h,"RID",u),fe(h,"TYPE","terminate"),vs(o,h),u=new ln(o,o.j,u),u.L=2,u.v=_i(Ut(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=u.v,h=!0),h||(u.g=qc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),gi(u)}$c(o)}function Ti(o){o.g&&(na(o),o.g.cancel(),o.g=null)}function Nc(o){Ti(o),o.u&&(l.clearTimeout(o.u),o.u=null),Si(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function Ii(o){if(!mc(o.h)&&!o.s){o.s=!0;var u=o.Ga;Se||Oe(),ce||(Se(),ce=!0),he.add(u,o),o.B=0}}function Bp(o,u){return gc(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=me(v(o.Ga,o,u),zc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const P=new ln(this,this.j,o);let k=this.o;if(this.S&&(k?(k=g(k),_(k,this.S)):k=this.S),this.m!==null||this.O||(P.H=k,k=null),this.P)e:{for(var u=0,h=0;h<this.i.length;h++){t:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(u+=p,4096<u){u=h;break e}if(u===4096||h===this.i.length-1){u=h+1;break e}}u=1e3}else u=1e3;u=Oc(this,P,u),h=Ut(this.I),fe(h,"RID",o),fe(h,"CVER",22),this.D&&fe(h,"X-HTTP-Session-Id",this.D),vs(this,h),k&&(this.O?u="headers="+encodeURIComponent(String(Ac(k)))+"&"+u:this.m&&Zo(h,this.m,k)),Xo(this.h,P),this.Ua&&fe(h,"TYPE","init"),this.P?(fe(h,"$req",u),fe(h,"SID","null"),P.T=!0,Go(P,h,null)):Go(P,h,u),this.G=2}}else this.G==3&&(o?Lc(this,o):this.i.length==0||mc(this.h)||Lc(this))};function Lc(o,u){var h;u?h=u.l:h=o.U++;const p=Ut(o.I);fe(p,"SID",o.K),fe(p,"RID",h),fe(p,"AID",o.T),vs(o,p),o.m&&o.o&&Zo(p,o.m,o.o),h=new ln(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Oc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),Xo(o.h,h),Go(h,p,u)}function vs(o,u){o.H&&V(o.H,function(h,p){fe(u,p,h)}),o.l&&_c({},function(h,p){fe(u,p,h)})}function Oc(o,u,h){h=Math.min(o.i.length,h);var p=o.l?v(o.l.Na,o.l,o):null;e:{var P=o.i;let k=-1;for(;;){const B=["count="+h];k==-1?0<h?(k=P[0].g,B.push("ofs="+k)):k=0:B.push("ofs="+k);let de=!0;for(let Ue=0;Ue<h;Ue++){let re=P[Ue].g;const Ye=P[Ue].map;if(re-=k,0>re)k=Math.max(0,P[Ue].g-100),de=!1;else try{Np(Ye,B,"req"+re+"_")}catch{p&&p(Ye)}}if(de){p=B.join("&");break e}}}return o=o.i.splice(0,h),u.D=o,p}function Vc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;Se||Oe(),ce||(Se(),ce=!0),he.add(u,o),o.v=0}}function ta(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=me(v(o.Fa,o),zc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Bc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=me(v(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,ye(10),Ti(this),Bc(this))};function na(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function Bc(o){o.g=new ln(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=Ut(o.qa);fe(u,"RID","rpc"),fe(u,"SID",o.K),fe(u,"AID",o.T),fe(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&fe(u,"TO",o.ja),fe(u,"TYPE","xmlhttp"),vs(o,u),o.m&&o.o&&Zo(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=_i(Ut(u)),h.m=null,h.P=!0,dc(h,o)}n.Za=function(){this.C!=null&&(this.C=null,Ti(this),ta(this),ye(19))};function Si(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function Fc(o,u){var h=null;if(o.g==u){Si(o),na(o),o.g=null;var p=2}else if(Jo(o.h,u))h=u.D,yc(o.h,u),p=1;else return;if(o.G!=0){if(u.o)if(p==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var P=o.B;p=pe(),$e(p,new Te(p,h)),Ii(o)}else Vc(o);else if(P=u.s,P==3||P==0&&0<u.X||!(p==1&&Bp(o,u)||p==2&&ta(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),P){case 1:Un(o,5);break;case 4:Un(o,10);break;case 3:Un(o,6);break;default:Un(o,2)}}}function zc(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function Un(o,u){if(o.j.info("Error code "+u),u==2){var h=v(o.fb,o),p=o.Xa;const P=!p;p=new $n(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||yi(p,"https"),_i(p),P?kp(p.toString(),h):Mp(p.toString(),h)}else ye(2);o.G=0,o.l&&o.l.sa(u),$c(o),Nc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),ye(2)):(this.j.info("Failed to ping google.com"),ye(1))};function $c(o){if(o.G=0,o.ka=[],o.l){const u=vc(o.h);(u.length!=0||o.i.length!=0)&&(R(o.ka,u),R(o.ka,o.i),o.h.i.length=0,A(o.i),o.i.length=0),o.l.ra()}}function Uc(o,u,h){var p=h instanceof $n?Ut(h):new $n(h);if(p.g!="")u&&(p.g=u+"."+p.g),vi(p,p.s);else{var P=l.location;p=P.protocol,u=u?u+"."+P.hostname:P.hostname,P=+P.port;var k=new $n(null);p&&yi(k,p),u&&(k.g=u),P&&vi(k,P),h&&(k.l=h),p=k}return h=o.D,u=o.ya,h&&u&&fe(p,h,u),fe(p,"VER",o.la),vs(o,p),p}function qc(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new Ee(new wi({eb:h})):new Ee(o.pa),u.Ha(o.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function jc(){}n=jc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function xi(){}xi.prototype.g=function(o,u){return new it(o,u)};function it(o,u){ze.call(this),this.g=new Dc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!M(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!M(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new Ir(this)}T(it,ze),it.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},it.prototype.close=function(){ea(this.g)},it.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=as(o),o=h);u.i.push(new bp(u.Ya++,o)),u.G==3&&Ii(u)},it.prototype.N=function(){this.g.l=null,delete this.j,ea(this.g),delete this.g,it.aa.N.call(this)};function Hc(o){wr.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const h in u){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}T(Hc,wr);function Wc(){br.call(this),this.status=1}T(Wc,br);function Ir(o){this.g=o}T(Ir,jc),Ir.prototype.ua=function(){$e(this.g,"a")},Ir.prototype.ta=function(o){$e(this.g,new Hc(o))},Ir.prototype.sa=function(o){$e(this.g,new Wc)},Ir.prototype.ra=function(){$e(this.g,"b")},xi.prototype.createWebChannel=xi.prototype.g,it.prototype.send=it.prototype.o,it.prototype.open=it.prototype.m,it.prototype.close=it.prototype.close,_h=function(){return new xi},vh=function(){return pe()},yh=J,Ma={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Fn.NO_ERROR=0,Fn.TIMEOUT=8,Fn.HTTP_ERROR=6,Bi=Fn,pi.COMPLETE="complete",gh=pi,cs.EventType=an,an.OPEN="a",an.CLOSE="b",an.ERROR="c",an.MESSAGE="d",ze.prototype.listen=ze.prototype.K,Is=cs,Ee.prototype.listenOnce=Ee.prototype.L,Ee.prototype.getLastError=Ee.prototype.Ka,Ee.prototype.getLastErrorCode=Ee.prototype.Ba,Ee.prototype.getStatus=Ee.prototype.Z,Ee.prototype.getResponseJson=Ee.prototype.Oa,Ee.prototype.getResponseText=Ee.prototype.oa,Ee.prototype.send=Ee.prototype.ea,Ee.prototype.setWithCredentials=Ee.prototype.Ha,mh=Ee}).apply(typeof Ci<"u"?Ci:typeof self<"u"?self:typeof window<"u"?window:{});const Su="@firebase/firestore";/**
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
 */class Qe{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Qe.UNAUTHENTICATED=new Qe(null),Qe.GOOGLE_CREDENTIALS=new Qe("google-credentials-uid"),Qe.FIRST_PARTY=new Qe("first-party-uid"),Qe.MOCK_USER=new Qe("mock-user");/**
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
 */let Zr="10.14.0";/**
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
 */const Xn=new Za("@firebase/firestore");function ws(){return Xn.logLevel}function z(n,...e){if(Xn.logLevel<=te.DEBUG){const t=e.map(fl);Xn.debug(`Firestore (${Zr}): ${n}`,...t)}}function Xt(n,...e){if(Xn.logLevel<=te.ERROR){const t=e.map(fl);Xn.error(`Firestore (${Zr}): ${n}`,...t)}}function qr(n,...e){if(Xn.logLevel<=te.WARN){const t=e.map(fl);Xn.warn(`Firestore (${Zr}): ${n}`,...t)}}function fl(n){if(typeof n=="string")return n;try{/**
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
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
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
 */function Y(n="Unexpected state"){const e=`FIRESTORE (${Zr}) INTERNAL ASSERTION FAILED: `+n;throw Xt(e),new Error(e)}function ae(n,e){n||Y()}function K(n,e){return n}/**
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
 */const N={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class $ extends tn{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Kt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class wh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Zv{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Qe.UNAUTHENTICATED))}shutdown(){}}class e0{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class t0{constructor(e){this.t=e,this.currentUser=Qe.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){ae(this.o===void 0);let r=this.i;const s=c=>this.i!==r?(r=this.i,t(c)):Promise.resolve();let i=new Kt;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Kt,e.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const c=i;e.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},l=c=>{z("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(z("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Kt)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(z("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(ae(typeof r.accessToken=="string"),new wh(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ae(e===null||typeof e=="string"),new Qe(e)}}class n0{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=Qe.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class r0{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new n0(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Qe.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class s0{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class i0{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){ae(this.o===void 0);const r=i=>{i.error!=null&&z("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.R;return this.R=i.token,z("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>r(i))};const s=i=>{z("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):z("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(ae(typeof t.token=="string"),this.R=t.token,new s0(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function o0(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
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
 */class bh{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=o0(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%e.length))}return r}}function se(n,e){return n<e?-1:n>e?1:0}function jr(n,e,t){return n.length===e.length&&n.every((r,s)=>t(r,e[s]))}/**
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
 */class De{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new $(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new $(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new $(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new $(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return De.fromMillis(Date.now())}static fromDate(e){return De.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new De(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?se(this.nanoseconds,e.nanoseconds):se(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class G{constructor(e){this.timestamp=e}static fromTimestamp(e){return new G(e)}static min(){return new G(new De(0,0))}static max(){return new G(new De(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class Bs{constructor(e,t,r){t===void 0?t=0:t>e.length&&Y(),r===void 0?r=e.length-t:r>e.length-t&&Y(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Bs.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Bs?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=e.get(s),a=t.get(s);if(i<a)return-1;if(i>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class ge extends Bs{construct(e,t,r){return new ge(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new $(N.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new ge(t)}static emptyPath(){return new ge([])}}const a0=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class je extends Bs{construct(e,t,r){return new je(e,t,r)}static isValidIdentifier(e){return a0.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),je.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new je(["__name__"])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new $(N.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const l=e[s];if(l==="\\"){if(s+1===e.length)throw new $(N.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new $(N.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=c,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(r+=l,s++):(i(),s++)}if(i(),a)throw new $(N.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new je(t)}static emptyPath(){return new je([])}}/**
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
 */class j{constructor(e){this.path=e}static fromPath(e){return new j(ge.fromString(e))}static fromName(e){return new j(ge.fromString(e).popFirst(5))}static empty(){return new j(ge.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ge.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ge.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new j(new ge(e.slice()))}}function l0(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=G.fromTimestamp(r===1e9?new De(t+1,0):new De(t,r));return new xn(s,j.empty(),e)}function c0(n){return new xn(n.readTime,n.key,-1)}class xn{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new xn(G.min(),j.empty(),-1)}static max(){return new xn(G.max(),j.empty(),-1)}}function u0(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=j.comparator(n.documentKey,e.documentKey),t!==0?t:se(n.largestBatchId,e.largestBatchId))}/**
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
 */const d0="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class h0{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function ni(n){if(n.code!==N.FAILED_PRECONDITION||n.message!==d0)throw n;z("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class L{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Y(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new L((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof L?t:L.resolve(t)}catch(t){return L.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):L.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):L.reject(t)}static resolve(e){return new L((t,r)=>{t(e)})}static reject(e){return new L((t,r)=>{r(e)})}static waitFor(e){return new L((t,r)=>{let s=0,i=0,a=!1;e.forEach(l=>{++s,l.next(()=>{++i,a&&i===s&&t()},c=>r(c))}),a=!0,i===s&&t()})}static or(e){let t=L.resolve(!1);for(const r of e)t=t.next(s=>s?L.resolve(s):r());return t}static forEach(e,t){const r=[];return e.forEach((s,i)=>{r.push(t.call(this,s,i))}),this.waitFor(r)}static mapArray(e,t){return new L((r,s)=>{const i=e.length,a=new Array(i);let l=0;for(let c=0;c<i;c++){const d=c;t(e[d]).next(f=>{a[d]=f,++l,l===i&&r(a)},f=>s(f))}})}static doWhile(e,t){return new L((r,s)=>{const i=()=>{e()===!0?t().next(()=>{i()},s):r()};i()})}}function f0(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function ri(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class pl{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}pl.oe=-1;function vo(n){return n==null}function eo(n){return n===0&&1/n==-1/0}function p0(n){return typeof n=="number"&&Number.isInteger(n)&&!eo(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */function xu(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function sr(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Eh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class _e{constructor(e,t){this.comparator=e,this.root=t||qe.EMPTY}insert(e,t){return new _e(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,qe.BLACK,null,null))}remove(e){return new _e(this.comparator,this.root.remove(e,this.comparator).copy(null,null,qe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ki(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ki(this.root,e,this.comparator,!1)}getReverseIterator(){return new ki(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ki(this.root,e,this.comparator,!0)}}class ki{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class qe{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??qe.RED,this.left=s??qe.EMPTY,this.right=i??qe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new qe(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return qe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return qe.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,qe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,qe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Y();const e=this.left.check();if(e!==this.right.check())throw Y();return e+(this.isRed()?0:1)}}qe.EMPTY=null,qe.RED=!0,qe.BLACK=!1;qe.EMPTY=new class{constructor(){this.size=0}get key(){throw Y()}get value(){throw Y()}get color(){throw Y()}get left(){throw Y()}get right(){throw Y()}copy(e,t,r,s,i){return this}insert(e,t,r){return new qe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class He{constructor(e){this.comparator=e,this.data=new _e(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Au(this.data.getIterator())}getIteratorFrom(e){return new Au(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof He)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new He(this.comparator);return t.data=e,t}}class Au{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class ot{constructor(e){this.fields=e,e.sort(je.comparator)}static empty(){return new ot([])}unionWith(e){let t=new He(je.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new ot(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return jr(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
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
 */class We{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Th("Invalid base64 string: "+i):i}}(e);return new We(t)}static fromUint8Array(e){const t=function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i}(e);return new We(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return se(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}We.EMPTY_BYTE_STRING=new We("");const m0=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function An(n){if(ae(!!n),typeof n=="string"){let e=0;const t=m0.exec(n);if(ae(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Ie(n.seconds),nanos:Ie(n.nanos)}}function Ie(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Zn(n){return typeof n=="string"?We.fromBase64String(n):We.fromUint8Array(n)}/**
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
 */function ml(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function gl(n){const e=n.mapValue.fields.__previous_value__;return ml(e)?gl(e):e}function Fs(n){const e=An(n.mapValue.fields.__local_write_time__.timestampValue);return new De(e.seconds,e.nanos)}/**
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
 */class g0{constructor(e,t,r,s,i,a,l,c,d){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class zs{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new zs("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof zs&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const Mi={mapValue:{}};function er(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?ml(n)?4:v0(n)?9007199254740991:y0(n)?10:11:Y()}function kt(n,e){if(n===e)return!0;const t=er(n);if(t!==er(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Fs(n).isEqual(Fs(e));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const a=An(s.timestampValue),l=An(i.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,i){return Zn(s.bytesValue).isEqual(Zn(i.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,i){return Ie(s.geoPointValue.latitude)===Ie(i.geoPointValue.latitude)&&Ie(s.geoPointValue.longitude)===Ie(i.geoPointValue.longitude)}(n,e);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return Ie(s.integerValue)===Ie(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const a=Ie(s.doubleValue),l=Ie(i.doubleValue);return a===l?eo(a)===eo(l):isNaN(a)&&isNaN(l)}return!1}(n,e);case 9:return jr(n.arrayValue.values||[],e.arrayValue.values||[],kt);case 10:case 11:return function(s,i){const a=s.mapValue.fields||{},l=i.mapValue.fields||{};if(xu(a)!==xu(l))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(l[c]===void 0||!kt(a[c],l[c])))return!1;return!0}(n,e);default:return Y()}}function $s(n,e){return(n.values||[]).find(t=>kt(t,e))!==void 0}function Hr(n,e){if(n===e)return 0;const t=er(n),r=er(e);if(t!==r)return se(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return se(n.booleanValue,e.booleanValue);case 2:return function(i,a){const l=Ie(i.integerValue||i.doubleValue),c=Ie(a.integerValue||a.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return Ru(n.timestampValue,e.timestampValue);case 4:return Ru(Fs(n),Fs(e));case 5:return se(n.stringValue,e.stringValue);case 6:return function(i,a){const l=Zn(i),c=Zn(a);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(i,a){const l=i.split("/"),c=a.split("/");for(let d=0;d<l.length&&d<c.length;d++){const f=se(l[d],c[d]);if(f!==0)return f}return se(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(i,a){const l=se(Ie(i.latitude),Ie(a.latitude));return l!==0?l:se(Ie(i.longitude),Ie(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Pu(n.arrayValue,e.arrayValue);case 10:return function(i,a){var l,c,d,f;const m=i.fields||{},v=a.fields||{},b=(l=m.value)===null||l===void 0?void 0:l.arrayValue,T=(c=v.value)===null||c===void 0?void 0:c.arrayValue,A=se(((d=b==null?void 0:b.values)===null||d===void 0?void 0:d.length)||0,((f=T==null?void 0:T.values)===null||f===void 0?void 0:f.length)||0);return A!==0?A:Pu(b,T)}(n.mapValue,e.mapValue);case 11:return function(i,a){if(i===Mi.mapValue&&a===Mi.mapValue)return 0;if(i===Mi.mapValue)return 1;if(a===Mi.mapValue)return-1;const l=i.fields||{},c=Object.keys(l),d=a.fields||{},f=Object.keys(d);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const v=se(c[m],f[m]);if(v!==0)return v;const b=Hr(l[c[m]],d[f[m]]);if(b!==0)return b}return se(c.length,f.length)}(n.mapValue,e.mapValue);default:throw Y()}}function Ru(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return se(n,e);const t=An(n),r=An(e),s=se(t.seconds,r.seconds);return s!==0?s:se(t.nanos,r.nanos)}function Pu(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=Hr(t[s],r[s]);if(i)return i}return se(t.length,r.length)}function Wr(n){return Da(n)}function Da(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=An(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return Zn(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return j.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=Da(i);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${Da(t.fields[a])}`;return s+"}"}(n.mapValue):Y()}function Na(n){return!!n&&"integerValue"in n}function yl(n){return!!n&&"arrayValue"in n}function Cu(n){return!!n&&"nullValue"in n}function ku(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Fi(n){return!!n&&"mapValue"in n}function y0(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Ps(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return sr(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Ps(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ps(n.arrayValue.values[t]);return e}return Object.assign({},n)}function v0(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class nt{constructor(e){this.value=e}static empty(){return new nt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Fi(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ps(t)}setAll(e){let t=je.emptyPath(),r={},s=[];e.forEach((a,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,r,s),r={},s=[],t=l.popLast()}a?r[l.lastSegment()]=Ps(a):s.push(l.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());Fi(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return kt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];Fi(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){sr(t,(s,i)=>e[s]=i);for(const s of r)delete e[s]}clone(){return new nt(Ps(this.value))}}function Ih(n){const e=[];return sr(n.fields,(t,r)=>{const s=new je([t]);if(Fi(r)){const i=Ih(r.mapValue).fields;if(i.length===0)e.push(s);else for(const a of i)e.push(s.child(a))}else e.push(s)}),new ot(e)}/**
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
 */class Xe{constructor(e,t,r,s,i,a,l){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=l}static newInvalidDocument(e){return new Xe(e,0,G.min(),G.min(),G.min(),nt.empty(),0)}static newFoundDocument(e,t,r,s){return new Xe(e,1,t,G.min(),r,s,0)}static newNoDocument(e,t){return new Xe(e,2,t,G.min(),G.min(),nt.empty(),0)}static newUnknownDocument(e,t){return new Xe(e,3,t,G.min(),G.min(),nt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(G.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=nt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=nt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Xe&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Xe(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class to{constructor(e,t){this.position=e,this.inclusive=t}}function Mu(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],a=n.position[s];if(i.field.isKeyField()?r=j.comparator(j.fromName(a.referenceValue),t.key):r=Hr(a,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function Du(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!kt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class no{constructor(e,t="asc"){this.field=e,this.dir=t}}function _0(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Sh{}class Me extends Sh{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new b0(e,t,r):t==="array-contains"?new I0(e,r):t==="in"?new S0(e,r):t==="not-in"?new x0(e,r):t==="array-contains-any"?new A0(e,r):new Me(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new E0(e,r):new T0(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Hr(t,this.value)):t!==null&&er(this.value)===er(t)&&this.matchesComparison(Hr(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Y()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Mt extends Sh{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new Mt(e,t)}matches(e){return xh(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function xh(n){return n.op==="and"}function Ah(n){return w0(n)&&xh(n)}function w0(n){for(const e of n.filters)if(e instanceof Mt)return!1;return!0}function La(n){if(n instanceof Me)return n.field.canonicalString()+n.op.toString()+Wr(n.value);if(Ah(n))return n.filters.map(e=>La(e)).join(",");{const e=n.filters.map(t=>La(t)).join(",");return`${n.op}(${e})`}}function Rh(n,e){return n instanceof Me?function(r,s){return s instanceof Me&&r.op===s.op&&r.field.isEqual(s.field)&&kt(r.value,s.value)}(n,e):n instanceof Mt?function(r,s){return s instanceof Mt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((i,a,l)=>i&&Rh(a,s.filters[l]),!0):!1}(n,e):void Y()}function Ph(n){return n instanceof Me?function(t){return`${t.field.canonicalString()} ${t.op} ${Wr(t.value)}`}(n):n instanceof Mt?function(t){return t.op.toString()+" {"+t.getFilters().map(Ph).join(" ,")+"}"}(n):"Filter"}class b0 extends Me{constructor(e,t,r){super(e,t,r),this.key=j.fromName(r.referenceValue)}matches(e){const t=j.comparator(e.key,this.key);return this.matchesComparison(t)}}class E0 extends Me{constructor(e,t){super(e,"in",t),this.keys=Ch("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class T0 extends Me{constructor(e,t){super(e,"not-in",t),this.keys=Ch("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Ch(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>j.fromName(r.referenceValue))}class I0 extends Me{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return yl(t)&&$s(t.arrayValue,this.value)}}class S0 extends Me{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&$s(this.value.arrayValue,t)}}class x0 extends Me{constructor(e,t){super(e,"not-in",t)}matches(e){if($s(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!$s(this.value.arrayValue,t)}}class A0 extends Me{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!yl(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>$s(this.value.arrayValue,r))}}/**
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
 */class R0{constructor(e,t=null,r=[],s=[],i=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=l,this.ue=null}}function Nu(n,e=null,t=[],r=[],s=null,i=null,a=null){return new R0(n,e,t,r,s,i,a)}function vl(n){const e=K(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>La(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(i){return i.field.canonicalString()+i.dir}(r)).join(","),vo(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Wr(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Wr(r)).join(",")),e.ue=t}return e.ue}function _l(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!_0(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Rh(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Du(n.startAt,e.startAt)&&Du(n.endAt,e.endAt)}function Oa(n){return j.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class _o{constructor(e,t=null,r=[],s=[],i=null,a="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function P0(n,e,t,r,s,i,a,l){return new _o(n,e,t,r,s,i,a,l)}function wl(n){return new _o(n)}function Lu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function C0(n){return n.collectionGroup!==null}function Cs(n){const e=K(n);if(e.ce===null){e.ce=[];const t=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new He(je.comparator);return a.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(e).forEach(i=>{t.has(i.canonicalString())||i.isKeyField()||e.ce.push(new no(i,r))}),t.has(je.keyField().canonicalString())||e.ce.push(new no(je.keyField(),r))}return e.ce}function Pt(n){const e=K(n);return e.le||(e.le=k0(e,Cs(n))),e.le}function k0(n,e){if(n.limitType==="F")return Nu(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new no(s.field,i)});const t=n.endAt?new to(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new to(n.startAt.position,n.startAt.inclusive):null;return Nu(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Va(n,e,t){return new _o(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function wo(n,e){return _l(Pt(n),Pt(e))&&n.limitType===e.limitType}function kh(n){return`${vl(Pt(n))}|lt:${n.limitType}`}function Ar(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(s=>Ph(s)).join(", ")}]`),vo(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(s=>Wr(s)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(s=>Wr(s)).join(",")),`Target(${r})`}(Pt(n))}; limitType=${n.limitType})`}function bo(n,e){return e.isFoundDocument()&&function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):j.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)}(n,e)&&function(r,s){for(const i of Cs(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(n,e)&&function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0}(n,e)&&function(r,s){return!(r.startAt&&!function(a,l,c){const d=Mu(a,l,c);return a.inclusive?d<=0:d<0}(r.startAt,Cs(r),s)||r.endAt&&!function(a,l,c){const d=Mu(a,l,c);return a.inclusive?d>=0:d>0}(r.endAt,Cs(r),s))}(n,e)}function M0(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Mh(n){return(e,t)=>{let r=!1;for(const s of Cs(n)){const i=D0(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function D0(n,e,t){const r=n.field.isKeyField()?j.comparator(e.key,t.key):function(i,a,l){const c=a.data.field(i),d=l.data.field(i);return c!==null&&d!==null?Hr(c,d):Y()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return Y()}}/**
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
 */class es{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){sr(this.inner,(t,r)=>{for(const[s,i]of r)e(s,i)})}isEmpty(){return Eh(this.inner)}size(){return this.innerSize}}/**
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
 */const N0=new _e(j.comparator);function Zt(){return N0}const Dh=new _e(j.comparator);function Ss(...n){let e=Dh;for(const t of n)e=e.insert(t.key,t);return e}function Nh(n){let e=Dh;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function Wn(){return ks()}function Lh(){return ks()}function ks(){return new es(n=>n.toString(),(n,e)=>n.isEqual(e))}const L0=new _e(j.comparator),O0=new He(j.comparator);function ee(...n){let e=O0;for(const t of n)e=e.add(t);return e}const V0=new He(se);function B0(){return V0}/**
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
 */function bl(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:eo(e)?"-0":e}}function Oh(n){return{integerValue:""+n}}function F0(n,e){return p0(e)?Oh(e):bl(n,e)}/**
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
 */class Eo{constructor(){this._=void 0}}function z0(n,e,t){return n instanceof ro?function(s,i){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&ml(i)&&(i=gl(i)),i&&(a.fields.__previous_value__=i),{mapValue:a}}(t,e):n instanceof Us?Bh(n,e):n instanceof qs?Fh(n,e):function(s,i){const a=Vh(s,i),l=Ou(a)+Ou(s.Pe);return Na(a)&&Na(s.Pe)?Oh(l):bl(s.serializer,l)}(n,e)}function $0(n,e,t){return n instanceof Us?Bh(n,e):n instanceof qs?Fh(n,e):t}function Vh(n,e){return n instanceof so?function(r){return Na(r)||function(i){return!!i&&"doubleValue"in i}(r)}(e)?e:{integerValue:0}:null}class ro extends Eo{}class Us extends Eo{constructor(e){super(),this.elements=e}}function Bh(n,e){const t=zh(e);for(const r of n.elements)t.some(s=>kt(s,r))||t.push(r);return{arrayValue:{values:t}}}class qs extends Eo{constructor(e){super(),this.elements=e}}function Fh(n,e){let t=zh(e);for(const r of n.elements)t=t.filter(s=>!kt(s,r));return{arrayValue:{values:t}}}class so extends Eo{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Ou(n){return Ie(n.integerValue||n.doubleValue)}function zh(n){return yl(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function U0(n,e){return n.field.isEqual(e.field)&&function(r,s){return r instanceof Us&&s instanceof Us||r instanceof qs&&s instanceof qs?jr(r.elements,s.elements,kt):r instanceof so&&s instanceof so?kt(r.Pe,s.Pe):r instanceof ro&&s instanceof ro}(n.transform,e.transform)}class q0{constructor(e,t){this.version=e,this.transformResults=t}}class rt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new rt}static exists(e){return new rt(void 0,e)}static updateTime(e){return new rt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function zi(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class To{}function $h(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Io(n.key,rt.none()):new si(n.key,n.data,rt.none());{const t=n.data,r=nt.empty();let s=new He(je.comparator);for(let i of e.fields)if(!s.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new Cn(n.key,r,new ot(s.toArray()),rt.none())}}function j0(n,e,t){n instanceof si?function(s,i,a){const l=s.value.clone(),c=Bu(s.fieldTransforms,i,a.transformResults);l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,e,t):n instanceof Cn?function(s,i,a){if(!zi(s.precondition,i))return void i.convertToUnknownDocument(a.version);const l=Bu(s.fieldTransforms,i,a.transformResults),c=i.data;c.setAll(Uh(s)),c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,e,t):function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function Ms(n,e,t,r){return n instanceof si?function(i,a,l,c){if(!zi(i.precondition,a))return l;const d=i.value.clone(),f=Fu(i.fieldTransforms,c,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,r):n instanceof Cn?function(i,a,l,c){if(!zi(i.precondition,a))return l;const d=Fu(i.fieldTransforms,c,a),f=a.data;return f.setAll(Uh(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(n,e,t,r):function(i,a,l){return zi(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(n,e,t)}function H0(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=Vh(r.transform,s||null);i!=null&&(t===null&&(t=nt.empty()),t.set(r.field,i))}return t||null}function Vu(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&jr(r,s,(i,a)=>U0(i,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class si extends To{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Cn extends To{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Uh(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function Bu(n,e,t){const r=new Map;ae(n.length===t.length);for(let s=0;s<t.length;s++){const i=n[s],a=i.transform,l=e.data.field(i.field);r.set(i.field,$0(a,l,t[s]))}return r}function Fu(n,e,t){const r=new Map;for(const s of n){const i=s.transform,a=t.data.field(s.field);r.set(s.field,z0(i,a,e))}return r}class Io extends To{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class W0 extends To{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class Y0{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&j0(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Ms(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Ms(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=Lh();return this.mutations.forEach(s=>{const i=e.get(s.key),a=i.overlayedDocument;let l=this.applyToLocalView(a,i.mutatedFields);l=t.has(s.key)?null:l;const c=$h(a,l);c!==null&&r.set(s.key,c),a.isValidDocument()||a.convertToNoDocument(G.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ee())}isEqual(e){return this.batchId===e.batchId&&jr(this.mutations,e.mutations,(t,r)=>Vu(t,r))&&jr(this.baseMutations,e.baseMutations,(t,r)=>Vu(t,r))}}class El{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){ae(e.mutations.length===r.length);let s=function(){return L0}();const i=e.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new El(e,t,r,s)}}/**
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
 */class G0{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class K0{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var Re,ne;function Q0(n){switch(n){default:return Y();case N.CANCELLED:case N.UNKNOWN:case N.DEADLINE_EXCEEDED:case N.RESOURCE_EXHAUSTED:case N.INTERNAL:case N.UNAVAILABLE:case N.UNAUTHENTICATED:return!1;case N.INVALID_ARGUMENT:case N.NOT_FOUND:case N.ALREADY_EXISTS:case N.PERMISSION_DENIED:case N.FAILED_PRECONDITION:case N.ABORTED:case N.OUT_OF_RANGE:case N.UNIMPLEMENTED:case N.DATA_LOSS:return!0}}function qh(n){if(n===void 0)return Xt("GRPC error has no .code"),N.UNKNOWN;switch(n){case Re.OK:return N.OK;case Re.CANCELLED:return N.CANCELLED;case Re.UNKNOWN:return N.UNKNOWN;case Re.DEADLINE_EXCEEDED:return N.DEADLINE_EXCEEDED;case Re.RESOURCE_EXHAUSTED:return N.RESOURCE_EXHAUSTED;case Re.INTERNAL:return N.INTERNAL;case Re.UNAVAILABLE:return N.UNAVAILABLE;case Re.UNAUTHENTICATED:return N.UNAUTHENTICATED;case Re.INVALID_ARGUMENT:return N.INVALID_ARGUMENT;case Re.NOT_FOUND:return N.NOT_FOUND;case Re.ALREADY_EXISTS:return N.ALREADY_EXISTS;case Re.PERMISSION_DENIED:return N.PERMISSION_DENIED;case Re.FAILED_PRECONDITION:return N.FAILED_PRECONDITION;case Re.ABORTED:return N.ABORTED;case Re.OUT_OF_RANGE:return N.OUT_OF_RANGE;case Re.UNIMPLEMENTED:return N.UNIMPLEMENTED;case Re.DATA_LOSS:return N.DATA_LOSS;default:return Y()}}(ne=Re||(Re={}))[ne.OK=0]="OK",ne[ne.CANCELLED=1]="CANCELLED",ne[ne.UNKNOWN=2]="UNKNOWN",ne[ne.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ne[ne.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ne[ne.NOT_FOUND=5]="NOT_FOUND",ne[ne.ALREADY_EXISTS=6]="ALREADY_EXISTS",ne[ne.PERMISSION_DENIED=7]="PERMISSION_DENIED",ne[ne.UNAUTHENTICATED=16]="UNAUTHENTICATED",ne[ne.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ne[ne.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ne[ne.ABORTED=10]="ABORTED",ne[ne.OUT_OF_RANGE=11]="OUT_OF_RANGE",ne[ne.UNIMPLEMENTED=12]="UNIMPLEMENTED",ne[ne.INTERNAL=13]="INTERNAL",ne[ne.UNAVAILABLE=14]="UNAVAILABLE",ne[ne.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function J0(){return new TextEncoder}/**
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
 */const X0=new Yn([4294967295,4294967295],0);function zu(n){const e=J0().encode(n),t=new ph;return t.update(e),new Uint8Array(t.digest())}function $u(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Yn([t,r],0),new Yn([s,i],0)]}class Tl{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new xs(`Invalid padding: ${t}`);if(r<0)throw new xs(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new xs(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new xs(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=Yn.fromNumber(this.Ie)}Ee(e,t,r){let s=e.add(t.multiply(Yn.fromNumber(r)));return s.compare(X0)===1&&(s=new Yn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=zu(e),[r,s]=$u(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);if(!this.de(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new Tl(i,s,t);return r.forEach(l=>a.insert(l)),a}insert(e){if(this.Ie===0)return;const t=zu(e),[r,s]=$u(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class xs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class So{constructor(e,t,r,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,ii.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new So(G.min(),s,new _e(se),Zt(),ee())}}class ii{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new ii(r,t,ee(),ee(),ee())}}/**
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
 */class $i{constructor(e,t,r,s){this.Re=e,this.removedTargetIds=t,this.key=r,this.Ve=s}}class jh{constructor(e,t){this.targetId=e,this.me=t}}class Hh{constructor(e,t,r=We.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class Uu{constructor(){this.fe=0,this.ge=ju(),this.pe=We.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ee(),t=ee(),r=ee();return this.ge.forEach((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:Y()}}),new ii(this.pe,this.ye,e,t,r)}Ce(){this.we=!1,this.ge=ju()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,ae(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class Z0{constructor(e){this.Le=e,this.Be=new Map,this.ke=Zt(),this.qe=qu(),this.Qe=new _e(se)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const r=this.Ge(t);switch(e.state){case 0:this.ze(t)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),r.De(e.resumeToken));break;default:Y()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((r,s)=>{this.ze(s)&&t(s)})}He(e){const t=e.targetId,r=e.me.count,s=this.Je(t);if(s){const i=s.target;if(Oa(i))if(r===0){const a=new j(i.path);this.Ue(t,a,Xe.newNoDocument(a,G.min()))}else ae(r===1);else{const a=this.Ye(t);if(a!==r){const l=this.Ze(e),c=l?this.Xe(l,e,a):1;if(c!==0){this.je(t);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,d)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let a,l;try{a=Zn(r).toUint8Array()}catch(c){if(c instanceof Th)return qr("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Tl(a,s,i)}catch(c){return qr(c instanceof xs?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,r){return t.me.count===r-this.nt(e,t.targetId)?0:2}nt(e,t){const r=this.Le.getRemoteKeysForTarget(t);let s=0;return r.forEach(i=>{const a=this.Le.tt(),l=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,i,null),s++)}),s}rt(e){const t=new Map;this.Be.forEach((i,a)=>{const l=this.Je(a);if(l){if(i.current&&Oa(l.target)){const c=new j(l.target.path);this.ke.get(c)!==null||this.it(a,c)||this.Ue(a,c,Xe.newNoDocument(c,e))}i.be&&(t.set(a,i.ve()),i.Ce())}});let r=ee();this.qe.forEach((i,a)=>{let l=!0;a.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(i))}),this.ke.forEach((i,a)=>a.setReadTime(e));const s=new So(e,t,this.Qe,this.ke,r);return this.ke=Zt(),this.qe=qu(),this.Qe=new _e(se),s}$e(e,t){if(!this.ze(e))return;const r=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,r),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,r){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,t)?s.Fe(t,1):s.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),r&&(this.ke=this.ke.insert(t,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Uu,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new He(se),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||z("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Uu),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function qu(){return new _e(j.comparator)}function ju(){return new _e(j.comparator)}const e_={asc:"ASCENDING",desc:"DESCENDING"},t_={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},n_={and:"AND",or:"OR"};class r_{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Ba(n,e){return n.useProto3Json||vo(e)?e:{value:e}}function io(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Wh(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function s_(n,e){return io(n,e.toTimestamp())}function Ct(n){return ae(!!n),G.fromTimestamp(function(t){const r=An(t);return new De(r.seconds,r.nanos)}(n))}function Il(n,e){return Fa(n,e).canonicalString()}function Fa(n,e){const t=function(s){return new ge(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function Yh(n){const e=ge.fromString(n);return ae(Xh(e)),e}function za(n,e){return Il(n.databaseId,e.path)}function da(n,e){const t=Yh(e);if(t.get(1)!==n.databaseId.projectId)throw new $(N.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new $(N.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new j(Kh(t))}function Gh(n,e){return Il(n.databaseId,e)}function i_(n){const e=Yh(n);return e.length===4?ge.emptyPath():Kh(e)}function $a(n){return new ge(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Kh(n){return ae(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Hu(n,e,t){return{name:za(n,e),fields:t.value.mapValue.fields}}function o_(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:Y()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(d,f){return d.useProto3Json?(ae(f===void 0||typeof f=="string"),We.fromBase64String(f||"")):(ae(f===void 0||f instanceof Buffer||f instanceof Uint8Array),We.fromUint8Array(f||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&function(d){const f=d.code===void 0?N.UNKNOWN:qh(d.code);return new $(f,d.message||"")}(a);t=new Hh(r,s,i,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=da(n,r.document.name),i=Ct(r.document.updateTime),a=r.document.createTime?Ct(r.document.createTime):G.min(),l=new nt({mapValue:{fields:r.document.fields}}),c=Xe.newFoundDocument(s,i,a,l),d=r.targetIds||[],f=r.removedTargetIds||[];t=new $i(d,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=da(n,r.document),i=r.readTime?Ct(r.readTime):G.min(),a=Xe.newNoDocument(s,i),l=r.removedTargetIds||[];t=new $i([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=da(n,r.document),i=r.removedTargetIds||[];t=new $i([],i,s,null)}else{if(!("filter"in e))return Y();{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new K0(s,i),l=r.targetId;t=new jh(l,a)}}return t}function a_(n,e){let t;if(e instanceof si)t={update:Hu(n,e.key,e.value)};else if(e instanceof Io)t={delete:za(n,e.key)};else if(e instanceof Cn)t={update:Hu(n,e.key,e.data),updateMask:g_(e.fieldMask)};else{if(!(e instanceof W0))return Y();t={verify:za(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(i,a){const l=a.transform;if(l instanceof ro)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Us)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof qs)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof so)return{fieldPath:a.field.canonicalString(),increment:l.Pe};throw Y()}(0,r))),e.precondition.isNone||(t.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:s_(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Y()}(n,e.precondition)),t}function l_(n,e){return n&&n.length>0?(ae(e!==void 0),n.map(t=>function(s,i){let a=s.updateTime?Ct(s.updateTime):Ct(i);return a.isEqual(G.min())&&(a=Ct(i)),new q0(a,s.transformResults||[])}(t,e))):[]}function c_(n,e){return{documents:[Gh(n,e.path)]}}function u_(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Gh(n,s);const i=function(d){if(d.length!==0)return Jh(Mt.create(d,"and"))}(e.filters);i&&(t.structuredQuery.where=i);const a=function(d){if(d.length!==0)return d.map(f=>function(v){return{field:Rr(v.field),direction:f_(v.dir)}}(f))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=Ba(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:t,parent:s}}function d_(n){let e=i_(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){ae(r===1);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=function(m){const v=Qh(m);return v instanceof Mt&&Ah(v)?v.getFilters():[v]}(t.where));let a=[];t.orderBy&&(a=function(m){return m.map(v=>function(T){return new no(Pr(T.field),function(R){switch(R){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(T.direction))}(v))}(t.orderBy));let l=null;t.limit&&(l=function(m){let v;return v=typeof m=="object"?m.value:m,vo(v)?null:v}(t.limit));let c=null;t.startAt&&(c=function(m){const v=!!m.before,b=m.values||[];return new to(b,v)}(t.startAt));let d=null;return t.endAt&&(d=function(m){const v=!m.before,b=m.values||[];return new to(b,v)}(t.endAt)),P0(e,s,a,i,l,"F",c,d)}function h_(n,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Y()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Qh(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=Pr(t.unaryFilter.field);return Me.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Pr(t.unaryFilter.field);return Me.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Pr(t.unaryFilter.field);return Me.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Pr(t.unaryFilter.field);return Me.create(a,"!=",{nullValue:"NULL_VALUE"});default:return Y()}}(n):n.fieldFilter!==void 0?function(t){return Me.create(Pr(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Y()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return Mt.create(t.compositeFilter.filters.map(r=>Qh(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return Y()}}(t.compositeFilter.op))}(n):Y()}function f_(n){return e_[n]}function p_(n){return t_[n]}function m_(n){return n_[n]}function Rr(n){return{fieldPath:n.canonicalString()}}function Pr(n){return je.fromServerFormat(n.fieldPath)}function Jh(n){return n instanceof Me?function(t){if(t.op==="=="){if(ku(t.value))return{unaryFilter:{field:Rr(t.field),op:"IS_NAN"}};if(Cu(t.value))return{unaryFilter:{field:Rr(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(ku(t.value))return{unaryFilter:{field:Rr(t.field),op:"IS_NOT_NAN"}};if(Cu(t.value))return{unaryFilter:{field:Rr(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Rr(t.field),op:p_(t.op),value:t.value}}}(n):n instanceof Mt?function(t){const r=t.getFilters().map(s=>Jh(s));return r.length===1?r[0]:{compositeFilter:{op:m_(t.op),filters:r}}}(n):Y()}function g_(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Xh(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class yn{constructor(e,t,r,s,i=G.min(),a=G.min(),l=We.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new yn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new yn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new yn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new yn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class y_{constructor(e){this.ct=e}}function v_(n){const e=d_({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Va(e,e.limit,"L"):e}/**
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
 */class __{constructor(){this.un=new w_}addToCollectionParentIndex(e,t){return this.un.add(t),L.resolve()}getCollectionParents(e,t){return L.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return L.resolve()}deleteFieldIndex(e,t){return L.resolve()}deleteAllFieldIndexes(e){return L.resolve()}createTargetIndexes(e,t){return L.resolve()}getDocumentsMatchingTarget(e,t){return L.resolve(null)}getIndexType(e,t){return L.resolve(0)}getFieldIndexes(e,t){return L.resolve([])}getNextCollectionGroupToUpdate(e){return L.resolve(null)}getMinOffset(e,t){return L.resolve(xn.min())}getMinOffsetFromCollectionGroup(e,t){return L.resolve(xn.min())}updateCollectionGroup(e,t,r){return L.resolve()}updateIndexEntries(e,t){return L.resolve()}}class w_{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new He(ge.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new He(ge.comparator)).toArray()}}/**
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
 */class Yr{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Yr(0)}static kn(){return new Yr(-1)}}/**
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
 */class b_{constructor(){this.changes=new es(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Xe.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?L.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class E_{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class T_{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(r!==null&&Ms(r.mutation,s,ot.empty(),De.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,ee()).next(()=>r))}getLocalViewOfDocuments(e,t,r=ee()){const s=Wn();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,r).next(i=>{let a=Ss();return i.forEach((l,c)=>{a=a.insert(l,c.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=Wn();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,ee()))}populateOverlays(e,t,r){const s=[];return r.forEach(i=>{t.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(e,s).next(i=>{i.forEach((a,l)=>{t.set(a,l)})})}computeViews(e,t,r,s){let i=Zt();const a=ks(),l=function(){return ks()}();return t.forEach((c,d)=>{const f=r.get(d.key);s.has(d.key)&&(f===void 0||f.mutation instanceof Cn)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),Ms(f.mutation,d,f.mutation.getFieldMask(),De.now())):a.set(d.key,ot.empty())}),this.recalculateAndSaveOverlays(e,i).next(c=>(c.forEach((d,f)=>a.set(d,f)),t.forEach((d,f)=>{var m;return l.set(d,new E_(f,(m=a.get(d))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,t){const r=ks();let s=new _e((a,l)=>a-l),i=ee();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const l of a)l.keys().forEach(c=>{const d=t.get(c);if(d===null)return;let f=r.get(c)||ot.empty();f=l.applyToLocalView(d,f),r.set(c,f);const m=(s.get(l.batchId)||ee()).add(c);s=s.insert(l.batchId,m)})}).next(()=>{const a=[],l=s.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,f=c.value,m=Lh();f.forEach(v=>{if(!i.has(v)){const b=$h(t.get(v),r.get(v));b!==null&&m.set(v,b),i=i.add(v)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,m))}return L.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,s){return function(a){return j.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):C0(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next(i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):L.resolve(Wn());let l=-1,c=i;return a.next(d=>L.forEach(d,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(f)?L.resolve():this.remoteDocumentCache.getEntry(e,f).next(v=>{c=c.insert(f,v)}))).next(()=>this.populateOverlays(e,d,i)).next(()=>this.computeViews(e,c,d,ee())).next(f=>({batchId:l,changes:Nh(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new j(t)).next(r=>{let s=Ss();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let a=Ss();return this.indexManager.getCollectionParents(e,i).next(l=>L.forEach(l,c=>{const d=function(m,v){return new _o(v,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,r,s).next(f=>{f.forEach((m,v)=>{a=a.insert(m,v)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s))).next(a=>{i.forEach((c,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Xe.newInvalidDocument(f)))});let l=Ss();return a.forEach((c,d)=>{const f=i.get(c);f!==void 0&&Ms(f.mutation,d,ot.empty(),De.now()),bo(t,d)&&(l=l.insert(c,d))}),l})}}/**
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
 */class I_{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return L.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:Ct(s.createTime)}}(t)),L.resolve()}getNamedQuery(e,t){return L.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(s){return{name:s.name,query:v_(s.bundledQuery),readTime:Ct(s.readTime)}}(t)),L.resolve()}}/**
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
 */class S_{constructor(){this.overlays=new _e(j.comparator),this.Ir=new Map}getOverlay(e,t){return L.resolve(this.overlays.get(t))}getOverlays(e,t){const r=Wn();return L.forEach(t,s=>this.getOverlay(e,s).next(i=>{i!==null&&r.set(s,i)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((s,i)=>{this.ht(e,t,i)}),L.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(r)),L.resolve()}getOverlaysForCollection(e,t,r){const s=Wn(),i=t.length+1,a=new j(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>r&&s.set(c.getKey(),c)}return L.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new _e((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let f=i.get(d.largestBatchId);f===null&&(f=Wn(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const l=Wn(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,f)=>l.set(d,f)),!(l.size()>=s)););return L.resolve(l)}ht(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new G0(t,r));let i=this.Ir.get(t);i===void 0&&(i=ee(),this.Ir.set(t,i)),this.Ir.set(t,i.add(r.key))}}/**
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
 */class x_{constructor(){this.sessionToken=We.EMPTY_BYTE_STRING}getSessionToken(e){return L.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,L.resolve()}}/**
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
 */class Sl{constructor(){this.Tr=new He(Fe.Er),this.dr=new He(Fe.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new Fe(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Vr(new Fe(e,t))}mr(e,t){e.forEach(r=>this.removeReference(r,t))}gr(e){const t=new j(new ge([])),r=new Fe(t,e),s=new Fe(t,e+1),i=[];return this.dr.forEachInRange([r,s],a=>{this.Vr(a),i.push(a.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new j(new ge([])),r=new Fe(t,e),s=new Fe(t,e+1);let i=ee();return this.dr.forEachInRange([r,s],a=>{i=i.add(a.key)}),i}containsKey(e){const t=new Fe(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class Fe{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return j.comparator(e.key,t.key)||se(e.wr,t.wr)}static Ar(e,t){return se(e.wr,t.wr)||j.comparator(e.key,t.key)}}/**
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
 */class A_{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new He(Fe.Er)}checkEmpty(e){return L.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Y0(i,t,r,s);this.mutationQueue.push(a);for(const l of s)this.br=this.br.add(new Fe(l.key,i)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return L.resolve(a)}lookupMutationBatch(e,t){return L.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.vr(r),i=s<0?0:s;return L.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return L.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return L.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new Fe(t,0),s=new Fe(t,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([r,s],a=>{const l=this.Dr(a.wr);i.push(l)}),L.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new He(se);return t.forEach(s=>{const i=new Fe(s,0),a=new Fe(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,a],l=>{r=r.add(l.wr)})}),L.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;j.isDocumentKey(i)||(i=i.child(""));const a=new Fe(new j(i),0);let l=new He(se);return this.br.forEachWhile(c=>{const d=c.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(l=l.add(c.wr)),!0)},a),L.resolve(this.Cr(l))}Cr(e){const t=[];return e.forEach(r=>{const s=this.Dr(r);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){ae(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return L.forEach(t.mutations,s=>{const i=new Fe(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,t){const r=new Fe(t,0),s=this.br.firstAfterOrEqual(r);return L.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,L.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class R_{constructor(e){this.Mr=e,this.docs=function(){return new _e(j.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,a=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return L.resolve(r?r.document.mutableCopy():Xe.newInvalidDocument(t))}getEntries(e,t){let r=Zt();return t.forEach(s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Xe.newInvalidDocument(s))}),L.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let i=Zt();const a=t.path,l=new j(a.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:f}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||u0(c0(f),r)<=0||(s.has(f.key)||bo(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return L.resolve(i)}getAllFromCollectionGroup(e,t,r,s){Y()}Or(e,t){return L.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new P_(this)}getSize(e){return L.resolve(this.size)}}class P_ extends b_{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?t.push(this.cr.addEntry(e,s)):this.cr.removeEntry(r)}),L.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
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
 */class C_{constructor(e){this.persistence=e,this.Nr=new es(t=>vl(t),_l),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Sl,this.targetCount=0,this.kr=Yr.Bn()}forEachTarget(e,t){return this.Nr.forEach((r,s)=>t(s)),L.resolve()}getLastRemoteSnapshotVersion(e){return L.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return L.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),L.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),L.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Yr(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,L.resolve()}updateTargetData(e,t){return this.Kn(t),L.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,L.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.Nr.forEach((a,l)=>{l.sequenceNumber<=t&&r.get(l.targetId)===null&&(this.Nr.delete(a),i.push(this.removeMatchingKeysForTargetId(e,l.targetId)),s++)}),L.waitFor(i).next(()=>s)}getTargetCount(e){return L.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return L.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),L.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach(a=>{i.push(s.markPotentiallyOrphaned(e,a))}),L.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),L.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return L.resolve(r)}containsKey(e,t){return L.resolve(this.Br.containsKey(t))}}/**
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
 */class k_{constructor(e,t){this.qr={},this.overlays={},this.Qr=new pl(0),this.Kr=!1,this.Kr=!0,this.$r=new x_,this.referenceDelegate=e(this),this.Ur=new C_(this),this.indexManager=new __,this.remoteDocumentCache=function(s){return new R_(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new y_(t),this.Gr=new I_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new S_,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new A_(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){z("MemoryPersistence","Starting transaction:",e);const s=new M_(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(i=>this.referenceDelegate.jr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Hr(e,t){return L.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,t)))}}class M_ extends h0{constructor(e){super(),this.currentSequenceNumber=e}}class xl{constructor(e){this.persistence=e,this.Jr=new Sl,this.Yr=null}static Zr(e){return new xl(e)}get Xr(){if(this.Yr)return this.Yr;throw Y()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),L.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),L.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),L.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(i=>this.Xr.add(i.toString()))}).next(()=>r.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return L.forEach(this.Xr,r=>{const s=j.fromPath(r);return this.ei(e,s).next(i=>{i||t.removeEntry(s,G.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return L.or([()=>L.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
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
 */class Al{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=s}static Wi(e,t){let r=ee(),s=ee();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Al(e,t.fromCache,r,s)}}/**
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
 */class D_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class N_{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return mm()?8:f0(Ze())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.Yi(e,t).next(a=>{i.result=a}).next(()=>{if(!i.result)return this.Zi(e,t,s,r).next(a=>{i.result=a})}).next(()=>{if(i.result)return;const a=new D_;return this.Xi(e,t,a).next(l=>{if(i.result=l,this.zi)return this.es(e,t,a,l.size)})}).next(()=>i.result)}es(e,t,r,s){return r.documentReadCount<this.ji?(ws()<=te.DEBUG&&z("QueryEngine","SDK will not create cache indexes for query:",Ar(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),L.resolve()):(ws()<=te.DEBUG&&z("QueryEngine","Query:",Ar(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(ws()<=te.DEBUG&&z("QueryEngine","The SDK decides to create cache indexes for query:",Ar(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Pt(t))):L.resolve())}Yi(e,t){if(Lu(t))return L.resolve(null);let r=Pt(t);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=Va(t,null,"F"),r=Pt(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(i=>{const a=ee(...i);return this.Ji.getDocuments(e,a).next(l=>this.indexManager.getMinOffset(e,r).next(c=>{const d=this.ts(t,l);return this.ns(t,d,a,c.readTime)?this.Yi(e,Va(t,null,"F")):this.rs(e,d,t,c)}))})))}Zi(e,t,r,s){return Lu(t)||s.isEqual(G.min())?L.resolve(null):this.Ji.getDocuments(e,r).next(i=>{const a=this.ts(t,i);return this.ns(t,a,r,s)?L.resolve(null):(ws()<=te.DEBUG&&z("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Ar(t)),this.rs(e,a,t,l0(s,-1)).next(l=>l))})}ts(e,t){let r=new He(Mh(e));return t.forEach((s,i)=>{bo(e,i)&&(r=r.add(i))}),r}ns(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Xi(e,t,r){return ws()<=te.DEBUG&&z("QueryEngine","Using full collection scan to execute query:",Ar(t)),this.Ji.getDocumentsMatchingQuery(e,t,xn.min(),r)}rs(e,t,r,s){return this.Ji.getDocumentsMatchingQuery(e,r,s).next(i=>(t.forEach(a=>{i=i.insert(a.key,a)}),i))}}/**
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
 */class L_{constructor(e,t,r,s){this.persistence=e,this.ss=t,this.serializer=s,this.os=new _e(se),this._s=new es(i=>vl(i),_l),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new T_(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function O_(n,e,t,r){return new L_(n,e,t,r)}async function Zh(n,e){const t=K(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next(i=>(s=i,t.ls(e),t.mutationQueue.getAllMutationBatches(r))).next(i=>{const a=[],l=[];let c=ee();for(const d of s){a.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}for(const d of i){l.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(r,c).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:l}))})})}function V_(n,e){const t=K(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),i=t.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,f){const m=d.batch,v=m.keys();let b=L.resolve();return v.forEach(T=>{b=b.next(()=>f.getEntry(c,T)).next(A=>{const R=d.docVersions.get(T);ae(R!==null),A.version.compareTo(R)<0&&(m.applyToRemoteDocument(A,d),A.isValidDocument()&&(A.setReadTime(d.commitVersion),f.addEntry(A)))})}),b.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(t,r,e,i).next(()=>i.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let c=ee();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(e))).next(()=>t.localDocuments.getDocuments(r,s))})}function ef(n){const e=K(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function B_(n,e){const t=K(n),r=e.snapshotVersion;let s=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const a=t.cs.newChangeBuffer({trackRemovals:!0});s=t.os;const l=[];e.targetChanges.forEach((f,m)=>{const v=s.get(m);if(!v)return;l.push(t.Ur.removeMatchingKeys(i,f.removedDocuments,m).next(()=>t.Ur.addMatchingKeys(i,f.addedDocuments,m)));let b=v.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?b=b.withResumeToken(We.EMPTY_BYTE_STRING,G.min()).withLastLimboFreeSnapshotVersion(G.min()):f.resumeToken.approximateByteSize()>0&&(b=b.withResumeToken(f.resumeToken,r)),s=s.insert(m,b),function(A,R,x){return A.resumeToken.approximateByteSize()===0||R.snapshotVersion.toMicroseconds()-A.snapshotVersion.toMicroseconds()>=3e8?!0:x.addedDocuments.size+x.modifiedDocuments.size+x.removedDocuments.size>0}(v,b,f)&&l.push(t.Ur.updateTargetData(i,b))});let c=Zt(),d=ee();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))}),l.push(F_(i,a,e.documentUpdates).next(f=>{c=f.Ps,d=f.Is})),!r.isEqual(G.min())){const f=t.Ur.getLastRemoteSnapshotVersion(i).next(m=>t.Ur.setTargetsMetadata(i,i.currentSequenceNumber,r));l.push(f)}return L.waitFor(l).next(()=>a.apply(i)).next(()=>t.localDocuments.getLocalViewOfDocuments(i,c,d)).next(()=>c)}).then(i=>(t.os=s,i))}function F_(n,e,t){let r=ee(),s=ee();return t.forEach(i=>r=r.add(i)),e.getEntries(n,r).next(i=>{let a=Zt();return t.forEach((l,c)=>{const d=i.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(l)),c.isNoDocument()&&c.version.isEqual(G.min())?(e.removeEntry(l,c.readTime),a=a.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),a=a.insert(l,c)):z("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:a,Is:s}})}function z_(n,e){const t=K(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function $_(n,e){const t=K(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return t.Ur.getTargetData(r,e).next(i=>i?(s=i,L.resolve(s)):t.Ur.allocateTargetId(r).next(a=>(s=new yn(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.Ur.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=t.os.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.os=t.os.insert(r.targetId,r),t._s.set(e,r.targetId)),r})}async function Ua(n,e,t){const r=K(n),s=r.os.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!ri(a))throw a;z("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}r.os=r.os.remove(e),r._s.delete(s.target)}function Wu(n,e,t){const r=K(n);let s=G.min(),i=ee();return r.persistence.runTransaction("Execute query","readwrite",a=>function(c,d,f){const m=K(c),v=m._s.get(f);return v!==void 0?L.resolve(m.os.get(v)):m.Ur.getTargetData(d,f)}(r,a,Pt(e)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(a,l.targetId).next(c=>{i=c})}).next(()=>r.ss.getDocumentsMatchingQuery(a,e,t?s:G.min(),t?i:ee())).next(l=>(U_(r,M0(e),l),{documents:l,Ts:i})))}function U_(n,e,t){let r=n.us.get(e)||G.min();t.forEach((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)}),n.us.set(e,r)}class Yu{constructor(){this.activeTargetIds=B0()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class q_{constructor(){this.so=new Yu,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Yu,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class j_{_o(e){}shutdown(){}}/**
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
 */class Gu{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){z("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){z("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Di=null;function ha(){return Di===null?Di=function(){return 268435456+Math.round(2147483648*Math.random())}():Di++,"0x"+Di.toString(16)}/**
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
 */const H_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
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
 */class W_{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
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
 */const Ke="WebChannelConnection";class Y_ extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${s}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Fo(){return!1}Mo(t,r,s,i,a){const l=ha(),c=this.xo(t,r.toUriEncodedString());z("RestConnection",`Sending RPC '${t}' ${l}:`,c,s);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,a),this.No(t,c,d,s).then(f=>(z("RestConnection",`Received RPC '${t}' ${l}: `,f),f),f=>{throw qr("RestConnection",`RPC '${t}' ${l} failed with error: `,f,"url: ",c,"request:",s),f})}Lo(t,r,s,i,a,l){return this.Mo(t,r,s,i,a)}Oo(t,r,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Zr}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((i,a)=>t[a]=i),s&&s.headers.forEach((i,a)=>t[a]=i)}xo(t,r){const s=H_[t];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,s){const i=ha();return new Promise((a,l)=>{const c=new mh;c.setWithCredentials(!0),c.listenOnce(gh.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Bi.NO_ERROR:const f=c.getResponseJson();z(Ke,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(f)),a(f);break;case Bi.TIMEOUT:z(Ke,`RPC '${e}' ${i} timed out`),l(new $(N.DEADLINE_EXCEEDED,"Request time out"));break;case Bi.HTTP_ERROR:const m=c.getStatus();if(z(Ke,`RPC '${e}' ${i} failed with status:`,m,"response text:",c.getResponseText()),m>0){let v=c.getResponseJson();Array.isArray(v)&&(v=v[0]);const b=v==null?void 0:v.error;if(b&&b.status&&b.message){const T=function(R){const x=R.toLowerCase().replace(/_/g,"-");return Object.values(N).indexOf(x)>=0?x:N.UNKNOWN}(b.status);l(new $(T,b.message))}else l(new $(N.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new $(N.UNAVAILABLE,"Connection failed."));break;default:Y()}}finally{z(Ke,`RPC '${e}' ${i} completed.`)}});const d=JSON.stringify(s);z(Ke,`RPC '${e}' ${i} sending request:`,s),c.send(t,"POST",d,r,15)})}Bo(e,t,r){const s=ha(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=_h(),l=vh(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;const f=i.join("");z(Ke,`Creating RPC '${e}' stream ${s}: ${f}`,c);const m=a.createWebChannel(f,c);let v=!1,b=!1;const T=new W_({Io:R=>{b?z(Ke,`Not sending because RPC '${e}' stream ${s} is closed:`,R):(v||(z(Ke,`Opening RPC '${e}' stream ${s} transport.`),m.open(),v=!0),z(Ke,`RPC '${e}' stream ${s} sending:`,R),m.send(R))},To:()=>m.close()}),A=(R,x,M)=>{R.listen(x,D=>{try{M(D)}catch(C){setTimeout(()=>{throw C},0)}})};return A(m,Is.EventType.OPEN,()=>{b||(z(Ke,`RPC '${e}' stream ${s} transport opened.`),T.yo())}),A(m,Is.EventType.CLOSE,()=>{b||(b=!0,z(Ke,`RPC '${e}' stream ${s} transport closed`),T.So())}),A(m,Is.EventType.ERROR,R=>{b||(b=!0,qr(Ke,`RPC '${e}' stream ${s} transport errored:`,R),T.So(new $(N.UNAVAILABLE,"The operation could not be completed")))}),A(m,Is.EventType.MESSAGE,R=>{var x;if(!b){const M=R.data[0];ae(!!M);const D=M,C=D.error||((x=D[0])===null||x===void 0?void 0:x.error);if(C){z(Ke,`RPC '${e}' stream ${s} received error:`,C);const O=C.status;let V=function(y){const _=Re[y];if(_!==void 0)return qh(_)}(O),E=C.message;V===void 0&&(V=N.INTERNAL,E="Unknown error status: "+O+" with message "+C.message),b=!0,T.So(new $(V,E)),m.close()}else z(Ke,`RPC '${e}' stream ${s} received:`,M),T.bo(M)}}),A(l,yh.STAT_EVENT,R=>{R.stat===Ma.PROXY?z(Ke,`RPC '${e}' stream ${s} detected buffering proxy`):R.stat===Ma.NOPROXY&&z(Ke,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{T.wo()},0),T}}function fa(){return typeof document<"u"?document:null}/**
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
 */function xo(n){return new r_(n,!0)}/**
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
 */class tf{constructor(e,t,r=1e3,s=1.5,i=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=s,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,t-r);s>0&&z("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class nf{constructor(e,t,r,s,i,a,l,c){this.ui=e,this.Ho=r,this.Jo=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new tf(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===N.RESOURCE_EXHAUSTED?(Xt(t.toString()),Xt("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===N.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===t&&this.P_(r,s)},r=>{e(()=>{const s=new $(N.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return z("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(z("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class G_ extends nf{constructor(e,t,r,s,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=o_(this.serializer,e),r=function(i){if(!("targetChange"in i))return G.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?G.min():a.readTime?Ct(a.readTime):G.min()}(e);return this.listener.d_(t,r)}A_(e){const t={};t.database=$a(this.serializer),t.addTarget=function(i,a){let l;const c=a.target;if(l=Oa(c)?{documents:c_(i,c)}:{query:u_(i,c)._t},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=Wh(i,a.resumeToken);const d=Ba(i,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(G.min())>0){l.readTime=io(i,a.snapshotVersion.toTimestamp());const d=Ba(i,a.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,e);const r=h_(this.serializer,e);r&&(t.labels=r),this.a_(t)}R_(e){const t={};t.database=$a(this.serializer),t.removeTarget=e,this.a_(t)}}class K_ extends nf{constructor(e,t,r,s,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return ae(!!e.streamToken),this.lastStreamToken=e.streamToken,ae(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){ae(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=l_(e.writeResults,e.commitTime),r=Ct(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=$a(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>a_(this.serializer,r))};this.a_(t)}}/**
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
 */class Q_ extends class{}{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new $(N.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,a])=>this.connection.Mo(e,Fa(t,r),s,i,a)).catch(i=>{throw i.name==="FirebaseError"?(i.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new $(N.UNKNOWN,i.toString())})}Lo(e,t,r,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Lo(e,Fa(t,r),s,a,l,i)).catch(a=>{throw a.name==="FirebaseError"?(a.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new $(N.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class J_{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Xt(t),this.D_=!1):z("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class X_{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(a=>{r.enqueueAndForget(async()=>{ir(this)&&(z("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=K(c);d.L_.add(4),await oi(d),d.q_.set("Unknown"),d.L_.delete(4),await Ao(d)}(this))})}),this.q_=new J_(r,s)}}async function Ao(n){if(ir(n))for(const e of n.B_)await e(!0)}async function oi(n){for(const e of n.B_)await e(!1)}function rf(n,e){const t=K(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),kl(t)?Cl(t):ts(t).r_()&&Pl(t,e))}function Rl(n,e){const t=K(n),r=ts(t);t.N_.delete(e),r.r_()&&sf(t,e),t.N_.size===0&&(r.r_()?r.o_():ir(t)&&t.q_.set("Unknown"))}function Pl(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(G.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}ts(n).A_(e)}function sf(n,e){n.Q_.xe(e),ts(n).R_(e)}function Cl(n){n.Q_=new Z0({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),ts(n).start(),n.q_.v_()}function kl(n){return ir(n)&&!ts(n).n_()&&n.N_.size>0}function ir(n){return K(n).L_.size===0}function of(n){n.Q_=void 0}async function Z_(n){n.q_.set("Online")}async function ew(n){n.N_.forEach((e,t)=>{Pl(n,e)})}async function tw(n,e){of(n),kl(n)?(n.q_.M_(e),Cl(n)):n.q_.set("Unknown")}async function nw(n,e,t){if(n.q_.set("Online"),e instanceof Hh&&e.state===2&&e.cause)try{await async function(s,i){const a=i.cause;for(const l of i.targetIds)s.N_.has(l)&&(await s.remoteSyncer.rejectListen(l,a),s.N_.delete(l),s.Q_.removeTarget(l))}(n,e)}catch(r){z("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await oo(n,r)}else if(e instanceof $i?n.Q_.Ke(e):e instanceof jh?n.Q_.He(e):n.Q_.We(e),!t.isEqual(G.min()))try{const r=await ef(n.localStore);t.compareTo(r)>=0&&await function(i,a){const l=i.Q_.rt(a);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const f=i.N_.get(d);f&&i.N_.set(d,f.withResumeToken(c.resumeToken,a))}}),l.targetMismatches.forEach((c,d)=>{const f=i.N_.get(c);if(!f)return;i.N_.set(c,f.withResumeToken(We.EMPTY_BYTE_STRING,f.snapshotVersion)),sf(i,c);const m=new yn(f.target,c,d,f.sequenceNumber);Pl(i,m)}),i.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(r){z("RemoteStore","Failed to raise snapshot:",r),await oo(n,r)}}async function oo(n,e,t){if(!ri(e))throw e;n.L_.add(1),await oi(n),n.q_.set("Offline"),t||(t=()=>ef(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{z("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await Ao(n)})}function af(n,e){return e().catch(t=>oo(n,t,e))}async function Ro(n){const e=K(n),t=Rn(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;rw(e);)try{const s=await z_(e.localStore,r);if(s===null){e.O_.length===0&&t.o_();break}r=s.batchId,sw(e,s)}catch(s){await oo(e,s)}lf(e)&&cf(e)}function rw(n){return ir(n)&&n.O_.length<10}function sw(n,e){n.O_.push(e);const t=Rn(n);t.r_()&&t.V_&&t.m_(e.mutations)}function lf(n){return ir(n)&&!Rn(n).n_()&&n.O_.length>0}function cf(n){Rn(n).start()}async function iw(n){Rn(n).p_()}async function ow(n){const e=Rn(n);for(const t of n.O_)e.m_(t.mutations)}async function aw(n,e,t){const r=n.O_.shift(),s=El.from(r,e,t);await af(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await Ro(n)}async function lw(n,e){e&&Rn(n).V_&&await async function(r,s){if(function(a){return Q0(a)&&a!==N.ABORTED}(s.code)){const i=r.O_.shift();Rn(r).s_(),await af(r,()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s)),await Ro(r)}}(n,e),lf(n)&&cf(n)}async function Ku(n,e){const t=K(n);t.asyncQueue.verifyOperationInProgress(),z("RemoteStore","RemoteStore received new credentials");const r=ir(t);t.L_.add(3),await oi(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await Ao(t)}async function cw(n,e){const t=K(n);e?(t.L_.delete(2),await Ao(t)):e||(t.L_.add(2),await oi(t),t.q_.set("Unknown"))}function ts(n){return n.K_||(n.K_=function(t,r,s){const i=K(t);return i.w_(),new G_(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:Z_.bind(null,n),Ro:ew.bind(null,n),mo:tw.bind(null,n),d_:nw.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),kl(n)?Cl(n):n.q_.set("Unknown")):(await n.K_.stop(),of(n))})),n.K_}function Rn(n){return n.U_||(n.U_=function(t,r,s){const i=K(t);return i.w_(),new K_(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:iw.bind(null,n),mo:lw.bind(null,n),f_:ow.bind(null,n),g_:aw.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await Ro(n)):(await n.U_.stop(),n.O_.length>0&&(z("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
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
 */class Ml{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new Kt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const a=Date.now()+r,l=new Ml(e,t,a,s,i);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new $(N.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Dl(n,e){if(Xt("AsyncQueue",`${e}: ${n}`),ri(n))return new $(N.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class Vr{constructor(e){this.comparator=e?(t,r)=>e(t,r)||j.comparator(t.key,r.key):(t,r)=>j.comparator(t.key,r.key),this.keyedMap=Ss(),this.sortedSet=new _e(this.comparator)}static emptySet(e){return new Vr(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Vr)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new Vr;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
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
 */class Qu{constructor(){this.W_=new _e(j.comparator)}track(e){const t=e.doc.key,r=this.W_.get(t);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(t,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(t):e.type===1&&r.type===2?this.W_=this.W_.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):Y():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,r)=>{e.push(r)}),e}}class Gr{constructor(e,t,r,s,i,a,l,c,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,s,i){const a=[];return t.forEach(l=>{a.push({type:0,doc:l})}),new Gr(e,t,Vr.emptySet(t),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&wo(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
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
 */class uw{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class dw{constructor(){this.queries=Ju(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const s=K(t),i=s.queries;s.queries=Ju(),i.forEach((a,l)=>{for(const c of l.j_)c.onError(r)})})(this,new $(N.ABORTED,"Firestore shutting down"))}}function Ju(){return new es(n=>kh(n),wo)}async function uf(n,e){const t=K(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.H_()&&e.J_()&&(r=2):(i=new uw,r=e.J_()?0:1);try{switch(r){case 0:i.z_=await t.onListen(s,!0);break;case 1:i.z_=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const l=Dl(a,`Initialization of query '${Ar(e.query)}' failed`);return void e.onError(l)}t.queries.set(s,i),i.j_.push(e),e.Z_(t.onlineState),i.z_&&e.X_(i.z_)&&Nl(t)}async function df(n,e){const t=K(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const a=i.j_.indexOf(e);a>=0&&(i.j_.splice(a,1),i.j_.length===0?s=e.J_()?0:1:!i.H_()&&e.J_()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function hw(n,e){const t=K(n);let r=!1;for(const s of e){const i=s.query,a=t.queries.get(i);if(a){for(const l of a.j_)l.X_(s)&&(r=!0);a.z_=s}}r&&Nl(t)}function fw(n,e,t){const r=K(n),s=r.queries.get(e);if(s)for(const i of s.j_)i.onError(t);r.queries.delete(e)}function Nl(n){n.Y_.forEach(e=>{e.next()})}var qa,Xu;(Xu=qa||(qa={})).ea="default",Xu.Cache="cache";class hf{constructor(e,t,r){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Gr(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const r=t!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Gr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==qa.Cache}}/**
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
 */class ff{constructor(e){this.key=e}}class pf{constructor(e){this.key=e}}class pw{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ee(),this.mutatedKeys=ee(),this.Aa=Mh(e),this.Ra=new Vr(this.Aa)}get Va(){return this.Ta}ma(e,t){const r=t?t.fa:new Qu,s=t?t.Ra:this.Ra;let i=t?t.mutatedKeys:this.mutatedKeys,a=s,l=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((f,m)=>{const v=s.get(f),b=bo(this.query,m)?m:null,T=!!v&&this.mutatedKeys.has(v.key),A=!!b&&(b.hasLocalMutations||this.mutatedKeys.has(b.key)&&b.hasCommittedMutations);let R=!1;v&&b?v.data.isEqual(b.data)?T!==A&&(r.track({type:3,doc:b}),R=!0):this.ga(v,b)||(r.track({type:2,doc:b}),R=!0,(c&&this.Aa(b,c)>0||d&&this.Aa(b,d)<0)&&(l=!0)):!v&&b?(r.track({type:0,doc:b}),R=!0):v&&!b&&(r.track({type:1,doc:v}),R=!0,(c||d)&&(l=!0)),R&&(b?(a=a.add(b),i=A?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),r.track({type:1,doc:f})}return{Ra:a,fa:r,ns:l,mutatedKeys:i}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const a=e.fa.G_();a.sort((f,m)=>function(b,T){const A=R=>{switch(R){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Y()}};return A(b)-A(T)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(r),s=s!=null&&s;const l=t&&!s?this.ya():[],c=this.da.size===0&&this.current&&!s?1:0,d=c!==this.Ea;return this.Ea=c,a.length!==0||d?{snapshot:new Gr(this.query,e.Ra,i,a,e.mutatedKeys,c===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Qu,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ee(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const t=[];return e.forEach(r=>{this.da.has(r)||t.push(new pf(r))}),this.da.forEach(r=>{e.has(r)||t.push(new ff(r))}),t}ba(e){this.Ta=e.Ts,this.da=ee();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Gr.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class mw{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class gw{constructor(e){this.key=e,this.va=!1}}class yw{constructor(e,t,r,s,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new es(l=>kh(l),wo),this.Ma=new Map,this.xa=new Set,this.Oa=new _e(j.comparator),this.Na=new Map,this.La=new Sl,this.Ba={},this.ka=new Map,this.qa=Yr.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function vw(n,e,t=!0){const r=wf(n);let s;const i=r.Fa.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Da()):s=await mf(r,e,t,!0),s}async function _w(n,e){const t=wf(n);await mf(t,e,!0,!1)}async function mf(n,e,t,r){const s=await $_(n.localStore,Pt(e)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let l;return r&&(l=await ww(n,e,i,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&rf(n.remoteStore,s),l}async function ww(n,e,t,r,s){n.Ka=(m,v,b)=>async function(A,R,x,M){let D=R.view.ma(x);D.ns&&(D=await Wu(A.localStore,R.query,!1).then(({documents:E})=>R.view.ma(E,D)));const C=M&&M.targetChanges.get(R.targetId),O=M&&M.targetMismatches.get(R.targetId)!=null,V=R.view.applyChanges(D,A.isPrimaryClient,C,O);return ed(A,R.targetId,V.wa),V.snapshot}(n,m,v,b);const i=await Wu(n.localStore,e,!0),a=new pw(e,i.Ts),l=a.ma(i.documents),c=ii.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),d=a.applyChanges(l,n.isPrimaryClient,c);ed(n,t,d.wa);const f=new mw(e,t,a);return n.Fa.set(e,f),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),d.snapshot}async function bw(n,e,t){const r=K(n),s=r.Fa.get(e),i=r.Ma.get(s.targetId);if(i.length>1)return r.Ma.set(s.targetId,i.filter(a=>!wo(a,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Ua(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Rl(r.remoteStore,s.targetId),ja(r,s.targetId)}).catch(ni)):(ja(r,s.targetId),await Ua(r.localStore,s.targetId,!0))}async function Ew(n,e){const t=K(n),r=t.Fa.get(e),s=t.Ma.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Rl(t.remoteStore,r.targetId))}async function Tw(n,e,t){const r=Cw(n);try{const s=await function(a,l){const c=K(a),d=De.now(),f=l.reduce((b,T)=>b.add(T.key),ee());let m,v;return c.persistence.runTransaction("Locally write mutations","readwrite",b=>{let T=Zt(),A=ee();return c.cs.getEntries(b,f).next(R=>{T=R,T.forEach((x,M)=>{M.isValidDocument()||(A=A.add(x))})}).next(()=>c.localDocuments.getOverlayedDocuments(b,T)).next(R=>{m=R;const x=[];for(const M of l){const D=H0(M,m.get(M.key).overlayedDocument);D!=null&&x.push(new Cn(M.key,D,Ih(D.value.mapValue),rt.exists(!0)))}return c.mutationQueue.addMutationBatch(b,d,x,l)}).next(R=>{v=R;const x=R.applyToLocalDocumentSet(m,A);return c.documentOverlayCache.saveOverlays(b,R.batchId,x)})}).then(()=>({batchId:v.batchId,changes:Nh(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(a,l,c){let d=a.Ba[a.currentUser.toKey()];d||(d=new _e(se)),d=d.insert(l,c),a.Ba[a.currentUser.toKey()]=d}(r,s.batchId,t),await ai(r,s.changes),await Ro(r.remoteStore)}catch(s){const i=Dl(s,"Failed to persist write");t.reject(i)}}async function gf(n,e){const t=K(n);try{const r=await B_(t.localStore,e);e.targetChanges.forEach((s,i)=>{const a=t.Na.get(i);a&&(ae(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?a.va=!0:s.modifiedDocuments.size>0?ae(a.va):s.removedDocuments.size>0&&(ae(a.va),a.va=!1))}),await ai(t,r,e)}catch(r){await ni(r)}}function Zu(n,e,t){const r=K(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Fa.forEach((i,a)=>{const l=a.view.Z_(e);l.snapshot&&s.push(l.snapshot)}),function(a,l){const c=K(a);c.onlineState=l;let d=!1;c.queries.forEach((f,m)=>{for(const v of m.j_)v.Z_(l)&&(d=!0)}),d&&Nl(c)}(r.eventManager,e),s.length&&r.Ca.d_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function Iw(n,e,t){const r=K(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Na.get(e),i=s&&s.key;if(i){let a=new _e(j.comparator);a=a.insert(i,Xe.newNoDocument(i,G.min()));const l=ee().add(i),c=new So(G.min(),new Map,new _e(se),a,l);await gf(r,c),r.Oa=r.Oa.remove(i),r.Na.delete(e),Ll(r)}else await Ua(r.localStore,e,!1).then(()=>ja(r,e,t)).catch(ni)}async function Sw(n,e){const t=K(n),r=e.batch.batchId;try{const s=await V_(t.localStore,e);vf(t,r,null),yf(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await ai(t,s)}catch(s){await ni(s)}}async function xw(n,e,t){const r=K(n);try{const s=await function(a,l){const c=K(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return c.mutationQueue.lookupMutationBatch(d,l).next(m=>(ae(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>c.localDocuments.getDocuments(d,f))})}(r.localStore,e);vf(r,e,t),yf(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await ai(r,s)}catch(s){await ni(s)}}function yf(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function vf(n,e,t){const r=K(n);let s=r.Ba[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.Ba[r.currentUser.toKey()]=s}}function ja(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Ma.get(e))n.Fa.delete(r),t&&n.Ca.$a(r,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(r=>{n.La.containsKey(r)||_f(n,r)})}function _f(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(Rl(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),Ll(n))}function ed(n,e,t){for(const r of t)r instanceof ff?(n.La.addReference(r.key,e),Aw(n,r)):r instanceof pf?(z("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,e),n.La.containsKey(r.key)||_f(n,r.key)):Y()}function Aw(n,e){const t=e.key,r=t.path.canonicalString();n.Oa.get(t)||n.xa.has(r)||(z("SyncEngine","New document in limbo: "+t),n.xa.add(r),Ll(n))}function Ll(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new j(ge.fromString(e)),r=n.qa.next();n.Na.set(r,new gw(t)),n.Oa=n.Oa.insert(t,r),rf(n.remoteStore,new yn(Pt(wl(t.path)),r,"TargetPurposeLimboResolution",pl.oe))}}async function ai(n,e,t){const r=K(n),s=[],i=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((l,c)=>{a.push(r.Ka(c,e,t).then(d=>{var f;if((d||t)&&r.isPrimaryClient){const m=d?!d.fromCache:(f=t==null?void 0:t.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){s.push(d);const m=Al.Wi(c.targetId,d);i.push(m)}}))}),await Promise.all(a),r.Ca.d_(s),await async function(c,d){const f=K(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>L.forEach(d,v=>L.forEach(v.$i,b=>f.persistence.referenceDelegate.addReference(m,v.targetId,b)).next(()=>L.forEach(v.Ui,b=>f.persistence.referenceDelegate.removeReference(m,v.targetId,b)))))}catch(m){if(!ri(m))throw m;z("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const v=m.targetId;if(!m.fromCache){const b=f.os.get(v),T=b.snapshotVersion,A=b.withLastLimboFreeSnapshotVersion(T);f.os=f.os.insert(v,A)}}}(r.localStore,i))}async function Rw(n,e){const t=K(n);if(!t.currentUser.isEqual(e)){z("SyncEngine","User change. New user:",e.toKey());const r=await Zh(t.localStore,e);t.currentUser=e,function(i,a){i.ka.forEach(l=>{l.forEach(c=>{c.reject(new $(N.CANCELLED,a))})}),i.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await ai(t,r.hs)}}function Pw(n,e){const t=K(n),r=t.Na.get(e);if(r&&r.va)return ee().add(r.key);{let s=ee();const i=t.Ma.get(e);if(!i)return s;for(const a of i){const l=t.Fa.get(a);s=s.unionWith(l.view.Va)}return s}}function wf(n){const e=K(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=gf.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Pw.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Iw.bind(null,e),e.Ca.d_=hw.bind(null,e.eventManager),e.Ca.$a=fw.bind(null,e.eventManager),e}function Cw(n){const e=K(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Sw.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=xw.bind(null,e),e}class ao{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=xo(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return O_(this.persistence,new N_,e.initialUser,this.serializer)}Ga(e){return new k_(xl.Zr,this.serializer)}Wa(e){return new q_}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ao.provider={build:()=>new ao};class Ha{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Zu(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Rw.bind(null,this.syncEngine),await cw(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new dw}()}createDatastore(e){const t=xo(e.databaseInfo.databaseId),r=function(i){return new Y_(i)}(e.databaseInfo);return function(i,a,l,c){return new Q_(i,a,l,c)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,s,i,a,l){return new X_(r,s,i,a,l)}(this.localStore,this.datastore,e.asyncQueue,t=>Zu(this.syncEngine,t,0),function(){return Gu.D()?new Gu:new j_}())}createSyncEngine(e,t){return function(s,i,a,l,c,d,f){const m=new yw(s,i,a,l,c,d);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const i=K(s);z("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await oi(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Ha.provider={build:()=>new Ha};/**
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
 */class bf{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Xt("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
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
 */class kw{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=Qe.UNAUTHENTICATED,this.clientId=bh.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,async a=>{z("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(z("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Kt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=Dl(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function pa(n,e){n.asyncQueue.verifyOperationInProgress(),z("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Zh(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function td(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Mw(n);z("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>Ku(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>Ku(e.remoteStore,s)),n._onlineComponents=e}async function Mw(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){z("FirestoreClient","Using user provided OfflineComponentProvider");try{await pa(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===N.FAILED_PRECONDITION||s.code===N.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;qr("Error using user provided cache. Falling back to memory cache: "+t),await pa(n,new ao)}}else z("FirestoreClient","Using default OfflineComponentProvider"),await pa(n,new ao);return n._offlineComponents}async function Ef(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(z("FirestoreClient","Using user provided OnlineComponentProvider"),await td(n,n._uninitializedComponentsProvider._online)):(z("FirestoreClient","Using default OnlineComponentProvider"),await td(n,new Ha))),n._onlineComponents}function Dw(n){return Ef(n).then(e=>e.syncEngine)}async function Tf(n){const e=await Ef(n),t=e.eventManager;return t.onListen=vw.bind(null,e.syncEngine),t.onUnlisten=bw.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=_w.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Ew.bind(null,e.syncEngine),t}function Nw(n,e,t={}){const r=new Kt;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new bf({next:v=>{f.Za(),a.enqueueAndForget(()=>df(i,m));const b=v.docs.has(l);!b&&v.fromCache?d.reject(new $(N.UNAVAILABLE,"Failed to get document because the client is offline.")):b&&v.fromCache&&c&&c.source==="server"?d.reject(new $(N.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(v)},error:v=>d.reject(v)}),m=new hf(wl(l.path),f,{includeMetadataChanges:!0,_a:!0});return uf(i,m)}(await Tf(n),n.asyncQueue,e,t,r)),r.promise}function Lw(n,e,t={}){const r=new Kt;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new bf({next:v=>{f.Za(),a.enqueueAndForget(()=>df(i,m)),v.fromCache&&c.source==="server"?d.reject(new $(N.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(v)},error:v=>d.reject(v)}),m=new hf(l,f,{includeMetadataChanges:!0,_a:!0});return uf(i,m)}(await Tf(n),n.asyncQueue,e,t,r)),r.promise}/**
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
 */function If(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const nd=new Map;/**
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
 */function Sf(n,e,t){if(!t)throw new $(N.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Ow(n,e,t,r){if(e===!0&&r===!0)throw new $(N.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function rd(n){if(!j.isDocumentKey(n))throw new $(N.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function sd(n){if(j.isDocumentKey(n))throw new $(N.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Ol(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":Y()}function Dt(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new $(N.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ol(n);throw new $(N.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */class id{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new $(N.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new $(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Ow("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=If((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new $(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new $(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new $(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Po{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new id({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new $(N.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new $(N.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new id(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Zv;switch(r.type){case"firstParty":return new r0(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new $(N.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=nd.get(t);r&&(z("ComponentProvider","Removing Datastore"),nd.delete(t),r.terminate())}(this),Promise.resolve()}}function Vw(n,e,t,r={}){var s;const i=(n=Dt(n,Po))._getSettings(),a=`${e}:${t}`;if(i.host!=="firestore.googleapis.com"&&i.host!==a&&qr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},i),{host:a,ssl:!1})),r.mockUserToken){let l,c;if(typeof r.mockUserToken=="string")l=r.mockUserToken,c=Qe.MOCK_USER;else{l=lm(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new $(N.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new Qe(d)}n._authCredentials=new e0(new wh(l,c))}}/**
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
 */class Co{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Co(this.firestore,e,this._query)}}class at{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new En(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new at(this.firestore,e,this._key)}}class En extends Co{constructor(e,t,r){super(e,t,wl(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new at(this.firestore,null,new j(e))}withConverter(e){return new En(this.firestore,e,this._path)}}function Bw(n,e,...t){if(n=Ne(n),Sf("collection","path",e),n instanceof Po){const r=ge.fromString(e,...t);return sd(r),new En(n,null,r)}{if(!(n instanceof at||n instanceof En))throw new $(N.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(ge.fromString(e,...t));return sd(r),new En(n.firestore,null,r)}}function js(n,e,...t){if(n=Ne(n),arguments.length===1&&(e=bh.newId()),Sf("doc","path",e),n instanceof Po){const r=ge.fromString(e,...t);return rd(r),new at(n,null,new j(r))}{if(!(n instanceof at||n instanceof En))throw new $(N.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(ge.fromString(e,...t));return rd(r),new at(n.firestore,n instanceof En?n.converter:null,new j(r))}}/**
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
 */class od{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new tf(this,"async_queue_retry"),this.Vu=()=>{const r=fa();r&&z("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=fa();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=fa();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Kt;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!ri(e))throw e;z("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const s=function(a){let l=a.message||"";return a.stack&&(l=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),l}(r);throw Xt("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const s=Ml.createAndSchedule(this,e,t,r,i=>this.yu(i));return this.Tu.push(s),s}fu(){this.Eu&&Y()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class or extends Po{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new od,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new od(e),this._firestoreClient=void 0,await e}}}function Fw(n,e){const t=typeof n=="object"?n:Md(),r=typeof n=="string"?n:"(default)",s=tl(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=om("firestore");i&&Vw(s,...i)}return s}function ko(n){if(n._terminated)throw new $(N.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||zw(n),n._firestoreClient}function zw(n){var e,t,r;const s=n._freezeSettings(),i=function(l,c,d,f){return new g0(l,c,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,If(f.experimentalLongPollingOptions),f.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new kw(n._authCredentials,n._appCheckCredentials,n._queue,i,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
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
 */class Kr{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Kr(We.fromBase64String(e))}catch(t){throw new $(N.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Kr(We.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class Mo{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new $(N.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new je(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Vl{constructor(e){this._methodName=e}}/**
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
 */class Bl{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new $(N.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new $(N.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return se(this._lat,e._lat)||se(this._long,e._long)}}/**
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
 */class Fl{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0}(this._values,e._values)}}/**
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
 */const $w=/^__.*__$/;class Uw{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Cn(e,this.data,this.fieldMask,t,this.fieldTransforms):new si(e,this.data,t,this.fieldTransforms)}}class xf{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Cn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Af(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Y()}}class zl{constructor(e,t,r,s,i,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new zl(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.Ou(e),s}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return lo(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Af(this.Cu)&&$w.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class qw{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||xo(e)}Qu(e,t,r,s=!1){return new zl({Cu:e,methodName:t,qu:r,path:je.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function $l(n){const e=n._freezeSettings(),t=xo(n._databaseId);return new qw(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Ul(n,e,t,r,s,i={}){const a=n.Qu(i.merge||i.mergeFields?2:0,e,t,s);ql("Data must be an object, but it was:",a,r);const l=Rf(r,a);let c,d;if(i.merge)c=new ot(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const v=Wa(e,m,t);if(!a.contains(v))throw new $(N.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);Cf(f,v)||f.push(v)}c=new ot(f),d=a.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=a.fieldTransforms;return new Uw(new nt(l),c,d)}class Do extends Vl{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Do}}function jw(n,e,t,r){const s=n.Qu(1,e,t);ql("Data must be an object, but it was:",s,r);const i=[],a=nt.empty();sr(r,(c,d)=>{const f=jl(e,c,t);d=Ne(d);const m=s.Nu(f);if(d instanceof Do)i.push(f);else{const v=No(d,m);v!=null&&(i.push(f),a.set(f,v))}});const l=new ot(i);return new xf(a,l,s.fieldTransforms)}function Hw(n,e,t,r,s,i){const a=n.Qu(1,e,t),l=[Wa(e,r,t)],c=[s];if(i.length%2!=0)throw new $(N.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let v=0;v<i.length;v+=2)l.push(Wa(e,i[v])),c.push(i[v+1]);const d=[],f=nt.empty();for(let v=l.length-1;v>=0;--v)if(!Cf(d,l[v])){const b=l[v];let T=c[v];T=Ne(T);const A=a.Nu(b);if(T instanceof Do)d.push(b);else{const R=No(T,A);R!=null&&(d.push(b),f.set(b,R))}}const m=new ot(d);return new xf(f,m,a.fieldTransforms)}function No(n,e){if(Pf(n=Ne(n)))return ql("Unsupported field value:",e,n),Rf(n,e);if(n instanceof Vl)return function(r,s){if(!Af(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,s){const i=[];let a=0;for(const l of r){let c=No(l,s.Lu(a));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),a++}return{arrayValue:{values:i}}}(n,e)}return function(r,s){if((r=Ne(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return F0(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=De.fromDate(r);return{timestampValue:io(s.serializer,i)}}if(r instanceof De){const i=new De(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:io(s.serializer,i)}}if(r instanceof Bl)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Kr)return{bytesValue:Wh(s.serializer,r._byteString)};if(r instanceof at){const i=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(i))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Il(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Fl)return function(a,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return bl(l.serializer,c)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${Ol(r)}`)}(n,e)}function Rf(n,e){const t={};return Eh(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):sr(n,(r,s)=>{const i=No(s,e.Mu(r));i!=null&&(t[r]=i)}),{mapValue:{fields:t}}}function Pf(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof De||n instanceof Bl||n instanceof Kr||n instanceof at||n instanceof Vl||n instanceof Fl)}function ql(n,e,t){if(!Pf(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const r=Ol(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function Wa(n,e,t){if((e=Ne(e))instanceof Mo)return e._internalPath;if(typeof e=="string")return jl(n,e);throw lo("Field path arguments must be of type string or ",n,!1,void 0,t)}const Ww=new RegExp("[~\\*/\\[\\]]");function jl(n,e,t){if(e.search(Ww)>=0)throw lo(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Mo(...e.split("."))._internalPath}catch{throw lo(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function lo(n,e,t,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(i||a)&&(c+=" (found",i&&(c+=` in field ${r}`),a&&(c+=` in document ${s}`),c+=")"),new $(N.INVALID_ARGUMENT,l+n+c)}function Cf(n,e){return n.some(t=>t.isEqual(e))}/**
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
 */class kf{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new at(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Yw(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Mf("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Yw extends kf{data(){return super.data()}}function Mf(n,e){return typeof e=="string"?jl(n,e):e instanceof Mo?e._internalPath:e._delegate._internalPath}/**
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
 */function Gw(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new $(N.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Kw{convertValue(e,t="none"){switch(er(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ie(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Zn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Y()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return sr(e,(s,i)=>{r[s]=this.convertValue(i,t)}),r}convertVectorValue(e){var t,r,s;const i=(s=(r=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map(a=>Ie(a.doubleValue));return new Fl(i)}convertGeoPoint(e){return new Bl(Ie(e.latitude),Ie(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=gl(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Fs(e));default:return null}}convertTimestamp(e){const t=An(e);return new De(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=ge.fromString(e);ae(Xh(r));const s=new zs(r.get(1),r.get(3)),i=new j(r.popFirst(5));return s.isEqual(t)||Xt(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
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
 */function Hl(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}/**
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
 */class As{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Df extends kf{constructor(e,t,r,s,i,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ui(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Mf("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}}class Ui extends Df{data(e={}){return super.data(e)}}class Qw{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new As(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new Ui(this._firestore,this._userDataWriter,r.key,r,new As(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new $(N.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(l=>{const c=new Ui(s._firestore,s._userDataWriter,l.doc.key,l.doc,new As(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const c=new Ui(s._firestore,s._userDataWriter,l.doc.key,l.doc,new As(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,f=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),f=a.indexOf(l.doc.key)),{type:Jw(l.type),doc:c,oldIndex:d,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function Jw(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Y()}}/**
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
 */function Xw(n){n=Dt(n,at);const e=Dt(n.firestore,or);return Nw(ko(e),n._key).then(t=>rb(e,n,t))}class Nf extends Kw{constructor(e){super(),this.firestore=e}convertBytes(e){return new Kr(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new at(this.firestore,null,t)}}function Zw(n){n=Dt(n,Co);const e=Dt(n.firestore,or),t=ko(e),r=new Nf(e);return Gw(n._query),Lw(t,n._query).then(s=>new Qw(e,r,n,s))}function eb(n,e,t){n=Dt(n,at);const r=Dt(n.firestore,or),s=Hl(n.converter,e,t);return Lo(r,[Ul($l(r),"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,rt.none())])}function tb(n){return Lo(Dt(n.firestore,or),[new Io(n._key,rt.none())])}function nb(n,e){const t=Dt(n.firestore,or),r=js(n),s=Hl(n.converter,e);return Lo(t,[Ul($l(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,rt.exists(!1))]).then(()=>r)}function Lo(n,e){return function(r,s){const i=new Kt;return r.asyncQueue.enqueueAndForget(async()=>Tw(await Dw(r),s,i)),i.promise}(ko(n),e)}function rb(n,e,t){const r=t.docs.get(e._key),s=new Nf(n);return new Df(n,s,e._key,r,new As(t.hasPendingWrites,t.fromCache),e.converter)}/**
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
 */class sb{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=$l(e)}set(e,t,r){this._verifyNotCommitted();const s=ma(e,this._firestore),i=Hl(s.converter,t,r),a=Ul(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,rt.none())),this}update(e,t,r,...s){this._verifyNotCommitted();const i=ma(e,this._firestore);let a;return a=typeof(t=Ne(t))=="string"||t instanceof Mo?Hw(this._dataReader,"WriteBatch.update",i._key,t,r,s):jw(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(a.toMutation(i._key,rt.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=ma(e,this._firestore);return this._mutations=this._mutations.concat(new Io(t._key,rt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new $(N.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function ma(n,e){if((n=Ne(n)).firestore!==e)throw new $(N.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
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
 */function Lf(n){return ko(n=Dt(n,or)),new sb(n,e=>Lo(n,e))}(function(e,t=!0){(function(s){Zr=s})(Jr),$r(new Kn("firestore",(r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),l=new or(new t0(r.getProvider("auth-internal")),new i0(r.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new $(N.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new zs(d.options.projectId,f)}(a,s),a);return i=Object.assign({useFetchStreams:t},i),l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),bn(Su,"4.7.3",e),bn(Su,"4.7.3","esm2017")})();const Of={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85",measurementId:"G-80XX542QZE"};function Le(){return Of.apiKey!=="YOUR_API_KEY"}let ga=null,lt=null,mt=null;try{Le()?(ga=kd(Of),lt=Jv(ga),mt=Fw(ga)):console.warn("Firebase not configured. Login required to save data.")}catch(n){console.error("Firebase initialization error:",n)}const ib=new jt;let gn=null,Ds=[];function ob(){if(!Le()||!lt){console.warn("Firebase not configured - auth disabled");return}Fy(lt,n=>{console.log("onAuthStateChanged fired:",n?n.email:"null"),gn=n,console.log("Notifying",Ds.length,"listeners"),Ds.forEach(e=>e(n))})}function ab(n){return console.log("onAuthStateChange: adding listener, currentUser is:",gn&&gn.email),Ds.push(n),gn&&(console.log("onAuthStateChange: immediately calling listener with user"),n(gn)),()=>{Ds=Ds.filter(e=>e!==n)}}function ns(){return gn}function ct(){return gn!==null}async function lb(n,e,t=null){if(!Le()||!lt)throw new Error("Firebase not configured");const r=await Dy(lt,n,e);return t&&r.user&&await Oy(r.user,{displayName:t}),r}async function cb(n,e){if(!Le()||!lt)throw new Error("Firebase not configured");return Ny(lt,n,e)}async function ub(){if(!Le()||!lt)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const n=await ov(lt,ib);return console.log("Google sign-in successful:",n.user.email),n}catch(n){throw console.error("signInWithPopup error:",n.code,n.message),n}}async function Vf(){if(!Le()||!lt)throw new Error("Firebase not configured");return zy(lt)}async function db(n){if(!Le()||!lt)throw new Error("Firebase not configured");return My(lt,n)}ob();function Wl(n,e="settings"){const t=ns();return!t||!mt?null:js(mt,"users",t.uid,n,e)}function Bf(n){const e=ns();return!e||!mt?null:Bw(mt,"users",e.uid,n)}async function Oo(){if(!Le())return[];const n=Bf("scenarios");if(!n)return[];try{const e=await Zw(n),t=[];return e.forEach(r=>{t.push({id:r.id,...r.data()})}),t}catch(e){return console.error("Error loading scenarios:",e),[]}}async function hb(n){if(!Le())return null;const e=Wl("scenarios",n);if(!e)return null;try{const t=await Xw(e);return t.exists()?{id:t.id,...t.data()}:null}catch(t){return console.error("Error loading scenario:",t),null}}async function ar(n,e){if(!Le())return;const t=Wl("scenarios",n);if(t)try{await eb(t,{...e,lastModified:new Date().toISOString()},{merge:!0})}catch(r){throw console.error("Error saving scenario:",r),r}}async function Ff(n){if(!Le())return null;const e=Bf("scenarios");if(!e)return null;try{return(await nb(e,{...n,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(t){throw console.error("Error creating scenario:",t),t}}async function fb(n){if(!Le())return;const e=Wl("scenarios",n);if(e)try{await tb(e)}catch(t){throw console.error("Error deleting scenario:",t),t}}async function Yl(n){if(!Le())return;const e=ns();if(!(!e||!mt))try{const t=await Oo(),r=Lf(mt);for(const s of t){const i=js(mt,"users",e.uid,"scenarios",s.id);s.id===n?r.update(i,{isActive:!0}):s.isActive&&r.update(i,{isActive:!1})}await r.commit()}catch(t){throw console.error("Error setting active scenario:",t),t}}async function pb(){if(!Le())return;const n=ns();if(!(!n||!mt))try{const e=await Oo(),t=Lf(mt);for(const r of e)t.delete(js(mt,"users",n.uid,"scenarios",r.id));t.delete(js(mt,"users",n.uid,"profile","settings")),await t.commit(),console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function mb(){return Le()?(await Oo()).length>0:!1}let Br=null,Pe=null;function kn(){return Le()&&ct()}function sn(){Br=null,Pe=null}function zf(){return{equityMin:le.EQUITY_MIN,bondMin:le.BOND_MIN,cashTarget:le.CASH_TARGET,duration:le.DURATION_YEARS,baseSalary:le.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Je.PERSONAL_ALLOWANCE,brl:Je.BASIC_RATE_LIMIT,hrl:Je.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Mr.PROTECTION_MULTIPLIER,consecutiveLimit:le.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Mr.HODL_ENABLED,hodlValue:Mr.HODL_VALUE}}function $f(){return{equityMin:le.EQUITY_MIN,bondMin:le.BOND_MIN,cashTarget:le.CASH_TARGET,duration:le.DURATION_YEARS,baseSalary:le.BASE_SALARY,protectionFactor:le.PROTECTION_FACTOR,recoveryBuffer:le.RECOVERY_BUFFER,consecutiveLimit:le.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0}}function Uf(){return{}}function gb(n="My Plan",e="",t=["stress","decision"]){return{planDetails:{name:n,description:e},enabledTools:t,isActive:!0,decisionTool:{settings:$f(),history:[],taxYears:Uf()},stressTool:{settings:zf()}}}async function Gl(){if(Br)return Br;if(!kn())return[];try{const n=await Oo();return Br=n,n}catch(n){return console.error("Error listing scenarios:",n),[]}}async function Tt(){if(Pe)return Pe;if(!kn())return null;try{const e=(await Gl()).find(t=>t.isActive);return e?(Pe=e,e):null}catch(n){return console.error("Error getting active scenario:",n),null}}async function yb(n,e,t,r={},s=!0){if(!kn())throw new Error("Must be logged in to create scenarios");const i=gb(n,e,t);if(r.stressSettings&&(i.stressTool.settings={...i.stressTool.settings,...r.stressSettings}),r.decisionSettings&&(i.decisionTool.settings={...i.decisionTool.settings,...r.decisionSettings}),r.taxYears&&(i.decisionTool.taxYears=r.taxYears),i.isActive=s,s&&Br){const l=Br.find(c=>c.isActive);l&&(await Yl(null),await ar(l.id,{isActive:!1}))}const a=await Ff(i);return sn(),a}async function vb(n){if(!kn())throw new Error("Must be logged in to switch scenarios");await Yl(n),sn()}async function _b(n,e){if(!kn())throw new Error("Must be logged in to duplicate scenarios");const t=await hb(n);if(!t)throw new Error("Source scenario not found");const{id:r,createdAt:s,lastModified:i,...a}=t;a.planDetails={...a.planDetails,name:e},a.isActive=!1;const l=await Ff(a);return sn(),l}async function wb(n,e){if(!kn())throw new Error("Must be logged in to rename scenarios");await ar(n,{"planDetails.name":e}),sn()}async function bb(n,e){if(!kn())throw new Error("Must be logged in to update scenarios");await ar(n,{enabledTools:e}),sn()}async function Eb(n){if(!kn())throw new Error("Must be logged in to delete scenarios");const e=await Gl();if(e.length<=1)throw new Error("Cannot delete the last scenario");const t=e.find(r=>r.id===n);if(t!=null&&t.isActive){const r=e.find(s=>s.id!==n);r&&await Yl(r.id)}await fb(n),sn()}async function Tb(){var e;const n=await Tt();return((e=n==null?void 0:n.stressTool)==null?void 0:e.settings)||zf()}async function qf(n){const e=await Tt();if(!e)throw new Error("No active scenario");await ar(e.id,{"stressTool.settings":n}),Pe&&(Pe.stressTool||(Pe.stressTool={}),Pe.stressTool.settings=n)}async function Ib(){var e;const n=await Tt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.settings)||$f()}async function Sb(n){const e=await Tt();if(!e)throw new Error("No active scenario");await ar(e.id,{"decisionTool.settings":n}),Pe&&(Pe.decisionTool||(Pe.decisionTool={}),Pe.decisionTool.settings=n)}async function xb(){var e;const n=await Tt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.taxYears)||Uf()}async function Ab(n){const e=await Tt();if(!e)throw new Error("No active scenario");await ar(e.id,{"decisionTool.taxYears":n}),Pe&&(Pe.decisionTool||(Pe.decisionTool={}),Pe.decisionTool.taxYears=n)}async function Rb(){var e;const n=await Tt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.history)||[]}async function jf(n){const e=await Tt();if(!e)throw new Error("No active scenario");await ar(e.id,{"decisionTool.history":n}),Pe&&(Pe.decisionTool||(Pe.decisionTool={}),Pe.decisionTool.history=n)}async function Hf(){const n=await Tt();return(n==null?void 0:n.enabledTools)||["stress","decision"]}let Tn=null;function qi(){return{settings:{equityMin:le.EQUITY_MIN,bondMin:le.BOND_MIN,cashTarget:le.CASH_TARGET,duration:le.DURATION_YEARS,baseSalary:le.BASE_SALARY,protectionFactor:le.PROTECTION_FACTOR,recoveryBuffer:le.RECOVERY_BUFFER,consecutiveLimit:le.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function Vo(){return Le()&&ct()}function tr(){Tn=null}function Wf(){return Tn||qi()}async function Bt(){if(Tn)return Tn;if(!Vo())return console.warn("Firebase not available - returning defaults"),qi();try{const[n,e,t]=await Promise.all([Ib(),xb(),Rb()]),r={settings:n||qi().settings,taxYears:e||{},history:t||[],lastModified:new Date().toISOString(),checksum:null};return r.checksum=Yf(r),Tn=r,r}catch(n){console.error("Error loading decision data:",n)}return qi()}async function Bo(n){if(!Vo())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=Yf(n),await Promise.all([Sb(n.settings),Ab(n.taxYears)]),Tn=n}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function Yf(n){const e={settings:n.settings,taxYears:n.taxYears,historyCount:n.history.length,lastHistoryDate:n.history.length>0?n.history[n.history.length-1].date:null};return Ed(e)}async function lr(){return(await Bt()).settings}async function Kl(n){const e=await Bt();e.settings={...e.settings,...n},await Bo(e)}function Ql(){return{pa:Je.PERSONAL_ALLOWANCE,brl:Je.BASIC_RATE_LIMIT,hrl:Je.HIGHER_RATE_LIMIT,cpi:.04,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function Pb(n){const t=Wf().taxYears[n];return t||Ql()}async function Fo(n){const t=(await Bt()).taxYears[n];return t||Ql()}async function cr(n,e){console.log(`saveTaxYearConfig: Saving tax year ${n}`,e);const t=await Bt();t.taxYears[n]={...Pb(n),...e},await Bo(t),console.log(`saveTaxYearConfig: Saved tax year ${n}, yearSetupComplete=${t.taxYears[n].yearSetupComplete}`)}async function Cb(n){const e=Tn||await Bt(),t=(e.history||[]).filter(s=>s.taxYear===n),r=t.reduce((s,i)=>s+(i.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${n}, found ${t.length} records, total ISA used: ${r}`),console.log("recalculateIsaSavingsUsed: History records:",t.map(s=>({date:s.date,isa:s.isa}))),e.taxYears[n]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${n}, creating default`),e.taxYears[n]=Ql()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),e.taxYears[n].isaSavingsUsed=r,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),await Bo(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),r}async function kb(n){const e=await Fo(n),t=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${n}, yearSetupComplete=${e.yearSetupComplete}, result=${t}`),t}async function Mn(){return(await Bt()).taxYears}function Mb(n={}){let t=[...Wf().history];return n.taxYear&&(t=t.filter(r=>r.taxYear===n.taxYear)),n.startDate&&(t=t.filter(r=>r.date>=n.startDate)),n.endDate&&(t=t.filter(r=>r.date<=n.endDate)),n.sortDesc?t.sort((r,s)=>s.date.localeCompare(r.date)):t.sort((r,s)=>r.date.localeCompare(s.date)),n.limit&&(t=t.slice(0,n.limit)),t}async function rs(n={}){return await Bt(),Mb(n)}async function Db(n){if(!Vo())throw new Error("Must be logged in to save history");const e=await Bt(),t=e.history.findIndex(r=>r.date===n.date);t>=0?e.history[t]=n:e.history.push(n),e.history.sort((r,s)=>r.date.localeCompare(s.date)),await jf(e.history)}async function Gf(n){if(!Vo())throw new Error("Must be logged in to delete history");const e=await Bt();e.history=e.history.filter(t=>t.date!==n),await jf(e.history)}async function Jl(n){const e=await lr(),t=await Mn(),r=e.spStartDate,s=e.spWeeklyAmount||0;if(!r||!s){let f=null;if(r){const{formatStatePensionDate:m}=await Gc(async()=>{const{formatStatePensionDate:v}=await Promise.resolve().then(()=>ad);return{formatStatePensionDate:v}},void 0,import.meta.url);f=m(r)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:f}}const{calculateStatePensionForTaxYear:i,getTimeUntilStatePension:a,parseStatePensionDate:l}=await Gc(async()=>{const{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:v}=await Promise.resolve().then(()=>ad);return{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:v}},void 0,import.meta.url),c=i({taxYear:n,spStartDate:r,weeklyAmount:s,taxYearConfigs:t}),d=a(r);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function Nb(n){const e=Fp(n);e.stdSipp=n.stdSipp||n.sippDraw,await Db(e),n.taxYear&&await Cb(n.taxYear)}function zo(n,e,t=0){const r=Xa(t);let s=n.equityStart,i=n.bondStart,a=n.cashStart,l=n.hodlEnabled?n.hodlStart!==void 0?n.hodlStart:n.hodlValue:0,c=0,d=null,f=0,m=0,v=0,b=0,T=!1,A=!1,R=null,x=0,M=-1;const D=[],C=[];let O=1;D.push({year:0,month:0,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:0,source:"None",inProtection:!1,equityMin:n.equityMin,bondMin:n.bondMin,cashMax:n.cashTarget});for(let V=0;V<n.years*12;V++){const E=Math.floor(V/12),g=V%12,y=g>=3?E:E-1;if(y!==M&&(x=0,M=y),V>0&&V%12===0){const ie=e.inflation[E]||.025;C.push(ie),O*=1+ie}const _=e.equity[E]||0,I=e.inflation[E]||.025,S=E>0?e.inflation[E-1]||.025:I,w=Dr(n.equityMin,E,n.duration,O,!0),oe=Dr(n.bondMin,E,n.duration,O,!0),Ce=Dr(n.cashTarget,E,n.duration,O,!1),Z=Ob(n,E,O,C),Se=Z;let he=T?Z*n.protectionMult:Z;T&&(x+=Se-he);const Oe=Lb(I,_,S,r),ue=Math.max(.005,I+.012);if(s*=1+Math.pow(1+_,1/12)-1,i*=1+Math.pow(1+Oe,1/12)-1,a*=1+Math.pow(1+ue,1/12)-1,l>0){const ut=(r()-.5)*2*.06;let dt=0;_<-.1?dt=Math.min(.15,Math.abs(_)*.4):_<-.05&&(dt=Math.abs(_)*.2);let Be=.069+ut+dt;Be=Math.max(-.08,Math.min(.18,Be)),l*=1+Math.pow(1+Be,1/12)-1}const we=s+i,U=w+oe;T&&we>U+5e3&&(T=!1,b=0,m=Math.max(m,v),v=0),T&&(f++,v++);let be=0;if(!T&&x>0&&we>U+15e3){let ie=g>=3?15-g:3-g;ie<1&&(ie=1);const Ve=we-U-15e3,ut=Math.min(x/ie,Ve/ie),dt=Se*.5;be=Math.min(ut,dt),be>50&&(he+=be,x-=be)}let X="Growth";if(!T&&we>=U+he){const ie=Math.max(0,s-w),Ve=Math.max(0,i-oe),ut=ie+Ve;if(ut>0){if(s-=he*ie/ut,i-=he*Ve/ut,b=0,X="Growth",a<Ce){const dt=we-U-he;if(dt>5e3){const Be=Math.min((Ce-a)*.3,dt*.5);s-=Be*ie/ut,i-=Be*Ve/ut,a+=Be}}}else a-=he,X="Cash"}else if(a>=he)a-=he,b++,X="Cash",!n.disableProtection&&b>=n.consecutiveLimit&&(T=!0);else{const ie=he-a;a=0,i>ie?(i-=ie,X="Bond"):s>ie?(s-=ie,X="Equity"):l>ie?(l-=ie,c+=ie,d===null&&(d=V),X="HODL"):(A=!0,R=V)}if(s=Math.max(0,s),i=Math.max(0,i),a=Math.max(0,a),(g===0||V===n.years*12-1||A)&&D.push({year:E+g/12,month:V,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:he,boostAmount:be,source:X,inProtection:T,equityMin:w,bondMin:oe,cashMax:Ce}),A)break}return m=Math.max(m,v),{failed:A,years:A?R/12:n.years,failMonth:R,final:s+i+a,finalEquity:s,finalBond:i,finalCash:a,finalHodl:l,protMonths:f,maxConsec:m,hodlUsed:c,hodlUsedMonth:d,hist:D,seed:t}}function Lb(n,e,t,r){let s=.15,i=.3,a=.2,l=.1,c=.1,d=.15;const f=t!==void 0?t:n,m=f>.045,v=f>.07;if(m){const D=r()>.3?1:.5;v?(s=.15+.35*D,i=.3-.2*D,d=.15-.1*D,l=.1+.05*D):(s=.15+.2*D,i=.3-.1*D,d=.15-.05*D)}m&&r()<.15&&(s=.2,i=.25,d=.12);const b=n+.005+_s(0,.03,r),T=.04-(n>.04?(n-.04)*.5:0)+_s(0,.05,r),A=.03+n*.3+_s(0,.08,r),R=n*.8+_s(0,.15,r),x=Math.max(.005,n+.005),M=e*.5+_s(0,.02,r);return s*b+i*T+a*A+l*R+c*x+d*M}function Ob(n,e,t,r){n.taxMode==="frozen"?n.pa:n.pa*t;const s=n.taxMode==="frozen"?n.brl:n.brl*t,i=n.baseSalary*t;let a=n.other;for(const f of r)a*=1+Math.min(f,.04);let l=0;if(n.spStartYear!==void 0){if(e>=n.spStartYear&&n.spWeeklyAmount>0){const f=n.spWeeklyAmount*52;e===n.spStartYear&&n.spFirstYearRatio!==void 0?l=f*n.spFirstYearRatio*t:l=f*t}}else n.statePensionYear!==void 0&&(l=e>=n.statePensionYear?(n.statePension||0)*t:0);const c=a+l;return Math.max(0,Math.min(s,i)-c)/12}function Kf(n,e=1e3){const t=Object.keys(Ls).map(Number).sort((s,i)=>s-i),r=[];for(let s=0;s<e;s++){const i=Xa(s*12345),a={equity:{},inflation:{}};for(let l=0;l<n.years;l++){const c=t[Math.floor(i()*t.length)];a.equity[l]=Ls[c],a.inflation[l]=Qa[c]||.025}r.push(zo(n,a,s))}return r}function Qf(n){const e=Object.keys(Ls).map(Number).sort((s,i)=>s-i),t=Math.max(...e),r=[];for(const s of e){if(s+n.years-1>t)continue;const i={equity:{},inflation:{}};for(let l=0;l<n.years;l++)i.equity[l]=Ls[s+l]||0,i.inflation[l]=Qa[s+l]||.025;const a=zo(n,i,s);a.startYear=s,r.push(a)}return r}function Vb(n,e){const t={equity:{},inflation:{}};for(let r=0;r<n.years;r++)t.equity[r]=e.equity[r%e.equity.length],t.inflation[r]=e.inflation[r%e.inflation.length];return zo(n,t,999)}function Bb(n){const e=n.filter(t=>t.failed).length;return(n.length-e)/n.length*100}function Jf(n){const e=n.filter(l=>!l.failed),t=n.filter(l=>l.failed),r=n.map(l=>l.years).sort((l,c)=>l-c),s=e.map(l=>l.final).sort((l,c)=>l-c),i=n.map(l=>l.protMonths).sort((l,c)=>l-c),a=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:n.length,successCount:e.length,failCount:t.length,successRate:Bb(n),survival:{p5:a(r,.05),p10:a(r,.1),p25:a(r,.25),p50:a(r,.5),p75:a(r,.75),p90:a(r,.9),p95:a(r,.95),min:r[0],max:r[r.length-1]},finalValue:{p5:a(s,.05),p10:a(s,.1),p25:a(s,.25),p50:a(s,.5),p75:a(s,.75),p90:a(s,.9),p95:a(s,.95),min:s[0]||0,max:s[s.length-1]||0,avg:e.reduce((l,c)=>l+c.final,0)/(e.length||1)},minYears:r[0],p10Years:a(r,.1),medianYears:a(r,.5),medianFinal:a(s,.5),p10Final:a(s,.1),p90Final:a(s,.9),avgFinal:e.reduce((l,c)=>l+c.final,0)/(e.length||1),protection:{runsWithProtection:n.filter(l=>l.protMonths>0).length,pctWithProtection:n.filter(l=>l.protMonths>0).length/n.length*100,avgMonths:i.reduce((l,c)=>l+c,0)/n.length,maxMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,p50Months:a(i,.5),p90Months:a(i,.9),p95Months:a(i,.95)},runsWithProtection:n.filter(l=>l.protMonths>0).length,avgProtMonths:i.reduce((l,c)=>l+c,0)/n.length,maxProtMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,hodl:{runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,pctUsingHodl:n.filter(l=>l.hodlUsed>0).length/n.length*100,avgUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...n.map(l=>l.hodlUsed||0))},runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,avgHodlUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...n.map(l=>l.hodlUsed||0)),failures:t.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function li(n){if(!n)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},t=n.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const s=new Date(t);if(!isNaN(s.getTime()))return s}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t)){const[s,i,a]=t.split("/").map(Number);return new Date(a,i-1,s)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(t)){const[s,i,a]=t.split("-").map(Number);return new Date(a,i-1,s)}let r=t.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(r){const s=parseInt(r[1]),i=e[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}if(r=t.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),r){const s=e[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=t.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),r){const s=e[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=t.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),r){const s=parseInt(r[1]),i=e[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}return null}function ji(n){const e=typeof n=="string"?li(n):n;if(!e||isNaN(e.getTime()))return"";const t=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${t[e.getMonth()]} ${e.getFullYear()}`}function Fb(n){const{taxYear:e,spStartDate:t,weeklyAmount:r,taxYearConfigs:s={}}=n;if(!t||!r||r<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const i=typeof t=="string"?li(t):t;if(!i||isNaN(i.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const a=Ja(i);Up(e);const l=qp(e),c=[...new Set([a,e,...Object.keys(s)])].sort(),d=c.indexOf(a),f=c.indexOf(e);if(f<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:ji(i)};let m=1;for(let A=d;A<f;A++){const R=c[A],x=s[R],M=(x==null?void 0:x.cpi)||.025;m*=1+M}const v=r*m;if(e===a){const R=Math.max(0,(l.getTime()-i.getTime())/6048e5),x=v*R;return{annual:x,monthly:x/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(R*10)/10,startDate:ji(i)}}const T=v*52;return{annual:T,monthly:T/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:ji(i)}}function zb(n,e=new Date){const t=typeof n=="string"?li(n):n;if(!t||isNaN(t.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const r=t.getTime()-e.getTime(),s=r<=0;if(s)return{years:0,months:0,totalMonths:0,isPast:!0};const i=Math.floor(r/(30.44*24*60*60*1e3)),a=Math.floor(i/12),l=i%12;return{years:a,months:l,totalMonths:i,isPast:s}}const ad=Object.freeze(Object.defineProperty({__proto__:null,calculateStatePensionForTaxYear:Fb,formatStatePensionDate:ji,getTimeUntilStatePension:zb,parseStatePensionDate:li},Symbol.toStringTag,{value:"Module"}));let vn=null;function Hs(){return{settings:{equityMin:le.EQUITY_MIN,bondMin:le.BOND_MIN,cashTarget:le.CASH_TARGET,duration:le.DURATION_YEARS,baseSalary:le.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Je.PERSONAL_ALLOWANCE,brl:Je.BASIC_RATE_LIMIT,hrl:Je.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Mr.PROTECTION_MULTIPLIER,consecutiveLimit:le.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Mr.HODL_ENABLED,hodlValue:Mr.HODL_VALUE},lastModified:null,checksum:null}}function Xl(){return Le()&&ct()}function Pn(){vn=null}function $b(){return vn||Hs()}async function Xf(){if(vn)return vn;if(!Xl())return console.warn("Firebase not available - returning defaults"),Hs();try{const n=await Tb();if(n){const e={settings:n,lastModified:new Date().toISOString(),checksum:null};return vn=jb(e),vn}}catch(n){console.error("Error loading stress data:",n)}return Hs()}async function Ub(n){if(!Xl())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=qb(n),await qf(n.settings),vn=n}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function qb(n){return Ed(n.settings)}function jb(n){const e={...Hs()};return n.settings&&(e.settings={...e.settings,...n.settings},n.settings.pacwMin!==void 0&&n.settings.equityMin===void 0&&(e.settings.equityMin=n.settings.pacwMin),n.settings.cgtMin!==void 0&&n.settings.bondMin===void 0&&(e.settings.bondMin=n.settings.cgtMin),n.settings.csh2Target!==void 0&&n.settings.cashTarget===void 0&&(e.settings.cashTarget=n.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=n.lastModified,e.checksum=n.checksum,e}function Hb(){return $b().settings}async function Dn(){return(await Xf()).settings}async function Zl(n){const e=await Xf();e.settings={...e.settings,...n},await Ub(e)}async function Wb(){if(!Xl())throw new Error("Must be logged in to reset settings");const n=Hs();await qf(n.settings),Pn()}function Yb(n){if(!n.spStartDate||!n.spWeeklyAmount)return{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const e=li(n.spStartDate);if(!e)return console.warn("Could not parse spStartDate:",n.spStartDate),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const t=new Date,r=365.25*24*60*60*1e3,s=Math.max(0,(e.getTime()-t.getTime())/r),i=Math.floor(s),a=365,l=Math.floor((e-new Date(e.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function ec(n={},e=null){const t=e||Hb(),r=Yb(t);return{equityStart:n.equityStart??t.equityMin,bondStart:n.bondStart??t.bondMin,cashStart:n.cashStart??t.cashTarget,equityMin:t.equityMin,bondMin:t.bondMin,cashTarget:t.cashTarget,years:n.years??t.duration,duration:t.duration,baseSalary:t.baseSalary,other:t.other,spStartYear:r.spStartYear,spWeeklyAmount:r.spWeeklyAmount,spFirstYearRatio:r.spFirstYearRatio,pa:t.pa,brl:t.brl,hrl:t.hrl,taxMode:t.taxMode,protectionMult:t.protectionMult,consecutiveLimit:t.consecutiveLimit,disableProtection:t.disableProtection,hodlEnabled:t.hodlEnabled,hodlValue:t.hodlValue}}function H(n,e=null){const t=Math.abs(n),r=e!==null?e:t<100,s=Math.abs(n).toLocaleString("en-GB",{minimumFractionDigits:r?2:0,maximumFractionDigits:r?2:0});return n<0?`-£${s}`:`£${s}`}function ld(n,e){const t=Gb(n);e.innerHTML=t}function Gb(n){var I,S,w,oe,Ce;const e=n,t=e.calculationDetails||{};let r="";const s=e.isTaxEfficientYear??e.taxEfficient,i=e.protectionInducedTaxEfficiency||!1,a=e.boostAmount>0;let l,c,d;if(e.inProtection?(l="warning",c="Protection Mode",d="⚡"):a?(l="boost",c="Tax Boost (Catch-up)",d="↑"):i?(l="info",c="Protection-Induced Tax Efficiency",d="↑"):s?(l="success",c="Tax-Efficient Year",d="✓"):(l="warning",c="Tax-Inefficient Year",d="!"),r+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,s&&e.yearlyIsaSavingsAllocation>0){const Z=e.cumulativeIsaSavingsUsed||0,Se=e.yearlyIsaSavingsAllocation,ce=Math.max(0,Se-Z),he=Se>0?Z/Se*100:0;r+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(he,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${H(Z)} of ${H(Se)}</span>
        <span>Remaining: ${H(ce)}</span>
      </div>
    </div>`}if(e.alerts&&e.alerts.length>0){r+='<div class="alerts">';for(const Z of e.alerts){const Se=Kb(Z.severity);r+=`<div class="alert ${Se}">${Z.message}</div>`}r+="</div>"}r+='<div class="recommendation-card">',r+="<h3>Monthly Recommendation</h3>",r+='<div class="draw-row primary">',r+='<span class="label">SIPP Withdrawal</span>',r+=`<span class="value">${H(e.sippDraw)}</span>`,r+="</div>",e.isaDraw>0&&(r+='<div class="draw-row">',r+='<span class="label">ISA Top-up</span>',r+=`<span class="value">${H(e.isaDraw)}</span>`,r+="</div>"),e.other>0&&(r+='<div class="draw-row muted">',r+='<span class="label">Other Pension</span>',r+=`<span class="value">${H(e.other)}</span>`,r+="</div>"),e.statePension>0&&(r+='<div class="draw-row muted">',r+='<span class="label">State Pension</span>',r+=`<span class="value">${H(e.statePension)}</span>`,r+="</div>"),r+='<div class="divider"></div>';const f=e.sippDraw+e.other+e.statePension,m=f*12,v=e.pa||12570,b=e.brl||50270;let T=0;m>v&&(m<=b?T=(m-v)*.2:T=(b-v)*.2+(m-b)*.4);const A=f-T/12+e.isaDraw;r+='<div class="draw-row total">',r+='<span class="label">Total Monthly Income</span>',r+=`<span class="value">${H(A)}</span>`,r+="</div>",e.boostAmount>0&&(r+='<div class="boost-indicator">',r+='<span class="boost-label">Includes Tax Boost:</span>',r+=`<span class="boost-value">+${H(e.boostAmount)}</span>`,r+="</div>"),r+="</div>",r+='<div class="source-card">',r+="<h4>Withdraw From</h4>",r+=`<div class="source-label ${e.source.toLowerCase()}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(r+='<div class="source-breakdown">',e.drawFromEquity>0&&(r+=`<div class="source-item">Equity: ${H(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(r+=`<div class="source-item">Bond: ${H(e.drawFromBond)}</div>`),r+="</div>"),r+="</div>",r+='<div class="fund-status">',r+="<h4>Fund Status</h4>";const R=e.equity+e.bond+e.cash,x=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,M=R-x,D=x>0?M/x*100:0;r+='<div class="fund-grid">';const C=e.equity-e.adjEquityMin;r+=ya("Equity",e.equity,e.adjEquityMin,C);const O=e.bond-e.adjBondMin;r+=ya("Bond",e.bond,e.adjBondMin,O);const V=e.cash-e.adjCashTarget;r+=ya("Cash",e.cash,e.adjCashTarget,V),r+="</div>";const E=M>=0?"healthy":"warning";r+=`<div class="overall-status ${E}">`,r+=`<span>Total Surplus: ${H(M)}</span>`,r+=`<span>(${D.toFixed(1)}% above target)</span>`,r+="</div>",r+="</div>",r+='<div class="tax-info">',r+="<h4>Tax Summary</h4>",r+='<div class="tax-thresholds">',r+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${H(e.pa)}</span></div>`,r+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${H(e.brl)}</span></div>`,t.taxInfo&&(r+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${t.taxInfo.headroomToBRL>0?"success":"warning"}">${H(t.taxInfo.headroomToBRL)}</span></div>`),r+="</div>",r+='<div class="tax-comparison">',r+='<div class="tax-comparison-header">',r+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",r+="</div>";const g=((I=t.taxInfo)==null?void 0:I.monthlyTax)||T/12,y=e.taxPaidYTD||g,_=e.taxProjectedAnnual||((S=t.taxInfo)==null?void 0:S.annualTax)||T;if(r+='<div class="tax-comparison-row">',r+='<div class="label">Tax Paid</div>',r+=`<div>${H(g)}</div>`,r+=`<div>${H(y)}</div>`,r+=`<div>${H(_)}</div>`,r+="</div>",s||((w=t.taxInfo)==null?void 0:w.taxSavedAnnual)>0){const Z=e.taxSavedMonthly||((oe=t.taxInfo)==null?void 0:oe.taxSavedMonthly)||0,Se=e.taxSavedYTD||Z,ce=e.taxSavedProjectedAnnual||((Ce=t.taxInfo)==null?void 0:Ce.taxSavedAnnual)||0;ce>0&&(r+='<div class="tax-comparison-row saved">',r+='<div class="label">Tax Saved</div>',r+=`<div class="success">-${H(Z)}</div>`,r+=`<div class="success">-${H(Se)}</div>`,r+=`<div class="success">-${H(ce)}</div>`,r+="</div>")}if(r+="</div>",t.taxInfo&&typeof t.taxInfo.effectiveRate=="number"&&!isNaN(t.taxInfo.effectiveRate)){const Z=t.taxInfo.effectiveRate*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${Z<=20?"success":Z<=40?"warning":"danger"}">${Z.toFixed(1)}%</span>
    </div>`}else if(t.taxInfo&&t.taxInfo.annualTaxable>0&&t.taxInfo.annualTax>=0){const Z=t.taxInfo.annualTax/t.taxInfo.annualTaxable*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${Z<=20?"success":Z<=40?"warning":"danger"}">${Z.toFixed(1)}%</span>
    </div>`}if(r+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){r+='<div class="rebalance-card">',r+="<h4>Rebalancing Suggestions</h4>",r+="<ul>";for(const Z of e.rebalanceActions)r+=`<li>${Z}</li>`;r+="</ul>",r+="</div>"}return r+='<div class="mode-explanation">',r+="<h4>Why This Recommendation?</h4>",r+=`<p>${t.reason||"Standard calculation based on your settings."}</p>`,!t.hasSufficientIsa&&t.isaNeededMonthly>0&&(r+=`<p class="isa-warning">To enable tax-efficient mode, you need ${H(t.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),r+="</div>",r+='<details class="debug-section">',r+="<summary>Calculation Details</summary>",r+="<pre>"+JSON.stringify(t,null,2)+"</pre>",r+="</details>",r}function ya(n,e,t,r){return`<div class="fund-cell ${r>=0?"healthy":"deficit"}">
    <div class="fund-name">${n}</div>
    <div class="fund-current">${H(e)}</div>
    <div class="fund-min">Min: ${H(t)}</div>
    <div class="fund-surplus">${r>=0?"+":""}${H(r)}</div>
  </div>`}function Kb(n){switch(n){case Ri.DANGER:return"alert-danger";case Ri.WARNING:return"alert-warning";case Ri.SUCCESS:return"alert-success";case Ri.INFO:default:return"alert-info"}}function Qb(){return`
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
  `}async function Jb(n){const e=bd(n),t=Ja(e),r=e.getMonth()+1;return await kb(t)?{showWizard:!1,taxYear:t,isApril:r===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:t,isApril:r===4,reason:`Tax year ${t} has not been set up`}}function Xb(n,e){return n*(1+e)}function Zb(n){const{targetAnnualGross:e,brl:t,pa:r=12570,remainingMonths:s,grossIncomeToDate:i=0}=n,a=T=>T<=r?0:T<=t?(T-r)*.2:(t-r)*.2+(T-t)*.4,l=Math.max(0,t-i);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=t)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=a(e),d=e-c,f=a(t),m=t-f,v=Math.max(0,d-m),b=v/12*s;return{isaNeeded:b,isaNeededAnnual:v,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:f,reason:`Need £${Math.round(b).toLocaleString()} ISA/Savings for tax efficiency`}}function eE(n,e,t){return t?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:n>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-n,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function tE(n){const e=bd(n),t=Ja(e),s=e.getMonth()+1===4,i=Hp(e),a=await lr(),l=await Fo(t),c=await Mn(),d=Object.keys(c).sort(),f=d.indexOf(t)-1,m=f>=0?c[d[f]]:null,v=await Jl(t),b=(m==null?void 0:m.cpi)||.025,T=Xb(a.baseSalary,b);return{taxYear:t,selectedMonth:n,isApril:s,remainingMonths:i,baseSalary:a.baseSalary,suggestedSalary:T,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:b,other:(m==null?void 0:m.other)||0},statePension:v,existingConfig:l.yearSetupComplete?l:null}}function Zf(n){const{targetSalary:e,brl:t,pa:r=12570,other:s=0,statePension:i=0,isaSavingsAllocation:a=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=n,f=S=>S<=r?0:S<=t?(S-r)*.2:(t-r)*.2+(S-t)*.4,m=s/12,v=i/12,b=m+v;let T,A;if(!d)T=e/12-b,A=0;else{const S=Math.max(0,t-c),w=Math.max(0,S/l-b);T=Math.min(e/12-b,w),A=a/l}const R=(T+b)*12,M=f(R)/12,D=T+b,C=D>0?M/D:0,O=T*C,V=m*C,E=v*C,g=T-O,y=m-V,_=v-E,I=g+y+_+A;return{sipp:{gross:T,tax:O,net:g},other:{gross:m,tax:V,net:y},statePension:{gross:v,tax:E,net:_},isa:{gross:A,tax:0,net:A},totalGross:T+m+v+A,totalTax:M,totalNet:I,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:T,monthlyIsa:A,monthlyOther:m,monthlyStatePension:v,monthlyTotal:I}}function nE(n){var A,R,x,M,D,C,O,V,E,g,y;const{pa:e,brl:t,hrl:r,cpi:s,other:i,isaSavingsAllocation:a,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:f,confirmedSalary:m,remainingMonths:v,statePension:b,monthlyBreakdown:T}=n;return{pa:e,brl:t,hrl:r,cpi:s,other:i,isaSavingsAllocation:l?a:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:f||4,remainingMonths:v||12,yearSetupComplete:!0,confirmedSalary:m,statePension:b||0,expectedMonthly:T?{sipp:{gross:((A=T.sipp)==null?void 0:A.gross)||0,tax:((R=T.sipp)==null?void 0:R.tax)||0,net:((x=T.sipp)==null?void 0:x.net)||0},other:{gross:((M=T.other)==null?void 0:M.gross)||0,tax:((D=T.other)==null?void 0:D.tax)||0,net:((C=T.other)==null?void 0:C.net)||0},statePension:{gross:((O=T.statePension)==null?void 0:O.gross)||0,tax:((V=T.statePension)==null?void 0:V.tax)||0,net:((E=T.statePension)==null?void 0:E.net)||0},isa:{gross:((g=T.isa)==null?void 0:g.gross)||0,tax:0,net:((y=T.isa)==null?void 0:y.net)||0},totalGross:T.totalGross||0,totalTax:T.totalTax||0,totalNet:T.totalNet||0}:null}}let Gn=null,Ws=null,pt=1,Q=null,F={};async function rE(n,e,t){Gn=n,Ws=t,pt=1,F={},Q=await tE(e),F={pa:Q.defaults.pa,brl:Q.defaults.brl,hrl:Q.defaults.hrl,cpi:Q.defaults.cpi,other:Q.defaults.other,grossIncomeToDate:0,confirmedSalary:Q.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},Ns()}async function sE(n){return await Jb(n)}function Ns(){if(!Gn||!Q)return;const n=Q.isApril?6:7;Gn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${Q.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${Q.isApril?"Setting up for the full tax year":`Starting in ${tc(Q.selectedMonth)} - ${Q.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${aE(n,pt)}
        </div>

        ${iE()}
      </div>
    </div>
  `,lE()}function iE(){if(Q.isApril,Q.isApril)switch(pt){case 1:return cd();case 2:return ud();case 3:return dd();case 4:return hd();case 5:return fd();case 6:return pd();default:return""}else switch(pt){case 1:return cd();case 2:return oE();case 3:return ud();case 4:return dd();case 5:return hd();case 6:return fd();case 7:return pd();default:return""}}function cd(){return`
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
  `}function oE(){const n=tc(Q.selectedMonth),e=hE(Q.selectedMonth);return`
    <div class="wizard-step">
      <div class="wizard-step-title">Income Before Starting Pension</div>
      <div class="wizard-step-desc">
        You're starting your pension drawdown in ${n}. Enter any taxable income you've already received this tax year (April to ${e}).
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
  `}function ud(){const n=F.cpi!==void 0?F.cpi:Q.defaults.cpi,e=(n*100).toFixed(1),t=Q.baseSalary,r=Math.round(t*(1+n));return`
    <div class="wizard-step">
      <div class="wizard-step-title">Inflation and Target Salary</div>
      <div class="wizard-step-desc">
        Enter last year's CPI (used to adjust your target salary for inflation).
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <span class="wizard-unit">CPI</span>
        <input type="number" id="wizCPI" value="${e}" step="0.1" style="max-width: 80px;" onchange="window._updateWizardSalary && window._updateWizardSalary()">
        <span class="wizard-unit">%</span>
      </div>

      <div class="wizard-info-box" id="salaryInfoBox">
        <p>Based on <span id="cpiDisplay">${e}</span>% inflation, your target salary should be:</p>
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
  `}function dd(){const n=Q.statePension,e=n.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(n.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${n.yearsUntil} years until state pension</span>`;return`
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
        <strong>State Pension:</strong> ${e}
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
          (Based on your settings - edit in Settings if needed)
        </p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function hd(){ci();const n=Zb({targetAnnualGross:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:Q.statePension.amount,remainingMonths:Q.remainingMonths,grossIncomeToDate:F.grossIncomeToDate});return F._isaCalc=n,n.brlExhausted?`
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
  `}function fd(){ci();const n=F._isaCalc,e=eE(F.isaSavingsAllocation,(n==null?void 0:n.isaNeeded)||0,(n==null?void 0:n.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return F.isTaxEfficient=!0,F.taxEfficiencyChoice="efficient",setTimeout(()=>{pt++,Ns()},0),`
      <div class="wizard-step">
        <div class="wizard-step-title">Setting Up Tax Efficiency...</div>
        <div class="wizard-info-box">
          <p>Your ISA allocation is sufficient for tax efficiency.</p>
        </div>
      </div>
    `;const t=e.shortfall>0?`You entered £${F.isaSavingsAllocation.toLocaleString()} but need £${Math.round(n.isaNeeded).toLocaleString()}.`:"";return`
    <div class="wizard-step">
      <div class="wizard-step-title">Tax Efficiency Choice</div>

      ${e.isBrlExhausted?`
        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2);">
          <p style="color: var(--danger);">Your prior income has exhausted the BRL. You cannot be tax-efficient this year.</p>
        </div>
      `:`
        <div class="wizard-info-box" style="background: rgba(243, 156, 18, 0.2);">
          <p style="color: var(--warning);">${t}</p>
        </div>
      `}

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Choose how to proceed:
      </div>

      <div class="wizard-options">
        ${e.isBrlExhausted?"":`
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
  `}function pd(){ci();const n=Zf({targetSalary:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:Q.statePension.amount,isaSavingsAllocation:F.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:F.grossIncomeToDate,isTaxEfficient:F.isTaxEfficient}),e=F.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",t=F.isTaxEfficient?"success":"warning",r=s=>`£${Math.round(s).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${Q.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${tc(Q.selectedMonth)}</span>
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
          <span class="${t}">${e}</span>
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
  `}function aE(n,e){let t="";for(let r=1;r<=n;r++){const s=r<e?"done":r===e?"active":"";t+=`<div class="wizard-dot ${s}"></div>`}return t}function lE(){Gn.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>cE(e.dataset.action))}),window._updateWizardSalary=function(){const e=document.getElementById("wizCPI"),t=document.getElementById("wizSalary"),r=document.getElementById("cpiDisplay"),s=document.getElementById("suggestedSalaryDisplay");if(e&&t&&r&&s){const i=parseFloat(e.value)||0,a=i/100,l=Q.baseSalary,c=Math.round(l*(1+a));r.textContent=i.toFixed(1),s.textContent=c.toLocaleString(),t.value=c,F.cpi=a,F.confirmedSalary=c}}}function cE(n){ci();const e=Q.isApril?6:7;switch(n){case"cancel":ep(),Ws&&Ws({completed:!1,cancelled:!0});break;case"next":pt<e&&(pt++,Ns());break;case"back":pt>1&&(pt--,Ns());break;case"apply-choice":uE(),pt++,Ns();break;case"finish":dE();break}}function uE(){var e;const n=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch(F.taxEfficiencyChoice=n,n){case"increase":F.isaSavingsAllocation=F._isaCalc.isaNeeded,F.isTaxEfficient=!0;break;case"reduced":F.confirmedSalary=F.brl,F.isaSavingsAllocation=0,F.isTaxEfficient=!0;break;case"inefficient":F.isaSavingsAllocation=0,F.isTaxEfficient=!1;break}}function ci(){const n=document.getElementById("wizPA");n&&(F.pa=parseFloat(n.value)||12570);const e=document.getElementById("wizBRL");e&&(F.brl=parseFloat(e.value)||50270);const t=document.getElementById("wizHRL");t&&(F.hrl=parseFloat(t.value)||125140);const r=document.getElementById("wizCPI");r&&(F.cpi=(parseFloat(r.value)||4)/100);const s=document.getElementById("wizSalary");s&&(F.confirmedSalary=parseFloat(s.value)||3e4);const i=document.getElementById("wizOther");i&&(F.other=parseFloat(i.value)||0);const a=document.getElementById("wizISA");a&&(F.isaSavingsAllocation=parseFloat(a.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(F.grossIncomeToDate=parseFloat(l.value)||0)}async function dE(){ci();const n=Zf({targetSalary:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:Q.statePension.amount,isaSavingsAllocation:F.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:F.grossIncomeToDate,isTaxEfficient:F.isTaxEfficient}),e=nE({pa:F.pa,brl:F.brl,hrl:F.hrl,cpi:F.cpi,other:F.other,isaSavingsAllocation:F.isaSavingsAllocation,isTaxEfficient:F.isTaxEfficient,taxEfficiencyChoice:F.taxEfficiencyChoice,grossIncomeToDate:F.grossIncomeToDate,startMonth:parseInt(Q.selectedMonth.split("-")[1]),confirmedSalary:F.confirmedSalary,remainingMonths:Q.remainingMonths,statePension:Q.statePension.amount,monthlyBreakdown:n});console.log(`Tax Year Wizard: Saving config for ${Q.taxYear}`,e);try{await cr(Q.taxYear,e),console.log(`Tax Year Wizard: Successfully saved config for ${Q.taxYear}`)}catch(t){console.error(`Tax Year Wizard: Failed to save config for ${Q.taxYear}`,t),typeof window.showToast=="function"&&window.showToast(`Error saving tax year configuration: ${t.message}`,"error");return}ep(),Ws&&Ws({completed:!0,taxYear:Q.taxYear,config:e,wizardInputs:F})}function ep(){Gn&&(Gn.innerHTML="",Gn.style.display="none")}function tc(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function hE(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-2,1).toLocaleString("default",{month:"long"})}function fE(){return`
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
  `}function pE(n={},e=null){const t=ec(n,e),r=Kf(t),s=Jf(r);return{results:r,stats:s,config:t}}function mE(n={},e=null){const t=ec(n,e),r=Qf(t),s=Jf(r);return{results:r,stats:s,config:t}}function gE(n={}){const e=ec(n),t={};for(const[r,s]of Object.entries(zp))t[r]={...s,result:Vb(e,s)};return t}let Ys=null;function yE(n,e){Ys=n,vE(e)}function vE({onGetStarted:n,onSignIn:e}){Ys&&(Ys.innerHTML=`
    <div class="landing-page">
      <div class="landing-content">

        <!-- Hero -->
        <div class="landing-hero">
          <h1>Pension Planner</h1>
          <p class="landing-tagline">Plan your retirement with confidence</p>
          <p class="landing-subtitle">Free tools to help you stress-test your pension, decide where to withdraw from each month, and make smarter drawdown decisions.</p>
        </div>

        <!-- Tools overview -->
        <div class="landing-tools">
          <div class="landing-tool-card">
            <div class="landing-tool-icon">&#x1F4CA;</div>
            <h3>Stress Tester</h3>
            <p class="landing-tool-question">"Can I afford to retire?"</p>
            <p>Run 1,000 simulations using real historical market data. See how your pension holds up under crashes, inflation, and different spending levels.</p>
          </div>

          <div class="landing-tool-card">
            <div class="landing-tool-icon">&#x1F4B7;</div>
            <h3>Monthly Decisions</h3>
            <p class="landing-tool-question">"Where should I take money from?"</p>
            <p>Each month, get a clear recommendation on which fund to draw from — equity, bonds, or cash — to maximise tax efficiency and protect your portfolio.</p>
          </div>
        </div>

        <!-- Why use this -->
        <div class="landing-section">
          <h2>What you'll need</h2>
          <p>Just a few basic numbers about your pension — fund values, how much income you want, and how long you need it to last. No sensitive data like account numbers or passwords.</p>
        </div>

        <div class="landing-section">
          <h2>Your data stays private</h2>
          <p>Your settings are stored securely in the cloud (Google Firebase) and only you can access them. Nothing is shared, sold, or visible to anyone else. Sign in from any device to pick up where you left off.</p>
        </div>

        <div class="landing-section">
          <h2>Completely free</h2>
          <p>All tools are free to use. No ads, no premium tier, no catch. This is a personal project built to help people make better pension decisions.</p>
        </div>

        <!-- CTA -->
        <div class="landing-cta">
          <button class="landing-btn primary" id="landingGetStarted">Get Started — Create Free Account</button>
          <button class="landing-btn secondary" id="landingSignIn">Already have an account? Sign In</button>
        </div>

      </div>
    </div>
  `,document.getElementById("landingGetStarted").addEventListener("click",n),document.getElementById("landingSignIn").addEventListener("click",e))}function Gs(){Ys&&(Ys.style.display="none")}function _E(){return`
    .landing-page {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg);
      z-index: 999;
      overflow-y: auto;
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }

    .landing-content {
      max-width: 680px;
      width: 100%;
    }

    .landing-hero {
      text-align: center;
      margin-bottom: 48px;
    }

    .landing-hero h1 {
      font-size: 36px;
      color: var(--primary);
      margin-bottom: 12px;
    }

    .landing-tagline {
      font-size: 20px;
      color: var(--text);
      margin-bottom: 12px;
      font-weight: 500;
    }

    .landing-subtitle {
      font-size: 15px;
      color: var(--text-muted);
      line-height: 1.6;
      max-width: 520px;
      margin: 0 auto;
    }

    .landing-tools {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 40px;
    }

    .landing-tool-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
    }

    .landing-tool-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }

    .landing-tool-card h3 {
      font-size: 16px;
      color: var(--primary);
      margin-bottom: 6px;
    }

    .landing-tool-question {
      font-style: italic;
      color: var(--text);
      font-size: 14px;
      margin-bottom: 10px;
    }

    .landing-tool-card p:last-child {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .landing-section {
      margin-bottom: 28px;
      padding: 0 4px;
    }

    .landing-section h2 {
      font-size: 16px;
      color: var(--text);
      margin-bottom: 8px;
      font-weight: 500;
    }

    .landing-section p {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .landing-cta {
      text-align: center;
      margin-top: 40px;
      margin-bottom: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .landing-btn {
      padding: 16px 32px;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
      max-width: 380px;
    }

    .landing-btn.primary {
      background: linear-gradient(135deg, var(--primary) 0%, #5a9aba 100%);
      color: var(--bg);
    }

    .landing-btn.primary:hover {
      opacity: 0.9;
    }

    .landing-btn.secondary {
      background: transparent;
      color: var(--text-muted);
      border: 1px solid var(--border);
    }

    .landing-btn.secondary:hover {
      color: var(--text);
      border-color: var(--text-muted);
    }

    @media (max-width: 600px) {
      .landing-page {
        padding: 24px 16px;
      }

      .landing-hero h1 {
        font-size: 28px;
      }

      .landing-tagline {
        font-size: 17px;
      }

      .landing-tools {
        grid-template-columns: 1fr;
      }
    }
  `}let st=null,va=null,Cr=!1;function wE(n,e){console.log("initAuthScreen: initializing"),st=n,va=e,Cr=!1,ab(t=>{console.log("AuthScreen: auth state change received:",t?t.email:"null","processed:",Cr),t&&va&&!Cr?(console.log("AuthScreen: calling onAuthSuccessCallback"),Cr=!0,xE(),va(t)):t?console.log("AuthScreen: skipping callback, already processed or no callback"):(Cr=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),tp(),console.log("initAuthScreen: complete")}function tp(){if(st){if(!Le()){st.innerHTML=`
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
    `;return}st.innerHTML=`
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
  `,bE()}}function bE(){const n=st.querySelectorAll(".auth-screen-tab");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const a=document.getElementById("signinForm"),l=document.getElementById("signupForm");i.dataset.tab==="signin"?(a.style.display="block",l.style.display="none"):(a.style.display="none",l.style.display="block"),ui()})}),document.getElementById("signinForm").addEventListener("submit",EE),document.getElementById("signupForm").addEventListener("submit",TE),document.getElementById("forgotPasswordBtn").addEventListener("click",IE),document.getElementById("googleSigninBtn").addEventListener("click",SE)}function In(n){const e=document.getElementById("authScreenError");e&&(e.textContent=n,e.style.display="block")}function ui(){const n=document.getElementById("authScreenError");n&&(n.style.display="none")}async function EE(n){n.preventDefault(),ui();const e=document.getElementById("signinEmail").value.trim(),t=document.getElementById("signinPassword").value;if(!e||!t){In("Please enter email and password");return}try{await cb(e,t)}catch(r){console.error("Sign in error:",r),In($o(r.code))}}async function TE(n){n.preventDefault(),ui();const e=document.getElementById("signupName").value.trim(),t=document.getElementById("signupEmail").value.trim(),r=document.getElementById("signupPassword").value;if(!e||!t||!r){In("Please fill in all fields");return}if(r.length<6){In("Password must be at least 6 characters");return}try{await lb(t,r,e)}catch(s){console.error("Sign up error:",s),In($o(s.code))}}async function IE(){ui();const n=document.getElementById("signinEmail").value.trim();if(!n){In("Please enter your email address first");return}try{await db(n),typeof window.showToast=="function"&&window.showToast("Password reset email sent. Check your inbox.","success",5e3)}catch(e){console.error("Reset password error:",e),In($o(e.code))}}async function SE(){ui();try{await ub()}catch(n){console.error("Google sign in error:",n),In($o(n.code))}}function $o(n){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[n]||"An error occurred. Please try again."}function xE(){st&&(st.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function np(){console.log("hideAuthScreen: hiding auth screen, element=",!!st),st&&(st.style.display="none",console.log("hideAuthScreen: set display to none"))}function AE(){Cr=!1,st&&(st.style.display="block",tp())}function co(n="signin"){AE(),st.querySelectorAll(".auth-screen-tab").forEach(i=>i.classList.remove("active"));const t=st.querySelector(`.auth-screen-tab[data-tab="${n}"]`);t&&t.classList.add("active");const r=document.getElementById("signinForm"),s=document.getElementById("signupForm");r&&s&&(r.style.display=n==="signin"?"block":"none",s.style.display=n==="signup"?"block":"none")}function RE(){return`
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
  `}let Ks=null;function PE(n,e,t){Ks=n,CE(e,t)}function CE(n,e){if(!Ks)return;const t=n||"there";Ks.innerHTML=`
    <div class="onboarding-page">
      <div class="onboarding-content">

        <div class="onboarding-welcome">
          <h1>Welcome, ${t}!</h1>
          <p>Your account is set up and ready to go. Here's what Pension Planner can do for you.</p>
        </div>

        <!-- Tool: Stress Tester -->
        <div class="onboarding-tool-section">
          <div class="onboarding-tool-header">
            <span class="onboarding-tool-badge">Tool 1</span>
            <h2>Stress Tester</h2>
          </div>
          <p class="onboarding-tool-question">"Can I afford to retire?"</p>
          <p>The Stress Tester runs 1,000 Monte Carlo simulations using real historical stock market and bond data going back decades. It shows you:</p>
          <ul>
            <li>The range of possible outcomes for your pension pot</li>
            <li>How likely your money is to last through retirement</li>
            <li>What happens if markets crash early in your retirement</li>
            <li>Whether your target income is sustainable</li>
          </ul>
          <p class="onboarding-tool-who"><strong>Best for:</strong> Anyone thinking about retirement, whether you're 10 years away or already drawing your pension. Start here.</p>
          <p class="onboarding-tool-need"><strong>What you'll need:</strong> Your pension fund values (equity, bonds, cash), desired yearly income, and expected retirement duration.</p>
        </div>

        <!-- Tool: Decision Tool -->
        <div class="onboarding-tool-section">
          <div class="onboarding-tool-header">
            <span class="onboarding-tool-badge">Tool 2</span>
            <h2>Monthly Decision Tool</h2>
          </div>
          <p class="onboarding-tool-question">"Where should I take money from this month?"</p>
          <p>Once you're drawing your pension, this tool helps you make the optimal withdrawal each month. It considers:</p>
          <ul>
            <li>Current fund values vs target minimums</li>
            <li>Tax efficiency (personal allowance, basic/higher rate thresholds)</li>
            <li>Whether to enter "protection mode" during market downturns</li>
            <li>ISA top-up recommendations</li>
          </ul>
          <p class="onboarding-tool-who"><strong>Best for:</strong> People already in pension drawdown, or about to start. You can always add this tool later if you're not ready yet.</p>
          <p class="onboarding-tool-need"><strong>What you'll need:</strong> Current fund values, tax year details, and your desired income level.</p>
        </div>

        <!-- Future: Accumulation -->
        <div class="onboarding-tool-section future">
          <div class="onboarding-tool-header">
            <span class="onboarding-tool-badge future">Coming Soon</span>
            <h2>Accumulation Planner</h2>
          </div>
          <p class="onboarding-tool-question">"Am I saving enough for retirement?"</p>
          <p>A future tool for people still building their pension. Project how your contributions and investment growth could add up over time.</p>
        </div>

        <!-- Reassurance -->
        <div class="onboarding-reassurance">
          <p><strong>You don't have to use everything.</strong> When you set up a plan, you choose which tools you want. You can always add more later as your needs change.</p>
        </div>

        <!-- CTA -->
        <div class="onboarding-cta">
          <button class="onboarding-btn primary" id="onboardingStartWizard">Set Up Your First Plan</button>
        </div>

      </div>
    </div>
  `,document.getElementById("onboardingStartWizard").addEventListener("click",e)}function Uo(){Ks&&(Ks.style.display="none")}function kE(){return`
    .onboarding-page {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg);
      z-index: 999;
      overflow-y: auto;
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }

    .onboarding-content {
      max-width: 680px;
      width: 100%;
    }

    .onboarding-welcome {
      text-align: center;
      margin-bottom: 40px;
    }

    .onboarding-welcome h1 {
      font-size: 28px;
      color: var(--primary);
      margin-bottom: 10px;
    }

    .onboarding-welcome p {
      font-size: 15px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .onboarding-tool-section {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .onboarding-tool-section.future {
      opacity: 0.6;
    }

    .onboarding-tool-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .onboarding-tool-badge {
      background: var(--primary);
      color: var(--bg);
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }

    .onboarding-tool-badge.future {
      background: var(--border);
      color: var(--text-muted);
    }

    .onboarding-tool-header h2 {
      font-size: 18px;
      color: var(--text);
      margin: 0;
    }

    .onboarding-tool-question {
      font-style: italic;
      color: var(--primary);
      font-size: 15px;
      margin-bottom: 10px;
    }

    .onboarding-tool-section p {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 8px;
    }

    .onboarding-tool-section ul {
      margin: 10px 0 14px 0;
      padding-left: 20px;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.8;
    }

    .onboarding-tool-who,
    .onboarding-tool-need {
      font-size: 13px !important;
      background: rgba(0, 0, 0, 0.15);
      padding: 8px 12px;
      border-radius: 6px;
      margin-bottom: 6px !important;
    }

    .onboarding-tool-who strong,
    .onboarding-tool-need strong {
      color: var(--text);
    }

    .onboarding-reassurance {
      text-align: center;
      padding: 20px;
      margin: 24px 0;
    }

    .onboarding-reassurance p {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .onboarding-reassurance strong {
      color: var(--text);
    }

    .onboarding-cta {
      text-align: center;
      margin-bottom: 40px;
    }

    .onboarding-btn {
      padding: 16px 40px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .onboarding-btn.primary {
      background: linear-gradient(135deg, var(--primary) 0%, #5a9aba 100%);
      color: var(--bg);
    }

    .onboarding-btn.primary:hover {
      opacity: 0.9;
    }

    @media (max-width: 600px) {
      .onboarding-page {
        padding: 24px 16px;
      }

      .onboarding-welcome h1 {
        font-size: 24px;
      }

      .onboarding-tool-section {
        padding: 18px;
      }
    }
  `}let en=null,uo=null,q={scenarioName:"My Plan",scenarioDescription:"",enabledTools:["stress","decision"],introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35},et="scenario",ve=1;function rp(){et="scenario",ve=1,q={scenarioName:"My Plan",scenarioDescription:"",enabledTools:["stress","decision"],introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35}}function sp(n,e){en=n,uo=e,rp(),wt()}function wt(){en&&(et==="scenario"?ME():et==="stress"?LE():et==="decision"&&VE())}function ME(){en.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${nc(2,ve)}
        </div>

        ${ve===1?DE():NE()}
      </div>
    </div>
  `,rc()}function DE(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">Name your plan</div>
      <div class="wizard-step-desc">
        Give your plan a name. You can create multiple plans later for different scenarios
        (e.g. "Retire at 57", "Conservative at 60").
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <input type="text" id="wizScenarioName" value="${q.scenarioName}" placeholder="e.g. My Retirement Plan" style="max-width: 300px;">
      </div>

      <div class="wizard-step-desc" style="margin-bottom: 8px;">
        Add an optional description:
      </div>

      <div class="wizard-input">
        <input type="text" id="wizScenarioDesc" value="${q.scenarioDescription}" placeholder="e.g. Based on retiring at age 57" style="max-width: 400px;">
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="skip-all">Skip Setup</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function NE(){const n=q.enabledTools.includes("stress"),e=q.enabledTools.includes("decision");return`
    <div class="wizard-step">
      <div class="wizard-step-title">What would you like to use?</div>
      <div class="wizard-step-desc">
        Choose the tools you're interested in. You can change this later.
      </div>

      <div class="wizard-tool-choices">
        <label class="wizard-tool-option">
          <input type="checkbox" id="wizToolStress" ${n?"checked":""}>
          <div class="wizard-tool-info">
            <strong>Stress Tester</strong>
            <p>"Can I afford to retire?" Run simulations using real historical market data to see the range of possible outcomes for your pension.</p>
          </div>
        </label>

        <label class="wizard-tool-option">
          <input type="checkbox" id="wizToolDecision" ${e?"checked":""}>
          <div class="wizard-tool-info">
            <strong>Monthly Decision Tool</strong>
            <p>"Where should I take money from this month?" Helps you decide each month which fund to withdraw from to maximise tax efficiency.</p>
          </div>
        </label>
      </div>

      <div class="wizard-example">
        <strong>Tip:</strong> If you're still working, start with just the Stress Tester. Add the Decision Tool when you're ready to start drawing your pension.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="start-tools">Continue</button>
      </div>
    </div>
  `}function LE(){en.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${nc(6,ve)}
        </div>

        ${OE(ve)}
      </div>
    </div>
  `,rc()}function OE(n){switch(n){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            Think of this as your "salary" in retirement. This is the total amount before tax that you want to receive each year.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBaseSalary" value="${q.baseSalary}">
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
            <input type="number" id="wizOther" value="${q.otherIncome}">
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
                <input type="text" id="wizSpStartDate" value="${q.spStartDate}" placeholder="e.g. 6 May 2040" style="width: 100%;">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Weekly Amount (from HMRC)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizSpWeeklyAmount" value="${q.spWeeklyAmount||""}" step="0.01" placeholder="e.g. 221.20">
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
                <input type="number" id="wizEquityMin" value="${q.equityMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds (Medium Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizBondMin" value="${q.bondMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash (Low Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizCashTarget" value="${q.cashTarget}">
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
            <input type="number" id="wizDuration" value="${q.duration}" style="max-width: 100px;">
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
              <option value="inflates" ${q.taxMode==="inflates"?"selected":""}>Standard (rise with inflation)</option>
              <option value="frozen" ${q.taxMode==="frozen"?"selected":""}>Frozen (stay at current levels)</option>
            </select>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> "Frozen" is more pessimistic - you pay more tax over time as your income grows but thresholds don't.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="finish-stress">${q.enabledTools.includes("decision")?"Continue to Decision Tool":"Finish Setup"}</button>
          </div>
        </div>
      `;default:return""}}function VE(){en.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${nc(4,ve)}
        </div>

        ${BE(ve)}
      </div>
    </div>
  `,rc()}function BE(n){switch(n){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            This is your target "salary" from your pension. The tool will calculate how much to withdraw each month.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizDBaseSalary" value="${q.decisionSalary}">
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
                <input type="number" id="wizDEquityMin" value="${q.decisionEquity}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDBondMin" value="${q.decisionBond}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDCashTarget" value="${q.decisionCash}">
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
            <input type="number" id="wizDDuration" value="${q.decisionDuration}" style="max-width: 100px;">
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
      `;default:return""}}function nc(n,e){let t="";for(let r=1;r<=n;r++){const s=r<e?"done":r===e?"active":"";t+=`<div class="wizard-dot ${s}"></div>`}return t}function rc(){en.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>FE(e.dataset.action))})}function FE(n){switch(ip(),n){case"skip-all":Fr();break;case"next":et==="scenario"?ve<2&&(ve++,wt()):et==="stress"?ve<6&&(ve++,wt()):et==="decision"&&ve<4&&(ve++,wt());break;case"back":(et==="scenario"&&ve>1||et==="stress"&&ve>1||et==="decision"&&ve>1)&&(ve--,wt());break;case"start-tools":_a("scenario");break;case"skip-stress":_a("stress");break;case"finish-stress":q.decisionSalary=q.baseSalary,q.decisionEquity=q.equityMin,q.decisionBond=q.bondMin,q.decisionCash=q.cashTarget,q.decisionDuration=q.duration,_a("stress");break;case"skip-decision":Fr();break;case"finish":Fr();break}}function _a(n){const e=q.enabledTools.includes("stress"),t=q.enabledTools.includes("decision");n==="scenario"?e?(et="stress",ve=1,wt()):t?(et="decision",ve=1,wt()):Fr():n==="stress"&&t?(et="decision",ve=1,wt()):Fr()}function ip(){const n=document.getElementById("wizScenarioName");n&&(q.scenarioName=n.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(q.scenarioDescription=e.value.trim()||"");const t=document.getElementById("wizToolStress"),r=document.getElementById("wizToolDecision");if(t!==null||r!==null){const M=[];t&&t.checked&&M.push("stress"),r&&r.checked&&M.push("decision"),q.enabledTools=M}const s=document.getElementById("wizBaseSalary");s&&(q.baseSalary=parseFloat(s.value)||3e4);const i=document.getElementById("wizOther");i&&(q.otherIncome=parseFloat(i.value)||0);const a=document.getElementById("wizSpStartDate");a&&(q.spStartDate=a.value.trim()||"");const l=document.getElementById("wizSpWeeklyAmount");l&&(q.spWeeklyAmount=parseFloat(l.value)||0);const c=document.getElementById("wizEquityMin");c&&(q.equityMin=parseFloat(c.value)||25e4);const d=document.getElementById("wizBondMin");d&&(q.bondMin=parseFloat(d.value)||2e5);const f=document.getElementById("wizCashTarget");f&&(q.cashTarget=parseFloat(f.value)||5e4);const m=document.getElementById("wizDuration");m&&(q.duration=parseInt(m.value)||35);const v=document.getElementById("wizTaxMode");v&&(q.taxMode=v.value);const b=document.getElementById("wizDBaseSalary");b&&(q.decisionSalary=parseFloat(b.value)||3e4);const T=document.getElementById("wizDEquityMin");T&&(q.decisionEquity=parseFloat(T.value)||25e4);const A=document.getElementById("wizDBondMin");A&&(q.decisionBond=parseFloat(A.value)||2e5);const R=document.getElementById("wizDCashTarget");R&&(q.decisionCash=parseFloat(R.value)||5e4);const x=document.getElementById("wizDDuration");x&&(q.decisionDuration=parseInt(x.value)||35)}function Fr(){ip(),uo&&uo(q)}function qo(){en&&(en.style.display="none")}function zE(n,e,t){if(en=n,uo=t,rp(),q.enabledTools=e,e.includes("stress"))et="stress";else if(e.includes("decision"))et="decision";else{t&&t(q);return}ve=1,wt()}function $E(){return`
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

    .wizard-tool-choices {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 16px 0;
    }

    .wizard-tool-option {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid var(--border);
      transition: border-color 0.2s;
    }

    .wizard-tool-option:hover {
      border-color: var(--primary);
    }

    .wizard-tool-option input[type="checkbox"] {
      margin-top: 3px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      accent-color: var(--primary);
    }

    .wizard-tool-info {
      flex: 1;
    }

    .wizard-tool-info strong {
      color: var(--primary);
      font-size: 14px;
    }

    .wizard-tool-info p {
      margin: 6px 0 0 0;
      color: var(--text-muted);
      font-size: 13px;
      line-height: 1.5;
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
  `}function jo(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}const nr=new Map;let xr=-1;function md(n,e,t,r,s,i){const a=s-t,l=i-r,c=a*a+l*l;if(c===0)return Math.sqrt((n-t)*(n-t)+(e-r)*(e-r));const d=Math.max(0,Math.min(1,((n-t)*a+(e-r)*l)/c)),f=t+d*a,m=r+d*l;return Math.sqrt((n-f)*(n-f)+(e-m)*(e-m))}function UE(n,e,t={}){const r=jo(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:45,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=t.title||"Fund Value Projections (Percentile Bands)";s.font="bold 14px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="center",s.fillText(f,l.left+c/2,22);const m=t.years||35,v={};for(let x=0;x<=m;x++)v[x]=[];e.forEach(x=>{x.hist.forEach(M=>{const D=Math.floor(M.year);v[D]!==void 0&&v[D].push(M.total)})});const b=[];for(let x=0;x<=m;x++){const M=v[x].sort((C,O)=>C-O);if(M.length===0)continue;const D=C=>M[Math.floor(M.length*C)]||0;b.push({year:x,p5:D(.05),p10:D(.1),p25:D(.25),p50:D(.5),p75:D(.75),p90:D(.9),p95:D(.95)})}if(b.length===0)return;const T=Math.max(...b.map(x=>x.p90))*1.15,A=x=>l.left+x/m*c,R=x=>a-l.bottom-x/T*d;s.strokeStyle=r.grid,s.lineWidth=1;for(let x=0;x<=5;x++){const M=l.top+x/5*d;s.beginPath(),s.moveTo(l.left,M),s.lineTo(i-l.right,M),s.stroke()}s.fillStyle=r.cone,s.beginPath(),b.forEach((x,M)=>{const D=A(x.year);M===0?s.moveTo(D,R(x.p95)):s.lineTo(D,R(x.p95))});for(let x=b.length-1;x>=0;x--)s.lineTo(A(b[x].year),R(b[x].p5));s.closePath(),s.fill(),s.fillStyle=r.coneMid,s.beginPath(),b.forEach((x,M)=>{const D=A(x.year);M===0?s.moveTo(D,R(x.p90)):s.lineTo(D,R(x.p90))});for(let x=b.length-1;x>=0;x--)s.lineTo(A(b[x].year),R(b[x].p10));s.closePath(),s.fill(),s.fillStyle=r.coneInner,s.beginPath(),b.forEach((x,M)=>{const D=A(x.year);M===0?s.moveTo(D,R(x.p75)):s.lineTo(D,R(x.p75))});for(let x=b.length-1;x>=0;x--)s.lineTo(A(b[x].year),R(b[x].p25));s.closePath(),s.fill(),t.glide&&t.glide.length>0&&(s.strokeStyle=r.glidepath,s.lineWidth=2,s.setLineDash([6,3]),s.beginPath(),t.glide.forEach((x,M)=>{const D=A(x.year),C=R(x.min);M===0?s.moveTo(D,C):s.lineTo(D,C)}),s.stroke(),s.setLineDash([])),s.strokeStyle=r.primary,s.lineWidth=3,s.beginPath(),b.forEach((x,M)=>{const D=A(x.year),C=R(x.p50);M===0?s.moveTo(D,C):s.lineTo(D,C)}),s.stroke(),s.strokeStyle="rgba(248,81,73,0.6)",s.lineWidth=1.5,s.setLineDash([4,2]),s.beginPath(),b.forEach((x,M)=>{const D=A(x.year);M===0?s.moveTo(D,R(x.p10)):s.lineTo(D,R(x.p10))}),s.stroke(),s.setLineDash([]),s.strokeStyle=r.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(l.left,R(0)),s.lineTo(i-l.right,R(0)),s.stroke(),s.setLineDash([]),s.fillStyle=r.muted,s.font="11px sans-serif",s.textAlign="right";for(let x=0;x<=5;x++){const M=T*(1-x/5);s.fillText(ht(M),l.left-10,l.top+x/5*d+4)}s.textAlign="center";for(let x=0;x<=m;x+=5)s.fillText(`Yr ${x}`,A(x),a-l.bottom+20);nr.set(n.id,{percentiles:b,xScale:A,yScale:R,padding:l,chartWidth:c,chartHeight:d,years:m,maxValue:T,type:"cone"}),YE(n)}function qE(n,e,t={}){const r=jo(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:45,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=t.title||"Sample Trajectories (Green=Success, Red=Failed)";s.font="bold 14px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="center",s.fillText(f,l.left+c/2,22);const m=t.years||35,v=t.startValue||1e6,b=e.slice(0,100),T=b.filter(C=>C.failed),A=b.filter(C=>!C.failed);let R;if(T.length>0)R=v*2;else{const C=A.map(V=>V.final).sort((V,E)=>V-E),O=C[Math.floor(C.length*.5)]||v;R=Math.max(O*1.3,v*1.5)}const x=C=>l.left+C/m*c,M=C=>a-l.bottom-Math.min(C,R)/R*d;s.strokeStyle=r.grid,s.lineWidth=1;for(let C=0;C<=5;C++){const O=l.top+C/5*d;s.beginPath(),s.moveTo(l.left,O),s.lineTo(i-l.right,O),s.stroke()}s.fillStyle=r.muted,s.font="11px sans-serif",s.textAlign="right";for(let C=0;C<=5;C++){const O=R*(1-C/5);s.fillText(ht(O),l.left-10,l.top+C/5*d+4)}s.textAlign="center";for(let C=0;C<=m;C+=5)s.fillText(`Yr ${C}`,x(C),a-l.bottom+20);const D=[];t.glide&&t.glide.length>0&&(s.strokeStyle=r.glidepath,s.lineWidth=3,s.setLineDash([8,4]),s.beginPath(),t.glide.forEach((C,O)=>{const V=x(C.year),E=M(C.min);O===0?s.moveTo(V,E):s.lineTo(V,E)}),s.stroke(),s.setLineDash([])),A.forEach((C,O)=>{const V=C.hist.map(E=>({x:x(E.year),y:M(E.total)}));D.push({run:C,pts:V,failed:!1,idx:O}),s.strokeStyle=r.trajectory,s.lineWidth=.5,s.beginPath(),V.forEach((E,g)=>{g===0?s.moveTo(E.x,E.y):s.lineTo(E.x,E.y)}),s.stroke()}),T.forEach((C,O)=>{const V=C.hist.map(E=>({x:x(E.year),y:M(E.total)}));D.push({run:C,pts:V,failed:!0,idx:A.length+O}),s.strokeStyle=r.trajectoryFailed,s.lineWidth=2,s.beginPath(),V.forEach((E,g)=>{g===0?s.moveTo(E.x,E.y):s.lineTo(E.x,E.y)}),s.stroke()}),s.strokeStyle=r.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(l.left,M(0)),s.lineTo(i-l.right,M(0)),s.stroke(),s.setLineDash([]),nr.set(n.id,{results:b,paths:D,xScale:x,yScale:M,padding:l,chartWidth:c,chartHeight:d,years:m,maxValue:R,glide:t.glide,type:"trajectory"}),GE(n,r)}function jE(n,e,t={}){const r=jo(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:20,bottom:55,left:60},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=t.title||"Protection Months Distribution";s.font="bold 14px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="center",s.fillText(f,l.left+c/2,22);const m=e.map(C=>C.protMonths),v=m.length,b=Math.max(...m),T=Math.max(1,Math.ceil(b/15)),A={};m.forEach(C=>{const O=Math.floor(C/T)*T;A[O]=(A[O]||0)+1});const R=Object.keys(A).map(Number).sort((C,O)=>C-O),x=Math.max(...Object.values(A)),M=c/(R.length||1),D=[];s.strokeStyle=r.grid,s.lineWidth=1,s.fillStyle=r.muted,s.font="10px sans-serif",s.textAlign="right";for(let C=0;C<=4;C++){const O=l.top+C/4*d;s.beginPath(),s.moveTo(l.left,O),s.lineTo(i-l.right,O),s.stroke();const V=Math.round(x*(1-C/4));s.fillText(`${V} runs`,l.left-5,O+4)}R.forEach((C,O)=>{const V=A[C],E=V/x*d,g=l.left+O*M+2,y=a-l.bottom-E,_=M-4;s.fillStyle=C===0?r.success:r.warning,s.fillRect(g,y,_,E),D.push({x:g,y,w:_,h:E,months:C,monthsEnd:C+T-1,count:V,pct:(V/v*100).toFixed(1)})}),s.fillStyle=r.muted,s.font="10px sans-serif",s.textAlign="center",R.forEach((C,O)=>{if(O%2===0||R.length<12){const V=T>1?`${C}-${C+T-1}`:C.toString();s.fillText(V,l.left+O*M+M/2,a-l.bottom+15)}}),s.fillText("Protection Months",i/2,a-5),s.save(),s.translate(12,a/2),s.rotate(-Math.PI/2),s.textAlign="center",s.fillText("Number of Runs",0,0),s.restore(),nr.set(n.id,{bars:D,totalRuns:v,type:"histogram"}),KE(n)}function HE(n,e,t={}){const r=jo(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:180,bottom:60,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle=r.bg,s.fillRect(0,0,i,a);const f=Object.keys(e),m=t.years||35;let v=0;f.forEach(R=>{const x=e[R].result;x&&x.hist&&x.hist.forEach(M=>{M.total>v&&(v=M.total)})}),v*=1.1;const b=R=>l.left+R/m*c,T=R=>l.top+d-R/v*d;WE(s,l,c,d,m,v,t.title||"Scenario Comparison",r);const A=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];f.forEach((R,x)=>{const M=e[R].result;if(!M||!M.hist)return;s.beginPath(),s.strokeStyle=A[x%A.length],s.lineWidth=2.5,M.hist.forEach((C,O)=>{const V=b(C.year),E=T(C.total);O===0?s.moveTo(V,E):s.lineTo(V,E)}),s.stroke();const D=l.top+15+x*24;s.fillStyle=A[x%A.length],s.fillRect(i-l.right+15,D,20,4),s.font="11px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="left",s.fillText(e[R].name||R,i-l.right+40,D+5),M.final/1e3,s.fillStyle=r.muted,s.fillText(`${ht(M.final)}`,i-l.right+40,D+18)})}function WE(n,e,t,r,s,i,a,l){n.font="bold 14px system-ui, sans-serif",n.fillStyle=l.text,n.textAlign="center",n.fillText(a,e.left+t/2,e.top-20),n.strokeStyle=l.grid,n.lineWidth=1;for(let c=0;c<=5;c++){const d=e.top+r*c/5;n.beginPath(),n.moveTo(e.left,d),n.lineTo(e.left+t,d),n.stroke();const f=i*(5-c)/5;n.font="11px system-ui, sans-serif",n.fillStyle=l.muted,n.textAlign="right",n.fillText(ht(f),e.left-10,d+4)}for(let c=0;c<=s;c+=5){const d=e.left+c/s*t;n.beginPath(),n.moveTo(d,e.top),n.lineTo(d,e.top+r),n.stroke(),n.textAlign="center",n.fillText(`Y${c}`,d,e.top+r+20)}n.font="12px system-ui, sans-serif",n.textAlign="center",n.fillText("Years",e.left+t/2,e.top+r+45),n.save(),n.translate(20,e.top+r/2),n.rotate(-Math.PI/2),n.fillText("Fund Value",0,0),n.restore()}function ht(n){return n>=1e6?`£${(n/1e6).toFixed(1)}M`:n>=1e3?`£${(n/1e3).toFixed(0)}k`:`£${n.toFixed(0)}`}function YE(n,e){const t=n._coneHoverListener;t&&n.removeEventListener("mousemove",t);const r=s=>{const i=nr.get(n.id);if(!i||i.type!=="cone")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=(s.clientX-a.left)*l,{percentiles:d,padding:f,chartWidth:m,years:v}=i,b=(c-f.left)/m*v,T=Math.round(b);if(T<0||T>v){Sn();return}const A=d.find(x=>x.year===T);if(!A){Sn();return}const R=`
      <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
        <strong style="color:#f0c674;">Year ${T}</strong>
      </div>
      <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
        <span style="color:#8b8b9b;">95th percentile:</span><span>${ht(A.p95)}</span>
        <span style="color:#8b8b9b;">75th percentile:</span><span>${ht(A.p75)}</span>
        <span style="color:#8b8b9b;">Median (50th):</span><span style="color:#f0c674;font-weight:bold;">${ht(A.p50)}</span>
        <span style="color:#8b8b9b;">25th percentile:</span><span>${ht(A.p25)}</span>
        <span style="color:#8b8b9b;">10th percentile:</span><span style="color:#f85149;">${ht(A.p10)}</span>
        <span style="color:#8b8b9b;">5th percentile:</span><span>${ht(A.p5)}</span>
      </div>
    `;sc(s.clientX,s.clientY,R)};n._coneHoverListener=r,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",Sn)}function GE(n,e){const t=n._trajHoverListener;t&&n.removeEventListener("mousemove",t);const r=n._trajLeaveListener;r&&n.removeEventListener("mouseleave",r);const s=a=>{const l=nr.get(n.id);if(!l||l.type!=="trajectory")return;const c=n.getBoundingClientRect(),d=n.width/c.width,f=n.height/c.height,m=(a.clientX-c.left)*d,v=(a.clientY-c.top)*f,{paths:b,padding:T,chartWidth:A,chartHeight:R}=l;if(m<T.left||m>T.left+A||v<T.top||v>T.top+R){Sn(),xr!==-1&&(xr=-1,wa(n,l,e,null));return}let x=null,M=12*d;b.filter(C=>C.failed).forEach(C=>{for(let O=0;O<C.pts.length-1;O++){const V=md(m,v,C.pts[O].x,C.pts[O].y,C.pts[O+1].x,C.pts[O+1].y);V<M&&(M=V,x=C)}}),x||b.filter(C=>!C.failed).forEach(C=>{for(let O=0;O<C.pts.length-1;O++){const V=md(m,v,C.pts[O].x,C.pts[O].y,C.pts[O+1].x,C.pts[O+1].y);V<M&&(M=V,x=C)}});const D=x?x.idx:-1;if(D!==xr&&(xr=D,wa(n,l,e,x)),x){const C=x.run,O=x.failed?"#f85149":"#2ea043",V=x.failed?"❌":"✅",E=x.failed?"FAILED":"SUCCESS";let g=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${O};">${V} ${E}</strong>
          <span style="float:right;color:#8b8b9b;font-size:11px;">Run #${x.idx+1}</span>
        </div>
        <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
      `;C.startYear&&(g+=`<span style="color:#8b8b9b;">Start year:</span><span>${C.startYear}</span>`),g+=`<span style="color:#8b8b9b;">Duration:</span><span>${C.years.toFixed(1)} years</span>`,g+=`<span style="color:#8b8b9b;">Final balance:</span><span>${ht(C.final)}</span>`,g+=`<span style="color:#8b8b9b;">Protection months:</span><span>${C.protMonths}</span>`,g+=`<span style="color:#8b8b9b;">Longest streak:</span><span>${C.maxConsec} months</span>`,C.hodlUsed>0&&(g+=`<span style="color:#8b8b9b;">HODL used:</span><span>${ht(C.hodlUsed)}</span>`),g+="</div>",x.failed&&C.failMonth&&(g+=`<div style="margin-top:8px;padding-top:8px;border-top:1px solid #555;color:#f0c674;">💀 Depleted at year ${(C.failMonth/12).toFixed(1)}</div>`),sc(a.clientX,a.clientY,g)}else Sn()},i=()=>{if(Sn(),xr!==-1){xr=-1;const a=nr.get(n.id);a&&wa(n,a,e,null)}};n._trajHoverListener=s,n._trajLeaveListener=i,n.addEventListener("mousemove",s),n.addEventListener("mouseleave",i)}function KE(n,e){const t=n._histHoverListener;t&&n.removeEventListener("mousemove",t);const r=s=>{const i=nr.get(n.id);if(!i||i.type!=="histogram")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=n.height/a.height,d=(s.clientX-a.left)*l,f=(s.clientY-a.top)*c,{bars:m,totalRuns:v}=i;let b=null;if(m.forEach(T=>{d>=T.x&&d<=T.x+T.w&&f>=T.y&&f<=T.y+T.h&&(b=T)}),b){const T=b.months===0,A=T?"#2ea043":"#e1b12c",R=T?"🟢":"🟡",x=T?"No Protection":`${b.months}${b.monthsEnd>b.months?`-${b.monthsEnd}`:""} months`,M=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${A};">${R} ${x}</strong>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;">
          <span style="color:#8b8b9b;">Runs:</span><span>${b.count} of ${v}</span>
          <span style="color:#8b8b9b;">Percentage:</span><span>${b.pct}%</span>
        </div>
      `;sc(s.clientX,s.clientY,M)}else Sn()};n._histHoverListener=r,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",Sn)}function wa(n,e,t,r){const s=n.getContext("2d"),{width:i,height:a}=n,{paths:l,xScale:c,yScale:d,padding:f,chartWidth:m,chartHeight:v,years:b,maxValue:T,glide:A}=e;s.fillStyle="rgba(15,15,26,1)",s.fillRect(f.left,f.top,m,v),s.strokeStyle=t.grid,s.lineWidth=1;for(let R=0;R<=5;R++){const x=f.top+R/5*v;s.beginPath(),s.moveTo(f.left,x),s.lineTo(i-f.right,x),s.stroke()}A&&A.length>0&&(s.strokeStyle=t.glidepath,s.lineWidth=1.5,s.setLineDash([4,2]),s.beginPath(),A.forEach((R,x)=>{const M=c(R.year),D=d(R.min);x===0?s.moveTo(M,D):s.lineTo(M,D)}),s.stroke(),s.setLineDash([])),l.forEach(R=>{if(r&&R.idx===r.idx)return;const x=r?.15:R.failed?.8:.25;s.strokeStyle=R.failed?`rgba(248,81,73,${x})`:`rgba(46,160,67,${x})`,s.lineWidth=R.failed?2:.5,s.beginPath(),R.pts.forEach((M,D)=>{D===0?s.moveTo(M.x,M.y):s.lineTo(M.x,M.y)}),s.stroke()}),r&&(s.strokeStyle=r.failed?t.trajectoryFailedHover:t.trajectoryHover,s.lineWidth=4,s.shadowColor=r.failed?t.trajectoryFailedHover:t.trajectoryHover,s.shadowBlur=8,s.beginPath(),r.pts.forEach((R,x)=>{x===0?s.moveTo(R.x,R.y):s.lineTo(R.x,R.y)}),s.stroke(),s.shadowBlur=0),s.strokeStyle=t.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(f.left,d(0)),s.lineTo(i-f.right,d(0)),s.stroke(),s.setLineDash([])}function sc(n,e,t){let r=document.getElementById("chartTooltip");r||(r=document.createElement("div"),r.id="chartTooltip",document.body.appendChild(r)),r.innerHTML=t,r.style.display="block",r.style.left=n+15+"px",r.style.top=e-10+"px"}function Sn(){const n=document.getElementById("chartTooltip");n&&(n.style.display="none")}function QE(){return`
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
  `}window._simEngine={runMonteCarlo:Kf,runHistorical:Qf,simulate:zo};window._constants={EQUITY_RETURNS:Ls,INFLATION:Qa};window._mathUtils={seededRng:Xa};let op=null,ap=null;function lp(){op=null,ap=null;const n=document.getElementById("mcResults"),e=document.getElementById("histResults");n&&(n.innerHTML=""),e&&(e.innerHTML="")}function cp(){document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>t.classList.remove("active"));const n=document.querySelector('.sub-tab[data-stresstab="montecarlo"]');n&&n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(t=>t.classList.add("hidden"));const e=document.getElementById("stress-montecarlo");e&&e.classList.remove("hidden")}function up(){document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>t.classList.remove("active"));const n=document.querySelector('.sub-tab[data-decisiontab="entry"]');n&&n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(t=>t.classList.add("hidden"));const e=document.getElementById("decision-entry");e&&e.classList.remove("hidden")}const dp=document.createElement("style");dp.textContent=Qb()+_E()+RE()+kE()+$E()+fE()+QE();document.head.appendChild(dp);const ic=document.getElementById("globalLoadingOverlay"),JE=ic.querySelector(".loading-text");function Nt(n="Loading..."){JE.textContent=n,ic.classList.add("active")}function Lt(){ic.classList.remove("active")}window.showToast=function(e,t="info",r=3e3){const s=document.querySelector(".toast-notification");s&&s.remove();const i=document.createElement("div");i.className=`toast-notification ${t}`,i.innerHTML=`
        <span class="toast-icon">${t==="success"?"✓":t==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${e}</span>
      `,document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("show")),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},r)};document.getElementById("versionDisplay").textContent=`v${_d}`;document.getElementById("entryMonth").value=jp();function ho(n){const e=document.getElementById(n+"SpWeeklyAmount"),t=document.getElementById(n+"SpAnnualAmount");if(!e||!t)return;const r=parseFloat(e.value)||0,s=r*52;r>0?t.value="£"+s.toLocaleString("en-GB",{maximumFractionDigits:2}):t.value=""}["ds","ss"].forEach(n=>{const e=document.getElementById(n+"SpWeeklyAmount");e&&e.addEventListener("input",()=>ho(n))});function XE(n){const e=parseFloat(n);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function hp(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(t){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(t){!t.shiftKey&&!t.ctrlKey&&!t.metaKey&&this.select()})})}function fp(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted)return;e.dataset.formatted="true";const t=e.closest(".input-with-unit")||e.parentElement,r=e.closest(".input-with-unit")!==null,s=document.createElement("span");s.className="number-format-overlay";const i=r?"34px":"14px";s.style.cssText=`
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
        `,getComputedStyle(t).position==="static"&&(t.style.position="relative");function a(){const l=parseFloat(e.value);!isNaN(l)&&l>=1e3&&document.activeElement!==e?(s.textContent=XE(l),s.style.display="block",e.style.color="transparent"):(s.style.display="none",e.style.color="")}e._updateOverlay=a,e.addEventListener("focus",()=>{s.style.display="none",e.style.color=""}),e.addEventListener("blur",a),e.addEventListener("input",()=>{document.activeElement===e&&(s.style.display="none",e.style.color="")}),t.appendChild(s),a()})}function Ho(){document.querySelectorAll('input[type="number"]').forEach(n=>{n._updateOverlay&&n._updateOverlay()})}setTimeout(()=>{hp(),fp()},100);const ZE=new MutationObserver(n=>{let e=!1;n.forEach(t=>{t.addedNodes.forEach(r=>{var s,i;r.nodeType===1&&((s=r.matches)!=null&&s.call(r,'input[type="number"]')||(i=r.querySelector)!=null&&i.call(r,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{hp(),fp()},50)});ZE.observe(document.body,{childList:!0,subtree:!0});let kr=null;async function oc(n,e=null){Gs(),np(),Uo(),qo(),document.getElementById("mainApp").classList.remove("hidden"),document.getElementById("userEmail").textContent=n.email,await zr();const t=await Hf();ac(t),await Ot(),await rr(),Ya(),cp(),up(),lp();const r=e||(t.includes("decision")?"decision":"stress");document.querySelectorAll(".tab").forEach(a=>a.classList.remove("active"));const s=document.querySelector(`.tab[data-tab="${r}"]`);s&&s.classList.add("active"),document.querySelectorAll(".tab-content").forEach(a=>a.classList.remove("active"));const i=document.getElementById(`${r}-content`);i&&i.classList.add("active")}function ac(n){const e={decision:["decision"],stress:["stress"]};document.querySelectorAll(".tab").forEach(r=>{const s=r.dataset.tab;let i=!1;for(const[a,l]of Object.entries(e))if(l.includes(s)){i=n.includes(a);break}Object.values(e).flat().includes(s)||(i=!0),r.style.display=i?"":"none"})}async function Ya(){try{const n=await Dn(),e=await lr();document.getElementById("entryEquity").value=e.equityMin||25e4,document.getElementById("entryBond").value=e.bondMin||2e5,document.getElementById("entryCash").value=e.cashTarget||5e4,document.getElementById("dsEquityMin").value=e.equityMin||25e4,document.getElementById("dsBondMin").value=e.bondMin||2e5,document.getElementById("dsCashTarget").value=e.cashTarget||5e4,document.getElementById("dsDuration").value=e.duration||35,document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",ho("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||1e4,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,["mc","hist","scen"].forEach(t=>{const r=document.getElementById(t+"Equity"),s=document.getElementById(t+"Bond"),i=document.getElementById(t+"Cash"),a=document.getElementById(t+"Years");r&&(r.value=n.equityMin),s&&(s.value=n.bondMin),i&&(i.value=n.cashTarget),a&&(a.value=n.duration)}),document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",ho("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,Ho(),console.log("All inputs initialized from stored settings")}catch(n){console.error("Error initializing inputs from settings:",n)}}async function pp(n){console.log("Wizard completed with data:",n);try{const r={baseSalary:n.baseSalary,other:n.otherIncome,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,duration:n.duration,taxMode:n.taxMode},s={baseSalary:n.decisionSalary,equityMin:n.decisionEquity,bondMin:n.decisionBond,cashTarget:n.decisionCash,duration:n.decisionDuration,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount};await yb(n.scenarioName||"My Plan",n.scenarioDescription||"",n.enabledTools||["stress","decision"],{stressSettings:r,decisionSettings:s},!0),tr(),Pn()}catch(r){console.error("Error creating scenario from wizard:",r)}const e=ns(),t=n.enabledTools.includes("stress")?"stress":"decision";oc(e,t)}function Ga(n){Gs(),np();const e=n.displayName||n.email.split("@")[0];document.getElementById("onboardingPage").style.display="block",PE(document.getElementById("onboardingPage"),e,()=>{Uo(),document.getElementById("setupWizard").style.display="block",sp(document.getElementById("setupWizard"),pp)})}wE(document.getElementById("authScreen"),async n=>{console.log("Auth success callback triggered for:",n.email);try{console.log("Checking for existing cloud data...");const e=await mb();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),Gs(),oc(n)):(console.log("New user - showing onboarding page"),Ga(n))}catch(e){console.error("Error in auth callback:",e),Ga(n)}});yE(document.getElementById("landingPage"),{onGetStarted:()=>{Gs(),co("signup")},onSignIn:()=>{Gs(),co("signin")}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{tr(),Pn(),sn(),await Vf(),document.getElementById("mainApp").classList.add("hidden"),Uo(),qo(),co("signin")}catch(n){console.error("Logout error:",n)}});async function zr(){var s;const n=await Gl(),e=n.find(i=>i.isActive),t=document.getElementById("scenarioActiveName");t&&(t.textContent=e&&(((s=e.planDetails)==null?void 0:s.name)||e.name)||"No Plan");const r=document.getElementById("scenarioList");if(r){if(n.length===0){r.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}r.innerHTML=n.map(i=>{var c,d;const a=((c=i.planDetails)==null?void 0:c.name)||i.name||"Unnamed Plan",l=((d=i.planDetails)==null?void 0:d.description)||i.description||"";return`
        <div class="scenario-dropdown-item ${i.isActive?"active":""}" data-scenario-id="${i.id}">
          <div>
            <div class="scenario-item-name">${a}</div>
            ${l?`<div class="scenario-item-desc">${l}</div>`:""}
          </div>
          <div class="scenario-item-actions">
            <button class="scenario-tools-btn" data-id="${i.id}" data-tools="${(i.enabledTools||["stress","decision"]).join(",")}" title="Edit Tools">&#9881;</button>
            <button class="scenario-rename-btn" data-id="${i.id}" data-name="${a}" title="Rename">&#9998;</button>
            ${n.length>1?`<button class="scenario-delete-btn" data-id="${i.id}" data-name="${a}" title="Delete">&times;</button>`:""}
          </div>
        </div>
      `}).join(""),r.querySelectorAll(".scenario-dropdown-item").forEach(i=>{i.addEventListener("click",async a=>{if(a.target.closest(".scenario-item-actions"))return;const l=i.dataset.scenarioId;if(!l)return;const c=n.find(d=>d.isActive);if(c&&c.id===l){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await vb(l),tr(),Pn(),document.getElementById("scenarioDropdown").classList.remove("open"),lp(),cp(),up();const d=await Hf();ac(d);const f=document.querySelector(".tab.active");if(f&&f.style.display==="none"){const m=document.querySelector('.tab:not([style*="display: none"])');if(m){document.querySelectorAll(".tab").forEach(T=>T.classList.remove("active")),m.classList.add("active"),document.querySelectorAll(".tab-content").forEach(T=>T.classList.remove("active"));const v=m.dataset.tab+"-content",b=document.getElementById(v);b&&b.classList.add("active")}}await Ot(),await rr(),await Ya(),await zr()}catch(d){console.error("Error switching scenario:",d),showToast("Failed to switch plan: "+d.message,"error")}})}),r.querySelectorAll(".scenario-rename-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=i.dataset.name,d=prompt("Rename plan:",c);if(d&&d.trim()&&d.trim()!==c)try{await wb(l,d.trim()),await zr()}catch(f){console.error("Error renaming scenario:",f),showToast("Failed to rename plan: "+f.message,"error")}})}),r.querySelectorAll(".scenario-tools-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=(i.dataset.tools||"stress,decision").split(",");document.getElementById("scenarioDropdown").classList.remove("open"),eT(l,c)})}),r.querySelectorAll(".scenario-delete-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=i.dataset.name;if(confirm(`Delete plan "${c}"? This cannot be undone.`))try{await Eb(l),tr(),Pn(),await Ot(),await rr(),await Ya(),await zr()}catch(d){console.error("Error deleting scenario:",d),showToast("Failed to delete plan: "+d.message,"error")}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",n=>{n.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",n=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(n.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden"),document.getElementById("setupWizard").style.display="block",sp(document.getElementById("setupWizard"),pp)});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{var r;document.getElementById("scenarioDropdown").classList.remove("open");const n=await Tt();if(!n){showToast("No active plan to duplicate.","error");return}const e=((r=n.planDetails)==null?void 0:r.name)||n.name||"My Plan",t=prompt("Name for the copy:",e+" (copy)");if(!(!t||!t.trim()))try{await _b(n.id,t.trim()),await zr()}catch(s){console.error("Error duplicating scenario:",s),showToast("Failed to duplicate plan: "+s.message,"error")}});function eT(n,e){const t=document.getElementById("editToolsModal");t&&t.remove();const r=e.includes("stress"),s=e.includes("decision"),i=document.createElement("div");i.id="editToolsModal",i.className="edit-tools-overlay",i.innerHTML=`
        <div class="edit-tools-box">
          <div class="edit-tools-title">Edit Enabled Tools</div>
          <div class="edit-tools-desc">Choose which tools this plan should include. You can change this any time.</div>

          <div class="wizard-tool-choices">
            <label class="wizard-tool-option">
              <input type="checkbox" id="editToolStress" ${r?"checked":""}>
              <div class="wizard-tool-info">
                <strong>Stress Tester</strong>
                <p>Run simulations to test if your pension can sustain your desired income.</p>
              </div>
            </label>
            <label class="wizard-tool-option">
              <input type="checkbox" id="editToolDecision" ${s?"checked":""}>
              <div class="wizard-tool-info">
                <strong>Monthly Decision Tool</strong>
                <p>Get monthly withdrawal recommendations to maximise tax efficiency.</p>
              </div>
            </label>
          </div>

          <div class="edit-tools-buttons">
            <button class="wizard-btn secondary" id="editToolsCancel">Cancel</button>
            <button class="wizard-btn primary" id="editToolsSave">Save</button>
          </div>
        </div>
      `,document.body.appendChild(i),document.getElementById("editToolsCancel").addEventListener("click",()=>i.remove()),i.addEventListener("click",a=>{a.target===i&&i.remove()}),document.getElementById("editToolsSave").addEventListener("click",async()=>{const a=[];document.getElementById("editToolStress").checked&&a.push("stress"),document.getElementById("editToolDecision").checked&&a.push("decision");const l=a.filter(c=>!e.includes(c));try{await bb(n,a);const c=await Tt();if(c&&c.id===n){ac(a);const d=document.querySelector(".tab.active");if(d&&d.style.display==="none"){const f=document.querySelector('.tab:not([style*="display: none"])');if(f){document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active")),f.classList.add("active"),document.querySelectorAll(".tab-content").forEach(b=>b.classList.remove("active"));const m=f.dataset.tab+"-content",v=document.getElementById(m);v&&v.classList.add("active")}}}if(await zr(),i.remove(),l.length>0){const d=document.getElementById("setupWizard");d.style.display="block",document.getElementById("mainApp").style.display="none",zE(d,l,async f=>{qo();try{l.includes("stress")&&(await Zl({equityMin:f.equityMin,bondMin:f.bondMin,cashTarget:f.cashTarget,duration:f.duration,baseSalary:f.baseSalary,other:f.otherIncome||0,taxMode:f.taxMode||"inflates"}),Pn()),l.includes("decision")&&(await Kl({equityMin:f.decisionEquity,bondMin:f.decisionBond,cashTarget:f.decisionCash,duration:f.decisionDuration,baseSalary:f.decisionSalary,spStartDate:f.spStartDate||null,spWeeklyAmount:f.spWeeklyAmount||0}),tr())}catch(m){console.error("Error saving new tool settings:",m)}await oc(),showToast("New tool configured successfully","success")})}else showToast("Tools updated","success")}catch(c){console.error("Error updating scenario tools:",c),showToast("Failed to update tools: "+c.message,"error")}})}const tT=60*60*1e3;let ba=null;function mp(){ba&&clearTimeout(ba),ct()&&(ba=setTimeout(async()=>{if(ct()){showToast("You have been logged out due to inactivity (1 hour).","info",5e3);try{tr(),Pn(),sn(),await Vf(),document.getElementById("mainApp").classList.add("hidden"),Uo(),qo(),co("signin")}catch(n){console.error("Auto-logout error:",n)}}},tT))}const nT=["mousedown","mousemove","keydown","scroll","touchstart","click"];nT.forEach(n=>{document.addEventListener(n,()=>{mp()},{passive:!0})});mp();document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await pb(),console.log("Data wiped successfully"),tr(),Pn(),sn(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden");const t=ns();Ga(t),showToast("All data has been deleted. Set up a new plan to start fresh.","success",4e3)}catch(t){console.error("Reset error:",t),showToast("Error resetting data: "+t.message,"error")}});document.querySelectorAll(".tab").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${n.dataset.tab}-content`).classList.add("active"),n.dataset.tab==="stress"&&await lc()})});const bs=document.querySelector(".tabs"),gd=document.querySelector(".tabs-wrapper");if(bs&&gd){const n=()=>{const e=bs.scrollLeft+bs.clientWidth>=bs.scrollWidth-10;gd.classList.toggle("scrolled-end",e)};bs.addEventListener("scroll",n),n()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${n.dataset.stresstab}`).classList.remove("hidden"),n.dataset.stresstab==="stresssettings"&&await lc()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${n.dataset.decisiontab}`).classList.remove("hidden"),n.dataset.decisiontab==="decisionsettings"&&await yp(),n.dataset.decisiontab==="history"&&await Ot(),n.dataset.decisiontab==="taxyears"&&await rr()})});function rT(n){const[e,t]=n.split("-").map(Number);return t>=4?e%100+"/"+(e+1)%100:(e-1)%100+"/"+e%100}function sT(n){const[e,t]=n.split("-").map(Number);return Math.max(0,(t>=4?e:e-1)-2026)}function Ea(n,e,t,r,s){if(s){const i=Math.max(0,1-e/t);return n*r*i}return n*r}function yd(n,e,t){return n<=e?n:n<=t?e+(n-e)*.8:e+(t-e)*.8+(n-t)*.6}async function vd(n,e,t,r){var cs,an,wr,br;const s=await lr(),i=await rs(),a=await Mn(),l=rT(n),c=sT(n),[d,f]=n.split("-").map(Number);if(!a[l])throw new Error(`Tax year ${l} is not configured. Please add it in the Settings tab before calculating.`);const m=a[l],v=m.pa||12570,b=m.brl||50270,T=m.other||0,A=m.isTaxEfficient!==!1,R=m.isaSavingsAllocation||0,x=m.grossIncomeToDate||0,M=m.confirmedSalary||s.baseSalary,D=i.find(J=>J.date===n),C=(D==null?void 0:D.isa)||0,O=Math.max(0,(m.isaSavingsUsed||0)-C),E=(await Jl(l)).amount||0;let g=1;for(let J=0;J<c;J++){const ke=String((26+J)%100).padStart(2,"0")+"/"+String((27+J)%100).padStart(2,"0"),pe=(a[ke]||{}).cpi||.04;g*=1+pe}const y=Math.round(Ea(s.equityMin,c,s.duration,g,!0)),_=Math.round(Ea(s.bondMin,c,s.duration,g,!0)),I=Math.round(Ea(s.cashTarget,c,s.duration,g,!1)),S=e+t,w=y+_;let oe=!1,Ce=0;const Z=i.filter(J=>J.date<n);for(let J=Z.length-1;J>=0&&Z[J].source==="Cash";J--)Ce++;Z.length&&Z[Z.length-1].inProtection&&(oe=S<=w+(s.recoveryBuffer||1e4)),!oe&&S<w&&Ce+1>=(s.consecutiveLimit||3)&&(oe=!0);const Se=f>=4?16-f:4-f,ce=Math.max(1,Se),he=M*g,Oe=T+E;let ue,we,U,be=0,X=0,ie=!1,Ve=0;const dt=Math.max(0,R-O)/ce;if(A){const J=Oe/12;i.filter(me=>me.taxYear===l&&me.date<n);const ke=he/12;let pe;if(((an=(cs=m.expectedMonthly)==null?void 0:cs.sipp)==null?void 0:an.gross)>0)pe=m.expectedMonthly.sipp.gross;else{const xe=Math.max(0,b-x-Oe)/12;pe=Math.min(ke-J,xe)}const $t=yd(he,v,b)/12,yt=Math.min(he,b),vt=yd(yt,v,b)/12,ye=Math.max(0,$t-vt),Te=Math.min(ye,dt);if(Ve=Te,be=pe,oe){const me=(s.protectionFactor||20)/100;ue=pe*(1-me),we=Te,U="Protection"}else{ue=pe,we=Te,U="Tax-Efficient";const me=f>=4?d:d-1,xe=Z.filter(Ae=>{const[Bn,Er]=Ae.date.split("-").map(Number);return(Er>=4?Bn:Bn-1)===me});let tt=0,Vn=0;if(xe.forEach(Ae=>{Vn+=Ae.sipp||0,Ae.inProtection&&Ae.stdSipp&&(tt+=Ae.stdSipp-Ae.sipp),Ae.boostAmount>0&&(tt-=Ae.boostAmount)}),tt>0){const Ae=Vn+ue*ce+Oe,Bn=b-Ae,Er=S-w-(s.recoveryBuffer||1e4);if(Bn>0&&Er>0){const Fn=Bn/ce,pi=tt/ce,us=Er/ce;X=Math.min(pi,Fn,us),X>50&&(ue+=X,U="Tax Boost")}}}}else{const J=he/12,ke=Oe/12;let pe;if(((br=(wr=m.expectedMonthly)==null?void 0:wr.sipp)==null?void 0:br.gross)>0?pe=m.expectedMonthly.sipp.gross:pe=Math.max(0,J-ke),be=pe,we=0,oe){const $t=(s.protectionFactor||20)/100;ue=pe*(1-$t),U="Protection";const yt=f>=4?d:d-1,vt=Z.filter(me=>{const[xe,tt]=me.date.split("-").map(Number);return(tt>=4?xe:xe-1)===yt});let ye=0;vt.forEach(me=>{ye+=me.sipp||0});const Te=ye+ue*ce+Oe;if(Te<b){const xe=(b-Te)/ce,tt=S-w-(s.recoveryBuffer||1e4);tt>0&&xe>50&&(X=Math.min(xe,tt/ce),X>50&&(ue+=X,ie=!0,U="Protection-Induced Efficiency"))}}else{ue=pe,U="Tax-Inefficient";const $t=f>=4?d:d-1,yt=Z.filter(Te=>{const[me,xe]=Te.date.split("-").map(Number);return(xe>=4?me:me-1)===$t});let vt=0,ye=0;if(yt.forEach(Te=>{ye+=Te.sipp||0,Te.inProtection&&Te.stdSipp&&(vt+=Te.stdSipp-Te.sipp),Te.boostAmount>0&&(vt-=Te.boostAmount)}),vt>0){const Te=ye+ue*ce+Oe,me=b-Te,xe=S-w-(s.recoveryBuffer||1e4);if(me>0&&xe>0){const tt=me/ce,Vn=vt/ce,Ae=xe/ce;X=Math.min(Vn,tt,Ae),X>50&&(ue+=X,U="Tax Boost")}}}}let Be,It,ur=0,dr=0,Nn=0,Ln="";if(!oe&&S>=w+ue){Be="Growth";const J=Math.max(0,e-y),ke=Math.max(0,t-_),pe=J+ke;pe>0?(ur=ue*J/pe,dr=ue*ke/pe,It="Healthy"):(Be="Cash",Nn=ue,It="At min")}else Be="Cash",Nn=ue,It=oe?"Protection":"Below min",r<ue&&(Ln="Cash low!");let St="";const hr=e-y,fr=t-_;if(hr>5e3&&fr<-5e3){const J=Math.floor(Math.min(hr,-fr)/1e3)*1e3;J>=5e3&&(St=`Move £${J.toLocaleString()} Equity→Bond`)}else if(fr>5e3&&hr<-5e3){const J=Math.floor(Math.min(fr,-hr)/1e3)*1e3;J>=5e3&&(St=`Move £${J.toLocaleString()} Bond→Equity`)}let pr="";const mr=I-r;if(mr>5e3&&Be==="Growth"&&!oe){const J=S-w-ue;if(J>1e4){const ke=Math.floor(Math.min(mr*.3,J*.5)/1e3)*1e3;ke>=5e3&&(pr=`Replenish Cash: Move £${ke.toLocaleString()} from growth funds`)}}const on=[];Ln&&on.push({message:Ln,severity:"danger",type:"low-cash"}),X>50&&on.push({message:`Tax Boost: +£${Math.round(X).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),St&&on.push({message:St,severity:"warning",type:"rebalance"}),pr&&on.push({message:pr,severity:"info",type:"cash-replenish"});const Wo=f>=4?d:d-1,gr=Z.filter(J=>{const[ke,pe]=J.date.split("-").map(Number);return(pe>=4?ke:ke-1)===Wo}),ss=gr.reduce((J,ke)=>J+(ke.sipp||0),0),yr=gr.length+1,$e=Math.max(0,12-yr)*be,Ft=ss+ue+$e+T+E;let zt=0;Ft>v&&(Ft<=b?zt=(Ft-v)*.2:zt=(b-v)*.2+(Ft-b)*.4);const di=zt/12,os=ue+T/12+E/12-di+we,hi=di*yr,as=zt,_r=he/12;let ls=0;_r*12>v&&(_r*12<=b?ls=(_r*12-v)*.2:ls=(b-v)*.2+(_r*12-b)*.4);const On=Math.max(0,ls/12-zt/12),fi=O+Ve;return{date:n,taxYear:l,yearNumber:c,remainingMonths:ce,equity:e,bond:t,cash:r,isa:0,adjEquityMin:y,adjBondMin:_,adjCashTarget:I,pa:v,brl:b,other:T/12,statePension:E/12,sippDraw:ue,stdSipp:be,isaDraw:we,totalMonthlyNet:os,isTaxEfficientYear:A,yearlyIsaSavingsAllocation:R,cumulativeIsaSavingsUsed:fi,isaSavingsUsedThisMonth:Ve,taxPaidYTD:hi,taxProjectedAnnual:as,taxSavedMonthly:On,taxSavedYTD:On*yr,taxSavedProjectedAnnual:On*12,taxEfficient:A&&!ie,inProtection:oe,protectionReason:oe?It:null,consecutiveCashDraws:Ce,protectionInducedTaxEfficiency:ie,boostAmount:X>50?X:0,boostEligible:X>50,source:Be,drawFromEquity:ur,drawFromBond:dr,drawFromCash:Nn,rebalanceNeeded:St!=="",rebalanceActions:St?[St]:[],alerts:on,calculationDetails:{mode:U,reason:`${It} | ${U}`,totalGrowth:S,minGrowth:w,consec:Ce,stdSipp:ue,inputs:{baseSalary:s.baseSalary,confirmedSalary:M,targetGross:he,cumInf:g,yearNum:c,taxYear:l,OTHER:T,STATE:E,PA:v,BRL:b,isTaxEfficientYear:A,yearlyIsaSavingsAllocation:R,grossIncomeToDate:x},taxInfo:{annualTaxable:Ft,headroomToBRL:b-Ft,annualTax:zt,monthlyNet:os}}}}window.handleDecisionSubmit=async function(n){n.preventDefault();const e=document.getElementById("entryMonth").value,t=parseFloat(document.getElementById("entryEquity").value)||0,r=parseFloat(document.getElementById("entryBond").value)||0,s=parseFloat(document.getElementById("entryCash").value)||0,i=[];if(e||i.push("Month"),!t&&t!==0&&i.push("Equity Fund"),!r&&r!==0&&i.push("Bond Balance"),!s&&s!==0&&i.push("Cash Balance"),i.length>0){showToast("Missing: "+i.join(", "),"error",4e3);return}if((await rs({limit:1e3})).find(c=>c.date===e)){showToast(`${Qr(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await sE(e)).showWizard){const f=document.getElementById("taxYearWizard");f.style.display="block",window._pendingDecisionForm={dateStr:e,equity:t,bond:r,cash:s},rE(f,e,async m=>{if(f.style.display="none",m&&m.completed)try{kr=await vd(e,t,r,s);const v=document.getElementById("decisionOutput");ld(kr,v),document.getElementById("saveBtn").disabled=!1}catch(v){console.error("Decision error after wizard:",v),showToast("Error: "+v.message,"error")}});return}kr=await vd(e,t,r,s);const d=document.getElementById("decisionOutput");ld(kr,d),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),showToast("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const n=document.getElementById("saveBtn");if(!kr){showToast("No decision to save","error");return}if(!ct()){showToast("Please sign in to save decisions","error");return}n.classList.add("loading"),n.disabled=!0;try{await Nb(kr),showToast("Decision saved to history","success"),await Ot()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error"),n.disabled=!1}finally{n.classList.remove("loading")}};window.runMonteCarloUI=async function(){const n={equityStart:parseFloat(document.getElementById("mcEquity").value)||25e4,bondStart:parseFloat(document.getElementById("mcBond").value)||2e5,cashStart:parseFloat(document.getElementById("mcCash").value)||5e4,years:parseInt(document.getElementById("mcYears").value)||35};document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await Dn(),setTimeout(()=>{try{const{results:e,stats:t}=pE(n);op=e,gp(t,e,"Monte Carlo (1000 runs)","mcResults",n.years)}catch(e){console.error("Simulation error:",e),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};window.runHistoricalUI=async function(){const n={equityStart:parseFloat(document.getElementById("histEquity").value)||25e4,bondStart:parseFloat(document.getElementById("histBond").value)||2e5,cashStart:parseFloat(document.getElementById("histCash").value)||5e4,years:parseInt(document.getElementById("histYears").value)||35};document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await Dn(),setTimeout(()=>{try{const{results:e,stats:t}=mE(n);ap=e,gp(t,e,"Historical Analysis","histResults",n.years)}catch(e){console.error("Simulation error:",e),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};window.runScenariosUI=async function(){const n={equityStart:parseFloat(document.getElementById("scenEquity").value)||25e4,bondStart:parseFloat(document.getElementById("scenBond").value)||2e5,cashStart:parseFloat(document.getElementById("scenCash").value)||5e4,years:35};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',await Dn(),setTimeout(()=>{try{const e=gE(n);cT(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};function iT(n){if(!n.spStartDate||!n.spWeeklyAmount)return console.warn("State Pension not configured - spStartDate or spWeeklyAmount missing"),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const e=oT(n.spStartDate);if(!e)return console.warn("Could not parse spStartDate:",n.spStartDate),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const t=new Date,r=365.25*24*60*60*1e3,s=Math.max(0,(e.getTime()-t.getTime())/r),i=Math.floor(s);e.getMonth(),e.getDate();const a=365,l=Math.floor((e-new Date(e.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function oT(n){if(!n)return null;if(/^\d{4}-\d{2}-\d{2}$/.test(n))return new Date(n);if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,s,i]=n.split("/").map(Number);return new Date(i,s-1,r)}const e={january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};let t=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})$/i);if(t){const r=parseInt(t[1]),s=e[t[2].toLowerCase()],i=parseInt(t[3]);if(s!==void 0)return new Date(i,s,r)}if(t=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\d{4})$/i),t){const r=e[t[1].toLowerCase()],s=parseInt(t[2]),i=parseInt(t[3]);if(r!==void 0)return new Date(i,r,s)}return null}let Ta=!1;window.runOptimisationUI=async function(n){if(Ta)return;Ta=!0;const e=document.getElementById("optimiseBtn"+n),t=document.getElementById("optimiseResults"+n);e&&(e.disabled=!0),e&&(e.textContent="Optimising...");let r,s,i,a;n==="MC"?(r=document.getElementById("mcEquity"),s=document.getElementById("mcBond"),i=document.getElementById("mcCash"),a=document.getElementById("mcYears")):(r=document.getElementById("histEquity"),s=document.getElementById("histBond"),i=document.getElementById("histCash"),a=document.getElementById("histYears"));const l=+r.value,c=+s.value,d=+i.value,f=+a.value,m=l+c+d;t.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations...</div>';const v=await Dn(),b=JSON.parse(JSON.stringify(v));setTimeout(()=>{try{let T=null,A={equity:l,bond:c,cash:d,rate:0,avgProt:0,withProt:0,totalRuns:0};const R=[];for(let I=5;I<=30;I+=5)for(let S=20;S<=95-I;S+=5){const w=100-I-S;w>=0&&R.push({equity:Math.round(m*S/100),bond:Math.round(m*w/100),cash:Math.round(m*I/100)})}const{EQUITY_RETURNS:x,INFLATION:M}=window._constants,{simulate:D}=window._simEngine,{seededRng:C}=window._mathUtils,O=Object.keys(x).map(Number).sort((I,S)=>I-S),V=Math.max(...O),E=I=>{const S={equityStart:I.equity,bondStart:I.bond,cashStart:I.cash,years:f,equityMin:b.equityMin,bondMin:b.bondMin,cashTarget:b.cashTarget,duration:b.duration,baseSalary:b.baseSalary,other:b.other,...iT(b),pa:b.pa,brl:b.brl,hrl:b.hrl,taxMode:b.taxMode,protectionMult:b.protectionMult,consecutiveLimit:b.consecutiveLimit,disableProtection:b.disableProtection,hodlEnabled:b.hodlEnabled,hodlValue:b.hodlValue},w=[];if(n==="MC")for(let U=0;U<1e3;U++){const be=C(U*12345),X={equity:{},inflation:{}};for(let ie=0;ie<f;ie++){const Ve=O[Math.floor(be()*O.length)];X.equity[ie]=x[Ve],X.inflation[ie]=M[Ve]||.025}w.push(D(S,X,U))}else O.forEach(U=>{if(U+f-1>V)return;const be={equity:{},inflation:{}};for(let X=0;X<f;X++)be.equity[X]=x[U+X]||0,be.inflation[X]=M[U+X]||.025;w.push(D(S,be,U))});const oe=w.filter(U=>U.failed),Ce=w.filter(U=>!U.failed),Z=(w.length-oe.length)/w.length*100,ce=w.map(U=>U.protMonths).reduce((U,be)=>U+be,0)/w.length,he=w.filter(U=>U.protMonths>0).length,Oe=Ce.map(U=>U.final).sort((U,be)=>U-be),ue=Oe.length>0?Oe[Math.floor(Oe.length*.5)]:0,we=Oe.length>0?Oe[Math.floor(Oe.length*.9)]:0;return{equity:I.equity,bond:I.bond,cash:I.cash,rate:Z,avgProt:ce,withProt:he,totalRuns:w.length,medianFinal:ue,p90Final:we}},y=E({equity:l,bond:c,cash:d});A.avgProt=y.avgProt,A.withProt=y.withProt,A.totalRuns=y.totalRuns,A.rate=y.rate,A.medianFinal=y.medianFinal,A.p90Final=y.p90Final,R.forEach(I=>{const S=E(I);S.avgProt<=A.avgProt&&(!T||S.rate>T.rate)&&(T=S)});let _="";if(T&&T.rate>A.rate){const I=T.medianFinal-A.medianFinal,S=A.medianFinal>0?I/A.medianFinal*100:0;_+='<div class="card" style="margin-top:20px;border-color:var(--success);">',_+='<h3 style="color:var(--success);margin-top:0;">Better Allocation Found</h3>',_+='<p style="color:var(--text-muted);margin-bottom:16px;">A different fund split could improve your success rate without increasing protection usage:</p>',_+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">',_+='<div style="padding:16px;background:rgba(0,0,0,0.2);border-radius:8px;">',_+='<div style="font-weight:500;margin-bottom:12px;color:var(--text-muted);">Your Current Split</div>',_+='<div style="font-size:24px;font-weight:600;color:var(--warning);">'+A.rate.toFixed(1)+"%</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate</div>',_+='<div style="font-size:13px;">Equity: '+H(A.equity)+" ("+Math.round(A.equity/m*100)+"%)</div>",_+='<div style="font-size:13px;">Bonds: '+H(A.bond)+" ("+Math.round(A.bond/m*100)+"%)</div>",_+='<div style="font-size:13px;">Cash: '+H(A.cash)+" ("+Math.round(A.cash/m*100)+"%)</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+A.avgProt.toFixed(0)+" mo | Median final: "+H(A.medianFinal)+"</div>",_+="</div>",_+='<div style="padding:16px;background:rgba(46,160,67,0.1);border-radius:8px;border:1px solid var(--success);">',_+='<div style="font-weight:500;margin-bottom:12px;color:var(--success);">Optimised Split</div>',_+='<div style="font-size:24px;font-weight:600;color:var(--success);">'+T.rate.toFixed(1)+"%</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate (+'+(T.rate-A.rate).toFixed(1)+"%)</div>",_+='<div style="font-size:13px;">Equity: '+H(T.equity)+" ("+Math.round(T.equity/m*100)+"%)</div>",_+='<div style="font-size:13px;">Bonds: '+H(T.bond)+" ("+Math.round(T.bond/m*100)+"%)</div>",_+='<div style="font-size:13px;">Cash: '+H(T.cash)+" ("+Math.round(T.cash/m*100)+"%)</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+T.avgProt.toFixed(0)+" mo | Median final: "+H(T.medianFinal)+"</div>",_+="</div>",_+="</div>",I<0?(_+='<div class="alert alert-warning" style="margin-bottom:16px;">',_+="<strong>Trade-off:</strong> The optimised allocation has a "+Math.abs(S).toFixed(0)+"% lower median final value. ",_+="This is because it likely has less equity exposure. You gain safety but may sacrifice some upside.",_+="</div>"):I>0&&(_+='<div class="alert alert-info" style="margin-bottom:16px;">',_+="<strong>Bonus:</strong> The optimised allocation also has a "+S.toFixed(0)+"% higher median final value!",_+="</div>"),_+='<div class="alert alert-info" style="margin-bottom:16px;">',_+="<strong>To apply this allocation:</strong> Click the button below to update your Settings with these new fund minimums.",_+="</div>",_+='<button onclick="applyOptimisedAllocationUI('+T.equity+","+T.bond+","+T.cash+')" style="width:100%;">Apply Optimised Allocation to Settings</button>',_+="</div>"}else _+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',_+='<h3 style="color:var(--primary);margin-top:0;">Your Allocation is Already Optimal</h3>',_+='<p style="color:var(--text-muted);">We tested '+R.length+" different fund splits. Your current allocation achieves the best success rate ("+A.rate.toFixed(1)+"%) without increasing protection usage.</p>",_+='<p style="font-size:13px;color:var(--text-muted);">Your protection: '+A.avgProt.toFixed(0)+" months average</p>",_+="</div>";t.innerHTML=_}catch(T){console.error("Optimisation error:",T),t.innerHTML='<div class="alert alert-danger">Error: '+T.message+"</div>"}finally{Ta=!1,e&&(e.disabled=!1,e.textContent="Optimise Allocation")}},50)};window.applyOptimisedAllocationUI=async function(n,e,t){if(document.getElementById("ssEquityMin").value=n,document.getElementById("ssBondMin").value=e,document.getElementById("ssCashTarget").value=t,document.getElementById("dsEquityMin").value=n,document.getElementById("dsBondMin").value=e,document.getElementById("dsCashTarget").value=t,document.getElementById("mcEquity").value=n,document.getElementById("mcBond").value=e,document.getElementById("mcCash").value=t,document.getElementById("histEquity").value=n,document.getElementById("histBond").value=e,document.getElementById("histCash").value=t,document.getElementById("scenEquity").value=n,document.getElementById("scenBond").value=e,document.getElementById("scenCash").value=t,Ho(),ct())try{await Zl({equityMin:n,bondMin:e,cashTarget:t})}catch(r){console.error("Error saving optimised settings:",r)}showToast("Optimised allocation applied to settings and starting values. Scroll up to re-run.","success",4e3)};const aT={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function lT(n){if(!n||n.length===0)return"";const e=n.filter(i=>i.failed).sort((i,a)=>i.years-a.years),t=n.filter(i=>i.protMonths>0).sort((i,a)=>a.protMonths-i.protMonths),r=e.length>0?e.slice(0,5):t.slice(0,5);if(r.length===0)return"";let s=`
        <details style="margin-top: 24px;">
          <summary style="cursor: pointer; font-weight: 600; color: var(--danger); margin-bottom: 10px;">
            ${e.length>0?"Worst Periods (Failed)":"Worst Periods (Most Protection)"}
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
      `;return r.forEach(i=>{const a=i.startYear||i.seed,l=aT[a]||"-",c=i.failed?"danger":"success";s+=`
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
      `,s}function gp(n,e,t,r,s){const i=n.successRate>=90?"success":n.successRate>=80?"warning":"danger",a=r.replace("Results",""),l=n.survival||{},c=n.finalValue||{},d=n.protection||{};let f=`
        <div class="card">
          <h2>${t}</h2>

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
          ${r==="histResults"?lT(e):""}

          <!-- Result Summary -->
          <div class="alert ${i==="success"?"alert-success":i==="warning"?"alert-warning":"alert-danger"}" style="margin-top: 24px;">
            ${n.successRate>=90?"Excellent! Very high probability of success.":n.successRate>=80?"Good but some downside risk. Consider adjustments.":"Warning: Significant risk of depletion."}
          </div>
        </div>
      `;document.getElementById(r).innerHTML=f,setTimeout(()=>{const m=document.getElementById(`${a}ConeChart`),v=document.getElementById(`${a}TrajChart`),b=document.getElementById(`${a}HistChart`);m&&e&&e.length>0&&UE(m,e,{years:s,title:"Cone of Uncertainty (5th-95th Percentile)"}),v&&e&&e.length>0&&qE(v,e,{years:s,title:"Sample Trajectories (100 runs)"}),b&&e&&e.length>0&&jE(b,e,{title:"Protection Months Distribution"})},50)}function cT(n,e){let t='<div class="card"><h2>Scenario Analysis</h2>';t+=`
        <div class="chart-container" style="margin-bottom: 24px;">
          <canvas id="scenCompChart" width="900" height="400"></canvas>
        </div>
      `,t+='<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">';for(const[r,s]of Object.entries(n)){const i=s.result,a=i.failed?"danger":"success";t+=`
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
        `}t+="</div></div>",document.getElementById(e).innerHTML=t,setTimeout(()=>{const r=document.getElementById("scenCompChart");r&&n&&HE(r,n,{years:35,title:"Scenario Comparison"})},50)}async function lc(){Nt("Loading settings...");try{const n=await Dn();document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",ho("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,Ho()}catch(n){console.error("Error loading stress settings:",n)}finally{Lt()}}window.saveStressSettingsUI=async function(){if(!ct()){showToast("Please sign in to save settings","error");return}Nt("Saving settings...");try{await Zl({baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:+document.getElementById("ssEquityMin").value,bondMin:+document.getElementById("ssBondMin").value,cashTarget:+document.getElementById("ssCashTarget").value,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value}),showToast("Settings saved successfully","success")}catch(n){console.error("Error saving stress settings:",n),showToast("Error saving: "+n.message,"error")}finally{Lt()}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){Nt("Resetting settings...");try{await Wb(),await lc(),showToast("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),showToast("Error resetting: "+n.message,"error")}finally{Lt()}}};async function yp(){Nt("Loading settings...");try{const n=await lr();document.getElementById("dsEquityMin").value=n.equityMin||25e4,document.getElementById("dsBondMin").value=n.bondMin||2e5,document.getElementById("dsCashTarget").value=n.cashTarget||5e4,document.getElementById("dsDuration").value=n.duration||35,document.getElementById("dsBaseSalary").value=n.baseSalary||3e4,document.getElementById("dsProtectionFactor").value=n.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=n.recoveryBuffer||15e3,document.getElementById("dsConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("entryEquity").value=n.equityMin||25e4,document.getElementById("entryBond").value=n.bondMin||2e5,document.getElementById("entryCash").value=n.cashTarget||5e4,Ho()}catch(n){console.error("Error loading decision settings:",n)}finally{Lt()}}window.saveDecisionSettingsUI=async function(){if(!ct()){showToast("Please sign in to save settings","error");return}Nt("Saving settings...");try{await Kl({equityMin:+document.getElementById("dsEquityMin").value,bondMin:+document.getElementById("dsBondMin").value,cashTarget:+document.getElementById("dsCashTarget").value,duration:+document.getElementById("dsDuration").value,baseSalary:+document.getElementById("dsBaseSalary").value,spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value}),showToast("Settings saved successfully","success")}catch(n){console.error("Error saving decision settings:",n),showToast("Error saving: "+n.message,"error")}finally{Lt()}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){Nt("Resetting settings...");try{await Kl({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await yp(),showToast("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),showToast("Error resetting: "+n.message,"error")}finally{Lt()}}};window.showDrawdownScheduleUI=async function(){const n=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const t=await Dn();t.duration=e;const r=Gp(t,e,n);let s='<div class="card"><h2>Projected SIPP Drawdown Schedule</h2>';s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>BRL</th><th>Other</th><th>State</th><th>SIPP Draw</th><th>Tax</th><th>Net</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${H(i.brl)}</td>
            <td>${H(i.other)}</td>
            <td>${H(i.statePension)}</td>
            <td style="color: var(--primary); font-weight: 600;">${H(i.sippDraw)}</td>
            <td style="color: var(--danger);">-${H(i.tax)}</td>
            <td style="color: var(--success);">${H(i.netIncome)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=s}catch(t){console.error("Drawdown error:",t),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};window.showGlidepathUI=async function(){const n=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const t=await Dn();t.duration=e;const r=Qp(t,n);let s='<div class="card"><h2>Fund Glidepath (Inflation-Adjusted Minimums)</h2>';s+='<div class="alert alert-info" style="margin-bottom: 20px;">',s+="<strong>Glidepath Logic:</strong> Equity & Bond minimums inflate with CPI but deplete linearly to £0. Cash inflates only (maintains real value).",s+="</div>",s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>Cum Inflation</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Total Min</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${(i.cumulativeInflation*100-100).toFixed(1)}%</td>
            <td style="color: var(--success);">${H(i.equityMin)}</td>
            <td style="color: var(--info);">${H(i.bondMin)}</td>
            <td style="color: var(--warning);">${H(i.cashTarget)}</td>
            <td style="font-weight: 600;">${H(i.totalMin)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=s}catch(t){console.error("Glidepath error:",t),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};let ft=null,hn=[],xt="all";async function Ot(){const n=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),t=document.getElementById("historyYearFilter"),r=document.getElementById("deleteAllHistoryBtn"),s=document.getElementById("deleteYearBtn");if(!n||!e)return;if(n.innerHTML='<span class="loading">Loading...</span>',hn=await rs({sortDesc:!1,limit:500}),r&&(r.style.display=hn.length>0?"":"none"),s&&(s.style.display="none"),hn.length===0){n.innerHTML="",t&&(t.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const i=[...new Set(hn.map(d=>d.date.split("-")[0]))].sort().reverse();if(t){let d='<option value="all">All Years</option>';i.forEach(f=>{d+=`<option value="${f}">${f}</option>`}),t.innerHTML=d,t.value=xt}s&&(s.style.display=xt!=="all"&&hn.length>0?"":"none");const a=xt==="all"?hn:hn.filter(d=>d.date.startsWith(xt));if(a.length===0){n.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${xt}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let l="";a.forEach(d=>{const f=d.date===ft,m=["history-tab"];f&&m.push("active"),d.inProtection&&m.push("protection");const[v,b]=d.date.split("-").map(Number),T=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],A=xt==="all"?`${T[b-1]} ${v}`:T[b-1];l+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${d.date}')">${A}</button>`}),n.innerHTML=l;const c=document.getElementById("historyMobileSelector");if(c){let d="";a.forEach(f=>{const m=Qr(f.date),v=f.inProtection?" (Protection)":"";d+=`<option value="${f.date}">${m}${v}</option>`}),c.innerHTML=d}(!ft||!a.find(d=>d.date===ft))&&(ft=a[a.length-1].date),c&&(c.value=ft),vp(ft),setTimeout(()=>{const d=n.querySelector(".history-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(n){xt=n,ft=null,Ot()};function Qr(n){const[e,t]=n.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t-1]} ${e}`}function vp(n){const e=document.getElementById("historyDetail"),t=hn.find(d=>d.date===n);if(!t){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const r=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",s=t.isTaxEfficientYear!==!1&&t.mode==="Tax-Efficient",i=t.inProtection?"warning":s?"efficient":"inefficient",a=t.inProtection?`Protection${t.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:s?"Tax-Efficient":"Standard";let l=t.source||"Unknown";t.source==="Growth"&&(t.dEquity>0||t.dBond>0)?l=`Growth (Equity: ${r(t.dEquity||0)}, Bond: ${r(t.dBond||0)})`:t.source==="Cash"&&(l=`Cash (${r(t.dCash||t.sipp||0)})`);let c=`
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${Qr(t.date)}</h3>
              <div style="color:var(--text-muted);font-size:13px;">Tax Year ${t.taxYear} • Year ${t.yearNum||0}</div>
            </div>
            <span class="tax-mode-badge ${i}">${a}</span>
          </div>

          ${t.inProtection&&t.reason?`
            <div style="padding:12px;background:rgba(243,156,18,0.1);border-radius:8px;margin-bottom:16px;">
              <strong style="color:var(--warning);">Protection Reason:</strong>
              <span style="color:var(--text);">${t.reason}</span>
            </div>
          `:""}
        </div>

        <!-- Fund Balances -->
        <div class="history-detail-card">
          <h3>Fund Balances</h3>
          <div class="history-grid">
            <div class="history-field">
              <label>Equity</label>
              <span class="value">${r(t.equity)}</span>
            </div>
            <div class="history-field">
              <label>Bond</label>
              <span class="value">${r(t.bond)}</span>
            </div>
            <div class="history-field">
              <label>Cash</label>
              <span class="value">${r(t.cash)}</span>
            </div>
            <div class="history-field">
              <label>Total</label>
              <span class="value" style="color:var(--primary);">${r(t.total)}</span>
            </div>
          </div>

          <!-- Glidepath targets -->
          ${t.adjEquity||t.adjBond||t.adjCash?`
            <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">GLIDEPATH TARGETS</div>
              <div class="history-grid">
                <div class="history-field">
                  <label>Equity Min</label>
                  <span class="value">${r(t.adjEquity)}</span>
                </div>
                <div class="history-field">
                  <label>Bond Min</label>
                  <span class="value">${r(t.adjBond)}</span>
                </div>
                <div class="history-field">
                  <label>Cash Target</label>
                  <span class="value">${r(t.adjCash)}</span>
                </div>
                <div class="history-field">
                  <label>Surplus</label>
                  <span class="value ${(t.total||0)-(t.adjEquity||0)-(t.adjBond||0)-(t.adjCash||0)>=0?"success":"danger"}">
                    ${r((t.total||0)-(t.adjEquity||0)-(t.adjBond||0)-(t.adjCash||0))}
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
              <span class="value" style="color:var(--primary);">${r(t.sipp)}</span>
            </div>
            <div class="history-field">
              <label>ISA Top-up</label>
              <span class="value">${r(t.isa)}</span>
            </div>
            <div class="history-field">
              <label>Other Income</label>
              <span class="value">${r(t.other)}</span>
            </div>
            <div class="history-field">
              <label>State Pension</label>
              <span class="value">${r(t.state)}</span>
            </div>
          </div>

          <div style="margin-top:16px;padding:16px;background:var(--card-alt);border-radius:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:500;">Total Monthly Income</span>
              <span style="font-size:20px;font-weight:600;color:var(--success);">${r(t.monthlyNet)}</span>
            </div>
          </div>

          ${t.boostAmount>0?`
            <div style="margin-top:12px;padding:12px;background:rgba(46,204,113,0.1);border-radius:8px;">
              <strong style="color:var(--success);">Tax Boost:</strong>
              <span style="color:var(--success);">+${r(t.boostAmount)}</span>
              <span style="color:var(--text-muted);font-size:12px;">(Catch-up from protection periods)</span>
            </div>
          `:""}
        </div>

        <!-- ISA/Savings Allocation -->
        ${t.yearlyIsaSavingsAllocation>0?`
          <div class="history-detail-card">
            <h3>ISA/Savings Allocation</h3>
            <div class="history-grid">
              <div class="history-field">
                <label>Year Allocation</label>
                <span class="value">${r(t.yearlyIsaSavingsAllocation)}</span>
              </div>
              <div class="history-field">
                <label>Used This Month</label>
                <span class="value">${r(t.isaSavingsUsedThisMonth||t.isa)}</span>
              </div>
              <div class="history-field">
                <label>Cumulative Used</label>
                <span class="value">${r(t.cumulativeIsaSavingsUsed)}</span>
              </div>
              <div class="history-field">
                <label>Remaining</label>
                <span class="value ${(t.yearlyIsaSavingsAllocation||0)-(t.cumulativeIsaSavingsUsed||0)>0?"success":"warning"}">
                  ${r((t.yearlyIsaSavingsAllocation||0)-(t.cumulativeIsaSavingsUsed||0))}
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
              <span class="value">${r(t.pa)}</span>
            </div>
            <div class="history-field">
              <label>Basic Rate Limit</label>
              <span class="value">${r(t.brl)}</span>
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
                <td>${r(t.taxPaidMonthly||t.monthlyTax)}</td>
                <td>${r(t.taxPaidYTD)}</td>
                <td>${r(t.taxProjectedAnnual)}</td>
              </tr>
              ${t.taxSavedMonthly>0||t.taxSavedProjectedAnnual>0?`
                <tr>
                  <td class="source-name">Tax Saved</td>
                  <td class="net-col">-${r(t.taxSavedMonthly)}</td>
                  <td class="net-col">-${r(t.taxSavedYTD)}</td>
                  <td class="net-col">-${r(t.taxSavedProjectedAnnual)}</td>
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
            ${t.consecutiveDraws>0?`
              <div class="history-field">
                <label>Consecutive Cash Draws</label>
                <span class="value warning">${t.consecutiveDraws}</span>
              </div>
            `:""}
            <div class="history-field">
              <label>Remaining Months</label>
              <span class="value">${t.remainingMonths||12}</span>
            </div>
          </div>
        </div>

        <!-- Rebalancing -->
        ${t.rebal?`
          <div class="history-detail-card">
            <h3>Rebalancing Suggestions</h3>
            <div style="padding:12px;background:rgba(243,156,18,0.1);border-radius:8px;">
              ${t.rebal}
            </div>
          </div>
        `:""}

        <!-- Actions -->
        <div class="history-actions">
          <button class="btn secondary" onclick="deleteHistoryEntry('${t.date}')">Delete Entry</button>
        </div>
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===Qr(n))})}window.selectHistoryEntry=function(n){ft=n,vp(n);const e=document.getElementById("historyMobileSelector");e&&(e.value=n);const r=document.getElementById("historyTabs").querySelector(".history-tab.active");r&&r.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(n){const e=document.getElementById("historyTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function fo(n){const[e,t]=n.split("-").map(Number);return t>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function Ka(n){const e={};for(const r of n){const s=r.taxYear||fo(r.date);e[s]||(e[s]=0),e[s]+=r.isaSavingsUsedThisMonth||r.isa||0}for(const r of n)await Gf(r.date);const t=await Mn();for(const[r,s]of Object.entries(e))if(t[r]){const i=t[r].isaSavingsUsed||0,a=Math.max(0,i-s);await cr(r,{...t[r],isaSavingsUsed:a})}}window.deleteHistoryEntry=async function(n){if(!ct()){showToast("Please sign in to delete entries","error");return}const e=await rs({sortDesc:!1,limit:1e3}),t=fo(n),s=e.filter(c=>(c.taxYear||fo(c.date))===t).sort((c,d)=>c.date.localeCompare(d.date)),i=s.findIndex(c=>c.date===n);if(i===-1){showToast("Entry not found","error");return}const a=i===s.length-1,l=Qr(n);if(a){if(!confirm(`Delete entry for ${l}?`))return;Nt("Deleting entry...");try{await Ka([s[i]]),showToast(`Deleted ${l}`,"success"),ft=null,await Ot()}catch(c){console.error("Delete error:",c),showToast("Error deleting: "+c.message,"error")}finally{Lt()}}else{const c=s.slice(i),d=Qr(c[c.length-1].date);if(!confirm(`This will delete ${c.length} entries from ${l} to ${d} in tax year ${t}.

Continue?`))return;Nt(`Deleting ${c.length} entries...`);try{await Ka(c),showToast(`Deleted ${c.length} entries`,"success"),ft=null,await Ot()}catch(f){console.error("Delete error:",f),showToast("Error deleting: "+f.message,"error")}finally{Lt()}}};window.deleteHistoryForTaxYear=async function(n){if(!ct()){showToast("Please sign in to delete entries","error");return}const t=(await rs({sortDesc:!1,limit:1e3})).filter(r=>(r.taxYear||fo(r.date))===n);if(t.length===0){showToast(`No history entries for tax year ${n}`,"info");return}if(confirm(`Delete all ${t.length} history entries for tax year ${n}?`)){Nt(`Deleting tax year ${n}...`);try{await Ka(t);const r=await Mn();r[n]&&await cr(n,{...r[n],isaSavingsUsed:0}),showToast(`Deleted all entries for ${n}`,"success"),ft=null,await Ot()}catch(r){console.error("Delete error:",r),showToast("Error deleting: "+r.message,"error")}finally{Lt()}}};window.deleteHistoryForSelectedYear=async function(){if(xt==="all"){showToast("Select a specific year first","error");return}const n=`${parseInt(xt)%100}/${(parseInt(xt)+1)%100}`;await deleteHistoryForTaxYear(n)};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!ct()){showToast("Please sign in to delete entries","error");return}Nt("Deleting all history...");try{const n=await rs({limit:1e3});for(const t of n)await Gf(t.date);const e=await Mn();for(const[t,r]of Object.entries(e))r.isaSavingsUsed>0&&await cr(t,{...r,isaSavingsUsed:0});showToast(`Deleted ${n.length} entries`,"success"),ft=null,await Ot()}catch(n){console.error("Delete all error:",n),showToast("Error deleting: "+n.message,"error")}finally{Lt()}}};let jn=null;async function rr(){const n=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!n||!e)return;n.innerHTML='<span class="loading">Loading...</span>';const t=await Mn();await lr();const r=Object.keys(t).sort(),s=uT(),i=dT(r,s,40);let a="";i.forEach(d=>{const f=t[d],m=f&&f.yearSetupComplete,v=d===jn,b=["tax-year-tab"];v&&b.push("active"),m||b.push("not-setup"),a+=`<button class="${b.join(" ")}" onclick="selectTaxYear('${d}')">${d}</button>`}),n.innerHTML=a;const l=document.getElementById("taxYearMobileSelector");if(l){let d="";i.forEach(f=>{const m=t[f],b=m&&m.yearSetupComplete?f:`${f} (not set up)`;d+=`<option value="${f}">${b}</option>`}),l.innerHTML=d}if(!jn){const d=r.filter(f=>{var m;return(m=t[f])==null?void 0:m.yearSetupComplete});jn=d.length>0?d[d.length-1]:s}l&&(l.value=jn),await _p(jn,t);const c=n.querySelector(".tax-year-tab.active");c&&c.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function uT(){const n=new Date,e=n.getFullYear(),t=n.getMonth()+1;return t<4||t===4&&n.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function dT(n,e,t){const r=new Set(n),[s]=e.split("/").map(Number),i=s<50?2e3+s:1900+s;for(let a=0;a<t&&r.size<t;a++){const l=i+a,c=l+1;r.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(r).sort()}async function _p(n,e,t){var m,v,b,T,A,R,x,M,D,C,O,V,E,g;const r=document.getElementById("taxYearDetail"),s=e[n];if(!s||!s.yearSetupComplete){r.innerHTML=`
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
              <span class="value">${hT(s.startMonth||4)}</span>
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
                  <td class="net-col">${d((b=y.sipp)==null?void 0:b.net)}</td>
                </tr>
                ${((T=y.other)==null?void 0:T.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${d((A=y.other)==null?void 0:A.gross)}</td>
                  <td class="tax-col">-${d((R=y.other)==null?void 0:R.tax)}</td>
                  <td class="net-col">${d((x=y.other)==null?void 0:x.net)}</td>
                </tr>
                `:""}
                ${((M=y.statePension)==null?void 0:M.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${d((D=y.statePension)==null?void 0:D.gross)}</td>
                  <td class="tax-col">-${d((C=y.statePension)==null?void 0:C.tax)}</td>
                  <td class="net-col">${d((O=y.statePension)==null?void 0:O.net)}</td>
                </tr>
                `:""}
                ${((V=y.isa)==null?void 0:V.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${d((E=y.isa)==null?void 0:E.gross)}</td>
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
      `,r.innerHTML=f,document.querySelectorAll(".tax-year-tab").forEach(y=>{y.classList.toggle("active",y.textContent===n)})}window.selectTaxYear=async function(n){jn=n;const e=await Mn();await lr(),await _p(n,e),document.querySelectorAll(".tax-year-tab").forEach(i=>{i.classList.toggle("active",i.textContent===n)});const t=document.getElementById("taxYearMobileSelector");t&&(t.value=n);const s=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${n}')"]`);s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(n){const e=document.getElementById("taxYearTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function hT(n){return["January","February","March","April","May","June","July","August","September","October","November","December"][(n-1)%12]||"April"}window.triggerWizardForYear=async function(n){const[e]=n.split("/").map(Number),t=e<50?2e3+e:1900+e,r=`${t}-04`,s=document.getElementById("selectedMonth");s&&(s.value=r),document.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(i=>i.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(i=>i.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),showToast(`Please click "Calculate" with April ${t} selected to set up tax year ${n}`,"info",5e3)};window.reconfigureTaxYear=async function(n){if(confirm(`This will allow you to reconfigure tax year ${n}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await Fo(n);e.yearSetupComplete=!1,await cr(n,e),await rr(),showToast(`Tax year ${n} marked for reconfiguration. Calculate a decision for this year to run the wizard again.`,"success",5e3)}catch(e){console.error("Error:",e),showToast("Error: "+e.message,"error")}};window.updateTaxYear=async function(n,e,t){try{const r=await Fo(n);r[e]=parseFloat(t),await cr(n,r)}catch(r){console.error("Error updating tax year:",r),showToast("Error saving: "+r.message,"error")}};window.deleteTaxYear=async function(n){if(confirm("Delete tax year "+n+"? This will remove all configuration for this year."))try{const e=await Bt();delete e.taxYears[n],await Bo(e),jn=null,await rr()}catch(e){console.error("Error deleting tax year:",e),showToast("Error deleting: "+e.message,"error")}};window.addTaxYear=async function(){if(!ct()){showToast("Please sign in to add tax years","error");return}const n=prompt("Enter tax year (e.g., 25/26):");if(!n||!/^\d{2}\/\d{2}$/.test(n)){showToast("Invalid format. Use YY/YY (e.g., 25/26)","error");return}try{await cr(n,{}),await rr()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error")}};console.log("Pension Planner v"+_d+" loaded");
