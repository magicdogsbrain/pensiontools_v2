(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();function Sp(n){const t=(n.sippDraw||0)+(n.other||0)+(n.statePension||0),e=t*12,r=n.pa||12570,s=n.brl||50270,i=n.hrl||125140;let a=0;e>r&&(e<=s?a=(e-r)*.2:e<=i?a=(s-r)*.2+(e-s)*.4:a=(s-r)*.2+(i-s)*.4+(e-i)*.45);const l=a/12,c=t-l+(n.isaDraw||0);return{date:n.date,taxYear:n.taxYear,yearNum:n.yearNumber,equity:n.equity,bond:n.bond,cash:n.cash,total:n.equity+n.bond+n.cash,adjEquity:n.adjEquityMin,adjBond:n.adjBondMin,adjCash:n.adjCashTarget,source:n.source,dEquity:n.drawFromEquity||0,dBond:n.drawFromBond||0,dCash:n.drawFromCash||0,sipp:n.sippDraw,stdSipp:n.stdSipp||n.sippDraw,isa:n.isaDraw,other:n.other,state:n.statePension,pa:r,brl:s,monthlyTax:l,monthlyNet:c,mode:n.taxEfficient?"Tax-Efficient":"Standard",inProtection:n.inProtection,reason:n.protectionReason||"",consecutiveDraws:n.consecutiveCashDraws||0,boostAmount:n.boostAmount,boostEligible:n.boostEligible||!1,rebal:n.rebalanceActions?n.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:n.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:n.isaDraw||0,cumulativeIsaSavingsUsed:n.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxPaidYTD:n.taxPaidYTD||l,taxProjectedAnnual:n.taxProjectedAnnual||a,taxSavedMonthly:n.taxSavedMonthly||0,taxSavedYTD:n.taxSavedYTD||0,taxSavedProjectedAnnual:n.taxSavedProjectedAnnual||0,isTaxEfficientYear:n.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:n.protectionInducedTaxEfficiency||!1,remainingMonths:n.remainingMonths||12}}const mi={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},gd="6.0.0",ne={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},yd={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},Qt={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},Ho={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},_s={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},Fa={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},Ap={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},be={START_MONTH:4,START_DAY:6};function xp(n,t,e,r=ne.HIGHER_RATE_LIMIT){if(n<=0)return 0;let s=t;if(n>ne.PA_TAPER_THRESHOLD){const f=(n-ne.PA_TAPER_THRESHOLD)*ne.PA_TAPER_RATE;s=Math.max(0,t-f)}const i=Math.max(0,n-s),a=Math.max(0,e-s),l=r-e;let c=0;const d=Math.min(i,a);if(c+=d*ne.BASIC_RATE,i>a){const f=Math.min(i-a,l);c+=f*ne.HIGHER_RATE}if(i>a+l){const f=i-a-l;c+=f*ne.ADDITIONAL_RATE}return c}function za(n){const t=typeof n=="string"?new Date(n):n,e=t.getFullYear(),r=t.getMonth()+1,s=t.getDate();if(r<be.START_MONTH||r===be.START_MONTH&&s<be.START_DAY){const i=e-1;return`${String(i).slice(-2)}/${String(e).slice(-2)}`}return`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function Rp(n){const t=parseInt(n.split("/")[0]),e=t<50?2e3+t:1900+t;return new Date(e,be.START_MONTH-1,be.START_DAY)}function Pp(n){const t=parseInt(n.split("/")[1]),e=t<50?2e3+t:1900+t;return new Date(e,be.START_MONTH-1,be.START_DAY-1)}function Cp(){const n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function vd(n){const[t,e]=n.split("-").map(Number);return new Date(t,e-1,15)}function kp(n){const e=(typeof n=="string"?new Date(n):n).getMonth()+1;return e>=be.START_MONTH?12-(e-be.START_MONTH):be.START_MONTH-e}function Dp(n){const{baseSalary:t,cumulativeInflation:e,yearlyInflation:r=[],other:s=0,statePension:i=0,statePensionYear:a=12,yearNumber:l=0,pa:c,brl:d,hrl:f,taxMode:m="inflates"}=n,v=m==="frozen"?c:c*e,E=m==="frozen"?d:d*e,I=m==="frozen"?f:f*e,x=t*e,b=Mp(s,r),P=l>=a?i*e:0,D=b+P,N=Math.max(0,E-D),F=Math.max(0,x-D),V=Math.min(N,F);return{pa:v,brl:E,hrl:I,targetGross:x,other:b,statePension:P,fixedIncome:D,annualSippDraw:V,monthlySippDraw:V/12,sippPlusfixedAtBRL:N+D===E}}function Mp(n,t,e=yd.OTHER_INCOME_CAP){let r=n;for(const s of t)r*=1+Math.min(s,e);return r}function Np(n,t,e=.025){const r=[],s=[];for(let i=0;i<=t;i++){i>0&&s.push(e);const a=Math.pow(1+e,i),l=Dp({baseSalary:n.baseSalary,cumulativeInflation:a,yearlyInflation:[...s],other:n.other,statePension:n.statePension,statePensionYear:n.statePensionYear,yearNumber:i,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode}),c=l.annualSippDraw+l.other+l.statePension,d=xp(c,l.pa,l.brl,l.hrl);r.push({year:i,brl:l.brl,other:l.other,statePension:l.statePension,sippDraw:l.annualSippDraw,totalTaxable:c,tax:d,netIncome:c-d})}return r}function wr(n,t,e,r,s){if(s){const i=Math.max(0,1-t/e);return n*r*i}return n*r}function Lp(n,t,e){const r=wr(n.equityMin,t,n.duration,e,!0),s=wr(n.bondMin,t,n.duration,e,!0),i=wr(n.cashTarget,t,n.duration,e,!1);return{equity:r,bond:s,cash:i,totalGrowth:r+s,total:r+s+i}}function Vp(n,t=yd.ASSUMED_CPI){const e=[];for(let r=0;r<=n.duration;r++){const s=Math.pow(1+t,r),i=Lp(n,r,s);e.push({year:r,cumulativeInflation:s,equityMin:i.equity,bondMin:i.bond,cashTarget:i.cash,totalMin:i.total})}return e}const Op="modulepreload",Bp=function(n,t){return new URL(n,t).href},zc={},Uc=function(t,e,r){let s=Promise.resolve();if(e&&e.length>0){const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=Promise.allSettled(e.map(d=>{if(d=Bp(d,r),d in zc)return;zc[d]=!0;const f=d.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!r)for(let I=a.length-1;I>=0;I--){const x=a[I];if(x.href===d&&(!f||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const E=document.createElement("link");if(E.rel=f?"stylesheet":Op,f||(E.as="script"),E.crossOrigin="",E.href=d,c&&E.setAttribute("nonce",c),document.head.appendChild(E),f)return new Promise((I,x)=>{E.addEventListener("load",I),E.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return s.then(a=>{for(const l of a||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})};function Ua(n){let t=n;return function(){return t=Math.sin(t)*1e4,t-Math.floor(t)}}function ns(n,t,e){const r=e(),s=e(),i=Math.sqrt(-2*Math.log(r))*Math.cos(2*Math.PI*s);return n+t*i}function _d(n){const t=JSON.stringify(n);let e=0;for(let r=0;r<t.length;r++){const s=t.charCodeAt(r);e=(e<<5)-e+s,e=e&e}return e.toString(16)}var $c={};/**
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
 */const wd=function(n){const t=[];let e=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},Fp=function(n){const t=[];let e=0,r=0;for(;e<n.length;){const s=n[e++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[e++];t[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[e++],a=n[e++],l=n[e++],c=((s&7)<<18|(i&63)<<12|(a&63)<<6|l&63)-65536;t[r++]=String.fromCharCode(55296+(c>>10)),t[r++]=String.fromCharCode(56320+(c&1023))}else{const i=n[e++],a=n[e++];t[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return t.join("")},Ed={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,t){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,l=a?n[s+1]:0,c=s+2<n.length,d=c?n[s+2]:0,f=i>>2,m=(i&3)<<4|l>>4;let v=(l&15)<<2|d>>6,E=d&63;c||(E=64,a||(v=64)),r.push(e[f],e[m],e[v],e[E])}return r.join("")},encodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(n):this.encodeByteArray(wd(n),t)},decodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(n):Fp(this.decodeStringToByteArray(n,t))},decodeStringToByteArray(n,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=e[n.charAt(s++)],l=s<n.length?e[n.charAt(s)]:0;++s;const d=s<n.length?e[n.charAt(s)]:64;++s;const m=s<n.length?e[n.charAt(s)]:64;if(++s,i==null||l==null||d==null||m==null)throw new zp;const v=i<<2|l>>4;if(r.push(v),d!==64){const E=l<<4&240|d>>2;if(r.push(E),m!==64){const I=d<<6&192|m;r.push(I)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class zp extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Up=function(n){const t=wd(n);return Ed.encodeByteArray(t,!0)},Di=function(n){return Up(n).replace(/\./g,"")},bd=function(n){try{return Ed.decodeString(n,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
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
 */function $p(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const qp=()=>$p().__FIREBASE_DEFAULTS__,jp=()=>{if(typeof process>"u"||typeof $c>"u")return;const n=$c.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Hp=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=n&&bd(n[1]);return t&&JSON.parse(t)},Xi=()=>{try{return qp()||jp()||Hp()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Td=n=>{var t,e;return(e=(t=Xi())===null||t===void 0?void 0:t.emulatorHosts)===null||e===void 0?void 0:e[n]},Wp=n=>{const t=Td(n);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),r]:[t.substring(0,e),r]},Id=()=>{var n;return(n=Xi())===null||n===void 0?void 0:n.config},Sd=n=>{var t;return(t=Xi())===null||t===void 0?void 0:t[`_${n}`]};/**
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
 */class Yp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,r)=>{e?this.reject(e):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,r))}}}/**
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
 */function Gp(n,t){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},r=t||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Di(JSON.stringify(e)),Di(JSON.stringify(a)),""].join(".")}/**
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
 */function Yt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Kp(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Yt())}function Qp(){var n;const t=(n=Xi())===null||n===void 0?void 0:n.forceEnvironment;if(t==="node")return!0;if(t==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Jp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Xp(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Zp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function tm(){const n=Yt();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function em(){return!Qp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function nm(){try{return typeof indexedDB=="object"}catch{return!1}}function rm(){return new Promise((n,t)=>{try{let e=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{var i;t(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(e){t(e)}})}/**
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
 */const sm="FirebaseError";class Ye extends Error{constructor(t,e,r){super(e),this.code=t,this.customData=r,this.name=sm,Object.setPrototypeOf(this,Ye.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ks.prototype.create)}}class ks{constructor(t,e,r){this.service=t,this.serviceName=e,this.errors=r}create(t,...e){const r=e[0]||{},s=`${this.service}/${t}`,i=this.errors[t],a=i?im(i,r):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new Ye(s,l,r)}}function im(n,t){return n.replace(om,(e,r)=>{const s=t[r];return s!=null?String(s):`<${r}?>`})}const om=/\{\$([^}]+)}/g;function am(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}function Mi(n,t){if(n===t)return!0;const e=Object.keys(n),r=Object.keys(t);for(const s of e){if(!r.includes(s))return!1;const i=n[s],a=t[s];if(qc(i)&&qc(a)){if(!Mi(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!e.includes(s))return!1;return!0}function qc(n){return n!==null&&typeof n=="object"}/**
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
 */function Ds(n){const t=[];for(const[e,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function is(n){const t={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");t[decodeURIComponent(s)]=decodeURIComponent(i)}}),t}function os(n){const t=n.indexOf("?");if(!t)return"";const e=n.indexOf("#",t);return n.substring(t,e>0?e:void 0)}function lm(n,t){const e=new cm(n,t);return e.subscribe.bind(e)}class cm{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(r=>{this.error(r)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,r){let s;if(t===void 0&&e===void 0&&r===void 0)throw new Error("Missing Observer.");um(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:r},s.next===void 0&&(s.next=Wo),s.error===void 0&&(s.error=Wo),s.complete===void 0&&(s.complete=Wo);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function um(n,t){if(typeof n!="object"||n===null)return!1;for(const e of t)if(e in n&&typeof n[e]=="function")return!0;return!1}function Wo(){}/**
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
 */function Tt(n){return n&&n._delegate?n._delegate:n}class qn{constructor(t,e,r){this.name=t,this.instanceFactory=e,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
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
 */const Ln="[DEFAULT]";/**
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
 */class dm{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const r=new Yp;if(this.instancesDeferred.set(e,r),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){var e;const r=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),s=(e=t==null?void 0:t.optional)!==null&&e!==void 0?e:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(fm(t))try{this.getOrInitializeService({instanceIdentifier:Ln})}catch{}for(const[e,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(t=Ln){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Ln){return this.instances.has(t)}getOptions(t=Ln){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:e});for(const[i,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);r===l&&a.resolve(s)}return s}onInit(t,e){var r;const s=this.normalizeInstanceIdentifier(e),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(t),this.onInitCallbacks.set(s,i);const a=this.instances.get(s);return a&&t(a,s),()=>{i.delete(t)}}invokeOnInitCallbacks(t,e){const r=this.onInitCallbacks.get(e);if(r)for(const s of r)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:hm(t),options:e}),this.instances.set(t,r),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=Ln){return this.component?this.component.multipleInstances?t:Ln:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function hm(n){return n===Ln?void 0:n}function fm(n){return n.instantiationMode==="EAGER"}/**
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
 */class pm{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new dm(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var et;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(et||(et={}));const mm={debug:et.DEBUG,verbose:et.VERBOSE,info:et.INFO,warn:et.WARN,error:et.ERROR,silent:et.SILENT},gm=et.INFO,ym={[et.DEBUG]:"log",[et.VERBOSE]:"log",[et.INFO]:"info",[et.WARN]:"warn",[et.ERROR]:"error"},vm=(n,t,...e)=>{if(t<n.logLevel)return;const r=new Date().toISOString(),s=ym[t];if(s)console[s](`[${r}]  ${n.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class $a{constructor(t){this.name=t,this._logLevel=gm,this._logHandler=vm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in et))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?mm[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,et.DEBUG,...t),this._logHandler(this,et.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,et.VERBOSE,...t),this._logHandler(this,et.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,et.INFO,...t),this._logHandler(this,et.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,et.WARN,...t),this._logHandler(this,et.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,et.ERROR,...t),this._logHandler(this,et.ERROR,...t)}}const _m=(n,t)=>t.some(e=>n instanceof e);let jc,Hc;function wm(){return jc||(jc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Em(){return Hc||(Hc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ad=new WeakMap,ha=new WeakMap,xd=new WeakMap,Yo=new WeakMap,qa=new WeakMap;function bm(n){const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{e(pn(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",a)});return t.then(e=>{e instanceof IDBCursor&&Ad.set(e,n)}).catch(()=>{}),qa.set(t,n),t}function Tm(n){if(ha.has(n))return;const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{e(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});ha.set(n,t)}let fa={get(n,t,e){if(n instanceof IDBTransaction){if(t==="done")return ha.get(n);if(t==="objectStoreNames")return n.objectStoreNames||xd.get(n);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return pn(n[t])},set(n,t,e){return n[t]=e,!0},has(n,t){return n instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in n}};function Im(n){fa=n(fa)}function Sm(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const r=n.call(Go(this),t,...e);return xd.set(r,t.sort?t.sort():[t]),pn(r)}:Em().includes(n)?function(...t){return n.apply(Go(this),t),pn(Ad.get(this))}:function(...t){return pn(n.apply(Go(this),t))}}function Am(n){return typeof n=="function"?Sm(n):(n instanceof IDBTransaction&&Tm(n),_m(n,wm())?new Proxy(n,fa):n)}function pn(n){if(n instanceof IDBRequest)return bm(n);if(Yo.has(n))return Yo.get(n);const t=Am(n);return t!==n&&(Yo.set(n,t),qa.set(t,n)),t}const Go=n=>qa.get(n);function xm(n,t,{blocked:e,upgrade:r,blocking:s,terminated:i}={}){const a=indexedDB.open(n,t),l=pn(a);return r&&a.addEventListener("upgradeneeded",c=>{r(pn(a.result),c.oldVersion,c.newVersion,pn(a.transaction),c)}),e&&a.addEventListener("blocked",c=>e(c.oldVersion,c.newVersion,c)),l.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const Rm=["get","getKey","getAll","getAllKeys","count"],Pm=["put","add","delete","clear"],Ko=new Map;function Wc(n,t){if(!(n instanceof IDBDatabase&&!(t in n)&&typeof t=="string"))return;if(Ko.get(t))return Ko.get(t);const e=t.replace(/FromIndex$/,""),r=t!==e,s=Pm.includes(e);if(!(e in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Rm.includes(e)))return;const i=async function(a,...l){const c=this.transaction(a,s?"readwrite":"readonly");let d=c.store;return r&&(d=d.index(l.shift())),(await Promise.all([d[e](...l),s&&c.done]))[0]};return Ko.set(t,i),i}Im(n=>({...n,get:(t,e,r)=>Wc(t,e)||n.get(t,e,r),has:(t,e)=>!!Wc(t,e)||n.has(t,e)}));/**
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
 */class Cm{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(km(e)){const r=e.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(e=>e).join(" ")}}function km(n){const t=n.getComponent();return(t==null?void 0:t.type)==="VERSION"}const pa="@firebase/app",Yc="0.10.13";/**
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
 */const $e=new $a("@firebase/app"),Dm="@firebase/app-compat",Mm="@firebase/analytics-compat",Nm="@firebase/analytics",Lm="@firebase/app-check-compat",Vm="@firebase/app-check",Om="@firebase/auth",Bm="@firebase/auth-compat",Fm="@firebase/database",zm="@firebase/data-connect",Um="@firebase/database-compat",$m="@firebase/functions",qm="@firebase/functions-compat",jm="@firebase/installations",Hm="@firebase/installations-compat",Wm="@firebase/messaging",Ym="@firebase/messaging-compat",Gm="@firebase/performance",Km="@firebase/performance-compat",Qm="@firebase/remote-config",Jm="@firebase/remote-config-compat",Xm="@firebase/storage",Zm="@firebase/storage-compat",tg="@firebase/firestore",eg="@firebase/vertexai-preview",ng="@firebase/firestore-compat",rg="firebase",sg="10.14.1";/**
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
 */const ma="[DEFAULT]",ig={[pa]:"fire-core",[Dm]:"fire-core-compat",[Nm]:"fire-analytics",[Mm]:"fire-analytics-compat",[Vm]:"fire-app-check",[Lm]:"fire-app-check-compat",[Om]:"fire-auth",[Bm]:"fire-auth-compat",[Fm]:"fire-rtdb",[zm]:"fire-data-connect",[Um]:"fire-rtdb-compat",[$m]:"fire-fn",[qm]:"fire-fn-compat",[jm]:"fire-iid",[Hm]:"fire-iid-compat",[Wm]:"fire-fcm",[Ym]:"fire-fcm-compat",[Gm]:"fire-perf",[Km]:"fire-perf-compat",[Qm]:"fire-rc",[Jm]:"fire-rc-compat",[Xm]:"fire-gcs",[Zm]:"fire-gcs-compat",[tg]:"fire-fst",[ng]:"fire-fst-compat",[eg]:"fire-vertex","fire-js":"fire-js",[rg]:"fire-js-all"};/**
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
 */const Ni=new Map,og=new Map,ga=new Map;function Gc(n,t){try{n.container.addComponent(t)}catch(e){$e.debug(`Component ${t.name} failed to register with FirebaseApp ${n.name}`,e)}}function xr(n){const t=n.name;if(ga.has(t))return $e.debug(`There were multiple attempts to register component ${t}.`),!1;ga.set(t,n);for(const e of Ni.values())Gc(e,n);for(const e of og.values())Gc(e,n);return!0}function ja(n,t){const e=n.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),n.container.getProvider(t)}function he(n){return n.settings!==void 0}/**
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
 */const ag={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},mn=new ks("app","Firebase",ag);/**
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
 */class lg{constructor(t,e,r){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},e),this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new qn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw mn.create("app-deleted",{appName:this._name})}}/**
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
 */const Vr=sg;function Rd(n,t={}){let e=n;typeof t!="object"&&(t={name:t});const r=Object.assign({name:ma,automaticDataCollectionEnabled:!1},t),s=r.name;if(typeof s!="string"||!s)throw mn.create("bad-app-name",{appName:String(s)});if(e||(e=Id()),!e)throw mn.create("no-options");const i=Ni.get(s);if(i){if(Mi(e,i.options)&&Mi(r,i.config))return i;throw mn.create("duplicate-app",{appName:s})}const a=new pm(s);for(const c of ga.values())a.addComponent(c);const l=new lg(e,r,a);return Ni.set(s,l),l}function Pd(n=ma){const t=Ni.get(n);if(!t&&n===ma&&Id())return Rd();if(!t)throw mn.create("no-app",{appName:n});return t}function gn(n,t,e){var r;let s=(r=ig[n])!==null&&r!==void 0?r:n;e&&(s+=`-${e}`);const i=s.match(/\s|\//),a=t.match(/\s|\//);if(i||a){const l=[`Unable to register library "${s}" with version "${t}":`];i&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&a&&l.push("and"),a&&l.push(`version name "${t}" contains illegal characters (whitespace or "/")`),$e.warn(l.join(" "));return}xr(new qn(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}/**
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
 */const cg="firebase-heartbeat-database",ug=1,ws="firebase-heartbeat-store";let Qo=null;function Cd(){return Qo||(Qo=xm(cg,ug,{upgrade:(n,t)=>{switch(t){case 0:try{n.createObjectStore(ws)}catch(e){console.warn(e)}}}}).catch(n=>{throw mn.create("idb-open",{originalErrorMessage:n.message})})),Qo}async function dg(n){try{const e=(await Cd()).transaction(ws),r=await e.objectStore(ws).get(kd(n));return await e.done,r}catch(t){if(t instanceof Ye)$e.warn(t.message);else{const e=mn.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});$e.warn(e.message)}}}async function Kc(n,t){try{const r=(await Cd()).transaction(ws,"readwrite");await r.objectStore(ws).put(t,kd(n)),await r.done}catch(e){if(e instanceof Ye)$e.warn(e.message);else{const r=mn.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});$e.warn(r.message)}}}function kd(n){return`${n.name}!${n.options.appId}`}/**
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
 */const hg=1024,fg=30*24*60*60*1e3;class pg{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new gg(e),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,e;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Qc();return((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const l=new Date(a.date).valueOf();return Date.now()-l<=fg}),this._storage.overwrite(this._heartbeatsCache))}catch(r){$e.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=Qc(),{heartbeatsToSend:r,unsentEntries:s}=mg(this._heartbeatsCache.heartbeats),i=Di(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return $e.warn(e),""}}}function Qc(){return new Date().toISOString().substring(0,10)}function mg(n,t=hg){const e=[];let r=n.slice();for(const s of n){const i=e.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),Jc(e)>t){i.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),Jc(e)>t){e.pop();break}r=r.slice(1)}return{heartbeatsToSend:e,unsentEntries:r}}class gg{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return nm()?rm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await dg(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return Kc(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var e;if(await this._canUseIndexedDBPromise){const s=await this.read();return Kc(this.app,{lastSentHeartbeatDate:(e=t.lastSentHeartbeatDate)!==null&&e!==void 0?e:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...t.heartbeats]})}else return}}function Jc(n){return Di(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function yg(n){xr(new qn("platform-logger",t=>new Cm(t),"PRIVATE")),xr(new qn("heartbeat",t=>new pg(t),"PRIVATE")),gn(pa,Yc,n),gn(pa,Yc,"esm2017"),gn("fire-js","")}yg("");var vg="firebase",_g="10.14.1";/**
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
 */gn(vg,_g,"app");function Ha(n,t){var e={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.indexOf(r)<0&&(e[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)t.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(e[r[s]]=n[r[s]]);return e}function Dd(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const wg=Dd,Md=new ks("auth","Firebase",Dd());/**
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
 */const Li=new $a("@firebase/auth");function Eg(n,...t){Li.logLevel<=et.WARN&&Li.warn(`Auth (${Vr}): ${n}`,...t)}function Ei(n,...t){Li.logLevel<=et.ERROR&&Li.error(`Auth (${Vr}): ${n}`,...t)}/**
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
 */function ue(n,...t){throw Ya(n,...t)}function fe(n,...t){return Ya(n,...t)}function Wa(n,t,e){const r=Object.assign(Object.assign({},wg()),{[t]:e});return new ks("auth","Firebase",r).create(t,{appName:n.name})}function ze(n){return Wa(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function bg(n,t,e){const r=e;if(!(t instanceof r))throw r.name!==t.constructor.name&&ue(n,"argument-error"),Wa(n,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Ya(n,...t){if(typeof n!="string"){const e=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(e,...r)}return Md.create(n,...t)}function W(n,t,...e){if(!n)throw Ya(t,...e)}function Oe(n){const t="INTERNAL ASSERTION FAILED: "+n;throw Ei(t),new Error(t)}function qe(n,t){n||Oe(t)}/**
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
 */function ya(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Tg(){return Xc()==="http:"||Xc()==="https:"}function Xc(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function Ig(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Tg()||Xp()||"connection"in navigator)?navigator.onLine:!0}function Sg(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class Ms{constructor(t,e){this.shortDelay=t,this.longDelay=e,qe(e>t,"Short delay should be less than long delay!"),this.isMobile=Kp()||Zp()}get(){return Ig()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Ga(n,t){qe(n.emulator,"Emulator should always be set here");const{url:e}=n.emulator;return t?`${e}${t.startsWith("/")?t.slice(1):t}`:e}/**
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
 */class Nd{static initialize(t,e,r){this.fetchImpl=t,e&&(this.headersImpl=e),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Oe("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Oe("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Oe("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const Ag={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const xg=new Ms(3e4,6e4);function Ge(n,t){return n.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:n.tenantId}):t}async function Pe(n,t,e,r,s={}){return Ld(n,s,async()=>{let i={},a={};r&&(t==="GET"?a=r:i={body:JSON.stringify(r)});const l=Ds(Object.assign({key:n.config.apiKey},a)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:t,headers:c},i);return Jp()||(d.referrerPolicy="no-referrer"),Nd.fetch()(Vd(n,n.config.apiHost,e,l),d)})}async function Ld(n,t,e){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},Ag),t);try{const s=new Pg(n),i=await Promise.race([e(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw gi(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const l=i.ok?a.errorMessage:a.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw gi(n,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw gi(n,"email-already-in-use",a);if(c==="USER_DISABLED")throw gi(n,"user-disabled",a);const f=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Wa(n,f,d);ue(n,f)}}catch(s){if(s instanceof Ye)throw s;ue(n,"network-request-failed",{message:String(s)})}}async function Ns(n,t,e,r,s={}){const i=await Pe(n,t,e,r,s);return"mfaPendingCredential"in i&&ue(n,"multi-factor-auth-required",{_serverResponse:i}),i}function Vd(n,t,e,r){const s=`${t}${e}?${r}`;return n.config.emulator?Ga(n.config,s):`${n.config.apiScheme}://${s}`}function Rg(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Pg{constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((e,r)=>{this.timer=setTimeout(()=>r(fe(this.auth,"network-request-failed")),xg.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function gi(n,t,e){const r={appName:n.name};e.email&&(r.email=e.email),e.phoneNumber&&(r.phoneNumber=e.phoneNumber);const s=fe(n,t,r);return s.customData._tokenResponse=e,s}function Zc(n){return n!==void 0&&n.enterprise!==void 0}class Cg{constructor(t){if(this.siteKey="",this.recaptchaEnforcementState=[],t.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=t.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=t.recaptchaEnforcementState}getProviderEnforcementState(t){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const e of this.recaptchaEnforcementState)if(e.provider&&e.provider===t)return Rg(e.enforcementState);return null}isProviderEnabled(t){return this.getProviderEnforcementState(t)==="ENFORCE"||this.getProviderEnforcementState(t)==="AUDIT"}}async function kg(n,t){return Pe(n,"GET","/v2/recaptchaConfig",Ge(n,t))}/**
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
 */async function Dg(n,t){return Pe(n,"POST","/v1/accounts:delete",t)}async function Od(n,t){return Pe(n,"POST","/v1/accounts:lookup",t)}/**
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
 */function ds(n){if(n)try{const t=new Date(Number(n));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function Mg(n,t=!1){const e=Tt(n),r=await e.getIdToken(t),s=Ka(r);W(s&&s.exp&&s.auth_time&&s.iat,e.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:ds(Jo(s.auth_time)),issuedAtTime:ds(Jo(s.iat)),expirationTime:ds(Jo(s.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Jo(n){return Number(n)*1e3}function Ka(n){const[t,e,r]=n.split(".");if(t===void 0||e===void 0||r===void 0)return Ei("JWT malformed, contained fewer than 3 sections"),null;try{const s=bd(e);return s?JSON.parse(s):(Ei("Failed to decode base64 JWT payload"),null)}catch(s){return Ei("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function tu(n){const t=Ka(n);return W(t,"internal-error"),W(typeof t.exp<"u","internal-error"),W(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
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
 */async function Rr(n,t,e=!1){if(e)return t;try{return await t}catch(r){throw r instanceof Ye&&Ng(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Ng({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class Lg{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){var e;if(t){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((e=this.user.stsTokenManager.expirationTime)!==null&&e!==void 0?e:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(t=!1){if(!this.isRunning)return;const e=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},e)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){(t==null?void 0:t.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class va{constructor(t,e){this.createdAt=t,this.lastLoginAt=e,this._initializeTime()}_initializeTime(){this.lastSignInTime=ds(this.lastLoginAt),this.creationTime=ds(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Vi(n){var t;const e=n.auth,r=await n.getIdToken(),s=await Rr(n,Od(e,{idToken:r}));W(s==null?void 0:s.users.length,e,"internal-error");const i=s.users[0];n._notifyReloadListener(i);const a=!((t=i.providerUserInfo)===null||t===void 0)&&t.length?Bd(i.providerUserInfo):[],l=Og(n.providerData,a),c=n.isAnonymous,d=!(n.email&&i.passwordHash)&&!(l!=null&&l.length),f=c?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new va(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function Vg(n){const t=Tt(n);await Vi(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function Og(n,t){return[...n.filter(r=>!t.some(s=>s.providerId===r.providerId)),...t]}function Bd(n){return n.map(t=>{var{providerId:e}=t,r=Ha(t,["providerId"]);return{providerId:e,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
 */async function Bg(n,t){const e=await Ld(n,{},async()=>{const r=Ds({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=Vd(n,s,"/v1/token",`key=${i}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Nd.fetch()(a,{method:"POST",headers:l,body:r})});return{accessToken:e.access_token,expiresIn:e.expires_in,refreshToken:e.refresh_token}}async function Fg(n,t){return Pe(n,"POST","/v2/accounts:revokeToken",Ge(n,t))}/**
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
 */class Er{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){W(t.idToken,"internal-error"),W(typeof t.idToken<"u","internal-error"),W(typeof t.refreshToken<"u","internal-error");const e="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):tu(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,e)}updateFromIdToken(t){W(t.length!==0,"internal-error");const e=tu(t);this.updateTokensAndExpiration(t,null,e)}async getToken(t,e=!1){return!e&&this.accessToken&&!this.isExpired?this.accessToken:(W(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,e){const{accessToken:r,refreshToken:s,expiresIn:i}=await Bg(t,e);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(t,e,r){this.refreshToken=e||null,this.accessToken=t||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(t,e){const{refreshToken:r,accessToken:s,expirationTime:i}=e,a=new Er;return r&&(W(typeof r=="string","internal-error",{appName:t}),a.refreshToken=r),s&&(W(typeof s=="string","internal-error",{appName:t}),a.accessToken=s),i&&(W(typeof i=="number","internal-error",{appName:t}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new Er,this.toJSON())}_performRefresh(){return Oe("not implemented")}}/**
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
 */function rn(n,t){W(typeof n=="string"||typeof n>"u","internal-error",{appName:t})}class Be{constructor(t){var{uid:e,auth:r,stsTokenManager:s}=t,i=Ha(t,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Lg(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new va(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(t){const e=await Rr(this,this.stsTokenManager.getToken(this.auth,t));return W(e,this.auth,"internal-error"),this.accessToken!==e&&(this.accessToken=e,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),e}getIdTokenResult(t){return Mg(this,t)}reload(){return Vg(this)}_assign(t){this!==t&&(W(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(e=>Object.assign({},e)),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const e=new Be(Object.assign(Object.assign({},this),{auth:t,stsTokenManager:this.stsTokenManager._clone()}));return e.metadata._copy(this.metadata),e}_onReload(t){W(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,e=!1){let r=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),r=!0),e&&await Vi(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(he(this.auth.app))return Promise.reject(ze(this.auth));const t=await this.getIdToken();return await Rr(this,Dg(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>Object.assign({},t)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,e){var r,s,i,a,l,c,d,f;const m=(r=e.displayName)!==null&&r!==void 0?r:void 0,v=(s=e.email)!==null&&s!==void 0?s:void 0,E=(i=e.phoneNumber)!==null&&i!==void 0?i:void 0,I=(a=e.photoURL)!==null&&a!==void 0?a:void 0,x=(l=e.tenantId)!==null&&l!==void 0?l:void 0,b=(c=e._redirectEventId)!==null&&c!==void 0?c:void 0,P=(d=e.createdAt)!==null&&d!==void 0?d:void 0,D=(f=e.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:C,emailVerified:N,isAnonymous:F,providerData:V,stsTokenManager:T}=e;W(C&&T,t,"internal-error");const g=Er.fromJSON(this.name,T);W(typeof C=="string",t,"internal-error"),rn(m,t.name),rn(v,t.name),W(typeof N=="boolean",t,"internal-error"),W(typeof F=="boolean",t,"internal-error"),rn(E,t.name),rn(I,t.name),rn(x,t.name),rn(b,t.name),rn(P,t.name),rn(D,t.name);const y=new Be({uid:C,auth:t,email:v,emailVerified:N,displayName:m,isAnonymous:F,photoURL:I,phoneNumber:E,tenantId:x,stsTokenManager:g,createdAt:P,lastLoginAt:D});return V&&Array.isArray(V)&&(y.providerData=V.map(w=>Object.assign({},w))),b&&(y._redirectEventId=b),y}static async _fromIdTokenResponse(t,e,r=!1){const s=new Er;s.updateFromServerResponse(e);const i=new Be({uid:e.localId,auth:t,stsTokenManager:s,isAnonymous:r});return await Vi(i),i}static async _fromGetAccountInfoResponse(t,e,r){const s=e.users[0];W(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?Bd(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),l=new Er;l.updateFromIdToken(r);const c=new Be({uid:s.localId,auth:t,stsTokenManager:l,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new va(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
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
 */const eu=new Map;function Fe(n){qe(n instanceof Function,"Expected a class definition");let t=eu.get(n);return t?(qe(t instanceof n,"Instance stored in cache mismatched with class"),t):(t=new n,eu.set(n,t),t)}/**
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
 */class Fd{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,e){this.storage[t]=e}async _get(t){const e=this.storage[t];return e===void 0?null:e}async _remove(t){delete this.storage[t]}_addListener(t,e){}_removeListener(t,e){}}Fd.type="NONE";const nu=Fd;/**
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
 */function bi(n,t,e){return`firebase:${n}:${t}:${e}`}class br{constructor(t,e,r){this.persistence=t,this.auth=e,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=bi(this.userKey,s.apiKey,i),this.fullPersistenceKey=bi("persistence",s.apiKey,i),this.boundEventHandler=e._onStorageEvent.bind(e),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);return t?Be._fromJSON(this.auth,t):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const e=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,e)return this.setCurrentUser(e)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,e,r="authUser"){if(!e.length)return new br(Fe(nu),t,r);const s=(await Promise.all(e.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=s[0]||Fe(nu);const a=bi(r,t.config.apiKey,t.name);let l=null;for(const d of e)try{const f=await d._get(a);if(f){const m=Be._fromJSON(t,f);d!==i&&(l=m),i=d;break}}catch{}const c=s.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new br(i,t,r):(i=c[0],l&&await i._set(a,l.toJSON()),await Promise.all(e.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new br(i,t,r))}}/**
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
 */function ru(n){const t=n.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(qd(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(zd(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Hd(t))return"Blackberry";if(Wd(t))return"Webos";if(Ud(t))return"Safari";if((t.includes("chrome/")||$d(t))&&!t.includes("edge/"))return"Chrome";if(jd(t))return"Android";{const e=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(e);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function zd(n=Yt()){return/firefox\//i.test(n)}function Ud(n=Yt()){const t=n.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function $d(n=Yt()){return/crios\//i.test(n)}function qd(n=Yt()){return/iemobile/i.test(n)}function jd(n=Yt()){return/android/i.test(n)}function Hd(n=Yt()){return/blackberry/i.test(n)}function Wd(n=Yt()){return/webos/i.test(n)}function Qa(n=Yt()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function zg(n=Yt()){var t;return Qa(n)&&!!(!((t=window.navigator)===null||t===void 0)&&t.standalone)}function Ug(){return tm()&&document.documentMode===10}function Yd(n=Yt()){return Qa(n)||jd(n)||Wd(n)||Hd(n)||/windows phone/i.test(n)||qd(n)}/**
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
 */function Gd(n,t=[]){let e;switch(n){case"Browser":e=ru(Yt());break;case"Worker":e=`${ru(Yt())}-${n}`;break;default:e=n}const r=t.length?t.join(","):"FirebaseCore-web";return`${e}/JsCore/${Vr}/${r}`}/**
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
 */class $g{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,e){const r=i=>new Promise((a,l)=>{try{const c=t(i);a(c)}catch(c){l(c)}});r.onAbort=e,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const e=[];try{for(const r of this.queue)await r(t),r.onAbort&&e.push(r.onAbort)}catch(r){e.reverse();for(const s of e)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function qg(n,t={}){return Pe(n,"GET","/v2/passwordPolicy",Ge(n,t))}/**
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
 */const jg=6;class Hg{constructor(t){var e,r,s,i;const a=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(e=a.minPasswordLength)!==null&&e!==void 0?e:jg,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=t.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=t.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=t.schemaVersion}validatePassword(t){var e,r,s,i,a,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,c),this.validatePasswordCharacterOptions(t,c),c.isValid&&(c.isValid=(e=c.meetsMinPasswordLength)!==null&&e!==void 0?e:!0),c.isValid&&(c.isValid=(r=c.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsLowercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(t,e){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(e.meetsMinPasswordLength=t.length>=r),s&&(e.meetsMaxPasswordLength=t.length<=s)}validatePasswordCharacterOptions(t,e){this.updatePasswordCharacterOptionsStatuses(e,!1,!1,!1,!1);let r;for(let s=0;s<t.length;s++)r=t.charAt(s),this.updatePasswordCharacterOptionsStatuses(e,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(t,e,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=e)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=i))}}/**
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
 */class Wg{constructor(t,e,r,s){this.app=t,this.heartbeatServiceProvider=e,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new su(this),this.idTokenSubscription=new su(this),this.beforeStateQueue=new $g(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Md,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(t,e){return e&&(this._popupRedirectResolver=Fe(e)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await br.create(this,t),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(e),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const e=await Od(this,{idToken:t}),r=await Be._fromGetAccountInfoResponse(this,e,t);await this.directlySetCurrentUser(r)}catch(e){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){var e;if(he(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(e=this.redirectUser)===null||e===void 0?void 0:e._redirectEventId,l=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(t);(!a||a===l)&&(c!=null&&c.user)&&(s=c.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return W(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(t){let e=null;try{e=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return e}async reloadAndSetCurrentUserOrClear(t){try{await Vi(t)}catch(e){if((e==null?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=Sg()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(he(this.app))return Promise.reject(ze(this));const e=t?Tt(t):null;return e&&W(e.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(e&&e._clone(this))}async _updateCurrentUser(t,e=!1){if(!this._deleted)return t&&W(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),e||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return he(this.app)?Promise.reject(ze(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return he(this.app)?Promise.reject(ze(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Fe(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const e=this._getPasswordPolicyInternal();return e.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):e.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await qg(this),e=new Hg(t);this.tenantId===null?this._projectPasswordPolicy=e:this._tenantPasswordPolicies[this.tenantId]=e}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(t){this._errorFactory=new ks("auth","Firebase",t())}onAuthStateChanged(t,e,r){return this.registerStateListener(this.authStateSubscription,t,e,r)}beforeAuthStateChanged(t,e){return this.beforeStateQueue.pushCallback(t,e)}onIdTokenChanged(t,e,r){return this.registerStateListener(this.idTokenSubscription,t,e,r)}authStateReady(){return new Promise((t,e)=>{if(this.currentUser)t();else{const r=this.onAuthStateChanged(()=>{r(),t()},e)}})}async revokeAccessToken(t){if(this.currentUser){const e=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:e};this.tenantId!=null&&(r.tenantId=this.tenantId),await Fg(this,r)}}toJSON(){var t;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(t=this._currentUser)===null||t===void 0?void 0:t.toJSON()}}async _setRedirectUser(t,e){const r=await this.getOrInitRedirectPersistenceManager(e);return t===null?r.removeCurrentUser():r.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const e=t&&Fe(t)||this._popupRedirectResolver;W(e,this,"argument-error"),this.redirectPersistenceManager=await br.create(this,[Fe(e._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){var e,r;return this._isInitialized&&await this.queue(async()=>{}),((e=this._currentUser)===null||e===void 0?void 0:e._redirectEventId)===t?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t,e;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(e=(t=this.currentUser)===null||t===void 0?void 0:t.uid)!==null&&e!==void 0?e:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,e,r,s){if(this._deleted)return()=>{};const i=typeof e=="function"?e:e.next.bind(e);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(W(l,this,"internal-error"),l.then(()=>{a||i(this.currentUser)}),typeof e=="function"){const c=t.addObserver(e,r,s);return()=>{a=!0,c()}}else{const c=t.addObserver(e);return()=>{a=!0,c()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return W(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=Gd(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var t;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const r=await((t=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getHeartbeatsHeader());r&&(e["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){var t;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getToken());return e!=null&&e.error&&Eg(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Ke(n){return Tt(n)}class su{constructor(t){this.auth=t,this.observer=null,this.addObserver=lm(e=>this.observer=e)}get next(){return W(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Zi={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Yg(n){Zi=n}function Kd(n){return Zi.loadJS(n)}function Gg(){return Zi.recaptchaEnterpriseScript}function Kg(){return Zi.gapiScript}function Qg(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const Jg="recaptcha-enterprise",Xg="NO_RECAPTCHA";class Zg{constructor(t){this.type=Jg,this.auth=Ke(t)}async verify(t="verify",e=!1){async function r(i){if(!e){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,l)=>{kg(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new Cg(c);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,a(d.siteKey)}}).catch(c=>{l(c)})})}function s(i,a,l){const c=window.grecaptcha;Zc(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:t}).then(d=>{a(d)}).catch(()=>{a(Xg)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,a)=>{r(this.auth).then(l=>{if(!e&&Zc(window.grecaptcha))s(l,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=Gg();c.length!==0&&(c+=l),Kd(c).then(()=>{s(l,i,a)}).catch(d=>{a(d)})}}).catch(l=>{a(l)})})}}async function iu(n,t,e,r=!1){const s=new Zg(n);let i;try{i=await s.verify(e)}catch{i=await s.verify(e,!0)}const a=Object.assign({},t);return r?Object.assign(a,{captchaResp:i}):Object.assign(a,{captchaResponse:i}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Oi(n,t,e,r){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await iu(n,t,e,e==="getOobCode");return r(n,i)}else return r(n,t).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${e} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await iu(n,t,e,e==="getOobCode");return r(n,a)}else return Promise.reject(i)})}/**
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
 */function ty(n,t){const e=ja(n,"auth");if(e.isInitialized()){const s=e.getImmediate(),i=e.getOptions();if(Mi(i,t??{}))return s;ue(s,"already-initialized")}return e.initialize({options:t})}function ey(n,t){const e=(t==null?void 0:t.persistence)||[],r=(Array.isArray(e)?e:[e]).map(Fe);t!=null&&t.errorMap&&n._updateErrorMap(t.errorMap),n._initializeWithPersistence(r,t==null?void 0:t.popupRedirectResolver)}function ny(n,t,e){const r=Ke(n);W(r._canInitEmulator,r,"emulator-config-failed"),W(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const s=!1,i=Qd(t),{host:a,port:l}=ry(t),c=l===null?"":`:${l}`;r.config.emulator={url:`${i}//${a}${c}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),sy()}function Qd(n){const t=n.indexOf(":");return t<0?"":n.substr(0,t+1)}function ry(n){const t=Qd(n),e=/(\/\/)?([^?#/]+)/.exec(n.substr(t.length));if(!e)return{host:"",port:null};const r=e[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:ou(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:ou(a)}}}function ou(n){if(!n)return null;const t=Number(n);return isNaN(t)?null:t}function sy(){function n(){const t=document.createElement("p"),e=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",e.position="fixed",e.width="100%",e.backgroundColor="#ffffff",e.border=".1em solid #000000",e.color="#b50000",e.bottom="0px",e.left="0px",e.margin="0px",e.zIndex="10000",e.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class Ja{constructor(t,e){this.providerId=t,this.signInMethod=e}toJSON(){return Oe("not implemented")}_getIdTokenResponse(t){return Oe("not implemented")}_linkToIdToken(t,e){return Oe("not implemented")}_getReauthenticationResolver(t){return Oe("not implemented")}}async function iy(n,t){return Pe(n,"POST","/v1/accounts:signUp",t)}/**
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
 */async function oy(n,t){return Ns(n,"POST","/v1/accounts:signInWithPassword",Ge(n,t))}async function ay(n,t){return Pe(n,"POST","/v1/accounts:sendOobCode",Ge(n,t))}async function ly(n,t){return ay(n,t)}/**
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
 */async function cy(n,t){return Ns(n,"POST","/v1/accounts:signInWithEmailLink",Ge(n,t))}async function uy(n,t){return Ns(n,"POST","/v1/accounts:signInWithEmailLink",Ge(n,t))}/**
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
 */class Es extends Ja{constructor(t,e,r,s=null){super("password",r),this._email=t,this._password=e,this._tenantId=s}static _fromEmailAndPassword(t,e){return new Es(t,e,"password")}static _fromEmailAndCode(t,e,r=null){return new Es(t,e,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t;if(e!=null&&e.email&&(e!=null&&e.password)){if(e.signInMethod==="password")return this._fromEmailAndPassword(e.email,e.password);if(e.signInMethod==="emailLink")return this._fromEmailAndCode(e.email,e.password,e.tenantId)}return null}async _getIdTokenResponse(t){switch(this.signInMethod){case"password":const e={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Oi(t,e,"signInWithPassword",oy);case"emailLink":return cy(t,{email:this._email,oobCode:this._password});default:ue(t,"internal-error")}}async _linkToIdToken(t,e){switch(this.signInMethod){case"password":const r={idToken:e,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Oi(t,r,"signUpPassword",iy);case"emailLink":return uy(t,{idToken:e,email:this._email,oobCode:this._password});default:ue(t,"internal-error")}}_getReauthenticationResolver(t){return this._getIdTokenResponse(t)}}/**
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
 */async function Tr(n,t){return Ns(n,"POST","/v1/accounts:signInWithIdp",Ge(n,t))}/**
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
 */const dy="http://localhost";class jn extends Ja{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const e=new jn(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(e.idToken=t.idToken),t.accessToken&&(e.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(e.nonce=t.nonce),t.pendingToken&&(e.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(e.accessToken=t.oauthToken,e.secret=t.oauthTokenSecret):ue("argument-error"),e}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t,{providerId:r,signInMethod:s}=e,i=Ha(e,["providerId","signInMethod"]);if(!r||!s)return null;const a=new jn(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(t){const e=this.buildRequest();return Tr(t,e)}_linkToIdToken(t,e){const r=this.buildRequest();return r.idToken=e,Tr(t,r)}_getReauthenticationResolver(t){const e=this.buildRequest();return e.autoCreate=!1,Tr(t,e)}buildRequest(){const t={requestUri:dy,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const e={};this.idToken&&(e.id_token=this.idToken),this.accessToken&&(e.access_token=this.accessToken),this.secret&&(e.oauth_token_secret=this.secret),e.providerId=this.providerId,this.nonce&&!this.pendingToken&&(e.nonce=this.nonce),t.postBody=Ds(e)}return t}}/**
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
 */function hy(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function fy(n){const t=is(os(n)).link,e=t?is(os(t)).deep_link_id:null,r=is(os(n)).deep_link_id;return(r?is(os(r)).link:null)||r||e||t||n}class Xa{constructor(t){var e,r,s,i,a,l;const c=is(os(t)),d=(e=c.apiKey)!==null&&e!==void 0?e:null,f=(r=c.oobCode)!==null&&r!==void 0?r:null,m=hy((s=c.mode)!==null&&s!==void 0?s:null);W(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(a=c.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(t){const e=fy(t);try{return new Xa(e)}catch{return null}}}/**
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
 */class Or{constructor(){this.providerId=Or.PROVIDER_ID}static credential(t,e){return Es._fromEmailAndPassword(t,e)}static credentialWithLink(t,e){const r=Xa.parseLink(e);return W(r,"argument-error"),Es._fromEmailAndCode(t,r.code,r.tenantId)}}Or.PROVIDER_ID="password";Or.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Or.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class Za{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Ls extends Za{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}/**
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
 */class ln extends Ls{constructor(){super("facebook.com")}static credential(t){return jn._fromParams({providerId:ln.PROVIDER_ID,signInMethod:ln.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return ln.credentialFromTaggedObject(t)}static credentialFromError(t){return ln.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return ln.credential(t.oauthAccessToken)}catch{return null}}}ln.FACEBOOK_SIGN_IN_METHOD="facebook.com";ln.PROVIDER_ID="facebook.com";/**
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
 */class Ve extends Ls{constructor(){super("google.com"),this.addScope("profile")}static credential(t,e){return jn._fromParams({providerId:Ve.PROVIDER_ID,signInMethod:Ve.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:e})}static credentialFromResult(t){return Ve.credentialFromTaggedObject(t)}static credentialFromError(t){return Ve.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:e,oauthAccessToken:r}=t;if(!e&&!r)return null;try{return Ve.credential(e,r)}catch{return null}}}Ve.GOOGLE_SIGN_IN_METHOD="google.com";Ve.PROVIDER_ID="google.com";/**
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
 */class cn extends Ls{constructor(){super("github.com")}static credential(t){return jn._fromParams({providerId:cn.PROVIDER_ID,signInMethod:cn.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return cn.credentialFromTaggedObject(t)}static credentialFromError(t){return cn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return cn.credential(t.oauthAccessToken)}catch{return null}}}cn.GITHUB_SIGN_IN_METHOD="github.com";cn.PROVIDER_ID="github.com";/**
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
 */class un extends Ls{constructor(){super("twitter.com")}static credential(t,e){return jn._fromParams({providerId:un.PROVIDER_ID,signInMethod:un.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:e})}static credentialFromResult(t){return un.credentialFromTaggedObject(t)}static credentialFromError(t){return un.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:e,oauthTokenSecret:r}=t;if(!e||!r)return null;try{return un.credential(e,r)}catch{return null}}}un.TWITTER_SIGN_IN_METHOD="twitter.com";un.PROVIDER_ID="twitter.com";/**
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
 */async function py(n,t){return Ns(n,"POST","/v1/accounts:signUp",Ge(n,t))}/**
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
 */class Hn{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,e,r,s=!1){const i=await Be._fromIdTokenResponse(t,r,s),a=au(r);return new Hn({user:i,providerId:a,_tokenResponse:r,operationType:e})}static async _forOperation(t,e,r){await t._updateTokensIfNecessary(r,!0);const s=au(r);return new Hn({user:t,providerId:s,_tokenResponse:r,operationType:e})}}function au(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class Bi extends Ye{constructor(t,e,r,s){var i;super(e.code,e.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Bi.prototype),this.customData={appName:t.name,tenantId:(i=t.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:e.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(t,e,r,s){return new Bi(t,e,r,s)}}function Jd(n,t,e,r){return(t==="reauthenticate"?e._getReauthenticationResolver(n):e._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Bi._fromErrorAndOperation(n,i,t,r):i})}async function my(n,t,e=!1){const r=await Rr(n,t._linkToIdToken(n.auth,await n.getIdToken()),e);return Hn._forOperation(n,"link",r)}/**
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
 */async function gy(n,t,e=!1){const{auth:r}=n;if(he(r.app))return Promise.reject(ze(r));const s="reauthenticate";try{const i=await Rr(n,Jd(r,s,t,n),e);W(i.idToken,r,"internal-error");const a=Ka(i.idToken);W(a,r,"internal-error");const{sub:l}=a;return W(n.uid===l,r,"user-mismatch"),Hn._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&ue(r,"user-mismatch"),i}}/**
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
 */async function Xd(n,t,e=!1){if(he(n.app))return Promise.reject(ze(n));const r="signIn",s=await Jd(n,r,t),i=await Hn._fromIdTokenResponse(n,r,s);return e||await n._updateCurrentUser(i.user),i}async function yy(n,t){return Xd(Ke(n),t)}/**
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
 */async function Zd(n){const t=Ke(n);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function vy(n,t,e){const r=Ke(n);await Oi(r,{requestType:"PASSWORD_RESET",email:t,clientType:"CLIENT_TYPE_WEB"},"getOobCode",ly)}async function _y(n,t,e){if(he(n.app))return Promise.reject(ze(n));const r=Ke(n),a=await Oi(r,{returnSecureToken:!0,email:t,password:e,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",py).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&Zd(n),c}),l=await Hn._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(l.user),l}function wy(n,t,e){return he(n.app)?Promise.reject(ze(n)):yy(Tt(n),Or.credential(t,e)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Zd(n),r})}/**
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
 */async function Ey(n,t){return Pe(n,"POST","/v1/accounts:update",t)}/**
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
 */async function by(n,{displayName:t,photoURL:e}){if(t===void 0&&e===void 0)return;const r=Tt(n),i={idToken:await r.getIdToken(),displayName:t,photoUrl:e,returnSecureToken:!0},a=await Rr(r,Ey(r.auth,i));r.displayName=a.displayName||null,r.photoURL=a.photoUrl||null;const l=r.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=r.displayName,l.photoURL=r.photoURL),await r._updateTokensIfNecessary(a)}function Ty(n,t,e,r){return Tt(n).onIdTokenChanged(t,e,r)}function Iy(n,t,e){return Tt(n).beforeAuthStateChanged(t,e)}function Sy(n,t,e,r){return Tt(n).onAuthStateChanged(t,e,r)}function Ay(n){return Tt(n).signOut()}const Fi="__sak";/**
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
 */class th{constructor(t,e){this.storageRetriever=t,this.type=e}_isAvailable(){try{return this.storage?(this.storage.setItem(Fi,"1"),this.storage.removeItem(Fi),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,e){return this.storage.setItem(t,JSON.stringify(e)),Promise.resolve()}_get(t){const e=this.storage.getItem(t);return Promise.resolve(e?JSON.parse(e):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const xy=1e3,Ry=10;class eh extends th{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,e)=>this.onStorageEvent(t,e),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Yd(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const e of Object.keys(this.listeners)){const r=this.storage.getItem(e),s=this.localCache[e];r!==s&&t(e,s,r)}}onStorageEvent(t,e=!1){if(!t.key){this.forAllChangedKeys((a,l,c)=>{this.notifyListeners(a,c)});return}const r=t.key;e?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!e&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);Ug()&&i!==t.newValue&&t.newValue!==t.oldValue?setTimeout(s,Ry):s()}notifyListeners(t,e){this.localCache[t]=e;const r=this.listeners[t];if(r)for(const s of Array.from(r))s(e&&JSON.parse(e))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,e,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:e,newValue:r}),!0)})},xy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,e){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,e){await super._set(t,e),this.localCache[t]=JSON.stringify(e)}async _get(t){const e=await super._get(t);return this.localCache[t]=JSON.stringify(e),e}async _remove(t){await super._remove(t),delete this.localCache[t]}}eh.type="LOCAL";const Py=eh;/**
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
 */class nh extends th{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,e){}_removeListener(t,e){}}nh.type="SESSION";const rh=nh;/**
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
 */function Cy(n){return Promise.all(n.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(e){return{fulfilled:!1,reason:e}}}))}/**
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
 */class to{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const e=this.receivers.find(s=>s.isListeningto(t));if(e)return e;const r=new to(t);return this.receivers.push(r),r}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const e=t,{eventId:r,eventType:s,data:i}=e.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;e.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const l=Array.from(a).map(async d=>d(e.origin,i)),c=await Cy(l);e.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:c})}_subscribe(t,e){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(e)}_unsubscribe(t,e){this.handlersMap[t]&&e&&this.handlersMap[t].delete(e),(!e||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}to.receivers=[];/**
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
 */function tl(n="",t=10){let e="";for(let r=0;r<t;r++)e+=Math.floor(Math.random()*10);return n+e}/**
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
 */class ky{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,e,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((l,c)=>{const d=tl("",20);s.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(m){const v=m;if(v.data.eventId===d)switch(v.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(v.data.response);break;default:clearTimeout(f),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:t,eventId:d,data:e},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function Te(){return window}function Dy(n){Te().location.href=n}/**
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
 */function sh(){return typeof Te().WorkerGlobalScope<"u"&&typeof Te().importScripts=="function"}async function My(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Ny(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function Ly(){return sh()?self:null}/**
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
 */const ih="firebaseLocalStorageDb",Vy=1,zi="firebaseLocalStorage",oh="fbase_key";class Vs{constructor(t){this.request=t}toPromise(){return new Promise((t,e)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{e(this.request.error)})})}}function eo(n,t){return n.transaction([zi],t?"readwrite":"readonly").objectStore(zi)}function Oy(){const n=indexedDB.deleteDatabase(ih);return new Vs(n).toPromise()}function _a(){const n=indexedDB.open(ih,Vy);return new Promise((t,e)=>{n.addEventListener("error",()=>{e(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(zi,{keyPath:oh})}catch(s){e(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(zi)?t(r):(r.close(),await Oy(),t(await _a()))})})}async function lu(n,t,e){const r=eo(n,!0).put({[oh]:t,value:e});return new Vs(r).toPromise()}async function By(n,t){const e=eo(n,!1).get(t),r=await new Vs(e).toPromise();return r===void 0?null:r.value}function cu(n,t){const e=eo(n,!0).delete(t);return new Vs(e).toPromise()}const Fy=800,zy=3;class ah{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await _a(),this.db)}async _withRetries(t){let e=0;for(;;)try{const r=await this._openDb();return await t(r)}catch(r){if(e++>zy)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return sh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=to._getInstance(Ly()),this.receiver._subscribe("keyChanged",async(t,e)=>({keyProcessed:(await this._poll()).includes(e.key)})),this.receiver._subscribe("ping",async(t,e)=>["keyChanged"])}async initializeSender(){var t,e;if(this.activeServiceWorker=await My(),!this.activeServiceWorker)return;this.sender=new ky(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((t=r[0])===null||t===void 0)&&t.fulfilled&&!((e=r[0])===null||e===void 0)&&e.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||Ny()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const t=await _a();return await lu(t,Fi,"1"),await cu(t,Fi),!0}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,e){return this._withPendingWrite(async()=>(await this._withRetries(r=>lu(r,t,e)),this.localCache[t]=e,this.notifyServiceWorker(t)))}async _get(t){const e=await this._withRetries(r=>By(r,t));return this.localCache[t]=e,e}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(e=>cu(e,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(s=>{const i=eo(s,!1).getAll();return new Vs(i).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const e=[],r=new Set;if(t.length!==0)for(const{fbase_key:s,value:i}of t)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),e.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),e.push(s));return e}notifyListeners(t,e){this.localCache[t]=e;const r=this.listeners[t];if(r)for(const s of Array.from(r))s(e)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Fy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,e){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}ah.type="LOCAL";const Uy=ah;new Ms(3e4,6e4);/**
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
 */function lh(n,t){return t?Fe(t):(W(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class el extends Ja{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return Tr(t,this._buildIdpRequest())}_linkToIdToken(t,e){return Tr(t,this._buildIdpRequest(e))}_getReauthenticationResolver(t){return Tr(t,this._buildIdpRequest())}_buildIdpRequest(t){const e={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(e.idToken=t),e}}function $y(n){return Xd(n.auth,new el(n),n.bypassAuthState)}function qy(n){const{auth:t,user:e}=n;return W(e,t,"internal-error"),gy(e,new el(n),n.bypassAuthState)}async function jy(n){const{auth:t,user:e}=n;return W(e,t,"internal-error"),my(e,new el(n),n.bypassAuthState)}/**
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
 */class ch{constructor(t,e,r,s,i=!1){this.auth=t,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(e)?e:[e]}execute(){return new Promise(async(t,e)=>{this.pendingPromise={resolve:t,reject:e};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(t){const{urlResponse:e,sessionId:r,postBody:s,tenantId:i,error:a,type:l}=t;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:e,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return $y;case"linkViaPopup":case"linkViaRedirect":return jy;case"reauthViaPopup":case"reauthViaRedirect":return qy;default:ue(this.auth,"internal-error")}}resolve(t){qe(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){qe(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Hy=new Ms(2e3,1e4);async function Wy(n,t,e){if(he(n.app))return Promise.reject(fe(n,"operation-not-supported-in-this-environment"));const r=Ke(n);bg(n,t,Za);const s=lh(r,e);return new On(r,"signInViaPopup",t,s).executeNotNull()}class On extends ch{constructor(t,e,r,s,i){super(t,e,s,i),this.provider=r,this.authWindow=null,this.pollId=null,On.currentPopupAction&&On.currentPopupAction.cancel(),On.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return W(t,this.auth,"internal-error"),t}async onExecution(){qe(this.filter.length===1,"Popup operations only handle one event");const t=tl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(fe(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var t;return((t=this.authWindow)===null||t===void 0?void 0:t.associatedEvent)||null}cancel(){this.reject(fe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,On.currentPopupAction=null}pollUserCancellation(){const t=()=>{var e,r;if(!((r=(e=this.authWindow)===null||e===void 0?void 0:e.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(fe(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,Hy.get())};t()}}On.currentPopupAction=null;/**
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
 */const Yy="pendingRedirect",Ti=new Map;class Gy extends ch{constructor(t,e,r=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],e,void 0,r),this.eventId=null}async execute(){let t=Ti.get(this.auth._key());if(!t){try{const r=await Ky(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(r)}catch(e){t=()=>Promise.reject(e)}Ti.set(this.auth._key(),t)}return this.bypassAuthState||Ti.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const e=await this.auth._redirectUserForId(t.eventId);if(e)return this.user=e,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Ky(n,t){const e=Xy(t),r=Jy(n);if(!await r._isAvailable())return!1;const s=await r._get(e)==="true";return await r._remove(e),s}function Qy(n,t){Ti.set(n._key(),t)}function Jy(n){return Fe(n._redirectPersistence)}function Xy(n){return bi(Yy,n.config.apiKey,n.name)}async function Zy(n,t,e=!1){if(he(n.app))return Promise.reject(ze(n));const r=Ke(n),s=lh(r,t),a=await new Gy(r,s,e).execute();return a&&!e&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,t)),a}/**
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
 */const tv=10*60*1e3;class ev{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let e=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(t,r)&&(e=!0,this.sendToConsumer(t,r),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!nv(t)||(this.hasHandledPotentialRedirect=!0,e||(this.queuedRedirectEvent=t,e=!0)),e}sendToConsumer(t,e){var r;if(t.error&&!uh(t)){const s=((r=t.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";e.onError(fe(this.auth,s))}else e.onAuthEvent(t)}isEventForConsumer(t,e){const r=e.eventId===null||!!t.eventId&&t.eventId===e.eventId;return e.filter.includes(t.type)&&r}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=tv&&this.cachedEventUids.clear(),this.cachedEventUids.has(uu(t))}saveEventToCache(t){this.cachedEventUids.add(uu(t)),this.lastProcessedEventTime=Date.now()}}function uu(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(t=>t).join("-")}function uh({type:n,error:t}){return n==="unknown"&&(t==null?void 0:t.code)==="auth/no-auth-event"}function nv(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return uh(n);default:return!1}}/**
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
 */async function rv(n,t={}){return Pe(n,"GET","/v1/projects",t)}/**
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
 */const sv=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,iv=/^https?/;async function ov(n){if(n.config.emulator)return;const{authorizedDomains:t}=await rv(n);for(const e of t)try{if(av(e))return}catch{}ue(n,"unauthorized-domain")}function av(n){const t=ya(),{protocol:e,hostname:r}=new URL(t);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?e==="chrome-extension:"&&n.replace("chrome-extension://","")===t.replace("chrome-extension://",""):e==="chrome-extension:"&&a.hostname===r}if(!iv.test(e))return!1;if(sv.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const lv=new Ms(3e4,6e4);function du(){const n=Te().___jsl;if(n!=null&&n.H){for(const t of Object.keys(n.H))if(n.H[t].r=n.H[t].r||[],n.H[t].L=n.H[t].L||[],n.H[t].r=[...n.H[t].L],n.CP)for(let e=0;e<n.CP.length;e++)n.CP[e]=null}}function cv(n){return new Promise((t,e)=>{var r,s,i;function a(){du(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{du(),e(fe(n,"network-request-failed"))},timeout:lv.get()})}if(!((s=(r=Te().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)t(gapi.iframes.getContext());else if(!((i=Te().gapi)===null||i===void 0)&&i.load)a();else{const l=Qg("iframefcb");return Te()[l]=()=>{gapi.load?a():e(fe(n,"network-request-failed"))},Kd(`${Kg()}?onload=${l}`).catch(c=>e(c))}}).catch(t=>{throw Ii=null,t})}let Ii=null;function uv(n){return Ii=Ii||cv(n),Ii}/**
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
 */const dv=new Ms(5e3,15e3),hv="__/auth/iframe",fv="emulator/auth/iframe",pv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},mv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function gv(n){const t=n.config;W(t.authDomain,n,"auth-domain-config-required");const e=t.emulator?Ga(t,fv):`https://${n.config.authDomain}/${hv}`,r={apiKey:t.apiKey,appName:n.name,v:Vr},s=mv.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${e}?${Ds(r).slice(1)}`}async function yv(n){const t=await uv(n),e=Te().gapi;return W(e,n,"internal-error"),t.open({where:document.body,url:gv(n),messageHandlersFilter:e.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:pv,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=fe(n,"network-request-failed"),l=Te().setTimeout(()=>{i(a)},dv.get());function c(){Te().clearTimeout(l),s(r)}r.ping(c).then(c,()=>{i(a)})}))}/**
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
 */const vv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},_v=500,wv=600,Ev="_blank",bv="http://localhost";class hu{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Tv(n,t,e,r=_v,s=wv){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const c=Object.assign(Object.assign({},vv),{width:r.toString(),height:s.toString(),top:i,left:a}),d=Yt().toLowerCase();e&&(l=$d(d)?Ev:e),zd(d)&&(t=t||bv,c.scrollbars="yes");const f=Object.entries(c).reduce((v,[E,I])=>`${v}${E}=${I},`,"");if(zg(d)&&l!=="_self")return Iv(t||"",l),new hu(null);const m=window.open(t||"",l,f);W(m,n,"popup-blocked");try{m.focus()}catch{}return new hu(m)}function Iv(n,t){const e=document.createElement("a");e.href=n,e.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),e.dispatchEvent(r)}/**
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
 */const Sv="__/auth/handler",Av="emulator/auth/handler",xv=encodeURIComponent("fac");async function fu(n,t,e,r,s,i){W(n.config.authDomain,n,"auth-domain-config-required"),W(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:e,redirectUrl:r,v:Vr,eventId:s};if(t instanceof Za){t.setDefaultLanguage(n.languageCode),a.providerId=t.providerId||"",am(t.getCustomParameters())||(a.customParameters=JSON.stringify(t.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(t instanceof Ls){const f=t.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),d=c?`#${xv}=${encodeURIComponent(c)}`:"";return`${Rv(n)}?${Ds(l).slice(1)}${d}`}function Rv({config:n}){return n.emulator?Ga(n,Av):`https://${n.authDomain}/${Sv}`}/**
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
 */const Xo="webStorageSupport";class Pv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=rh,this._completeRedirectFn=Zy,this._overrideRedirectResult=Qy}async _openPopup(t,e,r,s){var i;qe((i=this.eventManagers[t._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await fu(t,e,r,ya(),s);return Tv(t,a,tl())}async _openRedirect(t,e,r,s){await this._originValidation(t);const i=await fu(t,e,r,ya(),s);return Dy(i),new Promise(()=>{})}_initialize(t){const e=t._key();if(this.eventManagers[e]){const{manager:s,promise:i}=this.eventManagers[e];return s?Promise.resolve(s):(qe(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(t);return this.eventManagers[e]={promise:r},r.catch(()=>{delete this.eventManagers[e]}),r}async initAndGetManager(t){const e=await yv(t),r=new ev(t);return e.register("authEvent",s=>(W(s==null?void 0:s.authEvent,t,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:r},this.iframes[t._key()]=e,r}_isIframeWebStorageSupported(t,e){this.iframes[t._key()].send(Xo,{type:Xo},s=>{var i;const a=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[Xo];a!==void 0&&e(!!a),ue(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const e=t._key();return this.originValidationPromises[e]||(this.originValidationPromises[e]=ov(t)),this.originValidationPromises[e]}get _shouldInitProactively(){return Yd()||Ud()||Qa()}}const Cv=Pv;var pu="@firebase/auth",mu="1.7.9";/**
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
 */class kv{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){var t;return this.assertAuthConfigured(),((t=this.auth.currentUser)===null||t===void 0?void 0:t.uid)||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const e=this.auth.onIdTokenChanged(r=>{t((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(t,e),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const e=this.internalListeners.get(t);e&&(this.internalListeners.delete(t),e(),this.updateProactiveRefresh())}assertAuthConfigured(){W(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function Dv(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Mv(n){xr(new qn("auth",(t,{options:e})=>{const r=t.getProvider("app").getImmediate(),s=t.getProvider("heartbeat"),i=t.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=r.options;W(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Gd(n)},d=new Wg(r,s,i,c);return ey(d,e),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,r)=>{t.getProvider("auth-internal").initialize()})),xr(new qn("auth-internal",t=>{const e=Ke(t.getProvider("auth").getImmediate());return(r=>new kv(r))(e)},"PRIVATE").setInstantiationMode("EXPLICIT")),gn(pu,mu,Dv(n)),gn(pu,mu,"esm2017")}/**
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
 */const Nv=5*60,Lv=Sd("authIdTokenMaxAge")||Nv;let gu=null;const Vv=n=>async t=>{const e=t&&await t.getIdTokenResult(),r=e&&(new Date().getTime()-Date.parse(e.issuedAtTime))/1e3;if(r&&r>Lv)return;const s=e==null?void 0:e.token;gu!==s&&(gu=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Ov(n=Pd()){const t=ja(n,"auth");if(t.isInitialized())return t.getImmediate();const e=ty(n,{popupRedirectResolver:Cv,persistence:[Uy,Py,rh]}),r=Sd("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=Vv(i.toString());Iy(e,a,()=>a(e.currentUser)),Ty(e,l=>a(l))}}const s=Td("auth");return s&&ny(e,`http://${s}`),e}function Bv(){var n,t;return(t=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&t!==void 0?t:document}Yg({loadJS(n){return new Promise((t,e)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=t,r.onerror=s=>{const i=fe("internal-error");i.customData=s,e(i)},r.type="text/javascript",r.charset="UTF-8",Bv().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Mv("Browser");var yu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Fn,dh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(T,g){function y(){}y.prototype=g.prototype,T.D=g.prototype,T.prototype=new y,T.prototype.constructor=T,T.C=function(w,S,A){for(var _=Array(arguments.length-2),ot=2;ot<arguments.length;ot++)_[ot-2]=arguments[ot];return g.prototype[S].apply(w,_)}}function e(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(r,e),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,g,y){y||(y=0);var w=Array(16);if(typeof g=="string")for(var S=0;16>S;++S)w[S]=g.charCodeAt(y++)|g.charCodeAt(y++)<<8|g.charCodeAt(y++)<<16|g.charCodeAt(y++)<<24;else for(S=0;16>S;++S)w[S]=g[y++]|g[y++]<<8|g[y++]<<16|g[y++]<<24;g=T.g[0],y=T.g[1],S=T.g[2];var A=T.g[3],_=g+(A^y&(S^A))+w[0]+3614090360&4294967295;g=y+(_<<7&4294967295|_>>>25),_=A+(S^g&(y^S))+w[1]+3905402710&4294967295,A=g+(_<<12&4294967295|_>>>20),_=S+(y^A&(g^y))+w[2]+606105819&4294967295,S=A+(_<<17&4294967295|_>>>15),_=y+(g^S&(A^g))+w[3]+3250441966&4294967295,y=S+(_<<22&4294967295|_>>>10),_=g+(A^y&(S^A))+w[4]+4118548399&4294967295,g=y+(_<<7&4294967295|_>>>25),_=A+(S^g&(y^S))+w[5]+1200080426&4294967295,A=g+(_<<12&4294967295|_>>>20),_=S+(y^A&(g^y))+w[6]+2821735955&4294967295,S=A+(_<<17&4294967295|_>>>15),_=y+(g^S&(A^g))+w[7]+4249261313&4294967295,y=S+(_<<22&4294967295|_>>>10),_=g+(A^y&(S^A))+w[8]+1770035416&4294967295,g=y+(_<<7&4294967295|_>>>25),_=A+(S^g&(y^S))+w[9]+2336552879&4294967295,A=g+(_<<12&4294967295|_>>>20),_=S+(y^A&(g^y))+w[10]+4294925233&4294967295,S=A+(_<<17&4294967295|_>>>15),_=y+(g^S&(A^g))+w[11]+2304563134&4294967295,y=S+(_<<22&4294967295|_>>>10),_=g+(A^y&(S^A))+w[12]+1804603682&4294967295,g=y+(_<<7&4294967295|_>>>25),_=A+(S^g&(y^S))+w[13]+4254626195&4294967295,A=g+(_<<12&4294967295|_>>>20),_=S+(y^A&(g^y))+w[14]+2792965006&4294967295,S=A+(_<<17&4294967295|_>>>15),_=y+(g^S&(A^g))+w[15]+1236535329&4294967295,y=S+(_<<22&4294967295|_>>>10),_=g+(S^A&(y^S))+w[1]+4129170786&4294967295,g=y+(_<<5&4294967295|_>>>27),_=A+(y^S&(g^y))+w[6]+3225465664&4294967295,A=g+(_<<9&4294967295|_>>>23),_=S+(g^y&(A^g))+w[11]+643717713&4294967295,S=A+(_<<14&4294967295|_>>>18),_=y+(A^g&(S^A))+w[0]+3921069994&4294967295,y=S+(_<<20&4294967295|_>>>12),_=g+(S^A&(y^S))+w[5]+3593408605&4294967295,g=y+(_<<5&4294967295|_>>>27),_=A+(y^S&(g^y))+w[10]+38016083&4294967295,A=g+(_<<9&4294967295|_>>>23),_=S+(g^y&(A^g))+w[15]+3634488961&4294967295,S=A+(_<<14&4294967295|_>>>18),_=y+(A^g&(S^A))+w[4]+3889429448&4294967295,y=S+(_<<20&4294967295|_>>>12),_=g+(S^A&(y^S))+w[9]+568446438&4294967295,g=y+(_<<5&4294967295|_>>>27),_=A+(y^S&(g^y))+w[14]+3275163606&4294967295,A=g+(_<<9&4294967295|_>>>23),_=S+(g^y&(A^g))+w[3]+4107603335&4294967295,S=A+(_<<14&4294967295|_>>>18),_=y+(A^g&(S^A))+w[8]+1163531501&4294967295,y=S+(_<<20&4294967295|_>>>12),_=g+(S^A&(y^S))+w[13]+2850285829&4294967295,g=y+(_<<5&4294967295|_>>>27),_=A+(y^S&(g^y))+w[2]+4243563512&4294967295,A=g+(_<<9&4294967295|_>>>23),_=S+(g^y&(A^g))+w[7]+1735328473&4294967295,S=A+(_<<14&4294967295|_>>>18),_=y+(A^g&(S^A))+w[12]+2368359562&4294967295,y=S+(_<<20&4294967295|_>>>12),_=g+(y^S^A)+w[5]+4294588738&4294967295,g=y+(_<<4&4294967295|_>>>28),_=A+(g^y^S)+w[8]+2272392833&4294967295,A=g+(_<<11&4294967295|_>>>21),_=S+(A^g^y)+w[11]+1839030562&4294967295,S=A+(_<<16&4294967295|_>>>16),_=y+(S^A^g)+w[14]+4259657740&4294967295,y=S+(_<<23&4294967295|_>>>9),_=g+(y^S^A)+w[1]+2763975236&4294967295,g=y+(_<<4&4294967295|_>>>28),_=A+(g^y^S)+w[4]+1272893353&4294967295,A=g+(_<<11&4294967295|_>>>21),_=S+(A^g^y)+w[7]+4139469664&4294967295,S=A+(_<<16&4294967295|_>>>16),_=y+(S^A^g)+w[10]+3200236656&4294967295,y=S+(_<<23&4294967295|_>>>9),_=g+(y^S^A)+w[13]+681279174&4294967295,g=y+(_<<4&4294967295|_>>>28),_=A+(g^y^S)+w[0]+3936430074&4294967295,A=g+(_<<11&4294967295|_>>>21),_=S+(A^g^y)+w[3]+3572445317&4294967295,S=A+(_<<16&4294967295|_>>>16),_=y+(S^A^g)+w[6]+76029189&4294967295,y=S+(_<<23&4294967295|_>>>9),_=g+(y^S^A)+w[9]+3654602809&4294967295,g=y+(_<<4&4294967295|_>>>28),_=A+(g^y^S)+w[12]+3873151461&4294967295,A=g+(_<<11&4294967295|_>>>21),_=S+(A^g^y)+w[15]+530742520&4294967295,S=A+(_<<16&4294967295|_>>>16),_=y+(S^A^g)+w[2]+3299628645&4294967295,y=S+(_<<23&4294967295|_>>>9),_=g+(S^(y|~A))+w[0]+4096336452&4294967295,g=y+(_<<6&4294967295|_>>>26),_=A+(y^(g|~S))+w[7]+1126891415&4294967295,A=g+(_<<10&4294967295|_>>>22),_=S+(g^(A|~y))+w[14]+2878612391&4294967295,S=A+(_<<15&4294967295|_>>>17),_=y+(A^(S|~g))+w[5]+4237533241&4294967295,y=S+(_<<21&4294967295|_>>>11),_=g+(S^(y|~A))+w[12]+1700485571&4294967295,g=y+(_<<6&4294967295|_>>>26),_=A+(y^(g|~S))+w[3]+2399980690&4294967295,A=g+(_<<10&4294967295|_>>>22),_=S+(g^(A|~y))+w[10]+4293915773&4294967295,S=A+(_<<15&4294967295|_>>>17),_=y+(A^(S|~g))+w[1]+2240044497&4294967295,y=S+(_<<21&4294967295|_>>>11),_=g+(S^(y|~A))+w[8]+1873313359&4294967295,g=y+(_<<6&4294967295|_>>>26),_=A+(y^(g|~S))+w[15]+4264355552&4294967295,A=g+(_<<10&4294967295|_>>>22),_=S+(g^(A|~y))+w[6]+2734768916&4294967295,S=A+(_<<15&4294967295|_>>>17),_=y+(A^(S|~g))+w[13]+1309151649&4294967295,y=S+(_<<21&4294967295|_>>>11),_=g+(S^(y|~A))+w[4]+4149444226&4294967295,g=y+(_<<6&4294967295|_>>>26),_=A+(y^(g|~S))+w[11]+3174756917&4294967295,A=g+(_<<10&4294967295|_>>>22),_=S+(g^(A|~y))+w[2]+718787259&4294967295,S=A+(_<<15&4294967295|_>>>17),_=y+(A^(S|~g))+w[9]+3951481745&4294967295,T.g[0]=T.g[0]+g&4294967295,T.g[1]=T.g[1]+(S+(_<<21&4294967295|_>>>11))&4294967295,T.g[2]=T.g[2]+S&4294967295,T.g[3]=T.g[3]+A&4294967295}r.prototype.u=function(T,g){g===void 0&&(g=T.length);for(var y=g-this.blockSize,w=this.B,S=this.h,A=0;A<g;){if(S==0)for(;A<=y;)s(this,T,A),A+=this.blockSize;if(typeof T=="string"){for(;A<g;)if(w[S++]=T.charCodeAt(A++),S==this.blockSize){s(this,w),S=0;break}}else for(;A<g;)if(w[S++]=T[A++],S==this.blockSize){s(this,w),S=0;break}}this.h=S,this.o+=g},r.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var g=1;g<T.length-8;++g)T[g]=0;var y=8*this.o;for(g=T.length-8;g<T.length;++g)T[g]=y&255,y/=256;for(this.u(T),T=Array(16),g=y=0;4>g;++g)for(var w=0;32>w;w+=8)T[y++]=this.g[g]>>>w&255;return T};function i(T,g){var y=l;return Object.prototype.hasOwnProperty.call(y,T)?y[T]:y[T]=g(T)}function a(T,g){this.h=g;for(var y=[],w=!0,S=T.length-1;0<=S;S--){var A=T[S]|0;w&&A==g||(y[S]=A,w=!1)}this.g=y}var l={};function c(T){return-128<=T&&128>T?i(T,function(g){return new a([g|0],0>g?-1:0)}):new a([T|0],0>T?-1:0)}function d(T){if(isNaN(T)||!isFinite(T))return m;if(0>T)return b(d(-T));for(var g=[],y=1,w=0;T>=y;w++)g[w]=T/y|0,y*=4294967296;return new a(g,0)}function f(T,g){if(T.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(T.charAt(0)=="-")return b(f(T.substring(1),g));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(g,8)),w=m,S=0;S<T.length;S+=8){var A=Math.min(8,T.length-S),_=parseInt(T.substring(S,S+A),g);8>A?(A=d(Math.pow(g,A)),w=w.j(A).add(d(_))):(w=w.j(y),w=w.add(d(_)))}return w}var m=c(0),v=c(1),E=c(16777216);n=a.prototype,n.m=function(){if(x(this))return-b(this).m();for(var T=0,g=1,y=0;y<this.g.length;y++){var w=this.i(y);T+=(0<=w?w:4294967296+w)*g,g*=4294967296}return T},n.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(I(this))return"0";if(x(this))return"-"+b(this).toString(T);for(var g=d(Math.pow(T,6)),y=this,w="";;){var S=N(y,g).g;y=P(y,S.j(g));var A=((0<y.g.length?y.g[0]:y.h)>>>0).toString(T);if(y=S,I(y))return A+w;for(;6>A.length;)A="0"+A;w=A+w}},n.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function I(T){if(T.h!=0)return!1;for(var g=0;g<T.g.length;g++)if(T.g[g]!=0)return!1;return!0}function x(T){return T.h==-1}n.l=function(T){return T=P(this,T),x(T)?-1:I(T)?0:1};function b(T){for(var g=T.g.length,y=[],w=0;w<g;w++)y[w]=~T.g[w];return new a(y,~T.h).add(v)}n.abs=function(){return x(this)?b(this):this},n.add=function(T){for(var g=Math.max(this.g.length,T.g.length),y=[],w=0,S=0;S<=g;S++){var A=w+(this.i(S)&65535)+(T.i(S)&65535),_=(A>>>16)+(this.i(S)>>>16)+(T.i(S)>>>16);w=_>>>16,A&=65535,_&=65535,y[S]=_<<16|A}return new a(y,y[y.length-1]&-2147483648?-1:0)};function P(T,g){return T.add(b(g))}n.j=function(T){if(I(this)||I(T))return m;if(x(this))return x(T)?b(this).j(b(T)):b(b(this).j(T));if(x(T))return b(this.j(b(T)));if(0>this.l(E)&&0>T.l(E))return d(this.m()*T.m());for(var g=this.g.length+T.g.length,y=[],w=0;w<2*g;w++)y[w]=0;for(w=0;w<this.g.length;w++)for(var S=0;S<T.g.length;S++){var A=this.i(w)>>>16,_=this.i(w)&65535,ot=T.i(S)>>>16,X=T.i(S)&65535;y[2*w+2*S]+=_*X,D(y,2*w+2*S),y[2*w+2*S+1]+=A*X,D(y,2*w+2*S+1),y[2*w+2*S+1]+=_*ot,D(y,2*w+2*S+1),y[2*w+2*S+2]+=A*ot,D(y,2*w+2*S+2)}for(w=0;w<g;w++)y[w]=y[2*w+1]<<16|y[2*w];for(w=g;w<2*g;w++)y[w]=0;return new a(y,0)};function D(T,g){for(;(T[g]&65535)!=T[g];)T[g+1]+=T[g]>>>16,T[g]&=65535,g++}function C(T,g){this.g=T,this.h=g}function N(T,g){if(I(g))throw Error("division by zero");if(I(T))return new C(m,m);if(x(T))return g=N(b(T),g),new C(b(g.g),b(g.h));if(x(g))return g=N(T,b(g)),new C(b(g.g),g.h);if(30<T.g.length){if(x(T)||x(g))throw Error("slowDivide_ only works with positive integers.");for(var y=v,w=g;0>=w.l(T);)y=F(y),w=F(w);var S=V(y,1),A=V(w,1);for(w=V(w,2),y=V(y,2);!I(w);){var _=A.add(w);0>=_.l(T)&&(S=S.add(y),A=_),w=V(w,1),y=V(y,1)}return g=P(T,S.j(g)),new C(S,g)}for(S=m;0<=T.l(g);){for(y=Math.max(1,Math.floor(T.m()/g.m())),w=Math.ceil(Math.log(y)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),A=d(y),_=A.j(g);x(_)||0<_.l(T);)y-=w,A=d(y),_=A.j(g);I(A)&&(A=v),S=S.add(A),T=P(T,_)}return new C(S,T)}n.A=function(T){return N(this,T).h},n.and=function(T){for(var g=Math.max(this.g.length,T.g.length),y=[],w=0;w<g;w++)y[w]=this.i(w)&T.i(w);return new a(y,this.h&T.h)},n.or=function(T){for(var g=Math.max(this.g.length,T.g.length),y=[],w=0;w<g;w++)y[w]=this.i(w)|T.i(w);return new a(y,this.h|T.h)},n.xor=function(T){for(var g=Math.max(this.g.length,T.g.length),y=[],w=0;w<g;w++)y[w]=this.i(w)^T.i(w);return new a(y,this.h^T.h)};function F(T){for(var g=T.g.length+1,y=[],w=0;w<g;w++)y[w]=T.i(w)<<1|T.i(w-1)>>>31;return new a(y,T.h)}function V(T,g){var y=g>>5;g%=32;for(var w=T.g.length-y,S=[],A=0;A<w;A++)S[A]=0<g?T.i(A+y)>>>g|T.i(A+y+1)<<32-g:T.i(A+y);return new a(S,T.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,dh=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,Fn=a}).apply(typeof yu<"u"?yu:typeof self<"u"?self:typeof window<"u"?window:{});var yi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var hh,as,fh,Si,wa,ph,mh,gh;(function(){var n,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function e(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof yi=="object"&&yi];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=e(this);function s(o,u){if(u)t:{var h=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var R=o[p];if(!(R in h))break t;h=h[R]}o=o[o.length-1],p=h[o],u=u(p),u!=p&&u!=null&&t(h,o,{configurable:!0,writable:!0,value:u})}}function i(o,u){o instanceof String&&(o+="");var h=0,p=!1,R={next:function(){if(!p&&h<o.length){var k=h++;return{value:u(k,o[k]),done:!1}}return p=!0,{done:!0,value:void 0}}};return R[Symbol.iterator]=function(){return R},R}s("Array.prototype.values",function(o){return o||function(){return i(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function c(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function f(o,u,h){return o.call.apply(o.bind,arguments)}function m(o,u,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var R=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(R,p),o.apply(u,R)}}return function(){return o.apply(u,arguments)}}function v(o,u,h){return v=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,v.apply(null,arguments)}function E(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function I(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,R,k){for(var O=Array(arguments.length-2),lt=2;lt<arguments.length;lt++)O[lt-2]=arguments[lt];return u.prototype[R].apply(p,O)}}function x(o){const u=o.length;if(0<u){const h=Array(u);for(let p=0;p<u;p++)h[p]=o[p];return h}return[]}function b(o,u){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(c(p)){const R=o.length||0,k=p.length||0;o.length=R+k;for(let O=0;O<k;O++)o[R+O]=p[O]}else o.push(p)}}class P{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function D(o){return/^[\s\xa0]*$/.test(o)}function C(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function N(o){return N[" "](o),o}N[" "]=function(){};var F=C().indexOf("Gecko")!=-1&&!(C().toLowerCase().indexOf("webkit")!=-1&&C().indexOf("Edge")==-1)&&!(C().indexOf("Trident")!=-1||C().indexOf("MSIE")!=-1)&&C().indexOf("Edge")==-1;function V(o,u,h){for(const p in o)u.call(h,o[p],p,o)}function T(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function g(o){const u={};for(const h in o)u[h]=o[h];return u}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(o,u){let h,p;for(let R=1;R<arguments.length;R++){p=arguments[R];for(h in p)o[h]=p[h];for(let k=0;k<y.length;k++)h=y[k],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function S(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function A(o){l.setTimeout(()=>{throw o},0)}function _(){var o=ht;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class ot{constructor(){this.h=this.g=null}add(u,h){const p=X.get();p.set(u,h),this.h?this.h.next=p:this.g=p,this.h=p}}var X=new P(()=>new ct,o=>o.reset());class ct{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let Ft,mt=!1,ht=new ot,zt=()=>{const o=l.Promise.resolve(void 0);Ft=()=>{o.then(ft)}};var ft=()=>{for(var o;o=_();){try{o.h.call(o.g)}catch(h){A(h)}var u=X;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}mt=!1};function gt(){this.s=this.s,this.C=this.C}gt.prototype.s=!1,gt.prototype.ma=function(){this.s||(this.s=!0,this.N())},gt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function $(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}$.prototype.h=function(){this.defaultPrevented=!0};var vt=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};l.addEventListener("test",h,u),l.removeEventListener("test",h,u)}catch{}return o}();function Z(o,u){if($.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(F){t:{try{N(u.nodeName);var R=!0;break t}catch{}R=!1}R||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:it[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&Z.aa.h.call(this)}}I(Z,$);var it={2:"touch",3:"pen",4:"mouse"};Z.prototype.h=function(){Z.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var At="closure_listenable_"+(1e6*Math.random()|0),oe=0;function ae(o,u,h,p,R){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!p,this.ha=R,this.key=++oe,this.da=this.fa=!1}function xt(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function me(o){this.src=o,this.g={},this.h=0}me.prototype.add=function(o,u,h,p,R){var k=o.toString();o=this.g[k],o||(o=this.g[k]=[],this.h++);var O=er(o,u,p,R);return-1<O?(u=o[O],h||(u.fa=!1)):(u=new ae(u,this.src,k,!!p,R),u.fa=h,o.push(u)),u};function tr(o,u){var h=u.type;if(h in o.g){var p=o.g[h],R=Array.prototype.indexOf.call(p,u,void 0),k;(k=0<=R)&&Array.prototype.splice.call(p,R,1),k&&(xt(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function er(o,u,h,p){for(var R=0;R<o.length;++R){var k=o[R];if(!k.da&&k.listener==u&&k.capture==!!h&&k.ha==p)return R}return-1}var xn="closure_lm_"+(1e6*Math.random()|0),Rn={};function ge(o,u,h,p,R){if(Array.isArray(u)){for(var k=0;k<u.length;k++)ge(o,u[k],h,p,R);return null}return h=Hr(h),o&&o[At]?o.K(u,h,d(p)?!!p.capture:!1,R):nr(o,u,h,!1,p,R)}function nr(o,u,h,p,R,k){if(!u)throw Error("Invalid event type");var O=d(R)?!!R.capture:!!R,lt=ye(o);if(lt||(o[xn]=lt=new me(o)),h=lt.add(u,h,p,O,k),h.proxy)return h;if(p=rr(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)vt||(R=O),R===void 0&&(R=!1),o.addEventListener(u.toString(),p,R);else if(o.attachEvent)o.attachEvent(Qe(u.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function rr(){function o(h){return u.call(o.src,o.listener,h)}const u=Js;return o}function sr(o,u,h,p,R){if(Array.isArray(u))for(var k=0;k<u.length;k++)sr(o,u[k],h,p,R);else p=d(p)?!!p.capture:!!p,h=Hr(h),o&&o[At]?(o=o.i,u=String(u).toString(),u in o.g&&(k=o.g[u],h=er(k,h,p,R),-1<h&&(xt(k[h]),Array.prototype.splice.call(k,h,1),k.length==0&&(delete o.g[u],o.h--)))):o&&(o=ye(o))&&(u=o.g[u.toString()],o=-1,u&&(o=er(u,h,p,R)),(h=-1<o?u[o]:null)&&ir(h))}function ir(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[At])tr(u.i,o);else{var h=o.type,p=o.proxy;u.removeEventListener?u.removeEventListener(h,p,o.capture):u.detachEvent?u.detachEvent(Qe(h),p):u.addListener&&u.removeListener&&u.removeListener(p),(h=ye(u))?(tr(h,o),h.h==0&&(h.src=null,u[xn]=null)):xt(o)}}}function Qe(o){return o in Rn?Rn[o]:Rn[o]="on"+o}function Js(o,u){if(o.da)o=!0;else{u=new Z(u,this);var h=o.listener,p=o.ha||o.src;o.fa&&ir(o),o=h.call(p,u)}return o}function ye(o){return o=o[xn],o instanceof me?o:null}var ve="__closure_events_fn_"+(1e9*Math.random()>>>0);function Hr(o){return typeof o=="function"?o:(o[ve]||(o[ve]=function(u){return o.handleEvent(u)}),o[ve])}function Rt(){gt.call(this),this.i=new me(this),this.M=this,this.F=null}I(Rt,gt),Rt.prototype[At]=!0,Rt.prototype.removeEventListener=function(o,u,h,p){sr(this,o,u,h,p)};function Pt(o,u){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=u.type||u,typeof u=="string")u=new $(u,o);else if(u instanceof $)u.target=u.target||o;else{var R=u;u=new $(p,o),w(u,R)}if(R=!0,h)for(var k=h.length-1;0<=k;k--){var O=u.g=h[k];R=Je(O,p,!0,u)&&R}if(O=u.g=o,R=Je(O,p,!0,u)&&R,R=Je(O,p,!1,u)&&R,h)for(k=0;k<h.length;k++)O=u.g=h[k],R=Je(O,p,!1,u)&&R}Rt.prototype.N=function(){if(Rt.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],p=0;p<h.length;p++)xt(h[p]);delete o.g[u],o.h--}}this.F=null},Rt.prototype.K=function(o,u,h,p){return this.i.add(String(o),u,!1,h,p)},Rt.prototype.L=function(o,u,h,p){return this.i.add(String(o),u,!0,h,p)};function Je(o,u,h,p){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var R=!0,k=0;k<u.length;++k){var O=u[k];if(O&&!O.da&&O.capture==h){var lt=O.listener,Nt=O.ha||O.src;O.fa&&tr(o.i,O),R=lt.call(Nt,p)!==!1&&R}}return R&&!p.defaultPrevented}function Wr(o,u,h){if(typeof o=="function")h&&(o=v(o,h));else if(o&&typeof o.handleEvent=="function")o=v(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(o,u||0)}function Xs(o){o.g=Wr(()=>{o.g=null,o.i&&(o.i=!1,Xs(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class or extends gt{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Xs(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ce(o){gt.call(this),this.h=o,this.g={}}I(Ce,gt);var ar=[];function Zs(o){V(o.g,function(u,h){this.g.hasOwnProperty(h)&&ir(u)},o),o.g={}}Ce.prototype.N=function(){Ce.aa.N.call(this),Zs(this)},Ce.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var J=l.JSON.stringify,Ct=l.JSON.parse,Gt=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function Xe(){}Xe.prototype.h=null;function lr(o){return o.h||(o.h=o.i())}function Pn(){}var _e={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function we(){$.call(this,"d")}I(we,$);function te(){$.call(this,"c")}I(te,$);var Kt={},Yr=null;function cr(){return Yr=Yr||new Rt}Kt.La="serverreachability";function ti(o){$.call(this,Kt.La,o)}I(ti,$);function ke(o){const u=cr();Pt(u,new ti(u))}Kt.STAT_EVENT="statevent";function De(o,u){$.call(this,Kt.STAT_EVENT,o),this.stat=u}I(De,$);function _t(o){const u=cr();Pt(u,new De(u,o))}Kt.Ma="timingevent";function Cn(o,u){$.call(this,Kt.Ma,o),this.size=u}I(Cn,$);function Ze(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},u)}function Mt(){this.g=!0}Mt.prototype.xa=function(){this.g=!1};function kn(o,u,h,p,R,k){o.info(function(){if(o.g)if(k)for(var O="",lt=k.split("&"),Nt=0;Nt<lt.length;Nt++){var rt=lt[Nt].split("=");if(1<rt.length){var Ut=rt[0];rt=rt[1];var $t=Ut.split("_");O=2<=$t.length&&$t[1]=="type"?O+(Ut+"="+rt+"&"):O+(Ut+"=redacted&")}}else O=null;else O=k;return"XMLHTTP REQ ("+p+") [attempt "+R+"]: "+u+`
`+h+`
`+O})}function ur(o,u,h,p,R,k,O){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+R+"]: "+u+`
`+h+`
`+k+" "+O})}function Me(o,u,h,p){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+Do(o,h)+(p?" "+p:"")})}function ko(o,u){o.info(function(){return"TIMEOUT: "+u})}Mt.prototype.info=function(){};function Do(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var R=p[1];if(Array.isArray(R)&&!(1>R.length)){var k=R[0];if(k!="noop"&&k!="stop"&&k!="close")for(var O=1;O<R.length;O++)R[O]=""}}}}return J(h)}catch{return u}}var ei={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},ec={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Mo;function ni(){}I(ni,Xe),ni.prototype.g=function(){return new XMLHttpRequest},ni.prototype.i=function(){return{}},Mo=new ni;function tn(o,u,h,p){this.j=o,this.i=u,this.l=h,this.R=p||1,this.U=new Ce(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new nc}function nc(){this.i=null,this.g="",this.h=!1}var rc={},No={};function Lo(o,u,h){o.L=1,o.v=oi(Ne(u)),o.m=h,o.P=!0,sc(o,null)}function sc(o,u){o.F=Date.now(),ri(o),o.A=Ne(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),vc(h.i,"t",p),o.C=0,h=o.j.J,o.h=new nc,o.g=Vc(o.j,h?u:null,!o.m),0<o.O&&(o.M=new or(v(o.Y,o,o.g),o.O)),u=o.U,h=o.g,p=o.ca;var R="readystatechange";Array.isArray(R)||(R&&(ar[0]=R.toString()),R=ar);for(var k=0;k<R.length;k++){var O=ge(h,R[k],p||u.handleEvent,!1,u.h||u);if(!O)break;u.g[O.key]=O}u=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),ke(),kn(o.i,o.u,o.A,o.l,o.R,o.m)}tn.prototype.ca=function(o){o=o.target;const u=this.M;u&&Le(o)==3?u.j():this.Y(o)},tn.prototype.Y=function(o){try{if(o==this.g)t:{const $t=Le(this.g);var u=this.g.Ba();const fr=this.g.Z();if(!(3>$t)&&($t!=3||this.g&&(this.h.h||this.g.oa()||Sc(this.g)))){this.J||$t!=4||u==7||(u==8||0>=fr?ke(3):ke(2)),Vo(this);var h=this.g.Z();this.X=h;e:if(ic(this)){var p=Sc(this.g);o="";var R=p.length,k=Le(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Dn(this),Gr(this);var O="";break e}this.h.i=new l.TextDecoder}for(u=0;u<R;u++)this.h.h=!0,o+=this.h.i.decode(p[u],{stream:!(k&&u==R-1)});p.length=0,this.h.g+=o,this.C=0,O=this.h.g}else O=this.g.oa();if(this.o=h==200,ur(this.i,this.u,this.A,this.l,this.R,$t,h),this.o){if(this.T&&!this.K){e:{if(this.g){var lt,Nt=this.g;if((lt=Nt.g?Nt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!D(lt)){var rt=lt;break e}}rt=null}if(h=rt)Me(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Oo(this,h);else{this.o=!1,this.s=3,_t(12),Dn(this),Gr(this);break t}}if(this.P){h=!0;let de;for(;!this.J&&this.C<O.length;)if(de=op(this,O),de==No){$t==4&&(this.s=4,_t(14),h=!1),Me(this.i,this.l,null,"[Incomplete Response]");break}else if(de==rc){this.s=4,_t(15),Me(this.i,this.l,O,"[Invalid Chunk]"),h=!1;break}else Me(this.i,this.l,de,null),Oo(this,de);if(ic(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),$t!=4||O.length!=0||this.h.h||(this.s=1,_t(16),h=!1),this.o=this.o&&h,!h)Me(this.i,this.l,O,"[Invalid Chunked Response]"),Dn(this),Gr(this);else if(0<O.length&&!this.W){this.W=!0;var Ut=this.j;Ut.g==this&&Ut.ba&&!Ut.M&&(Ut.j.info("Great, no buffering proxy detected. Bytes received: "+O.length),qo(Ut),Ut.M=!0,_t(11))}}else Me(this.i,this.l,O,null),Oo(this,O);$t==4&&Dn(this),this.o&&!this.J&&($t==4?Dc(this.j,this):(this.o=!1,ri(this)))}else Tp(this.g),h==400&&0<O.indexOf("Unknown SID")?(this.s=3,_t(12)):(this.s=0,_t(13)),Dn(this),Gr(this)}}}catch{}finally{}};function ic(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function op(o,u){var h=o.C,p=u.indexOf(`
`,h);return p==-1?No:(h=Number(u.substring(h,p)),isNaN(h)?rc:(p+=1,p+h>u.length?No:(u=u.slice(p,p+h),o.C=p+h,u)))}tn.prototype.cancel=function(){this.J=!0,Dn(this)};function ri(o){o.S=Date.now()+o.I,oc(o,o.I)}function oc(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=Ze(v(o.ba,o),u)}function Vo(o){o.B&&(l.clearTimeout(o.B),o.B=null)}tn.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(ko(this.i,this.A),this.L!=2&&(ke(),_t(17)),Dn(this),this.s=2,Gr(this)):oc(this,this.S-o)};function Gr(o){o.j.G==0||o.J||Dc(o.j,o)}function Dn(o){Vo(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,Zs(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function Oo(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||Bo(h.h,o))){if(!o.K&&Bo(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(u)}catch{p=null}if(Array.isArray(p)&&p.length==3){var R=p;if(R[0]==0){t:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)hi(h),ui(h);else break t;$o(h),_t(18)}}else h.za=R[1],0<h.za-h.T&&37500>R[2]&&h.F&&h.v==0&&!h.C&&(h.C=Ze(v(h.Za,h),6e3));if(1>=cc(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Nn(h,11)}else if((o.K||h.g==o)&&hi(h),!D(u))for(R=h.Da.g.parse(u),u=0;u<R.length;u++){let rt=R[u];if(h.T=rt[0],rt=rt[1],h.G==2)if(rt[0]=="c"){h.K=rt[1],h.ia=rt[2];const Ut=rt[3];Ut!=null&&(h.la=Ut,h.j.info("VER="+h.la));const $t=rt[4];$t!=null&&(h.Aa=$t,h.j.info("SVER="+h.Aa));const fr=rt[5];fr!=null&&typeof fr=="number"&&0<fr&&(p=1.5*fr,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const de=o.g;if(de){const pi=de.g?de.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(pi){var k=p.h;k.g||pi.indexOf("spdy")==-1&&pi.indexOf("quic")==-1&&pi.indexOf("h2")==-1||(k.j=k.l,k.g=new Set,k.h&&(Fo(k,k.h),k.h=null))}if(p.D){const jo=de.g?de.g.getResponseHeader("X-HTTP-Session-Id"):null;jo&&(p.ya=jo,ut(p.I,p.D,jo))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var O=o;if(p.qa=Lc(p,p.J?p.ia:null,p.W),O.K){uc(p.h,O);var lt=O,Nt=p.L;Nt&&(lt.I=Nt),lt.B&&(Vo(lt),ri(lt)),p.g=O}else Cc(p);0<h.i.length&&di(h)}else rt[0]!="stop"&&rt[0]!="close"||Nn(h,7);else h.G==3&&(rt[0]=="stop"||rt[0]=="close"?rt[0]=="stop"?Nn(h,7):Uo(h):rt[0]!="noop"&&h.l&&h.l.ta(rt),h.v=0)}}ke(4)}catch{}}var ap=class{constructor(o,u){this.g=o,this.map=u}};function ac(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function lc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function cc(o){return o.h?1:o.g?o.g.size:0}function Bo(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function Fo(o,u){o.g?o.g.add(u):o.h=u}function uc(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}ac.prototype.cancel=function(){if(this.i=dc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function dc(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return x(o.i)}function lp(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var u=[],h=o.length,p=0;p<h;p++)u.push(o[p]);return u}u=[],h=0;for(p in o)u[h++]=o[p];return u}function cp(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const p in o)u[h++]=p;return u}}}function hc(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=cp(o),p=lp(o),R=p.length,k=0;k<R;k++)u.call(void 0,p[k],h&&h[k],o)}var fc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function up(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),R=null;if(0<=p){var k=o[h].substring(0,p);R=o[h].substring(p+1)}else k=o[h];u(k,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function Mn(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Mn){this.h=o.h,si(this,o.j),this.o=o.o,this.g=o.g,ii(this,o.s),this.l=o.l;var u=o.i,h=new Jr;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),pc(this,h),this.m=o.m}else o&&(u=String(o).match(fc))?(this.h=!1,si(this,u[1]||"",!0),this.o=Kr(u[2]||""),this.g=Kr(u[3]||"",!0),ii(this,u[4]),this.l=Kr(u[5]||"",!0),pc(this,u[6]||"",!0),this.m=Kr(u[7]||"")):(this.h=!1,this.i=new Jr(null,this.h))}Mn.prototype.toString=function(){var o=[],u=this.j;u&&o.push(Qr(u,mc,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(Qr(u,mc,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(Qr(h,h.charAt(0)=="/"?fp:hp,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",Qr(h,mp)),o.join("")};function Ne(o){return new Mn(o)}function si(o,u,h){o.j=h?Kr(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function ii(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function pc(o,u,h){u instanceof Jr?(o.i=u,gp(o.i,o.h)):(h||(u=Qr(u,pp)),o.i=new Jr(u,o.h))}function ut(o,u,h){o.i.set(u,h)}function oi(o){return ut(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function Kr(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Qr(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,dp),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function dp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var mc=/[#\/\?@]/g,hp=/[#\?:]/g,fp=/[#\?]/g,pp=/[#\?@]/g,mp=/#/g;function Jr(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function en(o){o.g||(o.g=new Map,o.h=0,o.i&&up(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=Jr.prototype,n.add=function(o,u){en(this),this.i=null,o=dr(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function gc(o,u){en(o),u=dr(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function yc(o,u){return en(o),u=dr(o,u),o.g.has(u)}n.forEach=function(o,u){en(this),this.g.forEach(function(h,p){h.forEach(function(R){o.call(u,R,p,this)},this)},this)},n.na=function(){en(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let p=0;p<u.length;p++){const R=o[p];for(let k=0;k<R.length;k++)h.push(u[p])}return h},n.V=function(o){en(this);let u=[];if(typeof o=="string")yc(this,o)&&(u=u.concat(this.g.get(dr(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},n.set=function(o,u){return en(this),this.i=null,o=dr(this,o),yc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function vc(o,u,h){gc(o,u),0<h.length&&(o.i=null,o.g.set(dr(o,u),x(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var p=u[h];const k=encodeURIComponent(String(p)),O=this.V(p);for(p=0;p<O.length;p++){var R=k;O[p]!==""&&(R+="="+encodeURIComponent(String(O[p]))),o.push(R)}}return this.i=o.join("&")};function dr(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function gp(o,u){u&&!o.j&&(en(o),o.i=null,o.g.forEach(function(h,p){var R=p.toLowerCase();p!=R&&(gc(this,p),vc(this,R,h))},o)),o.j=u}function yp(o,u){const h=new Mt;if(l.Image){const p=new Image;p.onload=E(nn,h,"TestLoadImage: loaded",!0,u,p),p.onerror=E(nn,h,"TestLoadImage: error",!1,u,p),p.onabort=E(nn,h,"TestLoadImage: abort",!1,u,p),p.ontimeout=E(nn,h,"TestLoadImage: timeout",!1,u,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else u(!1)}function vp(o,u){const h=new Mt,p=new AbortController,R=setTimeout(()=>{p.abort(),nn(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:p.signal}).then(k=>{clearTimeout(R),k.ok?nn(h,"TestPingServer: ok",!0,u):nn(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(R),nn(h,"TestPingServer: error",!1,u)})}function nn(o,u,h,p,R){try{R&&(R.onload=null,R.onerror=null,R.onabort=null,R.ontimeout=null),p(h)}catch{}}function _p(){this.g=new Gt}function wp(o,u,h){const p=h||"";try{hc(o,function(R,k){let O=R;d(R)&&(O=J(R)),u.push(p+k+"="+encodeURIComponent(O))})}catch(R){throw u.push(p+"type="+encodeURIComponent("_badmap")),R}}function ai(o){this.l=o.Ub||null,this.j=o.eb||!1}I(ai,Xe),ai.prototype.g=function(){return new li(this.l,this.j)},ai.prototype.i=function(o){return function(){return o}}({});function li(o,u){Rt.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}I(li,Rt),n=li.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,Zr(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Xr(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,Zr(this)),this.g&&(this.readyState=3,Zr(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;_c(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function _c(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?Xr(this):Zr(this),this.readyState==3&&_c(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,Xr(this))},n.Qa=function(o){this.g&&(this.response=o,Xr(this))},n.ga=function(){this.g&&Xr(this)};function Xr(o){o.readyState=4,o.l=null,o.j=null,o.v=null,Zr(o)}n.setRequestHeader=function(o,u){this.u.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function Zr(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(li.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function wc(o){let u="";return V(o,function(h,p){u+=p,u+=":",u+=h,u+=`\r
`}),u}function zo(o,u,h){t:{for(p in h){var p=!1;break t}p=!0}p||(h=wc(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):ut(o,u,h))}function yt(o){Rt.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}I(yt,Rt);var Ep=/^https?$/i,bp=["POST","PUT"];n=yt.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,u,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Mo.g(),this.v=this.o?lr(this.o):lr(Mo),this.g.onreadystatechange=v(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(k){Ec(this,k);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var R in p)h.set(R,p[R]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const k of p.keys())h.set(k,p.get(k));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(k=>k.toLowerCase()=="content-type"),R=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(bp,u,void 0))||p||R||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[k,O]of h)this.g.setRequestHeader(k,O);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Ic(this),this.u=!0,this.g.send(o),this.u=!1}catch(k){Ec(this,k)}};function Ec(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,bc(o),ci(o)}function bc(o){o.A||(o.A=!0,Pt(o,"complete"),Pt(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Pt(this,"complete"),Pt(this,"abort"),ci(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ci(this,!0)),yt.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Tc(this):this.bb())},n.bb=function(){Tc(this)};function Tc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||Le(o)!=4||o.Z()!=2)){if(o.u&&Le(o)==4)Wr(o.Ea,0,o);else if(Pt(o,"readystatechange"),Le(o)==4){o.h=!1;try{const O=o.Z();t:switch(O){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break t;default:u=!1}var h;if(!(h=u)){var p;if(p=O===0){var R=String(o.D).match(fc)[1]||null;!R&&l.self&&l.self.location&&(R=l.self.location.protocol.slice(0,-1)),p=!Ep.test(R?R.toLowerCase():"")}h=p}if(h)Pt(o,"complete"),Pt(o,"success");else{o.m=6;try{var k=2<Le(o)?o.g.statusText:""}catch{k=""}o.l=k+" ["+o.Z()+"]",bc(o)}}finally{ci(o)}}}}function ci(o,u){if(o.g){Ic(o);const h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||Pt(o,"ready");try{h.onreadystatechange=p}catch{}}}function Ic(o){o.I&&(l.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function Le(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<Le(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),Ct(u)}};function Sc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Tp(o){const u={};o=(o.g&&2<=Le(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(D(o[p]))continue;var h=S(o[p]);const R=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const k=u[R]||[];u[R]=k,k.push(h)}T(u,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ts(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function Ac(o){this.Aa=0,this.i=[],this.j=new Mt,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ts("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ts("baseRetryDelayMs",5e3,o),this.cb=ts("retryDelaySeedMs",1e4,o),this.Wa=ts("forwardChannelMaxRetries",2,o),this.wa=ts("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new ac(o&&o.concurrentRequestLimit),this.Da=new _p,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Ac.prototype,n.la=8,n.G=1,n.connect=function(o,u,h,p){_t(0),this.W=o,this.H=u||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=Lc(this,null,this.W),di(this)};function Uo(o){if(xc(o),o.G==3){var u=o.U++,h=Ne(o.I);if(ut(h,"SID",o.K),ut(h,"RID",u),ut(h,"TYPE","terminate"),es(o,h),u=new tn(o,o.j,u),u.L=2,u.v=oi(Ne(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=u.v,h=!0),h||(u.g=Vc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),ri(u)}Nc(o)}function ui(o){o.g&&(qo(o),o.g.cancel(),o.g=null)}function xc(o){ui(o),o.u&&(l.clearTimeout(o.u),o.u=null),hi(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function di(o){if(!lc(o.h)&&!o.s){o.s=!0;var u=o.Ga;Ft||zt(),mt||(Ft(),mt=!0),ht.add(u,o),o.B=0}}function Ip(o,u){return cc(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=Ze(v(o.Ga,o,u),Mc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const R=new tn(this,this.j,o);let k=this.o;if(this.S&&(k?(k=g(k),w(k,this.S)):k=this.S),this.m!==null||this.O||(R.H=k,k=null),this.P)t:{for(var u=0,h=0;h<this.i.length;h++){e:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break e}p=void 0}if(p===void 0)break;if(u+=p,4096<u){u=h;break t}if(u===4096||h===this.i.length-1){u=h+1;break t}}u=1e3}else u=1e3;u=Pc(this,R,u),h=Ne(this.I),ut(h,"RID",o),ut(h,"CVER",22),this.D&&ut(h,"X-HTTP-Session-Id",this.D),es(this,h),k&&(this.O?u="headers="+encodeURIComponent(String(wc(k)))+"&"+u:this.m&&zo(h,this.m,k)),Fo(this.h,R),this.Ua&&ut(h,"TYPE","init"),this.P?(ut(h,"$req",u),ut(h,"SID","null"),R.T=!0,Lo(R,h,null)):Lo(R,h,u),this.G=2}}else this.G==3&&(o?Rc(this,o):this.i.length==0||lc(this.h)||Rc(this))};function Rc(o,u){var h;u?h=u.l:h=o.U++;const p=Ne(o.I);ut(p,"SID",o.K),ut(p,"RID",h),ut(p,"AID",o.T),es(o,p),o.m&&o.o&&zo(p,o.m,o.o),h=new tn(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Pc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),Fo(o.h,h),Lo(h,p,u)}function es(o,u){o.H&&V(o.H,function(h,p){ut(u,p,h)}),o.l&&hc({},function(h,p){ut(u,p,h)})}function Pc(o,u,h){h=Math.min(o.i.length,h);var p=o.l?v(o.l.Na,o.l,o):null;t:{var R=o.i;let k=-1;for(;;){const O=["count="+h];k==-1?0<h?(k=R[0].g,O.push("ofs="+k)):k=0:O.push("ofs="+k);let lt=!0;for(let Nt=0;Nt<h;Nt++){let rt=R[Nt].g;const Ut=R[Nt].map;if(rt-=k,0>rt)k=Math.max(0,R[Nt].g-100),lt=!1;else try{wp(Ut,O,"req"+rt+"_")}catch{p&&p(Ut)}}if(lt){p=O.join("&");break t}}}return o=o.i.splice(0,h),u.D=o,p}function Cc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;Ft||zt(),mt||(Ft(),mt=!0),ht.add(u,o),o.v=0}}function $o(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=Ze(v(o.Fa,o),Mc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,kc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=Ze(v(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,_t(10),ui(this),kc(this))};function qo(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function kc(o){o.g=new tn(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=Ne(o.qa);ut(u,"RID","rpc"),ut(u,"SID",o.K),ut(u,"AID",o.T),ut(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&ut(u,"TO",o.ja),ut(u,"TYPE","xmlhttp"),es(o,u),o.m&&o.o&&zo(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=oi(Ne(u)),h.m=null,h.P=!0,sc(h,o)}n.Za=function(){this.C!=null&&(this.C=null,ui(this),$o(this),_t(19))};function hi(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function Dc(o,u){var h=null;if(o.g==u){hi(o),qo(o),o.g=null;var p=2}else if(Bo(o.h,u))h=u.D,uc(o.h,u),p=1;else return;if(o.G!=0){if(u.o)if(p==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var R=o.B;p=cr(),Pt(p,new Cn(p,h)),di(o)}else Cc(o);else if(R=u.s,R==3||R==0&&0<u.X||!(p==1&&Ip(o,u)||p==2&&$o(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),R){case 1:Nn(o,5);break;case 4:Nn(o,10);break;case 3:Nn(o,6);break;default:Nn(o,2)}}}function Mc(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function Nn(o,u){if(o.j.info("Error code "+u),u==2){var h=v(o.fb,o),p=o.Xa;const R=!p;p=new Mn(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||si(p,"https"),oi(p),R?yp(p.toString(),h):vp(p.toString(),h)}else _t(2);o.G=0,o.l&&o.l.sa(u),Nc(o),xc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),_t(2)):(this.j.info("Failed to ping google.com"),_t(1))};function Nc(o){if(o.G=0,o.ka=[],o.l){const u=dc(o.h);(u.length!=0||o.i.length!=0)&&(b(o.ka,u),b(o.ka,o.i),o.h.i.length=0,x(o.i),o.i.length=0),o.l.ra()}}function Lc(o,u,h){var p=h instanceof Mn?Ne(h):new Mn(h);if(p.g!="")u&&(p.g=u+"."+p.g),ii(p,p.s);else{var R=l.location;p=R.protocol,u=u?u+"."+R.hostname:R.hostname,R=+R.port;var k=new Mn(null);p&&si(k,p),u&&(k.g=u),R&&ii(k,R),h&&(k.l=h),p=k}return h=o.D,u=o.ya,h&&u&&ut(p,h,u),ut(p,"VER",o.la),es(o,p),p}function Vc(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new yt(new ai({eb:h})):new yt(o.pa),u.Ha(o.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Oc(){}n=Oc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function fi(){}fi.prototype.g=function(o,u){return new ee(o,u)};function ee(o,u){Rt.call(this),this.g=new Ac(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!D(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!D(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new hr(this)}I(ee,Rt),ee.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ee.prototype.close=function(){Uo(this.g)},ee.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=J(o),o=h);u.i.push(new ap(u.Ya++,o)),u.G==3&&di(u)},ee.prototype.N=function(){this.g.l=null,delete this.j,Uo(this.g),delete this.g,ee.aa.N.call(this)};function Bc(o){we.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){t:{for(const h in u){o=h;break t}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}I(Bc,we);function Fc(){te.call(this),this.status=1}I(Fc,te);function hr(o){this.g=o}I(hr,Oc),hr.prototype.ua=function(){Pt(this.g,"a")},hr.prototype.ta=function(o){Pt(this.g,new Bc(o))},hr.prototype.sa=function(o){Pt(this.g,new Fc)},hr.prototype.ra=function(){Pt(this.g,"b")},fi.prototype.createWebChannel=fi.prototype.g,ee.prototype.send=ee.prototype.o,ee.prototype.open=ee.prototype.m,ee.prototype.close=ee.prototype.close,gh=function(){return new fi},mh=function(){return cr()},ph=Kt,wa={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},ei.NO_ERROR=0,ei.TIMEOUT=8,ei.HTTP_ERROR=6,Si=ei,ec.COMPLETE="complete",fh=ec,Pn.EventType=_e,_e.OPEN="a",_e.CLOSE="b",_e.ERROR="c",_e.MESSAGE="d",Rt.prototype.listen=Rt.prototype.K,as=Pn,yt.prototype.listenOnce=yt.prototype.L,yt.prototype.getLastError=yt.prototype.Ka,yt.prototype.getLastErrorCode=yt.prototype.Ba,yt.prototype.getStatus=yt.prototype.Z,yt.prototype.getResponseJson=yt.prototype.Oa,yt.prototype.getResponseText=yt.prototype.oa,yt.prototype.send=yt.prototype.ea,yt.prototype.setWithCredentials=yt.prototype.Ha,hh=yt}).apply(typeof yi<"u"?yi:typeof self<"u"?self:typeof window<"u"?window:{});const vu="@firebase/firestore";/**
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
 */class jt{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}jt.UNAUTHENTICATED=new jt(null),jt.GOOGLE_CREDENTIALS=new jt("google-credentials-uid"),jt.FIRST_PARTY=new jt("first-party-uid"),jt.MOCK_USER=new jt("mock-user");/**
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
 */let Br="10.14.0";/**
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
 */const Wn=new $a("@firebase/firestore");function rs(){return Wn.logLevel}function U(n,...t){if(Wn.logLevel<=et.DEBUG){const e=t.map(nl);Wn.debug(`Firestore (${Br}): ${n}`,...e)}}function je(n,...t){if(Wn.logLevel<=et.ERROR){const e=t.map(nl);Wn.error(`Firestore (${Br}): ${n}`,...e)}}function Pr(n,...t){if(Wn.logLevel<=et.WARN){const e=t.map(nl);Wn.warn(`Firestore (${Br}): ${n}`,...e)}}function nl(n){if(typeof n=="string")return n;try{/**
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
 */function Y(n="Unexpected state"){const t=`FIRESTORE (${Br}) INTERNAL ASSERTION FAILED: `+n;throw je(t),new Error(t)}function at(n,t){n||Y()}function K(n,t){return n}/**
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
 */const M={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class z extends Ye{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Ue{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
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
 */class yh{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class Fv{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(jt.UNAUTHENTICATED))}shutdown(){}}class zv{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class Uv{constructor(t){this.t=t,this.currentUser=jt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){at(this.o===void 0);let r=this.i;const s=c=>this.i!==r?(r=this.i,e(c)):Promise.resolve();let i=new Ue;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Ue,t.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const c=i;t.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},l=c=>{U("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(U("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Ue)}},0),a()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(r=>this.i!==t?(U("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(at(typeof r.accessToken=="string"),new yh(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return at(t===null||typeof t=="string"),new jt(t)}}class $v{constructor(t,e,r){this.l=t,this.h=e,this.P=r,this.type="FirstParty",this.user=jt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const t=this.T();return t&&this.I.set("Authorization",t),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class qv{constructor(t,e,r){this.l=t,this.h=e,this.P=r}getToken(){return Promise.resolve(new $v(this.l,this.h,this.P))}start(t,e){t.enqueueRetryable(()=>e(jt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class jv{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Hv{constructor(t){this.A=t,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(t,e){at(this.o===void 0);const r=i=>{i.error!=null&&U("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.R;return this.R=i.token,U("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?e(i.token):Promise.resolve()};this.o=i=>{t.enqueueRetryable(()=>r(i))};const s=i=>{U("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):U("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(e=>e?(at(typeof e.token=="string"),this.R=e.token,new jv(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function Wv(n){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(n);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let r=0;r<n;r++)e[r]=Math.floor(256*Math.random());return e}/**
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
 */class vh{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=Math.floor(256/t.length)*t.length;let r="";for(;r.length<20;){const s=Wv(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<e&&(r+=t.charAt(s[i]%t.length))}return r}}function st(n,t){return n<t?-1:n>t?1:0}function Cr(n,t,e){return n.length===t.length&&n.every((r,s)=>e(r,t[s]))}/**
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
 */class St{constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new z(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new z(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<-62135596800)throw new z(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new z(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}static now(){return St.fromMillis(Date.now())}static fromDate(t){return St.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),r=Math.floor(1e6*(t-1e3*e));return new St(e,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(t){return this.seconds===t.seconds?st(this.nanoseconds,t.nanoseconds):st(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const t=this.seconds- -62135596800;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class G{constructor(t){this.timestamp=t}static fromTimestamp(t){return new G(t)}static min(){return new G(new St(0,0))}static max(){return new G(new St(253402300799,999999999))}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class bs{constructor(t,e,r){e===void 0?e=0:e>t.length&&Y(),r===void 0?r=t.length-e:r>t.length-e&&Y(),this.segments=t,this.offset=e,this.len=r}get length(){return this.len}isEqual(t){return bs.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof bs?t.forEach(r=>{e.push(r)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,r=this.limit();e<r;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const r=Math.min(t.length,e.length);for(let s=0;s<r;s++){const i=t.get(s),a=e.get(s);if(i<a)return-1;if(i>a)return 1}return t.length<e.length?-1:t.length>e.length?1:0}}class dt extends bs{construct(t,e,r){return new dt(t,e,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const r of t){if(r.indexOf("//")>=0)throw new z(M.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);e.push(...r.split("/").filter(s=>s.length>0))}return new dt(e)}static emptyPath(){return new dt([])}}const Yv=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Vt extends bs{construct(t,e,r){return new Vt(t,e,r)}static isValidIdentifier(t){return Yv.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Vt.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Vt(["__name__"])}static fromServerFormat(t){const e=[];let r="",s=0;const i=()=>{if(r.length===0)throw new z(M.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(r),r=""};let a=!1;for(;s<t.length;){const l=t[s];if(l==="\\"){if(s+1===t.length)throw new z(M.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const c=t[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new z(M.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=c,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(r+=l,s++):(i(),s++)}if(i(),a)throw new z(M.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new Vt(e)}static emptyPath(){return new Vt([])}}/**
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
 */class q{constructor(t){this.path=t}static fromPath(t){return new q(dt.fromString(t))}static fromName(t){return new q(dt.fromString(t).popFirst(5))}static empty(){return new q(dt.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&dt.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return dt.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new q(new dt(t.slice()))}}function Gv(n,t){const e=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=G.fromTimestamp(r===1e9?new St(e+1,0):new St(e,r));return new wn(s,q.empty(),t)}function Kv(n){return new wn(n.readTime,n.key,-1)}class wn{constructor(t,e,r){this.readTime=t,this.documentKey=e,this.largestBatchId=r}static min(){return new wn(G.min(),q.empty(),-1)}static max(){return new wn(G.max(),q.empty(),-1)}}function Qv(n,t){let e=n.readTime.compareTo(t.readTime);return e!==0?e:(e=q.comparator(n.documentKey,t.documentKey),e!==0?e:st(n.largestBatchId,t.largestBatchId))}/**
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
 */const Jv="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Xv{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
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
 */async function Os(n){if(n.code!==M.FAILED_PRECONDITION||n.message!==Jv)throw n;U("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class L{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&Y(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new L((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(t,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(e,i).next(r,s)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof L?e:L.resolve(e)}catch(e){return L.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):L.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):L.reject(e)}static resolve(t){return new L((e,r)=>{e(t)})}static reject(t){return new L((e,r)=>{r(t)})}static waitFor(t){return new L((e,r)=>{let s=0,i=0,a=!1;t.forEach(l=>{++s,l.next(()=>{++i,a&&i===s&&e()},c=>r(c))}),a=!0,i===s&&e()})}static or(t){let e=L.resolve(!1);for(const r of t)e=e.next(s=>s?L.resolve(s):r());return e}static forEach(t,e){const r=[];return t.forEach((s,i)=>{r.push(e.call(this,s,i))}),this.waitFor(r)}static mapArray(t,e){return new L((r,s)=>{const i=t.length,a=new Array(i);let l=0;for(let c=0;c<i;c++){const d=c;e(t[d]).next(f=>{a[d]=f,++l,l===i&&r(a)},f=>s(f))}})}static doWhile(t,e){return new L((r,s)=>{const i=()=>{t()===!0?e().next(()=>{i()},s):r()};i()})}}function Zv(n){const t=n.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function Bs(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class rl{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=r=>this.ie(r),this.se=r=>e.writeSequenceNumber(r))}ie(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.se&&this.se(t),t}}rl.oe=-1;function no(n){return n==null}function Ui(n){return n===0&&1/n==-1/0}function t0(n){return typeof n=="number"&&Number.isInteger(n)&&!Ui(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */function _u(n){let t=0;for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t++;return t}function Qn(n,t){for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t(e,n[e])}function _h(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}/**
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
 */class pt{constructor(t,e){this.comparator=t,this.root=e||Lt.EMPTY}insert(t,e){return new pt(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,Lt.BLACK,null,null))}remove(t){return new pt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,Lt.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const r=this.comparator(t,e.key);if(r===0)return e.value;r<0?e=e.left:r>0&&(e=e.right)}return null}indexOf(t){let e=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(t,r.key);if(s===0)return e+r.left.size;s<0?r=r.left:(e+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,r)=>(t(e,r),!1))}toString(){const t=[];return this.inorderTraversal((e,r)=>(t.push(`${e}:${r}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new vi(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new vi(this.root,t,this.comparator,!1)}getReverseIterator(){return new vi(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new vi(this.root,t,this.comparator,!0)}}class vi{constructor(t,e,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!t.isEmpty();)if(i=e?r(t.key,e):1,e&&s&&(i*=-1),i<0)t=this.isReverse?t.left:t.right;else{if(i===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class Lt{constructor(t,e,r,s,i){this.key=t,this.value=e,this.color=r??Lt.RED,this.left=s??Lt.EMPTY,this.right=i??Lt.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,r,s,i){return new Lt(t??this.key,e??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,r){let s=this;const i=r(t,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(t,e,r),null):i===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Lt.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let r,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return Lt.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,Lt.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,Lt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Y();const t=this.left.check();if(t!==this.right.check())throw Y();return t+(this.isRed()?0:1)}}Lt.EMPTY=null,Lt.RED=!0,Lt.BLACK=!1;Lt.EMPTY=new class{constructor(){this.size=0}get key(){throw Y()}get value(){throw Y()}get color(){throw Y()}get left(){throw Y()}get right(){throw Y()}copy(t,e,r,s,i){return this}insert(t,e,r){return new Lt(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class Ot{constructor(t){this.comparator=t,this.data=new pt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,r)=>(t(e),!1))}forEachInRange(t,e){const r=this.data.getIteratorFrom(t[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let r;for(r=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();r.hasNext();)if(!t(r.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new wu(this.data.getIterator())}getIteratorFrom(t){return new wu(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(r=>{e=e.add(r)}),e}isEqual(t){if(!(t instanceof Ot)||this.size!==t.size)return!1;const e=this.data.getIterator(),r=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new Ot(this.comparator);return e.data=t,e}}class wu{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class re{constructor(t){this.fields=t,t.sort(Vt.comparator)}static empty(){return new re([])}unionWith(t){let e=new Ot(Vt.comparator);for(const r of this.fields)e=e.add(r);for(const r of t)e=e.add(r);return new re(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return Cr(this.fields,t.fields,(e,r)=>e.isEqual(r))}}/**
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
 */class wh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Bt{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new wh("Invalid base64 string: "+i):i}}(t);return new Bt(e)}static fromUint8Array(t){const e=function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i}(t);return new Bt(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const r=new Uint8Array(e.length);for(let s=0;s<e.length;s++)r[s]=e.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return st(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Bt.EMPTY_BYTE_STRING=new Bt("");const e0=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function En(n){if(at(!!n),typeof n=="string"){let t=0;const e=e0.exec(n);if(at(!!e),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:wt(n.seconds),nanos:wt(n.nanos)}}function wt(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Yn(n){return typeof n=="string"?Bt.fromBase64String(n):Bt.fromUint8Array(n)}/**
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
 */function sl(n){var t,e;return((e=(((t=n==null?void 0:n.mapValue)===null||t===void 0?void 0:t.fields)||{}).__type__)===null||e===void 0?void 0:e.stringValue)==="server_timestamp"}function il(n){const t=n.mapValue.fields.__previous_value__;return sl(t)?il(t):t}function Ts(n){const t=En(n.mapValue.fields.__local_write_time__.timestampValue);return new St(t.seconds,t.nanos)}/**
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
 */class n0{constructor(t,e,r,s,i,a,l,c,d){this.databaseId=t,this.appId=e,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class Is{constructor(t,e){this.projectId=t,this.database=e||"(default)"}static empty(){return new Is("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(t){return t instanceof Is&&t.projectId===this.projectId&&t.database===this.database}}/**
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
 */const _i={mapValue:{}};function Gn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?sl(n)?4:s0(n)?9007199254740991:r0(n)?10:11:Y()}function xe(n,t){if(n===t)return!0;const e=Gn(n);if(e!==Gn(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===t.booleanValue;case 4:return Ts(n).isEqual(Ts(t));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const a=En(s.timestampValue),l=En(i.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(n,t);case 5:return n.stringValue===t.stringValue;case 6:return function(s,i){return Yn(s.bytesValue).isEqual(Yn(i.bytesValue))}(n,t);case 7:return n.referenceValue===t.referenceValue;case 8:return function(s,i){return wt(s.geoPointValue.latitude)===wt(i.geoPointValue.latitude)&&wt(s.geoPointValue.longitude)===wt(i.geoPointValue.longitude)}(n,t);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return wt(s.integerValue)===wt(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const a=wt(s.doubleValue),l=wt(i.doubleValue);return a===l?Ui(a)===Ui(l):isNaN(a)&&isNaN(l)}return!1}(n,t);case 9:return Cr(n.arrayValue.values||[],t.arrayValue.values||[],xe);case 10:case 11:return function(s,i){const a=s.mapValue.fields||{},l=i.mapValue.fields||{};if(_u(a)!==_u(l))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(l[c]===void 0||!xe(a[c],l[c])))return!1;return!0}(n,t);default:return Y()}}function Ss(n,t){return(n.values||[]).find(e=>xe(e,t))!==void 0}function kr(n,t){if(n===t)return 0;const e=Gn(n),r=Gn(t);if(e!==r)return st(e,r);switch(e){case 0:case 9007199254740991:return 0;case 1:return st(n.booleanValue,t.booleanValue);case 2:return function(i,a){const l=wt(i.integerValue||i.doubleValue),c=wt(a.integerValue||a.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,t);case 3:return Eu(n.timestampValue,t.timestampValue);case 4:return Eu(Ts(n),Ts(t));case 5:return st(n.stringValue,t.stringValue);case 6:return function(i,a){const l=Yn(i),c=Yn(a);return l.compareTo(c)}(n.bytesValue,t.bytesValue);case 7:return function(i,a){const l=i.split("/"),c=a.split("/");for(let d=0;d<l.length&&d<c.length;d++){const f=st(l[d],c[d]);if(f!==0)return f}return st(l.length,c.length)}(n.referenceValue,t.referenceValue);case 8:return function(i,a){const l=st(wt(i.latitude),wt(a.latitude));return l!==0?l:st(wt(i.longitude),wt(a.longitude))}(n.geoPointValue,t.geoPointValue);case 9:return bu(n.arrayValue,t.arrayValue);case 10:return function(i,a){var l,c,d,f;const m=i.fields||{},v=a.fields||{},E=(l=m.value)===null||l===void 0?void 0:l.arrayValue,I=(c=v.value)===null||c===void 0?void 0:c.arrayValue,x=st(((d=E==null?void 0:E.values)===null||d===void 0?void 0:d.length)||0,((f=I==null?void 0:I.values)===null||f===void 0?void 0:f.length)||0);return x!==0?x:bu(E,I)}(n.mapValue,t.mapValue);case 11:return function(i,a){if(i===_i.mapValue&&a===_i.mapValue)return 0;if(i===_i.mapValue)return 1;if(a===_i.mapValue)return-1;const l=i.fields||{},c=Object.keys(l),d=a.fields||{},f=Object.keys(d);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const v=st(c[m],f[m]);if(v!==0)return v;const E=kr(l[c[m]],d[f[m]]);if(E!==0)return E}return st(c.length,f.length)}(n.mapValue,t.mapValue);default:throw Y()}}function Eu(n,t){if(typeof n=="string"&&typeof t=="string"&&n.length===t.length)return st(n,t);const e=En(n),r=En(t),s=st(e.seconds,r.seconds);return s!==0?s:st(e.nanos,r.nanos)}function bu(n,t){const e=n.values||[],r=t.values||[];for(let s=0;s<e.length&&s<r.length;++s){const i=kr(e[s],r[s]);if(i)return i}return st(e.length,r.length)}function Dr(n){return Ea(n)}function Ea(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(e){const r=En(e);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(e){return Yn(e).toBase64()}(n.bytesValue):"referenceValue"in n?function(e){return q.fromName(e).toString()}(n.referenceValue):"geoPointValue"in n?function(e){return`geo(${e.latitude},${e.longitude})`}(n.geoPointValue):"arrayValue"in n?function(e){let r="[",s=!0;for(const i of e.values||[])s?s=!1:r+=",",r+=Ea(i);return r+"]"}(n.arrayValue):"mapValue"in n?function(e){const r=Object.keys(e.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${Ea(e.fields[a])}`;return s+"}"}(n.mapValue):Y()}function Tu(n,t){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${t.path.canonicalString()}`}}function ba(n){return!!n&&"integerValue"in n}function ol(n){return!!n&&"arrayValue"in n}function Iu(n){return!!n&&"nullValue"in n}function Su(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Ai(n){return!!n&&"mapValue"in n}function r0(n){var t,e;return((e=(((t=n==null?void 0:n.mapValue)===null||t===void 0?void 0:t.fields)||{}).__type__)===null||e===void 0?void 0:e.stringValue)==="__vector__"}function hs(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const t={mapValue:{fields:{}}};return Qn(n.mapValue.fields,(e,r)=>t.mapValue.fields[e]=hs(r)),t}if(n.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(n.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=hs(n.arrayValue.values[e]);return t}return Object.assign({},n)}function s0(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class Jt{constructor(t){this.value=t}static empty(){return new Jt({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let r=0;r<t.length-1;++r)if(e=(e.mapValue.fields||{})[t.get(r)],!Ai(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=hs(e)}setAll(t){let e=Vt.emptyPath(),r={},s=[];t.forEach((a,l)=>{if(!e.isImmediateParentOf(l)){const c=this.getFieldsMap(e);this.applyChanges(c,r,s),r={},s=[],e=l.popLast()}a?r[l.lastSegment()]=hs(a):s.push(l.lastSegment())});const i=this.getFieldsMap(e);this.applyChanges(i,r,s)}delete(t){const e=this.field(t.popLast());Ai(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return xe(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let r=0;r<t.length;++r){let s=e.mapValue.fields[t.get(r)];Ai(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(r)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,r){Qn(e,(s,i)=>t[s]=i);for(const s of r)delete t[s]}clone(){return new Jt(hs(this.value))}}function Eh(n){const t=[];return Qn(n.fields,(e,r)=>{const s=new Vt([e]);if(Ai(r)){const i=Eh(r.mapValue).fields;if(i.length===0)t.push(s);else for(const a of i)t.push(s.child(a))}else t.push(s)}),new re(t)}/**
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
 */class Ht{constructor(t,e,r,s,i,a,l){this.key=t,this.documentType=e,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=l}static newInvalidDocument(t){return new Ht(t,0,G.min(),G.min(),G.min(),Jt.empty(),0)}static newFoundDocument(t,e,r,s){return new Ht(t,1,e,G.min(),r,s,0)}static newNoDocument(t,e){return new Ht(t,2,e,G.min(),G.min(),Jt.empty(),0)}static newUnknownDocument(t,e){return new Ht(t,3,e,G.min(),G.min(),Jt.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(G.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=Jt.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=Jt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof Ht&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new Ht(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class $i{constructor(t,e){this.position=t,this.inclusive=e}}function Au(n,t,e){let r=0;for(let s=0;s<n.position.length;s++){const i=t[s],a=n.position[s];if(i.field.isKeyField()?r=q.comparator(q.fromName(a.referenceValue),e.key):r=kr(a,e.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function xu(n,t){if(n===null)return t===null;if(t===null||n.inclusive!==t.inclusive||n.position.length!==t.position.length)return!1;for(let e=0;e<n.position.length;e++)if(!xe(n.position[e],t.position[e]))return!1;return!0}/**
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
 */class As{constructor(t,e="asc"){this.field=t,this.dir=e}}function i0(n,t){return n.dir===t.dir&&n.field.isEqual(t.field)}/**
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
 */class bh{}class bt extends bh{constructor(t,e,r){super(),this.field=t,this.op=e,this.value=r}static create(t,e,r){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,r):new a0(t,e,r):e==="array-contains"?new u0(t,r):e==="in"?new d0(t,r):e==="not-in"?new h0(t,r):e==="array-contains-any"?new f0(t,r):new bt(t,e,r)}static createKeyFieldInFilter(t,e,r){return e==="in"?new l0(t,r):new c0(t,r)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&this.matchesComparison(kr(e,this.value)):e!==null&&Gn(this.value)===Gn(e)&&this.matchesComparison(kr(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return Y()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class pe extends bh{constructor(t,e){super(),this.filters=t,this.op=e,this.ae=null}static create(t,e){return new pe(t,e)}matches(t){return Th(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Th(n){return n.op==="and"}function Ih(n){return o0(n)&&Th(n)}function o0(n){for(const t of n.filters)if(t instanceof pe)return!1;return!0}function Ta(n){if(n instanceof bt)return n.field.canonicalString()+n.op.toString()+Dr(n.value);if(Ih(n))return n.filters.map(t=>Ta(t)).join(",");{const t=n.filters.map(e=>Ta(e)).join(",");return`${n.op}(${t})`}}function Sh(n,t){return n instanceof bt?function(r,s){return s instanceof bt&&r.op===s.op&&r.field.isEqual(s.field)&&xe(r.value,s.value)}(n,t):n instanceof pe?function(r,s){return s instanceof pe&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((i,a,l)=>i&&Sh(a,s.filters[l]),!0):!1}(n,t):void Y()}function Ah(n){return n instanceof bt?function(e){return`${e.field.canonicalString()} ${e.op} ${Dr(e.value)}`}(n):n instanceof pe?function(e){return e.op.toString()+" {"+e.getFilters().map(Ah).join(" ,")+"}"}(n):"Filter"}class a0 extends bt{constructor(t,e,r){super(t,e,r),this.key=q.fromName(r.referenceValue)}matches(t){const e=q.comparator(t.key,this.key);return this.matchesComparison(e)}}class l0 extends bt{constructor(t,e){super(t,"in",e),this.keys=xh("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class c0 extends bt{constructor(t,e){super(t,"not-in",e),this.keys=xh("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function xh(n,t){var e;return(((e=t.arrayValue)===null||e===void 0?void 0:e.values)||[]).map(r=>q.fromName(r.referenceValue))}class u0 extends bt{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return ol(e)&&Ss(e.arrayValue,this.value)}}class d0 extends bt{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Ss(this.value.arrayValue,e)}}class h0 extends bt{constructor(t,e){super(t,"not-in",e)}matches(t){if(Ss(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&!Ss(this.value.arrayValue,e)}}class f0 extends bt{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!ol(e)||!e.arrayValue.values)&&e.arrayValue.values.some(r=>Ss(this.value.arrayValue,r))}}/**
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
 */class p0{constructor(t,e=null,r=[],s=[],i=null,a=null,l=null){this.path=t,this.collectionGroup=e,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=l,this.ue=null}}function Ru(n,t=null,e=[],r=[],s=null,i=null,a=null){return new p0(n,t,e,r,s,i,a)}function al(n){const t=K(n);if(t.ue===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(r=>Ta(r)).join(","),e+="|ob:",e+=t.orderBy.map(r=>function(i){return i.field.canonicalString()+i.dir}(r)).join(","),no(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(r=>Dr(r)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(r=>Dr(r)).join(",")),t.ue=e}return t.ue}function ll(n,t){if(n.limit!==t.limit||n.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<n.orderBy.length;e++)if(!i0(n.orderBy[e],t.orderBy[e]))return!1;if(n.filters.length!==t.filters.length)return!1;for(let e=0;e<n.filters.length;e++)if(!Sh(n.filters[e],t.filters[e]))return!1;return n.collectionGroup===t.collectionGroup&&!!n.path.isEqual(t.path)&&!!xu(n.startAt,t.startAt)&&xu(n.endAt,t.endAt)}function Ia(n){return q.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class Fr{constructor(t,e=null,r=[],s=[],i=null,a="F",l=null,c=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function m0(n,t,e,r,s,i,a,l){return new Fr(n,t,e,r,s,i,a,l)}function cl(n){return new Fr(n)}function Pu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Rh(n){return n.collectionGroup!==null}function fs(n){const t=K(n);if(t.ce===null){t.ce=[];const e=new Set;for(const i of t.explicitOrderBy)t.ce.push(i),e.add(i.field.canonicalString());const r=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new Ot(Vt.comparator);return a.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(t).forEach(i=>{e.has(i.canonicalString())||i.isKeyField()||t.ce.push(new As(i,r))}),e.has(Vt.keyField().canonicalString())||t.ce.push(new As(Vt.keyField(),r))}return t.ce}function Ie(n){const t=K(n);return t.le||(t.le=g0(t,fs(n))),t.le}function g0(n,t){if(n.limitType==="F")return Ru(n.path,n.collectionGroup,t,n.filters,n.limit,n.startAt,n.endAt);{t=t.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new As(s.field,i)});const e=n.endAt?new $i(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new $i(n.startAt.position,n.startAt.inclusive):null;return Ru(n.path,n.collectionGroup,t,n.filters,n.limit,e,r)}}function Sa(n,t){const e=n.filters.concat([t]);return new Fr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),e,n.limit,n.limitType,n.startAt,n.endAt)}function qi(n,t,e){return new Fr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),t,e,n.startAt,n.endAt)}function ro(n,t){return ll(Ie(n),Ie(t))&&n.limitType===t.limitType}function Ph(n){return`${al(Ie(n))}|lt:${n.limitType}`}function mr(n){return`Query(target=${function(e){let r=e.path.canonicalString();return e.collectionGroup!==null&&(r+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(r+=`, filters: [${e.filters.map(s=>Ah(s)).join(", ")}]`),no(e.limit)||(r+=", limit: "+e.limit),e.orderBy.length>0&&(r+=`, orderBy: [${e.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),e.startAt&&(r+=", startAt: ",r+=e.startAt.inclusive?"b:":"a:",r+=e.startAt.position.map(s=>Dr(s)).join(",")),e.endAt&&(r+=", endAt: ",r+=e.endAt.inclusive?"a:":"b:",r+=e.endAt.position.map(s=>Dr(s)).join(",")),`Target(${r})`}(Ie(n))}; limitType=${n.limitType})`}function so(n,t){return t.isFoundDocument()&&function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):q.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)}(n,t)&&function(r,s){for(const i of fs(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(n,t)&&function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0}(n,t)&&function(r,s){return!(r.startAt&&!function(a,l,c){const d=Au(a,l,c);return a.inclusive?d<=0:d<0}(r.startAt,fs(r),s)||r.endAt&&!function(a,l,c){const d=Au(a,l,c);return a.inclusive?d>=0:d>0}(r.endAt,fs(r),s))}(n,t)}function y0(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Ch(n){return(t,e)=>{let r=!1;for(const s of fs(n)){const i=v0(s,t,e);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function v0(n,t,e){const r=n.field.isKeyField()?q.comparator(t.key,e.key):function(i,a,l){const c=a.data.field(i),d=l.data.field(i);return c!==null&&d!==null?kr(c,d):Y()}(n.field,t,e);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return Y()}}/**
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
 */class zr{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,t))return i}}has(t){return this.get(t)!==void 0}set(t,e){const r=this.mapKeyFn(t),s=this.inner[r];if(s===void 0)return this.inner[r]=[[t,e]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],t))return void(s[i]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],t))return r.length===1?delete this.inner[e]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(t){Qn(this.inner,(e,r)=>{for(const[s,i]of r)t(s,i)})}isEmpty(){return _h(this.inner)}size(){return this.innerSize}}/**
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
 */const _0=new pt(q.comparator);function He(){return _0}const kh=new pt(q.comparator);function ls(...n){let t=kh;for(const e of n)t=t.insert(e.key,e);return t}function Dh(n){let t=kh;return n.forEach((e,r)=>t=t.insert(e,r.overlayedDocument)),t}function Bn(){return ps()}function Mh(){return ps()}function ps(){return new zr(n=>n.toString(),(n,t)=>n.isEqual(t))}const w0=new pt(q.comparator),E0=new Ot(q.comparator);function tt(...n){let t=E0;for(const e of n)t=t.add(e);return t}const b0=new Ot(st);function T0(){return b0}/**
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
 */function ul(n,t){if(n.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ui(t)?"-0":t}}function Nh(n){return{integerValue:""+n}}function I0(n,t){return t0(t)?Nh(t):ul(n,t)}/**
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
 */class io{constructor(){this._=void 0}}function S0(n,t,e){return n instanceof ji?function(s,i){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&sl(i)&&(i=il(i)),i&&(a.fields.__previous_value__=i),{mapValue:a}}(e,t):n instanceof xs?Vh(n,t):n instanceof Rs?Oh(n,t):function(s,i){const a=Lh(s,i),l=Cu(a)+Cu(s.Pe);return ba(a)&&ba(s.Pe)?Nh(l):ul(s.serializer,l)}(n,t)}function A0(n,t,e){return n instanceof xs?Vh(n,t):n instanceof Rs?Oh(n,t):e}function Lh(n,t){return n instanceof Hi?function(r){return ba(r)||function(i){return!!i&&"doubleValue"in i}(r)}(t)?t:{integerValue:0}:null}class ji extends io{}class xs extends io{constructor(t){super(),this.elements=t}}function Vh(n,t){const e=Bh(t);for(const r of n.elements)e.some(s=>xe(s,r))||e.push(r);return{arrayValue:{values:e}}}class Rs extends io{constructor(t){super(),this.elements=t}}function Oh(n,t){let e=Bh(t);for(const r of n.elements)e=e.filter(s=>!xe(s,r));return{arrayValue:{values:e}}}class Hi extends io{constructor(t,e){super(),this.serializer=t,this.Pe=e}}function Cu(n){return wt(n.integerValue||n.doubleValue)}function Bh(n){return ol(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function x0(n,t){return n.field.isEqual(t.field)&&function(r,s){return r instanceof xs&&s instanceof xs||r instanceof Rs&&s instanceof Rs?Cr(r.elements,s.elements,xe):r instanceof Hi&&s instanceof Hi?xe(r.Pe,s.Pe):r instanceof ji&&s instanceof ji}(n.transform,t.transform)}class R0{constructor(t,e){this.version=t,this.transformResults=e}}class se{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new se}static exists(t){return new se(void 0,t)}static updateTime(t){return new se(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function xi(n,t){return n.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(n.updateTime):n.exists===void 0||n.exists===t.isFoundDocument()}class oo{}function Fh(n,t){if(!n.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return n.isNoDocument()?new dl(n.key,se.none()):new Fs(n.key,n.data,se.none());{const e=n.data,r=Jt.empty();let s=new Ot(Vt.comparator);for(let i of t.fields)if(!s.has(i)){let a=e.field(i);a===null&&i.length>1&&(i=i.popLast(),a=e.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new In(n.key,r,new re(s.toArray()),se.none())}}function P0(n,t,e){n instanceof Fs?function(s,i,a){const l=s.value.clone(),c=Du(s.fieldTransforms,i,a.transformResults);l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,t,e):n instanceof In?function(s,i,a){if(!xi(s.precondition,i))return void i.convertToUnknownDocument(a.version);const l=Du(s.fieldTransforms,i,a.transformResults),c=i.data;c.setAll(zh(s)),c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,t,e):function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()}(0,t,e)}function ms(n,t,e,r){return n instanceof Fs?function(i,a,l,c){if(!xi(i.precondition,a))return l;const d=i.value.clone(),f=Mu(i.fieldTransforms,c,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,t,e,r):n instanceof In?function(i,a,l,c){if(!xi(i.precondition,a))return l;const d=Mu(i.fieldTransforms,c,a),f=a.data;return f.setAll(zh(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(n,t,e,r):function(i,a,l){return xi(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(n,t,e)}function C0(n,t){let e=null;for(const r of n.fieldTransforms){const s=t.data.field(r.field),i=Lh(r.transform,s||null);i!=null&&(e===null&&(e=Jt.empty()),e.set(r.field,i))}return e||null}function ku(n,t){return n.type===t.type&&!!n.key.isEqual(t.key)&&!!n.precondition.isEqual(t.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Cr(r,s,(i,a)=>x0(i,a))}(n.fieldTransforms,t.fieldTransforms)&&(n.type===0?n.value.isEqual(t.value):n.type!==1||n.data.isEqual(t.data)&&n.fieldMask.isEqual(t.fieldMask))}class Fs extends oo{constructor(t,e,r,s=[]){super(),this.key=t,this.value=e,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class In extends oo{constructor(t,e,r,s,i=[]){super(),this.key=t,this.data=e,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function zh(n){const t=new Map;return n.fieldMask.fields.forEach(e=>{if(!e.isEmpty()){const r=n.data.field(e);t.set(e,r)}}),t}function Du(n,t,e){const r=new Map;at(n.length===e.length);for(let s=0;s<e.length;s++){const i=n[s],a=i.transform,l=t.data.field(i.field);r.set(i.field,A0(a,l,e[s]))}return r}function Mu(n,t,e){const r=new Map;for(const s of n){const i=s.transform,a=e.data.field(s.field);r.set(s.field,S0(i,a,t))}return r}class dl extends oo{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class k0 extends oo{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class D0{constructor(t,e,r,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(t,e){const r=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(t.key)&&P0(i,t,r[s])}}applyToLocalView(t,e){for(const r of this.baseMutations)r.key.isEqual(t.key)&&(e=ms(r,t,e,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(t.key)&&(e=ms(r,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const r=Mh();return this.mutations.forEach(s=>{const i=t.get(s.key),a=i.overlayedDocument;let l=this.applyToLocalView(a,i.mutatedFields);l=e.has(s.key)?null:l;const c=Fh(a,l);c!==null&&r.set(s.key,c),a.isValidDocument()||a.convertToNoDocument(G.min())}),r}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),tt())}isEqual(t){return this.batchId===t.batchId&&Cr(this.mutations,t.mutations,(e,r)=>ku(e,r))&&Cr(this.baseMutations,t.baseMutations,(e,r)=>ku(e,r))}}class hl{constructor(t,e,r,s){this.batch=t,this.commitVersion=e,this.mutationResults=r,this.docVersions=s}static from(t,e,r){at(t.mutations.length===r.length);let s=function(){return w0}();const i=t.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new hl(t,e,r,s)}}/**
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
 */class M0{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
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
 */class N0{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
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
 */var Et,nt;function L0(n){switch(n){default:return Y();case M.CANCELLED:case M.UNKNOWN:case M.DEADLINE_EXCEEDED:case M.RESOURCE_EXHAUSTED:case M.INTERNAL:case M.UNAVAILABLE:case M.UNAUTHENTICATED:return!1;case M.INVALID_ARGUMENT:case M.NOT_FOUND:case M.ALREADY_EXISTS:case M.PERMISSION_DENIED:case M.FAILED_PRECONDITION:case M.ABORTED:case M.OUT_OF_RANGE:case M.UNIMPLEMENTED:case M.DATA_LOSS:return!0}}function Uh(n){if(n===void 0)return je("GRPC error has no .code"),M.UNKNOWN;switch(n){case Et.OK:return M.OK;case Et.CANCELLED:return M.CANCELLED;case Et.UNKNOWN:return M.UNKNOWN;case Et.DEADLINE_EXCEEDED:return M.DEADLINE_EXCEEDED;case Et.RESOURCE_EXHAUSTED:return M.RESOURCE_EXHAUSTED;case Et.INTERNAL:return M.INTERNAL;case Et.UNAVAILABLE:return M.UNAVAILABLE;case Et.UNAUTHENTICATED:return M.UNAUTHENTICATED;case Et.INVALID_ARGUMENT:return M.INVALID_ARGUMENT;case Et.NOT_FOUND:return M.NOT_FOUND;case Et.ALREADY_EXISTS:return M.ALREADY_EXISTS;case Et.PERMISSION_DENIED:return M.PERMISSION_DENIED;case Et.FAILED_PRECONDITION:return M.FAILED_PRECONDITION;case Et.ABORTED:return M.ABORTED;case Et.OUT_OF_RANGE:return M.OUT_OF_RANGE;case Et.UNIMPLEMENTED:return M.UNIMPLEMENTED;case Et.DATA_LOSS:return M.DATA_LOSS;default:return Y()}}(nt=Et||(Et={}))[nt.OK=0]="OK",nt[nt.CANCELLED=1]="CANCELLED",nt[nt.UNKNOWN=2]="UNKNOWN",nt[nt.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",nt[nt.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",nt[nt.NOT_FOUND=5]="NOT_FOUND",nt[nt.ALREADY_EXISTS=6]="ALREADY_EXISTS",nt[nt.PERMISSION_DENIED=7]="PERMISSION_DENIED",nt[nt.UNAUTHENTICATED=16]="UNAUTHENTICATED",nt[nt.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",nt[nt.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",nt[nt.ABORTED=10]="ABORTED",nt[nt.OUT_OF_RANGE=11]="OUT_OF_RANGE",nt[nt.UNIMPLEMENTED=12]="UNIMPLEMENTED",nt[nt.INTERNAL=13]="INTERNAL",nt[nt.UNAVAILABLE=14]="UNAVAILABLE",nt[nt.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function V0(){return new TextEncoder}/**
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
 */const O0=new Fn([4294967295,4294967295],0);function Nu(n){const t=V0().encode(n),e=new dh;return e.update(t),new Uint8Array(e.digest())}function Lu(n){const t=new DataView(n.buffer),e=t.getUint32(0,!0),r=t.getUint32(4,!0),s=t.getUint32(8,!0),i=t.getUint32(12,!0);return[new Fn([e,r],0),new Fn([s,i],0)]}class fl{constructor(t,e,r){if(this.bitmap=t,this.padding=e,this.hashCount=r,e<0||e>=8)throw new cs(`Invalid padding: ${e}`);if(r<0)throw new cs(`Invalid hash count: ${r}`);if(t.length>0&&this.hashCount===0)throw new cs(`Invalid hash count: ${r}`);if(t.length===0&&e!==0)throw new cs(`Invalid padding when bitmap length is 0: ${e}`);this.Ie=8*t.length-e,this.Te=Fn.fromNumber(this.Ie)}Ee(t,e,r){let s=t.add(e.multiply(Fn.fromNumber(r)));return s.compare(O0)===1&&(s=new Fn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(t){return(this.bitmap[Math.floor(t/8)]&1<<t%8)!=0}mightContain(t){if(this.Ie===0)return!1;const e=Nu(t),[r,s]=Lu(e);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);if(!this.de(a))return!1}return!0}static create(t,e,r){const s=t%8==0?0:8-t%8,i=new Uint8Array(Math.ceil(t/8)),a=new fl(i,s,e);return r.forEach(l=>a.insert(l)),a}insert(t){if(this.Ie===0)return;const e=Nu(t),[r,s]=Lu(e);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);this.Ae(a)}}Ae(t){const e=Math.floor(t/8),r=t%8;this.bitmap[e]|=1<<r}}class cs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class ao{constructor(t,e,r,s,i){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(t,e,r){const s=new Map;return s.set(t,zs.createSynthesizedTargetChangeForCurrentChange(t,e,r)),new ao(G.min(),s,new pt(st),He(),tt())}}class zs{constructor(t,e,r,s,i){this.resumeToken=t,this.current=e,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(t,e,r){return new zs(r,e,tt(),tt(),tt())}}/**
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
 */class Ri{constructor(t,e,r,s){this.Re=t,this.removedTargetIds=e,this.key=r,this.Ve=s}}class $h{constructor(t,e){this.targetId=t,this.me=e}}class qh{constructor(t,e,r=Bt.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=r,this.cause=s}}class Vu{constructor(){this.fe=0,this.ge=Bu(),this.pe=Bt.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(t){t.approximateByteSize()>0&&(this.we=!0,this.pe=t)}ve(){let t=tt(),e=tt(),r=tt();return this.ge.forEach((s,i)=>{switch(i){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:r=r.add(s);break;default:Y()}}),new zs(this.pe,this.ye,t,e,r)}Ce(){this.we=!1,this.ge=Bu()}Fe(t,e){this.we=!0,this.ge=this.ge.insert(t,e)}Me(t){this.we=!0,this.ge=this.ge.remove(t)}xe(){this.fe+=1}Oe(){this.fe-=1,at(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class B0{constructor(t){this.Le=t,this.Be=new Map,this.ke=He(),this.qe=Ou(),this.Qe=new pt(st)}Ke(t){for(const e of t.Re)t.Ve&&t.Ve.isFoundDocument()?this.$e(e,t.Ve):this.Ue(e,t.key,t.Ve);for(const e of t.removedTargetIds)this.Ue(e,t.key,t.Ve)}We(t){this.forEachTarget(t,e=>{const r=this.Ge(e);switch(t.state){case 0:this.ze(e)&&r.De(t.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(t.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(e);break;case 3:this.ze(e)&&(r.Ne(),r.De(t.resumeToken));break;case 4:this.ze(e)&&(this.je(e),r.De(t.resumeToken));break;default:Y()}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.Be.forEach((r,s)=>{this.ze(s)&&e(s)})}He(t){const e=t.targetId,r=t.me.count,s=this.Je(e);if(s){const i=s.target;if(Ia(i))if(r===0){const a=new q(i.path);this.Ue(e,a,Ht.newNoDocument(a,G.min()))}else at(r===1);else{const a=this.Ye(e);if(a!==r){const l=this.Ze(t),c=l?this.Xe(l,t,a):1;if(c!==0){this.je(e);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(e,d)}}}}}Ze(t){const e=t.me.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=e;let a,l;try{a=Yn(r).toUint8Array()}catch(c){if(c instanceof wh)return Pr("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new fl(a,s,i)}catch(c){return Pr(c instanceof cs?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(t,e,r){return e.me.count===r-this.nt(t,e.targetId)?0:2}nt(t,e){const r=this.Le.getRemoteKeysForTarget(e);let s=0;return r.forEach(i=>{const a=this.Le.tt(),l=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;t.mightContain(l)||(this.Ue(e,i,null),s++)}),s}rt(t){const e=new Map;this.Be.forEach((i,a)=>{const l=this.Je(a);if(l){if(i.current&&Ia(l.target)){const c=new q(l.target.path);this.ke.get(c)!==null||this.it(a,c)||this.Ue(a,c,Ht.newNoDocument(c,t))}i.be&&(e.set(a,i.ve()),i.Ce())}});let r=tt();this.qe.forEach((i,a)=>{let l=!0;a.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(i))}),this.ke.forEach((i,a)=>a.setReadTime(t));const s=new ao(t,e,this.Qe,this.ke,r);return this.ke=He(),this.qe=Ou(),this.Qe=new pt(st),s}$e(t,e){if(!this.ze(t))return;const r=this.it(t,e.key)?2:0;this.Ge(t).Fe(e.key,r),this.ke=this.ke.insert(e.key,e),this.qe=this.qe.insert(e.key,this.st(e.key).add(t))}Ue(t,e,r){if(!this.ze(t))return;const s=this.Ge(t);this.it(t,e)?s.Fe(e,1):s.Me(e),this.qe=this.qe.insert(e,this.st(e).delete(t)),r&&(this.ke=this.ke.insert(e,r))}removeTarget(t){this.Be.delete(t)}Ye(t){const e=this.Ge(t).ve();return this.Le.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}xe(t){this.Ge(t).xe()}Ge(t){let e=this.Be.get(t);return e||(e=new Vu,this.Be.set(t,e)),e}st(t){let e=this.qe.get(t);return e||(e=new Ot(st),this.qe=this.qe.insert(t,e)),e}ze(t){const e=this.Je(t)!==null;return e||U("WatchChangeAggregator","Detected inactive target",t),e}Je(t){const e=this.Be.get(t);return e&&e.Se?null:this.Le.ot(t)}je(t){this.Be.set(t,new Vu),this.Le.getRemoteKeysForTarget(t).forEach(e=>{this.Ue(t,e,null)})}it(t,e){return this.Le.getRemoteKeysForTarget(t).has(e)}}function Ou(){return new pt(q.comparator)}function Bu(){return new pt(q.comparator)}const F0={asc:"ASCENDING",desc:"DESCENDING"},z0={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},U0={and:"AND",or:"OR"};class $0{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function Aa(n,t){return n.useProto3Json||no(t)?t:{value:t}}function Wi(n,t){return n.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function jh(n,t){return n.useProto3Json?t.toBase64():t.toUint8Array()}function q0(n,t){return Wi(n,t.toTimestamp())}function Se(n){return at(!!n),G.fromTimestamp(function(e){const r=En(e);return new St(r.seconds,r.nanos)}(n))}function pl(n,t){return xa(n,t).canonicalString()}function xa(n,t){const e=function(s){return new dt(["projects",s.projectId,"databases",s.database])}(n).child("documents");return t===void 0?e:e.child(t)}function Hh(n){const t=dt.fromString(n);return at(Qh(t)),t}function Ra(n,t){return pl(n.databaseId,t.path)}function Zo(n,t){const e=Hh(t);if(e.get(1)!==n.databaseId.projectId)throw new z(M.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+n.databaseId.projectId);if(e.get(3)!==n.databaseId.database)throw new z(M.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+n.databaseId.database);return new q(Yh(e))}function Wh(n,t){return pl(n.databaseId,t)}function j0(n){const t=Hh(n);return t.length===4?dt.emptyPath():Yh(t)}function Pa(n){return new dt(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Yh(n){return at(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Fu(n,t,e){return{name:Ra(n,t),fields:e.value.mapValue.fields}}function H0(n,t){let e;if("targetChange"in t){t.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:Y()}(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],i=function(d,f){return d.useProto3Json?(at(f===void 0||typeof f=="string"),Bt.fromBase64String(f||"")):(at(f===void 0||f instanceof Buffer||f instanceof Uint8Array),Bt.fromUint8Array(f||new Uint8Array))}(n,t.targetChange.resumeToken),a=t.targetChange.cause,l=a&&function(d){const f=d.code===void 0?M.UNKNOWN:Uh(d.code);return new z(f,d.message||"")}(a);e=new qh(r,s,i,l||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const s=Zo(n,r.document.name),i=Se(r.document.updateTime),a=r.document.createTime?Se(r.document.createTime):G.min(),l=new Jt({mapValue:{fields:r.document.fields}}),c=Ht.newFoundDocument(s,i,a,l),d=r.targetIds||[],f=r.removedTargetIds||[];e=new Ri(d,f,c.key,c)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const s=Zo(n,r.document),i=r.readTime?Se(r.readTime):G.min(),a=Ht.newNoDocument(s,i),l=r.removedTargetIds||[];e=new Ri([],l,a.key,a)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const s=Zo(n,r.document),i=r.removedTargetIds||[];e=new Ri([],i,s,null)}else{if(!("filter"in t))return Y();{t.filter;const r=t.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new N0(s,i),l=r.targetId;e=new $h(l,a)}}return e}function W0(n,t){let e;if(t instanceof Fs)e={update:Fu(n,t.key,t.value)};else if(t instanceof dl)e={delete:Ra(n,t.key)};else if(t instanceof In)e={update:Fu(n,t.key,t.data),updateMask:e_(t.fieldMask)};else{if(!(t instanceof k0))return Y();e={verify:Ra(n,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(r=>function(i,a){const l=a.transform;if(l instanceof ji)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof xs)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Rs)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Hi)return{fieldPath:a.field.canonicalString(),increment:l.Pe};throw Y()}(0,r))),t.precondition.isNone||(e.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:q0(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Y()}(n,t.precondition)),e}function Y0(n,t){return n&&n.length>0?(at(t!==void 0),n.map(e=>function(s,i){let a=s.updateTime?Se(s.updateTime):Se(i);return a.isEqual(G.min())&&(a=Se(i)),new R0(a,s.transformResults||[])}(e,t))):[]}function G0(n,t){return{documents:[Wh(n,t.path)]}}function K0(n,t){const e={structuredQuery:{}},r=t.path;let s;t.collectionGroup!==null?(s=r,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=r.popLast(),e.structuredQuery.from=[{collectionId:r.lastSegment()}]),e.parent=Wh(n,s);const i=function(d){if(d.length!==0)return Kh(pe.create(d,"and"))}(t.filters);i&&(e.structuredQuery.where=i);const a=function(d){if(d.length!==0)return d.map(f=>function(v){return{field:gr(v.field),direction:X0(v.dir)}}(f))}(t.orderBy);a&&(e.structuredQuery.orderBy=a);const l=Aa(n,t.limit);return l!==null&&(e.structuredQuery.limit=l),t.startAt&&(e.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(t.endAt)),{_t:e,parent:s}}function Q0(n){let t=j0(n.parent);const e=n.structuredQuery,r=e.from?e.from.length:0;let s=null;if(r>0){at(r===1);const f=e.from[0];f.allDescendants?s=f.collectionId:t=t.child(f.collectionId)}let i=[];e.where&&(i=function(m){const v=Gh(m);return v instanceof pe&&Ih(v)?v.getFilters():[v]}(e.where));let a=[];e.orderBy&&(a=function(m){return m.map(v=>function(I){return new As(yr(I.field),function(b){switch(b){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(I.direction))}(v))}(e.orderBy));let l=null;e.limit&&(l=function(m){let v;return v=typeof m=="object"?m.value:m,no(v)?null:v}(e.limit));let c=null;e.startAt&&(c=function(m){const v=!!m.before,E=m.values||[];return new $i(E,v)}(e.startAt));let d=null;return e.endAt&&(d=function(m){const v=!m.before,E=m.values||[];return new $i(E,v)}(e.endAt)),m0(t,s,a,i,l,"F",c,d)}function J0(n,t){const e=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Y()}}(t.purpose);return e==null?null:{"goog-listen-tags":e}}function Gh(n){return n.unaryFilter!==void 0?function(e){switch(e.unaryFilter.op){case"IS_NAN":const r=yr(e.unaryFilter.field);return bt.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=yr(e.unaryFilter.field);return bt.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=yr(e.unaryFilter.field);return bt.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=yr(e.unaryFilter.field);return bt.create(a,"!=",{nullValue:"NULL_VALUE"});default:return Y()}}(n):n.fieldFilter!==void 0?function(e){return bt.create(yr(e.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Y()}}(e.fieldFilter.op),e.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(e){return pe.create(e.compositeFilter.filters.map(r=>Gh(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return Y()}}(e.compositeFilter.op))}(n):Y()}function X0(n){return F0[n]}function Z0(n){return z0[n]}function t_(n){return U0[n]}function gr(n){return{fieldPath:n.canonicalString()}}function yr(n){return Vt.fromServerFormat(n.fieldPath)}function Kh(n){return n instanceof bt?function(e){if(e.op==="=="){if(Su(e.value))return{unaryFilter:{field:gr(e.field),op:"IS_NAN"}};if(Iu(e.value))return{unaryFilter:{field:gr(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(Su(e.value))return{unaryFilter:{field:gr(e.field),op:"IS_NOT_NAN"}};if(Iu(e.value))return{unaryFilter:{field:gr(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:gr(e.field),op:Z0(e.op),value:e.value}}}(n):n instanceof pe?function(e){const r=e.getFilters().map(s=>Kh(s));return r.length===1?r[0]:{compositeFilter:{op:t_(e.op),filters:r}}}(n):Y()}function e_(n){const t=[];return n.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function Qh(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class hn{constructor(t,e,r,s,i=G.min(),a=G.min(),l=Bt.EMPTY_BYTE_STRING,c=null){this.target=t,this.targetId=e,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(t){return new hn(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new hn(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new hn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new hn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
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
 */class n_{constructor(t){this.ct=t}}function r_(n){const t=Q0({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?qi(t,t.limit,"L"):t}/**
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
 */class s_{constructor(){this.un=new i_}addToCollectionParentIndex(t,e){return this.un.add(e),L.resolve()}getCollectionParents(t,e){return L.resolve(this.un.getEntries(e))}addFieldIndex(t,e){return L.resolve()}deleteFieldIndex(t,e){return L.resolve()}deleteAllFieldIndexes(t){return L.resolve()}createTargetIndexes(t,e){return L.resolve()}getDocumentsMatchingTarget(t,e){return L.resolve(null)}getIndexType(t,e){return L.resolve(0)}getFieldIndexes(t,e){return L.resolve([])}getNextCollectionGroupToUpdate(t){return L.resolve(null)}getMinOffset(t,e){return L.resolve(wn.min())}getMinOffsetFromCollectionGroup(t,e){return L.resolve(wn.min())}updateCollectionGroup(t,e,r){return L.resolve()}updateIndexEntries(t,e){return L.resolve()}}class i_{constructor(){this.index={}}add(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e]||new Ot(dt.comparator),i=!s.has(r);return this.index[e]=s.add(r),i}has(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e];return s&&s.has(r)}getEntries(t){return(this.index[t]||new Ot(dt.comparator)).toArray()}}/**
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
 */class Mr{constructor(t){this.Ln=t}next(){return this.Ln+=2,this.Ln}static Bn(){return new Mr(0)}static kn(){return new Mr(-1)}}/**
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
 */class o_{constructor(){this.changes=new zr(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,Ht.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const r=this.changes.get(e);return r!==void 0?L.resolve(r):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
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
 */class a_{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
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
 */class l_{constructor(t,e,r,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=r,this.indexManager=s}getDocument(t,e){let r=null;return this.documentOverlayCache.getOverlay(t,e).next(s=>(r=s,this.remoteDocumentCache.getEntry(t,e))).next(s=>(r!==null&&ms(r.mutation,s,re.empty(),St.now()),s))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.getLocalViewOfDocuments(t,r,tt()).next(()=>r))}getLocalViewOfDocuments(t,e,r=tt()){const s=Bn();return this.populateOverlays(t,s,e).next(()=>this.computeViews(t,e,s,r).next(i=>{let a=ls();return i.forEach((l,c)=>{a=a.insert(l,c.overlayedDocument)}),a}))}getOverlayedDocuments(t,e){const r=Bn();return this.populateOverlays(t,r,e).next(()=>this.computeViews(t,e,r,tt()))}populateOverlays(t,e,r){const s=[];return r.forEach(i=>{e.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(t,s).next(i=>{i.forEach((a,l)=>{e.set(a,l)})})}computeViews(t,e,r,s){let i=He();const a=ps(),l=function(){return ps()}();return e.forEach((c,d)=>{const f=r.get(d.key);s.has(d.key)&&(f===void 0||f.mutation instanceof In)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),ms(f.mutation,d,f.mutation.getFieldMask(),St.now())):a.set(d.key,re.empty())}),this.recalculateAndSaveOverlays(t,i).next(c=>(c.forEach((d,f)=>a.set(d,f)),e.forEach((d,f)=>{var m;return l.set(d,new a_(f,(m=a.get(d))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(t,e){const r=ps();let s=new pt((a,l)=>a-l),i=tt();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(a=>{for(const l of a)l.keys().forEach(c=>{const d=e.get(c);if(d===null)return;let f=r.get(c)||re.empty();f=l.applyToLocalView(d,f),r.set(c,f);const m=(s.get(l.batchId)||tt()).add(c);s=s.insert(l.batchId,m)})}).next(()=>{const a=[],l=s.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,f=c.value,m=Mh();f.forEach(v=>{if(!i.has(v)){const E=Fh(e.get(v),r.get(v));E!==null&&m.set(v,E),i=i.add(v)}}),a.push(this.documentOverlayCache.saveOverlays(t,d,m))}return L.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.recalculateAndSaveOverlays(t,r))}getDocumentsMatchingQuery(t,e,r,s){return function(a){return q.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):Rh(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,r,s):this.getDocumentsMatchingCollectionQuery(t,e,r,s)}getNextDocuments(t,e,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,r,s).next(i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,r.largestBatchId,s-i.size):L.resolve(Bn());let l=-1,c=i;return a.next(d=>L.forEach(d,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(f)?L.resolve():this.remoteDocumentCache.getEntry(t,f).next(v=>{c=c.insert(f,v)}))).next(()=>this.populateOverlays(t,d,i)).next(()=>this.computeViews(t,c,d,tt())).next(f=>({batchId:l,changes:Dh(f)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new q(e)).next(r=>{let s=ls();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(t,e,r,s){const i=e.collectionGroup;let a=ls();return this.indexManager.getCollectionParents(t,i).next(l=>L.forEach(l,c=>{const d=function(m,v){return new Fr(v,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(e,c.child(i));return this.getDocumentsMatchingCollectionQuery(t,d,r,s).next(f=>{f.forEach((m,v)=>{a=a.insert(m,v)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(t,e,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,r.largestBatchId).next(a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,r,i,s))).next(a=>{i.forEach((c,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Ht.newInvalidDocument(f)))});let l=ls();return a.forEach((c,d)=>{const f=i.get(c);f!==void 0&&ms(f.mutation,d,re.empty(),St.now()),so(e,d)&&(l=l.insert(c,d))}),l})}}/**
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
 */class c_{constructor(t){this.serializer=t,this.hr=new Map,this.Pr=new Map}getBundleMetadata(t,e){return L.resolve(this.hr.get(e))}saveBundleMetadata(t,e){return this.hr.set(e.id,function(s){return{id:s.id,version:s.version,createTime:Se(s.createTime)}}(e)),L.resolve()}getNamedQuery(t,e){return L.resolve(this.Pr.get(e))}saveNamedQuery(t,e){return this.Pr.set(e.name,function(s){return{name:s.name,query:r_(s.bundledQuery),readTime:Se(s.readTime)}}(e)),L.resolve()}}/**
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
 */class u_{constructor(){this.overlays=new pt(q.comparator),this.Ir=new Map}getOverlay(t,e){return L.resolve(this.overlays.get(e))}getOverlays(t,e){const r=Bn();return L.forEach(e,s=>this.getOverlay(t,s).next(i=>{i!==null&&r.set(s,i)})).next(()=>r)}saveOverlays(t,e,r){return r.forEach((s,i)=>{this.ht(t,e,i)}),L.resolve()}removeOverlaysForBatchId(t,e,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(r)),L.resolve()}getOverlaysForCollection(t,e,r){const s=Bn(),i=e.length+1,a=new q(e.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!e.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>r&&s.set(c.getKey(),c)}return L.resolve(s)}getOverlaysForCollectionGroup(t,e,r,s){let i=new pt((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===e&&d.largestBatchId>r){let f=i.get(d.largestBatchId);f===null&&(f=Bn(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const l=Bn(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,f)=>l.set(d,f)),!(l.size()>=s)););return L.resolve(l)}ht(t,e,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new M0(e,r));let i=this.Ir.get(e);i===void 0&&(i=tt(),this.Ir.set(e,i)),this.Ir.set(e,i.add(r.key))}}/**
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
 */class d_{constructor(){this.sessionToken=Bt.EMPTY_BYTE_STRING}getSessionToken(t){return L.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,L.resolve()}}/**
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
 */class ml{constructor(){this.Tr=new Ot(Dt.Er),this.dr=new Ot(Dt.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(t,e){const r=new Dt(t,e);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(t,e){t.forEach(r=>this.addReference(r,e))}removeReference(t,e){this.Vr(new Dt(t,e))}mr(t,e){t.forEach(r=>this.removeReference(r,e))}gr(t){const e=new q(new dt([])),r=new Dt(e,t),s=new Dt(e,t+1),i=[];return this.dr.forEachInRange([r,s],a=>{this.Vr(a),i.push(a.key)}),i}pr(){this.Tr.forEach(t=>this.Vr(t))}Vr(t){this.Tr=this.Tr.delete(t),this.dr=this.dr.delete(t)}yr(t){const e=new q(new dt([])),r=new Dt(e,t),s=new Dt(e,t+1);let i=tt();return this.dr.forEachInRange([r,s],a=>{i=i.add(a.key)}),i}containsKey(t){const e=new Dt(t,0),r=this.Tr.firstAfterOrEqual(e);return r!==null&&t.isEqual(r.key)}}class Dt{constructor(t,e){this.key=t,this.wr=e}static Er(t,e){return q.comparator(t.key,e.key)||st(t.wr,e.wr)}static Ar(t,e){return st(t.wr,e.wr)||q.comparator(t.key,e.key)}}/**
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
 */class h_{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.Sr=1,this.br=new Ot(Dt.Er)}checkEmpty(t){return L.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,r,s){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new D0(i,e,r,s);this.mutationQueue.push(a);for(const l of s)this.br=this.br.add(new Dt(l.key,i)),this.indexManager.addToCollectionParentIndex(t,l.key.path.popLast());return L.resolve(a)}lookupMutationBatch(t,e){return L.resolve(this.Dr(e))}getNextMutationBatchAfterBatchId(t,e){const r=e+1,s=this.vr(r),i=s<0?0:s;return L.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return L.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(t){return L.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const r=new Dt(e,0),s=new Dt(e,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([r,s],a=>{const l=this.Dr(a.wr);i.push(l)}),L.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let r=new Ot(st);return e.forEach(s=>{const i=new Dt(s,0),a=new Dt(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,a],l=>{r=r.add(l.wr)})}),L.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(t,e){const r=e.path,s=r.length+1;let i=r;q.isDocumentKey(i)||(i=i.child(""));const a=new Dt(new q(i),0);let l=new Ot(st);return this.br.forEachWhile(c=>{const d=c.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(l=l.add(c.wr)),!0)},a),L.resolve(this.Cr(l))}Cr(t){const e=[];return t.forEach(r=>{const s=this.Dr(r);s!==null&&e.push(s)}),e}removeMutationBatch(t,e){at(this.Fr(e.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return L.forEach(e.mutations,s=>{const i=new Dt(s.key,e.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)}).next(()=>{this.br=r})}On(t){}containsKey(t,e){const r=new Dt(e,0),s=this.br.firstAfterOrEqual(r);return L.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,L.resolve()}Fr(t,e){return this.vr(t)}vr(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Dr(t){const e=this.vr(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
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
 */class f_{constructor(t){this.Mr=t,this.docs=function(){return new pt(q.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const r=e.key,s=this.docs.get(r),i=s?s.size:0,a=this.Mr(e);return this.docs=this.docs.insert(r,{document:e.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(t,r.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const r=this.docs.get(e);return L.resolve(r?r.document.mutableCopy():Ht.newInvalidDocument(e))}getEntries(t,e){let r=He();return e.forEach(s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Ht.newInvalidDocument(s))}),L.resolve(r)}getDocumentsMatchingQuery(t,e,r,s){let i=He();const a=e.path,l=new q(a.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:f}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||Qv(Kv(f),r)<=0||(s.has(f.key)||so(e,f))&&(i=i.insert(f.key,f.mutableCopy()))}return L.resolve(i)}getAllFromCollectionGroup(t,e,r,s){Y()}Or(t,e){return L.forEach(this.docs,r=>e(r))}newChangeBuffer(t){return new p_(this)}getSize(t){return L.resolve(this.size)}}class p_ extends o_{constructor(t){super(),this.cr=t}applyChanges(t){const e=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?e.push(this.cr.addEntry(t,s)):this.cr.removeEntry(r)}),L.waitFor(e)}getFromCache(t,e){return this.cr.getEntry(t,e)}getAllFromCache(t,e){return this.cr.getEntries(t,e)}}/**
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
 */class m_{constructor(t){this.persistence=t,this.Nr=new zr(e=>al(e),ll),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.Lr=0,this.Br=new ml,this.targetCount=0,this.kr=Mr.Bn()}forEachTarget(t,e){return this.Nr.forEach((r,s)=>e(s)),L.resolve()}getLastRemoteSnapshotVersion(t){return L.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return L.resolve(this.Lr)}allocateTargetId(t){return this.highestTargetId=this.kr.next(),L.resolve(this.highestTargetId)}setTargetsMetadata(t,e,r){return r&&(this.lastRemoteSnapshotVersion=r),e>this.Lr&&(this.Lr=e),L.resolve()}Kn(t){this.Nr.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.kr=new Mr(e),this.highestTargetId=e),t.sequenceNumber>this.Lr&&(this.Lr=t.sequenceNumber)}addTargetData(t,e){return this.Kn(e),this.targetCount+=1,L.resolve()}updateTargetData(t,e){return this.Kn(e),L.resolve()}removeTargetData(t,e){return this.Nr.delete(e.target),this.Br.gr(e.targetId),this.targetCount-=1,L.resolve()}removeTargets(t,e,r){let s=0;const i=[];return this.Nr.forEach((a,l)=>{l.sequenceNumber<=e&&r.get(l.targetId)===null&&(this.Nr.delete(a),i.push(this.removeMatchingKeysForTargetId(t,l.targetId)),s++)}),L.waitFor(i).next(()=>s)}getTargetCount(t){return L.resolve(this.targetCount)}getTargetData(t,e){const r=this.Nr.get(e)||null;return L.resolve(r)}addMatchingKeys(t,e,r){return this.Br.Rr(e,r),L.resolve()}removeMatchingKeys(t,e,r){this.Br.mr(e,r);const s=this.persistence.referenceDelegate,i=[];return s&&e.forEach(a=>{i.push(s.markPotentiallyOrphaned(t,a))}),L.waitFor(i)}removeMatchingKeysForTargetId(t,e){return this.Br.gr(e),L.resolve()}getMatchingKeysForTargetId(t,e){const r=this.Br.yr(e);return L.resolve(r)}containsKey(t,e){return L.resolve(this.Br.containsKey(e))}}/**
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
 */class g_{constructor(t,e){this.qr={},this.overlays={},this.Qr=new rl(0),this.Kr=!1,this.Kr=!0,this.$r=new d_,this.referenceDelegate=t(this),this.Ur=new m_(this),this.indexManager=new s_,this.remoteDocumentCache=function(s){return new f_(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new n_(e),this.Gr=new c_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new u_,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let r=this.qr[t.toKey()];return r||(r=new h_(e,this.referenceDelegate),this.qr[t.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(t,e,r){U("MemoryPersistence","Starting transaction:",t);const s=new y_(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(i=>this.referenceDelegate.jr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Hr(t,e){return L.or(Object.values(this.qr).map(r=>()=>r.containsKey(t,e)))}}class y_ extends Xv{constructor(t){super(),this.currentSequenceNumber=t}}class gl{constructor(t){this.persistence=t,this.Jr=new ml,this.Yr=null}static Zr(t){return new gl(t)}get Xr(){if(this.Yr)return this.Yr;throw Y()}addReference(t,e,r){return this.Jr.addReference(r,e),this.Xr.delete(r.toString()),L.resolve()}removeReference(t,e,r){return this.Jr.removeReference(r,e),this.Xr.add(r.toString()),L.resolve()}markPotentiallyOrphaned(t,e){return this.Xr.add(e.toString()),L.resolve()}removeTarget(t,e){this.Jr.gr(e.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(t,e.targetId).next(s=>{s.forEach(i=>this.Xr.add(i.toString()))}).next(()=>r.removeTargetData(t,e))}zr(){this.Yr=new Set}jr(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return L.forEach(this.Xr,r=>{const s=q.fromPath(r);return this.ei(t,s).next(i=>{i||e.removeEntry(s,G.min())})}).next(()=>(this.Yr=null,e.apply(t)))}updateLimboDocument(t,e){return this.ei(t,e).next(r=>{r?this.Xr.delete(e.toString()):this.Xr.add(e.toString())})}Wr(t){return 0}ei(t,e){return L.or([()=>L.resolve(this.Jr.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Hr(t,e)])}}/**
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
 */class yl{constructor(t,e,r,s){this.targetId=t,this.fromCache=e,this.$i=r,this.Ui=s}static Wi(t,e){let r=tt(),s=tt();for(const i of e.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new yl(t,e.fromCache,r,s)}}/**
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
 */class v_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
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
 */class __{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return em()?8:Zv(Yt())>0?6:4}()}initialize(t,e){this.Ji=t,this.indexManager=e,this.Gi=!0}getDocumentsMatchingQuery(t,e,r,s){const i={result:null};return this.Yi(t,e).next(a=>{i.result=a}).next(()=>{if(!i.result)return this.Zi(t,e,s,r).next(a=>{i.result=a})}).next(()=>{if(i.result)return;const a=new v_;return this.Xi(t,e,a).next(l=>{if(i.result=l,this.zi)return this.es(t,e,a,l.size)})}).next(()=>i.result)}es(t,e,r,s){return r.documentReadCount<this.ji?(rs()<=et.DEBUG&&U("QueryEngine","SDK will not create cache indexes for query:",mr(e),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),L.resolve()):(rs()<=et.DEBUG&&U("QueryEngine","Query:",mr(e),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(rs()<=et.DEBUG&&U("QueryEngine","The SDK decides to create cache indexes for query:",mr(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Ie(e))):L.resolve())}Yi(t,e){if(Pu(e))return L.resolve(null);let r=Ie(e);return this.indexManager.getIndexType(t,r).next(s=>s===0?null:(e.limit!==null&&s===1&&(e=qi(e,null,"F"),r=Ie(e)),this.indexManager.getDocumentsMatchingTarget(t,r).next(i=>{const a=tt(...i);return this.Ji.getDocuments(t,a).next(l=>this.indexManager.getMinOffset(t,r).next(c=>{const d=this.ts(e,l);return this.ns(e,d,a,c.readTime)?this.Yi(t,qi(e,null,"F")):this.rs(t,d,e,c)}))})))}Zi(t,e,r,s){return Pu(e)||s.isEqual(G.min())?L.resolve(null):this.Ji.getDocuments(t,r).next(i=>{const a=this.ts(e,i);return this.ns(e,a,r,s)?L.resolve(null):(rs()<=et.DEBUG&&U("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),mr(e)),this.rs(t,a,e,Gv(s,-1)).next(l=>l))})}ts(t,e){let r=new Ot(Ch(t));return e.forEach((s,i)=>{so(t,i)&&(r=r.add(i))}),r}ns(t,e,r,s){if(t.limit===null)return!1;if(r.size!==e.size)return!0;const i=t.limitType==="F"?e.last():e.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Xi(t,e,r){return rs()<=et.DEBUG&&U("QueryEngine","Using full collection scan to execute query:",mr(e)),this.Ji.getDocumentsMatchingQuery(t,e,wn.min(),r)}rs(t,e,r,s){return this.Ji.getDocumentsMatchingQuery(t,r,s).next(i=>(e.forEach(a=>{i=i.insert(a.key,a)}),i))}}/**
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
 */class w_{constructor(t,e,r,s){this.persistence=t,this.ss=e,this.serializer=s,this.os=new pt(st),this._s=new zr(i=>al(i),ll),this.us=new Map,this.cs=t.getRemoteDocumentCache(),this.Ur=t.getTargetCache(),this.Gr=t.getBundleCache(),this.ls(r)}ls(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new l_(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.os))}}function E_(n,t,e,r){return new w_(n,t,e,r)}async function Jh(n,t){const e=K(n);return await e.persistence.runTransaction("Handle user change","readonly",r=>{let s;return e.mutationQueue.getAllMutationBatches(r).next(i=>(s=i,e.ls(t),e.mutationQueue.getAllMutationBatches(r))).next(i=>{const a=[],l=[];let c=tt();for(const d of s){a.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}for(const d of i){l.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}return e.localDocuments.getDocuments(r,c).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:l}))})})}function b_(n,t){const e=K(n);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=t.batch.keys(),i=e.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,f){const m=d.batch,v=m.keys();let E=L.resolve();return v.forEach(I=>{E=E.next(()=>f.getEntry(c,I)).next(x=>{const b=d.docVersions.get(I);at(b!==null),x.version.compareTo(b)<0&&(m.applyToRemoteDocument(x,d),x.isValidDocument()&&(x.setReadTime(d.commitVersion),f.addEntry(x)))})}),E.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(e,r,t,i).next(()=>i.apply(r)).next(()=>e.mutationQueue.performConsistencyCheck(r)).next(()=>e.documentOverlayCache.removeOverlaysForBatchId(r,s,t.batch.batchId)).next(()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let c=tt();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(t))).next(()=>e.localDocuments.getDocuments(r,s))})}function Xh(n){const t=K(n);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Ur.getLastRemoteSnapshotVersion(e))}function T_(n,t){const e=K(n),r=t.snapshotVersion;let s=e.os;return e.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const a=e.cs.newChangeBuffer({trackRemovals:!0});s=e.os;const l=[];t.targetChanges.forEach((f,m)=>{const v=s.get(m);if(!v)return;l.push(e.Ur.removeMatchingKeys(i,f.removedDocuments,m).next(()=>e.Ur.addMatchingKeys(i,f.addedDocuments,m)));let E=v.withSequenceNumber(i.currentSequenceNumber);t.targetMismatches.get(m)!==null?E=E.withResumeToken(Bt.EMPTY_BYTE_STRING,G.min()).withLastLimboFreeSnapshotVersion(G.min()):f.resumeToken.approximateByteSize()>0&&(E=E.withResumeToken(f.resumeToken,r)),s=s.insert(m,E),function(x,b,P){return x.resumeToken.approximateByteSize()===0||b.snapshotVersion.toMicroseconds()-x.snapshotVersion.toMicroseconds()>=3e8?!0:P.addedDocuments.size+P.modifiedDocuments.size+P.removedDocuments.size>0}(v,E,f)&&l.push(e.Ur.updateTargetData(i,E))});let c=He(),d=tt();if(t.documentUpdates.forEach(f=>{t.resolvedLimboDocuments.has(f)&&l.push(e.persistence.referenceDelegate.updateLimboDocument(i,f))}),l.push(I_(i,a,t.documentUpdates).next(f=>{c=f.Ps,d=f.Is})),!r.isEqual(G.min())){const f=e.Ur.getLastRemoteSnapshotVersion(i).next(m=>e.Ur.setTargetsMetadata(i,i.currentSequenceNumber,r));l.push(f)}return L.waitFor(l).next(()=>a.apply(i)).next(()=>e.localDocuments.getLocalViewOfDocuments(i,c,d)).next(()=>c)}).then(i=>(e.os=s,i))}function I_(n,t,e){let r=tt(),s=tt();return e.forEach(i=>r=r.add(i)),t.getEntries(n,r).next(i=>{let a=He();return e.forEach((l,c)=>{const d=i.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(l)),c.isNoDocument()&&c.version.isEqual(G.min())?(t.removeEntry(l,c.readTime),a=a.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(t.addEntry(c),a=a.insert(l,c)):U("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:a,Is:s}})}function S_(n,t){const e=K(n);return e.persistence.runTransaction("Get next mutation batch","readonly",r=>(t===void 0&&(t=-1),e.mutationQueue.getNextMutationBatchAfterBatchId(r,t)))}function A_(n,t){const e=K(n);return e.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return e.Ur.getTargetData(r,t).next(i=>i?(s=i,L.resolve(s)):e.Ur.allocateTargetId(r).next(a=>(s=new hn(t,a,"TargetPurposeListen",r.currentSequenceNumber),e.Ur.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=e.os.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.os=e.os.insert(r.targetId,r),e._s.set(t,r.targetId)),r})}async function Ca(n,t,e){const r=K(n),s=r.os.get(t),i=e?"readwrite":"readwrite-primary";try{e||await r.persistence.runTransaction("Release target",i,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!Bs(a))throw a;U("LocalStore",`Failed to update sequence numbers for target ${t}: ${a}`)}r.os=r.os.remove(t),r._s.delete(s.target)}function zu(n,t,e){const r=K(n);let s=G.min(),i=tt();return r.persistence.runTransaction("Execute query","readwrite",a=>function(c,d,f){const m=K(c),v=m._s.get(f);return v!==void 0?L.resolve(m.os.get(v)):m.Ur.getTargetData(d,f)}(r,a,Ie(t)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(a,l.targetId).next(c=>{i=c})}).next(()=>r.ss.getDocumentsMatchingQuery(a,t,e?s:G.min(),e?i:tt())).next(l=>(x_(r,y0(t),l),{documents:l,Ts:i})))}function x_(n,t,e){let r=n.us.get(t)||G.min();e.forEach((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)}),n.us.set(t,r)}class Uu{constructor(){this.activeTargetIds=T0()}fs(t){this.activeTargetIds=this.activeTargetIds.add(t)}gs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Vs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class R_{constructor(){this.so=new Uu,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,r){}addLocalQueryTarget(t,e=!0){return e&&this.so.fs(t),this.oo[t]||"not-current"}updateQueryState(t,e,r){this.oo[t]=e}removeLocalQueryTarget(t){this.so.gs(t)}isLocalQueryTarget(t){return this.so.activeTargetIds.has(t)}clearQueryState(t){delete this.oo[t]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(t){return this.so.activeTargetIds.has(t)}start(){return this.so=new Uu,Promise.resolve()}handleUserChange(t,e,r){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
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
 */class P_{_o(t){}shutdown(){}}/**
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
 */class $u{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(t){this.ho.push(t)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){U("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const t of this.ho)t(0)}lo(){U("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const t of this.ho)t(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let wi=null;function ta(){return wi===null?wi=function(){return 268435456+Math.round(2147483648*Math.random())}():wi++,"0x"+wi.toString(16)}/**
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
 */const C_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
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
 */class k_{constructor(t){this.Io=t.Io,this.To=t.To}Eo(t){this.Ao=t}Ro(t){this.Vo=t}mo(t){this.fo=t}onMessage(t){this.po=t}close(){this.To()}send(t){this.Io(t)}yo(){this.Ao()}wo(){this.Vo()}So(t){this.fo(t)}bo(t){this.po(t)}}/**
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
 */const qt="WebChannelConnection";class D_ extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const r=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+e.host,this.vo=`projects/${s}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Fo(){return!1}Mo(e,r,s,i,a){const l=ta(),c=this.xo(e,r.toUriEncodedString());U("RestConnection",`Sending RPC '${e}' ${l}:`,c,s);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,a),this.No(e,c,d,s).then(f=>(U("RestConnection",`Received RPC '${e}' ${l}: `,f),f),f=>{throw Pr("RestConnection",`RPC '${e}' ${l} failed with error: `,f,"url: ",c,"request:",s),f})}Lo(e,r,s,i,a,l){return this.Mo(e,r,s,i,a)}Oo(e,r,s){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Br}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((i,a)=>e[a]=i),s&&s.headers.forEach((i,a)=>e[a]=i)}xo(e,r){const s=C_[e];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(t){super(t),this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}No(t,e,r,s){const i=ta();return new Promise((a,l)=>{const c=new hh;c.setWithCredentials(!0),c.listenOnce(fh.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Si.NO_ERROR:const f=c.getResponseJson();U(qt,`XHR for RPC '${t}' ${i} received:`,JSON.stringify(f)),a(f);break;case Si.TIMEOUT:U(qt,`RPC '${t}' ${i} timed out`),l(new z(M.DEADLINE_EXCEEDED,"Request time out"));break;case Si.HTTP_ERROR:const m=c.getStatus();if(U(qt,`RPC '${t}' ${i} failed with status:`,m,"response text:",c.getResponseText()),m>0){let v=c.getResponseJson();Array.isArray(v)&&(v=v[0]);const E=v==null?void 0:v.error;if(E&&E.status&&E.message){const I=function(b){const P=b.toLowerCase().replace(/_/g,"-");return Object.values(M).indexOf(P)>=0?P:M.UNKNOWN}(E.status);l(new z(I,E.message))}else l(new z(M.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new z(M.UNAVAILABLE,"Connection failed."));break;default:Y()}}finally{U(qt,`RPC '${t}' ${i} completed.`)}});const d=JSON.stringify(s);U(qt,`RPC '${t}' ${i} sending request:`,s),c.send(e,"POST",d,r,15)})}Bo(t,e,r){const s=ta(),i=[this.Do,"/","google.firestore.v1.Firestore","/",t,"/channel"],a=gh(),l=mh(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,e,r),c.encodeInitMessageHeaders=!0;const f=i.join("");U(qt,`Creating RPC '${t}' stream ${s}: ${f}`,c);const m=a.createWebChannel(f,c);let v=!1,E=!1;const I=new k_({Io:b=>{E?U(qt,`Not sending because RPC '${t}' stream ${s} is closed:`,b):(v||(U(qt,`Opening RPC '${t}' stream ${s} transport.`),m.open(),v=!0),U(qt,`RPC '${t}' stream ${s} sending:`,b),m.send(b))},To:()=>m.close()}),x=(b,P,D)=>{b.listen(P,C=>{try{D(C)}catch(N){setTimeout(()=>{throw N},0)}})};return x(m,as.EventType.OPEN,()=>{E||(U(qt,`RPC '${t}' stream ${s} transport opened.`),I.yo())}),x(m,as.EventType.CLOSE,()=>{E||(E=!0,U(qt,`RPC '${t}' stream ${s} transport closed`),I.So())}),x(m,as.EventType.ERROR,b=>{E||(E=!0,Pr(qt,`RPC '${t}' stream ${s} transport errored:`,b),I.So(new z(M.UNAVAILABLE,"The operation could not be completed")))}),x(m,as.EventType.MESSAGE,b=>{var P;if(!E){const D=b.data[0];at(!!D);const C=D,N=C.error||((P=C[0])===null||P===void 0?void 0:P.error);if(N){U(qt,`RPC '${t}' stream ${s} received error:`,N);const F=N.status;let V=function(y){const w=Et[y];if(w!==void 0)return Uh(w)}(F),T=N.message;V===void 0&&(V=M.INTERNAL,T="Unknown error status: "+F+" with message "+N.message),E=!0,I.So(new z(V,T)),m.close()}else U(qt,`RPC '${t}' stream ${s} received:`,D),I.bo(D)}}),x(l,ph.STAT_EVENT,b=>{b.stat===wa.PROXY?U(qt,`RPC '${t}' stream ${s} detected buffering proxy`):b.stat===wa.NOPROXY&&U(qt,`RPC '${t}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{I.wo()},0),I}}function ea(){return typeof document<"u"?document:null}/**
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
 */function lo(n){return new $0(n,!0)}/**
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
 */class Zh{constructor(t,e,r=1e3,s=1.5,i=6e4){this.ui=t,this.timerId=e,this.ko=r,this.qo=s,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(t){this.cancel();const e=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,e-r);s>0&&U("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${e} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),t())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class tf{constructor(t,e,r,s,i,a,l,c){this.ui=t,this.Ho=r,this.Jo=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Zh(t,e)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(t){this.u_(),this.stream.send(t)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(t,e){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,t!==4?this.t_.reset():e&&e.code===M.RESOURCE_EXHAUSTED?(je(e.toString()),je("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):e&&e.code===M.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.mo(e)}l_(){}auth(){this.state=1;const t=this.h_(this.Yo),e=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===e&&this.P_(r,s)},r=>{t(()=>{const s=new z(M.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(t,e){const r=this.h_(this.Yo);this.stream=this.T_(t,e),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(t){return U("PersistentStream",`close with error: ${t}`),this.stream=null,this.close(4,t)}h_(t){return e=>{this.ui.enqueueAndForget(()=>this.Yo===t?e():(U("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class M_ extends tf{constructor(t,e,r,s,i,a){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,r,s,a),this.serializer=i}T_(t,e){return this.connection.Bo("Listen",t,e)}E_(t){return this.onNext(t)}onNext(t){this.t_.reset();const e=H0(this.serializer,t),r=function(i){if(!("targetChange"in i))return G.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?G.min():a.readTime?Se(a.readTime):G.min()}(t);return this.listener.d_(e,r)}A_(t){const e={};e.database=Pa(this.serializer),e.addTarget=function(i,a){let l;const c=a.target;if(l=Ia(c)?{documents:G0(i,c)}:{query:K0(i,c)._t},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=jh(i,a.resumeToken);const d=Aa(i,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(G.min())>0){l.readTime=Wi(i,a.snapshotVersion.toTimestamp());const d=Aa(i,a.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,t);const r=J0(this.serializer,t);r&&(e.labels=r),this.a_(e)}R_(t){const e={};e.database=Pa(this.serializer),e.removeTarget=t,this.a_(e)}}class N_ extends tf{constructor(t,e,r,s,i,a){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,r,s,a),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(t,e){return this.connection.Bo("Write",t,e)}E_(t){return at(!!t.streamToken),this.lastStreamToken=t.streamToken,at(!t.writeResults||t.writeResults.length===0),this.listener.f_()}onNext(t){at(!!t.streamToken),this.lastStreamToken=t.streamToken,this.t_.reset();const e=Y0(t.writeResults,t.commitTime),r=Se(t.commitTime);return this.listener.g_(r,e)}p_(){const t={};t.database=Pa(this.serializer),this.a_(t)}m_(t){const e={streamToken:this.lastStreamToken,writes:t.map(r=>W0(this.serializer,r))};this.a_(e)}}/**
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
 */class L_ extends class{}{constructor(t,e,r,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new z(M.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(t,e,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,a])=>this.connection.Mo(t,xa(e,r),s,i,a)).catch(i=>{throw i.name==="FirebaseError"?(i.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new z(M.UNKNOWN,i.toString())})}Lo(t,e,r,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Lo(t,xa(e,r),s,a,l,i)).catch(a=>{throw a.name==="FirebaseError"?(a.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new z(M.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class V_{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(t){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.C_("Offline")))}set(t){this.x_(),this.S_=0,t==="Online"&&(this.D_=!1),this.C_(t)}C_(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}F_(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(je(e),this.D_=!1):U("OnlineStateTracker",e)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class O_{constructor(t,e,r,s,i){this.localStore=t,this.datastore=e,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(a=>{r.enqueueAndForget(async()=>{Jn(this)&&(U("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=K(c);d.L_.add(4),await Us(d),d.q_.set("Unknown"),d.L_.delete(4),await co(d)}(this))})}),this.q_=new V_(r,s)}}async function co(n){if(Jn(n))for(const t of n.B_)await t(!0)}async function Us(n){for(const t of n.B_)await t(!1)}function ef(n,t){const e=K(n);e.N_.has(t.targetId)||(e.N_.set(t.targetId,t),El(e)?wl(e):Ur(e).r_()&&_l(e,t))}function vl(n,t){const e=K(n),r=Ur(e);e.N_.delete(t),r.r_()&&nf(e,t),e.N_.size===0&&(r.r_()?r.o_():Jn(e)&&e.q_.set("Unknown"))}function _l(n,t){if(n.Q_.xe(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(G.min())>0){const e=n.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}Ur(n).A_(t)}function nf(n,t){n.Q_.xe(t),Ur(n).R_(t)}function wl(n){n.Q_=new B0({getRemoteKeysForTarget:t=>n.remoteSyncer.getRemoteKeysForTarget(t),ot:t=>n.N_.get(t)||null,tt:()=>n.datastore.serializer.databaseId}),Ur(n).start(),n.q_.v_()}function El(n){return Jn(n)&&!Ur(n).n_()&&n.N_.size>0}function Jn(n){return K(n).L_.size===0}function rf(n){n.Q_=void 0}async function B_(n){n.q_.set("Online")}async function F_(n){n.N_.forEach((t,e)=>{_l(n,t)})}async function z_(n,t){rf(n),El(n)?(n.q_.M_(t),wl(n)):n.q_.set("Unknown")}async function U_(n,t,e){if(n.q_.set("Online"),t instanceof qh&&t.state===2&&t.cause)try{await async function(s,i){const a=i.cause;for(const l of i.targetIds)s.N_.has(l)&&(await s.remoteSyncer.rejectListen(l,a),s.N_.delete(l),s.Q_.removeTarget(l))}(n,t)}catch(r){U("RemoteStore","Failed to remove targets %s: %s ",t.targetIds.join(","),r),await Yi(n,r)}else if(t instanceof Ri?n.Q_.Ke(t):t instanceof $h?n.Q_.He(t):n.Q_.We(t),!e.isEqual(G.min()))try{const r=await Xh(n.localStore);e.compareTo(r)>=0&&await function(i,a){const l=i.Q_.rt(a);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const f=i.N_.get(d);f&&i.N_.set(d,f.withResumeToken(c.resumeToken,a))}}),l.targetMismatches.forEach((c,d)=>{const f=i.N_.get(c);if(!f)return;i.N_.set(c,f.withResumeToken(Bt.EMPTY_BYTE_STRING,f.snapshotVersion)),nf(i,c);const m=new hn(f.target,c,d,f.sequenceNumber);_l(i,m)}),i.remoteSyncer.applyRemoteEvent(l)}(n,e)}catch(r){U("RemoteStore","Failed to raise snapshot:",r),await Yi(n,r)}}async function Yi(n,t,e){if(!Bs(t))throw t;n.L_.add(1),await Us(n),n.q_.set("Offline"),e||(e=()=>Xh(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{U("RemoteStore","Retrying IndexedDB access"),await e(),n.L_.delete(1),await co(n)})}function sf(n,t){return t().catch(e=>Yi(n,e,t))}async function uo(n){const t=K(n),e=bn(t);let r=t.O_.length>0?t.O_[t.O_.length-1].batchId:-1;for(;$_(t);)try{const s=await S_(t.localStore,r);if(s===null){t.O_.length===0&&e.o_();break}r=s.batchId,q_(t,s)}catch(s){await Yi(t,s)}of(t)&&af(t)}function $_(n){return Jn(n)&&n.O_.length<10}function q_(n,t){n.O_.push(t);const e=bn(n);e.r_()&&e.V_&&e.m_(t.mutations)}function of(n){return Jn(n)&&!bn(n).n_()&&n.O_.length>0}function af(n){bn(n).start()}async function j_(n){bn(n).p_()}async function H_(n){const t=bn(n);for(const e of n.O_)t.m_(e.mutations)}async function W_(n,t,e){const r=n.O_.shift(),s=hl.from(r,t,e);await sf(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await uo(n)}async function Y_(n,t){t&&bn(n).V_&&await async function(r,s){if(function(a){return L0(a)&&a!==M.ABORTED}(s.code)){const i=r.O_.shift();bn(r).s_(),await sf(r,()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s)),await uo(r)}}(n,t),of(n)&&af(n)}async function qu(n,t){const e=K(n);e.asyncQueue.verifyOperationInProgress(),U("RemoteStore","RemoteStore received new credentials");const r=Jn(e);e.L_.add(3),await Us(e),r&&e.q_.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.L_.delete(3),await co(e)}async function G_(n,t){const e=K(n);t?(e.L_.delete(2),await co(e)):t||(e.L_.add(2),await Us(e),e.q_.set("Unknown"))}function Ur(n){return n.K_||(n.K_=function(e,r,s){const i=K(e);return i.w_(),new M_(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:B_.bind(null,n),Ro:F_.bind(null,n),mo:z_.bind(null,n),d_:U_.bind(null,n)}),n.B_.push(async t=>{t?(n.K_.s_(),El(n)?wl(n):n.q_.set("Unknown")):(await n.K_.stop(),rf(n))})),n.K_}function bn(n){return n.U_||(n.U_=function(e,r,s){const i=K(e);return i.w_(),new N_(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:j_.bind(null,n),mo:Y_.bind(null,n),f_:H_.bind(null,n),g_:W_.bind(null,n)}),n.B_.push(async t=>{t?(n.U_.s_(),await uo(n)):(await n.U_.stop(),n.O_.length>0&&(U("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
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
 */class bl{constructor(t,e,r,s,i){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new Ue,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,r,s,i){const a=Date.now()+r,l=new bl(t,e,a,s,i);return l.start(r),l}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new z(M.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Tl(n,t){if(je("AsyncQueue",`${t}: ${n}`),Bs(n))return new z(M.UNAVAILABLE,`${t}: ${n}`);throw n}/**
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
 */class Ir{constructor(t){this.comparator=t?(e,r)=>t(e,r)||q.comparator(e.key,r.key):(e,r)=>q.comparator(e.key,r.key),this.keyedMap=ls(),this.sortedSet=new pt(this.comparator)}static emptySet(t){return new Ir(t.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,r)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof Ir)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),r=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const r=new Ir;return r.comparator=this.comparator,r.keyedMap=t,r.sortedSet=e,r}}/**
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
 */class ju{constructor(){this.W_=new pt(q.comparator)}track(t){const e=t.doc.key,r=this.W_.get(e);r?t.type!==0&&r.type===3?this.W_=this.W_.insert(e,t):t.type===3&&r.type!==1?this.W_=this.W_.insert(e,{type:r.type,doc:t.doc}):t.type===2&&r.type===2?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):t.type===2&&r.type===0?this.W_=this.W_.insert(e,{type:0,doc:t.doc}):t.type===1&&r.type===0?this.W_=this.W_.remove(e):t.type===1&&r.type===2?this.W_=this.W_.insert(e,{type:1,doc:r.doc}):t.type===0&&r.type===1?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):Y():this.W_=this.W_.insert(e,t)}G_(){const t=[];return this.W_.inorderTraversal((e,r)=>{t.push(r)}),t}}class Nr{constructor(t,e,r,s,i,a,l,c,d){this.query=t,this.docs=e,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(t,e,r,s,i){const a=[];return e.forEach(l=>{a.push({type:0,doc:l})}),new Nr(t,e,Ir.emptySet(e),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&ro(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,r=t.docChanges;if(e.length!==r.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==r[s].type||!e[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
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
 */class K_{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(t=>t.J_())}}class Q_{constructor(){this.queries=Hu(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(e,r){const s=K(e),i=s.queries;s.queries=Hu(),i.forEach((a,l)=>{for(const c of l.j_)c.onError(r)})})(this,new z(M.ABORTED,"Firestore shutting down"))}}function Hu(){return new zr(n=>Ph(n),ro)}async function lf(n,t){const e=K(n);let r=3;const s=t.query;let i=e.queries.get(s);i?!i.H_()&&t.J_()&&(r=2):(i=new K_,r=t.J_()?0:1);try{switch(r){case 0:i.z_=await e.onListen(s,!0);break;case 1:i.z_=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(a){const l=Tl(a,`Initialization of query '${mr(t.query)}' failed`);return void t.onError(l)}e.queries.set(s,i),i.j_.push(t),t.Z_(e.onlineState),i.z_&&t.X_(i.z_)&&Il(e)}async function cf(n,t){const e=K(n),r=t.query;let s=3;const i=e.queries.get(r);if(i){const a=i.j_.indexOf(t);a>=0&&(i.j_.splice(a,1),i.j_.length===0?s=t.J_()?0:1:!i.H_()&&t.J_()&&(s=2))}switch(s){case 0:return e.queries.delete(r),e.onUnlisten(r,!0);case 1:return e.queries.delete(r),e.onUnlisten(r,!1);case 2:return e.onLastRemoteStoreUnlisten(r);default:return}}function J_(n,t){const e=K(n);let r=!1;for(const s of t){const i=s.query,a=e.queries.get(i);if(a){for(const l of a.j_)l.X_(s)&&(r=!0);a.z_=s}}r&&Il(e)}function X_(n,t,e){const r=K(n),s=r.queries.get(t);if(s)for(const i of s.j_)i.onError(e);r.queries.delete(t)}function Il(n){n.Y_.forEach(t=>{t.next()})}var ka,Wu;(Wu=ka||(ka={})).ea="default",Wu.Cache="cache";class uf{constructor(t,e,r){this.query=t,this.ta=e,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(t){if(!this.options.includeMetadataChanges){const r=[];for(const s of t.docChanges)s.type!==3&&r.push(s);t=new Nr(t.query,t.docs,t.oldDocs,r,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.na?this.ia(t)&&(this.ta.next(t),e=!0):this.sa(t,this.onlineState)&&(this.oa(t),e=!0),this.ra=t,e}onError(t){this.ta.error(t)}Z_(t){this.onlineState=t;let e=!1;return this.ra&&!this.na&&this.sa(this.ra,t)&&(this.oa(this.ra),e=!0),e}sa(t,e){if(!t.fromCache||!this.J_())return!0;const r=e!=="Offline";return(!this.options._a||!r)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}ia(t){if(t.docChanges.length>0)return!0;const e=this.ra&&this.ra.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}oa(t){t=Nr.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.na=!0,this.ta.next(t)}J_(){return this.options.source!==ka.Cache}}/**
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
 */class df{constructor(t){this.key=t}}class hf{constructor(t){this.key=t}}class Z_{constructor(t,e){this.query=t,this.Ta=e,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=tt(),this.mutatedKeys=tt(),this.Aa=Ch(t),this.Ra=new Ir(this.Aa)}get Va(){return this.Ta}ma(t,e){const r=e?e.fa:new ju,s=e?e.Ra:this.Ra;let i=e?e.mutatedKeys:this.mutatedKeys,a=s,l=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal((f,m)=>{const v=s.get(f),E=so(this.query,m)?m:null,I=!!v&&this.mutatedKeys.has(v.key),x=!!E&&(E.hasLocalMutations||this.mutatedKeys.has(E.key)&&E.hasCommittedMutations);let b=!1;v&&E?v.data.isEqual(E.data)?I!==x&&(r.track({type:3,doc:E}),b=!0):this.ga(v,E)||(r.track({type:2,doc:E}),b=!0,(c&&this.Aa(E,c)>0||d&&this.Aa(E,d)<0)&&(l=!0)):!v&&E?(r.track({type:0,doc:E}),b=!0):v&&!E&&(r.track({type:1,doc:v}),b=!0,(c||d)&&(l=!0)),b&&(E?(a=a.add(E),i=x?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),r.track({type:1,doc:f})}return{Ra:a,fa:r,ns:l,mutatedKeys:i}}ga(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,r,s){const i=this.Ra;this.Ra=t.Ra,this.mutatedKeys=t.mutatedKeys;const a=t.fa.G_();a.sort((f,m)=>function(E,I){const x=b=>{switch(b){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Y()}};return x(E)-x(I)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(r),s=s!=null&&s;const l=e&&!s?this.ya():[],c=this.da.size===0&&this.current&&!s?1:0,d=c!==this.Ea;return this.Ea=c,a.length!==0||d?{snapshot:new Nr(this.query,t.Ra,i,a,t.mutatedKeys,c===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new ju,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(t){return!this.Ta.has(t)&&!!this.Ra.has(t)&&!this.Ra.get(t).hasLocalMutations}pa(t){t&&(t.addedDocuments.forEach(e=>this.Ta=this.Ta.add(e)),t.modifiedDocuments.forEach(e=>{}),t.removedDocuments.forEach(e=>this.Ta=this.Ta.delete(e)),this.current=t.current)}ya(){if(!this.current)return[];const t=this.da;this.da=tt(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const e=[];return t.forEach(r=>{this.da.has(r)||e.push(new hf(r))}),this.da.forEach(r=>{t.has(r)||e.push(new df(r))}),e}ba(t){this.Ta=t.Ts,this.da=tt();const e=this.ma(t.documents);return this.applyChanges(e,!0)}Da(){return Nr.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class tw{constructor(t,e,r){this.query=t,this.targetId=e,this.view=r}}class ew{constructor(t){this.key=t,this.va=!1}}class nw{constructor(t,e,r,s,i,a){this.localStore=t,this.remoteStore=e,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new zr(l=>Ph(l),ro),this.Ma=new Map,this.xa=new Set,this.Oa=new pt(q.comparator),this.Na=new Map,this.La=new ml,this.Ba={},this.ka=new Map,this.qa=Mr.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function rw(n,t,e=!0){const r=vf(n);let s;const i=r.Fa.get(t);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Da()):s=await ff(r,t,e,!0),s}async function sw(n,t){const e=vf(n);await ff(e,t,!0,!1)}async function ff(n,t,e,r){const s=await A_(n.localStore,Ie(t)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,e);let l;return r&&(l=await iw(n,t,i,a==="current",s.resumeToken)),n.isPrimaryClient&&e&&ef(n.remoteStore,s),l}async function iw(n,t,e,r,s){n.Ka=(m,v,E)=>async function(x,b,P,D){let C=b.view.ma(P);C.ns&&(C=await zu(x.localStore,b.query,!1).then(({documents:T})=>b.view.ma(T,C)));const N=D&&D.targetChanges.get(b.targetId),F=D&&D.targetMismatches.get(b.targetId)!=null,V=b.view.applyChanges(C,x.isPrimaryClient,N,F);return Gu(x,b.targetId,V.wa),V.snapshot}(n,m,v,E);const i=await zu(n.localStore,t,!0),a=new Z_(t,i.Ts),l=a.ma(i.documents),c=zs.createSynthesizedTargetChangeForCurrentChange(e,r&&n.onlineState!=="Offline",s),d=a.applyChanges(l,n.isPrimaryClient,c);Gu(n,e,d.wa);const f=new tw(t,e,a);return n.Fa.set(t,f),n.Ma.has(e)?n.Ma.get(e).push(t):n.Ma.set(e,[t]),d.snapshot}async function ow(n,t,e){const r=K(n),s=r.Fa.get(t),i=r.Ma.get(s.targetId);if(i.length>1)return r.Ma.set(s.targetId,i.filter(a=>!ro(a,t))),void r.Fa.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Ca(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),e&&vl(r.remoteStore,s.targetId),Da(r,s.targetId)}).catch(Os)):(Da(r,s.targetId),await Ca(r.localStore,s.targetId,!0))}async function aw(n,t){const e=K(n),r=e.Fa.get(t),s=e.Ma.get(r.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(r.targetId),vl(e.remoteStore,r.targetId))}async function lw(n,t,e){const r=mw(n);try{const s=await function(a,l){const c=K(a),d=St.now(),f=l.reduce((E,I)=>E.add(I.key),tt());let m,v;return c.persistence.runTransaction("Locally write mutations","readwrite",E=>{let I=He(),x=tt();return c.cs.getEntries(E,f).next(b=>{I=b,I.forEach((P,D)=>{D.isValidDocument()||(x=x.add(P))})}).next(()=>c.localDocuments.getOverlayedDocuments(E,I)).next(b=>{m=b;const P=[];for(const D of l){const C=C0(D,m.get(D.key).overlayedDocument);C!=null&&P.push(new In(D.key,C,Eh(C.value.mapValue),se.exists(!0)))}return c.mutationQueue.addMutationBatch(E,d,P,l)}).next(b=>{v=b;const P=b.applyToLocalDocumentSet(m,x);return c.documentOverlayCache.saveOverlays(E,b.batchId,P)})}).then(()=>({batchId:v.batchId,changes:Dh(m)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(s.batchId),function(a,l,c){let d=a.Ba[a.currentUser.toKey()];d||(d=new pt(st)),d=d.insert(l,c),a.Ba[a.currentUser.toKey()]=d}(r,s.batchId,e),await $s(r,s.changes),await uo(r.remoteStore)}catch(s){const i=Tl(s,"Failed to persist write");e.reject(i)}}async function pf(n,t){const e=K(n);try{const r=await T_(e.localStore,t);t.targetChanges.forEach((s,i)=>{const a=e.Na.get(i);a&&(at(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?a.va=!0:s.modifiedDocuments.size>0?at(a.va):s.removedDocuments.size>0&&(at(a.va),a.va=!1))}),await $s(e,r,t)}catch(r){await Os(r)}}function Yu(n,t,e){const r=K(n);if(r.isPrimaryClient&&e===0||!r.isPrimaryClient&&e===1){const s=[];r.Fa.forEach((i,a)=>{const l=a.view.Z_(t);l.snapshot&&s.push(l.snapshot)}),function(a,l){const c=K(a);c.onlineState=l;let d=!1;c.queries.forEach((f,m)=>{for(const v of m.j_)v.Z_(l)&&(d=!0)}),d&&Il(c)}(r.eventManager,t),s.length&&r.Ca.d_(s),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function cw(n,t,e){const r=K(n);r.sharedClientState.updateQueryState(t,"rejected",e);const s=r.Na.get(t),i=s&&s.key;if(i){let a=new pt(q.comparator);a=a.insert(i,Ht.newNoDocument(i,G.min()));const l=tt().add(i),c=new ao(G.min(),new Map,new pt(st),a,l);await pf(r,c),r.Oa=r.Oa.remove(i),r.Na.delete(t),Sl(r)}else await Ca(r.localStore,t,!1).then(()=>Da(r,t,e)).catch(Os)}async function uw(n,t){const e=K(n),r=t.batch.batchId;try{const s=await b_(e.localStore,t);gf(e,r,null),mf(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await $s(e,s)}catch(s){await Os(s)}}async function dw(n,t,e){const r=K(n);try{const s=await function(a,l){const c=K(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return c.mutationQueue.lookupMutationBatch(d,l).next(m=>(at(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>c.localDocuments.getDocuments(d,f))})}(r.localStore,t);gf(r,t,e),mf(r,t),r.sharedClientState.updateMutationState(t,"rejected",e),await $s(r,s)}catch(s){await Os(s)}}function mf(n,t){(n.ka.get(t)||[]).forEach(e=>{e.resolve()}),n.ka.delete(t)}function gf(n,t,e){const r=K(n);let s=r.Ba[r.currentUser.toKey()];if(s){const i=s.get(t);i&&(e?i.reject(e):i.resolve(),s=s.remove(t)),r.Ba[r.currentUser.toKey()]=s}}function Da(n,t,e=null){n.sharedClientState.removeLocalQueryTarget(t);for(const r of n.Ma.get(t))n.Fa.delete(r),e&&n.Ca.$a(r,e);n.Ma.delete(t),n.isPrimaryClient&&n.La.gr(t).forEach(r=>{n.La.containsKey(r)||yf(n,r)})}function yf(n,t){n.xa.delete(t.path.canonicalString());const e=n.Oa.get(t);e!==null&&(vl(n.remoteStore,e),n.Oa=n.Oa.remove(t),n.Na.delete(e),Sl(n))}function Gu(n,t,e){for(const r of e)r instanceof df?(n.La.addReference(r.key,t),hw(n,r)):r instanceof hf?(U("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,t),n.La.containsKey(r.key)||yf(n,r.key)):Y()}function hw(n,t){const e=t.key,r=e.path.canonicalString();n.Oa.get(e)||n.xa.has(r)||(U("SyncEngine","New document in limbo: "+e),n.xa.add(r),Sl(n))}function Sl(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const t=n.xa.values().next().value;n.xa.delete(t);const e=new q(dt.fromString(t)),r=n.qa.next();n.Na.set(r,new ew(e)),n.Oa=n.Oa.insert(e,r),ef(n.remoteStore,new hn(Ie(cl(e.path)),r,"TargetPurposeLimboResolution",rl.oe))}}async function $s(n,t,e){const r=K(n),s=[],i=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((l,c)=>{a.push(r.Ka(c,t,e).then(d=>{var f;if((d||e)&&r.isPrimaryClient){const m=d?!d.fromCache:(f=e==null?void 0:e.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){s.push(d);const m=yl.Wi(c.targetId,d);i.push(m)}}))}),await Promise.all(a),r.Ca.d_(s),await async function(c,d){const f=K(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>L.forEach(d,v=>L.forEach(v.$i,E=>f.persistence.referenceDelegate.addReference(m,v.targetId,E)).next(()=>L.forEach(v.Ui,E=>f.persistence.referenceDelegate.removeReference(m,v.targetId,E)))))}catch(m){if(!Bs(m))throw m;U("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const v=m.targetId;if(!m.fromCache){const E=f.os.get(v),I=E.snapshotVersion,x=E.withLastLimboFreeSnapshotVersion(I);f.os=f.os.insert(v,x)}}}(r.localStore,i))}async function fw(n,t){const e=K(n);if(!e.currentUser.isEqual(t)){U("SyncEngine","User change. New user:",t.toKey());const r=await Jh(e.localStore,t);e.currentUser=t,function(i,a){i.ka.forEach(l=>{l.forEach(c=>{c.reject(new z(M.CANCELLED,a))})}),i.ka.clear()}(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await $s(e,r.hs)}}function pw(n,t){const e=K(n),r=e.Na.get(t);if(r&&r.va)return tt().add(r.key);{let s=tt();const i=e.Ma.get(t);if(!i)return s;for(const a of i){const l=e.Fa.get(a);s=s.unionWith(l.view.Va)}return s}}function vf(n){const t=K(n);return t.remoteStore.remoteSyncer.applyRemoteEvent=pf.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=pw.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=cw.bind(null,t),t.Ca.d_=J_.bind(null,t.eventManager),t.Ca.$a=X_.bind(null,t.eventManager),t}function mw(n){const t=K(n);return t.remoteStore.remoteSyncer.applySuccessfulWrite=uw.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=dw.bind(null,t),t}class Gi{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=lo(t.databaseInfo.databaseId),this.sharedClientState=this.Wa(t),this.persistence=this.Ga(t),await this.persistence.start(),this.localStore=this.za(t),this.gcScheduler=this.ja(t,this.localStore),this.indexBackfillerScheduler=this.Ha(t,this.localStore)}ja(t,e){return null}Ha(t,e){return null}za(t){return E_(this.persistence,new __,t.initialUser,this.serializer)}Ga(t){return new g_(gl.Zr,this.serializer)}Wa(t){return new R_}async terminate(){var t,e;(t=this.gcScheduler)===null||t===void 0||t.stop(),(e=this.indexBackfillerScheduler)===null||e===void 0||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Gi.provider={build:()=>new Gi};class Ma{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Yu(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=fw.bind(null,this.syncEngine),await G_(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new Q_}()}createDatastore(t){const e=lo(t.databaseInfo.databaseId),r=function(i){return new D_(i)}(t.databaseInfo);return function(i,a,l,c){return new L_(i,a,l,c)}(t.authCredentials,t.appCheckCredentials,r,e)}createRemoteStore(t){return function(r,s,i,a,l){return new O_(r,s,i,a,l)}(this.localStore,this.datastore,t.asyncQueue,e=>Yu(this.syncEngine,e,0),function(){return $u.D()?new $u:new P_}())}createSyncEngine(t,e){return function(s,i,a,l,c,d,f){const m=new nw(s,i,a,l,c,d);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await async function(s){const i=K(s);U("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await Us(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(t=this.datastore)===null||t===void 0||t.terminate(),(e=this.eventManager)===null||e===void 0||e.terminate()}}Ma.provider={build:()=>new Ma};/**
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
 */class _f{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ya(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ya(this.observer.error,t):je("Uncaught Error in snapshot listener:",t.toString()))}Za(){this.muted=!0}Ya(t,e){setTimeout(()=>{this.muted||t(e)},0)}}/**
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
 */class gw{constructor(t,e,r,s,i){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=r,this.databaseInfo=s,this.user=jt.UNAUTHENTICATED,this.clientId=vh.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,async a=>{U("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(U("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new Ue;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const r=Tl(e,"Failed to shutdown persistence");t.reject(r)}}),t.promise}}async function na(n,t){n.asyncQueue.verifyOperationInProgress(),U("FirestoreClient","Initializing OfflineComponentProvider");const e=n.configuration;await t.initialize(e);let r=e.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Jh(t.localStore,s),r=s)}),t.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=t}async function Ku(n,t){n.asyncQueue.verifyOperationInProgress();const e=await yw(n);U("FirestoreClient","Initializing OnlineComponentProvider"),await t.initialize(e,n.configuration),n.setCredentialChangeListener(r=>qu(t.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>qu(t.remoteStore,s)),n._onlineComponents=t}async function yw(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){U("FirestoreClient","Using user provided OfflineComponentProvider");try{await na(n,n._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!function(s){return s.name==="FirebaseError"?s.code===M.FAILED_PRECONDITION||s.code===M.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(e))throw e;Pr("Error using user provided cache. Falling back to memory cache: "+e),await na(n,new Gi)}}else U("FirestoreClient","Using default OfflineComponentProvider"),await na(n,new Gi);return n._offlineComponents}async function wf(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(U("FirestoreClient","Using user provided OnlineComponentProvider"),await Ku(n,n._uninitializedComponentsProvider._online)):(U("FirestoreClient","Using default OnlineComponentProvider"),await Ku(n,new Ma))),n._onlineComponents}function vw(n){return wf(n).then(t=>t.syncEngine)}async function Ef(n){const t=await wf(n),e=t.eventManager;return e.onListen=rw.bind(null,t.syncEngine),e.onUnlisten=ow.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=sw.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=aw.bind(null,t.syncEngine),e}function _w(n,t,e={}){const r=new Ue;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new _f({next:v=>{f.Za(),a.enqueueAndForget(()=>cf(i,m));const E=v.docs.has(l);!E&&v.fromCache?d.reject(new z(M.UNAVAILABLE,"Failed to get document because the client is offline.")):E&&v.fromCache&&c&&c.source==="server"?d.reject(new z(M.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(v)},error:v=>d.reject(v)}),m=new uf(cl(l.path),f,{includeMetadataChanges:!0,_a:!0});return lf(i,m)}(await Ef(n),n.asyncQueue,t,e,r)),r.promise}function ww(n,t,e={}){const r=new Ue;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new _f({next:v=>{f.Za(),a.enqueueAndForget(()=>cf(i,m)),v.fromCache&&c.source==="server"?d.reject(new z(M.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(v)},error:v=>d.reject(v)}),m=new uf(l,f,{includeMetadataChanges:!0,_a:!0});return lf(i,m)}(await Ef(n),n.asyncQueue,t,e,r)),r.promise}/**
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
 */function bf(n){const t={};return n.timeoutSeconds!==void 0&&(t.timeoutSeconds=n.timeoutSeconds),t}/**
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
 */const Qu=new Map;/**
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
 */function Tf(n,t,e){if(!e)throw new z(M.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${t}.`)}function Ew(n,t,e,r){if(t===!0&&r===!0)throw new z(M.INVALID_ARGUMENT,`${n} and ${e} cannot be used together.`)}function Ju(n){if(!q.isDocumentKey(n))throw new z(M.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Xu(n){if(q.isDocumentKey(n))throw new z(M.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function ho(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const t=function(r){return r.constructor?r.constructor.name:null}(n);return t?`a custom ${t} object`:"an object"}}return typeof n=="function"?"a function":Y()}function We(n,t){if("_delegate"in n&&(n=n._delegate),!(n instanceof t)){if(t.name===n.constructor.name)throw new z(M.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=ho(n);throw new z(M.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return n}function bw(n,t){if(t<=0)throw new z(M.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${t}.`)}/**
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
 */class Zu{constructor(t){var e,r;if(t.host===void 0){if(t.ssl!==void 0)throw new z(M.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=t.host,this.ssl=(e=t.ssl)===null||e===void 0||e;if(this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<1048576)throw new z(M.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}Ew("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=bf((r=t.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class fo{constructor(t,e,r,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Zu({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new z(M.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new z(M.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Zu(t),t.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Fv;switch(r.type){case"firstParty":return new qv(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new z(M.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const r=Qu.get(e);r&&(U("ComponentProvider","Removing Datastore"),Qu.delete(e),r.terminate())}(this),Promise.resolve()}}function Tw(n,t,e,r={}){var s;const i=(n=We(n,fo))._getSettings(),a=`${t}:${e}`;if(i.host!=="firestore.googleapis.com"&&i.host!==a&&Pr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},i),{host:a,ssl:!1})),r.mockUserToken){let l,c;if(typeof r.mockUserToken=="string")l=r.mockUserToken,c=jt.MOCK_USER;else{l=Gp(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new z(M.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new jt(d)}n._authCredentials=new zv(new yh(l,c))}}/**
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
 */class Sn{constructor(t,e,r){this.converter=e,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new Sn(this.firestore,t,this._query)}}class Zt{constructor(t,e,r){this.converter=e,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new yn(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new Zt(this.firestore,t,this._key)}}class yn extends Sn{constructor(t,e,r){super(t,e,cl(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new Zt(this.firestore,null,new q(t))}withConverter(t){return new yn(this.firestore,t,this._path)}}function Iw(n,t,...e){if(n=Tt(n),Tf("collection","path",t),n instanceof fo){const r=dt.fromString(t,...e);return Xu(r),new yn(n,null,r)}{if(!(n instanceof Zt||n instanceof yn))throw new z(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(dt.fromString(t,...e));return Xu(r),new yn(n.firestore,null,r)}}function Sr(n,t,...e){if(n=Tt(n),arguments.length===1&&(t=vh.newId()),Tf("doc","path",t),n instanceof fo){const r=dt.fromString(t,...e);return Ju(r),new Zt(n,null,new q(r))}{if(!(n instanceof Zt||n instanceof yn))throw new z(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(dt.fromString(t,...e));return Ju(r),new Zt(n.firestore,n instanceof yn?n.converter:null,new q(r))}}/**
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
 */class td{constructor(t=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Zh(this,"async_queue_retry"),this.Vu=()=>{const r=ea();r&&U("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=t;const e=ea();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.fu(),this.gu(t)}enterRestrictedMode(t){if(!this.Iu){this.Iu=!0,this.Au=t||!1;const e=ea();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.Vu)}}enqueue(t){if(this.fu(),this.Iu)return new Promise(()=>{});const e=new Ue;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Pu.push(t),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(t){if(!Bs(t))throw t;U("AsyncQueue","Operation failed with retryable error: "+t)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(t){const e=this.mu.then(()=>(this.du=!0,t().catch(r=>{this.Eu=r,this.du=!1;const s=function(a){let l=a.message||"";return a.stack&&(l=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),l}(r);throw je("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=e,e}enqueueAfterDelay(t,e,r){this.fu(),this.Ru.indexOf(t)>-1&&(e=0);const s=bl.createAndSchedule(this,t,e,r,i=>this.yu(i));return this.Tu.push(s),s}fu(){this.Eu&&Y()}verifyOperationInProgress(){}async wu(){let t;do t=this.mu,await t;while(t!==this.mu)}Su(t){for(const e of this.Tu)if(e.timerId===t)return!0;return!1}bu(t){return this.wu().then(()=>{this.Tu.sort((e,r)=>e.targetTimeMs-r.targetTimeMs);for(const e of this.Tu)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.wu()})}Du(t){this.Ru.push(t)}yu(t){const e=this.Tu.indexOf(t);this.Tu.splice(e,1)}}class $r extends fo{constructor(t,e,r,s){super(t,e,r,s),this.type="firestore",this._queue=new td,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new td(t),this._firestoreClient=void 0,await t}}}function Sw(n,t){const e=typeof n=="object"?n:Pd(),r=typeof n=="string"?n:"(default)",s=ja(e,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=Wp("firestore");i&&Tw(s,...i)}return s}function po(n){if(n._terminated)throw new z(M.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Aw(n),n._firestoreClient}function Aw(n){var t,e,r;const s=n._freezeSettings(),i=function(l,c,d,f){return new n0(l,c,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,bf(f.experimentalLongPollingOptions),f.useFetchStreams)}(n._databaseId,((t=n._app)===null||t===void 0?void 0:t.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((e=s.localCache)===null||e===void 0)&&e._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new gw(n._authCredentials,n._appCheckCredentials,n._queue,i,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
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
 */class Lr{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Lr(Bt.fromBase64String(t))}catch(e){throw new z(M.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Lr(Bt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}}/**
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
 */class mo{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new z(M.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Vt(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
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
 */class Al{constructor(t){this._methodName=t}}/**
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
 */class xl{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new z(M.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new z(M.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(t){return st(this._lat,t._lat)||st(this._long,t._long)}}/**
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
 */class Rl{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0}(this._values,t._values)}}/**
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
 */const xw=/^__.*__$/;class Rw{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return this.fieldMask!==null?new In(t,this.data,this.fieldMask,e,this.fieldTransforms):new Fs(t,this.data,e,this.fieldTransforms)}}class If{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return new In(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function Sf(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Y()}}class Pl{constructor(t,e,r,s,i,a){this.settings=t,this.databaseId=e,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(t){return new Pl(Object.assign(Object.assign({},this.settings),t),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(t){var e;const r=(e=this.path)===null||e===void 0?void 0:e.child(t),s=this.Fu({path:r,xu:!1});return s.Ou(t),s}Nu(t){var e;const r=(e=this.path)===null||e===void 0?void 0:e.child(t),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(t){return this.Fu({path:void 0,xu:!0})}Bu(t){return Ki(t,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}vu(){if(this.path)for(let t=0;t<this.path.length;t++)this.Ou(this.path.get(t))}Ou(t){if(t.length===0)throw this.Bu("Document fields must not be empty");if(Sf(this.Cu)&&xw.test(t))throw this.Bu('Document fields cannot begin and end with "__"')}}class Pw{constructor(t,e,r){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=r||lo(t)}Qu(t,e,r,s=!1){return new Pl({Cu:t,methodName:e,qu:r,path:Vt.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function go(n){const t=n._freezeSettings(),e=lo(n._databaseId);return new Pw(n._databaseId,!!t.ignoreUndefinedProperties,e)}function Cl(n,t,e,r,s,i={}){const a=n.Qu(i.merge||i.mergeFields?2:0,t,e,s);kl("Data must be an object, but it was:",a,r);const l=Af(r,a);let c,d;if(i.merge)c=new re(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const v=Na(t,m,e);if(!a.contains(v))throw new z(M.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);Rf(f,v)||f.push(v)}c=new re(f),d=a.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=a.fieldTransforms;return new Rw(new Jt(l),c,d)}class yo extends Al{_toFieldTransform(t){if(t.Cu!==2)throw t.Cu===1?t.Bu(`${this._methodName}() can only appear at the top level of your update data`):t.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof yo}}function Cw(n,t,e,r){const s=n.Qu(1,t,e);kl("Data must be an object, but it was:",s,r);const i=[],a=Jt.empty();Qn(r,(c,d)=>{const f=Dl(t,c,e);d=Tt(d);const m=s.Nu(f);if(d instanceof yo)i.push(f);else{const v=qs(d,m);v!=null&&(i.push(f),a.set(f,v))}});const l=new re(i);return new If(a,l,s.fieldTransforms)}function kw(n,t,e,r,s,i){const a=n.Qu(1,t,e),l=[Na(t,r,e)],c=[s];if(i.length%2!=0)throw new z(M.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let v=0;v<i.length;v+=2)l.push(Na(t,i[v])),c.push(i[v+1]);const d=[],f=Jt.empty();for(let v=l.length-1;v>=0;--v)if(!Rf(d,l[v])){const E=l[v];let I=c[v];I=Tt(I);const x=a.Nu(E);if(I instanceof yo)d.push(E);else{const b=qs(I,x);b!=null&&(d.push(E),f.set(E,b))}}const m=new re(d);return new If(f,m,a.fieldTransforms)}function Dw(n,t,e,r=!1){return qs(e,n.Qu(r?4:3,t))}function qs(n,t){if(xf(n=Tt(n)))return kl("Unsupported field value:",t,n),Af(n,t);if(n instanceof Al)return function(r,s){if(!Sf(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(n,t),null;if(n===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),n instanceof Array){if(t.settings.xu&&t.Cu!==4)throw t.Bu("Nested arrays are not supported");return function(r,s){const i=[];let a=0;for(const l of r){let c=qs(l,s.Lu(a));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),a++}return{arrayValue:{values:i}}}(n,t)}return function(r,s){if((r=Tt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return I0(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=St.fromDate(r);return{timestampValue:Wi(s.serializer,i)}}if(r instanceof St){const i=new St(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Wi(s.serializer,i)}}if(r instanceof xl)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Lr)return{bytesValue:jh(s.serializer,r._byteString)};if(r instanceof Zt){const i=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(i))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:pl(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Rl)return function(a,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return ul(l.serializer,c)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${ho(r)}`)}(n,t)}function Af(n,t){const e={};return _h(n)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Qn(n,(r,s)=>{const i=qs(s,t.Mu(r));i!=null&&(e[r]=i)}),{mapValue:{fields:e}}}function xf(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof St||n instanceof xl||n instanceof Lr||n instanceof Zt||n instanceof Al||n instanceof Rl)}function kl(n,t,e){if(!xf(e)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(e)){const r=ho(e);throw r==="an object"?t.Bu(n+" a custom object"):t.Bu(n+" "+r)}}function Na(n,t,e){if((t=Tt(t))instanceof mo)return t._internalPath;if(typeof t=="string")return Dl(n,t);throw Ki("Field path arguments must be of type string or ",n,!1,void 0,e)}const Mw=new RegExp("[~\\*/\\[\\]]");function Dl(n,t,e){if(t.search(Mw)>=0)throw Ki(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,e);try{return new mo(...t.split("."))._internalPath}catch{throw Ki(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,e)}}function Ki(n,t,e,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let l=`Function ${t}() called with invalid data`;e&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(i||a)&&(c+=" (found",i&&(c+=` in field ${r}`),a&&(c+=` in document ${s}`),c+=")"),new z(M.INVALID_ARGUMENT,l+n+c)}function Rf(n,t){return n.some(e=>e.isEqual(t))}/**
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
 */class Pf{constructor(t,e,r,s,i){this._firestore=t,this._userDataWriter=e,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Zt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new Nw(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(vo("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class Nw extends Pf{data(){return super.data()}}function vo(n,t){return typeof t=="string"?Dl(n,t):t instanceof mo?t._internalPath:t._delegate._internalPath}/**
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
 */function Lw(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new z(M.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ml{}class Nl extends Ml{}function gs(n,t,...e){let r=[];t instanceof Ml&&r.push(t),r=r.concat(e),function(i){const a=i.filter(c=>c instanceof Vl).length,l=i.filter(c=>c instanceof _o).length;if(a>1||a>0&&l>0)throw new z(M.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)n=s._apply(n);return n}class _o extends Nl{constructor(t,e,r){super(),this._field=t,this._op=e,this._value=r,this.type="where"}static _create(t,e,r){return new _o(t,e,r)}_apply(t){const e=this._parse(t);return Cf(t._query,e),new Sn(t.firestore,t.converter,Sa(t._query,e))}_parse(t){const e=go(t.firestore);return function(i,a,l,c,d,f,m){let v;if(d.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new z(M.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){rd(m,f);const E=[];for(const I of m)E.push(nd(c,i,I));v={arrayValue:{values:E}}}else v=nd(c,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||rd(m,f),v=Dw(l,a,m,f==="in"||f==="not-in");return bt.create(d,f,v)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}function Ll(n,t,e){const r=t,s=vo("where",n);return _o._create(s,r,e)}class Vl extends Ml{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new Vl(t,e)}_parse(t){const e=this._queryConstraints.map(r=>r._parse(t)).filter(r=>r.getFilters().length>0);return e.length===1?e[0]:pe.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:(function(s,i){let a=s;const l=i.getFlattenedFilters();for(const c of l)Cf(a,c),a=Sa(a,c)}(t._query,e),new Sn(t.firestore,t.converter,Sa(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Ol extends Nl{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new Ol(t,e)}_apply(t){const e=function(s,i,a){if(s.startAt!==null)throw new z(M.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new z(M.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new As(i,a)}(t._query,this._field,this._direction);return new Sn(t.firestore,t.converter,function(s,i){const a=s.explicitOrderBy.concat([i]);return new Fr(s.path,s.collectionGroup,a,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(t._query,e))}}function ed(n,t="asc"){const e=t,r=vo("orderBy",n);return Ol._create(r,e)}class Bl extends Nl{constructor(t,e,r){super(),this.type=t,this._limit=e,this._limitType=r}static _create(t,e,r){return new Bl(t,e,r)}_apply(t){return new Sn(t.firestore,t.converter,qi(t._query,this._limit,this._limitType))}}function Vw(n){return bw("limit",n),Bl._create("limit",n,"F")}function nd(n,t,e){if(typeof(e=Tt(e))=="string"){if(e==="")throw new z(M.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Rh(t)&&e.indexOf("/")!==-1)throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const r=t.path.child(dt.fromString(e));if(!q.isDocumentKey(r))throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Tu(n,new q(r))}if(e instanceof Zt)return Tu(n,e._key);throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ho(e)}.`)}function rd(n,t){if(!Array.isArray(n)||n.length===0)throw new z(M.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Cf(n,t){const e=function(s,i){for(const a of s)for(const l of a.getFlattenedFilters())if(i.indexOf(l.op)>=0)return l.op;return null}(n.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(e!==null)throw e===t.op?new z(M.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new z(M.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}class Ow{convertValue(t,e="none"){switch(Gn(t)){case 0:return null;case 1:return t.booleanValue;case 2:return wt(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(Yn(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw Y()}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const r={};return Qn(t,(s,i)=>{r[s]=this.convertValue(i,e)}),r}convertVectorValue(t){var e,r,s;const i=(s=(r=(e=t.fields)===null||e===void 0?void 0:e.value.arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map(a=>wt(a.doubleValue));return new Rl(i)}convertGeoPoint(t){return new xl(wt(t.latitude),wt(t.longitude))}convertArray(t,e){return(t.values||[]).map(r=>this.convertValue(r,e))}convertServerTimestamp(t,e){switch(e){case"previous":const r=il(t);return r==null?null:this.convertValue(r,e);case"estimate":return this.convertTimestamp(Ts(t));default:return null}}convertTimestamp(t){const e=En(t);return new St(e.seconds,e.nanos)}convertDocumentKey(t,e){const r=dt.fromString(t);at(Qh(r));const s=new Is(r.get(1),r.get(3)),i=new q(r.popFirst(5));return s.isEqual(e)||je(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),i}}/**
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
 */function Fl(n,t,e){let r;return r=n?e&&(e.merge||e.mergeFields)?n.toFirestore(t,e):n.toFirestore(t):t,r}/**
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
 */class us{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class kf extends Pf{constructor(t,e,r,s,i,a){super(t,e,r,s,a),this._firestore=t,this._firestoreImpl=t,this.metadata=i}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Pi(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const r=this._document.data.field(vo("DocumentSnapshot.get",t));if(r!==null)return this._userDataWriter.convertValue(r,e.serverTimestamps)}}}class Pi extends kf{data(t={}){return super.data(t)}}class Bw{constructor(t,e,r,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new us(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach(r=>{t.call(e,new Pi(this._firestore,this._userDataWriter,r.key,r,new us(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new z(M.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(l=>{const c=new Pi(s._firestore,s._userDataWriter,l.doc.key,l.doc,new us(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const c=new Pi(s._firestore,s._userDataWriter,l.doc.key,l.doc,new us(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,f=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),f=a.indexOf(l.doc.key)),{type:Fw(l.type),doc:c,oldIndex:d,newIndex:f}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}}function Fw(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Y()}}/**
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
 */function Df(n){n=We(n,Zt);const t=We(n.firestore,$r);return _w(po(t),n._key).then(e=>Uw(t,n,e))}class Mf extends Ow{constructor(t){super(),this.firestore=t}convertBytes(t){return new Lr(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new Zt(this.firestore,null,e)}}function wo(n){n=We(n,Sn);const t=We(n.firestore,$r),e=po(t),r=new Mf(t);return Lw(n._query),ww(e,n._query).then(s=>new Bw(t,r,n,s))}function zl(n,t,e){n=We(n,Zt);const r=We(n.firestore,$r),s=Fl(n.converter,t,e);return Ul(r,[Cl(go(r),"setDoc",n._key,s,n.converter!==null,e).toMutation(n._key,se.none())])}function zw(n,t){const e=We(n.firestore,$r),r=Sr(n),s=Fl(n.converter,t);return Ul(e,[Cl(go(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,se.exists(!1))]).then(()=>r)}function Ul(n,t){return function(r,s){const i=new Ue;return r.asyncQueue.enqueueAndForget(async()=>lw(await vw(r),s,i)),i.promise}(po(n),t)}function Uw(n,t,e){const r=e.docs.get(t._key),s=new Mf(n);return new kf(n,s,t._key,r,new us(e.hasPendingWrites,e.fromCache),t.converter)}/**
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
 */class $w{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=go(t)}set(t,e,r){this._verifyNotCommitted();const s=ra(t,this._firestore),i=Fl(s.converter,e,r),a=Cl(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,se.none())),this}update(t,e,r,...s){this._verifyNotCommitted();const i=ra(t,this._firestore);let a;return a=typeof(e=Tt(e))=="string"||e instanceof mo?kw(this._dataReader,"WriteBatch.update",i._key,e,r,s):Cw(this._dataReader,"WriteBatch.update",i._key,e),this._mutations.push(a.toMutation(i._key,se.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=ra(t,this._firestore);return this._mutations=this._mutations.concat(new dl(e._key,se.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new z(M.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function ra(n,t){if((n=Tt(n)).firestore!==t)throw new z(M.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
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
 */function Qi(n){return po(n=We(n,$r)),new $w(n,t=>Ul(n,t))}(function(t,e=!0){(function(s){Br=s})(Vr),xr(new qn("firestore",(r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),l=new $r(new Uv(r.getProvider("auth-internal")),new Hv(r.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new z(M.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Is(d.options.projectId,f)}(a,s),a);return i=Object.assign({useFetchStreams:e},i),l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),gn(vu,"4.7.3",t),gn(vu,"4.7.3","esm2017")})();const Nf={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85",measurementId:"G-80XX542QZE"};function It(){return Nf.apiKey!=="YOUR_API_KEY"}let sa=null,ie=null,Xt=null;try{It()?(sa=Rd(Nf),ie=Ov(sa),Xt=Sw(sa)):console.warn("Firebase not configured. Login required to save data.")}catch(n){console.error("Firebase initialization error:",n)}const qw=new Ve;let dn=null,ys=[];function jw(){if(!It()||!ie){console.warn("Firebase not configured - auth disabled");return}Sy(ie,n=>{console.log("onAuthStateChanged fired:",n?n.email:"null"),dn=n,console.log("Notifying",ys.length,"listeners"),ys.forEach(t=>t(n))})}function Hw(n){return console.log("onAuthStateChange: adding listener, currentUser is:",dn&&dn.email),ys.push(n),dn&&(console.log("onAuthStateChange: immediately calling listener with user"),n(dn)),()=>{ys=ys.filter(t=>t!==n)}}function js(){return dn}function Re(){return dn!==null}async function Ww(n,t,e=null){if(!It()||!ie)throw new Error("Firebase not configured");const r=await _y(ie,n,t);return e&&r.user&&await by(r.user,{displayName:e}),r}async function Yw(n,t){if(!It()||!ie)throw new Error("Firebase not configured");return wy(ie,n,t)}async function Gw(){if(!It()||!ie)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const n=await Wy(ie,qw);return console.log("Google sign-in successful:",n.user.email),n}catch(n){throw console.error("signInWithPopup error:",n.code,n.message),n}}async function Lf(){if(!It()||!ie)throw new Error("Firebase not configured");return Ay(ie)}async function Kw(n){if(!It()||!ie)throw new Error("Firebase not configured");return vy(ie,n)}jw();function Eo(n,t="settings"){const e=js();return!e||!Xt?null:Sr(Xt,"users",e.uid,n,t)}function bo(n){const t=js();return!t||!Xt?null:Iw(Xt,"users",t.uid,n)}async function Vf(){if(!It())return null;const n=Eo("decision");if(!n)return null;try{const t=await Df(n);return t.exists()?t.data():null}catch(t){return console.error("Error loading decision data:",t),null}}async function Qw(n){if(!It())return;const t=Eo("decision");if(t)try{await zl(t,{...n,lastModified:new Date().toISOString()},{merge:!0})}catch(e){throw console.error("Error saving decision data:",e),e}}async function $l(n={}){if(!It())return[];const t=bo("history");if(!t)return[];try{let e=gs(t,ed("date",n.sortDesc?"desc":"asc"));n.taxYear&&(e=gs(t,Ll("taxYear","==",n.taxYear),ed("date",n.sortDesc?"desc":"asc"))),n.limit&&(e=gs(e,Vw(n.limit)));const r=await wo(e),s=[];return r.forEach(i=>{s.push({id:i.id,...i.data()})}),s}catch(e){return console.error("Error loading decision history:",e),[]}}async function Jw(n){if(!It())return null;const t=bo("history");if(!t)return null;try{const e=gs(t,Ll("date","==",n.date)),r=await wo(e);if(!r.empty){const i=r.docs[0].id;return await zl(Sr(Xt,"users",js().uid,"history",i),{...n,updatedAt:new Date().toISOString()}),i}return(await zw(t,{...n,createdAt:new Date().toISOString()})).id}catch(e){throw console.error("Error adding history record:",e),e}}async function Xw(n){if(!It())return;const t=bo("history");if(t)try{const e=gs(t,Ll("date","==",n)),r=await wo(e),s=Qi(Xt);r.forEach(i=>{s.delete(i.ref)}),await s.commit()}catch(e){throw console.error("Error deleting history record:",e),e}}async function Zw(){if(!It())return;const n=bo("history");if(n)try{const t=await wo(n),e=500,r=[];let s=Qi(Xt),i=0;t.forEach(a=>{s.delete(a.ref),i++,i>=e&&(r.push(s),s=Qi(Xt),i=0)}),i>0&&r.push(s),await Promise.all(r.map(a=>a.commit()))}catch(t){throw console.error("Error clearing history:",t),t}}async function tE(){if(!It())return null;const n=Eo("stress");if(!n)return null;try{const t=await Df(n);return t.exists()?t.data():null}catch(t){return console.error("Error loading stress data:",t),null}}async function Of(n){if(!It())return;const t=Eo("stress");if(t)try{await zl(t,{...n,lastModified:new Date().toISOString()},{merge:!0})}catch(e){throw console.error("Error saving stress data:",e),e}}async function eE(){if(!It())return;const n=js();if(!(!n||!Xt))try{await Zw();const t=Qi(Xt);t.delete(Sr(Xt,"users",n.uid,"decision","settings")),t.delete(Sr(Xt,"users",n.uid,"stress","settings")),t.delete(Sr(Xt,"users",n.uid,"profile","settings")),await t.commit(),console.log("All user data wiped successfully")}catch(t){throw console.error("Error wiping user data:",t),t}}async function nE(){if(!It())return!1;const n=await Vf(),t=await $l({limit:1});return n!==null||t.length>0}let Wt=null,zn=null;const Bf=5e3;function Ci(){return{settings:{equityMin:Qt.EQUITY_MIN,bondMin:Qt.BOND_MIN,cashTarget:Qt.CASH_TARGET,duration:Qt.DURATION_YEARS,baseSalary:Qt.BASE_SALARY,protectionFactor:Qt.PROTECTION_FACTOR,recoveryBuffer:Qt.RECOVERY_BUFFER,consecutiveLimit:Qt.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function Hs(){return It()&&Re()}function rE(){Wt=null,zn=null}function Ff(){return Wt&&zn&&Date.now()-zn<Bf?Wt:Ci()}async function Xn(){if(Wt&&zn&&Date.now()-zn<Bf)return Wt;if(!Hs())return console.warn("Firebase not available - returning defaults"),Ci();try{const n=await Vf(),t=await $l();if(n){const e={settings:n.settings||Ci().settings,taxYears:n.taxYears||{},history:t||[],lastModified:n.lastModified,checksum:n.checksum};return Wt=e,zn=Date.now(),e}}catch(n){console.error("Error loading from Firebase:",n)}return Ci()}async function To(n){if(!Hs())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=sE(n),await Qw({settings:n.settings,taxYears:n.taxYears,lastModified:n.lastModified,checksum:n.checksum}),Wt=n,zn=Date.now()}catch(t){throw console.error("Error saving to Firebase:",t),new Error("Failed to save decision data")}}function sE(n){const t={settings:n.settings,taxYears:n.taxYears,historyCount:n.history.length,lastHistoryDate:n.history.length>0?n.history[n.history.length-1].date:null};return _d(t)}async function Zn(){return(await Xn()).settings}async function ql(n){const t=await Xn();t.settings={...t.settings,...n},await To(t)}function jl(){return{pa:ne.PERSONAL_ALLOWANCE,brl:ne.BASIC_RATE_LIMIT,hrl:ne.HIGHER_RATE_LIMIT,cpi:.04,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function iE(n){const e=Ff().taxYears[n];return e||jl()}async function Io(n){const e=(await Xn()).taxYears[n];return e||jl()}async function So(n,t){console.log(`saveTaxYearConfig: Saving tax year ${n}`,t);const e=await Xn();e.taxYears[n]={...iE(n),...t},await To(e),console.log(`saveTaxYearConfig: Saved tax year ${n}, yearSetupComplete=${e.taxYears[n].yearSetupComplete}`)}async function oE(n){const t=Wt||await Xn(),e=(t.history||[]).filter(s=>s.taxYear===n),r=e.reduce((s,i)=>s+(i.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${n}, found ${e.length} records, total ISA used: ${r}`),console.log("recalculateIsaSavingsUsed: History records:",e.map(s=>({date:s.date,isa:s.isa}))),t.taxYears[n]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${n}, creating default`),t.taxYears[n]=jl()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${t.taxYears[n].isaSavingsUsed}`),t.taxYears[n].isaSavingsUsed=r,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${t.taxYears[n].isaSavingsUsed}`),await To(t),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),r}async function aE(n){const t=await Io(n),e=t.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${n}, yearSetupComplete=${t.yearSetupComplete}, result=${e}`),e}async function Ws(){return(await Xn()).taxYears}function lE(n={}){let e=[...Ff().history];return n.taxYear&&(e=e.filter(r=>r.taxYear===n.taxYear)),n.startDate&&(e=e.filter(r=>r.date>=n.startDate)),n.endDate&&(e=e.filter(r=>r.date<=n.endDate)),n.sortDesc?e.sort((r,s)=>s.date.localeCompare(r.date)):e.sort((r,s)=>r.date.localeCompare(s.date)),n.limit&&(e=e.slice(0,n.limit)),e}async function zf(n={}){if(Hs())try{return await $l(n)}catch(t){console.error("Error loading history from Firebase:",t)}return lE(n)}async function cE(n){if(!Hs())throw new Error("Must be logged in to save history");if(await Jw(n),Wt){const t=Wt.history.findIndex(e=>e.date===n.date);t>=0?Wt.history[t]=n:Wt.history.push(n),Wt.history.sort((e,r)=>e.date.localeCompare(r.date))}}async function uE(n){if(!Hs())throw new Error("Must be logged in to delete history");await Xw(n),Wt&&(Wt.history=Wt.history.filter(t=>t.date!==n))}async function Hl(n){const t=await Zn(),e=await Ws(),r=t.spStartDate,s=t.spWeeklyAmount||0;if(!r||!s){let f=null;if(r){const{formatStatePensionDate:m}=await Uc(async()=>{const{formatStatePensionDate:v}=await Promise.resolve().then(()=>sd);return{formatStatePensionDate:v}},void 0,import.meta.url);f=m(r)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:f}}const{calculateStatePensionForTaxYear:i,getTimeUntilStatePension:a,parseStatePensionDate:l}=await Uc(async()=>{const{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:v}=await Promise.resolve().then(()=>sd);return{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:v}},void 0,import.meta.url),c=i({taxYear:n,spStartDate:r,weeklyAmount:s,taxYearConfigs:e}),d=a(r);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function dE(n){const t=Sp(n);t.stdSipp=n.sippDraw-(n.boostAmount||0),await cE(t),n.taxYear&&await oE(n.taxYear)}function Ao(n,t,e=0){const r=Ua(e);let s=n.equityStart,i=n.bondStart,a=n.cashStart,l=n.hodlEnabled?n.hodlStart!==void 0?n.hodlStart:n.hodlValue:0,c=0,d=null,f=0,m=0,v=0,E=0,I=!1,x=!1,b=null,P=0,D=-1;const C=[],N=[];let F=1;C.push({year:0,month:0,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:0,source:"None",inProtection:!1,equityMin:n.equityMin,bondMin:n.bondMin,cashMax:n.cashTarget});for(let V=0;V<n.years*12;V++){const T=Math.floor(V/12),g=V%12,y=g>=3?T:T-1;if(y!==D&&(P=0,D=y),V>0&&V%12===0){const it=t.inflation[T]||.025;N.push(it),F*=1+it}const w=t.equity[T]||0,S=t.inflation[T]||.025,A=T>0?t.inflation[T-1]||.025:S,_=wr(n.equityMin,T,n.duration,F,!0),ot=wr(n.bondMin,T,n.duration,F,!0),X=wr(n.cashTarget,T,n.duration,F,!1),ct=fE(n,T,F,N),Ft=ct;let ht=I?ct*n.protectionMult:ct;I&&(P+=Ft-ht);const zt=hE(S,w,A,r),ft=Math.max(.005,S+.012);if(s*=1+Math.pow(1+w,1/12)-1,i*=1+Math.pow(1+zt,1/12)-1,a*=1+Math.pow(1+ft,1/12)-1,l>0){const oe=(r()-.5)*2*.06;let ae=0;w<-.1?ae=Math.min(.15,Math.abs(w)*.4):w<-.05&&(ae=Math.abs(w)*.2);let xt=.069+oe+ae;xt=Math.max(-.08,Math.min(.18,xt)),l*=1+Math.pow(1+xt,1/12)-1}const gt=s+i,$=_+ot;I&&gt>$+5e3&&(I=!1,E=0,m=Math.max(m,v),v=0),I&&(f++,v++);let vt=0;if(!I&&P>0&&gt>$+15e3){let it=g>=3?15-g:3-g;it<1&&(it=1);const At=gt-$-15e3,oe=Math.min(P/it,At/it),ae=Ft*.5;vt=Math.min(oe,ae),vt>50&&(ht+=vt,P-=vt)}let Z="Growth";if(!I&&gt>=$+ht){const it=Math.max(0,s-_),At=Math.max(0,i-ot),oe=it+At;if(oe>0){if(s-=ht*it/oe,i-=ht*At/oe,E=0,Z="Growth",a<X){const ae=gt-$-ht;if(ae>5e3){const xt=Math.min((X-a)*.3,ae*.5);s-=xt*it/oe,i-=xt*At/oe,a+=xt}}}else a-=ht,Z="Cash"}else if(a>=ht)a-=ht,E++,Z="Cash",!n.disableProtection&&E>=n.consecutiveLimit&&(I=!0);else{const it=ht-a;a=0,i>it?(i-=it,Z="Bond"):s>it?(s-=it,Z="Equity"):l>it?(l-=it,c+=it,d===null&&(d=V),Z="HODL"):(x=!0,b=V)}if(s=Math.max(0,s),i=Math.max(0,i),a=Math.max(0,a),(g===0||V===n.years*12-1||x)&&C.push({year:T+g/12,month:V,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:ht,boostAmount:vt,source:Z,inProtection:I,equityMin:_,bondMin:ot,cashMax:X}),x)break}return m=Math.max(m,v),{failed:x,years:x?b/12:n.years,failMonth:b,final:s+i+a,finalEquity:s,finalBond:i,finalCash:a,finalHodl:l,protMonths:f,maxConsec:m,hodlUsed:c,hodlUsedMonth:d,hist:C,seed:e}}function hE(n,t,e,r){let s=.15,i=.3,a=.2,l=.1,c=.1,d=.15;const f=e!==void 0?e:n,m=f>.045,v=f>.07;if(m){const C=r()>.3?1:.5;v?(s=.15+.35*C,i=.3-.2*C,d=.15-.1*C,l=.1+.05*C):(s=.15+.2*C,i=.3-.1*C,d=.15-.05*C)}m&&r()<.15&&(s=.2,i=.25,d=.12);const E=n+.005+ns(0,.03,r),I=.04-(n>.04?(n-.04)*.5:0)+ns(0,.05,r),x=.03+n*.3+ns(0,.08,r),b=n*.8+ns(0,.15,r),P=Math.max(.005,n+.005),D=t*.5+ns(0,.02,r);return s*E+i*I+a*x+l*b+c*P+d*D}function fE(n,t,e,r){n.taxMode==="frozen"?n.pa:n.pa*e;const s=n.taxMode==="frozen"?n.brl:n.brl*e,i=n.baseSalary*e;let a=n.other;for(const f of r)a*=1+Math.min(f,.04);let l=0;if(n.spStartYear!==void 0){if(t>=n.spStartYear&&n.spWeeklyAmount>0){const f=n.spWeeklyAmount*52;t===n.spStartYear&&n.spFirstYearRatio!==void 0?l=f*n.spFirstYearRatio*e:l=f*e}}else n.statePensionYear!==void 0&&(l=t>=n.statePensionYear?(n.statePension||0)*e:0);const c=a+l;return Math.max(0,Math.min(s,i)-c)/12}function Uf(n,t=1e3){const e=Object.keys(_s).map(Number).sort((s,i)=>s-i),r=[];for(let s=0;s<t;s++){const i=Ua(s*12345),a={equity:{},inflation:{}};for(let l=0;l<n.years;l++){const c=e[Math.floor(i()*e.length)];a.equity[l]=_s[c],a.inflation[l]=Fa[c]||.025}r.push(Ao(n,a,s))}return r}function $f(n){const t=Object.keys(_s).map(Number).sort((s,i)=>s-i),e=Math.max(...t),r=[];for(const s of t){if(s+n.years-1>e)continue;const i={equity:{},inflation:{}};for(let l=0;l<n.years;l++)i.equity[l]=_s[s+l]||0,i.inflation[l]=Fa[s+l]||.025;const a=Ao(n,i,s);a.startYear=s,r.push(a)}return r}function pE(n,t){const e={equity:{},inflation:{}};for(let r=0;r<n.years;r++)e.equity[r]=t.equity[r%t.equity.length],e.inflation[r]=t.inflation[r%t.inflation.length];return Ao(n,e,999)}function mE(n){const t=n.filter(e=>e.failed).length;return(n.length-t)/n.length*100}function qf(n){const t=n.filter(l=>!l.failed),e=n.filter(l=>l.failed),r=n.map(l=>l.years).sort((l,c)=>l-c),s=t.map(l=>l.final).sort((l,c)=>l-c),i=n.map(l=>l.protMonths).sort((l,c)=>l-c),a=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:n.length,successCount:t.length,failCount:e.length,successRate:mE(n),survival:{p5:a(r,.05),p10:a(r,.1),p25:a(r,.25),p50:a(r,.5),p75:a(r,.75),p90:a(r,.9),p95:a(r,.95),min:r[0],max:r[r.length-1]},finalValue:{p5:a(s,.05),p10:a(s,.1),p25:a(s,.25),p50:a(s,.5),p75:a(s,.75),p90:a(s,.9),p95:a(s,.95),min:s[0]||0,max:s[s.length-1]||0,avg:t.reduce((l,c)=>l+c.final,0)/(t.length||1)},minYears:r[0],p10Years:a(r,.1),medianYears:a(r,.5),medianFinal:a(s,.5),p10Final:a(s,.1),p90Final:a(s,.9),avgFinal:t.reduce((l,c)=>l+c.final,0)/(t.length||1),protection:{runsWithProtection:n.filter(l=>l.protMonths>0).length,pctWithProtection:n.filter(l=>l.protMonths>0).length/n.length*100,avgMonths:i.reduce((l,c)=>l+c,0)/n.length,maxMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,p50Months:a(i,.5),p90Months:a(i,.9),p95Months:a(i,.95)},runsWithProtection:n.filter(l=>l.protMonths>0).length,avgProtMonths:i.reduce((l,c)=>l+c,0)/n.length,maxProtMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,hodl:{runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,pctUsingHodl:n.filter(l=>l.hodlUsed>0).length/n.length*100,avgUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...n.map(l=>l.hodlUsed||0))},runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,avgHodlUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...n.map(l=>l.hodlUsed||0)),failures:e.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function Ys(n){if(!n)return null;const t={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},e=n.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(e)){const s=new Date(e);if(!isNaN(s.getTime()))return s}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(e)){const[s,i,a]=e.split("/").map(Number);return new Date(a,i-1,s)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(e)){const[s,i,a]=e.split("-").map(Number);return new Date(a,i-1,s)}let r=e.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(r){const s=parseInt(r[1]),i=t[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}if(r=e.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),r){const s=t[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=e.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),r){const s=t[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=e.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),r){const s=parseInt(r[1]),i=t[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}return null}function ki(n){const t=typeof n=="string"?Ys(n):n;if(!t||isNaN(t.getTime()))return"";const e=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${t.getDate()} ${e[t.getMonth()]} ${t.getFullYear()}`}function gE(n){const{taxYear:t,spStartDate:e,weeklyAmount:r,taxYearConfigs:s={}}=n;if(!e||!r||r<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const i=typeof e=="string"?Ys(e):e;if(!i||isNaN(i.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const a=za(i);Rp(t);const l=Pp(t),c=[...new Set([a,t,...Object.keys(s)])].sort(),d=c.indexOf(a),f=c.indexOf(t);if(f<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:ki(i)};let m=1;for(let x=d;x<f;x++){const b=c[x],P=s[b],D=(P==null?void 0:P.cpi)||.025;m*=1+D}const v=r*m;if(t===a){const b=Math.max(0,(l.getTime()-i.getTime())/6048e5),P=v*b;return{annual:P,monthly:P/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(b*10)/10,startDate:ki(i)}}const I=v*52;return{annual:I,monthly:I/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:ki(i)}}function yE(n,t=new Date){const e=typeof n=="string"?Ys(n):n;if(!e||isNaN(e.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const r=e.getTime()-t.getTime(),s=r<=0;if(s)return{years:0,months:0,totalMonths:0,isPast:!0};const i=Math.floor(r/(30.44*24*60*60*1e3)),a=Math.floor(i/12),l=i%12;return{years:a,months:l,totalMonths:i,isPast:s}}const sd=Object.freeze(Object.defineProperty({__proto__:null,calculateStatePensionForTaxYear:gE,formatStatePensionDate:ki,getTimeUntilStatePension:yE,parseStatePensionDate:Ys},Symbol.toStringTag,{value:"Module"}));let fn=null,Un=null;const jf=5e3;function Ar(){return{settings:{equityMin:Qt.EQUITY_MIN,bondMin:Qt.BOND_MIN,cashTarget:Qt.CASH_TARGET,duration:Qt.DURATION_YEARS,baseSalary:Qt.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:ne.PERSONAL_ALLOWANCE,brl:ne.BASIC_RATE_LIMIT,hrl:ne.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Ho.PROTECTION_MULTIPLIER,consecutiveLimit:Qt.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Ho.HODL_ENABLED,hodlValue:Ho.HODL_VALUE},lastModified:null,checksum:null}}function Wl(){return It()&&Re()}function vE(){fn=null,Un=null}function _E(){return fn&&Un&&Date.now()-Un<jf?fn:Ar()}async function Hf(){if(fn&&Un&&Date.now()-Un<jf)return fn;if(!Wl())return console.warn("Firebase not available - returning defaults"),Ar();try{const n=await tE();if(n){const t={settings:n.settings||Ar().settings,lastModified:n.lastModified,checksum:n.checksum};return fn=bE(t),Un=Date.now(),fn}}catch(n){console.error("Error loading stress data from Firebase:",n)}return Ar()}async function wE(n){if(!Wl())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=EE(n),await Of({settings:n.settings,lastModified:n.lastModified,checksum:n.checksum}),fn=n,Un=Date.now()}catch(t){throw console.error("Error saving stress data to Firebase:",t),new Error("Failed to save stress data")}}function EE(n){return _d(n.settings)}function bE(n){const t={...Ar()};return n.settings&&(t.settings={...t.settings,...n.settings},n.settings.pacwMin!==void 0&&n.settings.equityMin===void 0&&(t.settings.equityMin=n.settings.pacwMin),n.settings.cgtMin!==void 0&&n.settings.bondMin===void 0&&(t.settings.bondMin=n.settings.cgtMin),n.settings.csh2Target!==void 0&&n.settings.cashTarget===void 0&&(t.settings.cashTarget=n.settings.csh2Target),t.settings.hodlEnabled===void 0&&(t.settings.hodlEnabled=!1),t.settings.hodlValue===void 0&&(t.settings.hodlValue=25e3)),t.lastModified=n.lastModified,t.checksum=n.checksum,t}function TE(){return _E().settings}async function An(){return(await Hf()).settings}async function Yl(n){const t=await Hf();t.settings={...t.settings,...n},await wE(t)}async function IE(){if(!Wl())throw new Error("Must be logged in to reset settings");const n=Ar();await Of({settings:n.settings,lastModified:new Date().toISOString()}),vE()}function SE(n){if(!n.spStartDate||!n.spWeeklyAmount)return{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const t=Ys(n.spStartDate);if(!t)return console.warn("Could not parse spStartDate:",n.spStartDate),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const e=new Date,r=365.25*24*60*60*1e3,s=Math.max(0,(t.getTime()-e.getTime())/r),i=Math.floor(s),a=365,l=Math.floor((t-new Date(t.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function Gl(n={},t=null){const e=t||TE(),r=SE(e);return{equityStart:n.equityStart??e.equityMin,bondStart:n.bondStart??e.bondMin,cashStart:n.cashStart??e.cashTarget,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,years:n.years??e.duration,duration:e.duration,baseSalary:e.baseSalary,other:e.other,spStartYear:r.spStartYear,spWeeklyAmount:r.spWeeklyAmount,spFirstYearRatio:r.spFirstYearRatio,pa:e.pa,brl:e.brl,hrl:e.hrl,taxMode:e.taxMode,protectionMult:e.protectionMult,consecutiveLimit:e.consecutiveLimit,disableProtection:e.disableProtection,hodlEnabled:e.hodlEnabled,hodlValue:e.hodlValue}}function H(n,t=null){const e=Math.abs(n),r=t!==null?t:e<100,s=Math.abs(n).toLocaleString("en-GB",{minimumFractionDigits:r?2:0,maximumFractionDigits:r?2:0});return n<0?`-£${s}`:`£${s}`}function id(n,t){const e=AE(n);t.innerHTML=e}function AE(n){var w,S,A,_,ot;const t=n,e=t.calculationDetails||{};let r="";const s=t.isTaxEfficientYear??t.taxEfficient,i=t.protectionInducedTaxEfficiency||!1;let a,l,c;if(i?(a="info",l="Protection-Induced Tax Efficiency",c="↑"):s?(a="success",l="Tax-Efficient Year",c="✓"):(a="warning",l="Tax-Inefficient Year",c="!"),r+=`<div class="decision-mode ${a}">
    <span class="mode-icon">${c}</span>
    <span class="mode-label">${l}</span>
    ${t.inProtection?'<span class="protection-badge">PROTECTION</span>':""}
  </div>`,s&&t.yearlyIsaSavingsAllocation>0){const X=t.cumulativeIsaSavingsUsed||0,ct=t.yearlyIsaSavingsAllocation,Ft=Math.max(0,ct-X),mt=ct>0?X/ct*100:0;r+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(mt,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${H(X)} of ${H(ct)}</span>
        <span>Remaining: ${H(Ft)}</span>
      </div>
    </div>`}if(t.alerts&&t.alerts.length>0){r+='<div class="alerts">';for(const X of t.alerts){const ct=xE(X.severity);r+=`<div class="alert ${ct}">${X.message}</div>`}r+="</div>"}r+='<div class="recommendation-card">',r+="<h3>Monthly Recommendation</h3>",r+='<div class="draw-row primary">',r+='<span class="label">SIPP Withdrawal</span>',r+=`<span class="value">${H(t.sippDraw)}</span>`,r+="</div>",t.isaDraw>0&&(r+='<div class="draw-row">',r+='<span class="label">ISA Top-up</span>',r+=`<span class="value">${H(t.isaDraw)}</span>`,r+="</div>"),t.other>0&&(r+='<div class="draw-row muted">',r+='<span class="label">Other Pension</span>',r+=`<span class="value">${H(t.other)}</span>`,r+="</div>"),t.statePension>0&&(r+='<div class="draw-row muted">',r+='<span class="label">State Pension</span>',r+=`<span class="value">${H(t.statePension)}</span>`,r+="</div>"),r+='<div class="divider"></div>';const d=t.sippDraw+t.other+t.statePension,f=d*12,m=t.pa||12570,v=t.brl||50270;let E=0;f>m&&(f<=v?E=(f-m)*.2:E=(v-m)*.2+(f-v)*.4);const I=d-E/12+t.isaDraw;r+='<div class="draw-row total">',r+='<span class="label">Total Monthly Income</span>',r+=`<span class="value">${H(I)}</span>`,r+="</div>",t.boostAmount>0&&(r+='<div class="boost-indicator">',r+='<span class="boost-label">Includes Tax Boost:</span>',r+=`<span class="boost-value">+${H(t.boostAmount)}</span>`,r+="</div>"),r+="</div>",r+='<div class="source-card">',r+="<h4>Withdraw From</h4>",r+=`<div class="source-label ${t.source.toLowerCase()}">${t.source}</div>`,t.source==="Growth"&&(t.drawFromEquity>0||t.drawFromBond>0)&&(r+='<div class="source-breakdown">',t.drawFromEquity>0&&(r+=`<div class="source-item">Equity: ${H(t.drawFromEquity)}</div>`),t.drawFromBond>0&&(r+=`<div class="source-item">Bond: ${H(t.drawFromBond)}</div>`),r+="</div>"),r+="</div>",r+='<div class="fund-status">',r+="<h4>Fund Status</h4>";const x=t.equity+t.bond+t.cash,b=t.adjEquityMin+t.adjBondMin+t.adjCashTarget,P=x-b,D=b>0?P/b*100:0;r+='<div class="fund-grid">';const C=t.equity-t.adjEquityMin;r+=ia("Equity",t.equity,t.adjEquityMin,C);const N=t.bond-t.adjBondMin;r+=ia("Bond",t.bond,t.adjBondMin,N);const F=t.cash-t.adjCashTarget;r+=ia("Cash",t.cash,t.adjCashTarget,F),r+="</div>";const V=P>=0?"healthy":"warning";r+=`<div class="overall-status ${V}">`,r+=`<span>Total Surplus: ${H(P)}</span>`,r+=`<span>(${D.toFixed(1)}% above target)</span>`,r+="</div>",r+="</div>",r+='<div class="tax-info">',r+="<h4>Tax Summary</h4>",r+='<div class="tax-thresholds">',r+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${H(t.pa)}</span></div>`,r+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${H(t.brl)}</span></div>`,e.taxInfo&&(r+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${e.taxInfo.headroomToBRL>0?"success":"warning"}">${H(e.taxInfo.headroomToBRL)}</span></div>`),r+="</div>",r+='<div class="tax-comparison">',r+='<div class="tax-comparison-header">',r+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",r+="</div>";const T=((w=e.taxInfo)==null?void 0:w.monthlyTax)||E/12,g=t.taxPaidYTD||T,y=t.taxProjectedAnnual||((S=e.taxInfo)==null?void 0:S.annualTax)||E;if(r+='<div class="tax-comparison-row">',r+='<div class="label">Tax Paid</div>',r+=`<div>${H(T)}</div>`,r+=`<div>${H(g)}</div>`,r+=`<div>${H(y)}</div>`,r+="</div>",s||((A=e.taxInfo)==null?void 0:A.taxSavedAnnual)>0){const X=t.taxSavedMonthly||((_=e.taxInfo)==null?void 0:_.taxSavedMonthly)||0,ct=t.taxSavedYTD||X,Ft=t.taxSavedProjectedAnnual||((ot=e.taxInfo)==null?void 0:ot.taxSavedAnnual)||0;Ft>0&&(r+='<div class="tax-comparison-row saved">',r+='<div class="label">Tax Saved</div>',r+=`<div class="success">-${H(X)}</div>`,r+=`<div class="success">-${H(ct)}</div>`,r+=`<div class="success">-${H(Ft)}</div>`,r+="</div>")}if(r+="</div>",e.taxInfo&&typeof e.taxInfo.effectiveRate=="number"&&!isNaN(e.taxInfo.effectiveRate)){const X=e.taxInfo.effectiveRate*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${X<=20?"success":X<=40?"warning":"danger"}">${X.toFixed(1)}%</span>
    </div>`}else if(e.taxInfo&&e.taxInfo.annualTaxable>0&&e.taxInfo.annualTax>=0){const X=e.taxInfo.annualTax/e.taxInfo.annualTaxable*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${X<=20?"success":X<=40?"warning":"danger"}">${X.toFixed(1)}%</span>
    </div>`}if(r+="</div>",t.rebalanceNeeded&&t.rebalanceActions.length>0){r+='<div class="rebalance-card">',r+="<h4>Rebalancing Suggestions</h4>",r+="<ul>";for(const X of t.rebalanceActions)r+=`<li>${X}</li>`;r+="</ul>",r+="</div>"}return r+='<div class="mode-explanation">',r+="<h4>Why This Recommendation?</h4>",r+=`<p>${e.reason||"Standard calculation based on your settings."}</p>`,!e.hasSufficientIsa&&e.isaNeededMonthly>0&&(r+=`<p class="isa-warning">To enable tax-efficient mode, you need ${H(e.totalIsaNeeded)} in your ISA (${t.remainingMonths} months remaining in tax year).</p>`),r+="</div>",r+='<details class="debug-section">',r+="<summary>Calculation Details</summary>",r+="<pre>"+JSON.stringify(e,null,2)+"</pre>",r+="</details>",r}function ia(n,t,e,r){return`<div class="fund-cell ${r>=0?"healthy":"deficit"}">
    <div class="fund-name">${n}</div>
    <div class="fund-current">${H(t)}</div>
    <div class="fund-min">Min: ${H(e)}</div>
    <div class="fund-surplus">${r>=0?"+":""}${H(r)}</div>
  </div>`}function xE(n){switch(n){case mi.DANGER:return"alert-danger";case mi.WARNING:return"alert-warning";case mi.SUCCESS:return"alert-success";case mi.INFO:default:return"alert-info"}}function RE(){return`
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
  `}async function PE(n){const t=vd(n),e=za(t),r=t.getMonth()+1;return await aE(e)?{showWizard:!1,taxYear:e,isApril:r===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:e,isApril:r===4,reason:`Tax year ${e} has not been set up`}}function CE(n,t){return n*(1+t)}function kE(n){const{targetAnnualGross:t,brl:e,pa:r=12570,remainingMonths:s,grossIncomeToDate:i=0}=n,a=I=>I<=r?0:I<=e?(I-r)*.2:(e-r)*.2+(I-e)*.4,l=Math.max(0,e-i);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:e,reducedSalaryOption:e,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(t<=e)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:e,reducedSalaryOption:e,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=a(t),d=t-c,f=a(e),m=e-f,v=Math.max(0,d-m),E=v/12*s;return{isaNeeded:E,isaNeededAnnual:v,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:e,reducedSalaryOption:e,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:f,reason:`Need £${Math.round(E).toLocaleString()} ISA/Savings for tax efficiency`}}function DE(n,t,e){return e?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:n>=t?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:t-n,options:[{key:"increase",label:`Increase ISA to £${Math.round(t).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function ME(n){const t=vd(n),e=za(t),s=t.getMonth()+1===4,i=kp(t),a=await Zn(),l=await Io(e),c=await Ws(),d=Object.keys(c).sort(),f=d.indexOf(e)-1,m=f>=0?c[d[f]]:null,v=await Hl(e),E=(m==null?void 0:m.cpi)||.025,I=CE(a.baseSalary,E);return{taxYear:e,selectedMonth:n,isApril:s,remainingMonths:i,baseSalary:a.baseSalary,suggestedSalary:I,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:E,other:(m==null?void 0:m.other)||0},statePension:v,existingConfig:l.yearSetupComplete?l:null}}function Wf(n){const{targetSalary:t,brl:e,pa:r=12570,other:s=0,statePension:i=0,isaSavingsAllocation:a=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=n,f=A=>A<=r?0:A<=e?(A-r)*.2:(e-r)*.2+(A-e)*.4,m=s/12,v=i/12,E=m+v;let I,x;if(!d)I=t/12-E,x=0;else{const A=Math.max(0,e-c),_=Math.max(0,A/l-E);I=Math.min(t/12-E,_),x=a/l}const b=(I+E)*12,D=f(b)/12,C=I+E,N=C>0?D/C:0,F=I*N,V=m*N,T=v*N,g=I-F,y=m-V,w=v-T,S=g+y+w+x;return{sipp:{gross:I,tax:F,net:g},other:{gross:m,tax:V,net:y},statePension:{gross:v,tax:T,net:w},isa:{gross:x,tax:0,net:x},totalGross:I+m+v+x,totalTax:D,totalNet:S,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:I,monthlyIsa:x,monthlyOther:m,monthlyStatePension:v,monthlyTotal:S}}function NE(n){var x,b,P,D,C,N,F,V,T,g,y;const{pa:t,brl:e,hrl:r,cpi:s,other:i,isaSavingsAllocation:a,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:f,confirmedSalary:m,remainingMonths:v,statePension:E,monthlyBreakdown:I}=n;return{pa:t,brl:e,hrl:r,cpi:s,other:i,isaSavingsAllocation:l?a:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:f||4,remainingMonths:v||12,yearSetupComplete:!0,confirmedSalary:m,statePension:E||0,expectedMonthly:I?{sipp:{gross:((x=I.sipp)==null?void 0:x.gross)||0,tax:((b=I.sipp)==null?void 0:b.tax)||0,net:((P=I.sipp)==null?void 0:P.net)||0},other:{gross:((D=I.other)==null?void 0:D.gross)||0,tax:((C=I.other)==null?void 0:C.tax)||0,net:((N=I.other)==null?void 0:N.net)||0},statePension:{gross:((F=I.statePension)==null?void 0:F.gross)||0,tax:((V=I.statePension)==null?void 0:V.tax)||0,net:((T=I.statePension)==null?void 0:T.net)||0},isa:{gross:((g=I.isa)==null?void 0:g.gross)||0,tax:0,net:((y=I.isa)==null?void 0:y.net)||0},totalGross:I.totalGross||0,totalTax:I.totalTax||0,totalNet:I.totalNet||0}:null}}let $n=null,Ps=null,ce=1,Q=null,B={};async function LE(n,t,e){$n=n,Ps=e,ce=1,B={},Q=await ME(t),B={pa:Q.defaults.pa,brl:Q.defaults.brl,hrl:Q.defaults.hrl,cpi:Q.defaults.cpi,other:Q.defaults.other,grossIncomeToDate:0,confirmedSalary:Q.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},vs()}async function VE(n){return await PE(n)}function vs(){if(!$n||!Q)return;const n=Q.isApril?6:7;$n.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${Q.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${Q.isApril?"Setting up for the full tax year":`Starting in ${Kl(Q.selectedMonth)} - ${Q.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${FE(n,ce)}
        </div>

        ${OE()}
      </div>
    </div>
  `,zE()}function OE(){if(Q.isApril,Q.isApril)switch(ce){case 1:return od();case 2:return ad();case 3:return ld();case 4:return cd();case 5:return ud();case 6:return dd();default:return""}else switch(ce){case 1:return od();case 2:return BE();case 3:return ad();case 4:return ld();case 5:return cd();case 6:return ud();case 7:return dd();default:return""}}function od(){return`
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
  `}function BE(){const n=Kl(Q.selectedMonth),t=jE(Q.selectedMonth);return`
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
  `}function ad(){const n=B.cpi!==void 0?B.cpi:Q.defaults.cpi,t=(n*100).toFixed(1),e=Q.baseSalary,r=Math.round(e*(1+n));return`
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
  `}function ld(){const n=Q.statePension,t=n.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(n.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${n.yearsUntil} years until state pension</span>`;return`
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
  `}function cd(){Gs();const n=kE({targetAnnualGross:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:Q.statePension.amount,remainingMonths:Q.remainingMonths,grossIncomeToDate:B.grossIncomeToDate});return B._isaCalc=n,n.brlExhausted?`
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
  `}function ud(){Gs();const n=B._isaCalc,t=DE(B.isaSavingsAllocation,(n==null?void 0:n.isaNeeded)||0,(n==null?void 0:n.brlExhausted)||!1);if(t.sufficient&&!t.isBrlExhausted)return B.isTaxEfficient=!0,B.taxEfficiencyChoice="efficient",setTimeout(()=>{ce++,vs()},0),`
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
  `}function dd(){Gs();const n=Wf({targetSalary:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:Q.statePension.amount,isaSavingsAllocation:B.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:B.grossIncomeToDate,isTaxEfficient:B.isTaxEfficient}),t=B.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",e=B.isTaxEfficient?"success":"warning",r=s=>`£${Math.round(s).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${Q.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${Kl(Q.selectedMonth)}</span>
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
  `}function FE(n,t){let e="";for(let r=1;r<=n;r++){const s=r<t?"done":r===t?"active":"";e+=`<div class="wizard-dot ${s}"></div>`}return e}function zE(){$n.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",()=>UE(t.dataset.action))}),window._updateWizardSalary=function(){const t=document.getElementById("wizCPI"),e=document.getElementById("wizSalary"),r=document.getElementById("cpiDisplay"),s=document.getElementById("suggestedSalaryDisplay");if(t&&e&&r&&s){const i=parseFloat(t.value)||0,a=i/100,l=Q.baseSalary,c=Math.round(l*(1+a));r.textContent=i.toFixed(1),s.textContent=c.toLocaleString(),e.value=c,B.cpi=a,B.confirmedSalary=c}}}function UE(n){Gs();const t=Q.isApril?6:7;switch(n){case"cancel":Yf(),Ps&&Ps({completed:!1,cancelled:!0});break;case"next":ce<t&&(ce++,vs());break;case"back":ce>1&&(ce--,vs());break;case"apply-choice":$E(),ce++,vs();break;case"finish":qE();break}}function $E(){var t;const n=(t=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:t.value;switch(B.taxEfficiencyChoice=n,n){case"increase":B.isaSavingsAllocation=B._isaCalc.isaNeeded,B.isTaxEfficient=!0;break;case"reduced":B.confirmedSalary=B.brl,B.isaSavingsAllocation=0,B.isTaxEfficient=!0;break;case"inefficient":B.isaSavingsAllocation=0,B.isTaxEfficient=!1;break}}function Gs(){const n=document.getElementById("wizPA");n&&(B.pa=parseFloat(n.value)||12570);const t=document.getElementById("wizBRL");t&&(B.brl=parseFloat(t.value)||50270);const e=document.getElementById("wizHRL");e&&(B.hrl=parseFloat(e.value)||125140);const r=document.getElementById("wizCPI");r&&(B.cpi=(parseFloat(r.value)||4)/100);const s=document.getElementById("wizSalary");s&&(B.confirmedSalary=parseFloat(s.value)||3e4);const i=document.getElementById("wizOther");i&&(B.other=parseFloat(i.value)||0);const a=document.getElementById("wizISA");a&&(B.isaSavingsAllocation=parseFloat(a.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(B.grossIncomeToDate=parseFloat(l.value)||0)}async function qE(){Gs();const n=Wf({targetSalary:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:Q.statePension.amount,isaSavingsAllocation:B.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:B.grossIncomeToDate,isTaxEfficient:B.isTaxEfficient}),t=NE({pa:B.pa,brl:B.brl,hrl:B.hrl,cpi:B.cpi,other:B.other,isaSavingsAllocation:B.isaSavingsAllocation,isTaxEfficient:B.isTaxEfficient,taxEfficiencyChoice:B.taxEfficiencyChoice,grossIncomeToDate:B.grossIncomeToDate,startMonth:parseInt(Q.selectedMonth.split("-")[1]),confirmedSalary:B.confirmedSalary,remainingMonths:Q.remainingMonths,statePension:Q.statePension.amount,monthlyBreakdown:n});console.log(`Tax Year Wizard: Saving config for ${Q.taxYear}`,t);try{await So(Q.taxYear,t),console.log(`Tax Year Wizard: Successfully saved config for ${Q.taxYear}`)}catch(e){console.error(`Tax Year Wizard: Failed to save config for ${Q.taxYear}`,e),alert(`Error saving tax year configuration: ${e.message}`);return}Yf(),Ps&&Ps({completed:!0,taxYear:Q.taxYear,config:t,wizardInputs:B})}function Yf(){$n&&($n.innerHTML="",$n.style.display="none")}function Kl(n){const[t,e]=n.split("-").map(Number);return new Date(t,e-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function jE(n){const[t,e]=n.split("-").map(Number);return new Date(t,e-2,1).toLocaleString("default",{month:"long"})}function HE(){return`
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
  `}function WE(n={},t=null){const e=Gl(n,t),r=Uf(e),s=qf(r);return{results:r,stats:s,config:e}}function YE(n={},t=null){const e=Gl(n,t),r=$f(e),s=qf(r);return{results:r,stats:s,config:e}}function GE(n={}){const t=Gl(n),e={};for(const[r,s]of Object.entries(Ap))e[r]={...s,result:pE(t,s)};return e}let Ae=null,oa=null,vr=!1;function KE(n,t){console.log("initAuthScreen: initializing"),Ae=n,oa=t,vr=!1,Hw(e=>{console.log("AuthScreen: auth state change received:",e?e.email:"null","processed:",vr),e&&oa&&!vr?(console.log("AuthScreen: calling onAuthSuccessCallback"),vr=!0,oa(e)):e?console.log("AuthScreen: skipping callback, already processed or no callback"):(vr=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),Gf(),console.log("initAuthScreen: complete")}function Gf(){if(Ae){if(!It()){Ae.innerHTML=`
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
    `;return}Ae.innerHTML=`
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
  `,QE()}}function QE(){const n=Ae.querySelectorAll(".auth-screen-tab");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const a=document.getElementById("signinForm"),l=document.getElementById("signupForm");i.dataset.tab==="signin"?(a.style.display="block",l.style.display="none"):(a.style.display="none",l.style.display="block"),Ks()})}),document.getElementById("signinForm").addEventListener("submit",JE),document.getElementById("signupForm").addEventListener("submit",XE),document.getElementById("forgotPasswordBtn").addEventListener("click",ZE),document.getElementById("googleSigninBtn").addEventListener("click",tb)}function vn(n){const t=document.getElementById("authScreenError");t&&(t.textContent=n,t.style.display="block")}function Ks(){const n=document.getElementById("authScreenError");n&&(n.style.display="none")}async function JE(n){n.preventDefault(),Ks();const t=document.getElementById("signinEmail").value.trim(),e=document.getElementById("signinPassword").value;if(!t||!e){vn("Please enter email and password");return}try{await Yw(t,e)}catch(r){console.error("Sign in error:",r),vn(xo(r.code))}}async function XE(n){n.preventDefault(),Ks();const t=document.getElementById("signupName").value.trim(),e=document.getElementById("signupEmail").value.trim(),r=document.getElementById("signupPassword").value;if(!t||!e||!r){vn("Please fill in all fields");return}if(r.length<6){vn("Password must be at least 6 characters");return}try{await Ww(e,r,t)}catch(s){console.error("Sign up error:",s),vn(xo(s.code))}}async function ZE(){Ks();const n=document.getElementById("signinEmail").value.trim();if(!n){vn("Please enter your email address first");return}try{await Kw(n),alert("Password reset email sent. Check your inbox.")}catch(t){console.error("Reset password error:",t),vn(xo(t.code))}}async function tb(){Ks();try{await Gw()}catch(n){console.error("Google sign in error:",n),vn(xo(n.code))}}function xo(n){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[n]||"An error occurred. Please try again."}function La(){console.log("hideAuthScreen: hiding auth screen, element=",!!Ae),Ae&&(Ae.style.display="none",console.log("hideAuthScreen: set display to none"))}function Kf(){vr=!1,Ae&&(Ae.style.display="block",Gf())}function eb(){return`
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
  `}let Tn=null,Va=null,j={introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35},Ee="intro",kt=1;function nb(){Ee="intro",kt=1,j={introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35}}function Oa(n,t){Tn=n,Va=t,nb(),sn()}function sn(){Tn&&(Ee==="intro"?rb():Ee==="stress"?ob():Ee==="decision"&&lb())}function rb(){Tn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">A tool to help you plan and manage your SIPP pension drawdown</div>

        <div class="wizard-progress">
          ${Ql(2,kt)}
        </div>

        ${kt===1?sb():ib()}
      </div>
    </div>
  `,Jl()}function sb(){return`
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
  `}function ib(){return`
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
  `}function ob(){Tn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${Ql(6,kt)}
        </div>

        ${ab(kt)}
      </div>
    </div>
  `,Jl()}function ab(n){switch(n){case 1:return`
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
      `;default:return""}}function lb(){Tn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${Ql(4,kt)}
        </div>

        ${cb(kt)}
      </div>
    </div>
  `,Jl()}function cb(n){switch(n){case 1:return`
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
      `;default:return""}}function Ql(n,t){let e="";for(let r=1;r<=n;r++){const s=r<t?"done":r===t?"active":"";e+=`<div class="wizard-dot ${s}"></div>`}return e}function Jl(){Tn.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",()=>ub(t.dataset.action))})}function ub(n){switch(Qf(),n){case"skip-all":aa();break;case"next":Ee==="intro"?kt<2&&(kt++,sn()):Ee==="stress"?kt<6&&(kt++,sn()):Ee==="decision"&&kt<4&&(kt++,sn());break;case"back":kt>1&&(kt--,sn());break;case"start-stress":Ee="stress",kt=1,sn();break;case"skip-stress":Ee="decision",kt=1,j.decisionSalary=j.baseSalary,j.decisionEquity=j.equityMin,j.decisionBond=j.bondMin,j.decisionCash=j.cashTarget,j.decisionDuration=j.duration,sn();break;case"finish-stress":Ee="decision",kt=1,j.decisionSalary=j.baseSalary,j.decisionEquity=j.equityMin,j.decisionBond=j.bondMin,j.decisionCash=j.cashTarget,j.decisionDuration=j.duration,sn();break;case"skip-decision":aa();break;case"finish":aa();break}}function Qf(){const n=document.getElementById("wizBaseSalary");n&&(j.baseSalary=parseFloat(n.value)||3e4);const t=document.getElementById("wizOther");t&&(j.otherIncome=parseFloat(t.value)||0);const e=document.getElementById("wizSpStartDate");e&&(j.spStartDate=e.value.trim()||"");const r=document.getElementById("wizSpWeeklyAmount");r&&(j.spWeeklyAmount=parseFloat(r.value)||0);const s=document.getElementById("wizEquityMin");s&&(j.equityMin=parseFloat(s.value)||25e4);const i=document.getElementById("wizBondMin");i&&(j.bondMin=parseFloat(i.value)||2e5);const a=document.getElementById("wizCashTarget");a&&(j.cashTarget=parseFloat(a.value)||5e4);const l=document.getElementById("wizDuration");l&&(j.duration=parseInt(l.value)||35);const c=document.getElementById("wizTaxMode");c&&(j.taxMode=c.value);const d=document.getElementById("wizDBaseSalary");d&&(j.decisionSalary=parseFloat(d.value)||3e4);const f=document.getElementById("wizDEquityMin");f&&(j.decisionEquity=parseFloat(f.value)||25e4);const m=document.getElementById("wizDBondMin");m&&(j.decisionBond=parseFloat(m.value)||2e5);const v=document.getElementById("wizDCashTarget");v&&(j.decisionCash=parseFloat(v.value)||5e4);const E=document.getElementById("wizDDuration");E&&(j.decisionDuration=parseInt(E.value)||35)}function aa(){Qf(),Va&&Va(j)}function db(){Tn&&(Tn.style.display="none")}function hb(){return`
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
  `}function Ro(){const t=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:t?"rgba(15,15,26,1)":"#ffffff",text:t?"#c9d1d9":"#1f2937",cardBg:t?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}const Kn=new Map;let pr=-1;function hd(n,t,e,r,s,i){const a=s-e,l=i-r,c=a*a+l*l;if(c===0)return Math.sqrt((n-e)*(n-e)+(t-r)*(t-r));const d=Math.max(0,Math.min(1,((n-e)*a+(t-r)*l)/c)),f=e+d*a,m=r+d*l;return Math.sqrt((n-f)*(n-f)+(t-m)*(t-m))}function fb(n,t,e={}){const r=Ro(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:20,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=e.years||35,m={};for(let b=0;b<=f;b++)m[b]=[];t.forEach(b=>{b.hist.forEach(P=>{const D=Math.floor(P.year);m[D]!==void 0&&m[D].push(P.total)})});const v=[];for(let b=0;b<=f;b++){const P=m[b].sort((C,N)=>C-N);if(P.length===0)continue;const D=C=>P[Math.floor(P.length*C)]||0;v.push({year:b,p5:D(.05),p10:D(.1),p25:D(.25),p50:D(.5),p75:D(.75),p90:D(.9),p95:D(.95)})}if(v.length===0)return;const E=Math.max(...v.map(b=>b.p90))*1.15,I=b=>l.left+b/f*c,x=b=>a-l.bottom-b/E*d;s.strokeStyle=r.grid,s.lineWidth=1;for(let b=0;b<=5;b++){const P=l.top+b/5*d;s.beginPath(),s.moveTo(l.left,P),s.lineTo(i-l.right,P),s.stroke()}s.fillStyle=r.cone,s.beginPath(),v.forEach((b,P)=>{const D=I(b.year);P===0?s.moveTo(D,x(b.p95)):s.lineTo(D,x(b.p95))});for(let b=v.length-1;b>=0;b--)s.lineTo(I(v[b].year),x(v[b].p5));s.closePath(),s.fill(),s.fillStyle=r.coneMid,s.beginPath(),v.forEach((b,P)=>{const D=I(b.year);P===0?s.moveTo(D,x(b.p90)):s.lineTo(D,x(b.p90))});for(let b=v.length-1;b>=0;b--)s.lineTo(I(v[b].year),x(v[b].p10));s.closePath(),s.fill(),s.fillStyle=r.coneInner,s.beginPath(),v.forEach((b,P)=>{const D=I(b.year);P===0?s.moveTo(D,x(b.p75)):s.lineTo(D,x(b.p75))});for(let b=v.length-1;b>=0;b--)s.lineTo(I(v[b].year),x(v[b].p25));s.closePath(),s.fill(),e.glide&&e.glide.length>0&&(s.strokeStyle=r.glidepath,s.lineWidth=2,s.setLineDash([6,3]),s.beginPath(),e.glide.forEach((b,P)=>{const D=I(b.year),C=x(b.min);P===0?s.moveTo(D,C):s.lineTo(D,C)}),s.stroke(),s.setLineDash([])),s.strokeStyle=r.primary,s.lineWidth=3,s.beginPath(),v.forEach((b,P)=>{const D=I(b.year),C=x(b.p50);P===0?s.moveTo(D,C):s.lineTo(D,C)}),s.stroke(),s.strokeStyle="rgba(248,81,73,0.6)",s.lineWidth=1.5,s.setLineDash([4,2]),s.beginPath(),v.forEach((b,P)=>{const D=I(b.year);P===0?s.moveTo(D,x(b.p10)):s.lineTo(D,x(b.p10))}),s.stroke(),s.setLineDash([]),s.strokeStyle=r.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(l.left,x(0)),s.lineTo(i-l.right,x(0)),s.stroke(),s.setLineDash([]),s.fillStyle=r.muted,s.font="11px sans-serif",s.textAlign="right";for(let b=0;b<=5;b++){const P=E*(1-b/5);s.fillText(le(P),l.left-10,l.top+b/5*d+4)}s.textAlign="center";for(let b=0;b<=f;b+=5)s.fillText(`Yr ${b}`,I(b),a-l.bottom+20);Kn.set(n.id,{percentiles:v,xScale:I,yScale:x,padding:l,chartWidth:c,chartHeight:d,years:f,maxValue:E,type:"cone"}),vb(n)}function pb(n,t,e={}){const r=Ro(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:20,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=e.years||35,m=e.startValue||1e6,v=t.slice(0,100),E=v.filter(C=>C.failed),I=v.filter(C=>!C.failed);let x;if(E.length>0)x=m*2;else{const C=I.map(F=>F.final).sort((F,V)=>F-V),N=C[Math.floor(C.length*.5)]||m;x=Math.max(N*1.3,m*1.5)}const b=C=>l.left+C/f*c,P=C=>a-l.bottom-Math.min(C,x)/x*d;s.strokeStyle=r.grid,s.lineWidth=1;for(let C=0;C<=5;C++){const N=l.top+C/5*d;s.beginPath(),s.moveTo(l.left,N),s.lineTo(i-l.right,N),s.stroke()}s.fillStyle=r.muted,s.font="11px sans-serif",s.textAlign="right";for(let C=0;C<=5;C++){const N=x*(1-C/5);s.fillText(le(N),l.left-10,l.top+C/5*d+4)}s.textAlign="center";for(let C=0;C<=f;C+=5)s.fillText(`Yr ${C}`,b(C),a-l.bottom+20);const D=[];e.glide&&e.glide.length>0&&(s.strokeStyle=r.glidepath,s.lineWidth=3,s.setLineDash([8,4]),s.beginPath(),e.glide.forEach((C,N)=>{const F=b(C.year),V=P(C.min);N===0?s.moveTo(F,V):s.lineTo(F,V)}),s.stroke(),s.setLineDash([])),I.forEach((C,N)=>{const F=C.hist.map(V=>({x:b(V.year),y:P(V.total)}));D.push({run:C,pts:F,failed:!1,idx:N}),s.strokeStyle=r.trajectory,s.lineWidth=.5,s.beginPath(),F.forEach((V,T)=>{T===0?s.moveTo(V.x,V.y):s.lineTo(V.x,V.y)}),s.stroke()}),E.forEach((C,N)=>{const F=C.hist.map(V=>({x:b(V.year),y:P(V.total)}));D.push({run:C,pts:F,failed:!0,idx:I.length+N}),s.strokeStyle=r.trajectoryFailed,s.lineWidth=2,s.beginPath(),F.forEach((V,T)=>{T===0?s.moveTo(V.x,V.y):s.lineTo(V.x,V.y)}),s.stroke()}),s.strokeStyle=r.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(l.left,P(0)),s.lineTo(i-l.right,P(0)),s.stroke(),s.setLineDash([]),Kn.set(n.id,{results:v,paths:D,xScale:b,yScale:P,padding:l,chartWidth:c,chartHeight:d,years:f,maxValue:x,glide:e.glide,type:"trajectory"}),_b(n,r)}function mb(n,t,e={}){const r=Ro(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:30,right:20,bottom:55,left:60},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=t.map(C=>C.protMonths),m=f.length,v=Math.max(...f),E=Math.max(1,Math.ceil(v/15)),I={};f.forEach(C=>{const N=Math.floor(C/E)*E;I[N]=(I[N]||0)+1});const x=Object.keys(I).map(Number).sort((C,N)=>C-N),b=Math.max(...Object.values(I)),P=c/(x.length||1),D=[];s.strokeStyle=r.grid,s.lineWidth=1,s.fillStyle=r.muted,s.font="10px sans-serif",s.textAlign="right";for(let C=0;C<=4;C++){const N=l.top+C/4*d;s.beginPath(),s.moveTo(l.left,N),s.lineTo(i-l.right,N),s.stroke();const F=Math.round(b*(1-C/4));s.fillText(`${F} runs`,l.left-5,N+4)}x.forEach((C,N)=>{const F=I[C],V=F/b*d,T=l.left+N*P+2,g=a-l.bottom-V,y=P-4;s.fillStyle=C===0?r.success:r.warning,s.fillRect(T,g,y,V),D.push({x:T,y:g,w:y,h:V,months:C,monthsEnd:C+E-1,count:F,pct:(F/m*100).toFixed(1)})}),s.fillStyle=r.muted,s.font="10px sans-serif",s.textAlign="center",x.forEach((C,N)=>{if(N%2===0||x.length<12){const F=E>1?`${C}-${C+E-1}`:C.toString();s.fillText(F,l.left+N*P+P/2,a-l.bottom+15)}}),s.fillText("Protection Months",i/2,a-5),s.save(),s.translate(12,a/2),s.rotate(-Math.PI/2),s.textAlign="center",s.fillText("Number of Runs",0,0),s.restore(),Kn.set(n.id,{bars:D,totalRuns:m,type:"histogram"}),wb(n)}function gb(n,t,e={}){const r=Ro(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:180,bottom:60,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle=r.bg,s.fillRect(0,0,i,a);const f=Object.keys(t),m=e.years||35;let v=0;f.forEach(b=>{const P=t[b].result;P&&P.hist&&P.hist.forEach(D=>{D.total>v&&(v=D.total)})}),v*=1.1;const E=b=>l.left+b/m*c,I=b=>l.top+d-b/v*d;yb(s,l,c,d,m,v,e.title||"Scenario Comparison",r);const x=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];f.forEach((b,P)=>{const D=t[b].result;if(!D||!D.hist)return;s.beginPath(),s.strokeStyle=x[P%x.length],s.lineWidth=2.5,D.hist.forEach((N,F)=>{const V=E(N.year),T=I(N.total);F===0?s.moveTo(V,T):s.lineTo(V,T)}),s.stroke();const C=l.top+15+P*24;s.fillStyle=x[P%x.length],s.fillRect(i-l.right+15,C,20,4),s.font="11px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="left",s.fillText(t[b].name||b,i-l.right+40,C+5),D.final/1e3,s.fillStyle=r.muted,s.fillText(`${le(D.final)}`,i-l.right+40,C+18)})}function yb(n,t,e,r,s,i,a,l){n.font="bold 14px system-ui, sans-serif",n.fillStyle=l.text,n.textAlign="center",n.fillText(a,t.left+e/2,t.top-20),n.strokeStyle=l.grid,n.lineWidth=1;for(let c=0;c<=5;c++){const d=t.top+r*c/5;n.beginPath(),n.moveTo(t.left,d),n.lineTo(t.left+e,d),n.stroke();const f=i*(5-c)/5;n.font="11px system-ui, sans-serif",n.fillStyle=l.muted,n.textAlign="right",n.fillText(le(f),t.left-10,d+4)}for(let c=0;c<=s;c+=5){const d=t.left+c/s*e;n.beginPath(),n.moveTo(d,t.top),n.lineTo(d,t.top+r),n.stroke(),n.textAlign="center",n.fillText(`Y${c}`,d,t.top+r+20)}n.font="12px system-ui, sans-serif",n.textAlign="center",n.fillText("Years",t.left+e/2,t.top+r+45),n.save(),n.translate(20,t.top+r/2),n.rotate(-Math.PI/2),n.fillText("Fund Value",0,0),n.restore()}function le(n){return n>=1e6?`£${(n/1e6).toFixed(1)}M`:n>=1e3?`£${(n/1e3).toFixed(0)}k`:`£${n.toFixed(0)}`}function vb(n,t){const e=n._coneHoverListener;e&&n.removeEventListener("mousemove",e);const r=s=>{const i=Kn.get(n.id);if(!i||i.type!=="cone")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=(s.clientX-a.left)*l,{percentiles:d,padding:f,chartWidth:m,years:v}=i,E=(c-f.left)/m*v,I=Math.round(E);if(I<0||I>v){_n();return}const x=d.find(P=>P.year===I);if(!x){_n();return}const b=`
      <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
        <strong style="color:#f0c674;">Year ${I}</strong>
      </div>
      <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
        <span style="color:#8b8b9b;">95th percentile:</span><span>${le(x.p95)}</span>
        <span style="color:#8b8b9b;">75th percentile:</span><span>${le(x.p75)}</span>
        <span style="color:#8b8b9b;">Median (50th):</span><span style="color:#f0c674;font-weight:bold;">${le(x.p50)}</span>
        <span style="color:#8b8b9b;">25th percentile:</span><span>${le(x.p25)}</span>
        <span style="color:#8b8b9b;">10th percentile:</span><span style="color:#f85149;">${le(x.p10)}</span>
        <span style="color:#8b8b9b;">5th percentile:</span><span>${le(x.p5)}</span>
      </div>
    `;Xl(s.clientX,s.clientY,b)};n._coneHoverListener=r,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",_n)}function _b(n,t){const e=n._trajHoverListener;e&&n.removeEventListener("mousemove",e);const r=n._trajLeaveListener;r&&n.removeEventListener("mouseleave",r);const s=a=>{const l=Kn.get(n.id);if(!l||l.type!=="trajectory")return;const c=n.getBoundingClientRect(),d=n.width/c.width,f=n.height/c.height,m=(a.clientX-c.left)*d,v=(a.clientY-c.top)*f,{paths:E,padding:I,chartWidth:x,chartHeight:b}=l;if(m<I.left||m>I.left+x||v<I.top||v>I.top+b){_n(),pr!==-1&&(pr=-1,la(n,l,t,null));return}let P=null,D=12*d;E.filter(N=>N.failed).forEach(N=>{for(let F=0;F<N.pts.length-1;F++){const V=hd(m,v,N.pts[F].x,N.pts[F].y,N.pts[F+1].x,N.pts[F+1].y);V<D&&(D=V,P=N)}}),P||E.filter(N=>!N.failed).forEach(N=>{for(let F=0;F<N.pts.length-1;F++){const V=hd(m,v,N.pts[F].x,N.pts[F].y,N.pts[F+1].x,N.pts[F+1].y);V<D&&(D=V,P=N)}});const C=P?P.idx:-1;if(C!==pr&&(pr=C,la(n,l,t,P)),P){const N=P.run,F=P.failed?"#f85149":"#2ea043",V=P.failed?"❌":"✅",T=P.failed?"FAILED":"SUCCESS";let g=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${F};">${V} ${T}</strong>
          <span style="float:right;color:#8b8b9b;font-size:11px;">Run #${P.idx+1}</span>
        </div>
        <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
      `;N.startYear&&(g+=`<span style="color:#8b8b9b;">Start year:</span><span>${N.startYear}</span>`),g+=`<span style="color:#8b8b9b;">Duration:</span><span>${N.years.toFixed(1)} years</span>`,g+=`<span style="color:#8b8b9b;">Final balance:</span><span>${le(N.final)}</span>`,g+=`<span style="color:#8b8b9b;">Protection months:</span><span>${N.protMonths}</span>`,g+=`<span style="color:#8b8b9b;">Longest streak:</span><span>${N.maxConsec} months</span>`,N.hodlUsed>0&&(g+=`<span style="color:#8b8b9b;">HODL used:</span><span>${le(N.hodlUsed)}</span>`),g+="</div>",P.failed&&N.failMonth&&(g+=`<div style="margin-top:8px;padding-top:8px;border-top:1px solid #555;color:#f0c674;">💀 Depleted at year ${(N.failMonth/12).toFixed(1)}</div>`),Xl(a.clientX,a.clientY,g)}else _n()},i=()=>{if(_n(),pr!==-1){pr=-1;const a=Kn.get(n.id);a&&la(n,a,t,null)}};n._trajHoverListener=s,n._trajLeaveListener=i,n.addEventListener("mousemove",s),n.addEventListener("mouseleave",i)}function wb(n,t){const e=n._histHoverListener;e&&n.removeEventListener("mousemove",e);const r=s=>{const i=Kn.get(n.id);if(!i||i.type!=="histogram")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=n.height/a.height,d=(s.clientX-a.left)*l,f=(s.clientY-a.top)*c,{bars:m,totalRuns:v}=i;let E=null;if(m.forEach(I=>{d>=I.x&&d<=I.x+I.w&&f>=I.y&&f<=I.y+I.h&&(E=I)}),E){const I=E.months===0,x=I?"#2ea043":"#e1b12c",b=I?"🟢":"🟡",P=I?"No Protection":`${E.months}${E.monthsEnd>E.months?`-${E.monthsEnd}`:""} months`,D=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${x};">${b} ${P}</strong>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;">
          <span style="color:#8b8b9b;">Runs:</span><span>${E.count} of ${v}</span>
          <span style="color:#8b8b9b;">Percentage:</span><span>${E.pct}%</span>
        </div>
      `;Xl(s.clientX,s.clientY,D)}else _n()};n._histHoverListener=r,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",_n)}function la(n,t,e,r){const s=n.getContext("2d"),{width:i,height:a}=n,{paths:l,xScale:c,yScale:d,padding:f,chartWidth:m,chartHeight:v,years:E,maxValue:I,glide:x}=t;s.fillStyle="rgba(15,15,26,1)",s.fillRect(f.left,f.top,m,v),s.strokeStyle=e.grid,s.lineWidth=1;for(let b=0;b<=5;b++){const P=f.top+b/5*v;s.beginPath(),s.moveTo(f.left,P),s.lineTo(i-f.right,P),s.stroke()}x&&x.length>0&&(s.strokeStyle=e.glidepath,s.lineWidth=1.5,s.setLineDash([4,2]),s.beginPath(),x.forEach((b,P)=>{const D=c(b.year),C=d(b.min);P===0?s.moveTo(D,C):s.lineTo(D,C)}),s.stroke(),s.setLineDash([])),l.forEach(b=>{if(r&&b.idx===r.idx)return;const P=r?.15:b.failed?.8:.25;s.strokeStyle=b.failed?`rgba(248,81,73,${P})`:`rgba(46,160,67,${P})`,s.lineWidth=b.failed?2:.5,s.beginPath(),b.pts.forEach((D,C)=>{C===0?s.moveTo(D.x,D.y):s.lineTo(D.x,D.y)}),s.stroke()}),r&&(s.strokeStyle=r.failed?e.trajectoryFailedHover:e.trajectoryHover,s.lineWidth=4,s.shadowColor=r.failed?e.trajectoryFailedHover:e.trajectoryHover,s.shadowBlur=8,s.beginPath(),r.pts.forEach((b,P)=>{P===0?s.moveTo(b.x,b.y):s.lineTo(b.x,b.y)}),s.stroke(),s.shadowBlur=0),s.strokeStyle=e.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(f.left,d(0)),s.lineTo(i-f.right,d(0)),s.stroke(),s.setLineDash([])}function Xl(n,t,e){let r=document.getElementById("chartTooltip");r||(r=document.createElement("div"),r.id="chartTooltip",document.body.appendChild(r)),r.innerHTML=e,r.style.display="block",r.style.left=n+15+"px",r.style.top=t-10+"px"}function _n(){const n=document.getElementById("chartTooltip");n&&(n.style.display="none")}function Eb(){return`
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
  `}window._simEngine={runMonteCarlo:Uf,runHistorical:$f,simulate:Ao};window._constants={EQUITY_RETURNS:_s,INFLATION:Fa};window._mathUtils={seededRng:Ua};let bb=null,Tb=null;const Jf=document.createElement("style");Jf.textContent=RE()+eb()+hb()+HE()+Eb();document.head.appendChild(Jf);const Zl=document.getElementById("globalLoadingOverlay"),Ib=Zl.querySelector(".loading-text");function qr(n="Loading..."){Ib.textContent=n,Zl.classList.add("active")}function jr(){Zl.classList.remove("active")}document.getElementById("versionDisplay").textContent=`v${gd}`;document.getElementById("entryMonth").value=Cp();function Ji(n){const t=document.getElementById(n+"SpWeeklyAmount"),e=document.getElementById(n+"SpAnnualAmount");if(!t||!e)return;const r=parseFloat(t.value)||0,s=r*52;r>0?e.value="£"+s.toLocaleString("en-GB",{maximumFractionDigits:2}):e.value=""}["ds","ss"].forEach(n=>{const t=document.getElementById(n+"SpWeeklyAmount");t&&t.addEventListener("input",()=>Ji(n))});function Sb(n){const t=parseFloat(n);return isNaN(t)?"":t.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function Xf(){document.querySelectorAll('input[type="number"]').forEach(t=>{t.value,t.addEventListener("focus",function(e){setTimeout(()=>{this.select()},0)}),t.addEventListener("click",function(e){!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&this.select()})})}function Zf(){document.querySelectorAll('input[type="number"]').forEach(t=>{if(t.dataset.formatted)return;t.dataset.formatted="true";const e=t.closest(".input-with-unit")||t.parentElement,r=t.closest(".input-with-unit")!==null,s=document.createElement("span");s.className="number-format-overlay";const i=r?"34px":"14px";s.style.cssText=`
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
        `,getComputedStyle(e).position==="static"&&(e.style.position="relative");function a(){const l=parseFloat(t.value);!isNaN(l)&&l>=1e3&&document.activeElement!==t?(s.textContent=Sb(l),s.style.display="block",t.style.color="transparent"):(s.style.display="none",t.style.color="")}t._updateOverlay=a,t.addEventListener("focus",()=>{s.style.display="none",t.style.color=""}),t.addEventListener("blur",a),t.addEventListener("input",()=>{document.activeElement===t&&(s.style.display="none",t.style.color="")}),e.appendChild(s),a()})}function Po(){document.querySelectorAll('input[type="number"]').forEach(n=>{n._updateOverlay&&n._updateOverlay()})}setTimeout(()=>{Xf(),Zf()},100);const Ab=new MutationObserver(n=>{let t=!1;n.forEach(e=>{e.addedNodes.forEach(r=>{var s,i;r.nodeType===1&&((s=r.matches)!=null&&s.call(r,'input[type="number"]')||(i=r.querySelector)!=null&&i.call(r,'input[type="number"]'))&&(t=!0)})}),t&&setTimeout(()=>{Xf(),Zf()},50)});Ab.observe(document.body,{childList:!0,subtree:!0});let _r=null;async function tp(n,t="decision"){La(),db(),document.getElementById("mainApp").classList.remove("hidden"),document.getElementById("userEmail").textContent=n.email,await Co(),await Qs(),xb(),t==="stress"&&(document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),document.querySelector('.tab[data-tab="stress"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById("stress-content").classList.add("active"))}async function xb(){try{const n=await An(),t=await Zn();document.getElementById("entryEquity").value=t.equityMin||25e4,document.getElementById("entryBond").value=t.bondMin||2e5,document.getElementById("entryCash").value=t.cashTarget||5e4,document.getElementById("dsEquityMin").value=t.equityMin||25e4,document.getElementById("dsBondMin").value=t.bondMin||2e5,document.getElementById("dsCashTarget").value=t.cashTarget||5e4,document.getElementById("dsDuration").value=t.duration||35,document.getElementById("dsBaseSalary").value=t.baseSalary||3e4,document.getElementById("dsSpStartDate").value=t.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=t.spWeeklyAmount||"",Ji("ds"),document.getElementById("dsProtectionFactor").value=t.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=t.recoveryBuffer||1e4,document.getElementById("dsConsecutiveLimit").value=t.consecutiveLimit||3,["mc","hist","scen"].forEach(e=>{const r=document.getElementById(e+"Equity"),s=document.getElementById(e+"Bond"),i=document.getElementById(e+"Cash"),a=document.getElementById(e+"Years");r&&(r.value=n.equityMin),s&&(s.value=n.bondMin),i&&(i.value=n.cashTarget),a&&(a.value=n.duration)}),document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",Ji("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,Po(),console.log("All inputs initialized from stored settings")}catch(n){console.error("Error initializing inputs from settings:",n)}}async function Ba(n){console.log("Wizard completed with data:",n);try{await ql({baseSalary:n.decisionSalary,equityMin:n.decisionEquity,bondMin:n.decisionBond,cashTarget:n.decisionCash,duration:n.decisionDuration,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount}),await Yl({baseSalary:n.baseSalary,other:n.otherIncome,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,duration:n.duration,taxMode:n.taxMode}),document.getElementById("entryEquity").value=n.decisionEquity,document.getElementById("entryBond").value=n.decisionBond,document.getElementById("entryCash").value=n.decisionCash,document.getElementById("mcEquity").value=n.equityMin,document.getElementById("mcBond").value=n.bondMin,document.getElementById("mcCash").value=n.cashTarget,document.getElementById("mcYears").value=n.duration,Po()}catch(e){console.error("Error saving wizard settings:",e)}const t=js();tp(t,"stress")}KE(document.getElementById("authScreen"),async n=>{console.log("Auth success callback triggered for:",n.email);try{console.log("Checking for existing cloud data...");const t=await nE();console.log("Has cloud data:",t),t?(console.log("Existing user - showing main app"),tp(n)):(console.log("New user - showing setup wizard"),La(),document.getElementById("setupWizard").style.display="block",Oa(document.getElementById("setupWizard"),Ba))}catch(t){console.error("Error in auth callback:",t),La(),document.getElementById("setupWizard").style.display="block",Oa(document.getElementById("setupWizard"),Ba)}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{await Lf(),document.getElementById("mainApp").classList.add("hidden"),Kf()}catch(n){console.error("Logout error:",n)}});const Rb=60*60*1e3;let ca=null;function ep(){ca&&clearTimeout(ca),Re()&&(ca=setTimeout(async()=>{if(Re()){alert("You have been logged out due to inactivity (1 hour).");try{await Lf(),document.getElementById("mainApp").classList.add("hidden"),Kf()}catch(n){console.error("Auto-logout error:",n)}}},Rb))}const Pb=["mousedown","mousemove","keydown","scroll","touchstart","click"];Pb.forEach(n=>{document.addEventListener(n,()=>{ep()},{passive:!0})});ep();document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await eE(),console.log("Data wiped successfully"),rE(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden"),document.getElementById("setupWizard").style.display="block",Oa(document.getElementById("setupWizard"),Ba),alert("All data has been deleted. Please complete the setup wizard to start fresh.")}catch(e){console.error("Reset error:",e),alert("Error resetting data: "+e.message)}});document.querySelectorAll(".tab").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active")),document.getElementById(`${n.dataset.tab}-content`).classList.add("active"),n.dataset.tab==="history"&&await Co(),n.dataset.tab==="taxyears"&&await Qs(),n.dataset.tab==="stress"&&await tc()})});const ss=document.querySelector(".tabs"),fd=document.querySelector(".tabs-wrapper");if(ss&&fd){const n=()=>{const t=ss.scrollLeft+ss.clientWidth>=ss.scrollWidth-10;fd.classList.toggle("scrolled-end",t)};ss.addEventListener("scroll",n),n()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>t.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(t=>t.classList.add("hidden")),document.getElementById(`stress-${n.dataset.stresstab}`).classList.remove("hidden"),n.dataset.stresstab==="stresssettings"&&await tc()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>t.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(t=>t.classList.add("hidden")),document.getElementById(`decision-${n.dataset.decisiontab}`).classList.remove("hidden"),n.dataset.decisiontab==="decisionsettings"&&await rp()})});function Cb(n){const[t,e]=n.split("-").map(Number);return e>=4?t%100+"/"+(t+1)%100:(t-1)%100+"/"+t%100}function kb(n){const[t,e]=n.split("-").map(Number);return Math.max(0,(e>=4?t:t-1)-2026)}function ua(n,t,e,r,s){if(s){const i=Math.max(0,1-t/e);return n*r*i}return n*r}function pd(n,t,e){return n<=t?n:n<=e?t+(n-t)*.8:t+(e-t)*.8+(n-e)*.6}async function md(n,t,e,r){const s=await Zn(),i=await zf(),a=await Ws(),l=Cb(n),c=kb(n),[d,f]=n.split("-").map(Number);if(!a[l])throw new Error(`Tax year ${l} is not configured. Please add it in the Settings tab before calculating.`);const m=a[l],v=m.pa||12570,E=m.brl||50270,I=m.other||0,x=m.isTaxEfficient!==!1,b=m.isaSavingsAllocation||0,P=m.grossIncomeToDate||0,D=m.confirmedSalary||s.baseSalary,C=i.find(J=>J.date===n),N=(C==null?void 0:C.isa)||0,F=Math.max(0,(m.isaSavingsUsed||0)-N),T=(await Hl(l)).amount||0;let g=1;for(let J=0;J<c;J++){const Ct=String((26+J)%100).padStart(2,"0")+"/"+String((27+J)%100).padStart(2,"0"),Gt=(a[Ct]||{}).cpi||.04;g*=1+Gt}const y=Math.round(ua(s.equityMin,c,s.duration,g,!0)),w=Math.round(ua(s.bondMin,c,s.duration,g,!0)),S=Math.round(ua(s.cashTarget,c,s.duration,g,!1)),A=t+e,_=y+w;let ot=!1,X=0;const ct=i.filter(J=>J.date<n);for(let J=ct.length-1;J>=0&&ct[J].source==="Cash";J--)X++;ct.length&&ct[ct.length-1].inProtection&&(ot=A<=_+(s.recoveryBuffer||1e4)),!ot&&A<_&&X+1>=(s.consecutiveLimit||3)&&(ot=!0);const Ft=f>=4?16-f:4-f,mt=Math.max(1,Ft),ht=D*g,zt=I+T;let ft,gt,$,vt=0,Z=0,it=!1,At=0;const ae=Math.max(0,b-F)/mt;if(x){const J=zt/12,Gt=i.filter(De=>De.taxYear===l&&De.date<n).reduce((De,_t)=>De+(_t.sipp||0)+(_t.other||0)+(_t.state||0),0),Xe=P+Gt,lr=Math.max(0,E-Xe),Pn=J*mt,_e=Math.max(0,(lr-Pn)/mt),we=ht/12,te=Math.min(we-J,_e),Kt=pd(ht,v,E)/12,Yr=Math.min(ht,E),cr=pd(Yr,v,E)/12,ti=Math.max(0,Kt-cr),ke=Math.min(ti,ae);if(At=ke,vt=te,ot)ft=te*(1-(s.protectionFactor||20)/100),gt=ke,$="Protection";else{ft=te,gt=ke,$="Tax-Efficient";const De=f>=4?d:d-1,_t=ct.filter(Mt=>{const[kn,ur]=Mt.date.split("-").map(Number);return(ur>=4?kn:kn-1)===De});let Cn=0,Ze=0;if(_t.forEach(Mt=>{Ze+=Mt.sipp||0,Mt.inProtection&&Mt.stdSipp&&(Cn+=Mt.stdSipp-Mt.sipp),Mt.boostAmount>0&&(Cn-=Mt.boostAmount)}),Cn>0){const Mt=Ze+ft*mt+zt,kn=E-Mt,ur=A-_-(s.recoveryBuffer||1e4);if(kn>0&&ur>0){const Me=kn/mt,ko=Cn/mt,Do=ur/mt;Z=Math.min(ko,Me,Do),Z>50&&(ft+=Z,$="Tax Boost")}}}}else{const J=ht/12,Ct=zt/12,Gt=Math.max(0,J-Ct);if(vt=Gt,gt=0,ot){ft=Gt*(1-(s.protectionFactor||20)/100),$="Protection";const Xe=f>=4?d:d-1,lr=ct.filter(we=>{const[te,Kt]=we.date.split("-").map(Number);return(Kt>=4?te:te-1)===Xe});let Pn=0;lr.forEach(we=>{Pn+=we.sipp||0});const _e=Pn+ft*mt+zt;if(_e<E){const te=(E-_e)/mt,Kt=A-_-(s.recoveryBuffer||1e4);Kt>0&&te>50&&(Z=Math.min(te,Kt/mt),Z>50&&(ft+=Z,it=!0,$="Protection-Induced Efficiency"))}}else ft=Gt,$="Tax-Inefficient"}let xt,me,tr=0,er=0,xn=0,Rn="";if(!ot&&A>=_+ft){xt="Growth";const J=Math.max(0,t-y),Ct=Math.max(0,e-w),Gt=J+Ct;Gt>0?(tr=ft*J/Gt,er=ft*Ct/Gt,me="Healthy"):(xt="Cash",xn=ft,me="At min")}else xt="Cash",xn=ft,me=ot?"Protection":"Below min",r<ft&&(Rn="Cash low!");let ge="";const nr=t-y,rr=e-w;if(nr>5e3&&rr<-5e3){const J=Math.floor(Math.min(nr,-rr)/1e3)*1e3;J>=5e3&&(ge=`Move £${J.toLocaleString()} Equity→Bond`)}else if(rr>5e3&&nr<-5e3){const J=Math.floor(Math.min(rr,-nr)/1e3)*1e3;J>=5e3&&(ge=`Move £${J.toLocaleString()} Bond→Equity`)}let sr="";const ir=S-r;if(ir>5e3&&xt==="Growth"&&!ot){const J=A-_-ft;if(J>1e4){const Ct=Math.floor(Math.min(ir*.3,J*.5)/1e3)*1e3;Ct>=5e3&&(sr=`Replenish Cash: Move £${Ct.toLocaleString()} from growth funds`)}}const Qe=[];Rn&&Qe.push({message:Rn,severity:"danger",type:"low-cash"}),Z>50&&Qe.push({message:`Tax Boost: +£${Math.round(Z).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),ge&&Qe.push({message:ge,severity:"warning",type:"rebalance"}),sr&&Qe.push({message:sr,severity:"info",type:"cash-replenish"});const Js=ft+I/12+T/12,ye=Js*12;let ve=0;ye>v&&(ye<=E?ve=(ye-v)*.2:ve=(E-v)*.2+(ye-E)*.4);const Hr=Js-ve/12+gt,Rt=f>=4?d:d-1,Pt=ct.filter(J=>{const[Ct,Gt]=J.date.split("-").map(Number);return(Gt>=4?Ct:Ct-1)===Rt});let Je=Pt.reduce((J,Ct)=>J+(Ct.taxPaidMonthly||Ct.monthlyTax||0),0);Je+=ve/12;const Wr=Pt.length+1,Xs=Je/Wr*12,or=ht/12;let Ce=0;or*12>v&&(or*12<=E?Ce=(or*12-v)*.2:Ce=(E-v)*.2+(or*12-E)*.4);const ar=Math.max(0,Ce/12-ve/12),Zs=F+At;return{date:n,taxYear:l,yearNumber:c,remainingMonths:mt,equity:t,bond:e,cash:r,isa:0,adjEquityMin:y,adjBondMin:w,adjCashTarget:S,pa:v,brl:E,other:I/12,statePension:T/12,sippDraw:ft,stdSipp:vt,isaDraw:gt,totalMonthlyNet:Hr,isTaxEfficientYear:x,yearlyIsaSavingsAllocation:b,cumulativeIsaSavingsUsed:Zs,isaSavingsUsedThisMonth:At,taxPaidYTD:Je,taxProjectedAnnual:Xs,taxSavedMonthly:ar,taxSavedYTD:ar*Wr,taxSavedProjectedAnnual:ar*12,taxEfficient:x&&!it,inProtection:ot,protectionReason:ot?me:null,consecutiveCashDraws:X,protectionInducedTaxEfficiency:it,boostAmount:Z>50?Z:0,boostEligible:Z>50,source:xt,drawFromEquity:tr,drawFromBond:er,drawFromCash:xn,rebalanceNeeded:ge!=="",rebalanceActions:ge?[ge]:[],alerts:Qe,calculationDetails:{mode:$,reason:`${me} | ${$}`,totalGrowth:A,minGrowth:_,consec:X,stdSipp:ft,inputs:{baseSalary:s.baseSalary,confirmedSalary:D,targetGross:ht,cumInf:g,yearNum:c,taxYear:l,OTHER:I,STATE:T,PA:v,BRL:E,isTaxEfficientYear:x,yearlyIsaSavingsAllocation:b,grossIncomeToDate:P},taxInfo:{annualTaxable:ye,headroomToBRL:E-ye,annualTax:ve,monthlyNet:Hr}}}}window.handleDecisionSubmit=async function(n){n.preventDefault();const t=document.getElementById("entryMonth").value,e=parseFloat(document.getElementById("entryEquity").value)||0,r=parseFloat(document.getElementById("entryBond").value)||0,s=parseFloat(document.getElementById("entryCash").value)||0,i=[];if(t||i.push("Month"),!e&&e!==0&&i.push("Equity Fund"),!r&&r!==0&&i.push("Bond Balance"),!s&&s!==0&&i.push("Cash Balance"),i.length>0){alert(`Please fill in the following fields:

• `+i.join(`
• `));return}try{if((await VE(t)).showWizard){const c=document.getElementById("taxYearWizard");c.style.display="block",window._pendingDecisionForm={dateStr:t,equity:e,bond:r,cash:s},LE(c,t,async d=>{if(c.style.display="none",d&&d.completed)try{_r=await md(t,e,r,s);const f=document.getElementById("decisionOutput");id(_r,f),document.getElementById("saveBtn").disabled=!1}catch(f){console.error("Decision error after wizard:",f),alert("Error calculating decision: "+f.message)}});return}_r=await md(t,e,r,s);const l=document.getElementById("decisionOutput");id(_r,l),document.getElementById("saveBtn").disabled=!1}catch(a){console.error("Decision error:",a),alert("Error calculating decision: "+a.message)}};window.saveCurrentDecision=async function(){if(!_r){alert("No decision to save");return}if(!Re()){alert("Please sign in to save decisions");return}try{await dE(_r),alert("Decision saved to history"),document.getElementById("saveBtn").disabled=!0,await Co()}catch(n){console.error("Save error:",n),alert("Error saving: "+n.message)}};window.runMonteCarloUI=async function(){const n={equityStart:parseFloat(document.getElementById("mcEquity").value)||25e4,bondStart:parseFloat(document.getElementById("mcBond").value)||2e5,cashStart:parseFloat(document.getElementById("mcCash").value)||5e4,years:parseInt(document.getElementById("mcYears").value)||35};document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await An(),setTimeout(()=>{try{const{results:t,stats:e}=WE(n);bb=t,np(e,t,"Monte Carlo (1000 runs)","mcResults",n.years)}catch(t){console.error("Simulation error:",t),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}},50)};window.runHistoricalUI=async function(){const n={equityStart:parseFloat(document.getElementById("histEquity").value)||25e4,bondStart:parseFloat(document.getElementById("histBond").value)||2e5,cashStart:parseFloat(document.getElementById("histCash").value)||5e4,years:parseInt(document.getElementById("histYears").value)||35};document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await An(),setTimeout(()=>{try{const{results:t,stats:e}=YE(n);Tb=t,np(e,t,"Historical Analysis","histResults",n.years)}catch(t){console.error("Simulation error:",t),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}},50)};window.runScenariosUI=async function(){const n={equityStart:parseFloat(document.getElementById("scenEquity").value)||25e4,bondStart:parseFloat(document.getElementById("scenBond").value)||2e5,cashStart:parseFloat(document.getElementById("scenCash").value)||5e4,years:35};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',await An(),setTimeout(()=>{try{const t=GE(n);Vb(t,"scenResults")}catch(t){console.error("Scenario error:",t),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}},50)};function Db(n){if(!n.spStartDate||!n.spWeeklyAmount)return console.warn("State Pension not configured - spStartDate or spWeeklyAmount missing"),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const t=Mb(n.spStartDate);if(!t)return console.warn("Could not parse spStartDate:",n.spStartDate),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const e=new Date,r=365.25*24*60*60*1e3,s=Math.max(0,(t.getTime()-e.getTime())/r),i=Math.floor(s);t.getMonth(),t.getDate();const a=365,l=Math.floor((t-new Date(t.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function Mb(n){if(!n)return null;if(/^\d{4}-\d{2}-\d{2}$/.test(n))return new Date(n);if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,s,i]=n.split("/").map(Number);return new Date(i,s-1,r)}const t={january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};let e=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})$/i);if(e){const r=parseInt(e[1]),s=t[e[2].toLowerCase()],i=parseInt(e[3]);if(s!==void 0)return new Date(i,s,r)}if(e=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\d{4})$/i),e){const r=t[e[1].toLowerCase()],s=parseInt(e[2]),i=parseInt(e[3]);if(r!==void 0)return new Date(i,r,s)}return null}let da=!1;window.runOptimisationUI=async function(n){if(da)return;da=!0;const t=document.getElementById("optimiseBtn"+n),e=document.getElementById("optimiseResults"+n);t&&(t.disabled=!0),t&&(t.textContent="Optimising...");let r,s,i,a;n==="MC"?(r=document.getElementById("mcEquity"),s=document.getElementById("mcBond"),i=document.getElementById("mcCash"),a=document.getElementById("mcYears")):(r=document.getElementById("histEquity"),s=document.getElementById("histBond"),i=document.getElementById("histCash"),a=document.getElementById("histYears"));const l=+r.value,c=+s.value,d=+i.value,f=+a.value,m=l+c+d;e.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations...</div>';const v=await An(),E=JSON.parse(JSON.stringify(v));setTimeout(()=>{try{let I=null,x={equity:l,bond:c,cash:d,rate:0,avgProt:0,withProt:0,totalRuns:0};const b=[];for(let S=5;S<=30;S+=5)for(let A=20;A<=95-S;A+=5){const _=100-S-A;_>=0&&b.push({equity:Math.round(m*A/100),bond:Math.round(m*_/100),cash:Math.round(m*S/100)})}const{EQUITY_RETURNS:P,INFLATION:D}=window._constants,{simulate:C}=window._simEngine,{seededRng:N}=window._mathUtils,F=Object.keys(P).map(Number).sort((S,A)=>S-A),V=Math.max(...F),T=S=>{const A={equityStart:S.equity,bondStart:S.bond,cashStart:S.cash,years:f,equityMin:E.equityMin,bondMin:E.bondMin,cashTarget:E.cashTarget,duration:E.duration,baseSalary:E.baseSalary,other:E.other,...Db(E),pa:E.pa,brl:E.brl,hrl:E.hrl,taxMode:E.taxMode,protectionMult:E.protectionMult,consecutiveLimit:E.consecutiveLimit,disableProtection:E.disableProtection,hodlEnabled:E.hodlEnabled,hodlValue:E.hodlValue},_=[];if(n==="MC")for(let $=0;$<1e3;$++){const vt=N($*12345),Z={equity:{},inflation:{}};for(let it=0;it<f;it++){const At=F[Math.floor(vt()*F.length)];Z.equity[it]=P[At],Z.inflation[it]=D[At]||.025}_.push(C(A,Z,$))}else F.forEach($=>{if($+f-1>V)return;const vt={equity:{},inflation:{}};for(let Z=0;Z<f;Z++)vt.equity[Z]=P[$+Z]||0,vt.inflation[Z]=D[$+Z]||.025;_.push(C(A,vt,$))});const ot=_.filter($=>$.failed),X=_.filter($=>!$.failed),ct=(_.length-ot.length)/_.length*100,mt=_.map($=>$.protMonths).reduce(($,vt)=>$+vt,0)/_.length,ht=_.filter($=>$.protMonths>0).length,zt=X.map($=>$.final).sort(($,vt)=>$-vt),ft=zt.length>0?zt[Math.floor(zt.length*.5)]:0,gt=zt.length>0?zt[Math.floor(zt.length*.9)]:0;return{equity:S.equity,bond:S.bond,cash:S.cash,rate:ct,avgProt:mt,withProt:ht,totalRuns:_.length,medianFinal:ft,p90Final:gt}},y=T({equity:l,bond:c,cash:d});x.avgProt=y.avgProt,x.withProt=y.withProt,x.totalRuns=y.totalRuns,x.rate=y.rate,x.medianFinal=y.medianFinal,x.p90Final=y.p90Final,b.forEach(S=>{const A=T(S);A.avgProt<=x.avgProt&&(!I||A.rate>I.rate)&&(I=A)});let w="";if(I&&I.rate>x.rate){const S=I.medianFinal-x.medianFinal,A=x.medianFinal>0?S/x.medianFinal*100:0;w+='<div class="card" style="margin-top:20px;border-color:var(--success);">',w+='<h3 style="color:var(--success);margin-top:0;">Better Allocation Found</h3>',w+='<p style="color:var(--text-muted);margin-bottom:16px;">A different fund split could improve your success rate without increasing protection usage:</p>',w+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">',w+='<div style="padding:16px;background:rgba(0,0,0,0.2);border-radius:8px;">',w+='<div style="font-weight:500;margin-bottom:12px;color:var(--text-muted);">Your Current Split</div>',w+='<div style="font-size:24px;font-weight:600;color:var(--warning);">'+x.rate.toFixed(1)+"%</div>",w+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate</div>',w+='<div style="font-size:13px;">Equity: '+H(x.equity)+" ("+Math.round(x.equity/m*100)+"%)</div>",w+='<div style="font-size:13px;">Bonds: '+H(x.bond)+" ("+Math.round(x.bond/m*100)+"%)</div>",w+='<div style="font-size:13px;">Cash: '+H(x.cash)+" ("+Math.round(x.cash/m*100)+"%)</div>",w+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+x.avgProt.toFixed(0)+" mo | Median final: "+H(x.medianFinal)+"</div>",w+="</div>",w+='<div style="padding:16px;background:rgba(46,160,67,0.1);border-radius:8px;border:1px solid var(--success);">',w+='<div style="font-weight:500;margin-bottom:12px;color:var(--success);">Optimised Split</div>',w+='<div style="font-size:24px;font-weight:600;color:var(--success);">'+I.rate.toFixed(1)+"%</div>",w+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate (+'+(I.rate-x.rate).toFixed(1)+"%)</div>",w+='<div style="font-size:13px;">Equity: '+H(I.equity)+" ("+Math.round(I.equity/m*100)+"%)</div>",w+='<div style="font-size:13px;">Bonds: '+H(I.bond)+" ("+Math.round(I.bond/m*100)+"%)</div>",w+='<div style="font-size:13px;">Cash: '+H(I.cash)+" ("+Math.round(I.cash/m*100)+"%)</div>",w+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+I.avgProt.toFixed(0)+" mo | Median final: "+H(I.medianFinal)+"</div>",w+="</div>",w+="</div>",S<0?(w+='<div class="alert alert-warning" style="margin-bottom:16px;">',w+="<strong>Trade-off:</strong> The optimised allocation has a "+Math.abs(A).toFixed(0)+"% lower median final value. ",w+="This is because it likely has less equity exposure. You gain safety but may sacrifice some upside.",w+="</div>"):S>0&&(w+='<div class="alert alert-info" style="margin-bottom:16px;">',w+="<strong>Bonus:</strong> The optimised allocation also has a "+A.toFixed(0)+"% higher median final value!",w+="</div>"),w+='<div class="alert alert-info" style="margin-bottom:16px;">',w+="<strong>To apply this allocation:</strong> Click the button below to update your Settings with these new fund minimums.",w+="</div>",w+='<button onclick="applyOptimisedAllocationUI('+I.equity+","+I.bond+","+I.cash+')" style="width:100%;">Apply Optimised Allocation to Settings</button>',w+="</div>"}else w+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',w+='<h3 style="color:var(--primary);margin-top:0;">Your Allocation is Already Optimal</h3>',w+='<p style="color:var(--text-muted);">We tested '+b.length+" different fund splits. Your current allocation achieves the best success rate ("+x.rate.toFixed(1)+"%) without increasing protection usage.</p>",w+='<p style="font-size:13px;color:var(--text-muted);">Your protection: '+x.avgProt.toFixed(0)+" months average</p>",w+="</div>";e.innerHTML=w}catch(I){console.error("Optimisation error:",I),e.innerHTML='<div class="alert alert-danger">Error: '+I.message+"</div>"}finally{da=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation")}},50)};window.applyOptimisedAllocationUI=async function(n,t,e){if(document.getElementById("ssEquityMin").value=n,document.getElementById("ssBondMin").value=t,document.getElementById("ssCashTarget").value=e,document.getElementById("dsEquityMin").value=n,document.getElementById("dsBondMin").value=t,document.getElementById("dsCashTarget").value=e,document.getElementById("mcEquity").value=n,document.getElementById("mcBond").value=t,document.getElementById("mcCash").value=e,document.getElementById("histEquity").value=n,document.getElementById("histBond").value=t,document.getElementById("histCash").value=e,document.getElementById("scenEquity").value=n,document.getElementById("scenBond").value=t,document.getElementById("scenCash").value=e,Re())try{await Yl({equityMin:n,bondMin:t,cashTarget:e})}catch(r){console.error("Error saving optimised settings:",r)}alert("Settings updated! Run the test again to see the full results with your new allocation.")};const Nb={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function Lb(n){if(!n||n.length===0)return"";const t=n.filter(i=>i.failed).sort((i,a)=>i.years-a.years),e=n.filter(i=>i.protMonths>0).sort((i,a)=>a.protMonths-i.protMonths),r=t.length>0?t.slice(0,5):e.slice(0,5);if(r.length===0)return"";let s=`
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
      `;return r.forEach(i=>{const a=i.startYear||i.seed,l=Nb[a]||"-",c=i.failed?"danger":"success";s+=`
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
      `,s}function np(n,t,e,r,s){const i=n.successRate>=90?"success":n.successRate>=80?"warning":"danger",a=r.replace("Results",""),l=n.survival||{},c=n.finalValue||{},d=n.protection||{};let f=`
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
          ${r==="histResults"?Lb(t):""}

          <!-- Result Summary -->
          <div class="alert ${i==="success"?"alert-success":i==="warning"?"alert-warning":"alert-danger"}" style="margin-top: 24px;">
            ${n.successRate>=90?"Excellent! Very high probability of success.":n.successRate>=80?"Good but some downside risk. Consider adjustments.":"Warning: Significant risk of depletion."}
          </div>
        </div>
      `;document.getElementById(r).innerHTML=f,setTimeout(()=>{const m=document.getElementById(`${a}ConeChart`),v=document.getElementById(`${a}TrajChart`),E=document.getElementById(`${a}HistChart`);m&&t&&t.length>0&&fb(m,t,{years:s}),v&&t&&t.length>0&&pb(v,t,{years:s}),E&&t&&t.length>0&&mb(E,t,{})},50)}function Vb(n,t){let e='<div class="card"><h2>Scenario Analysis</h2>';e+=`
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
        `}e+="</div></div>",document.getElementById(t).innerHTML=e,setTimeout(()=>{const r=document.getElementById("scenCompChart");r&&n&&gb(r,n,{years:35,title:"Scenario Comparison"})},50)}async function tc(){qr("Loading settings...");try{const n=await An();document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",Ji("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,Po()}catch(n){console.error("Error loading stress settings:",n)}finally{jr()}}window.saveStressSettingsUI=async function(){if(!Re()){alert("Please sign in to save settings");return}qr("Saving settings...");try{await Yl({baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:+document.getElementById("ssEquityMin").value,bondMin:+document.getElementById("ssBondMin").value,cashTarget:+document.getElementById("ssCashTarget").value,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value}),alert("Settings saved successfully")}catch(n){console.error("Error saving stress settings:",n),alert("Error saving: "+n.message)}finally{jr()}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){qr("Resetting settings...");try{await IE(),await tc(),alert("Settings reset to defaults")}catch(n){console.error("Error resetting settings:",n),alert("Error resetting: "+n.message)}finally{jr()}}};async function rp(){qr("Loading settings...");try{const n=await Zn();document.getElementById("dsEquityMin").value=n.equityMin||25e4,document.getElementById("dsBondMin").value=n.bondMin||2e5,document.getElementById("dsCashTarget").value=n.cashTarget||5e4,document.getElementById("dsDuration").value=n.duration||35,document.getElementById("dsBaseSalary").value=n.baseSalary||3e4,document.getElementById("dsProtectionFactor").value=n.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=n.recoveryBuffer||15e3,document.getElementById("dsConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("entryEquity").value=n.equityMin||25e4,document.getElementById("entryBond").value=n.bondMin||2e5,document.getElementById("entryCash").value=n.cashTarget||5e4,Po()}catch(n){console.error("Error loading decision settings:",n)}finally{jr()}}window.saveDecisionSettingsUI=async function(){if(!Re()){alert("Please sign in to save settings");return}qr("Saving settings...");try{await ql({equityMin:+document.getElementById("dsEquityMin").value,bondMin:+document.getElementById("dsBondMin").value,cashTarget:+document.getElementById("dsCashTarget").value,duration:+document.getElementById("dsDuration").value,baseSalary:+document.getElementById("dsBaseSalary").value,spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value}),alert("Settings saved successfully")}catch(n){console.error("Error saving decision settings:",n),alert("Error saving: "+n.message)}finally{jr()}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){qr("Resetting settings...");try{await ql({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await rp(),alert("Settings reset to defaults")}catch(n){console.error("Error resetting settings:",n),alert("Error resetting: "+n.message)}finally{jr()}}};window.showDrawdownScheduleUI=async function(){const n=parseFloat(document.getElementById("ddInflation").value)/100||.025,t=parseInt(document.getElementById("ddDuration").value)||35;try{const e=await An();e.duration=t;const r=Np(e,t,n);let s='<div class="card"><h2>Projected SIPP Drawdown Schedule</h2>';s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>BRL</th><th>Other</th><th>State</th><th>SIPP Draw</th><th>Tax</th><th>Net</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${H(i.brl)}</td>
            <td>${H(i.other)}</td>
            <td>${H(i.statePension)}</td>
            <td style="color: var(--primary); font-weight: 600;">${H(i.sippDraw)}</td>
            <td style="color: var(--danger);">-${H(i.tax)}</td>
            <td style="color: var(--success);">${H(i.netIncome)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=s}catch(e){console.error("Drawdown error:",e),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}};window.showGlidepathUI=async function(){const n=parseFloat(document.getElementById("gpInflation").value)/100||.025,t=parseInt(document.getElementById("gpDuration").value)||35;try{const e=await An();e.duration=t;const r=Vp(e,n);let s='<div class="card"><h2>Fund Glidepath (Inflation-Adjusted Minimums)</h2>';s+='<div class="alert alert-info" style="margin-bottom: 20px;">',s+="<strong>Glidepath Logic:</strong> Equity & Bond minimums inflate with CPI but deplete linearly to £0. Cash inflates only (maintains real value).",s+="</div>",s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>Cum Inflation</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Total Min</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${(i.cumulativeInflation*100-100).toFixed(1)}%</td>
            <td style="color: var(--success);">${H(i.equityMin)}</td>
            <td style="color: var(--info);">${H(i.bondMin)}</td>
            <td style="color: var(--warning);">${H(i.cashTarget)}</td>
            <td style="font-weight: 600;">${H(i.totalMin)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=s}catch(e){console.error("Glidepath error:",e),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}};let an=null,on=[];async function Co(){const n=document.getElementById("historyTabs"),t=document.getElementById("historyDetail");if(!n||!t)return;if(n.innerHTML='<span class="loading">Loading...</span>',on=await zf({sortDesc:!1,limit:500}),on.length===0){n.innerHTML="",t.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}let e="";on.forEach(s=>{const i=s.date===an,a=["history-tab"];i&&a.push("active"),s.inProtection&&a.push("protection");const l=Cs(s.date);e+=`<button class="${a.join(" ")}" onclick="selectHistoryEntry('${s.date}')">${l}</button>`}),n.innerHTML=e;const r=document.getElementById("historyMobileSelector");if(r){let s="";on.forEach(i=>{const a=Cs(i.date),l=i.inProtection?" (Protection)":"";s+=`<option value="${i.date}">${a}${l}</option>`}),r.innerHTML=s}(!an||!on.find(s=>s.date===an))&&(an=on[on.length-1].date),r&&(r.value=an),sp(an),setTimeout(()=>{const s=n.querySelector(".history-tab.active");s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}function Cs(n){const[t,e]=n.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][e-1]} ${t}`}function sp(n){const t=document.getElementById("historyDetail"),e=on.find(d=>d.date===n);if(!e){t.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const r=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",s=e.isTaxEfficientYear!==!1&&e.mode==="Tax-Efficient",i=e.inProtection?"warning":s?"efficient":"inefficient",a=e.inProtection?`Protection${e.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:s?"Tax-Efficient":"Standard";let l=e.source||"Unknown";e.source==="Growth"&&(e.dEquity>0||e.dBond>0)?l=`Growth (Equity: ${r(e.dEquity||0)}, Bond: ${r(e.dBond||0)})`:e.source==="Cash"&&(l=`Cash (${r(e.dCash||e.sipp||0)})`);let c=`
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${Cs(e.date)}</h3>
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
      `;t.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===Cs(n))})}window.selectHistoryEntry=function(n){an=n,sp(n);const t=document.getElementById("historyMobileSelector");t&&(t.value=n);const r=document.getElementById("historyTabs").querySelector(".history-tab.active");r&&r.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(n){const t=document.getElementById("historyTabs"),e=200;n==="left"?t.scrollLeft-=e:t.scrollLeft+=e};window.deleteHistoryEntry=async function(n){const t=Cs(n);if(confirm(`Delete entry for ${t}?`)){if(!Re()){alert("Please sign in to delete entries");return}try{await uE(n),an=null,await Co()}catch(e){console.error("Delete error:",e),alert("Error deleting: "+e.message)}}};let Vn=null;async function Qs(){const n=document.getElementById("taxYearTabs"),t=document.getElementById("taxYearDetail");if(!n||!t)return;n.innerHTML='<span class="loading">Loading...</span>';const e=await Ws();await Zn();const r=Object.keys(e).sort(),s=Ob(),i=Bb(r,s,40);let a="";i.forEach(d=>{const f=e[d],m=f&&f.yearSetupComplete,v=d===Vn,E=["tax-year-tab"];v&&E.push("active"),m||E.push("not-setup"),a+=`<button class="${E.join(" ")}" onclick="selectTaxYear('${d}')">${d}</button>`}),n.innerHTML=a;const l=document.getElementById("taxYearMobileSelector");if(l){let d="";i.forEach(f=>{const m=e[f],E=m&&m.yearSetupComplete?f:`${f} (not set up)`;d+=`<option value="${f}">${E}</option>`}),l.innerHTML=d}if(!Vn){const d=r.filter(f=>{var m;return(m=e[f])==null?void 0:m.yearSetupComplete});Vn=d.length>0?d[d.length-1]:s}l&&(l.value=Vn),await ip(Vn,e);const c=n.querySelector(".tax-year-tab.active");c&&c.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function Ob(){const n=new Date,t=n.getFullYear(),e=n.getMonth()+1;return e<4||e===4&&n.getDate()<6?`${String(t-1).slice(-2)}/${String(t).slice(-2)}`:`${String(t).slice(-2)}/${String(t+1).slice(-2)}`}function Bb(n,t,e){const r=new Set(n),[s]=t.split("/").map(Number),i=s<50?2e3+s:1900+s;for(let a=0;a<e&&r.size<e;a++){const l=i+a,c=l+1;r.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(r).sort()}async function ip(n,t,e){var m,v,E,I,x,b,P,D,C,N,F,V,T,g;const r=document.getElementById("taxYearDetail"),s=t[n];if(!s||!s.yearSetupComplete){r.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${n} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${n}')">Set Up ${n}</button>
          </div>
        `;return}const i=await Hl(n),a=Math.round(i.amount||0),l=i.startDate||"Not configured",c=i.isReceiving;i.yearsUntil;const d=y=>y!=null?"£"+Math.round(y).toLocaleString():"—";let f=`
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
              <span class="value">${Fb(s.startMonth||4)}</span>
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
                ${((I=y.other)==null?void 0:I.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${d((x=y.other)==null?void 0:x.gross)}</td>
                  <td class="tax-col">-${d((b=y.other)==null?void 0:b.tax)}</td>
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
                  <td>${d((T=y.isa)==null?void 0:T.gross)}</td>
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
      `,r.innerHTML=f,document.querySelectorAll(".tax-year-tab").forEach(y=>{y.classList.toggle("active",y.textContent===n)})}window.selectTaxYear=async function(n){Vn=n;const t=await Ws();await Zn(),await ip(n,t),document.querySelectorAll(".tax-year-tab").forEach(i=>{i.classList.toggle("active",i.textContent===n)});const e=document.getElementById("taxYearMobileSelector");e&&(e.value=n);const s=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${n}')"]`);s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(n){const t=document.getElementById("taxYearTabs"),e=200;n==="left"?t.scrollLeft-=e:t.scrollLeft+=e};function Fb(n){return["January","February","March","April","May","June","July","August","September","October","November","December"][(n-1)%12]||"April"}window.triggerWizardForYear=async function(n){const[t]=n.split("/").map(Number),e=t<50?2e3+t:1900+t,r=`${e}-04`,s=document.getElementById("selectedMonth");s&&(s.value=r),document.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(i=>i.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(i=>i.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),alert(`Please click "Calculate" with April ${e} selected to set up tax year ${n}`)};window.reconfigureTaxYear=async function(n){if(confirm(`This will allow you to reconfigure tax year ${n}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const t=await Io(n);t.yearSetupComplete=!1,await So(n,t),await Qs(),alert(`Tax year ${n} has been marked for reconfiguration. Calculate a decision for this year to run the wizard again.`)}catch(t){console.error("Error:",t),alert("Error: "+t.message)}};window.updateTaxYear=async function(n,t,e){try{const r=await Io(n);r[t]=parseFloat(e),await So(n,r)}catch(r){console.error("Error updating tax year:",r),alert("Error saving: "+r.message)}};window.deleteTaxYear=async function(n){if(confirm("Delete tax year "+n+"? This will remove all configuration for this year."))try{const t=await Xn();delete t.taxYears[n],await To(t),Vn=null,await Qs()}catch(t){console.error("Error deleting tax year:",t),alert("Error deleting: "+t.message)}};window.addTaxYear=async function(){if(!Re()){alert("Please sign in to add tax years");return}const n=prompt("Enter tax year (e.g., 25/26):");if(!n||!/^\d{2}\/\d{2}$/.test(n)){alert("Invalid format. Use YY/YY (e.g., 25/26)");return}try{await So(n,{}),await Qs()}catch(t){console.error("Save error:",t),alert("Error saving: "+t.message)}};console.log("Pension Planner v"+gd+" loaded");
