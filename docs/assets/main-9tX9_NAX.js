(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();function u0(t){const e=(t.sippDraw||0)+(t.other||0)+(t.statePension||0),n=e*12,s=t.pa||12570,r=t.brl||50270,i=t.hrl||125140;let o=0;n>s&&(n<=r?o=(n-s)*.2:n<=i?o=(r-s)*.2+(n-r)*.4:o=(r-s)*.2+(i-r)*.4+(n-i)*.45);const l=t.monthlyTax!=null?t.monthlyTax:o/12,c=t.monthlyTax!=null&&t.totalMonthlyNet!=null?t.totalMonthlyNet:e-l+(t.isaDraw||0);return{date:t.date,taxYear:t.taxYear,yearNum:t.yearNumber,equity:t.equity,bond:t.bond,cash:t.cash,total:t.equity+t.bond+t.cash,adjEquity:t.adjEquityMin,adjBond:t.adjBondMin,adjCash:t.adjCashTarget,source:t.source,dEquity:t.drawFromEquity||0,dBond:t.drawFromBond||0,dCash:t.drawFromCash||0,sipp:t.sippDraw,stdSipp:t.stdSipp||t.sippDraw,isa:t.isaDraw,other:t.other,state:t.statePension,pa:s,brl:r,monthlyTax:l,monthlyNet:c,mode:t.taxEfficient?"Tax-Efficient":"Standard",inProtection:t.inProtection,reason:t.protectionReason||"",consecutiveDraws:t.consecutiveCashDraws||0,boostAmount:t.boostAmount,boostEligible:t.boostEligible||!1,rebal:t.rebalanceActions?t.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:t.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:t.isaDraw||0,cumulativeIsaSavingsUsed:t.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxFree:t.taxFree||0,recycleNet:t.recycleNet||0,accessMethod:t.accessMethod||"drawdown",taxPaidYTD:t.taxPaidYTD||l,taxProjectedAnnual:t.taxProjectedAnnual||o,taxSavedMonthly:t.taxSavedMonthly||0,taxSavedYTD:t.taxSavedYTD||0,taxSavedProjectedAnnual:t.taxSavedProjectedAnnual||0,isTaxEfficientYear:t.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:t.protectionInducedTaxEfficiency||!1,remainingMonths:t.remainingMonths||12}}const Uo={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},h0="modulepreload",f0=function(t,e){return new URL(t,e).href},ah={},lh=function(e,n,s){let r=Promise.resolve();if(n&&n.length>0){const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));r=Promise.allSettled(n.map(d=>{if(d=f0(d,s),d in ah)return;ah[d]=!0;const h=d.endsWith(".css"),m=h?'[rel="stylesheet"]':"";if(!!s)for(let T=o.length-1;T>=0;T--){const S=o[T];if(S.href===d&&(!h||S.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const w=document.createElement("link");if(w.rel=h?"stylesheet":h0,h||(w.as="script"),w.crossOrigin="",w.href=d,c&&w.setAttribute("nonce",c),document.head.appendChild(w),h)return new Promise((T,S)=>{w.addEventListener("load",T),w.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return r.then(o=>{for(const l of o||[])l.status==="rejected"&&i(l.reason);return e().catch(i)})},Qf="6.0.0",Xe={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},Jf={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},Nt={RETURN:.03,MIN:0,DRAWDOWN_STRATEGY:"minimiseEarlyTax"},me={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},Ts={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},Zs={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},Da={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},p0={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},_n={START_MONTH:4,START_DAY:6},Ba=.04,Xf=Jf.OTHER_INCOME_CAP;function ch(t,e,n=Xf){let s=t;for(const r of e)s*=1+Math.min(r,n);return s}function Vc(t){let e=t;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function wr(t,e,n){const s=Math.max(n(),1e-12),r=n();let i=Math.sqrt(-2*Math.log(s))*Math.cos(2*Math.PI*r);return i=Math.max(-4,Math.min(4,i)),t+e*i}function La(t){const e=JSON.stringify(t);let n=0;for(let s=0;s<e.length;s++){const r=e.charCodeAt(s);n=(n<<5)-n+r,n=n&n}return n.toString(16)}var dh={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zf=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let r=t.charCodeAt(s);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},m0=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const r=t[n++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=t[n++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=t[n++],o=t[n++],l=t[n++],c=((r&7)<<18|(i&63)<<12|(o&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const i=t[n++],o=t[n++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|o&63)}}return e.join("")},ep={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<t.length;r+=3){const i=t[r],o=r+1<t.length,l=o?t[r+1]:0,c=r+2<t.length,d=c?t[r+2]:0,h=i>>2,m=(i&3)<<4|l>>4;let p=(l&15)<<2|d>>6,w=d&63;c||(w=64,o||(p=64)),s.push(n[h],n[m],n[p],n[w])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Zf(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):m0(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<t.length;){const i=n[t.charAt(r++)],l=r<t.length?n[t.charAt(r)]:0;++r;const d=r<t.length?n[t.charAt(r)]:64;++r;const m=r<t.length?n[t.charAt(r)]:64;if(++r,i==null||l==null||d==null||m==null)throw new g0;const p=i<<2|l>>4;if(s.push(p),d!==64){const w=l<<4&240|d>>2;if(s.push(w),m!==64){const T=d<<6&192|m;s.push(T)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class g0 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const y0=function(t){const e=Zf(t);return ep.encodeByteArray(e,!0)},da=function(t){return y0(t).replace(/\./g,"")},tp=function(t){try{return ep.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function v0(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const b0=()=>v0().__FIREBASE_DEFAULTS__,w0=()=>{if(typeof process>"u"||typeof dh>"u")return;const t=dh.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},_0=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&tp(t[1]);return e&&JSON.parse(e)},Na=()=>{try{return b0()||w0()||_0()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},np=t=>{var e,n;return(n=(e=Na())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},E0=t=>{const e=np(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),s]:[e.substring(0,n),s]},sp=()=>{var t;return(t=Na())===null||t===void 0?void 0:t.config},rp=t=>{var e;return(e=Na())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class T0{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
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
 */function I0(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=e||"demo-project",r=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[da(JSON.stringify(n)),da(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function S0(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(vt())}function x0(){var t;const e=(t=Na())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function A0(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function k0(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function C0(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function R0(){const t=vt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function P0(){return!x0()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function M0(){try{return typeof indexedDB=="object"}catch{return!1}}function D0(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var i;e(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B0="FirebaseError";class os extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=B0,Object.setPrototypeOf(this,os.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,so.prototype.create)}}class so{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},r=`${this.service}/${e}`,i=this.errors[e],o=i?L0(i,s):"Error",l=`${this.serviceName}: ${o} (${r}).`;return new os(r,l,s)}}function L0(t,e){return t.replace(N0,(n,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const N0=/\{\$([^}]+)}/g;function O0(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function ua(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const r of n){if(!s.includes(r))return!1;const i=t[r],o=e[r];if(uh(i)&&uh(o)){if(!ua(i,o))return!1}else if(i!==o)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function uh(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ro(t){const e=[];for(const[n,s]of Object.entries(t))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function vi(t){const e={};return t.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[r,i]=s.split("=");e[decodeURIComponent(r)]=decodeURIComponent(i)}}),e}function bi(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function F0(t,e){const n=new V0(t,e);return n.subscribe.bind(n)}class V0{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,s){let r;if(e===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");z0(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:s},r.next===void 0&&(r.next=Bl),r.error===void 0&&(r.error=Bl),r.complete===void 0&&(r.complete=Bl);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function z0(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Bl(){}/**
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
 */function Pe(t){return t&&t._delegate?t._delegate:t}class er{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Hs="[DEFAULT]";/**
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
 */class U0{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new T0;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(q0(e))try{this.getOrInitializeService({instanceIdentifier:Hs})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=Hs){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Hs){return this.instances.has(e)}getOptions(e=Hs){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[i,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);s===l&&o.resolve(r)}return r}onInit(e,n){var s;const r=this.normalizeInstanceIdentifier(n),i=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;i.add(e),this.onInitCallbacks.set(r,i);const o=this.instances.get(r);return o&&e(o,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:$0(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Hs){return this.component?this.component.multipleInstances?e:Hs:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function $0(t){return t===Hs?void 0:t}function q0(t){return t.instantiationMode==="EAGER"}/**
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
 */class H0{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new U0(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ce;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(ce||(ce={}));const W0={debug:ce.DEBUG,verbose:ce.VERBOSE,info:ce.INFO,warn:ce.WARN,error:ce.ERROR,silent:ce.SILENT},Y0=ce.INFO,G0={[ce.DEBUG]:"log",[ce.VERBOSE]:"log",[ce.INFO]:"info",[ce.WARN]:"warn",[ce.ERROR]:"error"},j0=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),r=G0[e];if(r)console[r](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class zc{constructor(e){this.name=e,this._logLevel=Y0,this._logHandler=j0,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ce))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?W0[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ce.DEBUG,...e),this._logHandler(this,ce.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ce.VERBOSE,...e),this._logHandler(this,ce.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ce.INFO,...e),this._logHandler(this,ce.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ce.WARN,...e),this._logHandler(this,ce.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ce.ERROR,...e),this._logHandler(this,ce.ERROR,...e)}}const K0=(t,e)=>e.some(n=>t instanceof n);let hh,fh;function Q0(){return hh||(hh=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function J0(){return fh||(fh=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ip=new WeakMap,Ql=new WeakMap,op=new WeakMap,Ll=new WeakMap,Uc=new WeakMap;function X0(t){const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(Is(t.result)),r()},o=()=>{s(t.error),r()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&ip.set(n,t)}).catch(()=>{}),Uc.set(e,t),e}function Z0(t){if(Ql.has(t))return;const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),r()},o=()=>{s(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});Ql.set(t,e)}let Jl={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Ql.get(t);if(e==="objectStoreNames")return t.objectStoreNames||op.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Is(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function ev(t){Jl=t(Jl)}function tv(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(Nl(this),e,...n);return op.set(s,e.sort?e.sort():[e]),Is(s)}:J0().includes(t)?function(...e){return t.apply(Nl(this),e),Is(ip.get(this))}:function(...e){return Is(t.apply(Nl(this),e))}}function nv(t){return typeof t=="function"?tv(t):(t instanceof IDBTransaction&&Z0(t),K0(t,Q0())?new Proxy(t,Jl):t)}function Is(t){if(t instanceof IDBRequest)return X0(t);if(Ll.has(t))return Ll.get(t);const e=nv(t);return e!==t&&(Ll.set(t,e),Uc.set(e,t)),e}const Nl=t=>Uc.get(t);function sv(t,e,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const o=indexedDB.open(t,e),l=Is(o);return s&&o.addEventListener("upgradeneeded",c=>{s(Is(o.result),c.oldVersion,c.newVersion,Is(o.transaction),c)}),n&&o.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),l.then(c=>{i&&c.addEventListener("close",()=>i()),r&&c.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const rv=["get","getKey","getAll","getAllKeys","count"],iv=["put","add","delete","clear"],Ol=new Map;function ph(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Ol.get(e))return Ol.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,r=iv.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||rv.includes(n)))return;const i=async function(o,...l){const c=this.transaction(o,r?"readwrite":"readonly");let d=c.store;return s&&(d=d.index(l.shift())),(await Promise.all([d[n](...l),r&&c.done]))[0]};return Ol.set(e,i),i}ev(t=>({...t,get:(e,n,s)=>ph(e,n)||t.get(e,n,s),has:(e,n)=>!!ph(e,n)||t.has(e,n)}));/**
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
 */class ov{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(av(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function av(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Xl="@firebase/app",mh="0.10.13";/**
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
 */const Xn=new zc("@firebase/app"),lv="@firebase/app-compat",cv="@firebase/analytics-compat",dv="@firebase/analytics",uv="@firebase/app-check-compat",hv="@firebase/app-check",fv="@firebase/auth",pv="@firebase/auth-compat",mv="@firebase/database",gv="@firebase/data-connect",yv="@firebase/database-compat",vv="@firebase/functions",bv="@firebase/functions-compat",wv="@firebase/installations",_v="@firebase/installations-compat",Ev="@firebase/messaging",Tv="@firebase/messaging-compat",Iv="@firebase/performance",Sv="@firebase/performance-compat",xv="@firebase/remote-config",Av="@firebase/remote-config-compat",kv="@firebase/storage",Cv="@firebase/storage-compat",Rv="@firebase/firestore",Pv="@firebase/vertexai-preview",Mv="@firebase/firestore-compat",Dv="firebase",Bv="10.14.1";/**
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
 */const Zl="[DEFAULT]",Lv={[Xl]:"fire-core",[lv]:"fire-core-compat",[dv]:"fire-analytics",[cv]:"fire-analytics-compat",[hv]:"fire-app-check",[uv]:"fire-app-check-compat",[fv]:"fire-auth",[pv]:"fire-auth-compat",[mv]:"fire-rtdb",[gv]:"fire-data-connect",[yv]:"fire-rtdb-compat",[vv]:"fire-fn",[bv]:"fire-fn-compat",[wv]:"fire-iid",[_v]:"fire-iid-compat",[Ev]:"fire-fcm",[Tv]:"fire-fcm-compat",[Iv]:"fire-perf",[Sv]:"fire-perf-compat",[xv]:"fire-rc",[Av]:"fire-rc-compat",[kv]:"fire-gcs",[Cv]:"fire-gcs-compat",[Rv]:"fire-fst",[Mv]:"fire-fst-compat",[Pv]:"fire-vertex","fire-js":"fire-js",[Dv]:"fire-js-all"};/**
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
 */const ha=new Map,Nv=new Map,ec=new Map;function gh(t,e){try{t.container.addComponent(e)}catch(n){Xn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Dr(t){const e=t.name;if(ec.has(e))return Xn.debug(`There were multiple attempts to register component ${e}.`),!1;ec.set(e,t);for(const n of ha.values())gh(n,t);for(const n of Nv.values())gh(n,t);return!0}function $c(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function dn(t){return t.settings!==void 0}/**
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
 */const Ov={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ss=new so("app","Firebase",Ov);/**
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
 */class Fv{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new er("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ss.create("app-deleted",{appName:this._name})}}/**
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
 */const Yr=Bv;function ap(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Zl,automaticDataCollectionEnabled:!1},e),r=s.name;if(typeof r!="string"||!r)throw Ss.create("bad-app-name",{appName:String(r)});if(n||(n=sp()),!n)throw Ss.create("no-options");const i=ha.get(r);if(i){if(ua(n,i.options)&&ua(s,i.config))return i;throw Ss.create("duplicate-app",{appName:r})}const o=new H0(r);for(const c of ec.values())o.addComponent(c);const l=new Fv(n,s,o);return ha.set(r,l),l}function lp(t=Zl){const e=ha.get(t);if(!e&&t===Zl&&sp())return ap();if(!e)throw Ss.create("no-app",{appName:t});return e}function xs(t,e,n){var s;let r=(s=Lv[t])!==null&&s!==void 0?s:t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const l=[`Unable to register library "${r}" with version "${e}":`];i&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Xn.warn(l.join(" "));return}Dr(new er(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Vv="firebase-heartbeat-database",zv=1,Ni="firebase-heartbeat-store";let Fl=null;function cp(){return Fl||(Fl=sv(Vv,zv,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Ni)}catch(n){console.warn(n)}}}}).catch(t=>{throw Ss.create("idb-open",{originalErrorMessage:t.message})})),Fl}async function Uv(t){try{const n=(await cp()).transaction(Ni),s=await n.objectStore(Ni).get(dp(t));return await n.done,s}catch(e){if(e instanceof os)Xn.warn(e.message);else{const n=Ss.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Xn.warn(n.message)}}}async function yh(t,e){try{const s=(await cp()).transaction(Ni,"readwrite");await s.objectStore(Ni).put(e,dp(t)),await s.done}catch(n){if(n instanceof os)Xn.warn(n.message);else{const s=Ss.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Xn.warn(s.message)}}}function dp(t){return`${t.name}!${t.options.appId}`}/**
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
 */const $v=1024,qv=30*24*60*60*1e3;class Hv{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Yv(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=vh();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=qv}),this._storage.overwrite(this._heartbeatsCache))}catch(s){Xn.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=vh(),{heartbeatsToSend:s,unsentEntries:r}=Wv(this._heartbeatsCache.heartbeats),i=da(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return Xn.warn(n),""}}}function vh(){return new Date().toISOString().substring(0,10)}function Wv(t,e=$v){const n=[];let s=t.slice();for(const r of t){const i=n.find(o=>o.agent===r.agent);if(i){if(i.dates.push(r.date),bh(n)>e){i.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),bh(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class Yv{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return M0()?D0().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Uv(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return yh(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return yh(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function bh(t){return da(JSON.stringify({version:2,heartbeats:t})).length}/**
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
 */function Gv(t){Dr(new er("platform-logger",e=>new ov(e),"PRIVATE")),Dr(new er("heartbeat",e=>new Hv(e),"PRIVATE")),xs(Xl,mh,t),xs(Xl,mh,"esm2017"),xs("fire-js","")}Gv("");var jv="firebase",Kv="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */xs(jv,Kv,"app");function qc(t,e){var n={};for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.indexOf(s)<0&&(n[s]=t[s]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(t);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(t,s[r])&&(n[s[r]]=t[s[r]]);return n}function up(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Qv=up,hp=new so("auth","Firebase",up());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fa=new zc("@firebase/auth");function Jv(t,...e){fa.logLevel<=ce.WARN&&fa.warn(`Auth (${Yr}): ${t}`,...e)}function jo(t,...e){fa.logLevel<=ce.ERROR&&fa.error(`Auth (${Yr}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tn(t,...e){throw Wc(t,...e)}function un(t,...e){return Wc(t,...e)}function Hc(t,e,n){const s=Object.assign(Object.assign({},Qv()),{[e]:n});return new so("auth","Firebase",s).create(e,{appName:t.name})}function jn(t){return Hc(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Xv(t,e,n){const s=n;if(!(e instanceof s))throw s.name!==e.constructor.name&&tn(t,"argument-error"),Hc(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Wc(t,...e){if(typeof t!="string"){const n=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=t.name),t._errorFactory.create(n,...s)}return hp.create(t,...e)}function K(t,e,...n){if(!t)throw Wc(e,...n)}function Hn(t){const e="INTERNAL ASSERTION FAILED: "+t;throw jo(e),new Error(e)}function Zn(t,e){t||Hn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tc(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function Zv(){return wh()==="http:"||wh()==="https:"}function wh(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eb(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Zv()||k0()||"connection"in navigator)?navigator.onLine:!0}function tb(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class io{constructor(e,n){this.shortDelay=e,this.longDelay=n,Zn(n>e,"Short delay should be less than long delay!"),this.isMobile=S0()||C0()}get(){return eb()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yc(t,e){Zn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fp{static initialize(e,n,s){this.fetchImpl=e,n&&(this.headersImpl=n),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Hn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Hn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Hn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nb={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sb=new io(3e4,6e4);function as(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function An(t,e,n,s,r={}){return pp(t,r,async()=>{let i={},o={};s&&(e==="GET"?o=s:i={body:JSON.stringify(s)});const l=ro(Object.assign({key:t.config.apiKey},o)).slice(1),c=await t._getAdditionalHeaders();c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode);const d=Object.assign({method:e,headers:c},i);return A0()||(d.referrerPolicy="no-referrer"),fp.fetch()(mp(t,t.config.apiHost,n,l),d)})}async function pp(t,e,n){t._canInitEmulator=!1;const s=Object.assign(Object.assign({},nb),e);try{const r=new ib(t),i=await Promise.race([n(),r.promise]);r.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw $o(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const l=i.ok?o.errorMessage:o.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw $o(t,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw $o(t,"email-already-in-use",o);if(c==="USER_DISABLED")throw $o(t,"user-disabled",o);const h=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Hc(t,h,d);tn(t,h)}}catch(r){if(r instanceof os)throw r;tn(t,"network-request-failed",{message:String(r)})}}async function oo(t,e,n,s,r={}){const i=await An(t,e,n,s,r);return"mfaPendingCredential"in i&&tn(t,"multi-factor-auth-required",{_serverResponse:i}),i}function mp(t,e,n,s){const r=`${e}${n}?${s}`;return t.config.emulator?Yc(t.config,r):`${t.config.apiScheme}://${r}`}function rb(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class ib{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,s)=>{this.timer=setTimeout(()=>s(un(this.auth,"network-request-failed")),sb.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function $o(t,e,n){const s={appName:t.name};n.email&&(s.email=n.email),n.phoneNumber&&(s.phoneNumber=n.phoneNumber);const r=un(t,e,s);return r.customData._tokenResponse=n,r}function _h(t){return t!==void 0&&t.enterprise!==void 0}class ob{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return rb(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function ab(t,e){return An(t,"GET","/v2/recaptchaConfig",as(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lb(t,e){return An(t,"POST","/v1/accounts:delete",e)}async function gp(t,e){return An(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ai(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function cb(t,e=!1){const n=Pe(t),s=await n.getIdToken(e),r=Gc(s);K(r&&r.exp&&r.auth_time&&r.iat,n.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:r,token:s,authTime:Ai(Vl(r.auth_time)),issuedAtTime:Ai(Vl(r.iat)),expirationTime:Ai(Vl(r.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Vl(t){return Number(t)*1e3}function Gc(t){const[e,n,s]=t.split(".");if(e===void 0||n===void 0||s===void 0)return jo("JWT malformed, contained fewer than 3 sections"),null;try{const r=tp(n);return r?JSON.parse(r):(jo("Failed to decode base64 JWT payload"),null)}catch(r){return jo("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Eh(t){const e=Gc(t);return K(e,"internal-error"),K(typeof e.exp<"u","internal-error"),K(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Br(t,e,n=!1){if(n)return e;try{return await e}catch(s){throw s instanceof os&&db(s)&&t.auth.currentUser===t&&await t.auth.signOut(),s}}function db({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ub{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const r=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nc{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ai(this.lastLoginAt),this.creationTime=Ai(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function pa(t){var e;const n=t.auth,s=await t.getIdToken(),r=await Br(t,gp(n,{idToken:s}));K(r==null?void 0:r.users.length,n,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?yp(i.providerUserInfo):[],l=fb(t.providerData,o),c=t.isAnonymous,d=!(t.email&&i.passwordHash)&&!(l!=null&&l.length),h=c?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new nc(i.createdAt,i.lastLoginAt),isAnonymous:h};Object.assign(t,m)}async function hb(t){const e=Pe(t);await pa(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function fb(t,e){return[...t.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function yp(t){return t.map(e=>{var{providerId:n}=e,s=qc(e,["providerId"]);return{providerId:n,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pb(t,e){const n=await pp(t,{},async()=>{const s=ro({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=t.config,o=mp(t,r,"/v1/token",`key=${i}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",fp.fetch()(o,{method:"POST",headers:l,body:s})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function mb(t,e){return An(t,"POST","/v2/accounts:revokeToken",as(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){K(e.idToken,"internal-error"),K(typeof e.idToken<"u","internal-error"),K(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Eh(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){K(e.length!==0,"internal-error");const n=Eh(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(K(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:s,refreshToken:r,expiresIn:i}=await pb(e,n);this.updateTokensAndExpiration(s,r,Number(i))}updateTokensAndExpiration(e,n,s){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,n){const{refreshToken:s,accessToken:r,expirationTime:i}=n,o=new Sr;return s&&(K(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),r&&(K(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),i&&(K(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Sr,this.toJSON())}_performRefresh(){return Hn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ms(t,e){K(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Wn{constructor(e){var{uid:n,auth:s,stsTokenManager:r}=e,i=qc(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new ub(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=s,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new nc(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Br(this,this.stsTokenManager.getToken(this.auth,e));return K(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return cb(this,e)}reload(){return hb(this)}_assign(e){this!==e&&(K(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Wn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){K(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),n&&await pa(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(dn(this.auth.app))return Promise.reject(jn(this.auth));const e=await this.getIdToken();return await Br(this,lb(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var s,r,i,o,l,c,d,h;const m=(s=n.displayName)!==null&&s!==void 0?s:void 0,p=(r=n.email)!==null&&r!==void 0?r:void 0,w=(i=n.phoneNumber)!==null&&i!==void 0?i:void 0,T=(o=n.photoURL)!==null&&o!==void 0?o:void 0,S=(l=n.tenantId)!==null&&l!==void 0?l:void 0,A=(c=n._redirectEventId)!==null&&c!==void 0?c:void 0,P=(d=n.createdAt)!==null&&d!==void 0?d:void 0,C=(h=n.lastLoginAt)!==null&&h!==void 0?h:void 0,{uid:L,emailVerified:D,isAnonymous:O,providerData:$,stsTokenManager:I}=n;K(L&&I,e,"internal-error");const v=Sr.fromJSON(this.name,I);K(typeof L=="string",e,"internal-error"),ms(m,e.name),ms(p,e.name),K(typeof D=="boolean",e,"internal-error"),K(typeof O=="boolean",e,"internal-error"),ms(w,e.name),ms(T,e.name),ms(S,e.name),ms(A,e.name),ms(P,e.name),ms(C,e.name);const _=new Wn({uid:L,auth:e,email:p,emailVerified:D,displayName:m,isAnonymous:O,photoURL:T,phoneNumber:w,tenantId:S,stsTokenManager:v,createdAt:P,lastLoginAt:C});return $&&Array.isArray($)&&(_.providerData=$.map(b=>Object.assign({},b))),A&&(_._redirectEventId=A),_}static async _fromIdTokenResponse(e,n,s=!1){const r=new Sr;r.updateFromServerResponse(n);const i=new Wn({uid:n.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await pa(i),i}static async _fromGetAccountInfoResponse(e,n,s){const r=n.users[0];K(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?yp(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(i!=null&&i.length),l=new Sr;l.updateFromIdToken(s);const c=new Wn({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:o}),d={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new nc(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Th=new Map;function Yn(t){Zn(t instanceof Function,"Expected a class definition");let e=Th.get(t);return e?(Zn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Th.set(t,e),e)}/**
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
 */class vp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}vp.type="NONE";const Ih=vp;/**
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
 */function Ko(t,e,n){return`firebase:${t}:${e}:${n}`}class xr{constructor(e,n,s){this.persistence=e,this.auth=n,this.userKey=s;const{config:r,name:i}=this.auth;this.fullUserKey=Ko(this.userKey,r.apiKey,i),this.fullPersistenceKey=Ko("persistence",r.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Wn._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,s="authUser"){if(!n.length)return new xr(Yn(Ih),e,s);const r=(await Promise.all(n.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=r[0]||Yn(Ih);const o=Ko(s,e.config.apiKey,e.name);let l=null;for(const d of n)try{const h=await d._get(o);if(h){const m=Wn._fromJSON(e,h);d!==i&&(l=m),i=d;break}}catch{}const c=r.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new xr(i,e,s):(i=c[0],l&&await i._set(o,l.toJSON()),await Promise.all(n.map(async d=>{if(d!==i)try{await d._remove(o)}catch{}})),new xr(i,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sh(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Ep(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(bp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Ip(e))return"Blackberry";if(Sp(e))return"Webos";if(wp(e))return"Safari";if((e.includes("chrome/")||_p(e))&&!e.includes("edge/"))return"Chrome";if(Tp(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=t.match(n);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function bp(t=vt()){return/firefox\//i.test(t)}function wp(t=vt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function _p(t=vt()){return/crios\//i.test(t)}function Ep(t=vt()){return/iemobile/i.test(t)}function Tp(t=vt()){return/android/i.test(t)}function Ip(t=vt()){return/blackberry/i.test(t)}function Sp(t=vt()){return/webos/i.test(t)}function jc(t=vt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function gb(t=vt()){var e;return jc(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function yb(){return R0()&&document.documentMode===10}function xp(t=vt()){return jc(t)||Tp(t)||Sp(t)||Ip(t)||/windows phone/i.test(t)||Ep(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ap(t,e=[]){let n;switch(t){case"Browser":n=Sh(vt());break;case"Worker":n=`${Sh(vt())}-${t}`;break;default:n=t}const s=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Yr}/${s}`}/**
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
 */class vb{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const s=i=>new Promise((o,l)=>{try{const c=e(i);o(c)}catch(c){l(c)}});s.onAbort=n,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const s of this.queue)await s(e),s.onAbort&&n.push(s.onAbort)}catch(s){n.reverse();for(const r of n)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function bb(t,e={}){return An(t,"GET","/v2/passwordPolicy",as(t,e))}/**
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
 */const wb=6;class _b{constructor(e){var n,s,r,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:wb,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,s,r,i,o,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(n=c.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(s=c.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(r=c.containsLowercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,n){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(n.meetsMinPasswordLength=e.length>=s),r&&(n.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(n,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,n,s,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eb{constructor(e,n,s,r){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new xh(this),this.idTokenSubscription=new xh(this),this.beforeStateQueue=new vb(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=hp,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Yn(n)),this._initializationPromise=this.queue(async()=>{var s,r;if(!this._deleted&&(this.persistenceManager=await xr.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await gp(this,{idToken:e}),s=await Wn._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(s)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(dn(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let r=s,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=r==null?void 0:r._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(r=c.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return K(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await pa(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=tb()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(dn(this.app))return Promise.reject(jn(this));const n=e?Pe(e):null;return n&&K(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&K(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return dn(this.app)?Promise.reject(jn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return dn(this.app)?Promise.reject(jn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Yn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await bb(this),n=new _b(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new so("auth","Firebase",e())}onAuthStateChanged(e,n,s){return this.registerStateListener(this.authStateSubscription,e,n,s)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,s){return this.registerStateListener(this.idTokenSubscription,e,n,s)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(s.tenantId=this.tenantId),await mb(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const s=await this.getOrInitRedirectPersistenceManager(n);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Yn(e)||this._popupRedirectResolver;K(n,this,"argument-error"),this.redirectPersistenceManager=await xr.create(this,[Yn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,s;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,s,r){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(K(l,this,"internal-error"),l.then(()=>{o||i(this.currentUser)}),typeof n=="function"){const c=e.addObserver(n,s,r);return()=>{o=!0,c()}}else{const c=e.addObserver(n);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return K(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ap(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(n["X-Firebase-Client"]=s);const r=await this._getAppCheckToken();return r&&(n["X-Firebase-AppCheck"]=r),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&Jv(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function ls(t){return Pe(t)}class xh{constructor(e){this.auth=e,this.observer=null,this.addObserver=F0(n=>this.observer=n)}get next(){return K(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Oa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Tb(t){Oa=t}function kp(t){return Oa.loadJS(t)}function Ib(){return Oa.recaptchaEnterpriseScript}function Sb(){return Oa.gapiScript}function xb(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const Ab="recaptcha-enterprise",kb="NO_RECAPTCHA";class Cb{constructor(e){this.type=Ab,this.auth=ls(e)}async verify(e="verify",n=!1){async function s(i){if(!n){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,l)=>{ab(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new ob(c);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,o(d.siteKey)}}).catch(c=>{l(c)})})}function r(i,o,l){const c=window.grecaptcha;_h(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:e}).then(d=>{o(d)}).catch(()=>{o(kb)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,o)=>{s(this.auth).then(l=>{if(!n&&_h(window.grecaptcha))r(l,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=Ib();c.length!==0&&(c+=l),kp(c).then(()=>{r(l,i,o)}).catch(d=>{o(d)})}}).catch(l=>{o(l)})})}}async function Ah(t,e,n,s=!1){const r=new Cb(t);let i;try{i=await r.verify(n)}catch{i=await r.verify(n,!0)}const o=Object.assign({},e);return s?Object.assign(o,{captchaResp:i}):Object.assign(o,{captchaResponse:i}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function ma(t,e,n,s){var r;if(!((r=t._getRecaptchaConfig())===null||r===void 0)&&r.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await Ah(t,e,n,n==="getOobCode");return s(t,i)}else return s(t,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Ah(t,e,n,n==="getOobCode");return s(t,o)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rb(t,e){const n=$c(t,"auth");if(n.isInitialized()){const r=n.getImmediate(),i=n.getOptions();if(ua(i,e??{}))return r;tn(r,"already-initialized")}return n.initialize({options:e})}function Pb(t,e){const n=(e==null?void 0:e.persistence)||[],s=(Array.isArray(n)?n:[n]).map(Yn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function Mb(t,e,n){const s=ls(t);K(s._canInitEmulator,s,"emulator-config-failed"),K(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,i=Cp(e),{host:o,port:l}=Db(e),c=l===null?"":`:${l}`;s.config.emulator={url:`${i}//${o}${c}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:o,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})}),Bb()}function Cp(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Db(t){const e=Cp(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const s=n[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const i=r[1];return{host:i,port:kh(s.substr(i.length+1))}}else{const[i,o]=s.split(":");return{host:i,port:kh(o)}}}function kh(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Bb(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kc{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Hn("not implemented")}_getIdTokenResponse(e){return Hn("not implemented")}_linkToIdToken(e,n){return Hn("not implemented")}_getReauthenticationResolver(e){return Hn("not implemented")}}async function Lb(t,e){return An(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nb(t,e){return oo(t,"POST","/v1/accounts:signInWithPassword",as(t,e))}async function Rp(t,e){return An(t,"POST","/v1/accounts:sendOobCode",as(t,e))}async function Ob(t,e){return Rp(t,e)}async function Fb(t,e){return Rp(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vb(t,e){return oo(t,"POST","/v1/accounts:signInWithEmailLink",as(t,e))}async function zb(t,e){return oo(t,"POST","/v1/accounts:signInWithEmailLink",as(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi extends Kc{constructor(e,n,s,r=null){super("password",s),this._email=e,this._password=n,this._tenantId=r}static _fromEmailAndPassword(e,n){return new Oi(e,n,"password")}static _fromEmailAndCode(e,n,s=null){return new Oi(e,n,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ma(e,n,"signInWithPassword",Nb);case"emailLink":return Vb(e,{email:this._email,oobCode:this._password});default:tn(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const s={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ma(e,s,"signUpPassword",Lb);case"emailLink":return zb(e,{idToken:n,email:this._email,oobCode:this._password});default:tn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ar(t,e){return oo(t,"POST","/v1/accounts:signInWithIdp",as(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ub="http://localhost";class tr extends Kc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new tr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):tn("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r}=n,i=qc(n,["providerId","signInMethod"]);if(!s||!r)return null;const o=new tr(s,r);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Ar(e,n)}_linkToIdToken(e,n){const s=this.buildRequest();return s.idToken=n,Ar(e,s)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Ar(e,n)}buildRequest(){const e={requestUri:Ub,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=ro(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $b(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function qb(t){const e=vi(bi(t)).link,n=e?vi(bi(e)).deep_link_id:null,s=vi(bi(t)).deep_link_id;return(s?vi(bi(s)).link:null)||s||n||e||t}class Qc{constructor(e){var n,s,r,i,o,l;const c=vi(bi(e)),d=(n=c.apiKey)!==null&&n!==void 0?n:null,h=(s=c.oobCode)!==null&&s!==void 0?s:null,m=$b((r=c.mode)!==null&&r!==void 0?r:null);K(d&&h&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=h,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(o=c.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const n=qb(e);try{return new Qc(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gr{constructor(){this.providerId=Gr.PROVIDER_ID}static credential(e,n){return Oi._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const s=Qc.parseLink(n);return K(s,"argument-error"),Oi._fromEmailAndCode(e,s.code,s.tenantId)}}Gr.PROVIDER_ID="password";Gr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Gr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jc{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class ao extends Jc{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ys extends ao{constructor(){super("facebook.com")}static credential(e){return tr._fromParams({providerId:ys.PROVIDER_ID,signInMethod:ys.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ys.credentialFromTaggedObject(e)}static credentialFromError(e){return ys.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ys.credential(e.oauthAccessToken)}catch{return null}}}ys.FACEBOOK_SIGN_IN_METHOD="facebook.com";ys.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn extends ao{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return tr._fromParams({providerId:qn.PROVIDER_ID,signInMethod:qn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return qn.credentialFromTaggedObject(e)}static credentialFromError(e){return qn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:s}=e;if(!n&&!s)return null;try{return qn.credential(n,s)}catch{return null}}}qn.GOOGLE_SIGN_IN_METHOD="google.com";qn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vs extends ao{constructor(){super("github.com")}static credential(e){return tr._fromParams({providerId:vs.PROVIDER_ID,signInMethod:vs.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return vs.credentialFromTaggedObject(e)}static credentialFromError(e){return vs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return vs.credential(e.oauthAccessToken)}catch{return null}}}vs.GITHUB_SIGN_IN_METHOD="github.com";vs.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bs extends ao{constructor(){super("twitter.com")}static credential(e,n){return tr._fromParams({providerId:bs.PROVIDER_ID,signInMethod:bs.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return bs.credentialFromTaggedObject(e)}static credentialFromError(e){return bs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:s}=e;if(!n||!s)return null;try{return bs.credential(n,s)}catch{return null}}}bs.TWITTER_SIGN_IN_METHOD="twitter.com";bs.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hb(t,e){return oo(t,"POST","/v1/accounts:signUp",as(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,s,r=!1){const i=await Wn._fromIdTokenResponse(e,s,r),o=Ch(s);return new nr({user:i,providerId:o,_tokenResponse:s,operationType:n})}static async _forOperation(e,n,s){await e._updateTokensIfNecessary(s,!0);const r=Ch(s);return new nr({user:e,providerId:r,_tokenResponse:s,operationType:n})}}function Ch(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ga extends os{constructor(e,n,s,r){var i;super(n.code,n.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,ga.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:n.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,n,s,r){return new ga(e,n,s,r)}}function Pp(t,e,n,s){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?ga._fromErrorAndOperation(t,i,e,s):i})}async function Wb(t,e,n=!1){const s=await Br(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return nr._forOperation(t,"link",s)}/**
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
 */async function Yb(t,e,n=!1){const{auth:s}=t;if(dn(s.app))return Promise.reject(jn(s));const r="reauthenticate";try{const i=await Br(t,Pp(s,r,e,t),n);K(i.idToken,s,"internal-error");const o=Gc(i.idToken);K(o,s,"internal-error");const{sub:l}=o;return K(t.uid===l,s,"user-mismatch"),nr._forOperation(t,r,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&tn(s,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mp(t,e,n=!1){if(dn(t.app))return Promise.reject(jn(t));const s="signIn",r=await Pp(t,s,e),i=await nr._fromIdTokenResponse(t,s,r);return n||await t._updateCurrentUser(i.user),i}async function Gb(t,e){return Mp(ls(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dp(t){const e=ls(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function jb(t,e,n){const s=ls(t);await ma(s,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",Fb)}async function Kb(t,e,n){if(dn(t.app))return Promise.reject(jn(t));const s=ls(t),o=await ma(s,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Hb).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&Dp(t),c}),l=await nr._fromIdTokenResponse(s,"signIn",o);return await s._updateCurrentUser(l.user),l}function Qb(t,e,n){return dn(t.app)?Promise.reject(jn(t)):Gb(Pe(t),Gr.credential(e,n)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&Dp(t),s})}async function Bp(t,e){const n=Pe(t),r={requestType:"VERIFY_EMAIL",idToken:await t.getIdToken()},{email:i}=await Ob(n.auth,r);i!==t.email&&await t.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jb(t,e){return An(t,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xb(t,{displayName:e,photoURL:n}){if(e===void 0&&n===void 0)return;const s=Pe(t),i={idToken:await s.getIdToken(),displayName:e,photoUrl:n,returnSecureToken:!0},o=await Br(s,Jb(s.auth,i));s.displayName=o.displayName||null,s.photoURL=o.photoUrl||null;const l=s.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=s.displayName,l.photoURL=s.photoURL),await s._updateTokensIfNecessary(o)}function Zb(t,e,n,s){return Pe(t).onIdTokenChanged(e,n,s)}function ew(t,e,n){return Pe(t).beforeAuthStateChanged(e,n)}function tw(t,e,n,s){return Pe(t).onAuthStateChanged(e,n,s)}function nw(t){return Pe(t).signOut()}async function sw(t){return Pe(t).delete()}const ya="__sak";/**
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
 */class Lp{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(ya,"1"),this.storage.removeItem(ya),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rw=1e3,iw=10;class Np extends Lp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=xp(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const s=this.storage.getItem(n),r=this.localCache[n];s!==r&&e(n,r,s)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const s=e.key;n?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(s);!n&&this.localCache[s]===o||this.notifyListeners(s,o)},i=this.storage.getItem(s);yb()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,iw):r()}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:s}),!0)})},rw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Np.type="LOCAL";const ow=Np;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Op extends Lp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Op.type="SESSION";const Fp=Op;/**
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
 */function aw(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class Fa{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(r=>r.isListeningto(e));if(n)return n;const s=new Fa(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:s,eventType:r,data:i}=n.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const l=Array.from(o).map(async d=>d(n.origin,i)),c=await aw(l);n.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Fa.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xc(t="",e=10){let n="";for(let s=0;s<e;s++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class lw{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,o;return new Promise((l,c)=>{const d=Xc("",20);r.port1.start();const h=setTimeout(()=>{c(new Error("unsupported_event"))},s);o={messageChannel:r,onMessage(m){const p=m;if(p.data.eventId===d)switch(p.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(p.data.response);break;default:clearTimeout(h),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:d,data:n},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function En(){return window}function cw(t){En().location.href=t}/**
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
 */function Vp(){return typeof En().WorkerGlobalScope<"u"&&typeof En().importScripts=="function"}async function dw(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function uw(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function hw(){return Vp()?self:null}/**
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
 */const zp="firebaseLocalStorageDb",fw=1,va="firebaseLocalStorage",Up="fbase_key";class lo{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Va(t,e){return t.transaction([va],e?"readwrite":"readonly").objectStore(va)}function pw(){const t=indexedDB.deleteDatabase(zp);return new lo(t).toPromise()}function sc(){const t=indexedDB.open(zp,fw);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const s=t.result;try{s.createObjectStore(va,{keyPath:Up})}catch(r){n(r)}}),t.addEventListener("success",async()=>{const s=t.result;s.objectStoreNames.contains(va)?e(s):(s.close(),await pw(),e(await sc()))})})}async function Rh(t,e,n){const s=Va(t,!0).put({[Up]:e,value:n});return new lo(s).toPromise()}async function mw(t,e){const n=Va(t,!1).get(e),s=await new lo(n).toPromise();return s===void 0?null:s.value}function Ph(t,e){const n=Va(t,!0).delete(e);return new lo(n).toPromise()}const gw=800,yw=3;class $p{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await sc(),this.db)}async _withRetries(e){let n=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(n++>yw)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Vp()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Fa._getInstance(hw()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await dw(),!this.activeServiceWorker)return;this.sender=new lw(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((n=s[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||uw()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await sc();return await Rh(e,ya,"1"),await Ph(e,ya),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(s=>Rh(s,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(s=>mw(s,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Ph(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=Va(r,!1).getAll();return new lo(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),n.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),n.push(r));return n}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),gw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}$p.type="LOCAL";const vw=$p;new io(3e4,6e4);/**
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
 */function qp(t,e){return e?Yn(e):(K(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class Zc extends Kc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ar(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Ar(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Ar(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function bw(t){return Mp(t.auth,new Zc(t),t.bypassAuthState)}function ww(t){const{auth:e,user:n}=t;return K(n,e,"internal-error"),Yb(n,new Zc(t),t.bypassAuthState)}async function _w(t){const{auth:e,user:n}=t;return K(n,e,"internal-error"),Wb(n,new Zc(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hp{constructor(e,n,s,r,i=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:s,postBody:r,tenantId:i,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:n,sessionId:s,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return bw;case"linkViaPopup":case"linkViaRedirect":return _w;case"reauthViaPopup":case"reauthViaRedirect":return ww;default:tn(this.auth,"internal-error")}}resolve(e){Zn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Zn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ew=new io(2e3,1e4);async function Tw(t,e,n){if(dn(t.app))return Promise.reject(un(t,"operation-not-supported-in-this-environment"));const s=ls(t);Xv(t,e,Jc);const r=qp(s,n);return new Ys(s,"signInViaPopup",e,r).executeNotNull()}class Ys extends Hp{constructor(e,n,s,r,i){super(e,n,r,i),this.provider=s,this.authWindow=null,this.pollId=null,Ys.currentPopupAction&&Ys.currentPopupAction.cancel(),Ys.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return K(e,this.auth,"internal-error"),e}async onExecution(){Zn(this.filter.length===1,"Popup operations only handle one event");const e=Xc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(un(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(un(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ys.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,s;if(!((s=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(un(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Ew.get())};e()}}Ys.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Iw="pendingRedirect",Qo=new Map;class Sw extends Hp{constructor(e,n,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,s),this.eventId=null}async execute(){let e=Qo.get(this.auth._key());if(!e){try{const s=await xw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(n){e=()=>Promise.reject(n)}Qo.set(this.auth._key(),e)}return this.bypassAuthState||Qo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function xw(t,e){const n=Cw(e),s=kw(t);if(!await s._isAvailable())return!1;const r=await s._get(n)==="true";return await s._remove(n),r}function Aw(t,e){Qo.set(t._key(),e)}function kw(t){return Yn(t._redirectPersistence)}function Cw(t){return Ko(Iw,t.config.apiKey,t.name)}async function Rw(t,e,n=!1){if(dn(t.app))return Promise.reject(jn(t));const s=ls(t),r=qp(s,e),o=await new Sw(s,r,n).execute();return o&&!n&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pw=10*60*1e3;class Mw{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(n=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Dw(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var s;if(e.error&&!Wp(e)){const r=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";n.onError(un(this.auth,r))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const s=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Pw&&this.cachedEventUids.clear(),this.cachedEventUids.has(Mh(e))}saveEventToCache(e){this.cachedEventUids.add(Mh(e)),this.lastProcessedEventTime=Date.now()}}function Mh(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Wp({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Dw(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Wp(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bw(t,e={}){return An(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Nw=/^https?/;async function Ow(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Bw(t);for(const n of e)try{if(Fw(n))return}catch{}tn(t,"unauthorized-domain")}function Fw(t){const e=tc(),{protocol:n,hostname:s}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&s===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===s}if(!Nw.test(n))return!1;if(Lw.test(t))return s===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
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
 */const Vw=new io(3e4,6e4);function Dh(){const t=En().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function zw(t){return new Promise((e,n)=>{var s,r,i;function o(){Dh(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Dh(),n(un(t,"network-request-failed"))},timeout:Vw.get()})}if(!((r=(s=En().gapi)===null||s===void 0?void 0:s.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((i=En().gapi)===null||i===void 0)&&i.load)o();else{const l=xb("iframefcb");return En()[l]=()=>{gapi.load?o():n(un(t,"network-request-failed"))},kp(`${Sb()}?onload=${l}`).catch(c=>n(c))}}).catch(e=>{throw Jo=null,e})}let Jo=null;function Uw(t){return Jo=Jo||zw(t),Jo}/**
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
 */const $w=new io(5e3,15e3),qw="__/auth/iframe",Hw="emulator/auth/iframe",Ww={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Yw=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Gw(t){const e=t.config;K(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Yc(e,Hw):`https://${t.config.authDomain}/${qw}`,s={apiKey:e.apiKey,appName:t.name,v:Yr},r=Yw.get(t.config.apiHost);r&&(s.eid=r);const i=t._getFrameworks();return i.length&&(s.fw=i.join(",")),`${n}?${ro(s).slice(1)}`}async function jw(t){const e=await Uw(t),n=En().gapi;return K(n,t,"internal-error"),e.open({where:document.body,url:Gw(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Ww,dontclear:!0},s=>new Promise(async(r,i)=>{await s.restyle({setHideOnLeave:!1});const o=un(t,"network-request-failed"),l=En().setTimeout(()=>{i(o)},$w.get());function c(){En().clearTimeout(l),r(s)}s.ping(c).then(c,()=>{i(o)})}))}/**
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
 */const Kw={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Qw=500,Jw=600,Xw="_blank",Zw="http://localhost";class Bh{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function e_(t,e,n,s=Qw,r=Jw){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const c=Object.assign(Object.assign({},Kw),{width:s.toString(),height:r.toString(),top:i,left:o}),d=vt().toLowerCase();n&&(l=_p(d)?Xw:n),bp(d)&&(e=e||Zw,c.scrollbars="yes");const h=Object.entries(c).reduce((p,[w,T])=>`${p}${w}=${T},`,"");if(gb(d)&&l!=="_self")return t_(e||"",l),new Bh(null);const m=window.open(e||"",l,h);K(m,t,"popup-blocked");try{m.focus()}catch{}return new Bh(m)}function t_(t,e){const n=document.createElement("a");n.href=t,n.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(s)}/**
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
 */const n_="__/auth/handler",s_="emulator/auth/handler",r_=encodeURIComponent("fac");async function Lh(t,e,n,s,r,i){K(t.config.authDomain,t,"auth-domain-config-required"),K(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:s,v:Yr,eventId:r};if(e instanceof Jc){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",O0(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,m]of Object.entries({}))o[h]=m}if(e instanceof ao){const h=e.getScopes().filter(m=>m!=="");h.length>0&&(o.scopes=h.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const h of Object.keys(l))l[h]===void 0&&delete l[h];const c=await t._getAppCheckToken(),d=c?`#${r_}=${encodeURIComponent(c)}`:"";return`${i_(t)}?${ro(l).slice(1)}${d}`}function i_({config:t}){return t.emulator?Yc(t,s_):`https://${t.authDomain}/${n_}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zl="webStorageSupport";class o_{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Fp,this._completeRedirectFn=Rw,this._overrideRedirectResult=Aw}async _openPopup(e,n,s,r){var i;Zn((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await Lh(e,n,s,tc(),r);return e_(e,o,Xc())}async _openRedirect(e,n,s,r){await this._originValidation(e);const i=await Lh(e,n,s,tc(),r);return cw(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:r,promise:i}=this.eventManagers[n];return r?Promise.resolve(r):(Zn(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[n]={promise:s},s.catch(()=>{delete this.eventManagers[n]}),s}async initAndGetManager(e){const n=await jw(e),s=new Mw(e);return n.register("authEvent",r=>(K(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=n,s}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(zl,{type:zl},r=>{var i;const o=(i=r==null?void 0:r[0])===null||i===void 0?void 0:i[zl];o!==void 0&&n(!!o),tn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Ow(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return xp()||wp()||jc()}}const a_=o_;var Nh="@firebase/auth",Oh="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l_{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){K(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function c_(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function d_(t){Dr(new er("auth",(e,{options:n})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=s.options;K(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ap(t)},d=new Eb(s,r,i,c);return Pb(d,n),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,s)=>{e.getProvider("auth-internal").initialize()})),Dr(new er("auth-internal",e=>{const n=ls(e.getProvider("auth").getImmediate());return(s=>new l_(s))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),xs(Nh,Oh,c_(t)),xs(Nh,Oh,"esm2017")}/**
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
 */const u_=5*60,h_=rp("authIdTokenMaxAge")||u_;let Fh=null;const f_=t=>async e=>{const n=e&&await e.getIdTokenResult(),s=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(s&&s>h_)return;const r=n==null?void 0:n.token;Fh!==r&&(Fh=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function p_(t=lp()){const e=$c(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Rb(t,{popupRedirectResolver:a_,persistence:[vw,ow,Fp]}),s=rp("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const o=f_(i.toString());ew(n,o,()=>o(n.currentUser)),Zb(n,l=>o(l))}}const r=np("auth");return r&&Mb(n,`http://${r}`),n}function m_(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}Tb({loadJS(t){return new Promise((e,n)=>{const s=document.createElement("script");s.setAttribute("src",t),s.onload=e,s.onerror=r=>{const i=un("internal-error");i.customData=r,n(i)},s.type="text/javascript",s.charset="UTF-8",m_().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});d_("Browser");var Vh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Qs,Yp;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,v){function _(){}_.prototype=v.prototype,I.D=v.prototype,I.prototype=new _,I.prototype.constructor=I,I.C=function(b,E,x){for(var y=Array(arguments.length-2),te=2;te<arguments.length;te++)y[te-2]=arguments[te];return v.prototype[E].apply(b,y)}}function n(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,n),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(I,v,_){_||(_=0);var b=Array(16);if(typeof v=="string")for(var E=0;16>E;++E)b[E]=v.charCodeAt(_++)|v.charCodeAt(_++)<<8|v.charCodeAt(_++)<<16|v.charCodeAt(_++)<<24;else for(E=0;16>E;++E)b[E]=v[_++]|v[_++]<<8|v[_++]<<16|v[_++]<<24;v=I.g[0],_=I.g[1],E=I.g[2];var x=I.g[3],y=v+(x^_&(E^x))+b[0]+3614090360&4294967295;v=_+(y<<7&4294967295|y>>>25),y=x+(E^v&(_^E))+b[1]+3905402710&4294967295,x=v+(y<<12&4294967295|y>>>20),y=E+(_^x&(v^_))+b[2]+606105819&4294967295,E=x+(y<<17&4294967295|y>>>15),y=_+(v^E&(x^v))+b[3]+3250441966&4294967295,_=E+(y<<22&4294967295|y>>>10),y=v+(x^_&(E^x))+b[4]+4118548399&4294967295,v=_+(y<<7&4294967295|y>>>25),y=x+(E^v&(_^E))+b[5]+1200080426&4294967295,x=v+(y<<12&4294967295|y>>>20),y=E+(_^x&(v^_))+b[6]+2821735955&4294967295,E=x+(y<<17&4294967295|y>>>15),y=_+(v^E&(x^v))+b[7]+4249261313&4294967295,_=E+(y<<22&4294967295|y>>>10),y=v+(x^_&(E^x))+b[8]+1770035416&4294967295,v=_+(y<<7&4294967295|y>>>25),y=x+(E^v&(_^E))+b[9]+2336552879&4294967295,x=v+(y<<12&4294967295|y>>>20),y=E+(_^x&(v^_))+b[10]+4294925233&4294967295,E=x+(y<<17&4294967295|y>>>15),y=_+(v^E&(x^v))+b[11]+2304563134&4294967295,_=E+(y<<22&4294967295|y>>>10),y=v+(x^_&(E^x))+b[12]+1804603682&4294967295,v=_+(y<<7&4294967295|y>>>25),y=x+(E^v&(_^E))+b[13]+4254626195&4294967295,x=v+(y<<12&4294967295|y>>>20),y=E+(_^x&(v^_))+b[14]+2792965006&4294967295,E=x+(y<<17&4294967295|y>>>15),y=_+(v^E&(x^v))+b[15]+1236535329&4294967295,_=E+(y<<22&4294967295|y>>>10),y=v+(E^x&(_^E))+b[1]+4129170786&4294967295,v=_+(y<<5&4294967295|y>>>27),y=x+(_^E&(v^_))+b[6]+3225465664&4294967295,x=v+(y<<9&4294967295|y>>>23),y=E+(v^_&(x^v))+b[11]+643717713&4294967295,E=x+(y<<14&4294967295|y>>>18),y=_+(x^v&(E^x))+b[0]+3921069994&4294967295,_=E+(y<<20&4294967295|y>>>12),y=v+(E^x&(_^E))+b[5]+3593408605&4294967295,v=_+(y<<5&4294967295|y>>>27),y=x+(_^E&(v^_))+b[10]+38016083&4294967295,x=v+(y<<9&4294967295|y>>>23),y=E+(v^_&(x^v))+b[15]+3634488961&4294967295,E=x+(y<<14&4294967295|y>>>18),y=_+(x^v&(E^x))+b[4]+3889429448&4294967295,_=E+(y<<20&4294967295|y>>>12),y=v+(E^x&(_^E))+b[9]+568446438&4294967295,v=_+(y<<5&4294967295|y>>>27),y=x+(_^E&(v^_))+b[14]+3275163606&4294967295,x=v+(y<<9&4294967295|y>>>23),y=E+(v^_&(x^v))+b[3]+4107603335&4294967295,E=x+(y<<14&4294967295|y>>>18),y=_+(x^v&(E^x))+b[8]+1163531501&4294967295,_=E+(y<<20&4294967295|y>>>12),y=v+(E^x&(_^E))+b[13]+2850285829&4294967295,v=_+(y<<5&4294967295|y>>>27),y=x+(_^E&(v^_))+b[2]+4243563512&4294967295,x=v+(y<<9&4294967295|y>>>23),y=E+(v^_&(x^v))+b[7]+1735328473&4294967295,E=x+(y<<14&4294967295|y>>>18),y=_+(x^v&(E^x))+b[12]+2368359562&4294967295,_=E+(y<<20&4294967295|y>>>12),y=v+(_^E^x)+b[5]+4294588738&4294967295,v=_+(y<<4&4294967295|y>>>28),y=x+(v^_^E)+b[8]+2272392833&4294967295,x=v+(y<<11&4294967295|y>>>21),y=E+(x^v^_)+b[11]+1839030562&4294967295,E=x+(y<<16&4294967295|y>>>16),y=_+(E^x^v)+b[14]+4259657740&4294967295,_=E+(y<<23&4294967295|y>>>9),y=v+(_^E^x)+b[1]+2763975236&4294967295,v=_+(y<<4&4294967295|y>>>28),y=x+(v^_^E)+b[4]+1272893353&4294967295,x=v+(y<<11&4294967295|y>>>21),y=E+(x^v^_)+b[7]+4139469664&4294967295,E=x+(y<<16&4294967295|y>>>16),y=_+(E^x^v)+b[10]+3200236656&4294967295,_=E+(y<<23&4294967295|y>>>9),y=v+(_^E^x)+b[13]+681279174&4294967295,v=_+(y<<4&4294967295|y>>>28),y=x+(v^_^E)+b[0]+3936430074&4294967295,x=v+(y<<11&4294967295|y>>>21),y=E+(x^v^_)+b[3]+3572445317&4294967295,E=x+(y<<16&4294967295|y>>>16),y=_+(E^x^v)+b[6]+76029189&4294967295,_=E+(y<<23&4294967295|y>>>9),y=v+(_^E^x)+b[9]+3654602809&4294967295,v=_+(y<<4&4294967295|y>>>28),y=x+(v^_^E)+b[12]+3873151461&4294967295,x=v+(y<<11&4294967295|y>>>21),y=E+(x^v^_)+b[15]+530742520&4294967295,E=x+(y<<16&4294967295|y>>>16),y=_+(E^x^v)+b[2]+3299628645&4294967295,_=E+(y<<23&4294967295|y>>>9),y=v+(E^(_|~x))+b[0]+4096336452&4294967295,v=_+(y<<6&4294967295|y>>>26),y=x+(_^(v|~E))+b[7]+1126891415&4294967295,x=v+(y<<10&4294967295|y>>>22),y=E+(v^(x|~_))+b[14]+2878612391&4294967295,E=x+(y<<15&4294967295|y>>>17),y=_+(x^(E|~v))+b[5]+4237533241&4294967295,_=E+(y<<21&4294967295|y>>>11),y=v+(E^(_|~x))+b[12]+1700485571&4294967295,v=_+(y<<6&4294967295|y>>>26),y=x+(_^(v|~E))+b[3]+2399980690&4294967295,x=v+(y<<10&4294967295|y>>>22),y=E+(v^(x|~_))+b[10]+4293915773&4294967295,E=x+(y<<15&4294967295|y>>>17),y=_+(x^(E|~v))+b[1]+2240044497&4294967295,_=E+(y<<21&4294967295|y>>>11),y=v+(E^(_|~x))+b[8]+1873313359&4294967295,v=_+(y<<6&4294967295|y>>>26),y=x+(_^(v|~E))+b[15]+4264355552&4294967295,x=v+(y<<10&4294967295|y>>>22),y=E+(v^(x|~_))+b[6]+2734768916&4294967295,E=x+(y<<15&4294967295|y>>>17),y=_+(x^(E|~v))+b[13]+1309151649&4294967295,_=E+(y<<21&4294967295|y>>>11),y=v+(E^(_|~x))+b[4]+4149444226&4294967295,v=_+(y<<6&4294967295|y>>>26),y=x+(_^(v|~E))+b[11]+3174756917&4294967295,x=v+(y<<10&4294967295|y>>>22),y=E+(v^(x|~_))+b[2]+718787259&4294967295,E=x+(y<<15&4294967295|y>>>17),y=_+(x^(E|~v))+b[9]+3951481745&4294967295,I.g[0]=I.g[0]+v&4294967295,I.g[1]=I.g[1]+(E+(y<<21&4294967295|y>>>11))&4294967295,I.g[2]=I.g[2]+E&4294967295,I.g[3]=I.g[3]+x&4294967295}s.prototype.u=function(I,v){v===void 0&&(v=I.length);for(var _=v-this.blockSize,b=this.B,E=this.h,x=0;x<v;){if(E==0)for(;x<=_;)r(this,I,x),x+=this.blockSize;if(typeof I=="string"){for(;x<v;)if(b[E++]=I.charCodeAt(x++),E==this.blockSize){r(this,b),E=0;break}}else for(;x<v;)if(b[E++]=I[x++],E==this.blockSize){r(this,b),E=0;break}}this.h=E,this.o+=v},s.prototype.v=function(){var I=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);I[0]=128;for(var v=1;v<I.length-8;++v)I[v]=0;var _=8*this.o;for(v=I.length-8;v<I.length;++v)I[v]=_&255,_/=256;for(this.u(I),I=Array(16),v=_=0;4>v;++v)for(var b=0;32>b;b+=8)I[_++]=this.g[v]>>>b&255;return I};function i(I,v){var _=l;return Object.prototype.hasOwnProperty.call(_,I)?_[I]:_[I]=v(I)}function o(I,v){this.h=v;for(var _=[],b=!0,E=I.length-1;0<=E;E--){var x=I[E]|0;b&&x==v||(_[E]=x,b=!1)}this.g=_}var l={};function c(I){return-128<=I&&128>I?i(I,function(v){return new o([v|0],0>v?-1:0)}):new o([I|0],0>I?-1:0)}function d(I){if(isNaN(I)||!isFinite(I))return m;if(0>I)return A(d(-I));for(var v=[],_=1,b=0;I>=_;b++)v[b]=I/_|0,_*=4294967296;return new o(v,0)}function h(I,v){if(I.length==0)throw Error("number format error: empty string");if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(I.charAt(0)=="-")return A(h(I.substring(1),v));if(0<=I.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=d(Math.pow(v,8)),b=m,E=0;E<I.length;E+=8){var x=Math.min(8,I.length-E),y=parseInt(I.substring(E,E+x),v);8>x?(x=d(Math.pow(v,x)),b=b.j(x).add(d(y))):(b=b.j(_),b=b.add(d(y)))}return b}var m=c(0),p=c(1),w=c(16777216);t=o.prototype,t.m=function(){if(S(this))return-A(this).m();for(var I=0,v=1,_=0;_<this.g.length;_++){var b=this.i(_);I+=(0<=b?b:4294967296+b)*v,v*=4294967296}return I},t.toString=function(I){if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(T(this))return"0";if(S(this))return"-"+A(this).toString(I);for(var v=d(Math.pow(I,6)),_=this,b="";;){var E=D(_,v).g;_=P(_,E.j(v));var x=((0<_.g.length?_.g[0]:_.h)>>>0).toString(I);if(_=E,T(_))return x+b;for(;6>x.length;)x="0"+x;b=x+b}},t.i=function(I){return 0>I?0:I<this.g.length?this.g[I]:this.h};function T(I){if(I.h!=0)return!1;for(var v=0;v<I.g.length;v++)if(I.g[v]!=0)return!1;return!0}function S(I){return I.h==-1}t.l=function(I){return I=P(this,I),S(I)?-1:T(I)?0:1};function A(I){for(var v=I.g.length,_=[],b=0;b<v;b++)_[b]=~I.g[b];return new o(_,~I.h).add(p)}t.abs=function(){return S(this)?A(this):this},t.add=function(I){for(var v=Math.max(this.g.length,I.g.length),_=[],b=0,E=0;E<=v;E++){var x=b+(this.i(E)&65535)+(I.i(E)&65535),y=(x>>>16)+(this.i(E)>>>16)+(I.i(E)>>>16);b=y>>>16,x&=65535,y&=65535,_[E]=y<<16|x}return new o(_,_[_.length-1]&-2147483648?-1:0)};function P(I,v){return I.add(A(v))}t.j=function(I){if(T(this)||T(I))return m;if(S(this))return S(I)?A(this).j(A(I)):A(A(this).j(I));if(S(I))return A(this.j(A(I)));if(0>this.l(w)&&0>I.l(w))return d(this.m()*I.m());for(var v=this.g.length+I.g.length,_=[],b=0;b<2*v;b++)_[b]=0;for(b=0;b<this.g.length;b++)for(var E=0;E<I.g.length;E++){var x=this.i(b)>>>16,y=this.i(b)&65535,te=I.i(E)>>>16,oe=I.i(E)&65535;_[2*b+2*E]+=y*oe,C(_,2*b+2*E),_[2*b+2*E+1]+=x*oe,C(_,2*b+2*E+1),_[2*b+2*E+1]+=y*te,C(_,2*b+2*E+1),_[2*b+2*E+2]+=x*te,C(_,2*b+2*E+2)}for(b=0;b<v;b++)_[b]=_[2*b+1]<<16|_[2*b];for(b=v;b<2*v;b++)_[b]=0;return new o(_,0)};function C(I,v){for(;(I[v]&65535)!=I[v];)I[v+1]+=I[v]>>>16,I[v]&=65535,v++}function L(I,v){this.g=I,this.h=v}function D(I,v){if(T(v))throw Error("division by zero");if(T(I))return new L(m,m);if(S(I))return v=D(A(I),v),new L(A(v.g),A(v.h));if(S(v))return v=D(I,A(v)),new L(A(v.g),v.h);if(30<I.g.length){if(S(I)||S(v))throw Error("slowDivide_ only works with positive integers.");for(var _=p,b=v;0>=b.l(I);)_=O(_),b=O(b);var E=$(_,1),x=$(b,1);for(b=$(b,2),_=$(_,2);!T(b);){var y=x.add(b);0>=y.l(I)&&(E=E.add(_),x=y),b=$(b,1),_=$(_,1)}return v=P(I,E.j(v)),new L(E,v)}for(E=m;0<=I.l(v);){for(_=Math.max(1,Math.floor(I.m()/v.m())),b=Math.ceil(Math.log(_)/Math.LN2),b=48>=b?1:Math.pow(2,b-48),x=d(_),y=x.j(v);S(y)||0<y.l(I);)_-=b,x=d(_),y=x.j(v);T(x)&&(x=p),E=E.add(x),I=P(I,y)}return new L(E,I)}t.A=function(I){return D(this,I).h},t.and=function(I){for(var v=Math.max(this.g.length,I.g.length),_=[],b=0;b<v;b++)_[b]=this.i(b)&I.i(b);return new o(_,this.h&I.h)},t.or=function(I){for(var v=Math.max(this.g.length,I.g.length),_=[],b=0;b<v;b++)_[b]=this.i(b)|I.i(b);return new o(_,this.h|I.h)},t.xor=function(I){for(var v=Math.max(this.g.length,I.g.length),_=[],b=0;b<v;b++)_[b]=this.i(b)^I.i(b);return new o(_,this.h^I.h)};function O(I){for(var v=I.g.length+1,_=[],b=0;b<v;b++)_[b]=I.i(b)<<1|I.i(b-1)>>>31;return new o(_,I.h)}function $(I,v){var _=v>>5;v%=32;for(var b=I.g.length-_,E=[],x=0;x<b;x++)E[x]=0<v?I.i(x+_)>>>v|I.i(x+_+1)<<32-v:I.i(x+_);return new o(E,I.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,Yp=s,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=d,o.fromString=h,Qs=o}).apply(typeof Vh<"u"?Vh:typeof self<"u"?self:typeof window<"u"?window:{});var qo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Gp,wi,jp,Xo,rc,Kp,Qp,Jp;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,u,f){return a==Array.prototype||a==Object.prototype||(a[u]=f.value),a};function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof qo=="object"&&qo];for(var u=0;u<a.length;++u){var f=a[u];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var s=n(this);function r(a,u){if(u)e:{var f=s;a=a.split(".");for(var g=0;g<a.length-1;g++){var k=a[g];if(!(k in f))break e;f=f[k]}a=a[a.length-1],g=f[a],u=u(g),u!=g&&u!=null&&e(f,a,{configurable:!0,writable:!0,value:u})}}function i(a,u){a instanceof String&&(a+="");var f=0,g=!1,k={next:function(){if(!g&&f<a.length){var R=f++;return{value:u(R,a[R]),done:!1}}return g=!0,{done:!0,value:void 0}}};return k[Symbol.iterator]=function(){return k},k}r("Array.prototype.values",function(a){return a||function(){return i(this,function(u,f){return f})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var u=typeof a;return u=u!="object"?u:a?Array.isArray(a)?"array":u:"null",u=="array"||u=="object"&&typeof a.length=="number"}function d(a){var u=typeof a;return u=="object"&&a!=null||u=="function"}function h(a,u,f){return a.call.apply(a.bind,arguments)}function m(a,u,f){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var k=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(k,g),a.apply(u,k)}}return function(){return a.apply(u,arguments)}}function p(a,u,f){return p=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?h:m,p.apply(null,arguments)}function w(a,u){var f=Array.prototype.slice.call(arguments,1);return function(){var g=f.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function T(a,u){function f(){}f.prototype=u.prototype,a.aa=u.prototype,a.prototype=new f,a.prototype.constructor=a,a.Qb=function(g,k,R){for(var V=Array(arguments.length-2),_e=2;_e<arguments.length;_e++)V[_e-2]=arguments[_e];return u.prototype[k].apply(g,V)}}function S(a){const u=a.length;if(0<u){const f=Array(u);for(let g=0;g<u;g++)f[g]=a[g];return f}return[]}function A(a,u){for(let f=1;f<arguments.length;f++){const g=arguments[f];if(c(g)){const k=a.length||0,R=g.length||0;a.length=k+R;for(let V=0;V<R;V++)a[k+V]=g[V]}else a.push(g)}}class P{constructor(u,f){this.i=u,this.j=f,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function C(a){return/^[\s\xa0]*$/.test(a)}function L(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function D(a){return D[" "](a),a}D[" "]=function(){};var O=L().indexOf("Gecko")!=-1&&!(L().toLowerCase().indexOf("webkit")!=-1&&L().indexOf("Edge")==-1)&&!(L().indexOf("Trident")!=-1||L().indexOf("MSIE")!=-1)&&L().indexOf("Edge")==-1;function $(a,u,f){for(const g in a)u.call(f,a[g],g,a)}function I(a,u){for(const f in a)u.call(void 0,a[f],f,a)}function v(a){const u={};for(const f in a)u[f]=a[f];return u}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function b(a,u){let f,g;for(let k=1;k<arguments.length;k++){g=arguments[k];for(f in g)a[f]=g[f];for(let R=0;R<_.length;R++)f=_[R],Object.prototype.hasOwnProperty.call(g,f)&&(a[f]=g[f])}}function E(a){var u=1;a=a.split(":");const f=[];for(;0<u&&a.length;)f.push(a.shift()),u--;return a.length&&f.push(a.join(":")),f}function x(a){l.setTimeout(()=>{throw a},0)}function y(){var a=ae;let u=null;return a.g&&(u=a.g,a.g=a.g.next,a.g||(a.h=null),u.next=null),u}class te{constructor(){this.h=this.g=null}add(u,f){const g=oe.get();g.set(u,f),this.h?this.h.next=g:this.g=g,this.h=g}}var oe=new P(()=>new q,a=>a.reset());class q{constructor(){this.next=this.g=this.h=null}set(u,f){this.h=u,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let ne,se=!1,ae=new te,we=()=>{const a=l.Promise.resolve(void 0);ne=()=>{a.then(Ie)}};var Ie=()=>{for(var a;a=y();){try{a.h.call(a.g)}catch(f){x(f)}var u=oe;u.j(a),100>u.h&&(u.h++,a.next=u.g,u.g=a)}se=!1};function ie(){this.s=this.s,this.C=this.C}ie.prototype.s=!1,ie.prototype.ma=function(){this.s||(this.s=!0,this.N())},ie.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function F(a,u){this.type=a,this.g=this.target=u,this.defaultPrevented=!1}F.prototype.h=function(){this.defaultPrevented=!0};var X=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,u=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};l.addEventListener("test",f,u),l.removeEventListener("test",f,u)}catch{}return a}();function Se(a,u){if(F.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var f=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=u,u=a.relatedTarget){if(O){e:{try{D(u.nodeName);var k=!0;break e}catch{}k=!1}k||(u=null)}}else f=="mouseover"?u=a.fromElement:f=="mouseout"&&(u=a.toElement);this.relatedTarget=u,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Et[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&Se.aa.h.call(this)}}T(Se,F);var Et={2:"touch",3:"pen",4:"mouse"};Se.prototype.h=function(){Se.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var zt="closure_listenable_"+(1e6*Math.random()|0),Ge=0;function ge(a,u,f,g,k){this.listener=a,this.proxy=null,this.src=u,this.type=f,this.capture=!!g,this.ha=k,this.key=++Ge,this.da=this.fa=!1}function ue(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Qe(a){this.src=a,this.g={},this.h=0}Qe.prototype.add=function(a,u,f,g,k){var R=a.toString();a=this.g[R],a||(a=this.g[R]=[],this.h++);var V=Kt(a,u,g,k);return-1<V?(u=a[V],f||(u.fa=!1)):(u=new ge(u,this.src,R,!!g,k),u.fa=f,a.push(u)),u};function sn(a,u){var f=u.type;if(f in a.g){var g=a.g[f],k=Array.prototype.indexOf.call(g,u,void 0),R;(R=0<=k)&&Array.prototype.splice.call(g,k,1),R&&(ue(u),a.g[f].length==0&&(delete a.g[f],a.h--))}}function Kt(a,u,f,g){for(var k=0;k<a.length;++k){var R=a[k];if(!R.da&&R.listener==u&&R.capture==!!f&&R.ha==g)return k}return-1}var ze="closure_lm_"+(1e6*Math.random()|0),Ue={};function pn(a,u,f,g,k){if(Array.isArray(u)){for(var R=0;R<u.length;R++)pn(a,u[R],f,g,k);return null}return f=gn(f),a&&a[zt]?a.K(u,f,d(g)?!!g.capture:!1,k):Pt(a,u,f,!1,g,k)}function Pt(a,u,f,g,k,R){if(!u)throw Error("Invalid event type");var V=d(k)?!!k.capture:!!k,_e=rn(a);if(_e||(a[ze]=_e=new Qe(a)),f=_e.add(u,f,g,V,R),f.proxy)return f;if(g=Ut(),f.proxy=g,g.src=a,g.listener=f,a.addEventListener)X||(k=V),k===void 0&&(k=!1),a.addEventListener(u.toString(),g,k);else if(a.attachEvent)a.attachEvent(Mn(u.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return f}function Ut(){function a(f){return u.call(a.src,a.listener,f)}const u=Vs;return a}function Fs(a,u,f,g,k){if(Array.isArray(u))for(var R=0;R<u.length;R++)Fs(a,u[R],f,g,k);else g=d(g)?!!g.capture:!!g,f=gn(f),a&&a[zt]?(a=a.i,u=String(u).toString(),u in a.g&&(R=a.g[u],f=Kt(R,f,g,k),-1<f&&(ue(R[f]),Array.prototype.splice.call(R,f,1),R.length==0&&(delete a.g[u],a.h--)))):a&&(a=rn(a))&&(u=a.g[u.toString()],a=-1,u&&(a=Kt(u,f,g,k)),(f=-1<a?u[a]:null)&&mn(f))}function mn(a){if(typeof a!="number"&&a&&!a.da){var u=a.src;if(u&&u[zt])sn(u.i,a);else{var f=a.type,g=a.proxy;u.removeEventListener?u.removeEventListener(f,g,a.capture):u.detachEvent?u.detachEvent(Mn(f),g):u.addListener&&u.removeListener&&u.removeListener(g),(f=rn(u))?(sn(f,a),f.h==0&&(f.src=null,u[ze]=null)):ue(a)}}}function Mn(a){return a in Ue?Ue[a]:Ue[a]="on"+a}function Vs(a,u){if(a.da)a=!0;else{u=new Se(u,this);var f=a.listener,g=a.ha||a.src;a.fa&&mn(a),a=f.call(g,u)}return a}function rn(a){return a=a[ze],a instanceof Qe?a:null}var Mt="__closure_events_fn_"+(1e9*Math.random()>>>0);function gn(a){return typeof a=="function"?a:(a[Mt]||(a[Mt]=function(u){return a.handleEvent(u)}),a[Mt])}function Oe(){ie.call(this),this.i=new Qe(this),this.M=this,this.F=null}T(Oe,ie),Oe.prototype[zt]=!0,Oe.prototype.removeEventListener=function(a,u,f,g){Fs(this,a,u,f,g)};function $e(a,u){var f,g=a.F;if(g)for(f=[];g;g=g.F)f.push(g);if(a=a.M,g=u.type||u,typeof u=="string")u=new F(u,a);else if(u instanceof F)u.target=u.target||a;else{var k=u;u=new F(g,a),b(u,k)}if(k=!0,f)for(var R=f.length-1;0<=R;R--){var V=u.g=f[R];k=Dt(V,g,!0,u)&&k}if(V=u.g=a,k=Dt(V,g,!0,u)&&k,k=Dt(V,g,!1,u)&&k,f)for(R=0;R<f.length;R++)V=u.g=f[R],k=Dt(V,g,!1,u)&&k}Oe.prototype.N=function(){if(Oe.aa.N.call(this),this.i){var a=this.i,u;for(u in a.g){for(var f=a.g[u],g=0;g<f.length;g++)ue(f[g]);delete a.g[u],a.h--}}this.F=null},Oe.prototype.K=function(a,u,f,g){return this.i.add(String(a),u,!1,f,g)},Oe.prototype.L=function(a,u,f,g){return this.i.add(String(a),u,!0,f,g)};function Dt(a,u,f,g){if(u=a.i.g[String(u)],!u)return!0;u=u.concat();for(var k=!0,R=0;R<u.length;++R){var V=u[R];if(V&&!V.da&&V.capture==f){var _e=V.listener,nt=V.ha||V.src;V.fa&&sn(a.i,V),k=_e.call(nt,g)!==!1&&k}}return k&&!g.defaultPrevented}function hs(a,u,f){if(typeof a=="function")f&&(a=p(a,f));else if(a&&typeof a.handleEvent=="function")a=p(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(a,u||0)}function on(a){a.g=hs(()=>{a.g=null,a.i&&(a.i=!1,on(a))},a.l);const u=a.h;a.h=null,a.m.apply(null,u)}class $t extends ie{constructor(u,f){super(),this.m=u,this.l=f,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:on(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function qt(a){ie.call(this),this.h=a,this.g={}}T(qt,ie);var Le=[];function an(a){$(a.g,function(u,f){this.g.hasOwnProperty(f)&&mn(u)},a),a.g={}}qt.prototype.N=function(){qt.aa.N.call(this),an(this)},qt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Dn=l.JSON.stringify,yn=l.JSON.parse,Bn=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function Ln(){}Ln.prototype.h=null;function pr(a){return a.h||(a.h=a.i())}function Nn(){}var Ht={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function On(){F.call(this,"d")}T(On,F);function Qt(){F.call(this,"c")}T(Qt,F);var Fe={},Y=null;function xe(){return Y=Y||new Oe}Fe.La="serverreachability";function dt(a){F.call(this,Fe.La,a)}T(dt,F);function Tt(a){const u=xe();$e(u,new dt(u))}Fe.STAT_EVENT="statevent";function Jt(a,u){F.call(this,Fe.STAT_EVENT,a),this.stat=u}T(Jt,F);function et(a){const u=xe();$e(u,new Jt(u,a))}Fe.Ma="timingevent";function So(a,u){F.call(this,Fe.Ma,a),this.size=u}T(So,F);function zs(a,u){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},u)}function Fn(){this.g=!0}Fn.prototype.xa=function(){this.g=!1};function Tl(a,u,f,g,k,R){a.info(function(){if(a.g)if(R)for(var V="",_e=R.split("&"),nt=0;nt<_e.length;nt++){var fe=_e[nt].split("=");if(1<fe.length){var ht=fe[0];fe=fe[1];var ft=ht.split("_");V=2<=ft.length&&ft[1]=="type"?V+(ht+"="+fe+"&"):V+(ht+"=redacted&")}}else V=null;else V=R;return"XMLHTTP REQ ("+g+") [attempt "+k+"]: "+u+`
`+f+`
`+V})}function xo(a,u,f,g,k,R,V){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+k+"]: "+u+`
`+f+`
`+R+" "+V})}function Vn(a,u,f,g){a.info(function(){return"XMLHTTP TEXT ("+u+"): "+ko(a,f)+(g?" "+g:"")})}function Ao(a,u){a.info(function(){return"TIMEOUT: "+u})}Fn.prototype.info=function(){};function ko(a,u){if(!a.g)return u;if(!u)return null;try{var f=JSON.parse(u);if(f){for(a=0;a<f.length;a++)if(Array.isArray(f[a])){var g=f[a];if(!(2>g.length)){var k=g[1];if(Array.isArray(k)&&!(1>k.length)){var R=k[0];if(R!="noop"&&R!="stop"&&R!="close")for(var V=1;V<k.length;V++)k[V]=""}}}}return Dn(f)}catch{return u}}var W={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Re={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},je;function qe(){}T(qe,Ln),qe.prototype.g=function(){return new XMLHttpRequest},qe.prototype.i=function(){return{}},je=new qe;function He(a,u,f,g){this.j=a,this.i=u,this.l=f,this.R=g||1,this.U=new qt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new he}function he(){this.i=null,this.g="",this.h=!1}var ut={},tt={};function vn(a,u,f){a.L=1,a.v=Mo(zn(u)),a.m=f,a.P=!0,ai(a,null)}function ai(a,u){a.F=Date.now(),mr(a),a.A=zn(a.v);var f=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),Vu(f.i,"t",g),a.C=0,f=a.j.J,a.h=new he,a.g=sh(a.j,f?u:null,!a.m),0<a.O&&(a.M=new $t(p(a.Y,a,a.g),a.O)),u=a.U,f=a.g,g=a.ca;var k="readystatechange";Array.isArray(k)||(k&&(Le[0]=k.toString()),k=Le);for(var R=0;R<k.length;R++){var V=pn(f,k[R],g||u.handleEvent,!1,u.h||u);if(!V)break;u.g[V.key]=V}u=a.H?v(a.H):{},a.m?(a.u||(a.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,u)):(a.u="GET",a.g.ea(a.A,a.u,null,u)),Tt(),Tl(a.i,a.u,a.A,a.l,a.R,a.m)}He.prototype.ca=function(a){a=a.target;const u=this.M;u&&Un(a)==3?u.j():this.Y(a)},He.prototype.Y=function(a){try{if(a==this.g)e:{const ft=Un(this.g);var u=this.g.Ba();const vr=this.g.Z();if(!(3>ft)&&(ft!=3||this.g&&(this.h.h||this.g.oa()||Yu(this.g)))){this.J||ft!=4||u==7||(u==8||0>=vr?Tt(3):Tt(2)),Sl(this);var f=this.g.Z();this.X=f;t:if(Bt(this)){var g=Yu(this.g);a="";var k=g.length,R=Un(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Us(this),li(this);var V="";break t}this.h.i=new l.TextDecoder}for(u=0;u<k;u++)this.h.h=!0,a+=this.h.i.decode(g[u],{stream:!(R&&u==k-1)});g.length=0,this.h.g+=a,this.C=0,V=this.h.g}else V=this.g.oa();if(this.o=f==200,xo(this.i,this.u,this.A,this.l,this.R,ft,f),this.o){if(this.T&&!this.K){t:{if(this.g){var _e,nt=this.g;if((_e=nt.g?nt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!C(_e)){var fe=_e;break t}}fe=null}if(f=fe)Vn(this.i,this.l,f,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,xl(this,f);else{this.o=!1,this.s=3,et(12),Us(this),li(this);break e}}if(this.P){f=!0;let ln;for(;!this.J&&this.C<V.length;)if(ln=Co(this,V),ln==tt){ft==4&&(this.s=4,et(14),f=!1),Vn(this.i,this.l,null,"[Incomplete Response]");break}else if(ln==ut){this.s=4,et(15),Vn(this.i,this.l,V,"[Invalid Chunk]"),f=!1;break}else Vn(this.i,this.l,ln,null),xl(this,ln);if(Bt(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ft!=4||V.length!=0||this.h.h||(this.s=1,et(16),f=!1),this.o=this.o&&f,!f)Vn(this.i,this.l,V,"[Invalid Chunked Response]"),Us(this),li(this);else if(0<V.length&&!this.W){this.W=!0;var ht=this.j;ht.g==this&&ht.ba&&!ht.M&&(ht.j.info("Great, no buffering proxy detected. Bytes received: "+V.length),Ml(ht),ht.M=!0,et(11))}}else Vn(this.i,this.l,V,null),xl(this,V);ft==4&&Us(this),this.o&&!this.J&&(ft==4?Zu(this.j,this):(this.o=!1,mr(this)))}else c0(this.g),f==400&&0<V.indexOf("Unknown SID")?(this.s=3,et(12)):(this.s=0,et(13)),Us(this),li(this)}}}catch{}finally{}};function Bt(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Co(a,u){var f=a.C,g=u.indexOf(`
`,f);return g==-1?tt:(f=Number(u.substring(f,g)),isNaN(f)?ut:(g+=1,g+f>u.length?tt:(u=u.slice(g,g+f),a.C=g+f,u)))}He.prototype.cancel=function(){this.J=!0,Us(this)};function mr(a){a.S=Date.now()+a.I,Il(a,a.I)}function Il(a,u){if(a.B!=null)throw Error("WatchDog timer not null");a.B=zs(p(a.ba,a),u)}function Sl(a){a.B&&(l.clearTimeout(a.B),a.B=null)}He.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(Ao(this.i,this.A),this.L!=2&&(Tt(),et(17)),Us(this),this.s=2,li(this)):Il(this,this.S-a)};function li(a){a.j.G==0||a.J||Zu(a.j,a)}function Us(a){Sl(a);var u=a.M;u&&typeof u.ma=="function"&&u.ma(),a.M=null,an(a.U),a.g&&(u=a.g,a.g=null,u.abort(),u.ma())}function xl(a,u){try{var f=a.j;if(f.G!=0&&(f.g==a||Al(f.h,a))){if(!a.K&&Al(f.h,a)&&f.G==3){try{var g=f.Da.g.parse(u)}catch{g=null}if(Array.isArray(g)&&g.length==3){var k=g;if(k[0]==0){e:if(!f.u){if(f.g)if(f.g.F+3e3<a.F)Fo(f),No(f);else break e;Pl(f),et(18)}}else f.za=k[1],0<f.za-f.T&&37500>k[2]&&f.F&&f.v==0&&!f.C&&(f.C=zs(p(f.Za,f),6e3));if(1>=Ru(f.h)&&f.ca){try{f.ca()}catch{}f.ca=void 0}}else qs(f,11)}else if((a.K||f.g==a)&&Fo(f),!C(u))for(k=f.Da.g.parse(u),u=0;u<k.length;u++){let fe=k[u];if(f.T=fe[0],fe=fe[1],f.G==2)if(fe[0]=="c"){f.K=fe[1],f.ia=fe[2];const ht=fe[3];ht!=null&&(f.la=ht,f.j.info("VER="+f.la));const ft=fe[4];ft!=null&&(f.Aa=ft,f.j.info("SVER="+f.Aa));const vr=fe[5];vr!=null&&typeof vr=="number"&&0<vr&&(g=1.5*vr,f.L=g,f.j.info("backChannelRequestTimeoutMs_="+g)),g=f;const ln=a.g;if(ln){const zo=ln.g?ln.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(zo){var R=g.h;R.g||zo.indexOf("spdy")==-1&&zo.indexOf("quic")==-1&&zo.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(kl(R,R.h),R.h=null))}if(g.D){const Dl=ln.g?ln.g.getResponseHeader("X-HTTP-Session-Id"):null;Dl&&(g.ya=Dl,Ae(g.I,g.D,Dl))}}f.G=3,f.l&&f.l.ua(),f.ba&&(f.R=Date.now()-a.F,f.j.info("Handshake RTT: "+f.R+"ms")),g=f;var V=a;if(g.qa=nh(g,g.J?g.ia:null,g.W),V.K){Pu(g.h,V);var _e=V,nt=g.L;nt&&(_e.I=nt),_e.B&&(Sl(_e),mr(_e)),g.g=V}else Ju(g);0<f.i.length&&Oo(f)}else fe[0]!="stop"&&fe[0]!="close"||qs(f,7);else f.G==3&&(fe[0]=="stop"||fe[0]=="close"?fe[0]=="stop"?qs(f,7):Rl(f):fe[0]!="noop"&&f.l&&f.l.ta(fe),f.v=0)}}Tt(4)}catch{}}var Gy=class{constructor(a,u){this.g=a,this.map=u}};function ku(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Cu(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Ru(a){return a.h?1:a.g?a.g.size:0}function Al(a,u){return a.h?a.h==u:a.g?a.g.has(u):!1}function kl(a,u){a.g?a.g.add(u):a.h=u}function Pu(a,u){a.h&&a.h==u?a.h=null:a.g&&a.g.has(u)&&a.g.delete(u)}ku.prototype.cancel=function(){if(this.i=Mu(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Mu(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let u=a.i;for(const f of a.g.values())u=u.concat(f.D);return u}return S(a.i)}function jy(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var u=[],f=a.length,g=0;g<f;g++)u.push(a[g]);return u}u=[],f=0;for(g in a)u[f++]=a[g];return u}function Ky(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var u=[];a=a.length;for(var f=0;f<a;f++)u.push(f);return u}u=[],f=0;for(const g in a)u[f++]=g;return u}}}function Du(a,u){if(a.forEach&&typeof a.forEach=="function")a.forEach(u,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,u,void 0);else for(var f=Ky(a),g=jy(a),k=g.length,R=0;R<k;R++)u.call(void 0,g[R],f&&f[R],a)}var Bu=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Qy(a,u){if(a){a=a.split("&");for(var f=0;f<a.length;f++){var g=a[f].indexOf("="),k=null;if(0<=g){var R=a[f].substring(0,g);k=a[f].substring(g+1)}else R=a[f];u(R,k?decodeURIComponent(k.replace(/\+/g," ")):"")}}}function $s(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof $s){this.h=a.h,Ro(this,a.j),this.o=a.o,this.g=a.g,Po(this,a.s),this.l=a.l;var u=a.i,f=new ui;f.i=u.i,u.g&&(f.g=new Map(u.g),f.h=u.h),Lu(this,f),this.m=a.m}else a&&(u=String(a).match(Bu))?(this.h=!1,Ro(this,u[1]||"",!0),this.o=ci(u[2]||""),this.g=ci(u[3]||"",!0),Po(this,u[4]),this.l=ci(u[5]||"",!0),Lu(this,u[6]||"",!0),this.m=ci(u[7]||"")):(this.h=!1,this.i=new ui(null,this.h))}$s.prototype.toString=function(){var a=[],u=this.j;u&&a.push(di(u,Nu,!0),":");var f=this.g;return(f||u=="file")&&(a.push("//"),(u=this.o)&&a.push(di(u,Nu,!0),"@"),a.push(encodeURIComponent(String(f)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.s,f!=null&&a.push(":",String(f))),(f=this.l)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(di(f,f.charAt(0)=="/"?Zy:Xy,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",di(f,t0)),a.join("")};function zn(a){return new $s(a)}function Ro(a,u,f){a.j=f?ci(u,!0):u,a.j&&(a.j=a.j.replace(/:$/,""))}function Po(a,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);a.s=u}else a.s=null}function Lu(a,u,f){u instanceof ui?(a.i=u,n0(a.i,a.h)):(f||(u=di(u,e0)),a.i=new ui(u,a.h))}function Ae(a,u,f){a.i.set(u,f)}function Mo(a){return Ae(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function ci(a,u){return a?u?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function di(a,u,f){return typeof a=="string"?(a=encodeURI(a).replace(u,Jy),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Jy(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Nu=/[#\/\?@]/g,Xy=/[#\?:]/g,Zy=/[#\?]/g,e0=/[#\?@]/g,t0=/#/g;function ui(a,u){this.h=this.g=null,this.i=a||null,this.j=!!u}function fs(a){a.g||(a.g=new Map,a.h=0,a.i&&Qy(a.i,function(u,f){a.add(decodeURIComponent(u.replace(/\+/g," ")),f)}))}t=ui.prototype,t.add=function(a,u){fs(this),this.i=null,a=gr(this,a);var f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(u),this.h+=1,this};function Ou(a,u){fs(a),u=gr(a,u),a.g.has(u)&&(a.i=null,a.h-=a.g.get(u).length,a.g.delete(u))}function Fu(a,u){return fs(a),u=gr(a,u),a.g.has(u)}t.forEach=function(a,u){fs(this),this.g.forEach(function(f,g){f.forEach(function(k){a.call(u,k,g,this)},this)},this)},t.na=function(){fs(this);const a=Array.from(this.g.values()),u=Array.from(this.g.keys()),f=[];for(let g=0;g<u.length;g++){const k=a[g];for(let R=0;R<k.length;R++)f.push(u[g])}return f},t.V=function(a){fs(this);let u=[];if(typeof a=="string")Fu(this,a)&&(u=u.concat(this.g.get(gr(this,a))));else{a=Array.from(this.g.values());for(let f=0;f<a.length;f++)u=u.concat(a[f])}return u},t.set=function(a,u){return fs(this),this.i=null,a=gr(this,a),Fu(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[u]),this.h+=1,this},t.get=function(a,u){return a?(a=this.V(a),0<a.length?String(a[0]):u):u};function Vu(a,u,f){Ou(a,u),0<f.length&&(a.i=null,a.g.set(gr(a,u),S(f)),a.h+=f.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],u=Array.from(this.g.keys());for(var f=0;f<u.length;f++){var g=u[f];const R=encodeURIComponent(String(g)),V=this.V(g);for(g=0;g<V.length;g++){var k=R;V[g]!==""&&(k+="="+encodeURIComponent(String(V[g]))),a.push(k)}}return this.i=a.join("&")};function gr(a,u){return u=String(u),a.j&&(u=u.toLowerCase()),u}function n0(a,u){u&&!a.j&&(fs(a),a.i=null,a.g.forEach(function(f,g){var k=g.toLowerCase();g!=k&&(Ou(this,g),Vu(this,k,f))},a)),a.j=u}function s0(a,u){const f=new Fn;if(l.Image){const g=new Image;g.onload=w(ps,f,"TestLoadImage: loaded",!0,u,g),g.onerror=w(ps,f,"TestLoadImage: error",!1,u,g),g.onabort=w(ps,f,"TestLoadImage: abort",!1,u,g),g.ontimeout=w(ps,f,"TestLoadImage: timeout",!1,u,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else u(!1)}function r0(a,u){const f=new Fn,g=new AbortController,k=setTimeout(()=>{g.abort(),ps(f,"TestPingServer: timeout",!1,u)},1e4);fetch(a,{signal:g.signal}).then(R=>{clearTimeout(k),R.ok?ps(f,"TestPingServer: ok",!0,u):ps(f,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(k),ps(f,"TestPingServer: error",!1,u)})}function ps(a,u,f,g,k){try{k&&(k.onload=null,k.onerror=null,k.onabort=null,k.ontimeout=null),g(f)}catch{}}function i0(){this.g=new Bn}function o0(a,u,f){const g=f||"";try{Du(a,function(k,R){let V=k;d(k)&&(V=Dn(k)),u.push(g+R+"="+encodeURIComponent(V))})}catch(k){throw u.push(g+"type="+encodeURIComponent("_badmap")),k}}function Do(a){this.l=a.Ub||null,this.j=a.eb||!1}T(Do,Ln),Do.prototype.g=function(){return new Bo(this.l,this.j)},Do.prototype.i=function(a){return function(){return a}}({});function Bo(a,u){Oe.call(this),this.D=a,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}T(Bo,Oe),t=Bo.prototype,t.open=function(a,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=u,this.readyState=1,fi(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(u.body=a),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,hi(this)),this.readyState=0},t.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,fi(this)),this.g&&(this.readyState=3,fi(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;zu(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function zu(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}t.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var u=a.value?a.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!a.done}))&&(this.response=this.responseText+=u)}a.done?hi(this):fi(this),this.readyState==3&&zu(this)}},t.Ra=function(a){this.g&&(this.response=this.responseText=a,hi(this))},t.Qa=function(a){this.g&&(this.response=a,hi(this))},t.ga=function(){this.g&&hi(this)};function hi(a){a.readyState=4,a.l=null,a.j=null,a.v=null,fi(a)}t.setRequestHeader=function(a,u){this.u.append(a,u)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],u=this.h.entries();for(var f=u.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=u.next();return a.join(`\r
`)};function fi(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Bo.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Uu(a){let u="";return $(a,function(f,g){u+=g,u+=":",u+=f,u+=`\r
`}),u}function Cl(a,u,f){e:{for(g in f){var g=!1;break e}g=!0}g||(f=Uu(f),typeof a=="string"?f!=null&&encodeURIComponent(String(f)):Ae(a,u,f))}function Ne(a){Oe.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}T(Ne,Oe);var a0=/^https?$/i,l0=["POST","PUT"];t=Ne.prototype,t.Ha=function(a){this.J=a},t.ea=function(a,u,f,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);u=u?u.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():je.g(),this.v=this.o?pr(this.o):pr(je),this.g.onreadystatechange=p(this.Ea,this);try{this.B=!0,this.g.open(u,String(a),!0),this.B=!1}catch(R){$u(this,R);return}if(a=f||"",f=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var k in g)f.set(k,g[k]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const R of g.keys())f.set(R,g.get(R));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(f.keys()).find(R=>R.toLowerCase()=="content-type"),k=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(l0,u,void 0))||g||k||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,V]of f)this.g.setRequestHeader(R,V);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Wu(this),this.u=!0,this.g.send(a),this.u=!1}catch(R){$u(this,R)}};function $u(a,u){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=u,a.m=5,qu(a),Lo(a)}function qu(a){a.A||(a.A=!0,$e(a,"complete"),$e(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,$e(this,"complete"),$e(this,"abort"),Lo(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Lo(this,!0)),Ne.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?Hu(this):this.bb())},t.bb=function(){Hu(this)};function Hu(a){if(a.h&&typeof o<"u"&&(!a.v[1]||Un(a)!=4||a.Z()!=2)){if(a.u&&Un(a)==4)hs(a.Ea,0,a);else if($e(a,"readystatechange"),Un(a)==4){a.h=!1;try{const V=a.Z();e:switch(V){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var f;if(!(f=u)){var g;if(g=V===0){var k=String(a.D).match(Bu)[1]||null;!k&&l.self&&l.self.location&&(k=l.self.location.protocol.slice(0,-1)),g=!a0.test(k?k.toLowerCase():"")}f=g}if(f)$e(a,"complete"),$e(a,"success");else{a.m=6;try{var R=2<Un(a)?a.g.statusText:""}catch{R=""}a.l=R+" ["+a.Z()+"]",qu(a)}}finally{Lo(a)}}}}function Lo(a,u){if(a.g){Wu(a);const f=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,u||$e(a,"ready");try{f.onreadystatechange=g}catch{}}}function Wu(a){a.I&&(l.clearTimeout(a.I),a.I=null)}t.isActive=function(){return!!this.g};function Un(a){return a.g?a.g.readyState:0}t.Z=function(){try{return 2<Un(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(a){if(this.g){var u=this.g.responseText;return a&&u.indexOf(a)==0&&(u=u.substring(a.length)),yn(u)}};function Yu(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function c0(a){const u={};a=(a.g&&2<=Un(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(C(a[g]))continue;var f=E(a[g]);const k=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const R=u[k]||[];u[k]=R,R.push(f)}I(u,function(g){return g.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function pi(a,u,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||u}function Gu(a){this.Aa=0,this.i=[],this.j=new Fn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=pi("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=pi("baseRetryDelayMs",5e3,a),this.cb=pi("retryDelaySeedMs",1e4,a),this.Wa=pi("forwardChannelMaxRetries",2,a),this.wa=pi("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new ku(a&&a.concurrentRequestLimit),this.Da=new i0,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=Gu.prototype,t.la=8,t.G=1,t.connect=function(a,u,f,g){et(0),this.W=a,this.H=u||{},f&&g!==void 0&&(this.H.OSID=f,this.H.OAID=g),this.F=this.X,this.I=nh(this,null,this.W),Oo(this)};function Rl(a){if(ju(a),a.G==3){var u=a.U++,f=zn(a.I);if(Ae(f,"SID",a.K),Ae(f,"RID",u),Ae(f,"TYPE","terminate"),mi(a,f),u=new He(a,a.j,u),u.L=2,u.v=Mo(zn(f)),f=!1,l.navigator&&l.navigator.sendBeacon)try{f=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!f&&l.Image&&(new Image().src=u.v,f=!0),f||(u.g=sh(u.j,null),u.g.ea(u.v)),u.F=Date.now(),mr(u)}th(a)}function No(a){a.g&&(Ml(a),a.g.cancel(),a.g=null)}function ju(a){No(a),a.u&&(l.clearTimeout(a.u),a.u=null),Fo(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Oo(a){if(!Cu(a.h)&&!a.s){a.s=!0;var u=a.Ga;ne||we(),se||(ne(),se=!0),ae.add(u,a),a.B=0}}function d0(a,u){return Ru(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=u.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=zs(p(a.Ga,a,u),eh(a,a.B)),a.B++,!0)}t.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const k=new He(this,this.j,a);let R=this.o;if(this.S&&(R?(R=v(R),b(R,this.S)):R=this.S),this.m!==null||this.O||(k.H=R,R=null),this.P)e:{for(var u=0,f=0;f<this.i.length;f++){t:{var g=this.i[f];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(u+=g,4096<u){u=f;break e}if(u===4096||f===this.i.length-1){u=f+1;break e}}u=1e3}else u=1e3;u=Qu(this,k,u),f=zn(this.I),Ae(f,"RID",a),Ae(f,"CVER",22),this.D&&Ae(f,"X-HTTP-Session-Id",this.D),mi(this,f),R&&(this.O?u="headers="+encodeURIComponent(String(Uu(R)))+"&"+u:this.m&&Cl(f,this.m,R)),kl(this.h,k),this.Ua&&Ae(f,"TYPE","init"),this.P?(Ae(f,"$req",u),Ae(f,"SID","null"),k.T=!0,vn(k,f,null)):vn(k,f,u),this.G=2}}else this.G==3&&(a?Ku(this,a):this.i.length==0||Cu(this.h)||Ku(this))};function Ku(a,u){var f;u?f=u.l:f=a.U++;const g=zn(a.I);Ae(g,"SID",a.K),Ae(g,"RID",f),Ae(g,"AID",a.T),mi(a,g),a.m&&a.o&&Cl(g,a.m,a.o),f=new He(a,a.j,f,a.B+1),a.m===null&&(f.H=a.o),u&&(a.i=u.D.concat(a.i)),u=Qu(a,f,1e3),f.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),kl(a.h,f),vn(f,g,u)}function mi(a,u){a.H&&$(a.H,function(f,g){Ae(u,g,f)}),a.l&&Du({},function(f,g){Ae(u,g,f)})}function Qu(a,u,f){f=Math.min(a.i.length,f);var g=a.l?p(a.l.Na,a.l,a):null;e:{var k=a.i;let R=-1;for(;;){const V=["count="+f];R==-1?0<f?(R=k[0].g,V.push("ofs="+R)):R=0:V.push("ofs="+R);let _e=!0;for(let nt=0;nt<f;nt++){let fe=k[nt].g;const ht=k[nt].map;if(fe-=R,0>fe)R=Math.max(0,k[nt].g-100),_e=!1;else try{o0(ht,V,"req"+fe+"_")}catch{g&&g(ht)}}if(_e){g=V.join("&");break e}}}return a=a.i.splice(0,f),u.D=a,g}function Ju(a){if(!a.g&&!a.u){a.Y=1;var u=a.Fa;ne||we(),se||(ne(),se=!0),ae.add(u,a),a.v=0}}function Pl(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=zs(p(a.Fa,a),eh(a,a.v)),a.v++,!0)}t.Fa=function(){if(this.u=null,Xu(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=zs(p(this.ab,this),a)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,et(10),No(this),Xu(this))};function Ml(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Xu(a){a.g=new He(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var u=zn(a.qa);Ae(u,"RID","rpc"),Ae(u,"SID",a.K),Ae(u,"AID",a.T),Ae(u,"CI",a.F?"0":"1"),!a.F&&a.ja&&Ae(u,"TO",a.ja),Ae(u,"TYPE","xmlhttp"),mi(a,u),a.m&&a.o&&Cl(u,a.m,a.o),a.L&&(a.g.I=a.L);var f=a.g;a=a.ia,f.L=1,f.v=Mo(zn(u)),f.m=null,f.P=!0,ai(f,a)}t.Za=function(){this.C!=null&&(this.C=null,No(this),Pl(this),et(19))};function Fo(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function Zu(a,u){var f=null;if(a.g==u){Fo(a),Ml(a),a.g=null;var g=2}else if(Al(a.h,u))f=u.D,Pu(a.h,u),g=1;else return;if(a.G!=0){if(u.o)if(g==1){f=u.m?u.m.length:0,u=Date.now()-u.F;var k=a.B;g=xe(),$e(g,new So(g,f)),Oo(a)}else Ju(a);else if(k=u.s,k==3||k==0&&0<u.X||!(g==1&&d0(a,u)||g==2&&Pl(a)))switch(f&&0<f.length&&(u=a.h,u.i=u.i.concat(f)),k){case 1:qs(a,5);break;case 4:qs(a,10);break;case 3:qs(a,6);break;default:qs(a,2)}}}function eh(a,u){let f=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(f*=2),f*u}function qs(a,u){if(a.j.info("Error code "+u),u==2){var f=p(a.fb,a),g=a.Xa;const k=!g;g=new $s(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Ro(g,"https"),Mo(g),k?s0(g.toString(),f):r0(g.toString(),f)}else et(2);a.G=0,a.l&&a.l.sa(u),th(a),ju(a)}t.fb=function(a){a?(this.j.info("Successfully pinged google.com"),et(2)):(this.j.info("Failed to ping google.com"),et(1))};function th(a){if(a.G=0,a.ka=[],a.l){const u=Mu(a.h);(u.length!=0||a.i.length!=0)&&(A(a.ka,u),A(a.ka,a.i),a.h.i.length=0,S(a.i),a.i.length=0),a.l.ra()}}function nh(a,u,f){var g=f instanceof $s?zn(f):new $s(f);if(g.g!="")u&&(g.g=u+"."+g.g),Po(g,g.s);else{var k=l.location;g=k.protocol,u=u?u+"."+k.hostname:k.hostname,k=+k.port;var R=new $s(null);g&&Ro(R,g),u&&(R.g=u),k&&Po(R,k),f&&(R.l=f),g=R}return f=a.D,u=a.ya,f&&u&&Ae(g,f,u),Ae(g,"VER",a.la),mi(a,g),g}function sh(a,u,f){if(u&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=a.Ca&&!a.pa?new Ne(new Do({eb:f})):new Ne(a.pa),u.Ha(a.J),u}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function rh(){}t=rh.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function Vo(){}Vo.prototype.g=function(a,u){return new Wt(a,u)};function Wt(a,u){Oe.call(this),this.g=new Gu(u),this.l=a,this.h=u&&u.messageUrlParams||null,a=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(a?a["X-WebChannel-Content-Type"]=u.messageContentType:a={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(a?a["X-WebChannel-Client-Profile"]=u.va:a={"X-WebChannel-Client-Profile":u.va}),this.g.S=a,(a=u&&u.Sb)&&!C(a)&&(this.g.m=a),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!C(u)&&(this.g.D=u,a=this.h,a!==null&&u in a&&(a=this.h,u in a&&delete a[u])),this.j=new yr(this)}T(Wt,Oe),Wt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Wt.prototype.close=function(){Rl(this.g)},Wt.prototype.o=function(a){var u=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.u&&(f={},f.__data__=Dn(a),a=f);u.i.push(new Gy(u.Ya++,a)),u.G==3&&Oo(u)},Wt.prototype.N=function(){this.g.l=null,delete this.j,Rl(this.g),delete this.g,Wt.aa.N.call(this)};function ih(a){On.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var u=a.__sm__;if(u){e:{for(const f in u){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,u=u!==null&&a in u?u[a]:void 0),this.data=u}else this.data=a}T(ih,On);function oh(){Qt.call(this),this.status=1}T(oh,Qt);function yr(a){this.g=a}T(yr,rh),yr.prototype.ua=function(){$e(this.g,"a")},yr.prototype.ta=function(a){$e(this.g,new ih(a))},yr.prototype.sa=function(a){$e(this.g,new oh)},yr.prototype.ra=function(){$e(this.g,"b")},Vo.prototype.createWebChannel=Vo.prototype.g,Wt.prototype.send=Wt.prototype.o,Wt.prototype.open=Wt.prototype.m,Wt.prototype.close=Wt.prototype.close,Jp=function(){return new Vo},Qp=function(){return xe()},Kp=Fe,rc={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},W.NO_ERROR=0,W.TIMEOUT=8,W.HTTP_ERROR=6,Xo=W,Re.COMPLETE="complete",jp=Re,Nn.EventType=Ht,Ht.OPEN="a",Ht.CLOSE="b",Ht.ERROR="c",Ht.MESSAGE="d",Oe.prototype.listen=Oe.prototype.K,wi=Nn,Ne.prototype.listenOnce=Ne.prototype.L,Ne.prototype.getLastError=Ne.prototype.Ka,Ne.prototype.getLastErrorCode=Ne.prototype.Ba,Ne.prototype.getStatus=Ne.prototype.Z,Ne.prototype.getResponseJson=Ne.prototype.Oa,Ne.prototype.getResponseText=Ne.prototype.oa,Ne.prototype.send=Ne.prototype.ea,Ne.prototype.setWithCredentials=Ne.prototype.Ha,Gp=Ne}).apply(typeof qo<"u"?qo:typeof self<"u"?self:typeof window<"u"?window:{});const zh="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}mt.UNAUTHENTICATED=new mt(null),mt.GOOGLE_CREDENTIALS=new mt("google-credentials-uid"),mt.FIRST_PARTY=new mt("first-party-uid"),mt.MOCK_USER=new mt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let jr="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sr=new zc("@firebase/firestore");function gi(){return sr.logLevel}function H(t,...e){if(sr.logLevel<=ce.DEBUG){const n=e.map(ed);sr.debug(`Firestore (${jr}): ${t}`,...n)}}function es(t,...e){if(sr.logLevel<=ce.ERROR){const n=e.map(ed);sr.error(`Firestore (${jr}): ${t}`,...n)}}function Lr(t,...e){if(sr.logLevel<=ce.WARN){const n=e.map(ed);sr.warn(`Firestore (${jr}): ${t}`,...n)}}function ed(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function Q(t="Unexpected state"){const e=`FIRESTORE (${jr}) INTERNAL ASSERTION FAILED: `+t;throw es(e),new Error(e)}function ve(t,e){t||Q()}function ee(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class U extends os{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xp{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class g_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(mt.UNAUTHENTICATED))}shutdown(){}}class y_{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class v_{constructor(e){this.t=e,this.currentUser=mt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){ve(this.o===void 0);let s=this.i;const r=c=>this.i!==s?(s=this.i,n(c)):Promise.resolve();let i=new Kn;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Kn,e.enqueueRetryable(()=>r(this.currentUser))};const o=()=>{const c=i;e.enqueueRetryable(async()=>{await c.promise,await r(this.currentUser)})},l=c=>{H("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(H("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Kn)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(s=>this.i!==e?(H("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(ve(typeof s.accessToken=="string"),new Xp(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ve(e===null||typeof e=="string"),new mt(e)}}class b_{constructor(e,n,s){this.l=e,this.h=n,this.P=s,this.type="FirstParty",this.user=mt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class w_{constructor(e,n,s){this.l=e,this.h=n,this.P=s}getToken(){return Promise.resolve(new b_(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(mt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class __{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class E_{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){ve(this.o===void 0);const s=i=>{i.error!=null&&H("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.R;return this.R=i.token,H("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>s(i))};const r=i=>{H("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>r(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?r(i):H("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(ve(typeof n.token=="string"),this.R=n.token,new __(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T_(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let s=0;s<t;s++)n[s]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zp{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const r=T_(40);for(let i=0;i<r.length;++i)s.length<20&&r[i]<n&&(s+=e.charAt(r[i]%e.length))}return s}}function pe(t,e){return t<e?-1:t>e?1:0}function Nr(t,e,n){return t.length===e.length&&t.every((s,r)=>n(s,e[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new U(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new U(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new U(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new U(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Ke.fromMillis(Date.now())}static fromDate(e){return Ke.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*n));return new Ke(n,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?pe(this.nanoseconds,e.nanoseconds):pe(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z{constructor(e){this.timestamp=e}static fromTimestamp(e){return new Z(e)}static min(){return new Z(new Ke(0,0))}static max(){return new Z(new Ke(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fi{constructor(e,n,s){n===void 0?n=0:n>e.length&&Q(),s===void 0?s=e.length-n:s>e.length-n&&Q(),this.segments=e,this.offset=n,this.len=s}get length(){return this.len}isEqual(e){return Fi.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof Fi?e.forEach(s=>{n.push(s)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,s=this.limit();n<s;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const s=Math.min(e.length,n.length);for(let r=0;r<s;r++){const i=e.get(r),o=n.get(r);if(i<o)return-1;if(i>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class ke extends Fi{construct(e,n,s){return new ke(e,n,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const s of e){if(s.indexOf("//")>=0)throw new U(M.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);n.push(...s.split("/").filter(r=>r.length>0))}return new ke(n)}static emptyPath(){return new ke([])}}const I_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class rt extends Fi{construct(e,n,s){return new rt(e,n,s)}static isValidIdentifier(e){return I_.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),rt.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new rt(["__name__"])}static fromServerFormat(e){const n=[];let s="",r=0;const i=()=>{if(s.length===0)throw new U(M.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(s),s=""};let o=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new U(M.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[r+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new U(M.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=c,r+=2}else l==="`"?(o=!o,r++):l!=="."||o?(s+=l,r++):(i(),r++)}if(i(),o)throw new U(M.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new rt(n)}static emptyPath(){return new rt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.path=e}static fromPath(e){return new G(ke.fromString(e))}static fromName(e){return new G(ke.fromString(e).popFirst(5))}static empty(){return new G(ke.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ke.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return ke.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new G(new ke(e.slice()))}}function S_(t,e){const n=t.toTimestamp().seconds,s=t.toTimestamp().nanoseconds+1,r=Z.fromTimestamp(s===1e9?new Ke(n+1,0):new Ke(n,s));return new Cs(r,G.empty(),e)}function x_(t){return new Cs(t.readTime,t.key,-1)}class Cs{constructor(e,n,s){this.readTime=e,this.documentKey=n,this.largestBatchId=s}static min(){return new Cs(Z.min(),G.empty(),-1)}static max(){return new Cs(Z.max(),G.empty(),-1)}}function A_(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=G.comparator(t.documentKey,e.documentKey),n!==0?n:pe(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k_="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class C_{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function co(t){if(t.code!==M.FAILED_PRECONDITION||t.message!==k_)throw t;H("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&Q(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new N((s,r)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(s,r)},this.catchCallback=i=>{this.wrapFailure(n,i).next(s,r)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof N?n:N.resolve(n)}catch(n){return N.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):N.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):N.reject(n)}static resolve(e){return new N((n,s)=>{n(e)})}static reject(e){return new N((n,s)=>{s(e)})}static waitFor(e){return new N((n,s)=>{let r=0,i=0,o=!1;e.forEach(l=>{++r,l.next(()=>{++i,o&&i===r&&n()},c=>s(c))}),o=!0,i===r&&n()})}static or(e){let n=N.resolve(!1);for(const s of e)n=n.next(r=>r?N.resolve(r):s());return n}static forEach(e,n){const s=[];return e.forEach((r,i)=>{s.push(n.call(this,r,i))}),this.waitFor(s)}static mapArray(e,n){return new N((s,r)=>{const i=e.length,o=new Array(i);let l=0;for(let c=0;c<i;c++){const d=c;n(e[d]).next(h=>{o[d]=h,++l,l===i&&s(o)},h=>r(h))}})}static doWhile(e,n){return new N((s,r)=>{const i=()=>{e()===!0?n().next(()=>{i()},r):s()};i()})}}function R_(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function uo(t){return t.name==="IndexedDbTransactionError"}/**
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
 */class td{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=s=>this.ie(s),this.se=s=>n.writeSequenceNumber(s))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}td.oe=-1;function za(t){return t==null}function ba(t){return t===0&&1/t==-1/0}function P_(t){return typeof t=="number"&&Number.isInteger(t)&&!ba(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uh(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function ur(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function em(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{constructor(e,n){this.comparator=e,this.root=n||st.EMPTY}insert(e,n){return new Me(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,st.BLACK,null,null))}remove(e){return new Me(this.comparator,this.root.remove(e,this.comparator).copy(null,null,st.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return n.value;s<0?n=n.left:s>0&&(n=n.right)}return null}indexOf(e){let n=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return n+s.left.size;r<0?s=s.left:(n+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,s)=>(e(n,s),!1))}toString(){const e=[];return this.inorderTraversal((n,s)=>(e.push(`${n}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ho(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ho(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ho(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ho(this.root,e,this.comparator,!0)}}class Ho{constructor(e,n,s,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?s(e.key,n):1,n&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class st{constructor(e,n,s,r,i){this.key=e,this.value=n,this.color=s??st.RED,this.left=r??st.EMPTY,this.right=i??st.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,s,r,i){return new st(e??this.key,n??this.value,s??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,s){let r=this;const i=s(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,n,s),null):i===0?r.copy(null,n,null,null,null):r.copy(null,null,null,null,r.right.insert(e,n,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return st.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let s,r=this;if(n(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),n(e,r.key)===0){if(r.right.isEmpty())return st.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,st.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,st.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Q();const e=this.left.check();if(e!==this.right.check())throw Q();return e+(this.isRed()?0:1)}}st.EMPTY=null,st.RED=!0,st.BLACK=!1;st.EMPTY=new class{constructor(){this.size=0}get key(){throw Q()}get value(){throw Q()}get color(){throw Q()}get left(){throw Q()}get right(){throw Q()}copy(e,n,s,r,i){return this}insert(e,n,s){return new st(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e){this.comparator=e,this.data=new Me(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,s)=>(e(n),!1))}forEachInRange(e,n){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;n(r.key)}}forEachWhile(e,n){let s;for(s=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new $h(this.data.getIterator())}getIteratorFrom(e){return new $h(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(s=>{n=n.add(s)}),n}isEqual(e){if(!(e instanceof it)||this.size!==e.size)return!1;const n=this.data.getIterator(),s=e.data.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new it(this.comparator);return n.data=e,n}}class $h{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt{constructor(e){this.fields=e,e.sort(rt.comparator)}static empty(){return new Gt([])}unionWith(e){let n=new it(rt.comparator);for(const s of this.fields)n=n.add(s);for(const s of e)n=n.add(s);return new Gt(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Nr(this.fields,e.fields,(n,s)=>n.isEqual(s))}}/**
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
 */class tm extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(r){try{return atob(r)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new tm("Invalid base64 string: "+i):i}}(e);return new at(n)}static fromUint8Array(e){const n=function(r){let i="";for(let o=0;o<r.length;++o)i+=String.fromCharCode(r[o]);return i}(e);return new at(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return pe(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}at.EMPTY_BYTE_STRING=new at("");const M_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Rs(t){if(ve(!!t),typeof t=="string"){let e=0;const n=M_.exec(t);if(ve(!!n),n[1]){let r=n[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(t);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:Ve(t.seconds),nanos:Ve(t.nanos)}}function Ve(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function rr(t){return typeof t=="string"?at.fromBase64String(t):at.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nd(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function sd(t){const e=t.mapValue.fields.__previous_value__;return nd(e)?sd(e):e}function Vi(t){const e=Rs(t.mapValue.fields.__local_write_time__.timestampValue);return new Ke(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D_{constructor(e,n,s,r,i,o,l,c,d){this.databaseId=e,this.appId=n,this.persistenceKey=s,this.host=r,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class zi{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new zi("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof zi&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wo={mapValue:{}};function ir(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?nd(t)?4:L_(t)?9007199254740991:B_(t)?10:11:Q()}function Sn(t,e){if(t===e)return!0;const n=ir(t);if(n!==ir(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Vi(t).isEqual(Vi(e));case 3:return function(r,i){if(typeof r.timestampValue=="string"&&typeof i.timestampValue=="string"&&r.timestampValue.length===i.timestampValue.length)return r.timestampValue===i.timestampValue;const o=Rs(r.timestampValue),l=Rs(i.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(r,i){return rr(r.bytesValue).isEqual(rr(i.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(r,i){return Ve(r.geoPointValue.latitude)===Ve(i.geoPointValue.latitude)&&Ve(r.geoPointValue.longitude)===Ve(i.geoPointValue.longitude)}(t,e);case 2:return function(r,i){if("integerValue"in r&&"integerValue"in i)return Ve(r.integerValue)===Ve(i.integerValue);if("doubleValue"in r&&"doubleValue"in i){const o=Ve(r.doubleValue),l=Ve(i.doubleValue);return o===l?ba(o)===ba(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return Nr(t.arrayValue.values||[],e.arrayValue.values||[],Sn);case 10:case 11:return function(r,i){const o=r.mapValue.fields||{},l=i.mapValue.fields||{};if(Uh(o)!==Uh(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!Sn(o[c],l[c])))return!1;return!0}(t,e);default:return Q()}}function Ui(t,e){return(t.values||[]).find(n=>Sn(n,e))!==void 0}function Or(t,e){if(t===e)return 0;const n=ir(t),s=ir(e);if(n!==s)return pe(n,s);switch(n){case 0:case 9007199254740991:return 0;case 1:return pe(t.booleanValue,e.booleanValue);case 2:return function(i,o){const l=Ve(i.integerValue||i.doubleValue),c=Ve(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(t,e);case 3:return qh(t.timestampValue,e.timestampValue);case 4:return qh(Vi(t),Vi(e));case 5:return pe(t.stringValue,e.stringValue);case 6:return function(i,o){const l=rr(i),c=rr(o);return l.compareTo(c)}(t.bytesValue,e.bytesValue);case 7:return function(i,o){const l=i.split("/"),c=o.split("/");for(let d=0;d<l.length&&d<c.length;d++){const h=pe(l[d],c[d]);if(h!==0)return h}return pe(l.length,c.length)}(t.referenceValue,e.referenceValue);case 8:return function(i,o){const l=pe(Ve(i.latitude),Ve(o.latitude));return l!==0?l:pe(Ve(i.longitude),Ve(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Hh(t.arrayValue,e.arrayValue);case 10:return function(i,o){var l,c,d,h;const m=i.fields||{},p=o.fields||{},w=(l=m.value)===null||l===void 0?void 0:l.arrayValue,T=(c=p.value)===null||c===void 0?void 0:c.arrayValue,S=pe(((d=w==null?void 0:w.values)===null||d===void 0?void 0:d.length)||0,((h=T==null?void 0:T.values)===null||h===void 0?void 0:h.length)||0);return S!==0?S:Hh(w,T)}(t.mapValue,e.mapValue);case 11:return function(i,o){if(i===Wo.mapValue&&o===Wo.mapValue)return 0;if(i===Wo.mapValue)return 1;if(o===Wo.mapValue)return-1;const l=i.fields||{},c=Object.keys(l),d=o.fields||{},h=Object.keys(d);c.sort(),h.sort();for(let m=0;m<c.length&&m<h.length;++m){const p=pe(c[m],h[m]);if(p!==0)return p;const w=Or(l[c[m]],d[h[m]]);if(w!==0)return w}return pe(c.length,h.length)}(t.mapValue,e.mapValue);default:throw Q()}}function qh(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return pe(t,e);const n=Rs(t),s=Rs(e),r=pe(n.seconds,s.seconds);return r!==0?r:pe(n.nanos,s.nanos)}function Hh(t,e){const n=t.values||[],s=e.values||[];for(let r=0;r<n.length&&r<s.length;++r){const i=Or(n[r],s[r]);if(i)return i}return pe(n.length,s.length)}function Fr(t){return ic(t)}function ic(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const s=Rs(n);return`time(${s.seconds},${s.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return rr(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return G.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let s="[",r=!0;for(const i of n.values||[])r?r=!1:s+=",",s+=ic(i);return s+"]"}(t.arrayValue):"mapValue"in t?function(n){const s=Object.keys(n.fields||{}).sort();let r="{",i=!0;for(const o of s)i?i=!1:r+=",",r+=`${o}:${ic(n.fields[o])}`;return r+"}"}(t.mapValue):Q()}function Wh(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function oc(t){return!!t&&"integerValue"in t}function rd(t){return!!t&&"arrayValue"in t}function Yh(t){return!!t&&"nullValue"in t}function Gh(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Zo(t){return!!t&&"mapValue"in t}function B_(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function ki(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return ur(t.mapValue.fields,(n,s)=>e.mapValue.fields[n]=ki(s)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=ki(t.arrayValue.values[n]);return e}return Object.assign({},t)}function L_(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(e){this.value=e}static empty(){return new Lt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let s=0;s<e.length-1;++s)if(n=(n.mapValue.fields||{})[e.get(s)],!Zo(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=ki(n)}setAll(e){let n=rt.emptyPath(),s={},r=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const c=this.getFieldsMap(n);this.applyChanges(c,s,r),s={},r=[],n=l.popLast()}o?s[l.lastSegment()]=ki(o):r.push(l.lastSegment())});const i=this.getFieldsMap(n);this.applyChanges(i,s,r)}delete(e){const n=this.field(e.popLast());Zo(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Sn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=n.mapValue.fields[e.get(s)];Zo(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},n.mapValue.fields[e.get(s)]=r),n=r}return n.mapValue.fields}applyChanges(e,n,s){ur(n,(r,i)=>e[r]=i);for(const r of s)delete e[r]}clone(){return new Lt(ki(this.value))}}function nm(t){const e=[];return ur(t.fields,(n,s)=>{const r=new rt([n]);if(Zo(s)){const i=nm(s.mapValue).fields;if(i.length===0)e.push(r);else for(const o of i)e.push(r.child(o))}else e.push(r)}),new Gt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e,n,s,r,i,o,l){this.key=e,this.documentType=n,this.version=s,this.readTime=r,this.createTime=i,this.data=o,this.documentState=l}static newInvalidDocument(e){return new gt(e,0,Z.min(),Z.min(),Z.min(),Lt.empty(),0)}static newFoundDocument(e,n,s,r){return new gt(e,1,n,Z.min(),s,r,0)}static newNoDocument(e,n){return new gt(e,2,n,Z.min(),Z.min(),Lt.empty(),0)}static newUnknownDocument(e,n){return new gt(e,3,n,Z.min(),Z.min(),Lt.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(Z.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Lt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Lt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Z.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof gt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new gt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class wa{constructor(e,n){this.position=e,this.inclusive=n}}function jh(t,e,n){let s=0;for(let r=0;r<t.position.length;r++){const i=e[r],o=t.position[r];if(i.field.isKeyField()?s=G.comparator(G.fromName(o.referenceValue),n.key):s=Or(o,n.data.field(i.field)),i.dir==="desc"&&(s*=-1),s!==0)break}return s}function Kh(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!Sn(t.position[n],e.position[n]))return!1;return!0}/**
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
 */class $i{constructor(e,n="asc"){this.field=e,this.dir=n}}function N_(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
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
 */class sm{}class Ye extends sm{constructor(e,n,s){super(),this.field=e,this.op=n,this.value=s}static create(e,n,s){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,s):new F_(e,n,s):n==="array-contains"?new U_(e,s):n==="in"?new $_(e,s):n==="not-in"?new q_(e,s):n==="array-contains-any"?new H_(e,s):new Ye(e,n,s)}static createKeyFieldInFilter(e,n,s){return n==="in"?new V_(e,s):new z_(e,s)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Or(n,this.value)):n!==null&&ir(this.value)===ir(n)&&this.matchesComparison(Or(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Q()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class fn extends sm{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new fn(e,n)}matches(e){return rm(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function rm(t){return t.op==="and"}function im(t){return O_(t)&&rm(t)}function O_(t){for(const e of t.filters)if(e instanceof fn)return!1;return!0}function ac(t){if(t instanceof Ye)return t.field.canonicalString()+t.op.toString()+Fr(t.value);if(im(t))return t.filters.map(e=>ac(e)).join(",");{const e=t.filters.map(n=>ac(n)).join(",");return`${t.op}(${e})`}}function om(t,e){return t instanceof Ye?function(s,r){return r instanceof Ye&&s.op===r.op&&s.field.isEqual(r.field)&&Sn(s.value,r.value)}(t,e):t instanceof fn?function(s,r){return r instanceof fn&&s.op===r.op&&s.filters.length===r.filters.length?s.filters.reduce((i,o,l)=>i&&om(o,r.filters[l]),!0):!1}(t,e):void Q()}function am(t){return t instanceof Ye?function(n){return`${n.field.canonicalString()} ${n.op} ${Fr(n.value)}`}(t):t instanceof fn?function(n){return n.op.toString()+" {"+n.getFilters().map(am).join(" ,")+"}"}(t):"Filter"}class F_ extends Ye{constructor(e,n,s){super(e,n,s),this.key=G.fromName(s.referenceValue)}matches(e){const n=G.comparator(e.key,this.key);return this.matchesComparison(n)}}class V_ extends Ye{constructor(e,n){super(e,"in",n),this.keys=lm("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class z_ extends Ye{constructor(e,n){super(e,"not-in",n),this.keys=lm("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function lm(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(s=>G.fromName(s.referenceValue))}class U_ extends Ye{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return rd(n)&&Ui(n.arrayValue,this.value)}}class $_ extends Ye{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&Ui(this.value.arrayValue,n)}}class q_ extends Ye{constructor(e,n){super(e,"not-in",n)}matches(e){if(Ui(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!Ui(this.value.arrayValue,n)}}class H_ extends Ye{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!rd(n)||!n.arrayValue.values)&&n.arrayValue.values.some(s=>Ui(this.value.arrayValue,s))}}/**
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
 */class W_{constructor(e,n=null,s=[],r=[],i=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=s,this.filters=r,this.limit=i,this.startAt=o,this.endAt=l,this.ue=null}}function Qh(t,e=null,n=[],s=[],r=null,i=null,o=null){return new W_(t,e,n,s,r,i,o)}function id(t){const e=ee(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(s=>ac(s)).join(","),n+="|ob:",n+=e.orderBy.map(s=>function(i){return i.field.canonicalString()+i.dir}(s)).join(","),za(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(s=>Fr(s)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(s=>Fr(s)).join(",")),e.ue=n}return e.ue}function od(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!N_(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!om(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!Kh(t.startAt,e.startAt)&&Kh(t.endAt,e.endAt)}function lc(t){return G.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr{constructor(e,n=null,s=[],r=[],i=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=s,this.filters=r,this.limit=i,this.limitType=o,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Y_(t,e,n,s,r,i,o,l){return new Kr(t,e,n,s,r,i,o,l)}function ad(t){return new Kr(t)}function Jh(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function cm(t){return t.collectionGroup!==null}function Ci(t){const e=ee(t);if(e.ce===null){e.ce=[];const n=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),n.add(i.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new it(rt.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(e).forEach(i=>{n.has(i.canonicalString())||i.isKeyField()||e.ce.push(new $i(i,s))}),n.has(rt.keyField().canonicalString())||e.ce.push(new $i(rt.keyField(),s))}return e.ce}function Tn(t){const e=ee(t);return e.le||(e.le=G_(e,Ci(t))),e.le}function G_(t,e){if(t.limitType==="F")return Qh(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(r=>{const i=r.dir==="desc"?"asc":"desc";return new $i(r.field,i)});const n=t.endAt?new wa(t.endAt.position,t.endAt.inclusive):null,s=t.startAt?new wa(t.startAt.position,t.startAt.inclusive):null;return Qh(t.path,t.collectionGroup,e,t.filters,t.limit,n,s)}}function cc(t,e){const n=t.filters.concat([e]);return new Kr(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function _a(t,e,n){return new Kr(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function Ua(t,e){return od(Tn(t),Tn(e))&&t.limitType===e.limitType}function dm(t){return`${id(Tn(t))}|lt:${t.limitType}`}function _r(t){return`Query(target=${function(n){let s=n.path.canonicalString();return n.collectionGroup!==null&&(s+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(s+=`, filters: [${n.filters.map(r=>am(r)).join(", ")}]`),za(n.limit)||(s+=", limit: "+n.limit),n.orderBy.length>0&&(s+=`, orderBy: [${n.orderBy.map(r=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(r)).join(", ")}]`),n.startAt&&(s+=", startAt: ",s+=n.startAt.inclusive?"b:":"a:",s+=n.startAt.position.map(r=>Fr(r)).join(",")),n.endAt&&(s+=", endAt: ",s+=n.endAt.inclusive?"a:":"b:",s+=n.endAt.position.map(r=>Fr(r)).join(",")),`Target(${s})`}(Tn(t))}; limitType=${t.limitType})`}function $a(t,e){return e.isFoundDocument()&&function(s,r){const i=r.key.path;return s.collectionGroup!==null?r.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(i):G.isDocumentKey(s.path)?s.path.isEqual(i):s.path.isImmediateParentOf(i)}(t,e)&&function(s,r){for(const i of Ci(s))if(!i.field.isKeyField()&&r.data.field(i.field)===null)return!1;return!0}(t,e)&&function(s,r){for(const i of s.filters)if(!i.matches(r))return!1;return!0}(t,e)&&function(s,r){return!(s.startAt&&!function(o,l,c){const d=jh(o,l,c);return o.inclusive?d<=0:d<0}(s.startAt,Ci(s),r)||s.endAt&&!function(o,l,c){const d=jh(o,l,c);return o.inclusive?d>=0:d>0}(s.endAt,Ci(s),r))}(t,e)}function j_(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function um(t){return(e,n)=>{let s=!1;for(const r of Ci(t)){const i=K_(r,e,n);if(i!==0)return i;s=s||r.field.isKeyField()}return 0}}function K_(t,e,n){const s=t.field.isKeyField()?G.comparator(e.key,n.key):function(i,o,l){const c=o.data.field(i),d=l.data.field(i);return c!==null&&d!==null?Or(c,d):Q()}(t.field,e,n);switch(t.dir){case"asc":return s;case"desc":return-1*s;default:return Q()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qr{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s!==void 0){for(const[r,i]of s)if(this.equalsFn(r,e))return i}}has(e){return this.get(e)!==void 0}set(e,n){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,n]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,n]);r.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[n]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){ur(this.inner,(n,s)=>{for(const[r,i]of s)e(r,i)})}isEmpty(){return em(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q_=new Me(G.comparator);function ts(){return Q_}const hm=new Me(G.comparator);function _i(...t){let e=hm;for(const n of t)e=e.insert(n.key,n);return e}function fm(t){let e=hm;return t.forEach((n,s)=>e=e.insert(n,s.overlayedDocument)),e}function Gs(){return Ri()}function pm(){return Ri()}function Ri(){return new Qr(t=>t.toString(),(t,e)=>t.isEqual(e))}const J_=new Me(G.comparator),X_=new it(G.comparator);function le(...t){let e=X_;for(const n of t)e=e.add(n);return e}const Z_=new it(pe);function eE(){return Z_}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ld(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ba(e)?"-0":e}}function mm(t){return{integerValue:""+t}}function tE(t,e){return P_(e)?mm(e):ld(t,e)}/**
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
 */class qa{constructor(){this._=void 0}}function nE(t,e,n){return t instanceof qi?function(r,i){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return i&&nd(i)&&(i=sd(i)),i&&(o.fields.__previous_value__=i),{mapValue:o}}(n,e):t instanceof Hi?ym(t,e):t instanceof Wi?vm(t,e):function(r,i){const o=gm(r,i),l=Xh(o)+Xh(r.Pe);return oc(o)&&oc(r.Pe)?mm(l):ld(r.serializer,l)}(t,e)}function sE(t,e,n){return t instanceof Hi?ym(t,e):t instanceof Wi?vm(t,e):n}function gm(t,e){return t instanceof Ea?function(s){return oc(s)||function(i){return!!i&&"doubleValue"in i}(s)}(e)?e:{integerValue:0}:null}class qi extends qa{}class Hi extends qa{constructor(e){super(),this.elements=e}}function ym(t,e){const n=bm(e);for(const s of t.elements)n.some(r=>Sn(r,s))||n.push(s);return{arrayValue:{values:n}}}class Wi extends qa{constructor(e){super(),this.elements=e}}function vm(t,e){let n=bm(e);for(const s of t.elements)n=n.filter(r=>!Sn(r,s));return{arrayValue:{values:n}}}class Ea extends qa{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function Xh(t){return Ve(t.integerValue||t.doubleValue)}function bm(t){return rd(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rE{constructor(e,n){this.field=e,this.transform=n}}function iE(t,e){return t.field.isEqual(e.field)&&function(s,r){return s instanceof Hi&&r instanceof Hi||s instanceof Wi&&r instanceof Wi?Nr(s.elements,r.elements,Sn):s instanceof Ea&&r instanceof Ea?Sn(s.Pe,r.Pe):s instanceof qi&&r instanceof qi}(t.transform,e.transform)}class oE{constructor(e,n){this.version=e,this.transformResults=n}}class xt{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new xt}static exists(e){return new xt(void 0,e)}static updateTime(e){return new xt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ea(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class Ha{}function wm(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new Wa(t.key,xt.none()):new ho(t.key,t.data,xt.none());{const n=t.data,s=Lt.empty();let r=new it(rt.comparator);for(let i of e.fields)if(!r.has(i)){let o=n.field(i);o===null&&i.length>1&&(i=i.popLast(),o=n.field(i)),o===null?s.delete(i):s.set(i,o),r=r.add(i)}return new Ds(t.key,s,new Gt(r.toArray()),xt.none())}}function aE(t,e,n){t instanceof ho?function(r,i,o){const l=r.value.clone(),c=ef(r.fieldTransforms,i,o.transformResults);l.setAll(c),i.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof Ds?function(r,i,o){if(!ea(r.precondition,i))return void i.convertToUnknownDocument(o.version);const l=ef(r.fieldTransforms,i,o.transformResults),c=i.data;c.setAll(_m(r)),c.setAll(l),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(t,e,n):function(r,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function Pi(t,e,n,s){return t instanceof ho?function(i,o,l,c){if(!ea(i.precondition,o))return l;const d=i.value.clone(),h=tf(i.fieldTransforms,c,o);return d.setAll(h),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),null}(t,e,n,s):t instanceof Ds?function(i,o,l,c){if(!ea(i.precondition,o))return l;const d=tf(i.fieldTransforms,c,o),h=o.data;return h.setAll(_m(i)),h.setAll(d),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(t,e,n,s):function(i,o,l){return ea(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function lE(t,e){let n=null;for(const s of t.fieldTransforms){const r=e.data.field(s.field),i=gm(s.transform,r||null);i!=null&&(n===null&&(n=Lt.empty()),n.set(s.field,i))}return n||null}function Zh(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(s,r){return s===void 0&&r===void 0||!(!s||!r)&&Nr(s,r,(i,o)=>iE(i,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class ho extends Ha{constructor(e,n,s,r=[]){super(),this.key=e,this.value=n,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class Ds extends Ha{constructor(e,n,s,r,i=[]){super(),this.key=e,this.data=n,this.fieldMask=s,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function _m(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const s=t.data.field(n);e.set(n,s)}}),e}function ef(t,e,n){const s=new Map;ve(t.length===n.length);for(let r=0;r<n.length;r++){const i=t[r],o=i.transform,l=e.data.field(i.field);s.set(i.field,sE(o,l,n[r]))}return s}function tf(t,e,n){const s=new Map;for(const r of t){const i=r.transform,o=n.data.field(r.field);s.set(r.field,nE(i,o,e))}return s}class Wa extends Ha{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class cE extends Ha{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dE{constructor(e,n,s,r){this.batchId=e,this.localWriteTime=n,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,n){const s=n.mutationResults;for(let r=0;r<this.mutations.length;r++){const i=this.mutations[r];i.key.isEqual(e.key)&&aE(i,e,s[r])}}applyToLocalView(e,n){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(n=Pi(s,e,n,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(n=Pi(s,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const s=pm();return this.mutations.forEach(r=>{const i=e.get(r.key),o=i.overlayedDocument;let l=this.applyToLocalView(o,i.mutatedFields);l=n.has(r.key)?null:l;const c=wm(o,l);c!==null&&s.set(r.key,c),o.isValidDocument()||o.convertToNoDocument(Z.min())}),s}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),le())}isEqual(e){return this.batchId===e.batchId&&Nr(this.mutations,e.mutations,(n,s)=>Zh(n,s))&&Nr(this.baseMutations,e.baseMutations,(n,s)=>Zh(n,s))}}class cd{constructor(e,n,s,r){this.batch=e,this.commitVersion=n,this.mutationResults=s,this.docVersions=r}static from(e,n,s){ve(e.mutations.length===s.length);let r=function(){return J_}();const i=e.mutations;for(let o=0;o<i.length;o++)r=r.insert(i[o].key,s[o].version);return new cd(e,n,s,r)}}/**
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
 */class uE{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class hE{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var We,de;function fE(t){switch(t){default:return Q();case M.CANCELLED:case M.UNKNOWN:case M.DEADLINE_EXCEEDED:case M.RESOURCE_EXHAUSTED:case M.INTERNAL:case M.UNAVAILABLE:case M.UNAUTHENTICATED:return!1;case M.INVALID_ARGUMENT:case M.NOT_FOUND:case M.ALREADY_EXISTS:case M.PERMISSION_DENIED:case M.FAILED_PRECONDITION:case M.ABORTED:case M.OUT_OF_RANGE:case M.UNIMPLEMENTED:case M.DATA_LOSS:return!0}}function Em(t){if(t===void 0)return es("GRPC error has no .code"),M.UNKNOWN;switch(t){case We.OK:return M.OK;case We.CANCELLED:return M.CANCELLED;case We.UNKNOWN:return M.UNKNOWN;case We.DEADLINE_EXCEEDED:return M.DEADLINE_EXCEEDED;case We.RESOURCE_EXHAUSTED:return M.RESOURCE_EXHAUSTED;case We.INTERNAL:return M.INTERNAL;case We.UNAVAILABLE:return M.UNAVAILABLE;case We.UNAUTHENTICATED:return M.UNAUTHENTICATED;case We.INVALID_ARGUMENT:return M.INVALID_ARGUMENT;case We.NOT_FOUND:return M.NOT_FOUND;case We.ALREADY_EXISTS:return M.ALREADY_EXISTS;case We.PERMISSION_DENIED:return M.PERMISSION_DENIED;case We.FAILED_PRECONDITION:return M.FAILED_PRECONDITION;case We.ABORTED:return M.ABORTED;case We.OUT_OF_RANGE:return M.OUT_OF_RANGE;case We.UNIMPLEMENTED:return M.UNIMPLEMENTED;case We.DATA_LOSS:return M.DATA_LOSS;default:return Q()}}(de=We||(We={}))[de.OK=0]="OK",de[de.CANCELLED=1]="CANCELLED",de[de.UNKNOWN=2]="UNKNOWN",de[de.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",de[de.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",de[de.NOT_FOUND=5]="NOT_FOUND",de[de.ALREADY_EXISTS=6]="ALREADY_EXISTS",de[de.PERMISSION_DENIED=7]="PERMISSION_DENIED",de[de.UNAUTHENTICATED=16]="UNAUTHENTICATED",de[de.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",de[de.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",de[de.ABORTED=10]="ABORTED",de[de.OUT_OF_RANGE=11]="OUT_OF_RANGE",de[de.UNIMPLEMENTED=12]="UNIMPLEMENTED",de[de.INTERNAL=13]="INTERNAL",de[de.UNAVAILABLE=14]="UNAVAILABLE",de[de.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function pE(){return new TextEncoder}/**
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
 */const mE=new Qs([4294967295,4294967295],0);function nf(t){const e=pE().encode(t),n=new Yp;return n.update(e),new Uint8Array(n.digest())}function sf(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),s=e.getUint32(4,!0),r=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Qs([n,s],0),new Qs([r,i],0)]}class dd{constructor(e,n,s){if(this.bitmap=e,this.padding=n,this.hashCount=s,n<0||n>=8)throw new Ei(`Invalid padding: ${n}`);if(s<0)throw new Ei(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Ei(`Invalid hash count: ${s}`);if(e.length===0&&n!==0)throw new Ei(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=Qs.fromNumber(this.Ie)}Ee(e,n,s){let r=e.add(n.multiply(Qs.fromNumber(s)));return r.compare(mE)===1&&(r=new Qs([r.getBits(0),r.getBits(1)],0)),r.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=nf(e),[s,r]=sf(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(s,r,i);if(!this.de(o))return!1}return!0}static create(e,n,s){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new dd(i,r,n);return s.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const n=nf(e),[s,r]=sf(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(s,r,i);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),s=e%8;this.bitmap[n]|=1<<s}}class Ei extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ya{constructor(e,n,s,r,i){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,n,s){const r=new Map;return r.set(e,fo.createSynthesizedTargetChangeForCurrentChange(e,n,s)),new Ya(Z.min(),r,new Me(pe),ts(),le())}}class fo{constructor(e,n,s,r,i){this.resumeToken=e,this.current=n,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,n,s){return new fo(s,n,le(),le(),le())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ta{constructor(e,n,s,r){this.Re=e,this.removedTargetIds=n,this.key=s,this.Ve=r}}class Tm{constructor(e,n){this.targetId=e,this.me=n}}class Im{constructor(e,n,s=at.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=n,this.resumeToken=s,this.cause=r}}class rf{constructor(){this.fe=0,this.ge=af(),this.pe=at.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=le(),n=le(),s=le();return this.ge.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:n=n.add(r);break;case 1:s=s.add(r);break;default:Q()}}),new fo(this.pe,this.ye,e,n,s)}Ce(){this.we=!1,this.ge=af()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,ve(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class gE{constructor(e){this.Le=e,this.Be=new Map,this.ke=ts(),this.qe=of(),this.Qe=new Me(pe)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const s=this.Ge(n);switch(e.state){case 0:this.ze(n)&&s.De(e.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(e.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(s.Ne(),s.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),s.De(e.resumeToken));break;default:Q()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((s,r)=>{this.ze(r)&&n(r)})}He(e){const n=e.targetId,s=e.me.count,r=this.Je(n);if(r){const i=r.target;if(lc(i))if(s===0){const o=new G(i.path);this.Ue(n,o,gt.newNoDocument(o,Z.min()))}else ve(s===1);else{const o=this.Ye(n);if(o!==s){const l=this.Ze(e),c=l?this.Xe(l,e,o):1;if(c!==0){this.je(n);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,d)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:s="",padding:r=0},hashCount:i=0}=n;let o,l;try{o=rr(s).toUint8Array()}catch(c){if(c instanceof tm)return Lr("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new dd(o,r,i)}catch(c){return Lr(c instanceof Ei?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,n,s){return n.me.count===s-this.nt(e,n.targetId)?0:2}nt(e,n){const s=this.Le.getRemoteKeysForTarget(n);let r=0;return s.forEach(i=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(l)||(this.Ue(n,i,null),r++)}),r}rt(e){const n=new Map;this.Be.forEach((i,o)=>{const l=this.Je(o);if(l){if(i.current&&lc(l.target)){const c=new G(l.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,gt.newNoDocument(c,e))}i.be&&(n.set(o,i.ve()),i.Ce())}});let s=le();this.qe.forEach((i,o)=>{let l=!0;o.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(s=s.add(i))}),this.ke.forEach((i,o)=>o.setReadTime(e));const r=new Ya(e,n,this.Qe,this.ke,s);return this.ke=ts(),this.qe=of(),this.Qe=new Me(pe),r}$e(e,n){if(!this.ze(e))return;const s=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,s),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,s){if(!this.ze(e))return;const r=this.Ge(e);this.it(e,n)?r.Fe(n,1):r.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),s&&(this.ke=this.ke.insert(n,s))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new rf,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new it(pe),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||H("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new rf),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function of(){return new Me(G.comparator)}function af(){return new Me(G.comparator)}const yE={asc:"ASCENDING",desc:"DESCENDING"},vE={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},bE={and:"AND",or:"OR"};class wE{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function dc(t,e){return t.useProto3Json||za(e)?e:{value:e}}function Ta(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Sm(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function _E(t,e){return Ta(t,e.toTimestamp())}function In(t){return ve(!!t),Z.fromTimestamp(function(n){const s=Rs(n);return new Ke(s.seconds,s.nanos)}(t))}function ud(t,e){return uc(t,e).canonicalString()}function uc(t,e){const n=function(r){return new ke(["projects",r.projectId,"databases",r.database])}(t).child("documents");return e===void 0?n:n.child(e)}function xm(t){const e=ke.fromString(t);return ve(Pm(e)),e}function hc(t,e){return ud(t.databaseId,e.path)}function Ul(t,e){const n=xm(e);if(n.get(1)!==t.databaseId.projectId)throw new U(M.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new U(M.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new G(km(n))}function Am(t,e){return ud(t.databaseId,e)}function EE(t){const e=xm(t);return e.length===4?ke.emptyPath():km(e)}function fc(t){return new ke(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function km(t){return ve(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function lf(t,e,n){return{name:hc(t,e),fields:n.value.mapValue.fields}}function TE(t,e){let n;if("targetChange"in e){e.targetChange;const s=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:Q()}(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],i=function(d,h){return d.useProto3Json?(ve(h===void 0||typeof h=="string"),at.fromBase64String(h||"")):(ve(h===void 0||h instanceof Buffer||h instanceof Uint8Array),at.fromUint8Array(h||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(d){const h=d.code===void 0?M.UNKNOWN:Em(d.code);return new U(h,d.message||"")}(o);n=new Im(s,r,i,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=Ul(t,s.document.name),i=In(s.document.updateTime),o=s.document.createTime?In(s.document.createTime):Z.min(),l=new Lt({mapValue:{fields:s.document.fields}}),c=gt.newFoundDocument(r,i,o,l),d=s.targetIds||[],h=s.removedTargetIds||[];n=new ta(d,h,c.key,c)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=Ul(t,s.document),i=s.readTime?In(s.readTime):Z.min(),o=gt.newNoDocument(r,i),l=s.removedTargetIds||[];n=new ta([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=Ul(t,s.document),i=s.removedTargetIds||[];n=new ta([],i,r,null)}else{if(!("filter"in e))return Q();{e.filter;const s=e.filter;s.targetId;const{count:r=0,unchangedNames:i}=s,o=new hE(r,i),l=s.targetId;n=new Tm(l,o)}}return n}function IE(t,e){let n;if(e instanceof ho)n={update:lf(t,e.key,e.value)};else if(e instanceof Wa)n={delete:hc(t,e.key)};else if(e instanceof Ds)n={update:lf(t,e.key,e.data),updateMask:DE(e.fieldMask)};else{if(!(e instanceof cE))return Q();n={verify:hc(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(s=>function(i,o){const l=o.transform;if(l instanceof qi)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Hi)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Wi)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Ea)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw Q()}(0,s))),e.precondition.isNone||(n.currentDocument=function(r,i){return i.updateTime!==void 0?{updateTime:_E(r,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Q()}(t,e.precondition)),n}function SE(t,e){return t&&t.length>0?(ve(e!==void 0),t.map(n=>function(r,i){let o=r.updateTime?In(r.updateTime):In(i);return o.isEqual(Z.min())&&(o=In(i)),new oE(o,r.transformResults||[])}(n,e))):[]}function xE(t,e){return{documents:[Am(t,e.path)]}}function AE(t,e){const n={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),n.structuredQuery.from=[{collectionId:s.lastSegment()}]),n.parent=Am(t,r);const i=function(d){if(d.length!==0)return Rm(fn.create(d,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(d){if(d.length!==0)return d.map(h=>function(p){return{field:Er(p.field),direction:RE(p.dir)}}(h))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=dc(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:n,parent:r}}function kE(t){let e=EE(t.parent);const n=t.structuredQuery,s=n.from?n.from.length:0;let r=null;if(s>0){ve(s===1);const h=n.from[0];h.allDescendants?r=h.collectionId:e=e.child(h.collectionId)}let i=[];n.where&&(i=function(m){const p=Cm(m);return p instanceof fn&&im(p)?p.getFilters():[p]}(n.where));let o=[];n.orderBy&&(o=function(m){return m.map(p=>function(T){return new $i(Tr(T.field),function(A){switch(A){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(T.direction))}(p))}(n.orderBy));let l=null;n.limit&&(l=function(m){let p;return p=typeof m=="object"?m.value:m,za(p)?null:p}(n.limit));let c=null;n.startAt&&(c=function(m){const p=!!m.before,w=m.values||[];return new wa(w,p)}(n.startAt));let d=null;return n.endAt&&(d=function(m){const p=!m.before,w=m.values||[];return new wa(w,p)}(n.endAt)),Y_(e,r,o,i,l,"F",c,d)}function CE(t,e){const n=function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Q()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function Cm(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const s=Tr(n.unaryFilter.field);return Ye.create(s,"==",{doubleValue:NaN});case"IS_NULL":const r=Tr(n.unaryFilter.field);return Ye.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Tr(n.unaryFilter.field);return Ye.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Tr(n.unaryFilter.field);return Ye.create(o,"!=",{nullValue:"NULL_VALUE"});default:return Q()}}(t):t.fieldFilter!==void 0?function(n){return Ye.create(Tr(n.fieldFilter.field),function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Q()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return fn.create(n.compositeFilter.filters.map(s=>Cm(s)),function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return Q()}}(n.compositeFilter.op))}(t):Q()}function RE(t){return yE[t]}function PE(t){return vE[t]}function ME(t){return bE[t]}function Er(t){return{fieldPath:t.canonicalString()}}function Tr(t){return rt.fromServerFormat(t.fieldPath)}function Rm(t){return t instanceof Ye?function(n){if(n.op==="=="){if(Gh(n.value))return{unaryFilter:{field:Er(n.field),op:"IS_NAN"}};if(Yh(n.value))return{unaryFilter:{field:Er(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Gh(n.value))return{unaryFilter:{field:Er(n.field),op:"IS_NOT_NAN"}};if(Yh(n.value))return{unaryFilter:{field:Er(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Er(n.field),op:PE(n.op),value:n.value}}}(t):t instanceof fn?function(n){const s=n.getFilters().map(r=>Rm(r));return s.length===1?s[0]:{compositeFilter:{op:ME(n.op),filters:s}}}(t):Q()}function DE(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function Pm(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s{constructor(e,n,s,r,i=Z.min(),o=Z.min(),l=at.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=n,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new _s(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new _s(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new _s(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new _s(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BE{constructor(e){this.ct=e}}function LE(t){const e=kE({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?_a(e,e.limit,"L"):e}/**
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
 */class NE{constructor(){this.un=new OE}addToCollectionParentIndex(e,n){return this.un.add(n),N.resolve()}getCollectionParents(e,n){return N.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return N.resolve()}deleteFieldIndex(e,n){return N.resolve()}deleteAllFieldIndexes(e){return N.resolve()}createTargetIndexes(e,n){return N.resolve()}getDocumentsMatchingTarget(e,n){return N.resolve(null)}getIndexType(e,n){return N.resolve(0)}getFieldIndexes(e,n){return N.resolve([])}getNextCollectionGroupToUpdate(e){return N.resolve(null)}getMinOffset(e,n){return N.resolve(Cs.min())}getMinOffsetFromCollectionGroup(e,n){return N.resolve(Cs.min())}updateCollectionGroup(e,n,s){return N.resolve()}updateIndexEntries(e,n){return N.resolve()}}class OE{constructor(){this.index={}}add(e){const n=e.lastSegment(),s=e.popLast(),r=this.index[n]||new it(ke.comparator),i=!r.has(s);return this.index[n]=r.add(s),i}has(e){const n=e.lastSegment(),s=e.popLast(),r=this.index[n];return r&&r.has(s)}getEntries(e){return(this.index[e]||new it(ke.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vr{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Vr(0)}static kn(){return new Vr(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FE{constructor(){this.changes=new Qr(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,gt.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const s=this.changes.get(n);return s!==void 0?N.resolve(s):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class VE{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zE{constructor(e,n,s,r){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=s,this.indexManager=r}getDocument(e,n){let s=null;return this.documentOverlayCache.getOverlay(e,n).next(r=>(s=r,this.remoteDocumentCache.getEntry(e,n))).next(r=>(s!==null&&Pi(s.mutation,r,Gt.empty(),Ke.now()),r))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.getLocalViewOfDocuments(e,s,le()).next(()=>s))}getLocalViewOfDocuments(e,n,s=le()){const r=Gs();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,s).next(i=>{let o=_i();return i.forEach((l,c)=>{o=o.insert(l,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const s=Gs();return this.populateOverlays(e,s,n).next(()=>this.computeViews(e,n,s,le()))}populateOverlays(e,n,s){const r=[];return s.forEach(i=>{n.has(i)||r.push(i)}),this.documentOverlayCache.getOverlays(e,r).next(i=>{i.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,s,r){let i=ts();const o=Ri(),l=function(){return Ri()}();return n.forEach((c,d)=>{const h=s.get(d.key);r.has(d.key)&&(h===void 0||h.mutation instanceof Ds)?i=i.insert(d.key,d):h!==void 0?(o.set(d.key,h.mutation.getFieldMask()),Pi(h.mutation,d,h.mutation.getFieldMask(),Ke.now())):o.set(d.key,Gt.empty())}),this.recalculateAndSaveOverlays(e,i).next(c=>(c.forEach((d,h)=>o.set(d,h)),n.forEach((d,h)=>{var m;return l.set(d,new VE(h,(m=o.get(d))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,n){const s=Ri();let r=new Me((o,l)=>o-l),i=le();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(c=>{const d=n.get(c);if(d===null)return;let h=s.get(c)||Gt.empty();h=l.applyToLocalView(d,h),s.set(c,h);const m=(r.get(l.batchId)||le()).add(c);r=r.insert(l.batchId,m)})}).next(()=>{const o=[],l=r.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,h=c.value,m=pm();h.forEach(p=>{if(!i.has(p)){const w=wm(n.get(p),s.get(p));w!==null&&m.set(p,w),i=i.add(p)}}),o.push(this.documentOverlayCache.saveOverlays(e,d,m))}return N.waitFor(o)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,n,s,r){return function(o){return G.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):cm(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,s,r):this.getDocumentsMatchingCollectionQuery(e,n,s,r)}getNextDocuments(e,n,s,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,s,r).next(i=>{const o=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,s.largestBatchId,r-i.size):N.resolve(Gs());let l=-1,c=i;return o.next(d=>N.forEach(d,(h,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(h)?N.resolve():this.remoteDocumentCache.getEntry(e,h).next(p=>{c=c.insert(h,p)}))).next(()=>this.populateOverlays(e,d,i)).next(()=>this.computeViews(e,c,d,le())).next(h=>({batchId:l,changes:fm(h)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new G(n)).next(s=>{let r=_i();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r})}getDocumentsMatchingCollectionGroupQuery(e,n,s,r){const i=n.collectionGroup;let o=_i();return this.indexManager.getCollectionParents(e,i).next(l=>N.forEach(l,c=>{const d=function(m,p){return new Kr(p,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,s,r).next(h=>{h.forEach((m,p)=>{o=o.insert(m,p)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,s,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,s.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,s,i,r))).next(o=>{i.forEach((c,d)=>{const h=d.getKey();o.get(h)===null&&(o=o.insert(h,gt.newInvalidDocument(h)))});let l=_i();return o.forEach((c,d)=>{const h=i.get(c);h!==void 0&&Pi(h.mutation,d,Gt.empty(),Ke.now()),$a(n,d)&&(l=l.insert(c,d))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UE{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return N.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(r){return{id:r.id,version:r.version,createTime:In(r.createTime)}}(n)),N.resolve()}getNamedQuery(e,n){return N.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(r){return{name:r.name,query:LE(r.bundledQuery),readTime:In(r.readTime)}}(n)),N.resolve()}}/**
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
 */class $E{constructor(){this.overlays=new Me(G.comparator),this.Ir=new Map}getOverlay(e,n){return N.resolve(this.overlays.get(n))}getOverlays(e,n){const s=Gs();return N.forEach(n,r=>this.getOverlay(e,r).next(i=>{i!==null&&s.set(r,i)})).next(()=>s)}saveOverlays(e,n,s){return s.forEach((r,i)=>{this.ht(e,n,i)}),N.resolve()}removeOverlaysForBatchId(e,n,s){const r=this.Ir.get(s);return r!==void 0&&(r.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(s)),N.resolve()}getOverlaysForCollection(e,n,s){const r=Gs(),i=n.length+1,o=new G(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!n.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>s&&r.set(c.getKey(),c)}return N.resolve(r)}getOverlaysForCollectionGroup(e,n,s,r){let i=new Me((d,h)=>d-h);const o=this.overlays.getIterator();for(;o.hasNext();){const d=o.getNext().value;if(d.getKey().getCollectionGroup()===n&&d.largestBatchId>s){let h=i.get(d.largestBatchId);h===null&&(h=Gs(),i=i.insert(d.largestBatchId,h)),h.set(d.getKey(),d)}}const l=Gs(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,h)=>l.set(d,h)),!(l.size()>=r)););return N.resolve(l)}ht(e,n,s){const r=this.overlays.get(s.key);if(r!==null){const o=this.Ir.get(r.largestBatchId).delete(s.key);this.Ir.set(r.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new uE(n,s));let i=this.Ir.get(n);i===void 0&&(i=le(),this.Ir.set(n,i)),this.Ir.set(n,i.add(s.key))}}/**
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
 */class qE{constructor(){this.sessionToken=at.EMPTY_BYTE_STRING}getSessionToken(e){return N.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,N.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hd{constructor(){this.Tr=new it(Je.Er),this.dr=new it(Je.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const s=new Je(e,n);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(e,n){e.forEach(s=>this.addReference(s,n))}removeReference(e,n){this.Vr(new Je(e,n))}mr(e,n){e.forEach(s=>this.removeReference(s,n))}gr(e){const n=new G(new ke([])),s=new Je(n,e),r=new Je(n,e+1),i=[];return this.dr.forEachInRange([s,r],o=>{this.Vr(o),i.push(o.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new G(new ke([])),s=new Je(n,e),r=new Je(n,e+1);let i=le();return this.dr.forEachInRange([s,r],o=>{i=i.add(o.key)}),i}containsKey(e){const n=new Je(e,0),s=this.Tr.firstAfterOrEqual(n);return s!==null&&e.isEqual(s.key)}}class Je{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return G.comparator(e.key,n.key)||pe(e.wr,n.wr)}static Ar(e,n){return pe(e.wr,n.wr)||G.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HE{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new it(Je.Er)}checkEmpty(e){return N.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,s,r){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new dE(i,n,s,r);this.mutationQueue.push(o);for(const l of r)this.br=this.br.add(new Je(l.key,i)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return N.resolve(o)}lookupMutationBatch(e,n){return N.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const s=n+1,r=this.vr(s),i=r<0?0:r;return N.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return N.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return N.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const s=new Je(n,0),r=new Je(n,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([s,r],o=>{const l=this.Dr(o.wr);i.push(l)}),N.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,n){let s=new it(pe);return n.forEach(r=>{const i=new Je(r,0),o=new Je(r,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,o],l=>{s=s.add(l.wr)})}),N.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(e,n){const s=n.path,r=s.length+1;let i=s;G.isDocumentKey(i)||(i=i.child(""));const o=new Je(new G(i),0);let l=new it(pe);return this.br.forEachWhile(c=>{const d=c.key.path;return!!s.isPrefixOf(d)&&(d.length===r&&(l=l.add(c.wr)),!0)},o),N.resolve(this.Cr(l))}Cr(e){const n=[];return e.forEach(s=>{const r=this.Dr(s);r!==null&&n.push(r)}),n}removeMutationBatch(e,n){ve(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return N.forEach(n.mutations,r=>{const i=new Je(r.key,n.batchId);return s=s.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.br=s})}On(e){}containsKey(e,n){const s=new Je(n,0),r=this.br.firstAfterOrEqual(s);return N.resolve(n.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,N.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WE{constructor(e){this.Mr=e,this.docs=function(){return new Me(G.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const s=n.key,r=this.docs.get(s),i=r?r.size:0,o=this.Mr(n);return this.docs=this.docs.insert(s,{document:n.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const s=this.docs.get(n);return N.resolve(s?s.document.mutableCopy():gt.newInvalidDocument(n))}getEntries(e,n){let s=ts();return n.forEach(r=>{const i=this.docs.get(r);s=s.insert(r,i?i.document.mutableCopy():gt.newInvalidDocument(r))}),N.resolve(s)}getDocumentsMatchingQuery(e,n,s,r){let i=ts();const o=n.path,l=new G(o.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:h}}=c.getNext();if(!o.isPrefixOf(d.path))break;d.path.length>o.length+1||A_(x_(h),s)<=0||(r.has(h.key)||$a(n,h))&&(i=i.insert(h.key,h.mutableCopy()))}return N.resolve(i)}getAllFromCollectionGroup(e,n,s,r){Q()}Or(e,n){return N.forEach(this.docs,s=>n(s))}newChangeBuffer(e){return new YE(this)}getSize(e){return N.resolve(this.size)}}class YE extends FE{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((s,r)=>{r.isValidDocument()?n.push(this.cr.addEntry(e,r)):this.cr.removeEntry(s)}),N.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GE{constructor(e){this.persistence=e,this.Nr=new Qr(n=>id(n),od),this.lastRemoteSnapshotVersion=Z.min(),this.highestTargetId=0,this.Lr=0,this.Br=new hd,this.targetCount=0,this.kr=Vr.Bn()}forEachTarget(e,n){return this.Nr.forEach((s,r)=>n(r)),N.resolve()}getLastRemoteSnapshotVersion(e){return N.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return N.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),N.resolve(this.highestTargetId)}setTargetsMetadata(e,n,s){return s&&(this.lastRemoteSnapshotVersion=s),n>this.Lr&&(this.Lr=n),N.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new Vr(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,N.resolve()}updateTargetData(e,n){return this.Kn(n),N.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,N.resolve()}removeTargets(e,n,s){let r=0;const i=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=n&&s.get(l.targetId)===null&&(this.Nr.delete(o),i.push(this.removeMatchingKeysForTargetId(e,l.targetId)),r++)}),N.waitFor(i).next(()=>r)}getTargetCount(e){return N.resolve(this.targetCount)}getTargetData(e,n){const s=this.Nr.get(n)||null;return N.resolve(s)}addMatchingKeys(e,n,s){return this.Br.Rr(n,s),N.resolve()}removeMatchingKeys(e,n,s){this.Br.mr(n,s);const r=this.persistence.referenceDelegate,i=[];return r&&n.forEach(o=>{i.push(r.markPotentiallyOrphaned(e,o))}),N.waitFor(i)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),N.resolve()}getMatchingKeysForTargetId(e,n){const s=this.Br.yr(n);return N.resolve(s)}containsKey(e,n){return N.resolve(this.Br.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jE{constructor(e,n){this.qr={},this.overlays={},this.Qr=new td(0),this.Kr=!1,this.Kr=!0,this.$r=new qE,this.referenceDelegate=e(this),this.Ur=new GE(this),this.indexManager=new NE,this.remoteDocumentCache=function(r){return new WE(r)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new BE(n),this.Gr=new UE(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new $E,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let s=this.qr[e.toKey()];return s||(s=new HE(n,this.referenceDelegate),this.qr[e.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,s){H("MemoryPersistence","Starting transaction:",e);const r=new KE(this.Qr.next());return this.referenceDelegate.zr(),s(r).next(i=>this.referenceDelegate.jr(r).next(()=>i)).toPromise().then(i=>(r.raiseOnCommittedEvent(),i))}Hr(e,n){return N.or(Object.values(this.qr).map(s=>()=>s.containsKey(e,n)))}}class KE extends C_{constructor(e){super(),this.currentSequenceNumber=e}}class fd{constructor(e){this.persistence=e,this.Jr=new hd,this.Yr=null}static Zr(e){return new fd(e)}get Xr(){if(this.Yr)return this.Yr;throw Q()}addReference(e,n,s){return this.Jr.addReference(s,n),this.Xr.delete(s.toString()),N.resolve()}removeReference(e,n,s){return this.Jr.removeReference(s,n),this.Xr.add(s.toString()),N.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),N.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(r=>this.Xr.add(r.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,n.targetId).next(r=>{r.forEach(i=>this.Xr.add(i.toString()))}).next(()=>s.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return N.forEach(this.Xr,s=>{const r=G.fromPath(s);return this.ei(e,r).next(i=>{i||n.removeEntry(r,Z.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(s=>{s?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return N.or([()=>N.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pd{constructor(e,n,s,r){this.targetId=e,this.fromCache=n,this.$i=s,this.Ui=r}static Wi(e,n){let s=le(),r=le();for(const i of n.docChanges)switch(i.type){case 0:s=s.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new pd(e,n.fromCache,s,r)}}/**
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
 */class QE{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class JE{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return P0()?8:R_(vt())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,s,r){const i={result:null};return this.Yi(e,n).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.Zi(e,n,r,s).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new QE;return this.Xi(e,n,o).next(l=>{if(i.result=l,this.zi)return this.es(e,n,o,l.size)})}).next(()=>i.result)}es(e,n,s,r){return s.documentReadCount<this.ji?(gi()<=ce.DEBUG&&H("QueryEngine","SDK will not create cache indexes for query:",_r(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),N.resolve()):(gi()<=ce.DEBUG&&H("QueryEngine","Query:",_r(n),"scans",s.documentReadCount,"local documents and returns",r,"documents as results."),s.documentReadCount>this.Hi*r?(gi()<=ce.DEBUG&&H("QueryEngine","The SDK decides to create cache indexes for query:",_r(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Tn(n))):N.resolve())}Yi(e,n){if(Jh(n))return N.resolve(null);let s=Tn(n);return this.indexManager.getIndexType(e,s).next(r=>r===0?null:(n.limit!==null&&r===1&&(n=_a(n,null,"F"),s=Tn(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next(i=>{const o=le(...i);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,s).next(c=>{const d=this.ts(n,l);return this.ns(n,d,o,c.readTime)?this.Yi(e,_a(n,null,"F")):this.rs(e,d,n,c)}))})))}Zi(e,n,s,r){return Jh(n)||r.isEqual(Z.min())?N.resolve(null):this.Ji.getDocuments(e,s).next(i=>{const o=this.ts(n,i);return this.ns(n,o,s,r)?N.resolve(null):(gi()<=ce.DEBUG&&H("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),_r(n)),this.rs(e,o,n,S_(r,-1)).next(l=>l))})}ts(e,n){let s=new it(um(e));return n.forEach((r,i)=>{$a(e,i)&&(s=s.add(i))}),s}ns(e,n,s,r){if(e.limit===null)return!1;if(s.size!==n.size)return!0;const i=e.limitType==="F"?n.last():n.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}Xi(e,n,s){return gi()<=ce.DEBUG&&H("QueryEngine","Using full collection scan to execute query:",_r(n)),this.Ji.getDocumentsMatchingQuery(e,n,Cs.min(),s)}rs(e,n,s,r){return this.Ji.getDocumentsMatchingQuery(e,s,r).next(i=>(n.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XE{constructor(e,n,s,r){this.persistence=e,this.ss=n,this.serializer=r,this.os=new Me(pe),this._s=new Qr(i=>id(i),od),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(s)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new zE(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function ZE(t,e,n,s){return new XE(t,e,n,s)}async function Mm(t,e){const n=ee(t);return await n.persistence.runTransaction("Handle user change","readonly",s=>{let r;return n.mutationQueue.getAllMutationBatches(s).next(i=>(r=i,n.ls(e),n.mutationQueue.getAllMutationBatches(s))).next(i=>{const o=[],l=[];let c=le();for(const d of r){o.push(d.batchId);for(const h of d.mutations)c=c.add(h.key)}for(const d of i){l.push(d.batchId);for(const h of d.mutations)c=c.add(h.key)}return n.localDocuments.getDocuments(s,c).next(d=>({hs:d,removedBatchIds:o,addedBatchIds:l}))})})}function eT(t,e){const n=ee(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const r=e.batch.keys(),i=n.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,h){const m=d.batch,p=m.keys();let w=N.resolve();return p.forEach(T=>{w=w.next(()=>h.getEntry(c,T)).next(S=>{const A=d.docVersions.get(T);ve(A!==null),S.version.compareTo(A)<0&&(m.applyToRemoteDocument(S,d),S.isValidDocument()&&(S.setReadTime(d.commitVersion),h.addEntry(S)))})}),w.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(n,s,e,i).next(()=>i.apply(s)).next(()=>n.mutationQueue.performConsistencyCheck(s)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(s,r,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(l){let c=le();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(e))).next(()=>n.localDocuments.getDocuments(s,r))})}function Dm(t){const e=ee(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function tT(t,e){const n=ee(t),s=e.snapshotVersion;let r=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=n.cs.newChangeBuffer({trackRemovals:!0});r=n.os;const l=[];e.targetChanges.forEach((h,m)=>{const p=r.get(m);if(!p)return;l.push(n.Ur.removeMatchingKeys(i,h.removedDocuments,m).next(()=>n.Ur.addMatchingKeys(i,h.addedDocuments,m)));let w=p.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?w=w.withResumeToken(at.EMPTY_BYTE_STRING,Z.min()).withLastLimboFreeSnapshotVersion(Z.min()):h.resumeToken.approximateByteSize()>0&&(w=w.withResumeToken(h.resumeToken,s)),r=r.insert(m,w),function(S,A,P){return S.resumeToken.approximateByteSize()===0||A.snapshotVersion.toMicroseconds()-S.snapshotVersion.toMicroseconds()>=3e8?!0:P.addedDocuments.size+P.modifiedDocuments.size+P.removedDocuments.size>0}(p,w,h)&&l.push(n.Ur.updateTargetData(i,w))});let c=ts(),d=le();if(e.documentUpdates.forEach(h=>{e.resolvedLimboDocuments.has(h)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(i,h))}),l.push(nT(i,o,e.documentUpdates).next(h=>{c=h.Ps,d=h.Is})),!s.isEqual(Z.min())){const h=n.Ur.getLastRemoteSnapshotVersion(i).next(m=>n.Ur.setTargetsMetadata(i,i.currentSequenceNumber,s));l.push(h)}return N.waitFor(l).next(()=>o.apply(i)).next(()=>n.localDocuments.getLocalViewOfDocuments(i,c,d)).next(()=>c)}).then(i=>(n.os=r,i))}function nT(t,e,n){let s=le(),r=le();return n.forEach(i=>s=s.add(i)),e.getEntries(t,s).next(i=>{let o=ts();return n.forEach((l,c)=>{const d=i.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(r=r.add(l)),c.isNoDocument()&&c.version.isEqual(Z.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):H("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:o,Is:r}})}function sT(t,e){const n=ee(t);return n.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function rT(t,e){const n=ee(t);return n.persistence.runTransaction("Allocate target","readwrite",s=>{let r;return n.Ur.getTargetData(s,e).next(i=>i?(r=i,N.resolve(r)):n.Ur.allocateTargetId(s).next(o=>(r=new _s(e,o,"TargetPurposeListen",s.currentSequenceNumber),n.Ur.addTargetData(s,r).next(()=>r))))}).then(s=>{const r=n.os.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.os=n.os.insert(s.targetId,s),n._s.set(e,s.targetId)),s})}async function pc(t,e,n){const s=ee(t),r=s.os.get(e),i=n?"readwrite":"readwrite-primary";try{n||await s.persistence.runTransaction("Release target",i,o=>s.persistence.referenceDelegate.removeTarget(o,r))}catch(o){if(!uo(o))throw o;H("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}s.os=s.os.remove(e),s._s.delete(r.target)}function cf(t,e,n){const s=ee(t);let r=Z.min(),i=le();return s.persistence.runTransaction("Execute query","readwrite",o=>function(c,d,h){const m=ee(c),p=m._s.get(h);return p!==void 0?N.resolve(m.os.get(p)):m.Ur.getTargetData(d,h)}(s,o,Tn(e)).next(l=>{if(l)return r=l.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(o,l.targetId).next(c=>{i=c})}).next(()=>s.ss.getDocumentsMatchingQuery(o,e,n?r:Z.min(),n?i:le())).next(l=>(iT(s,j_(e),l),{documents:l,Ts:i})))}function iT(t,e,n){let s=t.us.get(e)||Z.min();n.forEach((r,i)=>{i.readTime.compareTo(s)>0&&(s=i.readTime)}),t.us.set(e,s)}class df{constructor(){this.activeTargetIds=eE()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class oT{constructor(){this.so=new df,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,s){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,s){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new df,Promise.resolve()}handleUserChange(e,n,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class aT{_o(e){}shutdown(){}}/**
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
 */class uf{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){H("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){H("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Yo=null;function $l(){return Yo===null?Yo=function(){return 268435456+Math.round(2147483648*Math.random())}():Yo++,"0x"+Yo.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lT={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cT{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pt="WebChannelConnection";class dT extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const s=n.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+n.host,this.vo=`projects/${r}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${r}`:`project_id=${r}&database_id=${i}`}get Fo(){return!1}Mo(n,s,r,i,o){const l=$l(),c=this.xo(n,s.toUriEncodedString());H("RestConnection",`Sending RPC '${n}' ${l}:`,c,r);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,o),this.No(n,c,d,r).then(h=>(H("RestConnection",`Received RPC '${n}' ${l}: `,h),h),h=>{throw Lr("RestConnection",`RPC '${n}' ${l} failed with error: `,h,"url: ",c,"request:",r),h})}Lo(n,s,r,i,o,l){return this.Mo(n,s,r,i,o)}Oo(n,s,r){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+jr}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((i,o)=>n[o]=i),r&&r.headers.forEach((i,o)=>n[o]=i)}xo(n,s){const r=lT[n];return`${this.Do}/v1/${s}:${r}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,s,r){const i=$l();return new Promise((o,l)=>{const c=new Gp;c.setWithCredentials(!0),c.listenOnce(jp.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Xo.NO_ERROR:const h=c.getResponseJson();H(pt,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(h)),o(h);break;case Xo.TIMEOUT:H(pt,`RPC '${e}' ${i} timed out`),l(new U(M.DEADLINE_EXCEEDED,"Request time out"));break;case Xo.HTTP_ERROR:const m=c.getStatus();if(H(pt,`RPC '${e}' ${i} failed with status:`,m,"response text:",c.getResponseText()),m>0){let p=c.getResponseJson();Array.isArray(p)&&(p=p[0]);const w=p==null?void 0:p.error;if(w&&w.status&&w.message){const T=function(A){const P=A.toLowerCase().replace(/_/g,"-");return Object.values(M).indexOf(P)>=0?P:M.UNKNOWN}(w.status);l(new U(T,w.message))}else l(new U(M.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new U(M.UNAVAILABLE,"Connection failed."));break;default:Q()}}finally{H(pt,`RPC '${e}' ${i} completed.`)}});const d=JSON.stringify(r);H(pt,`RPC '${e}' ${i} sending request:`,r),c.send(n,"POST",d,s,15)})}Bo(e,n,s){const r=$l(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Jp(),l=Qp(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,n,s),c.encodeInitMessageHeaders=!0;const h=i.join("");H(pt,`Creating RPC '${e}' stream ${r}: ${h}`,c);const m=o.createWebChannel(h,c);let p=!1,w=!1;const T=new cT({Io:A=>{w?H(pt,`Not sending because RPC '${e}' stream ${r} is closed:`,A):(p||(H(pt,`Opening RPC '${e}' stream ${r} transport.`),m.open(),p=!0),H(pt,`RPC '${e}' stream ${r} sending:`,A),m.send(A))},To:()=>m.close()}),S=(A,P,C)=>{A.listen(P,L=>{try{C(L)}catch(D){setTimeout(()=>{throw D},0)}})};return S(m,wi.EventType.OPEN,()=>{w||(H(pt,`RPC '${e}' stream ${r} transport opened.`),T.yo())}),S(m,wi.EventType.CLOSE,()=>{w||(w=!0,H(pt,`RPC '${e}' stream ${r} transport closed`),T.So())}),S(m,wi.EventType.ERROR,A=>{w||(w=!0,Lr(pt,`RPC '${e}' stream ${r} transport errored:`,A),T.So(new U(M.UNAVAILABLE,"The operation could not be completed")))}),S(m,wi.EventType.MESSAGE,A=>{var P;if(!w){const C=A.data[0];ve(!!C);const L=C,D=L.error||((P=L[0])===null||P===void 0?void 0:P.error);if(D){H(pt,`RPC '${e}' stream ${r} received error:`,D);const O=D.status;let $=function(_){const b=We[_];if(b!==void 0)return Em(b)}(O),I=D.message;$===void 0&&($=M.INTERNAL,I="Unknown error status: "+O+" with message "+D.message),w=!0,T.So(new U($,I)),m.close()}else H(pt,`RPC '${e}' stream ${r} received:`,C),T.bo(C)}}),S(l,Kp.STAT_EVENT,A=>{A.stat===rc.PROXY?H(pt,`RPC '${e}' stream ${r} detected buffering proxy`):A.stat===rc.NOPROXY&&H(pt,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{T.wo()},0),T}}function ql(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ga(t){return new wE(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bm{constructor(e,n,s=1e3,r=1.5,i=6e4){this.ui=e,this.timerId=n,this.ko=s,this.qo=r,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),r=Math.max(0,n-s);r>0&&H("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,r,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(e,n,s,r,i,o,l,c){this.ui=e,this.Ho=s,this.Jo=r,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Bm(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===M.RESOURCE_EXHAUSTED?(es(n.toString()),es("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===M.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,r])=>{this.Yo===n&&this.P_(s,r)},s=>{e(()=>{const r=new U(M.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(r)})})}P_(e,n){const s=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(r=>{s(()=>this.I_(r))}),this.stream.onMessage(r=>{s(()=>++this.e_==1?this.E_(r):this.onNext(r))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return H("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():(H("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class uT extends Lm{constructor(e,n,s,r,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,s,r,o),this.serializer=i}T_(e,n){return this.connection.Bo("Listen",e,n)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const n=TE(this.serializer,e),s=function(i){if(!("targetChange"in i))return Z.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?Z.min():o.readTime?In(o.readTime):Z.min()}(e);return this.listener.d_(n,s)}A_(e){const n={};n.database=fc(this.serializer),n.addTarget=function(i,o){let l;const c=o.target;if(l=lc(c)?{documents:xE(i,c)}:{query:AE(i,c)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=Sm(i,o.resumeToken);const d=dc(i,o.expectedCount);d!==null&&(l.expectedCount=d)}else if(o.snapshotVersion.compareTo(Z.min())>0){l.readTime=Ta(i,o.snapshotVersion.toTimestamp());const d=dc(i,o.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,e);const s=CE(this.serializer,e);s&&(n.labels=s),this.a_(n)}R_(e){const n={};n.database=fc(this.serializer),n.removeTarget=e,this.a_(n)}}class hT extends Lm{constructor(e,n,s,r,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,s,r,o),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,n){return this.connection.Bo("Write",e,n)}E_(e){return ve(!!e.streamToken),this.lastStreamToken=e.streamToken,ve(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){ve(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const n=SE(e.writeResults,e.commitTime),s=In(e.commitTime);return this.listener.g_(s,n)}p_(){const e={};e.database=fc(this.serializer),this.a_(e)}m_(e){const n={streamToken:this.lastStreamToken,writes:e.map(s=>IE(this.serializer,s))};this.a_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fT extends class{}{constructor(e,n,s,r){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=s,this.serializer=r,this.y_=!1}w_(){if(this.y_)throw new U(M.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,s,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.Mo(e,uc(n,s),r,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new U(M.UNKNOWN,i.toString())})}Lo(e,n,s,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,uc(n,s),r,o,l,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new U(M.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class pT{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(es(n),this.D_=!1):H("OnlineStateTracker",n)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mT{constructor(e,n,s,r,i){this.localStore=e,this.datastore=n,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(o=>{s.enqueueAndForget(async()=>{hr(this)&&(H("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=ee(c);d.L_.add(4),await po(d),d.q_.set("Unknown"),d.L_.delete(4),await ja(d)}(this))})}),this.q_=new pT(s,r)}}async function ja(t){if(hr(t))for(const e of t.B_)await e(!0)}async function po(t){for(const e of t.B_)await e(!1)}function Nm(t,e){const n=ee(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),vd(n)?yd(n):Jr(n).r_()&&gd(n,e))}function md(t,e){const n=ee(t),s=Jr(n);n.N_.delete(e),s.r_()&&Om(n,e),n.N_.size===0&&(s.r_()?s.o_():hr(n)&&n.q_.set("Unknown"))}function gd(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Z.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Jr(t).A_(e)}function Om(t,e){t.Q_.xe(e),Jr(t).R_(e)}function yd(t){t.Q_=new gE({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),Jr(t).start(),t.q_.v_()}function vd(t){return hr(t)&&!Jr(t).n_()&&t.N_.size>0}function hr(t){return ee(t).L_.size===0}function Fm(t){t.Q_=void 0}async function gT(t){t.q_.set("Online")}async function yT(t){t.N_.forEach((e,n)=>{gd(t,e)})}async function vT(t,e){Fm(t),vd(t)?(t.q_.M_(e),yd(t)):t.q_.set("Unknown")}async function bT(t,e,n){if(t.q_.set("Online"),e instanceof Im&&e.state===2&&e.cause)try{await async function(r,i){const o=i.cause;for(const l of i.targetIds)r.N_.has(l)&&(await r.remoteSyncer.rejectListen(l,o),r.N_.delete(l),r.Q_.removeTarget(l))}(t,e)}catch(s){H("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Ia(t,s)}else if(e instanceof ta?t.Q_.Ke(e):e instanceof Tm?t.Q_.He(e):t.Q_.We(e),!n.isEqual(Z.min()))try{const s=await Dm(t.localStore);n.compareTo(s)>=0&&await function(i,o){const l=i.Q_.rt(o);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const h=i.N_.get(d);h&&i.N_.set(d,h.withResumeToken(c.resumeToken,o))}}),l.targetMismatches.forEach((c,d)=>{const h=i.N_.get(c);if(!h)return;i.N_.set(c,h.withResumeToken(at.EMPTY_BYTE_STRING,h.snapshotVersion)),Om(i,c);const m=new _s(h.target,c,d,h.sequenceNumber);gd(i,m)}),i.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(s){H("RemoteStore","Failed to raise snapshot:",s),await Ia(t,s)}}async function Ia(t,e,n){if(!uo(e))throw e;t.L_.add(1),await po(t),t.q_.set("Offline"),n||(n=()=>Dm(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{H("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await ja(t)})}function Vm(t,e){return e().catch(n=>Ia(t,n,e))}async function Ka(t){const e=ee(t),n=Ps(e);let s=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;wT(e);)try{const r=await sT(e.localStore,s);if(r===null){e.O_.length===0&&n.o_();break}s=r.batchId,_T(e,r)}catch(r){await Ia(e,r)}zm(e)&&Um(e)}function wT(t){return hr(t)&&t.O_.length<10}function _T(t,e){t.O_.push(e);const n=Ps(t);n.r_()&&n.V_&&n.m_(e.mutations)}function zm(t){return hr(t)&&!Ps(t).n_()&&t.O_.length>0}function Um(t){Ps(t).start()}async function ET(t){Ps(t).p_()}async function TT(t){const e=Ps(t);for(const n of t.O_)e.m_(n.mutations)}async function IT(t,e,n){const s=t.O_.shift(),r=cd.from(s,e,n);await Vm(t,()=>t.remoteSyncer.applySuccessfulWrite(r)),await Ka(t)}async function ST(t,e){e&&Ps(t).V_&&await async function(s,r){if(function(o){return fE(o)&&o!==M.ABORTED}(r.code)){const i=s.O_.shift();Ps(s).s_(),await Vm(s,()=>s.remoteSyncer.rejectFailedWrite(i.batchId,r)),await Ka(s)}}(t,e),zm(t)&&Um(t)}async function hf(t,e){const n=ee(t);n.asyncQueue.verifyOperationInProgress(),H("RemoteStore","RemoteStore received new credentials");const s=hr(n);n.L_.add(3),await po(n),s&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await ja(n)}async function xT(t,e){const n=ee(t);e?(n.L_.delete(2),await ja(n)):e||(n.L_.add(2),await po(n),n.q_.set("Unknown"))}function Jr(t){return t.K_||(t.K_=function(n,s,r){const i=ee(n);return i.w_(),new uT(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(t.datastore,t.asyncQueue,{Eo:gT.bind(null,t),Ro:yT.bind(null,t),mo:vT.bind(null,t),d_:bT.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),vd(t)?yd(t):t.q_.set("Unknown")):(await t.K_.stop(),Fm(t))})),t.K_}function Ps(t){return t.U_||(t.U_=function(n,s,r){const i=ee(n);return i.w_(),new hT(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:ET.bind(null,t),mo:ST.bind(null,t),f_:TT.bind(null,t),g_:IT.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await Ka(t)):(await t.U_.stop(),t.O_.length>0&&(H("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bd{constructor(e,n,s,r,i){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=s,this.op=r,this.removalCallback=i,this.deferred=new Kn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,s,r,i){const o=Date.now()+s,l=new bd(e,n,o,r,i);return l.start(s),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new U(M.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function wd(t,e){if(es("AsyncQueue",`${e}: ${t}`),uo(t))return new U(M.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr{constructor(e){this.comparator=e?(n,s)=>e(n,s)||G.comparator(n.key,s.key):(n,s)=>G.comparator(n.key,s.key),this.keyedMap=_i(),this.sortedSet=new Me(this.comparator)}static emptySet(e){return new kr(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,s)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof kr)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(!r.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const s=new kr;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=n,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ff{constructor(){this.W_=new Me(G.comparator)}track(e){const n=e.doc.key,s=this.W_.get(n);s?e.type!==0&&s.type===3?this.W_=this.W_.insert(n,e):e.type===3&&s.type!==1?this.W_=this.W_.insert(n,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.W_=this.W_.insert(n,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.W_=this.W_.remove(n):e.type===1&&s.type===2?this.W_=this.W_.insert(n,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):Q():this.W_=this.W_.insert(n,e)}G_(){const e=[];return this.W_.inorderTraversal((n,s)=>{e.push(s)}),e}}class zr{constructor(e,n,s,r,i,o,l,c,d){this.query=e,this.docs=n,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,n,s,r,i){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new zr(e,n,kr.emptySet(n),o,s,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ua(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,s=e.docChanges;if(n.length!==s.length)return!1;for(let r=0;r<n.length;r++)if(n[r].type!==s[r].type||!n[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AT{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class kT{constructor(){this.queries=pf(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,s){const r=ee(n),i=r.queries;r.queries=pf(),i.forEach((o,l)=>{for(const c of l.j_)c.onError(s)})})(this,new U(M.ABORTED,"Firestore shutting down"))}}function pf(){return new Qr(t=>dm(t),Ua)}async function $m(t,e){const n=ee(t);let s=3;const r=e.query;let i=n.queries.get(r);i?!i.H_()&&e.J_()&&(s=2):(i=new AT,s=e.J_()?0:1);try{switch(s){case 0:i.z_=await n.onListen(r,!0);break;case 1:i.z_=await n.onListen(r,!1);break;case 2:await n.onFirstRemoteStoreListen(r)}}catch(o){const l=wd(o,`Initialization of query '${_r(e.query)}' failed`);return void e.onError(l)}n.queries.set(r,i),i.j_.push(e),e.Z_(n.onlineState),i.z_&&e.X_(i.z_)&&_d(n)}async function qm(t,e){const n=ee(t),s=e.query;let r=3;const i=n.queries.get(s);if(i){const o=i.j_.indexOf(e);o>=0&&(i.j_.splice(o,1),i.j_.length===0?r=e.J_()?0:1:!i.H_()&&e.J_()&&(r=2))}switch(r){case 0:return n.queries.delete(s),n.onUnlisten(s,!0);case 1:return n.queries.delete(s),n.onUnlisten(s,!1);case 2:return n.onLastRemoteStoreUnlisten(s);default:return}}function CT(t,e){const n=ee(t);let s=!1;for(const r of e){const i=r.query,o=n.queries.get(i);if(o){for(const l of o.j_)l.X_(r)&&(s=!0);o.z_=r}}s&&_d(n)}function RT(t,e,n){const s=ee(t),r=s.queries.get(e);if(r)for(const i of r.j_)i.onError(n);s.queries.delete(e)}function _d(t){t.Y_.forEach(e=>{e.next()})}var mc,mf;(mf=mc||(mc={})).ea="default",mf.Cache="cache";class Hm{constructor(e,n,s){this.query=e,this.ta=n,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new zr(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.na?this.ia(e)&&(this.ta.next(e),n=!0):this.sa(e,this.onlineState)&&(this.oa(e),n=!0),this.ra=e,n}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let n=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),n=!0),n}sa(e,n){if(!e.fromCache||!this.J_())return!0;const s=n!=="Offline";return(!this.options._a||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const n=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}oa(e){e=zr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==mc.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wm{constructor(e){this.key=e}}class Ym{constructor(e){this.key=e}}class PT{constructor(e,n){this.query=e,this.Ta=n,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=le(),this.mutatedKeys=le(),this.Aa=um(e),this.Ra=new kr(this.Aa)}get Va(){return this.Ta}ma(e,n){const s=n?n.fa:new ff,r=n?n.Ra:this.Ra;let i=n?n.mutatedKeys:this.mutatedKeys,o=r,l=!1;const c=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,d=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((h,m)=>{const p=r.get(h),w=$a(this.query,m)?m:null,T=!!p&&this.mutatedKeys.has(p.key),S=!!w&&(w.hasLocalMutations||this.mutatedKeys.has(w.key)&&w.hasCommittedMutations);let A=!1;p&&w?p.data.isEqual(w.data)?T!==S&&(s.track({type:3,doc:w}),A=!0):this.ga(p,w)||(s.track({type:2,doc:w}),A=!0,(c&&this.Aa(w,c)>0||d&&this.Aa(w,d)<0)&&(l=!0)):!p&&w?(s.track({type:0,doc:w}),A=!0):p&&!w&&(s.track({type:1,doc:p}),A=!0,(c||d)&&(l=!0)),A&&(w?(o=o.add(w),i=S?i.add(h):i.delete(h)):(o=o.delete(h),i=i.delete(h)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const h=this.query.limitType==="F"?o.last():o.first();o=o.delete(h.key),i=i.delete(h.key),s.track({type:1,doc:h})}return{Ra:o,fa:s,ns:l,mutatedKeys:i}}ga(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,s,r){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((h,m)=>function(w,T){const S=A=>{switch(A){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Q()}};return S(w)-S(T)}(h.type,m.type)||this.Aa(h.doc,m.doc)),this.pa(s),r=r!=null&&r;const l=n&&!r?this.ya():[],c=this.da.size===0&&this.current&&!r?1:0,d=c!==this.Ea;return this.Ea=c,o.length!==0||d?{snapshot:new zr(this.query,e.Ra,i,o,e.mutatedKeys,c===0,d,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new ff,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(n=>this.Ta=this.Ta.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ta=this.Ta.delete(n)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=le(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const n=[];return e.forEach(s=>{this.da.has(s)||n.push(new Ym(s))}),this.da.forEach(s=>{e.has(s)||n.push(new Wm(s))}),n}ba(e){this.Ta=e.Ts,this.da=le();const n=this.ma(e.documents);return this.applyChanges(n,!0)}Da(){return zr.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class MT{constructor(e,n,s){this.query=e,this.targetId=n,this.view=s}}class DT{constructor(e){this.key=e,this.va=!1}}class BT{constructor(e,n,s,r,i,o){this.localStore=e,this.remoteStore=n,this.eventManager=s,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new Qr(l=>dm(l),Ua),this.Ma=new Map,this.xa=new Set,this.Oa=new Me(G.comparator),this.Na=new Map,this.La=new hd,this.Ba={},this.ka=new Map,this.qa=Vr.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function LT(t,e,n=!0){const s=Xm(t);let r;const i=s.Fa.get(e);return i?(s.sharedClientState.addLocalQueryTarget(i.targetId),r=i.view.Da()):r=await Gm(s,e,n,!0),r}async function NT(t,e){const n=Xm(t);await Gm(n,e,!0,!1)}async function Gm(t,e,n,s){const r=await rT(t.localStore,Tn(e)),i=r.targetId,o=t.sharedClientState.addLocalQueryTarget(i,n);let l;return s&&(l=await OT(t,e,i,o==="current",r.resumeToken)),t.isPrimaryClient&&n&&Nm(t.remoteStore,r),l}async function OT(t,e,n,s,r){t.Ka=(m,p,w)=>async function(S,A,P,C){let L=A.view.ma(P);L.ns&&(L=await cf(S.localStore,A.query,!1).then(({documents:I})=>A.view.ma(I,L)));const D=C&&C.targetChanges.get(A.targetId),O=C&&C.targetMismatches.get(A.targetId)!=null,$=A.view.applyChanges(L,S.isPrimaryClient,D,O);return yf(S,A.targetId,$.wa),$.snapshot}(t,m,p,w);const i=await cf(t.localStore,e,!0),o=new PT(e,i.Ts),l=o.ma(i.documents),c=fo.createSynthesizedTargetChangeForCurrentChange(n,s&&t.onlineState!=="Offline",r),d=o.applyChanges(l,t.isPrimaryClient,c);yf(t,n,d.wa);const h=new MT(e,n,o);return t.Fa.set(e,h),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),d.snapshot}async function FT(t,e,n){const s=ee(t),r=s.Fa.get(e),i=s.Ma.get(r.targetId);if(i.length>1)return s.Ma.set(r.targetId,i.filter(o=>!Ua(o,e))),void s.Fa.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(r.targetId),s.sharedClientState.isActiveQueryTarget(r.targetId)||await pc(s.localStore,r.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(r.targetId),n&&md(s.remoteStore,r.targetId),gc(s,r.targetId)}).catch(co)):(gc(s,r.targetId),await pc(s.localStore,r.targetId,!0))}async function VT(t,e){const n=ee(t),s=n.Fa.get(e),r=n.Ma.get(s.targetId);n.isPrimaryClient&&r.length===1&&(n.sharedClientState.removeLocalQueryTarget(s.targetId),md(n.remoteStore,s.targetId))}async function zT(t,e,n){const s=GT(t);try{const r=await function(o,l){const c=ee(o),d=Ke.now(),h=l.reduce((w,T)=>w.add(T.key),le());let m,p;return c.persistence.runTransaction("Locally write mutations","readwrite",w=>{let T=ts(),S=le();return c.cs.getEntries(w,h).next(A=>{T=A,T.forEach((P,C)=>{C.isValidDocument()||(S=S.add(P))})}).next(()=>c.localDocuments.getOverlayedDocuments(w,T)).next(A=>{m=A;const P=[];for(const C of l){const L=lE(C,m.get(C.key).overlayedDocument);L!=null&&P.push(new Ds(C.key,L,nm(L.value.mapValue),xt.exists(!0)))}return c.mutationQueue.addMutationBatch(w,d,P,l)}).next(A=>{p=A;const P=A.applyToLocalDocumentSet(m,S);return c.documentOverlayCache.saveOverlays(w,A.batchId,P)})}).then(()=>({batchId:p.batchId,changes:fm(m)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),function(o,l,c){let d=o.Ba[o.currentUser.toKey()];d||(d=new Me(pe)),d=d.insert(l,c),o.Ba[o.currentUser.toKey()]=d}(s,r.batchId,n),await mo(s,r.changes),await Ka(s.remoteStore)}catch(r){const i=wd(r,"Failed to persist write");n.reject(i)}}async function jm(t,e){const n=ee(t);try{const s=await tT(n.localStore,e);e.targetChanges.forEach((r,i)=>{const o=n.Na.get(i);o&&(ve(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1),r.addedDocuments.size>0?o.va=!0:r.modifiedDocuments.size>0?ve(o.va):r.removedDocuments.size>0&&(ve(o.va),o.va=!1))}),await mo(n,s,e)}catch(s){await co(s)}}function gf(t,e,n){const s=ee(t);if(s.isPrimaryClient&&n===0||!s.isPrimaryClient&&n===1){const r=[];s.Fa.forEach((i,o)=>{const l=o.view.Z_(e);l.snapshot&&r.push(l.snapshot)}),function(o,l){const c=ee(o);c.onlineState=l;let d=!1;c.queries.forEach((h,m)=>{for(const p of m.j_)p.Z_(l)&&(d=!0)}),d&&_d(c)}(s.eventManager,e),r.length&&s.Ca.d_(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function UT(t,e,n){const s=ee(t);s.sharedClientState.updateQueryState(e,"rejected",n);const r=s.Na.get(e),i=r&&r.key;if(i){let o=new Me(G.comparator);o=o.insert(i,gt.newNoDocument(i,Z.min()));const l=le().add(i),c=new Ya(Z.min(),new Map,new Me(pe),o,l);await jm(s,c),s.Oa=s.Oa.remove(i),s.Na.delete(e),Ed(s)}else await pc(s.localStore,e,!1).then(()=>gc(s,e,n)).catch(co)}async function $T(t,e){const n=ee(t),s=e.batch.batchId;try{const r=await eT(n.localStore,e);Qm(n,s,null),Km(n,s),n.sharedClientState.updateMutationState(s,"acknowledged"),await mo(n,r)}catch(r){await co(r)}}async function qT(t,e,n){const s=ee(t);try{const r=await function(o,l){const c=ee(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let h;return c.mutationQueue.lookupMutationBatch(d,l).next(m=>(ve(m!==null),h=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,h,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,h)).next(()=>c.localDocuments.getDocuments(d,h))})}(s.localStore,e);Qm(s,e,n),Km(s,e),s.sharedClientState.updateMutationState(e,"rejected",n),await mo(s,r)}catch(r){await co(r)}}function Km(t,e){(t.ka.get(e)||[]).forEach(n=>{n.resolve()}),t.ka.delete(e)}function Qm(t,e,n){const s=ee(t);let r=s.Ba[s.currentUser.toKey()];if(r){const i=r.get(e);i&&(n?i.reject(n):i.resolve(),r=r.remove(e)),s.Ba[s.currentUser.toKey()]=r}}function gc(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const s of t.Ma.get(e))t.Fa.delete(s),n&&t.Ca.$a(s,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(s=>{t.La.containsKey(s)||Jm(t,s)})}function Jm(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);n!==null&&(md(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),Ed(t))}function yf(t,e,n){for(const s of n)s instanceof Wm?(t.La.addReference(s.key,e),HT(t,s)):s instanceof Ym?(H("SyncEngine","Document no longer in limbo: "+s.key),t.La.removeReference(s.key,e),t.La.containsKey(s.key)||Jm(t,s.key)):Q()}function HT(t,e){const n=e.key,s=n.path.canonicalString();t.Oa.get(n)||t.xa.has(s)||(H("SyncEngine","New document in limbo: "+n),t.xa.add(s),Ed(t))}function Ed(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new G(ke.fromString(e)),s=t.qa.next();t.Na.set(s,new DT(n)),t.Oa=t.Oa.insert(n,s),Nm(t.remoteStore,new _s(Tn(ad(n.path)),s,"TargetPurposeLimboResolution",td.oe))}}async function mo(t,e,n){const s=ee(t),r=[],i=[],o=[];s.Fa.isEmpty()||(s.Fa.forEach((l,c)=>{o.push(s.Ka(c,e,n).then(d=>{var h;if((d||n)&&s.isPrimaryClient){const m=d?!d.fromCache:(h=n==null?void 0:n.targetChanges.get(c.targetId))===null||h===void 0?void 0:h.current;s.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){r.push(d);const m=pd.Wi(c.targetId,d);i.push(m)}}))}),await Promise.all(o),s.Ca.d_(r),await async function(c,d){const h=ee(c);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>N.forEach(d,p=>N.forEach(p.$i,w=>h.persistence.referenceDelegate.addReference(m,p.targetId,w)).next(()=>N.forEach(p.Ui,w=>h.persistence.referenceDelegate.removeReference(m,p.targetId,w)))))}catch(m){if(!uo(m))throw m;H("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const p=m.targetId;if(!m.fromCache){const w=h.os.get(p),T=w.snapshotVersion,S=w.withLastLimboFreeSnapshotVersion(T);h.os=h.os.insert(p,S)}}}(s.localStore,i))}async function WT(t,e){const n=ee(t);if(!n.currentUser.isEqual(e)){H("SyncEngine","User change. New user:",e.toKey());const s=await Mm(n.localStore,e);n.currentUser=e,function(i,o){i.ka.forEach(l=>{l.forEach(c=>{c.reject(new U(M.CANCELLED,o))})}),i.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await mo(n,s.hs)}}function YT(t,e){const n=ee(t),s=n.Na.get(e);if(s&&s.va)return le().add(s.key);{let r=le();const i=n.Ma.get(e);if(!i)return r;for(const o of i){const l=n.Fa.get(o);r=r.unionWith(l.view.Va)}return r}}function Xm(t){const e=ee(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=jm.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=YT.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=UT.bind(null,e),e.Ca.d_=CT.bind(null,e.eventManager),e.Ca.$a=RT.bind(null,e.eventManager),e}function GT(t){const e=ee(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=$T.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=qT.bind(null,e),e}class Sa{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ga(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return ZE(this.persistence,new JE,e.initialUser,this.serializer)}Ga(e){return new jE(fd.Zr,this.serializer)}Wa(e){return new oT}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Sa.provider={build:()=>new Sa};class yc{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>gf(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=WT.bind(null,this.syncEngine),await xT(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new kT}()}createDatastore(e){const n=Ga(e.databaseInfo.databaseId),s=function(i){return new dT(i)}(e.databaseInfo);return function(i,o,l,c){return new fT(i,o,l,c)}(e.authCredentials,e.appCheckCredentials,s,n)}createRemoteStore(e){return function(s,r,i,o,l){return new mT(s,r,i,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>gf(this.syncEngine,n,0),function(){return uf.D()?new uf:new aT}())}createSyncEngine(e,n){return function(r,i,o,l,c,d,h){const m=new BT(r,i,o,l,c,d);return h&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(r){const i=ee(r);H("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await po(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}yc.provider={build:()=>new yc};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Zm{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):es("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jT{constructor(e,n,s,r,i){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=s,this.databaseInfo=r,this.user=mt.UNAUTHENTICATED,this.clientId=Zp.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(s,async o=>{H("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(s,o=>(H("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Kn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const s=wd(n,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function Hl(t,e){t.asyncQueue.verifyOperationInProgress(),H("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let s=n.initialUser;t.setCredentialChangeListener(async r=>{s.isEqual(r)||(await Mm(e.localStore,r),s=r)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function vf(t,e){t.asyncQueue.verifyOperationInProgress();const n=await KT(t);H("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(s=>hf(e.remoteStore,s)),t.setAppCheckTokenChangeListener((s,r)=>hf(e.remoteStore,r)),t._onlineComponents=e}async function KT(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){H("FirestoreClient","Using user provided OfflineComponentProvider");try{await Hl(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(r){return r.name==="FirebaseError"?r.code===M.FAILED_PRECONDITION||r.code===M.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11}(n))throw n;Lr("Error using user provided cache. Falling back to memory cache: "+n),await Hl(t,new Sa)}}else H("FirestoreClient","Using default OfflineComponentProvider"),await Hl(t,new Sa);return t._offlineComponents}async function eg(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(H("FirestoreClient","Using user provided OnlineComponentProvider"),await vf(t,t._uninitializedComponentsProvider._online)):(H("FirestoreClient","Using default OnlineComponentProvider"),await vf(t,new yc))),t._onlineComponents}function QT(t){return eg(t).then(e=>e.syncEngine)}async function tg(t){const e=await eg(t),n=e.eventManager;return n.onListen=LT.bind(null,e.syncEngine),n.onUnlisten=FT.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=NT.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=VT.bind(null,e.syncEngine),n}function JT(t,e,n={}){const s=new Kn;return t.asyncQueue.enqueueAndForget(async()=>function(i,o,l,c,d){const h=new Zm({next:p=>{h.Za(),o.enqueueAndForget(()=>qm(i,m));const w=p.docs.has(l);!w&&p.fromCache?d.reject(new U(M.UNAVAILABLE,"Failed to get document because the client is offline.")):w&&p.fromCache&&c&&c.source==="server"?d.reject(new U(M.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(p)},error:p=>d.reject(p)}),m=new Hm(ad(l.path),h,{includeMetadataChanges:!0,_a:!0});return $m(i,m)}(await tg(t),t.asyncQueue,e,n,s)),s.promise}function XT(t,e,n={}){const s=new Kn;return t.asyncQueue.enqueueAndForget(async()=>function(i,o,l,c,d){const h=new Zm({next:p=>{h.Za(),o.enqueueAndForget(()=>qm(i,m)),p.fromCache&&c.source==="server"?d.reject(new U(M.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(p)},error:p=>d.reject(p)}),m=new Hm(l,h,{includeMetadataChanges:!0,_a:!0});return $m(i,m)}(await tg(t),t.asyncQueue,e,n,s)),s.promise}/**
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
 */function ng(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bf=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sg(t,e,n){if(!n)throw new U(M.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function ZT(t,e,n,s){if(e===!0&&s===!0)throw new U(M.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function wf(t){if(!G.isDocumentKey(t))throw new U(M.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function _f(t){if(G.isDocumentKey(t))throw new U(M.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Qa(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":Q()}function nn(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new U(M.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Qa(t);throw new U(M.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}function eI(t,e){if(e<=0)throw new U(M.INVALID_ARGUMENT,`Function ${t}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ef{constructor(e){var n,s;if(e.host===void 0){if(e.ssl!==void 0)throw new U(M.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new U(M.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}ZT("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=ng((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,r){return s.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ja{constructor(e,n,s,r){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ef({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new U(M.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new U(M.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ef(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new g_;switch(s.type){case"firstParty":return new w_(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new U(M.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const s=bf.get(n);s&&(H("ComponentProvider","Removing Datastore"),bf.delete(n),s.terminate())}(this),Promise.resolve()}}function tI(t,e,n,s={}){var r;const i=(t=nn(t,Ja))._getSettings(),o=`${e}:${n}`;if(i.host!=="firestore.googleapis.com"&&i.host!==o&&Lr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},i),{host:o,ssl:!1})),s.mockUserToken){let l,c;if(typeof s.mockUserToken=="string")l=s.mockUserToken,c=mt.MOCK_USER;else{l=I0(s.mockUserToken,(r=t._app)===null||r===void 0?void 0:r.options.projectId);const d=s.mockUserToken.sub||s.mockUserToken.user_id;if(!d)throw new U(M.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new mt(d)}t._authCredentials=new y_(new Xp(l,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs{constructor(e,n,s){this.converter=n,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Bs(this.firestore,e,this._query)}}class At{constructor(e,n,s){this.converter=n,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new As(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new At(this.firestore,e,this._key)}}class As extends Bs{constructor(e,n,s){super(e,n,ad(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new At(this.firestore,null,new G(e))}withConverter(e){return new As(this.firestore,e,this._path)}}function Td(t,e,...n){if(t=Pe(t),sg("collection","path",e),t instanceof Ja){const s=ke.fromString(e,...n);return _f(s),new As(t,null,s)}{if(!(t instanceof At||t instanceof As))throw new U(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(ke.fromString(e,...n));return _f(s),new As(t.firestore,null,s)}}function St(t,e,...n){if(t=Pe(t),arguments.length===1&&(e=Zp.newId()),sg("doc","path",e),t instanceof Ja){const s=ke.fromString(e,...n);return wf(s),new At(t,null,new G(s))}{if(!(t instanceof At||t instanceof As))throw new U(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(ke.fromString(e,...n));return wf(s),new At(t.firestore,t instanceof As?t.converter:null,new G(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tf{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Bm(this,"async_queue_retry"),this.Vu=()=>{const s=ql();s&&H("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=e;const n=ql();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=ql();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new Kn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!uo(e))throw e;H("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(s=>{this.Eu=s,this.du=!1;const r=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(s);throw es("INTERNAL UNHANDLED ERROR: ",r),s}).then(s=>(this.du=!1,s))));return this.mu=n,n}enqueueAfterDelay(e,n,s){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const r=bd.createAndSchedule(this,e,n,s,i=>this.yu(i));return this.Tu.push(r),r}fu(){this.Eu&&Q()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,s)=>n.targetTimeMs-s.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}class Ls extends Ja{constructor(e,n,s,r){super(e,n,s,r),this.type="firestore",this._queue=new Tf,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Tf(e),this._firestoreClient=void 0,await e}}}function nI(t,e){const n=typeof t=="object"?t:lp(),s=typeof t=="string"?t:"(default)",r=$c(n,"firestore").getImmediate({identifier:s});if(!r._initialized){const i=E0("firestore");i&&tI(r,...i)}return r}function Xa(t){if(t._terminated)throw new U(M.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||sI(t),t._firestoreClient}function sI(t){var e,n,s;const r=t._freezeSettings(),i=function(l,c,d,h){return new D_(l,c,d,h.host,h.ssl,h.experimentalForceLongPolling,h.experimentalAutoDetectLongPolling,ng(h.experimentalLongPollingOptions),h.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,r);t._componentsProvider||!((n=r.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((s=r.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(t._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),t._firestoreClient=new jT(t._authCredentials,t._appCheckCredentials,t._queue,i,t._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ur{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ur(at.fromBase64String(e))}catch(n){throw new U(M.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Ur(at.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class go{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new U(M.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new rt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Za{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Id{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new U(M.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new U(M.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return pe(this._lat,e._lat)||pe(this._long,e._long)}}/**
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
 */class Sd{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,r){if(s.length!==r.length)return!1;for(let i=0;i<s.length;++i)if(s[i]!==r[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rI=/^__.*__$/;class iI{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return this.fieldMask!==null?new Ds(e,this.data,this.fieldMask,n,this.fieldTransforms):new ho(e,this.data,n,this.fieldTransforms)}}class rg{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return new Ds(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function ig(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Q()}}class xd{constructor(e,n,s,r,i,o){this.settings=e,this.databaseId=n,this.serializer=s,this.ignoreUndefinedProperties=r,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new xd(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Fu({path:s,xu:!1});return r.Ou(e),r}Nu(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Fu({path:s,xu:!1});return r.vu(),r}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return xa(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(ig(this.Cu)&&rI.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class oI{constructor(e,n,s){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=s||Ga(e)}Qu(e,n,s,r=!1){return new xd({Cu:e,methodName:n,qu:s,path:rt.emptyPath(),xu:!1,ku:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function yo(t){const e=t._freezeSettings(),n=Ga(t._databaseId);return new oI(t._databaseId,!!e.ignoreUndefinedProperties,n)}function Ad(t,e,n,s,r,i={}){const o=t.Qu(i.merge||i.mergeFields?2:0,e,n,r);Cd("Data must be an object, but it was:",o,s);const l=lg(s,o);let c,d;if(i.merge)c=new Gt(o.fieldMask),d=o.fieldTransforms;else if(i.mergeFields){const h=[];for(const m of i.mergeFields){const p=vc(e,m,n);if(!o.contains(p))throw new U(M.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);dg(h,p)||h.push(p)}c=new Gt(h),d=o.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=o.fieldTransforms;return new iI(new Lt(l),c,d)}class el extends Za{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof el}}class kd extends Za{_toFieldTransform(e){return new rE(e.path,new qi)}isEqual(e){return e instanceof kd}}function og(t,e,n,s){const r=t.Qu(1,e,n);Cd("Data must be an object, but it was:",r,s);const i=[],o=Lt.empty();ur(s,(c,d)=>{const h=Rd(e,c,n);d=Pe(d);const m=r.Nu(h);if(d instanceof el)i.push(h);else{const p=vo(d,m);p!=null&&(i.push(h),o.set(h,p))}});const l=new Gt(i);return new rg(o,l,r.fieldTransforms)}function ag(t,e,n,s,r,i){const o=t.Qu(1,e,n),l=[vc(e,s,n)],c=[r];if(i.length%2!=0)throw new U(M.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let p=0;p<i.length;p+=2)l.push(vc(e,i[p])),c.push(i[p+1]);const d=[],h=Lt.empty();for(let p=l.length-1;p>=0;--p)if(!dg(d,l[p])){const w=l[p];let T=c[p];T=Pe(T);const S=o.Nu(w);if(T instanceof el)d.push(w);else{const A=vo(T,S);A!=null&&(d.push(w),h.set(w,A))}}const m=new Gt(d);return new rg(h,m,o.fieldTransforms)}function aI(t,e,n,s=!1){return vo(n,t.Qu(s?4:3,e))}function vo(t,e){if(cg(t=Pe(t)))return Cd("Unsupported field value:",e,t),lg(t,e);if(t instanceof Za)return function(s,r){if(!ig(r.Cu))throw r.Bu(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r.Bu(`${s._methodName}() is not currently supported inside arrays`);const i=s._toFieldTransform(r);i&&r.fieldTransforms.push(i)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(s,r){const i=[];let o=0;for(const l of s){let c=vo(l,r.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),o++}return{arrayValue:{values:i}}}(t,e)}return function(s,r){if((s=Pe(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return tE(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const i=Ke.fromDate(s);return{timestampValue:Ta(r.serializer,i)}}if(s instanceof Ke){const i=new Ke(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Ta(r.serializer,i)}}if(s instanceof Id)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Ur)return{bytesValue:Sm(r.serializer,s._byteString)};if(s instanceof At){const i=r.databaseId,o=s.firestore._databaseId;if(!o.isEqual(i))throw r.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:ud(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof Sd)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return ld(l.serializer,c)})}}}}}}(s,r);throw r.Bu(`Unsupported field value: ${Qa(s)}`)}(t,e)}function lg(t,e){const n={};return em(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ur(t,(s,r)=>{const i=vo(r,e.Mu(s));i!=null&&(n[s]=i)}),{mapValue:{fields:n}}}function cg(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof Ke||t instanceof Id||t instanceof Ur||t instanceof At||t instanceof Za||t instanceof Sd)}function Cd(t,e,n){if(!cg(n)||!function(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}(n)){const s=Qa(n);throw s==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+s)}}function vc(t,e,n){if((e=Pe(e))instanceof go)return e._internalPath;if(typeof e=="string")return Rd(t,e);throw xa("Field path arguments must be of type string or ",t,!1,void 0,n)}const lI=new RegExp("[~\\*/\\[\\]]");function Rd(t,e,n){if(e.search(lI)>=0)throw xa(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new go(...e.split("."))._internalPath}catch{throw xa(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function xa(t,e,n,s,r){const i=s&&!s.isEmpty(),o=r!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${s}`),o&&(c+=` in document ${r}`),c+=")"),new U(M.INVALID_ARGUMENT,l+t+c)}function dg(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ug{constructor(e,n,s,r,i){this._firestore=e,this._userDataWriter=n,this._key=s,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new At(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new cI(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Pd("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class cI extends ug{data(){return super.data()}}function Pd(t,e){return typeof e=="string"?Rd(t,e):e instanceof go?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dI(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new U(M.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Md{}class Dd extends Md{}function uI(t,e,...n){let s=[];e instanceof Md&&s.push(e),s=s.concat(n),function(i){const o=i.filter(c=>c instanceof Ld).length,l=i.filter(c=>c instanceof Bd).length;if(o>1||o>0&&l>0)throw new U(M.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const r of s)t=r._apply(t);return t}class Bd extends Dd{constructor(e,n,s){super(),this._field=e,this._op=n,this._value=s,this.type="where"}static _create(e,n,s){return new Bd(e,n,s)}_apply(e){const n=this._parse(e);return hg(e._query,n),new Bs(e.firestore,e.converter,cc(e._query,n))}_parse(e){const n=yo(e.firestore);return function(i,o,l,c,d,h,m){let p;if(d.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new U(M.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){Sf(m,h);const w=[];for(const T of m)w.push(If(c,i,T));p={arrayValue:{values:w}}}else p=If(c,i,m)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||Sf(m,h),p=aI(l,o,m,h==="in"||h==="not-in");return Ye.create(d,h,p)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}class Ld extends Md{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new Ld(e,n)}_parse(e){const n=this._queryConstraints.map(s=>s._parse(e)).filter(s=>s.getFilters().length>0);return n.length===1?n[0]:fn.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(r,i){let o=r;const l=i.getFlattenedFilters();for(const c of l)hg(o,c),o=cc(o,c)}(e._query,n),new Bs(e.firestore,e.converter,cc(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Nd extends Dd{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new Nd(e,n)}_apply(e){const n=function(r,i,o){if(r.startAt!==null)throw new U(M.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(r.endAt!==null)throw new U(M.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new $i(i,o)}(e._query,this._field,this._direction);return new Bs(e.firestore,e.converter,function(r,i){const o=r.explicitOrderBy.concat([i]);return new Kr(r.path,r.collectionGroup,o,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}(e._query,n))}}function hI(t,e="asc"){const n=e,s=Pd("orderBy",t);return Nd._create(s,n)}class Od extends Dd{constructor(e,n,s){super(),this.type=e,this._limit=n,this._limitType=s}static _create(e,n,s){return new Od(e,n,s)}_apply(e){return new Bs(e.firestore,e.converter,_a(e._query,this._limit,this._limitType))}}function fI(t){return eI("limit",t),Od._create("limit",t,"F")}function If(t,e,n){if(typeof(n=Pe(n))=="string"){if(n==="")throw new U(M.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!cm(e)&&n.indexOf("/")!==-1)throw new U(M.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const s=e.path.child(ke.fromString(n));if(!G.isDocumentKey(s))throw new U(M.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Wh(t,new G(s))}if(n instanceof At)return Wh(t,n._key);throw new U(M.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Qa(n)}.`)}function Sf(t,e){if(!Array.isArray(t)||t.length===0)throw new U(M.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function hg(t,e){const n=function(r,i){for(const o of r)for(const l of o.getFlattenedFilters())if(i.indexOf(l.op)>=0)return l.op;return null}(t.filters,function(r){switch(r){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new U(M.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new U(M.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class pI{convertValue(e,n="none"){switch(ir(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ve(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(rr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw Q()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const s={};return ur(e,(r,i)=>{s[r]=this.convertValue(i,n)}),s}convertVectorValue(e){var n,s,r;const i=(r=(s=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||s===void 0?void 0:s.values)===null||r===void 0?void 0:r.map(o=>Ve(o.doubleValue));return new Sd(i)}convertGeoPoint(e){return new Id(Ve(e.latitude),Ve(e.longitude))}convertArray(e,n){return(e.values||[]).map(s=>this.convertValue(s,n))}convertServerTimestamp(e,n){switch(n){case"previous":const s=sd(e);return s==null?null:this.convertValue(s,n);case"estimate":return this.convertTimestamp(Vi(e));default:return null}}convertTimestamp(e){const n=Rs(e);return new Ke(n.seconds,n.nanos)}convertDocumentKey(e,n){const s=ke.fromString(e);ve(Pm(s));const r=new zi(s.get(1),s.get(3)),i=new G(s.popFirst(5));return r.isEqual(n)||es(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fd(t,e,n){let s;return s=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ti{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class fg extends ug{constructor(e,n,s,r,i,o){super(e,n,s,r,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new na(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const s=this._document.data.field(Pd("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,n.serverTimestamps)}}}class na extends fg{data(e={}){return super.data(e)}}class mI{constructor(e,n,s,r){this._firestore=e,this._userDataWriter=n,this._snapshot=r,this.metadata=new Ti(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(s=>{e.call(n,new na(this._firestore,this._userDataWriter,s.key,s,new Ti(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new U(M.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(r,i){if(r._snapshot.oldDocs.isEmpty()){let o=0;return r._snapshot.docChanges.map(l=>{const c=new na(r._firestore,r._userDataWriter,l.doc.key,l.doc,new Ti(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=r._snapshot.oldDocs;return r._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const c=new na(r._firestore,r._userDataWriter,l.doc.key,l.doc,new Ti(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);let d=-1,h=-1;return l.type!==0&&(d=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),h=o.indexOf(l.doc.key)),{type:gI(l.type),doc:c,oldIndex:d,newIndex:h}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function gI(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Q()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ii(t){t=nn(t,At);const e=nn(t.firestore,Ls);return JT(Xa(e),t._key).then(n=>vI(e,t,n))}class pg extends pI{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ur(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new At(this.firestore,null,n)}}function mg(t){t=nn(t,Bs);const e=nn(t.firestore,Ls),n=Xa(e),s=new pg(e);return dI(t._query),XT(n,t._query).then(r=>new mI(e,s,t,r))}function Vd(t,e,n){t=nn(t,At);const s=nn(t.firestore,Ls),r=Fd(t.converter,e,n);return bo(s,[Ad(yo(s),"setDoc",t._key,r,t.converter!==null,n).toMutation(t._key,xt.none())])}function yI(t,e,n,...s){t=nn(t,At);const r=nn(t.firestore,Ls),i=yo(r);let o;return o=typeof(e=Pe(e))=="string"||e instanceof go?ag(i,"updateDoc",t._key,e,n,s):og(i,"updateDoc",t._key,e),bo(r,[o.toMutation(t._key,xt.exists(!0))])}function tl(t){return bo(nn(t.firestore,Ls),[new Wa(t._key,xt.none())])}function gg(t,e){const n=nn(t.firestore,Ls),s=St(t),r=Fd(t.converter,e);return bo(n,[Ad(yo(t.firestore),"addDoc",s._key,r,t.converter!==null,{}).toMutation(s._key,xt.exists(!1))]).then(()=>s)}function bo(t,e){return function(s,r){const i=new Kn;return s.asyncQueue.enqueueAndForget(async()=>zT(await QT(s),r,i)),i.promise}(Xa(t),e)}function vI(t,e,n){const s=n.docs.get(e._key),r=new pg(t);return new fg(t,r,e._key,s,new Ti(n.hasPendingWrites,n.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bI{constructor(e,n){this._firestore=e,this._commitHandler=n,this._mutations=[],this._committed=!1,this._dataReader=yo(e)}set(e,n,s){this._verifyNotCommitted();const r=Wl(e,this._firestore),i=Fd(r.converter,n,s),o=Ad(this._dataReader,"WriteBatch.set",r._key,i,r.converter!==null,s);return this._mutations.push(o.toMutation(r._key,xt.none())),this}update(e,n,s,...r){this._verifyNotCommitted();const i=Wl(e,this._firestore);let o;return o=typeof(n=Pe(n))=="string"||n instanceof go?ag(this._dataReader,"WriteBatch.update",i._key,n,s,r):og(this._dataReader,"WriteBatch.update",i._key,n),this._mutations.push(o.toMutation(i._key,xt.exists(!0))),this}delete(e){this._verifyNotCommitted();const n=Wl(e,this._firestore);return this._mutations=this._mutations.concat(new Wa(n._key,xt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new U(M.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Wl(t,e){if((t=Pe(t)).firestore!==e)throw new U(M.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return t}function zd(){return new kd("serverTimestamp")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yg(t){return Xa(t=nn(t,Ls)),new bI(t,e=>bo(t,e))}(function(e,n=!0){(function(r){jr=r})(Yr),Dr(new er("firestore",(s,{instanceIdentifier:r,options:i})=>{const o=s.getProvider("app").getImmediate(),l=new Ls(new v_(s.getProvider("auth-internal")),new E_(s.getProvider("app-check-internal")),function(d,h){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new U(M.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new zi(d.options.projectId,h)}(o,r),o);return i=Object.assign({useFetchStreams:n},i),l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),xs(zh,"4.7.3",e),xs(zh,"4.7.3","esm2017")})();const vg={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"};function De(){return vg.apiKey!=="YOUR_API_KEY"}let Yl=null,bt=null,Ee=null;try{De()?(Yl=ap(vg),bt=p_(Yl),Ee=nI(Yl)):console.warn("Firebase not configured. Login required to save data.")}catch(t){console.error("Firebase initialization error:",t)}const wI=new qn;let yt=null,Mi=[];function _I(){if(!De()||!bt){console.warn("Firebase not configured - auth disabled");return}tw(bt,t=>{console.log("onAuthStateChanged fired:",t?t.email:"null"),yt=t,console.log("Notifying",Mi.length,"listeners"),Mi.forEach(e=>e(t))})}function bg(t){return console.log("onAuthStateChange: adding listener, currentUser is:",yt&&yt.email),Mi.push(t),yt&&(console.log("onAuthStateChange: immediately calling listener with user"),t(yt)),()=>{Mi=Mi.filter(e=>e!==t)}}function kn(){return yt}function lt(){return yt!==null}async function EI(t,e,n=null){if(!De()||!bt)throw new Error("Firebase not configured");const s=await Kb(bt,t,e);n&&s.user&&await Xb(s.user,{displayName:n});try{await Bp(s.user)}catch(r){console.error("Failed to send verification email:",r)}return s}async function TI(){if(!De()||!bt||!yt)throw new Error("Not logged in");return Bp(yt)}async function II(){return yt?(await yt.reload(),yt=bt.currentUser,yt):null}async function SI(t,e){if(!De()||!bt)throw new Error("Firebase not configured");return Qb(bt,t,e)}async function xI(){if(!De()||!bt)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const t=await Tw(bt,wI);return console.log("Google sign-in successful:",t.user.email),t}catch(t){throw console.error("signInWithPopup error:",t.code,t.message),t}}async function Ud(){if(!De()||!bt)throw new Error("Firebase not configured");return nw(bt)}async function AI(t){if(!De()||!bt)throw new Error("Firebase not configured");return jb(bt,t)}async function kI(){if(!De()||!bt||!yt)throw new Error("Not logged in");return sw(yt)}_I();function br(...t){return t.find(e=>e!==void 0)}function CI(t){if(!t||typeof t!="object")return{scenario:t,migrated:!1};const e=Object.keys(t).filter(c=>c.includes(".")),n="decisionSettings"in t||"stressSettings"in t||"name"in t||"description"in t||"taxYears"in t;if(!(e.length>0||n))return{scenario:t,migrated:!1};const r=t.decisionTool||{},i=t.stressTool||{},o=t.planDetails||{},l={isActive:t.isActive??!1,enabledTools:t.enabledTools||["stress","decision"],planDetails:{name:br(t["planDetails.name"],o.name,t.name)??"My Plan",description:br(t["planDetails.description"],o.description,t.description)??""},decisionTool:{settings:br(t["decisionTool.settings"],r.settings,t.decisionSettings)??{},history:br(t["decisionTool.history"],r.history)??[],taxYears:br(t["decisionTool.taxYears"],r.taxYears,t.taxYears)??{}},stressTool:{settings:br(t["stressTool.settings"],i.settings,t.stressSettings)??{}}};return t.id!==void 0&&(l.id=t.id),t.createdAt!==void 0&&(l.createdAt=t.createdAt),t.lastModified!==void 0&&(l.lastModified=t.lastModified),{scenario:l,migrated:!0}}function $d(t,e="settings"){const n=kn();return!n||!Ee?null:St(Ee,"users",n.uid,t,e)}function wg(t){const e=kn();return!e||!Ee?null:Td(Ee,"users",e.uid,t)}async function _g(t){const{scenario:e,migrated:n}=CI(t);if(n){const s=kn();if(s&&Ee)try{const{id:r,...i}=e;await Vd(St(Ee,"users",s.uid,"scenarios",r),i)}catch(r){console.error("Scenario migration write failed:",r)}}return e}async function nl(){if(!De())return[];const t=wg("scenarios");if(!t)return[];try{const e=await mg(t),n=[];return e.forEach(s=>{n.push({id:s.id,...s.data()})}),Promise.all(n.map(s=>_g(s)))}catch(e){return console.error("Error loading scenarios:",e),[]}}async function RI(t){if(!De())return null;const e=$d("scenarios",t);if(!e)return null;try{const n=await Ii(e);return n.exists()?_g({id:n.id,...n.data()}):null}catch(n){return console.error("Error loading scenario:",n),null}}async function cs(t,e){if(!De())return;const n=$d("scenarios",t);if(n)try{await yI(n,{...e,lastModified:new Date().toISOString()})}catch(s){throw console.error("Error saving scenario:",s),s}}async function Eg(t){if(!De())return null;const e=wg("scenarios");if(!e)return null;try{return(await gg(e,{...t,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(n){throw console.error("Error creating scenario:",n),n}}async function PI(t){if(!De())return;const e=$d("scenarios",t);if(e)try{await tl(e)}catch(n){throw console.error("Error deleting scenario:",n),n}}async function qd(t){if(!De())return;const e=kn();if(!(!e||!Ee))try{const n=await nl(),s=yg(Ee);for(const r of n){const i=St(Ee,"users",e.uid,"scenarios",r.id);r.id===t?s.update(i,{isActive:!0}):r.isActive&&s.update(i,{isActive:!1})}await s.commit()}catch(n){throw console.error("Error setting active scenario:",n),n}}async function Tg(){if(!De())return;const t=kn();if(!(!t||!Ee))try{const e=await nl(),n=yg(Ee);for(const s of e)n.delete(St(Ee,"users",t.uid,"scenarios",s.id));n.delete(St(Ee,"users",t.uid,"profile","settings")),await n.commit(),console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function Ig(){return De()?(await nl()).length>0:!1}const Sg={single:{minimum:14400,moderate:31300,comfortable:43100}},bc={essential:[{label:"Rent / mortgage",period:"mo",hint:"Your regular housing payment"},{label:"Council tax",period:"mo",hint:""},{label:"Gas",period:"mo",hint:""},{label:"Electricity",period:"mo",hint:""},{label:"Water",period:"mo",hint:""},{label:"Broadband",period:"mo",hint:"Broadband tariff"},{label:"Mobile phones",period:"mo",hint:"Mobile phone tariffs"},{label:"TV licence",period:"yr",hint:""},{label:"Groceries & household",period:"mo",hint:"Food and everyday household items"},{label:"Home insurance",period:"yr",hint:"Buildings & contents"},{label:"Car insurance",period:"yr",hint:""},{label:"Car tax",period:"yr",hint:"DVLA vehicle tax"},{label:"Petrol / fuel",period:"mo",hint:""},{label:"Car servicing & maintenance",period:"yr",hint:"Servicing, MOT, repairs — a big replacement is a One-off cost"},{label:"Boiler service",period:"yr",hint:""},{label:"Personal health",period:"mo",hint:"Prescriptions, dental, optical, health cover"},{label:"Kids / dependents",period:"mo",hint:"Supporting children or other dependents"},{label:"Premier banking / account fees",period:"mo",hint:"Packaged or premier account fees"},{label:"Home upkeep",period:"mo",hint:"Routine maintenance & small repairs — big jobs go in One-off costs"}],discretionary:[{label:"Main holiday",period:"yr",hint:"Your big annual holiday"},{label:"UK breaks",period:"yr",hint:"Weekends & short breaks"},{label:"Day trips",period:"mo",hint:""},{label:"Eating out & takeaways",period:"mo",hint:""},{label:"Streaming & entertainment",period:"mo",hint:"Netflix, Amazon Prime, etc."},{label:"Digital subscriptions",period:"mo",hint:"Cloud storage, AI tools, credit-file, TradingView, broker subscriptions"},{label:"Gym & fitness",period:"mo",hint:"Membership & classes"},{label:"Sports & equipment",period:"yr",hint:"Kit and gear"},{label:"Clothes",period:"mo",hint:"Everyday clothing"},{label:"Sports clothes",period:"yr",hint:""},{label:"Hobbies & leisure",period:"mo",hint:""},{label:"Gifts & family",period:"mo",hint:"Presents, helping family"},{label:"Charity",period:"mo",hint:""},{label:"Pets",period:"mo",hint:"Food, insurance, vet (pet health)"},{label:"Personal spending money",period:"mo",hint:"Day-to-day 'spends'"},{label:"Home furnishings & décor",period:"yr",hint:"Soft furnishings, decorating, furniture refresh"},{label:"Home technology",period:"yr",hint:"Phones, laptops, gadgets"},{label:"Emergency buffer",period:"mo",hint:"A monthly set-aside for the unexpected"}]},MI=[{label:"Eating out & takeaways",tier:"discretionary",period:"mo",hint:"Meals out, takeaways, coffees"},{label:"Life insurance / income protection",tier:"essential",period:"mo",hint:"Protection premiums"},{label:"Health / dental insurance",tier:"essential",period:"mo",hint:"Private medical, dental plan, cash plan"},{label:"Dental & optical",tier:"essential",period:"yr",hint:"Check-ups, glasses, treatment not on the NHS"},{label:"Hearing",tier:"essential",period:"yr",hint:"Hearing tests & aids"},{label:"Breakdown cover",tier:"essential",period:"yr",hint:"AA / RAC vehicle breakdown"},{label:"Parking & permits",tier:"essential",period:"yr",hint:"Residents permit, ULEZ / congestion"},{label:"Public transport",tier:"essential",period:"mo",hint:"Bus, rail, rail card"},{label:"Cleaner / gardener",tier:"essential",period:"mo",hint:"Cleaner, window cleaner, gardener"},{label:"Long-term care set-aside",tier:"essential",period:"mo",hint:"A monthly reserve toward possible later-life care (easily forgotten)"},{label:"Christmas & birthdays",tier:"discretionary",period:"yr",hint:"Seasonal gifts & celebrations"},{label:"Alcohol",tier:"discretionary",period:"mo",hint:"Beer, wine, spirits"},{label:"Hairdressing & grooming",tier:"discretionary",period:"mo",hint:"Haircuts, beauty, barber"},{label:"Newspapers, books & media",tier:"discretionary",period:"mo",hint:"Papers, magazines, books"},{label:"Grandchildren",tier:"discretionary",period:"mo",hint:"Treats, days out, help with costs"},{label:"Professional memberships",tier:"discretionary",period:"yr",hint:"Institutes, unions, clubs"},{label:"Second / holiday home",tier:"discretionary",period:"mo",hint:"Running costs of a second property"},{label:"Storage / lock-up",tier:"discretionary",period:"mo",hint:"Self-storage, garage rental"},{label:"My personal spending",tier:"discretionary",period:"mo",hint:"Your own day-to-day 'spends'",paidBy:"me"},{label:"Partner's personal spending",tier:"discretionary",period:"mo",hint:"Your partner's day-to-day 'spends'",paidBy:"partner"}];function Yi(t){const e=new Set((t.lines||[]).map(i=>(i.label||"").trim().toLowerCase()).filter(Boolean)),n=[...bc.essential.map(i=>({...i,tier:"essential"})),...bc.discretionary.map(i=>({...i,tier:"discretionary"}))],s=new Set,r=[];for(const i of[...MI,...n]){const o=i.label.trim().toLowerCase();e.has(o)||s.has(o)||(s.add(o),r.push(i))}return r}const DI=[{label:"New car",tier:"essential",hint:"Replacement vehicle",everyYears:8},{label:"Redecorating",tier:"essential",hint:"Whole-house repaint — a 4-bed runs ~£2,000–3,500 professionally, ~£300–600 DIY",everyYears:7},{label:"Major home work",tier:"essential",hint:"Kitchen, bathroom, roof, windows",everyYears:null},{label:"White goods",tier:"essential",hint:"Fridge, washer, cooker",everyYears:10}],BI={"Council tax":{minimum:{s:95,c:150},moderate:{s:115,c:170},comfortable:{s:125,c:185}},Gas:{minimum:{s:45,c:60},moderate:{s:58,c:75},comfortable:{s:68,c:90}},Electricity:{minimum:{s:55,c:70},moderate:{s:68,c:85},comfortable:{s:80,c:100}},Water:{minimum:{s:28,c:38},moderate:{s:33,c:44},comfortable:{s:38,c:50}},Broadband:{minimum:{s:27,c:27},moderate:{s:32,c:32},comfortable:{s:38,c:38}},"Mobile phones":{minimum:{s:8,c:16},moderate:{s:14,c:28},comfortable:{s:20,c:40}},"TV licence":{minimum:{s:15,c:15},moderate:{s:15,c:15},comfortable:{s:15,c:15}},"Groceries & household":{minimum:{s:230,c:350},moderate:{s:300,c:470},comfortable:{s:360,c:580}},"Home insurance":{minimum:{s:16,c:22},moderate:{s:22,c:30},comfortable:{s:28,c:38}},"Car insurance":{minimum:{s:0,c:0},moderate:{s:38,c:50},comfortable:{s:48,c:80}},"Car tax":{minimum:{s:0,c:0},moderate:{s:16,c:16},comfortable:{s:16,c:32}},"Petrol / fuel":{minimum:{s:0,c:0},moderate:{s:95,c:130},comfortable:{s:115,c:190}},"Car servicing & maintenance":{minimum:{s:0,c:0},moderate:{s:48,c:65},comfortable:{s:65,c:105}},"Boiler service":{minimum:{s:9,c:9},moderate:{s:11,c:11},comfortable:{s:13,c:13}},"Personal health":{minimum:{s:15,c:25},moderate:{s:32,c:55},comfortable:{s:58,c:95}},"Home upkeep":{minimum:{s:30,c:42},moderate:{s:52,c:75},comfortable:{s:85,c:120}},"Main holiday":{minimum:{s:42,c:65},moderate:{s:130,c:200},comfortable:{s:220,c:350}},"UK breaks":{minimum:{s:0,c:0},moderate:{s:38,c:60},comfortable:{s:75,c:115}},"Day trips":{minimum:{s:15,c:25},moderate:{s:32,c:48},comfortable:{s:52,c:80}},"Eating out & takeaways":{minimum:{s:42,c:70},moderate:{s:100,c:170},comfortable:{s:170,c:285}},"Streaming & entertainment":{minimum:{s:12,c:12},moderate:{s:26,c:32},comfortable:{s:42,c:48}},"Digital subscriptions":{minimum:{s:5,c:8},moderate:{s:13,c:20},comfortable:{s:26,c:38}},"Gym & fitness":{minimum:{s:15,c:26},moderate:{s:32,c:55},comfortable:{s:48,c:85}},"Sports & equipment":{minimum:{s:5,c:8},moderate:{s:13,c:22},comfortable:{s:26,c:42}},Clothes:{minimum:{s:48,c:80},moderate:{s:65,c:115},comfortable:{s:105,c:190}},"Sports clothes":{minimum:{s:3,c:5},moderate:{s:8,c:13},comfortable:{s:13,c:22}},"Hobbies & leisure":{minimum:{s:16,c:26},moderate:{s:37,c:58},comfortable:{s:62,c:100}},"Gifts & family":{minimum:{s:22,c:32},moderate:{s:58,c:90},comfortable:{s:95,c:150}},Charity:{minimum:{s:5,c:10},moderate:{s:16,c:27},comfortable:{s:32,c:55}},Pets:{minimum:{s:32,c:32},moderate:{s:42,c:42},comfortable:{s:58,c:58}},"Personal spending money":{minimum:{s:26,c:48},moderate:{s:52,c:95},comfortable:{s:95,c:170}},"Home furnishings & décor":{minimum:{s:16,c:26},moderate:{s:37,c:58},comfortable:{s:68,c:105}},"Home technology":{minimum:{s:10,c:16},moderate:{s:26,c:37},comfortable:{s:48,c:68}},Alcohol:{minimum:{s:16,c:42},moderate:{s:32,c:80},comfortable:{s:52,c:115}},"Hairdressing & grooming":{minimum:{s:13,c:19},moderate:{s:26,c:42},comfortable:{s:48,c:80}},"Newspapers, books & media":{minimum:{s:8,c:13},moderate:{s:19,c:30},comfortable:{s:32,c:48}},"Life insurance / income protection":{minimum:{s:20,c:24},moderate:{s:20,c:24},comfortable:{s:20,c:24}},"Health / dental insurance":{minimum:{s:0,c:0},moderate:{s:16,c:27},comfortable:{s:42,c:75}},"Dental & optical":{minimum:{s:10,c:16},moderate:{s:19,c:32},comfortable:{s:32,c:55}},"Public transport":{minimum:{s:42,c:75},moderate:{s:26,c:48},comfortable:{s:26,c:48}},"Christmas & birthdays":{minimum:{s:22,c:37},moderate:{s:48,c:75},comfortable:{s:85,c:125}},"My personal spending":{minimum:{s:26,c:26},moderate:{s:48,c:48},comfortable:{s:85,c:85}},"Partner's personal spending":{minimum:{s:0,c:26},moderate:{s:0,c:48},comfortable:{s:0,c:85}}},xg=Object.freeze({minimum:"PLSA Minimum",moderate:"PLSA Moderate",comfortable:"PLSA Comfortable"});let Ag=null;function LI(t){Ag=t||null}function wo(t){const e=t&&t.plsaTier;return e==="minimum"||e==="comfortable"?e:"moderate"}function Xr(t,e){const s=(Ag||BI)[(t||"").trim()];if(!s)return null;const r=s[wo(e)];return r?e&&e.sharedWithPartner?r.c:r.s:null}function kg(){const t=e=>bc[e].map(n=>({label:n.label,tier:e,annual:null,fromAge:null,toAge:null,hint:n.hint,period:n.period||"yr"}));return[...t("essential"),...t("discretionary")]}function Cg(){return DI.map(t=>({label:t.label,tier:t.tier,hint:t.hint,amount:null,atAge:null,everyYears:t.everyYears}))}const sa={pa:12570,brl:50270,hrl:125140},Ze=t=>Number.isFinite(+t)?+t:0;function NI(t,e){const n=t.fromAge??e.retirementAge,s=t.toAge??e.endAge;return{from:Ze(n),to:Ze(s)}}function Rg(t,e,n){const{from:s,to:r}=NI(t,e);return n>=s&&n<=r}function wc(t,e,n="all"){return(t.lines||[]).filter(s=>n==="all"||s.tier===n).filter(s=>Rg(s,t,e)).reduce((s,r)=>s+Ze(r.annual),0)}function Hd(t,e){if(!e||!e.sharedWithPartner)return 1;const n=t&&t.paidBy||"me";if(n==="partner")return 0;if(n==="shared"){const s=t&&t.mySharePct,r=s!=null&&s!==""&&Number.isFinite(+s)?+s:Number.isFinite(+e.mySharePct)?+e.mySharePct:50;return Math.max(0,Math.min(1,r/100))}return 1}function _c(t,e,n="all"){return(t.lines||[]).filter(s=>n==="all"||s.tier===n).filter(s=>Rg(s,t,e)).reduce((s,r)=>s+Ze(r.annual)*Hd(r,t),0)}function OI(t){return wc(t,Ze(t.retirementAge),"all")}function FI(t,e=t.currentAge,n=t.endAge){const s=[];for(const r of t.oneOffs||[]){const i=Ze(r.amount);if(i===0)continue;const o=Ze(r.everyYears);let l=Ze(r.atAge);if(o>0)for(;l<=n;l+=o)l>=e&&s.push({age:l,label:r.label,tier:r.tier,amount:i});else l>=e&&l<=n&&s.push({age:l,label:r.label,tier:r.tier,amount:i})}return s.sort((r,i)=>r.age-i.age)}function Gi(t,e=sa){const n=Ze(t),{pa:s,brl:r,hrl:i}=e;if(n<=s)return n;const o=r-.2*(r-s);if(n<=o)return s+(n-s)/.8;const l=o+.6*(i-r);return n<=l?r+(n-o)/.6:i+(n-l)/.55}function xf(t,e=!1){return(t.oneOffs||[]).reduce((n,s)=>{const r=Ze(s.amount),i=Ze(s.everyYears);return i>0&&r?n+r/i*(e?Hd(s,t):1):n},0)}function VI(t,e){const n=Ze(t.retirementAge),s=FI(t,n,n+e),r=[];for(let i=0;i<=e;i++){const o=n+i;let l=_c(t,o,"all");for(const c of s)if(c.age===o){const d=(t.oneOffs||[]).find(h=>h.label===c.label)||{};l+=c.amount*Hd(d,t)}r.push(l)}return r}function Zr(t){const e=Ze(t.retirementAge),n=_c(t,e,"essential"),s=_c(t,e,"all"),r=xf(t,!0),i=s+r,o=OI(t)+xf(t,!1),l=Math.max(0,o-i);return{partnerAllInAnnual:l,partnerAllInMonthly:l/12,essentialAnnualNet:n,comfortableAnnualNet:s,essentialMonthlyNet:n/12,comfortableMonthlyNet:s/12,periodicAnnualAverage:r,periodicMonthlyAverage:r/12,allInComfortableAnnual:i,allInComfortableMonthly:i/12,householdComfortableAnnual:o,householdComfortableMonthly:o/12,sharedWithPartner:!!t.sharedWithPartner,suggestedGrossAnnual:Gi(i)}}function sl(t){if(t==null)return null;const e=String(t).trim().replace(/^=/,"").replace(/[×x]/gi,"*").replace(/,/g,"");if(!e||!/^[\d+\-*/().\s]+$/.test(e)||!/\d/.test(e))return null;try{const n=Function('"use strict"; return ('+e+");")();return Number.isFinite(n)?Math.round(n*100)/100:null}catch{return null}}function Pg(t){return(t||[]).reduce((e,n)=>{const s=Ze(n&&n.amount);return s?e+((n.period||"yr")==="mo"?s*12:s):e},0)}function Mg(t,e,n){const s=Xr(t,n),r=Ze(e);if(s==null||s<=0||r<=0)return null;const i=s*12;return r<=i*.35?"low":r>=i*3?"high":null}function ji(t=45,e=60,n=100){return{version:1,currentAge:Ze(t),retirementAge:Ze(e),endAge:Ze(n),sharedWithPartner:!1,mySharePct:50,plsaTier:"moderate",lines:[],oneOffs:[]}}let Cr=null,be=null;function Ns(){return De()&&lt()}function Cn(){Cr=null,be=null}function Wd(){return{equityMin:me.EQUITY_MIN,bondMin:me.BOND_MIN,cashTarget:me.CASH_TARGET,duration:me.DURATION_YEARS,baseSalary:me.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Ts.PROTECTION_MULTIPLIER,consecutiveLimit:me.CONSECUTIVE_LIMIT,disableProtection:!1,recoveryBuffer:me.RECOVERY_BUFFER,hodlEnabled:Ts.HODL_ENABLED,hodlValue:Ts.HODL_VALUE,isaBalance:0,isaReturn:Nt.RETURN,isaMin:Nt.MIN,isaDrawdownStrategy:Nt.DRAWDOWN_STRATEGY}}function Yd(){return{equityMin:me.EQUITY_MIN,bondMin:me.BOND_MIN,cashTarget:me.CASH_TARGET,duration:me.DURATION_YEARS,baseSalary:me.BASE_SALARY,protectionFactor:me.PROTECTION_FACTOR,recoveryBuffer:me.RECOVERY_BUFFER,consecutiveLimit:me.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0,isaBalance:0,isaReturn:Nt.RETURN,isaMin:Nt.MIN,isaDrawdownStrategy:Nt.DRAWDOWN_STRATEGY}}function zI(t,e={},n=new Date().toISOString()){const s=t||{};return{...Wd(),...e,equityMin:s.equityMin,bondMin:s.bondMin,cashTarget:s.cashTarget,duration:s.duration,baseSalary:s.baseSalary,spStartDate:s.spStartDate??e.spStartDate??null,spWeeklyAmount:s.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:s.consecutiveLimit,recoveryBuffer:s.recoveryBuffer,disableProtection:s.disableProtection??e.disableProtection??!1,protectionMult:s.protectionFactor!=null?1-s.protectionFactor/100:e.protectionMult??Ts.PROTECTION_MULTIPLIER,isaBalance:s.isaBalance??0,isaReturn:s.isaReturn??Nt.RETURN,isaMin:s.isaMin??Nt.MIN,isaDrawdownStrategy:s.isaDrawdownStrategy??Nt.DRAWDOWN_STRATEGY,taggedFunds:(s.taggedFunds||[]).map(r=>({...r})),allocMode:s.allocMode??e.allocMode,subAsset:s.subAsset??null,diversifierStart:s.diversifierStart??0,glideEndgame:s.glideEndgame??null,equityGlideEnabled:s.equityGlideEnabled??!1,spendingProfile:s.spendingProfile??e.spendingProfile??"flat",accessMethod:s.accessMethod??e.accessMethod??"drawdown",ufplsYears:s.ufplsYears??e.ufplsYears??null,ufplsThenPcls:s.ufplsThenPcls??e.ufplsThenPcls??!1,bandFillRecycle:s.bandFillRecycle??e.bandFillRecycle??!1,seededFrom:"decision",seededAt:n,decisionChecksum:La(s)}}function UI(t,e={}){const n=t||{};return{...Yd(),...e,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,duration:n.duration,baseSalary:n.baseSalary,spStartDate:n.spStartDate??e.spStartDate??null,spWeeklyAmount:n.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:n.consecutiveLimit??e.consecutiveLimit,recoveryBuffer:n.recoveryBuffer??e.recoveryBuffer,disableProtection:n.disableProtection??e.disableProtection??!1,protectionFactor:n.protectionMult!=null?Math.round((1-n.protectionMult)*100):e.protectionFactor,isaBalance:n.isaBalance??0,isaReturn:n.isaReturn??Nt.RETURN,isaMin:n.isaMin??Nt.MIN,isaDrawdownStrategy:n.isaDrawdownStrategy??Nt.DRAWDOWN_STRATEGY,taggedFunds:(n.taggedFunds||[]).map(s=>({...s})),allocMode:n.allocMode??e.allocMode,subAsset:n.subAsset??null,diversifierStart:n.diversifierStart??0,glideEndgame:n.glideEndgame??null,equityGlideEnabled:n.equityGlideEnabled??!1,spendingProfile:n.spendingProfile??e.spendingProfile??"flat",accessMethod:n.accessMethod??e.accessMethod??"drawdown",ufplsYears:n.ufplsYears??e.ufplsYears??null,ufplsThenPcls:n.ufplsThenPcls??e.ufplsThenPcls??!1,bandFillRecycle:n.bandFillRecycle??e.bandFillRecycle??!1,configured:!0,seededFrom:"stress"}}function Dg(){return{}}function Bg(){return ji()}function $I(t="My Plan",e="",n=["stress","decision"]){return{planDetails:{name:t,description:e},enabledTools:n,isActive:!0,decisionTool:{settings:Yd(),history:[],taxYears:Dg()},stressTool:{settings:Wd()},budgetTool:{settings:Bg()}}}async function Gd(){if(Cr)return Cr;if(!Ns())return[];try{const t=await nl();return Cr=t,t}catch(t){return console.error("Error listing scenarios:",t),[]}}async function Rt(){if(be)return be;if(!Ns())return null;try{const e=(await Gd()).find(n=>n.isActive);return e?(be=e,e):null}catch(t){return console.error("Error getting active scenario:",t),null}}async function qI(t,e,n,s={},r=!0){if(!Ns())throw new Error("Must be logged in to create scenarios");const i=$I(t,e,n);if(s.stressSettings&&(i.stressTool.settings={...i.stressTool.settings,...s.stressSettings}),s.decisionSettings&&(i.decisionTool.settings={...i.decisionTool.settings,...s.decisionSettings}),s.taxYears&&(i.decisionTool.taxYears=s.taxYears),i.isActive=r,r&&Cr){const l=Cr.find(c=>c.isActive);l&&(await qd(null),await cs(l.id,{isActive:!1}))}const o=await Eg(i);return Cn(),o}async function HI(t){if(!Ns())throw new Error("Must be logged in to switch scenarios");await qd(t),Cn()}async function WI(t,e){if(!Ns())throw new Error("Must be logged in to duplicate scenarios");const n=await RI(t);if(!n)throw new Error("Source scenario not found");const{id:s,createdAt:r,lastModified:i,...o}=n;o.planDetails={...o.planDetails,name:e},o.isActive=!1;const l=await Eg(o);return Cn(),l}async function YI(t,e){if(!Ns())throw new Error("Must be logged in to rename scenarios");await cs(t,{"planDetails.name":e}),Cn()}async function GI(t,e){if(!Ns())throw new Error("Must be logged in to update scenarios");await cs(t,{enabledTools:e}),Cn()}async function jI(t){if(!Ns())throw new Error("Must be logged in to delete scenarios");const e=await Gd();if(e.length<=1)throw new Error("Cannot delete the last scenario");const n=e.find(s=>s.id===t);if(n!=null&&n.isActive){const s=e.find(r=>r.id!==t);s&&await qd(s.id)}await PI(t),Cn()}async function KI(){var e;const t=await Rt();return((e=t==null?void 0:t.stressTool)==null?void 0:e.settings)||Wd()}async function Lg(t){const e=await Rt();if(!e)throw new Error("No active scenario");await cs(e.id,{"stressTool.settings":t}),be&&(be.stressTool||(be.stressTool={}),be.stressTool.settings=t)}async function QI(){var e;const t=await Rt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.settings)||Yd()}async function JI(t){const e=await Rt();if(!e)throw new Error("No active scenario");await cs(e.id,{"decisionTool.settings":t}),be&&(be.decisionTool||(be.decisionTool={}),be.decisionTool.settings=t)}async function XI(){var e;const t=await Rt();return((e=t==null?void 0:t.budgetTool)==null?void 0:e.settings)||Bg()}async function ZI(t){const e=await Rt();if(!e)throw new Error("No active scenario");await cs(e.id,{"budgetTool.settings":t}),be&&(be.budgetTool||(be.budgetTool={}),be.budgetTool.settings=t)}async function eS(){var e;const t=await Rt();return((e=t==null?void 0:t.accumulationTool)==null?void 0:e.settings)||{}}async function tS(t){const e=await Rt();if(!e)throw new Error("No active scenario");await cs(e.id,{"accumulationTool.settings":t}),be&&(be.accumulationTool||(be.accumulationTool={}),be.accumulationTool.settings=t)}async function nS(){var e;const t=await Rt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.taxYears)||Dg()}async function sS(t){const e=await Rt();if(!e)throw new Error("No active scenario");await cs(e.id,{"decisionTool.taxYears":t}),be&&(be.decisionTool||(be.decisionTool={}),be.decisionTool.taxYears=t)}async function rS(){var e;const t=await Rt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.history)||[]}async function Ng(t){const e=await Rt();if(!e)throw new Error("No active scenario");await cs(e.id,{"decisionTool.history":t}),be&&(be.decisionTool||(be.decisionTool={}),be.decisionTool.history=t)}async function Og(){const t=await Rt();return(t==null?void 0:t.enabledTools)||["stress","decision"]}let ks=null;function ra(){return{settings:{equityMin:me.EQUITY_MIN,bondMin:me.BOND_MIN,cashTarget:me.CASH_TARGET,duration:me.DURATION_YEARS,equityGlideEnabled:!1,locked:!1,baseSalary:me.BASE_SALARY,spendingProfile:"flat",protectionFactor:me.PROTECTION_FACTOR,recoveryBuffer:me.RECOVERY_BUFFER,consecutiveLimit:me.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function rl(){return De()&&lt()}function Ms(){ks=null}function Fg(){return ks||ra()}async function Rn(){if(ks)return ks;if(!rl())return console.warn("Firebase not available - returning defaults"),ra();try{const[t,e,n]=await Promise.all([QI(),nS(),rS()]),s={settings:t||ra().settings,taxYears:e||{},history:n||[],lastModified:new Date().toISOString(),checksum:null};return s.checksum=Vg(s),ks=s,s}catch(t){console.error("Error loading decision data:",t)}return ra()}async function il(t){if(!rl())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=Vg(t),await Promise.all([JI(t.settings),sS(t.taxYears)]),ks=t}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function Vg(t){const e={settings:t.settings,taxYears:t.taxYears,historyCount:t.history.length,lastHistoryDate:t.history.length>0?t.history[t.history.length-1].date:null};return La(e)}function zg(t){if(!t)return"";const{locked:e,...n}=t;return La(n)}async function wt(){return(await Rn()).settings}async function or(t){const e=await Rn();e.settings={...e.settings,...t},await il(e)}function jd(){return{pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,cpi:Ba,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function iS(t){const n=Fg().taxYears[t];return n||jd()}async function ol(t){const n=(await Rn()).taxYears[t];return n||jd()}async function fr(t,e){console.log(`saveTaxYearConfig: Saving tax year ${t}`,e);const n=await Rn();n.taxYears[t]={...iS(t),...e},await il(n),console.log(`saveTaxYearConfig: Saved tax year ${t}, yearSetupComplete=${n.taxYears[t].yearSetupComplete}`)}async function oS(t){const e=ks||await Rn(),n=(e.history||[]).filter(r=>r.taxYear===t),s=n.reduce((r,i)=>r+(i.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${t}, found ${n.length} records, total ISA used: ${s}`),console.log("recalculateIsaSavingsUsed: History records:",n.map(r=>({date:r.date,isa:r.isa}))),e.taxYears[t]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${t}, creating default`),e.taxYears[t]=jd()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),e.taxYears[t].isaSavingsUsed=s,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),await il(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),s}async function aS(t){const e=await ol(t),n=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${t}, yearSetupComplete=${e.yearSetupComplete}, result=${n}`),n}async function ds(){return(await Rn()).taxYears}function lS(t={}){let n=[...Fg().history];return t.taxYear&&(n=n.filter(s=>s.taxYear===t.taxYear)),t.startDate&&(n=n.filter(s=>s.date>=t.startDate)),t.endDate&&(n=n.filter(s=>s.date<=t.endDate)),t.sortDesc?n.sort((s,r)=>r.date.localeCompare(s.date)):n.sort((s,r)=>s.date.localeCompare(r.date)),t.limit&&(n=n.slice(0,t.limit)),n}async function Os(t={}){return await Rn(),lS(t)}async function cS(t){if(!rl())throw new Error("Must be logged in to save history");const e=await Rn(),n=e.history.findIndex(s=>s.date===t.date);n>=0?e.history[n]=t:e.history.push(t),e.history.sort((s,r)=>s.date.localeCompare(r.date)),await Ng(e.history)}async function Ug(t){if(!rl())throw new Error("Must be logged in to delete history");const e=await Rn();e.history=e.history.filter(n=>n.date!==t),await Ng(e.history)}async function Kd(t){const e=await wt(),n=await ds(),s=e.spStartDate,r=e.spWeeklyAmount||0;if(!s||!r){let h=null;if(s){const{formatStatePensionDate:m}=await lh(async()=>{const{formatStatePensionDate:p}=await Promise.resolve().then(()=>Bf);return{formatStatePensionDate:p}},void 0,import.meta.url);h=m(s)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:h}}const{calculateStatePensionForTaxYear:i,getTimeUntilStatePension:o,parseStatePensionDate:l}=await lh(async()=>{const{calculateStatePensionForTaxYear:h,getTimeUntilStatePension:m,parseStatePensionDate:p}=await Promise.resolve().then(()=>Bf);return{calculateStatePensionForTaxYear:h,getTimeUntilStatePension:m,parseStatePensionDate:p}},void 0,import.meta.url),c=i({taxYear:t,spStartDate:s,weeklyAmount:r,taxYearConfigs:n}),d=o(s);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function dS(t){const e=u0(t);e.stdSipp=t.stdSipp||t.sippDraw;try{const n=await wt();e.settingsChecksum=zg(n)}catch(n){console.warn("Could not stamp settings checksum on decision:",n)}await cS(e),t.taxYear&&await oS(t.taxYear)}const Af={55:{m:[84,91,96],f:[87,93,97]},60:{m:[85,91,96],f:[87,93,97]},65:{m:[85,92,96],f:[88,93,98]},70:{m:[86,92,96],f:[88,94,98]},75:{m:[87,92,97],f:[89,94,98]}},uS={50:0,25:1,10:2};function hS(t,e="m",n=10){const s=uS[n]??2,r=e==="f"?"f":"m",i=Math.max(55,Math.min(75,t||65)),o=Math.floor(i/5)*5,l=Math.min(75,o+5),c=Af[o][r][s],d=Af[l][r][s],h=l===o?0:(i-o)/(l-o);return Math.round(c+(d-c)*h)}function Qn(t,e,n,s,r){if(r){const i=Math.max(0,1-e/n);return t*s*i}return t*s}const ns={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,cash:.25},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.4,cash:.1},adventurous:{key:"adventurous",label:"Adventurous",equity:.7,bond:.25,cash:.05}};function al(t,e,n){if(!t)return null;const s=Math.max(5,n-20),r=Math.min(1,e/s);return t.start+(t.end-t.start)*r}function _o(t,e,n=.22){const s=t+e;if(s<=0)return{start:0,end:0};const r=t/s;return{start:Math.max(0,r-n),end:r}}const fS=.12;function $g(t,e,n=null,s=fS){const r=t+e;if(r<=0)return{start:0,end:0};const i=t/r;let o;return n&&n.equityPct+n.bondPct>0?o=n.equityPct/(n.equityPct+n.bondPct):o=Math.min(1,i+s),{start:i,end:o}}function qg(t){const e=!!(t.subAsset&&t.subAsset.bondWeights&&Object.keys(t.subAsset.bondWeights).length>0),n=t.glideEndgame&&t.glideEndgame.equityPct+t.glideEndgame.bondPct>0?t.glideEndgame:null;return e?$g(t.equityMin,t.bondMin,n):_o(t.equityMin,t.bondMin)}function Ec(t,e,n){const s=t.cash,r=Math.max(0,1-s),i=al(t.equityGlide,e,n);return i==null?{equity:t.equity,bond:t.bond,cash:s}:{equity:r*i,bond:r*(1-i),cash:s}}function pS(t,e,n){const s=Qn(t.equityMin,e,t.duration,n,!0),r=Qn(t.bondMin,e,t.duration,n,!0),i=Qn(t.cashTarget,e,t.duration,n,!1);return{equity:s,bond:r,cash:i,totalGrowth:s+r,total:s+r+i}}function mS(t,e=Jf.ASSUMED_CPI){const n=[],s=t.equityGlideEnabled?_o(t.equityMin,t.bondMin):null;for(let r=0;r<=t.duration;r++){const i=Math.pow(1+e,r),o=pS(t,r,i);let l=o.equity,c=o.bond;if(s){const d=al(s,r,t.duration),h=l+c;l=h*d,c=h*(1-d)}n.push({year:r,cumulativeInflation:i,equityMin:l,bondMin:c,cashTarget:o.cash,totalMin:l+c+o.cash})}return n}function ia(t,e,n,s=Xe.HIGHER_RATE_LIMIT){if(t<=0)return 0;let r=e;if(t>Xe.PA_TAPER_THRESHOLD){const h=(t-Xe.PA_TAPER_THRESHOLD)*Xe.PA_TAPER_RATE;r=Math.max(0,e-h)}const i=Math.max(0,t-r),o=Math.max(0,n-r),l=s-n;let c=0;const d=Math.min(i,o);if(c+=d*Xe.BASIC_RATE,i>o){const h=Math.min(i-o,l);c+=h*Xe.HIGHER_RATE}if(i>o+l){const h=i-o-l;c+=h*Xe.ADDITIONAL_RATE}return c}function Yt(t,e,n,s=Xe.HIGHER_RATE_LIMIT){return t-ia(t,e,n,s)}function gS(t,e,n,s=Xe.HIGHER_RATE_LIMIT){if(t<=0)return 0;let r=t,i=t+1;for(;Yt(i,e,n,s)<t&&i<1e12;)i*=2;for(let o=0;o<60;o++){const l=(r+i)/2;Yt(l,e,n,s)<t?r=l:i=l}return(r+i)/2}const Gl={TAX_EFFICIENT:"minimiseEarlyTax",LONGEVITY:"maximiseLongevity"};function yS(t,e){return t<=0?t:t*Math.pow(1+e,1/12)}function Aa({targetGross:t,fixedIncome:e=0,pa:n,brl:s,hrl:r,isaBalance:i=0,strategy:o=Gl.TAX_EFFICIENT,yearsUntilSp:l=0,taxFreeFraction:c=0}){const d=Math.max(0,Math.min(.75,c||0));if(d===0){const E=Yt(t,n,s,r),x=Math.max(0,Math.min(s,t)-e),y=Yt(x+e,n,s,r),te=Math.max(0,E-y),oe=o===Gl.LONGEVITY&&l>0?i/l:1/0,q=Math.max(0,Math.min(te,Math.max(0,i),oe)),ne=i-q,se=te-q;let ae=x;if(se>0){const ie=gS(y+se,n,s,r);ae=Math.max(x,ie-e)}const we=ae+e,Ie=Yt(we,n,s,r);return{sippGross:ae,isaDraw:q,remainingIsa:ne,taxable:we,tax:we-Ie,net:Ie+q,taxFree:0}}const h=Yt(t,n,s,r),m=Yt(e,n,s,r),p=E=>E*d/(1-d)+Yt(e+E,n,s,r)-m,w=E=>{if(E<=0)return 0;let x=0,y=Math.max(1e3,E*(1-d)*1.5);for(;p(y)<E&&y<1e12;)y*=2;for(let te=0;te<80;te++){const oe=(x+y)/2;p(oe)<E?x=oe:y=oe}return(x+y)/2},T=Math.max(0,s-e),S=w(Math.max(0,h-m)),A=Math.min(T,S),P=m+p(A),C=Math.max(0,h-P),L=o===Gl.LONGEVITY&&l>0?i/l:1/0,D=Math.max(0,Math.min(C,Math.max(0,i),L)),O=i-D,$=C-D;let I=A;$>0&&(I=w(Math.max(0,h-m-D)));const v=I/(1-d),_=I+e,b=Yt(_,n,s,r);return{sippGross:v,isaDraw:D,remainingIsa:O,taxable:_,tax:_-b,net:b+v*d+D,taxFree:v*d}}const ka={CONSECUTIVE_LIMIT:3,RECOVERY_BUFFER:me.RECOVERY_BUFFER};function Hg({totalGrowth:t,minGrowth:e,consecCashDraws:n,wasInProtection:s,consecutiveLimit:r=ka.CONSECUTIVE_LIMIT,recoveryBuffer:i=ka.RECOVERY_BUFFER}){let o=!1;return s&&(o=t<=e+i),!o&&t<e&&n+1>=r&&(o=!0),o}const Rr={MAX_FRACTION:.5,MIN_BOOST:50,SURPLUS_BUFFER:15e3};function oa({shortfall:t,standardMonthly:e,remainingMonths:n,surplus:s,brlHeadroom:r=1/0,maxFraction:i=Rr.MAX_FRACTION,minBoost:o=Rr.MIN_BOOST}){if(!(t>0)||!(s>0)||n<1)return 0;const l=[t/n,s/n];if(Number.isFinite(r)){if(r<=0)return 0;l.push(r/n)}l.push(e*i);const c=Math.min(...l);return c>o?c:0}const Qd={ISA_ANNUAL_ALLOWANCE:2e4,MIN_RECYCLE:50};function Wg({brlHeadroom:t,remainingMonths:e,isaAllowanceLeft:n,basicRate:s=.2}){if(!(t>0)||!(e>=1)||!(n>0))return{gross:0,net:0};let r=t/e,i=r*(1-s);const o=n/e;return i>o&&(i=o,r=i/(1-s)),i<Qd.MIN_RECYCLE?{gross:0,net:0}:{gross:r,net:i}}const vS=[[{ticker:"ATST",name:"Alliance Trust",subClass:"worldGrowth"},{ticker:"ATT",name:"Allianz Technology Trust",subClass:"worldGrowth"},{ticker:"BGFD",name:"Baillie Gifford Japan Trust",subClass:"worldGrowth"},{ticker:"BNKR",name:"Bankers Investment Trust",subClass:"worldGrowth"},{ticker:"BUT",name:"Brunner Investment Trust",subClass:"worldGrowth"},{ticker:"CLDN",name:"Caledonia Investments",subClass:"worldGrowth"},{ticker:"CSP1",name:"iShares Core S&P 500 (Acc)",subClass:"worldGrowth"},{ticker:"CUKX",name:"iShares Core FTSE 100 (Acc)",subClass:"ukEquityIncome"},{ticker:"EQQQ",name:"Invesco Nasdaq-100",subClass:"worldGrowth"},{ticker:"FCIT",name:"F&C Investment Trust",subClass:"worldGrowth"},{ticker:"FWRA",name:"Invesco FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"FWRG",name:"Invesco FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"GSPX",name:"iShares S&P 500 GBP-Hedged",subClass:"worldGrowth"},{ticker:"HGT",name:"HgCapital Trust",subClass:"worldGrowth"},{ticker:"HMWO",name:"HSBC MSCI World",subClass:"worldGrowth"},{ticker:"HVPE",name:"HarbourVest Global Private Equity",subClass:"worldGrowth"},{ticker:"IBT",name:"International Biotechnology Trust",subClass:"worldGrowth"},{ticker:"IITU",name:"iShares S&P 500 Information Technology",subClass:"worldGrowth"},{ticker:"IMEU",name:"iShares Core MSCI Europe",subClass:"worldGrowth"},{ticker:"INRG",name:"iShares Global Clean Energy",subClass:"worldGrowth"},{ticker:"ISAC",name:"iShares MSCI ACWI (Acc)",subClass:"worldGrowth"},{ticker:"IUHC",name:"iShares S&P 500 Health Care",subClass:"worldGrowth"},{ticker:"IUSA",name:"iShares Core S&P 500 (Dist)",subClass:"worldGrowth"},{ticker:"IWDA",name:"iShares Core MSCI World (Acc, USD line)",subClass:"worldGrowth"},{ticker:"IWDG",name:"iShares Core MSCI World GBP-Hedged",subClass:"worldGrowth"},{ticker:"IJPN",name:"iShares MSCI Japan",subClass:"worldGrowth"},{ticker:"JAM",name:"JPMorgan American Investment Trust",subClass:"worldGrowth"},{ticker:"LCWL",name:"Amundi (Lyxor) Core MSCI World",subClass:"worldGrowth"},{ticker:"MNKS",name:"Monks Investment Trust",subClass:"worldGrowth"},{ticker:"MWY",name:"Mid Wynd International",subClass:"worldGrowth"},{ticker:"PACW",name:"Amundi Prime All Country World",subClass:"worldGrowth"},{ticker:"PCT",name:"Polar Capital Technology Trust",subClass:"worldGrowth"},{ticker:"PIN",name:"Pantheon International",subClass:"worldGrowth"},{ticker:"RCP",name:"RIT Capital Partners",subClass:"worldGrowth"},{ticker:"SJG",name:"Schroder Japan Trust",subClass:"worldGrowth"},{ticker:"SMT",name:"Scottish Mortgage Investment Trust",subClass:"worldGrowth"},{ticker:"SSAC",name:"iShares MSCI ACWI",subClass:"worldGrowth"},{ticker:"SWDA",name:"iShares Core MSCI World",subClass:"worldGrowth"},{ticker:"SWLD",name:"SPDR MSCI World",subClass:"worldGrowth"},{ticker:"VAPX",name:"Vanguard FTSE Dev Asia Pacific ex-Japan",subClass:"worldGrowth"},{ticker:"VERX",name:"Vanguard FTSE Developed Europe ex-UK",subClass:"worldGrowth"},{ticker:"VEUR",name:"Vanguard FTSE Developed Europe",subClass:"worldGrowth"},{ticker:"VEVE",name:"Vanguard FTSE Developed World (Dist)",subClass:"worldGrowth"},{ticker:"VHVG",name:"Vanguard FTSE Developed World (Acc)",subClass:"worldGrowth"},{ticker:"VJPN",name:"Vanguard FTSE Japan",subClass:"worldGrowth"},{ticker:"VNRT",name:"Vanguard FTSE North America",subClass:"worldGrowth"},{ticker:"VUAG",name:"Vanguard S&P 500 (Acc)",subClass:"worldGrowth"},{ticker:"VUSA",name:"Vanguard S&P 500 (Dist)",subClass:"worldGrowth"},{ticker:"VWRL",name:"Vanguard FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"VWRP",name:"Vanguard FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"WTAN",name:"Witan Investment Trust",subClass:"worldGrowth"},{ticker:"WWH",name:"Worldwide Healthcare Trust",subClass:"worldGrowth"}],[{ticker:"3IN",name:"3i Infrastructure",subClass:"ukEquityIncome"},{ticker:"AEI",name:"abrdn Equity Income Trust",subClass:"ukEquityIncome"},{ticker:"BBGI",name:"BBGI Global Infrastructure",subClass:"ukEquityIncome"},{ticker:"BSIF",name:"Bluefield Solar Income Fund",subClass:"ukEquityIncome"},{ticker:"CTY",name:"City of London Investment Trust",subClass:"ukEquityIncome"},{ticker:"DIG",name:"Dunedin Income Growth",subClass:"ukEquityIncome"},{ticker:"EDIN",name:"Edinburgh Investment Trust",subClass:"ukEquityIncome"},{ticker:"FGT",name:"Finsbury Growth & Income Trust",subClass:"ukEquityIncome"},{ticker:"FSFL",name:"Foresight Solar Fund",subClass:"ukEquityIncome"},{ticker:"FTAL",name:"SPDR FTSE UK All Share",subClass:"ukEquityIncome"},{ticker:"GRID",name:"Gresham House Energy Storage",subClass:"ukEquityIncome"},{ticker:"GSF",name:"Gore Street Energy Storage",subClass:"ukEquityIncome"},{ticker:"HHI",name:"Henderson High Income Trust",subClass:"ukEquityIncome"},{ticker:"HICL",name:"HICL Infrastructure",subClass:"ukEquityIncome"},{ticker:"HUKX",name:"HSBC FTSE 100",subClass:"ukEquityIncome"},{ticker:"INPP",name:"International Public Partnerships",subClass:"ukEquityIncome"},{ticker:"ISF",name:"iShares Core FTSE 100 (Dist)",subClass:"ukEquityIncome"},{ticker:"IUKD",name:"iShares UK Dividend",subClass:"ukEquityIncome"},{ticker:"JCH",name:"JPMorgan Claverhouse",subClass:"ukEquityIncome"},{ticker:"JLEN",name:"JLEN Environmental Assets",subClass:"ukEquityIncome"},{ticker:"LWDB",name:"Law Debenture Corporation",subClass:"ukEquityIncome"},{ticker:"MRCH",name:"Merchants Trust",subClass:"ukEquityIncome"},{ticker:"MUT",name:"Murray Income Trust",subClass:"ukEquityIncome"},{ticker:"NESF",name:"NextEnergy Solar Fund",subClass:"ukEquityIncome"},{ticker:"ORIT",name:"Octopus Renewables Infrastructure",subClass:"ukEquityIncome"},{ticker:"SEIT",name:"SDCL Energy Efficiency Income",subClass:"ukEquityIncome"},{ticker:"SHRS",name:"Shires Income",subClass:"ukEquityIncome"},{ticker:"TIGT",name:"Troy Income & Growth Trust",subClass:"ukEquityIncome"},{ticker:"TMPL",name:"Temple Bar Investment Trust",subClass:"ukEquityIncome"},{ticker:"TRIG",name:"The Renewables Infrastructure Group",subClass:"ukEquityIncome"},{ticker:"UKDV",name:"SPDR UK Dividend Aristocrats",subClass:"ukEquityIncome"},{ticker:"UKW",name:"Greencoat UK Wind",subClass:"ukEquityIncome"},{ticker:"VMID",name:"Vanguard FTSE 250",subClass:"ukEquityIncome"},{ticker:"VUKE",name:"Vanguard FTSE 100",subClass:"ukEquityIncome"}],[{ticker:"GBDV",name:"SPDR Global Dividend Aristocrats",subClass:"globalEquityIncome"},{ticker:"HFEL",name:"Henderson Far East Income",subClass:"globalEquityIncome"},{ticker:"IAPD",name:"iShares Asia Pacific Dividend",subClass:"globalEquityIncome"},{ticker:"IDVY",name:"iShares Euro Dividend",subClass:"globalEquityIncome"},{ticker:"JGGI",name:"JPMorgan Global Growth & Income",subClass:"globalEquityIncome"},{ticker:"MYI",name:"Murray International Trust",subClass:"globalEquityIncome"},{ticker:"SAIN",name:"Scottish American Investment Co",subClass:"globalEquityIncome"},{ticker:"STS",name:"STS Global Income & Growth (Troy)",subClass:"globalEquityIncome"},{ticker:"USDV",name:"SPDR US Dividend Aristocrats",subClass:"globalEquityIncome"},{ticker:"VHYL",name:"Vanguard FTSE All-World High Div Yield",subClass:"globalEquityIncome"}],[{ticker:"BBOX",name:"Tritax Big Box REIT",subClass:"reit"},{ticker:"BLND",name:"British Land",subClass:"reit"},{ticker:"BYG",name:"Big Yellow Group",subClass:"reit"},{ticker:"DLN",name:"Derwent London",subClass:"reit"},{ticker:"IHR",name:"Impact Healthcare REIT",subClass:"reit"},{ticker:"IUKP",name:"iShares UK Property",subClass:"reit"},{ticker:"IWDP",name:"iShares Developed Markets Property Yield",subClass:"reit"},{ticker:"LAND",name:"Land Securities (Landsec)",subClass:"reit"},{ticker:"LMP",name:"LondonMetric Property",subClass:"reit"},{ticker:"PHP",name:"Primary Health Properties",subClass:"reit"},{ticker:"SAFE",name:"Safestore Holdings",subClass:"reit"},{ticker:"SGRO",name:"Segro",subClass:"reit"},{ticker:"SHED",name:"Urban Logistics REIT",subClass:"reit"},{ticker:"SRE",name:"Sirius Real Estate",subClass:"reit"},{ticker:"SUPR",name:"Supermarket Income REIT",subClass:"reit"},{ticker:"THRL",name:"Target Healthcare REIT",subClass:"reit"},{ticker:"TRY",name:"TR Property Investment Trust",subClass:"reit"},{ticker:"UTG",name:"Unite Group",subClass:"reit"},{ticker:"WHR",name:"Warehouse REIT",subClass:"reit"}],[{ticker:"AAS",name:"abrdn Asia Focus",subClass:"emEquity"},{ticker:"EMIM",name:"iShares Core MSCI EM IMI",subClass:"emEquity"},{ticker:"FCSS",name:"Fidelity China Special Situations",subClass:"emEquity"},{ticker:"FEML",name:"Fidelity Emerging Markets Limited",subClass:"emEquity"},{ticker:"HMEF",name:"HSBC MSCI Emerging Markets",subClass:"emEquity"},{ticker:"JII",name:"JPMorgan Indian Investment Trust",subClass:"emEquity"},{ticker:"JMG",name:"JPMorgan Emerging Markets",subClass:"emEquity"},{ticker:"SEMA",name:"SPDR MSCI Emerging Markets",subClass:"emEquity"},{ticker:"TEM",name:"Templeton Emerging Markets",subClass:"emEquity"},{ticker:"VEIL",name:"Vietnam Enterprise Investments",subClass:"emEquity"},{ticker:"VFEG",name:"Vanguard FTSE Emerging Markets (Acc)",subClass:"emEquity"},{ticker:"VFEM",name:"Vanguard FTSE Emerging Markets (Dist)",subClass:"emEquity"},{ticker:"VOF",name:"VinaCapital Vietnam Opportunity",subClass:"emEquity"}],[{ticker:"ASL",name:"Aberforth Smaller Companies",subClass:"globalSmallCap"},{ticker:"BRSC",name:"BlackRock Smaller Companies",subClass:"globalSmallCap"},{ticker:"EWI",name:"Edinburgh Worldwide",subClass:"globalSmallCap"},{ticker:"HSL",name:"Henderson Smaller Companies",subClass:"globalSmallCap"},{ticker:"ISP6",name:"iShares S&P SmallCap 600",subClass:"globalSmallCap"},{ticker:"MTU",name:"Montanaro UK Smaller Companies",subClass:"globalSmallCap"},{ticker:"SSON",name:"Smithson Investment Trust",subClass:"globalSmallCap"},{ticker:"THRG",name:"BlackRock Throgmorton Trust",subClass:"globalSmallCap"},{ticker:"USSC",name:"SPDR MSCI USA Small Cap Value Weighted",subClass:"globalSmallCap"},{ticker:"WLDS",name:"iShares MSCI World Small Cap",subClass:"globalSmallCap"},{ticker:"WOSC",name:"SPDR MSCI World Small Cap",subClass:"globalSmallCap"}],[{ticker:"AGBP",name:"iShares Core Global Agg GBP-Hedged",subClass:"globalAggHedged"},{ticker:"GLTL",name:"SPDR Bloomberg 15+ Year Gilt",subClass:"longGilts"},{ticker:"GLTS",name:"SPDR Bloomberg 1-5 Year Gilt",subClass:"shortGilts"},{ticker:"IBTL",name:"iShares $ Treasury 20+yr",subClass:"usTreasHedged"},{ticker:"IBTM",name:"iShares $ Treasury 7-10yr",subClass:"usTreasHedged"},{ticker:"IBTS",name:"iShares $ Treasury 1-3yr",subClass:"usTreasHedged"},{ticker:"IDTG",name:"iShares $ Treasury 7-10yr GBP-Hedged",subClass:"usTreasHedged"},{ticker:"IGLS",name:"iShares UK Gilts 0-5yr",subClass:"shortGilts"},{ticker:"IGLT",name:"iShares Core UK Gilts",subClass:"longGilts"},{ticker:"INXG",name:"iShares £ Index-Linked Gilts",subClass:"indexLinked"},{ticker:"IS15",name:"iShares £ Corp Bond 0-5yr",subClass:"corporateIG"},{ticker:"ITPS",name:"iShares $ TIPS",subClass:"indexLinked"},{ticker:"SLXX",name:"iShares Core £ Corp Bond",subClass:"corporateIG"},{ticker:"TI5G",name:"iShares $ TIPS 0-5 (GBP-Hedged)",subClass:"indexLinked"},{ticker:"VAGP",name:"Vanguard Global Aggregate (GBP-Hedged, Dist)",subClass:"globalAggHedged"},{ticker:"VAGS",name:"Vanguard Global Aggregate (GBP-Hedged, Acc)",subClass:"globalAggHedged"},{ticker:"VGOV",name:"Vanguard UK Gilt",subClass:"longGilts"},{ticker:"VUTY",name:"Vanguard USD Treasury Bond",subClass:"usTreasHedged"}],[{ticker:"BIPS",name:"Invesco Bond Income Plus",subClass:"highYield"},{ticker:"GHYS",name:"iShares Global High Yield GBP-Hedged",subClass:"highYield"},{ticker:"IHYG",name:"iShares € High Yield Corp Bond",subClass:"highYield"},{ticker:"IHYU",name:"iShares $ High Yield Corp Bond",subClass:"highYield"},{ticker:"NCYF",name:"CQS New City High Yield",subClass:"highYield"}],[{ticker:"GCP",name:"GCP Infrastructure Investments",subClass:"infraDebt"},{ticker:"SEQI",name:"Sequoia Economic Infrastructure",subClass:"infraDebt"}],[{ticker:"CSH2",name:"Amundi Smart Overnight Return",subClass:"moneyMarket"},{ticker:"ERNS",name:"iShares £ Ultrashort Bond",subClass:"moneyMarket"},{ticker:"XSTR",name:"Xtrackers II Sterling Overnight Rate",subClass:"moneyMarket"}],[{ticker:"PHAU",name:"WisdomTree Physical Gold (USD)",subClass:"gold"},{ticker:"PHGP",name:"WisdomTree Physical Gold (GBP)",subClass:"gold"},{ticker:"RMAU",name:"Royal Mint Physical Gold",subClass:"gold"},{ticker:"SGLD",name:"Invesco Physical Gold",subClass:"gold"},{ticker:"SGLN",name:"iShares Physical Gold",subClass:"gold"}],[{ticker:"BHMG",name:"BH Macro",subClass:"trendMacro"},{ticker:"CGT",name:"Capital Gearing Trust",subClass:"trendMacro"},{ticker:"PNL",name:"Personal Assets Trust",subClass:"trendMacro"},{ticker:"RICA",name:"Ruffer Investment Company",subClass:"trendMacro"}],[{ticker:"AIGC",name:"WisdomTree Broad Commodities",subClass:"commodities"},{ticker:"BRNT",name:"WisdomTree Brent Crude Oil",subClass:"commodities"},{ticker:"CMOD",name:"Invesco Bloomberg Commodity",subClass:"commodities"},{ticker:"COPA",name:"WisdomTree Copper",subClass:"commodities"},{ticker:"CRUD",name:"WisdomTree WTI Crude Oil",subClass:"commodities"},{ticker:"PHSP",name:"WisdomTree Physical Silver (GBP)",subClass:"commodities"},{ticker:"WCOA",name:"WisdomTree Enhanced Commodity (USD)",subClass:"commodities"}]],Jd=Object.freeze(vS.flat().sort((t,e)=>t.ticker.localeCompare(e.ticker))),ye=Object.freeze({SHARES:"shares",BONDS:"bonds",DIVERSIFIERS:"diversifiers",CASH:"cash"}),Ot={ukEquityIncome:{bucket:ye.SHARES,label:"UK equity income",nominalReturn:.068,yield:.04,vol:.16,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.07},globalEquityIncome:{bucket:ye.SHARES,label:"Global equity income",nominalReturn:.07,yield:.03,vol:.16,eqCorr:.95,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.05},worldGrowth:{bucket:ye.SHARES,label:"World growth / tracker",nominalReturn:.07,yield:.02,vol:.17,eqCorr:1,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},reit:{bucket:ye.SHARES,label:"Property / REITs",nominalReturn:.065,yield:.045,vol:.19,eqCorr:.65,duration:4,inflationBeta:.3,creditBeta:.2,crisisBeta:0,idioVol:.13,note:"listed property: equity-like with rate sensitivity; rents partly inflation-linked"},emEquity:{bucket:ye.SHARES,label:"Emerging-markets equity",nominalReturn:.075,yield:.028,vol:.22,eqCorr:.8,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.13},globalSmallCap:{bucket:ye.SHARES,label:"Global smaller companies",nominalReturn:.075,yield:.018,vol:.2,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.09},shortGilts:{bucket:ye.BONDS,label:"Short gilts 0-5y (buffer)",nominalReturn:.043,yield:.043,vol:.026,eqCorr:.1,duration:2.5,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.01},longGilts:{bucket:ye.BONDS,label:"Long gilts 15y+",nominalReturn:.064,yield:.055,vol:.108,eqCorr:.2,duration:15,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.02},indexLinked:{bucket:ye.BONDS,label:"Index-linked gilts (long)",nominalReturn:.047,yieldReal:.023,vol:.1,eqCorr:.33,duration:15,inflationBeta:1,creditBeta:0,crisisBeta:0,idioVol:.03,realYield:!0},corporateIG:{bucket:ye.BONDS,label:"£ IG corporate",nominalReturn:.053,yield:.052,vol:.065,eqCorr:.41,duration:6.5,inflationBeta:0,creditBeta:.4,crisisBeta:0,idioVol:.03},globalAggHedged:{bucket:ye.BONDS,label:"Global-agg £-hedged",nominalReturn:.045,yield:.045,vol:.053,eqCorr:.3,duration:6,inflationBeta:0,creditBeta:.2,crisisBeta:0,idioVol:.02},usTreasHedged:{bucket:ye.BONDS,label:"US treasuries £-hedged",nominalReturn:.04,yield:.04,vol:.068,eqCorr:.1,duration:7,inflationBeta:0,creditBeta:0,crisisBeta:.15,idioVol:.02},infraDebt:{bucket:ye.BONDS,label:"Infrastructure debt",nominalReturn:.064,yield:.06,vol:.07,eqCorr:.3,duration:8,inflationBeta:.3,creditBeta:.3,crisisBeta:0,idioVol:.03,note:"IG + ~115bps illiquidity premium"},highYield:{bucket:ye.BONDS,label:"Global high-yield (£-hedged)",nominalReturn:.058,yield:.065,vol:.1,eqCorr:.6,duration:3.5,inflationBeta:0,creditBeta:.8,crisisBeta:0,idioVol:.05,note:"credit carry net of defaults; spreads blow out with equities in a crash"},moneyMarket:{bucket:ye.CASH,label:"Money-market fund",nominalReturn:.034,yield:.034,vol:.002,eqCorr:0,duration:.1,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0,note:"FCA -1% real; = engine cash model"},savings:{bucket:ye.CASH,label:"Savings / NS&I",nominalReturn:.034,yield:.034,vol:.001,eqCorr:0,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},gold:{bucket:ye.DIVERSIFIERS,label:"Gold",nominalReturn:.055,yield:0,vol:.155,eqCorr:.05,duration:0,inflationBeta:.3,creditBeta:0,crisisBeta:.5,idioVol:.14,note:"near-uncorrelated; rises when stocks AND bonds fall (2022)"},trendMacro:{bucket:ye.DIVERSIFIERS,label:"Trend / macro",nominalReturn:.045,yield:0,vol:.12,eqCorr:.07,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,momentumBeta:.6,idioVol:.1,note:"lagged path-momentum; pays in prolonged 2008/2022, whipsaws in V-shaped 2020"},commodities:{bucket:ye.DIVERSIFIERS,label:"Broad commodities",nominalReturn:.045,yield:0,vol:.16,eqCorr:.25,duration:0,inflationBeta:.8,creditBeta:0,crisisBeta:0,idioVol:.14,note:"the strongest inflation hedge (2022); long flat stretches otherwise; crashes WITH equities in a demand shock (2008)"}},Xd=Object.freeze(JSON.parse(JSON.stringify(Ot))),kf=Object.freeze(["nominalReturn","yield","yieldReal","vol","eqCorr","duration","inflationBeta","creditBeta","crisisBeta","momentumBeta","idioVol"]);function Yg(t){for(const[e,n]of Object.entries(Xd)){const s=Ot[e];for(const i of kf)n[i]!==void 0?s[i]=n[i]:delete s[i];const r=t&&t[e];if(r)for(const i of kf)r[i]!==void 0&&Number.isFinite(+r[i])&&(s[i]=+r[i])}}const bS=Jd,Gg=Object.freeze(Object.fromEntries(bS.map(t=>[t.ticker,t.subClass])));function jg(){const t={};for(const[e,n]of Object.entries(Ot))(t[n.bucket]=t[n.bucket]||[]).push({key:e,label:n.label});return t}const wS=.036,_S=.4,ES=.005,TS=.35,Kg=.01,Zd=-.15,Qg=.045;function Cf(t,e=.1){let n=wS+_S*t;return e<Zd&&t<Qg&&(n-=Kg),n}function Rf(t,e=.1){let n=ES+TS*(t-.025);return e<Zd&&t<Qg&&(n-=Kg),n}function IS(t){return t.inf>.045?"inflation":t.eqReturn<Zd?"crash":"normal"}const SS=Object.freeze({shortGilts:{normal:.05,inflation:.3,crash:-.2},longGilts:{normal:.1,inflation:.45,crash:-.35},indexLinked:{normal:.15,inflation:.35,crash:-.15},corporateIG:{normal:.35,inflation:.45,crash:.55},globalAggHedged:{normal:.25,inflation:.4,crash:.1},usTreasHedged:{normal:.05,inflation:.25,crash:-.4},infraDebt:{normal:.3,inflation:.35,crash:.35},gold:{normal:0,inflation:-.05,crash:-.2},trendMacro:{normal:.05,inflation:-.1,crash:-.3},highYield:{normal:.5,inflation:.55,crash:.6},commodities:{normal:.2,inflation:-.1,crash:.4}});function ll(t,e){const n=SS[t];if(!n)return 0;const s=n[IS(e)];return s??n.normal}const xS=new Map(Object.entries(Ot).map(([t,e])=>[e,t]));function cl(t,e,n,s){if(!t)return 0;const r=(n-.1)/.17,i=wr(0,1,s),o=e*r+Math.sqrt(Math.max(0,1-e*e))*i;return t*o}function AS(t,e,n){const{inf:s,prevInf:r,eqReturn:i,prevEqReturn:o=.1}=e,l=!!t.realYield,c=t.duration||0,d=l?Rf(s,i)-Rf(r,o):Cf(s,i)-Cf(r,o),h=l?(t.yieldReal||0)+s:t.yield||0,m=-c*d,p=l?0:(t.inflationBeta||0)*(s-.025),w=cl(t.idioVol||0,ll(xS.get(t),e),i,n);return h+m+p+w}const kS=Object.freeze({shortGilts:.3,longGilts:.2,indexLinked:.2,corporateIG:.3});function Pf(t,e,n=kS){let s=0;for(const r of Object.keys(n)){const i=n[r];if(!i)continue;const o=Ot[r];o&&(s+=i*AS(o,t,e))}return s}const CS=.048,RS=.045;function PS(t,e){const{inf:n,eqReturn:s}=t,r=Ot.gold,i=(r.inflationBeta||0)*(n-.025),o=cl(r.idioVol||0,ll("gold",t),s,e);return CS+i+o}function MS(t,e,n){const s=Ot.trendMacro,r=t.eqReturn-.05,i=(s.momentumBeta||0)*n*r,o=cl(s.idioVol||0,ll("trendMacro",t),t.eqReturn,e);return RS+i+o}const Mf=.6,DS=.15;function BS(t,e){return Mf*t+(1-Mf)*e}function LS(t){return Math.max(-1,Math.min(1,t/DS))}const NS=.035;function OS(t,e){const{inf:n}=t,s=Ot.commodities,r=(s.inflationBeta||0)*(n-.025),i=cl(s.idioVol||0,ll("commodities",t),t.eqReturn,e);return NS+r+i}const FS=Object.freeze({gold:.5,trendMacro:.5});function Df(t,e,n,s=FS){let r=0;return s.gold&&(r+=s.gold*PS(t,e)),s.trendMacro&&(r+=s.trendMacro*MS(t,e,n)),s.commodities&&(r+=s.commodities*OS(t,e)),r}const VS=5,zS=20,US=.01;function $S(t){return Math.min(Math.max(0,Math.floor(t)-VS+1),zS)}function Ca(t,e="declining"){return e!=="declining"?1:Math.pow(1-US,$S(t))}function qS(t,e="declining"){if(e!=="declining")return 0;const n=Ca(t-1,e);return n===0?0:1-Ca(t,e)/n}const HS=-.01,WS=5;function Jg(t){return Math.max(0,t+HS)}function $r(t,e,n=0){const s=Vc(n);let r=t.equityStart,i=t.bondStart,o=t.cashStart,l=t.hodlEnabled?t.hodlStart!==void 0?t.hodlStart:t.hodlValue:0,c=0,d=t.diversifierStart||0,h=0,m=0,p=0,w=t.isaBalance||0,T=t.accessMethod==="ufpls"?268275:0,S=0,A=!1,P=null;const C=t.isaBalance||0,L=Math.max(1e3,C*.05);let D=null,O=0,$=0;const I=new Array(t.years+1).fill(null),v=new Array(t.years+1).fill(null);let _=0,b=0,E=0,x=0,y=!1,te=!1,oe=null,q=0,ne=0,se=-1;const ae=[],we=t.trace?[]:null,Ie=[];let ie=1;ae.push({year:0,month:0,equity:r,bond:i,cash:o,hodl:l,total:r+i+o,draw:0,source:"None",inProtection:!1,equityMin:t.equityMin,bondMin:t.bondMin,cashMax:t.cashTarget});for(let ge=0;ge<t.years*12;ge++){const ue=Math.floor(ge/12),Qe=ge%12,sn=ue;if(sn!==se&&(q=0,ne=0,se=sn),ge>0&&ge%12===0){const Y=e.inflation[ue]||.025;Ie.push(Y),ie*=1+Y}const Kt=al(t.equityGlide,ue,t.duration);if(Kt!=null&&Qe===0){const Y=r+i;Y>0&&(r=Y*Kt,i=Y*(1-Kt))}d>0&&Qe===0&&(ue>0&&(m=BS(m,e.equity[ue-1]||0)),p=LS(m));const ze=e.equity[ue]||0,Ue=e.inflation[ue]||.025,pn=ue>0?e.inflation[ue-1]||.025:Ue;let Pt=Qn(t.equityMin,ue,t.duration,ie,!0),Ut=Qn(t.bondMin,ue,t.duration,ie,!0);if(Kt!=null){const Y=Pt+Ut;Pt=Y*Kt,Ut=Y*(1-Kt)}const Fs=Qn(t.cashTarget,ue,t.duration,ie,!1),mn=Pt+Ut,Mn=y;if(y=t.disableProtection?!1:Hg({totalGrowth:r+i,minGrowth:mn,consecCashDraws:x,wasInProtection:Mn,consecutiveLimit:t.consecutiveLimit,recoveryBuffer:t.recoveryBuffer??ka.RECOVERY_BUFFER}),y?(_++,E++):(b=Math.max(b,E),E=0),t.accessMethod==="ufpls"&&t.ufplsThenPcls&&t.ufplsYears>0&&ue>=t.ufplsYears&&Qe===0&&!A){A=!0;const Y=r+i+o+d,xe=Math.max(0,Math.min(.25*Y,T));if(xe>0&&Y>0){const dt=1-xe/Y;r*=dt,i*=dt,o*=dt,d*=dt,w+=xe,T-=xe,S=xe}}const{sippMonthly:Vs,isaMonthly:rn,planInputs:Mt,taxAnnual:gn,higherRate:Oe,taxFreeMonthly:$e,recycleGrossMonthly:Dt,recycleNetMonthly:hs}=QS(t,ue,ie,Ie,w,T);Qe===0&&(I[ue]=w/ie,v[ue]=(r+i+o+d)/ie),$+=gn/12/ie,Oe&&O++;const on=Vs,$t=on;let qt=y?on*t.protectionMult:on,Le=qt;const an=!y&&Dt>0?Dt:0,Dn=an>0?hs:0;an>0&&(Le+=an,$+=(an-Dn)/ie);const yn=rn,Bn=we?{month:ge,year:ue,monthInYear:Qe,cumInf:ie,equityStart:r,bondStart:i,cashStart:o,isaStart:w,sippMonthly:Vs,isaMonthly:rn,effectiveSipp:qt,effectiveIsa:yn,boostAmount:0,inProtection:y,planInputs:Mt}:null;Bn&&we.push(Bn),y&&(q+=$t-Le);const Ln=ue>0?e.equity[ue-1]||0:ze,pr=t.subAsset?Pf({inf:Ue,prevInf:pn,eqReturn:ze,prevEqReturn:Ln},s,t.subAsset.bondWeights):YS(Ue,ze,pn,s),Nn=Jg(pn),Ht=Y=>Math.pow(1+(Number.isFinite(Y)?Math.max(-.99,Y):-.99),1/12);if(r*=Ht(ze),i*=Ht(pr),o*=Ht(Nn),t.isaMix&&w>0){const Y=t.isaMix;let xe=(Y.shares||0)*ze+(Y.cash||0)*Nn;Y.bonds&&(xe+=Y.bonds*Pf({inf:Ue,prevInf:pn,eqReturn:ze,prevEqReturn:Ln},s,Y.bondWeights)),Y.diversifiers&&(xe+=Y.diversifiers*Df({inf:Ue,eqReturn:ze},s,p,Y.diversifierWeights)),w*=Ht(xe)}else w=yS(w,t.isaReturn||Nt.RETURN);if(l>0){const dt=(s()-.5)*2*.06;let Tt=0;ze<-.1?Tt=Math.min(.15,Math.abs(ze)*.4):ze<-.05&&(Tt=Math.abs(ze)*.2);let Jt=.069+dt+Tt;Jt=Math.max(-.08,Math.min(.18,Jt)),l*=Ht(Jt)}if(d>0){const Y=Df({inf:Ue,eqReturn:ze},s,p,t.subAsset&&t.subAsset.diversifierWeights);d*=Ht(Y)}const On=r+i;let Qt=0;if(!y){const Y=12-Qe,xe=ne+$t*Y+Mt.fixed;Qt=oa({shortfall:q,standardMonthly:$t,remainingMonths:Y,surplus:On-mn-Rr.SURPLUS_BUFFER,brlHeadroom:Mt.brl-xe}),Qt>50&&(Le+=Qt,q-=Qt)}ne+=Le,Bn&&(Bn.effectiveSipp=Le,Bn.boostAmount=Qt>50?Qt:0);let Fe="Growth";if(!y&&On>=mn+Le){const Y=Math.max(0,r-Pt),xe=Math.max(0,i-Ut),dt=Y+xe;if(dt>0){if(r-=Le*Y/dt,i-=Le*xe/dt,Fe="Growth",o<Fs){const Tt=On-mn-Le;if(Tt>5e3){const Jt=Math.min((Fs-o)*.3,Tt*.5);r-=Jt*Y/dt,i-=Jt*xe/dt,o+=Jt}}}else o-=Le,Fe="Cash"}else if(o>=Le)o-=Le,Fe="Cash";else{const Y=Le-o;o=0,d>Y?(d-=Y,h+=Y,Fe="Diversifier"):i>Y?(i-=Y,Fe="Bond"):r>Y?(r-=Y,Fe="Equity"):l>Y?(l-=Y,c+=Y,P===null&&(P=ge),Fe="HODL"):(te=!0,oe=ge)}if(x=Fe==="Growth"?0:x+1,w=Math.max(0,w-Math.min(yn,w))+Dn,T>0&&(T=Math.max(0,T-($e||0))),D===null&&C>0&&w/ie<L&&(D=ge),r=Math.max(0,r),i=Math.max(0,i),o=Math.max(0,o),d=Math.max(0,d),(Qe===0||ge===t.years*12-1||te)&&ae.push({year:ue+Qe/12,month:ge,equity:r,bond:i,cash:o,hodl:l,diversifier:d,total:r+i+o+d,draw:Le,boostAmount:Qt,source:Fe,inProtection:y,equityMin:Pt,bondMin:Ut,cashMax:Fs}),te)break}if(b=Math.max(b,E),!te)I[t.years]=w/(ie||1),v[t.years]=(r+i+o+d)/(ie||1);else for(let ge=Math.floor(oe/12)+1;ge<=t.years;ge++)v[ge]=0;let F=0,X=0,Se=0,Et=0,zt=1;for(let ge=0;ge<t.years;ge++){const ue=e.inflation[ge]??.025;F+=ue,zt*=1+ue,X+=e.equity[ge]??0,ge<5&&(Se+=e.equity[ge]??0,Et++)}const Ge=r+i+o+d;return{failed:te,duration:t.years,years:te?oe/12:t.years,failMonth:oe,avgInflation:F/t.years,avgEquityReturn:X/t.years,earlyEquityReturn:Et?Se/Et:0,cumInflation:zt,finalReal:Ge/zt,final:Ge,finalEquity:r,finalBond:i,finalCash:o,finalHodl:l,finalDiversifier:d,divUsed:h,protMonths:_,maxConsec:b,hodlUsed:c,hodlUsedMonth:P,startIsa:C,finalIsa:w,pclsTaken:S,isaDepletedMonth:D,isaLastedYears:D===null?t.years:D/12,higherRateYears:O/12,totalTaxReal:$,isaByYear:I,potByYear:v,hist:ae,trace:we,seed:n}}function YS(t,e,n,s){let r=.15,i=.3,o=.2,l=.1,c=.1,d=.15;const h=n!==void 0?n:t,m=h>.045,p=h>.07;if(m){const $=s()>.3?1:.5;p?(r=.15+.35*$,i=.3-.2*$,d=.15-.1*$,l=.1+.05*$):(r=.15+.2*$,i=.3-.1*$,d=.15-.05*$)}m&&s()<.15&&(r=.2,i=.25,d=.12);const w=t+.005+wr(0,.03,s),T=.04-(t>.04?(t-.04)*.5:0)+wr(0,.05,s),S=.03+t*.3+wr(0,.08,s),A=t*.8+wr(0,.15,s),P=Jg(n),C=e*.5+wr(0,.02,s),L=r*w+i*T+o*S+l*A+c*P+d*C,D=GS(t,e),O=(e-.1)/.17;return L+D*O*.055}function GS(t,e){return t>.045?.4:e<-.15?-.3:.1}function jS(t,e){return Ca(e,t.spendingProfile||"flat")}function KS(t,e){return t.spStartYear!==void 0?Math.max(0,t.spStartYear-e):t.statePensionYear!==void 0?Math.max(0,t.statePensionYear-e):0}function QS(t,e,n,s,r=0,i=0){const o=t.taxMode==="frozen"?t.pa:t.pa*n,l=t.taxMode==="frozen"?t.brl:t.brl*n,c=t.taxMode==="frozen"?t.hrl:(t.hrl||125140)*n,h=(Array.isArray(t.targetSchedule)&&t.targetSchedule[e]!=null?t.targetSchedule[e]:t.baseSalary)*n*jS(t,e),m=ch(t.other,s);let p=0;if(t.spStartYear!==void 0){if(e>=t.spStartYear&&t.spWeeklyAmount>0){const O=t.spWeeklyAmount*52;e===t.spStartYear&&t.spFirstYearRatio!==void 0?p=O*t.spFirstYearRatio*n:p=O*n}}else t.statePensionYear!==void 0&&(p=e>=t.statePensionYear?(t.statePension||0)*n:0);let w=0;if(t.dbAmount>0&&e>=(t.dbStartYear||0)){const O=t.dbIndexation||"lpi5";O==="level"?w=t.dbAmount:O==="cpi"?w=t.dbAmount*n:w=ch(t.dbAmount,s,.05)}const T=m+p+w,S=KS(t,e),A=!t.ufplsYears||e<t.ufplsYears,P=t.accessMethod==="ufpls"&&A&&i>0?.25:0,C=Aa({targetGross:h,fixedIncome:T,pa:o,brl:l,hrl:c,isaBalance:r,strategy:t.isaDrawdownStrategy||Nt.DRAWDOWN_STRATEGY,yearsUntilSp:S,taxFreeFraction:P});let L=0,D=0;if(t.bandFillRecycle&&P===0){const O=Wg({brlHeadroom:l-C.taxable,remainingMonths:12,isaAllowanceLeft:Qd.ISA_ANNUAL_ALLOWANCE});L=O.gross,D=O.net}return{sippMonthly:C.sippGross/12,isaMonthly:C.isaDraw/12,taxFreeMonthly:(C.taxFree||0)/12,recycleGrossMonthly:L,recycleNetMonthly:D,taxAnnual:C.tax,higherRate:C.taxable>l+1,planInputs:{target:h,other:m,statePension:p,fixed:T,pa:o,brl:l,hrl:c,yearsUntilSp:S}}}function eu(t,e=1e3){const n=[];for(let s=0;s<e;s++)n.push($r(t,tu(t,s),s));return n}function tu(t,e){const n=Object.keys(Zs).map(Number).sort((c,d)=>c-d),s=n.length,r=Vc(e*12345),i={equity:{},inflation:{}},o=t.blockYears||WS;let l=0;for(;l<t.years;){const c=Math.floor(r()*s);for(let d=0;d<o&&l<t.years;d++,l++){const h=n[(c+d)%s];i.equity[l]=Zs[h],i.inflation[l]=Da[h]||.025}}return i}function Xg(t){const e=Object.keys(Zs).map(Number).sort((r,i)=>r-i),n=Math.max(...e),s=[];for(const r of e){if(r+t.years-1>n)continue;const i={equity:{},inflation:{}};for(let l=0;l<t.years;l++)i.equity[l]=Zs[r+l]||0,i.inflation[l]=Da[r+l]||.025;const o=$r(t,i,r);o.startYear=r,s.push(o)}return s}function JS(t,e){const n={equity:{},inflation:{}};for(let s=0;s<t.years;s++)n.equity[s]=e.equity[s%e.equity.length],n.inflation[s]=e.inflation[s%e.inflation.length];return $r(t,n,999)}function XS(t){const e=t.filter(n=>n.failed).length;return(t.length-e)/t.length*100}function ZS(t){if(!t||t.failCount===0)return"No shortfalls: every simulated future funded the whole plan.";const e=d=>(d*100).toFixed(1)+"%",n=Math.round(t.medianFailYear),s=t.duration,r=Math.round(t.pctNearMiss);let i;t.pctNearMiss>=60?i=`and when they do it's usually late — the typical shortfall is at year ${n} of ${s}, and ${r}% happen only in the final years, after funding almost the whole of retirement`:t.pctNearMiss<=30?i=`and they tend to come EARLY — the typical shortfall is at year ${n} of ${s}, with only ${r}% holding on to the final years. An early shortfall is the serious kind, with little retirement left to adjust`:i=`spread through retirement — the typical shortfall is at year ${n} of ${s}`;const o=[{mag:t.succEarlyEq-t.failEarlyEq,text:`a poor first few years of markets (sequence-of-returns risk): the futures that fell short averaged ${e(t.failEarlyEq)} equity in the opening 5 years versus ${e(t.succEarlyEq)} for those that lasted`},{mag:t.succAvgEq-t.failAvgEq,text:`weak markets across the whole plan: ${e(t.failAvgEq)} average equity return versus ${e(t.succAvgEq)} for those that lasted`},{mag:t.failAvgInf-t.succAvgInf,text:`higher inflation eroding spending power: ${e(t.failAvgInf)} a year versus ${e(t.succAvgInf)} for those that lasted`}].filter(d=>d.mag>.005).sort((d,h)=>h.mag-d.mag),l=`About ${Math.round(t.failRate||0)}% of futures fall short`;if(!o.length)return`${l}, ${i}. No single market driver stands out — the shortfalls come down to broadly bad luck across returns and inflation.`;let c=`The common thread is ${o[0].text}`;return o[1]&&o[1].mag>o[0].mag*.5&&(c+=`. A secondary factor is ${o[1].text}`),`${l}, ${i}. ${c}.`}function Zg(t){const e=t.filter(l=>!l.failed),n=t.filter(l=>l.failed),s=t.map(l=>l.years).sort((l,c)=>l-c),r=e.map(l=>l.final).sort((l,c)=>l-c),i=t.map(l=>l.protMonths).sort((l,c)=>l-c),o=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:t.length,successCount:e.length,failCount:n.length,successRate:XS(t),survival:{p5:o(s,.05),p10:o(s,.1),p25:o(s,.25),p50:o(s,.5),p75:o(s,.75),p90:o(s,.9),p95:o(s,.95),min:s[0],max:s[s.length-1]},finalValue:{p5:o(r,.05),p10:o(r,.1),p25:o(r,.25),p50:o(r,.5),p75:o(r,.75),p90:o(r,.9),p95:o(r,.95),min:r[0]||0,max:r[r.length-1]||0,avg:e.reduce((l,c)=>l+c.final,0)/(e.length||1)},minYears:s[0],p10Years:o(s,.1),medianYears:o(s,.5),medianFinal:o(r,.5),p10Final:o(r,.1),p90Final:o(r,.9),avgFinal:e.reduce((l,c)=>l+c.final,0)/(e.length||1),protection:{runsWithProtection:t.filter(l=>l.protMonths>0).length,pctWithProtection:t.filter(l=>l.protMonths>0).length/t.length*100,avgMonths:i.reduce((l,c)=>l+c,0)/t.length,maxMonths:Math.max(...i),maxConsecutive:Math.max(...t.map(l=>l.maxConsec)),avgConsecutive:t.reduce((l,c)=>l+c.maxConsec,0)/t.length,p50Months:o(i,.5),p90Months:o(i,.9),p95Months:o(i,.95)},runsWithProtection:t.filter(l=>l.protMonths>0).length,avgProtMonths:i.reduce((l,c)=>l+c,0)/t.length,maxProtMonths:Math.max(...i),maxConsecutive:Math.max(...t.map(l=>l.maxConsec)),avgConsecutive:t.reduce((l,c)=>l+c.maxConsec,0)/t.length,hodl:{runsUsingHodl:t.filter(l=>l.hodlUsed>0).length,pctUsingHodl:t.filter(l=>l.hodlUsed>0).length/t.length*100,avgUsed:t.filter(l=>l.hodlUsed>0).length>0?t.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/t.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...t.map(l=>l.hodlUsed||0))},runsUsingHodl:t.filter(l=>l.hodlUsed>0).length,avgHodlUsed:t.filter(l=>l.hodlUsed>0).length>0?t.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/t.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...t.map(l=>l.hodlUsed||0)),severity:(()=>{const l=Math.max(...t.map(S=>S.duration||S.years),1),c=t.filter(S=>S.failed),d=t.filter(S=>!S.failed),h=c.map(S=>S.years).sort((S,A)=>S-A),m=l*.85,p=(S,A)=>S.length?S.reduce((P,C)=>P+(C[A]||0),0)/S.length:0,w={duration:l,coverage:t.reduce((S,A)=>S+Math.min(1,(A.years||0)/l),0)/t.length*100,failCount:c.length,failRate:t.length?c.length/t.length*100:0,medianFailYear:h.length?o(h,.5):0,pctNearMiss:c.length?c.filter(S=>S.years>=m).length/c.length*100:0,failEarlyEq:p(c,"earlyEquityReturn"),succEarlyEq:p(d,"earlyEquityReturn"),failAvgEq:p(c,"avgEquityReturn"),succAvgEq:p(d,"avgEquityReturn"),failAvgInf:p(c,"avgInflation"),succAvgInf:p(d,"avgInflation")};w.diagnosis=ZS(w);const T=[{k:"sequence",m:w.succEarlyEq-w.failEarlyEq},{k:"market",m:w.succAvgEq-w.failAvgEq},{k:"inflation",m:w.failAvgInf-w.succAvgInf}].filter(S=>S.m>.005).sort((S,A)=>A.m-S.m);return w.primaryDriver=w.failCount>0&&T.length?T[0].k:null,w})(),finalReal:(()=>{const l=t.map(c=>c.failed?0:c.finalReal||0).sort((c,d)=>c-d);return{p5:o(l,.05),p10:o(l,.1),p25:o(l,.25),p50:o(l,.5),p75:o(l,.75),p90:o(l,.9),p95:o(l,.95),min:l[0]||0,max:l[l.length-1]||0}})(),chartData:(()=>{const l=Math.max(...t.map(m=>m.duration||m.years),1),c=l+1,d={p10:[],p25:[],p50:[],p75:[],p90:[]},h=[];for(let m=0;m<c;m++){const p=t.map(T=>T.potByYear&&T.potByYear[m]!=null?T.potByYear[m]:0).sort((T,S)=>T-S);d.p10.push(o(p,.1)),d.p25.push(o(p,.25)),d.p50.push(o(p,.5)),d.p75.push(o(p,.75)),d.p90.push(o(p,.9));const w=t.filter(T=>(T.failed?T.failMonth/12:l)>=m).length;h.push(t.length?w/t.length*100:0)}return{years:c,potBand:d,solvency:h}})(),isa:(()=>{const l=t.filter(S=>(S.startIsa||0)>0);if(!l.length)return{funded:!1};const c=l.map(S=>S.isaLastedYears).sort((S,A)=>S-A),d=l.map(S=>S.finalIsa).sort((S,A)=>S-A),h=l.map(S=>S.higherRateYears),m=l.map(S=>S.totalTaxReal).sort((S,A)=>S-A),p=Math.max(...l.map(S=>(S.isaByYear||[]).length)),w=[],T=[];for(let S=0;S<p;S++){const A=l.filter(C=>C.isaByYear&&C.isaByYear[S]>0).length;w.push(l.length?A/l.length*100:0);const P=l.map(C=>C.isaByYear&&C.isaByYear[S]!=null?C.isaByYear[S]:0).sort((C,L)=>C-L);T.push(P[Math.floor(P.length/2)])}return{funded:!0,runs:l.length,startBalance:l[0].startIsa,medianLastedYears:o(c,.5),minLastedYears:c[0],pctSurviveFullTerm:l.filter(S=>S.isaDepletedMonth===null).length/l.length*100,finalBalance:{p10:o(d,.1),p50:o(d,.5),p90:o(d,.9)},avgHigherRateYears:h.reduce((S,A)=>S+A,0)/l.length,maxHigherRateYears:Math.max(...h),pctEverHigherRate:l.filter(S=>S.higherRateYears>0).length/l.length*100,medianTotalTax:o(m,.5),p90TotalTax:o(m,.9),pctHoldingByYear:w,medianIsaByYear:T}})(),failures:n.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}const ex={ANNUAL_ALLOWANCE:6e4,TAPER_THRESHOLD_INCOME:2e5,MPAA:1e4,NMPA_NEW:57,LSA_POT_THRESHOLD:1073100},tx={low:.02,mid:.05,high:.08};function nx(t,e=12570,n=50270,s=125140){return t<=e?0:t<=n?.2:t<=s?.4:.45}function sx(t,e=50270){return t<=12570?0:t<=e?.08:.02}function rx({netMonthly:t=0,salary:e=0,schemeType:n="ras",employerMonthly:s=0}){const r=nx(e),i=sx(e),o=[];let l=0,c=0,d=0;n==="salsac"?(l=t/Math.max(.2,1-r-i),d=l*i,o.push("Salary sacrifice also saves your employer 15% NI — many employers add some or all of that; ask. From April 2029 the NI exemption is capped at £2,000/yr sacrificed (Autumn Budget 2025).")):n==="netpay"?l=t/Math.max(.2,1-r):(l=t/.8,r>.2&&(c=l*(r-.2),o.push("You must CLAIM the extra "+Math.round((r-.2)*100)+"% relief (≈£"+Math.round(c)+"/mo) from HMRC via self-assessment — it is not automatic and is commonly missed.")),r===0&&o.push("Non-taxpayers still get the 25% top-up on contributions up to £3,600 gross/yr (£2,880 net) — relief at source only."));const h=l+(s||0);return{grossMonthly:l,employerMonthly:s||0,totalMonthly:h,reliefMonthly:l-t,niSavedMonthly:d,hrClaimMonthly:c,costPerPound:h>0?t/h:1,notes:o}}function ix({annualGrossTotal:t=0,salary:e=0,mpaaTriggered:n=!1,currentAge:s=0,retirementAge:r=0,projectedPotHigh:i=0}){const o=ex,l=[];return n&&t>o.MPAA&&l.push({severity:"danger",message:"MPAA: your Decision-tool history shows UFPLS income has been taken, which permanently caps tax-relieved contributions at £10,000/yr — this plan exceeds it. The excess is taxed back via an annual-allowance charge."}),t>o.ANNUAL_ALLOWANCE&&l.push({severity:"warning",message:"Annual Allowance: total contributions exceed £60,000/yr. Unused allowance from the previous 3 tax years (carry-forward) may cover it — otherwise the excess is taxed at your marginal rate."}),e>o.TAPER_THRESHOLD_INCOME&&l.push({severity:"warning",message:"High income: above £200k threshold income the Annual Allowance may taper (£1 lost per £2 of adjusted income over £260k, floor £10,000)."}),r>0&&r<o.NMPA_NEW&&(new Date().getFullYear()+Math.max(0,55-s)>=2028||r<55)&&l.push({severity:"warning",message:"Access age: the normal minimum pension age rises to 57 on 6 April 2028. Retiring before 57 means bridging from ISA/other savings until the pension can be touched."}),i>o.LSA_POT_THRESHOLD&&l.push({severity:"info",message:"Large pot: above £1,073,100 the £268,275 Lump Sum Allowance means your effective tax-free cash falls below 25% — worth planning the crystallisation strategy early."}),l}function ox({currentAge:t,retirementAge:e,potNow:n=0,totalMonthly:s=0,escalationPct:r=0,assumedCpi:i=.025}){const o=Math.max(0,Math.round(e-t)),l=[],c={low:n,mid:n,high:n};let d=s,h=0;l.push({age:t,year:0,potLow:n,potMid:n,potHigh:n,contributedToDate:0});for(let m=1;m<=o;m++){for(let w=0;w<12;w++){for(const T of Object.keys(c))c[T]=c[T]*(1+tx[T]/12)+d;h+=d}d*=1+(r||0)/100;const p=Math.pow(1+i,m);l.push({age:t+m,year:m,potLow:c.low/p,potMid:c.mid/p,potHigh:c.high/p,contributedToDate:h})}return l}function ax(t,e=.85,n=300){const s=(t.equityStart||0)+(t.bondStart||0)+(t.cashStart||0),r=s>0?{e:t.equityStart/s,b:t.bondStart/s,c:t.cashStart/s}:{e:.6,b:.3,c:.1},i=d=>{const h={...t,equityStart:d*r.e,bondStart:d*r.b,cashStart:d*r.c,equityMin:(t.equityMin||0)*(s>0?d/s:1),bondMin:(t.bondMin||0)*(s>0?d/s:1),cashTarget:(t.cashTarget||0)*(s>0?d/s:1)},m=eu(h,n);return m.filter(p=>!p.failed).length/m.length};let o=1e4,l=5e6;for(let d=0;d<12;d++){const h=(o+l)/2;i(h)>=e?l=h:o=h}const c=l;return{requiredPot:c,successAtRequired:i(c)}}function dl(t){const e=typeof t=="string"?new Date(t):t,n=e.getFullYear(),s=e.getMonth()+1,r=e.getDate();if(s<_n.START_MONTH||s===_n.START_MONTH&&r<_n.START_DAY){const i=n-1;return`${String(i).slice(-2)}/${String(n).slice(-2)}`}return`${String(n).slice(-2)}/${String(n+1).slice(-2)}`}function jl(t){const e=parseInt(t.split("/")[0]),n=e<50?2e3+e:1900+e;return new Date(n,_n.START_MONTH-1,_n.START_DAY)}function lx(t){const e=parseInt(t.split("/")[1]),n=e<50?2e3+e:1900+e;return new Date(n,_n.START_MONTH-1,_n.START_DAY-1)}function cx(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`}function nu(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,15)}function dx(t){const n=(typeof t=="string"?new Date(t):t).getMonth()+1;return n>=_n.START_MONTH?12-(n-_n.START_MONTH):_n.START_MONTH-n}function ei(t){if(!t)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},n=t.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(n)){const r=new Date(n);if(!isNaN(r.getTime()))return r}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,i,o]=n.split("/").map(Number);return new Date(o,i-1,r)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(n)){const[r,i,o]=n.split("-").map(Number);return new Date(o,i-1,r)}let s=n.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}if(s=n.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}if(s=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}if(s=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}return null}function aa(t){const e=typeof t=="string"?ei(t):t;if(!e||isNaN(e.getTime()))return"";const n=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${n[e.getMonth()]} ${e.getFullYear()}`}function ux(t){const{taxYear:e,spStartDate:n,weeklyAmount:s,taxYearConfigs:r={}}=t;if(!n||!s||s<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const i=typeof n=="string"?ei(n):n;if(!i||isNaN(i.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const o=dl(i);jl(e);const l=lx(e),c=[...new Set([o,e,...Object.keys(r)])].sort((S,A)=>jl(S).getTime()-jl(A).getTime()),d=c.indexOf(o),h=c.indexOf(e);if(h<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:aa(i)};let m=1;for(let S=d;S<h;S++){const A=c[S],P=r[A],C=(P==null?void 0:P.cpi)||.025;m*=1+C}const p=s*m;if(e===o){const A=Math.max(0,(l.getTime()-i.getTime())/6048e5),P=p*A;return{annual:P,monthly:P/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(A*10)/10,startDate:aa(i)}}const T=p*52;return{annual:T,monthly:T/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:aa(i)}}function hx(t,e=new Date){const n=typeof t=="string"?ei(t):t;if(!n||isNaN(n.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const s=n.getTime()-e.getTime(),r=s<=0;if(r)return{years:0,months:0,totalMonths:0,isPast:!0};const i=Math.floor(s/(30.44*24*60*60*1e3)),o=Math.floor(i/12),l=i%12;return{years:o,months:l,totalMonths:i,isPast:r}}const ey=2016;function ul(t,{now:e=new Date}={}){if(!t||!String(t).trim())return{valid:!0,error:null,warning:null,date:null};const n=ei(t);if(!n||isNaN(n.getTime()))return{valid:!1,error:'Could not read that date. Try a format like "6 May 2040".',warning:null,date:null};const s=n.getFullYear();return s<ey?{valid:!1,error:`That looks like a date of birth (${s}), not a State Pension start date. Enter the date your State Pension begins — check gov.uk/check-your-state-pension.`,warning:null,date:n}:n.getTime()<e.getTime()?{valid:!0,error:null,warning:`This date is in the past — State Pension will be treated as already in payment from ${s}.`,date:n}:{valid:!0,error:null,warning:null,date:n}}function su(t,e=new Date){if(!t.spStartDate||!t.spWeeklyAmount)return null;const n=ei(t.spStartDate);if(!n)return null;const s=365.25*24*60*60*1e3,r=Math.max(0,(n.getTime()-e.getTime())/s),i=Math.floor(r),o=365,l=Math.floor((n-new Date(n.getFullYear(),0,0))/(24*60*60*1e3)),c=(o-l)/o;return{spStartYear:i,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:c}}const Bf=Object.freeze(Object.defineProperty({__proto__:null,MIN_SP_START_YEAR:ey,calculateStatePensionForTaxYear:ux,formatStatePensionDate:aa,getTimeUntilStatePension:hx,parseStatePensionDate:ei,spSimConfigFromSettings:su,validateStatePensionDate:ul},Symbol.toStringTag,{value:"Module"}));function ty(t,e,n=.025){const s=[];let r=t.isaBalance||0;const i=Math.max(0,n-.01),o=su(t),l=o?o.spStartYear:t.statePensionYear??1/0,c=o?o.spWeeklyAmount*52:t.statePension||0,d=o?o.spFirstYearRatio:1;let h=t.accessMethod==="ufpls"?268275:0;for(let m=0;m<=e;m++){const p=Math.pow(1+n,m),w=t.taxMode==="frozen"?t.pa:t.pa*p,T=t.taxMode==="frozen"?t.brl:t.brl*p,S=t.taxMode==="frozen"?t.hrl||125140:(t.hrl||125140)*p,A=Ca(m,t.spendingProfile||"flat"),C=(Array.isArray(t.targetSchedule)&&t.targetSchedule[m]!=null?t.targetSchedule[m]:t.baseSalary||0)*p*A,L=(t.other||0)*Math.pow(1+Math.min(n,Xf),m);let D=0;m>=l&&c>0&&(D=c*(m===l?d:1)*p);let O=0;if(t.dbAmount>0&&m>=(t.dbStartYear||0)){const y=t.dbIndexation||"lpi5";y==="level"?O=t.dbAmount:y==="cpi"?O=t.dbAmount*p:O=t.dbAmount*Math.pow(1+Math.min(n,.05),m)}const $=L+D+O,I=Math.max(0,l===1/0?0:l-m),v=!t.ufplsYears||m<t.ufplsYears,_=t.accessMethod==="ufpls"&&v&&h>0?.25:0,b=Aa({targetGross:C,fixedIncome:$,pa:w,brl:T,hrl:S,isaBalance:r,strategy:t.isaDrawdownStrategy,yearsUntilSp:I,taxFreeFraction:_});h>0&&(h=Math.max(0,h-(b.taxFree||0)));const E=b.taxable-b.tax,x=r;r=b.remainingIsa*(1+i),s.push({year:m,brl:T,other:L,statePension:D,sippDraw:b.sippGross,totalTaxable:b.taxable,tax:b.tax,netIncome:E,target:C,isaDraw:b.isaDraw,isaBalance:x,spendable:b.net})}return s}function hl(t){const e={[ye.SHARES]:0,[ye.BONDS]:0,[ye.DIVERSIFIERS]:0,[ye.CASH]:0},n={},s=[],r=[];let i=0,o=0;for(const l of t){const c=+l.value||0,d=l.subClass||(l.ticker?Gg[l.ticker]:void 0),h=d?Ot[d]:null;if(!h){r.push({...l});continue}if(i+=c,s.push({...l,subClass:d,bucket:h.bucket,label:h.label}),(l.wrapper||"").toUpperCase()==="ISA"){o+=c;continue}e[h.bucket]+=c,n[d]=(n[d]||0)+c}return{buckets:e,subClassTotals:n,bondWeights:Lf(n,ye.BONDS),diversifierWeights:Lf(n,ye.DIVERSIFIERS),total:i,isaTotal:o,tagged:s,untagged:r}}function Lf(t,e){const n=Object.entries(t).filter(([i])=>Ot[i].bucket===e),s=n.reduce((i,[,o])=>i+o,0);if(s<=0)return{};const r={};for(const[i,o]of n)r[i]=o/s;return r}function fx(t){const e=t.buckets[ye.DIVERSIFIERS]||0,n={equityStart:t.buckets[ye.SHARES]||0,bondStart:t.buckets[ye.BONDS]||0,cashStart:t.buckets[ye.CASH]||0,isaBalance:t.isaTotal||0};return e>0&&(n.diversifierStart=e,n.subAsset={}),Object.keys(t.bondWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.bondWeights=t.bondWeights),Object.keys(t.diversifierWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.diversifierWeights=t.diversifierWeights),n}let Es=null;function Ki(){return{settings:{equityMin:me.EQUITY_MIN,bondMin:me.BOND_MIN,cashTarget:me.CASH_TARGET,duration:me.DURATION_YEARS,baseSalary:me.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Ts.PROTECTION_MULTIPLIER,consecutiveLimit:me.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Ts.HODL_ENABLED,hodlValue:Ts.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function ru(){return De()&&lt()}function ss(){Es=null}function px(){return Es||Ki()}async function ny(){if(Es)return Es;if(!ru())return console.warn("Firebase not available - returning defaults"),Ki();try{const t=await KI();if(t){const e={settings:t,lastModified:new Date().toISOString(),checksum:null};return Es=yx(e),Es}}catch(t){console.error("Error loading stress data:",t)}return Ki()}async function mx(t){if(!ru())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=gx(t),await Lg(t.settings),Es=t}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function gx(t){return La(t.settings)}function yx(t){const e={...Ki()};return t.settings&&(e.settings={...e.settings,...t.settings},t.settings.pacwMin!==void 0&&t.settings.equityMin===void 0&&(e.settings.equityMin=t.settings.pacwMin),t.settings.cgtMin!==void 0&&t.settings.bondMin===void 0&&(e.settings.bondMin=t.settings.cgtMin),t.settings.csh2Target!==void 0&&t.settings.cashTarget===void 0&&(e.settings.cashTarget=t.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=t.lastModified,e.checksum=t.checksum,e}function vx(){return px().settings}async function ct(){return(await ny()).settings}async function Eo(t){const e=await ny();e.settings={...e.settings,...t},await mx(e)}async function bx(){if(!ru())throw new Error("Must be logged in to reset settings");const t=Ki();await Lg(t.settings),ss()}function wx(t){return su(t)}function ti(t={},e=null){const n=e||vx(),s=wx(n),r=s?{spStartYear:s.spStartYear,spWeeklyAmount:s.spWeeklyAmount,spFirstYearRatio:s.spFirstYearRatio}:{statePension:n.statePension||0,statePensionYear:n.statePensionYear??999},i=_x(n.taggedFunds);return{...i?{isaMix:i}:{},equityStart:t.equityStart??n.equityMin,bondStart:t.bondStart??n.bondMin,cashStart:t.cashStart??n.cashTarget,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,years:t.years??n.duration,duration:n.duration,baseSalary:n.baseSalary,other:n.other,...r,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode,protectionMult:n.protectionMult??(n.protectionFactor!=null?1-n.protectionFactor/100:Ts.PROTECTION_MULTIPLIER),consecutiveLimit:n.consecutiveLimit,disableProtection:n.disableProtection,hodlEnabled:n.hodlEnabled,hodlValue:n.hodlValue,isaBalance:n.isaBalance||0,isaReturn:n.isaReturn,accessMethod:n.accessMethod||"drawdown",recoveryBuffer:n.recoveryBuffer??me.RECOVERY_BUFFER,ufplsYears:n.ufplsYears||null,ufplsThenPcls:!!n.ufplsThenPcls,bandFillRecycle:!!n.bandFillRecycle,targetSchedule:Array.isArray(n.targetSchedule)?n.targetSchedule:null,dbAmount:n.dbAmount||0,dbStartYear:n.dbStartYear||0,dbIndexation:n.dbIndexation||"lpi5",isaDrawdownStrategy:n.isaDrawdownStrategy,spendingProfile:n.spendingProfile||"flat",equityGlide:n.equityGlideEnabled?qg(n):void 0,diversifierStart:t.diversifierStart??(n.diversifierStart||void 0),subAsset:n.subAsset||void 0}}function _x(t){const e=(t||[]).filter(r=>(r.wrapper||"").toUpperCase()==="ISA"&&+r.value>0);if(!e.length)return null;const n=hl(e.map(r=>({...r,wrapper:"SIPP"})));if(!(n.total>0))return null;const s={shares:n.buckets.shares/n.total,bonds:n.buckets.bonds/n.total,diversifiers:n.buckets.diversifiers/n.total,cash:n.buckets.cash/n.total};return Object.keys(n.bondWeights).length&&(s.bondWeights=n.bondWeights),Object.keys(n.diversifierWeights).length&&(s.diversifierWeights=n.diversifierWeights),s}async function fl(){try{const t=await XI();return{...ji(),...t||{}}}catch(t){return console.error("Error loading budget:",t),ji()}}async function iu(t){const e={...t,derived:Zr(t)};return await ZI(e),e}function j(t,e=null){const n=Math.abs(t),s=e!==null?e:n<100,r=Math.abs(t).toLocaleString("en-GB",{minimumFractionDigits:s?2:0,maximumFractionDigits:s?2:0});return t<0?`-£${r}`:`£${r}`}function Nf(t,e){const n=Ex(t);e.innerHTML=n}function Ex(t){var E,x,y,te,oe;const e=t,n=e.calculationDetails||{};let s="";const r=e.isTaxEfficientYear??e.taxEfficient,i=e.protectionInducedTaxEfficiency||!1,o=e.boostAmount>0;let l,c,d;if(e.inProtection?(l="warning",c="Protection Mode",d="⚡"):o?(l="boost",c="Tax Boost (Catch-up)",d="↑"):i?(l="info",c="Protection-Induced Tax Efficiency",d="↑"):r?(l="success",c="Tax-Efficient Year",d="✓"):(l="warning",c="Tax-Inefficient Year",d="!"),s+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,r&&e.yearlyIsaSavingsAllocation>0){const q=e.cumulativeIsaSavingsUsed||0,ne=e.yearlyIsaSavingsAllocation,se=Math.max(0,ne-q),ae=ne>0?q/ne*100:0;s+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(ae,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${j(q)} of ${j(ne)}</span>
        <span>Remaining: ${j(se)}</span>
      </div>
    </div>`}if(e.pclsSuggestion>0&&(s+=`<div class="alert alert-info">
      💡 Your plan's UFPLS phase has ended. If you haven't already, take your remaining 25% tax-free
      lump sum — about <strong>${j(e.pclsSuggestion)}</strong> at today's pot value
      (capped by your remaining Lump Sum Allowance) — into your ISA, then continue in drawdown.
      Update your fund values here once done.
    </div>`),e.alerts&&e.alerts.length>0){s+='<div class="alerts">';for(const q of e.alerts){const ne=Tx(q.severity);s+=`<div class="alert ${ne}">${q.message}</div>`}s+="</div>"}s+='<div class="recommendation-card">',s+="<h3>Monthly Recommendation</h3>",s+='<div class="draw-row primary">',s+='<span class="label">SIPP Withdrawal</span>',s+=`<span class="value">${j(e.sippDraw)}</span>`,s+="</div>",e.isaDraw>0&&(s+='<div class="draw-row">',s+='<span class="label">ISA Top-up</span>',s+=`<span class="value">${j(e.isaDraw)}</span>`,s+="</div>"),e.recycleNet>0&&(s+='<div class="draw-row">',s+='<span class="label">of which: recycle to ISA (band-fill)</span>',s+=`<span class="value">${j(e.recycleNet)}</span>`,s+="</div>",s+=`<div class="alert alert-info" style="margin:6px 0;">💡 Your SIPP withdrawal above includes an extra ${j(e.recycleGross)} to fill your basic-rate band. After 20% tax, contribute <strong>${j(e.recycleNet)}</strong> of it to your ISA — it comes out tax-free later. (Counts toward your £20,000 ISA allowance.)</div>`),e.other>0&&(s+='<div class="draw-row muted">',s+='<span class="label">Other Pension</span>',s+=`<span class="value">${j(e.other)}</span>`,s+="</div>"),e.statePension>0&&(s+='<div class="draw-row muted">',s+='<span class="label">State Pension</span>',s+=`<span class="value">${j(e.statePension)}</span>`,s+="</div>"),s+='<div class="divider"></div>';const h=e.sippDraw+e.other+e.statePension,m=h*12,p=e.pa||12570,w=e.brl||50270;let T=0;m>p&&(m<=w?T=(m-p)*.2:T=(w-p)*.2+(m-w)*.4);const S=h-T/12+e.isaDraw;s+='<div class="draw-row total">',s+='<span class="label">Total Monthly Income</span>',s+=`<span class="value">${j(S)}</span>`,s+="</div>",e.boostAmount>0&&(s+='<div class="boost-indicator">',s+='<span class="boost-label">Includes Tax Boost:</span>',s+=`<span class="boost-value">+${j(e.boostAmount)}</span>`,s+="</div>"),s+="</div>",s+='<div class="source-card">',s+="<h4>Withdraw From</h4>",s+=`<div class="source-label ${e.source.toLowerCase().replace(/[^a-z]+/g,"-")}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(s+='<div class="source-breakdown">',e.drawFromEquity>0&&(s+=`<div class="source-item">Equity: ${j(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(s+=`<div class="source-item">Bond: ${j(e.drawFromBond)}</div>`),s+="</div>"),e.drawFromDiversifier>0&&(s+='<div class="source-breakdown">',e.drawFromCash>0&&(s+=`<div class="source-item">Cash: ${j(e.drawFromCash)}</div>`),s+=`<div class="source-item">Diversifier reserve: ${j(e.drawFromDiversifier)}</div>`,s+="</div>"),s+="</div>",s+='<div class="fund-status">',s+="<h4>Fund Status</h4>";const A=e.equity+e.bond+e.cash+(e.diversifier||0),P=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,C=A-P,L=P>0?C/P*100:0;s+='<div class="fund-grid">';const D=e.equity-e.adjEquityMin;s+=Go("Equity",e.equity,e.adjEquityMin,D);const O=e.bond-e.adjBondMin;s+=Go("Bond",e.bond,e.adjBondMin,O);const $=e.cash-e.adjCashTarget;s+=Go("Cash",e.cash,e.adjCashTarget,$),e.diversifier!=null&&(s+=Go("Diversifiers",e.diversifier,0,e.diversifier)),s+="</div>";const I=C>=0?"healthy":"warning";s+=`<div class="overall-status ${I}">`,s+=`<span>Total Surplus: ${j(C)}</span>`,s+=`<span>(${L.toFixed(1)}% above target)</span>`,s+="</div>",s+="</div>",s+='<div class="tax-info">',s+="<h4>Tax Summary</h4>",s+='<div class="tax-thresholds">',s+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${j(e.pa)}</span></div>`,s+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${j(e.brl)}</span></div>`,n.taxInfo&&(s+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${n.taxInfo.headroomToBRL>0?"success":"warning"}">${j(n.taxInfo.headroomToBRL)}</span></div>`),s+="</div>",s+='<div class="tax-comparison">',s+='<div class="tax-comparison-header">',s+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",s+="</div>";const v=((E=n.taxInfo)==null?void 0:E.monthlyTax)||T/12,_=e.taxPaidYTD||v,b=e.taxProjectedAnnual||((x=n.taxInfo)==null?void 0:x.annualTax)||T;if(s+='<div class="tax-comparison-row">',s+='<div class="label">Tax Paid</div>',s+=`<div>${j(v)}</div>`,s+=`<div>${j(_)}</div>`,s+=`<div>${j(b)}</div>`,s+="</div>",r||((y=n.taxInfo)==null?void 0:y.taxSavedAnnual)>0){const q=e.taxSavedMonthly||((te=n.taxInfo)==null?void 0:te.taxSavedMonthly)||0,ne=e.taxSavedYTD||q,se=e.taxSavedProjectedAnnual||((oe=n.taxInfo)==null?void 0:oe.taxSavedAnnual)||0;se>0&&(s+='<div class="tax-comparison-row saved">',s+='<div class="label">Tax Saved</div>',s+=`<div class="success">-${j(q)}</div>`,s+=`<div class="success">-${j(ne)}</div>`,s+=`<div class="success">-${j(se)}</div>`,s+="</div>")}if(s+="</div>",n.taxInfo&&typeof n.taxInfo.effectiveRate=="number"&&!isNaN(n.taxInfo.effectiveRate)){const q=n.taxInfo.effectiveRate*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${q<=20?"success":q<=40?"warning":"danger"}">${q.toFixed(1)}%</span>
    </div>`}else if(n.taxInfo&&n.taxInfo.annualTaxable>0&&n.taxInfo.annualTax>=0){const q=n.taxInfo.annualTax/n.taxInfo.annualTaxable*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${q<=20?"success":q<=40?"warning":"danger"}">${q.toFixed(1)}%</span>
    </div>`}if(s+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){s+='<div class="rebalance-card">',s+="<h4>Rebalancing Suggestions</h4>",s+="<ul>";for(const q of e.rebalanceActions)s+=`<li>${q}</li>`;s+="</ul>",s+="</div>"}return s+='<div class="mode-explanation">',s+="<h4>Why This Recommendation?</h4>",s+=`<p>${n.reason||"Standard calculation based on your settings."}</p>`,!n.hasSufficientIsa&&n.isaNeededMonthly>0&&(s+=`<p class="isa-warning">To enable tax-efficient mode, you need ${j(n.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),s+="</div>",s+='<details class="debug-section">',s+="<summary>Calculation Details</summary>",s+="<pre>"+JSON.stringify(n,null,2)+"</pre>",s+="</details>",s}function Go(t,e,n,s){return`<div class="fund-cell ${s>=0?"healthy":"deficit"}">
    <div class="fund-name">${t}</div>
    <div class="fund-current">${j(e)}</div>
    <div class="fund-min">Min: ${j(n)}</div>
    <div class="fund-surplus">${s>=0?"+":""}${j(s)}</div>
  </div>`}function Tx(t){switch(t){case Uo.DANGER:return"alert-danger";case Uo.WARNING:return"alert-warning";case Uo.SUCCESS:return"alert-success";case Uo.INFO:default:return"alert-info"}}function Ix(){return`
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
  `}async function Sx(t){const e=nu(t),n=dl(e),s=e.getMonth()+1;return await aS(n)?{showWizard:!1,taxYear:n,isApril:s===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:n,isApril:s===4,reason:`Tax year ${n} has not been set up`}}function xx(t,e,n=0){return t*(1+e-n)}function Ax(t){const{targetAnnualGross:e,brl:n,pa:s=12570,remainingMonths:r,grossIncomeToDate:i=0}=t,o=T=>T<=s?0:T<=n?(T-s)*.2:(n-s)*.2+(T-n)*.4,l=Math.max(0,n-i);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=n)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=o(e),d=e-c,h=o(n),m=n-h,p=Math.max(0,d-m),w=p/12*r;return{isaNeeded:w,isaNeededAnnual:p,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:h,reason:`Need £${Math.round(w).toLocaleString()} ISA/Savings for tax efficiency`}}function kx(t,e,n){return n?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:t>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-t,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function Cx(t){const e=nu(t),n=dl(e),r=e.getMonth()+1===4,i=dx(e),o=await wt(),l=await ol(n),c=await ds(),h=Object.keys(c).sort().filter(L=>L<n).pop()||null,m=h?c[h]:null,p=await Kd(n),w=(m==null?void 0:m.cpi)||Ba,T=o.spendingProfile||"flat",S=Math.max(0,2e3+(parseInt(n.split("/")[0],10)||26)-2026),A=qS(S,T),P=m&&m.confirmedSalary||o.baseSalary,C=xx(P,w,A);return{taxYear:n,selectedMonth:t,isApril:r,remainingMonths:i,baseSalary:o.baseSalary,suggestionBase:P,spendingProfile:T,declineRate:A,suggestedSalary:C,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:w,other:(m==null?void 0:m.other)||0},statePension:p,existingConfig:l.yearSetupComplete?l:null}}function sy(t){const{targetSalary:e,brl:n,pa:s=12570,other:r=0,statePension:i=0,isaSavingsAllocation:o=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=t,h=x=>x<=s?0:x<=n?(x-s)*.2:(n-s)*.2+(x-n)*.4,m=r/12,p=i/12,w=m+p;let T,S;if(!d)T=e/12-w,S=0;else{const x=Math.max(0,n-c),y=Math.max(0,x/l-w);T=Math.min(e/12-w,y),S=o/l}const A=(T+w)*12,C=h(A)/12,L=T+w,D=L>0?C/L:0,O=T*D,$=m*D,I=p*D,v=T-O,_=m-$,b=p-I,E=v+_+b+S;return{sipp:{gross:T,tax:O,net:v},other:{gross:m,tax:$,net:_},statePension:{gross:p,tax:I,net:b},isa:{gross:S,tax:0,net:S},totalGross:T+m+p+S,totalTax:C,totalNet:E,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:T,monthlyIsa:S,monthlyOther:m,monthlyStatePension:p,monthlyTotal:E}}function Rx(t){var S,A,P,C,L,D,O,$,I,v,_;const{pa:e,brl:n,hrl:s,cpi:r,other:i,isaSavingsAllocation:o,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:h,confirmedSalary:m,remainingMonths:p,statePension:w,monthlyBreakdown:T}=t;return{pa:e,brl:n,hrl:s,cpi:r,other:i,isaSavingsAllocation:l?o:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:h||4,remainingMonths:p||12,yearSetupComplete:!0,confirmedSalary:m,statePension:w||0,expectedMonthly:T?{sipp:{gross:((S=T.sipp)==null?void 0:S.gross)||0,tax:((A=T.sipp)==null?void 0:A.tax)||0,net:((P=T.sipp)==null?void 0:P.net)||0},other:{gross:((C=T.other)==null?void 0:C.gross)||0,tax:((L=T.other)==null?void 0:L.tax)||0,net:((D=T.other)==null?void 0:D.net)||0},statePension:{gross:((O=T.statePension)==null?void 0:O.gross)||0,tax:(($=T.statePension)==null?void 0:$.tax)||0,net:((I=T.statePension)==null?void 0:I.net)||0},isa:{gross:((v=T.isa)==null?void 0:v.gross)||0,tax:0,net:((_=T.isa)==null?void 0:_.net)||0},totalGross:T.totalGross||0,totalTax:T.totalTax||0,totalNet:T.totalNet||0}:null}}let Js=null,Qi=null,en=1,J=null,z={};async function Px(t,e,n){Js=t,Qi=n,en=1,z={},J=await Cx(e),z={pa:J.defaults.pa,brl:J.defaults.brl,hrl:J.defaults.hrl,cpi:J.defaults.cpi,other:J.defaults.other,grossIncomeToDate:0,confirmedSalary:J.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},Di()}async function Mx(t){return await Sx(t)}function Di(){if(!Js||!J)return;const t=J.isApril?6:7;Js.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${J.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${J.isApril?"Setting up for the full tax year":`Starting in ${ou(J.selectedMonth)} - ${J.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${Lx(t,en)}
        </div>

        ${Dx()}
      </div>
    </div>
  `,Nx()}function Dx(){if(J.isApril,J.isApril)switch(en){case 1:return Of();case 2:return Ff();case 3:return Vf();case 4:return zf();case 5:return Uf();case 6:return $f();default:return""}else switch(en){case 1:return Of();case 2:return Bx();case 3:return Ff();case 4:return Vf();case 5:return zf();case 6:return Uf();case 7:return $f();default:return""}}function Of(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">Tax Thresholds for ${J.taxYear}</div>
      <div class="wizard-step-desc">
        Enter the tax thresholds for this tax year. These are pre-filled with standard values.
      </div>

      <div class="wizard-grid">
        <div class="wizard-grid-item">
          <label>Personal Allowance</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizPA" value="${z.pa}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Basic Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBRL" value="${z.brl}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Higher Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizHRL" value="${z.hrl}">
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
  `}function Bx(){const t=ou(J.selectedMonth),e=zx(J.selectedMonth);return`
    <div class="wizard-step">
      <div class="wizard-step-title">Income Before Starting Pension</div>
      <div class="wizard-step-desc">
        You're starting your pension drawdown in ${t}. Enter any taxable income you've already received this tax year (April to ${e}).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizIncomeToDate" value="${z.grossIncomeToDate}" placeholder="0">
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
  `}function Ff(){const t=z.cpi!==void 0?z.cpi:J.defaults.cpi,e=(t*100).toFixed(1),n=J.suggestionBase??J.baseSalary,s=J.declineRate||0,r=Math.round(n*(1+t-s)),i=s>0,o=((t-s)*100).toFixed(1);return`
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
        ${i?`<p>Your plan uses <strong>declining spending</strong> (~${(s*100).toFixed(0)}%/yr real). Last year's salary rises with <span id="cpiDisplay">${e}</span>% CPI less that decline — a net <strong><span id="netUpliftDisplay">${o}</span>%</strong> — to:</p>`:`<p>Based on <span id="cpiDisplay">${e}</span>% inflation, your target salary should be:<span id="netUpliftDisplay" hidden>${o}</span></p>`}
        <p style="font-size: 24px; color: var(--primary); margin: 12px 0;">£<span id="suggestedSalaryDisplay">${r.toLocaleString()}</span></p>
        <p>per year (gross)</p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Confirm or adjust your target salary:
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizSalary" value="${Math.round(z.confirmedSalary||r)}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function Vf(){const t=J.statePension,e=t.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(t.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${t.yearsUntil} years until state pension</span>`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Other Taxable Income</div>
      <div class="wizard-step-desc">
        Enter any other taxable income you'll receive this tax year (annual amount).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizOther" value="${z.other}">
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
  `}function zf(){To();const t=Ax({targetAnnualGross:z.confirmedSalary,brl:z.brl,pa:z.pa,other:z.other,statePension:J.statePension.amount,remainingMonths:J.remainingMonths,grossIncomeToDate:z.grossIncomeToDate});return z._isaCalc=t,t.brlExhausted?`
      <div class="wizard-step">
        <div class="wizard-step-title">BRL Already Exhausted</div>

        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2); border: 1px solid var(--danger);">
          <p style="color: var(--danger); font-weight: 500;">
            Your income to date (£${z.grossIncomeToDate.toLocaleString()}) has already exceeded the BRL (£${z.brl.toLocaleString()}).
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
            Your target salary of £${Math.round(z.confirmedSalary).toLocaleString()} is achievable within the BRL.
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
        <p>To be tax-efficient for the remaining <strong>${J.remainingMonths} months</strong>, you need:</p>
        <p style="font-size: 28px; color: var(--primary); margin: 12px 0;">
          £${Math.round(t.isaNeeded).toLocaleString()}
        </p>
        <p>from ISA/Savings</p>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
          This keeps your SIPP draw at the BRL (£${z.brl.toLocaleString()}) while reaching your target salary.
        </p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        How much ISA/Savings can you allocate this tax year?
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizISA" value="${z.isaSavingsAllocation||Math.round(t.isaNeeded)}">
      </div>

      <div class="wizard-example">
        <strong>Tip:</strong> This is money you'll withdraw tax-free from ISA or savings to supplement your SIPP income.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function Uf(){To();const t=z._isaCalc,e=kx(z.isaSavingsAllocation,(t==null?void 0:t.isaNeeded)||0,(t==null?void 0:t.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return z.isTaxEfficient=!0,z.taxEfficiencyChoice="efficient",setTimeout(()=>{en++,Di()},0),`
      <div class="wizard-step">
        <div class="wizard-step-title">Setting Up Tax Efficiency...</div>
        <div class="wizard-info-box">
          <p>Your ISA allocation is sufficient for tax efficiency.</p>
        </div>
      </div>
    `;const n=e.shortfall>0?`You entered £${z.isaSavingsAllocation.toLocaleString()} but need £${Math.round(t.isaNeeded).toLocaleString()}.`:"";return`
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
            <input type="radio" name="taxChoice" value="increase" ${z.taxEfficiencyChoice==="increase"?"checked":""}>
            <div class="wizard-option-content">
              <strong>Increase ISA to £${Math.round(t.isaNeeded).toLocaleString()}</strong>
              <p>Provide enough ISA/Savings for tax efficiency</p>
            </div>
          </label>
        `}

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="reduced" ${z.taxEfficiencyChoice==="reduced"?"checked":""}>
          <div class="wizard-option-content">
            <strong>Reduce salary to BRL (£${z.brl.toLocaleString()})</strong>
            <p>Keep ISA/Savings to grow, accept lower income this year</p>
          </div>
        </label>

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="inefficient" ${z.taxEfficiencyChoice==="inefficient"?"checked":""}>
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
  `}function $f(){To();const t=sy({targetSalary:z.confirmedSalary,brl:z.brl,pa:z.pa,other:z.other,statePension:J.statePension.amount,isaSavingsAllocation:z.isaSavingsAllocation,remainingMonths:J.remainingMonths,grossIncomeToDate:z.grossIncomeToDate,isTaxEfficient:z.isTaxEfficient}),e=z.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",n=z.isTaxEfficient?"success":"warning",s=r=>`£${Math.round(r).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${J.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${ou(J.selectedMonth)}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Remaining Months:</span>
          <span>${J.remainingMonths}</span>
        </div>
        ${z.grossIncomeToDate>0?`
          <div class="wizard-summary-row">
            <span>Income to Date:</span>
            <span>${s(z.grossIncomeToDate)}</span>
          </div>
        `:""}
        <div class="wizard-summary-row">
          <span>Target Salary:</span>
          <span>${s(z.confirmedSalary)}/year</span>
        </div>
        <div class="wizard-summary-row">
          <span>Tax Mode:</span>
          <span class="${n}">${e}</span>
        </div>
        <div class="wizard-summary-row">
          <span>ISA Allocation:</span>
          <span>${s(z.isaSavingsAllocation)}</span>
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
  `}function Lx(t,e){let n="";for(let s=1;s<=t;s++){const r=s<e?"done":s===e?"active":"";n+=`<div class="wizard-dot ${r}"></div>`}return n}function Nx(){Js.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>Ox(e.dataset.action))}),window._updateWizardSalary=function(){const e=document.getElementById("wizCPI"),n=document.getElementById("wizSalary"),s=document.getElementById("cpiDisplay"),r=document.getElementById("suggestedSalaryDisplay");if(e&&n&&s&&r){const i=parseFloat(e.value)||0,o=i/100,l=J.suggestionBase??J.baseSalary,c=J.declineRate||0,d=Math.round(l*(1+o-c));s.textContent=i.toFixed(1),r.textContent=d.toLocaleString();const h=document.getElementById("netUpliftDisplay");h&&(h.textContent=((o-c)*100).toFixed(1)),n.value=d,z.cpi=o,z.confirmedSalary=d}}}function Ox(t){To();const e=J.isApril?6:7;switch(t){case"cancel":ry(),Qi&&Qi({completed:!1,cancelled:!0});break;case"next":en<e&&(en++,Di());break;case"back":en>1&&(en--,Di());break;case"apply-choice":Fx(),en++,Di();break;case"finish":Vx();break}}function Fx(){var e;const t=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch(z.taxEfficiencyChoice=t,t){case"increase":z.isaSavingsAllocation=z._isaCalc.isaNeeded,z.isTaxEfficient=!0;break;case"reduced":z.confirmedSalary=z.brl,z.isaSavingsAllocation=0,z.isTaxEfficient=!0;break;case"inefficient":z.isaSavingsAllocation=0,z.isTaxEfficient=!1;break}}function To(){const t=document.getElementById("wizPA");t&&(z.pa=parseFloat(t.value)||12570);const e=document.getElementById("wizBRL");e&&(z.brl=parseFloat(e.value)||50270);const n=document.getElementById("wizHRL");n&&(z.hrl=parseFloat(n.value)||125140);const s=document.getElementById("wizCPI");s&&(z.cpi=(parseFloat(s.value)||Ba*100)/100);const r=document.getElementById("wizSalary");r&&(z.confirmedSalary=parseFloat(r.value)||3e4);const i=document.getElementById("wizOther");i&&(z.other=parseFloat(i.value)||0);const o=document.getElementById("wizISA");o&&(z.isaSavingsAllocation=parseFloat(o.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(z.grossIncomeToDate=parseFloat(l.value)||0)}async function Vx(){To();const t=sy({targetSalary:z.confirmedSalary,brl:z.brl,pa:z.pa,other:z.other,statePension:J.statePension.amount,isaSavingsAllocation:z.isaSavingsAllocation,remainingMonths:J.remainingMonths,grossIncomeToDate:z.grossIncomeToDate,isTaxEfficient:z.isTaxEfficient}),e=Rx({pa:z.pa,brl:z.brl,hrl:z.hrl,cpi:z.cpi,other:z.other,isaSavingsAllocation:z.isaSavingsAllocation,isTaxEfficient:z.isTaxEfficient,taxEfficiencyChoice:z.taxEfficiencyChoice,grossIncomeToDate:z.grossIncomeToDate,startMonth:parseInt(J.selectedMonth.split("-")[1]),confirmedSalary:z.confirmedSalary,remainingMonths:J.remainingMonths,statePension:J.statePension.amount,monthlyBreakdown:t});console.log(`Tax Year Wizard: Saving config for ${J.taxYear}`,e);try{await fr(J.taxYear,e),console.log(`Tax Year Wizard: Successfully saved config for ${J.taxYear}`)}catch(n){console.error(`Tax Year Wizard: Failed to save config for ${J.taxYear}`,n),typeof window.showToast=="function"&&window.showToast(`Error saving tax year configuration: ${n.message}`,"error");return}ry(),Qi&&Qi({completed:!0,taxYear:J.taxYear,config:e,wizardInputs:z})}function ry(){Js&&(Js.innerHTML="",Js.style.display="none")}function ou(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function zx(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-2,1).toLocaleString("default",{month:"long"})}function Ux(){return`
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
  `}function $x(t={},e=null){const n=ti(t,e),s=eu(n),r=Zg(s);return{results:s,stats:r,config:n}}function qx(t={},e=null){const n=ti(t,e),s=Xg(n),r=Zg(s);return{results:s,stats:r,config:n}}function Hx(t={}){const e=ti(t),n={};for(const[s,r]of Object.entries(p0))n[s]={...r,result:JS(e,r)};return n}let ar=Jd,Bi=null,qf=!1,Tc=!1,iy=null;function pl(){return ar}function qr(t){const e=(t||"").toUpperCase().trim();return ar.find(n=>n.ticker===e)||null}function Wx(){return Tc}function Yx(){return iy}function Gx(){return Bi}async function jx(){if(!(qf||!De()||!Ee)){qf=!0;try{const t=await Ii(St(Ee,"adminPrivate","access"));Tc=!0,iy=t.exists()&&t.data().passphrase||null}catch{Tc=!1}try{const[t,e,n]=await Promise.all([Ii(St(Ee,"admin","fundCatalogue")),Ii(St(Ee,"admin","subAssetProfiles")),Ii(St(Ee,"admin","typicalAmounts"))]);if(t.exists()){const s=t.data().funds;Array.isArray(s)&&s.length&&s.every(r=>r.ticker&&r.subClass)&&(ar=Object.freeze([...s].sort((r,i)=>r.ticker.localeCompare(i.ticker))),console.log("AdminConfig: fund catalogue override active ("+ar.length+" funds)"))}if(e.exists()&&(Bi=e.data().overrides||null,Bi&&(Yg(Bi),console.log("AdminConfig: sub-asset profile overrides active"))),n.exists()){const s=n.data().tiers;s&&typeof s=="object"&&(LI(s),console.log("AdminConfig: typical-amounts override active"))}}catch(t){console.warn("AdminConfig: using code defaults ("+t.message+")")}}}async function Kx(t){const e=(t||[]).filter(n=>n.ticker&&n.subClass).map(n=>({ticker:String(n.ticker).toUpperCase().trim(),name:String(n.name||""),subClass:n.subClass}));return await Vd(St(Ee,"admin","fundCatalogue"),{funds:e,updatedAt:zd()}),ar=Object.freeze([...e].sort((n,s)=>n.ticker.localeCompare(s.ticker))),ar.length}async function Qx(){await tl(St(Ee,"admin","fundCatalogue")),ar=Jd}async function oy(t){const e=t&&Object.keys(t).length?t:null;e?await Vd(St(Ee,"admin","subAssetProfiles"),{overrides:e,updatedAt:zd()}):await tl(St(Ee,"admin","subAssetProfiles")),Bi=e,Yg(e)}function Jx({ticker:t,name:e,subClass:n}){try{const s=kn();if(!s||!De()||!Ee||!t)return;gg(Td(Ee,"fundSuggestions"),{ticker:String(t).toUpperCase().trim().slice(0,12),name:String(e||"").slice(0,80),subClass:String(n||"").slice(0,40),uid:s.uid,createdAt:zd()}).catch(()=>{})}catch{}}async function Xx(t=100){return(await mg(uI(Td(Ee,"fundSuggestions"),hI("createdAt","desc"),fI(t)))).docs.map(n=>({id:n.id,...n.data()}))}async function Zx(t){await tl(St(Ee,"fundSuggestions",t))}function ay(t){return dl(nu(t))}function eA(t){const[e,n]=t.split("-").map(Number);return Math.max(0,(n>=4?e:e-1)-2026)}async function tA(t,e,n,s,r){var xo,Vn,Ao,ko;const i=r.settings,o=r.history,l=r.allTaxYears,c=ay(t),d=eA(t),[h,m]=t.split("-").map(Number);if(!l[c])throw new Error(`Tax year ${c} is not configured. Please add it in the Settings tab before calculating.`);const p=l[c],w=p.pa||12570,T=p.brl||50270,S=p.hrl||125140,A=p.other||0,P=p.isTaxEfficient!==!1,C=p.isaSavingsAllocation||0,L=p.grossIncomeToDate||0,D=p.confirmedSalary||i.baseSalary,O=o.find(W=>W.date===t),$=(O==null?void 0:O.isa)||0,I=Math.max(0,(p.isaSavingsUsed||0)-$),_=r.spInfo.amount||0;let b=1;for(let W=0;W<d;W++){const Re=String((26+W)%100).padStart(2,"0")+"/"+String((27+W)%100).padStart(2,"0"),je=(l[Re]||{}).cpi||Ba;b*=1+je}let E=Qn(i.equityMin,d,i.duration,b,!0),x=Qn(i.bondMin,d,i.duration,b,!0);const y=Math.round(Qn(i.cashTarget,d,i.duration,b,!1)),te=al(i.equityGlide,d,i.duration);if(te!=null){const W=E+x;E=W*te,x=W*(1-te)}E=Math.round(E),x=Math.round(x);const oe=e+n,q=E+x;let ne=0;const se=o.filter(W=>W.date<t);for(let W=se.length-1;W>=0&&se[W].source==="Cash";W--)ne++;const ae=i.disableProtection?!1:Hg({totalGrowth:oe,minGrowth:q,consecCashDraws:ne,wasInProtection:se.length>0&&se[se.length-1].inProtection,consecutiveLimit:i.consecutiveLimit||3,recoveryBuffer:i.recoveryBuffer||ka.RECOVERY_BUFFER}),we=m>=4?16-m:4-m,Ie=Math.max(1,we),ie=p.confirmedSalary?p.confirmedSalary:i.baseSalary*b,F=A+_;Yt(ie,w,T,S);let X,Se,Et,zt=0,Ge=0,ge=!1,ue=0;const Qe=268275,sn=o.reduce((W,Re)=>W+(Re.taxFree||0),0),Kt=!i.ufplsYears||d<i.ufplsYears,ze=i.accessMethod==="ufpls"&&Kt&&sn<Qe,Ue=ze?.25:0;let pn=0;i.accessMethod==="ufpls"&&i.ufplsThenPcls&&i.ufplsYears>0&&d===Math.floor(i.ufplsYears)&&sn<Qe&&(pn=Math.max(0,Math.min(.25*(e+n+s),Qe-sn)));const Pt=Math.max(1,Math.min(12,p.remainingMonths||12)),Ut=Pt<12&&L||0,mn=Math.max(0,C-I)/Ie;if(P){const W=F/12;o.filter(he=>he.taxYear===c&&he.date<t);const Re=ie/12,je=r.isaBalance||0;let qe,He;if(je>0){const he=Aa({targetGross:ie,fixedIncome:F+Ut,pa:w,brl:T,hrl:S,taxFreeFraction:Ue,isaBalance:je,strategy:i.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0});qe=he.sippGross/Pt,He=he.isaDraw/Pt}else{if(((Vn=(xo=p.expectedMonthly)==null?void 0:xo.sipp)==null?void 0:Vn.gross)>0)qe=p.expectedMonthly.sipp.gross;else{const Bt=Math.max(0,T-L-F)/(1-Ue)/12;qe=Math.min(Re-W,Bt)}const he=Yt(ie,w,T,S)/12,ut=Math.min(ie,T),tt=Yt(ut,w,T,S)/12,vn=Math.max(0,he-tt);He=Math.min(vn,mn)}if(ue=He,zt=qe,ae){const he=(i.protectionFactor||20)/100;X=qe*(1-he),Se=He,Et="Protection"}else{X=qe,Se=He,Et="Tax-Efficient";const he=m>=4?h:h-1,ut=se.filter(Bt=>{const[Co,mr]=Bt.date.split("-").map(Number);return(mr>=4?Co:Co-1)===he});let tt=0,vn=0;ut.forEach(Bt=>{vn+=Bt.sipp||0,Bt.inProtection&&Bt.stdSipp&&(tt+=Bt.stdSipp-Bt.sipp),Bt.boostAmount>0&&(tt-=Bt.boostAmount)});const ai=(vn+X*Ie)*(1-Ue)+F;Ge=oa({shortfall:tt,standardMonthly:qe,remainingMonths:Ie,surplus:oe-q-Rr.SURPLUS_BUFFER,brlHeadroom:T-ai}),Ge>50&&(X+=Ge,Et="Tax Boost")}}else{let W;((ko=(Ao=p.expectedMonthly)==null?void 0:Ao.sipp)==null?void 0:ko.gross)>0?W=p.expectedMonthly.sipp.gross:W=Aa({targetGross:ie,fixedIncome:F+Ut,pa:w,brl:T,hrl:S,taxFreeFraction:Ue,isaBalance:0,strategy:i.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0}).sippGross/Pt,zt=W,Se=0;const Re=m>=4?h:h-1,je=se.filter(he=>{const[ut,tt]=he.date.split("-").map(Number);return(tt>=4?ut:ut-1)===Re});let qe=0,He=0;if(je.forEach(he=>{He+=he.sipp||0,he.inProtection&&he.stdSipp&&(qe+=he.stdSipp-he.sipp),he.boostAmount>0&&(qe-=he.boostAmount)}),ae){const he=(i.protectionFactor||20)/100;X=W*(1-he),Et="Protection";const ut=(He+X*Ie)*(1-Ue)+F,tt=T-ut;Ge=oa({shortfall:tt,standardMonthly:W,remainingMonths:Ie,surplus:oe-q-Rr.SURPLUS_BUFFER,brlHeadroom:tt}),Ge>0&&(X+=Ge,ge=!0,Et="Protection-Induced Efficiency")}else{X=W,Et="Tax-Inefficient";const he=(He+X*Ie)*(1-Ue)+F;Ge=oa({shortfall:qe,standardMonthly:W,remainingMonths:Ie,surplus:oe-q-Rr.SURPLUS_BUFFER,brlHeadroom:T-he}),Ge>0&&(X+=Ge,Et="Tax Boost")}}let Mn=0,Vs=0;if(i.bandFillRecycle&&Ue===0&&!ae){const W=m>=4?h:h-1,Re=se.filter(ut=>{const[tt,vn]=ut.date.split("-").map(Number);return(vn>=4?tt:tt-1)===W});let je=0,qe=0;Re.forEach(ut=>{je+=ut.sipp||0,qe+=ut.recycleNet||0});const He=je+X*Ie+F+Ut,he=Wg({brlHeadroom:T-He,remainingMonths:Ie,isaAllowanceLeft:Qd.ISA_ANNUAL_ALLOWANCE-qe});Mn=he.gross,Vs=he.net,Mn>0&&(X+=Mn)}const rn=r.diversifier||0;let Mt,gn,Oe=0,$e=0,Dt=0,hs=0,on="";if(!ae&&oe>=q+X){Mt="Growth";const W=Math.max(0,e-E),Re=Math.max(0,n-x),je=W+Re;je>0?(Oe=X*W/je,$e=X*Re/je,gn="Healthy"):(Mt="Cash",Dt=X,gn="At min")}else if(Mt="Cash",gn=ae?"Protection":"Below min",rn>0){Dt=Math.min(s,X);let W=X-Dt;W>0&&(hs=Math.min(rn,W),W-=hs,Mt=Dt>0?"Cash + Diversifier":"Diversifier"),W>0&&(on="Cash low!")}else Dt=X,s<X&&(on="Cash low!");let $t="";const qt=e-E,Le=n-x;if(qt>5e3&&Le<-5e3){const W=Math.floor(Math.min(qt,-Le)/1e3)*1e3;W>=5e3&&($t=`Move £${W.toLocaleString()} Equity→Bond`)}else if(Le>5e3&&qt<-5e3){const W=Math.floor(Math.min(Le,-qt)/1e3)*1e3;W>=5e3&&($t=`Move £${W.toLocaleString()} Bond→Equity`)}let an="";const Dn=y-s;if(Dn>5e3&&Mt==="Growth"&&!ae){const W=oe-q-X;if(W>1e4){const Re=Math.floor(Math.min(Dn*.3,W*.5)/1e3)*1e3;Re>=5e3&&(an=`Replenish Cash: Move £${Re.toLocaleString()} from growth funds`)}}const yn=[];on&&yn.push({message:on,severity:"danger",type:"low-cash"}),Ge>50&&yn.push({message:`Tax Boost: +£${Math.round(Ge).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),$t&&yn.push({message:$t,severity:"warning",type:"rebalance"}),an&&yn.push({message:an,severity:"info",type:"cash-replenish"});const Bn=m>=4?h:h-1,Ln=se.filter(W=>{const[Re,je]=W.date.split("-").map(Number);return(je>=4?Re:Re-1)===Bn}),pr=Ln.reduce((W,Re)=>W+(Re.sipp||0),0),Nn=Ln.length+1,On=Math.max(0,Pt-Nn)*zt,Fe=(pr+X+On)*(1-Ue)+A+_+Ut,Y=ia(Fe,w,T,S),xe=(Y-ia(Ut,w,T,S))/Pt,Tt=X+A/12+_/12-xe+Se,Jt=xe*Nn,et=Y,So=ie/12,zs=ia(So*12,w,T,S),Fn=Math.max(0,zs/12-Y/12),Tl=I+ue;return{date:t,taxYear:c,yearNumber:d,remainingMonths:Ie,equity:e,bond:n,cash:s,isa:0,adjEquityMin:E,adjBondMin:x,adjCashTarget:y,pa:w,brl:T,other:A/12,statePension:_/12,sippDraw:X,stdSipp:zt,isaDraw:Se,totalMonthlyNet:Tt,monthlyTax:xe,taxFree:X*Ue,accessMethod:ze?"ufpls":"drawdown",lsaRemaining:ze?Math.max(0,Qe-sn):null,pclsSuggestion:pn,recycleGross:Mn,recycleNet:Vs,isTaxEfficientYear:P,yearlyIsaSavingsAllocation:C,cumulativeIsaSavingsUsed:Tl,isaSavingsUsedThisMonth:ue,taxPaidYTD:Jt,taxProjectedAnnual:et,taxSavedMonthly:Fn,taxSavedYTD:Fn*Nn,taxSavedProjectedAnnual:Fn*12,taxEfficient:P&&!ge,inProtection:ae,protectionReason:ae?gn:null,consecutiveCashDraws:ne,protectionInducedTaxEfficiency:ge,boostAmount:Ge>50?Ge:0,boostEligible:Ge>50,source:Mt,drawFromEquity:Oe,drawFromBond:$e,drawFromCash:Dt,...rn>0?{drawFromDiversifier:hs,diversifier:rn}:{},rebalanceNeeded:$t!=="",rebalanceActions:$t?[$t]:[],alerts:yn,calculationDetails:{mode:Et,reason:`${gn} | ${Et}`,totalGrowth:oe,minGrowth:q,consec:ne,stdSipp:X,inputs:{baseSalary:i.baseSalary,confirmedSalary:D,targetGross:ie,cumInf:b,yearNum:d,taxYear:c,OTHER:A,STATE:_,PA:w,BRL:T,isTaxEfficientYear:P,yearlyIsaSavingsAllocation:C,grossIncomeToDate:L},taxInfo:{annualTaxable:Fe,headroomToBRL:T-Fe,annualTax:Y,monthlyNet:Tt}}}}let Ji=null;function nA(t,e){Ji=t,sA(e)}function sA({onGetStarted:t,onSignIn:e}){Ji&&(Ji.innerHTML=`
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
  `,document.getElementById("landingGetStarted").addEventListener("click",t),document.getElementById("landingSignIn").addEventListener("click",e))}function Xi(){Ji&&(Ji.style.display="none")}function rA(){return`
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
  `}let ot=null,Li=null,ws=!1;function iA(t,e){console.log("initAuthScreen: initializing"),ot=t,Li=e,ws=!1,bg(n=>{if(console.log("AuthScreen: auth state change received:",n?n.email:"null","processed:",ws),n&&!n.emailVerified){uA(n);return}n&&Li&&!ws?(console.log("AuthScreen: calling onAuthSuccessCallback"),ws=!0,ly(),Li(n)):n?console.log("AuthScreen: skipping callback, already processed or no callback"):(ws=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),au(),console.log("initAuthScreen: complete")}function au(){if(ot){if(!De()){ot.innerHTML=`
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
    `;return}ot.innerHTML=`
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
  `,oA()}}function oA(){const t=ot.querySelectorAll(".auth-screen-tab");t.forEach(i=>{i.addEventListener("click",()=>{t.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=document.getElementById("signinForm"),l=document.getElementById("signupForm");i.dataset.tab==="signin"?(o.style.display="block",l.style.display="none"):(o.style.display="none",l.style.display="block"),lr()})}),document.getElementById("signinForm").addEventListener("submit",aA),document.getElementById("signupForm").addEventListener("submit",lA),document.getElementById("forgotPasswordBtn").addEventListener("click",cA),document.getElementById("googleSigninBtn").addEventListener("click",dA)}function hn(t){const e=document.getElementById("authScreenError");e&&(e.textContent=t,e.style.display="block")}function lr(){const t=document.getElementById("authScreenError");t&&(t.style.display="none")}async function aA(t){t.preventDefault(),lr();const e=document.getElementById("signinEmail").value.trim(),n=document.getElementById("signinPassword").value;if(!e||!n){hn("Please enter email and password");return}try{await SI(e,n)}catch(s){console.error("Sign in error:",s),hn(ml(s.code))}}async function lA(t){t.preventDefault(),lr();const e=document.getElementById("signupName").value.trim(),n=document.getElementById("signupEmail").value.trim(),s=document.getElementById("signupPassword").value;if(!e||!n||!s){hn("Please fill in all fields");return}if(s.length<6){hn("Password must be at least 6 characters");return}try{await EI(n,s,e)}catch(r){console.error("Sign up error:",r),hn(ml(r.code))}}async function cA(){lr();const t=document.getElementById("signinEmail").value.trim();if(!t){hn("Please enter your email address first");return}try{await AI(t),typeof window.showToast=="function"&&window.showToast("Password reset email sent. Check your inbox.","success",5e3)}catch(e){console.error("Reset password error:",e),hn(ml(e.code))}}async function dA(){lr();try{await xI()}catch(t){console.error("Google sign in error:",t),hn(ml(t.code))}}function ml(t){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[t]||"An error occurred. Please try again."}function uA(t){ot&&(ot.style.display="block",ot.innerHTML=`
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
  `,document.getElementById("verifiedContinueBtn").addEventListener("click",async()=>{lr();try{const e=await II();e&&e.emailVerified?Li&&!ws&&(ws=!0,ly(),Li(e)):hn("Not verified yet. Click the link in the email first (check spam), then try again.")}catch(e){console.error("Verification check error:",e),hn("Could not check verification status. Please try again.")}}),document.getElementById("resendVerificationBtn").addEventListener("click",async()=>{lr();try{await TI(),typeof window.showToast=="function"&&window.showToast("Verification email sent. Check your inbox.","success",5e3)}catch(e){console.error("Resend verification error:",e),hn(e.code==="auth/too-many-requests"?"Too many attempts. Please wait a few minutes and try again.":"Could not send the email. Please try again.")}}),document.getElementById("verifySignOutBtn").addEventListener("click",async()=>{try{await Ud(),au()}catch(e){console.error("Sign out error:",e)}}))}function ly(){ot&&(ot.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function cy(){console.log("hideAuthScreen: hiding auth screen, element=",!!ot),ot&&(ot.style.display="none",console.log("hideAuthScreen: set display to none"))}function hA(){ws=!1,ot&&(ot.style.display="block",au())}function Zi(t="signin"){hA(),ot.querySelectorAll(".auth-screen-tab").forEach(i=>i.classList.remove("active"));const n=ot.querySelector(`.auth-screen-tab[data-tab="${t}"]`);n&&n.classList.add("active");const s=document.getElementById("signinForm"),r=document.getElementById("signupForm");s&&r&&(s.style.display=t==="signin"?"block":"none",r.style.display=t==="signup"?"block":"none")}function fA(){return`
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
  `}let eo=null;function dy(t,e,n,s={}){eo=t,pA(e,n,s)}function pA(t,e,n={}){if(!eo)return;const s=t||"there",r=n.title||`Welcome, ${s}!`,i=n.subtitle||"Your account is set up and ready to go. Here's what Pension Planner can do for you.",o=n.ctaLabel||"Set Up Your First Plan";eo.innerHTML=`
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
  `,document.getElementById("onboardingStartWizard").addEventListener("click",e),n.onSkip&&document.getElementById("onboardingSkip").addEventListener("click",n.onSkip)}function ni(){eo&&(eo.style.display="none")}function mA(){return`
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
  `}let rs=null,Ra=null,Ic=null,B={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35},It="scenario",Ce=1;function uy(){It="scenario",Ce=1,B={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35}}function hy(t,e,n=null){rs=t,Ra=e,Ic=n,uy(),Xt()}function Xt(){rs&&(It==="scenario"?gA():It==="stress"?bA():It==="decision"&&_A())}function gA(){rs.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${lu(2,Ce)}
        </div>

        ${Ce===1?yA():vA()}
      </div>
    </div>
  `,cu()}function yA(){const t=B.household==="couple";return`
    <div class="wizard-step">
      <div class="wizard-step-title">Let's create your plan</div>
      <div class="wizard-step-desc">
        Just a few basics to start — no money questions yet. You'll add your spending, pots and other
        details in the tools themselves, only when you need them.
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <label style="display:block; font-size:13px; margin-bottom:4px;">Plan name</label>
        <input type="text" id="wizScenarioName" value="${B.scenarioName}" placeholder="e.g. My plan" style="max-width: 320px;">
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

      ${Hf("You","wiz",B.currentAge,B.retirementAge,B.retired)}
      <div id="wizPartnerBlock" style="display:${t?"block":"none"};">
        ${Hf("Your partner","wizPartner",B.partnerAge,B.partnerRetirementAge,B.partnerRetired)}
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
  `}function Hf(t,e,n,s,r){const i=r?"Age you retired":"Target retirement age",o=e+"CurrentAge",l=e+"RetireAge",c=e+"Retired";return`
    <div style="border:1px solid var(--border); border-radius:10px; padding:12px 14px; margin-bottom:12px;">
      <strong style="font-size:14px;">${t}</strong>
      <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end; margin-top:8px;">
        <div class="wizard-input" style="flex:0 0 auto;">
          <label style="display:block; font-size:13px; margin-bottom:4px;">Age today</label>
          <input type="number" id="${o}" value="${n||""}" placeholder="e.g. 52" style="max-width:110px;">
        </div>
        <div class="wizard-input" style="flex:0 0 auto;">
          <label id="${l}Label" style="display:block; font-size:13px; margin-bottom:4px;">${i}</label>
          <input type="number" id="${l}" value="${s||""}" placeholder="e.g. 60" style="max-width:150px;">
        </div>
        <label style="flex:0 0 auto; display:flex; align-items:center; gap:6px; font-size:13px; padding-bottom:8px; cursor:pointer;">
          <input type="checkbox" id="${c}" ${r?"checked":""} style="width:auto;"
            onchange="document.getElementById('${l}Label').textContent = this.checked ? 'Age you retired' : 'Target retirement age'">
          Already retired
        </label>
      </div>
    </div>
  `}function vA(){return`
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
  `}function bA(){rs.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${lu(6,Ce)}
        </div>

        ${wA(Ce)}
      </div>
    </div>
  `,cu()}function wA(t){switch(t){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            Think of this as your "salary" in retirement. This is the total amount before tax that you want to receive each year.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBaseSalary" value="${B.baseSalary}">
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
            <input type="number" id="wizOther" value="${B.otherIncome}">
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
                <input type="text" id="wizSpStartDate" value="${B.spStartDate}" placeholder="e.g. 6 May 2040" style="width: 100%;">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Weekly Amount (from HMRC)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizSpWeeklyAmount" value="${B.spWeeklyAmount||""}" step="0.01" placeholder="e.g. 221.20">
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
                <input type="number" id="wizIsaBalance" min="0" value="${B.isaBalance}">
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
            <input type="number" id="wizDuration" value="${B.duration}" style="max-width: 100px;">
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
              <option value="inflates" ${B.taxMode==="inflates"?"selected":""}>Standard (rise with inflation)</option>
              <option value="frozen" ${B.taxMode==="frozen"?"selected":""}>Frozen (stay at current levels)</option>
            </select>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> "Frozen" is more pessimistic - you pay more tax over time as your income grows but thresholds don't.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="finish-stress">${B.enabledTools.includes("decision")?"Continue to Decision Tool":"Finish Setup"}</button>
          </div>
        </div>
      `;default:return""}}function _A(){rs.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${lu(4,Ce)}
        </div>

        ${EA(Ce)}
      </div>
    </div>
  `,cu()}function EA(t){switch(t){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            This is your target "salary" from your pension. The tool will calculate how much to withdraw each month.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizDBaseSalary" value="${B.decisionSalary}">
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
                <input type="number" id="wizDIsaBalance" min="0" value="${B.decisionIsaBalance}">
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
            <input type="number" id="wizDDuration" value="${B.decisionDuration}" style="max-width: 100px;">
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
      `;default:return""}}function lu(t,e){let n="";for(let s=1;s<=t;s++){const r=s<e?"done":s===e?"active":"";n+=`<div class="wizard-dot ${r}"></div>`}return n}function cu(){if(rs.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>TA(e.dataset.action))}),document.getElementById("wizRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wiz",B.equityMin,B.bondMin,B.cashTarget);const e=document.getElementById("wizEquityGlide");e&&(e.checked=!!B.equityGlideEnabled,window.updateAllocDisplay("wiz"))}if(document.getElementById("wizDRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wizD",B.decisionEquity,B.decisionBond,B.decisionCash);const e=document.getElementById("wizDEquityGlide");e&&(e.checked=!!B.decisionEquityGlideEnabled,window.updateAllocDisplay("wizD"))}}function TA(t){switch(fy(),t){case"skip-all":if(Ic){Ic();break}B.startAt="budget",js();break;case"to-router":{const e=parseInt(B.currentAge),n=parseInt(B.retirementAge),s=r=>{typeof window.showToast=="function"&&window.showToast(r,"error")};if(!n||n<40||n>95){s(B.retired?"Please enter the age you retired":"Please enter a target retirement age");return}if(e&&n>e&&B.retired){s("You ticked 'already retired' but the age is in the future — untick it, or lower the age.");return}if(e&&n<e&&!B.retired){s("That retirement age is in the past — tick 'already retired' if you've already retired.");return}Ce=2,Xt();break}case"start-budget":case"start-stress":case"start-decision":B.startAt=t.replace("start-",""),js();break;case"next":{const e=ul(B.spStartDate);if(!e.valid){typeof window.showToast=="function"&&window.showToast(e.error,"error");return}It==="scenario"?Ce<2&&(Ce++,Xt()):It==="stress"?Ce<6&&(Ce++,Xt()):It==="decision"&&Ce<4&&(Ce++,Xt());break}case"back":(It==="scenario"&&Ce>1||It==="stress"&&Ce>1||It==="decision"&&Ce>1)&&(Ce--,Xt());break;case"start-tools":if(!B.enabledTools||B.enabledTools.length===0){typeof window.showToast=="function"&&window.showToast("Please select at least one tool","error");return}Kl("scenario");break;case"skip-stress":Kl("stress");break;case"finish-stress":B.decisionSalary=B.baseSalary,B.decisionEquity=B.equityMin,B.decisionBond=B.bondMin,B.decisionCash=B.cashTarget,B.decisionIsaBalance=B.isaBalance,B.decisionDuration=B.duration,B.decisionEquityGlideEnabled=B.equityGlideEnabled,Kl("stress");break;case"skip-decision":js();break;case"finish":js();break}}function Kl(t){const e=B.enabledTools.includes("stress"),n=B.enabledTools.includes("decision");t==="scenario"?e?(It="stress",Ce=1,Xt()):n?(It="decision",Ce=1,Xt()):js():t==="stress"&&n?(It="decision",Ce=1,Xt()):js()}function fy(){const t=document.getElementById("wizScenarioName");t&&(B.scenarioName=t.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(B.scenarioDescription=e.value.trim()||"");const n=document.querySelector('input[name="wizHousehold"]:checked');n&&(B.household=n.value);const s=document.getElementById("wizCurrentAge");s&&(B.currentAge=parseInt(s.value)||"");const r=document.getElementById("wizRetireAge");r&&(B.retirementAge=parseInt(r.value)||"");const i=document.getElementById("wizRetired");i&&(B.retired=i.checked);const o=document.getElementById("wizPartnerCurrentAge");o&&(B.partnerAge=parseInt(o.value)||"");const l=document.getElementById("wizPartnerRetireAge");l&&(B.partnerRetirementAge=parseInt(l.value)||"");const c=document.getElementById("wizPartnerRetired");c&&(B.partnerRetired=c.checked);const d=document.getElementById("wizToolStress"),h=document.getElementById("wizToolDecision");if(d!==null||h!==null){const I=[];d&&d.checked&&I.push("stress"),h&&h.checked&&I.push("decision"),B.enabledTools=I}const m=document.getElementById("wizBaseSalary");m&&(B.baseSalary=parseFloat(m.value)||3e4);const p=document.getElementById("wizOther");p&&(B.otherIncome=parseFloat(p.value)||0);const w=document.getElementById("wizSpStartDate");w&&(B.spStartDate=w.value.trim()||"");const T=document.getElementById("wizSpWeeklyAmount");if(T&&(B.spWeeklyAmount=parseFloat(T.value)||0),document.getElementById("wizPot")&&typeof window.readAlloc=="function"){const I=window.readAlloc("wiz");B.equityMin=I.equityMin,B.bondMin=I.bondMin,B.cashTarget=I.cashTarget}const S=document.getElementById("wizEquityGlide");S&&(B.equityGlideEnabled=S.checked);const A=document.getElementById("wizIsaBalance");A&&(B.isaBalance=parseFloat(A.value)||0);const P=document.getElementById("wizDuration");P&&(B.duration=parseInt(P.value)||35);const C=document.getElementById("wizTaxMode");C&&(B.taxMode=C.value);const L=document.getElementById("wizDBaseSalary");if(L&&(B.decisionSalary=parseFloat(L.value)||3e4),document.getElementById("wizDPot")&&typeof window.readAlloc=="function"){const I=window.readAlloc("wizD");B.decisionEquity=I.equityMin,B.decisionBond=I.bondMin,B.decisionCash=I.cashTarget}const D=document.getElementById("wizDEquityGlide");D&&(B.decisionEquityGlideEnabled=D.checked);const O=document.getElementById("wizDIsaBalance");O&&(B.decisionIsaBalance=parseFloat(O.value)||0);const $=document.getElementById("wizDDuration");$&&(B.decisionDuration=parseInt($.value)||35)}function js(){fy(),Ra&&Ra(B)}function si(){rs&&(rs.style.display="none")}function IA(t,e,n,s){if(rs=t,Ra=n,uy(),B.enabledTools=e,s&&(e.includes("stress")&&s.source==="decision"&&(B.baseSalary=s.baseSalary||3e4,B.equityMin=s.equityMin||25e4,B.bondMin=s.bondMin||2e5,B.cashTarget=s.cashTarget||5e4,B.isaBalance=s.isaBalance||0,B.duration=s.duration||35,B.spStartDate=s.spStartDate||"",B.spWeeklyAmount=s.spWeeklyAmount||0),e.includes("decision")&&s.source==="stress"&&(B.decisionSalary=s.baseSalary||3e4,B.decisionEquity=s.equityMin||25e4,B.decisionBond=s.bondMin||2e5,B.decisionCash=s.cashTarget||5e4,B.decisionIsaBalance=s.isaBalance||0,B.decisionDuration=s.duration||35)),e.includes("stress"))It="stress";else if(e.includes("decision"))It="decision";else{n&&n(B);return}Ce=1,Xt()}function SA(){return`
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
  `}function xA(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}function AA(t,e,n={}){const s=xA(),r=t.getContext("2d"),{width:i,height:o}=t,l={top:50,right:180,bottom:60,left:80},c=i-l.left-l.right,d=o-l.top-l.bottom;r.fillStyle=s.bg,r.fillRect(0,0,i,o);const h=Object.keys(e),m=n.years||35;let p=0;h.forEach(A=>{const P=e[A].result;P&&P.hist&&P.hist.forEach(C=>{C.total>p&&(p=C.total)})}),p*=1.1;const w=A=>l.left+A/m*c,T=A=>l.top+d-A/p*d;kA(r,l,c,d,m,p,n.title||"Scenario Comparison",s);const S=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];h.forEach((A,P)=>{const C=e[A].result;if(!C||!C.hist)return;r.beginPath(),r.strokeStyle=S[P%S.length],r.lineWidth=2.5,C.hist.forEach((D,O)=>{const $=w(D.year),I=T(D.total);O===0?r.moveTo($,I):r.lineTo($,I)}),r.stroke();const L=l.top+15+P*24;r.fillStyle=S[P%S.length],r.fillRect(i-l.right+15,L,20,4),r.font="11px system-ui, sans-serif",r.fillStyle=s.text,r.textAlign="left",r.fillText(e[A].name||A,i-l.right+40,L+5),C.final/1e3,r.fillStyle=s.muted,r.fillText(`${py(C.final)}`,i-l.right+40,L+18)})}function kA(t,e,n,s,r,i,o,l){t.font="bold 14px system-ui, sans-serif",t.fillStyle=l.text,t.textAlign="center",t.fillText(o,e.left+n/2,e.top-20),t.strokeStyle=l.grid,t.lineWidth=1;for(let c=0;c<=5;c++){const d=e.top+s*c/5;t.beginPath(),t.moveTo(e.left,d),t.lineTo(e.left+n,d),t.stroke();const h=i*(5-c)/5;t.font="11px system-ui, sans-serif",t.fillStyle=l.muted,t.textAlign="right",t.fillText(py(h),e.left-10,d+4)}for(let c=0;c<=r;c+=5){const d=e.left+c/r*n;t.beginPath(),t.moveTo(d,e.top),t.lineTo(d,e.top+s),t.stroke(),t.textAlign="center",t.fillText(`Y${c}`,d,e.top+s+20)}t.font="12px system-ui, sans-serif",t.textAlign="center",t.fillText("Years",e.left+n/2,e.top+s+45),t.save(),t.translate(20,e.top+s/2),t.rotate(-Math.PI/2),t.fillText("Fund Value",0,0),t.restore()}function py(t){return t>=1e6?`£${(t/1e6).toFixed(1)}M`:t>=1e3?`£${(t/1e3).toFixed(0)}k`:`£${t.toFixed(0)}`}function CA(){return`
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
  `}window._simEngine={runMonteCarlo:eu,runHistorical:Xg,simulate:$r,monteCarloReturns:tu};window._constants={EQUITY_RETURNS:Zs,INFLATION:Da};window._mathUtils={seededRng:Vc};let my=null,gy=null;function yy(){my=null,gy=null;const t=document.getElementById("mcResults"),e=document.getElementById("histResults");t&&(t.innerHTML=""),e&&(e.innerHTML="");const n=document.getElementById("optimiseResultsMC"),s=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),s&&(s.innerHTML="")}function vy(){document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-stresstab="montecarlo"]');t&&t.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("stress-montecarlo");e&&e.classList.remove("hidden")}function by(){document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-decisiontab="entry"]');t&&t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("decision-entry");e&&e.classList.remove("hidden")}const wy=document.createElement("style");wy.textContent=Ix()+rA()+fA()+mA()+SA()+Ux()+CA();document.head.appendChild(wy);const du=document.getElementById("globalLoadingOverlay"),RA=du.querySelector(".loading-text");function kt(t="Loading..."){RA.textContent=t,du.classList.add("active")}function Ct(){du.classList.remove("active")}window.showToast=function(e,n="info",s=3e3){const r=document.querySelector(".toast-notification");r&&r.remove();const i=document.createElement("div");i.className=`toast-notification ${n}`,i.innerHTML=`
        <span class="toast-icon">${n==="success"?"✓":n==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${e}</span>
      `,document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("show")),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},s)};document.getElementById("versionDisplay").textContent=`v${Qf}`;document.getElementById("entryMonth").value=cx();function Sc(t){const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");if(!e||!n)return;const s=parseFloat(e.value)||0;n.value=s>0?Math.round(s*52):"",n._updateOverlay&&n._updateOverlay()}["ds","ss"].forEach(t=>{const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");e&&n&&(e.addEventListener("input",()=>{const s=parseFloat(e.value)||0;n.value=s>0?Math.round(s*52):"",n._updateOverlay&&n._updateOverlay()}),n.addEventListener("input",()=>{const s=parseFloat(n.value)||0;e.value=s>0?+(s/52).toFixed(2):"",e._updateOverlay&&e._updateOverlay()}))});function uu(t){const e=parseFloat(t);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function _y(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(n){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(n){!n.shiftKey&&!n.ctrlKey&&!n.metaKey&&this.select()})})}function Ey(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted||e.closest("#budget-content")||e.closest("#budWizardOverlay")||e.closest("#adminPanelOverlay"))return;e.dataset.formatted="true";let n=e.closest(".input-with-unit");const s=!!n;n||(n=document.createElement("span"),n.className="num-format-wrap",n.style.cssText="position:relative; display:block;",e.parentNode.insertBefore(n,e),n.appendChild(e));const r=document.createElement("span");r.className="number-format-overlay";const i=s?"34px":"14px";r.style.cssText=`
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
        `,getComputedStyle(n).position==="static"&&(n.style.position="relative");function o(){const l=parseFloat(e.value);!isNaN(l)&&l>=1e3&&document.activeElement!==e?(r.textContent=uu(l),r.style.display="block",e.style.color="transparent"):(r.style.display="none",e.style.color="")}e._updateOverlay=o,e.addEventListener("focus",()=>{r.style.display="none",e.style.color=""}),e.addEventListener("blur",o),e.addEventListener("input",()=>{document.activeElement===e&&(r.style.display="none",e.style.color="")}),n.appendChild(r),o()})}function gl(){document.querySelectorAll('input[type="number"]').forEach(t=>{t._updateOverlay&&t._updateOverlay()})}setTimeout(()=>{_y(),Ey()},100);const PA=new MutationObserver(t=>{let e=!1;t.forEach(n=>{n.addedNodes.forEach(s=>{var r,i;s.nodeType===1&&((r=s.matches)!=null&&r.call(s,'input[type="number"]')||(i=s.querySelector)!=null&&i.call(s,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{_y(),Ey()},50)});PA.observe(document.body,{childList:!0,subtree:!0});let Ir=null;async function hu(t,e=null){Xi(),cy(),ni(),si(),document.getElementById("mainApp").classList.remove("hidden"),jx().then(()=>{cr("ss",!0),cr("ds",!0);const o=document.getElementById("adminGearBtn");o&&(o.style.display=Wx()?"inline-block":"none")}),document.getElementById("userEmail").textContent=t.email,await Pr();const n=await Og();fu(n),await xn(),await dr(),Ac(),vy(),by(),yy();const s=e||(n.includes("decision")?"decision":"stress");document.querySelectorAll(".tab").forEach(o=>o.classList.remove("active"));const r=document.querySelector(`.tab[data-tab="${s}"]`);r&&r.classList.add("active"),document.querySelectorAll(".tab-content").forEach(o=>o.classList.remove("active"));const i=document.getElementById(`${s}-content`);i&&i.classList.add("active")}function fu(t){const e={decision:["decision"],stress:["stress"]};document.querySelectorAll(".tab").forEach(s=>{const r=s.dataset.tab;let i=!1;for(const[o,l]of Object.entries(e))if(l.includes(r)){i=t.includes(o);break}Object.values(e).flat().includes(r)||(i=!0),s.style.display=i?"":"none"})}window.openToolSettingsTab=function(t){const e=t==="decision"?'.sub-tab[data-decisiontab="decisionsettings"]':'.sub-tab[data-stresstab="stresssettings"]',n=document.querySelector(e);n&&n.click()};async function xc(t){try{const e=s=>!!s.baseSalary&&+s.baseSalary!=3e4;if(t==="decision"){const s=await wt();return!!s.configured||e(s)||await oi()}const n=await ct();return!!n.configured||e(n)}catch{return!0}}async function pu(){const t=document.getElementById("dsSetupBanner"),e=document.getElementById("ssSetupBanner");t&&(t.style.display=await xc("decision")?"none":"block"),e&&(e.style.display=await xc("stress")?"none":"block")}async function Ac(){try{const t=await ct(),e=await wt();pu(),document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",document.getElementById("dsDuration").value=e.duration||35,writeAlloc("ds",e.equityMin??25e4,e.bondMin??2e5,e.cashTarget??5e4,e.diversifierStart||0),restoreCustomAllocFromSettings("ds",e),window._taggedFunds.ds=(e.taggedFunds||[]).map(s=>({...s})),setAllocMode("ds",e.allocMode||(e.taggedFunds&&e.taggedFunds.length?"funds":"risk")),updateEntryTagPrompt(),document.getElementById("dsEquityGlide").checked=e.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsIsaBalance").value=e.isaBalance||0,document.getElementById("dsAccessMethod").value=e.accessMethod||"drawdown",document.getElementById("dsUfplsYears").value=e.ufplsYears||"",document.getElementById("dsUfplsPcls").checked=!!e.ufplsThenPcls,document.getElementById("dsBandFillRecycle").checked=!!e.bandFillRecycle,syncAccessButtons("ds"),document.getElementById("dsSpendingProfile").value=e.spendingProfile||"flat",document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",Sc("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||15e3,document.getElementById("dsDisableProtection").checked=e.disableProtection||!1,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,gu(t),document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(s=>({...s})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssDbAmount").value=t.dbAmount||0,document.getElementById("ssDbStartYear").value=t.dbStartYear||0,document.getElementById("ssDbIndexation").value=t.dbIndexation||"lpi5",document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",Sc("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0,document.getElementById("ssAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("ssUfplsYears").value=t.ufplsYears||"",document.getElementById("ssUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("ssBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ss");const n=document.getElementById("ssSeedNote");n&&(n.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),gl(),console.log("All inputs initialized from stored settings")}catch(t){console.error("Error initializing inputs from settings:",t)}}async function Ty(t){console.log("Wizard completed with data:",t);const e=parseInt(t.retirementAge)||60,n=parseInt(t.currentAge)||e,s=95,r=Math.max(5,s-Math.max(n,e));try{const c={duration:r},d={duration:r};await qI(t.scenarioName||"My plan","",["stress","decision"],{stressSettings:c,decisionSettings:d},!0),Ms(),ss();try{const h=await fl();h.currentAge=parseInt(t.currentAge)||h.currentAge,h.retirementAge=e,h.endAge=s,h.retired=!!t.retired,h.sharedWithPartner=t.household==="couple",t.household==="couple"&&(h.partnerAge=parseInt(t.partnerAge)||null,h.partnerRetirementAge=parseInt(t.partnerRetirementAge)||null,h.partnerRetired=!!t.partnerRetired),await iu(h)}catch(h){console.warn("Could not seed budget from wizard:",h)}}catch(c){console.error("Error creating scenario from wizard:",c)}const i=kn(),o=t.startAt||"budget";o==="budget"&&(window._budWizAutoOpen=!0),await hu(i);const l=document.querySelector('.tab[data-tab="'+o+'"]');l&&l.click(),(o==="decision"||o==="stress")&&!await xc(o)&&(openToolSettingsTab(o),showToast("First, set up this plan: your pot, spending need and State Pension.","info",6e3))}async function Iy(){if(si(),await Ig()){document.getElementById("mainApp").classList.remove("hidden");const e=document.getElementById("scenarioDropdown");e&&e.classList.add("open"),showToast("Plan creation cancelled — you’re back on your current plan.","info",3500)}else Pa(kn())}function Pa(t){Xi(),cy();const e=t.displayName||t.email.split("@")[0];document.getElementById("onboardingPage").style.display="block",dy(document.getElementById("onboardingPage"),e,()=>{ni(),document.getElementById("setupWizard").style.display="block",hy(document.getElementById("setupWizard"),Ty,Iy)})}iA(document.getElementById("authScreen"),async t=>{console.log("Auth success callback triggered for:",t.email);try{console.log("Checking for existing cloud data...");const e=await Ig();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),Xi(),hu(t)):(console.log("New user - showing onboarding page"),Pa(t))}catch(e){console.error("Error in auth callback:",e),Pa(t)}});nA(document.getElementById("landingPage"),{onGetStarted:()=>{Xi(),Zi("signup")},onSignIn:()=>{Xi(),Zi("signin")}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{Ms(),ss(),Cn(),await Ud(),document.getElementById("mainApp").classList.add("hidden"),ni(),si(),Zi("signin")}catch(t){console.error("Logout error:",t)}});async function kc(){const t=document.getElementById("planLockChip");if(!t)return;const e=await oi();t.style.display="inline-block",t.textContent=e?"🔒 locked":"✏️ draft",t.title=e?"This plan’s settings are committed so your recorded entries stay consistent. Click for details.":"This plan’s settings are still editable. Saving the Decision settings commits (locks) the plan. Click for details.",t.style.cursor="pointer",t.onclick=n=>{n.stopPropagation(),explainPlanLock(e)}}window.explainPlanLock=function(t){let e=document.getElementById("planLockExplainer");e&&e.remove(),e=document.createElement("div"),e.id="planLockExplainer",e.style.cssText="position:fixed; inset:0; z-index:1300; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; padding:20px;",e.innerHTML=`<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; max-width:560px; width:100%; padding:26px; font-size:15px; line-height:1.6;"><h2 style="margin-bottom:12px;">Plans — and why they lock 🔒</h2><p style="margin-bottom:10px; color:var(--text-muted);">A <strong style="color:var(--text);">plan</strong> is a named scenario: its settings (pots, spending target, State Pension, rules) plus everything you record against them — monthly decisions and tax years. You can keep several plans and switch or duplicate them from this dropdown.</p><p style="margin-bottom:10px; color:var(--text-muted);">When you save a plan’s Decision settings, the plan <strong style="color:var(--text);">locks</strong>: the settings freeze so your recorded history stays meaningful — a decision saved under one set of rules shouldn’t be silently re-judged under another.</p><ul style="margin:0 0 12px 18px; color:var(--text-muted);"><li><strong style="color:var(--text);">✏️ draft</strong> — settings still editable; nothing committed yet.</li><li><strong style="color:var(--text);">🔒 locked, nothing recorded</strong> — you can unlock and edit freely.</li><li><strong style="color:var(--text);">🔒 locked with history</strong> — settings can’t change; duplicate into a new plan instead.</li></ul><p style="margin-bottom:16px; color:var(--text-muted);">The Budget and the Stress Tester are never locked — the budget autosaves like a document, and Stress is a sandbox for what-ifs.</p><div style="display:flex; gap:10px; flex-wrap:wrap;"><button type="button" onclick="document.getElementById('planLockExplainer').remove()">Got it</button>`+(t?`<button type="button" class="risk-btn" onclick="document.getElementById('planLockExplainer').remove(); document.querySelector('.tab[data-tab=&quot;decision&quot;]').click(); openToolSettingsTab('decision');">View the locked settings</button>`:"")+"</div></div>",e.addEventListener("click",n=>{n.target===e&&e.remove()}),document.body.appendChild(e)};async function Pr(){var r;const t=await Gd(),e=t.find(i=>i.isActive),n=document.getElementById("scenarioActiveName");n&&(n.textContent=e&&(((r=e.planDetails)==null?void 0:r.name)||e.name)||"No Plan"),await kc();const s=document.getElementById("scenarioList");if(s){if(t.length===0){s.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}s.innerHTML=t.map(i=>{var c,d;const o=((c=i.planDetails)==null?void 0:c.name)||i.name||"Unnamed Plan",l=((d=i.planDetails)==null?void 0:d.description)||i.description||"";return`
        <div class="scenario-dropdown-item ${i.isActive?"active":""}" data-scenario-id="${i.id}">
          <div>
            <div class="scenario-item-name">${o}</div>
            ${l?`<div class="scenario-item-desc">${l}</div>`:""}
          </div>
          <div class="scenario-item-actions">
            ${i.isActive?`<button class="scenario-tools-btn" data-id="${i.id}" data-tools="${(i.enabledTools||["stress","decision"]).join(",")}" title="Edit Tools">&#9881;</button>`:""}
            <button class="scenario-rename-btn" data-id="${i.id}" data-name="${o}" title="Rename">&#9998;</button>
            ${t.length>1?`<button class="scenario-delete-btn" data-id="${i.id}" data-name="${o}" title="Delete">&times;</button>`:""}
          </div>
        </div>
      `}).join(""),s.querySelectorAll(".scenario-dropdown-item").forEach(i=>{i.addEventListener("click",async o=>{if(o.target.closest(".scenario-item-actions"))return;const l=i.dataset.scenarioId;if(!l)return;const c=t.find(d=>d.isActive);if(c&&c.id===l){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await HI(l),Ms(),ss(),document.getElementById("scenarioDropdown").classList.remove("open"),yy(),vy(),by();const d=await Og();fu(d);const h=document.querySelector(".tab.active");if(h&&h.style.display==="none"){const m=document.querySelector('.tab:not([style*="display: none"])');if(m){document.querySelectorAll(".tab").forEach(T=>T.classList.remove("active")),m.classList.add("active"),document.querySelectorAll(".tab-content").forEach(T=>T.classList.remove("active"));const p=m.dataset.tab+"-content",w=document.getElementById(p);w&&w.classList.add("active")}}await xn(),await dr(),await Ac(),await Pr()}catch(d){console.error("Error switching scenario:",d),showToast("Failed to switch plan: "+d.message,"error")}})}),s.querySelectorAll(".scenario-rename-btn").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const l=i.dataset.id,c=i.dataset.name,d=prompt("Rename plan:",c);if(d&&d.trim()&&d.trim()!==c)try{await YI(l,d.trim()),await Pr()}catch(h){console.error("Error renaming scenario:",h),showToast("Failed to rename plan: "+h.message,"error")}})}),s.querySelectorAll(".scenario-tools-btn").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const l=i.dataset.id,c=(i.dataset.tools||"stress,decision").split(",");document.getElementById("scenarioDropdown").classList.remove("open"),MA(l,c)})}),s.querySelectorAll(".scenario-delete-btn").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const l=i.dataset.id,c=i.dataset.name;if(confirm(`Delete plan "${c}"? This cannot be undone.`))try{await jI(l),Ms(),ss(),await xn(),await dr(),await Ac(),await Pr()}catch(d){console.error("Error deleting scenario:",d),showToast("Failed to delete plan: "+d.message,"error")}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",t=>{t.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",t=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(t.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden");const t=()=>{ni(),document.getElementById("setupWizard").style.display="block",hy(document.getElementById("setupWizard"),Ty,Iy)},e=kn(),n=e&&(e.displayName||(e.email||"").split("@")[0])||"there",s=document.getElementById("onboardingPage");s.style.display="block",dy(s,n,t,{title:"A new plan — here’s the flow",subtitle:"A quick refresher on how the pieces fit together before you set it up.",ctaLabel:"Set up the new plan",onSkip:t})});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{var s;document.getElementById("scenarioDropdown").classList.remove("open");const t=await Rt();if(!t){showToast("No active plan to duplicate.","error");return}const e=((s=t.planDetails)==null?void 0:s.name)||t.name||"My Plan",n=prompt("Name for the copy:",e+" (copy)");if(!(!n||!n.trim()))try{await WI(t.id,n.trim()),await Pr()}catch(r){console.error("Error duplicating scenario:",r),showToast("Failed to duplicate plan: "+r.message,"error")}});function MA(t,e){const n=document.getElementById("editToolsModal");n&&n.remove();const s=e.includes("stress"),r=e.includes("decision"),i=document.createElement("div");i.id="editToolsModal",i.className="edit-tools-overlay",i.innerHTML=`
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
      `,document.body.appendChild(i),document.getElementById("editToolsCancel").addEventListener("click",()=>i.remove()),i.addEventListener("click",o=>{o.target===i&&i.remove()}),document.getElementById("editToolsSave").addEventListener("click",async()=>{const o=[];if(document.getElementById("editToolStress").checked&&o.push("stress"),document.getElementById("editToolDecision").checked&&o.push("decision"),o.length===0){showToast("Please select at least one tool","error");return}const l=o.filter(c=>!e.includes(c));try{await GI(t,o);const c=await Rt();if(c&&c.id===t){fu(o);const d=document.querySelector(".tab.active");if(d&&d.style.display==="none"){const h=document.querySelector('.tab:not([style*="display: none"])');if(h){document.querySelectorAll(".tab").forEach(w=>w.classList.remove("active")),h.classList.add("active"),document.querySelectorAll(".tab-content").forEach(w=>w.classList.remove("active"));const m=h.dataset.tab+"-content",p=document.getElementById(m);p&&p.classList.add("active")}}}if(await Pr(),i.remove(),l.length>0){let d=null;try{if(l.includes("stress")&&e.includes("decision")){const p=await wt();p&&(d={source:"decision",...p})}else if(l.includes("decision")&&e.includes("stress")){const p=await ct();p&&(d={source:"stress",...p})}}catch(p){console.warn("Could not load existing settings for pre-fill:",p)}const h=document.getElementById("setupWizard");h.style.display="block",document.getElementById("mainApp").style.display="none",IA(h,l,async p=>{si();try{l.includes("stress")&&(await Eo({equityMin:p.equityMin,bondMin:p.bondMin,cashTarget:p.cashTarget,isaBalance:p.isaBalance||0,duration:p.duration,baseSalary:p.baseSalary,other:p.otherIncome||0,taxMode:p.taxMode||"inflates",equityGlideEnabled:p.equityGlideEnabled||!1}),ss()),l.includes("decision")&&(await or({equityMin:p.decisionEquity,bondMin:p.decisionBond,cashTarget:p.decisionCash,isaBalance:p.decisionIsaBalance||0,duration:p.decisionDuration,baseSalary:p.decisionSalary,spStartDate:p.spStartDate||null,spWeeklyAmount:p.spWeeklyAmount||0,equityGlideEnabled:p.decisionEquityGlideEnabled||!1}),Ms())}catch(w){console.error("Error saving new tool settings:",w)}await hu(),showToast("New tool configured successfully","success")},d)}else showToast("Tools updated","success")}catch(c){console.error("Error updating scenario tools:",c),showToast("Failed to update tools: "+c.message,"error")}})}const Cc=60*60*1e3,Sy="pt_lastActivity";let la=null,Wf=0;function xy(){const t=Date.now();if(t-Wf>1e4){Wf=t;try{localStorage.setItem(Sy,String(t))}catch{}}}function DA(){try{return+localStorage.getItem(Sy)||0}catch{return 0}}async function Ay(){if(!lt())return;const t=Date.now()-DA();if(t<Cc){la=setTimeout(Ay,Math.max(6e4,Cc-t));return}showToast("You have been logged out due to inactivity (1 hour).","info",5e3);try{Ms(),ss(),Cn(),await Ud(),document.getElementById("mainApp").classList.add("hidden"),ni(),si(),Zi("signin")}catch(e){console.error("Auto-logout error:",e)}}function ky(){la&&clearTimeout(la),lt()&&(la=setTimeout(Ay,Cc))}const BA=["mousedown","mousemove","keydown","scroll","touchstart","click"];BA.forEach(t=>{document.addEventListener(t,()=>{xy(),ky()},{passive:!0})});xy();ky();bg(t=>{const e=!document.getElementById("mainApp").classList.contains("hidden");!t&&e&&(document.getElementById("mainApp").classList.add("hidden"),ni(),si(),Zi("signin"),showToast("You’ve been signed out — sign in again to continue. Unsaved changes in open forms were not stored.","warning",8e3))});document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await Tg(),console.log("Data wiped successfully"),Ms(),ss(),Cn(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden");const n=kn();Pa(n),showToast("All data has been deleted. Set up a new plan to start fresh.","success",4e3)}catch(n){console.error("Reset error:",n),showToast("Error resetting data: "+n.message,"error")}});document.getElementById("deleteAccountBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ DELETE YOUR ACCOUNT?

This permanently deletes your login AND all saved data:

• All plans and settings
• All portfolio/decision history
• Your household budget

This cannot be undone.`)||!confirm(`FINAL WARNING

Your account and every piece of data will be gone forever.

Delete everything?`)))try{await Tg(),Ms(),ss(),Cn(),localStorage.clear(),await kI(),showToast("Your account and all data have been deleted.","success",4e3),setTimeout(()=>window.location.reload(),1500)}catch(n){console.error("Delete account error:",n),n.code==="auth/requires-recent-login"?showToast("For security, please sign out, sign back in, and press Delete Account again.","error",8e3):showToast("Error deleting account: "+n.message,"error")}});document.querySelectorAll(".tab").forEach(t=>{t.addEventListener("click",async()=>{if(t.dataset.tab!=="stress"){LA();const e=document.getElementById("optimiseResultsMC"),n=document.getElementById("optimiseResultsHist");e&&(e.innerHTML=""),n&&(n.innerHTML="")}document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${t.dataset.tab}-content`).classList.add("active"),t.dataset.tab==="stress"&&await vl(),t.dataset.tab==="budget"&&await n1(),t.dataset.tab==="accumulation"&&await loadAccumulationUI()})});const yi=document.querySelector(".tabs"),Yf=document.querySelector(".tabs-wrapper");if(yi&&Yf){const t=()=>{const e=yi.scrollLeft+yi.clientWidth>=yi.scrollWidth-10;Yf.classList.toggle("scrolled-end",e)};yi.addEventListener("scroll",t),t()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>{t.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${t.dataset.stresstab}`).classList.remove("hidden"),t.dataset.stresstab==="stresssettings"&&await vl()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>{t.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${t.dataset.decisiontab}`).classList.remove("hidden"),t.dataset.decisiontab==="decisionsettings"&&await bl(),t.dataset.decisiontab==="history"&&await xn(),t.dataset.decisiontab==="taxyears"&&await dr()})});async function Gf(t,e,n,s){var o,l;const r=await wt(),i=r.equityGlideEnabled?{...r,equityGlide:qg(r)}:r;return tA(t,e,n,s,{settings:i,history:await Os(),allTaxYears:await ds(),spInfo:await Kd(ay(t)),isaBalance:parseFloat((o=document.getElementById("entryIsa"))==null?void 0:o.value)||0,diversifier:parseFloat((l=document.getElementById("entryDiversifier"))==null?void 0:l.value)||0})}function mu(t,e,n){if(t<1e4&&e<1e4&&n<1e4&&t+e+n>0){const r=i=>"£"+Math.round(i||0).toLocaleString();return confirm(`These fund values look low — Equity ${r(t)}, Bond ${r(e)}, Cash ${r(n)}.

Enter absolute amounts in pounds, to the single pound (e.g. 250000, not 250).

Continue anyway?`)}return!0}window.handleDecisionSubmit=async function(t){t.preventDefault();const e=document.getElementById("entryMonth").value,n=parseFloat(document.getElementById("entryEquity").value)||0,s=parseFloat(document.getElementById("entryBond").value)||0,r=parseFloat(document.getElementById("entryCash").value)||0,i=[];if(e||i.push("Month"),!n&&n!==0&&i.push("Equity Fund"),!s&&s!==0&&i.push("Bond Balance"),!r&&r!==0&&i.push("Cash Balance"),i.length>0){showToast("Missing: "+i.join(", "),"error",4e3);return}if(!mu(n,s,r))return;if((await Os({limit:1e3})).find(c=>c.date===e)){showToast(`${Wr(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await Mx(e)).showWizard){const h=document.getElementById("taxYearWizard");h.style.display="block",window._pendingDecisionForm={dateStr:e,equity:n,bond:s,cash:r},Px(h,e,async m=>{if(h.style.display="none",m&&m.completed)try{Ir=await Gf(e,n,s,r);const p=document.getElementById("decisionOutput");Nf(Ir,p),document.getElementById("saveBtn").disabled=!1}catch(p){console.error("Decision error after wizard:",p),showToast("Error: "+p.message,"error")}});return}Ir=await Gf(e,n,s,r);const d=document.getElementById("decisionOutput");Nf(Ir,d),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),showToast("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const t=document.getElementById("saveBtn");if(!Ir){showToast("No decision to save","error");return}if(!lt()){showToast("Please sign in to save decisions","error");return}t.classList.add("loading"),t.disabled=!0;try{await dS(Ir),showToast("Decision saved to history","success"),await xn()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error"),t.disabled=!1}finally{t.classList.remove("loading")}};function gu(t){const e=r=>"£"+Math.round(r||0).toLocaleString(),n=(t.diversifierStart||0)>0?` · Diversifiers ${e(t.diversifierStart)}`:"",s=`Starting balances come from your <strong>Settings</strong> (Fund Minimums): Equity ${e(t.equityMin)} · Bond ${e(t.bondMin)}${n} · Cash ${e(t.cashTarget)}. Edit them in the Settings tab.`;["mcStartSummary","histStartSummary","scenStartSummary"].forEach(r=>{const i=document.getElementById(r);i&&(i.innerHTML=s)}),["mcYears","histYears"].forEach(r=>{const i=document.getElementById(r);i&&(i.value=t.duration)})}window.runMonteCarloUI=async function(){const t=await ct(),e={years:parseInt(document.getElementById("mcYears").value)||t.duration},n=document.getElementById("optimiseResultsMC");n&&(n.innerHTML=""),document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:s,stats:r}=$x(e);my=s,Py(r,s,"Monte Carlo (1000 runs)","mcResults",e.years)}catch(s){console.error("Simulation error:",s),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${s.message}</div>`}},50)};window.runHistoricalUI=async function(){const t=await ct(),e={years:parseInt(document.getElementById("histYears").value)||t.duration},n=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:s,stats:r}=qx(e);gy=s,Py(r,s,"Historical Analysis","histResults",e.years)}catch(s){console.error("Simulation error:",s),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${s.message}</div>`}},50)};window.runScenariosUI=async function(){await ct();const t={};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',setTimeout(()=>{try{const e=Hx(t);HA(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};let gs=!1,Si=0;function LA(){Si++}window.runOptimisationUI=async function(t){if(gs)return;gs=!0;const e=++Si,n=document.getElementById("optimiseBtn"+t),s=document.getElementById("optimiseResults"+t);n&&(n.disabled=!0),n&&(n.textContent="Optimising..."),s.innerHTML='<div class="loading"><div class="spinner"></div>Preparing optimisation...</div>';const r=await ct(),i=JSON.parse(JSON.stringify(r)),o=document.getElementById(t==="MC"?"mcYears":"histYears"),l=parseInt(o&&o.value)||i.duration,c=(i.equityMin||0)+(i.bondMin||0)+(i.cashTarget||0);if(e!==Si){gs=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const d=[];for(let b=5;b<=90;b+=5)for(let E=5;E<=95-b;E+=5){const x=100-b-E;x>=0&&d.push({equity:Math.round(c*E/100),bond:Math.round(c*x/100),cash:Math.round(c*b/100)})}const{EQUITY_RETURNS:h,INFLATION:m}=window._constants,{simulate:p,monteCarloReturns:w}=window._simEngine,T=Object.keys(h).map(Number).sort((b,E)=>b-E),S=Math.max(...T),A=b=>{const E={...i,equityMin:b.equity,bondMin:b.bond,cashTarget:b.cash},x=ti({years:l},E),y=[];if(t==="MC")for(let F=0;F<1e3;F++)y.push(p(x,w(x,F),F));else T.forEach(F=>{if(F+l-1>S)return;const X={equity:{},inflation:{}};for(let Se=0;Se<l;Se++)X.equity[Se]=h[F+Se]||0,X.inflation[Se]=m[F+Se]||.025;y.push(p(x,X,F))});const te=y.filter(F=>F.failed);y.filter(F=>!F.failed);const oe=(y.length-te.length)/y.length*100,q=y.reduce((F,X)=>F+Math.min(1,(X.years||0)/(X.duration||l)),0)/y.length*100,se=y.map(F=>F.protMonths).reduce((F,X)=>F+X,0)/y.length,ae=y.filter(F=>F.protMonths>0).length,we=y.map(F=>F.failed?0:F.finalReal||0).sort((F,X)=>F-X),Ie=we.length?we[Math.floor(we.length*.5)]:0,ie=we.length?we[Math.floor(we.length*.9)]:0;return{equity:b.equity,bond:b.bond,cash:b.cash,rate:oe,coverage:q,avgProt:se,withProt:ae,totalRuns:y.length,medianFinal:Ie,p90Final:ie}};let P;try{const b={equity:i.equityMin||0,bond:i.bondMin||0,cash:i.cashTarget||0},E=A(b);P={...b,...E}}catch(b){console.error("Optimisation error (original):",b),s.innerHTML='<div class="alert alert-danger">Error: '+b.message+"</div>",gs=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const C=10;let L=0;const D=[];let O=null;function $(b){const E=Math.max(...b.map(y=>y.coverage)),x=b.filter(y=>y.coverage>=E-.5);return x.sort((y,te)=>y.avgProt-te.avgProt||te.medianFinal-y.medianFinal),x[0]}function I(b,E){return Math.round(b.equity)===Math.round(E.equity)&&Math.round(b.bond)===Math.round(E.bond)&&Math.round(b.cash)===Math.round(E.cash)}function v(){if(e!==Si){gs=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),s.innerHTML="";return}try{const b=Math.min(L+C,d.length);for(;L<b;L++)D.push(A(d[L]));s.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations... '+L+"/"+d.length+"</div>",L<d.length?setTimeout(v,0):(O=$([...D,P]),_())}catch(b){console.error("Optimisation error:",b),s.innerHTML='<div class="alert alert-danger">Error: '+b.message+"</div>",gs=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}}function _(){if(e!==Si){gs=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),s.innerHTML="";return}const b=c>0?P.cash/c*100:0,E=c>0?P.equity/c*100:0,y=b>90||b<5||E<5?'<div class="alert alert-info" style="margin-bottom:16px;font-size:13px;">Your current split is outside the range the optimiser sweeps, but it was included in this comparison.</div>':"",te=O&&!I(O,P)&&(O.coverage>P.coverage+.5||O.coverage>=P.coverage-.01&&O.avgProt<P.avgProt-3),oe=(ne,se)=>{const ae=we=>Math.round(we/c*100);return'<div style="padding:16px;border-radius:8px;'+(se?"background:rgba(46,160,67,0.1);border:1px solid var(--success);":"background:rgba(0,0,0,0.2);")+'"><div style="font-weight:500;margin-bottom:10px;color:var(--'+(se?"success":"text-muted")+');">'+(se?"Optimised split":"Your current split")+'</div><div style="font-size:26px;font-weight:700;color:var(--'+(se?"success":"warning")+');">'+ne.coverage.toFixed(0)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">of retirement years funded'+(se?" ("+(O.coverage-P.coverage>=0?"+":"")+(O.coverage-P.coverage).toFixed(0)+"%)":"")+'</div><div style="font-size:13px;">Equity '+ae(ne.equity)+"% · Bonds "+ae(ne.bond)+"% · Cash "+ae(ne.cash)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">'+ne.rate.toFixed(0)+"% never run out · "+j(ne.medianFinal)+" typically left</div></div>"};let q="";if(te){const ne=O.medianFinal-P.medianFinal,se=P.medianFinal>0?ne/P.medianFinal*100:0;q+='<div class="card" style="margin-top:20px;border-color:var(--success);">',q+='<h3 style="color:var(--success);margin-top:0;">A better fund split</h3>',q+='<p style="color:var(--text-muted);margin-bottom:16px;">This split funds more of your retirement (higher coverage). Coverage credits a plan for every year it pays for, so it prefers splits that fall short late over ones that fail early.</p>',q+=y,q+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">'+oe(P,!1)+oe(O,!0)+"</div>",ne<0?q+='<div class="alert alert-warning" style="margin-bottom:16px;"><strong>Trade-off:</strong> it typically leaves '+Math.abs(se).toFixed(0)+"% less at the end (usually less equity) — more safety, a bit less upside.</div>":ne>0&&(q+='<div class="alert alert-info" style="margin-bottom:16px;"><strong>Bonus:</strong> it also typically leaves '+se.toFixed(0)+"% more at the end.</div>"),q+='<button onclick="applyOptimisedAllocationUI('+O.equity+","+O.bond+","+O.cash+')" style="width:100%;">Apply this split to your Settings</button>',q+="</div>"}else q+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',q+='<h3 style="color:var(--primary);margin-top:0;">Your split is already about as good as it gets</h3>',q+=y,q+='<p style="color:var(--text-muted);">We tested '+d.length+" fund splits. Yours funds "+P.coverage.toFixed(0)+"% of retirement years — the best, or within 0.5% of it, with no clearly better low-protection alternative.</p>",q+='<p style="font-size:13px;color:var(--text-muted);">Your split — Equity '+Math.round(E)+"% · Bonds "+Math.round(P.bond/c*100)+"% · Cash "+Math.round(b)+"% · "+P.rate.toFixed(0)+"% never run out.</p>",q+="</div>";s.innerHTML=q,gs=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}setTimeout(v,0)};window.applyOptimisedAllocationUI=async function(t,e,n){if(writeAlloc("ss",t,e,n),writeAlloc("ds",t,e,n),gu({equityMin:t,bondMin:e,cashTarget:n,duration:parseInt(document.getElementById("ssDuration").value)||35}),gl(),lt())try{await Eo({equityMin:t,bondMin:e,cashTarget:n})}catch(s){console.error("Error saving optimised settings:",s)}showToast("Optimised allocation applied to settings and starting values. Scroll up to re-run.","success",4e3)};const NA={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function OA(t){if(!t||t.length===0)return"";const e=t.filter(i=>i.failed).sort((i,o)=>i.years-o.years),n=t.filter(i=>i.protMonths>0).sort((i,o)=>o.protMonths-i.protMonths),s=e.length>0?e.slice(0,5):n.slice(0,5);if(s.length===0)return"";let r=`
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
      `;return s.forEach(i=>{const o=i.startYear||i.seed,l=NA[o]||"-",c=i.failed?"danger":"success";r+=`
          <tr>
            <td>${o}</td>
            <td style="font-size: 12px;">${l}</td>
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
      `,r}function Gn(t){return`<span class="hlp" tabindex="0" data-tip="${String(t).replace(/"/g,"&quot;")}">?</span>`}function FA(){if(window.__helpTipInit)return;window.__helpTipInit=!0;const t=document.createElement("div");t.className="help-tip",t.style.display="none",document.body.appendChild(t);let e=null;const n=r=>{const i=r.getAttribute("data-tip");if(!i)return;clearTimeout(e),t.textContent=i,t.style.display="block";const o=r.getBoundingClientRect(),l=Math.min(260,window.innerWidth-24);t.style.width=l+"px";let c=o.left+o.width/2-l/2+window.scrollX;c=Math.max(12+window.scrollX,Math.min(c,window.scrollX+window.innerWidth-l-12)),t.style.left=c+"px";const d=t.offsetHeight;let h=o.top+window.scrollY-d-8;o.top<d+12&&(h=o.bottom+window.scrollY+8),t.style.top=h+"px"},s=()=>{e=setTimeout(()=>{t.style.display="none"},80)};document.addEventListener("mouseover",r=>{const i=r.target.closest&&r.target.closest("[data-tip]");i&&n(i)}),document.addEventListener("mouseout",r=>{r.target.closest&&r.target.closest("[data-tip]")&&s()}),document.addEventListener("focusin",r=>{const i=r.target.closest&&r.target.closest("[data-tip]");i&&n(i)}),document.addEventListener("focusout",r=>{r.target.closest&&r.target.closest("[data-tip]")&&s()}),document.addEventListener("click",r=>{const i=r.target.closest&&r.target.closest("[data-tip]");i&&(t.style.display==="block"?s():n(i))})}function VA(){if(window.__chartHoverInit)return;window.__chartHoverInit=!0;const t=e=>e.querySelectorAll("circle[data-tip]").forEach(n=>{n.setAttribute("fill","transparent"),n.removeAttribute("stroke")});document.addEventListener("mousemove",e=>{const n=e.target.closest&&e.target.closest(".ichart");if(!n)return;const s=n.querySelectorAll("circle[data-tip]");if(!s.length)return;let r=null,i=1/0;s.forEach(o=>{const l=o.getBoundingClientRect(),c=Math.abs(l.left+l.width/2-e.clientX);c<i&&(i=c,r=o)}),r&&(t(n),r.setAttribute("fill","#60a5fa"),r.setAttribute("stroke","var(--surface,#161b22)"),r.setAttribute("stroke-width","2"),r.dispatchEvent(new MouseEvent("mouseover",{bubbles:!0})))}),document.addEventListener("mouseout",e=>{const n=e.target.closest&&e.target.closest(".ichart");n&&t(n)})}const Ks=t=>"£"+Math.round(t).toLocaleString();function Cy(t,e,n){return`<svg class="ichart" viewBox="0 0 ${e} ${n}" style="width:100%;height:auto;overflow:visible;display:block" role="img">${t}</svg>`}function Ry(t,{max:e,valueFmt:n=Ks,tip:s,pct:r=!1}={}){const m=t.length;if(m<2)return"";const p=e??(r?100:Math.max(1,...t)),w=D=>56+D/(m-1)*590,T=D=>174-Math.max(0,Math.min(r?100:1/0,D))/p*160,S=t.map((D,O)=>`${w(O).toFixed(1)},${T(D).toFixed(1)}`).join(" "),A=`56,${174 .toFixed(1)} ${S} ${w(m-1).toFixed(1)},${174 .toFixed(1)}`,P=r?[0,50,100]:[0,p/2,p],C=[0,Math.floor((m-1)/2),m-1],L=s||((D,O)=>`Year ${O}: ${n(D)}`);return Cy(P.map(D=>`<line x1="56" y1="${T(D).toFixed(1)}" x2="646" y2="${T(D).toFixed(1)}" stroke="var(--border,#8883)" opacity=".45"/><text x="50" y="${(T(D)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${n(D)}</text>`).join("")+`<polygon points="${A}" fill="rgba(96,165,250,.13)"/><polyline points="${S}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.map((D,O)=>`<circle cx="${w(O).toFixed(1)}" cy="${T(D).toFixed(1)}" r="8" fill="transparent" data-tip="${L(D,O).replace(/"/g,"&quot;")}"></circle>`).join("")+C.map(D=>`<text x="${w(D).toFixed(1)}" y="192" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${D}</text>`).join(""),660,200)}function zA(t){const l=t.p50.length;if(l<2)return"";const c=Math.max(1,...t.p90),d=S=>60+S/(l-1)*606,h=S=>222-Math.max(0,S)/c*208,m=(S,A)=>S.map((P,C)=>`${d(C).toFixed(1)},${h(P).toFixed(1)}`).concat(A.map((P,C)=>`${d(l-1-C).toFixed(1)},${h(A[l-1-C]).toFixed(1)}`)).join(" "),p=S=>S.map((A,P)=>`${d(P).toFixed(1)},${h(A).toFixed(1)}`).join(" "),w=[0,c/4,c/2,3*c/4,c],T=[0,Math.floor((l-1)/2),l-1];return Cy(w.map(S=>`<line x1="60" y1="${h(S).toFixed(1)}" x2="666" y2="${h(S).toFixed(1)}" stroke="var(--border,#8883)" opacity=".4"/><text x="54" y="${(h(S)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${Ks(S)}</text>`).join("")+`<polygon points="${m(t.p90,t.p10)}" fill="rgba(96,165,250,.12)"/><polygon points="${m(t.p75,t.p25)}" fill="rgba(96,165,250,.22)"/><polyline points="${p(t.p50)}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.p50.map((S,A)=>`<circle cx="${d(A).toFixed(1)}" cy="${h(S).toFixed(1)}" r="8" fill="transparent" data-tip="Year ${A}: middle ${Ks(S)}; likely range ${Ks(t.p10[A])} to ${Ks(t.p90[A])}"></circle>`).join("")+T.map(S=>`<text x="${d(S).toFixed(1)}" y="242" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${S}</text>`).join(""),680,250)}function UA(t){if(!t||!t.funded)return"";const e=r=>(r||0).toFixed(r>=10?0:1),n=t.pctSurviveFullTerm>=80?"success":t.pctSurviveFullTerm>=50?"warning":"danger",s=t.avgHigherRateYears<1?"success":t.avgHigherRateYears<4?"warning":"danger";return`
        <h3 style="margin:24px 0 4px;">Your tax-free ISA bridge</h3>
        <p style="color:var(--text-muted);font-size:12px;margin:0 0 12px;">
          The ISA (starting at ${j(t.startBalance)}) is drawn tax-free to top your income up, keeping you out of higher-rate tax. Modelled as a steady money-market fund.
        </p>
        <div class="keynums">
          <div class="keynum ${n}">
            <div class="kn-val">${t.pctSurviveFullTerm.toFixed(0)}%</div>
            <div class="kn-label">of futures the ISA still has real money at the end ${Gn("The ISA is treated as used up once its value in present-day money falls below 5% of what you started with — money-market growth leaves a tiny nominal sliver forever, so an exactly-zero test would be misleading.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${e(t.medianLastedYears)} yrs</div>
            <div class="kn-label">the ISA typically lasts before it's used up ${Gn("Median year its value in present-day money drops below 5% of the starting balance — the point it stops meaningfully topping up your income. Matches the chart below.")}</div>
          </div>
          <div class="keynum ${s}">
            <div class="kn-val">${e(t.avgHigherRateYears)} yrs</div>
            <div class="kn-label">typically paying 40% (higher-rate) tax ${Gn("Years you pay higher-rate income tax because the ISA has run out and income must come from the taxable pension above the basic-rate limit. A bigger ISA reduces these.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${j(t.medianTotalTax)}</div>
            <div class="kn-label">typical lifetime income tax, today's money ${Gn("Median total income tax paid over the whole plan, in present-day spending power.")}</div>
          </div>
        </div>
        <div style="margin-bottom:8px;">
          <div class="chart-caption">Typical ISA balance still to hand, year by year (today's money — hover a point for the figure). A slow, steady fall means it's being drawn as intended; a flat line means it's barely touched (larger than this plan needs); a drop to £0 marks when it typically runs out.</div>
          ${Ry(t.medianIsaByYear,{valueFmt:Ks,tip:(r,i)=>`Year ${i}: typically ${Ks(r)} of ISA left`})}
        </div>`}function $A(t){return t==="sequence"?"The failing futures were sunk by a bad first few years of markets. Holding a bigger cash/bond buffer for the early years, or starting with a slightly lower withdrawal, would let the plan ride out an early slump.":t==="inflation"?"The failing futures were driven by high inflation eroding your spending power. More inflation protection (e.g. index-linked gilts) and less plain cash would help — cash loses to inflation over time.":t==="market"?"The failing futures simply had weak markets throughout. A slightly lower withdrawal rate, or more growth assets (equities) accepting more short-term ups and downs, gives more headroom.":"Lowering your target income, delaying the start, or a larger starting pot would all raise the odds."}function qA(t,e){const n=t.severity||{},s=t.successRate,r=s>=90?{t:"Very likely to last",c:"success"}:s>=75?{t:"Likely to last — with some risk",c:"success"}:s>=50?{t:"At real risk of running out",c:"warning"}:{t:"Unlikely to last as planned",c:"danger"};let i=`<div class="verdict verdict-${r.c}">
        <div class="verdict-title">Will your money last? — ${r.t}</div>
        <div class="verdict-heroes">
          <div><span class="hero">${s.toFixed(0)}%</span>
            <span class="hero-sub">chance your money lasts the whole plan ${Gn("Out of "+e+", the share where your pot never runs out before the end of the plan. Higher is better.")}</span></div>
          <div><span class="hero" style="font-size:30px;">${(n.coverage||0).toFixed(0)}%</span>
            <span class="hero-sub">of retirement years funded (coverage) ${Gn('The average share of retirement years your plan pays for, across every simulated future — so a plan that funds 34 of 35 years scores 97%, and a late shortfall counts far less than an early one. Based on the retirement "coverage ratio" (Estrada & Kritzman, 2019). Note: it is capped at 100% and ignores any money left over, and it is an average — check the worst-case minimum below.')}</span></div>
        </div>
        <div class="verdict-basis">Based on ${e}. Pot and income values are shown in today's money.</div>
      </div>`;return n.failCount>0&&(i+=`<div class="callout">
          <div class="callout-title">Why it might fall short</div>
          <p>${n.diagnosis}</p>
          <p class="lever"><strong>What could help:</strong> ${$A(n.primaryDriver)}</p>
        </div>`),i}function Py(t,e,n,s,r){FA(),VA();const i=t.survival||{},o=t.finalReal||{},l=t.protection||{},c=l.pctWithProtection!=null?l.pctWithProtection:(l.runsWithProtection||0)/(e.length||1)*100,d=s==="mcResults",h=d?`${e.length.toLocaleString()} simulated futures`:`${e.length} historical periods since 1928`;let m=`
        <div class="card">
          <h2>${n}</h2>

          ${qA(t,h)}

          <div class="keynums">
            <div class="keynum">
              <div class="kn-val">${Math.round(i.min||0)} / ${r} yrs</div>
              <div class="kn-label">worst simulated future — money lasted this long ${Gn("The single unluckiest of all the simulated futures — the true tail. The average coverage can look reassuring; this is the worst it ever got. (10th-percentile: at least "+(i.p10||0).toFixed(0)+" years.)")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${j(o.p50||0)}</div>
              <div class="kn-label">typically left at the end, today's money ${Gn("The middle outcome for the pension pot left at the end, in present-day spending power. Futures that ran out count as £0, so this is not flattered by only the lucky runs.")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${c.toFixed(0)} in 100</div>
              <div class="kn-label">futures where the plan had to cut back spending ${Gn("To ride out a market slump the plan temporarily reduces withdrawals. This is how often that safety response was needed.")}</div>
            </div>
          </div>

          <h3 style="margin:8px 0 4px;">How your pot changes over time (today's money)</h3>
          <div class="chart-caption">The blue line is the middle outcome; the darker band is the middle half of futures, the lighter band the 10th–90th. Futures that ran out count as £0, so a sinking band means real risk. Hover any point for the figures.</div>
          ${zA(t.chartData.potBand)}

          <h3 style="margin:22px 0 4px;">Chance your plan is still going, year by year</h3>
          <div class="chart-caption">Share of futures in which the money hasn't run out yet — starts at 100% and dips where plans tend to fail. A late dip means most shortfalls happen late.</div>
          ${Ry(t.chartData.solvency,{pct:!0,valueFmt:p=>p.toFixed(0)+"%",tip:(p,w)=>`Year ${w}: ${p.toFixed(0)}% of plans still going`})}

          ${UA(t.isa)}

          <details style="margin-top:22px;">
            <summary style="cursor:pointer;font-weight:600;color:var(--primary);">More detail — worst historical periods &amp; full statistics</summary>
            <div style="margin-top:16px;">
              ${s==="histResults"?OA(e):""}

              <h4 style="margin:20px 0 8px;">Pot left at the end — full range (today's money)</h4>
              <div class="grid-7" style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;">
                ${[["p5","unluckiest 5%"],["p10","10%"],["p25","25%"],["p50","middle"],["p75","75%"],["p90","90%"],["p95","luckiest 5%"]].map(([p,w])=>`
                  <div class="stat-box mini">
                    <div class="stat-value" style="font-size:13px;">${j(o[p]||0)}</div>
                    <div class="stat-label" style="font-size:10px;">${w}</div>
                  </div>`).join("")}
              </div>
              <p style="font-size:12px;color:var(--text-muted);margin-top:14px;line-height:1.6;">
                Based on ${h}. ${d?"Monte Carlo builds each future by stitching together random 5-year blocks of real history (1928–2024), so market slumps and inflation spikes arrive in realistic sustained runs rather than one-off years.":"Each run replays an actual stretch of history in its real order, capturing the true sequence of good and bad years."}
                A future "runs out" when the pension/cash pots hit zero before the plan ends.
              </p>
            </div>
          </details>
        </div>
      `;document.getElementById(s).innerHTML=m}function HA(t,e){let n='<div class="card"><h2>Scenario Analysis</h2>';n+=`
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
        `}n+="</div></div>",document.getElementById(e).innerHTML=n,setTimeout(()=>{const s=document.getElementById("scenCompChart");s&&t&&AA(s,t,{years:35,title:"Scenario Comparison"})},50)}const yl={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,diversifiers:.12,cash:.13},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.3,diversifiers:.15,cash:.05},adventurous:{key:"adventurous",label:"Adventurous",equity:.65,bond:.15,diversifiers:.15,cash:.05}};function My(t){const e=document.getElementById(t+"Diversifiers");return!!(e&&e.checked)}window._customAlloc=window._customAlloc||{};window._allocMode=window._allocMode||{};function yu(t){return window._allocMode[t]||"risk"}function Dy(t){if(window._customAlloc[t])return window._customAlloc[t];const e=document.querySelector("#"+t+"Risks .risk-card.active"),n=e&&e.dataset.risk||"balanced",s=My(t)?yl:ns;return s[n]||s.balanced}function By(t,e,n,s){s=s||0;const r=s>.001?yl:ns;let i="balanced",o=1/0;for(const l in r){const c=r[l],d=(c.equity-t)**2+(c.bond-e)**2+((c.diversifiers||0)-s)**2+(c.cash-n)**2;d<o&&(o=d,i=l)}return i}window.updateAllocDisplay=function(t){const e=Dy(t),n=Math.round(e.equity*100),s=Math.round(e.bond*100),r=Math.round(e.cash*100),i=Math.round((e.diversifiers||0)*100),o=document.getElementById(t+"AllocAmounts"),l=window._customAlloc[t],c=document.getElementById(t+"Pot");if(l&&c){const $=Math.round((l.equityMin||0)+(l.bondMin||0)+(l.cashTarget||0)+(l.diversifierStart||0));+c.value!==$&&(c.value=$,c._updateOverlay&&c._updateOverlay());const I=document.getElementById(t+"PotDisplay");I&&(I.textContent="£"+$.toLocaleString())}const d=+document.getElementById(t+"Pot").value||0,h=l?l.equityMin:Math.round(d*n/100),m=l?l.bondMin:Math.round(d*s/100),p=l?l.cashTarget:Math.round(d*r/100),w=l?l.diversifierStart||0:Math.round(d*i/100),T=i>0?" &middot; "+i+"% diversifiers":"",S=i>0?" &middot; £"+w.toLocaleString()+" diversifiers":"",A=Math.round(+(document.getElementById(t+"IsaBalance")||{}).value||0),P=A>0?'<br><span style="color:var(--text-muted);">+ £'+A.toLocaleString()+" ISA kept separate (the tax-free bridge)</span>":"";o&&(o.innerHTML="<strong>"+e.label+"</strong> &mdash; "+n+"% shares &middot; "+s+"% bonds"+T+" &middot; "+r+'% cash<br><span style="color:var(--text-muted);">£'+h.toLocaleString()+" shares &middot; £"+m.toLocaleString()+" bonds"+S+" &middot; £"+p.toLocaleString()+" cash</span>"+P);const C=document.getElementById(t+"EquityGlide"),L=!!(C&&C.checked),D=document.getElementById(t+"GlideEndgame");D&&(L&&l?(D.style.display="block",D.innerHTML=YA(t)):D.style.display="none");const O=document.getElementById(t+"GlideMinNote");O&&(L?(O.style.display="block",O.innerHTML=WA(t,e)):O.style.display="none")};function WA(t,e){const n=document.getElementById(t+"Duration"),s=n&&+n.value||35,r=Math.max(5,s-20),i=e.cash,o=e.diversifiers||0,l=1-i-o,c=window._customAlloc[t],d=!!c,h=d&&c.glideEndgame?c.glideEndgame:null,m=d?$g(e.equity,e.bond,h):_o(e.equity,e.bond),p=Math.round(l*m.start*100),w=Math.round(l*m.end*100),T=Math.round(l*(1-m.start)*100),S=Math.round(l*(1-m.end)*100),A=Math.round(i*100),P=Math.round(o*100),C=6,L=314,D=18,O=104,$=O-D,I=Se=>(O-Se*$).toFixed(1),v=(C+(L-C)*Math.min(1,r/s)).toFixed(1),_=I(i),b=I(i+o),E=I(i+o+l*(1-m.start)),x=I(i+o+l*(1-m.end)),y="#6366f1",te="#14b8a6",oe="#94a3b8",q="#f59e0b",ne=o>0?`<polygon points="${C},${_} ${L},${_} ${L},${b} ${C},${b}" fill="${q}"></polygon>`:"",se=`<svg viewBox="0 0 320 122" style="width:100%;height:auto;display:block;" preserveAspectRatio="none"><polygon points="${C},${O} ${L},${O} ${L},${_} ${C},${_}" fill="${oe}"></polygon>`+ne+`<polygon points="${C},${b} ${L},${b} ${L},${x} ${v},${x} ${C},${E}" fill="${te}"></polygon><polygon points="${C},${E} ${v},${x} ${L},${x} ${L},${D} ${C},${D}" fill="${y}"></polygon><line x1="${v}" y1="${D}" x2="${v}" y2="${O}" stroke="rgba(148,163,184,0.9)" stroke-width="1" stroke-dasharray="3,2"></line></svg>`,ae=Se=>`<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${Se};vertical-align:middle;"></span>`,we=o>0?" · "+P+"% diversifiers":"",Ie=o>0?" &nbsp; "+ae(q)+" Diversifiers":"",ie=d?"Now (your funds)":"Starts",F=d?"Rises to"+(h&&h.label?" ("+h.label+")":""):"Then holds ("+e.label+")",X=d?"rises from your holdings, levels off at year "+r:"reaches your mix at year "+r+", then holds";return'<div style="font-weight:600;margin-bottom:6px;">How your mix glides over '+s+" years</div>"+se+'<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:3px;"><span>Now</span><span>'+X+'</span></div><div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:8px;"><span><strong>'+ie+"</strong><br>"+p+"% shares · "+T+"% bonds"+we+" · "+A+'% cash</span><span style="text-align:right;"><strong>'+F+"</strong><br>"+w+"% shares · "+S+"% bonds"+we+" · "+A+'% cash</span></div><div style="font-size:12px;margin-top:8px;">'+ae(y)+" Shares &nbsp; "+ae(te)+" Bonds"+Ie+" &nbsp; "+ae(oe)+" Cash</div>"}window.setRiskPreset=function(t,e){ns[e]&&(window._allocMode[t]="risk",delete window._customAlloc[t],document.querySelectorAll("#"+t+"Risks .risk-card").forEach(n=>n.classList.toggle("active",n.dataset.risk===e)),updateAllocDisplay(t))};window.setAllocMode=function(t,e){window._allocMode[t]=e;const n=document.getElementById(t+"ModeRisk"),s=document.getElementById(t+"ModeFunds");n&&n.classList.toggle("active",e==="risk"),s&&s.classList.toggle("active",e==="funds");const r=document.getElementById(t+"RiskMode"),i=document.getElementById(t+"FundsMode");if(r&&(r.style.display=e==="risk"?"":"none"),i&&(i.style.display=e==="funds"?"":"none"),e==="funds")renderFunds(t),bu(t);else if(delete window._customAlloc[t],!document.querySelector("#"+t+"Risks .risk-card.active")){const o=document.querySelector("#"+t+'Risks .risk-card[data-risk="balanced"]');o&&o.classList.add("active")}updateAllocDisplay(t),typeof updateEntryTagPrompt=="function"&&updateEntryTagPrompt()};function YA(t){const e=window._customAlloc[t]&&window._customAlloc[t].glideEndgame&&window._customAlloc[t].glideEndgame.key||"",n=(s,r)=>'<button type="button" class="risk-btn'+(e===s?" active":"")+`" style="padding:6px 12px;" onclick="setGlideEndgame('`+t+"','"+s+`')">`+r+"</button>";return'<div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;"><strong>Glide towards</strong> — your funds are the start; the tent raises shares over time to this level:</div><div style="display:flex;gap:8px;flex-wrap:wrap;">'+n("cautious","Cautious")+n("balanced","Balanced")+n("adventurous","Adventurous")+"</div>"}window.setGlideEndgame=function(t,e){const n=window._customAlloc[t];if(!n)return;const r=(My(t)?yl:ns)[e];if(!r)return;n.glideEndgame={equityPct:r.equity,bondPct:r.bond,key:e,label:r.label};const i=n.equity/(n.equity+n.bond||1);r.equity/(r.equity+r.bond||1)<=i&&showToast("That endgame isn’t more share-heavy than your holdings — the glide would flatten or decline, not rise.","warning",5e3),updateAllocDisplay(t)};window.readAlloc=function(t){const e=window._customAlloc[t];if(e){const o={equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget};return e.diversifierStart>0&&(o.diversifierStart=e.diversifierStart),e.subAsset&&(o.subAsset=e.subAsset),e.glideEndgame&&(o.glideEndgame=e.glideEndgame),o}const n=+document.getElementById(t+"Pot").value||0,s=Dy(t),r={equityMin:Math.round(n*s.equity),bondMin:Math.round(n*s.bond),cashTarget:Math.round(n*s.cash)},i=s.diversifiers||0;return i>0&&(r.diversifierStart=Math.round(n*i),r.subAsset={}),r};window.writeAlloc=function(t,e,n,s,r){const i=+r||0,o=(+e||0)+(+n||0)+(+s||0)+i;document.getElementById(t+"Pot").value=Math.round(o);const l=document.getElementById(t+"Diversifiers");l&&(l.checked=i>0);const c=o>0?Math.round((+e||0)/o*100):50,d=o>0?Math.round((+n||0)/o*100):40,h=o>0?By((+e||0)/o,(+n||0)/o,(+s||0)/o,i/o):"balanced";document.querySelectorAll("#"+t+"Risks .risk-card").forEach(p=>p.classList.toggle("active",p.dataset.risk===h)),updateAllocDisplay(t);const m=(i>0?yl:ns)[h];if(o>0&&(c!==Math.round(m.equity*100)||d!==Math.round(m.bond*100))){const p=document.getElementById(t+"AllocAmounts");p&&(p.innerHTML+='<div style="margin-top:8px;color:#b45309;font-size:12px;">Your saved split ('+c+"% / "+d+"% / "+Math.max(0,100-c-d)+"%) was matched to the nearest risk level (<strong>"+m.label+"</strong>). Pick another if you prefer — saving keeps this one.</div>")}};window._taggedFunds=window._taggedFunds||{};function jt(t){return window._taggedFunds[t]=window._taggedFunds[t]||[]}const vu={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};function cr(t,e=!1){const n=document.getElementById(t+"FundCatalogue");n&&(e||!n.childElementCount)&&(n.innerHTML=pl().map(s=>'<option value="'+s.ticker+'">'+s.ticker+" — "+s.name+"</option>").join(""))}function Rc(t){const e=(t.ticker||"").toUpperCase().trim(),n=qr(e);return t.subClass||n&&n.subClass||Gg[e]||""}window.reformatMoney=function(t){const e=parseFloat(String(t.value).replace(/[^0-9.]/g,""));t.value=isNaN(e)||e===0?"":uu(e)};function GA(t,e,n){if(t=t.toLowerCase().trim(),!t)return 0;const s=e.toLowerCase(),r=n.toLowerCase();if(s===t)return 1e3;if(s.startsWith(t))return 900-(s.length-t.length);if(r.split(/[^a-z0-9]+/).filter(Boolean).some(l=>l.startsWith(t)))return 820;if(s.includes(t))return 720;if(r.includes(t))return 660-Math.min(50,r.indexOf(t));const o=l=>{let c=0;for(const d of l)if(d===t[c]&&c++,c===t.length)return!0;return!1};return o(s)?360:o(r)?300:0}function jA(t,e=8){return pl().map(n=>({f:n,s:GA(t,n.ticker,n.name)})).filter(n=>n.s>0).sort((n,s)=>s.s-n.s||n.f.ticker.localeCompare(s.f.ticker)).slice(0,e).map(n=>n.f)}window.showFundSearch=function(t,e){const n=document.getElementById(t+"FundSearchResults");if(!n)return;const s=jA(e);if(!e.trim()||!s.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=s.map(r=>`<div class="fund-search-item" onmousedown="addFundFromSearch('`+t+"','"+r.ticker+`')" style="padding:7px 10px; cursor:pointer;"><strong>`+r.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+r.name+"</span></div>").join(""),n.style.display="block"};window.hideFundSearch=function(t){const e=document.getElementById(t+"FundSearchResults");e&&(e.style.display="none")};window.addFundFromSearch=function(t,e){const n=qr(e);jt(t).push({ticker:e,value:"",wrapper:"SIPP",subClass:n?n.subClass:""});const s=document.getElementById(t+"FundSearch");s&&(s.value=""),hideFundSearch(t),renderFunds(t)};function KA(t,e,n){const s=jg();let r='<option value="">— not set —</option>';for(const i of["shares","bonds","diversifiers","cash"]){const o=s[i]||[];o.length&&(r+='<optgroup label="'+vu[i]+'">'+o.map(l=>'<option value="'+l.key+'"'+(l.key===n?" selected":"")+">"+l.label+"</option>").join("")+"</optgroup>")}return`<select onchange="updateFundField('`+t+"',"+e+`,'subClass',this.value)" style="width:190px;">`+r+"</select>"}function QA(t){const e=encodeURIComponent((t||"").toUpperCase().trim()),n=(s,r)=>'<a href="'+s+'" target="_blank" rel="noopener" style="margin-right:8px;">'+r+"</a>";return'<div style="font-size:11px; margin-top:3px; color:var(--text-muted);">Not in our list — how is it invested? Look it up: '+n("https://markets.ft.com/data/search?query="+e,"FT")+n("https://www.morningstar.co.uk/uk/util/SecuritySearchResults.aspx?search="+e,"Morningstar")+n("https://www.justetf.com/uk/search.html?query="+e,"justETF")+"then pick a category.</div>"}function Ly(t,e,n){const s=(n.ticker||"").toUpperCase().trim(),r=s&&!qr(s);return KA(t,e,Rc(n))+(r?QA(s):"")}window.renderFunds=function(t){const e=document.getElementById(t+"FundRows");e&&(cr(t),e.innerHTML=jt(t).map((n,s)=>'<tr><td style="padding:3px 6px;"><input type="text" list="'+t+'FundCatalogue" value="'+(n.ticker||"")+`" oninput="updateFundField('`+t+"',"+s+`,'ticker',this.value)" style="width:92px;text-transform:uppercase;" placeholder="e.g. VWRL"></td><td style="padding:3px 6px;"><input type="text" inputmode="numeric" value="`+(n.value?uu(n.value):"")+`" oninput="updateFundField('`+t+"',"+s+`,'value',this.value)" onblur="reformatMoney(this)" style="width:110px;" placeholder="0"></td><td style="padding:3px 6px;"><select onchange="updateFundField('`+t+"',"+s+`,'wrapper',this.value)" style="width:74px;"><option`+(n.wrapper!=="ISA"?" selected":"")+">SIPP</option><option"+(n.wrapper==="ISA"?" selected":"")+'>ISA</option></select></td><td id="'+t+"_fcat_"+s+'" style="padding:3px 6px;">'+Ly(t,s,n)+`</td><td style="padding:3px 6px;"><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="removeFund('`+t+"',"+s+')">&times;</button></td></tr>').join(""),Ny(t))};window.updateFundField=function(t,e,n,s){const r=jt(t)[e];if(r){if(n==="value")r.value=parseFloat(String(s).replace(/[^0-9.]/g,""))||0;else if(n==="ticker"){r.ticker=s;const i=qr(s);i&&(r.subClass=i.subClass);const o=document.getElementById(t+"_fcat_"+e);o&&(o.innerHTML=Ly(t,e,r))}else n==="subClass"?(r.subClass=s,s&&r.ticker&&!qr(r.ticker)&&Jx({ticker:r.ticker,name:"",subClass:s})):r[n]=s;Ny(t)}};window.addFundRow=function(t){jt(t).push({ticker:"",value:"",wrapper:"SIPP"}),renderFunds(t)};window.removeFund=function(t,e){jt(t).splice(e,1),renderFunds(t)};window.clearFunds=function(t){window._taggedFunds[t]=[],renderFunds(t)};function Ny(t){const e=document.getElementById(t+"FundSummary");if(!e)return;const n=jt(t).filter(d=>d.ticker&&d.value>0);if(!n.length){e.innerHTML='<span style="color:var(--text-muted);font-size:12px;">Add holdings above to see the bucket roll-up.</span>';return}const s=hl(n),r=s.total-s.isaTotal,i=d=>r?Math.round(s.buckets[d]/r*100):0,o=d=>"£"+Math.round(d).toLocaleString(),l=d=>Object.entries(d).map(([h,m])=>Ot[h].label+" "+Math.round(m*100)+"%").join(" · ");let c='<div style="font-weight:600;margin-bottom:6px;">Rolls up to '+o(r)+" pot"+(s.isaTotal?" + "+o(s.isaTotal)+" ISA (separate tax-free bridge, modelled at its own tagged mix)":"")+"</div>";c+='<div style="font-size:13px;">';for(const d of["shares","bonds","diversifiers","cash"])s.buckets[d]&&(c+="<div><strong>"+vu[d]+"</strong>: "+o(s.buckets[d])+" ("+i(d)+"%)"+(d==="bonds"&&Object.keys(s.bondWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+l(s.bondWeights)+"</span>":"")+(d==="diversifiers"&&Object.keys(s.diversifierWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+l(s.diversifierWeights)+"</span>":"")+"</div>");c+="</div>",s.untagged.length&&(c+='<div style="color:#b45309;font-size:12px;margin-top:6px;">Not recognised (ignored): '+s.untagged.map(d=>d.ticker).join(", ")+"</div>"),e.innerHTML=c,yu(t)==="funds"&&(bu(t),updateAllocDisplay(t))}function bu(t){const e=jt(t).filter(c=>c.ticker&&c.value>0);if(!e.length)return delete window._customAlloc[t],null;const n=hl(e),s=fx(n),r=window._customAlloc[t]||{};window._customAlloc[t]={label:"Your funds",equity:n.total?n.buckets.shares/n.total:0,bond:n.total?n.buckets.bonds/n.total:0,diversifiers:n.total?n.buckets.diversifiers/n.total:0,cash:n.total?n.buckets.cash/n.total:0,equityMin:s.equityStart,bondMin:s.bondStart,cashTarget:s.cashStart,diversifierStart:s.diversifierStart||0,subAsset:s.subAsset||null,glideEndgame:r.glideEndgame||null};const i=document.getElementById(t+"Pot");i&&(i.value=Math.round(n.total-n.isaTotal),i._updateOverlay&&i._updateOverlay());const o=document.getElementById(t+"Diversifiers");o&&(o.checked=(s.diversifierStart||0)>0);const l=document.getElementById(t+"IsaBalance");return l&&(l.value=Math.round(n.isaTotal||0),l._updateOverlay&&l._updateOverlay()),n}window.applyTaggedPortfolio=function(t){if(window._allocMode[t]="funds",!bu(t)){showToast("Add some holdings first","warning");return}updateAllocDisplay(t)};window.restoreCustomAllocFromSettings=function(t,e){if(e&&e.subAsset&&e.subAsset.bondWeights&&Object.keys(e.subAsset.bondWeights).length){const n=(e.equityMin||0)+(e.bondMin||0)+(e.cashTarget||0)+(e.diversifierStart||0);window._customAlloc[t]={label:"Your funds",equity:n?e.equityMin/n:0,bond:n?e.bondMin/n:0,diversifiers:n?(e.diversifierStart||0)/n:0,cash:n?e.cashTarget/n:0,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset,glideEndgame:e.glideEndgame||null}}else delete window._customAlloc[t]};function JA(t){const e={shares:[],bonds:[],diversifiers:[],cash:[]},n=[];t.tagged.forEach(o=>{(o.wrapper||"").toUpperCase()==="ISA"?n.push(o):e[o.bucket]&&e[o.bucket].push(o)});const s=o=>"£"+Math.round(o).toLocaleString(),r={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};let i='<div style="font-size:12px;border:1px solid var(--border,#cbd5e1);border-radius:8px;padding:10px 12px;">';i+='<div style="font-weight:600;margin-bottom:6px;">Which of your funds went where</div>';for(const o of["shares","bonds","diversifiers","cash"]){if(!e[o].length)continue;const l=e[o].reduce((c,d)=>c+(+d.value||0),0);i+='<div style="margin:3px 0;"><strong>'+r[o]+"</strong> "+s(l)+': <span style="color:var(--text-muted);">'+e[o].map(c=>c.ticker).join(", ")+"</span></div>"}return n.length&&(i+='<div style="margin:3px 0;"><strong>ISA (separate tax-free pool)</strong> '+s(t.isaTotal)+': <span style="color:var(--text-muted);">'+n.map(o=>o.ticker).join(", ")+"</span></div>"),t.untagged.length&&(i+='<div style="color:#b45309;margin-top:4px;">Not recognised: '+t.untagged.map(o=>o.ticker).join(", ")+"</div>"),i+="</div>",i}window._fundModal={fieldId:null,subtotal:0};window.openFundBucketModal=function(t,e,n){const s=jt("ds").filter(i=>{const o=Rc(i);return i.ticker&&o&&Ot[o]&&Ot[o].bucket===t});window._fundModal={fieldId:e,subtotal:0},document.getElementById("fundModalTitle").textContent=n;const r=document.getElementById("fundModalRows");s.length?r.innerHTML=s.map(i=>{const o=qr(i.ticker),l=Ot[Rc(i)],c=o?o.name:l?l.label:"";return'<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin:8px 0;"><span><strong>'+i.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+c+'</span></span><span style="white-space:nowrap;">£ <input type="number" class="fund-modal-input" oninput="updateFundModalSubtotal()" style="width:120px;" placeholder="0"></span></div>'}).join(""):r.innerHTML='<p style="color:var(--text-muted);">No '+n.toLowerCase()+" tagged yet. Define your holdings in <strong>Settings → Build from my funds</strong>, then come back — or just type the total into the box.</p>",updateFundModalSubtotal(),document.getElementById("fundBucketModal").style.display="flex"};window.updateFundModalSubtotal=function(){let t=0;document.querySelectorAll("#fundModalRows .fund-modal-input").forEach(e=>{t+=+e.value||0}),window._fundModal.subtotal=t,document.getElementById("fundModalSubtotal").textContent="Total: £"+Math.round(t).toLocaleString()};window.applyFundBucketModal=function(){const t=document.getElementById(window._fundModal.fieldId);t&&(t.value=Math.round(window._fundModal.subtotal||0)),closeFundBucketModal()};window.closeFundBucketModal=function(){document.getElementById("fundBucketModal").style.display="none"};window.updateEntryTagPrompt=function(){const t=document.getElementById("entryTagPrompt");if(!t)return;if(jt("ds").filter(n=>n.ticker).length>0){t.style.display="none",t.innerHTML="";return}t.style.display="block",t.innerHTML='<div class="alert alert-info" style="font-size:13px;">The Decision Tool works from your real portfolio. Tag your funds in <strong>Settings → “Build from my funds”</strong> to enter values per fund via the <em>enter per fund ▸</em> links. You can still type bucket totals directly.</div>'};window.fillDecisionFromTaggedFunds=async function(){let t=jt("ds").filter(r=>r.ticker&&r.value>0);if(t.length||(t=jt("ss").filter(r=>r.ticker&&r.value>0)),!t.length)try{t=((await ct()).taggedFunds||[]).filter(i=>i.ticker&&i.value>0)}catch{}if(!t.length){showToast('No tagged funds yet — tag your holdings in Settings → "Build from my funds", then come back.',"info",6e3);return}const e=hl(t),n=(r,i)=>{const o=document.getElementById(r);o&&(o.value=Math.round(i))};n("entryEquity",e.buckets.shares),n("entryBond",e.buckets.bonds),n("entryCash",e.buckets.cash),n("entryDiversifier",e.buckets.diversifiers),e.isaTotal&&n("entryIsa",e.isaTotal);const s=document.getElementById("entryFundTagHelp");s&&(s.innerHTML=JA(e)),showToast("Filled your fund values from "+t.length+" tagged funds","success")};function Oy(t,e){const n=(t.equityMin||0)+(t.bondMin||0)+(t.cashTarget||0),s=n>0?By(t.equityMin/n,t.bondMin/n,t.cashTarget/n):"balanced",r=ns[s],i=l=>"£"+Math.round(l||0).toLocaleString(),o=Math.round(r.equity*100)+"/"+Math.round(r.bond*100)+"/"+Math.round(r.cash*100);return`<div class="rpt-header">
        <h1>Pension Decision Plan</h1>
        <div class="rpt-sub">${e||""}</div>
        <table class="rpt-meta"><tbody>
          <tr><td>Total pot</td><td>${i(n)}</td><td>Risk level</td><td>${r.label} (${o})</td></tr>
          <tr><td>Bond tent</td><td>${t.equityGlideEnabled?"On — rising-equity glidepath":"Off"}</td><td>Target income</td><td>${i(t.baseSalary)}/yr</td></tr>
          <tr><td>Duration</td><td>${t.duration||35} yrs</td><td>Generated</td><td>${new Date().toLocaleDateString("en-GB")}</td></tr>
        </tbody></table>
      </div>`}function Fy(t){let e=document.getElementById("printPortal");e||(e=document.createElement("div"),e.id="printPortal",document.body.appendChild(e)),e.innerHTML=t,document.body.classList.add("printing"),window.print()}window.addEventListener("afterprint",()=>{document.body.classList.remove("printing");const t=document.getElementById("printPortal");t&&(t.innerHTML="")});function XA(t,e,n){const s=new Blob([e],{type:n}),r=URL.createObjectURL(s),i=document.createElement("a");i.href=r,i.download=t,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(r),1e3)}window.printAnnualReport=async function(t){const e=await wt();Fy(Oy(e,"Annual report — tax year "+t)+document.getElementById("taxYearDetail").innerHTML)};window.printMonthlyReport=async function(t){const e=await wt();Fy(Oy(e,"Monthly record — "+t)+document.getElementById("historyDetail").innerHTML)};window.exportAnnualCsv=function(t){const e=(typeof bn<"u"?bn:[]).filter(o=>o.taxYear===t).sort((o,l)=>(o.date||"").localeCompare(l.date||"")),n=o=>(o=o==null?"":String(o),/[",\n]/.test(o)?'"'+o.replace(/"/g,'""')+'"':o),s=o=>Math.round(o||0);let i=["Date","Draw source","SIPP draw","ISA draw","From equity","From bond","From cash","Protection","Equity target","Bond target","Cash target","Total pot","Rebalance"].map(n).join(",")+`
`;for(const o of e)i+=[o.date,o.source,s(o.sipp),s(o.isa),s(o.dEquity),s(o.dBond),s(o.dCash),o.inProtection?"Yes":"No",s(o.adjEquity),s(o.adjBond),s(o.adjCash),s(o.total),o.rebal||""].map(n).join(",")+`
`;e.length||(i+=`(no monthly records saved for this tax year yet)
`),XA("decision-plan-"+t.replace("/","-")+".csv",i,"text/csv;charset=utf-8;")};window.runCompareStrategiesUI=async function(t){const e=document.getElementById("optimiseBtn"+t),n=document.getElementById("optimiseResults"+t);e&&(e.disabled=!0,e.textContent="Comparing..."),n&&(n.innerHTML='<div class="loading"><div class="spinner"></div>Running six strategies…</div>');const s=JSON.parse(JSON.stringify(await ct())),r=document.getElementById(t==="MC"?"mcYears":"histYears"),i=parseInt(r&&r.value)||s.duration,o=(s.equityMin||0)+(s.bondMin||0)+(s.cashTarget||0),l=Object.keys(Zs).map(Number).sort((p,w)=>p-w),c=Math.max(...l),d=p=>{const w=[];if(t==="MC")for(let C=0;C<1e3;C++)w.push($r(p,tu(p,C),C));else l.forEach(C=>{if(C+i-1>c)return;const L={equity:{},inflation:{}};for(let D=0;D<i;D++)L.equity[D]=Zs[C+D]||0,L.inflation[D]=Da[C+D]||.025;w.push($r(p,L,C))});const T=w.length||1,S=w.reduce((C,L)=>C+Math.min(1,(L.years||0)/(L.duration||i)),0)/T*100,A=w.filter(C=>!C.failed).length/T*100,P=w.reduce((C,L)=>Math.min(C,L.years||0),1/0);return{coverage:S,rate:A,minYears:P===1/0?0:P}},h=["cautious","balanced","adventurous"],m={};for(const p of h){const w=ns[p];m[p]={};for(const T of[!1,!0]){const S={...s,equityMin:Math.round(o*w.equity),bondMin:Math.round(o*w.bond),cashTarget:Math.round(o*w.cash),equityGlideEnabled:T},A=ti({years:i},S);m[p][T?"tent":"flat"]=d(A),await new Promise(P=>setTimeout(P,0))}}ZA(n,m,h),e&&(e.disabled=!1,e.textContent="Compare strategies")};function ZA(t,e,n){let s={cov:-1,key:null,tent:null};for(const o of n)for(const l of["flat","tent"])e[o][l].coverage>s.cov&&(s={cov:e[o][l].coverage,key:o,tent:l});const r=(o,l)=>`<td style="text-align:center;padding:10px;border:1px solid var(--border);${l?"background:rgba(16,185,129,0.12);":""}">
          <div style="font-size:22px;font-weight:700;color:var(--${l?"success":"text"});">${o.coverage.toFixed(0)}%</div>
          <div style="font-size:11px;color:var(--text-muted);">worst case ${o.minYears.toFixed(0)} yrs</div>
        </td>`;let i='<h3 style="margin-bottom:6px;">Compare strategies</h3>';i+=`<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px;">Coverage = the share of your retirement years the pot funds (worst case = the fewest years it lasted in any run). More shares usually buys a little more coverage but a rougher ride; the bond tent mainly lifts the worst case. Pick the risk level you're comfortable holding — the tool won't change it for you.</p>`,i+='<table style="border-collapse:collapse;width:100%;max-width:520px;"><thead><tr><th style="text-align:left;padding:8px;"></th><th style="padding:8px;">Flat</th><th style="padding:8px;">+ Bond tent</th></tr></thead><tbody>';for(const o of n){const l=ns[o];i+=`<tr><td style="padding:8px;border:1px solid var(--border);"><strong>${l.label}</strong><br><span style="font-size:11px;color:var(--text-muted);">${Math.round(l.equity*100)}/${Math.round(l.bond*100)}/${Math.round(l.cash*100)}</span></td>`,i+=r(e[o].flat,s.key===o&&s.tent==="flat"),i+=r(e[o].tent,s.key===o&&s.tent==="tent"),i+="</tr>"}i+="</tbody></table>",i+=`<p style="margin-top:12px;font-size:13px;">Best coverage: <strong>${ns[s.key].label}${s.tent==="tent"?" + bond tent":""}</strong> at ${s.cov.toFixed(0)}%. Set it in Settings if you'd like it.</p>`,t&&(t.innerHTML=i)}function wu(){return{currentAge:+document.getElementById("acAge").value||0,retirementAge:+document.getElementById("acRetireAge").value||0,salary:+document.getElementById("acSalary").value||0,potNow:+document.getElementById("acPotNow").value||0,netMonthly:+document.getElementById("acNetMonthly").value||0,schemeType:document.getElementById("acScheme").value||"ras",employerMonthly:+document.getElementById("acEmployerMonthly").value||0,escalationPct:+document.getElementById("acEscalation").value||0}}window.loadAccumulationUI=async function(){try{const t=await eS(),e=await fl(),n=(s,r)=>{const i=document.getElementById(s);i&&r!=null&&r!==0&&(i.value=r)};n("acAge",t.currentAge??e.currentAge),n("acRetireAge",t.retirementAge??e.retirementAge),n("acSalary",t.salary),n("acPotNow",t.potNow),n("acNetMonthly",t.netMonthly),t.schemeType&&(document.getElementById("acScheme").value=t.schemeType),n("acEmployerMonthly",t.employerMonthly),t.escalationPct&&(document.getElementById("acEscalation").value=t.escalationPct),recalcAccumulation()}catch(t){console.error("Accumulation load error:",t)}};window.saveAccumulationUI=async function(){try{await tS(wu()),showToast("Accumulation plan saved","success")}catch(t){showToast("Could not save: "+t.message,"error")}};window.recalcAccumulation=async function(){const t=wu(),e=document.getElementById("acBreakdown"),n=document.getElementById("acWarnings"),s=document.getElementById("acProjection");if(!t.currentAge||!t.retirementAge||t.retirementAge<=t.currentAge){e.innerHTML="",n.innerHTML="",s.innerHTML='<p style="color:var(--text-muted);font-size:13px;">Enter your ages to project.</p>';return}const r=rx(t);e.innerHTML='<div class="alert alert-info">Each month: you pay <strong>'+re(t.netMonthly)+"</strong> → <strong>"+re(Math.round(r.grossMonthly))+"</strong> goes into your pension"+(r.reliefMonthly>.5?" (incl. "+re(Math.round(r.reliefMonthly))+" tax relief"+(r.niSavedMonthly>.5?" + NI saving":"")+")":"")+(r.employerMonthly?" + <strong>"+re(r.employerMonthly)+"</strong> from your employer":"")+" = <strong>"+re(Math.round(r.totalMonthly))+"/mo</strong>. Each £1 invested costs you "+(r.costPerPound*100).toFixed(0)+"p."+(r.hrClaimMonthly>.5?" Plus ≈"+re(Math.round(r.hrClaimMonthly))+"/mo you can claim back from HMRC.":"")+"</div>"+r.notes.map(m=>'<p style="font-size:12px;color:var(--text-muted);margin:4px 0 0;">'+m+"</p>").join("");let i=!1;try{i=(await Os()||[]).some(p=>(p.taxFree||0)>0)}catch{}const o=ox({...t,totalMonthly:r.totalMonthly}),l=o[o.length-1],c=ix({annualGrossTotal:r.totalMonthly*12,salary:t.salary,mpaaTriggered:i,currentAge:t.currentAge,retirementAge:t.retirementAge,projectedPotHigh:l.potHigh});n.innerHTML=c.map(m=>'<div class="alert alert-'+(m.severity==="danger"?"danger":m.severity==="warning"?"warning":"info")+'">'+m.message+"</div>").join("");let d="<table><thead><tr><th>Age</th><th>Cautious (2%)</th><th>Middle (5%)</th><th>Strong (8%)</th><th>Paid in</th></tr></thead><tbody>";const h=o.length>12?5:1;for(let m=0;m<o.length;m+=m===0||m>=o.length-h?1:h){const p=o[m];d+="<tr"+(m===o.length-1?' style="font-weight:600;"':"")+"><td>"+p.age+"</td><td>"+re(Math.round(p.potLow))+"</td><td>"+re(Math.round(p.potMid))+"</td><td>"+re(Math.round(p.potHigh))+"</td><td>"+re(Math.round(p.contributedToDate))+"</td></tr>"}d+="</tbody></table>",s.innerHTML=d,window._acProjection={rows:o,breakdown:r}};window.runOnTrackCheck=async function(){const t=document.getElementById("acOnTrack");if(wu(),!window._acProjection){showToast("Enter your details first","warning");return}t.innerHTML='<p style="font-size:13px;">Searching for the pot that gives 85% success against your plan… (a few seconds)</p>',await new Promise(e=>setTimeout(e,30));try{const e=ti({},await ct()),{requiredPot:n}=ax(e,.85,300),s=window._acProjection.rows,r=s[s.length-1],i=o=>o>=n?'<span style="color:var(--success,#22c55e);font-weight:600;">on track ✓</span>':'<span style="color:var(--danger,#ef4444);font-weight:600;">short by '+re(Math.round(n-o))+"</span>";t.innerHTML='<div class="alert alert-info">Your plan needs about <strong>'+re(Math.round(n))+"</strong> at retirement (today's money) for 85% Monte-Carlo success against your budget-derived target.</div><table><tbody><tr><td>Cautious growth (2%)</td><td>"+re(Math.round(r.potLow))+"</td><td>"+i(r.potLow)+"</td></tr><tr><td>Middle growth (5%)</td><td>"+re(Math.round(r.potMid))+"</td><td>"+i(r.potMid)+"</td></tr><tr><td>Strong growth (8%)</td><td>"+re(Math.round(r.potHigh))+"</td><td>"+i(r.potHigh)+'</td></tr></tbody></table><p style="font-size:11px;color:var(--text-muted);margin-top:6px;">Uses your current Stress-Tester settings (target, allocation, State Pension, access method) with the pot scaled. Set your budget and stress settings first for a meaningful answer.</p>'}catch(e){console.error("On-track check error:",e),t.innerHTML='<div class="alert alert-warning">Could not run the check: '+e.message+"</div>"}};window.applyLongevitySuggestion=function(){const t=+document.getElementById("ssLongevityAge").value;if(!t){showToast("Enter your current age first","warning");return}const e=document.getElementById("ssLongevitySex").value,n=+document.getElementById("ssLongevityPct").value,s=hS(t,e,n);document.getElementById("ssDuration").value=Math.max(1,s-t),document.getElementById("ssLongevityNote").textContent="Set to age "+s+" ("+Math.max(1,s-t)+" years). Approximate ONS-style cohort figures — planning to the average means a 50% chance of outliving the plan."};window.setAccessMethod=function(t,e){const n=document.getElementById(t+"AccessMethod");n&&(n.value=e),syncAccessButtons(t)};window.syncAccessButtons=function(t){const e=(document.getElementById(t+"AccessMethod")||{}).value||"drawdown";document.querySelectorAll(`[onclick^="setAccessMethod('`+t+`'"]`).forEach(s=>{s.classList.toggle("active",s.dataset.access===e)});const n=document.getElementById(t+"UfplsPhase");n&&(n.style.display=e==="ufpls"?"block":"none")};syncAccessButtons("ss");syncAccessButtons("ds");const Mr={ss:"mo",ds:"mo"};window.netSpendChanged=function(t,e){const n=+e||0,s=Mr[t]==="mo"?n*12:n;document.getElementById(t+"BaseSalary").value=Math.round(Gi(s)),Vy(t)};window.toggleNetPeriod=function(t){Mr[t]=Mr[t]==="mo"?"yr":"mo",document.getElementById(t+"NetPeriodBtn").textContent="/"+Mr[t],syncNetFromGross(t)};window.syncNetFromGross=function(t){const e=+document.getElementById(t+"BaseSalary").value||0,n=Yt(e,sa.pa,sa.brl,sa.hrl),s=document.getElementById(t+"NetSpend");s&&(s.value=e?Math.round(Mr[t]==="mo"?n/12:n):""),Vy(t),e1(t)};function Vy(t){const e=Math.round(+document.getElementById(t+"BaseSalary").value||0),n=document.getElementById(t+"NetGrossNote");n&&(n.textContent=e?"≈ "+re(e)+"/yr before tax — withdrawals are sized to cover the tax":"")}async function e1(t){const e=document.getElementById(t+"BudgetChipRow"),n=document.getElementById(t+"BudgetChip");if(!(!e||!n)){try{const s=window._budget||Pc(await fl()),r=Zr(s);if(r.allInComfortableMonthly>0){n.textContent="From your budget: "+re(r.allInComfortableMonthly)+"/mo — use",n.dataset.monthly=Math.round(r.allInComfortableMonthly),e.style.display="block";return}}catch{}e.style.display="none"}}window.useBudgetSpend=function(t){const e=document.getElementById(t+"BudgetChip"),n=+(e&&e.dataset.monthly||0);n&&(Mr[t]="mo",document.getElementById(t+"NetPeriodBtn").textContent="/mo",document.getElementById(t+"NetSpend").value=n,netSpendChanged(t,n))};async function vl(){kt("Loading settings...");try{const t=await ct();document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(n=>({...n})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssDbAmount").value=t.dbAmount||0,document.getElementById("ssDbStartYear").value=t.dbStartYear||0,document.getElementById("ssDbIndexation").value=t.dbIndexation||"lpi5",document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",Sc("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0,document.getElementById("ssAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("ssUfplsYears").value=t.ufplsYears||"",document.getElementById("ssUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("ssBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ss");const e=document.getElementById("ssSeedNote");e&&(e.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),gl()}catch(t){console.error("Error loading stress settings:",t)}finally{Ct()}}window.saveStressSettingsUI=async function(){if(!lt()){showToast("Please sign in to save settings","error");return}const t=ul(document.getElementById("ssSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ss");if(mu(e.equityMin,e.bondMin,e.cashTarget)){kt("Saving settings...");try{const n=await ct(),s=+document.getElementById("ssBaseSalary").value,r=Array.isArray(n.targetSchedule)&&Math.abs(s-(n.targetSchedule[0]||0))<1;await Eo({configured:!0,accessMethod:document.getElementById("ssAccessMethod").value||"drawdown",ufplsYears:+document.getElementById("ssUfplsYears").value||null,ufplsThenPcls:document.getElementById("ssUfplsPcls").checked,bandFillRecycle:document.getElementById("ssBandFillRecycle").checked,targetSchedule:r?n.targetSchedule:null,baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,dbAmount:+document.getElementById("ssDbAmount").value||0,dbStartYear:+document.getElementById("ssDbStartYear").value||0,dbIndexation:document.getElementById("ssDbIndexation").value||"lpi5",spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,recoveryBuffer:+document.getElementById("ssRecoveryBuffer").value||15e3,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value,isaBalance:+document.getElementById("ssIsaBalance").value||0,spendingProfile:document.getElementById("ssSpendingProfile").value,equityGlideEnabled:document.getElementById("ssEquityGlide").checked,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:yu("ss"),taggedFunds:jt("ss").filter(i=>i.ticker&&i.value>0)}),gu({...e,duration:+document.getElementById("ssDuration").value||35}),pu(),showToast("Settings saved successfully","success")}catch(n){console.error("Error saving stress settings:",n),showToast("Error saving: "+n.message,"error")}finally{Ct()}}};window.copyDecisionFromStressUI=async function(t){if(!lt()){showToast("Please sign in first","error");return}if(await oi()){showToast("This plan is locked — unlock it (Settings) or create a new plan before copying settings into it.","warning",6e3);return}kt("Copying from Stress Tester…");try{const e=await ct();if(t==="target")await or({baseSalary:e.baseSalary});else{const n=await wt();await or(UI(e,n))}await bl(),showToast(t==="target"?"Target copied from the Stress Tester ("+re(e.baseSalary||0)+"/yr gross).":"All Stress settings copied — review them and press Save Settings to commit the plan.","success",5e3)}catch(e){console.error("Copy from stress error:",e),showToast("Could not copy: "+e.message,"error")}finally{Ct()}};window.copyStressFromDecisionUI=async function(){if(!lt()){showToast("Please sign in first","error");return}if(confirm("Copy your Decision Tool plan basics (funds, income, State Pension, ISA, protection) into the Stress Tester? Your Stress-specific what-ifs (tax mode, HODL) are kept.")){kt("Copying from Decision...");try{const t=await wt(),e=await ct(),n=zI(t,e);await Eo(n),await vl(),showToast("Stress Tester seeded from your Decision plan","success")}catch(t){console.error("Error copying from decision:",t),showToast("Error copying: "+t.message,"error")}finally{Ct()}}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){kt("Resetting settings...");try{await bx(),await vl(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{Ct()}}};async function bl(){kt("Loading settings...");try{const t=await wt();document.getElementById("dsDuration").value=t.duration||35,writeAlloc("ds",t.equityMin??25e4,t.bondMin??2e5,t.cashTarget??5e4,t.diversifierStart||0),restoreCustomAllocFromSettings("ds",t),window._taggedFunds.ds=(t.taggedFunds||[]).map(e=>({...e})),setAllocMode("ds",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("dsEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=t.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("dsProtectionFactor").value=t.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("dsDisableProtection").checked=t.disableProtection||!1,document.getElementById("dsConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("dsIsaBalance").value=t.isaBalance||0,document.getElementById("dsAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("dsUfplsYears").value=t.ufplsYears||"",document.getElementById("dsUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("dsBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ds"),document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",gl(),await Au()}catch(t){console.error("Error loading decision settings:",t)}finally{Ct()}}let t1=0;const Ft=()=>"b"+ ++t1,re=t=>"£"+Math.round(+t||0).toLocaleString(),Te=t=>String(t??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");function Pc(t){const e={...ji(),...t||{}};return e.lines=(Array.isArray(e.lines)?e.lines:[]).map(n=>({id:n.id||Ft(),...n})),e.oneOffs=(Array.isArray(e.oneOffs)?e.oneOffs:[]).map(n=>({id:n.id||Ft(),...n})),e}async function n1(){Mc=!1;try{window._budget=Pc(await fl())}catch(e){console.error("Budget load error:",e),window._budget=Pc(ji())}window._budget.lines.length||(window._budget.lines=kg().map(e=>({id:Ft(),...e})),window._budget.oneOffs.length||(window._budget.oneOffs=Cg().map(e=>({id:Ft(),...e})))),document.getElementById("budCurrentAge").value=window._budget.currentAge,document.getElementById("budRetireAge").value=window._budget.retirementAge,document.getElementById("budEndAge").value=window._budget.endAge,document.getElementById("budShared").checked=!!window._budget.sharedWithPartner,document.getElementById("budSharePct").value=window._budget.mySharePct??50,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",Vt(),Pn(),Be(),zy();const t=!window._budget.lines.some(e=>e.annual)&&!window._budget.oneOffs.some(e=>e.amount);document.getElementById("budWizBanner").style.display=t?"block":"none",Mc=!0,Xs("Autosaves as you edit"),window._budWizAutoOpen&&(window._budWizAutoOpen=!1,openBudgetWizard())}function zy(){const t=wo(window._budget);document.querySelectorAll("#budTierBtns [data-tier], #budWizTierBtns [data-tier]").forEach(e=>{e.classList.toggle("active",e.dataset.tier===t)})}window.setPlsaTier=function(t){window._budget.plsaTier=t,zy(),document.getElementById("budWizardOverlay").style.display!=="none"&&_t(!0);const n=window.scrollY;Vt(),Pn(),Be(),window.scrollTo(0,n)};function wl(t,e){const n=t.paidBy||"me",s=(o,l)=>'<option value="'+o+'"'+(n===o?" selected":"")+">"+l+"</option>",r=window._budget.mySharePct??50,i=n==="shared"?'<input type="number" min="0" max="100" placeholder="'+r+'%" title="Your % of this shared cost (blank = the overall split)" value="'+(t.mySharePct??"")+'" oninput="'+e+"('"+t.id+`','mySharePct',this.value)" style="flex:0 0 62px;">`:"";return'<select title="Who pays this?" onchange="'+e+"('"+t.id+`','paidBy',this.value)" style="flex:0 0 96px;">`+s("me","Me")+s("partner","Partner")+s("shared","Shared")+"</select>"+i}window.onBudgetSharedToggle=function(){window._budget.sharedWithPartner=document.getElementById("budShared").checked,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",Vt(),Pn(),Be()};window.onBudgetSharePctChange=function(){window._budget.mySharePct=+document.getElementById("budSharePct").value||0,Be()};function jf(t){const e=t.hint?'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.3;">'+Te(t.hint)+"</div>":"",n=t.period||"yr",s=t.annual==null?"":n==="mo"?Math.round(t.annual/12):t.annual,r=Xr(t.label,window._budget),i=r!=null?"≈"+(n==="mo"?r:r*12):"Amount",o=window._budget.sharedWithPartner?`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Add a copy for your partner (e.g. their car)" onclick="duplicateBudgetLine('`+t.id+`')">⧉</button>`:"";return'<div class="bud-row" data-id="'+t.id+'" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;"><div style="flex:1 1 200px; min-width:170px;"><input type="text" placeholder="Category" value="'+Te(t.label)+`" oninput="updateBudgetLine('`+t.id+`','label',this.value)" style="width:100%;">`+e+'</div><div style="display:flex; gap:4px; flex:0 0 186px; align-items:center;"><input type="text" inputmode="decimal" id="bm-amt-'+t.id+'" placeholder="'+i+`" title="Amount in today's money — sums welcome: 11.99+8.99 or =4×52/12`+(r!=null?" (typical shown)":"")+'" value="'+s+`" onchange="updateBudgetAmount('`+t.id+`',this.value,this)" style="flex:1 1 auto; min-width:0;"><button type="button" class="risk-btn" style="padding:4px 8px; flex:0 0 auto;" title="Switch monthly / yearly" onclick="toggleBudgetPeriod('`+t.id+`')">`+(n==="mo"?"/mo":"/yr")+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" style="padding:4px 8px; flex:0 0 auto;" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bm','`+t.id+`')">&Sigma;</button></div>`+(window._budget.sharedWithPartner?wl(t,"updateBudgetLine"):"")+'<input type="number" placeholder="from age" title="From age (blank = retirement). For temporary costs — e.g. a car lease with 3 years left — set when it starts and stops." value="'+(t.fromAge??"")+`" oninput="updateBudgetLine('`+t.id+`','fromAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="to age" title="To age (blank = end of plan)" value="`+(t.toAge??"")+`" oninput="updateBudgetLine('`+t.id+`','toAge',this.value)" style="flex:0 0 84px;">`+o+`<button type="button" class="risk-btn" style="padding:4px 10px;" title="Remove" onclick="removeBudgetLine('`+t.id+`')">&times;</button>`+(t.breakdownOpen?'<div style="flex-basis:100%;">'+$y("bm",t)+"</div>":"")+"</div>"}function Vt(){const t=window._budget.lines.filter(n=>n.tier==="essential"),e=window._budget.lines.filter(n=>n.tier==="discretionary");document.getElementById("budEssentialRows").innerHTML=t.map(jf).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No essentials yet — add housing, bills, food, transport…</p>',document.getElementById("budDiscretionaryRows").innerHTML=e.map(jf).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No lifestyle spending yet — holidays, hobbies, eating out…</p>',_u()}function s1(t){const e=t.hint?'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.3;">'+Te(t.hint)+"</div>":"";return'<div class="bud-row" data-id="'+t.id+'" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;"><div style="flex:1 1 170px; min-width:150px;"><input type="text" placeholder="e.g. Car" value="'+Te(t.label)+`" oninput="updateBudgetOneOff('`+t.id+`','label',this.value)" style="width:100%;">`+e+`</div><input type="number" placeholder="£ amount" title="Total cost in today's money" value="`+(t.amount??"")+`" oninput="updateBudgetOneOff('`+t.id+`','amount',this.value)" style="flex:0 0 120px;">`+(window._budget.sharedWithPartner?wl(t,"updateBudgetOneOff"):"")+'<input type="number" placeholder="at age" value="'+(t.atAge??"")+`" oninput="updateBudgetOneOff('`+t.id+`','atAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="every N yrs" title="Leave blank for a one-time cost" value="`+(t.everyYears??"")+`" oninput="updateBudgetOneOff('`+t.id+`','everyYears',this.value)" style="flex:0 0 110px;">`+(window._budget.sharedWithPartner?`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Add a copy for your partner" onclick="duplicateBudgetOneOff('`+t.id+`')">⧉</button>`:"")+`<button type="button" class="risk-btn" style="padding:4px 10px;" title="Remove" onclick="removeBudgetOneOff('`+t.id+`')">&times;</button></div>`}function Pn(){document.getElementById("budOneOffRows").innerHTML=window._budget.oneOffs.map(s1).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No one-off costs yet — a car every ~8 years, a new roof, a milestone trip…</p>'}function _u(){const t=Yi(window._budget),e=document.getElementById("budSuggestionsSection"),n=document.getElementById("budSuggestions");if(!t.length){e.style.display="none",n.innerHTML="";return}e.style.display="block",n.innerHTML=t.map(s=>'<button type="button" class="risk-btn" style="padding:5px 10px;" title="'+Te(s.hint||"")+`" onclick="addBudgetSuggestion('`+Te(s.label).replace(/'/g,"\\'")+`')">+ `+Te(s.label)+"</button>").join("")}window.addBudgetSuggestion=function(t){const e=Yi(window._budget).find(n=>n.label===t);e&&(window._budget.lines.push({id:Ft(),label:e.label,tier:e.tier,annual:null,fromAge:null,toAge:null,hint:e.hint||"",period:e.period||"yr",paidBy:e.paidBy||"me"}),Vt(),_u(),Be())};function Eu(){window._budget.currentAge=+document.getElementById("budCurrentAge").value||0,window._budget.retirementAge=+document.getElementById("budRetireAge").value||0,window._budget.endAge=+document.getElementById("budEndAge").value||100}window.onBudgetHorizonChange=function(){Eu(),Be()};window.updateBudgetLine=function(t,e,n){const s=window._budget.lines.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="fromAge"||e==="toAge"?s[e]=n===""?null:El(n):s[e]=n===""?null:+n,e==="label"&&_u(),e==="paidBy"&&Vt(),Be())};window.updateBudgetAmount=function(t,e,n){const s=window._budget.lines.find(i=>i.id===t);if(!s)return;const r=String(e).trim();if(r==="")s.annual=null;else{const i=sl(r);if(i==null)return;s.annual=(s.period||"yr")==="mo"?i*12:i,n&&(n.value=i)}budTouch(),Be()};window.toggleBudgetPeriod=function(t){const e=window._budget.lines.find(s=>s.id===t);if(!e)return;e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch();const n=window.scrollY;Vt(),Be(),window.scrollTo(0,n)};window.updateBudgetOneOff=function(t,e,n){const s=window._budget.oneOffs.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="atAge"?s[e]=n===""?null:El(n):s[e]=n===""?null:+n,e==="paidBy"&&Pn(),Be())};window.addBudgetLine=function(t){window._budget.lines.push({id:Ft(),label:"",tier:t,annual:null,fromAge:null,toAge:null}),Vt(),Be()};window.addBudgetOneOff=function(){window._budget.oneOffs.push({id:Ft(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),Pn(),Be()};window.removeBudgetLine=function(t){const e=window._budget.lines.findIndex(n=>n.id===t);e<0||(_l("line",window._budget.lines[e],e),window._budget.lines.splice(e,1),Vt(),Be())};window.removeBudgetOneOff=function(t){const e=window._budget.oneOffs.findIndex(n=>n.id===t);e<0||(_l("oneOff",window._budget.oneOffs[e],e),window._budget.oneOffs.splice(e,1),Pn(),Be())};window.duplicateBudgetLine=function(t){const e=window._budget.lines,n=e.find(r=>r.id===t);if(!n)return;const s={...n,id:Ft(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,s),Vt(),Be()};window.duplicateBudgetOneOff=function(t){const e=window._budget.oneOffs,n=e.find(r=>r.id===t);if(!n)return;const s={...n,id:Ft(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,s),Pn(),Be()};window.fillTypicalAmounts=function(){let t=0;for(const e of window._budget.lines)if(e.annual==null||e.annual===""){const n=Xr(e.label,window._budget);n!=null&&(e.annual=n*12,t++)}Vt(),Be(),showToast(t?"Filled "+t+" blank categories with "+xg[wo(window._budget)]+" figures — adjust freely":"No blank categories with a typical figure",t?"success":"info")};function Be(){budTouch(),Eu();const t=window._budget,e=t.retirementAge,n=wc(t,e,"essential"),s=wc(t,e,"all");document.getElementById("budEssentialSubtotal").textContent=re(n),document.getElementById("budDiscretionarySubtotal").textContent=re(s-n);const r=Zr(t),i=A=>re(A),o=t.oneOffs.filter(A=>(+A.everyYears||0)>0&&(+A.amount||0)>0),l=t.oneOffs.filter(A=>!((+A.everyYears||0)>0)&&(+A.amount||0)>0),c=Sg.single,d=r.allInComfortableAnnual,h=d>=c.comfortable?"at/above Comfortable":d>=c.moderate?"between Moderate and Comfortable":d>=c.minimum?"between Minimum and Moderate":"below the Minimum",m=r.sharedWithPartner;let p="";if(p+='<div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;">',p+='<div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(m?" — your share":"")+'</div><div style="font-size:22px;font-weight:700;">'+i(r.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div>',p+='<div><div style="font-size:12px;color:var(--text-muted);">'+(m?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:26px;font-weight:800;color:var(--primary,#6366f1);">'+i(r.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+i(d)+"/yr — what your plan funds</div></div>",m&&(p+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:22px;font-weight:700;">'+i(r.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+i(r.partnerAllInAnnual)+"/yr — their side of this budget</div></div>",p+='<div><div style="font-size:12px;color:var(--text-muted);">Household all-in</div><div style="font-size:22px;font-weight:700;">'+i(r.householdComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">everything, both of you</div></div>'),p+="</div>",m&&r.partnerAllInAnnual>0&&(p+='<div class="alert alert-info" style="margin-bottom:12px;">Your partner’s share is <strong>'+i(r.partnerAllInMonthly)+"/mo</strong> ("+i(r.partnerAllInAnnual)+'/yr). They can create their own free plan and use that as <em>their</em> target income. <span style="color:var(--text-muted);">Note: this plan only funds <em>your</em> share — it doesn’t check your partner can fund theirs.</span></div>'),p+='<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">= comfortable recurring <strong style="color:var(--text);">'+i(r.comfortableMonthlyNet)+"/mo</strong>"+(r.periodicMonthlyAverage>0?' + periodic set-aside <strong style="color:var(--text);">'+i(r.periodicMonthlyAverage)+"/mo</strong> <span>(averaged from the big periodic costs below)</span>":"")+".</div>",p+='<div class="alert alert-info" style="margin-bottom:12px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+i(c.minimum)+" · Moderate "+i(c.moderate)+" · Comfortable "+i(c.comfortable)+" per year. Your all-in spend is <strong>"+h+'</strong>. <span style="color:var(--text-muted);">(Assumes home owned outright; excludes care costs.)</span></div>',o.length){p+='<div style="font-size:13px;margin-bottom:8px;"><strong>Periodic costs</strong> (averaged into the monthly need, but the cash lands lumpily):<ul style="margin:6px 0 0; padding-left:18px;">';for(const A of o){const P=+A.amount/+A.everyYears;p+="<li>"+Te(A.label||"item")+": "+i(A.amount)+" every "+ +A.everyYears+" yrs ≈ <strong>"+i(P)+"/yr</strong> ("+i(P/12)+"/mo)</li>"}p+="</ul></div>"}if(l.length){p+='<div style="font-size:13px;margin-bottom:12px;"><strong>One-time costs</strong> (not in the monthly average — planned for the year they fall):<ul style="margin:6px 0 0; padding-left:18px;">';for(const A of l)p+="<li>"+Te(A.label||"item")+": "+i(A.amount)+(A.atAge?" at age "+ +A.atAge:"")+"</li>";p+="</ul></div>"}const w=+window._budget.targetHeadroomMonthly||0,T=r.allInComfortableMonthly+w,S=Gi(r.allInComfortableAnnual+w*12);p+='<div style="border-top:1px solid var(--border); padding-top:12px;">',p+='<div style="font-size:13px; margin-bottom:8px;">Your all-in take-home of <strong>'+i(r.allInComfortableMonthly)+"/mo</strong> becomes the <strong>target both tools work to</strong>: the Stress Tester asks “will my pots deliver this for life?” and the Decision Tool works out each month’s withdrawal to hit it tax-efficiently.</div>",p+='<div style="font-size:13px; margin-bottom:10px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">Optional headroom on top: £<input type="number" min="0" value="'+(window._budget.targetHeadroomMonthly??"")+'" placeholder="0" onchange="budHeadroomChanged(this.value)" style="width:90px;">/mo <span style="color:var(--text-muted);">— breathing room above the budget, so the plan isn’t cut to the bone.</span></div>',p+='<div style="font-size:13px; margin-bottom:8px;">Plan target: <strong>'+i(T)+'/mo take-home</strong> <span style="color:var(--text-muted);">(≈ '+i(S)+"/yr before tax"+(w?" — budget + "+i(w)+"/mo headroom":"")+")</span></div>",p+='<button type="button" onclick="applyBudgetToPlan()">Set as my plan’s target (Stress + Decision)</button>',p+="</div>",document.getElementById("budSummary").innerHTML=p}let Mc=!1,to=null;function Xs(t){if(Jn)return;const e=document.getElementById("budSaveStatus");e&&(e.textContent=t)}let Jn=null,Dc=null;function _l(t,e,n){Jn={kind:t,item:e,index:n},clearTimeout(Dc),Dc=setTimeout(()=>{Jn=null,Bc()},12e3),Bc()}function Bc(){const t=Jn?Jn.item.label||"item":null,e=Jn?"Removed “"+Te(t)+'” — <button type="button" class="budwiz-chip" onclick="budUndoRemove()">Undo</button>':null,n=document.getElementById("budSaveStatus");n&&e?n.innerHTML=e:n&&!e&&Xs("Saved ✓");const s=document.getElementById("budWizUndoSlot");s&&(s.innerHTML=e||"")}window.budUndoRemove=function(){if(!Jn)return;const{kind:t,item:e,index:n}=Jn;Jn=null,clearTimeout(Dc);const s=t==="line"?window._budget.lines:window._budget.oneOffs;if(s.splice(Math.min(n,s.length),0,e),budTouch(),document.getElementById("budWizardOverlay").style.display!=="none")_t(!0);else{const i=window.scrollY;Vt(),Pn(),Be(),window.scrollTo(0,i)}Bc()};window.budTouch=function(){!Mc||!window._budget||(Xs("Saving…"),clearTimeout(to),to=setTimeout(Tu,1200))};function Uy(){return{...window._budget,lines:window._budget.lines.filter(t=>t.label&&t.label.trim()||t.annual||t.breakdown&&t.breakdown.some(e=>e.label&&e.label.trim()||e.amount)),oneOffs:window._budget.oneOffs.filter(t=>t.label&&t.label.trim()||t.amount)}}async function Tu(){if(!lt()){Xs("Sign in to save");return}try{await iu(Uy()),Xs("Saved ✓")}catch(t){console.error("Budget autosave error:",t),Xs("Not saved — retrying…"),clearTimeout(to),to=setTimeout(Tu,4e3)}}window.resetBudgetUI=async function(){confirm(`Reset the budget?

All amounts, sub-sheets and custom lines go back to a fresh start. Your ages and partner-sharing setting are kept.

This saves immediately and cannot be undone.`)&&(window._budget.lines=kg().map(t=>({id:Ft(),...t})),window._budget.oneOffs=Cg().map(t=>({id:Ft(),...t})),Vt(),Pn(),Be(),await Tu(),showToast("Budget reset to a fresh start","success"))};window.saveBudgetUI=async function(){if(!lt()){showToast("Please sign in to save your budget","error");return}Eu(),kt("Saving budget…");try{clearTimeout(to),await iu(Uy()),Xs("Saved ✓"),showToast("Budget saved","success")}catch(t){console.error("Budget save error:",t),showToast("Error saving budget: "+t.message,"error")}finally{Ct()}};window.budHeadroomChanged=function(t){window._budget.targetHeadroomMonthly=t===""?null:Math.max(0,+t||0),Be()};window.applyBudgetToPlan=async function(){const t=Zr(window._budget),e=+window._budget.targetHeadroomMonthly||0,n=Math.round(Gi(t.allInComfortableAnnual+e*12));if(!n){showToast("Add some spending first","warning");return}kt("Applying to plan…");try{const r=(await ct()).duration||35,o=VI(window._budget,r).map(h=>Math.round(Gi(h+e*12)));await Eo({baseSalary:n,targetSchedule:o});const l=await oi();l||await or({baseSalary:n});const c=document.getElementById("ssBaseSalary");c&&(c.value=n,syncNetFromGross("ss"));const d=document.getElementById("dsBaseSalary");d&&!l&&(d.value=n,syncNetFromGross("ds")),showToast("Target set: both tools now work to "+re(t.allInComfortableMonthly+e)+"/mo take-home"+(e?" (incl. "+re(e)+"/mo headroom)":"")+" — "+re(n)+"/yr gross"+(l?". Stress only; the Decision plan is locked":""),"success",5e3)}catch(s){console.error("Apply-to-plan error:",s),showToast("Could not apply: "+s.message,"error")}finally{Ct()}};const Io=[{key:"home",title:"Home & bills",tier:"essential",tip:"Will your mortgage still exist at retirement? If it ends earlier, use the ⏱ button on its row to set the age it stops. Bills mostly carry on — but you'll be home more, so heating often rises.",labels:["Rent / mortgage","Council tax","Gas","Electricity","Water","Broadband","Mobile phones","TV licence","Home insurance","Boiler service","Home upkeep","Premier banking / account fees","Cleaner / gardener","Second / holiday home","Storage / lock-up"]},{key:"food",title:"Food, drink & eating out",tier:"essential",tip:"With more free time most retirees eat OUT more, not less. Check 2–3 months of bank statements for what you really spend — real numbers beat guesses.",labels:["Groceries & household","Eating out & takeaways","Alcohol"]},{key:"transport",title:"Transport",tier:"essential",tip:"Commuting disappears at retirement, but running costs are easy to underestimate — servicing, MOT, tyres, repairs. Replacing the car itself goes in One-off costs (a later step).",labels:["Car insurance","Car tax","Petrol / fuel","Car servicing & maintenance","Breakdown cover","Parking & permits","Public transport"]},{key:"health",title:"Health & protection",tier:"essential",tip:"Health spending tends to RISE with age — and the PLSA benchmarks exclude long-term care entirely. A monthly care set-aside is easy to add now and painful to discover missing later.",labels:["Personal health","Health / dental insurance","Dental & optical","Hearing","Life insurance / income protection","Long-term care set-aside"]},{key:"leisure",title:"Holidays, hobbies & leisure",tier:"discretionary",tip:'Most people spend MORE on holidays and hobbies in the early "go-go" years. Budget for the retirement you actually want — the spending smile tapers it in later life.',labels:["Main holiday","UK breaks","Day trips","Streaming & entertainment","Digital subscriptions","Gym & fitness","Sports & equipment","Sports clothes","Hobbies & leisure","Newspapers, books & media"]},{key:"personal",title:"Personal, family & giving",tier:"discretionary",tip:'The easiest category to underestimate: gifts, grandchildren, Christmas. A personal "spends" line per person keeps day-to-day money simple.',labels:["Clothes","Gifts & family","Charity","Pets","Personal spending money","Kids / dependents","Christmas & birthdays","Hairdressing & grooming","Grandchildren","Professional memberships","My personal spending","Partner's personal spending"]},{key:"extras",title:"Around the home & everything else",tier:"discretionary",tip:"Furniture wears out, technology needs refreshing, and a small emergency buffer stops a bad month becoming a plan problem. Anything of yours that didn't fit an earlier screen appears here too.",labels:["Home furnishings & décor","Home technology","Emergency buffer"]}],Iu=(()=>{const t={};for(const e of Io)for(const n of e.labels)t[n.toLowerCase()]=e.key;return t})(),xi=["intro",...Io.map(t=>t.key),"oneoffs","review"];let $n=0;function r1(t){return t.wizGroup&&Io.some(e=>e.key===t.wizGroup)?t.wizGroup:Iu[(t.label||"").trim().toLowerCase()]||"extras"}window.openBudgetWizard=function(){window._budget&&($n=0,document.getElementById("budWizardOverlay").style.display="block",_t())};window.closeBudgetWizard=function(){document.getElementById("budWizardOverlay").style.display="none",Vt(),Pn(),Be()};window.budWizGo=function(t){$n=Math.max(0,Math.min(xi.length-1,$n+t)),_t()};function i1(t){return t.annual==null?"":(t.period||"yr")==="mo"?Math.round(t.annual/12):t.annual}function o1(t){const e=t.period||"yr",n=Xr(t.label,window._budget),s=xg[wo(window._budget)].replace("PLSA ",""),r=n!=null&&n>0?s+" "+re(e==="mo"?n:n*12)+"/"+e:null,o=!!Iu[(t.label||"").trim().toLowerCase()]?'<div style="font-weight:600;">'+Te(t.label)+"</div>":'<input type="text" placeholder="What is it?" value="'+Te(t.label)+`" oninput="budWizField('`+t.id+`','label',this.value)" style="width:100%;">`,l=t.hint?'<div class="budwiz-hint">'+Te(t.hint)+"</div>":"",c=Mg(t.label,t.annual,window._budget),d=c?'<div class="budwiz-nudge" id="bw-n-'+t.id+'">'+(c==="low"?"Well below typical ("+re(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+re(n)+"/mo) — worth double-checking.")+"</div>":'<div class="budwiz-nudge" id="bw-n-'+t.id+'"></div>';return'<div class="budwiz-row" id="bw-row-'+t.id+'"><div class="budwiz-name">'+o+l+'</div><div class="budwiz-amt"><input type="text" inputmode="decimal" id="bw-amt-'+t.id+`" placeholder="£ or e.g. =12+9.50" title="Amount in today's money — sums welcome: 11.99+8.99, =4×52/12" value="`+i1(t)+`" onchange="budWizAmount('`+t.id+`',this.value,this)" style="flex:1 1 auto; min-width:0;"><button type="button" class="risk-btn" style="padding:6px 9px;" title="Switch monthly / yearly" onclick="budWizTogglePeriod('`+t.id+`')">/`+e+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" style="padding:6px 9px;" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bw','`+t.id+`')">&Sigma;</button></div><div class="budwiz-chipslot">`+(r?`<button type="button" class="budwiz-chip" onclick="budWizUseTypical('`+t.id+`')" title="ONS retired-household average — a starting point">`+r+" — use</button>":"")+"</div>"+(window._budget.sharedWithPartner?wl(t,"budWizField"):"")+(ca(t)?'<input type="number" placeholder="from age" title="From age (blank = retirement)" value="'+(t.fromAge??"")+`" oninput="budWizField('`+t.id+`','fromAge',this.value)" style="flex:0 0 78px;"><input type="number" placeholder="to age" title="To age (blank = end of plan). E.g. a car lease with 3 years left: to retirement age + 3." value="`+(t.toAge??"")+`" oninput="budWizField('`+t.id+`','toAge',this.value)" style="flex:0 0 78px;">`:"")+'<button type="button" class="risk-btn'+(ca(t)?" active":"")+'" style="padding:6px 9px;" title="'+(ca(t)?"Remove the age limits — make this a whole-of-retirement cost again":"Assumed for the whole retirement. Click to limit it to an age range — for temporary costs like a lease or a mortgage that ends.")+`" onclick="budWizBandToggle('`+t.id+`')">&#x23F1;</button><button type="button" class="risk-btn" style="padding:6px 11px;" title="Remove" onclick="budWizRemove('`+t.id+`')">&times;</button><div id="bw-err-`+t.id+'" class="budwiz-err"></div>'+d+(t.breakdownOpen?'<div style="flex-basis:100%;">'+$y("bw",t)+"</div>":"")+"</div>"}window.budWizField=function(t,e,n){const s=window._budget.lines.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="fromAge"||e==="toAge"?s[e]=n===""?null:El(n):s[e]=n===""?null:+n,e==="paidBy"&&_t(!0),budTouch(),ii())};window.budWizAmount=function(t,e,n){const s=window._budget.lines.find(o=>o.id===t);if(!s)return;const r=document.getElementById("bw-err-"+t),i=String(e).trim();if(i==="")s.annual=null,r&&(r.textContent="");else{const o=sl(i);if(o==null){r&&(r.textContent="Couldn’t read that — a number or a simple sum like 12.99+8.50 works.");return}r&&(r.textContent=""),s.annual=(s.period||"yr")==="mo"?o*12:o,n&&(n.value=(s.period||"yr")==="mo"?Math.round(s.annual/12):s.annual)}Lc(s),budTouch(),ii()};function Lc(t){const e=document.getElementById("bw-n-"+t.id);if(!e)return;const n=Xr(t.label,window._budget),s=Mg(t.label,t.annual,window._budget);e.textContent=s?s==="low"?"Well below typical ("+re(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+re(n)+"/mo) — worth double-checking.":""}function El(t){const e=+t;if(!Number.isFinite(e))return null;if(e>1e3){const n=new Date().getFullYear()-(+window._budget.currentAge||0);return Math.max(0,e-n)}return e}function ca(t){return t.fromAge!=null||t.toAge!=null||t._bandOpen}window.budWizBandToggle=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(ca(e)?(e._bandOpen=!1,e.fromAge=null,e.toAge=null,budTouch()):e._bandOpen=!0,_t(!0))};window.budWizTogglePeriod=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch(),_t(!0))};window.budWizUseTypical=function(t){const e=window._budget.lines.find(s=>s.id===t);if(!e)return;const n=Xr(e.label,window._budget);n!=null&&(e.annual=n*12,budTouch(),_t(!0))};window.budWizRemove=function(t){const e=window._budget.lines.findIndex(n=>n.id===t);e<0||(_l("line",window._budget.lines[e],e),window._budget.lines.splice(e,1),budTouch(),_t(!0))};window.budWizAddLine=function(t){const e=Io.find(n=>n.key===t);window._budget.lines.push({id:Ft(),label:"",tier:e&&e.tier||"discretionary",annual:null,fromAge:null,toAge:null,period:"mo",wizGroup:t}),budTouch(),_t(!0)};window.budWizSuggest=function(t,e){const n=Yi(window._budget).find(s=>s.label===t);n&&(window._budget.lines.push({id:Ft(),label:n.label,tier:n.tier,annual:null,fromAge:null,toAge:null,hint:n.hint||"",period:n.period||"yr",paidBy:n.paidBy||"me",wizGroup:e}),budTouch(),_t(!0))};const ri=t=>window._budget.lines.find(e=>e.id===t);function Su(t){if(t==="bw"){_t(!0);return}const e=window.scrollY;Vt(),Be(),window.scrollTo(0,e)}function $y(t,e){return'<div style="background:var(--card-alt); border:1px solid var(--border); border-radius:8px; padding:10px; margin-top:6px;"><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Break it into parts — mix /mo and /yr freely; sums (or =sums) are fine in each box. The total is written to the line for you, and the parts are saved.</div>'+(e.breakdown||[]).map((s,r)=>'<div style="display:flex; gap:6px; margin-bottom:6px; align-items:center;"><input type="text" placeholder="'+(r===0?"e.g. insurance":r===1?"e.g. fuel":"part "+(r+1))+'" value="'+Te(s.label)+`" oninput="budBreakField('`+t+"','"+e.id+"',"+r+`,'label',this.value)" style="flex:1 1 auto; min-width:0;"><input type="text" inputmode="decimal" placeholder="£ or =12+8" value="`+(s.amount??"")+`" onchange="budBreakField('`+t+"','"+e.id+"',"+r+`,'amount',this.value,this)" style="flex:0 0 104px;"><button type="button" class="risk-btn" style="padding:4px 8px;" title="This part is per month / per year" onclick="budBreakTogglePeriod('`+t+"','"+e.id+"',"+r+',this)">/'+(s.period||"yr")+`</button><button type="button" class="risk-btn" style="padding:4px 9px;" title="Remove part" onclick="budBreakRemoveRow('`+t+"','"+e.id+"',"+r+')">&times;</button></div>').join("")+`<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;"><button type="button" class="risk-btn" style="padding:4px 12px;" onclick="budBreakAddRow('`+t+"','"+e.id+`')">+ add part</button><div style="font-size:13px;">Adds up to <strong id="`+t+"-bsum-"+e.id+'">'+qy(e)+"</strong></div></div></div>"}function qy(t){const e=Pg(t.breakdown);return(t.period||"yr")==="mo"?re(e/12)+"/mo":re(e)+"/yr"}function xu(t,e){const n=ri(e);if(!n)return;if((n.breakdown||[]).some(r=>+r.amount)){n.annual=Pg(n.breakdown);const r=document.getElementById(t+"-amt-"+e);r&&(r.value=(n.period||"yr")==="mo"?Math.round(n.annual/12):n.annual)}const s=document.getElementById(t+"-bsum-"+e);s&&(s.textContent=qy(n)),t==="bw"?(ii(),typeof Lc=="function"&&Lc(n)):Be(),budTouch()}window.budBreakToggle=function(t,e){const n=ri(e);n&&(n.breakdownOpen=!n.breakdownOpen,n.breakdownOpen&&!Array.isArray(n.breakdown)&&(n.breakdown=[{label:"",amount:null,period:"mo"},{label:"",amount:null,period:"mo"}]),budTouch(),Su(t))};window.budBreakAddRow=function(t,e){const n=ri(e);n&&((n.breakdown=n.breakdown||[]).push({label:"",amount:null,period:"mo"}),Su(t))};window.budBreakRemoveRow=function(t,e,n){const s=ri(e);!s||!s.breakdown||(s.breakdown.splice(n,1),xu(t,e),Su(t))};window.budBreakField=function(t,e,n,s,r,i){const o=ri(e),l=o&&o.breakdown&&o.breakdown[n];if(!l)return;if(s==="label"){l.label=r,budTouch();return}const c=String(r).trim();if(c==="")l.amount=null;else{const d=sl(c);if(d==null)return;l.amount=d,i&&(i.value=d)}xu(t,e)};window.budBreakTogglePeriod=function(t,e,n,s){const r=ri(e),i=r&&r.breakdown&&r.breakdown[n];i&&(i.period=(i.period||"yr")==="mo"?"yr":"mo",s&&(s.textContent="/"+i.period),xu(t,e))};function a1(t){return'<div class="budwiz-row"><input type="text" placeholder="e.g. Replacement car" value="'+Te(t.label)+`" oninput="budWizOneOff('`+t.id+`','label',this.value)" style="flex:1 1 170px; min-width:150px;"><input type="text" inputmode="decimal" placeholder="£ total" title="Total cost in today's money — sums welcome" value="`+(t.amount??"")+`" onchange="budWizOneOffAmount('`+t.id+`',this.value,this)" style="flex:0 0 110px;"><input type="number" placeholder="at age" title="Age it first happens" value="`+(t.atAge??"")+`" oninput="budWizOneOff('`+t.id+`','atAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="every N yrs" title="Blank = one-time" value="`+(t.everyYears??"")+`" oninput="budWizOneOff('`+t.id+`','everyYears',this.value)" style="flex:0 0 104px;">`+(window._budget.sharedWithPartner?wl(t,"budWizOneOff"):"")+`<button type="button" class="risk-btn" style="padding:4px 10px;" onclick="budWizRemoveOneOff('`+t.id+`')">&times;</button><div id="bw-oerr-`+t.id+'" class="budwiz-err"></div></div>'}window.budWizOneOff=function(t,e,n){const s=window._budget.oneOffs.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="atAge"?s[e]=n===""?null:El(n):s[e]=n===""?null:+n,e==="paidBy"&&_t(!0),budTouch(),ii())};window.budWizOneOffAmount=function(t,e,n){const s=window._budget.oneOffs.find(o=>o.id===t);if(!s)return;const r=document.getElementById("bw-oerr-"+t),i=String(e).trim();if(i==="")s.amount=null,r&&(r.textContent="");else{const o=sl(i);if(o==null){r&&(r.textContent="Couldn’t read that — a number or a simple sum works.");return}r&&(r.textContent=""),s.amount=o,n&&(n.value=o)}budTouch(),ii()};window.budWizAddOneOff=function(){window._budget.oneOffs.push({id:Ft(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),budTouch(),_t(!0)};window.budWizRemoveOneOff=function(t){const e=window._budget.oneOffs.findIndex(n=>n.id===t);e<0||(_l("oneOff",window._budget.oneOffs[e],e),window._budget.oneOffs.splice(e,1),budTouch(),_t(!0))};window.budWizClearAmounts=function(){for(const t of window._budget.lines)t.annual=null;for(const t of window._budget.oneOffs)t.amount=null;budTouch(),_t(),showToast("Amounts cleared — nothing is saved until you choose Save.","info",4e3)};window.budWizSave=async function(t){await saveBudgetUI(),t&&await applyBudgetToPlan(),closeBudgetWizard()};function ii(){const t=document.getElementById("budWizTotals");if(!t)return;const e=window._budget,n=Zr(e);t.innerHTML="Essential <strong>"+re(n.essentialMonthlyNet)+"</strong>/mo · Lifestyle <strong>"+re(n.comfortableMonthlyNet-n.essentialMonthlyNet)+"</strong>/mo · All-in"+(n.sharedWithPartner?" (your share)":"")+' <strong style="color:var(--primary,#6366f1);">'+re(n.allInComfortableMonthly)+"</strong>/mo"}function l1(t){if(t==="intro"){const i=window._budget.lines.some(c=>c.annual)||window._budget.oneOffs.some(c=>c.amount)?'<div class="alert alert-warning" style="margin-bottom:12px;"><strong>You already have a saved budget</strong> — the totals in the bar below are your own saved figures, and each screen shows them ready to edit. Prefer a clean slate? <button type="button" class="risk-btn" style="padding:4px 12px; margin-left:4px;" onclick="budWizClearAmounts()">Start fresh — clear all amounts</button><span style="color:var(--text-muted);"> (nothing is saved until you choose Save at the end)</span></div>':"",o=wo(window._budget),l=(c,d)=>'<button type="button" class="risk-btn'+(o===c?" active":"")+'" data-tier="'+c+`" onclick="setPlsaTier('`+c+`')">`+d+"</button>";return'<h2 style="margin-bottom:10px;">Let’s build your budget</h2><p style="margin-bottom:12px;">We’ll walk through your spending one category at a time — bills first, then the fun stuff, then the big occasional costs. Skip anything; you can come back any time.</p>'+i+'<div style="margin-bottom:12px;"><div style="font-size:15px; margin-bottom:6px;"><strong>What are you aiming for?</strong> <span style="color:var(--text-muted);">— sets every typical-£ suggestion</span></div><div id="budWizTierBtns" style="display:flex; gap:8px; flex-wrap:wrap;">'+l("minimum","Minimum")+l("moderate","Moderate")+l("comfortable","Comfortable")+'</div><div style="font-size:13px; color:var(--text-muted); margin-top:6px;">PLSA Retirement Living Standards: Minimum = essentials, no car; Moderate = a car + two weeks in Europe; Comfortable = more of everything.</div></div><div class="alert alert-info" style="margin-bottom:12px;"><strong>Before you start:</strong> open your banking app and look at the last 2–3 months of statements. Real numbers beat guesses — most people who guess miss 20% of their spending.</div><ul style="padding-left:18px; color:var(--text-muted); line-height:1.8;"><li>Every amount box is a <strong>calculator</strong> — type <code>11.99+8.99+5.99</code> or <code>4×52/12</code> and it does the maths.</li><li><strong>Typical UK figures</strong> (ONS retired households) appear as one-tap chips when you’re unsure.</li><li>The <strong>&Sigma;</strong> button breaks a cost into parts (fuel + insurance + MOT…) so nothing gets forgotten.</li><li>Everything is in <strong>today’s money</strong>.</li>'+(window._budget.sharedWithPartner?"<li>Mark each line <strong>Me / Partner / Shared</strong> — your plan funds your share; your partner sees theirs.</li>":"")+"</ul>"}if(t==="oneoffs")return'<h2 style="margin-bottom:6px;">One-off & periodic costs</h2><p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">Big costs that land in a specific year: cars, roofs, weddings, milestone trips, helping the kids. Give recurring ones an "every N years" and we average them into your monthly need; one-time items stay as dated events.</p>'+(window._budget.oneOffs.map(a1).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing yet — add the big things below.</p>')+'<button type="button" class="risk-btn" style="margin-top:10px;" onclick="budWizAddOneOff()">+ Add a one-off</button>';if(t==="review"){const r=Zr(window._budget),i=Sg.single,o=r.allInComfortableAnnual,l=o>=i.comfortable?"at or above <strong>Comfortable</strong>":o>=i.moderate?"between <strong>Moderate</strong> and <strong>Comfortable</strong>":o>=i.minimum?"between <strong>Minimum</strong> and <strong>Moderate</strong>":"below the <strong>Minimum</strong>";let c='<h2 style="margin-bottom:10px;">Your spending picture</h2><div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;"><div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(r.sharedWithPartner?" — your share":"")+'</div><div style="font-size:24px;font-weight:700;">'+re(r.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div><div><div style="font-size:12px;color:var(--text-muted);">'+(r.sharedWithPartner?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:28px;font-weight:800;color:var(--primary,#6366f1);">'+re(r.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+re(o)+"/yr — what your plan funds</div></div>";r.sharedWithPartner&&(c+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:24px;font-weight:700;">'+re(r.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">their side — they can plan with this</div></div>'),c+="</div>",c+='<div class="alert alert-info" style="margin-bottom:14px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+re(i.minimum)+" · Moderate "+re(i.moderate)+" · Comfortable "+re(i.comfortable)+" per year — you’re "+l+'. <span style="color:var(--text-muted);">(Home owned outright; excludes care costs.)</span></div>';const d=Yi(window._budget).slice(0,8);return d.length&&(c+='<div style="margin-bottom:14px;"><div style="font-size:13px; margin-bottom:6px;"><strong>Did you miss anything?</strong> Tap to add, then find it on its category screen:</div><div style="display:flex; flex-wrap:wrap; gap:6px;">'+d.map(h=>'<button type="button" class="budwiz-chip" title="'+Te(h.hint||"")+`" onclick="budWizSuggest('`+Te(h.label).replace(/'/g,"\\'")+`', null)">+ `+Te(h.label)+"</button>").join("")+"</div></div>"),c+='<div style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">Everything is saved automatically as you type.</div>',c+='<div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:6px;"><button type="button" onclick="budWizSave(false)">Done</button><button type="button" onclick="budWizSave(true)">Set as my plan’s target (Stress + Decision) &amp; finish</button></div>',c}const e=Io.find(r=>r.key===t),n=window._budget.lines.filter(r=>r1(r)===e.key),s=Yi(window._budget).filter(r=>(Iu[r.label.toLowerCase()]||"extras")===e.key);return'<h2 style="margin-bottom:6px;">'+e.title+'</h2><div class="alert alert-info" style="margin-bottom:10px; font-size:13px;">'+e.tip+"</div>"+(n.map(o1).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing here yet — add below.</p>')+`<div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; align-items:center;"><button type="button" class="risk-btn" onclick="budWizAddLine('`+e.key+`')">+ Add your own</button>`+(s.length?'<span style="font-size:12px;color:var(--text-muted);">Often forgotten:</span>'+s.map(r=>'<button type="button" class="budwiz-chip" title="'+Te(r.hint||"")+`" onclick="budWizSuggest('`+Te(r.label).replace(/'/g,"\\'")+"','"+e.key+`')">+ `+Te(r.label)+"</button>").join(""):"")+"</div>"}function _t(t=!1){const e=document.getElementById("budWizardOverlay"),n=e.querySelector(".budwiz-body"),s=t&&n?n.scrollTop:0,r=xi[$n],i=$n===xi.length-1,o=xi.map((l,c)=>'<span class="budwiz-dot '+(c===$n?"on":c<$n?"done":"")+'"></span>').join("");e.innerHTML='<div class="budwiz-shell"><div class="budwiz-head" style="display:flex; justify-content:space-between; align-items:center;"><div style="font-size:13px; color:var(--text-muted);">Budget walk-through · step '+($n+1)+" of "+xi.length+'</div><button type="button" class="risk-btn" style="padding:4px 12px;" title="Close (your entries are kept)" onclick="closeBudgetWizard()">&times;</button></div><div class="budwiz-body">'+l1(r)+'</div><div class="budwiz-foot"><button type="button" class="risk-btn" onclick="budWizGo(-1)"'+($n===0?" disabled":"")+">Back</button>"+(i?"":'<button type="button" onclick="budWizGo(1)">'+(r==="intro"?"Start":"Next")+"</button>")+'<div class="budwiz-dots">'+o+'</div><div id="budWizUndoSlot" style="font-size:13px; color:var(--text-muted);"></div><div id="budWizTotals" style="margin-left:auto; font-size:13px; color:var(--text-muted);"></div></div></div>',ii(),e.querySelector(".budwiz-body").scrollTop=s}window.openStressExplainer=function(t){let e=document.getElementById("stressExplainer");e&&e.remove(),e=document.createElement("div"),e.id="stressExplainer",e.style.cssText="position:fixed; inset:0; z-index:1300; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; padding:20px;",e.innerHTML=`<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; max-width:720px; width:100%; max-height:88vh; overflow-y:auto; padding:28px; font-size:15px; line-height:1.65;"><h2 style="margin-bottom:4px;">What the Stress Tester is doing</h2><p style="color:var(--text-muted); margin-bottom:18px;">Every run asks the same question — <em>“if the future looked like this, would your money last?”</em> — and simulates your plan month by month: withdrawals sized to your spending need, tax paid, the ISA bridge drawn tax-free, protection mode in downturns. The three tabs differ only in <strong>where the “future” comes from</strong>.</p><div id="sx-mc" style="border-left:3px solid var(--primary,#6366f1); padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">🎲 Monte Carlo — a thousand plausible futures</h3><p style="color:var(--text-muted);">We deal 1,000 different futures by <strong>shuffling real history</strong>: each simulated year is a randomly-drawn year from 1928–2024, keeping that year’s stock market return and inflation together as they actually happened. Your plan is run through all 1,000; the headline number is how many survive. It answers: <em>“across a wide spread of plausible futures, what are my odds?”</em></p></div><div id="sx-hist" style="border-left:3px solid #14b8a6; padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">📜 Historical — every real retirement since 1928</h3><p style="color:var(--text-muted);">No shuffling: we replay history <strong>in order</strong>, once for every possible start year — retiring into 1929, into 1966, into 1973, into 2000… This is the classic sequence-of-returns test: the <em>order</em> of good and bad years matters as much as the average, and this tab shows exactly which real-world start years would have sunk your plan.</p></div><div id="sx-scen" style="border-left:3px solid #e67e22; padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">🔥 Scenarios — named nightmares, on repeat</h3><p style="color:var(--text-muted);">Five hand-picked 10-year sequences — the Great Depression, 1970s stagflation, the 2000s lost decade, 2008, and a synthetic worst-case — <strong>looped for your whole horizon</strong>. Deliberately unfair: a 35-year plan gets the 1970s three and a half times over. If your plan survives these, sequence risk is well covered; treat them as a stress rig, not a forecast.</p></div><h3 style="margin:20px 0 6px;">How each asset category is modelled</h3><p style="color:var(--text-muted); margin-bottom:8px;">Every future is built from just <strong>two primitives per year: the equity return and inflation</strong>. Everything else is derived from them, the same way in all three tabs:</p><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:12px; line-height:1.8;"><li><strong>Shares</strong> (trackers, income, REITs, EM, small-cap) ride the equity path directly.</li><li><strong>Bonds</strong> earn their own yield, and gain or lose as a <strong>gilt-yield path derived from inflation</strong> moves — so long gilts crash in a 2022-style inflation spike (big duration × rising yields) and rally in a 2008-style flight to quality. Your own bond-class mix (short gilts, linkers, credit…) drives the blend.</li><li><strong>Diversifiers</strong>: gold hedges inflation and tends to rise in crashes; trend-following holds a lagged momentum position (pays in long grinding bear markets, whipsaws in V-shapes); commodities hedge inflation hardest but fall <em>with</em> shares in a demand shock.</li><li><strong>Cash</strong> follows a rate model tied to inflation (roughly −1% real — the FCA convention).</li><li><strong>Your ISA</strong>: if you tagged your own funds, it’s modelled at <em>its</em> mix through all of the above; with a risk level only, it grows at a deliberately modest flat rate (the cash-like “bridge”).</li></ul><h3 style="margin:16px 0 6px;">Are the asset classes correlated? Yes — three ways</h3><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:12px; line-height:1.8;"><li><strong>Equity↔inflation:</strong> years are sampled (or replayed) whole, so “bad market + high inflation” arrive together exactly as often as they did in real history.</li><li><strong>Structural:</strong> bonds are mechanically linked to inflation through the yield path; gold, commodities and trend are functions of the same two primitives.</li><li><strong>Regime-aware residuals:</strong> each bond and diversifier class carries a correlation to equities that <em>changes with the regime</em> — in a normal year gilts barely co-move; in an inflation shock everything falls together (2022); in a deflationary crash gilts flip <em>negative</em> (flight to quality) while credit blows out <em>with</em> equities.</li></ul><h3 style="margin:16px 0 6px;">Honest limitations</h3><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:16px; line-height:1.8;"><li>In Historical replays, only shares-and-inflation are literal history — bond, gold and commodity returns are <em>model-implied</em> from those primitives, not the measured returns of that year.</li><li>Monte Carlo samples each year independently — real markets have some momentum and mean-reversion it doesn’t capture (the Historical tab covers that gap).</li><li>Categories are modelled, not individual funds — your specific fund can beat or trail its category.</li><li>The calibration figures are long-run estimates, not predictions. This is modelling, not advice.</li></ul><button type="button" onclick="document.getElementById('stressExplainer').remove()">Got it</button></div>`,e.addEventListener("click",s=>{s.target===e&&e.remove()}),document.body.appendChild(e);const n={mc:"sx-mc",hist:"sx-hist",scen:"sx-scen"}[t];if(n){const s=document.getElementById(n);s&&(s.scrollIntoView({block:"start"}),s.style.background="rgba(99,102,241,0.08)")}};let no="funds",is=null,cn=null,Hr=[];window.openAdminPanel=function(){const t=Yx();if(t){const e=prompt("Admin passphrase:");if(e!==t){e!==null&&showToast("Wrong passphrase","error");return}}is=pl().map(e=>({...e})),cn=JSON.parse(JSON.stringify(Gx()||{})),document.getElementById("adminPanelOverlay").style.display="block",us()};window.closeAdminPanel=function(){document.getElementById("adminPanelOverlay").style.display="none"};window.adminSetTab=function(t){no=t,us(!0)};function c1(t,e){const n=jg();let s="";for(const r of["shares","bonds","diversifiers","cash"]){const i=n[r]||[];s+='<optgroup label="'+vu[r]+'">'+i.map(o=>'<option value="'+o.key+'"'+(o.key===e?" selected":"")+">"+o.label+"</option>").join("")+"</optgroup>"}return'<select onchange="adminFundField('+t+`,'subClass',this.value)" style="width:200px;">`+s+"</select>"}window.adminFundField=function(t,e,n){const s=is[t];s&&(s[e]=e==="ticker"?String(n).toUpperCase():n)};window.adminFundRemove=function(t){is.splice(t,1),us(!0)};window.adminFundAdd=function(){is.push({ticker:"",name:"",subClass:"worldGrowth"}),us(!0)};window.adminSaveFunds=async function(){try{const t=await Kx(is);cr("ss",!0),cr("ds",!0),showToast("Fund catalogue saved to cloud ("+t+" funds) — live for all users.","success")}catch(t){showToast("Save failed: "+t.message,"error")}};window.adminRevertFunds=async function(){if(confirm("Remove the cloud fund-catalogue override and return to the shipped default list?"))try{await Qx(),is=pl().map(t=>({...t})),cr("ss",!0),cr("ds",!0),us(!0),showToast("Reverted to the shipped catalogue.","success")}catch(t){showToast("Revert failed: "+t.message,"error")}};window.adminProfileField=function(t,e,n){const s=Xd[t][e],r=n===""?void 0:+n;r===void 0||!Number.isFinite(r)||r===s?cn[t]&&(delete cn[t][e],Object.keys(cn[t]).length||delete cn[t]):(cn[t]=cn[t]||{})[e]=r};window.adminSaveProfiles=async function(){try{await oy(cn),showToast(Object.keys(cn).length?"Category model overrides saved — live for all users.":"No overrides — shipped calibration active.","success")}catch(t){showToast("Save failed: "+t.message,"error")}};window.adminResetProfiles=async function(){if(confirm("Clear ALL category-model overrides and return to the shipped calibration?")){cn={};try{await oy(null),us(!0),showToast("Shipped calibration restored.","success")}catch(t){showToast("Reset failed: "+t.message,"error")}}};window.adminLoadSuggestions=async function(){try{Hr=await Xx(),us(!0)}catch(t){showToast("Could not load suggestions: "+t.message,"error")}};window.adminSuggestionToFunds=function(t){const e=Hr[t];e&&(is.push({ticker:e.ticker,name:e.name||"",subClass:e.subClass||"worldGrowth"}),adminDeleteSuggestion(t,!0),no="funds",us(!0),showToast(e.ticker+' added to the funds editor — press "Save to cloud" to publish.',"info",4500))};window.adminDeleteSuggestion=async function(t,e){const n=Hr[t];if(n){Hr.splice(t,1);try{await Zx(n.id)}catch{}e||us(!0)}};function d1(){if(no==="funds"){const e=is.map((n,s)=>'<tr><td><input type="text" value="'+Te(n.ticker)+'" oninput="adminFundField('+s+`,'ticker',this.value)" style="width:80px;text-transform:uppercase;"></td><td><input type="text" value="`+Te(n.name)+'" oninput="adminFundField('+s+`,'name',this.value)" style="width:280px;"></td><td>`+c1(s,n.subClass)+'</td><td><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminFundRemove('+s+')">&times;</button></td></tr>').join("");return'<p style="font-size:13px;color:var(--text-muted);">The shared catalogue every user sees. Saving publishes a cloud override; revert returns to the list shipped in code. Each fund’s category decides which model it runs through.</p><div style="display:flex;gap:8px;margin:8px 0;"><button type="button" class="risk-btn" onclick="adminFundAdd()">+ Add fund</button><button type="button" onclick="adminSaveFunds()">Save to cloud</button><button type="button" class="risk-btn" onclick="adminRevertFunds()">Revert to shipped list</button><span style="font-size:12px;color:var(--text-muted);align-self:center;">'+is.length+' funds</span></div><div style="overflow-x:auto;"><table style="font-size:13px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Ticker</th><th style="text-align:left;">Name</th><th style="text-align:left;">Category (model)</th><th></th></tr></thead><tbody>'+e+"</tbody></table></div>"}if(no==="categories"){const e=["nominalReturn","yield","vol","eqCorr","duration","inflationBeta","creditBeta","idioVol"],n=Object.entries(Xd).map(([s,r])=>{const i=cn[s]||{},o=e.map(l=>{if(r[l]===void 0&&i[l]===void 0)return'<td style="color:var(--text-muted);text-align:center;">—</td>';const c=i[l]!==void 0?i[l]:r[l],d=i[l]!==void 0;return'<td><input type="number" step="0.001" value="'+c+'" title="Shipped default: '+r[l]+`" onchange="adminProfileField('`+s+"','"+l+`',this.value)" style="width:74px;`+(d?"border-color:#eab308;":"")+'"></td>'}).join("");return'<tr><td style="white-space:nowrap;"><strong>'+r.label+'</strong><br><span style="font-size:11px;color:var(--text-muted);">'+s+" · "+r.bucket+"</span></td>"+o+"</tr>"}).join("");return'<p style="font-size:13px;color:var(--text-muted);">The calibration seeds behind each category’s model (nominal figures; see SubAssetModel.js for the driver decomposition). Amber border = overridden vs shipped. Changes go live for all users on save — tune with care; the golden tests only protect the shipped values.</p><div style="display:flex;gap:8px;margin:8px 0;"><button type="button" onclick="adminSaveProfiles()">Save overrides to cloud</button><button type="button" class="risk-btn" onclick="adminResetProfiles()">Reset all to shipped</button></div><div style="overflow-x:auto;"><table style="font-size:12px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Category</th>'+e.map(s=>"<th>"+s+"</th>").join("")+"</tr></thead><tbody>"+n+"</tbody></table></div>"}return'<p style="font-size:13px;color:var(--text-muted);">Unknown tickers users categorised themselves. “Add to funds” copies one into the Funds editor (publish from there).</p><button type="button" class="risk-btn" onclick="adminLoadSuggestions()" style="margin:8px 0;">Refresh</button><div style="overflow-x:auto;"><table style="font-size:13px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Ticker</th><th style="text-align:left;">Chosen category</th><th style="text-align:left;">Name</th><th></th></tr></thead><tbody>'+(Hr.length?Hr.map((e,n)=>"<tr><td><strong>"+Te(e.ticker)+"</strong></td><td>"+Te(e.subClass||"(none)")+'</td><td style="color:var(--text-muted);">'+Te(e.name||"")+'</td><td><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminSuggestionToFunds('+n+')">Add to funds</button> <button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminDeleteSuggestion('+n+')">Dismiss</button></td></tr>').join(""):'<tr><td colspan="4" style="color:var(--text-muted);">Nothing loaded — press Refresh.</td></tr>')+"</tbody></table></div>"}function us(t=!1){const e=document.getElementById("adminPanelOverlay"),n=e.querySelector(".budwiz-body"),s=t&&n?n.scrollTop:0,r=(i,o)=>'<button type="button" class="risk-btn'+(no===i?" active":"")+`" onclick="adminSetTab('`+i+`')">`+o+"</button>";e.innerHTML='<div class="budwiz-shell"><div class="budwiz-head" style="display:flex; justify-content:space-between; align-items:center;"><div style="display:flex; gap:8px; align-items:center;"><strong>⚙ Administration</strong>'+r("funds","Funds")+r("categories","Category models")+r("suggestions","Suggestions")+'</div><button type="button" class="risk-btn" style="padding:4px 12px;" onclick="closeAdminPanel()">&times;</button></div><div class="budwiz-body">'+d1()+"</div></div>",e.querySelector(".budwiz-body").scrollTop=s}let Nc=!1,Oc=!1;async function oi(){try{const t=await wt();return!!(t&&t.locked)}catch(t){return console.warn("Could not read decision settings for lock state:",t),!1}}async function Hy(){try{const[t,e,n]=await Promise.all([wt(),Os({limit:1e3}),ds()]);if(n&&Object.values(n).some(i=>i&&i.yearSetupComplete))return!0;const s=zg(t);return(Array.isArray(e)?e:[]).some(i=>i.settingsChecksum===void 0||i.settingsChecksum===s)}catch(t){return console.warn("Could not determine derived-data state:",t),!0}}function Kf(t){const e=document.getElementById("decision-decisionsettings");e&&e.querySelectorAll("input, select, textarea, button").forEach(n=>{n.closest("#dsLockBanner")||n.id!=="dsSaveBtn"&&(n.disabled=!t)})}async function Au(){const t=document.getElementById("dsLockBanner"),e=document.getElementById("dsSaveBtn");if(!(!t||!e)){if(Nc=await oi(),!Nc){t.style.display="none",Kf(!0),e.textContent="Save Settings",e.classList.remove("btn-locked"),kc();return}Oc=!await Hy(),t.style.display="flex",t.className="lock-banner",Oc?t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Nothing has been recorded against them yet — no tax years, no monthly entries — so you can unlock and edit them.</span><button type="button" onclick="unlockDecisionSettings()">Unlock to edit</button>':t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Tax years or monthly entries have been recorded against them, so they can’t be changed. To use different settings, create a new plan.</span><button type="button" onclick="createNewPlanForSettings()">Create new plan</button>',Kf(!1),e.textContent="🔒 Locked",e.classList.add("btn-locked"),kc()}}window.unlockDecisionSettings=async function(){if(await Hy()){showToast("Can’t unlock — tax years or entries now depend on these settings. Create a new plan.","warning"),await Au();return}kt("Unlocking…");try{await or({locked:!1}),await bl(),showToast("Settings unlocked — you can edit them now.","success")}catch(t){console.error("Unlock error:",t),showToast("Could not unlock: "+t.message,"error")}finally{Ct()}};window.createNewPlanForSettings=function(){const t=document.getElementById("scenarioNewBtn");t&&t.click()};window.saveDecisionSettingsUI=async function(){if(!lt()){showToast("Please sign in to save settings","error");return}if(Nc||await oi()){showToast(Oc?"These settings are locked. Use “Unlock to edit” above to change them.":"These settings are locked. Define a new plan to use different settings.","info");return}const t=ul(document.getElementById("dsSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ds");if(mu(e.equityMin,e.bondMin,e.cashTarget)){kt("Saving settings...");try{await or({configured:!0,accessMethod:document.getElementById("dsAccessMethod").value||"drawdown",ufplsYears:+document.getElementById("dsUfplsYears").value||null,ufplsThenPcls:document.getElementById("dsUfplsPcls").checked,bandFillRecycle:document.getElementById("dsBandFillRecycle").checked,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("dsDuration").value,equityGlideEnabled:document.getElementById("dsEquityGlide").checked,baseSalary:+document.getElementById("dsBaseSalary").value,spendingProfile:document.getElementById("dsSpendingProfile").value||"flat",spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,disableProtection:document.getElementById("dsDisableProtection").checked,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value,isaBalance:+document.getElementById("dsIsaBalance").value||0,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:yu("ds"),taggedFunds:jt("ds").filter(n=>n.ticker&&n.value>0),locked:!0}),pu(),showToast("Settings saved and locked. Create a new plan to use different settings.","success",4e3),await Au()}catch(n){console.error("Error saving decision settings:",n),showToast("Error saving: "+n.message,"error")}finally{Ct()}}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){kt("Resetting settings...");try{await or({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await bl(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{Ct()}}};window.showDrawdownScheduleUI=async function(){const t=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const n=await ct();n.duration=e;const s=ty(n,e,t);let r='<div class="card"><h2>Projected Drawdown Schedule (SIPP + ISA bridge)</h2>';r+='<div class="alert alert-info" style="margin-bottom:16px;">SIPP is drawn to fill the basic-rate band; the tax-free <strong>ISA tops your income up to the target</strong> and runs down over the years (the bridge to the State Pension). Deterministic projection at your assumed inflation — the stochastic ISA path is in the Monte-Carlo / Historical results.</div>',r+='<div style="overflow-x: auto;"><table>',r+="<thead><tr><th>Year</th><th>SIPP Draw</th><th>State</th><th>Tax</th><th>Net (SIPP+SP)</th><th>ISA Top-up</th><th>Spendable</th><th>ISA Left</th></tr></thead>",r+="<tbody>";for(const i of s)r+=`<tr>
            <td>${i.year}</td>
            <td style="color: var(--primary); font-weight: 600;">${j(i.sippDraw)}</td>
            <td>${j(i.statePension)}</td>
            <td style="color: var(--danger);">-${j(i.tax)}</td>
            <td>${j(i.netIncome)}</td>
            <td style="color: var(--info);">${j(i.isaDraw)}</td>
            <td style="color: var(--success); font-weight: 600;">${j(i.spendable)}</td>
            <td>${j(i.isaBalance)}</td>
          </tr>`;r+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=r}catch(n){console.error("Drawdown error:",n),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};window.showGlidepathUI=async function(){const t=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const n=await ct();n.duration=e;const s=mS(n,t),r=ty(n,e,t),i={};r.forEach(h=>{i[h.year]=h.isaBalance});const o=!!n.equityGlideEnabled,l=(n.equityMin||0)+(n.bondMin||0)+(n.cashTarget||0),c={equity:l>0?n.equityMin/l:.5,bond:l>0?n.bondMin/l:.4,cash:l>0?n.cashTarget/l:.1,equityGlide:o?_o(n.equityMin,n.bondMin):void 0};let d='<div class="card"><h2>Fund Glidepath Over Time</h2>';d+='<div class="alert alert-info" style="margin-bottom: 20px;">',d+=o?"<strong>Bond tent on:</strong> the equity share (Shares %) RISES over the early years then holds; the £ floors inflate with CPI and deplete over time, cash holds its real value, and the ISA bridge runs down as it tops up income.":"<strong>Glidepath:</strong> Equity & Bond minimums inflate with CPI but deplete over time to £0; cash inflates only (holds real value); the ISA bridge runs down as it tops up income. Turn on the bond tent in Settings to see the equity share rise.",d+="</div>",d+='<div style="overflow-x: auto;"><table>',d+="<thead><tr><th>Year</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Shares % (of pot)</th><th>ISA Balance</th><th>Total Min</th></tr></thead>",d+="<tbody>";for(const h of s){const m=Math.round(Ec(c,h.year,n.duration).equity*100);d+=`<tr>
            <td>${h.year}</td>
            <td style="color: var(--success);">${j(h.equityMin)}</td>
            <td style="color: var(--info);">${j(h.bondMin)}</td>
            <td style="color: var(--warning);">${j(h.cashTarget)}</td>
            <td style="font-weight: 600;">${m}%</td>
            <td>${j(i[h.year]||0)}</td>
            <td style="font-weight: 600;">${j(h.totalMin)}</td>
          </tr>`}d+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=d}catch(n){console.error("Glidepath error:",n),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};let Zt=null,bn=[],wn="all";async function xn(){const t=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),n=document.getElementById("historyYearFilter"),s=document.getElementById("deleteAllHistoryBtn"),r=document.getElementById("deleteYearBtn");if(!t||!e)return;if(t.innerHTML='<span class="loading">Loading...</span>',bn=await Os({sortDesc:!1,limit:500}),s&&(s.style.display=bn.length>0?"":"none"),r&&(r.style.display="none"),bn.length===0){t.innerHTML="",n&&(n.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const i=[...new Set(bn.map(d=>d.date.split("-")[0]))].sort().reverse();if(n){let d='<option value="all">All Years</option>';i.forEach(h=>{d+=`<option value="${h}">${h}</option>`}),n.innerHTML=d,n.value=wn}r&&(r.style.display=wn!=="all"&&bn.length>0?"":"none");const o=wn==="all"?bn:bn.filter(d=>d.date.startsWith(wn));if(o.length===0){t.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${wn}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let l="";o.forEach(d=>{const h=d.date===Zt,m=["history-tab"];h&&m.push("active"),d.inProtection&&m.push("protection");const[p,w]=d.date.split("-").map(Number),T=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],S=wn==="all"?`${T[w-1]} ${p}`:T[w-1];l+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${d.date}')">${S}</button>`}),t.innerHTML=l;const c=document.getElementById("historyMobileSelector");if(c){let d="";o.forEach(h=>{const m=Wr(h.date),p=h.inProtection?" (Protection)":"";d+=`<option value="${h.date}">${m}${p}</option>`}),c.innerHTML=d}(!Zt||!o.find(d=>d.date===Zt))&&(Zt=o[o.length-1].date),c&&(c.value=Zt),Wy(Zt),setTimeout(()=>{const d=t.querySelector(".history-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(t){wn=t,Zt=null,xn()};function Wr(t){const[e,n]=t.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][n-1]} ${e}`}function Wy(t){const e=document.getElementById("historyDetail"),n=bn.find(d=>d.date===t);if(!n){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const s=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",r=n.isTaxEfficientYear!==!1&&n.mode==="Tax-Efficient",i=n.inProtection?"warning":r?"efficient":"inefficient",o=n.inProtection?`Protection${n.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:r?"Tax-Efficient":"Standard";let l=n.source||"Unknown";n.source==="Growth"&&(n.dEquity>0||n.dBond>0)?l=`Growth (Equity: ${s(n.dEquity||0)}, Bond: ${s(n.dBond||0)})`:n.source==="Cash"&&(l=`Cash (${s(n.dCash||n.sipp||0)})`);let c=`
        <div class="no-print" style="display:flex;justify-content:flex-end;margin-bottom:12px;">
          <button class="btn secondary" onclick="printMonthlyReport('${n.date}')">Download PDF</button>
        </div>
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${Wr(n.date)}</h3>
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
              <span class="value">${l}</span>
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
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===Wr(t))})}window.selectHistoryEntry=function(t){Zt=t,Wy(t);const e=document.getElementById("historyMobileSelector");e&&(e.value=t);const s=document.getElementById("historyTabs").querySelector(".history-tab.active");s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(t){const e=document.getElementById("historyTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function Ma(t){const[e,n]=t.split("-").map(Number);return n>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function Fc(t){const e={};for(const s of t){const r=s.taxYear||Ma(s.date);e[r]||(e[r]=0),e[r]+=s.isaSavingsUsedThisMonth||s.isa||0}for(const s of t)await Ug(s.date);const n=await ds();for(const[s,r]of Object.entries(e))if(n[s]){const i=n[s].isaSavingsUsed||0,o=Math.max(0,i-r);await fr(s,{...n[s],isaSavingsUsed:o})}}window.deleteHistoryEntry=async function(t){if(!lt()){showToast("Please sign in to delete entries","error");return}const e=await Os({sortDesc:!1,limit:1e3}),n=Ma(t),r=e.filter(c=>(c.taxYear||Ma(c.date))===n).sort((c,d)=>c.date.localeCompare(d.date)),i=r.findIndex(c=>c.date===t);if(i===-1){showToast("Entry not found","error");return}const o=i===r.length-1,l=Wr(t);if(o){if(!confirm(`Delete entry for ${l}?`))return;kt("Deleting entry...");try{await Fc([r[i]]),showToast(`Deleted ${l}`,"success"),Zt=null,await xn()}catch(c){console.error("Delete error:",c),showToast("Error deleting: "+c.message,"error")}finally{Ct()}}else{const c=r.slice(i),d=Wr(c[c.length-1].date);if(!confirm(`This will delete ${c.length} entries from ${l} to ${d} in tax year ${n}.

Continue?`))return;kt(`Deleting ${c.length} entries...`);try{await Fc(c),showToast(`Deleted ${c.length} entries`,"success"),Zt=null,await xn()}catch(h){console.error("Delete error:",h),showToast("Error deleting: "+h.message,"error")}finally{Ct()}}};window.deleteHistoryForTaxYear=async function(t){if(!lt()){showToast("Please sign in to delete entries","error");return}const n=(await Os({sortDesc:!1,limit:1e3})).filter(s=>(s.taxYear||Ma(s.date))===t);if(n.length===0){showToast(`No history entries for tax year ${t}`,"info");return}if(confirm(`Delete all ${n.length} history entries for tax year ${t}?`)){kt(`Deleting tax year ${t}...`);try{await Fc(n);const s=await ds();s[t]&&await fr(t,{...s[t],isaSavingsUsed:0}),showToast(`Deleted all entries for ${t}`,"success"),Zt=null,await xn()}catch(s){console.error("Delete error:",s),showToast("Error deleting: "+s.message,"error")}finally{Ct()}}};window.deleteHistoryForSelectedYear=async function(){if(wn==="all"){showToast("Select a specific year first","error");return}const t=`${parseInt(wn)%100}/${(parseInt(wn)+1)%100}`;await deleteHistoryForTaxYear(t)};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!lt()){showToast("Please sign in to delete entries","error");return}kt("Deleting all history...");try{const t=await Os({limit:1e3});for(const n of t)await Ug(n.date);const e=await ds();for(const[n,s]of Object.entries(e))s.isaSavingsUsed>0&&await fr(n,{...s,isaSavingsUsed:0});showToast(`Deleted ${t.length} entries`,"success"),Zt=null,await xn()}catch(t){console.error("Delete all error:",t),showToast("Error deleting: "+t.message,"error")}finally{Ct()}}};let Ws=null;async function dr(){const t=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!t||!e)return;t.innerHTML='<span class="loading">Loading...</span>';const n=await ds(),s=await wt(),r=Object.keys(n).sort(),i=u1(),o=h1(r,i,40);let l="";o.forEach(h=>{const m=n[h],p=m&&m.yearSetupComplete,w=h===Ws,T=["tax-year-tab"];w&&T.push("active"),p||T.push("not-setup"),l+=`<button class="${T.join(" ")}" onclick="selectTaxYear('${h}')">${h}</button>`}),t.innerHTML=l;const c=document.getElementById("taxYearMobileSelector");if(c){let h="";o.forEach(m=>{const p=n[m],T=p&&p.yearSetupComplete?m:`${m} (not set up)`;h+=`<option value="${m}">${T}</option>`}),c.innerHTML=h}if(!Ws){const h=r.filter(m=>{var p;return(p=n[m])==null?void 0:p.yearSetupComplete});Ws=h.length>0?h[h.length-1]:i}c&&(c.value=Ws),await Yy(Ws,n,s);const d=t.querySelector(".tax-year-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function u1(){const t=new Date,e=t.getFullYear(),n=t.getMonth()+1;return n<4||n===4&&t.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function h1(t,e,n){const s=new Set(t),[r]=e.split("/").map(Number),i=r<50?2e3+r:1900+r;for(let o=0;o<n&&s.size<n;o++){const l=i+o,c=l+1;s.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(s).sort()}async function Yy(t,e,n){var _,b,E,x,y,te,oe,q,ne,se,ae,we,Ie,ie;const s=document.getElementById("taxYearDetail"),r=e[t];if(!r||!r.yearSetupComplete){s.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${t} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${t}')">Set Up ${t}</button>
          </div>
        `;return}const i=await Kd(t),o=Math.round(i.amount||0),l=i.startDate||"Not configured",c=i.isReceiving;i.yearsUntil;const d=F=>F!=null?"£"+Math.round(F).toLocaleString():"—",h=(n.equityMin||0)+(n.bondMin||0)+(n.cashTarget||0),m=n.duration||35,p=Math.max(0,2e3+(parseInt(t.split("/")[0],10)||26)-2026),w=!!n.equityGlideEnabled,T={equity:h>0?n.equityMin/h:.5,bond:h>0?n.bondMin/h:.4,cash:h>0?n.cashTarget/h:.1,equityGlide:w?_o(n.equityMin,n.bondMin):void 0},S=Ec(T,p,m),A=Ec(T,Math.max(0,p-1),m),P=F=>Math.round(F*100),C=Math.max(5,m-20),L=P(S.equity)-P(A.equity),D=`${P(S.equity)}% shares / ${P(S.bond)}% bonds / ${P(S.cash)}% cash`;let O,$;w?p>C?($=`Holding — reached your mix at year ${C}`,O=`You've reached your endgame mix. Hold ${D}; no glide change this year.`):L>0?($=`Rising — year ${p} of ${C}`,O=`Shift about ${L}% of your pot from bonds into shares this year, reaching ${D}.`):($=`Rising — year ${p} of ${C}`,O=`Hold ${D}.`):($="Flat (bond tent off)",O=`Hold a steady ${D}. Rebalance back to this whenever it drifts.`);const I=`
        <div class="tax-year-detail-card">
          <h3>This Year's Target Mix${w?" — Bond Tent":""}</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field"><label>Shares</label><span class="value">${P(S.equity)}% · ${d(h*S.equity)}</span></div>
            <div class="tax-year-field"><label>Bonds</label><span class="value">${P(S.bond)}% · ${d(h*S.bond)}</span></div>
            <div class="tax-year-field"><label>Cash</label><span class="value">${P(S.cash)}% · ${d(h*S.cash)}</span></div>
            <div class="tax-year-field"><label>Glide stage</label><span class="value">${$}</span></div>
          </div>
          <div class="alert alert-info" style="margin-top:12px;"><strong>Rebalance:</strong> ${O}</div>
        </div>`;let v=`<div class="no-print" style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:12px;"><button class="btn secondary" onclick="printAnnualReport('${t}')">Download PDF</button> <button class="btn secondary" onclick="exportAnnualCsv('${t}')">Export CSV</button></div>`+I+`
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
              <span class="value">${c?d(o)+(i.isFirstYear?" (partial year)":""):l!=="Not configured"?`Starts ${l}`:"Not configured"}</span>
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
              <span class="value">${f1(r.startMonth||4)}</span>
            </div>
            <div class="tax-year-field">
              <label>Remaining Months (at setup)</label>
              <span class="value">${r.remainingMonths||12}</span>
            </div>
          </div>
        </div>
      `;if(r.expectedMonthly){const F=r.expectedMonthly;v+=`
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
                  <td>${d((_=F.sipp)==null?void 0:_.gross)}</td>
                  <td class="tax-col">-${d((b=F.sipp)==null?void 0:b.tax)}</td>
                  <td class="net-col">${d((E=F.sipp)==null?void 0:E.net)}</td>
                </tr>
                ${((x=F.other)==null?void 0:x.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${d((y=F.other)==null?void 0:y.gross)}</td>
                  <td class="tax-col">-${d((te=F.other)==null?void 0:te.tax)}</td>
                  <td class="net-col">${d((oe=F.other)==null?void 0:oe.net)}</td>
                </tr>
                `:""}
                ${((q=F.statePension)==null?void 0:q.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${d((ne=F.statePension)==null?void 0:ne.gross)}</td>
                  <td class="tax-col">-${d((se=F.statePension)==null?void 0:se.tax)}</td>
                  <td class="net-col">${d((ae=F.statePension)==null?void 0:ae.net)}</td>
                </tr>
                `:""}
                ${((we=F.isa)==null?void 0:we.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${d((Ie=F.isa)==null?void 0:Ie.gross)}</td>
                  <td style="color:var(--success);">£0</td>
                  <td class="net-col">${d((ie=F.isa)==null?void 0:ie.net)}</td>
                </tr>
                `:""}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>${d(F.totalGross)}</strong></td>
                  <td class="tax-col"><strong>-${d(F.totalTax)}</strong></td>
                  <td class="net-col"><strong>${d(F.totalNet)}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p style="margin-top:16px;font-size:14px;color:var(--text);">
              <strong>Monthly take-home: ${d(F.totalNet)}</strong>
            </p>
          </div>
        `}v+=`
        <div class="tax-year-actions">
          <button class="btn secondary" onclick="deleteTaxYear('${t}')">Delete Year</button>
          <button class="btn secondary" onclick="reconfigureTaxYear('${t}')">Reconfigure via Wizard</button>
        </div>
      `,s.innerHTML=v,document.querySelectorAll(".tax-year-tab").forEach(F=>{F.classList.toggle("active",F.textContent===t)})}window.selectTaxYear=async function(t){Ws=t;const e=await ds(),n=await wt();await Yy(t,e,n),document.querySelectorAll(".tax-year-tab").forEach(o=>{o.classList.toggle("active",o.textContent===t)});const s=document.getElementById("taxYearMobileSelector");s&&(s.value=t);const i=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${t}')"]`);i&&i.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(t){const e=document.getElementById("taxYearTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function f1(t){return["January","February","March","April","May","June","July","August","September","October","November","December"][(t-1)%12]||"April"}window.triggerWizardForYear=async function(t){const[e]=t.split("/").map(Number),n=e<50?2e3+e:1900+e,s=`${n}-04`,r=document.getElementById("entryMonth");r&&(r.value=s,r.dispatchEvent(new Event("input"))),document.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(i=>i.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(i=>i.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),showToast(`Please click "Calculate" with April ${n} selected to set up tax year ${t}`,"info",5e3)};window.reconfigureTaxYear=async function(t){if(confirm(`This will allow you to reconfigure tax year ${t}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await ol(t);e.yearSetupComplete=!1,await fr(t,e),await dr(),showToast(`Tax year ${t} marked for reconfiguration. Calculate a decision for this year to run the wizard again.`,"success",5e3)}catch(e){console.error("Error:",e),showToast("Error: "+e.message,"error")}};window.updateTaxYear=async function(t,e,n){try{const s=await ol(t);s[e]=parseFloat(n),await fr(t,s)}catch(s){console.error("Error updating tax year:",s),showToast("Error saving: "+s.message,"error")}};window.deleteTaxYear=async function(t){if(confirm("Delete tax year "+t+"? This will remove all configuration for this year."))try{const e=await Rn();delete e.taxYears[t],await il(e),Ws=null,await dr()}catch(e){console.error("Error deleting tax year:",e),showToast("Error deleting: "+e.message,"error")}};window.addTaxYear=async function(){if(!lt()){showToast("Please sign in to add tax years","error");return}const t=prompt("Enter tax year (e.g., 25/26):");if(!t||!/^\d{2}\/\d{2}$/.test(t)){showToast("Invalid format. Use YY/YY (e.g., 25/26)","error");return}try{await fr(t,{}),await dr()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error")}};console.log("Pension Planner v"+Qf+" loaded");
