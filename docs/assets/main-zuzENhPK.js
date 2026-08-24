(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();function k0(t){const e=(t.sippDraw||0)+(t.other||0)+(t.statePension||0),n=e*12,s=t.pa||12570,r=t.brl||50270,i=t.hrl||125140;let o=0;n>s&&(n<=r?o=(n-s)*.2:n<=i?o=(r-s)*.2+(n-r)*.4:o=(r-s)*.2+(i-r)*.4+(n-i)*.45);const a=t.monthlyTax!=null?t.monthlyTax:o/12,c=t.monthlyTax!=null&&t.totalMonthlyNet!=null?t.totalMonthlyNet:e-a+(t.isaDraw||0);return{date:t.date,taxYear:t.taxYear,yearNum:t.yearNumber,equity:t.equity,bond:t.bond,cash:t.cash,total:t.equity+t.bond+t.cash,adjEquity:t.adjEquityMin,adjBond:t.adjBondMin,adjCash:t.adjCashTarget,source:t.source,dEquity:t.drawFromEquity||0,dBond:t.drawFromBond||0,dCash:t.drawFromCash||0,sipp:t.sippDraw,stdSipp:t.stdSipp||t.sippDraw,isa:t.isaDraw,other:t.other,state:t.statePension,pa:s,brl:r,monthlyTax:a,monthlyNet:c,mode:t.taxEfficient?"Tax-Efficient":"Standard",inProtection:t.inProtection,reason:t.protectionReason||"",consecutiveDraws:t.consecutiveCashDraws||0,boostAmount:t.boostAmount,boostEligible:t.boostEligible||!1,rebal:t.rebalanceActions?t.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:t.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:t.isaDraw||0,cumulativeIsaSavingsUsed:t.cumulativeIsaSavingsUsed||0,taxPaidMonthly:a,taxFree:t.taxFree||0,recycleNet:t.recycleNet||0,accessMethod:t.accessMethod||"drawdown",taxPaidYTD:t.taxPaidYTD||a,taxProjectedAnnual:t.taxProjectedAnnual||o,taxSavedMonthly:t.taxSavedMonthly||0,taxSavedYTD:t.taxSavedYTD||0,taxSavedProjectedAnnual:t.taxSavedProjectedAnnual||0,isTaxEfficientYear:t.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:t.protectionInducedTaxEfficiency||!1,remainingMonths:t.remainingMonths||12}}const Jo={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},C0="modulepreload",P0=function(t,e){return new URL(t,e).href},wh={},Eh=function(e,n,s){let r=Promise.resolve();if(n&&n.length>0){const o=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));r=Promise.allSettled(n.map(d=>{if(d=P0(d,s),d in wh)return;wh[d]=!0;const h=d.endsWith(".css"),m=h?'[rel="stylesheet"]':"";if(!!s)for(let T=o.length-1;T>=0;T--){const E=o[T];if(E.href===d&&(!h||E.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const y=document.createElement("link");if(y.rel=h?"stylesheet":C0,h||(y.as="script"),y.crossOrigin="",y.href=d,c&&y.setAttribute("nonce",c),document.head.appendChild(y),h)return new Promise((T,E)=>{y.addEventListener("load",T),y.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return r.then(o=>{for(const a of o||[])a.status==="rejected"&&i(a.reason);return e().catch(i)})},cp="6.0.0",Xe={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},dp={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},Ft={RETURN:.03,MIN:0,DRAWDOWN_STRATEGY:"minimiseEarlyTax"},be={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},Is={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},rr={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},$a={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},R0={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},vn={START_MONTH:4,START_DAY:6},Gi=.04,up=dp.OTHER_INCOME_CAP;function $l(t,e,n=up){let s=t;for(const r of e)s*=1+Math.min(r,n);return s}function Xc(t){let e=t;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function Pr(t,e,n){const s=Math.max(n(),1e-12),r=n();let i=Math.sqrt(-2*Math.log(s))*Math.cos(2*Math.PI*r);return i=Math.max(-4,Math.min(4,i)),t+e*i}function qa(t){const e=JSON.stringify(t);let n=0;for(let s=0;s<e.length;s++){const r=e.charCodeAt(s);n=(n<<5)-n+r,n=n&n}return n.toString(16)}var _h={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hp=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let r=t.charCodeAt(s);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},M0=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const r=t[n++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=t[n++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=t[n++],o=t[n++],a=t[n++],c=((r&7)<<18|(i&63)<<12|(o&63)<<6|a&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const i=t[n++],o=t[n++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|o&63)}}return e.join("")},fp={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<t.length;r+=3){const i=t[r],o=r+1<t.length,a=o?t[r+1]:0,c=r+2<t.length,d=c?t[r+2]:0,h=i>>2,m=(i&3)<<4|a>>4;let f=(a&15)<<2|d>>6,y=d&63;c||(y=64,o||(f=64)),s.push(n[h],n[m],n[f],n[y])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(hp(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):M0(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<t.length;){const i=n[t.charAt(r++)],a=r<t.length?n[t.charAt(r)]:0;++r;const d=r<t.length?n[t.charAt(r)]:64;++r;const m=r<t.length?n[t.charAt(r)]:64;if(++r,i==null||a==null||d==null||m==null)throw new D0;const f=i<<2|a>>4;if(s.push(f),d!==64){const y=a<<4&240|d>>2;if(s.push(y),m!==64){const T=d<<6&192|m;s.push(T)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class D0 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const B0=function(t){const e=hp(t);return fp.encodeByteArray(e,!0)},Ea=function(t){return B0(t).replace(/\./g,"")},pp=function(t){try{return fp.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function L0(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const N0=()=>L0().__FIREBASE_DEFAULTS__,O0=()=>{if(typeof process>"u"||typeof _h>"u")return;const t=_h.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},F0=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&pp(t[1]);return e&&JSON.parse(e)},Ha=()=>{try{return N0()||O0()||F0()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},mp=t=>{var e,n;return(n=(e=Ha())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},V0=t=>{const e=mp(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),s]:[e.substring(0,n),s]},gp=()=>{var t;return(t=Ha())===null||t===void 0?void 0:t.config},yp=t=>{var e;return(e=Ha())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z0{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
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
 */function U0(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=e||"demo-project",r=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Ea(JSON.stringify(n)),Ea(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function $0(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(wt())}function q0(){var t;const e=(t=Ha())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function H0(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function W0(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Y0(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function G0(){const t=wt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function j0(){return!q0()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function K0(){try{return typeof indexedDB=="object"}catch{return!1}}function Q0(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var i;e(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const J0="FirebaseError";class ss extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=J0,Object.setPrototypeOf(this,ss.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,yo.prototype.create)}}class yo{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},r=`${this.service}/${e}`,i=this.errors[e],o=i?X0(i,s):"Error",a=`${this.serviceName}: ${o} (${r}).`;return new ss(r,a,s)}}function X0(t,e){return t.replace(Z0,(n,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const Z0=/\{\$([^}]+)}/g;function ev(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function _a(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const r of n){if(!s.includes(r))return!1;const i=t[r],o=e[r];if(Th(i)&&Th(o)){if(!_a(i,o))return!1}else if(i!==o)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function Th(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vo(t){const e=[];for(const[n,s]of Object.entries(t))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Ci(t){const e={};return t.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[r,i]=s.split("=");e[decodeURIComponent(r)]=decodeURIComponent(i)}}),e}function Pi(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function tv(t,e){const n=new nv(t,e);return n.subscribe.bind(n)}class nv{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,s){let r;if(e===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");sv(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:s},r.next===void 0&&(r.next=ql),r.error===void 0&&(r.error=ql),r.complete===void 0&&(r.complete=ql);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function sv(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function ql(){}/**
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
 */function Re(t){return t&&t._delegate?t._delegate:t}class ir{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Qs="[DEFAULT]";/**
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
 */class rv{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new z0;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ov(e))try{this.getOrInitializeService({instanceIdentifier:Qs})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=Qs){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Qs){return this.instances.has(e)}getOptions(e=Qs){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[i,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(i);s===a&&o.resolve(r)}return r}onInit(e,n){var s;const r=this.normalizeInstanceIdentifier(n),i=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;i.add(e),this.onInitCallbacks.set(r,i);const o=this.instances.get(r);return o&&e(o,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:iv(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Qs){return this.component?this.component.multipleInstances?e:Qs:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function iv(t){return t===Qs?void 0:t}function ov(t){return t.instantiationMode==="EAGER"}/**
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
 */class av{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new rv(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var de;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(de||(de={}));const lv={debug:de.DEBUG,verbose:de.VERBOSE,info:de.INFO,warn:de.WARN,error:de.ERROR,silent:de.SILENT},cv=de.INFO,dv={[de.DEBUG]:"log",[de.VERBOSE]:"log",[de.INFO]:"info",[de.WARN]:"warn",[de.ERROR]:"error"},uv=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),r=dv[e];if(r)console[r](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Zc{constructor(e){this.name=e,this._logLevel=cv,this._logHandler=uv,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in de))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?lv[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,de.DEBUG,...e),this._logHandler(this,de.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,de.VERBOSE,...e),this._logHandler(this,de.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,de.INFO,...e),this._logHandler(this,de.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,de.WARN,...e),this._logHandler(this,de.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,de.ERROR,...e),this._logHandler(this,de.ERROR,...e)}}const hv=(t,e)=>e.some(n=>t instanceof n);let Ih,Sh;function fv(){return Ih||(Ih=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function pv(){return Sh||(Sh=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const vp=new WeakMap,ac=new WeakMap,bp=new WeakMap,Hl=new WeakMap,ed=new WeakMap;function mv(t){const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(Ss(t.result)),r()},o=()=>{s(t.error),r()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&vp.set(n,t)}).catch(()=>{}),ed.set(e,t),e}function gv(t){if(ac.has(t))return;const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),r()},o=()=>{s(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});ac.set(t,e)}let lc={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return ac.get(t);if(e==="objectStoreNames")return t.objectStoreNames||bp.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Ss(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function yv(t){lc=t(lc)}function vv(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(Wl(this),e,...n);return bp.set(s,e.sort?e.sort():[e]),Ss(s)}:pv().includes(t)?function(...e){return t.apply(Wl(this),e),Ss(vp.get(this))}:function(...e){return Ss(t.apply(Wl(this),e))}}function bv(t){return typeof t=="function"?vv(t):(t instanceof IDBTransaction&&gv(t),hv(t,fv())?new Proxy(t,lc):t)}function Ss(t){if(t instanceof IDBRequest)return mv(t);if(Hl.has(t))return Hl.get(t);const e=bv(t);return e!==t&&(Hl.set(t,e),ed.set(e,t)),e}const Wl=t=>ed.get(t);function wv(t,e,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const o=indexedDB.open(t,e),a=Ss(o);return s&&o.addEventListener("upgradeneeded",c=>{s(Ss(o.result),c.oldVersion,c.newVersion,Ss(o.transaction),c)}),n&&o.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),a.then(c=>{i&&c.addEventListener("close",()=>i()),r&&c.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),a}const Ev=["get","getKey","getAll","getAllKeys","count"],_v=["put","add","delete","clear"],Yl=new Map;function xh(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Yl.get(e))return Yl.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,r=_v.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||Ev.includes(n)))return;const i=async function(o,...a){const c=this.transaction(o,r?"readwrite":"readonly");let d=c.store;return s&&(d=d.index(a.shift())),(await Promise.all([d[n](...a),r&&c.done]))[0]};return Yl.set(e,i),i}yv(t=>({...t,get:(e,n,s)=>xh(e,n)||t.get(e,n,s),has:(e,n)=>!!xh(e,n)||t.has(e,n)}));/**
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
 */class Tv{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Iv(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function Iv(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const cc="@firebase/app",Ah="0.10.13";/**
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
 */const Kn=new Zc("@firebase/app"),Sv="@firebase/app-compat",xv="@firebase/analytics-compat",Av="@firebase/analytics",kv="@firebase/app-check-compat",Cv="@firebase/app-check",Pv="@firebase/auth",Rv="@firebase/auth-compat",Mv="@firebase/database",Dv="@firebase/data-connect",Bv="@firebase/database-compat",Lv="@firebase/functions",Nv="@firebase/functions-compat",Ov="@firebase/installations",Fv="@firebase/installations-compat",Vv="@firebase/messaging",zv="@firebase/messaging-compat",Uv="@firebase/performance",$v="@firebase/performance-compat",qv="@firebase/remote-config",Hv="@firebase/remote-config-compat",Wv="@firebase/storage",Yv="@firebase/storage-compat",Gv="@firebase/firestore",jv="@firebase/vertexai-preview",Kv="@firebase/firestore-compat",Qv="firebase",Jv="10.14.1";/**
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
 */const dc="[DEFAULT]",Xv={[cc]:"fire-core",[Sv]:"fire-core-compat",[Av]:"fire-analytics",[xv]:"fire-analytics-compat",[Cv]:"fire-app-check",[kv]:"fire-app-check-compat",[Pv]:"fire-auth",[Rv]:"fire-auth-compat",[Mv]:"fire-rtdb",[Dv]:"fire-data-connect",[Bv]:"fire-rtdb-compat",[Lv]:"fire-fn",[Nv]:"fire-fn-compat",[Ov]:"fire-iid",[Fv]:"fire-iid-compat",[Vv]:"fire-fcm",[zv]:"fire-fcm-compat",[Uv]:"fire-perf",[$v]:"fire-perf-compat",[qv]:"fire-rc",[Hv]:"fire-rc-compat",[Wv]:"fire-gcs",[Yv]:"fire-gcs-compat",[Gv]:"fire-fst",[Kv]:"fire-fst-compat",[jv]:"fire-vertex","fire-js":"fire-js",[Qv]:"fire-js-all"};/**
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
 */const Ta=new Map,Zv=new Map,uc=new Map;function kh(t,e){try{t.container.addComponent(e)}catch(n){Kn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function qr(t){const e=t.name;if(uc.has(e))return Kn.debug(`There were multiple attempts to register component ${e}.`),!1;uc.set(e,t);for(const n of Ta.values())kh(n,t);for(const n of Zv.values())kh(n,t);return!0}function td(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function un(t){return t.settings!==void 0}/**
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
 */const eb={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},xs=new yo("app","Firebase",eb);/**
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
 */class tb{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new ir("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw xs.create("app-deleted",{appName:this._name})}}/**
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
 */const si=Jv;function wp(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:dc,automaticDataCollectionEnabled:!1},e),r=s.name;if(typeof r!="string"||!r)throw xs.create("bad-app-name",{appName:String(r)});if(n||(n=gp()),!n)throw xs.create("no-options");const i=Ta.get(r);if(i){if(_a(n,i.options)&&_a(s,i.config))return i;throw xs.create("duplicate-app",{appName:r})}const o=new av(r);for(const c of uc.values())o.addComponent(c);const a=new tb(n,s,o);return Ta.set(r,a),a}function Ep(t=dc){const e=Ta.get(t);if(!e&&t===dc&&gp())return wp();if(!e)throw xs.create("no-app",{appName:t});return e}function As(t,e,n){var s;let r=(s=Xv[t])!==null&&s!==void 0?s:t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Kn.warn(a.join(" "));return}qr(new ir(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const nb="firebase-heartbeat-database",sb=1,ji="firebase-heartbeat-store";let Gl=null;function _p(){return Gl||(Gl=wv(nb,sb,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(ji)}catch(n){console.warn(n)}}}}).catch(t=>{throw xs.create("idb-open",{originalErrorMessage:t.message})})),Gl}async function rb(t){try{const n=(await _p()).transaction(ji),s=await n.objectStore(ji).get(Tp(t));return await n.done,s}catch(e){if(e instanceof ss)Kn.warn(e.message);else{const n=xs.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Kn.warn(n.message)}}}async function Ch(t,e){try{const s=(await _p()).transaction(ji,"readwrite");await s.objectStore(ji).put(e,Tp(t)),await s.done}catch(n){if(n instanceof ss)Kn.warn(n.message);else{const s=xs.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Kn.warn(s.message)}}}function Tp(t){return`${t.name}!${t.options.appId}`}/**
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
 */const ib=1024,ob=30*24*60*60*1e3;class ab{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new cb(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Ph();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const a=new Date(o.date).valueOf();return Date.now()-a<=ob}),this._storage.overwrite(this._heartbeatsCache))}catch(s){Kn.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Ph(),{heartbeatsToSend:s,unsentEntries:r}=lb(this._heartbeatsCache.heartbeats),i=Ea(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return Kn.warn(n),""}}}function Ph(){return new Date().toISOString().substring(0,10)}function lb(t,e=ib){const n=[];let s=t.slice();for(const r of t){const i=n.find(o=>o.agent===r.agent);if(i){if(i.dates.push(r.date),Rh(n)>e){i.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),Rh(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class cb{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return K0()?Q0().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await rb(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Ch(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Ch(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Rh(t){return Ea(JSON.stringify({version:2,heartbeats:t})).length}/**
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
 */function db(t){qr(new ir("platform-logger",e=>new Tv(e),"PRIVATE")),qr(new ir("heartbeat",e=>new ab(e),"PRIVATE")),As(cc,Ah,t),As(cc,Ah,"esm2017"),As("fire-js","")}db("");var ub="firebase",hb="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */As(ub,hb,"app");function nd(t,e){var n={};for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.indexOf(s)<0&&(n[s]=t[s]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(t);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(t,s[r])&&(n[s[r]]=t[s[r]]);return n}function Ip(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const fb=Ip,Sp=new yo("auth","Firebase",Ip());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ia=new Zc("@firebase/auth");function pb(t,...e){Ia.logLevel<=de.WARN&&Ia.warn(`Auth (${si}): ${t}`,...e)}function ia(t,...e){Ia.logLevel<=de.ERROR&&Ia.error(`Auth (${si}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(t,...e){throw rd(t,...e)}function hn(t,...e){return rd(t,...e)}function sd(t,e,n){const s=Object.assign(Object.assign({},fb()),{[e]:n});return new yo("auth","Firebase",s).create(e,{appName:t.name})}function Wn(t){return sd(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function mb(t,e,n){const s=n;if(!(e instanceof s))throw s.name!==e.constructor.name&&Jt(t,"argument-error"),sd(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function rd(t,...e){if(typeof t!="string"){const n=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=t.name),t._errorFactory.create(n,...s)}return Sp.create(t,...e)}function X(t,e,...n){if(!t)throw rd(e,...n)}function Un(t){const e="INTERNAL ASSERTION FAILED: "+t;throw ia(e),new Error(e)}function Qn(t,e){t||Un(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hc(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function gb(){return Mh()==="http:"||Mh()==="https:"}function Mh(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yb(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(gb()||W0()||"connection"in navigator)?navigator.onLine:!0}function vb(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(e,n){this.shortDelay=e,this.longDelay=n,Qn(n>e,"Short delay should be less than long delay!"),this.isMobile=$0()||Y0()}get(){return yb()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function id(t,e){Qn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xp{static initialize(e,n,s){this.fetchImpl=e,n&&(this.headersImpl=n),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Un("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Un("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Un("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bb={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wb=new bo(3e4,6e4);function rs(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Sn(t,e,n,s,r={}){return Ap(t,r,async()=>{let i={},o={};s&&(e==="GET"?o=s:i={body:JSON.stringify(s)});const a=vo(Object.assign({key:t.config.apiKey},o)).slice(1),c=await t._getAdditionalHeaders();c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode);const d=Object.assign({method:e,headers:c},i);return H0()||(d.referrerPolicy="no-referrer"),xp.fetch()(kp(t,t.config.apiHost,n,a),d)})}async function Ap(t,e,n){t._canInitEmulator=!1;const s=Object.assign(Object.assign({},bb),e);try{const r=new _b(t),i=await Promise.race([n(),r.promise]);r.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw Xo(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const a=i.ok?o.errorMessage:o.error.message,[c,d]=a.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Xo(t,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw Xo(t,"email-already-in-use",o);if(c==="USER_DISABLED")throw Xo(t,"user-disabled",o);const h=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw sd(t,h,d);Jt(t,h)}}catch(r){if(r instanceof ss)throw r;Jt(t,"network-request-failed",{message:String(r)})}}async function wo(t,e,n,s,r={}){const i=await Sn(t,e,n,s,r);return"mfaPendingCredential"in i&&Jt(t,"multi-factor-auth-required",{_serverResponse:i}),i}function kp(t,e,n,s){const r=`${e}${n}?${s}`;return t.config.emulator?id(t.config,r):`${t.config.apiScheme}://${r}`}function Eb(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class _b{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,s)=>{this.timer=setTimeout(()=>s(hn(this.auth,"network-request-failed")),wb.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Xo(t,e,n){const s={appName:t.name};n.email&&(s.email=n.email),n.phoneNumber&&(s.phoneNumber=n.phoneNumber);const r=hn(t,e,s);return r.customData._tokenResponse=n,r}function Dh(t){return t!==void 0&&t.enterprise!==void 0}class Tb{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Eb(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function Ib(t,e){return Sn(t,"GET","/v2/recaptchaConfig",rs(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sb(t,e){return Sn(t,"POST","/v1/accounts:delete",e)}async function Cp(t,e){return Sn(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fi(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function xb(t,e=!1){const n=Re(t),s=await n.getIdToken(e),r=od(s);X(r&&r.exp&&r.auth_time&&r.iat,n.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:r,token:s,authTime:Fi(jl(r.auth_time)),issuedAtTime:Fi(jl(r.iat)),expirationTime:Fi(jl(r.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function jl(t){return Number(t)*1e3}function od(t){const[e,n,s]=t.split(".");if(e===void 0||n===void 0||s===void 0)return ia("JWT malformed, contained fewer than 3 sections"),null;try{const r=pp(n);return r?JSON.parse(r):(ia("Failed to decode base64 JWT payload"),null)}catch(r){return ia("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Bh(t){const e=od(t);return X(e,"internal-error"),X(typeof e.exp<"u","internal-error"),X(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hr(t,e,n=!1){if(n)return e;try{return await e}catch(s){throw s instanceof ss&&Ab(s)&&t.auth.currentUser===t&&await t.auth.signOut(),s}}function Ab({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kb{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const r=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fc{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Fi(this.lastLoginAt),this.creationTime=Fi(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Sa(t){var e;const n=t.auth,s=await t.getIdToken(),r=await Hr(t,Cp(n,{idToken:s}));X(r==null?void 0:r.users.length,n,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Pp(i.providerUserInfo):[],a=Pb(t.providerData,o),c=t.isAnonymous,d=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),h=c?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new fc(i.createdAt,i.lastLoginAt),isAnonymous:h};Object.assign(t,m)}async function Cb(t){const e=Re(t);await Sa(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Pb(t,e){return[...t.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function Pp(t){return t.map(e=>{var{providerId:n}=e,s=nd(e,["providerId"]);return{providerId:n,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rb(t,e){const n=await Ap(t,{},async()=>{const s=vo({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=t.config,o=kp(t,r,"/v1/token",`key=${i}`),a=await t._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",xp.fetch()(o,{method:"POST",headers:a,body:s})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Mb(t,e){return Sn(t,"POST","/v2/accounts:revokeToken",rs(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){X(e.idToken,"internal-error"),X(typeof e.idToken<"u","internal-error"),X(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Bh(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){X(e.length!==0,"internal-error");const n=Bh(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(X(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:s,refreshToken:r,expiresIn:i}=await Rb(e,n);this.updateTokensAndExpiration(s,r,Number(i))}updateTokensAndExpiration(e,n,s){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,n){const{refreshToken:s,accessToken:r,expirationTime:i}=n,o=new Lr;return s&&(X(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),r&&(X(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),i&&(X(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Lr,this.toJSON())}_performRefresh(){return Un("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gs(t,e){X(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class $n{constructor(e){var{uid:n,auth:s,stsTokenManager:r}=e,i=nd(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new kb(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=s,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new fc(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Hr(this,this.stsTokenManager.getToken(this.auth,e));return X(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return xb(this,e)}reload(){return Cb(this)}_assign(e){this!==e&&(X(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new $n(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){X(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),n&&await Sa(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(un(this.auth.app))return Promise.reject(Wn(this.auth));const e=await this.getIdToken();return await Hr(this,Sb(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var s,r,i,o,a,c,d,h;const m=(s=n.displayName)!==null&&s!==void 0?s:void 0,f=(r=n.email)!==null&&r!==void 0?r:void 0,y=(i=n.phoneNumber)!==null&&i!==void 0?i:void 0,T=(o=n.photoURL)!==null&&o!==void 0?o:void 0,E=(a=n.tenantId)!==null&&a!==void 0?a:void 0,x=(c=n._redirectEventId)!==null&&c!==void 0?c:void 0,C=(d=n.createdAt)!==null&&d!==void 0?d:void 0,P=(h=n.lastLoginAt)!==null&&h!==void 0?h:void 0,{uid:D,emailVerified:R,isAnonymous:B,providerData:N,stsTokenManager:w}=n;X(D&&w,e,"internal-error");const v=Lr.fromJSON(this.name,w);X(typeof D=="string",e,"internal-error"),gs(m,e.name),gs(f,e.name),X(typeof R=="boolean",e,"internal-error"),X(typeof B=="boolean",e,"internal-error"),gs(y,e.name),gs(T,e.name),gs(E,e.name),gs(x,e.name),gs(C,e.name),gs(P,e.name);const I=new $n({uid:D,auth:e,email:f,emailVerified:R,displayName:m,isAnonymous:B,photoURL:T,phoneNumber:y,tenantId:E,stsTokenManager:v,createdAt:C,lastLoginAt:P});return N&&Array.isArray(N)&&(I.providerData=N.map(_=>Object.assign({},_))),x&&(I._redirectEventId=x),I}static async _fromIdTokenResponse(e,n,s=!1){const r=new Lr;r.updateFromServerResponse(n);const i=new $n({uid:n.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await Sa(i),i}static async _fromGetAccountInfoResponse(e,n,s){const r=n.users[0];X(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?Pp(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(i!=null&&i.length),a=new Lr;a.updateFromIdToken(s);const c=new $n({uid:r.localId,auth:e,stsTokenManager:a,isAnonymous:o}),d={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new fc(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lh=new Map;function qn(t){Qn(t instanceof Function,"Expected a class definition");let e=Lh.get(t);return e?(Qn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Lh.set(t,e),e)}/**
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
 */class Rp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Rp.type="NONE";const Nh=Rp;/**
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
 */function oa(t,e,n){return`firebase:${t}:${e}:${n}`}class Nr{constructor(e,n,s){this.persistence=e,this.auth=n,this.userKey=s;const{config:r,name:i}=this.auth;this.fullUserKey=oa(this.userKey,r.apiKey,i),this.fullPersistenceKey=oa("persistence",r.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?$n._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,s="authUser"){if(!n.length)return new Nr(qn(Nh),e,s);const r=(await Promise.all(n.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=r[0]||qn(Nh);const o=oa(s,e.config.apiKey,e.name);let a=null;for(const d of n)try{const h=await d._get(o);if(h){const m=$n._fromJSON(e,h);d!==i&&(a=m),i=d;break}}catch{}const c=r.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new Nr(i,e,s):(i=c[0],a&&await i._set(o,a.toJSON()),await Promise.all(n.map(async d=>{if(d!==i)try{await d._remove(o)}catch{}})),new Nr(i,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oh(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Lp(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Mp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Op(e))return"Blackberry";if(Fp(e))return"Webos";if(Dp(e))return"Safari";if((e.includes("chrome/")||Bp(e))&&!e.includes("edge/"))return"Chrome";if(Np(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=t.match(n);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function Mp(t=wt()){return/firefox\//i.test(t)}function Dp(t=wt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Bp(t=wt()){return/crios\//i.test(t)}function Lp(t=wt()){return/iemobile/i.test(t)}function Np(t=wt()){return/android/i.test(t)}function Op(t=wt()){return/blackberry/i.test(t)}function Fp(t=wt()){return/webos/i.test(t)}function ad(t=wt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Db(t=wt()){var e;return ad(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Bb(){return G0()&&document.documentMode===10}function Vp(t=wt()){return ad(t)||Np(t)||Fp(t)||Op(t)||/windows phone/i.test(t)||Lp(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zp(t,e=[]){let n;switch(t){case"Browser":n=Oh(wt());break;case"Worker":n=`${Oh(wt())}-${t}`;break;default:n=t}const s=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${si}/${s}`}/**
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
 */class Lb{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const s=i=>new Promise((o,a)=>{try{const c=e(i);o(c)}catch(c){a(c)}});s.onAbort=n,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const s of this.queue)await s(e),s.onAbort&&n.push(s.onAbort)}catch(s){n.reverse();for(const r of n)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function Nb(t,e={}){return Sn(t,"GET","/v2/passwordPolicy",rs(t,e))}/**
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
 */const Ob=6;class Fb{constructor(e){var n,s,r,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:Ob,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,s,r,i,o,a;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(n=c.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(s=c.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(r=c.containsLowercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(a=c.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),c}validatePasswordLengthOptions(e,n){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(n.meetsMinPasswordLength=e.length>=s),r&&(n.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(n,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,n,s,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vb{constructor(e,n,s,r){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Fh(this),this.idTokenSubscription=new Fh(this),this.beforeStateQueue=new Lb(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Sp,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=qn(n)),this._initializationPromise=this.queue(async()=>{var s,r;if(!this._deleted&&(this.persistenceManager=await Nr.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Cp(this,{idToken:e}),s=await $n._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(s)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(un(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let r=s,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,a=r==null?void 0:r._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===a)&&(c!=null&&c.user)&&(r=c.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return X(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Sa(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=vb()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(un(this.app))return Promise.reject(Wn(this));const n=e?Re(e):null;return n&&X(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&X(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return un(this.app)?Promise.reject(Wn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return un(this.app)?Promise.reject(Wn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(qn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Nb(this),n=new Fb(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new yo("auth","Firebase",e())}onAuthStateChanged(e,n,s){return this.registerStateListener(this.authStateSubscription,e,n,s)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,s){return this.registerStateListener(this.idTokenSubscription,e,n,s)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(s.tenantId=this.tenantId),await Mb(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const s=await this.getOrInitRedirectPersistenceManager(n);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&qn(e)||this._popupRedirectResolver;X(n,this,"argument-error"),this.redirectPersistenceManager=await Nr.create(this,[qn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,s;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,s,r){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(X(a,this,"internal-error"),a.then(()=>{o||i(this.currentUser)}),typeof n=="function"){const c=e.addObserver(n,s,r);return()=>{o=!0,c()}}else{const c=e.addObserver(n);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return X(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=zp(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(n["X-Firebase-Client"]=s);const r=await this._getAppCheckToken();return r&&(n["X-Firebase-AppCheck"]=r),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&pb(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function is(t){return Re(t)}class Fh{constructor(e){this.auth=e,this.observer=null,this.addObserver=tv(n=>this.observer=n)}get next(){return X(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function zb(t){Wa=t}function Up(t){return Wa.loadJS(t)}function Ub(){return Wa.recaptchaEnterpriseScript}function $b(){return Wa.gapiScript}function qb(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const Hb="recaptcha-enterprise",Wb="NO_RECAPTCHA";class Yb{constructor(e){this.type=Hb,this.auth=is(e)}async verify(e="verify",n=!1){async function s(i){if(!n){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,a)=>{Ib(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const d=new Tb(c);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,o(d.siteKey)}}).catch(c=>{a(c)})})}function r(i,o,a){const c=window.grecaptcha;Dh(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:e}).then(d=>{o(d)}).catch(()=>{o(Wb)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,o)=>{s(this.auth).then(a=>{if(!n&&Dh(window.grecaptcha))r(a,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=Ub();c.length!==0&&(c+=a),Up(c).then(()=>{r(a,i,o)}).catch(d=>{o(d)})}}).catch(a=>{o(a)})})}}async function Vh(t,e,n,s=!1){const r=new Yb(t);let i;try{i=await r.verify(n)}catch{i=await r.verify(n,!0)}const o=Object.assign({},e);return s?Object.assign(o,{captchaResp:i}):Object.assign(o,{captchaResponse:i}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function xa(t,e,n,s){var r;if(!((r=t._getRecaptchaConfig())===null||r===void 0)&&r.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await Vh(t,e,n,n==="getOobCode");return s(t,i)}else return s(t,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Vh(t,e,n,n==="getOobCode");return s(t,o)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gb(t,e){const n=td(t,"auth");if(n.isInitialized()){const r=n.getImmediate(),i=n.getOptions();if(_a(i,e??{}))return r;Jt(r,"already-initialized")}return n.initialize({options:e})}function jb(t,e){const n=(e==null?void 0:e.persistence)||[],s=(Array.isArray(n)?n:[n]).map(qn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function Kb(t,e,n){const s=is(t);X(s._canInitEmulator,s,"emulator-config-failed"),X(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,i=$p(e),{host:o,port:a}=Qb(e),c=a===null?"":`:${a}`;s.config.emulator={url:`${i}//${o}${c}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:o,port:a,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})}),Jb()}function $p(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Qb(t){const e=$p(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const s=n[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const i=r[1];return{host:i,port:zh(s.substr(i.length+1))}}else{const[i,o]=s.split(":");return{host:i,port:zh(o)}}}function zh(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Jb(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ld{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Un("not implemented")}_getIdTokenResponse(e){return Un("not implemented")}_linkToIdToken(e,n){return Un("not implemented")}_getReauthenticationResolver(e){return Un("not implemented")}}async function Xb(t,e){return Sn(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zb(t,e){return wo(t,"POST","/v1/accounts:signInWithPassword",rs(t,e))}async function qp(t,e){return Sn(t,"POST","/v1/accounts:sendOobCode",rs(t,e))}async function ew(t,e){return qp(t,e)}async function tw(t,e){return qp(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nw(t,e){return wo(t,"POST","/v1/accounts:signInWithEmailLink",rs(t,e))}async function sw(t,e){return wo(t,"POST","/v1/accounts:signInWithEmailLink",rs(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki extends ld{constructor(e,n,s,r=null){super("password",s),this._email=e,this._password=n,this._tenantId=r}static _fromEmailAndPassword(e,n){return new Ki(e,n,"password")}static _fromEmailAndCode(e,n,s=null){return new Ki(e,n,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return xa(e,n,"signInWithPassword",Zb);case"emailLink":return nw(e,{email:this._email,oobCode:this._password});default:Jt(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const s={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return xa(e,s,"signUpPassword",Xb);case"emailLink":return sw(e,{idToken:n,email:this._email,oobCode:this._password});default:Jt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Or(t,e){return wo(t,"POST","/v1/accounts:signInWithIdp",rs(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rw="http://localhost";class or extends ld{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new or(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Jt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r}=n,i=nd(n,["providerId","signInMethod"]);if(!s||!r)return null;const o=new or(s,r);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Or(e,n)}_linkToIdToken(e,n){const s=this.buildRequest();return s.idToken=n,Or(e,s)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Or(e,n)}buildRequest(){const e={requestUri:rw,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=vo(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iw(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function ow(t){const e=Ci(Pi(t)).link,n=e?Ci(Pi(e)).deep_link_id:null,s=Ci(Pi(t)).deep_link_id;return(s?Ci(Pi(s)).link:null)||s||n||e||t}class cd{constructor(e){var n,s,r,i,o,a;const c=Ci(Pi(e)),d=(n=c.apiKey)!==null&&n!==void 0?n:null,h=(s=c.oobCode)!==null&&s!==void 0?s:null,m=iw((r=c.mode)!==null&&r!==void 0?r:null);X(d&&h&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=h,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(o=c.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(a=c.tenantId)!==null&&a!==void 0?a:null}static parseLink(e){const n=ow(e);try{return new cd(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ri{constructor(){this.providerId=ri.PROVIDER_ID}static credential(e,n){return Ki._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const s=cd.parseLink(n);return X(s,"argument-error"),Ki._fromEmailAndCode(e,s.code,s.tenantId)}}ri.PROVIDER_ID="password";ri.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ri.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dd{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Eo extends dd{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vs extends Eo{constructor(){super("facebook.com")}static credential(e){return or._fromParams({providerId:vs.PROVIDER_ID,signInMethod:vs.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return vs.credentialFromTaggedObject(e)}static credentialFromError(e){return vs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return vs.credential(e.oauthAccessToken)}catch{return null}}}vs.FACEBOOK_SIGN_IN_METHOD="facebook.com";vs.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn extends Eo{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return or._fromParams({providerId:zn.PROVIDER_ID,signInMethod:zn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return zn.credentialFromTaggedObject(e)}static credentialFromError(e){return zn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:s}=e;if(!n&&!s)return null;try{return zn.credential(n,s)}catch{return null}}}zn.GOOGLE_SIGN_IN_METHOD="google.com";zn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bs extends Eo{constructor(){super("github.com")}static credential(e){return or._fromParams({providerId:bs.PROVIDER_ID,signInMethod:bs.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return bs.credentialFromTaggedObject(e)}static credentialFromError(e){return bs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return bs.credential(e.oauthAccessToken)}catch{return null}}}bs.GITHUB_SIGN_IN_METHOD="github.com";bs.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ws extends Eo{constructor(){super("twitter.com")}static credential(e,n){return or._fromParams({providerId:ws.PROVIDER_ID,signInMethod:ws.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ws.credentialFromTaggedObject(e)}static credentialFromError(e){return ws.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:s}=e;if(!n||!s)return null;try{return ws.credential(n,s)}catch{return null}}}ws.TWITTER_SIGN_IN_METHOD="twitter.com";ws.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function aw(t,e){return wo(t,"POST","/v1/accounts:signUp",rs(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ar{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,s,r=!1){const i=await $n._fromIdTokenResponse(e,s,r),o=Uh(s);return new ar({user:i,providerId:o,_tokenResponse:s,operationType:n})}static async _forOperation(e,n,s){await e._updateTokensIfNecessary(s,!0);const r=Uh(s);return new ar({user:e,providerId:r,_tokenResponse:s,operationType:n})}}function Uh(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Aa extends ss{constructor(e,n,s,r){var i;super(n.code,n.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,Aa.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:n.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,n,s,r){return new Aa(e,n,s,r)}}function Hp(t,e,n,s){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Aa._fromErrorAndOperation(t,i,e,s):i})}async function lw(t,e,n=!1){const s=await Hr(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return ar._forOperation(t,"link",s)}/**
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
 */async function cw(t,e,n=!1){const{auth:s}=t;if(un(s.app))return Promise.reject(Wn(s));const r="reauthenticate";try{const i=await Hr(t,Hp(s,r,e,t),n);X(i.idToken,s,"internal-error");const o=od(i.idToken);X(o,s,"internal-error");const{sub:a}=o;return X(t.uid===a,s,"user-mismatch"),ar._forOperation(t,r,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Jt(s,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wp(t,e,n=!1){if(un(t.app))return Promise.reject(Wn(t));const s="signIn",r=await Hp(t,s,e),i=await ar._fromIdTokenResponse(t,s,r);return n||await t._updateCurrentUser(i.user),i}async function dw(t,e){return Wp(is(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yp(t){const e=is(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function uw(t,e,n){const s=is(t);await xa(s,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",tw)}async function hw(t,e,n){if(un(t.app))return Promise.reject(Wn(t));const s=is(t),o=await xa(s,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",aw).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&Yp(t),c}),a=await ar._fromIdTokenResponse(s,"signIn",o);return await s._updateCurrentUser(a.user),a}function fw(t,e,n){return un(t.app)?Promise.reject(Wn(t)):dw(Re(t),ri.credential(e,n)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&Yp(t),s})}async function Gp(t,e){const n=Re(t),r={requestType:"VERIFY_EMAIL",idToken:await t.getIdToken()},{email:i}=await ew(n.auth,r);i!==t.email&&await t.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pw(t,e){return Sn(t,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mw(t,{displayName:e,photoURL:n}){if(e===void 0&&n===void 0)return;const s=Re(t),i={idToken:await s.getIdToken(),displayName:e,photoUrl:n,returnSecureToken:!0},o=await Hr(s,pw(s.auth,i));s.displayName=o.displayName||null,s.photoURL=o.photoUrl||null;const a=s.providerData.find(({providerId:c})=>c==="password");a&&(a.displayName=s.displayName,a.photoURL=s.photoURL),await s._updateTokensIfNecessary(o)}function gw(t,e,n,s){return Re(t).onIdTokenChanged(e,n,s)}function yw(t,e,n){return Re(t).beforeAuthStateChanged(e,n)}function vw(t,e,n,s){return Re(t).onAuthStateChanged(e,n,s)}function bw(t){return Re(t).signOut()}async function ww(t){return Re(t).delete()}const ka="__sak";/**
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
 */class jp{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(ka,"1"),this.storage.removeItem(ka),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ew=1e3,_w=10;class Kp extends jp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Vp(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const s=this.storage.getItem(n),r=this.localCache[n];s!==r&&e(n,r,s)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,a,c)=>{this.notifyListeners(o,c)});return}const s=e.key;n?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(s);!n&&this.localCache[s]===o||this.notifyListeners(s,o)},i=this.storage.getItem(s);Bb()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,_w):r()}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:s}),!0)})},Ew)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Kp.type="LOCAL";const Tw=Kp;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qp extends jp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Qp.type="SESSION";const Jp=Qp;/**
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
 */function Iw(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class Ya{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(r=>r.isListeningto(e));if(n)return n;const s=new Ya(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:s,eventType:r,data:i}=n.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const a=Array.from(o).map(async d=>d(n.origin,i)),c=await Iw(a);n.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ya.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ud(t="",e=10){let n="";for(let s=0;s<e;s++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class Sw{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,o;return new Promise((a,c)=>{const d=ud("",20);r.port1.start();const h=setTimeout(()=>{c(new Error("unsupported_event"))},s);o={messageChannel:r,onMessage(m){const f=m;if(f.data.eventId===d)switch(f.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),a(f.data.response);break;default:clearTimeout(h),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:d,data:n},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bn(){return window}function xw(t){bn().location.href=t}/**
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
 */function Xp(){return typeof bn().WorkerGlobalScope<"u"&&typeof bn().importScripts=="function"}async function Aw(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function kw(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function Cw(){return Xp()?self:null}/**
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
 */const Zp="firebaseLocalStorageDb",Pw=1,Ca="firebaseLocalStorage",em="fbase_key";class _o{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Ga(t,e){return t.transaction([Ca],e?"readwrite":"readonly").objectStore(Ca)}function Rw(){const t=indexedDB.deleteDatabase(Zp);return new _o(t).toPromise()}function pc(){const t=indexedDB.open(Zp,Pw);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const s=t.result;try{s.createObjectStore(Ca,{keyPath:em})}catch(r){n(r)}}),t.addEventListener("success",async()=>{const s=t.result;s.objectStoreNames.contains(Ca)?e(s):(s.close(),await Rw(),e(await pc()))})})}async function $h(t,e,n){const s=Ga(t,!0).put({[em]:e,value:n});return new _o(s).toPromise()}async function Mw(t,e){const n=Ga(t,!1).get(e),s=await new _o(n).toPromise();return s===void 0?null:s.value}function qh(t,e){const n=Ga(t,!0).delete(e);return new _o(n).toPromise()}const Dw=800,Bw=3;class tm{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await pc(),this.db)}async _withRetries(e){let n=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(n++>Bw)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Xp()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ya._getInstance(Cw()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await Aw(),!this.activeServiceWorker)return;this.sender=new Sw(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((n=s[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||kw()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await pc();return await $h(e,ka,"1"),await qh(e,ka),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(s=>$h(s,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(s=>Mw(s,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>qh(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=Ga(r,!1).getAll();return new _o(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),n.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),n.push(r));return n}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Dw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}tm.type="LOCAL";const Lw=tm;new bo(3e4,6e4);/**
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
 */function nm(t,e){return e?qn(e):(X(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class hd extends ld{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Or(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Or(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Or(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Nw(t){return Wp(t.auth,new hd(t),t.bypassAuthState)}function Ow(t){const{auth:e,user:n}=t;return X(n,e,"internal-error"),cw(n,new hd(t),t.bypassAuthState)}async function Fw(t){const{auth:e,user:n}=t;return X(n,e,"internal-error"),lw(n,new hd(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sm{constructor(e,n,s,r,i=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:s,postBody:r,tenantId:i,error:o,type:a}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:n,sessionId:s,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Nw;case"linkViaPopup":case"linkViaRedirect":return Fw;case"reauthViaPopup":case"reauthViaRedirect":return Ow;default:Jt(this.auth,"internal-error")}}resolve(e){Qn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Qn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vw=new bo(2e3,1e4);async function zw(t,e,n){if(un(t.app))return Promise.reject(hn(t,"operation-not-supported-in-this-environment"));const s=is(t);mb(t,e,dd);const r=nm(s,n);return new Xs(s,"signInViaPopup",e,r).executeNotNull()}class Xs extends sm{constructor(e,n,s,r,i){super(e,n,r,i),this.provider=s,this.authWindow=null,this.pollId=null,Xs.currentPopupAction&&Xs.currentPopupAction.cancel(),Xs.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return X(e,this.auth,"internal-error"),e}async onExecution(){Qn(this.filter.length===1,"Popup operations only handle one event");const e=ud();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(hn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(hn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Xs.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,s;if(!((s=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(hn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Vw.get())};e()}}Xs.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uw="pendingRedirect",aa=new Map;class $w extends sm{constructor(e,n,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,s),this.eventId=null}async execute(){let e=aa.get(this.auth._key());if(!e){try{const s=await qw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(n){e=()=>Promise.reject(n)}aa.set(this.auth._key(),e)}return this.bypassAuthState||aa.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function qw(t,e){const n=Yw(e),s=Ww(t);if(!await s._isAvailable())return!1;const r=await s._get(n)==="true";return await s._remove(n),r}function Hw(t,e){aa.set(t._key(),e)}function Ww(t){return qn(t._redirectPersistence)}function Yw(t){return oa(Uw,t.config.apiKey,t.name)}async function Gw(t,e,n=!1){if(un(t.app))return Promise.reject(Wn(t));const s=is(t),r=nm(s,e),o=await new $w(s,r,n).execute();return o&&!n&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jw=10*60*1e3;class Kw{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(n=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Qw(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var s;if(e.error&&!rm(e)){const r=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";n.onError(hn(this.auth,r))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const s=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=jw&&this.cachedEventUids.clear(),this.cachedEventUids.has(Hh(e))}saveEventToCache(e){this.cachedEventUids.add(Hh(e)),this.lastProcessedEventTime=Date.now()}}function Hh(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function rm({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Qw(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return rm(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jw(t,e={}){return Sn(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Zw=/^https?/;async function eE(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Jw(t);for(const n of e)try{if(tE(n))return}catch{}Jt(t,"unauthorized-domain")}function tE(t){const e=hc(),{protocol:n,hostname:s}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&s===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===s}if(!Zw.test(n))return!1;if(Xw.test(t))return s===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
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
 */const nE=new bo(3e4,6e4);function Wh(){const t=bn().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function sE(t){return new Promise((e,n)=>{var s,r,i;function o(){Wh(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Wh(),n(hn(t,"network-request-failed"))},timeout:nE.get()})}if(!((r=(s=bn().gapi)===null||s===void 0?void 0:s.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((i=bn().gapi)===null||i===void 0)&&i.load)o();else{const a=qb("iframefcb");return bn()[a]=()=>{gapi.load?o():n(hn(t,"network-request-failed"))},Up(`${$b()}?onload=${a}`).catch(c=>n(c))}}).catch(e=>{throw la=null,e})}let la=null;function rE(t){return la=la||sE(t),la}/**
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
 */const iE=new bo(5e3,15e3),oE="__/auth/iframe",aE="emulator/auth/iframe",lE={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},cE=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function dE(t){const e=t.config;X(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?id(e,aE):`https://${t.config.authDomain}/${oE}`,s={apiKey:e.apiKey,appName:t.name,v:si},r=cE.get(t.config.apiHost);r&&(s.eid=r);const i=t._getFrameworks();return i.length&&(s.fw=i.join(",")),`${n}?${vo(s).slice(1)}`}async function uE(t){const e=await rE(t),n=bn().gapi;return X(n,t,"internal-error"),e.open({where:document.body,url:dE(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:lE,dontclear:!0},s=>new Promise(async(r,i)=>{await s.restyle({setHideOnLeave:!1});const o=hn(t,"network-request-failed"),a=bn().setTimeout(()=>{i(o)},iE.get());function c(){bn().clearTimeout(a),r(s)}s.ping(c).then(c,()=>{i(o)})}))}/**
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
 */const hE={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},fE=500,pE=600,mE="_blank",gE="http://localhost";class Yh{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function yE(t,e,n,s=fE,r=pE){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let a="";const c=Object.assign(Object.assign({},hE),{width:s.toString(),height:r.toString(),top:i,left:o}),d=wt().toLowerCase();n&&(a=Bp(d)?mE:n),Mp(d)&&(e=e||gE,c.scrollbars="yes");const h=Object.entries(c).reduce((f,[y,T])=>`${f}${y}=${T},`,"");if(Db(d)&&a!=="_self")return vE(e||"",a),new Yh(null);const m=window.open(e||"",a,h);X(m,t,"popup-blocked");try{m.focus()}catch{}return new Yh(m)}function vE(t,e){const n=document.createElement("a");n.href=t,n.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(s)}/**
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
 */const bE="__/auth/handler",wE="emulator/auth/handler",EE=encodeURIComponent("fac");async function Gh(t,e,n,s,r,i){X(t.config.authDomain,t,"auth-domain-config-required"),X(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:s,v:si,eventId:r};if(e instanceof dd){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",ev(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,m]of Object.entries({}))o[h]=m}if(e instanceof Eo){const h=e.getScopes().filter(m=>m!=="");h.length>0&&(o.scopes=h.join(","))}t.tenantId&&(o.tid=t.tenantId);const a=o;for(const h of Object.keys(a))a[h]===void 0&&delete a[h];const c=await t._getAppCheckToken(),d=c?`#${EE}=${encodeURIComponent(c)}`:"";return`${_E(t)}?${vo(a).slice(1)}${d}`}function _E({config:t}){return t.emulator?id(t,wE):`https://${t.authDomain}/${bE}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kl="webStorageSupport";class TE{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Jp,this._completeRedirectFn=Gw,this._overrideRedirectResult=Hw}async _openPopup(e,n,s,r){var i;Qn((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await Gh(e,n,s,hc(),r);return yE(e,o,ud())}async _openRedirect(e,n,s,r){await this._originValidation(e);const i=await Gh(e,n,s,hc(),r);return xw(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:r,promise:i}=this.eventManagers[n];return r?Promise.resolve(r):(Qn(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[n]={promise:s},s.catch(()=>{delete this.eventManagers[n]}),s}async initAndGetManager(e){const n=await uE(e),s=new Kw(e);return n.register("authEvent",r=>(X(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=n,s}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Kl,{type:Kl},r=>{var i;const o=(i=r==null?void 0:r[0])===null||i===void 0?void 0:i[Kl];o!==void 0&&n(!!o),Jt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=eE(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Vp()||Dp()||ad()}}const IE=TE;var jh="@firebase/auth",Kh="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SE{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){X(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xE(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function AE(t){qr(new ir("auth",(e,{options:n})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=s.options;X(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:o,authDomain:a,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:zp(t)},d=new Vb(s,r,i,c);return jb(d,n),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,s)=>{e.getProvider("auth-internal").initialize()})),qr(new ir("auth-internal",e=>{const n=is(e.getProvider("auth").getImmediate());return(s=>new SE(s))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),As(jh,Kh,xE(t)),As(jh,Kh,"esm2017")}/**
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
 */const kE=5*60,CE=yp("authIdTokenMaxAge")||kE;let Qh=null;const PE=t=>async e=>{const n=e&&await e.getIdTokenResult(),s=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(s&&s>CE)return;const r=n==null?void 0:n.token;Qh!==r&&(Qh=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function RE(t=Ep()){const e=td(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Gb(t,{popupRedirectResolver:IE,persistence:[Lw,Tw,Jp]}),s=yp("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const o=PE(i.toString());yw(n,o,()=>o(n.currentUser)),gw(n,a=>o(a))}}const r=mp("auth");return r&&Kb(n,`http://${r}`),n}function ME(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}zb({loadJS(t){return new Promise((e,n)=>{const s=document.createElement("script");s.setAttribute("src",t),s.onload=e,s.onerror=r=>{const i=hn("internal-error");i.customData=r,n(i)},s.type="text/javascript",s.charset="UTF-8",ME().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});AE("Browser");var Jh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var nr,im;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(w,v){function I(){}I.prototype=v.prototype,w.D=v.prototype,w.prototype=new I,w.prototype.constructor=w,w.C=function(_,S,A){for(var b=Array(arguments.length-2),Y=2;Y<arguments.length;Y++)b[Y-2]=arguments[Y];return v.prototype[S].apply(_,b)}}function n(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,n),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(w,v,I){I||(I=0);var _=Array(16);if(typeof v=="string")for(var S=0;16>S;++S)_[S]=v.charCodeAt(I++)|v.charCodeAt(I++)<<8|v.charCodeAt(I++)<<16|v.charCodeAt(I++)<<24;else for(S=0;16>S;++S)_[S]=v[I++]|v[I++]<<8|v[I++]<<16|v[I++]<<24;v=w.g[0],I=w.g[1],S=w.g[2];var A=w.g[3],b=v+(A^I&(S^A))+_[0]+3614090360&4294967295;v=I+(b<<7&4294967295|b>>>25),b=A+(S^v&(I^S))+_[1]+3905402710&4294967295,A=v+(b<<12&4294967295|b>>>20),b=S+(I^A&(v^I))+_[2]+606105819&4294967295,S=A+(b<<17&4294967295|b>>>15),b=I+(v^S&(A^v))+_[3]+3250441966&4294967295,I=S+(b<<22&4294967295|b>>>10),b=v+(A^I&(S^A))+_[4]+4118548399&4294967295,v=I+(b<<7&4294967295|b>>>25),b=A+(S^v&(I^S))+_[5]+1200080426&4294967295,A=v+(b<<12&4294967295|b>>>20),b=S+(I^A&(v^I))+_[6]+2821735955&4294967295,S=A+(b<<17&4294967295|b>>>15),b=I+(v^S&(A^v))+_[7]+4249261313&4294967295,I=S+(b<<22&4294967295|b>>>10),b=v+(A^I&(S^A))+_[8]+1770035416&4294967295,v=I+(b<<7&4294967295|b>>>25),b=A+(S^v&(I^S))+_[9]+2336552879&4294967295,A=v+(b<<12&4294967295|b>>>20),b=S+(I^A&(v^I))+_[10]+4294925233&4294967295,S=A+(b<<17&4294967295|b>>>15),b=I+(v^S&(A^v))+_[11]+2304563134&4294967295,I=S+(b<<22&4294967295|b>>>10),b=v+(A^I&(S^A))+_[12]+1804603682&4294967295,v=I+(b<<7&4294967295|b>>>25),b=A+(S^v&(I^S))+_[13]+4254626195&4294967295,A=v+(b<<12&4294967295|b>>>20),b=S+(I^A&(v^I))+_[14]+2792965006&4294967295,S=A+(b<<17&4294967295|b>>>15),b=I+(v^S&(A^v))+_[15]+1236535329&4294967295,I=S+(b<<22&4294967295|b>>>10),b=v+(S^A&(I^S))+_[1]+4129170786&4294967295,v=I+(b<<5&4294967295|b>>>27),b=A+(I^S&(v^I))+_[6]+3225465664&4294967295,A=v+(b<<9&4294967295|b>>>23),b=S+(v^I&(A^v))+_[11]+643717713&4294967295,S=A+(b<<14&4294967295|b>>>18),b=I+(A^v&(S^A))+_[0]+3921069994&4294967295,I=S+(b<<20&4294967295|b>>>12),b=v+(S^A&(I^S))+_[5]+3593408605&4294967295,v=I+(b<<5&4294967295|b>>>27),b=A+(I^S&(v^I))+_[10]+38016083&4294967295,A=v+(b<<9&4294967295|b>>>23),b=S+(v^I&(A^v))+_[15]+3634488961&4294967295,S=A+(b<<14&4294967295|b>>>18),b=I+(A^v&(S^A))+_[4]+3889429448&4294967295,I=S+(b<<20&4294967295|b>>>12),b=v+(S^A&(I^S))+_[9]+568446438&4294967295,v=I+(b<<5&4294967295|b>>>27),b=A+(I^S&(v^I))+_[14]+3275163606&4294967295,A=v+(b<<9&4294967295|b>>>23),b=S+(v^I&(A^v))+_[3]+4107603335&4294967295,S=A+(b<<14&4294967295|b>>>18),b=I+(A^v&(S^A))+_[8]+1163531501&4294967295,I=S+(b<<20&4294967295|b>>>12),b=v+(S^A&(I^S))+_[13]+2850285829&4294967295,v=I+(b<<5&4294967295|b>>>27),b=A+(I^S&(v^I))+_[2]+4243563512&4294967295,A=v+(b<<9&4294967295|b>>>23),b=S+(v^I&(A^v))+_[7]+1735328473&4294967295,S=A+(b<<14&4294967295|b>>>18),b=I+(A^v&(S^A))+_[12]+2368359562&4294967295,I=S+(b<<20&4294967295|b>>>12),b=v+(I^S^A)+_[5]+4294588738&4294967295,v=I+(b<<4&4294967295|b>>>28),b=A+(v^I^S)+_[8]+2272392833&4294967295,A=v+(b<<11&4294967295|b>>>21),b=S+(A^v^I)+_[11]+1839030562&4294967295,S=A+(b<<16&4294967295|b>>>16),b=I+(S^A^v)+_[14]+4259657740&4294967295,I=S+(b<<23&4294967295|b>>>9),b=v+(I^S^A)+_[1]+2763975236&4294967295,v=I+(b<<4&4294967295|b>>>28),b=A+(v^I^S)+_[4]+1272893353&4294967295,A=v+(b<<11&4294967295|b>>>21),b=S+(A^v^I)+_[7]+4139469664&4294967295,S=A+(b<<16&4294967295|b>>>16),b=I+(S^A^v)+_[10]+3200236656&4294967295,I=S+(b<<23&4294967295|b>>>9),b=v+(I^S^A)+_[13]+681279174&4294967295,v=I+(b<<4&4294967295|b>>>28),b=A+(v^I^S)+_[0]+3936430074&4294967295,A=v+(b<<11&4294967295|b>>>21),b=S+(A^v^I)+_[3]+3572445317&4294967295,S=A+(b<<16&4294967295|b>>>16),b=I+(S^A^v)+_[6]+76029189&4294967295,I=S+(b<<23&4294967295|b>>>9),b=v+(I^S^A)+_[9]+3654602809&4294967295,v=I+(b<<4&4294967295|b>>>28),b=A+(v^I^S)+_[12]+3873151461&4294967295,A=v+(b<<11&4294967295|b>>>21),b=S+(A^v^I)+_[15]+530742520&4294967295,S=A+(b<<16&4294967295|b>>>16),b=I+(S^A^v)+_[2]+3299628645&4294967295,I=S+(b<<23&4294967295|b>>>9),b=v+(S^(I|~A))+_[0]+4096336452&4294967295,v=I+(b<<6&4294967295|b>>>26),b=A+(I^(v|~S))+_[7]+1126891415&4294967295,A=v+(b<<10&4294967295|b>>>22),b=S+(v^(A|~I))+_[14]+2878612391&4294967295,S=A+(b<<15&4294967295|b>>>17),b=I+(A^(S|~v))+_[5]+4237533241&4294967295,I=S+(b<<21&4294967295|b>>>11),b=v+(S^(I|~A))+_[12]+1700485571&4294967295,v=I+(b<<6&4294967295|b>>>26),b=A+(I^(v|~S))+_[3]+2399980690&4294967295,A=v+(b<<10&4294967295|b>>>22),b=S+(v^(A|~I))+_[10]+4293915773&4294967295,S=A+(b<<15&4294967295|b>>>17),b=I+(A^(S|~v))+_[1]+2240044497&4294967295,I=S+(b<<21&4294967295|b>>>11),b=v+(S^(I|~A))+_[8]+1873313359&4294967295,v=I+(b<<6&4294967295|b>>>26),b=A+(I^(v|~S))+_[15]+4264355552&4294967295,A=v+(b<<10&4294967295|b>>>22),b=S+(v^(A|~I))+_[6]+2734768916&4294967295,S=A+(b<<15&4294967295|b>>>17),b=I+(A^(S|~v))+_[13]+1309151649&4294967295,I=S+(b<<21&4294967295|b>>>11),b=v+(S^(I|~A))+_[4]+4149444226&4294967295,v=I+(b<<6&4294967295|b>>>26),b=A+(I^(v|~S))+_[11]+3174756917&4294967295,A=v+(b<<10&4294967295|b>>>22),b=S+(v^(A|~I))+_[2]+718787259&4294967295,S=A+(b<<15&4294967295|b>>>17),b=I+(A^(S|~v))+_[9]+3951481745&4294967295,w.g[0]=w.g[0]+v&4294967295,w.g[1]=w.g[1]+(S+(b<<21&4294967295|b>>>11))&4294967295,w.g[2]=w.g[2]+S&4294967295,w.g[3]=w.g[3]+A&4294967295}s.prototype.u=function(w,v){v===void 0&&(v=w.length);for(var I=v-this.blockSize,_=this.B,S=this.h,A=0;A<v;){if(S==0)for(;A<=I;)r(this,w,A),A+=this.blockSize;if(typeof w=="string"){for(;A<v;)if(_[S++]=w.charCodeAt(A++),S==this.blockSize){r(this,_),S=0;break}}else for(;A<v;)if(_[S++]=w[A++],S==this.blockSize){r(this,_),S=0;break}}this.h=S,this.o+=v},s.prototype.v=function(){var w=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);w[0]=128;for(var v=1;v<w.length-8;++v)w[v]=0;var I=8*this.o;for(v=w.length-8;v<w.length;++v)w[v]=I&255,I/=256;for(this.u(w),w=Array(16),v=I=0;4>v;++v)for(var _=0;32>_;_+=8)w[I++]=this.g[v]>>>_&255;return w};function i(w,v){var I=a;return Object.prototype.hasOwnProperty.call(I,w)?I[w]:I[w]=v(w)}function o(w,v){this.h=v;for(var I=[],_=!0,S=w.length-1;0<=S;S--){var A=w[S]|0;_&&A==v||(I[S]=A,_=!1)}this.g=I}var a={};function c(w){return-128<=w&&128>w?i(w,function(v){return new o([v|0],0>v?-1:0)}):new o([w|0],0>w?-1:0)}function d(w){if(isNaN(w)||!isFinite(w))return m;if(0>w)return x(d(-w));for(var v=[],I=1,_=0;w>=I;_++)v[_]=w/I|0,I*=4294967296;return new o(v,0)}function h(w,v){if(w.length==0)throw Error("number format error: empty string");if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(w.charAt(0)=="-")return x(h(w.substring(1),v));if(0<=w.indexOf("-"))throw Error('number format error: interior "-" character');for(var I=d(Math.pow(v,8)),_=m,S=0;S<w.length;S+=8){var A=Math.min(8,w.length-S),b=parseInt(w.substring(S,S+A),v);8>A?(A=d(Math.pow(v,A)),_=_.j(A).add(d(b))):(_=_.j(I),_=_.add(d(b)))}return _}var m=c(0),f=c(1),y=c(16777216);t=o.prototype,t.m=function(){if(E(this))return-x(this).m();for(var w=0,v=1,I=0;I<this.g.length;I++){var _=this.i(I);w+=(0<=_?_:4294967296+_)*v,v*=4294967296}return w},t.toString=function(w){if(w=w||10,2>w||36<w)throw Error("radix out of range: "+w);if(T(this))return"0";if(E(this))return"-"+x(this).toString(w);for(var v=d(Math.pow(w,6)),I=this,_="";;){var S=R(I,v).g;I=C(I,S.j(v));var A=((0<I.g.length?I.g[0]:I.h)>>>0).toString(w);if(I=S,T(I))return A+_;for(;6>A.length;)A="0"+A;_=A+_}},t.i=function(w){return 0>w?0:w<this.g.length?this.g[w]:this.h};function T(w){if(w.h!=0)return!1;for(var v=0;v<w.g.length;v++)if(w.g[v]!=0)return!1;return!0}function E(w){return w.h==-1}t.l=function(w){return w=C(this,w),E(w)?-1:T(w)?0:1};function x(w){for(var v=w.g.length,I=[],_=0;_<v;_++)I[_]=~w.g[_];return new o(I,~w.h).add(f)}t.abs=function(){return E(this)?x(this):this},t.add=function(w){for(var v=Math.max(this.g.length,w.g.length),I=[],_=0,S=0;S<=v;S++){var A=_+(this.i(S)&65535)+(w.i(S)&65535),b=(A>>>16)+(this.i(S)>>>16)+(w.i(S)>>>16);_=b>>>16,A&=65535,b&=65535,I[S]=b<<16|A}return new o(I,I[I.length-1]&-2147483648?-1:0)};function C(w,v){return w.add(x(v))}t.j=function(w){if(T(this)||T(w))return m;if(E(this))return E(w)?x(this).j(x(w)):x(x(this).j(w));if(E(w))return x(this.j(x(w)));if(0>this.l(y)&&0>w.l(y))return d(this.m()*w.m());for(var v=this.g.length+w.g.length,I=[],_=0;_<2*v;_++)I[_]=0;for(_=0;_<this.g.length;_++)for(var S=0;S<w.g.length;S++){var A=this.i(_)>>>16,b=this.i(_)&65535,Y=w.i(S)>>>16,ie=w.i(S)&65535;I[2*_+2*S]+=b*ie,P(I,2*_+2*S),I[2*_+2*S+1]+=A*ie,P(I,2*_+2*S+1),I[2*_+2*S+1]+=b*Y,P(I,2*_+2*S+1),I[2*_+2*S+2]+=A*Y,P(I,2*_+2*S+2)}for(_=0;_<v;_++)I[_]=I[2*_+1]<<16|I[2*_];for(_=v;_<2*v;_++)I[_]=0;return new o(I,0)};function P(w,v){for(;(w[v]&65535)!=w[v];)w[v+1]+=w[v]>>>16,w[v]&=65535,v++}function D(w,v){this.g=w,this.h=v}function R(w,v){if(T(v))throw Error("division by zero");if(T(w))return new D(m,m);if(E(w))return v=R(x(w),v),new D(x(v.g),x(v.h));if(E(v))return v=R(w,x(v)),new D(x(v.g),v.h);if(30<w.g.length){if(E(w)||E(v))throw Error("slowDivide_ only works with positive integers.");for(var I=f,_=v;0>=_.l(w);)I=B(I),_=B(_);var S=N(I,1),A=N(_,1);for(_=N(_,2),I=N(I,2);!T(_);){var b=A.add(_);0>=b.l(w)&&(S=S.add(I),A=b),_=N(_,1),I=N(I,1)}return v=C(w,S.j(v)),new D(S,v)}for(S=m;0<=w.l(v);){for(I=Math.max(1,Math.floor(w.m()/v.m())),_=Math.ceil(Math.log(I)/Math.LN2),_=48>=_?1:Math.pow(2,_-48),A=d(I),b=A.j(v);E(b)||0<b.l(w);)I-=_,A=d(I),b=A.j(v);T(A)&&(A=f),S=S.add(A),w=C(w,b)}return new D(S,w)}t.A=function(w){return R(this,w).h},t.and=function(w){for(var v=Math.max(this.g.length,w.g.length),I=[],_=0;_<v;_++)I[_]=this.i(_)&w.i(_);return new o(I,this.h&w.h)},t.or=function(w){for(var v=Math.max(this.g.length,w.g.length),I=[],_=0;_<v;_++)I[_]=this.i(_)|w.i(_);return new o(I,this.h|w.h)},t.xor=function(w){for(var v=Math.max(this.g.length,w.g.length),I=[],_=0;_<v;_++)I[_]=this.i(_)^w.i(_);return new o(I,this.h^w.h)};function B(w){for(var v=w.g.length+1,I=[],_=0;_<v;_++)I[_]=w.i(_)<<1|w.i(_-1)>>>31;return new o(I,w.h)}function N(w,v){var I=v>>5;v%=32;for(var _=w.g.length-I,S=[],A=0;A<_;A++)S[A]=0<v?w.i(A+I)>>>v|w.i(A+I+1)<<32-v:w.i(A+I);return new o(S,w.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,im=s,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=d,o.fromString=h,nr=o}).apply(typeof Jh<"u"?Jh:typeof self<"u"?self:typeof window<"u"?window:{});var Zo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var om,Ri,am,ca,mc,lm,cm,dm;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(l,u,p){return l==Array.prototype||l==Object.prototype||(l[u]=p.value),l};function n(l){l=[typeof globalThis=="object"&&globalThis,l,typeof window=="object"&&window,typeof self=="object"&&self,typeof Zo=="object"&&Zo];for(var u=0;u<l.length;++u){var p=l[u];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var s=n(this);function r(l,u){if(u)e:{var p=s;l=l.split(".");for(var g=0;g<l.length-1;g++){var k=l[g];if(!(k in p))break e;p=p[k]}l=l[l.length-1],g=p[l],u=u(g),u!=g&&u!=null&&e(p,l,{configurable:!0,writable:!0,value:u})}}function i(l,u){l instanceof String&&(l+="");var p=0,g=!1,k={next:function(){if(!g&&p<l.length){var M=p++;return{value:u(M,l[M]),done:!1}}return g=!0,{done:!0,value:void 0}}};return k[Symbol.iterator]=function(){return k},k}r("Array.prototype.values",function(l){return l||function(){return i(this,function(u,p){return p})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function c(l){var u=typeof l;return u=u!="object"?u:l?Array.isArray(l)?"array":u:"null",u=="array"||u=="object"&&typeof l.length=="number"}function d(l){var u=typeof l;return u=="object"&&l!=null||u=="function"}function h(l,u,p){return l.call.apply(l.bind,arguments)}function m(l,u,p){if(!l)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var k=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(k,g),l.apply(u,k)}}return function(){return l.apply(u,arguments)}}function f(l,u,p){return f=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?h:m,f.apply(null,arguments)}function y(l,u){var p=Array.prototype.slice.call(arguments,1);return function(){var g=p.slice();return g.push.apply(g,arguments),l.apply(this,g)}}function T(l,u){function p(){}p.prototype=u.prototype,l.aa=u.prototype,l.prototype=new p,l.prototype.constructor=l,l.Qb=function(g,k,M){for(var z=Array(arguments.length-2),Ie=2;Ie<arguments.length;Ie++)z[Ie-2]=arguments[Ie];return u.prototype[k].apply(g,z)}}function E(l){const u=l.length;if(0<u){const p=Array(u);for(let g=0;g<u;g++)p[g]=l[g];return p}return[]}function x(l,u){for(let p=1;p<arguments.length;p++){const g=arguments[p];if(c(g)){const k=l.length||0,M=g.length||0;l.length=k+M;for(let z=0;z<M;z++)l[k+z]=g[z]}else l.push(g)}}class C{constructor(u,p){this.i=u,this.j=p,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function P(l){return/^[\s\xa0]*$/.test(l)}function D(){var l=a.navigator;return l&&(l=l.userAgent)?l:""}function R(l){return R[" "](l),l}R[" "]=function(){};var B=D().indexOf("Gecko")!=-1&&!(D().toLowerCase().indexOf("webkit")!=-1&&D().indexOf("Edge")==-1)&&!(D().indexOf("Trident")!=-1||D().indexOf("MSIE")!=-1)&&D().indexOf("Edge")==-1;function N(l,u,p){for(const g in l)u.call(p,l[g],g,l)}function w(l,u){for(const p in l)u.call(void 0,l[p],p,l)}function v(l){const u={};for(const p in l)u[p]=l[p];return u}const I="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function _(l,u){let p,g;for(let k=1;k<arguments.length;k++){g=arguments[k];for(p in g)l[p]=g[p];for(let M=0;M<I.length;M++)p=I[M],Object.prototype.hasOwnProperty.call(g,p)&&(l[p]=g[p])}}function S(l){var u=1;l=l.split(":");const p=[];for(;0<u&&l.length;)p.push(l.shift()),u--;return l.length&&p.push(l.join(":")),p}function A(l){a.setTimeout(()=>{throw l},0)}function b(){var l=ye;let u=null;return l.g&&(u=l.g,l.g=l.g.next,l.g||(l.h=null),u.next=null),u}class Y{constructor(){this.h=this.g=null}add(u,p){const g=ie.get();g.set(u,p),this.h?this.h.next=g:this.g=g,this.h=g}}var ie=new C(()=>new q,l=>l.reset());class q{constructor(){this.next=this.g=this.h=null}set(u,p){this.h=u,this.g=p,this.next=null}reset(){this.next=this.g=this.h=null}}let se,ee=!1,ye=new Y,he=()=>{const l=a.Promise.resolve(void 0);se=()=>{l.then(dt)}};var dt=()=>{for(var l;l=b();){try{l.h.call(l.g)}catch(p){A(p)}var u=ie;u.j(l),100>u.h&&(u.h++,l.next=u.g,u.g=l)}ee=!1};function re(){this.s=this.s,this.C=this.C}re.prototype.s=!1,re.prototype.ma=function(){this.s||(this.s=!0,this.N())},re.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function V(l,u){this.type=l,this.g=this.target=u,this.defaultPrevented=!1}V.prototype.h=function(){this.defaultPrevented=!0};var xe=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var l=!1,u=Object.defineProperty({},"passive",{get:function(){l=!0}});try{const p=()=>{};a.addEventListener("test",p,u),a.removeEventListener("test",p,u)}catch{}return l}();function ae(l,u){if(V.call(this,l?l.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,l){var p=this.type=l.type,g=l.changedTouches&&l.changedTouches.length?l.changedTouches[0]:null;if(this.target=l.target||l.srcElement,this.g=u,u=l.relatedTarget){if(B){e:{try{R(u.nodeName);var k=!0;break e}catch{}k=!1}k||(u=null)}}else p=="mouseover"?u=l.fromElement:p=="mouseout"&&(u=l.toElement);this.relatedTarget=u,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0),this.button=l.button,this.key=l.key||"",this.ctrlKey=l.ctrlKey,this.altKey=l.altKey,this.shiftKey=l.shiftKey,this.metaKey=l.metaKey,this.pointerId=l.pointerId||0,this.pointerType=typeof l.pointerType=="string"?l.pointerType:tn[l.pointerType]||"",this.state=l.state,this.i=l,l.defaultPrevented&&ae.aa.h.call(this)}}T(ae,V);var tn={2:"touch",3:"pen",4:"mouse"};ae.prototype.h=function(){ae.aa.h.call(this);var l=this.i;l.preventDefault?l.preventDefault():l.returnValue=!1};var Ge="closure_listenable_"+(1e6*Math.random()|0),Cn=0;function oe(l,u,p,g,k){this.listener=l,this.proxy=null,this.src=u,this.type=p,this.capture=!!g,this.ha=k,this.key=++Cn,this.da=this.fa=!1}function fe(l){l.da=!0,l.listener=null,l.proxy=null,l.src=null,l.ha=null}function je(l){this.src=l,this.g={},this.h=0}je.prototype.add=function(l,u,p,g,k){var M=l.toString();l=this.g[M],l||(l=this.g[M]=[],this.h++);var z=xt(l,u,g,k);return-1<z?(u=l[z],p||(u.fa=!1)):(u=new oe(u,this.src,M,!!g,k),u.fa=p,l.push(u)),u};function nn(l,u){var p=u.type;if(p in l.g){var g=l.g[p],k=Array.prototype.indexOf.call(g,u,void 0),M;(M=0<=k)&&Array.prototype.splice.call(g,k,1),M&&(fe(u),l.g[p].length==0&&(delete l.g[p],l.h--))}}function xt(l,u,p,g){for(var k=0;k<l.length;++k){var M=l[k];if(!M.da&&M.listener==u&&M.capture==!!p&&M.ha==g)return k}return-1}var Ke="closure_lm_"+(1e6*Math.random()|0),Bt={};function et(l,u,p,g,k){if(Array.isArray(u)){for(var M=0;M<u.length;M++)et(l,u[M],p,g,k);return null}return p=kt(p),l&&l[Ge]?l.K(u,p,d(g)?!!g.capture:!1,k):sn(l,u,p,!1,g,k)}function sn(l,u,p,g,k,M){if(!u)throw Error("Invalid event type");var z=d(k)?!!k.capture:!!k,Ie=Rn(l);if(Ie||(l[Ke]=Ie=new je(l)),p=Ie.add(u,p,g,z,M),p.proxy)return p;if(g=At(),p.proxy=g,g.src=l,g.listener=p,l.addEventListener)xe||(k=z),k===void 0&&(k=!1),l.addEventListener(u.toString(),g,k);else if(l.attachEvent)l.attachEvent(Er(u.toString()),g);else if(l.addListener&&l.removeListener)l.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return p}function At(){function l(p){return u.call(l.src,l.listener,p)}const u=Pn;return l}function rn(l,u,p,g,k){if(Array.isArray(u))for(var M=0;M<u.length;M++)rn(l,u[M],p,g,k);else g=d(g)?!!g.capture:!!g,p=kt(p),l&&l[Ge]?(l=l.i,u=String(u).toString(),u in l.g&&(M=l.g[u],p=xt(M,p,g,k),-1<p&&(fe(M[p]),Array.prototype.splice.call(M,p,1),M.length==0&&(delete l.g[u],l.h--)))):l&&(l=Rn(l))&&(u=l.g[u.toString()],l=-1,u&&(l=xt(u,p,g,k)),(p=-1<l?u[l]:null)&&Us(p))}function Us(l){if(typeof l!="number"&&l&&!l.da){var u=l.src;if(u&&u[Ge])nn(u.i,l);else{var p=l.type,g=l.proxy;u.removeEventListener?u.removeEventListener(p,g,l.capture):u.detachEvent?u.detachEvent(Er(p),g):u.addListener&&u.removeListener&&u.removeListener(g),(p=Rn(u))?(nn(p,l),p.h==0&&(p.src=null,u[Ke]=null)):fe(l)}}}function Er(l){return l in Bt?Bt[l]:Bt[l]="on"+l}function Pn(l,u){if(l.da)l=!0;else{u=new ae(u,this);var p=l.listener,g=l.ha||l.src;l.fa&&Us(l),l=p.call(g,u)}return l}function Rn(l){return l=l[Ke],l instanceof je?l:null}var Wt="__closure_events_fn_"+(1e9*Math.random()>>>0);function kt(l){return typeof l=="function"?l:(l[Wt]||(l[Wt]=function(u){return l.handleEvent(u)}),l[Wt])}function Ne(){re.call(this),this.i=new je(this),this.M=this,this.F=null}T(Ne,re),Ne.prototype[Ge]=!0,Ne.prototype.removeEventListener=function(l,u,p,g){rn(this,l,u,p,g)};function Oe(l,u){var p,g=l.F;if(g)for(p=[];g;g=g.F)p.push(g);if(l=l.M,g=u.type||u,typeof u=="string")u=new V(u,l);else if(u instanceof V)u.target=u.target||l;else{var k=u;u=new V(g,l),_(u,k)}if(k=!0,p)for(var M=p.length-1;0<=M;M--){var z=u.g=p[M];k=Mn(z,g,!0,u)&&k}if(z=u.g=l,k=Mn(z,g,!0,u)&&k,k=Mn(z,g,!1,u)&&k,p)for(M=0;M<p.length;M++)z=u.g=p[M],k=Mn(z,g,!1,u)&&k}Ne.prototype.N=function(){if(Ne.aa.N.call(this),this.i){var l=this.i,u;for(u in l.g){for(var p=l.g[u],g=0;g<p.length;g++)fe(p[g]);delete l.g[u],l.h--}}this.F=null},Ne.prototype.K=function(l,u,p,g){return this.i.add(String(l),u,!1,p,g)},Ne.prototype.L=function(l,u,p,g){return this.i.add(String(l),u,!0,p,g)};function Mn(l,u,p,g){if(u=l.i.g[String(u)],!u)return!0;u=u.concat();for(var k=!0,M=0;M<u.length;++M){var z=u[M];if(z&&!z.da&&z.capture==p){var Ie=z.listener,nt=z.ha||z.src;z.fa&&nn(l.i,z),k=Ie.call(nt,g)!==!1&&k}}return k&&!g.defaultPrevented}function _r(l,u,p){if(typeof l=="function")p&&(l=f(l,p));else if(l&&typeof l.handleEvent=="function")l=f(l.handleEvent,l);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:a.setTimeout(l,u||0)}function ls(l){l.g=_r(()=>{l.g=null,l.i&&(l.i=!1,ls(l))},l.l);const u=l.h;l.h=null,l.m.apply(null,u)}class $s extends re{constructor(u,p){super(),this.m=u,this.l=p,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:ls(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Dn(l){re.call(this),this.h=l,this.g={}}T(Dn,re);var cs=[];function He(l){N(l.g,function(u,p){this.g.hasOwnProperty(p)&&Us(u)},l),l.g={}}Dn.prototype.N=function(){Dn.aa.N.call(this),He(this)},Dn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var zt=a.JSON.stringify,Bn=a.JSON.parse,ds=class{stringify(l){return a.JSON.stringify(l,void 0)}parse(l){return a.JSON.parse(l,void 0)}};function Yt(){}Yt.prototype.h=null;function on(l){return l.h||(l.h=l.i())}function Tr(){}var an={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Gt(){V.call(this,"d")}T(Gt,V);function Ln(){V.call(this,"c")}T(Ln,V);var ut={},Fe=null;function us(){return Fe=Fe||new Ne}ut.La="serverreachability";function K(l){V.call(this,ut.La,l)}T(K,V);function ve(l){const u=us();Oe(u,new K(u))}ut.STAT_EVENT="statevent";function tt(l,u){V.call(this,ut.STAT_EVENT,l),this.stat=u}T(tt,V);function Ve(l){const u=us();Oe(u,new tt(u,l))}ut.Ma="timingevent";function Nn(l,u){V.call(this,ut.Ma,l),this.size=u}T(Nn,V);function qs(l,u){if(typeof l!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){l()},u)}function Hs(){this.g=!0}Hs.prototype.xa=function(){this.g=!1};function Rl(l,u,p,g,k,M){l.info(function(){if(l.g)if(M)for(var z="",Ie=M.split("&"),nt=0;nt<Ie.length;nt++){var me=Ie[nt].split("=");if(1<me.length){var pt=me[0];me=me[1];var mt=pt.split("_");z=2<=mt.length&&mt[1]=="type"?z+(pt+"="+me+"&"):z+(pt+"=redacted&")}}else z=null;else z=M;return"XMLHTTP REQ ("+g+") [attempt "+k+"]: "+u+`
`+p+`
`+z})}function Ml(l,u,p,g,k,M,z){l.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+k+"]: "+u+`
`+p+`
`+M+" "+z})}function gn(l,u,p,g){l.info(function(){return"XMLHTTP TEXT ("+u+"): "+Vo(l,p)+(g?" "+g:"")})}function Dl(l,u){l.info(function(){return"TIMEOUT: "+u})}Hs.prototype.info=function(){};function Vo(l,u){if(!l.g)return u;if(!u)return null;try{var p=JSON.parse(u);if(p){for(l=0;l<p.length;l++)if(Array.isArray(p[l])){var g=p[l];if(!(2>g.length)){var k=g[1];if(Array.isArray(k)&&!(1>k.length)){var M=k[0];if(M!="noop"&&M!="stop"&&M!="close")for(var z=1;z<k.length;z++)k[z]=""}}}}return zt(p)}catch{return u}}var Ws={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},vi={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Ir;function J(){}T(J,Yt),J.prototype.g=function(){return new XMLHttpRequest},J.prototype.i=function(){return{}},Ir=new J;function Pe(l,u,p,g){this.j=l,this.i=u,this.l=p,this.R=g||1,this.U=new Dn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Lt}function Lt(){this.i=null,this.g="",this.h=!1}var Qe={},Ct={};function pe(l,u,p){l.L=1,l.v=$o(On(u)),l.m=p,l.P=!0,ht(l,null)}function ht(l,u){l.F=Date.now(),Ys(l),l.A=On(l.v);var p=l.A,g=l.R;Array.isArray(g)||(g=[String(g)]),Xu(p.i,"t",g),l.C=0,p=l.j.J,l.h=new Lt,l.g=gh(l.j,p?u:null,!l.m),0<l.O&&(l.M=new $s(f(l.Y,l,l.g),l.O)),u=l.U,p=l.g,g=l.ca;var k="readystatechange";Array.isArray(k)||(k&&(cs[0]=k.toString()),k=cs);for(var M=0;M<k.length;M++){var z=et(p,k[M],g||u.handleEvent,!1,u.h||u);if(!z)break;u.g[z.key]=z}u=l.H?v(l.H):{},l.m?(l.u||(l.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",l.g.ea(l.A,l.u,l.m,u)):(l.u="GET",l.g.ea(l.A,l.u,null,u)),ve(),Rl(l.i,l.u,l.A,l.l,l.R,l.m)}Pe.prototype.ca=function(l){l=l.target;const u=this.M;u&&Fn(l)==3?u.j():this.Y(l)},Pe.prototype.Y=function(l){try{if(l==this.g)e:{const mt=Fn(this.g);var u=this.g.Ba();const kr=this.g.Z();if(!(3>mt)&&(mt!=3||this.g&&(this.h.h||this.g.oa()||ih(this.g)))){this.J||mt!=4||u==7||(u==8||0>=kr?ve(3):ve(2)),Sr(this);var p=this.g.Z();this.X=p;t:if(ft(this)){var g=ih(this.g);l="";var k=g.length,M=Fn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){fs(this),Gs(this);var z="";break t}this.h.i=new a.TextDecoder}for(u=0;u<k;u++)this.h.h=!0,l+=this.h.i.decode(g[u],{stream:!(M&&u==k-1)});g.length=0,this.h.g+=l,this.C=0,z=this.h.g}else z=this.g.oa();if(this.o=p==200,Ml(this.i,this.u,this.A,this.l,this.R,mt,p),this.o){if(this.T&&!this.K){t:{if(this.g){var Ie,nt=this.g;if((Ie=nt.g?nt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!P(Ie)){var me=Ie;break t}}me=null}if(p=me)gn(this.i,this.l,p,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Bl(this,p);else{this.o=!1,this.s=3,Ve(12),fs(this),Gs(this);break e}}if(this.P){p=!0;let ln;for(;!this.J&&this.C<z.length;)if(ln=hs(this,z),ln==Ct){mt==4&&(this.s=4,Ve(14),p=!1),gn(this.i,this.l,null,"[Incomplete Response]");break}else if(ln==Qe){this.s=4,Ve(15),gn(this.i,this.l,z,"[Invalid Chunk]"),p=!1;break}else gn(this.i,this.l,ln,null),Bl(this,ln);if(ft(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),mt!=4||z.length!=0||this.h.h||(this.s=1,Ve(16),p=!1),this.o=this.o&&p,!p)gn(this.i,this.l,z,"[Invalid Chunked Response]"),fs(this),Gs(this);else if(0<z.length&&!this.W){this.W=!0;var pt=this.j;pt.g==this&&pt.ba&&!pt.M&&(pt.j.info("Great, no buffering proxy detected. Bytes received: "+z.length),zl(pt),pt.M=!0,Ve(11))}}else gn(this.i,this.l,z,null),Bl(this,z);mt==4&&fs(this),this.o&&!this.J&&(mt==4?hh(this.j,this):(this.o=!1,Ys(this)))}else x0(this.g),p==400&&0<z.indexOf("Unknown SID")?(this.s=3,Ve(12)):(this.s=0,Ve(13)),fs(this),Gs(this)}}}catch{}finally{}};function ft(l){return l.g?l.u=="GET"&&l.L!=2&&l.j.Ca:!1}function hs(l,u){var p=l.C,g=u.indexOf(`
`,p);return g==-1?Ct:(p=Number(u.substring(p,g)),isNaN(p)?Qe:(g+=1,g+p>u.length?Ct:(u=u.slice(g,g+p),l.C=g+p,u)))}Pe.prototype.cancel=function(){this.J=!0,fs(this)};function Ys(l){l.S=Date.now()+l.I,Nt(l,l.I)}function Nt(l,u){if(l.B!=null)throw Error("WatchDog timer not null");l.B=qs(f(l.ba,l),u)}function Sr(l){l.B&&(a.clearTimeout(l.B),l.B=null)}Pe.prototype.ba=function(){this.B=null;const l=Date.now();0<=l-this.S?(Dl(this.i,this.A),this.L!=2&&(ve(),Ve(17)),fs(this),this.s=2,Gs(this)):Nt(this,this.S-l)};function Gs(l){l.j.G==0||l.J||hh(l.j,l)}function fs(l){Sr(l);var u=l.M;u&&typeof u.ma=="function"&&u.ma(),l.M=null,He(l.U),l.g&&(u=l.g,l.g=null,u.abort(),u.ma())}function Bl(l,u){try{var p=l.j;if(p.G!=0&&(p.g==l||Ll(p.h,l))){if(!l.K&&Ll(p.h,l)&&p.G==3){try{var g=p.Da.g.parse(u)}catch{g=null}if(Array.isArray(g)&&g.length==3){var k=g;if(k[0]==0){e:if(!p.u){if(p.g)if(p.g.F+3e3<l.F)jo(p),Yo(p);else break e;Vl(p),Ve(18)}}else p.za=k[1],0<p.za-p.T&&37500>k[2]&&p.F&&p.v==0&&!p.C&&(p.C=qs(f(p.Za,p),6e3));if(1>=qu(p.h)&&p.ca){try{p.ca()}catch{}p.ca=void 0}}else Ks(p,11)}else if((l.K||p.g==l)&&jo(p),!P(u))for(k=p.Da.g.parse(u),u=0;u<k.length;u++){let me=k[u];if(p.T=me[0],me=me[1],p.G==2)if(me[0]=="c"){p.K=me[1],p.ia=me[2];const pt=me[3];pt!=null&&(p.la=pt,p.j.info("VER="+p.la));const mt=me[4];mt!=null&&(p.Aa=mt,p.j.info("SVER="+p.Aa));const kr=me[5];kr!=null&&typeof kr=="number"&&0<kr&&(g=1.5*kr,p.L=g,p.j.info("backChannelRequestTimeoutMs_="+g)),g=p;const ln=l.g;if(ln){const Qo=ln.g?ln.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Qo){var M=g.h;M.g||Qo.indexOf("spdy")==-1&&Qo.indexOf("quic")==-1&&Qo.indexOf("h2")==-1||(M.j=M.l,M.g=new Set,M.h&&(Nl(M,M.h),M.h=null))}if(g.D){const Ul=ln.g?ln.g.getResponseHeader("X-HTTP-Session-Id"):null;Ul&&(g.ya=Ul,Ae(g.I,g.D,Ul))}}p.G=3,p.l&&p.l.ua(),p.ba&&(p.R=Date.now()-l.F,p.j.info("Handshake RTT: "+p.R+"ms")),g=p;var z=l;if(g.qa=mh(g,g.J?g.ia:null,g.W),z.K){Hu(g.h,z);var Ie=z,nt=g.L;nt&&(Ie.I=nt),Ie.B&&(Sr(Ie),Ys(Ie)),g.g=z}else dh(g);0<p.i.length&&Go(p)}else me[0]!="stop"&&me[0]!="close"||Ks(p,7);else p.G==3&&(me[0]=="stop"||me[0]=="close"?me[0]=="stop"?Ks(p,7):Fl(p):me[0]!="noop"&&p.l&&p.l.ta(me),p.v=0)}}ve(4)}catch{}}var d0=class{constructor(l,u){this.g=l,this.map=u}};function Uu(l){this.l=l||10,a.PerformanceNavigationTiming?(l=a.performance.getEntriesByType("navigation"),l=0<l.length&&(l[0].nextHopProtocol=="hq"||l[0].nextHopProtocol=="h2")):l=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=l?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function $u(l){return l.h?!0:l.g?l.g.size>=l.j:!1}function qu(l){return l.h?1:l.g?l.g.size:0}function Ll(l,u){return l.h?l.h==u:l.g?l.g.has(u):!1}function Nl(l,u){l.g?l.g.add(u):l.h=u}function Hu(l,u){l.h&&l.h==u?l.h=null:l.g&&l.g.has(u)&&l.g.delete(u)}Uu.prototype.cancel=function(){if(this.i=Wu(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const l of this.g.values())l.cancel();this.g.clear()}};function Wu(l){if(l.h!=null)return l.i.concat(l.h.D);if(l.g!=null&&l.g.size!==0){let u=l.i;for(const p of l.g.values())u=u.concat(p.D);return u}return E(l.i)}function u0(l){if(l.V&&typeof l.V=="function")return l.V();if(typeof Map<"u"&&l instanceof Map||typeof Set<"u"&&l instanceof Set)return Array.from(l.values());if(typeof l=="string")return l.split("");if(c(l)){for(var u=[],p=l.length,g=0;g<p;g++)u.push(l[g]);return u}u=[],p=0;for(g in l)u[p++]=l[g];return u}function h0(l){if(l.na&&typeof l.na=="function")return l.na();if(!l.V||typeof l.V!="function"){if(typeof Map<"u"&&l instanceof Map)return Array.from(l.keys());if(!(typeof Set<"u"&&l instanceof Set)){if(c(l)||typeof l=="string"){var u=[];l=l.length;for(var p=0;p<l;p++)u.push(p);return u}u=[],p=0;for(const g in l)u[p++]=g;return u}}}function Yu(l,u){if(l.forEach&&typeof l.forEach=="function")l.forEach(u,void 0);else if(c(l)||typeof l=="string")Array.prototype.forEach.call(l,u,void 0);else for(var p=h0(l),g=u0(l),k=g.length,M=0;M<k;M++)u.call(void 0,g[M],p&&p[M],l)}var Gu=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function f0(l,u){if(l){l=l.split("&");for(var p=0;p<l.length;p++){var g=l[p].indexOf("="),k=null;if(0<=g){var M=l[p].substring(0,g);k=l[p].substring(g+1)}else M=l[p];u(M,k?decodeURIComponent(k.replace(/\+/g," ")):"")}}}function js(l){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,l instanceof js){this.h=l.h,zo(this,l.j),this.o=l.o,this.g=l.g,Uo(this,l.s),this.l=l.l;var u=l.i,p=new Ei;p.i=u.i,u.g&&(p.g=new Map(u.g),p.h=u.h),ju(this,p),this.m=l.m}else l&&(u=String(l).match(Gu))?(this.h=!1,zo(this,u[1]||"",!0),this.o=bi(u[2]||""),this.g=bi(u[3]||"",!0),Uo(this,u[4]),this.l=bi(u[5]||"",!0),ju(this,u[6]||"",!0),this.m=bi(u[7]||"")):(this.h=!1,this.i=new Ei(null,this.h))}js.prototype.toString=function(){var l=[],u=this.j;u&&l.push(wi(u,Ku,!0),":");var p=this.g;return(p||u=="file")&&(l.push("//"),(u=this.o)&&l.push(wi(u,Ku,!0),"@"),l.push(encodeURIComponent(String(p)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),p=this.s,p!=null&&l.push(":",String(p))),(p=this.l)&&(this.g&&p.charAt(0)!="/"&&l.push("/"),l.push(wi(p,p.charAt(0)=="/"?g0:m0,!0))),(p=this.i.toString())&&l.push("?",p),(p=this.m)&&l.push("#",wi(p,v0)),l.join("")};function On(l){return new js(l)}function zo(l,u,p){l.j=p?bi(u,!0):u,l.j&&(l.j=l.j.replace(/:$/,""))}function Uo(l,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);l.s=u}else l.s=null}function ju(l,u,p){u instanceof Ei?(l.i=u,b0(l.i,l.h)):(p||(u=wi(u,y0)),l.i=new Ei(u,l.h))}function Ae(l,u,p){l.i.set(u,p)}function $o(l){return Ae(l,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),l}function bi(l,u){return l?u?decodeURI(l.replace(/%25/g,"%2525")):decodeURIComponent(l):""}function wi(l,u,p){return typeof l=="string"?(l=encodeURI(l).replace(u,p0),p&&(l=l.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l):null}function p0(l){return l=l.charCodeAt(0),"%"+(l>>4&15).toString(16)+(l&15).toString(16)}var Ku=/[#\/\?@]/g,m0=/[#\?:]/g,g0=/[#\?]/g,y0=/[#\?@]/g,v0=/#/g;function Ei(l,u){this.h=this.g=null,this.i=l||null,this.j=!!u}function ps(l){l.g||(l.g=new Map,l.h=0,l.i&&f0(l.i,function(u,p){l.add(decodeURIComponent(u.replace(/\+/g," ")),p)}))}t=Ei.prototype,t.add=function(l,u){ps(this),this.i=null,l=xr(this,l);var p=this.g.get(l);return p||this.g.set(l,p=[]),p.push(u),this.h+=1,this};function Qu(l,u){ps(l),u=xr(l,u),l.g.has(u)&&(l.i=null,l.h-=l.g.get(u).length,l.g.delete(u))}function Ju(l,u){return ps(l),u=xr(l,u),l.g.has(u)}t.forEach=function(l,u){ps(this),this.g.forEach(function(p,g){p.forEach(function(k){l.call(u,k,g,this)},this)},this)},t.na=function(){ps(this);const l=Array.from(this.g.values()),u=Array.from(this.g.keys()),p=[];for(let g=0;g<u.length;g++){const k=l[g];for(let M=0;M<k.length;M++)p.push(u[g])}return p},t.V=function(l){ps(this);let u=[];if(typeof l=="string")Ju(this,l)&&(u=u.concat(this.g.get(xr(this,l))));else{l=Array.from(this.g.values());for(let p=0;p<l.length;p++)u=u.concat(l[p])}return u},t.set=function(l,u){return ps(this),this.i=null,l=xr(this,l),Ju(this,l)&&(this.h-=this.g.get(l).length),this.g.set(l,[u]),this.h+=1,this},t.get=function(l,u){return l?(l=this.V(l),0<l.length?String(l[0]):u):u};function Xu(l,u,p){Qu(l,u),0<p.length&&(l.i=null,l.g.set(xr(l,u),E(p)),l.h+=p.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const l=[],u=Array.from(this.g.keys());for(var p=0;p<u.length;p++){var g=u[p];const M=encodeURIComponent(String(g)),z=this.V(g);for(g=0;g<z.length;g++){var k=M;z[g]!==""&&(k+="="+encodeURIComponent(String(z[g]))),l.push(k)}}return this.i=l.join("&")};function xr(l,u){return u=String(u),l.j&&(u=u.toLowerCase()),u}function b0(l,u){u&&!l.j&&(ps(l),l.i=null,l.g.forEach(function(p,g){var k=g.toLowerCase();g!=k&&(Qu(this,g),Xu(this,k,p))},l)),l.j=u}function w0(l,u){const p=new Hs;if(a.Image){const g=new Image;g.onload=y(ms,p,"TestLoadImage: loaded",!0,u,g),g.onerror=y(ms,p,"TestLoadImage: error",!1,u,g),g.onabort=y(ms,p,"TestLoadImage: abort",!1,u,g),g.ontimeout=y(ms,p,"TestLoadImage: timeout",!1,u,g),a.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=l}else u(!1)}function E0(l,u){const p=new Hs,g=new AbortController,k=setTimeout(()=>{g.abort(),ms(p,"TestPingServer: timeout",!1,u)},1e4);fetch(l,{signal:g.signal}).then(M=>{clearTimeout(k),M.ok?ms(p,"TestPingServer: ok",!0,u):ms(p,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(k),ms(p,"TestPingServer: error",!1,u)})}function ms(l,u,p,g,k){try{k&&(k.onload=null,k.onerror=null,k.onabort=null,k.ontimeout=null),g(p)}catch{}}function _0(){this.g=new ds}function T0(l,u,p){const g=p||"";try{Yu(l,function(k,M){let z=k;d(k)&&(z=zt(k)),u.push(g+M+"="+encodeURIComponent(z))})}catch(k){throw u.push(g+"type="+encodeURIComponent("_badmap")),k}}function qo(l){this.l=l.Ub||null,this.j=l.eb||!1}T(qo,Yt),qo.prototype.g=function(){return new Ho(this.l,this.j)},qo.prototype.i=function(l){return function(){return l}}({});function Ho(l,u){Ne.call(this),this.D=l,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}T(Ho,Ne),t=Ho.prototype,t.open=function(l,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=l,this.A=u,this.readyState=1,Ti(this)},t.send=function(l){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};l&&(u.body=l),(this.D||a).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,_i(this)),this.readyState=0},t.Sa=function(l){if(this.g&&(this.l=l,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=l.headers,this.readyState=2,Ti(this)),this.g&&(this.readyState=3,Ti(this),this.g)))if(this.responseType==="arraybuffer")l.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in l){if(this.j=l.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Zu(this)}else l.text().then(this.Ra.bind(this),this.ga.bind(this))};function Zu(l){l.j.read().then(l.Pa.bind(l)).catch(l.ga.bind(l))}t.Pa=function(l){if(this.g){if(this.o&&l.value)this.response.push(l.value);else if(!this.o){var u=l.value?l.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!l.done}))&&(this.response=this.responseText+=u)}l.done?_i(this):Ti(this),this.readyState==3&&Zu(this)}},t.Ra=function(l){this.g&&(this.response=this.responseText=l,_i(this))},t.Qa=function(l){this.g&&(this.response=l,_i(this))},t.ga=function(){this.g&&_i(this)};function _i(l){l.readyState=4,l.l=null,l.j=null,l.v=null,Ti(l)}t.setRequestHeader=function(l,u){this.u.append(l,u)},t.getResponseHeader=function(l){return this.h&&this.h.get(l.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const l=[],u=this.h.entries();for(var p=u.next();!p.done;)p=p.value,l.push(p[0]+": "+p[1]),p=u.next();return l.join(`\r
`)};function Ti(l){l.onreadystatechange&&l.onreadystatechange.call(l)}Object.defineProperty(Ho.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(l){this.m=l?"include":"same-origin"}});function eh(l){let u="";return N(l,function(p,g){u+=g,u+=":",u+=p,u+=`\r
`}),u}function Ol(l,u,p){e:{for(g in p){var g=!1;break e}g=!0}g||(p=eh(p),typeof l=="string"?p!=null&&encodeURIComponent(String(p)):Ae(l,u,p))}function Be(l){Ne.call(this),this.headers=new Map,this.o=l||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}T(Be,Ne);var I0=/^https?$/i,S0=["POST","PUT"];t=Be.prototype,t.Ha=function(l){this.J=l},t.ea=function(l,u,p,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+l);u=u?u.toUpperCase():"GET",this.D=l,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ir.g(),this.v=this.o?on(this.o):on(Ir),this.g.onreadystatechange=f(this.Ea,this);try{this.B=!0,this.g.open(u,String(l),!0),this.B=!1}catch(M){th(this,M);return}if(l=p||"",p=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var k in g)p.set(k,g[k]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const M of g.keys())p.set(M,g.get(M));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(p.keys()).find(M=>M.toLowerCase()=="content-type"),k=a.FormData&&l instanceof a.FormData,!(0<=Array.prototype.indexOf.call(S0,u,void 0))||g||k||p.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[M,z]of p)this.g.setRequestHeader(M,z);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{rh(this),this.u=!0,this.g.send(l),this.u=!1}catch(M){th(this,M)}};function th(l,u){l.h=!1,l.g&&(l.j=!0,l.g.abort(),l.j=!1),l.l=u,l.m=5,nh(l),Wo(l)}function nh(l){l.A||(l.A=!0,Oe(l,"complete"),Oe(l,"error"))}t.abort=function(l){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=l||7,Oe(this,"complete"),Oe(this,"abort"),Wo(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Wo(this,!0)),Be.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?sh(this):this.bb())},t.bb=function(){sh(this)};function sh(l){if(l.h&&typeof o<"u"&&(!l.v[1]||Fn(l)!=4||l.Z()!=2)){if(l.u&&Fn(l)==4)_r(l.Ea,0,l);else if(Oe(l,"readystatechange"),Fn(l)==4){l.h=!1;try{const z=l.Z();e:switch(z){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var p;if(!(p=u)){var g;if(g=z===0){var k=String(l.D).match(Gu)[1]||null;!k&&a.self&&a.self.location&&(k=a.self.location.protocol.slice(0,-1)),g=!I0.test(k?k.toLowerCase():"")}p=g}if(p)Oe(l,"complete"),Oe(l,"success");else{l.m=6;try{var M=2<Fn(l)?l.g.statusText:""}catch{M=""}l.l=M+" ["+l.Z()+"]",nh(l)}}finally{Wo(l)}}}}function Wo(l,u){if(l.g){rh(l);const p=l.g,g=l.v[0]?()=>{}:null;l.g=null,l.v=null,u||Oe(l,"ready");try{p.onreadystatechange=g}catch{}}}function rh(l){l.I&&(a.clearTimeout(l.I),l.I=null)}t.isActive=function(){return!!this.g};function Fn(l){return l.g?l.g.readyState:0}t.Z=function(){try{return 2<Fn(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(l){if(this.g){var u=this.g.responseText;return l&&u.indexOf(l)==0&&(u=u.substring(l.length)),Bn(u)}};function ih(l){try{if(!l.g)return null;if("response"in l.g)return l.g.response;switch(l.H){case"":case"text":return l.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in l.g)return l.g.mozResponseArrayBuffer}return null}catch{return null}}function x0(l){const u={};l=(l.g&&2<=Fn(l)&&l.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<l.length;g++){if(P(l[g]))continue;var p=S(l[g]);const k=p[0];if(p=p[1],typeof p!="string")continue;p=p.trim();const M=u[k]||[];u[k]=M,M.push(p)}w(u,function(g){return g.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ii(l,u,p){return p&&p.internalChannelParams&&p.internalChannelParams[l]||u}function oh(l){this.Aa=0,this.i=[],this.j=new Hs,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ii("failFast",!1,l),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ii("baseRetryDelayMs",5e3,l),this.cb=Ii("retryDelaySeedMs",1e4,l),this.Wa=Ii("forwardChannelMaxRetries",2,l),this.wa=Ii("forwardChannelRequestTimeoutMs",2e4,l),this.pa=l&&l.xmlHttpFactory||void 0,this.Xa=l&&l.Tb||void 0,this.Ca=l&&l.useFetchStreams||!1,this.L=void 0,this.J=l&&l.supportsCrossDomainXhr||!1,this.K="",this.h=new Uu(l&&l.concurrentRequestLimit),this.Da=new _0,this.P=l&&l.fastHandshake||!1,this.O=l&&l.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=l&&l.Rb||!1,l&&l.xa&&this.j.xa(),l&&l.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&l&&l.detectBufferingProxy||!1,this.ja=void 0,l&&l.longPollingTimeout&&0<l.longPollingTimeout&&(this.ja=l.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=oh.prototype,t.la=8,t.G=1,t.connect=function(l,u,p,g){Ve(0),this.W=l,this.H=u||{},p&&g!==void 0&&(this.H.OSID=p,this.H.OAID=g),this.F=this.X,this.I=mh(this,null,this.W),Go(this)};function Fl(l){if(ah(l),l.G==3){var u=l.U++,p=On(l.I);if(Ae(p,"SID",l.K),Ae(p,"RID",u),Ae(p,"TYPE","terminate"),Si(l,p),u=new Pe(l,l.j,u),u.L=2,u.v=$o(On(p)),p=!1,a.navigator&&a.navigator.sendBeacon)try{p=a.navigator.sendBeacon(u.v.toString(),"")}catch{}!p&&a.Image&&(new Image().src=u.v,p=!0),p||(u.g=gh(u.j,null),u.g.ea(u.v)),u.F=Date.now(),Ys(u)}ph(l)}function Yo(l){l.g&&(zl(l),l.g.cancel(),l.g=null)}function ah(l){Yo(l),l.u&&(a.clearTimeout(l.u),l.u=null),jo(l),l.h.cancel(),l.s&&(typeof l.s=="number"&&a.clearTimeout(l.s),l.s=null)}function Go(l){if(!$u(l.h)&&!l.s){l.s=!0;var u=l.Ga;se||he(),ee||(se(),ee=!0),ye.add(u,l),l.B=0}}function A0(l,u){return qu(l.h)>=l.h.j-(l.s?1:0)?!1:l.s?(l.i=u.D.concat(l.i),!0):l.G==1||l.G==2||l.B>=(l.Va?0:l.Wa)?!1:(l.s=qs(f(l.Ga,l,u),fh(l,l.B)),l.B++,!0)}t.Ga=function(l){if(this.s)if(this.s=null,this.G==1){if(!l){this.U=Math.floor(1e5*Math.random()),l=this.U++;const k=new Pe(this,this.j,l);let M=this.o;if(this.S&&(M?(M=v(M),_(M,this.S)):M=this.S),this.m!==null||this.O||(k.H=M,M=null),this.P)e:{for(var u=0,p=0;p<this.i.length;p++){t:{var g=this.i[p];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(u+=g,4096<u){u=p;break e}if(u===4096||p===this.i.length-1){u=p+1;break e}}u=1e3}else u=1e3;u=ch(this,k,u),p=On(this.I),Ae(p,"RID",l),Ae(p,"CVER",22),this.D&&Ae(p,"X-HTTP-Session-Id",this.D),Si(this,p),M&&(this.O?u="headers="+encodeURIComponent(String(eh(M)))+"&"+u:this.m&&Ol(p,this.m,M)),Nl(this.h,k),this.Ua&&Ae(p,"TYPE","init"),this.P?(Ae(p,"$req",u),Ae(p,"SID","null"),k.T=!0,pe(k,p,null)):pe(k,p,u),this.G=2}}else this.G==3&&(l?lh(this,l):this.i.length==0||$u(this.h)||lh(this))};function lh(l,u){var p;u?p=u.l:p=l.U++;const g=On(l.I);Ae(g,"SID",l.K),Ae(g,"RID",p),Ae(g,"AID",l.T),Si(l,g),l.m&&l.o&&Ol(g,l.m,l.o),p=new Pe(l,l.j,p,l.B+1),l.m===null&&(p.H=l.o),u&&(l.i=u.D.concat(l.i)),u=ch(l,p,1e3),p.I=Math.round(.5*l.wa)+Math.round(.5*l.wa*Math.random()),Nl(l.h,p),pe(p,g,u)}function Si(l,u){l.H&&N(l.H,function(p,g){Ae(u,g,p)}),l.l&&Yu({},function(p,g){Ae(u,g,p)})}function ch(l,u,p){p=Math.min(l.i.length,p);var g=l.l?f(l.l.Na,l.l,l):null;e:{var k=l.i;let M=-1;for(;;){const z=["count="+p];M==-1?0<p?(M=k[0].g,z.push("ofs="+M)):M=0:z.push("ofs="+M);let Ie=!0;for(let nt=0;nt<p;nt++){let me=k[nt].g;const pt=k[nt].map;if(me-=M,0>me)M=Math.max(0,k[nt].g-100),Ie=!1;else try{T0(pt,z,"req"+me+"_")}catch{g&&g(pt)}}if(Ie){g=z.join("&");break e}}}return l=l.i.splice(0,p),u.D=l,g}function dh(l){if(!l.g&&!l.u){l.Y=1;var u=l.Fa;se||he(),ee||(se(),ee=!0),ye.add(u,l),l.v=0}}function Vl(l){return l.g||l.u||3<=l.v?!1:(l.Y++,l.u=qs(f(l.Fa,l),fh(l,l.v)),l.v++,!0)}t.Fa=function(){if(this.u=null,uh(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var l=2*this.R;this.j.info("BP detection timer enabled: "+l),this.A=qs(f(this.ab,this),l)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ve(10),Yo(this),uh(this))};function zl(l){l.A!=null&&(a.clearTimeout(l.A),l.A=null)}function uh(l){l.g=new Pe(l,l.j,"rpc",l.Y),l.m===null&&(l.g.H=l.o),l.g.O=0;var u=On(l.qa);Ae(u,"RID","rpc"),Ae(u,"SID",l.K),Ae(u,"AID",l.T),Ae(u,"CI",l.F?"0":"1"),!l.F&&l.ja&&Ae(u,"TO",l.ja),Ae(u,"TYPE","xmlhttp"),Si(l,u),l.m&&l.o&&Ol(u,l.m,l.o),l.L&&(l.g.I=l.L);var p=l.g;l=l.ia,p.L=1,p.v=$o(On(u)),p.m=null,p.P=!0,ht(p,l)}t.Za=function(){this.C!=null&&(this.C=null,Yo(this),Vl(this),Ve(19))};function jo(l){l.C!=null&&(a.clearTimeout(l.C),l.C=null)}function hh(l,u){var p=null;if(l.g==u){jo(l),zl(l),l.g=null;var g=2}else if(Ll(l.h,u))p=u.D,Hu(l.h,u),g=1;else return;if(l.G!=0){if(u.o)if(g==1){p=u.m?u.m.length:0,u=Date.now()-u.F;var k=l.B;g=us(),Oe(g,new Nn(g,p)),Go(l)}else dh(l);else if(k=u.s,k==3||k==0&&0<u.X||!(g==1&&A0(l,u)||g==2&&Vl(l)))switch(p&&0<p.length&&(u=l.h,u.i=u.i.concat(p)),k){case 1:Ks(l,5);break;case 4:Ks(l,10);break;case 3:Ks(l,6);break;default:Ks(l,2)}}}function fh(l,u){let p=l.Ta+Math.floor(Math.random()*l.cb);return l.isActive()||(p*=2),p*u}function Ks(l,u){if(l.j.info("Error code "+u),u==2){var p=f(l.fb,l),g=l.Xa;const k=!g;g=new js(g||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||zo(g,"https"),$o(g),k?w0(g.toString(),p):E0(g.toString(),p)}else Ve(2);l.G=0,l.l&&l.l.sa(u),ph(l),ah(l)}t.fb=function(l){l?(this.j.info("Successfully pinged google.com"),Ve(2)):(this.j.info("Failed to ping google.com"),Ve(1))};function ph(l){if(l.G=0,l.ka=[],l.l){const u=Wu(l.h);(u.length!=0||l.i.length!=0)&&(x(l.ka,u),x(l.ka,l.i),l.h.i.length=0,E(l.i),l.i.length=0),l.l.ra()}}function mh(l,u,p){var g=p instanceof js?On(p):new js(p);if(g.g!="")u&&(g.g=u+"."+g.g),Uo(g,g.s);else{var k=a.location;g=k.protocol,u=u?u+"."+k.hostname:k.hostname,k=+k.port;var M=new js(null);g&&zo(M,g),u&&(M.g=u),k&&Uo(M,k),p&&(M.l=p),g=M}return p=l.D,u=l.ya,p&&u&&Ae(g,p,u),Ae(g,"VER",l.la),Si(l,g),g}function gh(l,u,p){if(u&&!l.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=l.Ca&&!l.pa?new Be(new qo({eb:p})):new Be(l.pa),u.Ha(l.J),u}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function yh(){}t=yh.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function Ko(){}Ko.prototype.g=function(l,u){return new Ut(l,u)};function Ut(l,u){Ne.call(this),this.g=new oh(u),this.l=l,this.h=u&&u.messageUrlParams||null,l=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(l?l["X-Client-Protocol"]="webchannel":l={"X-Client-Protocol":"webchannel"}),this.g.o=l,l=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(l?l["X-WebChannel-Content-Type"]=u.messageContentType:l={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(l?l["X-WebChannel-Client-Profile"]=u.va:l={"X-WebChannel-Client-Profile":u.va}),this.g.S=l,(l=u&&u.Sb)&&!P(l)&&(this.g.m=l),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!P(u)&&(this.g.D=u,l=this.h,l!==null&&u in l&&(l=this.h,u in l&&delete l[u])),this.j=new Ar(this)}T(Ut,Ne),Ut.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Ut.prototype.close=function(){Fl(this.g)},Ut.prototype.o=function(l){var u=this.g;if(typeof l=="string"){var p={};p.__data__=l,l=p}else this.u&&(p={},p.__data__=zt(l),l=p);u.i.push(new d0(u.Ya++,l)),u.G==3&&Go(u)},Ut.prototype.N=function(){this.g.l=null,delete this.j,Fl(this.g),delete this.g,Ut.aa.N.call(this)};function vh(l){Gt.call(this),l.__headers__&&(this.headers=l.__headers__,this.statusCode=l.__status__,delete l.__headers__,delete l.__status__);var u=l.__sm__;if(u){e:{for(const p in u){l=p;break e}l=void 0}(this.i=l)&&(l=this.i,u=u!==null&&l in u?u[l]:void 0),this.data=u}else this.data=l}T(vh,Gt);function bh(){Ln.call(this),this.status=1}T(bh,Ln);function Ar(l){this.g=l}T(Ar,yh),Ar.prototype.ua=function(){Oe(this.g,"a")},Ar.prototype.ta=function(l){Oe(this.g,new vh(l))},Ar.prototype.sa=function(l){Oe(this.g,new bh)},Ar.prototype.ra=function(){Oe(this.g,"b")},Ko.prototype.createWebChannel=Ko.prototype.g,Ut.prototype.send=Ut.prototype.o,Ut.prototype.open=Ut.prototype.m,Ut.prototype.close=Ut.prototype.close,dm=function(){return new Ko},cm=function(){return us()},lm=ut,mc={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ws.NO_ERROR=0,Ws.TIMEOUT=8,Ws.HTTP_ERROR=6,ca=Ws,vi.COMPLETE="complete",am=vi,Tr.EventType=an,an.OPEN="a",an.CLOSE="b",an.ERROR="c",an.MESSAGE="d",Ne.prototype.listen=Ne.prototype.K,Ri=Tr,Be.prototype.listenOnce=Be.prototype.L,Be.prototype.getLastError=Be.prototype.Ka,Be.prototype.getLastErrorCode=Be.prototype.Ba,Be.prototype.getStatus=Be.prototype.Z,Be.prototype.getResponseJson=Be.prototype.Oa,Be.prototype.getResponseText=Be.prototype.oa,Be.prototype.send=Be.prototype.ea,Be.prototype.setWithCredentials=Be.prototype.Ha,om=Be}).apply(typeof Zo<"u"?Zo:typeof self<"u"?self:typeof window<"u"?window:{});const Xh="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}yt.UNAUTHENTICATED=new yt(null),yt.GOOGLE_CREDENTIALS=new yt("google-credentials-uid"),yt.FIRST_PARTY=new yt("first-party-uid"),yt.MOCK_USER=new yt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ii="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lr=new Zc("@firebase/firestore");function xi(){return lr.logLevel}function H(t,...e){if(lr.logLevel<=de.DEBUG){const n=e.map(fd);lr.debug(`Firestore (${ii}): ${t}`,...n)}}function Jn(t,...e){if(lr.logLevel<=de.ERROR){const n=e.map(fd);lr.error(`Firestore (${ii}): ${t}`,...n)}}function Wr(t,...e){if(lr.logLevel<=de.WARN){const n=e.map(fd);lr.warn(`Firestore (${ii}): ${t}`,...n)}}function fd(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function Z(t="Unexpected state"){const e=`FIRESTORE (${ii}) INTERNAL ASSERTION FAILED: `+t;throw Jn(e),new Error(e)}function Ee(t,e){t||Z()}function ne(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const L={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class $ extends ss{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class um{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class DE{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(yt.UNAUTHENTICATED))}shutdown(){}}class BE{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class LE{constructor(e){this.t=e,this.currentUser=yt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){Ee(this.o===void 0);let s=this.i;const r=c=>this.i!==s?(s=this.i,n(c)):Promise.resolve();let i=new Yn;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Yn,e.enqueueRetryable(()=>r(this.currentUser))};const o=()=>{const c=i;e.enqueueRetryable(async()=>{await c.promise,await r(this.currentUser)})},a=c=>{H("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>a(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?a(c):(H("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Yn)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(s=>this.i!==e?(H("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Ee(typeof s.accessToken=="string"),new um(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Ee(e===null||typeof e=="string"),new yt(e)}}class NE{constructor(e,n,s){this.l=e,this.h=n,this.P=s,this.type="FirstParty",this.user=yt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class OE{constructor(e,n,s){this.l=e,this.h=n,this.P=s}getToken(){return Promise.resolve(new NE(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(yt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class FE{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class VE{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){Ee(this.o===void 0);const s=i=>{i.error!=null&&H("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.R;return this.R=i.token,H("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>s(i))};const r=i=>{H("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>r(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?r(i):H("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(Ee(typeof n.token=="string"),this.R=n.token,new FE(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zE(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let s=0;s<t;s++)n[s]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hm{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const r=zE(40);for(let i=0;i<r.length;++i)s.length<20&&r[i]<n&&(s+=e.charAt(r[i]%e.length))}return s}}function ge(t,e){return t<e?-1:t>e?1:0}function Yr(t,e,n){return t.length===e.length&&t.every((s,r)=>n(s,e[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new $(L.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new $(L.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new $(L.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new $(L.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return We.fromMillis(Date.now())}static fromDate(e){return We.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*n));return new We(n,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ge(this.nanoseconds,e.nanoseconds):ge(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(e){this.timestamp=e}static fromTimestamp(e){return new te(e)}static min(){return new te(new We(0,0))}static max(){return new te(new We(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{constructor(e,n,s){n===void 0?n=0:n>e.length&&Z(),s===void 0?s=e.length-n:s>e.length-n&&Z(),this.segments=e,this.offset=n,this.len=s}get length(){return this.len}isEqual(e){return Qi.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof Qi?e.forEach(s=>{n.push(s)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,s=this.limit();n<s;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const s=Math.min(e.length,n.length);for(let r=0;r<s;r++){const i=e.get(r),o=n.get(r);if(i<o)return-1;if(i>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class ke extends Qi{construct(e,n,s){return new ke(e,n,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const s of e){if(s.indexOf("//")>=0)throw new $(L.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);n.push(...s.split("/").filter(r=>r.length>0))}return new ke(n)}static emptyPath(){return new ke([])}}const UE=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class rt extends Qi{construct(e,n,s){return new rt(e,n,s)}static isValidIdentifier(e){return UE.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),rt.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new rt(["__name__"])}static fromServerFormat(e){const n=[];let s="",r=0;const i=()=>{if(s.length===0)throw new $(L.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(s),s=""};let o=!1;for(;r<e.length;){const a=e[r];if(a==="\\"){if(r+1===e.length)throw new $(L.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[r+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new $(L.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=c,r+=2}else a==="`"?(o=!o,r++):a!=="."||o?(s+=a,r++):(i(),r++)}if(i(),o)throw new $(L.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new rt(n)}static emptyPath(){return new rt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.path=e}static fromPath(e){return new G(ke.fromString(e))}static fromName(e){return new G(ke.fromString(e).popFirst(5))}static empty(){return new G(ke.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ke.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return ke.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new G(new ke(e.slice()))}}function $E(t,e){const n=t.toTimestamp().seconds,s=t.toTimestamp().nanoseconds+1,r=te.fromTimestamp(s===1e9?new We(n+1,0):new We(n,s));return new Rs(r,G.empty(),e)}function qE(t){return new Rs(t.readTime,t.key,-1)}class Rs{constructor(e,n,s){this.readTime=e,this.documentKey=n,this.largestBatchId=s}static min(){return new Rs(te.min(),G.empty(),-1)}static max(){return new Rs(te.max(),G.empty(),-1)}}function HE(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=G.comparator(t.documentKey,e.documentKey),n!==0?n:ge(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WE="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class YE{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function To(t){if(t.code!==L.FAILED_PRECONDITION||t.message!==WE)throw t;H("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&Z(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new F((s,r)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(s,r)},this.catchCallback=i=>{this.wrapFailure(n,i).next(s,r)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof F?n:F.resolve(n)}catch(n){return F.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):F.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):F.reject(n)}static resolve(e){return new F((n,s)=>{n(e)})}static reject(e){return new F((n,s)=>{s(e)})}static waitFor(e){return new F((n,s)=>{let r=0,i=0,o=!1;e.forEach(a=>{++r,a.next(()=>{++i,o&&i===r&&n()},c=>s(c))}),o=!0,i===r&&n()})}static or(e){let n=F.resolve(!1);for(const s of e)n=n.next(r=>r?F.resolve(r):s());return n}static forEach(e,n){const s=[];return e.forEach((r,i)=>{s.push(n.call(this,r,i))}),this.waitFor(s)}static mapArray(e,n){return new F((s,r)=>{const i=e.length,o=new Array(i);let a=0;for(let c=0;c<i;c++){const d=c;n(e[d]).next(h=>{o[d]=h,++a,a===i&&s(o)},h=>r(h))}})}static doWhile(e,n){return new F((s,r)=>{const i=()=>{e()===!0?n().next(()=>{i()},r):s()};i()})}}function GE(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Io(t){return t.name==="IndexedDbTransactionError"}/**
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
 */class pd{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=s=>this.ie(s),this.se=s=>n.writeSequenceNumber(s))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}pd.oe=-1;function ja(t){return t==null}function Pa(t){return t===0&&1/t==-1/0}function jE(t){return typeof t=="number"&&Number.isInteger(t)&&!Pa(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zh(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function vr(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function fm(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{constructor(e,n){this.comparator=e,this.root=n||st.EMPTY}insert(e,n){return new Me(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,st.BLACK,null,null))}remove(e){return new Me(this.comparator,this.root.remove(e,this.comparator).copy(null,null,st.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return n.value;s<0?n=n.left:s>0&&(n=n.right)}return null}indexOf(e){let n=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return n+s.left.size;r<0?s=s.left:(n+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,s)=>(e(n,s),!1))}toString(){const e=[];return this.inorderTraversal((n,s)=>(e.push(`${n}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ea(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ea(this.root,e,this.comparator,!1)}getReverseIterator(){return new ea(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ea(this.root,e,this.comparator,!0)}}class ea{constructor(e,n,s,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?s(e.key,n):1,n&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class st{constructor(e,n,s,r,i){this.key=e,this.value=n,this.color=s??st.RED,this.left=r??st.EMPTY,this.right=i??st.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,s,r,i){return new st(e??this.key,n??this.value,s??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,s){let r=this;const i=s(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,n,s),null):i===0?r.copy(null,n,null,null,null):r.copy(null,null,null,null,r.right.insert(e,n,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return st.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let s,r=this;if(n(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),n(e,r.key)===0){if(r.right.isEmpty())return st.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,st.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,st.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Z();const e=this.left.check();if(e!==this.right.check())throw Z();return e+(this.isRed()?0:1)}}st.EMPTY=null,st.RED=!0,st.BLACK=!1;st.EMPTY=new class{constructor(){this.size=0}get key(){throw Z()}get value(){throw Z()}get color(){throw Z()}get left(){throw Z()}get right(){throw Z()}copy(e,n,s,r,i){return this}insert(e,n,s){return new st(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e){this.comparator=e,this.data=new Me(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,s)=>(e(n),!1))}forEachInRange(e,n){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;n(r.key)}}forEachWhile(e,n){let s;for(s=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new ef(this.data.getIterator())}getIteratorFrom(e){return new ef(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(s=>{n=n.add(s)}),n}isEqual(e){if(!(e instanceof it)||this.size!==e.size)return!1;const n=this.data.getIterator(),s=e.data.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new it(this.comparator);return n.data=e,n}}class ef{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(e){this.fields=e,e.sort(rt.comparator)}static empty(){return new qt([])}unionWith(e){let n=new it(rt.comparator);for(const s of this.fields)n=n.add(s);for(const s of e)n=n.add(s);return new qt(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Yr(this.fields,e.fields,(n,s)=>n.isEqual(s))}}/**
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
 */class pm extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(r){try{return atob(r)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new pm("Invalid base64 string: "+i):i}}(e);return new at(n)}static fromUint8Array(e){const n=function(r){let i="";for(let o=0;o<r.length;++o)i+=String.fromCharCode(r[o]);return i}(e);return new at(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ge(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}at.EMPTY_BYTE_STRING=new at("");const KE=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ms(t){if(Ee(!!t),typeof t=="string"){let e=0;const n=KE.exec(t);if(Ee(!!n),n[1]){let r=n[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(t);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:Le(t.seconds),nanos:Le(t.nanos)}}function Le(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function cr(t){return typeof t=="string"?at.fromBase64String(t):at.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function md(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function gd(t){const e=t.mapValue.fields.__previous_value__;return md(e)?gd(e):e}function Ji(t){const e=Ms(t.mapValue.fields.__local_write_time__.timestampValue);return new We(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QE{constructor(e,n,s,r,i,o,a,c,d){this.databaseId=e,this.appId=n,this.persistenceKey=s,this.host=r,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=c,this.useFetchStreams=d}}class Xi{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new Xi("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Xi&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ta={mapValue:{}};function dr(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?md(t)?4:XE(t)?9007199254740991:JE(t)?10:11:Z()}function Tn(t,e){if(t===e)return!0;const n=dr(t);if(n!==dr(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Ji(t).isEqual(Ji(e));case 3:return function(r,i){if(typeof r.timestampValue=="string"&&typeof i.timestampValue=="string"&&r.timestampValue.length===i.timestampValue.length)return r.timestampValue===i.timestampValue;const o=Ms(r.timestampValue),a=Ms(i.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(r,i){return cr(r.bytesValue).isEqual(cr(i.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(r,i){return Le(r.geoPointValue.latitude)===Le(i.geoPointValue.latitude)&&Le(r.geoPointValue.longitude)===Le(i.geoPointValue.longitude)}(t,e);case 2:return function(r,i){if("integerValue"in r&&"integerValue"in i)return Le(r.integerValue)===Le(i.integerValue);if("doubleValue"in r&&"doubleValue"in i){const o=Le(r.doubleValue),a=Le(i.doubleValue);return o===a?Pa(o)===Pa(a):isNaN(o)&&isNaN(a)}return!1}(t,e);case 9:return Yr(t.arrayValue.values||[],e.arrayValue.values||[],Tn);case 10:case 11:return function(r,i){const o=r.mapValue.fields||{},a=i.mapValue.fields||{};if(Zh(o)!==Zh(a))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(a[c]===void 0||!Tn(o[c],a[c])))return!1;return!0}(t,e);default:return Z()}}function Zi(t,e){return(t.values||[]).find(n=>Tn(n,e))!==void 0}function Gr(t,e){if(t===e)return 0;const n=dr(t),s=dr(e);if(n!==s)return ge(n,s);switch(n){case 0:case 9007199254740991:return 0;case 1:return ge(t.booleanValue,e.booleanValue);case 2:return function(i,o){const a=Le(i.integerValue||i.doubleValue),c=Le(o.integerValue||o.doubleValue);return a<c?-1:a>c?1:a===c?0:isNaN(a)?isNaN(c)?0:-1:1}(t,e);case 3:return tf(t.timestampValue,e.timestampValue);case 4:return tf(Ji(t),Ji(e));case 5:return ge(t.stringValue,e.stringValue);case 6:return function(i,o){const a=cr(i),c=cr(o);return a.compareTo(c)}(t.bytesValue,e.bytesValue);case 7:return function(i,o){const a=i.split("/"),c=o.split("/");for(let d=0;d<a.length&&d<c.length;d++){const h=ge(a[d],c[d]);if(h!==0)return h}return ge(a.length,c.length)}(t.referenceValue,e.referenceValue);case 8:return function(i,o){const a=ge(Le(i.latitude),Le(o.latitude));return a!==0?a:ge(Le(i.longitude),Le(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return nf(t.arrayValue,e.arrayValue);case 10:return function(i,o){var a,c,d,h;const m=i.fields||{},f=o.fields||{},y=(a=m.value)===null||a===void 0?void 0:a.arrayValue,T=(c=f.value)===null||c===void 0?void 0:c.arrayValue,E=ge(((d=y==null?void 0:y.values)===null||d===void 0?void 0:d.length)||0,((h=T==null?void 0:T.values)===null||h===void 0?void 0:h.length)||0);return E!==0?E:nf(y,T)}(t.mapValue,e.mapValue);case 11:return function(i,o){if(i===ta.mapValue&&o===ta.mapValue)return 0;if(i===ta.mapValue)return 1;if(o===ta.mapValue)return-1;const a=i.fields||{},c=Object.keys(a),d=o.fields||{},h=Object.keys(d);c.sort(),h.sort();for(let m=0;m<c.length&&m<h.length;++m){const f=ge(c[m],h[m]);if(f!==0)return f;const y=Gr(a[c[m]],d[h[m]]);if(y!==0)return y}return ge(c.length,h.length)}(t.mapValue,e.mapValue);default:throw Z()}}function tf(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return ge(t,e);const n=Ms(t),s=Ms(e),r=ge(n.seconds,s.seconds);return r!==0?r:ge(n.nanos,s.nanos)}function nf(t,e){const n=t.values||[],s=e.values||[];for(let r=0;r<n.length&&r<s.length;++r){const i=Gr(n[r],s[r]);if(i)return i}return ge(n.length,s.length)}function jr(t){return gc(t)}function gc(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const s=Ms(n);return`time(${s.seconds},${s.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return cr(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return G.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let s="[",r=!0;for(const i of n.values||[])r?r=!1:s+=",",s+=gc(i);return s+"]"}(t.arrayValue):"mapValue"in t?function(n){const s=Object.keys(n.fields||{}).sort();let r="{",i=!0;for(const o of s)i?i=!1:r+=",",r+=`${o}:${gc(n.fields[o])}`;return r+"}"}(t.mapValue):Z()}function sf(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function yc(t){return!!t&&"integerValue"in t}function yd(t){return!!t&&"arrayValue"in t}function rf(t){return!!t&&"nullValue"in t}function of(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function da(t){return!!t&&"mapValue"in t}function JE(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function Vi(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return vr(t.mapValue.fields,(n,s)=>e.mapValue.fields[n]=Vi(s)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Vi(t.arrayValue.values[n]);return e}return Object.assign({},t)}function XE(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(e){this.value=e}static empty(){return new Ot({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let s=0;s<e.length-1;++s)if(n=(n.mapValue.fields||{})[e.get(s)],!da(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Vi(n)}setAll(e){let n=rt.emptyPath(),s={},r=[];e.forEach((o,a)=>{if(!n.isImmediateParentOf(a)){const c=this.getFieldsMap(n);this.applyChanges(c,s,r),s={},r=[],n=a.popLast()}o?s[a.lastSegment()]=Vi(o):r.push(a.lastSegment())});const i=this.getFieldsMap(n);this.applyChanges(i,s,r)}delete(e){const n=this.field(e.popLast());da(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Tn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=n.mapValue.fields[e.get(s)];da(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},n.mapValue.fields[e.get(s)]=r),n=r}return n.mapValue.fields}applyChanges(e,n,s){vr(n,(r,i)=>e[r]=i);for(const r of s)delete e[r]}clone(){return new Ot(Vi(this.value))}}function mm(t){const e=[];return vr(t.fields,(n,s)=>{const r=new rt([n]);if(da(s)){const i=mm(s.mapValue).fields;if(i.length===0)e.push(r);else for(const o of i)e.push(r.child(o))}else e.push(r)}),new qt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(e,n,s,r,i,o,a){this.key=e,this.documentType=n,this.version=s,this.readTime=r,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(e){return new vt(e,0,te.min(),te.min(),te.min(),Ot.empty(),0)}static newFoundDocument(e,n,s,r){return new vt(e,1,n,te.min(),s,r,0)}static newNoDocument(e,n){return new vt(e,2,n,te.min(),te.min(),Ot.empty(),0)}static newUnknownDocument(e,n){return new vt(e,3,n,te.min(),te.min(),Ot.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(te.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ot.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ot.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=te.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof vt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new vt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Ra{constructor(e,n){this.position=e,this.inclusive=n}}function af(t,e,n){let s=0;for(let r=0;r<t.position.length;r++){const i=e[r],o=t.position[r];if(i.field.isKeyField()?s=G.comparator(G.fromName(o.referenceValue),n.key):s=Gr(o,n.data.field(i.field)),i.dir==="desc"&&(s*=-1),s!==0)break}return s}function lf(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!Tn(t.position[n],e.position[n]))return!1;return!0}/**
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
 */class eo{constructor(e,n="asc"){this.field=e,this.dir=n}}function ZE(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
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
 */class gm{}class Ue extends gm{constructor(e,n,s){super(),this.field=e,this.op=n,this.value=s}static create(e,n,s){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,s):new t_(e,n,s):n==="array-contains"?new r_(e,s):n==="in"?new i_(e,s):n==="not-in"?new o_(e,s):n==="array-contains-any"?new a_(e,s):new Ue(e,n,s)}static createKeyFieldInFilter(e,n,s){return n==="in"?new n_(e,s):new s_(e,s)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Gr(n,this.value)):n!==null&&dr(this.value)===dr(n)&&this.matchesComparison(Gr(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Z()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class pn extends gm{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new pn(e,n)}matches(e){return ym(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function ym(t){return t.op==="and"}function vm(t){return e_(t)&&ym(t)}function e_(t){for(const e of t.filters)if(e instanceof pn)return!1;return!0}function vc(t){if(t instanceof Ue)return t.field.canonicalString()+t.op.toString()+jr(t.value);if(vm(t))return t.filters.map(e=>vc(e)).join(",");{const e=t.filters.map(n=>vc(n)).join(",");return`${t.op}(${e})`}}function bm(t,e){return t instanceof Ue?function(s,r){return r instanceof Ue&&s.op===r.op&&s.field.isEqual(r.field)&&Tn(s.value,r.value)}(t,e):t instanceof pn?function(s,r){return r instanceof pn&&s.op===r.op&&s.filters.length===r.filters.length?s.filters.reduce((i,o,a)=>i&&bm(o,r.filters[a]),!0):!1}(t,e):void Z()}function wm(t){return t instanceof Ue?function(n){return`${n.field.canonicalString()} ${n.op} ${jr(n.value)}`}(t):t instanceof pn?function(n){return n.op.toString()+" {"+n.getFilters().map(wm).join(" ,")+"}"}(t):"Filter"}class t_ extends Ue{constructor(e,n,s){super(e,n,s),this.key=G.fromName(s.referenceValue)}matches(e){const n=G.comparator(e.key,this.key);return this.matchesComparison(n)}}class n_ extends Ue{constructor(e,n){super(e,"in",n),this.keys=Em("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class s_ extends Ue{constructor(e,n){super(e,"not-in",n),this.keys=Em("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function Em(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(s=>G.fromName(s.referenceValue))}class r_ extends Ue{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return yd(n)&&Zi(n.arrayValue,this.value)}}class i_ extends Ue{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&Zi(this.value.arrayValue,n)}}class o_ extends Ue{constructor(e,n){super(e,"not-in",n)}matches(e){if(Zi(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!Zi(this.value.arrayValue,n)}}class a_ extends Ue{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!yd(n)||!n.arrayValue.values)&&n.arrayValue.values.some(s=>Zi(this.value.arrayValue,s))}}/**
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
 */class l_{constructor(e,n=null,s=[],r=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=n,this.orderBy=s,this.filters=r,this.limit=i,this.startAt=o,this.endAt=a,this.ue=null}}function cf(t,e=null,n=[],s=[],r=null,i=null,o=null){return new l_(t,e,n,s,r,i,o)}function vd(t){const e=ne(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(s=>vc(s)).join(","),n+="|ob:",n+=e.orderBy.map(s=>function(i){return i.field.canonicalString()+i.dir}(s)).join(","),ja(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(s=>jr(s)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(s=>jr(s)).join(",")),e.ue=n}return e.ue}function bd(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!ZE(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!bm(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!lf(t.startAt,e.startAt)&&lf(t.endAt,e.endAt)}function bc(t){return G.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oi{constructor(e,n=null,s=[],r=[],i=null,o="F",a=null,c=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=s,this.filters=r,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function c_(t,e,n,s,r,i,o,a){return new oi(t,e,n,s,r,i,o,a)}function wd(t){return new oi(t)}function df(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function _m(t){return t.collectionGroup!==null}function zi(t){const e=ne(t);if(e.ce===null){e.ce=[];const n=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),n.add(i.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new it(rt.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(a=a.add(d.field))})}),a})(e).forEach(i=>{n.has(i.canonicalString())||i.isKeyField()||e.ce.push(new eo(i,s))}),n.has(rt.keyField().canonicalString())||e.ce.push(new eo(rt.keyField(),s))}return e.ce}function wn(t){const e=ne(t);return e.le||(e.le=d_(e,zi(t))),e.le}function d_(t,e){if(t.limitType==="F")return cf(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(r=>{const i=r.dir==="desc"?"asc":"desc";return new eo(r.field,i)});const n=t.endAt?new Ra(t.endAt.position,t.endAt.inclusive):null,s=t.startAt?new Ra(t.startAt.position,t.startAt.inclusive):null;return cf(t.path,t.collectionGroup,e,t.filters,t.limit,n,s)}}function wc(t,e){const n=t.filters.concat([e]);return new oi(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function Ma(t,e,n){return new oi(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function Ka(t,e){return bd(wn(t),wn(e))&&t.limitType===e.limitType}function Tm(t){return`${vd(wn(t))}|lt:${t.limitType}`}function Rr(t){return`Query(target=${function(n){let s=n.path.canonicalString();return n.collectionGroup!==null&&(s+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(s+=`, filters: [${n.filters.map(r=>wm(r)).join(", ")}]`),ja(n.limit)||(s+=", limit: "+n.limit),n.orderBy.length>0&&(s+=`, orderBy: [${n.orderBy.map(r=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(r)).join(", ")}]`),n.startAt&&(s+=", startAt: ",s+=n.startAt.inclusive?"b:":"a:",s+=n.startAt.position.map(r=>jr(r)).join(",")),n.endAt&&(s+=", endAt: ",s+=n.endAt.inclusive?"a:":"b:",s+=n.endAt.position.map(r=>jr(r)).join(",")),`Target(${s})`}(wn(t))}; limitType=${t.limitType})`}function Qa(t,e){return e.isFoundDocument()&&function(s,r){const i=r.key.path;return s.collectionGroup!==null?r.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(i):G.isDocumentKey(s.path)?s.path.isEqual(i):s.path.isImmediateParentOf(i)}(t,e)&&function(s,r){for(const i of zi(s))if(!i.field.isKeyField()&&r.data.field(i.field)===null)return!1;return!0}(t,e)&&function(s,r){for(const i of s.filters)if(!i.matches(r))return!1;return!0}(t,e)&&function(s,r){return!(s.startAt&&!function(o,a,c){const d=af(o,a,c);return o.inclusive?d<=0:d<0}(s.startAt,zi(s),r)||s.endAt&&!function(o,a,c){const d=af(o,a,c);return o.inclusive?d>=0:d>0}(s.endAt,zi(s),r))}(t,e)}function u_(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function Im(t){return(e,n)=>{let s=!1;for(const r of zi(t)){const i=h_(r,e,n);if(i!==0)return i;s=s||r.field.isKeyField()}return 0}}function h_(t,e,n){const s=t.field.isKeyField()?G.comparator(e.key,n.key):function(i,o,a){const c=o.data.field(i),d=a.data.field(i);return c!==null&&d!==null?Gr(c,d):Z()}(t.field,e,n);switch(t.dir){case"asc":return s;case"desc":return-1*s;default:return Z()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ai{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s!==void 0){for(const[r,i]of s)if(this.equalsFn(r,e))return i}}has(e){return this.get(e)!==void 0}set(e,n){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,n]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,n]);r.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[n]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){vr(this.inner,(n,s)=>{for(const[r,i]of s)e(r,i)})}isEmpty(){return fm(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f_=new Me(G.comparator);function Xn(){return f_}const Sm=new Me(G.comparator);function Mi(...t){let e=Sm;for(const n of t)e=e.insert(n.key,n);return e}function xm(t){let e=Sm;return t.forEach((n,s)=>e=e.insert(n,s.overlayedDocument)),e}function Zs(){return Ui()}function Am(){return Ui()}function Ui(){return new ai(t=>t.toString(),(t,e)=>t.isEqual(e))}const p_=new Me(G.comparator),m_=new it(G.comparator);function le(...t){let e=m_;for(const n of t)e=e.add(n);return e}const g_=new it(ge);function y_(){return g_}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ed(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Pa(e)?"-0":e}}function km(t){return{integerValue:""+t}}function v_(t,e){return jE(e)?km(e):Ed(t,e)}/**
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
 */class Ja{constructor(){this._=void 0}}function b_(t,e,n){return t instanceof to?function(r,i){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return i&&md(i)&&(i=gd(i)),i&&(o.fields.__previous_value__=i),{mapValue:o}}(n,e):t instanceof no?Pm(t,e):t instanceof so?Rm(t,e):function(r,i){const o=Cm(r,i),a=uf(o)+uf(r.Pe);return yc(o)&&yc(r.Pe)?km(a):Ed(r.serializer,a)}(t,e)}function w_(t,e,n){return t instanceof no?Pm(t,e):t instanceof so?Rm(t,e):n}function Cm(t,e){return t instanceof Da?function(s){return yc(s)||function(i){return!!i&&"doubleValue"in i}(s)}(e)?e:{integerValue:0}:null}class to extends Ja{}class no extends Ja{constructor(e){super(),this.elements=e}}function Pm(t,e){const n=Mm(e);for(const s of t.elements)n.some(r=>Tn(r,s))||n.push(s);return{arrayValue:{values:n}}}class so extends Ja{constructor(e){super(),this.elements=e}}function Rm(t,e){let n=Mm(e);for(const s of t.elements)n=n.filter(r=>!Tn(r,s));return{arrayValue:{values:n}}}class Da extends Ja{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function uf(t){return Le(t.integerValue||t.doubleValue)}function Mm(t){return yd(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E_{constructor(e,n){this.field=e,this.transform=n}}function __(t,e){return t.field.isEqual(e.field)&&function(s,r){return s instanceof no&&r instanceof no||s instanceof so&&r instanceof so?Yr(s.elements,r.elements,Tn):s instanceof Da&&r instanceof Da?Tn(s.Pe,r.Pe):s instanceof to&&r instanceof to}(t.transform,e.transform)}class T_{constructor(e,n){this.version=e,this.transformResults=n}}class Mt{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new Mt}static exists(e){return new Mt(void 0,e)}static updateTime(e){return new Mt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ua(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class Xa{}function Dm(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new Za(t.key,Mt.none()):new So(t.key,t.data,Mt.none());{const n=t.data,s=Ot.empty();let r=new it(rt.comparator);for(let i of e.fields)if(!r.has(i)){let o=n.field(i);o===null&&i.length>1&&(i=i.popLast(),o=n.field(i)),o===null?s.delete(i):s.set(i,o),r=r.add(i)}return new Ns(t.key,s,new qt(r.toArray()),Mt.none())}}function I_(t,e,n){t instanceof So?function(r,i,o){const a=r.value.clone(),c=ff(r.fieldTransforms,i,o.transformResults);a.setAll(c),i.convertToFoundDocument(o.version,a).setHasCommittedMutations()}(t,e,n):t instanceof Ns?function(r,i,o){if(!ua(r.precondition,i))return void i.convertToUnknownDocument(o.version);const a=ff(r.fieldTransforms,i,o.transformResults),c=i.data;c.setAll(Bm(r)),c.setAll(a),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(t,e,n):function(r,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function $i(t,e,n,s){return t instanceof So?function(i,o,a,c){if(!ua(i.precondition,o))return a;const d=i.value.clone(),h=pf(i.fieldTransforms,c,o);return d.setAll(h),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),null}(t,e,n,s):t instanceof Ns?function(i,o,a,c){if(!ua(i.precondition,o))return a;const d=pf(i.fieldTransforms,c,o),h=o.data;return h.setAll(Bm(i)),h.setAll(d),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),a===null?null:a.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(t,e,n,s):function(i,o,a){return ua(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a}(t,e,n)}function S_(t,e){let n=null;for(const s of t.fieldTransforms){const r=e.data.field(s.field),i=Cm(s.transform,r||null);i!=null&&(n===null&&(n=Ot.empty()),n.set(s.field,i))}return n||null}function hf(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(s,r){return s===void 0&&r===void 0||!(!s||!r)&&Yr(s,r,(i,o)=>__(i,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class So extends Xa{constructor(e,n,s,r=[]){super(),this.key=e,this.value=n,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class Ns extends Xa{constructor(e,n,s,r,i=[]){super(),this.key=e,this.data=n,this.fieldMask=s,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Bm(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const s=t.data.field(n);e.set(n,s)}}),e}function ff(t,e,n){const s=new Map;Ee(t.length===n.length);for(let r=0;r<n.length;r++){const i=t[r],o=i.transform,a=e.data.field(i.field);s.set(i.field,w_(o,a,n[r]))}return s}function pf(t,e,n){const s=new Map;for(const r of t){const i=r.transform,o=n.data.field(r.field);s.set(r.field,b_(i,o,e))}return s}class Za extends Xa{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class x_ extends Xa{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A_{constructor(e,n,s,r){this.batchId=e,this.localWriteTime=n,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,n){const s=n.mutationResults;for(let r=0;r<this.mutations.length;r++){const i=this.mutations[r];i.key.isEqual(e.key)&&I_(i,e,s[r])}}applyToLocalView(e,n){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(n=$i(s,e,n,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(n=$i(s,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const s=Am();return this.mutations.forEach(r=>{const i=e.get(r.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=n.has(r.key)?null:a;const c=Dm(o,a);c!==null&&s.set(r.key,c),o.isValidDocument()||o.convertToNoDocument(te.min())}),s}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),le())}isEqual(e){return this.batchId===e.batchId&&Yr(this.mutations,e.mutations,(n,s)=>hf(n,s))&&Yr(this.baseMutations,e.baseMutations,(n,s)=>hf(n,s))}}class _d{constructor(e,n,s,r){this.batch=e,this.commitVersion=n,this.mutationResults=s,this.docVersions=r}static from(e,n,s){Ee(e.mutations.length===s.length);let r=function(){return p_}();const i=e.mutations;for(let o=0;o<i.length;o++)r=r.insert(i[o].key,s[o].version);return new _d(e,n,s,r)}}/**
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
 */class k_{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class C_{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ze,ue;function P_(t){switch(t){default:return Z();case L.CANCELLED:case L.UNKNOWN:case L.DEADLINE_EXCEEDED:case L.RESOURCE_EXHAUSTED:case L.INTERNAL:case L.UNAVAILABLE:case L.UNAUTHENTICATED:return!1;case L.INVALID_ARGUMENT:case L.NOT_FOUND:case L.ALREADY_EXISTS:case L.PERMISSION_DENIED:case L.FAILED_PRECONDITION:case L.ABORTED:case L.OUT_OF_RANGE:case L.UNIMPLEMENTED:case L.DATA_LOSS:return!0}}function Lm(t){if(t===void 0)return Jn("GRPC error has no .code"),L.UNKNOWN;switch(t){case ze.OK:return L.OK;case ze.CANCELLED:return L.CANCELLED;case ze.UNKNOWN:return L.UNKNOWN;case ze.DEADLINE_EXCEEDED:return L.DEADLINE_EXCEEDED;case ze.RESOURCE_EXHAUSTED:return L.RESOURCE_EXHAUSTED;case ze.INTERNAL:return L.INTERNAL;case ze.UNAVAILABLE:return L.UNAVAILABLE;case ze.UNAUTHENTICATED:return L.UNAUTHENTICATED;case ze.INVALID_ARGUMENT:return L.INVALID_ARGUMENT;case ze.NOT_FOUND:return L.NOT_FOUND;case ze.ALREADY_EXISTS:return L.ALREADY_EXISTS;case ze.PERMISSION_DENIED:return L.PERMISSION_DENIED;case ze.FAILED_PRECONDITION:return L.FAILED_PRECONDITION;case ze.ABORTED:return L.ABORTED;case ze.OUT_OF_RANGE:return L.OUT_OF_RANGE;case ze.UNIMPLEMENTED:return L.UNIMPLEMENTED;case ze.DATA_LOSS:return L.DATA_LOSS;default:return Z()}}(ue=ze||(ze={}))[ue.OK=0]="OK",ue[ue.CANCELLED=1]="CANCELLED",ue[ue.UNKNOWN=2]="UNKNOWN",ue[ue.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ue[ue.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ue[ue.NOT_FOUND=5]="NOT_FOUND",ue[ue.ALREADY_EXISTS=6]="ALREADY_EXISTS",ue[ue.PERMISSION_DENIED=7]="PERMISSION_DENIED",ue[ue.UNAUTHENTICATED=16]="UNAUTHENTICATED",ue[ue.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ue[ue.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ue[ue.ABORTED=10]="ABORTED",ue[ue.OUT_OF_RANGE=11]="OUT_OF_RANGE",ue[ue.UNIMPLEMENTED=12]="UNIMPLEMENTED",ue[ue.INTERNAL=13]="INTERNAL",ue[ue.UNAVAILABLE=14]="UNAVAILABLE",ue[ue.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function R_(){return new TextEncoder}/**
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
 */const M_=new nr([4294967295,4294967295],0);function mf(t){const e=R_().encode(t),n=new im;return n.update(e),new Uint8Array(n.digest())}function gf(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),s=e.getUint32(4,!0),r=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new nr([n,s],0),new nr([r,i],0)]}class Td{constructor(e,n,s){if(this.bitmap=e,this.padding=n,this.hashCount=s,n<0||n>=8)throw new Di(`Invalid padding: ${n}`);if(s<0)throw new Di(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Di(`Invalid hash count: ${s}`);if(e.length===0&&n!==0)throw new Di(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=nr.fromNumber(this.Ie)}Ee(e,n,s){let r=e.add(n.multiply(nr.fromNumber(s)));return r.compare(M_)===1&&(r=new nr([r.getBits(0),r.getBits(1)],0)),r.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=mf(e),[s,r]=gf(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(s,r,i);if(!this.de(o))return!1}return!0}static create(e,n,s){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Td(i,r,n);return s.forEach(a=>o.insert(a)),o}insert(e){if(this.Ie===0)return;const n=mf(e),[s,r]=gf(n);for(let i=0;i<this.hashCount;i++){const o=this.Ee(s,r,i);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),s=e%8;this.bitmap[n]|=1<<s}}class Di extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class el{constructor(e,n,s,r,i){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,n,s){const r=new Map;return r.set(e,xo.createSynthesizedTargetChangeForCurrentChange(e,n,s)),new el(te.min(),r,new Me(ge),Xn(),le())}}class xo{constructor(e,n,s,r,i){this.resumeToken=e,this.current=n,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,n,s){return new xo(s,n,le(),le(),le())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ha{constructor(e,n,s,r){this.Re=e,this.removedTargetIds=n,this.key=s,this.Ve=r}}class Nm{constructor(e,n){this.targetId=e,this.me=n}}class Om{constructor(e,n,s=at.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=n,this.resumeToken=s,this.cause=r}}class yf{constructor(){this.fe=0,this.ge=bf(),this.pe=at.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=le(),n=le(),s=le();return this.ge.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:n=n.add(r);break;case 1:s=s.add(r);break;default:Z()}}),new xo(this.pe,this.ye,e,n,s)}Ce(){this.we=!1,this.ge=bf()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,Ee(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class D_{constructor(e){this.Le=e,this.Be=new Map,this.ke=Xn(),this.qe=vf(),this.Qe=new Me(ge)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const s=this.Ge(n);switch(e.state){case 0:this.ze(n)&&s.De(e.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(e.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(s.Ne(),s.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),s.De(e.resumeToken));break;default:Z()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((s,r)=>{this.ze(r)&&n(r)})}He(e){const n=e.targetId,s=e.me.count,r=this.Je(n);if(r){const i=r.target;if(bc(i))if(s===0){const o=new G(i.path);this.Ue(n,o,vt.newNoDocument(o,te.min()))}else Ee(s===1);else{const o=this.Ye(n);if(o!==s){const a=this.Ze(e),c=a?this.Xe(a,e,o):1;if(c!==0){this.je(n);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,d)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:s="",padding:r=0},hashCount:i=0}=n;let o,a;try{o=cr(s).toUint8Array()}catch(c){if(c instanceof pm)return Wr("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{a=new Td(o,r,i)}catch(c){return Wr(c instanceof Di?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return a.Ie===0?null:a}Xe(e,n,s){return n.me.count===s-this.nt(e,n.targetId)?0:2}nt(e,n){const s=this.Le.getRemoteKeysForTarget(n);let r=0;return s.forEach(i=>{const o=this.Le.tt(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(a)||(this.Ue(n,i,null),r++)}),r}rt(e){const n=new Map;this.Be.forEach((i,o)=>{const a=this.Je(o);if(a){if(i.current&&bc(a.target)){const c=new G(a.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,vt.newNoDocument(c,e))}i.be&&(n.set(o,i.ve()),i.Ce())}});let s=le();this.qe.forEach((i,o)=>{let a=!0;o.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)}),a&&(s=s.add(i))}),this.ke.forEach((i,o)=>o.setReadTime(e));const r=new el(e,n,this.Qe,this.ke,s);return this.ke=Xn(),this.qe=vf(),this.Qe=new Me(ge),r}$e(e,n){if(!this.ze(e))return;const s=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,s),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,s){if(!this.ze(e))return;const r=this.Ge(e);this.it(e,n)?r.Fe(n,1):r.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),s&&(this.ke=this.ke.insert(n,s))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new yf,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new it(ge),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||H("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new yf),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function vf(){return new Me(G.comparator)}function bf(){return new Me(G.comparator)}const B_={asc:"ASCENDING",desc:"DESCENDING"},L_={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},N_={and:"AND",or:"OR"};class O_{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Ec(t,e){return t.useProto3Json||ja(e)?e:{value:e}}function Ba(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Fm(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function F_(t,e){return Ba(t,e.toTimestamp())}function En(t){return Ee(!!t),te.fromTimestamp(function(n){const s=Ms(n);return new We(s.seconds,s.nanos)}(t))}function Id(t,e){return _c(t,e).canonicalString()}function _c(t,e){const n=function(r){return new ke(["projects",r.projectId,"databases",r.database])}(t).child("documents");return e===void 0?n:n.child(e)}function Vm(t){const e=ke.fromString(t);return Ee(Hm(e)),e}function Tc(t,e){return Id(t.databaseId,e.path)}function Ql(t,e){const n=Vm(e);if(n.get(1)!==t.databaseId.projectId)throw new $(L.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new $(L.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new G(Um(n))}function zm(t,e){return Id(t.databaseId,e)}function V_(t){const e=Vm(t);return e.length===4?ke.emptyPath():Um(e)}function Ic(t){return new ke(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function Um(t){return Ee(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function wf(t,e,n){return{name:Tc(t,e),fields:n.value.mapValue.fields}}function z_(t,e){let n;if("targetChange"in e){e.targetChange;const s=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:Z()}(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],i=function(d,h){return d.useProto3Json?(Ee(h===void 0||typeof h=="string"),at.fromBase64String(h||"")):(Ee(h===void 0||h instanceof Buffer||h instanceof Uint8Array),at.fromUint8Array(h||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(d){const h=d.code===void 0?L.UNKNOWN:Lm(d.code);return new $(h,d.message||"")}(o);n=new Om(s,r,i,a||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=Ql(t,s.document.name),i=En(s.document.updateTime),o=s.document.createTime?En(s.document.createTime):te.min(),a=new Ot({mapValue:{fields:s.document.fields}}),c=vt.newFoundDocument(r,i,o,a),d=s.targetIds||[],h=s.removedTargetIds||[];n=new ha(d,h,c.key,c)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=Ql(t,s.document),i=s.readTime?En(s.readTime):te.min(),o=vt.newNoDocument(r,i),a=s.removedTargetIds||[];n=new ha([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=Ql(t,s.document),i=s.removedTargetIds||[];n=new ha([],i,r,null)}else{if(!("filter"in e))return Z();{e.filter;const s=e.filter;s.targetId;const{count:r=0,unchangedNames:i}=s,o=new C_(r,i),a=s.targetId;n=new Nm(a,o)}}return n}function U_(t,e){let n;if(e instanceof So)n={update:wf(t,e.key,e.value)};else if(e instanceof Za)n={delete:Tc(t,e.key)};else if(e instanceof Ns)n={update:wf(t,e.key,e.data),updateMask:Q_(e.fieldMask)};else{if(!(e instanceof x_))return Z();n={verify:Tc(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(s=>function(i,o){const a=o.transform;if(a instanceof to)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof no)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof so)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof Da)return{fieldPath:o.field.canonicalString(),increment:a.Pe};throw Z()}(0,s))),e.precondition.isNone||(n.currentDocument=function(r,i){return i.updateTime!==void 0?{updateTime:F_(r,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Z()}(t,e.precondition)),n}function $_(t,e){return t&&t.length>0?(Ee(e!==void 0),t.map(n=>function(r,i){let o=r.updateTime?En(r.updateTime):En(i);return o.isEqual(te.min())&&(o=En(i)),new T_(o,r.transformResults||[])}(n,e))):[]}function q_(t,e){return{documents:[zm(t,e.path)]}}function H_(t,e){const n={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),n.structuredQuery.from=[{collectionId:s.lastSegment()}]),n.parent=zm(t,r);const i=function(d){if(d.length!==0)return qm(pn.create(d,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(d){if(d.length!==0)return d.map(h=>function(f){return{field:Mr(f.field),direction:G_(f.dir)}}(h))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const a=Ec(t,e.limit);return a!==null&&(n.structuredQuery.limit=a),e.startAt&&(n.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:n,parent:r}}function W_(t){let e=V_(t.parent);const n=t.structuredQuery,s=n.from?n.from.length:0;let r=null;if(s>0){Ee(s===1);const h=n.from[0];h.allDescendants?r=h.collectionId:e=e.child(h.collectionId)}let i=[];n.where&&(i=function(m){const f=$m(m);return f instanceof pn&&vm(f)?f.getFilters():[f]}(n.where));let o=[];n.orderBy&&(o=function(m){return m.map(f=>function(T){return new eo(Dr(T.field),function(x){switch(x){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(T.direction))}(f))}(n.orderBy));let a=null;n.limit&&(a=function(m){let f;return f=typeof m=="object"?m.value:m,ja(f)?null:f}(n.limit));let c=null;n.startAt&&(c=function(m){const f=!!m.before,y=m.values||[];return new Ra(y,f)}(n.startAt));let d=null;return n.endAt&&(d=function(m){const f=!m.before,y=m.values||[];return new Ra(y,f)}(n.endAt)),c_(e,r,o,i,a,"F",c,d)}function Y_(t,e){const n=function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Z()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function $m(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const s=Dr(n.unaryFilter.field);return Ue.create(s,"==",{doubleValue:NaN});case"IS_NULL":const r=Dr(n.unaryFilter.field);return Ue.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Dr(n.unaryFilter.field);return Ue.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Dr(n.unaryFilter.field);return Ue.create(o,"!=",{nullValue:"NULL_VALUE"});default:return Z()}}(t):t.fieldFilter!==void 0?function(n){return Ue.create(Dr(n.fieldFilter.field),function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Z()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return pn.create(n.compositeFilter.filters.map(s=>$m(s)),function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return Z()}}(n.compositeFilter.op))}(t):Z()}function G_(t){return B_[t]}function j_(t){return L_[t]}function K_(t){return N_[t]}function Mr(t){return{fieldPath:t.canonicalString()}}function Dr(t){return rt.fromServerFormat(t.fieldPath)}function qm(t){return t instanceof Ue?function(n){if(n.op==="=="){if(of(n.value))return{unaryFilter:{field:Mr(n.field),op:"IS_NAN"}};if(rf(n.value))return{unaryFilter:{field:Mr(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(of(n.value))return{unaryFilter:{field:Mr(n.field),op:"IS_NOT_NAN"}};if(rf(n.value))return{unaryFilter:{field:Mr(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Mr(n.field),op:j_(n.op),value:n.value}}}(t):t instanceof pn?function(n){const s=n.getFilters().map(r=>qm(r));return s.length===1?s[0]:{compositeFilter:{op:K_(n.op),filters:s}}}(t):Z()}function Q_(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function Hm(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s{constructor(e,n,s,r,i=te.min(),o=te.min(),a=at.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=n,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=c}withSequenceNumber(e){return new _s(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new _s(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new _s(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new _s(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J_{constructor(e){this.ct=e}}function X_(t){const e=W_({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?Ma(e,e.limit,"L"):e}/**
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
 */class Z_{constructor(){this.un=new eT}addToCollectionParentIndex(e,n){return this.un.add(n),F.resolve()}getCollectionParents(e,n){return F.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return F.resolve()}deleteFieldIndex(e,n){return F.resolve()}deleteAllFieldIndexes(e){return F.resolve()}createTargetIndexes(e,n){return F.resolve()}getDocumentsMatchingTarget(e,n){return F.resolve(null)}getIndexType(e,n){return F.resolve(0)}getFieldIndexes(e,n){return F.resolve([])}getNextCollectionGroupToUpdate(e){return F.resolve(null)}getMinOffset(e,n){return F.resolve(Rs.min())}getMinOffsetFromCollectionGroup(e,n){return F.resolve(Rs.min())}updateCollectionGroup(e,n,s){return F.resolve()}updateIndexEntries(e,n){return F.resolve()}}class eT{constructor(){this.index={}}add(e){const n=e.lastSegment(),s=e.popLast(),r=this.index[n]||new it(ke.comparator),i=!r.has(s);return this.index[n]=r.add(s),i}has(e){const n=e.lastSegment(),s=e.popLast(),r=this.index[n];return r&&r.has(s)}getEntries(e){return(this.index[e]||new it(ke.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Kr(0)}static kn(){return new Kr(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tT{constructor(){this.changes=new ai(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,vt.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const s=this.changes.get(n);return s!==void 0?F.resolve(s):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class nT{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sT{constructor(e,n,s,r){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=s,this.indexManager=r}getDocument(e,n){let s=null;return this.documentOverlayCache.getOverlay(e,n).next(r=>(s=r,this.remoteDocumentCache.getEntry(e,n))).next(r=>(s!==null&&$i(s.mutation,r,qt.empty(),We.now()),r))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.getLocalViewOfDocuments(e,s,le()).next(()=>s))}getLocalViewOfDocuments(e,n,s=le()){const r=Zs();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,s).next(i=>{let o=Mi();return i.forEach((a,c)=>{o=o.insert(a,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const s=Zs();return this.populateOverlays(e,s,n).next(()=>this.computeViews(e,n,s,le()))}populateOverlays(e,n,s){const r=[];return s.forEach(i=>{n.has(i)||r.push(i)}),this.documentOverlayCache.getOverlays(e,r).next(i=>{i.forEach((o,a)=>{n.set(o,a)})})}computeViews(e,n,s,r){let i=Xn();const o=Ui(),a=function(){return Ui()}();return n.forEach((c,d)=>{const h=s.get(d.key);r.has(d.key)&&(h===void 0||h.mutation instanceof Ns)?i=i.insert(d.key,d):h!==void 0?(o.set(d.key,h.mutation.getFieldMask()),$i(h.mutation,d,h.mutation.getFieldMask(),We.now())):o.set(d.key,qt.empty())}),this.recalculateAndSaveOverlays(e,i).next(c=>(c.forEach((d,h)=>o.set(d,h)),n.forEach((d,h)=>{var m;return a.set(d,new nT(h,(m=o.get(d))!==null&&m!==void 0?m:null))}),a))}recalculateAndSaveOverlays(e,n){const s=Ui();let r=new Me((o,a)=>o-a),i=le();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const a of o)a.keys().forEach(c=>{const d=n.get(c);if(d===null)return;let h=s.get(c)||qt.empty();h=a.applyToLocalView(d,h),s.set(c,h);const m=(r.get(a.batchId)||le()).add(c);r=r.insert(a.batchId,m)})}).next(()=>{const o=[],a=r.getReverseIterator();for(;a.hasNext();){const c=a.getNext(),d=c.key,h=c.value,m=Am();h.forEach(f=>{if(!i.has(f)){const y=Dm(n.get(f),s.get(f));y!==null&&m.set(f,y),i=i.add(f)}}),o.push(this.documentOverlayCache.saveOverlays(e,d,m))}return F.waitFor(o)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,n,s,r){return function(o){return G.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):_m(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,s,r):this.getDocumentsMatchingCollectionQuery(e,n,s,r)}getNextDocuments(e,n,s,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,s,r).next(i=>{const o=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,s.largestBatchId,r-i.size):F.resolve(Zs());let a=-1,c=i;return o.next(d=>F.forEach(d,(h,m)=>(a<m.largestBatchId&&(a=m.largestBatchId),i.get(h)?F.resolve():this.remoteDocumentCache.getEntry(e,h).next(f=>{c=c.insert(h,f)}))).next(()=>this.populateOverlays(e,d,i)).next(()=>this.computeViews(e,c,d,le())).next(h=>({batchId:a,changes:xm(h)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new G(n)).next(s=>{let r=Mi();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r})}getDocumentsMatchingCollectionGroupQuery(e,n,s,r){const i=n.collectionGroup;let o=Mi();return this.indexManager.getCollectionParents(e,i).next(a=>F.forEach(a,c=>{const d=function(m,f){return new oi(f,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,s,r).next(h=>{h.forEach((m,f)=>{o=o.insert(m,f)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,s,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,s.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,s,i,r))).next(o=>{i.forEach((c,d)=>{const h=d.getKey();o.get(h)===null&&(o=o.insert(h,vt.newInvalidDocument(h)))});let a=Mi();return o.forEach((c,d)=>{const h=i.get(c);h!==void 0&&$i(h.mutation,d,qt.empty(),We.now()),Qa(n,d)&&(a=a.insert(c,d))}),a})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rT{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return F.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(r){return{id:r.id,version:r.version,createTime:En(r.createTime)}}(n)),F.resolve()}getNamedQuery(e,n){return F.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(r){return{name:r.name,query:X_(r.bundledQuery),readTime:En(r.readTime)}}(n)),F.resolve()}}/**
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
 */class iT{constructor(){this.overlays=new Me(G.comparator),this.Ir=new Map}getOverlay(e,n){return F.resolve(this.overlays.get(n))}getOverlays(e,n){const s=Zs();return F.forEach(n,r=>this.getOverlay(e,r).next(i=>{i!==null&&s.set(r,i)})).next(()=>s)}saveOverlays(e,n,s){return s.forEach((r,i)=>{this.ht(e,n,i)}),F.resolve()}removeOverlaysForBatchId(e,n,s){const r=this.Ir.get(s);return r!==void 0&&(r.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(s)),F.resolve()}getOverlaysForCollection(e,n,s){const r=Zs(),i=n.length+1,o=new G(n.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const c=a.getNext().value,d=c.getKey();if(!n.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>s&&r.set(c.getKey(),c)}return F.resolve(r)}getOverlaysForCollectionGroup(e,n,s,r){let i=new Me((d,h)=>d-h);const o=this.overlays.getIterator();for(;o.hasNext();){const d=o.getNext().value;if(d.getKey().getCollectionGroup()===n&&d.largestBatchId>s){let h=i.get(d.largestBatchId);h===null&&(h=Zs(),i=i.insert(d.largestBatchId,h)),h.set(d.getKey(),d)}}const a=Zs(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,h)=>a.set(d,h)),!(a.size()>=r)););return F.resolve(a)}ht(e,n,s){const r=this.overlays.get(s.key);if(r!==null){const o=this.Ir.get(r.largestBatchId).delete(s.key);this.Ir.set(r.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new k_(n,s));let i=this.Ir.get(n);i===void 0&&(i=le(),this.Ir.set(n,i)),this.Ir.set(n,i.add(s.key))}}/**
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
 */class oT{constructor(){this.sessionToken=at.EMPTY_BYTE_STRING}getSessionToken(e){return F.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,F.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sd{constructor(){this.Tr=new it(Je.Er),this.dr=new it(Je.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const s=new Je(e,n);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(e,n){e.forEach(s=>this.addReference(s,n))}removeReference(e,n){this.Vr(new Je(e,n))}mr(e,n){e.forEach(s=>this.removeReference(s,n))}gr(e){const n=new G(new ke([])),s=new Je(n,e),r=new Je(n,e+1),i=[];return this.dr.forEachInRange([s,r],o=>{this.Vr(o),i.push(o.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new G(new ke([])),s=new Je(n,e),r=new Je(n,e+1);let i=le();return this.dr.forEachInRange([s,r],o=>{i=i.add(o.key)}),i}containsKey(e){const n=new Je(e,0),s=this.Tr.firstAfterOrEqual(n);return s!==null&&e.isEqual(s.key)}}class Je{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return G.comparator(e.key,n.key)||ge(e.wr,n.wr)}static Ar(e,n){return ge(e.wr,n.wr)||G.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aT{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new it(Je.Er)}checkEmpty(e){return F.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,s,r){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new A_(i,n,s,r);this.mutationQueue.push(o);for(const a of r)this.br=this.br.add(new Je(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return F.resolve(o)}lookupMutationBatch(e,n){return F.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const s=n+1,r=this.vr(s),i=r<0?0:r;return F.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return F.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return F.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const s=new Je(n,0),r=new Je(n,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([s,r],o=>{const a=this.Dr(o.wr);i.push(a)}),F.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,n){let s=new it(ge);return n.forEach(r=>{const i=new Je(r,0),o=new Je(r,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,o],a=>{s=s.add(a.wr)})}),F.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(e,n){const s=n.path,r=s.length+1;let i=s;G.isDocumentKey(i)||(i=i.child(""));const o=new Je(new G(i),0);let a=new it(ge);return this.br.forEachWhile(c=>{const d=c.key.path;return!!s.isPrefixOf(d)&&(d.length===r&&(a=a.add(c.wr)),!0)},o),F.resolve(this.Cr(a))}Cr(e){const n=[];return e.forEach(s=>{const r=this.Dr(s);r!==null&&n.push(r)}),n}removeMutationBatch(e,n){Ee(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return F.forEach(n.mutations,r=>{const i=new Je(r.key,n.batchId);return s=s.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.br=s})}On(e){}containsKey(e,n){const s=new Je(n,0),r=this.br.firstAfterOrEqual(s);return F.resolve(n.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,F.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lT{constructor(e){this.Mr=e,this.docs=function(){return new Me(G.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const s=n.key,r=this.docs.get(s),i=r?r.size:0,o=this.Mr(n);return this.docs=this.docs.insert(s,{document:n.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const s=this.docs.get(n);return F.resolve(s?s.document.mutableCopy():vt.newInvalidDocument(n))}getEntries(e,n){let s=Xn();return n.forEach(r=>{const i=this.docs.get(r);s=s.insert(r,i?i.document.mutableCopy():vt.newInvalidDocument(r))}),F.resolve(s)}getDocumentsMatchingQuery(e,n,s,r){let i=Xn();const o=n.path,a=new G(o.child("")),c=this.docs.getIteratorFrom(a);for(;c.hasNext();){const{key:d,value:{document:h}}=c.getNext();if(!o.isPrefixOf(d.path))break;d.path.length>o.length+1||HE(qE(h),s)<=0||(r.has(h.key)||Qa(n,h))&&(i=i.insert(h.key,h.mutableCopy()))}return F.resolve(i)}getAllFromCollectionGroup(e,n,s,r){Z()}Or(e,n){return F.forEach(this.docs,s=>n(s))}newChangeBuffer(e){return new cT(this)}getSize(e){return F.resolve(this.size)}}class cT extends tT{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((s,r)=>{r.isValidDocument()?n.push(this.cr.addEntry(e,r)):this.cr.removeEntry(s)}),F.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dT{constructor(e){this.persistence=e,this.Nr=new ai(n=>vd(n),bd),this.lastRemoteSnapshotVersion=te.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Sd,this.targetCount=0,this.kr=Kr.Bn()}forEachTarget(e,n){return this.Nr.forEach((s,r)=>n(r)),F.resolve()}getLastRemoteSnapshotVersion(e){return F.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return F.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),F.resolve(this.highestTargetId)}setTargetsMetadata(e,n,s){return s&&(this.lastRemoteSnapshotVersion=s),n>this.Lr&&(this.Lr=n),F.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new Kr(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,F.resolve()}updateTargetData(e,n){return this.Kn(n),F.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,F.resolve()}removeTargets(e,n,s){let r=0;const i=[];return this.Nr.forEach((o,a)=>{a.sequenceNumber<=n&&s.get(a.targetId)===null&&(this.Nr.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),r++)}),F.waitFor(i).next(()=>r)}getTargetCount(e){return F.resolve(this.targetCount)}getTargetData(e,n){const s=this.Nr.get(n)||null;return F.resolve(s)}addMatchingKeys(e,n,s){return this.Br.Rr(n,s),F.resolve()}removeMatchingKeys(e,n,s){this.Br.mr(n,s);const r=this.persistence.referenceDelegate,i=[];return r&&n.forEach(o=>{i.push(r.markPotentiallyOrphaned(e,o))}),F.waitFor(i)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),F.resolve()}getMatchingKeysForTargetId(e,n){const s=this.Br.yr(n);return F.resolve(s)}containsKey(e,n){return F.resolve(this.Br.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uT{constructor(e,n){this.qr={},this.overlays={},this.Qr=new pd(0),this.Kr=!1,this.Kr=!0,this.$r=new oT,this.referenceDelegate=e(this),this.Ur=new dT(this),this.indexManager=new Z_,this.remoteDocumentCache=function(r){return new lT(r)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new J_(n),this.Gr=new rT(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new iT,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let s=this.qr[e.toKey()];return s||(s=new aT(n,this.referenceDelegate),this.qr[e.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,s){H("MemoryPersistence","Starting transaction:",e);const r=new hT(this.Qr.next());return this.referenceDelegate.zr(),s(r).next(i=>this.referenceDelegate.jr(r).next(()=>i)).toPromise().then(i=>(r.raiseOnCommittedEvent(),i))}Hr(e,n){return F.or(Object.values(this.qr).map(s=>()=>s.containsKey(e,n)))}}class hT extends YE{constructor(e){super(),this.currentSequenceNumber=e}}class xd{constructor(e){this.persistence=e,this.Jr=new Sd,this.Yr=null}static Zr(e){return new xd(e)}get Xr(){if(this.Yr)return this.Yr;throw Z()}addReference(e,n,s){return this.Jr.addReference(s,n),this.Xr.delete(s.toString()),F.resolve()}removeReference(e,n,s){return this.Jr.removeReference(s,n),this.Xr.add(s.toString()),F.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),F.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(r=>this.Xr.add(r.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,n.targetId).next(r=>{r.forEach(i=>this.Xr.add(i.toString()))}).next(()=>s.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return F.forEach(this.Xr,s=>{const r=G.fromPath(s);return this.ei(e,r).next(i=>{i||n.removeEntry(r,te.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(s=>{s?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return F.or([()=>F.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ad{constructor(e,n,s,r){this.targetId=e,this.fromCache=n,this.$i=s,this.Ui=r}static Wi(e,n){let s=le(),r=le();for(const i of n.docChanges)switch(i.type){case 0:s=s.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new Ad(e,n.fromCache,s,r)}}/**
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
 */class fT{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class pT{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return j0()?8:GE(wt())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,s,r){const i={result:null};return this.Yi(e,n).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.Zi(e,n,r,s).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new fT;return this.Xi(e,n,o).next(a=>{if(i.result=a,this.zi)return this.es(e,n,o,a.size)})}).next(()=>i.result)}es(e,n,s,r){return s.documentReadCount<this.ji?(xi()<=de.DEBUG&&H("QueryEngine","SDK will not create cache indexes for query:",Rr(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),F.resolve()):(xi()<=de.DEBUG&&H("QueryEngine","Query:",Rr(n),"scans",s.documentReadCount,"local documents and returns",r,"documents as results."),s.documentReadCount>this.Hi*r?(xi()<=de.DEBUG&&H("QueryEngine","The SDK decides to create cache indexes for query:",Rr(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,wn(n))):F.resolve())}Yi(e,n){if(df(n))return F.resolve(null);let s=wn(n);return this.indexManager.getIndexType(e,s).next(r=>r===0?null:(n.limit!==null&&r===1&&(n=Ma(n,null,"F"),s=wn(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next(i=>{const o=le(...i);return this.Ji.getDocuments(e,o).next(a=>this.indexManager.getMinOffset(e,s).next(c=>{const d=this.ts(n,a);return this.ns(n,d,o,c.readTime)?this.Yi(e,Ma(n,null,"F")):this.rs(e,d,n,c)}))})))}Zi(e,n,s,r){return df(n)||r.isEqual(te.min())?F.resolve(null):this.Ji.getDocuments(e,s).next(i=>{const o=this.ts(n,i);return this.ns(n,o,s,r)?F.resolve(null):(xi()<=de.DEBUG&&H("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),Rr(n)),this.rs(e,o,n,$E(r,-1)).next(a=>a))})}ts(e,n){let s=new it(Im(e));return n.forEach((r,i)=>{Qa(e,i)&&(s=s.add(i))}),s}ns(e,n,s,r){if(e.limit===null)return!1;if(s.size!==n.size)return!0;const i=e.limitType==="F"?n.last():n.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}Xi(e,n,s){return xi()<=de.DEBUG&&H("QueryEngine","Using full collection scan to execute query:",Rr(n)),this.Ji.getDocumentsMatchingQuery(e,n,Rs.min(),s)}rs(e,n,s,r){return this.Ji.getDocumentsMatchingQuery(e,s,r).next(i=>(n.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mT{constructor(e,n,s,r){this.persistence=e,this.ss=n,this.serializer=r,this.os=new Me(ge),this._s=new ai(i=>vd(i),bd),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(s)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new sT(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function gT(t,e,n,s){return new mT(t,e,n,s)}async function Wm(t,e){const n=ne(t);return await n.persistence.runTransaction("Handle user change","readonly",s=>{let r;return n.mutationQueue.getAllMutationBatches(s).next(i=>(r=i,n.ls(e),n.mutationQueue.getAllMutationBatches(s))).next(i=>{const o=[],a=[];let c=le();for(const d of r){o.push(d.batchId);for(const h of d.mutations)c=c.add(h.key)}for(const d of i){a.push(d.batchId);for(const h of d.mutations)c=c.add(h.key)}return n.localDocuments.getDocuments(s,c).next(d=>({hs:d,removedBatchIds:o,addedBatchIds:a}))})})}function yT(t,e){const n=ne(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const r=e.batch.keys(),i=n.cs.newChangeBuffer({trackRemovals:!0});return function(a,c,d,h){const m=d.batch,f=m.keys();let y=F.resolve();return f.forEach(T=>{y=y.next(()=>h.getEntry(c,T)).next(E=>{const x=d.docVersions.get(T);Ee(x!==null),E.version.compareTo(x)<0&&(m.applyToRemoteDocument(E,d),E.isValidDocument()&&(E.setReadTime(d.commitVersion),h.addEntry(E)))})}),y.next(()=>a.mutationQueue.removeMutationBatch(c,m))}(n,s,e,i).next(()=>i.apply(s)).next(()=>n.mutationQueue.performConsistencyCheck(s)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(s,r,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(a){let c=le();for(let d=0;d<a.mutationResults.length;++d)a.mutationResults[d].transformResults.length>0&&(c=c.add(a.batch.mutations[d].key));return c}(e))).next(()=>n.localDocuments.getDocuments(s,r))})}function Ym(t){const e=ne(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function vT(t,e){const n=ne(t),s=e.snapshotVersion;let r=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=n.cs.newChangeBuffer({trackRemovals:!0});r=n.os;const a=[];e.targetChanges.forEach((h,m)=>{const f=r.get(m);if(!f)return;a.push(n.Ur.removeMatchingKeys(i,h.removedDocuments,m).next(()=>n.Ur.addMatchingKeys(i,h.addedDocuments,m)));let y=f.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?y=y.withResumeToken(at.EMPTY_BYTE_STRING,te.min()).withLastLimboFreeSnapshotVersion(te.min()):h.resumeToken.approximateByteSize()>0&&(y=y.withResumeToken(h.resumeToken,s)),r=r.insert(m,y),function(E,x,C){return E.resumeToken.approximateByteSize()===0||x.snapshotVersion.toMicroseconds()-E.snapshotVersion.toMicroseconds()>=3e8?!0:C.addedDocuments.size+C.modifiedDocuments.size+C.removedDocuments.size>0}(f,y,h)&&a.push(n.Ur.updateTargetData(i,y))});let c=Xn(),d=le();if(e.documentUpdates.forEach(h=>{e.resolvedLimboDocuments.has(h)&&a.push(n.persistence.referenceDelegate.updateLimboDocument(i,h))}),a.push(bT(i,o,e.documentUpdates).next(h=>{c=h.Ps,d=h.Is})),!s.isEqual(te.min())){const h=n.Ur.getLastRemoteSnapshotVersion(i).next(m=>n.Ur.setTargetsMetadata(i,i.currentSequenceNumber,s));a.push(h)}return F.waitFor(a).next(()=>o.apply(i)).next(()=>n.localDocuments.getLocalViewOfDocuments(i,c,d)).next(()=>c)}).then(i=>(n.os=r,i))}function bT(t,e,n){let s=le(),r=le();return n.forEach(i=>s=s.add(i)),e.getEntries(t,s).next(i=>{let o=Xn();return n.forEach((a,c)=>{const d=i.get(a);c.isFoundDocument()!==d.isFoundDocument()&&(r=r.add(a)),c.isNoDocument()&&c.version.isEqual(te.min())?(e.removeEntry(a,c.readTime),o=o.insert(a,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),o=o.insert(a,c)):H("LocalStore","Ignoring outdated watch update for ",a,". Current version:",d.version," Watch version:",c.version)}),{Ps:o,Is:r}})}function wT(t,e){const n=ne(t);return n.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function ET(t,e){const n=ne(t);return n.persistence.runTransaction("Allocate target","readwrite",s=>{let r;return n.Ur.getTargetData(s,e).next(i=>i?(r=i,F.resolve(r)):n.Ur.allocateTargetId(s).next(o=>(r=new _s(e,o,"TargetPurposeListen",s.currentSequenceNumber),n.Ur.addTargetData(s,r).next(()=>r))))}).then(s=>{const r=n.os.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.os=n.os.insert(s.targetId,s),n._s.set(e,s.targetId)),s})}async function Sc(t,e,n){const s=ne(t),r=s.os.get(e),i=n?"readwrite":"readwrite-primary";try{n||await s.persistence.runTransaction("Release target",i,o=>s.persistence.referenceDelegate.removeTarget(o,r))}catch(o){if(!Io(o))throw o;H("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}s.os=s.os.remove(e),s._s.delete(r.target)}function Ef(t,e,n){const s=ne(t);let r=te.min(),i=le();return s.persistence.runTransaction("Execute query","readwrite",o=>function(c,d,h){const m=ne(c),f=m._s.get(h);return f!==void 0?F.resolve(m.os.get(f)):m.Ur.getTargetData(d,h)}(s,o,wn(e)).next(a=>{if(a)return r=a.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(o,a.targetId).next(c=>{i=c})}).next(()=>s.ss.getDocumentsMatchingQuery(o,e,n?r:te.min(),n?i:le())).next(a=>(_T(s,u_(e),a),{documents:a,Ts:i})))}function _T(t,e,n){let s=t.us.get(e)||te.min();n.forEach((r,i)=>{i.readTime.compareTo(s)>0&&(s=i.readTime)}),t.us.set(e,s)}class _f{constructor(){this.activeTargetIds=y_()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class TT{constructor(){this.so=new _f,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,s){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,s){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new _f,Promise.resolve()}handleUserChange(e,n,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class IT{_o(e){}shutdown(){}}/**
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
 */class Tf{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){H("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){H("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let na=null;function Jl(){return na===null?na=function(){return 268435456+Math.round(2147483648*Math.random())}():na++,"0x"+na.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ST={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xT{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gt="WebChannelConnection";class AT extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const s=n.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+n.host,this.vo=`projects/${r}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${r}`:`project_id=${r}&database_id=${i}`}get Fo(){return!1}Mo(n,s,r,i,o){const a=Jl(),c=this.xo(n,s.toUriEncodedString());H("RestConnection",`Sending RPC '${n}' ${a}:`,c,r);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,o),this.No(n,c,d,r).then(h=>(H("RestConnection",`Received RPC '${n}' ${a}: `,h),h),h=>{throw Wr("RestConnection",`RPC '${n}' ${a} failed with error: `,h,"url: ",c,"request:",r),h})}Lo(n,s,r,i,o,a){return this.Mo(n,s,r,i,o)}Oo(n,s,r){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+ii}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((i,o)=>n[o]=i),r&&r.headers.forEach((i,o)=>n[o]=i)}xo(n,s){const r=ST[n];return`${this.Do}/v1/${s}:${r}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,s,r){const i=Jl();return new Promise((o,a)=>{const c=new om;c.setWithCredentials(!0),c.listenOnce(am.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case ca.NO_ERROR:const h=c.getResponseJson();H(gt,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(h)),o(h);break;case ca.TIMEOUT:H(gt,`RPC '${e}' ${i} timed out`),a(new $(L.DEADLINE_EXCEEDED,"Request time out"));break;case ca.HTTP_ERROR:const m=c.getStatus();if(H(gt,`RPC '${e}' ${i} failed with status:`,m,"response text:",c.getResponseText()),m>0){let f=c.getResponseJson();Array.isArray(f)&&(f=f[0]);const y=f==null?void 0:f.error;if(y&&y.status&&y.message){const T=function(x){const C=x.toLowerCase().replace(/_/g,"-");return Object.values(L).indexOf(C)>=0?C:L.UNKNOWN}(y.status);a(new $(T,y.message))}else a(new $(L.UNKNOWN,"Server responded with status "+c.getStatus()))}else a(new $(L.UNAVAILABLE,"Connection failed."));break;default:Z()}}finally{H(gt,`RPC '${e}' ${i} completed.`)}});const d=JSON.stringify(r);H(gt,`RPC '${e}' ${i} sending request:`,r),c.send(n,"POST",d,s,15)})}Bo(e,n,s){const r=Jl(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=dm(),a=cm(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,n,s),c.encodeInitMessageHeaders=!0;const h=i.join("");H(gt,`Creating RPC '${e}' stream ${r}: ${h}`,c);const m=o.createWebChannel(h,c);let f=!1,y=!1;const T=new xT({Io:x=>{y?H(gt,`Not sending because RPC '${e}' stream ${r} is closed:`,x):(f||(H(gt,`Opening RPC '${e}' stream ${r} transport.`),m.open(),f=!0),H(gt,`RPC '${e}' stream ${r} sending:`,x),m.send(x))},To:()=>m.close()}),E=(x,C,P)=>{x.listen(C,D=>{try{P(D)}catch(R){setTimeout(()=>{throw R},0)}})};return E(m,Ri.EventType.OPEN,()=>{y||(H(gt,`RPC '${e}' stream ${r} transport opened.`),T.yo())}),E(m,Ri.EventType.CLOSE,()=>{y||(y=!0,H(gt,`RPC '${e}' stream ${r} transport closed`),T.So())}),E(m,Ri.EventType.ERROR,x=>{y||(y=!0,Wr(gt,`RPC '${e}' stream ${r} transport errored:`,x),T.So(new $(L.UNAVAILABLE,"The operation could not be completed")))}),E(m,Ri.EventType.MESSAGE,x=>{var C;if(!y){const P=x.data[0];Ee(!!P);const D=P,R=D.error||((C=D[0])===null||C===void 0?void 0:C.error);if(R){H(gt,`RPC '${e}' stream ${r} received error:`,R);const B=R.status;let N=function(I){const _=ze[I];if(_!==void 0)return Lm(_)}(B),w=R.message;N===void 0&&(N=L.INTERNAL,w="Unknown error status: "+B+" with message "+R.message),y=!0,T.So(new $(N,w)),m.close()}else H(gt,`RPC '${e}' stream ${r} received:`,P),T.bo(P)}}),E(a,lm.STAT_EVENT,x=>{x.stat===mc.PROXY?H(gt,`RPC '${e}' stream ${r} detected buffering proxy`):x.stat===mc.NOPROXY&&H(gt,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{T.wo()},0),T}}function Xl(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tl(t){return new O_(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gm{constructor(e,n,s=1e3,r=1.5,i=6e4){this.ui=e,this.timerId=n,this.ko=s,this.qo=r,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),r=Math.max(0,n-s);r>0&&H("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,r,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jm{constructor(e,n,s,r,i,o,a,c){this.ui=e,this.Ho=s,this.Jo=r,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Gm(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===L.RESOURCE_EXHAUSTED?(Jn(n.toString()),Jn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===L.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,r])=>{this.Yo===n&&this.P_(s,r)},s=>{e(()=>{const r=new $(L.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(r)})})}P_(e,n){const s=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(r=>{s(()=>this.I_(r))}),this.stream.onMessage(r=>{s(()=>++this.e_==1?this.E_(r):this.onNext(r))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return H("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():(H("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class kT extends jm{constructor(e,n,s,r,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,s,r,o),this.serializer=i}T_(e,n){return this.connection.Bo("Listen",e,n)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const n=z_(this.serializer,e),s=function(i){if(!("targetChange"in i))return te.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?te.min():o.readTime?En(o.readTime):te.min()}(e);return this.listener.d_(n,s)}A_(e){const n={};n.database=Ic(this.serializer),n.addTarget=function(i,o){let a;const c=o.target;if(a=bc(c)?{documents:q_(i,c)}:{query:H_(i,c)._t},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=Fm(i,o.resumeToken);const d=Ec(i,o.expectedCount);d!==null&&(a.expectedCount=d)}else if(o.snapshotVersion.compareTo(te.min())>0){a.readTime=Ba(i,o.snapshotVersion.toTimestamp());const d=Ec(i,o.expectedCount);d!==null&&(a.expectedCount=d)}return a}(this.serializer,e);const s=Y_(this.serializer,e);s&&(n.labels=s),this.a_(n)}R_(e){const n={};n.database=Ic(this.serializer),n.removeTarget=e,this.a_(n)}}class CT extends jm{constructor(e,n,s,r,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,s,r,o),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,n){return this.connection.Bo("Write",e,n)}E_(e){return Ee(!!e.streamToken),this.lastStreamToken=e.streamToken,Ee(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){Ee(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const n=$_(e.writeResults,e.commitTime),s=En(e.commitTime);return this.listener.g_(s,n)}p_(){const e={};e.database=Ic(this.serializer),this.a_(e)}m_(e){const n={streamToken:this.lastStreamToken,writes:e.map(s=>U_(this.serializer,s))};this.a_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PT extends class{}{constructor(e,n,s,r){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=s,this.serializer=r,this.y_=!1}w_(){if(this.y_)throw new $(L.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,s,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.Mo(e,_c(n,s),r,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===L.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new $(L.UNKNOWN,i.toString())})}Lo(e,n,s,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Lo(e,_c(n,s),r,o,a,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===L.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new $(L.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class RT{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Jn(n),this.D_=!1):H("OnlineStateTracker",n)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MT{constructor(e,n,s,r,i){this.localStore=e,this.datastore=n,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(o=>{s.enqueueAndForget(async()=>{br(this)&&(H("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=ne(c);d.L_.add(4),await Ao(d),d.q_.set("Unknown"),d.L_.delete(4),await nl(d)}(this))})}),this.q_=new RT(s,r)}}async function nl(t){if(br(t))for(const e of t.B_)await e(!0)}async function Ao(t){for(const e of t.B_)await e(!1)}function Km(t,e){const n=ne(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),Rd(n)?Pd(n):li(n).r_()&&Cd(n,e))}function kd(t,e){const n=ne(t),s=li(n);n.N_.delete(e),s.r_()&&Qm(n,e),n.N_.size===0&&(s.r_()?s.o_():br(n)&&n.q_.set("Unknown"))}function Cd(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(te.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}li(t).A_(e)}function Qm(t,e){t.Q_.xe(e),li(t).R_(e)}function Pd(t){t.Q_=new D_({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),li(t).start(),t.q_.v_()}function Rd(t){return br(t)&&!li(t).n_()&&t.N_.size>0}function br(t){return ne(t).L_.size===0}function Jm(t){t.Q_=void 0}async function DT(t){t.q_.set("Online")}async function BT(t){t.N_.forEach((e,n)=>{Cd(t,e)})}async function LT(t,e){Jm(t),Rd(t)?(t.q_.M_(e),Pd(t)):t.q_.set("Unknown")}async function NT(t,e,n){if(t.q_.set("Online"),e instanceof Om&&e.state===2&&e.cause)try{await async function(r,i){const o=i.cause;for(const a of i.targetIds)r.N_.has(a)&&(await r.remoteSyncer.rejectListen(a,o),r.N_.delete(a),r.Q_.removeTarget(a))}(t,e)}catch(s){H("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await La(t,s)}else if(e instanceof ha?t.Q_.Ke(e):e instanceof Nm?t.Q_.He(e):t.Q_.We(e),!n.isEqual(te.min()))try{const s=await Ym(t.localStore);n.compareTo(s)>=0&&await function(i,o){const a=i.Q_.rt(o);return a.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const h=i.N_.get(d);h&&i.N_.set(d,h.withResumeToken(c.resumeToken,o))}}),a.targetMismatches.forEach((c,d)=>{const h=i.N_.get(c);if(!h)return;i.N_.set(c,h.withResumeToken(at.EMPTY_BYTE_STRING,h.snapshotVersion)),Qm(i,c);const m=new _s(h.target,c,d,h.sequenceNumber);Cd(i,m)}),i.remoteSyncer.applyRemoteEvent(a)}(t,n)}catch(s){H("RemoteStore","Failed to raise snapshot:",s),await La(t,s)}}async function La(t,e,n){if(!Io(e))throw e;t.L_.add(1),await Ao(t),t.q_.set("Offline"),n||(n=()=>Ym(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{H("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await nl(t)})}function Xm(t,e){return e().catch(n=>La(t,n,e))}async function sl(t){const e=ne(t),n=Ds(e);let s=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;OT(e);)try{const r=await wT(e.localStore,s);if(r===null){e.O_.length===0&&n.o_();break}s=r.batchId,FT(e,r)}catch(r){await La(e,r)}Zm(e)&&eg(e)}function OT(t){return br(t)&&t.O_.length<10}function FT(t,e){t.O_.push(e);const n=Ds(t);n.r_()&&n.V_&&n.m_(e.mutations)}function Zm(t){return br(t)&&!Ds(t).n_()&&t.O_.length>0}function eg(t){Ds(t).start()}async function VT(t){Ds(t).p_()}async function zT(t){const e=Ds(t);for(const n of t.O_)e.m_(n.mutations)}async function UT(t,e,n){const s=t.O_.shift(),r=_d.from(s,e,n);await Xm(t,()=>t.remoteSyncer.applySuccessfulWrite(r)),await sl(t)}async function $T(t,e){e&&Ds(t).V_&&await async function(s,r){if(function(o){return P_(o)&&o!==L.ABORTED}(r.code)){const i=s.O_.shift();Ds(s).s_(),await Xm(s,()=>s.remoteSyncer.rejectFailedWrite(i.batchId,r)),await sl(s)}}(t,e),Zm(t)&&eg(t)}async function If(t,e){const n=ne(t);n.asyncQueue.verifyOperationInProgress(),H("RemoteStore","RemoteStore received new credentials");const s=br(n);n.L_.add(3),await Ao(n),s&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await nl(n)}async function qT(t,e){const n=ne(t);e?(n.L_.delete(2),await nl(n)):e||(n.L_.add(2),await Ao(n),n.q_.set("Unknown"))}function li(t){return t.K_||(t.K_=function(n,s,r){const i=ne(n);return i.w_(),new kT(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(t.datastore,t.asyncQueue,{Eo:DT.bind(null,t),Ro:BT.bind(null,t),mo:LT.bind(null,t),d_:NT.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),Rd(t)?Pd(t):t.q_.set("Unknown")):(await t.K_.stop(),Jm(t))})),t.K_}function Ds(t){return t.U_||(t.U_=function(n,s,r){const i=ne(n);return i.w_(),new CT(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:VT.bind(null,t),mo:$T.bind(null,t),f_:zT.bind(null,t),g_:UT.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await sl(t)):(await t.U_.stop(),t.O_.length>0&&(H("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Md{constructor(e,n,s,r,i){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=s,this.op=r,this.removalCallback=i,this.deferred=new Yn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,s,r,i){const o=Date.now()+s,a=new Md(e,n,o,r,i);return a.start(s),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new $(L.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Dd(t,e){if(Jn("AsyncQueue",`${e}: ${t}`),Io(t))return new $(L.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(e){this.comparator=e?(n,s)=>e(n,s)||G.comparator(n.key,s.key):(n,s)=>G.comparator(n.key,s.key),this.keyedMap=Mi(),this.sortedSet=new Me(this.comparator)}static emptySet(e){return new Fr(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,s)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof Fr)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(!r.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const s=new Fr;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=n,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sf{constructor(){this.W_=new Me(G.comparator)}track(e){const n=e.doc.key,s=this.W_.get(n);s?e.type!==0&&s.type===3?this.W_=this.W_.insert(n,e):e.type===3&&s.type!==1?this.W_=this.W_.insert(n,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.W_=this.W_.insert(n,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.W_=this.W_.remove(n):e.type===1&&s.type===2?this.W_=this.W_.insert(n,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):Z():this.W_=this.W_.insert(n,e)}G_(){const e=[];return this.W_.inorderTraversal((n,s)=>{e.push(s)}),e}}class Qr{constructor(e,n,s,r,i,o,a,c,d){this.query=e,this.docs=n,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,n,s,r,i){const o=[];return n.forEach(a=>{o.push({type:0,doc:a})}),new Qr(e,n,Fr.emptySet(n),o,s,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ka(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,s=e.docChanges;if(n.length!==s.length)return!1;for(let r=0;r<n.length;r++)if(n[r].type!==s[r].type||!n[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HT{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class WT{constructor(){this.queries=xf(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,s){const r=ne(n),i=r.queries;r.queries=xf(),i.forEach((o,a)=>{for(const c of a.j_)c.onError(s)})})(this,new $(L.ABORTED,"Firestore shutting down"))}}function xf(){return new ai(t=>Tm(t),Ka)}async function tg(t,e){const n=ne(t);let s=3;const r=e.query;let i=n.queries.get(r);i?!i.H_()&&e.J_()&&(s=2):(i=new HT,s=e.J_()?0:1);try{switch(s){case 0:i.z_=await n.onListen(r,!0);break;case 1:i.z_=await n.onListen(r,!1);break;case 2:await n.onFirstRemoteStoreListen(r)}}catch(o){const a=Dd(o,`Initialization of query '${Rr(e.query)}' failed`);return void e.onError(a)}n.queries.set(r,i),i.j_.push(e),e.Z_(n.onlineState),i.z_&&e.X_(i.z_)&&Bd(n)}async function ng(t,e){const n=ne(t),s=e.query;let r=3;const i=n.queries.get(s);if(i){const o=i.j_.indexOf(e);o>=0&&(i.j_.splice(o,1),i.j_.length===0?r=e.J_()?0:1:!i.H_()&&e.J_()&&(r=2))}switch(r){case 0:return n.queries.delete(s),n.onUnlisten(s,!0);case 1:return n.queries.delete(s),n.onUnlisten(s,!1);case 2:return n.onLastRemoteStoreUnlisten(s);default:return}}function YT(t,e){const n=ne(t);let s=!1;for(const r of e){const i=r.query,o=n.queries.get(i);if(o){for(const a of o.j_)a.X_(r)&&(s=!0);o.z_=r}}s&&Bd(n)}function GT(t,e,n){const s=ne(t),r=s.queries.get(e);if(r)for(const i of r.j_)i.onError(n);s.queries.delete(e)}function Bd(t){t.Y_.forEach(e=>{e.next()})}var xc,Af;(Af=xc||(xc={})).ea="default",Af.Cache="cache";class sg{constructor(e,n,s){this.query=e,this.ta=n,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new Qr(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.na?this.ia(e)&&(this.ta.next(e),n=!0):this.sa(e,this.onlineState)&&(this.oa(e),n=!0),this.ra=e,n}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let n=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),n=!0),n}sa(e,n){if(!e.fromCache||!this.J_())return!0;const s=n!=="Offline";return(!this.options._a||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const n=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}oa(e){e=Qr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==xc.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rg{constructor(e){this.key=e}}class ig{constructor(e){this.key=e}}class jT{constructor(e,n){this.query=e,this.Ta=n,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=le(),this.mutatedKeys=le(),this.Aa=Im(e),this.Ra=new Fr(this.Aa)}get Va(){return this.Ta}ma(e,n){const s=n?n.fa:new Sf,r=n?n.Ra:this.Ra;let i=n?n.mutatedKeys:this.mutatedKeys,o=r,a=!1;const c=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,d=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((h,m)=>{const f=r.get(h),y=Qa(this.query,m)?m:null,T=!!f&&this.mutatedKeys.has(f.key),E=!!y&&(y.hasLocalMutations||this.mutatedKeys.has(y.key)&&y.hasCommittedMutations);let x=!1;f&&y?f.data.isEqual(y.data)?T!==E&&(s.track({type:3,doc:y}),x=!0):this.ga(f,y)||(s.track({type:2,doc:y}),x=!0,(c&&this.Aa(y,c)>0||d&&this.Aa(y,d)<0)&&(a=!0)):!f&&y?(s.track({type:0,doc:y}),x=!0):f&&!y&&(s.track({type:1,doc:f}),x=!0,(c||d)&&(a=!0)),x&&(y?(o=o.add(y),i=E?i.add(h):i.delete(h)):(o=o.delete(h),i=i.delete(h)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const h=this.query.limitType==="F"?o.last():o.first();o=o.delete(h.key),i=i.delete(h.key),s.track({type:1,doc:h})}return{Ra:o,fa:s,ns:a,mutatedKeys:i}}ga(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,s,r){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((h,m)=>function(y,T){const E=x=>{switch(x){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Z()}};return E(y)-E(T)}(h.type,m.type)||this.Aa(h.doc,m.doc)),this.pa(s),r=r!=null&&r;const a=n&&!r?this.ya():[],c=this.da.size===0&&this.current&&!r?1:0,d=c!==this.Ea;return this.Ea=c,o.length!==0||d?{snapshot:new Qr(this.query,e.Ra,i,o,e.mutatedKeys,c===0,d,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:a}:{wa:a}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Sf,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(n=>this.Ta=this.Ta.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ta=this.Ta.delete(n)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=le(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const n=[];return e.forEach(s=>{this.da.has(s)||n.push(new ig(s))}),this.da.forEach(s=>{e.has(s)||n.push(new rg(s))}),n}ba(e){this.Ta=e.Ts,this.da=le();const n=this.ma(e.documents);return this.applyChanges(n,!0)}Da(){return Qr.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class KT{constructor(e,n,s){this.query=e,this.targetId=n,this.view=s}}class QT{constructor(e){this.key=e,this.va=!1}}class JT{constructor(e,n,s,r,i,o){this.localStore=e,this.remoteStore=n,this.eventManager=s,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new ai(a=>Tm(a),Ka),this.Ma=new Map,this.xa=new Set,this.Oa=new Me(G.comparator),this.Na=new Map,this.La=new Sd,this.Ba={},this.ka=new Map,this.qa=Kr.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function XT(t,e,n=!0){const s=ug(t);let r;const i=s.Fa.get(e);return i?(s.sharedClientState.addLocalQueryTarget(i.targetId),r=i.view.Da()):r=await og(s,e,n,!0),r}async function ZT(t,e){const n=ug(t);await og(n,e,!0,!1)}async function og(t,e,n,s){const r=await ET(t.localStore,wn(e)),i=r.targetId,o=t.sharedClientState.addLocalQueryTarget(i,n);let a;return s&&(a=await eI(t,e,i,o==="current",r.resumeToken)),t.isPrimaryClient&&n&&Km(t.remoteStore,r),a}async function eI(t,e,n,s,r){t.Ka=(m,f,y)=>async function(E,x,C,P){let D=x.view.ma(C);D.ns&&(D=await Ef(E.localStore,x.query,!1).then(({documents:w})=>x.view.ma(w,D)));const R=P&&P.targetChanges.get(x.targetId),B=P&&P.targetMismatches.get(x.targetId)!=null,N=x.view.applyChanges(D,E.isPrimaryClient,R,B);return Cf(E,x.targetId,N.wa),N.snapshot}(t,m,f,y);const i=await Ef(t.localStore,e,!0),o=new jT(e,i.Ts),a=o.ma(i.documents),c=xo.createSynthesizedTargetChangeForCurrentChange(n,s&&t.onlineState!=="Offline",r),d=o.applyChanges(a,t.isPrimaryClient,c);Cf(t,n,d.wa);const h=new KT(e,n,o);return t.Fa.set(e,h),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),d.snapshot}async function tI(t,e,n){const s=ne(t),r=s.Fa.get(e),i=s.Ma.get(r.targetId);if(i.length>1)return s.Ma.set(r.targetId,i.filter(o=>!Ka(o,e))),void s.Fa.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(r.targetId),s.sharedClientState.isActiveQueryTarget(r.targetId)||await Sc(s.localStore,r.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(r.targetId),n&&kd(s.remoteStore,r.targetId),Ac(s,r.targetId)}).catch(To)):(Ac(s,r.targetId),await Sc(s.localStore,r.targetId,!0))}async function nI(t,e){const n=ne(t),s=n.Fa.get(e),r=n.Ma.get(s.targetId);n.isPrimaryClient&&r.length===1&&(n.sharedClientState.removeLocalQueryTarget(s.targetId),kd(n.remoteStore,s.targetId))}async function sI(t,e,n){const s=dI(t);try{const r=await function(o,a){const c=ne(o),d=We.now(),h=a.reduce((y,T)=>y.add(T.key),le());let m,f;return c.persistence.runTransaction("Locally write mutations","readwrite",y=>{let T=Xn(),E=le();return c.cs.getEntries(y,h).next(x=>{T=x,T.forEach((C,P)=>{P.isValidDocument()||(E=E.add(C))})}).next(()=>c.localDocuments.getOverlayedDocuments(y,T)).next(x=>{m=x;const C=[];for(const P of a){const D=S_(P,m.get(P.key).overlayedDocument);D!=null&&C.push(new Ns(P.key,D,mm(D.value.mapValue),Mt.exists(!0)))}return c.mutationQueue.addMutationBatch(y,d,C,a)}).next(x=>{f=x;const C=x.applyToLocalDocumentSet(m,E);return c.documentOverlayCache.saveOverlays(y,x.batchId,C)})}).then(()=>({batchId:f.batchId,changes:xm(m)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),function(o,a,c){let d=o.Ba[o.currentUser.toKey()];d||(d=new Me(ge)),d=d.insert(a,c),o.Ba[o.currentUser.toKey()]=d}(s,r.batchId,n),await ko(s,r.changes),await sl(s.remoteStore)}catch(r){const i=Dd(r,"Failed to persist write");n.reject(i)}}async function ag(t,e){const n=ne(t);try{const s=await vT(n.localStore,e);e.targetChanges.forEach((r,i)=>{const o=n.Na.get(i);o&&(Ee(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1),r.addedDocuments.size>0?o.va=!0:r.modifiedDocuments.size>0?Ee(o.va):r.removedDocuments.size>0&&(Ee(o.va),o.va=!1))}),await ko(n,s,e)}catch(s){await To(s)}}function kf(t,e,n){const s=ne(t);if(s.isPrimaryClient&&n===0||!s.isPrimaryClient&&n===1){const r=[];s.Fa.forEach((i,o)=>{const a=o.view.Z_(e);a.snapshot&&r.push(a.snapshot)}),function(o,a){const c=ne(o);c.onlineState=a;let d=!1;c.queries.forEach((h,m)=>{for(const f of m.j_)f.Z_(a)&&(d=!0)}),d&&Bd(c)}(s.eventManager,e),r.length&&s.Ca.d_(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function rI(t,e,n){const s=ne(t);s.sharedClientState.updateQueryState(e,"rejected",n);const r=s.Na.get(e),i=r&&r.key;if(i){let o=new Me(G.comparator);o=o.insert(i,vt.newNoDocument(i,te.min()));const a=le().add(i),c=new el(te.min(),new Map,new Me(ge),o,a);await ag(s,c),s.Oa=s.Oa.remove(i),s.Na.delete(e),Ld(s)}else await Sc(s.localStore,e,!1).then(()=>Ac(s,e,n)).catch(To)}async function iI(t,e){const n=ne(t),s=e.batch.batchId;try{const r=await yT(n.localStore,e);cg(n,s,null),lg(n,s),n.sharedClientState.updateMutationState(s,"acknowledged"),await ko(n,r)}catch(r){await To(r)}}async function oI(t,e,n){const s=ne(t);try{const r=await function(o,a){const c=ne(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let h;return c.mutationQueue.lookupMutationBatch(d,a).next(m=>(Ee(m!==null),h=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,h,a)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,h)).next(()=>c.localDocuments.getDocuments(d,h))})}(s.localStore,e);cg(s,e,n),lg(s,e),s.sharedClientState.updateMutationState(e,"rejected",n),await ko(s,r)}catch(r){await To(r)}}function lg(t,e){(t.ka.get(e)||[]).forEach(n=>{n.resolve()}),t.ka.delete(e)}function cg(t,e,n){const s=ne(t);let r=s.Ba[s.currentUser.toKey()];if(r){const i=r.get(e);i&&(n?i.reject(n):i.resolve(),r=r.remove(e)),s.Ba[s.currentUser.toKey()]=r}}function Ac(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const s of t.Ma.get(e))t.Fa.delete(s),n&&t.Ca.$a(s,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(s=>{t.La.containsKey(s)||dg(t,s)})}function dg(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);n!==null&&(kd(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),Ld(t))}function Cf(t,e,n){for(const s of n)s instanceof rg?(t.La.addReference(s.key,e),aI(t,s)):s instanceof ig?(H("SyncEngine","Document no longer in limbo: "+s.key),t.La.removeReference(s.key,e),t.La.containsKey(s.key)||dg(t,s.key)):Z()}function aI(t,e){const n=e.key,s=n.path.canonicalString();t.Oa.get(n)||t.xa.has(s)||(H("SyncEngine","New document in limbo: "+n),t.xa.add(s),Ld(t))}function Ld(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new G(ke.fromString(e)),s=t.qa.next();t.Na.set(s,new QT(n)),t.Oa=t.Oa.insert(n,s),Km(t.remoteStore,new _s(wn(wd(n.path)),s,"TargetPurposeLimboResolution",pd.oe))}}async function ko(t,e,n){const s=ne(t),r=[],i=[],o=[];s.Fa.isEmpty()||(s.Fa.forEach((a,c)=>{o.push(s.Ka(c,e,n).then(d=>{var h;if((d||n)&&s.isPrimaryClient){const m=d?!d.fromCache:(h=n==null?void 0:n.targetChanges.get(c.targetId))===null||h===void 0?void 0:h.current;s.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){r.push(d);const m=Ad.Wi(c.targetId,d);i.push(m)}}))}),await Promise.all(o),s.Ca.d_(r),await async function(c,d){const h=ne(c);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>F.forEach(d,f=>F.forEach(f.$i,y=>h.persistence.referenceDelegate.addReference(m,f.targetId,y)).next(()=>F.forEach(f.Ui,y=>h.persistence.referenceDelegate.removeReference(m,f.targetId,y)))))}catch(m){if(!Io(m))throw m;H("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const f=m.targetId;if(!m.fromCache){const y=h.os.get(f),T=y.snapshotVersion,E=y.withLastLimboFreeSnapshotVersion(T);h.os=h.os.insert(f,E)}}}(s.localStore,i))}async function lI(t,e){const n=ne(t);if(!n.currentUser.isEqual(e)){H("SyncEngine","User change. New user:",e.toKey());const s=await Wm(n.localStore,e);n.currentUser=e,function(i,o){i.ka.forEach(a=>{a.forEach(c=>{c.reject(new $(L.CANCELLED,o))})}),i.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await ko(n,s.hs)}}function cI(t,e){const n=ne(t),s=n.Na.get(e);if(s&&s.va)return le().add(s.key);{let r=le();const i=n.Ma.get(e);if(!i)return r;for(const o of i){const a=n.Fa.get(o);r=r.unionWith(a.view.Va)}return r}}function ug(t){const e=ne(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=ag.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=cI.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=rI.bind(null,e),e.Ca.d_=YT.bind(null,e.eventManager),e.Ca.$a=GT.bind(null,e.eventManager),e}function dI(t){const e=ne(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=iI.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=oI.bind(null,e),e}class Na{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=tl(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return gT(this.persistence,new pT,e.initialUser,this.serializer)}Ga(e){return new uT(xd.Zr,this.serializer)}Wa(e){return new TT}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Na.provider={build:()=>new Na};class kc{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>kf(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=lI.bind(null,this.syncEngine),await qT(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new WT}()}createDatastore(e){const n=tl(e.databaseInfo.databaseId),s=function(i){return new AT(i)}(e.databaseInfo);return function(i,o,a,c){return new PT(i,o,a,c)}(e.authCredentials,e.appCheckCredentials,s,n)}createRemoteStore(e){return function(s,r,i,o,a){return new MT(s,r,i,o,a)}(this.localStore,this.datastore,e.asyncQueue,n=>kf(this.syncEngine,n,0),function(){return Tf.D()?new Tf:new IT}())}createSyncEngine(e,n){return function(r,i,o,a,c,d,h){const m=new JT(r,i,o,a,c,d);return h&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(r){const i=ne(r);H("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await Ao(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}kc.provider={build:()=>new kc};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class hg{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Jn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uI{constructor(e,n,s,r,i){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=s,this.databaseInfo=r,this.user=yt.UNAUTHENTICATED,this.clientId=hm.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(s,async o=>{H("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(s,o=>(H("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Yn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const s=Dd(n,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function Zl(t,e){t.asyncQueue.verifyOperationInProgress(),H("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let s=n.initialUser;t.setCredentialChangeListener(async r=>{s.isEqual(r)||(await Wm(e.localStore,r),s=r)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function Pf(t,e){t.asyncQueue.verifyOperationInProgress();const n=await hI(t);H("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(s=>If(e.remoteStore,s)),t.setAppCheckTokenChangeListener((s,r)=>If(e.remoteStore,r)),t._onlineComponents=e}async function hI(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){H("FirestoreClient","Using user provided OfflineComponentProvider");try{await Zl(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(r){return r.name==="FirebaseError"?r.code===L.FAILED_PRECONDITION||r.code===L.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11}(n))throw n;Wr("Error using user provided cache. Falling back to memory cache: "+n),await Zl(t,new Na)}}else H("FirestoreClient","Using default OfflineComponentProvider"),await Zl(t,new Na);return t._offlineComponents}async function fg(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(H("FirestoreClient","Using user provided OnlineComponentProvider"),await Pf(t,t._uninitializedComponentsProvider._online)):(H("FirestoreClient","Using default OnlineComponentProvider"),await Pf(t,new kc))),t._onlineComponents}function fI(t){return fg(t).then(e=>e.syncEngine)}async function pg(t){const e=await fg(t),n=e.eventManager;return n.onListen=XT.bind(null,e.syncEngine),n.onUnlisten=tI.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=ZT.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=nI.bind(null,e.syncEngine),n}function pI(t,e,n={}){const s=new Yn;return t.asyncQueue.enqueueAndForget(async()=>function(i,o,a,c,d){const h=new hg({next:f=>{h.Za(),o.enqueueAndForget(()=>ng(i,m));const y=f.docs.has(a);!y&&f.fromCache?d.reject(new $(L.UNAVAILABLE,"Failed to get document because the client is offline.")):y&&f.fromCache&&c&&c.source==="server"?d.reject(new $(L.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(f)},error:f=>d.reject(f)}),m=new sg(wd(a.path),h,{includeMetadataChanges:!0,_a:!0});return tg(i,m)}(await pg(t),t.asyncQueue,e,n,s)),s.promise}function mI(t,e,n={}){const s=new Yn;return t.asyncQueue.enqueueAndForget(async()=>function(i,o,a,c,d){const h=new hg({next:f=>{h.Za(),o.enqueueAndForget(()=>ng(i,m)),f.fromCache&&c.source==="server"?d.reject(new $(L.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(f)},error:f=>d.reject(f)}),m=new sg(a,h,{includeMetadataChanges:!0,_a:!0});return tg(i,m)}(await pg(t),t.asyncQueue,e,n,s)),s.promise}/**
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
 */function mg(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rf=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gg(t,e,n){if(!n)throw new $(L.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function gI(t,e,n,s){if(e===!0&&s===!0)throw new $(L.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function Mf(t){if(!G.isDocumentKey(t))throw new $(L.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Df(t){if(G.isDocumentKey(t))throw new $(L.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function rl(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":Z()}function Xt(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new $(L.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=rl(t);throw new $(L.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}function yI(t,e){if(e<=0)throw new $(L.INVALID_ARGUMENT,`Function ${t}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bf{constructor(e){var n,s;if(e.host===void 0){if(e.ssl!==void 0)throw new $(L.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new $(L.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}gI("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=mg((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new $(L.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new $(L.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new $(L.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,r){return s.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class il{constructor(e,n,s,r){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Bf({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new $(L.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new $(L.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Bf(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new DE;switch(s.type){case"firstParty":return new OE(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new $(L.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const s=Rf.get(n);s&&(H("ComponentProvider","Removing Datastore"),Rf.delete(n),s.terminate())}(this),Promise.resolve()}}function vI(t,e,n,s={}){var r;const i=(t=Xt(t,il))._getSettings(),o=`${e}:${n}`;if(i.host!=="firestore.googleapis.com"&&i.host!==o&&Wr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},i),{host:o,ssl:!1})),s.mockUserToken){let a,c;if(typeof s.mockUserToken=="string")a=s.mockUserToken,c=yt.MOCK_USER;else{a=U0(s.mockUserToken,(r=t._app)===null||r===void 0?void 0:r.options.projectId);const d=s.mockUserToken.sub||s.mockUserToken.user_id;if(!d)throw new $(L.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new yt(d)}t._authCredentials=new BE(new um(a,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(e,n,s){this.converter=n,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Os(this.firestore,e,this._query)}}class Dt{constructor(e,n,s){this.converter=n,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ks(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Dt(this.firestore,e,this._key)}}class ks extends Os{constructor(e,n,s){super(e,n,wd(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Dt(this.firestore,null,new G(e))}withConverter(e){return new ks(this.firestore,e,this._path)}}function Nd(t,e,...n){if(t=Re(t),gg("collection","path",e),t instanceof il){const s=ke.fromString(e,...n);return Df(s),new ks(t,null,s)}{if(!(t instanceof Dt||t instanceof ks))throw new $(L.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(ke.fromString(e,...n));return Df(s),new ks(t.firestore,null,s)}}function Rt(t,e,...n){if(t=Re(t),arguments.length===1&&(e=hm.newId()),gg("doc","path",e),t instanceof il){const s=ke.fromString(e,...n);return Mf(s),new Dt(t,null,new G(s))}{if(!(t instanceof Dt||t instanceof ks))throw new $(L.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(ke.fromString(e,...n));return Mf(s),new Dt(t.firestore,t instanceof ks?t.converter:null,new G(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lf{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Gm(this,"async_queue_retry"),this.Vu=()=>{const s=Xl();s&&H("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=e;const n=Xl();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=Xl();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new Yn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Io(e))throw e;H("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(s=>{this.Eu=s,this.du=!1;const r=function(o){let a=o.message||"";return o.stack&&(a=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),a}(s);throw Jn("INTERNAL UNHANDLED ERROR: ",r),s}).then(s=>(this.du=!1,s))));return this.mu=n,n}enqueueAfterDelay(e,n,s){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const r=Md.createAndSchedule(this,e,n,s,i=>this.yu(i));return this.Tu.push(r),r}fu(){this.Eu&&Z()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,s)=>n.targetTimeMs-s.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}class Fs extends il{constructor(e,n,s,r){super(e,n,s,r),this.type="firestore",this._queue=new Lf,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Lf(e),this._firestoreClient=void 0,await e}}}function bI(t,e){const n=typeof t=="object"?t:Ep(),s=typeof t=="string"?t:"(default)",r=td(n,"firestore").getImmediate({identifier:s});if(!r._initialized){const i=V0("firestore");i&&vI(r,...i)}return r}function ol(t){if(t._terminated)throw new $(L.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||wI(t),t._firestoreClient}function wI(t){var e,n,s;const r=t._freezeSettings(),i=function(a,c,d,h){return new QE(a,c,d,h.host,h.ssl,h.experimentalForceLongPolling,h.experimentalAutoDetectLongPolling,mg(h.experimentalLongPollingOptions),h.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,r);t._componentsProvider||!((n=r.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((s=r.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(t._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),t._firestoreClient=new uI(t._authCredentials,t._appCheckCredentials,t._queue,i,t._componentsProvider&&function(a){const c=a==null?void 0:a._online.build();return{_offline:a==null?void 0:a._offline.build(c),_online:c}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jr{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Jr(at.fromBase64String(e))}catch(n){throw new $(L.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Jr(at.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new $(L.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new rt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class al{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Od{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new $(L.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new $(L.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ge(this._lat,e._lat)||ge(this._long,e._long)}}/**
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
 */class Fd{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,r){if(s.length!==r.length)return!1;for(let i=0;i<s.length;++i)if(s[i]!==r[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const EI=/^__.*__$/;class _I{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return this.fieldMask!==null?new Ns(e,this.data,this.fieldMask,n,this.fieldTransforms):new So(e,this.data,n,this.fieldTransforms)}}class yg{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return new Ns(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function vg(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Z()}}class Vd{constructor(e,n,s,r,i,o){this.settings=e,this.databaseId=n,this.serializer=s,this.ignoreUndefinedProperties=r,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Vd(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Fu({path:s,xu:!1});return r.Ou(e),r}Nu(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Fu({path:s,xu:!1});return r.vu(),r}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Oa(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(vg(this.Cu)&&EI.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class TI{constructor(e,n,s){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=s||tl(e)}Qu(e,n,s,r=!1){return new Vd({Cu:e,methodName:n,qu:s,path:rt.emptyPath(),xu:!1,ku:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Po(t){const e=t._freezeSettings(),n=tl(t._databaseId);return new TI(t._databaseId,!!e.ignoreUndefinedProperties,n)}function zd(t,e,n,s,r,i={}){const o=t.Qu(i.merge||i.mergeFields?2:0,e,n,r);$d("Data must be an object, but it was:",o,s);const a=Eg(s,o);let c,d;if(i.merge)c=new qt(o.fieldMask),d=o.fieldTransforms;else if(i.mergeFields){const h=[];for(const m of i.mergeFields){const f=Cc(e,m,n);if(!o.contains(f))throw new $(L.INVALID_ARGUMENT,`Field '${f}' is specified in your field mask but missing from your input data.`);Tg(h,f)||h.push(f)}c=new qt(h),d=o.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=o.fieldTransforms;return new _I(new Ot(a),c,d)}class ll extends al{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ll}}class Ud extends al{_toFieldTransform(e){return new E_(e.path,new to)}isEqual(e){return e instanceof Ud}}function bg(t,e,n,s){const r=t.Qu(1,e,n);$d("Data must be an object, but it was:",r,s);const i=[],o=Ot.empty();vr(s,(c,d)=>{const h=qd(e,c,n);d=Re(d);const m=r.Nu(h);if(d instanceof ll)i.push(h);else{const f=Ro(d,m);f!=null&&(i.push(h),o.set(h,f))}});const a=new qt(i);return new yg(o,a,r.fieldTransforms)}function wg(t,e,n,s,r,i){const o=t.Qu(1,e,n),a=[Cc(e,s,n)],c=[r];if(i.length%2!=0)throw new $(L.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let f=0;f<i.length;f+=2)a.push(Cc(e,i[f])),c.push(i[f+1]);const d=[],h=Ot.empty();for(let f=a.length-1;f>=0;--f)if(!Tg(d,a[f])){const y=a[f];let T=c[f];T=Re(T);const E=o.Nu(y);if(T instanceof ll)d.push(y);else{const x=Ro(T,E);x!=null&&(d.push(y),h.set(y,x))}}const m=new qt(d);return new yg(h,m,o.fieldTransforms)}function II(t,e,n,s=!1){return Ro(n,t.Qu(s?4:3,e))}function Ro(t,e){if(_g(t=Re(t)))return $d("Unsupported field value:",e,t),Eg(t,e);if(t instanceof al)return function(s,r){if(!vg(r.Cu))throw r.Bu(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r.Bu(`${s._methodName}() is not currently supported inside arrays`);const i=s._toFieldTransform(r);i&&r.fieldTransforms.push(i)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(s,r){const i=[];let o=0;for(const a of s){let c=Ro(a,r.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),o++}return{arrayValue:{values:i}}}(t,e)}return function(s,r){if((s=Re(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return v_(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const i=We.fromDate(s);return{timestampValue:Ba(r.serializer,i)}}if(s instanceof We){const i=new We(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Ba(r.serializer,i)}}if(s instanceof Od)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Jr)return{bytesValue:Fm(r.serializer,s._byteString)};if(s instanceof Dt){const i=r.databaseId,o=s.firestore._databaseId;if(!o.isEqual(i))throw r.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Id(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof Fd)return function(o,a){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw a.Bu("VectorValues must only contain numeric values.");return Ed(a.serializer,c)})}}}}}}(s,r);throw r.Bu(`Unsupported field value: ${rl(s)}`)}(t,e)}function Eg(t,e){const n={};return fm(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):vr(t,(s,r)=>{const i=Ro(r,e.Mu(s));i!=null&&(n[s]=i)}),{mapValue:{fields:n}}}function _g(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof We||t instanceof Od||t instanceof Jr||t instanceof Dt||t instanceof al||t instanceof Fd)}function $d(t,e,n){if(!_g(n)||!function(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}(n)){const s=rl(n);throw s==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+s)}}function Cc(t,e,n){if((e=Re(e))instanceof Co)return e._internalPath;if(typeof e=="string")return qd(t,e);throw Oa("Field path arguments must be of type string or ",t,!1,void 0,n)}const SI=new RegExp("[~\\*/\\[\\]]");function qd(t,e,n){if(e.search(SI)>=0)throw Oa(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Co(...e.split("."))._internalPath}catch{throw Oa(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Oa(t,e,n,s,r){const i=s&&!s.isEmpty(),o=r!==void 0;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${s}`),o&&(c+=` in document ${r}`),c+=")"),new $(L.INVALID_ARGUMENT,a+t+c)}function Tg(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ig{constructor(e,n,s,r,i){this._firestore=e,this._userDataWriter=n,this._key=s,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Dt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new xI(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Hd("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class xI extends Ig{data(){return super.data()}}function Hd(t,e){return typeof e=="string"?qd(t,e):e instanceof Co?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AI(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new $(L.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Wd{}class Yd extends Wd{}function kI(t,e,...n){let s=[];e instanceof Wd&&s.push(e),s=s.concat(n),function(i){const o=i.filter(c=>c instanceof jd).length,a=i.filter(c=>c instanceof Gd).length;if(o>1||o>0&&a>0)throw new $(L.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const r of s)t=r._apply(t);return t}class Gd extends Yd{constructor(e,n,s){super(),this._field=e,this._op=n,this._value=s,this.type="where"}static _create(e,n,s){return new Gd(e,n,s)}_apply(e){const n=this._parse(e);return Sg(e._query,n),new Os(e.firestore,e.converter,wc(e._query,n))}_parse(e){const n=Po(e.firestore);return function(i,o,a,c,d,h,m){let f;if(d.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new $(L.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){Of(m,h);const y=[];for(const T of m)y.push(Nf(c,i,T));f={arrayValue:{values:y}}}else f=Nf(c,i,m)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||Of(m,h),f=II(a,o,m,h==="in"||h==="not-in");return Ue.create(d,h,f)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}class jd extends Wd{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new jd(e,n)}_parse(e){const n=this._queryConstraints.map(s=>s._parse(e)).filter(s=>s.getFilters().length>0);return n.length===1?n[0]:pn.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(r,i){let o=r;const a=i.getFlattenedFilters();for(const c of a)Sg(o,c),o=wc(o,c)}(e._query,n),new Os(e.firestore,e.converter,wc(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Kd extends Yd{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new Kd(e,n)}_apply(e){const n=function(r,i,o){if(r.startAt!==null)throw new $(L.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(r.endAt!==null)throw new $(L.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new eo(i,o)}(e._query,this._field,this._direction);return new Os(e.firestore,e.converter,function(r,i){const o=r.explicitOrderBy.concat([i]);return new oi(r.path,r.collectionGroup,o,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}(e._query,n))}}function CI(t,e="asc"){const n=e,s=Hd("orderBy",t);return Kd._create(s,n)}class Qd extends Yd{constructor(e,n,s){super(),this.type=e,this._limit=n,this._limitType=s}static _create(e,n,s){return new Qd(e,n,s)}_apply(e){return new Os(e.firestore,e.converter,Ma(e._query,this._limit,this._limitType))}}function PI(t){return yI("limit",t),Qd._create("limit",t,"F")}function Nf(t,e,n){if(typeof(n=Re(n))=="string"){if(n==="")throw new $(L.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!_m(e)&&n.indexOf("/")!==-1)throw new $(L.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const s=e.path.child(ke.fromString(n));if(!G.isDocumentKey(s))throw new $(L.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return sf(t,new G(s))}if(n instanceof Dt)return sf(t,n._key);throw new $(L.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${rl(n)}.`)}function Of(t,e){if(!Array.isArray(t)||t.length===0)throw new $(L.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Sg(t,e){const n=function(r,i){for(const o of r)for(const a of o.getFlattenedFilters())if(i.indexOf(a.op)>=0)return a.op;return null}(t.filters,function(r){switch(r){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new $(L.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new $(L.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class RI{convertValue(e,n="none"){switch(dr(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Le(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(cr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw Z()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const s={};return vr(e,(r,i)=>{s[r]=this.convertValue(i,n)}),s}convertVectorValue(e){var n,s,r;const i=(r=(s=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||s===void 0?void 0:s.values)===null||r===void 0?void 0:r.map(o=>Le(o.doubleValue));return new Fd(i)}convertGeoPoint(e){return new Od(Le(e.latitude),Le(e.longitude))}convertArray(e,n){return(e.values||[]).map(s=>this.convertValue(s,n))}convertServerTimestamp(e,n){switch(n){case"previous":const s=gd(e);return s==null?null:this.convertValue(s,n);case"estimate":return this.convertTimestamp(Ji(e));default:return null}}convertTimestamp(e){const n=Ms(e);return new We(n.seconds,n.nanos)}convertDocumentKey(e,n){const s=ke.fromString(e);Ee(Hm(s));const r=new Xi(s.get(1),s.get(3)),i=new G(s.popFirst(5));return r.isEqual(n)||Jn(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jd(t,e,n){let s;return s=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bi{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class xg extends Ig{constructor(e,n,s,r,i,o){super(e,n,s,r,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new fa(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const s=this._document.data.field(Hd("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,n.serverTimestamps)}}}class fa extends xg{data(e={}){return super.data(e)}}class MI{constructor(e,n,s,r){this._firestore=e,this._userDataWriter=n,this._snapshot=r,this.metadata=new Bi(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(s=>{e.call(n,new fa(this._firestore,this._userDataWriter,s.key,s,new Bi(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new $(L.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(r,i){if(r._snapshot.oldDocs.isEmpty()){let o=0;return r._snapshot.docChanges.map(a=>{const c=new fa(r._firestore,r._userDataWriter,a.doc.key,a.doc,new Bi(r._snapshot.mutatedKeys.has(a.doc.key),r._snapshot.fromCache),r.query.converter);return a.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=r._snapshot.oldDocs;return r._snapshot.docChanges.filter(a=>i||a.type!==3).map(a=>{const c=new fa(r._firestore,r._userDataWriter,a.doc.key,a.doc,new Bi(r._snapshot.mutatedKeys.has(a.doc.key),r._snapshot.fromCache),r.query.converter);let d=-1,h=-1;return a.type!==0&&(d=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),h=o.indexOf(a.doc.key)),{type:DI(a.type),doc:c,oldIndex:d,newIndex:h}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function DI(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Z()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Li(t){t=Xt(t,Dt);const e=Xt(t.firestore,Fs);return pI(ol(e),t._key).then(n=>LI(e,t,n))}class Ag extends RI{constructor(e){super(),this.firestore=e}convertBytes(e){return new Jr(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Dt(this.firestore,null,n)}}function kg(t){t=Xt(t,Os);const e=Xt(t.firestore,Fs),n=ol(e),s=new Ag(e);return AI(t._query),mI(n,t._query).then(r=>new MI(e,s,t,r))}function Xd(t,e,n){t=Xt(t,Dt);const s=Xt(t.firestore,Fs),r=Jd(t.converter,e,n);return Mo(s,[zd(Po(s),"setDoc",t._key,r,t.converter!==null,n).toMutation(t._key,Mt.none())])}function BI(t,e,n,...s){t=Xt(t,Dt);const r=Xt(t.firestore,Fs),i=Po(r);let o;return o=typeof(e=Re(e))=="string"||e instanceof Co?wg(i,"updateDoc",t._key,e,n,s):bg(i,"updateDoc",t._key,e),Mo(r,[o.toMutation(t._key,Mt.exists(!0))])}function cl(t){return Mo(Xt(t.firestore,Fs),[new Za(t._key,Mt.none())])}function Cg(t,e){const n=Xt(t.firestore,Fs),s=Rt(t),r=Jd(t.converter,e);return Mo(n,[zd(Po(t.firestore),"addDoc",s._key,r,t.converter!==null,{}).toMutation(s._key,Mt.exists(!1))]).then(()=>s)}function Mo(t,e){return function(s,r){const i=new Yn;return s.asyncQueue.enqueueAndForget(async()=>sI(await fI(s),r,i)),i.promise}(ol(t),e)}function LI(t,e,n){const s=n.docs.get(e._key),r=new Ag(t);return new xg(t,r,e._key,s,new Bi(n.hasPendingWrites,n.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NI{constructor(e,n){this._firestore=e,this._commitHandler=n,this._mutations=[],this._committed=!1,this._dataReader=Po(e)}set(e,n,s){this._verifyNotCommitted();const r=ec(e,this._firestore),i=Jd(r.converter,n,s),o=zd(this._dataReader,"WriteBatch.set",r._key,i,r.converter!==null,s);return this._mutations.push(o.toMutation(r._key,Mt.none())),this}update(e,n,s,...r){this._verifyNotCommitted();const i=ec(e,this._firestore);let o;return o=typeof(n=Re(n))=="string"||n instanceof Co?wg(this._dataReader,"WriteBatch.update",i._key,n,s,r):bg(this._dataReader,"WriteBatch.update",i._key,n),this._mutations.push(o.toMutation(i._key,Mt.exists(!0))),this}delete(e){this._verifyNotCommitted();const n=ec(e,this._firestore);return this._mutations=this._mutations.concat(new Za(n._key,Mt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new $(L.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function ec(t,e){if((t=Re(t)).firestore!==e)throw new $(L.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return t}function Zd(){return new Ud("serverTimestamp")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pg(t){return ol(t=Xt(t,Fs)),new NI(t,e=>Mo(t,e))}(function(e,n=!0){(function(r){ii=r})(si),qr(new ir("firestore",(s,{instanceIdentifier:r,options:i})=>{const o=s.getProvider("app").getImmediate(),a=new Fs(new LE(s.getProvider("auth-internal")),new VE(s.getProvider("app-check-internal")),function(d,h){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new $(L.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Xi(d.options.projectId,h)}(o,r),o);return i=Object.assign({useFetchStreams:n},i),a._setSettings(i),a},"PUBLIC").setMultipleInstances(!0)),As(Xh,"4.7.3",e),As(Xh,"4.7.3","esm2017")})();const Rg={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"};function De(){return Rg.apiKey!=="YOUR_API_KEY"}let tc=null,Et=null,Se=null;try{De()?(tc=wp(Rg),Et=RE(tc),Se=bI(tc)):console.warn("Firebase not configured. Login required to save data.")}catch(t){console.error("Firebase initialization error:",t)}const OI=new zn;let bt=null,qi=[];function FI(){if(!De()||!Et){console.warn("Firebase not configured - auth disabled");return}vw(Et,t=>{console.log("onAuthStateChanged fired:",t?t.email:"null"),bt=t,console.log("Notifying",qi.length,"listeners"),qi.forEach(e=>e(t))})}function Mg(t){return console.log("onAuthStateChange: adding listener, currentUser is:",bt&&bt.email),qi.push(t),bt&&(console.log("onAuthStateChange: immediately calling listener with user"),t(bt)),()=>{qi=qi.filter(e=>e!==t)}}function xn(){return bt}function lt(){return bt!==null}async function VI(t,e,n=null){if(!De()||!Et)throw new Error("Firebase not configured");const s=await hw(Et,t,e);n&&s.user&&await mw(s.user,{displayName:n});try{await Gp(s.user)}catch(r){console.error("Failed to send verification email:",r)}return s}async function zI(){if(!De()||!Et||!bt)throw new Error("Not logged in");return Gp(bt)}async function UI(){return bt?(await bt.reload(),bt=Et.currentUser,bt):null}async function $I(t,e){if(!De()||!Et)throw new Error("Firebase not configured");return fw(Et,t,e)}async function qI(){if(!De()||!Et)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const t=await zw(Et,OI);return console.log("Google sign-in successful:",t.user.email),t}catch(t){throw console.error("signInWithPopup error:",t.code,t.message),t}}async function eu(){if(!De()||!Et)throw new Error("Firebase not configured");return bw(Et)}async function HI(t){if(!De()||!Et)throw new Error("Firebase not configured");return uw(Et,t)}async function WI(){if(!De()||!Et||!bt)throw new Error("Not logged in");return ww(bt)}FI();function Cr(...t){return t.find(e=>e!==void 0)}function YI(t){if(!t||typeof t!="object")return{scenario:t,migrated:!1};const e=Object.keys(t).filter(c=>c.includes(".")),n="decisionSettings"in t||"stressSettings"in t||"name"in t||"description"in t||"taxYears"in t;if(!(e.length>0||n))return{scenario:t,migrated:!1};const r=t.decisionTool||{},i=t.stressTool||{},o=t.planDetails||{},a={isActive:t.isActive??!1,enabledTools:t.enabledTools||["stress","decision"],planDetails:{name:Cr(t["planDetails.name"],o.name,t.name)??"My Plan",description:Cr(t["planDetails.description"],o.description,t.description)??""},decisionTool:{settings:Cr(t["decisionTool.settings"],r.settings,t.decisionSettings)??{},history:Cr(t["decisionTool.history"],r.history)??[],taxYears:Cr(t["decisionTool.taxYears"],r.taxYears,t.taxYears)??{}},stressTool:{settings:Cr(t["stressTool.settings"],i.settings,t.stressSettings)??{}}};return t.id!==void 0&&(a.id=t.id),t.createdAt!==void 0&&(a.createdAt=t.createdAt),t.lastModified!==void 0&&(a.lastModified=t.lastModified),{scenario:a,migrated:!0}}function tu(t,e="settings"){const n=xn();return!n||!Se?null:Rt(Se,"users",n.uid,t,e)}function Dg(t){const e=xn();return!e||!Se?null:Nd(Se,"users",e.uid,t)}async function Bg(t){const{scenario:e,migrated:n}=YI(t);if(n){const s=xn();if(s&&Se)try{const{id:r,...i}=e;await Xd(Rt(Se,"users",s.uid,"scenarios",r),i)}catch(r){console.error("Scenario migration write failed:",r)}}return e}async function dl(){if(!De())return[];const t=Dg("scenarios");if(!t)return[];try{const e=await kg(t),n=[];return e.forEach(s=>{n.push({id:s.id,...s.data()})}),Promise.all(n.map(s=>Bg(s)))}catch(e){return console.error("Error loading scenarios:",e),[]}}async function GI(t){if(!De())return null;const e=tu("scenarios",t);if(!e)return null;try{const n=await Li(e);return n.exists()?Bg({id:n.id,...n.data()}):null}catch(n){return console.error("Error loading scenario:",n),null}}async function mn(t,e){if(!De())return;const n=tu("scenarios",t);if(n)try{await BI(n,{...e,lastModified:new Date().toISOString()})}catch(s){throw console.error("Error saving scenario:",s),s}}async function Lg(t){if(!De())return null;const e=Dg("scenarios");if(!e)return null;try{return(await Cg(e,{...t,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(n){throw console.error("Error creating scenario:",n),n}}async function jI(t){if(!De())return;const e=tu("scenarios",t);if(e)try{await cl(e)}catch(n){throw console.error("Error deleting scenario:",n),n}}async function nu(t){if(!De())return;const e=xn();if(!(!e||!Se))try{const n=await dl(),s=Pg(Se);for(const r of n){const i=Rt(Se,"users",e.uid,"scenarios",r.id);r.id===t?s.update(i,{isActive:!0}):r.isActive&&s.update(i,{isActive:!1})}await s.commit()}catch(n){throw console.error("Error setting active scenario:",n),n}}async function Ng(){if(!De())return;const t=xn();if(!(!t||!Se))try{const e=await dl(),n=Pg(Se);for(const s of e)n.delete(Rt(Se,"users",t.uid,"scenarios",s.id));n.delete(Rt(Se,"users",t.uid,"profile","settings")),await n.commit(),console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function Og(){return De()?(await dl()).length>0:!1}const Fg={single:{minimum:14400,moderate:31300,comfortable:43100}},Pc={essential:[{label:"Rent / mortgage",period:"mo",hint:"Your regular housing payment"},{label:"Council tax",period:"mo",hint:""},{label:"Gas",period:"mo",hint:""},{label:"Electricity",period:"mo",hint:""},{label:"Water",period:"mo",hint:""},{label:"Broadband",period:"mo",hint:"Broadband tariff"},{label:"Mobile phones",period:"mo",hint:"Mobile phone tariffs"},{label:"TV licence",period:"yr",hint:""},{label:"Groceries & household",period:"mo",hint:"Food and everyday household items"},{label:"Home insurance",period:"yr",hint:"Buildings & contents"},{label:"Car insurance",period:"yr",hint:""},{label:"Car tax",period:"yr",hint:"DVLA vehicle tax"},{label:"Petrol / fuel",period:"mo",hint:""},{label:"Car servicing & maintenance",period:"yr",hint:"Servicing, MOT, repairs — a big replacement is a One-off cost"},{label:"Boiler service",period:"yr",hint:""},{label:"Personal health",period:"mo",hint:"Prescriptions, dental, optical, health cover"},{label:"Kids / dependents",period:"mo",hint:"Supporting children or other dependents"},{label:"Premier banking / account fees",period:"mo",hint:"Packaged or premier account fees"},{label:"Home upkeep",period:"mo",hint:"Routine maintenance & small repairs — big jobs go in One-off costs"}],discretionary:[{label:"Main holiday",period:"yr",hint:"Your big annual holiday"},{label:"UK breaks",period:"yr",hint:"Weekends & short breaks"},{label:"Day trips",period:"mo",hint:""},{label:"Eating out & takeaways",period:"mo",hint:""},{label:"Streaming & entertainment",period:"mo",hint:"Netflix, Amazon Prime, etc."},{label:"Digital subscriptions",period:"mo",hint:"Cloud storage, AI tools, credit-file, TradingView, broker subscriptions"},{label:"Gym & fitness",period:"mo",hint:"Membership & classes"},{label:"Sports & equipment",period:"yr",hint:"Kit and gear"},{label:"Clothes",period:"mo",hint:"Everyday clothing"},{label:"Sports clothes",period:"yr",hint:""},{label:"Hobbies & leisure",period:"mo",hint:""},{label:"Gifts & family",period:"mo",hint:"Presents, helping family"},{label:"Charity",period:"mo",hint:""},{label:"Pets",period:"mo",hint:"Food, insurance, vet (pet health)"},{label:"Personal spending money",period:"mo",hint:"Day-to-day 'spends'"},{label:"Home furnishings & décor",period:"yr",hint:"Soft furnishings, decorating, furniture refresh"},{label:"Home technology",period:"yr",hint:"Phones, laptops, gadgets"},{label:"Emergency buffer",period:"mo",hint:"A monthly set-aside for the unexpected"}]},KI=[{label:"Eating out & takeaways",tier:"discretionary",period:"mo",hint:"Meals out, takeaways, coffees"},{label:"Life insurance / income protection",tier:"essential",period:"mo",hint:"Protection premiums"},{label:"Health / dental insurance",tier:"essential",period:"mo",hint:"Private medical, dental plan, cash plan"},{label:"Dental & optical",tier:"essential",period:"yr",hint:"Check-ups, glasses, treatment not on the NHS"},{label:"Hearing",tier:"essential",period:"yr",hint:"Hearing tests & aids"},{label:"Breakdown cover",tier:"essential",period:"yr",hint:"AA / RAC vehicle breakdown"},{label:"Parking & permits",tier:"essential",period:"yr",hint:"Residents permit, ULEZ / congestion"},{label:"Public transport",tier:"essential",period:"mo",hint:"Bus, rail, rail card"},{label:"Cleaner / gardener",tier:"essential",period:"mo",hint:"Cleaner, window cleaner, gardener"},{label:"Long-term care set-aside",tier:"essential",period:"mo",hint:"A monthly reserve toward possible later-life care (easily forgotten)"},{label:"Christmas & birthdays",tier:"discretionary",period:"yr",hint:"Seasonal gifts & celebrations"},{label:"Alcohol",tier:"discretionary",period:"mo",hint:"Beer, wine, spirits"},{label:"Hairdressing & grooming",tier:"discretionary",period:"mo",hint:"Haircuts, beauty, barber"},{label:"Newspapers, books & media",tier:"discretionary",period:"mo",hint:"Papers, magazines, books"},{label:"Grandchildren",tier:"discretionary",period:"mo",hint:"Treats, days out, help with costs"},{label:"Professional memberships",tier:"discretionary",period:"yr",hint:"Institutes, unions, clubs"},{label:"Second / holiday home",tier:"discretionary",period:"mo",hint:"Running costs of a second property"},{label:"Storage / lock-up",tier:"discretionary",period:"mo",hint:"Self-storage, garage rental"},{label:"My personal spending",tier:"discretionary",period:"mo",hint:"Your own day-to-day 'spends'",paidBy:"me"},{label:"Partner's personal spending",tier:"discretionary",period:"mo",hint:"Your partner's day-to-day 'spends'",paidBy:"partner"}];function ro(t){const e=new Set((t.lines||[]).map(i=>(i.label||"").trim().toLowerCase()).filter(Boolean)),n=[...Pc.essential.map(i=>({...i,tier:"essential"})),...Pc.discretionary.map(i=>({...i,tier:"discretionary"}))],s=new Set,r=[];for(const i of[...KI,...n]){const o=i.label.trim().toLowerCase();e.has(o)||s.has(o)||(s.add(o),r.push(i))}return r}const QI=[{label:"New car",tier:"essential",hint:"Replacement vehicle",everyYears:8},{label:"Redecorating",tier:"essential",hint:"Whole-house repaint — a 4-bed runs ~£2,000–3,500 professionally, ~£300–600 DIY",everyYears:7},{label:"Major home work",tier:"essential",hint:"Kitchen, bathroom, roof, windows",everyYears:null},{label:"White goods",tier:"essential",hint:"Fridge, washer, cooker",everyYears:10}],JI={"Council tax":{minimum:{s:95,c:150},moderate:{s:115,c:170},comfortable:{s:125,c:185}},Gas:{minimum:{s:45,c:60},moderate:{s:58,c:75},comfortable:{s:68,c:90}},Electricity:{minimum:{s:55,c:70},moderate:{s:68,c:85},comfortable:{s:80,c:100}},Water:{minimum:{s:28,c:38},moderate:{s:33,c:44},comfortable:{s:38,c:50}},Broadband:{minimum:{s:27,c:27},moderate:{s:32,c:32},comfortable:{s:38,c:38}},"Mobile phones":{minimum:{s:8,c:16},moderate:{s:14,c:28},comfortable:{s:20,c:40}},"TV licence":{minimum:{s:15,c:15},moderate:{s:15,c:15},comfortable:{s:15,c:15}},"Groceries & household":{minimum:{s:230,c:350},moderate:{s:300,c:470},comfortable:{s:360,c:580}},"Home insurance":{minimum:{s:16,c:22},moderate:{s:22,c:30},comfortable:{s:28,c:38}},"Car insurance":{minimum:{s:0,c:0},moderate:{s:38,c:50},comfortable:{s:48,c:80}},"Car tax":{minimum:{s:0,c:0},moderate:{s:16,c:16},comfortable:{s:16,c:32}},"Petrol / fuel":{minimum:{s:0,c:0},moderate:{s:95,c:130},comfortable:{s:115,c:190}},"Car servicing & maintenance":{minimum:{s:0,c:0},moderate:{s:48,c:65},comfortable:{s:65,c:105}},"Boiler service":{minimum:{s:9,c:9},moderate:{s:11,c:11},comfortable:{s:13,c:13}},"Personal health":{minimum:{s:15,c:25},moderate:{s:32,c:55},comfortable:{s:58,c:95}},"Home upkeep":{minimum:{s:30,c:42},moderate:{s:52,c:75},comfortable:{s:85,c:120}},"Main holiday":{minimum:{s:42,c:65},moderate:{s:130,c:200},comfortable:{s:220,c:350}},"UK breaks":{minimum:{s:0,c:0},moderate:{s:38,c:60},comfortable:{s:75,c:115}},"Day trips":{minimum:{s:15,c:25},moderate:{s:32,c:48},comfortable:{s:52,c:80}},"Eating out & takeaways":{minimum:{s:42,c:70},moderate:{s:100,c:170},comfortable:{s:170,c:285}},"Streaming & entertainment":{minimum:{s:12,c:12},moderate:{s:26,c:32},comfortable:{s:42,c:48}},"Digital subscriptions":{minimum:{s:5,c:8},moderate:{s:13,c:20},comfortable:{s:26,c:38}},"Gym & fitness":{minimum:{s:15,c:26},moderate:{s:32,c:55},comfortable:{s:48,c:85}},"Sports & equipment":{minimum:{s:5,c:8},moderate:{s:13,c:22},comfortable:{s:26,c:42}},Clothes:{minimum:{s:48,c:80},moderate:{s:65,c:115},comfortable:{s:105,c:190}},"Sports clothes":{minimum:{s:3,c:5},moderate:{s:8,c:13},comfortable:{s:13,c:22}},"Hobbies & leisure":{minimum:{s:16,c:26},moderate:{s:37,c:58},comfortable:{s:62,c:100}},"Gifts & family":{minimum:{s:22,c:32},moderate:{s:58,c:90},comfortable:{s:95,c:150}},Charity:{minimum:{s:5,c:10},moderate:{s:16,c:27},comfortable:{s:32,c:55}},Pets:{minimum:{s:32,c:32},moderate:{s:42,c:42},comfortable:{s:58,c:58}},"Personal spending money":{minimum:{s:26,c:48},moderate:{s:52,c:95},comfortable:{s:95,c:170}},"Home furnishings & décor":{minimum:{s:16,c:26},moderate:{s:37,c:58},comfortable:{s:68,c:105}},"Home technology":{minimum:{s:10,c:16},moderate:{s:26,c:37},comfortable:{s:48,c:68}},Alcohol:{minimum:{s:16,c:42},moderate:{s:32,c:80},comfortable:{s:52,c:115}},"Hairdressing & grooming":{minimum:{s:13,c:19},moderate:{s:26,c:42},comfortable:{s:48,c:80}},"Newspapers, books & media":{minimum:{s:8,c:13},moderate:{s:19,c:30},comfortable:{s:32,c:48}},"Life insurance / income protection":{minimum:{s:20,c:24},moderate:{s:20,c:24},comfortable:{s:20,c:24}},"Health / dental insurance":{minimum:{s:0,c:0},moderate:{s:16,c:27},comfortable:{s:42,c:75}},"Dental & optical":{minimum:{s:10,c:16},moderate:{s:19,c:32},comfortable:{s:32,c:55}},"Public transport":{minimum:{s:42,c:75},moderate:{s:26,c:48},comfortable:{s:26,c:48}},"Christmas & birthdays":{minimum:{s:22,c:37},moderate:{s:48,c:75},comfortable:{s:85,c:125}},"My personal spending":{minimum:{s:26,c:26},moderate:{s:48,c:48},comfortable:{s:85,c:85}},"Partner's personal spending":{minimum:{s:0,c:26},moderate:{s:0,c:48},comfortable:{s:0,c:85}}},Vg=Object.freeze({minimum:"PLSA Minimum",moderate:"PLSA Moderate",comfortable:"PLSA Comfortable"});let zg=null;function XI(t){zg=t||null}function Do(t){const e=t&&t.plsaTier;return e==="minimum"||e==="comfortable"?e:"moderate"}function ci(t,e){const s=(zg||JI)[(t||"").trim()];if(!s)return null;const r=s[Do(e)];return r?e&&e.sharedWithPartner?r.c:r.s:null}function Ug(){const t=e=>Pc[e].map(n=>({label:n.label,tier:e,annual:null,fromAge:null,toAge:null,hint:n.hint,period:n.period||"yr"}));return[...t("essential"),...t("discretionary")]}function $g(){return QI.map(t=>({label:t.label,tier:t.tier,hint:t.hint,amount:null,atAge:null,everyYears:t.everyYears}))}const pa={pa:12570,brl:50270,hrl:125140},Ye=t=>Number.isFinite(+t)?+t:0;function ZI(t,e){const n=t.fromAge??e.retirementAge,s=t.toAge??e.endAge;return{from:Ye(n),to:Ye(s)}}function qg(t,e,n){const{from:s,to:r}=ZI(t,e);return n>=s&&n<=r}function Rc(t,e,n="all"){return(t.lines||[]).filter(s=>n==="all"||s.tier===n).filter(s=>qg(s,t,e)).reduce((s,r)=>s+Ye(r.annual),0)}function su(t,e,n=null){if(!e||!e.sharedWithPartner)return 1;const s=t&&t.paidBy||"me";if(s==="partner")return 0;if(s==="shared"){const r=t&&t.mySharePct,i=r!=null&&r!==""&&Number.isFinite(+r)?+r:eS(e,n);return Math.max(0,Math.min(1,i/100))}return 1}function eS(t,e=null){const n=Number.isFinite(+t.mySharePct)?+t.mySharePct:50,s=Array.isArray(t.splitPhases)?t.splitPhases.filter(i=>Number.isFinite(+i.fromAge)&&Number.isFinite(+i.mySharePct)):[];if(e==null||s.length===0)return n;const r=s.filter(i=>+i.fromAge<=e).sort((i,o)=>+i.fromAge-+o.fromAge).pop();return r?+r.mySharePct:n}function Mc(t,e,n="all"){return(t.lines||[]).filter(s=>n==="all"||s.tier===n).filter(s=>qg(s,t,e)).reduce((s,r)=>s+Ye(r.annual)*su(r,t,e),0)}function tS(t){return Rc(t,Ye(t.retirementAge),"all")}function nS(t,e=t.currentAge,n=t.endAge){const s=[];for(const r of t.oneOffs||[]){const i=Ye(r.amount);if(i===0)continue;const o=Ye(r.everyYears);let a=Ye(r.atAge);if(o>0)for(;a<=n;a+=o)a>=e&&s.push({age:a,label:r.label,tier:r.tier,amount:i});else a>=e&&a<=n&&s.push({age:a,label:r.label,tier:r.tier,amount:i})}return s.sort((r,i)=>r.age-i.age)}function io(t,e=pa){const n=Ye(t),{pa:s,brl:r,hrl:i}=e;if(n<=s)return n;const o=r-.2*(r-s);if(n<=o)return s+(n-s)/.8;const a=o+.6*(i-r);return n<=a?r+(n-o)/.6:i+(n-a)/.55}function Ff(t,e=!1){return(t.oneOffs||[]).reduce((n,s)=>{const r=Ye(s.amount),i=Ye(s.everyYears);return i>0&&r?n+r/i*(e?su(s,t,Ye(t.retirementAge)):1):n},0)}function sS(t,e){const n=Ye(t.retirementAge),s=nS(t,n,n+e),r=[];for(let i=0;i<=e;i++){const o=n+i;let a=Mc(t,o,"all");for(const c of s)if(c.age===o){const d=(t.oneOffs||[]).find(h=>h.label===c.label)||{};a+=c.amount*su(d,t,o)}r.push(a)}return r}function di(t){const e=Ye(t.retirementAge),n=Mc(t,e,"essential"),s=Mc(t,e,"all"),r=Ff(t,!0),i=s+r,o=tS(t)+Ff(t,!1),a=Math.max(0,o-i);return{partnerAllInAnnual:a,partnerAllInMonthly:a/12,essentialAnnualNet:n,comfortableAnnualNet:s,essentialMonthlyNet:n/12,comfortableMonthlyNet:s/12,periodicAnnualAverage:r,periodicMonthlyAverage:r/12,allInComfortableAnnual:i,allInComfortableMonthly:i/12,householdComfortableAnnual:o,householdComfortableMonthly:o/12,sharedWithPartner:!!t.sharedWithPartner,suggestedGrossAnnual:io(i)}}function Cs(t){if(t==null)return null;const e=String(t).trim().replace(/^=/,"").replace(/[×x]/gi,"*").replace(/,/g,"");if(!e||!/^[\d+\-*/().\s]+$/.test(e)||!/\d/.test(e))return null;try{const n=Function('"use strict"; return ('+e+");")();return Number.isFinite(n)?Math.round(n*100)/100:null}catch{return null}}function ru(t){return(t||[]).reduce((e,n)=>{const s=Ye(n&&n.amount);return s?e+((n.period||"yr")==="mo"?s*12:s):e},0)}function Hg(t,e,n){const s=ci(t,n),r=Ye(e);if(s==null||s<=0||r<=0)return null;const i=s*12;return r<=i*.35?"low":r>=i*3?"high":null}function oo(t=45,e=60,n=100){return{version:1,currentAge:Ye(t),retirementAge:Ye(e),endAge:Ye(n),sharedWithPartner:!1,mySharePct:50,plsaTier:"moderate",lines:[],oneOffs:[]}}const rS=["Type","Section","Item","Amount","Period","Paid by","My share %","From age","To age","At age","Every N years","Notes"];function iS(t){return t=t==null?"":String(t),/[",\n]/.test(t)?'"'+t.replace(/"/g,'""')+'"':t}function oS(t){const e=[rS],n=(s,r,i)=>e.push(["Setting","",s,r??"","","","","","","","",""]);n("Current age",t.currentAge),n("Retirement age",t.retirementAge),n("Plan to age",t.endAge),n("Shared with partner",t.sharedWithPartner?"yes":"no"),n("My share %",t.mySharePct??50),n("PLSA tier",t.plsaTier||"moderate"),t.targetHeadroomMonthly&&n("Headroom £/mo",t.targetHeadroomMonthly);for(const s of t.splitPhases||[])s&&s.fromAge!==""&&s.fromAge!=null&&e.push(["Setting","","Split change",s.mySharePct??"","","","",s.fromAge,"","","","from this age my share becomes Amount %"]);for(const s of t.lines||[]){const r=s.period||"yr",i=s.annual==null?"":r==="mo"?Math.round(s.annual/12*100)/100:s.annual;e.push(["Item",s.tier==="discretionary"?"Discretionary":"Essential",s.label||"",i,r,s.paidBy||"me",s.mySharePct??"",s.fromAge??"",s.toAge??"","","",s.hint||""]);for(const o of s.breakdown||[])!o||!o.label&&o.amount==null||e.push(["Sub-item","",o.label||"",o.amount??"",o.period||"mo","","","","","","",""])}for(const s of t.oneOffs||[])e.push(["One-off",s.tier==="discretionary"?"Discretionary":"Essential",s.label||"",s.amount??"","",s.paidBy||"me",s.mySharePct??"","","",s.atAge??"",s.everyYears??"",s.hint||""]);return"\uFEFF"+e.map(s=>s.map(iS).join(",")).join(`\r
`)}function aS(t){const e=[];let n=[],s="",r=!1;const i=String(t||"").replace(/^﻿/,"");for(let o=0;o<i.length;o++){const a=i[o];r?a==='"'?i[o+1]==='"'?(s+='"',o++):r=!1:s+=a:a==='"'?r=!0:a===","?(n.push(s),s=""):a===`
`||a==="\r"?(a==="\r"&&i[o+1]===`
`&&o++,n.push(s),s="",n.some(c=>c!=="")&&e.push(n),n=[]):s+=a}return n.push(s),n.some(o=>o!=="")&&e.push(n),e}function sa(t,e){const n=Cs(t);return n==null?null:n>1e3&&e?Math.round(e+(n-new Date().getFullYear())):n}function lS(t){const e=[],n=aS(t);if(!n.length)return{settings:{},lines:[],oneOffs:[],warnings:["Empty file"]};const s=m=>String(m||"").toLowerCase().replace(/[^a-z%£/]/g,""),r={};n[0].forEach((m,f)=>{r[s(m)]=f});const i=(m,f)=>{const y=r[s(f)];return y==null?"":(m[y]??"").trim()};if(r[s("Type")]==null||r[s("Item")]==null)return{settings:{},lines:[],oneOffs:[],warnings:["Header row not recognised — expected the exported column layout (Type, Section, Item, …)"]};const o={},a=[],c=[],d=[];let h=null;for(let m=1;m<n.length;m++){const f=n[m],y=s(i(f,"Type")),T=i(f,"Item"),E=i(f,"Amount"),x=Cs(E),C=/mo/i.test(i(f,"Period"))?"mo":"yr",P={me:"me",partner:"partner",shared:"shared"}[s(i(f,"Paid by"))]||"me",D=Cs(i(f,"My share %"));if(y==="setting"){const R=s(T);if(R==="currentage")o.currentAge=x;else if(R==="retirementage")o.retirementAge=x;else if(R==="plantoage")o.endAge=x;else if(R==="sharedwithpartner")o.sharedWithPartner=/^(y|true|1)/i.test(E||i(f,"Notes"))||/^(y|true|1)/i.test(E);else if(R==="myshare%")o.mySharePct=x;else if(R==="plsatier")o.plsaTier=(E||"").toLowerCase()||void 0;else if(R==="headroom£/mo"||R==="headroommo")o.targetHeadroomMonthly=x;else if(R==="splitchange"){const B=sa(i(f,"From age"),o.currentAge);B!=null&&x!=null?a.push({fromAge:B,mySharePct:x}):e.push("Row "+(m+1)+": split change needs From age and Amount (%)")}else e.push("Row "+(m+1)+': unknown setting "'+T+'" skipped')}else if(y==="item"){const R=/disc/i.test(i(f,"Section"))?"discretionary":"essential";h={label:T,tier:R,period:C,annual:x==null?null:C==="mo"?Math.round(x*12*100)/100:x,paidBy:P,mySharePct:D??null,fromAge:sa(i(f,"From age"),o.currentAge),toAge:sa(i(f,"To age"),o.currentAge),hint:i(f,"Notes")||"",breakdown:[]},c.push(h)}else if(y==="subitem"){if(!h){e.push("Row "+(m+1)+": sub-item with no Item above it — skipped");continue}h.breakdown.push({label:T,amount:x,period:C})}else y==="oneoff"?d.push({label:T,tier:/disc/i.test(i(f,"Section"))?"discretionary":"essential",amount:x,atAge:sa(i(f,"At age"),o.currentAge),everyYears:Cs(i(f,"Every N years")),paidBy:P,mySharePct:D??null,hint:i(f,"Notes")||""}):y&&e.push("Row "+(m+1)+': unknown Type "'+i(f,"Type")+'" skipped')}for(const m of c)m.breakdown.length&&m.breakdown.some(f=>+f.amount)&&(m.annual=ru(m.breakdown)),m.breakdown.length||delete m.breakdown;return a.length&&(o.splitPhases=a),{settings:o,lines:c,oneOffs:d,warnings:e}}let Vr=null,ce=null;function Vs(){return De()&&lt()}function An(){Vr=null,ce=null}function iu(){return{equityMin:be.EQUITY_MIN,bondMin:be.BOND_MIN,cashTarget:be.CASH_TARGET,duration:be.DURATION_YEARS,baseSalary:be.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Is.PROTECTION_MULTIPLIER,consecutiveLimit:be.CONSECUTIVE_LIMIT,disableProtection:!1,recoveryBuffer:be.RECOVERY_BUFFER,hodlEnabled:Is.HODL_ENABLED,hodlValue:Is.HODL_VALUE,isaBalance:0,isaReturn:Ft.RETURN,isaMin:Ft.MIN,isaDrawdownStrategy:Ft.DRAWDOWN_STRATEGY}}function ou(){return{equityMin:be.EQUITY_MIN,bondMin:be.BOND_MIN,cashTarget:be.CASH_TARGET,duration:be.DURATION_YEARS,baseSalary:be.BASE_SALARY,protectionFactor:be.PROTECTION_FACTOR,recoveryBuffer:be.RECOVERY_BUFFER,consecutiveLimit:be.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0,isaBalance:0,isaReturn:Ft.RETURN,isaMin:Ft.MIN,isaDrawdownStrategy:Ft.DRAWDOWN_STRATEGY}}function cS(t,e={},n=new Date().toISOString()){const s=t||{};return{...iu(),...e,equityMin:s.equityMin,bondMin:s.bondMin,cashTarget:s.cashTarget,duration:s.duration,baseSalary:s.baseSalary,spStartDate:s.spStartDate??e.spStartDate??null,spWeeklyAmount:s.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:s.consecutiveLimit,recoveryBuffer:s.recoveryBuffer,disableProtection:s.disableProtection??e.disableProtection??!1,protectionMult:s.protectionFactor!=null?1-s.protectionFactor/100:e.protectionMult??Is.PROTECTION_MULTIPLIER,isaBalance:s.isaBalance??0,isaReturn:s.isaReturn??Ft.RETURN,isaMin:s.isaMin??Ft.MIN,isaDrawdownStrategy:s.isaDrawdownStrategy??Ft.DRAWDOWN_STRATEGY,taggedFunds:(s.taggedFunds||[]).map(r=>({...r})),allocMode:s.allocMode??e.allocMode,subAsset:s.subAsset??null,diversifierStart:s.diversifierStart??0,glideEndgame:s.glideEndgame??null,equityGlideEnabled:s.equityGlideEnabled??!1,spendingProfile:s.spendingProfile??e.spendingProfile??"flat",accessMethod:s.accessMethod??e.accessMethod??"drawdown",ufplsYears:s.ufplsYears??e.ufplsYears??null,ufplsThenPcls:s.ufplsThenPcls??e.ufplsThenPcls??!1,bandFillRecycle:s.bandFillRecycle??e.bandFillRecycle??!1,seededFrom:"decision",seededAt:n,decisionChecksum:qa(s)}}function dS(t,e={}){const n=t||{};return{...ou(),...e,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,duration:n.duration,baseSalary:n.baseSalary,spStartDate:n.spStartDate??e.spStartDate??null,spWeeklyAmount:n.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:n.consecutiveLimit??e.consecutiveLimit,recoveryBuffer:n.recoveryBuffer??e.recoveryBuffer,disableProtection:n.disableProtection??e.disableProtection??!1,protectionFactor:n.protectionMult!=null?Math.round((1-n.protectionMult)*100):e.protectionFactor,isaBalance:n.isaBalance??0,isaReturn:n.isaReturn??Ft.RETURN,isaMin:n.isaMin??Ft.MIN,isaDrawdownStrategy:n.isaDrawdownStrategy??Ft.DRAWDOWN_STRATEGY,taggedFunds:(n.taggedFunds||[]).map(s=>({...s})),allocMode:n.allocMode??e.allocMode,subAsset:n.subAsset??null,diversifierStart:n.diversifierStart??0,glideEndgame:n.glideEndgame??null,equityGlideEnabled:n.equityGlideEnabled??!1,spendingProfile:n.spendingProfile??e.spendingProfile??"flat",accessMethod:n.accessMethod??e.accessMethod??"drawdown",ufplsYears:n.ufplsYears??e.ufplsYears??null,ufplsThenPcls:n.ufplsThenPcls??e.ufplsThenPcls??!1,bandFillRecycle:n.bandFillRecycle??e.bandFillRecycle??!1,configured:!0,seededFrom:"stress"}}function Wg(){return{}}function Yg(){return oo()}function uS(t="My Plan",e="",n=["stress","decision"]){return{planDetails:{name:t,description:e},enabledTools:n,isActive:!0,decisionTool:{settings:ou(),history:[],taxYears:Wg()},stressTool:{settings:iu()},budgetTool:{settings:Yg()}}}async function ui(){if(Vr)return Vr;if(!Vs())return[];try{const t=await dl();return Vr=t,t}catch(t){return console.error("Error listing scenarios:",t),[]}}async function $e(){if(ce)return ce;if(!Vs())return null;try{const e=(await ui()).find(n=>n.isActive);return e?(ce=e,e):null}catch(t){return console.error("Error getting active scenario:",t),null}}async function ul(){const t=await $e();return(t==null?void 0:t.id)||null}async function Gg(t,e,n,s={},r=!0){if(!Vs())throw new Error("Must be logged in to create scenarios");const i=uS(t,e,n);if(s.stressSettings&&(i.stressTool.settings={...i.stressTool.settings,...s.stressSettings}),s.decisionSettings&&(i.decisionTool.settings={...i.decisionTool.settings,...s.decisionSettings}),s.taxYears&&(i.decisionTool.taxYears=s.taxYears),i.isActive=r,r&&Vr){const a=Vr.find(c=>c.isActive);a&&(await nu(null),await mn(a.id,{isActive:!1}))}const o=await Lg(i);return An(),o}async function hS(t){if(!Vs())throw new Error("Must be logged in to switch scenarios");await nu(t),An()}async function fS(t,e){if(!Vs())throw new Error("Must be logged in to duplicate scenarios");const n=await GI(t);if(!n)throw new Error("Source scenario not found");const{id:s,createdAt:r,lastModified:i,...o}=n;o.planDetails={...o.planDetails,name:e},o.isActive=!1;const a=await Lg(o);return An(),a}async function pS(t,e){if(!Vs())throw new Error("Must be logged in to rename scenarios");await mn(t,{"planDetails.name":e}),An()}async function mS(t,e){if(!Vs())throw new Error("Must be logged in to update scenarios");await mn(t,{enabledTools:e}),An()}async function gS(t){if(!Vs())throw new Error("Must be logged in to delete scenarios");const e=await ui();if(e.length<=1)throw new Error("Cannot delete the last scenario");const n=e.find(s=>s.id===t);if(n!=null&&n.isActive){const s=e.find(r=>r.id!==t);s&&await nu(s.id)}await jI(t),An()}async function jg(){var e;const t=await $e();return((e=t==null?void 0:t.stressTool)==null?void 0:e.settings)||iu()}async function Kg(t){const e=await $e();if(!e)throw new Error("No active scenario");await mn(e.id,{"stressTool.settings":t}),ce&&(ce.stressTool||(ce.stressTool={}),ce.stressTool.settings=t)}async function yS(){var e;const t=await $e();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.settings)||ou()}async function vS(t){const e=await $e();if(!e)throw new Error("No active scenario");await mn(e.id,{"decisionTool.settings":t}),ce&&(ce.decisionTool||(ce.decisionTool={}),ce.decisionTool.settings=t)}async function bS(){var e;const t=await $e();return((e=t==null?void 0:t.budgetTool)==null?void 0:e.settings)||Yg()}async function wS(t){const e=await $e();if(!e)throw new Error("No active scenario");await mn(e.id,{"budgetTool.settings":t}),ce&&(ce.budgetTool||(ce.budgetTool={}),ce.budgetTool.settings=t)}async function ES(){var e;const t=await $e();return((e=t==null?void 0:t.accumulationTool)==null?void 0:e.settings)||{}}async function _S(){var e;const t=await $e();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.planOfRecord)||null}async function TS(t){const e=await $e();if(!e)throw new Error("No active scenario");await mn(e.id,{"decisionTool.planOfRecord":t}),ce&&(ce.decisionTool||(ce.decisionTool={}),ce.decisionTool.planOfRecord=t)}async function IS(){var e;const t=await $e();return((e=t==null?void 0:t.household)==null?void 0:e.partnerScenarioId)||null}async function SS(t){const e=await $e();if(!e)throw new Error("No active scenario");await mn(e.id,{"household.partnerScenarioId":t||null}),ce&&(ce.household||(ce.household={}),ce.household.partnerScenarioId=t||null)}async function xS(t){const e=await $e();if(!e)throw new Error("No active scenario");await mn(e.id,{"accumulationTool.settings":t}),ce&&(ce.accumulationTool||(ce.accumulationTool={}),ce.accumulationTool.settings=t)}async function AS(){var e;const t=await $e();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.taxYears)||Wg()}async function kS(t){const e=await $e();if(!e)throw new Error("No active scenario");await mn(e.id,{"decisionTool.taxYears":t}),ce&&(ce.decisionTool||(ce.decisionTool={}),ce.decisionTool.taxYears=t)}async function CS(){var e;const t=await $e();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.history)||[]}async function Qg(t){const e=await $e();if(!e)throw new Error("No active scenario");await mn(e.id,{"decisionTool.history":t}),ce&&(ce.decisionTool||(ce.decisionTool={}),ce.decisionTool.history=t)}async function Jg(){const t=await $e();return(t==null?void 0:t.enabledTools)||["stress","decision"]}let Ps=null;function ma(){return{settings:{equityMin:be.EQUITY_MIN,bondMin:be.BOND_MIN,cashTarget:be.CASH_TARGET,duration:be.DURATION_YEARS,equityGlideEnabled:!1,locked:!1,baseSalary:be.BASE_SALARY,spendingProfile:"flat",protectionFactor:be.PROTECTION_FACTOR,recoveryBuffer:be.RECOVERY_BUFFER,consecutiveLimit:be.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function hl(){return De()&&lt()}function Bs(){Ps=null}function Xg(){return Ps||ma()}async function kn(){if(Ps)return Ps;if(!hl())return console.warn("Firebase not available - returning defaults"),ma();try{const[t,e,n]=await Promise.all([yS(),AS(),CS()]),s={settings:t||ma().settings,taxYears:e||{},history:n||[],lastModified:new Date().toISOString(),checksum:null};return s.checksum=Zg(s),Ps=s,s}catch(t){console.error("Error loading decision data:",t)}return ma()}async function fl(t){if(!hl())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=Zg(t),await Promise.all([vS(t.settings),kS(t.taxYears)]),Ps=t}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function Zg(t){const e={settings:t.settings,taxYears:t.taxYears,historyCount:t.history.length,lastHistoryDate:t.history.length>0?t.history[t.history.length-1].date:null};return qa(e)}function ey(t){if(!t)return"";const{locked:e,...n}=t;return qa(n)}async function Ze(){return(await kn()).settings}async function ur(t){const e=await kn();e.settings={...e.settings,...t},await fl(e)}function au(){return{pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,cpi:Gi,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function PS(t){const n=Xg().taxYears[t];return n||au()}async function Bo(t){const n=(await kn()).taxYears[t];return n||au()}async function wr(t,e){console.log(`saveTaxYearConfig: Saving tax year ${t}`,e);const n=await kn();n.taxYears[t]={...PS(t),...e},await fl(n),console.log(`saveTaxYearConfig: Saved tax year ${t}, yearSetupComplete=${n.taxYears[t].yearSetupComplete}`)}async function RS(t){const e=Ps||await kn(),n=(e.history||[]).filter(r=>r.taxYear===t),s=n.reduce((r,i)=>r+(i.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${t}, found ${n.length} records, total ISA used: ${s}`),console.log("recalculateIsaSavingsUsed: History records:",n.map(r=>({date:r.date,isa:r.isa}))),e.taxYears[t]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${t}, creating default`),e.taxYears[t]=au()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),e.taxYears[t].isaSavingsUsed=s,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),await fl(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),s}async function MS(t){const e=await Bo(t),n=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${t}, yearSetupComplete=${e.yearSetupComplete}, result=${n}`),n}async function os(){return(await kn()).taxYears}function DS(t={}){let n=[...Xg().history];return t.taxYear&&(n=n.filter(s=>s.taxYear===t.taxYear)),t.startDate&&(n=n.filter(s=>s.date>=t.startDate)),t.endDate&&(n=n.filter(s=>s.date<=t.endDate)),t.sortDesc?n.sort((s,r)=>r.date.localeCompare(s.date)):n.sort((s,r)=>s.date.localeCompare(r.date)),t.limit&&(n=n.slice(0,t.limit)),n}async function zs(t={}){return await kn(),DS(t)}async function BS(t){if(!hl())throw new Error("Must be logged in to save history");const e=await kn(),n=e.history.findIndex(s=>s.date===t.date);n>=0?e.history[n]=t:e.history.push(t),e.history.sort((s,r)=>s.date.localeCompare(r.date)),await Qg(e.history)}async function ty(t){if(!hl())throw new Error("Must be logged in to delete history");const e=await kn();e.history=e.history.filter(n=>n.date!==t),await Qg(e.history)}async function lu(t){const e=await Ze(),n=await os(),s=e.spStartDate,r=e.spWeeklyAmount||0;if(!s||!r){let h=null;if(s){const{formatStatePensionDate:m}=await Eh(async()=>{const{formatStatePensionDate:f}=await Promise.resolve().then(()=>Gf);return{formatStatePensionDate:f}},void 0,import.meta.url);h=m(s)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:h}}const{calculateStatePensionForTaxYear:i,getTimeUntilStatePension:o,parseStatePensionDate:a}=await Eh(async()=>{const{calculateStatePensionForTaxYear:h,getTimeUntilStatePension:m,parseStatePensionDate:f}=await Promise.resolve().then(()=>Gf);return{calculateStatePensionForTaxYear:h,getTimeUntilStatePension:m,parseStatePensionDate:f}},void 0,import.meta.url),c=i({taxYear:t,spStartDate:s,weeklyAmount:r,taxYearConfigs:n}),d=o(s);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function LS(t){const e=k0(t);e.stdSipp=t.stdSipp||t.sippDraw;try{const n=await Ze();e.settingsChecksum=ey(n)}catch(n){console.warn("Could not stamp settings checksum on decision:",n)}await BS(e),t.taxYear&&await RS(t.taxYear)}const Vf={55:{m:[84,91,96],f:[87,93,97]},60:{m:[85,91,96],f:[87,93,97]},65:{m:[85,92,96],f:[88,93,98]},70:{m:[86,92,96],f:[88,94,98]},75:{m:[87,92,97],f:[89,94,98]}},NS={50:0,25:1,10:2};function OS(t,e="m",n=10){const s=NS[n]??2,r=e==="f"?"f":"m",i=Math.max(55,Math.min(75,t||65)),o=Math.floor(i/5)*5,a=Math.min(75,o+5),c=Vf[o][r][s],d=Vf[a][r][s],h=a===o?0:(i-o)/(a-o);return Math.round(c+(d-c)*h)}const FS=[[{ticker:"ATST",name:"Alliance Trust",subClass:"worldGrowth"},{ticker:"ATT",name:"Allianz Technology Trust",subClass:"worldGrowth"},{ticker:"BGFD",name:"Baillie Gifford Japan Trust",subClass:"worldGrowth"},{ticker:"BNKR",name:"Bankers Investment Trust",subClass:"worldGrowth"},{ticker:"BUT",name:"Brunner Investment Trust",subClass:"worldGrowth"},{ticker:"CLDN",name:"Caledonia Investments",subClass:"worldGrowth"},{ticker:"CSP1",name:"iShares Core S&P 500 (Acc)",subClass:"worldGrowth"},{ticker:"CUKX",name:"iShares Core FTSE 100 (Acc)",subClass:"ukEquityIncome"},{ticker:"EQQQ",name:"Invesco Nasdaq-100",subClass:"worldGrowth"},{ticker:"FCIT",name:"F&C Investment Trust",subClass:"worldGrowth"},{ticker:"FWRA",name:"Invesco FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"FWRG",name:"Invesco FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"GSPX",name:"iShares S&P 500 GBP-Hedged",subClass:"worldGrowth"},{ticker:"HGT",name:"HgCapital Trust",subClass:"worldGrowth"},{ticker:"HMWO",name:"HSBC MSCI World",subClass:"worldGrowth"},{ticker:"HVPE",name:"HarbourVest Global Private Equity",subClass:"worldGrowth"},{ticker:"IBT",name:"International Biotechnology Trust",subClass:"worldGrowth"},{ticker:"IITU",name:"iShares S&P 500 Information Technology",subClass:"worldGrowth"},{ticker:"IMEU",name:"iShares Core MSCI Europe",subClass:"worldGrowth"},{ticker:"INRG",name:"iShares Global Clean Energy",subClass:"worldGrowth"},{ticker:"ISAC",name:"iShares MSCI ACWI (Acc)",subClass:"worldGrowth"},{ticker:"IUHC",name:"iShares S&P 500 Health Care",subClass:"worldGrowth"},{ticker:"IUSA",name:"iShares Core S&P 500 (Dist)",subClass:"worldGrowth"},{ticker:"IWDA",name:"iShares Core MSCI World (Acc, USD line)",subClass:"worldGrowth"},{ticker:"IWDG",name:"iShares Core MSCI World GBP-Hedged",subClass:"worldGrowth"},{ticker:"IJPN",name:"iShares MSCI Japan",subClass:"worldGrowth"},{ticker:"JAM",name:"JPMorgan American Investment Trust",subClass:"worldGrowth"},{ticker:"LCWL",name:"Amundi (Lyxor) Core MSCI World",subClass:"worldGrowth"},{ticker:"MNKS",name:"Monks Investment Trust",subClass:"worldGrowth"},{ticker:"MWY",name:"Mid Wynd International",subClass:"worldGrowth"},{ticker:"PACW",name:"Amundi Prime All Country World",subClass:"worldGrowth"},{ticker:"PCT",name:"Polar Capital Technology Trust",subClass:"worldGrowth"},{ticker:"PIN",name:"Pantheon International",subClass:"worldGrowth"},{ticker:"RCP",name:"RIT Capital Partners",subClass:"worldGrowth"},{ticker:"SJG",name:"Schroder Japan Trust",subClass:"worldGrowth"},{ticker:"SMT",name:"Scottish Mortgage Investment Trust",subClass:"worldGrowth"},{ticker:"SSAC",name:"iShares MSCI ACWI",subClass:"worldGrowth"},{ticker:"SWDA",name:"iShares Core MSCI World",subClass:"worldGrowth"},{ticker:"SWLD",name:"SPDR MSCI World",subClass:"worldGrowth"},{ticker:"VAPX",name:"Vanguard FTSE Dev Asia Pacific ex-Japan",subClass:"worldGrowth"},{ticker:"VERX",name:"Vanguard FTSE Developed Europe ex-UK",subClass:"worldGrowth"},{ticker:"VEUR",name:"Vanguard FTSE Developed Europe",subClass:"worldGrowth"},{ticker:"VEVE",name:"Vanguard FTSE Developed World (Dist)",subClass:"worldGrowth"},{ticker:"VHVG",name:"Vanguard FTSE Developed World (Acc)",subClass:"worldGrowth"},{ticker:"VJPN",name:"Vanguard FTSE Japan",subClass:"worldGrowth"},{ticker:"VNRT",name:"Vanguard FTSE North America",subClass:"worldGrowth"},{ticker:"VUAG",name:"Vanguard S&P 500 (Acc)",subClass:"worldGrowth"},{ticker:"VUSA",name:"Vanguard S&P 500 (Dist)",subClass:"worldGrowth"},{ticker:"VWRL",name:"Vanguard FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"VWRP",name:"Vanguard FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"WTAN",name:"Witan Investment Trust",subClass:"worldGrowth"},{ticker:"WWH",name:"Worldwide Healthcare Trust",subClass:"worldGrowth"}],[{ticker:"3IN",name:"3i Infrastructure",subClass:"ukEquityIncome"},{ticker:"AEI",name:"abrdn Equity Income Trust",subClass:"ukEquityIncome"},{ticker:"BBGI",name:"BBGI Global Infrastructure",subClass:"ukEquityIncome"},{ticker:"BSIF",name:"Bluefield Solar Income Fund",subClass:"ukEquityIncome"},{ticker:"CTY",name:"City of London Investment Trust",subClass:"ukEquityIncome"},{ticker:"DIG",name:"Dunedin Income Growth",subClass:"ukEquityIncome"},{ticker:"EDIN",name:"Edinburgh Investment Trust",subClass:"ukEquityIncome"},{ticker:"FGT",name:"Finsbury Growth & Income Trust",subClass:"ukEquityIncome"},{ticker:"FSFL",name:"Foresight Solar Fund",subClass:"ukEquityIncome"},{ticker:"FTAL",name:"SPDR FTSE UK All Share",subClass:"ukEquityIncome"},{ticker:"GRID",name:"Gresham House Energy Storage",subClass:"ukEquityIncome"},{ticker:"GSF",name:"Gore Street Energy Storage",subClass:"ukEquityIncome"},{ticker:"HHI",name:"Henderson High Income Trust",subClass:"ukEquityIncome"},{ticker:"HICL",name:"HICL Infrastructure",subClass:"ukEquityIncome"},{ticker:"HUKX",name:"HSBC FTSE 100",subClass:"ukEquityIncome"},{ticker:"INPP",name:"International Public Partnerships",subClass:"ukEquityIncome"},{ticker:"ISF",name:"iShares Core FTSE 100 (Dist)",subClass:"ukEquityIncome"},{ticker:"IUKD",name:"iShares UK Dividend",subClass:"ukEquityIncome"},{ticker:"JCH",name:"JPMorgan Claverhouse",subClass:"ukEquityIncome"},{ticker:"JLEN",name:"JLEN Environmental Assets",subClass:"ukEquityIncome"},{ticker:"LWDB",name:"Law Debenture Corporation",subClass:"ukEquityIncome"},{ticker:"MRCH",name:"Merchants Trust",subClass:"ukEquityIncome"},{ticker:"MUT",name:"Murray Income Trust",subClass:"ukEquityIncome"},{ticker:"NESF",name:"NextEnergy Solar Fund",subClass:"ukEquityIncome"},{ticker:"ORIT",name:"Octopus Renewables Infrastructure",subClass:"ukEquityIncome"},{ticker:"SEIT",name:"SDCL Energy Efficiency Income",subClass:"ukEquityIncome"},{ticker:"SHRS",name:"Shires Income",subClass:"ukEquityIncome"},{ticker:"TIGT",name:"Troy Income & Growth Trust",subClass:"ukEquityIncome"},{ticker:"TMPL",name:"Temple Bar Investment Trust",subClass:"ukEquityIncome"},{ticker:"TRIG",name:"The Renewables Infrastructure Group",subClass:"ukEquityIncome"},{ticker:"UKDV",name:"SPDR UK Dividend Aristocrats",subClass:"ukEquityIncome"},{ticker:"UKW",name:"Greencoat UK Wind",subClass:"ukEquityIncome"},{ticker:"VMID",name:"Vanguard FTSE 250",subClass:"ukEquityIncome"},{ticker:"VUKE",name:"Vanguard FTSE 100",subClass:"ukEquityIncome"}],[{ticker:"GBDV",name:"SPDR Global Dividend Aristocrats",subClass:"globalEquityIncome"},{ticker:"HFEL",name:"Henderson Far East Income",subClass:"globalEquityIncome"},{ticker:"IAPD",name:"iShares Asia Pacific Dividend",subClass:"globalEquityIncome"},{ticker:"IDVY",name:"iShares Euro Dividend",subClass:"globalEquityIncome"},{ticker:"JGGI",name:"JPMorgan Global Growth & Income",subClass:"globalEquityIncome"},{ticker:"MYI",name:"Murray International Trust",subClass:"globalEquityIncome"},{ticker:"SAIN",name:"Scottish American Investment Co",subClass:"globalEquityIncome"},{ticker:"STS",name:"STS Global Income & Growth (Troy)",subClass:"globalEquityIncome"},{ticker:"USDV",name:"SPDR US Dividend Aristocrats",subClass:"globalEquityIncome"},{ticker:"VHYL",name:"Vanguard FTSE All-World High Div Yield",subClass:"globalEquityIncome"}],[{ticker:"BBOX",name:"Tritax Big Box REIT",subClass:"reit"},{ticker:"BLND",name:"British Land",subClass:"reit"},{ticker:"BYG",name:"Big Yellow Group",subClass:"reit"},{ticker:"DLN",name:"Derwent London",subClass:"reit"},{ticker:"IHR",name:"Impact Healthcare REIT",subClass:"reit"},{ticker:"IUKP",name:"iShares UK Property",subClass:"reit"},{ticker:"IWDP",name:"iShares Developed Markets Property Yield",subClass:"reit"},{ticker:"LAND",name:"Land Securities (Landsec)",subClass:"reit"},{ticker:"LMP",name:"LondonMetric Property",subClass:"reit"},{ticker:"PHP",name:"Primary Health Properties",subClass:"reit"},{ticker:"SAFE",name:"Safestore Holdings",subClass:"reit"},{ticker:"SGRO",name:"Segro",subClass:"reit"},{ticker:"SHED",name:"Urban Logistics REIT",subClass:"reit"},{ticker:"SRE",name:"Sirius Real Estate",subClass:"reit"},{ticker:"SUPR",name:"Supermarket Income REIT",subClass:"reit"},{ticker:"THRL",name:"Target Healthcare REIT",subClass:"reit"},{ticker:"TRY",name:"TR Property Investment Trust",subClass:"reit"},{ticker:"UTG",name:"Unite Group",subClass:"reit"},{ticker:"WHR",name:"Warehouse REIT",subClass:"reit"}],[{ticker:"AAS",name:"abrdn Asia Focus",subClass:"emEquity"},{ticker:"EMIM",name:"iShares Core MSCI EM IMI",subClass:"emEquity"},{ticker:"FCSS",name:"Fidelity China Special Situations",subClass:"emEquity"},{ticker:"FEML",name:"Fidelity Emerging Markets Limited",subClass:"emEquity"},{ticker:"HMEF",name:"HSBC MSCI Emerging Markets",subClass:"emEquity"},{ticker:"JII",name:"JPMorgan Indian Investment Trust",subClass:"emEquity"},{ticker:"JMG",name:"JPMorgan Emerging Markets",subClass:"emEquity"},{ticker:"SEMA",name:"SPDR MSCI Emerging Markets",subClass:"emEquity"},{ticker:"TEM",name:"Templeton Emerging Markets",subClass:"emEquity"},{ticker:"VEIL",name:"Vietnam Enterprise Investments",subClass:"emEquity"},{ticker:"VFEG",name:"Vanguard FTSE Emerging Markets (Acc)",subClass:"emEquity"},{ticker:"VFEM",name:"Vanguard FTSE Emerging Markets (Dist)",subClass:"emEquity"},{ticker:"VOF",name:"VinaCapital Vietnam Opportunity",subClass:"emEquity"}],[{ticker:"ASL",name:"Aberforth Smaller Companies",subClass:"globalSmallCap"},{ticker:"BRSC",name:"BlackRock Smaller Companies",subClass:"globalSmallCap"},{ticker:"EWI",name:"Edinburgh Worldwide",subClass:"globalSmallCap"},{ticker:"HSL",name:"Henderson Smaller Companies",subClass:"globalSmallCap"},{ticker:"ISP6",name:"iShares S&P SmallCap 600",subClass:"globalSmallCap"},{ticker:"MTU",name:"Montanaro UK Smaller Companies",subClass:"globalSmallCap"},{ticker:"SSON",name:"Smithson Investment Trust",subClass:"globalSmallCap"},{ticker:"THRG",name:"BlackRock Throgmorton Trust",subClass:"globalSmallCap"},{ticker:"USSC",name:"SPDR MSCI USA Small Cap Value Weighted",subClass:"globalSmallCap"},{ticker:"WLDS",name:"iShares MSCI World Small Cap",subClass:"globalSmallCap"},{ticker:"WOSC",name:"SPDR MSCI World Small Cap",subClass:"globalSmallCap"}],[{ticker:"AGBP",name:"iShares Core Global Agg GBP-Hedged",subClass:"globalAggHedged"},{ticker:"GLTL",name:"SPDR Bloomberg 15+ Year Gilt",subClass:"longGilts"},{ticker:"GLTS",name:"SPDR Bloomberg 1-5 Year Gilt",subClass:"shortGilts"},{ticker:"IBTL",name:"iShares $ Treasury 20+yr",subClass:"usTreasHedged"},{ticker:"IBTM",name:"iShares $ Treasury 7-10yr",subClass:"usTreasHedged"},{ticker:"IBTS",name:"iShares $ Treasury 1-3yr",subClass:"usTreasHedged"},{ticker:"IDTG",name:"iShares $ Treasury 7-10yr GBP-Hedged",subClass:"usTreasHedged"},{ticker:"IGLS",name:"iShares UK Gilts 0-5yr",subClass:"shortGilts"},{ticker:"IGLT",name:"iShares Core UK Gilts",subClass:"longGilts"},{ticker:"INXG",name:"iShares £ Index-Linked Gilts",subClass:"indexLinked"},{ticker:"IS15",name:"iShares £ Corp Bond 0-5yr",subClass:"corporateIG"},{ticker:"ITPS",name:"iShares $ TIPS",subClass:"indexLinked"},{ticker:"SLXX",name:"iShares Core £ Corp Bond",subClass:"corporateIG"},{ticker:"TI5G",name:"iShares $ TIPS 0-5 (GBP-Hedged)",subClass:"indexLinked"},{ticker:"VAGP",name:"Vanguard Global Aggregate (GBP-Hedged, Dist)",subClass:"globalAggHedged"},{ticker:"VAGS",name:"Vanguard Global Aggregate (GBP-Hedged, Acc)",subClass:"globalAggHedged"},{ticker:"VGOV",name:"Vanguard UK Gilt",subClass:"longGilts"},{ticker:"VUTY",name:"Vanguard USD Treasury Bond",subClass:"usTreasHedged"}],[{ticker:"BIPS",name:"Invesco Bond Income Plus",subClass:"highYield"},{ticker:"GHYS",name:"iShares Global High Yield GBP-Hedged",subClass:"highYield"},{ticker:"IHYG",name:"iShares € High Yield Corp Bond",subClass:"highYield"},{ticker:"IHYU",name:"iShares $ High Yield Corp Bond",subClass:"highYield"},{ticker:"NCYF",name:"CQS New City High Yield",subClass:"highYield"}],[{ticker:"GCP",name:"GCP Infrastructure Investments",subClass:"infraDebt"},{ticker:"SEQI",name:"Sequoia Economic Infrastructure",subClass:"infraDebt"}],[{ticker:"CSH2",name:"Amundi Smart Overnight Return",subClass:"moneyMarket"},{ticker:"ERNS",name:"iShares £ Ultrashort Bond",subClass:"moneyMarket"},{ticker:"XSTR",name:"Xtrackers II Sterling Overnight Rate",subClass:"moneyMarket"}],[{ticker:"PHAU",name:"WisdomTree Physical Gold (USD)",subClass:"gold"},{ticker:"PHGP",name:"WisdomTree Physical Gold (GBP)",subClass:"gold"},{ticker:"RMAU",name:"Royal Mint Physical Gold",subClass:"gold"},{ticker:"SGLD",name:"Invesco Physical Gold",subClass:"gold"},{ticker:"SGLN",name:"iShares Physical Gold",subClass:"gold"}],[{ticker:"BHMG",name:"BH Macro",subClass:"trendMacro"},{ticker:"CGT",name:"Capital Gearing Trust",subClass:"trendMacro"},{ticker:"PNL",name:"Personal Assets Trust",subClass:"trendMacro"},{ticker:"RICA",name:"Ruffer Investment Company",subClass:"trendMacro"}],[{ticker:"AIGC",name:"WisdomTree Broad Commodities",subClass:"commodities"},{ticker:"BRNT",name:"WisdomTree Brent Crude Oil",subClass:"commodities"},{ticker:"CMOD",name:"Invesco Bloomberg Commodity",subClass:"commodities"},{ticker:"COPA",name:"WisdomTree Copper",subClass:"commodities"},{ticker:"CRUD",name:"WisdomTree WTI Crude Oil",subClass:"commodities"},{ticker:"PHSP",name:"WisdomTree Physical Silver (GBP)",subClass:"commodities"},{ticker:"WCOA",name:"WisdomTree Enhanced Commodity (USD)",subClass:"commodities"}]],cu=Object.freeze(FS.flat().sort((t,e)=>t.ticker.localeCompare(e.ticker))),we=Object.freeze({SHARES:"shares",BONDS:"bonds",DIVERSIFIERS:"diversifiers",CASH:"cash"}),Vt={ukEquityIncome:{bucket:we.SHARES,label:"UK equity income",nominalReturn:.068,yield:.04,vol:.16,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.07},globalEquityIncome:{bucket:we.SHARES,label:"Global equity income",nominalReturn:.07,yield:.03,vol:.16,eqCorr:.95,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.05},worldGrowth:{bucket:we.SHARES,label:"World growth / tracker",nominalReturn:.07,yield:.02,vol:.17,eqCorr:1,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},reit:{bucket:we.SHARES,label:"Property / REITs",nominalReturn:.065,yield:.045,vol:.19,eqCorr:.65,duration:4,inflationBeta:.3,creditBeta:.2,crisisBeta:0,idioVol:.13,note:"listed property: equity-like with rate sensitivity; rents partly inflation-linked"},emEquity:{bucket:we.SHARES,label:"Emerging-markets equity",nominalReturn:.075,yield:.028,vol:.22,eqCorr:.8,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.13},globalSmallCap:{bucket:we.SHARES,label:"Global smaller companies",nominalReturn:.075,yield:.018,vol:.2,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.09},shortGilts:{bucket:we.BONDS,label:"Short gilts 0-5y (buffer)",nominalReturn:.043,yield:.043,vol:.026,eqCorr:.1,duration:2.5,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.01},longGilts:{bucket:we.BONDS,label:"Long gilts 15y+",nominalReturn:.064,yield:.055,vol:.108,eqCorr:.2,duration:15,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.02},indexLinked:{bucket:we.BONDS,label:"Index-linked gilts (long)",nominalReturn:.047,yieldReal:.023,vol:.1,eqCorr:.33,duration:15,inflationBeta:1,creditBeta:0,crisisBeta:0,idioVol:.03,realYield:!0},corporateIG:{bucket:we.BONDS,label:"£ IG corporate",nominalReturn:.053,yield:.052,vol:.065,eqCorr:.41,duration:6.5,inflationBeta:0,creditBeta:.4,crisisBeta:0,idioVol:.03},globalAggHedged:{bucket:we.BONDS,label:"Global-agg £-hedged",nominalReturn:.045,yield:.045,vol:.053,eqCorr:.3,duration:6,inflationBeta:0,creditBeta:.2,crisisBeta:0,idioVol:.02},usTreasHedged:{bucket:we.BONDS,label:"US treasuries £-hedged",nominalReturn:.04,yield:.04,vol:.068,eqCorr:.1,duration:7,inflationBeta:0,creditBeta:0,crisisBeta:.15,idioVol:.02},infraDebt:{bucket:we.BONDS,label:"Infrastructure debt",nominalReturn:.064,yield:.06,vol:.07,eqCorr:.3,duration:8,inflationBeta:.3,creditBeta:.3,crisisBeta:0,idioVol:.03,note:"IG + ~115bps illiquidity premium"},highYield:{bucket:we.BONDS,label:"Global high-yield (£-hedged)",nominalReturn:.058,yield:.065,vol:.1,eqCorr:.6,duration:3.5,inflationBeta:0,creditBeta:.8,crisisBeta:0,idioVol:.05,note:"credit carry net of defaults; spreads blow out with equities in a crash"},moneyMarket:{bucket:we.CASH,label:"Money-market fund",nominalReturn:.034,yield:.034,vol:.002,eqCorr:0,duration:.1,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0,note:"FCA -1% real; = engine cash model"},savings:{bucket:we.CASH,label:"Savings / NS&I",nominalReturn:.034,yield:.034,vol:.001,eqCorr:0,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},gold:{bucket:we.DIVERSIFIERS,label:"Gold",nominalReturn:.055,yield:0,vol:.155,eqCorr:.05,duration:0,inflationBeta:.3,creditBeta:0,crisisBeta:.5,idioVol:.14,note:"near-uncorrelated; rises when stocks AND bonds fall (2022)"},trendMacro:{bucket:we.DIVERSIFIERS,label:"Trend / macro",nominalReturn:.045,yield:0,vol:.12,eqCorr:.07,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,momentumBeta:.6,idioVol:.1,note:"lagged path-momentum; pays in prolonged 2008/2022, whipsaws in V-shaped 2020"},commodities:{bucket:we.DIVERSIFIERS,label:"Broad commodities",nominalReturn:.045,yield:0,vol:.16,eqCorr:.25,duration:0,inflationBeta:.8,creditBeta:0,crisisBeta:0,idioVol:.14,note:"the strongest inflation hedge (2022); long flat stretches otherwise; crashes WITH equities in a demand shock (2008)"}},du=Object.freeze(JSON.parse(JSON.stringify(Vt))),zf=Object.freeze(["nominalReturn","yield","yieldReal","vol","eqCorr","duration","inflationBeta","creditBeta","crisisBeta","momentumBeta","idioVol"]);function ny(t){for(const[e,n]of Object.entries(du)){const s=Vt[e];for(const i of zf)n[i]!==void 0?s[i]=n[i]:delete s[i];const r=t&&t[e];if(r)for(const i of zf)r[i]!==void 0&&Number.isFinite(+r[i])&&(s[i]=+r[i])}}const VS=cu,sy=Object.freeze(Object.fromEntries(VS.map(t=>[t.ticker,t.subClass])));function ry(){const t={};for(const[e,n]of Object.entries(Vt))(t[n.bucket]=t[n.bucket]||[]).push({key:e,label:n.label});return t}const zS=.036,US=.4,$S=.005,qS=.35,iy=.01,uu=-.15,oy=.045;function Uf(t,e=.1){let n=zS+US*t;return e<uu&&t<oy&&(n-=iy),n}function $f(t,e=.1){let n=$S+qS*(t-.025);return e<uu&&t<oy&&(n-=iy),n}function HS(t){return t.inf>.045?"inflation":t.eqReturn<uu?"crash":"normal"}const WS=Object.freeze({shortGilts:{normal:.05,inflation:.3,crash:-.2},longGilts:{normal:.1,inflation:.45,crash:-.35},indexLinked:{normal:.15,inflation:.35,crash:-.15},corporateIG:{normal:.35,inflation:.45,crash:.55},globalAggHedged:{normal:.25,inflation:.4,crash:.1},usTreasHedged:{normal:.05,inflation:.25,crash:-.4},infraDebt:{normal:.3,inflation:.35,crash:.35},gold:{normal:0,inflation:-.05,crash:-.2},trendMacro:{normal:.05,inflation:-.1,crash:-.3},highYield:{normal:.5,inflation:.55,crash:.6},commodities:{normal:.2,inflation:-.1,crash:.4}});function pl(t,e){const n=WS[t];if(!n)return 0;const s=n[HS(e)];return s??n.normal}const YS=new Map(Object.entries(Vt).map(([t,e])=>[e,t]));function ml(t,e,n,s){if(!t)return 0;const r=(n-.1)/.17,i=Pr(0,1,s),o=e*r+Math.sqrt(Math.max(0,1-e*e))*i;return t*o}function GS(t,e,n){const{inf:s,prevInf:r,eqReturn:i,prevEqReturn:o=.1}=e,a=!!t.realYield,c=t.duration||0,d=a?$f(s,i)-$f(r,o):Uf(s,i)-Uf(r,o),h=a?(t.yieldReal||0)+s:t.yield||0,m=-c*d,f=a?0:(t.inflationBeta||0)*(s-.025),y=ml(t.idioVol||0,pl(YS.get(t),e),i,n);return h+m+f+y}const ay=Object.freeze({shortGilts:.3,longGilts:.2,indexLinked:.2,corporateIG:.3});function qf(t,e,n=ay){let s=0;for(const r of Object.keys(n)){const i=n[r];if(!i)continue;const o=Vt[r];o&&(s+=i*GS(o,t,e))}return s}const jS=.048,KS=.045;function QS(t,e){const{inf:n,eqReturn:s}=t,r=Vt.gold,i=(r.inflationBeta||0)*(n-.025),o=ml(r.idioVol||0,pl("gold",t),s,e);return jS+i+o}function JS(t,e,n){const s=Vt.trendMacro,r=t.eqReturn-.05,i=(s.momentumBeta||0)*n*r,o=ml(s.idioVol||0,pl("trendMacro",t),t.eqReturn,e);return KS+i+o}const Hf=.6,XS=.15;function ZS(t,e){return Hf*t+(1-Hf)*e}function ex(t){return Math.max(-1,Math.min(1,t/XS))}const tx=.035;function nx(t,e){const{inf:n}=t,s=Vt.commodities,r=(s.inflationBeta||0)*(n-.025),i=ml(s.idioVol||0,pl("commodities",t),t.eqReturn,e);return tx+r+i}const Dc=Object.freeze({gold:.5,trendMacro:.5});function Wf(t,e,n,s=Dc){let r=0;return s.gold&&(r+=s.gold*QS(t,e)),s.trendMacro&&(r+=s.trendMacro*JS(t,e,n)),s.commodities&&(r+=s.commodities*nx(t,e)),r}const nc={plain:{cautious:{equity:.3,bond:.45,cash:.25,diversifiers:0},balanced:{equity:.5,bond:.4,cash:.1,diversifiers:0},adventurous:{equity:.7,bond:.25,cash:.05,diversifiers:0}},sleeve:{cautious:{equity:.3,bond:.45,cash:.13,diversifiers:.12},balanced:{equity:.5,bond:.3,cash:.05,diversifiers:.15},adventurous:{equity:.65,bond:.15,cash:.05,diversifiers:.15}}},Ai={equity:{ticker:"VWRP",name:"Vanguard FTSE All-World (acc)",job:"World shares — the whole growth engine in one fund"},shortGilts:{ticker:"IGLS",name:"iShares UK Gilts 0–5yr",job:"Short gilts — stability, low rate risk"},longGilts:{ticker:"IGLT",name:"iShares Core UK Gilts",job:"Longer gilts — crash ballast, more rate risk"},indexLinked:{ticker:"INXG",name:"iShares £ Index-Linked Gilts",job:"Inflation-linked gilts — inflation protection"},corporateIG:{ticker:"SLXX",name:"iShares £ Corporate Bond",job:"Investment-grade credit — extra yield over gilts"},cash:{ticker:"CSH2",name:"Amundi Smart Overnight Return",job:"Cash-like — money-market rate, near-zero swings"},gold:{ticker:"SGLN",name:"iShares Physical Gold",job:"Gold — crisis hedge, no income"},trendMacro:{ticker:"PNL / CGT",name:"Personal Assets / Capital Gearing Trust",job:"Wealth-preserver trusts — defensive multi-asset"}};function sx(t,{diversifiers:e=!1}={}){const n=(e?nc.sleeve:nc.plain)[t]||nc.plain.balanced,s=[],r=o=>Math.round(o*100);s.push({...Ai.equity,pct:r(n.equity)});for(const[o,a]of Object.entries(ay))s.push({...Ai[o],pct:r(n.bond*a)});s.push({...Ai.cash,pct:r(n.cash)}),e&&n.diversifiers>0&&(s.push({...Ai.gold,pct:r(n.diversifiers*Dc.gold)}),s.push({...Ai.trendMacro,pct:r(n.diversifiers*Dc.trendMacro)}));const i=s.reduce((o,a)=>o+a.pct,0);return i!==100&&s.length&&(s.reduce((o,a)=>o.pct>=a.pct?o:a).pct+=100-i),{rows:s,note:'An example of the KIND of funds matching this mix — not a recommendation. Any similar fund doing the same job works; compare ongoing charges, and prefer £-hedged bond share classes. Tagging exactly these funds in "Use my own funds" reproduces this preset.'}}function Gn(t,e,n,s,r){if(r){const i=Math.max(0,1-e/n);return t*s*i}return t*s}const Zn={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,cash:.25},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.4,cash:.1},adventurous:{key:"adventurous",label:"Adventurous",equity:.7,bond:.25,cash:.05}};function gl(t,e,n){if(!t)return null;const s=Math.max(5,n-20),r=Math.min(1,e/s);return t.start+(t.end-t.start)*r}function hu(t,e,n=.22){const s=t+e;if(s<=0)return{start:0,end:0};const r=t/s;return{start:Math.max(0,r-n),end:r}}const rx=.12;function ly(t,e,n=null,s=rx){const r=t+e;if(r<=0)return{start:0,end:0};const i=t/r;let o;return n&&n.equityPct+n.bondPct>0?o=n.equityPct/(n.equityPct+n.bondPct):o=Math.min(1,i+s),{start:i,end:o}}function fu(t){const e=!!(t.subAsset&&t.subAsset.bondWeights&&Object.keys(t.subAsset.bondWeights).length>0),n=t.glideEndgame&&t.glideEndgame.equityPct+t.glideEndgame.bondPct>0?t.glideEndgame:null;return e?ly(t.equityMin,t.bondMin,n):hu(t.equityMin,t.bondMin)}function Yf(t,e,n){const s=t.cash,r=Math.max(0,1-s),i=gl(t.equityGlide,e,n);return i==null?{equity:t.equity,bond:t.bond,cash:s}:{equity:r*i,bond:r*(1-i),cash:s}}function ix(t,e,n){const s=Gn(t.equityMin,e,t.duration,n,!0),r=Gn(t.bondMin,e,t.duration,n,!0),i=Gn(t.cashTarget,e,t.duration,n,!1);return{equity:s,bond:r,cash:i,totalGrowth:s+r,total:s+r+i}}function cy(t,e=dp.ASSUMED_CPI){const n=[],s=t.equityGlideEnabled?fu(t):null,r=t.diversifierStart||0,i=t.hodlEnabled&&t.hodlValue||0;for(let o=0;o<=t.duration;o++){const a=Math.pow(1+e,o),c=ix(t,o,a);let d=c.equity,h=c.bond;if(s){const m=gl(s,o,t.duration),f=d+h;d=f*m,h=f*(1-m)}n.push({year:o,cumulativeInflation:a,equityMin:d,bondMin:h,cashTarget:c.cash,diversifier:r,hodl:i,equityShareOfPot:d+h+c.cash+r>0?d/(d+h+c.cash+r):0,totalMin:d+h+c.cash+r+i})}return n}function ga(t,e,n,s=Xe.HIGHER_RATE_LIMIT){if(t<=0)return 0;let r=e;if(t>Xe.PA_TAPER_THRESHOLD){const h=(t-Xe.PA_TAPER_THRESHOLD)*Xe.PA_TAPER_RATE;r=Math.max(0,e-h)}const i=Math.max(0,t-r),o=Math.max(0,n-r),a=s-n;let c=0;const d=Math.min(i,o);if(c+=d*Xe.BASIC_RATE,i>o){const h=Math.min(i-o,a);c+=h*Xe.HIGHER_RATE}if(i>o+a){const h=i-o-a;c+=h*Xe.ADDITIONAL_RATE}return c}function $t(t,e,n,s=Xe.HIGHER_RATE_LIMIT){return t-ga(t,e,n,s)}function ox(t,e,n,s=Xe.HIGHER_RATE_LIMIT){if(t<=0)return 0;let r=t,i=t+1;for(;$t(i,e,n,s)<t&&i<1e12;)i*=2;for(let o=0;o<60;o++){const a=(r+i)/2;$t(a,e,n,s)<t?r=a:i=a}return(r+i)/2}const sc={TAX_EFFICIENT:"minimiseEarlyTax",LONGEVITY:"maximiseLongevity"};function ax(t,e){return t<=0?t:t*Math.pow(1+e,1/12)}function ao({targetGross:t,fixedIncome:e=0,pa:n,brl:s,hrl:r,isaBalance:i=0,strategy:o=sc.TAX_EFFICIENT,yearsUntilSp:a=0,taxFreeFraction:c=0}){const d=Math.max(0,Math.min(.75,c||0));if(d===0){const S=$t(t,n,s,r),A=Math.max(0,Math.min(s,t)-e),b=$t(A+e,n,s,r),Y=Math.max(0,S-b),ie=o===sc.LONGEVITY&&a>0?i/a:1/0,q=Math.max(0,Math.min(Y,Math.max(0,i),ie)),se=i-q,ee=Y-q;let ye=A;if(ee>0){const re=ox(b+ee,n,s,r);ye=Math.max(A,re-e)}const he=ye+e,dt=$t(he,n,s,r);return{sippGross:ye,isaDraw:q,remainingIsa:se,taxable:he,tax:he-dt,net:dt+q,taxFree:0}}const h=$t(t,n,s,r),m=$t(e,n,s,r),f=S=>S*d/(1-d)+$t(e+S,n,s,r)-m,y=S=>{if(S<=0)return 0;let A=0,b=Math.max(1e3,S*(1-d)*1.5);for(;f(b)<S&&b<1e12;)b*=2;for(let Y=0;Y<80;Y++){const ie=(A+b)/2;f(ie)<S?A=ie:b=ie}return(A+b)/2},T=Math.max(0,s-e),E=y(Math.max(0,h-m)),x=Math.min(T,E),C=m+f(x),P=Math.max(0,h-C),D=o===sc.LONGEVITY&&a>0?i/a:1/0,R=Math.max(0,Math.min(P,Math.max(0,i),D)),B=i-R,N=P-R;let w=x;N>0&&(w=y(Math.max(0,h-m-R)));const v=w/(1-d),I=w+e,_=$t(I,n,s,r);return{sippGross:v,isaDraw:R,remainingIsa:B,taxable:I,tax:I-_,net:_+v*d+R,taxFree:v*d}}const Fa={CONSECUTIVE_LIMIT:3,RECOVERY_BUFFER:be.RECOVERY_BUFFER};function dy({totalGrowth:t,minGrowth:e,consecCashDraws:n,wasInProtection:s,consecutiveLimit:r=Fa.CONSECUTIVE_LIMIT,recoveryBuffer:i=Fa.RECOVERY_BUFFER}){let o=!1;return s&&(o=t<=e+i),!o&&t<e&&n+1>=r&&(o=!0),o}const lx=12;function Bc(t,e){const n=e??.8;return t<lx?1-(1-n)/2:n}const zr={MAX_FRACTION:.5,MIN_BOOST:50,SURPLUS_BUFFER:15e3};function ya({shortfall:t,standardMonthly:e,remainingMonths:n,surplus:s,brlHeadroom:r=1/0,maxFraction:i=zr.MAX_FRACTION,minBoost:o=zr.MIN_BOOST}){if(!(t>0)||!(s>0)||n<1)return 0;const a=[t/n,s/n];if(Number.isFinite(r)){if(r<=0)return 0;a.push(r/n)}a.push(e*i);const c=Math.min(...a);return c>o?c:0}const pu={ISA_ANNUAL_ALLOWANCE:2e4,MIN_RECYCLE:50};function uy({brlHeadroom:t,remainingMonths:e,isaAllowanceLeft:n,basicRate:s=.2}){if(!(t>0)||!(e>=1)||!(n>0))return{gross:0,net:0};let r=t/e,i=r*(1-s);const o=n/e;return i>o&&(i=o,r=i/(1-s)),i<pu.MIN_RECYCLE?{gross:0,net:0}:{gross:r,net:i}}const rc={REPLENISH_GATE:5e3,REPLENISH_SHORTFALL_FRAC:.3,REPLENISH_SURPLUS_FRAC:.5};function hy(t){const e=t.diversifier||0,n=t.hodl||0,s={fromEquity:0,fromBond:0,fromCash:0,fromDiversifier:0,fromHodl:0,shortfall:0,replenish:0,source:"Cash",reason:""};let r=t.draw;const i=Math.max(0,t.equity-t.eqMin),o=Math.max(0,t.bond-t.bdMin),a=i+o;if(!t.inProtection&&a>0){const m=Math.min(r,a);if(s.fromEquity=m*i/a,s.fromBond=m*o/a,r-=m,r<=1e-9){s.source="Growth",s.reason="Healthy";const f=t.csTarget-t.cash,y=a-m;return f>0&&y>rc.REPLENISH_GATE&&(s.replenish=Math.min(f*rc.REPLENISH_SHORTFALL_FRAC,y*rc.REPLENISH_SURPLUS_FRAC)),s}}const c=Math.min(r,t.cash);if(s.fromCash=c,r-=c,r>1e-9){const m=[{key:"fromDiversifier",value:e,target:t.diversifierTarget||e||1},{key:"fromBond",value:Math.max(0,t.bond-s.fromBond),target:Math.max(1,t.bdMin)},{key:"fromEquity",value:Math.max(0,t.equity-s.fromEquity),target:Math.max(1,t.eqMin)}].filter(f=>f.value>0).sort((f,y)=>y.value/y.target-f.value/f.target);for(const f of m){if(r<=1e-9)break;const y=Math.min(r,f.value);s[f.key]+=y,r-=y}if(r>1e-9&&n>0){const f=Math.min(r,n);s.fromHodl=f,r-=f}s.shortfall=Math.max(0,r)}const d=s.fromEquity+s.fromBond>1e-9,h=s.fromCash+s.fromDiversifier+s.fromHodl>1e-9||s.shortfall>0;return!t.inProtection&&a>0&&d&&h?(s.source="Mixed",s.reason="Growth surplus part-funds; the rest cascades"):s.fromHodl>0?(s.source="HODL",s.reason="Break glass"):s.fromDiversifier>0?(s.source=s.fromCash>0?"Cash + Diversifier":"Diversifier",s.reason=t.inProtection?"Protection":"Below min"):d?(s.source=s.fromBond>=s.fromEquity?"Bond":"Equity",s.reason="Cash exhausted — least-depressed sleeve pays"):(s.source="Cash",s.reason=t.inProtection?"Protection":a<=0?"Below min":"At min"),s}const cx=5,dx=20,ux=.01;function hx(t){return Math.min(Math.max(0,Math.floor(t)-cx+1),dx)}function Xr(t,e="declining"){return e!=="declining"?1:Math.pow(1-ux,hx(t))}function fx(t,e="declining"){if(e!=="declining")return 0;const n=Xr(t-1,e);return n===0?0:1-Xr(t,e)/n}const px=-.01,mx=5;function fy(t){return Math.max(0,t+px)}function Zt(t,e,n=0){const s=Xc(n);let r=t.equityStart,i=t.bondStart,o=t.cashStart,a=t.hodlEnabled?t.hodlStart!==void 0?t.hodlStart:t.hodlValue:0,c=0,d=t.diversifierStart||0,h=0,m=0,f=0,y=t.isaBalance||0,T=t.accessMethod==="ufpls"?268275:0,E=0,x=!1,C=null;const P=t.isaBalance||0,D=Math.max(1e3,P*.05);let R=null,B=0,N=0;const w=new Array(t.years+1).fill(null),v=new Array(t.years+1).fill(null);let I=0,_=0,S=0,A=0,b=!1,Y=!1,ie=null,q=0,se=0,ee=-1;const ye=[],he=t.trace?[]:null,dt=[];let re=1;ye.push({year:0,month:0,equity:r,bond:i,cash:o,hodl:a,total:r+i+o,draw:0,source:"None",inProtection:!1,equityMin:t.equityMin,bondMin:t.bondMin,cashMax:t.cashTarget});for(let oe=0;oe<t.years*12;oe++){const fe=Math.floor(oe/12),je=oe%12,nn=fe;if(nn!==ee&&(q=0,se=0,ee=nn),oe>0&&oe%12===0){const K=e.inflation[fe]||.025;dt.push(K),re*=1+K}const xt=gl(t.equityGlide,fe,t.duration);if(xt!=null&&je===0){const K=r+i;K>0&&(r=K*xt,i=K*(1-xt))}d>0&&je===0&&(fe>0&&(m=ZS(m,e.equity[fe-1]||0)),f=ex(m));const Ke=e.equity[fe]||0,Bt=e.inflation[fe]||.025,et=fe>0?e.inflation[fe-1]||.025:Bt;let sn=Gn(t.equityMin,fe,t.duration,re,!0),At=Gn(t.bondMin,fe,t.duration,re,!0);if(xt!=null){const K=sn+At;sn=K*xt,At=K*(1-xt)}const rn=Gn(t.cashTarget,fe,t.duration,re,!1),Us=sn+At,Er=b;if(b=t.disableProtection?!1:dy({totalGrowth:r+i,minGrowth:Us,consecCashDraws:A,wasInProtection:Er,consecutiveLimit:t.consecutiveLimit,recoveryBuffer:t.recoveryBuffer??Fa.RECOVERY_BUFFER}),b?(I++,S++):(_=Math.max(_,S),S=0),Array.isArray(t.windfalls)&&je===0){for(const K of t.windfalls)if(K.year===fe&&K.amount>0){if(K.toIsa){y+=K.amount;continue}const ve=r+i+o;if(ve<=0){o+=K.amount;continue}r+=K.amount*(r/ve),i+=K.amount*(i/ve),o+=K.amount*(o/ve)}}if(t.accessMethod==="ufpls"&&t.ufplsThenPcls&&t.ufplsYears>0&&fe>=t.ufplsYears&&je===0&&!x){x=!0;const K=r+i+o+d,ve=Math.max(0,Math.min(.25*K,T));if(ve>0&&K>0){const tt=1-ve/K;r*=tt,i*=tt,o*=tt,d*=tt,y+=ve,T-=ve,E=ve}}const{sippMonthly:Pn,isaMonthly:Rn,planInputs:Wt,taxAnnual:kt,higherRate:Ne,taxFreeMonthly:Oe,recycleGrossMonthly:Mn,recycleNetMonthly:_r}=wx(t,fe,re,dt,y,T);je===0&&(w[fe]=y/re,v[fe]=(r+i+o+d)/re),N+=kt/12/re,Ne&&B++;const ls=Pn,$s=ls,Dn=b?Bc(Math.max(0,S-1),t.protectionMult):1;let cs=b?ls*Dn:ls,He=cs;const zt=!b&&Mn>0?Mn:0,Bn=zt>0?_r:0;zt>0&&(He+=zt,N+=(zt-Bn)/re);const ds=Rn,Yt=he?{month:oe,year:fe,monthInYear:je,cumInf:re,equityStart:r,bondStart:i,cashStart:o,isaStart:y,sippMonthly:Pn,isaMonthly:Rn,effectiveSipp:cs,effectiveIsa:ds,boostAmount:0,inProtection:b,planInputs:Wt}:null;Yt&&he.push(Yt),b&&(q+=$s-He);const on=fe>0?e.equity[fe-1]||0:Ke,Tr=t.subAsset?qf({inf:Bt,prevInf:et,eqReturn:Ke,prevEqReturn:on},s,t.subAsset.bondWeights):gx(Bt,Ke,et,s),an=fy(et),Gt=K=>Math.pow(1+(Number.isFinite(K)?Math.max(-.99,K):-.99),1/12);if(r*=Gt(Ke),i*=Gt(Tr),o*=Gt(an),t.isaMix&&y>0){const K=t.isaMix;let ve=(K.shares||0)*Ke+(K.cash||0)*an;K.bonds&&(ve+=K.bonds*qf({inf:Bt,prevInf:et,eqReturn:Ke,prevEqReturn:on},s,K.bondWeights)),K.diversifiers&&(ve+=K.diversifiers*Wf({inf:Bt,eqReturn:Ke},s,f,K.diversifierWeights)),y*=Gt(ve)}else y=ax(y,t.isaReturn||Ft.RETURN);if(a>0){const tt=(s()-.5)*2*.06;let Ve=0;Ke<-.1?Ve=Math.min(.15,Math.abs(Ke)*.4):Ke<-.05&&(Ve=Math.abs(Ke)*.2);let Nn=.069+tt+Ve;Nn=Math.max(-.08,Math.min(.18,Nn)),a*=Gt(Nn)}if(d>0){const K=Wf({inf:Bt,eqReturn:Ke},s,f,t.subAsset&&t.subAsset.diversifierWeights);d*=Gt(K)}const Ln=r+i;let ut=0;if(!b){const K=12-je,ve=se+$s*K+Wt.fixed;ut=ya({shortfall:q,standardMonthly:$s,remainingMonths:K,surplus:Ln-Us-zr.SURPLUS_BUFFER,brlHeadroom:Wt.brl-ve}),ut>50&&(He+=ut,q-=ut)}if(se+=He,Yt&&(Yt.effectiveSipp=He,Yt.boostAmount=ut>50?ut:0),!Number.isFinite(He)){Y=!0,ie=oe;break}const Fe=hy({draw:He,equity:r,bond:i,cash:o,diversifier:d,diversifierTarget:t.diversifierStart||0,hodl:a,eqMin:sn,bdMin:At,csTarget:rn,inProtection:b});if(r-=Fe.fromEquity,i-=Fe.fromBond,o-=Fe.fromCash,Fe.fromDiversifier>0&&(d-=Fe.fromDiversifier,h+=Fe.fromDiversifier),Fe.fromHodl>0&&(a-=Fe.fromHodl,c+=Fe.fromHodl,C===null&&(C=oe)),Fe.shortfall>1e-6&&(Y=!0,ie=oe),Fe.replenish>0){const K=Math.max(0,r-sn),ve=Math.max(0,i-At),tt=K+ve;tt>0&&(r-=Fe.replenish*K/tt,i-=Fe.replenish*ve/tt,o+=Fe.replenish)}const us=Fe.source;if(A=us==="Growth"?0:A+1,y=Math.max(0,y-Math.min(ds,y))+Bn,T>0&&(T=Math.max(0,T-(Oe||0))),R===null&&P>0&&y/re<D&&(R=oe),r=Math.max(0,r),i=Math.max(0,i),o=Math.max(0,o),d=Math.max(0,d),(je===0||oe===t.years*12-1||Y)&&ye.push({year:fe+je/12,month:oe,equity:r,bond:i,cash:o,hodl:a,diversifier:d,total:r+i+o+d,draw:He,boostAmount:ut,source:us,inProtection:b,equityMin:sn,bondMin:At,cashMax:rn}),Y)break}if(_=Math.max(_,S),!Y)w[t.years]=y/(re||1),v[t.years]=(r+i+o+d)/(re||1);else for(let oe=Math.floor(ie/12)+1;oe<=t.years;oe++)v[oe]=0;let V=0,xe=0,ae=0,tn=0,Ge=1;for(let oe=0;oe<t.years;oe++){const fe=e.inflation[oe]??.025;V+=fe,Ge*=1+fe,xe+=e.equity[oe]??0,oe<5&&(ae+=e.equity[oe]??0,tn++)}const Cn=r+i+o+d;return{failed:Y,duration:t.years,years:Y?ie/12:t.years,failMonth:ie,avgInflation:V/t.years,avgEquityReturn:xe/t.years,earlyEquityReturn:tn?ae/tn:0,cumInflation:Ge,finalReal:Cn/Ge,final:Cn,finalEquity:r,finalBond:i,finalCash:o,finalHodl:a,finalDiversifier:d,divUsed:h,protMonths:I,maxConsec:_,hodlUsed:c,hodlUsedMonth:C,startIsa:P,finalIsa:y,pclsTaken:E,isaDepletedMonth:R,isaLastedYears:R===null?t.years:R/12,higherRateYears:B/12,totalTaxReal:N,isaByYear:w,potByYear:v,hist:ye,trace:he,seed:n}}function gx(t,e,n,s){let r=.15,i=.3,o=.2,a=.1,c=.1,d=.15;const h=n!==void 0?n:t,m=h>.045,f=h>.07;if(m){const N=s()>.3?1:.5;f?(r=.15+.35*N,i=.3-.2*N,d=.15-.1*N,a=.1+.05*N):(r=.15+.2*N,i=.3-.1*N,d=.15-.05*N)}m&&s()<.15&&(r=.2,i=.25,d=.12);const y=t+.005+Pr(0,.03,s),T=.04-(t>.04?(t-.04)*.5:0)+Pr(0,.05,s),E=.03+t*.3+Pr(0,.08,s),x=t*.8+Pr(0,.15,s),C=fy(n),P=e*.5+Pr(0,.02,s),D=r*y+i*T+o*E+a*x+c*C+d*P,R=yx(t,e),B=(e-.1)/.17;return D+R*B*.055}function yx(t,e){return t>.045?.4:e<-.15?-.3:.1}function vx(t,e){return Xr(e,t.spendingProfile||"flat")}function bx(t,e){return t.spStartYear!==void 0?Math.max(0,t.spStartYear-e):t.statePensionYear!==void 0?Math.max(0,t.statePensionYear-e):0}function wx(t,e,n,s,r=0,i=0){const o=t.taxMode==="frozen"?t.pa:t.pa*n,a=t.taxMode==="frozen"?t.brl:t.brl*n,c=t.taxMode==="frozen"?t.hrl:(t.hrl||125140)*n,h=(Array.isArray(t.targetSchedule)&&t.targetSchedule[e]!=null?t.targetSchedule[e]:t.baseSalary)*n*vx(t,e),m=$l(t.other,s);let f=0;if(t.spStartYear!==void 0){if(e>=t.spStartYear&&t.spWeeklyAmount>0){const N=t.spWeeklyAmount*52;e===t.spStartYear&&t.spFirstYearRatio!==void 0?f=N*t.spFirstYearRatio*n:f=N*n}}else t.statePensionYear!==void 0&&(f=e>=t.statePensionYear?(t.statePension||0)*n:0);let y=0;if(t.dbAmount>0&&e>=(t.dbStartYear||0)){const N=t.dbIndexation||"lpi5";N==="level"?y=t.dbAmount:N==="cpi"?y=t.dbAmount*n:y=$l(t.dbAmount,s,.05)}let T=0;for(const N of t.extraIncomes||[])if(N.annual>0&&e>=(N.startYear||0)&&(N.endYear==null||e<=N.endYear)){const w=N.indexation||"lpi5";w==="level"?T+=N.annual:w==="cpi"?T+=N.annual*n:T+=$l(N.annual,s,.05)}const E=m+f+y+T,x=bx(t,e),C=!t.ufplsYears||e<t.ufplsYears,P=t.accessMethod==="ufpls"&&C&&i>0?.25:0,D=ao({targetGross:h,fixedIncome:E,pa:o,brl:a,hrl:c,isaBalance:r,strategy:t.isaDrawdownStrategy||Ft.DRAWDOWN_STRATEGY,yearsUntilSp:x,taxFreeFraction:P});let R=0,B=0;if(t.bandFillRecycle&&P===0){const N=uy({brlHeadroom:a-D.taxable,remainingMonths:12,isaAllowanceLeft:pu.ISA_ANNUAL_ALLOWANCE});R=N.gross,B=N.net}return{sippMonthly:D.sippGross/12,isaMonthly:D.isaDraw/12,taxFreeMonthly:(D.taxFree||0)/12,recycleGrossMonthly:R,recycleNetMonthly:B,taxAnnual:D.tax,higherRate:D.taxable>a+1,planInputs:{target:h,other:m,statePension:f,fixed:E,pa:o,brl:a,hrl:c,yearsUntilSp:x}}}function mu(t,e=1e3){const n=[];for(let s=0;s<e;s++)n.push(Zt(t,hr(t,s),s));return n}function hr(t,e){const n=Object.keys(rr).map(Number).sort((c,d)=>c-d),s=n.length,r=Xc(e*12345),i={equity:{},inflation:{}},o=t.blockYears||mx;let a=0;for(;a<t.years;){const c=Math.floor(r()*s);for(let d=0;d<o&&a<t.years;d++,a++){const h=n[(c+d)%s];i.equity[a]=rr[h],i.inflation[a]=$a[h]||.025}}return i}function py(t){const e=Object.keys(rr).map(Number).sort((r,i)=>r-i),n=Math.max(...e),s=[];for(const r of e){if(r+t.years-1>n)continue;const i={equity:{},inflation:{}};for(let a=0;a<t.years;a++)i.equity[a]=rr[r+a]||0,i.inflation[a]=$a[r+a]||.025;const o=Zt(t,i,r);o.startYear=r,s.push(o)}return s}function Ex(t,e){const n={equity:{},inflation:{}};for(let s=0;s<t.years;s++)n.equity[s]=e.equity[s%e.equity.length],n.inflation[s]=e.inflation[s%e.inflation.length];return Zt(t,n,999)}function _x(t){const e=t.filter(n=>n.failed).length;return(t.length-e)/t.length*100}function Tx(t){if(!t||t.failCount===0)return"No shortfalls: every simulated future funded the whole plan.";const e=d=>(d*100).toFixed(1)+"%",n=Math.round(t.medianFailYear),s=t.duration,r=Math.round(t.pctNearMiss);let i;t.pctNearMiss>=60?i=`and when they do it's usually late — the typical shortfall is at year ${n} of ${s}, and ${r}% happen only in the final years, after funding almost the whole of retirement`:t.pctNearMiss<=30?i=`and they tend to come EARLY — the typical shortfall is at year ${n} of ${s}, with only ${r}% holding on to the final years. An early shortfall is the serious kind, with little retirement left to adjust`:i=`spread through retirement — the typical shortfall is at year ${n} of ${s}`;const o=[{mag:t.succEarlyEq-t.failEarlyEq,text:`a poor first few years of markets (sequence-of-returns risk): the futures that fell short averaged ${e(t.failEarlyEq)} equity in the opening 5 years versus ${e(t.succEarlyEq)} for those that lasted`},{mag:t.succAvgEq-t.failAvgEq,text:`weak markets across the whole plan: ${e(t.failAvgEq)} average equity return versus ${e(t.succAvgEq)} for those that lasted`},{mag:t.failAvgInf-t.succAvgInf,text:`higher inflation eroding spending power: ${e(t.failAvgInf)} a year versus ${e(t.succAvgInf)} for those that lasted`}].filter(d=>d.mag>.005).sort((d,h)=>h.mag-d.mag),a=`About ${Math.round(t.failRate||0)}% of futures fall short`;if(!o.length)return`${a}, ${i}. No single market driver stands out — the shortfalls come down to broadly bad luck across returns and inflation.`;let c=`The common thread is ${o[0].text}`;return o[1]&&o[1].mag>o[0].mag*.5&&(c+=`. A secondary factor is ${o[1].text}`),`${a}, ${i}. ${c}.`}function my(t){const e=t.filter(a=>!a.failed),n=t.filter(a=>a.failed),s=t.map(a=>a.years).sort((a,c)=>a-c),r=e.map(a=>a.final).sort((a,c)=>a-c),i=t.map(a=>a.protMonths).sort((a,c)=>a-c),o=(a,c)=>a[Math.floor(a.length*c)]||0;return{total:t.length,successCount:e.length,failCount:n.length,successRate:_x(t),survival:{p5:o(s,.05),p10:o(s,.1),p25:o(s,.25),p50:o(s,.5),p75:o(s,.75),p90:o(s,.9),p95:o(s,.95),min:s[0],max:s[s.length-1]},finalValue:{p5:o(r,.05),p10:o(r,.1),p25:o(r,.25),p50:o(r,.5),p75:o(r,.75),p90:o(r,.9),p95:o(r,.95),min:r[0]||0,max:r[r.length-1]||0,avg:e.reduce((a,c)=>a+c.final,0)/(e.length||1)},minYears:s[0],p10Years:o(s,.1),medianYears:o(s,.5),medianFinal:o(r,.5),p10Final:o(r,.1),p90Final:o(r,.9),avgFinal:e.reduce((a,c)=>a+c.final,0)/(e.length||1),protection:{runsWithProtection:t.filter(a=>a.protMonths>0).length,pctWithProtection:t.filter(a=>a.protMonths>0).length/t.length*100,avgMonths:i.reduce((a,c)=>a+c,0)/t.length,maxMonths:Math.max(...i),maxConsecutive:Math.max(...t.map(a=>a.maxConsec)),avgConsecutive:t.reduce((a,c)=>a+c.maxConsec,0)/t.length,p50Months:o(i,.5),p90Months:o(i,.9),p95Months:o(i,.95)},runsWithProtection:t.filter(a=>a.protMonths>0).length,avgProtMonths:i.reduce((a,c)=>a+c,0)/t.length,maxProtMonths:Math.max(...i),maxConsecutive:Math.max(...t.map(a=>a.maxConsec)),avgConsecutive:t.reduce((a,c)=>a+c.maxConsec,0)/t.length,hodl:{runsUsingHodl:t.filter(a=>a.hodlUsed>0).length,pctUsingHodl:t.filter(a=>a.hodlUsed>0).length/t.length*100,avgUsed:t.filter(a=>a.hodlUsed>0).length>0?t.filter(a=>a.hodlUsed>0).reduce((a,c)=>a+c.hodlUsed,0)/t.filter(a=>a.hodlUsed>0).length:0,maxUsed:Math.max(...t.map(a=>a.hodlUsed||0))},runsUsingHodl:t.filter(a=>a.hodlUsed>0).length,avgHodlUsed:t.filter(a=>a.hodlUsed>0).length>0?t.filter(a=>a.hodlUsed>0).reduce((a,c)=>a+c.hodlUsed,0)/t.filter(a=>a.hodlUsed>0).length:0,maxHodlUsed:Math.max(...t.map(a=>a.hodlUsed||0)),severity:(()=>{const a=Math.max(...t.map(E=>E.duration||E.years),1),c=t.filter(E=>E.failed),d=t.filter(E=>!E.failed),h=c.map(E=>E.years).sort((E,x)=>E-x),m=a*.85,f=(E,x)=>E.length?E.reduce((C,P)=>C+(P[x]||0),0)/E.length:0,y={duration:a,coverage:t.reduce((E,x)=>E+Math.min(1,(x.years||0)/a),0)/t.length*100,failCount:c.length,failRate:t.length?c.length/t.length*100:0,medianFailYear:h.length?o(h,.5):0,pctNearMiss:c.length?c.filter(E=>E.years>=m).length/c.length*100:0,failEarlyEq:f(c,"earlyEquityReturn"),succEarlyEq:f(d,"earlyEquityReturn"),failAvgEq:f(c,"avgEquityReturn"),succAvgEq:f(d,"avgEquityReturn"),failAvgInf:f(c,"avgInflation"),succAvgInf:f(d,"avgInflation")};y.diagnosis=Tx(y);const T=[{k:"sequence",m:y.succEarlyEq-y.failEarlyEq},{k:"market",m:y.succAvgEq-y.failAvgEq},{k:"inflation",m:y.failAvgInf-y.succAvgInf}].filter(E=>E.m>.005).sort((E,x)=>x.m-E.m);return y.primaryDriver=y.failCount>0&&T.length?T[0].k:null,y})(),finalReal:(()=>{const a=t.map(c=>c.failed?0:c.finalReal||0).sort((c,d)=>c-d);return{p5:o(a,.05),p10:o(a,.1),p25:o(a,.25),p50:o(a,.5),p75:o(a,.75),p90:o(a,.9),p95:o(a,.95),min:a[0]||0,max:a[a.length-1]||0}})(),chartData:(()=>{const a=Math.max(...t.map(m=>m.duration||m.years),1),c=a+1,d={p10:[],p25:[],p50:[],p75:[],p90:[]},h=[];for(let m=0;m<c;m++){const f=t.map(T=>T.potByYear&&T.potByYear[m]!=null?T.potByYear[m]:0).sort((T,E)=>T-E);d.p10.push(o(f,.1)),d.p25.push(o(f,.25)),d.p50.push(o(f,.5)),d.p75.push(o(f,.75)),d.p90.push(o(f,.9));const y=t.filter(T=>(T.failed?T.failMonth/12:a)>=m).length;h.push(t.length?y/t.length*100:0)}return{years:c,potBand:d,solvency:h}})(),isa:(()=>{const a=t.filter(E=>(E.startIsa||0)>0);if(!a.length)return{funded:!1};const c=a.map(E=>E.isaLastedYears).sort((E,x)=>E-x),d=a.map(E=>E.finalIsa).sort((E,x)=>E-x),h=a.map(E=>E.higherRateYears),m=a.map(E=>E.totalTaxReal).sort((E,x)=>E-x),f=Math.max(...a.map(E=>(E.isaByYear||[]).length)),y=[],T=[];for(let E=0;E<f;E++){const x=a.filter(P=>P.isaByYear&&P.isaByYear[E]>0).length;y.push(a.length?x/a.length*100:0);const C=a.map(P=>P.isaByYear&&P.isaByYear[E]!=null?P.isaByYear[E]:0).sort((P,D)=>P-D);T.push(C[Math.floor(C.length/2)])}return{funded:!0,runs:a.length,startBalance:a[0].startIsa,medianLastedYears:o(c,.5),minLastedYears:c[0],pctSurviveFullTerm:a.filter(E=>E.isaDepletedMonth===null).length/a.length*100,finalBalance:{p10:o(d,.1),p50:o(d,.5),p90:o(d,.9)},avgHigherRateYears:h.reduce((E,x)=>E+x,0)/a.length,maxHigherRateYears:Math.max(...h),pctEverHigherRate:a.filter(E=>E.higherRateYears>0).length/a.length*100,medianTotalTax:o(m,.5),p90TotalTax:o(m,.9),pctHoldingByYear:y,medianIsaByYear:T}})(),failures:n.map(a=>({seed:a.seed,startYear:a.startYear,years:a.years,failMonth:a.failMonth,protMonths:a.protMonths}))}}const Ix={ANNUAL_ALLOWANCE:6e4,TAPER_THRESHOLD_INCOME:2e5,MPAA:1e4,NMPA_NEW:57,LSA_POT_THRESHOLD:1073100},Sx={low:.02,mid:.05,high:.08};function xx(t,e=12570,n=50270,s=125140){return t<=e?0:t<=n?.2:t<=s?.4:.45}function Ax(t,e=50270){return t<=12570?0:t<=e?.08:.02}function kx({netMonthly:t=0,salary:e=0,schemeType:n="ras",employerMonthly:s=0}){const r=xx(e),i=Ax(e),o=[];let a=0,c=0,d=0;n==="salsac"?(a=t/Math.max(.2,1-r-i),d=a*i,o.push("Salary sacrifice also saves your employer 15% NI — many employers add some or all of that; ask. From April 2029 the NI exemption is capped at £2,000/yr sacrificed (Autumn Budget 2025).")):n==="netpay"?a=t/Math.max(.2,1-r):(a=t/.8,r>.2&&(c=a*(r-.2),o.push("You must CLAIM the extra "+Math.round((r-.2)*100)+"% relief (≈£"+Math.round(c)+"/mo) from HMRC via self-assessment — it is not automatic and is commonly missed.")),r===0&&o.push("Non-taxpayers still get the 25% top-up on contributions up to £3,600 gross/yr (£2,880 net) — relief at source only."));const h=a+(s||0);return{grossMonthly:a,employerMonthly:s||0,totalMonthly:h,reliefMonthly:a-t,niSavedMonthly:d,hrClaimMonthly:c,costPerPound:h>0?t/h:1,notes:o}}function Cx({annualGrossTotal:t=0,salary:e=0,mpaaTriggered:n=!1,currentAge:s=0,retirementAge:r=0,projectedPotHigh:i=0}){const o=Ix,a=[];return n&&t>o.MPAA&&a.push({severity:"danger",message:"MPAA: your Decision-tool history shows UFPLS income has been taken, which permanently caps tax-relieved contributions at £10,000/yr — this plan exceeds it. The excess is taxed back via an annual-allowance charge."}),t>o.ANNUAL_ALLOWANCE&&a.push({severity:"warning",message:"Annual Allowance: total contributions exceed £60,000/yr. Unused allowance from the previous 3 tax years (carry-forward) may cover it — otherwise the excess is taxed at your marginal rate."}),e>o.TAPER_THRESHOLD_INCOME&&a.push({severity:"warning",message:"High income: above £200k threshold income the Annual Allowance may taper (£1 lost per £2 of adjusted income over £260k, floor £10,000)."}),r>0&&r<o.NMPA_NEW&&(new Date().getFullYear()+Math.max(0,55-s)>=2028||r<55)&&a.push({severity:"warning",message:"Access age: the normal minimum pension age rises to 57 on 6 April 2028. Retiring before 57 means bridging from ISA/other savings until the pension can be touched."}),i>o.LSA_POT_THRESHOLD&&a.push({severity:"info",message:"Large pot: above £1,073,100 the £268,275 Lump Sum Allowance means your effective tax-free cash falls below 25% — worth planning the crystallisation strategy early."}),a}function Px({currentAge:t,retirementAge:e,potNow:n=0,totalMonthly:s=0,escalationPct:r=0,assumedCpi:i=.025}){const o=Math.max(0,Math.round(e-t)),a=[],c={low:n,mid:n,high:n};let d=s,h=0;a.push({age:t,year:0,potLow:n,potMid:n,potHigh:n,contributedToDate:0});for(let m=1;m<=o;m++){for(let y=0;y<12;y++){for(const T of Object.keys(c))c[T]=c[T]*(1+Sx[T]/12)+d;h+=d}d*=1+(r||0)/100;const f=Math.pow(1+i,m);a.push({age:t+m,year:m,potLow:c.low/f,potMid:c.mid/f,potHigh:c.high/f,contributedToDate:h})}return a}function Rx(t,e=.85,n=300){const s=(t.equityStart||0)+(t.bondStart||0)+(t.cashStart||0),r=s>0?{e:t.equityStart/s,b:t.bondStart/s,c:t.cashStart/s}:{e:.6,b:.3,c:.1},i=d=>{const h={...t,equityStart:d*r.e,bondStart:d*r.b,cashStart:d*r.c,equityMin:(t.equityMin||0)*(s>0?d/s:1),bondMin:(t.bondMin||0)*(s>0?d/s:1),cashTarget:(t.cashTarget||0)*(s>0?d/s:1)},m=mu(h,n);return m.filter(f=>!f.failed).length/m.length};let o=1e4,a=5e6;for(let d=0;d<12;d++){const h=(o+a)/2;i(h)>=e?a=h:o=h}const c=a;return{requiredPot:c,successAtRequired:i(c)}}function yl(t){const e=typeof t=="string"?new Date(t):t,n=e.getFullYear(),s=e.getMonth()+1,r=e.getDate();if(s<vn.START_MONTH||s===vn.START_MONTH&&r<vn.START_DAY){const i=n-1;return`${String(i).slice(-2)}/${String(n).slice(-2)}`}return`${String(n).slice(-2)}/${String(n+1).slice(-2)}`}function ic(t){const e=parseInt(t.split("/")[0]),n=e<50?2e3+e:1900+e;return new Date(n,vn.START_MONTH-1,vn.START_DAY)}function Mx(t){const e=parseInt(t.split("/")[1]),n=e<50?2e3+e:1900+e;return new Date(n,vn.START_MONTH-1,vn.START_DAY-1)}function Dx(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`}function gu(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,15)}function Bx(t){const n=(typeof t=="string"?new Date(t):t).getMonth()+1;return n>=vn.START_MONTH?12-(n-vn.START_MONTH):vn.START_MONTH-n}function hi(t){if(!t)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},n=t.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(n)){const r=new Date(n);if(!isNaN(r.getTime()))return r}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,i,o]=n.split("/").map(Number);return new Date(o,i-1,r)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(n)){const[r,i,o]=n.split("-").map(Number);return new Date(o,i-1,r)}let s=n.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}if(s=n.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}if(s=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}if(s=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}return null}function va(t){const e=typeof t=="string"?hi(t):t;if(!e||isNaN(e.getTime()))return"";const n=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${n[e.getMonth()]} ${e.getFullYear()}`}function Lx(t){const{taxYear:e,spStartDate:n,weeklyAmount:s,taxYearConfigs:r={}}=t;if(!n||!s||s<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const i=typeof n=="string"?hi(n):n;if(!i||isNaN(i.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const o=yl(i);ic(e);const a=Mx(e),c=[...new Set([o,e,...Object.keys(r)])].sort((E,x)=>ic(E).getTime()-ic(x).getTime()),d=c.indexOf(o),h=c.indexOf(e);if(h<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:va(i)};let m=1;for(let E=d;E<h;E++){const x=c[E],C=r[x],P=(C==null?void 0:C.cpi)||.025;m*=1+P}const f=s*m;if(e===o){const x=Math.max(0,(a.getTime()-i.getTime())/6048e5),C=f*x;return{annual:C,monthly:C/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(x*10)/10,startDate:va(i)}}const T=f*52;return{annual:T,monthly:T/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:va(i)}}function Nx(t,e=new Date){const n=typeof t=="string"?hi(t):t;if(!n||isNaN(n.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const s=n.getTime()-e.getTime(),r=s<=0;if(r)return{years:0,months:0,totalMonths:0,isPast:!0};const i=Math.floor(s/(30.44*24*60*60*1e3)),o=Math.floor(i/12),a=i%12;return{years:o,months:a,totalMonths:i,isPast:r}}const gy=2016;function vl(t,{now:e=new Date}={}){if(!t||!String(t).trim())return{valid:!0,error:null,warning:null,date:null};const n=hi(t);if(!n||isNaN(n.getTime()))return{valid:!1,error:'Could not read that date. Try a format like "6 May 2040".',warning:null,date:null};const s=n.getFullYear();return s<gy?{valid:!1,error:`That looks like a date of birth (${s}), not a State Pension start date. Enter the date your State Pension begins — check gov.uk/check-your-state-pension.`,warning:null,date:n}:n.getTime()<e.getTime()?{valid:!0,error:null,warning:`This date is in the past — State Pension will be treated as already in payment from ${s}.`,date:n}:{valid:!0,error:null,warning:null,date:n}}function bl(t,e=new Date){if(!t.spStartDate||!t.spWeeklyAmount)return null;const n=hi(t.spStartDate);if(!n)return null;const s=365.25*24*60*60*1e3,r=Math.max(0,(n.getTime()-e.getTime())/s),i=Math.floor(r),o=365,a=Math.floor((n-new Date(n.getFullYear(),0,0))/(24*60*60*1e3)),c=(o-a)/o;return{spStartYear:i,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:c}}const Gf=Object.freeze(Object.defineProperty({__proto__:null,MIN_SP_START_YEAR:gy,calculateStatePensionForTaxYear:Lx,formatStatePensionDate:va,getTimeUntilStatePension:Nx,parseStatePensionDate:hi,spSimConfigFromSettings:bl,validateStatePensionDate:vl},Symbol.toStringTag,{value:"Module"}));function Ox(t,e,n=1e3){const s=Math.max(t.years,e.years);let r=0,i=0,o=0;const a=Array.from({length:s+1},()=>[]);for(let h=0;h<n;h++){const m=hr({years:s},h),f=Zt(t,m,h),y=Zt(e,m,h+5e5);f.failed||i++,y.failed||o++,!f.failed&&!y.failed&&r++;const T=(E,x)=>{const C=(E.potByYear||[]).length,P=Math.min(x,C-1),D=E.potByYear&&E.potByYear[P]!=null?E.potByYear[P]:0,R=E.isaByYear&&E.isaByYear[P]!=null?E.isaByYear[P]:0;return D+R};for(let E=0;E<=s;E++)a[E].push(T(f,E)+T(y,E))}const c=(h,m)=>{const f=[...h].sort((y,T)=>y-T);return f[Math.min(f.length-1,Math.floor(m*f.length))]},d=a.map((h,m)=>({year:m,p10:c(h,.1),p50:c(h,.5),p90:c(h,.9)}));return{runs:n,jointSuccess:r/n,successA:i/n,successB:o/n,independenceAssumed:i/n*(o/n),potFan:d}}function Zr(t,e){return(Array.isArray(t.targetSchedule)&&t.targetSchedule[e]!=null?t.targetSchedule[e]:t.baseSalary||0)*Xr(e,t.spendingProfile||"flat")}function Lc(t){const e=bl(t);return e?{startYear:e.spStartYear,annual:e.spWeeklyAmount*52}:t.statePensionYear!=null&&t.statePension>0?{startYear:t.statePensionYear,annual:t.statePension}:{startYear:1/0,annual:0}}function Fx(t,e,n=null){const s=t.duration||35,r=e.duration||35,i=n??Math.max(s,r),o=Lc(t),a=Lc(e),c=[];for(let d=0;d<=i;d++){const h=d<=s?Zr(t,d):0,m=d<=r?Zr(e,d):0,f=d>=o.startYear?o.annual:0,y=d>=a.startYear?a.annual:0,T=(t.dbAmount>0&&d>=(t.dbStartYear||0)?t.dbAmount:0)+(e.dbAmount>0&&d>=(e.dbStartYear||0)?e.dbAmount:0),E=(t.other||0)+(e.other||0),x=h+m,C=f+y+T+E;c.push({year:d,needA:h,needB:m,need:x,spA:f,spB:y,db:T,other:E,guaranteed:C,drawNeed:Math.max(0,x-C),bridge:o.annual>0&&d<o.startYear||a.annual>0&&d<a.startYear})}return c}function Vx({survivorCfg:t,survivorSettings:e,deceasedCfg:n,deceasedSettings:s,deathYear:r,spendFraction:i=.7,dbSurvivorPct:o=.5,runs:a=500}){const c=[],d=[],h=Math.max(r+1,n.years);for(let B=0;B<a;B++){const N=Zt(n,hr({years:h},B),B+9e5),w=Math.min(r,(N.potByYear||[]).length-1);c.push(N.potByYear&&N.potByYear[w]||0),d.push(N.isaByYear&&N.isaByYear[w]||0)}const m=B=>{const N=[...B].sort((w,v)=>w-v);return N[Math.floor(N.length/2)]},f=Math.pow(1.025,r),y=m(c)*f,T=m(d)*f,E=e.duration||35,x=s.duration||35,C=[];for(let B=0;B<=E;B++){const N=Zr(e,B);B<r?C.push(N):C.push((N+(B<=x?Zr(s,B):0))*i)}const P=[...t.extraIncomes||[]];s.dbAmount>0&&o>0&&P.push({startYear:Math.max(r,s.dbStartYear||0),annual:s.dbAmount*o,indexation:s.dbIndexation||"lpi5"});const D={...t,targetSchedule:C,spendingProfile:"flat",windfalls:[...t.windfalls||[],{year:r,amount:y},{year:r,amount:T,toIsa:!0}].filter(B=>B.amount>0),extraIncomes:P};let R=0;for(let B=0;B<a;B++)Zt(D,hr({years:D.years},B),B+7e5).failed||R++;return{survivorSuccess:R/a,inheritedPots:y,inheritedIsa:T,survivorAnnualAfter:C[Math.min(r,E)]}}function zx(t,e,n="You",s="Partner"){const r=f=>{const y=Lc(f),T=(y.startYear<=0?y.annual:0)+(f.other||0)+(f.dbAmount>0&&(f.dbStartYear||0)<=0?f.dbAmount:0),E=Zr(f,0),x=f.accessMethod==="ufpls"&&(!f.ufplsYears||f.ufplsYears>0)?.25:0;return{taxable:ao({targetGross:E,fixedIncome:T,pa:f.pa??12570,brl:f.brl??50270,hrl:f.hrl??125140,isaBalance:f.isaBalance||0,strategy:f.isaDrawdownStrategy,yearsUntilSp:0,taxFreeFraction:x}).taxable,target:E,brl:f.brl??50270}},i=r(t),o=r(e),a=Math.max(0,i.brl-i.taxable),c=Math.max(0,o.brl-o.taxable),d=Math.max(0,i.taxable-i.brl),h=Math.max(0,o.taxable-o.brl);let m=null;if(d>0&&c>1e3){const f=Math.min(d,c);m=n+" pays 40% tax on about £"+Math.round(d).toLocaleString()+"/yr while "+s+" has £"+Math.round(c).toLocaleString()+" of unused 20% band. Funding £"+Math.round(f).toLocaleString()+" more of the spending from "+s+"’s pots could save ~£"+Math.round(f*.2).toLocaleString()+"/yr."}else if(h>0&&a>1e3){const f=Math.min(h,a);m=s+" pays 40% tax on about £"+Math.round(h).toLocaleString()+"/yr while "+n+" has £"+Math.round(a).toLocaleString()+" of unused 20% band. Funding £"+Math.round(f).toLocaleString()+" more of the spending from "+n+"’s pots could save ~£"+Math.round(f*.2).toLocaleString()+"/yr."}return{unusedA:a,unusedB:c,overA:d,overB:h,message:m}}function Ux({cfgA:t,cfgB:e,setA:n,setB:s,who:r="A",startYear:i=10,years:o=3,annualCost:a=9e4,runs:c=500}){const d=(x,C)=>{const P=x.duration||35,D=[];for(let R=0;R<=P;R++){let B=Zr(x,R);C&&R>=i&&R<i+o&&(B+=a),D.push(B)}return D},h=(x,C,P)=>({...x,targetSchedule:d(C,P),spendingProfile:"flat"}),m=(x,C)=>{const P=Math.max(x.years,C.years);let D=0;for(let R=0;R<c;R++){const B=hr({years:P},R),N=Zt(x,B,R),w=Zt(C,B,R+5e5);!N.failed&&!w.failed&&D++}return D/c},f=h(t,n,!1),y=h(e,s,!1),T=h(t,n,r==="A"),E=h(e,s,r==="B");return{baselineJoint:m(f,y),careJoint:m(T,E),totalCareCost:a*o}}function yu(t,e,n=.025){const s=[];let r=t.isaBalance||0;const i=Math.max(0,n-.01),o=bl(t),a=o?o.spStartYear:t.statePensionYear??1/0,c=o?o.spWeeklyAmount*52:t.statePension||0,d=o?o.spFirstYearRatio:1;let h=t.accessMethod==="ufpls"?268275:0;for(let m=0;m<=e;m++){const f=Math.pow(1+n,m),y=t.taxMode==="frozen"?t.pa:t.pa*f,T=t.taxMode==="frozen"?t.brl:t.brl*f,E=t.taxMode==="frozen"?t.hrl||125140:(t.hrl||125140)*f,x=Xr(m,t.spendingProfile||"flat"),P=(Array.isArray(t.targetSchedule)&&t.targetSchedule[m]!=null?t.targetSchedule[m]:t.baseSalary||0)*f*x,D=(t.other||0)*Math.pow(1+Math.min(n,up),m);let R=0;m>=a&&c>0&&(R=c*(m===a?d:1)*f);let B=0;if(t.dbAmount>0&&m>=(t.dbStartYear||0)){const Y=t.dbIndexation||"lpi5";Y==="level"?B=t.dbAmount:Y==="cpi"?B=t.dbAmount*f:B=t.dbAmount*Math.pow(1+Math.min(n,.05),m)}let N=0;for(const Y of t.extraIncomes||[])if(Y.annual>0&&m>=(Y.startYear||0)&&(Y.endYear==null||m<=Y.endYear)){const ie=Y.indexation||"lpi5";ie==="level"?N+=Y.annual:ie==="cpi"?N+=Y.annual*f:N+=Y.annual*Math.pow(1+Math.min(n,.05),m)}const w=D+R+B+N,v=Math.max(0,a===1/0?0:a-m),I=!t.ufplsYears||m<t.ufplsYears,_=t.accessMethod==="ufpls"&&I&&h>0?.25:0,S=ao({targetGross:P,fixedIncome:w,pa:y,brl:T,hrl:E,isaBalance:r,strategy:t.isaDrawdownStrategy,yearsUntilSp:v,taxFreeFraction:_});h>0&&(h=Math.max(0,h-(S.taxFree||0)));const A=S.taxable-S.tax,b=r;r=S.remainingIsa*(1+i),s.push({year:m,brl:T,other:D,statePension:R,sippDraw:S.sippGross,totalTaxable:S.taxable,tax:S.tax,netIncome:A,target:P,isaDraw:S.isaDraw,isaBalance:b,spendable:S.net})}return s}function wl(t){const e={[we.SHARES]:0,[we.BONDS]:0,[we.DIVERSIFIERS]:0,[we.CASH]:0},n={},s=[],r=[];let i=0,o=0;for(const a of t){const c=+a.value||0,d=a.subClass||(a.ticker?sy[a.ticker]:void 0),h=d?Vt[d]:null;if(!h){r.push({...a});continue}if(i+=c,s.push({...a,subClass:d,bucket:h.bucket,label:h.label}),(a.wrapper||"").toUpperCase()==="ISA"){o+=c;continue}e[h.bucket]+=c,n[d]=(n[d]||0)+c}return{buckets:e,subClassTotals:n,bondWeights:jf(n,we.BONDS),diversifierWeights:jf(n,we.DIVERSIFIERS),total:i,isaTotal:o,tagged:s,untagged:r}}function jf(t,e){const n=Object.entries(t).filter(([i])=>Vt[i].bucket===e),s=n.reduce((i,[,o])=>i+o,0);if(s<=0)return{};const r={};for(const[i,o]of n)r[i]=o/s;return r}function $x(t){const e=t.buckets[we.DIVERSIFIERS]||0,n={equityStart:t.buckets[we.SHARES]||0,bondStart:t.buckets[we.BONDS]||0,cashStart:t.buckets[we.CASH]||0,isaBalance:t.isaTotal||0};return e>0&&(n.diversifierStart=e,n.subAsset={}),Object.keys(t.bondWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.bondWeights=t.bondWeights),Object.keys(t.diversifierWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.diversifierWeights=t.diversifierWeights),n}let Ts=null;function lo(){return{settings:{equityMin:be.EQUITY_MIN,bondMin:be.BOND_MIN,cashTarget:be.CASH_TARGET,duration:be.DURATION_YEARS,baseSalary:be.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Is.PROTECTION_MULTIPLIER,consecutiveLimit:be.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Is.HODL_ENABLED,hodlValue:Is.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function vu(){return De()&&lt()}function es(){Ts=null}function qx(){return Ts||lo()}async function yy(){if(Ts)return Ts;if(!vu())return console.warn("Firebase not available - returning defaults"),lo();try{const t=await jg();if(t){const e={settings:t,lastModified:new Date().toISOString(),checksum:null};return Ts=Yx(e),Ts}}catch(t){console.error("Error loading stress data:",t)}return lo()}async function Hx(t){if(!vu())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=Wx(t),await Kg(t.settings),Ts=t}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function Wx(t){return qa(t.settings)}function Yx(t){const e={...lo()};return t.settings&&(e.settings={...e.settings,...t.settings},t.settings.pacwMin!==void 0&&t.settings.equityMin===void 0&&(e.settings.equityMin=t.settings.pacwMin),t.settings.cgtMin!==void 0&&t.settings.bondMin===void 0&&(e.settings.bondMin=t.settings.cgtMin),t.settings.csh2Target!==void 0&&t.settings.cashTarget===void 0&&(e.settings.cashTarget=t.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=t.lastModified,e.checksum=t.checksum,e}function Gx(){return qx().settings}async function qe(){return(await yy()).settings}async function Lo(t){const e=await yy();e.settings={...e.settings,...t},await Hx(e)}async function jx(){if(!vu())throw new Error("Must be logged in to reset settings");const t=lo();await Kg(t.settings),es()}function Kx(t){return bl(t)}function Ls(t={},e=null){const n=e||Gx(),s=Kx(n),r=s?{spStartYear:s.spStartYear,spWeeklyAmount:s.spWeeklyAmount,spFirstYearRatio:s.spFirstYearRatio}:{statePension:n.statePension||0,statePensionYear:n.statePensionYear??999},i=Qx(n.taggedFunds);return{...i?{isaMix:i}:{},equityStart:t.equityStart??n.equityMin,bondStart:t.bondStart??n.bondMin,cashStart:t.cashStart??n.cashTarget,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,years:t.years??n.duration,duration:n.duration,baseSalary:n.baseSalary,other:n.other,...r,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode,protectionMult:n.protectionMult??(n.protectionFactor!=null?1-n.protectionFactor/100:Is.PROTECTION_MULTIPLIER),consecutiveLimit:n.consecutiveLimit,disableProtection:n.disableProtection,hodlEnabled:n.hodlEnabled,hodlValue:n.hodlValue,isaBalance:n.isaBalance||0,isaReturn:n.isaReturn,pa:n.pa??12570,brl:n.brl??50270,hrl:n.hrl??125140,accessMethod:n.accessMethod||"drawdown",recoveryBuffer:n.recoveryBuffer??be.RECOVERY_BUFFER,ufplsYears:n.ufplsYears||null,ufplsThenPcls:!!n.ufplsThenPcls,bandFillRecycle:!!n.bandFillRecycle,targetSchedule:Array.isArray(n.targetSchedule)?n.targetSchedule:null,dbAmount:n.dbAmount||0,dbStartYear:n.dbStartYear||0,dbIndexation:n.dbIndexation||"lpi5",extraIncomes:Array.isArray(n.extraIncomes)?n.extraIncomes:[],windfalls:Array.isArray(n.windfalls)?n.windfalls:[],isaDrawdownStrategy:n.isaDrawdownStrategy,spendingProfile:n.spendingProfile||"flat",equityGlide:n.equityGlideEnabled?fu(n):void 0,diversifierStart:t.diversifierStart??(n.diversifierStart||void 0),subAsset:n.subAsset||void 0}}function Qx(t){const e=(t||[]).filter(r=>(r.wrapper||"").toUpperCase()==="ISA"&&+r.value>0);if(!e.length)return null;const n=wl(e.map(r=>({...r,wrapper:"SIPP"})));if(!(n.total>0))return null;const s={shares:n.buckets.shares/n.total,bonds:n.buckets.bonds/n.total,diversifiers:n.buckets.diversifiers/n.total,cash:n.buckets.cash/n.total};return Object.keys(n.bondWeights).length&&(s.bondWeights=n.bondWeights),Object.keys(n.diversifierWeights).length&&(s.diversifierWeights=n.diversifierWeights),s}async function No(){try{const t=await bS();return{...oo(),...t||{}}}catch(t){return console.error("Error loading budget:",t),oo()}}async function bu(t){const e={...t,derived:di(t)};return await wS(e),e}function j(t,e=null){const n=Math.abs(t),s=e!==null?e:n<100,r=Math.abs(t).toLocaleString("en-GB",{minimumFractionDigits:s?2:0,maximumFractionDigits:s?2:0});return t<0?`-£${r}`:`£${r}`}function Kf(t,e){const n=Jx(t);e.innerHTML=n}function Jx(t){var S,A,b,Y,ie;const e=t,n=e.calculationDetails||{};let s="";const r=e.isTaxEfficientYear??e.taxEfficient,i=e.protectionInducedTaxEfficiency||!1,o=e.boostAmount>0;let a,c,d;if(e.inProtection?(a="warning",c="Protection Mode",d="⚡"):o?(a="boost",c="Tax Boost (Catch-up)",d="↑"):i?(a="info",c="Protection-Induced Tax Efficiency",d="↑"):r?(a="success",c="Tax-Efficient Year",d="✓"):(a="warning",c="Tax-Inefficient Year",d="!"),s+=`<div class="decision-mode ${a}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,r&&e.yearlyIsaSavingsAllocation>0){const q=e.cumulativeIsaSavingsUsed||0,se=e.yearlyIsaSavingsAllocation,ee=Math.max(0,se-q),ye=se>0?q/se*100:0;s+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(ye,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${j(q)} of ${j(se)}</span>
        <span>Remaining: ${j(ee)}</span>
      </div>
    </div>`}if(e.pclsSuggestion>0&&(s+=`<div class="alert alert-info">
      💡 Your plan's UFPLS phase has ended. If you haven't already, take your remaining 25% tax-free
      lump sum — about <strong>${j(e.pclsSuggestion)}</strong> at today's pot value
      (capped by your remaining Lump Sum Allowance) — into your ISA, then continue in drawdown.
      Update your fund values here once done.
    </div>`),e.alerts&&e.alerts.length>0){s+='<div class="alerts">';for(const q of e.alerts){const se=Xx(q.severity);s+=`<div class="alert ${se}">${q.message}</div>`}s+="</div>"}s+='<div class="recommendation-card">',s+="<h3>Monthly Recommendation</h3>",s+='<div class="draw-row primary">',s+='<span class="label">SIPP Withdrawal</span>',s+=`<span class="value">${j(e.sippDraw)}</span>`,s+="</div>",e.isaDraw>0&&(s+='<div class="draw-row">',s+='<span class="label">ISA Top-up</span>',s+=`<span class="value">${j(e.isaDraw)}</span>`,s+="</div>"),e.recycleNet>0&&(s+='<div class="draw-row">',s+='<span class="label">of which: recycle to ISA (band-fill)</span>',s+=`<span class="value">${j(e.recycleNet)}</span>`,s+="</div>",s+=`<div class="alert alert-info" style="margin:6px 0;">💡 Your SIPP withdrawal above includes an extra ${j(e.recycleGross)} to fill your basic-rate band. After 20% tax, contribute <strong>${j(e.recycleNet)}</strong> of it to your ISA — it comes out tax-free later. (Counts toward your £20,000 ISA allowance.)</div>`),e.other>0&&(s+='<div class="draw-row muted">',s+='<span class="label">Other Pension</span>',s+=`<span class="value">${j(e.other)}</span>`,s+="</div>"),e.statePension>0&&(s+='<div class="draw-row muted">',s+='<span class="label">State Pension</span>',s+=`<span class="value">${j(e.statePension)}</span>`,s+="</div>"),s+='<div class="divider"></div>';const h=e.sippDraw+e.other+e.statePension,m=h*12,f=e.pa||12570,y=e.brl||50270;let T=0;m>f&&(m<=y?T=(m-f)*.2:T=(y-f)*.2+(m-y)*.4);const E=h-T/12+e.isaDraw;s+='<div class="draw-row total">',s+='<span class="label">Total Monthly Income</span>',s+=`<span class="value">${j(E)}</span>`,s+="</div>",e.boostAmount>0&&(s+='<div class="boost-indicator">',s+='<span class="boost-label">Includes Tax Boost:</span>',s+=`<span class="boost-value">+${j(e.boostAmount)}</span>`,s+="</div>"),s+="</div>",s+='<div class="source-card">',s+="<h4>Withdraw From</h4>",s+=`<div class="source-label ${e.source.toLowerCase().replace(/[^a-z]+/g,"-")}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(s+='<div class="source-breakdown">',e.drawFromEquity>0&&(s+=`<div class="source-item">Equity: ${j(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(s+=`<div class="source-item">Bond: ${j(e.drawFromBond)}</div>`),s+="</div>"),e.drawFromDiversifier>0&&(s+='<div class="source-breakdown">',e.drawFromCash>0&&(s+=`<div class="source-item">Cash: ${j(e.drawFromCash)}</div>`),s+=`<div class="source-item">Diversifier reserve: ${j(e.drawFromDiversifier)}</div>`,s+="</div>"),s+="</div>",s+='<div class="fund-status">',s+="<h4>Fund Status</h4>";const x=e.equity+e.bond+e.cash+(e.diversifier||0),C=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,P=x-C,D=C>0?P/C*100:0;s+='<div class="fund-grid">';const R=e.equity-e.adjEquityMin;s+=ra("Equity",e.equity,e.adjEquityMin,R);const B=e.bond-e.adjBondMin;s+=ra("Bond",e.bond,e.adjBondMin,B);const N=e.cash-e.adjCashTarget;s+=ra("Cash",e.cash,e.adjCashTarget,N),e.diversifier!=null&&(s+=ra("Diversifiers",e.diversifier,0,e.diversifier)),s+="</div>";const w=P>=0?"healthy":"warning";s+=`<div class="overall-status ${w}">`,s+=`<span>Total Surplus: ${j(P)}</span>`,s+=`<span>(${D.toFixed(1)}% above target)</span>`,s+="</div>",s+="</div>",s+='<div class="tax-info">',s+="<h4>Tax Summary</h4>",s+='<div class="tax-thresholds">',s+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${j(e.pa)}</span></div>`,s+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${j(e.brl)}</span></div>`,n.taxInfo&&(s+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${n.taxInfo.headroomToBRL>0?"success":"warning"}">${j(n.taxInfo.headroomToBRL)}</span></div>`),s+="</div>",s+='<div class="tax-comparison">',s+='<div class="tax-comparison-header">',s+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",s+="</div>";const v=((S=n.taxInfo)==null?void 0:S.monthlyTax)||T/12,I=e.taxPaidYTD||v,_=e.taxProjectedAnnual||((A=n.taxInfo)==null?void 0:A.annualTax)||T;if(s+='<div class="tax-comparison-row">',s+='<div class="label">Tax Paid</div>',s+=`<div>${j(v)}</div>`,s+=`<div>${j(I)}</div>`,s+=`<div>${j(_)}</div>`,s+="</div>",r||((b=n.taxInfo)==null?void 0:b.taxSavedAnnual)>0){const q=e.taxSavedMonthly||((Y=n.taxInfo)==null?void 0:Y.taxSavedMonthly)||0,se=e.taxSavedYTD||q,ee=e.taxSavedProjectedAnnual||((ie=n.taxInfo)==null?void 0:ie.taxSavedAnnual)||0;ee>0&&(s+='<div class="tax-comparison-row saved">',s+='<div class="label">Tax Saved</div>',s+=`<div class="success">-${j(q)}</div>`,s+=`<div class="success">-${j(se)}</div>`,s+=`<div class="success">-${j(ee)}</div>`,s+="</div>")}if(s+="</div>",n.taxInfo&&typeof n.taxInfo.effectiveRate=="number"&&!isNaN(n.taxInfo.effectiveRate)){const q=n.taxInfo.effectiveRate*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${q<=20?"success":q<=40?"warning":"danger"}">${q.toFixed(1)}%</span>
    </div>`}else if(n.taxInfo&&n.taxInfo.annualTaxable>0&&n.taxInfo.annualTax>=0){const q=n.taxInfo.annualTax/n.taxInfo.annualTaxable*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${q<=20?"success":q<=40?"warning":"danger"}">${q.toFixed(1)}%</span>
    </div>`}if(s+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){s+='<div class="rebalance-card">',s+="<h4>Rebalancing Suggestions</h4>",s+="<ul>";for(const q of e.rebalanceActions)s+=`<li>${q}</li>`;s+="</ul>",s+="</div>"}return s+='<div class="mode-explanation">',s+="<h4>Why This Recommendation?</h4>",s+=`<p>${n.reason||"Standard calculation based on your settings."}</p>`,!n.hasSufficientIsa&&n.isaNeededMonthly>0&&(s+=`<p class="isa-warning">To enable tax-efficient mode, you need ${j(n.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),s+="</div>",s+='<details class="debug-section">',s+="<summary>Calculation Details</summary>",s+="<pre>"+JSON.stringify(n,null,2)+"</pre>",s+="</details>",s}function ra(t,e,n,s){return`<div class="fund-cell ${s>=0?"healthy":"deficit"}">
    <div class="fund-name">${t}</div>
    <div class="fund-current">${j(e)}</div>
    <div class="fund-min">Min: ${j(n)}</div>
    <div class="fund-surplus">${s>=0?"+":""}${j(s)}</div>
  </div>`}function Xx(t){switch(t){case Jo.DANGER:return"alert-danger";case Jo.WARNING:return"alert-warning";case Jo.SUCCESS:return"alert-success";case Jo.INFO:default:return"alert-info"}}function Zx(){return`
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
  `}async function eA(t){const e=gu(t),n=yl(e),s=e.getMonth()+1;return await MS(n)?{showWizard:!1,taxYear:n,isApril:s===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:n,isApril:s===4,reason:`Tax year ${n} has not been set up`}}function tA(t,e,n=0){return t*(1+e-n)}function nA(t){const{targetAnnualGross:e,brl:n,pa:s=12570,remainingMonths:r,grossIncomeToDate:i=0}=t,o=T=>T<=s?0:T<=n?(T-s)*.2:(n-s)*.2+(T-n)*.4,a=Math.max(0,n-i);if(a<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=n)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:a,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=o(e),d=e-c,h=o(n),m=n-h,f=Math.max(0,d-m),y=f/12*r;return{isaNeeded:y,isaNeededAnnual:f,brlExhausted:!1,remainingBrlHeadroom:a,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:h,reason:`Need £${Math.round(y).toLocaleString()} ISA/Savings for tax efficiency`}}function sA(t,e,n){return n?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:t>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-t,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function rA(t){const e=gu(t),n=yl(e),r=e.getMonth()+1===4,i=Bx(e),o=await Ze(),a=await Bo(n),c=await os(),h=Object.keys(c).sort().filter(N=>N<n).pop()||null,m=h?c[h]:null,f=await lu(n),y=(m==null?void 0:m.cpi)||Gi,T=o.spendingProfile||"flat",E=Math.max(0,2e3+(parseInt(n.split("/")[0],10)||26)-2026),x=fx(E,T),C=m&&m.confirmedSalary||o.baseSalary,P=tA(C,y,x);let D=null;try{const N=await jg(),w=Array.isArray(N==null?void 0:N.targetSchedule)?N.targetSchedule:null;if(w&&w[E]!=null){let v=1;for(let _=0;_<E;_++){const S=String((26+_)%100).padStart(2,"0")+"/"+String((27+_)%100).padStart(2,"0");v*=1+((c[S]||{}).cpi||Gi)}const I=Xr(E,o.spendingProfile||"flat");D=Math.round(w[E]*v*I)}}catch{}const R=D??P,B=D!=null?"budget-schedule":"chain";return{taxYear:n,selectedMonth:t,isApril:r,remainingMonths:i,baseSalary:o.baseSalary,suggestionBase:C,spendingProfile:T,declineRate:x,suggestedSalary:R,suggestionSource:B,chainSuggestedSalary:P,defaults:{pa:(m==null?void 0:m.pa)||a.pa,brl:(m==null?void 0:m.brl)||a.brl,hrl:(m==null?void 0:m.hrl)||a.hrl,cpi:y,other:(m==null?void 0:m.other)||0},statePension:f,existingConfig:a.yearSetupComplete?a:null}}function vy(t){const{targetSalary:e,brl:n,pa:s=12570,other:r=0,statePension:i=0,isaSavingsAllocation:o=0,remainingMonths:a,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=t,h=A=>A<=s?0:A<=n?(A-s)*.2:(n-s)*.2+(A-n)*.4,m=r/12,f=i/12,y=m+f;let T,E;if(!d)T=e/12-y,E=0;else{const A=Math.max(0,n-c),b=Math.max(0,A/a-y);T=Math.min(e/12-y,b),E=o/a}const x=(T+y)*12,P=h(x)/12,D=T+y,R=D>0?P/D:0,B=T*R,N=m*R,w=f*R,v=T-B,I=m-N,_=f-w,S=v+I+_+E;return{sipp:{gross:T,tax:B,net:v},other:{gross:m,tax:N,net:I},statePension:{gross:f,tax:w,net:_},isa:{gross:E,tax:0,net:E},totalGross:T+m+f+E,totalTax:P,totalNet:S,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:T,monthlyIsa:E,monthlyOther:m,monthlyStatePension:f,monthlyTotal:S}}function iA(t){var E,x,C,P,D,R,B,N,w,v,I;const{pa:e,brl:n,hrl:s,cpi:r,other:i,isaSavingsAllocation:o,isTaxEfficient:a,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:h,confirmedSalary:m,remainingMonths:f,statePension:y,monthlyBreakdown:T}=t;return{pa:e,brl:n,hrl:s,cpi:r,other:i,isaSavingsAllocation:a?o:0,isaSavingsUsed:0,isTaxEfficient:a,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:h||4,remainingMonths:f||12,yearSetupComplete:!0,confirmedSalary:m,statePension:y||0,expectedMonthly:T?{sipp:{gross:((E=T.sipp)==null?void 0:E.gross)||0,tax:((x=T.sipp)==null?void 0:x.tax)||0,net:((C=T.sipp)==null?void 0:C.net)||0},other:{gross:((P=T.other)==null?void 0:P.gross)||0,tax:((D=T.other)==null?void 0:D.tax)||0,net:((R=T.other)==null?void 0:R.net)||0},statePension:{gross:((B=T.statePension)==null?void 0:B.gross)||0,tax:((N=T.statePension)==null?void 0:N.tax)||0,net:((w=T.statePension)==null?void 0:w.net)||0},isa:{gross:((v=T.isa)==null?void 0:v.gross)||0,tax:0,net:((I=T.isa)==null?void 0:I.net)||0},totalGross:T.totalGross||0,totalTax:T.totalTax||0,totalNet:T.totalNet||0}:null}}let _n=null,co=null,Qt=1,Q=null,U={};async function oA(t,e,n){_n=t,co=n,Qt=1,U={},Q=await rA(e),U={pa:Q.defaults.pa,brl:Q.defaults.brl,hrl:Q.defaults.hrl,cpi:Q.defaults.cpi,other:Q.defaults.other,grossIncomeToDate:0,confirmedSalary:Q.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},Hi()}async function aA(t){return await eA(t)}function Hi(){if(!_n||!Q)return;const t=Q.isApril?6:7;_n.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${Q.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${Q.isApril?"Setting up for the full tax year":`Starting in ${wu(Q.selectedMonth)} - ${Q.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${dA(t,Qt)}
        </div>

        ${lA()}
      </div>
    </div>
  `,uA()}function lA(){if(Q.isApril,Q.isApril)switch(Qt){case 1:return Qf();case 2:return Jf();case 3:return Xf();case 4:return Zf();case 5:return ep();case 6:return tp();default:return""}else switch(Qt){case 1:return Qf();case 2:return cA();case 3:return Jf();case 4:return Xf();case 5:return Zf();case 6:return ep();case 7:return tp();default:return""}}function Qf(){return`
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
            <input type="number" id="wizPA" value="${U.pa}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Basic Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBRL" value="${U.brl}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Higher Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizHRL" value="${U.hrl}">
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
  `}function cA(){const t=wu(Q.selectedMonth),e=mA(Q.selectedMonth);return`
    <div class="wizard-step">
      <div class="wizard-step-title">Income Before Starting Pension</div>
      <div class="wizard-step-desc">
        You're starting your pension drawdown in ${t}. Enter any taxable income you've already received this tax year (April to ${e}).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizIncomeToDate" value="${U.grossIncomeToDate}" placeholder="0">
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
  `}function Jf(){const t=U.cpi!==void 0?U.cpi:Q.defaults.cpi,e=(t*100).toFixed(1),n=Q.suggestionBase??Q.baseSalary,s=Q.declineRate||0,r=Q.suggestionSource==="budget-schedule",i=Math.round(r?Q.suggestedSalary:n*(1+t-s)),o=s>0,a=((t-s)*100).toFixed(1);return`
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
        <input type="number" id="wizSalary" value="${Math.round(U.confirmedSalary||i)}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function Xf(){const t=Q.statePension,e=t.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(t.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${t.yearsUntil} years until state pension</span>`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Other Taxable Income</div>
      <div class="wizard-step-desc">
        Enter any other taxable income you'll receive this tax year (annual amount).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizOther" value="${U.other}">
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
  `}function Zf(){Oo();const t=nA({targetAnnualGross:U.confirmedSalary,brl:U.brl,pa:U.pa,other:U.other,statePension:Q.statePension.amount,remainingMonths:Q.remainingMonths,grossIncomeToDate:U.grossIncomeToDate});return U._isaCalc=t,t.brlExhausted?`
      <div class="wizard-step">
        <div class="wizard-step-title">BRL Already Exhausted</div>

        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2); border: 1px solid var(--danger);">
          <p style="color: var(--danger); font-weight: 500;">
            Your income to date (£${U.grossIncomeToDate.toLocaleString()}) has already exceeded the BRL (£${U.brl.toLocaleString()}).
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
            Your target salary of £${Math.round(U.confirmedSalary).toLocaleString()} is achievable within the BRL.
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
          This keeps your SIPP draw at the BRL (£${U.brl.toLocaleString()}) while reaching your target salary.
        </p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        How much ISA/Savings can you allocate this tax year?
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizISA" value="${U.isaSavingsAllocation||Math.round(t.isaNeeded)}">
      </div>

      <div class="wizard-example">
        <strong>Tip:</strong> This is money you'll withdraw tax-free from ISA or savings to supplement your SIPP income.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function ep(){Oo();const t=U._isaCalc,e=sA(U.isaSavingsAllocation,(t==null?void 0:t.isaNeeded)||0,(t==null?void 0:t.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return U.isTaxEfficient=!0,U.taxEfficiencyChoice="efficient",setTimeout(()=>{Qt++,Hi()},0),`
      <div class="wizard-step">
        <div class="wizard-step-title">Setting Up Tax Efficiency...</div>
        <div class="wizard-info-box">
          <p>Your ISA allocation is sufficient for tax efficiency.</p>
        </div>
      </div>
    `;const n=e.shortfall>0?`You entered £${U.isaSavingsAllocation.toLocaleString()} but need £${Math.round(t.isaNeeded).toLocaleString()}.`:"";return`
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
            <input type="radio" name="taxChoice" value="increase" ${U.taxEfficiencyChoice==="increase"?"checked":""}>
            <div class="wizard-option-content">
              <strong>Increase ISA to £${Math.round(t.isaNeeded).toLocaleString()}</strong>
              <p>Provide enough ISA/Savings for tax efficiency</p>
            </div>
          </label>
        `}

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="reduced" ${U.taxEfficiencyChoice==="reduced"?"checked":""}>
          <div class="wizard-option-content">
            <strong>Reduce salary to BRL (£${U.brl.toLocaleString()})</strong>
            <p>Keep ISA/Savings to grow, accept lower income this year</p>
          </div>
        </label>

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="inefficient" ${U.taxEfficiencyChoice==="inefficient"?"checked":""}>
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
  `}function tp(){Oo();const t=vy({targetSalary:U.confirmedSalary,brl:U.brl,pa:U.pa,other:U.other,statePension:Q.statePension.amount,isaSavingsAllocation:U.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:U.grossIncomeToDate,isTaxEfficient:U.isTaxEfficient}),e=U.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",n=U.isTaxEfficient?"success":"warning",s=r=>`£${Math.round(r).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${Q.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${wu(Q.selectedMonth)}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Remaining Months:</span>
          <span>${Q.remainingMonths}</span>
        </div>
        ${U.grossIncomeToDate>0?`
          <div class="wizard-summary-row">
            <span>Income to Date:</span>
            <span>${s(U.grossIncomeToDate)}</span>
          </div>
        `:""}
        <div class="wizard-summary-row">
          <span>Target Salary:</span>
          <span>${s(U.confirmedSalary)}/year</span>
        </div>
        <div class="wizard-summary-row">
          <span>Tax Mode:</span>
          <span class="${n}">${e}</span>
        </div>
        <div class="wizard-summary-row">
          <span>ISA Allocation:</span>
          <span>${s(U.isaSavingsAllocation)}</span>
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
  `}function dA(t,e){let n="";for(let s=1;s<=t;s++){const r=s<e?"done":s===e?"active":"";n+=`<div class="wizard-dot ${r}"></div>`}return n}function uA(){_n.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>hA(e.dataset.action))}),window._updateWizardSalary=function(){if(Q&&Q.suggestionSource==="budget-schedule")return;const e=document.getElementById("wizCPI"),n=document.getElementById("wizSalary"),s=document.getElementById("cpiDisplay"),r=document.getElementById("suggestedSalaryDisplay");if(e&&n&&s&&r){const i=parseFloat(e.value)||0,o=i/100,a=Q.suggestionBase??Q.baseSalary,c=Q.declineRate||0,d=Math.round(a*(1+o-c));s.textContent=i.toFixed(1),r.textContent=d.toLocaleString();const h=document.getElementById("netUpliftDisplay");h&&(h.textContent=((o-c)*100).toFixed(1)),n.value=d,U.cpi=o,U.confirmedSalary=d}}}function hA(t){Oo();const e=Q.isApril?6:7;switch(t){case"cancel":by(),co&&co({completed:!1,cancelled:!0});break;case"next":Qt<e&&(Qt++,Hi());break;case"back":Qt>1&&(Qt--,Hi());break;case"apply-choice":fA(),Qt++,Hi();break;case"finish":{const n=_n==null?void 0:_n.querySelector('[data-action="finish"]');if(n){if(n.disabled)break;n.disabled=!0,n.textContent="Saving…"}pA().finally(()=>{n&&(n.disabled=!1,n.textContent="Confirm & Save")});break}}}function fA(){var e;const t=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch(U.taxEfficiencyChoice=t,t){case"increase":U.isaSavingsAllocation=U._isaCalc.isaNeeded,U.isTaxEfficient=!0;break;case"reduced":U.confirmedSalary=U.brl,U.isaSavingsAllocation=0,U.isTaxEfficient=!0;break;case"inefficient":U.isaSavingsAllocation=0,U.isTaxEfficient=!1;break}}function Oo(){const t=document.getElementById("wizPA");t&&(U.pa=parseFloat(t.value)||12570);const e=document.getElementById("wizBRL");e&&(U.brl=parseFloat(e.value)||50270);const n=document.getElementById("wizHRL");n&&(U.hrl=parseFloat(n.value)||125140);const s=document.getElementById("wizCPI");s&&(U.cpi=(parseFloat(s.value)||Gi*100)/100);const r=document.getElementById("wizSalary");r&&(U.confirmedSalary=parseFloat(r.value)||3e4);const i=document.getElementById("wizOther");i&&(U.other=parseFloat(i.value)||0);const o=document.getElementById("wizISA");o&&(U.isaSavingsAllocation=parseFloat(o.value)||0);const a=document.getElementById("wizIncomeToDate");a&&(U.grossIncomeToDate=parseFloat(a.value)||0)}async function pA(){Oo();const t=vy({targetSalary:U.confirmedSalary,brl:U.brl,pa:U.pa,other:U.other,statePension:Q.statePension.amount,isaSavingsAllocation:U.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:U.grossIncomeToDate,isTaxEfficient:U.isTaxEfficient}),e=iA({pa:U.pa,brl:U.brl,hrl:U.hrl,cpi:U.cpi,other:U.other,isaSavingsAllocation:U.isaSavingsAllocation,isTaxEfficient:U.isTaxEfficient,taxEfficiencyChoice:U.taxEfficiencyChoice,grossIncomeToDate:U.grossIncomeToDate,startMonth:parseInt(Q.selectedMonth.split("-")[1]),confirmedSalary:U.confirmedSalary,remainingMonths:Q.remainingMonths,statePension:Q.statePension.amount,monthlyBreakdown:t});console.log(`Tax Year Wizard: Saving config for ${Q.taxYear}`,e);try{await wr(Q.taxYear,e);const n=await Bo(Q.taxYear);if(!n||!n.yearSetupComplete)throw new Error("the saved tax year did not read back — please try Confirm again");console.log(`Tax Year Wizard: Successfully saved config for ${Q.taxYear}`)}catch(n){console.error(`Tax Year Wizard: Failed to save config for ${Q.taxYear}`,n),typeof window.showToast=="function"&&window.showToast(`Error saving tax year configuration: ${n.message}`,"error");return}by(),co&&co({completed:!0,taxYear:Q.taxYear,config:e,wizardInputs:U})}function by(){_n&&(_n.innerHTML="",_n.style.display="none")}function wu(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function mA(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-2,1).toLocaleString("default",{month:"long"})}function gA(){return`
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
  `}function yA(t={},e=null){const n=Ls(t,e),s=mu(n),r=my(s);return{results:s,stats:r,config:n}}function vA(t={},e=null){const n=Ls(t,e),s=py(n),r=my(s);return{results:s,stats:r,config:n}}function bA(t={}){const e=Ls(t),n={};for(const[s,r]of Object.entries(R0))n[s]={...r,result:Ex(e,r)};return n}let fr=cu,Wi=null,np=!1,Nc=!1,wy=null;function El(){return fr}function ei(t){const e=(t||"").toUpperCase().trim();return fr.find(n=>n.ticker===e)||null}function wA(){return Nc}function EA(){return wy}function _A(){return Wi}async function TA(){if(!(np||!De()||!Se)){np=!0;try{const t=await Li(Rt(Se,"adminPrivate","access"));Nc=!0,wy=t.exists()&&t.data().passphrase||null}catch{Nc=!1}try{const[t,e,n]=await Promise.all([Li(Rt(Se,"admin","fundCatalogue")),Li(Rt(Se,"admin","subAssetProfiles")),Li(Rt(Se,"admin","typicalAmounts"))]);if(t.exists()){const s=t.data().funds;Array.isArray(s)&&s.length&&s.every(r=>r.ticker&&r.subClass)&&(fr=Object.freeze([...s].sort((r,i)=>r.ticker.localeCompare(i.ticker))),console.log("AdminConfig: fund catalogue override active ("+fr.length+" funds)"))}if(e.exists()&&(Wi=e.data().overrides||null,Wi&&(ny(Wi),console.log("AdminConfig: sub-asset profile overrides active"))),n.exists()){const s=n.data().tiers;s&&typeof s=="object"&&(XI(s),console.log("AdminConfig: typical-amounts override active"))}}catch(t){console.warn("AdminConfig: using code defaults ("+t.message+")")}}}async function IA(t){const e=(t||[]).filter(n=>n.ticker&&n.subClass).map(n=>({ticker:String(n.ticker).toUpperCase().trim(),name:String(n.name||""),subClass:n.subClass}));return await Xd(Rt(Se,"admin","fundCatalogue"),{funds:e,updatedAt:Zd()}),fr=Object.freeze([...e].sort((n,s)=>n.ticker.localeCompare(s.ticker))),fr.length}async function SA(){await cl(Rt(Se,"admin","fundCatalogue")),fr=cu}async function Ey(t){const e=t&&Object.keys(t).length?t:null;e?await Xd(Rt(Se,"admin","subAssetProfiles"),{overrides:e,updatedAt:Zd()}):await cl(Rt(Se,"admin","subAssetProfiles")),Wi=e,ny(e)}function xA({ticker:t,name:e,subClass:n}){try{const s=xn();if(!s||!De()||!Se||!t)return;Cg(Nd(Se,"fundSuggestions"),{ticker:String(t).toUpperCase().trim().slice(0,12),name:String(e||"").slice(0,80),subClass:String(n||"").slice(0,40),uid:s.uid,createdAt:Zd()}).catch(()=>{})}catch{}}async function AA(t=100){return(await kg(kI(Nd(Se,"fundSuggestions"),CI("createdAt","desc"),PI(t)))).docs.map(n=>({id:n.id,...n.data()}))}async function kA(t){await cl(Rt(Se,"fundSuggestions",t))}function _y(t){return yl(gu(t))}function CA(t){const[e,n]=t.split("-").map(Number);return Math.max(0,(n>=4?e:e-1)-2026)}async function PA(t,e,n,s,r){var Vo,Ws,vi,Ir;const i=r.settings,o=r.history,a=r.allTaxYears,c=_y(t),d=CA(t),[h,m]=t.split("-").map(Number);if(!a[c])throw new Error(`Tax year ${c} is not configured. Please add it in the Settings tab before calculating.`);const f=a[c],y=f.pa||12570,T=f.brl||50270,E=f.hrl||125140,x=f.other||0,C=f.isTaxEfficient!==!1,P=f.isaSavingsAllocation||0,D=f.grossIncomeToDate||0,R=f.confirmedSalary||i.baseSalary,B=o.find(J=>J.date===t),N=(B==null?void 0:B.isa)||0,w=Math.max(0,(f.isaSavingsUsed||0)-N),I=r.spInfo.amount||0;let _=1;for(let J=0;J<d;J++){const Pe=String((26+J)%100).padStart(2,"0")+"/"+String((27+J)%100).padStart(2,"0"),Lt=(a[Pe]||{}).cpi||Gi;_*=1+Lt}let S=Gn(i.equityMin,d,i.duration,_,!0),A=Gn(i.bondMin,d,i.duration,_,!0);const b=Math.round(Gn(i.cashTarget,d,i.duration,_,!1)),Y=gl(i.equityGlide,d,i.duration);if(Y!=null){const J=S+A;S=J*Y,A=J*(1-Y)}S=Math.round(S),A=Math.round(A);const ie=e+n,q=S+A;let se=0;const ee=o.filter(J=>J.date<t);for(let J=ee.length-1;J>=0&&(ee[J].source&&ee[J].source!=="Growth");J--)se++;let ye=0;for(let J=ee.length-1;J>=0&&ee[J].inProtection;J--)ye++;const he=i.disableProtection?!1:dy({totalGrowth:ie,minGrowth:q,consecCashDraws:se,wasInProtection:ee.length>0&&ee[ee.length-1].inProtection,consecutiveLimit:i.consecutiveLimit||3,recoveryBuffer:i.recoveryBuffer||Fa.RECOVERY_BUFFER}),dt=m>=4?16-m:4-m,re=Math.max(1,dt),V=f.confirmedSalary?f.confirmedSalary:i.baseSalary*_,xe=x+I;$t(V,y,T,E);let ae,tn,Ge,Cn=0,oe=0,fe=!1,je=0;const nn=268275,xt=o.reduce((J,Pe)=>J+(Pe.taxFree||0),0),Ke=!i.ufplsYears||d<i.ufplsYears,Bt=i.accessMethod==="ufpls"&&Ke&&xt<nn,et=Bt?.25:0;let sn=0;i.accessMethod==="ufpls"&&i.ufplsThenPcls&&i.ufplsYears>0&&d===Math.floor(i.ufplsYears)&&xt<nn&&(sn=Math.max(0,Math.min(.25*(e+n+s),nn-xt)));const At=Math.max(1,Math.min(12,f.remainingMonths||12)),rn=At<12&&D||0,Er=Math.max(0,P-w)/re;if(C){const J=xe/12;o.filter(pe=>pe.taxYear===c&&pe.date<t);const Pe=V/12,Lt=r.isaBalance||0;let Qe,Ct;if(Lt>0){const pe=ao({targetGross:V,fixedIncome:xe+rn,pa:y,brl:T,hrl:E,taxFreeFraction:et,isaBalance:Lt,strategy:i.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0});Qe=pe.sippGross/At,Ct=pe.isaDraw/At}else{if(((Ws=(Vo=f.expectedMonthly)==null?void 0:Vo.sipp)==null?void 0:Ws.gross)>0)Qe=f.expectedMonthly.sipp.gross;else{const Nt=Math.max(0,T-D-xe)/(1-et)/12;Qe=Math.min(Pe-J,Nt)}const pe=$t(V,y,T,E)/12,ht=Math.min(V,T),ft=$t(ht,y,T,E)/12,hs=Math.max(0,pe-ft);Ct=Math.min(hs,Er)}if(je=Ct,Cn=Qe,he){const pe=1-(i.protectionFactor||20)/100;ae=Qe*Bc(ye,pe),tn=Ct,Ge="Protection"}else{ae=Qe,tn=Ct,Ge="Tax-Efficient";const pe=m>=4?h:h-1,ht=ee.filter(Nt=>{const[Sr,Gs]=Nt.date.split("-").map(Number);return(Gs>=4?Sr:Sr-1)===pe});let ft=0,hs=0;ht.forEach(Nt=>{hs+=Nt.sipp||0,Nt.inProtection&&Nt.stdSipp&&(ft+=Nt.stdSipp-Nt.sipp),Nt.boostAmount>0&&(ft-=Nt.boostAmount)});const Ys=(hs+ae*re)*(1-et)+xe;oe=ya({shortfall:ft,standardMonthly:Qe,remainingMonths:re,surplus:ie-q-zr.SURPLUS_BUFFER,brlHeadroom:T-Ys}),oe>50&&(ae+=oe,Ge="Tax Boost")}}else{let J;((Ir=(vi=f.expectedMonthly)==null?void 0:vi.sipp)==null?void 0:Ir.gross)>0?J=f.expectedMonthly.sipp.gross:J=ao({targetGross:V,fixedIncome:xe+rn,pa:y,brl:T,hrl:E,taxFreeFraction:et,isaBalance:0,strategy:i.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0}).sippGross/At,Cn=J,tn=0;const Pe=m>=4?h:h-1,Lt=ee.filter(pe=>{const[ht,ft]=pe.date.split("-").map(Number);return(ft>=4?ht:ht-1)===Pe});let Qe=0,Ct=0;if(Lt.forEach(pe=>{Ct+=pe.sipp||0,pe.inProtection&&pe.stdSipp&&(Qe+=pe.stdSipp-pe.sipp),pe.boostAmount>0&&(Qe-=pe.boostAmount)}),he){const pe=1-(i.protectionFactor||20)/100;ae=J*Bc(ye,pe),Ge="Protection";const ht=(Ct+ae*re)*(1-et)+xe,ft=T-ht;oe=ya({shortfall:ft,standardMonthly:J,remainingMonths:re,surplus:ie-q-zr.SURPLUS_BUFFER,brlHeadroom:ft}),oe>0&&(ae+=oe,fe=!0,Ge="Protection-Induced Efficiency")}else{ae=J,Ge="Tax-Inefficient";const pe=(Ct+ae*re)*(1-et)+xe;oe=ya({shortfall:Qe,standardMonthly:J,remainingMonths:re,surplus:ie-q-zr.SURPLUS_BUFFER,brlHeadroom:T-pe}),oe>0&&(ae+=oe,Ge="Tax Boost")}}let Pn=0,Rn=0;if(i.bandFillRecycle&&et===0&&!he){const J=m>=4?h:h-1,Pe=ee.filter(ht=>{const[ft,hs]=ht.date.split("-").map(Number);return(hs>=4?ft:ft-1)===J});let Lt=0,Qe=0;Pe.forEach(ht=>{Lt+=ht.sipp||0,Qe+=ht.recycleNet||0});const Ct=Lt+ae*re+xe+rn,pe=uy({brlHeadroom:T-Ct,remainingMonths:re,isaAllowanceLeft:pu.ISA_ANNUAL_ALLOWANCE-Qe});Pn=pe.gross,Rn=pe.net,Pn>0&&(ae+=Pn)}const Wt=r.diversifier||0,kt=hy({draw:ae,equity:e,bond:n,cash:s,diversifier:Wt,diversifierTarget:r.diversifierTarget||Wt||0,hodl:0,eqMin:S,bdMin:A,csTarget:b,inProtection:he}),Ne=kt.source,Oe=kt.reason,Mn=kt.fromEquity,_r=kt.fromBond,ls=kt.fromCash,$s=kt.fromDiversifier,Dn=kt.fromEquity+kt.fromBond>1e-9&&(he||ie<q+ae),cs=kt.shortfall>1e-6||Dn?"Cash low!":"";let He="";const zt=e-S,Bn=n-A;if(zt>5e3&&Bn<-5e3){const J=Math.floor(Math.min(zt,-Bn)/1e3)*1e3;J>=5e3&&(He=`Move £${J.toLocaleString()} Equity→Bond`)}else if(Bn>5e3&&zt<-5e3){const J=Math.floor(Math.min(Bn,-zt)/1e3)*1e3;J>=5e3&&(He=`Move £${J.toLocaleString()} Bond→Equity`)}let ds="";const Yt=Math.floor((kt.replenish||0)/1e3)*1e3;Yt>=1e3&&(ds=`Replenish Cash: Move £${Yt.toLocaleString()} from growth funds`);const on=[];cs&&on.push({message:cs,severity:"danger",type:"low-cash"}),oe>50&&on.push({message:`Tax Boost: +£${Math.round(oe).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),He&&on.push({message:He,severity:"warning",type:"rebalance"}),ds&&on.push({message:ds,severity:"info",type:"cash-replenish"});const Tr=m>=4?h:h-1,an=ee.filter(J=>{const[Pe,Lt]=J.date.split("-").map(Number);return(Lt>=4?Pe:Pe-1)===Tr}),Gt=an.reduce((J,Pe)=>J+(Pe.sipp||0),0),Ln=an.length+1,Fe=Math.max(0,At-Ln)*Cn,K=(Gt+ae+Fe)*(1-et)+x+I+rn,ve=ga(K,y,T,E),tt=(ve-ga(rn,y,T,E))/At,Nn=ae+x/12+I/12-tt+tn,qs=tt*Ln,Hs=ve,Rl=V/12,Ml=ga(Rl*12,y,T,E),gn=Math.max(0,Ml/12-ve/12),Dl=w+je;return{date:t,taxYear:c,yearNumber:d,remainingMonths:re,equity:e,bond:n,cash:s,isa:0,adjEquityMin:S,adjBondMin:A,adjCashTarget:b,pa:y,brl:T,other:x/12,statePension:I/12,sippDraw:ae,stdSipp:Cn,isaDraw:tn,totalMonthlyNet:Nn,monthlyTax:tt,taxFree:ae*et,accessMethod:Bt?"ufpls":"drawdown",lsaRemaining:Bt?Math.max(0,nn-xt):null,pclsSuggestion:sn,recycleGross:Pn,recycleNet:Rn,isTaxEfficientYear:C,yearlyIsaSavingsAllocation:P,cumulativeIsaSavingsUsed:Dl,isaSavingsUsedThisMonth:je,taxPaidYTD:qs,taxProjectedAnnual:Hs,taxSavedMonthly:gn,taxSavedYTD:gn*Ln,taxSavedProjectedAnnual:gn*12,taxEfficient:C&&!fe,inProtection:he,protectionReason:he?Oe:null,consecutiveCashDraws:se,protectionInducedTaxEfficiency:fe,boostAmount:oe>50?oe:0,boostEligible:oe>50,source:Ne,drawFromEquity:Mn,drawFromBond:_r,drawFromCash:ls,...Wt>0?{drawFromDiversifier:$s,diversifier:Wt}:{},rebalanceNeeded:He!=="",rebalanceActions:He?[He]:[],alerts:on,calculationDetails:{mode:Ge,reason:`${Oe} | ${Ge}`,totalGrowth:ie,minGrowth:q,consec:se,stdSipp:ae,inputs:{baseSalary:i.baseSalary,confirmedSalary:R,targetGross:V,cumInf:_,yearNum:d,taxYear:c,OTHER:x,STATE:I,PA:y,BRL:T,isTaxEfficientYear:C,yearlyIsaSavingsAllocation:P,grossIncomeToDate:D},taxInfo:{annualTaxable:K,headroomToBRL:T-K,annualTax:ve,monthlyNet:Nn}}}}let uo=null;function RA(t,e){uo=t,MA(e)}function MA({onGetStarted:t,onSignIn:e}){uo&&(uo.innerHTML=`
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
  `,document.getElementById("landingGetStarted").addEventListener("click",t),document.getElementById("landingSignIn").addEventListener("click",e))}function ho(){uo&&(uo.style.display="none")}function DA(){return`
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
  `}let ot=null,Yi=null,Es=!1;function BA(t,e){console.log("initAuthScreen: initializing"),ot=t,Yi=e,Es=!1,Mg(n=>{if(console.log("AuthScreen: auth state change received:",n?n.email:"null","processed:",Es),n&&!n.emailVerified){zA(n);return}n&&Yi&&!Es?(console.log("AuthScreen: calling onAuthSuccessCallback"),Es=!0,Ty(),Yi(n)):n?console.log("AuthScreen: skipping callback, already processed or no callback"):(Es=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),Eu(),console.log("initAuthScreen: complete")}function Eu(){if(ot){if(!De()){ot.innerHTML=`
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
  `,LA()}}function LA(){const t=ot.querySelectorAll(".auth-screen-tab");t.forEach(i=>{i.addEventListener("click",()=>{t.forEach(c=>c.classList.remove("active")),i.classList.add("active");const o=document.getElementById("signinForm"),a=document.getElementById("signupForm");i.dataset.tab==="signin"?(o.style.display="block",a.style.display="none"):(o.style.display="none",a.style.display="block"),pr()})}),document.getElementById("signinForm").addEventListener("submit",NA),document.getElementById("signupForm").addEventListener("submit",OA),document.getElementById("forgotPasswordBtn").addEventListener("click",FA),document.getElementById("googleSigninBtn").addEventListener("click",VA)}function fn(t){const e=document.getElementById("authScreenError");e&&(e.textContent=t,e.style.display="block")}function pr(){const t=document.getElementById("authScreenError");t&&(t.style.display="none")}async function NA(t){t.preventDefault(),pr();const e=document.getElementById("signinEmail").value.trim(),n=document.getElementById("signinPassword").value;if(!e||!n){fn("Please enter email and password");return}try{await $I(e,n)}catch(s){console.error("Sign in error:",s),fn(_l(s.code))}}async function OA(t){t.preventDefault(),pr();const e=document.getElementById("signupName").value.trim(),n=document.getElementById("signupEmail").value.trim(),s=document.getElementById("signupPassword").value;if(!e||!n||!s){fn("Please fill in all fields");return}if(s.length<6){fn("Password must be at least 6 characters");return}try{await VI(n,s,e)}catch(r){console.error("Sign up error:",r),fn(_l(r.code))}}async function FA(){pr();const t=document.getElementById("signinEmail").value.trim();if(!t){fn("Please enter your email address first");return}try{await HI(t),typeof window.showToast=="function"&&window.showToast("Password reset email sent. Check your inbox.","success",5e3)}catch(e){console.error("Reset password error:",e),fn(_l(e.code))}}async function VA(){pr();try{await qI()}catch(t){console.error("Google sign in error:",t),fn(_l(t.code))}}function _l(t){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[t]||"An error occurred. Please try again."}function zA(t){ot&&(ot.style.display="block",ot.innerHTML=`
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
  `,document.getElementById("verifiedContinueBtn").addEventListener("click",async()=>{pr();try{const e=await UI();e&&e.emailVerified?Yi&&!Es&&(Es=!0,Ty(),Yi(e)):fn("Not verified yet. Click the link in the email first (check spam), then try again.")}catch(e){console.error("Verification check error:",e),fn("Could not check verification status. Please try again.")}}),document.getElementById("resendVerificationBtn").addEventListener("click",async()=>{pr();try{await zI(),typeof window.showToast=="function"&&window.showToast("Verification email sent. Check your inbox.","success",5e3)}catch(e){console.error("Resend verification error:",e),fn(e.code==="auth/too-many-requests"?"Too many attempts. Please wait a few minutes and try again.":"Could not send the email. Please try again.")}}),document.getElementById("verifySignOutBtn").addEventListener("click",async()=>{try{await eu(),Eu()}catch(e){console.error("Sign out error:",e)}}))}function Ty(){ot&&(ot.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function Iy(){console.log("hideAuthScreen: hiding auth screen, element=",!!ot),ot&&(ot.style.display="none",console.log("hideAuthScreen: set display to none"))}function UA(){Es=!1,ot&&(ot.style.display="block",Eu())}function fo(t="signin"){UA(),ot.querySelectorAll(".auth-screen-tab").forEach(i=>i.classList.remove("active"));const n=ot.querySelector(`.auth-screen-tab[data-tab="${t}"]`);n&&n.classList.add("active");const s=document.getElementById("signinForm"),r=document.getElementById("signupForm");s&&r&&(s.style.display=t==="signin"?"block":"none",r.style.display=t==="signup"?"block":"none")}function $A(){return`
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
  `}let po=null;function Sy(t,e,n,s={}){po=t,qA(e,n,s)}function qA(t,e,n={}){if(!po)return;const s=t||"there",r=n.title||`Welcome, ${s}!`,i=n.subtitle||"Your account is set up and ready to go. Here's what Pension Planner can do for you.",o=n.ctaLabel||"Set Up Your First Plan";po.innerHTML=`
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
  `,document.getElementById("onboardingStartWizard").addEventListener("click",e),n.onSkip&&document.getElementById("onboardingSkip").addEventListener("click",n.onSkip)}function fi(){po&&(po.style.display="none")}function HA(){return`
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
  `}let ts=null,Va=null,Oc=null,O={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35},Pt="scenario",Ce=1;function xy(){Pt="scenario",Ce=1,O={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35}}function Ay(t,e,n=null){ts=t,Va=e,Oc=n,xy(),jt()}function jt(){ts&&(Pt==="scenario"?WA():Pt==="stress"?jA():Pt==="decision"&&QA())}function WA(){ts.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${_u(2,Ce)}
        </div>

        ${Ce===1?YA():GA()}
      </div>
    </div>
  `,Tu()}function YA(){const t=O.household==="couple";return`
    <div class="wizard-step">
      <div class="wizard-step-title">Let's create your plan</div>
      <div class="wizard-step-desc">
        Just a few basics to start — no money questions yet. You'll add your spending, pots and other
        details in the tools themselves, only when you need them.
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <label style="display:block; font-size:13px; margin-bottom:4px;">Plan name</label>
        <input type="text" id="wizScenarioName" value="${O.scenarioName}" placeholder="e.g. My plan" style="max-width: 320px;">
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

      ${sp("You","wiz",O.currentAge,O.retirementAge,O.retired)}
      <div id="wizPartnerBlock" style="display:${t?"block":"none"};">
        ${sp("Your partner","wizPartner",O.partnerAge,O.partnerRetirementAge,O.partnerRetired)}
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
  `}function sp(t,e,n,s,r){const i=r?"Age you retired":"Target retirement age",o=e+"CurrentAge",a=e+"RetireAge",c=e+"Retired";return`
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
  `}function GA(){return`
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
  `}function jA(){ts.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${_u(6,Ce)}
        </div>

        ${KA(Ce)}
      </div>
    </div>
  `,Tu()}function KA(t){switch(t){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            Think of this as your "salary" in retirement. This is the total amount before tax that you want to receive each year.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBaseSalary" value="${O.baseSalary}">
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
            <input type="number" id="wizOther" value="${O.otherIncome}">
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
                <input type="text" id="wizSpStartDate" value="${O.spStartDate}" placeholder="e.g. 6 May 2040" style="width: 100%;">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Weekly Amount (from HMRC)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizSpWeeklyAmount" value="${O.spWeeklyAmount||""}" step="0.01" placeholder="e.g. 221.20">
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
                <input type="number" id="wizIsaBalance" min="0" value="${O.isaBalance}">
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
            <input type="number" id="wizDuration" value="${O.duration}" style="max-width: 100px;">
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
              <option value="inflates" ${O.taxMode==="inflates"?"selected":""}>Standard (rise with inflation)</option>
              <option value="frozen" ${O.taxMode==="frozen"?"selected":""}>Frozen (stay at current levels)</option>
            </select>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> "Frozen" is more pessimistic - you pay more tax over time as your income grows but thresholds don't.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="finish-stress">${O.enabledTools.includes("decision")?"Continue to Decision Tool":"Finish Setup"}</button>
          </div>
        </div>
      `;default:return""}}function QA(){ts.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${_u(4,Ce)}
        </div>

        ${JA(Ce)}
      </div>
    </div>
  `,Tu()}function JA(t){switch(t){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            This is your target "salary" from your pension. The tool will calculate how much to withdraw each month.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizDBaseSalary" value="${O.decisionSalary}">
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
                <input type="number" id="wizDIsaBalance" min="0" value="${O.decisionIsaBalance}">
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
            <input type="number" id="wizDDuration" value="${O.decisionDuration}" style="max-width: 100px;">
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
      `;default:return""}}function _u(t,e){let n="";for(let s=1;s<=t;s++){const r=s<e?"done":s===e?"active":"";n+=`<div class="wizard-dot ${r}"></div>`}return n}function Tu(){if(ts.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>XA(e.dataset.action))}),document.getElementById("wizRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wiz",O.equityMin,O.bondMin,O.cashTarget);const e=document.getElementById("wizEquityGlide");e&&(e.checked=!!O.equityGlideEnabled,window.updateAllocDisplay("wiz"))}if(document.getElementById("wizDRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wizD",O.decisionEquity,O.decisionBond,O.decisionCash);const e=document.getElementById("wizDEquityGlide");e&&(e.checked=!!O.decisionEquityGlideEnabled,window.updateAllocDisplay("wizD"))}}function XA(t){switch(ky(),t){case"skip-all":if(Oc){Oc();break}O.startAt="budget",er();break;case"to-router":{const e=parseInt(O.currentAge),n=parseInt(O.retirementAge),s=r=>{typeof window.showToast=="function"&&window.showToast(r,"error")};if(!n||n<40||n>95){s(O.retired?"Please enter the age you retired":"Please enter a target retirement age");return}if(e&&n>e&&O.retired){s("You ticked 'already retired' but the age is in the future — untick it, or lower the age.");return}if(e&&n<e&&!O.retired){s("That retirement age is in the past — tick 'already retired' if you've already retired.");return}Ce=2,jt();break}case"start-budget":case"start-stress":case"start-decision":O.startAt=t.replace("start-",""),er();break;case"next":{const e=vl(O.spStartDate);if(!e.valid){typeof window.showToast=="function"&&window.showToast(e.error,"error");return}Pt==="scenario"?Ce<2&&(Ce++,jt()):Pt==="stress"?Ce<6&&(Ce++,jt()):Pt==="decision"&&Ce<4&&(Ce++,jt());break}case"back":(Pt==="scenario"&&Ce>1||Pt==="stress"&&Ce>1||Pt==="decision"&&Ce>1)&&(Ce--,jt());break;case"start-tools":if(!O.enabledTools||O.enabledTools.length===0){typeof window.showToast=="function"&&window.showToast("Please select at least one tool","error");return}oc("scenario");break;case"skip-stress":oc("stress");break;case"finish-stress":O.decisionSalary=O.baseSalary,O.decisionEquity=O.equityMin,O.decisionBond=O.bondMin,O.decisionCash=O.cashTarget,O.decisionIsaBalance=O.isaBalance,O.decisionDuration=O.duration,O.decisionEquityGlideEnabled=O.equityGlideEnabled,oc("stress");break;case"skip-decision":er();break;case"finish":er();break}}function oc(t){const e=O.enabledTools.includes("stress"),n=O.enabledTools.includes("decision");t==="scenario"?e?(Pt="stress",Ce=1,jt()):n?(Pt="decision",Ce=1,jt()):er():t==="stress"&&n?(Pt="decision",Ce=1,jt()):er()}function ky(){const t=document.getElementById("wizScenarioName");t&&(O.scenarioName=t.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(O.scenarioDescription=e.value.trim()||"");const n=document.querySelector('input[name="wizHousehold"]:checked');n&&(O.household=n.value);const s=document.getElementById("wizCurrentAge");s&&(O.currentAge=parseInt(s.value)||"");const r=document.getElementById("wizRetireAge");r&&(O.retirementAge=parseInt(r.value)||"");const i=document.getElementById("wizRetired");i&&(O.retired=i.checked);const o=document.getElementById("wizPartnerCurrentAge");o&&(O.partnerAge=parseInt(o.value)||"");const a=document.getElementById("wizPartnerRetireAge");a&&(O.partnerRetirementAge=parseInt(a.value)||"");const c=document.getElementById("wizPartnerRetired");c&&(O.partnerRetired=c.checked);const d=document.getElementById("wizToolStress"),h=document.getElementById("wizToolDecision");if(d!==null||h!==null){const w=[];d&&d.checked&&w.push("stress"),h&&h.checked&&w.push("decision"),O.enabledTools=w}const m=document.getElementById("wizBaseSalary");m&&(O.baseSalary=parseFloat(m.value)||3e4);const f=document.getElementById("wizOther");f&&(O.otherIncome=parseFloat(f.value)||0);const y=document.getElementById("wizSpStartDate");y&&(O.spStartDate=y.value.trim()||"");const T=document.getElementById("wizSpWeeklyAmount");if(T&&(O.spWeeklyAmount=parseFloat(T.value)||0),document.getElementById("wizPot")&&typeof window.readAlloc=="function"){const w=window.readAlloc("wiz");O.equityMin=w.equityMin,O.bondMin=w.bondMin,O.cashTarget=w.cashTarget}const E=document.getElementById("wizEquityGlide");E&&(O.equityGlideEnabled=E.checked);const x=document.getElementById("wizIsaBalance");x&&(O.isaBalance=parseFloat(x.value)||0);const C=document.getElementById("wizDuration");C&&(O.duration=parseInt(C.value)||35);const P=document.getElementById("wizTaxMode");P&&(O.taxMode=P.value);const D=document.getElementById("wizDBaseSalary");if(D&&(O.decisionSalary=parseFloat(D.value)||3e4),document.getElementById("wizDPot")&&typeof window.readAlloc=="function"){const w=window.readAlloc("wizD");O.decisionEquity=w.equityMin,O.decisionBond=w.bondMin,O.decisionCash=w.cashTarget}const R=document.getElementById("wizDEquityGlide");R&&(O.decisionEquityGlideEnabled=R.checked);const B=document.getElementById("wizDIsaBalance");B&&(O.decisionIsaBalance=parseFloat(B.value)||0);const N=document.getElementById("wizDDuration");N&&(O.decisionDuration=parseInt(N.value)||35)}function er(){ky(),Va&&Va(O)}function pi(){ts&&(ts.style.display="none")}function ZA(t,e,n,s){if(ts=t,Va=n,xy(),O.enabledTools=e,s&&(e.includes("stress")&&s.source==="decision"&&(O.baseSalary=s.baseSalary||3e4,O.equityMin=s.equityMin||25e4,O.bondMin=s.bondMin||2e5,O.cashTarget=s.cashTarget||5e4,O.isaBalance=s.isaBalance||0,O.duration=s.duration||35,O.spStartDate=s.spStartDate||"",O.spWeeklyAmount=s.spWeeklyAmount||0),e.includes("decision")&&s.source==="stress"&&(O.decisionSalary=s.baseSalary||3e4,O.decisionEquity=s.equityMin||25e4,O.decisionBond=s.bondMin||2e5,O.decisionCash=s.cashTarget||5e4,O.decisionIsaBalance=s.isaBalance||0,O.decisionDuration=s.duration||35)),e.includes("stress"))Pt="stress";else if(e.includes("decision"))Pt="decision";else{n&&n(O);return}Ce=1,jt()}function e1(){return`
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
  `}function t1(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}function n1(t,e,n={}){const s=t1(),r=t.getContext("2d"),{width:i,height:o}=t,a={top:50,right:180,bottom:60,left:80},c=i-a.left-a.right,d=o-a.top-a.bottom;r.fillStyle=s.bg,r.fillRect(0,0,i,o);const h=Object.keys(e),m=n.years||35;let f=0;h.forEach(x=>{const C=e[x].result;C&&C.hist&&C.hist.forEach(P=>{P.total>f&&(f=P.total)})}),f*=1.1;const y=x=>a.left+x/m*c,T=x=>a.top+d-x/f*d;s1(r,a,c,d,m,f,n.title||"Scenario Comparison",s);const E=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];h.forEach((x,C)=>{const P=e[x].result;if(!P||!P.hist)return;r.beginPath(),r.strokeStyle=E[C%E.length],r.lineWidth=2.5,P.hist.forEach((R,B)=>{const N=y(R.year),w=T(R.total);B===0?r.moveTo(N,w):r.lineTo(N,w)}),r.stroke();const D=a.top+15+C*24;r.fillStyle=E[C%E.length],r.fillRect(i-a.right+15,D,20,4),r.font="11px system-ui, sans-serif",r.fillStyle=s.text,r.textAlign="left",r.fillText(e[x].name||x,i-a.right+40,D+5),P.final/1e3,r.fillStyle=s.muted,r.fillText(`${Cy(P.final)}`,i-a.right+40,D+18)})}function s1(t,e,n,s,r,i,o,a){t.font="bold 14px system-ui, sans-serif",t.fillStyle=a.text,t.textAlign="center",t.fillText(o,e.left+n/2,e.top-20),t.strokeStyle=a.grid,t.lineWidth=1;for(let c=0;c<=5;c++){const d=e.top+s*c/5;t.beginPath(),t.moveTo(e.left,d),t.lineTo(e.left+n,d),t.stroke();const h=i*(5-c)/5;t.font="11px system-ui, sans-serif",t.fillStyle=a.muted,t.textAlign="right",t.fillText(Cy(h),e.left-10,d+4)}for(let c=0;c<=r;c+=5){const d=e.left+c/r*n;t.beginPath(),t.moveTo(d,e.top),t.lineTo(d,e.top+s),t.stroke(),t.textAlign="center",t.fillText(`Y${c}`,d,e.top+s+20)}t.font="12px system-ui, sans-serif",t.textAlign="center",t.fillText("Years",e.left+n/2,e.top+s+45),t.save(),t.translate(20,e.top+s/2),t.rotate(-Math.PI/2),t.fillText("Fund Value",0,0),t.restore()}function Cy(t){return t>=1e6?`£${(t/1e6).toFixed(1)}M`:t>=1e3?`£${(t/1e3).toFixed(0)}k`:`£${t.toFixed(0)}`}function r1(){return`
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
  `}window._simEngine={runMonteCarlo:mu,runHistorical:py,simulate:Zt,monteCarloReturns:hr};window._constants={EQUITY_RETURNS:rr,INFLATION:$a};window._mathUtils={seededRng:Xc};let Py=null,Ry=null;function My(){Py=null,Ry=null;const t=document.getElementById("mcResults"),e=document.getElementById("histResults");t&&(t.innerHTML=""),e&&(e.innerHTML="");const n=document.getElementById("optimiseResultsMC"),s=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),s&&(s.innerHTML="")}function Dy(){document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-stresstab="montecarlo"]');t&&t.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("stress-montecarlo");e&&e.classList.remove("hidden")}function By(){document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-decisiontab="entry"]');t&&t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("decision-entry");e&&e.classList.remove("hidden")}const Ly=document.createElement("style");Ly.textContent=Zx()+DA()+$A()+HA()+e1()+gA()+r1();document.head.appendChild(Ly);const Iu=document.getElementById("globalLoadingOverlay"),i1=Iu.querySelector(".loading-text");function _t(t="Loading..."){i1.textContent=t,Iu.classList.add("active")}function Tt(){Iu.classList.remove("active")}window.showToast=function(e,n="info",s=3e3){const r=document.querySelector(".toast-notification");r&&r.remove();const i=document.createElement("div");i.className=`toast-notification ${n}`,i.innerHTML=`
        <span class="toast-icon">${n==="success"?"✓":n==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${e}</span>
      `,document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("show")),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},s)};document.getElementById("versionDisplay").textContent=`v${cp}`;document.getElementById("entryMonth").value=Dx();function Fc(t){const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");if(!e||!n)return;const s=parseFloat(e.value)||0;n.value=s>0?Math.round(s*52):"",n._updateOverlay&&n._updateOverlay()}["ds","ss"].forEach(t=>{const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");e&&n&&(e.addEventListener("input",()=>{const s=parseFloat(e.value)||0;n.value=s>0?Math.round(s*52):"",n._updateOverlay&&n._updateOverlay()}),n.addEventListener("input",()=>{const s=parseFloat(n.value)||0;e.value=s>0?+(s/52).toFixed(2):"",e._updateOverlay&&e._updateOverlay()}))});function Su(t){const e=parseFloat(t);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function Ny(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(n){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(n){!n.shiftKey&&!n.ctrlKey&&!n.metaKey&&this.select()})})}function Oy(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted||e.closest("#budget-content")||e.closest("#budWizardOverlay")||e.closest("#adminPanelOverlay"))return;e.dataset.formatted="true";let n=e.closest(".input-with-unit");const s=!!n;n||(n=document.createElement("span"),n.className="num-format-wrap",n.style.cssText="position:relative; display:block;",e.parentNode.insertBefore(n,e),n.appendChild(e));const r=document.createElement("span");r.className="number-format-overlay";const i=s?"34px":"14px";r.style.cssText=`
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
        `,getComputedStyle(n).position==="static"&&(n.style.position="relative");function o(){const a=parseFloat(e.value);!isNaN(a)&&a>=1e3&&document.activeElement!==e?(r.textContent=Su(a),r.style.display="block",e.style.color="transparent"):(r.style.display="none",e.style.color="")}e._updateOverlay=o,e.addEventListener("focus",()=>{r.style.display="none",e.style.color=""}),e.addEventListener("blur",o),e.addEventListener("input",()=>{document.activeElement===e&&(r.style.display="none",e.style.color="")}),n.appendChild(r),o()})}function Tl(){document.querySelectorAll('input[type="number"]').forEach(t=>{t._updateOverlay&&t._updateOverlay()})}setTimeout(()=>{Ny(),Oy()},100);const o1=new MutationObserver(t=>{let e=!1;t.forEach(n=>{n.addedNodes.forEach(s=>{var r,i;s.nodeType===1&&((r=s.matches)!=null&&r.call(s,'input[type="number"]')||(i=s.querySelector)!=null&&i.call(s,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{Ny(),Oy()},50)});o1.observe(document.body,{childList:!0,subtree:!0});let Br=null;async function xu(t,e=null){ho(),Iy(),fi(),pi(),document.getElementById("mainApp").classList.remove("hidden"),TA().then(()=>{mr("ss",!0),mr("ds",!0);const o=document.getElementById("adminGearBtn");o&&(o.style.display=wA()?"inline-block":"none")}),document.getElementById("userEmail").textContent=t.email,await Ur();const n=await Jg();Au(n),await In(),await yr(),zc(),Dy(),By(),My();const s=e||(n.includes("decision")?"decision":"stress");updateNextStepBanner(),document.querySelectorAll(".tab").forEach(o=>o.classList.remove("active"));const r=document.querySelector(`.tab[data-tab="${s}"]`);r&&r.classList.add("active"),document.querySelectorAll(".tab-content").forEach(o=>o.classList.remove("active"));const i=document.getElementById(`${s}-content`);i&&i.classList.add("active")}function Au(t){const e={decision:["decision"],stress:["stress"]};document.querySelectorAll(".tab").forEach(s=>{const r=s.dataset.tab;let i=!1;for(const[o,a]of Object.entries(e))if(a.includes(r)){i=t.includes(o);break}Object.values(e).flat().includes(r)||(i=!0),s.style.display=i?"":"none"})}window.openToolSettingsTab=function(t){const e=t==="decision"?'.sub-tab[data-decisiontab="decisionsettings"]':'.sub-tab[data-stresstab="stresssettings"]',n=document.querySelector(e);n&&n.click()};async function Vc(t){try{const e=s=>!!s.baseSalary&&+s.baseSalary!=3e4;if(t==="decision"){const s=await Ze();return!!s.configured||e(s)||await yi()}const n=await qe();return!!n.configured||e(n)}catch{return!0}}async function Il(){const t=document.getElementById("dsSetupBanner"),e=document.getElementById("ssSetupBanner");t&&(t.style.display=await Vc("decision")?"none":"block"),e&&(e.style.display=await Vc("stress")?"none":"block")}async function zc(){try{const t=await qe(),e=await Ze();Il(),document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",document.getElementById("dsDuration").value=e.duration||35,writeAlloc("ds",e.equityMin??25e4,e.bondMin??2e5,e.cashTarget??5e4,e.diversifierStart||0),restoreCustomAllocFromSettings("ds",e),window._taggedFunds.ds=(e.taggedFunds||[]).map(s=>({...s})),setAllocMode("ds",e.allocMode||(e.taggedFunds&&e.taggedFunds.length?"funds":"risk")),updateEntryTagPrompt(),document.getElementById("dsEquityGlide").checked=e.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsIsaBalance").value=e.isaBalance||0,document.getElementById("dsAccessMethod").value=e.accessMethod||"drawdown",document.getElementById("dsUfplsYears").value=e.ufplsYears||"",document.getElementById("dsUfplsPcls").checked=!!e.ufplsThenPcls,document.getElementById("dsBandFillRecycle").checked=!!e.bandFillRecycle,syncAccessButtons("ds"),document.getElementById("dsSpendingProfile").value=e.spendingProfile||"flat",updateScheduleSpendNotes(),document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",Fc("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||15e3,document.getElementById("dsDisableProtection").checked=e.disableProtection||!1,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,Cu(t),document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(s=>({...s})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssDbAmount").value=t.dbAmount||0,document.getElementById("ssDbStartYear").value=t.dbStartYear||0,document.getElementById("ssDbIndexation").value=t.dbIndexation||"lpi5",window._ssExtraIncomes=Array.isArray(t.extraIncomes)?JSON.parse(JSON.stringify(t.extraIncomes)):[],updateScheduleSpendNotes(),window._ssWindfalls=Array.isArray(t.windfalls)?JSON.parse(JSON.stringify(t.windfalls)):[],renderExtraIncomes(),document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",Fc("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0,document.getElementById("ssAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("ssUfplsYears").value=t.ufplsYears||"",document.getElementById("ssUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("ssBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ss");const n=document.getElementById("ssSeedNote");n&&(n.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),Tl(),console.log("All inputs initialized from stored settings")}catch(t){console.error("Error initializing inputs from settings:",t)}}async function Fy(t){console.log("Wizard completed with data:",t);const e=parseInt(t.retirementAge)||60,n=parseInt(t.currentAge)||e,s=95,r=Math.max(5,s-Math.max(n,e));try{const c={duration:r},d={duration:r};await Gg(t.scenarioName||"My plan","",["stress","decision"],{stressSettings:c,decisionSettings:d},!0),Bs(),es();try{const h=await No();h.currentAge=parseInt(t.currentAge)||h.currentAge,h.retirementAge=e,h.endAge=s,h.retired=!!t.retired,h.sharedWithPartner=t.household==="couple",t.household==="couple"&&(h.partnerAge=parseInt(t.partnerAge)||null,h.partnerRetirementAge=parseInt(t.partnerRetirementAge)||null,h.partnerRetired=!!t.partnerRetired),await bu(h)}catch(h){console.warn("Could not seed budget from wizard:",h)}}catch(c){console.error("Error creating scenario from wizard:",c)}const i=xn(),o=t.startAt||"budget";o==="budget"&&(window._budWizAutoOpen=!0),await xu(i);const a=document.querySelector('.tab[data-tab="'+o+'"]');a&&a.click(),(o==="decision"||o==="stress")&&!await Vc(o)&&(openToolSettingsTab(o),showToast("First, set up this plan: your pot, spending need and State Pension.","info",6e3))}async function Vy(){if(pi(),await Og()){document.getElementById("mainApp").classList.remove("hidden");const e=document.getElementById("scenarioDropdown");e&&e.classList.add("open"),showToast("Plan creation cancelled — you’re back on your current plan.","info",3500)}else za(xn())}function za(t){ho(),Iy();const e=t.displayName||t.email.split("@")[0];document.getElementById("onboardingPage").style.display="block",Sy(document.getElementById("onboardingPage"),e,()=>{fi(),document.getElementById("setupWizard").style.display="block",Ay(document.getElementById("setupWizard"),Fy,Vy)})}BA(document.getElementById("authScreen"),async t=>{console.log("Auth success callback triggered for:",t.email);try{console.log("Checking for existing cloud data...");const e=await Og();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),ho(),xu(t)):(console.log("New user - showing onboarding page"),za(t))}catch(e){console.error("Error in auth callback:",e),za(t)}});RA(document.getElementById("landingPage"),{onGetStarted:()=>{ho(),fo("signup")},onSignIn:()=>{ho(),fo("signin")}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{Bs(),es(),An(),await eu(),document.getElementById("mainApp").classList.add("hidden"),fi(),pi(),fo("signin")}catch(t){console.error("Logout error:",t)}});async function Uc(){const t=document.getElementById("planLockChip");if(!t)return;const e=await yi();t.style.display="inline-block",t.textContent=e?"🔒 locked":"✏️ draft",t.title=e?"This plan’s settings are committed so your recorded entries stay consistent. Click for details.":"This plan’s settings are still editable. Saving the Decision settings commits (locks) the plan. Click for details.",t.style.cursor="pointer",t.onclick=n=>{n.stopPropagation(),explainPlanLock(e)}}window.explainPlanLock=function(t){let e=document.getElementById("planLockExplainer");e&&e.remove(),e=document.createElement("div"),e.id="planLockExplainer",e.style.cssText="position:fixed; inset:0; z-index:1300; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; padding:20px;",e.innerHTML=`<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; max-width:560px; width:100%; padding:26px; font-size:15px; line-height:1.6;"><h2 style="margin-bottom:12px;">Plans — and why they lock 🔒</h2><p style="margin-bottom:10px; color:var(--text-muted);">A <strong style="color:var(--text);">plan</strong> is a named scenario: its settings (pots, spending target, State Pension, rules) plus everything you record against them — monthly decisions and tax years. You can keep several plans and switch or duplicate them from this dropdown.</p><p style="margin-bottom:10px; color:var(--text-muted);">When you save a plan’s Decision settings, the plan <strong style="color:var(--text);">locks</strong>: the settings freeze so your recorded history stays meaningful — a decision saved under one set of rules shouldn’t be silently re-judged under another.</p><ul style="margin:0 0 12px 18px; color:var(--text-muted);"><li><strong style="color:var(--text);">✏️ draft</strong> — settings still editable; nothing committed yet.</li><li><strong style="color:var(--text);">🔒 locked, nothing recorded</strong> — you can unlock and edit freely.</li><li><strong style="color:var(--text);">🔒 locked with history</strong> — settings can’t change; duplicate into a new plan instead.</li></ul><p style="margin-bottom:16px; color:var(--text-muted);">The Budget and the Stress Tester are never locked — the budget autosaves like a document, and Stress is a sandbox for what-ifs.</p><div style="display:flex; gap:10px; flex-wrap:wrap;"><button type="button" onclick="document.getElementById('planLockExplainer').remove()">Got it</button>`+(t?`<button type="button" class="risk-btn" onclick="document.getElementById('planLockExplainer').remove(); document.querySelector('.tab[data-tab=&quot;decision&quot;]').click(); openToolSettingsTab('decision');">View the locked settings</button>`:"")+"</div></div>",e.addEventListener("click",n=>{n.target===e&&e.remove()}),document.body.appendChild(e)};async function Ur(){var r;const t=await ui(),e=t.find(i=>i.isActive),n=document.getElementById("scenarioActiveName");n&&(n.textContent=e&&(((r=e.planDetails)==null?void 0:r.name)||e.name)||"No Plan"),await Uc();const s=document.getElementById("scenarioList");if(s){if(t.length===0){s.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}s.innerHTML=t.map(i=>{var c,d;const o=((c=i.planDetails)==null?void 0:c.name)||i.name||"Unnamed Plan",a=((d=i.planDetails)==null?void 0:d.description)||i.description||"";return`
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
      `}).join(""),s.querySelectorAll(".scenario-dropdown-item").forEach(i=>{i.addEventListener("click",async o=>{if(o.target.closest(".scenario-item-actions"))return;const a=i.dataset.scenarioId;if(!a)return;const c=t.find(d=>d.isActive);if(c&&c.id===a){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await hS(a),Bs(),es(),document.getElementById("scenarioDropdown").classList.remove("open"),My(),Dy(),By();const d=await Jg();Au(d);const h=document.querySelector(".tab.active");if(h&&h.style.display==="none"){const m=document.querySelector('.tab:not([style*="display: none"])');if(m){document.querySelectorAll(".tab").forEach(T=>T.classList.remove("active")),m.classList.add("active"),document.querySelectorAll(".tab-content").forEach(T=>T.classList.remove("active"));const f=m.dataset.tab+"-content",y=document.getElementById(f);y&&y.classList.add("active")}}await In(),await yr(),await zc(),await Ur()}catch(d){console.error("Error switching scenario:",d),showToast("Failed to switch plan: "+d.message,"error")}})}),s.querySelectorAll(".scenario-rename-btn").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const a=i.dataset.id,c=i.dataset.name,d=prompt("Rename plan:",c);if(d&&d.trim()&&d.trim()!==c)try{await pS(a,d.trim()),await Ur()}catch(h){console.error("Error renaming scenario:",h),showToast("Failed to rename plan: "+h.message,"error")}})}),s.querySelectorAll(".scenario-tools-btn").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const a=i.dataset.id,c=(i.dataset.tools||"stress,decision").split(",");document.getElementById("scenarioDropdown").classList.remove("open"),a1(a,c)})}),s.querySelectorAll(".scenario-delete-btn").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const a=i.dataset.id,c=i.dataset.name;if(await appConfirm(`Delete plan "${c}"? This cannot be undone.`))try{await gS(a),Bs(),es(),await In(),await yr(),await zc(),await Ur()}catch(d){console.error("Error deleting scenario:",d),showToast("Failed to delete plan: "+d.message,"error")}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",t=>{t.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",t=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(t.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden");const t=()=>{fi(),document.getElementById("setupWizard").style.display="block",Ay(document.getElementById("setupWizard"),Fy,Vy)},e=xn(),n=e&&(e.displayName||(e.email||"").split("@")[0])||"there",s=document.getElementById("onboardingPage");s.style.display="block",Sy(s,n,t,{title:"A new plan — here’s the flow",subtitle:"A quick refresher on how the pieces fit together before you set it up.",ctaLabel:"Set up the new plan",onSkip:t})});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{var s;document.getElementById("scenarioDropdown").classList.remove("open");const t=await $e();if(!t){showToast("No active plan to duplicate.","error");return}const e=((s=t.planDetails)==null?void 0:s.name)||t.name||"My Plan",n=prompt("Name for the copy:",e+" (copy)");if(!(!n||!n.trim()))try{await fS(t.id,n.trim()),await Ur()}catch(r){console.error("Error duplicating scenario:",r),showToast("Failed to duplicate plan: "+r.message,"error")}});function a1(t,e){const n=document.getElementById("editToolsModal");n&&n.remove();const s=e.includes("stress"),r=e.includes("decision"),i=document.createElement("div");i.id="editToolsModal",i.className="edit-tools-overlay",i.innerHTML=`
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
      `,document.body.appendChild(i),document.getElementById("editToolsCancel").addEventListener("click",()=>i.remove()),i.addEventListener("click",o=>{o.target===i&&i.remove()}),document.getElementById("editToolsSave").addEventListener("click",async()=>{const o=[];if(document.getElementById("editToolStress").checked&&o.push("stress"),document.getElementById("editToolDecision").checked&&o.push("decision"),o.length===0){showToast("Please select at least one tool","error");return}const a=o.filter(c=>!e.includes(c));try{await mS(t,o);const c=await $e();if(c&&c.id===t){Au(o);const d=document.querySelector(".tab.active");if(d&&d.style.display==="none"){const h=document.querySelector('.tab:not([style*="display: none"])');if(h){document.querySelectorAll(".tab").forEach(y=>y.classList.remove("active")),h.classList.add("active"),document.querySelectorAll(".tab-content").forEach(y=>y.classList.remove("active"));const m=h.dataset.tab+"-content",f=document.getElementById(m);f&&f.classList.add("active")}}}if(await Ur(),i.remove(),a.length>0){let d=null;try{if(a.includes("stress")&&e.includes("decision")){const f=await Ze();f&&(d={source:"decision",...f})}else if(a.includes("decision")&&e.includes("stress")){const f=await qe();f&&(d={source:"stress",...f})}}catch(f){console.warn("Could not load existing settings for pre-fill:",f)}const h=document.getElementById("setupWizard");h.style.display="block",document.getElementById("mainApp").style.display="none",ZA(h,a,async f=>{pi();try{a.includes("stress")&&(await Lo({equityMin:f.equityMin,bondMin:f.bondMin,cashTarget:f.cashTarget,isaBalance:f.isaBalance||0,duration:f.duration,baseSalary:f.baseSalary,other:f.otherIncome||0,taxMode:f.taxMode||"inflates",equityGlideEnabled:f.equityGlideEnabled||!1}),es()),a.includes("decision")&&(await ur({equityMin:f.decisionEquity,bondMin:f.decisionBond,cashTarget:f.decisionCash,isaBalance:f.decisionIsaBalance||0,duration:f.decisionDuration,baseSalary:f.decisionSalary,spStartDate:f.spStartDate||null,spWeeklyAmount:f.spWeeklyAmount||0,equityGlideEnabled:f.decisionEquityGlideEnabled||!1}),Bs())}catch(y){console.error("Error saving new tool settings:",y)}await xu(),showToast("New tool configured successfully","success")},d)}else showToast("Tools updated","success")}catch(c){console.error("Error updating scenario tools:",c),showToast("Failed to update tools: "+c.message,"error")}})}const $c=60*60*1e3,zy="pt_lastActivity";let ba=null,rp=0;function Uy(){const t=Date.now();if(t-rp>1e4){rp=t;try{localStorage.setItem(zy,String(t))}catch{}}}function l1(){try{return+localStorage.getItem(zy)||0}catch{return 0}}async function $y(){if(!lt())return;const t=Date.now()-l1();if(t<$c){ba=setTimeout($y,Math.max(6e4,$c-t));return}showToast("You have been logged out due to inactivity (1 hour).","info",5e3);try{Bs(),es(),An(),await eu(),document.getElementById("mainApp").classList.add("hidden"),fi(),pi(),fo("signin")}catch(e){console.error("Auto-logout error:",e)}}function qy(){ba&&clearTimeout(ba),lt()&&(ba=setTimeout($y,$c))}const c1=["mousedown","mousemove","keydown","scroll","touchstart","click"];c1.forEach(t=>{document.addEventListener(t,()=>{Uy(),qy()},{passive:!0})});Uy();qy();Mg(t=>{const e=!document.getElementById("mainApp").classList.contains("hidden");!t&&e&&(document.getElementById("mainApp").classList.add("hidden"),fi(),pi(),fo("signin"),showToast("You’ve been signed out — sign in again to continue. Unsaved changes in open forms were not stored.","warning",8e3))});document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!await appConfirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!await appConfirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await Ng(),console.log("Data wiped successfully"),Bs(),es(),An(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden");const n=xn();za(n),showToast("All data has been deleted. Set up a new plan to start fresh.","success",4e3)}catch(n){console.error("Reset error:",n),showToast("Error resetting data: "+n.message,"error")}});document.getElementById("deleteAccountBtn").addEventListener("click",async()=>{if(!(!await appConfirm(`⚠️ DELETE YOUR ACCOUNT?

This permanently deletes your login AND all saved data:

• All plans and settings
• All portfolio/decision history
• Your household budget

This cannot be undone.`)||!await appConfirm(`FINAL WARNING

Your account and every piece of data will be gone forever.

Delete everything?`)))try{await Ng(),Bs(),es(),An(),localStorage.clear(),await WI(),showToast("Your account and all data have been deleted.","success",4e3),setTimeout(()=>window.location.reload(),1500)}catch(n){console.error("Delete account error:",n),n.code==="auth/requires-recent-login"?showToast("For security, please sign out, sign back in, and press Delete Account again.","error",8e3):showToast("Error deleting account: "+n.message,"error")}});document.querySelectorAll(".tab").forEach(t=>{t.addEventListener("click",async()=>{if(t.dataset.tab!=="stress"){d1();const e=document.getElementById("optimiseResultsMC"),n=document.getElementById("optimiseResultsHist");e&&(e.innerHTML=""),n&&(n.innerHTML="")}document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${t.dataset.tab}-content`).classList.add("active"),t.dataset.tab==="stress"&&await xl(),t.dataset.tab==="budget"&&await P1(),t.dataset.tab==="accumulation"&&await loadAccumulationUI(),t.dataset.tab==="household"&&await loadHouseholdUI(),updateNextStepBanner(),Il(),window.__hideHelpTip&&window.__hideHelpTip()})});const ki=document.querySelector(".tabs"),ip=document.querySelector(".tabs-wrapper");if(ki&&ip){const t=()=>{const e=ki.scrollLeft+ki.clientWidth>=ki.scrollWidth-10;ip.classList.toggle("scrolled-end",e)};ki.addEventListener("scroll",t),t()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>{t.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),window.__hideHelpTip&&window.__hideHelpTip(),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${t.dataset.stresstab}`).classList.remove("hidden"),t.dataset.stresstab==="stresssettings"&&await xl()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>{t.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${t.dataset.decisiontab}`).classList.remove("hidden"),t.dataset.decisiontab==="decisionsettings"&&await Al(),t.dataset.decisiontab==="history"&&await In(),t.dataset.decisiontab==="taxyears"&&await yr()})});async function op(t,e,n,s){var o,a;const r=await Ze(),i=r.equityGlideEnabled?{...r,equityGlide:fu(r)}:r;return PA(t,e,n,s,{settings:i,history:await zs(),allTaxYears:await os(),spInfo:await lu(_y(t)),isaBalance:parseFloat((o=document.getElementById("entryIsa"))==null?void 0:o.value)||0,diversifier:parseFloat((a=document.getElementById("entryDiversifier"))==null?void 0:a.value)||0})}async function ku(t,e,n){if(t<1e4&&e<1e4&&n<1e4&&t+e+n>0){const r=i=>"£"+Math.round(i||0).toLocaleString();return await appConfirm(`These fund values look low — Equity ${r(t)}, Bond ${r(e)}, Cash ${r(n)}.

Enter absolute amounts in pounds, to the single pound (e.g. 250000, not 250).

Continue anyway?`)}return!0}window.handleDecisionSubmit=async function(t){t.preventDefault();const e=document.getElementById("entryMonth").value,n=parseFloat(document.getElementById("entryEquity").value)||0,s=parseFloat(document.getElementById("entryBond").value)||0,r=parseFloat(document.getElementById("entryCash").value)||0,i=[];if(e||i.push("Month"),!n&&n!==0&&i.push("Equity Fund"),!s&&s!==0&&i.push("Bond Balance"),!r&&r!==0&&i.push("Cash Balance"),i.length>0){showToast("Missing: "+i.join(", "),"error",4e3);return}if(!await ku(n,s,r))return;if((await zs({limit:1e3})).find(c=>c.date===e)){showToast(`${ni(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await aA(e)).showWizard){const h=document.getElementById("taxYearWizard");h.style.display="block",window._pendingDecisionForm={dateStr:e,equity:n,bond:s,cash:r},oA(h,e,async m=>{if(h.style.display="none",m&&m.completed)try{Br=await op(e,n,s,r);const f=document.getElementById("decisionOutput");Kf(Br,f),document.getElementById("saveBtn").disabled=!1}catch(f){console.error("Decision error after wizard:",f),showToast("Error: "+f.message,"error")}});return}Br=await op(e,n,s,r);const d=document.getElementById("decisionOutput");Kf(Br,d),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),showToast("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const t=document.getElementById("saveBtn");if(!Br){showToast("No decision to save","error");return}if(!lt()){showToast("Please sign in to save decisions","error");return}t.classList.add("loading"),t.disabled=!0;try{await LS(Br),showToast("Decision saved to history","success"),await In()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error"),t.disabled=!1}finally{t.classList.remove("loading")}};function Cu(t){const e=r=>"£"+Math.round(r||0).toLocaleString(),n=(t.diversifierStart||0)>0?` · Diversifiers ${e(t.diversifierStart)}`:"",s=`Starting balances come from your <strong>Settings</strong> (Fund Minimums): Equity ${e(t.equityMin)} · Bond ${e(t.bondMin)}${n} · Cash ${e(t.cashTarget)}. Edit them in the Settings tab.`;["mcStartSummary","histStartSummary","scenStartSummary"].forEach(r=>{const i=document.getElementById(r);i&&(i.innerHTML=s)}),["mcYears","histYears"].forEach(r=>{const i=document.getElementById(r);i&&(i.value=t.duration)})}window.runMonteCarloUI=async function(){const t=await qe(),e={years:parseInt(document.getElementById("mcYears").value)||t.duration},n=document.getElementById("optimiseResultsMC");n&&(n.innerHTML=""),document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:s,stats:r}=yA(e);Py=s,Yy(r,s,"Monte Carlo (1000 runs)","mcResults",e.years)}catch(s){console.error("Simulation error:",s),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${s.message}</div>`}},50)};window.runHistoricalUI=async function(){const t=await qe(),e={years:parseInt(document.getElementById("histYears").value)||t.duration},n=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:s,stats:r}=vA(e);Ry=s,Yy(r,s,"Historical Analysis","histResults",e.years)}catch(s){console.error("Simulation error:",s),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${s.message}</div>`}},50)};window.runScenariosUI=async function(){await qe();const t={};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',setTimeout(()=>{try{const e=bA(t);b1(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};let ys=!1,Ni=0;function d1(){Ni++}window.runOptimisationUI=async function(t){if(ys)return;ys=!0;const e=++Ni,n=document.getElementById("optimiseBtn"+t),s=document.getElementById("optimiseResults"+t);n&&(n.disabled=!0),n&&(n.textContent="Optimising..."),s.innerHTML='<div class="loading"><div class="spinner"></div>Preparing optimisation...</div>';const r=await qe(),i=JSON.parse(JSON.stringify(r)),o=document.getElementById(t==="MC"?"mcYears":"histYears"),a=parseInt(o&&o.value)||i.duration,c=(i.equityMin||0)+(i.bondMin||0)+(i.cashTarget||0);if(e!==Ni){ys=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const d=[];for(let _=5;_<=90;_+=5)for(let S=5;S<=95-_;S+=5){const A=100-_-S;A>=0&&d.push({equity:Math.round(c*S/100),bond:Math.round(c*A/100),cash:Math.round(c*_/100)})}const{EQUITY_RETURNS:h,INFLATION:m}=window._constants,{simulate:f,monteCarloReturns:y}=window._simEngine,T=Object.keys(h).map(Number).sort((_,S)=>_-S),E=Math.max(...T),x=_=>{const S={...i,equityMin:_.equity,bondMin:_.bond,cashTarget:_.cash},A=Ls({years:a},S),b=[];if(t==="MC")for(let V=0;V<1e3;V++)b.push(f(A,y(A,V),V));else T.forEach(V=>{if(V+a-1>E)return;const xe={equity:{},inflation:{}};for(let ae=0;ae<a;ae++)xe.equity[ae]=h[V+ae]||0,xe.inflation[ae]=m[V+ae]||.025;b.push(f(A,xe,V))});const Y=b.filter(V=>V.failed);b.filter(V=>!V.failed);const ie=(b.length-Y.length)/b.length*100,q=b.reduce((V,xe)=>V+Math.min(1,(xe.years||0)/(xe.duration||a)),0)/b.length*100,ee=b.map(V=>V.protMonths).reduce((V,xe)=>V+xe,0)/b.length,ye=b.filter(V=>V.protMonths>0).length,he=b.map(V=>V.failed?0:V.finalReal||0).sort((V,xe)=>V-xe),dt=he.length?he[Math.floor(he.length*.5)]:0,re=he.length?he[Math.floor(he.length*.9)]:0;return{equity:_.equity,bond:_.bond,cash:_.cash,rate:ie,coverage:q,avgProt:ee,withProt:ye,totalRuns:b.length,medianFinal:dt,p90Final:re}};let C;try{const _={equity:i.equityMin||0,bond:i.bondMin||0,cash:i.cashTarget||0},S=x(_);C={..._,...S}}catch(_){console.error("Optimisation error (original):",_),s.innerHTML='<div class="alert alert-danger">Error: '+_.message+"</div>",ys=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const P=10;let D=0;const R=[];let B=null;function N(_){const S=Math.max(..._.map(b=>b.coverage)),A=_.filter(b=>b.coverage>=S-.5);return A.sort((b,Y)=>b.avgProt-Y.avgProt||Y.medianFinal-b.medianFinal),A[0]}function w(_,S){return Math.round(_.equity)===Math.round(S.equity)&&Math.round(_.bond)===Math.round(S.bond)&&Math.round(_.cash)===Math.round(S.cash)}function v(){if(e!==Ni){ys=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),s.innerHTML="";return}try{const _=Math.min(D+P,d.length);for(;D<_;D++)R.push(x(d[D]));s.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations... '+D+"/"+d.length+"</div>",D<d.length?setTimeout(v,0):(B=N([...R,C]),I())}catch(_){console.error("Optimisation error:",_),s.innerHTML='<div class="alert alert-danger">Error: '+_.message+"</div>",ys=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}}function I(){if(e!==Ni){ys=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),s.innerHTML="";return}const _=c>0?C.cash/c*100:0,S=c>0?C.equity/c*100:0,b=_>90||_<5||S<5?'<div class="alert alert-info" style="margin-bottom:16px;font-size:13px;">Your current split is outside the range the optimiser sweeps, but it was included in this comparison.</div>':"",Y=B&&!w(B,C)&&(B.coverage>C.coverage+.5||B.coverage>=C.coverage-.01&&B.avgProt<C.avgProt-3),ie=(se,ee)=>{const ye=he=>Math.round(he/c*100);return'<div style="padding:16px;border-radius:8px;'+(ee?"background:rgba(46,160,67,0.1);border:1px solid var(--success);":"background:rgba(0,0,0,0.2);")+'"><div style="font-weight:500;margin-bottom:10px;color:var(--'+(ee?"success":"text-muted")+');">'+(ee?"Optimised split":"Your current split")+'</div><div style="font-size:26px;font-weight:700;color:var(--'+(ee?"success":"warning")+');">'+se.coverage.toFixed(0)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">of retirement years funded'+(ee?" ("+(B.coverage-C.coverage>=0?"+":"")+(B.coverage-C.coverage).toFixed(0)+"%)":"")+'</div><div style="font-size:13px;">Equity '+ye(se.equity)+"% · Bonds "+ye(se.bond)+"% · Cash "+ye(se.cash)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">'+se.rate.toFixed(0)+"% never run out · "+j(se.medianFinal)+" typically left</div></div>"};let q="";if(Y){const se=B.medianFinal-C.medianFinal,ee=C.medianFinal>0?se/C.medianFinal*100:0;q+='<div class="card" style="margin-top:20px;border-color:var(--success);">',q+='<h3 style="color:var(--success);margin-top:0;">A better fund split</h3>',q+='<p style="color:var(--text-muted);margin-bottom:16px;">This split funds more of your retirement (higher coverage). Coverage credits a plan for every year it pays for, so it prefers splits that fall short late over ones that fail early.</p>',q+=b,q+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">'+ie(C,!1)+ie(B,!0)+"</div>",se<0?q+='<div class="alert alert-warning" style="margin-bottom:16px;"><strong>Trade-off:</strong> it typically leaves '+Math.abs(ee).toFixed(0)+"% less at the end (usually less equity) — more safety, a bit less upside.</div>":se>0&&(q+='<div class="alert alert-info" style="margin-bottom:16px;"><strong>Bonus:</strong> it also typically leaves '+ee.toFixed(0)+"% more at the end.</div>"),q+='<button onclick="applyOptimisedAllocationUI('+B.equity+","+B.bond+","+B.cash+')" style="width:100%;">Apply this split to your Settings</button>',q+="</div>"}else q+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',q+='<h3 style="color:var(--primary);margin-top:0;">Your split is already about as good as it gets</h3>',q+=b,q+='<p style="color:var(--text-muted);">We tested '+d.length+" fund splits. Yours funds "+C.coverage.toFixed(0)+"% of retirement years — the best, or within 0.5% of it, with no clearly better low-protection alternative.</p>",q+='<p style="font-size:13px;color:var(--text-muted);">Your split — Equity '+Math.round(S)+"% · Bonds "+Math.round(C.bond/c*100)+"% · Cash "+Math.round(_)+"% · "+C.rate.toFixed(0)+"% never run out.</p>",q+="</div>";s.innerHTML=q,ys=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}setTimeout(v,0)};window.applyOptimisedAllocationUI=async function(t,e,n){if(writeAlloc("ss",t,e,n),writeAlloc("ds",t,e,n),Cu({equityMin:t,bondMin:e,cashTarget:n,duration:parseInt(document.getElementById("ssDuration").value)||35}),Tl(),lt())try{await Lo({equityMin:t,bondMin:e,cashTarget:n})}catch(s){console.error("Error saving optimised settings:",s)}showToast("Optimised allocation applied to settings and starting values. Scroll up to re-run.","success",4e3)};const u1={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function h1(t){if(!t||t.length===0)return"";const e=t.filter(i=>i.failed).sort((i,o)=>i.years-o.years),n=t.filter(i=>i.protMonths>0).sort((i,o)=>o.protMonths-i.protMonths),s=e.length>0?e.slice(0,5):n.slice(0,5);if(s.length===0)return"";let r=`
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
      `;return s.forEach(i=>{const o=i.startYear||i.seed,a=u1[o]||"-",c=i.failed?"danger":"success";r+=`
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
      `,r}function Hn(t){return`<span class="hlp" tabindex="0" data-tip="${String(t).replace(/"/g,"&quot;")}">?</span>`}function f1(){if(window.__helpTipInit)return;window.__helpTipInit=!0;const t=document.createElement("div");t.className="help-tip",t.style.display="none",document.body.appendChild(t);let e=null;const n=r=>{const i=r.getAttribute("data-tip");if(!i)return;clearTimeout(e),t.textContent=i,t.style.display="block";const o=r.getBoundingClientRect(),a=Math.min(260,window.innerWidth-24);t.style.width=a+"px";let c=o.left+o.width/2-a/2+window.scrollX;c=Math.max(12+window.scrollX,Math.min(c,window.scrollX+window.innerWidth-a-12)),t.style.left=c+"px";const d=t.offsetHeight;let h=o.top+window.scrollY-d-8;o.top<d+12&&(h=o.bottom+window.scrollY+8),t.style.top=h+"px"},s=()=>{e=setTimeout(()=>{t.style.display="none"},80)};window.__hideHelpTip=()=>{clearTimeout(e),t.style.display="none"},document.addEventListener("mouseover",r=>{const i=r.target.closest&&r.target.closest("[data-tip]");i&&n(i)}),document.addEventListener("mouseout",r=>{r.target.closest&&r.target.closest("[data-tip]")&&s()}),document.addEventListener("focusin",r=>{const i=r.target.closest&&r.target.closest("[data-tip]");i&&n(i)}),document.addEventListener("focusout",r=>{r.target.closest&&r.target.closest("[data-tip]")&&s()}),document.addEventListener("click",r=>{const i=r.target.closest&&r.target.closest("[data-tip]");i&&(t.style.display==="block"?s():n(i))})}function p1(){if(window.__chartHoverInit)return;window.__chartHoverInit=!0;const t=e=>e.querySelectorAll("circle[data-tip]").forEach(n=>{n.setAttribute("fill","transparent"),n.removeAttribute("stroke")});document.addEventListener("mousemove",e=>{const n=e.target.closest&&e.target.closest(".ichart");if(!n)return;const s=n.querySelectorAll("circle[data-tip]");if(!s.length)return;let r=null,i=1/0;s.forEach(o=>{const a=o.getBoundingClientRect(),c=Math.abs(a.left+a.width/2-e.clientX);c<i&&(i=c,r=o)}),r&&(t(n),r.setAttribute("fill","#60a5fa"),r.setAttribute("stroke","var(--surface,#161b22)"),r.setAttribute("stroke-width","2"),r.dispatchEvent(new MouseEvent("mouseover",{bubbles:!0})))}),document.addEventListener("mouseout",e=>{const n=e.target.closest&&e.target.closest(".ichart");n&&(!e.relatedTarget||!n.contains(e.relatedTarget))&&(t(n),window.__hideHelpTip&&window.__hideHelpTip())})}const tr=t=>"£"+Math.round(t).toLocaleString();function Hy(t,e,n){return`<svg class="ichart" viewBox="0 0 ${e} ${n}" style="width:100%;height:auto;overflow:visible;display:block" role="img">${t}</svg>`}function Wy(t,{max:e,valueFmt:n=tr,tip:s,pct:r=!1}={}){const m=t.length;if(m<2)return"";const f=e??(r?100:Math.max(1,...t)),y=R=>56+R/(m-1)*590,T=R=>174-Math.max(0,Math.min(r?100:1/0,R))/f*160,E=t.map((R,B)=>`${y(B).toFixed(1)},${T(R).toFixed(1)}`).join(" "),x=`56,${174 .toFixed(1)} ${E} ${y(m-1).toFixed(1)},${174 .toFixed(1)}`,C=r?[0,50,100]:[0,f/2,f],P=[0,Math.floor((m-1)/2),m-1],D=s||((R,B)=>`Year ${B}: ${n(R)}`);return Hy(C.map(R=>`<line x1="56" y1="${T(R).toFixed(1)}" x2="646" y2="${T(R).toFixed(1)}" stroke="var(--border,#8883)" opacity=".45"/><text x="50" y="${(T(R)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${n(R)}</text>`).join("")+`<polygon points="${x}" fill="rgba(96,165,250,.13)"/><polyline points="${E}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.map((R,B)=>`<circle cx="${y(B).toFixed(1)}" cy="${T(R).toFixed(1)}" r="8" fill="transparent" data-tip="${D(R,B).replace(/"/g,"&quot;")}"></circle>`).join("")+P.map(R=>`<text x="${y(R).toFixed(1)}" y="192" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${R}</text>`).join(""),660,200)}function m1(t){const a=t.p50.length;if(a<2)return"";const c=Math.max(1,...t.p90),d=E=>60+E/(a-1)*606,h=E=>222-Math.max(0,E)/c*208,m=(E,x)=>E.map((C,P)=>`${d(P).toFixed(1)},${h(C).toFixed(1)}`).concat(x.map((C,P)=>`${d(a-1-P).toFixed(1)},${h(x[a-1-P]).toFixed(1)}`)).join(" "),f=E=>E.map((x,C)=>`${d(C).toFixed(1)},${h(x).toFixed(1)}`).join(" "),y=[0,c/4,c/2,3*c/4,c],T=[0,Math.floor((a-1)/2),a-1];return Hy(y.map(E=>`<line x1="60" y1="${h(E).toFixed(1)}" x2="666" y2="${h(E).toFixed(1)}" stroke="var(--border,#8883)" opacity=".4"/><text x="54" y="${(h(E)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${tr(E)}</text>`).join("")+`<polygon points="${m(t.p90,t.p10)}" fill="rgba(96,165,250,.12)"/><polygon points="${m(t.p75,t.p25)}" fill="rgba(96,165,250,.22)"/><polyline points="${f(t.p50)}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.p50.map((E,x)=>`<circle cx="${d(x).toFixed(1)}" cy="${h(E).toFixed(1)}" r="8" fill="transparent" data-tip="Year ${x}: middle ${tr(E)}; likely range ${tr(t.p10[x])} to ${tr(t.p90[x])}"></circle>`).join("")+T.map(E=>`<text x="${d(E).toFixed(1)}" y="242" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${E}</text>`).join(""),680,250)}function g1(t){if(!t||!t.funded)return"";const e=r=>(r||0).toFixed(r>=10?0:1),n=t.pctSurviveFullTerm>=80?"success":t.pctSurviveFullTerm>=50?"warning":"danger",s=t.avgHigherRateYears<1?"success":t.avgHigherRateYears<4?"warning":"danger";return`
        <h3 style="margin:24px 0 4px;">Your tax-free ISA bridge</h3>
        <p style="color:var(--text-muted);font-size:12px;margin:0 0 12px;">
          The ISA (starting at ${j(t.startBalance)}) is drawn tax-free to top your income up, keeping you out of higher-rate tax. Modelled as a steady money-market fund.
        </p>
        <div class="keynums">
          <div class="keynum ${n}">
            <div class="kn-val">${t.pctSurviveFullTerm.toFixed(0)}%</div>
            <div class="kn-label">of futures the ISA still has real money at the end ${Hn("The ISA is treated as used up once its value in present-day money falls below 5% of what you started with — money-market growth leaves a tiny nominal sliver forever, so an exactly-zero test would be misleading.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${e(t.medianLastedYears)} yrs</div>
            <div class="kn-label">the ISA typically lasts before it's used up ${Hn("Median year its value in present-day money drops below 5% of the starting balance — the point it stops meaningfully topping up your income. Matches the chart below.")}</div>
          </div>
          <div class="keynum ${s}">
            <div class="kn-val">${e(t.avgHigherRateYears)} yrs</div>
            <div class="kn-label">typically paying 40% (higher-rate) tax ${Hn("Years you pay higher-rate income tax because the ISA has run out and income must come from the taxable pension above the basic-rate limit. A bigger ISA reduces these.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${j(t.medianTotalTax)}</div>
            <div class="kn-label">typical lifetime income tax, today's money ${Hn("Median total income tax paid over the whole plan, in present-day spending power.")}</div>
          </div>
        </div>
        <div style="margin-bottom:8px;">
          <div class="chart-caption">Typical ISA balance still to hand, year by year (today's money — hover a point for the figure). A slow, steady fall means it's being drawn as intended; a flat line means it's barely touched (larger than this plan needs); a drop to £0 marks when it typically runs out.</div>
          ${Wy(t.medianIsaByYear,{valueFmt:tr,tip:(r,i)=>`Year ${i}: typically ${tr(r)} of ISA left`})}
        </div>`}function y1(t){return t==="sequence"?"The failing futures were sunk by a bad first few years of markets. Holding a bigger cash/bond buffer for the early years, or starting with a slightly lower withdrawal, would let the plan ride out an early slump.":t==="inflation"?"The failing futures were driven by high inflation eroding your spending power. More inflation protection (e.g. index-linked gilts) and less plain cash would help — cash loses to inflation over time.":t==="market"?"The failing futures simply had weak markets throughout. A slightly lower withdrawal rate, or more growth assets (equities) accepting more short-term ups and downs, gives more headroom.":"Lowering your target income, delaying the start, or a larger starting pot would all raise the odds."}function v1(t,e){const n=t.severity||{},s=t.successRate,r=s>=90?{t:"Very likely to last",c:"success"}:s>=75?{t:"Likely to last — with some risk",c:"success"}:s>=50?{t:"At real risk of running out",c:"warning"}:{t:"Unlikely to last as planned",c:"danger"};let i=`<div class="verdict verdict-${r.c}">
        <div class="verdict-title">Will your money last? — ${r.t}</div>
        <div class="verdict-heroes">
          <div><span class="hero">${s.toFixed(0)}%</span>
            <span class="hero-sub">chance your money lasts the whole plan ${Hn("Out of "+e+", the share where your pot never runs out before the end of the plan. Higher is better.")}</span></div>
          <div><span class="hero" style="font-size:30px;">${(n.coverage||0).toFixed(0)}%</span>
            <span class="hero-sub">of retirement years funded (coverage) ${Hn('The average share of retirement years your plan pays for, across every simulated future — so a plan that funds 34 of 35 years scores 97%, and a late shortfall counts far less than an early one. Based on the retirement "coverage ratio" (Estrada & Kritzman, 2019). Note: it is capped at 100% and ignores any money left over, and it is an average — check the worst-case minimum below.')}</span></div>
        </div>
        <div class="verdict-basis">Based on ${e}. Pot and income values are shown in today's money.</div>
      </div>`;return n.failCount>0&&(i+=`<div class="callout">
          <div class="callout-title">Why it might fall short</div>
          <p>${n.diagnosis}</p>
          <p class="lever"><strong>What could help:</strong> ${y1(n.primaryDriver)}</p>
        </div>`),i}function Yy(t,e,n,s,r){f1(),p1();const i=t.survival||{},o=t.finalReal||{},a=t.protection||{},c=a.pctWithProtection!=null?a.pctWithProtection:(a.runsWithProtection||0)/(e.length||1)*100,d=s==="mcResults",h=d?`${e.length.toLocaleString()} simulated futures`:`${e.length} historical periods since 1928`;let m=`
        <div class="card">
          <h2>${n}</h2>

          ${v1(t,h)}

          <div class="keynums">
            <div class="keynum">
              <div class="kn-val">${Math.round(i.min||0)} / ${r} yrs</div>
              <div class="kn-label">worst simulated future — money lasted this long ${Hn("The single unluckiest of all the simulated futures — the true tail. The average coverage can look reassuring; this is the worst it ever got. (10th-percentile: at least "+(i.p10||0).toFixed(0)+" years.)")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${j(o.p50||0)}</div>
              <div class="kn-label">typically left at the end, today's money ${Hn("The middle outcome for the pension pot left at the end, in present-day spending power. Futures that ran out count as £0, so this is not flattered by only the lucky runs.")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${c.toFixed(0)} in 100</div>
              <div class="kn-label">futures where the plan had to cut back spending ${Hn("To ride out a market slump the plan temporarily reduces withdrawals. This is how often that safety response was needed.")}</div>
            </div>
          </div>

          <h3 style="margin:8px 0 4px;">How your pot changes over time (today's money)</h3>
          <div class="chart-caption">The blue line is the middle outcome; the darker band is the middle half of futures, the lighter band the 10th–90th. Futures that ran out count as £0, so a sinking band means real risk. Hover any point for the figures.</div>
          ${m1(t.chartData.potBand)}

          <h3 style="margin:22px 0 4px;">Chance your plan is still going, year by year</h3>
          <div class="chart-caption">Share of futures in which the money hasn't run out yet — starts at 100% and dips where plans tend to fail. A late dip means most shortfalls happen late.</div>
          ${Wy(t.chartData.solvency,{pct:!0,valueFmt:f=>f.toFixed(0)+"%",tip:(f,y)=>`Year ${y}: ${f.toFixed(0)}% of plans still going`})}

          ${g1(t.isa)}

          <details style="margin-top:22px;">
            <summary style="cursor:pointer;font-weight:600;color:var(--primary);">More detail — worst historical periods &amp; full statistics</summary>
            <div style="margin-top:16px;">
              ${s==="histResults"?h1(e):""}

              <h4 style="margin:20px 0 8px;">Pot left at the end — full range (today's money)</h4>
              <div class="grid-7" style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;">
                ${[["p5","unluckiest 5%"],["p10","10%"],["p25","25%"],["p50","middle"],["p75","75%"],["p90","90%"],["p95","luckiest 5%"]].map(([f,y])=>`
                  <div class="stat-box mini">
                    <div class="stat-value" style="font-size:13px;">${j(o[f]||0)}</div>
                    <div class="stat-label" style="font-size:10px;">${y}</div>
                  </div>`).join("")}
              </div>
              <p style="font-size:12px;color:var(--text-muted);margin-top:14px;line-height:1.6;">
                Based on ${h}. ${d?"Monte Carlo builds each future by stitching together random 5-year blocks of real history (1928–2024), so market slumps and inflation spikes arrive in realistic sustained runs rather than one-off years.":"Each run replays an actual stretch of history in its real order, capturing the true sequence of good and bad years."}
                A future "runs out" when the pension/cash pots hit zero before the plan ends.
              </p>
            </div>
          </details>
        </div>
      `;document.getElementById(s).innerHTML=m}function b1(t,e){let n='<div class="card"><h2>Scenario Analysis</h2>';n+=`
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
        `}n+="</div></div>",document.getElementById(e).innerHTML=n,setTimeout(()=>{const s=document.getElementById("scenCompChart");s&&t&&n1(s,t,{years:35,title:"Scenario Comparison"})},50)}const Sl={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,diversifiers:.12,cash:.13},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.3,diversifiers:.15,cash:.05},adventurous:{key:"adventurous",label:"Adventurous",equity:.65,bond:.15,diversifiers:.15,cash:.05}};function Gy(t){const e=document.getElementById(t+"Diversifiers");return!!(e&&e.checked)}window._customAlloc=window._customAlloc||{};window._allocMode=window._allocMode||{};function Pu(t){return window._allocMode[t]||"risk"}function jy(t){if(window._customAlloc[t])return window._customAlloc[t];const e=document.querySelector("#"+t+"Risks .risk-card.active"),n=e&&e.dataset.risk||"balanced",s=Gy(t)?Sl:Zn;return s[n]||s.balanced}function Ky(t,e,n,s){s=s||0;const r=s>.001?Sl:Zn;let i="balanced",o=1/0;for(const a in r){const c=r[a],d=(c.equity-t)**2+(c.bond-e)**2+((c.diversifiers||0)-s)**2+(c.cash-n)**2;d<o&&(o=d,i=a)}return i}window.renderModelPortfolio=function(t){var c,d;const e=document.getElementById(t+"ModelPortfolio");if(!e)return;const n=document.querySelector("#"+t+"Risks .risk-card.active"),s=n?n.dataset.risk:"balanced",r=!!((c=document.getElementById(t+"Diversifiers"))!=null&&c.checked),i=!!((d=document.getElementById(t+"EquityGlide"))!=null&&d.checked),o=sx(s,{diversifiers:r});let a='<div class="table-scroll-container"><table><thead><tr><th>Example fund</th><th>Job in the mix</th><th>%</th></tr></thead><tbody>';for(const h of o.rows)a+="<tr><td><strong>"+h.ticker+'</strong> <span class="hint">'+h.name+'</span></td><td style="font-size:13px;">'+h.job+'</td><td style="font-weight:600;">'+h.pct+"%</td></tr>";a+="</tbody></table></div>",i&&(a+='<p class="hint" style="margin:6px 0 0;">Bond tent is ON: the shares/bonds SPLIT shifts over the years — the instruments stay the same, you would just hold different amounts of each.</p>'),a+='<p class="hint" style="margin:6px 0 0;">'+o.note+"</p>",e.innerHTML=a};window.updateAllocDisplay=function(t){const e=jy(t),n=Math.round(e.equity*100),s=Math.round(e.bond*100),r=Math.round(e.cash*100),i=Math.round((e.diversifiers||0)*100),o=document.getElementById(t+"AllocAmounts"),a=window._customAlloc[t],c=document.getElementById(t+"Pot");if(a&&c){const N=Math.round((a.equityMin||0)+(a.bondMin||0)+(a.cashTarget||0)+(a.diversifierStart||0));+c.value!==N&&(c.value=N,c._updateOverlay&&c._updateOverlay());const w=document.getElementById(t+"PotDisplay");w&&(w.textContent="£"+N.toLocaleString())}const d=+document.getElementById(t+"Pot").value||0,h=a?a.equityMin:Math.round(d*n/100),m=a?a.bondMin:Math.round(d*s/100),f=a?a.cashTarget:Math.round(d*r/100),y=a?a.diversifierStart||0:Math.round(d*i/100),T=i>0?" &middot; "+i+"% diversifiers":"",E=i>0?" &middot; £"+y.toLocaleString()+" diversifiers":"",x=Math.round(+(document.getElementById(t+"IsaBalance")||{}).value||0),C=x>0?'<br><span style="color:var(--text-muted);">+ £'+x.toLocaleString()+" ISA kept separate (the tax-free bridge)</span>":"";o&&(o.innerHTML="<strong>"+e.label+"</strong> &mdash; "+n+"% shares &middot; "+s+"% bonds"+T+" &middot; "+r+'% cash<br><span style="color:var(--text-muted);">£'+h.toLocaleString()+" shares &middot; £"+m.toLocaleString()+" bonds"+E+" &middot; £"+f.toLocaleString()+" cash</span>"+C);const P=document.getElementById(t+"EquityGlide"),D=!!(P&&P.checked),R=document.getElementById(t+"GlideEndgame");R&&(D&&a?(R.style.display="block",R.innerHTML=E1(t)):R.style.display="none");const B=document.getElementById(t+"GlideMinNote");B&&(D?(B.style.display="block",B.innerHTML=w1(t,e)):B.style.display="none")};function w1(t,e){const n=document.getElementById(t+"Duration"),s=n&&+n.value||35,r=Math.max(5,s-20),i=e.cash,o=e.diversifiers||0,a=1-i-o,c=window._customAlloc[t],d=!!c,h=d&&c.glideEndgame?c.glideEndgame:null,m=d?ly(e.equity,e.bond,h):hu(e.equity,e.bond),f=Math.round(a*m.start*100),y=Math.round(a*m.end*100),T=Math.round(a*(1-m.start)*100),E=Math.round(a*(1-m.end)*100),x=Math.round(i*100),C=Math.round(o*100),P=6,D=314,R=18,B=104,N=B-R,w=ae=>(B-ae*N).toFixed(1),v=(P+(D-P)*Math.min(1,r/s)).toFixed(1),I=w(i),_=w(i+o),S=w(i+o+a*(1-m.start)),A=w(i+o+a*(1-m.end)),b="#6366f1",Y="#14b8a6",ie="#94a3b8",q="#f59e0b",se=o>0?`<polygon points="${P},${I} ${D},${I} ${D},${_} ${P},${_}" fill="${q}"></polygon>`:"",ee=`<svg viewBox="0 0 320 122" style="width:100%;height:auto;display:block;" preserveAspectRatio="none"><polygon points="${P},${B} ${D},${B} ${D},${I} ${P},${I}" fill="${ie}"></polygon>`+se+`<polygon points="${P},${_} ${D},${_} ${D},${A} ${v},${A} ${P},${S}" fill="${Y}"></polygon><polygon points="${P},${S} ${v},${A} ${D},${A} ${D},${R} ${P},${R}" fill="${b}"></polygon><line x1="${v}" y1="${R}" x2="${v}" y2="${B}" stroke="rgba(148,163,184,0.9)" stroke-width="1" stroke-dasharray="3,2"></line></svg>`,ye=ae=>`<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${ae};vertical-align:middle;"></span>`,he=o>0?" · "+C+"% diversifiers":"",dt=o>0?" &nbsp; "+ye(q)+" Diversifiers":"",re=d?"Now (your funds)":"Starts",V=d?"Rises to"+(h&&h.label?" ("+h.label+")":""):"Then holds ("+e.label+")",xe=d?"rises from your holdings, levels off at year "+r:"reaches your mix at year "+r+", then holds";return'<div style="font-weight:600;margin-bottom:6px;">How your mix glides over '+s+" years</div>"+ee+'<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:3px;"><span>Now</span><span>'+xe+'</span></div><div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:8px;"><span><strong>'+re+"</strong><br>"+f+"% shares · "+T+"% bonds"+he+" · "+x+'% cash</span><span style="text-align:right;"><strong>'+V+"</strong><br>"+y+"% shares · "+E+"% bonds"+he+" · "+x+'% cash</span></div><div style="font-size:12px;margin-top:8px;">'+ye(b)+" Shares &nbsp; "+ye(Y)+" Bonds"+dt+" &nbsp; "+ye(ie)+" Cash</div>"}window.setRiskPreset=function(t,e){Zn[e]&&(window._allocMode[t]="risk",delete window._customAlloc[t],document.querySelectorAll("#"+t+"Risks .risk-card").forEach(n=>n.classList.toggle("active",n.dataset.risk===e)),updateAllocDisplay(t),renderModelPortfolio(t))};window.setAllocMode=function(t,e){window._allocMode[t]=e;const n=document.getElementById(t+"ModeRisk"),s=document.getElementById(t+"ModeFunds");n&&n.classList.toggle("active",e==="risk"),s&&s.classList.toggle("active",e==="funds");const r=document.getElementById(t+"RiskMode"),i=document.getElementById(t+"FundsMode");if(r&&(r.style.display=e==="risk"?"":"none"),i&&(i.style.display=e==="funds"?"":"none"),e==="funds")renderFunds(t),Mu(t);else if(delete window._customAlloc[t],!document.querySelector("#"+t+"Risks .risk-card.active")){const o=document.querySelector("#"+t+'Risks .risk-card[data-risk="balanced"]');o&&o.classList.add("active")}updateAllocDisplay(t),typeof updateEntryTagPrompt=="function"&&updateEntryTagPrompt()};function E1(t){const e=window._customAlloc[t]&&window._customAlloc[t].glideEndgame&&window._customAlloc[t].glideEndgame.key||"",n=(s,r)=>'<button type="button" class="risk-btn'+(e===s?" active":"")+`" style="padding:6px 12px;" onclick="setGlideEndgame('`+t+"','"+s+`')">`+r+"</button>";return'<div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;"><strong>Glide towards</strong> — your funds are the start; the tent raises shares over time to this level:</div><div style="display:flex;gap:8px;flex-wrap:wrap;">'+n("cautious","Cautious")+n("balanced","Balanced")+n("adventurous","Adventurous")+"</div>"}window.setGlideEndgame=function(t,e){const n=window._customAlloc[t];if(!n)return;const r=(Gy(t)?Sl:Zn)[e];if(!r)return;n.glideEndgame={equityPct:r.equity,bondPct:r.bond,key:e,label:r.label};const i=n.equity/(n.equity+n.bond||1);r.equity/(r.equity+r.bond||1)<=i&&showToast("That endgame isn’t more share-heavy than your holdings — the glide would flatten or decline, not rise.","warning",5e3),updateAllocDisplay(t)};window.readAlloc=function(t){const e=window._customAlloc[t];if(e){const o={equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget};return e.diversifierStart>0&&(o.diversifierStart=e.diversifierStart),e.subAsset&&(o.subAsset=e.subAsset),e.glideEndgame&&(o.glideEndgame=e.glideEndgame),o}const n=+document.getElementById(t+"Pot").value||0,s=jy(t),r={equityMin:Math.round(n*s.equity),bondMin:Math.round(n*s.bond),cashTarget:Math.round(n*s.cash)},i=s.diversifiers||0;return i>0&&(r.diversifierStart=Math.round(n*i),r.subAsset={}),r};window.writeAlloc=function(t,e,n,s,r){const i=+r||0,o=(+e||0)+(+n||0)+(+s||0)+i;document.getElementById(t+"Pot").value=Math.round(o);const a=document.getElementById(t+"Diversifiers");a&&(a.checked=i>0);const c=o>0?Math.round((+e||0)/o*100):50,d=o>0?Math.round((+n||0)/o*100):40,h=o>0?Ky((+e||0)/o,(+n||0)/o,(+s||0)/o,i/o):"balanced";document.querySelectorAll("#"+t+"Risks .risk-card").forEach(f=>f.classList.toggle("active",f.dataset.risk===h)),updateAllocDisplay(t);const m=(i>0?Sl:Zn)[h];if(o>0&&(c!==Math.round(m.equity*100)||d!==Math.round(m.bond*100))){const f=document.getElementById(t+"AllocAmounts");f&&(f.innerHTML+='<div style="margin-top:8px;color:#b45309;font-size:12px;">Your saved split ('+c+"% / "+d+"% / "+Math.max(0,100-c-d)+"%) was matched to the nearest risk level (<strong>"+m.label+"</strong>). Pick another if you prefer — saving keeps this one.</div>")}};window._taggedFunds=window._taggedFunds||{};function Ht(t){return window._taggedFunds[t]=window._taggedFunds[t]||[]}const Ru={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};function mr(t,e=!1){const n=document.getElementById(t+"FundCatalogue");n&&(e||!n.childElementCount)&&(n.innerHTML=El().map(s=>'<option value="'+s.ticker+'">'+s.ticker+" — "+s.name+"</option>").join(""))}function qc(t){const e=(t.ticker||"").toUpperCase().trim(),n=ei(e);return t.subClass||n&&n.subClass||sy[e]||""}window.reformatMoney=function(t){const e=parseFloat(String(t.value).replace(/[^0-9.]/g,""));t.value=isNaN(e)||e===0?"":Su(e)};function _1(t,e,n){if(t=t.toLowerCase().trim(),!t)return 0;const s=e.toLowerCase(),r=n.toLowerCase();if(s===t)return 1e3;if(s.startsWith(t))return 900-(s.length-t.length);if(r.split(/[^a-z0-9]+/).filter(Boolean).some(a=>a.startsWith(t)))return 820;if(s.includes(t))return 720;if(r.includes(t))return 660-Math.min(50,r.indexOf(t));const o=a=>{let c=0;for(const d of a)if(d===t[c]&&c++,c===t.length)return!0;return!1};return o(s)?360:o(r)?300:0}function T1(t,e=8){return El().map(n=>({f:n,s:_1(t,n.ticker,n.name)})).filter(n=>n.s>0).sort((n,s)=>s.s-n.s||n.f.ticker.localeCompare(s.f.ticker)).slice(0,e).map(n=>n.f)}window.showFundSearch=function(t,e){const n=document.getElementById(t+"FundSearchResults");if(!n)return;const s=T1(e);if(!e.trim()||!s.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=s.map(r=>`<div class="fund-search-item" onmousedown="addFundFromSearch('`+t+"','"+r.ticker+`')" style="padding:7px 10px; cursor:pointer;"><strong>`+r.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+r.name+"</span></div>").join(""),n.style.display="block"};window.hideFundSearch=function(t){const e=document.getElementById(t+"FundSearchResults");e&&(e.style.display="none")};window.addFundFromSearch=function(t,e){const n=ei(e);Ht(t).push({ticker:e,value:"",wrapper:"SIPP",subClass:n?n.subClass:""});const s=document.getElementById(t+"FundSearch");s&&(s.value=""),hideFundSearch(t),renderFunds(t)};function I1(t,e,n){const s=ry();let r='<option value="">— not set —</option>';for(const i of["shares","bonds","diversifiers","cash"]){const o=s[i]||[];o.length&&(r+='<optgroup label="'+Ru[i]+'">'+o.map(a=>'<option value="'+a.key+'"'+(a.key===n?" selected":"")+">"+a.label+"</option>").join("")+"</optgroup>")}return`<select onchange="updateFundField('`+t+"',"+e+`,'subClass',this.value)" style="width:190px;">`+r+"</select>"}function S1(t){const e=encodeURIComponent((t||"").toUpperCase().trim()),n=(s,r)=>'<a href="'+s+'" target="_blank" rel="noopener" style="margin-right:8px;">'+r+"</a>";return'<div style="font-size:11px; margin-top:3px; color:var(--text-muted);">Not in our list — how is it invested? Look it up: '+n("https://markets.ft.com/data/search?query="+e,"FT")+n("https://www.morningstar.co.uk/uk/util/SecuritySearchResults.aspx?search="+e,"Morningstar")+n("https://www.justetf.com/uk/search.html?query="+e,"justETF")+"then pick a category.</div>"}function Qy(t,e,n){const s=(n.ticker||"").toUpperCase().trim(),r=s&&!ei(s);return I1(t,e,qc(n))+(r?S1(s):"")}window.renderFunds=function(t){const e=document.getElementById(t+"FundRows");e&&(mr(t),e.innerHTML=Ht(t).map((n,s)=>'<tr><td style="padding:3px 6px;"><input type="text" list="'+t+'FundCatalogue" value="'+(n.ticker||"")+`" oninput="updateFundField('`+t+"',"+s+`,'ticker',this.value)" style="width:92px;text-transform:uppercase;" placeholder="e.g. VWRL"></td><td style="padding:3px 6px;"><input type="text" inputmode="numeric" value="`+(n.value?Su(n.value):"")+`" oninput="updateFundField('`+t+"',"+s+`,'value',this.value)" onblur="reformatMoney(this)" style="width:110px;" placeholder="0"></td><td style="padding:3px 6px;"><select onchange="updateFundField('`+t+"',"+s+`,'wrapper',this.value)" style="width:74px;"><option`+(n.wrapper!=="ISA"?" selected":"")+">SIPP</option><option"+(n.wrapper==="ISA"?" selected":"")+'>ISA</option></select></td><td id="'+t+"_fcat_"+s+'" style="padding:3px 6px;">'+Qy(t,s,n)+`</td><td style="padding:3px 6px;"><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="removeFund('`+t+"',"+s+')">&times;</button></td></tr>').join(""),Jy(t))};window.updateFundField=function(t,e,n,s){const r=Ht(t)[e];if(r){if(n==="value")r.value=parseFloat(String(s).replace(/[^0-9.]/g,""))||0;else if(n==="ticker"){r.ticker=s;const i=ei(s);i&&(r.subClass=i.subClass);const o=document.getElementById(t+"_fcat_"+e);o&&(o.innerHTML=Qy(t,e,r))}else n==="subClass"?(r.subClass=s,s&&r.ticker&&!ei(r.ticker)&&xA({ticker:r.ticker,name:"",subClass:s})):r[n]=s;Jy(t)}};window.addFundRow=function(t){Ht(t).push({ticker:"",value:"",wrapper:"SIPP"}),renderFunds(t)};window.removeFund=function(t,e){Ht(t).splice(e,1),renderFunds(t)};window.clearFunds=function(t){window._taggedFunds[t]=[],renderFunds(t)};function Jy(t){const e=document.getElementById(t+"FundSummary");if(!e)return;const n=Ht(t).filter(d=>d.ticker&&d.value>0);if(!n.length){e.innerHTML='<span style="color:var(--text-muted);font-size:12px;">Add holdings above to see the bucket roll-up.</span>';return}const s=wl(n),r=s.total-s.isaTotal,i=d=>r?Math.round(s.buckets[d]/r*100):0,o=d=>"£"+Math.round(d).toLocaleString(),a=d=>Object.entries(d).map(([h,m])=>Vt[h].label+" "+Math.round(m*100)+"%").join(" · ");let c='<div style="font-weight:600;margin-bottom:6px;">Rolls up to '+o(r)+" pot"+(s.isaTotal?" + "+o(s.isaTotal)+" ISA (separate tax-free bridge, modelled at its own tagged mix)":"")+"</div>";c+='<div style="font-size:13px;">';for(const d of["shares","bonds","diversifiers","cash"])s.buckets[d]&&(c+="<div><strong>"+Ru[d]+"</strong>: "+o(s.buckets[d])+" ("+i(d)+"%)"+(d==="bonds"&&Object.keys(s.bondWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+a(s.bondWeights)+"</span>":"")+(d==="diversifiers"&&Object.keys(s.diversifierWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+a(s.diversifierWeights)+"</span>":"")+"</div>");c+="</div>",s.untagged.length&&(c+='<div style="color:#b45309;font-size:12px;margin-top:6px;">Not recognised (ignored): '+s.untagged.map(d=>d.ticker).join(", ")+"</div>"),e.innerHTML=c,Pu(t)==="funds"&&(Mu(t),updateAllocDisplay(t))}function Mu(t){const e=Ht(t).filter(c=>c.ticker&&c.value>0);if(!e.length)return delete window._customAlloc[t],null;const n=wl(e),s=$x(n),r=window._customAlloc[t]||{};window._customAlloc[t]={label:"Your funds",equity:n.total?n.buckets.shares/n.total:0,bond:n.total?n.buckets.bonds/n.total:0,diversifiers:n.total?n.buckets.diversifiers/n.total:0,cash:n.total?n.buckets.cash/n.total:0,equityMin:s.equityStart,bondMin:s.bondStart,cashTarget:s.cashStart,diversifierStart:s.diversifierStart||0,subAsset:s.subAsset||null,glideEndgame:r.glideEndgame||null};const i=document.getElementById(t+"Pot");i&&(i.value=Math.round(n.total-n.isaTotal),i._updateOverlay&&i._updateOverlay());const o=document.getElementById(t+"Diversifiers");o&&(o.checked=(s.diversifierStart||0)>0);const a=document.getElementById(t+"IsaBalance");return a&&(a.value=Math.round(n.isaTotal||0),a._updateOverlay&&a._updateOverlay()),n}window.applyTaggedPortfolio=function(t){if(window._allocMode[t]="funds",!Mu(t)){showToast("Add some holdings first","warning");return}updateAllocDisplay(t)};window.restoreCustomAllocFromSettings=function(t,e){if(e&&e.subAsset&&e.subAsset.bondWeights&&Object.keys(e.subAsset.bondWeights).length){const n=(e.equityMin||0)+(e.bondMin||0)+(e.cashTarget||0)+(e.diversifierStart||0);window._customAlloc[t]={label:"Your funds",equity:n?e.equityMin/n:0,bond:n?e.bondMin/n:0,diversifiers:n?(e.diversifierStart||0)/n:0,cash:n?e.cashTarget/n:0,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset,glideEndgame:e.glideEndgame||null}}else delete window._customAlloc[t]};function x1(t){const e={shares:[],bonds:[],diversifiers:[],cash:[]},n=[];t.tagged.forEach(o=>{(o.wrapper||"").toUpperCase()==="ISA"?n.push(o):e[o.bucket]&&e[o.bucket].push(o)});const s=o=>"£"+Math.round(o).toLocaleString(),r={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};let i='<div style="font-size:12px;border:1px solid var(--border,#cbd5e1);border-radius:8px;padding:10px 12px;">';i+='<div style="font-weight:600;margin-bottom:6px;">Which of your funds went where</div>';for(const o of["shares","bonds","diversifiers","cash"]){if(!e[o].length)continue;const a=e[o].reduce((c,d)=>c+(+d.value||0),0);i+='<div style="margin:3px 0;"><strong>'+r[o]+"</strong> "+s(a)+': <span style="color:var(--text-muted);">'+e[o].map(c=>c.ticker).join(", ")+"</span></div>"}return n.length&&(i+='<div style="margin:3px 0;"><strong>ISA (separate tax-free pool)</strong> '+s(t.isaTotal)+': <span style="color:var(--text-muted);">'+n.map(o=>o.ticker).join(", ")+"</span></div>"),t.untagged.length&&(i+='<div style="color:#b45309;margin-top:4px;">Not recognised: '+t.untagged.map(o=>o.ticker).join(", ")+"</div>"),i+="</div>",i}window._fundModal={fieldId:null,subtotal:0};window.openFundBucketModal=function(t,e,n){const s=Ht("ds").filter(i=>{const o=qc(i);return i.ticker&&o&&Vt[o]&&Vt[o].bucket===t});window._fundModal={fieldId:e,subtotal:0},document.getElementById("fundModalTitle").textContent=n;const r=document.getElementById("fundModalRows");s.length?r.innerHTML=s.map(i=>{const o=ei(i.ticker),a=Vt[qc(i)],c=o?o.name:a?a.label:"";return'<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin:8px 0;"><span><strong>'+i.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+c+'</span></span><span style="white-space:nowrap;">£ <input type="number" class="fund-modal-input" oninput="updateFundModalSubtotal()" style="width:120px;" placeholder="0"></span></div>'}).join(""):r.innerHTML='<p style="color:var(--text-muted);">No '+n.toLowerCase()+" tagged yet. Define your holdings in <strong>Settings → Build from my funds</strong>, then come back — or just type the total into the box.</p>",updateFundModalSubtotal(),document.getElementById("fundBucketModal").style.display="flex"};window.updateFundModalSubtotal=function(){let t=0;document.querySelectorAll("#fundModalRows .fund-modal-input").forEach(e=>{t+=+e.value||0}),window._fundModal.subtotal=t,document.getElementById("fundModalSubtotal").textContent="Total: £"+Math.round(t).toLocaleString()};window.applyFundBucketModal=function(){const t=document.getElementById(window._fundModal.fieldId);t&&(t.value=Math.round(window._fundModal.subtotal||0)),closeFundBucketModal()};window.closeFundBucketModal=function(){document.getElementById("fundBucketModal").style.display="none"};window.updateEntryTagPrompt=function(){const t=document.getElementById("entryTagPrompt");if(!t)return;if(Ht("ds").filter(n=>n.ticker).length>0){t.style.display="none",t.innerHTML="";return}t.style.display="block",t.innerHTML='<div class="alert alert-info" style="font-size:13px;">The Decision Tool works from your real portfolio. Tag your funds in <strong>Settings → “Build from my funds”</strong> to enter values per fund via the <em>enter per fund ▸</em> links. You can still type bucket totals directly.</div>'};window.fillDecisionFromTaggedFunds=async function(){let t=Ht("ds").filter(r=>r.ticker&&r.value>0);if(t.length||(t=Ht("ss").filter(r=>r.ticker&&r.value>0)),!t.length)try{t=((await qe()).taggedFunds||[]).filter(i=>i.ticker&&i.value>0)}catch{}if(!t.length){showToast('No tagged funds yet — tag your holdings in Settings → "Build from my funds", then come back.',"info",6e3);return}const e=wl(t),n=(r,i)=>{const o=document.getElementById(r);o&&(o.value=Math.round(i))};n("entryEquity",e.buckets.shares),n("entryBond",e.buckets.bonds),n("entryCash",e.buckets.cash),n("entryDiversifier",e.buckets.diversifiers),e.isaTotal&&n("entryIsa",e.isaTotal);const s=document.getElementById("entryFundTagHelp");s&&(s.innerHTML=x1(e)),showToast("Filled your fund values from "+t.length+" tagged funds","success")};function Xy(t,e){const n=(t.equityMin||0)+(t.bondMin||0)+(t.cashTarget||0),s=n>0?Ky(t.equityMin/n,t.bondMin/n,t.cashTarget/n):"balanced",r=Zn[s],i=a=>"£"+Math.round(a||0).toLocaleString(),o=Math.round(r.equity*100)+"/"+Math.round(r.bond*100)+"/"+Math.round(r.cash*100);return`<div class="rpt-header">
        <h1>Pension Decision Plan</h1>
        <div class="rpt-sub">${e||""}</div>
        <table class="rpt-meta"><tbody>
          <tr><td>Total pot</td><td>${i(n)}</td><td>Risk level</td><td>${r.label} (${o})</td></tr>
          <tr><td>Bond tent</td><td>${t.equityGlideEnabled?"On — rising-equity glidepath":"Off"}</td><td>Target income</td><td>${i(t.baseSalary)}/yr</td></tr>
          <tr><td>Duration</td><td>${t.duration||35} yrs</td><td>Generated</td><td>${new Date().toLocaleDateString("en-GB")}</td></tr>
        </tbody></table>
      </div>`}function Zy(t){let e=document.getElementById("printPortal");e||(e=document.createElement("div"),e.id="printPortal",document.body.appendChild(e)),e.innerHTML=t,document.body.classList.add("printing"),window.print()}window.addEventListener("afterprint",()=>{document.body.classList.remove("printing");const t=document.getElementById("printPortal");t&&(t.innerHTML="")});function e0(t,e,n){const s=new Blob([e],{type:n}),r=URL.createObjectURL(s),i=document.createElement("a");i.href=r,i.download=t,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(r),1e3)}window.printAnnualReport=async function(t){const e=await Ze();Zy(Xy(e,"Annual report — tax year "+t)+document.getElementById("taxYearDetail").innerHTML)};window.printMonthlyReport=async function(t){const e=await Ze();Zy(Xy(e,"Monthly record — "+t)+document.getElementById("historyDetail").innerHTML)};window.exportAnnualCsv=function(t){const e=(typeof cn<"u"?cn:[]).filter(o=>o.taxYear===t).sort((o,a)=>(o.date||"").localeCompare(a.date||"")),n=o=>(o=o==null?"":String(o),/[",\n]/.test(o)?'"'+o.replace(/"/g,'""')+'"':o),s=o=>Math.round(o||0);let i=["Date","Draw source","SIPP draw","ISA draw","From equity","From bond","From cash","Protection","Equity target","Bond target","Cash target","Total pot","Rebalance"].map(n).join(",")+`
`;for(const o of e)i+=[o.date,o.source,s(o.sipp),s(o.isa),s(o.dEquity),s(o.dBond),s(o.dCash),o.inProtection?"Yes":"No",s(o.adjEquity),s(o.adjBond),s(o.adjCash),s(o.total),o.rebal||""].map(n).join(",")+`
`;e.length||(i+=`(no monthly records saved for this tax year yet)
`),e0("decision-plan-"+t.replace("/","-")+".csv",i,"text/csv;charset=utf-8;")};window.runCompareStrategiesUI=async function(t){const e=document.getElementById("optimiseBtn"+t),n=document.getElementById("optimiseResults"+t);e&&(e.disabled=!0,e.textContent="Comparing..."),n&&(n.innerHTML='<div class="loading"><div class="spinner"></div>Running six strategies…</div>');const s=JSON.parse(JSON.stringify(await qe())),r=document.getElementById(t==="MC"?"mcYears":"histYears"),i=parseInt(r&&r.value)||s.duration,o=(s.equityMin||0)+(s.bondMin||0)+(s.cashTarget||0),a=Object.keys(rr).map(Number).sort((f,y)=>f-y),c=Math.max(...a),d=f=>{const y=[];if(t==="MC")for(let P=0;P<1e3;P++)y.push(Zt(f,hr(f,P),P));else a.forEach(P=>{if(P+i-1>c)return;const D={equity:{},inflation:{}};for(let R=0;R<i;R++)D.equity[R]=rr[P+R]||0,D.inflation[R]=$a[P+R]||.025;y.push(Zt(f,D,P))});const T=y.length||1,E=y.reduce((P,D)=>P+Math.min(1,(D.years||0)/(D.duration||i)),0)/T*100,x=y.filter(P=>!P.failed).length/T*100,C=y.reduce((P,D)=>Math.min(P,D.years||0),1/0);return{coverage:E,rate:x,minYears:C===1/0?0:C}},h=["cautious","balanced","adventurous"],m={};for(const f of h){const y=Zn[f];m[f]={};for(const T of[!1,!0]){const E={...s,equityMin:Math.round(o*y.equity),bondMin:Math.round(o*y.bond),cashTarget:Math.round(o*y.cash),equityGlideEnabled:T},x=Ls({years:i},E);m[f][T?"tent":"flat"]=d(x),await new Promise(C=>setTimeout(C,0))}}A1(n,m,h),e&&(e.disabled=!1,e.textContent="Compare strategies")};function A1(t,e,n){let s={cov:-1,key:null,tent:null};for(const o of n)for(const a of["flat","tent"])e[o][a].coverage>s.cov&&(s={cov:e[o][a].coverage,key:o,tent:a});const r=(o,a)=>`<td style="text-align:center;padding:10px;border:1px solid var(--border);${a?"background:rgba(16,185,129,0.12);":""}">
          <div style="font-size:22px;font-weight:700;color:var(--${a?"success":"text"});">${o.coverage.toFixed(0)}%</div>
          <div style="font-size:11px;color:var(--text-muted);">worst case ${o.minYears.toFixed(0)} yrs</div>
        </td>`;let i='<h3 style="margin-bottom:6px;">Compare strategies</h3>';i+=`<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px;">Coverage = the share of your retirement years the pot funds (worst case = the fewest years it lasted in any run). More shares usually buys a little more coverage but a rougher ride; the bond tent mainly lifts the worst case. Pick the risk level you're comfortable holding — the tool won't change it for you.</p>`,i+='<table style="border-collapse:collapse;width:100%;max-width:520px;"><thead><tr><th style="text-align:left;padding:8px;"></th><th style="padding:8px;">Flat</th><th style="padding:8px;">+ Bond tent</th></tr></thead><tbody>';for(const o of n){const a=Zn[o];i+=`<tr><td style="padding:8px;border:1px solid var(--border);"><strong>${a.label}</strong><br><span style="font-size:11px;color:var(--text-muted);">${Math.round(a.equity*100)}/${Math.round(a.bond*100)}/${Math.round(a.cash*100)}</span></td>`,i+=r(e[o].flat,s.key===o&&s.tent==="flat"),i+=r(e[o].tent,s.key===o&&s.tent==="tent"),i+="</tr>"}i+="</tbody></table>",i+=`<p style="margin-top:12px;font-size:13px;">Best coverage: <strong>${Zn[s.key].label}${s.tent==="tent"?" + bond tent":""}</strong> at ${s.cov.toFixed(0)}%. Set it in Settings if you'd like it.</p>`,t&&(t.innerHTML=i)}window.updateNextStepBanner=async function(){var e;const t=document.getElementById("nextStepBanner");if(t)try{const n=await ul();if(!n||localStorage.getItem("nextStepDismissed:"+n)){t.style.display="none";return}const[s,r,i]=await Promise.all([No(),qe(),Ze()]),o=(s.lines||[]).some(y=>+y.annual>0),a=(r.baseSalary||0)>0,c=!!i.configured;let d=null,h=null,m=null;if(!o)d="Start here: walk through what retirement will actually cost — about 10 minutes, with typical UK figures when you're unsure.",h="Start the budget walk-through",m=()=>{switchToTab("budget"),setTimeout(()=>openBudgetWizard(),400)};else if(a)r.configured?c||(d="Your target is set and the Stress Tester is ready — when the long-term picture looks right, set up the monthly Decision Tool (it tells you what to draw, from where, each month).",h="Open the Decision Tool",m=()=>switchToTab("decision")):(d="Target set. Now the big question: can your pension actually pay for it? Open the Stress Tester settings, tell it what you have, and run the simulation.",h="Open Stress Tester settings",m=()=>{switchToTab("stress"),setTimeout(()=>{[...document.querySelectorAll("button")].filter(y=>/^Settings$/.test(y.textContent.trim())&&y.offsetParent).forEach(y=>y.click())},400)});else{const y=(e=s.derived)==null?void 0:e.allInComfortableMonthly;d="Your budget adds up"+(y?" to about "+W(Math.round(y))+"/mo take-home":"")+". Make it your plan's target, then see if your pension can pay for it.",h="Set as my plan's target",m=async()=>{await applyBudgetToPlan(),updateNextStepBanner()}}if(!d){t.style.display="none";return}document.getElementById("nextStepText").innerHTML=d;const f=document.getElementById("nextStepBtn");f.textContent=h,f.onclick=m,t.style.display="flex"}catch{t.style.display="none"}};window.dismissNextStep=async function(){try{localStorage.setItem("nextStepDismissed:"+await ul(),"1")}catch{}document.getElementById("nextStepBanner").style.display="none"};window.switchToTab=function(t){var e;(e=document.querySelector('.tab[data-tab="'+t+'"]'))==null||e.click()};window.renderExtraIncomes=function(t){const e=document.getElementById("ssExtraIncomes");if(!e)return;const n=window._ssExtraIncomes||[],s=window._ssWindfalls||[];let r="";n.forEach((i,o)=>{r+='<div class="row-flex" style="margin-top:6px;"><input type="text" placeholder="e.g. Part-time work" value="'+Te(i.label||"")+'" oninput="updExtraIncome('+o+`,'label',this.value)" style="flex:1 1 150px; min-width:120px;"><span class="hint">£/yr</span><input type="number" value="`+(i.annual??"")+'" oninput="updExtraIncome('+o+`,'annual',this.value)" style="width:100px;"><span class="hint">years</span><input type="number" placeholder="0" min="0" value="`+(i.startYear??"")+'" oninput="updExtraIncome('+o+`,'startYear',this.value)" style="width:64px;"><span class="hint">to</span><input type="number" placeholder="∞" min="0" value="`+(i.endYear??"")+'" oninput="updExtraIncome('+o+`,'endYear',this.value)" style="width:64px;"><select onchange="updExtraIncome(`+o+`,'indexation',this.value)" style="width:140px;"><option value="lpi5"`+((i.indexation||"lpi5")==="lpi5"?" selected":"")+'>CPI capped 5%</option><option value="cpi"'+(i.indexation==="cpi"?" selected":"")+'>Full CPI</option><option value="level"'+(i.indexation==="level"?" selected":"")+'>Level</option></select><button type="button" class="risk-btn" title="Remove" onclick="rmExtraIncome('+o+')">✕</button></div>'}),s.forEach((i,o)=>{r+='<div class="row-flex" style="margin-top:6px;"><input type="text" placeholder="e.g. Inheritance" value="'+Te(i.label||"")+'" oninput="updWindfall('+o+`,'label',this.value)" style="flex:1 1 150px; min-width:120px;"><span class="hint">£ once</span><input type="number" value="`+(i.amount??"")+'" oninput="updWindfall('+o+`,'amount',this.value)" style="width:110px;"><span class="hint">in year</span><input type="number" min="0" value="`+(i.year??"")+'" oninput="updWindfall('+o+`,'year',this.value)" style="width:64px;"><label class="hint" style="display:flex;align-items:center;gap:4px;"><input type="checkbox" style="width:auto;"`+(i.toIsa?" checked":"")+' onchange="updWindfall('+o+`,'toIsa',this.checked)">to ISA</label><button type="button" class="risk-btn" title="Remove" onclick="rmWindfall(`+o+')">✕</button></div>'}),e.innerHTML=r||'<p class="hint" style="margin:4px 0 0;">None yet — everything comes from the pots, State Pension and DB above.</p>'};window.addExtraIncome=function(){(window._ssExtraIncomes=window._ssExtraIncomes||[]).push({indexation:"lpi5"}),renderExtraIncomes()};window.addWindfall=function(){(window._ssWindfalls=window._ssWindfalls||[]).push({}),renderExtraIncomes()};window.updExtraIncome=function(t,e,n){var s;(s=window._ssExtraIncomes)!=null&&s[t]&&(window._ssExtraIncomes[t][e]=e==="label"||e==="indexation"?n:n===""?null:+n)};window.rmExtraIncome=function(t){window._ssExtraIncomes.splice(t,1),renderExtraIncomes()};window.updWindfall=function(t,e,n){var s;(s=window._ssWindfalls)!=null&&s[t]&&(window._ssWindfalls[t][e]=e==="label"?n:e==="toIsa"?!!n:n===""?null:+n)};window.rmWindfall=function(t){window._ssWindfalls.splice(t,1),renderExtraIncomes()};window.loadHouseholdUI=async function(){var t;try{const[e,n,s]=await Promise.all([ui(),ul(),IS()]),r=e.find(o=>o.id===n);document.getElementById("hhOwnPlan").value=((t=r==null?void 0:r.planDetails)==null?void 0:t.name)||"Current plan";const i=document.getElementById("hhPartnerSelect");i.innerHTML='<option value="">— choose a plan —</option>'+e.filter(o=>o.id!==n).map(o=>{var a;return'<option value="'+o.id+'"'+(o.id===s?" selected":"")+">"+(((a=o.planDetails)==null?void 0:a.name)||o.id)+"</option>"}).join("")}catch(e){console.error("Household load error:",e)}};window.savePartnerSelection=async function(){try{await SS(document.getElementById("hhPartnerSelect").value||null)}catch(t){showToast("Could not save partner selection: "+t.message,"error")}};window.runHouseholdCheck=async function(){var n,s;const t=document.getElementById("hhResults"),e=document.getElementById("hhPartnerSelect").value;if(!e){showToast("Choose your partner's plan first","warning");return}t.innerHTML='<p style="font-size:13px;">Running both plans through the same 1,000 possible futures…</p>',await new Promise(r=>setTimeout(r,30));try{const[r,i]=await Promise.all([ui(),qe()]),o=r.find(w=>w.id===e),a=(n=o==null?void 0:o.stressTool)==null?void 0:n.settings;if(!a||!a.configured){t.innerHTML='<div class="alert alert-warning">The partner plan has no saved Stress Tester settings yet — switch to that plan, fill in its settings, then come back here.</div>';return}const c=Ls({},i),d=Ls({},a),h=Ox(c,d,1e3),m=document.getElementById("hhOwnPlan").value,f=((s=o.planDetails)==null?void 0:s.name)||"Partner",y=new Date().getFullYear(),T=w=>y+w,E=w=>(w*100).toFixed(0)+"%";let x='<div class="settings-section"><div class="section-title">The verdict</div>';const C=h.jointSuccess>=.85?"alert-success":h.jointSuccess>=.7?"alert-warning":"alert-danger",P=h.jointSuccess>=.85?"Looking solid: in "+E(h.jointSuccess)+" of 1,000 possible market futures, the money lasted the whole way for <strong>both</strong> of you.":h.jointSuccess>=.7?"Borderline: the money lasted for both of you in only "+E(h.jointSuccess)+" of 1,000 possible market futures.":"At risk: the money lasted for both of you in just "+E(h.jointSuccess)+" of 1,000 possible market futures.";x+='<div class="alert '+C+'" style="font-size:15px;">'+P+"</div>",x+="<table><tbody><tr><td>"+m+" on their own</td><td><strong>"+E(h.successA)+"</strong></td></tr><tr><td>"+f+" on their own</td><td><strong>"+E(h.successB)+"</strong></td></tr><tr><td>Both together</td><td><strong>"+E(h.jointSuccess)+"</strong></td></tr></tbody></table>",x+=`<p style="font-size:12px;color:var(--text-muted);margin-top:6px;">The together number can't be better than the weaker plan — and both plans face the <em>same</em> markets, so a bad decade hits you both at once. That's why this check runs you both through identical futures instead of treating your plans as unrelated.</p></div>`;const D=Fx(i,a);x+='<div class="settings-section"><div class="section-title">Where the money comes from, year by year</div>';const R=D.filter(w=>w.bridge).length;R>0&&(x+='<div class="alert alert-info">Until <strong>'+T(R)+"</strong> at least one of you is still waiting for their State Pension — those are the years (marked 🌉) when your pots do the most work. This is usually where a couple's plan is tightest.</div>"),x+='<div style="overflow-x:auto;"><table><thead><tr><th>Year</th><th>'+m+" needs</th><th>"+f+" needs</th><th>State Pensions</th><th>Other guaranteed</th><th>From your pots</th></tr></thead><tbody>";const B=new Set([0]);D.forEach((w,v)=>{v>0&&(w.spA!==D[v-1].spA||w.spB!==D[v-1].spB||w.db!==D[v-1].db||w.needB===0&&D[v-1].needB>0||w.needA===0&&D[v-1].needA>0)&&B.add(v)});for(let w=0;w<D.length;w+=5)B.add(w);[...B].sort((w,v)=>w-v).forEach(w=>{const v=D[w];v&&(x+="<tr><td>"+T(v.year)+(v.bridge?" 🌉":"")+"</td><td>"+W(Math.round(v.needA))+"</td><td>"+W(Math.round(v.needB))+"</td><td>"+W(Math.round(v.spA+v.spB))+"</td><td>"+W(Math.round(v.db+v.other))+"</td><td><strong>"+W(Math.round(v.drawNeed))+"</strong></td></tr>")}),x+=`</tbody></table></div><p style="font-size:11px;color:var(--text-muted);margin-top:6px;">Today's money, per year. Rows shown where something changes (a State Pension starts, a plan ends) plus every 5th year. The last column is what your investments must provide after all guaranteed income.</p></div>`,x+=`<div class="settings-section"><div class="section-title">What you'd have left, combined <span style="font-weight:normal;font-size:12px;color:var(--text-muted);">(both pots + ISAs, today's money)</span></div>`,x+='<div style="overflow-x:auto;"><table><thead><tr><th>Year</th><th>If markets are poor</th><th>Typical</th><th>If markets are strong</th></tr></thead><tbody>';for(let w=0;w<h.potFan.length;w+=5){const v=h.potFan[w];x+="<tr><td>"+T(v.year)+"</td><td>"+W(Math.round(v.p10))+"</td><td>"+W(Math.round(v.p50))+"</td><td>"+W(Math.round(v.p90))+"</td></tr>"}if(x+='</tbody></table></div><p style="font-size:11px;color:var(--text-muted);margin-top:6px;">"Poor" = worse than 9 in 10 simulated futures; "strong" = better than 9 in 10.</p></div>',h.jointSuccess<.85){const w=h.successA<=h.successB?m:f,v=Math.min(h.successA,h.successB);x+='<div class="settings-section"><div class="section-title">What to do about it</div><p style="font-size:13px;">The weaker side is <strong>'+w+"</strong> ("+E(v)+" on its own). Open that plan in the Stress Tester and try: a slightly lower spending target, retiring a little later, the bond tent, or checking whether the budget split between you reflects who can actually fund what. Then come back and re-run this check.</p></div>"}const N=zx(i,a,m,f);N.message&&(x+='<div class="settings-section"><div class="section-title">A tax thought</div><div class="alert alert-info">💡 '+N.message+" You choose who funds what — this tool just shows the sums, assuming each plan's ISA bridge and access method as configured. (Adjust the budget's who-pays split, then re-run.)</div></div>"),x+=`<div class="settings-section"><div class="section-title">What if one of you dies?</div><p style="font-size:13px;">The hard question most tools skip. The survivor keeps their own pensions, inherits the other's remaining pots (pensions pass tax-free before 75), loses one State Pension, and typically needs about 70% of the joint spending.</p><div class="row-flex" style="font-size:13px;"><label class="hint" style="display:flex;flex-direction:column;gap:2px;">Who dies<select id="hhWhoDies" style="min-width:150px;"><option value="A">`+m+'</option><option value="B">'+f+'</option></select></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">In year<input type="number" id="hhDeathYear" value="10" min="1" max="40" style="width:80px;"></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">Survivor spends (% of joint)<input type="number" id="hhSurvivorPct" value="70" min="40" max="100" style="width:80px;"></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">DB survivor %<input type="number" id="hhDbSurvivorPct" value="50" min="0" max="100" style="width:80px;"></label><button type="button" class="risk-btn" style="padding:8px 14px;align-self:flex-end;" onclick="runSurvivorUI()">Run survivor check</button></div><div id="hhSurvivorResult" style="margin-top:8px;"></div></div>',x+='<div class="settings-section"><div class="section-title">What if one of you needs care?</div><p style="font-size:13px;">Nursing care runs roughly £80–100k a year. This adds the full cost on top of normal spending (deliberately cautious) and re-runs both plans. It models the cost only — never local-authority means-testing.</p><div class="row-flex" style="font-size:13px;"><label class="hint" style="display:flex;flex-direction:column;gap:2px;">Who needs care<select id="hhCareWho" style="min-width:150px;"><option value="A">'+m+'</option><option value="B">'+f+'</option></select></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">From year<input type="number" id="hhCareStart" value="15" min="0" max="40" style="width:80px;"></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">For (years)<input type="number" id="hhCareYears" value="3" min="1" max="15" style="width:80px;"></label><label class="hint" style="display:flex;flex-direction:column;gap:2px;">Cost (£/yr, today)<input type="number" id="hhCareCost" value="90000" step="5000" style="width:110px;"></label><button type="button" class="risk-btn" style="padding:8px 14px;align-self:flex-end;" onclick="runCareUI()">Run care check</button></div><div id="hhCareResult" style="margin-top:8px;"></div></div>',window._hhLast={cfgA:c,cfgB:d,ownSettings:i,partnerSettings:a,ownName:m,pName:f},t.innerHTML=x}catch(r){console.error("Household check error:",r),t.innerHTML='<div class="alert alert-warning">Could not run the household check: '+r.message+"</div>"}};window.runSurvivorUI=async function(){const t=document.getElementById("hhSurvivorResult"),e=window._hhLast;if(e){t.innerHTML=`<p style="font-size:13px;">Running the survivor's modified plan…</p>`,await new Promise(n=>setTimeout(n,30));try{const n=document.getElementById("hhWhoDies").value,s=+document.getElementById("hhDeathYear").value||10,r=(+document.getElementById("hhSurvivorPct").value||70)/100,i=(+document.getElementById("hhDbSurvivorPct").value||0)/100,o=n==="A"?{cfg:e.cfgB,set:e.partnerSettings,name:e.pName,dCfg:e.cfgA,dSet:e.ownSettings,dName:e.ownName}:{cfg:e.cfgA,set:e.ownSettings,name:e.ownName,dCfg:e.cfgB,dSet:e.partnerSettings,dName:e.pName},a=Vx({survivorCfg:o.cfg,survivorSettings:o.set,deceasedCfg:o.dCfg,deceasedSettings:o.dSet,deathYear:s,spendFraction:r,dbSurvivorPct:i,runs:500}),c=a.survivorSuccess>=.85?"alert-success":a.survivorSuccess>=.7?"alert-warning":"alert-danger";t.innerHTML='<div class="alert '+c+'">If '+o.dName+" dies in year "+s+": <strong>"+o.name+"'s plan still works in "+(a.survivorSuccess*100).toFixed(0)+"%</strong> of 500 futures — inheriting about "+W(Math.round(a.inheritedPots+a.inheritedIsa))+" (median remaining pots), spending "+W(Math.round(a.survivorAnnualAfter))+'/yr from then on.</div><p style="font-size:11px;color:var(--text-muted);">A stress check, not advice. Simplifications: pensions assumed inherited tax-free (death before 75), ISA passed via the spouse allowance, median inheritance from '+o.dName+"'s own simulations.</p>"}catch(n){t.innerHTML='<div class="alert alert-warning">Survivor check failed: '+n.message+"</div>"}}};window.runCareUI=async function(){const t=document.getElementById("hhCareResult"),e=window._hhLast;if(e){t.innerHTML='<p style="font-size:13px;">Re-running both plans with the care years included…</p>',await new Promise(n=>setTimeout(n,30));try{const n=document.getElementById("hhCareWho").value,s=+document.getElementById("hhCareStart").value||15,r=+document.getElementById("hhCareYears").value||3,i=+document.getElementById("hhCareCost").value||9e4,o=Ux({cfgA:e.cfgA,cfgB:e.cfgB,setA:e.ownSettings,setB:e.partnerSettings,who:n,startYear:s,years:r,annualCost:i,runs:500}),a=n==="A"?e.ownName:e.pName,c=o.careJoint>=.85?"alert-success":o.careJoint>=.7?"alert-warning":"alert-danger";t.innerHTML='<div class="alert '+c+'">With '+a+" needing care from year "+s+" for "+r+" years ("+W(o.totalCareCost)+" total in today's money): the money lasts for both of you in <strong>"+(o.careJoint*100).toFixed(0)+"%</strong> of 500 futures — versus "+(o.baselineJoint*100).toFixed(0)+'% without care.</div><p class="hint">A stress check, not advice. Cost added in full on top of normal spending; no means-testing modelled.</p>'}catch(n){t.innerHTML='<div class="alert alert-warning">Care check failed: '+n.message+"</div>"}}};window.createPartnerPlan=async function(){const t=(document.getElementById("hhNewPlanName").value||"").trim();if(!t){showToast("Give the plan a name first (e.g. their first name)","warning");return}try{_t("Creating "+t+"…"),await Gg(t,"Partner plan (household)",["stress","decision"],{},!0),showToast(t+" created — fill in their Stress settings, then come back to Household and pick them.","success",6e3),location.reload()}catch(e){showToast("Could not create the plan: "+e.message,"error")}finally{Tt()}};function Du(){return{currentAge:+document.getElementById("acAge").value||0,retirementAge:+document.getElementById("acRetireAge").value||0,salary:+document.getElementById("acSalary").value||0,potNow:+document.getElementById("acPotNow").value||0,netMonthly:+document.getElementById("acNetMonthly").value||0,schemeType:document.getElementById("acScheme").value||"ras",employerMonthly:+document.getElementById("acEmployerMonthly").value||0,escalationPct:+document.getElementById("acEscalation").value||0}}window.loadAccumulationUI=async function(){try{const t=await ES(),e=await No(),n=(s,r)=>{const i=document.getElementById(s);i&&r!=null&&r!==0&&(i.value=r)};n("acAge",t.currentAge??e.currentAge),n("acRetireAge",t.retirementAge??e.retirementAge),n("acSalary",t.salary),n("acPotNow",t.potNow),n("acNetMonthly",t.netMonthly),t.schemeType&&(document.getElementById("acScheme").value=t.schemeType),n("acEmployerMonthly",t.employerMonthly),t.escalationPct&&(document.getElementById("acEscalation").value=t.escalationPct),recalcAccumulation()}catch(t){console.error("Accumulation load error:",t)}};window.saveAccumulationUI=async function(){try{await xS(Du()),showToast("Accumulation plan saved","success")}catch(t){showToast("Could not save: "+t.message,"error")}};window.recalcAccumulation=async function(){const t=Du(),e=document.getElementById("acBreakdown"),n=document.getElementById("acWarnings"),s=document.getElementById("acProjection");if(!t.currentAge||!t.retirementAge||t.retirementAge<=t.currentAge){e.innerHTML="",n.innerHTML="",s.innerHTML='<p style="color:var(--text-muted);font-size:13px;">Enter your ages to project.</p>';return}const r=kx(t);e.innerHTML='<div class="alert alert-info">Each month: you pay <strong>'+W(t.netMonthly)+"</strong> → <strong>"+W(Math.round(r.grossMonthly))+"</strong> goes into your pension"+(r.reliefMonthly>.5?" (incl. "+W(Math.round(r.reliefMonthly))+" tax relief"+(r.niSavedMonthly>.5?" + NI saving":"")+")":"")+(r.employerMonthly?" + <strong>"+W(r.employerMonthly)+"</strong> from your employer":"")+" = <strong>"+W(Math.round(r.totalMonthly))+"/mo</strong>. Each £1 invested costs you "+(r.costPerPound*100).toFixed(0)+"p."+(r.hrClaimMonthly>.5?" Plus ≈"+W(Math.round(r.hrClaimMonthly))+"/mo you can claim back from HMRC.":"")+"</div>"+r.notes.map(m=>'<p style="font-size:12px;color:var(--text-muted);margin:4px 0 0;">'+m+"</p>").join("");let i=!1;try{i=(await zs()||[]).some(f=>(f.taxFree||0)>0)}catch{}const o=Px({...t,totalMonthly:r.totalMonthly}),a=o[o.length-1],c=Cx({annualGrossTotal:r.totalMonthly*12,salary:t.salary,mpaaTriggered:i,currentAge:t.currentAge,retirementAge:t.retirementAge,projectedPotHigh:a.potHigh});n.innerHTML=c.map(m=>'<div class="alert alert-'+(m.severity==="danger"?"danger":m.severity==="warning"?"warning":"info")+'">'+m.message+"</div>").join("");let d="<table><thead><tr><th>Age</th><th>Cautious (2%)</th><th>Middle (5%)</th><th>Strong (8%)</th><th>Paid in</th></tr></thead><tbody>";const h=o.length>12?5:1;for(let m=0;m<o.length;m+=m===0||m>=o.length-h?1:h){const f=o[m];d+="<tr"+(m===o.length-1?' style="font-weight:600;"':"")+"><td>"+f.age+"</td><td>"+W(Math.round(f.potLow))+"</td><td>"+W(Math.round(f.potMid))+"</td><td>"+W(Math.round(f.potHigh))+"</td><td>"+W(Math.round(f.contributedToDate))+"</td></tr>"}d+="</tbody></table>",s.innerHTML=d,window._acProjection={rows:o,breakdown:r}};window.runOnTrackCheck=async function(){const t=document.getElementById("acOnTrack");if(Du(),!window._acProjection){showToast("Enter your details first","warning");return}t.innerHTML='<p style="font-size:13px;">Searching for the pot that gives 85% success against your plan… (a few seconds)</p>',await new Promise(e=>setTimeout(e,30));try{const e=Ls({},await qe()),{requiredPot:n}=Rx(e,.85,300),s=window._acProjection.rows,r=s[s.length-1],i=o=>o>=n?'<span style="color:var(--success,#22c55e);font-weight:600;">on track ✓</span>':'<span style="color:var(--danger,#ef4444);font-weight:600;">short by '+W(Math.round(n-o))+"</span>";t.innerHTML='<div class="alert alert-info">Your plan needs about <strong>'+W(Math.round(n))+"</strong> at retirement (today's money) for 85% Monte-Carlo success against your budget-derived target.</div><table><tbody><tr><td>Cautious growth (2%)</td><td>"+W(Math.round(r.potLow))+"</td><td>"+i(r.potLow)+"</td></tr><tr><td>Middle growth (5%)</td><td>"+W(Math.round(r.potMid))+"</td><td>"+i(r.potMid)+"</td></tr><tr><td>Strong growth (8%)</td><td>"+W(Math.round(r.potHigh))+"</td><td>"+i(r.potHigh)+'</td></tr></tbody></table><p style="font-size:11px;color:var(--text-muted);margin-top:6px;">Uses your current Stress-Tester settings (target, allocation, State Pension, access method) with the pot scaled. Set your budget and stress settings first for a meaningful answer.</p>'}catch(e){console.error("On-track check error:",e),t.innerHTML='<div class="alert alert-warning">Could not run the check: '+e.message+"</div>"}};window.appConfirm=function(t,e={}){return new Promise(n=>{const s=document.createElement("div");s.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;";const r=document.createElement("div");r.style.cssText="background:var(--card,#1e293b);border:1px solid var(--border,#334155);border-radius:12px;max-width:440px;width:100%;padding:20px;";const i=document.createElement("p");i.style.cssText="white-space:pre-line;font-size:14px;line-height:1.55;margin:0 0 16px;",i.textContent=t;const o=document.createElement("div");o.style.cssText="display:flex;gap:10px;justify-content:flex-end;";const a=document.createElement("button");a.textContent=e.cancelLabel||"Cancel",a.className="risk-btn";const c=document.createElement("button");c.textContent=e.okLabel||"OK",c.className="risk-btn",c.style.cssText=e.danger===!1?"":"border-color:#ef4444;color:#ef4444;";const d=m=>{s.remove(),document.removeEventListener("keydown",h),n(m)},h=m=>{m.key==="Escape"&&d(!1)};a.onclick=()=>d(!1),c.onclick=()=>d(!0),s.onclick=m=>{m.target===s&&d(!1)},document.addEventListener("keydown",h),o.append(a,c),r.append(i,o),s.append(r),document.body.append(s),c.focus()})};window.applyLongevitySuggestion=function(){const t=+document.getElementById("ssLongevityAge").value;if(!t){showToast("Enter your current age first","warning");return}const e=document.getElementById("ssLongevitySex").value,n=+document.getElementById("ssLongevityPct").value,s=OS(t,e,n);document.getElementById("ssDuration").value=Math.max(1,s-t),document.getElementById("ssLongevityNote").textContent="Set to age "+s+" ("+Math.max(1,s-t)+" years). Approximate ONS-style cohort figures — planning to the average means a 50% chance of outliving the plan."};window.updateScheduleSpendNotes=async function(){try{const t=await qe(),e=Array.isArray(t==null?void 0:t.targetSchedule)&&t.targetSchedule.length>0;for(const n of["ssScheduleSpendNote","dsScheduleSpendNote"]){const s=document.getElementById(n);s&&(s.style.display=e?"block":"none")}}catch{}};window.setAccessMethod=function(t,e){const n=document.getElementById(t+"AccessMethod");n&&(n.value=e),syncAccessButtons(t)};window.syncAccessButtons=function(t){const e=(document.getElementById(t+"AccessMethod")||{}).value||"drawdown";document.querySelectorAll(`[onclick^="setAccessMethod('`+t+`'"]`).forEach(s=>{s.classList.toggle("active",s.dataset.access===e)});const n=document.getElementById(t+"UfplsPhase");n&&(n.style.display=e==="ufpls"?"block":"none")};syncAccessButtons("ss");syncAccessButtons("ds");const $r={ss:"mo",ds:"mo"};window.netSpendChanged=function(t,e){const n=+e||0,s=$r[t]==="mo"?n*12:n;document.getElementById(t+"BaseSalary").value=Math.round(io(s)),t0(t)};window.toggleNetPeriod=function(t){$r[t]=$r[t]==="mo"?"yr":"mo",document.getElementById(t+"NetPeriodBtn").textContent="/"+$r[t],syncNetFromGross(t)};window.syncNetFromGross=function(t){const e=+document.getElementById(t+"BaseSalary").value||0,n=$t(e,pa.pa,pa.brl,pa.hrl),s=document.getElementById(t+"NetSpend");s&&(s.value=e?Math.round($r[t]==="mo"?n/12:n):""),t0(t),k1(t)};function t0(t){const e=Math.round(+document.getElementById(t+"BaseSalary").value||0),n=document.getElementById(t+"NetGrossNote");n&&(n.textContent=e?"≈ "+W(e)+"/yr before tax — withdrawals are sized to cover the tax":"")}async function k1(t){const e=document.getElementById(t+"BudgetChipRow"),n=document.getElementById(t+"BudgetChip");if(!(!e||!n)){try{const s=window._budget||Hc(await No()),r=di(s);if(r.allInComfortableMonthly>0){n.textContent="From your budget: "+W(r.allInComfortableMonthly)+"/mo — use",n.dataset.monthly=Math.round(r.allInComfortableMonthly),e.style.display="block";return}}catch{}e.style.display="none"}}window.useBudgetSpend=function(t){const e=document.getElementById(t+"BudgetChip"),n=+(e&&e.dataset.monthly||0);n&&($r[t]="mo",document.getElementById(t+"NetPeriodBtn").textContent="/mo",document.getElementById(t+"NetSpend").value=n,netSpendChanged(t,n))};async function xl(){_t("Loading settings...");try{const t=await qe();document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(n=>({...n})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssDbAmount").value=t.dbAmount||0,document.getElementById("ssDbStartYear").value=t.dbStartYear||0,document.getElementById("ssDbIndexation").value=t.dbIndexation||"lpi5",window._ssExtraIncomes=Array.isArray(t.extraIncomes)?JSON.parse(JSON.stringify(t.extraIncomes)):[],updateScheduleSpendNotes(),window._ssWindfalls=Array.isArray(t.windfalls)?JSON.parse(JSON.stringify(t.windfalls)):[],renderExtraIncomes(),document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",Fc("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0,document.getElementById("ssAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("ssUfplsYears").value=t.ufplsYears||"",document.getElementById("ssUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("ssBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ss");const e=document.getElementById("ssSeedNote");e&&(e.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),Tl()}catch(t){console.error("Error loading stress settings:",t)}finally{Tt()}}window.saveStressSettingsUI=async function(){if(!lt()){showToast("Please sign in to save settings","error");return}const t=vl(document.getElementById("ssSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ss");if(await ku(e.equityMin,e.bondMin,e.cashTarget)){_t("Saving settings...");try{const n=await qe(),s=+document.getElementById("ssBaseSalary").value,r=Array.isArray(n.targetSchedule)&&Math.abs(s-(n.targetSchedule[0]||0))<1;await Lo({configured:!0,accessMethod:document.getElementById("ssAccessMethod").value||"drawdown",ufplsYears:+document.getElementById("ssUfplsYears").value||null,ufplsThenPcls:document.getElementById("ssUfplsPcls").checked,bandFillRecycle:document.getElementById("ssBandFillRecycle").checked,targetSchedule:r?n.targetSchedule:null,baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,dbAmount:+document.getElementById("ssDbAmount").value||0,dbStartYear:+document.getElementById("ssDbStartYear").value||0,dbIndexation:document.getElementById("ssDbIndexation").value||"lpi5",extraIncomes:(window._ssExtraIncomes||[]).filter(i=>i.annual>0),windfalls:(window._ssWindfalls||[]).filter(i=>i.amount>0&&i.year!=null),spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,recoveryBuffer:+document.getElementById("ssRecoveryBuffer").value||15e3,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value,isaBalance:+document.getElementById("ssIsaBalance").value||0,spendingProfile:document.getElementById("ssSpendingProfile").value,equityGlideEnabled:document.getElementById("ssEquityGlide").checked,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:Pu("ss"),taggedFunds:Ht("ss").filter(i=>i.ticker&&i.value>0)}),Cu({...e,duration:+document.getElementById("ssDuration").value||35}),Il(),updateNextStepBanner(),updateNextStepBanner(),showToast("Settings saved successfully","success")}catch(n){console.error("Error saving stress settings:",n),showToast("Error saving: "+n.message,"error")}finally{Tt()}}};window.copyDecisionFromStressUI=async function(t){if(!lt()){showToast("Please sign in first","error");return}if(await yi()){showToast("This plan is locked — unlock it (Settings) or create a new plan before copying settings into it.","warning",6e3);return}_t("Copying from Stress Tester…");try{const e=await qe();if(t==="target")await ur({baseSalary:e.baseSalary});else{const n=await Ze();await ur(dS(e,n))}await Al(),showToast(t==="target"?"Target copied from the Stress Tester ("+W(e.baseSalary||0)+"/yr gross).":"All Stress settings copied — review them and press Save Settings to commit the plan.","success",5e3)}catch(e){console.error("Copy from stress error:",e),showToast("Could not copy: "+e.message,"error")}finally{Tt()}};window.copyStressFromDecisionUI=async function(){if(!lt()){showToast("Please sign in first","error");return}if(await appConfirm("Copy your Decision Tool plan basics (funds, income, State Pension, ISA, protection) into the Stress Tester? Your Stress-specific what-ifs (tax mode, HODL) are kept.")){_t("Copying from Decision...");try{const t=await Ze(),e=await qe(),n=cS(t,e);await Lo(n),await xl(),showToast("Stress Tester seeded from your Decision plan","success")}catch(t){console.error("Error copying from decision:",t),showToast("Error copying: "+t.message,"error")}finally{Tt()}}};window.resetStressSettingsUI=async function(){if(await appConfirm("Reset all stress settings to defaults?")){_t("Resetting settings...");try{await jx(),await xl(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{Tt()}}};async function Al(){_t("Loading settings...");try{const t=await Ze();document.getElementById("dsDuration").value=t.duration||35,writeAlloc("ds",t.equityMin??25e4,t.bondMin??2e5,t.cashTarget??5e4,t.diversifierStart||0),restoreCustomAllocFromSettings("ds",t),window._taggedFunds.ds=(t.taggedFunds||[]).map(e=>({...e})),setAllocMode("ds",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("dsEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=t.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("dsProtectionFactor").value=t.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("dsDisableProtection").checked=t.disableProtection||!1,document.getElementById("dsConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("dsIsaBalance").value=t.isaBalance||0,document.getElementById("dsAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("dsUfplsYears").value=t.ufplsYears||"",document.getElementById("dsUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("dsBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ds"),document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",Tl(),await zu()}catch(t){console.error("Error loading decision settings:",t)}finally{Tt()}}let C1=0;const It=()=>"b"+ ++C1,W=t=>"£"+Math.round(+t||0).toLocaleString(),Te=t=>String(t??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");function Hc(t){const e={...oo(),...t||{}};return e.lines=(Array.isArray(e.lines)?e.lines:[]).map(n=>({id:n.id||It(),...n})),e.oneOffs=(Array.isArray(e.oneOffs)?e.oneOffs:[]).map(n=>({id:n.id||It(),...n})),e}async function P1(){gr=!1;try{window._budget=Hc(await No())}catch(e){console.error("Budget load error:",e),window._budget=Hc(oo())}window._budget.lines.length||(window._budget.lines=Ug().map(e=>({id:It(),...e})),window._budget.oneOffs.length||(window._budget.oneOffs=$g().map(e=>({id:It(),...e})))),document.getElementById("budCurrentAge").value=window._budget.currentAge,document.getElementById("budRetireAge").value=window._budget.retirementAge,document.getElementById("budEndAge").value=window._budget.endAge,document.getElementById("budShared").checked=!!window._budget.sharedWithPartner,document.getElementById("budSharePct").value=window._budget.mySharePct??50,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",renderSplitPhases(),ct(),en(),_e(),n0();const t=!window._budget.lines.some(e=>e.annual)&&!window._budget.oneOffs.some(e=>e.amount);document.getElementById("budWizBanner").style.display=t?"block":"none",gr=!0,sr("Autosaves as you edit"),window._budWizAutoOpen&&(window._budWizAutoOpen=!1,openBudgetWizard())}function n0(){const t=Do(window._budget);document.querySelectorAll("#budTierBtns [data-tier], #budWizTierBtns [data-tier]").forEach(e=>{e.classList.toggle("active",e.dataset.tier===t)})}window.setPlsaTier=function(t){window._budget.plsaTier=t,n0(),document.getElementById("budWizardOverlay").style.display!=="none"&&St(!0);const n=window.scrollY;ct(),en(),_e(),window.scrollTo(0,n)};function kl(t,e){const n=t.paidBy||"me",s=(o,a)=>'<option value="'+o+'"'+(n===o?" selected":"")+">"+a+"</option>",r=window._budget.mySharePct??50,i=n==="shared"?'<input type="number" min="0" max="100" placeholder="'+r+'%" title="Your % of this shared cost (blank = the overall split)" value="'+(t.mySharePct??"")+'" oninput="'+e+"('"+t.id+`','mySharePct',this.value)" style="flex:0 0 62px;">`:"";return'<select title="Who pays this?" onchange="'+e+"('"+t.id+`','paidBy',this.value)" style="flex:0 0 96px;">`+s("me","Me")+s("partner","Partner")+s("shared","Shared")+"</select>"+i}window.onBudgetSharedToggle=function(){window._budget.sharedWithPartner=document.getElementById("budShared").checked,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",renderSplitPhases(),ct(),en(),_e()};window.renderSplitPhases=function(){const t=document.getElementById("budSplitPhases");if(!t)return;const e=window._budget.splitPhases||[];t.innerHTML=e.map((n,s)=>'<div style="display:flex; align-items:center; gap:6px; margin-top:4px; font-size:13px;">From age <input type="number" min="40" max="100" value="'+(n.fromAge??"")+'" style="width:68px;" oninput="updateSplitPhase('+s+`,'fromAge',this.value)"> my share becomes <input type="number" min="0" max="100" value="`+(n.mySharePct??"")+'" style="width:68px;" oninput="updateSplitPhase('+s+`,'mySharePct',this.value)">% <button type="button" style="background:none;border:none;color:var(--text-muted);cursor:pointer;" title="Remove" onclick="removeSplitPhase(`+s+')">✕</button></div>').join("")||'<p style="font-size:12px;color:var(--text-muted);margin:4px 0 0;">No changes yet — one split applies for the whole plan.</p>'};window.addSplitPhase=function(){(window._budget.splitPhases=window._budget.splitPhases||[]).push({fromAge:"",mySharePct:""}),renderSplitPhases(),_e()};window.updateSplitPhase=function(t,e,n){window._budget.splitPhases&&window._budget.splitPhases[t]&&(window._budget.splitPhases[t][e]=n===""?"":+n,_e())};window.removeSplitPhase=function(t){window._budget.splitPhases.splice(t,1),renderSplitPhases(),_e()};window.onBudgetSharePctChange=function(){window._budget.mySharePct=+document.getElementById("budSharePct").value||0,_e()};function s0(t){const e=+window._budget.retirementAge,n=+window._budget.endAge,s=(r,i)=>r!=null&&r!==""&&+r!==i;return t._bandOpen||s(t.fromAge,e)||s(t.toAge,n)}function R1(t){return s0(t)?'<span class="row-flex" style="gap:4px; flex-wrap:nowrap;"><span class="hint">age</span><input type="number" placeholder="'+(window._budget.retirementAge??"from")+'" title="From age (blank = retirement)" value="'+(t.fromAge??"")+`" oninput="updateBudgetLine('`+t.id+`','fromAge',this.value)" style="width:64px; flex:0 0 auto;"><span class="hint">to</span><input type="number" placeholder="`+(window._budget.endAge??"to")+'" title="To age (blank = end of plan)" value="'+(t.toAge??"")+`" oninput="updateBudgetLine('`+t.id+`','toAge',this.value)" style="width:64px; flex:0 0 auto;"><button type="button" class="risk-btn active" style="padding:4px 8px;" title="Back to: applies for the whole retirement" onclick="budMainBandToggle('`+t.id+`')">&#9201;</button></span>`:`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Only for some years? Set when this cost starts and stops — e.g. a car lease with 3 years left. Blank = the whole retirement." onclick="budMainBandToggle('`+t.id+`')">&#9201;</button>`}window.budMainBandToggle=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(s0(e)?(e._bandOpen=!1,e.fromAge=null,e.toAge=null,budTouch()):e._bandOpen=!0,ct(),_e())};function ap(t){const e=t.hint?'<div class="hint" style="margin-top:2px;line-height:1.3;font-size:11px;">'+Te(t.hint)+"</div>":"",n=t.period||"yr",s=t.annual==null?"":n==="mo"?Math.round(t.annual/12):t.annual,r=ci(t.label,window._budget),i=r!=null?"≈"+(n==="mo"?r:r*12):"Amount",o=window._budget.sharedWithPartner?`<button type="button" class="risk-btn" title="Add a copy for your partner (e.g. their car)" onclick="duplicateBudgetLine('`+t.id+`')">⧉</button>`:"";return'<div class="bud-row" data-id="'+t.id+'"><div class="bud-label"><input type="text" placeholder="Category" value="'+Te(t.label)+`" oninput="updateBudgetLine('`+t.id+`','label',this.value)">`+e+'</div><div class="bud-amt"><input type="text" inputmode="decimal" id="bm-amt-'+t.id+'" placeholder="'+i+`" title="Amount in today's money — sums welcome: 11.99+8.99 or =4×52/12`+(r!=null?" (typical shown)":"")+'" value="'+s+`" onchange="updateBudgetAmount('`+t.id+`',this.value,this)"><button type="button" class="risk-btn" title="Switch monthly / yearly" onclick="toggleBudgetPeriod('`+t.id+`')">`+(n==="mo"?"/mo":"/yr")+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bm','`+t.id+`')">&Sigma;</button></div>`+(window._budget.sharedWithPartner?'<span class="bud-paidby">'+kl(t,"updateBudgetLine")+"</span>":"")+'<span class="bud-ages">'+R1(t)+'</span><span class="bud-actions">'+o+`<button type="button" class="risk-btn" title="Remove" onclick="removeBudgetLine('`+t.id+`')">&times;</button></span>`+(t.breakdownOpen?'<div class="bud-break">'+i0("bm",t)+"</div>":"")+"</div>"}function Wc(t){const e=window._budget.sharedWithPartner;return'<div class="bud-row bud-head'+(t?" bud-row--oneoff":"")+'"><span>What</span><span>'+(t?"Cost (£)":"Amount")+"</span>"+(e?"<span>Who pays</span>":"")+"<span>"+(t?"When":"Years it applies")+"</span><span></span></div>"}function ct(){const t=window._budget.lines.filter(s=>s.tier==="essential"),e=window._budget.lines.filter(s=>s.tier==="discretionary"),n=window._budget.sharedWithPartner;for(const s of["budEssentialRows","budDiscretionaryRows","budOneOffRows"]){const r=document.getElementById(s);r&&(r.classList.add("bud-grid"),r.classList.toggle("bud-grid--shared",n))}document.getElementById("budEssentialRows").innerHTML=(t.length?Wc(!1):"")+t.map(ap).join("")||'<p class="hint" style="margin:0 0 8px;">No essentials yet — add housing, bills, food, transport…</p>',document.getElementById("budDiscretionaryRows").innerHTML=(e.length?Wc(!1):"")+e.map(ap).join("")||'<p class="hint" style="margin:0 0 8px;">No lifestyle spending yet — holidays, hobbies, eating out…</p>',Bu()}function M1(t){const e=t.hint?'<div class="hint" style="margin-top:2px;line-height:1.3;font-size:11px;">'+Te(t.hint)+"</div>":"";return'<div class="bud-row bud-row--oneoff" data-id="'+t.id+'"><div class="bud-label"><input type="text" placeholder="e.g. Car" value="'+Te(t.label)+`" oninput="updateBudgetOneOff('`+t.id+`','label',this.value)">`+e+`</div><div class="bud-amt"><input type="number" placeholder="£ amount" title="Total cost in today's money" value="`+(t.amount??"")+`" oninput="updateBudgetOneOff('`+t.id+`','amount',this.value)"></div>`+(window._budget.sharedWithPartner?'<span class="bud-paidby">'+kl(t,"updateBudgetOneOff")+"</span>":"")+'<span class="bud-ages"><span class="hint">at</span><input type="number" placeholder="age" value="'+(t.atAge??"")+`" oninput="updateBudgetOneOff('`+t.id+`','atAge',this.value)"><span class="hint">every</span><input type="number" placeholder="once" title="Leave blank for a one-time cost" value="`+(t.everyYears??"")+`" oninput="updateBudgetOneOff('`+t.id+`','everyYears',this.value)"><span class="hint">yrs</span></span><span class="bud-actions">`+(window._budget.sharedWithPartner?`<button type="button" class="risk-btn" title="Add a copy for your partner" onclick="duplicateBudgetOneOff('`+t.id+`')">⧉</button>`:"")+`<button type="button" class="risk-btn" title="Remove" onclick="removeBudgetOneOff('`+t.id+`')">&times;</button></span></div>`}function en(){const t=window._budget.oneOffs,e=document.getElementById("budOneOffRows");e.classList.add("bud-grid"),e.classList.toggle("bud-grid--shared",!!window._budget.sharedWithPartner),e.innerHTML=(t.length?Wc(!0):"")+t.map(M1).join("")||'<p class="hint" style="margin:0 0 8px;">No one-off costs yet — a car every ~8 years, a new roof, a milestone trip…</p>'}function Bu(){const t=ro(window._budget),e=document.getElementById("budSuggestionsSection"),n=document.getElementById("budSuggestions");if(!t.length){e.style.display="none",n.innerHTML="";return}e.style.display="block",n.innerHTML=t.map(s=>'<button type="button" class="risk-btn" style="padding:5px 10px;" title="'+Te(s.hint||"")+`" onclick="addBudgetSuggestion('`+Te(s.label).replace(/'/g,"\\'")+`')">+ `+Te(s.label)+"</button>").join("")}window.addBudgetSuggestion=function(t){const e=ro(window._budget).find(n=>n.label===t);e&&(window._budget.lines.push({id:It(),label:e.label,tier:e.tier,annual:null,fromAge:null,toAge:null,hint:e.hint||"",period:e.period||"yr",paidBy:e.paidBy||"me"}),ct(),Bu(),_e())};function Lu(){window._budget.currentAge=+document.getElementById("budCurrentAge").value||0,window._budget.retirementAge=+document.getElementById("budRetireAge").value||0,window._budget.endAge=+document.getElementById("budEndAge").value||100}window.onBudgetHorizonChange=function(){Lu(),_e()};window.updateBudgetLine=function(t,e,n){const s=window._budget.lines.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="fromAge"||e==="toAge"?s[e]=n===""?null:Pl(n):s[e]=n===""?null:+n,e==="label"&&Bu(),e==="paidBy"&&ct(),_e())};window.updateBudgetAmount=function(t,e,n){const s=window._budget.lines.find(i=>i.id===t);if(!s)return;const r=String(e).trim();if(r==="")s.annual=null;else{const i=Cs(r);if(i==null)return;s.annual=(s.period||"yr")==="mo"?i*12:i,n&&(n.value=i)}budTouch(),_e()};window.toggleBudgetPeriod=function(t){const e=window._budget.lines.find(s=>s.id===t);if(!e)return;e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch();const n=window.scrollY;ct(),_e(),window.scrollTo(0,n)};window.updateBudgetOneOff=function(t,e,n){const s=window._budget.oneOffs.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="atAge"?s[e]=n===""?null:Pl(n):s[e]=n===""?null:+n,e==="paidBy"&&en(),_e())};window.addBudgetLine=function(t){window._budget.lines.push({id:It(),label:"",tier:t,annual:null,fromAge:null,toAge:null}),ct(),_e()};window.addBudgetOneOff=function(){window._budget.oneOffs.push({id:It(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),en(),_e()};window.removeBudgetLine=function(t){const e=window._budget.lines.findIndex(n=>n.id===t);e<0||(Cl("line",window._budget.lines[e],e),window._budget.lines.splice(e,1),ct(),_e())};window.removeBudgetOneOff=function(t){const e=window._budget.oneOffs.findIndex(n=>n.id===t);e<0||(Cl("oneOff",window._budget.oneOffs[e],e),window._budget.oneOffs.splice(e,1),en(),_e())};window.duplicateBudgetLine=function(t){const e=window._budget.lines,n=e.find(r=>r.id===t);if(!n)return;const s={...n,id:It(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,s),ct(),_e()};window.duplicateBudgetOneOff=function(t){const e=window._budget.oneOffs,n=e.find(r=>r.id===t);if(!n)return;const s={...n,id:It(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,s),en(),_e()};window.fillTypicalAmounts=function(){let t=0;for(const e of window._budget.lines)if(e.annual==null||e.annual===""){const n=ci(e.label,window._budget);n!=null&&(e.annual=n*12,t++)}ct(),_e(),showToast(t?"Filled "+t+" blank categories with "+Vg[Do(window._budget)]+" figures — adjust freely":"No blank categories with a typical figure",t?"success":"info")};function _e(){budTouch(),Lu();const t=window._budget,e=t.retirementAge,n=Rc(t,e,"essential"),s=Rc(t,e,"all");document.getElementById("budEssentialSubtotal").textContent=W(n),document.getElementById("budDiscretionarySubtotal").textContent=W(s-n);const r=di(t),i=x=>W(x),o=t.oneOffs.filter(x=>(+x.everyYears||0)>0&&(+x.amount||0)>0),a=t.oneOffs.filter(x=>!((+x.everyYears||0)>0)&&(+x.amount||0)>0),c=Fg.single,d=r.allInComfortableAnnual,h=d>=c.comfortable?"at/above Comfortable":d>=c.moderate?"between Moderate and Comfortable":d>=c.minimum?"between Minimum and Moderate":"below the Minimum",m=r.sharedWithPartner;let f="";if(f+='<div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;">',f+='<div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(m?" — your share":"")+'</div><div style="font-size:22px;font-weight:700;">'+i(r.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div>',f+='<div><div style="font-size:12px;color:var(--text-muted);">'+(m?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:26px;font-weight:800;color:var(--primary,#6366f1);">'+i(r.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+i(d)+"/yr — what your plan funds</div></div>",m&&(f+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:22px;font-weight:700;">'+i(r.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+i(r.partnerAllInAnnual)+"/yr — their side of this budget</div></div>",f+='<div><div style="font-size:12px;color:var(--text-muted);">Household all-in</div><div style="font-size:22px;font-weight:700;">'+i(r.householdComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">everything, both of you</div></div>'),f+="</div>",m&&r.partnerAllInAnnual>0&&(f+='<div class="alert alert-info" style="margin-bottom:12px;">Your partner’s share is <strong>'+i(r.partnerAllInMonthly)+"/mo</strong> ("+i(r.partnerAllInAnnual)+'/yr). They can create their own free plan and use that as <em>their</em> target income. <span style="color:var(--text-muted);">Note: this plan only funds <em>your</em> share — it doesn’t check your partner can fund theirs.</span></div>'),f+='<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">= comfortable recurring <strong style="color:var(--text);">'+i(r.comfortableMonthlyNet)+"/mo</strong>"+(r.periodicMonthlyAverage>0?' + periodic set-aside <strong style="color:var(--text);">'+i(r.periodicMonthlyAverage)+"/mo</strong> <span>(averaged from the big periodic costs below)</span>":"")+".</div>",f+='<div class="alert alert-info" style="margin-bottom:12px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+i(c.minimum)+" · Moderate "+i(c.moderate)+" · Comfortable "+i(c.comfortable)+" per year. Your all-in spend is <strong>"+h+'</strong>. <span style="color:var(--text-muted);">(Assumes home owned outright; excludes care costs.)</span></div>',o.length){f+='<div style="font-size:13px;margin-bottom:8px;"><strong>Periodic costs</strong> (averaged into the monthly need, but the cash lands lumpily):<ul style="margin:6px 0 0; padding-left:18px;">';for(const x of o){const C=+x.amount/+x.everyYears;f+="<li>"+Te(x.label||"item")+": "+i(x.amount)+" every "+ +x.everyYears+" yrs ≈ <strong>"+i(C)+"/yr</strong> ("+i(C/12)+"/mo)</li>"}f+="</ul></div>"}if(a.length){f+='<div style="font-size:13px;margin-bottom:12px;"><strong>One-time costs</strong> (not in the monthly average — planned for the year they fall):<ul style="margin:6px 0 0; padding-left:18px;">';for(const x of a)f+="<li>"+Te(x.label||"item")+": "+i(x.amount)+(x.atAge?" at age "+ +x.atAge:"")+"</li>";f+="</ul></div>"}const y=+window._budget.targetHeadroomMonthly||0,T=r.allInComfortableMonthly+y,E=io(r.allInComfortableAnnual+y*12);f+='<div style="border-top:1px solid var(--border); padding-top:12px;">',f+='<div style="font-size:13px; margin-bottom:8px;">Your all-in take-home of <strong>'+i(r.allInComfortableMonthly)+"/mo</strong> becomes the <strong>target both tools work to</strong>: the Stress Tester asks “will my pots deliver this for life?” and the Decision Tool works out each month’s withdrawal to hit it tax-efficiently.</div>",f+='<div style="font-size:13px; margin-bottom:10px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">Optional headroom on top: £<input type="number" min="0" value="'+(window._budget.targetHeadroomMonthly??"")+'" placeholder="0" onchange="budHeadroomChanged(this.value)" style="width:90px;">/mo <span style="color:var(--text-muted);">— breathing room above the budget, so the plan isn’t cut to the bone.</span></div>',f+='<div style="font-size:13px; margin-bottom:8px;">Plan target: <strong>'+i(T)+'/mo take-home</strong> <span style="color:var(--text-muted);">(≈ '+i(E)+"/yr before tax"+(y?" — budget + "+i(y)+"/mo headroom":"")+")</span></div>",f+='<button type="button" onclick="applyBudgetToPlan()">Set as my plan’s target (Stress + Decision)</button>',f+="</div>",document.getElementById("budSummary").innerHTML=f}let gr=!1,mo=null;function sr(t){if(jn)return;const e=document.getElementById("budSaveStatus");e&&(e.textContent=t)}let jn=null,Yc=null;function Cl(t,e,n){jn={kind:t,item:e,index:n},clearTimeout(Yc),Yc=setTimeout(()=>{jn=null,Gc()},12e3),Gc()}function Gc(){const t=jn?jn.item.label||"item":null,e=jn?"Removed “"+Te(t)+'” — <button type="button" class="budwiz-chip" onclick="budUndoRemove()">Undo</button>':null,n=document.getElementById("budSaveStatus");n&&e?n.innerHTML=e:n&&!e&&sr("Saved ✓");const s=document.getElementById("budWizUndoSlot");s&&(s.innerHTML=e||"")}window.budUndoRemove=function(){if(!jn)return;const{kind:t,item:e,index:n}=jn;jn=null,clearTimeout(Yc);const s=t==="line"?window._budget.lines:window._budget.oneOffs;if(s.splice(Math.min(n,s.length),0,e),budTouch(),document.getElementById("budWizardOverlay").style.display!=="none")St(!0);else{const i=window.scrollY;ct(),en(),_e(),window.scrollTo(0,i)}Gc()};window.budTouch=function(){!gr||!window._budget||(sr("Saving…"),clearTimeout(mo),mo=setTimeout(Nu,1200))};function r0(){return{...window._budget,lines:window._budget.lines.filter(t=>t.label&&t.label.trim()||t.annual||t.breakdown&&t.breakdown.some(e=>e.label&&e.label.trim()||e.amount)),oneOffs:window._budget.oneOffs.filter(t=>t.label&&t.label.trim()||t.amount)}}async function Nu(){if(!lt()){sr("Sign in to save");return}try{await bu(r0()),sr("Saved ✓")}catch(t){console.error("Budget autosave error:",t),sr("Not saved — retrying…"),clearTimeout(mo),mo=setTimeout(Nu,4e3)}}window.resetBudgetUI=async function(){await appConfirm(`Reset the budget?

All amounts, sub-sheets and custom lines go back to a fresh start. Your ages and partner-sharing setting are kept.

This saves immediately and cannot be undone.`)&&(window._budget.lines=Ug().map(t=>({id:It(),...t})),window._budget.oneOffs=$g().map(t=>({id:It(),...t})),ct(),en(),_e(),await Nu(),showToast("Budget reset to a fresh start","success"))};window.exportBudgetCsv=async function(){var t,e;try{const n=await ui(),s=await ul(),r=(((e=(t=n.find(o=>o.id===s))==null?void 0:t.planDetails)==null?void 0:e.name)||"plan").replace(/[^\w\-]+/g,"-").toLowerCase(),i=oS(window._budget||{});e0("budget-"+r+"-"+new Date().toISOString().slice(0,10)+".csv",i,"text/csv;charset=utf-8;"),showToast("Budget exported — open it straight in Google Sheets or Excel","success")}catch(n){showToast("Export failed: "+n.message,"error")}};window.importBudgetCsvFile=function(t){const e=t.files&&t.files[0];if(t.value="",!e)return;const n=new FileReader;n.onload=async()=>{try{const s=lS(n.result);if(!s.lines.length&&!s.oneOffs.length){showToast("Nothing to import"+(s.warnings[0]?" — "+s.warnings[0]:""),"warning",6e3);return}const r=`Replace the current budget with the imported one?

`+s.lines.length+" items, "+s.oneOffs.length+" one-offs"+(s.warnings.length?`
`+s.warnings.length+` row(s) skipped:
• `+s.warnings.slice(0,3).join(`
• `)+(s.warnings.length>3?`
…`:""):"")+`

Your current budget is kept for one Undo.`;if(!await appConfirm(r,{okLabel:"Import",danger:!1}))return;const i=JSON.parse(JSON.stringify(window._budget));gr=!1;const o=window._budget;Object.assign(o,s.settings),o.lines=s.lines.map(m=>({...m,id:It()})),o.oneOffs=s.oneOffs.map(m=>({...m,id:It()}));const a=(m,f)=>{const y=document.getElementById(m);y&&f!=null&&(y.value=f)};a("budCurrentAge",o.currentAge),a("budRetireAge",o.retirementAge),a("budEndAge",o.endAge);const c=document.getElementById("budShared");c&&(c.checked=!!o.sharedWithPartner),a("budSharePct",o.mySharePct);const d=document.getElementById("budShareRow");d&&(d.style.display=o.sharedWithPartner?"block":"none"),renderSplitPhases(),ct(),en(),_e(),gr=!0,await saveBudgetUI(),window._budImportUndo=i,showToast("Imported "+o.lines.length+" items. Undo available for 60s via the button below.","success",8e3);const h=document.getElementById("budSaveStatus");h&&(h.innerHTML='Imported — <a href="#" onclick="undoBudgetImport();return false;" style="color:var(--primary);">Undo</a>'),setTimeout(()=>{window._budImportUndo=null},6e4)}catch(s){console.error("Budget import error:",s),showToast("Import failed: "+s.message,"error",6e3)}},n.readAsText(e)};window.undoBudgetImport=async function(){if(!window._budImportUndo){showToast("Nothing to undo","warning");return}gr=!1,window._budget=window._budImportUndo,window._budImportUndo=null,renderSplitPhases(),ct(),en(),_e(),gr=!0,await saveBudgetUI(),showToast("Budget restored","success")};window.saveBudgetUI=async function(){if(!lt()){showToast("Please sign in to save your budget","error");return}Lu(),_t("Saving budget…");try{clearTimeout(mo),await bu(r0()),sr("Saved ✓"),showToast("Budget saved","success")}catch(t){console.error("Budget save error:",t),showToast("Error saving budget: "+t.message,"error")}finally{Tt()}};window.budHeadroomChanged=function(t){window._budget.targetHeadroomMonthly=t===""?null:Math.max(0,+t||0),_e()};window.applyBudgetToPlan=async function(){const t=di(window._budget),e=+window._budget.targetHeadroomMonthly||0,n=Math.round(io(t.allInComfortableAnnual+e*12));if(!n){showToast("Add some spending first","warning");return}_t("Applying to plan…");try{const s=await qe(),r=s.duration||35,o=sS(window._budget,r).map(f=>Math.round(io(f+e*12)));await Lo({baseSalary:n,targetSchedule:o});const a=window._budget;((a.lines||[]).some(f=>f.fromAge!=null&&f.fromAge!==""&&+f.fromAge!=+a.retirementAge||f.toAge!=null&&f.toAge!==""&&+f.toAge!=+a.endAge)||(a.oneOffs||[]).length>0||Array.isArray(a.splitPhases)&&a.splitPhases.length>0)&&s.spendingProfile==="declining"&&showToast('Heads-up: your Spending profile is "Declining with age", but this budget already winds costs down with age. Consider "Level for life" in the Stress settings to avoid counting the slowdown twice.',"warning",9e3),updateScheduleSpendNotes();const d=await yi();d||await ur({baseSalary:n});const h=document.getElementById("ssBaseSalary");h&&(h.value=n,syncNetFromGross("ss"));const m=document.getElementById("dsBaseSalary");m&&!d&&(m.value=n,syncNetFromGross("ds")),updateNextStepBanner(),showToast("Target set: both tools now work to "+W(t.allInComfortableMonthly+e)+"/mo take-home"+(e?" (incl. "+W(e)+"/mo headroom)":"")+" — "+W(n)+"/yr gross"+(d?". Stress only; the Decision plan is locked":""),"success",5e3)}catch(s){console.error("Apply-to-plan error:",s),showToast("Could not apply: "+s.message,"error")}finally{Tt()}};const Fo=[{key:"home",title:"Home & bills",tier:"essential",tip:"Will your mortgage still exist at retirement? If it ends earlier, use the ⏱ button on its row to set the age it stops. Bills mostly carry on — but you'll be home more, so heating often rises.",labels:["Rent / mortgage","Council tax","Gas","Electricity","Water","Broadband","Mobile phones","TV licence","Home insurance","Boiler service","Home upkeep","Premier banking / account fees","Cleaner / gardener","Second / holiday home","Storage / lock-up"]},{key:"food",title:"Food, drink & eating out",tier:"essential",tip:"With more free time most retirees eat OUT more, not less. Check 2–3 months of bank statements for what you really spend — real numbers beat guesses.",labels:["Groceries & household","Eating out & takeaways","Alcohol"]},{key:"transport",title:"Transport",tier:"essential",tip:"Commuting disappears at retirement, but running costs are easy to underestimate — servicing, MOT, tyres, repairs. Replacing the car itself goes in One-off costs (a later step).",labels:["Car insurance","Car tax","Petrol / fuel","Car servicing & maintenance","Breakdown cover","Parking & permits","Public transport"]},{key:"health",title:"Health & protection",tier:"essential",tip:"Health spending tends to RISE with age — and the PLSA benchmarks exclude long-term care entirely. A monthly care set-aside is easy to add now and painful to discover missing later.",labels:["Personal health","Health / dental insurance","Dental & optical","Hearing","Life insurance / income protection","Long-term care set-aside"]},{key:"leisure",title:"Holidays, hobbies & leisure",tier:"discretionary",tip:'Most people spend MORE on holidays and hobbies in the early "go-go" years. Budget for the retirement you actually want — the spending smile tapers it in later life.',labels:["Main holiday","UK breaks","Day trips","Streaming & entertainment","Digital subscriptions","Gym & fitness","Sports & equipment","Sports clothes","Hobbies & leisure","Newspapers, books & media"]},{key:"personal",title:"Personal, family & giving",tier:"discretionary",tip:'The easiest category to underestimate: gifts, grandchildren, Christmas. A personal "spends" line per person keeps day-to-day money simple.',labels:["Clothes","Gifts & family","Charity","Pets","Personal spending money","Kids / dependents","Christmas & birthdays","Hairdressing & grooming","Grandchildren","Professional memberships","My personal spending","Partner's personal spending"]},{key:"extras",title:"Around the home & everything else",tier:"discretionary",tip:"Furniture wears out, technology needs refreshing, and a small emergency buffer stops a bad month becoming a plan problem. Anything of yours that didn't fit an earlier screen appears here too.",labels:["Home furnishings & décor","Home technology","Emergency buffer"]}],Ou=(()=>{const t={};for(const e of Fo)for(const n of e.labels)t[n.toLowerCase()]=e.key;return t})(),Oi=["intro",...Fo.map(t=>t.key),"oneoffs","review"];let Vn=0;function D1(t){return t.wizGroup&&Fo.some(e=>e.key===t.wizGroup)?t.wizGroup:Ou[(t.label||"").trim().toLowerCase()]||"extras"}window.openBudgetWizard=function(){window._budget&&(Vn=0,document.getElementById("budWizardOverlay").style.display="block",St())};window.closeBudgetWizard=function(){document.getElementById("budWizardOverlay").style.display="none",ct(),en(),_e()};window.budWizGo=function(t){Vn=Math.max(0,Math.min(Oi.length-1,Vn+t)),St()};function B1(t){return t.annual==null?"":(t.period||"yr")==="mo"?Math.round(t.annual/12):t.annual}function L1(t){const e=t.period||"yr",n=ci(t.label,window._budget),s=Vg[Do(window._budget)].replace("PLSA ",""),r=n!=null&&n>0?s+" "+W(e==="mo"?n:n*12)+"/"+e:null,o=!!Ou[(t.label||"").trim().toLowerCase()]?'<div style="font-weight:600;">'+Te(t.label)+"</div>":'<input type="text" placeholder="What is it?" value="'+Te(t.label)+`" oninput="budWizField('`+t.id+`','label',this.value)" style="width:100%;">`,a=t.hint?'<div class="budwiz-hint">'+Te(t.hint)+"</div>":"",c=Hg(t.label,t.annual,window._budget),d=c?'<div class="budwiz-nudge" id="bw-n-'+t.id+'">'+(c==="low"?"Well below typical ("+W(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+W(n)+"/mo) — worth double-checking.")+"</div>":'<div class="budwiz-nudge" id="bw-n-'+t.id+'"></div>';return'<div class="budwiz-row" id="bw-row-'+t.id+'"><div class="budwiz-name">'+o+a+'</div><div class="budwiz-amt"><input type="text" inputmode="decimal" id="bw-amt-'+t.id+`" placeholder="£ or e.g. =12+9.50" title="Amount in today's money — sums welcome: 11.99+8.99, =4×52/12" value="`+B1(t)+`" onchange="budWizAmount('`+t.id+`',this.value,this)" style="flex:1 1 auto; min-width:0;"><button type="button" class="risk-btn" style="padding:6px 9px;" title="Switch monthly / yearly" onclick="budWizTogglePeriod('`+t.id+`')">/`+e+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" style="padding:6px 9px;" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bw','`+t.id+`')">&Sigma;</button></div><div class="budwiz-chipslot">`+(r?`<button type="button" class="budwiz-chip" onclick="budWizUseTypical('`+t.id+`')" title="ONS retired-household average — a starting point">`+r+" — use</button>":"")+"</div>"+(window._budget.sharedWithPartner?kl(t,"budWizField"):"")+(wa(t)?'<input type="number" placeholder="from age" title="From age (blank = retirement)" value="'+(t.fromAge??"")+`" oninput="budWizField('`+t.id+`','fromAge',this.value)" style="flex:0 0 78px;"><input type="number" placeholder="to age" title="To age (blank = end of plan). E.g. a car lease with 3 years left: to retirement age + 3." value="`+(t.toAge??"")+`" oninput="budWizField('`+t.id+`','toAge',this.value)" style="flex:0 0 78px;">`:"")+'<button type="button" class="risk-btn'+(wa(t)?" active":"")+'" style="padding:6px 9px;" title="'+(wa(t)?"Remove the age limits — make this a whole-of-retirement cost again":"Assumed for the whole retirement. Click to limit it to an age range — for temporary costs like a lease or a mortgage that ends.")+`" onclick="budWizBandToggle('`+t.id+`')">&#x23F1;</button><button type="button" class="risk-btn" style="padding:6px 11px;" title="Remove" onclick="budWizRemove('`+t.id+`')">&times;</button><div id="bw-err-`+t.id+'" class="budwiz-err"></div>'+d+(t.breakdownOpen?'<div style="flex-basis:100%;">'+i0("bw",t)+"</div>":"")+"</div>"}window.budWizField=function(t,e,n){const s=window._budget.lines.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="fromAge"||e==="toAge"?s[e]=n===""?null:Pl(n):s[e]=n===""?null:+n,e==="paidBy"&&St(!0),budTouch(),gi())};window.budWizAmount=function(t,e,n){const s=window._budget.lines.find(o=>o.id===t);if(!s)return;const r=document.getElementById("bw-err-"+t),i=String(e).trim();if(i==="")s.annual=null,r&&(r.textContent="");else{const o=Cs(i);if(o==null){r&&(r.textContent="Couldn’t read that — a number or a simple sum like 12.99+8.50 works.");return}r&&(r.textContent=""),s.annual=(s.period||"yr")==="mo"?o*12:o,n&&(n.value=(s.period||"yr")==="mo"?Math.round(s.annual/12):s.annual)}jc(s),budTouch(),gi()};function jc(t){const e=document.getElementById("bw-n-"+t.id);if(!e)return;const n=ci(t.label,window._budget),s=Hg(t.label,t.annual,window._budget);e.textContent=s?s==="low"?"Well below typical ("+W(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+W(n)+"/mo) — worth double-checking.":""}function Pl(t){const e=+t;if(!Number.isFinite(e))return null;if(e>1e3){const n=new Date().getFullYear()-(+window._budget.currentAge||0);return Math.max(0,e-n)}return e}function wa(t){return t.fromAge!=null||t.toAge!=null||t._bandOpen}window.budWizBandToggle=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(wa(e)?(e._bandOpen=!1,e.fromAge=null,e.toAge=null,budTouch()):e._bandOpen=!0,St(!0))};window.budWizTogglePeriod=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch(),St(!0))};window.budWizUseTypical=function(t){const e=window._budget.lines.find(s=>s.id===t);if(!e)return;const n=ci(e.label,window._budget);n!=null&&(e.annual=n*12,budTouch(),St(!0))};window.budWizRemove=function(t){const e=window._budget.lines.findIndex(n=>n.id===t);e<0||(Cl("line",window._budget.lines[e],e),window._budget.lines.splice(e,1),budTouch(),St(!0))};window.budWizAddLine=function(t){const e=Fo.find(n=>n.key===t);window._budget.lines.push({id:It(),label:"",tier:e&&e.tier||"discretionary",annual:null,fromAge:null,toAge:null,period:"mo",wizGroup:t}),budTouch(),St(!0)};window.budWizSuggest=function(t,e){const n=ro(window._budget).find(s=>s.label===t);n&&(window._budget.lines.push({id:It(),label:n.label,tier:n.tier,annual:null,fromAge:null,toAge:null,hint:n.hint||"",period:n.period||"yr",paidBy:n.paidBy||"me",wizGroup:e}),budTouch(),St(!0))};const mi=t=>window._budget.lines.find(e=>e.id===t);function Fu(t){if(t==="bw"){St(!0);return}const e=window.scrollY;ct(),_e(),window.scrollTo(0,e)}function i0(t,e){return'<div style="background:var(--card-alt); border:1px solid var(--border); border-radius:8px; padding:10px; margin-top:6px;"><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Break it into parts — mix /mo and /yr freely; sums (or =sums) are fine in each box. The total is written to the line for you, and the parts are saved.</div>'+(e.breakdown||[]).map((s,r)=>'<div style="display:flex; gap:6px; margin-bottom:6px; align-items:center;"><input type="text" placeholder="'+(r===0?"e.g. insurance":r===1?"e.g. fuel":"part "+(r+1))+'" value="'+Te(s.label)+`" oninput="budBreakField('`+t+"','"+e.id+"',"+r+`,'label',this.value)" style="flex:1 1 auto; min-width:0;"><input type="text" inputmode="decimal" placeholder="£ or =12+8" value="`+(s.amount??"")+`" onchange="budBreakField('`+t+"','"+e.id+"',"+r+`,'amount',this.value,this)" style="flex:0 0 104px;"><button type="button" class="risk-btn" style="padding:4px 8px;" title="This part is per month / per year" onclick="budBreakTogglePeriod('`+t+"','"+e.id+"',"+r+',this)">/'+(s.period||"yr")+`</button><button type="button" class="risk-btn" style="padding:4px 9px;" title="Remove part" onclick="budBreakRemoveRow('`+t+"','"+e.id+"',"+r+')">&times;</button></div>').join("")+`<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;"><button type="button" class="risk-btn" style="padding:4px 12px;" onclick="budBreakAddRow('`+t+"','"+e.id+`')">+ add part</button><div style="font-size:13px;">Adds up to <strong id="`+t+"-bsum-"+e.id+'">'+o0(e)+"</strong></div></div></div>"}function o0(t){const e=ru(t.breakdown);return(t.period||"yr")==="mo"?W(e/12)+"/mo":W(e)+"/yr"}function Vu(t,e){const n=mi(e);if(!n)return;if((n.breakdown||[]).some(r=>+r.amount)){n.annual=ru(n.breakdown);const r=document.getElementById(t+"-amt-"+e);r&&(r.value=(n.period||"yr")==="mo"?Math.round(n.annual/12):n.annual)}const s=document.getElementById(t+"-bsum-"+e);s&&(s.textContent=o0(n)),t==="bw"?(gi(),typeof jc=="function"&&jc(n)):_e(),budTouch()}window.budBreakToggle=function(t,e){const n=mi(e);n&&(n.breakdownOpen=!n.breakdownOpen,n.breakdownOpen&&!Array.isArray(n.breakdown)&&(n.breakdown=[{label:"",amount:null,period:"mo"},{label:"",amount:null,period:"mo"}]),budTouch(),Fu(t))};window.budBreakAddRow=function(t,e){const n=mi(e);n&&((n.breakdown=n.breakdown||[]).push({label:"",amount:null,period:"mo"}),Fu(t))};window.budBreakRemoveRow=function(t,e,n){const s=mi(e);!s||!s.breakdown||(s.breakdown.splice(n,1),Vu(t,e),Fu(t))};window.budBreakField=function(t,e,n,s,r,i){const o=mi(e),a=o&&o.breakdown&&o.breakdown[n];if(!a)return;if(s==="label"){a.label=r,budTouch();return}const c=String(r).trim();if(c==="")a.amount=null;else{const d=Cs(c);if(d==null)return;a.amount=d,i&&(i.value=d)}Vu(t,e)};window.budBreakTogglePeriod=function(t,e,n,s){const r=mi(e),i=r&&r.breakdown&&r.breakdown[n];i&&(i.period=(i.period||"yr")==="mo"?"yr":"mo",s&&(s.textContent="/"+i.period),Vu(t,e))};function N1(t){return'<div class="budwiz-row"><input type="text" placeholder="e.g. Replacement car" value="'+Te(t.label)+`" oninput="budWizOneOff('`+t.id+`','label',this.value)" style="flex:1 1 170px; min-width:150px;"><input type="text" inputmode="decimal" placeholder="£ total" title="Total cost in today's money — sums welcome" value="`+(t.amount??"")+`" onchange="budWizOneOffAmount('`+t.id+`',this.value,this)" style="flex:0 0 110px;"><input type="number" placeholder="at age" title="Age it first happens" value="`+(t.atAge??"")+`" oninput="budWizOneOff('`+t.id+`','atAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="every N yrs" title="Blank = one-time" value="`+(t.everyYears??"")+`" oninput="budWizOneOff('`+t.id+`','everyYears',this.value)" style="flex:0 0 104px;">`+(window._budget.sharedWithPartner?kl(t,"budWizOneOff"):"")+`<button type="button" class="risk-btn" style="padding:4px 10px;" onclick="budWizRemoveOneOff('`+t.id+`')">&times;</button><div id="bw-oerr-`+t.id+'" class="budwiz-err"></div></div>'}window.budWizOneOff=function(t,e,n){const s=window._budget.oneOffs.find(r=>r.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="atAge"?s[e]=n===""?null:Pl(n):s[e]=n===""?null:+n,e==="paidBy"&&St(!0),budTouch(),gi())};window.budWizOneOffAmount=function(t,e,n){const s=window._budget.oneOffs.find(o=>o.id===t);if(!s)return;const r=document.getElementById("bw-oerr-"+t),i=String(e).trim();if(i==="")s.amount=null,r&&(r.textContent="");else{const o=Cs(i);if(o==null){r&&(r.textContent="Couldn’t read that — a number or a simple sum works.");return}r&&(r.textContent=""),s.amount=o,n&&(n.value=o)}budTouch(),gi()};window.budWizAddOneOff=function(){window._budget.oneOffs.push({id:It(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),budTouch(),St(!0)};window.budWizRemoveOneOff=function(t){const e=window._budget.oneOffs.findIndex(n=>n.id===t);e<0||(Cl("oneOff",window._budget.oneOffs[e],e),window._budget.oneOffs.splice(e,1),budTouch(),St(!0))};window.budWizClearAmounts=function(){for(const t of window._budget.lines)t.annual=null;for(const t of window._budget.oneOffs)t.amount=null;budTouch(),St(),showToast("Amounts cleared — nothing is saved until you choose Save.","info",4e3)};window.budWizSave=async function(t){await saveBudgetUI(),t&&await applyBudgetToPlan(),closeBudgetWizard()};function gi(){const t=document.getElementById("budWizTotals");if(!t)return;const e=window._budget,n=di(e);t.innerHTML="Essential <strong>"+W(n.essentialMonthlyNet)+"</strong>/mo · Lifestyle <strong>"+W(n.comfortableMonthlyNet-n.essentialMonthlyNet)+"</strong>/mo · All-in"+(n.sharedWithPartner?" (your share)":"")+' <strong style="color:var(--primary,#6366f1);">'+W(n.allInComfortableMonthly)+"</strong>/mo"}function O1(t){if(t==="intro"){const i=window._budget.lines.some(c=>c.annual)||window._budget.oneOffs.some(c=>c.amount)?'<div class="alert alert-warning" style="margin-bottom:12px;"><strong>You already have a saved budget</strong> — the totals in the bar below are your own saved figures, and each screen shows them ready to edit. Prefer a clean slate? <button type="button" class="risk-btn" style="padding:4px 12px; margin-left:4px;" onclick="budWizClearAmounts()">Start fresh — clear all amounts</button><span style="color:var(--text-muted);"> (nothing is saved until you choose Save at the end)</span></div>':"",o=Do(window._budget),a=(c,d)=>'<button type="button" class="risk-btn'+(o===c?" active":"")+'" data-tier="'+c+`" onclick="setPlsaTier('`+c+`')">`+d+"</button>";return'<h2 style="margin-bottom:10px;">Let’s build your budget</h2><p style="margin-bottom:12px;">We’ll walk through your spending one category at a time — bills first, then the fun stuff, then the big occasional costs. Skip anything; you can come back any time.</p>'+i+'<div style="margin-bottom:12px;"><div style="font-size:15px; margin-bottom:6px;"><strong>What are you aiming for?</strong> <span style="color:var(--text-muted);">— sets every typical-£ suggestion</span></div><div id="budWizTierBtns" style="display:flex; gap:8px; flex-wrap:wrap;">'+a("minimum","Minimum")+a("moderate","Moderate")+a("comfortable","Comfortable")+'</div><div style="font-size:13px; color:var(--text-muted); margin-top:6px;">PLSA Retirement Living Standards: Minimum = essentials, no car; Moderate = a car + two weeks in Europe; Comfortable = more of everything.</div></div><div class="alert alert-info" style="margin-bottom:12px;"><strong>Before you start:</strong> open your banking app and look at the last 2–3 months of statements. Real numbers beat guesses — most people who guess miss 20% of their spending.</div><ul style="padding-left:18px; color:var(--text-muted); line-height:1.8;"><li>Every amount box is a <strong>calculator</strong> — type <code>11.99+8.99+5.99</code> or <code>4×52/12</code> and it does the maths.</li><li><strong>Typical UK figures</strong> (ONS retired households) appear as one-tap chips when you’re unsure.</li><li>The <strong>&Sigma;</strong> button breaks a cost into parts (fuel + insurance + MOT…) so nothing gets forgotten.</li><li>Everything is in <strong>today’s money</strong>.</li>'+(window._budget.sharedWithPartner?"<li>Mark each line <strong>Me / Partner / Shared</strong> — your plan funds your share; your partner sees theirs.</li>":"")+"</ul>"}if(t==="oneoffs")return'<h2 style="margin-bottom:6px;">One-off & periodic costs</h2><p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">Big costs that land in a specific year: cars, roofs, weddings, milestone trips, helping the kids. Give recurring ones an "every N years" and we average them into your monthly need; one-time items stay as dated events.</p>'+(window._budget.oneOffs.map(N1).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing yet — add the big things below.</p>')+'<button type="button" class="risk-btn" style="margin-top:10px;" onclick="budWizAddOneOff()">+ Add a one-off</button>';if(t==="review"){const r=di(window._budget),i=Fg.single,o=r.allInComfortableAnnual,a=o>=i.comfortable?"at or above <strong>Comfortable</strong>":o>=i.moderate?"between <strong>Moderate</strong> and <strong>Comfortable</strong>":o>=i.minimum?"between <strong>Minimum</strong> and <strong>Moderate</strong>":"below the <strong>Minimum</strong>";let c='<h2 style="margin-bottom:10px;">Your spending picture</h2><div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;"><div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(r.sharedWithPartner?" — your share":"")+'</div><div style="font-size:24px;font-weight:700;">'+W(r.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div><div><div style="font-size:12px;color:var(--text-muted);">'+(r.sharedWithPartner?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:28px;font-weight:800;color:var(--primary,#6366f1);">'+W(r.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+W(o)+"/yr — what your plan funds</div></div>";r.sharedWithPartner&&(c+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:24px;font-weight:700;">'+W(r.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">their side — they can plan with this</div></div>'),c+="</div>",c+='<div class="alert alert-info" style="margin-bottom:14px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+W(i.minimum)+" · Moderate "+W(i.moderate)+" · Comfortable "+W(i.comfortable)+" per year — you’re "+a+'. <span style="color:var(--text-muted);">(Home owned outright; excludes care costs.)</span></div>';const d=ro(window._budget).slice(0,8);return d.length&&(c+='<div style="margin-bottom:14px;"><div style="font-size:13px; margin-bottom:6px;"><strong>Did you miss anything?</strong> Tap to add, then find it on its category screen:</div><div style="display:flex; flex-wrap:wrap; gap:6px;">'+d.map(h=>'<button type="button" class="budwiz-chip" title="'+Te(h.hint||"")+`" onclick="budWizSuggest('`+Te(h.label).replace(/'/g,"\\'")+`', null)">+ `+Te(h.label)+"</button>").join("")+"</div></div>"),c+='<div style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">Everything is saved automatically as you type.</div>',c+='<div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:6px;"><button type="button" onclick="budWizSave(false)">Done</button><button type="button" onclick="budWizSave(true)">Set as my plan’s target (Stress + Decision) &amp; finish</button></div>',c}const e=Fo.find(r=>r.key===t),n=window._budget.lines.filter(r=>D1(r)===e.key),s=ro(window._budget).filter(r=>(Ou[r.label.toLowerCase()]||"extras")===e.key);return'<h2 style="margin-bottom:6px;">'+e.title+'</h2><div class="alert alert-info" style="margin-bottom:10px; font-size:13px;">'+e.tip+"</div>"+(n.map(L1).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing here yet — add below.</p>')+`<div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; align-items:center;"><button type="button" class="risk-btn" onclick="budWizAddLine('`+e.key+`')">+ Add your own</button>`+(s.length?'<span style="font-size:12px;color:var(--text-muted);">Often forgotten:</span>'+s.map(r=>'<button type="button" class="budwiz-chip" title="'+Te(r.hint||"")+`" onclick="budWizSuggest('`+Te(r.label).replace(/'/g,"\\'")+"','"+e.key+`')">+ `+Te(r.label)+"</button>").join(""):"")+"</div>"}function St(t=!1){const e=document.getElementById("budWizardOverlay"),n=e.querySelector(".budwiz-body"),s=t&&n?n.scrollTop:0,r=Oi[Vn],i=Vn===Oi.length-1,o=Oi.map((a,c)=>'<span class="budwiz-dot '+(c===Vn?"on":c<Vn?"done":"")+'"></span>').join("");e.innerHTML='<div class="budwiz-shell"><div class="budwiz-head" style="display:flex; justify-content:space-between; align-items:center;"><div style="font-size:13px; color:var(--text-muted);">Budget walk-through · step '+(Vn+1)+" of "+Oi.length+'</div><button type="button" class="risk-btn" style="padding:4px 12px;" title="Close (your entries are kept)" onclick="closeBudgetWizard()">&times;</button></div><div class="budwiz-body">'+O1(r)+'</div><div class="budwiz-foot"><button type="button" class="risk-btn" onclick="budWizGo(-1)"'+(Vn===0?" disabled":"")+">Back</button>"+(i?"":'<button type="button" onclick="budWizGo(1)">'+(r==="intro"?"Start":"Next")+"</button>")+'<div class="budwiz-dots">'+o+'</div><div id="budWizUndoSlot" style="font-size:13px; color:var(--text-muted);"></div><div id="budWizTotals" style="margin-left:auto; font-size:13px; color:var(--text-muted);"></div></div></div>',gi(),e.querySelector(".budwiz-body").scrollTop=s}window.openStressExplainer=function(t){let e=document.getElementById("stressExplainer");e&&e.remove(),e=document.createElement("div"),e.id="stressExplainer",e.style.cssText="position:fixed; inset:0; z-index:1300; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; padding:20px;",e.innerHTML=`<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; max-width:720px; width:100%; max-height:88vh; overflow-y:auto; padding:28px; font-size:15px; line-height:1.65;"><h2 style="margin-bottom:4px;">What the Stress Tester is doing</h2><p style="color:var(--text-muted); margin-bottom:18px;">Every run asks the same question — <em>“if the future looked like this, would your money last?”</em> — and simulates your plan month by month: withdrawals sized to your spending need, tax paid, the ISA bridge drawn tax-free, protection mode in downturns. The three tabs differ only in <strong>where the “future” comes from</strong>.</p><div id="sx-mc" style="border-left:3px solid var(--primary,#6366f1); padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">🎲 Monte Carlo — a thousand plausible futures</h3><p style="color:var(--text-muted);">We deal 1,000 different futures by <strong>shuffling real history</strong>: each simulated year is a randomly-drawn year from 1928–2024, keeping that year’s stock market return and inflation together as they actually happened. Your plan is run through all 1,000; the headline number is how many survive. It answers: <em>“across a wide spread of plausible futures, what are my odds?”</em></p></div><div id="sx-hist" style="border-left:3px solid #14b8a6; padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">📜 Historical — every real retirement since 1928</h3><p style="color:var(--text-muted);">No shuffling: we replay history <strong>in order</strong>, once for every possible start year — retiring into 1929, into 1966, into 1973, into 2000… This is the classic sequence-of-returns test: the <em>order</em> of good and bad years matters as much as the average, and this tab shows exactly which real-world start years would have sunk your plan.</p></div><div id="sx-scen" style="border-left:3px solid #e67e22; padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">🔥 Scenarios — named nightmares, on repeat</h3><p style="color:var(--text-muted);">Five hand-picked 10-year sequences — the Great Depression, 1970s stagflation, the 2000s lost decade, 2008, and a synthetic worst-case — <strong>looped for your whole horizon</strong>. Deliberately unfair: a 35-year plan gets the 1970s three and a half times over. If your plan survives these, sequence risk is well covered; treat them as a stress rig, not a forecast.</p></div><h3 style="margin:20px 0 6px;">How each asset category is modelled</h3><p style="color:var(--text-muted); margin-bottom:8px;">Every future is built from just <strong>two primitives per year: the equity return and inflation</strong>. Everything else is derived from them, the same way in all three tabs:</p><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:12px; line-height:1.8;"><li><strong>Shares</strong> (trackers, income, REITs, EM, small-cap) ride the equity path directly.</li><li><strong>Bonds</strong> earn their own yield, and gain or lose as a <strong>gilt-yield path derived from inflation</strong> moves — so long gilts crash in a 2022-style inflation spike (big duration × rising yields) and rally in a 2008-style flight to quality. Your own bond-class mix (short gilts, linkers, credit…) drives the blend.</li><li><strong>Diversifiers</strong>: gold hedges inflation and tends to rise in crashes; trend-following holds a lagged momentum position (pays in long grinding bear markets, whipsaws in V-shapes); commodities hedge inflation hardest but fall <em>with</em> shares in a demand shock.</li><li><strong>Cash</strong> follows a rate model tied to inflation (roughly −1% real — the FCA convention).</li><li><strong>Your ISA</strong>: if you tagged your own funds, it’s modelled at <em>its</em> mix through all of the above; with a risk level only, it grows at a deliberately modest flat rate (the cash-like “bridge”).</li></ul><h3 style="margin:16px 0 6px;">Are the asset classes correlated? Yes — three ways</h3><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:12px; line-height:1.8;"><li><strong>Equity↔inflation:</strong> years are sampled (or replayed) whole, so “bad market + high inflation” arrive together exactly as often as they did in real history.</li><li><strong>Structural:</strong> bonds are mechanically linked to inflation through the yield path; gold, commodities and trend are functions of the same two primitives.</li><li><strong>Regime-aware residuals:</strong> each bond and diversifier class carries a correlation to equities that <em>changes with the regime</em> — in a normal year gilts barely co-move; in an inflation shock everything falls together (2022); in a deflationary crash gilts flip <em>negative</em> (flight to quality) while credit blows out <em>with</em> equities.</li></ul><h3 style="margin:16px 0 6px;">Honest limitations</h3><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:16px; line-height:1.8;"><li>In Historical replays, only shares-and-inflation are literal history — bond, gold and commodity returns are <em>model-implied</em> from those primitives, not the measured returns of that year.</li><li>Monte Carlo samples each year independently — real markets have some momentum and mean-reversion it doesn’t capture (the Historical tab covers that gap).</li><li>Categories are modelled, not individual funds — your specific fund can beat or trail its category.</li><li>The calibration figures are long-run estimates, not predictions. This is modelling, not advice.</li></ul><button type="button" onclick="document.getElementById('stressExplainer').remove()">Got it</button></div>`,e.addEventListener("click",s=>{s.target===e&&e.remove()}),document.body.appendChild(e);const n={mc:"sx-mc",hist:"sx-hist",scen:"sx-scen"}[t];if(n){const s=document.getElementById(n);s&&(s.scrollIntoView({block:"start"}),s.style.background="rgba(99,102,241,0.08)")}};let go="funds",ns=null,dn=null,ti=[];window.openAdminPanel=function(){const t=EA();if(t){const e=prompt("Admin passphrase:");if(e!==t){e!==null&&showToast("Wrong passphrase","error");return}}ns=El().map(e=>({...e})),dn=JSON.parse(JSON.stringify(_A()||{})),document.getElementById("adminPanelOverlay").style.display="block",as()};window.closeAdminPanel=function(){document.getElementById("adminPanelOverlay").style.display="none"};window.adminSetTab=function(t){go=t,as(!0)};function F1(t,e){const n=ry();let s="";for(const r of["shares","bonds","diversifiers","cash"]){const i=n[r]||[];s+='<optgroup label="'+Ru[r]+'">'+i.map(o=>'<option value="'+o.key+'"'+(o.key===e?" selected":"")+">"+o.label+"</option>").join("")+"</optgroup>"}return'<select onchange="adminFundField('+t+`,'subClass',this.value)" style="width:200px;">`+s+"</select>"}window.adminFundField=function(t,e,n){const s=ns[t];s&&(s[e]=e==="ticker"?String(n).toUpperCase():n)};window.adminFundRemove=function(t){ns.splice(t,1),as(!0)};window.adminFundAdd=function(){ns.push({ticker:"",name:"",subClass:"worldGrowth"}),as(!0)};window.adminSaveFunds=async function(){try{const t=await IA(ns);mr("ss",!0),mr("ds",!0),showToast("Fund catalogue saved to cloud ("+t+" funds) — live for all users.","success")}catch(t){showToast("Save failed: "+t.message,"error")}};window.adminRevertFunds=async function(){if(await appConfirm("Remove the cloud fund-catalogue override and return to the shipped default list?"))try{await SA(),ns=El().map(t=>({...t})),mr("ss",!0),mr("ds",!0),as(!0),showToast("Reverted to the shipped catalogue.","success")}catch(t){showToast("Revert failed: "+t.message,"error")}};window.adminProfileField=function(t,e,n){const s=du[t][e],r=n===""?void 0:+n;r===void 0||!Number.isFinite(r)||r===s?dn[t]&&(delete dn[t][e],Object.keys(dn[t]).length||delete dn[t]):(dn[t]=dn[t]||{})[e]=r};window.adminSaveProfiles=async function(){try{await Ey(dn),showToast(Object.keys(dn).length?"Category model overrides saved — live for all users.":"No overrides — shipped calibration active.","success")}catch(t){showToast("Save failed: "+t.message,"error")}};window.adminResetProfiles=async function(){if(await appConfirm("Clear ALL category-model overrides and return to the shipped calibration?")){dn={};try{await Ey(null),as(!0),showToast("Shipped calibration restored.","success")}catch(t){showToast("Reset failed: "+t.message,"error")}}};window.adminLoadSuggestions=async function(){try{ti=await AA(),as(!0)}catch(t){showToast("Could not load suggestions: "+t.message,"error")}};window.adminSuggestionToFunds=function(t){const e=ti[t];e&&(ns.push({ticker:e.ticker,name:e.name||"",subClass:e.subClass||"worldGrowth"}),adminDeleteSuggestion(t,!0),go="funds",as(!0),showToast(e.ticker+' added to the funds editor — press "Save to cloud" to publish.',"info",4500))};window.adminDeleteSuggestion=async function(t,e){const n=ti[t];if(n){ti.splice(t,1);try{await kA(n.id)}catch{}e||as(!0)}};function V1(){if(go==="funds"){const e=ns.map((n,s)=>'<tr><td><input type="text" value="'+Te(n.ticker)+'" oninput="adminFundField('+s+`,'ticker',this.value)" style="width:80px;text-transform:uppercase;"></td><td><input type="text" value="`+Te(n.name)+'" oninput="adminFundField('+s+`,'name',this.value)" style="width:280px;"></td><td>`+F1(s,n.subClass)+'</td><td><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminFundRemove('+s+')">&times;</button></td></tr>').join("");return'<p style="font-size:13px;color:var(--text-muted);">The shared catalogue every user sees. Saving publishes a cloud override; revert returns to the list shipped in code. Each fund’s category decides which model it runs through.</p><div style="display:flex;gap:8px;margin:8px 0;"><button type="button" class="risk-btn" onclick="adminFundAdd()">+ Add fund</button><button type="button" onclick="adminSaveFunds()">Save to cloud</button><button type="button" class="risk-btn" onclick="adminRevertFunds()">Revert to shipped list</button><span style="font-size:12px;color:var(--text-muted);align-self:center;">'+ns.length+' funds</span></div><div style="overflow-x:auto;"><table style="font-size:13px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Ticker</th><th style="text-align:left;">Name</th><th style="text-align:left;">Category (model)</th><th></th></tr></thead><tbody>'+e+"</tbody></table></div>"}if(go==="categories"){const e=["nominalReturn","yield","vol","eqCorr","duration","inflationBeta","creditBeta","idioVol"],n=Object.entries(du).map(([s,r])=>{const i=dn[s]||{},o=e.map(a=>{if(r[a]===void 0&&i[a]===void 0)return'<td style="color:var(--text-muted);text-align:center;">—</td>';const c=i[a]!==void 0?i[a]:r[a],d=i[a]!==void 0;return'<td><input type="number" step="0.001" value="'+c+'" title="Shipped default: '+r[a]+`" onchange="adminProfileField('`+s+"','"+a+`',this.value)" style="width:74px;`+(d?"border-color:#eab308;":"")+'"></td>'}).join("");return'<tr><td style="white-space:nowrap;"><strong>'+r.label+'</strong><br><span style="font-size:11px;color:var(--text-muted);">'+s+" · "+r.bucket+"</span></td>"+o+"</tr>"}).join("");return'<p style="font-size:13px;color:var(--text-muted);">The calibration seeds behind each category’s model (nominal figures; see SubAssetModel.js for the driver decomposition). Amber border = overridden vs shipped. Changes go live for all users on save — tune with care; the golden tests only protect the shipped values.</p><div style="display:flex;gap:8px;margin:8px 0;"><button type="button" onclick="adminSaveProfiles()">Save overrides to cloud</button><button type="button" class="risk-btn" onclick="adminResetProfiles()">Reset all to shipped</button></div><div style="overflow-x:auto;"><table style="font-size:12px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Category</th>'+e.map(s=>"<th>"+s+"</th>").join("")+"</tr></thead><tbody>"+n+"</tbody></table></div>"}return'<p style="font-size:13px;color:var(--text-muted);">Unknown tickers users categorised themselves. “Add to funds” copies one into the Funds editor (publish from there).</p><button type="button" class="risk-btn" onclick="adminLoadSuggestions()" style="margin:8px 0;">Refresh</button><div style="overflow-x:auto;"><table style="font-size:13px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Ticker</th><th style="text-align:left;">Chosen category</th><th style="text-align:left;">Name</th><th></th></tr></thead><tbody>'+(ti.length?ti.map((e,n)=>"<tr><td><strong>"+Te(e.ticker)+"</strong></td><td>"+Te(e.subClass||"(none)")+'</td><td style="color:var(--text-muted);">'+Te(e.name||"")+'</td><td><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminSuggestionToFunds('+n+')">Add to funds</button> <button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminDeleteSuggestion('+n+')">Dismiss</button></td></tr>').join(""):'<tr><td colspan="4" style="color:var(--text-muted);">Nothing loaded — press Refresh.</td></tr>')+"</tbody></table></div>"}function as(t=!1){const e=document.getElementById("adminPanelOverlay"),n=e.querySelector(".budwiz-body"),s=t&&n?n.scrollTop:0,r=(i,o)=>'<button type="button" class="risk-btn'+(go===i?" active":"")+`" onclick="adminSetTab('`+i+`')">`+o+"</button>";e.innerHTML='<div class="budwiz-shell"><div class="budwiz-head" style="display:flex; justify-content:space-between; align-items:center;"><div style="display:flex; gap:8px; align-items:center;"><strong>⚙ Administration</strong>'+r("funds","Funds")+r("categories","Category models")+r("suggestions","Suggestions")+'</div><button type="button" class="risk-btn" style="padding:4px 12px;" onclick="closeAdminPanel()">&times;</button></div><div class="budwiz-body">'+V1()+"</div></div>",e.querySelector(".budwiz-body").scrollTop=s}let Kc=!1,Qc=!1;async function yi(){try{const t=await Ze();return!!(t&&t.locked)}catch(t){return console.warn("Could not read decision settings for lock state:",t),!1}}async function a0(){try{const[t,e,n]=await Promise.all([Ze(),zs({limit:1e3}),os()]);if(n&&Object.values(n).some(i=>i&&i.yearSetupComplete))return!0;const s=ey(t);return(Array.isArray(e)?e:[]).some(i=>i.settingsChecksum===void 0||i.settingsChecksum===s)}catch(t){return console.warn("Could not determine derived-data state:",t),!0}}function lp(t){const e=document.getElementById("decision-decisionsettings");e&&e.querySelectorAll("input, select, textarea, button").forEach(n=>{n.closest("#dsLockBanner")||n.id!=="dsSaveBtn"&&(n.disabled=!t)})}async function zu(){const t=document.getElementById("dsLockBanner"),e=document.getElementById("dsSaveBtn");if(!(!t||!e)){if(Kc=await yi(),!Kc){t.style.display="none",lp(!0),e.textContent="Save Settings",e.classList.remove("btn-locked"),Uc();return}Qc=!await a0(),t.style.display="flex",t.className="lock-banner",Qc?t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Nothing has been recorded against them yet — no tax years, no monthly entries — so you can unlock and edit them.</span><button type="button" onclick="unlockDecisionSettings()">Unlock to edit</button>':t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Tax years or monthly entries have been recorded against them, so they can’t be changed. To use different settings, create a new plan.</span><button type="button" onclick="createNewPlanForSettings()">Create new plan</button>',lp(!1),e.textContent="🔒 Locked",e.classList.add("btn-locked"),Uc()}}window.unlockDecisionSettings=async function(){if(await a0()){showToast("Can’t unlock — tax years or entries now depend on these settings. Create a new plan.","warning"),await zu();return}_t("Unlocking…");try{await ur({locked:!1}),await Al(),showToast("Settings unlocked — you can edit them now.","success")}catch(t){console.error("Unlock error:",t),showToast("Could not unlock: "+t.message,"error")}finally{Tt()}};window.createNewPlanForSettings=function(){const t=document.getElementById("scenarioNewBtn");t&&t.click()};window.saveDecisionSettingsUI=async function(){if(!lt()){showToast("Please sign in to save settings","error");return}if(Kc||await yi()){showToast(Qc?"These settings are locked. Use “Unlock to edit” above to change them.":"These settings are locked. Define a new plan to use different settings.","info");return}const t=vl(document.getElementById("dsSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ds");if(await ku(e.equityMin,e.bondMin,e.cashTarget)){_t("Saving settings...");try{await ur({configured:!0,accessMethod:document.getElementById("dsAccessMethod").value||"drawdown",ufplsYears:+document.getElementById("dsUfplsYears").value||null,ufplsThenPcls:document.getElementById("dsUfplsPcls").checked,bandFillRecycle:document.getElementById("dsBandFillRecycle").checked,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("dsDuration").value,equityGlideEnabled:document.getElementById("dsEquityGlide").checked,baseSalary:+document.getElementById("dsBaseSalary").value,spendingProfile:document.getElementById("dsSpendingProfile").value||"flat",spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,disableProtection:document.getElementById("dsDisableProtection").checked,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value,isaBalance:+document.getElementById("dsIsaBalance").value||0,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:Pu("ds"),taggedFunds:Ht("ds").filter(n=>n.ticker&&n.value>0),locked:!0});try{const n=await Ze(),s=.04;await TS({savedAt:new Date().toISOString(),assumedCpi:s,baseSalary:n.baseSalary,drawdown:yu({...n,taxMode:n.taxMode||"inflates",pa:n.pa||12570,brl:n.brl||50270,hrl:n.hrl||125140},n.duration||35,s).map(r=>({year:r.year,sippDraw:Math.round(r.sippDraw),tax:Math.round(r.tax),isaDraw:Math.round(r.isaDraw),isaBalance:Math.round(r.isaBalance),spendable:Math.round(r.spendable)})),glidepath:cy(n,s).map(r=>({year:r.year,totalMin:Math.round(r.totalMin)}))})}catch(n){console.warn("Plan-of-record snapshot failed (non-fatal):",n)}Il(),updateNextStepBanner(),showToast("Settings saved and locked. Create a new plan to use different settings.","success",4e3),await zu()}catch(n){console.error("Error saving decision settings:",n),showToast("Error saving: "+n.message,"error")}finally{Tt()}}};window.resetDecisionSettingsUI=async function(){if(await appConfirm("Reset all decision settings to defaults?")){_t("Resetting settings...");try{await ur({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await Al(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{Tt()}}};window.showDrawdownScheduleUI=async function(){const t=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const n=await qe();n.duration=e;const s=yu(n,e,t);let r='<div class="card"><h2>Projected Drawdown Schedule (SIPP + ISA bridge)</h2>';r+='<div class="alert alert-info" style="margin-bottom:16px;">SIPP is drawn to fill the basic-rate band; the tax-free <strong>ISA tops your income up to the target</strong> and runs down over the years (the bridge to the State Pension). Deterministic projection at your assumed inflation — the stochastic ISA path is in the Monte-Carlo / Historical results.</div>',r+='<div style="overflow-x: auto;"><table>',r+="<thead><tr><th>Year</th><th>SIPP Draw</th><th>State</th><th>Tax</th><th>Net (SIPP+SP)</th><th>ISA Top-up</th><th>Spendable</th><th>ISA Left</th></tr></thead>",r+="<tbody>";for(const i of s)r+=`<tr>
            <td>${i.year}</td>
            <td style="color: var(--primary); font-weight: 600;">${j(i.sippDraw)}</td>
            <td>${j(i.statePension)}</td>
            <td style="color: var(--danger);">-${j(i.tax)}</td>
            <td>${j(i.netIncome)}</td>
            <td style="color: var(--info);">${j(i.isaDraw)}</td>
            <td style="color: var(--success); font-weight: 600;">${j(i.spendable)}</td>
            <td>${j(i.isaBalance)}</td>
          </tr>`;r+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=r}catch(n){console.error("Drawdown error:",n),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};window.showGlidepathUI=async function(){const t=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const n=await qe();n.duration=e;const s=cy(n,t),r=yu(n,e,t),i={};r.forEach(h=>{i[h.year]=h.isaBalance});const o=!!n.equityGlideEnabled,a=(n.diversifierStart||0)>0,c=!!n.hodlEnabled&&(n.hodlValue||0)>0;let d='<div class="card"><h2>Fund Glidepath Over Time</h2>';d+='<div class="alert alert-info" style="margin-bottom: 20px;">',d+=o?"<strong>Bond tent on:</strong> the equity share (Shares %) RISES over the early years then holds; the £ floors inflate with CPI and deplete over time, cash holds its real value, and the ISA bridge runs down as it tops up income.":"<strong>Glidepath:</strong> Equity & Bond minimums inflate with CPI but deplete over time to £0; cash inflates only (holds real value); the ISA bridge runs down as it tops up income. Turn on the bond tent in Settings to see the equity share rise.",a&&(d+=" Your diversifiers sleeve (gold + trend/macro — e.g. CGT, PNL) is held flat as a crisis reserve."),c&&(d+=" The Break-Glass HODL reserve is shown separately and untouched until an emergency."),d+="</div>",d+='<div class="table-scroll-container"><table>',d+="<thead><tr><th>Year</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th>"+(a?"<th>Diversifiers</th>":"")+(c?"<th>HODL</th>":"")+"<th>Shares % (of pot)</th><th>ISA Balance</th><th>Total Min</th></tr></thead>",d+="<tbody>";for(const h of s){const m=Math.round((h.equityShareOfPot||0)*100);d+=`<tr>
            <td>${h.year}</td>
            <td style="color: var(--success);">${j(h.equityMin)}</td>
            <td style="color: var(--info);">${j(h.bondMin)}</td>
            <td style="color: var(--warning);">${j(h.cashTarget)}</td>
            ${a?`<td>${j(h.diversifier||0)}</td>`:""}
            ${c?`<td>${j(h.hodl||0)}</td>`:""}
            <td style="font-weight: 600;">${m}%</td>
            <td>${j(i[h.year]||0)}</td>
            <td style="font-weight: 600;">${j(h.totalMin)}</td>
          </tr>`}d+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=d}catch(n){console.error("Glidepath error:",n),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};let Kt=null,cn=[],yn="all";async function z1(t){const e=document.getElementById("planVsActual");if(e)try{const n=await _S();if(!n||!t||!t.length){e.innerHTML="";return}const s={};for(const i of t){const o=i.yearNum??0;(s[o]=s[o]||[]).push(i)}let r="";for(const i of Object.keys(s).map(Number).sort((o,a)=>o-a)){const o=n.drawdown[i];if(!o)continue;const a=s[i],c=a.reduce((T,E)=>T+(E.sipp||0),0)/a.length,d=a.reduce((T,E)=>T+(E.taxPaidMonthly||E.monthlyTax||0),0),h=a[a.length-1].isaBalance??null,m=o.sippDraw/12,f=c-m,y=T=>(T>=0?"+":"−")+W(Math.round(Math.abs(T)));r+="<tr><td>Year "+i+' <span class="hint">('+a.length+" mo)</span></td><td>"+W(Math.round(m))+"/mo</td><td>"+W(Math.round(c))+'/mo <span class="hint">('+y(f)+")</span></td><td>"+W(Math.round(o.tax))+"</td><td>"+W(Math.round(d*(12/a.length)))+'<span class="hint">/yr pace</span></td><td>'+W(Math.round(o.isaBalance))+(h!=null?' <span class="hint">vs '+W(Math.round(h))+"</span>":"")+"</td></tr>"}if(!r){e.innerHTML="";return}e.innerHTML='<div class="settings-section" style="margin-bottom:14px;"><div class="section-title">Plan vs actual <span style="font-weight:normal;font-size:12px;color:var(--text-muted);">— against the projection frozen when this plan was locked ('+new Date(n.savedAt).toLocaleDateString()+", "+(n.assumedCpi*100).toFixed(0)+'% assumed CPI)</span></div><div class="table-scroll-container"><table><thead><tr><th>Plan year</th><th>Planned draw</th><th>Actual draw</th><th>Planned tax/yr</th><th>Actual tax pace</th><th>Planned ISA left</th></tr></thead><tbody>'+r+`</tbody></table></div><p class="hint" style="margin-top:6px;">The plan of record never moves — that's its job. Your monthly recommendations always use your real fund values and entered CPI.</p></div>`}catch{e.innerHTML=""}}async function In(){const t=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),n=document.getElementById("historyYearFilter"),s=document.getElementById("deleteAllHistoryBtn"),r=document.getElementById("deleteYearBtn");if(!t||!e)return;if(t.innerHTML='<span class="loading">Loading...</span>',cn=await zs({sortDesc:!1,limit:500}),z1(cn),s&&(s.style.display=cn.length>0?"":"none"),r&&(r.style.display="none"),cn.length===0){t.innerHTML="",n&&(n.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const i=[...new Set(cn.map(d=>d.date.split("-")[0]))].sort().reverse();if(n){let d='<option value="all">All Years</option>';i.forEach(h=>{d+=`<option value="${h}">${h}</option>`}),n.innerHTML=d,n.value=yn}r&&(r.style.display=yn!=="all"&&cn.length>0?"":"none");const o=yn==="all"?cn:cn.filter(d=>d.date.startsWith(yn));if(o.length===0){t.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${yn}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let a="";o.forEach(d=>{const h=d.date===Kt,m=["history-tab"];h&&m.push("active"),d.inProtection&&m.push("protection");const[f,y]=d.date.split("-").map(Number),T=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],E=yn==="all"?`${T[y-1]} ${f}`:T[y-1];a+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${d.date}')">${E}</button>`}),t.innerHTML=a;const c=document.getElementById("historyMobileSelector");if(c){let d="";o.forEach(h=>{const m=ni(h.date),f=h.inProtection?" (Protection)":"";d+=`<option value="${h.date}">${m}${f}</option>`}),c.innerHTML=d}(!Kt||!o.find(d=>d.date===Kt))&&(Kt=o[o.length-1].date),c&&(c.value=Kt),l0(Kt),setTimeout(()=>{const d=t.querySelector(".history-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(t){yn=t,Kt=null,In()};function ni(t){const[e,n]=t.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][n-1]} ${e}`}function l0(t){const e=document.getElementById("historyDetail"),n=cn.find(d=>d.date===t);if(!n){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const s=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",r=n.isTaxEfficientYear!==!1&&n.mode==="Tax-Efficient",i=n.inProtection?"warning":r?"efficient":"inefficient",o=n.inProtection?`Protection${n.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:r?"Tax-Efficient":"Standard";let a=n.source||"Unknown";n.source==="Growth"&&(n.dEquity>0||n.dBond>0)?a=`Growth (Equity: ${s(n.dEquity||0)}, Bond: ${s(n.dBond||0)})`:n.source==="Cash"&&(a=`Cash (${s(n.dCash||n.sipp||0)})`);let c=`
        <div class="no-print" style="display:flex;justify-content:flex-end;margin-bottom:12px;">
          <button class="btn secondary" onclick="printMonthlyReport('${n.date}')">Download PDF</button>
        </div>
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${ni(n.date)}</h3>
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
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===ni(t))})}window.selectHistoryEntry=function(t){Kt=t,l0(t);const e=document.getElementById("historyMobileSelector");e&&(e.value=t);const s=document.getElementById("historyTabs").querySelector(".history-tab.active");s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(t){const e=document.getElementById("historyTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function Ua(t){const[e,n]=t.split("-").map(Number);return n>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function Jc(t){const e={};for(const s of t){const r=s.taxYear||Ua(s.date);e[r]||(e[r]=0),e[r]+=s.isaSavingsUsedThisMonth||s.isa||0}for(const s of t)await ty(s.date);const n=await os();for(const[s,r]of Object.entries(e))if(n[s]){const i=n[s].isaSavingsUsed||0,o=Math.max(0,i-r);await wr(s,{...n[s],isaSavingsUsed:o})}}window.deleteHistoryEntry=async function(t){if(!lt()){showToast("Please sign in to delete entries","error");return}const e=await zs({sortDesc:!1,limit:1e3}),n=Ua(t),r=e.filter(c=>(c.taxYear||Ua(c.date))===n).sort((c,d)=>c.date.localeCompare(d.date)),i=r.findIndex(c=>c.date===t);if(i===-1){showToast("Entry not found","error");return}const o=i===r.length-1,a=ni(t);if(o){if(!await appConfirm(`Delete entry for ${a}?`))return;_t("Deleting entry...");try{await Jc([r[i]]),showToast(`Deleted ${a}`,"success"),Kt=null,await In()}catch(c){console.error("Delete error:",c),showToast("Error deleting: "+c.message,"error")}finally{Tt()}}else{const c=r.slice(i),d=ni(c[c.length-1].date);if(!await appConfirm(`This will delete ${c.length} entries from ${a} to ${d} in tax year ${n}.

Continue?`))return;_t(`Deleting ${c.length} entries...`);try{await Jc(c),showToast(`Deleted ${c.length} entries`,"success"),Kt=null,await In()}catch(h){console.error("Delete error:",h),showToast("Error deleting: "+h.message,"error")}finally{Tt()}}};window.deleteHistoryForTaxYear=async function(t){if(!lt()){showToast("Please sign in to delete entries","error");return}const n=(await zs({sortDesc:!1,limit:1e3})).filter(s=>(s.taxYear||Ua(s.date))===t);if(n.length===0){showToast(`No history entries for tax year ${t}`,"info");return}if(await appConfirm(`Delete all ${n.length} history entries for tax year ${t}?`)){_t(`Deleting tax year ${t}...`);try{await Jc(n);const s=await os();s[t]&&await wr(t,{...s[t],isaSavingsUsed:0}),showToast(`Deleted all entries for ${t}`,"success"),Kt=null,await In()}catch(s){console.error("Delete error:",s),showToast("Error deleting: "+s.message,"error")}finally{Tt()}}};window.deleteHistoryForSelectedYear=async function(){if(yn==="all"){showToast("Select a specific year first","error");return}const t=`${parseInt(yn)%100}/${(parseInt(yn)+1)%100}`;await deleteHistoryForTaxYear(t)};window.deleteAllHistory=async function(){if(await appConfirm("Delete ALL history entries? This cannot be undone.")&&await appConfirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!lt()){showToast("Please sign in to delete entries","error");return}_t("Deleting all history...");try{const t=await zs({limit:1e3});for(const n of t)await ty(n.date);const e=await os();for(const[n,s]of Object.entries(e))s.isaSavingsUsed>0&&await wr(n,{...s,isaSavingsUsed:0});showToast(`Deleted ${t.length} entries`,"success"),Kt=null,await In()}catch(t){console.error("Delete all error:",t),showToast("Error deleting: "+t.message,"error")}finally{Tt()}}};let Js=null;async function yr(){const t=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!t||!e)return;t.innerHTML='<span class="loading">Loading...</span>';const n=await os(),s=await Ze(),r=Object.keys(n).sort(),i=U1(),o=$1(r,i,40);let a="";o.forEach(h=>{const m=n[h],f=m&&m.yearSetupComplete,y=h===Js,T=["tax-year-tab"];y&&T.push("active"),f||T.push("not-setup"),a+=`<button class="${T.join(" ")}" onclick="selectTaxYear('${h}')">${h}</button>`}),t.innerHTML=a;const c=document.getElementById("taxYearMobileSelector");if(c){let h="";o.forEach(m=>{const f=n[m],T=f&&f.yearSetupComplete?m:`${m} (not set up)`;h+=`<option value="${m}">${T}</option>`}),c.innerHTML=h}if(!Js){const h=r.filter(m=>{var f;return(f=n[m])==null?void 0:f.yearSetupComplete});Js=h.length>0?h[h.length-1]:i}c&&(c.value=Js),await c0(Js,n,s);const d=t.querySelector(".tax-year-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function U1(){const t=new Date,e=t.getFullYear(),n=t.getMonth()+1;return n<4||n===4&&t.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function $1(t,e,n){const s=new Set(t),[r]=e.split("/").map(Number),i=r<50?2e3+r:1900+r;for(let o=0;o<n&&s.size<n;o++){const a=i+o,c=a+1;s.add(`${String(a).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(s).sort()}async function c0(t,e,n){var I,_,S,A,b,Y,ie,q,se,ee,ye,he,dt,re;const s=document.getElementById("taxYearDetail"),r=e[t];if(!r||!r.yearSetupComplete){s.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${t} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${t}')">Set Up ${t}</button>
          </div>
        `;return}const i=await lu(t),o=Math.round(i.amount||0),a=i.startDate||"Not configured",c=i.isReceiving;i.yearsUntil;const d=V=>V!=null?"£"+Math.round(V).toLocaleString():"—",h=(n.equityMin||0)+(n.bondMin||0)+(n.cashTarget||0),m=n.duration||35,f=Math.max(0,2e3+(parseInt(t.split("/")[0],10)||26)-2026),y=!!n.equityGlideEnabled,T={equity:h>0?n.equityMin/h:.5,bond:h>0?n.bondMin/h:.4,cash:h>0?n.cashTarget/h:.1,equityGlide:y?hu(n.equityMin,n.bondMin):void 0},E=Yf(T,f,m),x=Yf(T,Math.max(0,f-1),m),C=V=>Math.round(V*100),P=Math.max(5,m-20),D=C(E.equity)-C(x.equity),R=`${C(E.equity)}% shares / ${C(E.bond)}% bonds / ${C(E.cash)}% cash`;let B,N;y?f>P?(N=`Holding — reached your mix at year ${P}`,B=`You've reached your endgame mix. Hold ${R}; no glide change this year.`):D>0?(N=`Rising — year ${f} of ${P}`,B=`Shift about ${D}% of your pot from bonds into shares this year, reaching ${R}.`):(N=`Rising — year ${f} of ${P}`,B=`Hold ${R}.`):(N="Flat (bond tent off)",B=`Hold a steady ${R}. Rebalance back to this whenever it drifts.`);const w=`
        <div class="tax-year-detail-card">
          <h3>This Year's Target Mix${y?" — Bond Tent":""}</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field"><label>Shares</label><span class="value">${C(E.equity)}% · ${d(h*E.equity)}</span></div>
            <div class="tax-year-field"><label>Bonds</label><span class="value">${C(E.bond)}% · ${d(h*E.bond)}</span></div>
            <div class="tax-year-field"><label>Cash</label><span class="value">${C(E.cash)}% · ${d(h*E.cash)}</span></div>
            <div class="tax-year-field"><label>Glide stage</label><span class="value">${N}</span></div>
          </div>
          <div class="alert alert-info" style="margin-top:12px;"><strong>Rebalance:</strong> ${B}</div>
        </div>`;let v=`<div class="no-print" style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:12px;"><button class="btn secondary" onclick="printAnnualReport('${t}')">Download PDF</button> <button class="btn secondary" onclick="exportAnnualCsv('${t}')">Export CSV</button></div>`+w+`
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
              <span class="value">${q1(r.startMonth||4)}</span>
            </div>
            <div class="tax-year-field">
              <label>Remaining Months (at setup)</label>
              <span class="value">${r.remainingMonths||12}</span>
            </div>
          </div>
        </div>
      `;if(r.expectedMonthly){const V=r.expectedMonthly;v+=`
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
                  <td>${d((I=V.sipp)==null?void 0:I.gross)}</td>
                  <td class="tax-col">-${d((_=V.sipp)==null?void 0:_.tax)}</td>
                  <td class="net-col">${d((S=V.sipp)==null?void 0:S.net)}</td>
                </tr>
                ${((A=V.other)==null?void 0:A.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${d((b=V.other)==null?void 0:b.gross)}</td>
                  <td class="tax-col">-${d((Y=V.other)==null?void 0:Y.tax)}</td>
                  <td class="net-col">${d((ie=V.other)==null?void 0:ie.net)}</td>
                </tr>
                `:""}
                ${((q=V.statePension)==null?void 0:q.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${d((se=V.statePension)==null?void 0:se.gross)}</td>
                  <td class="tax-col">-${d((ee=V.statePension)==null?void 0:ee.tax)}</td>
                  <td class="net-col">${d((ye=V.statePension)==null?void 0:ye.net)}</td>
                </tr>
                `:""}
                ${((he=V.isa)==null?void 0:he.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${d((dt=V.isa)==null?void 0:dt.gross)}</td>
                  <td style="color:var(--success);">£0</td>
                  <td class="net-col">${d((re=V.isa)==null?void 0:re.net)}</td>
                </tr>
                `:""}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>${d(V.totalGross)}</strong></td>
                  <td class="tax-col"><strong>-${d(V.totalTax)}</strong></td>
                  <td class="net-col"><strong>${d(V.totalNet)}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p style="margin-top:16px;font-size:14px;color:var(--text);">
              <strong>Monthly take-home: ${d(V.totalNet)}</strong>
            </p>
          </div>
        `}v+=`
        <div class="tax-year-actions">
          <button class="btn secondary" onclick="deleteTaxYear('${t}')">Delete Year</button>
          <button class="btn secondary" onclick="reconfigureTaxYear('${t}')">Reconfigure via Wizard</button>
        </div>
      `,s.innerHTML=v,document.querySelectorAll(".tax-year-tab").forEach(V=>{V.classList.toggle("active",V.textContent===t)})}window.selectTaxYear=async function(t){Js=t;const e=await os(),n=await Ze();await c0(t,e,n),document.querySelectorAll(".tax-year-tab").forEach(o=>{o.classList.toggle("active",o.textContent===t)});const s=document.getElementById("taxYearMobileSelector");s&&(s.value=t);const i=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${t}')"]`);i&&i.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(t){const e=document.getElementById("taxYearTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function q1(t){return["January","February","March","April","May","June","July","August","September","October","November","December"][(t-1)%12]||"April"}window.triggerWizardForYear=async function(t){const[e]=t.split("/").map(Number),n=e<50?2e3+e:1900+e,s=`${n}-04`,r=document.getElementById("entryMonth");r&&(r.value=s,r.dispatchEvent(new Event("input"))),document.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(i=>i.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(i=>i.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),showToast(`Please click "Calculate" with April ${n} selected to set up tax year ${t}`,"info",5e3)};window.reconfigureTaxYear=async function(t){if(await appConfirm(`This will allow you to reconfigure tax year ${t}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await Bo(t);e.yearSetupComplete=!1,await wr(t,e),await yr(),showToast(`Tax year ${t} marked for reconfiguration. Calculate a decision for this year to run the wizard again.`,"success",5e3)}catch(e){console.error("Error:",e),showToast("Error: "+e.message,"error")}};window.updateTaxYear=async function(t,e,n){try{const s=await Bo(t);s[e]=parseFloat(n),await wr(t,s)}catch(s){console.error("Error updating tax year:",s),showToast("Error saving: "+s.message,"error")}};window.deleteTaxYear=async function(t){if(await appConfirm("Delete tax year "+t+"? This will remove all configuration for this year."))try{const e=await kn();delete e.taxYears[t],await fl(e),Js=null,await yr()}catch(e){console.error("Error deleting tax year:",e),showToast("Error deleting: "+e.message,"error")}};window.addTaxYear=async function(){if(!lt()){showToast("Please sign in to add tax years","error");return}const t=prompt("Enter tax year (e.g., 25/26):");if(!t||!/^\d{2}\/\d{2}$/.test(t)){showToast("Invalid format. Use YY/YY (e.g., 25/26)","error");return}try{await wr(t,{}),await yr()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error")}};console.log("Pension Planner v"+cp+" loaded");
