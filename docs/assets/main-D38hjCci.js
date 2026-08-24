(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();function a1(t){const e=(t.sippDraw||0)+(t.other||0)+(t.statePension||0),n=e*12,s=t.pa||12570,r=t.brl||50270,i=t.hrl||125140;let o=0;n>s&&(n<=r?o=(n-s)*.2:n<=i?o=(r-s)*.2+(n-r)*.4:o=(r-s)*.2+(i-r)*.4+(n-i)*.45);const a=t.monthlyTax!=null?t.monthlyTax:o/12,c=t.monthlyTax!=null&&t.totalMonthlyNet!=null?t.totalMonthlyNet:e-a+(t.isaDraw||0);return{date:t.date,taxYear:t.taxYear,yearNum:t.yearNumber,equity:t.equity,bond:t.bond,cash:t.cash,total:t.equity+t.bond+t.cash,adjEquity:t.adjEquityMin,adjBond:t.adjBondMin,adjCash:t.adjCashTarget,source:t.source,dEquity:t.drawFromEquity||0,dBond:t.drawFromBond||0,dCash:t.drawFromCash||0,sipp:t.sippDraw,stdSipp:t.stdSipp||t.sippDraw,isa:t.isaDraw,other:t.other,state:t.statePension,pa:s,brl:r,monthlyTax:a,monthlyNet:c,mode:t.taxEfficient?"Tax-Efficient":"Standard",inProtection:t.inProtection,reason:t.protectionReason||"",consecutiveDraws:t.consecutiveCashDraws||0,boostAmount:t.boostAmount,boostEligible:t.boostEligible||!1,rebal:t.rebalanceActions?t.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:t.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:t.isaDraw||0,cumulativeIsaSavingsUsed:t.cumulativeIsaSavingsUsed||0,taxPaidMonthly:a,taxFree:t.taxFree||0,recycleNet:t.recycleNet||0,accessMethod:t.accessMethod||"drawdown",taxPaidYTD:t.taxPaidYTD||a,taxProjectedAnnual:t.taxProjectedAnnual||o,taxSavedMonthly:t.taxSavedMonthly||0,taxSavedYTD:t.taxSavedYTD||0,taxSavedProjectedAnnual:t.taxSavedProjectedAnnual||0,isTaxEfficientYear:t.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:t.protectionInducedTaxEfficiency||!1,remainingMonths:t.remainingMonths||12}}const ta={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},l1="modulepreload",c1=function(t,e){return new URL(t,e).href},Oh={},Fh=function(e,n,s){let r=Promise.resolve();if(n&&n.length>0){const o=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));r=Promise.allSettled(n.map(d=>{if(d=c1(d,s),d in Oh)return;Oh[d]=!0;const u=d.endsWith(".css"),p=u?'[rel="stylesheet"]':"";if(!!s)for(let v=o.length-1;v>=0;v--){const y=o[v];if(y.href===d&&(!u||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${p}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":l1,u||(g.as="script"),g.crossOrigin="",g.href=d,c&&g.setAttribute("nonce",c),document.head.appendChild(g),u)return new Promise((v,y)=>{g.addEventListener("load",v),g.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return r.then(o=>{for(const a of o||[])a.status==="rejected"&&i(a.reason);return e().catch(i)})},Cp="6.0.0",Xe={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},Pp={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},Vt={RETURN:.03,MIN:0,DRAWDOWN_STRATEGY:"minimiseEarlyTax"},be={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},As={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},ar={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},Ka={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},d1={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},bn={START_MONTH:4,START_DAY:6},Ji=.04,Rp=Pp.OTHER_INCOME_CAP;function Zl(t,e,n=Rp){let s=t;for(const r of e)s*=1+Math.min(r,n);return s}function fd(t){let e=t;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function Dr(t,e,n){const s=Math.max(n(),1e-12),r=n();let i=Math.sqrt(-2*Math.log(s))*Math.cos(2*Math.PI*r);return i=Math.max(-4,Math.min(4,i)),t+e*i}function Qa(t){const e=JSON.stringify(t);let n=0;for(let s=0;s<e.length;s++){const r=e.charCodeAt(s);n=(n<<5)-n+r,n=n&n}return n.toString(16)}var Vh={};/**
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
 */const Mp=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let r=t.charCodeAt(s);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},u1=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const r=t[n++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=t[n++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=t[n++],o=t[n++],a=t[n++],c=((r&7)<<18|(i&63)<<12|(o&63)<<6|a&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const i=t[n++],o=t[n++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|o&63)}}return e.join("")},Bp={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<t.length;r+=3){const i=t[r],o=r+1<t.length,a=o?t[r+1]:0,c=r+2<t.length,d=c?t[r+2]:0,u=i>>2,p=(i&3)<<4|a>>4;let f=(a&15)<<2|d>>6,g=d&63;c||(g=64,o||(f=64)),s.push(n[u],n[p],n[f],n[g])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Mp(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):u1(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<t.length;){const i=n[t.charAt(r++)],a=r<t.length?n[t.charAt(r)]:0;++r;const d=r<t.length?n[t.charAt(r)]:64;++r;const p=r<t.length?n[t.charAt(r)]:64;if(++r,i==null||a==null||d==null||p==null)throw new h1;const f=i<<2|a>>4;if(s.push(f),d!==64){const g=a<<4&240|d>>2;if(s.push(g),p!==64){const v=d<<6&192|p;s.push(v)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class h1 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const f1=function(t){const e=Mp(t);return Bp.encodeByteArray(e,!0)},Aa=function(t){return f1(t).replace(/\./g,"")},Dp=function(t){try{return Bp.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function p1(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const m1=()=>p1().__FIREBASE_DEFAULTS__,g1=()=>{if(typeof process>"u"||typeof Vh>"u")return;const t=Vh.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},y1=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Dp(t[1]);return e&&JSON.parse(e)},Ja=()=>{try{return m1()||g1()||y1()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Lp=t=>{var e,n;return(n=(e=Ja())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},v1=t=>{const e=Lp(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),s]:[e.substring(0,n),s]},Np=()=>{var t;return(t=Ja())===null||t===void 0?void 0:t.config},Op=t=>{var e;return(e=Ja())===null||e===void 0?void 0:e[`_${t}`]};/**
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
 */class b1{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
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
 */function w1(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=e||"demo-project",r=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Aa(JSON.stringify(n)),Aa(JSON.stringify(o)),""].join(".")}/**
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
 */function _t(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function E1(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(_t())}function T1(){var t;const e=(t=Ja())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function _1(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function I1(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function S1(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function x1(){const t=_t();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function A1(){return!T1()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function k1(){try{return typeof indexedDB=="object"}catch{return!1}}function C1(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var i;e(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}/**
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
 */const P1="FirebaseError";class is extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=P1,Object.setPrototypeOf(this,is.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,wo.prototype.create)}}class wo{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},r=`${this.service}/${e}`,i=this.errors[e],o=i?R1(i,s):"Error",a=`${this.serviceName}: ${o} (${r}).`;return new is(r,a,s)}}function R1(t,e){return t.replace(M1,(n,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const M1=/\{\$([^}]+)}/g;function B1(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function ka(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const r of n){if(!s.includes(r))return!1;const i=t[r],o=e[r];if(zh(i)&&zh(o)){if(!ka(i,o))return!1}else if(i!==o)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function zh(t){return t!==null&&typeof t=="object"}/**
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
 */function Eo(t){const e=[];for(const[n,s]of Object.entries(t))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Di(t){const e={};return t.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[r,i]=s.split("=");e[decodeURIComponent(r)]=decodeURIComponent(i)}}),e}function Li(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function D1(t,e){const n=new L1(t,e);return n.subscribe.bind(n)}class L1{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,s){let r;if(e===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");N1(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:s},r.next===void 0&&(r.next=ec),r.error===void 0&&(r.error=ec),r.complete===void 0&&(r.complete=ec);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function N1(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function ec(){}/**
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
 */function Re(t){return t&&t._delegate?t._delegate:t}class lr{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Zs="[DEFAULT]";/**
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
 */class O1{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new b1;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(V1(e))try{this.getOrInitializeService({instanceIdentifier:Zs})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=Zs){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Zs){return this.instances.has(e)}getOptions(e=Zs){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[i,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(i);s===a&&o.resolve(r)}return r}onInit(e,n){var s;const r=this.normalizeInstanceIdentifier(n),i=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;i.add(e),this.onInitCallbacks.set(r,i);const o=this.instances.get(r);return o&&e(o,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:F1(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Zs){return this.component?this.component.multipleInstances?e:Zs:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function F1(t){return t===Zs?void 0:t}function V1(t){return t.instantiationMode==="EAGER"}/**
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
 */class z1{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new O1(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var de;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(de||(de={}));const U1={debug:de.DEBUG,verbose:de.VERBOSE,info:de.INFO,warn:de.WARN,error:de.ERROR,silent:de.SILENT},$1=de.INFO,q1={[de.DEBUG]:"log",[de.VERBOSE]:"log",[de.INFO]:"info",[de.WARN]:"warn",[de.ERROR]:"error"},H1=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),r=q1[e];if(r)console[r](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class pd{constructor(e){this.name=e,this._logLevel=$1,this._logHandler=H1,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in de))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?U1[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,de.DEBUG,...e),this._logHandler(this,de.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,de.VERBOSE,...e),this._logHandler(this,de.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,de.INFO,...e),this._logHandler(this,de.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,de.WARN,...e),this._logHandler(this,de.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,de.ERROR,...e),this._logHandler(this,de.ERROR,...e)}}const Y1=(t,e)=>e.some(n=>t instanceof n);let Uh,$h;function W1(){return Uh||(Uh=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function G1(){return $h||($h=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Fp=new WeakMap,bc=new WeakMap,Vp=new WeakMap,tc=new WeakMap,md=new WeakMap;function j1(t){const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(ks(t.result)),r()},o=()=>{s(t.error),r()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Fp.set(n,t)}).catch(()=>{}),md.set(e,t),e}function K1(t){if(bc.has(t))return;const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),r()},o=()=>{s(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});bc.set(t,e)}let wc={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return bc.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Vp.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ks(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Q1(t){wc=t(wc)}function J1(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(nc(this),e,...n);return Vp.set(s,e.sort?e.sort():[e]),ks(s)}:G1().includes(t)?function(...e){return t.apply(nc(this),e),ks(Fp.get(this))}:function(...e){return ks(t.apply(nc(this),e))}}function X1(t){return typeof t=="function"?J1(t):(t instanceof IDBTransaction&&K1(t),Y1(t,W1())?new Proxy(t,wc):t)}function ks(t){if(t instanceof IDBRequest)return j1(t);if(tc.has(t))return tc.get(t);const e=X1(t);return e!==t&&(tc.set(t,e),md.set(e,t)),e}const nc=t=>md.get(t);function Z1(t,e,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const o=indexedDB.open(t,e),a=ks(o);return s&&o.addEventListener("upgradeneeded",c=>{s(ks(o.result),c.oldVersion,c.newVersion,ks(o.transaction),c)}),n&&o.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),a.then(c=>{i&&c.addEventListener("close",()=>i()),r&&c.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),a}const ev=["get","getKey","getAll","getAllKeys","count"],tv=["put","add","delete","clear"],sc=new Map;function qh(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(sc.get(e))return sc.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,r=tv.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||ev.includes(n)))return;const i=async function(o,...a){const c=this.transaction(o,r?"readwrite":"readonly");let d=c.store;return s&&(d=d.index(a.shift())),(await Promise.all([d[n](...a),r&&c.done]))[0]};return sc.set(e,i),i}Q1(t=>({...t,get:(e,n,s)=>qh(e,n)||t.get(e,n,s),has:(e,n)=>!!qh(e,n)||t.has(e,n)}));/**
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
 */class nv{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(sv(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function sv(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ec="@firebase/app",Hh="0.10.13";/**
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
 */const Qn=new pd("@firebase/app"),rv="@firebase/app-compat",iv="@firebase/analytics-compat",ov="@firebase/analytics",av="@firebase/app-check-compat",lv="@firebase/app-check",cv="@firebase/auth",dv="@firebase/auth-compat",uv="@firebase/database",hv="@firebase/data-connect",fv="@firebase/database-compat",pv="@firebase/functions",mv="@firebase/functions-compat",gv="@firebase/installations",yv="@firebase/installations-compat",vv="@firebase/messaging",bv="@firebase/messaging-compat",wv="@firebase/performance",Ev="@firebase/performance-compat",Tv="@firebase/remote-config",_v="@firebase/remote-config-compat",Iv="@firebase/storage",Sv="@firebase/storage-compat",xv="@firebase/firestore",Av="@firebase/vertexai-preview",kv="@firebase/firestore-compat",Cv="firebase",Pv="10.14.1";/**
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
 */const Tc="[DEFAULT]",Rv={[Ec]:"fire-core",[rv]:"fire-core-compat",[ov]:"fire-analytics",[iv]:"fire-analytics-compat",[lv]:"fire-app-check",[av]:"fire-app-check-compat",[cv]:"fire-auth",[dv]:"fire-auth-compat",[uv]:"fire-rtdb",[hv]:"fire-data-connect",[fv]:"fire-rtdb-compat",[pv]:"fire-fn",[mv]:"fire-fn-compat",[gv]:"fire-iid",[yv]:"fire-iid-compat",[vv]:"fire-fcm",[bv]:"fire-fcm-compat",[wv]:"fire-perf",[Ev]:"fire-perf-compat",[Tv]:"fire-rc",[_v]:"fire-rc-compat",[Iv]:"fire-gcs",[Sv]:"fire-gcs-compat",[xv]:"fire-fst",[kv]:"fire-fst-compat",[Av]:"fire-vertex","fire-js":"fire-js",[Cv]:"fire-js-all"};/**
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
 */const Ca=new Map,Mv=new Map,_c=new Map;function Yh(t,e){try{t.container.addComponent(e)}catch(n){Qn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Kr(t){const e=t.name;if(_c.has(e))return Qn.debug(`There were multiple attempts to register component ${e}.`),!1;_c.set(e,t);for(const n of Ca.values())Yh(n,t);for(const n of Mv.values())Yh(n,t);return!0}function gd(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function hn(t){return t.settings!==void 0}/**
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
 */const Bv={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Cs=new wo("app","Firebase",Bv);/**
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
 */class Dv{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new lr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Cs.create("app-deleted",{appName:this._name})}}/**
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
 */const li=Pv;function zp(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Tc,automaticDataCollectionEnabled:!1},e),r=s.name;if(typeof r!="string"||!r)throw Cs.create("bad-app-name",{appName:String(r)});if(n||(n=Np()),!n)throw Cs.create("no-options");const i=Ca.get(r);if(i){if(ka(n,i.options)&&ka(s,i.config))return i;throw Cs.create("duplicate-app",{appName:r})}const o=new z1(r);for(const c of _c.values())o.addComponent(c);const a=new Dv(n,s,o);return Ca.set(r,a),a}function Up(t=Tc){const e=Ca.get(t);if(!e&&t===Tc&&Np())return zp();if(!e)throw Cs.create("no-app",{appName:t});return e}function Ps(t,e,n){var s;let r=(s=Rv[t])!==null&&s!==void 0?s:t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Qn.warn(a.join(" "));return}Kr(new lr(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Lv="firebase-heartbeat-database",Nv=1,Xi="firebase-heartbeat-store";let rc=null;function $p(){return rc||(rc=Z1(Lv,Nv,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Xi)}catch(n){console.warn(n)}}}}).catch(t=>{throw Cs.create("idb-open",{originalErrorMessage:t.message})})),rc}async function Ov(t){try{const n=(await $p()).transaction(Xi),s=await n.objectStore(Xi).get(qp(t));return await n.done,s}catch(e){if(e instanceof is)Qn.warn(e.message);else{const n=Cs.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Qn.warn(n.message)}}}async function Wh(t,e){try{const s=(await $p()).transaction(Xi,"readwrite");await s.objectStore(Xi).put(e,qp(t)),await s.done}catch(n){if(n instanceof is)Qn.warn(n.message);else{const s=Cs.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Qn.warn(s.message)}}}function qp(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Fv=1024,Vv=30*24*60*60*1e3;class zv{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new $v(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Gh();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const a=new Date(o.date).valueOf();return Date.now()-a<=Vv}),this._storage.overwrite(this._heartbeatsCache))}catch(s){Qn.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Gh(),{heartbeatsToSend:s,unsentEntries:r}=Uv(this._heartbeatsCache.heartbeats),i=Aa(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return Qn.warn(n),""}}}function Gh(){return new Date().toISOString().substring(0,10)}function Uv(t,e=Fv){const n=[];let s=t.slice();for(const r of t){const i=n.find(o=>o.agent===r.agent);if(i){if(i.dates.push(r.date),jh(n)>e){i.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),jh(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class $v{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return k1()?C1().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Ov(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Wh(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Wh(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function jh(t){return Aa(JSON.stringify({version:2,heartbeats:t})).length}/**
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
 */function qv(t){Kr(new lr("platform-logger",e=>new nv(e),"PRIVATE")),Kr(new lr("heartbeat",e=>new zv(e),"PRIVATE")),Ps(Ec,Hh,t),Ps(Ec,Hh,"esm2017"),Ps("fire-js","")}qv("");var Hv="firebase",Yv="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ps(Hv,Yv,"app");function yd(t,e){var n={};for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.indexOf(s)<0&&(n[s]=t[s]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(t);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(t,s[r])&&(n[s[r]]=t[s[r]]);return n}function Hp(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Wv=Hp,Yp=new wo("auth","Firebase",Hp());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pa=new pd("@firebase/auth");function Gv(t,...e){Pa.logLevel<=de.WARN&&Pa.warn(`Auth (${li}): ${t}`,...e)}function da(t,...e){Pa.logLevel<=de.ERROR&&Pa.error(`Auth (${li}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xt(t,...e){throw bd(t,...e)}function fn(t,...e){return bd(t,...e)}function vd(t,e,n){const s=Object.assign(Object.assign({},Wv()),{[e]:n});return new wo("auth","Firebase",s).create(e,{appName:t.name})}function Wn(t){return vd(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function jv(t,e,n){const s=n;if(!(e instanceof s))throw s.name!==e.constructor.name&&Xt(t,"argument-error"),vd(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function bd(t,...e){if(typeof t!="string"){const n=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=t.name),t._errorFactory.create(n,...s)}return Yp.create(t,...e)}function X(t,e,...n){if(!t)throw bd(e,...n)}function $n(t){const e="INTERNAL ASSERTION FAILED: "+t;throw da(e),new Error(e)}function Jn(t,e){t||$n(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ic(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function Kv(){return Kh()==="http:"||Kh()==="https:"}function Kh(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qv(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Kv()||I1()||"connection"in navigator)?navigator.onLine:!0}function Jv(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class To{constructor(e,n){this.shortDelay=e,this.longDelay=n,Jn(n>e,"Short delay should be less than long delay!"),this.isMobile=E1()||S1()}get(){return Qv()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wd(t,e){Jn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wp{static initialize(e,n,s){this.fetchImpl=e,n&&(this.headersImpl=n),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;$n("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;$n("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;$n("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xv={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zv=new To(3e4,6e4);function os(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function xn(t,e,n,s,r={}){return Gp(t,r,async()=>{let i={},o={};s&&(e==="GET"?o=s:i={body:JSON.stringify(s)});const a=Eo(Object.assign({key:t.config.apiKey},o)).slice(1),c=await t._getAdditionalHeaders();c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode);const d=Object.assign({method:e,headers:c},i);return _1()||(d.referrerPolicy="no-referrer"),Wp.fetch()(jp(t,t.config.apiHost,n,a),d)})}async function Gp(t,e,n){t._canInitEmulator=!1;const s=Object.assign(Object.assign({},Xv),e);try{const r=new tb(t),i=await Promise.race([n(),r.promise]);r.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw na(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const a=i.ok?o.errorMessage:o.error.message,[c,d]=a.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw na(t,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw na(t,"email-already-in-use",o);if(c==="USER_DISABLED")throw na(t,"user-disabled",o);const u=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw vd(t,u,d);Xt(t,u)}}catch(r){if(r instanceof is)throw r;Xt(t,"network-request-failed",{message:String(r)})}}async function _o(t,e,n,s,r={}){const i=await xn(t,e,n,s,r);return"mfaPendingCredential"in i&&Xt(t,"multi-factor-auth-required",{_serverResponse:i}),i}function jp(t,e,n,s){const r=`${e}${n}?${s}`;return t.config.emulator?wd(t.config,r):`${t.config.apiScheme}://${r}`}function eb(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class tb{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,s)=>{this.timer=setTimeout(()=>s(fn(this.auth,"network-request-failed")),Zv.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function na(t,e,n){const s={appName:t.name};n.email&&(s.email=n.email),n.phoneNumber&&(s.phoneNumber=n.phoneNumber);const r=fn(t,e,s);return r.customData._tokenResponse=n,r}function Qh(t){return t!==void 0&&t.enterprise!==void 0}class nb{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return eb(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function sb(t,e){return xn(t,"GET","/v2/recaptchaConfig",os(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rb(t,e){return xn(t,"POST","/v1/accounts:delete",e)}async function Kp(t,e){return xn(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $i(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function ib(t,e=!1){const n=Re(t),s=await n.getIdToken(e),r=Ed(s);X(r&&r.exp&&r.auth_time&&r.iat,n.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:r,token:s,authTime:$i(ic(r.auth_time)),issuedAtTime:$i(ic(r.iat)),expirationTime:$i(ic(r.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function ic(t){return Number(t)*1e3}function Ed(t){const[e,n,s]=t.split(".");if(e===void 0||n===void 0||s===void 0)return da("JWT malformed, contained fewer than 3 sections"),null;try{const r=Dp(n);return r?JSON.parse(r):(da("Failed to decode base64 JWT payload"),null)}catch(r){return da("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Jh(t){const e=Ed(t);return X(e,"internal-error"),X(typeof e.exp<"u","internal-error"),X(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qr(t,e,n=!1){if(n)return e;try{return await e}catch(s){throw s instanceof is&&ob(s)&&t.auth.currentUser===t&&await t.auth.signOut(),s}}function ob({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ab{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const r=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sc{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=$i(this.lastLoginAt),this.creationTime=$i(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Ra(t){var e;const n=t.auth,s=await t.getIdToken(),r=await Qr(t,Kp(n,{idToken:s}));X(r==null?void 0:r.users.length,n,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Qp(i.providerUserInfo):[],a=cb(t.providerData,o),c=t.isAnonymous,d=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),u=c?d:!1,p={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Sc(i.createdAt,i.lastLoginAt),isAnonymous:u};Object.assign(t,p)}async function lb(t){const e=Re(t);await Ra(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function cb(t,e){return[...t.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function Qp(t){return t.map(e=>{var{providerId:n}=e,s=yd(e,["providerId"]);return{providerId:n,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function db(t,e){const n=await Gp(t,{},async()=>{const s=Eo({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=t.config,o=jp(t,r,"/v1/token",`key=${i}`),a=await t._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",Wp.fetch()(o,{method:"POST",headers:a,body:s})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function ub(t,e){return xn(t,"POST","/v2/accounts:revokeToken",os(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){X(e.idToken,"internal-error"),X(typeof e.idToken<"u","internal-error"),X(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Jh(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){X(e.length!==0,"internal-error");const n=Jh(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(X(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:s,refreshToken:r,expiresIn:i}=await db(e,n);this.updateTokensAndExpiration(s,r,Number(i))}updateTokensAndExpiration(e,n,s){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,n){const{refreshToken:s,accessToken:r,expirationTime:i}=n,o=new zr;return s&&(X(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),r&&(X(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),i&&(X(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new zr,this.toJSON())}_performRefresh(){return $n("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bs(t,e){X(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class qn{constructor(e){var{uid:n,auth:s,stsTokenManager:r}=e,i=yd(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new ab(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=s,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Sc(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Qr(this,this.stsTokenManager.getToken(this.auth,e));return X(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return ib(this,e)}reload(){return lb(this)}_assign(e){this!==e&&(X(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new qn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){X(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),n&&await Ra(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(hn(this.auth.app))return Promise.reject(Wn(this.auth));const e=await this.getIdToken();return await Qr(this,rb(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var s,r,i,o,a,c,d,u;const p=(s=n.displayName)!==null&&s!==void 0?s:void 0,f=(r=n.email)!==null&&r!==void 0?r:void 0,g=(i=n.phoneNumber)!==null&&i!==void 0?i:void 0,v=(o=n.photoURL)!==null&&o!==void 0?o:void 0,y=(a=n.tenantId)!==null&&a!==void 0?a:void 0,E=(c=n._redirectEventId)!==null&&c!==void 0?c:void 0,C=(d=n.createdAt)!==null&&d!==void 0?d:void 0,k=(u=n.lastLoginAt)!==null&&u!==void 0?u:void 0,{uid:P,emailVerified:R,isAnonymous:B,providerData:D,stsTokenManager:I}=n;X(P&&I,e,"internal-error");const w=zr.fromJSON(this.name,I);X(typeof P=="string",e,"internal-error"),bs(p,e.name),bs(f,e.name),X(typeof R=="boolean",e,"internal-error"),X(typeof B=="boolean",e,"internal-error"),bs(g,e.name),bs(v,e.name),bs(y,e.name),bs(E,e.name),bs(C,e.name),bs(k,e.name);const S=new qn({uid:P,auth:e,email:f,emailVerified:R,displayName:p,isAnonymous:B,photoURL:v,phoneNumber:g,tenantId:y,stsTokenManager:w,createdAt:C,lastLoginAt:k});return D&&Array.isArray(D)&&(S.providerData=D.map(T=>Object.assign({},T))),E&&(S._redirectEventId=E),S}static async _fromIdTokenResponse(e,n,s=!1){const r=new zr;r.updateFromServerResponse(n);const i=new qn({uid:n.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await Ra(i),i}static async _fromGetAccountInfoResponse(e,n,s){const r=n.users[0];X(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?Qp(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(i!=null&&i.length),a=new zr;a.updateFromIdToken(s);const c=new qn({uid:r.localId,auth:e,stsTokenManager:a,isAnonymous:o}),d={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new Sc(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xh=new Map;function Hn(t){Jn(t instanceof Function,"Expected a class definition");let e=Xh.get(t);return e?(Jn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Xh.set(t,e),e)}/**
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
 */class Jp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Jp.type="NONE";const Zh=Jp;/**
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
 */function ua(t,e,n){return`firebase:${t}:${e}:${n}`}class Ur{constructor(e,n,s){this.persistence=e,this.auth=n,this.userKey=s;const{config:r,name:i}=this.auth;this.fullUserKey=ua(this.userKey,r.apiKey,i),this.fullPersistenceKey=ua("persistence",r.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?qn._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,s="authUser"){if(!n.length)return new Ur(Hn(Zh),e,s);const r=(await Promise.all(n.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=r[0]||Hn(Zh);const o=ua(s,e.config.apiKey,e.name);let a=null;for(const d of n)try{const u=await d._get(o);if(u){const p=qn._fromJSON(e,u);d!==i&&(a=p),i=d;break}}catch{}const c=r.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new Ur(i,e,s):(i=c[0],a&&await i._set(o,a.toJSON()),await Promise.all(n.map(async d=>{if(d!==i)try{await d._remove(o)}catch{}})),new Ur(i,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ef(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(tm(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Xp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(sm(e))return"Blackberry";if(rm(e))return"Webos";if(Zp(e))return"Safari";if((e.includes("chrome/")||em(e))&&!e.includes("edge/"))return"Chrome";if(nm(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=t.match(n);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function Xp(t=_t()){return/firefox\//i.test(t)}function Zp(t=_t()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function em(t=_t()){return/crios\//i.test(t)}function tm(t=_t()){return/iemobile/i.test(t)}function nm(t=_t()){return/android/i.test(t)}function sm(t=_t()){return/blackberry/i.test(t)}function rm(t=_t()){return/webos/i.test(t)}function Td(t=_t()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function hb(t=_t()){var e;return Td(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function fb(){return x1()&&document.documentMode===10}function im(t=_t()){return Td(t)||nm(t)||rm(t)||sm(t)||/windows phone/i.test(t)||tm(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function om(t,e=[]){let n;switch(t){case"Browser":n=ef(_t());break;case"Worker":n=`${ef(_t())}-${t}`;break;default:n=t}const s=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${li}/${s}`}/**
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
 */class pb{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const s=i=>new Promise((o,a)=>{try{const c=e(i);o(c)}catch(c){a(c)}});s.onAbort=n,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const s of this.queue)await s(e),s.onAbort&&n.push(s.onAbort)}catch(s){n.reverse();for(const r of n)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function mb(t,e={}){return xn(t,"GET","/v2/passwordPolicy",os(t,e))}/**
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
 */const gb=6;class yb{constructor(e){var n,s,r,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:gb,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,s,r,i,o,a;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(n=c.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(s=c.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(r=c.containsLowercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(a=c.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),c}validatePasswordLengthOptions(e,n){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(n.meetsMinPasswordLength=e.length>=s),r&&(n.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(n,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,n,s,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vb{constructor(e,n,s,r){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new tf(this),this.idTokenSubscription=new tf(this),this.beforeStateQueue=new pb(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Yp,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Hn(n)),this._initializationPromise=this.queue(async()=>{var s,r;if(!this._deleted&&(this.persistenceManager=await Ur.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Kp(this,{idToken:e}),s=await qn._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(s)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(hn(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let r=s,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,a=r==null?void 0:r._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===a)&&(c!=null&&c.user)&&(r=c.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return X(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Ra(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Jv()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(hn(this.app))return Promise.reject(Wn(this));const n=e?Re(e):null;return n&&X(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&X(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return hn(this.app)?Promise.reject(Wn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return hn(this.app)?Promise.reject(Wn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Hn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await mb(this),n=new yb(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new wo("auth","Firebase",e())}onAuthStateChanged(e,n,s){return this.registerStateListener(this.authStateSubscription,e,n,s)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,s){return this.registerStateListener(this.idTokenSubscription,e,n,s)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(s.tenantId=this.tenantId),await ub(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const s=await this.getOrInitRedirectPersistenceManager(n);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Hn(e)||this._popupRedirectResolver;X(n,this,"argument-error"),this.redirectPersistenceManager=await Ur.create(this,[Hn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,s;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,s,r){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(X(a,this,"internal-error"),a.then(()=>{o||i(this.currentUser)}),typeof n=="function"){const c=e.addObserver(n,s,r);return()=>{o=!0,c()}}else{const c=e.addObserver(n);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return X(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=om(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(n["X-Firebase-Client"]=s);const r=await this._getAppCheckToken();return r&&(n["X-Firebase-AppCheck"]=r),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&Gv(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function as(t){return Re(t)}class tf{constructor(e){this.auth=e,this.observer=null,this.addObserver=D1(n=>this.observer=n)}get next(){return X(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Xa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function bb(t){Xa=t}function am(t){return Xa.loadJS(t)}function wb(){return Xa.recaptchaEnterpriseScript}function Eb(){return Xa.gapiScript}function Tb(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const _b="recaptcha-enterprise",Ib="NO_RECAPTCHA";class Sb{constructor(e){this.type=_b,this.auth=as(e)}async verify(e="verify",n=!1){async function s(i){if(!n){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,a)=>{sb(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const d=new nb(c);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,o(d.siteKey)}}).catch(c=>{a(c)})})}function r(i,o,a){const c=window.grecaptcha;Qh(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:e}).then(d=>{o(d)}).catch(()=>{o(Ib)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,o)=>{s(this.auth).then(a=>{if(!n&&Qh(window.grecaptcha))r(a,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=wb();c.length!==0&&(c+=a),am(c).then(()=>{r(a,i,o)}).catch(d=>{o(d)})}}).catch(a=>{o(a)})})}}async function nf(t,e,n,s=!1){const r=new Sb(t);let i;try{i=await r.verify(n)}catch{i=await r.verify(n,!0)}const o=Object.assign({},e);return s?Object.assign(o,{captchaResp:i}):Object.assign(o,{captchaResponse:i}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Ma(t,e,n,s){var r;if(!((r=t._getRecaptchaConfig())===null||r===void 0)&&r.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await nf(t,e,n,n==="getOobCode");return s(t,i)}else return s(t,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await nf(t,e,n,n==="getOobCode");return s(t,o)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xb(t,e){const n=gd(t,"auth");if(n.isInitialized()){const r=n.getImmediate(),i=n.getOptions();if(ka(i,e??{}))return r;Xt(r,"already-initialized")}return n.initialize({options:e})}function Ab(t,e){const n=(e==null?void 0:e.persistence)||[],s=(Array.isArray(n)?n:[n]).map(Hn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function kb(t,e,n){const s=as(t);X(s._canInitEmulator,s,"emulator-config-failed"),X(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,i=lm(e),{host:o,port:a}=Cb(e),c=a===null?"":`:${a}`;s.config.emulator={url:`${i}//${o}${c}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:o,port:a,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})}),Pb()}function lm(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Cb(t){const e=lm(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const s=n[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const i=r[1];return{host:i,port:sf(s.substr(i.length+1))}}else{const[i,o]=s.split(":");return{host:i,port:sf(o)}}}function sf(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Pb(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _d{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return $n("not implemented")}_getIdTokenResponse(e){return $n("not implemented")}_linkToIdToken(e,n){return $n("not implemented")}_getReauthenticationResolver(e){return $n("not implemented")}}async function Rb(t,e){return xn(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mb(t,e){return _o(t,"POST","/v1/accounts:signInWithPassword",os(t,e))}async function cm(t,e){return xn(t,"POST","/v1/accounts:sendOobCode",os(t,e))}async function Bb(t,e){return cm(t,e)}async function Db(t,e){return cm(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Lb(t,e){return _o(t,"POST","/v1/accounts:signInWithEmailLink",os(t,e))}async function Nb(t,e){return _o(t,"POST","/v1/accounts:signInWithEmailLink",os(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi extends _d{constructor(e,n,s,r=null){super("password",s),this._email=e,this._password=n,this._tenantId=r}static _fromEmailAndPassword(e,n){return new Zi(e,n,"password")}static _fromEmailAndCode(e,n,s=null){return new Zi(e,n,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ma(e,n,"signInWithPassword",Mb);case"emailLink":return Lb(e,{email:this._email,oobCode:this._password});default:Xt(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const s={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ma(e,s,"signUpPassword",Rb);case"emailLink":return Nb(e,{idToken:n,email:this._email,oobCode:this._password});default:Xt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $r(t,e){return _o(t,"POST","/v1/accounts:signInWithIdp",os(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ob="http://localhost";class cr extends _d{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new cr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Xt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r}=n,i=yd(n,["providerId","signInMethod"]);if(!s||!r)return null;const o=new cr(s,r);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return $r(e,n)}_linkToIdToken(e,n){const s=this.buildRequest();return s.idToken=n,$r(e,s)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,$r(e,n)}buildRequest(){const e={requestUri:Ob,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Eo(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fb(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Vb(t){const e=Di(Li(t)).link,n=e?Di(Li(e)).deep_link_id:null,s=Di(Li(t)).deep_link_id;return(s?Di(Li(s)).link:null)||s||n||e||t}class Id{constructor(e){var n,s,r,i,o,a;const c=Di(Li(e)),d=(n=c.apiKey)!==null&&n!==void 0?n:null,u=(s=c.oobCode)!==null&&s!==void 0?s:null,p=Fb((r=c.mode)!==null&&r!==void 0?r:null);X(d&&u&&p,"argument-error"),this.apiKey=d,this.operation=p,this.code=u,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(o=c.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(a=c.tenantId)!==null&&a!==void 0?a:null}static parseLink(e){const n=Vb(e);try{return new Id(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ci{constructor(){this.providerId=ci.PROVIDER_ID}static credential(e,n){return Zi._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const s=Id.parseLink(n);return X(s,"argument-error"),Zi._fromEmailAndCode(e,s.code,s.tenantId)}}ci.PROVIDER_ID="password";ci.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ci.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sd{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Io extends Sd{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Es extends Io{constructor(){super("facebook.com")}static credential(e){return cr._fromParams({providerId:Es.PROVIDER_ID,signInMethod:Es.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Es.credentialFromTaggedObject(e)}static credentialFromError(e){return Es.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Es.credential(e.oauthAccessToken)}catch{return null}}}Es.FACEBOOK_SIGN_IN_METHOD="facebook.com";Es.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Un extends Io{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return cr._fromParams({providerId:Un.PROVIDER_ID,signInMethod:Un.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Un.credentialFromTaggedObject(e)}static credentialFromError(e){return Un.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:s}=e;if(!n&&!s)return null;try{return Un.credential(n,s)}catch{return null}}}Un.GOOGLE_SIGN_IN_METHOD="google.com";Un.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts extends Io{constructor(){super("github.com")}static credential(e){return cr._fromParams({providerId:Ts.PROVIDER_ID,signInMethod:Ts.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ts.credentialFromTaggedObject(e)}static credentialFromError(e){return Ts.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ts.credential(e.oauthAccessToken)}catch{return null}}}Ts.GITHUB_SIGN_IN_METHOD="github.com";Ts.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s extends Io{constructor(){super("twitter.com")}static credential(e,n){return cr._fromParams({providerId:_s.PROVIDER_ID,signInMethod:_s.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return _s.credentialFromTaggedObject(e)}static credentialFromError(e){return _s.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:s}=e;if(!n||!s)return null;try{return _s.credential(n,s)}catch{return null}}}_s.TWITTER_SIGN_IN_METHOD="twitter.com";_s.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zb(t,e){return _o(t,"POST","/v1/accounts:signUp",os(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,s,r=!1){const i=await qn._fromIdTokenResponse(e,s,r),o=rf(s);return new dr({user:i,providerId:o,_tokenResponse:s,operationType:n})}static async _forOperation(e,n,s){await e._updateTokensIfNecessary(s,!0);const r=rf(s);return new dr({user:e,providerId:r,_tokenResponse:s,operationType:n})}}function rf(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ba extends is{constructor(e,n,s,r){var i;super(n.code,n.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,Ba.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:n.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,n,s,r){return new Ba(e,n,s,r)}}function dm(t,e,n,s){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Ba._fromErrorAndOperation(t,i,e,s):i})}async function Ub(t,e,n=!1){const s=await Qr(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return dr._forOperation(t,"link",s)}/**
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
 */async function $b(t,e,n=!1){const{auth:s}=t;if(hn(s.app))return Promise.reject(Wn(s));const r="reauthenticate";try{const i=await Qr(t,dm(s,r,e,t),n);X(i.idToken,s,"internal-error");const o=Ed(i.idToken);X(o,s,"internal-error");const{sub:a}=o;return X(t.uid===a,s,"user-mismatch"),dr._forOperation(t,r,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Xt(s,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function um(t,e,n=!1){if(hn(t.app))return Promise.reject(Wn(t));const s="signIn",r=await dm(t,s,e),i=await dr._fromIdTokenResponse(t,s,r);return n||await t._updateCurrentUser(i.user),i}async function qb(t,e){return um(as(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hm(t){const e=as(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Hb(t,e,n){const s=as(t);await Ma(s,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",Db)}async function Yb(t,e,n){if(hn(t.app))return Promise.reject(Wn(t));const s=as(t),o=await Ma(s,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",zb).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&hm(t),c}),a=await dr._fromIdTokenResponse(s,"signIn",o);return await s._updateCurrentUser(a.user),a}function Wb(t,e,n){return hn(t.app)?Promise.reject(Wn(t)):qb(Re(t),ci.credential(e,n)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&hm(t),s})}async function fm(t,e){const n=Re(t),r={requestType:"VERIFY_EMAIL",idToken:await t.getIdToken()},{email:i}=await Bb(n.auth,r);i!==t.email&&await t.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gb(t,e){return xn(t,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jb(t,{displayName:e,photoURL:n}){if(e===void 0&&n===void 0)return;const s=Re(t),i={idToken:await s.getIdToken(),displayName:e,photoUrl:n,returnSecureToken:!0},o=await Qr(s,Gb(s.auth,i));s.displayName=o.displayName||null,s.photoURL=o.photoUrl||null;const a=s.providerData.find(({providerId:c})=>c==="password");a&&(a.displayName=s.displayName,a.photoURL=s.photoURL),await s._updateTokensIfNecessary(o)}function Kb(t,e,n,s){return Re(t).onIdTokenChanged(e,n,s)}function Qb(t,e,n){return Re(t).beforeAuthStateChanged(e,n)}function Jb(t,e,n,s){return Re(t).onAuthStateChanged(e,n,s)}function Xb(t){return Re(t).signOut()}async function Zb(t){return Re(t).delete()}const Da="__sak";/**
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
 */class pm{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Da,"1"),this.storage.removeItem(Da),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ew=1e3,tw=10;class mm extends pm{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=im(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const s=this.storage.getItem(n),r=this.localCache[n];s!==r&&e(n,r,s)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,a,c)=>{this.notifyListeners(o,c)});return}const s=e.key;n?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(s);!n&&this.localCache[s]===o||this.notifyListeners(s,o)},i=this.storage.getItem(s);fb()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,tw):r()}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:s}),!0)})},ew)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}mm.type="LOCAL";const nw=mm;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gm extends pm{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}gm.type="SESSION";const ym=gm;/**
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
 */function sw(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class Za{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(r=>r.isListeningto(e));if(n)return n;const s=new Za(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:s,eventType:r,data:i}=n.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const a=Array.from(o).map(async d=>d(n.origin,i)),c=await sw(a);n.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Za.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xd(t="",e=10){let n="";for(let s=0;s<e;s++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class rw{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,o;return new Promise((a,c)=>{const d=xd("",20);r.port1.start();const u=setTimeout(()=>{c(new Error("unsupported_event"))},s);o={messageChannel:r,onMessage(p){const f=p;if(f.data.eventId===d)switch(f.data.status){case"ack":clearTimeout(u),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),a(f.data.response);break;default:clearTimeout(u),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:d,data:n},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(){return window}function iw(t){wn().location.href=t}/**
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
 */function vm(){return typeof wn().WorkerGlobalScope<"u"&&typeof wn().importScripts=="function"}async function ow(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function aw(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function lw(){return vm()?self:null}/**
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
 */const bm="firebaseLocalStorageDb",cw=1,La="firebaseLocalStorage",wm="fbase_key";class So{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function el(t,e){return t.transaction([La],e?"readwrite":"readonly").objectStore(La)}function dw(){const t=indexedDB.deleteDatabase(bm);return new So(t).toPromise()}function xc(){const t=indexedDB.open(bm,cw);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const s=t.result;try{s.createObjectStore(La,{keyPath:wm})}catch(r){n(r)}}),t.addEventListener("success",async()=>{const s=t.result;s.objectStoreNames.contains(La)?e(s):(s.close(),await dw(),e(await xc()))})})}async function of(t,e,n){const s=el(t,!0).put({[wm]:e,value:n});return new So(s).toPromise()}async function uw(t,e){const n=el(t,!1).get(e),s=await new So(n).toPromise();return s===void 0?null:s.value}function af(t,e){const n=el(t,!0).delete(e);return new So(n).toPromise()}const hw=800,fw=3;class Em{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await xc(),this.db)}async _withRetries(e){let n=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(n++>fw)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return vm()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Za._getInstance(lw()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await ow(),!this.activeServiceWorker)return;this.sender=new rw(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((n=s[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||aw()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await xc();return await of(e,Da,"1"),await af(e,Da),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(s=>of(s,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(s=>uw(s,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>af(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=el(r,!1).getAll();return new So(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),n.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),n.push(r));return n}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),hw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Em.type="LOCAL";const pw=Em;new To(3e4,6e4);/**
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
 */function Tm(t,e){return e?Hn(e):(X(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class Ad extends _d{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return $r(e,this._buildIdpRequest())}_linkToIdToken(e,n){return $r(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return $r(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function mw(t){return um(t.auth,new Ad(t),t.bypassAuthState)}function gw(t){const{auth:e,user:n}=t;return X(n,e,"internal-error"),$b(n,new Ad(t),t.bypassAuthState)}async function yw(t){const{auth:e,user:n}=t;return X(n,e,"internal-error"),Ub(n,new Ad(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _m{constructor(e,n,s,r,i=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:s,postBody:r,tenantId:i,error:o,type:a}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:n,sessionId:s,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return mw;case"linkViaPopup":case"linkViaRedirect":return yw;case"reauthViaPopup":case"reauthViaRedirect":return gw;default:Xt(this.auth,"internal-error")}}resolve(e){Jn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Jn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vw=new To(2e3,1e4);async function bw(t,e,n){if(hn(t.app))return Promise.reject(fn(t,"operation-not-supported-in-this-environment"));const s=as(t);jv(t,e,Sd);const r=Tm(s,n);return new tr(s,"signInViaPopup",e,r).executeNotNull()}class tr extends _m{constructor(e,n,s,r,i){super(e,n,r,i),this.provider=s,this.authWindow=null,this.pollId=null,tr.currentPopupAction&&tr.currentPopupAction.cancel(),tr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return X(e,this.auth,"internal-error"),e}async onExecution(){Jn(this.filter.length===1,"Popup operations only handle one event");const e=xd();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(fn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(fn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,tr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,s;if(!((s=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(fn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,vw.get())};e()}}tr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ww="pendingRedirect",ha=new Map;class Ew extends _m{constructor(e,n,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,s),this.eventId=null}async execute(){let e=ha.get(this.auth._key());if(!e){try{const s=await Tw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(n){e=()=>Promise.reject(n)}ha.set(this.auth._key(),e)}return this.bypassAuthState||ha.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Tw(t,e){const n=Sw(e),s=Iw(t);if(!await s._isAvailable())return!1;const r=await s._get(n)==="true";return await s._remove(n),r}function _w(t,e){ha.set(t._key(),e)}function Iw(t){return Hn(t._redirectPersistence)}function Sw(t){return ua(ww,t.config.apiKey,t.name)}async function xw(t,e,n=!1){if(hn(t.app))return Promise.reject(Wn(t));const s=as(t),r=Tm(s,e),o=await new Ew(s,r,n).execute();return o&&!n&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Aw=10*60*1e3;class kw{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(n=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Cw(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var s;if(e.error&&!Im(e)){const r=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";n.onError(fn(this.auth,r))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const s=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Aw&&this.cachedEventUids.clear(),this.cachedEventUids.has(lf(e))}saveEventToCache(e){this.cachedEventUids.add(lf(e)),this.lastProcessedEventTime=Date.now()}}function lf(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Im({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Cw(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Im(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pw(t,e={}){return xn(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Mw=/^https?/;async function Bw(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Pw(t);for(const n of e)try{if(Dw(n))return}catch{}Xt(t,"unauthorized-domain")}function Dw(t){const e=Ic(),{protocol:n,hostname:s}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&s===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===s}if(!Mw.test(n))return!1;if(Rw.test(t))return s===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
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
 */const Lw=new To(3e4,6e4);function cf(){const t=wn().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Nw(t){return new Promise((e,n)=>{var s,r,i;function o(){cf(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{cf(),n(fn(t,"network-request-failed"))},timeout:Lw.get()})}if(!((r=(s=wn().gapi)===null||s===void 0?void 0:s.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((i=wn().gapi)===null||i===void 0)&&i.load)o();else{const a=Tb("iframefcb");return wn()[a]=()=>{gapi.load?o():n(fn(t,"network-request-failed"))},am(`${Eb()}?onload=${a}`).catch(c=>n(c))}}).catch(e=>{throw fa=null,e})}let fa=null;function Ow(t){return fa=fa||Nw(t),fa}/**
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
 */const Fw=new To(5e3,15e3),Vw="__/auth/iframe",zw="emulator/auth/iframe",Uw={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},$w=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function qw(t){const e=t.config;X(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?wd(e,zw):`https://${t.config.authDomain}/${Vw}`,s={apiKey:e.apiKey,appName:t.name,v:li},r=$w.get(t.config.apiHost);r&&(s.eid=r);const i=t._getFrameworks();return i.length&&(s.fw=i.join(",")),`${n}?${Eo(s).slice(1)}`}async function Hw(t){const e=await Ow(t),n=wn().gapi;return X(n,t,"internal-error"),e.open({where:document.body,url:qw(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Uw,dontclear:!0},s=>new Promise(async(r,i)=>{await s.restyle({setHideOnLeave:!1});const o=fn(t,"network-request-failed"),a=wn().setTimeout(()=>{i(o)},Fw.get());function c(){wn().clearTimeout(a),r(s)}s.ping(c).then(c,()=>{i(o)})}))}/**
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
 */const Yw={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Ww=500,Gw=600,jw="_blank",Kw="http://localhost";class df{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Qw(t,e,n,s=Ww,r=Gw){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let a="";const c=Object.assign(Object.assign({},Yw),{width:s.toString(),height:r.toString(),top:i,left:o}),d=_t().toLowerCase();n&&(a=em(d)?jw:n),Xp(d)&&(e=e||Kw,c.scrollbars="yes");const u=Object.entries(c).reduce((f,[g,v])=>`${f}${g}=${v},`,"");if(hb(d)&&a!=="_self")return Jw(e||"",a),new df(null);const p=window.open(e||"",a,u);X(p,t,"popup-blocked");try{p.focus()}catch{}return new df(p)}function Jw(t,e){const n=document.createElement("a");n.href=t,n.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(s)}/**
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
 */const Xw="__/auth/handler",Zw="emulator/auth/handler",e2=encodeURIComponent("fac");async function uf(t,e,n,s,r,i){X(t.config.authDomain,t,"auth-domain-config-required"),X(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:s,v:li,eventId:r};if(e instanceof Sd){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",B1(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[u,p]of Object.entries({}))o[u]=p}if(e instanceof Io){const u=e.getScopes().filter(p=>p!=="");u.length>0&&(o.scopes=u.join(","))}t.tenantId&&(o.tid=t.tenantId);const a=o;for(const u of Object.keys(a))a[u]===void 0&&delete a[u];const c=await t._getAppCheckToken(),d=c?`#${e2}=${encodeURIComponent(c)}`:"";return`${t2(t)}?${Eo(a).slice(1)}${d}`}function t2({config:t}){return t.emulator?wd(t,Zw):`https://${t.authDomain}/${Xw}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oc="webStorageSupport";class n2{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=ym,this._completeRedirectFn=xw,this._overrideRedirectResult=_w}async _openPopup(e,n,s,r){var i;Jn((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await uf(e,n,s,Ic(),r);return Qw(e,o,xd())}async _openRedirect(e,n,s,r){await this._originValidation(e);const i=await uf(e,n,s,Ic(),r);return iw(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:r,promise:i}=this.eventManagers[n];return r?Promise.resolve(r):(Jn(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[n]={promise:s},s.catch(()=>{delete this.eventManagers[n]}),s}async initAndGetManager(e){const n=await Hw(e),s=new kw(e);return n.register("authEvent",r=>(X(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=n,s}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(oc,{type:oc},r=>{var i;const o=(i=r==null?void 0:r[0])===null||i===void 0?void 0:i[oc];o!==void 0&&n(!!o),Xt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Bw(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return im()||Zp()||Td()}}const s2=n2;var hf="@firebase/auth",ff="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r2{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){X(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i2(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function o2(t){Kr(new lr("auth",(e,{options:n})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=s.options;X(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:o,authDomain:a,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:om(t)},d=new vb(s,r,i,c);return Ab(d,n),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,s)=>{e.getProvider("auth-internal").initialize()})),Kr(new lr("auth-internal",e=>{const n=as(e.getProvider("auth").getImmediate());return(s=>new r2(s))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ps(hf,ff,i2(t)),Ps(hf,ff,"esm2017")}/**
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
 */const a2=5*60,l2=Op("authIdTokenMaxAge")||a2;let pf=null;const c2=t=>async e=>{const n=e&&await e.getIdTokenResult(),s=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(s&&s>l2)return;const r=n==null?void 0:n.token;pf!==r&&(pf=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function d2(t=Up()){const e=gd(t,"auth");if(e.isInitialized())return e.getImmediate();const n=xb(t,{popupRedirectResolver:s2,persistence:[pw,nw,ym]}),s=Op("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const o=c2(i.toString());Qb(n,o,()=>o(n.currentUser)),Kb(n,a=>o(a))}}const r=Lp("auth");return r&&kb(n,`http://${r}`),n}function u2(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}bb({loadJS(t){return new Promise((e,n)=>{const s=document.createElement("script");s.setAttribute("src",t),s.onload=e,s.onerror=r=>{const i=fn("internal-error");i.customData=r,n(i)},s.type="text/javascript",s.charset="UTF-8",u2().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});o2("Browser");var mf=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ir,Sm;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,w){function S(){}S.prototype=w.prototype,I.D=w.prototype,I.prototype=new S,I.prototype.constructor=I,I.C=function(T,x,A){for(var _=Array(arguments.length-2),W=2;W<arguments.length;W++)_[W-2]=arguments[W];return w.prototype[x].apply(T,_)}}function n(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,n),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(I,w,S){S||(S=0);var T=Array(16);if(typeof w=="string")for(var x=0;16>x;++x)T[x]=w.charCodeAt(S++)|w.charCodeAt(S++)<<8|w.charCodeAt(S++)<<16|w.charCodeAt(S++)<<24;else for(x=0;16>x;++x)T[x]=w[S++]|w[S++]<<8|w[S++]<<16|w[S++]<<24;w=I.g[0],S=I.g[1],x=I.g[2];var A=I.g[3],_=w+(A^S&(x^A))+T[0]+3614090360&4294967295;w=S+(_<<7&4294967295|_>>>25),_=A+(x^w&(S^x))+T[1]+3905402710&4294967295,A=w+(_<<12&4294967295|_>>>20),_=x+(S^A&(w^S))+T[2]+606105819&4294967295,x=A+(_<<17&4294967295|_>>>15),_=S+(w^x&(A^w))+T[3]+3250441966&4294967295,S=x+(_<<22&4294967295|_>>>10),_=w+(A^S&(x^A))+T[4]+4118548399&4294967295,w=S+(_<<7&4294967295|_>>>25),_=A+(x^w&(S^x))+T[5]+1200080426&4294967295,A=w+(_<<12&4294967295|_>>>20),_=x+(S^A&(w^S))+T[6]+2821735955&4294967295,x=A+(_<<17&4294967295|_>>>15),_=S+(w^x&(A^w))+T[7]+4249261313&4294967295,S=x+(_<<22&4294967295|_>>>10),_=w+(A^S&(x^A))+T[8]+1770035416&4294967295,w=S+(_<<7&4294967295|_>>>25),_=A+(x^w&(S^x))+T[9]+2336552879&4294967295,A=w+(_<<12&4294967295|_>>>20),_=x+(S^A&(w^S))+T[10]+4294925233&4294967295,x=A+(_<<17&4294967295|_>>>15),_=S+(w^x&(A^w))+T[11]+2304563134&4294967295,S=x+(_<<22&4294967295|_>>>10),_=w+(A^S&(x^A))+T[12]+1804603682&4294967295,w=S+(_<<7&4294967295|_>>>25),_=A+(x^w&(S^x))+T[13]+4254626195&4294967295,A=w+(_<<12&4294967295|_>>>20),_=x+(S^A&(w^S))+T[14]+2792965006&4294967295,x=A+(_<<17&4294967295|_>>>15),_=S+(w^x&(A^w))+T[15]+1236535329&4294967295,S=x+(_<<22&4294967295|_>>>10),_=w+(x^A&(S^x))+T[1]+4129170786&4294967295,w=S+(_<<5&4294967295|_>>>27),_=A+(S^x&(w^S))+T[6]+3225465664&4294967295,A=w+(_<<9&4294967295|_>>>23),_=x+(w^S&(A^w))+T[11]+643717713&4294967295,x=A+(_<<14&4294967295|_>>>18),_=S+(A^w&(x^A))+T[0]+3921069994&4294967295,S=x+(_<<20&4294967295|_>>>12),_=w+(x^A&(S^x))+T[5]+3593408605&4294967295,w=S+(_<<5&4294967295|_>>>27),_=A+(S^x&(w^S))+T[10]+38016083&4294967295,A=w+(_<<9&4294967295|_>>>23),_=x+(w^S&(A^w))+T[15]+3634488961&4294967295,x=A+(_<<14&4294967295|_>>>18),_=S+(A^w&(x^A))+T[4]+3889429448&4294967295,S=x+(_<<20&4294967295|_>>>12),_=w+(x^A&(S^x))+T[9]+568446438&4294967295,w=S+(_<<5&4294967295|_>>>27),_=A+(S^x&(w^S))+T[14]+3275163606&4294967295,A=w+(_<<9&4294967295|_>>>23),_=x+(w^S&(A^w))+T[3]+4107603335&4294967295,x=A+(_<<14&4294967295|_>>>18),_=S+(A^w&(x^A))+T[8]+1163531501&4294967295,S=x+(_<<20&4294967295|_>>>12),_=w+(x^A&(S^x))+T[13]+2850285829&4294967295,w=S+(_<<5&4294967295|_>>>27),_=A+(S^x&(w^S))+T[2]+4243563512&4294967295,A=w+(_<<9&4294967295|_>>>23),_=x+(w^S&(A^w))+T[7]+1735328473&4294967295,x=A+(_<<14&4294967295|_>>>18),_=S+(A^w&(x^A))+T[12]+2368359562&4294967295,S=x+(_<<20&4294967295|_>>>12),_=w+(S^x^A)+T[5]+4294588738&4294967295,w=S+(_<<4&4294967295|_>>>28),_=A+(w^S^x)+T[8]+2272392833&4294967295,A=w+(_<<11&4294967295|_>>>21),_=x+(A^w^S)+T[11]+1839030562&4294967295,x=A+(_<<16&4294967295|_>>>16),_=S+(x^A^w)+T[14]+4259657740&4294967295,S=x+(_<<23&4294967295|_>>>9),_=w+(S^x^A)+T[1]+2763975236&4294967295,w=S+(_<<4&4294967295|_>>>28),_=A+(w^S^x)+T[4]+1272893353&4294967295,A=w+(_<<11&4294967295|_>>>21),_=x+(A^w^S)+T[7]+4139469664&4294967295,x=A+(_<<16&4294967295|_>>>16),_=S+(x^A^w)+T[10]+3200236656&4294967295,S=x+(_<<23&4294967295|_>>>9),_=w+(S^x^A)+T[13]+681279174&4294967295,w=S+(_<<4&4294967295|_>>>28),_=A+(w^S^x)+T[0]+3936430074&4294967295,A=w+(_<<11&4294967295|_>>>21),_=x+(A^w^S)+T[3]+3572445317&4294967295,x=A+(_<<16&4294967295|_>>>16),_=S+(x^A^w)+T[6]+76029189&4294967295,S=x+(_<<23&4294967295|_>>>9),_=w+(S^x^A)+T[9]+3654602809&4294967295,w=S+(_<<4&4294967295|_>>>28),_=A+(w^S^x)+T[12]+3873151461&4294967295,A=w+(_<<11&4294967295|_>>>21),_=x+(A^w^S)+T[15]+530742520&4294967295,x=A+(_<<16&4294967295|_>>>16),_=S+(x^A^w)+T[2]+3299628645&4294967295,S=x+(_<<23&4294967295|_>>>9),_=w+(x^(S|~A))+T[0]+4096336452&4294967295,w=S+(_<<6&4294967295|_>>>26),_=A+(S^(w|~x))+T[7]+1126891415&4294967295,A=w+(_<<10&4294967295|_>>>22),_=x+(w^(A|~S))+T[14]+2878612391&4294967295,x=A+(_<<15&4294967295|_>>>17),_=S+(A^(x|~w))+T[5]+4237533241&4294967295,S=x+(_<<21&4294967295|_>>>11),_=w+(x^(S|~A))+T[12]+1700485571&4294967295,w=S+(_<<6&4294967295|_>>>26),_=A+(S^(w|~x))+T[3]+2399980690&4294967295,A=w+(_<<10&4294967295|_>>>22),_=x+(w^(A|~S))+T[10]+4293915773&4294967295,x=A+(_<<15&4294967295|_>>>17),_=S+(A^(x|~w))+T[1]+2240044497&4294967295,S=x+(_<<21&4294967295|_>>>11),_=w+(x^(S|~A))+T[8]+1873313359&4294967295,w=S+(_<<6&4294967295|_>>>26),_=A+(S^(w|~x))+T[15]+4264355552&4294967295,A=w+(_<<10&4294967295|_>>>22),_=x+(w^(A|~S))+T[6]+2734768916&4294967295,x=A+(_<<15&4294967295|_>>>17),_=S+(A^(x|~w))+T[13]+1309151649&4294967295,S=x+(_<<21&4294967295|_>>>11),_=w+(x^(S|~A))+T[4]+4149444226&4294967295,w=S+(_<<6&4294967295|_>>>26),_=A+(S^(w|~x))+T[11]+3174756917&4294967295,A=w+(_<<10&4294967295|_>>>22),_=x+(w^(A|~S))+T[2]+718787259&4294967295,x=A+(_<<15&4294967295|_>>>17),_=S+(A^(x|~w))+T[9]+3951481745&4294967295,I.g[0]=I.g[0]+w&4294967295,I.g[1]=I.g[1]+(x+(_<<21&4294967295|_>>>11))&4294967295,I.g[2]=I.g[2]+x&4294967295,I.g[3]=I.g[3]+A&4294967295}s.prototype.u=function(I,w){w===void 0&&(w=I.length);for(var S=w-this.blockSize,T=this.B,x=this.h,A=0;A<w;){if(x==0)for(;A<=S;)r(this,I,A),A+=this.blockSize;if(typeof I=="string"){for(;A<w;)if(T[x++]=I.charCodeAt(A++),x==this.blockSize){r(this,T),x=0;break}}else for(;A<w;)if(T[x++]=I[A++],x==this.blockSize){r(this,T),x=0;break}}this.h=x,this.o+=w},s.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var w=1;w<I.length-8;++w)I[w]=0;var S=8*this.o;for(w=I.length-8;w<I.length;++w)I[w]=S&255,S/=256;for(this.u(I),I=Array(16),w=S=0;4>w;++w)for(var T=0;32>T;T+=8)I[S++]=this.g[w]>>>T&255;return I};function i(I,w){var S=a;return Object.prototype.hasOwnProperty.call(S,I)?S[I]:S[I]=w(I)}function o(I,w){this.h=w;for(var S=[],T=!0,x=I.length-1;0<=x;x--){var A=I[x]|0;T&&A==w||(S[x]=A,T=!1)}this.g=S}var a={};function c(I){return-128<=I&&128>I?i(I,function(w){return new o([w|0],0>w?-1:0)}):new o([I|0],0>I?-1:0)}function d(I){if(isNaN(I)||!isFinite(I))return p;if(0>I)return E(d(-I));for(var w=[],S=1,T=0;I>=S;T++)w[T]=I/S|0,S*=4294967296;return new o(w,0)}function u(I,w){if(I.length==0)throw Error("number format error: empty string");if(w=w||10,2>w||36<w)throw Error("radix out of range: "+w);if(I.charAt(0)=="-")return E(u(I.substring(1),w));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var S=d(Math.pow(w,8)),T=p,x=0;x<I.length;x+=8){var A=Math.min(8,I.length-x),_=parseInt(I.substring(x,x+A),w);8>A?(A=d(Math.pow(w,A)),T=T.j(A).add(d(_))):(T=T.j(S),T=T.add(d(_)))}return T}var p=c(0),f=c(1),g=c(16777216);t=o.prototype,t.m=function(){if(y(this))return-E(this).m();for(var I=0,w=1,S=0;S<this.g.length;S++){var T=this.i(S);I+=(0<=T?T:4294967296+T)*w,w*=4294967296}return I},t.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(v(this))return"0";if(y(this))return"-"+E(this).toString(I);for(var w=d(Math.pow(I,6)),S=this,T="";;){var x=R(S,w).g;S=C(S,x.j(w));var A=((0<S.g.length?S.g[0]:S.h)>>>0).toString(I);if(S=x,v(S))return A+T;for(;6>A.length;)A="0"+A;T=A+T}},t.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function v(I){if(I.h!=0)return!1;for(var w=0;w<I.g.length;w++)if(I.g[w]!=0)return!1;return!0}function y(I){return I.h==-1}t.l=function(I){return I=C(this,I),y(I)?-1:v(I)?0:1};function E(I){for(var w=I.g.length,S=[],T=0;T<w;T++)S[T]=~I.g[T];return new o(S,~I.h).add(f)}t.abs=function(){return y(this)?E(this):this},t.add=function(I){for(var w=Math.max(this.g.length,I.g.length),S=[],T=0,x=0;x<=w;x++){var A=T+(this.i(x)&65535)+(I.i(x)&65535),_=(A>>>16)+(this.i(x)>>>16)+(I.i(x)>>>16);T=_>>>16,A&=65535,_&=65535,S[x]=_<<16|A}return new o(S,S[S.length-1]&-2147483648?-1:0)};function C(I,w){return I.add(E(w))}t.j=function(I){if(v(this)||v(I))return p;if(y(this))return y(I)?E(this).j(E(I)):E(E(this).j(I));if(y(I))return E(this.j(E(I)));if(0>this.l(g)&&0>I.l(g))return d(this.m()*I.m());for(var w=this.g.length+I.g.length,S=[],T=0;T<2*w;T++)S[T]=0;for(T=0;T<this.g.length;T++)for(var x=0;x<I.g.length;x++){var A=this.i(T)>>>16,_=this.i(T)&65535,W=I.i(x)>>>16,ee=I.i(x)&65535;S[2*T+2*x]+=_*ee,k(S,2*T+2*x),S[2*T+2*x+1]+=A*ee,k(S,2*T+2*x+1),S[2*T+2*x+1]+=_*W,k(S,2*T+2*x+1),S[2*T+2*x+2]+=A*W,k(S,2*T+2*x+2)}for(T=0;T<w;T++)S[T]=S[2*T+1]<<16|S[2*T];for(T=w;T<2*w;T++)S[T]=0;return new o(S,0)};function k(I,w){for(;(I[w]&65535)!=I[w];)I[w+1]+=I[w]>>>16,I[w]&=65535,w++}function P(I,w){this.g=I,this.h=w}function R(I,w){if(v(w))throw Error("division by zero");if(v(I))return new P(p,p);if(y(I))return w=R(E(I),w),new P(E(w.g),E(w.h));if(y(w))return w=R(I,E(w)),new P(E(w.g),w.h);if(30<I.g.length){if(y(I)||y(w))throw Error("slowDivide_ only works with positive integers.");for(var S=f,T=w;0>=T.l(I);)S=B(S),T=B(T);var x=D(S,1),A=D(T,1);for(T=D(T,2),S=D(S,2);!v(T);){var _=A.add(T);0>=_.l(I)&&(x=x.add(S),A=_),T=D(T,1),S=D(S,1)}return w=C(I,x.j(w)),new P(x,w)}for(x=p;0<=I.l(w);){for(S=Math.max(1,Math.floor(I.m()/w.m())),T=Math.ceil(Math.log(S)/Math.LN2),T=48>=T?1:Math.pow(2,T-48),A=d(S),_=A.j(w);y(_)||0<_.l(I);)S-=T,A=d(S),_=A.j(w);v(A)&&(A=f),x=x.add(A),I=C(I,_)}return new P(x,I)}t.A=function(I){return R(this,I).h},t.and=function(I){for(var w=Math.max(this.g.length,I.g.length),S=[],T=0;T<w;T++)S[T]=this.i(T)&I.i(T);return new o(S,this.h&I.h)},t.or=function(I){for(var w=Math.max(this.g.length,I.g.length),S=[],T=0;T<w;T++)S[T]=this.i(T)|I.i(T);return new o(S,this.h|I.h)},t.xor=function(I){for(var w=Math.max(this.g.length,I.g.length),S=[],T=0;T<w;T++)S[T]=this.i(T)^I.i(T);return new o(S,this.h^I.h)};function B(I){for(var w=I.g.length+1,S=[],T=0;T<w;T++)S[T]=I.i(T)<<1|I.i(T-1)>>>31;return new o(S,I.h)}function D(I,w){var S=w>>5;w%=32;for(var T=I.g.length-S,x=[],A=0;A<T;A++)x[A]=0<w?I.i(A+S)>>>w|I.i(A+S+1)<<32-w:I.i(A+S);return new o(x,I.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,Sm=s,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=d,o.fromString=u,ir=o}).apply(typeof mf<"u"?mf:typeof self<"u"?self:typeof window<"u"?window:{});var sa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var xm,Ni,Am,pa,Ac,km,Cm,Pm;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(l,h,m){return l==Array.prototype||l==Object.prototype||(l[h]=m.value),l};function n(l){l=[typeof globalThis=="object"&&globalThis,l,typeof window=="object"&&window,typeof self=="object"&&self,typeof sa=="object"&&sa];for(var h=0;h<l.length;++h){var m=l[h];if(m&&m.Math==Math)return m}throw Error("Cannot find global object")}var s=n(this);function r(l,h){if(h)e:{var m=s;l=l.split(".");for(var b=0;b<l.length-1;b++){var M=l[b];if(!(M in m))break e;m=m[M]}l=l[l.length-1],b=m[l],h=h(b),h!=b&&h!=null&&e(m,l,{configurable:!0,writable:!0,value:h})}}function i(l,h){l instanceof String&&(l+="");var m=0,b=!1,M={next:function(){if(!b&&m<l.length){var L=m++;return{value:h(L,l[L]),done:!1}}return b=!0,{done:!0,value:void 0}}};return M[Symbol.iterator]=function(){return M},M}r("Array.prototype.values",function(l){return l||function(){return i(this,function(h,m){return m})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function c(l){var h=typeof l;return h=h!="object"?h:l?Array.isArray(l)?"array":h:"null",h=="array"||h=="object"&&typeof l.length=="number"}function d(l){var h=typeof l;return h=="object"&&l!=null||h=="function"}function u(l,h,m){return l.call.apply(l.bind,arguments)}function p(l,h,m){if(!l)throw Error();if(2<arguments.length){var b=Array.prototype.slice.call(arguments,2);return function(){var M=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(M,b),l.apply(h,M)}}return function(){return l.apply(h,arguments)}}function f(l,h,m){return f=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?u:p,f.apply(null,arguments)}function g(l,h){var m=Array.prototype.slice.call(arguments,1);return function(){var b=m.slice();return b.push.apply(b,arguments),l.apply(this,b)}}function v(l,h){function m(){}m.prototype=h.prototype,l.aa=h.prototype,l.prototype=new m,l.prototype.constructor=l,l.Qb=function(b,M,L){for(var U=Array(arguments.length-2),Se=2;Se<arguments.length;Se++)U[Se-2]=arguments[Se];return h.prototype[M].apply(b,U)}}function y(l){const h=l.length;if(0<h){const m=Array(h);for(let b=0;b<h;b++)m[b]=l[b];return m}return[]}function E(l,h){for(let m=1;m<arguments.length;m++){const b=arguments[m];if(c(b)){const M=l.length||0,L=b.length||0;l.length=M+L;for(let U=0;U<L;U++)l[M+U]=b[U]}else l.push(b)}}class C{constructor(h,m){this.i=h,this.j=m,this.h=0,this.g=null}get(){let h;return 0<this.h?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function k(l){return/^[\s\xa0]*$/.test(l)}function P(){var l=a.navigator;return l&&(l=l.userAgent)?l:""}function R(l){return R[" "](l),l}R[" "]=function(){};var B=P().indexOf("Gecko")!=-1&&!(P().toLowerCase().indexOf("webkit")!=-1&&P().indexOf("Edge")==-1)&&!(P().indexOf("Trident")!=-1||P().indexOf("MSIE")!=-1)&&P().indexOf("Edge")==-1;function D(l,h,m){for(const b in l)h.call(m,l[b],b,l)}function I(l,h){for(const m in l)h.call(void 0,l[m],m,l)}function w(l){const h={};for(const m in l)h[m]=l[m];return h}const S="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function T(l,h){let m,b;for(let M=1;M<arguments.length;M++){b=arguments[M];for(m in b)l[m]=b[m];for(let L=0;L<S.length;L++)m=S[L],Object.prototype.hasOwnProperty.call(b,m)&&(l[m]=b[m])}}function x(l){var h=1;l=l.split(":");const m=[];for(;0<h&&l.length;)m.push(l.shift()),h--;return l.length&&m.push(l.join(":")),m}function A(l){a.setTimeout(()=>{throw l},0)}function _(){var l=ye;let h=null;return l.g&&(h=l.g,l.g=l.g.next,l.g||(l.h=null),h.next=null),h}class W{constructor(){this.h=this.g=null}add(h,m){const b=ee.get();b.set(h,m),this.h?this.h.next=b:this.g=b,this.h=b}}var ee=new C(()=>new H,l=>l.reset());class H{constructor(){this.next=this.g=this.h=null}set(h,m){this.h=h,this.g=m,this.next=null}reset(){this.next=this.g=this.h=null}}let re,te=!1,ye=new W,he=()=>{const l=a.Promise.resolve(void 0);re=()=>{l.then(ft)}};var ft=()=>{for(var l;l=_();){try{l.h.call(l.g)}catch(m){A(m)}var h=ee;h.j(l),100>h.h&&(h.h++,l.next=h.g,h.g=l)}te=!1};function ie(){this.s=this.s,this.C=this.C}ie.prototype.s=!1,ie.prototype.ma=function(){this.s||(this.s=!0,this.N())},ie.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function z(l,h){this.type=l,this.g=this.target=h,this.defaultPrevented=!1}z.prototype.h=function(){this.defaultPrevented=!0};var xe=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var l=!1,h=Object.defineProperty({},"passive",{get:function(){l=!0}});try{const m=()=>{};a.addEventListener("test",m,h),a.removeEventListener("test",m,h)}catch{}return l}();function ae(l,h){if(z.call(this,l?l.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,l){var m=this.type=l.type,b=l.changedTouches&&l.changedTouches.length?l.changedTouches[0]:null;if(this.target=l.target||l.srcElement,this.g=h,h=l.relatedTarget){if(B){e:{try{R(h.nodeName);var M=!0;break e}catch{}M=!1}M||(h=null)}}else m=="mouseover"?h=l.fromElement:m=="mouseout"&&(h=l.toElement);this.relatedTarget=h,b?(this.clientX=b.clientX!==void 0?b.clientX:b.pageX,this.clientY=b.clientY!==void 0?b.clientY:b.pageY,this.screenX=b.screenX||0,this.screenY=b.screenY||0):(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0),this.button=l.button,this.key=l.key||"",this.ctrlKey=l.ctrlKey,this.altKey=l.altKey,this.shiftKey=l.shiftKey,this.metaKey=l.metaKey,this.pointerId=l.pointerId||0,this.pointerType=typeof l.pointerType=="string"?l.pointerType:nn[l.pointerType]||"",this.state=l.state,this.i=l,l.defaultPrevented&&ae.aa.h.call(this)}}v(ae,z);var nn={2:"touch",3:"pen",4:"mouse"};ae.prototype.h=function(){ae.aa.h.call(this);var l=this.i;l.preventDefault?l.preventDefault():l.returnValue=!1};var Ge="closure_listenable_"+(1e6*Math.random()|0),Pn=0;function oe(l,h,m,b,M){this.listener=l,this.proxy=null,this.src=h,this.type=m,this.capture=!!b,this.ha=M,this.key=++Pn,this.da=this.fa=!1}function fe(l){l.da=!0,l.listener=null,l.proxy=null,l.src=null,l.ha=null}function je(l){this.src=l,this.g={},this.h=0}je.prototype.add=function(l,h,m,b,M){var L=l.toString();l=this.g[L],l||(l=this.g[L]=[],this.h++);var U=At(l,h,b,M);return-1<U?(h=l[U],m||(h.fa=!1)):(h=new oe(h,this.src,L,!!b,M),h.fa=m,l.push(h)),h};function sn(l,h){var m=h.type;if(m in l.g){var b=l.g[m],M=Array.prototype.indexOf.call(b,h,void 0),L;(L=0<=M)&&Array.prototype.splice.call(b,M,1),L&&(fe(h),l.g[m].length==0&&(delete l.g[m],l.h--))}}function At(l,h,m,b){for(var M=0;M<l.length;++M){var L=l[M];if(!L.da&&L.listener==h&&L.capture==!!m&&L.ha==b)return M}return-1}var Ke="closure_lm_"+(1e6*Math.random()|0),Lt={};function et(l,h,m,b,M){if(Array.isArray(h)){for(var L=0;L<h.length;L++)et(l,h[L],m,b,M);return null}return m=Ct(m),l&&l[Ge]?l.K(h,m,d(b)?!!b.capture:!1,M):rn(l,h,m,!1,b,M)}function rn(l,h,m,b,M,L){if(!h)throw Error("Invalid event type");var U=d(M)?!!M.capture:!!M,Se=Mn(l);if(Se||(l[Ke]=Se=new je(l)),m=Se.add(h,m,b,U,L),m.proxy)return m;if(b=kt(),m.proxy=b,b.src=l,b.listener=m,l.addEventListener)xe||(M=U),M===void 0&&(M=!1),l.addEventListener(h.toString(),b,M);else if(l.attachEvent)l.attachEvent(Sr(h.toString()),b);else if(l.addListener&&l.removeListener)l.addListener(b);else throw Error("addEventListener and attachEvent are unavailable.");return m}function kt(){function l(m){return h.call(l.src,l.listener,m)}const h=Rn;return l}function on(l,h,m,b,M){if(Array.isArray(h))for(var L=0;L<h.length;L++)on(l,h[L],m,b,M);else b=d(b)?!!b.capture:!!b,m=Ct(m),l&&l[Ge]?(l=l.i,h=String(h).toString(),h in l.g&&(L=l.g[h],m=At(L,m,b,M),-1<m&&(fe(L[m]),Array.prototype.splice.call(L,m,1),L.length==0&&(delete l.g[h],l.h--)))):l&&(l=Mn(l))&&(h=l.g[h.toString()],l=-1,h&&(l=At(h,m,b,M)),(m=-1<l?h[l]:null)&&Hs(m))}function Hs(l){if(typeof l!="number"&&l&&!l.da){var h=l.src;if(h&&h[Ge])sn(h.i,l);else{var m=l.type,b=l.proxy;h.removeEventListener?h.removeEventListener(m,b,l.capture):h.detachEvent?h.detachEvent(Sr(m),b):h.addListener&&h.removeListener&&h.removeListener(b),(m=Mn(h))?(sn(m,l),m.h==0&&(m.src=null,h[Ke]=null)):fe(l)}}}function Sr(l){return l in Lt?Lt[l]:Lt[l]="on"+l}function Rn(l,h){if(l.da)l=!0;else{h=new ae(h,this);var m=l.listener,b=l.ha||l.src;l.fa&&Hs(l),l=m.call(b,h)}return l}function Mn(l){return l=l[Ke],l instanceof je?l:null}var Wt="__closure_events_fn_"+(1e9*Math.random()>>>0);function Ct(l){return typeof l=="function"?l:(l[Wt]||(l[Wt]=function(h){return l.handleEvent(h)}),l[Wt])}function Fe(){ie.call(this),this.i=new je(this),this.M=this,this.F=null}v(Fe,ie),Fe.prototype[Ge]=!0,Fe.prototype.removeEventListener=function(l,h,m,b){on(this,l,h,m,b)};function Ve(l,h){var m,b=l.F;if(b)for(m=[];b;b=b.F)m.push(b);if(l=l.M,b=h.type||h,typeof h=="string")h=new z(h,l);else if(h instanceof z)h.target=h.target||l;else{var M=h;h=new z(b,l),T(h,M)}if(M=!0,m)for(var L=m.length-1;0<=L;L--){var U=h.g=m[L];M=Bn(U,b,!0,h)&&M}if(U=h.g=l,M=Bn(U,b,!0,h)&&M,M=Bn(U,b,!1,h)&&M,m)for(L=0;L<m.length;L++)U=h.g=m[L],M=Bn(U,b,!1,h)&&M}Fe.prototype.N=function(){if(Fe.aa.N.call(this),this.i){var l=this.i,h;for(h in l.g){for(var m=l.g[h],b=0;b<m.length;b++)fe(m[b]);delete l.g[h],l.h--}}this.F=null},Fe.prototype.K=function(l,h,m,b){return this.i.add(String(l),h,!1,m,b)},Fe.prototype.L=function(l,h,m,b){return this.i.add(String(l),h,!0,m,b)};function Bn(l,h,m,b){if(h=l.i.g[String(h)],!h)return!0;h=h.concat();for(var M=!0,L=0;L<h.length;++L){var U=h[L];if(U&&!U.da&&U.capture==m){var Se=U.listener,nt=U.ha||U.src;U.fa&&sn(l.i,U),M=Se.call(nt,b)!==!1&&M}}return M&&!b.defaultPrevented}function xr(l,h,m){if(typeof l=="function")m&&(l=f(l,m));else if(l&&typeof l.handleEvent=="function")l=f(l.handleEvent,l);else throw Error("Invalid listener argument");return 2147483647<Number(h)?-1:a.setTimeout(l,h||0)}function us(l){l.g=xr(()=>{l.g=null,l.i&&(l.i=!1,us(l))},l.l);const h=l.h;l.h=null,l.m.apply(null,h)}class Ys extends ie{constructor(h,m){super(),this.m=h,this.l=m,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:us(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Dn(l){ie.call(this),this.h=l,this.g={}}v(Dn,ie);var hs=[];function He(l){D(l.g,function(h,m){this.g.hasOwnProperty(m)&&Hs(h)},l),l.g={}}Dn.prototype.N=function(){Dn.aa.N.call(this),He(this)},Dn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ut=a.JSON.stringify,Ln=a.JSON.parse,fs=class{stringify(l){return a.JSON.stringify(l,void 0)}parse(l){return a.JSON.parse(l,void 0)}};function Gt(){}Gt.prototype.h=null;function an(l){return l.h||(l.h=l.i())}function Ar(){}var ln={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function jt(){z.call(this,"d")}v(jt,z);function Nn(){z.call(this,"c")}v(Nn,z);var pt={},ze=null;function ps(){return ze=ze||new Fe}pt.La="serverreachability";function K(l){z.call(this,pt.La,l)}v(K,z);function ve(l){const h=ps();Ve(h,new K(h))}pt.STAT_EVENT="statevent";function tt(l,h){z.call(this,pt.STAT_EVENT,l),this.stat=h}v(tt,z);function Ue(l){const h=ps();Ve(h,new tt(h,l))}pt.Ma="timingevent";function On(l,h){z.call(this,pt.Ma,l),this.size=h}v(On,z);function Ws(l,h){if(typeof l!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){l()},h)}function Gs(){this.g=!0}Gs.prototype.xa=function(){this.g=!1};function $l(l,h,m,b,M,L){l.info(function(){if(l.g)if(L)for(var U="",Se=L.split("&"),nt=0;nt<Se.length;nt++){var me=Se[nt].split("=");if(1<me.length){var yt=me[0];me=me[1];var vt=yt.split("_");U=2<=vt.length&&vt[1]=="type"?U+(yt+"="+me+"&"):U+(yt+"=redacted&")}}else U=null;else U=L;return"XMLHTTP REQ ("+b+") [attempt "+M+"]: "+h+`
`+m+`
`+U})}function ql(l,h,m,b,M,L,U){l.info(function(){return"XMLHTTP RESP ("+b+") [ attempt "+M+"]: "+h+`
`+m+`
`+L+" "+U})}function gn(l,h,m,b){l.info(function(){return"XMLHTTP TEXT ("+h+"): "+qo(l,m)+(b?" "+b:"")})}function Hl(l,h){l.info(function(){return"TIMEOUT: "+h})}Gs.prototype.info=function(){};function qo(l,h){if(!l.g)return h;if(!h)return null;try{var m=JSON.parse(h);if(m){for(l=0;l<m.length;l++)if(Array.isArray(m[l])){var b=m[l];if(!(2>b.length)){var M=b[1];if(Array.isArray(M)&&!(1>M.length)){var L=M[0];if(L!="noop"&&L!="stop"&&L!="close")for(var U=1;U<M.length;U++)M[U]=""}}}}return Ut(m)}catch{return h}}var js={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},_i={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},kr;function J(){}v(J,Gt),J.prototype.g=function(){return new XMLHttpRequest},J.prototype.i=function(){return{}},kr=new J;function Pe(l,h,m,b){this.j=l,this.i=h,this.l=m,this.R=b||1,this.U=new Dn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Nt}function Nt(){this.i=null,this.g="",this.h=!1}var Qe={},Pt={};function pe(l,h,m){l.L=1,l.v=Wo(Fn(h)),l.m=m,l.P=!0,mt(l,null)}function mt(l,h){l.F=Date.now(),Ks(l),l.A=Fn(l.v);var m=l.A,b=l.R;Array.isArray(b)||(b=[String(b)]),mh(m.i,"t",b),l.C=0,m=l.j.J,l.h=new Nt,l.g=Bh(l.j,m?h:null,!l.m),0<l.O&&(l.M=new Ys(f(l.Y,l,l.g),l.O)),h=l.U,m=l.g,b=l.ca;var M="readystatechange";Array.isArray(M)||(M&&(hs[0]=M.toString()),M=hs);for(var L=0;L<M.length;L++){var U=et(m,M[L],b||h.handleEvent,!1,h.h||h);if(!U)break;h.g[U.key]=U}h=l.H?w(l.H):{},l.m?(l.u||(l.u="POST"),h["Content-Type"]="application/x-www-form-urlencoded",l.g.ea(l.A,l.u,l.m,h)):(l.u="GET",l.g.ea(l.A,l.u,null,h)),ve(),$l(l.i,l.u,l.A,l.l,l.R,l.m)}Pe.prototype.ca=function(l){l=l.target;const h=this.M;h&&Vn(l)==3?h.j():this.Y(l)},Pe.prototype.Y=function(l){try{if(l==this.g)e:{const vt=Vn(this.g);var h=this.g.Ba();const Mr=this.g.Z();if(!(3>vt)&&(vt!=3||this.g&&(this.h.h||this.g.oa()||Th(this.g)))){this.J||vt!=4||h==7||(h==8||0>=Mr?ve(3):ve(2)),Cr(this);var m=this.g.Z();this.X=m;t:if(gt(this)){var b=Th(this.g);l="";var M=b.length,L=Vn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){gs(this),Qs(this);var U="";break t}this.h.i=new a.TextDecoder}for(h=0;h<M;h++)this.h.h=!0,l+=this.h.i.decode(b[h],{stream:!(L&&h==M-1)});b.length=0,this.h.g+=l,this.C=0,U=this.h.g}else U=this.g.oa();if(this.o=m==200,ql(this.i,this.u,this.A,this.l,this.R,vt,m),this.o){if(this.T&&!this.K){t:{if(this.g){var Se,nt=this.g;if((Se=nt.g?nt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!k(Se)){var me=Se;break t}}me=null}if(m=me)gn(this.i,this.l,m,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Yl(this,m);else{this.o=!1,this.s=3,Ue(12),gs(this),Qs(this);break e}}if(this.P){m=!0;let cn;for(;!this.J&&this.C<U.length;)if(cn=ms(this,U),cn==Pt){vt==4&&(this.s=4,Ue(14),m=!1),gn(this.i,this.l,null,"[Incomplete Response]");break}else if(cn==Qe){this.s=4,Ue(15),gn(this.i,this.l,U,"[Invalid Chunk]"),m=!1;break}else gn(this.i,this.l,cn,null),Yl(this,cn);if(gt(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),vt!=4||U.length!=0||this.h.h||(this.s=1,Ue(16),m=!1),this.o=this.o&&m,!m)gn(this.i,this.l,U,"[Invalid Chunked Response]"),gs(this),Qs(this);else if(0<U.length&&!this.W){this.W=!0;var yt=this.j;yt.g==this&&yt.ba&&!yt.M&&(yt.j.info("Great, no buffering proxy detected. Bytes received: "+U.length),Jl(yt),yt.M=!0,Ue(11))}}else gn(this.i,this.l,U,null),Yl(this,U);vt==4&&gs(this),this.o&&!this.J&&(vt==4?Ch(this.j,this):(this.o=!1,Ks(this)))}else i1(this.g),m==400&&0<U.indexOf("Unknown SID")?(this.s=3,Ue(12)):(this.s=0,Ue(13)),gs(this),Qs(this)}}}catch{}finally{}};function gt(l){return l.g?l.u=="GET"&&l.L!=2&&l.j.Ca:!1}function ms(l,h){var m=l.C,b=h.indexOf(`
`,m);return b==-1?Pt:(m=Number(h.substring(m,b)),isNaN(m)?Qe:(b+=1,b+m>h.length?Pt:(h=h.slice(b,b+m),l.C=b+m,h)))}Pe.prototype.cancel=function(){this.J=!0,gs(this)};function Ks(l){l.S=Date.now()+l.I,Ot(l,l.I)}function Ot(l,h){if(l.B!=null)throw Error("WatchDog timer not null");l.B=Ws(f(l.ba,l),h)}function Cr(l){l.B&&(a.clearTimeout(l.B),l.B=null)}Pe.prototype.ba=function(){this.B=null;const l=Date.now();0<=l-this.S?(Hl(this.i,this.A),this.L!=2&&(ve(),Ue(17)),gs(this),this.s=2,Qs(this)):Ot(this,this.S-l)};function Qs(l){l.j.G==0||l.J||Ch(l.j,l)}function gs(l){Cr(l);var h=l.M;h&&typeof h.ma=="function"&&h.ma(),l.M=null,He(l.U),l.g&&(h=l.g,l.g=null,h.abort(),h.ma())}function Yl(l,h){try{var m=l.j;if(m.G!=0&&(m.g==l||Wl(m.h,l))){if(!l.K&&Wl(m.h,l)&&m.G==3){try{var b=m.Da.g.parse(h)}catch{b=null}if(Array.isArray(b)&&b.length==3){var M=b;if(M[0]==0){e:if(!m.u){if(m.g)if(m.g.F+3e3<l.F)Xo(m),Qo(m);else break e;Ql(m),Ue(18)}}else m.za=M[1],0<m.za-m.T&&37500>M[2]&&m.F&&m.v==0&&!m.C&&(m.C=Ws(f(m.Za,m),6e3));if(1>=oh(m.h)&&m.ca){try{m.ca()}catch{}m.ca=void 0}}else Xs(m,11)}else if((l.K||m.g==l)&&Xo(m),!k(h))for(M=m.Da.g.parse(h),h=0;h<M.length;h++){let me=M[h];if(m.T=me[0],me=me[1],m.G==2)if(me[0]=="c"){m.K=me[1],m.ia=me[2];const yt=me[3];yt!=null&&(m.la=yt,m.j.info("VER="+m.la));const vt=me[4];vt!=null&&(m.Aa=vt,m.j.info("SVER="+m.Aa));const Mr=me[5];Mr!=null&&typeof Mr=="number"&&0<Mr&&(b=1.5*Mr,m.L=b,m.j.info("backChannelRequestTimeoutMs_="+b)),b=m;const cn=l.g;if(cn){const ea=cn.g?cn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ea){var L=b.h;L.g||ea.indexOf("spdy")==-1&&ea.indexOf("quic")==-1&&ea.indexOf("h2")==-1||(L.j=L.l,L.g=new Set,L.h&&(Gl(L,L.h),L.h=null))}if(b.D){const Xl=cn.g?cn.g.getResponseHeader("X-HTTP-Session-Id"):null;Xl&&(b.ya=Xl,Ae(b.I,b.D,Xl))}}m.G=3,m.l&&m.l.ua(),m.ba&&(m.R=Date.now()-l.F,m.j.info("Handshake RTT: "+m.R+"ms")),b=m;var U=l;if(b.qa=Mh(b,b.J?b.ia:null,b.W),U.K){ah(b.h,U);var Se=U,nt=b.L;nt&&(Se.I=nt),Se.B&&(Cr(Se),Ks(Se)),b.g=U}else Ah(b);0<m.i.length&&Jo(m)}else me[0]!="stop"&&me[0]!="close"||Xs(m,7);else m.G==3&&(me[0]=="stop"||me[0]=="close"?me[0]=="stop"?Xs(m,7):Kl(m):me[0]!="noop"&&m.l&&m.l.ta(me),m.v=0)}}ve(4)}catch{}}var qy=class{constructor(l,h){this.g=l,this.map=h}};function rh(l){this.l=l||10,a.PerformanceNavigationTiming?(l=a.performance.getEntriesByType("navigation"),l=0<l.length&&(l[0].nextHopProtocol=="hq"||l[0].nextHopProtocol=="h2")):l=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=l?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function ih(l){return l.h?!0:l.g?l.g.size>=l.j:!1}function oh(l){return l.h?1:l.g?l.g.size:0}function Wl(l,h){return l.h?l.h==h:l.g?l.g.has(h):!1}function Gl(l,h){l.g?l.g.add(h):l.h=h}function ah(l,h){l.h&&l.h==h?l.h=null:l.g&&l.g.has(h)&&l.g.delete(h)}rh.prototype.cancel=function(){if(this.i=lh(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const l of this.g.values())l.cancel();this.g.clear()}};function lh(l){if(l.h!=null)return l.i.concat(l.h.D);if(l.g!=null&&l.g.size!==0){let h=l.i;for(const m of l.g.values())h=h.concat(m.D);return h}return y(l.i)}function Hy(l){if(l.V&&typeof l.V=="function")return l.V();if(typeof Map<"u"&&l instanceof Map||typeof Set<"u"&&l instanceof Set)return Array.from(l.values());if(typeof l=="string")return l.split("");if(c(l)){for(var h=[],m=l.length,b=0;b<m;b++)h.push(l[b]);return h}h=[],m=0;for(b in l)h[m++]=l[b];return h}function Yy(l){if(l.na&&typeof l.na=="function")return l.na();if(!l.V||typeof l.V!="function"){if(typeof Map<"u"&&l instanceof Map)return Array.from(l.keys());if(!(typeof Set<"u"&&l instanceof Set)){if(c(l)||typeof l=="string"){var h=[];l=l.length;for(var m=0;m<l;m++)h.push(m);return h}h=[],m=0;for(const b in l)h[m++]=b;return h}}}function ch(l,h){if(l.forEach&&typeof l.forEach=="function")l.forEach(h,void 0);else if(c(l)||typeof l=="string")Array.prototype.forEach.call(l,h,void 0);else for(var m=Yy(l),b=Hy(l),M=b.length,L=0;L<M;L++)h.call(void 0,b[L],m&&m[L],l)}var dh=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Wy(l,h){if(l){l=l.split("&");for(var m=0;m<l.length;m++){var b=l[m].indexOf("="),M=null;if(0<=b){var L=l[m].substring(0,b);M=l[m].substring(b+1)}else L=l[m];h(L,M?decodeURIComponent(M.replace(/\+/g," ")):"")}}}function Js(l){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,l instanceof Js){this.h=l.h,Ho(this,l.j),this.o=l.o,this.g=l.g,Yo(this,l.s),this.l=l.l;var h=l.i,m=new xi;m.i=h.i,h.g&&(m.g=new Map(h.g),m.h=h.h),uh(this,m),this.m=l.m}else l&&(h=String(l).match(dh))?(this.h=!1,Ho(this,h[1]||"",!0),this.o=Ii(h[2]||""),this.g=Ii(h[3]||"",!0),Yo(this,h[4]),this.l=Ii(h[5]||"",!0),uh(this,h[6]||"",!0),this.m=Ii(h[7]||"")):(this.h=!1,this.i=new xi(null,this.h))}Js.prototype.toString=function(){var l=[],h=this.j;h&&l.push(Si(h,hh,!0),":");var m=this.g;return(m||h=="file")&&(l.push("//"),(h=this.o)&&l.push(Si(h,hh,!0),"@"),l.push(encodeURIComponent(String(m)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),m=this.s,m!=null&&l.push(":",String(m))),(m=this.l)&&(this.g&&m.charAt(0)!="/"&&l.push("/"),l.push(Si(m,m.charAt(0)=="/"?Ky:jy,!0))),(m=this.i.toString())&&l.push("?",m),(m=this.m)&&l.push("#",Si(m,Jy)),l.join("")};function Fn(l){return new Js(l)}function Ho(l,h,m){l.j=m?Ii(h,!0):h,l.j&&(l.j=l.j.replace(/:$/,""))}function Yo(l,h){if(h){if(h=Number(h),isNaN(h)||0>h)throw Error("Bad port number "+h);l.s=h}else l.s=null}function uh(l,h,m){h instanceof xi?(l.i=h,Xy(l.i,l.h)):(m||(h=Si(h,Qy)),l.i=new xi(h,l.h))}function Ae(l,h,m){l.i.set(h,m)}function Wo(l){return Ae(l,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),l}function Ii(l,h){return l?h?decodeURI(l.replace(/%25/g,"%2525")):decodeURIComponent(l):""}function Si(l,h,m){return typeof l=="string"?(l=encodeURI(l).replace(h,Gy),m&&(l=l.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l):null}function Gy(l){return l=l.charCodeAt(0),"%"+(l>>4&15).toString(16)+(l&15).toString(16)}var hh=/[#\/\?@]/g,jy=/[#\?:]/g,Ky=/[#\?]/g,Qy=/[#\?@]/g,Jy=/#/g;function xi(l,h){this.h=this.g=null,this.i=l||null,this.j=!!h}function ys(l){l.g||(l.g=new Map,l.h=0,l.i&&Wy(l.i,function(h,m){l.add(decodeURIComponent(h.replace(/\+/g," ")),m)}))}t=xi.prototype,t.add=function(l,h){ys(this),this.i=null,l=Pr(this,l);var m=this.g.get(l);return m||this.g.set(l,m=[]),m.push(h),this.h+=1,this};function fh(l,h){ys(l),h=Pr(l,h),l.g.has(h)&&(l.i=null,l.h-=l.g.get(h).length,l.g.delete(h))}function ph(l,h){return ys(l),h=Pr(l,h),l.g.has(h)}t.forEach=function(l,h){ys(this),this.g.forEach(function(m,b){m.forEach(function(M){l.call(h,M,b,this)},this)},this)},t.na=function(){ys(this);const l=Array.from(this.g.values()),h=Array.from(this.g.keys()),m=[];for(let b=0;b<h.length;b++){const M=l[b];for(let L=0;L<M.length;L++)m.push(h[b])}return m},t.V=function(l){ys(this);let h=[];if(typeof l=="string")ph(this,l)&&(h=h.concat(this.g.get(Pr(this,l))));else{l=Array.from(this.g.values());for(let m=0;m<l.length;m++)h=h.concat(l[m])}return h},t.set=function(l,h){return ys(this),this.i=null,l=Pr(this,l),ph(this,l)&&(this.h-=this.g.get(l).length),this.g.set(l,[h]),this.h+=1,this},t.get=function(l,h){return l?(l=this.V(l),0<l.length?String(l[0]):h):h};function mh(l,h,m){fh(l,h),0<m.length&&(l.i=null,l.g.set(Pr(l,h),y(m)),l.h+=m.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const l=[],h=Array.from(this.g.keys());for(var m=0;m<h.length;m++){var b=h[m];const L=encodeURIComponent(String(b)),U=this.V(b);for(b=0;b<U.length;b++){var M=L;U[b]!==""&&(M+="="+encodeURIComponent(String(U[b]))),l.push(M)}}return this.i=l.join("&")};function Pr(l,h){return h=String(h),l.j&&(h=h.toLowerCase()),h}function Xy(l,h){h&&!l.j&&(ys(l),l.i=null,l.g.forEach(function(m,b){var M=b.toLowerCase();b!=M&&(fh(this,b),mh(this,M,m))},l)),l.j=h}function Zy(l,h){const m=new Gs;if(a.Image){const b=new Image;b.onload=g(vs,m,"TestLoadImage: loaded",!0,h,b),b.onerror=g(vs,m,"TestLoadImage: error",!1,h,b),b.onabort=g(vs,m,"TestLoadImage: abort",!1,h,b),b.ontimeout=g(vs,m,"TestLoadImage: timeout",!1,h,b),a.setTimeout(function(){b.ontimeout&&b.ontimeout()},1e4),b.src=l}else h(!1)}function e1(l,h){const m=new Gs,b=new AbortController,M=setTimeout(()=>{b.abort(),vs(m,"TestPingServer: timeout",!1,h)},1e4);fetch(l,{signal:b.signal}).then(L=>{clearTimeout(M),L.ok?vs(m,"TestPingServer: ok",!0,h):vs(m,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(M),vs(m,"TestPingServer: error",!1,h)})}function vs(l,h,m,b,M){try{M&&(M.onload=null,M.onerror=null,M.onabort=null,M.ontimeout=null),b(m)}catch{}}function t1(){this.g=new fs}function n1(l,h,m){const b=m||"";try{ch(l,function(M,L){let U=M;d(M)&&(U=Ut(M)),h.push(b+L+"="+encodeURIComponent(U))})}catch(M){throw h.push(b+"type="+encodeURIComponent("_badmap")),M}}function Go(l){this.l=l.Ub||null,this.j=l.eb||!1}v(Go,Gt),Go.prototype.g=function(){return new jo(this.l,this.j)},Go.prototype.i=function(l){return function(){return l}}({});function jo(l,h){Fe.call(this),this.D=l,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}v(jo,Fe),t=jo.prototype,t.open=function(l,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=l,this.A=h,this.readyState=1,ki(this)},t.send=function(l){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const h={headers:this.u,method:this.B,credentials:this.m,cache:void 0};l&&(h.body=l),(this.D||a).fetch(new Request(this.A,h)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Ai(this)),this.readyState=0},t.Sa=function(l){if(this.g&&(this.l=l,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=l.headers,this.readyState=2,ki(this)),this.g&&(this.readyState=3,ki(this),this.g)))if(this.responseType==="arraybuffer")l.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in l){if(this.j=l.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;gh(this)}else l.text().then(this.Ra.bind(this),this.ga.bind(this))};function gh(l){l.j.read().then(l.Pa.bind(l)).catch(l.ga.bind(l))}t.Pa=function(l){if(this.g){if(this.o&&l.value)this.response.push(l.value);else if(!this.o){var h=l.value?l.value:new Uint8Array(0);(h=this.v.decode(h,{stream:!l.done}))&&(this.response=this.responseText+=h)}l.done?Ai(this):ki(this),this.readyState==3&&gh(this)}},t.Ra=function(l){this.g&&(this.response=this.responseText=l,Ai(this))},t.Qa=function(l){this.g&&(this.response=l,Ai(this))},t.ga=function(){this.g&&Ai(this)};function Ai(l){l.readyState=4,l.l=null,l.j=null,l.v=null,ki(l)}t.setRequestHeader=function(l,h){this.u.append(l,h)},t.getResponseHeader=function(l){return this.h&&this.h.get(l.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const l=[],h=this.h.entries();for(var m=h.next();!m.done;)m=m.value,l.push(m[0]+": "+m[1]),m=h.next();return l.join(`\r
`)};function ki(l){l.onreadystatechange&&l.onreadystatechange.call(l)}Object.defineProperty(jo.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(l){this.m=l?"include":"same-origin"}});function yh(l){let h="";return D(l,function(m,b){h+=b,h+=":",h+=m,h+=`\r
`}),h}function jl(l,h,m){e:{for(b in m){var b=!1;break e}b=!0}b||(m=yh(m),typeof l=="string"?m!=null&&encodeURIComponent(String(m)):Ae(l,h,m))}function Le(l){Fe.call(this),this.headers=new Map,this.o=l||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}v(Le,Fe);var s1=/^https?$/i,r1=["POST","PUT"];t=Le.prototype,t.Ha=function(l){this.J=l},t.ea=function(l,h,m,b){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+l);h=h?h.toUpperCase():"GET",this.D=l,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():kr.g(),this.v=this.o?an(this.o):an(kr),this.g.onreadystatechange=f(this.Ea,this);try{this.B=!0,this.g.open(h,String(l),!0),this.B=!1}catch(L){vh(this,L);return}if(l=m||"",m=new Map(this.headers),b)if(Object.getPrototypeOf(b)===Object.prototype)for(var M in b)m.set(M,b[M]);else if(typeof b.keys=="function"&&typeof b.get=="function")for(const L of b.keys())m.set(L,b.get(L));else throw Error("Unknown input type for opt_headers: "+String(b));b=Array.from(m.keys()).find(L=>L.toLowerCase()=="content-type"),M=a.FormData&&l instanceof a.FormData,!(0<=Array.prototype.indexOf.call(r1,h,void 0))||b||M||m.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[L,U]of m)this.g.setRequestHeader(L,U);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Eh(this),this.u=!0,this.g.send(l),this.u=!1}catch(L){vh(this,L)}};function vh(l,h){l.h=!1,l.g&&(l.j=!0,l.g.abort(),l.j=!1),l.l=h,l.m=5,bh(l),Ko(l)}function bh(l){l.A||(l.A=!0,Ve(l,"complete"),Ve(l,"error"))}t.abort=function(l){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=l||7,Ve(this,"complete"),Ve(this,"abort"),Ko(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ko(this,!0)),Le.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?wh(this):this.bb())},t.bb=function(){wh(this)};function wh(l){if(l.h&&typeof o<"u"&&(!l.v[1]||Vn(l)!=4||l.Z()!=2)){if(l.u&&Vn(l)==4)xr(l.Ea,0,l);else if(Ve(l,"readystatechange"),Vn(l)==4){l.h=!1;try{const U=l.Z();e:switch(U){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var m;if(!(m=h)){var b;if(b=U===0){var M=String(l.D).match(dh)[1]||null;!M&&a.self&&a.self.location&&(M=a.self.location.protocol.slice(0,-1)),b=!s1.test(M?M.toLowerCase():"")}m=b}if(m)Ve(l,"complete"),Ve(l,"success");else{l.m=6;try{var L=2<Vn(l)?l.g.statusText:""}catch{L=""}l.l=L+" ["+l.Z()+"]",bh(l)}}finally{Ko(l)}}}}function Ko(l,h){if(l.g){Eh(l);const m=l.g,b=l.v[0]?()=>{}:null;l.g=null,l.v=null,h||Ve(l,"ready");try{m.onreadystatechange=b}catch{}}}function Eh(l){l.I&&(a.clearTimeout(l.I),l.I=null)}t.isActive=function(){return!!this.g};function Vn(l){return l.g?l.g.readyState:0}t.Z=function(){try{return 2<Vn(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(l){if(this.g){var h=this.g.responseText;return l&&h.indexOf(l)==0&&(h=h.substring(l.length)),Ln(h)}};function Th(l){try{if(!l.g)return null;if("response"in l.g)return l.g.response;switch(l.H){case"":case"text":return l.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in l.g)return l.g.mozResponseArrayBuffer}return null}catch{return null}}function i1(l){const h={};l=(l.g&&2<=Vn(l)&&l.g.getAllResponseHeaders()||"").split(`\r
`);for(let b=0;b<l.length;b++){if(k(l[b]))continue;var m=x(l[b]);const M=m[0];if(m=m[1],typeof m!="string")continue;m=m.trim();const L=h[M]||[];h[M]=L,L.push(m)}I(h,function(b){return b.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ci(l,h,m){return m&&m.internalChannelParams&&m.internalChannelParams[l]||h}function _h(l){this.Aa=0,this.i=[],this.j=new Gs,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ci("failFast",!1,l),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ci("baseRetryDelayMs",5e3,l),this.cb=Ci("retryDelaySeedMs",1e4,l),this.Wa=Ci("forwardChannelMaxRetries",2,l),this.wa=Ci("forwardChannelRequestTimeoutMs",2e4,l),this.pa=l&&l.xmlHttpFactory||void 0,this.Xa=l&&l.Tb||void 0,this.Ca=l&&l.useFetchStreams||!1,this.L=void 0,this.J=l&&l.supportsCrossDomainXhr||!1,this.K="",this.h=new rh(l&&l.concurrentRequestLimit),this.Da=new t1,this.P=l&&l.fastHandshake||!1,this.O=l&&l.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=l&&l.Rb||!1,l&&l.xa&&this.j.xa(),l&&l.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&l&&l.detectBufferingProxy||!1,this.ja=void 0,l&&l.longPollingTimeout&&0<l.longPollingTimeout&&(this.ja=l.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=_h.prototype,t.la=8,t.G=1,t.connect=function(l,h,m,b){Ue(0),this.W=l,this.H=h||{},m&&b!==void 0&&(this.H.OSID=m,this.H.OAID=b),this.F=this.X,this.I=Mh(this,null,this.W),Jo(this)};function Kl(l){if(Ih(l),l.G==3){var h=l.U++,m=Fn(l.I);if(Ae(m,"SID",l.K),Ae(m,"RID",h),Ae(m,"TYPE","terminate"),Pi(l,m),h=new Pe(l,l.j,h),h.L=2,h.v=Wo(Fn(m)),m=!1,a.navigator&&a.navigator.sendBeacon)try{m=a.navigator.sendBeacon(h.v.toString(),"")}catch{}!m&&a.Image&&(new Image().src=h.v,m=!0),m||(h.g=Bh(h.j,null),h.g.ea(h.v)),h.F=Date.now(),Ks(h)}Rh(l)}function Qo(l){l.g&&(Jl(l),l.g.cancel(),l.g=null)}function Ih(l){Qo(l),l.u&&(a.clearTimeout(l.u),l.u=null),Xo(l),l.h.cancel(),l.s&&(typeof l.s=="number"&&a.clearTimeout(l.s),l.s=null)}function Jo(l){if(!ih(l.h)&&!l.s){l.s=!0;var h=l.Ga;re||he(),te||(re(),te=!0),ye.add(h,l),l.B=0}}function o1(l,h){return oh(l.h)>=l.h.j-(l.s?1:0)?!1:l.s?(l.i=h.D.concat(l.i),!0):l.G==1||l.G==2||l.B>=(l.Va?0:l.Wa)?!1:(l.s=Ws(f(l.Ga,l,h),Ph(l,l.B)),l.B++,!0)}t.Ga=function(l){if(this.s)if(this.s=null,this.G==1){if(!l){this.U=Math.floor(1e5*Math.random()),l=this.U++;const M=new Pe(this,this.j,l);let L=this.o;if(this.S&&(L?(L=w(L),T(L,this.S)):L=this.S),this.m!==null||this.O||(M.H=L,L=null),this.P)e:{for(var h=0,m=0;m<this.i.length;m++){t:{var b=this.i[m];if("__data__"in b.map&&(b=b.map.__data__,typeof b=="string")){b=b.length;break t}b=void 0}if(b===void 0)break;if(h+=b,4096<h){h=m;break e}if(h===4096||m===this.i.length-1){h=m+1;break e}}h=1e3}else h=1e3;h=xh(this,M,h),m=Fn(this.I),Ae(m,"RID",l),Ae(m,"CVER",22),this.D&&Ae(m,"X-HTTP-Session-Id",this.D),Pi(this,m),L&&(this.O?h="headers="+encodeURIComponent(String(yh(L)))+"&"+h:this.m&&jl(m,this.m,L)),Gl(this.h,M),this.Ua&&Ae(m,"TYPE","init"),this.P?(Ae(m,"$req",h),Ae(m,"SID","null"),M.T=!0,pe(M,m,null)):pe(M,m,h),this.G=2}}else this.G==3&&(l?Sh(this,l):this.i.length==0||ih(this.h)||Sh(this))};function Sh(l,h){var m;h?m=h.l:m=l.U++;const b=Fn(l.I);Ae(b,"SID",l.K),Ae(b,"RID",m),Ae(b,"AID",l.T),Pi(l,b),l.m&&l.o&&jl(b,l.m,l.o),m=new Pe(l,l.j,m,l.B+1),l.m===null&&(m.H=l.o),h&&(l.i=h.D.concat(l.i)),h=xh(l,m,1e3),m.I=Math.round(.5*l.wa)+Math.round(.5*l.wa*Math.random()),Gl(l.h,m),pe(m,b,h)}function Pi(l,h){l.H&&D(l.H,function(m,b){Ae(h,b,m)}),l.l&&ch({},function(m,b){Ae(h,b,m)})}function xh(l,h,m){m=Math.min(l.i.length,m);var b=l.l?f(l.l.Na,l.l,l):null;e:{var M=l.i;let L=-1;for(;;){const U=["count="+m];L==-1?0<m?(L=M[0].g,U.push("ofs="+L)):L=0:U.push("ofs="+L);let Se=!0;for(let nt=0;nt<m;nt++){let me=M[nt].g;const yt=M[nt].map;if(me-=L,0>me)L=Math.max(0,M[nt].g-100),Se=!1;else try{n1(yt,U,"req"+me+"_")}catch{b&&b(yt)}}if(Se){b=U.join("&");break e}}}return l=l.i.splice(0,m),h.D=l,b}function Ah(l){if(!l.g&&!l.u){l.Y=1;var h=l.Fa;re||he(),te||(re(),te=!0),ye.add(h,l),l.v=0}}function Ql(l){return l.g||l.u||3<=l.v?!1:(l.Y++,l.u=Ws(f(l.Fa,l),Ph(l,l.v)),l.v++,!0)}t.Fa=function(){if(this.u=null,kh(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var l=2*this.R;this.j.info("BP detection timer enabled: "+l),this.A=Ws(f(this.ab,this),l)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ue(10),Qo(this),kh(this))};function Jl(l){l.A!=null&&(a.clearTimeout(l.A),l.A=null)}function kh(l){l.g=new Pe(l,l.j,"rpc",l.Y),l.m===null&&(l.g.H=l.o),l.g.O=0;var h=Fn(l.qa);Ae(h,"RID","rpc"),Ae(h,"SID",l.K),Ae(h,"AID",l.T),Ae(h,"CI",l.F?"0":"1"),!l.F&&l.ja&&Ae(h,"TO",l.ja),Ae(h,"TYPE","xmlhttp"),Pi(l,h),l.m&&l.o&&jl(h,l.m,l.o),l.L&&(l.g.I=l.L);var m=l.g;l=l.ia,m.L=1,m.v=Wo(Fn(h)),m.m=null,m.P=!0,mt(m,l)}t.Za=function(){this.C!=null&&(this.C=null,Qo(this),Ql(this),Ue(19))};function Xo(l){l.C!=null&&(a.clearTimeout(l.C),l.C=null)}function Ch(l,h){var m=null;if(l.g==h){Xo(l),Jl(l),l.g=null;var b=2}else if(Wl(l.h,h))m=h.D,ah(l.h,h),b=1;else return;if(l.G!=0){if(h.o)if(b==1){m=h.m?h.m.length:0,h=Date.now()-h.F;var M=l.B;b=ps(),Ve(b,new On(b,m)),Jo(l)}else Ah(l);else if(M=h.s,M==3||M==0&&0<h.X||!(b==1&&o1(l,h)||b==2&&Ql(l)))switch(m&&0<m.length&&(h=l.h,h.i=h.i.concat(m)),M){case 1:Xs(l,5);break;case 4:Xs(l,10);break;case 3:Xs(l,6);break;default:Xs(l,2)}}}function Ph(l,h){let m=l.Ta+Math.floor(Math.random()*l.cb);return l.isActive()||(m*=2),m*h}function Xs(l,h){if(l.j.info("Error code "+h),h==2){var m=f(l.fb,l),b=l.Xa;const M=!b;b=new Js(b||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||Ho(b,"https"),Wo(b),M?Zy(b.toString(),m):e1(b.toString(),m)}else Ue(2);l.G=0,l.l&&l.l.sa(h),Rh(l),Ih(l)}t.fb=function(l){l?(this.j.info("Successfully pinged google.com"),Ue(2)):(this.j.info("Failed to ping google.com"),Ue(1))};function Rh(l){if(l.G=0,l.ka=[],l.l){const h=lh(l.h);(h.length!=0||l.i.length!=0)&&(E(l.ka,h),E(l.ka,l.i),l.h.i.length=0,y(l.i),l.i.length=0),l.l.ra()}}function Mh(l,h,m){var b=m instanceof Js?Fn(m):new Js(m);if(b.g!="")h&&(b.g=h+"."+b.g),Yo(b,b.s);else{var M=a.location;b=M.protocol,h=h?h+"."+M.hostname:M.hostname,M=+M.port;var L=new Js(null);b&&Ho(L,b),h&&(L.g=h),M&&Yo(L,M),m&&(L.l=m),b=L}return m=l.D,h=l.ya,m&&h&&Ae(b,m,h),Ae(b,"VER",l.la),Pi(l,b),b}function Bh(l,h,m){if(h&&!l.J)throw Error("Can't create secondary domain capable XhrIo object.");return h=l.Ca&&!l.pa?new Le(new Go({eb:m})):new Le(l.pa),h.Ha(l.J),h}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function Dh(){}t=Dh.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function Zo(){}Zo.prototype.g=function(l,h){return new $t(l,h)};function $t(l,h){Fe.call(this),this.g=new _h(h),this.l=l,this.h=h&&h.messageUrlParams||null,l=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(l?l["X-Client-Protocol"]="webchannel":l={"X-Client-Protocol":"webchannel"}),this.g.o=l,l=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(l?l["X-WebChannel-Content-Type"]=h.messageContentType:l={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.va&&(l?l["X-WebChannel-Client-Profile"]=h.va:l={"X-WebChannel-Client-Profile":h.va}),this.g.S=l,(l=h&&h.Sb)&&!k(l)&&(this.g.m=l),this.v=h&&h.supportsCrossDomainXhr||!1,this.u=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!k(h)&&(this.g.D=h,l=this.h,l!==null&&h in l&&(l=this.h,h in l&&delete l[h])),this.j=new Rr(this)}v($t,Fe),$t.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},$t.prototype.close=function(){Kl(this.g)},$t.prototype.o=function(l){var h=this.g;if(typeof l=="string"){var m={};m.__data__=l,l=m}else this.u&&(m={},m.__data__=Ut(l),l=m);h.i.push(new qy(h.Ya++,l)),h.G==3&&Jo(h)},$t.prototype.N=function(){this.g.l=null,delete this.j,Kl(this.g),delete this.g,$t.aa.N.call(this)};function Lh(l){jt.call(this),l.__headers__&&(this.headers=l.__headers__,this.statusCode=l.__status__,delete l.__headers__,delete l.__status__);var h=l.__sm__;if(h){e:{for(const m in h){l=m;break e}l=void 0}(this.i=l)&&(l=this.i,h=h!==null&&l in h?h[l]:void 0),this.data=h}else this.data=l}v(Lh,jt);function Nh(){Nn.call(this),this.status=1}v(Nh,Nn);function Rr(l){this.g=l}v(Rr,Dh),Rr.prototype.ua=function(){Ve(this.g,"a")},Rr.prototype.ta=function(l){Ve(this.g,new Lh(l))},Rr.prototype.sa=function(l){Ve(this.g,new Nh)},Rr.prototype.ra=function(){Ve(this.g,"b")},Zo.prototype.createWebChannel=Zo.prototype.g,$t.prototype.send=$t.prototype.o,$t.prototype.open=$t.prototype.m,$t.prototype.close=$t.prototype.close,Pm=function(){return new Zo},Cm=function(){return ps()},km=pt,Ac={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},js.NO_ERROR=0,js.TIMEOUT=8,js.HTTP_ERROR=6,pa=js,_i.COMPLETE="complete",Am=_i,Ar.EventType=ln,ln.OPEN="a",ln.CLOSE="b",ln.ERROR="c",ln.MESSAGE="d",Fe.prototype.listen=Fe.prototype.K,Ni=Ar,Le.prototype.listenOnce=Le.prototype.L,Le.prototype.getLastError=Le.prototype.Ka,Le.prototype.getLastErrorCode=Le.prototype.Ba,Le.prototype.getStatus=Le.prototype.Z,Le.prototype.getResponseJson=Le.prototype.Oa,Le.prototype.getResponseText=Le.prototype.oa,Le.prototype.send=Le.prototype.ea,Le.prototype.setWithCredentials=Le.prototype.Ha,xm=Le}).apply(typeof sa<"u"?sa:typeof self<"u"?self:typeof window<"u"?window:{});const gf="@firebase/firestore";/**
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
 */class wt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}wt.UNAUTHENTICATED=new wt(null),wt.GOOGLE_CREDENTIALS=new wt("google-credentials-uid"),wt.FIRST_PARTY=new wt("first-party-uid"),wt.MOCK_USER=new wt("mock-user");/**
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
 */let di="10.14.0";/**
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
 */const ur=new pd("@firebase/firestore");function Ri(){return ur.logLevel}function Y(t,...e){if(ur.logLevel<=de.DEBUG){const n=e.map(kd);ur.debug(`Firestore (${di}): ${t}`,...n)}}function Xn(t,...e){if(ur.logLevel<=de.ERROR){const n=e.map(kd);ur.error(`Firestore (${di}): ${t}`,...n)}}function Jr(t,...e){if(ur.logLevel<=de.WARN){const n=e.map(kd);ur.warn(`Firestore (${di}): ${t}`,...n)}}function kd(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
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
 */function Z(t="Unexpected state"){const e=`FIRESTORE (${di}) INTERNAL ASSERTION FAILED: `+t;throw Xn(e),new Error(e)}function Te(t,e){t||Z()}function se(t,e){return t}/**
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
 */const N={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class q extends is{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Gn{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
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
 */class Rm{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class h2{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(wt.UNAUTHENTICATED))}shutdown(){}}class f2{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class p2{constructor(e){this.t=e,this.currentUser=wt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){Te(this.o===void 0);let s=this.i;const r=c=>this.i!==s?(s=this.i,n(c)):Promise.resolve();let i=new Gn;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Gn,e.enqueueRetryable(()=>r(this.currentUser))};const o=()=>{const c=i;e.enqueueRetryable(async()=>{await c.promise,await r(this.currentUser)})},a=c=>{Y("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>a(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?a(c):(Y("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Gn)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(s=>this.i!==e?(Y("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Te(typeof s.accessToken=="string"),new Rm(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Te(e===null||typeof e=="string"),new wt(e)}}class m2{constructor(e,n,s){this.l=e,this.h=n,this.P=s,this.type="FirstParty",this.user=wt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class g2{constructor(e,n,s){this.l=e,this.h=n,this.P=s}getToken(){return Promise.resolve(new m2(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(wt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class y2{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class v2{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){Te(this.o===void 0);const s=i=>{i.error!=null&&Y("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.R;return this.R=i.token,Y("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>s(i))};const r=i=>{Y("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>r(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?r(i):Y("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(Te(typeof n.token=="string"),this.R=n.token,new y2(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function b2(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let s=0;s<t;s++)n[s]=Math.floor(256*Math.random());return n}/**
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
 */class Mm{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const r=b2(40);for(let i=0;i<r.length;++i)s.length<20&&r[i]<n&&(s+=e.charAt(r[i]%e.length))}return s}}function ge(t,e){return t<e?-1:t>e?1:0}function Xr(t,e,n){return t.length===e.length&&t.every((s,r)=>n(s,e[r]))}/**
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
 */class Ye{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new q(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new q(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new q(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new q(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Ye.fromMillis(Date.now())}static fromDate(e){return Ye.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*n));return new Ye(n,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ge(this.nanoseconds,e.nanoseconds):ge(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class ne{constructor(e){this.timestamp=e}static fromTimestamp(e){return new ne(e)}static min(){return new ne(new Ye(0,0))}static max(){return new ne(new Ye(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class eo{constructor(e,n,s){n===void 0?n=0:n>e.length&&Z(),s===void 0?s=e.length-n:s>e.length-n&&Z(),this.segments=e,this.offset=n,this.len=s}get length(){return this.len}isEqual(e){return eo.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof eo?e.forEach(s=>{n.push(s)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,s=this.limit();n<s;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const s=Math.min(e.length,n.length);for(let r=0;r<s;r++){const i=e.get(r),o=n.get(r);if(i<o)return-1;if(i>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class ke extends eo{construct(e,n,s){return new ke(e,n,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const s of e){if(s.indexOf("//")>=0)throw new q(N.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);n.push(...s.split("/").filter(r=>r.length>0))}return new ke(n)}static emptyPath(){return new ke([])}}const w2=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class rt extends eo{construct(e,n,s){return new rt(e,n,s)}static isValidIdentifier(e){return w2.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),rt.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new rt(["__name__"])}static fromServerFormat(e){const n=[];let s="",r=0;const i=()=>{if(s.length===0)throw new q(N.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(s),s=""};let o=!1;for(;r<e.length;){const a=e[r];if(a==="\\"){if(r+1===e.length)throw new q(N.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[r+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new q(N.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=c,r+=2}else a==="`"?(o=!o,r++):a!=="."||o?(s+=a,r++):(i(),r++)}if(i(),o)throw new q(N.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new rt(n)}static emptyPath(){return new rt([])}}/**
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
 */class G{constructor(e){this.path=e}static fromPath(e){return new G(ke.fromString(e))}static fromName(e){return new G(ke.fromString(e).popFirst(5))}static empty(){return new G(ke.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ke.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return ke.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new G(new ke(e.slice()))}}function E2(t,e){const n=t.toTimestamp().seconds,s=t.toTimestamp().nanoseconds+1,r=ne.fromTimestamp(s===1e9?new Ye(n+1,0):new Ye(n,s));return new Ds(r,G.empty(),e)}function T2(t){return new Ds(t.readTime,t.key,-1)}class Ds{constructor(e,n,s){this.readTime=e,this.documentKey=n,this.largestBatchId=s}static min(){return new Ds(ne.min(),G.empty(),-1)}static max(){return new Ds(ne.max(),G.empty(),-1)}}function _2(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=G.comparator(t.documentKey,e.documentKey),n!==0?n:ge(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I2="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class S2{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function xo(t){if(t.code!==N.FAILED_PRECONDITION||t.message!==I2)throw t;Y("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class V{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&Z(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new V((s,r)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(s,r)},this.catchCallback=i=>{this.wrapFailure(n,i).next(s,r)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof V?n:V.resolve(n)}catch(n){return V.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):V.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):V.reject(n)}static resolve(e){return new V((n,s)=>{n(e)})}static reject(e){return new V((n,s)=>{s(e)})}static waitFor(e){return new V((n,s)=>{let r=0,i=0,o=!1;e.forEach(a=>{++r,a.next(()=>{++i,o&&i===r&&n()},c=>s(c))}),o=!0,i===r&&n()})}static or(e){let n=V.resolve(!1);for(const s of e)n=n.next(r=>r?V.resolve(r):s());return n}static forEach(e,n){const s=[];return e.forEach((r,i)=>{s.push(n.call(this,r,i))}),this.waitFor(s)}static mapArray(e,n){return new V((s,r)=>{const i=e.length,o=new Array(i);let a=0;for(let c=0;c<i;c++){const d=c;n(e[d]).next(u=>{o[d]=u,++a,a===i&&s(o)},u=>r(u))}})}static doWhile(e,n){return new V((s,r)=>{const i=()=>{e()===!0?n().next(()=>{i()},r):s()};i()})}}function x2(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Ao(t){return t.name==="IndexedDbTransactionError"}/**
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
 */class Cd{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=s=>this.ie(s),this.se=s=>n.writeSequenceNumber(s))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Cd.oe=-1;function tl(t){return t==null}function Na(t){return t===0&&1/t==-1/0}function A2(t){return typeof t=="number"&&Number.isInteger(t)&&!Na(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
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
 */function yf(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Er(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function Bm(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
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
 */class Me{constructor(e,n){this.comparator=e,this.root=n||st.EMPTY}insert(e,n){return new Me(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,st.BLACK,null,null))}remove(e){return new Me(this.comparator,this.root.remove(e,this.comparator).copy(null,null,st.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return n.value;s<0?n=n.left:s>0&&(n=n.right)}return null}indexOf(e){let n=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return n+s.left.size;r<0?s=s.left:(n+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,s)=>(e(n,s),!1))}toString(){const e=[];return this.inorderTraversal((n,s)=>(e.push(`${n}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ra(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ra(this.root,e,this.comparator,!1)}getReverseIterator(){return new ra(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ra(this.root,e,this.comparator,!0)}}class ra{constructor(e,n,s,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?s(e.key,n):1,n&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class st{constructor(e,n,s,r,i){this.key=e,this.value=n,this.color=s??st.RED,this.left=r??st.EMPTY,this.right=i??st.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,s,r,i){return new st(e??this.key,n??this.value,s??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,s){let r=this;const i=s(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,n,s),null):i===0?r.copy(null,n,null,null,null):r.copy(null,null,null,null,r.right.insert(e,n,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return st.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let s,r=this;if(n(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),n(e,r.key)===0){if(r.right.isEmpty())return st.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,st.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,st.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Z();const e=this.left.check();if(e!==this.right.check())throw Z();return e+(this.isRed()?0:1)}}st.EMPTY=null,st.RED=!0,st.BLACK=!1;st.EMPTY=new class{constructor(){this.size=0}get key(){throw Z()}get value(){throw Z()}get color(){throw Z()}get left(){throw Z()}get right(){throw Z()}copy(e,n,s,r,i){return this}insert(e,n,s){return new st(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class ot{constructor(e){this.comparator=e,this.data=new Me(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,s)=>(e(n),!1))}forEachInRange(e,n){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;n(r.key)}}forEachWhile(e,n){let s;for(s=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new vf(this.data.getIterator())}getIteratorFrom(e){return new vf(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(s=>{n=n.add(s)}),n}isEqual(e){if(!(e instanceof ot)||this.size!==e.size)return!1;const n=this.data.getIterator(),s=e.data.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new ot(this.comparator);return n.data=e,n}}class vf{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(e){this.fields=e,e.sort(rt.comparator)}static empty(){return new Ht([])}unionWith(e){let n=new ot(rt.comparator);for(const s of this.fields)n=n.add(s);for(const s of e)n=n.add(s);return new Ht(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Xr(this.fields,e.fields,(n,s)=>n.isEqual(s))}}/**
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
 */class Dm extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(r){try{return atob(r)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Dm("Invalid base64 string: "+i):i}}(e);return new lt(n)}static fromUint8Array(e){const n=function(r){let i="";for(let o=0;o<r.length;++o)i+=String.fromCharCode(r[o]);return i}(e);return new lt(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ge(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}lt.EMPTY_BYTE_STRING=new lt("");const k2=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ls(t){if(Te(!!t),typeof t=="string"){let e=0;const n=k2.exec(t);if(Te(!!n),n[1]){let r=n[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(t);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:Oe(t.seconds),nanos:Oe(t.nanos)}}function Oe(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function hr(t){return typeof t=="string"?lt.fromBase64String(t):lt.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pd(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function Rd(t){const e=t.mapValue.fields.__previous_value__;return Pd(e)?Rd(e):e}function to(t){const e=Ls(t.mapValue.fields.__local_write_time__.timestampValue);return new Ye(e.seconds,e.nanos)}/**
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
 */class C2{constructor(e,n,s,r,i,o,a,c,d){this.databaseId=e,this.appId=n,this.persistenceKey=s,this.host=r,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=c,this.useFetchStreams=d}}class no{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new no("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof no&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ia={mapValue:{}};function fr(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?Pd(t)?4:R2(t)?9007199254740991:P2(t)?10:11:Z()}function In(t,e){if(t===e)return!0;const n=fr(t);if(n!==fr(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return to(t).isEqual(to(e));case 3:return function(r,i){if(typeof r.timestampValue=="string"&&typeof i.timestampValue=="string"&&r.timestampValue.length===i.timestampValue.length)return r.timestampValue===i.timestampValue;const o=Ls(r.timestampValue),a=Ls(i.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(r,i){return hr(r.bytesValue).isEqual(hr(i.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(r,i){return Oe(r.geoPointValue.latitude)===Oe(i.geoPointValue.latitude)&&Oe(r.geoPointValue.longitude)===Oe(i.geoPointValue.longitude)}(t,e);case 2:return function(r,i){if("integerValue"in r&&"integerValue"in i)return Oe(r.integerValue)===Oe(i.integerValue);if("doubleValue"in r&&"doubleValue"in i){const o=Oe(r.doubleValue),a=Oe(i.doubleValue);return o===a?Na(o)===Na(a):isNaN(o)&&isNaN(a)}return!1}(t,e);case 9:return Xr(t.arrayValue.values||[],e.arrayValue.values||[],In);case 10:case 11:return function(r,i){const o=r.mapValue.fields||{},a=i.mapValue.fields||{};if(yf(o)!==yf(a))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(a[c]===void 0||!In(o[c],a[c])))return!1;return!0}(t,e);default:return Z()}}function so(t,e){return(t.values||[]).find(n=>In(n,e))!==void 0}function Zr(t,e){if(t===e)return 0;const n=fr(t),s=fr(e);if(n!==s)return ge(n,s);switch(n){case 0:case 9007199254740991:return 0;case 1:return ge(t.booleanValue,e.booleanValue);case 2:return function(i,o){const a=Oe(i.integerValue||i.doubleValue),c=Oe(o.integerValue||o.doubleValue);return a<c?-1:a>c?1:a===c?0:isNaN(a)?isNaN(c)?0:-1:1}(t,e);case 3:return bf(t.timestampValue,e.timestampValue);case 4:return bf(to(t),to(e));case 5:return ge(t.stringValue,e.stringValue);case 6:return function(i,o){const a=hr(i),c=hr(o);return a.compareTo(c)}(t.bytesValue,e.bytesValue);case 7:return function(i,o){const a=i.split("/"),c=o.split("/");for(let d=0;d<a.length&&d<c.length;d++){const u=ge(a[d],c[d]);if(u!==0)return u}return ge(a.length,c.length)}(t.referenceValue,e.referenceValue);case 8:return function(i,o){const a=ge(Oe(i.latitude),Oe(o.latitude));return a!==0?a:ge(Oe(i.longitude),Oe(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return wf(t.arrayValue,e.arrayValue);case 10:return function(i,o){var a,c,d,u;const p=i.fields||{},f=o.fields||{},g=(a=p.value)===null||a===void 0?void 0:a.arrayValue,v=(c=f.value)===null||c===void 0?void 0:c.arrayValue,y=ge(((d=g==null?void 0:g.values)===null||d===void 0?void 0:d.length)||0,((u=v==null?void 0:v.values)===null||u===void 0?void 0:u.length)||0);return y!==0?y:wf(g,v)}(t.mapValue,e.mapValue);case 11:return function(i,o){if(i===ia.mapValue&&o===ia.mapValue)return 0;if(i===ia.mapValue)return 1;if(o===ia.mapValue)return-1;const a=i.fields||{},c=Object.keys(a),d=o.fields||{},u=Object.keys(d);c.sort(),u.sort();for(let p=0;p<c.length&&p<u.length;++p){const f=ge(c[p],u[p]);if(f!==0)return f;const g=Zr(a[c[p]],d[u[p]]);if(g!==0)return g}return ge(c.length,u.length)}(t.mapValue,e.mapValue);default:throw Z()}}function bf(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return ge(t,e);const n=Ls(t),s=Ls(e),r=ge(n.seconds,s.seconds);return r!==0?r:ge(n.nanos,s.nanos)}function wf(t,e){const n=t.values||[],s=e.values||[];for(let r=0;r<n.length&&r<s.length;++r){const i=Zr(n[r],s[r]);if(i)return i}return ge(n.length,s.length)}function ei(t){return kc(t)}function kc(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const s=Ls(n);return`time(${s.seconds},${s.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return hr(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return G.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let s="[",r=!0;for(const i of n.values||[])r?r=!1:s+=",",s+=kc(i);return s+"]"}(t.arrayValue):"mapValue"in t?function(n){const s=Object.keys(n.fields||{}).sort();let r="{",i=!0;for(const o of s)i?i=!1:r+=",",r+=`${o}:${kc(n.fields[o])}`;return r+"}"}(t.mapValue):Z()}function Ef(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function Cc(t){return!!t&&"integerValue"in t}function Md(t){return!!t&&"arrayValue"in t}function Tf(t){return!!t&&"nullValue"in t}function _f(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function ma(t){return!!t&&"mapValue"in t}function P2(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function qi(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return Er(t.mapValue.fields,(n,s)=>e.mapValue.fields[n]=qi(s)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=qi(t.arrayValue.values[n]);return e}return Object.assign({},t)}function R2(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class Ft{constructor(e){this.value=e}static empty(){return new Ft({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let s=0;s<e.length-1;++s)if(n=(n.mapValue.fields||{})[e.get(s)],!ma(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=qi(n)}setAll(e){let n=rt.emptyPath(),s={},r=[];e.forEach((o,a)=>{if(!n.isImmediateParentOf(a)){const c=this.getFieldsMap(n);this.applyChanges(c,s,r),s={},r=[],n=a.popLast()}o?s[a.lastSegment()]=qi(o):r.push(a.lastSegment())});const i=this.getFieldsMap(n);this.applyChanges(i,s,r)}delete(e){const n=this.field(e.popLast());ma(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return In(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=n.mapValue.fields[e.get(s)];ma(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},n.mapValue.fields[e.get(s)]=r),n=r}return n.mapValue.fields}applyChanges(e,n,s){Er(n,(r,i)=>e[r]=i);for(const r of s)delete e[r]}clone(){return new Ft(qi(this.value))}}function Lm(t){const e=[];return Er(t.fields,(n,s)=>{const r=new rt([n]);if(ma(s)){const i=Lm(s.mapValue).fields;if(i.length===0)e.push(r);else for(const o of i)e.push(r.child(o))}else e.push(r)}),new Ht(e)}/**
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
 */class Et{constructor(e,n,s,r,i,o,a){this.key=e,this.documentType=n,this.version=s,this.readTime=r,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(e){return new Et(e,0,ne.min(),ne.min(),ne.min(),Ft.empty(),0)}static newFoundDocument(e,n,s,r){return new Et(e,1,n,ne.min(),s,r,0)}static newNoDocument(e,n){return new Et(e,2,n,ne.min(),ne.min(),Ft.empty(),0)}static newUnknownDocument(e,n){return new Et(e,3,n,ne.min(),ne.min(),Ft.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(ne.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ft.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ft.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ne.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Et&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Et(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Oa{constructor(e,n){this.position=e,this.inclusive=n}}function If(t,e,n){let s=0;for(let r=0;r<t.position.length;r++){const i=e[r],o=t.position[r];if(i.field.isKeyField()?s=G.comparator(G.fromName(o.referenceValue),n.key):s=Zr(o,n.data.field(i.field)),i.dir==="desc"&&(s*=-1),s!==0)break}return s}function Sf(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!In(t.position[n],e.position[n]))return!1;return!0}/**
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
 */class ro{constructor(e,n="asc"){this.field=e,this.dir=n}}function M2(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
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
 */class Nm{}class qe extends Nm{constructor(e,n,s){super(),this.field=e,this.op=n,this.value=s}static create(e,n,s){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,s):new D2(e,n,s):n==="array-contains"?new O2(e,s):n==="in"?new F2(e,s):n==="not-in"?new V2(e,s):n==="array-contains-any"?new z2(e,s):new qe(e,n,s)}static createKeyFieldInFilter(e,n,s){return n==="in"?new L2(e,s):new N2(e,s)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Zr(n,this.value)):n!==null&&fr(this.value)===fr(n)&&this.matchesComparison(Zr(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Z()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class mn extends Nm{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new mn(e,n)}matches(e){return Om(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Om(t){return t.op==="and"}function Fm(t){return B2(t)&&Om(t)}function B2(t){for(const e of t.filters)if(e instanceof mn)return!1;return!0}function Pc(t){if(t instanceof qe)return t.field.canonicalString()+t.op.toString()+ei(t.value);if(Fm(t))return t.filters.map(e=>Pc(e)).join(",");{const e=t.filters.map(n=>Pc(n)).join(",");return`${t.op}(${e})`}}function Vm(t,e){return t instanceof qe?function(s,r){return r instanceof qe&&s.op===r.op&&s.field.isEqual(r.field)&&In(s.value,r.value)}(t,e):t instanceof mn?function(s,r){return r instanceof mn&&s.op===r.op&&s.filters.length===r.filters.length?s.filters.reduce((i,o,a)=>i&&Vm(o,r.filters[a]),!0):!1}(t,e):void Z()}function zm(t){return t instanceof qe?function(n){return`${n.field.canonicalString()} ${n.op} ${ei(n.value)}`}(t):t instanceof mn?function(n){return n.op.toString()+" {"+n.getFilters().map(zm).join(" ,")+"}"}(t):"Filter"}class D2 extends qe{constructor(e,n,s){super(e,n,s),this.key=G.fromName(s.referenceValue)}matches(e){const n=G.comparator(e.key,this.key);return this.matchesComparison(n)}}class L2 extends qe{constructor(e,n){super(e,"in",n),this.keys=Um("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class N2 extends qe{constructor(e,n){super(e,"not-in",n),this.keys=Um("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function Um(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(s=>G.fromName(s.referenceValue))}class O2 extends qe{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Md(n)&&so(n.arrayValue,this.value)}}class F2 extends qe{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&so(this.value.arrayValue,n)}}class V2 extends qe{constructor(e,n){super(e,"not-in",n)}matches(e){if(so(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!so(this.value.arrayValue,n)}}class z2 extends qe{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Md(n)||!n.arrayValue.values)&&n.arrayValue.values.some(s=>so(this.value.arrayValue,s))}}/**
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
 */class U2{constructor(e,n=null,s=[],r=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=n,this.orderBy=s,this.filters=r,this.limit=i,this.startAt=o,this.endAt=a,this.ue=null}}function xf(t,e=null,n=[],s=[],r=null,i=null,o=null){return new U2(t,e,n,s,r,i,o)}function Bd(t){const e=se(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(s=>Pc(s)).join(","),n+="|ob:",n+=e.orderBy.map(s=>function(i){return i.field.canonicalString()+i.dir}(s)).join(","),tl(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(s=>ei(s)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(s=>ei(s)).join(",")),e.ue=n}return e.ue}function Dd(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!M2(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!Vm(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!Sf(t.startAt,e.startAt)&&Sf(t.endAt,e.endAt)}function Rc(t){return G.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
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
 */class ui{constructor(e,n=null,s=[],r=[],i=null,o="F",a=null,c=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=s,this.filters=r,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function $2(t,e,n,s,r,i,o,a){return new ui(t,e,n,s,r,i,o,a)}function Ld(t){return new ui(t)}function Af(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function $m(t){return t.collectionGroup!==null}function Hi(t){const e=se(t);if(e.ce===null){e.ce=[];const n=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),n.add(i.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new ot(rt.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(a=a.add(d.field))})}),a})(e).forEach(i=>{n.has(i.canonicalString())||i.isKeyField()||e.ce.push(new ro(i,s))}),n.has(rt.keyField().canonicalString())||e.ce.push(new ro(rt.keyField(),s))}return e.ce}function En(t){const e=se(t);return e.le||(e.le=q2(e,Hi(t))),e.le}function q2(t,e){if(t.limitType==="F")return xf(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(r=>{const i=r.dir==="desc"?"asc":"desc";return new ro(r.field,i)});const n=t.endAt?new Oa(t.endAt.position,t.endAt.inclusive):null,s=t.startAt?new Oa(t.startAt.position,t.startAt.inclusive):null;return xf(t.path,t.collectionGroup,e,t.filters,t.limit,n,s)}}function Mc(t,e){const n=t.filters.concat([e]);return new ui(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function Fa(t,e,n){return new ui(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function nl(t,e){return Dd(En(t),En(e))&&t.limitType===e.limitType}function qm(t){return`${Bd(En(t))}|lt:${t.limitType}`}function Lr(t){return`Query(target=${function(n){let s=n.path.canonicalString();return n.collectionGroup!==null&&(s+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(s+=`, filters: [${n.filters.map(r=>zm(r)).join(", ")}]`),tl(n.limit)||(s+=", limit: "+n.limit),n.orderBy.length>0&&(s+=`, orderBy: [${n.orderBy.map(r=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(r)).join(", ")}]`),n.startAt&&(s+=", startAt: ",s+=n.startAt.inclusive?"b:":"a:",s+=n.startAt.position.map(r=>ei(r)).join(",")),n.endAt&&(s+=", endAt: ",s+=n.endAt.inclusive?"a:":"b:",s+=n.endAt.position.map(r=>ei(r)).join(",")),`Target(${s})`}(En(t))}; limitType=${t.limitType})`}function sl(t,e){return e.isFoundDocument()&&function(s,r){const i=r.key.path;return s.collectionGroup!==null?r.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(i):G.isDocumentKey(s.path)?s.path.isEqual(i):s.path.isImmediateParentOf(i)}(t,e)&&function(s,r){for(const i of Hi(s))if(!i.field.isKeyField()&&r.data.field(i.field)===null)return!1;return!0}(t,e)&&function(s,r){for(const i of s.filters)if(!i.matches(r))return!1;return!0}(t,e)&&function(s,r){return!(s.startAt&&!function(o,a,c){const d=If(o,a,c);return o.inclusive?d<=0:d<0}(s.startAt,Hi(s),r)||s.endAt&&!function(o,a,c){const d=If(o,a,c);return o.inclusive?d>=0:d>0}(s.endAt,Hi(s),r))}(t,e)}function H2(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function Hm(t){return(e,n)=>{let s=!1;for(const r of Hi(t)){const i=Y2(r,e,n);if(i!==0)return i;s=s||r.field.isKeyField()}return 0}}function Y2(t,e,n){const s=t.field.isKeyField()?G.comparator(e.key,n.key):function(i,o,a){const c=o.data.field(i),d=a.data.field(i);return c!==null&&d!==null?Zr(c,d):Z()}(t.field,e,n);switch(t.dir){case"asc":return s;case"desc":return-1*s;default:return Z()}}/**
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
 */class hi{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s!==void 0){for(const[r,i]of s)if(this.equalsFn(r,e))return i}}has(e){return this.get(e)!==void 0}set(e,n){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,n]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,n]);r.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[n]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Er(this.inner,(n,s)=>{for(const[r,i]of s)e(r,i)})}isEmpty(){return Bm(this.inner)}size(){return this.innerSize}}/**
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
 */const W2=new Me(G.comparator);function Zn(){return W2}const Ym=new Me(G.comparator);function Oi(...t){let e=Ym;for(const n of t)e=e.insert(n.key,n);return e}function Wm(t){let e=Ym;return t.forEach((n,s)=>e=e.insert(n,s.overlayedDocument)),e}function nr(){return Yi()}function Gm(){return Yi()}function Yi(){return new hi(t=>t.toString(),(t,e)=>t.isEqual(e))}const G2=new Me(G.comparator),j2=new ot(G.comparator);function ce(...t){let e=j2;for(const n of t)e=e.add(n);return e}const K2=new ot(ge);function Q2(){return K2}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nd(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Na(e)?"-0":e}}function jm(t){return{integerValue:""+t}}function J2(t,e){return A2(e)?jm(e):Nd(t,e)}/**
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
 */class rl{constructor(){this._=void 0}}function X2(t,e,n){return t instanceof io?function(r,i){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return i&&Pd(i)&&(i=Rd(i)),i&&(o.fields.__previous_value__=i),{mapValue:o}}(n,e):t instanceof oo?Qm(t,e):t instanceof ao?Jm(t,e):function(r,i){const o=Km(r,i),a=kf(o)+kf(r.Pe);return Cc(o)&&Cc(r.Pe)?jm(a):Nd(r.serializer,a)}(t,e)}function Z2(t,e,n){return t instanceof oo?Qm(t,e):t instanceof ao?Jm(t,e):n}function Km(t,e){return t instanceof Va?function(s){return Cc(s)||function(i){return!!i&&"doubleValue"in i}(s)}(e)?e:{integerValue:0}:null}class io extends rl{}class oo extends rl{constructor(e){super(),this.elements=e}}function Qm(t,e){const n=Xm(e);for(const s of t.elements)n.some(r=>In(r,s))||n.push(s);return{arrayValue:{values:n}}}class ao extends rl{constructor(e){super(),this.elements=e}}function Jm(t,e){let n=Xm(e);for(const s of t.elements)n=n.filter(r=>!In(r,s));return{arrayValue:{values:n}}}class Va extends rl{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function kf(t){return Oe(t.integerValue||t.doubleValue)}function Xm(t){return Md(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
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
 */class e3{constructor(e,n){this.field=e,this.transform=n}}function t3(t,e){return t.field.isEqual(e.field)&&function(s,r){return s instanceof oo&&r instanceof oo||s instanceof ao&&r instanceof ao?Xr(s.elements,r.elements,In):s instanceof Va&&r instanceof Va?In(s.Pe,r.Pe):s instanceof io&&r instanceof io}(t.transform,e.transform)}class n3{constructor(e,n){this.version=e,this.transformResults=n}}class Bt{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new Bt}static exists(e){return new Bt(void 0,e)}static updateTime(e){return new Bt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ga(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class il{}function Zm(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new ol(t.key,Bt.none()):new ko(t.key,t.data,Bt.none());{const n=t.data,s=Ft.empty();let r=new ot(rt.comparator);for(let i of e.fields)if(!r.has(i)){let o=n.field(i);o===null&&i.length>1&&(i=i.popLast(),o=n.field(i)),o===null?s.delete(i):s.set(i,o),r=r.add(i)}return new Fs(t.key,s,new Ht(r.toArray()),Bt.none())}}function s3(t,e,n){t instanceof ko?function(r,i,o){const a=r.value.clone(),c=Pf(r.fieldTransforms,i,o.transformResults);a.setAll(c),i.convertToFoundDocument(o.version,a).setHasCommittedMutations()}(t,e,n):t instanceof Fs?function(r,i,o){if(!ga(r.precondition,i))return void i.convertToUnknownDocument(o.version);const a=Pf(r.fieldTransforms,i,o.transformResults),c=i.data;c.setAll(eg(r)),c.setAll(a),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(t,e,n):function(r,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function Wi(t,e,n,s){return t instanceof ko?function(i,o,a,c){if(!ga(i.precondition,o))return a;const d=i.value.clone(),u=Rf(i.fieldTransforms,c,o);return d.setAll(u),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),null}(t,e,n,s):t instanceof Fs?function(i,o,a,c){if(!ga(i.precondition,o))return a;const d=Rf(i.fieldTransforms,c,o),u=o.data;return u.setAll(eg(i)),u.setAll(d),o.convertToFoundDocument(o.version,u).setHasLocalMutations(),a===null?null:a.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(p=>p.field))}(t,e,n,s):function(i,o,a){return ga(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a}(t,e,n)}function r3(t,e){let n=null;for(const s of t.fieldTransforms){const r=e.data.field(s.field),i=Km(s.transform,r||null);i!=null&&(n===null&&(n=Ft.empty()),n.set(s.field,i))}return n||null}function Cf(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(s,r){return s===void 0&&r===void 0||!(!s||!r)&&Xr(s,r,(i,o)=>t3(i,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class ko extends il{constructor(e,n,s,r=[]){super(),this.key=e,this.value=n,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class Fs extends il{constructor(e,n,s,r,i=[]){super(),this.key=e,this.data=n,this.fieldMask=s,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function eg(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const s=t.data.field(n);e.set(n,s)}}),e}function Pf(t,e,n){const s=new Map;Te(t.length===n.length);for(let r=0;r<n.length;r++){const i=t[r],o=i.transform,a=e.data.field(i.field);s.set(i.field,Z2(o,a,n[r]))}return s}function Rf(t,e,n){const s=new Map;for(const r of t){const i=r.transform,o=n.data.field(r.field);s.set(r.field,X2(i,o,e))}return s}class ol extends il{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class i3 extends il{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class o3{constructor(e,n,s,r){this.batchId=e,this.localWriteTime=n,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,n){const s=n.mutationResults;for(let r=0;r<this.mutations.length;r++){const i=this.mutations[r];i.key.isEqual(e.key)&&s3(i,e,s[r])}}applyToLocalView(e,n){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(n=Wi(s,e,n,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(n=Wi(s,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const s=Gm();return this.mutations.forEach(r=>{const i=e.get(r.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=n.has(r.key)?null:a;const c=Zm(o,a);c!==null&&s.set(r.key,c),o.isValidDocument()||o.convertToNoDocument(ne.min())}),s}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),ce())}isEqual(e){return this.batchId===e.batchId&&Xr(this.mutations,e.mutations,(n,s)=>Cf(n,s))&&Xr(this.baseMutations,e.baseMutations,(n,s)=>Cf(n,s))}}class Od{constructor(e,n,s,r){this.batch=e,this.commitVersion=n,this.mutationResults=s,this.docVersions=r}static from(e,n,s){Te(e.mutations.length===s.length);let r=function(){return G2}();const i=e.mutations;for(let o=0;o<i.length;o++)r=r.insert(i[o].key,s[o].version);return new Od(e,n,s,r)}}/**
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
 */class a3{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class l3{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
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
 */var $e,ue;function c3(t){switch(t){default:return Z();case N.CANCELLED:case N.UNKNOWN:case N.DEADLINE_EXCEEDED:case N.RESOURCE_EXHAUSTED:case N.INTERNAL:case N.UNAVAILABLE:case N.UNAUTHENTICATED:return!1;case N.INVALID_ARGUMENT:case N.NOT_FOUND:case N.ALREADY_EXISTS:case N.PERMISSION_DENIED:case N.FAILED_PRECONDITION:case N.ABORTED:case N.OUT_OF_RANGE:case N.UNIMPLEMENTED:case N.DATA_LOSS:return!0}}function tg(t){if(t===void 0)return Xn("GRPC error has no .code"),N.UNKNOWN;switch(t){case $e.OK:return N.OK;case $e.CANCELLED:return N.CANCELLED;case $e.UNKNOWN:return N.UNKNOWN;case $e.DEADLINE_EXCEEDED:return N.DEADLINE_EXCEEDED;case $e.RESOURCE_EXHAUSTED:return N.RESOURCE_EXHAUSTED;case $e.INTERNAL:return N.INTERNAL;case $e.UNAVAILABLE:return N.UNAVAILABLE;case $e.UNAUTHENTICATED:return N.UNAUTHENTICATED;case $e.INVALID_ARGUMENT:return N.INVALID_ARGUMENT;case $e.NOT_FOUND:return N.NOT_FOUND;case $e.ALREADY_EXISTS:return N.ALREADY_EXISTS;case $e.PERMISSION_DENIED:return N.PERMISSION_DENIED;case $e.FAILED_PRECONDITION:return N.FAILED_PRECONDITION;case $e.ABORTED:return N.ABORTED;case $e.OUT_OF_RANGE:return N.OUT_OF_RANGE;case $e.UNIMPLEMENTED:return N.UNIMPLEMENTED;case $e.DATA_LOSS:return N.DATA_LOSS;default:return Z()}}(ue=$e||($e={}))[ue.OK=0]="OK",ue[ue.CANCELLED=1]="CANCELLED",ue[ue.UNKNOWN=2]="UNKNOWN",ue[ue.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ue[ue.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ue[ue.NOT_FOUND=5]="NOT_FOUND",ue[ue.ALREADY_EXISTS=6]="ALREADY_EXISTS",ue[ue.PERMISSION_DENIED=7]="PERMISSION_DENIED",ue[ue.UNAUTHENTICATED=16]="UNAUTHENTICATED",ue[ue.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ue[ue.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ue[ue.ABORTED=10]="ABORTED",ue[ue.OUT_OF_RANGE=11]="OUT_OF_RANGE",ue[ue.UNIMPLEMENTED=12]="UNIMPLEMENTED",ue[ue.INTERNAL=13]="INTERNAL",ue[ue.UNAVAILABLE=14]="UNAVAILABLE",ue[ue.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function d3(){return new TextEncoder}/**
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
 */const u3=new ir([4294967295,4294967295],0);function Mf(t){const e=d3().encode(t),n=new Sm;return n.update(e),new Uint8Array(n.digest())}function Bf(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),s=e.getUint32(4,!0),r=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new ir([n,s],0),new ir([r,i],0)]}class Fd{constructor(e,n,s){if(this.bitmap=e,this.padding=n,this.hashCount=s,n<0||n>=8)throw new Fi(`Invalid padding: ${n}`);if(s<0)throw new Fi(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Fi(`Invalid hash count: ${s}`);if(e.length===0&&n!==0)throw new Fi(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=ir.fromNumber(this.Ie)}Ee(e,n,s){let r=e.add(n.multiply(ir.fromNumber(s)));return r.compare(u3)===1&&(r=new ir([r.getBits(0),r.getBits(1)],0)),r.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=Mf(e),[s,r]=Bf(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(s,r,i);if(!this.de(o))return!1}return!0}static create(e,n,s){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Fd(i,r,n);return s.forEach(a=>o.insert(a)),o}insert(e){if(this.Ie===0)return;const n=Mf(e),[s,r]=Bf(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(s,r,i);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),s=e%8;this.bitmap[n]|=1<<s}}class Fi extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class al{constructor(e,n,s,r,i){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,n,s){const r=new Map;return r.set(e,Co.createSynthesizedTargetChangeForCurrentChange(e,n,s)),new al(ne.min(),r,new Me(ge),Zn(),ce())}}class Co{constructor(e,n,s,r,i){this.resumeToken=e,this.current=n,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,n,s){return new Co(s,n,ce(),ce(),ce())}}/**
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
 */class ya{constructor(e,n,s,r){this.Re=e,this.removedTargetIds=n,this.key=s,this.Ve=r}}class ng{constructor(e,n){this.targetId=e,this.me=n}}class sg{constructor(e,n,s=lt.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=n,this.resumeToken=s,this.cause=r}}class Df{constructor(){this.fe=0,this.ge=Nf(),this.pe=lt.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ce(),n=ce(),s=ce();return this.ge.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:n=n.add(r);break;case 1:s=s.add(r);break;default:Z()}}),new Co(this.pe,this.ye,e,n,s)}Ce(){this.we=!1,this.ge=Nf()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,Te(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class h3{constructor(e){this.Le=e,this.Be=new Map,this.ke=Zn(),this.qe=Lf(),this.Qe=new Me(ge)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const s=this.Ge(n);switch(e.state){case 0:this.ze(n)&&s.De(e.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(e.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(s.Ne(),s.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),s.De(e.resumeToken));break;default:Z()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((s,r)=>{this.ze(r)&&n(r)})}He(e){const n=e.targetId,s=e.me.count,r=this.Je(n);if(r){const i=r.target;if(Rc(i))if(s===0){const o=new G(i.path);this.Ue(n,o,Et.newNoDocument(o,ne.min()))}else Te(s===1);else{const o=this.Ye(n);if(o!==s){const a=this.Ze(e),c=a?this.Xe(a,e,o):1;if(c!==0){this.je(n);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,d)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:s="",padding:r=0},hashCount:i=0}=n;let o,a;try{o=hr(s).toUint8Array()}catch(c){if(c instanceof Dm)return Jr("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{a=new Fd(o,r,i)}catch(c){return Jr(c instanceof Fi?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return a.Ie===0?null:a}Xe(e,n,s){return n.me.count===s-this.nt(e,n.targetId)?0:2}nt(e,n){const s=this.Le.getRemoteKeysForTarget(n);let r=0;return s.forEach(i=>{const o=this.Le.tt(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(a)||(this.Ue(n,i,null),r++)}),r}rt(e){const n=new Map;this.Be.forEach((i,o)=>{const a=this.Je(o);if(a){if(i.current&&Rc(a.target)){const c=new G(a.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,Et.newNoDocument(c,e))}i.be&&(n.set(o,i.ve()),i.Ce())}});let s=ce();this.qe.forEach((i,o)=>{let a=!0;o.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)}),a&&(s=s.add(i))}),this.ke.forEach((i,o)=>o.setReadTime(e));const r=new al(e,n,this.Qe,this.ke,s);return this.ke=Zn(),this.qe=Lf(),this.Qe=new Me(ge),r}$e(e,n){if(!this.ze(e))return;const s=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,s),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,s){if(!this.ze(e))return;const r=this.Ge(e);this.it(e,n)?r.Fe(n,1):r.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),s&&(this.ke=this.ke.insert(n,s))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new Df,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new ot(ge),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||Y("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Df),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function Lf(){return new Me(G.comparator)}function Nf(){return new Me(G.comparator)}const f3={asc:"ASCENDING",desc:"DESCENDING"},p3={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},m3={and:"AND",or:"OR"};class g3{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Bc(t,e){return t.useProto3Json||tl(e)?e:{value:e}}function za(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function rg(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function y3(t,e){return za(t,e.toTimestamp())}function Tn(t){return Te(!!t),ne.fromTimestamp(function(n){const s=Ls(n);return new Ye(s.seconds,s.nanos)}(t))}function Vd(t,e){return Dc(t,e).canonicalString()}function Dc(t,e){const n=function(r){return new ke(["projects",r.projectId,"databases",r.database])}(t).child("documents");return e===void 0?n:n.child(e)}function ig(t){const e=ke.fromString(t);return Te(dg(e)),e}function Lc(t,e){return Vd(t.databaseId,e.path)}function ac(t,e){const n=ig(e);if(n.get(1)!==t.databaseId.projectId)throw new q(N.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new q(N.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new G(ag(n))}function og(t,e){return Vd(t.databaseId,e)}function v3(t){const e=ig(t);return e.length===4?ke.emptyPath():ag(e)}function Nc(t){return new ke(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function ag(t){return Te(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function Of(t,e,n){return{name:Lc(t,e),fields:n.value.mapValue.fields}}function b3(t,e){let n;if("targetChange"in e){e.targetChange;const s=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:Z()}(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],i=function(d,u){return d.useProto3Json?(Te(u===void 0||typeof u=="string"),lt.fromBase64String(u||"")):(Te(u===void 0||u instanceof Buffer||u instanceof Uint8Array),lt.fromUint8Array(u||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(d){const u=d.code===void 0?N.UNKNOWN:tg(d.code);return new q(u,d.message||"")}(o);n=new sg(s,r,i,a||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=ac(t,s.document.name),i=Tn(s.document.updateTime),o=s.document.createTime?Tn(s.document.createTime):ne.min(),a=new Ft({mapValue:{fields:s.document.fields}}),c=Et.newFoundDocument(r,i,o,a),d=s.targetIds||[],u=s.removedTargetIds||[];n=new ya(d,u,c.key,c)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=ac(t,s.document),i=s.readTime?Tn(s.readTime):ne.min(),o=Et.newNoDocument(r,i),a=s.removedTargetIds||[];n=new ya([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=ac(t,s.document),i=s.removedTargetIds||[];n=new ya([],i,r,null)}else{if(!("filter"in e))return Z();{e.filter;const s=e.filter;s.targetId;const{count:r=0,unchangedNames:i}=s,o=new l3(r,i),a=s.targetId;n=new ng(a,o)}}return n}function w3(t,e){let n;if(e instanceof ko)n={update:Of(t,e.key,e.value)};else if(e instanceof ol)n={delete:Lc(t,e.key)};else if(e instanceof Fs)n={update:Of(t,e.key,e.data),updateMask:C3(e.fieldMask)};else{if(!(e instanceof i3))return Z();n={verify:Lc(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(s=>function(i,o){const a=o.transform;if(a instanceof io)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof oo)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof ao)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof Va)return{fieldPath:o.field.canonicalString(),increment:a.Pe};throw Z()}(0,s))),e.precondition.isNone||(n.currentDocument=function(r,i){return i.updateTime!==void 0?{updateTime:y3(r,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Z()}(t,e.precondition)),n}function E3(t,e){return t&&t.length>0?(Te(e!==void 0),t.map(n=>function(r,i){let o=r.updateTime?Tn(r.updateTime):Tn(i);return o.isEqual(ne.min())&&(o=Tn(i)),new n3(o,r.transformResults||[])}(n,e))):[]}function T3(t,e){return{documents:[og(t,e.path)]}}function _3(t,e){const n={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),n.structuredQuery.from=[{collectionId:s.lastSegment()}]),n.parent=og(t,r);const i=function(d){if(d.length!==0)return cg(mn.create(d,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(d){if(d.length!==0)return d.map(u=>function(f){return{field:Nr(f.field),direction:x3(f.dir)}}(u))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const a=Bc(t,e.limit);return a!==null&&(n.structuredQuery.limit=a),e.startAt&&(n.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:n,parent:r}}function I3(t){let e=v3(t.parent);const n=t.structuredQuery,s=n.from?n.from.length:0;let r=null;if(s>0){Te(s===1);const u=n.from[0];u.allDescendants?r=u.collectionId:e=e.child(u.collectionId)}let i=[];n.where&&(i=function(p){const f=lg(p);return f instanceof mn&&Fm(f)?f.getFilters():[f]}(n.where));let o=[];n.orderBy&&(o=function(p){return p.map(f=>function(v){return new ro(Or(v.field),function(E){switch(E){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(v.direction))}(f))}(n.orderBy));let a=null;n.limit&&(a=function(p){let f;return f=typeof p=="object"?p.value:p,tl(f)?null:f}(n.limit));let c=null;n.startAt&&(c=function(p){const f=!!p.before,g=p.values||[];return new Oa(g,f)}(n.startAt));let d=null;return n.endAt&&(d=function(p){const f=!p.before,g=p.values||[];return new Oa(g,f)}(n.endAt)),$2(e,r,o,i,a,"F",c,d)}function S3(t,e){const n=function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Z()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function lg(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const s=Or(n.unaryFilter.field);return qe.create(s,"==",{doubleValue:NaN});case"IS_NULL":const r=Or(n.unaryFilter.field);return qe.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Or(n.unaryFilter.field);return qe.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Or(n.unaryFilter.field);return qe.create(o,"!=",{nullValue:"NULL_VALUE"});default:return Z()}}(t):t.fieldFilter!==void 0?function(n){return qe.create(Or(n.fieldFilter.field),function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Z()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return mn.create(n.compositeFilter.filters.map(s=>lg(s)),function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return Z()}}(n.compositeFilter.op))}(t):Z()}function x3(t){return f3[t]}function A3(t){return p3[t]}function k3(t){return m3[t]}function Nr(t){return{fieldPath:t.canonicalString()}}function Or(t){return rt.fromServerFormat(t.fieldPath)}function cg(t){return t instanceof qe?function(n){if(n.op==="=="){if(_f(n.value))return{unaryFilter:{field:Nr(n.field),op:"IS_NAN"}};if(Tf(n.value))return{unaryFilter:{field:Nr(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(_f(n.value))return{unaryFilter:{field:Nr(n.field),op:"IS_NOT_NAN"}};if(Tf(n.value))return{unaryFilter:{field:Nr(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Nr(n.field),op:A3(n.op),value:n.value}}}(t):t instanceof mn?function(n){const s=n.getFilters().map(r=>cg(r));return s.length===1?s[0]:{compositeFilter:{op:k3(n.op),filters:s}}}(t):Z()}function C3(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function dg(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
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
 */class Ss{constructor(e,n,s,r,i=ne.min(),o=ne.min(),a=lt.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=n,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=c}withSequenceNumber(e){return new Ss(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new Ss(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ss(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ss(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class P3{constructor(e){this.ct=e}}function R3(t){const e=I3({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?Fa(e,e.limit,"L"):e}/**
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
 */class M3{constructor(){this.un=new B3}addToCollectionParentIndex(e,n){return this.un.add(n),V.resolve()}getCollectionParents(e,n){return V.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return V.resolve()}deleteFieldIndex(e,n){return V.resolve()}deleteAllFieldIndexes(e){return V.resolve()}createTargetIndexes(e,n){return V.resolve()}getDocumentsMatchingTarget(e,n){return V.resolve(null)}getIndexType(e,n){return V.resolve(0)}getFieldIndexes(e,n){return V.resolve([])}getNextCollectionGroupToUpdate(e){return V.resolve(null)}getMinOffset(e,n){return V.resolve(Ds.min())}getMinOffsetFromCollectionGroup(e,n){return V.resolve(Ds.min())}updateCollectionGroup(e,n,s){return V.resolve()}updateIndexEntries(e,n){return V.resolve()}}class B3{constructor(){this.index={}}add(e){const n=e.lastSegment(),s=e.popLast(),r=this.index[n]||new ot(ke.comparator),i=!r.has(s);return this.index[n]=r.add(s),i}has(e){const n=e.lastSegment(),s=e.popLast(),r=this.index[n];return r&&r.has(s)}getEntries(e){return(this.index[e]||new ot(ke.comparator)).toArray()}}/**
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
 */class ti{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new ti(0)}static kn(){return new ti(-1)}}/**
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
 */class D3{constructor(){this.changes=new hi(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,Et.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const s=this.changes.get(n);return s!==void 0?V.resolve(s):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class L3{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
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
 */class N3{constructor(e,n,s,r){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=s,this.indexManager=r}getDocument(e,n){let s=null;return this.documentOverlayCache.getOverlay(e,n).next(r=>(s=r,this.remoteDocumentCache.getEntry(e,n))).next(r=>(s!==null&&Wi(s.mutation,r,Ht.empty(),Ye.now()),r))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.getLocalViewOfDocuments(e,s,ce()).next(()=>s))}getLocalViewOfDocuments(e,n,s=ce()){const r=nr();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,s).next(i=>{let o=Oi();return i.forEach((a,c)=>{o=o.insert(a,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const s=nr();return this.populateOverlays(e,s,n).next(()=>this.computeViews(e,n,s,ce()))}populateOverlays(e,n,s){const r=[];return s.forEach(i=>{n.has(i)||r.push(i)}),this.documentOverlayCache.getOverlays(e,r).next(i=>{i.forEach((o,a)=>{n.set(o,a)})})}computeViews(e,n,s,r){let i=Zn();const o=Yi(),a=function(){return Yi()}();return n.forEach((c,d)=>{const u=s.get(d.key);r.has(d.key)&&(u===void 0||u.mutation instanceof Fs)?i=i.insert(d.key,d):u!==void 0?(o.set(d.key,u.mutation.getFieldMask()),Wi(u.mutation,d,u.mutation.getFieldMask(),Ye.now())):o.set(d.key,Ht.empty())}),this.recalculateAndSaveOverlays(e,i).next(c=>(c.forEach((d,u)=>o.set(d,u)),n.forEach((d,u)=>{var p;return a.set(d,new L3(u,(p=o.get(d))!==null&&p!==void 0?p:null))}),a))}recalculateAndSaveOverlays(e,n){const s=Yi();let r=new Me((o,a)=>o-a),i=ce();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const a of o)a.keys().forEach(c=>{const d=n.get(c);if(d===null)return;let u=s.get(c)||Ht.empty();u=a.applyToLocalView(d,u),s.set(c,u);const p=(r.get(a.batchId)||ce()).add(c);r=r.insert(a.batchId,p)})}).next(()=>{const o=[],a=r.getReverseIterator();for(;a.hasNext();){const c=a.getNext(),d=c.key,u=c.value,p=Gm();u.forEach(f=>{if(!i.has(f)){const g=Zm(n.get(f),s.get(f));g!==null&&p.set(f,g),i=i.add(f)}}),o.push(this.documentOverlayCache.saveOverlays(e,d,p))}return V.waitFor(o)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,n,s,r){return function(o){return G.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):$m(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,s,r):this.getDocumentsMatchingCollectionQuery(e,n,s,r)}getNextDocuments(e,n,s,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,s,r).next(i=>{const o=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,s.largestBatchId,r-i.size):V.resolve(nr());let a=-1,c=i;return o.next(d=>V.forEach(d,(u,p)=>(a<p.largestBatchId&&(a=p.largestBatchId),i.get(u)?V.resolve():this.remoteDocumentCache.getEntry(e,u).next(f=>{c=c.insert(u,f)}))).next(()=>this.populateOverlays(e,d,i)).next(()=>this.computeViews(e,c,d,ce())).next(u=>({batchId:a,changes:Wm(u)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new G(n)).next(s=>{let r=Oi();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r})}getDocumentsMatchingCollectionGroupQuery(e,n,s,r){const i=n.collectionGroup;let o=Oi();return this.indexManager.getCollectionParents(e,i).next(a=>V.forEach(a,c=>{const d=function(p,f){return new ui(f,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)}(n,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,s,r).next(u=>{u.forEach((p,f)=>{o=o.insert(p,f)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,s,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,s.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,s,i,r))).next(o=>{i.forEach((c,d)=>{const u=d.getKey();o.get(u)===null&&(o=o.insert(u,Et.newInvalidDocument(u)))});let a=Oi();return o.forEach((c,d)=>{const u=i.get(c);u!==void 0&&Wi(u.mutation,d,Ht.empty(),Ye.now()),sl(n,d)&&(a=a.insert(c,d))}),a})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O3{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return V.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(r){return{id:r.id,version:r.version,createTime:Tn(r.createTime)}}(n)),V.resolve()}getNamedQuery(e,n){return V.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(r){return{name:r.name,query:R3(r.bundledQuery),readTime:Tn(r.readTime)}}(n)),V.resolve()}}/**
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
 */class F3{constructor(){this.overlays=new Me(G.comparator),this.Ir=new Map}getOverlay(e,n){return V.resolve(this.overlays.get(n))}getOverlays(e,n){const s=nr();return V.forEach(n,r=>this.getOverlay(e,r).next(i=>{i!==null&&s.set(r,i)})).next(()=>s)}saveOverlays(e,n,s){return s.forEach((r,i)=>{this.ht(e,n,i)}),V.resolve()}removeOverlaysForBatchId(e,n,s){const r=this.Ir.get(s);return r!==void 0&&(r.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(s)),V.resolve()}getOverlaysForCollection(e,n,s){const r=nr(),i=n.length+1,o=new G(n.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const c=a.getNext().value,d=c.getKey();if(!n.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>s&&r.set(c.getKey(),c)}return V.resolve(r)}getOverlaysForCollectionGroup(e,n,s,r){let i=new Me((d,u)=>d-u);const o=this.overlays.getIterator();for(;o.hasNext();){const d=o.getNext().value;if(d.getKey().getCollectionGroup()===n&&d.largestBatchId>s){let u=i.get(d.largestBatchId);u===null&&(u=nr(),i=i.insert(d.largestBatchId,u)),u.set(d.getKey(),d)}}const a=nr(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,u)=>a.set(d,u)),!(a.size()>=r)););return V.resolve(a)}ht(e,n,s){const r=this.overlays.get(s.key);if(r!==null){const o=this.Ir.get(r.largestBatchId).delete(s.key);this.Ir.set(r.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new a3(n,s));let i=this.Ir.get(n);i===void 0&&(i=ce(),this.Ir.set(n,i)),this.Ir.set(n,i.add(s.key))}}/**
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
 */class V3{constructor(){this.sessionToken=lt.EMPTY_BYTE_STRING}getSessionToken(e){return V.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,V.resolve()}}/**
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
 */class zd{constructor(){this.Tr=new ot(Je.Er),this.dr=new ot(Je.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const s=new Je(e,n);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(e,n){e.forEach(s=>this.addReference(s,n))}removeReference(e,n){this.Vr(new Je(e,n))}mr(e,n){e.forEach(s=>this.removeReference(s,n))}gr(e){const n=new G(new ke([])),s=new Je(n,e),r=new Je(n,e+1),i=[];return this.dr.forEachInRange([s,r],o=>{this.Vr(o),i.push(o.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new G(new ke([])),s=new Je(n,e),r=new Je(n,e+1);let i=ce();return this.dr.forEachInRange([s,r],o=>{i=i.add(o.key)}),i}containsKey(e){const n=new Je(e,0),s=this.Tr.firstAfterOrEqual(n);return s!==null&&e.isEqual(s.key)}}class Je{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return G.comparator(e.key,n.key)||ge(e.wr,n.wr)}static Ar(e,n){return ge(e.wr,n.wr)||G.comparator(e.key,n.key)}}/**
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
 */class z3{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new ot(Je.Er)}checkEmpty(e){return V.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,s,r){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new o3(i,n,s,r);this.mutationQueue.push(o);for(const a of r)this.br=this.br.add(new Je(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return V.resolve(o)}lookupMutationBatch(e,n){return V.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const s=n+1,r=this.vr(s),i=r<0?0:r;return V.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return V.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return V.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const s=new Je(n,0),r=new Je(n,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([s,r],o=>{const a=this.Dr(o.wr);i.push(a)}),V.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,n){let s=new ot(ge);return n.forEach(r=>{const i=new Je(r,0),o=new Je(r,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,o],a=>{s=s.add(a.wr)})}),V.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(e,n){const s=n.path,r=s.length+1;let i=s;G.isDocumentKey(i)||(i=i.child(""));const o=new Je(new G(i),0);let a=new ot(ge);return this.br.forEachWhile(c=>{const d=c.key.path;return!!s.isPrefixOf(d)&&(d.length===r&&(a=a.add(c.wr)),!0)},o),V.resolve(this.Cr(a))}Cr(e){const n=[];return e.forEach(s=>{const r=this.Dr(s);r!==null&&n.push(r)}),n}removeMutationBatch(e,n){Te(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return V.forEach(n.mutations,r=>{const i=new Je(r.key,n.batchId);return s=s.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.br=s})}On(e){}containsKey(e,n){const s=new Je(n,0),r=this.br.firstAfterOrEqual(s);return V.resolve(n.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,V.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
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
 */class U3{constructor(e){this.Mr=e,this.docs=function(){return new Me(G.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const s=n.key,r=this.docs.get(s),i=r?r.size:0,o=this.Mr(n);return this.docs=this.docs.insert(s,{document:n.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const s=this.docs.get(n);return V.resolve(s?s.document.mutableCopy():Et.newInvalidDocument(n))}getEntries(e,n){let s=Zn();return n.forEach(r=>{const i=this.docs.get(r);s=s.insert(r,i?i.document.mutableCopy():Et.newInvalidDocument(r))}),V.resolve(s)}getDocumentsMatchingQuery(e,n,s,r){let i=Zn();const o=n.path,a=new G(o.child("")),c=this.docs.getIteratorFrom(a);for(;c.hasNext();){const{key:d,value:{document:u}}=c.getNext();if(!o.isPrefixOf(d.path))break;d.path.length>o.length+1||_2(T2(u),s)<=0||(r.has(u.key)||sl(n,u))&&(i=i.insert(u.key,u.mutableCopy()))}return V.resolve(i)}getAllFromCollectionGroup(e,n,s,r){Z()}Or(e,n){return V.forEach(this.docs,s=>n(s))}newChangeBuffer(e){return new $3(this)}getSize(e){return V.resolve(this.size)}}class $3 extends D3{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((s,r)=>{r.isValidDocument()?n.push(this.cr.addEntry(e,r)):this.cr.removeEntry(s)}),V.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
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
 */class q3{constructor(e){this.persistence=e,this.Nr=new hi(n=>Bd(n),Dd),this.lastRemoteSnapshotVersion=ne.min(),this.highestTargetId=0,this.Lr=0,this.Br=new zd,this.targetCount=0,this.kr=ti.Bn()}forEachTarget(e,n){return this.Nr.forEach((s,r)=>n(r)),V.resolve()}getLastRemoteSnapshotVersion(e){return V.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return V.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),V.resolve(this.highestTargetId)}setTargetsMetadata(e,n,s){return s&&(this.lastRemoteSnapshotVersion=s),n>this.Lr&&(this.Lr=n),V.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new ti(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,V.resolve()}updateTargetData(e,n){return this.Kn(n),V.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,V.resolve()}removeTargets(e,n,s){let r=0;const i=[];return this.Nr.forEach((o,a)=>{a.sequenceNumber<=n&&s.get(a.targetId)===null&&(this.Nr.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),r++)}),V.waitFor(i).next(()=>r)}getTargetCount(e){return V.resolve(this.targetCount)}getTargetData(e,n){const s=this.Nr.get(n)||null;return V.resolve(s)}addMatchingKeys(e,n,s){return this.Br.Rr(n,s),V.resolve()}removeMatchingKeys(e,n,s){this.Br.mr(n,s);const r=this.persistence.referenceDelegate,i=[];return r&&n.forEach(o=>{i.push(r.markPotentiallyOrphaned(e,o))}),V.waitFor(i)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),V.resolve()}getMatchingKeysForTargetId(e,n){const s=this.Br.yr(n);return V.resolve(s)}containsKey(e,n){return V.resolve(this.Br.containsKey(n))}}/**
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
 */class H3{constructor(e,n){this.qr={},this.overlays={},this.Qr=new Cd(0),this.Kr=!1,this.Kr=!0,this.$r=new V3,this.referenceDelegate=e(this),this.Ur=new q3(this),this.indexManager=new M3,this.remoteDocumentCache=function(r){return new U3(r)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new P3(n),this.Gr=new O3(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new F3,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let s=this.qr[e.toKey()];return s||(s=new z3(n,this.referenceDelegate),this.qr[e.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,s){Y("MemoryPersistence","Starting transaction:",e);const r=new Y3(this.Qr.next());return this.referenceDelegate.zr(),s(r).next(i=>this.referenceDelegate.jr(r).next(()=>i)).toPromise().then(i=>(r.raiseOnCommittedEvent(),i))}Hr(e,n){return V.or(Object.values(this.qr).map(s=>()=>s.containsKey(e,n)))}}class Y3 extends S2{constructor(e){super(),this.currentSequenceNumber=e}}class Ud{constructor(e){this.persistence=e,this.Jr=new zd,this.Yr=null}static Zr(e){return new Ud(e)}get Xr(){if(this.Yr)return this.Yr;throw Z()}addReference(e,n,s){return this.Jr.addReference(s,n),this.Xr.delete(s.toString()),V.resolve()}removeReference(e,n,s){return this.Jr.removeReference(s,n),this.Xr.add(s.toString()),V.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),V.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(r=>this.Xr.add(r.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,n.targetId).next(r=>{r.forEach(i=>this.Xr.add(i.toString()))}).next(()=>s.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return V.forEach(this.Xr,s=>{const r=G.fromPath(s);return this.ei(e,r).next(i=>{i||n.removeEntry(r,ne.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(s=>{s?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return V.or([()=>V.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}/**
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
 */class $d{constructor(e,n,s,r){this.targetId=e,this.fromCache=n,this.$i=s,this.Ui=r}static Wi(e,n){let s=ce(),r=ce();for(const i of n.docChanges)switch(i.type){case 0:s=s.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new $d(e,n.fromCache,s,r)}}/**
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
 */class W3{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class G3{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return A1()?8:x2(_t())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,s,r){const i={result:null};return this.Yi(e,n).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.Zi(e,n,r,s).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new W3;return this.Xi(e,n,o).next(a=>{if(i.result=a,this.zi)return this.es(e,n,o,a.size)})}).next(()=>i.result)}es(e,n,s,r){return s.documentReadCount<this.ji?(Ri()<=de.DEBUG&&Y("QueryEngine","SDK will not create cache indexes for query:",Lr(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),V.resolve()):(Ri()<=de.DEBUG&&Y("QueryEngine","Query:",Lr(n),"scans",s.documentReadCount,"local documents and returns",r,"documents as results."),s.documentReadCount>this.Hi*r?(Ri()<=de.DEBUG&&Y("QueryEngine","The SDK decides to create cache indexes for query:",Lr(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,En(n))):V.resolve())}Yi(e,n){if(Af(n))return V.resolve(null);let s=En(n);return this.indexManager.getIndexType(e,s).next(r=>r===0?null:(n.limit!==null&&r===1&&(n=Fa(n,null,"F"),s=En(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next(i=>{const o=ce(...i);return this.Ji.getDocuments(e,o).next(a=>this.indexManager.getMinOffset(e,s).next(c=>{const d=this.ts(n,a);return this.ns(n,d,o,c.readTime)?this.Yi(e,Fa(n,null,"F")):this.rs(e,d,n,c)}))})))}Zi(e,n,s,r){return Af(n)||r.isEqual(ne.min())?V.resolve(null):this.Ji.getDocuments(e,s).next(i=>{const o=this.ts(n,i);return this.ns(n,o,s,r)?V.resolve(null):(Ri()<=de.DEBUG&&Y("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),Lr(n)),this.rs(e,o,n,E2(r,-1)).next(a=>a))})}ts(e,n){let s=new ot(Hm(e));return n.forEach((r,i)=>{sl(e,i)&&(s=s.add(i))}),s}ns(e,n,s,r){if(e.limit===null)return!1;if(s.size!==n.size)return!0;const i=e.limitType==="F"?n.last():n.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}Xi(e,n,s){return Ri()<=de.DEBUG&&Y("QueryEngine","Using full collection scan to execute query:",Lr(n)),this.Ji.getDocumentsMatchingQuery(e,n,Ds.min(),s)}rs(e,n,s,r){return this.Ji.getDocumentsMatchingQuery(e,s,r).next(i=>(n.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j3{constructor(e,n,s,r){this.persistence=e,this.ss=n,this.serializer=r,this.os=new Me(ge),this._s=new hi(i=>Bd(i),Dd),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(s)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new N3(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function K3(t,e,n,s){return new j3(t,e,n,s)}async function ug(t,e){const n=se(t);return await n.persistence.runTransaction("Handle user change","readonly",s=>{let r;return n.mutationQueue.getAllMutationBatches(s).next(i=>(r=i,n.ls(e),n.mutationQueue.getAllMutationBatches(s))).next(i=>{const o=[],a=[];let c=ce();for(const d of r){o.push(d.batchId);for(const u of d.mutations)c=c.add(u.key)}for(const d of i){a.push(d.batchId);for(const u of d.mutations)c=c.add(u.key)}return n.localDocuments.getDocuments(s,c).next(d=>({hs:d,removedBatchIds:o,addedBatchIds:a}))})})}function Q3(t,e){const n=se(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const r=e.batch.keys(),i=n.cs.newChangeBuffer({trackRemovals:!0});return function(a,c,d,u){const p=d.batch,f=p.keys();let g=V.resolve();return f.forEach(v=>{g=g.next(()=>u.getEntry(c,v)).next(y=>{const E=d.docVersions.get(v);Te(E!==null),y.version.compareTo(E)<0&&(p.applyToRemoteDocument(y,d),y.isValidDocument()&&(y.setReadTime(d.commitVersion),u.addEntry(y)))})}),g.next(()=>a.mutationQueue.removeMutationBatch(c,p))}(n,s,e,i).next(()=>i.apply(s)).next(()=>n.mutationQueue.performConsistencyCheck(s)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(s,r,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(a){let c=ce();for(let d=0;d<a.mutationResults.length;++d)a.mutationResults[d].transformResults.length>0&&(c=c.add(a.batch.mutations[d].key));return c}(e))).next(()=>n.localDocuments.getDocuments(s,r))})}function hg(t){const e=se(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function J3(t,e){const n=se(t),s=e.snapshotVersion;let r=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=n.cs.newChangeBuffer({trackRemovals:!0});r=n.os;const a=[];e.targetChanges.forEach((u,p)=>{const f=r.get(p);if(!f)return;a.push(n.Ur.removeMatchingKeys(i,u.removedDocuments,p).next(()=>n.Ur.addMatchingKeys(i,u.addedDocuments,p)));let g=f.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(p)!==null?g=g.withResumeToken(lt.EMPTY_BYTE_STRING,ne.min()).withLastLimboFreeSnapshotVersion(ne.min()):u.resumeToken.approximateByteSize()>0&&(g=g.withResumeToken(u.resumeToken,s)),r=r.insert(p,g),function(y,E,C){return y.resumeToken.approximateByteSize()===0||E.snapshotVersion.toMicroseconds()-y.snapshotVersion.toMicroseconds()>=3e8?!0:C.addedDocuments.size+C.modifiedDocuments.size+C.removedDocuments.size>0}(f,g,u)&&a.push(n.Ur.updateTargetData(i,g))});let c=Zn(),d=ce();if(e.documentUpdates.forEach(u=>{e.resolvedLimboDocuments.has(u)&&a.push(n.persistence.referenceDelegate.updateLimboDocument(i,u))}),a.push(X3(i,o,e.documentUpdates).next(u=>{c=u.Ps,d=u.Is})),!s.isEqual(ne.min())){const u=n.Ur.getLastRemoteSnapshotVersion(i).next(p=>n.Ur.setTargetsMetadata(i,i.currentSequenceNumber,s));a.push(u)}return V.waitFor(a).next(()=>o.apply(i)).next(()=>n.localDocuments.getLocalViewOfDocuments(i,c,d)).next(()=>c)}).then(i=>(n.os=r,i))}function X3(t,e,n){let s=ce(),r=ce();return n.forEach(i=>s=s.add(i)),e.getEntries(t,s).next(i=>{let o=Zn();return n.forEach((a,c)=>{const d=i.get(a);c.isFoundDocument()!==d.isFoundDocument()&&(r=r.add(a)),c.isNoDocument()&&c.version.isEqual(ne.min())?(e.removeEntry(a,c.readTime),o=o.insert(a,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),o=o.insert(a,c)):Y("LocalStore","Ignoring outdated watch update for ",a,". Current version:",d.version," Watch version:",c.version)}),{Ps:o,Is:r}})}function Z3(t,e){const n=se(t);return n.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function eE(t,e){const n=se(t);return n.persistence.runTransaction("Allocate target","readwrite",s=>{let r;return n.Ur.getTargetData(s,e).next(i=>i?(r=i,V.resolve(r)):n.Ur.allocateTargetId(s).next(o=>(r=new Ss(e,o,"TargetPurposeListen",s.currentSequenceNumber),n.Ur.addTargetData(s,r).next(()=>r))))}).then(s=>{const r=n.os.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.os=n.os.insert(s.targetId,s),n._s.set(e,s.targetId)),s})}async function Oc(t,e,n){const s=se(t),r=s.os.get(e),i=n?"readwrite":"readwrite-primary";try{n||await s.persistence.runTransaction("Release target",i,o=>s.persistence.referenceDelegate.removeTarget(o,r))}catch(o){if(!Ao(o))throw o;Y("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}s.os=s.os.remove(e),s._s.delete(r.target)}function Ff(t,e,n){const s=se(t);let r=ne.min(),i=ce();return s.persistence.runTransaction("Execute query","readwrite",o=>function(c,d,u){const p=se(c),f=p._s.get(u);return f!==void 0?V.resolve(p.os.get(f)):p.Ur.getTargetData(d,u)}(s,o,En(e)).next(a=>{if(a)return r=a.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(o,a.targetId).next(c=>{i=c})}).next(()=>s.ss.getDocumentsMatchingQuery(o,e,n?r:ne.min(),n?i:ce())).next(a=>(tE(s,H2(e),a),{documents:a,Ts:i})))}function tE(t,e,n){let s=t.us.get(e)||ne.min();n.forEach((r,i)=>{i.readTime.compareTo(s)>0&&(s=i.readTime)}),t.us.set(e,s)}class Vf{constructor(){this.activeTargetIds=Q2()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class nE{constructor(){this.so=new Vf,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,s){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,s){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Vf,Promise.resolve()}handleUserChange(e,n,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class sE{_o(e){}shutdown(){}}/**
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
 */class zf{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){Y("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){Y("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let oa=null;function lc(){return oa===null?oa=function(){return 268435456+Math.round(2147483648*Math.random())}():oa++,"0x"+oa.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rE={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
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
 */class iE{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
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
 */const bt="WebChannelConnection";class oE extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const s=n.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+n.host,this.vo=`projects/${r}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${r}`:`project_id=${r}&database_id=${i}`}get Fo(){return!1}Mo(n,s,r,i,o){const a=lc(),c=this.xo(n,s.toUriEncodedString());Y("RestConnection",`Sending RPC '${n}' ${a}:`,c,r);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,o),this.No(n,c,d,r).then(u=>(Y("RestConnection",`Received RPC '${n}' ${a}: `,u),u),u=>{throw Jr("RestConnection",`RPC '${n}' ${a} failed with error: `,u,"url: ",c,"request:",r),u})}Lo(n,s,r,i,o,a){return this.Mo(n,s,r,i,o)}Oo(n,s,r){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+di}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((i,o)=>n[o]=i),r&&r.headers.forEach((i,o)=>n[o]=i)}xo(n,s){const r=rE[n];return`${this.Do}/v1/${s}:${r}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,s,r){const i=lc();return new Promise((o,a)=>{const c=new xm;c.setWithCredentials(!0),c.listenOnce(Am.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case pa.NO_ERROR:const u=c.getResponseJson();Y(bt,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(u)),o(u);break;case pa.TIMEOUT:Y(bt,`RPC '${e}' ${i} timed out`),a(new q(N.DEADLINE_EXCEEDED,"Request time out"));break;case pa.HTTP_ERROR:const p=c.getStatus();if(Y(bt,`RPC '${e}' ${i} failed with status:`,p,"response text:",c.getResponseText()),p>0){let f=c.getResponseJson();Array.isArray(f)&&(f=f[0]);const g=f==null?void 0:f.error;if(g&&g.status&&g.message){const v=function(E){const C=E.toLowerCase().replace(/_/g,"-");return Object.values(N).indexOf(C)>=0?C:N.UNKNOWN}(g.status);a(new q(v,g.message))}else a(new q(N.UNKNOWN,"Server responded with status "+c.getStatus()))}else a(new q(N.UNAVAILABLE,"Connection failed."));break;default:Z()}}finally{Y(bt,`RPC '${e}' ${i} completed.`)}});const d=JSON.stringify(r);Y(bt,`RPC '${e}' ${i} sending request:`,r),c.send(n,"POST",d,s,15)})}Bo(e,n,s){const r=lc(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Pm(),a=Cm(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,n,s),c.encodeInitMessageHeaders=!0;const u=i.join("");Y(bt,`Creating RPC '${e}' stream ${r}: ${u}`,c);const p=o.createWebChannel(u,c);let f=!1,g=!1;const v=new iE({Io:E=>{g?Y(bt,`Not sending because RPC '${e}' stream ${r} is closed:`,E):(f||(Y(bt,`Opening RPC '${e}' stream ${r} transport.`),p.open(),f=!0),Y(bt,`RPC '${e}' stream ${r} sending:`,E),p.send(E))},To:()=>p.close()}),y=(E,C,k)=>{E.listen(C,P=>{try{k(P)}catch(R){setTimeout(()=>{throw R},0)}})};return y(p,Ni.EventType.OPEN,()=>{g||(Y(bt,`RPC '${e}' stream ${r} transport opened.`),v.yo())}),y(p,Ni.EventType.CLOSE,()=>{g||(g=!0,Y(bt,`RPC '${e}' stream ${r} transport closed`),v.So())}),y(p,Ni.EventType.ERROR,E=>{g||(g=!0,Jr(bt,`RPC '${e}' stream ${r} transport errored:`,E),v.So(new q(N.UNAVAILABLE,"The operation could not be completed")))}),y(p,Ni.EventType.MESSAGE,E=>{var C;if(!g){const k=E.data[0];Te(!!k);const P=k,R=P.error||((C=P[0])===null||C===void 0?void 0:C.error);if(R){Y(bt,`RPC '${e}' stream ${r} received error:`,R);const B=R.status;let D=function(S){const T=$e[S];if(T!==void 0)return tg(T)}(B),I=R.message;D===void 0&&(D=N.INTERNAL,I="Unknown error status: "+B+" with message "+R.message),g=!0,v.So(new q(D,I)),p.close()}else Y(bt,`RPC '${e}' stream ${r} received:`,k),v.bo(k)}}),y(a,km.STAT_EVENT,E=>{E.stat===Ac.PROXY?Y(bt,`RPC '${e}' stream ${r} detected buffering proxy`):E.stat===Ac.NOPROXY&&Y(bt,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{v.wo()},0),v}}function cc(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ll(t){return new g3(t,!0)}/**
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
 */class fg{constructor(e,n,s=1e3,r=1.5,i=6e4){this.ui=e,this.timerId=n,this.ko=s,this.qo=r,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),r=Math.max(0,n-s);r>0&&Y("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,r,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class pg{constructor(e,n,s,r,i,o,a,c){this.ui=e,this.Ho=s,this.Jo=r,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new fg(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===N.RESOURCE_EXHAUSTED?(Xn(n.toString()),Xn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===N.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,r])=>{this.Yo===n&&this.P_(s,r)},s=>{e(()=>{const r=new q(N.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(r)})})}P_(e,n){const s=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(r=>{s(()=>this.I_(r))}),this.stream.onMessage(r=>{s(()=>++this.e_==1?this.E_(r):this.onNext(r))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return Y("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():(Y("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class aE extends pg{constructor(e,n,s,r,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,s,r,o),this.serializer=i}T_(e,n){return this.connection.Bo("Listen",e,n)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const n=b3(this.serializer,e),s=function(i){if(!("targetChange"in i))return ne.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?ne.min():o.readTime?Tn(o.readTime):ne.min()}(e);return this.listener.d_(n,s)}A_(e){const n={};n.database=Nc(this.serializer),n.addTarget=function(i,o){let a;const c=o.target;if(a=Rc(c)?{documents:T3(i,c)}:{query:_3(i,c)._t},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=rg(i,o.resumeToken);const d=Bc(i,o.expectedCount);d!==null&&(a.expectedCount=d)}else if(o.snapshotVersion.compareTo(ne.min())>0){a.readTime=za(i,o.snapshotVersion.toTimestamp());const d=Bc(i,o.expectedCount);d!==null&&(a.expectedCount=d)}return a}(this.serializer,e);const s=S3(this.serializer,e);s&&(n.labels=s),this.a_(n)}R_(e){const n={};n.database=Nc(this.serializer),n.removeTarget=e,this.a_(n)}}class lE extends pg{constructor(e,n,s,r,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,s,r,o),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,n){return this.connection.Bo("Write",e,n)}E_(e){return Te(!!e.streamToken),this.lastStreamToken=e.streamToken,Te(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){Te(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const n=E3(e.writeResults,e.commitTime),s=Tn(e.commitTime);return this.listener.g_(s,n)}p_(){const e={};e.database=Nc(this.serializer),this.a_(e)}m_(e){const n={streamToken:this.lastStreamToken,writes:e.map(s=>w3(this.serializer,s))};this.a_(n)}}/**
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
 */class cE extends class{}{constructor(e,n,s,r){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=s,this.serializer=r,this.y_=!1}w_(){if(this.y_)throw new q(N.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,s,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.Mo(e,Dc(n,s),r,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new q(N.UNKNOWN,i.toString())})}Lo(e,n,s,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Lo(e,Dc(n,s),r,o,a,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new q(N.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class dE{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Xn(n),this.D_=!1):Y("OnlineStateTracker",n)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class uE{constructor(e,n,s,r,i){this.localStore=e,this.datastore=n,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(o=>{s.enqueueAndForget(async()=>{Tr(this)&&(Y("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=se(c);d.L_.add(4),await Po(d),d.q_.set("Unknown"),d.L_.delete(4),await cl(d)}(this))})}),this.q_=new dE(s,r)}}async function cl(t){if(Tr(t))for(const e of t.B_)await e(!0)}async function Po(t){for(const e of t.B_)await e(!1)}function mg(t,e){const n=se(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),Wd(n)?Yd(n):fi(n).r_()&&Hd(n,e))}function qd(t,e){const n=se(t),s=fi(n);n.N_.delete(e),s.r_()&&gg(n,e),n.N_.size===0&&(s.r_()?s.o_():Tr(n)&&n.q_.set("Unknown"))}function Hd(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ne.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}fi(t).A_(e)}function gg(t,e){t.Q_.xe(e),fi(t).R_(e)}function Yd(t){t.Q_=new h3({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),fi(t).start(),t.q_.v_()}function Wd(t){return Tr(t)&&!fi(t).n_()&&t.N_.size>0}function Tr(t){return se(t).L_.size===0}function yg(t){t.Q_=void 0}async function hE(t){t.q_.set("Online")}async function fE(t){t.N_.forEach((e,n)=>{Hd(t,e)})}async function pE(t,e){yg(t),Wd(t)?(t.q_.M_(e),Yd(t)):t.q_.set("Unknown")}async function mE(t,e,n){if(t.q_.set("Online"),e instanceof sg&&e.state===2&&e.cause)try{await async function(r,i){const o=i.cause;for(const a of i.targetIds)r.N_.has(a)&&(await r.remoteSyncer.rejectListen(a,o),r.N_.delete(a),r.Q_.removeTarget(a))}(t,e)}catch(s){Y("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Ua(t,s)}else if(e instanceof ya?t.Q_.Ke(e):e instanceof ng?t.Q_.He(e):t.Q_.We(e),!n.isEqual(ne.min()))try{const s=await hg(t.localStore);n.compareTo(s)>=0&&await function(i,o){const a=i.Q_.rt(o);return a.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const u=i.N_.get(d);u&&i.N_.set(d,u.withResumeToken(c.resumeToken,o))}}),a.targetMismatches.forEach((c,d)=>{const u=i.N_.get(c);if(!u)return;i.N_.set(c,u.withResumeToken(lt.EMPTY_BYTE_STRING,u.snapshotVersion)),gg(i,c);const p=new Ss(u.target,c,d,u.sequenceNumber);Hd(i,p)}),i.remoteSyncer.applyRemoteEvent(a)}(t,n)}catch(s){Y("RemoteStore","Failed to raise snapshot:",s),await Ua(t,s)}}async function Ua(t,e,n){if(!Ao(e))throw e;t.L_.add(1),await Po(t),t.q_.set("Offline"),n||(n=()=>hg(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{Y("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await cl(t)})}function vg(t,e){return e().catch(n=>Ua(t,n,e))}async function dl(t){const e=se(t),n=Ns(e);let s=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;gE(e);)try{const r=await Z3(e.localStore,s);if(r===null){e.O_.length===0&&n.o_();break}s=r.batchId,yE(e,r)}catch(r){await Ua(e,r)}bg(e)&&wg(e)}function gE(t){return Tr(t)&&t.O_.length<10}function yE(t,e){t.O_.push(e);const n=Ns(t);n.r_()&&n.V_&&n.m_(e.mutations)}function bg(t){return Tr(t)&&!Ns(t).n_()&&t.O_.length>0}function wg(t){Ns(t).start()}async function vE(t){Ns(t).p_()}async function bE(t){const e=Ns(t);for(const n of t.O_)e.m_(n.mutations)}async function wE(t,e,n){const s=t.O_.shift(),r=Od.from(s,e,n);await vg(t,()=>t.remoteSyncer.applySuccessfulWrite(r)),await dl(t)}async function EE(t,e){e&&Ns(t).V_&&await async function(s,r){if(function(o){return c3(o)&&o!==N.ABORTED}(r.code)){const i=s.O_.shift();Ns(s).s_(),await vg(s,()=>s.remoteSyncer.rejectFailedWrite(i.batchId,r)),await dl(s)}}(t,e),bg(t)&&wg(t)}async function Uf(t,e){const n=se(t);n.asyncQueue.verifyOperationInProgress(),Y("RemoteStore","RemoteStore received new credentials");const s=Tr(n);n.L_.add(3),await Po(n),s&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await cl(n)}async function TE(t,e){const n=se(t);e?(n.L_.delete(2),await cl(n)):e||(n.L_.add(2),await Po(n),n.q_.set("Unknown"))}function fi(t){return t.K_||(t.K_=function(n,s,r){const i=se(n);return i.w_(),new aE(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(t.datastore,t.asyncQueue,{Eo:hE.bind(null,t),Ro:fE.bind(null,t),mo:pE.bind(null,t),d_:mE.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),Wd(t)?Yd(t):t.q_.set("Unknown")):(await t.K_.stop(),yg(t))})),t.K_}function Ns(t){return t.U_||(t.U_=function(n,s,r){const i=se(n);return i.w_(),new lE(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:vE.bind(null,t),mo:EE.bind(null,t),f_:bE.bind(null,t),g_:wE.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await dl(t)):(await t.U_.stop(),t.O_.length>0&&(Y("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_}/**
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
 */class Gd{constructor(e,n,s,r,i){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=s,this.op=r,this.removalCallback=i,this.deferred=new Gn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,s,r,i){const o=Date.now()+s,a=new Gd(e,n,o,r,i);return a.start(s),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new q(N.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function jd(t,e){if(Xn("AsyncQueue",`${e}: ${t}`),Ao(t))return new q(N.UNAVAILABLE,`${e}: ${t}`);throw t}/**
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
 */class qr{constructor(e){this.comparator=e?(n,s)=>e(n,s)||G.comparator(n.key,s.key):(n,s)=>G.comparator(n.key,s.key),this.keyedMap=Oi(),this.sortedSet=new Me(this.comparator)}static emptySet(e){return new qr(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,s)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof qr)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(!r.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const s=new qr;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=n,s}}/**
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
 */class $f{constructor(){this.W_=new Me(G.comparator)}track(e){const n=e.doc.key,s=this.W_.get(n);s?e.type!==0&&s.type===3?this.W_=this.W_.insert(n,e):e.type===3&&s.type!==1?this.W_=this.W_.insert(n,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.W_=this.W_.insert(n,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.W_=this.W_.remove(n):e.type===1&&s.type===2?this.W_=this.W_.insert(n,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):Z():this.W_=this.W_.insert(n,e)}G_(){const e=[];return this.W_.inorderTraversal((n,s)=>{e.push(s)}),e}}class ni{constructor(e,n,s,r,i,o,a,c,d){this.query=e,this.docs=n,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,n,s,r,i){const o=[];return n.forEach(a=>{o.push({type:0,doc:a})}),new ni(e,n,qr.emptySet(n),o,s,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&nl(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,s=e.docChanges;if(n.length!==s.length)return!1;for(let r=0;r<n.length;r++)if(n[r].type!==s[r].type||!n[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
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
 */class _E{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class IE{constructor(){this.queries=qf(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,s){const r=se(n),i=r.queries;r.queries=qf(),i.forEach((o,a)=>{for(const c of a.j_)c.onError(s)})})(this,new q(N.ABORTED,"Firestore shutting down"))}}function qf(){return new hi(t=>qm(t),nl)}async function Eg(t,e){const n=se(t);let s=3;const r=e.query;let i=n.queries.get(r);i?!i.H_()&&e.J_()&&(s=2):(i=new _E,s=e.J_()?0:1);try{switch(s){case 0:i.z_=await n.onListen(r,!0);break;case 1:i.z_=await n.onListen(r,!1);break;case 2:await n.onFirstRemoteStoreListen(r)}}catch(o){const a=jd(o,`Initialization of query '${Lr(e.query)}' failed`);return void e.onError(a)}n.queries.set(r,i),i.j_.push(e),e.Z_(n.onlineState),i.z_&&e.X_(i.z_)&&Kd(n)}async function Tg(t,e){const n=se(t),s=e.query;let r=3;const i=n.queries.get(s);if(i){const o=i.j_.indexOf(e);o>=0&&(i.j_.splice(o,1),i.j_.length===0?r=e.J_()?0:1:!i.H_()&&e.J_()&&(r=2))}switch(r){case 0:return n.queries.delete(s),n.onUnlisten(s,!0);case 1:return n.queries.delete(s),n.onUnlisten(s,!1);case 2:return n.onLastRemoteStoreUnlisten(s);default:return}}function SE(t,e){const n=se(t);let s=!1;for(const r of e){const i=r.query,o=n.queries.get(i);if(o){for(const a of o.j_)a.X_(r)&&(s=!0);o.z_=r}}s&&Kd(n)}function xE(t,e,n){const s=se(t),r=s.queries.get(e);if(r)for(const i of r.j_)i.onError(n);s.queries.delete(e)}function Kd(t){t.Y_.forEach(e=>{e.next()})}var Fc,Hf;(Hf=Fc||(Fc={})).ea="default",Hf.Cache="cache";class _g{constructor(e,n,s){this.query=e,this.ta=n,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new ni(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.na?this.ia(e)&&(this.ta.next(e),n=!0):this.sa(e,this.onlineState)&&(this.oa(e),n=!0),this.ra=e,n}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let n=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),n=!0),n}sa(e,n){if(!e.fromCache||!this.J_())return!0;const s=n!=="Offline";return(!this.options._a||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const n=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}oa(e){e=ni.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Fc.Cache}}/**
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
 */class Ig{constructor(e){this.key=e}}class Sg{constructor(e){this.key=e}}class AE{constructor(e,n){this.query=e,this.Ta=n,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ce(),this.mutatedKeys=ce(),this.Aa=Hm(e),this.Ra=new qr(this.Aa)}get Va(){return this.Ta}ma(e,n){const s=n?n.fa:new $f,r=n?n.Ra:this.Ra;let i=n?n.mutatedKeys:this.mutatedKeys,o=r,a=!1;const c=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,d=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((u,p)=>{const f=r.get(u),g=sl(this.query,p)?p:null,v=!!f&&this.mutatedKeys.has(f.key),y=!!g&&(g.hasLocalMutations||this.mutatedKeys.has(g.key)&&g.hasCommittedMutations);let E=!1;f&&g?f.data.isEqual(g.data)?v!==y&&(s.track({type:3,doc:g}),E=!0):this.ga(f,g)||(s.track({type:2,doc:g}),E=!0,(c&&this.Aa(g,c)>0||d&&this.Aa(g,d)<0)&&(a=!0)):!f&&g?(s.track({type:0,doc:g}),E=!0):f&&!g&&(s.track({type:1,doc:f}),E=!0,(c||d)&&(a=!0)),E&&(g?(o=o.add(g),i=y?i.add(u):i.delete(u)):(o=o.delete(u),i=i.delete(u)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const u=this.query.limitType==="F"?o.last():o.first();o=o.delete(u.key),i=i.delete(u.key),s.track({type:1,doc:u})}return{Ra:o,fa:s,ns:a,mutatedKeys:i}}ga(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,s,r){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((u,p)=>function(g,v){const y=E=>{switch(E){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Z()}};return y(g)-y(v)}(u.type,p.type)||this.Aa(u.doc,p.doc)),this.pa(s),r=r!=null&&r;const a=n&&!r?this.ya():[],c=this.da.size===0&&this.current&&!r?1:0,d=c!==this.Ea;return this.Ea=c,o.length!==0||d?{snapshot:new ni(this.query,e.Ra,i,o,e.mutatedKeys,c===0,d,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:a}:{wa:a}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new $f,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(n=>this.Ta=this.Ta.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ta=this.Ta.delete(n)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ce(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const n=[];return e.forEach(s=>{this.da.has(s)||n.push(new Sg(s))}),this.da.forEach(s=>{e.has(s)||n.push(new Ig(s))}),n}ba(e){this.Ta=e.Ts,this.da=ce();const n=this.ma(e.documents);return this.applyChanges(n,!0)}Da(){return ni.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class kE{constructor(e,n,s){this.query=e,this.targetId=n,this.view=s}}class CE{constructor(e){this.key=e,this.va=!1}}class PE{constructor(e,n,s,r,i,o){this.localStore=e,this.remoteStore=n,this.eventManager=s,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new hi(a=>qm(a),nl),this.Ma=new Map,this.xa=new Set,this.Oa=new Me(G.comparator),this.Na=new Map,this.La=new zd,this.Ba={},this.ka=new Map,this.qa=ti.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function RE(t,e,n=!0){const s=Rg(t);let r;const i=s.Fa.get(e);return i?(s.sharedClientState.addLocalQueryTarget(i.targetId),r=i.view.Da()):r=await xg(s,e,n,!0),r}async function ME(t,e){const n=Rg(t);await xg(n,e,!0,!1)}async function xg(t,e,n,s){const r=await eE(t.localStore,En(e)),i=r.targetId,o=t.sharedClientState.addLocalQueryTarget(i,n);let a;return s&&(a=await BE(t,e,i,o==="current",r.resumeToken)),t.isPrimaryClient&&n&&mg(t.remoteStore,r),a}async function BE(t,e,n,s,r){t.Ka=(p,f,g)=>async function(y,E,C,k){let P=E.view.ma(C);P.ns&&(P=await Ff(y.localStore,E.query,!1).then(({documents:I})=>E.view.ma(I,P)));const R=k&&k.targetChanges.get(E.targetId),B=k&&k.targetMismatches.get(E.targetId)!=null,D=E.view.applyChanges(P,y.isPrimaryClient,R,B);return Wf(y,E.targetId,D.wa),D.snapshot}(t,p,f,g);const i=await Ff(t.localStore,e,!0),o=new AE(e,i.Ts),a=o.ma(i.documents),c=Co.createSynthesizedTargetChangeForCurrentChange(n,s&&t.onlineState!=="Offline",r),d=o.applyChanges(a,t.isPrimaryClient,c);Wf(t,n,d.wa);const u=new kE(e,n,o);return t.Fa.set(e,u),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),d.snapshot}async function DE(t,e,n){const s=se(t),r=s.Fa.get(e),i=s.Ma.get(r.targetId);if(i.length>1)return s.Ma.set(r.targetId,i.filter(o=>!nl(o,e))),void s.Fa.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(r.targetId),s.sharedClientState.isActiveQueryTarget(r.targetId)||await Oc(s.localStore,r.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(r.targetId),n&&qd(s.remoteStore,r.targetId),Vc(s,r.targetId)}).catch(xo)):(Vc(s,r.targetId),await Oc(s.localStore,r.targetId,!0))}async function LE(t,e){const n=se(t),s=n.Fa.get(e),r=n.Ma.get(s.targetId);n.isPrimaryClient&&r.length===1&&(n.sharedClientState.removeLocalQueryTarget(s.targetId),qd(n.remoteStore,s.targetId))}async function NE(t,e,n){const s=qE(t);try{const r=await function(o,a){const c=se(o),d=Ye.now(),u=a.reduce((g,v)=>g.add(v.key),ce());let p,f;return c.persistence.runTransaction("Locally write mutations","readwrite",g=>{let v=Zn(),y=ce();return c.cs.getEntries(g,u).next(E=>{v=E,v.forEach((C,k)=>{k.isValidDocument()||(y=y.add(C))})}).next(()=>c.localDocuments.getOverlayedDocuments(g,v)).next(E=>{p=E;const C=[];for(const k of a){const P=r3(k,p.get(k.key).overlayedDocument);P!=null&&C.push(new Fs(k.key,P,Lm(P.value.mapValue),Bt.exists(!0)))}return c.mutationQueue.addMutationBatch(g,d,C,a)}).next(E=>{f=E;const C=E.applyToLocalDocumentSet(p,y);return c.documentOverlayCache.saveOverlays(g,E.batchId,C)})}).then(()=>({batchId:f.batchId,changes:Wm(p)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),function(o,a,c){let d=o.Ba[o.currentUser.toKey()];d||(d=new Me(ge)),d=d.insert(a,c),o.Ba[o.currentUser.toKey()]=d}(s,r.batchId,n),await Ro(s,r.changes),await dl(s.remoteStore)}catch(r){const i=jd(r,"Failed to persist write");n.reject(i)}}async function Ag(t,e){const n=se(t);try{const s=await J3(n.localStore,e);e.targetChanges.forEach((r,i)=>{const o=n.Na.get(i);o&&(Te(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1),r.addedDocuments.size>0?o.va=!0:r.modifiedDocuments.size>0?Te(o.va):r.removedDocuments.size>0&&(Te(o.va),o.va=!1))}),await Ro(n,s,e)}catch(s){await xo(s)}}function Yf(t,e,n){const s=se(t);if(s.isPrimaryClient&&n===0||!s.isPrimaryClient&&n===1){const r=[];s.Fa.forEach((i,o)=>{const a=o.view.Z_(e);a.snapshot&&r.push(a.snapshot)}),function(o,a){const c=se(o);c.onlineState=a;let d=!1;c.queries.forEach((u,p)=>{for(const f of p.j_)f.Z_(a)&&(d=!0)}),d&&Kd(c)}(s.eventManager,e),r.length&&s.Ca.d_(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function OE(t,e,n){const s=se(t);s.sharedClientState.updateQueryState(e,"rejected",n);const r=s.Na.get(e),i=r&&r.key;if(i){let o=new Me(G.comparator);o=o.insert(i,Et.newNoDocument(i,ne.min()));const a=ce().add(i),c=new al(ne.min(),new Map,new Me(ge),o,a);await Ag(s,c),s.Oa=s.Oa.remove(i),s.Na.delete(e),Qd(s)}else await Oc(s.localStore,e,!1).then(()=>Vc(s,e,n)).catch(xo)}async function FE(t,e){const n=se(t),s=e.batch.batchId;try{const r=await Q3(n.localStore,e);Cg(n,s,null),kg(n,s),n.sharedClientState.updateMutationState(s,"acknowledged"),await Ro(n,r)}catch(r){await xo(r)}}async function VE(t,e,n){const s=se(t);try{const r=await function(o,a){const c=se(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let u;return c.mutationQueue.lookupMutationBatch(d,a).next(p=>(Te(p!==null),u=p.keys(),c.mutationQueue.removeMutationBatch(d,p))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,u,a)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,u)).next(()=>c.localDocuments.getDocuments(d,u))})}(s.localStore,e);Cg(s,e,n),kg(s,e),s.sharedClientState.updateMutationState(e,"rejected",n),await Ro(s,r)}catch(r){await xo(r)}}function kg(t,e){(t.ka.get(e)||[]).forEach(n=>{n.resolve()}),t.ka.delete(e)}function Cg(t,e,n){const s=se(t);let r=s.Ba[s.currentUser.toKey()];if(r){const i=r.get(e);i&&(n?i.reject(n):i.resolve(),r=r.remove(e)),s.Ba[s.currentUser.toKey()]=r}}function Vc(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const s of t.Ma.get(e))t.Fa.delete(s),n&&t.Ca.$a(s,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(s=>{t.La.containsKey(s)||Pg(t,s)})}function Pg(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);n!==null&&(qd(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),Qd(t))}function Wf(t,e,n){for(const s of n)s instanceof Ig?(t.La.addReference(s.key,e),zE(t,s)):s instanceof Sg?(Y("SyncEngine","Document no longer in limbo: "+s.key),t.La.removeReference(s.key,e),t.La.containsKey(s.key)||Pg(t,s.key)):Z()}function zE(t,e){const n=e.key,s=n.path.canonicalString();t.Oa.get(n)||t.xa.has(s)||(Y("SyncEngine","New document in limbo: "+n),t.xa.add(s),Qd(t))}function Qd(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new G(ke.fromString(e)),s=t.qa.next();t.Na.set(s,new CE(n)),t.Oa=t.Oa.insert(n,s),mg(t.remoteStore,new Ss(En(Ld(n.path)),s,"TargetPurposeLimboResolution",Cd.oe))}}async function Ro(t,e,n){const s=se(t),r=[],i=[],o=[];s.Fa.isEmpty()||(s.Fa.forEach((a,c)=>{o.push(s.Ka(c,e,n).then(d=>{var u;if((d||n)&&s.isPrimaryClient){const p=d?!d.fromCache:(u=n==null?void 0:n.targetChanges.get(c.targetId))===null||u===void 0?void 0:u.current;s.sharedClientState.updateQueryState(c.targetId,p?"current":"not-current")}if(d){r.push(d);const p=$d.Wi(c.targetId,d);i.push(p)}}))}),await Promise.all(o),s.Ca.d_(r),await async function(c,d){const u=se(c);try{await u.persistence.runTransaction("notifyLocalViewChanges","readwrite",p=>V.forEach(d,f=>V.forEach(f.$i,g=>u.persistence.referenceDelegate.addReference(p,f.targetId,g)).next(()=>V.forEach(f.Ui,g=>u.persistence.referenceDelegate.removeReference(p,f.targetId,g)))))}catch(p){if(!Ao(p))throw p;Y("LocalStore","Failed to update sequence numbers: "+p)}for(const p of d){const f=p.targetId;if(!p.fromCache){const g=u.os.get(f),v=g.snapshotVersion,y=g.withLastLimboFreeSnapshotVersion(v);u.os=u.os.insert(f,y)}}}(s.localStore,i))}async function UE(t,e){const n=se(t);if(!n.currentUser.isEqual(e)){Y("SyncEngine","User change. New user:",e.toKey());const s=await ug(n.localStore,e);n.currentUser=e,function(i,o){i.ka.forEach(a=>{a.forEach(c=>{c.reject(new q(N.CANCELLED,o))})}),i.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await Ro(n,s.hs)}}function $E(t,e){const n=se(t),s=n.Na.get(e);if(s&&s.va)return ce().add(s.key);{let r=ce();const i=n.Ma.get(e);if(!i)return r;for(const o of i){const a=n.Fa.get(o);r=r.unionWith(a.view.Va)}return r}}function Rg(t){const e=se(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=Ag.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=$E.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=OE.bind(null,e),e.Ca.d_=SE.bind(null,e.eventManager),e.Ca.$a=xE.bind(null,e.eventManager),e}function qE(t){const e=se(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=FE.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=VE.bind(null,e),e}class $a{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ll(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return K3(this.persistence,new G3,e.initialUser,this.serializer)}Ga(e){return new H3(Ud.Zr,this.serializer)}Wa(e){return new nE}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}$a.provider={build:()=>new $a};class zc{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>Yf(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=UE.bind(null,this.syncEngine),await TE(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new IE}()}createDatastore(e){const n=ll(e.databaseInfo.databaseId),s=function(i){return new oE(i)}(e.databaseInfo);return function(i,o,a,c){return new cE(i,o,a,c)}(e.authCredentials,e.appCheckCredentials,s,n)}createRemoteStore(e){return function(s,r,i,o,a){return new uE(s,r,i,o,a)}(this.localStore,this.datastore,e.asyncQueue,n=>Yf(this.syncEngine,n,0),function(){return zf.D()?new zf:new sE}())}createSyncEngine(e,n){return function(r,i,o,a,c,d,u){const p=new PE(r,i,o,a,c,d);return u&&(p.Qa=!0),p}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(r){const i=se(r);Y("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await Po(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}zc.provider={build:()=>new zc};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Mg{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Xn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
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
 */class HE{constructor(e,n,s,r,i){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=s,this.databaseInfo=r,this.user=wt.UNAUTHENTICATED,this.clientId=Mm.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(s,async o=>{Y("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(s,o=>(Y("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Gn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const s=jd(n,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function dc(t,e){t.asyncQueue.verifyOperationInProgress(),Y("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let s=n.initialUser;t.setCredentialChangeListener(async r=>{s.isEqual(r)||(await ug(e.localStore,r),s=r)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function Gf(t,e){t.asyncQueue.verifyOperationInProgress();const n=await YE(t);Y("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(s=>Uf(e.remoteStore,s)),t.setAppCheckTokenChangeListener((s,r)=>Uf(e.remoteStore,r)),t._onlineComponents=e}async function YE(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){Y("FirestoreClient","Using user provided OfflineComponentProvider");try{await dc(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(r){return r.name==="FirebaseError"?r.code===N.FAILED_PRECONDITION||r.code===N.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11}(n))throw n;Jr("Error using user provided cache. Falling back to memory cache: "+n),await dc(t,new $a)}}else Y("FirestoreClient","Using default OfflineComponentProvider"),await dc(t,new $a);return t._offlineComponents}async function Bg(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(Y("FirestoreClient","Using user provided OnlineComponentProvider"),await Gf(t,t._uninitializedComponentsProvider._online)):(Y("FirestoreClient","Using default OnlineComponentProvider"),await Gf(t,new zc))),t._onlineComponents}function WE(t){return Bg(t).then(e=>e.syncEngine)}async function Dg(t){const e=await Bg(t),n=e.eventManager;return n.onListen=RE.bind(null,e.syncEngine),n.onUnlisten=DE.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=ME.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=LE.bind(null,e.syncEngine),n}function GE(t,e,n={}){const s=new Gn;return t.asyncQueue.enqueueAndForget(async()=>function(i,o,a,c,d){const u=new Mg({next:f=>{u.Za(),o.enqueueAndForget(()=>Tg(i,p));const g=f.docs.has(a);!g&&f.fromCache?d.reject(new q(N.UNAVAILABLE,"Failed to get document because the client is offline.")):g&&f.fromCache&&c&&c.source==="server"?d.reject(new q(N.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(f)},error:f=>d.reject(f)}),p=new _g(Ld(a.path),u,{includeMetadataChanges:!0,_a:!0});return Eg(i,p)}(await Dg(t),t.asyncQueue,e,n,s)),s.promise}function jE(t,e,n={}){const s=new Gn;return t.asyncQueue.enqueueAndForget(async()=>function(i,o,a,c,d){const u=new Mg({next:f=>{u.Za(),o.enqueueAndForget(()=>Tg(i,p)),f.fromCache&&c.source==="server"?d.reject(new q(N.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(f)},error:f=>d.reject(f)}),p=new _g(a,u,{includeMetadataChanges:!0,_a:!0});return Eg(i,p)}(await Dg(t),t.asyncQueue,e,n,s)),s.promise}/**
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
 */function Lg(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jf=new Map;/**
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
 */function Ng(t,e,n){if(!n)throw new q(N.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function KE(t,e,n,s){if(e===!0&&s===!0)throw new q(N.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function Kf(t){if(!G.isDocumentKey(t))throw new q(N.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Qf(t){if(G.isDocumentKey(t))throw new q(N.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function ul(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":Z()}function Zt(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new q(N.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=ul(t);throw new q(N.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}function QE(t,e){if(e<=0)throw new q(N.INVALID_ARGUMENT,`Function ${t}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jf{constructor(e){var n,s;if(e.host===void 0){if(e.ssl!==void 0)throw new q(N.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new q(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}KE("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Lg((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new q(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new q(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new q(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,r){return s.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class hl{constructor(e,n,s,r){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Jf({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new q(N.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new q(N.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Jf(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new h2;switch(s.type){case"firstParty":return new g2(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new q(N.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const s=jf.get(n);s&&(Y("ComponentProvider","Removing Datastore"),jf.delete(n),s.terminate())}(this),Promise.resolve()}}function JE(t,e,n,s={}){var r;const i=(t=Zt(t,hl))._getSettings(),o=`${e}:${n}`;if(i.host!=="firestore.googleapis.com"&&i.host!==o&&Jr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},i),{host:o,ssl:!1})),s.mockUserToken){let a,c;if(typeof s.mockUserToken=="string")a=s.mockUserToken,c=wt.MOCK_USER;else{a=w1(s.mockUserToken,(r=t._app)===null||r===void 0?void 0:r.options.projectId);const d=s.mockUserToken.sub||s.mockUserToken.user_id;if(!d)throw new q(N.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new wt(d)}t._authCredentials=new f2(new Rm(a,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vs{constructor(e,n,s){this.converter=n,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Vs(this.firestore,e,this._query)}}class Dt{constructor(e,n,s){this.converter=n,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Rs(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Dt(this.firestore,e,this._key)}}class Rs extends Vs{constructor(e,n,s){super(e,n,Ld(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Dt(this.firestore,null,new G(e))}withConverter(e){return new Rs(this.firestore,e,this._path)}}function Jd(t,e,...n){if(t=Re(t),Ng("collection","path",e),t instanceof hl){const s=ke.fromString(e,...n);return Qf(s),new Rs(t,null,s)}{if(!(t instanceof Dt||t instanceof Rs))throw new q(N.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(ke.fromString(e,...n));return Qf(s),new Rs(t.firestore,null,s)}}function it(t,e,...n){if(t=Re(t),arguments.length===1&&(e=Mm.newId()),Ng("doc","path",e),t instanceof hl){const s=ke.fromString(e,...n);return Kf(s),new Dt(t,null,new G(s))}{if(!(t instanceof Dt||t instanceof Rs))throw new q(N.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(ke.fromString(e,...n));return Kf(s),new Dt(t.firestore,t instanceof Rs?t.converter:null,new G(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xf{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new fg(this,"async_queue_retry"),this.Vu=()=>{const s=cc();s&&Y("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=e;const n=cc();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=cc();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new Gn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Ao(e))throw e;Y("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(s=>{this.Eu=s,this.du=!1;const r=function(o){let a=o.message||"";return o.stack&&(a=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),a}(s);throw Xn("INTERNAL UNHANDLED ERROR: ",r),s}).then(s=>(this.du=!1,s))));return this.mu=n,n}enqueueAfterDelay(e,n,s){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const r=Gd.createAndSchedule(this,e,n,s,i=>this.yu(i));return this.Tu.push(r),r}fu(){this.Eu&&Z()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,s)=>n.targetTimeMs-s.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}class zs extends hl{constructor(e,n,s,r){super(e,n,s,r),this.type="firestore",this._queue=new Xf,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Xf(e),this._firestoreClient=void 0,await e}}}function XE(t,e){const n=typeof t=="object"?t:Up(),s=typeof t=="string"?t:"(default)",r=gd(n,"firestore").getImmediate({identifier:s});if(!r._initialized){const i=v1("firestore");i&&JE(r,...i)}return r}function fl(t){if(t._terminated)throw new q(N.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||ZE(t),t._firestoreClient}function ZE(t){var e,n,s;const r=t._freezeSettings(),i=function(a,c,d,u){return new C2(a,c,d,u.host,u.ssl,u.experimentalForceLongPolling,u.experimentalAutoDetectLongPolling,Lg(u.experimentalLongPollingOptions),u.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,r);t._componentsProvider||!((n=r.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((s=r.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(t._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),t._firestoreClient=new HE(t._authCredentials,t._appCheckCredentials,t._queue,i,t._componentsProvider&&function(a){const c=a==null?void 0:a._online.build();return{_offline:a==null?void 0:a._offline.build(c),_online:c}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(e){this._byteString=e}static fromBase64String(e){try{return new si(lt.fromBase64String(e))}catch(n){throw new q(N.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new si(lt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mo{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new q(N.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new rt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pl{constructor(e){this._methodName=e}}/**
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
 */class Xd{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new q(N.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new q(N.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ge(this._lat,e._lat)||ge(this._long,e._long)}}/**
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
 */class Zd{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,r){if(s.length!==r.length)return!1;for(let i=0;i<s.length;++i)if(s[i]!==r[i])return!1;return!0}(this._values,e._values)}}/**
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
 */const eT=/^__.*__$/;class tT{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return this.fieldMask!==null?new Fs(e,this.data,this.fieldMask,n,this.fieldTransforms):new ko(e,this.data,n,this.fieldTransforms)}}class Og{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return new Fs(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function Fg(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Z()}}class eu{constructor(e,n,s,r,i,o){this.settings=e,this.databaseId=n,this.serializer=s,this.ignoreUndefinedProperties=r,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new eu(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Fu({path:s,xu:!1});return r.Ou(e),r}Nu(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Fu({path:s,xu:!1});return r.vu(),r}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return qa(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Fg(this.Cu)&&eT.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class nT{constructor(e,n,s){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=s||ll(e)}Qu(e,n,s,r=!1){return new eu({Cu:e,methodName:n,qu:s,path:rt.emptyPath(),xu:!1,ku:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Bo(t){const e=t._freezeSettings(),n=ll(t._databaseId);return new nT(t._databaseId,!!e.ignoreUndefinedProperties,n)}function tu(t,e,n,s,r,i={}){const o=t.Qu(i.merge||i.mergeFields?2:0,e,n,r);su("Data must be an object, but it was:",o,s);const a=Ug(s,o);let c,d;if(i.merge)c=new Ht(o.fieldMask),d=o.fieldTransforms;else if(i.mergeFields){const u=[];for(const p of i.mergeFields){const f=Uc(e,p,n);if(!o.contains(f))throw new q(N.INVALID_ARGUMENT,`Field '${f}' is specified in your field mask but missing from your input data.`);qg(u,f)||u.push(f)}c=new Ht(u),d=o.fieldTransforms.filter(p=>c.covers(p.field))}else c=null,d=o.fieldTransforms;return new tT(new Ft(a),c,d)}class ml extends pl{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ml}}class nu extends pl{_toFieldTransform(e){return new e3(e.path,new io)}isEqual(e){return e instanceof nu}}function Vg(t,e,n,s){const r=t.Qu(1,e,n);su("Data must be an object, but it was:",r,s);const i=[],o=Ft.empty();Er(s,(c,d)=>{const u=ru(e,c,n);d=Re(d);const p=r.Nu(u);if(d instanceof ml)i.push(u);else{const f=Do(d,p);f!=null&&(i.push(u),o.set(u,f))}});const a=new Ht(i);return new Og(o,a,r.fieldTransforms)}function zg(t,e,n,s,r,i){const o=t.Qu(1,e,n),a=[Uc(e,s,n)],c=[r];if(i.length%2!=0)throw new q(N.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let f=0;f<i.length;f+=2)a.push(Uc(e,i[f])),c.push(i[f+1]);const d=[],u=Ft.empty();for(let f=a.length-1;f>=0;--f)if(!qg(d,a[f])){const g=a[f];let v=c[f];v=Re(v);const y=o.Nu(g);if(v instanceof ml)d.push(g);else{const E=Do(v,y);E!=null&&(d.push(g),u.set(g,E))}}const p=new Ht(d);return new Og(u,p,o.fieldTransforms)}function sT(t,e,n,s=!1){return Do(n,t.Qu(s?4:3,e))}function Do(t,e){if($g(t=Re(t)))return su("Unsupported field value:",e,t),Ug(t,e);if(t instanceof pl)return function(s,r){if(!Fg(r.Cu))throw r.Bu(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r.Bu(`${s._methodName}() is not currently supported inside arrays`);const i=s._toFieldTransform(r);i&&r.fieldTransforms.push(i)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(s,r){const i=[];let o=0;for(const a of s){let c=Do(a,r.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),o++}return{arrayValue:{values:i}}}(t,e)}return function(s,r){if((s=Re(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return J2(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const i=Ye.fromDate(s);return{timestampValue:za(r.serializer,i)}}if(s instanceof Ye){const i=new Ye(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:za(r.serializer,i)}}if(s instanceof Xd)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof si)return{bytesValue:rg(r.serializer,s._byteString)};if(s instanceof Dt){const i=r.databaseId,o=s.firestore._databaseId;if(!o.isEqual(i))throw r.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Vd(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof Zd)return function(o,a){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw a.Bu("VectorValues must only contain numeric values.");return Nd(a.serializer,c)})}}}}}}(s,r);throw r.Bu(`Unsupported field value: ${ul(s)}`)}(t,e)}function Ug(t,e){const n={};return Bm(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Er(t,(s,r)=>{const i=Do(r,e.Mu(s));i!=null&&(n[s]=i)}),{mapValue:{fields:n}}}function $g(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof Ye||t instanceof Xd||t instanceof si||t instanceof Dt||t instanceof pl||t instanceof Zd)}function su(t,e,n){if(!$g(n)||!function(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}(n)){const s=ul(n);throw s==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+s)}}function Uc(t,e,n){if((e=Re(e))instanceof Mo)return e._internalPath;if(typeof e=="string")return ru(t,e);throw qa("Field path arguments must be of type string or ",t,!1,void 0,n)}const rT=new RegExp("[~\\*/\\[\\]]");function ru(t,e,n){if(e.search(rT)>=0)throw qa(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Mo(...e.split("."))._internalPath}catch{throw qa(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function qa(t,e,n,s,r){const i=s&&!s.isEmpty(),o=r!==void 0;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${s}`),o&&(c+=` in document ${r}`),c+=")"),new q(N.INVALID_ARGUMENT,a+t+c)}function qg(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hg{constructor(e,n,s,r,i){this._firestore=e,this._userDataWriter=n,this._key=s,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Dt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new iT(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(iu("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class iT extends Hg{data(){return super.data()}}function iu(t,e){return typeof e=="string"?ru(t,e):e instanceof Mo?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oT(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new q(N.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class ou{}class au extends ou{}function aT(t,e,...n){let s=[];e instanceof ou&&s.push(e),s=s.concat(n),function(i){const o=i.filter(c=>c instanceof cu).length,a=i.filter(c=>c instanceof lu).length;if(o>1||o>0&&a>0)throw new q(N.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const r of s)t=r._apply(t);return t}class lu extends au{constructor(e,n,s){super(),this._field=e,this._op=n,this._value=s,this.type="where"}static _create(e,n,s){return new lu(e,n,s)}_apply(e){const n=this._parse(e);return Yg(e._query,n),new Vs(e.firestore,e.converter,Mc(e._query,n))}_parse(e){const n=Bo(e.firestore);return function(i,o,a,c,d,u,p){let f;if(d.isKeyField()){if(u==="array-contains"||u==="array-contains-any")throw new q(N.INVALID_ARGUMENT,`Invalid Query. You can't perform '${u}' queries on documentId().`);if(u==="in"||u==="not-in"){ep(p,u);const g=[];for(const v of p)g.push(Zf(c,i,v));f={arrayValue:{values:g}}}else f=Zf(c,i,p)}else u!=="in"&&u!=="not-in"&&u!=="array-contains-any"||ep(p,u),f=sT(a,o,p,u==="in"||u==="not-in");return qe.create(d,u,f)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}class cu extends ou{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new cu(e,n)}_parse(e){const n=this._queryConstraints.map(s=>s._parse(e)).filter(s=>s.getFilters().length>0);return n.length===1?n[0]:mn.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(r,i){let o=r;const a=i.getFlattenedFilters();for(const c of a)Yg(o,c),o=Mc(o,c)}(e._query,n),new Vs(e.firestore,e.converter,Mc(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class du extends au{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new du(e,n)}_apply(e){const n=function(r,i,o){if(r.startAt!==null)throw new q(N.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(r.endAt!==null)throw new q(N.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ro(i,o)}(e._query,this._field,this._direction);return new Vs(e.firestore,e.converter,function(r,i){const o=r.explicitOrderBy.concat([i]);return new ui(r.path,r.collectionGroup,o,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}(e._query,n))}}function lT(t,e="asc"){const n=e,s=iu("orderBy",t);return du._create(s,n)}class uu extends au{constructor(e,n,s){super(),this.type=e,this._limit=n,this._limitType=s}static _create(e,n,s){return new uu(e,n,s)}_apply(e){return new Vs(e.firestore,e.converter,Fa(e._query,this._limit,this._limitType))}}function cT(t){return QE("limit",t),uu._create("limit",t,"F")}function Zf(t,e,n){if(typeof(n=Re(n))=="string"){if(n==="")throw new q(N.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!$m(e)&&n.indexOf("/")!==-1)throw new q(N.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const s=e.path.child(ke.fromString(n));if(!G.isDocumentKey(s))throw new q(N.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Ef(t,new G(s))}if(n instanceof Dt)return Ef(t,n._key);throw new q(N.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ul(n)}.`)}function ep(t,e){if(!Array.isArray(t)||t.length===0)throw new q(N.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Yg(t,e){const n=function(r,i){for(const o of r)for(const a of o.getFlattenedFilters())if(i.indexOf(a.op)>=0)return a.op;return null}(t.filters,function(r){switch(r){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new q(N.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new q(N.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class dT{convertValue(e,n="none"){switch(fr(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Oe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(hr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw Z()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const s={};return Er(e,(r,i)=>{s[r]=this.convertValue(i,n)}),s}convertVectorValue(e){var n,s,r;const i=(r=(s=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||s===void 0?void 0:s.values)===null||r===void 0?void 0:r.map(o=>Oe(o.doubleValue));return new Zd(i)}convertGeoPoint(e){return new Xd(Oe(e.latitude),Oe(e.longitude))}convertArray(e,n){return(e.values||[]).map(s=>this.convertValue(s,n))}convertServerTimestamp(e,n){switch(n){case"previous":const s=Rd(e);return s==null?null:this.convertValue(s,n);case"estimate":return this.convertTimestamp(to(e));default:return null}}convertTimestamp(e){const n=Ls(e);return new Ye(n.seconds,n.nanos)}convertDocumentKey(e,n){const s=ke.fromString(e);Te(dg(s));const r=new no(s.get(1),s.get(3)),i=new G(s.popFirst(5));return r.isEqual(n)||Xn(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hu(t,e,n){let s;return s=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vi{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Wg extends Hg{constructor(e,n,s,r,i,o){super(e,n,s,r,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new va(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const s=this._document.data.field(iu("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,n.serverTimestamps)}}}class va extends Wg{data(e={}){return super.data(e)}}class uT{constructor(e,n,s,r){this._firestore=e,this._userDataWriter=n,this._snapshot=r,this.metadata=new Vi(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(s=>{e.call(n,new va(this._firestore,this._userDataWriter,s.key,s,new Vi(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new q(N.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(r,i){if(r._snapshot.oldDocs.isEmpty()){let o=0;return r._snapshot.docChanges.map(a=>{const c=new va(r._firestore,r._userDataWriter,a.doc.key,a.doc,new Vi(r._snapshot.mutatedKeys.has(a.doc.key),r._snapshot.fromCache),r.query.converter);return a.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=r._snapshot.oldDocs;return r._snapshot.docChanges.filter(a=>i||a.type!==3).map(a=>{const c=new va(r._firestore,r._userDataWriter,a.doc.key,a.doc,new Vi(r._snapshot.mutatedKeys.has(a.doc.key),r._snapshot.fromCache),r.query.converter);let d=-1,u=-1;return a.type!==0&&(d=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),u=o.indexOf(a.doc.key)),{type:hT(a.type),doc:c,oldIndex:d,newIndex:u}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function hT(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Z()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fr(t){t=Zt(t,Dt);const e=Zt(t.firestore,zs);return GE(fl(e),t._key).then(n=>pT(e,t,n))}class Gg extends dT{constructor(e){super(),this.firestore=e}convertBytes(e){return new si(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Dt(this.firestore,null,n)}}function jg(t){t=Zt(t,Vs);const e=Zt(t.firestore,zs),n=fl(e),s=new Gg(e);return oT(t._query),jE(n,t._query).then(r=>new uT(e,s,t,r))}function gl(t,e,n){t=Zt(t,Dt);const s=Zt(t.firestore,zs),r=hu(t.converter,e,n);return Lo(s,[tu(Bo(s),"setDoc",t._key,r,t.converter!==null,n).toMutation(t._key,Bt.none())])}function fT(t,e,n,...s){t=Zt(t,Dt);const r=Zt(t.firestore,zs),i=Bo(r);let o;return o=typeof(e=Re(e))=="string"||e instanceof Mo?zg(i,"updateDoc",t._key,e,n,s):Vg(i,"updateDoc",t._key,e),Lo(r,[o.toMutation(t._key,Bt.exists(!0))])}function yl(t){return Lo(Zt(t.firestore,zs),[new ol(t._key,Bt.none())])}function Kg(t,e){const n=Zt(t.firestore,zs),s=it(t),r=hu(t.converter,e);return Lo(n,[tu(Bo(t.firestore),"addDoc",s._key,r,t.converter!==null,{}).toMutation(s._key,Bt.exists(!1))]).then(()=>s)}function Lo(t,e){return function(s,r){const i=new Gn;return s.asyncQueue.enqueueAndForget(async()=>NE(await WE(s),r,i)),i.promise}(fl(t),e)}function pT(t,e,n){const s=n.docs.get(e._key),r=new Gg(t);return new Wg(t,r,e._key,s,new Vi(n.hasPendingWrites,n.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mT{constructor(e,n){this._firestore=e,this._commitHandler=n,this._mutations=[],this._committed=!1,this._dataReader=Bo(e)}set(e,n,s){this._verifyNotCommitted();const r=uc(e,this._firestore),i=hu(r.converter,n,s),o=tu(this._dataReader,"WriteBatch.set",r._key,i,r.converter!==null,s);return this._mutations.push(o.toMutation(r._key,Bt.none())),this}update(e,n,s,...r){this._verifyNotCommitted();const i=uc(e,this._firestore);let o;return o=typeof(n=Re(n))=="string"||n instanceof Mo?zg(this._dataReader,"WriteBatch.update",i._key,n,s,r):Vg(this._dataReader,"WriteBatch.update",i._key,n),this._mutations.push(o.toMutation(i._key,Bt.exists(!0))),this}delete(e){this._verifyNotCommitted();const n=uc(e,this._firestore);return this._mutations=this._mutations.concat(new ol(n._key,Bt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new q(N.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function uc(t,e){if((t=Re(t)).firestore!==e)throw new q(N.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return t}function vl(){return new nu("serverTimestamp")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qg(t){return fl(t=Zt(t,zs)),new mT(t,e=>Lo(t,e))}(function(e,n=!0){(function(r){di=r})(li),Kr(new lr("firestore",(s,{instanceIdentifier:r,options:i})=>{const o=s.getProvider("app").getImmediate(),a=new zs(new p2(s.getProvider("auth-internal")),new v2(s.getProvider("app-check-internal")),function(d,u){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new q(N.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new no(d.options.projectId,u)}(o,r),o);return i=Object.assign({useFetchStreams:n},i),a._setSettings(i),a},"PUBLIC").setMultipleInstances(!0)),Ps(gf,"4.7.3",e),Ps(gf,"4.7.3","esm2017")})();const Jg={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"};function Be(){return Jg.apiKey!=="YOUR_API_KEY"}let hc=null,It=null,Ee=null;try{Be()?(hc=zp(Jg),It=d2(hc),Ee=XE(hc)):console.warn("Firebase not configured. Login required to save data.")}catch(t){console.error("Firebase initialization error:",t)}const gT=new Un;let Tt=null,Gi=[];function yT(){if(!Be()||!It){console.warn("Firebase not configured - auth disabled");return}Jb(It,t=>{console.log("onAuthStateChanged fired:",t?t.email:"null"),Tt=t,console.log("Notifying",Gi.length,"listeners"),Gi.forEach(e=>e(t))})}function Xg(t){return console.log("onAuthStateChange: adding listener, currentUser is:",Tt&&Tt.email),Gi.push(t),Tt&&(console.log("onAuthStateChange: immediately calling listener with user"),t(Tt)),()=>{Gi=Gi.filter(e=>e!==t)}}function An(){return Tt}function ut(){return Tt!==null}async function vT(t,e,n=null){if(!Be()||!It)throw new Error("Firebase not configured");const s=await Yb(It,t,e);n&&s.user&&await jb(s.user,{displayName:n});try{await fm(s.user)}catch(r){console.error("Failed to send verification email:",r)}return s}async function bT(){if(!Be()||!It||!Tt)throw new Error("Not logged in");return fm(Tt)}async function wT(){return Tt?(await Tt.reload(),Tt=It.currentUser,Tt):null}async function ET(t,e){if(!Be()||!It)throw new Error("Firebase not configured");return Wb(It,t,e)}async function TT(){if(!Be()||!It)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const t=await bw(It,gT);return console.log("Google sign-in successful:",t.user.email),t}catch(t){throw console.error("signInWithPopup error:",t.code,t.message),t}}async function fu(){if(!Be()||!It)throw new Error("Firebase not configured");return Xb(It)}async function _T(t){if(!Be()||!It)throw new Error("Firebase not configured");return Hb(It,t)}async function IT(){if(!Be()||!It||!Tt)throw new Error("Not logged in");return Zb(Tt)}yT();function Br(...t){return t.find(e=>e!==void 0)}function ST(t){if(!t||typeof t!="object")return{scenario:t,migrated:!1};const e=Object.keys(t).filter(c=>c.includes(".")),n="decisionSettings"in t||"stressSettings"in t||"name"in t||"description"in t||"taxYears"in t;if(!(e.length>0||n))return{scenario:t,migrated:!1};const r=t.decisionTool||{},i=t.stressTool||{},o=t.planDetails||{},a={isActive:t.isActive??!1,enabledTools:t.enabledTools||["stress","decision"],planDetails:{name:Br(t["planDetails.name"],o.name,t.name)??"My Plan",description:Br(t["planDetails.description"],o.description,t.description)??""},decisionTool:{settings:Br(t["decisionTool.settings"],r.settings,t.decisionSettings)??{},history:Br(t["decisionTool.history"],r.history)??[],taxYears:Br(t["decisionTool.taxYears"],r.taxYears,t.taxYears)??{}},stressTool:{settings:Br(t["stressTool.settings"],i.settings,t.stressSettings)??{}}};return t.id!==void 0&&(a.id=t.id),t.createdAt!==void 0&&(a.createdAt=t.createdAt),t.lastModified!==void 0&&(a.lastModified=t.lastModified),{scenario:a,migrated:!0}}function pu(t,e="settings"){const n=An();return!n||!Ee?null:it(Ee,"users",n.uid,t,e)}function Zg(t){const e=An();return!e||!Ee?null:Jd(Ee,"users",e.uid,t)}async function e0(t){const{scenario:e,migrated:n}=ST(t);if(n){const s=An();if(s&&Ee)try{const{id:r,...i}=e;await gl(it(Ee,"users",s.uid,"scenarios",r),i)}catch(r){console.error("Scenario migration write failed:",r)}}return e}async function bl(){if(!Be())return[];const t=Zg("scenarios");if(!t)return[];try{const e=await jg(t),n=[];return e.forEach(s=>{n.push({id:s.id,...s.data()})}),Promise.all(n.map(s=>e0(s)))}catch(e){return console.error("Error loading scenarios:",e),[]}}async function xT(t){if(!Be())return null;const e=pu("scenarios",t);if(!e)return null;try{const n=await Fr(e);return n.exists()?e0({id:n.id,...n.data()}):null}catch(n){return console.error("Error loading scenario:",n),null}}async function en(t,e){if(!Be())return;const n=pu("scenarios",t);if(n)try{await fT(n,{...e,lastModified:new Date().toISOString()})}catch(s){throw console.error("Error saving scenario:",s),s}}async function t0(t){if(!Be())return null;const e=Zg("scenarios");if(!e)return null;try{return(await Kg(e,{...t,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(n){throw console.error("Error creating scenario:",n),n}}async function AT(t){if(!Be())return;const e=pu("scenarios",t);if(e)try{await yl(e)}catch(n){throw console.error("Error deleting scenario:",n),n}}async function mu(t){if(!Be())return;const e=An();if(!(!e||!Ee))try{const n=await bl(),s=Qg(Ee);for(const r of n){const i=it(Ee,"users",e.uid,"scenarios",r.id);r.id===t?s.update(i,{isActive:!0}):r.isActive&&s.update(i,{isActive:!1})}await s.commit()}catch(n){throw console.error("Error setting active scenario:",n),n}}async function n0(){if(!Be())return;const t=An();if(!(!t||!Ee))try{const e=await bl(),n=Qg(Ee);for(const s of e)n.delete(it(Ee,"users",t.uid,"scenarios",s.id));n.delete(it(Ee,"users",t.uid,"profile","settings")),await n.commit(),console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function s0(){return Be()?(await bl()).length>0:!1}function jn(t,e,n,s,r){if(r){const i=Math.max(0,1-e/n);return t*s*i}return t*s}const es={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,cash:.25},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.4,cash:.1},adventurous:{key:"adventurous",label:"Adventurous",equity:.7,bond:.25,cash:.05}};function wl(t,e,n){if(!t)return null;const s=Math.max(5,n-20),r=Math.min(1,e/s);return t.start+(t.end-t.start)*r}function gu(t,e,n=.22){const s=t+e;if(s<=0)return{start:0,end:0};const r=t/s;return{start:Math.max(0,r-n),end:r}}const kT=.12;function r0(t,e,n=null,s=kT){const r=t+e;if(r<=0)return{start:0,end:0};const i=t/r;let o;return n&&n.equityPct+n.bondPct>0?o=n.equityPct/(n.equityPct+n.bondPct):o=Math.min(1,i+s),{start:i,end:o}}function yu(t){const e=!!(t.subAsset&&t.subAsset.bondWeights&&Object.keys(t.subAsset.bondWeights).length>0),n=t.glideEndgame&&t.glideEndgame.equityPct+t.glideEndgame.bondPct>0?t.glideEndgame:null;return e?r0(t.equityMin,t.bondMin,n):gu(t.equityMin,t.bondMin)}function tp(t,e,n){const s=t.cash,r=Math.max(0,1-s),i=wl(t.equityGlide,e,n);return i==null?{equity:t.equity,bond:t.bond,cash:s}:{equity:r*i,bond:r*(1-i),cash:s}}function CT(t,e,n){const s=jn(t.equityMin,e,t.duration,n,!0),r=jn(t.bondMin,e,t.duration,n,!0),i=jn(t.cashTarget,e,t.duration,n,!1);return{equity:s,bond:r,cash:i,totalGrowth:s+r,total:s+r+i}}function i0(t,e=Pp.ASSUMED_CPI){const n=[],s=t.equityGlideEnabled?yu(t):null,r=t.diversifierStart||0,i=t.hodlEnabled&&t.hodlValue||0;for(let o=0;o<=t.duration;o++){const a=Math.pow(1+e,o),c=CT(t,o,a);let d=c.equity,u=c.bond;if(s){const p=wl(s,o,t.duration),f=d+u;d=f*p,u=f*(1-p)}n.push({year:o,cumulativeInflation:a,equityMin:d,bondMin:u,cashTarget:c.cash,diversifier:r,hodl:i,equityShareOfPot:d+u+c.cash+r>0?d/(d+u+c.cash+r):0,totalMin:d+u+c.cash+r+i})}return n}function ba(t,e,n,s=Xe.HIGHER_RATE_LIMIT){if(t<=0)return 0;let r=e;if(t>Xe.PA_TAPER_THRESHOLD){const u=(t-Xe.PA_TAPER_THRESHOLD)*Xe.PA_TAPER_RATE;r=Math.max(0,e-u)}const i=Math.max(0,t-r),o=Math.max(0,n-r),a=s-n;let c=0;const d=Math.min(i,o);if(c+=d*Xe.BASIC_RATE,i>o){const u=Math.min(i-o,a);c+=u*Xe.HIGHER_RATE}if(i>o+a){const u=i-o-a;c+=u*Xe.ADDITIONAL_RATE}return c}function qt(t,e,n,s=Xe.HIGHER_RATE_LIMIT){return t-ba(t,e,n,s)}function PT(t,e,n,s=Xe.HIGHER_RATE_LIMIT){if(t<=0)return 0;let r=t,i=t+1;for(;qt(i,e,n,s)<t&&i<1e12;)i*=2;for(let o=0;o<60;o++){const a=(r+i)/2;qt(a,e,n,s)<t?r=a:i=a}return(r+i)/2}const fc={TAX_EFFICIENT:"minimiseEarlyTax",LONGEVITY:"maximiseLongevity"};function RT(t,e){return t<=0?t:t*Math.pow(1+e,1/12)}function lo({targetGross:t,fixedIncome:e=0,pa:n,brl:s,hrl:r,isaBalance:i=0,strategy:o=fc.TAX_EFFICIENT,yearsUntilSp:a=0,taxFreeFraction:c=0}){const d=Math.max(0,Math.min(.75,c||0));if(d===0){const x=qt(t,n,s,r),A=Math.max(0,Math.min(s,t)-e),_=qt(A+e,n,s,r),W=Math.max(0,x-_),ee=o===fc.LONGEVITY&&a>0?i/a:1/0,H=Math.max(0,Math.min(W,Math.max(0,i),ee)),re=i-H,te=W-H;let ye=A;if(te>0){const ie=PT(_+te,n,s,r);ye=Math.max(A,ie-e)}const he=ye+e,ft=qt(he,n,s,r);return{sippGross:ye,isaDraw:H,remainingIsa:re,taxable:he,tax:he-ft,net:ft+H,taxFree:0}}const u=qt(t,n,s,r),p=qt(e,n,s,r),f=x=>x*d/(1-d)+qt(e+x,n,s,r)-p,g=x=>{if(x<=0)return 0;let A=0,_=Math.max(1e3,x*(1-d)*1.5);for(;f(_)<x&&_<1e12;)_*=2;for(let W=0;W<80;W++){const ee=(A+_)/2;f(ee)<x?A=ee:_=ee}return(A+_)/2},v=Math.max(0,s-e),y=g(Math.max(0,u-p)),E=Math.min(v,y),C=p+f(E),k=Math.max(0,u-C),P=o===fc.LONGEVITY&&a>0?i/a:1/0,R=Math.max(0,Math.min(k,Math.max(0,i),P)),B=i-R,D=k-R;let I=E;D>0&&(I=g(Math.max(0,u-p-R)));const w=I/(1-d),S=I+e,T=qt(S,n,s,r);return{sippGross:w,isaDraw:R,remainingIsa:B,taxable:S,tax:S-T,net:T+w*d+R,taxFree:w*d}}const Ha={CONSECUTIVE_LIMIT:3,RECOVERY_BUFFER:be.RECOVERY_BUFFER};function o0({totalGrowth:t,minGrowth:e,consecCashDraws:n,wasInProtection:s,consecutiveLimit:r=Ha.CONSECUTIVE_LIMIT,recoveryBuffer:i=Ha.RECOVERY_BUFFER}){let o=!1;return s&&(o=t<=e+i),!o&&t<e&&n+1>=r&&(o=!0),o}const MT=12;function $c(t,e){const n=e??.8;return t<MT?1-(1-n)/2:n}const Hr={MAX_FRACTION:.5,MIN_BOOST:50,SURPLUS_BUFFER:15e3};function wa({shortfall:t,standardMonthly:e,remainingMonths:n,surplus:s,brlHeadroom:r=1/0,maxFraction:i=Hr.MAX_FRACTION,minBoost:o=Hr.MIN_BOOST}){if(!(t>0)||!(s>0)||n<1)return 0;const a=[t/n,s/n];if(Number.isFinite(r)){if(r<=0)return 0;a.push(r/n)}a.push(e*i);const c=Math.min(...a);return c>o?c:0}const vu={ISA_ANNUAL_ALLOWANCE:2e4,MIN_RECYCLE:50};function a0({brlHeadroom:t,remainingMonths:e,isaAllowanceLeft:n,basicRate:s=.2}){if(!(t>0)||!(e>=1)||!(n>0))return{gross:0,net:0};let r=t/e,i=r*(1-s);const o=n/e;return i>o&&(i=o,r=i/(1-s)),i<vu.MIN_RECYCLE?{gross:0,net:0}:{gross:r,net:i}}const pc={REPLENISH_GATE:5e3,REPLENISH_SHORTFALL_FRAC:.3,REPLENISH_SURPLUS_FRAC:.5};function l0(t){const e=t.diversifier||0,n=t.hodl||0,s={fromEquity:0,fromBond:0,fromCash:0,fromDiversifier:0,fromHodl:0,shortfall:0,replenish:0,source:"Cash",reason:""};let r=t.draw;const i=Math.max(0,t.equity-t.eqMin),o=Math.max(0,t.bond-t.bdMin),a=i+o;if(!t.inProtection&&a>0){const p=Math.min(r,a);if(s.fromEquity=p*i/a,s.fromBond=p*o/a,r-=p,r<=1e-9){s.source="Growth",s.reason="Healthy";const f=t.csTarget-t.cash,g=a-p;return f>0&&g>pc.REPLENISH_GATE&&(s.replenish=Math.min(f*pc.REPLENISH_SHORTFALL_FRAC,g*pc.REPLENISH_SURPLUS_FRAC)),s}}const c=Math.min(r,t.cash);if(s.fromCash=c,r-=c,r>1e-9){const p=[{key:"fromDiversifier",value:e,target:t.diversifierTarget||e||1},{key:"fromBond",value:Math.max(0,t.bond-s.fromBond),target:Math.max(1,t.bdMin)},{key:"fromEquity",value:Math.max(0,t.equity-s.fromEquity),target:Math.max(1,t.eqMin)}].filter(f=>f.value>0).sort((f,g)=>g.value/g.target-f.value/f.target);for(const f of p){if(r<=1e-9)break;const g=Math.min(r,f.value);s[f.key]+=g,r-=g}if(r>1e-9&&n>0){const f=Math.min(r,n);s.fromHodl=f,r-=f}s.shortfall=Math.max(0,r)}const d=s.fromEquity+s.fromBond>1e-9,u=s.fromCash+s.fromDiversifier+s.fromHodl>1e-9||s.shortfall>0;return!t.inProtection&&a>0&&d&&u?(s.source="Mixed",s.reason="Growth surplus part-funds; the rest cascades"):s.fromHodl>0?(s.source="HODL",s.reason="Break glass"):s.fromDiversifier>0?(s.source=s.fromCash>0?"Cash + Diversifier":"Diversifier",s.reason=t.inProtection?"Protection":"Below min"):d?(s.source=s.fromBond>=s.fromEquity?"Bond":"Equity",s.reason="Cash exhausted — least-depressed sleeve pays"):(s.source="Cash",s.reason=t.inProtection?"Protection":a<=0?"Below min":"At min"),s}const BT=[[{ticker:"ATST",name:"Alliance Trust",subClass:"worldGrowth"},{ticker:"ATT",name:"Allianz Technology Trust",subClass:"worldGrowth"},{ticker:"BGFD",name:"Baillie Gifford Japan Trust",subClass:"worldGrowth"},{ticker:"BNKR",name:"Bankers Investment Trust",subClass:"worldGrowth"},{ticker:"BUT",name:"Brunner Investment Trust",subClass:"worldGrowth"},{ticker:"CLDN",name:"Caledonia Investments",subClass:"worldGrowth"},{ticker:"CSP1",name:"iShares Core S&P 500 (Acc)",subClass:"worldGrowth"},{ticker:"CUKX",name:"iShares Core FTSE 100 (Acc)",subClass:"ukEquityIncome"},{ticker:"EQQQ",name:"Invesco Nasdaq-100",subClass:"worldGrowth"},{ticker:"FCIT",name:"F&C Investment Trust",subClass:"worldGrowth"},{ticker:"FWRA",name:"Invesco FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"FWRG",name:"Invesco FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"GSPX",name:"iShares S&P 500 GBP-Hedged",subClass:"worldGrowth"},{ticker:"HGT",name:"HgCapital Trust",subClass:"worldGrowth"},{ticker:"HMWO",name:"HSBC MSCI World",subClass:"worldGrowth"},{ticker:"HVPE",name:"HarbourVest Global Private Equity",subClass:"worldGrowth"},{ticker:"IBT",name:"International Biotechnology Trust",subClass:"worldGrowth"},{ticker:"IITU",name:"iShares S&P 500 Information Technology",subClass:"worldGrowth"},{ticker:"IMEU",name:"iShares Core MSCI Europe",subClass:"worldGrowth"},{ticker:"INRG",name:"iShares Global Clean Energy",subClass:"worldGrowth"},{ticker:"ISAC",name:"iShares MSCI ACWI (Acc)",subClass:"worldGrowth"},{ticker:"IUHC",name:"iShares S&P 500 Health Care",subClass:"worldGrowth"},{ticker:"IUSA",name:"iShares Core S&P 500 (Dist)",subClass:"worldGrowth"},{ticker:"IWDA",name:"iShares Core MSCI World (Acc, USD line)",subClass:"worldGrowth"},{ticker:"IWDG",name:"iShares Core MSCI World GBP-Hedged",subClass:"worldGrowth"},{ticker:"IJPN",name:"iShares MSCI Japan",subClass:"worldGrowth"},{ticker:"JAM",name:"JPMorgan American Investment Trust",subClass:"worldGrowth"},{ticker:"LCWL",name:"Amundi (Lyxor) Core MSCI World",subClass:"worldGrowth"},{ticker:"MNKS",name:"Monks Investment Trust",subClass:"worldGrowth"},{ticker:"MWY",name:"Mid Wynd International",subClass:"worldGrowth"},{ticker:"PACW",name:"Amundi Prime All Country World",subClass:"worldGrowth"},{ticker:"PCT",name:"Polar Capital Technology Trust",subClass:"worldGrowth"},{ticker:"PIN",name:"Pantheon International",subClass:"worldGrowth"},{ticker:"RCP",name:"RIT Capital Partners",subClass:"worldGrowth"},{ticker:"SJG",name:"Schroder Japan Trust",subClass:"worldGrowth"},{ticker:"SMT",name:"Scottish Mortgage Investment Trust",subClass:"worldGrowth"},{ticker:"SSAC",name:"iShares MSCI ACWI",subClass:"worldGrowth"},{ticker:"SWDA",name:"iShares Core MSCI World",subClass:"worldGrowth"},{ticker:"SWLD",name:"SPDR MSCI World",subClass:"worldGrowth"},{ticker:"VAPX",name:"Vanguard FTSE Dev Asia Pacific ex-Japan",subClass:"worldGrowth"},{ticker:"VERX",name:"Vanguard FTSE Developed Europe ex-UK",subClass:"worldGrowth"},{ticker:"VEUR",name:"Vanguard FTSE Developed Europe",subClass:"worldGrowth"},{ticker:"VEVE",name:"Vanguard FTSE Developed World (Dist)",subClass:"worldGrowth"},{ticker:"VHVG",name:"Vanguard FTSE Developed World (Acc)",subClass:"worldGrowth"},{ticker:"VJPN",name:"Vanguard FTSE Japan",subClass:"worldGrowth"},{ticker:"VNRT",name:"Vanguard FTSE North America",subClass:"worldGrowth"},{ticker:"VUAG",name:"Vanguard S&P 500 (Acc)",subClass:"worldGrowth"},{ticker:"VUSA",name:"Vanguard S&P 500 (Dist)",subClass:"worldGrowth"},{ticker:"VWRL",name:"Vanguard FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"VWRP",name:"Vanguard FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"WTAN",name:"Witan Investment Trust",subClass:"worldGrowth"},{ticker:"WWH",name:"Worldwide Healthcare Trust",subClass:"worldGrowth"}],[{ticker:"3IN",name:"3i Infrastructure",subClass:"ukEquityIncome"},{ticker:"AEI",name:"abrdn Equity Income Trust",subClass:"ukEquityIncome"},{ticker:"BBGI",name:"BBGI Global Infrastructure",subClass:"ukEquityIncome"},{ticker:"BSIF",name:"Bluefield Solar Income Fund",subClass:"ukEquityIncome"},{ticker:"CTY",name:"City of London Investment Trust",subClass:"ukEquityIncome"},{ticker:"DIG",name:"Dunedin Income Growth",subClass:"ukEquityIncome"},{ticker:"EDIN",name:"Edinburgh Investment Trust",subClass:"ukEquityIncome"},{ticker:"FGT",name:"Finsbury Growth & Income Trust",subClass:"ukEquityIncome"},{ticker:"FSFL",name:"Foresight Solar Fund",subClass:"ukEquityIncome"},{ticker:"FTAL",name:"SPDR FTSE UK All Share",subClass:"ukEquityIncome"},{ticker:"GRID",name:"Gresham House Energy Storage",subClass:"ukEquityIncome"},{ticker:"GSF",name:"Gore Street Energy Storage",subClass:"ukEquityIncome"},{ticker:"HHI",name:"Henderson High Income Trust",subClass:"ukEquityIncome"},{ticker:"HICL",name:"HICL Infrastructure",subClass:"ukEquityIncome"},{ticker:"HUKX",name:"HSBC FTSE 100",subClass:"ukEquityIncome"},{ticker:"INPP",name:"International Public Partnerships",subClass:"ukEquityIncome"},{ticker:"ISF",name:"iShares Core FTSE 100 (Dist)",subClass:"ukEquityIncome"},{ticker:"IUKD",name:"iShares UK Dividend",subClass:"ukEquityIncome"},{ticker:"JCH",name:"JPMorgan Claverhouse",subClass:"ukEquityIncome"},{ticker:"JLEN",name:"JLEN Environmental Assets",subClass:"ukEquityIncome"},{ticker:"LWDB",name:"Law Debenture Corporation",subClass:"ukEquityIncome"},{ticker:"MRCH",name:"Merchants Trust",subClass:"ukEquityIncome"},{ticker:"MUT",name:"Murray Income Trust",subClass:"ukEquityIncome"},{ticker:"NESF",name:"NextEnergy Solar Fund",subClass:"ukEquityIncome"},{ticker:"ORIT",name:"Octopus Renewables Infrastructure",subClass:"ukEquityIncome"},{ticker:"SEIT",name:"SDCL Energy Efficiency Income",subClass:"ukEquityIncome"},{ticker:"SHRS",name:"Shires Income",subClass:"ukEquityIncome"},{ticker:"TIGT",name:"Troy Income & Growth Trust",subClass:"ukEquityIncome"},{ticker:"TMPL",name:"Temple Bar Investment Trust",subClass:"ukEquityIncome"},{ticker:"TRIG",name:"The Renewables Infrastructure Group",subClass:"ukEquityIncome"},{ticker:"UKDV",name:"SPDR UK Dividend Aristocrats",subClass:"ukEquityIncome"},{ticker:"UKW",name:"Greencoat UK Wind",subClass:"ukEquityIncome"},{ticker:"VMID",name:"Vanguard FTSE 250",subClass:"ukEquityIncome"},{ticker:"VUKE",name:"Vanguard FTSE 100",subClass:"ukEquityIncome"}],[{ticker:"GBDV",name:"SPDR Global Dividend Aristocrats",subClass:"globalEquityIncome"},{ticker:"HFEL",name:"Henderson Far East Income",subClass:"globalEquityIncome"},{ticker:"IAPD",name:"iShares Asia Pacific Dividend",subClass:"globalEquityIncome"},{ticker:"IDVY",name:"iShares Euro Dividend",subClass:"globalEquityIncome"},{ticker:"JGGI",name:"JPMorgan Global Growth & Income",subClass:"globalEquityIncome"},{ticker:"MYI",name:"Murray International Trust",subClass:"globalEquityIncome"},{ticker:"SAIN",name:"Scottish American Investment Co",subClass:"globalEquityIncome"},{ticker:"STS",name:"STS Global Income & Growth (Troy)",subClass:"globalEquityIncome"},{ticker:"USDV",name:"SPDR US Dividend Aristocrats",subClass:"globalEquityIncome"},{ticker:"VHYL",name:"Vanguard FTSE All-World High Div Yield",subClass:"globalEquityIncome"}],[{ticker:"BBOX",name:"Tritax Big Box REIT",subClass:"reit"},{ticker:"BLND",name:"British Land",subClass:"reit"},{ticker:"BYG",name:"Big Yellow Group",subClass:"reit"},{ticker:"DLN",name:"Derwent London",subClass:"reit"},{ticker:"IHR",name:"Impact Healthcare REIT",subClass:"reit"},{ticker:"IUKP",name:"iShares UK Property",subClass:"reit"},{ticker:"IWDP",name:"iShares Developed Markets Property Yield",subClass:"reit"},{ticker:"LAND",name:"Land Securities (Landsec)",subClass:"reit"},{ticker:"LMP",name:"LondonMetric Property",subClass:"reit"},{ticker:"PHP",name:"Primary Health Properties",subClass:"reit"},{ticker:"SAFE",name:"Safestore Holdings",subClass:"reit"},{ticker:"SGRO",name:"Segro",subClass:"reit"},{ticker:"SHED",name:"Urban Logistics REIT",subClass:"reit"},{ticker:"SRE",name:"Sirius Real Estate",subClass:"reit"},{ticker:"SUPR",name:"Supermarket Income REIT",subClass:"reit"},{ticker:"THRL",name:"Target Healthcare REIT",subClass:"reit"},{ticker:"TRY",name:"TR Property Investment Trust",subClass:"reit"},{ticker:"UTG",name:"Unite Group",subClass:"reit"},{ticker:"WHR",name:"Warehouse REIT",subClass:"reit"}],[{ticker:"AAS",name:"abrdn Asia Focus",subClass:"emEquity"},{ticker:"EMIM",name:"iShares Core MSCI EM IMI",subClass:"emEquity"},{ticker:"FCSS",name:"Fidelity China Special Situations",subClass:"emEquity"},{ticker:"FEML",name:"Fidelity Emerging Markets Limited",subClass:"emEquity"},{ticker:"HMEF",name:"HSBC MSCI Emerging Markets",subClass:"emEquity"},{ticker:"JII",name:"JPMorgan Indian Investment Trust",subClass:"emEquity"},{ticker:"JMG",name:"JPMorgan Emerging Markets",subClass:"emEquity"},{ticker:"SEMA",name:"SPDR MSCI Emerging Markets",subClass:"emEquity"},{ticker:"TEM",name:"Templeton Emerging Markets",subClass:"emEquity"},{ticker:"VEIL",name:"Vietnam Enterprise Investments",subClass:"emEquity"},{ticker:"VFEG",name:"Vanguard FTSE Emerging Markets (Acc)",subClass:"emEquity"},{ticker:"VFEM",name:"Vanguard FTSE Emerging Markets (Dist)",subClass:"emEquity"},{ticker:"VOF",name:"VinaCapital Vietnam Opportunity",subClass:"emEquity"}],[{ticker:"ASL",name:"Aberforth Smaller Companies",subClass:"globalSmallCap"},{ticker:"BRSC",name:"BlackRock Smaller Companies",subClass:"globalSmallCap"},{ticker:"EWI",name:"Edinburgh Worldwide",subClass:"globalSmallCap"},{ticker:"HSL",name:"Henderson Smaller Companies",subClass:"globalSmallCap"},{ticker:"ISP6",name:"iShares S&P SmallCap 600",subClass:"globalSmallCap"},{ticker:"MTU",name:"Montanaro UK Smaller Companies",subClass:"globalSmallCap"},{ticker:"SSON",name:"Smithson Investment Trust",subClass:"globalSmallCap"},{ticker:"THRG",name:"BlackRock Throgmorton Trust",subClass:"globalSmallCap"},{ticker:"USSC",name:"SPDR MSCI USA Small Cap Value Weighted",subClass:"globalSmallCap"},{ticker:"WLDS",name:"iShares MSCI World Small Cap",subClass:"globalSmallCap"},{ticker:"WOSC",name:"SPDR MSCI World Small Cap",subClass:"globalSmallCap"}],[{ticker:"AGBP",name:"iShares Core Global Agg GBP-Hedged",subClass:"globalAggHedged"},{ticker:"GLTL",name:"SPDR Bloomberg 15+ Year Gilt",subClass:"longGilts"},{ticker:"GLTS",name:"SPDR Bloomberg 1-5 Year Gilt",subClass:"shortGilts"},{ticker:"IBTL",name:"iShares $ Treasury 20+yr",subClass:"usTreasHedged"},{ticker:"IBTM",name:"iShares $ Treasury 7-10yr",subClass:"usTreasHedged"},{ticker:"IBTS",name:"iShares $ Treasury 1-3yr",subClass:"usTreasHedged"},{ticker:"IDTG",name:"iShares $ Treasury 7-10yr GBP-Hedged",subClass:"usTreasHedged"},{ticker:"IGLS",name:"iShares UK Gilts 0-5yr",subClass:"shortGilts"},{ticker:"IGLT",name:"iShares Core UK Gilts",subClass:"longGilts"},{ticker:"INXG",name:"iShares £ Index-Linked Gilts",subClass:"indexLinked"},{ticker:"IS15",name:"iShares £ Corp Bond 0-5yr",subClass:"corporateIG"},{ticker:"ITPS",name:"iShares $ TIPS",subClass:"indexLinked"},{ticker:"SLXX",name:"iShares Core £ Corp Bond",subClass:"corporateIG"},{ticker:"TI5G",name:"iShares $ TIPS 0-5 (GBP-Hedged)",subClass:"indexLinked"},{ticker:"VAGP",name:"Vanguard Global Aggregate (GBP-Hedged, Dist)",subClass:"globalAggHedged"},{ticker:"VAGS",name:"Vanguard Global Aggregate (GBP-Hedged, Acc)",subClass:"globalAggHedged"},{ticker:"VGOV",name:"Vanguard UK Gilt",subClass:"longGilts"},{ticker:"VUTY",name:"Vanguard USD Treasury Bond",subClass:"usTreasHedged"}],[{ticker:"BIPS",name:"Invesco Bond Income Plus",subClass:"highYield"},{ticker:"GHYS",name:"iShares Global High Yield GBP-Hedged",subClass:"highYield"},{ticker:"IHYG",name:"iShares € High Yield Corp Bond",subClass:"highYield"},{ticker:"IHYU",name:"iShares $ High Yield Corp Bond",subClass:"highYield"},{ticker:"NCYF",name:"CQS New City High Yield",subClass:"highYield"}],[{ticker:"GCP",name:"GCP Infrastructure Investments",subClass:"infraDebt"},{ticker:"SEQI",name:"Sequoia Economic Infrastructure",subClass:"infraDebt"}],[{ticker:"CSH2",name:"Amundi Smart Overnight Return",subClass:"moneyMarket"},{ticker:"ERNS",name:"iShares £ Ultrashort Bond",subClass:"moneyMarket"},{ticker:"XSTR",name:"Xtrackers II Sterling Overnight Rate",subClass:"moneyMarket"}],[{ticker:"PHAU",name:"WisdomTree Physical Gold (USD)",subClass:"gold"},{ticker:"PHGP",name:"WisdomTree Physical Gold (GBP)",subClass:"gold"},{ticker:"RMAU",name:"Royal Mint Physical Gold",subClass:"gold"},{ticker:"SGLD",name:"Invesco Physical Gold",subClass:"gold"},{ticker:"SGLN",name:"iShares Physical Gold",subClass:"gold"}],[{ticker:"BHMG",name:"BH Macro",subClass:"trendMacro"},{ticker:"CGT",name:"Capital Gearing Trust",subClass:"trendMacro"},{ticker:"PNL",name:"Personal Assets Trust",subClass:"trendMacro"},{ticker:"RICA",name:"Ruffer Investment Company",subClass:"trendMacro"}],[{ticker:"AIGC",name:"WisdomTree Broad Commodities",subClass:"commodities"},{ticker:"BRNT",name:"WisdomTree Brent Crude Oil",subClass:"commodities"},{ticker:"CMOD",name:"Invesco Bloomberg Commodity",subClass:"commodities"},{ticker:"COPA",name:"WisdomTree Copper",subClass:"commodities"},{ticker:"CRUD",name:"WisdomTree WTI Crude Oil",subClass:"commodities"},{ticker:"PHSP",name:"WisdomTree Physical Silver (GBP)",subClass:"commodities"},{ticker:"WCOA",name:"WisdomTree Enhanced Commodity (USD)",subClass:"commodities"}]],bu=Object.freeze(BT.flat().sort((t,e)=>t.ticker.localeCompare(e.ticker))),we=Object.freeze({SHARES:"shares",BONDS:"bonds",DIVERSIFIERS:"diversifiers",CASH:"cash"}),zt={ukEquityIncome:{bucket:we.SHARES,label:"UK equity income",nominalReturn:.068,yield:.04,vol:.16,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.07},globalEquityIncome:{bucket:we.SHARES,label:"Global equity income",nominalReturn:.07,yield:.03,vol:.16,eqCorr:.95,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.05},worldGrowth:{bucket:we.SHARES,label:"World growth / tracker",nominalReturn:.07,yield:.02,vol:.17,eqCorr:1,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},reit:{bucket:we.SHARES,label:"Property / REITs",nominalReturn:.065,yield:.045,vol:.19,eqCorr:.65,duration:4,inflationBeta:.3,creditBeta:.2,crisisBeta:0,idioVol:.13,note:"listed property: equity-like with rate sensitivity; rents partly inflation-linked"},emEquity:{bucket:we.SHARES,label:"Emerging-markets equity",nominalReturn:.075,yield:.028,vol:.22,eqCorr:.8,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.13},globalSmallCap:{bucket:we.SHARES,label:"Global smaller companies",nominalReturn:.075,yield:.018,vol:.2,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.09},shortGilts:{bucket:we.BONDS,label:"Short gilts 0-5y (buffer)",nominalReturn:.043,yield:.043,vol:.026,eqCorr:.1,duration:2.5,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.01},longGilts:{bucket:we.BONDS,label:"Long gilts 15y+",nominalReturn:.064,yield:.055,vol:.108,eqCorr:.2,duration:15,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.02},indexLinked:{bucket:we.BONDS,label:"Index-linked gilts (long)",nominalReturn:.047,yieldReal:.023,vol:.1,eqCorr:.33,duration:15,inflationBeta:1,creditBeta:0,crisisBeta:0,idioVol:.03,realYield:!0},corporateIG:{bucket:we.BONDS,label:"£ IG corporate",nominalReturn:.053,yield:.052,vol:.065,eqCorr:.41,duration:6.5,inflationBeta:0,creditBeta:.4,crisisBeta:0,idioVol:.03},globalAggHedged:{bucket:we.BONDS,label:"Global-agg £-hedged",nominalReturn:.045,yield:.045,vol:.053,eqCorr:.3,duration:6,inflationBeta:0,creditBeta:.2,crisisBeta:0,idioVol:.02},usTreasHedged:{bucket:we.BONDS,label:"US treasuries £-hedged",nominalReturn:.04,yield:.04,vol:.068,eqCorr:.1,duration:7,inflationBeta:0,creditBeta:0,crisisBeta:.15,idioVol:.02},infraDebt:{bucket:we.BONDS,label:"Infrastructure debt",nominalReturn:.064,yield:.06,vol:.07,eqCorr:.3,duration:8,inflationBeta:.3,creditBeta:.3,crisisBeta:0,idioVol:.03,note:"IG + ~115bps illiquidity premium"},highYield:{bucket:we.BONDS,label:"Global high-yield (£-hedged)",nominalReturn:.058,yield:.065,vol:.1,eqCorr:.6,duration:3.5,inflationBeta:0,creditBeta:.8,crisisBeta:0,idioVol:.05,note:"credit carry net of defaults; spreads blow out with equities in a crash"},moneyMarket:{bucket:we.CASH,label:"Money-market fund",nominalReturn:.034,yield:.034,vol:.002,eqCorr:0,duration:.1,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0,note:"FCA -1% real; = engine cash model"},savings:{bucket:we.CASH,label:"Savings / NS&I",nominalReturn:.034,yield:.034,vol:.001,eqCorr:0,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},gold:{bucket:we.DIVERSIFIERS,label:"Gold",nominalReturn:.055,yield:0,vol:.155,eqCorr:.05,duration:0,inflationBeta:.3,creditBeta:0,crisisBeta:.5,idioVol:.14,note:"near-uncorrelated; rises when stocks AND bonds fall (2022)"},trendMacro:{bucket:we.DIVERSIFIERS,label:"Trend / macro",nominalReturn:.045,yield:0,vol:.12,eqCorr:.07,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,momentumBeta:.6,idioVol:.1,note:"lagged path-momentum; pays in prolonged 2008/2022, whipsaws in V-shaped 2020"},commodities:{bucket:we.DIVERSIFIERS,label:"Broad commodities",nominalReturn:.045,yield:0,vol:.16,eqCorr:.25,duration:0,inflationBeta:.8,creditBeta:0,crisisBeta:0,idioVol:.14,note:"the strongest inflation hedge (2022); long flat stretches otherwise; crashes WITH equities in a demand shock (2008)"}},wu=Object.freeze(JSON.parse(JSON.stringify(zt))),np=Object.freeze(["nominalReturn","yield","yieldReal","vol","eqCorr","duration","inflationBeta","creditBeta","crisisBeta","momentumBeta","idioVol"]);function c0(t){for(const[e,n]of Object.entries(wu)){const s=zt[e];for(const i of np)n[i]!==void 0?s[i]=n[i]:delete s[i];const r=t&&t[e];if(r)for(const i of np)r[i]!==void 0&&Number.isFinite(+r[i])&&(s[i]=+r[i])}}const DT=bu,d0=Object.freeze(Object.fromEntries(DT.map(t=>[t.ticker,t.subClass])));function u0(){const t={};for(const[e,n]of Object.entries(zt))(t[n.bucket]=t[n.bucket]||[]).push({key:e,label:n.label});return t}const LT=.036,NT=.4,OT=.005,FT=.35,h0=.01,Eu=-.15,f0=.045;function sp(t,e=.1){let n=LT+NT*t;return e<Eu&&t<f0&&(n-=h0),n}function rp(t,e=.1){let n=OT+FT*(t-.025);return e<Eu&&t<f0&&(n-=h0),n}function VT(t){return t.inf>.045?"inflation":t.eqReturn<Eu?"crash":"normal"}const zT=Object.freeze({shortGilts:{normal:.05,inflation:.3,crash:-.2},longGilts:{normal:.1,inflation:.45,crash:-.35},indexLinked:{normal:.15,inflation:.35,crash:-.15},corporateIG:{normal:.35,inflation:.45,crash:.55},globalAggHedged:{normal:.25,inflation:.4,crash:.1},usTreasHedged:{normal:.05,inflation:.25,crash:-.4},infraDebt:{normal:.3,inflation:.35,crash:.35},gold:{normal:0,inflation:-.05,crash:-.2},trendMacro:{normal:.05,inflation:-.1,crash:-.3},highYield:{normal:.5,inflation:.55,crash:.6},commodities:{normal:.2,inflation:-.1,crash:.4}});function El(t,e){const n=zT[t];if(!n)return 0;const s=n[VT(e)];return s??n.normal}const UT=new Map(Object.entries(zt).map(([t,e])=>[e,t]));function Tl(t,e,n,s){if(!t)return 0;const r=(n-.1)/.17,i=Dr(0,1,s),o=e*r+Math.sqrt(Math.max(0,1-e*e))*i;return t*o}function $T(t,e,n){const{inf:s,prevInf:r,eqReturn:i,prevEqReturn:o=.1}=e,a=!!t.realYield,c=t.duration||0,d=a?rp(s,i)-rp(r,o):sp(s,i)-sp(r,o),u=a?(t.yieldReal||0)+s:t.yield||0,p=-c*d,f=a?0:(t.inflationBeta||0)*(s-.025),g=Tl(t.idioVol||0,El(UT.get(t),e),i,n);return u+p+f+g}const p0=Object.freeze({shortGilts:.3,longGilts:.2,indexLinked:.2,corporateIG:.3});function ip(t,e,n=p0){let s=0;for(const r of Object.keys(n)){const i=n[r];if(!i)continue;const o=zt[r];o&&(s+=i*$T(o,t,e))}return s}const qT=.048,HT=.045;function YT(t,e){const{inf:n,eqReturn:s}=t,r=zt.gold,i=(r.inflationBeta||0)*(n-.025),o=Tl(r.idioVol||0,El("gold",t),s,e);return qT+i+o}function WT(t,e,n){const s=zt.trendMacro,r=t.eqReturn-.05,i=(s.momentumBeta||0)*n*r,o=Tl(s.idioVol||0,El("trendMacro",t),t.eqReturn,e);return HT+i+o}const op=.6,GT=.15;function jT(t,e){return op*t+(1-op)*e}function KT(t){return Math.max(-1,Math.min(1,t/GT))}const QT=.035;function JT(t,e){const{inf:n}=t,s=zt.commodities,r=(s.inflationBeta||0)*(n-.025),i=Tl(s.idioVol||0,El("commodities",t),t.eqReturn,e);return QT+r+i}const qc=Object.freeze({gold:.5,trendMacro:.5});function ap(t,e,n,s=qc){let r=0;return s.gold&&(r+=s.gold*YT(t,e)),s.trendMacro&&(r+=s.trendMacro*WT(t,e,n)),s.commodities&&(r+=s.commodities*JT(t,e)),r}const m0=5,g0=20,y0=.01;function XT(t){return Math.min(Math.max(0,Math.floor(t)-m0+1),g0)}function pr(t,e="declining"){return e!=="declining"?1:Math.pow(1-y0,XT(t))}function ZT(t,e="declining"){if(e!=="declining")return 0;const n=pr(t-1,e);return n===0?0:1-pr(t,e)/n}const e_=-.01,t_=5;function v0(t){return Math.max(0,t+e_)}function No(t,e,n=0){const s=fd(n);let r=t.equityStart,i=t.bondStart,o=t.cashStart,a=t.hodlEnabled?t.hodlStart!==void 0?t.hodlStart:t.hodlValue:0,c=0,d=t.diversifierStart||0,u=0,p=0,f=0,g=t.isaBalance||0,v=t.accessMethod==="ufpls"?268275:0,y=0,E=!1,C=null;const k=t.isaBalance||0,P=Math.max(1e3,k*.05);let R=null,B=0,D=0;const I=new Array(t.years+1).fill(null),w=new Array(t.years+1).fill(null);let S=0,T=0,x=0,A=0,_=!1,W=!1,ee=null,H=0,re=0,te=-1;const ye=[],he=t.trace?[]:null,ft=[];let ie=1;ye.push({year:0,month:0,equity:r,bond:i,cash:o,hodl:a,total:r+i+o,draw:0,source:"None",inProtection:!1,equityMin:t.equityMin,bondMin:t.bondMin,cashMax:t.cashTarget});for(let oe=0;oe<t.years*12;oe++){const fe=Math.floor(oe/12),je=oe%12,sn=fe;if(sn!==te&&(H=0,re=0,te=sn),oe>0&&oe%12===0){const K=e.inflation[fe]||.025;ft.push(K),ie*=1+K}const At=wl(t.equityGlide,fe,t.duration);if(At!=null&&je===0){const K=r+i;K>0&&(r=K*At,i=K*(1-At))}d>0&&je===0&&(fe>0&&(p=jT(p,e.equity[fe-1]||0)),f=KT(p));const Ke=e.equity[fe]||0,Lt=e.inflation[fe]||.025,et=fe>0?e.inflation[fe-1]||.025:Lt;let rn=jn(t.equityMin,fe,t.duration,ie,!0),kt=jn(t.bondMin,fe,t.duration,ie,!0);if(At!=null){const K=rn+kt;rn=K*At,kt=K*(1-At)}const on=jn(t.cashTarget,fe,t.duration,ie,!1),Hs=rn+kt,Sr=_;if(_=t.disableProtection?!1:o0({totalGrowth:r+i,minGrowth:Hs,consecCashDraws:A,wasInProtection:Sr,consecutiveLimit:t.consecutiveLimit,recoveryBuffer:t.recoveryBuffer??Ha.RECOVERY_BUFFER}),_?(S++,x++):(T=Math.max(T,x),x=0),Array.isArray(t.windfalls)&&je===0){for(const K of t.windfalls)if(K.year===fe&&K.amount>0){if(K.toIsa){g+=K.amount;continue}const ve=r+i+o;if(ve<=0){o+=K.amount;continue}r+=K.amount*(r/ve),i+=K.amount*(i/ve),o+=K.amount*(o/ve)}}if(t.accessMethod==="ufpls"&&t.ufplsThenPcls&&t.ufplsYears>0&&fe>=t.ufplsYears&&je===0&&!E){E=!0;const K=r+i+o+d,ve=Math.max(0,Math.min(.25*K,v));if(ve>0&&K>0){const tt=1-ve/K;r*=tt,i*=tt,o*=tt,d*=tt,g+=ve,v-=ve,y=ve}}const{sippMonthly:Rn,isaMonthly:Mn,planInputs:Wt,taxAnnual:Ct,higherRate:Fe,taxFreeMonthly:Ve,recycleGrossMonthly:Bn,recycleNetMonthly:xr}=o_(t,fe,ie,ft,g,v);je===0&&(I[fe]=g/ie,w[fe]=(r+i+o+d)/ie),D+=Ct/12/ie,Fe&&B++;const us=Rn,Ys=us,Dn=_?$c(Math.max(0,x-1),t.protectionMult):1;let hs=_?us*Dn:us,He=hs;const Ut=!_&&Bn>0?Bn:0,Ln=Ut>0?xr:0;Ut>0&&(He+=Ut,D+=(Ut-Ln)/ie);const fs=Mn,Gt=he?{month:oe,year:fe,monthInYear:je,cumInf:ie,equityStart:r,bondStart:i,cashStart:o,isaStart:g,sippMonthly:Rn,isaMonthly:Mn,effectiveSipp:hs,effectiveIsa:fs,boostAmount:0,inProtection:_,planInputs:Wt}:null;Gt&&he.push(Gt),_&&(H+=Ys-He);const an=fe>0?e.equity[fe-1]||0:Ke,Ar=t.subAsset?ip({inf:Lt,prevInf:et,eqReturn:Ke,prevEqReturn:an},s,t.subAsset.bondWeights):n_(Lt,Ke,et,s),ln=v0(et),jt=K=>Math.pow(1+(Number.isFinite(K)?Math.max(-.99,K):-.99),1/12);if(r*=jt(Ke),i*=jt(Ar),o*=jt(ln),t.isaMix&&g>0){const K=t.isaMix;let ve=(K.shares||0)*Ke+(K.cash||0)*ln;K.bonds&&(ve+=K.bonds*ip({inf:Lt,prevInf:et,eqReturn:Ke,prevEqReturn:an},s,K.bondWeights)),K.diversifiers&&(ve+=K.diversifiers*ap({inf:Lt,eqReturn:Ke},s,f,K.diversifierWeights)),g*=jt(ve)}else g=RT(g,t.isaReturn??Vt.RETURN);if(a>0){const tt=(s()-.5)*2*.06;let Ue=0;Ke<-.1?Ue=Math.min(.15,Math.abs(Ke)*.4):Ke<-.05&&(Ue=Math.abs(Ke)*.2);let On=.069+tt+Ue;On=Math.max(-.08,Math.min(.18,On)),a*=jt(On)}if(d>0){const K=ap({inf:Lt,eqReturn:Ke},s,f,t.subAsset&&t.subAsset.diversifierWeights);d*=jt(K)}const Nn=r+i;let pt=0;if(!_){const K=12-je,ve=re+Ys*K+Wt.fixed;pt=wa({shortfall:H,standardMonthly:Ys,remainingMonths:K,surplus:Nn-Hs-Hr.SURPLUS_BUFFER,brlHeadroom:Wt.brl-ve}),pt>50&&(He+=pt,H-=pt)}if(re+=He,Gt&&(Gt.effectiveSipp=He,Gt.boostAmount=pt>50?pt:0),!Number.isFinite(He)){W=!0,ee=oe;break}const ze=l0({draw:He,equity:r,bond:i,cash:o,diversifier:d,diversifierTarget:t.diversifierStart||0,hodl:a,eqMin:rn,bdMin:kt,csTarget:on,inProtection:_});if(r-=ze.fromEquity,i-=ze.fromBond,o-=ze.fromCash,ze.fromDiversifier>0&&(d-=ze.fromDiversifier,u+=ze.fromDiversifier),ze.fromHodl>0&&(a-=ze.fromHodl,c+=ze.fromHodl,C===null&&(C=oe)),ze.shortfall>1e-6&&(W=!0,ee=oe),ze.replenish>0){const K=Math.max(0,r-rn),ve=Math.max(0,i-kt),tt=K+ve;tt>0&&(r-=ze.replenish*K/tt,i-=ze.replenish*ve/tt,o+=ze.replenish)}const ps=ze.source;if(A=ps==="Growth"?0:A+1,g=Math.max(0,g-Math.min(fs,g))+Ln,v>0&&(v=Math.max(0,v-(Ve||0))),R===null&&k>0&&g/ie<P&&(R=oe),r=Math.max(0,r),i=Math.max(0,i),o=Math.max(0,o),d=Math.max(0,d),(je===0||oe===t.years*12-1||W)&&ye.push({year:fe+je/12,month:oe,equity:r,bond:i,cash:o,hodl:a,diversifier:d,total:r+i+o+d,draw:He,boostAmount:pt,source:ps,inProtection:_,equityMin:rn,bondMin:kt,cashMax:on}),W)break}if(T=Math.max(T,x),!W)I[t.years]=g/(ie||1),w[t.years]=(r+i+o+d)/(ie||1);else for(let oe=Math.floor(ee/12)+1;oe<=t.years;oe++)w[oe]=0;let z=0,xe=0,ae=0,nn=0,Ge=1;for(let oe=0;oe<t.years;oe++){const fe=e.inflation[oe]??.025;z+=fe,Ge*=1+fe,xe+=e.equity[oe]??0,oe<5&&(ae+=e.equity[oe]??0,nn++)}const Pn=r+i+o+d;return{failed:W,duration:t.years,years:W?ee/12:t.years,failMonth:ee,avgInflation:z/t.years,avgEquityReturn:xe/t.years,earlyEquityReturn:nn?ae/nn:0,cumInflation:Ge,finalReal:Pn/Ge,final:Pn,finalEquity:r,finalBond:i,finalCash:o,finalHodl:a,finalDiversifier:d,divUsed:u,protMonths:S,maxConsec:T,hodlUsed:c,hodlUsedMonth:C,startIsa:k,finalIsa:g,pclsTaken:y,isaDepletedMonth:R,isaLastedYears:R===null?t.years:R/12,higherRateYears:B/12,totalTaxReal:D,isaByYear:I,potByYear:w,hist:ye,trace:he,seed:n}}function n_(t,e,n,s){let r=.15,i=.3,o=.2,a=.1,c=.1,d=.15;const u=n!==void 0?n:t,p=u>.045,f=u>.07;if(p){const D=s()>.3?1:.5;f?(r=.15+.35*D,i=.3-.2*D,d=.15-.1*D,a=.1+.05*D):(r=.15+.2*D,i=.3-.1*D,d=.15-.05*D)}p&&s()<.15&&(r=.2,i=.25,d=.12);const g=t+.005+Dr(0,.03,s),v=.04-(t>.04?(t-.04)*.5:0)+Dr(0,.05,s),y=.03+t*.3+Dr(0,.08,s),E=t*.8+Dr(0,.15,s),C=v0(n),k=e*.5+Dr(0,.02,s),P=r*g+i*v+o*y+a*E+c*C+d*k,R=s_(t,e),B=(e-.1)/.17;return P+R*B*.055}function s_(t,e){return t>.045?.4:e<-.15?-.3:.1}function r_(t,e){return pr(e,t.spendingProfile||"flat")}function i_(t,e){return t.spStartYear!==void 0?Math.max(0,t.spStartYear-e):t.statePensionYear!==void 0?Math.max(0,t.statePensionYear-e):0}function o_(t,e,n,s,r=0,i=0){const o=t.taxMode==="frozen"?t.pa:t.pa*n,a=t.taxMode==="frozen"?t.brl:t.brl*n,c=t.taxMode==="frozen"?t.hrl:(t.hrl||125140)*n,u=(Array.isArray(t.targetSchedule)&&t.targetSchedule[e]!=null?t.targetSchedule[e]:t.baseSalary)*n*r_(t,e),p=Zl(t.other,s);let f=0;if(t.spStartYear!==void 0){if(e>=t.spStartYear&&t.spWeeklyAmount>0){const D=t.spWeeklyAmount*52;e===t.spStartYear&&t.spFirstYearRatio!==void 0?f=D*t.spFirstYearRatio*n:f=D*n}}else t.statePensionYear!==void 0&&(f=e>=t.statePensionYear?(t.statePension||0)*n:0);let g=0;if(t.dbAmount>0&&e>=(t.dbStartYear||0)){const D=t.dbIndexation||"lpi5";D==="level"?g=t.dbAmount:D==="cpi"?g=t.dbAmount*n:g=Zl(t.dbAmount,s,.05)}let v=0;for(const D of t.extraIncomes||[])if(D.annual>0&&e>=(D.startYear||0)&&(D.endYear==null||e<=D.endYear)){const I=D.indexation||"lpi5";I==="level"?v+=D.annual:I==="cpi"?v+=D.annual*n:v+=Zl(D.annual,s,.05)}const y=p+f+g+v,E=i_(t,e),C=!t.ufplsYears||e<t.ufplsYears,k=t.accessMethod==="ufpls"&&C&&i>0?.25:0,P=lo({targetGross:u,fixedIncome:y,pa:o,brl:a,hrl:c,isaBalance:r,strategy:t.isaDrawdownStrategy||Vt.DRAWDOWN_STRATEGY,yearsUntilSp:E,taxFreeFraction:k});let R=0,B=0;if(t.bandFillRecycle&&k===0){const D=a0({brlHeadroom:a-P.taxable,remainingMonths:12,isaAllowanceLeft:vu.ISA_ANNUAL_ALLOWANCE});R=D.gross,B=D.net}return{sippMonthly:P.sippGross/12,isaMonthly:P.isaDraw/12,taxFreeMonthly:(P.taxFree||0)/12,recycleGrossMonthly:R,recycleNetMonthly:B,taxAnnual:P.tax,higherRate:P.taxable>a+1,planInputs:{target:u,other:p,statePension:f,fixed:y,pa:o,brl:a,hrl:c,yearsUntilSp:E}}}function a_(t,e=1e3){const n=[];for(let s=0;s<e;s++)n.push(No(t,Tu(t,s),s));return n}function Tu(t,e){const n=Object.keys(ar).map(Number).sort((c,d)=>c-d),s=n.length,r=fd(e*12345),i={equity:{},inflation:{}},o=t.blockYears||t_;let a=0;for(;a<t.years;){const c=Math.floor(r()*s);for(let d=0;d<o&&a<t.years;d++,a++){const u=n[(c+d)%s];i.equity[a]=ar[u],i.inflation[a]=Ka[u]||.025}}return i}function l_(t,e){return No({...t,trace:!0},Tu(t,e),e)}function c_(t){const e=Object.keys(ar).map(Number).sort((r,i)=>r-i),n=Math.max(...e),s=[];for(const r of e){if(r+t.years-1>n)continue;const i={equity:{},inflation:{}};for(let a=0;a<t.years;a++)i.equity[a]=ar[r+a]||0,i.inflation[a]=Ka[r+a]||.025;const o=No(t,i,r);o.startYear=r,s.push(o)}return s}function d_(t,e){const n={equity:{},inflation:{}};for(let s=0;s<t.years;s++)n.equity[s]=e.equity[s%e.equity.length],n.inflation[s]=e.inflation[s%e.inflation.length];return No(t,n,999)}function u_(t){const e=t.filter(n=>n.failed).length;return(t.length-e)/t.length*100}function h_(t){if(!t||t.failCount===0)return"No shortfalls: every simulated future funded the whole plan.";const e=d=>(d*100).toFixed(1)+"%",n=Math.round(t.medianFailYear),s=t.duration,r=Math.round(t.pctNearMiss);let i;t.pctNearMiss>=60?i=`and when they do it's usually late — the typical shortfall is at year ${n} of ${s}, and ${r}% happen only in the final years, after funding almost the whole of retirement`:t.pctNearMiss<=30?i=`and they tend to come EARLY — the typical shortfall is at year ${n} of ${s}, with only ${r}% holding on to the final years. An early shortfall is the serious kind, with little retirement left to adjust`:i=`spread through retirement — the typical shortfall is at year ${n} of ${s}`;const o=[{mag:t.succEarlyEq-t.failEarlyEq,text:`a poor first few years of markets (sequence-of-returns risk): the futures that fell short averaged ${e(t.failEarlyEq)} equity in the opening 5 years versus ${e(t.succEarlyEq)} for those that lasted`},{mag:t.succAvgEq-t.failAvgEq,text:`weak markets across the whole plan: ${e(t.failAvgEq)} average equity return versus ${e(t.succAvgEq)} for those that lasted`},{mag:t.failAvgInf-t.succAvgInf,text:`higher inflation eroding spending power: ${e(t.failAvgInf)} a year versus ${e(t.succAvgInf)} for those that lasted`}].filter(d=>d.mag>.005).sort((d,u)=>u.mag-d.mag),a=`About ${Math.round(t.failRate||0)}% of futures fall short`;if(!o.length)return`${a}, ${i}. No single market driver stands out — the shortfalls come down to broadly bad luck across returns and inflation.`;let c=`The common thread is ${o[0].text}`;return o[1]&&o[1].mag>o[0].mag*.5&&(c+=`. A secondary factor is ${o[1].text}`),`${a}, ${i}. ${c}.`}function b0(t){const e=t.filter(a=>!a.failed),n=t.filter(a=>a.failed),s=t.map(a=>a.years).sort((a,c)=>a-c),r=e.map(a=>a.final).sort((a,c)=>a-c),i=t.map(a=>a.protMonths).sort((a,c)=>a-c),o=(a,c)=>a[Math.floor(a.length*c)]||0;return{total:t.length,successCount:e.length,failCount:n.length,successRate:u_(t),survival:{p5:o(s,.05),p10:o(s,.1),p25:o(s,.25),p50:o(s,.5),p75:o(s,.75),p90:o(s,.9),p95:o(s,.95),min:s[0],max:s[s.length-1]},finalValue:{p5:o(r,.05),p10:o(r,.1),p25:o(r,.25),p50:o(r,.5),p75:o(r,.75),p90:o(r,.9),p95:o(r,.95),min:r[0]||0,max:r[r.length-1]||0,avg:e.reduce((a,c)=>a+c.final,0)/(e.length||1)},minYears:s[0],p10Years:o(s,.1),medianYears:o(s,.5),medianFinal:o(r,.5),p10Final:o(r,.1),p90Final:o(r,.9),avgFinal:e.reduce((a,c)=>a+c.final,0)/(e.length||1),protection:{runsWithProtection:t.filter(a=>a.protMonths>0).length,pctWithProtection:t.filter(a=>a.protMonths>0).length/t.length*100,avgMonths:i.reduce((a,c)=>a+c,0)/t.length,maxMonths:Math.max(...i),maxConsecutive:Math.max(...t.map(a=>a.maxConsec)),avgConsecutive:t.reduce((a,c)=>a+c.maxConsec,0)/t.length,p50Months:o(i,.5),p90Months:o(i,.9),p95Months:o(i,.95)},runsWithProtection:t.filter(a=>a.protMonths>0).length,avgProtMonths:i.reduce((a,c)=>a+c,0)/t.length,maxProtMonths:Math.max(...i),maxConsecutive:Math.max(...t.map(a=>a.maxConsec)),avgConsecutive:t.reduce((a,c)=>a+c.maxConsec,0)/t.length,hodl:{runsUsingHodl:t.filter(a=>a.hodlUsed>0).length,pctUsingHodl:t.filter(a=>a.hodlUsed>0).length/t.length*100,avgUsed:t.filter(a=>a.hodlUsed>0).length>0?t.filter(a=>a.hodlUsed>0).reduce((a,c)=>a+c.hodlUsed,0)/t.filter(a=>a.hodlUsed>0).length:0,maxUsed:Math.max(...t.map(a=>a.hodlUsed||0))},runsUsingHodl:t.filter(a=>a.hodlUsed>0).length,avgHodlUsed:t.filter(a=>a.hodlUsed>0).length>0?t.filter(a=>a.hodlUsed>0).reduce((a,c)=>a+c.hodlUsed,0)/t.filter(a=>a.hodlUsed>0).length:0,maxHodlUsed:Math.max(...t.map(a=>a.hodlUsed||0)),severity:(()=>{const a=Math.max(...t.map(y=>y.duration||y.years),1),c=t.filter(y=>y.failed),d=t.filter(y=>!y.failed),u=c.map(y=>y.years).sort((y,E)=>y-E),p=a*.85,f=(y,E)=>y.length?y.reduce((C,k)=>C+(k[E]||0),0)/y.length:0,g={duration:a,coverage:t.reduce((y,E)=>y+Math.min(1,(E.years||0)/a),0)/t.length*100,failCount:c.length,failRate:t.length?c.length/t.length*100:0,medianFailYear:u.length?o(u,.5):0,pctNearMiss:c.length?c.filter(y=>y.years>=p).length/c.length*100:0,failEarlyEq:f(c,"earlyEquityReturn"),succEarlyEq:f(d,"earlyEquityReturn"),failAvgEq:f(c,"avgEquityReturn"),succAvgEq:f(d,"avgEquityReturn"),failAvgInf:f(c,"avgInflation"),succAvgInf:f(d,"avgInflation")};g.diagnosis=h_(g);const v=[{k:"sequence",m:g.succEarlyEq-g.failEarlyEq},{k:"market",m:g.succAvgEq-g.failAvgEq},{k:"inflation",m:g.failAvgInf-g.succAvgInf}].filter(y=>y.m>.005).sort((y,E)=>E.m-y.m);return g.primaryDriver=g.failCount>0&&v.length?v[0].k:null,g})(),finalReal:(()=>{const a=t.map(c=>c.failed?0:c.finalReal||0).sort((c,d)=>c-d);return{p5:o(a,.05),p10:o(a,.1),p25:o(a,.25),p50:o(a,.5),p75:o(a,.75),p90:o(a,.9),p95:o(a,.95),min:a[0]||0,max:a[a.length-1]||0}})(),chartData:(()=>{const a=Math.max(...t.map(p=>p.duration||p.years),1),c=a+1,d={p10:[],p25:[],p50:[],p75:[],p90:[]},u=[];for(let p=0;p<c;p++){const f=t.map(v=>v.potByYear&&v.potByYear[p]!=null?v.potByYear[p]:0).sort((v,y)=>v-y);d.p10.push(o(f,.1)),d.p25.push(o(f,.25)),d.p50.push(o(f,.5)),d.p75.push(o(f,.75)),d.p90.push(o(f,.9));const g=t.filter(v=>(v.failed?v.failMonth/12:a)>=p).length;u.push(t.length?g/t.length*100:0)}return{years:c,potBand:d,solvency:u}})(),isa:(()=>{const a=t.filter(y=>(y.startIsa||0)>0);if(!a.length)return{funded:!1};const c=a.map(y=>y.isaLastedYears).sort((y,E)=>y-E),d=a.map(y=>y.finalIsa).sort((y,E)=>y-E),u=a.map(y=>y.higherRateYears),p=a.map(y=>y.totalTaxReal).sort((y,E)=>y-E),f=Math.max(...a.map(y=>(y.isaByYear||[]).length)),g=[],v=[];for(let y=0;y<f;y++){const E=a.filter(k=>k.isaByYear&&k.isaByYear[y]>0).length;g.push(a.length?E/a.length*100:0);const C=a.map(k=>k.isaByYear&&k.isaByYear[y]!=null?k.isaByYear[y]:0).sort((k,P)=>k-P);v.push(C[Math.floor(C.length/2)])}return{funded:!0,runs:a.length,startBalance:a[0].startIsa,medianLastedYears:o(c,.5),minLastedYears:c[0],pctSurviveFullTerm:a.filter(y=>y.isaDepletedMonth===null).length/a.length*100,finalBalance:{p10:o(d,.1),p50:o(d,.5),p90:o(d,.9)},avgHigherRateYears:u.reduce((y,E)=>y+E,0)/a.length,maxHigherRateYears:Math.max(...u),pctEverHigherRate:a.filter(y=>y.higherRateYears>0).length/a.length*100,medianTotalTax:o(p,.5),p90TotalTax:o(p,.9),pctHoldingByYear:g,medianIsaByYear:v}})(),failures:n.map(a=>({seed:a.seed,startYear:a.startYear,years:a.years,failMonth:a.failMonth,protMonths:a.protMonths}))}}function f_(t={}){return Array.isArray(t.targetSchedule)&&t.targetSchedule.length?{type:"schedule",values:t.targetSchedule.slice()}:(t.spendingProfile||"flat")==="declining"?{type:"taper",rate:y0,startYear:m0,years:g0}:{type:"flat"}}function w0(t,e,n){if(!t||t.type==="flat")return n;if(t.type==="taper")return n*pr(e,"declining");if(t.type==="schedule"){const s=t.values[e];return s??n}if(t.type==="phases"){const s=(t.phases||[]).filter(r=>Number.isFinite(+r.fromYear)&&+r.fromYear<=e&&Number.isFinite(+r.amount)).sort((r,i)=>+r.fromYear-+i.fromYear).pop();return s?+s.amount:n}return n}const Us="6.1.0",Ea={source:"Shiller ie_data via datahub/datasets mirror",start:"1871-01",end:"2023-06",P:[4.44,4.5,4.61,4.74,4.86,4.82,4.73,4.79,4.84,4.59,4.64,4.74,4.86,4.88,5.04,5.18,5.18,5.13,5.1,5.04,4.95,4.97,4.95,5.07,5.11,5.15,5.11,5.04,5.05,4.98,4.97,4.97,4.59,4.19,4.04,4.42,4.66,4.8,4.73,4.6,4.48,4.46,4.46,4.47,4.54,4.53,4.57,4.54,4.54,4.53,4.59,4.65,4.47,4.38,4.39,4.41,4.37,4.3,4.37,4.37,4.46,4.52,4.51,4.34,4.18,4.15,4.1,3.93,3.69,3.67,3.6,3.58,3.55,3.34,3.17,2.94,2.94,2.73,2.85,3.05,3.24,3.31,3.26,3.25,3.25,3.18,3.24,3.33,3.34,3.41,3.48,3.45,3.52,3.48,3.47,3.45,3.58,3.71,3.65,3.77,3.94,3.96,4.04,4.07,4.22,4.68,4.93,4.92,5.11,5.2,5.3,5.18,4.77,4.79,5.01,5.19,5.18,5.33,5.61,5.84,6.19,6.17,6.24,6.22,6.5,6.58,6.35,6.2,6.25,6.15,6.19,6.01,5.92,5.79,5.78,5.78,5.71,5.68,6,6.18,6.24,6.07,5.81,5.84,5.81,5.68,5.75,5.87,5.77,5.82,5.73,5.47,5.53,5.38,5.46,5.34,5.18,5.32,5.3,5.06,4.65,4.46,4.46,4.74,4.59,4.44,4.35,4.34,4.24,4.37,4.38,4.37,4.32,4.3,4.46,4.71,4.65,4.92,5.24,5.2,5.2,5.3,5.19,5.12,5.02,5.25,5.33,5.37,5.51,5.65,5.79,5.64,5.58,5.54,5.67,5.8,5.9,5.73,5.59,5.45,5.38,5.2,5.3,5.27,5.31,5.28,5.08,5.1,5.17,5.01,5.14,5.25,5.38,5.35,5.24,5.14,5.24,5.3,5.19,5.18,5.32,5.41,5.3,5.37,5.5,5.4,5.35,5.32,5.38,5.32,5.28,5.39,5.62,5.58,5.54,5.41,5.32,5.08,4.71,4.6,4.84,4.9,4.81,4.97,4.95,4.85,4.77,4.93,5.33,5.33,5.25,5.41,5.51,5.52,5.58,5.57,5.57,5.54,5.54,5.62,5.48,5.59,5.57,5.51,5.61,5.51,5.31,5.31,4.84,4.61,4.18,4.08,4.37,4.5,4.57,4.41,4.32,4.38,4.51,4.57,4.4,4.34,4.25,4.41,4.48,4.34,4.34,4.3,4.25,4.19,4.19,4.37,4.61,4.7,4.72,4.79,4.82,4.75,4.59,4.32,4.27,4.45,4.38,4.42,4.4,4.32,4.04,3.81,4.01,4.1,4.38,4.22,4.22,4.18,4.19,4.06,4.08,4.27,4.46,4.75,4.98,4.82,4.65,4.75,4.88,4.87,4.65,4.57,4.87,5.06,5.08,5.27,5.26,5.15,5.32,5.65,6.08,6.31,6.4,6.48,6.21,6.07,6.28,6.44,6.37,6.34,6.46,6.02,6.1,6.21,6.26,6.34,6.04,5.86,5.86,5.94,5.8,6.01,6.48,6.87,7.07,7.25,7.51,8.14,7.73,8.5,7.93,8.04,8,7.91,8.08,7.95,8.12,8.19,8.2,8.48,8.46,8.41,8.6,8.83,8.85,8.57,8.24,8.05,8.46,8.41,8.08,7.75,7.6,7.18,6.85,6.63,6.47,6.26,6.28,6.57,6.68,6.5,6.48,6.64,6.5,6.51,6.78,7.01,7.32,7.75,8.17,8.25,8.43,8.8,9.05,8.94,8.5,8.6,8.87,9.2,9.23,9.36,9.31,9.54,9.87,9.8,9.56,9.43,9.18,9.3,9.06,9.73,10.03,9.73,9.93,9.84,9.56,9.26,8.35,8.39,8.1,7.84,8.14,7.53,7.45,6.64,6.25,6.57,6.85,6.6,6.87,7.24,7.63,7.64,7.92,8.26,8.17,8.27,8.83,9.03,9.06,8.8,8.92,9.32,9.63,9.8,9.94,10.18,10.19,10.23,10.18,10.3,10.08,9.72,9.96,9.72,9.56,9.1,8.64,8.85,8.91,9.32,9.31,9.05,9.27,9.43,9.32,9.28,9.48,9.67,9.63,9.17,8.67,8.72,9.07,9.11,9.12,9.04,9.3,9.59,9.58,9.58,9.59,9.81,9.86,9.84,9.73,9.38,9.3,8.97,8.8,8.79,8.55,8.12,8.23,8.45,8.53,8.26,8.05,8.04,8.37,8.48,8.32,8.12,8.17,8.13,7.68,7.68,7.68,7.68,7.68,7.35,7.48,7.38,7.57,8.14,7.95,8.04,8.01,8.35,8.66,9.14,9.46,9.48,9.33,9.2,9.17,9.07,9.27,9.36,9.23,9.3,9.68,9.98,10.21,9.8,9.57,9.03,9.31,9.17,8.86,9.04,8.79,8.53,8.12,7.68,7.04,6.8,7.21,7.43,7.28,7.21,7.44,7.45,7.51,7.58,7.54,7.86,8.06,7.9,7.85,7.88,8.12,8.39,8.97,9.21,9.51,8.87,9.01,9.47,9.19,8.92,8.83,8.1,8.67,8.6,8.06,7.92,7.91,7.6,7.87,7.88,7.48,6.81,7.11,7.06,6.88,6.91,7.12,6.55,6.53,6.45,6.61,6.7,7.06,7.31,7.3,7.46,7.74,8.21,8.53,8.45,8.51,8.83,9.06,9.26,8.8,8.78,8.9,9.28,9.43,9.1,8.67,8.34,8.06,8.1,8.15,8.03,8.27,8.55,8.83,8.87,8.7,8.5,8.47,8.63,9.03,9.34,9.25,9.13,9.64,10.16,10.58,10.67,10.39,10.28,10.61,10.8,11.1,11.25,11.51,11.89,12.26,12.46,12.65,12.67,11.81,11.48,11.56,12.11,12.62,13.12,13.32,13.02,13.19,13.49,13.4,13.66,13.87,14.21,14.7,14.89,15.22,16.03,16.94,16.68,17.06,17.46,17.53,17.32,18.25,19.4,20,19.02,19.16,19.78,21.17,21.6,23.06,23.15,24.86,24.99,25.43,25.28,25.66,26.15,28.48,30.1,31.3,27.99,20.58,21.4,21.71,23.07,23.94,25.46,23.94,21.52,21.06,20.79,20.78,17.92,16.62,15.51,15.98,17.2,17.53,15.86,14.33,13.87,14.33,13.9,11.83,10.25,10.39,8.44,8.3,8.23,8.26,6.28,5.51,4.77,5.01,7.53,8.26,7.12,7.05,6.82,7.09,6.25,6.23,6.89,8.87,10.39,11.23,10.67,10.58,9.55,9.78,9.97,10.54,11.32,10.74,10.92,9.81,9.94,9.47,9.1,8.88,8.95,9.2,9.26,9.26,8.98,8.41,9.04,9.75,10.12,10.65,11.37,11.61,11.92,13.04,13.04,13.76,14.55,14.86,14.88,14.09,14.69,15.56,15.87,16.05,16.89,17.36,17.06,17.59,18.11,18.09,17.01,16.25,15.64,16.57,16.74,14.37,12.28,11.2,11.02,11.31,11.04,10.31,9.89,9.98,10.21,12.24,12.31,11.75,13.06,13.07,12.69,12.5,12.4,12.39,10.83,11.23,11.43,11.71,11.54,12.77,12.9,12.67,12.37,12.3,12.22,12.15,12.27,10.58,9.67,9.99,10.2,10.63,10.73,10.98,10.53,10.55,9.89,9.95,9.64,9.43,9.76,10.26,10.21,10.24,9.83,9.37,8.76,8.93,8.65,8.18,7.84,7.93,8.33,8.64,8.59,8.68,9.32,9.47,9.52,10.09,10.69,11.07,11.44,11.89,12.1,12.35,11.74,11.99,11.88,11.33,11.48,11.85,11.77,12.1,11.89,12.1,12.67,13,12.81,12.6,12.91,12.82,13.1,13.49,13.94,13.93,14.28,14.82,15.09,14.78,14.83,15.84,16.5,17.04,17.33,18.02,18.07,17.53,18.66,18.7,18.58,18.05,17.7,15.09,14.75,14.69,15.13,15.21,15.8,15.16,14.6,14.34,14.84,15.77,15.46,15.06,15.45,15.27,15.03,14.83,14.1,14.3,15.4,16.15,16.82,16.42,15.94,15.76,16.19,15.29,15.19,15.36,14.77,14.91,14.89,14.78,13.97,14.76,15.29,15.49,15.89,16.11,16.54,16.88,17.21,17.35,17.84,18.44,18.74,17.38,18.43,19.08,19.87,19.83,19.75,21.21,22,21.63,21.92,21.93,21.55,21.93,22.89,23.48,23.36,22.71,23.41,24.19,23.75,23.81,23.74,23.73,24.38,25.08,25.18,24.78,24.26,25.03,26.04,26.18,25.86,25.99,24.71,24.84,23.95,24.29,24.39,23.27,23.97,24.5,24.83,25.46,26.02,26.57,27.63,28.73,28.96,30.13,30.73,31.45,32.18,33.44,34.97,35.6,36.79,36.5,37.76,37.6,39.78,42.69,42.43,44.34,42.11,44.95,45.37,44.15,44.43,47.49,48.05,46.54,46.27,48.78,48.49,46.84,46.24,45.76,46.44,45.43,43.47,44.03,45.05,46.78,47.55,48.51,45.84,43.98,41.24,40.35,40.33,41.12,41.26,42.11,42.34,43.7,44.75,45.98,47.7,48.96,50.95,52.5,53.49,55.62,54.77,56.16,57.1,57.96,57.46,59.74,59.4,57.05,57,57.23,59.06,58.03,55.78,55.02,55.73,55.22,57.26,55.84,56.51,54.81,53.73,55.47,56.8,59.72,62.17,64.12,65.83,66.5,65.62,65.44,67.79,67.26,68,71.08,71.74,69.07,70.22,70.29,68.05,62.99,55.63,56.97,58.52,58,56.17,60.04,62.64,65.06,65.92,65.67,68.76,70.14,70.11,69.07,70.98,72.85,73.03,72.62,74.17,76.45,77.39,78.8,79.94,80.72,80.24,83.22,82,83.41,84.85,85.44,83.96,86.12,86.75,86.83,87.97,89.28,85.04,84.91,86.49,89.38,91.39,92.15,91.73,93.32,92.69,88.88,91.6,86.78,86.06,85.84,80.65,77.81,77.13,80.99,81.33,84.45,87.36,89.42,90.96,92.59,91.43,93.01,94.49,95.81,95.66,92.66,95.3,95.04,90.75,89.09,95.67,97.87,100.5,100.3,98.11,101.3,103.8,105.4,106.5,102,101.5,99.3,101.3,104.6,99.14,94.71,94.18,94.51,95.52,96.21,91.11,90.31,87.16,88.65,85.95,76.06,75.59,75.72,77.92,82.58,84.37,84.28,90.05,93.49,97.11,99.6,103,101.6,99.72,99,97.24,99.4,97.29,92.78,99.17,103.3,105.2,107.7,108.8,107.7,108,107.2,111,109.4,109.6,115.1,117.5,118.4,114.2,112.4,110.3,107.2,104.8,105.8,103.8,105.6,109.8,102,94.78,96.11,93.45,97.44,92.46,89.67,89.79,79.31,76.03,68.12,69.44,71.74,67.07,72.56,80.1,83.78,84.72,90.1,92.4,92.49,85.71,84.67,88.57,90.07,88.7,96.86,100.6,101.1,101.9,101.2,101.8,104.2,103.3,105.5,101.9,101.2,104.7,103.8,101,100.6,99.05,98.76,99.29,100.2,97.75,96.23,93.74,94.28,93.82,90.25,88.98,88.82,92.71,97.41,97.66,97.19,103.9,103.9,100.6,94.71,96.11,99.71,98.23,100.1,102.1,99.73,101.7,102.7,107.4,108.6,104.5,103.7,107.8,110.9,115.3,104.7,103,107.7,114.6,119.8,123.5,126.5,130.2,135.7,133.5,133,128.4,133.2,134.4,131.7,132.3,129.1,129.6,118.3,119.8,122.9,123.8,117.3,114.5,110.8,116.3,116.4,109.7,109.4,109.7,122.4,132.7,138.1,139.4,144.3,146.8,151.9,157.7,164.1,166.4,167,162.4,167.2,167.7,165.2,164.4,166.4,157.3,157.4,157.6,156.6,153.1,151.1,164.4,166.1,164.8,166.3,164.5,171.6,180.9,179.4,180.6,184.9,188.9,192.5,188.3,184.1,186.2,197.5,207.3,208.2,219.4,232.3,238,238.5,245.3,240.2,245,238.3,237.4,245.1,248.6,264.5,280.9,292.5,289.3,289.1,301.4,310.1,329.4,318.7,280.2,245,241,250.5,258.1,265.7,262.6,256.1,270.7,269.1,263.7,268,277.4,271,276.5,285.4,294,292.7,302.3,313.9,323.7,331.9,346.6,347.3,347.4,340.2,348.6,339.97,330.45,338.46,338.18,350.25,360.39,360.03,330.75,315.41,307.12,315.29,328.75,325.49,362.26,372.28,379.68,377.99,378.29,380.23,389.4,387.2,386.88,385.92,388.51,416.08,412.56,407.36,407.41,414.81,408.27,415.05,417.93,418.48,412.5,422.84,435.64,435.23,441.7,450.16,443.08,445.25,448.06,447.29,454.13,459.24,463.9,462.89,465.95,472.99,471.58,463.81,447.23,450.9,454.83,451.4,464.24,466.96,463.81,461.01,455.19,465.25,481.92,493.15,507.91,523.81,539.35,557.37,559.11,578.77,582.92,595.53,614.57,614.42,649.54,647.07,647.17,661.23,668.5,644.07,662.68,674.88,701.46,735.67,743.25,766.22,798.39,792.16,763.93,833.09,876.29,925.29,927.24,937.02,951.16,938.92,962.37,963.36,1023.74,1076.83,1112.2,1108.42,1108.39,1156.58,1074.62,1020.64,1032.47,1144.43,1190.05,1248.77,1246.58,1281.66,1334.76,1332.07,1322.55,1380.99,1327.49,1318.17,1300.01,1391,1428.68,1425.59,1388.87,1442.21,1461.36,1418.48,1461.96,1473,1485.46,1468.05,1390.14,1378.04,1330.93,1335.63,1305.75,1185.85,1189.84,1270.37,1238.71,1204.45,1178.5,1044.64,1076.59,1129.68,1144.93,1140.21,1100.67,1153.79,1111.93,1079.25,1014.02,903.59,912.55,867.81,854.63,909.93,899.18,895.84,837.03,846.63,890.03,935.96,988,992.54,989.53,1019.44,1038.73,1049.9,1080.64,1132.52,1143.36,1123.98,1133.36,1102.78,1132.76,1105.85,1088.94,1117.66,1117.21,1168.94,1199.21,1181.41,1199.63,1194.9,1164.43,1178.28,1202.25,1222.24,1224.27,1225.92,1191.96,1237.37,1262.07,1278.73,1276.65,1293.74,1302.17,1290.01,1253.17,1260.24,1287.15,1317.74,1363.38,1388.64,1416.42,1424.16,1444.8,1406.95,1463.64,1511.14,1514.19,1520.71,1454.62,1497.12,1539.66,1463.39,1479.22,1378.76,1354.87,1316.94,1370.47,1403.22,1341.25,1257.33,1281.47,1216.95,968.8,883.04,877.56,865.58,805.23,757.13,848.15,902.41,926.12,935.82,1009.73,1044.55,1067.66,1088.07,1110.38,1123.58,1089.16,1152.05,1197.32,1125.06,1083.36,1079.8,1087.28,1122.08,1171.58,1198.89,1241.53,1282.62,1321.12,1304.49,1331.51,1338.31,1287.29,1325.19,1185.31,1173.88,1207.22,1226.42,1243.32,1300.58,1352.49,1389.24,1386.43,1341.27,1323.48,1359.78,1403.45,1443.42,1437.82,1394.51,1422.29,1480.4,1512.31,1550.83,1570.7,1639.84,1618.77,1668.68,1670.09,1687.17,1720.03,1783.54,1807.78,1822.36,1817.04,1863.52,1864.26,1889.77,1947.09,1973.1,1961.53,1993.23,1937.27,2044.57,2054.27,2028.18,2082.2,2079.99,2094.86,2111.94,2099.29,2094.14,2039.87,1944.41,2024.81,2080.62,2054.08,1918.6,1904.42,2021.95,2075.54,2065.55,2083.89,2148.9,2170.95,2157.69,2143.02,2164.99,2246.63,2275.12,2329.91,2366.82,2359.31,2395.35,2433.99,2454.1,2456.22,2492.84,2557,2593.61,2664.34,2789.8,2705.16,2702.77,2653.63,2701.49,2754.35,2793.64,2857.82,2901.5,2785.46,2723.23,2567.31,2607.39,2754.86,2803.98,2903.8,2854.71,2890.17,2996.1136363636365,2897.498181818182,2982.156,2977.68,3104.9044999999996,3176.7495238095235,3278.2028571428577,3277.3142105263164,2652.3936363636367,2761.975238095238,2919.615,3104.6609090909087,3207.6190909090906,3391.71,3365.5166666666664,3418.701363636364,3548.992500000001,3695.3099999999995,3793.748421052632,3883.4321052631576,3910.5082608695648,4141.176190476191,4167.849500000001,4238.489545454546,4363.7128571428575,4454.206363636363,4445.543333333333,4460.707142857143,4667.386666666667,4674.772727272726,4573.8155,4435.980526315789,4391.265217391306,4391.295999999999,4040.3599999999997,3898.9466666666676,3911.729499999999,4158.5630434782615,3850.520476190475,3726.050952380952,3917.488571428571,3912.380952380953,3960.6565,4079.684736842105,3968.5591304347827,4121.467368421053,4146.1731818181825,4345.372857142857],D:[.26,.26,.26,.26,.26,.26,.26,.26,.26,.26,.26,.26,.2633,.2667,.27,.2733,.2767,.28,.2833,.2867,.29,.2933,.2967,.3,.3025,.305,.3075,.31,.3125,.315,.3175,.32,.3225,.325,.3275,.33,.33,.33,.33,.33,.33,.33,.33,.33,.33,.33,.33,.33,.3275,.325,.3225,.32,.3175,.315,.3125,.31,.3075,.305,.3025,.3,.3,.3,.3,.3,.3,.3,.3,.3,.3,.3,.3,.3,.2908,.2817,.2725,.2633,.2542,.245,.2358,.2267,.2175,.2083,.1992,.19,.1892,.1883,.1875,.1867,.1858,.185,.1842,.1833,.1825,.1817,.1808,.18,.1817,.1833,.185,.1867,.1883,.19,.1917,.1933,.195,.1967,.1983,.2,.205,.21,.215,.22,.225,.23,.235,.24,.245,.25,.255,.26,.265,.27,.275,.28,.285,.29,.295,.3,.305,.31,.315,.32,.32,.32,.32,.32,.32,.32,.32,.32,.32,.32,.32,.32,.3208,.3217,.3225,.3233,.3242,.325,.3258,.3267,.3275,.3283,.3292,.33,.3283,.3267,.325,.3233,.3217,.32,.3183,.3167,.315,.3133,.3117,.31,.3042,.2983,.2925,.2867,.2808,.275,.2692,.2633,.2575,.2517,.2458,.24,.2383,.2367,.235,.2333,.2317,.23,.2283,.2267,.225,.2233,.2217,.22,.2225,.225,.2275,.23,.2325,.235,.2375,.24,.2425,.245,.2475,.25,.2483,.2467,.245,.2433,.2417,.24,.2383,.2367,.235,.2333,.2317,.23,.2292,.2283,.2275,.2267,.2258,.225,.2242,.2233,.2225,.2217,.2208,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.22,.2217,.2233,.225,.2267,.2283,.23,.2317,.2333,.235,.2367,.2383,.24,.2408,.2417,.2425,.2433,.2442,.245,.2458,.2467,.2475,.2483,.2492,.25,.2467,.2433,.24,.2367,.2333,.23,.2267,.2233,.22,.2167,.2133,.21,.2083,.2067,.205,.2033,.2017,.2,.1983,.1967,.195,.1933,.1917,.19,.1892,.1883,.1875,.1867,.1858,.185,.1842,.1833,.1825,.1817,.1808,.18,.18,.18,.18,.18,.18,.18,.18,.18,.18,.18,.18,.18,.1817,.1833,.185,.1867,.1883,.19,.1917,.1933,.195,.1967,.1983,.2,.2008,.2017,.2025,.2033,.2042,.205,.2058,.2067,.2075,.2083,.2092,.21,.2175,.225,.2325,.24,.2475,.255,.2625,.27,.2775,.285,.2925,.3,.3017,.3033,.305,.3067,.3083,.31,.3117,.3133,.315,.3167,.3183,.32,.3208,.3217,.3225,.3233,.3242,.325,.3258,.3267,.3275,.3283,.3292,.33,.3317,.3333,.335,.3367,.3383,.34,.3417,.3433,.345,.3467,.3483,.35,.3467,.3433,.34,.3367,.3333,.33,.3267,.3233,.32,.3167,.3133,.31,.3117,.3133,.315,.3167,.3183,.32,.3217,.3233,.325,.3267,.3283,.33,.3358,.3417,.3475,.3533,.3592,.365,.3708,.3767,.3825,.3883,.3942,.4,.4033,.4067,.41,.4133,.4167,.42,.4233,.4267,.43,.4333,.4367,.44,.4367,.4333,.43,.4267,.4233,.42,.4167,.4133,.41,.4067,.4033,.4,.4033,.4067,.41,.4133,.4167,.42,.4233,.4267,.43,.4333,.4367,.44,.4425,.445,.4475,.45,.4525,.455,.4575,.46,.4625,.465,.4675,.47,.47,.47,.47,.47,.47,.47,.47,.47,.47,.47,.47,.47,.4708,.4717,.4725,.4733,.4742,.475,.4758,.4767,.4775,.4783,.4792,.48,.48,.48,.48,.48,.48,.48,.48,.48,.48,.48,.48,.48,.475,.47,.465,.46,.455,.45,.445,.44,.435,.43,.425,.42,.4208,.4217,.4225,.4233,.4242,.425,.4258,.4267,.4275,.4283,.4292,.43,.4408,.4517,.4625,.4733,.4842,.495,.5058,.5167,.5275,.5383,.5492,.56,.5708,.5817,.5925,.6033,.6142,.625,.6358,.6467,.6575,.6683,.6792,.69,.68,.67,.66,.65,.64,.63,.62,.61,.6,.59,.58,.57,.5667,.5633,.56,.5567,.5533,.55,.5467,.5433,.54,.5367,.5333,.53,.5283,.5267,.525,.5233,.5217,.52,.5183,.5167,.515,.5133,.5117,.51,.5058,.5017,.4975,.4933,.4892,.485,.4808,.4767,.4725,.4683,.4642,.46,.4642,.4683,.4725,.4767,.4808,.485,.4892,.4933,.4975,.5017,.5058,.51,.5117,.5133,.515,.5167,.5183,.52,.5217,.5233,.525,.5267,.5283,.53,.5317,.5333,.535,.5367,.5383,.54,.5417,.5433,.545,.5467,.5483,.55,.5542,.5583,.5625,.5667,.5708,.575,.5792,.5833,.5875,.5917,.5958,.6,.6075,.615,.6225,.63,.6375,.645,.6525,.66,.6675,.675,.6825,.69,.6967,.7033,.71,.7167,.7233,.73,.7367,.7433,.75,.7567,.7633,.77,.7767,.7833,.79,.7967,.8033,.81,.8167,.8233,.83,.8367,.8433,.85,.86,.87,.88,.89,.9,.91,.92,.93,.94,.95,.96,.97,.9708,.9717,.9725,.9733,.9742,.975,.9758,.9767,.9775,.9783,.9792,.98,.9667,.9533,.94,.9267,.9133,.9,.8867,.8733,.86,.8467,.8333,.82,.7933,.7667,.74,.7133,.6867,.66,.6333,.6067,.58,.5533,.5267,.5,.495,.49,.485,.48,.475,.47,.465,.46,.455,.45,.445,.44,.4408,.4417,.4425,.4433,.4442,.445,.4458,.4467,.4475,.4483,.4492,.45,.45,.45,.45,.446667,.443333,.44,.44,.44,.44,.45,.46,.47,.48,.49,.5,.516667,.533333,.55,.57,.59,.61,.646667,.683333,.72,.73,.74,.75,.78,.81,.84,.816667,.793333,.77,.78,.79,.8,.793333,.786667,.78,.766667,.753333,.74,.713333,.686667,.66,.61,.56,.51,.513333,.516667,.52,.523333,.526667,.53,.54,.55,.56,.58,.6,.62,.623333,.626667,.63,.636667,.643333,.65,.656667,.663333,.67,.67,.67,.67,.673333,.676667,.68,.683333,.686667,.69,.693333,.696667,.7,.703333,.706667,.71,.703333,.696667,.69,.68,.67,.66,.646667,.633333,.62,.61,.6,.59,.59,.59,.59,.59,.59,.59,.593333,.596667,.6,.603333,.606667,.61,.613333,.616667,.62,.623333,.626667,.63,.633333,.636667,.64,.64,.64,.64,.643333,.646667,.65,.65,.65,.65,.653333,.656667,.66,.66,.66,.66,.666667,.673333,.68,.68,.68,.68,.683333,.686667,.69,.696667,.703333,.71,.713333,.716667,.72,.733333,.746667,.76,.77,.78,.79,.806667,.823333,.84,.843333,.846667,.85,.85,.85,.85,.856667,.863333,.87,.89,.91,.93,.946667,.963333,.98,.993333,1.00667,1.02,1.02667,1.03333,1.04,1.07333,1.10667,1.14,1.15,1.16,1.17,1.18,1.19,1.2,1.24333,1.28667,1.33,1.37667,1.42333,1.47,1.48667,1.50333,1.52,1.53333,1.54667,1.56,1.54667,1.53333,1.52,1.48333,1.44667,1.41,1.41333,1.41667,1.42,1.43,1.44,1.45,1.45,1.45,1.45,1.43667,1.42333,1.41,1.41,1.41,1.41,1.41333,1.41667,1.42,1.42,1.42,1.42,1.43,1.44,1.45,1.45667,1.46333,1.47,1.46333,1.45667,1.45,1.45667,1.46333,1.47,1.49333,1.51667,1.54,1.54667,1.55333,1.56,1.56333,1.56667,1.57,1.58667,1.60333,1.62,1.62667,1.63333,1.64,1.67,1.7,1.73,1.75333,1.77667,1.8,1.81333,1.82667,1.84,1.80667,1.77333,1.74,1.73667,1.73333,1.73,1.73,1.73,1.73,1.74,1.75,1.76,1.77,1.78,1.79,1.78333,1.77667,1.77,1.75667,1.74333,1.73,1.73,1.73,1.73,1.73667,1.74333,1.75,1.75667,1.76333,1.77,1.77667,1.78333,1.79,1.79667,1.80333,1.81,1.81667,1.82333,1.83,1.86667,1.90333,1.94,1.94333,1.94667,1.95,1.95,1.95,1.95,1.95,1.95,1.95,1.94667,1.94333,1.94,1.94,1.94,1.94,1.94667,1.95333,1.96,1.98,2,2.02,2.02667,2.03333,2.04,2.04667,2.05333,2.06,2.06667,2.07333,2.08,2.09667,2.11333,2.13,2.13667,2.14333,2.15,2.16667,2.18333,2.2,2.20333,2.20667,2.21,2.23333,2.25667,2.28,2.29667,2.31333,2.33,2.34667,2.36333,2.38,2.4,2.42,2.44,2.46,2.48,2.5,2.51667,2.53333,2.55,2.57,2.59,2.61,2.62667,2.64333,2.66,2.68,2.7,2.72,2.74,2.76,2.78,2.79667,2.81333,2.83,2.85,2.87,2.89,2.88333,2.87667,2.87,2.88,2.89,2.9,2.9,2.9,2.9,2.90667,2.91333,2.92,2.92,2.92,2.92,2.93,2.94,2.95,2.96333,2.97667,2.99,3.00333,3.01667,3.03,3.04333,3.05667,3.07,3.08,3.09,3.1,3.11,3.12,3.13,3.13667,3.14333,3.15,3.15333,3.15667,3.16,3.16333,3.16667,3.17,3.17333,3.17667,3.18,3.18333,3.18667,3.19,3.17333,3.15667,3.14,3.13,3.12,3.11,3.10667,3.10333,3.1,3.09667,3.09333,3.09,3.08333,3.07667,3.07,3.07,3.07,3.07,3.07,3.07,3.07,3.07333,3.07667,3.08,3.10333,3.12667,3.15,3.15667,3.16333,3.17,3.18667,3.20333,3.22,3.23667,3.25333,3.27,3.30667,3.34333,3.38,3.4,3.42,3.44,3.46,3.48,3.5,3.53,3.56,3.59,3.59333,3.59667,3.6,3.62333,3.64667,3.67,3.68333,3.69667,3.71,3.71,3.71,3.71,3.7,3.69,3.68,3.68333,3.68667,3.69,3.71333,3.73667,3.76,3.79,3.82,3.85,3.91667,3.98333,4.05,4.09667,4.14333,4.19,4.24667,4.30333,4.36,4.40667,4.45333,4.5,4.55667,4.61333,4.67,4.71333,4.75667,4.8,4.83667,4.87333,4.91,4.94667,4.98333,5.02,5.03667,5.05333,5.07,5.11333,5.15667,5.2,5.24667,5.29333,5.34,5.39667,5.45333,5.51,5.55667,5.60333,5.65,5.7,5.75,5.8,5.84667,5.89333,5.94,5.98333,6.02667,6.07,6.1,6.13,6.16,6.2,6.24,6.28,6.31667,6.35333,6.39,6.43333,6.47667,6.52,6.55667,6.59333,6.63,6.66,6.69,6.72,6.75,6.78,6.81,6.82333,6.83667,6.85,6.85667,6.86333,6.87,6.88333,6.89667,6.91,6.92,6.93,6.94,6.96,6.98,7,7.03,7.06,7.09,7.12,7.15,7.18,7.22333,7.26667,7.31,7.33333,7.35667,7.38,7.43,7.48,7.53,7.57333,7.61667,7.66,7.68667,7.71333,7.74,7.77333,7.80667,7.84,7.86,7.88,7.9,7.94,7.98,8.02,8.04667,8.07333,8.1,8.14333,8.18667,8.23,8.24667,8.26333,8.28,8.3,8.32,8.34,8.4,8.46,8.52,8.56667,8.61333,8.66,8.71,8.76,8.81,8.85667,8.90333,8.95,9.04333,9.13667,9.23,9.30667,9.38333,9.46,9.55,9.64,9.75,9.81333,9.89667,10.01,10.0867,10.1933,10.37,10.4233,10.5467,10.73,10.7967,10.9233,11.06,11.14,11.23,11.32,11.4367,11.5533,11.66,11.7267,11.7833,11.83,11.9267,12.0133,12.09,12.1067,12.1133,12.11,12.13,12.14,12.15,12.1933,12.2367,12.28,12.2533,12.2267,12.2,12.24,12.28,12.32,12.32,12.32,12.32,12.3433,12.3667,12.4,12.3867,12.3833,12.39,12.4133,12.4467,12.48,12.4933,12.5067,12.52,12.52,12.52,12.52,12.54,12.56,12.58,12.6233,12.6667,12.71,12.7533,12.7967,12.84,12.87,12.9,12.92,13.0133,13.0967,13.17,13.18,13.18,13.17,13.2433,13.3067,13.36,13.44,13.51,13.58,13.65,13.72,13.79,13.8933,13.9967,14.1,14.1567,14.2133,14.27,14.4,14.53,14.66,14.74,14.82,14.9,14.9533,15.0067,15.06,15.0933,15.1267,15.16,15.2167,15.2733,15.33,15.3867,15.4433,15.5,15.55,15.6,15.64,15.75,15.85,15.95,16.0167,16.0833,16.14,16.1667,16.1833,16.2,16.28333333,16.36666667,16.45,16.45,16.45,16.45,16.513333333333335,16.576666666666668,16.64,16.656666666666666,16.673333333333332,16.69,16.713333333333335,16.736666666666668,16.76,16.740000000000002,16.72,16.7,16.583333333333332,16.46666666666667,16.35,16.323333333333334,16.296666666666667,16.27,16.169999999999998,16.07,15.97,15.876666666666665,15.783333333333331,15.69,15.706666666666667,15.723333333333333,15.74,15.740000000000002,15.740000000000002,15.74,15.736666666666668,15.733333333333334,15.73,15.833333333333332,15.936666666666667,16.04,15.96,15.879999999999999,15.8,15.89,15.98,16.07,16.119999999999997,16.169999999999998,16.22,16.203333333333333,16.186666666666667,16.17,16.310000000000002,16.450000000000003,16.59,16.85666666666667,17.123333333333335,17.39,17.6,17.810000000000002,18.02,18.213333333333335,18.406666666666666,18.6,18.78666666666667,18.973333333333333,19.16,19.253333333333334,19.346666666666668,19.44,19.703333333333333,19.96666666666667,20.23,20.46333333333333,20.696666666666665,20.93,21.11,21.29,21.47,21.72,21.97,22.22,22.406666666666666,22.593333333333334,22.78,23,23.22,23.44,23.66,23.88,24.1,24.36,24.619999999999997,24.88,25.083333333333332,25.286666666666665,25.49,25.71666666666667,25.943333333333335,26.17,26.440000000000005,26.71,26.98,27.230000000000004,27.480000000000004,27.73,27.92,28.11,28.3,28.436666666666667,28.573333333333334,28.71,28.756666666666668,28.803333333333335,28.85,28.696666666666665,28.543333333333333,28.39,28.013333333333335,27.63666666666667,27.26,26.703333333333333,26.14666666666667,25.59,25.026666666666664,24.46333333333333,23.9,23.403333333333332,22.906666666666666,22.41,22.24,22.07,21.9,21.946666666666665,21.993333333333332,22.04,22.143333333333334,22.246666666666666,22.35,22.476666666666667,22.603333333333335,22.73,22.963333333333335,23.196666666666665,23.43,23.733333333333334,24.036666666666665,24.34,24.619999999999997,24.9,25.18,25.596666666666664,26.013333333333335,26.43,26.736666666666668,27.043333333333337,27.35,27.673333333333332,27.996666666666666,28.32,28.743333333333332,29.166666666666664,29.59,30.14333333333333,30.696666666666665,31.25,31.536666666666665,31.82333333333333,32.11,32.49666666666667,32.88333333333334,33.27,33.64666666666667,34.02333333333333,34.4,34.596666666666664,34.79333333333334,34.99,35.403333333333336,35.81666666666666,36.23,36.61333333333333,36.99666666666667,37.38,37.75,38.120000000000005,38.49,38.806666666666665,39.123333333333335,39.44,39.89666666666667,40.35333333333333,40.81,41.120000000000005,41.43,41.74,41.99666666666667,42.25333333333333,42.51,42.803333333333335,43.096666666666664,43.39,43.553333333333335,43.71666666666667,43.88,44.07333333333334,44.266666666666666,44.46,44.65,44.84,45.03,45.25333333333333,45.47666666666667,45.7,45.92666666666667,46.153333333333336,46.38,46.660000000000004,46.94,47.22,47.53666666666667,47.85333333333334,48.17,48.42333333333333,48.67666666666666,48.93,49.28666666666666,49.64333333333333,50,50.33,50.66,50.99,51.44,51.89,52.34,52.81,53.28,53.75,54.14666666666667,54.54333333333334,54.94,55.319091580592705,55.69818316118541,56.07727474177812,56.45818316118542,56.83909158059271,57.22,57.56,57.900000000000006,58.24,58.686867862126704,59.13373572425341,59.58060358638012,59.61373572425342,59.64686786212671,59.68,59.403333333333336,59.126666666666665,58.85,58.659615378670054,58.469230757340114,58.27884613601017,58.06369311230766,57.84854008860516,57.63338706490265,57.71060542140715,57.787823777911655,57.86504213441615,58.32818900579217,58.79133587716819,59.254482748544206,59.63536092649366,60.01623910444312,60.397117282392585,60.921402962953294,61.44568864351402,61.969974324074734,62.65331621604982,63.336658108024906,64.02,64.4527684478357,64.8855368956714,65.31830534350709,65.85220356233806,66.38610178116903,66.92,67.35,67.78,68.21,68.37666666666667,68.54333333333332,68.71],CPI:[12.46,12.84,13.03,12.56,12.27,12.08,12.08,11.89,12.18,12.37,12.37,12.65,12.65,12.65,12.84,13.13,13.13,13.03,12.84,12.94,13.03,12.75,13.13,12.94,12.94,13.23,13.23,13.23,12.94,12.56,12.56,12.56,12.56,12.27,11.89,12.18,12.37,12.37,12.37,12.18,12.08,11.8,11.89,11.8,11.8,11.61,11.51,11.51,11.51,11.51,11.51,11.61,11.32,11.13,11.13,11.23,11.13,11.13,11.04,10.94,10.85,10.85,10.85,10.75,10.37,10.09,10.09,10.18,10.28,10.47,10.56,10.75,10.94,10.66,10.18,10.47,10.66,10.09,10.18,9.8,9.7,9.7,9.51,9.51,9.23,9.13,8.94,8.85,8.56,8.37,8.47,8.56,8.56,8.47,8.37,8.18,8.28,8.37,8.28,8.18,8.18,8.09,8.18,8.18,8.47,8.94,9.42,9.7,9.99,9.99,10.09,9.7,9.42,9.23,9.23,9.23,9.32,9.32,9.42,9.51,9.42,9.51,9.51,9.61,9.51,9.51,9.61,9.8,10.18,10.28,10.18,10.18,10.18,10.28,10.28,10.37,10.47,10.56,10.47,10.56,10.28,10.18,10.09,9.99,9.99,10.09,9.99,9.9,9.8,9.51,9.32,9.32,9.23,9.23,9.13,9.23,9.23,9.23,9.23,9.04,8.85,8.85,8.75,8.75,8.66,8.56,8.37,8.28,8.28,8.37,8.18,8.28,8.09,7.9,7.99,7.99,7.9,7.9,7.99,8.18,7.99,7.99,7.9,7.8,7.61,7.52,7.61,7.71,7.71,7.71,7.71,7.8,7.99,8.09,8.09,8.09,8.09,7.99,7.9,7.99,7.9,7.99,8.09,8.28,8.37,8.28,8.28,8.18,8.09,7.99,8.09,8.09,8.09,8.18,8.28,8.28,7.99,7.9,7.8,7.8,7.61,7.61,7.61,7.61,7.71,7.71,7.71,7.8,7.61,7.61,7.61,7.61,7.71,7.71,7.71,7.99,8.09,8.09,7.9,7.9,7.8,7.9,7.99,8.09,7.99,7.8,7.71,7.71,7.61,7.61,7.52,7.52,7.33,7.33,7.14,7.04,7.04,7.04,7.23,7.33,7.33,7.33,7.52,7.61,7.9,7.99,7.8,7.71,7.61,7.42,7.23,6.95,7.23,7.33,7.14,7.04,6.85,6.76,6.57,6.57,6.57,6.57,6.57,6.76,6.85,6.66,6.66,6.57,6.57,6.57,6.57,6.85,6.95,7.04,6.95,6.85,6.85,6.85,6.85,6.76,6.66,6.57,6.57,6.47,6.37,6.28,6.28,6.28,6.28,6.47,6.66,6.66,6.47,6.47,6.47,6.37,6.28,6.28,6.28,6.57,6.76,6.66,6.66,6.66,6.66,6.76,6.76,6.76,7.23,6.76,6.66,6.66,6.66,6.66,6.66,6.76,6.76,6.95,6.95,7.04,7.04,7.14,7.23,7.33,7.61,7.71,7.8,7.9,7.9,7.99,7.99,7.99,7.8,7.71,7.8,7.71,7.8,7.71,7.71,7.61,7.71,7.61,7.61,7.52,7.52,7.52,7.61,7.71,7.8,7.8,7.9,7.99,7.9,7.9,7.9,7.99,8.09,8.18,8.18,8.09,8.18,8.75,8.47,8.56,8.66,8.66,8.37,8.37,8.18,8.18,8.18,8.18,8.28,8.18,8.09,8.09,8.28,8.47,8.37,8.28,8.09,8.09,8.09,8.18,8.28,8.28,8.47,8.47,8.47,8.47,8.37,8.37,8.28,8.28,8.28,8.37,8.28,8.28,8.37,8.47,8.47,8.47,8.47,8.47,8.56,8.56,8.28,8.47,8.56,8.75,8.85,8.94,8.85,9.04,8.94,8.94,9.13,9.23,9.23,9.23,9.23,9.32,8.94,8.75,8.66,8.56,8.56,8.66,8.66,8.66,8.75,8.75,8.75,8.85,8.94,9.04,8.94,9.04,9.04,9.23,9.32,9.42,9.42,9.51,9.61,9.8,9.9,9.99,9.9,9.9,10.09,10.18,9.99,9.9,9.9,9.8,9.7,9.42,9.23,9.23,9.23,8.94,9.04,8.75,8.75,8.75,8.85,9.13,9.23,9.23,9.13,9.04,9.13,9.23,9.42,9.7,9.7,9.61,9.61,9.7,9.8,9.8,9.8,9.7,9.8,9.8,9.8,9.8,9.7,9.8,9.9,9.9,10,10,10.1,10,10,9.9,9.9,9.8,9.9,9.9,10,10.2,10.2,10.1,10.2,10.1,10.1,10,9.9,10,10.1,10.1,10.1,10.1,10.1,10.2,10.3,10.3,10.4,10.4,10.5,10.6,10.7,10.8,10.8,10.9,11.1,11.3,11.5,11.6,11.7,12,12,12.6,12.8,13,12.8,13,13.3,13.5,13.5,13.7,14,14.1,14,14.2,14.5,14.7,15.1,15.4,15.7,16,16.3,16.5,16.5,16.2,16.4,16.7,16.9,16.9,17.4,17.7,17.8,18.1,18.5,18.9,19.3,19.5,19.7,20.3,20.6,20.9,20.8,20.3,20,19.9,19.8,19.4,19,18.4,18.3,18.1,17.7,17.6,17.7,17.7,17.5,17.5,17.4,17.3,16.9,16.9,16.7,16.7,16.7,16.7,16.8,16.6,16.6,16.7,16.8,16.9,16.8,16.8,16.8,16.9,16.9,17,17.2,17.1,17.2,17.3,17.3,17.3,17.3,17.2,17.1,17,17,17,17.1,17,17.1,17.2,17.2,17.3,17.3,17.2,17.3,17.2,17.3,17.5,17.7,17.7,17.7,17.7,18,17.9,17.9,17.9,17.8,17.9,17.8,17.7,17.5,17.4,17.5,17.6,17.7,17.7,17.5,17.4,17.3,17.3,17.4,17.6,17.3,17.2,17.3,17.4,17.3,17.3,17.3,17.1,17.1,17.1,17.2,17.1,17.1,17.1,17.3,17.2,17.2,17.1,17.1,17.1,17,16.9,17,17.1,17.3,17.3,17.3,17.3,17.3,17.2,17.1,17,16.9,17,16.9,16.8,16.6,16.5,16.6,16.5,16.4,16.1,15.9,15.7,15.6,15.5,15.3,15.1,15.1,15.1,15,14.9,14.7,14.6,14.3,14.1,14,13.9,13.7,13.6,13.6,13.5,13.4,13.3,13.2,13.1,12.9,12.7,12.6,12.6,12.6,12.7,13.1,13.2,13.2,13.2,13.2,13.2,13.2,13.3,13.3,13.3,13.3,13.4,13.4,13.4,13.6,13.5,13.5,13.4,13.6,13.7,13.7,13.8,13.8,13.7,13.7,13.7,13.7,13.7,13.8,13.8,13.8,13.8,13.7,13.7,13.7,13.8,13.9,14,14,14,14,14,14.1,14.1,14.2,14.3,14.4,14.4,14.5,14.5,14.6,14.6,14.5,14.4,14.2,14.1,14.1,14.2,14.1,14.1,14.1,14.1,14.1,14,14,14,14,13.9,13.9,13.8,13.8,13.8,13.8,13.8,14.1,14,14,14,13.9,14,14,14,14,14.1,14,14,14,14,14,14.1,14.1,14.1,14.2,14.3,14.4,14.7,14.7,14.9,15.1,15.3,15.4,15.5,15.7,15.8,16,16.1,16.3,16.3,16.4,16.5,16.5,16.7,16.8,16.9,16.9,16.9,17.2,17.4,17.5,17.5,17.4,17.3,17.4,17.4,17.4,17.4,17.4,17.4,17.4,17.5,17.5,17.6,17.7,17.7,17.7,17.7,17.7,17.8,17.8,17.8,17.8,17.8,17.9,18.1,18.1,18.1,18.1,18.1,18.1,18.2,18.2,18.1,18.3,18.4,18.5,18.7,19.8,20.2,20.4,20.8,21.3,21.5,21.5,21.5,21.9,21.9,21.9,22,22.2,22.5,23,23,23.1,23.4,23.7,23.5,23.4,23.8,23.9,24.1,24.4,24.5,24.5,24.4,24.2,24.1,24,23.8,23.8,23.9,23.8,23.9,23.7,23.8,23.9,23.7,23.8,23.6,23.5,23.5,23.6,23.6,23.7,23.8,24.1,24.3,24.4,24.6,24.7,25,25.4,25.7,25.8,25.8,25.9,25.9,25.9,25.9,26.1,26.2,26.4,26.5,26.5,26.3,26.3,26.4,26.4,26.5,26.7,26.7,26.7,26.7,26.7,26.7,26.6,26.5,26.6,26.6,26.7,26.8,26.8,26.9,26.9,27,26.9,26.9,26.9,26.9,26.9,26.8,26.9,26.9,26.9,26.9,26.8,26.8,26.8,26.7,26.7,26.7,26.7,26.7,26.7,26.7,26.8,26.8,26.9,26.9,26.9,26.8,26.8,26.8,26.8,26.9,27,27.2,27.4,27.3,27.4,27.5,27.5,27.6,27.6,27.7,27.8,27.9,28,28.1,28.3,28.3,28.3,28.3,28.4,28.4,28.6,28.6,28.8,28.9,28.9,28.9,29,28.9,28.9,28.9,29,28.9,29,28.9,28.9,29,29,29.1,29.2,29.2,29.3,29.4,29.4,29.4,29.3,29.4,29.4,29.5,29.5,29.6,29.6,29.6,29.6,29.8,29.8,29.8,29.8,29.8,29.8,29.8,29.8,29.8,30,29.9,30,30,30,30,30,30.1,30.1,30.2,30.2,30.2,30.3,30.3,30.4,30.4,30.4,30.4,30.4,30.4,30.5,30.5,30.5,30.6,30.7,30.7,30.7,30.8,30.8,30.9,30.9,30.9,30.9,30.9,30.9,31,31.1,31,31.1,31.1,31.2,31.2,31.2,31.2,31.3,31.4,31.4,31.6,31.6,31.6,31.6,31.7,31.7,31.8,31.8,32,32.1,32.3,32.3,32.4,32.5,32.7,32.7,32.9,32.9,32.9,32.9,32.9,33,33.1,33.2,33.3,33.4,33.5,33.6,33.7,33.8,33.9,34.1,34.2,34.3,34.4,34.5,34.7,34.9,35,35.1,35.3,35.4,35.5,35.6,35.8,36.1,36.3,36.4,36.6,36.8,37,37.1,37.3,37.5,37.7,37.8,38,38.2,38.5,38.6,38.8,39,39,39.2,39.4,39.6,39.8,39.8,39.9,40,40.1,40.3,40.6,40.7,40.8,40.8,40.9,40.9,41.1,41.1,41.3,41.4,41.5,41.6,41.7,41.9,42,42.1,42.3,42.4,42.5,42.6,42.9,43.3,43.6,43.9,44.2,44.3,45.1,45.2,45.6,45.9,46.2,46.6,47.2,47.8,48,48.6,49,49.4,50,50.6,51.1,51.5,51.9,52.1,52.5,52.7,52.9,53.2,53.6,54.2,54.3,54.6,54.9,55.3,55.5,55.6,55.8,55.9,56.1,56.5,56.8,57.1,57.4,57.6,57.9,58,58.2,58.5,59.1,59.5,60,60.3,60.7,61,61.2,61.4,61.6,61.9,62.1,62.5,62.9,63.4,63.9,64.5,65.2,65.7,66,66.5,67.1,67.4,67.7,68.3,69.1,69.8,70.6,71.5,72.3,73.1,73.8,74.6,75.2,75.9,76.7,77.8,78.9,80.1,81,81.8,82.7,82.7,83.3,84,84.8,85.5,86.3,87,87.9,88.5,89.1,89.8,90.6,91.6,92.3,93.2,93.4,93.7,94,94.3,94.6,94.5,94.9,95.8,97,97.5,97.7,97.9,98.2,98,97.6,97.8,97.9,97.9,98.6,99.2,99.5,99.9,100.2,100.7,101,101.2,101.3,101.9,102.4,102.6,103.1,103.4,103.7,104.1,104.5,105,105.3,105.3,105.3,105.5,106,106.4,106.9,107.3,107.6,107.8,108,108.3,108.7,109,109.3,109.6,109.3,108.8,108.6,108.9,109.5,109.5,109.7,110.2,110.3,110.4,110.5,111.2,111.6,112.1,112.7,113.1,113.5,113.8,114.4,115,115.3,115.4,115.4,115.7,116,116.5,117.1,117.5,118,118.5,119,119.8,120.2,120.3,120.5,121.1,121.6,122.3,123.1,123.8,124.1,124.4,124.6,125,125.6,125.9,126.1,127.4,128,128.7,128.9,129.2,129.9,130.4,131.6,132.7,133.5,133.8,133.8,134.6,134.8,135,135.2,135.6,136,136.2,136.6,137.2,137.4,137.8,137.9,138.1,138.6,139.3,139.5,139.7,140.2,140.5,140.9,141.3,141.8,142,141.9,142.6,143.1,143.6,144,144.2,144.4,144.4,144.8,145.1,145.7,145.8,145.8,146.2,146.7,147.2,147.4,147.5,148,148.4,149,149.4,149.5,149.7,149.7,150.3,150.9,151.4,151.9,152.2,152.5,152.5,152.9,153.2,153.7,153.6,153.5,154.4,154.9,155.7,156.3,156.6,156.7,157,157.3,157.8,158.3,158.6,158.6,159.1,159.6,160,160.2,160.1,160.3,160.5,160.8,161.2,161.6,161.5,161.3,161.6,161.9,162.2,162.5,162.8,163,163.2,163.4,163.6,164,164,163.9,164.3,164.5,165,166.2,166.2,166.2,166.7,167.1,167.9,168.2,168.3,168.3,168.8,169.8,171.2,171.3,171.5,172.4,172.8,172.8,173.7,174,174.1,174,175.1,175.8,176.2,176.9,177.7,178,177.5,177.5,178.3,177.7,177.4,176.7,177.1,177.8,178.8,179.8,179.8,179.9,180.1,180.7,181,181.3,181.3,180.9,181.7,183.1,184.2,183.8,183.5,183.7,183.9,184.6,185.2,185,184.5,184.3,185.2,186.2,187.4,188,189.1,189.7,189.4,189.5,189.9,190.9,191,190.3,190.7,191.8,193.3,194.6,194.4,194.5,195.4,196.4,198.8,199.2,197.6,196.8,198.3,198.7,199.8,201.5,202.5,202.9,203.5,203.9,202.9,201.8,201.5,201.8,202.42,203.5,205.35,206.69,207.95,208.35,208.3,207.92,208.49,208.94,210.18,210.04,211.08,211.69,213.53,214.82,216.63,218.81,219.96,219.09,218.78,216.57,212.43,210.23,211.14,212.19,212.71,213.24,213.86,215.69,215.35,215.83,215.97,216.18,216.33,215.95,216.69,216.74,217.63,218.01,218.18,217.97,218.01,218.31,218.44,218.71,218.8,219.18,220.22,221.31,223.47,224.91,225.96,225.72,225.92,226.54,226.89,226.42,226.23,225.67,226.66,227.66,229.39,230.09,229.81,229.48,229.1,230.38,231.41,231.32,230.22,229.6,230.28,232.17,232.77,232.53,232.94,233.5,233.6,233.88,234.15,233.55,233.07,233.05,233.92,234.78,236.29,237.07,237.9,238.34,238.25,237.85,238.03,237.43,236.15,234.81,233.71,234.72,236.12,236.6,237.81,238.64,238.65,238.32,237.94,237.84,237.34,236.53,236.92,237.11,238.13,239.26,240.23,241.02,240.63,240.85,241.43,241.73,241.35,241.43,242.84,243.6,243.8,244.52,244.73,244.96,244.79,245.52,246.82,246.66,246.67,246.52,247.87,248.99,249.55,250.55,251.59,251.99,252.01,252.15,252.44,252.88,252.04,251.23,251.71,252.78,254.2,255.55,256.09,256.14,256.57,256.56,256.76,257.35,257.21,256.97,257.97,258.68,258.12,256.39,256.39,257.8,259.1,259.92,260.28,260.39,260.23,260.47,261.58,263.01,264.88,267.05,269.19,271.7,273,273.57,274.31,276.59,277.95,278.8,281.15,283.72,287.5,289.11,292.3,296.31,296.28,296.17,296.81,298.01,297.71,296.8,299.17,300.84,301.67,303.36,304.13,305.11]};function p_(t=Ea){const{P:e,D:n,CPI:s}=t,r=s[s.length-1],i=e.map((c,d)=>c*r/s[d]),o=n.map((c,d)=>c*r/s[d]),a=new Array(i.length).fill(1);for(let c=1;c<i.length;c++)a[c]=a[c-1]*(i[c]+o[c]/12)/i[c-1];return a}let mc=null;function _l(){return mc||(mc=p_()),mc}function E0(){return{start:Ea.start,end:Ea.end,months:Ea.P.length}}const m_=(t,e)=>(n,s)=>t(n)*Math.pow(1+e,-(n-s/12));function g_({rtr:t,s:e,E0:n,L:s,firstRung:r,maxRung:i,priceForYear:o,b:a=1.2,gp:c=.05}){let d=n,u=r,p=0,f=0;const g=[];for(let v=1;v<=s;v++){d*=t[e+v]/t[e+v-1];const y=n*Math.pow(1+c,v/12);if(d>=a*y&&u<=i){let E=d-y,C=0;for(;u<=i;){const k=o(u,v);if(E>=k)E-=k,d-=k,p+=1,u+=1,C+=1;else break}C&&(f+=1,g.push({t:v,bought:C}))}}return{V:d,secured:p,sellEvents:f,trades:g}}function y_({rtr:t,s:e,E0:n,reviews:s,firstRung:r,maxRung:i,priceForYear:o,gp:a=.05}){let c=n,d=0,u=r,p=0;const f=[],g=[];for(const v of s){c*=t[e+v]/t[e+d],d=v;const y=n*Math.pow(1+a,v/12),E=c>y;if(g.push({t:v,fired:E}),E){let C=c-y,k=0;for(;u<=i;){const P=o(u,v);if(C>=P)C-=P,c-=P,p+=1,u+=1,k+=1;else break}k&&f.push({t:v,bought:k})}}return{V:c,secured:p,lastReview:d,trades:f,fires:g}}function v_({rtr:t,s:e,V0:n,L:s,ladderYears:r,secured:i,drawForYear:o,END:a,startAge:c=57,spendFlex:d=null}){let u=n;const p=(r+i)*12;for(let f=s;f<a;f++)if(u*=t[e+f+1]/t[e+f],f>=p){let g=o(Math.floor(f/12)+1);if(d&&d.cutPct>0){const v=(a-f)/12,y=g*v;u<(d.floorMult??1)*y&&(g*=1-d.cutPct)}if(u-=g/12,u<=0)return{survived:!1,failAge:c+f/12,terminal:0}}return{survived:!0,failAge:null,terminal:u}}function Rt(t,e){const n=[...t].sort((s,r)=>s-r);return n.length?n[Math.min(n.length-1,Math.floor(e*n.length))]:NaN}const aa={realYield:.023,glideRate:.05,bandThreshold:1.2,startAge:57};function Il(t){const e=_l(),n=f=>t.profile?w0(t.profile,f-1,t.draw):t.draw,s=t.realYield??aa.realYield,r=1+(t.txCostBps||0)/1e4;let i=m_(n,s);const o=(f,g,v)=>(v!=null?n(f)*Math.pow(1+v,-(f-g/12)):i(f,g))*r,a=t.glideRate??aa.glideRate,c=t.startAge??aa.startAge,d=e.length-t.L,u=e.length-t.END,p={meta:{...E0(),stage1N:d,fullN:u,engineVersion:Us},windows:[]};for(let f=0;f<d;f++){let g=null;if(t.yieldVol>0){g=new Array(t.END+1);let k=s,P=f*2654435761>>>0;const R=()=>(P=1103515245*P+12345>>>0,P/4294967296-.5);for(let B=0;B<=t.END;B++)g[B]=k,k=s+.97*(k-s)+t.yieldVol*R()}const v=g?(k,P)=>o(k,P,g[P]):o,y=t.trigger.mode==="band"?g_({rtr:e,s:f,E0:t.E0,L:t.L,firstRung:t.firstRung,maxRung:t.maxRung,priceForYear:v,b:t.trigger.b??aa.bandThreshold,gp:a}):y_({rtr:e,s:f,E0:t.E0,reviews:t.trigger.reviews,firstRung:t.firstRung,maxRung:t.maxRung,priceForYear:v,gp:a});let E=y.V;t.trigger.mode==="calendar"&&y.lastReview<t.L&&(E=y.V*(e[f+t.L]/e[f+y.lastReview]));const C={s:f,secured:y.secured,sellEvents:y.sellEvents??y.trades.length,trades:y.trades,fires:y.fires||null,sleeveAtLadderEnd:E,neverTriggered:t.trigger.mode==="band"?y.sellEvents===0:!(y.fires||[]).some(k=>k.fired),holdMultiple:e[f+t.L]/e[f]};if(f<u){let k;if(t.triggersContinueInDecumulation&&t.trigger.mode==="band"){let P=E,R=y.secured,B=t.firstRung+y.secured,D=!0,I=null;for(let w=t.L;w<t.END;w++){P*=e[f+w+1]/e[f+w];const S=w+1,T=t.E0*Math.pow(1+a,S/12);if(P>=(t.trigger.b??1.2)*T&&B<=t.maxRung){let x=P-T;for(;B<=t.maxRung;){const A=v(B,S);if(x>=A)x-=A,P-=A,R+=1,B+=1;else break}}if(w>=(t.ladderYears+R)*12&&(P-=n(Math.floor(w/12)+1)/12,P<=0)){D=!1,I=c+w/12,P=0;break}}k={survived:D,failAge:I,terminal:P},C.secured=R}else k=v_({rtr:e,s:f,V0:E,L:t.L,ladderYears:t.ladderYears,secured:y.secured,drawForYear:n,END:t.END,startAge:c,spendFlex:t.spendFlex});C.survived=k.survived,C.failAge=k.failAge,C.terminal=k.terminal}p.windows.push(C)}return p.stats=b_(p.windows.slice(0,u),u,t),p}function b_(t,e,n){const s=t.length,r=t.map(u=>u.secured),i=t.map(u=>u.sleeveAtLadderEnd),o=t.filter(u=>u.neverTriggered),a=t.slice(0,e).filter(u=>u.survived!==void 0),c=n.maxRung-n.firstRung+1,d={n:s,neverPct:100*o.length/s,fullySecuredPct:100*t.filter(u=>u.secured>=c).length/s,securedMedian:Rt(r,.5),securedZeroPct:100*r.filter(u=>u===0).length/s,secured8PlusPct:100*r.filter(u=>u>=8).length/s,sleeveMedian:Rt(i,.5),sleeveP10:Rt(i,.1),sleeveWorst:Math.min(...i),holdMedian:Rt(t.map(u=>u.holdMultiple),.5),survivalPct:a.length?100*a.filter(u=>u.survived).length/a.length:null,survivalNeverBranchPct:(()=>{const u=a.filter(p=>p.neverTriggered);return u.length?100*u.filter(p=>p.survived).length/u.length:null})(),terminalMedian:Rt(a.filter(u=>u.terminal!=null).map(u=>u.terminal),.5),sellEventsMedian:Rt(t.map(u=>u.sellEvents),.5),sellEventsMax:Math.max(...t.map(u=>u.sellEvents))};return n.trigger.mode==="calendar"&&(d.reviewFirePct=n.trigger.reviews.map(u=>100*t.filter(p=>(p.fires||[]).some(f=>f.t===u&&f.fired)).length/s)),d}const lp={id:"ladder-and-ratchet",name:"Ladder & Ratchet",promise:"Your full income bolted to the calendar. Growth ratchets more years on.",failure:"If markets never boom, the growth pot arrives small at the far end.",granularity:"windows",describe(){return{id:this.id,name:this.name,promise:this.promise,failure:this.failure,engineVersion:Us,components:["linker ladder (base + ratcheted rungs)","shared trigger discipline (band/calendar)","income profile-sized rungs","real-terms historical windows (Shiller)"],usesTrigger:!0}},engine:{runWindows:Il}};function T0({drawForYear:t,years:e,realYield:n}){let s=0;for(let r=1;r<=e;r++)s+=t(r)*Math.pow(1+n,-r);return s}function Sl(t){const e=_l(),n=e.length-t.END,s=t.rate??.04,r={meta:{...E0(),n,engineVersion:Us},windows:[]},i=t.ratchet,o=(i==null?void 0:i.realYield)??.023,a=(p,f)=>Math.pow(1+o,-(p-f/12));for(let p=0;p<n;p++){let f=t.E0,g=s*t.E0;const v=B=>Math.min(t.flexMax??1/0,Math.max(t.flexMin??0,B));g=v(g);const y=[g];let E=0,C=0;const k={},P=B=>{const D=t.E0*Math.pow(1+(i.gp??.05),B/12);if(f<(i.mode==="band"?i.b??1.2:1)*D)return;let I=f-D;if(i.target==="extend"){const w=i.horizonYears??35;for(;E<(i.maxExtendYears??8);){const S=w+E+1,x=(i.floorDrawForYear?i.floorDrawForYear(S):0)*a(S,B);if(x>0&&I>=x)I-=x,f-=x,E+=1,C+=x;else break}}else if(i.target==="raise"){const w=i.horizonYears??35,S=Math.floor(B/12)+1;for(let T=w;T>S&&I>1e-9;T--){const x=i.floorDrawForYear?i.floorDrawForYear(T):0,A=i.raiseTargetForYear?i.raiseTargetForYear(T):x,_=Math.max(0,A-x-(k[T]||0));if(_<=0)continue;const W=a(T,B),ee=Math.min(_,I/W);if(ee>1e-9){k[T]=(k[T]||0)+ee;const H=ee*W;I-=H,f-=H,C+=H}}}};let R=!1;for(let B=0;B<t.END;B++){f*=e[p+B+1]/e[p+B],t.annuitySwap&&!R&&B===(t.annuitySwap.atYear??20)*12&&f>t.annuitySwap.cost&&(f-=t.annuitySwap.cost,R=!0),f-=g/12;const D=B+1;i&&i.mode==="band"&&P(D),i&&i.mode==="calendar"&&(i.reviews||[]).includes(D)&&P(D),(B+1)%12===0&&(g=v(s*f),B+1<t.END&&y.push(g))}r.windows.push({s:p,terminal:f,dByYear:y,worstYearD:Math.min(...y),yearsUnder:B=>y.filter(D=>D<B).length,extendYears:E,uplift:k,upliftSpent:C,annuitySwapDone:R})}const c=r.windows.map(p=>p.worstYearD),d=r.windows.map(p=>p.terminal),u=r.windows.flatMap(p=>p.dByYear);return r.stats={n,year1D:s*t.E0,worstMedian:Rt(c,.5),worstP10:Rt(c,.1),worstMin:Math.min(...c),shareYearsUnder:p=>100*u.filter(f=>f<p).length/u.length,terminalMedian:Rt(d,.5),terminalP10:Rt(d,.1),terminalMin:Math.min(...d),extendYearsMedian:Rt(r.windows.map(p=>p.extendYears),.5),upliftSpentMedian:Rt(r.windows.map(p=>p.upliftSpent),.5)},r}const cp={id:"floor-and-flex",name:"Floor & Flex",promise:"The bills are paid to a chosen age by contract. Everything else flexes with the market.",failure:"Treats shrink in long bad markets — and the floor is only as right as your essentials number.",granularity:"windows",describe(){return{id:this.id,name:this.name,promise:this.promise,failure:this.failure,engineVersion:Us,components:["essentials floor by contract (linker ladder, profile-capable)","flex sleeve (% of pot, annual reset, optional £ collars)","optional ratchet via the shared trigger discipline","real-terms historical windows (Shiller)"],usesTrigger:!0,sensitivity:"at 2.3% real, every £1k/yr of essentials ≈ £24k of floor cost"}},engine:{runWindows:Sl,floorCost:T0}},w_={POTS_AND_VALVES:"pots-and-valves"},Hc={id:w_.POTS_AND_VALVES,name:"Pots & Valves",promise:"One flexible portfolio. Rules decide which pot pays you this month.",failure:"A long bad run can drain the pots faster than they refill.",granularity:"run",describe(){return{id:this.id,name:this.name,promise:this.promise,failure:this.failure,engineVersion:Us,components:["glidepath floors","shared withdrawal cascade (WithdrawalSourcing)","staged guardrail protection (ProtectionStrategy)","tax-band drawdown (DrawdownStrategy)","tax-boost restoration (TaxBoostStrategy)","income profile (IncomeProfile)"],usesTrigger:!1}},profile:{resolve:f_,targetForYear:w0},engine:{simulate:No,runMonteCarlo:a_,runHistorical:c_,runScenario:d_,monteCarloReturns:Tu,simulateTraced:l_}},_0={[Hc.id]:Hc,[lp.id]:lp,[cp.id]:cp};function ls(t){return _0[t]||Hc}function E_(){return Object.values(_0)}const I0={single:{minimum:14400,moderate:31300,comfortable:43100}},Yc={essential:[{label:"Rent / mortgage",period:"mo",hint:"Your regular housing payment"},{label:"Council tax",period:"mo",hint:""},{label:"Gas",period:"mo",hint:""},{label:"Electricity",period:"mo",hint:""},{label:"Water",period:"mo",hint:""},{label:"Broadband",period:"mo",hint:"Broadband tariff"},{label:"Mobile phones",period:"mo",hint:"Mobile phone tariffs"},{label:"TV licence",period:"yr",hint:""},{label:"Groceries & household",period:"mo",hint:"Food and everyday household items"},{label:"Home insurance",period:"yr",hint:"Buildings & contents"},{label:"Car insurance",period:"yr",hint:""},{label:"Car tax",period:"yr",hint:"DVLA vehicle tax"},{label:"Petrol / fuel",period:"mo",hint:""},{label:"Car servicing & maintenance",period:"yr",hint:"Servicing, MOT, repairs — a big replacement is a One-off cost"},{label:"Boiler service",period:"yr",hint:""},{label:"Personal health",period:"mo",hint:"Prescriptions, dental, optical, health cover"},{label:"Kids / dependents",period:"mo",hint:"Supporting children or other dependents"},{label:"Premier banking / account fees",period:"mo",hint:"Packaged or premier account fees"},{label:"Home upkeep",period:"mo",hint:"Routine maintenance & small repairs — big jobs go in One-off costs"}],discretionary:[{label:"Main holiday",period:"yr",hint:"Your big annual holiday"},{label:"UK breaks",period:"yr",hint:"Weekends & short breaks"},{label:"Day trips",period:"mo",hint:""},{label:"Eating out & takeaways",period:"mo",hint:""},{label:"Streaming & entertainment",period:"mo",hint:"Netflix, Amazon Prime, etc."},{label:"Digital subscriptions",period:"mo",hint:"Cloud storage, AI tools, credit-file, TradingView, broker subscriptions"},{label:"Gym & fitness",period:"mo",hint:"Membership & classes"},{label:"Sports & equipment",period:"yr",hint:"Kit and gear"},{label:"Clothes",period:"mo",hint:"Everyday clothing"},{label:"Sports clothes",period:"yr",hint:""},{label:"Hobbies & leisure",period:"mo",hint:""},{label:"Gifts & family",period:"mo",hint:"Presents, helping family"},{label:"Charity",period:"mo",hint:""},{label:"Pets",period:"mo",hint:"Food, insurance, vet (pet health)"},{label:"Personal spending money",period:"mo",hint:"Day-to-day 'spends'"},{label:"Home furnishings & décor",period:"yr",hint:"Soft furnishings, decorating, furniture refresh"},{label:"Home technology",period:"yr",hint:"Phones, laptops, gadgets"},{label:"Emergency buffer",period:"mo",hint:"A monthly set-aside for the unexpected"}]},T_=[{label:"Eating out & takeaways",tier:"discretionary",period:"mo",hint:"Meals out, takeaways, coffees"},{label:"Life insurance / income protection",tier:"essential",period:"mo",hint:"Protection premiums"},{label:"Health / dental insurance",tier:"essential",period:"mo",hint:"Private medical, dental plan, cash plan"},{label:"Dental & optical",tier:"essential",period:"yr",hint:"Check-ups, glasses, treatment not on the NHS"},{label:"Hearing",tier:"essential",period:"yr",hint:"Hearing tests & aids"},{label:"Breakdown cover",tier:"essential",period:"yr",hint:"AA / RAC vehicle breakdown"},{label:"Parking & permits",tier:"essential",period:"yr",hint:"Residents permit, ULEZ / congestion"},{label:"Public transport",tier:"essential",period:"mo",hint:"Bus, rail, rail card"},{label:"Cleaner / gardener",tier:"essential",period:"mo",hint:"Cleaner, window cleaner, gardener"},{label:"Long-term care set-aside",tier:"essential",period:"mo",hint:"A monthly reserve toward possible later-life care (easily forgotten)"},{label:"Christmas & birthdays",tier:"discretionary",period:"yr",hint:"Seasonal gifts & celebrations"},{label:"Alcohol",tier:"discretionary",period:"mo",hint:"Beer, wine, spirits"},{label:"Hairdressing & grooming",tier:"discretionary",period:"mo",hint:"Haircuts, beauty, barber"},{label:"Newspapers, books & media",tier:"discretionary",period:"mo",hint:"Papers, magazines, books"},{label:"Grandchildren",tier:"discretionary",period:"mo",hint:"Treats, days out, help with costs"},{label:"Professional memberships",tier:"discretionary",period:"yr",hint:"Institutes, unions, clubs"},{label:"Second / holiday home",tier:"discretionary",period:"mo",hint:"Running costs of a second property"},{label:"Storage / lock-up",tier:"discretionary",period:"mo",hint:"Self-storage, garage rental"},{label:"My personal spending",tier:"discretionary",period:"mo",hint:"Your own day-to-day 'spends'",paidBy:"me"},{label:"Partner's personal spending",tier:"discretionary",period:"mo",hint:"Your partner's day-to-day 'spends'",paidBy:"partner"}];function co(t){const e=new Set((t.lines||[]).map(i=>(i.label||"").trim().toLowerCase()).filter(Boolean)),n=[...Yc.essential.map(i=>({...i,tier:"essential"})),...Yc.discretionary.map(i=>({...i,tier:"discretionary"}))],s=new Set,r=[];for(const i of[...T_,...n]){const o=i.label.trim().toLowerCase();e.has(o)||s.has(o)||(s.add(o),r.push(i))}return r}const __=[{label:"New car",tier:"essential",hint:"Replacement vehicle",everyYears:8},{label:"Redecorating",tier:"essential",hint:"Whole-house repaint — a 4-bed runs ~£2,000–3,500 professionally, ~£300–600 DIY",everyYears:7},{label:"Major home work",tier:"essential",hint:"Kitchen, bathroom, roof, windows",everyYears:null},{label:"White goods",tier:"essential",hint:"Fridge, washer, cooker",everyYears:10}],I_={"Council tax":{minimum:{s:95,c:150},moderate:{s:115,c:170},comfortable:{s:125,c:185}},Gas:{minimum:{s:45,c:60},moderate:{s:58,c:75},comfortable:{s:68,c:90}},Electricity:{minimum:{s:55,c:70},moderate:{s:68,c:85},comfortable:{s:80,c:100}},Water:{minimum:{s:28,c:38},moderate:{s:33,c:44},comfortable:{s:38,c:50}},Broadband:{minimum:{s:27,c:27},moderate:{s:32,c:32},comfortable:{s:38,c:38}},"Mobile phones":{minimum:{s:8,c:16},moderate:{s:14,c:28},comfortable:{s:20,c:40}},"TV licence":{minimum:{s:15,c:15},moderate:{s:15,c:15},comfortable:{s:15,c:15}},"Groceries & household":{minimum:{s:230,c:350},moderate:{s:300,c:470},comfortable:{s:360,c:580}},"Home insurance":{minimum:{s:16,c:22},moderate:{s:22,c:30},comfortable:{s:28,c:38}},"Car insurance":{minimum:{s:0,c:0},moderate:{s:38,c:50},comfortable:{s:48,c:80}},"Car tax":{minimum:{s:0,c:0},moderate:{s:16,c:16},comfortable:{s:16,c:32}},"Petrol / fuel":{minimum:{s:0,c:0},moderate:{s:95,c:130},comfortable:{s:115,c:190}},"Car servicing & maintenance":{minimum:{s:0,c:0},moderate:{s:48,c:65},comfortable:{s:65,c:105}},"Boiler service":{minimum:{s:9,c:9},moderate:{s:11,c:11},comfortable:{s:13,c:13}},"Personal health":{minimum:{s:15,c:25},moderate:{s:32,c:55},comfortable:{s:58,c:95}},"Home upkeep":{minimum:{s:30,c:42},moderate:{s:52,c:75},comfortable:{s:85,c:120}},"Main holiday":{minimum:{s:42,c:65},moderate:{s:130,c:200},comfortable:{s:220,c:350}},"UK breaks":{minimum:{s:0,c:0},moderate:{s:38,c:60},comfortable:{s:75,c:115}},"Day trips":{minimum:{s:15,c:25},moderate:{s:32,c:48},comfortable:{s:52,c:80}},"Eating out & takeaways":{minimum:{s:42,c:70},moderate:{s:100,c:170},comfortable:{s:170,c:285}},"Streaming & entertainment":{minimum:{s:12,c:12},moderate:{s:26,c:32},comfortable:{s:42,c:48}},"Digital subscriptions":{minimum:{s:5,c:8},moderate:{s:13,c:20},comfortable:{s:26,c:38}},"Gym & fitness":{minimum:{s:15,c:26},moderate:{s:32,c:55},comfortable:{s:48,c:85}},"Sports & equipment":{minimum:{s:5,c:8},moderate:{s:13,c:22},comfortable:{s:26,c:42}},Clothes:{minimum:{s:48,c:80},moderate:{s:65,c:115},comfortable:{s:105,c:190}},"Sports clothes":{minimum:{s:3,c:5},moderate:{s:8,c:13},comfortable:{s:13,c:22}},"Hobbies & leisure":{minimum:{s:16,c:26},moderate:{s:37,c:58},comfortable:{s:62,c:100}},"Gifts & family":{minimum:{s:22,c:32},moderate:{s:58,c:90},comfortable:{s:95,c:150}},Charity:{minimum:{s:5,c:10},moderate:{s:16,c:27},comfortable:{s:32,c:55}},Pets:{minimum:{s:32,c:32},moderate:{s:42,c:42},comfortable:{s:58,c:58}},"Personal spending money":{minimum:{s:26,c:48},moderate:{s:52,c:95},comfortable:{s:95,c:170}},"Home furnishings & décor":{minimum:{s:16,c:26},moderate:{s:37,c:58},comfortable:{s:68,c:105}},"Home technology":{minimum:{s:10,c:16},moderate:{s:26,c:37},comfortable:{s:48,c:68}},Alcohol:{minimum:{s:16,c:42},moderate:{s:32,c:80},comfortable:{s:52,c:115}},"Hairdressing & grooming":{minimum:{s:13,c:19},moderate:{s:26,c:42},comfortable:{s:48,c:80}},"Newspapers, books & media":{minimum:{s:8,c:13},moderate:{s:19,c:30},comfortable:{s:32,c:48}},"Life insurance / income protection":{minimum:{s:20,c:24},moderate:{s:20,c:24},comfortable:{s:20,c:24}},"Health / dental insurance":{minimum:{s:0,c:0},moderate:{s:16,c:27},comfortable:{s:42,c:75}},"Dental & optical":{minimum:{s:10,c:16},moderate:{s:19,c:32},comfortable:{s:32,c:55}},"Public transport":{minimum:{s:42,c:75},moderate:{s:26,c:48},comfortable:{s:26,c:48}},"Christmas & birthdays":{minimum:{s:22,c:37},moderate:{s:48,c:75},comfortable:{s:85,c:125}},"My personal spending":{minimum:{s:26,c:26},moderate:{s:48,c:48},comfortable:{s:85,c:85}},"Partner's personal spending":{minimum:{s:0,c:26},moderate:{s:0,c:48},comfortable:{s:0,c:85}}},S0=Object.freeze({minimum:"PLSA Minimum",moderate:"PLSA Moderate",comfortable:"PLSA Comfortable"});let x0=null;function S_(t){x0=t||null}function Oo(t){const e=t&&t.plsaTier;return e==="minimum"||e==="comfortable"?e:"moderate"}function pi(t,e){const s=(x0||I_)[(t||"").trim()];if(!s)return null;const r=s[Oo(e)];return r?e&&e.sharedWithPartner?r.c:r.s:null}function A0(){const t=e=>Yc[e].map(n=>({label:n.label,tier:e,annual:null,fromAge:null,toAge:null,hint:n.hint,period:n.period||"yr"}));return[...t("essential"),...t("discretionary")]}function k0(){return __.map(t=>({label:t.label,tier:t.tier,hint:t.hint,amount:null,atAge:null,everyYears:t.everyYears}))}const Ta={pa:12570,brl:50270,hrl:125140},We=t=>Number.isFinite(+t)?+t:0;function x_(t,e){const n=t.fromAge??e.retirementAge,s=t.toAge??e.endAge;return{from:We(n),to:We(s)}}function C0(t,e,n){const{from:s,to:r}=x_(t,e);return n>=s&&n<=r}function Wc(t,e,n="all"){return(t.lines||[]).filter(s=>n==="all"||s.tier===n).filter(s=>C0(s,t,e)).reduce((s,r)=>s+We(r.annual),0)}function _u(t,e,n=null){if(!e||!e.sharedWithPartner)return 1;const s=t&&t.paidBy||"me";if(s==="partner")return 0;if(s==="shared"){const r=t&&t.mySharePct,i=r!=null&&r!==""&&Number.isFinite(+r)?+r:A_(e,n);return Math.max(0,Math.min(1,i/100))}return 1}function A_(t,e=null){const n=Number.isFinite(+t.mySharePct)?+t.mySharePct:50,s=Array.isArray(t.splitPhases)?t.splitPhases.filter(i=>Number.isFinite(+i.fromAge)&&Number.isFinite(+i.mySharePct)):[];if(e==null||s.length===0)return n;const r=s.filter(i=>+i.fromAge<=e).sort((i,o)=>+i.fromAge-+o.fromAge).pop();return r?+r.mySharePct:n}function Gc(t,e,n="all"){return(t.lines||[]).filter(s=>n==="all"||s.tier===n).filter(s=>C0(s,t,e)).reduce((s,r)=>s+We(r.annual)*_u(r,t,e),0)}function k_(t){return Wc(t,We(t.retirementAge),"all")}function C_(t,e=t.currentAge,n=t.endAge){const s=[];for(const r of t.oneOffs||[]){const i=We(r.amount);if(i===0)continue;const o=We(r.everyYears);let a=We(r.atAge);if(o>0)for(;a<=n;a+=o)a>=e&&s.push({age:a,label:r.label,tier:r.tier,amount:i});else a>=e&&a<=n&&s.push({age:a,label:r.label,tier:r.tier,amount:i})}return s.sort((r,i)=>r.age-i.age)}function uo(t,e=Ta){const n=We(t),{pa:s,brl:r,hrl:i}=e;if(n<=s)return n;const o=r-.2*(r-s);if(n<=o)return s+(n-s)/.8;const a=o+.6*(i-r);return n<=a?r+(n-o)/.6:i+(n-a)/.55}function dp(t,e=!1){return(t.oneOffs||[]).reduce((n,s)=>{const r=We(s.amount),i=We(s.everyYears);return i>0&&r?n+r/i*(e?_u(s,t,We(t.retirementAge)):1):n},0)}function P_(t,e){const n=We(t.retirementAge),s=C_(t,n,n+e),r=[];for(let i=0;i<=e;i++){const o=n+i;let a=Gc(t,o,"all");for(const c of s)if(c.age===o){const d=(t.oneOffs||[]).find(u=>u.label===c.label)||{};a+=c.amount*_u(d,t,o)}r.push(a)}return r}function mi(t){const e=We(t.retirementAge),n=Gc(t,e,"essential"),s=Gc(t,e,"all"),r=dp(t,!0),i=s+r,o=k_(t)+dp(t,!1),a=Math.max(0,o-i);return{partnerAllInAnnual:a,partnerAllInMonthly:a/12,essentialAnnualNet:n,comfortableAnnualNet:s,essentialMonthlyNet:n/12,comfortableMonthlyNet:s/12,periodicAnnualAverage:r,periodicMonthlyAverage:r/12,allInComfortableAnnual:i,allInComfortableMonthly:i/12,householdComfortableAnnual:o,householdComfortableMonthly:o/12,sharedWithPartner:!!t.sharedWithPartner,suggestedGrossAnnual:uo(i)}}function Ms(t){if(t==null)return null;const e=String(t).trim().replace(/^=/,"").replace(/[×x]/gi,"*").replace(/,/g,"");if(!e||!/^[\d+\-*/().\s]+$/.test(e)||!/\d/.test(e))return null;try{const n=Function('"use strict"; return ('+e+");")();return Number.isFinite(n)?Math.round(n*100)/100:null}catch{return null}}function Iu(t){return(t||[]).reduce((e,n)=>{const s=We(n&&n.amount);return s?e+((n.period||"yr")==="mo"?s*12:s):e},0)}function P0(t,e,n){const s=pi(t,n),r=We(e);if(s==null||s<=0||r<=0)return null;const i=s*12;return r<=i*.35?"low":r>=i*3?"high":null}function ho(t=45,e=60,n=100){return{version:1,currentAge:We(t),retirementAge:We(e),endAge:We(n),sharedWithPartner:!1,mySharePct:50,plsaTier:"moderate",lines:[],oneOffs:[]}}const R_=["Type","Section","Item","Amount","Period","Paid by","My share %","From age","To age","At age","Every N years","Notes"];function M_(t){return t=t==null?"":String(t),/[",\n]/.test(t)?'"'+t.replace(/"/g,'""')+'"':t}function B_(t){const e=[R_],n=(s,r,i)=>e.push(["Setting","",s,r??"","","","","","","","",""]);n("Current age",t.currentAge),n("Retirement age",t.retirementAge),n("Plan to age",t.endAge),n("Shared with partner",t.sharedWithPartner?"yes":"no"),n("My share %",t.mySharePct??50),n("PLSA tier",t.plsaTier||"moderate"),t.targetHeadroomMonthly&&n("Headroom £/mo",t.targetHeadroomMonthly);for(const s of t.splitPhases||[])s&&s.fromAge!==""&&s.fromAge!=null&&e.push(["Setting","","Split change",s.mySharePct??"","","","",s.fromAge,"","","","from this age my share becomes Amount %"]);for(const s of t.lines||[]){const r=s.period||"yr",i=s.annual==null?"":r==="mo"?Math.round(s.annual/12*100)/100:s.annual;e.push(["Item",s.tier==="discretionary"?"Discretionary":"Essential",s.label||"",i,r,s.paidBy||"me",s.mySharePct??"",s.fromAge??"",s.toAge??"","","",s.hint||""]);for(const o of s.breakdown||[])!o||!o.label&&o.amount==null||e.push(["Sub-item","",o.label||"",o.amount??"",o.period||"mo","","","","","","",""])}for(const s of t.oneOffs||[])e.push(["One-off",s.tier==="discretionary"?"Discretionary":"Essential",s.label||"",s.amount??"","",s.paidBy||"me",s.mySharePct??"","","",s.atAge??"",s.everyYears??"",s.hint||""]);return"\uFEFF"+e.map(s=>s.map(M_).join(",")).join(`\r
`)}function D_(t){const e=[];let n=[],s="",r=!1;const i=String(t||"").replace(/^﻿/,"");for(let o=0;o<i.length;o++){const a=i[o];r?a==='"'?i[o+1]==='"'?(s+='"',o++):r=!1:s+=a:a==='"'?r=!0:a===","?(n.push(s),s=""):a===`
`||a==="\r"?(a==="\r"&&i[o+1]===`
`&&o++,n.push(s),s="",n.some(c=>c!=="")&&e.push(n),n=[]):s+=a}return n.push(s),n.some(o=>o!=="")&&e.push(n),e}function la(t,e){const n=Ms(t);return n==null?null:n>1e3&&e?Math.round(e+(n-new Date().getFullYear())):n}function L_(t){const e=[],n=D_(t);if(!n.length)return{settings:{},lines:[],oneOffs:[],warnings:["Empty file"]};const s=p=>String(p||"").toLowerCase().replace(/[^a-z%£/]/g,""),r={};n[0].forEach((p,f)=>{r[s(p)]=f});const i=(p,f)=>{const g=r[s(f)];return g==null?"":(p[g]??"").trim()};if(r[s("Type")]==null||r[s("Item")]==null)return{settings:{},lines:[],oneOffs:[],warnings:["Header row not recognised — expected the exported column layout (Type, Section, Item, …)"]};const o={},a=[],c=[],d=[];let u=null;for(let p=1;p<n.length;p++){const f=n[p],g=s(i(f,"Type")),v=i(f,"Item"),y=i(f,"Amount"),E=Ms(y),C=/mo/i.test(i(f,"Period"))?"mo":"yr",k={me:"me",partner:"partner",shared:"shared"}[s(i(f,"Paid by"))]||"me",P=Ms(i(f,"My share %"));if(g==="setting"){const R=s(v);if(R==="currentage")o.currentAge=E;else if(R==="retirementage")o.retirementAge=E;else if(R==="plantoage")o.endAge=E;else if(R==="sharedwithpartner")o.sharedWithPartner=/^(y|true|1)/i.test(y||i(f,"Notes"))||/^(y|true|1)/i.test(y);else if(R==="myshare%")o.mySharePct=E;else if(R==="plsatier")o.plsaTier=(y||"").toLowerCase()||void 0;else if(R==="headroom£/mo"||R==="headroommo")o.targetHeadroomMonthly=E;else if(R==="splitchange"){const B=la(i(f,"From age"),o.currentAge);B!=null&&E!=null?a.push({fromAge:B,mySharePct:E}):e.push("Row "+(p+1)+": split change needs From age and Amount (%)")}else e.push("Row "+(p+1)+': unknown setting "'+v+'" skipped')}else if(g==="item"){const R=/disc/i.test(i(f,"Section"))?"discretionary":"essential";u={label:v,tier:R,period:C,annual:E==null?null:C==="mo"?Math.round(E*12*100)/100:E,paidBy:k,mySharePct:P??null,fromAge:la(i(f,"From age"),o.currentAge),toAge:la(i(f,"To age"),o.currentAge),hint:i(f,"Notes")||"",breakdown:[]},c.push(u)}else if(g==="subitem"){if(!u){e.push("Row "+(p+1)+": sub-item with no Item above it — skipped");continue}u.breakdown.push({label:v,amount:E,period:C})}else g==="oneoff"?d.push({label:v,tier:/disc/i.test(i(f,"Section"))?"discretionary":"essential",amount:E,atAge:la(i(f,"At age"),o.currentAge),everyYears:Ms(i(f,"Every N years")),paidBy:k,mySharePct:P??null,hint:i(f,"Notes")||""}):g&&e.push("Row "+(p+1)+': unknown Type "'+i(f,"Type")+'" skipped')}for(const p of c)p.breakdown.length&&p.breakdown.some(f=>+f.amount)&&(p.annual=Iu(p.breakdown)),p.breakdown.length||delete p.breakdown;return a.length&&(o.splitPhases=a),{settings:o,lines:c,oneOffs:d,warnings:e}}let Yr=null,le=null;function $s(){return Be()&&ut()}function kn(){Yr=null,le=null}function Su(){return{equityMin:be.EQUITY_MIN,bondMin:be.BOND_MIN,cashTarget:be.CASH_TARGET,duration:be.DURATION_YEARS,baseSalary:be.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:As.PROTECTION_MULTIPLIER,consecutiveLimit:be.CONSECUTIVE_LIMIT,disableProtection:!1,recoveryBuffer:be.RECOVERY_BUFFER,hodlEnabled:As.HODL_ENABLED,hodlValue:As.HODL_VALUE,isaBalance:0,isaReturn:Vt.RETURN,isaMin:Vt.MIN,isaDrawdownStrategy:Vt.DRAWDOWN_STRATEGY}}function xu(){return{equityMin:be.EQUITY_MIN,bondMin:be.BOND_MIN,cashTarget:be.CASH_TARGET,duration:be.DURATION_YEARS,baseSalary:be.BASE_SALARY,protectionFactor:be.PROTECTION_FACTOR,recoveryBuffer:be.RECOVERY_BUFFER,consecutiveLimit:be.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0,isaBalance:0,isaReturn:Vt.RETURN,isaMin:Vt.MIN,isaDrawdownStrategy:Vt.DRAWDOWN_STRATEGY}}function N_(t,e={},n=new Date().toISOString()){const s=t||{};return{...Su(),...e,equityMin:s.equityMin,bondMin:s.bondMin,cashTarget:s.cashTarget,duration:s.duration,baseSalary:s.baseSalary,spStartDate:s.spStartDate??e.spStartDate??null,spWeeklyAmount:s.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:s.consecutiveLimit,recoveryBuffer:s.recoveryBuffer,disableProtection:s.disableProtection??e.disableProtection??!1,protectionMult:s.protectionFactor!=null?1-s.protectionFactor/100:e.protectionMult??As.PROTECTION_MULTIPLIER,isaBalance:s.isaBalance??0,isaReturn:s.isaReturn??Vt.RETURN,isaMin:s.isaMin??Vt.MIN,isaDrawdownStrategy:s.isaDrawdownStrategy??Vt.DRAWDOWN_STRATEGY,taggedFunds:(s.taggedFunds||[]).map(r=>({...r})),allocMode:s.allocMode??e.allocMode,subAsset:s.subAsset??null,diversifierStart:s.diversifierStart??0,glideEndgame:s.glideEndgame??null,equityGlideEnabled:s.equityGlideEnabled??!1,spendingProfile:s.spendingProfile??e.spendingProfile??"flat",accessMethod:s.accessMethod??e.accessMethod??"drawdown",ufplsYears:s.ufplsYears??e.ufplsYears??null,ufplsThenPcls:s.ufplsThenPcls??e.ufplsThenPcls??!1,bandFillRecycle:s.bandFillRecycle??e.bandFillRecycle??!1,seededFrom:"decision",seededAt:n,decisionChecksum:Qa(s)}}function O_(t,e={}){const n=t||{};return{...xu(),...e,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,duration:n.duration,baseSalary:n.baseSalary,spStartDate:n.spStartDate??e.spStartDate??null,spWeeklyAmount:n.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:n.consecutiveLimit??e.consecutiveLimit,recoveryBuffer:n.recoveryBuffer??e.recoveryBuffer,disableProtection:n.disableProtection??e.disableProtection??!1,protectionFactor:n.protectionMult!=null?Math.round((1-n.protectionMult)*100):e.protectionFactor,isaBalance:n.isaBalance??0,isaReturn:n.isaReturn??Vt.RETURN,isaMin:n.isaMin??Vt.MIN,isaDrawdownStrategy:n.isaDrawdownStrategy??Vt.DRAWDOWN_STRATEGY,taggedFunds:(n.taggedFunds||[]).map(s=>({...s})),allocMode:n.allocMode??e.allocMode,subAsset:n.subAsset??null,diversifierStart:n.diversifierStart??0,glideEndgame:n.glideEndgame??null,equityGlideEnabled:n.equityGlideEnabled??!1,spendingProfile:n.spendingProfile??e.spendingProfile??"flat",accessMethod:n.accessMethod??e.accessMethod??"drawdown",ufplsYears:n.ufplsYears??e.ufplsYears??null,ufplsThenPcls:n.ufplsThenPcls??e.ufplsThenPcls??!1,bandFillRecycle:n.bandFillRecycle??e.bandFillRecycle??!1,configured:!0,seededFrom:"stress"}}function R0(){return{}}function M0(){return ho()}function Au(t=new Date().toISOString()){return{id:"pots-and-valves",params:{},lockedAt:t,engineVersion:Us}}function F_(t){return t&&!t.strategy&&(t.strategy=Au()),t}function V_(t="My Plan",e="",n=["stress","decision"]){return{planDetails:{name:t,description:e},enabledTools:n,isActive:!0,strategy:Au(),decisionTool:{settings:xu(),history:[],taxYears:R0()},stressTool:{settings:Su()},budgetTool:{settings:M0()}}}async function _r(){if(Yr)return Yr;if(!$s())return[];try{const t=await bl();return t.forEach(F_),Yr=t,t}catch(t){return console.error("Error listing scenarios:",t),[]}}async function Ne(){if(le)return le;if(!$s())return null;try{const e=(await _r()).find(n=>n.isActive);return e?(le=e,e):null}catch(t){return console.error("Error getting active scenario:",t),null}}async function Fo(){const t=await Ne();return(t==null?void 0:t.id)||null}async function B0(t,e,n,s={},r=!0){if(!$s())throw new Error("Must be logged in to create scenarios");const i=V_(t,e,n);if(s.stressSettings&&(i.stressTool.settings={...i.stressTool.settings,...s.stressSettings}),s.decisionSettings&&(i.decisionTool.settings={...i.decisionTool.settings,...s.decisionSettings}),s.taxYears&&(i.decisionTool.taxYears=s.taxYears),i.isActive=r,r&&Yr){const a=Yr.find(c=>c.isActive);a&&(await mu(null),await en(a.id,{isActive:!1}))}const o=await t0(i);return kn(),o}async function D0(t){if(!$s())throw new Error("Must be logged in to switch scenarios");await mu(t),kn()}async function L0(t,e){if(!$s())throw new Error("Must be logged in to duplicate scenarios");const n=await xT(t);if(!n)throw new Error("Source scenario not found");const{id:s,createdAt:r,lastModified:i,...o}=n;o.planDetails={...o.planDetails,name:e},o.isActive=!1;const a=await t0(o);return kn(),a}async function z_(t,e){if(!$s())throw new Error("Must be logged in to rename scenarios");await en(t,{"planDetails.name":e}),kn()}async function U_(t,e){if(!$s())throw new Error("Must be logged in to update scenarios");await en(t,{enabledTools:e}),kn()}async function $_(t){if(!$s())throw new Error("Must be logged in to delete scenarios");const e=await _r();if(e.length<=1)throw new Error("Cannot delete the last scenario");const n=e.find(s=>s.id===t);if(n!=null&&n.isActive){const s=e.find(r=>r.id!==t);s&&await mu(s.id)}await AT(t),kn()}async function N0(){var e;const t=await Ne();return((e=t==null?void 0:t.stressTool)==null?void 0:e.settings)||Su()}async function O0(t){const e=await Ne();if(!e)throw new Error("No active scenario");await en(e.id,{"stressTool.settings":t}),le&&(le.stressTool||(le.stressTool={}),le.stressTool.settings=t)}async function q_(){var e;const t=await Ne();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.settings)||xu()}async function H_(t){const e=await Ne();if(!e)throw new Error("No active scenario");await en(e.id,{"decisionTool.settings":t}),le&&(le.decisionTool||(le.decisionTool={}),le.decisionTool.settings=t)}async function Y_(){var e;const t=await Ne();return((e=t==null?void 0:t.budgetTool)==null?void 0:e.settings)||M0()}async function W_(t){const e=await Ne();if(!e)throw new Error("No active scenario");await en(e.id,{"budgetTool.settings":t}),le&&(le.budgetTool||(le.budgetTool={}),le.budgetTool.settings=t)}async function G_(){var e;const t=await Ne();return((e=t==null?void 0:t.accumulationTool)==null?void 0:e.settings)||{}}async function j_(){var e;const t=await Ne();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.planOfRecord)||null}async function K_(t){const e=await Ne();if(!e)throw new Error("No active scenario");await en(e.id,{"decisionTool.planOfRecord":t}),le&&(le.decisionTool||(le.decisionTool={}),le.decisionTool.planOfRecord=t)}async function ku(t,e={}){const n=await Ne();if(!n)throw new Error("No active scenario");const s={id:t,params:e,lockedAt:new Date().toISOString(),engineVersion:Us};return await en(n.id,{strategy:s}),le&&(le.strategy=s),s}async function Cu(){const t=await Ne();return t&&t.strategy||Au()}async function Q_(){var e;const t=await Ne();return((e=t==null?void 0:t.household)==null?void 0:e.partnerScenarioId)||null}async function J_(t){const e=await Ne();if(!e)throw new Error("No active scenario");await en(e.id,{"household.partnerScenarioId":t||null}),le&&(le.household||(le.household={}),le.household.partnerScenarioId=t||null)}async function X_(t){const e=await Ne();if(!e)throw new Error("No active scenario");await en(e.id,{"accumulationTool.settings":t}),le&&(le.accumulationTool||(le.accumulationTool={}),le.accumulationTool.settings=t)}async function Z_(){var e;const t=await Ne();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.taxYears)||R0()}async function eI(t){const e=await Ne();if(!e)throw new Error("No active scenario");await en(e.id,{"decisionTool.taxYears":t}),le&&(le.decisionTool||(le.decisionTool={}),le.decisionTool.taxYears=t)}async function tI(){var e;const t=await Ne();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.history)||[]}async function F0(t){const e=await Ne();if(!e)throw new Error("No active scenario");await en(e.id,{"decisionTool.history":t}),le&&(le.decisionTool||(le.decisionTool={}),le.decisionTool.history=t)}async function V0(){const t=await Ne();return(t==null?void 0:t.enabledTools)||["stress","decision"]}let Bs=null;function _a(){return{settings:{equityMin:be.EQUITY_MIN,bondMin:be.BOND_MIN,cashTarget:be.CASH_TARGET,duration:be.DURATION_YEARS,equityGlideEnabled:!1,locked:!1,baseSalary:be.BASE_SALARY,spendingProfile:"flat",protectionFactor:be.PROTECTION_FACTOR,recoveryBuffer:be.RECOVERY_BUFFER,consecutiveLimit:be.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function xl(){return Be()&&ut()}function Os(){Bs=null}function z0(){return Bs||_a()}async function Cn(){if(Bs)return Bs;if(!xl())return console.warn("Firebase not available - returning defaults"),_a();try{const[t,e,n]=await Promise.all([q_(),Z_(),tI()]),s={settings:t||_a().settings,taxYears:e||{},history:n||[],lastModified:new Date().toISOString(),checksum:null};return s.checksum=U0(s),Bs=s,s}catch(t){console.error("Error loading decision data:",t)}return _a()}async function Al(t){if(!xl())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=U0(t),await Promise.all([H_(t.settings),eI(t.taxYears)]),Bs=t}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function U0(t){const e={settings:t.settings,taxYears:t.taxYears,historyCount:t.history.length,lastHistoryDate:t.history.length>0?t.history[t.history.length-1].date:null};return Qa(e)}function $0(t){if(!t)return"";const{locked:e,...n}=t;return Qa(n)}async function Ze(){return(await Cn()).settings}async function mr(t){const e=await Cn();e.settings={...e.settings,...t},await Al(e)}function Pu(){return{pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,cpi:Ji,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function nI(t){const n=z0().taxYears[t];return n||Pu()}async function Vo(t){const n=(await Cn()).taxYears[t];return n||Pu()}async function Ir(t,e){console.log(`saveTaxYearConfig: Saving tax year ${t}`,e);const n=await Cn();n.taxYears[t]={...nI(t),...e},await Al(n),console.log(`saveTaxYearConfig: Saved tax year ${t}, yearSetupComplete=${n.taxYears[t].yearSetupComplete}`)}async function sI(t){const e=Bs||await Cn(),n=(e.history||[]).filter(r=>r.taxYear===t),s=n.reduce((r,i)=>r+(i.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${t}, found ${n.length} records, total ISA used: ${s}`),console.log("recalculateIsaSavingsUsed: History records:",n.map(r=>({date:r.date,isa:r.isa}))),e.taxYears[t]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${t}, creating default`),e.taxYears[t]=Pu()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),e.taxYears[t].isaSavingsUsed=s,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),await Al(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),s}async function rI(t){const e=await Vo(t),n=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${t}, yearSetupComplete=${e.yearSetupComplete}, result=${n}`),n}async function cs(){return(await Cn()).taxYears}function iI(t={}){let n=[...z0().history];return t.taxYear&&(n=n.filter(s=>s.taxYear===t.taxYear)),t.startDate&&(n=n.filter(s=>s.date>=t.startDate)),t.endDate&&(n=n.filter(s=>s.date<=t.endDate)),t.sortDesc?n.sort((s,r)=>r.date.localeCompare(s.date)):n.sort((s,r)=>s.date.localeCompare(r.date)),t.limit&&(n=n.slice(0,t.limit)),n}async function qs(t={}){return await Cn(),iI(t)}async function oI(t){if(!xl())throw new Error("Must be logged in to save history");const e=await Cn(),n=e.history.findIndex(s=>s.date===t.date);n>=0?e.history[n]=t:e.history.push(t),e.history.sort((s,r)=>s.date.localeCompare(r.date)),await F0(e.history)}async function q0(t){if(!xl())throw new Error("Must be logged in to delete history");const e=await Cn();e.history=e.history.filter(n=>n.date!==t),await F0(e.history)}async function Ru(t){const e=await Ze(),n=await cs(),s=e.spStartDate,r=e.spWeeklyAmount||0;if(!s||!r){let u=null;if(s){const{formatStatePensionDate:p}=await Fh(async()=>{const{formatStatePensionDate:f}=await Promise.resolve().then(()=>hp);return{formatStatePensionDate:f}},void 0,import.meta.url);u=p(s)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:u}}const{calculateStatePensionForTaxYear:i,getTimeUntilStatePension:o,parseStatePensionDate:a}=await Fh(async()=>{const{calculateStatePensionForTaxYear:u,getTimeUntilStatePension:p,parseStatePensionDate:f}=await Promise.resolve().then(()=>hp);return{calculateStatePensionForTaxYear:u,getTimeUntilStatePension:p,parseStatePensionDate:f}},void 0,import.meta.url),c=i({taxYear:t,spStartDate:s,weeklyAmount:r,taxYearConfigs:n}),d=o(s);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function aI(t){const e=a1(t);e.stdSipp=t.stdSipp||t.sippDraw;try{const n=await Ze();e.settingsChecksum=$0(n)}catch(n){console.warn("Could not stamp settings checksum on decision:",n)}await oI(e),t.taxYear&&await sI(t.taxYear)}const up={55:{m:[84,91,96],f:[87,93,97]},60:{m:[85,91,96],f:[87,93,97]},65:{m:[85,92,96],f:[88,93,98]},70:{m:[86,92,96],f:[88,94,98]},75:{m:[87,92,97],f:[89,94,98]}},lI={50:0,25:1,10:2};function cI(t,e="m",n=10){const s=lI[n]??2,r=e==="f"?"f":"m",i=Math.max(55,Math.min(75,t||65)),o=Math.floor(i/5)*5,a=Math.min(75,o+5),c=up[o][r][s],d=up[a][r][s],u=a===o?0:(i-o)/(a-o);return Math.round(c+(d-c)*u)}const gc={plain:{cautious:{equity:.3,bond:.45,cash:.25,diversifiers:0},balanced:{equity:.5,bond:.4,cash:.1,diversifiers:0},adventurous:{equity:.7,bond:.25,cash:.05,diversifiers:0}},sleeve:{cautious:{equity:.3,bond:.45,cash:.13,diversifiers:.12},balanced:{equity:.5,bond:.3,cash:.05,diversifiers:.15},adventurous:{equity:.65,bond:.15,cash:.05,diversifiers:.15}}},Mi={equity:{ticker:"VWRP",name:"Vanguard FTSE All-World (acc)",job:"World shares — the whole growth engine in one fund"},shortGilts:{ticker:"IGLS",name:"iShares UK Gilts 0–5yr",job:"Short gilts — stability, low rate risk"},longGilts:{ticker:"IGLT",name:"iShares Core UK Gilts",job:"Longer gilts — crash ballast, more rate risk"},indexLinked:{ticker:"INXG",name:"iShares £ Index-Linked Gilts",job:"Inflation-linked gilts — inflation protection"},corporateIG:{ticker:"SLXX",name:"iShares £ Corporate Bond",job:"Investment-grade credit — extra yield over gilts"},cash:{ticker:"CSH2",name:"Amundi Smart Overnight Return",job:"Cash-like — money-market rate, near-zero swings"},gold:{ticker:"SGLN",name:"iShares Physical Gold",job:"Gold — crisis hedge, no income"},trendMacro:{ticker:"PNL / CGT",name:"Personal Assets / Capital Gearing Trust",job:"Wealth-preserver trusts — defensive multi-asset"}};function dI(t,{diversifiers:e=!1}={}){const n=(e?gc.sleeve:gc.plain)[t]||gc.plain.balanced,s=[],r=o=>Math.round(o*100);s.push({...Mi.equity,pct:r(n.equity)});for(const[o,a]of Object.entries(p0))s.push({...Mi[o],pct:r(n.bond*a)});s.push({...Mi.cash,pct:r(n.cash)}),e&&n.diversifiers>0&&(s.push({...Mi.gold,pct:r(n.diversifiers*qc.gold)}),s.push({...Mi.trendMacro,pct:r(n.diversifiers*qc.trendMacro)}));const i=s.reduce((o,a)=>o+a.pct,0);return i!==100&&s.length&&(s.reduce((o,a)=>o.pct>=a.pct?o:a).pct+=100-i),{rows:s,note:'An example of the KIND of funds matching this mix — not a recommendation. Any similar fund doing the same job works; compare ongoing charges, and prefer £-hedged bond share classes. Tagging exactly these funds in "Use my own funds" reproduces this preset.'}}const uI={ANNUAL_ALLOWANCE:6e4,TAPER_THRESHOLD_INCOME:2e5,MPAA:1e4,NMPA_NEW:57,LSA_POT_THRESHOLD:1073100},hI={low:.02,mid:.05,high:.08};function fI(t,e=12570,n=50270,s=125140){return t<=e?0:t<=n?.2:t<=s?.4:.45}function pI(t,e=50270){return t<=12570?0:t<=e?.08:.02}function mI({netMonthly:t=0,salary:e=0,schemeType:n="ras",employerMonthly:s=0}){const r=fI(e),i=pI(e),o=[];let a=0,c=0,d=0;n==="salsac"?(a=t/Math.max(.2,1-r-i),d=a*i,o.push("Salary sacrifice also saves your employer 15% NI — many employers add some or all of that; ask. From April 2029 the NI exemption is capped at £2,000/yr sacrificed (Autumn Budget 2025).")):n==="netpay"?a=t/Math.max(.2,1-r):(a=t/.8,r>.2&&(c=a*(r-.2),o.push("You must CLAIM the extra "+Math.round((r-.2)*100)+"% relief (≈£"+Math.round(c)+"/mo) from HMRC via self-assessment — it is not automatic and is commonly missed.")),r===0&&o.push("Non-taxpayers still get the 25% top-up on contributions up to £3,600 gross/yr (£2,880 net) — relief at source only."));const u=a+(s||0);return{grossMonthly:a,employerMonthly:s||0,totalMonthly:u,reliefMonthly:a-t,niSavedMonthly:d,hrClaimMonthly:c,costPerPound:u>0?t/u:1,notes:o}}function gI({annualGrossTotal:t=0,salary:e=0,mpaaTriggered:n=!1,currentAge:s=0,retirementAge:r=0,projectedPotHigh:i=0}){const o=uI,a=[];return n&&t>o.MPAA&&a.push({severity:"danger",message:"MPAA: your Decision-tool history shows UFPLS income has been taken, which permanently caps tax-relieved contributions at £10,000/yr — this plan exceeds it. The excess is taxed back via an annual-allowance charge."}),t>o.ANNUAL_ALLOWANCE&&a.push({severity:"warning",message:"Annual Allowance: total contributions exceed £60,000/yr. Unused allowance from the previous 3 tax years (carry-forward) may cover it — otherwise the excess is taxed at your marginal rate."}),e>o.TAPER_THRESHOLD_INCOME&&a.push({severity:"warning",message:"High income: above £200k threshold income the Annual Allowance may taper (£1 lost per £2 of adjusted income over £260k, floor £10,000)."}),r>0&&r<o.NMPA_NEW&&(new Date().getFullYear()+Math.max(0,55-s)>=2028||r<55)&&a.push({severity:"warning",message:"Access age: the normal minimum pension age rises to 57 on 6 April 2028. Retiring before 57 means bridging from ISA/other savings until the pension can be touched."}),i>o.LSA_POT_THRESHOLD&&a.push({severity:"info",message:"Large pot: above £1,073,100 the £268,275 Lump Sum Allowance means your effective tax-free cash falls below 25% — worth planning the crystallisation strategy early."}),a}function yI({currentAge:t,retirementAge:e,potNow:n=0,totalMonthly:s=0,escalationPct:r=0,assumedCpi:i=.025}){const o=Math.max(0,Math.round(e-t)),a=[],c={low:n,mid:n,high:n};let d=s,u=0;a.push({age:t,year:0,potLow:n,potMid:n,potHigh:n,contributedToDate:0});for(let p=1;p<=o;p++){for(let g=0;g<12;g++){for(const v of Object.keys(c))c[v]=c[v]*(1+hI[v]/12)+d;u+=d}d*=1+(r||0)/100;const f=Math.pow(1+i,p);a.push({age:t+p,year:p,potLow:c.low/f,potMid:c.mid/f,potHigh:c.high/f,contributedToDate:u})}return a}function vI(t,e=.85,n=300){const s=(t.equityStart||0)+(t.bondStart||0)+(t.cashStart||0),r=s>0?{e:t.equityStart/s,b:t.bondStart/s,c:t.cashStart/s}:{e:.6,b:.3,c:.1},i=d=>{const u={...t,equityStart:d*r.e,bondStart:d*r.b,cashStart:d*r.c,equityMin:(t.equityMin||0)*(s>0?d/s:1),bondMin:(t.bondMin||0)*(s>0?d/s:1),cashTarget:(t.cashTarget||0)*(s>0?d/s:1)},p=ls(u.strategyId).engine.runMonteCarlo(u,n);return p.filter(f=>!f.failed).length/p.length};let o=1e4,a=5e6;for(let d=0;d<12;d++){const u=(o+a)/2;i(u)>=e?a=u:o=u}const c=a;return{requiredPot:c,successAtRequired:i(c)}}function kl(t){const e=typeof t=="string"?new Date(t):t,n=e.getFullYear(),s=e.getMonth()+1,r=e.getDate();if(s<bn.START_MONTH||s===bn.START_MONTH&&r<bn.START_DAY){const i=n-1;return`${String(i).slice(-2)}/${String(n).slice(-2)}`}return`${String(n).slice(-2)}/${String(n+1).slice(-2)}`}function yc(t){const e=parseInt(t.split("/")[0]),n=e<50?2e3+e:1900+e;return new Date(n,bn.START_MONTH-1,bn.START_DAY)}function bI(t){const e=parseInt(t.split("/")[1]),n=e<50?2e3+e:1900+e;return new Date(n,bn.START_MONTH-1,bn.START_DAY-1)}function wI(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`}function Mu(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,15)}function EI(t){const n=(typeof t=="string"?new Date(t):t).getMonth()+1;return n>=bn.START_MONTH?12-(n-bn.START_MONTH):bn.START_MONTH-n}function gi(t){if(!t)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},n=t.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(n)){const r=new Date(n);if(!isNaN(r.getTime()))return r}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,i,o]=n.split("/").map(Number);return new Date(o,i-1,r)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(n)){const[r,i,o]=n.split("-").map(Number);return new Date(o,i-1,r)}let s=n.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}if(s=n.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}if(s=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}if(s=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}return null}function Ia(t){const e=typeof t=="string"?gi(t):t;if(!e||isNaN(e.getTime()))return"";const n=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${n[e.getMonth()]} ${e.getFullYear()}`}function TI(t){const{taxYear:e,spStartDate:n,weeklyAmount:s,taxYearConfigs:r={}}=t;if(!n||!s||s<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const i=typeof n=="string"?gi(n):n;if(!i||isNaN(i.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const o=kl(i);yc(e);const a=bI(e),c=[...new Set([o,e,...Object.keys(r)])].sort((y,E)=>yc(y).getTime()-yc(E).getTime()),d=c.indexOf(o),u=c.indexOf(e);if(u<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:Ia(i)};let p=1;for(let y=d;y<u;y++){const E=c[y],C=r[E],k=(C==null?void 0:C.cpi)||.025;p*=1+k}const f=s*p;if(e===o){const E=Math.max(0,(a.getTime()-i.getTime())/6048e5),C=f*E;return{annual:C,monthly:C/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(E*10)/10,startDate:Ia(i)}}const v=f*52;return{annual:v,monthly:v/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:Ia(i)}}function _I(t,e=new Date){const n=typeof t=="string"?gi(t):t;if(!n||isNaN(n.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const s=n.getTime()-e.getTime(),r=s<=0;if(r)return{years:0,months:0,totalMonths:0,isPast:!0};const i=Math.floor(s/(30.44*24*60*60*1e3)),o=Math.floor(i/12),a=i%12;return{years:o,months:a,totalMonths:i,isPast:r}}const H0=2016;function Cl(t,{now:e=new Date}={}){if(!t||!String(t).trim())return{valid:!0,error:null,warning:null,date:null};const n=gi(t);if(!n||isNaN(n.getTime()))return{valid:!1,error:'Could not read that date. Try a format like "6 May 2040".',warning:null,date:null};const s=n.getFullYear();return s<H0?{valid:!1,error:`That looks like a date of birth (${s}), not a State Pension start date. Enter the date your State Pension begins — check gov.uk/check-your-state-pension.`,warning:null,date:n}:n.getTime()<e.getTime()?{valid:!0,error:null,warning:`This date is in the past — State Pension will be treated as already in payment from ${s}.`,date:n}:{valid:!0,error:null,warning:null,date:n}}function Pl(t,e=new Date){if(!t.spStartDate||!t.spWeeklyAmount)return null;const n=gi(t.spStartDate);if(!n)return null;const s=365.25*24*60*60*1e3,r=Math.max(0,(n.getTime()-e.getTime())/s),i=Math.floor(r),o=365,a=Math.floor((n-new Date(n.getFullYear(),0,0))/(24*60*60*1e3)),c=(o-a)/o;return{spStartYear:i,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:c}}const hp=Object.freeze(Object.defineProperty({__proto__:null,MIN_SP_START_YEAR:H0,calculateStatePensionForTaxYear:TI,formatStatePensionDate:Ia,getTimeUntilStatePension:_I,parseStatePensionDate:gi,spSimConfigFromSettings:Pl,validateStatePensionDate:Cl},Symbol.toStringTag,{value:"Module"})),vn=t=>ls(t==null?void 0:t.strategyId).engine;function II(t,e,n=1e3){const s=Math.max(t.years,e.years);let r=0,i=0,o=0;const a=Array.from({length:s+1},()=>[]);for(let u=0;u<n;u++){const p=vn(t).monteCarloReturns({years:s},u),f=vn(t).simulate(t,p,u),g=vn(e).simulate(e,p,u+5e5);f.failed||i++,g.failed||o++,!f.failed&&!g.failed&&r++;const v=(y,E)=>{const C=(y.potByYear||[]).length,k=Math.min(E,C-1),P=y.potByYear&&y.potByYear[k]!=null?y.potByYear[k]:0,R=y.isaByYear&&y.isaByYear[k]!=null?y.isaByYear[k]:0;return P+R};for(let y=0;y<=s;y++)a[y].push(v(f,y)+v(g,y))}const c=(u,p)=>{const f=[...u].sort((g,v)=>g-v);return f[Math.min(f.length-1,Math.floor(p*f.length))]},d=a.map((u,p)=>({year:p,p10:c(u,.1),p50:c(u,.5),p90:c(u,.9)}));return{runs:n,jointSuccess:r/n,successA:i/n,successB:o/n,independenceAssumed:i/n*(o/n),potFan:d}}function ri(t,e){return(Array.isArray(t.targetSchedule)&&t.targetSchedule[e]!=null?t.targetSchedule[e]:t.baseSalary||0)*pr(e,t.spendingProfile||"flat")}function jc(t){const e=Pl(t);return e?{startYear:e.spStartYear,annual:e.spWeeklyAmount*52}:t.statePensionYear!=null&&t.statePension>0?{startYear:t.statePensionYear,annual:t.statePension}:{startYear:1/0,annual:0}}function SI(t,e,n=null){const s=t.duration||35,r=e.duration||35,i=n??Math.max(s,r),o=jc(t),a=jc(e),c=[];for(let d=0;d<=i;d++){const u=d<=s?ri(t,d):0,p=d<=r?ri(e,d):0,f=d>=o.startYear?o.annual:0,g=d>=a.startYear?a.annual:0,v=(t.dbAmount>0&&d>=(t.dbStartYear||0)?t.dbAmount:0)+(e.dbAmount>0&&d>=(e.dbStartYear||0)?e.dbAmount:0),y=(t.other||0)+(e.other||0),E=u+p,C=f+g+v+y;c.push({year:d,needA:u,needB:p,need:E,spA:f,spB:g,db:v,other:y,guaranteed:C,drawNeed:Math.max(0,E-C),bridge:o.annual>0&&d<o.startYear||a.annual>0&&d<a.startYear})}return c}function xI({survivorCfg:t,survivorSettings:e,deceasedCfg:n,deceasedSettings:s,deathYear:r,spendFraction:i=.7,dbSurvivorPct:o=.5,runs:a=500}){const c=[],d=[],u=Math.max(r+1,n.years);for(let B=0;B<a;B++){const D=vn(n).simulate(n,vn(n).monteCarloReturns({years:u},B),B+9e5),I=Math.min(r,(D.potByYear||[]).length-1);c.push(D.potByYear&&D.potByYear[I]||0),d.push(D.isaByYear&&D.isaByYear[I]||0)}const p=B=>{const D=[...B].sort((I,w)=>I-w);return D[Math.floor(D.length/2)]},f=Math.pow(1.025,r),g=p(c)*f,v=p(d)*f,y=e.duration||35,E=s.duration||35,C=[];for(let B=0;B<=y;B++){const D=ri(e,B);B<r?C.push(D):C.push((D+(B<=E?ri(s,B):0))*i)}const k=[...t.extraIncomes||[]];s.dbAmount>0&&o>0&&k.push({startYear:Math.max(r,s.dbStartYear||0),annual:s.dbAmount*o,indexation:s.dbIndexation||"lpi5"});const P={...t,targetSchedule:C,spendingProfile:"flat",windfalls:[...t.windfalls||[],{year:r,amount:g},{year:r,amount:v,toIsa:!0}].filter(B=>B.amount>0),extraIncomes:k};let R=0;for(let B=0;B<a;B++)vn(P).simulate(P,vn(P).monteCarloReturns({years:P.years},B),B+7e5).failed||R++;return{survivorSuccess:R/a,inheritedPots:g,inheritedIsa:v,survivorAnnualAfter:C[Math.min(r,y)]}}function AI(t,e,n="You",s="Partner"){const r=f=>{const g=jc(f),v=(g.startYear<=0?g.annual:0)+(f.other||0)+(f.dbAmount>0&&(f.dbStartYear||0)<=0?f.dbAmount:0),y=ri(f,0),E=f.accessMethod==="ufpls"&&(!f.ufplsYears||f.ufplsYears>0)?.25:0;return{taxable:lo({targetGross:y,fixedIncome:v,pa:f.pa??12570,brl:f.brl??50270,hrl:f.hrl??125140,isaBalance:f.isaBalance||0,strategy:f.isaDrawdownStrategy,yearsUntilSp:0,taxFreeFraction:E}).taxable,target:y,brl:f.brl??50270}},i=r(t),o=r(e),a=Math.max(0,i.brl-i.taxable),c=Math.max(0,o.brl-o.taxable),d=Math.max(0,i.taxable-i.brl),u=Math.max(0,o.taxable-o.brl);let p=null;if(d>0&&c>1e3){const f=Math.min(d,c);p=n+" pays 40% tax on about £"+Math.round(d).toLocaleString()+"/yr while "+s+" has £"+Math.round(c).toLocaleString()+" of unused 20% band. Funding £"+Math.round(f).toLocaleString()+" more of the spending from "+s+"’s pots could save ~£"+Math.round(f*.2).toLocaleString()+"/yr."}else if(u>0&&a>1e3){const f=Math.min(u,a);p=s+" pays 40% tax on about £"+Math.round(u).toLocaleString()+"/yr while "+n+" has £"+Math.round(a).toLocaleString()+" of unused 20% band. Funding £"+Math.round(f).toLocaleString()+" more of the spending from "+n+"’s pots could save ~£"+Math.round(f*.2).toLocaleString()+"/yr."}return{unusedA:a,unusedB:c,overA:d,overB:u,message:p}}function kI({cfgA:t,cfgB:e,setA:n,setB:s,who:r="A",startYear:i=10,years:o=3,annualCost:a=9e4,runs:c=500}){const d=(E,C)=>{const k=E.duration||35,P=[];for(let R=0;R<=k;R++){let B=ri(E,R);C&&R>=i&&R<i+o&&(B+=a),P.push(B)}return P},u=(E,C,k)=>({...E,targetSchedule:d(C,k),spendingProfile:"flat"}),p=(E,C)=>{const k=Math.max(E.years,C.years);let P=0;for(let R=0;R<c;R++){const B=vn(E).monteCarloReturns({years:k},R),D=vn(E).simulate(E,B,R),I=vn(C).simulate(C,B,R+5e5);!D.failed&&!I.failed&&P++}return P/c},f=u(t,n,!1),g=u(e,s,!1),v=u(t,n,r==="A"),y=u(e,s,r==="B");return{baselineJoint:p(f,g),careJoint:p(v,y),totalCareCost:a*o}}function CI(t,e,n){const s={},r={};for(let i=0;i<n;i++)s[i]=t[e+12*(i+1)]/t[e+12*i]-1,r[i]=1e-9;return{equity:s,inflation:r}}function Y0(t,{END:e,stride:n=1}={}){const s=_l(),r=Math.round(e/12),i=s.length-e,o=ls("pots-and-valves").engine,a=[];for(let c=0;c<i;c+=n){const d=CI(s,c,r),u=o.simulate({...t,years:r,taxMode:"frozen",trace:!0},d,c);let p=1/0;const f=u.trace||[];if(f.length>=12){let g=0;const v=f.map(y=>(y.effectiveSipp||0)+(y.effectiveIsa??y.isaMonthly??0)+(y.planInputs&&y.planInputs.fixed||0)/12);for(let y=0;y<v.length;y++)g+=v[y],y>=12&&(g-=v[y-12]),y>=11&&(p=Math.min(p,g))}u.failed&&(p=0),a.push({s:c,failed:u.failed,failAge:u.failed?(t.startAge??57)+u.failMonth/12:null,terminal:u.failed?0:u.finalEquity+u.finalBond+u.finalCash+u.finalDiversifier+u.finalIsa,worst12:p,protMonths:u.protMonths})}return{n:a.length,windows:a}}function W0(t){const e=t.durationYears*12,n=.023,s=t.pot+(t.isa||0),r=Math.min(15,Math.floor(t.durationYears/2)),i=g=>Math.max(0,t.targetAnnual-(g>(t.spStartYear??1/0)&&t.spAnnual||0)),o=(()=>{let g=0;for(let v=1;v<=r;v++)g+=i(v)*Math.pow(1+n,-v);return g})(),a=s-o,c=a>0?{E0:a,ladderYears:r,L:r*12,firstRung:r+1,maxRung:t.durationYears,draw:t.targetAnnual,profile:{type:"phases",phases:[{fromYear:0,amount:t.targetAnnual}]},trigger:{mode:"band",b:1.2},END:e,realYield:n,glideRate:.05,startAge:t.startAge,baseLadderCost:o,drawNetOfSp:i}:null,d=g=>Math.max(0,t.essentialsAnnual-(g>(t.spStartYear??1/0)&&t.spAnnual||0)),u=T0({drawForYear:d,years:t.durationYears,realYield:n}),p=s-u,f=p>0?{E0:p,rate:.04,END:e,floorCost:u,floorDraw:d,horizonAge:t.startAge+t.durationYears}:null;return{END:e,lr:c,ff:f,lrAffordable:a>0,ffAffordable:p>0,baseLadderCost:o,ffFloorCost:u}}function PI(t){const e=W0(t),n={configs:e,strategies:{}},s=Y0(t.pnvCfg,{END:e.END,stride:t.stride||1}),r=s.windows.map(o=>o.terminal),i=s.windows.map(o=>o.worst12);if(n.strategies["pots-and-valves"]={table:{worst12Median:Rt(i,.5),worst12Min:Math.min(...i),guaranteedToAge:t.spAnnual>0?`State Pension only (from age ${t.startAge+(t.spStartYear||0)})`:"None — market-dependent",ruinPct:100*s.windows.filter(o=>o.failed).length/s.n,terminalMedian:Rt(r,.5)},signature:{protMonthsMedian:Rt(s.windows.map(o=>o.protMonths),.5)},n:s.n},e.lr){const o=Il(e.lr),a=o.windows.slice(0,o.meta.fullN),c=e.lr.ladderYears,d=o.stats.securedMedian;n.strategies["ladder-and-ratchet"]={table:{worst12Median:t.targetAnnual,worst12Min:a.every(u=>u.survived)?t.targetAnnual:0,guaranteedToAge:`${t.startAge+c} by contract; median ratchets to ${t.startAge+c+d}`,ruinPct:100*a.filter(u=>u.survived===!1).length/a.length,terminalMedian:o.stats.terminalMedian},signature:{neverPct:o.stats.neverPct,fullySecuredPct:o.stats.fullySecuredPct,securedMedian:d,sellEventsMedian:o.stats.sellEventsMedian},n:a.length}}if(e.ff){const o=Sl(e.ff);n.strategies["floor-and-flex"]={table:{worst12Median:t.essentialsAnnual+o.stats.worstMedian,worst12Min:t.essentialsAnnual+o.stats.worstMin,guaranteedToAge:`${e.ff.horizonAge} by contract (essentials)`,ruinPct:0,terminalMedian:o.stats.terminalMedian},signature:{year1Flex:o.stats.year1D,worstFlexMedian:o.stats.worstMedian,worstFlexP10:o.stats.worstP10,shareLeanYears:o.stats.shareYearsUnder(1e4)},n:o.stats.n}}return n}function RI(t,e,n){const s=_l(),r=W0(t),[i]=[1871],o=(e-i)*12+(n-1),a={};if(o>=0&&o+r.END<s.length){const d=Y0(t.pnvCfg,{END:r.END,stride:1}).windows.find(u=>u.s===o);if(d&&(a["pots-and-valves"]={failed:d.failed,failAge:d.failAge,terminal:d.terminal,worst12:d.worst12}),r.lr){const p=Il(r.lr).windows[o];p&&(a["ladder-and-ratchet"]={secured:p.secured,survived:p.survived,terminal:p.terminal,sleeveAtLadderEnd:p.sleeveAtLadderEnd})}if(r.ff){const p=Sl(r.ff).windows[o];p&&(a["floor-and-flex"]={worstYearFlex:p.worstYearD,terminal:p.terminal})}}return a}const MI={generated_at:"2026-01-15T00:00:00Z",source:"bundled snapshot (illustrative universe; refresh via admin CSV import)",gilts:[{name:"0⅛% IL Treasury Gilt 2026",coupon:.125,maturity:2026,lag:3},{name:"1¼% IL Treasury Gilt 2027",coupon:1.25,maturity:2027,lag:3},{name:"0⅛% IL Treasury Gilt 2028",coupon:.125,maturity:2028,lag:3},{name:"0⅛% IL Treasury Gilt 2029",coupon:.125,maturity:2029,lag:3},{name:"4⅛% IL Treasury Stock 2030",coupon:4.125,maturity:2030,lag:8},{name:"0⅛% IL Treasury Gilt 2031",coupon:.125,maturity:2031,lag:3},{name:"1¼% IL Treasury Gilt 2032",coupon:1.25,maturity:2032,lag:3},{name:"0¾% IL Treasury Gilt 2033",coupon:.75,maturity:2033,lag:3},{name:"0¾% IL Treasury Gilt 2034",coupon:.75,maturity:2034,lag:3},{name:"2% IL Treasury Stock 2035",coupon:2,maturity:2035,lag:8},{name:"0⅛% IL Treasury Gilt 2036",coupon:.125,maturity:2036,lag:3},{name:"1⅛% IL Treasury Gilt 2037",coupon:1.125,maturity:2037,lag:3},{name:"0⅝% IL Treasury Gilt 2039",coupon:.625,maturity:2039,lag:3},{name:"0⅛% IL Treasury Gilt 2041",coupon:.125,maturity:2041,lag:3},{name:"0⅝% IL Treasury Gilt 2042",coupon:.625,maturity:2042,lag:3},{name:"0⅛% IL Treasury Gilt 2044",coupon:.125,maturity:2044,lag:3},{name:"0⅝% IL Treasury Gilt 2045",coupon:.625,maturity:2045,lag:3},{name:"0⅛% IL Treasury Gilt 2046",coupon:.125,maturity:2046,lag:3},{name:"0¾% IL Treasury Gilt 2047",coupon:.75,maturity:2047,lag:3},{name:"0⅛% IL Treasury Gilt 2048",coupon:.125,maturity:2048,lag:3},{name:"0½% IL Treasury Gilt 2050",coupon:.5,maturity:2050,lag:3},{name:"0⅛% IL Treasury Gilt 2051",coupon:.125,maturity:2051,lag:3},{name:"0¼% IL Treasury Gilt 2052",coupon:.25,maturity:2052,lag:3},{name:"1¼% IL Treasury Stock 2055",coupon:1.25,maturity:2055,lag:8},{name:"0⅛% IL Treasury Gilt 2056",coupon:.125,maturity:2056,lag:3},{name:"0⅛% IL Treasury Gilt 2058",coupon:.125,maturity:2058,lag:3},{name:"0⅜% IL Treasury Gilt 2062",coupon:.375,maturity:2062,lag:3},{name:"0⅛% IL Treasury Gilt 2065",coupon:.125,maturity:2065,lag:3},{name:"0⅛% IL Treasury Gilt 2068",coupon:.125,maturity:2068,lag:3},{name:"0⅛% IL Treasury Gilt 2073",coupon:.125,maturity:2073,lag:3}]};let G0=null;function j0(t){G0=t&&t.gilts?t:null}function Bu(){return G0||MI}function BI(t=Date.now(),e=48){const n=Date.parse(Bu().generated_at||0);return t-n>e*3600*1e3}function DI(t){const e=Bu().gilts,n=e.filter(i=>i.maturity===t);if(n.length)return{mode:"exact",gilts:n};const s=e.filter(i=>i.maturity<t).sort((i,o)=>o.maturity-i.maturity)[0],r=e.filter(i=>i.maturity>t).sort((i,o)=>i.maturity-o.maturity)[0];return s&&r?{mode:"bracket",gilts:[s,r]}:{mode:"beyond",gilts:[s||r].filter(Boolean)}}function Kc({rungYears:t,drawForYear:e,startYear:n,realYield:s=.023}){return{rows:t.map(i=>{const o=n+i,a=DI(o),c=e(i)*Math.pow(1+s,-i);return{planYear:i,calYear:o,gilts:a.gilts.map(d=>d.name),mode:a.mode,face:Math.round(e(i)),estCost:Math.round(c)}}),priced:"flat real yield "+(s*100).toFixed(1)+"% (no live prices in snapshot)",generated_at:Bu().generated_at,stale:BI()}}function Du(t,e,n=.025){const s=[];let r=t.isaBalance||0;const i=Math.max(0,n-.01),o=Pl(t),a=o?o.spStartYear:t.statePensionYear??1/0,c=o?o.spWeeklyAmount*52:t.statePension||0,d=o?o.spFirstYearRatio:1;let u=t.accessMethod==="ufpls"?268275:0;for(let p=0;p<=e;p++){const f=Math.pow(1+n,p),g=t.taxMode==="frozen"?t.pa:t.pa*f,v=t.taxMode==="frozen"?t.brl:t.brl*f,y=t.taxMode==="frozen"?t.hrl||125140:(t.hrl||125140)*f,E=pr(p,t.spendingProfile||"flat"),k=(Array.isArray(t.targetSchedule)&&t.targetSchedule[p]!=null?t.targetSchedule[p]:t.baseSalary||0)*f*E,P=(t.other||0)*Math.pow(1+Math.min(n,Rp),p);let R=0;p>=a&&c>0&&(R=c*(p===a?d:1)*f);let B=0;if(t.dbAmount>0&&p>=(t.dbStartYear||0)){const W=t.dbIndexation||"lpi5";W==="level"?B=t.dbAmount:W==="cpi"?B=t.dbAmount*f:B=t.dbAmount*Math.pow(1+Math.min(n,.05),p)}let D=0;for(const W of t.extraIncomes||[])if(W.annual>0&&p>=(W.startYear||0)&&(W.endYear==null||p<=W.endYear)){const ee=W.indexation||"lpi5";ee==="level"?D+=W.annual:ee==="cpi"?D+=W.annual*f:D+=W.annual*Math.pow(1+Math.min(n,.05),p)}const I=P+R+B+D,w=Math.max(0,a===1/0?0:a-p),S=!t.ufplsYears||p<t.ufplsYears,T=t.accessMethod==="ufpls"&&S&&u>0?.25:0,x=lo({targetGross:k,fixedIncome:I,pa:g,brl:v,hrl:y,isaBalance:r,strategy:t.isaDrawdownStrategy,yearsUntilSp:w,taxFreeFraction:T});u>0&&(u=Math.max(0,u-(x.taxFree||0)));const A=x.taxable-x.tax,_=r;r=x.remainingIsa*(1+i),s.push({year:p,brl:v,other:P,statePension:R,sippDraw:x.sippGross,totalTaxable:x.taxable,tax:x.tax,netIncome:A,target:k,isaDraw:x.isaDraw,isaBalance:_,spendable:x.net})}return s}function Rl(t){const e={[we.SHARES]:0,[we.BONDS]:0,[we.DIVERSIFIERS]:0,[we.CASH]:0},n={},s=[],r=[];let i=0,o=0;for(const a of t){const c=+a.value||0,d=a.subClass||(a.ticker?d0[a.ticker]:void 0),u=d?zt[d]:null;if(!u){r.push({...a});continue}if(i+=c,s.push({...a,subClass:d,bucket:u.bucket,label:u.label}),(a.wrapper||"").toUpperCase()==="ISA"){o+=c;continue}e[u.bucket]+=c,n[d]=(n[d]||0)+c}return{buckets:e,subClassTotals:n,bondWeights:fp(n,we.BONDS),diversifierWeights:fp(n,we.DIVERSIFIERS),total:i,isaTotal:o,tagged:s,untagged:r}}function fp(t,e){const n=Object.entries(t).filter(([i])=>zt[i].bucket===e),s=n.reduce((i,[,o])=>i+o,0);if(s<=0)return{};const r={};for(const[i,o]of n)r[i]=o/s;return r}function LI(t){const e=t.buckets[we.DIVERSIFIERS]||0,n={equityStart:t.buckets[we.SHARES]||0,bondStart:t.buckets[we.BONDS]||0,cashStart:t.buckets[we.CASH]||0,isaBalance:t.isaTotal||0};return e>0&&(n.diversifierStart=e,n.subAsset={}),Object.keys(t.bondWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.bondWeights=t.bondWeights),Object.keys(t.diversifierWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.diversifierWeights=t.diversifierWeights),n}let xs=null;function fo(){return{settings:{equityMin:be.EQUITY_MIN,bondMin:be.BOND_MIN,cashTarget:be.CASH_TARGET,duration:be.DURATION_YEARS,baseSalary:be.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:As.PROTECTION_MULTIPLIER,consecutiveLimit:be.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:As.HODL_ENABLED,hodlValue:As.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function Lu(){return Be()&&ut()}function ts(){xs=null}function NI(){return xs||fo()}async function K0(){if(xs)return xs;if(!Lu())return console.warn("Firebase not available - returning defaults"),fo();try{const t=await N0();if(t){const e={settings:t,lastModified:new Date().toISOString(),checksum:null};return xs=VI(e),xs}}catch(t){console.error("Error loading stress data:",t)}return fo()}async function OI(t){if(!Lu())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=FI(t),await O0(t.settings),xs=t}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function FI(t){return Qa(t.settings)}function VI(t){const e={...fo()};return t.settings&&(e.settings={...e.settings,...t.settings},t.settings.pacwMin!==void 0&&t.settings.equityMin===void 0&&(e.settings.equityMin=t.settings.pacwMin),t.settings.cgtMin!==void 0&&t.settings.bondMin===void 0&&(e.settings.bondMin=t.settings.cgtMin),t.settings.csh2Target!==void 0&&t.settings.cashTarget===void 0&&(e.settings.cashTarget=t.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=t.lastModified,e.checksum=t.checksum,e}function zI(){return NI().settings}async function De(){return(await K0()).settings}async function yi(t){const e=await K0();e.settings={...e.settings,...t},await OI(e)}async function UI(){if(!Lu())throw new Error("Must be logged in to reset settings");const t=fo();await O0(t.settings),ts()}function $I(t){return Pl(t)}function ns(t={},e=null){const n=e||zI(),s=$I(n),r=s?{spStartYear:s.spStartYear,spWeeklyAmount:s.spWeeklyAmount,spFirstYearRatio:s.spFirstYearRatio}:{statePension:n.statePension||0,statePensionYear:n.statePensionYear??999},i=qI(n.taggedFunds);return{...i?{isaMix:i}:{},equityStart:t.equityStart??n.equityMin,bondStart:t.bondStart??n.bondMin,cashStart:t.cashStart??n.cashTarget,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,years:t.years??n.duration,duration:n.duration,baseSalary:n.baseSalary,other:n.other,...r,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode,protectionMult:n.protectionMult??(n.protectionFactor!=null?1-n.protectionFactor/100:As.PROTECTION_MULTIPLIER),consecutiveLimit:n.consecutiveLimit,disableProtection:n.disableProtection,hodlEnabled:n.hodlEnabled,hodlValue:n.hodlValue,isaBalance:n.isaBalance||0,isaReturn:n.isaReturn,strategyId:n.strategyId||"pots-and-valves",pa:n.pa??12570,brl:n.brl??50270,hrl:n.hrl??125140,accessMethod:n.accessMethod||"drawdown",recoveryBuffer:n.recoveryBuffer??be.RECOVERY_BUFFER,ufplsYears:n.ufplsYears||null,ufplsThenPcls:!!n.ufplsThenPcls,bandFillRecycle:!!n.bandFillRecycle,targetSchedule:Array.isArray(n.targetSchedule)?n.targetSchedule:null,dbAmount:n.dbAmount||0,dbStartYear:n.dbStartYear||0,dbIndexation:n.dbIndexation||"lpi5",extraIncomes:Array.isArray(n.extraIncomes)?n.extraIncomes:[],windfalls:Array.isArray(n.windfalls)?n.windfalls:[],isaDrawdownStrategy:n.isaDrawdownStrategy,spendingProfile:n.spendingProfile||"flat",equityGlide:n.equityGlideEnabled?yu(n):void 0,diversifierStart:t.diversifierStart??(n.diversifierStart||void 0),subAsset:n.subAsset||void 0}}function qI(t){const e=(t||[]).filter(r=>(r.wrapper||"").toUpperCase()==="ISA"&&+r.value>0);if(!e.length)return null;const n=Rl(e.map(r=>({...r,wrapper:"SIPP"})));if(!(n.total>0))return null;const s={shares:n.buckets.shares/n.total,bonds:n.buckets.bonds/n.total,diversifiers:n.buckets.diversifiers/n.total,cash:n.buckets.cash/n.total};return Object.keys(n.bondWeights).length&&(s.bondWeights=n.bondWeights),Object.keys(n.diversifierWeights).length&&(s.diversifierWeights=n.diversifierWeights),s}async function zo(){try{const t=await Y_();return{...ho(),...t||{}}}catch(t){return console.error("Error loading budget:",t),ho()}}async function Nu(t){const e={...t,derived:mi(t)};return await W_(e),e}function j(t,e=null){const n=Math.abs(t),s=e!==null?e:n<100,r=Math.abs(t).toLocaleString("en-GB",{minimumFractionDigits:s?2:0,maximumFractionDigits:s?2:0});return t<0?`-£${r}`:`£${r}`}function pp(t,e){const n=HI(t);e.innerHTML=n}function HI(t){var x,A,_,W,ee;const e=t,n=e.calculationDetails||{};let s="";const r=e.isTaxEfficientYear??e.taxEfficient,i=e.protectionInducedTaxEfficiency||!1,o=e.boostAmount>0;let a,c,d;if(e.inProtection?(a="warning",c="Protection Mode",d="⚡"):o?(a="boost",c="Tax Boost (Catch-up)",d="↑"):i?(a="info",c="Protection-Induced Tax Efficiency",d="↑"):r?(a="success",c="Tax-Efficient Year",d="✓"):(a="warning",c="Tax-Inefficient Year",d="!"),s+=`<div class="decision-mode ${a}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,r&&e.yearlyIsaSavingsAllocation>0){const H=e.cumulativeIsaSavingsUsed||0,re=e.yearlyIsaSavingsAllocation,te=Math.max(0,re-H),ye=re>0?H/re*100:0;s+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(ye,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${j(H)} of ${j(re)}</span>
        <span>Remaining: ${j(te)}</span>
      </div>
    </div>`}if(e.pclsSuggestion>0&&(s+=`<div class="alert alert-info">
      💡 Your plan's UFPLS phase has ended. If you haven't already, take your remaining 25% tax-free
      lump sum — about <strong>${j(e.pclsSuggestion)}</strong> at today's pot value
      (capped by your remaining Lump Sum Allowance) — into your ISA, then continue in drawdown.
      Update your fund values here once done.
    </div>`),e.alerts&&e.alerts.length>0){s+='<div class="alerts">';for(const H of e.alerts){const re=YI(H.severity);s+=`<div class="alert ${re}">${H.message}</div>`}s+="</div>"}s+='<div class="recommendation-card">',s+="<h3>Monthly Recommendation</h3>",s+='<div class="draw-row primary">',s+='<span class="label">SIPP Withdrawal</span>',s+=`<span class="value">${j(e.sippDraw)}</span>`,s+="</div>",e.isaDraw>0&&(s+='<div class="draw-row">',s+='<span class="label">ISA Top-up</span>',s+=`<span class="value">${j(e.isaDraw)}</span>`,s+="</div>"),e.recycleNet>0&&(s+='<div class="draw-row">',s+='<span class="label">of which: recycle to ISA (band-fill)</span>',s+=`<span class="value">${j(e.recycleNet)}</span>`,s+="</div>",s+=`<div class="alert alert-info" style="margin:6px 0;">💡 Your SIPP withdrawal above includes an extra ${j(e.recycleGross)} to fill your basic-rate band. After 20% tax, contribute <strong>${j(e.recycleNet)}</strong> of it to your ISA — it comes out tax-free later. (Counts toward your £20,000 ISA allowance.)</div>`),e.other>0&&(s+='<div class="draw-row muted">',s+='<span class="label">Other Pension</span>',s+=`<span class="value">${j(e.other)}</span>`,s+="</div>"),e.statePension>0&&(s+='<div class="draw-row muted">',s+='<span class="label">State Pension</span>',s+=`<span class="value">${j(e.statePension)}</span>`,s+="</div>"),s+='<div class="divider"></div>';const u=e.sippDraw+e.other+e.statePension,p=u*12,f=e.pa||12570,g=e.brl||50270;let v=0;p>f&&(p<=g?v=(p-f)*.2:v=(g-f)*.2+(p-g)*.4);const y=u-v/12+e.isaDraw;s+='<div class="draw-row total">',s+='<span class="label">Total Monthly Income</span>',s+=`<span class="value">${j(y)}</span>`,s+="</div>",e.boostAmount>0&&(s+='<div class="boost-indicator">',s+='<span class="boost-label">Includes Tax Boost:</span>',s+=`<span class="boost-value">+${j(e.boostAmount)}</span>`,s+="</div>"),s+="</div>",s+='<div class="source-card">',s+="<h4>Withdraw From</h4>",s+=`<div class="source-label ${e.source.toLowerCase().replace(/[^a-z]+/g,"-")}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(s+='<div class="source-breakdown">',e.drawFromEquity>0&&(s+=`<div class="source-item">Equity: ${j(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(s+=`<div class="source-item">Bond: ${j(e.drawFromBond)}</div>`),s+="</div>"),e.drawFromDiversifier>0&&(s+='<div class="source-breakdown">',e.drawFromCash>0&&(s+=`<div class="source-item">Cash: ${j(e.drawFromCash)}</div>`),s+=`<div class="source-item">Diversifier reserve: ${j(e.drawFromDiversifier)}</div>`,s+="</div>"),s+="</div>",s+='<div class="fund-status">',s+="<h4>Fund Status</h4>";const E=e.equity+e.bond+e.cash+(e.diversifier||0),C=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,k=E-C,P=C>0?k/C*100:0;s+='<div class="fund-grid">';const R=e.equity-e.adjEquityMin;s+=ca("Equity",e.equity,e.adjEquityMin,R);const B=e.bond-e.adjBondMin;s+=ca("Bond",e.bond,e.adjBondMin,B);const D=e.cash-e.adjCashTarget;s+=ca("Cash",e.cash,e.adjCashTarget,D),e.diversifier!=null&&(s+=ca("Diversifiers",e.diversifier,0,e.diversifier)),s+="</div>";const I=k>=0?"healthy":"warning";s+=`<div class="overall-status ${I}">`,s+=`<span>Total Surplus: ${j(k)}</span>`,s+=`<span>(${P.toFixed(1)}% above target)</span>`,s+="</div>",s+="</div>",s+='<div class="tax-info">',s+="<h4>Tax Summary</h4>",s+='<div class="tax-thresholds">',s+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${j(e.pa)}</span></div>`,s+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${j(e.brl)}</span></div>`,n.taxInfo&&(s+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${n.taxInfo.headroomToBRL>0?"success":"warning"}">${j(n.taxInfo.headroomToBRL)}</span></div>`),s+="</div>",s+='<div class="tax-comparison">',s+='<div class="tax-comparison-header">',s+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",s+="</div>";const w=((x=n.taxInfo)==null?void 0:x.monthlyTax)||v/12,S=e.taxPaidYTD||w,T=e.taxProjectedAnnual||((A=n.taxInfo)==null?void 0:A.annualTax)||v;if(s+='<div class="tax-comparison-row">',s+='<div class="label">Tax Paid</div>',s+=`<div>${j(w)}</div>`,s+=`<div>${j(S)}</div>`,s+=`<div>${j(T)}</div>`,s+="</div>",r||((_=n.taxInfo)==null?void 0:_.taxSavedAnnual)>0){const H=e.taxSavedMonthly||((W=n.taxInfo)==null?void 0:W.taxSavedMonthly)||0,re=e.taxSavedYTD||H,te=e.taxSavedProjectedAnnual||((ee=n.taxInfo)==null?void 0:ee.taxSavedAnnual)||0;te>0&&(s+='<div class="tax-comparison-row saved">',s+='<div class="label">Tax Saved</div>',s+=`<div class="success">-${j(H)}</div>`,s+=`<div class="success">-${j(re)}</div>`,s+=`<div class="success">-${j(te)}</div>`,s+="</div>")}if(s+="</div>",n.taxInfo&&typeof n.taxInfo.effectiveRate=="number"&&!isNaN(n.taxInfo.effectiveRate)){const H=n.taxInfo.effectiveRate*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${H<=20?"success":H<=40?"warning":"danger"}">${H.toFixed(1)}%</span>
    </div>`}else if(n.taxInfo&&n.taxInfo.annualTaxable>0&&n.taxInfo.annualTax>=0){const H=n.taxInfo.annualTax/n.taxInfo.annualTaxable*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${H<=20?"success":H<=40?"warning":"danger"}">${H.toFixed(1)}%</span>
    </div>`}if(s+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){s+='<div class="rebalance-card">',s+="<h4>Rebalancing Suggestions</h4>",s+="<ul>";for(const H of e.rebalanceActions)s+=`<li>${H}</li>`;s+="</ul>",s+="</div>"}return s+='<div class="mode-explanation">',s+="<h4>Why This Recommendation?</h4>",s+=`<p>${n.reason||"Standard calculation based on your settings."}</p>`,!n.hasSufficientIsa&&n.isaNeededMonthly>0&&(s+=`<p class="isa-warning">To enable tax-efficient mode, you need ${j(n.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),s+="</div>",s+='<details class="debug-section">',s+="<summary>Calculation Details</summary>",s+="<pre>"+JSON.stringify(n,null,2)+"</pre>",s+="</details>",s}function ca(t,e,n,s){return`<div class="fund-cell ${s>=0?"healthy":"deficit"}">
    <div class="fund-name">${t}</div>
    <div class="fund-current">${j(e)}</div>
    <div class="fund-min">Min: ${j(n)}</div>
    <div class="fund-surplus">${s>=0?"+":""}${j(s)}</div>
  </div>`}function YI(t){switch(t){case ta.DANGER:return"alert-danger";case ta.WARNING:return"alert-warning";case ta.SUCCESS:return"alert-success";case ta.INFO:default:return"alert-info"}}function WI(){return`
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
  `}async function GI(t){const e=Mu(t),n=kl(e),s=e.getMonth()+1;return await rI(n)?{showWizard:!1,taxYear:n,isApril:s===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:n,isApril:s===4,reason:`Tax year ${n} has not been set up`}}function jI(t,e,n=0){return t*(1+e-n)}function KI(t){const{targetAnnualGross:e,brl:n,pa:s=12570,remainingMonths:r,grossIncomeToDate:i=0}=t,o=v=>v<=s?0:v<=n?(v-s)*.2:(n-s)*.2+(v-n)*.4,a=Math.max(0,n-i);if(a<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=n)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:a,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=o(e),d=e-c,u=o(n),p=n-u,f=Math.max(0,d-p),g=f/12*r;return{isaNeeded:g,isaNeededAnnual:f,brlExhausted:!1,remainingBrlHeadroom:a,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:p,taxAtTarget:c,taxAtBrl:u,reason:`Need £${Math.round(g).toLocaleString()} ISA/Savings for tax efficiency`}}function QI(t,e,n){return n?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:t>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-t,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function JI(t){const e=Mu(t),n=kl(e),r=e.getMonth()+1===4,i=EI(e),o=await Ze(),a=await Vo(n),c=await cs(),u=Object.keys(c).sort().filter(D=>D<n).pop()||null,p=u?c[u]:null,f=await Ru(n),g=(p==null?void 0:p.cpi)||Ji,v=o.spendingProfile||"flat",y=Math.max(0,2e3+(parseInt(n.split("/")[0],10)||26)-2026),E=ZT(y,v),C=p&&p.confirmedSalary||o.baseSalary,k=jI(C,g,E);let P=null;try{const D=await N0(),I=Array.isArray(D==null?void 0:D.targetSchedule)?D.targetSchedule:null;if(I&&I[y]!=null){let w=1;for(let T=0;T<y;T++){const x=String((26+T)%100).padStart(2,"0")+"/"+String((27+T)%100).padStart(2,"0");w*=1+((c[x]||{}).cpi||Ji)}const S=pr(y,o.spendingProfile||"flat");P=Math.round(I[y]*w*S)}}catch{}const R=P??k,B=P!=null?"budget-schedule":"chain";return{taxYear:n,selectedMonth:t,isApril:r,remainingMonths:i,baseSalary:o.baseSalary,suggestionBase:C,spendingProfile:v,declineRate:E,suggestedSalary:R,suggestionSource:B,chainSuggestedSalary:k,defaults:{pa:(p==null?void 0:p.pa)||a.pa,brl:(p==null?void 0:p.brl)||a.brl,hrl:(p==null?void 0:p.hrl)||a.hrl,cpi:g,other:(p==null?void 0:p.other)||0},statePension:f,existingConfig:a.yearSetupComplete?a:null}}function Q0(t){const{targetSalary:e,brl:n,pa:s=12570,other:r=0,statePension:i=0,isaSavingsAllocation:o=0,remainingMonths:a,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=t,u=A=>A<=s?0:A<=n?(A-s)*.2:(n-s)*.2+(A-n)*.4,p=r/12,f=i/12,g=p+f;let v,y;if(!d)v=e/12-g,y=0;else{const A=Math.max(0,n-c),_=Math.max(0,A/a-g);v=Math.min(e/12-g,_),y=o/a}const E=(v+g)*12,k=u(E)/12,P=v+g,R=P>0?k/P:0,B=v*R,D=p*R,I=f*R,w=v-B,S=p-D,T=f-I,x=w+S+T+y;return{sipp:{gross:v,tax:B,net:w},other:{gross:p,tax:D,net:S},statePension:{gross:f,tax:I,net:T},isa:{gross:y,tax:0,net:y},totalGross:v+p+f+y,totalTax:k,totalNet:x,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:v,monthlyIsa:y,monthlyOther:p,monthlyStatePension:f,monthlyTotal:x}}function XI(t){var y,E,C,k,P,R,B,D,I,w,S;const{pa:e,brl:n,hrl:s,cpi:r,other:i,isaSavingsAllocation:o,isTaxEfficient:a,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:u,confirmedSalary:p,remainingMonths:f,statePension:g,monthlyBreakdown:v}=t;return{pa:e,brl:n,hrl:s,cpi:r,other:i,isaSavingsAllocation:a?o:0,isaSavingsUsed:0,isTaxEfficient:a,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:u||4,remainingMonths:f||12,yearSetupComplete:!0,confirmedSalary:p,statePension:g||0,expectedMonthly:v?{sipp:{gross:((y=v.sipp)==null?void 0:y.gross)||0,tax:((E=v.sipp)==null?void 0:E.tax)||0,net:((C=v.sipp)==null?void 0:C.net)||0},other:{gross:((k=v.other)==null?void 0:k.gross)||0,tax:((P=v.other)==null?void 0:P.tax)||0,net:((R=v.other)==null?void 0:R.net)||0},statePension:{gross:((B=v.statePension)==null?void 0:B.gross)||0,tax:((D=v.statePension)==null?void 0:D.tax)||0,net:((I=v.statePension)==null?void 0:I.net)||0},isa:{gross:((w=v.isa)==null?void 0:w.gross)||0,tax:0,net:((S=v.isa)==null?void 0:S.net)||0},totalGross:v.totalGross||0,totalTax:v.totalTax||0,totalNet:v.totalNet||0}:null}}let _n=null,po=null,Jt=1,Q=null,$={};async function ZI(t,e,n){_n=t,po=n,Jt=1,$={},Q=await JI(e),$={pa:Q.defaults.pa,brl:Q.defaults.brl,hrl:Q.defaults.hrl,cpi:Q.defaults.cpi,other:Q.defaults.other,grossIncomeToDate:0,confirmedSalary:Q.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},ji()}async function e6(t){return await GI(t)}function ji(){if(!_n||!Q)return;const t=Q.isApril?6:7;_n.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${Q.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${Q.isApril?"Setting up for the full tax year":`Starting in ${Ou(Q.selectedMonth)} - ${Q.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${s6(t,Jt)}
        </div>

        ${t6()}
      </div>
    </div>
  `,r6()}function t6(){if(Q.isApril,Q.isApril)switch(Jt){case 1:return mp();case 2:return gp();case 3:return yp();case 4:return vp();case 5:return bp();case 6:return wp();default:return""}else switch(Jt){case 1:return mp();case 2:return n6();case 3:return gp();case 4:return yp();case 5:return vp();case 6:return bp();case 7:return wp();default:return""}}function mp(){return`
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
            <input type="number" id="wizPA" value="${$.pa}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Basic Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBRL" value="${$.brl}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Higher Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizHRL" value="${$.hrl}">
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
  `}function n6(){const t=Ou(Q.selectedMonth),e=l6(Q.selectedMonth);return`
    <div class="wizard-step">
      <div class="wizard-step-title">Income Before Starting Pension</div>
      <div class="wizard-step-desc">
        You're starting your pension drawdown in ${t}. Enter any taxable income you've already received this tax year (April to ${e}).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizIncomeToDate" value="${$.grossIncomeToDate}" placeholder="0">
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
  `}function gp(){const t=$.cpi!==void 0?$.cpi:Q.defaults.cpi,e=(t*100).toFixed(1),n=Q.suggestionBase??Q.baseSalary,s=Q.declineRate||0,r=Q.suggestionSource==="budget-schedule",i=Math.round(r?Q.suggestedSalary:n*(1+t-s)),o=s>0,a=((t-s)*100).toFixed(1);return`
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
        ${r?`<p><strong>From your budget's plan for this year</strong> — the per-year schedule you set
             from the Budget tool (temporary costs end when they end, one-offs land in their year),
             uplifted to this year's money:</p>`:""}
        ${r?`<span id="cpiDisplay" hidden>${e}</span><span id="netUpliftDisplay" hidden>${a}</span>`:o?`<p>Your plan uses <strong>declining spending</strong> (~${(s*100).toFixed(0)}%/yr real). Last year's salary rises with <span id="cpiDisplay">${e}</span>% CPI less that decline — a net <strong><span id="netUpliftDisplay">${a}</span>%</strong> — to:</p>`:`<p>Based on <span id="cpiDisplay">${e}</span>% inflation, your target salary should be:<span id="netUpliftDisplay" hidden>${a}</span></p>`}
        <p style="font-size: 24px; color: var(--primary); margin: 12px 0;">£<span id="suggestedSalaryDisplay">${i.toLocaleString()}</span></p>
        <p>per year (gross)</p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Confirm or adjust your target salary:
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizSalary" value="${Math.round($.confirmedSalary||i)}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function yp(){const t=Q.statePension,e=t.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(t.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${t.yearsUntil} years until state pension</span>`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Other Taxable Income</div>
      <div class="wizard-step-desc">
        Enter any other taxable income you'll receive this tax year (annual amount).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizOther" value="${$.other}">
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
  `}function vp(){Uo();const t=KI({targetAnnualGross:$.confirmedSalary,brl:$.brl,pa:$.pa,other:$.other,statePension:Q.statePension.amount,remainingMonths:Q.remainingMonths,grossIncomeToDate:$.grossIncomeToDate});return $._isaCalc=t,t.brlExhausted?`
      <div class="wizard-step">
        <div class="wizard-step-title">BRL Already Exhausted</div>

        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2); border: 1px solid var(--danger);">
          <p style="color: var(--danger); font-weight: 500;">
            Your income to date (£${$.grossIncomeToDate.toLocaleString()}) has already exceeded the BRL (£${$.brl.toLocaleString()}).
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
    `:t.targetAchievableAtBrl?`
      <div class="wizard-step">
        <div class="wizard-step-title">Good News!</div>

        <div class="wizard-info-box" style="background: rgba(46, 204, 113, 0.2); border: 1px solid var(--success);">
          <p style="color: var(--success); font-weight: 500;">
            Your target salary of £${Math.round($.confirmedSalary).toLocaleString()} is achievable within the BRL.
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
          £${Math.round(t.isaNeeded).toLocaleString()}
        </p>
        <p>from ISA/Savings</p>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
          This keeps your SIPP draw at the BRL (£${$.brl.toLocaleString()}) while reaching your target salary.
        </p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        How much ISA/Savings can you allocate this tax year?
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizISA" value="${$.isaSavingsAllocation||Math.round(t.isaNeeded)}">
      </div>

      <div class="wizard-example">
        <strong>Tip:</strong> This is money you'll withdraw tax-free from ISA or savings to supplement your SIPP income.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function bp(){Uo();const t=$._isaCalc,e=QI($.isaSavingsAllocation,(t==null?void 0:t.isaNeeded)||0,(t==null?void 0:t.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return $.isTaxEfficient=!0,$.taxEfficiencyChoice="efficient",setTimeout(()=>{Jt++,ji()},0),`
      <div class="wizard-step">
        <div class="wizard-step-title">Setting Up Tax Efficiency...</div>
        <div class="wizard-info-box">
          <p>Your ISA allocation is sufficient for tax efficiency.</p>
        </div>
      </div>
    `;const n=e.shortfall>0?`You entered £${$.isaSavingsAllocation.toLocaleString()} but need £${Math.round(t.isaNeeded).toLocaleString()}.`:"";return`
    <div class="wizard-step">
      <div class="wizard-step-title">Tax Efficiency Choice</div>

      ${e.isBrlExhausted?`
        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2);">
          <p style="color: var(--danger);">Your prior income has exhausted the BRL. You cannot be tax-efficient this year.</p>
        </div>
      `:`
        <div class="wizard-info-box" style="background: rgba(243, 156, 18, 0.2);">
          <p style="color: var(--warning);">${n}</p>
        </div>
      `}

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Choose how to proceed:
      </div>

      <div class="wizard-options">
        ${e.isBrlExhausted?"":`
          <label class="wizard-option">
            <input type="radio" name="taxChoice" value="increase" ${$.taxEfficiencyChoice==="increase"?"checked":""}>
            <div class="wizard-option-content">
              <strong>Increase ISA to £${Math.round(t.isaNeeded).toLocaleString()}</strong>
              <p>Provide enough ISA/Savings for tax efficiency</p>
            </div>
          </label>
        `}

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="reduced" ${$.taxEfficiencyChoice==="reduced"?"checked":""}>
          <div class="wizard-option-content">
            <strong>Reduce salary to BRL (£${$.brl.toLocaleString()})</strong>
            <p>Keep ISA/Savings to grow, accept lower income this year</p>
          </div>
        </label>

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="inefficient" ${$.taxEfficiencyChoice==="inefficient"?"checked":""}>
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
  `}function wp(){Uo();const t=Q0({targetSalary:$.confirmedSalary,brl:$.brl,pa:$.pa,other:$.other,statePension:Q.statePension.amount,isaSavingsAllocation:$.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:$.grossIncomeToDate,isTaxEfficient:$.isTaxEfficient}),e=$.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",n=$.isTaxEfficient?"success":"warning",s=r=>`£${Math.round(r).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${Q.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${Ou(Q.selectedMonth)}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Remaining Months:</span>
          <span>${Q.remainingMonths}</span>
        </div>
        ${$.grossIncomeToDate>0?`
          <div class="wizard-summary-row">
            <span>Income to Date:</span>
            <span>${s($.grossIncomeToDate)}</span>
          </div>
        `:""}
        <div class="wizard-summary-row">
          <span>Target Salary:</span>
          <span>${s($.confirmedSalary)}/year</span>
        </div>
        <div class="wizard-summary-row">
          <span>Tax Mode:</span>
          <span class="${n}">${e}</span>
        </div>
        <div class="wizard-summary-row">
          <span>ISA Allocation:</span>
          <span>${s($.isaSavingsAllocation)}</span>
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
              <td style="padding: 4px 0; text-align: right;">${s(t.sipp.gross)}</td>
              <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${s(t.sipp.tax)}</td>
              <td style="padding: 4px 0; text-align: right;">${s(t.sipp.net)}</td>
            </tr>
            ${t.other.gross>0?`
              <tr>
                <td style="padding: 4px 0;">Other</td>
                <td style="padding: 4px 0; text-align: right;">${s(t.other.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${s(t.other.tax)}</td>
                <td style="padding: 4px 0; text-align: right;">${s(t.other.net)}</td>
              </tr>
            `:""}
            ${t.statePension.gross>0?`
              <tr>
                <td style="padding: 4px 0;">State Pension</td>
                <td style="padding: 4px 0; text-align: right;">${s(t.statePension.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${s(t.statePension.tax)}</td>
                <td style="padding: 4px 0; text-align: right;">${s(t.statePension.net)}</td>
              </tr>
            `:""}
            ${t.isa.net>0?`
              <tr>
                <td style="padding: 4px 0;">ISA <span style="color: var(--success);">(tax-free)</span></td>
                <td style="padding: 4px 0; text-align: right;">${s(t.isa.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--success);">£0</td>
                <td style="padding: 4px 0; text-align: right;">${s(t.isa.net)}</td>
              </tr>
            `:""}
          </tbody>
          <tfoot>
            <tr style="border-top: 1px solid var(--border); font-weight: bold;">
              <td style="padding: 8px 0;">Total</td>
              <td style="padding: 8px 0; text-align: right;">${s(t.totalGross)}</td>
              <td style="padding: 8px 0; text-align: right; color: var(--danger);">-${s(t.totalTax)}</td>
              <td style="padding: 8px 0; text-align: right; color: var(--success);">${s(t.totalNet)}</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top: 12px; font-size: 14px; color: var(--text);">
          <strong>You'll receive ${s(t.totalNet)}/month</strong> in your bank
        </p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="finish">Confirm & Save</button>
      </div>
    </div>
  `}function s6(t,e){let n="";for(let s=1;s<=t;s++){const r=s<e?"done":s===e?"active":"";n+=`<div class="wizard-dot ${r}"></div>`}return n}function r6(){_n.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>i6(e.dataset.action))}),window._updateWizardSalary=function(){if(Q&&Q.suggestionSource==="budget-schedule")return;const e=document.getElementById("wizCPI"),n=document.getElementById("wizSalary"),s=document.getElementById("cpiDisplay"),r=document.getElementById("suggestedSalaryDisplay");if(e&&n&&s&&r){const i=parseFloat(e.value)||0,o=i/100,a=Q.suggestionBase??Q.baseSalary,c=Q.declineRate||0,d=Math.round(a*(1+o-c));s.textContent=i.toFixed(1),r.textContent=d.toLocaleString();const u=document.getElementById("netUpliftDisplay");u&&(u.textContent=((o-c)*100).toFixed(1)),n.value=d,$.cpi=o,$.confirmedSalary=d}}}function i6(t){Uo();const e=Q.isApril?6:7;switch(t){case"cancel":J0(),po&&po({completed:!1,cancelled:!0});break;case"next":Jt<e&&(Jt++,ji());break;case"back":Jt>1&&(Jt--,ji());break;case"apply-choice":o6(),Jt++,ji();break;case"finish":{const n=_n==null?void 0:_n.querySelector('[data-action="finish"]');if(n){if(n.disabled)break;n.disabled=!0,n.textContent="Saving…"}a6().finally(()=>{n&&(n.disabled=!1,n.textContent="Confirm & Save")});break}}}function o6(){var e;const t=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch($.taxEfficiencyChoice=t,t){case"increase":$.isaSavingsAllocation=$._isaCalc.isaNeeded,$.isTaxEfficient=!0;break;case"reduced":$.confirmedSalary=$.brl,$.isaSavingsAllocation=0,$.isTaxEfficient=!0;break;case"inefficient":$.isaSavingsAllocation=0,$.isTaxEfficient=!1;break}}function Uo(){const t=document.getElementById("wizPA");t&&($.pa=parseFloat(t.value)||12570);const e=document.getElementById("wizBRL");e&&($.brl=parseFloat(e.value)||50270);const n=document.getElementById("wizHRL");n&&($.hrl=parseFloat(n.value)||125140);const s=document.getElementById("wizCPI");s&&($.cpi=(parseFloat(s.value)||Ji*100)/100);const r=document.getElementById("wizSalary");r&&($.confirmedSalary=parseFloat(r.value)||3e4);const i=document.getElementById("wizOther");i&&($.other=parseFloat(i.value)||0);const o=document.getElementById("wizISA");o&&($.isaSavingsAllocation=parseFloat(o.value)||0);const a=document.getElementById("wizIncomeToDate");a&&($.grossIncomeToDate=parseFloat(a.value)||0)}async function a6(){Uo();const t=Q0({targetSalary:$.confirmedSalary,brl:$.brl,pa:$.pa,other:$.other,statePension:Q.statePension.amount,isaSavingsAllocation:$.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:$.grossIncomeToDate,isTaxEfficient:$.isTaxEfficient}),e=XI({pa:$.pa,brl:$.brl,hrl:$.hrl,cpi:$.cpi,other:$.other,isaSavingsAllocation:$.isaSavingsAllocation,isTaxEfficient:$.isTaxEfficient,taxEfficiencyChoice:$.taxEfficiencyChoice,grossIncomeToDate:$.grossIncomeToDate,startMonth:parseInt(Q.selectedMonth.split("-")[1]),confirmedSalary:$.confirmedSalary,remainingMonths:Q.remainingMonths,statePension:Q.statePension.amount,monthlyBreakdown:t});console.log(`Tax Year Wizard: Saving config for ${Q.taxYear}`,e);try{await Ir(Q.taxYear,e);const n=await Vo(Q.taxYear);if(!n||!n.yearSetupComplete)throw new Error("the saved tax year did not read back — please try Confirm again");console.log(`Tax Year Wizard: Successfully saved config for ${Q.taxYear}`)}catch(n){console.error(`Tax Year Wizard: Failed to save config for ${Q.taxYear}`,n),typeof window.showToast=="function"&&window.showToast(`Error saving tax year configuration: ${n.message}`,"error");return}J0(),po&&po({completed:!0,taxYear:Q.taxYear,config:e,wizardInputs:$})}function J0(){_n&&(_n.innerHTML="",_n.style.display="none")}function Ou(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function l6(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-2,1).toLocaleString("default",{month:"long"})}function c6(){return`
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
  `}function d6(t={},e=null){const n=ns(t,e),s=ls(n.strategyId).engine.runMonteCarlo(n),r=b0(s);return{results:s,stats:r,config:n}}function u6(t={},e=null){const n=ns(t,e),s=ls(n.strategyId).engine.runHistorical(n),r=b0(s);return{results:s,stats:r,config:n}}function h6(t={}){const e=ns(t),n={};for(const[s,r]of Object.entries(d1))n[s]={...r,result:ls(e.strategyId).engine.runScenario(e,r)};return n}let gr=bu,Ki=null,Ep=!1,Qc=!1,X0=null;function Ml(){return gr}function ii(t){const e=(t||"").toUpperCase().trim();return gr.find(n=>n.ticker===e)||null}function f6(){return Qc}function p6(){return X0}function m6(){return Ki}async function g6(){if(!(Ep||!Be()||!Ee)){Ep=!0;try{const t=await Fr(it(Ee,"adminPrivate","access"));Qc=!0,X0=t.exists()&&t.data().passphrase||null}catch{Qc=!1}try{const[t,e,n,s]=await Promise.all([Fr(it(Ee,"admin","fundCatalogue")),Fr(it(Ee,"admin","subAssetProfiles")),Fr(it(Ee,"admin","typicalAmounts")),Fr(it(Ee,"admin","linkers"))]);if(s.exists()&&Array.isArray(s.data().gilts)&&(j0(s.data()),console.log("AdminConfig: linker-universe override active ("+s.data().gilts.length+" gilts)")),t.exists()){const r=t.data().funds;Array.isArray(r)&&r.length&&r.every(i=>i.ticker&&i.subClass)&&(gr=Object.freeze([...r].sort((i,o)=>i.ticker.localeCompare(o.ticker))),console.log("AdminConfig: fund catalogue override active ("+gr.length+" funds)"))}if(e.exists()&&(Ki=e.data().overrides||null,Ki&&(c0(Ki),console.log("AdminConfig: sub-asset profile overrides active"))),n.exists()){const r=n.data().tiers;r&&typeof r=="object"&&(S_(r),console.log("AdminConfig: typical-amounts override active"))}}catch(t){console.warn("AdminConfig: using code defaults ("+t.message+")")}}}async function y6(t){const e=(t||[]).filter(n=>n.ticker&&n.subClass).map(n=>({ticker:String(n.ticker).toUpperCase().trim(),name:String(n.name||""),subClass:n.subClass}));return await gl(it(Ee,"admin","fundCatalogue"),{funds:e,updatedAt:vl()}),gr=Object.freeze([...e].sort((n,s)=>n.ticker.localeCompare(s.ticker))),gr.length}async function v6(t){const e=(t||[]).filter(s=>s.name&&s.maturity).map(s=>({name:String(s.name),coupon:+s.coupon||0,maturity:+s.maturity,lag:+s.lag||3})),n={generated_at:new Date().toISOString(),gilts:e,updatedAt:vl()};return await gl(it(Ee,"admin","linkers"),n),j0(n),e.length}async function b6(){await yl(it(Ee,"admin","fundCatalogue")),gr=bu}async function Z0(t){const e=t&&Object.keys(t).length?t:null;e?await gl(it(Ee,"admin","subAssetProfiles"),{overrides:e,updatedAt:vl()}):await yl(it(Ee,"admin","subAssetProfiles")),Ki=e,c0(e)}function w6({ticker:t,name:e,subClass:n}){try{const s=An();if(!s||!Be()||!Ee||!t)return;Kg(Jd(Ee,"fundSuggestions"),{ticker:String(t).toUpperCase().trim().slice(0,12),name:String(e||"").slice(0,80),subClass:String(n||"").slice(0,40),uid:s.uid,createdAt:vl()}).catch(()=>{})}catch{}}async function E6(t=100){return(await jg(aT(Jd(Ee,"fundSuggestions"),lT("createdAt","desc"),cT(t)))).docs.map(n=>({id:n.id,...n.data()}))}async function T6(t){await yl(it(Ee,"fundSuggestions",t))}function ey(t){return kl(Mu(t))}function _6(t){const[e,n]=t.split("-").map(Number);return Math.max(0,(n>=4?e:e-1)-2026)}async function I6(t,e,n,s,r){var qo,js,_i,kr;const i=r.settings,o=r.history,a=r.allTaxYears,c=ey(t),d=_6(t),[u,p]=t.split("-").map(Number);if(!a[c])throw new Error(`Tax year ${c} is not configured. Please add it in the Settings tab before calculating.`);const f=a[c],g=f.pa||12570,v=f.brl||50270,y=f.hrl||125140,E=f.other||0,C=f.isTaxEfficient!==!1,k=f.isaSavingsAllocation||0,P=f.grossIncomeToDate||0,R=f.confirmedSalary||i.baseSalary,B=o.find(J=>J.date===t),D=(B==null?void 0:B.isa)||0,I=Math.max(0,(f.isaSavingsUsed||0)-D),S=r.spInfo.amount||0;let T=1;for(let J=0;J<d;J++){const Pe=String((26+J)%100).padStart(2,"0")+"/"+String((27+J)%100).padStart(2,"0"),Nt=(a[Pe]||{}).cpi||Ji;T*=1+Nt}let x=jn(i.equityMin,d,i.duration,T,!0),A=jn(i.bondMin,d,i.duration,T,!0);const _=Math.round(jn(i.cashTarget,d,i.duration,T,!1)),W=wl(i.equityGlide,d,i.duration);if(W!=null){const J=x+A;x=J*W,A=J*(1-W)}x=Math.round(x),A=Math.round(A);const ee=e+n,H=x+A;let re=0;const te=o.filter(J=>J.date<t);for(let J=te.length-1;J>=0&&(te[J].source&&te[J].source!=="Growth");J--)re++;let ye=0;for(let J=te.length-1;J>=0&&te[J].inProtection;J--)ye++;const he=i.disableProtection?!1:o0({totalGrowth:ee,minGrowth:H,consecCashDraws:re,wasInProtection:te.length>0&&te[te.length-1].inProtection,consecutiveLimit:i.consecutiveLimit||3,recoveryBuffer:i.recoveryBuffer||Ha.RECOVERY_BUFFER}),ft=p>=4?16-p:4-p,ie=Math.max(1,ft),z=f.confirmedSalary?f.confirmedSalary:i.baseSalary*T,xe=E+S;qt(z,g,v,y);let ae,nn,Ge,Pn=0,oe=0,fe=!1,je=0;const sn=268275,At=o.reduce((J,Pe)=>J+(Pe.taxFree||0),0),Ke=!i.ufplsYears||d<i.ufplsYears,Lt=i.accessMethod==="ufpls"&&Ke&&At<sn,et=Lt?.25:0;let rn=0;i.accessMethod==="ufpls"&&i.ufplsThenPcls&&i.ufplsYears>0&&d===Math.floor(i.ufplsYears)&&At<sn&&(rn=Math.max(0,Math.min(.25*(e+n+s),sn-At)));const kt=Math.max(1,Math.min(12,f.remainingMonths||12)),on=kt<12&&P||0,Sr=Math.max(0,k-I)/ie;if(C){const J=xe/12;o.filter(pe=>pe.taxYear===c&&pe.date<t);const Pe=z/12,Nt=r.isaBalance||0;let Qe,Pt;if(Nt>0){const pe=lo({targetGross:z,fixedIncome:xe+on,pa:g,brl:v,hrl:y,taxFreeFraction:et,isaBalance:Nt,strategy:i.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0});Qe=pe.sippGross/kt,Pt=pe.isaDraw/kt}else{if(((js=(qo=f.expectedMonthly)==null?void 0:qo.sipp)==null?void 0:js.gross)>0)Qe=f.expectedMonthly.sipp.gross;else{const Ot=Math.max(0,v-P-xe)/(1-et)/12;Qe=Math.min(Pe-J,Ot)}const pe=qt(z,g,v,y)/12,mt=Math.min(z,v),gt=qt(mt,g,v,y)/12,ms=Math.max(0,pe-gt);Pt=Math.min(ms,Sr)}if(je=Pt,Pn=Qe,he){const pe=1-(i.protectionFactor||20)/100;ae=Qe*$c(ye,pe),nn=Pt,Ge="Protection"}else{ae=Qe,nn=Pt,Ge="Tax-Efficient";const pe=p>=4?u:u-1,mt=te.filter(Ot=>{const[Cr,Qs]=Ot.date.split("-").map(Number);return(Qs>=4?Cr:Cr-1)===pe});let gt=0,ms=0;mt.forEach(Ot=>{ms+=Ot.sipp||0,Ot.inProtection&&Ot.stdSipp&&(gt+=Ot.stdSipp-Ot.sipp),Ot.boostAmount>0&&(gt-=Ot.boostAmount)});const Ks=(ms+ae*ie)*(1-et)+xe;oe=wa({shortfall:gt,standardMonthly:Qe,remainingMonths:ie,surplus:ee-H-Hr.SURPLUS_BUFFER,brlHeadroom:v-Ks}),oe>50&&(ae+=oe,Ge="Tax Boost")}}else{let J;((kr=(_i=f.expectedMonthly)==null?void 0:_i.sipp)==null?void 0:kr.gross)>0?J=f.expectedMonthly.sipp.gross:J=lo({targetGross:z,fixedIncome:xe+on,pa:g,brl:v,hrl:y,taxFreeFraction:et,isaBalance:0,strategy:i.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0}).sippGross/kt,Pn=J,nn=0;const Pe=p>=4?u:u-1,Nt=te.filter(pe=>{const[mt,gt]=pe.date.split("-").map(Number);return(gt>=4?mt:mt-1)===Pe});let Qe=0,Pt=0;if(Nt.forEach(pe=>{Pt+=pe.sipp||0,pe.inProtection&&pe.stdSipp&&(Qe+=pe.stdSipp-pe.sipp),pe.boostAmount>0&&(Qe-=pe.boostAmount)}),he){const pe=1-(i.protectionFactor||20)/100;ae=J*$c(ye,pe),Ge="Protection";const mt=(Pt+ae*ie)*(1-et)+xe,gt=v-mt;oe=wa({shortfall:gt,standardMonthly:J,remainingMonths:ie,surplus:ee-H-Hr.SURPLUS_BUFFER,brlHeadroom:gt}),oe>0&&(ae+=oe,fe=!0,Ge="Protection-Induced Efficiency")}else{ae=J,Ge="Tax-Inefficient";const pe=(Pt+ae*ie)*(1-et)+xe;oe=wa({shortfall:Qe,standardMonthly:J,remainingMonths:ie,surplus:ee-H-Hr.SURPLUS_BUFFER,brlHeadroom:v-pe}),oe>0&&(ae+=oe,Ge="Tax Boost")}}let Rn=0,Mn=0;if(i.bandFillRecycle&&et===0&&!he){const J=p>=4?u:u-1,Pe=te.filter(mt=>{const[gt,ms]=mt.date.split("-").map(Number);return(ms>=4?gt:gt-1)===J});let Nt=0,Qe=0;Pe.forEach(mt=>{Nt+=mt.sipp||0,Qe+=mt.recycleNet||0});const Pt=Nt+ae*ie+xe+on,pe=a0({brlHeadroom:v-Pt,remainingMonths:ie,isaAllowanceLeft:vu.ISA_ANNUAL_ALLOWANCE-Qe});Rn=pe.gross,Mn=pe.net,Rn>0&&(ae+=Rn)}const Wt=r.diversifier||0,Ct=l0({draw:ae,equity:e,bond:n,cash:s,diversifier:Wt,diversifierTarget:r.diversifierTarget||Wt||0,hodl:0,eqMin:x,bdMin:A,csTarget:_,inProtection:he}),Fe=Ct.source,Ve=Ct.reason,Bn=Ct.fromEquity,xr=Ct.fromBond,us=Ct.fromCash,Ys=Ct.fromDiversifier,Dn=Ct.fromEquity+Ct.fromBond>1e-9&&(he||ee<H+ae),hs=Ct.shortfall>1e-6||Dn?"Cash low!":"";let He="";const Ut=e-x,Ln=n-A;if(Ut>5e3&&Ln<-5e3){const J=Math.floor(Math.min(Ut,-Ln)/1e3)*1e3;J>=5e3&&(He=`Move £${J.toLocaleString()} Equity→Bond`)}else if(Ln>5e3&&Ut<-5e3){const J=Math.floor(Math.min(Ln,-Ut)/1e3)*1e3;J>=5e3&&(He=`Move £${J.toLocaleString()} Bond→Equity`)}let fs="";const Gt=Math.floor((Ct.replenish||0)/1e3)*1e3;Gt>=1e3&&(fs=`Replenish Cash: Move £${Gt.toLocaleString()} from growth funds`);const an=[];hs&&an.push({message:hs,severity:"danger",type:"low-cash"}),oe>50&&an.push({message:`Tax Boost: +£${Math.round(oe).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),He&&an.push({message:He,severity:"warning",type:"rebalance"}),fs&&an.push({message:fs,severity:"info",type:"cash-replenish"});const Ar=p>=4?u:u-1,ln=te.filter(J=>{const[Pe,Nt]=J.date.split("-").map(Number);return(Nt>=4?Pe:Pe-1)===Ar}),jt=ln.reduce((J,Pe)=>J+(Pe.sipp||0),0),Nn=ln.length+1,ze=Math.max(0,kt-Nn)*Pn,K=(jt+ae+ze)*(1-et)+E+S+on,ve=ba(K,g,v,y),tt=(ve-ba(on,g,v,y))/kt,On=ae+E/12+S/12-tt+nn,Ws=tt*Nn,Gs=ve,$l=z/12,ql=ba($l*12,g,v,y),gn=Math.max(0,ql/12-ve/12),Hl=I+je;return{date:t,taxYear:c,yearNumber:d,remainingMonths:ie,equity:e,bond:n,cash:s,isa:0,adjEquityMin:x,adjBondMin:A,adjCashTarget:_,pa:g,brl:v,other:E/12,statePension:S/12,sippDraw:ae,stdSipp:Pn,isaDraw:nn,totalMonthlyNet:On,monthlyTax:tt,taxFree:ae*et,accessMethod:Lt?"ufpls":"drawdown",lsaRemaining:Lt?Math.max(0,sn-At):null,pclsSuggestion:rn,recycleGross:Rn,recycleNet:Mn,isTaxEfficientYear:C,yearlyIsaSavingsAllocation:k,cumulativeIsaSavingsUsed:Hl,isaSavingsUsedThisMonth:je,taxPaidYTD:Ws,taxProjectedAnnual:Gs,taxSavedMonthly:gn,taxSavedYTD:gn*Nn,taxSavedProjectedAnnual:gn*12,taxEfficient:C&&!fe,inProtection:he,protectionReason:he?Ve:null,consecutiveCashDraws:re,protectionInducedTaxEfficiency:fe,boostAmount:oe>50?oe:0,boostEligible:oe>50,source:Fe,drawFromEquity:Bn,drawFromBond:xr,drawFromCash:us,...Wt>0?{drawFromDiversifier:Ys,diversifier:Wt}:{},rebalanceNeeded:He!=="",rebalanceActions:He?[He]:[],alerts:an,calculationDetails:{mode:Ge,reason:`${Ve} | ${Ge}`,totalGrowth:ee,minGrowth:H,consec:re,stdSipp:ae,inputs:{baseSalary:i.baseSalary,confirmedSalary:R,targetGross:z,cumInf:T,yearNum:d,taxYear:c,OTHER:E,STATE:S,PA:g,BRL:v,isTaxEfficientYear:C,yearlyIsaSavingsAllocation:k,grossIncomeToDate:P},taxInfo:{annualTaxable:K,headroomToBRL:v-K,annualTax:ve,monthlyNet:On}}}}let mo=null;function S6(t,e){mo=t,x6(e)}function x6({onGetStarted:t,onSignIn:e}){mo&&(mo.innerHTML=`
    <div class="landing-page">
      <div class="landing-content">

        <!-- Hero -->
        <div class="landing-hero">
          <h1>Pension Planner</h1>
          <p class="landing-tagline">Plan your retirement with confidence</p>
          <p class="landing-subtitle">Free tools to work out what your retirement will actually cost, stress-test whether your pension can pay for it, and decide where to draw from each month.</p>
        </div>

        <!-- The flow in one line -->
        <p class="landing-flow">What will it cost? <span>&#8594;</span> Will the money last? <span>&#8594;</span> What do I draw this month?</p>

        <!-- Tools overview -->
        <div class="landing-tools">
          <div class="landing-tool-card">
            <div class="landing-step-badge">Step 1</div>
            <div class="landing-tool-icon">&#x1F9FE;</div>
            <h3>Budget Planner</h3>
            <p class="landing-tool-question">"What will retirement actually cost?"</p>
            <p>A guided walk-through of your real spending — bills to holidays to the car you'll replace every few years — with typical UK figures when you're unsure. Couples can split who pays what. The answer becomes your plan's target.</p>
          </div>

          <div class="landing-tool-card">
            <div class="landing-step-badge">Step 2</div>
            <div class="landing-tool-icon">&#x1F4CA;</div>
            <h3>Stress Tester</h3>
            <p class="landing-tool-question">"Can I afford to retire?"</p>
            <p>Run 1,000 simulations using real historical market data. See how your pension holds up under crashes, inflation, and different spending levels.</p>
          </div>

          <div class="landing-tool-card">
            <div class="landing-step-badge">Step 3</div>
            <div class="landing-tool-icon">&#x1F4B7;</div>
            <h3>Monthly Decisions</h3>
            <p class="landing-tool-question">"Where should I take money from?"</p>
            <p>Each month, get a clear recommendation on which fund to draw from — equity, bonds, or cash — to maximise tax efficiency and protect your portfolio.</p>
          </div>
        </div>

        <div class="landing-section">
          <h2>Still saving? There's a tool for that too</h2>
          <p>The <strong>Accumulation Planner</strong> works the same net-first way for the years
          before retirement: say what you can spare from take-home pay, and it works out the gross
          pension purchase under your scheme's tax relief, projects your pot, and checks whether
          you're on track for your own budget-derived target — not a rule of thumb.</p>
        </div>

        <!-- Why use this -->
        <div class="landing-section">
          <h2>What you'll need</h2>
          <p>Just a few basic numbers — your ages, roughly what you spend, and your pension fund values. Everything works in take-home terms: you say what you want in your pocket each month and the tax is handled for you. No gross-salary puzzles, and no sensitive data like account numbers or passwords.</p>
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

        <div class="landing-footer">
          <p><a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a> &middot; Usefulish Ltd</p>
        </div>

      </div>
    </div>
  `,document.getElementById("landingGetStarted").addEventListener("click",t),document.getElementById("landingSignIn").addEventListener("click",e))}function go(){mo&&(mo.style.display="none")}function A6(){return`
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

    .landing-flow {
      text-align: center;
      font-size: 15px;
      color: var(--text-muted);
      margin: 0 0 18px;
    }

    .landing-flow span { color: var(--primary); font-weight: 700; padding: 0 4px; }

    .landing-step-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--primary);
      border: 1px solid var(--primary);
      border-radius: 999px;
      padding: 2px 10px;
      margin-bottom: 10px;
    }

    .landing-tools {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
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

    .landing-footer {
      text-align: center;
      margin-bottom: 24px;
      font-size: 13px;
      color: var(--text-muted);
    }

    .landing-footer a {
      color: var(--text-muted);
      text-decoration: underline;
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
  `}let at=null,Qi=null,Is=!1;function k6(t,e){console.log("initAuthScreen: initializing"),at=t,Qi=e,Is=!1,Xg(n=>{if(console.log("AuthScreen: auth state change received:",n?n.email:"null","processed:",Is),n&&!n.emailVerified){D6(n);return}n&&Qi&&!Is?(console.log("AuthScreen: calling onAuthSuccessCallback"),Is=!0,ty(),Qi(n)):n?console.log("AuthScreen: skipping callback, already processed or no callback"):(Is=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),Fu(),console.log("initAuthScreen: complete")}function Fu(){if(at){if(!Be()){at.innerHTML=`
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
    `;return}at.innerHTML=`
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
          <p><a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a> &middot; Usefulish Ltd</p>
        </div>
      </div>
    </div>
  `,C6()}}function C6(){const t=at.querySelectorAll(".auth-screen-tab");t.forEach(i=>{i.addEventListener("click",()=>{t.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=document.getElementById("signinForm"),a=document.getElementById("signupForm");i.dataset.tab==="signin"?(o.style.display="block",a.style.display="none"):(o.style.display="none",a.style.display="block"),yr()})}),document.getElementById("signinForm").addEventListener("submit",P6),document.getElementById("signupForm").addEventListener("submit",R6),document.getElementById("forgotPasswordBtn").addEventListener("click",M6),document.getElementById("googleSigninBtn").addEventListener("click",B6)}function pn(t){const e=document.getElementById("authScreenError");e&&(e.textContent=t,e.style.display="block")}function yr(){const t=document.getElementById("authScreenError");t&&(t.style.display="none")}async function P6(t){t.preventDefault(),yr();const e=document.getElementById("signinEmail").value.trim(),n=document.getElementById("signinPassword").value;if(!e||!n){pn("Please enter email and password");return}try{await ET(e,n)}catch(s){console.error("Sign in error:",s),pn(Bl(s.code))}}async function R6(t){t.preventDefault(),yr();const e=document.getElementById("signupName").value.trim(),n=document.getElementById("signupEmail").value.trim(),s=document.getElementById("signupPassword").value;if(!e||!n||!s){pn("Please fill in all fields");return}if(s.length<6){pn("Password must be at least 6 characters");return}try{await vT(n,s,e)}catch(r){console.error("Sign up error:",r),pn(Bl(r.code))}}async function M6(){yr();const t=document.getElementById("signinEmail").value.trim();if(!t){pn("Please enter your email address first");return}try{await _T(t),typeof window.showToast=="function"&&window.showToast("Password reset email sent. Check your inbox.","success",5e3)}catch(e){console.error("Reset password error:",e),pn(Bl(e.code))}}async function B6(){yr();try{await TT()}catch(t){console.error("Google sign in error:",t),pn(Bl(t.code))}}function Bl(t){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[t]||"An error occurred. Please try again."}function D6(t){at&&(at.style.display="block",at.innerHTML=`
    <div class="auth-screen">
      <div class="auth-screen-box" style="text-align: center;">
        <div class="auth-screen-header">
          <h1>Verify your email</h1>
          <p>We've sent a verification link to <strong>${t.email}</strong>.<br>
             Click the link in that email, then come back here.</p>
        </div>
        <div id="authScreenError" class="auth-screen-error" style="display: none;"></div>
        <div class="auth-screen-form">
          <button class="auth-screen-btn primary" id="verifiedContinueBtn">I've verified — continue</button>
          <button class="auth-screen-btn secondary" id="resendVerificationBtn">Resend verification email</button>
          <button class="auth-screen-btn secondary" id="verifySignOutBtn">Sign out</button>
        </div>
        <div class="auth-screen-footer">
          <p>Your data stays locked until your email is verified.</p>
        </div>
      </div>
    </div>
  `,document.getElementById("verifiedContinueBtn").addEventListener("click",async()=>{yr();try{const e=await wT();e&&e.emailVerified?Qi&&!Is&&(Is=!0,ty(),Qi(e)):pn("Not verified yet. Click the link in the email first (check spam), then try again.")}catch(e){console.error("Verification check error:",e),pn("Could not check verification status. Please try again.")}}),document.getElementById("resendVerificationBtn").addEventListener("click",async()=>{yr();try{await bT(),typeof window.showToast=="function"&&window.showToast("Verification email sent. Check your inbox.","success",5e3)}catch(e){console.error("Resend verification error:",e),pn(e.code==="auth/too-many-requests"?"Too many attempts. Please wait a few minutes and try again.":"Could not send the email. Please try again.")}}),document.getElementById("verifySignOutBtn").addEventListener("click",async()=>{try{await fu(),Fu()}catch(e){console.error("Sign out error:",e)}}))}function ty(){at&&(at.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function ny(){console.log("hideAuthScreen: hiding auth screen, element=",!!at),at&&(at.style.display="none",console.log("hideAuthScreen: set display to none"))}function L6(){Is=!1,at&&(at.style.display="block",Fu())}function yo(t="signin"){L6(),at.querySelectorAll(".auth-screen-tab").forEach(i=>i.classList.remove("active"));const n=at.querySelector(`.auth-screen-tab[data-tab="${t}"]`);n&&n.classList.add("active");const s=document.getElementById("signinForm"),r=document.getElementById("signupForm");s&&r&&(s.style.display=t==="signin"?"block":"none",r.style.display=t==="signup"?"block":"none")}function N6(){return`
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
  `}let vo=null;function sy(t,e,n,s={}){vo=t,O6(e,n,s)}function O6(t,e,n={}){if(!vo)return;const s=t||"there",r=n.title||`Welcome, ${s}!`,i=n.subtitle||"Your account is set up and ready to go. Here's what Pension Planner can do for you.",o=n.ctaLabel||"Set Up Your First Plan";vo.innerHTML=`
    <div class="onboarding-page">
      <div class="onboarding-content">

        <div class="onboarding-welcome">
          <h1>${r}</h1>
          <p>${i}</p>
          ${n.onSkip?'<button type="button" class="onboarding-skip" id="onboardingSkip">Skip the tour — set up the plan now &#8594;</button>':""}
        </div>

        <!-- How it works: the flow at a glance -->
        <div class="onboarding-flow">
          <div class="onboarding-flow-step">
            <div class="onboarding-flow-icon">&#x1F4C4;</div>
            <div class="onboarding-flow-label">Create a plan</div>
            <div class="onboarding-flow-sub">name + ages,<br>30 seconds</div>
          </div>
          <div class="onboarding-flow-arrow">&#8594;</div>
          <div class="onboarding-flow-step">
            <div class="onboarding-flow-icon">&#x1F9FE;</div>
            <div class="onboarding-flow-label">Budget</div>
            <div class="onboarding-flow-sub">what retirement<br>will cost</div>
          </div>
          <div class="onboarding-flow-arrow">&#8594;</div>
          <div class="onboarding-flow-step">
            <div class="onboarding-flow-icon">&#x1F4CA;</div>
            <div class="onboarding-flow-label">Stress-test</div>
            <div class="onboarding-flow-sub">will the money<br>last?</div>
          </div>
          <div class="onboarding-flow-arrow">&#8594;</div>
          <div class="onboarding-flow-step">
            <div class="onboarding-flow-icon">&#x1F4B7;</div>
            <div class="onboarding-flow-label">Decide monthly</div>
            <div class="onboarding-flow-sub">what to draw,<br>tax-efficiently</div>
          </div>
        </div>

        <!-- Tool: Budget Planner -->
        <div class="onboarding-tool-section">
          <div class="onboarding-tool-header">
            <span class="onboarding-tool-badge">Tool 1</span>
            <h2>Budget Planner</h2>
          </div>
          <p class="onboarding-tool-question">"What will retirement actually cost?"</p>
          <p>Everything starts with what you'll spend. A guided walk-through builds your budget category by category:</p>
          <ul>
            <li>Typical UK figures on tap when you're unsure, and tips on what changes at retirement</li>
            <li>An <strong>essential</strong> floor and a <strong>comfortable</strong> target, in take-home terms</li>
            <li>Big occasional costs — a car every few years, a new roof — averaged in properly</li>
            <li>Couples: mark each cost Me / Partner / Shared, and see each person's share</li>
          </ul>
          <p class="onboarding-tool-who"><strong>Best for:</strong> Everyone — it needs nothing but your ages, and its answer becomes the target the other tools test. Start here.</p>
          <p class="onboarding-tool-need"><strong>What you'll need:</strong> A couple of recent bank statements makes it much more accurate — real numbers beat guesses.</p>
        </div>

        <!-- Tool: Stress Tester -->
        <div class="onboarding-tool-section">
          <div class="onboarding-tool-header">
            <span class="onboarding-tool-badge">Tool 2</span>
            <h2>Stress Tester</h2>
          </div>
          <p class="onboarding-tool-question">"Can I afford to retire?"</p>
          <p>The Stress Tester runs 1,000 Monte Carlo simulations using real historical stock market and bond data going back decades. It shows you:</p>
          <ul>
            <li>The range of possible outcomes for your pension pot</li>
            <li>How likely your money is to last through retirement</li>
            <li>What happens if markets crash early in your retirement</li>
            <li>Whether your spending need is sustainable</li>
          </ul>
          <p class="onboarding-tool-who"><strong>Best for:</strong> Anyone thinking about retirement, whether you're 10 years away or already drawing your pension.</p>
          <p class="onboarding-tool-need"><strong>What you'll need:</strong> Your pension fund values (or your actual funds — you can tag real holdings), what you want to spend (take-home — one tap if you've done the Budget), and your State Pension forecast.</p>
        </div>

        <!-- Tool: Decision Tool -->
        <div class="onboarding-tool-section">
          <div class="onboarding-tool-header">
            <span class="onboarding-tool-badge">Tool 3</span>
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
          <p class="onboarding-tool-who"><strong>Best for:</strong> People already in pension drawdown, or about to start. It's there whenever you're ready.</p>
          <p class="onboarding-tool-need"><strong>What you'll need:</strong> Current fund values, tax year details, and your spending need (take-home).</p>
        </div>

        <!-- Accumulation -->
        <div class="onboarding-tool-section">
          <div class="onboarding-tool-header">
            <h2>Accumulation Planner</h2>
          </div>
          <p class="onboarding-tool-question">"Am I saving enough for retirement?"</p>
          <p>For the years BEFORE retirement: say what you can spare from take-home pay and it works
          out the gross pension purchase under your scheme's tax relief (relief at source, net pay,
          or salary sacrifice — including the NI saving), projects your pot at the FCA's low/middle/high
          growth rates, and checks whether you're on track for <strong>your own budget-derived
          target</strong> — with warnings for the £60,000 Annual Allowance, the £10,000 MPAA (spotted
          automatically from your Decision-tool history), and the minimum-pension-age rise to 57.</p>
          <p class="onboarding-tool-who"><strong>Best for:</strong> Anyone still contributing — including alongside a partner's drawdown plan.</p>
          <p class="onboarding-tool-need"><strong>What you'll need:</strong> Salary, what you can afford monthly, employer contribution, current pot value.</p>
        </div>

        <!-- Plans & the lock -->
        <div class="onboarding-tool-section">
          <div class="onboarding-tool-header">
            <span class="onboarding-tool-badge">Good to know</span>
            <h2>Everything lives in a "plan" &nbsp;&#x1F4C4;&#x1F512;</h2>
          </div>
          <p>A <strong>plan</strong> holds one set of assumptions — your pots, spending target, State Pension — plus everything you record against them. You can keep several (say, "Retire at 60" vs "Retire at 62") and switch or duplicate them from the dropdown at the top.</p>
          <p>Once you commit a plan's Decision settings and start recording monthly entries, the plan <strong>locks &#x1F512;</strong> — its settings freeze so your history stays meaningful. Want to try different assumptions later? Duplicate into a new plan. The Budget and Stress Tester never lock: the budget saves as you type, and Stress is a free sandbox for what-ifs. The &#x1F512;/&#x270F;&#xFE0F; chip next to the plan name always shows where you stand.</p>
        </div>

        <!-- Reassurance -->
        <div class="onboarding-reassurance">
          <p><strong>You don't have to do everything at once.</strong> Setting up a plan takes about 30 seconds — your ages and a name — then you choose where to start. Most people begin with the Budget; the other tools are one tab away whenever you're ready.</p>
        </div>

        <!-- CTA -->
        <div class="onboarding-cta">
          <button class="onboarding-btn primary" id="onboardingStartWizard">${o}</button>
        </div>

      </div>
    </div>
  `,document.getElementById("onboardingStartWizard").addEventListener("click",e),n.onSkip&&document.getElementById("onboardingSkip").addEventListener("click",n.onSkip)}function vi(){vo&&(vo.style.display="none")}function F6(){return`
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

    .onboarding-skip {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 14px;
      cursor: pointer;
      margin-top: 10px;
      text-decoration: underline;
    }

    .onboarding-tool-section {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .onboarding-flow {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px 14px;
      margin-bottom: 28px;
    }

    .onboarding-flow-step {
      text-align: center;
      min-width: 104px;
    }

    .onboarding-flow-icon { font-size: 26px; margin-bottom: 4px; }
    .onboarding-flow-label { font-size: 13px; font-weight: 600; color: var(--text); }
    .onboarding-flow-sub { font-size: 11px; color: var(--text-muted); line-height: 1.35; margin-top: 2px; }
    .onboarding-flow-arrow { font-size: 20px; color: var(--primary); flex-shrink: 0; }

    @media (max-width: 560px) {
      .onboarding-flow { flex-direction: column; gap: 4px; }
      .onboarding-flow-arrow { transform: rotate(90deg); }
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
  `}let ss=null,Ya=null,Jc=null,F={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35},Mt="scenario",Ce=1;function ry(){Mt="scenario",Ce=1,F={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35}}function iy(t,e,n=null){ss=t,Ya=e,Jc=n,ry(),Kt()}function Kt(){ss&&(Mt==="scenario"?V6():Mt==="stress"?$6():Mt==="decision"&&H6())}function V6(){ss.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${Vu(2,Ce)}
        </div>

        ${Ce===1?z6():U6()}
      </div>
    </div>
  `,zu()}function z6(){const t=F.household==="couple";return`
    <div class="wizard-step">
      <div class="wizard-step-title">Let's create your plan</div>
      <div class="wizard-step-desc">
        Just a few basics to start — no money questions yet. You'll add your spending, pots and other
        details in the tools themselves, only when you need them.
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <label style="display:block; font-size:13px; margin-bottom:4px;">Plan name</label>
        <input type="text" id="wizScenarioName" value="${F.scenarioName}" placeholder="e.g. My plan" style="max-width: 320px;">
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display:block; font-size:13px; margin-bottom:6px;">Who's this plan for?</label>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <label class="wizard-tool-option" style="flex:0 0 auto; padding:8px 14px; cursor:pointer;">
            <input type="radio" name="wizHousehold" value="single" ${t?"":"checked"} onchange="document.getElementById('wizPartnerBlock').style.display='none'"> Just me
          </label>
          <label class="wizard-tool-option" style="flex:0 0 auto; padding:8px 14px; cursor:pointer;">
            <input type="radio" name="wizHousehold" value="couple" ${t?"checked":""} onchange="document.getElementById('wizPartnerBlock').style.display='block'"> Me and a partner
          </label>
        </div>
      </div>

      ${Tp("You","wiz",F.currentAge,F.retirementAge,F.retired)}
      <div id="wizPartnerBlock" style="display:${t?"block":"none"};">
        ${Tp("Your partner","wizPartner",F.partnerAge,F.partnerRetirementAge,F.partnerRetired)}
        <p style="font-size:12px; color:var(--text-muted); margin:4px 0 0;">
          You'll plan <strong>your own money</strong> against your share of the joint budget —
          your partner can do the same in a plan of their own.
        </p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="skip-all">Cancel</button>
        <button class="wizard-btn primary" data-action="to-router">Next</button>
      </div>
    </div>
  `}function Tp(t,e,n,s,r){const i=r?"Age you retired":"Target retirement age",o=e+"CurrentAge",a=e+"RetireAge",c=e+"Retired";return`
    <div style="border:1px solid var(--border); border-radius:10px; padding:12px 14px; margin-bottom:12px;">
      <strong style="font-size:14px;">${t}</strong>
      <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end; margin-top:8px;">
        <div class="wizard-input" style="flex:0 0 auto;">
          <label style="display:block; font-size:13px; margin-bottom:4px;">Age today</label>
          <input type="number" id="${o}" value="${n||""}" placeholder="e.g. 52" style="max-width:110px;">
        </div>
        <div class="wizard-input" style="flex:0 0 auto;">
          <label id="${a}Label" style="display:block; font-size:13px; margin-bottom:4px;">${i}</label>
          <input type="number" id="${a}" value="${s||""}" placeholder="e.g. 60" style="max-width:150px;">
        </div>
        <label style="flex:0 0 auto; display:flex; align-items:center; gap:6px; font-size:13px; padding-bottom:8px; cursor:pointer;">
          <input type="checkbox" id="${c}" ${r?"checked":""} style="width:auto;"
            onchange="document.getElementById('${a}Label').textContent = this.checked ? 'Age you retired' : 'Target retirement age'">
          Already retired
        </label>
      </div>
    </div>
  `}function U6(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">Where would you like to start?</div>
      <div class="wizard-step-desc">
        You can do any of these, in any order — this just picks your first stop. Everything else is asked
        for by each tool when it needs it.
      </div>

      <div class="wizard-tool-choices">
        <button type="button" class="wizard-tool-option" data-action="start-budget" style="text-align:left; width:100%; cursor:pointer;">
          <div class="wizard-tool-info">
            <strong>Work out my budget</strong>
            <p>"What will I actually spend?" Build your monthly take-home need from your real expenses. The best place to begin — it drives everything else. <em>(Recommended)</em></p>
          </div>
        </button>

        <button type="button" class="wizard-tool-option" data-action="start-stress" style="text-align:left; width:100%; cursor:pointer;">
          <div class="wizard-tool-info">
            <strong>See if I can afford to retire</strong>
            <p>"Will my money last?" Enter your pots and run simulations against real market history.</p>
          </div>
        </button>

        <button type="button" class="wizard-tool-option" data-action="start-decision" style="text-align:left; width:100%; cursor:pointer;">
          <div class="wizard-tool-info">
            <strong>Decide this month's withdrawal</strong>
            <p>"Where should I take money from this month?" Tax-efficient drawdown advice from your pots.</p>
          </div>
        </button>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
      </div>
    </div>
  `}function $6(){ss.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${Vu(6,Ce)}
        </div>

        ${q6(Ce)}
      </div>
    </div>
  `,zu()}function q6(t){switch(t){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            Think of this as your "salary" in retirement. This is the total amount before tax that you want to receive each year.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBaseSalary" value="${F.baseSalary}">
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
            <input type="number" id="wizOther" value="${F.otherIncome}">
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
                <input type="text" id="wizSpStartDate" value="${F.spStartDate}" placeholder="e.g. 6 May 2040" style="width: 100%;">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Weekly Amount (from HMRC)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizSpWeeklyAmount" value="${F.spWeeklyAmount||""}" step="0.01" placeholder="e.g. 221.20">
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
          <div class="wizard-step-title">Your pot &amp; risk level</div>
          <div class="wizard-step-desc">
            Enter your total pot, then pick a risk level — the buttons set how it's split across shares, bonds and cash.
          </div>

          <div class="wizard-grid">
            <div class="wizard-grid-item">
              <label>Total in your SIPP (£)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizPot" oninput="updateAllocDisplay('wiz')">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Total in your ISA (£)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizIsaBalance" min="0" value="${F.isaBalance}">
              </div>
            </div>
          </div>

          <label style="font-weight:600;font-size:14px;display:block;margin:16px 0 6px;">Risk level</label>
          <div id="wizRisks" style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="risk-btn" data-risk="cautious" onclick="setRiskPreset('wiz','cautious')">Cautious</button>
            <button type="button" class="risk-btn" data-risk="balanced" onclick="setRiskPreset('wiz','balanced')">Balanced</button>
            <button type="button" class="risk-btn" data-risk="adventurous" onclick="setRiskPreset('wiz','adventurous')">Adventurous</button>
          </div>
          <div id="wizAllocAmounts" class="wizard-example" style="margin-top:12px;"></div>

          <label style="display:flex;align-items:flex-start;cursor:pointer;margin-top:12px;">
            <input type="checkbox" id="wizEquityGlide" onchange="updateAllocDisplay('wiz')" style="width:auto;margin-right:10px;margin-top:2px;">
            <span><strong>Bond tent (optional)</strong> — start more cautious and let your shares rise over the early years, then hold. You can change this any time in Settings.</span>
          </label>

          <div class="wizard-example">
            <strong>About your ISA:</strong> we assume the ISA is a steady money-market fund with low, stable growth, drawn tax-free to top up income. We don't model different ISA investment strategies — leave it at £0 if you don't have one.
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
            <input type="number" id="wizDuration" value="${F.duration}" style="max-width: 100px;">
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
              <option value="inflates" ${F.taxMode==="inflates"?"selected":""}>Standard (rise with inflation)</option>
              <option value="frozen" ${F.taxMode==="frozen"?"selected":""}>Frozen (stay at current levels)</option>
            </select>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> "Frozen" is more pessimistic - you pay more tax over time as your income grows but thresholds don't.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="finish-stress">${F.enabledTools.includes("decision")?"Continue to Decision Tool":"Finish Setup"}</button>
          </div>
        </div>
      `;default:return""}}function H6(){ss.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${Vu(4,Ce)}
        </div>

        ${Y6(Ce)}
      </div>
    </div>
  `,zu()}function Y6(t){switch(t){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            This is your target "salary" from your pension. The tool will calculate how much to withdraw each month.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizDBaseSalary" value="${F.decisionSalary}">
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
              <label>Total in your SIPP (£)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDPot" oninput="updateAllocDisplay('wizD')">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Total in your ISA (£)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDIsaBalance" min="0" value="${F.decisionIsaBalance}">
              </div>
            </div>
          </div>

          <label style="font-weight:600;font-size:14px;display:block;margin:16px 0 6px;">Risk level</label>
          <div id="wizDRisks" style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="risk-btn" data-risk="cautious" onclick="setRiskPreset('wizD','cautious')">Cautious</button>
            <button type="button" class="risk-btn" data-risk="balanced" onclick="setRiskPreset('wizD','balanced')">Balanced</button>
            <button type="button" class="risk-btn" data-risk="adventurous" onclick="setRiskPreset('wizD','adventurous')">Adventurous</button>
          </div>
          <div id="wizDAllocAmounts" class="wizard-example" style="margin-top:12px;"></div>

          <label style="display:flex;align-items:flex-start;cursor:pointer;margin-top:12px;">
            <input type="checkbox" id="wizDEquityGlide" onchange="updateAllocDisplay('wizD')" style="width:auto;margin-right:10px;margin-top:2px;">
            <span><strong>Bond tent (optional)</strong> — start more cautious and let your shares rise over the early years, then hold. You can change this any time in Settings.</span>
          </label>

          <div class="wizard-example">
            <strong>About your ISA:</strong> assumed to be a steady money-market fund with low, stable growth, drawn tax-free to keep income tax-efficient. We don't model different ISA strategies — leave at £0 if none.
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
            <input type="number" id="wizDDuration" value="${F.decisionDuration}" style="max-width: 100px;">
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
      `;default:return""}}function Vu(t,e){let n="";for(let s=1;s<=t;s++){const r=s<e?"done":s===e?"active":"";n+=`<div class="wizard-dot ${r}"></div>`}return n}function zu(){if(ss.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>W6(e.dataset.action))}),document.getElementById("wizRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wiz",F.equityMin,F.bondMin,F.cashTarget);const e=document.getElementById("wizEquityGlide");e&&(e.checked=!!F.equityGlideEnabled,window.updateAllocDisplay("wiz"))}if(document.getElementById("wizDRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wizD",F.decisionEquity,F.decisionBond,F.decisionCash);const e=document.getElementById("wizDEquityGlide");e&&(e.checked=!!F.decisionEquityGlideEnabled,window.updateAllocDisplay("wizD"))}}function W6(t){switch(oy(),t){case"skip-all":if(Jc){Jc();break}F.startAt="budget",sr();break;case"to-router":{const e=parseInt(F.currentAge),n=parseInt(F.retirementAge),s=r=>{typeof window.showToast=="function"&&window.showToast(r,"error")};if(!n||n<40||n>95){s(F.retired?"Please enter the age you retired":"Please enter a target retirement age");return}if(e&&n>e&&F.retired){s("You ticked 'already retired' but the age is in the future — untick it, or lower the age.");return}if(e&&n<e&&!F.retired){s("That retirement age is in the past — tick 'already retired' if you've already retired.");return}Ce=2,Kt();break}case"start-budget":case"start-stress":case"start-decision":F.startAt=t.replace("start-",""),sr();break;case"next":{const e=Cl(F.spStartDate);if(!e.valid){typeof window.showToast=="function"&&window.showToast(e.error,"error");return}Mt==="scenario"?Ce<2&&(Ce++,Kt()):Mt==="stress"?Ce<6&&(Ce++,Kt()):Mt==="decision"&&Ce<4&&(Ce++,Kt());break}case"back":(Mt==="scenario"&&Ce>1||Mt==="stress"&&Ce>1||Mt==="decision"&&Ce>1)&&(Ce--,Kt());break;case"start-tools":if(!F.enabledTools||F.enabledTools.length===0){typeof window.showToast=="function"&&window.showToast("Please select at least one tool","error");return}vc("scenario");break;case"skip-stress":vc("stress");break;case"finish-stress":F.decisionSalary=F.baseSalary,F.decisionEquity=F.equityMin,F.decisionBond=F.bondMin,F.decisionCash=F.cashTarget,F.decisionIsaBalance=F.isaBalance,F.decisionDuration=F.duration,F.decisionEquityGlideEnabled=F.equityGlideEnabled,vc("stress");break;case"skip-decision":sr();break;case"finish":sr();break}}function vc(t){const e=F.enabledTools.includes("stress"),n=F.enabledTools.includes("decision");t==="scenario"?e?(Mt="stress",Ce=1,Kt()):n?(Mt="decision",Ce=1,Kt()):sr():t==="stress"&&n?(Mt="decision",Ce=1,Kt()):sr()}function oy(){const t=document.getElementById("wizScenarioName");t&&(F.scenarioName=t.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(F.scenarioDescription=e.value.trim()||"");const n=document.querySelector('input[name="wizHousehold"]:checked');n&&(F.household=n.value);const s=document.getElementById("wizCurrentAge");s&&(F.currentAge=parseInt(s.value)||"");const r=document.getElementById("wizRetireAge");r&&(F.retirementAge=parseInt(r.value)||"");const i=document.getElementById("wizRetired");i&&(F.retired=i.checked);const o=document.getElementById("wizPartnerCurrentAge");o&&(F.partnerAge=parseInt(o.value)||"");const a=document.getElementById("wizPartnerRetireAge");a&&(F.partnerRetirementAge=parseInt(a.value)||"");const c=document.getElementById("wizPartnerRetired");c&&(F.partnerRetired=c.checked);const d=document.getElementById("wizToolStress"),u=document.getElementById("wizToolDecision");if(d!==null||u!==null){const I=[];d&&d.checked&&I.push("stress"),u&&u.checked&&I.push("decision"),F.enabledTools=I}const p=document.getElementById("wizBaseSalary");p&&(F.baseSalary=parseFloat(p.value)||3e4);const f=document.getElementById("wizOther");f&&(F.otherIncome=parseFloat(f.value)||0);const g=document.getElementById("wizSpStartDate");g&&(F.spStartDate=g.value.trim()||"");const v=document.getElementById("wizSpWeeklyAmount");if(v&&(F.spWeeklyAmount=parseFloat(v.value)||0),document.getElementById("wizPot")&&typeof window.readAlloc=="function"){const I=window.readAlloc("wiz");F.equityMin=I.equityMin,F.bondMin=I.bondMin,F.cashTarget=I.cashTarget}const y=document.getElementById("wizEquityGlide");y&&(F.equityGlideEnabled=y.checked);const E=document.getElementById("wizIsaBalance");E&&(F.isaBalance=parseFloat(E.value)||0);const C=document.getElementById("wizDuration");C&&(F.duration=parseInt(C.value)||35);const k=document.getElementById("wizTaxMode");k&&(F.taxMode=k.value);const P=document.getElementById("wizDBaseSalary");if(P&&(F.decisionSalary=parseFloat(P.value)||3e4),document.getElementById("wizDPot")&&typeof window.readAlloc=="function"){const I=window.readAlloc("wizD");F.decisionEquity=I.equityMin,F.decisionBond=I.bondMin,F.decisionCash=I.cashTarget}const R=document.getElementById("wizDEquityGlide");R&&(F.decisionEquityGlideEnabled=R.checked);const B=document.getElementById("wizDIsaBalance");B&&(F.decisionIsaBalance=parseFloat(B.value)||0);const D=document.getElementById("wizDDuration");D&&(F.decisionDuration=parseInt(D.value)||35)}function sr(){oy(),Ya&&Ya(F)}function bi(){ss&&(ss.style.display="none")}function G6(t,e,n,s){if(ss=t,Ya=n,ry(),F.enabledTools=e,s&&(e.includes("stress")&&s.source==="decision"&&(F.baseSalary=s.baseSalary||3e4,F.equityMin=s.equityMin||25e4,F.bondMin=s.bondMin||2e5,F.cashTarget=s.cashTarget||5e4,F.isaBalance=s.isaBalance||0,F.duration=s.duration||35,F.spStartDate=s.spStartDate||"",F.spWeeklyAmount=s.spWeeklyAmount||0),e.includes("decision")&&s.source==="stress"&&(F.decisionSalary=s.baseSalary||3e4,F.decisionEquity=s.equityMin||25e4,F.decisionBond=s.bondMin||2e5,F.decisionCash=s.cashTarget||5e4,F.decisionIsaBalance=s.isaBalance||0,F.decisionDuration=s.duration||35)),e.includes("stress"))Mt="stress";else if(e.includes("decision"))Mt="decision";else{n&&n(F);return}Ce=1,Kt()}function j6(){return`
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
  `}function K6(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}function Q6(t,e,n={}){const s=K6(),r=t.getContext("2d"),{width:i,height:o}=t,a={top:50,right:180,bottom:60,left:80},c=i-a.left-a.right,d=o-a.top-a.bottom;r.fillStyle=s.bg,r.fillRect(0,0,i,o);const u=Object.keys(e),p=n.years||35;let f=0;u.forEach(E=>{const C=e[E].result;C&&C.hist&&C.hist.forEach(k=>{k.total>f&&(f=k.total)})}),f*=1.1;const g=E=>a.left+E/p*c,v=E=>a.top+d-E/f*d;J6(r,a,c,d,p,f,n.title||"Scenario Comparison",s);const y=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];u.forEach((E,C)=>{const k=e[E].result;if(!k||!k.hist)return;r.beginPath(),r.strokeStyle=y[C%y.length],r.lineWidth=2.5,k.hist.forEach((R,B)=>{const D=g(R.year),I=v(R.total);B===0?r.moveTo(D,I):r.lineTo(D,I)}),r.stroke();const P=a.top+15+C*24;r.fillStyle=y[C%y.length],r.fillRect(i-a.right+15,P,20,4),r.font="11px system-ui, sans-serif",r.fillStyle=s.text,r.textAlign="left",r.fillText(e[E].name||E,i-a.right+40,P+5),k.final/1e3,r.fillStyle=s.muted,r.fillText(`${ay(k.final)}`,i-a.right+40,P+18)})}function J6(t,e,n,s,r,i,o,a){t.font="bold 14px system-ui, sans-serif",t.fillStyle=a.text,t.textAlign="center",t.fillText(o,e.left+n/2,e.top-20),t.strokeStyle=a.grid,t.lineWidth=1;for(let c=0;c<=5;c++){const d=e.top+s*c/5;t.beginPath(),t.moveTo(e.left,d),t.lineTo(e.left+n,d),t.stroke();const u=i*(5-c)/5;t.font="11px system-ui, sans-serif",t.fillStyle=a.muted,t.textAlign="right",t.fillText(ay(u),e.left-10,d+4)}for(let c=0;c<=r;c+=5){const d=e.left+c/r*n;t.beginPath(),t.moveTo(d,e.top),t.lineTo(d,e.top+s),t.stroke(),t.textAlign="center",t.fillText(`Y${c}`,d,e.top+s+20)}t.font="12px system-ui, sans-serif",t.textAlign="center",t.fillText("Years",e.left+n/2,e.top+s+45),t.save(),t.translate(20,e.top+s/2),t.rotate(-Math.PI/2),t.fillText("Fund Value",0,0),t.restore()}function ay(t){return t>=1e6?`£${(t/1e6).toFixed(1)}M`:t>=1e3?`£${(t/1e3).toFixed(0)}k`:`£${t.toFixed(0)}`}function X6(){return`
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
  `}const{runMonteCarlo:Z6,runHistorical:eS,simulate:Xc,monteCarloReturns:ly}=ls("pots-and-valves").engine;window._simEngine={runMonteCarlo:Z6,runHistorical:eS,simulate:Xc,monteCarloReturns:ly};window._constants={EQUITY_RETURNS:ar,INFLATION:Ka};window._mathUtils={seededRng:fd};let cy=null,dy=null;function uy(){cy=null,dy=null;const t=document.getElementById("mcResults"),e=document.getElementById("histResults");t&&(t.innerHTML=""),e&&(e.innerHTML="");const n=document.getElementById("optimiseResultsMC"),s=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),s&&(s.innerHTML="")}function hy(){document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-stresstab="montecarlo"]');t&&t.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("stress-montecarlo");e&&e.classList.remove("hidden")}function fy(){document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-decisiontab="entry"]');t&&t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("decision-entry");e&&e.classList.remove("hidden")}const py=document.createElement("style");py.textContent=WI()+A6()+N6()+F6()+j6()+c6()+X6();document.head.appendChild(py);const Uu=document.getElementById("globalLoadingOverlay"),tS=Uu.querySelector(".loading-text");function ct(t="Loading..."){tS.textContent=t,Uu.classList.add("active")}function dt(){Uu.classList.remove("active")}window.showToast=function(e,n="info",s=3e3){const r=document.querySelector(".toast-notification");r&&r.remove();const i=document.createElement("div");i.className=`toast-notification ${n}`,i.innerHTML=`
        <span class="toast-icon">${n==="success"?"✓":n==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${e}</span>
      `,document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("show")),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},s)};document.getElementById("versionDisplay").textContent=`v${Cp}`;document.getElementById("entryMonth").value=wI();function Zc(t){const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");if(!e||!n)return;const s=parseFloat(e.value)||0;n.value=s>0?Math.round(s*52):"",n._updateOverlay&&n._updateOverlay()}["ds","ss"].forEach(t=>{const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");e&&n&&(e.addEventListener("input",()=>{const s=parseFloat(e.value)||0;n.value=s>0?Math.round(s*52):"",n._updateOverlay&&n._updateOverlay()}),n.addEventListener("input",()=>{const s=parseFloat(n.value)||0;e.value=s>0?+(s/52).toFixed(2):"",e._updateOverlay&&e._updateOverlay()}))});function $u(t){const e=parseFloat(t);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function my(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(n){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(n){!n.shiftKey&&!n.ctrlKey&&!n.metaKey&&this.select()})})}function gy(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted||e.closest("#budget-content")||e.closest("#budWizardOverlay")||e.closest("#adminPanelOverlay"))return;e.dataset.formatted="true";let n=e.closest(".input-with-unit");const s=!!n;n||(n=document.createElement("span"),n.className="num-format-wrap",n.style.cssText="position:relative; display:block;",e.parentNode.insertBefore(n,e),n.appendChild(e));const r=document.createElement("span");r.className="number-format-overlay";const i=s?"34px":"14px";r.style.cssText=`
          position: absolute;
          left: ${i};
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--text);   /* NOT inherit: inside a muted .hint label the overlay went grey */
          font-size: inherit;
          font-family: inherit;
          background: transparent;
          z-index: 1;
        `,getComputedStyle(n).position==="static"&&(n.style.position="relative");function o(){const a=parseFloat(e.value);!isNaN(a)&&a>=1e3&&document.activeElement!==e?(r.textContent=$u(a),r.style.display="block",e.style.color="transparent"):(r.style.display="none",e.style.color="")}e._updateOverlay=o,e.addEventListener("focus",()=>{r.style.display="none",e.style.color=""}),e.addEventListener("blur",o),e.addEventListener("input",()=>{document.activeElement===e&&(r.style.display="none",e.style.color="")}),n.appendChild(r),o()})}function Dl(){document.querySelectorAll('input[type="number"]').forEach(t=>{t._updateOverlay&&t._updateOverlay()})}setTimeout(()=>{my(),gy()},100);const nS=new MutationObserver(t=>{let e=!1;t.forEach(n=>{n.addedNodes.forEach(s=>{var r,i;s.nodeType===1&&((r=s.matches)!=null&&r.call(s,'input[type="number"]')||(i=s.querySelector)!=null&&i.call(s,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{my(),gy()},50)});nS.observe(document.body,{childList:!0,subtree:!0});let Vr=null;async function qu(t,e=null){go(),ny(),vi(),bi(),document.getElementById("mainApp").classList.remove("hidden"),g6().then(()=>{vr("ss",!0),vr("ds",!0);const o=document.getElementById("adminGearBtn");o&&(o.style.display=f6()?"inline-block":"none")}),document.getElementById("userEmail").textContent=t.email,await Wr();const n=await V0();Hu(n),await Sn(),await wr(),td(),hy(),fy(),uy();const s=e||(n.includes("decision")?"decision":"stress");updateNextStepBanner(),document.querySelectorAll(".tab").forEach(o=>o.classList.remove("active"));const r=document.querySelector(`.tab[data-tab="${s}"]`);r&&r.classList.add("active"),document.querySelectorAll(".tab-content").forEach(o=>o.classList.remove("active"));const i=document.getElementById(`${s}-content`);i&&i.classList.add("active")}function Hu(t){const e={decision:["decision"],stress:["stress"]};document.querySelectorAll(".tab").forEach(s=>{const r=s.dataset.tab;let i=!1;for(const[o,a]of Object.entries(e))if(a.includes(r)){i=t.includes(o);break}Object.values(e).flat().includes(r)||(i=!0),s.style.display=i?"":"none"})}window.openToolSettingsTab=function(t){const e=t==="decision"?'.sub-tab[data-decisiontab="decisionsettings"]':'.sub-tab[data-stresstab="stresssettings"]',n=document.querySelector(e);n&&n.click()};async function ed(t){try{const e=s=>!!s.baseSalary&&+s.baseSalary!=3e4;if(t==="decision"){const s=await Ze();return!!s.configured||e(s)||await Ti()}const n=await De();return!!n.configured||e(n)}catch{return!0}}async function Ll(){const t=document.getElementById("dsSetupBanner"),e=document.getElementById("ssSetupBanner");t&&(t.style.display=await ed("decision")?"none":"block"),e&&(e.style.display=await ed("stress")?"none":"block")}async function td(){try{const t=await De(),e=await Ze();Ll(),document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",document.getElementById("dsDuration").value=e.duration||35,writeAlloc("ds",e.equityMin??25e4,e.bondMin??2e5,e.cashTarget??5e4,e.diversifierStart||0),restoreCustomAllocFromSettings("ds",e),window._taggedFunds.ds=(e.taggedFunds||[]).map(s=>({...s})),setAllocMode("ds",e.allocMode||(e.taggedFunds&&e.taggedFunds.length?"funds":"risk")),updateEntryTagPrompt(),document.getElementById("dsEquityGlide").checked=e.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsIsaBalance").value=e.isaBalance||0,document.getElementById("dsAccessMethod").value=e.accessMethod||"drawdown",document.getElementById("dsUfplsYears").value=e.ufplsYears||"",document.getElementById("dsUfplsPcls").checked=!!e.ufplsThenPcls,document.getElementById("dsBandFillRecycle").checked=!!e.bandFillRecycle,syncAccessButtons("ds"),document.getElementById("dsSpendingProfile").value=e.spendingProfile||"flat",updateScheduleSpendNotes(),document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",Zc("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||15e3,document.getElementById("dsDisableProtection").checked=e.disableProtection||!1,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,Wu(t),document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(s=>({...s})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssDbAmount").value=t.dbAmount||0,document.getElementById("ssDbStartYear").value=t.dbStartYear||0,document.getElementById("ssDbIndexation").value=t.dbIndexation||"lpi5",applyStrategyToUI(t.strategyId||"pots-and-valves",t.strategyParams||{}),window._ssIncomeSteps=Array.isArray(t.incomeSteps)?JSON.parse(JSON.stringify(t.incomeSteps)):[],t.shapeAgeNow&&(document.getElementById("shapeAgeNow").value=t.shapeAgeNow),setIncomeShape(t.incomeShape==="phases"?"phases":"level"),window._ssExtraIncomes=Array.isArray(t.extraIncomes)?JSON.parse(JSON.stringify(t.extraIncomes)):[],updateScheduleSpendNotes(),window._ssWindfalls=Array.isArray(t.windfalls)?JSON.parse(JSON.stringify(t.windfalls)):[],renderExtraIncomes(),document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",Zc("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0,document.getElementById("ssAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("ssUfplsYears").value=t.ufplsYears||"",document.getElementById("ssUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("ssBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ss");const n=document.getElementById("ssSeedNote");n&&(n.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),Dl(),console.log("All inputs initialized from stored settings")}catch(t){console.error("Error initializing inputs from settings:",t)}}async function yy(t){console.log("Wizard completed with data:",t);const e=parseInt(t.retirementAge)||60,n=parseInt(t.currentAge)||e,s=95,r=Math.max(5,s-Math.max(n,e));try{const c={duration:r},d={duration:r};await B0(t.scenarioName||"My plan","",["stress","decision"],{stressSettings:c,decisionSettings:d},!0),Os(),ts();try{const u=await zo();u.currentAge=parseInt(t.currentAge)||u.currentAge,u.retirementAge=e,u.endAge=s,u.retired=!!t.retired,u.sharedWithPartner=t.household==="couple",t.household==="couple"&&(u.partnerAge=parseInt(t.partnerAge)||null,u.partnerRetirementAge=parseInt(t.partnerRetirementAge)||null,u.partnerRetired=!!t.partnerRetired),await Nu(u)}catch(u){console.warn("Could not seed budget from wizard:",u)}}catch(c){console.error("Error creating scenario from wizard:",c)}const i=An(),o=t.startAt||"budget";o==="budget"&&(window._budWizAutoOpen=!0),await qu(i);const a=document.querySelector('.tab[data-tab="'+o+'"]');a&&a.click(),(o==="decision"||o==="stress")&&!await ed(o)&&(openToolSettingsTab(o),showToast("First, set up this plan: your pot, spending need and State Pension.","info",6e3))}async function vy(){if(bi(),await s0()){document.getElementById("mainApp").classList.remove("hidden");const e=document.getElementById("scenarioDropdown");e&&e.classList.add("open"),showToast("Plan creation cancelled — you’re back on your current plan.","info",3500)}else Wa(An())}function Wa(t){go(),ny();const e=t.displayName||t.email.split("@")[0];document.getElementById("onboardingPage").style.display="block",sy(document.getElementById("onboardingPage"),e,()=>{vi(),document.getElementById("setupWizard").style.display="block",iy(document.getElementById("setupWizard"),yy,vy)})}k6(document.getElementById("authScreen"),async t=>{console.log("Auth success callback triggered for:",t.email);try{console.log("Checking for existing cloud data...");const e=await s0();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),go(),qu(t)):(console.log("New user - showing onboarding page"),Wa(t))}catch(e){console.error("Error in auth callback:",e),Wa(t)}});S6(document.getElementById("landingPage"),{onGetStarted:()=>{go(),yo("signup")},onSignIn:()=>{go(),yo("signin")}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{Os(),ts(),kn(),await fu(),document.getElementById("mainApp").classList.add("hidden"),vi(),bi(),yo("signin")}catch(t){console.error("Logout error:",t)}});async function nd(){const t=document.getElementById("planLockChip");if(!t)return;const e=await Ti();t.style.display="inline-block",t.textContent=e?"🔒 locked":"✏️ draft",t.title=e?"This plan’s settings are committed so your recorded entries stay consistent. Click for details.":"This plan’s settings are still editable. Saving the Decision settings commits (locks) the plan. Click for details.",t.style.cursor="pointer",t.onclick=n=>{n.stopPropagation(),explainPlanLock(e)}}window.explainPlanLock=function(t){let e=document.getElementById("planLockExplainer");e&&e.remove(),e=document.createElement("div"),e.id="planLockExplainer",e.style.cssText="position:fixed; inset:0; z-index:1300; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; padding:20px;",e.innerHTML=`<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; max-width:560px; width:100%; padding:26px; font-size:15px; line-height:1.6;"><h2 style="margin-bottom:12px;">Plans — and why they lock 🔒</h2><p style="margin-bottom:10px; color:var(--text-muted);">A <strong style="color:var(--text);">plan</strong> is a named scenario: its settings (pots, spending target, State Pension, rules) plus everything you record against them — monthly decisions and tax years. You can keep several plans and switch or duplicate them from this dropdown.</p><p style="margin-bottom:10px; color:var(--text-muted);">When you save a plan’s Decision settings, the plan <strong style="color:var(--text);">locks</strong>: the settings freeze so your recorded history stays meaningful — a decision saved under one set of rules shouldn’t be silently re-judged under another.</p><ul style="margin:0 0 12px 18px; color:var(--text-muted);"><li><strong style="color:var(--text);">✏️ draft</strong> — settings still editable; nothing committed yet.</li><li><strong style="color:var(--text);">🔒 locked, nothing recorded</strong> — you can unlock and edit freely.</li><li><strong style="color:var(--text);">🔒 locked with history</strong> — settings can’t change; duplicate into a new plan instead.</li></ul><p style="margin-bottom:16px; color:var(--text-muted);">The Budget and the Stress Tester are never locked — the budget autosaves like a document, and Stress is a sandbox for what-ifs.</p><div style="display:flex; gap:10px; flex-wrap:wrap;"><button type="button" onclick="document.getElementById('planLockExplainer').remove()">Got it</button>`+(t?`<button type="button" class="risk-btn" onclick="document.getElementById('planLockExplainer').remove(); document.querySelector('.tab[data-tab=&quot;decision&quot;]').click(); openToolSettingsTab('decision');">View the locked settings</button>`:"")+"</div></div>",e.addEventListener("click",n=>{n.target===e&&e.remove()}),document.body.appendChild(e)};async function Wr(){var r;const t=await _r(),e=t.find(i=>i.isActive),n=document.getElementById("scenarioActiveName");n&&(n.textContent=e&&(((r=e.planDetails)==null?void 0:r.name)||e.name)||"No Plan"),await nd();const s=document.getElementById("scenarioList");if(s){if(t.length===0){s.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}s.innerHTML=t.map(i=>{var c,d;const o=((c=i.planDetails)==null?void 0:c.name)||i.name||"Unnamed Plan",a=((d=i.planDetails)==null?void 0:d.description)||i.description||"";return`
        <div class="scenario-dropdown-item ${i.isActive?"active":""}" data-scenario-id="${i.id}">
          <div>
            <div class="scenario-item-name">${o}</div>
            ${a?`<div class="scenario-item-desc">${a}</div>`:""}
          </div>
          <div class="scenario-item-actions">
            ${i.isActive?`<button class="scenario-tools-btn" data-id="${i.id}" data-tools="${(i.enabledTools||["stress","decision"]).join(",")}" title="Edit Tools">&#9881;</button>`:""}
            <button class="scenario-rename-btn" data-id="${i.id}" data-name="${o}" title="Rename">&#9998;</button>
            ${t.length>1?`<button class="scenario-delete-btn" data-id="${i.id}" data-name="${o}" title="Delete">&times;</button>`:""}
          </div>
        </div>
      `}).join(""),s.querySelectorAll(".scenario-dropdown-item").forEach(i=>{i.addEventListener("click",async o=>{if(o.target.closest(".scenario-item-actions"))return;const a=i.dataset.scenarioId;if(!a)return;const c=t.find(d=>d.isActive);if(c&&c.id===a){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await D0(a),Os(),ts(),document.getElementById("scenarioDropdown").classList.remove("open"),uy(),hy(),fy();const d=await V0();Hu(d);const u=document.querySelector(".tab.active");if(u&&u.style.display==="none"){const p=document.querySelector('.tab:not([style*="display: none"])');if(p){document.querySelectorAll(".tab").forEach(v=>v.classList.remove("active")),p.classList.add("active"),document.querySelectorAll(".tab-content").forEach(v=>v.classList.remove("active"));const f=p.dataset.tab+"-content",g=document.getElementById(f);g&&g.classList.add("active")}}await Sn(),await wr(),await td(),await Wr()}catch(d){console.error("Error switching scenario:",d),showToast("Failed to switch plan: "+d.message,"error")}})}),s.querySelectorAll(".scenario-rename-btn").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const a=i.dataset.id,c=i.dataset.name,d=prompt("Rename plan:",c);if(d&&d.trim()&&d.trim()!==c)try{await z_(a,d.trim()),await Wr()}catch(u){console.error("Error renaming scenario:",u),showToast("Failed to rename plan: "+u.message,"error")}})}),s.querySelectorAll(".scenario-tools-btn").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const a=i.dataset.id,c=(i.dataset.tools||"stress,decision").split(",");document.getElementById("scenarioDropdown").classList.remove("open"),sS(a,c)})}),s.querySelectorAll(".scenario-delete-btn").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const a=i.dataset.id,c=i.dataset.name;if(await appConfirm(`Delete plan "${c}"? This cannot be undone.`))try{await $_(a),Os(),ts(),await Sn(),await wr(),await td(),await Wr()}catch(d){console.error("Error deleting scenario:",d),showToast("Failed to delete plan: "+d.message,"error")}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",t=>{t.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",t=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(t.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden");const t=()=>{vi(),document.getElementById("setupWizard").style.display="block",iy(document.getElementById("setupWizard"),yy,vy)},e=An(),n=e&&(e.displayName||(e.email||"").split("@")[0])||"there",s=document.getElementById("onboardingPage");s.style.display="block",sy(s,n,t,{title:"A new plan — here’s the flow",subtitle:"A quick refresher on how the pieces fit together before you set it up.",ctaLabel:"Set up the new plan",onSkip:t})});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{var s;document.getElementById("scenarioDropdown").classList.remove("open");const t=await Ne();if(!t){showToast("No active plan to duplicate.","error");return}const e=((s=t.planDetails)==null?void 0:s.name)||t.name||"My Plan",n=prompt("Name for the copy:",e+" (copy)");if(!(!n||!n.trim()))try{await L0(t.id,n.trim()),await Wr()}catch(r){console.error("Error duplicating scenario:",r),showToast("Failed to duplicate plan: "+r.message,"error")}});function sS(t,e){const n=document.getElementById("editToolsModal");n&&n.remove();const s=e.includes("stress"),r=e.includes("decision"),i=document.createElement("div");i.id="editToolsModal",i.className="edit-tools-overlay",i.innerHTML=`
        <div class="edit-tools-box">
          <div class="edit-tools-title">Edit Enabled Tools</div>
          <div class="edit-tools-desc">Choose which tools this plan should include. You can change this any time.</div>

          <div class="wizard-tool-choices">
            <label class="wizard-tool-option">
              <input type="checkbox" id="editToolStress" ${s?"checked":""}>
              <div class="wizard-tool-info">
                <strong>Stress Tester</strong>
                <p>Run simulations to test if your pension can sustain your desired income.</p>
              </div>
            </label>
            <label class="wizard-tool-option">
              <input type="checkbox" id="editToolDecision" ${r?"checked":""}>
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
      `,document.body.appendChild(i),document.getElementById("editToolsCancel").addEventListener("click",()=>i.remove()),i.addEventListener("click",o=>{o.target===i&&i.remove()}),document.getElementById("editToolsSave").addEventListener("click",async()=>{const o=[];if(document.getElementById("editToolStress").checked&&o.push("stress"),document.getElementById("editToolDecision").checked&&o.push("decision"),o.length===0){showToast("Please select at least one tool","error");return}const a=o.filter(c=>!e.includes(c));try{await U_(t,o);const c=await Ne();if(c&&c.id===t){Hu(o);const d=document.querySelector(".tab.active");if(d&&d.style.display==="none"){const u=document.querySelector('.tab:not([style*="display: none"])');if(u){document.querySelectorAll(".tab").forEach(g=>g.classList.remove("active")),u.classList.add("active"),document.querySelectorAll(".tab-content").forEach(g=>g.classList.remove("active"));const p=u.dataset.tab+"-content",f=document.getElementById(p);f&&f.classList.add("active")}}}if(await Wr(),i.remove(),a.length>0){let d=null;try{if(a.includes("stress")&&e.includes("decision")){const f=await Ze();f&&(d={source:"decision",...f})}else if(a.includes("decision")&&e.includes("stress")){const f=await De();f&&(d={source:"stress",...f})}}catch(f){console.warn("Could not load existing settings for pre-fill:",f)}const u=document.getElementById("setupWizard");u.style.display="block",document.getElementById("mainApp").style.display="none",G6(u,a,async f=>{bi();try{a.includes("stress")&&(await yi({equityMin:f.equityMin,bondMin:f.bondMin,cashTarget:f.cashTarget,isaBalance:f.isaBalance||0,duration:f.duration,baseSalary:f.baseSalary,other:f.otherIncome||0,taxMode:f.taxMode||"inflates",equityGlideEnabled:f.equityGlideEnabled||!1}),ts()),a.includes("decision")&&(await mr({equityMin:f.decisionEquity,bondMin:f.decisionBond,cashTarget:f.decisionCash,isaBalance:f.decisionIsaBalance||0,duration:f.decisionDuration,baseSalary:f.decisionSalary,spStartDate:f.spStartDate||null,spWeeklyAmount:f.spWeeklyAmount||0,equityGlideEnabled:f.decisionEquityGlideEnabled||!1}),Os())}catch(g){console.error("Error saving new tool settings:",g)}await qu(),showToast("New tool configured successfully","success")},d)}else showToast("Tools updated","success")}catch(c){console.error("Error updating scenario tools:",c),showToast("Failed to update tools: "+c.message,"error")}})}const sd=60*60*1e3,by="pt_lastActivity";let Sa=null,_p=0;function wy(){const t=Date.now();if(t-_p>1e4){_p=t;try{localStorage.setItem(by,String(t))}catch{}}}function rS(){try{return+localStorage.getItem(by)||0}catch{return 0}}async function Ey(){if(!ut())return;const t=Date.now()-rS();if(t<sd){Sa=setTimeout(Ey,Math.max(6e4,sd-t));return}showToast("You have been logged out due to inactivity (1 hour).","info",5e3);try{Os(),ts(),kn(),await fu(),document.getElementById("mainApp").classList.add("hidden"),vi(),bi(),yo("signin")}catch(e){console.error("Auto-logout error:",e)}}function Ty(){Sa&&clearTimeout(Sa),ut()&&(Sa=setTimeout(Ey,sd))}const iS=["mousedown","mousemove","keydown","scroll","touchstart","click"];iS.forEach(t=>{document.addEventListener(t,()=>{wy(),Ty()},{passive:!0})});wy();Ty();Xg(t=>{const e=!document.getElementById("mainApp").classList.contains("hidden");!t&&e&&(document.getElementById("mainApp").classList.add("hidden"),vi(),bi(),yo("signin"),showToast("You’ve been signed out — sign in again to continue. Unsaved changes in open forms were not stored.","warning",8e3))});document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!await appConfirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!await appConfirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await n0(),console.log("Data wiped successfully"),Os(),ts(),kn(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden");const n=An();Wa(n),showToast("All data has been deleted. Set up a new plan to start fresh.","success",4e3)}catch(n){console.error("Reset error:",n),showToast("Error resetting data: "+n.message,"error")}});document.getElementById("deleteAccountBtn").addEventListener("click",async()=>{if(!(!await appConfirm(`⚠️ DELETE YOUR ACCOUNT?

This permanently deletes your login AND all saved data:

• All plans and settings
• All portfolio/decision history
• Your household budget

This cannot be undone.`)||!await appConfirm(`FINAL WARNING

Your account and every piece of data will be gone forever.

Delete everything?`)))try{await n0(),Os(),ts(),kn(),localStorage.clear(),await IT(),showToast("Your account and all data have been deleted.","success",4e3),setTimeout(()=>window.location.reload(),1500)}catch(n){console.error("Delete account error:",n),n.code==="auth/requires-recent-login"?showToast("For security, please sign out, sign back in, and press Delete Account again.","error",8e3):showToast("Error deleting account: "+n.message,"error")}});document.querySelectorAll(".tab").forEach(t=>{t.addEventListener("click",async()=>{if(t.dataset.tab!=="stress"){aS();const e=document.getElementById("optimiseResultsMC"),n=document.getElementById("optimiseResultsHist");e&&(e.innerHTML=""),n&&(n.innerHTML="")}document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${t.dataset.tab}-content`).classList.add("active"),t.dataset.tab==="stress"&&(await Ol(),updateStrategyNote()),t.dataset.tab==="budget"&&await PS(),t.dataset.tab==="decision"&&renderDecisionStrategyPanel(),t.dataset.tab==="accumulation"&&await loadAccumulationUI(),t.dataset.tab==="household"&&await loadHouseholdUI(),updateNextStepBanner(),Ll(),window.__hideHelpTip&&window.__hideHelpTip()})});const Bi=document.querySelector(".tabs"),Ip=document.querySelector(".tabs-wrapper");if(Bi&&Ip){const t=()=>{const e=Bi.scrollLeft+Bi.clientWidth>=Bi.scrollWidth-10;Ip.classList.toggle("scrolled-end",e)};Bi.addEventListener("scroll",t),t()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>{t.addEventListener("click",async()=>{if(document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),window.__hideHelpTip&&window.__hideHelpTip(),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${t.dataset.stresstab}`).classList.remove("hidden"),t.dataset.stresstab==="strategies"){loadStrategiesUI(),localStorage.setItem("strategiesSeen","1");const e=document.getElementById("strategiesNewDot");e&&(e.style.display="none")}t.dataset.stresstab==="montecarlo"&&updateStrategyNote(),t.dataset.stresstab==="stresssettings"&&await Ol()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>{t.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${t.dataset.decisiontab}`).classList.remove("hidden"),t.dataset.decisiontab==="decisionsettings"&&await Fl(),t.dataset.decisiontab==="history"&&await Sn(),t.dataset.decisiontab==="taxyears"&&await wr()})});async function Sp(t,e,n,s){var o,a;const r=await Ze(),i=r.equityGlideEnabled?{...r,equityGlide:yu(r)}:r;return I6(t,e,n,s,{settings:i,history:await qs(),allTaxYears:await cs(),spInfo:await Ru(ey(t)),isaBalance:parseFloat((o=document.getElementById("entryIsa"))==null?void 0:o.value)||0,diversifier:parseFloat((a=document.getElementById("entryDiversifier"))==null?void 0:a.value)||0})}async function Yu(t,e,n){if(t<1e4&&e<1e4&&n<1e4&&t+e+n>0){const r=i=>"£"+Math.round(i||0).toLocaleString();return await appConfirm(`These fund values look low — Equity ${r(t)}, Bond ${r(e)}, Cash ${r(n)}.

Enter absolute amounts in pounds, to the single pound (e.g. 250000, not 250).

Continue anyway?`)}return!0}window.handleDecisionSubmit=async function(t){t.preventDefault();const e=document.getElementById("entryMonth").value,n=parseFloat(document.getElementById("entryEquity").value)||0,s=parseFloat(document.getElementById("entryBond").value)||0,r=parseFloat(document.getElementById("entryCash").value)||0,i=[];if(e||i.push("Month"),!n&&n!==0&&i.push("Equity Fund"),!s&&s!==0&&i.push("Bond Balance"),!r&&r!==0&&i.push("Cash Balance"),i.length>0){showToast("Missing: "+i.join(", "),"error",4e3);return}if(!await Yu(n,s,r))return;if((await qs({limit:1e3})).find(c=>c.date===e)){showToast(`${ai(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await e6(e)).showWizard){const u=document.getElementById("taxYearWizard");u.style.display="block",window._pendingDecisionForm={dateStr:e,equity:n,bond:s,cash:r},ZI(u,e,async p=>{if(u.style.display="none",p&&p.completed)try{Vr=await Sp(e,n,s,r);const f=document.getElementById("decisionOutput");pp(Vr,f),document.getElementById("saveBtn").disabled=!1}catch(f){console.error("Decision error after wizard:",f),showToast("Error: "+f.message,"error")}});return}Vr=await Sp(e,n,s,r);const d=document.getElementById("decisionOutput");pp(Vr,d),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),showToast("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const t=document.getElementById("saveBtn");if(!Vr){showToast("No decision to save","error");return}if(!ut()){showToast("Please sign in to save decisions","error");return}t.classList.add("loading"),t.disabled=!0;try{await aI(Vr),showToast("Decision saved to history","success"),await Sn()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error"),t.disabled=!1}finally{t.classList.remove("loading")}};function Wu(t){const e=r=>"£"+Math.round(r||0).toLocaleString(),n=(t.diversifierStart||0)>0?` · Diversifiers ${e(t.diversifierStart)}`:"",s=`Starting balances come from your <strong>Settings</strong> (Fund Minimums): Equity ${e(t.equityMin)} · Bond ${e(t.bondMin)}${n} · Cash ${e(t.cashTarget)}. Edit them in the Settings tab.`;["mcStartSummary","histStartSummary","scenStartSummary"].forEach(r=>{const i=document.getElementById(r);i&&(i.innerHTML=s)}),["mcYears","histYears"].forEach(r=>{const i=document.getElementById(r);i&&(i.value=t.duration)})}async function oS(t){document.getElementById("mcResults")||document.querySelector("#stress-montecarlo .card:last-child"),document.createElement("div");const e=t.strategyParams||{},n={e:t.equityMin||0,b:t.bondMin||0,c:t.cashTarget||0,d:t.diversifierStart||0},s=t.strategyParams||{},r=(s.sippTotal||0)+(s.isaTotal||0)||n.e+n.b+n.c+n.d+(t.isaBalance||0),i=(t.spWeeklyAmount?t.spWeeklyAmount*52:t.statePension)||0,o=Math.min(t.duration||35,35);let a="";if(t.strategyId==="ladder-and-ratchet"){const d=e.ladderYears||15,u=e.drawAnnual||t.baseSalary||0,p=t.shapeAgeNow||57,f=E=>{if(t.incomeShape!=="phases"||!Array.isArray(t.incomeSteps)||!t.incomeSteps.length)return u;const C=p+E-1,k=t.incomeSteps.filter(P=>+P.fromAge<=C).sort((P,R)=>+P.fromAge-+R.fromAge).pop();return k?+k.amount:u},g=E=>Math.max(0,f(E)-(E>10?i:0));let v=0;for(let E=1;E<=d;E++)v+=g(E)*Math.pow(1.023,-E);const y=r-v;if(y<=0)a='<div class="alert alert-danger">Ladder not affordable: base ladder costs '+O(Math.round(v))+" of your "+O(Math.round(r))+". Reduce the bolted income or the ladder years in Settings.</div>";else{const E=e.triggerMode==="calendar"?{mode:"calendar",reviews:Array.from({length:Math.floor(d/5)},(R,B)=>(B+1)*60)}:{mode:"band",b:e.bandThreshold||1.2},C=t.incomeShape==="phases"&&Array.isArray(t.incomeSteps)&&t.incomeSteps.length?t.incomeSteps.map(R=>({fromYear:Math.max(0,(+R.fromAge||p)-p),amount:+R.amount})):[{fromYear:0,amount:u}],k=Il({E0:y,ladderYears:d,L:d*12,firstRung:d+1,maxRung:o,draw:u,profile:{type:"phases",phases:C},trigger:E,END:o*12,realYield:.023,glideRate:.05,startAge:57}),P=k.stats;a='<div class="card"><h2>Ladder &amp; Ratchet — your parameters, 150 years of markets</h2><div class="alert '+(P.survivalPct===100?"alert-success":P.survivalPct>=95?"alert-warning":"alert-danger")+'"><strong>'+O(u)+"/yr bolted on to age "+(57+d)+" by contract</strong> — the ratchet then locked a median "+Math.round(P.securedMedian)+" more years (fully secured to the horizon in "+P.fullySecuredPct.toFixed(0)+"% of histories). Sleeve survived to the horizon in <strong>"+P.survivalPct.toFixed(1)+"%</strong> of "+k.meta.fullN+' historical windows.</div><div class="table-scroll-container"><table><tbody><tr><td>Base ladder cost (order sheet in Strategies tab)</td><td>'+O(Math.round(v))+"</td></tr><tr><td>Equity sleeve at the ladder end (median / worst)</td><td>"+O(Math.round(P.sleeveMedian))+" / "+O(Math.round(P.sleeveWorst))+"</td></tr><tr><td>Never-triggered histories (sleeve just rode)</td><td>"+P.neverPct.toFixed(0)+"%</td></tr><tr><td>Typically left at the horizon</td><td>"+O(Math.round(P.terminalMedian))+"</td></tr></tbody></table></div></div>"}}if(t.strategyId==="floor-and-flex"){const d=e.essentialsAnnual||Math.round((t.baseSalary||0)*.55),u=e.horizonAge||92,p=Math.max(1,u-57);let f=0;for(let v=1;v<=p;v++)f+=Math.max(0,d-(v>10?i:0))*Math.pow(1.023,-v);const g=r-f;if(g<=0)a='<div class="alert alert-danger">Floor not affordable: essentials to '+u+" cost "+O(Math.round(f))+" of your "+O(Math.round(r))+". Lower the essentials or the horizon in Settings.</div>";else{const y=Sl({E0:g,rate:e.sleeveRate||.04,END:Math.min(p,o)*12}).stats;a='<div class="card"><h2>Floor &amp; Flex — your parameters, 150 years of markets</h2><div class="alert alert-success"><strong>Essentials of '+O(d)+"/yr are paid to "+u+" by contract — in every history, by construction.</strong> Treats start at "+O(Math.round(y.year1D))+'/yr and flex with the market.</div><div class="table-scroll-container"><table><tbody><tr><td>Floor cost (bought up front)</td><td>'+O(Math.round(f))+"</td></tr><tr><td>Worst treat-year per history (median / 1-in-10 / worst)</td><td>"+O(Math.round(y.worstMedian))+" / "+O(Math.round(y.worstP10))+" / "+O(Math.round(y.worstMin))+"</td></tr><tr><td>Share of all years with treats under £10k</td><td>"+y.shareYearsUnder(1e4).toFixed(1)+"%</td></tr><tr><td>Typically left at the horizon</td><td>"+O(Math.round(y.terminalMedian))+'</td></tr></tbody></table></div><p class="hint">The flex sleeve cannot run out (percentage-of-pot draws); the honest risk is lean years, shown above.</p></div>'}}const c=document.getElementById("strategyRunResults");c&&(c.innerHTML=a)}window.runMonteCarloUI=async function(){const t=await De();if(t.strategyId&&t.strategyId!=="pots-and-valves"){await oS(t);return}const e={years:parseInt(document.getElementById("mcYears").value)||t.duration},n=document.getElementById("optimiseResultsMC");n&&(n.innerHTML=""),document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:s,stats:r}=d6(e);cy=s,Sy(r,s,"Monte Carlo (1000 runs)","mcResults",e.years)}catch(s){console.error("Simulation error:",s),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${s.message}</div>`}},50)};window.runHistoricalUI=async function(){const t=await De(),e={years:parseInt(document.getElementById("histYears").value)||t.duration},n=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:s,stats:r}=u6(e);dy=s,Sy(r,s,"Historical Analysis","histResults",e.years)}catch(s){console.error("Simulation error:",s),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${s.message}</div>`}},50)};window.runScenariosUI=async function(){await De();const t={};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',setTimeout(()=>{try{const e=h6(t);gS(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};let ws=!1,zi=0;function aS(){zi++}window.runOptimisationUI=async function(t){if(ws)return;ws=!0;const e=++zi,n=document.getElementById("optimiseBtn"+t),s=document.getElementById("optimiseResults"+t);n&&(n.disabled=!0),n&&(n.textContent="Optimising..."),s.innerHTML='<div class="loading"><div class="spinner"></div>Preparing optimisation...</div>';const r=await De(),i=JSON.parse(JSON.stringify(r)),o=document.getElementById(t==="MC"?"mcYears":"histYears"),a=parseInt(o&&o.value)||i.duration,c=(i.equityMin||0)+(i.bondMin||0)+(i.cashTarget||0);if(e!==zi){ws=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const d=[];for(let T=5;T<=90;T+=5)for(let x=5;x<=95-T;x+=5){const A=100-T-x;A>=0&&d.push({equity:Math.round(c*x/100),bond:Math.round(c*A/100),cash:Math.round(c*T/100)})}const{EQUITY_RETURNS:u,INFLATION:p}=window._constants,{simulate:f,monteCarloReturns:g}=window._simEngine,v=Object.keys(u).map(Number).sort((T,x)=>T-x),y=Math.max(...v),E=T=>{const x={...i,equityMin:T.equity,bondMin:T.bond,cashTarget:T.cash},A=ns({years:a},x),_=[];if(t==="MC")for(let z=0;z<1e3;z++)_.push(f(A,g(A,z),z));else v.forEach(z=>{if(z+a-1>y)return;const xe={equity:{},inflation:{}};for(let ae=0;ae<a;ae++)xe.equity[ae]=u[z+ae]||0,xe.inflation[ae]=p[z+ae]||.025;_.push(f(A,xe,z))});const W=_.filter(z=>z.failed);_.filter(z=>!z.failed);const ee=(_.length-W.length)/_.length*100,H=_.reduce((z,xe)=>z+Math.min(1,(xe.years||0)/(xe.duration||a)),0)/_.length*100,te=_.map(z=>z.protMonths).reduce((z,xe)=>z+xe,0)/_.length,ye=_.filter(z=>z.protMonths>0).length,he=_.map(z=>z.failed?0:z.finalReal||0).sort((z,xe)=>z-xe),ft=he.length?he[Math.floor(he.length*.5)]:0,ie=he.length?he[Math.floor(he.length*.9)]:0;return{equity:T.equity,bond:T.bond,cash:T.cash,rate:ee,coverage:H,avgProt:te,withProt:ye,totalRuns:_.length,medianFinal:ft,p90Final:ie}};let C;try{const T={equity:i.equityMin||0,bond:i.bondMin||0,cash:i.cashTarget||0},x=E(T);C={...T,...x}}catch(T){console.error("Optimisation error (original):",T),s.innerHTML='<div class="alert alert-danger">Error: '+T.message+"</div>",ws=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const k=10;let P=0;const R=[];let B=null;function D(T){const x=Math.max(...T.map(_=>_.coverage)),A=T.filter(_=>_.coverage>=x-.5);return A.sort((_,W)=>_.avgProt-W.avgProt||W.medianFinal-_.medianFinal),A[0]}function I(T,x){return Math.round(T.equity)===Math.round(x.equity)&&Math.round(T.bond)===Math.round(x.bond)&&Math.round(T.cash)===Math.round(x.cash)}function w(){if(e!==zi){ws=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),s.innerHTML="";return}try{const T=Math.min(P+k,d.length);for(;P<T;P++)R.push(E(d[P]));s.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations... '+P+"/"+d.length+"</div>",P<d.length?setTimeout(w,0):(B=D([...R,C]),S())}catch(T){console.error("Optimisation error:",T),s.innerHTML='<div class="alert alert-danger">Error: '+T.message+"</div>",ws=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}}function S(){if(e!==zi){ws=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),s.innerHTML="";return}const T=c>0?C.cash/c*100:0,x=c>0?C.equity/c*100:0,_=T>90||T<5||x<5?'<div class="alert alert-info" style="margin-bottom:16px;font-size:13px;">Your current split is outside the range the optimiser sweeps, but it was included in this comparison.</div>':"",W=B&&!I(B,C)&&(B.coverage>C.coverage+.5||B.coverage>=C.coverage-.01&&B.avgProt<C.avgProt-3),ee=(re,te)=>{const ye=he=>Math.round(he/c*100);return'<div style="padding:16px;border-radius:8px;'+(te?"background:rgba(46,160,67,0.1);border:1px solid var(--success);":"background:rgba(0,0,0,0.2);")+'"><div style="font-weight:500;margin-bottom:10px;color:var(--'+(te?"success":"text-muted")+');">'+(te?"Optimised split":"Your current split")+'</div><div style="font-size:26px;font-weight:700;color:var(--'+(te?"success":"warning")+');">'+re.coverage.toFixed(0)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">of retirement years funded'+(te?" ("+(B.coverage-C.coverage>=0?"+":"")+(B.coverage-C.coverage).toFixed(0)+"%)":"")+'</div><div style="font-size:13px;">Equity '+ye(re.equity)+"% · Bonds "+ye(re.bond)+"% · Cash "+ye(re.cash)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">'+re.rate.toFixed(0)+"% never run out · "+j(re.medianFinal)+" typically left</div></div>"};let H="";if(W){const re=B.medianFinal-C.medianFinal,te=C.medianFinal>0?re/C.medianFinal*100:0;H+='<div class="card" style="margin-top:20px;border-color:var(--success);">',H+='<h3 style="color:var(--success);margin-top:0;">A better fund split</h3>',H+='<p style="color:var(--text-muted);margin-bottom:16px;">This split funds more of your retirement (higher coverage). Coverage credits a plan for every year it pays for, so it prefers splits that fall short late over ones that fail early.</p>',H+=_,H+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">'+ee(C,!1)+ee(B,!0)+"</div>",re<0?H+='<div class="alert alert-warning" style="margin-bottom:16px;"><strong>Trade-off:</strong> it typically leaves '+Math.abs(te).toFixed(0)+"% less at the end (usually less equity) — more safety, a bit less upside.</div>":re>0&&(H+='<div class="alert alert-info" style="margin-bottom:16px;"><strong>Bonus:</strong> it also typically leaves '+te.toFixed(0)+"% more at the end.</div>"),H+='<button onclick="applyOptimisedAllocationUI('+B.equity+","+B.bond+","+B.cash+')" style="width:100%;">Apply this split to your Settings</button>',H+="</div>"}else H+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',H+='<h3 style="color:var(--primary);margin-top:0;">Your split is already about as good as it gets</h3>',H+=_,H+='<p style="color:var(--text-muted);">We tested '+d.length+" fund splits. Yours funds "+C.coverage.toFixed(0)+"% of retirement years — the best, or within 0.5% of it, with no clearly better low-protection alternative.</p>",H+='<p style="font-size:13px;color:var(--text-muted);">Your split — Equity '+Math.round(x)+"% · Bonds "+Math.round(C.bond/c*100)+"% · Cash "+Math.round(T)+"% · "+C.rate.toFixed(0)+"% never run out.</p>",H+="</div>";s.innerHTML=H,ws=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}setTimeout(w,0)};window.applyOptimisedAllocationUI=async function(t,e,n){if(writeAlloc("ss",t,e,n),writeAlloc("ds",t,e,n),Wu({equityMin:t,bondMin:e,cashTarget:n,duration:parseInt(document.getElementById("ssDuration").value)||35}),Dl(),ut())try{await yi({equityMin:t,bondMin:e,cashTarget:n})}catch(s){console.error("Error saving optimised settings:",s)}showToast("Optimised allocation applied to settings and starting values. Scroll up to re-run.","success",4e3)};const lS={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function cS(t){if(!t||t.length===0)return"";const e=t.filter(i=>i.failed).sort((i,o)=>i.years-o.years),n=t.filter(i=>i.protMonths>0).sort((i,o)=>o.protMonths-i.protMonths),s=e.length>0?e.slice(0,5):n.slice(0,5);if(s.length===0)return"";let r=`
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
      `;return s.forEach(i=>{const o=i.startYear||i.seed,a=lS[o]||"-",c=i.failed?"danger":"success";r+=`
          <tr>
            <td>${o}</td>
            <td style="font-size: 12px;">${a}</td>
            <td>${i.years.toFixed(1)}</td>
            <td>${i.protMonths}</td>
            <td>${j(i.final)}</td>
            <td style="color: var(--${c});">${i.failed?"FAILED":"OK"}</td>
          </tr>
        `}),r+=`
              </tbody>
            </table>
          </div>
        </details>
      `,r}function Yn(t){return`<span class="hlp" tabindex="0" data-tip="${String(t).replace(/"/g,"&quot;")}">?</span>`}function dS(){if(window.__helpTipInit)return;window.__helpTipInit=!0;const t=document.createElement("div");t.className="help-tip",t.style.display="none",document.body.appendChild(t);let e=null;const n=r=>{const i=r.getAttribute("data-tip");if(!i)return;clearTimeout(e),t.textContent=i,t.style.display="block";const o=r.getBoundingClientRect(),a=Math.min(260,window.innerWidth-24);t.style.width=a+"px";let c=o.left+o.width/2-a/2+window.scrollX;c=Math.max(12+window.scrollX,Math.min(c,window.scrollX+window.innerWidth-a-12)),t.style.left=c+"px";const d=t.offsetHeight;let u=o.top+window.scrollY-d-8;o.top<d+12&&(u=o.bottom+window.scrollY+8),t.style.top=u+"px"},s=()=>{e=setTimeout(()=>{t.style.display="none"},80)};window.__hideHelpTip=()=>{clearTimeout(e),t.style.display="none"},document.addEventListener("mouseover",r=>{const i=r.target.closest&&r.target.closest("[data-tip]");i&&n(i)}),document.addEventListener("mouseout",r=>{r.target.closest&&r.target.closest("[data-tip]")&&s()}),document.addEventListener("focusin",r=>{const i=r.target.closest&&r.target.closest("[data-tip]");i&&n(i)}),document.addEventListener("focusout",r=>{r.target.closest&&r.target.closest("[data-tip]")&&s()}),document.addEventListener("click",r=>{const i=r.target.closest&&r.target.closest("[data-tip]");i&&(t.style.display==="block"?s():n(i))})}function uS(){if(window.__chartHoverInit)return;window.__chartHoverInit=!0;const t=e=>e.querySelectorAll("circle[data-tip]").forEach(n=>{n.setAttribute("fill","transparent"),n.removeAttribute("stroke")});document.addEventListener("mousemove",e=>{const n=e.target.closest&&e.target.closest(".ichart");if(!n)return;const s=n.querySelectorAll("circle[data-tip]");if(!s.length)return;let r=null,i=1/0;s.forEach(o=>{const a=o.getBoundingClientRect(),c=Math.abs(a.left+a.width/2-e.clientX);c<i&&(i=c,r=o)}),r&&(t(n),r.setAttribute("fill","#60a5fa"),r.setAttribute("stroke","var(--surface,#161b22)"),r.setAttribute("stroke-width","2"),r.dispatchEvent(new MouseEvent("mouseover",{bubbles:!0})))}),document.addEventListener("mouseout",e=>{const n=e.target.closest&&e.target.closest(".ichart");n&&(!e.relatedTarget||!n.contains(e.relatedTarget))&&(t(n),window.__hideHelpTip&&window.__hideHelpTip())})}const rr=t=>"£"+Math.round(t).toLocaleString();function _y(t,e,n){return`<svg class="ichart" viewBox="0 0 ${e} ${n}" style="width:100%;height:auto;overflow:visible;display:block" role="img">${t}</svg>`}function Iy(t,{max:e,valueFmt:n=rr,tip:s,pct:r=!1}={}){const p=t.length;if(p<2)return"";const f=e??(r?100:Math.max(1,...t)),g=R=>56+R/(p-1)*590,v=R=>174-Math.max(0,Math.min(r?100:1/0,R))/f*160,y=t.map((R,B)=>`${g(B).toFixed(1)},${v(R).toFixed(1)}`).join(" "),E=`56,${174 .toFixed(1)} ${y} ${g(p-1).toFixed(1)},${174 .toFixed(1)}`,C=r?[0,50,100]:[0,f/2,f],k=[0,Math.floor((p-1)/2),p-1],P=s||((R,B)=>`Year ${B}: ${n(R)}`);return _y(C.map(R=>`<line x1="56" y1="${v(R).toFixed(1)}" x2="646" y2="${v(R).toFixed(1)}" stroke="var(--border,#8883)" opacity=".45"/><text x="50" y="${(v(R)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${n(R)}</text>`).join("")+`<polygon points="${E}" fill="rgba(96,165,250,.13)"/><polyline points="${y}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.map((R,B)=>`<circle cx="${g(B).toFixed(1)}" cy="${v(R).toFixed(1)}" r="8" fill="transparent" data-tip="${P(R,B).replace(/"/g,"&quot;")}"></circle>`).join("")+k.map(R=>`<text x="${g(R).toFixed(1)}" y="192" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${R}</text>`).join(""),660,200)}function hS(t){const a=t.p50.length;if(a<2)return"";const c=Math.max(1,...t.p90),d=y=>60+y/(a-1)*606,u=y=>222-Math.max(0,y)/c*208,p=(y,E)=>y.map((C,k)=>`${d(k).toFixed(1)},${u(C).toFixed(1)}`).concat(E.map((C,k)=>`${d(a-1-k).toFixed(1)},${u(E[a-1-k]).toFixed(1)}`)).join(" "),f=y=>y.map((E,C)=>`${d(C).toFixed(1)},${u(E).toFixed(1)}`).join(" "),g=[0,c/4,c/2,3*c/4,c],v=[0,Math.floor((a-1)/2),a-1];return _y(g.map(y=>`<line x1="60" y1="${u(y).toFixed(1)}" x2="666" y2="${u(y).toFixed(1)}" stroke="var(--border,#8883)" opacity=".4"/><text x="54" y="${(u(y)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${rr(y)}</text>`).join("")+`<polygon points="${p(t.p90,t.p10)}" fill="rgba(96,165,250,.12)"/><polygon points="${p(t.p75,t.p25)}" fill="rgba(96,165,250,.22)"/><polyline points="${f(t.p50)}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.p50.map((y,E)=>`<circle cx="${d(E).toFixed(1)}" cy="${u(y).toFixed(1)}" r="8" fill="transparent" data-tip="Year ${E}: middle ${rr(y)}; likely range ${rr(t.p10[E])} to ${rr(t.p90[E])}"></circle>`).join("")+v.map(y=>`<text x="${d(y).toFixed(1)}" y="242" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${y}</text>`).join(""),680,250)}function fS(t){if(!t||!t.funded)return"";const e=r=>(r||0).toFixed(r>=10?0:1),n=t.pctSurviveFullTerm>=80?"success":t.pctSurviveFullTerm>=50?"warning":"danger",s=t.avgHigherRateYears<1?"success":t.avgHigherRateYears<4?"warning":"danger";return`
        <h3 style="margin:24px 0 4px;">Your tax-free ISA bridge</h3>
        <p style="color:var(--text-muted);font-size:12px;margin:0 0 12px;">
          The ISA (starting at ${j(t.startBalance)}) is drawn tax-free to top your income up, keeping you out of higher-rate tax. Modelled as a steady money-market fund.
        </p>
        <div class="keynums">
          <div class="keynum ${n}">
            <div class="kn-val">${t.pctSurviveFullTerm.toFixed(0)}%</div>
            <div class="kn-label">of futures the ISA still has real money at the end ${Yn("The ISA is treated as used up once its value in present-day money falls below 5% of what you started with — money-market growth leaves a tiny nominal sliver forever, so an exactly-zero test would be misleading.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${e(t.medianLastedYears)} yrs</div>
            <div class="kn-label">the ISA typically lasts before it's used up ${Yn("Median year its value in present-day money drops below 5% of the starting balance — the point it stops meaningfully topping up your income. Matches the chart below.")}</div>
          </div>
          <div class="keynum ${s}">
            <div class="kn-val">${e(t.avgHigherRateYears)} yrs</div>
            <div class="kn-label">typically paying 40% (higher-rate) tax ${Yn("Years you pay higher-rate income tax because the ISA has run out and income must come from the taxable pension above the basic-rate limit. A bigger ISA reduces these.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${j(t.medianTotalTax)}</div>
            <div class="kn-label">typical lifetime income tax, today's money ${Yn("Median total income tax paid over the whole plan, in present-day spending power.")}</div>
          </div>
        </div>
        <div style="margin-bottom:8px;">
          <div class="chart-caption">Typical ISA balance still to hand, year by year (today's money — hover a point for the figure). A slow, steady fall means it's being drawn as intended; a flat line means it's barely touched (larger than this plan needs); a drop to £0 marks when it typically runs out.</div>
          ${Iy(t.medianIsaByYear,{valueFmt:rr,tip:(r,i)=>`Year ${i}: typically ${rr(r)} of ISA left`})}
        </div>`}function pS(t){return t==="sequence"?"The failing futures were sunk by a bad first few years of markets. Holding a bigger cash/bond buffer for the early years, or starting with a slightly lower withdrawal, would let the plan ride out an early slump.":t==="inflation"?"The failing futures were driven by high inflation eroding your spending power. More inflation protection (e.g. index-linked gilts) and less plain cash would help — cash loses to inflation over time.":t==="market"?"The failing futures simply had weak markets throughout. A slightly lower withdrawal rate, or more growth assets (equities) accepting more short-term ups and downs, gives more headroom.":"Lowering your target income, delaying the start, or a larger starting pot would all raise the odds."}function mS(t,e){const n=t.severity||{},s=t.successRate,r=s>=90?{t:"Very likely to last",c:"success"}:s>=75?{t:"Likely to last — with some risk",c:"success"}:s>=50?{t:"At real risk of running out",c:"warning"}:{t:"Unlikely to last as planned",c:"danger"};let i=`<div class="verdict verdict-${r.c}">
        <div class="verdict-title">Will your money last? — ${r.t}</div>
        <div class="verdict-heroes">
          <div><span class="hero">${s.toFixed(0)}%</span>
            <span class="hero-sub">chance your money lasts the whole plan ${Yn("Out of "+e+", the share where your pot never runs out before the end of the plan. Higher is better.")}</span></div>
          <div><span class="hero" style="font-size:30px;">${(n.coverage||0).toFixed(0)}%</span>
            <span class="hero-sub">of retirement years funded (coverage) ${Yn('The average share of retirement years your plan pays for, across every simulated future — so a plan that funds 34 of 35 years scores 97%, and a late shortfall counts far less than an early one. Based on the retirement "coverage ratio" (Estrada & Kritzman, 2019). Note: it is capped at 100% and ignores any money left over, and it is an average — check the worst-case minimum below.')}</span></div>
        </div>
        <div class="verdict-basis">Based on ${e}. Pot and income values are shown in today's money.</div>
      </div>`;return n.failCount>0&&(i+=`<div class="callout">
          <div class="callout-title">Why it might fall short</div>
          <p>${n.diagnosis}</p>
          <p class="lever"><strong>What could help:</strong> ${pS(n.primaryDriver)}</p>
        </div>`),i}function Sy(t,e,n,s,r){dS(),uS();const i=t.survival||{},o=t.finalReal||{},a=t.protection||{},c=a.pctWithProtection!=null?a.pctWithProtection:(a.runsWithProtection||0)/(e.length||1)*100,d=s==="mcResults",u=d?`${e.length.toLocaleString()} simulated futures`:`${e.length} historical periods since 1928`;let p=`
        <div class="card">
          <h2>${n}</h2>

          ${mS(t,u)}

          <div class="keynums">
            <div class="keynum">
              <div class="kn-val">${Math.round(i.min||0)} / ${r} yrs</div>
              <div class="kn-label">worst simulated future — money lasted this long ${Yn("The single unluckiest of all the simulated futures — the true tail. The average coverage can look reassuring; this is the worst it ever got. (10th-percentile: at least "+(i.p10||0).toFixed(0)+" years.)")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${j(o.p50||0)}</div>
              <div class="kn-label">typically left at the end, today's money ${Yn("The middle outcome for the pension pot left at the end, in present-day spending power. Futures that ran out count as £0, so this is not flattered by only the lucky runs.")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${c.toFixed(0)} in 100</div>
              <div class="kn-label">futures where the plan had to cut back spending ${Yn("To ride out a market slump the plan temporarily reduces withdrawals. This is how often that safety response was needed.")}</div>
            </div>
          </div>

          <h3 style="margin:8px 0 4px;">How your pot changes over time (today's money)</h3>
          <div class="chart-caption">The blue line is the middle outcome; the darker band is the middle half of futures, the lighter band the 10th–90th. Futures that ran out count as £0, so a sinking band means real risk. Hover any point for the figures.</div>
          ${hS(t.chartData.potBand)}

          <h3 style="margin:22px 0 4px;">Chance your plan is still going, year by year</h3>
          <div class="chart-caption">Share of futures in which the money hasn't run out yet — starts at 100% and dips where plans tend to fail. A late dip means most shortfalls happen late.</div>
          ${Iy(t.chartData.solvency,{pct:!0,valueFmt:f=>f.toFixed(0)+"%",tip:(f,g)=>`Year ${g}: ${f.toFixed(0)}% of plans still going`})}

          ${fS(t.isa)}

          <details style="margin-top:22px;">
            <summary style="cursor:pointer;font-weight:600;color:var(--primary);">More detail — worst historical periods &amp; full statistics</summary>
            <div style="margin-top:16px;">
              ${s==="histResults"?cS(e):""}

              <h4 style="margin:20px 0 8px;">Pot left at the end — full range (today's money)</h4>
              <div class="grid-7" style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;">
                ${[["p5","unluckiest 5%"],["p10","10%"],["p25","25%"],["p50","middle"],["p75","75%"],["p90","90%"],["p95","luckiest 5%"]].map(([f,g])=>`
                  <div class="stat-box mini">
                    <div class="stat-value" style="font-size:13px;">${j(o[f]||0)}</div>
                    <div class="stat-label" style="font-size:10px;">${g}</div>
                  </div>`).join("")}
              </div>
              <p style="font-size:12px;color:var(--text-muted);margin-top:14px;line-height:1.6;">
                Based on ${u}. ${d?"Monte Carlo builds each future by stitching together random 5-year blocks of real history (1928–2024), so market slumps and inflation spikes arrive in realistic sustained runs rather than one-off years.":"Each run replays an actual stretch of history in its real order, capturing the true sequence of good and bad years."}
                A future "runs out" when the pension/cash pots hit zero before the plan ends.
              </p>
            </div>
          </details>
        </div>
      `;document.getElementById(s).innerHTML=p}function gS(t,e){let n='<div class="card"><h2>Scenario Analysis</h2>';n+=`
        <div class="chart-container" style="margin-bottom: 24px;">
          <canvas id="scenCompChart" width="900" height="400"></canvas>
        </div>
      `,n+='<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">';for(const[s,r]of Object.entries(t)){const i=r.result,o=i.failed?"danger":"success";n+=`
          <div class="history-item" style="border-left: 4px solid ${r.color};">
            <div>
              <div class="history-date">${r.name}</div>
              <div class="history-details">
                Protection: ${i.protMonths} mo | Max streak: ${i.maxConsec} mo
                ${i.hodlUsed>0?` | HODL used: ${j(i.hodlUsed)}`:""}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 24px; color: var(--${o});">${i.years.toFixed(1)} yrs</div>
              <div style="font-size: 12px; color: var(--${o});">${i.failed?"FAILED":"OK"}</div>
              <div style="font-size: 11px; color: var(--text-muted);">Final: ${j(i.final)}</div>
            </div>
          </div>
        `}n+="</div></div>",document.getElementById(e).innerHTML=n,setTimeout(()=>{const s=document.getElementById("scenCompChart");s&&t&&Q6(s,t,{years:35,title:"Scenario Comparison"})},50)}const Nl={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,diversifiers:.12,cash:.13},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.3,diversifiers:.15,cash:.05},adventurous:{key:"adventurous",label:"Adventurous",equity:.65,bond:.15,diversifiers:.15,cash:.05}};function xy(t){const e=document.getElementById(t+"Diversifiers");return!!(e&&e.checked)}window._customAlloc=window._customAlloc||{};window._allocMode=window._allocMode||{};function Gu(t){return window._allocMode[t]||"risk"}function Ay(t){if(window._customAlloc[t])return window._customAlloc[t];const e=document.querySelector("#"+t+"Risks .risk-card.active"),n=e&&e.dataset.risk||"balanced",s=xy(t)?Nl:es;return s[n]||s.balanced}function ky(t,e,n,s){s=s||0;const r=s>.001?Nl:es;let i="balanced",o=1/0;for(const a in r){const c=r[a],d=(c.equity-t)**2+(c.bond-e)**2+((c.diversifiers||0)-s)**2+(c.cash-n)**2;d<o&&(o=d,i=a)}return i}window.renderModelPortfolio=function(t){var c,d;const e=document.getElementById(t+"ModelPortfolio");if(!e)return;const n=document.querySelector("#"+t+"Risks .risk-card.active"),s=n?n.dataset.risk:"balanced",r=!!((c=document.getElementById(t+"Diversifiers"))!=null&&c.checked),i=!!((d=document.getElementById(t+"EquityGlide"))!=null&&d.checked),o=dI(s,{diversifiers:r});let a='<div class="table-scroll-container"><table><thead><tr><th>Example fund</th><th>Job in the mix</th><th>%</th></tr></thead><tbody>';for(const u of o.rows)a+="<tr><td><strong>"+u.ticker+'</strong> <span class="hint">'+u.name+'</span></td><td style="font-size:13px;">'+u.job+'</td><td style="font-weight:600;">'+u.pct+"%</td></tr>";a+="</tbody></table></div>",i&&(a+='<p class="hint" style="margin:6px 0 0;">Bond tent is ON: the shares/bonds SPLIT shifts over the years — the instruments stay the same, you would just hold different amounts of each.</p>'),a+='<p class="hint" style="margin:6px 0 0;">'+o.note+"</p>",e.innerHTML=a};window.updateAllocDisplay=function(t){const e=Ay(t),n=Math.round(e.equity*100),s=Math.round(e.bond*100),r=Math.round(e.cash*100),i=Math.round((e.diversifiers||0)*100),o=document.getElementById(t+"AllocAmounts"),a=window._customAlloc[t],c=document.getElementById(t+"Pot");if(a&&c){const D=Math.round((a.equityMin||0)+(a.bondMin||0)+(a.cashTarget||0)+(a.diversifierStart||0));+c.value!==D&&(c.value=D,c._updateOverlay&&c._updateOverlay());const I=document.getElementById(t+"PotDisplay");I&&(I.textContent="£"+D.toLocaleString())}const d=+document.getElementById(t+"Pot").value||0,u=a?a.equityMin:Math.round(d*n/100),p=a?a.bondMin:Math.round(d*s/100),f=a?a.cashTarget:Math.round(d*r/100),g=a?a.diversifierStart||0:Math.round(d*i/100),v=i>0?" &middot; "+i+"% diversifiers":"",y=i>0?" &middot; £"+g.toLocaleString()+" diversifiers":"",E=Math.round(+(document.getElementById(t+"IsaBalance")||{}).value||0),C=E>0?'<br><span style="color:var(--text-muted);">+ £'+E.toLocaleString()+" ISA kept separate (the tax-free bridge)</span>":"";o&&(o.innerHTML="<strong>"+e.label+"</strong> &mdash; "+n+"% shares &middot; "+s+"% bonds"+v+" &middot; "+r+'% cash<br><span style="color:var(--text-muted);">£'+u.toLocaleString()+" shares &middot; £"+p.toLocaleString()+" bonds"+y+" &middot; £"+f.toLocaleString()+" cash</span>"+C);const k=document.getElementById(t+"EquityGlide"),P=!!(k&&k.checked),R=document.getElementById(t+"GlideEndgame");R&&(P&&a?(R.style.display="block",R.innerHTML=vS(t)):R.style.display="none");const B=document.getElementById(t+"GlideMinNote");B&&(P?(B.style.display="block",B.innerHTML=yS(t,e)):B.style.display="none")};function yS(t,e){const n=document.getElementById(t+"Duration"),s=n&&+n.value||35,r=Math.max(5,s-20),i=e.cash,o=e.diversifiers||0,a=1-i-o,c=window._customAlloc[t],d=!!c,u=d&&c.glideEndgame?c.glideEndgame:null,p=d?r0(e.equity,e.bond,u):gu(e.equity,e.bond),f=Math.round(a*p.start*100),g=Math.round(a*p.end*100),v=Math.round(a*(1-p.start)*100),y=Math.round(a*(1-p.end)*100),E=Math.round(i*100),C=Math.round(o*100),k=6,P=314,R=18,B=104,D=B-R,I=ae=>(B-ae*D).toFixed(1),w=(k+(P-k)*Math.min(1,r/s)).toFixed(1),S=I(i),T=I(i+o),x=I(i+o+a*(1-p.start)),A=I(i+o+a*(1-p.end)),_="#6366f1",W="#14b8a6",ee="#94a3b8",H="#f59e0b",re=o>0?`<polygon points="${k},${S} ${P},${S} ${P},${T} ${k},${T}" fill="${H}"></polygon>`:"",te=`<svg viewBox="0 0 320 122" style="width:100%;height:auto;display:block;" preserveAspectRatio="none"><polygon points="${k},${B} ${P},${B} ${P},${S} ${k},${S}" fill="${ee}"></polygon>`+re+`<polygon points="${k},${T} ${P},${T} ${P},${A} ${w},${A} ${k},${x}" fill="${W}"></polygon><polygon points="${k},${x} ${w},${A} ${P},${A} ${P},${R} ${k},${R}" fill="${_}"></polygon><line x1="${w}" y1="${R}" x2="${w}" y2="${B}" stroke="rgba(148,163,184,0.9)" stroke-width="1" stroke-dasharray="3,2"></line></svg>`,ye=ae=>`<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${ae};vertical-align:middle;"></span>`,he=o>0?" · "+C+"% diversifiers":"",ft=o>0?" &nbsp; "+ye(H)+" Diversifiers":"",ie=d?"Now (your funds)":"Starts",z=d?"Rises to"+(u&&u.label?" ("+u.label+")":""):"Then holds ("+e.label+")",xe=d?"rises from your holdings, levels off at year "+r:"reaches your mix at year "+r+", then holds";return'<div style="font-weight:600;margin-bottom:6px;">How your mix glides over '+s+" years</div>"+te+'<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:3px;"><span>Now</span><span>'+xe+'</span></div><div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:8px;"><span><strong>'+ie+"</strong><br>"+f+"% shares · "+v+"% bonds"+he+" · "+E+'% cash</span><span style="text-align:right;"><strong>'+z+"</strong><br>"+g+"% shares · "+y+"% bonds"+he+" · "+E+'% cash</span></div><div style="font-size:12px;margin-top:8px;">'+ye(_)+" Shares &nbsp; "+ye(W)+" Bonds"+ft+" &nbsp; "+ye(ee)+" Cash</div>"}window.setRiskPreset=function(t,e){es[e]&&(window._allocMode[t]="risk",delete window._customAlloc[t],document.querySelectorAll("#"+t+"Risks .risk-card").forEach(n=>n.classList.toggle("active",n.dataset.risk===e)),updateAllocDisplay(t),renderModelPortfolio(t))};window.setAllocMode=function(t,e){window._allocMode[t]=e;const n=document.getElementById(t+"ModeRisk"),s=document.getElementById(t+"ModeFunds");n&&n.classList.toggle("active",e==="risk"),s&&s.classList.toggle("active",e==="funds");const r=document.getElementById(t+"RiskMode"),i=document.getElementById(t+"FundsMode");if(r&&(r.style.display=e==="risk"?"":"none"),i&&(i.style.display=e==="funds"?"":"none"),e==="funds")renderFunds(t),Ku(t);else if(delete window._customAlloc[t],!document.querySelector("#"+t+"Risks .risk-card.active")){const o=document.querySelector("#"+t+'Risks .risk-card[data-risk="balanced"]');o&&o.classList.add("active")}updateAllocDisplay(t),typeof updateEntryTagPrompt=="function"&&updateEntryTagPrompt()};function vS(t){const e=window._customAlloc[t]&&window._customAlloc[t].glideEndgame&&window._customAlloc[t].glideEndgame.key||"",n=(s,r)=>'<button type="button" class="risk-btn'+(e===s?" active":"")+`" style="padding:6px 12px;" onclick="setGlideEndgame('`+t+"','"+s+`')">`+r+"</button>";return'<div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;"><strong>Glide towards</strong> — your funds are the start; the tent raises shares over time to this level:</div><div style="display:flex;gap:8px;flex-wrap:wrap;">'+n("cautious","Cautious")+n("balanced","Balanced")+n("adventurous","Adventurous")+"</div>"}window.setGlideEndgame=function(t,e){const n=window._customAlloc[t];if(!n)return;const r=(xy(t)?Nl:es)[e];if(!r)return;n.glideEndgame={equityPct:r.equity,bondPct:r.bond,key:e,label:r.label};const i=n.equity/(n.equity+n.bond||1);r.equity/(r.equity+r.bond||1)<=i&&showToast("That endgame isn’t more share-heavy than your holdings — the glide would flatten or decline, not rise.","warning",5e3),updateAllocDisplay(t)};window.readAlloc=function(t){const e=window._customAlloc[t];if(e){const o={equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget};return e.diversifierStart>0&&(o.diversifierStart=e.diversifierStart),e.subAsset&&(o.subAsset=e.subAsset),e.glideEndgame&&(o.glideEndgame=e.glideEndgame),o}const n=+document.getElementById(t+"Pot").value||0,s=Ay(t),r={equityMin:Math.round(n*s.equity),bondMin:Math.round(n*s.bond),cashTarget:Math.round(n*s.cash)},i=s.diversifiers||0;return i>0&&(r.diversifierStart=Math.round(n*i),r.subAsset={}),r};window.writeAlloc=function(t,e,n,s,r){const i=+r||0,o=(+e||0)+(+n||0)+(+s||0)+i;document.getElementById(t+"Pot").value=Math.round(o);const a=document.getElementById(t+"Diversifiers");a&&(a.checked=i>0);const c=o>0?Math.round((+e||0)/o*100):50,d=o>0?Math.round((+n||0)/o*100):40,u=o>0?ky((+e||0)/o,(+n||0)/o,(+s||0)/o,i/o):"balanced";document.querySelectorAll("#"+t+"Risks .risk-card").forEach(f=>f.classList.toggle("active",f.dataset.risk===u)),updateAllocDisplay(t);const p=(i>0?Nl:es)[u];if(o>0&&(c!==Math.round(p.equity*100)||d!==Math.round(p.bond*100))){const f=document.getElementById(t+"AllocAmounts");f&&(f.innerHTML+='<div style="margin-top:8px;color:#b45309;font-size:12px;">Your saved split ('+c+"% / "+d+"% / "+Math.max(0,100-c-d)+"%) was matched to the nearest risk level (<strong>"+p.label+"</strong>). Pick another if you prefer — saving keeps this one.</div>")}};window._taggedFunds=window._taggedFunds||{};function Yt(t){return window._taggedFunds[t]=window._taggedFunds[t]||[]}const ju={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};function vr(t,e=!1){const n=document.getElementById(t+"FundCatalogue");n&&(e||!n.childElementCount)&&(n.innerHTML=Ml().map(s=>'<option value="'+s.ticker+'">'+s.ticker+" — "+s.name+"</option>").join(""))}function rd(t){const e=(t.ticker||"").toUpperCase().trim(),n=ii(e);return t.subClass||n&&n.subClass||d0[e]||""}window.reformatMoney=function(t){const e=parseFloat(String(t.value).replace(/[^0-9.]/g,""));t.value=isNaN(e)||e===0?"":$u(e)};function bS(t,e,n){if(t=t.toLowerCase().trim(),!t)return 0;const s=e.toLowerCase(),r=n.toLowerCase();if(s===t)return 1e3;if(s.startsWith(t))return 900-(s.length-t.length);if(r.split(/[^a-z0-9]+/).filter(Boolean).some(a=>a.startsWith(t)))return 820;if(s.includes(t))return 720;if(r.includes(t))return 660-Math.min(50,r.indexOf(t));const o=a=>{let c=0;for(const d of a)if(d===t[c]&&c++,c===t.length)return!0;return!1};return o(s)?360:o(r)?300:0}function wS(t,e=8){return Ml().map(n=>({f:n,s:bS(t,n.ticker,n.name)})).filter(n=>n.s>0).sort((n,s)=>s.s-n.s||n.f.ticker.localeCompare(s.f.ticker)).slice(0,e).map(n=>n.f)}window.showFundSearch=function(t,e){const n=document.getElementById(t+"FundSearchResults");if(!n)return;const s=wS(e);if(!e.trim()||!s.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=s.map(r=>`<div class="fund-search-item" onmousedown="addFundFromSearch('`+t+"','"+r.ticker+`')" style="padding:7px 10px; cursor:pointer;"><strong>`+r.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+r.name+"</span></div>").join(""),n.style.display="block"};window.hideFundSearch=function(t){const e=document.getElementById(t+"FundSearchResults");e&&(e.style.display="none")};window.addFundFromSearch=function(t,e){const n=ii(e);Yt(t).push({ticker:e,value:"",wrapper:"SIPP",subClass:n?n.subClass:""});const s=document.getElementById(t+"FundSearch");s&&(s.value=""),hideFundSearch(t),renderFunds(t)};function ES(t,e,n){const s=u0();let r='<option value="">— not set —</option>';for(const i of["shares","bonds","diversifiers","cash"]){const o=s[i]||[];o.length&&(r+='<optgroup label="'+ju[i]+'">'+o.map(a=>'<option value="'+a.key+'"'+(a.key===n?" selected":"")+">"+a.label+"</option>").join("")+"</optgroup>")}return`<select onchange="updateFundField('`+t+"',"+e+`,'subClass',this.value)" style="width:190px;">`+r+"</select>"}function TS(t){const e=encodeURIComponent((t||"").toUpperCase().trim()),n=(s,r)=>'<a href="'+s+'" target="_blank" rel="noopener" style="margin-right:8px;">'+r+"</a>";return'<div style="font-size:11px; margin-top:3px; color:var(--text-muted);">Not in our list — how is it invested? Look it up: '+n("https://markets.ft.com/data/search?query="+e,"FT")+n("https://www.morningstar.co.uk/uk/util/SecuritySearchResults.aspx?search="+e,"Morningstar")+n("https://www.justetf.com/uk/search.html?query="+e,"justETF")+"then pick a category.</div>"}function Cy(t,e,n){const s=(n.ticker||"").toUpperCase().trim(),r=s&&!ii(s);return ES(t,e,rd(n))+(r?TS(s):"")}window.renderFunds=function(t){const e=document.getElementById(t+"FundRows");e&&(vr(t),e.innerHTML=Yt(t).map((n,s)=>'<tr><td style="padding:3px 6px;"><input type="text" list="'+t+'FundCatalogue" value="'+(n.ticker||"")+`" oninput="updateFundField('`+t+"',"+s+`,'ticker',this.value)" style="width:92px;text-transform:uppercase;" placeholder="e.g. VWRL"></td><td style="padding:3px 6px;"><input type="text" inputmode="numeric" value="`+(n.value?$u(n.value):"")+`" oninput="updateFundField('`+t+"',"+s+`,'value',this.value)" onblur="reformatMoney(this)" style="width:110px;" placeholder="0"></td><td style="padding:3px 6px;"><select onchange="updateFundField('`+t+"',"+s+`,'wrapper',this.value)" style="width:74px;"><option`+(n.wrapper!=="ISA"?" selected":"")+">SIPP</option><option"+(n.wrapper==="ISA"?" selected":"")+'>ISA</option></select></td><td id="'+t+"_fcat_"+s+'" style="padding:3px 6px;">'+Cy(t,s,n)+`</td><td style="padding:3px 6px;"><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="removeFund('`+t+"',"+s+')">&times;</button></td></tr>').join(""),Py(t))};window.updateFundField=function(t,e,n,s){const r=Yt(t)[e];if(r){if(n==="value")r.value=parseFloat(String(s).replace(/[^0-9.]/g,""))||0;else if(n==="ticker"){r.ticker=s;const i=ii(s);i&&(r.subClass=i.subClass);const o=document.getElementById(t+"_fcat_"+e);o&&(o.innerHTML=Cy(t,e,r))}else n==="subClass"?(r.subClass=s,s&&r.ticker&&!ii(r.ticker)&&w6({ticker:r.ticker,name:"",subClass:s})):r[n]=s;Py(t)}};window.addFundRow=function(t){Yt(t).push({ticker:"",value:"",wrapper:"SIPP"}),renderFunds(t)};window.removeFund=function(t,e){Yt(t).splice(e,1),renderFunds(t)};window.clearFunds=function(t){window._taggedFunds[t]=[],renderFunds(t)};function Py(t){const e=document.getElementById(t+"FundSummary");if(!e)return;const n=Yt(t).filter(d=>d.ticker&&d.value>0);if(!n.length){e.innerHTML='<span style="color:var(--text-muted);font-size:12px;">Add holdings above to see the bucket roll-up.</span>';return}const s=Rl(n),r=s.total-s.isaTotal,i=d=>r?Math.round(s.buckets[d]/r*100):0,o=d=>"£"+Math.round(d).toLocaleString(),a=d=>Object.entries(d).map(([u,p])=>zt[u].label+" "+Math.round(p*100)+"%").join(" · ");let c='<div style="font-weight:600;margin-bottom:6px;">Rolls up to '+o(r)+" pot"+(s.isaTotal?" + "+o(s.isaTotal)+" ISA (separate tax-free bridge, modelled at its own tagged mix)":"")+"</div>";c+='<div style="font-size:13px;">';for(const d of["shares","bonds","diversifiers","cash"])s.buckets[d]&&(c+="<div><strong>"+ju[d]+"</strong>: "+o(s.buckets[d])+" ("+i(d)+"%)"+(d==="bonds"&&Object.keys(s.bondWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+a(s.bondWeights)+"</span>":"")+(d==="diversifiers"&&Object.keys(s.diversifierWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+a(s.diversifierWeights)+"</span>":"")+"</div>");c+="</div>",s.untagged.length&&(c+='<div style="color:#b45309;font-size:12px;margin-top:6px;">Not recognised (ignored): '+s.untagged.map(d=>d.ticker).join(", ")+"</div>"),e.innerHTML=c,Gu(t)==="funds"&&(Ku(t),updateAllocDisplay(t))}function Ku(t){const e=Yt(t).filter(c=>c.ticker&&c.value>0);if(!e.length)return delete window._customAlloc[t],null;const n=Rl(e),s=LI(n),r=window._customAlloc[t]||{};window._customAlloc[t]={label:"Your funds",equity:n.total?n.buckets.shares/n.total:0,bond:n.total?n.buckets.bonds/n.total:0,diversifiers:n.total?n.buckets.diversifiers/n.total:0,cash:n.total?n.buckets.cash/n.total:0,equityMin:s.equityStart,bondMin:s.bondStart,cashTarget:s.cashStart,diversifierStart:s.diversifierStart||0,subAsset:s.subAsset||null,glideEndgame:r.glideEndgame||null};const i=document.getElementById(t+"Pot");i&&(i.value=Math.round(n.total-n.isaTotal),i._updateOverlay&&i._updateOverlay());const o=document.getElementById(t+"Diversifiers");o&&(o.checked=(s.diversifierStart||0)>0);const a=document.getElementById(t+"IsaBalance");return a&&(a.value=Math.round(n.isaTotal||0),a._updateOverlay&&a._updateOverlay()),n}window.applyTaggedPortfolio=function(t){if(window._allocMode[t]="funds",!Ku(t)){showToast("Add some holdings first","warning");return}updateAllocDisplay(t)};window.restoreCustomAllocFromSettings=function(t,e){if(e&&e.subAsset&&e.subAsset.bondWeights&&Object.keys(e.subAsset.bondWeights).length){const n=(e.equityMin||0)+(e.bondMin||0)+(e.cashTarget||0)+(e.diversifierStart||0);window._customAlloc[t]={label:"Your funds",equity:n?e.equityMin/n:0,bond:n?e.bondMin/n:0,diversifiers:n?(e.diversifierStart||0)/n:0,cash:n?e.cashTarget/n:0,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset,glideEndgame:e.glideEndgame||null}}else delete window._customAlloc[t]};function _S(t){const e={shares:[],bonds:[],diversifiers:[],cash:[]},n=[];t.tagged.forEach(o=>{(o.wrapper||"").toUpperCase()==="ISA"?n.push(o):e[o.bucket]&&e[o.bucket].push(o)});const s=o=>"£"+Math.round(o).toLocaleString(),r={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};let i='<div style="font-size:12px;border:1px solid var(--border,#cbd5e1);border-radius:8px;padding:10px 12px;">';i+='<div style="font-weight:600;margin-bottom:6px;">Which of your funds went where</div>';for(const o of["shares","bonds","diversifiers","cash"]){if(!e[o].length)continue;const a=e[o].reduce((c,d)=>c+(+d.value||0),0);i+='<div style="margin:3px 0;"><strong>'+r[o]+"</strong> "+s(a)+': <span style="color:var(--text-muted);">'+e[o].map(c=>c.ticker).join(", ")+"</span></div>"}return n.length&&(i+='<div style="margin:3px 0;"><strong>ISA (separate tax-free pool)</strong> '+s(t.isaTotal)+': <span style="color:var(--text-muted);">'+n.map(o=>o.ticker).join(", ")+"</span></div>"),t.untagged.length&&(i+='<div style="color:#b45309;margin-top:4px;">Not recognised: '+t.untagged.map(o=>o.ticker).join(", ")+"</div>"),i+="</div>",i}window._fundModal={fieldId:null,subtotal:0};window.openFundBucketModal=function(t,e,n){const s=Yt("ds").filter(i=>{const o=rd(i);return i.ticker&&o&&zt[o]&&zt[o].bucket===t});window._fundModal={fieldId:e,subtotal:0},document.getElementById("fundModalTitle").textContent=n;const r=document.getElementById("fundModalRows");s.length?r.innerHTML=s.map(i=>{const o=ii(i.ticker),a=zt[rd(i)],c=o?o.name:a?a.label:"";return'<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin:8px 0;"><span><strong>'+i.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+c+'</span></span><span style="white-space:nowrap;">£ <input type="number" class="fund-modal-input" oninput="updateFundModalSubtotal()" style="width:120px;" placeholder="0"></span></div>'}).join(""):r.innerHTML='<p style="color:var(--text-muted);">No '+n.toLowerCase()+" tagged yet. Define your holdings in <strong>Settings → Build from my funds</strong>, then come back — or just type the total into the box.</p>",updateFundModalSubtotal(),document.getElementById("fundBucketModal").style.display="flex"};window.updateFundModalSubtotal=function(){let t=0;document.querySelectorAll("#fundModalRows .fund-modal-input").forEach(e=>{t+=+e.value||0}),window._fundModal.subtotal=t,document.getElementById("fundModalSubtotal").textContent="Total: £"+Math.round(t).toLocaleString()};window.applyFundBucketModal=function(){const t=document.getElementById(window._fundModal.fieldId);t&&(t.value=Math.round(window._fundModal.subtotal||0)),closeFundBucketModal()};window.closeFundBucketModal=function(){document.getElementById("fundBucketModal").style.display="none"};window.updateEntryTagPrompt=function(){const t=document.getElementById("entryTagPrompt");if(!t)return;if(Yt("ds").filter(n=>n.ticker).length>0){t.style.display="none",t.innerHTML="";return}t.style.display="block",t.innerHTML='<div class="alert alert-info" style="font-size:13px;">The Decision Tool works from your real portfolio. Tag your funds in <strong>Settings → “Build from my funds”</strong> to enter values per fund via the <em>enter per fund ▸</em> links. You can still type bucket totals directly.</div>'};window.fillDecisionFromTaggedFunds=async function(){let t=Yt("ds").filter(r=>r.ticker&&r.value>0);if(t.length||(t=Yt("ss").filter(r=>r.ticker&&r.value>0)),!t.length)try{t=((await De()).taggedFunds||[]).filter(i=>i.ticker&&i.value>0)}catch{}if(!t.length){showToast('No tagged funds yet — tag your holdings in Settings → "Build from my funds", then come back.',"info",6e3);return}const e=Rl(t),n=(r,i)=>{const o=document.getElementById(r);o&&(o.value=Math.round(i))};n("entryEquity",e.buckets.shares),n("entryBond",e.buckets.bonds),n("entryCash",e.buckets.cash),n("entryDiversifier",e.buckets.diversifiers),e.isaTotal&&n("entryIsa",e.isaTotal);const s=document.getElementById("entryFundTagHelp");s&&(s.innerHTML=_S(e)),showToast("Filled your fund values from "+t.length+" tagged funds","success")};function Ry(t,e){const n=(t.equityMin||0)+(t.bondMin||0)+(t.cashTarget||0),s=n>0?ky(t.equityMin/n,t.bondMin/n,t.cashTarget/n):"balanced",r=es[s],i=a=>"£"+Math.round(a||0).toLocaleString(),o=Math.round(r.equity*100)+"/"+Math.round(r.bond*100)+"/"+Math.round(r.cash*100);return`<div class="rpt-header">
        <h1>Pension Decision Plan</h1>
        <div class="rpt-sub">${e||""}</div>
        <table class="rpt-meta"><tbody>
          <tr><td>Total pot</td><td>${i(n)}</td><td>Risk level</td><td>${r.label} (${o})</td></tr>
          <tr><td>Bond tent</td><td>${t.equityGlideEnabled?"On — rising-equity glidepath":"Off"}</td><td>Target income</td><td>${i(t.baseSalary)}/yr</td></tr>
          <tr><td>Duration</td><td>${t.duration||35} yrs</td><td>Generated</td><td>${new Date().toLocaleDateString("en-GB")}</td></tr>
        </tbody></table>
      </div>`}function My(t){let e=document.getElementById("printPortal");e||(e=document.createElement("div"),e.id="printPortal",document.body.appendChild(e)),e.innerHTML=t,document.body.classList.add("printing"),window.print()}window.addEventListener("afterprint",()=>{document.body.classList.remove("printing");const t=document.getElementById("printPortal");t&&(t.innerHTML="")});function By(t,e,n){const s=new Blob([e],{type:n}),r=URL.createObjectURL(s),i=document.createElement("a");i.href=r,i.download=t,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(r),1e3)}window.printAnnualReport=async function(t){const e=await Ze();My(Ry(e,"Annual report — tax year "+t)+document.getElementById("taxYearDetail").innerHTML)};window.printMonthlyReport=async function(t){const e=await Ze();My(Ry(e,"Monthly record — "+t)+document.getElementById("historyDetail").innerHTML)};window.exportAnnualCsv=function(t){const e=(typeof dn<"u"?dn:[]).filter(o=>o.taxYear===t).sort((o,a)=>(o.date||"").localeCompare(a.date||"")),n=o=>(o=o==null?"":String(o),/[",\n]/.test(o)?'"'+o.replace(/"/g,'""')+'"':o),s=o=>Math.round(o||0);let i=["Date","Draw source","SIPP draw","ISA draw","From equity","From bond","From cash","Protection","Equity target","Bond target","Cash target","Total pot","Rebalance"].map(n).join(",")+`
`;for(const o of e)i+=[o.date,o.source,s(o.sipp),s(o.isa),s(o.dEquity),s(o.dBond),s(o.dCash),o.inProtection?"Yes":"No",s(o.adjEquity),s(o.adjBond),s(o.adjCash),s(o.total),o.rebal||""].map(n).join(",")+`
`;e.length||(i+=`(no monthly records saved for this tax year yet)
`),By("decision-plan-"+t.replace("/","-")+".csv",i,"text/csv;charset=utf-8;")};window.runCompareStrategiesUI=async function(t){const e=document.getElementById("optimiseBtn"+t),n=document.getElementById("optimiseResults"+t);e&&(e.disabled=!0,e.textContent="Comparing..."),n&&(n.innerHTML='<div class="loading"><div class="spinner"></div>Running six strategies…</div>');const s=JSON.parse(JSON.stringify(await De())),r=document.getElementById(t==="MC"?"mcYears":"histYears"),i=parseInt(r&&r.value)||s.duration,o=(s.equityMin||0)+(s.bondMin||0)+(s.cashTarget||0),a=Object.keys(ar).map(Number).sort((f,g)=>f-g),c=Math.max(...a),d=f=>{const g=[];if(t==="MC")for(let k=0;k<1e3;k++)g.push(Xc(f,ly(f,k),k));else a.forEach(k=>{if(k+i-1>c)return;const P={equity:{},inflation:{}};for(let R=0;R<i;R++)P.equity[R]=ar[k+R]||0,P.inflation[R]=Ka[k+R]||.025;g.push(Xc(f,P,k))});const v=g.length||1,y=g.reduce((k,P)=>k+Math.min(1,(P.years||0)/(P.duration||i)),0)/v*100,E=g.filter(k=>!k.failed).length/v*100,C=g.reduce((k,P)=>Math.min(k,P.years||0),1/0);return{coverage:y,rate:E,minYears:C===1/0?0:C}},u=["cautious","balanced","adventurous"],p={};for(const f of u){const g=es[f];p[f]={};for(const v of[!1,!0]){const y={...s,equityMin:Math.round(o*g.equity),bondMin:Math.round(o*g.bond),cashTarget:Math.round(o*g.cash),equityGlideEnabled:v},E=ns({years:i},y);p[f][v?"tent":"flat"]=d(E),await new Promise(C=>setTimeout(C,0))}}IS(n,p,u),e&&(e.disabled=!1,e.textContent="Compare strategies")};function IS(t,e,n){let s={cov:-1,key:null,tent:null};for(const o of n)for(const a of["flat","tent"])e[o][a].coverage>s.cov&&(s={cov:e[o][a].coverage,key:o,tent:a});const r=(o,a)=>`<td style="text-align:center;padding:10px;border:1px solid var(--border);${a?"background:rgba(16,185,129,0.12);":""}">
          <div style="font-size:22px;font-weight:700;color:var(--${a?"success":"text"});">${o.coverage.toFixed(0)}%</div>
          <div style="font-size:11px;color:var(--text-muted);">worst case ${o.minYears.toFixed(0)} yrs</div>
        </td>`;let i='<h3 style="margin-bottom:6px;">Compare strategies</h3>';i+=`<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px;">Coverage = the share of your retirement years the pot funds (worst case = the fewest years it lasted in any run). More shares usually buys a little more coverage but a rougher ride; the bond tent mainly lifts the worst case. Pick the risk level you're comfortable holding — the tool won't change it for you.</p>`,i+='<table style="border-collapse:collapse;width:100%;max-width:520px;"><thead><tr><th style="text-align:left;padding:8px;"></th><th style="padding:8px;">Flat</th><th style="padding:8px;">+ Bond tent</th></tr></thead><tbody>';for(const o of n){const a=es[o];i+=`<tr><td style="padding:8px;border:1px solid var(--border);"><strong>${a.label}</strong><br><span style="font-size:11px;color:var(--text-muted);">${Math.round(a.equity*100)}/${Math.round(a.bond*100)}/${Math.round(a.cash*100)}</span></td>`,i+=r(e[o].flat,s.key===o&&s.tent==="flat"),i+=r(e[o].tent,s.key===o&&s.tent==="tent"),i+="</tr>"}i+="</tbody></table>",i+=`<p style="margin-top:12px;font-size:13px;">Best coverage: <strong>${es[s.key].label}${s.tent==="tent"?" + bond tent":""}</strong> at ${s.cov.toFixed(0)}%. Set it in Settings if you'd like it.</p>`,t&&(t.innerHTML=i)}window.updateNextStepBanner=async function(){var e;const t=document.getElementById("nextStepBanner");if(t)try{const n=await Fo();if(!n||localStorage.getItem("nextStepDismissed:"+n)){t.style.display="none";return}const[s,r,i]=await Promise.all([zo(),De(),Ze()]),o=(s.lines||[]).some(g=>+g.annual>0),a=(r.baseSalary||0)>0,c=!!i.configured;let d=null,u=null,p=null;if(!o)d="Start here: walk through what retirement will actually cost — about 10 minutes, with typical UK figures when you're unsure.",u="Start the budget walk-through",p=()=>{switchToTab("budget"),setTimeout(()=>openBudgetWizard(),400)};else if(a)r.configured?c||(d="Your target is set and the Stress Tester is ready — when the long-term picture looks right, set up the monthly Decision Tool (it tells you what to draw, from where, each month).",u="Open the Decision Tool",p=()=>switchToTab("decision")):(d="Target set. Now the big question: can your pension actually pay for it? Open the Stress Tester settings, tell it what you have, and run the simulation.",u="Open Stress Tester settings",p=()=>{switchToTab("stress"),setTimeout(()=>{[...document.querySelectorAll("button")].filter(g=>/^Settings$/.test(g.textContent.trim())&&g.offsetParent).forEach(g=>g.click())},400)});else{const g=(e=s.derived)==null?void 0:e.allInComfortableMonthly;d="Your budget adds up"+(g?" to about "+O(Math.round(g))+"/mo take-home":"")+". Make it your plan's target, then see if your pension can pay for it.",u="Set as my plan's target",p=async()=>{await applyBudgetToPlan(),updateNextStepBanner()}}if(!d){t.style.display="none";return}document.getElementById("nextStepText").innerHTML=d;const f=document.getElementById("nextStepBtn");f.textContent=u,f.onclick=p,t.style.display="flex"}catch{t.style.display="none"}};window.dismissNextStep=async function(){try{localStorage.setItem("nextStepDismissed:"+await Fo(),"1")}catch{}document.getElementById("nextStepBanner").style.display="none"};window.switchToTab=function(t){var e;(e=document.querySelector('.tab[data-tab="'+t+'"]'))==null||e.click()};window._ssIncomeShape="level";window._ssIncomeSteps=[];window.setIncomeShape=function(t){var e;if(window._ssIncomeShape=t,document.getElementById("shapeLevelBtn").classList.toggle("active",t==="level"),document.getElementById("shapeStepBtn").classList.toggle("active",t==="phases"),document.getElementById("incomeStepsEditor").style.display=t==="phases"?"block":"none",t==="phases"&&!window._ssIncomeSteps.length){const n=+((e=document.getElementById("ssBaseSalary"))==null?void 0:e.value)||4e4,s=+document.getElementById("shapeAgeNow").value||57;window._ssIncomeSteps=[{fromAge:s,amount:n}]}renderIncomeSteps(),document.getElementById("incomeShapeNote").textContent=t==="phases"?'Stepped income replaces the flat target (and any budget-derived schedule) when you save. The spending profile below should usually be "Level for life" — the steps ARE your decline.':""};window.renderIncomeSteps=function(){const t=document.getElementById("incomeStepsEditor");if(!t||window._ssIncomeShape!=="phases")return;const e=window._ssIncomeSteps;e.sort((n,s)=>(+n.fromAge||0)-(+s.fromAge||0)),t.innerHTML=e.map((n,s)=>'<div class="row-flex" style="margin-top:4px;"><span class="hint">'+(s===0?"From now (age":"From age")+'</span><input type="number" value="'+(n.fromAge??"")+'" min="40" max="100" style="width:74px;"'+(s===0?" disabled":"")+' oninput="updIncomeStep('+s+`,'fromAge',this.value)">`+(s===0?'<span class="hint">)</span>':"")+'<span class="hint">take</span><input type="number" value="'+(n.amount??"")+'" step="1000" style="width:110px;" oninput="updIncomeStep('+s+`,'amount',this.value)"><span class="hint">£/yr gross</span>`+(s>0?'<button type="button" class="risk-btn" title="Remove" onclick="rmIncomeStep('+s+')">✕</button>':"")+"</div>").join("")+'<button type="button" class="risk-btn" style="margin-top:6px;padding:4px 12px;font-size:12px;" onclick="addIncomeStep()">+ Add a step</button><p class="hint" style="margin:6px 0 0;">e.g. £60,000 until 72 → £50,000 until 80 → £40,000 after: three rows, ages 57 / 72 / 80.</p>',refreshStrategyCosts()};window.addIncomeStep=function(){const t=window._ssIncomeSteps[window._ssIncomeSteps.length-1]||{fromAge:57,amount:4e4};window._ssIncomeSteps.push({fromAge:(+t.fromAge||57)+10,amount:Math.max(0,(+t.amount||4e4)-1e4)}),renderIncomeSteps()};window.updIncomeStep=function(t,e,n){window._ssIncomeSteps[t]&&(window._ssIncomeSteps[t][e]=n===""?"":+n,refreshStrategyCosts())};window.rmIncomeStep=function(t){window._ssIncomeSteps.splice(t,1),renderIncomeSteps()};window.shapeAmountAtYear=function(t,e){var r;if(window._ssIncomeShape!=="phases"||!window._ssIncomeSteps.length)return e;const n=(+((r=document.getElementById("shapeAgeNow"))==null?void 0:r.value)||57)+t,s=window._ssIncomeSteps.filter(i=>Number.isFinite(+i.fromAge)&&+i.fromAge<=n&&Number.isFinite(+i.amount)).sort((i,o)=>+i.fromAge-+o.fromAge).pop();return s?+s.amount:e};function xp(t,e){return window._ssIncomeShape!=="phases"||!window._ssIncomeSteps.length?null:Array.from({length:(t||35)+1},(n,s)=>shapeAmountAtYear(s,e))}window.renderDecisionStrategyPanel=async function(){const t=document.getElementById("dsStrategyPanel");if(t)try{const e=await Cu(),n=await De();if(!e.id||e.id==="pots-and-valves"){t.style.display="none";return}const s={...n.strategyParams||{},...e.params||{}},r=new Date,i=Math.max(0,(r.getMonth()+1>=4?r.getFullYear():r.getFullYear()-1)-2026),o=Math.max(1,Math.round((r-new Date(2026,3,1))/(30.44*24*3600*1e3))),a=(n.spWeeklyAmount?n.spWeeklyAmount*52:n.statePension)||0;let c="";if(e.id==="ladder-and-ratchet"){const d=s.drawAnnual||n.baseSalary||0,u=s.ladderYears||15,p=Math.max(0,d-(i+1>10?a:0));c='<div class="settings-section" style="border-color:var(--accent);"><div class="section-title">Ladder &amp; Ratchet — this month</div><p style="font-size:14px;">Year '+(i+1)+" of your plan: <strong>"+O(Math.round(p))+"</strong> of income is paid by this year's maturing rung"+(i+1<=u?" (base ladder — bought and banked).":" (a ratcheted rung, if secured — check your history).")+(a&&i+1>10?" The State Pension tops it back up to "+O(d)+".":"")+'</p><div class="row-flex"><label class="hint" style="display:flex;flex-direction:column;gap:2px;">Equity sleeve value today (£)<input type="number" id="lrSleeveNow" style="width:150px;"></label><button type="button" class="risk-btn" style="align-self:flex-end;" onclick="checkLadderTrigger()">Check the trigger</button></div><div id="lrTriggerResult" style="margin-top:8px;"></div></div>'}if(e.id==="floor-and-flex"){const d=s.essentialsAnnual||0,u=Math.max(0,d-(i+1>10?a:0)),p=s.sleeveRate||.04;c='<div class="settings-section" style="border-color:var(--accent);"><div class="section-title">Floor &amp; Flex — this month</div><p style="font-size:14px;">The floor pays your essentials: <strong>'+O(Math.round(u))+"</strong>/yr from this year's rung"+(a&&i+1>10?" (+ State Pension to "+O(d)+")":"")+'. The bills never notice the market.</p><div class="row-flex"><label class="hint" style="display:flex;flex-direction:column;gap:2px;">Flex sleeve value today (£)<input type="number" id="ffSleeveNow" style="width:150px;"></label><button type="button" class="risk-btn" style="align-self:flex-end;" onclick="checkFlexDraw('+p+`)">This year's treats</button></div><div id="ffDrawResult" style="margin-top:8px;"></div></div>`}t.innerHTML=c,t.style.display=c?"block":"none",window._lrCtx={params:s,settings:n,tMonths:o,planYear:i}}catch{t.style.display="none"}};window.checkLadderTrigger=function(){const t=+document.getElementById("lrSleeveNow").value||0,e=document.getElementById("lrTriggerResult"),{params:n,settings:s,tMonths:r}=window._lrCtx||{};if(!t){e.innerHTML='<p class="hint">Enter your sleeve value first.</p>';return}const i={e:s.equityMin||0,b:s.bondMin||0,c:s.cashTarget||0,d:s.diversifierStart||0},o=(n.sippTotal||0)+(n.isaTotal||0)||i.e+i.b+i.c+i.d+(s.isaBalance||0),a=n.drawAnnual||s.baseSalary||0,c=(s.spWeeklyAmount?s.spWeeklyAmount*52:s.statePension)||0;let d=0;for(let E=1;E<=(n.ladderYears||15);E++)d+=Math.max(0,a-(E>10?c:0))*Math.pow(1.023,-E);const u=Math.max(1,o-d),p=n.bandThreshold||1.2,f=u*Math.pow(1.05,r/12),g=Math.max(0,t-f),v=(n.ladderYears||15)+1,y=Math.max(0,a-(v>10?c:0))*Math.pow(1.023,-(v-r/12));if(t>=p*f){const E=Math.floor(g/Math.max(1,y));e.innerHTML='<div class="alert alert-success"><strong>Trigger! Sleeve '+O(t)+" is above the band ("+O(Math.round(p*f))+").</strong> The surplus above the path ("+O(Math.round(g))+") could lock ≈ <strong>"+E+" more year"+(E===1?"":"s")+"</strong> of income — or it is "+O(Math.round(g))+" of spendable money this year. Your call; the order sheet is in Stress → Strategies.</div>"}else e.innerHTML='<div class="alert alert-info">No action: sleeve '+O(t)+" vs glide path "+O(Math.round(f))+" (band at "+O(Math.round(p*f))+"). "+(g>0?"Spendable surplus above the path: "+O(Math.round(g))+".":"Below the path — the plan expected this in some histories; the banked rungs still pay.")+"</div>"};window.checkFlexDraw=function(t){const e=+document.getElementById("ffSleeveNow").value||0,n=document.getElementById("ffDrawResult");if(!e){n.innerHTML='<p class="hint">Enter your sleeve value first.</p>';return}n.innerHTML=`<div class="alert alert-info">This plan-year's treats: <strong>`+O(Math.round(e*t))+"</strong> ("+(t*100).toFixed(1)+"% of "+O(e)+"), i.e. "+O(Math.round(e*t/12))+"/mo. Reset again next April at the same rate on the new value.</div>"};const SS={"pots-and-valves":"Your allocation below IS this strategy: the pots, their floors and the risk level are its dials. Rules decide which pot pays each month.","ladder-and-ratchet":"Buys your income up front as an index-linked gilt ladder; the REST rides in the equity sleeve (the allocation below applies to the sleeve). Booms lock more years on.","floor-and-flex":"Buys the BILLS by contract to a chosen age; everything else is the flex sleeve paying the treats (the allocation below applies to the sleeve)."};window._ssStrategy="pots-and-valves";function xS(){return["ssModeRisk","ssRecoveryBuffer","ssHodlEnabled","ssAccessMethod"].map(e=>document.getElementById(e)).filter(Boolean).map(e=>e.closest(".settings-section")).filter((e,n,s)=>e&&s.indexOf(e)===n)}window.pickStrategy=function(t){var s;window._ssStrategy=t,document.querySelectorAll("#ssStrategyPick .risk-btn").forEach(r=>r.classList.toggle("active",r.dataset.strat===t)),document.getElementById("ssStrategyBlurb").textContent=SS[t]||"";const e=t==="ladder-and-ratchet"||t==="floor-and-flex";document.getElementById("ssLrParams").style.display=t==="ladder-and-ratchet"?"block":"none",document.getElementById("ssFfParams").style.display=t==="floor-and-flex"?"block":"none";for(const r of xS())r.style.display=e?"none":"";const n=document.getElementById("stratCopyOffer");if(n&&(n.style.display=e?"block":"none"),e)try{const r=readAlloc("ss"),i=(r.equityMin||0)+(r.bondMin||0)+(r.cashTarget||0)+(r.diversifierStart||0),o=+((s=document.getElementById("ssIsaBalance"))==null?void 0:s.value)||0;for(const[a,c]of t==="ladder-and-ratchet"?[["stratSipp","stratIsa"]]:[["stratSippFf","stratIsaFf"]]){const d=document.getElementById(a),u=document.getElementById(c);d&&!d.value&&i&&(d.value=i),u&&!u.value&&o&&(u.value=o)}}catch{}refreshStrategyCosts()};window.tryStrategyInCopy=async function(){var n;const t=window._ssStrategy,e={"ladder-and-ratchet":"Ladder","floor-and-flex":"Floor & Flex"};try{const s=await _r(),r=await Fo(),i=s.find(d=>d.id===r),o=((((n=i==null?void 0:i.planDetails)==null?void 0:n.name)||"Plan")+" — "+(e[t]||"copy")).slice(0,40);if(!await appConfirm('Create "'+o+`" as a copy of this plan and switch to it?

Your current plan stays exactly as it is. The copy starts on `+(e[t]||t)+" with your pot totals carried over.",{okLabel:"Create the copy",danger:!1}))return;ct("Copying plan…");const c=await L0(r,o);await D0((c==null?void 0:c.id)||c),await ku(t,Ga()),await yi({strategyId:t,strategyParams:Ga()}),showToast(o+" created — this copy models "+(e[t]||t)+"; your original plan is untouched.","success",6e3),location.reload()}catch(s){showToast("Could not create the copy: "+s.message,"error")}finally{dt()}};window.refreshStrategyCosts=function(){var t,e,n,s,r,i,o;try{const a=readAlloc("ss"),c=(a.equityMin||0)+(a.bondMin||0)+(a.cashTarget||0)+(a.diversifierStart||0)+(+((t=document.getElementById("ssIsaBalance"))==null?void 0:t.value)||0),u=(+((e=document.getElementById("ssSpWeeklyAmount"))==null?void 0:e.value)||0)*52,p=+((n=document.getElementById("ssBaseSalary"))==null?void 0:n.value)||0;if(window._ssStrategy==="ladder-and-ratchet"){const f=+document.getElementById("lrLadderYears").value||15,g=+document.getElementById("lrDraw").value||p;!document.getElementById("lrDraw").value&&p&&(document.getElementById("lrDraw").value=p);const v=+((s=document.getElementById("stratSipp"))==null?void 0:s.value)||c,y=+((r=document.getElementById("stratIsa"))==null?void 0:r.value)||0,E=v+y,C=R=>Math.max(0,shapeAmountAtYear(R-1,g)-(R>10?u:0));let k=0;for(let R=1;R<=f;R++)k+=C(R)*Math.pow(1.023,-R);const P=E-k;document.getElementById("lrCostLine").innerHTML="Base ladder: <strong>"+O(Math.round(k))+"</strong> of your "+O(Math.round(E))+" → equity sleeve <strong>"+O(Math.round(Math.max(0,P)))+"</strong>. "+(P>0?"":'<span style="color:var(--danger);">Not affordable at this income/years.</span>');try{const R=Kc({rungYears:Array.from({length:f},(D,I)=>I+1),drawForYear:C,startYear:new Date().getFullYear(),realYield:.023});let B='<div class="table-scroll-container"><table><thead><tr><th>Year</th><th>Index-linked gilt</th><th>Income (£/yr)</th><th>Est. cost</th></tr></thead><tbody>';for(const D of R.rows)B+="<tr><td>"+D.calYear+"</td><td>"+D.gilts.join(" + ")+(D.mode==="bracket"?' <span class="hint">(gap year)</span>':"")+"</td><td>"+O(D.face)+"</td><td>"+O(D.estCost)+"</td></tr>";B+="</tbody></table></div>",R.stale&&(B+='<p class="hint" style="color:var(--warning);">Gilt list is a bundled snapshot ('+R.generated_at.slice(0,10)+"); costs use the flat 2.3% real curve.</p>"),document.getElementById("lrGiltTable").innerHTML=B}catch{document.getElementById("lrGiltTable").innerHTML=""}}if(window._ssStrategy==="floor-and-flex"){const f=+document.getElementById("ffEssentials").value||Math.round(p*.55);!document.getElementById("ffEssentials").value&&p&&(document.getElementById("ffEssentials").value=Math.round(p*.55));const g=+document.getElementById("ffHorizon").value||92,v=Math.max(1,g-57),y=+((i=document.getElementById("stratSippFf"))==null?void 0:i.value)||c,E=+((o=document.getElementById("stratIsaFf"))==null?void 0:o.value)||0,C=y+E,k=D=>Math.max(0,f-(D>10?u:0));let P=0;for(let D=1;D<=v;D++)P+=k(D)*Math.pow(1.023,-D);const R=C-P,B=(+document.getElementById("ffRate").value||4)/100;document.getElementById("ffCostLine").innerHTML="Floor to "+g+": <strong>"+O(Math.round(P))+"</strong> of your "+O(Math.round(C))+" → flex sleeve <strong>"+O(Math.round(Math.max(0,R)))+"</strong>, year-1 treats ≈ <strong>"+O(Math.round(Math.max(0,R)*B))+"</strong>. Every £1k/yr of essentials ≈ £24k of floor. "+(R>0?"":'<span style="color:var(--danger);">Not affordable at this essentials level.</span>');try{const D=Math.max(1,Math.floor(v/12)),I=[];for(let T=1;T<=v;T+=T<3?1:D)I.push(T);const w=Kc({rungYears:I,drawForYear:k,startYear:new Date().getFullYear(),realYield:.023});let S='<div class="table-scroll-container"><table><thead><tr><th>Year</th><th>Index-linked gilt</th><th>Essentials (£/yr)</th><th>Est. cost</th></tr></thead><tbody>';for(const T of w.rows)S+="<tr><td>"+T.calYear+"</td><td>"+T.gilts.join(" + ")+(T.mode==="bracket"?' <span class="hint">(gap year)</span>':"")+"</td><td>"+O(T.face)+"</td><td>"+O(T.estCost)+"</td></tr>";S+='</tbody></table></div><p class="hint">Sampled years shown; every year to '+g+" is bought.</p>",document.getElementById("ffGiltTable").innerHTML=S}catch{document.getElementById("ffGiltTable").innerHTML=""}}}catch{}};function Ga(){return window._ssStrategy==="ladder-and-ratchet"?{ladderYears:+document.getElementById("lrLadderYears").value||15,drawAnnual:+document.getElementById("lrDraw").value||0,triggerMode:document.getElementById("lrTriggerMode").value,bandThreshold:+document.getElementById("lrBand").value||1.2,sippTotal:+document.getElementById("stratSipp").value||0,isaTotal:+document.getElementById("stratIsa").value||0}:window._ssStrategy==="floor-and-flex"?{essentialsAnnual:+document.getElementById("ffEssentials").value||0,horizonAge:+document.getElementById("ffHorizon").value||92,sleeveRate:(+document.getElementById("ffRate").value||4)/100,ratchet:document.getElementById("ffRatchet").value,sippTotal:+document.getElementById("stratSippFf").value||0,isaTotal:+document.getElementById("stratIsaFf").value||0}:{}}window.applyStrategyToUI=function(t,e){pickStrategy(t||"pots-and-valves"),t==="ladder-and-ratchet"&&e&&(e.sippTotal&&(document.getElementById("stratSipp").value=e.sippTotal),e.isaTotal&&(document.getElementById("stratIsa").value=e.isaTotal),e.ladderYears&&(document.getElementById("lrLadderYears").value=e.ladderYears),e.drawAnnual&&(document.getElementById("lrDraw").value=e.drawAnnual),e.triggerMode&&(document.getElementById("lrTriggerMode").value=e.triggerMode),e.bandThreshold&&(document.getElementById("lrBand").value=e.bandThreshold)),t==="floor-and-flex"&&e&&(e.sippTotal&&(document.getElementById("stratSippFf").value=e.sippTotal),e.isaTotal&&(document.getElementById("stratIsaFf").value=e.isaTotal),e.essentialsAnnual&&(document.getElementById("ffEssentials").value=e.essentialsAnnual),e.horizonAge&&(document.getElementById("ffHorizon").value=e.horizonAge),e.sleeveRate&&(document.getElementById("ffRate").value=e.sleeveRate*100),e.ratchet&&(document.getElementById("ffRatchet").value=e.ratchet)),refreshStrategyCosts()};const AS={"pots-and-valves":{shines:["You want one flexible pot and monthly guidance","Markets are kind more often than not","You value upside over certainty"],story:["Your money sits in pots, each with a floor.","Each month, the pot that can best afford it pays you.","In bad markets, the safe pots take over.","In good markets, the pots refill and floors are restored."]},"ladder-and-ratchet":{shines:["You want your income bolted on for years ahead","You would sleep better with dates, not odds","You still want booms to buy MORE certainty"],story:["Your income for the years ahead is bought and banked.","The rest rides the market, aiming above a line.","Rise above the line, and more years get locked.","Never boom? The banked years still pay regardless."]},"floor-and-flex":{shines:["Your essentials are non-negotiable; treats can flex","You can name your bills number honestly","You want zero chance the basics fail"],story:["The bills are bought up front, to an age you choose.","A second pot pays for everything fun.","Good years, bigger treats. Bad years, smaller ones.","The bills never notice either way."]}};window.renderStrategyCards=async function(){const t=document.getElementById("strategyCards");if(!t)return;const e=await Cu();t.innerHTML=E_().map(n=>{const s=n.describe(),r=AS[n.id]||{shines:[],story:[]},i=e.id===n.id;return'<div class="settings-section" style="border-color:'+(i?"var(--accent)":"var(--border)")+';"><div class="section-title">'+s.name+(i?' <span style="color:var(--accent);font-size:12px;">— locked for this plan</span>':"")+'</div><p style="font-size:14px;margin:0 0 6px;"><strong>'+s.promise+'</strong></p><ol style="font-size:13px;margin:6px 0 6px 18px;padding:0;">'+r.story.map(o=>"<li>"+o+"</li>").join("")+'</ol><p class="hint" style="margin:6px 0;">When it shines: '+r.shines.join(" · ")+'</p><p style="font-size:13px;color:var(--warning);margin:6px 0;">How it fails: '+s.failure+'</p><details><summary class="hint" style="cursor:pointer;">Under the bonnet</summary><p class="hint" style="margin:6px 0 0;">'+s.components.join(" · ")+(s.sensitivity?" · "+s.sensitivity:"")+"</p></details>"+(i?"":`<button type="button" class="risk-btn" style="margin-top:8px;" onclick="lockStrategy('`+n.id+`')">Choose &amp; lock `+s.name+"</button>")+"</div>"}).join("")};window.orientStrategies=function(){const t=document.getElementById("orientCertainty").value,e=document.getElementById("orientLevel").value,n=document.getElementById("orientHands").value,s={"pots-and-valves":0,"ladder-and-ratchet":0,"floor-and-flex":0};t==="certainty"&&(s["ladder-and-ratchet"]+=2,s["floor-and-flex"]+=1),t==="upside"&&(s["pots-and-valves"]+=2),e==="level"&&(s["ladder-and-ratchet"]+=2),e==="flex"&&(s["floor-and-flex"]+=2,s["pots-and-valves"]+=1),n==="forget"&&(s["floor-and-flex"]+=1,s["ladder-and-ratchet"]+=1),n==="hands"&&(s["pots-and-valves"]+=2);const r=Object.entries(s).sort((o,a)=>a[1]-o[1]),i={"pots-and-valves":"Pots & Valves","ladder-and-ratchet":"Ladder & Ratchet","floor-and-flex":"Floor & Flex"};document.getElementById("orientResult").textContent="Closest to what you said you wanted: start with "+i[r[0][0]]+", then read "+i[r[1][0]]+". A starting point, not advice — read all three."};window.runStrategyCompare=async function(){const t=document.getElementById("compareResults");t.innerHTML='<p style="font-size:13px;">Running all three strategies over every historical window…</p>',await new Promise(e=>setTimeout(e,30));try{const e=await De(),n=ns({},e),s=(n.equityStart||0)+(n.bondStart||0)+(n.cashStart||0)+(n.diversifierStart||0),r=e.baseSalary||0,i=+document.getElementById("cmpEssentials").value||Math.round(r*.55),o=e.spWeeklyAmount||0,a=o?o*52:e.statePension||0,c=n.spStartYear??e.statePensionYear??99,d={pot:s,isa:n.isaBalance||0,targetAnnual:r,essentialsAnnual:i,durationYears:Math.min(e.duration||35,35),startAge:57,spAnnual:a,spStartYear:c,stride:2,pnvCfg:{...n,isaReturn:0,startAge:57}},u=PI(d),p={"pots-and-valves":"Pots & Valves","ladder-and-ratchet":"Ladder & Ratchet","floor-and-flex":"Floor & Flex"},f=Object.keys(u.strategies);let g='<div class="table-scroll-container"><table><thead><tr><th></th>'+f.map(E=>"<th>"+p[E]+"</th>").join("")+"</tr></thead><tbody>";const v=(E,C)=>"<tr><td>"+E+"</td>"+f.map(k=>"<td>"+C(u.strategies[k].table)+"</td>").join("")+"</tr>";if(g+=v("Worst 12 months you’d have lived",E=>O(Math.round(E.worst12Min))+' <span class="hint">(median '+O(Math.round(E.worst12Median))+")</span>"),g+=v("Income guaranteed to age",E=>E.guaranteedToAge),g+=v("Chance of running out",E=>E.ruinPct.toFixed(1)+"%"),g+=v("Typically left at the horizon",E=>O(Math.round(E.terminalMedian))),g+="</tbody></table></div>",u.configs.lrAffordable||(g+='<p class="hint" style="color:var(--warning);">Ladder &amp; Ratchet: your pot cannot fund the base ladder at this target — not affordable as configured.</p>'),u.configs.ffAffordable||(g+='<p class="hint" style="color:var(--warning);">Floor &amp; Flex: your pot cannot fund the essentials floor to the horizon — not affordable as configured.</p>'),g+='<p class="hint" style="margin-top:6px;">All three ran the SAME historical windows (Shiller 1871–2023, real terms) and the same income need. Pots &amp; Valves runs your actual plan settings; Ladder &amp; Ratchet banks '+(u.configs.lr?u.configs.lr.ladderYears:"—")+" years up front (cost "+O(Math.round(u.configs.baseLadderCost||0))+"); Floor &amp; Flex buys the essentials floor ("+O(Math.round(u.configs.ffFloorCost||0))+") and flexes the rest at 4%.</p>",u.configs.lr){const E=Array.from({length:u.configs.lr.ladderYears},(k,P)=>P+1),C=Kc({rungYears:E,drawForYear:u.configs.lr.drawNetOfSp,startYear:new Date().getFullYear(),realYield:.023});g+='<details style="margin-top:10px;"><summary class="hint" style="cursor:pointer;">Order sheet — the base ladder as real gilts (t=0)</summary>',C.stale&&(g+='<p class="hint" style="color:var(--warning);">Linker data is a bundled snapshot ('+C.generated_at.slice(0,10)+") — costs use the flat curve. Admin can refresh via CSV import.</p>"),g+='<div class="table-scroll-container"><table><thead><tr><th>Year</th><th>Gilt(s)</th><th>Face (£/yr)</th><th>Est. cost</th></tr></thead><tbody>';for(const k of C.rows)g+="<tr><td>"+k.calYear+"</td><td>"+k.gilts.join(" + ")+(k.mode==="bracket"?' <span class="hint">(gap year — bracketed)</span>':"")+"</td><td>"+O(k.face)+"</td><td>"+O(k.estCost)+"</td></tr>";g+='</tbody></table></div><p class="hint">'+C.priced+"</p></details>"}g+='<div class="section-title" style="margin-top:14px;font-size:13px;">Two real decades, same money</div>';const y=(E,C)=>{const k=RI(d,E,1),P=R=>{const B=k[R];return B?R==="pots-and-valves"?B.failed?"ran out at "+Math.round(B.failAge):"lasted · "+O(Math.round(B.terminal))+" left":R==="ladder-and-ratchet"?(B.secured?"ratcheted +"+B.secured+" yrs":"never triggered")+(B.survived===!1?" · sleeve failed":""):"worst treats "+O(Math.round(B.worstYearFlex))+"/yr":"—"};return"<tr><td>"+C+"</td>"+f.map(R=>"<td>"+P(R)+"</td>").join("")+"</tr>"};g+='<div class="table-scroll-container"><table><tbody>'+y(1966,"Start 1966 (the long bust)")+y(1985,"Start 1985 (the long boom)")+"</tbody></table></div>",t.innerHTML=g}catch(e){console.error("Compare error:",e),t.innerHTML='<div class="alert alert-warning">Could not run the comparison: '+e.message+"</div>"}};window.lockStrategy=async function(t){const n=ls(t).describe();if(await appConfirm("Lock "+n.name+` for this plan?

How it fails: `+n.failure+`

The choice is recorded with today’s engine version. To try another strategy later, duplicate the plan — comparisons never change a locked plan.`,{okLabel:"Lock it in",danger:!1}))try{await ku(t,{}),showToast(n.name+" locked for this plan.","success"),renderStrategyCards(),updateStrategyNote()}catch(r){showToast("Could not lock: "+r.message,"error")}};window.updateStrategyNote=async function(){const t=document.getElementById("mcStrategyNote");if(!t)return;const e=document.getElementById("strategiesNewDot");e&&!localStorage.getItem("strategiesSeen")&&(e.style.display="inline-block");try{const n=await Cu();if(!localStorage.getItem("strategiesSeen")&&(!n.id||n.id==="pots-and-valves")){t.innerHTML=`<div class="alert alert-info"><strong>New:</strong> compare three ways to turn your pot into an income — Pots &amp; Valves (this simulator), Ladder &amp; Ratchet, and Floor &amp; Flex — on your own numbers over 150 years of markets, and lock one to your plan. <button type="button" class="risk-btn" style="padding:4px 12px;margin-left:8px;" onclick="document.getElementById('strategiesSubTab').click()">Open Strategies</button></div>`,t.style.display="block";return}if(n.id&&n.id!=="pots-and-valves"){const s=ls(n.id).describe();t.innerHTML='<div class="alert alert-info">This plan is locked to <strong>'+s.name+"</strong>. The Monte Carlo below simulates the Pots &amp; Valves engine — your strategy’s own numbers are in the <strong>Strategies</strong> tab.</div>",t.style.display="block"}else t.style.display="none"}catch{t.style.display="none"}};window.loadStrategiesUI=async function(){renderStrategyCards();const t=await De(),e=document.getElementById("cmpEssentials");e&&!e.value&&(e.value=Math.round((t.baseSalary||4e4)*.55))};window.renderExtraIncomes=function(t){const e=document.getElementById("ssExtraIncomes");if(!e)return;const n=window._ssExtraIncomes||[],s=window._ssWindfalls||[];let r="";n.forEach((i,o)=>{r+='<div class="row-flex" style="margin-top:6px;"><input type="text" placeholder="e.g. Part-time work" value="'+Ie(i.label||"")+'" oninput="updExtraIncome('+o+`,'label',this.value)" style="flex:1 1 150px; min-width:120px;"><span class="hint">£/yr</span><input type="number" value="`+(i.annual??"")+'" oninput="updExtraIncome('+o+`,'annual',this.value)" style="width:100px;"><span class="hint">years</span><input type="number" placeholder="0" min="0" value="`+(i.startYear??"")+'" oninput="updExtraIncome('+o+`,'startYear',this.value)" style="width:64px;"><span class="hint">to</span><input type="number" placeholder="∞" min="0" value="`+(i.endYear??"")+'" oninput="updExtraIncome('+o+`,'endYear',this.value)" style="width:64px;"><select onchange="updExtraIncome(`+o+`,'indexation',this.value)" style="width:140px;"><option value="lpi5"`+((i.indexation||"lpi5")==="lpi5"?" selected":"")+'>CPI capped 5%</option><option value="cpi"'+(i.indexation==="cpi"?" selected":"")+'>Full CPI</option><option value="level"'+(i.indexation==="level"?" selected":"")+'>Level</option></select><button type="button" class="risk-btn" title="Remove" onclick="rmExtraIncome('+o+')">✕</button></div>'}),s.forEach((i,o)=>{r+='<div class="row-flex" style="margin-top:6px;"><input type="text" placeholder="e.g. Inheritance" value="'+Ie(i.label||"")+'" oninput="updWindfall('+o+`,'label',this.value)" style="flex:1 1 150px; min-width:120px;"><span class="hint">£ once</span><input type="number" value="`+(i.amount??"")+'" oninput="updWindfall('+o+`,'amount',this.value)" style="width:110px;"><span class="hint">in year</span><input type="number" min="0" value="`+(i.year??"")+'" oninput="updWindfall('+o+`,'year',this.value)" style="width:64px;"><label class="hint" style="display:flex;align-items:center;gap:4px;"><input type="checkbox" style="width:auto;"`+(i.toIsa?" checked":"")+' onchange="updWindfall('+o+`,'toIsa',this.checked)">to ISA</label><button type="button" class="risk-btn" title="Remove" onclick="rmWindfall(`+o+')">✕</button></div>'}),e.innerHTML=r||'<p class="hint" style="margin:4px 0 0;">None yet — everything comes from the pots, State Pension and DB above.</p>'};window.addExtraIncome=function(){(window._ssExtraIncomes=window._ssExtraIncomes||[]).push({indexation:"lpi5"}),renderExtraIncomes()};window.addWindfall=function(){(window._ssWindfalls=window._ssWindfalls||[]).push({}),renderExtraIncomes()};window.updExtraIncome=function(t,e,n){var s;(s=window._ssExtraIncomes)!=null&&s[t]&&(window._ssExtraIncomes[t][e]=e==="label"||e==="indexation"?n:n===""?null:+n)};window.rmExtraIncome=function(t){window._ssExtraIncomes.splice(t,1),renderExtraIncomes()};window.updWindfall=function(t,e,n){var s;(s=window._ssWindfalls)!=null&&s[t]&&(window._ssWindfalls[t][e]=e==="label"?n:e==="toIsa"?!!n:n===""?null:+n)};window.rmWindfall=function(t){window._ssWindfalls.splice(t,1),renderExtraIncomes()};window.loadHouseholdUI=async function(){var t;try{const[e,n,s]=await Promise.all([_r(),Fo(),Q_()]),r=e.find(o=>o.id===n);document.getElementById("hhOwnPlan").value=((t=r==null?void 0:r.planDetails)==null?void 0:t.name)||"Current plan";const i=document.getElementById("hhPartnerSelect");i.innerHTML='<option value="">— choose a plan —</option>'+e.filter(o=>o.id!==n).map(o=>{var a;return'<option value="'+o.id+'"'+(o.id===s?" selected":"")+">"+(((a=o.planDetails)==null?void 0:a.name)||o.id)+"</option>"}).join("")}catch(e){console.error("Household load error:",e)}};window.savePartnerSelection=async function(){try{await J_(document.getElementById("hhPartnerSelect").value||null)}catch(t){showToast("Could not save partner selection: "+t.message,"error")}};window.runHouseholdCheck=async function(){var n,s;const t=document.getElementById("hhResults"),e=document.getElementById("hhPartnerSelect").value;if(!e){showToast("Choose your partner's plan first","warning");return}t.innerHTML='<p style="font-size:13px;">Running both plans through the same 1,000 possible futures…</p>',await new Promise(r=>setTimeout(r,30));try{const[r,i]=await Promise.all([_r(),De()]),o=r.find(I=>I.id===e),a=(n=o==null?void 0:o.stressTool)==null?void 0:n.settings;if(!a||!a.configured){t.innerHTML='<div class="alert alert-warning">The partner plan has no saved Stress Tester settings yet — switch to that plan, fill in its settings, then come back here.</div>';return}const c=ns({},i),d=ns({},a),u=II(c,d,1e3),p=document.getElementById("hhOwnPlan").value,f=((s=o.planDetails)==null?void 0:s.name)||"Partner",g=new Date().getFullYear(),v=I=>g+I,y=I=>(I*100).toFixed(0)+"%";let E='<div class="settings-section"><div class="section-title">The verdict</div>';const C=u.jointSuccess>=.85?"alert-success":u.jointSuccess>=.7?"alert-warning":"alert-danger",k=u.jointSuccess>=.85?"Looking solid: in "+y(u.jointSuccess)+" of 1,000 possible market futures, the money lasted the whole way for <strong>both</strong> of you.":u.jointSuccess>=.7?"Borderline: the money lasted for both of you in only "+y(u.jointSuccess)+" of 1,000 possible market futures.":"At risk: the money lasted for both of you in just "+y(u.jointSuccess)+" of 1,000 possible market futures.";E+='<div class="alert '+C+'" style="font-size:15px;">'+k+"</div>",E+="<table><tbody><tr><td>"+p+" on their own</td><td><strong>"+y(u.successA)+"</strong></td></tr><tr><td>"+f+" on their own</td><td><strong>"+y(u.successB)+"</strong></td></tr><tr><td>Both together</td><td><strong>"+y(u.jointSuccess)+"</strong></td></tr></tbody></table>",E+=`<p style="font-size:12px;color:var(--text-muted);margin-top:6px;">The together number can't be better than the weaker plan — and both plans face the <em>same</em> markets, so a bad decade hits you both at once. That's why this check runs you both through identical futures instead of treating your plans as unrelated.</p></div>`;const P=SI(i,a);E+='<div class="settings-section"><div class="section-title">Where the money comes from, year by year</div>';const R=P.filter(I=>I.bridge).length;R>0&&(E+='<div class="alert alert-info">Until <strong>'+v(R)+"</strong> at least one of you is still waiting for their State Pension — those are the years (marked 🌉) when your pots do the most work. This is usually where a couple's plan is tightest.</div>"),E+='<div style="overflow-x:auto;"><table><thead><tr><th>Year</th><th>'+p+" needs</th><th>"+f+" needs</th><th>State Pensions</th><th>Other guaranteed</th><th>From your pots</th></tr></thead><tbody>";const B=new Set([0]);P.forEach((I,w)=>{w>0&&(I.spA!==P[w-1].spA||I.spB!==P[w-1].spB||I.db!==P[w-1].db||I.needB===0&&P[w-1].needB>0||I.needA===0&&P[w-1].needA>0)&&B.add(w)});for(let I=0;I<P.length;I+=5)B.add(I);[...B].sort((I,w)=>I-w).forEach(I=>{const w=P[I];w&&(E+="<tr><td>"+v(w.year)+(w.bridge?" 🌉":"")+"</td><td>"+O(Math.round(w.needA))+"</td><td>"+O(Math.round(w.needB))+"</td><td>"+O(Math.round(w.spA+w.spB))+"</td><td>"+O(Math.round(w.db+w.other))+"</td><td><strong>"+O(Math.round(w.drawNeed))+"</strong></td></tr>")}),E+=`</tbody></table></div><p style="font-size:11px;color:var(--text-muted);margin-top:6px;">Today's money, per year. Rows shown where something changes (a State Pension starts, a plan ends) plus every 5th year. The last column is what your investments must provide after all guaranteed income.</p></div>`,E+=`<div class="settings-section"><div class="section-title">What you'd have left, combined <span style="font-weight:normal;font-size:12px;color:var(--text-muted);">(both pots + ISAs, today's money)</span></div>`,E+='<div style="overflow-x:auto;"><table><thead><tr><th>Year</th><th>If markets are poor</th><th>Typical</th><th>If markets are strong</th></tr></thead><tbody>';for(let I=0;I<u.potFan.length;I+=5){const w=u.potFan[I];E+="<tr><td>"+v(w.year)+"</td><td>"+O(Math.round(w.p10))+"</td><td>"+O(Math.round(w.p50))+"</td><td>"+O(Math.round(w.p90))+"</td></tr>"}if(E+='</tbody></table></div><p style="font-size:11px;color:var(--text-muted);margin-top:6px;">"Poor" = worse than 9 in 10 simulated futures; "strong" = better than 9 in 10.</p></div>',u.jointSuccess<.85){const I=u.successA<=u.successB?p:f,w=Math.min(u.successA,u.successB);E+='<div class="settings-section"><div class="section-title">What to do about it</div><p style="font-size:13px;">The weaker side is <strong>'+I+"</strong> ("+y(w)+" on its own). Open that plan in the Stress Tester and try: a slightly lower spending target, retiring a little later, the bond tent, or checking whether the budget split between you reflects who can actually fund what. Then come back and re-run this check.</p></div>"}const D=AI(i,a,p,f);D.message&&(E+='<div class="settings-section"><div class="section-title">A tax thought</div><div class="alert alert-info">💡 '+D.message+" You choose who funds what — this tool just shows the sums, assuming each plan's ISA bridge and access method as configured. (Adjust the budget's who-pays split, then re-run.)</div></div>"),E+=`<div class="settings-section"><div class="section-title">What if one of you dies?</div><p style="font-size:13px;">The hard question most tools skip. The survivor keeps their own pensions, inherits the other's remaining pots (pensions pass tax-free before 75), loses one State Pension, and typically needs about 70% of the joint spending.</p><div class="row-flex" style="font-size:13px;"><label class="hint" style="display:flex;flex-direction:column;gap:2px;">Who dies<select id="hhWhoDies" style="min-width:150px;"><option value="A">`+p+'</option><option value="B">'+f+'</option></select></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">In year<input type="number" id="hhDeathYear" value="10" min="1" max="40" style="width:80px;"></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">Survivor spends (% of joint)<input type="number" id="hhSurvivorPct" value="70" min="40" max="100" style="width:80px;"></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">DB survivor %<input type="number" id="hhDbSurvivorPct" value="50" min="0" max="100" style="width:80px;"></label><button type="button" class="risk-btn" style="padding:8px 14px;align-self:flex-end;" onclick="runSurvivorUI()">Run survivor check</button></div><div id="hhSurvivorResult" style="margin-top:8px;"></div></div>',E+='<div class="settings-section"><div class="section-title">What if one of you needs care?</div><p style="font-size:13px;">Nursing care runs roughly £80–100k a year. This adds the full cost on top of normal spending (deliberately cautious) and re-runs both plans. It models the cost only — never local-authority means-testing.</p><div class="row-flex" style="font-size:13px;"><label class="hint" style="display:flex;flex-direction:column;gap:2px;">Who needs care<select id="hhCareWho" style="min-width:150px;"><option value="A">'+p+'</option><option value="B">'+f+'</option></select></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">From year<input type="number" id="hhCareStart" value="15" min="0" max="40" style="width:80px;"></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">For (years)<input type="number" id="hhCareYears" value="3" min="1" max="15" style="width:80px;"></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">Cost (£/yr, today)<input type="number" id="hhCareCost" value="90000" step="5000" style="width:110px;"></label><button type="button" class="risk-btn" style="padding:8px 14px;align-self:flex-end;" onclick="runCareUI()">Run care check</button></div><div id="hhCareResult" style="margin-top:8px;"></div></div>',window._hhLast={cfgA:c,cfgB:d,ownSettings:i,partnerSettings:a,ownName:p,pName:f},t.innerHTML=E}catch(r){console.error("Household check error:",r),t.innerHTML='<div class="alert alert-warning">Could not run the household check: '+r.message+"</div>"}};window.runSurvivorUI=async function(){const t=document.getElementById("hhSurvivorResult"),e=window._hhLast;if(e){t.innerHTML=`<p style="font-size:13px;">Running the survivor's modified plan…</p>`,await new Promise(n=>setTimeout(n,30));try{const n=document.getElementById("hhWhoDies").value,s=+document.getElementById("hhDeathYear").value||10,r=(+document.getElementById("hhSurvivorPct").value||70)/100,i=(+document.getElementById("hhDbSurvivorPct").value||0)/100,o=n==="A"?{cfg:e.cfgB,set:e.partnerSettings,name:e.pName,dCfg:e.cfgA,dSet:e.ownSettings,dName:e.ownName}:{cfg:e.cfgA,set:e.ownSettings,name:e.ownName,dCfg:e.cfgB,dSet:e.partnerSettings,dName:e.pName},a=xI({survivorCfg:o.cfg,survivorSettings:o.set,deceasedCfg:o.dCfg,deceasedSettings:o.dSet,deathYear:s,spendFraction:r,dbSurvivorPct:i,runs:500}),c=a.survivorSuccess>=.85?"alert-success":a.survivorSuccess>=.7?"alert-warning":"alert-danger";t.innerHTML='<div class="alert '+c+'">If '+o.dName+" dies in year "+s+": <strong>"+o.name+"'s plan still works in "+(a.survivorSuccess*100).toFixed(0)+"%</strong> of 500 futures — inheriting about "+O(Math.round(a.inheritedPots+a.inheritedIsa))+" (median remaining pots), spending "+O(Math.round(a.survivorAnnualAfter))+'/yr from then on.</div><p style="font-size:11px;color:var(--text-muted);">A stress check, not advice. Simplifications: pensions assumed inherited tax-free (death before 75), ISA passed via the spouse allowance, median inheritance from '+o.dName+"'s own simulations.</p>"}catch(n){t.innerHTML='<div class="alert alert-warning">Survivor check failed: '+n.message+"</div>"}}};window.runCareUI=async function(){const t=document.getElementById("hhCareResult"),e=window._hhLast;if(e){t.innerHTML='<p style="font-size:13px;">Re-running both plans with the care years included…</p>',await new Promise(n=>setTimeout(n,30));try{const n=document.getElementById("hhCareWho").value,s=+document.getElementById("hhCareStart").value||15,r=+document.getElementById("hhCareYears").value||3,i=+document.getElementById("hhCareCost").value||9e4,o=kI({cfgA:e.cfgA,cfgB:e.cfgB,setA:e.ownSettings,setB:e.partnerSettings,who:n,startYear:s,years:r,annualCost:i,runs:500}),a=n==="A"?e.ownName:e.pName,c=o.careJoint>=.85?"alert-success":o.careJoint>=.7?"alert-warning":"alert-danger";t.innerHTML='<div class="alert '+c+'">With '+a+" needing care from year "+s+" for "+r+" years ("+O(o.totalCareCost)+" total in today's money): the money lasts for both of you in <strong>"+(o.careJoint*100).toFixed(0)+"%</strong> of 500 futures — versus "+(o.baselineJoint*100).toFixed(0)+'% without care.</div><p class="hint">A stress check, not advice. Cost added in full on top of normal spending; no means-testing modelled.</p>'}catch(n){t.innerHTML='<div class="alert alert-warning">Care check failed: '+n.message+"</div>"}}};window.createPartnerPlan=async function(){const t=(document.getElementById("hhNewPlanName").value||"").trim();if(!t){showToast("Give the plan a name first (e.g. their first name)","warning");return}try{ct("Creating "+t+"…"),await B0(t,"Partner plan (household)",["stress","decision"],{},!0),showToast(t+" created — fill in their Stress settings, then come back to Household and pick them.","success",6e3),location.reload()}catch(e){showToast("Could not create the plan: "+e.message,"error")}finally{dt()}};function Qu(){return{currentAge:+document.getElementById("acAge").value||0,retirementAge:+document.getElementById("acRetireAge").value||0,salary:+document.getElementById("acSalary").value||0,potNow:+document.getElementById("acPotNow").value||0,netMonthly:+document.getElementById("acNetMonthly").value||0,schemeType:document.getElementById("acScheme").value||"ras",employerMonthly:+document.getElementById("acEmployerMonthly").value||0,escalationPct:+document.getElementById("acEscalation").value||0}}window.loadAccumulationUI=async function(){try{const t=await G_(),e=await zo(),n=(s,r)=>{const i=document.getElementById(s);i&&r!=null&&r!==0&&(i.value=r)};n("acAge",t.currentAge??e.currentAge),n("acRetireAge",t.retirementAge??e.retirementAge),n("acSalary",t.salary),n("acPotNow",t.potNow),n("acNetMonthly",t.netMonthly),t.schemeType&&(document.getElementById("acScheme").value=t.schemeType),n("acEmployerMonthly",t.employerMonthly),t.escalationPct&&(document.getElementById("acEscalation").value=t.escalationPct),recalcAccumulation()}catch(t){console.error("Accumulation load error:",t)}};window.saveAccumulationUI=async function(){try{await X_(Qu()),showToast("Accumulation plan saved","success")}catch(t){showToast("Could not save: "+t.message,"error")}};window.recalcAccumulation=async function(){const t=Qu(),e=document.getElementById("acBreakdown"),n=document.getElementById("acWarnings"),s=document.getElementById("acProjection");if(!t.currentAge||!t.retirementAge||t.retirementAge<=t.currentAge){e.innerHTML="",n.innerHTML="",s.innerHTML='<p style="color:var(--text-muted);font-size:13px;">Enter your ages to project.</p>';return}const r=mI(t);e.innerHTML='<div class="alert alert-info">Each month: you pay <strong>'+O(t.netMonthly)+"</strong> → <strong>"+O(Math.round(r.grossMonthly))+"</strong> goes into your pension"+(r.reliefMonthly>.5?" (incl. "+O(Math.round(r.reliefMonthly))+" tax relief"+(r.niSavedMonthly>.5?" + NI saving":"")+")":"")+(r.employerMonthly?" + <strong>"+O(r.employerMonthly)+"</strong> from your employer":"")+" = <strong>"+O(Math.round(r.totalMonthly))+"/mo</strong>. Each £1 invested costs you "+(r.costPerPound*100).toFixed(0)+"p."+(r.hrClaimMonthly>.5?" Plus ≈"+O(Math.round(r.hrClaimMonthly))+"/mo you can claim back from HMRC.":"")+"</div>"+r.notes.map(p=>'<p style="font-size:12px;color:var(--text-muted);margin:4px 0 0;">'+p+"</p>").join("");let i=!1;try{i=(await qs()||[]).some(f=>(f.taxFree||0)>0)}catch{}const o=yI({...t,totalMonthly:r.totalMonthly}),a=o[o.length-1],c=gI({annualGrossTotal:r.totalMonthly*12,salary:t.salary,mpaaTriggered:i,currentAge:t.currentAge,retirementAge:t.retirementAge,projectedPotHigh:a.potHigh});n.innerHTML=c.map(p=>'<div class="alert alert-'+(p.severity==="danger"?"danger":p.severity==="warning"?"warning":"info")+'">'+p.message+"</div>").join("");let d="<table><thead><tr><th>Age</th><th>Cautious (2%)</th><th>Middle (5%)</th><th>Strong (8%)</th><th>Paid in</th></tr></thead><tbody>";const u=o.length>12?5:1;for(let p=0;p<o.length;p+=p===0||p>=o.length-u?1:u){const f=o[p];d+="<tr"+(p===o.length-1?' style="font-weight:600;"':"")+"><td>"+f.age+"</td><td>"+O(Math.round(f.potLow))+"</td><td>"+O(Math.round(f.potMid))+"</td><td>"+O(Math.round(f.potHigh))+"</td><td>"+O(Math.round(f.contributedToDate))+"</td></tr>"}d+="</tbody></table>",s.innerHTML=d,window._acProjection={rows:o,breakdown:r}};window.runOnTrackCheck=async function(){const t=document.getElementById("acOnTrack");if(Qu(),!window._acProjection){showToast("Enter your details first","warning");return}t.innerHTML='<p style="font-size:13px;">Searching for the pot that gives 85% success against your plan… (a few seconds)</p>',await new Promise(e=>setTimeout(e,30));try{const e=ns({},await De()),{requiredPot:n}=vI(e,.85,300),s=window._acProjection.rows,r=s[s.length-1],i=o=>o>=n?'<span style="color:var(--success,#22c55e);font-weight:600;">on track ✓</span>':'<span style="color:var(--danger,#ef4444);font-weight:600;">short by '+O(Math.round(n-o))+"</span>";t.innerHTML='<div class="alert alert-info">Your plan needs about <strong>'+O(Math.round(n))+"</strong> at retirement (today's money) for 85% Monte-Carlo success against your budget-derived target.</div><table><tbody><tr><td>Cautious growth (2%)</td><td>"+O(Math.round(r.potLow))+"</td><td>"+i(r.potLow)+"</td></tr><tr><td>Middle growth (5%)</td><td>"+O(Math.round(r.potMid))+"</td><td>"+i(r.potMid)+"</td></tr><tr><td>Strong growth (8%)</td><td>"+O(Math.round(r.potHigh))+"</td><td>"+i(r.potHigh)+'</td></tr></tbody></table><p style="font-size:11px;color:var(--text-muted);margin-top:6px;">Uses your current Stress-Tester settings (target, allocation, State Pension, access method) with the pot scaled. Set your budget and stress settings first for a meaningful answer.</p>'}catch(e){console.error("On-track check error:",e),t.innerHTML='<div class="alert alert-warning">Could not run the check: '+e.message+"</div>"}};window.appConfirm=function(t,e={}){return new Promise(n=>{const s=document.createElement("div");s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;";const r=document.createElement("div");r.style.cssText="background:var(--card,#1e293b);border:1px solid var(--border,#334155);border-radius:12px;max-width:440px;width:100%;padding:20px;";const i=document.createElement("p");i.style.cssText="white-space:pre-line;font-size:14px;line-height:1.55;margin:0 0 16px;",i.textContent=t;const o=document.createElement("div");o.style.cssText="display:flex;gap:10px;justify-content:flex-end;";const a=document.createElement("button");a.textContent=e.cancelLabel||"Cancel",a.className="risk-btn";const c=document.createElement("button");c.textContent=e.okLabel||"OK",c.className="risk-btn",c.style.cssText=e.danger===!1?"":"border-color:#ef4444;color:#ef4444;";const d=p=>{s.remove(),document.removeEventListener("keydown",u),n(p)},u=p=>{p.key==="Escape"&&d(!1)};a.onclick=()=>d(!1),c.onclick=()=>d(!0),s.onclick=p=>{p.target===s&&d(!1)},document.addEventListener("keydown",u),o.append(a,c),r.append(i,o),s.append(r),document.body.append(s),c.focus()})};window.applyLongevitySuggestion=function(){const t=+document.getElementById("ssLongevityAge").value;if(!t){showToast("Enter your current age first","warning");return}const e=document.getElementById("ssLongevitySex").value,n=+document.getElementById("ssLongevityPct").value,s=cI(t,e,n);document.getElementById("ssDuration").value=Math.max(1,s-t),document.getElementById("ssLongevityNote").textContent="Set to age "+s+" ("+Math.max(1,s-t)+" years). Approximate ONS-style cohort figures — planning to the average means a 50% chance of outliving the plan."};window.updateScheduleSpendNotes=async function(){try{const t=await De(),e=Array.isArray(t==null?void 0:t.targetSchedule)&&t.targetSchedule.length>0;for(const n of["ssScheduleSpendNote","dsScheduleSpendNote"]){const s=document.getElementById(n);s&&(s.style.display=e?"block":"none")}}catch{}};window.setAccessMethod=function(t,e){const n=document.getElementById(t+"AccessMethod");n&&(n.value=e),syncAccessButtons(t)};window.syncAccessButtons=function(t){const e=(document.getElementById(t+"AccessMethod")||{}).value||"drawdown";document.querySelectorAll(`[onclick^="setAccessMethod('`+t+`'"]`).forEach(s=>{s.classList.toggle("active",s.dataset.access===e)});const n=document.getElementById(t+"UfplsPhase");n&&(n.style.display=e==="ufpls"?"block":"none")};syncAccessButtons("ss");syncAccessButtons("ds");const Gr={ss:"mo",ds:"mo"};window.netSpendChanged=function(t,e){const n=+e||0,s=Gr[t]==="mo"?n*12:n;document.getElementById(t+"BaseSalary").value=Math.round(uo(s)),Dy(t)};window.toggleNetPeriod=function(t){Gr[t]=Gr[t]==="mo"?"yr":"mo",document.getElementById(t+"NetPeriodBtn").textContent="/"+Gr[t],syncNetFromGross(t)};window.syncNetFromGross=function(t){const e=+document.getElementById(t+"BaseSalary").value||0,n=qt(e,Ta.pa,Ta.brl,Ta.hrl),s=document.getElementById(t+"NetSpend");s&&(s.value=e?Math.round(Gr[t]==="mo"?n/12:n):""),Dy(t),kS(t)};function Dy(t){const e=Math.round(+document.getElementById(t+"BaseSalary").value||0),n=document.getElementById(t+"NetGrossNote");n&&(n.textContent=e?"≈ "+O(e)+"/yr before tax — withdrawals are sized to cover the tax":"")}async function kS(t){const e=document.getElementById(t+"BudgetChipRow"),n=document.getElementById(t+"BudgetChip");if(!(!e||!n)){try{const s=window._budget||id(await zo()),r=mi(s);if(r.allInComfortableMonthly>0){n.textContent="From your budget: "+O(r.allInComfortableMonthly)+"/mo — use",n.dataset.monthly=Math.round(r.allInComfortableMonthly),e.style.display="block";return}}catch{}e.style.display="none"}}window.useBudgetSpend=function(t){const e=document.getElementById(t+"BudgetChip"),n=+(e&&e.dataset.monthly||0);n&&(Gr[t]="mo",document.getElementById(t+"NetPeriodBtn").textContent="/mo",document.getElementById(t+"NetSpend").value=n,netSpendChanged(t,n))};async function Ol(){ct("Loading settings...");try{const t=await De();document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(n=>({...n})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssDbAmount").value=t.dbAmount||0,document.getElementById("ssDbStartYear").value=t.dbStartYear||0,document.getElementById("ssDbIndexation").value=t.dbIndexation||"lpi5",applyStrategyToUI(t.strategyId||"pots-and-valves",t.strategyParams||{}),window._ssIncomeSteps=Array.isArray(t.incomeSteps)?JSON.parse(JSON.stringify(t.incomeSteps)):[],t.shapeAgeNow&&(document.getElementById("shapeAgeNow").value=t.shapeAgeNow),setIncomeShape(t.incomeShape==="phases"?"phases":"level"),window._ssExtraIncomes=Array.isArray(t.extraIncomes)?JSON.parse(JSON.stringify(t.extraIncomes)):[],updateScheduleSpendNotes(),window._ssWindfalls=Array.isArray(t.windfalls)?JSON.parse(JSON.stringify(t.windfalls)):[],renderExtraIncomes(),document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",Zc("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0,document.getElementById("ssAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("ssUfplsYears").value=t.ufplsYears||"",document.getElementById("ssUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("ssBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ss");const e=document.getElementById("ssSeedNote");e&&(e.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),Dl()}catch(t){console.error("Error loading stress settings:",t)}finally{dt()}}window.saveStressSettingsUI=async function(){if(!ut()){showToast("Please sign in to save settings","error");return}const t=Cl(document.getElementById("ssSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ss");if(await Yu(e.equityMin,e.bondMin,e.cashTarget)){ct("Saving settings...");try{const n=await De(),s=+document.getElementById("ssBaseSalary").value,r=Array.isArray(n.targetSchedule)&&Math.abs(s-(n.targetSchedule[0]||0))<1;await ku(window._ssStrategy||"pots-and-valves",Ga()),await yi({configured:!0,strategyId:window._ssStrategy||"pots-and-valves",strategyParams:Ga(),incomeShape:window._ssIncomeShape,incomeSteps:window._ssIncomeShape==="phases"?window._ssIncomeSteps.filter(i=>+i.amount>0):[],shapeAgeNow:+document.getElementById("shapeAgeNow").value||57,...xp(+document.getElementById("ssDuration").value||35,s)?{targetSchedule:xp(+document.getElementById("ssDuration").value||35,s)}:{},accessMethod:document.getElementById("ssAccessMethod").value||"drawdown",ufplsYears:+document.getElementById("ssUfplsYears").value||null,ufplsThenPcls:document.getElementById("ssUfplsPcls").checked,bandFillRecycle:document.getElementById("ssBandFillRecycle").checked,targetSchedule:r?n.targetSchedule:null,baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,dbAmount:+document.getElementById("ssDbAmount").value||0,dbStartYear:+document.getElementById("ssDbStartYear").value||0,dbIndexation:document.getElementById("ssDbIndexation").value||"lpi5",extraIncomes:(window._ssExtraIncomes||[]).filter(i=>i.annual>0),windfalls:(window._ssWindfalls||[]).filter(i=>i.amount>0&&i.year!=null),spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,recoveryBuffer:+document.getElementById("ssRecoveryBuffer").value||15e3,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value,isaBalance:+document.getElementById("ssIsaBalance").value||0,spendingProfile:document.getElementById("ssSpendingProfile").value,equityGlideEnabled:document.getElementById("ssEquityGlide").checked,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:Gu("ss"),taggedFunds:Yt("ss").filter(i=>i.ticker&&i.value>0)}),Wu({...e,duration:+document.getElementById("ssDuration").value||35}),Ll(),updateNextStepBanner(),updateNextStepBanner(),showToast("Settings saved successfully","success")}catch(n){console.error("Error saving stress settings:",n),showToast("Error saving: "+n.message,"error")}finally{dt()}}};window.copyDecisionFromStressUI=async function(t){if(!ut()){showToast("Please sign in first","error");return}if(await Ti()){showToast("This plan is locked — unlock it (Settings) or create a new plan before copying settings into it.","warning",6e3);return}ct("Copying from Stress Tester…");try{const e=await De();if(t==="target")await mr({baseSalary:e.baseSalary});else{const n=await Ze();await mr(O_(e,n))}await Fl(),showToast(t==="target"?"Target copied from the Stress Tester ("+O(e.baseSalary||0)+"/yr gross).":"All Stress settings copied — review them and press Save Settings to commit the plan.","success",5e3)}catch(e){console.error("Copy from stress error:",e),showToast("Could not copy: "+e.message,"error")}finally{dt()}};window.copyStressFromDecisionUI=async function(){if(!ut()){showToast("Please sign in first","error");return}if(await appConfirm("Copy your Decision Tool plan basics (funds, income, State Pension, ISA, protection) into the Stress Tester? Your Stress-specific what-ifs (tax mode, HODL) are kept.")){ct("Copying from Decision...");try{const t=await Ze(),e=await De(),n=N_(t,e);await yi(n),await Ol(),showToast("Stress Tester seeded from your Decision plan","success")}catch(t){console.error("Error copying from decision:",t),showToast("Error copying: "+t.message,"error")}finally{dt()}}};window.resetStressSettingsUI=async function(){if(await appConfirm("Reset all stress settings to defaults?")){ct("Resetting settings...");try{await UI(),await Ol(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{dt()}}};async function Fl(){ct("Loading settings...");try{const t=await Ze();document.getElementById("dsDuration").value=t.duration||35,writeAlloc("ds",t.equityMin??25e4,t.bondMin??2e5,t.cashTarget??5e4,t.diversifierStart||0),restoreCustomAllocFromSettings("ds",t),window._taggedFunds.ds=(t.taggedFunds||[]).map(e=>({...e})),setAllocMode("ds",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("dsEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=t.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("dsProtectionFactor").value=t.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("dsDisableProtection").checked=t.disableProtection||!1,document.getElementById("dsConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("dsIsaBalance").value=t.isaBalance||0,document.getElementById("dsAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("dsUfplsYears").value=t.ufplsYears||"",document.getElementById("dsUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("dsBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ds"),document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",Dl(),await sh()}catch(t){console.error("Error loading decision settings:",t)}finally{dt()}}let CS=0;const St=()=>"b"+ ++CS,O=t=>"£"+Math.round(+t||0).toLocaleString(),Ie=t=>String(t??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");function id(t){const e={...ho(),...t||{}};return e.lines=(Array.isArray(e.lines)?e.lines:[]).map(n=>({id:n.id||St(),...n})),e.oneOffs=(Array.isArray(e.oneOffs)?e.oneOffs:[]).map(n=>({id:n.id||St(),...n})),e}async function PS(){br=!1;try{window._budget=id(await zo())}catch(e){console.error("Budget load error:",e),window._budget=id(ho())}window._budget.lines.length||(window._budget.lines=A0().map(e=>({id:St(),...e})),window._budget.oneOffs.length||(window._budget.oneOffs=k0().map(e=>({id:St(),...e})))),document.getElementById("budCurrentAge").value=window._budget.currentAge,document.getElementById("budRetireAge").value=window._budget.retirementAge,document.getElementById("budEndAge").value=window._budget.endAge,document.getElementById("budShared").checked=!!window._budget.sharedWithPartner,document.getElementById("budSharePct").value=window._budget.mySharePct??50,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",renderSplitPhases(),ht(),tn(),_e(),Ly();const t=!window._budget.lines.some(e=>e.annual)&&!window._budget.oneOffs.some(e=>e.amount);document.getElementById("budWizBanner").style.display=t?"block":"none",br=!0,or("Autosaves as you edit"),window._budWizAutoOpen&&(window._budWizAutoOpen=!1,openBudgetWizard())}function Ly(){const t=Oo(window._budget);document.querySelectorAll("#budTierBtns [data-tier], #budWizTierBtns [data-tier]").forEach(e=>{e.classList.toggle("active",e.dataset.tier===t)})}window.setPlsaTier=function(t){window._budget.plsaTier=t,Ly(),document.getElementById("budWizardOverlay").style.display!=="none"&&xt(!0);const n=window.scrollY;ht(),tn(),_e(),window.scrollTo(0,n)};function Vl(t,e){const n=t.paidBy||"me",s=(o,a)=>'<option value="'+o+'"'+(n===o?" selected":"")+">"+a+"</option>",r=window._budget.mySharePct??50,i=n==="shared"?'<input type="number" min="0" max="100" placeholder="'+r+'%" title="Your % of this shared cost (blank = the overall split)" value="'+(t.mySharePct??"")+'" oninput="'+e+"('"+t.id+`','mySharePct',this.value)" style="flex:0 0 62px;">`:"";return'<select title="Who pays this?" onchange="'+e+"('"+t.id+`','paidBy',this.value)" style="flex:0 0 96px;">`+s("me","Me")+s("partner","Partner")+s("shared","Shared")+"</select>"+i}window.onBudgetSharedToggle=function(){window._budget.sharedWithPartner=document.getElementById("budShared").checked,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",renderSplitPhases(),ht(),tn(),_e()};window.renderSplitPhases=function(){const t=document.getElementById("budSplitPhases");if(!t)return;const e=window._budget.splitPhases||[];t.innerHTML=e.map((n,s)=>'<div style="display:flex; align-items:center; gap:6px; margin-top:4px; font-size:13px;">From age <input type="number" min="40" max="100" value="'+(n.fromAge??"")+'" style="width:68px;" oninput="updateSplitPhase('+s+`,'fromAge',this.value)"> my share becomes <input type="number" min="0" max="100" value="`+(n.mySharePct??"")+'" style="width:68px;" oninput="updateSplitPhase('+s+`,'mySharePct',this.value)">% <button type="button" style="background:none;border:none;color:var(--text-muted);cursor:pointer;" title="Remove" onclick="removeSplitPhase(`+s+')">✕</button></div>').join("")||'<p style="font-size:12px;color:var(--text-muted);margin:4px 0 0;">No changes yet — one split applies for the whole plan.</p>'};window.addSplitPhase=function(){(window._budget.splitPhases=window._budget.splitPhases||[]).push({fromAge:"",mySharePct:""}),renderSplitPhases(),_e()};window.updateSplitPhase=function(t,e,n){window._budget.splitPhases&&window._budget.splitPhases[t]&&(window._budget.splitPhases[t][e]=n===""?"":+n,_e())};window.removeSplitPhase=function(t){window._budget.splitPhases.splice(t,1),renderSplitPhases(),_e()};window.onBudgetSharePctChange=function(){window._budget.mySharePct=+document.getElementById("budSharePct").value||0,_e()};function Ny(t){const e=+window._budget.retirementAge,n=+window._budget.endAge,s=(r,i)=>r!=null&&r!==""&&+r!==i;return t._bandOpen||s(t.fromAge,e)||s(t.toAge,n)}function RS(t){return Ny(t)?'<span class="row-flex" style="gap:4px; flex-wrap:nowrap;"><span class="hint">age</span><input type="number" placeholder="'+(window._budget.retirementAge??"from")+'" title="From age (blank = retirement)" value="'+(t.fromAge??"")+`" oninput="updateBudgetLine('`+t.id+`','fromAge',this.value)" style="width:64px; flex:0 0 auto;"><span class="hint">to</span><input type="number" placeholder="`+(window._budget.endAge??"to")+'" title="To age (blank = end of plan)" value="'+(t.toAge??"")+`" oninput="updateBudgetLine('`+t.id+`','toAge',this.value)" style="width:64px; flex:0 0 auto;"><button type="button" class="risk-btn active" style="padding:4px 8px;" title="Back to: applies for the whole retirement" onclick="budMainBandToggle('`+t.id+`')">&#9201;</button></span>`:`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Only for some years? Set when this cost starts and stops — e.g. a car lease with 3 years left. Blank = the whole retirement." onclick="budMainBandToggle('`+t.id+`')">&#9201;</button>`}window.budMainBandToggle=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(Ny(e)?(e._bandOpen=!1,e.fromAge=null,e.toAge=null,budTouch()):e._bandOpen=!0,ht(),_e())};function Ap(t){const e=t.hint?'<div class="hint" style="margin-top:2px;line-height:1.3;font-size:11px;">'+Ie(t.hint)+"</div>":"",n=t.period||"yr",s=t.annual==null?"":n==="mo"?Math.round(t.annual/12):t.annual,r=pi(t.label,window._budget),i=r!=null?"≈"+(n==="mo"?r:r*12):"Amount",o=window._budget.sharedWithPartner?`<button type="button" class="risk-btn" title="Add a copy for your partner (e.g. their car)" onclick="duplicateBudgetLine('`+t.id+`')">⧉</button>`:"";return'<div class="bud-row" data-id="'+t.id+'"><div class="bud-label"><input type="text" placeholder="Category" value="'+Ie(t.label)+`" oninput="updateBudgetLine('`+t.id+`','label',this.value)">`+e+'</div><div class="bud-amt"><input type="text" inputmode="decimal" id="bm-amt-'+t.id+'" placeholder="'+i+`" title="Amount in today's money — sums welcome: 11.99+8.99 or =4×52/12`+(r!=null?" (typical shown)":"")+'" value="'+s+`" onchange="updateBudgetAmount('`+t.id+`',this.value,this)"><button type="button" class="risk-btn" title="Switch monthly / yearly" onclick="toggleBudgetPeriod('`+t.id+`')">`+(n==="mo"?"/mo":"/yr")+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bm','`+t.id+`')">&Sigma;</button></div>`+(window._budget.sharedWithPartner?'<span class="bud-paidby">'+Vl(t,"updateBudgetLine")+"</span>":"")+'<span class="bud-ages">'+RS(t)+'</span><span class="bud-actions">'+o+`<button type="button" class="risk-btn" title="Remove" onclick="removeBudgetLine('`+t.id+`')">&times;</button></span>`+(t.breakdownOpen?'<div class="bud-break">'+Fy("bm",t)+"</div>":"")+"</div>"}function od(t){const e=window._budget.sharedWithPartner;return'<div class="bud-row bud-head'+(t?" bud-row--oneoff":"")+'"><span>What</span><span>'+(t?"Cost (£)":"Amount")+"</span>"+(e?"<span>Who pays</span>":"")+"<span>"+(t?"When":"Years it applies")+"</span><span></span></div>"}function ht(){const t=window._budget.lines.filter(s=>s.tier==="essential"),e=window._budget.lines.filter(s=>s.tier==="discretionary"),n=window._budget.sharedWithPartner;for(const s of["budEssentialRows","budDiscretionaryRows","budOneOffRows"]){const r=document.getElementById(s);r&&(r.classList.add("bud-grid"),r.classList.toggle("bud-grid--shared",n))}document.getElementById("budEssentialRows").innerHTML=(t.length?od(!1):"")+t.map(Ap).join("")||'<p class="hint" style="margin:0 0 8px;">No essentials yet — add housing, bills, food, transport…</p>',document.getElementById("budDiscretionaryRows").innerHTML=(e.length?od(!1):"")+e.map(Ap).join("")||'<p class="hint" style="margin:0 0 8px;">No lifestyle spending yet — holidays, hobbies, eating out…</p>',Ju()}function MS(t){const e=t.hint?'<div class="hint" style="margin-top:2px;line-height:1.3;font-size:11px;">'+Ie(t.hint)+"</div>":"";return'<div class="bud-row bud-row--oneoff" data-id="'+t.id+'"><div class="bud-label"><input type="text" placeholder="e.g. Car" value="'+Ie(t.label)+`" oninput="updateBudgetOneOff('`+t.id+`','label',this.value)">`+e+`</div><div class="bud-amt"><input type="number" placeholder="£ amount" title="Total cost in today's money" value="`+(t.amount??"")+`" oninput="updateBudgetOneOff('`+t.id+`','amount',this.value)"></div>`+(window._budget.sharedWithPartner?'<span class="bud-paidby">'+Vl(t,"updateBudgetOneOff")+"</span>":"")+'<span class="bud-ages"><span class="hint">at</span><input type="number" placeholder="age" value="'+(t.atAge??"")+`" oninput="updateBudgetOneOff('`+t.id+`','atAge',this.value)"><span class="hint">every</span><input type="number" placeholder="once" title="Leave blank for a one-time cost" value="`+(t.everyYears??"")+`" oninput="updateBudgetOneOff('`+t.id+`','everyYears',this.value)"><span class="hint">yrs</span></span><span class="bud-actions">`+(window._budget.sharedWithPartner?`<button type="button" class="risk-btn" title="Add a copy for your partner" onclick="duplicateBudgetOneOff('`+t.id+`')">⧉</button>`:"")+`<button type="button" class="risk-btn" title="Remove" onclick="removeBudgetOneOff('`+t.id+`')">&times;</button></span></div>`}function tn(){const t=window._budget.oneOffs,e=document.getElementById("budOneOffRows");e.classList.add("bud-grid"),e.classList.toggle("bud-grid--shared",!!window._budget.sharedWithPartner),e.innerHTML=(t.length?od(!0):"")+t.map(MS).join("")||'<p class="hint" style="margin:0 0 8px;">No one-off costs yet — a car every ~8 years, a new roof, a milestone trip…</p>'}function Ju(){const t=co(window._budget),e=document.getElementById("budSuggestionsSection"),n=document.getElementById("budSuggestions");if(!t.length){e.style.display="none",n.innerHTML="";return}e.style.display="block",n.innerHTML=t.map(s=>'<button type="button" class="risk-btn" style="padding:5px 10px;" title="'+Ie(s.hint||"")+`" onclick="addBudgetSuggestion('`+Ie(s.label).replace(/'/g,"\\'")+`')">+ `+Ie(s.label)+"</button>").join("")}window.addBudgetSuggestion=function(t){const e=co(window._budget).find(n=>n.label===t);e&&(window._budget.lines.push({id:St(),label:e.label,tier:e.tier,annual:null,fromAge:null,toAge:null,hint:e.hint||"",period:e.period||"yr",paidBy:e.paidBy||"me"}),ht(),Ju(),_e())};function Xu(){window._budget.currentAge=+document.getElementById("budCurrentAge").value||0,window._budget.retirementAge=+document.getElementById("budRetireAge").value||0,window._budget.endAge=+document.getElementById("budEndAge").value||100}window.onBudgetHorizonChange=function(){Xu(),_e()};window.updateBudgetLine=function(t,e,n){const s=window._budget.lines.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="fromAge"||e==="toAge"?s[e]=n===""?null:Ul(n):s[e]=n===""?null:+n,e==="label"&&Ju(),e==="paidBy"&&ht(),_e())};window.updateBudgetAmount=function(t,e,n){const s=window._budget.lines.find(i=>i.id===t);if(!s)return;const r=String(e).trim();if(r==="")s.annual=null;else{const i=Ms(r);if(i==null)return;s.annual=(s.period||"yr")==="mo"?i*12:i,n&&(n.value=i)}budTouch(),_e()};window.toggleBudgetPeriod=function(t){const e=window._budget.lines.find(s=>s.id===t);if(!e)return;e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch();const n=window.scrollY;ht(),_e(),window.scrollTo(0,n)};window.updateBudgetOneOff=function(t,e,n){const s=window._budget.oneOffs.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="atAge"?s[e]=n===""?null:Ul(n):s[e]=n===""?null:+n,e==="paidBy"&&tn(),_e())};window.addBudgetLine=function(t){window._budget.lines.push({id:St(),label:"",tier:t,annual:null,fromAge:null,toAge:null}),ht(),_e()};window.addBudgetOneOff=function(){window._budget.oneOffs.push({id:St(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),tn(),_e()};window.removeBudgetLine=function(t){const e=window._budget.lines.findIndex(n=>n.id===t);e<0||(zl("line",window._budget.lines[e],e),window._budget.lines.splice(e,1),ht(),_e())};window.removeBudgetOneOff=function(t){const e=window._budget.oneOffs.findIndex(n=>n.id===t);e<0||(zl("oneOff",window._budget.oneOffs[e],e),window._budget.oneOffs.splice(e,1),tn(),_e())};window.duplicateBudgetLine=function(t){const e=window._budget.lines,n=e.find(r=>r.id===t);if(!n)return;const s={...n,id:St(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,s),ht(),_e()};window.duplicateBudgetOneOff=function(t){const e=window._budget.oneOffs,n=e.find(r=>r.id===t);if(!n)return;const s={...n,id:St(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,s),tn(),_e()};window.fillTypicalAmounts=function(){let t=0;for(const e of window._budget.lines)if(e.annual==null||e.annual===""){const n=pi(e.label,window._budget);n!=null&&(e.annual=n*12,t++)}ht(),_e(),showToast(t?"Filled "+t+" blank categories with "+S0[Oo(window._budget)]+" figures — adjust freely":"No blank categories with a typical figure",t?"success":"info")};function _e(){budTouch(),Xu();const t=window._budget,e=t.retirementAge,n=Wc(t,e,"essential"),s=Wc(t,e,"all");document.getElementById("budEssentialSubtotal").textContent=O(n),document.getElementById("budDiscretionarySubtotal").textContent=O(s-n);const r=mi(t),i=E=>O(E),o=t.oneOffs.filter(E=>(+E.everyYears||0)>0&&(+E.amount||0)>0),a=t.oneOffs.filter(E=>!((+E.everyYears||0)>0)&&(+E.amount||0)>0),c=I0.single,d=r.allInComfortableAnnual,u=d>=c.comfortable?"at/above Comfortable":d>=c.moderate?"between Moderate and Comfortable":d>=c.minimum?"between Minimum and Moderate":"below the Minimum",p=r.sharedWithPartner;let f="";if(f+='<div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;">',f+='<div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(p?" — your share":"")+'</div><div style="font-size:22px;font-weight:700;">'+i(r.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div>',f+='<div><div style="font-size:12px;color:var(--text-muted);">'+(p?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:26px;font-weight:800;color:var(--primary,#6366f1);">'+i(r.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+i(d)+"/yr — what your plan funds</div></div>",p&&(f+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:22px;font-weight:700;">'+i(r.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+i(r.partnerAllInAnnual)+"/yr — their side of this budget</div></div>",f+='<div><div style="font-size:12px;color:var(--text-muted);">Household all-in</div><div style="font-size:22px;font-weight:700;">'+i(r.householdComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">everything, both of you</div></div>'),f+="</div>",p&&r.partnerAllInAnnual>0&&(f+='<div class="alert alert-info" style="margin-bottom:12px;">Your partner’s share is <strong>'+i(r.partnerAllInMonthly)+"/mo</strong> ("+i(r.partnerAllInAnnual)+'/yr). They can create their own free plan and use that as <em>their</em> target income. <span style="color:var(--text-muted);">Note: this plan only funds <em>your</em> share — it doesn’t check your partner can fund theirs.</span></div>'),f+='<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">= comfortable recurring <strong style="color:var(--text);">'+i(r.comfortableMonthlyNet)+"/mo</strong>"+(r.periodicMonthlyAverage>0?' + periodic set-aside <strong style="color:var(--text);">'+i(r.periodicMonthlyAverage)+"/mo</strong> <span>(averaged from the big periodic costs below)</span>":"")+".</div>",f+='<div class="alert alert-info" style="margin-bottom:12px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+i(c.minimum)+" · Moderate "+i(c.moderate)+" · Comfortable "+i(c.comfortable)+" per year. Your all-in spend is <strong>"+u+'</strong>. <span style="color:var(--text-muted);">(Assumes home owned outright; excludes care costs.)</span></div>',o.length){f+='<div style="font-size:13px;margin-bottom:8px;"><strong>Periodic costs</strong> (averaged into the monthly need, but the cash lands lumpily):<ul style="margin:6px 0 0; padding-left:18px;">';for(const E of o){const C=+E.amount/+E.everyYears;f+="<li>"+Ie(E.label||"item")+": "+i(E.amount)+" every "+ +E.everyYears+" yrs ≈ <strong>"+i(C)+"/yr</strong> ("+i(C/12)+"/mo)</li>"}f+="</ul></div>"}if(a.length){f+='<div style="font-size:13px;margin-bottom:12px;"><strong>One-time costs</strong> (not in the monthly average — planned for the year they fall):<ul style="margin:6px 0 0; padding-left:18px;">';for(const E of a)f+="<li>"+Ie(E.label||"item")+": "+i(E.amount)+(E.atAge?" at age "+ +E.atAge:"")+"</li>";f+="</ul></div>"}const g=+window._budget.targetHeadroomMonthly||0,v=r.allInComfortableMonthly+g,y=uo(r.allInComfortableAnnual+g*12);f+='<div style="border-top:1px solid var(--border); padding-top:12px;">',f+='<div style="font-size:13px; margin-bottom:8px;">Your all-in take-home of <strong>'+i(r.allInComfortableMonthly)+"/mo</strong> becomes the <strong>target both tools work to</strong>: the Stress Tester asks “will my pots deliver this for life?” and the Decision Tool works out each month’s withdrawal to hit it tax-efficiently.</div>",f+='<div style="font-size:13px; margin-bottom:10px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">Optional headroom on top: £<input type="number" min="0" value="'+(window._budget.targetHeadroomMonthly??"")+'" placeholder="0" onchange="budHeadroomChanged(this.value)" style="width:90px;">/mo <span style="color:var(--text-muted);">— breathing room above the budget, so the plan isn’t cut to the bone.</span></div>',f+='<div style="font-size:13px; margin-bottom:8px;">Plan target: <strong>'+i(v)+'/mo take-home</strong> <span style="color:var(--text-muted);">(≈ '+i(y)+"/yr before tax"+(g?" — budget + "+i(g)+"/mo headroom":"")+")</span></div>",f+='<button type="button" onclick="applyBudgetToPlan()">Set as my plan’s target (Stress + Decision)</button>',f+="</div>",document.getElementById("budSummary").innerHTML=f}let br=!1,bo=null;function or(t){if(Kn)return;const e=document.getElementById("budSaveStatus");e&&(e.textContent=t)}let Kn=null,ad=null;function zl(t,e,n){Kn={kind:t,item:e,index:n},clearTimeout(ad),ad=setTimeout(()=>{Kn=null,ld()},12e3),ld()}function ld(){const t=Kn?Kn.item.label||"item":null,e=Kn?"Removed “"+Ie(t)+'” — <button type="button" class="budwiz-chip" onclick="budUndoRemove()">Undo</button>':null,n=document.getElementById("budSaveStatus");n&&e?n.innerHTML=e:n&&!e&&or("Saved ✓");const s=document.getElementById("budWizUndoSlot");s&&(s.innerHTML=e||"")}window.budUndoRemove=function(){if(!Kn)return;const{kind:t,item:e,index:n}=Kn;Kn=null,clearTimeout(ad);const s=t==="line"?window._budget.lines:window._budget.oneOffs;if(s.splice(Math.min(n,s.length),0,e),budTouch(),document.getElementById("budWizardOverlay").style.display!=="none")xt(!0);else{const i=window.scrollY;ht(),tn(),_e(),window.scrollTo(0,i)}ld()};window.budTouch=function(){!br||!window._budget||(or("Saving…"),clearTimeout(bo),bo=setTimeout(Zu,1200))};function Oy(){return{...window._budget,lines:window._budget.lines.filter(t=>t.label&&t.label.trim()||t.annual||t.breakdown&&t.breakdown.some(e=>e.label&&e.label.trim()||e.amount)),oneOffs:window._budget.oneOffs.filter(t=>t.label&&t.label.trim()||t.amount)}}async function Zu(){if(!ut()){or("Sign in to save");return}try{await Nu(Oy()),or("Saved ✓")}catch(t){console.error("Budget autosave error:",t),or("Not saved — retrying…"),clearTimeout(bo),bo=setTimeout(Zu,4e3)}}window.resetBudgetUI=async function(){await appConfirm(`Reset the budget?

All amounts, sub-sheets and custom lines go back to a fresh start. Your ages and partner-sharing setting are kept.

This saves immediately and cannot be undone.`)&&(window._budget.lines=A0().map(t=>({id:St(),...t})),window._budget.oneOffs=k0().map(t=>({id:St(),...t})),ht(),tn(),_e(),await Zu(),showToast("Budget reset to a fresh start","success"))};window.exportBudgetCsv=async function(){var t,e;try{const n=await _r(),s=await Fo(),r=(((e=(t=n.find(o=>o.id===s))==null?void 0:t.planDetails)==null?void 0:e.name)||"plan").replace(/[^\w\-]+/g,"-").toLowerCase(),i=B_(window._budget||{});By("budget-"+r+"-"+new Date().toISOString().slice(0,10)+".csv",i,"text/csv;charset=utf-8;"),showToast("Budget exported — open it straight in Google Sheets or Excel","success")}catch(n){showToast("Export failed: "+n.message,"error")}};window.importBudgetCsvFile=function(t){const e=t.files&&t.files[0];if(t.value="",!e)return;const n=new FileReader;n.onload=async()=>{try{const s=L_(n.result);if(!s.lines.length&&!s.oneOffs.length){showToast("Nothing to import"+(s.warnings[0]?" — "+s.warnings[0]:""),"warning",6e3);return}const r=`Replace the current budget with the imported one?

`+s.lines.length+" items, "+s.oneOffs.length+" one-offs"+(s.warnings.length?`
`+s.warnings.length+` row(s) skipped:
• `+s.warnings.slice(0,3).join(`
• `)+(s.warnings.length>3?`
…`:""):"")+`

Your current budget is kept for one Undo.`;if(!await appConfirm(r,{okLabel:"Import",danger:!1}))return;const i=JSON.parse(JSON.stringify(window._budget));br=!1;const o=window._budget;Object.assign(o,s.settings),o.lines=s.lines.map(p=>({...p,id:St()})),o.oneOffs=s.oneOffs.map(p=>({...p,id:St()}));const a=(p,f)=>{const g=document.getElementById(p);g&&f!=null&&(g.value=f)};a("budCurrentAge",o.currentAge),a("budRetireAge",o.retirementAge),a("budEndAge",o.endAge);const c=document.getElementById("budShared");c&&(c.checked=!!o.sharedWithPartner),a("budSharePct",o.mySharePct);const d=document.getElementById("budShareRow");d&&(d.style.display=o.sharedWithPartner?"block":"none"),renderSplitPhases(),ht(),tn(),_e(),br=!0,await saveBudgetUI(),window._budImportUndo=i,showToast("Imported "+o.lines.length+" items. Undo available for 60s via the button below.","success",8e3);const u=document.getElementById("budSaveStatus");u&&(u.innerHTML='Imported — <a href="#" onclick="undoBudgetImport();return false;" style="color:var(--primary);">Undo</a>'),setTimeout(()=>{window._budImportUndo=null},6e4)}catch(s){console.error("Budget import error:",s),showToast("Import failed: "+s.message,"error",6e3)}},n.readAsText(e)};window.undoBudgetImport=async function(){if(!window._budImportUndo){showToast("Nothing to undo","warning");return}br=!1,window._budget=window._budImportUndo,window._budImportUndo=null,renderSplitPhases(),ht(),tn(),_e(),br=!0,await saveBudgetUI(),showToast("Budget restored","success")};window.saveBudgetUI=async function(){if(!ut()){showToast("Please sign in to save your budget","error");return}Xu(),ct("Saving budget…");try{clearTimeout(bo),await Nu(Oy()),or("Saved ✓"),showToast("Budget saved","success")}catch(t){console.error("Budget save error:",t),showToast("Error saving budget: "+t.message,"error")}finally{dt()}};window.budHeadroomChanged=function(t){window._budget.targetHeadroomMonthly=t===""?null:Math.max(0,+t||0),_e()};window.applyBudgetToPlan=async function(){const t=mi(window._budget),e=+window._budget.targetHeadroomMonthly||0,n=Math.round(uo(t.allInComfortableAnnual+e*12));if(!n){showToast("Add some spending first","warning");return}ct("Applying to plan…");try{const s=await De(),r=s.duration||35,o=P_(window._budget,r).map(f=>Math.round(uo(f+e*12)));await yi({baseSalary:n,targetSchedule:o});const a=window._budget;((a.lines||[]).some(f=>f.fromAge!=null&&f.fromAge!==""&&+f.fromAge!=+a.retirementAge||f.toAge!=null&&f.toAge!==""&&+f.toAge!=+a.endAge)||(a.oneOffs||[]).length>0||Array.isArray(a.splitPhases)&&a.splitPhases.length>0)&&s.spendingProfile==="declining"&&showToast('Heads-up: your Spending profile is "Declining with age", but this budget already winds costs down with age. Consider "Level for life" in the Stress settings to avoid counting the slowdown twice.',"warning",9e3),updateScheduleSpendNotes();const d=await Ti();d||await mr({baseSalary:n});const u=document.getElementById("ssBaseSalary");u&&(u.value=n,syncNetFromGross("ss"));const p=document.getElementById("dsBaseSalary");p&&!d&&(p.value=n,syncNetFromGross("ds")),updateNextStepBanner(),showToast("Target set: both tools now work to "+O(t.allInComfortableMonthly+e)+"/mo take-home"+(e?" (incl. "+O(e)+"/mo headroom)":"")+" — "+O(n)+"/yr gross"+(d?". Stress only; the Decision plan is locked":""),"success",5e3)}catch(s){console.error("Apply-to-plan error:",s),showToast("Could not apply: "+s.message,"error")}finally{dt()}};const $o=[{key:"home",title:"Home & bills",tier:"essential",tip:"Will your mortgage still exist at retirement? If it ends earlier, use the ⏱ button on its row to set the age it stops. Bills mostly carry on — but you'll be home more, so heating often rises.",labels:["Rent / mortgage","Council tax","Gas","Electricity","Water","Broadband","Mobile phones","TV licence","Home insurance","Boiler service","Home upkeep","Premier banking / account fees","Cleaner / gardener","Second / holiday home","Storage / lock-up"]},{key:"food",title:"Food, drink & eating out",tier:"essential",tip:"With more free time most retirees eat OUT more, not less. Check 2–3 months of bank statements for what you really spend — real numbers beat guesses.",labels:["Groceries & household","Eating out & takeaways","Alcohol"]},{key:"transport",title:"Transport",tier:"essential",tip:"Commuting disappears at retirement, but running costs are easy to underestimate — servicing, MOT, tyres, repairs. Replacing the car itself goes in One-off costs (a later step).",labels:["Car insurance","Car tax","Petrol / fuel","Car servicing & maintenance","Breakdown cover","Parking & permits","Public transport"]},{key:"health",title:"Health & protection",tier:"essential",tip:"Health spending tends to RISE with age — and the PLSA benchmarks exclude long-term care entirely. A monthly care set-aside is easy to add now and painful to discover missing later.",labels:["Personal health","Health / dental insurance","Dental & optical","Hearing","Life insurance / income protection","Long-term care set-aside"]},{key:"leisure",title:"Holidays, hobbies & leisure",tier:"discretionary",tip:'Most people spend MORE on holidays and hobbies in the early "go-go" years. Budget for the retirement you actually want — the spending smile tapers it in later life.',labels:["Main holiday","UK breaks","Day trips","Streaming & entertainment","Digital subscriptions","Gym & fitness","Sports & equipment","Sports clothes","Hobbies & leisure","Newspapers, books & media"]},{key:"personal",title:"Personal, family & giving",tier:"discretionary",tip:'The easiest category to underestimate: gifts, grandchildren, Christmas. A personal "spends" line per person keeps day-to-day money simple.',labels:["Clothes","Gifts & family","Charity","Pets","Personal spending money","Kids / dependents","Christmas & birthdays","Hairdressing & grooming","Grandchildren","Professional memberships","My personal spending","Partner's personal spending"]},{key:"extras",title:"Around the home & everything else",tier:"discretionary",tip:"Furniture wears out, technology needs refreshing, and a small emergency buffer stops a bad month becoming a plan problem. Anything of yours that didn't fit an earlier screen appears here too.",labels:["Home furnishings & décor","Home technology","Emergency buffer"]}],eh=(()=>{const t={};for(const e of $o)for(const n of e.labels)t[n.toLowerCase()]=e.key;return t})(),Ui=["intro",...$o.map(t=>t.key),"oneoffs","review"];let zn=0;function BS(t){return t.wizGroup&&$o.some(e=>e.key===t.wizGroup)?t.wizGroup:eh[(t.label||"").trim().toLowerCase()]||"extras"}window.openBudgetWizard=function(){window._budget&&(zn=0,document.getElementById("budWizardOverlay").style.display="block",xt())};window.closeBudgetWizard=function(){document.getElementById("budWizardOverlay").style.display="none",ht(),tn(),_e()};window.budWizGo=function(t){zn=Math.max(0,Math.min(Ui.length-1,zn+t)),xt()};function DS(t){return t.annual==null?"":(t.period||"yr")==="mo"?Math.round(t.annual/12):t.annual}function LS(t){const e=t.period||"yr",n=pi(t.label,window._budget),s=S0[Oo(window._budget)].replace("PLSA ",""),r=n!=null&&n>0?s+" "+O(e==="mo"?n:n*12)+"/"+e:null,o=!!eh[(t.label||"").trim().toLowerCase()]?'<div style="font-weight:600;">'+Ie(t.label)+"</div>":'<input type="text" placeholder="What is it?" value="'+Ie(t.label)+`" oninput="budWizField('`+t.id+`','label',this.value)" style="width:100%;">`,a=t.hint?'<div class="budwiz-hint">'+Ie(t.hint)+"</div>":"",c=P0(t.label,t.annual,window._budget),d=c?'<div class="budwiz-nudge" id="bw-n-'+t.id+'">'+(c==="low"?"Well below typical ("+O(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+O(n)+"/mo) — worth double-checking.")+"</div>":'<div class="budwiz-nudge" id="bw-n-'+t.id+'"></div>';return'<div class="budwiz-row" id="bw-row-'+t.id+'"><div class="budwiz-name">'+o+a+'</div><div class="budwiz-amt"><input type="text" inputmode="decimal" id="bw-amt-'+t.id+`" placeholder="£ or e.g. =12+9.50" title="Amount in today's money — sums welcome: 11.99+8.99, =4×52/12" value="`+DS(t)+`" onchange="budWizAmount('`+t.id+`',this.value,this)" style="flex:1 1 auto; min-width:0;"><button type="button" class="risk-btn" style="padding:6px 9px;" title="Switch monthly / yearly" onclick="budWizTogglePeriod('`+t.id+`')">/`+e+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" style="padding:6px 9px;" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bw','`+t.id+`')">&Sigma;</button></div><div class="budwiz-chipslot">`+(r?`<button type="button" class="budwiz-chip" onclick="budWizUseTypical('`+t.id+`')" title="ONS retired-household average — a starting point">`+r+" — use</button>":"")+"</div>"+(window._budget.sharedWithPartner?Vl(t,"budWizField"):"")+(xa(t)?'<input type="number" placeholder="from age" title="From age (blank = retirement)" value="'+(t.fromAge??"")+`" oninput="budWizField('`+t.id+`','fromAge',this.value)" style="flex:0 0 78px;"><input type="number" placeholder="to age" title="To age (blank = end of plan). E.g. a car lease with 3 years left: to retirement age + 3." value="`+(t.toAge??"")+`" oninput="budWizField('`+t.id+`','toAge',this.value)" style="flex:0 0 78px;">`:"")+'<button type="button" class="risk-btn'+(xa(t)?" active":"")+'" style="padding:6px 9px;" title="'+(xa(t)?"Remove the age limits — make this a whole-of-retirement cost again":"Assumed for the whole retirement. Click to limit it to an age range — for temporary costs like a lease or a mortgage that ends.")+`" onclick="budWizBandToggle('`+t.id+`')">&#x23F1;</button><button type="button" class="risk-btn" style="padding:6px 11px;" title="Remove" onclick="budWizRemove('`+t.id+`')">&times;</button><div id="bw-err-`+t.id+'" class="budwiz-err"></div>'+d+(t.breakdownOpen?'<div style="flex-basis:100%;">'+Fy("bw",t)+"</div>":"")+"</div>"}window.budWizField=function(t,e,n){const s=window._budget.lines.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="fromAge"||e==="toAge"?s[e]=n===""?null:Ul(n):s[e]=n===""?null:+n,e==="paidBy"&&xt(!0),budTouch(),Ei())};window.budWizAmount=function(t,e,n){const s=window._budget.lines.find(o=>o.id===t);if(!s)return;const r=document.getElementById("bw-err-"+t),i=String(e).trim();if(i==="")s.annual=null,r&&(r.textContent="");else{const o=Ms(i);if(o==null){r&&(r.textContent="Couldn’t read that — a number or a simple sum like 12.99+8.50 works.");return}r&&(r.textContent=""),s.annual=(s.period||"yr")==="mo"?o*12:o,n&&(n.value=(s.period||"yr")==="mo"?Math.round(s.annual/12):s.annual)}cd(s),budTouch(),Ei()};function cd(t){const e=document.getElementById("bw-n-"+t.id);if(!e)return;const n=pi(t.label,window._budget),s=P0(t.label,t.annual,window._budget);e.textContent=s?s==="low"?"Well below typical ("+O(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+O(n)+"/mo) — worth double-checking.":""}function Ul(t){const e=+t;if(!Number.isFinite(e))return null;if(e>1e3){const n=new Date().getFullYear()-(+window._budget.currentAge||0);return Math.max(0,e-n)}return e}function xa(t){return t.fromAge!=null||t.toAge!=null||t._bandOpen}window.budWizBandToggle=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(xa(e)?(e._bandOpen=!1,e.fromAge=null,e.toAge=null,budTouch()):e._bandOpen=!0,xt(!0))};window.budWizTogglePeriod=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch(),xt(!0))};window.budWizUseTypical=function(t){const e=window._budget.lines.find(s=>s.id===t);if(!e)return;const n=pi(e.label,window._budget);n!=null&&(e.annual=n*12,budTouch(),xt(!0))};window.budWizRemove=function(t){const e=window._budget.lines.findIndex(n=>n.id===t);e<0||(zl("line",window._budget.lines[e],e),window._budget.lines.splice(e,1),budTouch(),xt(!0))};window.budWizAddLine=function(t){const e=$o.find(n=>n.key===t);window._budget.lines.push({id:St(),label:"",tier:e&&e.tier||"discretionary",annual:null,fromAge:null,toAge:null,period:"mo",wizGroup:t}),budTouch(),xt(!0)};window.budWizSuggest=function(t,e){const n=co(window._budget).find(s=>s.label===t);n&&(window._budget.lines.push({id:St(),label:n.label,tier:n.tier,annual:null,fromAge:null,toAge:null,hint:n.hint||"",period:n.period||"yr",paidBy:n.paidBy||"me",wizGroup:e}),budTouch(),xt(!0))};const wi=t=>window._budget.lines.find(e=>e.id===t);function th(t){if(t==="bw"){xt(!0);return}const e=window.scrollY;ht(),_e(),window.scrollTo(0,e)}function Fy(t,e){return'<div style="background:var(--card-alt); border:1px solid var(--border); border-radius:8px; padding:10px; margin-top:6px;"><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Break it into parts — mix /mo and /yr freely; sums (or =sums) are fine in each box. The total is written to the line for you, and the parts are saved.</div>'+(e.breakdown||[]).map((s,r)=>'<div style="display:flex; gap:6px; margin-bottom:6px; align-items:center;"><input type="text" placeholder="'+(r===0?"e.g. insurance":r===1?"e.g. fuel":"part "+(r+1))+'" value="'+Ie(s.label)+`" oninput="budBreakField('`+t+"','"+e.id+"',"+r+`,'label',this.value)" style="flex:1 1 auto; min-width:0;"><input type="text" inputmode="decimal" placeholder="£ or =12+8" value="`+(s.amount??"")+`" onchange="budBreakField('`+t+"','"+e.id+"',"+r+`,'amount',this.value,this)" style="flex:0 0 104px;"><button type="button" class="risk-btn" style="padding:4px 8px;" title="This part is per month / per year" onclick="budBreakTogglePeriod('`+t+"','"+e.id+"',"+r+',this)">/'+(s.period||"yr")+`</button><button type="button" class="risk-btn" style="padding:4px 9px;" title="Remove part" onclick="budBreakRemoveRow('`+t+"','"+e.id+"',"+r+')">&times;</button></div>').join("")+`<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;"><button type="button" class="risk-btn" style="padding:4px 12px;" onclick="budBreakAddRow('`+t+"','"+e.id+`')">+ add part</button><div style="font-size:13px;">Adds up to <strong id="`+t+"-bsum-"+e.id+'">'+Vy(e)+"</strong></div></div></div>"}function Vy(t){const e=Iu(t.breakdown);return(t.period||"yr")==="mo"?O(e/12)+"/mo":O(e)+"/yr"}function nh(t,e){const n=wi(e);if(!n)return;if((n.breakdown||[]).some(r=>+r.amount)){n.annual=Iu(n.breakdown);const r=document.getElementById(t+"-amt-"+e);r&&(r.value=(n.period||"yr")==="mo"?Math.round(n.annual/12):n.annual)}const s=document.getElementById(t+"-bsum-"+e);s&&(s.textContent=Vy(n)),t==="bw"?(Ei(),typeof cd=="function"&&cd(n)):_e(),budTouch()}window.budBreakToggle=function(t,e){const n=wi(e);n&&(n.breakdownOpen=!n.breakdownOpen,n.breakdownOpen&&!Array.isArray(n.breakdown)&&(n.breakdown=[{label:"",amount:null,period:"mo"},{label:"",amount:null,period:"mo"}]),budTouch(),th(t))};window.budBreakAddRow=function(t,e){const n=wi(e);n&&((n.breakdown=n.breakdown||[]).push({label:"",amount:null,period:"mo"}),th(t))};window.budBreakRemoveRow=function(t,e,n){const s=wi(e);!s||!s.breakdown||(s.breakdown.splice(n,1),nh(t,e),th(t))};window.budBreakField=function(t,e,n,s,r,i){const o=wi(e),a=o&&o.breakdown&&o.breakdown[n];if(!a)return;if(s==="label"){a.label=r,budTouch();return}const c=String(r).trim();if(c==="")a.amount=null;else{const d=Ms(c);if(d==null)return;a.amount=d,i&&(i.value=d)}nh(t,e)};window.budBreakTogglePeriod=function(t,e,n,s){const r=wi(e),i=r&&r.breakdown&&r.breakdown[n];i&&(i.period=(i.period||"yr")==="mo"?"yr":"mo",s&&(s.textContent="/"+i.period),nh(t,e))};function NS(t){return'<div class="budwiz-row"><input type="text" placeholder="e.g. Replacement car" value="'+Ie(t.label)+`" oninput="budWizOneOff('`+t.id+`','label',this.value)" style="flex:1 1 170px; min-width:150px;"><input type="text" inputmode="decimal" placeholder="£ total" title="Total cost in today's money — sums welcome" value="`+(t.amount??"")+`" onchange="budWizOneOffAmount('`+t.id+`',this.value,this)" style="flex:0 0 110px;"><input type="number" placeholder="at age" title="Age it first happens" value="`+(t.atAge??"")+`" oninput="budWizOneOff('`+t.id+`','atAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="every N yrs" title="Blank = one-time" value="`+(t.everyYears??"")+`" oninput="budWizOneOff('`+t.id+`','everyYears',this.value)" style="flex:0 0 104px;">`+(window._budget.sharedWithPartner?Vl(t,"budWizOneOff"):"")+`<button type="button" class="risk-btn" style="padding:4px 10px;" onclick="budWizRemoveOneOff('`+t.id+`')">&times;</button><div id="bw-oerr-`+t.id+'" class="budwiz-err"></div></div>'}window.budWizOneOff=function(t,e,n){const s=window._budget.oneOffs.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="atAge"?s[e]=n===""?null:Ul(n):s[e]=n===""?null:+n,e==="paidBy"&&xt(!0),budTouch(),Ei())};window.budWizOneOffAmount=function(t,e,n){const s=window._budget.oneOffs.find(o=>o.id===t);if(!s)return;const r=document.getElementById("bw-oerr-"+t),i=String(e).trim();if(i==="")s.amount=null,r&&(r.textContent="");else{const o=Ms(i);if(o==null){r&&(r.textContent="Couldn’t read that — a number or a simple sum works.");return}r&&(r.textContent=""),s.amount=o,n&&(n.value=o)}budTouch(),Ei()};window.budWizAddOneOff=function(){window._budget.oneOffs.push({id:St(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),budTouch(),xt(!0)};window.budWizRemoveOneOff=function(t){const e=window._budget.oneOffs.findIndex(n=>n.id===t);e<0||(zl("oneOff",window._budget.oneOffs[e],e),window._budget.oneOffs.splice(e,1),budTouch(),xt(!0))};window.budWizClearAmounts=function(){for(const t of window._budget.lines)t.annual=null;for(const t of window._budget.oneOffs)t.amount=null;budTouch(),xt(),showToast("Amounts cleared — nothing is saved until you choose Save.","info",4e3)};window.budWizSave=async function(t){await saveBudgetUI(),t&&await applyBudgetToPlan(),closeBudgetWizard()};function Ei(){const t=document.getElementById("budWizTotals");if(!t)return;const e=window._budget,n=mi(e);t.innerHTML="Essential <strong>"+O(n.essentialMonthlyNet)+"</strong>/mo · Lifestyle <strong>"+O(n.comfortableMonthlyNet-n.essentialMonthlyNet)+"</strong>/mo · All-in"+(n.sharedWithPartner?" (your share)":"")+' <strong style="color:var(--primary,#6366f1);">'+O(n.allInComfortableMonthly)+"</strong>/mo"}function OS(t){if(t==="intro"){const i=window._budget.lines.some(c=>c.annual)||window._budget.oneOffs.some(c=>c.amount)?'<div class="alert alert-warning" style="margin-bottom:12px;"><strong>You already have a saved budget</strong> — the totals in the bar below are your own saved figures, and each screen shows them ready to edit. Prefer a clean slate? <button type="button" class="risk-btn" style="padding:4px 12px; margin-left:4px;" onclick="budWizClearAmounts()">Start fresh — clear all amounts</button><span style="color:var(--text-muted);"> (nothing is saved until you choose Save at the end)</span></div>':"",o=Oo(window._budget),a=(c,d)=>'<button type="button" class="risk-btn'+(o===c?" active":"")+'" data-tier="'+c+`" onclick="setPlsaTier('`+c+`')">`+d+"</button>";return'<h2 style="margin-bottom:10px;">Let’s build your budget</h2><p style="margin-bottom:12px;">We’ll walk through your spending one category at a time — bills first, then the fun stuff, then the big occasional costs. Skip anything; you can come back any time.</p>'+i+'<div style="margin-bottom:12px;"><div style="font-size:15px; margin-bottom:6px;"><strong>What are you aiming for?</strong> <span style="color:var(--text-muted);">— sets every typical-£ suggestion</span></div><div id="budWizTierBtns" style="display:flex; gap:8px; flex-wrap:wrap;">'+a("minimum","Minimum")+a("moderate","Moderate")+a("comfortable","Comfortable")+'</div><div style="font-size:13px; color:var(--text-muted); margin-top:6px;">PLSA Retirement Living Standards: Minimum = essentials, no car; Moderate = a car + two weeks in Europe; Comfortable = more of everything.</div></div><div class="alert alert-info" style="margin-bottom:12px;"><strong>Before you start:</strong> open your banking app and look at the last 2–3 months of statements. Real numbers beat guesses — most people who guess miss 20% of their spending.</div><ul style="padding-left:18px; color:var(--text-muted); line-height:1.8;"><li>Every amount box is a <strong>calculator</strong> — type <code>11.99+8.99+5.99</code> or <code>4×52/12</code> and it does the maths.</li><li><strong>Typical UK figures</strong> (ONS retired households) appear as one-tap chips when you’re unsure.</li><li>The <strong>&Sigma;</strong> button breaks a cost into parts (fuel + insurance + MOT…) so nothing gets forgotten.</li><li>Everything is in <strong>today’s money</strong>.</li>'+(window._budget.sharedWithPartner?"<li>Mark each line <strong>Me / Partner / Shared</strong> — your plan funds your share; your partner sees theirs.</li>":"")+"</ul>"}if(t==="oneoffs")return'<h2 style="margin-bottom:6px;">One-off & periodic costs</h2><p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">Big costs that land in a specific year: cars, roofs, weddings, milestone trips, helping the kids. Give recurring ones an "every N years" and we average them into your monthly need; one-time items stay as dated events.</p>'+(window._budget.oneOffs.map(NS).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing yet — add the big things below.</p>')+'<button type="button" class="risk-btn" style="margin-top:10px;" onclick="budWizAddOneOff()">+ Add a one-off</button>';if(t==="review"){const r=mi(window._budget),i=I0.single,o=r.allInComfortableAnnual,a=o>=i.comfortable?"at or above <strong>Comfortable</strong>":o>=i.moderate?"between <strong>Moderate</strong> and <strong>Comfortable</strong>":o>=i.minimum?"between <strong>Minimum</strong> and <strong>Moderate</strong>":"below the <strong>Minimum</strong>";let c='<h2 style="margin-bottom:10px;">Your spending picture</h2><div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;"><div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(r.sharedWithPartner?" — your share":"")+'</div><div style="font-size:24px;font-weight:700;">'+O(r.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div><div><div style="font-size:12px;color:var(--text-muted);">'+(r.sharedWithPartner?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:28px;font-weight:800;color:var(--primary,#6366f1);">'+O(r.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+O(o)+"/yr — what your plan funds</div></div>";r.sharedWithPartner&&(c+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:24px;font-weight:700;">'+O(r.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">their side — they can plan with this</div></div>'),c+="</div>",c+='<div class="alert alert-info" style="margin-bottom:14px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+O(i.minimum)+" · Moderate "+O(i.moderate)+" · Comfortable "+O(i.comfortable)+" per year — you’re "+a+'. <span style="color:var(--text-muted);">(Home owned outright; excludes care costs.)</span></div>';const d=co(window._budget).slice(0,8);return d.length&&(c+='<div style="margin-bottom:14px;"><div style="font-size:13px; margin-bottom:6px;"><strong>Did you miss anything?</strong> Tap to add, then find it on its category screen:</div><div style="display:flex; flex-wrap:wrap; gap:6px;">'+d.map(u=>'<button type="button" class="budwiz-chip" title="'+Ie(u.hint||"")+`" onclick="budWizSuggest('`+Ie(u.label).replace(/'/g,"\\'")+`', null)">+ `+Ie(u.label)+"</button>").join("")+"</div></div>"),c+='<div style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">Everything is saved automatically as you type.</div>',c+='<div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:6px;"><button type="button" onclick="budWizSave(false)">Done</button><button type="button" onclick="budWizSave(true)">Set as my plan’s target (Stress + Decision) &amp; finish</button></div>',c}const e=$o.find(r=>r.key===t),n=window._budget.lines.filter(r=>BS(r)===e.key),s=co(window._budget).filter(r=>(eh[r.label.toLowerCase()]||"extras")===e.key);return'<h2 style="margin-bottom:6px;">'+e.title+'</h2><div class="alert alert-info" style="margin-bottom:10px; font-size:13px;">'+e.tip+"</div>"+(n.map(LS).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing here yet — add below.</p>')+`<div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; align-items:center;"><button type="button" class="risk-btn" onclick="budWizAddLine('`+e.key+`')">+ Add your own</button>`+(s.length?'<span style="font-size:12px;color:var(--text-muted);">Often forgotten:</span>'+s.map(r=>'<button type="button" class="budwiz-chip" title="'+Ie(r.hint||"")+`" onclick="budWizSuggest('`+Ie(r.label).replace(/'/g,"\\'")+"','"+e.key+`')">+ `+Ie(r.label)+"</button>").join(""):"")+"</div>"}function xt(t=!1){const e=document.getElementById("budWizardOverlay"),n=e.querySelector(".budwiz-body"),s=t&&n?n.scrollTop:0,r=Ui[zn],i=zn===Ui.length-1,o=Ui.map((a,c)=>'<span class="budwiz-dot '+(c===zn?"on":c<zn?"done":"")+'"></span>').join("");e.innerHTML='<div class="budwiz-shell"><div class="budwiz-head" style="display:flex; justify-content:space-between; align-items:center;"><div style="font-size:13px; color:var(--text-muted);">Budget walk-through · step '+(zn+1)+" of "+Ui.length+'</div><button type="button" class="risk-btn" style="padding:4px 12px;" title="Close (your entries are kept)" onclick="closeBudgetWizard()">&times;</button></div><div class="budwiz-body">'+OS(r)+'</div><div class="budwiz-foot"><button type="button" class="risk-btn" onclick="budWizGo(-1)"'+(zn===0?" disabled":"")+">Back</button>"+(i?"":'<button type="button" onclick="budWizGo(1)">'+(r==="intro"?"Start":"Next")+"</button>")+'<div class="budwiz-dots">'+o+'</div><div id="budWizUndoSlot" style="font-size:13px; color:var(--text-muted);"></div><div id="budWizTotals" style="margin-left:auto; font-size:13px; color:var(--text-muted);"></div></div></div>',Ei(),e.querySelector(".budwiz-body").scrollTop=s}window.openStressExplainer=function(t){let e=document.getElementById("stressExplainer");e&&e.remove(),e=document.createElement("div"),e.id="stressExplainer",e.style.cssText="position:fixed; inset:0; z-index:1300; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; padding:20px;",e.innerHTML=`<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; max-width:720px; width:100%; max-height:88vh; overflow-y:auto; padding:28px; font-size:15px; line-height:1.65;"><h2 style="margin-bottom:4px;">What the Stress Tester is doing</h2><p style="color:var(--text-muted); margin-bottom:18px;">Every run asks the same question — <em>“if the future looked like this, would your money last?”</em> — and simulates your plan month by month: withdrawals sized to your spending need, tax paid, the ISA bridge drawn tax-free, protection mode in downturns. The three tabs differ only in <strong>where the “future” comes from</strong>.</p><div id="sx-mc" style="border-left:3px solid var(--primary,#6366f1); padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">🎲 Monte Carlo — a thousand plausible futures</h3><p style="color:var(--text-muted);">We deal 1,000 different futures by <strong>shuffling real history</strong>: each simulated year is a randomly-drawn year from 1928–2024, keeping that year’s stock market return and inflation together as they actually happened. Your plan is run through all 1,000; the headline number is how many survive. It answers: <em>“across a wide spread of plausible futures, what are my odds?”</em></p></div><div id="sx-hist" style="border-left:3px solid #14b8a6; padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">📜 Historical — every real retirement since 1928</h3><p style="color:var(--text-muted);">No shuffling: we replay history <strong>in order</strong>, once for every possible start year — retiring into 1929, into 1966, into 1973, into 2000… This is the classic sequence-of-returns test: the <em>order</em> of good and bad years matters as much as the average, and this tab shows exactly which real-world start years would have sunk your plan.</p></div><div id="sx-scen" style="border-left:3px solid #e67e22; padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">🔥 Scenarios — named nightmares, on repeat</h3><p style="color:var(--text-muted);">Five hand-picked 10-year sequences — the Great Depression, 1970s stagflation, the 2000s lost decade, 2008, and a synthetic worst-case — <strong>looped for your whole horizon</strong>. Deliberately unfair: a 35-year plan gets the 1970s three and a half times over. If your plan survives these, sequence risk is well covered; treat them as a stress rig, not a forecast.</p></div><h3 style="margin:20px 0 6px;">How each asset category is modelled</h3><p style="color:var(--text-muted); margin-bottom:8px;">Every future is built from just <strong>two primitives per year: the equity return and inflation</strong>. Everything else is derived from them, the same way in all three tabs:</p><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:12px; line-height:1.8;"><li><strong>Shares</strong> (trackers, income, REITs, EM, small-cap) ride the equity path directly.</li><li><strong>Bonds</strong> earn their own yield, and gain or lose as a <strong>gilt-yield path derived from inflation</strong> moves — so long gilts crash in a 2022-style inflation spike (big duration × rising yields) and rally in a 2008-style flight to quality. Your own bond-class mix (short gilts, linkers, credit…) drives the blend.</li><li><strong>Diversifiers</strong>: gold hedges inflation and tends to rise in crashes; trend-following holds a lagged momentum position (pays in long grinding bear markets, whipsaws in V-shapes); commodities hedge inflation hardest but fall <em>with</em> shares in a demand shock.</li><li><strong>Cash</strong> follows a rate model tied to inflation (roughly −1% real — the FCA convention).</li><li><strong>Your ISA</strong>: if you tagged your own funds, it’s modelled at <em>its</em> mix through all of the above; with a risk level only, it grows at a deliberately modest flat rate (the cash-like “bridge”).</li></ul><h3 style="margin:16px 0 6px;">Are the asset classes correlated? Yes — three ways</h3><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:12px; line-height:1.8;"><li><strong>Equity↔inflation:</strong> years are sampled (or replayed) whole, so “bad market + high inflation” arrive together exactly as often as they did in real history.</li><li><strong>Structural:</strong> bonds are mechanically linked to inflation through the yield path; gold, commodities and trend are functions of the same two primitives.</li><li><strong>Regime-aware residuals:</strong> each bond and diversifier class carries a correlation to equities that <em>changes with the regime</em> — in a normal year gilts barely co-move; in an inflation shock everything falls together (2022); in a deflationary crash gilts flip <em>negative</em> (flight to quality) while credit blows out <em>with</em> equities.</li></ul><h3 style="margin:16px 0 6px;">Honest limitations</h3><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:16px; line-height:1.8;"><li>In Historical replays, only shares-and-inflation are literal history — bond, gold and commodity returns are <em>model-implied</em> from those primitives, not the measured returns of that year.</li><li>Monte Carlo samples each year independently — real markets have some momentum and mean-reversion it doesn’t capture (the Historical tab covers that gap).</li><li>Categories are modelled, not individual funds — your specific fund can beat or trail its category.</li><li>The calibration figures are long-run estimates, not predictions. This is modelling, not advice.</li></ul><button type="button" onclick="document.getElementById('stressExplainer').remove()">Got it</button></div>`,e.addEventListener("click",s=>{s.target===e&&e.remove()}),document.body.appendChild(e);const n={mc:"sx-mc",hist:"sx-hist",scen:"sx-scen"}[t];if(n){const s=document.getElementById(n);s&&(s.scrollIntoView({block:"start"}),s.style.background="rgba(99,102,241,0.08)")}};let jr="funds",rs=null,un=null,oi=[];window.openAdminPanel=function(){const t=p6();if(t){const e=prompt("Admin passphrase:");if(e!==t){e!==null&&showToast("Wrong passphrase","error");return}}rs=Ml().map(e=>({...e})),un=JSON.parse(JSON.stringify(m6()||{})),document.getElementById("adminPanelOverlay").style.display="block",ds()};window.closeAdminPanel=function(){document.getElementById("adminPanelOverlay").style.display="none"};window.adminSetTab=function(t){jr=t,ds(!0)};window.adminSaveLinkers=async function(){const e=(document.getElementById("adminLinkersCsv").value||"").trim().split(`
`).map(n=>n.split(",").map(s=>s.trim())).filter(n=>n.length>=3);if(!e.length){showToast("Paste CSV rows first (name,coupon,maturity,lag)","warning");return}try{const n=await v6(e.map(s=>({name:s[0],coupon:+s[1],maturity:+s[2],lag:+s[3]||3})));document.getElementById("adminLinkersStatus").textContent=n+" gilts published ✓",showToast("Linker universe updated ("+n+" gilts)","success")}catch(n){showToast("Import failed: "+n.message,"error")}};function FS(t,e){const n=u0();let s="";for(const r of["shares","bonds","diversifiers","cash"]){const i=n[r]||[];s+='<optgroup label="'+ju[r]+'">'+i.map(o=>'<option value="'+o.key+'"'+(o.key===e?" selected":"")+">"+o.label+"</option>").join("")+"</optgroup>"}return'<select onchange="adminFundField('+t+`,'subClass',this.value)" style="width:200px;">`+s+"</select>"}window.adminFundField=function(t,e,n){const s=rs[t];s&&(s[e]=e==="ticker"?String(n).toUpperCase():n)};window.adminFundRemove=function(t){rs.splice(t,1),ds(!0)};window.adminFundAdd=function(){rs.push({ticker:"",name:"",subClass:"worldGrowth"}),ds(!0)};window.adminSaveFunds=async function(){try{const t=await y6(rs);vr("ss",!0),vr("ds",!0),showToast("Fund catalogue saved to cloud ("+t+" funds) — live for all users.","success")}catch(t){showToast("Save failed: "+t.message,"error")}};window.adminRevertFunds=async function(){if(await appConfirm("Remove the cloud fund-catalogue override and return to the shipped default list?"))try{await b6(),rs=Ml().map(t=>({...t})),vr("ss",!0),vr("ds",!0),ds(!0),showToast("Reverted to the shipped catalogue.","success")}catch(t){showToast("Revert failed: "+t.message,"error")}};window.adminProfileField=function(t,e,n){const s=wu[t][e],r=n===""?void 0:+n;r===void 0||!Number.isFinite(r)||r===s?un[t]&&(delete un[t][e],Object.keys(un[t]).length||delete un[t]):(un[t]=un[t]||{})[e]=r};window.adminSaveProfiles=async function(){try{await Z0(un),showToast(Object.keys(un).length?"Category model overrides saved — live for all users.":"No overrides — shipped calibration active.","success")}catch(t){showToast("Save failed: "+t.message,"error")}};window.adminResetProfiles=async function(){if(await appConfirm("Clear ALL category-model overrides and return to the shipped calibration?")){un={};try{await Z0(null),ds(!0),showToast("Shipped calibration restored.","success")}catch(t){showToast("Reset failed: "+t.message,"error")}}};window.adminLoadSuggestions=async function(){try{oi=await E6(),ds(!0)}catch(t){showToast("Could not load suggestions: "+t.message,"error")}};window.adminSuggestionToFunds=function(t){const e=oi[t];e&&(rs.push({ticker:e.ticker,name:e.name||"",subClass:e.subClass||"worldGrowth"}),adminDeleteSuggestion(t,!0),jr="funds",ds(!0),showToast(e.ticker+' added to the funds editor — press "Save to cloud" to publish.',"info",4500))};window.adminDeleteSuggestion=async function(t,e){const n=oi[t];if(n){oi.splice(t,1);try{await T6(n.id)}catch{}e||ds(!0)}};function VS(){if(jr==="funds"){const e=rs.map((n,s)=>'<tr><td><input type="text" value="'+Ie(n.ticker)+'" oninput="adminFundField('+s+`,'ticker',this.value)" style="width:80px;text-transform:uppercase;"></td><td><input type="text" value="`+Ie(n.name)+'" oninput="adminFundField('+s+`,'name',this.value)" style="width:280px;"></td><td>`+FS(s,n.subClass)+'</td><td><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminFundRemove('+s+')">&times;</button></td></tr>').join("");return'<p style="font-size:13px;color:var(--text-muted);">The shared catalogue every user sees. Saving publishes a cloud override; revert returns to the list shipped in code. Each fund’s category decides which model it runs through.</p><div style="display:flex;gap:8px;margin:8px 0;"><button type="button" class="risk-btn" onclick="adminFundAdd()">+ Add fund</button><button type="button" onclick="adminSaveFunds()">Save to cloud</button><button type="button" class="risk-btn" onclick="adminRevertFunds()">Revert to shipped list</button><span style="font-size:12px;color:var(--text-muted);align-self:center;">'+rs.length+' funds</span></div><div style="overflow-x:auto;"><table style="font-size:13px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Ticker</th><th style="text-align:left;">Name</th><th style="text-align:left;">Category (model)</th><th></th></tr></thead><tbody>'+e+"</tbody></table></div>"}if(jr==="linkers")return'<div style="padding:4px 2px;"><p class="hint">Index-linked gilt universe (Appendix C). Paste CSV rows: <code>name,coupon,maturity,lag</code>. Saving replaces the bundled snapshot for all users and refreshes the staleness clock. The DMO gilts-in-issue page is the source of truth.</p><textarea id="adminLinkersCsv" style="width:100%;min-height:180px;font-family:monospace;font-size:12px;" placeholder="0⅛% IL Treasury Gilt 2036,0.125,2036,3"></textarea><div class="row-flex" style="margin-top:8px;"><button type="button" onclick="adminSaveLinkers()">Import &amp; publish</button><span class="hint" id="adminLinkersStatus"></span></div></div>';if(jr==="categories"){const e=["nominalReturn","yield","vol","eqCorr","duration","inflationBeta","creditBeta","idioVol"],n=Object.entries(wu).map(([s,r])=>{const i=un[s]||{},o=e.map(a=>{if(r[a]===void 0&&i[a]===void 0)return'<td style="color:var(--text-muted);text-align:center;">—</td>';const c=i[a]!==void 0?i[a]:r[a],d=i[a]!==void 0;return'<td><input type="number" step="0.001" value="'+c+'" title="Shipped default: '+r[a]+`" onchange="adminProfileField('`+s+"','"+a+`',this.value)" style="width:74px;`+(d?"border-color:#eab308;":"")+'"></td>'}).join("");return'<tr><td style="white-space:nowrap;"><strong>'+r.label+'</strong><br><span style="font-size:11px;color:var(--text-muted);">'+s+" · "+r.bucket+"</span></td>"+o+"</tr>"}).join("");return'<p style="font-size:13px;color:var(--text-muted);">The calibration seeds behind each category’s model (nominal figures; see SubAssetModel.js for the driver decomposition). Amber border = overridden vs shipped. Changes go live for all users on save — tune with care; the golden tests only protect the shipped values.</p><div style="display:flex;gap:8px;margin:8px 0;"><button type="button" onclick="adminSaveProfiles()">Save overrides to cloud</button><button type="button" class="risk-btn" onclick="adminResetProfiles()">Reset all to shipped</button></div><div style="overflow-x:auto;"><table style="font-size:12px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Category</th>'+e.map(s=>"<th>"+s+"</th>").join("")+"</tr></thead><tbody>"+n+"</tbody></table></div>"}return'<p style="font-size:13px;color:var(--text-muted);">Unknown tickers users categorised themselves. “Add to funds” copies one into the Funds editor (publish from there).</p><button type="button" class="risk-btn" onclick="adminLoadSuggestions()" style="margin:8px 0;">Refresh</button><div style="overflow-x:auto;"><table style="font-size:13px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Ticker</th><th style="text-align:left;">Chosen category</th><th style="text-align:left;">Name</th><th></th></tr></thead><tbody>'+(oi.length?oi.map((e,n)=>"<tr><td><strong>"+Ie(e.ticker)+"</strong></td><td>"+Ie(e.subClass||"(none)")+'</td><td style="color:var(--text-muted);">'+Ie(e.name||"")+'</td><td><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminSuggestionToFunds('+n+')">Add to funds</button> <button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminDeleteSuggestion('+n+')">Dismiss</button></td></tr>').join(""):'<tr><td colspan="4" style="color:var(--text-muted);">Nothing loaded — press Refresh.</td></tr>')+"</tbody></table></div>"}function ds(t=!1){const e=document.getElementById("adminPanelOverlay"),n=e.querySelector(".budwiz-body"),s=t&&n?n.scrollTop:0,r=(i,o)=>'<button type="button" class="risk-btn'+(jr===i?" active":"")+`" onclick="adminSetTab('`+i+`')">`+o+"</button>";e.innerHTML='<div class="budwiz-shell"><div class="budwiz-head" style="display:flex; justify-content:space-between; align-items:center;"><div style="display:flex; gap:8px; align-items:center;"><strong>⚙ Administration</strong>'+r("funds","Funds")+r("categories","Category models")+r("suggestions","Suggestions")+r("linkers","Linkers")+'</div><button type="button" class="risk-btn" style="padding:4px 12px;" onclick="closeAdminPanel()">&times;</button></div><div class="budwiz-body">'+VS()+"</div></div>",e.querySelector(".budwiz-body").scrollTop=s}let dd=!1,ud=!1;async function Ti(){try{const t=await Ze();return!!(t&&t.locked)}catch(t){return console.warn("Could not read decision settings for lock state:",t),!1}}async function zy(){try{const[t,e,n]=await Promise.all([Ze(),qs({limit:1e3}),cs()]);if(n&&Object.values(n).some(i=>i&&i.yearSetupComplete))return!0;const s=$0(t);return(Array.isArray(e)?e:[]).some(i=>i.settingsChecksum===void 0||i.settingsChecksum===s)}catch(t){return console.warn("Could not determine derived-data state:",t),!0}}function kp(t){const e=document.getElementById("decision-decisionsettings");e&&e.querySelectorAll("input, select, textarea, button").forEach(n=>{n.closest("#dsLockBanner")||n.id!=="dsSaveBtn"&&(n.disabled=!t)})}async function sh(){const t=document.getElementById("dsLockBanner"),e=document.getElementById("dsSaveBtn");if(!(!t||!e)){if(dd=await Ti(),!dd){t.style.display="none",kp(!0),e.textContent="Save Settings",e.classList.remove("btn-locked"),nd();return}ud=!await zy(),t.style.display="flex",t.className="lock-banner",ud?t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Nothing has been recorded against them yet — no tax years, no monthly entries — so you can unlock and edit them.</span><button type="button" onclick="unlockDecisionSettings()">Unlock to edit</button>':t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Tax years or monthly entries have been recorded against them, so they can’t be changed. To use different settings, create a new plan.</span><button type="button" onclick="createNewPlanForSettings()">Create new plan</button>',kp(!1),e.textContent="🔒 Locked",e.classList.add("btn-locked"),nd()}}window.unlockDecisionSettings=async function(){if(await zy()){showToast("Can’t unlock — tax years or entries now depend on these settings. Create a new plan.","warning"),await sh();return}ct("Unlocking…");try{await mr({locked:!1}),await Fl(),showToast("Settings unlocked — you can edit them now.","success")}catch(t){console.error("Unlock error:",t),showToast("Could not unlock: "+t.message,"error")}finally{dt()}};window.createNewPlanForSettings=function(){const t=document.getElementById("scenarioNewBtn");t&&t.click()};window.saveDecisionSettingsUI=async function(){if(!ut()){showToast("Please sign in to save settings","error");return}if(dd||await Ti()){showToast(ud?"These settings are locked. Use “Unlock to edit” above to change them.":"These settings are locked. Define a new plan to use different settings.","info");return}const t=Cl(document.getElementById("dsSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ds");if(await Yu(e.equityMin,e.bondMin,e.cashTarget)){ct("Saving settings...");try{await mr({configured:!0,accessMethod:document.getElementById("dsAccessMethod").value||"drawdown",ufplsYears:+document.getElementById("dsUfplsYears").value||null,ufplsThenPcls:document.getElementById("dsUfplsPcls").checked,bandFillRecycle:document.getElementById("dsBandFillRecycle").checked,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("dsDuration").value,equityGlideEnabled:document.getElementById("dsEquityGlide").checked,baseSalary:+document.getElementById("dsBaseSalary").value,spendingProfile:document.getElementById("dsSpendingProfile").value||"flat",spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,disableProtection:document.getElementById("dsDisableProtection").checked,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value,isaBalance:+document.getElementById("dsIsaBalance").value||0,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:Gu("ds"),taggedFunds:Yt("ds").filter(n=>n.ticker&&n.value>0),locked:!0});try{const n=await Ze(),s=.04;await K_({savedAt:new Date().toISOString(),engineVersion:Us,assumedCpi:s,baseSalary:n.baseSalary,drawdown:Du({...n,taxMode:n.taxMode||"inflates",pa:n.pa||12570,brl:n.brl||50270,hrl:n.hrl||125140},n.duration||35,s).map(r=>({year:r.year,sippDraw:Math.round(r.sippDraw),tax:Math.round(r.tax),isaDraw:Math.round(r.isaDraw),isaBalance:Math.round(r.isaBalance),spendable:Math.round(r.spendable)})),glidepath:i0(n,s).map(r=>({year:r.year,totalMin:Math.round(r.totalMin)}))})}catch(n){console.warn("Plan-of-record snapshot failed (non-fatal):",n)}Ll(),updateNextStepBanner(),showToast("Settings saved and locked. Create a new plan to use different settings.","success",4e3),await sh()}catch(n){console.error("Error saving decision settings:",n),showToast("Error saving: "+n.message,"error")}finally{dt()}}};window.resetDecisionSettingsUI=async function(){if(await appConfirm("Reset all decision settings to defaults?")){ct("Resetting settings...");try{await mr({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await Fl(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{dt()}}};window.showDrawdownScheduleUI=async function(){const t=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const n=await De();n.duration=e;const s=Du(n,e,t);let r='<div class="card"><h2>Projected Drawdown Schedule (SIPP + ISA bridge)</h2>';r+='<div class="alert alert-info" style="margin-bottom:16px;">SIPP is drawn to fill the basic-rate band; the tax-free <strong>ISA tops your income up to the target</strong> and runs down over the years (the bridge to the State Pension). Deterministic projection at your assumed inflation — the stochastic ISA path is in the Monte-Carlo / Historical results.</div>',r+='<div style="overflow-x: auto;"><table>',r+="<thead><tr><th>Year</th><th>SIPP Draw</th><th>State</th><th>Tax</th><th>Net (SIPP+SP)</th><th>ISA Top-up</th><th>Spendable</th><th>ISA Left</th></tr></thead>",r+="<tbody>";for(const i of s)r+=`<tr>
            <td>${i.year}</td>
            <td style="color: var(--primary); font-weight: 600;">${j(i.sippDraw)}</td>
            <td>${j(i.statePension)}</td>
            <td style="color: var(--danger);">-${j(i.tax)}</td>
            <td>${j(i.netIncome)}</td>
            <td style="color: var(--info);">${j(i.isaDraw)}</td>
            <td style="color: var(--success); font-weight: 600;">${j(i.spendable)}</td>
            <td>${j(i.isaBalance)}</td>
          </tr>`;r+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=r}catch(n){console.error("Drawdown error:",n),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};window.showGlidepathUI=async function(){const t=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const n=await De();n.duration=e;const s=i0(n,t),r=Du(n,e,t),i={};r.forEach(u=>{i[u.year]=u.isaBalance});const o=!!n.equityGlideEnabled,a=(n.diversifierStart||0)>0,c=!!n.hodlEnabled&&(n.hodlValue||0)>0;let d='<div class="card"><h2>Fund Glidepath Over Time</h2>';d+='<div class="alert alert-info" style="margin-bottom: 20px;">',d+=o?"<strong>Bond tent on:</strong> the equity share (Shares %) RISES over the early years then holds; the £ floors inflate with CPI and deplete over time, cash holds its real value, and the ISA bridge runs down as it tops up income.":"<strong>Glidepath:</strong> Equity & Bond minimums inflate with CPI but deplete over time to £0; cash inflates only (holds real value); the ISA bridge runs down as it tops up income. Turn on the bond tent in Settings to see the equity share rise.",a&&(d+=" Your diversifiers sleeve (gold + trend/macro — e.g. CGT, PNL) is held flat as a crisis reserve."),c&&(d+=" The Break-Glass HODL reserve is shown separately and untouched until an emergency."),d+="</div>",d+='<div class="table-scroll-container"><table>',d+="<thead><tr><th>Year</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th>"+(a?"<th>Diversifiers</th>":"")+(c?"<th>HODL</th>":"")+"<th>Shares % (of pot)</th><th>ISA Balance</th><th>Total Min</th></tr></thead>",d+="<tbody>";for(const u of s){const p=Math.round((u.equityShareOfPot||0)*100);d+=`<tr>
            <td>${u.year}</td>
            <td style="color: var(--success);">${j(u.equityMin)}</td>
            <td style="color: var(--info);">${j(u.bondMin)}</td>
            <td style="color: var(--warning);">${j(u.cashTarget)}</td>
            ${a?`<td>${j(u.diversifier||0)}</td>`:""}
            ${c?`<td>${j(u.hodl||0)}</td>`:""}
            <td style="font-weight: 600;">${p}%</td>
            <td>${j(i[u.year]||0)}</td>
            <td style="font-weight: 600;">${j(u.totalMin)}</td>
          </tr>`}d+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=d}catch(n){console.error("Glidepath error:",n),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};let Qt=null,dn=[],yn="all";async function zS(t){const e=document.getElementById("planVsActual");if(e)try{const n=await j_();if(!n||!t||!t.length){e.innerHTML="";return}const s={};for(const i of t){const o=i.yearNum??0;(s[o]=s[o]||[]).push(i)}let r="";for(const i of Object.keys(s).map(Number).sort((o,a)=>o-a)){const o=n.drawdown[i];if(!o)continue;const a=s[i],c=a.reduce((v,y)=>v+(y.sipp||0),0)/a.length,d=a.reduce((v,y)=>v+(y.taxPaidMonthly||y.monthlyTax||0),0),u=a[a.length-1].isaBalance??null,p=o.sippDraw/12,f=c-p,g=v=>(v>=0?"+":"−")+O(Math.round(Math.abs(v)));r+="<tr><td>Year "+i+' <span class="hint">('+a.length+" mo)</span></td><td>"+O(Math.round(p))+"/mo</td><td>"+O(Math.round(c))+'/mo <span class="hint">('+g(f)+")</span></td><td>"+O(Math.round(o.tax))+"</td><td>"+O(Math.round(d*(12/a.length)))+'<span class="hint">/yr pace</span></td><td>'+O(Math.round(o.isaBalance))+(u!=null?' <span class="hint">vs '+O(Math.round(u))+"</span>":"")+"</td></tr>"}if(!r){e.innerHTML="";return}e.innerHTML='<div class="settings-section" style="margin-bottom:14px;"><div class="section-title">Plan vs actual <span style="font-weight:normal;font-size:12px;color:var(--text-muted);">— against the projection frozen when this plan was locked ('+new Date(n.savedAt).toLocaleDateString()+", "+(n.assumedCpi*100).toFixed(0)+'% assumed CPI)</span></div><div class="table-scroll-container"><table><thead><tr><th>Plan year</th><th>Planned draw</th><th>Actual draw</th><th>Planned tax/yr</th><th>Actual tax pace</th><th>Planned ISA left</th></tr></thead><tbody>'+r+`</tbody></table></div><p class="hint" style="margin-top:6px;">The plan of record never moves — that's its job. Your monthly recommendations always use your real fund values and entered CPI.</p></div>`}catch{e.innerHTML=""}}async function Sn(){const t=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),n=document.getElementById("historyYearFilter"),s=document.getElementById("deleteAllHistoryBtn"),r=document.getElementById("deleteYearBtn");if(!t||!e)return;if(t.innerHTML='<span class="loading">Loading...</span>',dn=await qs({sortDesc:!1,limit:500}),zS(dn),s&&(s.style.display=dn.length>0?"":"none"),r&&(r.style.display="none"),dn.length===0){t.innerHTML="",n&&(n.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const i=[...new Set(dn.map(d=>d.date.split("-")[0]))].sort().reverse();if(n){let d='<option value="all">All Years</option>';i.forEach(u=>{d+=`<option value="${u}">${u}</option>`}),n.innerHTML=d,n.value=yn}r&&(r.style.display=yn!=="all"&&dn.length>0?"":"none");const o=yn==="all"?dn:dn.filter(d=>d.date.startsWith(yn));if(o.length===0){t.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${yn}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let a="";o.forEach(d=>{const u=d.date===Qt,p=["history-tab"];u&&p.push("active"),d.inProtection&&p.push("protection");const[f,g]=d.date.split("-").map(Number),v=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],y=yn==="all"?`${v[g-1]} ${f}`:v[g-1];a+=`<button class="${p.join(" ")}" onclick="selectHistoryEntry('${d.date}')">${y}</button>`}),t.innerHTML=a;const c=document.getElementById("historyMobileSelector");if(c){let d="";o.forEach(u=>{const p=ai(u.date),f=u.inProtection?" (Protection)":"";d+=`<option value="${u.date}">${p}${f}</option>`}),c.innerHTML=d}(!Qt||!o.find(d=>d.date===Qt))&&(Qt=o[o.length-1].date),c&&(c.value=Qt),Uy(Qt),setTimeout(()=>{const d=t.querySelector(".history-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(t){yn=t,Qt=null,Sn()};function ai(t){const[e,n]=t.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][n-1]} ${e}`}function Uy(t){const e=document.getElementById("historyDetail"),n=dn.find(d=>d.date===t);if(!n){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const s=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",r=n.isTaxEfficientYear!==!1&&n.mode==="Tax-Efficient",i=n.inProtection?"warning":r?"efficient":"inefficient",o=n.inProtection?`Protection${n.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:r?"Tax-Efficient":"Standard";let a=n.source||"Unknown";n.source==="Growth"&&(n.dEquity>0||n.dBond>0)?a=`Growth (Equity: ${s(n.dEquity||0)}, Bond: ${s(n.dBond||0)})`:n.source==="Cash"&&(a=`Cash (${s(n.dCash||n.sipp||0)})`);let c=`
        <div class="no-print" style="display:flex;justify-content:flex-end;margin-bottom:12px;">
          <button class="btn secondary" onclick="printMonthlyReport('${n.date}')">Download PDF</button>
        </div>
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${ai(n.date)}</h3>
              <div style="color:var(--text-muted);font-size:13px;">Tax Year ${n.taxYear} • Year ${n.yearNum||0}</div>
            </div>
            <span class="tax-mode-badge ${i}">${o}</span>
          </div>

          ${n.inProtection&&n.reason?`
            <div style="padding:12px;background:rgba(243,156,18,0.1);border-radius:8px;margin-bottom:16px;">
              <strong style="color:var(--warning);">Protection Reason:</strong>
              <span style="color:var(--text);">${n.reason}</span>
            </div>
          `:""}
        </div>

        <!-- Fund Balances -->
        <div class="history-detail-card">
          <h3>Fund Balances</h3>
          <div class="history-grid">
            <div class="history-field">
              <label>Equity</label>
              <span class="value">${s(n.equity)}</span>
            </div>
            <div class="history-field">
              <label>Bond</label>
              <span class="value">${s(n.bond)}</span>
            </div>
            <div class="history-field">
              <label>Cash</label>
              <span class="value">${s(n.cash)}</span>
            </div>
            <div class="history-field">
              <label>Total</label>
              <span class="value" style="color:var(--primary);">${s(n.total)}</span>
            </div>
          </div>

          <!-- Glidepath targets -->
          ${n.adjEquity||n.adjBond||n.adjCash?`
            <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">GLIDEPATH TARGETS</div>
              <div class="history-grid">
                <div class="history-field">
                  <label>Equity Min</label>
                  <span class="value">${s(n.adjEquity)}</span>
                </div>
                <div class="history-field">
                  <label>Bond Min</label>
                  <span class="value">${s(n.adjBond)}</span>
                </div>
                <div class="history-field">
                  <label>Cash Target</label>
                  <span class="value">${s(n.adjCash)}</span>
                </div>
                <div class="history-field">
                  <label>Shares vs bonds (target)</label>
                  <span class="value">${n.adjEquity+n.adjBond>0?Math.round(n.adjEquity/(n.adjEquity+n.adjBond)*100)+"% / "+Math.round(n.adjBond/(n.adjEquity+n.adjBond)*100)+"%":"—"}</span>
                </div>
                <div class="history-field">
                  <label>Surplus</label>
                  <span class="value ${(n.total||0)-(n.adjEquity||0)-(n.adjBond||0)-(n.adjCash||0)>=0?"success":"danger"}">
                    ${s((n.total||0)-(n.adjEquity||0)-(n.adjBond||0)-(n.adjCash||0))}
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
              <span class="value" style="color:var(--primary);">${s(n.sipp)}</span>
            </div>
            <div class="history-field">
              <label>ISA Top-up</label>
              <span class="value">${s(n.isa)}</span>
            </div>
            <div class="history-field">
              <label>Other Income</label>
              <span class="value">${s(n.other)}</span>
            </div>
            <div class="history-field">
              <label>State Pension</label>
              <span class="value">${s(n.state)}</span>
            </div>
          </div>

          <div style="margin-top:16px;padding:16px;background:var(--card-alt);border-radius:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:500;">Total Monthly Income</span>
              <span style="font-size:20px;font-weight:600;color:var(--success);">${s(n.monthlyNet)}</span>
            </div>
          </div>

          ${n.boostAmount>0?`
            <div style="margin-top:12px;padding:12px;background:rgba(46,204,113,0.1);border-radius:8px;">
              <strong style="color:var(--success);">Tax Boost:</strong>
              <span style="color:var(--success);">+${s(n.boostAmount)}</span>
              <span style="color:var(--text-muted);font-size:12px;">(Catch-up from protection periods)</span>
            </div>
          `:""}
        </div>

        <!-- ISA/Savings Allocation -->
        ${n.yearlyIsaSavingsAllocation>0?`
          <div class="history-detail-card">
            <h3>ISA/Savings Allocation</h3>
            <div class="history-grid">
              <div class="history-field">
                <label>Year Allocation</label>
                <span class="value">${s(n.yearlyIsaSavingsAllocation)}</span>
              </div>
              <div class="history-field">
                <label>Used This Month</label>
                <span class="value">${s(n.isaSavingsUsedThisMonth||n.isa)}</span>
              </div>
              <div class="history-field">
                <label>Cumulative Used</label>
                <span class="value">${s(n.cumulativeIsaSavingsUsed)}</span>
              </div>
              <div class="history-field">
                <label>Remaining</label>
                <span class="value ${(n.yearlyIsaSavingsAllocation||0)-(n.cumulativeIsaSavingsUsed||0)>0?"success":"warning"}">
                  ${s((n.yearlyIsaSavingsAllocation||0)-(n.cumulativeIsaSavingsUsed||0))}
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
              <span class="value">${s(n.pa)}</span>
            </div>
            <div class="history-field">
              <label>Basic Rate Limit</label>
              <span class="value">${s(n.brl)}</span>
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
                <td>${s(n.taxPaidMonthly||n.monthlyTax)}</td>
                <td>${s(n.taxPaidYTD)}</td>
                <td>${s(n.taxProjectedAnnual)}</td>
              </tr>
              ${n.taxSavedMonthly>0||n.taxSavedProjectedAnnual>0?`
                <tr>
                  <td class="source-name">Tax Saved</td>
                  <td class="net-col">-${s(n.taxSavedMonthly)}</td>
                  <td class="net-col">-${s(n.taxSavedYTD)}</td>
                  <td class="net-col">-${s(n.taxSavedProjectedAnnual)}</td>
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
              <span class="value">${a}</span>
            </div>
            ${n.consecutiveDraws>0?`
              <div class="history-field">
                <label>Consecutive Cash Draws</label>
                <span class="value warning">${n.consecutiveDraws}</span>
              </div>
            `:""}
            <div class="history-field">
              <label>Remaining Months</label>
              <span class="value">${n.remainingMonths||12}</span>
            </div>
          </div>
        </div>

        <!-- Rebalancing -->
        ${n.rebal?`
          <div class="history-detail-card">
            <h3>Rebalancing Suggestions</h3>
            <div style="padding:12px;background:rgba(243,156,18,0.1);border-radius:8px;">
              ${n.rebal}
            </div>
          </div>
        `:""}

        <!-- Actions -->
        <div class="history-actions">
          <button class="btn secondary" onclick="deleteHistoryEntry('${n.date}')">Delete Entry</button>
        </div>
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===ai(t))})}window.selectHistoryEntry=function(t){Qt=t,Uy(t);const e=document.getElementById("historyMobileSelector");e&&(e.value=t);const s=document.getElementById("historyTabs").querySelector(".history-tab.active");s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(t){const e=document.getElementById("historyTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function ja(t){const[e,n]=t.split("-").map(Number);return n>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function hd(t){const e={};for(const s of t){const r=s.taxYear||ja(s.date);e[r]||(e[r]=0),e[r]+=s.isaSavingsUsedThisMonth||s.isa||0}for(const s of t)await q0(s.date);const n=await cs();for(const[s,r]of Object.entries(e))if(n[s]){const i=n[s].isaSavingsUsed||0,o=Math.max(0,i-r);await Ir(s,{...n[s],isaSavingsUsed:o})}}window.deleteHistoryEntry=async function(t){if(!ut()){showToast("Please sign in to delete entries","error");return}const e=await qs({sortDesc:!1,limit:1e3}),n=ja(t),r=e.filter(c=>(c.taxYear||ja(c.date))===n).sort((c,d)=>c.date.localeCompare(d.date)),i=r.findIndex(c=>c.date===t);if(i===-1){showToast("Entry not found","error");return}const o=i===r.length-1,a=ai(t);if(o){if(!await appConfirm(`Delete entry for ${a}?`))return;ct("Deleting entry...");try{await hd([r[i]]),showToast(`Deleted ${a}`,"success"),Qt=null,await Sn()}catch(c){console.error("Delete error:",c),showToast("Error deleting: "+c.message,"error")}finally{dt()}}else{const c=r.slice(i),d=ai(c[c.length-1].date);if(!await appConfirm(`This will delete ${c.length} entries from ${a} to ${d} in tax year ${n}.

Continue?`))return;ct(`Deleting ${c.length} entries...`);try{await hd(c),showToast(`Deleted ${c.length} entries`,"success"),Qt=null,await Sn()}catch(u){console.error("Delete error:",u),showToast("Error deleting: "+u.message,"error")}finally{dt()}}};window.deleteHistoryForTaxYear=async function(t){if(!ut()){showToast("Please sign in to delete entries","error");return}const n=(await qs({sortDesc:!1,limit:1e3})).filter(s=>(s.taxYear||ja(s.date))===t);if(n.length===0){showToast(`No history entries for tax year ${t}`,"info");return}if(await appConfirm(`Delete all ${n.length} history entries for tax year ${t}?`)){ct(`Deleting tax year ${t}...`);try{await hd(n);const s=await cs();s[t]&&await Ir(t,{...s[t],isaSavingsUsed:0}),showToast(`Deleted all entries for ${t}`,"success"),Qt=null,await Sn()}catch(s){console.error("Delete error:",s),showToast("Error deleting: "+s.message,"error")}finally{dt()}}};window.deleteHistoryForSelectedYear=async function(){if(yn==="all"){showToast("Select a specific year first","error");return}const t=`${parseInt(yn)%100}/${(parseInt(yn)+1)%100}`;await deleteHistoryForTaxYear(t)};window.deleteAllHistory=async function(){if(await appConfirm("Delete ALL history entries? This cannot be undone.")&&await appConfirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!ut()){showToast("Please sign in to delete entries","error");return}ct("Deleting all history...");try{const t=await qs({limit:1e3});for(const n of t)await q0(n.date);const e=await cs();for(const[n,s]of Object.entries(e))s.isaSavingsUsed>0&&await Ir(n,{...s,isaSavingsUsed:0});showToast(`Deleted ${t.length} entries`,"success"),Qt=null,await Sn()}catch(t){console.error("Delete all error:",t),showToast("Error deleting: "+t.message,"error")}finally{dt()}}};let er=null;async function wr(){const t=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!t||!e)return;t.innerHTML='<span class="loading">Loading...</span>';const n=await cs(),s=await Ze(),r=Object.keys(n).sort(),i=US(),o=$S(r,i,40);let a="";o.forEach(u=>{const p=n[u],f=p&&p.yearSetupComplete,g=u===er,v=["tax-year-tab"];g&&v.push("active"),f||v.push("not-setup"),a+=`<button class="${v.join(" ")}" onclick="selectTaxYear('${u}')">${u}</button>`}),t.innerHTML=a;const c=document.getElementById("taxYearMobileSelector");if(c){let u="";o.forEach(p=>{const f=n[p],v=f&&f.yearSetupComplete?p:`${p} (not set up)`;u+=`<option value="${p}">${v}</option>`}),c.innerHTML=u}if(!er){const u=r.filter(p=>{var f;return(f=n[p])==null?void 0:f.yearSetupComplete});er=u.length>0?u[u.length-1]:i}c&&(c.value=er),await $y(er,n,s);const d=t.querySelector(".tax-year-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function US(){const t=new Date,e=t.getFullYear(),n=t.getMonth()+1;return n<4||n===4&&t.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function $S(t,e,n){const s=new Set(t),[r]=e.split("/").map(Number),i=r<50?2e3+r:1900+r;for(let o=0;o<n&&s.size<n;o++){const a=i+o,c=a+1;s.add(`${String(a).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(s).sort()}async function $y(t,e,n){var S,T,x,A,_,W,ee,H,re,te,ye,he,ft,ie;const s=document.getElementById("taxYearDetail"),r=e[t];if(!r||!r.yearSetupComplete){s.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${t} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${t}')">Set Up ${t}</button>
          </div>
        `;return}const i=await Ru(t),o=Math.round(i.amount||0),a=i.startDate||"Not configured",c=i.isReceiving;i.yearsUntil;const d=z=>z!=null?"£"+Math.round(z).toLocaleString():"—",u=(n.equityMin||0)+(n.bondMin||0)+(n.cashTarget||0),p=n.duration||35,f=Math.max(0,2e3+(parseInt(t.split("/")[0],10)||26)-2026),g=!!n.equityGlideEnabled,v={equity:u>0?n.equityMin/u:.5,bond:u>0?n.bondMin/u:.4,cash:u>0?n.cashTarget/u:.1,equityGlide:g?gu(n.equityMin,n.bondMin):void 0},y=tp(v,f,p),E=tp(v,Math.max(0,f-1),p),C=z=>Math.round(z*100),k=Math.max(5,p-20),P=C(y.equity)-C(E.equity),R=`${C(y.equity)}% shares / ${C(y.bond)}% bonds / ${C(y.cash)}% cash`;let B,D;g?f>k?(D=`Holding — reached your mix at year ${k}`,B=`You've reached your endgame mix. Hold ${R}; no glide change this year.`):P>0?(D=`Rising — year ${f} of ${k}`,B=`Shift about ${P}% of your pot from bonds into shares this year, reaching ${R}.`):(D=`Rising — year ${f} of ${k}`,B=`Hold ${R}.`):(D="Flat (bond tent off)",B=`Hold a steady ${R}. Rebalance back to this whenever it drifts.`);const I=`
        <div class="tax-year-detail-card">
          <h3>This Year's Target Mix${g?" — Bond Tent":""}</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field"><label>Shares</label><span class="value">${C(y.equity)}% · ${d(u*y.equity)}</span></div>
            <div class="tax-year-field"><label>Bonds</label><span class="value">${C(y.bond)}% · ${d(u*y.bond)}</span></div>
            <div class="tax-year-field"><label>Cash</label><span class="value">${C(y.cash)}% · ${d(u*y.cash)}</span></div>
            <div class="tax-year-field"><label>Glide stage</label><span class="value">${D}</span></div>
          </div>
          <div class="alert alert-info" style="margin-top:12px;"><strong>Rebalance:</strong> ${B}</div>
        </div>`;let w=`<div class="no-print" style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:12px;"><button class="btn secondary" onclick="printAnnualReport('${t}')">Download PDF</button> <button class="btn secondary" onclick="exportAnnualCsv('${t}')">Export CSV</button></div>`+I+`
        <!-- Tax Thresholds -->
        <div class="tax-year-detail-card">
          <h3>Tax Thresholds</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Personal Allowance</label>
              <input type="number" value="${r.pa||12570}" onchange="updateTaxYear('${t}','pa',this.value)">
            </div>
            <div class="tax-year-field">
              <label>Basic Rate Limit</label>
              <input type="number" value="${r.brl||50270}" onchange="updateTaxYear('${t}','brl',this.value)">
            </div>
            <div class="tax-year-field">
              <label>Higher Rate Limit</label>
              <input type="number" value="${r.hrl||125140}" onchange="updateTaxYear('${t}','hrl',this.value)">
            </div>
            <div class="tax-year-field">
              <label>CPI (Previous Year)</label>
              <input type="number" step="0.1" value="${((r.cpi||.04)*100).toFixed(1)}" onchange="updateTaxYear('${t}','cpi',this.value/100)">
            </div>
          </div>
        </div>

        <!-- Income Configuration -->
        <div class="tax-year-detail-card">
          <h3>Income Configuration</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Target Annual Salary</label>
              <span class="value">${d(r.confirmedSalary)}</span>
            </div>
            <div class="tax-year-field">
              <label>Other Taxable Income (Annual)</label>
              <input type="number" value="${r.other||0}" onchange="updateTaxYear('${t}','other',this.value)">
            </div>
            <div class="tax-year-field">
              <label>State Pension (Annual)</label>
              <span class="value">${c?d(o)+(i.isFirstYear?" (partial year)":""):a!=="Not configured"?`Starts ${a}`:"Not configured"}</span>
            </div>
            <div class="tax-year-field">
              <label>Income Before Pension Start</label>
              <span class="value">${d(r.grossIncomeToDate)}</span>
            </div>
          </div>
        </div>

        <!-- Tax Efficiency -->
        <div class="tax-year-detail-card">
          <h3>Tax Efficiency</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Mode</label>
              <span class="tax-mode-badge ${r.isTaxEfficient?"efficient":"inefficient"}">
                ${r.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient"}
              </span>
            </div>
            <div class="tax-year-field">
              <label>ISA/Savings Allocation</label>
              <span class="value">${d(r.isaSavingsAllocation)}</span>
            </div>
            <div class="tax-year-field">
              <label>ISA/Savings Used</label>
              <span class="value">${d(r.isaSavingsUsed||0)}</span>
            </div>
            <div class="tax-year-field">
              <label>Start Month</label>
              <span class="value">${qS(r.startMonth||4)}</span>
            </div>
            <div class="tax-year-field">
              <label>Remaining Months (at setup)</label>
              <span class="value">${r.remainingMonths||12}</span>
            </div>
          </div>
        </div>
      `;if(r.expectedMonthly){const z=r.expectedMonthly;w+=`
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
                  <td>${d((S=z.sipp)==null?void 0:S.gross)}</td>
                  <td class="tax-col">-${d((T=z.sipp)==null?void 0:T.tax)}</td>
                  <td class="net-col">${d((x=z.sipp)==null?void 0:x.net)}</td>
                </tr>
                ${((A=z.other)==null?void 0:A.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${d((_=z.other)==null?void 0:_.gross)}</td>
                  <td class="tax-col">-${d((W=z.other)==null?void 0:W.tax)}</td>
                  <td class="net-col">${d((ee=z.other)==null?void 0:ee.net)}</td>
                </tr>
                `:""}
                ${((H=z.statePension)==null?void 0:H.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${d((re=z.statePension)==null?void 0:re.gross)}</td>
                  <td class="tax-col">-${d((te=z.statePension)==null?void 0:te.tax)}</td>
                  <td class="net-col">${d((ye=z.statePension)==null?void 0:ye.net)}</td>
                </tr>
                `:""}
                ${((he=z.isa)==null?void 0:he.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${d((ft=z.isa)==null?void 0:ft.gross)}</td>
                  <td style="color:var(--success);">£0</td>
                  <td class="net-col">${d((ie=z.isa)==null?void 0:ie.net)}</td>
                </tr>
                `:""}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>${d(z.totalGross)}</strong></td>
                  <td class="tax-col"><strong>-${d(z.totalTax)}</strong></td>
                  <td class="net-col"><strong>${d(z.totalNet)}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p style="margin-top:16px;font-size:14px;color:var(--text);">
              <strong>Monthly take-home: ${d(z.totalNet)}</strong>
            </p>
          </div>
        `}w+=`
        <div class="tax-year-actions">
          <button class="btn secondary" onclick="deleteTaxYear('${t}')">Delete Year</button>
          <button class="btn secondary" onclick="reconfigureTaxYear('${t}')">Reconfigure via Wizard</button>
        </div>
      `,s.innerHTML=w,document.querySelectorAll(".tax-year-tab").forEach(z=>{z.classList.toggle("active",z.textContent===t)})}window.selectTaxYear=async function(t){er=t;const e=await cs(),n=await Ze();await $y(t,e,n),document.querySelectorAll(".tax-year-tab").forEach(o=>{o.classList.toggle("active",o.textContent===t)});const s=document.getElementById("taxYearMobileSelector");s&&(s.value=t);const i=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${t}')"]`);i&&i.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(t){const e=document.getElementById("taxYearTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function qS(t){return["January","February","March","April","May","June","July","August","September","October","November","December"][(t-1)%12]||"April"}window.triggerWizardForYear=async function(t){const[e]=t.split("/").map(Number),n=e<50?2e3+e:1900+e,s=`${n}-04`,r=document.getElementById("entryMonth");r&&(r.value=s,r.dispatchEvent(new Event("input"))),document.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(i=>i.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(i=>i.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),showToast(`Please click "Calculate" with April ${n} selected to set up tax year ${t}`,"info",5e3)};window.reconfigureTaxYear=async function(t){if(await appConfirm(`This will allow you to reconfigure tax year ${t}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await Vo(t);e.yearSetupComplete=!1,await Ir(t,e),await wr(),showToast(`Tax year ${t} marked for reconfiguration. Calculate a decision for this year to run the wizard again.`,"success",5e3)}catch(e){console.error("Error:",e),showToast("Error: "+e.message,"error")}};window.updateTaxYear=async function(t,e,n){try{const s=await Vo(t);s[e]=parseFloat(n),await Ir(t,s)}catch(s){console.error("Error updating tax year:",s),showToast("Error saving: "+s.message,"error")}};window.deleteTaxYear=async function(t){if(await appConfirm("Delete tax year "+t+"? This will remove all configuration for this year."))try{const e=await Cn();delete e.taxYears[t],await Al(e),er=null,await wr()}catch(e){console.error("Error deleting tax year:",e),showToast("Error deleting: "+e.message,"error")}};window.addTaxYear=async function(){if(!ut()){showToast("Please sign in to add tax years","error");return}const t=prompt("Enter tax year (e.g., 25/26):");if(!t||!/^\d{2}\/\d{2}$/.test(t)){showToast("Invalid format. Use YY/YY (e.g., 25/26)","error");return}try{await Ir(t,{}),await wr()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error")}};console.log("Pension Planner v"+Cp+" loaded");
