(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();function dv(t){const e=(t.sippDraw||0)+(t.other||0)+(t.statePension||0),n=e*12,s=t.pa||12570,i=t.brl||50270,r=t.hrl||125140;let o=0;n>s&&(n<=i?o=(n-s)*.2:n<=r?o=(i-s)*.2+(n-i)*.4:o=(i-s)*.2+(r-i)*.4+(n-r)*.45);const l=t.monthlyTax!=null?t.monthlyTax:o/12,c=t.monthlyTax!=null&&t.totalMonthlyNet!=null?t.totalMonthlyNet:e-l+(t.isaDraw||0);return{date:t.date,taxYear:t.taxYear,yearNum:t.yearNumber,equity:t.equity,bond:t.bond,cash:t.cash,total:t.equity+t.bond+t.cash,adjEquity:t.adjEquityMin,adjBond:t.adjBondMin,adjCash:t.adjCashTarget,source:t.source,dEquity:t.drawFromEquity||0,dBond:t.drawFromBond||0,dCash:t.drawFromCash||0,sipp:t.sippDraw,stdSipp:t.stdSipp||t.sippDraw,isa:t.isaDraw,other:t.other,state:t.statePension,pa:s,brl:i,monthlyTax:l,monthlyNet:c,mode:t.taxEfficient?"Tax-Efficient":"Standard",inProtection:t.inProtection,reason:t.protectionReason||"",consecutiveDraws:t.consecutiveCashDraws||0,boostAmount:t.boostAmount,boostEligible:t.boostEligible||!1,rebal:t.rebalanceActions?t.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:t.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:t.isaDraw||0,cumulativeIsaSavingsUsed:t.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxFree:t.taxFree||0,recycleNet:t.recycleNet||0,accessMethod:t.accessMethod||"drawdown",taxPaidYTD:t.taxPaidYTD||l,taxProjectedAnnual:t.taxProjectedAnnual||o,taxSavedMonthly:t.taxSavedMonthly||0,taxSavedYTD:t.taxSavedYTD||0,taxSavedProjectedAnnual:t.taxSavedProjectedAnnual||0,isTaxEfficientYear:t.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:t.protectionInducedTaxEfficiency||!1,remainingMonths:t.remainingMonths||12}}const $o={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},uv="modulepreload",hv=function(t,e){return new URL(t,e).href},rh={},oh=function(e,n,s){let i=Promise.resolve();if(n&&n.length>0){const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));i=Promise.allSettled(n.map(d=>{if(d=hv(d,s),d in rh)return;rh[d]=!0;const h=d.endsWith(".css"),m=h?'[rel="stylesheet"]':"";if(!!s)for(let I=o.length-1;I>=0;I--){const S=o[I];if(S.href===d&&(!h||S.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const w=document.createElement("link");if(w.rel=h?"stylesheet":uv,h||(w.as="script"),w.crossOrigin="",w.href=d,c&&w.setAttribute("nonce",c),document.head.appendChild(w),h)return new Promise((I,S)=>{w.addEventListener("load",I),w.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return i.then(o=>{for(const l of o||[])l.status==="rejected"&&r(l.reason);return e().catch(r)})},jf="6.0.0",Xe={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},Kf={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},Lt={RETURN:.03,MIN:0,DRAWDOWN_STRATEGY:"minimiseEarlyTax"},pe={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},Es={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},Xs={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},Da={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},fv={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},_n={START_MONTH:4,START_DAY:6},Ba=.04,Qf=Kf.OTHER_INCOME_CAP;function ah(t,e,n=Qf){let s=t;for(const i of e)s*=1+Math.min(i,n);return s}function Fc(t){let e=t;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function wi(t,e,n){const s=Math.max(n(),1e-12),i=n();let r=Math.sqrt(-2*Math.log(s))*Math.cos(2*Math.PI*i);return r=Math.max(-4,Math.min(4,r)),t+e*r}function La(t){const e=JSON.stringify(t);let n=0;for(let s=0;s<e.length;s++){const i=e.charCodeAt(s);n=(n<<5)-n+i,n=n&n}return n.toString(16)}var lh={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jf=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let i=t.charCodeAt(s);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},pv=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const i=t[n++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=t[n++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=t[n++],o=t[n++],l=t[n++],c=((i&7)<<18|(r&63)<<12|(o&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const r=t[n++],o=t[n++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|o&63)}}return e.join("")},Xf={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<t.length;i+=3){const r=t[i],o=i+1<t.length,l=o?t[i+1]:0,c=i+2<t.length,d=c?t[i+2]:0,h=r>>2,m=(r&3)<<4|l>>4;let p=(l&15)<<2|d>>6,w=d&63;c||(w=64,o||(p=64)),s.push(n[h],n[m],n[p],n[w])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Jf(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):pv(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<t.length;){const r=n[t.charAt(i++)],l=i<t.length?n[t.charAt(i)]:0;++i;const d=i<t.length?n[t.charAt(i)]:64;++i;const m=i<t.length?n[t.charAt(i)]:64;if(++i,r==null||l==null||d==null||m==null)throw new mv;const p=r<<2|l>>4;if(s.push(p),d!==64){const w=l<<4&240|d>>2;if(s.push(w),m!==64){const I=d<<6&192|m;s.push(I)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class mv extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const gv=function(t){const e=Jf(t);return Xf.encodeByteArray(e,!0)},da=function(t){return gv(t).replace(/\./g,"")},Zf=function(t){try{return Xf.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function yv(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const vv=()=>yv().__FIREBASE_DEFAULTS__,bv=()=>{if(typeof process>"u"||typeof lh>"u")return;const t=lh.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},wv=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Zf(t[1]);return e&&JSON.parse(e)},Na=()=>{try{return vv()||bv()||wv()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},ep=t=>{var e,n;return(n=(e=Na())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},_v=t=>{const e=ep(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),s]:[e.substring(0,n),s]},tp=()=>{var t;return(t=Na())===null||t===void 0?void 0:t.config},np=t=>{var e;return(e=Na())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ev{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
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
 */function Tv(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=e||"demo-project",i=t.iat||0,r=t.sub||t.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},t);return[da(JSON.stringify(n)),da(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Iv(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(yt())}function Sv(){var t;const e=(t=Na())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function xv(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Av(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function kv(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Cv(){const t=yt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Rv(){return!Sv()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Pv(){try{return typeof indexedDB=="object"}catch{return!1}}function Mv(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var r;e(((r=i.error)===null||r===void 0?void 0:r.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dv="FirebaseError";class os extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=Dv,Object.setPrototypeOf(this,os.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,no.prototype.create)}}class no{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},i=`${this.service}/${e}`,r=this.errors[e],o=r?Bv(r,s):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new os(i,l,s)}}function Bv(t,e){return t.replace(Lv,(n,s)=>{const i=e[s];return i!=null?String(i):`<${s}?>`})}const Lv=/\{\$([^}]+)}/g;function Nv(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function ua(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const i of n){if(!s.includes(i))return!1;const r=t[i],o=e[i];if(ch(r)&&ch(o)){if(!ua(r,o))return!1}else if(r!==o)return!1}for(const i of s)if(!n.includes(i))return!1;return!0}function ch(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function so(t){const e=[];for(const[n,s]of Object.entries(t))Array.isArray(s)?s.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function yr(t){const e={};return t.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[i,r]=s.split("=");e[decodeURIComponent(i)]=decodeURIComponent(r)}}),e}function vr(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Ov(t,e){const n=new Fv(t,e);return n.subscribe.bind(n)}class Fv{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,s){let i;if(e===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");Vv(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:s},i.next===void 0&&(i.next=Dl),i.error===void 0&&(i.error=Dl),i.complete===void 0&&(i.complete=Dl);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),r}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Vv(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Dl(){}/**
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
 */function Pe(t){return t&&t._delegate?t._delegate:t}class Zs{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const qs="[DEFAULT]";/**
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
 */class zv{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new Ev;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Uv(e))try{this.getOrInitializeService({instanceIdentifier:qs})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=qs){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=qs){return this.instances.has(e)}getOptions(e=qs){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[r,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(r);s===l&&o.resolve(i)}return i}onInit(e,n){var s;const i=this.normalizeInstanceIdentifier(n),r=(s=this.onInitCallbacks.get(i))!==null&&s!==void 0?s:new Set;r.add(e),this.onInitCallbacks.set(i,r);const o=this.instances.get(i);return o&&e(o,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const i of s)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:$v(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=qs){return this.component?this.component.multipleInstances?e:qs:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function $v(t){return t===qs?void 0:t}function Uv(t){return t.instantiationMode==="EAGER"}/**
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
 */class qv{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new zv(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var le;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(le||(le={}));const Hv={debug:le.DEBUG,verbose:le.VERBOSE,info:le.INFO,warn:le.WARN,error:le.ERROR,silent:le.SILENT},Wv=le.INFO,Gv={[le.DEBUG]:"log",[le.VERBOSE]:"log",[le.INFO]:"info",[le.WARN]:"warn",[le.ERROR]:"error"},Yv=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),i=Gv[e];if(i)console[i](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Vc{constructor(e){this.name=e,this._logLevel=Wv,this._logHandler=Yv,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in le))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Hv[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,le.DEBUG,...e),this._logHandler(this,le.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,le.VERBOSE,...e),this._logHandler(this,le.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,le.INFO,...e),this._logHandler(this,le.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,le.WARN,...e),this._logHandler(this,le.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,le.ERROR,...e),this._logHandler(this,le.ERROR,...e)}}const jv=(t,e)=>e.some(n=>t instanceof n);let dh,uh;function Kv(){return dh||(dh=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Qv(){return uh||(uh=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const sp=new WeakMap,Kl=new WeakMap,ip=new WeakMap,Bl=new WeakMap,zc=new WeakMap;function Jv(t){const e=new Promise((n,s)=>{const i=()=>{t.removeEventListener("success",r),t.removeEventListener("error",o)},r=()=>{n(Ts(t.result)),i()},o=()=>{s(t.error),i()};t.addEventListener("success",r),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&sp.set(n,t)}).catch(()=>{}),zc.set(e,t),e}function Xv(t){if(Kl.has(t))return;const e=new Promise((n,s)=>{const i=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",o),t.removeEventListener("abort",o)},r=()=>{n(),i()},o=()=>{s(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",r),t.addEventListener("error",o),t.addEventListener("abort",o)});Kl.set(t,e)}let Ql={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Kl.get(t);if(e==="objectStoreNames")return t.objectStoreNames||ip.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Ts(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Zv(t){Ql=t(Ql)}function e0(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(Ll(this),e,...n);return ip.set(s,e.sort?e.sort():[e]),Ts(s)}:Qv().includes(t)?function(...e){return t.apply(Ll(this),e),Ts(sp.get(this))}:function(...e){return Ts(t.apply(Ll(this),e))}}function t0(t){return typeof t=="function"?e0(t):(t instanceof IDBTransaction&&Xv(t),jv(t,Kv())?new Proxy(t,Ql):t)}function Ts(t){if(t instanceof IDBRequest)return Jv(t);if(Bl.has(t))return Bl.get(t);const e=t0(t);return e!==t&&(Bl.set(t,e),zc.set(e,t)),e}const Ll=t=>zc.get(t);function n0(t,e,{blocked:n,upgrade:s,blocking:i,terminated:r}={}){const o=indexedDB.open(t,e),l=Ts(o);return s&&o.addEventListener("upgradeneeded",c=>{s(Ts(o.result),c.oldVersion,c.newVersion,Ts(o.transaction),c)}),n&&o.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),l.then(c=>{r&&c.addEventListener("close",()=>r()),i&&c.addEventListener("versionchange",d=>i(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const s0=["get","getKey","getAll","getAllKeys","count"],i0=["put","add","delete","clear"],Nl=new Map;function hh(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Nl.get(e))return Nl.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,i=i0.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(i||s0.includes(n)))return;const r=async function(o,...l){const c=this.transaction(o,i?"readwrite":"readonly");let d=c.store;return s&&(d=d.index(l.shift())),(await Promise.all([d[n](...l),i&&c.done]))[0]};return Nl.set(e,r),r}Zv(t=>({...t,get:(e,n,s)=>hh(e,n)||t.get(e,n,s),has:(e,n)=>!!hh(e,n)||t.has(e,n)}));/**
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
 */class r0{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(o0(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function o0(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Jl="@firebase/app",fh="0.10.13";/**
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
 */const Xn=new Vc("@firebase/app"),a0="@firebase/app-compat",l0="@firebase/analytics-compat",c0="@firebase/analytics",d0="@firebase/app-check-compat",u0="@firebase/app-check",h0="@firebase/auth",f0="@firebase/auth-compat",p0="@firebase/database",m0="@firebase/data-connect",g0="@firebase/database-compat",y0="@firebase/functions",v0="@firebase/functions-compat",b0="@firebase/installations",w0="@firebase/installations-compat",_0="@firebase/messaging",E0="@firebase/messaging-compat",T0="@firebase/performance",I0="@firebase/performance-compat",S0="@firebase/remote-config",x0="@firebase/remote-config-compat",A0="@firebase/storage",k0="@firebase/storage-compat",C0="@firebase/firestore",R0="@firebase/vertexai-preview",P0="@firebase/firestore-compat",M0="firebase",D0="10.14.1";/**
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
 */const Xl="[DEFAULT]",B0={[Jl]:"fire-core",[a0]:"fire-core-compat",[c0]:"fire-analytics",[l0]:"fire-analytics-compat",[u0]:"fire-app-check",[d0]:"fire-app-check-compat",[h0]:"fire-auth",[f0]:"fire-auth-compat",[p0]:"fire-rtdb",[m0]:"fire-data-connect",[g0]:"fire-rtdb-compat",[y0]:"fire-fn",[v0]:"fire-fn-compat",[b0]:"fire-iid",[w0]:"fire-iid-compat",[_0]:"fire-fcm",[E0]:"fire-fcm-compat",[T0]:"fire-perf",[I0]:"fire-perf-compat",[S0]:"fire-rc",[x0]:"fire-rc-compat",[A0]:"fire-gcs",[k0]:"fire-gcs-compat",[C0]:"fire-fst",[P0]:"fire-fst-compat",[R0]:"fire-vertex","fire-js":"fire-js",[M0]:"fire-js-all"};/**
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
 */const ha=new Map,L0=new Map,Zl=new Map;function ph(t,e){try{t.container.addComponent(e)}catch(n){Xn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Di(t){const e=t.name;if(Zl.has(e))return Xn.debug(`There were multiple attempts to register component ${e}.`),!1;Zl.set(e,t);for(const n of ha.values())ph(n,t);for(const n of L0.values())ph(n,t);return!0}function $c(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function dn(t){return t.settings!==void 0}/**
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
 */const N0={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Is=new no("app","Firebase",N0);/**
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
 */class O0{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Zs("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Is.create("app-deleted",{appName:this._name})}}/**
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
 */const Gi=D0;function rp(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Xl,automaticDataCollectionEnabled:!1},e),i=s.name;if(typeof i!="string"||!i)throw Is.create("bad-app-name",{appName:String(i)});if(n||(n=tp()),!n)throw Is.create("no-options");const r=ha.get(i);if(r){if(ua(n,r.options)&&ua(s,r.config))return r;throw Is.create("duplicate-app",{appName:i})}const o=new qv(i);for(const c of Zl.values())o.addComponent(c);const l=new O0(n,s,o);return ha.set(i,l),l}function op(t=Xl){const e=ha.get(t);if(!e&&t===Xl&&tp())return rp();if(!e)throw Is.create("no-app",{appName:t});return e}function Ss(t,e,n){var s;let i=(s=B0[t])!==null&&s!==void 0?s:t;n&&(i+=`-${n}`);const r=i.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const l=[`Unable to register library "${i}" with version "${e}":`];r&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),r&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Xn.warn(l.join(" "));return}Di(new Zs(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const F0="firebase-heartbeat-database",V0=1,Lr="firebase-heartbeat-store";let Ol=null;function ap(){return Ol||(Ol=n0(F0,V0,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Lr)}catch(n){console.warn(n)}}}}).catch(t=>{throw Is.create("idb-open",{originalErrorMessage:t.message})})),Ol}async function z0(t){try{const n=(await ap()).transaction(Lr),s=await n.objectStore(Lr).get(lp(t));return await n.done,s}catch(e){if(e instanceof os)Xn.warn(e.message);else{const n=Is.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Xn.warn(n.message)}}}async function mh(t,e){try{const s=(await ap()).transaction(Lr,"readwrite");await s.objectStore(Lr).put(e,lp(t)),await s.done}catch(n){if(n instanceof os)Xn.warn(n.message);else{const s=Is.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Xn.warn(s.message)}}}function lp(t){return`${t.name}!${t.options.appId}`}/**
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
 */const $0=1024,U0=30*24*60*60*1e3;class q0{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new W0(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=gh();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r)?void 0:(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=U0}),this._storage.overwrite(this._heartbeatsCache))}catch(s){Xn.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=gh(),{heartbeatsToSend:s,unsentEntries:i}=H0(this._heartbeatsCache.heartbeats),r=da(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(n){return Xn.warn(n),""}}}function gh(){return new Date().toISOString().substring(0,10)}function H0(t,e=$0){const n=[];let s=t.slice();for(const i of t){const r=n.find(o=>o.agent===i.agent);if(r){if(r.dates.push(i.date),yh(n)>e){r.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),yh(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class W0{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Pv()?Mv().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await z0(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return mh(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return mh(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function yh(t){return da(JSON.stringify({version:2,heartbeats:t})).length}/**
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
 */function G0(t){Di(new Zs("platform-logger",e=>new r0(e),"PRIVATE")),Di(new Zs("heartbeat",e=>new q0(e),"PRIVATE")),Ss(Jl,fh,t),Ss(Jl,fh,"esm2017"),Ss("fire-js","")}G0("");var Y0="firebase",j0="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ss(Y0,j0,"app");function Uc(t,e){var n={};for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.indexOf(s)<0&&(n[s]=t[s]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,s=Object.getOwnPropertySymbols(t);i<s.length;i++)e.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(t,s[i])&&(n[s[i]]=t[s[i]]);return n}function cp(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const K0=cp,dp=new no("auth","Firebase",cp());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fa=new Vc("@firebase/auth");function Q0(t,...e){fa.logLevel<=le.WARN&&fa.warn(`Auth (${Gi}): ${t}`,...e)}function jo(t,...e){fa.logLevel<=le.ERROR&&fa.error(`Auth (${Gi}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tn(t,...e){throw Hc(t,...e)}function un(t,...e){return Hc(t,...e)}function qc(t,e,n){const s=Object.assign(Object.assign({},K0()),{[e]:n});return new no("auth","Firebase",s).create(e,{appName:t.name})}function jn(t){return qc(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function J0(t,e,n){const s=n;if(!(e instanceof s))throw s.name!==e.constructor.name&&tn(t,"argument-error"),qc(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Hc(t,...e){if(typeof t!="string"){const n=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=t.name),t._errorFactory.create(n,...s)}return dp.create(t,...e)}function K(t,e,...n){if(!t)throw Hc(e,...n)}function Hn(t){const e="INTERNAL ASSERTION FAILED: "+t;throw jo(e),new Error(e)}function Zn(t,e){t||Hn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ec(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function X0(){return vh()==="http:"||vh()==="https:"}function vh(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z0(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(X0()||Av()||"connection"in navigator)?navigator.onLine:!0}function eb(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class io{constructor(e,n){this.shortDelay=e,this.longDelay=n,Zn(n>e,"Short delay should be less than long delay!"),this.isMobile=Iv()||kv()}get(){return Z0()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wc(t,e){Zn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class up{static initialize(e,n,s){this.fetchImpl=e,n&&(this.headersImpl=n),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Hn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Hn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Hn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tb={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nb=new io(3e4,6e4);function as(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function An(t,e,n,s,i={}){return hp(t,i,async()=>{let r={},o={};s&&(e==="GET"?o=s:r={body:JSON.stringify(s)});const l=so(Object.assign({key:t.config.apiKey},o)).slice(1),c=await t._getAdditionalHeaders();c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode);const d=Object.assign({method:e,headers:c},r);return xv()||(d.referrerPolicy="no-referrer"),up.fetch()(fp(t,t.config.apiHost,n,l),d)})}async function hp(t,e,n){t._canInitEmulator=!1;const s=Object.assign(Object.assign({},tb),e);try{const i=new ib(t),r=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await r.json();if("needConfirmation"in o)throw Uo(t,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{const l=r.ok?o.errorMessage:o.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Uo(t,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw Uo(t,"email-already-in-use",o);if(c==="USER_DISABLED")throw Uo(t,"user-disabled",o);const h=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw qc(t,h,d);tn(t,h)}}catch(i){if(i instanceof os)throw i;tn(t,"network-request-failed",{message:String(i)})}}async function ro(t,e,n,s,i={}){const r=await An(t,e,n,s,i);return"mfaPendingCredential"in r&&tn(t,"multi-factor-auth-required",{_serverResponse:r}),r}function fp(t,e,n,s){const i=`${e}${n}?${s}`;return t.config.emulator?Wc(t.config,i):`${t.config.apiScheme}://${i}`}function sb(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class ib{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,s)=>{this.timer=setTimeout(()=>s(un(this.auth,"network-request-failed")),nb.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Uo(t,e,n){const s={appName:t.name};n.email&&(s.email=n.email),n.phoneNumber&&(s.phoneNumber=n.phoneNumber);const i=un(t,e,s);return i.customData._tokenResponse=n,i}function bh(t){return t!==void 0&&t.enterprise!==void 0}class rb{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return sb(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function ob(t,e){return An(t,"GET","/v2/recaptchaConfig",as(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ab(t,e){return An(t,"POST","/v1/accounts:delete",e)}async function pp(t,e){return An(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xr(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function lb(t,e=!1){const n=Pe(t),s=await n.getIdToken(e),i=Gc(s);K(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const r=typeof i.firebase=="object"?i.firebase:void 0,o=r==null?void 0:r.sign_in_provider;return{claims:i,token:s,authTime:xr(Fl(i.auth_time)),issuedAtTime:xr(Fl(i.iat)),expirationTime:xr(Fl(i.exp)),signInProvider:o||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function Fl(t){return Number(t)*1e3}function Gc(t){const[e,n,s]=t.split(".");if(e===void 0||n===void 0||s===void 0)return jo("JWT malformed, contained fewer than 3 sections"),null;try{const i=Zf(n);return i?JSON.parse(i):(jo("Failed to decode base64 JWT payload"),null)}catch(i){return jo("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function wh(t){const e=Gc(t);return K(e,"internal-error"),K(typeof e.exp<"u","internal-error"),K(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bi(t,e,n=!1){if(n)return e;try{return await e}catch(s){throw s instanceof os&&cb(s)&&t.auth.currentUser===t&&await t.auth.signOut(),s}}function cb({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class db{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tc{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=xr(this.lastLoginAt),this.creationTime=xr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function pa(t){var e;const n=t.auth,s=await t.getIdToken(),i=await Bi(t,pp(n,{idToken:s}));K(i==null?void 0:i.users.length,n,"internal-error");const r=i.users[0];t._notifyReloadListener(r);const o=!((e=r.providerUserInfo)===null||e===void 0)&&e.length?mp(r.providerUserInfo):[],l=hb(t.providerData,o),c=t.isAnonymous,d=!(t.email&&r.passwordHash)&&!(l!=null&&l.length),h=c?d:!1,m={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:l,metadata:new tc(r.createdAt,r.lastLoginAt),isAnonymous:h};Object.assign(t,m)}async function ub(t){const e=Pe(t);await pa(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function hb(t,e){return[...t.filter(s=>!e.some(i=>i.providerId===s.providerId)),...e]}function mp(t){return t.map(e=>{var{providerId:n}=e,s=Uc(e,["providerId"]);return{providerId:n,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fb(t,e){const n=await hp(t,{},async()=>{const s=so({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:r}=t.config,o=fp(t,i,"/v1/token",`key=${r}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",up.fetch()(o,{method:"POST",headers:l,body:s})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function pb(t,e){return An(t,"POST","/v2/accounts:revokeToken",as(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){K(e.idToken,"internal-error"),K(typeof e.idToken<"u","internal-error"),K(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):wh(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){K(e.length!==0,"internal-error");const n=wh(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(K(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:s,refreshToken:i,expiresIn:r}=await fb(e,n);this.updateTokensAndExpiration(s,i,Number(r))}updateTokensAndExpiration(e,n,s){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,n){const{refreshToken:s,accessToken:i,expirationTime:r}=n,o=new Si;return s&&(K(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),i&&(K(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),r&&(K(typeof r=="number","internal-error",{appName:e}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Si,this.toJSON())}_performRefresh(){return Hn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ps(t,e){K(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Wn{constructor(e){var{uid:n,auth:s,stsTokenManager:i}=e,r=Uc(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new db(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=s,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new tc(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const n=await Bi(this,this.stsTokenManager.getToken(this.auth,e));return K(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return lb(this,e)}reload(){return ub(this)}_assign(e){this!==e&&(K(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Wn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){K(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),n&&await pa(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(dn(this.auth.app))return Promise.reject(jn(this.auth));const e=await this.getIdToken();return await Bi(this,ab(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var s,i,r,o,l,c,d,h;const m=(s=n.displayName)!==null&&s!==void 0?s:void 0,p=(i=n.email)!==null&&i!==void 0?i:void 0,w=(r=n.phoneNumber)!==null&&r!==void 0?r:void 0,I=(o=n.photoURL)!==null&&o!==void 0?o:void 0,S=(l=n.tenantId)!==null&&l!==void 0?l:void 0,A=(c=n._redirectEventId)!==null&&c!==void 0?c:void 0,P=(d=n.createdAt)!==null&&d!==void 0?d:void 0,C=(h=n.lastLoginAt)!==null&&h!==void 0?h:void 0,{uid:L,emailVerified:D,isAnonymous:O,providerData:U,stsTokenManager:T}=n;K(L&&T,e,"internal-error");const v=Si.fromJSON(this.name,T);K(typeof L=="string",e,"internal-error"),ps(m,e.name),ps(p,e.name),K(typeof D=="boolean",e,"internal-error"),K(typeof O=="boolean",e,"internal-error"),ps(w,e.name),ps(I,e.name),ps(S,e.name),ps(A,e.name),ps(P,e.name),ps(C,e.name);const _=new Wn({uid:L,auth:e,email:p,emailVerified:D,displayName:m,isAnonymous:O,photoURL:I,phoneNumber:w,tenantId:S,stsTokenManager:v,createdAt:P,lastLoginAt:C});return U&&Array.isArray(U)&&(_.providerData=U.map(b=>Object.assign({},b))),A&&(_._redirectEventId=A),_}static async _fromIdTokenResponse(e,n,s=!1){const i=new Si;i.updateFromServerResponse(n);const r=new Wn({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:s});return await pa(r),r}static async _fromGetAccountInfoResponse(e,n,s){const i=n.users[0];K(i.localId!==void 0,"internal-error");const r=i.providerUserInfo!==void 0?mp(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(r!=null&&r.length),l=new Si;l.updateFromIdToken(s);const c=new Wn({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:r,metadata:new tc(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(r!=null&&r.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _h=new Map;function Gn(t){Zn(t instanceof Function,"Expected a class definition");let e=_h.get(t);return e?(Zn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,_h.set(t,e),e)}/**
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
 */class gp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}gp.type="NONE";const Eh=gp;/**
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
 */function Ko(t,e,n){return`firebase:${t}:${e}:${n}`}class xi{constructor(e,n,s){this.persistence=e,this.auth=n,this.userKey=s;const{config:i,name:r}=this.auth;this.fullUserKey=Ko(this.userKey,i.apiKey,r),this.fullPersistenceKey=Ko("persistence",i.apiKey,r),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Wn._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,s="authUser"){if(!n.length)return new xi(Gn(Eh),e,s);const i=(await Promise.all(n.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let r=i[0]||Gn(Eh);const o=Ko(s,e.config.apiKey,e.name);let l=null;for(const d of n)try{const h=await d._get(o);if(h){const m=Wn._fromJSON(e,h);d!==r&&(l=m),r=d;break}}catch{}const c=i.filter(d=>d._shouldAllowMigration);return!r._shouldAllowMigration||!c.length?new xi(r,e,s):(r=c[0],l&&await r._set(o,l.toJSON()),await Promise.all(n.map(async d=>{if(d!==r)try{await d._remove(o)}catch{}})),new xi(r,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Th(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(wp(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(yp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Ep(e))return"Blackberry";if(Tp(e))return"Webos";if(vp(e))return"Safari";if((e.includes("chrome/")||bp(e))&&!e.includes("edge/"))return"Chrome";if(_p(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=t.match(n);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function yp(t=yt()){return/firefox\//i.test(t)}function vp(t=yt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function bp(t=yt()){return/crios\//i.test(t)}function wp(t=yt()){return/iemobile/i.test(t)}function _p(t=yt()){return/android/i.test(t)}function Ep(t=yt()){return/blackberry/i.test(t)}function Tp(t=yt()){return/webos/i.test(t)}function Yc(t=yt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function mb(t=yt()){var e;return Yc(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function gb(){return Cv()&&document.documentMode===10}function Ip(t=yt()){return Yc(t)||_p(t)||Tp(t)||Ep(t)||/windows phone/i.test(t)||wp(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sp(t,e=[]){let n;switch(t){case"Browser":n=Th(yt());break;case"Worker":n=`${Th(yt())}-${t}`;break;default:n=t}const s=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Gi}/${s}`}/**
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
 */class yb{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const s=r=>new Promise((o,l)=>{try{const c=e(r);o(c)}catch(c){l(c)}});s.onAbort=n,this.queue.push(s);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const s of this.queue)await s(e),s.onAbort&&n.push(s.onAbort)}catch(s){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function vb(t,e={}){return An(t,"GET","/v2/passwordPolicy",as(t,e))}/**
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
 */const bb=6;class wb{constructor(e){var n,s,i,r;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:bb,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(r=e.forceUpgradeOnSignin)!==null&&r!==void 0?r:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,s,i,r,o,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(n=c.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(s=c.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsLowercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(r=c.containsUppercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,n){const s=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;s&&(n.meetsMinPasswordLength=e.length>=s),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let s;for(let i=0;i<e.length;i++)s=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,n,s,i,r){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _b{constructor(e,n,s,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=s,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ih(this),this.idTokenSubscription=new Ih(this),this.beforeStateQueue=new yb(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=dp,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Gn(n)),this._initializationPromise=this.queue(async()=>{var s,i;if(!this._deleted&&(this.persistenceManager=await xi.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await pp(this,{idToken:e}),s=await Wn._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(s)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(dn(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let i=s,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=i==null?void 0:i._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(i=c.user,r=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return K(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await pa(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=eb()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(dn(this.app))return Promise.reject(jn(this));const n=e?Pe(e):null;return n&&K(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&K(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return dn(this.app)?Promise.reject(jn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return dn(this.app)?Promise.reject(jn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Gn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await vb(this),n=new wb(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new no("auth","Firebase",e())}onAuthStateChanged(e,n,s){return this.registerStateListener(this.authStateSubscription,e,n,s)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,s){return this.registerStateListener(this.idTokenSubscription,e,n,s)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(s.tenantId=this.tenantId),await pb(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const s=await this.getOrInitRedirectPersistenceManager(n);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Gn(e)||this._popupRedirectResolver;K(n,this,"argument-error"),this.redirectPersistenceManager=await xi.create(this,[Gn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,s;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,s,i){if(this._deleted)return()=>{};const r=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(K(l,this,"internal-error"),l.then(()=>{o||r(this.currentUser)}),typeof n=="function"){const c=e.addObserver(n,s,i);return()=>{o=!0,c()}}else{const c=e.addObserver(n);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return K(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Sp(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(n["X-Firebase-Client"]=s);const i=await this._getAppCheckToken();return i&&(n["X-Firebase-AppCheck"]=i),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&Q0(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function ls(t){return Pe(t)}class Ih{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ov(n=>this.observer=n)}get next(){return K(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Oa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Eb(t){Oa=t}function xp(t){return Oa.loadJS(t)}function Tb(){return Oa.recaptchaEnterpriseScript}function Ib(){return Oa.gapiScript}function Sb(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const xb="recaptcha-enterprise",Ab="NO_RECAPTCHA";class kb{constructor(e){this.type=xb,this.auth=ls(e)}async verify(e="verify",n=!1){async function s(r){if(!n){if(r.tenantId==null&&r._agentRecaptchaConfig!=null)return r._agentRecaptchaConfig.siteKey;if(r.tenantId!=null&&r._tenantRecaptchaConfigs[r.tenantId]!==void 0)return r._tenantRecaptchaConfigs[r.tenantId].siteKey}return new Promise(async(o,l)=>{ob(r,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new rb(c);return r.tenantId==null?r._agentRecaptchaConfig=d:r._tenantRecaptchaConfigs[r.tenantId]=d,o(d.siteKey)}}).catch(c=>{l(c)})})}function i(r,o,l){const c=window.grecaptcha;bh(c)?c.enterprise.ready(()=>{c.enterprise.execute(r,{action:e}).then(d=>{o(d)}).catch(()=>{o(Ab)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((r,o)=>{s(this.auth).then(l=>{if(!n&&bh(window.grecaptcha))i(l,r,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=Tb();c.length!==0&&(c+=l),xp(c).then(()=>{i(l,r,o)}).catch(d=>{o(d)})}}).catch(l=>{o(l)})})}}async function Sh(t,e,n,s=!1){const i=new kb(t);let r;try{r=await i.verify(n)}catch{r=await i.verify(n,!0)}const o=Object.assign({},e);return s?Object.assign(o,{captchaResp:r}):Object.assign(o,{captchaResponse:r}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function ma(t,e,n,s){var i;if(!((i=t._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const r=await Sh(t,e,n,n==="getOobCode");return s(t,r)}else return s(t,e).catch(async r=>{if(r.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Sh(t,e,n,n==="getOobCode");return s(t,o)}else return Promise.reject(r)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cb(t,e){const n=$c(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),r=n.getOptions();if(ua(r,e??{}))return i;tn(i,"already-initialized")}return n.initialize({options:e})}function Rb(t,e){const n=(e==null?void 0:e.persistence)||[],s=(Array.isArray(n)?n:[n]).map(Gn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function Pb(t,e,n){const s=ls(t);K(s._canInitEmulator,s,"emulator-config-failed"),K(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const i=!1,r=Ap(e),{host:o,port:l}=Mb(e),c=l===null?"":`:${l}`;s.config.emulator={url:`${r}//${o}${c}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:o,port:l,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:i})}),Db()}function Ap(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Mb(t){const e=Ap(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const s=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(s);if(i){const r=i[1];return{host:r,port:xh(s.substr(r.length+1))}}else{const[r,o]=s.split(":");return{host:r,port:xh(o)}}}function xh(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Db(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jc{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Hn("not implemented")}_getIdTokenResponse(e){return Hn("not implemented")}_linkToIdToken(e,n){return Hn("not implemented")}_getReauthenticationResolver(e){return Hn("not implemented")}}async function Bb(t,e){return An(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Lb(t,e){return ro(t,"POST","/v1/accounts:signInWithPassword",as(t,e))}async function kp(t,e){return An(t,"POST","/v1/accounts:sendOobCode",as(t,e))}async function Nb(t,e){return kp(t,e)}async function Ob(t,e){return kp(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fb(t,e){return ro(t,"POST","/v1/accounts:signInWithEmailLink",as(t,e))}async function Vb(t,e){return ro(t,"POST","/v1/accounts:signInWithEmailLink",as(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nr extends jc{constructor(e,n,s,i=null){super("password",s),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new Nr(e,n,"password")}static _fromEmailAndCode(e,n,s=null){return new Nr(e,n,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ma(e,n,"signInWithPassword",Lb);case"emailLink":return Fb(e,{email:this._email,oobCode:this._password});default:tn(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const s={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ma(e,s,"signUpPassword",Bb);case"emailLink":return Vb(e,{idToken:n,email:this._email,oobCode:this._password});default:tn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ai(t,e){return ro(t,"POST","/v1/accounts:signInWithIdp",as(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zb="http://localhost";class ei extends jc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new ei(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):tn("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:i}=n,r=Uc(n,["providerId","signInMethod"]);if(!s||!i)return null;const o=new ei(s,i);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Ai(e,n)}_linkToIdToken(e,n){const s=this.buildRequest();return s.idToken=n,Ai(e,s)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Ai(e,n)}buildRequest(){const e={requestUri:zb,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=so(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $b(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Ub(t){const e=yr(vr(t)).link,n=e?yr(vr(e)).deep_link_id:null,s=yr(vr(t)).deep_link_id;return(s?yr(vr(s)).link:null)||s||n||e||t}class Kc{constructor(e){var n,s,i,r,o,l;const c=yr(vr(e)),d=(n=c.apiKey)!==null&&n!==void 0?n:null,h=(s=c.oobCode)!==null&&s!==void 0?s:null,m=$b((i=c.mode)!==null&&i!==void 0?i:null);K(d&&h&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=h,this.continueUrl=(r=c.continueUrl)!==null&&r!==void 0?r:null,this.languageCode=(o=c.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const n=Ub(e);try{return new Kc(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yi{constructor(){this.providerId=Yi.PROVIDER_ID}static credential(e,n){return Nr._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const s=Kc.parseLink(n);return K(s,"argument-error"),Nr._fromEmailAndCode(e,s.code,s.tenantId)}}Yi.PROVIDER_ID="password";Yi.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Yi.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qc{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class oo extends Qc{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gs extends oo{constructor(){super("facebook.com")}static credential(e){return ei._fromParams({providerId:gs.PROVIDER_ID,signInMethod:gs.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return gs.credentialFromTaggedObject(e)}static credentialFromError(e){return gs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return gs.credential(e.oauthAccessToken)}catch{return null}}}gs.FACEBOOK_SIGN_IN_METHOD="facebook.com";gs.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn extends oo{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return ei._fromParams({providerId:qn.PROVIDER_ID,signInMethod:qn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return qn.credentialFromTaggedObject(e)}static credentialFromError(e){return qn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:s}=e;if(!n&&!s)return null;try{return qn.credential(n,s)}catch{return null}}}qn.GOOGLE_SIGN_IN_METHOD="google.com";qn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ys extends oo{constructor(){super("github.com")}static credential(e){return ei._fromParams({providerId:ys.PROVIDER_ID,signInMethod:ys.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ys.credentialFromTaggedObject(e)}static credentialFromError(e){return ys.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ys.credential(e.oauthAccessToken)}catch{return null}}}ys.GITHUB_SIGN_IN_METHOD="github.com";ys.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vs extends oo{constructor(){super("twitter.com")}static credential(e,n){return ei._fromParams({providerId:vs.PROVIDER_ID,signInMethod:vs.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return vs.credentialFromTaggedObject(e)}static credentialFromError(e){return vs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:s}=e;if(!n||!s)return null;try{return vs.credential(n,s)}catch{return null}}}vs.TWITTER_SIGN_IN_METHOD="twitter.com";vs.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qb(t,e){return ro(t,"POST","/v1/accounts:signUp",as(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ti{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,s,i=!1){const r=await Wn._fromIdTokenResponse(e,s,i),o=Ah(s);return new ti({user:r,providerId:o,_tokenResponse:s,operationType:n})}static async _forOperation(e,n,s){await e._updateTokensIfNecessary(s,!0);const i=Ah(s);return new ti({user:e,providerId:i,_tokenResponse:s,operationType:n})}}function Ah(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ga extends os{constructor(e,n,s,i){var r;super(n.code,n.message),this.operationType=s,this.user=i,Object.setPrototypeOf(this,ga.prototype),this.customData={appName:e.name,tenantId:(r=e.tenantId)!==null&&r!==void 0?r:void 0,_serverResponse:n.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,n,s,i){return new ga(e,n,s,i)}}function Cp(t,e,n,s){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?ga._fromErrorAndOperation(t,r,e,s):r})}async function Hb(t,e,n=!1){const s=await Bi(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return ti._forOperation(t,"link",s)}/**
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
 */async function Wb(t,e,n=!1){const{auth:s}=t;if(dn(s.app))return Promise.reject(jn(s));const i="reauthenticate";try{const r=await Bi(t,Cp(s,i,e,t),n);K(r.idToken,s,"internal-error");const o=Gc(r.idToken);K(o,s,"internal-error");const{sub:l}=o;return K(t.uid===l,s,"user-mismatch"),ti._forOperation(t,i,r)}catch(r){throw(r==null?void 0:r.code)==="auth/user-not-found"&&tn(s,"user-mismatch"),r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rp(t,e,n=!1){if(dn(t.app))return Promise.reject(jn(t));const s="signIn",i=await Cp(t,s,e),r=await ti._fromIdTokenResponse(t,s,i);return n||await t._updateCurrentUser(r.user),r}async function Gb(t,e){return Rp(ls(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pp(t){const e=ls(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Yb(t,e,n){const s=ls(t);await ma(s,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",Ob)}async function jb(t,e,n){if(dn(t.app))return Promise.reject(jn(t));const s=ls(t),o=await ma(s,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",qb).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&Pp(t),c}),l=await ti._fromIdTokenResponse(s,"signIn",o);return await s._updateCurrentUser(l.user),l}function Kb(t,e,n){return dn(t.app)?Promise.reject(jn(t)):Gb(Pe(t),Yi.credential(e,n)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&Pp(t),s})}async function Mp(t,e){const n=Pe(t),i={requestType:"VERIFY_EMAIL",idToken:await t.getIdToken()},{email:r}=await Nb(n.auth,i);r!==t.email&&await t.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qb(t,e){return An(t,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jb(t,{displayName:e,photoURL:n}){if(e===void 0&&n===void 0)return;const s=Pe(t),r={idToken:await s.getIdToken(),displayName:e,photoUrl:n,returnSecureToken:!0},o=await Bi(s,Qb(s.auth,r));s.displayName=o.displayName||null,s.photoURL=o.photoUrl||null;const l=s.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=s.displayName,l.photoURL=s.photoURL),await s._updateTokensIfNecessary(o)}function Xb(t,e,n,s){return Pe(t).onIdTokenChanged(e,n,s)}function Zb(t,e,n){return Pe(t).beforeAuthStateChanged(e,n)}function ew(t,e,n,s){return Pe(t).onAuthStateChanged(e,n,s)}function tw(t){return Pe(t).signOut()}async function nw(t){return Pe(t).delete()}const ya="__sak";/**
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
 */class Dp{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(ya,"1"),this.storage.removeItem(ya),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sw=1e3,iw=10;class Bp extends Dp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ip(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const s=this.storage.getItem(n),i=this.localCache[n];s!==i&&e(n,i,s)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const s=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(s);!n&&this.localCache[s]===o||this.notifyListeners(s,o)},r=this.storage.getItem(s);gb()&&r!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,iw):i()}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:s}),!0)})},sw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Bp.type="LOCAL";const rw=Bp;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lp extends Dp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Lp.type="SESSION";const Np=Lp;/**
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
 */function ow(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class Fa{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const s=new Fa(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:s,eventType:i,data:r}=n.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:s,eventType:i});const l=Array.from(o).map(async d=>d(n.origin,r)),c=await ow(l);n.ports[0].postMessage({status:"done",eventId:s,eventType:i,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Fa.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jc(t="",e=10){let n="";for(let s=0;s<e;s++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class aw{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,s=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let r,o;return new Promise((l,c)=>{const d=Jc("",20);i.port1.start();const h=setTimeout(()=>{c(new Error("unsupported_event"))},s);o={messageChannel:i,onMessage(m){const p=m;if(p.data.eventId===d)switch(p.data.status){case"ack":clearTimeout(h),r=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),l(p.data.response);break;default:clearTimeout(h),clearTimeout(r),c(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:d,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function En(){return window}function lw(t){En().location.href=t}/**
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
 */function Op(){return typeof En().WorkerGlobalScope<"u"&&typeof En().importScripts=="function"}async function cw(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function dw(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function uw(){return Op()?self:null}/**
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
 */const Fp="firebaseLocalStorageDb",hw=1,va="firebaseLocalStorage",Vp="fbase_key";class ao{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Va(t,e){return t.transaction([va],e?"readwrite":"readonly").objectStore(va)}function fw(){const t=indexedDB.deleteDatabase(Fp);return new ao(t).toPromise()}function nc(){const t=indexedDB.open(Fp,hw);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const s=t.result;try{s.createObjectStore(va,{keyPath:Vp})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const s=t.result;s.objectStoreNames.contains(va)?e(s):(s.close(),await fw(),e(await nc()))})})}async function kh(t,e,n){const s=Va(t,!0).put({[Vp]:e,value:n});return new ao(s).toPromise()}async function pw(t,e){const n=Va(t,!1).get(e),s=await new ao(n).toPromise();return s===void 0?null:s.value}function Ch(t,e){const n=Va(t,!0).delete(e);return new ao(n).toPromise()}const mw=800,gw=3;class zp{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await nc(),this.db)}async _withRetries(e){let n=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(n++>gw)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Op()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Fa._getInstance(uw()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await cw(),!this.activeServiceWorker)return;this.sender=new aw(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((n=s[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||dw()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await nc();return await kh(e,ya,"1"),await Ch(e,ya),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(s=>kh(s,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(s=>pw(s,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Ch(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const r=Va(i,!1).getAll();return new ao(r).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],s=new Set;if(e.length!==0)for(const{fbase_key:i,value:r}of e)s.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(r)&&(this.notifyListeners(i,r),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!s.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const i of Array.from(s))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),mw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}zp.type="LOCAL";const yw=zp;new io(3e4,6e4);/**
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
 */function $p(t,e){return e?Gn(e):(K(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class Xc extends jc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ai(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Ai(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Ai(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function vw(t){return Rp(t.auth,new Xc(t),t.bypassAuthState)}function bw(t){const{auth:e,user:n}=t;return K(n,e,"internal-error"),Wb(n,new Xc(t),t.bypassAuthState)}async function ww(t){const{auth:e,user:n}=t;return K(n,e,"internal-error"),Hb(n,new Xc(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Up{constructor(e,n,s,i,r=!1){this.auth=e,this.resolver=s,this.user=i,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:s,postBody:i,tenantId:r,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:n,sessionId:s,tenantId:r||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return vw;case"linkViaPopup":case"linkViaRedirect":return ww;case"reauthViaPopup":case"reauthViaRedirect":return bw;default:tn(this.auth,"internal-error")}}resolve(e){Zn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Zn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _w=new io(2e3,1e4);async function Ew(t,e,n){if(dn(t.app))return Promise.reject(un(t,"operation-not-supported-in-this-environment"));const s=ls(t);J0(t,e,Qc);const i=$p(s,n);return new Ws(s,"signInViaPopup",e,i).executeNotNull()}class Ws extends Up{constructor(e,n,s,i,r){super(e,n,i,r),this.provider=s,this.authWindow=null,this.pollId=null,Ws.currentPopupAction&&Ws.currentPopupAction.cancel(),Ws.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return K(e,this.auth,"internal-error"),e}async onExecution(){Zn(this.filter.length===1,"Popup operations only handle one event");const e=Jc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(un(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(un(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ws.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,s;if(!((s=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(un(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,_w.get())};e()}}Ws.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tw="pendingRedirect",Qo=new Map;class Iw extends Up{constructor(e,n,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,s),this.eventId=null}async execute(){let e=Qo.get(this.auth._key());if(!e){try{const s=await Sw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(n){e=()=>Promise.reject(n)}Qo.set(this.auth._key(),e)}return this.bypassAuthState||Qo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Sw(t,e){const n=kw(e),s=Aw(t);if(!await s._isAvailable())return!1;const i=await s._get(n)==="true";return await s._remove(n),i}function xw(t,e){Qo.set(t._key(),e)}function Aw(t){return Gn(t._redirectPersistence)}function kw(t){return Ko(Tw,t.config.apiKey,t.name)}async function Cw(t,e,n=!1){if(dn(t.app))return Promise.reject(jn(t));const s=ls(t),i=$p(s,e),o=await new Iw(s,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rw=10*60*1e3;class Pw{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(n=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Mw(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var s;if(e.error&&!qp(e)){const i=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";n.onError(un(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const s=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Rw&&this.cachedEventUids.clear(),this.cachedEventUids.has(Rh(e))}saveEventToCache(e){this.cachedEventUids.add(Rh(e)),this.lastProcessedEventTime=Date.now()}}function Rh(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function qp({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Mw(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return qp(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dw(t,e={}){return An(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Lw=/^https?/;async function Nw(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Dw(t);for(const n of e)try{if(Ow(n))return}catch{}tn(t,"unauthorized-domain")}function Ow(t){const e=ec(),{protocol:n,hostname:s}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&s===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===s}if(!Lw.test(n))return!1;if(Bw.test(t))return s===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(s)}/**
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
 */const Fw=new io(3e4,6e4);function Ph(){const t=En().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Vw(t){return new Promise((e,n)=>{var s,i,r;function o(){Ph(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ph(),n(un(t,"network-request-failed"))},timeout:Fw.get()})}if(!((i=(s=En().gapi)===null||s===void 0?void 0:s.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((r=En().gapi)===null||r===void 0)&&r.load)o();else{const l=Sb("iframefcb");return En()[l]=()=>{gapi.load?o():n(un(t,"network-request-failed"))},xp(`${Ib()}?onload=${l}`).catch(c=>n(c))}}).catch(e=>{throw Jo=null,e})}let Jo=null;function zw(t){return Jo=Jo||Vw(t),Jo}/**
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
 */const $w=new io(5e3,15e3),Uw="__/auth/iframe",qw="emulator/auth/iframe",Hw={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Ww=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Gw(t){const e=t.config;K(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Wc(e,qw):`https://${t.config.authDomain}/${Uw}`,s={apiKey:e.apiKey,appName:t.name,v:Gi},i=Ww.get(t.config.apiHost);i&&(s.eid=i);const r=t._getFrameworks();return r.length&&(s.fw=r.join(",")),`${n}?${so(s).slice(1)}`}async function Yw(t){const e=await zw(t),n=En().gapi;return K(n,t,"internal-error"),e.open({where:document.body,url:Gw(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Hw,dontclear:!0},s=>new Promise(async(i,r)=>{await s.restyle({setHideOnLeave:!1});const o=un(t,"network-request-failed"),l=En().setTimeout(()=>{r(o)},$w.get());function c(){En().clearTimeout(l),i(s)}s.ping(c).then(c,()=>{r(o)})}))}/**
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
 */const jw={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Kw=500,Qw=600,Jw="_blank",Xw="http://localhost";class Mh{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Zw(t,e,n,s=Kw,i=Qw){const r=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const c=Object.assign(Object.assign({},jw),{width:s.toString(),height:i.toString(),top:r,left:o}),d=yt().toLowerCase();n&&(l=bp(d)?Jw:n),yp(d)&&(e=e||Xw,c.scrollbars="yes");const h=Object.entries(c).reduce((p,[w,I])=>`${p}${w}=${I},`,"");if(mb(d)&&l!=="_self")return e_(e||"",l),new Mh(null);const m=window.open(e||"",l,h);K(m,t,"popup-blocked");try{m.focus()}catch{}return new Mh(m)}function e_(t,e){const n=document.createElement("a");n.href=t,n.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(s)}/**
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
 */const t_="__/auth/handler",n_="emulator/auth/handler",s_=encodeURIComponent("fac");async function Dh(t,e,n,s,i,r){K(t.config.authDomain,t,"auth-domain-config-required"),K(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:s,v:Gi,eventId:i};if(e instanceof Qc){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",Nv(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,m]of Object.entries({}))o[h]=m}if(e instanceof oo){const h=e.getScopes().filter(m=>m!=="");h.length>0&&(o.scopes=h.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const h of Object.keys(l))l[h]===void 0&&delete l[h];const c=await t._getAppCheckToken(),d=c?`#${s_}=${encodeURIComponent(c)}`:"";return`${i_(t)}?${so(l).slice(1)}${d}`}function i_({config:t}){return t.emulator?Wc(t,n_):`https://${t.authDomain}/${t_}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vl="webStorageSupport";class r_{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Np,this._completeRedirectFn=Cw,this._overrideRedirectResult=xw}async _openPopup(e,n,s,i){var r;Zn((r=this.eventManagers[e._key()])===null||r===void 0?void 0:r.manager,"_initialize() not called before _openPopup()");const o=await Dh(e,n,s,ec(),i);return Zw(e,o,Jc())}async _openRedirect(e,n,s,i){await this._originValidation(e);const r=await Dh(e,n,s,ec(),i);return lw(r),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:r}=this.eventManagers[n];return i?Promise.resolve(i):(Zn(r,"If manager is not set, promise should be"),r)}const s=this.initAndGetManager(e);return this.eventManagers[n]={promise:s},s.catch(()=>{delete this.eventManagers[n]}),s}async initAndGetManager(e){const n=await Yw(e),s=new Pw(e);return n.register("authEvent",i=>(K(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:s.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=n,s}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Vl,{type:Vl},i=>{var r;const o=(r=i==null?void 0:i[0])===null||r===void 0?void 0:r[Vl];o!==void 0&&n(!!o),tn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Nw(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Ip()||vp()||Yc()}}const o_=r_;var Bh="@firebase/auth",Lh="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a_{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){K(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function l_(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function c_(t){Di(new Zs("auth",(e,{options:n})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),r=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=s.options;K(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Sp(t)},d=new _b(s,i,r,c);return Rb(d,n),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,s)=>{e.getProvider("auth-internal").initialize()})),Di(new Zs("auth-internal",e=>{const n=ls(e.getProvider("auth").getImmediate());return(s=>new a_(s))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ss(Bh,Lh,l_(t)),Ss(Bh,Lh,"esm2017")}/**
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
 */const d_=5*60,u_=np("authIdTokenMaxAge")||d_;let Nh=null;const h_=t=>async e=>{const n=e&&await e.getIdTokenResult(),s=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(s&&s>u_)return;const i=n==null?void 0:n.token;Nh!==i&&(Nh=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function f_(t=op()){const e=$c(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Cb(t,{popupRedirectResolver:o_,persistence:[yw,rw,Np]}),s=np("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const r=new URL(s,location.origin);if(location.origin===r.origin){const o=h_(r.toString());Zb(n,o,()=>o(n.currentUser)),Xb(n,l=>o(l))}}const i=ep("auth");return i&&Pb(n,`http://${i}`),n}function p_(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}Eb({loadJS(t){return new Promise((e,n)=>{const s=document.createElement("script");s.setAttribute("src",t),s.onload=e,s.onerror=i=>{const r=un("internal-error");r.customData=i,n(r)},s.type="text/javascript",s.charset="UTF-8",p_().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});c_("Browser");var Oh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ks,Hp;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,v){function _(){}_.prototype=v.prototype,T.D=v.prototype,T.prototype=new _,T.prototype.constructor=T,T.C=function(b,E,x){for(var y=Array(arguments.length-2),te=2;te<arguments.length;te++)y[te-2]=arguments[te];return v.prototype[E].apply(b,y)}}function n(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,n),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(T,v,_){_||(_=0);var b=Array(16);if(typeof v=="string")for(var E=0;16>E;++E)b[E]=v.charCodeAt(_++)|v.charCodeAt(_++)<<8|v.charCodeAt(_++)<<16|v.charCodeAt(_++)<<24;else for(E=0;16>E;++E)b[E]=v[_++]|v[_++]<<8|v[_++]<<16|v[_++]<<24;v=T.g[0],_=T.g[1],E=T.g[2];var x=T.g[3],y=v+(x^_&(E^x))+b[0]+3614090360&4294967295;v=_+(y<<7&4294967295|y>>>25),y=x+(E^v&(_^E))+b[1]+3905402710&4294967295,x=v+(y<<12&4294967295|y>>>20),y=E+(_^x&(v^_))+b[2]+606105819&4294967295,E=x+(y<<17&4294967295|y>>>15),y=_+(v^E&(x^v))+b[3]+3250441966&4294967295,_=E+(y<<22&4294967295|y>>>10),y=v+(x^_&(E^x))+b[4]+4118548399&4294967295,v=_+(y<<7&4294967295|y>>>25),y=x+(E^v&(_^E))+b[5]+1200080426&4294967295,x=v+(y<<12&4294967295|y>>>20),y=E+(_^x&(v^_))+b[6]+2821735955&4294967295,E=x+(y<<17&4294967295|y>>>15),y=_+(v^E&(x^v))+b[7]+4249261313&4294967295,_=E+(y<<22&4294967295|y>>>10),y=v+(x^_&(E^x))+b[8]+1770035416&4294967295,v=_+(y<<7&4294967295|y>>>25),y=x+(E^v&(_^E))+b[9]+2336552879&4294967295,x=v+(y<<12&4294967295|y>>>20),y=E+(_^x&(v^_))+b[10]+4294925233&4294967295,E=x+(y<<17&4294967295|y>>>15),y=_+(v^E&(x^v))+b[11]+2304563134&4294967295,_=E+(y<<22&4294967295|y>>>10),y=v+(x^_&(E^x))+b[12]+1804603682&4294967295,v=_+(y<<7&4294967295|y>>>25),y=x+(E^v&(_^E))+b[13]+4254626195&4294967295,x=v+(y<<12&4294967295|y>>>20),y=E+(_^x&(v^_))+b[14]+2792965006&4294967295,E=x+(y<<17&4294967295|y>>>15),y=_+(v^E&(x^v))+b[15]+1236535329&4294967295,_=E+(y<<22&4294967295|y>>>10),y=v+(E^x&(_^E))+b[1]+4129170786&4294967295,v=_+(y<<5&4294967295|y>>>27),y=x+(_^E&(v^_))+b[6]+3225465664&4294967295,x=v+(y<<9&4294967295|y>>>23),y=E+(v^_&(x^v))+b[11]+643717713&4294967295,E=x+(y<<14&4294967295|y>>>18),y=_+(x^v&(E^x))+b[0]+3921069994&4294967295,_=E+(y<<20&4294967295|y>>>12),y=v+(E^x&(_^E))+b[5]+3593408605&4294967295,v=_+(y<<5&4294967295|y>>>27),y=x+(_^E&(v^_))+b[10]+38016083&4294967295,x=v+(y<<9&4294967295|y>>>23),y=E+(v^_&(x^v))+b[15]+3634488961&4294967295,E=x+(y<<14&4294967295|y>>>18),y=_+(x^v&(E^x))+b[4]+3889429448&4294967295,_=E+(y<<20&4294967295|y>>>12),y=v+(E^x&(_^E))+b[9]+568446438&4294967295,v=_+(y<<5&4294967295|y>>>27),y=x+(_^E&(v^_))+b[14]+3275163606&4294967295,x=v+(y<<9&4294967295|y>>>23),y=E+(v^_&(x^v))+b[3]+4107603335&4294967295,E=x+(y<<14&4294967295|y>>>18),y=_+(x^v&(E^x))+b[8]+1163531501&4294967295,_=E+(y<<20&4294967295|y>>>12),y=v+(E^x&(_^E))+b[13]+2850285829&4294967295,v=_+(y<<5&4294967295|y>>>27),y=x+(_^E&(v^_))+b[2]+4243563512&4294967295,x=v+(y<<9&4294967295|y>>>23),y=E+(v^_&(x^v))+b[7]+1735328473&4294967295,E=x+(y<<14&4294967295|y>>>18),y=_+(x^v&(E^x))+b[12]+2368359562&4294967295,_=E+(y<<20&4294967295|y>>>12),y=v+(_^E^x)+b[5]+4294588738&4294967295,v=_+(y<<4&4294967295|y>>>28),y=x+(v^_^E)+b[8]+2272392833&4294967295,x=v+(y<<11&4294967295|y>>>21),y=E+(x^v^_)+b[11]+1839030562&4294967295,E=x+(y<<16&4294967295|y>>>16),y=_+(E^x^v)+b[14]+4259657740&4294967295,_=E+(y<<23&4294967295|y>>>9),y=v+(_^E^x)+b[1]+2763975236&4294967295,v=_+(y<<4&4294967295|y>>>28),y=x+(v^_^E)+b[4]+1272893353&4294967295,x=v+(y<<11&4294967295|y>>>21),y=E+(x^v^_)+b[7]+4139469664&4294967295,E=x+(y<<16&4294967295|y>>>16),y=_+(E^x^v)+b[10]+3200236656&4294967295,_=E+(y<<23&4294967295|y>>>9),y=v+(_^E^x)+b[13]+681279174&4294967295,v=_+(y<<4&4294967295|y>>>28),y=x+(v^_^E)+b[0]+3936430074&4294967295,x=v+(y<<11&4294967295|y>>>21),y=E+(x^v^_)+b[3]+3572445317&4294967295,E=x+(y<<16&4294967295|y>>>16),y=_+(E^x^v)+b[6]+76029189&4294967295,_=E+(y<<23&4294967295|y>>>9),y=v+(_^E^x)+b[9]+3654602809&4294967295,v=_+(y<<4&4294967295|y>>>28),y=x+(v^_^E)+b[12]+3873151461&4294967295,x=v+(y<<11&4294967295|y>>>21),y=E+(x^v^_)+b[15]+530742520&4294967295,E=x+(y<<16&4294967295|y>>>16),y=_+(E^x^v)+b[2]+3299628645&4294967295,_=E+(y<<23&4294967295|y>>>9),y=v+(E^(_|~x))+b[0]+4096336452&4294967295,v=_+(y<<6&4294967295|y>>>26),y=x+(_^(v|~E))+b[7]+1126891415&4294967295,x=v+(y<<10&4294967295|y>>>22),y=E+(v^(x|~_))+b[14]+2878612391&4294967295,E=x+(y<<15&4294967295|y>>>17),y=_+(x^(E|~v))+b[5]+4237533241&4294967295,_=E+(y<<21&4294967295|y>>>11),y=v+(E^(_|~x))+b[12]+1700485571&4294967295,v=_+(y<<6&4294967295|y>>>26),y=x+(_^(v|~E))+b[3]+2399980690&4294967295,x=v+(y<<10&4294967295|y>>>22),y=E+(v^(x|~_))+b[10]+4293915773&4294967295,E=x+(y<<15&4294967295|y>>>17),y=_+(x^(E|~v))+b[1]+2240044497&4294967295,_=E+(y<<21&4294967295|y>>>11),y=v+(E^(_|~x))+b[8]+1873313359&4294967295,v=_+(y<<6&4294967295|y>>>26),y=x+(_^(v|~E))+b[15]+4264355552&4294967295,x=v+(y<<10&4294967295|y>>>22),y=E+(v^(x|~_))+b[6]+2734768916&4294967295,E=x+(y<<15&4294967295|y>>>17),y=_+(x^(E|~v))+b[13]+1309151649&4294967295,_=E+(y<<21&4294967295|y>>>11),y=v+(E^(_|~x))+b[4]+4149444226&4294967295,v=_+(y<<6&4294967295|y>>>26),y=x+(_^(v|~E))+b[11]+3174756917&4294967295,x=v+(y<<10&4294967295|y>>>22),y=E+(v^(x|~_))+b[2]+718787259&4294967295,E=x+(y<<15&4294967295|y>>>17),y=_+(x^(E|~v))+b[9]+3951481745&4294967295,T.g[0]=T.g[0]+v&4294967295,T.g[1]=T.g[1]+(E+(y<<21&4294967295|y>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+x&4294967295}s.prototype.u=function(T,v){v===void 0&&(v=T.length);for(var _=v-this.blockSize,b=this.B,E=this.h,x=0;x<v;){if(E==0)for(;x<=_;)i(this,T,x),x+=this.blockSize;if(typeof T=="string"){for(;x<v;)if(b[E++]=T.charCodeAt(x++),E==this.blockSize){i(this,b),E=0;break}}else for(;x<v;)if(b[E++]=T[x++],E==this.blockSize){i(this,b),E=0;break}}this.h=E,this.o+=v},s.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var v=1;v<T.length-8;++v)T[v]=0;var _=8*this.o;for(v=T.length-8;v<T.length;++v)T[v]=_&255,_/=256;for(this.u(T),T=Array(16),v=_=0;4>v;++v)for(var b=0;32>b;b+=8)T[_++]=this.g[v]>>>b&255;return T};function r(T,v){var _=l;return Object.prototype.hasOwnProperty.call(_,T)?_[T]:_[T]=v(T)}function o(T,v){this.h=v;for(var _=[],b=!0,E=T.length-1;0<=E;E--){var x=T[E]|0;b&&x==v||(_[E]=x,b=!1)}this.g=_}var l={};function c(T){return-128<=T&&128>T?r(T,function(v){return new o([v|0],0>v?-1:0)}):new o([T|0],0>T?-1:0)}function d(T){if(isNaN(T)||!isFinite(T))return m;if(0>T)return A(d(-T));for(var v=[],_=1,b=0;T>=_;b++)v[b]=T/_|0,_*=4294967296;return new o(v,0)}function h(T,v){if(T.length==0)throw Error("number format error: empty string");if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(T.charAt(0)=="-")return A(h(T.substring(1),v));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=d(Math.pow(v,8)),b=m,E=0;E<T.length;E+=8){var x=Math.min(8,T.length-E),y=parseInt(T.substring(E,E+x),v);8>x?(x=d(Math.pow(v,x)),b=b.j(x).add(d(y))):(b=b.j(_),b=b.add(d(y)))}return b}var m=c(0),p=c(1),w=c(16777216);t=o.prototype,t.m=function(){if(S(this))return-A(this).m();for(var T=0,v=1,_=0;_<this.g.length;_++){var b=this.i(_);T+=(0<=b?b:4294967296+b)*v,v*=4294967296}return T},t.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(I(this))return"0";if(S(this))return"-"+A(this).toString(T);for(var v=d(Math.pow(T,6)),_=this,b="";;){var E=D(_,v).g;_=P(_,E.j(v));var x=((0<_.g.length?_.g[0]:_.h)>>>0).toString(T);if(_=E,I(_))return x+b;for(;6>x.length;)x="0"+x;b=x+b}},t.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function I(T){if(T.h!=0)return!1;for(var v=0;v<T.g.length;v++)if(T.g[v]!=0)return!1;return!0}function S(T){return T.h==-1}t.l=function(T){return T=P(this,T),S(T)?-1:I(T)?0:1};function A(T){for(var v=T.g.length,_=[],b=0;b<v;b++)_[b]=~T.g[b];return new o(_,~T.h).add(p)}t.abs=function(){return S(this)?A(this):this},t.add=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],b=0,E=0;E<=v;E++){var x=b+(this.i(E)&65535)+(T.i(E)&65535),y=(x>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);b=y>>>16,x&=65535,y&=65535,_[E]=y<<16|x}return new o(_,_[_.length-1]&-2147483648?-1:0)};function P(T,v){return T.add(A(v))}t.j=function(T){if(I(this)||I(T))return m;if(S(this))return S(T)?A(this).j(A(T)):A(A(this).j(T));if(S(T))return A(this.j(A(T)));if(0>this.l(w)&&0>T.l(w))return d(this.m()*T.m());for(var v=this.g.length+T.g.length,_=[],b=0;b<2*v;b++)_[b]=0;for(b=0;b<this.g.length;b++)for(var E=0;E<T.g.length;E++){var x=this.i(b)>>>16,y=this.i(b)&65535,te=T.i(E)>>>16,re=T.i(E)&65535;_[2*b+2*E]+=y*re,C(_,2*b+2*E),_[2*b+2*E+1]+=x*re,C(_,2*b+2*E+1),_[2*b+2*E+1]+=y*te,C(_,2*b+2*E+1),_[2*b+2*E+2]+=x*te,C(_,2*b+2*E+2)}for(b=0;b<v;b++)_[b]=_[2*b+1]<<16|_[2*b];for(b=v;b<2*v;b++)_[b]=0;return new o(_,0)};function C(T,v){for(;(T[v]&65535)!=T[v];)T[v+1]+=T[v]>>>16,T[v]&=65535,v++}function L(T,v){this.g=T,this.h=v}function D(T,v){if(I(v))throw Error("division by zero");if(I(T))return new L(m,m);if(S(T))return v=D(A(T),v),new L(A(v.g),A(v.h));if(S(v))return v=D(T,A(v)),new L(A(v.g),v.h);if(30<T.g.length){if(S(T)||S(v))throw Error("slowDivide_ only works with positive integers.");for(var _=p,b=v;0>=b.l(T);)_=O(_),b=O(b);var E=U(_,1),x=U(b,1);for(b=U(b,2),_=U(_,2);!I(b);){var y=x.add(b);0>=y.l(T)&&(E=E.add(_),x=y),b=U(b,1),_=U(_,1)}return v=P(T,E.j(v)),new L(E,v)}for(E=m;0<=T.l(v);){for(_=Math.max(1,Math.floor(T.m()/v.m())),b=Math.ceil(Math.log(_)/Math.LN2),b=48>=b?1:Math.pow(2,b-48),x=d(_),y=x.j(v);S(y)||0<y.l(T);)_-=b,x=d(_),y=x.j(v);I(x)&&(x=p),E=E.add(x),T=P(T,y)}return new L(E,T)}t.A=function(T){return D(this,T).h},t.and=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],b=0;b<v;b++)_[b]=this.i(b)&T.i(b);return new o(_,this.h&T.h)},t.or=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],b=0;b<v;b++)_[b]=this.i(b)|T.i(b);return new o(_,this.h|T.h)},t.xor=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],b=0;b<v;b++)_[b]=this.i(b)^T.i(b);return new o(_,this.h^T.h)};function O(T){for(var v=T.g.length+1,_=[],b=0;b<v;b++)_[b]=T.i(b)<<1|T.i(b-1)>>>31;return new o(_,T.h)}function U(T,v){var _=v>>5;v%=32;for(var b=T.g.length-_,E=[],x=0;x<b;x++)E[x]=0<v?T.i(x+_)>>>v|T.i(x+_+1)<<32-v:T.i(x+_);return new o(E,T.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,Hp=s,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=d,o.fromString=h,Ks=o}).apply(typeof Oh<"u"?Oh:typeof self<"u"?self:typeof window<"u"?window:{});var qo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Wp,br,Gp,Xo,sc,Yp,jp,Kp;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,u,f){return a==Array.prototype||a==Object.prototype||(a[u]=f.value),a};function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof qo=="object"&&qo];for(var u=0;u<a.length;++u){var f=a[u];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var s=n(this);function i(a,u){if(u)e:{var f=s;a=a.split(".");for(var g=0;g<a.length-1;g++){var k=a[g];if(!(k in f))break e;f=f[k]}a=a[a.length-1],g=f[a],u=u(g),u!=g&&u!=null&&e(f,a,{configurable:!0,writable:!0,value:u})}}function r(a,u){a instanceof String&&(a+="");var f=0,g=!1,k={next:function(){if(!g&&f<a.length){var R=f++;return{value:u(R,a[R]),done:!1}}return g=!0,{done:!0,value:void 0}}};return k[Symbol.iterator]=function(){return k},k}i("Array.prototype.values",function(a){return a||function(){return r(this,function(u,f){return f})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var u=typeof a;return u=u!="object"?u:a?Array.isArray(a)?"array":u:"null",u=="array"||u=="object"&&typeof a.length=="number"}function d(a){var u=typeof a;return u=="object"&&a!=null||u=="function"}function h(a,u,f){return a.call.apply(a.bind,arguments)}function m(a,u,f){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var k=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(k,g),a.apply(u,k)}}return function(){return a.apply(u,arguments)}}function p(a,u,f){return p=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?h:m,p.apply(null,arguments)}function w(a,u){var f=Array.prototype.slice.call(arguments,1);return function(){var g=f.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function I(a,u){function f(){}f.prototype=u.prototype,a.aa=u.prototype,a.prototype=new f,a.prototype.constructor=a,a.Qb=function(g,k,R){for(var V=Array(arguments.length-2),be=2;be<arguments.length;be++)V[be-2]=arguments[be];return u.prototype[k].apply(g,V)}}function S(a){const u=a.length;if(0<u){const f=Array(u);for(let g=0;g<u;g++)f[g]=a[g];return f}return[]}function A(a,u){for(let f=1;f<arguments.length;f++){const g=arguments[f];if(c(g)){const k=a.length||0,R=g.length||0;a.length=k+R;for(let V=0;V<R;V++)a[k+V]=g[V]}else a.push(g)}}class P{constructor(u,f){this.i=u,this.j=f,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function C(a){return/^[\s\xa0]*$/.test(a)}function L(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function D(a){return D[" "](a),a}D[" "]=function(){};var O=L().indexOf("Gecko")!=-1&&!(L().toLowerCase().indexOf("webkit")!=-1&&L().indexOf("Edge")==-1)&&!(L().indexOf("Trident")!=-1||L().indexOf("MSIE")!=-1)&&L().indexOf("Edge")==-1;function U(a,u,f){for(const g in a)u.call(f,a[g],g,a)}function T(a,u){for(const f in a)u.call(void 0,a[f],f,a)}function v(a){const u={};for(const f in a)u[f]=a[f];return u}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function b(a,u){let f,g;for(let k=1;k<arguments.length;k++){g=arguments[k];for(f in g)a[f]=g[f];for(let R=0;R<_.length;R++)f=_[R],Object.prototype.hasOwnProperty.call(g,f)&&(a[f]=g[f])}}function E(a){var u=1;a=a.split(":");const f=[];for(;0<u&&a.length;)f.push(a.shift()),u--;return a.length&&f.push(a.join(":")),f}function x(a){l.setTimeout(()=>{throw a},0)}function y(){var a=oe;let u=null;return a.g&&(u=a.g,a.g=a.g.next,a.g||(a.h=null),u.next=null),u}class te{constructor(){this.h=this.g=null}add(u,f){const g=re.get();g.set(u,f),this.h?this.h.next=g:this.g=g,this.h=g}}var re=new P(()=>new q,a=>a.reset());class q{constructor(){this.next=this.g=this.h=null}set(u,f){this.h=u,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let ne,se=!1,oe=new te,ve=()=>{const a=l.Promise.resolve(void 0);ne=()=>{a.then(Te)}};var Te=()=>{for(var a;a=y();){try{a.h.call(a.g)}catch(f){x(f)}var u=re;u.j(a),100>u.h&&(u.h++,a.next=u.g,u.g=a)}se=!1};function ie(){this.s=this.s,this.C=this.C}ie.prototype.s=!1,ie.prototype.ma=function(){this.s||(this.s=!0,this.N())},ie.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function F(a,u){this.type=a,this.g=this.target=u,this.defaultPrevented=!1}F.prototype.h=function(){this.defaultPrevented=!0};var X=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,u=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};l.addEventListener("test",f,u),l.removeEventListener("test",f,u)}catch{}return a}();function Ie(a,u){if(F.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var f=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=u,u=a.relatedTarget){if(O){e:{try{D(u.nodeName);var k=!0;break e}catch{}k=!1}k||(u=null)}}else f=="mouseover"?u=a.fromElement:f=="mouseout"&&(u=a.toElement);this.relatedTarget=u,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Et[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&Ie.aa.h.call(this)}}I(Ie,F);var Et={2:"touch",3:"pen",4:"mouse"};Ie.prototype.h=function(){Ie.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Vt="closure_listenable_"+(1e6*Math.random()|0),Ye=0;function me(a,u,f,g,k){this.listener=a,this.proxy=null,this.src=u,this.type=f,this.capture=!!g,this.ha=k,this.key=++Ye,this.da=this.fa=!1}function de(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Qe(a){this.src=a,this.g={},this.h=0}Qe.prototype.add=function(a,u,f,g,k){var R=a.toString();a=this.g[R],a||(a=this.g[R]=[],this.h++);var V=Kt(a,u,g,k);return-1<V?(u=a[V],f||(u.fa=!1)):(u=new me(u,this.src,R,!!g,k),u.fa=f,a.push(u)),u};function sn(a,u){var f=u.type;if(f in a.g){var g=a.g[f],k=Array.prototype.indexOf.call(g,u,void 0),R;(R=0<=k)&&Array.prototype.splice.call(g,k,1),R&&(de(u),a.g[f].length==0&&(delete a.g[f],a.h--))}}function Kt(a,u,f,g){for(var k=0;k<a.length;++k){var R=a[k];if(!R.da&&R.listener==u&&R.capture==!!f&&R.ha==g)return k}return-1}var ze="closure_lm_"+(1e6*Math.random()|0),$e={};function pn(a,u,f,g,k){if(Array.isArray(u)){for(var R=0;R<u.length;R++)pn(a,u[R],f,g,k);return null}return f=gn(f),a&&a[Vt]?a.K(u,f,d(g)?!!g.capture:!1,k):Rt(a,u,f,!1,g,k)}function Rt(a,u,f,g,k,R){if(!u)throw Error("Invalid event type");var V=d(k)?!!k.capture:!!k,be=rn(a);if(be||(a[ze]=be=new Qe(a)),f=be.add(u,f,g,V,R),f.proxy)return f;if(g=zt(),f.proxy=g,g.src=a,g.listener=f,a.addEventListener)X||(k=V),k===void 0&&(k=!1),a.addEventListener(u.toString(),g,k);else if(a.attachEvent)a.attachEvent(Mn(u.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return f}function zt(){function a(f){return u.call(a.src,a.listener,f)}const u=Fs;return a}function Os(a,u,f,g,k){if(Array.isArray(u))for(var R=0;R<u.length;R++)Os(a,u[R],f,g,k);else g=d(g)?!!g.capture:!!g,f=gn(f),a&&a[Vt]?(a=a.i,u=String(u).toString(),u in a.g&&(R=a.g[u],f=Kt(R,f,g,k),-1<f&&(de(R[f]),Array.prototype.splice.call(R,f,1),R.length==0&&(delete a.g[u],a.h--)))):a&&(a=rn(a))&&(u=a.g[u.toString()],a=-1,u&&(a=Kt(u,f,g,k)),(f=-1<a?u[a]:null)&&mn(f))}function mn(a){if(typeof a!="number"&&a&&!a.da){var u=a.src;if(u&&u[Vt])sn(u.i,a);else{var f=a.type,g=a.proxy;u.removeEventListener?u.removeEventListener(f,g,a.capture):u.detachEvent?u.detachEvent(Mn(f),g):u.addListener&&u.removeListener&&u.removeListener(g),(f=rn(u))?(sn(f,a),f.h==0&&(f.src=null,u[ze]=null)):de(a)}}}function Mn(a){return a in $e?$e[a]:$e[a]="on"+a}function Fs(a,u){if(a.da)a=!0;else{u=new Ie(u,this);var f=a.listener,g=a.ha||a.src;a.fa&&mn(a),a=f.call(g,u)}return a}function rn(a){return a=a[ze],a instanceof Qe?a:null}var Pt="__closure_events_fn_"+(1e9*Math.random()>>>0);function gn(a){return typeof a=="function"?a:(a[Pt]||(a[Pt]=function(u){return a.handleEvent(u)}),a[Pt])}function Oe(){ie.call(this),this.i=new Qe(this),this.M=this,this.F=null}I(Oe,ie),Oe.prototype[Vt]=!0,Oe.prototype.removeEventListener=function(a,u,f,g){Os(this,a,u,f,g)};function Ue(a,u){var f,g=a.F;if(g)for(f=[];g;g=g.F)f.push(g);if(a=a.M,g=u.type||u,typeof u=="string")u=new F(u,a);else if(u instanceof F)u.target=u.target||a;else{var k=u;u=new F(g,a),b(u,k)}if(k=!0,f)for(var R=f.length-1;0<=R;R--){var V=u.g=f[R];k=Mt(V,g,!0,u)&&k}if(V=u.g=a,k=Mt(V,g,!0,u)&&k,k=Mt(V,g,!1,u)&&k,f)for(R=0;R<f.length;R++)V=u.g=f[R],k=Mt(V,g,!1,u)&&k}Oe.prototype.N=function(){if(Oe.aa.N.call(this),this.i){var a=this.i,u;for(u in a.g){for(var f=a.g[u],g=0;g<f.length;g++)de(f[g]);delete a.g[u],a.h--}}this.F=null},Oe.prototype.K=function(a,u,f,g){return this.i.add(String(a),u,!1,f,g)},Oe.prototype.L=function(a,u,f,g){return this.i.add(String(a),u,!0,f,g)};function Mt(a,u,f,g){if(u=a.i.g[String(u)],!u)return!0;u=u.concat();for(var k=!0,R=0;R<u.length;++R){var V=u[R];if(V&&!V.da&&V.capture==f){var be=V.listener,nt=V.ha||V.src;V.fa&&sn(a.i,V),k=be.call(nt,g)!==!1&&k}}return k&&!g.defaultPrevented}function us(a,u,f){if(typeof a=="function")f&&(a=p(a,f));else if(a&&typeof a.handleEvent=="function")a=p(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(a,u||0)}function on(a){a.g=us(()=>{a.g=null,a.i&&(a.i=!1,on(a))},a.l);const u=a.h;a.h=null,a.m.apply(null,u)}class $t extends ie{constructor(u,f){super(),this.m=u,this.l=f,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:on(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ut(a){ie.call(this),this.h=a,this.g={}}I(Ut,ie);var Le=[];function an(a){U(a.g,function(u,f){this.g.hasOwnProperty(f)&&mn(u)},a),a.g={}}Ut.prototype.N=function(){Ut.aa.N.call(this),an(this)},Ut.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Dn=l.JSON.stringify,yn=l.JSON.parse,Bn=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function Ln(){}Ln.prototype.h=null;function pi(a){return a.h||(a.h=a.i())}function Nn(){}var qt={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function On(){F.call(this,"d")}I(On,F);function Qt(){F.call(this,"c")}I(Qt,F);var Fe={},G=null;function Se(){return G=G||new Oe}Fe.La="serverreachability";function ct(a){F.call(this,Fe.La,a)}I(ct,F);function Tt(a){const u=Se();Ue(u,new ct(u))}Fe.STAT_EVENT="statevent";function Jt(a,u){F.call(this,Fe.STAT_EVENT,a),this.stat=u}I(Jt,F);function et(a){const u=Se();Ue(u,new Jt(u,a))}Fe.Ma="timingevent";function So(a,u){F.call(this,Fe.Ma,a),this.size=u}I(So,F);function Vs(a,u){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},u)}function Fn(){this.g=!0}Fn.prototype.xa=function(){this.g=!1};function El(a,u,f,g,k,R){a.info(function(){if(a.g)if(R)for(var V="",be=R.split("&"),nt=0;nt<be.length;nt++){var he=be[nt].split("=");if(1<he.length){var ut=he[0];he=he[1];var ht=ut.split("_");V=2<=ht.length&&ht[1]=="type"?V+(ut+"="+he+"&"):V+(ut+"=redacted&")}}else V=null;else V=R;return"XMLHTTP REQ ("+g+") [attempt "+k+"]: "+u+`
`+f+`
`+V})}function xo(a,u,f,g,k,R,V){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+k+"]: "+u+`
`+f+`
`+R+" "+V})}function Vn(a,u,f,g){a.info(function(){return"XMLHTTP TEXT ("+u+"): "+ko(a,f)+(g?" "+g:"")})}function Ao(a,u){a.info(function(){return"TIMEOUT: "+u})}Fn.prototype.info=function(){};function ko(a,u){if(!a.g)return u;if(!u)return null;try{var f=JSON.parse(u);if(f){for(a=0;a<f.length;a++)if(Array.isArray(f[a])){var g=f[a];if(!(2>g.length)){var k=g[1];if(Array.isArray(k)&&!(1>k.length)){var R=k[0];if(R!="noop"&&R!="stop"&&R!="close")for(var V=1;V<k.length;V++)k[V]=""}}}}return Dn(f)}catch{return u}}var W={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Re={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},je;function qe(){}I(qe,Ln),qe.prototype.g=function(){return new XMLHttpRequest},qe.prototype.i=function(){return{}},je=new qe;function He(a,u,f,g){this.j=a,this.i=u,this.l=f,this.R=g||1,this.U=new Ut(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ue}function ue(){this.i=null,this.g="",this.h=!1}var dt={},tt={};function vn(a,u,f){a.L=1,a.v=Mo(zn(u)),a.m=f,a.P=!0,or(a,null)}function or(a,u){a.F=Date.now(),mi(a),a.A=zn(a.v);var f=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),Ou(f.i,"t",g),a.C=0,f=a.j.J,a.h=new ue,a.g=th(a.j,f?u:null,!a.m),0<a.O&&(a.M=new $t(p(a.Y,a,a.g),a.O)),u=a.U,f=a.g,g=a.ca;var k="readystatechange";Array.isArray(k)||(k&&(Le[0]=k.toString()),k=Le);for(var R=0;R<k.length;R++){var V=pn(f,k[R],g||u.handleEvent,!1,u.h||u);if(!V)break;u.g[V.key]=V}u=a.H?v(a.H):{},a.m?(a.u||(a.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,u)):(a.u="GET",a.g.ea(a.A,a.u,null,u)),Tt(),El(a.i,a.u,a.A,a.l,a.R,a.m)}He.prototype.ca=function(a){a=a.target;const u=this.M;u&&$n(a)==3?u.j():this.Y(a)},He.prototype.Y=function(a){try{if(a==this.g)e:{const ht=$n(this.g);var u=this.g.Ba();const vi=this.g.Z();if(!(3>ht)&&(ht!=3||this.g&&(this.h.h||this.g.oa()||Hu(this.g)))){this.J||ht!=4||u==7||(u==8||0>=vi?Tt(3):Tt(2)),Il(this);var f=this.g.Z();this.X=f;t:if(Dt(this)){var g=Hu(this.g);a="";var k=g.length,R=$n(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){zs(this),ar(this);var V="";break t}this.h.i=new l.TextDecoder}for(u=0;u<k;u++)this.h.h=!0,a+=this.h.i.decode(g[u],{stream:!(R&&u==k-1)});g.length=0,this.h.g+=a,this.C=0,V=this.h.g}else V=this.g.oa();if(this.o=f==200,xo(this.i,this.u,this.A,this.l,this.R,ht,f),this.o){if(this.T&&!this.K){t:{if(this.g){var be,nt=this.g;if((be=nt.g?nt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!C(be)){var he=be;break t}}he=null}if(f=he)Vn(this.i,this.l,f,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Sl(this,f);else{this.o=!1,this.s=3,et(12),zs(this),ar(this);break e}}if(this.P){f=!0;let ln;for(;!this.J&&this.C<V.length;)if(ln=Co(this,V),ln==tt){ht==4&&(this.s=4,et(14),f=!1),Vn(this.i,this.l,null,"[Incomplete Response]");break}else if(ln==dt){this.s=4,et(15),Vn(this.i,this.l,V,"[Invalid Chunk]"),f=!1;break}else Vn(this.i,this.l,ln,null),Sl(this,ln);if(Dt(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ht!=4||V.length!=0||this.h.h||(this.s=1,et(16),f=!1),this.o=this.o&&f,!f)Vn(this.i,this.l,V,"[Invalid Chunked Response]"),zs(this),ar(this);else if(0<V.length&&!this.W){this.W=!0;var ut=this.j;ut.g==this&&ut.ba&&!ut.M&&(ut.j.info("Great, no buffering proxy detected. Bytes received: "+V.length),Pl(ut),ut.M=!0,et(11))}}else Vn(this.i,this.l,V,null),Sl(this,V);ht==4&&zs(this),this.o&&!this.J&&(ht==4?Ju(this.j,this):(this.o=!1,mi(this)))}else lv(this.g),f==400&&0<V.indexOf("Unknown SID")?(this.s=3,et(12)):(this.s=0,et(13)),zs(this),ar(this)}}}catch{}finally{}};function Dt(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Co(a,u){var f=a.C,g=u.indexOf(`
`,f);return g==-1?tt:(f=Number(u.substring(f,g)),isNaN(f)?dt:(g+=1,g+f>u.length?tt:(u=u.slice(g,g+f),a.C=g+f,u)))}He.prototype.cancel=function(){this.J=!0,zs(this)};function mi(a){a.S=Date.now()+a.I,Tl(a,a.I)}function Tl(a,u){if(a.B!=null)throw Error("WatchDog timer not null");a.B=Vs(p(a.ba,a),u)}function Il(a){a.B&&(l.clearTimeout(a.B),a.B=null)}He.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(Ao(this.i,this.A),this.L!=2&&(Tt(),et(17)),zs(this),this.s=2,ar(this)):Tl(this,this.S-a)};function ar(a){a.j.G==0||a.J||Ju(a.j,a)}function zs(a){Il(a);var u=a.M;u&&typeof u.ma=="function"&&u.ma(),a.M=null,an(a.U),a.g&&(u=a.g,a.g=null,u.abort(),u.ma())}function Sl(a,u){try{var f=a.j;if(f.G!=0&&(f.g==a||xl(f.h,a))){if(!a.K&&xl(f.h,a)&&f.G==3){try{var g=f.Da.g.parse(u)}catch{g=null}if(Array.isArray(g)&&g.length==3){var k=g;if(k[0]==0){e:if(!f.u){if(f.g)if(f.g.F+3e3<a.F)Fo(f),No(f);else break e;Rl(f),et(18)}}else f.za=k[1],0<f.za-f.T&&37500>k[2]&&f.F&&f.v==0&&!f.C&&(f.C=Vs(p(f.Za,f),6e3));if(1>=ku(f.h)&&f.ca){try{f.ca()}catch{}f.ca=void 0}}else Us(f,11)}else if((a.K||f.g==a)&&Fo(f),!C(u))for(k=f.Da.g.parse(u),u=0;u<k.length;u++){let he=k[u];if(f.T=he[0],he=he[1],f.G==2)if(he[0]=="c"){f.K=he[1],f.ia=he[2];const ut=he[3];ut!=null&&(f.la=ut,f.j.info("VER="+f.la));const ht=he[4];ht!=null&&(f.Aa=ht,f.j.info("SVER="+f.Aa));const vi=he[5];vi!=null&&typeof vi=="number"&&0<vi&&(g=1.5*vi,f.L=g,f.j.info("backChannelRequestTimeoutMs_="+g)),g=f;const ln=a.g;if(ln){const zo=ln.g?ln.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(zo){var R=g.h;R.g||zo.indexOf("spdy")==-1&&zo.indexOf("quic")==-1&&zo.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(Al(R,R.h),R.h=null))}if(g.D){const Ml=ln.g?ln.g.getResponseHeader("X-HTTP-Session-Id"):null;Ml&&(g.ya=Ml,xe(g.I,g.D,Ml))}}f.G=3,f.l&&f.l.ua(),f.ba&&(f.R=Date.now()-a.F,f.j.info("Handshake RTT: "+f.R+"ms")),g=f;var V=a;if(g.qa=eh(g,g.J?g.ia:null,g.W),V.K){Cu(g.h,V);var be=V,nt=g.L;nt&&(be.I=nt),be.B&&(Il(be),mi(be)),g.g=V}else Ku(g);0<f.i.length&&Oo(f)}else he[0]!="stop"&&he[0]!="close"||Us(f,7);else f.G==3&&(he[0]=="stop"||he[0]=="close"?he[0]=="stop"?Us(f,7):Cl(f):he[0]!="noop"&&f.l&&f.l.ta(he),f.v=0)}}Tt(4)}catch{}}var Gy=class{constructor(a,u){this.g=a,this.map=u}};function xu(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Au(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function ku(a){return a.h?1:a.g?a.g.size:0}function xl(a,u){return a.h?a.h==u:a.g?a.g.has(u):!1}function Al(a,u){a.g?a.g.add(u):a.h=u}function Cu(a,u){a.h&&a.h==u?a.h=null:a.g&&a.g.has(u)&&a.g.delete(u)}xu.prototype.cancel=function(){if(this.i=Ru(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Ru(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let u=a.i;for(const f of a.g.values())u=u.concat(f.D);return u}return S(a.i)}function Yy(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var u=[],f=a.length,g=0;g<f;g++)u.push(a[g]);return u}u=[],f=0;for(g in a)u[f++]=a[g];return u}function jy(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var u=[];a=a.length;for(var f=0;f<a;f++)u.push(f);return u}u=[],f=0;for(const g in a)u[f++]=g;return u}}}function Pu(a,u){if(a.forEach&&typeof a.forEach=="function")a.forEach(u,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,u,void 0);else for(var f=jy(a),g=Yy(a),k=g.length,R=0;R<k;R++)u.call(void 0,g[R],f&&f[R],a)}var Mu=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ky(a,u){if(a){a=a.split("&");for(var f=0;f<a.length;f++){var g=a[f].indexOf("="),k=null;if(0<=g){var R=a[f].substring(0,g);k=a[f].substring(g+1)}else R=a[f];u(R,k?decodeURIComponent(k.replace(/\+/g," ")):"")}}}function $s(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof $s){this.h=a.h,Ro(this,a.j),this.o=a.o,this.g=a.g,Po(this,a.s),this.l=a.l;var u=a.i,f=new dr;f.i=u.i,u.g&&(f.g=new Map(u.g),f.h=u.h),Du(this,f),this.m=a.m}else a&&(u=String(a).match(Mu))?(this.h=!1,Ro(this,u[1]||"",!0),this.o=lr(u[2]||""),this.g=lr(u[3]||"",!0),Po(this,u[4]),this.l=lr(u[5]||"",!0),Du(this,u[6]||"",!0),this.m=lr(u[7]||"")):(this.h=!1,this.i=new dr(null,this.h))}$s.prototype.toString=function(){var a=[],u=this.j;u&&a.push(cr(u,Bu,!0),":");var f=this.g;return(f||u=="file")&&(a.push("//"),(u=this.o)&&a.push(cr(u,Bu,!0),"@"),a.push(encodeURIComponent(String(f)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.s,f!=null&&a.push(":",String(f))),(f=this.l)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(cr(f,f.charAt(0)=="/"?Xy:Jy,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",cr(f,ev)),a.join("")};function zn(a){return new $s(a)}function Ro(a,u,f){a.j=f?lr(u,!0):u,a.j&&(a.j=a.j.replace(/:$/,""))}function Po(a,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);a.s=u}else a.s=null}function Du(a,u,f){u instanceof dr?(a.i=u,tv(a.i,a.h)):(f||(u=cr(u,Zy)),a.i=new dr(u,a.h))}function xe(a,u,f){a.i.set(u,f)}function Mo(a){return xe(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function lr(a,u){return a?u?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function cr(a,u,f){return typeof a=="string"?(a=encodeURI(a).replace(u,Qy),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Qy(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Bu=/[#\/\?@]/g,Jy=/[#\?:]/g,Xy=/[#\?]/g,Zy=/[#\?@]/g,ev=/#/g;function dr(a,u){this.h=this.g=null,this.i=a||null,this.j=!!u}function hs(a){a.g||(a.g=new Map,a.h=0,a.i&&Ky(a.i,function(u,f){a.add(decodeURIComponent(u.replace(/\+/g," ")),f)}))}t=dr.prototype,t.add=function(a,u){hs(this),this.i=null,a=gi(this,a);var f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(u),this.h+=1,this};function Lu(a,u){hs(a),u=gi(a,u),a.g.has(u)&&(a.i=null,a.h-=a.g.get(u).length,a.g.delete(u))}function Nu(a,u){return hs(a),u=gi(a,u),a.g.has(u)}t.forEach=function(a,u){hs(this),this.g.forEach(function(f,g){f.forEach(function(k){a.call(u,k,g,this)},this)},this)},t.na=function(){hs(this);const a=Array.from(this.g.values()),u=Array.from(this.g.keys()),f=[];for(let g=0;g<u.length;g++){const k=a[g];for(let R=0;R<k.length;R++)f.push(u[g])}return f},t.V=function(a){hs(this);let u=[];if(typeof a=="string")Nu(this,a)&&(u=u.concat(this.g.get(gi(this,a))));else{a=Array.from(this.g.values());for(let f=0;f<a.length;f++)u=u.concat(a[f])}return u},t.set=function(a,u){return hs(this),this.i=null,a=gi(this,a),Nu(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[u]),this.h+=1,this},t.get=function(a,u){return a?(a=this.V(a),0<a.length?String(a[0]):u):u};function Ou(a,u,f){Lu(a,u),0<f.length&&(a.i=null,a.g.set(gi(a,u),S(f)),a.h+=f.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],u=Array.from(this.g.keys());for(var f=0;f<u.length;f++){var g=u[f];const R=encodeURIComponent(String(g)),V=this.V(g);for(g=0;g<V.length;g++){var k=R;V[g]!==""&&(k+="="+encodeURIComponent(String(V[g]))),a.push(k)}}return this.i=a.join("&")};function gi(a,u){return u=String(u),a.j&&(u=u.toLowerCase()),u}function tv(a,u){u&&!a.j&&(hs(a),a.i=null,a.g.forEach(function(f,g){var k=g.toLowerCase();g!=k&&(Lu(this,g),Ou(this,k,f))},a)),a.j=u}function nv(a,u){const f=new Fn;if(l.Image){const g=new Image;g.onload=w(fs,f,"TestLoadImage: loaded",!0,u,g),g.onerror=w(fs,f,"TestLoadImage: error",!1,u,g),g.onabort=w(fs,f,"TestLoadImage: abort",!1,u,g),g.ontimeout=w(fs,f,"TestLoadImage: timeout",!1,u,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else u(!1)}function sv(a,u){const f=new Fn,g=new AbortController,k=setTimeout(()=>{g.abort(),fs(f,"TestPingServer: timeout",!1,u)},1e4);fetch(a,{signal:g.signal}).then(R=>{clearTimeout(k),R.ok?fs(f,"TestPingServer: ok",!0,u):fs(f,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(k),fs(f,"TestPingServer: error",!1,u)})}function fs(a,u,f,g,k){try{k&&(k.onload=null,k.onerror=null,k.onabort=null,k.ontimeout=null),g(f)}catch{}}function iv(){this.g=new Bn}function rv(a,u,f){const g=f||"";try{Pu(a,function(k,R){let V=k;d(k)&&(V=Dn(k)),u.push(g+R+"="+encodeURIComponent(V))})}catch(k){throw u.push(g+"type="+encodeURIComponent("_badmap")),k}}function Do(a){this.l=a.Ub||null,this.j=a.eb||!1}I(Do,Ln),Do.prototype.g=function(){return new Bo(this.l,this.j)},Do.prototype.i=function(a){return function(){return a}}({});function Bo(a,u){Oe.call(this),this.D=a,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}I(Bo,Oe),t=Bo.prototype,t.open=function(a,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=u,this.readyState=1,hr(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(u.body=a),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,ur(this)),this.readyState=0},t.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,hr(this)),this.g&&(this.readyState=3,hr(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Fu(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Fu(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}t.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var u=a.value?a.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!a.done}))&&(this.response=this.responseText+=u)}a.done?ur(this):hr(this),this.readyState==3&&Fu(this)}},t.Ra=function(a){this.g&&(this.response=this.responseText=a,ur(this))},t.Qa=function(a){this.g&&(this.response=a,ur(this))},t.ga=function(){this.g&&ur(this)};function ur(a){a.readyState=4,a.l=null,a.j=null,a.v=null,hr(a)}t.setRequestHeader=function(a,u){this.u.append(a,u)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],u=this.h.entries();for(var f=u.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=u.next();return a.join(`\r
`)};function hr(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Bo.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Vu(a){let u="";return U(a,function(f,g){u+=g,u+=":",u+=f,u+=`\r
`}),u}function kl(a,u,f){e:{for(g in f){var g=!1;break e}g=!0}g||(f=Vu(f),typeof a=="string"?f!=null&&encodeURIComponent(String(f)):xe(a,u,f))}function Ne(a){Oe.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}I(Ne,Oe);var ov=/^https?$/i,av=["POST","PUT"];t=Ne.prototype,t.Ha=function(a){this.J=a},t.ea=function(a,u,f,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);u=u?u.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():je.g(),this.v=this.o?pi(this.o):pi(je),this.g.onreadystatechange=p(this.Ea,this);try{this.B=!0,this.g.open(u,String(a),!0),this.B=!1}catch(R){zu(this,R);return}if(a=f||"",f=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var k in g)f.set(k,g[k]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const R of g.keys())f.set(R,g.get(R));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(f.keys()).find(R=>R.toLowerCase()=="content-type"),k=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(av,u,void 0))||g||k||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,V]of f)this.g.setRequestHeader(R,V);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{qu(this),this.u=!0,this.g.send(a),this.u=!1}catch(R){zu(this,R)}};function zu(a,u){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=u,a.m=5,$u(a),Lo(a)}function $u(a){a.A||(a.A=!0,Ue(a,"complete"),Ue(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,Ue(this,"complete"),Ue(this,"abort"),Lo(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Lo(this,!0)),Ne.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?Uu(this):this.bb())},t.bb=function(){Uu(this)};function Uu(a){if(a.h&&typeof o<"u"&&(!a.v[1]||$n(a)!=4||a.Z()!=2)){if(a.u&&$n(a)==4)us(a.Ea,0,a);else if(Ue(a,"readystatechange"),$n(a)==4){a.h=!1;try{const V=a.Z();e:switch(V){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var f;if(!(f=u)){var g;if(g=V===0){var k=String(a.D).match(Mu)[1]||null;!k&&l.self&&l.self.location&&(k=l.self.location.protocol.slice(0,-1)),g=!ov.test(k?k.toLowerCase():"")}f=g}if(f)Ue(a,"complete"),Ue(a,"success");else{a.m=6;try{var R=2<$n(a)?a.g.statusText:""}catch{R=""}a.l=R+" ["+a.Z()+"]",$u(a)}}finally{Lo(a)}}}}function Lo(a,u){if(a.g){qu(a);const f=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,u||Ue(a,"ready");try{f.onreadystatechange=g}catch{}}}function qu(a){a.I&&(l.clearTimeout(a.I),a.I=null)}t.isActive=function(){return!!this.g};function $n(a){return a.g?a.g.readyState:0}t.Z=function(){try{return 2<$n(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(a){if(this.g){var u=this.g.responseText;return a&&u.indexOf(a)==0&&(u=u.substring(a.length)),yn(u)}};function Hu(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function lv(a){const u={};a=(a.g&&2<=$n(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(C(a[g]))continue;var f=E(a[g]);const k=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const R=u[k]||[];u[k]=R,R.push(f)}T(u,function(g){return g.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function fr(a,u,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||u}function Wu(a){this.Aa=0,this.i=[],this.j=new Fn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=fr("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=fr("baseRetryDelayMs",5e3,a),this.cb=fr("retryDelaySeedMs",1e4,a),this.Wa=fr("forwardChannelMaxRetries",2,a),this.wa=fr("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new xu(a&&a.concurrentRequestLimit),this.Da=new iv,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=Wu.prototype,t.la=8,t.G=1,t.connect=function(a,u,f,g){et(0),this.W=a,this.H=u||{},f&&g!==void 0&&(this.H.OSID=f,this.H.OAID=g),this.F=this.X,this.I=eh(this,null,this.W),Oo(this)};function Cl(a){if(Gu(a),a.G==3){var u=a.U++,f=zn(a.I);if(xe(f,"SID",a.K),xe(f,"RID",u),xe(f,"TYPE","terminate"),pr(a,f),u=new He(a,a.j,u),u.L=2,u.v=Mo(zn(f)),f=!1,l.navigator&&l.navigator.sendBeacon)try{f=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!f&&l.Image&&(new Image().src=u.v,f=!0),f||(u.g=th(u.j,null),u.g.ea(u.v)),u.F=Date.now(),mi(u)}Zu(a)}function No(a){a.g&&(Pl(a),a.g.cancel(),a.g=null)}function Gu(a){No(a),a.u&&(l.clearTimeout(a.u),a.u=null),Fo(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Oo(a){if(!Au(a.h)&&!a.s){a.s=!0;var u=a.Ga;ne||ve(),se||(ne(),se=!0),oe.add(u,a),a.B=0}}function cv(a,u){return ku(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=u.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=Vs(p(a.Ga,a,u),Xu(a,a.B)),a.B++,!0)}t.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const k=new He(this,this.j,a);let R=this.o;if(this.S&&(R?(R=v(R),b(R,this.S)):R=this.S),this.m!==null||this.O||(k.H=R,R=null),this.P)e:{for(var u=0,f=0;f<this.i.length;f++){t:{var g=this.i[f];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(u+=g,4096<u){u=f;break e}if(u===4096||f===this.i.length-1){u=f+1;break e}}u=1e3}else u=1e3;u=ju(this,k,u),f=zn(this.I),xe(f,"RID",a),xe(f,"CVER",22),this.D&&xe(f,"X-HTTP-Session-Id",this.D),pr(this,f),R&&(this.O?u="headers="+encodeURIComponent(String(Vu(R)))+"&"+u:this.m&&kl(f,this.m,R)),Al(this.h,k),this.Ua&&xe(f,"TYPE","init"),this.P?(xe(f,"$req",u),xe(f,"SID","null"),k.T=!0,vn(k,f,null)):vn(k,f,u),this.G=2}}else this.G==3&&(a?Yu(this,a):this.i.length==0||Au(this.h)||Yu(this))};function Yu(a,u){var f;u?f=u.l:f=a.U++;const g=zn(a.I);xe(g,"SID",a.K),xe(g,"RID",f),xe(g,"AID",a.T),pr(a,g),a.m&&a.o&&kl(g,a.m,a.o),f=new He(a,a.j,f,a.B+1),a.m===null&&(f.H=a.o),u&&(a.i=u.D.concat(a.i)),u=ju(a,f,1e3),f.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),Al(a.h,f),vn(f,g,u)}function pr(a,u){a.H&&U(a.H,function(f,g){xe(u,g,f)}),a.l&&Pu({},function(f,g){xe(u,g,f)})}function ju(a,u,f){f=Math.min(a.i.length,f);var g=a.l?p(a.l.Na,a.l,a):null;e:{var k=a.i;let R=-1;for(;;){const V=["count="+f];R==-1?0<f?(R=k[0].g,V.push("ofs="+R)):R=0:V.push("ofs="+R);let be=!0;for(let nt=0;nt<f;nt++){let he=k[nt].g;const ut=k[nt].map;if(he-=R,0>he)R=Math.max(0,k[nt].g-100),be=!1;else try{rv(ut,V,"req"+he+"_")}catch{g&&g(ut)}}if(be){g=V.join("&");break e}}}return a=a.i.splice(0,f),u.D=a,g}function Ku(a){if(!a.g&&!a.u){a.Y=1;var u=a.Fa;ne||ve(),se||(ne(),se=!0),oe.add(u,a),a.v=0}}function Rl(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=Vs(p(a.Fa,a),Xu(a,a.v)),a.v++,!0)}t.Fa=function(){if(this.u=null,Qu(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=Vs(p(this.ab,this),a)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,et(10),No(this),Qu(this))};function Pl(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Qu(a){a.g=new He(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var u=zn(a.qa);xe(u,"RID","rpc"),xe(u,"SID",a.K),xe(u,"AID",a.T),xe(u,"CI",a.F?"0":"1"),!a.F&&a.ja&&xe(u,"TO",a.ja),xe(u,"TYPE","xmlhttp"),pr(a,u),a.m&&a.o&&kl(u,a.m,a.o),a.L&&(a.g.I=a.L);var f=a.g;a=a.ia,f.L=1,f.v=Mo(zn(u)),f.m=null,f.P=!0,or(f,a)}t.Za=function(){this.C!=null&&(this.C=null,No(this),Rl(this),et(19))};function Fo(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function Ju(a,u){var f=null;if(a.g==u){Fo(a),Pl(a),a.g=null;var g=2}else if(xl(a.h,u))f=u.D,Cu(a.h,u),g=1;else return;if(a.G!=0){if(u.o)if(g==1){f=u.m?u.m.length:0,u=Date.now()-u.F;var k=a.B;g=Se(),Ue(g,new So(g,f)),Oo(a)}else Ku(a);else if(k=u.s,k==3||k==0&&0<u.X||!(g==1&&cv(a,u)||g==2&&Rl(a)))switch(f&&0<f.length&&(u=a.h,u.i=u.i.concat(f)),k){case 1:Us(a,5);break;case 4:Us(a,10);break;case 3:Us(a,6);break;default:Us(a,2)}}}function Xu(a,u){let f=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(f*=2),f*u}function Us(a,u){if(a.j.info("Error code "+u),u==2){var f=p(a.fb,a),g=a.Xa;const k=!g;g=new $s(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Ro(g,"https"),Mo(g),k?nv(g.toString(),f):sv(g.toString(),f)}else et(2);a.G=0,a.l&&a.l.sa(u),Zu(a),Gu(a)}t.fb=function(a){a?(this.j.info("Successfully pinged google.com"),et(2)):(this.j.info("Failed to ping google.com"),et(1))};function Zu(a){if(a.G=0,a.ka=[],a.l){const u=Ru(a.h);(u.length!=0||a.i.length!=0)&&(A(a.ka,u),A(a.ka,a.i),a.h.i.length=0,S(a.i),a.i.length=0),a.l.ra()}}function eh(a,u,f){var g=f instanceof $s?zn(f):new $s(f);if(g.g!="")u&&(g.g=u+"."+g.g),Po(g,g.s);else{var k=l.location;g=k.protocol,u=u?u+"."+k.hostname:k.hostname,k=+k.port;var R=new $s(null);g&&Ro(R,g),u&&(R.g=u),k&&Po(R,k),f&&(R.l=f),g=R}return f=a.D,u=a.ya,f&&u&&xe(g,f,u),xe(g,"VER",a.la),pr(a,g),g}function th(a,u,f){if(u&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=a.Ca&&!a.pa?new Ne(new Do({eb:f})):new Ne(a.pa),u.Ha(a.J),u}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function nh(){}t=nh.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function Vo(){}Vo.prototype.g=function(a,u){return new Ht(a,u)};function Ht(a,u){Oe.call(this),this.g=new Wu(u),this.l=a,this.h=u&&u.messageUrlParams||null,a=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(a?a["X-WebChannel-Content-Type"]=u.messageContentType:a={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(a?a["X-WebChannel-Client-Profile"]=u.va:a={"X-WebChannel-Client-Profile":u.va}),this.g.S=a,(a=u&&u.Sb)&&!C(a)&&(this.g.m=a),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!C(u)&&(this.g.D=u,a=this.h,a!==null&&u in a&&(a=this.h,u in a&&delete a[u])),this.j=new yi(this)}I(Ht,Oe),Ht.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Ht.prototype.close=function(){Cl(this.g)},Ht.prototype.o=function(a){var u=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.u&&(f={},f.__data__=Dn(a),a=f);u.i.push(new Gy(u.Ya++,a)),u.G==3&&Oo(u)},Ht.prototype.N=function(){this.g.l=null,delete this.j,Cl(this.g),delete this.g,Ht.aa.N.call(this)};function sh(a){On.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var u=a.__sm__;if(u){e:{for(const f in u){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,u=u!==null&&a in u?u[a]:void 0),this.data=u}else this.data=a}I(sh,On);function ih(){Qt.call(this),this.status=1}I(ih,Qt);function yi(a){this.g=a}I(yi,nh),yi.prototype.ua=function(){Ue(this.g,"a")},yi.prototype.ta=function(a){Ue(this.g,new sh(a))},yi.prototype.sa=function(a){Ue(this.g,new ih)},yi.prototype.ra=function(){Ue(this.g,"b")},Vo.prototype.createWebChannel=Vo.prototype.g,Ht.prototype.send=Ht.prototype.o,Ht.prototype.open=Ht.prototype.m,Ht.prototype.close=Ht.prototype.close,Kp=function(){return new Vo},jp=function(){return Se()},Yp=Fe,sc={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},W.NO_ERROR=0,W.TIMEOUT=8,W.HTTP_ERROR=6,Xo=W,Re.COMPLETE="complete",Gp=Re,Nn.EventType=qt,qt.OPEN="a",qt.CLOSE="b",qt.ERROR="c",qt.MESSAGE="d",Oe.prototype.listen=Oe.prototype.K,br=Nn,Ne.prototype.listenOnce=Ne.prototype.L,Ne.prototype.getLastError=Ne.prototype.Ka,Ne.prototype.getLastErrorCode=Ne.prototype.Ba,Ne.prototype.getStatus=Ne.prototype.Z,Ne.prototype.getResponseJson=Ne.prototype.Oa,Ne.prototype.getResponseText=Ne.prototype.oa,Ne.prototype.send=Ne.prototype.ea,Ne.prototype.setWithCredentials=Ne.prototype.Ha,Wp=Ne}).apply(typeof qo<"u"?qo:typeof self<"u"?self:typeof window<"u"?window:{});const Fh="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}pt.UNAUTHENTICATED=new pt(null),pt.GOOGLE_CREDENTIALS=new pt("google-credentials-uid"),pt.FIRST_PARTY=new pt("first-party-uid"),pt.MOCK_USER=new pt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ji="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ni=new Vc("@firebase/firestore");function mr(){return ni.logLevel}function H(t,...e){if(ni.logLevel<=le.DEBUG){const n=e.map(Zc);ni.debug(`Firestore (${ji}): ${t}`,...n)}}function es(t,...e){if(ni.logLevel<=le.ERROR){const n=e.map(Zc);ni.error(`Firestore (${ji}): ${t}`,...n)}}function Li(t,...e){if(ni.logLevel<=le.WARN){const n=e.map(Zc);ni.warn(`Firestore (${ji}): ${t}`,...n)}}function Zc(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function Q(t="Unexpected state"){const e=`FIRESTORE (${ji}) INTERNAL ASSERTION FAILED: `+t;throw es(e),new Error(e)}function ye(t,e){t||Q()}function ee(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class $ extends os{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Qp{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class m_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(pt.UNAUTHENTICATED))}shutdown(){}}class g_{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class y_{constructor(e){this.t=e,this.currentUser=pt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){ye(this.o===void 0);let s=this.i;const i=c=>this.i!==s?(s=this.i,n(c)):Promise.resolve();let r=new Kn;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new Kn,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const c=r;e.enqueueRetryable(async()=>{await c.promise,await i(this.currentUser)})},l=c=>{H("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(H("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new Kn)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(s=>this.i!==e?(H("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(ye(typeof s.accessToken=="string"),new Qp(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ye(e===null||typeof e=="string"),new pt(e)}}class v_{constructor(e,n,s){this.l=e,this.h=n,this.P=s,this.type="FirstParty",this.user=pt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class b_{constructor(e,n,s){this.l=e,this.h=n,this.P=s}getToken(){return Promise.resolve(new v_(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(pt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class w_{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class __{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){ye(this.o===void 0);const s=r=>{r.error!=null&&H("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const o=r.token!==this.R;return this.R=r.token,H("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(r.token):Promise.resolve()};this.o=r=>{e.enqueueRetryable(()=>s(r))};const i=r=>{H("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(r=>i(r)),setTimeout(()=>{if(!this.appCheck){const r=this.A.getImmediate({optional:!0});r?i(r):H("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(ye(typeof n.token=="string"),this.R=n.token,new w_(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function E_(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let s=0;s<t;s++)n[s]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jp{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const i=E_(40);for(let r=0;r<i.length;++r)s.length<20&&i[r]<n&&(s+=e.charAt(i[r]%e.length))}return s}}function fe(t,e){return t<e?-1:t>e?1:0}function Ni(t,e,n){return t.length===e.length&&t.every((s,i)=>n(s,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new $(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new $(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new $(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new $(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Ke.fromMillis(Date.now())}static fromDate(e){return Ke.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*n));return new Ke(n,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?fe(this.nanoseconds,e.nanoseconds):fe(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Or{constructor(e,n,s){n===void 0?n=0:n>e.length&&Q(),s===void 0?s=e.length-n:s>e.length-n&&Q(),this.segments=e,this.offset=n,this.len=s}get length(){return this.len}isEqual(e){return Or.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof Or?e.forEach(s=>{n.push(s)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,s=this.limit();n<s;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const s=Math.min(e.length,n.length);for(let i=0;i<s;i++){const r=e.get(i),o=n.get(i);if(r<o)return-1;if(r>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class Ae extends Or{construct(e,n,s){return new Ae(e,n,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const s of e){if(s.indexOf("//")>=0)throw new $(M.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);n.push(...s.split("/").filter(i=>i.length>0))}return new Ae(n)}static emptyPath(){return new Ae([])}}const T_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class it extends Or{construct(e,n,s){return new it(e,n,s)}static isValidIdentifier(e){return T_.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),it.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new it(["__name__"])}static fromServerFormat(e){const n=[];let s="",i=0;const r=()=>{if(s.length===0)throw new $(M.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(s),s=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new $(M.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[i+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new $(M.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=c,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(s+=l,i++):(r(),i++)}if(r(),o)throw new $(M.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new it(n)}static emptyPath(){return new it([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y{constructor(e){this.path=e}static fromPath(e){return new Y(Ae.fromString(e))}static fromName(e){return new Y(Ae.fromString(e).popFirst(5))}static empty(){return new Y(Ae.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Ae.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return Ae.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Y(new Ae(e.slice()))}}function I_(t,e){const n=t.toTimestamp().seconds,s=t.toTimestamp().nanoseconds+1,i=Z.fromTimestamp(s===1e9?new Ke(n+1,0):new Ke(n,s));return new ks(i,Y.empty(),e)}function S_(t){return new ks(t.readTime,t.key,-1)}class ks{constructor(e,n,s){this.readTime=e,this.documentKey=n,this.largestBatchId=s}static min(){return new ks(Z.min(),Y.empty(),-1)}static max(){return new ks(Z.max(),Y.empty(),-1)}}function x_(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=Y.comparator(t.documentKey,e.documentKey),n!==0?n:fe(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const A_="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class k_{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lo(t){if(t.code!==M.FAILED_PRECONDITION||t.message!==A_)throw t;H("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&Q(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new N((s,i)=>{this.nextCallback=r=>{this.wrapSuccess(e,r).next(s,i)},this.catchCallback=r=>{this.wrapFailure(n,r).next(s,i)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof N?n:N.resolve(n)}catch(n){return N.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):N.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):N.reject(n)}static resolve(e){return new N((n,s)=>{n(e)})}static reject(e){return new N((n,s)=>{s(e)})}static waitFor(e){return new N((n,s)=>{let i=0,r=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++r,o&&r===i&&n()},c=>s(c))}),o=!0,r===i&&n()})}static or(e){let n=N.resolve(!1);for(const s of e)n=n.next(i=>i?N.resolve(i):s());return n}static forEach(e,n){const s=[];return e.forEach((i,r)=>{s.push(n.call(this,i,r))}),this.waitFor(s)}static mapArray(e,n){return new N((s,i)=>{const r=e.length,o=new Array(r);let l=0;for(let c=0;c<r;c++){const d=c;n(e[d]).next(h=>{o[d]=h,++l,l===r&&s(o)},h=>i(h))}})}static doWhile(e,n){return new N((s,i)=>{const r=()=>{e()===!0?n().next(()=>{r()},i):s()};r()})}}function C_(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function co(t){return t.name==="IndexedDbTransactionError"}/**
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
 */class ed{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=s=>this.ie(s),this.se=s=>n.writeSequenceNumber(s))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}ed.oe=-1;function za(t){return t==null}function ba(t){return t===0&&1/t==-1/0}function R_(t){return typeof t=="number"&&Number.isInteger(t)&&!ba(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vh(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function di(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function Xp(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{constructor(e,n){this.comparator=e,this.root=n||st.EMPTY}insert(e,n){return new Me(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,st.BLACK,null,null))}remove(e){return new Me(this.comparator,this.root.remove(e,this.comparator).copy(null,null,st.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return n.value;s<0?n=n.left:s>0&&(n=n.right)}return null}indexOf(e){let n=0,s=this.root;for(;!s.isEmpty();){const i=this.comparator(e,s.key);if(i===0)return n+s.left.size;i<0?s=s.left:(n+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,s)=>(e(n,s),!1))}toString(){const e=[];return this.inorderTraversal((n,s)=>(e.push(`${n}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ho(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ho(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ho(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ho(this.root,e,this.comparator,!0)}}class Ho{constructor(e,n,s,i){this.isReverse=i,this.nodeStack=[];let r=1;for(;!e.isEmpty();)if(r=n?s(e.key,n):1,n&&i&&(r*=-1),r<0)e=this.isReverse?e.left:e.right;else{if(r===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class st{constructor(e,n,s,i,r){this.key=e,this.value=n,this.color=s??st.RED,this.left=i??st.EMPTY,this.right=r??st.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,s,i,r){return new st(e??this.key,n??this.value,s??this.color,i??this.left,r??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,s){let i=this;const r=s(e,i.key);return i=r<0?i.copy(null,null,null,i.left.insert(e,n,s),null):r===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,s)),i.fixUp()}removeMin(){if(this.left.isEmpty())return st.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let s,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return st.EMPTY;s=i.right.min(),i=i.copy(s.key,s.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,st.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,st.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Q();const e=this.left.check();if(e!==this.right.check())throw Q();return e+(this.isRed()?0:1)}}st.EMPTY=null,st.RED=!0,st.BLACK=!1;st.EMPTY=new class{constructor(){this.size=0}get key(){throw Q()}get value(){throw Q()}get color(){throw Q()}get left(){throw Q()}get right(){throw Q()}copy(e,n,s,i,r){return this}insert(e,n,s){return new st(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e){this.comparator=e,this.data=new Me(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,s)=>(e(n),!1))}forEachInRange(e,n){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const i=s.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let s;for(s=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new zh(this.data.getIterator())}getIteratorFrom(e){return new zh(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(s=>{n=n.add(s)}),n}isEqual(e){if(!(e instanceof rt)||this.size!==e.size)return!1;const n=this.data.getIterator(),s=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,r=s.getNext().key;if(this.comparator(i,r)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new rt(this.comparator);return n.data=e,n}}class zh{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt{constructor(e){this.fields=e,e.sort(it.comparator)}static empty(){return new Gt([])}unionWith(e){let n=new rt(it.comparator);for(const s of this.fields)n=n.add(s);for(const s of e)n=n.add(s);return new Gt(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Ni(this.fields,e.fields,(n,s)=>n.isEqual(s))}}/**
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
 */class Zp extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(r){throw typeof DOMException<"u"&&r instanceof DOMException?new Zp("Invalid base64 string: "+r):r}}(e);return new at(n)}static fromUint8Array(e){const n=function(i){let r="";for(let o=0;o<i.length;++o)r+=String.fromCharCode(i[o]);return r}(e);return new at(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const s=new Uint8Array(n.length);for(let i=0;i<n.length;i++)s[i]=n.charCodeAt(i);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return fe(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}at.EMPTY_BYTE_STRING=new at("");const P_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Cs(t){if(ye(!!t),typeof t=="string"){let e=0;const n=P_.exec(t);if(ye(!!n),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const s=new Date(t);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:Ve(t.seconds),nanos:Ve(t.nanos)}}function Ve(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function si(t){return typeof t=="string"?at.fromBase64String(t):at.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function td(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function nd(t){const e=t.mapValue.fields.__previous_value__;return td(e)?nd(e):e}function Fr(t){const e=Cs(t.mapValue.fields.__local_write_time__.timestampValue);return new Ke(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M_{constructor(e,n,s,i,r,o,l,c,d){this.databaseId=e,this.appId=n,this.persistenceKey=s,this.host=i,this.ssl=r,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class Vr{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new Vr("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Vr&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wo={mapValue:{}};function ii(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?td(t)?4:B_(t)?9007199254740991:D_(t)?10:11:Q()}function Sn(t,e){if(t===e)return!0;const n=ii(t);if(n!==ii(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Fr(t).isEqual(Fr(e));case 3:return function(i,r){if(typeof i.timestampValue=="string"&&typeof r.timestampValue=="string"&&i.timestampValue.length===r.timestampValue.length)return i.timestampValue===r.timestampValue;const o=Cs(i.timestampValue),l=Cs(r.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,r){return si(i.bytesValue).isEqual(si(r.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,r){return Ve(i.geoPointValue.latitude)===Ve(r.geoPointValue.latitude)&&Ve(i.geoPointValue.longitude)===Ve(r.geoPointValue.longitude)}(t,e);case 2:return function(i,r){if("integerValue"in i&&"integerValue"in r)return Ve(i.integerValue)===Ve(r.integerValue);if("doubleValue"in i&&"doubleValue"in r){const o=Ve(i.doubleValue),l=Ve(r.doubleValue);return o===l?ba(o)===ba(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return Ni(t.arrayValue.values||[],e.arrayValue.values||[],Sn);case 10:case 11:return function(i,r){const o=i.mapValue.fields||{},l=r.mapValue.fields||{};if(Vh(o)!==Vh(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!Sn(o[c],l[c])))return!1;return!0}(t,e);default:return Q()}}function zr(t,e){return(t.values||[]).find(n=>Sn(n,e))!==void 0}function Oi(t,e){if(t===e)return 0;const n=ii(t),s=ii(e);if(n!==s)return fe(n,s);switch(n){case 0:case 9007199254740991:return 0;case 1:return fe(t.booleanValue,e.booleanValue);case 2:return function(r,o){const l=Ve(r.integerValue||r.doubleValue),c=Ve(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(t,e);case 3:return $h(t.timestampValue,e.timestampValue);case 4:return $h(Fr(t),Fr(e));case 5:return fe(t.stringValue,e.stringValue);case 6:return function(r,o){const l=si(r),c=si(o);return l.compareTo(c)}(t.bytesValue,e.bytesValue);case 7:return function(r,o){const l=r.split("/"),c=o.split("/");for(let d=0;d<l.length&&d<c.length;d++){const h=fe(l[d],c[d]);if(h!==0)return h}return fe(l.length,c.length)}(t.referenceValue,e.referenceValue);case 8:return function(r,o){const l=fe(Ve(r.latitude),Ve(o.latitude));return l!==0?l:fe(Ve(r.longitude),Ve(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Uh(t.arrayValue,e.arrayValue);case 10:return function(r,o){var l,c,d,h;const m=r.fields||{},p=o.fields||{},w=(l=m.value)===null||l===void 0?void 0:l.arrayValue,I=(c=p.value)===null||c===void 0?void 0:c.arrayValue,S=fe(((d=w==null?void 0:w.values)===null||d===void 0?void 0:d.length)||0,((h=I==null?void 0:I.values)===null||h===void 0?void 0:h.length)||0);return S!==0?S:Uh(w,I)}(t.mapValue,e.mapValue);case 11:return function(r,o){if(r===Wo.mapValue&&o===Wo.mapValue)return 0;if(r===Wo.mapValue)return 1;if(o===Wo.mapValue)return-1;const l=r.fields||{},c=Object.keys(l),d=o.fields||{},h=Object.keys(d);c.sort(),h.sort();for(let m=0;m<c.length&&m<h.length;++m){const p=fe(c[m],h[m]);if(p!==0)return p;const w=Oi(l[c[m]],d[h[m]]);if(w!==0)return w}return fe(c.length,h.length)}(t.mapValue,e.mapValue);default:throw Q()}}function $h(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return fe(t,e);const n=Cs(t),s=Cs(e),i=fe(n.seconds,s.seconds);return i!==0?i:fe(n.nanos,s.nanos)}function Uh(t,e){const n=t.values||[],s=e.values||[];for(let i=0;i<n.length&&i<s.length;++i){const r=Oi(n[i],s[i]);if(r)return r}return fe(n.length,s.length)}function Fi(t){return ic(t)}function ic(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const s=Cs(n);return`time(${s.seconds},${s.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return si(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return Y.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let s="[",i=!0;for(const r of n.values||[])i?i=!1:s+=",",s+=ic(r);return s+"]"}(t.arrayValue):"mapValue"in t?function(n){const s=Object.keys(n.fields||{}).sort();let i="{",r=!0;for(const o of s)r?r=!1:i+=",",i+=`${o}:${ic(n.fields[o])}`;return i+"}"}(t.mapValue):Q()}function qh(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function rc(t){return!!t&&"integerValue"in t}function sd(t){return!!t&&"arrayValue"in t}function Hh(t){return!!t&&"nullValue"in t}function Wh(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Zo(t){return!!t&&"mapValue"in t}function D_(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function Ar(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return di(t.mapValue.fields,(n,s)=>e.mapValue.fields[n]=Ar(s)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Ar(t.arrayValue.values[n]);return e}return Object.assign({},t)}function B_(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(e){this.value=e}static empty(){return new Bt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let s=0;s<e.length-1;++s)if(n=(n.mapValue.fields||{})[e.get(s)],!Zo(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ar(n)}setAll(e){let n=it.emptyPath(),s={},i=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const c=this.getFieldsMap(n);this.applyChanges(c,s,i),s={},i=[],n=l.popLast()}o?s[l.lastSegment()]=Ar(o):i.push(l.lastSegment())});const r=this.getFieldsMap(n);this.applyChanges(r,s,i)}delete(e){const n=this.field(e.popLast());Zo(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Sn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let s=0;s<e.length;++s){let i=n.mapValue.fields[e.get(s)];Zo(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(s)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,s){di(n,(i,r)=>e[i]=r);for(const i of s)delete e[i]}clone(){return new Bt(Ar(this.value))}}function em(t){const e=[];return di(t.fields,(n,s)=>{const i=new it([n]);if(Zo(s)){const r=em(s.mapValue).fields;if(r.length===0)e.push(i);else for(const o of r)e.push(i.child(o))}else e.push(i)}),new Gt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(e,n,s,i,r,o,l){this.key=e,this.documentType=n,this.version=s,this.readTime=i,this.createTime=r,this.data=o,this.documentState=l}static newInvalidDocument(e){return new mt(e,0,Z.min(),Z.min(),Z.min(),Bt.empty(),0)}static newFoundDocument(e,n,s,i){return new mt(e,1,n,Z.min(),s,i,0)}static newNoDocument(e,n){return new mt(e,2,n,Z.min(),Z.min(),Bt.empty(),0)}static newUnknownDocument(e,n){return new mt(e,3,n,Z.min(),Z.min(),Bt.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(Z.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Bt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Bt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Z.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof mt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new mt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class wa{constructor(e,n){this.position=e,this.inclusive=n}}function Gh(t,e,n){let s=0;for(let i=0;i<t.position.length;i++){const r=e[i],o=t.position[i];if(r.field.isKeyField()?s=Y.comparator(Y.fromName(o.referenceValue),n.key):s=Oi(o,n.data.field(r.field)),r.dir==="desc"&&(s*=-1),s!==0)break}return s}function Yh(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!Sn(t.position[n],e.position[n]))return!1;return!0}/**
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
 */class $r{constructor(e,n="asc"){this.field=e,this.dir=n}}function L_(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
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
 */class tm{}class Ge extends tm{constructor(e,n,s){super(),this.field=e,this.op=n,this.value=s}static create(e,n,s){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,s):new O_(e,n,s):n==="array-contains"?new z_(e,s):n==="in"?new $_(e,s):n==="not-in"?new U_(e,s):n==="array-contains-any"?new q_(e,s):new Ge(e,n,s)}static createKeyFieldInFilter(e,n,s){return n==="in"?new F_(e,s):new V_(e,s)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Oi(n,this.value)):n!==null&&ii(this.value)===ii(n)&&this.matchesComparison(Oi(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Q()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class fn extends tm{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new fn(e,n)}matches(e){return nm(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function nm(t){return t.op==="and"}function sm(t){return N_(t)&&nm(t)}function N_(t){for(const e of t.filters)if(e instanceof fn)return!1;return!0}function oc(t){if(t instanceof Ge)return t.field.canonicalString()+t.op.toString()+Fi(t.value);if(sm(t))return t.filters.map(e=>oc(e)).join(",");{const e=t.filters.map(n=>oc(n)).join(",");return`${t.op}(${e})`}}function im(t,e){return t instanceof Ge?function(s,i){return i instanceof Ge&&s.op===i.op&&s.field.isEqual(i.field)&&Sn(s.value,i.value)}(t,e):t instanceof fn?function(s,i){return i instanceof fn&&s.op===i.op&&s.filters.length===i.filters.length?s.filters.reduce((r,o,l)=>r&&im(o,i.filters[l]),!0):!1}(t,e):void Q()}function rm(t){return t instanceof Ge?function(n){return`${n.field.canonicalString()} ${n.op} ${Fi(n.value)}`}(t):t instanceof fn?function(n){return n.op.toString()+" {"+n.getFilters().map(rm).join(" ,")+"}"}(t):"Filter"}class O_ extends Ge{constructor(e,n,s){super(e,n,s),this.key=Y.fromName(s.referenceValue)}matches(e){const n=Y.comparator(e.key,this.key);return this.matchesComparison(n)}}class F_ extends Ge{constructor(e,n){super(e,"in",n),this.keys=om("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class V_ extends Ge{constructor(e,n){super(e,"not-in",n),this.keys=om("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function om(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(s=>Y.fromName(s.referenceValue))}class z_ extends Ge{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return sd(n)&&zr(n.arrayValue,this.value)}}class $_ extends Ge{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&zr(this.value.arrayValue,n)}}class U_ extends Ge{constructor(e,n){super(e,"not-in",n)}matches(e){if(zr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!zr(this.value.arrayValue,n)}}class q_ extends Ge{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!sd(n)||!n.arrayValue.values)&&n.arrayValue.values.some(s=>zr(this.value.arrayValue,s))}}/**
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
 */class H_{constructor(e,n=null,s=[],i=[],r=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=s,this.filters=i,this.limit=r,this.startAt=o,this.endAt=l,this.ue=null}}function jh(t,e=null,n=[],s=[],i=null,r=null,o=null){return new H_(t,e,n,s,i,r,o)}function id(t){const e=ee(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(s=>oc(s)).join(","),n+="|ob:",n+=e.orderBy.map(s=>function(r){return r.field.canonicalString()+r.dir}(s)).join(","),za(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(s=>Fi(s)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(s=>Fi(s)).join(",")),e.ue=n}return e.ue}function rd(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!L_(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!im(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!Yh(t.startAt,e.startAt)&&Yh(t.endAt,e.endAt)}function ac(t){return Y.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki{constructor(e,n=null,s=[],i=[],r=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=s,this.filters=i,this.limit=r,this.limitType=o,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function W_(t,e,n,s,i,r,o,l){return new Ki(t,e,n,s,i,r,o,l)}function od(t){return new Ki(t)}function Kh(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function am(t){return t.collectionGroup!==null}function kr(t){const e=ee(t);if(e.ce===null){e.ce=[];const n=new Set;for(const r of e.explicitOrderBy)e.ce.push(r),n.add(r.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new rt(it.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(e).forEach(r=>{n.has(r.canonicalString())||r.isKeyField()||e.ce.push(new $r(r,s))}),n.has(it.keyField().canonicalString())||e.ce.push(new $r(it.keyField(),s))}return e.ce}function Tn(t){const e=ee(t);return e.le||(e.le=G_(e,kr(t))),e.le}function G_(t,e){if(t.limitType==="F")return jh(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{const r=i.dir==="desc"?"asc":"desc";return new $r(i.field,r)});const n=t.endAt?new wa(t.endAt.position,t.endAt.inclusive):null,s=t.startAt?new wa(t.startAt.position,t.startAt.inclusive):null;return jh(t.path,t.collectionGroup,e,t.filters,t.limit,n,s)}}function lc(t,e){const n=t.filters.concat([e]);return new Ki(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function _a(t,e,n){return new Ki(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function $a(t,e){return rd(Tn(t),Tn(e))&&t.limitType===e.limitType}function lm(t){return`${id(Tn(t))}|lt:${t.limitType}`}function _i(t){return`Query(target=${function(n){let s=n.path.canonicalString();return n.collectionGroup!==null&&(s+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(s+=`, filters: [${n.filters.map(i=>rm(i)).join(", ")}]`),za(n.limit)||(s+=", limit: "+n.limit),n.orderBy.length>0&&(s+=`, orderBy: [${n.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),n.startAt&&(s+=", startAt: ",s+=n.startAt.inclusive?"b:":"a:",s+=n.startAt.position.map(i=>Fi(i)).join(",")),n.endAt&&(s+=", endAt: ",s+=n.endAt.inclusive?"a:":"b:",s+=n.endAt.position.map(i=>Fi(i)).join(",")),`Target(${s})`}(Tn(t))}; limitType=${t.limitType})`}function Ua(t,e){return e.isFoundDocument()&&function(s,i){const r=i.key.path;return s.collectionGroup!==null?i.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(r):Y.isDocumentKey(s.path)?s.path.isEqual(r):s.path.isImmediateParentOf(r)}(t,e)&&function(s,i){for(const r of kr(s))if(!r.field.isKeyField()&&i.data.field(r.field)===null)return!1;return!0}(t,e)&&function(s,i){for(const r of s.filters)if(!r.matches(i))return!1;return!0}(t,e)&&function(s,i){return!(s.startAt&&!function(o,l,c){const d=Gh(o,l,c);return o.inclusive?d<=0:d<0}(s.startAt,kr(s),i)||s.endAt&&!function(o,l,c){const d=Gh(o,l,c);return o.inclusive?d>=0:d>0}(s.endAt,kr(s),i))}(t,e)}function Y_(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function cm(t){return(e,n)=>{let s=!1;for(const i of kr(t)){const r=j_(i,e,n);if(r!==0)return r;s=s||i.field.isKeyField()}return 0}}function j_(t,e,n){const s=t.field.isKeyField()?Y.comparator(e.key,n.key):function(r,o,l){const c=o.data.field(r),d=l.data.field(r);return c!==null&&d!==null?Oi(c,d):Q()}(t.field,e,n);switch(t.dir){case"asc":return s;case"desc":return-1*s;default:return Q()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s!==void 0){for(const[i,r]of s)if(this.equalsFn(i,e))return r}}has(e){return this.get(e)!==void 0}set(e,n){const s=this.mapKeyFn(e),i=this.inner[s];if(i===void 0)return this.inner[s]=[[e,n]],void this.innerSize++;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],e))return void(i[r]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return!1;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return s.length===1?delete this.inner[n]:s.splice(i,1),this.innerSize--,!0;return!1}forEach(e){di(this.inner,(n,s)=>{for(const[i,r]of s)e(i,r)})}isEmpty(){return Xp(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K_=new Me(Y.comparator);function ts(){return K_}const dm=new Me(Y.comparator);function wr(...t){let e=dm;for(const n of t)e=e.insert(n.key,n);return e}function um(t){let e=dm;return t.forEach((n,s)=>e=e.insert(n,s.overlayedDocument)),e}function Gs(){return Cr()}function hm(){return Cr()}function Cr(){return new Qi(t=>t.toString(),(t,e)=>t.isEqual(e))}const Q_=new Me(Y.comparator),J_=new rt(Y.comparator);function ae(...t){let e=J_;for(const n of t)e=e.add(n);return e}const X_=new rt(fe);function Z_(){return X_}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ad(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ba(e)?"-0":e}}function fm(t){return{integerValue:""+t}}function eE(t,e){return R_(e)?fm(e):ad(t,e)}/**
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
 */class qa{constructor(){this._=void 0}}function tE(t,e,n){return t instanceof Ur?function(i,r){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return r&&td(r)&&(r=nd(r)),r&&(o.fields.__previous_value__=r),{mapValue:o}}(n,e):t instanceof qr?mm(t,e):t instanceof Hr?gm(t,e):function(i,r){const o=pm(i,r),l=Qh(o)+Qh(i.Pe);return rc(o)&&rc(i.Pe)?fm(l):ad(i.serializer,l)}(t,e)}function nE(t,e,n){return t instanceof qr?mm(t,e):t instanceof Hr?gm(t,e):n}function pm(t,e){return t instanceof Ea?function(s){return rc(s)||function(r){return!!r&&"doubleValue"in r}(s)}(e)?e:{integerValue:0}:null}class Ur extends qa{}class qr extends qa{constructor(e){super(),this.elements=e}}function mm(t,e){const n=ym(e);for(const s of t.elements)n.some(i=>Sn(i,s))||n.push(s);return{arrayValue:{values:n}}}class Hr extends qa{constructor(e){super(),this.elements=e}}function gm(t,e){let n=ym(e);for(const s of t.elements)n=n.filter(i=>!Sn(i,s));return{arrayValue:{values:n}}}class Ea extends qa{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function Qh(t){return Ve(t.integerValue||t.doubleValue)}function ym(t){return sd(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sE{constructor(e,n){this.field=e,this.transform=n}}function iE(t,e){return t.field.isEqual(e.field)&&function(s,i){return s instanceof qr&&i instanceof qr||s instanceof Hr&&i instanceof Hr?Ni(s.elements,i.elements,Sn):s instanceof Ea&&i instanceof Ea?Sn(s.Pe,i.Pe):s instanceof Ur&&i instanceof Ur}(t.transform,e.transform)}class rE{constructor(e,n){this.version=e,this.transformResults=n}}class xt{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new xt}static exists(e){return new xt(void 0,e)}static updateTime(e){return new xt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ea(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class Ha{}function vm(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new Wa(t.key,xt.none()):new uo(t.key,t.data,xt.none());{const n=t.data,s=Bt.empty();let i=new rt(it.comparator);for(let r of e.fields)if(!i.has(r)){let o=n.field(r);o===null&&r.length>1&&(r=r.popLast(),o=n.field(r)),o===null?s.delete(r):s.set(r,o),i=i.add(r)}return new Ms(t.key,s,new Gt(i.toArray()),xt.none())}}function oE(t,e,n){t instanceof uo?function(i,r,o){const l=i.value.clone(),c=Xh(i.fieldTransforms,r,o.transformResults);l.setAll(c),r.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof Ms?function(i,r,o){if(!ea(i.precondition,r))return void r.convertToUnknownDocument(o.version);const l=Xh(i.fieldTransforms,r,o.transformResults),c=r.data;c.setAll(bm(i)),c.setAll(l),r.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(t,e,n):function(i,r,o){r.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function Rr(t,e,n,s){return t instanceof uo?function(r,o,l,c){if(!ea(r.precondition,o))return l;const d=r.value.clone(),h=Zh(r.fieldTransforms,c,o);return d.setAll(h),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),null}(t,e,n,s):t instanceof Ms?function(r,o,l,c){if(!ea(r.precondition,o))return l;const d=Zh(r.fieldTransforms,c,o),h=o.data;return h.setAll(bm(r)),h.setAll(d),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),l===null?null:l.unionWith(r.fieldMask.fields).unionWith(r.fieldTransforms.map(m=>m.field))}(t,e,n,s):function(r,o,l){return ea(r.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function aE(t,e){let n=null;for(const s of t.fieldTransforms){const i=e.data.field(s.field),r=pm(s.transform,i||null);r!=null&&(n===null&&(n=Bt.empty()),n.set(s.field,r))}return n||null}function Jh(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(s,i){return s===void 0&&i===void 0||!(!s||!i)&&Ni(s,i,(r,o)=>iE(r,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class uo extends Ha{constructor(e,n,s,i=[]){super(),this.key=e,this.value=n,this.precondition=s,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Ms extends Ha{constructor(e,n,s,i,r=[]){super(),this.key=e,this.data=n,this.fieldMask=s,this.precondition=i,this.fieldTransforms=r,this.type=1}getFieldMask(){return this.fieldMask}}function bm(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const s=t.data.field(n);e.set(n,s)}}),e}function Xh(t,e,n){const s=new Map;ye(t.length===n.length);for(let i=0;i<n.length;i++){const r=t[i],o=r.transform,l=e.data.field(r.field);s.set(r.field,nE(o,l,n[i]))}return s}function Zh(t,e,n){const s=new Map;for(const i of t){const r=i.transform,o=n.data.field(i.field);s.set(i.field,tE(r,o,e))}return s}class Wa extends Ha{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class lE extends Ha{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cE{constructor(e,n,s,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=s,this.mutations=i}applyToRemoteDocument(e,n){const s=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const r=this.mutations[i];r.key.isEqual(e.key)&&oE(r,e,s[i])}}applyToLocalView(e,n){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(n=Rr(s,e,n,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(n=Rr(s,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const s=hm();return this.mutations.forEach(i=>{const r=e.get(i.key),o=r.overlayedDocument;let l=this.applyToLocalView(o,r.mutatedFields);l=n.has(i.key)?null:l;const c=vm(o,l);c!==null&&s.set(i.key,c),o.isValidDocument()||o.convertToNoDocument(Z.min())}),s}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),ae())}isEqual(e){return this.batchId===e.batchId&&Ni(this.mutations,e.mutations,(n,s)=>Jh(n,s))&&Ni(this.baseMutations,e.baseMutations,(n,s)=>Jh(n,s))}}class ld{constructor(e,n,s,i){this.batch=e,this.commitVersion=n,this.mutationResults=s,this.docVersions=i}static from(e,n,s){ye(e.mutations.length===s.length);let i=function(){return Q_}();const r=e.mutations;for(let o=0;o<r.length;o++)i=i.insert(r[o].key,s[o].version);return new ld(e,n,s,i)}}/**
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
 */class dE{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class uE{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var We,ce;function hE(t){switch(t){default:return Q();case M.CANCELLED:case M.UNKNOWN:case M.DEADLINE_EXCEEDED:case M.RESOURCE_EXHAUSTED:case M.INTERNAL:case M.UNAVAILABLE:case M.UNAUTHENTICATED:return!1;case M.INVALID_ARGUMENT:case M.NOT_FOUND:case M.ALREADY_EXISTS:case M.PERMISSION_DENIED:case M.FAILED_PRECONDITION:case M.ABORTED:case M.OUT_OF_RANGE:case M.UNIMPLEMENTED:case M.DATA_LOSS:return!0}}function wm(t){if(t===void 0)return es("GRPC error has no .code"),M.UNKNOWN;switch(t){case We.OK:return M.OK;case We.CANCELLED:return M.CANCELLED;case We.UNKNOWN:return M.UNKNOWN;case We.DEADLINE_EXCEEDED:return M.DEADLINE_EXCEEDED;case We.RESOURCE_EXHAUSTED:return M.RESOURCE_EXHAUSTED;case We.INTERNAL:return M.INTERNAL;case We.UNAVAILABLE:return M.UNAVAILABLE;case We.UNAUTHENTICATED:return M.UNAUTHENTICATED;case We.INVALID_ARGUMENT:return M.INVALID_ARGUMENT;case We.NOT_FOUND:return M.NOT_FOUND;case We.ALREADY_EXISTS:return M.ALREADY_EXISTS;case We.PERMISSION_DENIED:return M.PERMISSION_DENIED;case We.FAILED_PRECONDITION:return M.FAILED_PRECONDITION;case We.ABORTED:return M.ABORTED;case We.OUT_OF_RANGE:return M.OUT_OF_RANGE;case We.UNIMPLEMENTED:return M.UNIMPLEMENTED;case We.DATA_LOSS:return M.DATA_LOSS;default:return Q()}}(ce=We||(We={}))[ce.OK=0]="OK",ce[ce.CANCELLED=1]="CANCELLED",ce[ce.UNKNOWN=2]="UNKNOWN",ce[ce.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ce[ce.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ce[ce.NOT_FOUND=5]="NOT_FOUND",ce[ce.ALREADY_EXISTS=6]="ALREADY_EXISTS",ce[ce.PERMISSION_DENIED=7]="PERMISSION_DENIED",ce[ce.UNAUTHENTICATED=16]="UNAUTHENTICATED",ce[ce.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ce[ce.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ce[ce.ABORTED=10]="ABORTED",ce[ce.OUT_OF_RANGE=11]="OUT_OF_RANGE",ce[ce.UNIMPLEMENTED=12]="UNIMPLEMENTED",ce[ce.INTERNAL=13]="INTERNAL",ce[ce.UNAVAILABLE=14]="UNAVAILABLE",ce[ce.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function fE(){return new TextEncoder}/**
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
 */const pE=new Ks([4294967295,4294967295],0);function ef(t){const e=fE().encode(t),n=new Hp;return n.update(e),new Uint8Array(n.digest())}function tf(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),s=e.getUint32(4,!0),i=e.getUint32(8,!0),r=e.getUint32(12,!0);return[new Ks([n,s],0),new Ks([i,r],0)]}class cd{constructor(e,n,s){if(this.bitmap=e,this.padding=n,this.hashCount=s,n<0||n>=8)throw new _r(`Invalid padding: ${n}`);if(s<0)throw new _r(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new _r(`Invalid hash count: ${s}`);if(e.length===0&&n!==0)throw new _r(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=Ks.fromNumber(this.Ie)}Ee(e,n,s){let i=e.add(n.multiply(Ks.fromNumber(s)));return i.compare(pE)===1&&(i=new Ks([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=ef(e),[s,i]=tf(n);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);if(!this.de(o))return!1}return!0}static create(e,n,s){const i=e%8==0?0:8-e%8,r=new Uint8Array(Math.ceil(e/8)),o=new cd(r,i,n);return s.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const n=ef(e),[s,i]=tf(n);for(let r=0;r<this.hashCount;r++){const o=this.Ee(s,i,r);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),s=e%8;this.bitmap[n]|=1<<s}}class _r extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ga{constructor(e,n,s,i,r){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=s,this.documentUpdates=i,this.resolvedLimboDocuments=r}static createSynthesizedRemoteEventForCurrentChange(e,n,s){const i=new Map;return i.set(e,ho.createSynthesizedTargetChangeForCurrentChange(e,n,s)),new Ga(Z.min(),i,new Me(fe),ts(),ae())}}class ho{constructor(e,n,s,i,r){this.resumeToken=e,this.current=n,this.addedDocuments=s,this.modifiedDocuments=i,this.removedDocuments=r}static createSynthesizedTargetChangeForCurrentChange(e,n,s){return new ho(s,n,ae(),ae(),ae())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ta{constructor(e,n,s,i){this.Re=e,this.removedTargetIds=n,this.key=s,this.Ve=i}}class _m{constructor(e,n){this.targetId=e,this.me=n}}class Em{constructor(e,n,s=at.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=n,this.resumeToken=s,this.cause=i}}class nf{constructor(){this.fe=0,this.ge=rf(),this.pe=at.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ae(),n=ae(),s=ae();return this.ge.forEach((i,r)=>{switch(r){case 0:e=e.add(i);break;case 2:n=n.add(i);break;case 1:s=s.add(i);break;default:Q()}}),new ho(this.pe,this.ye,e,n,s)}Ce(){this.we=!1,this.ge=rf()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,ye(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class mE{constructor(e){this.Le=e,this.Be=new Map,this.ke=ts(),this.qe=sf(),this.Qe=new Me(fe)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const s=this.Ge(n);switch(e.state){case 0:this.ze(n)&&s.De(e.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(e.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(s.Ne(),s.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),s.De(e.resumeToken));break;default:Q()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((s,i)=>{this.ze(i)&&n(i)})}He(e){const n=e.targetId,s=e.me.count,i=this.Je(n);if(i){const r=i.target;if(ac(r))if(s===0){const o=new Y(r.path);this.Ue(n,o,mt.newNoDocument(o,Z.min()))}else ye(s===1);else{const o=this.Ye(n);if(o!==s){const l=this.Ze(e),c=l?this.Xe(l,e,o):1;if(c!==0){this.je(n);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,d)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:s="",padding:i=0},hashCount:r=0}=n;let o,l;try{o=si(s).toUint8Array()}catch(c){if(c instanceof Zp)return Li("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new cd(o,i,r)}catch(c){return Li(c instanceof _r?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,n,s){return n.me.count===s-this.nt(e,n.targetId)?0:2}nt(e,n){const s=this.Le.getRemoteKeysForTarget(n);let i=0;return s.forEach(r=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${r.path.canonicalString()}`;e.mightContain(l)||(this.Ue(n,r,null),i++)}),i}rt(e){const n=new Map;this.Be.forEach((r,o)=>{const l=this.Je(o);if(l){if(r.current&&ac(l.target)){const c=new Y(l.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,mt.newNoDocument(c,e))}r.be&&(n.set(o,r.ve()),r.Ce())}});let s=ae();this.qe.forEach((r,o)=>{let l=!0;o.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(s=s.add(r))}),this.ke.forEach((r,o)=>o.setReadTime(e));const i=new Ga(e,n,this.Qe,this.ke,s);return this.ke=ts(),this.qe=sf(),this.Qe=new Me(fe),i}$e(e,n){if(!this.ze(e))return;const s=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,s),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,s){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,n)?i.Fe(n,1):i.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),s&&(this.ke=this.ke.insert(n,s))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new nf,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new rt(fe),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||H("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new nf),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function sf(){return new Me(Y.comparator)}function rf(){return new Me(Y.comparator)}const gE={asc:"ASCENDING",desc:"DESCENDING"},yE={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},vE={and:"AND",or:"OR"};class bE{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function cc(t,e){return t.useProto3Json||za(e)?e:{value:e}}function Ta(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Tm(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function wE(t,e){return Ta(t,e.toTimestamp())}function In(t){return ye(!!t),Z.fromTimestamp(function(n){const s=Cs(n);return new Ke(s.seconds,s.nanos)}(t))}function dd(t,e){return dc(t,e).canonicalString()}function dc(t,e){const n=function(i){return new Ae(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function Im(t){const e=Ae.fromString(t);return ye(Cm(e)),e}function uc(t,e){return dd(t.databaseId,e.path)}function zl(t,e){const n=Im(e);if(n.get(1)!==t.databaseId.projectId)throw new $(M.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new $(M.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new Y(xm(n))}function Sm(t,e){return dd(t.databaseId,e)}function _E(t){const e=Im(t);return e.length===4?Ae.emptyPath():xm(e)}function hc(t){return new Ae(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function xm(t){return ye(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function of(t,e,n){return{name:uc(t,e),fields:n.value.mapValue.fields}}function EE(t,e){let n;if("targetChange"in e){e.targetChange;const s=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:Q()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],r=function(d,h){return d.useProto3Json?(ye(h===void 0||typeof h=="string"),at.fromBase64String(h||"")):(ye(h===void 0||h instanceof Buffer||h instanceof Uint8Array),at.fromUint8Array(h||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(d){const h=d.code===void 0?M.UNKNOWN:wm(d.code);return new $(h,d.message||"")}(o);n=new Em(s,i,r,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const i=zl(t,s.document.name),r=In(s.document.updateTime),o=s.document.createTime?In(s.document.createTime):Z.min(),l=new Bt({mapValue:{fields:s.document.fields}}),c=mt.newFoundDocument(i,r,o,l),d=s.targetIds||[],h=s.removedTargetIds||[];n=new ta(d,h,c.key,c)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const i=zl(t,s.document),r=s.readTime?In(s.readTime):Z.min(),o=mt.newNoDocument(i,r),l=s.removedTargetIds||[];n=new ta([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const i=zl(t,s.document),r=s.removedTargetIds||[];n=new ta([],r,i,null)}else{if(!("filter"in e))return Q();{e.filter;const s=e.filter;s.targetId;const{count:i=0,unchangedNames:r}=s,o=new uE(i,r),l=s.targetId;n=new _m(l,o)}}return n}function TE(t,e){let n;if(e instanceof uo)n={update:of(t,e.key,e.value)};else if(e instanceof Wa)n={delete:uc(t,e.key)};else if(e instanceof Ms)n={update:of(t,e.key,e.data),updateMask:ME(e.fieldMask)};else{if(!(e instanceof lE))return Q();n={verify:uc(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(s=>function(r,o){const l=o.transform;if(l instanceof Ur)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof qr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Hr)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Ea)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw Q()}(0,s))),e.precondition.isNone||(n.currentDocument=function(i,r){return r.updateTime!==void 0?{updateTime:wE(i,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:Q()}(t,e.precondition)),n}function IE(t,e){return t&&t.length>0?(ye(e!==void 0),t.map(n=>function(i,r){let o=i.updateTime?In(i.updateTime):In(r);return o.isEqual(Z.min())&&(o=In(r)),new rE(o,i.transformResults||[])}(n,e))):[]}function SE(t,e){return{documents:[Sm(t,e.path)]}}function xE(t,e){const n={structuredQuery:{}},s=e.path;let i;e.collectionGroup!==null?(i=s,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=s.popLast(),n.structuredQuery.from=[{collectionId:s.lastSegment()}]),n.parent=Sm(t,i);const r=function(d){if(d.length!==0)return km(fn.create(d,"and"))}(e.filters);r&&(n.structuredQuery.where=r);const o=function(d){if(d.length!==0)return d.map(h=>function(p){return{field:Ei(p.field),direction:CE(p.dir)}}(h))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=cc(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:n,parent:i}}function AE(t){let e=_E(t.parent);const n=t.structuredQuery,s=n.from?n.from.length:0;let i=null;if(s>0){ye(s===1);const h=n.from[0];h.allDescendants?i=h.collectionId:e=e.child(h.collectionId)}let r=[];n.where&&(r=function(m){const p=Am(m);return p instanceof fn&&sm(p)?p.getFilters():[p]}(n.where));let o=[];n.orderBy&&(o=function(m){return m.map(p=>function(I){return new $r(Ti(I.field),function(A){switch(A){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(I.direction))}(p))}(n.orderBy));let l=null;n.limit&&(l=function(m){let p;return p=typeof m=="object"?m.value:m,za(p)?null:p}(n.limit));let c=null;n.startAt&&(c=function(m){const p=!!m.before,w=m.values||[];return new wa(w,p)}(n.startAt));let d=null;return n.endAt&&(d=function(m){const p=!m.before,w=m.values||[];return new wa(w,p)}(n.endAt)),W_(e,i,o,r,l,"F",c,d)}function kE(t,e){const n=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Q()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function Am(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const s=Ti(n.unaryFilter.field);return Ge.create(s,"==",{doubleValue:NaN});case"IS_NULL":const i=Ti(n.unaryFilter.field);return Ge.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=Ti(n.unaryFilter.field);return Ge.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Ti(n.unaryFilter.field);return Ge.create(o,"!=",{nullValue:"NULL_VALUE"});default:return Q()}}(t):t.fieldFilter!==void 0?function(n){return Ge.create(Ti(n.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Q()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return fn.create(n.compositeFilter.filters.map(s=>Am(s)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return Q()}}(n.compositeFilter.op))}(t):Q()}function CE(t){return gE[t]}function RE(t){return yE[t]}function PE(t){return vE[t]}function Ei(t){return{fieldPath:t.canonicalString()}}function Ti(t){return it.fromServerFormat(t.fieldPath)}function km(t){return t instanceof Ge?function(n){if(n.op==="=="){if(Wh(n.value))return{unaryFilter:{field:Ei(n.field),op:"IS_NAN"}};if(Hh(n.value))return{unaryFilter:{field:Ei(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Wh(n.value))return{unaryFilter:{field:Ei(n.field),op:"IS_NOT_NAN"}};if(Hh(n.value))return{unaryFilter:{field:Ei(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ei(n.field),op:RE(n.op),value:n.value}}}(t):t instanceof fn?function(n){const s=n.getFilters().map(i=>km(i));return s.length===1?s[0]:{compositeFilter:{op:PE(n.op),filters:s}}}(t):Q()}function ME(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function Cm(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ws{constructor(e,n,s,i,r=Z.min(),o=Z.min(),l=at.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=n,this.purpose=s,this.sequenceNumber=i,this.snapshotVersion=r,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new ws(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new ws(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new ws(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new ws(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DE{constructor(e){this.ct=e}}function BE(t){const e=AE({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?_a(e,e.limit,"L"):e}/**
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
 */class LE{constructor(){this.un=new NE}addToCollectionParentIndex(e,n){return this.un.add(n),N.resolve()}getCollectionParents(e,n){return N.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return N.resolve()}deleteFieldIndex(e,n){return N.resolve()}deleteAllFieldIndexes(e){return N.resolve()}createTargetIndexes(e,n){return N.resolve()}getDocumentsMatchingTarget(e,n){return N.resolve(null)}getIndexType(e,n){return N.resolve(0)}getFieldIndexes(e,n){return N.resolve([])}getNextCollectionGroupToUpdate(e){return N.resolve(null)}getMinOffset(e,n){return N.resolve(ks.min())}getMinOffsetFromCollectionGroup(e,n){return N.resolve(ks.min())}updateCollectionGroup(e,n,s){return N.resolve()}updateIndexEntries(e,n){return N.resolve()}}class NE{constructor(){this.index={}}add(e){const n=e.lastSegment(),s=e.popLast(),i=this.index[n]||new rt(Ae.comparator),r=!i.has(s);return this.index[n]=i.add(s),r}has(e){const n=e.lastSegment(),s=e.popLast(),i=this.index[n];return i&&i.has(s)}getEntries(e){return(this.index[e]||new rt(Ae.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vi{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Vi(0)}static kn(){return new Vi(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OE{constructor(){this.changes=new Qi(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,mt.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const s=this.changes.get(n);return s!==void 0?N.resolve(s):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class FE{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VE{constructor(e,n,s,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=s,this.indexManager=i}getDocument(e,n){let s=null;return this.documentOverlayCache.getOverlay(e,n).next(i=>(s=i,this.remoteDocumentCache.getEntry(e,n))).next(i=>(s!==null&&Rr(s.mutation,i,Gt.empty(),Ke.now()),i))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.getLocalViewOfDocuments(e,s,ae()).next(()=>s))}getLocalViewOfDocuments(e,n,s=ae()){const i=Gs();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,s).next(r=>{let o=wr();return r.forEach((l,c)=>{o=o.insert(l,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const s=Gs();return this.populateOverlays(e,s,n).next(()=>this.computeViews(e,n,s,ae()))}populateOverlays(e,n,s){const i=[];return s.forEach(r=>{n.has(r)||i.push(r)}),this.documentOverlayCache.getOverlays(e,i).next(r=>{r.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,s,i){let r=ts();const o=Cr(),l=function(){return Cr()}();return n.forEach((c,d)=>{const h=s.get(d.key);i.has(d.key)&&(h===void 0||h.mutation instanceof Ms)?r=r.insert(d.key,d):h!==void 0?(o.set(d.key,h.mutation.getFieldMask()),Rr(h.mutation,d,h.mutation.getFieldMask(),Ke.now())):o.set(d.key,Gt.empty())}),this.recalculateAndSaveOverlays(e,r).next(c=>(c.forEach((d,h)=>o.set(d,h)),n.forEach((d,h)=>{var m;return l.set(d,new FE(h,(m=o.get(d))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,n){const s=Cr();let i=new Me((o,l)=>o-l),r=ae();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(c=>{const d=n.get(c);if(d===null)return;let h=s.get(c)||Gt.empty();h=l.applyToLocalView(d,h),s.set(c,h);const m=(i.get(l.batchId)||ae()).add(c);i=i.insert(l.batchId,m)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,h=c.value,m=hm();h.forEach(p=>{if(!r.has(p)){const w=vm(n.get(p),s.get(p));w!==null&&m.set(p,w),r=r.add(p)}}),o.push(this.documentOverlayCache.saveOverlays(e,d,m))}return N.waitFor(o)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,n,s,i){return function(o){return Y.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):am(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,s,i):this.getDocumentsMatchingCollectionQuery(e,n,s,i)}getNextDocuments(e,n,s,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,s,i).next(r=>{const o=i-r.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,s.largestBatchId,i-r.size):N.resolve(Gs());let l=-1,c=r;return o.next(d=>N.forEach(d,(h,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),r.get(h)?N.resolve():this.remoteDocumentCache.getEntry(e,h).next(p=>{c=c.insert(h,p)}))).next(()=>this.populateOverlays(e,d,r)).next(()=>this.computeViews(e,c,d,ae())).next(h=>({batchId:l,changes:um(h)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new Y(n)).next(s=>{let i=wr();return s.isFoundDocument()&&(i=i.insert(s.key,s)),i})}getDocumentsMatchingCollectionGroupQuery(e,n,s,i){const r=n.collectionGroup;let o=wr();return this.indexManager.getCollectionParents(e,r).next(l=>N.forEach(l,c=>{const d=function(m,p){return new Ki(p,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,c.child(r));return this.getDocumentsMatchingCollectionQuery(e,d,s,i).next(h=>{h.forEach((m,p)=>{o=o.insert(m,p)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,s,i){let r;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,s.largestBatchId).next(o=>(r=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,s,r,i))).next(o=>{r.forEach((c,d)=>{const h=d.getKey();o.get(h)===null&&(o=o.insert(h,mt.newInvalidDocument(h)))});let l=wr();return o.forEach((c,d)=>{const h=r.get(c);h!==void 0&&Rr(h.mutation,d,Gt.empty(),Ke.now()),Ua(n,d)&&(l=l.insert(c,d))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zE{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return N.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(i){return{id:i.id,version:i.version,createTime:In(i.createTime)}}(n)),N.resolve()}getNamedQuery(e,n){return N.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(i){return{name:i.name,query:BE(i.bundledQuery),readTime:In(i.readTime)}}(n)),N.resolve()}}/**
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
 */class $E{constructor(){this.overlays=new Me(Y.comparator),this.Ir=new Map}getOverlay(e,n){return N.resolve(this.overlays.get(n))}getOverlays(e,n){const s=Gs();return N.forEach(n,i=>this.getOverlay(e,i).next(r=>{r!==null&&s.set(i,r)})).next(()=>s)}saveOverlays(e,n,s){return s.forEach((i,r)=>{this.ht(e,n,r)}),N.resolve()}removeOverlaysForBatchId(e,n,s){const i=this.Ir.get(s);return i!==void 0&&(i.forEach(r=>this.overlays=this.overlays.remove(r)),this.Ir.delete(s)),N.resolve()}getOverlaysForCollection(e,n,s){const i=Gs(),r=n.length+1,o=new Y(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!n.isPrefixOf(d.path))break;d.path.length===r&&c.largestBatchId>s&&i.set(c.getKey(),c)}return N.resolve(i)}getOverlaysForCollectionGroup(e,n,s,i){let r=new Me((d,h)=>d-h);const o=this.overlays.getIterator();for(;o.hasNext();){const d=o.getNext().value;if(d.getKey().getCollectionGroup()===n&&d.largestBatchId>s){let h=r.get(d.largestBatchId);h===null&&(h=Gs(),r=r.insert(d.largestBatchId,h)),h.set(d.getKey(),d)}}const l=Gs(),c=r.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,h)=>l.set(d,h)),!(l.size()>=i)););return N.resolve(l)}ht(e,n,s){const i=this.overlays.get(s.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(s.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new dE(n,s));let r=this.Ir.get(n);r===void 0&&(r=ae(),this.Ir.set(n,r)),this.Ir.set(n,r.add(s.key))}}/**
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
 */class UE{constructor(){this.sessionToken=at.EMPTY_BYTE_STRING}getSessionToken(e){return N.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,N.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ud{constructor(){this.Tr=new rt(Je.Er),this.dr=new rt(Je.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const s=new Je(e,n);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(e,n){e.forEach(s=>this.addReference(s,n))}removeReference(e,n){this.Vr(new Je(e,n))}mr(e,n){e.forEach(s=>this.removeReference(s,n))}gr(e){const n=new Y(new Ae([])),s=new Je(n,e),i=new Je(n,e+1),r=[];return this.dr.forEachInRange([s,i],o=>{this.Vr(o),r.push(o.key)}),r}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new Y(new Ae([])),s=new Je(n,e),i=new Je(n,e+1);let r=ae();return this.dr.forEachInRange([s,i],o=>{r=r.add(o.key)}),r}containsKey(e){const n=new Je(e,0),s=this.Tr.firstAfterOrEqual(n);return s!==null&&e.isEqual(s.key)}}class Je{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return Y.comparator(e.key,n.key)||fe(e.wr,n.wr)}static Ar(e,n){return fe(e.wr,n.wr)||Y.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qE{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new rt(Je.Er)}checkEmpty(e){return N.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,s,i){const r=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new cE(r,n,s,i);this.mutationQueue.push(o);for(const l of i)this.br=this.br.add(new Je(l.key,r)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return N.resolve(o)}lookupMutationBatch(e,n){return N.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const s=n+1,i=this.vr(s),r=i<0?0:i;return N.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return N.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return N.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const s=new Je(n,0),i=new Je(n,Number.POSITIVE_INFINITY),r=[];return this.br.forEachInRange([s,i],o=>{const l=this.Dr(o.wr);r.push(l)}),N.resolve(r)}getAllMutationBatchesAffectingDocumentKeys(e,n){let s=new rt(fe);return n.forEach(i=>{const r=new Je(i,0),o=new Je(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([r,o],l=>{s=s.add(l.wr)})}),N.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(e,n){const s=n.path,i=s.length+1;let r=s;Y.isDocumentKey(r)||(r=r.child(""));const o=new Je(new Y(r),0);let l=new rt(fe);return this.br.forEachWhile(c=>{const d=c.key.path;return!!s.isPrefixOf(d)&&(d.length===i&&(l=l.add(c.wr)),!0)},o),N.resolve(this.Cr(l))}Cr(e){const n=[];return e.forEach(s=>{const i=this.Dr(s);i!==null&&n.push(i)}),n}removeMutationBatch(e,n){ye(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return N.forEach(n.mutations,i=>{const r=new Je(i.key,n.batchId);return s=s.delete(r),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=s})}On(e){}containsKey(e,n){const s=new Je(n,0),i=this.br.firstAfterOrEqual(s);return N.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,N.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HE{constructor(e){this.Mr=e,this.docs=function(){return new Me(Y.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const s=n.key,i=this.docs.get(s),r=i?i.size:0,o=this.Mr(n);return this.docs=this.docs.insert(s,{document:n.mutableCopy(),size:o}),this.size+=o-r,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const s=this.docs.get(n);return N.resolve(s?s.document.mutableCopy():mt.newInvalidDocument(n))}getEntries(e,n){let s=ts();return n.forEach(i=>{const r=this.docs.get(i);s=s.insert(i,r?r.document.mutableCopy():mt.newInvalidDocument(i))}),N.resolve(s)}getDocumentsMatchingQuery(e,n,s,i){let r=ts();const o=n.path,l=new Y(o.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:h}}=c.getNext();if(!o.isPrefixOf(d.path))break;d.path.length>o.length+1||x_(S_(h),s)<=0||(i.has(h.key)||Ua(n,h))&&(r=r.insert(h.key,h.mutableCopy()))}return N.resolve(r)}getAllFromCollectionGroup(e,n,s,i){Q()}Or(e,n){return N.forEach(this.docs,s=>n(s))}newChangeBuffer(e){return new WE(this)}getSize(e){return N.resolve(this.size)}}class WE extends OE{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((s,i)=>{i.isValidDocument()?n.push(this.cr.addEntry(e,i)):this.cr.removeEntry(s)}),N.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GE{constructor(e){this.persistence=e,this.Nr=new Qi(n=>id(n),rd),this.lastRemoteSnapshotVersion=Z.min(),this.highestTargetId=0,this.Lr=0,this.Br=new ud,this.targetCount=0,this.kr=Vi.Bn()}forEachTarget(e,n){return this.Nr.forEach((s,i)=>n(i)),N.resolve()}getLastRemoteSnapshotVersion(e){return N.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return N.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),N.resolve(this.highestTargetId)}setTargetsMetadata(e,n,s){return s&&(this.lastRemoteSnapshotVersion=s),n>this.Lr&&(this.Lr=n),N.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new Vi(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,N.resolve()}updateTargetData(e,n){return this.Kn(n),N.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,N.resolve()}removeTargets(e,n,s){let i=0;const r=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=n&&s.get(l.targetId)===null&&(this.Nr.delete(o),r.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),N.waitFor(r).next(()=>i)}getTargetCount(e){return N.resolve(this.targetCount)}getTargetData(e,n){const s=this.Nr.get(n)||null;return N.resolve(s)}addMatchingKeys(e,n,s){return this.Br.Rr(n,s),N.resolve()}removeMatchingKeys(e,n,s){this.Br.mr(n,s);const i=this.persistence.referenceDelegate,r=[];return i&&n.forEach(o=>{r.push(i.markPotentiallyOrphaned(e,o))}),N.waitFor(r)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),N.resolve()}getMatchingKeysForTargetId(e,n){const s=this.Br.yr(n);return N.resolve(s)}containsKey(e,n){return N.resolve(this.Br.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YE{constructor(e,n){this.qr={},this.overlays={},this.Qr=new ed(0),this.Kr=!1,this.Kr=!0,this.$r=new UE,this.referenceDelegate=e(this),this.Ur=new GE(this),this.indexManager=new LE,this.remoteDocumentCache=function(i){return new HE(i)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new DE(n),this.Gr=new zE(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new $E,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let s=this.qr[e.toKey()];return s||(s=new qE(n,this.referenceDelegate),this.qr[e.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,s){H("MemoryPersistence","Starting transaction:",e);const i=new jE(this.Qr.next());return this.referenceDelegate.zr(),s(i).next(r=>this.referenceDelegate.jr(i).next(()=>r)).toPromise().then(r=>(i.raiseOnCommittedEvent(),r))}Hr(e,n){return N.or(Object.values(this.qr).map(s=>()=>s.containsKey(e,n)))}}class jE extends k_{constructor(e){super(),this.currentSequenceNumber=e}}class hd{constructor(e){this.persistence=e,this.Jr=new ud,this.Yr=null}static Zr(e){return new hd(e)}get Xr(){if(this.Yr)return this.Yr;throw Q()}addReference(e,n,s){return this.Jr.addReference(s,n),this.Xr.delete(s.toString()),N.resolve()}removeReference(e,n,s){return this.Jr.removeReference(s,n),this.Xr.add(s.toString()),N.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),N.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(i=>this.Xr.add(i.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,n.targetId).next(i=>{i.forEach(r=>this.Xr.add(r.toString()))}).next(()=>s.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return N.forEach(this.Xr,s=>{const i=Y.fromPath(s);return this.ei(e,i).next(r=>{r||n.removeEntry(i,Z.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(s=>{s?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return N.or([()=>N.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fd{constructor(e,n,s,i){this.targetId=e,this.fromCache=n,this.$i=s,this.Ui=i}static Wi(e,n){let s=ae(),i=ae();for(const r of n.docChanges)switch(r.type){case 0:s=s.add(r.doc.key);break;case 1:i=i.add(r.doc.key)}return new fd(e,n.fromCache,s,i)}}/**
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
 */class KE{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class QE{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Rv()?8:C_(yt())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,s,i){const r={result:null};return this.Yi(e,n).next(o=>{r.result=o}).next(()=>{if(!r.result)return this.Zi(e,n,i,s).next(o=>{r.result=o})}).next(()=>{if(r.result)return;const o=new KE;return this.Xi(e,n,o).next(l=>{if(r.result=l,this.zi)return this.es(e,n,o,l.size)})}).next(()=>r.result)}es(e,n,s,i){return s.documentReadCount<this.ji?(mr()<=le.DEBUG&&H("QueryEngine","SDK will not create cache indexes for query:",_i(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),N.resolve()):(mr()<=le.DEBUG&&H("QueryEngine","Query:",_i(n),"scans",s.documentReadCount,"local documents and returns",i,"documents as results."),s.documentReadCount>this.Hi*i?(mr()<=le.DEBUG&&H("QueryEngine","The SDK decides to create cache indexes for query:",_i(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Tn(n))):N.resolve())}Yi(e,n){if(Kh(n))return N.resolve(null);let s=Tn(n);return this.indexManager.getIndexType(e,s).next(i=>i===0?null:(n.limit!==null&&i===1&&(n=_a(n,null,"F"),s=Tn(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next(r=>{const o=ae(...r);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,s).next(c=>{const d=this.ts(n,l);return this.ns(n,d,o,c.readTime)?this.Yi(e,_a(n,null,"F")):this.rs(e,d,n,c)}))})))}Zi(e,n,s,i){return Kh(n)||i.isEqual(Z.min())?N.resolve(null):this.Ji.getDocuments(e,s).next(r=>{const o=this.ts(n,r);return this.ns(n,o,s,i)?N.resolve(null):(mr()<=le.DEBUG&&H("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),_i(n)),this.rs(e,o,n,I_(i,-1)).next(l=>l))})}ts(e,n){let s=new rt(cm(e));return n.forEach((i,r)=>{Ua(e,r)&&(s=s.add(r))}),s}ns(e,n,s,i){if(e.limit===null)return!1;if(s.size!==n.size)return!0;const r=e.limitType==="F"?n.last():n.first();return!!r&&(r.hasPendingWrites||r.version.compareTo(i)>0)}Xi(e,n,s){return mr()<=le.DEBUG&&H("QueryEngine","Using full collection scan to execute query:",_i(n)),this.Ji.getDocumentsMatchingQuery(e,n,ks.min(),s)}rs(e,n,s,i){return this.Ji.getDocumentsMatchingQuery(e,s,i).next(r=>(n.forEach(o=>{r=r.insert(o.key,o)}),r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JE{constructor(e,n,s,i){this.persistence=e,this.ss=n,this.serializer=i,this.os=new Me(fe),this._s=new Qi(r=>id(r),rd),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(s)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new VE(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function XE(t,e,n,s){return new JE(t,e,n,s)}async function Rm(t,e){const n=ee(t);return await n.persistence.runTransaction("Handle user change","readonly",s=>{let i;return n.mutationQueue.getAllMutationBatches(s).next(r=>(i=r,n.ls(e),n.mutationQueue.getAllMutationBatches(s))).next(r=>{const o=[],l=[];let c=ae();for(const d of i){o.push(d.batchId);for(const h of d.mutations)c=c.add(h.key)}for(const d of r){l.push(d.batchId);for(const h of d.mutations)c=c.add(h.key)}return n.localDocuments.getDocuments(s,c).next(d=>({hs:d,removedBatchIds:o,addedBatchIds:l}))})})}function ZE(t,e){const n=ee(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const i=e.batch.keys(),r=n.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,h){const m=d.batch,p=m.keys();let w=N.resolve();return p.forEach(I=>{w=w.next(()=>h.getEntry(c,I)).next(S=>{const A=d.docVersions.get(I);ye(A!==null),S.version.compareTo(A)<0&&(m.applyToRemoteDocument(S,d),S.isValidDocument()&&(S.setReadTime(d.commitVersion),h.addEntry(S)))})}),w.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(n,s,e,r).next(()=>r.apply(s)).next(()=>n.mutationQueue.performConsistencyCheck(s)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(s,i,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(l){let c=ae();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(e))).next(()=>n.localDocuments.getDocuments(s,i))})}function Pm(t){const e=ee(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function eT(t,e){const n=ee(t),s=e.snapshotVersion;let i=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",r=>{const o=n.cs.newChangeBuffer({trackRemovals:!0});i=n.os;const l=[];e.targetChanges.forEach((h,m)=>{const p=i.get(m);if(!p)return;l.push(n.Ur.removeMatchingKeys(r,h.removedDocuments,m).next(()=>n.Ur.addMatchingKeys(r,h.addedDocuments,m)));let w=p.withSequenceNumber(r.currentSequenceNumber);e.targetMismatches.get(m)!==null?w=w.withResumeToken(at.EMPTY_BYTE_STRING,Z.min()).withLastLimboFreeSnapshotVersion(Z.min()):h.resumeToken.approximateByteSize()>0&&(w=w.withResumeToken(h.resumeToken,s)),i=i.insert(m,w),function(S,A,P){return S.resumeToken.approximateByteSize()===0||A.snapshotVersion.toMicroseconds()-S.snapshotVersion.toMicroseconds()>=3e8?!0:P.addedDocuments.size+P.modifiedDocuments.size+P.removedDocuments.size>0}(p,w,h)&&l.push(n.Ur.updateTargetData(r,w))});let c=ts(),d=ae();if(e.documentUpdates.forEach(h=>{e.resolvedLimboDocuments.has(h)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(r,h))}),l.push(tT(r,o,e.documentUpdates).next(h=>{c=h.Ps,d=h.Is})),!s.isEqual(Z.min())){const h=n.Ur.getLastRemoteSnapshotVersion(r).next(m=>n.Ur.setTargetsMetadata(r,r.currentSequenceNumber,s));l.push(h)}return N.waitFor(l).next(()=>o.apply(r)).next(()=>n.localDocuments.getLocalViewOfDocuments(r,c,d)).next(()=>c)}).then(r=>(n.os=i,r))}function tT(t,e,n){let s=ae(),i=ae();return n.forEach(r=>s=s.add(r)),e.getEntries(t,s).next(r=>{let o=ts();return n.forEach((l,c)=>{const d=r.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(i=i.add(l)),c.isNoDocument()&&c.version.isEqual(Z.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):H("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:o,Is:i}})}function nT(t,e){const n=ee(t);return n.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function sT(t,e){const n=ee(t);return n.persistence.runTransaction("Allocate target","readwrite",s=>{let i;return n.Ur.getTargetData(s,e).next(r=>r?(i=r,N.resolve(i)):n.Ur.allocateTargetId(s).next(o=>(i=new ws(e,o,"TargetPurposeListen",s.currentSequenceNumber),n.Ur.addTargetData(s,i).next(()=>i))))}).then(s=>{const i=n.os.get(s.targetId);return(i===null||s.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(n.os=n.os.insert(s.targetId,s),n._s.set(e,s.targetId)),s})}async function fc(t,e,n){const s=ee(t),i=s.os.get(e),r=n?"readwrite":"readwrite-primary";try{n||await s.persistence.runTransaction("Release target",r,o=>s.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!co(o))throw o;H("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}s.os=s.os.remove(e),s._s.delete(i.target)}function af(t,e,n){const s=ee(t);let i=Z.min(),r=ae();return s.persistence.runTransaction("Execute query","readwrite",o=>function(c,d,h){const m=ee(c),p=m._s.get(h);return p!==void 0?N.resolve(m.os.get(p)):m.Ur.getTargetData(d,h)}(s,o,Tn(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(o,l.targetId).next(c=>{r=c})}).next(()=>s.ss.getDocumentsMatchingQuery(o,e,n?i:Z.min(),n?r:ae())).next(l=>(iT(s,Y_(e),l),{documents:l,Ts:r})))}function iT(t,e,n){let s=t.us.get(e)||Z.min();n.forEach((i,r)=>{r.readTime.compareTo(s)>0&&(s=r.readTime)}),t.us.set(e,s)}class lf{constructor(){this.activeTargetIds=Z_()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class rT{constructor(){this.so=new lf,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,s){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,s){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new lf,Promise.resolve()}handleUserChange(e,n,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class oT{_o(e){}shutdown(){}}/**
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
 */class cf{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){H("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){H("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Go=null;function $l(){return Go===null?Go=function(){return 268435456+Math.round(2147483648*Math.random())}():Go++,"0x"+Go.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aT={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lT{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ft="WebChannelConnection";class cT extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const s=n.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+n.host,this.vo=`projects/${i}/databases/${r}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${r}`}get Fo(){return!1}Mo(n,s,i,r,o){const l=$l(),c=this.xo(n,s.toUriEncodedString());H("RestConnection",`Sending RPC '${n}' ${l}:`,c,i);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,r,o),this.No(n,c,d,i).then(h=>(H("RestConnection",`Received RPC '${n}' ${l}: `,h),h),h=>{throw Li("RestConnection",`RPC '${n}' ${l} failed with error: `,h,"url: ",c,"request:",i),h})}Lo(n,s,i,r,o,l){return this.Mo(n,s,i,r,o)}Oo(n,s,i){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+ji}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((r,o)=>n[o]=r),i&&i.headers.forEach((r,o)=>n[o]=r)}xo(n,s){const i=aT[n];return`${this.Do}/v1/${s}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,s,i){const r=$l();return new Promise((o,l)=>{const c=new Wp;c.setWithCredentials(!0),c.listenOnce(Gp.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Xo.NO_ERROR:const h=c.getResponseJson();H(ft,`XHR for RPC '${e}' ${r} received:`,JSON.stringify(h)),o(h);break;case Xo.TIMEOUT:H(ft,`RPC '${e}' ${r} timed out`),l(new $(M.DEADLINE_EXCEEDED,"Request time out"));break;case Xo.HTTP_ERROR:const m=c.getStatus();if(H(ft,`RPC '${e}' ${r} failed with status:`,m,"response text:",c.getResponseText()),m>0){let p=c.getResponseJson();Array.isArray(p)&&(p=p[0]);const w=p==null?void 0:p.error;if(w&&w.status&&w.message){const I=function(A){const P=A.toLowerCase().replace(/_/g,"-");return Object.values(M).indexOf(P)>=0?P:M.UNKNOWN}(w.status);l(new $(I,w.message))}else l(new $(M.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new $(M.UNAVAILABLE,"Connection failed."));break;default:Q()}}finally{H(ft,`RPC '${e}' ${r} completed.`)}});const d=JSON.stringify(i);H(ft,`RPC '${e}' ${r} sending request:`,i),c.send(n,"POST",d,s,15)})}Bo(e,n,s){const i=$l(),r=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Kp(),l=jp(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,n,s),c.encodeInitMessageHeaders=!0;const h=r.join("");H(ft,`Creating RPC '${e}' stream ${i}: ${h}`,c);const m=o.createWebChannel(h,c);let p=!1,w=!1;const I=new lT({Io:A=>{w?H(ft,`Not sending because RPC '${e}' stream ${i} is closed:`,A):(p||(H(ft,`Opening RPC '${e}' stream ${i} transport.`),m.open(),p=!0),H(ft,`RPC '${e}' stream ${i} sending:`,A),m.send(A))},To:()=>m.close()}),S=(A,P,C)=>{A.listen(P,L=>{try{C(L)}catch(D){setTimeout(()=>{throw D},0)}})};return S(m,br.EventType.OPEN,()=>{w||(H(ft,`RPC '${e}' stream ${i} transport opened.`),I.yo())}),S(m,br.EventType.CLOSE,()=>{w||(w=!0,H(ft,`RPC '${e}' stream ${i} transport closed`),I.So())}),S(m,br.EventType.ERROR,A=>{w||(w=!0,Li(ft,`RPC '${e}' stream ${i} transport errored:`,A),I.So(new $(M.UNAVAILABLE,"The operation could not be completed")))}),S(m,br.EventType.MESSAGE,A=>{var P;if(!w){const C=A.data[0];ye(!!C);const L=C,D=L.error||((P=L[0])===null||P===void 0?void 0:P.error);if(D){H(ft,`RPC '${e}' stream ${i} received error:`,D);const O=D.status;let U=function(_){const b=We[_];if(b!==void 0)return wm(b)}(O),T=D.message;U===void 0&&(U=M.INTERNAL,T="Unknown error status: "+O+" with message "+D.message),w=!0,I.So(new $(U,T)),m.close()}else H(ft,`RPC '${e}' stream ${i} received:`,C),I.bo(C)}}),S(l,Yp.STAT_EVENT,A=>{A.stat===sc.PROXY?H(ft,`RPC '${e}' stream ${i} detected buffering proxy`):A.stat===sc.NOPROXY&&H(ft,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{I.wo()},0),I}}function Ul(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ya(t){return new bE(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mm{constructor(e,n,s=1e3,i=1.5,r=6e4){this.ui=e,this.timerId=n,this.ko=s,this.qo=i,this.Qo=r,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),i=Math.max(0,n-s);i>0&&H("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dm{constructor(e,n,s,i,r,o,l,c){this.ui=e,this.Ho=s,this.Jo=i,this.connection=r,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Mm(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===M.RESOURCE_EXHAUSTED?(es(n.toString()),es("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===M.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,i])=>{this.Yo===n&&this.P_(s,i)},s=>{e(()=>{const i=new $(M.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(i)})})}P_(e,n){const s=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{s(()=>this.I_(i))}),this.stream.onMessage(i=>{s(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return H("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():(H("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class dT extends Dm{constructor(e,n,s,i,r,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,s,i,o),this.serializer=r}T_(e,n){return this.connection.Bo("Listen",e,n)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const n=EE(this.serializer,e),s=function(r){if(!("targetChange"in r))return Z.min();const o=r.targetChange;return o.targetIds&&o.targetIds.length?Z.min():o.readTime?In(o.readTime):Z.min()}(e);return this.listener.d_(n,s)}A_(e){const n={};n.database=hc(this.serializer),n.addTarget=function(r,o){let l;const c=o.target;if(l=ac(c)?{documents:SE(r,c)}:{query:xE(r,c)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=Tm(r,o.resumeToken);const d=cc(r,o.expectedCount);d!==null&&(l.expectedCount=d)}else if(o.snapshotVersion.compareTo(Z.min())>0){l.readTime=Ta(r,o.snapshotVersion.toTimestamp());const d=cc(r,o.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,e);const s=kE(this.serializer,e);s&&(n.labels=s),this.a_(n)}R_(e){const n={};n.database=hc(this.serializer),n.removeTarget=e,this.a_(n)}}class uT extends Dm{constructor(e,n,s,i,r,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,s,i,o),this.serializer=r}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,n){return this.connection.Bo("Write",e,n)}E_(e){return ye(!!e.streamToken),this.lastStreamToken=e.streamToken,ye(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){ye(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const n=IE(e.writeResults,e.commitTime),s=In(e.commitTime);return this.listener.g_(s,n)}p_(){const e={};e.database=hc(this.serializer),this.a_(e)}m_(e){const n={streamToken:this.lastStreamToken,writes:e.map(s=>TE(this.serializer,s))};this.a_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hT extends class{}{constructor(e,n,s,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=s,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new $(M.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([r,o])=>this.connection.Mo(e,dc(n,s),i,r,o)).catch(r=>{throw r.name==="FirebaseError"?(r.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new $(M.UNKNOWN,r.toString())})}Lo(e,n,s,i,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,dc(n,s),i,o,l,r)).catch(o=>{throw o.name==="FirebaseError"?(o.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new $(M.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class fT{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
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
 */class pT{constructor(e,n,s,i,r){this.localStore=e,this.datastore=n,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=r,this.k_._o(o=>{s.enqueueAndForget(async()=>{ui(this)&&(H("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=ee(c);d.L_.add(4),await fo(d),d.q_.set("Unknown"),d.L_.delete(4),await ja(d)}(this))})}),this.q_=new fT(s,i)}}async function ja(t){if(ui(t))for(const e of t.B_)await e(!0)}async function fo(t){for(const e of t.B_)await e(!1)}function Bm(t,e){const n=ee(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),yd(n)?gd(n):Ji(n).r_()&&md(n,e))}function pd(t,e){const n=ee(t),s=Ji(n);n.N_.delete(e),s.r_()&&Lm(n,e),n.N_.size===0&&(s.r_()?s.o_():ui(n)&&n.q_.set("Unknown"))}function md(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Z.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Ji(t).A_(e)}function Lm(t,e){t.Q_.xe(e),Ji(t).R_(e)}function gd(t){t.Q_=new mE({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),Ji(t).start(),t.q_.v_()}function yd(t){return ui(t)&&!Ji(t).n_()&&t.N_.size>0}function ui(t){return ee(t).L_.size===0}function Nm(t){t.Q_=void 0}async function mT(t){t.q_.set("Online")}async function gT(t){t.N_.forEach((e,n)=>{md(t,e)})}async function yT(t,e){Nm(t),yd(t)?(t.q_.M_(e),gd(t)):t.q_.set("Unknown")}async function vT(t,e,n){if(t.q_.set("Online"),e instanceof Em&&e.state===2&&e.cause)try{await async function(i,r){const o=r.cause;for(const l of r.targetIds)i.N_.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.N_.delete(l),i.Q_.removeTarget(l))}(t,e)}catch(s){H("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Ia(t,s)}else if(e instanceof ta?t.Q_.Ke(e):e instanceof _m?t.Q_.He(e):t.Q_.We(e),!n.isEqual(Z.min()))try{const s=await Pm(t.localStore);n.compareTo(s)>=0&&await function(r,o){const l=r.Q_.rt(o);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const h=r.N_.get(d);h&&r.N_.set(d,h.withResumeToken(c.resumeToken,o))}}),l.targetMismatches.forEach((c,d)=>{const h=r.N_.get(c);if(!h)return;r.N_.set(c,h.withResumeToken(at.EMPTY_BYTE_STRING,h.snapshotVersion)),Lm(r,c);const m=new ws(h.target,c,d,h.sequenceNumber);md(r,m)}),r.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(s){H("RemoteStore","Failed to raise snapshot:",s),await Ia(t,s)}}async function Ia(t,e,n){if(!co(e))throw e;t.L_.add(1),await fo(t),t.q_.set("Offline"),n||(n=()=>Pm(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{H("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await ja(t)})}function Om(t,e){return e().catch(n=>Ia(t,n,e))}async function Ka(t){const e=ee(t),n=Rs(e);let s=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;bT(e);)try{const i=await nT(e.localStore,s);if(i===null){e.O_.length===0&&n.o_();break}s=i.batchId,wT(e,i)}catch(i){await Ia(e,i)}Fm(e)&&Vm(e)}function bT(t){return ui(t)&&t.O_.length<10}function wT(t,e){t.O_.push(e);const n=Rs(t);n.r_()&&n.V_&&n.m_(e.mutations)}function Fm(t){return ui(t)&&!Rs(t).n_()&&t.O_.length>0}function Vm(t){Rs(t).start()}async function _T(t){Rs(t).p_()}async function ET(t){const e=Rs(t);for(const n of t.O_)e.m_(n.mutations)}async function TT(t,e,n){const s=t.O_.shift(),i=ld.from(s,e,n);await Om(t,()=>t.remoteSyncer.applySuccessfulWrite(i)),await Ka(t)}async function IT(t,e){e&&Rs(t).V_&&await async function(s,i){if(function(o){return hE(o)&&o!==M.ABORTED}(i.code)){const r=s.O_.shift();Rs(s).s_(),await Om(s,()=>s.remoteSyncer.rejectFailedWrite(r.batchId,i)),await Ka(s)}}(t,e),Fm(t)&&Vm(t)}async function df(t,e){const n=ee(t);n.asyncQueue.verifyOperationInProgress(),H("RemoteStore","RemoteStore received new credentials");const s=ui(n);n.L_.add(3),await fo(n),s&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await ja(n)}async function ST(t,e){const n=ee(t);e?(n.L_.delete(2),await ja(n)):e||(n.L_.add(2),await fo(n),n.q_.set("Unknown"))}function Ji(t){return t.K_||(t.K_=function(n,s,i){const r=ee(n);return r.w_(),new dT(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(t.datastore,t.asyncQueue,{Eo:mT.bind(null,t),Ro:gT.bind(null,t),mo:yT.bind(null,t),d_:vT.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),yd(t)?gd(t):t.q_.set("Unknown")):(await t.K_.stop(),Nm(t))})),t.K_}function Rs(t){return t.U_||(t.U_=function(n,s,i){const r=ee(n);return r.w_(),new uT(s,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,i)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:_T.bind(null,t),mo:IT.bind(null,t),f_:ET.bind(null,t),g_:TT.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await Ka(t)):(await t.U_.stop(),t.O_.length>0&&(H("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vd{constructor(e,n,s,i,r){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=s,this.op=i,this.removalCallback=r,this.deferred=new Kn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,s,i,r){const o=Date.now()+s,l=new vd(e,n,o,i,r);return l.start(s),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new $(M.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function bd(t,e){if(es("AsyncQueue",`${e}: ${t}`),co(t))return new $(M.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki{constructor(e){this.comparator=e?(n,s)=>e(n,s)||Y.comparator(n.key,s.key):(n,s)=>Y.comparator(n.key,s.key),this.keyedMap=wr(),this.sortedSet=new Me(this.comparator)}static emptySet(e){return new ki(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,s)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof ki)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;n.hasNext();){const i=n.getNext().key,r=s.getNext().key;if(!i.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const s=new ki;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=n,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uf{constructor(){this.W_=new Me(Y.comparator)}track(e){const n=e.doc.key,s=this.W_.get(n);s?e.type!==0&&s.type===3?this.W_=this.W_.insert(n,e):e.type===3&&s.type!==1?this.W_=this.W_.insert(n,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.W_=this.W_.insert(n,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.W_=this.W_.remove(n):e.type===1&&s.type===2?this.W_=this.W_.insert(n,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):Q():this.W_=this.W_.insert(n,e)}G_(){const e=[];return this.W_.inorderTraversal((n,s)=>{e.push(s)}),e}}class zi{constructor(e,n,s,i,r,o,l,c,d){this.query=e,this.docs=n,this.oldDocs=s,this.docChanges=i,this.mutatedKeys=r,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,n,s,i,r){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new zi(e,n,ki.emptySet(n),o,s,i,!0,!1,r)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&$a(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,s=e.docChanges;if(n.length!==s.length)return!1;for(let i=0;i<n.length;i++)if(n[i].type!==s[i].type||!n[i].doc.isEqual(s[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xT{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class AT{constructor(){this.queries=hf(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,s){const i=ee(n),r=i.queries;i.queries=hf(),r.forEach((o,l)=>{for(const c of l.j_)c.onError(s)})})(this,new $(M.ABORTED,"Firestore shutting down"))}}function hf(){return new Qi(t=>lm(t),$a)}async function zm(t,e){const n=ee(t);let s=3;const i=e.query;let r=n.queries.get(i);r?!r.H_()&&e.J_()&&(s=2):(r=new xT,s=e.J_()?0:1);try{switch(s){case 0:r.z_=await n.onListen(i,!0);break;case 1:r.z_=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const l=bd(o,`Initialization of query '${_i(e.query)}' failed`);return void e.onError(l)}n.queries.set(i,r),r.j_.push(e),e.Z_(n.onlineState),r.z_&&e.X_(r.z_)&&wd(n)}async function $m(t,e){const n=ee(t),s=e.query;let i=3;const r=n.queries.get(s);if(r){const o=r.j_.indexOf(e);o>=0&&(r.j_.splice(o,1),r.j_.length===0?i=e.J_()?0:1:!r.H_()&&e.J_()&&(i=2))}switch(i){case 0:return n.queries.delete(s),n.onUnlisten(s,!0);case 1:return n.queries.delete(s),n.onUnlisten(s,!1);case 2:return n.onLastRemoteStoreUnlisten(s);default:return}}function kT(t,e){const n=ee(t);let s=!1;for(const i of e){const r=i.query,o=n.queries.get(r);if(o){for(const l of o.j_)l.X_(i)&&(s=!0);o.z_=i}}s&&wd(n)}function CT(t,e,n){const s=ee(t),i=s.queries.get(e);if(i)for(const r of i.j_)r.onError(n);s.queries.delete(e)}function wd(t){t.Y_.forEach(e=>{e.next()})}var pc,ff;(ff=pc||(pc={})).ea="default",ff.Cache="cache";class Um{constructor(e,n,s){this.query=e,this.ta=n,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(e){if(!this.options.includeMetadataChanges){const s=[];for(const i of e.docChanges)i.type!==3&&s.push(i);e=new zi(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.na?this.ia(e)&&(this.ta.next(e),n=!0):this.sa(e,this.onlineState)&&(this.oa(e),n=!0),this.ra=e,n}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let n=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),n=!0),n}sa(e,n){if(!e.fromCache||!this.J_())return!0;const s=n!=="Offline";return(!this.options._a||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const n=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}oa(e){e=zi.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==pc.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qm{constructor(e){this.key=e}}class Hm{constructor(e){this.key=e}}class RT{constructor(e,n){this.query=e,this.Ta=n,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ae(),this.mutatedKeys=ae(),this.Aa=cm(e),this.Ra=new ki(this.Aa)}get Va(){return this.Ta}ma(e,n){const s=n?n.fa:new uf,i=n?n.Ra:this.Ra;let r=n?n.mutatedKeys:this.mutatedKeys,o=i,l=!1;const c=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,d=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((h,m)=>{const p=i.get(h),w=Ua(this.query,m)?m:null,I=!!p&&this.mutatedKeys.has(p.key),S=!!w&&(w.hasLocalMutations||this.mutatedKeys.has(w.key)&&w.hasCommittedMutations);let A=!1;p&&w?p.data.isEqual(w.data)?I!==S&&(s.track({type:3,doc:w}),A=!0):this.ga(p,w)||(s.track({type:2,doc:w}),A=!0,(c&&this.Aa(w,c)>0||d&&this.Aa(w,d)<0)&&(l=!0)):!p&&w?(s.track({type:0,doc:w}),A=!0):p&&!w&&(s.track({type:1,doc:p}),A=!0,(c||d)&&(l=!0)),A&&(w?(o=o.add(w),r=S?r.add(h):r.delete(h)):(o=o.delete(h),r=r.delete(h)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const h=this.query.limitType==="F"?o.last():o.first();o=o.delete(h.key),r=r.delete(h.key),s.track({type:1,doc:h})}return{Ra:o,fa:s,ns:l,mutatedKeys:r}}ga(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,s,i){const r=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((h,m)=>function(w,I){const S=A=>{switch(A){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Q()}};return S(w)-S(I)}(h.type,m.type)||this.Aa(h.doc,m.doc)),this.pa(s),i=i!=null&&i;const l=n&&!i?this.ya():[],c=this.da.size===0&&this.current&&!i?1:0,d=c!==this.Ea;return this.Ea=c,o.length!==0||d?{snapshot:new zi(this.query,e.Ra,r,o,e.mutatedKeys,c===0,d,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new uf,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(n=>this.Ta=this.Ta.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ta=this.Ta.delete(n)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ae(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const n=[];return e.forEach(s=>{this.da.has(s)||n.push(new Hm(s))}),this.da.forEach(s=>{e.has(s)||n.push(new qm(s))}),n}ba(e){this.Ta=e.Ts,this.da=ae();const n=this.ma(e.documents);return this.applyChanges(n,!0)}Da(){return zi.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class PT{constructor(e,n,s){this.query=e,this.targetId=n,this.view=s}}class MT{constructor(e){this.key=e,this.va=!1}}class DT{constructor(e,n,s,i,r,o){this.localStore=e,this.remoteStore=n,this.eventManager=s,this.sharedClientState=i,this.currentUser=r,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new Qi(l=>lm(l),$a),this.Ma=new Map,this.xa=new Set,this.Oa=new Me(Y.comparator),this.Na=new Map,this.La=new ud,this.Ba={},this.ka=new Map,this.qa=Vi.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function BT(t,e,n=!0){const s=Qm(t);let i;const r=s.Fa.get(e);return r?(s.sharedClientState.addLocalQueryTarget(r.targetId),i=r.view.Da()):i=await Wm(s,e,n,!0),i}async function LT(t,e){const n=Qm(t);await Wm(n,e,!0,!1)}async function Wm(t,e,n,s){const i=await sT(t.localStore,Tn(e)),r=i.targetId,o=t.sharedClientState.addLocalQueryTarget(r,n);let l;return s&&(l=await NT(t,e,r,o==="current",i.resumeToken)),t.isPrimaryClient&&n&&Bm(t.remoteStore,i),l}async function NT(t,e,n,s,i){t.Ka=(m,p,w)=>async function(S,A,P,C){let L=A.view.ma(P);L.ns&&(L=await af(S.localStore,A.query,!1).then(({documents:T})=>A.view.ma(T,L)));const D=C&&C.targetChanges.get(A.targetId),O=C&&C.targetMismatches.get(A.targetId)!=null,U=A.view.applyChanges(L,S.isPrimaryClient,D,O);return mf(S,A.targetId,U.wa),U.snapshot}(t,m,p,w);const r=await af(t.localStore,e,!0),o=new RT(e,r.Ts),l=o.ma(r.documents),c=ho.createSynthesizedTargetChangeForCurrentChange(n,s&&t.onlineState!=="Offline",i),d=o.applyChanges(l,t.isPrimaryClient,c);mf(t,n,d.wa);const h=new PT(e,n,o);return t.Fa.set(e,h),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),d.snapshot}async function OT(t,e,n){const s=ee(t),i=s.Fa.get(e),r=s.Ma.get(i.targetId);if(r.length>1)return s.Ma.set(i.targetId,r.filter(o=>!$a(o,e))),void s.Fa.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(i.targetId),s.sharedClientState.isActiveQueryTarget(i.targetId)||await fc(s.localStore,i.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(i.targetId),n&&pd(s.remoteStore,i.targetId),mc(s,i.targetId)}).catch(lo)):(mc(s,i.targetId),await fc(s.localStore,i.targetId,!0))}async function FT(t,e){const n=ee(t),s=n.Fa.get(e),i=n.Ma.get(s.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(s.targetId),pd(n.remoteStore,s.targetId))}async function VT(t,e,n){const s=GT(t);try{const i=await function(o,l){const c=ee(o),d=Ke.now(),h=l.reduce((w,I)=>w.add(I.key),ae());let m,p;return c.persistence.runTransaction("Locally write mutations","readwrite",w=>{let I=ts(),S=ae();return c.cs.getEntries(w,h).next(A=>{I=A,I.forEach((P,C)=>{C.isValidDocument()||(S=S.add(P))})}).next(()=>c.localDocuments.getOverlayedDocuments(w,I)).next(A=>{m=A;const P=[];for(const C of l){const L=aE(C,m.get(C.key).overlayedDocument);L!=null&&P.push(new Ms(C.key,L,em(L.value.mapValue),xt.exists(!0)))}return c.mutationQueue.addMutationBatch(w,d,P,l)}).next(A=>{p=A;const P=A.applyToLocalDocumentSet(m,S);return c.documentOverlayCache.saveOverlays(w,A.batchId,P)})}).then(()=>({batchId:p.batchId,changes:um(m)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(i.batchId),function(o,l,c){let d=o.Ba[o.currentUser.toKey()];d||(d=new Me(fe)),d=d.insert(l,c),o.Ba[o.currentUser.toKey()]=d}(s,i.batchId,n),await po(s,i.changes),await Ka(s.remoteStore)}catch(i){const r=bd(i,"Failed to persist write");n.reject(r)}}async function Gm(t,e){const n=ee(t);try{const s=await eT(n.localStore,e);e.targetChanges.forEach((i,r)=>{const o=n.Na.get(r);o&&(ye(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?ye(o.va):i.removedDocuments.size>0&&(ye(o.va),o.va=!1))}),await po(n,s,e)}catch(s){await lo(s)}}function pf(t,e,n){const s=ee(t);if(s.isPrimaryClient&&n===0||!s.isPrimaryClient&&n===1){const i=[];s.Fa.forEach((r,o)=>{const l=o.view.Z_(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const c=ee(o);c.onlineState=l;let d=!1;c.queries.forEach((h,m)=>{for(const p of m.j_)p.Z_(l)&&(d=!0)}),d&&wd(c)}(s.eventManager,e),i.length&&s.Ca.d_(i),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function zT(t,e,n){const s=ee(t);s.sharedClientState.updateQueryState(e,"rejected",n);const i=s.Na.get(e),r=i&&i.key;if(r){let o=new Me(Y.comparator);o=o.insert(r,mt.newNoDocument(r,Z.min()));const l=ae().add(r),c=new Ga(Z.min(),new Map,new Me(fe),o,l);await Gm(s,c),s.Oa=s.Oa.remove(r),s.Na.delete(e),_d(s)}else await fc(s.localStore,e,!1).then(()=>mc(s,e,n)).catch(lo)}async function $T(t,e){const n=ee(t),s=e.batch.batchId;try{const i=await ZE(n.localStore,e);jm(n,s,null),Ym(n,s),n.sharedClientState.updateMutationState(s,"acknowledged"),await po(n,i)}catch(i){await lo(i)}}async function UT(t,e,n){const s=ee(t);try{const i=await function(o,l){const c=ee(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let h;return c.mutationQueue.lookupMutationBatch(d,l).next(m=>(ye(m!==null),h=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,h,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,h)).next(()=>c.localDocuments.getDocuments(d,h))})}(s.localStore,e);jm(s,e,n),Ym(s,e),s.sharedClientState.updateMutationState(e,"rejected",n),await po(s,i)}catch(i){await lo(i)}}function Ym(t,e){(t.ka.get(e)||[]).forEach(n=>{n.resolve()}),t.ka.delete(e)}function jm(t,e,n){const s=ee(t);let i=s.Ba[s.currentUser.toKey()];if(i){const r=i.get(e);r&&(n?r.reject(n):r.resolve(),i=i.remove(e)),s.Ba[s.currentUser.toKey()]=i}}function mc(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const s of t.Ma.get(e))t.Fa.delete(s),n&&t.Ca.$a(s,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(s=>{t.La.containsKey(s)||Km(t,s)})}function Km(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);n!==null&&(pd(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),_d(t))}function mf(t,e,n){for(const s of n)s instanceof qm?(t.La.addReference(s.key,e),qT(t,s)):s instanceof Hm?(H("SyncEngine","Document no longer in limbo: "+s.key),t.La.removeReference(s.key,e),t.La.containsKey(s.key)||Km(t,s.key)):Q()}function qT(t,e){const n=e.key,s=n.path.canonicalString();t.Oa.get(n)||t.xa.has(s)||(H("SyncEngine","New document in limbo: "+n),t.xa.add(s),_d(t))}function _d(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new Y(Ae.fromString(e)),s=t.qa.next();t.Na.set(s,new MT(n)),t.Oa=t.Oa.insert(n,s),Bm(t.remoteStore,new ws(Tn(od(n.path)),s,"TargetPurposeLimboResolution",ed.oe))}}async function po(t,e,n){const s=ee(t),i=[],r=[],o=[];s.Fa.isEmpty()||(s.Fa.forEach((l,c)=>{o.push(s.Ka(c,e,n).then(d=>{var h;if((d||n)&&s.isPrimaryClient){const m=d?!d.fromCache:(h=n==null?void 0:n.targetChanges.get(c.targetId))===null||h===void 0?void 0:h.current;s.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){i.push(d);const m=fd.Wi(c.targetId,d);r.push(m)}}))}),await Promise.all(o),s.Ca.d_(i),await async function(c,d){const h=ee(c);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>N.forEach(d,p=>N.forEach(p.$i,w=>h.persistence.referenceDelegate.addReference(m,p.targetId,w)).next(()=>N.forEach(p.Ui,w=>h.persistence.referenceDelegate.removeReference(m,p.targetId,w)))))}catch(m){if(!co(m))throw m;H("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const p=m.targetId;if(!m.fromCache){const w=h.os.get(p),I=w.snapshotVersion,S=w.withLastLimboFreeSnapshotVersion(I);h.os=h.os.insert(p,S)}}}(s.localStore,r))}async function HT(t,e){const n=ee(t);if(!n.currentUser.isEqual(e)){H("SyncEngine","User change. New user:",e.toKey());const s=await Rm(n.localStore,e);n.currentUser=e,function(r,o){r.ka.forEach(l=>{l.forEach(c=>{c.reject(new $(M.CANCELLED,o))})}),r.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await po(n,s.hs)}}function WT(t,e){const n=ee(t),s=n.Na.get(e);if(s&&s.va)return ae().add(s.key);{let i=ae();const r=n.Ma.get(e);if(!r)return i;for(const o of r){const l=n.Fa.get(o);i=i.unionWith(l.view.Va)}return i}}function Qm(t){const e=ee(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=Gm.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=WT.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=zT.bind(null,e),e.Ca.d_=kT.bind(null,e.eventManager),e.Ca.$a=CT.bind(null,e.eventManager),e}function GT(t){const e=ee(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=$T.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=UT.bind(null,e),e}class Sa{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ya(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return XE(this.persistence,new QE,e.initialUser,this.serializer)}Ga(e){return new YE(hd.Zr,this.serializer)}Wa(e){return new rT}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Sa.provider={build:()=>new Sa};class gc{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>pf(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=HT.bind(null,this.syncEngine),await ST(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new AT}()}createDatastore(e){const n=Ya(e.databaseInfo.databaseId),s=function(r){return new cT(r)}(e.databaseInfo);return function(r,o,l,c){return new hT(r,o,l,c)}(e.authCredentials,e.appCheckCredentials,s,n)}createRemoteStore(e){return function(s,i,r,o,l){return new pT(s,i,r,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>pf(this.syncEngine,n,0),function(){return cf.D()?new cf:new oT}())}createSyncEngine(e,n){return function(i,r,o,l,c,d,h){const m=new DT(i,r,o,l,c,d);return h&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(i){const r=ee(i);H("RemoteStore","RemoteStore shutting down."),r.L_.add(5),await fo(r),r.k_.shutdown(),r.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}gc.provider={build:()=>new gc};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Jm{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):es("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YT{constructor(e,n,s,i,r){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=s,this.databaseInfo=i,this.user=pt.UNAUTHENTICATED,this.clientId=Jp.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=r,this.authCredentials.start(s,async o=>{H("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(s,o=>(H("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Kn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const s=bd(n,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function ql(t,e){t.asyncQueue.verifyOperationInProgress(),H("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let s=n.initialUser;t.setCredentialChangeListener(async i=>{s.isEqual(i)||(await Rm(e.localStore,i),s=i)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function gf(t,e){t.asyncQueue.verifyOperationInProgress();const n=await jT(t);H("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(s=>df(e.remoteStore,s)),t.setAppCheckTokenChangeListener((s,i)=>df(e.remoteStore,i)),t._onlineComponents=e}async function jT(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){H("FirestoreClient","Using user provided OfflineComponentProvider");try{await ql(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(i){return i.name==="FirebaseError"?i.code===M.FAILED_PRECONDITION||i.code===M.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(n))throw n;Li("Error using user provided cache. Falling back to memory cache: "+n),await ql(t,new Sa)}}else H("FirestoreClient","Using default OfflineComponentProvider"),await ql(t,new Sa);return t._offlineComponents}async function Xm(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(H("FirestoreClient","Using user provided OnlineComponentProvider"),await gf(t,t._uninitializedComponentsProvider._online)):(H("FirestoreClient","Using default OnlineComponentProvider"),await gf(t,new gc))),t._onlineComponents}function KT(t){return Xm(t).then(e=>e.syncEngine)}async function Zm(t){const e=await Xm(t),n=e.eventManager;return n.onListen=BT.bind(null,e.syncEngine),n.onUnlisten=OT.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=LT.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=FT.bind(null,e.syncEngine),n}function QT(t,e,n={}){const s=new Kn;return t.asyncQueue.enqueueAndForget(async()=>function(r,o,l,c,d){const h=new Jm({next:p=>{h.Za(),o.enqueueAndForget(()=>$m(r,m));const w=p.docs.has(l);!w&&p.fromCache?d.reject(new $(M.UNAVAILABLE,"Failed to get document because the client is offline.")):w&&p.fromCache&&c&&c.source==="server"?d.reject(new $(M.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(p)},error:p=>d.reject(p)}),m=new Um(od(l.path),h,{includeMetadataChanges:!0,_a:!0});return zm(r,m)}(await Zm(t),t.asyncQueue,e,n,s)),s.promise}function JT(t,e,n={}){const s=new Kn;return t.asyncQueue.enqueueAndForget(async()=>function(r,o,l,c,d){const h=new Jm({next:p=>{h.Za(),o.enqueueAndForget(()=>$m(r,m)),p.fromCache&&c.source==="server"?d.reject(new $(M.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(p)},error:p=>d.reject(p)}),m=new Um(l,h,{includeMetadataChanges:!0,_a:!0});return zm(r,m)}(await Zm(t),t.asyncQueue,e,n,s)),s.promise}/**
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
 */function eg(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yf=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tg(t,e,n){if(!n)throw new $(M.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function XT(t,e,n,s){if(e===!0&&s===!0)throw new $(M.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function vf(t){if(!Y.isDocumentKey(t))throw new $(M.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function bf(t){if(Y.isDocumentKey(t))throw new $(M.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Qa(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":Q()}function nn(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new $(M.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Qa(t);throw new $(M.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}function ZT(t,e){if(e<=0)throw new $(M.INVALID_ARGUMENT,`Function ${t}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wf{constructor(e){var n,s;if(e.host===void 0){if(e.ssl!==void 0)throw new $(M.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new $(M.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}XT("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=eg((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new $(M.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new $(M.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new $(M.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,i){return s.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ja{constructor(e,n,s,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=s,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new wf({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new $(M.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new $(M.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new wf(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new m_;switch(s.type){case"firstParty":return new b_(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new $(M.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const s=yf.get(n);s&&(H("ComponentProvider","Removing Datastore"),yf.delete(n),s.terminate())}(this),Promise.resolve()}}function eI(t,e,n,s={}){var i;const r=(t=nn(t,Ja))._getSettings(),o=`${e}:${n}`;if(r.host!=="firestore.googleapis.com"&&r.host!==o&&Li("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},r),{host:o,ssl:!1})),s.mockUserToken){let l,c;if(typeof s.mockUserToken=="string")l=s.mockUserToken,c=pt.MOCK_USER;else{l=Tv(s.mockUserToken,(i=t._app)===null||i===void 0?void 0:i.options.projectId);const d=s.mockUserToken.sub||s.mockUserToken.user_id;if(!d)throw new $(M.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new pt(d)}t._authCredentials=new g_(new Qp(l,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{constructor(e,n,s){this.converter=n,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Ds(this.firestore,e,this._query)}}class At{constructor(e,n,s){this.converter=n,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new xs(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new At(this.firestore,e,this._key)}}class xs extends Ds{constructor(e,n,s){super(e,n,od(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new At(this.firestore,null,new Y(e))}withConverter(e){return new xs(this.firestore,e,this._path)}}function Ed(t,e,...n){if(t=Pe(t),tg("collection","path",e),t instanceof Ja){const s=Ae.fromString(e,...n);return bf(s),new xs(t,null,s)}{if(!(t instanceof At||t instanceof xs))throw new $(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(Ae.fromString(e,...n));return bf(s),new xs(t.firestore,null,s)}}function St(t,e,...n){if(t=Pe(t),arguments.length===1&&(e=Jp.newId()),tg("doc","path",e),t instanceof Ja){const s=Ae.fromString(e,...n);return vf(s),new At(t,null,new Y(s))}{if(!(t instanceof At||t instanceof xs))throw new $(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(Ae.fromString(e,...n));return vf(s),new At(t.firestore,t instanceof xs?t.converter:null,new Y(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _f{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Mm(this,"async_queue_retry"),this.Vu=()=>{const s=Ul();s&&H("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=e;const n=Ul();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=Ul();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new Kn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!co(e))throw e;H("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(s=>{this.Eu=s,this.du=!1;const i=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(s);throw es("INTERNAL UNHANDLED ERROR: ",i),s}).then(s=>(this.du=!1,s))));return this.mu=n,n}enqueueAfterDelay(e,n,s){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const i=vd.createAndSchedule(this,e,n,s,r=>this.yu(r));return this.Tu.push(i),i}fu(){this.Eu&&Q()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,s)=>n.targetTimeMs-s.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}class Bs extends Ja{constructor(e,n,s,i){super(e,n,s,i),this.type="firestore",this._queue=new _f,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new _f(e),this._firestoreClient=void 0,await e}}}function tI(t,e){const n=typeof t=="object"?t:op(),s=typeof t=="string"?t:"(default)",i=$c(n,"firestore").getImmediate({identifier:s});if(!i._initialized){const r=_v("firestore");r&&eI(i,...r)}return i}function Xa(t){if(t._terminated)throw new $(M.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||nI(t),t._firestoreClient}function nI(t){var e,n,s;const i=t._freezeSettings(),r=function(l,c,d,h){return new M_(l,c,d,h.host,h.ssl,h.experimentalForceLongPolling,h.experimentalAutoDetectLongPolling,eg(h.experimentalLongPollingOptions),h.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,i);t._componentsProvider||!((n=i.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((s=i.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(t._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),t._firestoreClient=new YT(t._authCredentials,t._appCheckCredentials,t._queue,r,t._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{constructor(e){this._byteString=e}static fromBase64String(e){try{return new $i(at.fromBase64String(e))}catch(n){throw new $(M.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new $i(at.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mo{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new $(M.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new it(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Td{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new $(M.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new $(M.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return fe(this._lat,e._lat)||fe(this._long,e._long)}}/**
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
 */class Id{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,i){if(s.length!==i.length)return!1;for(let r=0;r<s.length;++r)if(s[r]!==i[r])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sI=/^__.*__$/;class iI{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return this.fieldMask!==null?new Ms(e,this.data,this.fieldMask,n,this.fieldTransforms):new uo(e,this.data,n,this.fieldTransforms)}}class ng{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return new Ms(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function sg(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Q()}}class Sd{constructor(e,n,s,i,r,o){this.settings=e,this.databaseId=n,this.serializer=s,this.ignoreUndefinedProperties=i,r===void 0&&this.vu(),this.fieldTransforms=r||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Sd(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:s,xu:!1});return i.Ou(e),i}Nu(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:s,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return xa(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(sg(this.Cu)&&sI.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class rI{constructor(e,n,s){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=s||Ya(e)}Qu(e,n,s,i=!1){return new Sd({Cu:e,methodName:n,qu:s,path:it.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function go(t){const e=t._freezeSettings(),n=Ya(t._databaseId);return new rI(t._databaseId,!!e.ignoreUndefinedProperties,n)}function xd(t,e,n,s,i,r={}){const o=t.Qu(r.merge||r.mergeFields?2:0,e,n,i);kd("Data must be an object, but it was:",o,s);const l=og(s,o);let c,d;if(r.merge)c=new Gt(o.fieldMask),d=o.fieldTransforms;else if(r.mergeFields){const h=[];for(const m of r.mergeFields){const p=yc(e,m,n);if(!o.contains(p))throw new $(M.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);lg(h,p)||h.push(p)}c=new Gt(h),d=o.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=o.fieldTransforms;return new iI(new Bt(l),c,d)}class el extends Za{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof el}}class Ad extends Za{_toFieldTransform(e){return new sE(e.path,new Ur)}isEqual(e){return e instanceof Ad}}function ig(t,e,n,s){const i=t.Qu(1,e,n);kd("Data must be an object, but it was:",i,s);const r=[],o=Bt.empty();di(s,(c,d)=>{const h=Cd(e,c,n);d=Pe(d);const m=i.Nu(h);if(d instanceof el)r.push(h);else{const p=yo(d,m);p!=null&&(r.push(h),o.set(h,p))}});const l=new Gt(r);return new ng(o,l,i.fieldTransforms)}function rg(t,e,n,s,i,r){const o=t.Qu(1,e,n),l=[yc(e,s,n)],c=[i];if(r.length%2!=0)throw new $(M.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let p=0;p<r.length;p+=2)l.push(yc(e,r[p])),c.push(r[p+1]);const d=[],h=Bt.empty();for(let p=l.length-1;p>=0;--p)if(!lg(d,l[p])){const w=l[p];let I=c[p];I=Pe(I);const S=o.Nu(w);if(I instanceof el)d.push(w);else{const A=yo(I,S);A!=null&&(d.push(w),h.set(w,A))}}const m=new Gt(d);return new ng(h,m,o.fieldTransforms)}function oI(t,e,n,s=!1){return yo(n,t.Qu(s?4:3,e))}function yo(t,e){if(ag(t=Pe(t)))return kd("Unsupported field value:",e,t),og(t,e);if(t instanceof Za)return function(s,i){if(!sg(i.Cu))throw i.Bu(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${s._methodName}() is not currently supported inside arrays`);const r=s._toFieldTransform(i);r&&i.fieldTransforms.push(r)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(s,i){const r=[];let o=0;for(const l of s){let c=yo(l,i.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),r.push(c),o++}return{arrayValue:{values:r}}}(t,e)}return function(s,i){if((s=Pe(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return eE(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const r=Ke.fromDate(s);return{timestampValue:Ta(i.serializer,r)}}if(s instanceof Ke){const r=new Ke(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Ta(i.serializer,r)}}if(s instanceof Td)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof $i)return{bytesValue:Tm(i.serializer,s._byteString)};if(s instanceof At){const r=i.databaseId,o=s.firestore._databaseId;if(!o.isEqual(r))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:dd(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof Id)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return ad(l.serializer,c)})}}}}}}(s,i);throw i.Bu(`Unsupported field value: ${Qa(s)}`)}(t,e)}function og(t,e){const n={};return Xp(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):di(t,(s,i)=>{const r=yo(i,e.Mu(s));r!=null&&(n[s]=r)}),{mapValue:{fields:n}}}function ag(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof Ke||t instanceof Td||t instanceof $i||t instanceof At||t instanceof Za||t instanceof Id)}function kd(t,e,n){if(!ag(n)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(n)){const s=Qa(n);throw s==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+s)}}function yc(t,e,n){if((e=Pe(e))instanceof mo)return e._internalPath;if(typeof e=="string")return Cd(t,e);throw xa("Field path arguments must be of type string or ",t,!1,void 0,n)}const aI=new RegExp("[~\\*/\\[\\]]");function Cd(t,e,n){if(e.search(aI)>=0)throw xa(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new mo(...e.split("."))._internalPath}catch{throw xa(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function xa(t,e,n,s,i){const r=s&&!s.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(r||o)&&(c+=" (found",r&&(c+=` in field ${s}`),o&&(c+=` in document ${i}`),c+=")"),new $(M.INVALID_ARGUMENT,l+t+c)}function lg(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cg{constructor(e,n,s,i,r){this._firestore=e,this._userDataWriter=n,this._key=s,this._document=i,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new At(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new lI(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Rd("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class lI extends cg{data(){return super.data()}}function Rd(t,e){return typeof e=="string"?Cd(t,e):e instanceof mo?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cI(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new $(M.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Pd{}class Md extends Pd{}function dI(t,e,...n){let s=[];e instanceof Pd&&s.push(e),s=s.concat(n),function(r){const o=r.filter(c=>c instanceof Bd).length,l=r.filter(c=>c instanceof Dd).length;if(o>1||o>0&&l>0)throw new $(M.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const i of s)t=i._apply(t);return t}class Dd extends Md{constructor(e,n,s){super(),this._field=e,this._op=n,this._value=s,this.type="where"}static _create(e,n,s){return new Dd(e,n,s)}_apply(e){const n=this._parse(e);return dg(e._query,n),new Ds(e.firestore,e.converter,lc(e._query,n))}_parse(e){const n=go(e.firestore);return function(r,o,l,c,d,h,m){let p;if(d.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new $(M.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){Tf(m,h);const w=[];for(const I of m)w.push(Ef(c,r,I));p={arrayValue:{values:w}}}else p=Ef(c,r,m)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||Tf(m,h),p=oI(l,o,m,h==="in"||h==="not-in");return Ge.create(d,h,p)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}class Bd extends Pd{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new Bd(e,n)}_parse(e){const n=this._queryConstraints.map(s=>s._parse(e)).filter(s=>s.getFilters().length>0);return n.length===1?n[0]:fn.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(i,r){let o=i;const l=r.getFlattenedFilters();for(const c of l)dg(o,c),o=lc(o,c)}(e._query,n),new Ds(e.firestore,e.converter,lc(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Ld extends Md{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new Ld(e,n)}_apply(e){const n=function(i,r,o){if(i.startAt!==null)throw new $(M.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new $(M.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new $r(r,o)}(e._query,this._field,this._direction);return new Ds(e.firestore,e.converter,function(i,r){const o=i.explicitOrderBy.concat([r]);return new Ki(i.path,i.collectionGroup,o,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,n))}}function uI(t,e="asc"){const n=e,s=Rd("orderBy",t);return Ld._create(s,n)}class Nd extends Md{constructor(e,n,s){super(),this.type=e,this._limit=n,this._limitType=s}static _create(e,n,s){return new Nd(e,n,s)}_apply(e){return new Ds(e.firestore,e.converter,_a(e._query,this._limit,this._limitType))}}function hI(t){return ZT("limit",t),Nd._create("limit",t,"F")}function Ef(t,e,n){if(typeof(n=Pe(n))=="string"){if(n==="")throw new $(M.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!am(e)&&n.indexOf("/")!==-1)throw new $(M.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const s=e.path.child(Ae.fromString(n));if(!Y.isDocumentKey(s))throw new $(M.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return qh(t,new Y(s))}if(n instanceof At)return qh(t,n._key);throw new $(M.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Qa(n)}.`)}function Tf(t,e){if(!Array.isArray(t)||t.length===0)throw new $(M.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function dg(t,e){const n=function(i,r){for(const o of i)for(const l of o.getFlattenedFilters())if(r.indexOf(l.op)>=0)return l.op;return null}(t.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new $(M.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new $(M.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class fI{convertValue(e,n="none"){switch(ii(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ve(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(si(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw Q()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const s={};return di(e,(i,r)=>{s[i]=this.convertValue(r,n)}),s}convertVectorValue(e){var n,s,i;const r=(i=(s=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||s===void 0?void 0:s.values)===null||i===void 0?void 0:i.map(o=>Ve(o.doubleValue));return new Id(r)}convertGeoPoint(e){return new Td(Ve(e.latitude),Ve(e.longitude))}convertArray(e,n){return(e.values||[]).map(s=>this.convertValue(s,n))}convertServerTimestamp(e,n){switch(n){case"previous":const s=nd(e);return s==null?null:this.convertValue(s,n);case"estimate":return this.convertTimestamp(Fr(e));default:return null}}convertTimestamp(e){const n=Cs(e);return new Ke(n.seconds,n.nanos)}convertDocumentKey(e,n){const s=Ae.fromString(e);ye(Cm(s));const i=new Vr(s.get(1),s.get(3)),r=new Y(s.popFirst(5));return i.isEqual(n)||es(`Document ${r} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Od(t,e,n){let s;return s=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Er{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ug extends cg{constructor(e,n,s,i,r,o){super(e,n,s,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=r}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new na(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const s=this._document.data.field(Rd("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,n.serverTimestamps)}}}class na extends ug{data(e={}){return super.data(e)}}class pI{constructor(e,n,s,i){this._firestore=e,this._userDataWriter=n,this._snapshot=i,this.metadata=new Er(i.hasPendingWrites,i.fromCache),this.query=s}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(s=>{e.call(n,new na(this._firestore,this._userDataWriter,s.key,s,new Er(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new $(M.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(i,r){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const c=new na(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Er(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>r||l.type!==3).map(l=>{const c=new na(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Er(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let d=-1,h=-1;return l.type!==0&&(d=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),h=o.indexOf(l.doc.key)),{type:mI(l.type),doc:c,oldIndex:d,newIndex:h}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function mI(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Q()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tr(t){t=nn(t,At);const e=nn(t.firestore,Bs);return QT(Xa(e),t._key).then(n=>yI(e,t,n))}class hg extends fI{constructor(e){super(),this.firestore=e}convertBytes(e){return new $i(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new At(this.firestore,null,n)}}function fg(t){t=nn(t,Ds);const e=nn(t.firestore,Bs),n=Xa(e),s=new hg(e);return cI(t._query),JT(n,t._query).then(i=>new pI(e,s,t,i))}function Fd(t,e,n){t=nn(t,At);const s=nn(t.firestore,Bs),i=Od(t.converter,e,n);return vo(s,[xd(go(s),"setDoc",t._key,i,t.converter!==null,n).toMutation(t._key,xt.none())])}function gI(t,e,n,...s){t=nn(t,At);const i=nn(t.firestore,Bs),r=go(i);let o;return o=typeof(e=Pe(e))=="string"||e instanceof mo?rg(r,"updateDoc",t._key,e,n,s):ig(r,"updateDoc",t._key,e),vo(i,[o.toMutation(t._key,xt.exists(!0))])}function tl(t){return vo(nn(t.firestore,Bs),[new Wa(t._key,xt.none())])}function pg(t,e){const n=nn(t.firestore,Bs),s=St(t),i=Od(t.converter,e);return vo(n,[xd(go(t.firestore),"addDoc",s._key,i,t.converter!==null,{}).toMutation(s._key,xt.exists(!1))]).then(()=>s)}function vo(t,e){return function(s,i){const r=new Kn;return s.asyncQueue.enqueueAndForget(async()=>VT(await KT(s),i,r)),r.promise}(Xa(t),e)}function yI(t,e,n){const s=n.docs.get(e._key),i=new hg(t);return new ug(t,i,e._key,s,new Er(n.hasPendingWrites,n.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vI{constructor(e,n){this._firestore=e,this._commitHandler=n,this._mutations=[],this._committed=!1,this._dataReader=go(e)}set(e,n,s){this._verifyNotCommitted();const i=Hl(e,this._firestore),r=Od(i.converter,n,s),o=xd(this._dataReader,"WriteBatch.set",i._key,r,i.converter!==null,s);return this._mutations.push(o.toMutation(i._key,xt.none())),this}update(e,n,s,...i){this._verifyNotCommitted();const r=Hl(e,this._firestore);let o;return o=typeof(n=Pe(n))=="string"||n instanceof mo?rg(this._dataReader,"WriteBatch.update",r._key,n,s,i):ig(this._dataReader,"WriteBatch.update",r._key,n),this._mutations.push(o.toMutation(r._key,xt.exists(!0))),this}delete(e){this._verifyNotCommitted();const n=Hl(e,this._firestore);return this._mutations=this._mutations.concat(new Wa(n._key,xt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new $(M.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Hl(t,e){if((t=Pe(t)).firestore!==e)throw new $(M.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return t}function Vd(){return new Ad("serverTimestamp")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mg(t){return Xa(t=nn(t,Bs)),new vI(t,e=>vo(t,e))}(function(e,n=!0){(function(i){ji=i})(Gi),Di(new Zs("firestore",(s,{instanceIdentifier:i,options:r})=>{const o=s.getProvider("app").getImmediate(),l=new Bs(new y_(s.getProvider("auth-internal")),new __(s.getProvider("app-check-internal")),function(d,h){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new $(M.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Vr(d.options.projectId,h)}(o,i),o);return r=Object.assign({useFetchStreams:n},r),l._setSettings(r),l},"PUBLIC").setMultipleInstances(!0)),Ss(Fh,"4.7.3",e),Ss(Fh,"4.7.3","esm2017")})();const gg={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"};function De(){return gg.apiKey!=="YOUR_API_KEY"}let Wl=null,vt=null,we=null;try{De()?(Wl=rp(gg),vt=f_(Wl),we=tI(Wl)):console.warn("Firebase not configured. Login required to save data.")}catch(t){console.error("Firebase initialization error:",t)}const bI=new qn;let gt=null,Pr=[];function wI(){if(!De()||!vt){console.warn("Firebase not configured - auth disabled");return}ew(vt,t=>{console.log("onAuthStateChanged fired:",t?t.email:"null"),gt=t,console.log("Notifying",Pr.length,"listeners"),Pr.forEach(e=>e(t))})}function yg(t){return console.log("onAuthStateChange: adding listener, currentUser is:",gt&&gt.email),Pr.push(t),gt&&(console.log("onAuthStateChange: immediately calling listener with user"),t(gt)),()=>{Pr=Pr.filter(e=>e!==t)}}function kn(){return gt}function lt(){return gt!==null}async function _I(t,e,n=null){if(!De()||!vt)throw new Error("Firebase not configured");const s=await jb(vt,t,e);n&&s.user&&await Jb(s.user,{displayName:n});try{await Mp(s.user)}catch(i){console.error("Failed to send verification email:",i)}return s}async function EI(){if(!De()||!vt||!gt)throw new Error("Not logged in");return Mp(gt)}async function TI(){return gt?(await gt.reload(),gt=vt.currentUser,gt):null}async function II(t,e){if(!De()||!vt)throw new Error("Firebase not configured");return Kb(vt,t,e)}async function SI(){if(!De()||!vt)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const t=await Ew(vt,bI);return console.log("Google sign-in successful:",t.user.email),t}catch(t){throw console.error("signInWithPopup error:",t.code,t.message),t}}async function zd(){if(!De()||!vt)throw new Error("Firebase not configured");return tw(vt)}async function xI(t){if(!De()||!vt)throw new Error("Firebase not configured");return Yb(vt,t)}async function AI(){if(!De()||!vt||!gt)throw new Error("Not logged in");return nw(gt)}wI();function bi(...t){return t.find(e=>e!==void 0)}function kI(t){if(!t||typeof t!="object")return{scenario:t,migrated:!1};const e=Object.keys(t).filter(c=>c.includes(".")),n="decisionSettings"in t||"stressSettings"in t||"name"in t||"description"in t||"taxYears"in t;if(!(e.length>0||n))return{scenario:t,migrated:!1};const i=t.decisionTool||{},r=t.stressTool||{},o=t.planDetails||{},l={isActive:t.isActive??!1,enabledTools:t.enabledTools||["stress","decision"],planDetails:{name:bi(t["planDetails.name"],o.name,t.name)??"My Plan",description:bi(t["planDetails.description"],o.description,t.description)??""},decisionTool:{settings:bi(t["decisionTool.settings"],i.settings,t.decisionSettings)??{},history:bi(t["decisionTool.history"],i.history)??[],taxYears:bi(t["decisionTool.taxYears"],i.taxYears,t.taxYears)??{}},stressTool:{settings:bi(t["stressTool.settings"],r.settings,t.stressSettings)??{}}};return t.id!==void 0&&(l.id=t.id),t.createdAt!==void 0&&(l.createdAt=t.createdAt),t.lastModified!==void 0&&(l.lastModified=t.lastModified),{scenario:l,migrated:!0}}function $d(t,e="settings"){const n=kn();return!n||!we?null:St(we,"users",n.uid,t,e)}function vg(t){const e=kn();return!e||!we?null:Ed(we,"users",e.uid,t)}async function bg(t){const{scenario:e,migrated:n}=kI(t);if(n){const s=kn();if(s&&we)try{const{id:i,...r}=e;await Fd(St(we,"users",s.uid,"scenarios",i),r)}catch(i){console.error("Scenario migration write failed:",i)}}return e}async function nl(){if(!De())return[];const t=vg("scenarios");if(!t)return[];try{const e=await fg(t),n=[];return e.forEach(s=>{n.push({id:s.id,...s.data()})}),Promise.all(n.map(s=>bg(s)))}catch(e){return console.error("Error loading scenarios:",e),[]}}async function CI(t){if(!De())return null;const e=$d("scenarios",t);if(!e)return null;try{const n=await Tr(e);return n.exists()?bg({id:n.id,...n.data()}):null}catch(n){return console.error("Error loading scenario:",n),null}}async function Ls(t,e){if(!De())return;const n=$d("scenarios",t);if(n)try{await gI(n,{...e,lastModified:new Date().toISOString()})}catch(s){throw console.error("Error saving scenario:",s),s}}async function wg(t){if(!De())return null;const e=vg("scenarios");if(!e)return null;try{return(await pg(e,{...t,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(n){throw console.error("Error creating scenario:",n),n}}async function RI(t){if(!De())return;const e=$d("scenarios",t);if(e)try{await tl(e)}catch(n){throw console.error("Error deleting scenario:",n),n}}async function Ud(t){if(!De())return;const e=kn();if(!(!e||!we))try{const n=await nl(),s=mg(we);for(const i of n){const r=St(we,"users",e.uid,"scenarios",i.id);i.id===t?s.update(r,{isActive:!0}):i.isActive&&s.update(r,{isActive:!1})}await s.commit()}catch(n){throw console.error("Error setting active scenario:",n),n}}async function _g(){if(!De())return;const t=kn();if(!(!t||!we))try{const e=await nl(),n=mg(we);for(const s of e)n.delete(St(we,"users",t.uid,"scenarios",s.id));n.delete(St(we,"users",t.uid,"profile","settings")),await n.commit(),console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function Eg(){return De()?(await nl()).length>0:!1}const Tg={single:{minimum:14400,moderate:31300,comfortable:43100}},vc={essential:[{label:"Rent / mortgage",period:"mo",hint:"Your regular housing payment"},{label:"Council tax",period:"mo",hint:""},{label:"Gas",period:"mo",hint:""},{label:"Electricity",period:"mo",hint:""},{label:"Water",period:"mo",hint:""},{label:"Broadband",period:"mo",hint:"Broadband tariff"},{label:"Mobile phones",period:"mo",hint:"Mobile phone tariffs"},{label:"TV licence",period:"yr",hint:""},{label:"Groceries & household",period:"mo",hint:"Food and everyday household items"},{label:"Home insurance",period:"yr",hint:"Buildings & contents"},{label:"Car insurance",period:"yr",hint:""},{label:"Car tax",period:"yr",hint:"DVLA vehicle tax"},{label:"Petrol / fuel",period:"mo",hint:""},{label:"Car servicing & maintenance",period:"yr",hint:"Servicing, MOT, repairs — a big replacement is a One-off cost"},{label:"Boiler service",period:"yr",hint:""},{label:"Personal health",period:"mo",hint:"Prescriptions, dental, optical, health cover"},{label:"Kids / dependents",period:"mo",hint:"Supporting children or other dependents"},{label:"Premier banking / account fees",period:"mo",hint:"Packaged or premier account fees"},{label:"Home upkeep",period:"mo",hint:"Routine maintenance & small repairs — big jobs go in One-off costs"}],discretionary:[{label:"Main holiday",period:"yr",hint:"Your big annual holiday"},{label:"UK breaks",period:"yr",hint:"Weekends & short breaks"},{label:"Day trips",period:"mo",hint:""},{label:"Eating out & takeaways",period:"mo",hint:""},{label:"Streaming & entertainment",period:"mo",hint:"Netflix, Amazon Prime, etc."},{label:"Digital subscriptions",period:"mo",hint:"Cloud storage, AI tools, credit-file, TradingView, broker subscriptions"},{label:"Gym & fitness",period:"mo",hint:"Membership & classes"},{label:"Sports & equipment",period:"yr",hint:"Kit and gear"},{label:"Clothes",period:"mo",hint:"Everyday clothing"},{label:"Sports clothes",period:"yr",hint:""},{label:"Hobbies & leisure",period:"mo",hint:""},{label:"Gifts & family",period:"mo",hint:"Presents, helping family"},{label:"Charity",period:"mo",hint:""},{label:"Pets",period:"mo",hint:"Food, insurance, vet (pet health)"},{label:"Personal spending money",period:"mo",hint:"Day-to-day 'spends'"},{label:"Home furnishings & décor",period:"yr",hint:"Soft furnishings, decorating, furniture refresh"},{label:"Home technology",period:"yr",hint:"Phones, laptops, gadgets"},{label:"Emergency buffer",period:"mo",hint:"A monthly set-aside for the unexpected"}]},PI=[{label:"Eating out & takeaways",tier:"discretionary",period:"mo",hint:"Meals out, takeaways, coffees"},{label:"Life insurance / income protection",tier:"essential",period:"mo",hint:"Protection premiums"},{label:"Health / dental insurance",tier:"essential",period:"mo",hint:"Private medical, dental plan, cash plan"},{label:"Dental & optical",tier:"essential",period:"yr",hint:"Check-ups, glasses, treatment not on the NHS"},{label:"Hearing",tier:"essential",period:"yr",hint:"Hearing tests & aids"},{label:"Breakdown cover",tier:"essential",period:"yr",hint:"AA / RAC vehicle breakdown"},{label:"Parking & permits",tier:"essential",period:"yr",hint:"Residents permit, ULEZ / congestion"},{label:"Public transport",tier:"essential",period:"mo",hint:"Bus, rail, rail card"},{label:"Cleaner / gardener",tier:"essential",period:"mo",hint:"Cleaner, window cleaner, gardener"},{label:"Long-term care set-aside",tier:"essential",period:"mo",hint:"A monthly reserve toward possible later-life care (easily forgotten)"},{label:"Christmas & birthdays",tier:"discretionary",period:"yr",hint:"Seasonal gifts & celebrations"},{label:"Alcohol",tier:"discretionary",period:"mo",hint:"Beer, wine, spirits"},{label:"Hairdressing & grooming",tier:"discretionary",period:"mo",hint:"Haircuts, beauty, barber"},{label:"Newspapers, books & media",tier:"discretionary",period:"mo",hint:"Papers, magazines, books"},{label:"Grandchildren",tier:"discretionary",period:"mo",hint:"Treats, days out, help with costs"},{label:"Professional memberships",tier:"discretionary",period:"yr",hint:"Institutes, unions, clubs"},{label:"Second / holiday home",tier:"discretionary",period:"mo",hint:"Running costs of a second property"},{label:"Storage / lock-up",tier:"discretionary",period:"mo",hint:"Self-storage, garage rental"},{label:"My personal spending",tier:"discretionary",period:"mo",hint:"Your own day-to-day 'spends'",paidBy:"me"},{label:"Partner's personal spending",tier:"discretionary",period:"mo",hint:"Your partner's day-to-day 'spends'",paidBy:"partner"}];function Wr(t){const e=new Set((t.lines||[]).map(r=>(r.label||"").trim().toLowerCase()).filter(Boolean)),n=[...vc.essential.map(r=>({...r,tier:"essential"})),...vc.discretionary.map(r=>({...r,tier:"discretionary"}))],s=new Set,i=[];for(const r of[...PI,...n]){const o=r.label.trim().toLowerCase();e.has(o)||s.has(o)||(s.add(o),i.push(r))}return i}const MI=[{label:"New car",tier:"essential",hint:"Replacement vehicle",everyYears:8},{label:"Redecorating",tier:"essential",hint:"Whole-house repaint — a 4-bed runs ~£2,000–3,500 professionally, ~£300–600 DIY",everyYears:7},{label:"Major home work",tier:"essential",hint:"Kitchen, bathroom, roof, windows",everyYears:null},{label:"White goods",tier:"essential",hint:"Fridge, washer, cooker",everyYears:10}],DI={"Council tax":{minimum:{s:95,c:150},moderate:{s:115,c:170},comfortable:{s:125,c:185}},Gas:{minimum:{s:45,c:60},moderate:{s:58,c:75},comfortable:{s:68,c:90}},Electricity:{minimum:{s:55,c:70},moderate:{s:68,c:85},comfortable:{s:80,c:100}},Water:{minimum:{s:28,c:38},moderate:{s:33,c:44},comfortable:{s:38,c:50}},Broadband:{minimum:{s:27,c:27},moderate:{s:32,c:32},comfortable:{s:38,c:38}},"Mobile phones":{minimum:{s:8,c:16},moderate:{s:14,c:28},comfortable:{s:20,c:40}},"TV licence":{minimum:{s:15,c:15},moderate:{s:15,c:15},comfortable:{s:15,c:15}},"Groceries & household":{minimum:{s:230,c:350},moderate:{s:300,c:470},comfortable:{s:360,c:580}},"Home insurance":{minimum:{s:16,c:22},moderate:{s:22,c:30},comfortable:{s:28,c:38}},"Car insurance":{minimum:{s:0,c:0},moderate:{s:38,c:50},comfortable:{s:48,c:80}},"Car tax":{minimum:{s:0,c:0},moderate:{s:16,c:16},comfortable:{s:16,c:32}},"Petrol / fuel":{minimum:{s:0,c:0},moderate:{s:95,c:130},comfortable:{s:115,c:190}},"Car servicing & maintenance":{minimum:{s:0,c:0},moderate:{s:48,c:65},comfortable:{s:65,c:105}},"Boiler service":{minimum:{s:9,c:9},moderate:{s:11,c:11},comfortable:{s:13,c:13}},"Personal health":{minimum:{s:15,c:25},moderate:{s:32,c:55},comfortable:{s:58,c:95}},"Home upkeep":{minimum:{s:30,c:42},moderate:{s:52,c:75},comfortable:{s:85,c:120}},"Main holiday":{minimum:{s:42,c:65},moderate:{s:130,c:200},comfortable:{s:220,c:350}},"UK breaks":{minimum:{s:0,c:0},moderate:{s:38,c:60},comfortable:{s:75,c:115}},"Day trips":{minimum:{s:15,c:25},moderate:{s:32,c:48},comfortable:{s:52,c:80}},"Eating out & takeaways":{minimum:{s:42,c:70},moderate:{s:100,c:170},comfortable:{s:170,c:285}},"Streaming & entertainment":{minimum:{s:12,c:12},moderate:{s:26,c:32},comfortable:{s:42,c:48}},"Digital subscriptions":{minimum:{s:5,c:8},moderate:{s:13,c:20},comfortable:{s:26,c:38}},"Gym & fitness":{minimum:{s:15,c:26},moderate:{s:32,c:55},comfortable:{s:48,c:85}},"Sports & equipment":{minimum:{s:5,c:8},moderate:{s:13,c:22},comfortable:{s:26,c:42}},Clothes:{minimum:{s:48,c:80},moderate:{s:65,c:115},comfortable:{s:105,c:190}},"Sports clothes":{minimum:{s:3,c:5},moderate:{s:8,c:13},comfortable:{s:13,c:22}},"Hobbies & leisure":{minimum:{s:16,c:26},moderate:{s:37,c:58},comfortable:{s:62,c:100}},"Gifts & family":{minimum:{s:22,c:32},moderate:{s:58,c:90},comfortable:{s:95,c:150}},Charity:{minimum:{s:5,c:10},moderate:{s:16,c:27},comfortable:{s:32,c:55}},Pets:{minimum:{s:32,c:32},moderate:{s:42,c:42},comfortable:{s:58,c:58}},"Personal spending money":{minimum:{s:26,c:48},moderate:{s:52,c:95},comfortable:{s:95,c:170}},"Home furnishings & décor":{minimum:{s:16,c:26},moderate:{s:37,c:58},comfortable:{s:68,c:105}},"Home technology":{minimum:{s:10,c:16},moderate:{s:26,c:37},comfortable:{s:48,c:68}},Alcohol:{minimum:{s:16,c:42},moderate:{s:32,c:80},comfortable:{s:52,c:115}},"Hairdressing & grooming":{minimum:{s:13,c:19},moderate:{s:26,c:42},comfortable:{s:48,c:80}},"Newspapers, books & media":{minimum:{s:8,c:13},moderate:{s:19,c:30},comfortable:{s:32,c:48}},"Life insurance / income protection":{minimum:{s:20,c:24},moderate:{s:20,c:24},comfortable:{s:20,c:24}},"Health / dental insurance":{minimum:{s:0,c:0},moderate:{s:16,c:27},comfortable:{s:42,c:75}},"Dental & optical":{minimum:{s:10,c:16},moderate:{s:19,c:32},comfortable:{s:32,c:55}},"Public transport":{minimum:{s:42,c:75},moderate:{s:26,c:48},comfortable:{s:26,c:48}},"Christmas & birthdays":{minimum:{s:22,c:37},moderate:{s:48,c:75},comfortable:{s:85,c:125}},"My personal spending":{minimum:{s:26,c:26},moderate:{s:48,c:48},comfortable:{s:85,c:85}},"Partner's personal spending":{minimum:{s:0,c:26},moderate:{s:0,c:48},comfortable:{s:0,c:85}}},Ig=Object.freeze({minimum:"PLSA Minimum",moderate:"PLSA Moderate",comfortable:"PLSA Comfortable"});let Sg=null;function BI(t){Sg=t||null}function bo(t){const e=t&&t.plsaTier;return e==="minimum"||e==="comfortable"?e:"moderate"}function Xi(t,e){const s=(Sg||DI)[(t||"").trim()];if(!s)return null;const i=s[bo(e)];return i?e&&e.sharedWithPartner?i.c:i.s:null}function xg(){const t=e=>vc[e].map(n=>({label:n.label,tier:e,annual:null,fromAge:null,toAge:null,hint:n.hint,period:n.period||"yr"}));return[...t("essential"),...t("discretionary")]}function Ag(){return MI.map(t=>({label:t.label,tier:t.tier,hint:t.hint,amount:null,atAge:null,everyYears:t.everyYears}))}const sa={pa:12570,brl:50270,hrl:125140},Ze=t=>Number.isFinite(+t)?+t:0;function LI(t,e){const n=t.fromAge??e.retirementAge,s=t.toAge??e.endAge;return{from:Ze(n),to:Ze(s)}}function kg(t,e,n){const{from:s,to:i}=LI(t,e);return n>=s&&n<=i}function bc(t,e,n="all"){return(t.lines||[]).filter(s=>n==="all"||s.tier===n).filter(s=>kg(s,t,e)).reduce((s,i)=>s+Ze(i.annual),0)}function qd(t,e){if(!e||!e.sharedWithPartner)return 1;const n=t&&t.paidBy||"me";if(n==="partner")return 0;if(n==="shared"){const s=t&&t.mySharePct,i=s!=null&&s!==""&&Number.isFinite(+s)?+s:Number.isFinite(+e.mySharePct)?+e.mySharePct:50;return Math.max(0,Math.min(1,i/100))}return 1}function wc(t,e,n="all"){return(t.lines||[]).filter(s=>n==="all"||s.tier===n).filter(s=>kg(s,t,e)).reduce((s,i)=>s+Ze(i.annual)*qd(i,t),0)}function NI(t){return bc(t,Ze(t.retirementAge),"all")}function OI(t,e=t.currentAge,n=t.endAge){const s=[];for(const i of t.oneOffs||[]){const r=Ze(i.amount);if(r===0)continue;const o=Ze(i.everyYears);let l=Ze(i.atAge);if(o>0)for(;l<=n;l+=o)l>=e&&s.push({age:l,label:i.label,tier:i.tier,amount:r});else l>=e&&l<=n&&s.push({age:l,label:i.label,tier:i.tier,amount:r})}return s.sort((i,r)=>i.age-r.age)}function Gr(t,e=sa){const n=Ze(t),{pa:s,brl:i,hrl:r}=e;if(n<=s)return n;const o=i-.2*(i-s);if(n<=o)return s+(n-s)/.8;const l=o+.6*(r-i);return n<=l?i+(n-o)/.6:r+(n-l)/.55}function If(t,e=!1){return(t.oneOffs||[]).reduce((n,s)=>{const i=Ze(s.amount),r=Ze(s.everyYears);return r>0&&i?n+i/r*(e?qd(s,t):1):n},0)}function FI(t,e){const n=Ze(t.retirementAge),s=OI(t,n,n+e),i=[];for(let r=0;r<=e;r++){const o=n+r;let l=wc(t,o,"all");for(const c of s)if(c.age===o){const d=(t.oneOffs||[]).find(h=>h.label===c.label)||{};l+=c.amount*qd(d,t)}i.push(l)}return i}function Zi(t){const e=Ze(t.retirementAge),n=wc(t,e,"essential"),s=wc(t,e,"all"),i=If(t,!0),r=s+i,o=NI(t)+If(t,!1),l=Math.max(0,o-r);return{partnerAllInAnnual:l,partnerAllInMonthly:l/12,essentialAnnualNet:n,comfortableAnnualNet:s,essentialMonthlyNet:n/12,comfortableMonthlyNet:s/12,periodicAnnualAverage:i,periodicMonthlyAverage:i/12,allInComfortableAnnual:r,allInComfortableMonthly:r/12,householdComfortableAnnual:o,householdComfortableMonthly:o/12,sharedWithPartner:!!t.sharedWithPartner,suggestedGrossAnnual:Gr(r)}}function sl(t){if(t==null)return null;const e=String(t).trim().replace(/^=/,"").replace(/[×x]/gi,"*").replace(/,/g,"");if(!e||!/^[\d+\-*/().\s]+$/.test(e)||!/\d/.test(e))return null;try{const n=Function('"use strict"; return ('+e+");")();return Number.isFinite(n)?Math.round(n*100)/100:null}catch{return null}}function Cg(t){return(t||[]).reduce((e,n)=>{const s=Ze(n&&n.amount);return s?e+((n.period||"yr")==="mo"?s*12:s):e},0)}function Rg(t,e,n){const s=Xi(t,n),i=Ze(e);if(s==null||s<=0||i<=0)return null;const r=s*12;return i<=r*.35?"low":i>=r*3?"high":null}function Yr(t=45,e=60,n=100){return{version:1,currentAge:Ze(t),retirementAge:Ze(e),endAge:Ze(n),sharedWithPartner:!1,mySharePct:50,plsaTier:"moderate",lines:[],oneOffs:[]}}let Ci=null,Ce=null;function Ns(){return De()&&lt()}function Cn(){Ci=null,Ce=null}function Hd(){return{equityMin:pe.EQUITY_MIN,bondMin:pe.BOND_MIN,cashTarget:pe.CASH_TARGET,duration:pe.DURATION_YEARS,baseSalary:pe.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Es.PROTECTION_MULTIPLIER,consecutiveLimit:pe.CONSECUTIVE_LIMIT,disableProtection:!1,recoveryBuffer:pe.RECOVERY_BUFFER,hodlEnabled:Es.HODL_ENABLED,hodlValue:Es.HODL_VALUE,isaBalance:0,isaReturn:Lt.RETURN,isaMin:Lt.MIN,isaDrawdownStrategy:Lt.DRAWDOWN_STRATEGY}}function Wd(){return{equityMin:pe.EQUITY_MIN,bondMin:pe.BOND_MIN,cashTarget:pe.CASH_TARGET,duration:pe.DURATION_YEARS,baseSalary:pe.BASE_SALARY,protectionFactor:pe.PROTECTION_FACTOR,recoveryBuffer:pe.RECOVERY_BUFFER,consecutiveLimit:pe.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0,isaBalance:0,isaReturn:Lt.RETURN,isaMin:Lt.MIN,isaDrawdownStrategy:Lt.DRAWDOWN_STRATEGY}}function VI(t,e={},n=new Date().toISOString()){const s=t||{};return{...Hd(),...e,equityMin:s.equityMin,bondMin:s.bondMin,cashTarget:s.cashTarget,duration:s.duration,baseSalary:s.baseSalary,spStartDate:s.spStartDate??e.spStartDate??null,spWeeklyAmount:s.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:s.consecutiveLimit,recoveryBuffer:s.recoveryBuffer,disableProtection:s.disableProtection??e.disableProtection??!1,protectionMult:s.protectionFactor!=null?1-s.protectionFactor/100:e.protectionMult??Es.PROTECTION_MULTIPLIER,isaBalance:s.isaBalance??0,isaReturn:s.isaReturn??Lt.RETURN,isaMin:s.isaMin??Lt.MIN,isaDrawdownStrategy:s.isaDrawdownStrategy??Lt.DRAWDOWN_STRATEGY,taggedFunds:(s.taggedFunds||[]).map(i=>({...i})),allocMode:s.allocMode??e.allocMode,subAsset:s.subAsset??null,diversifierStart:s.diversifierStart??0,glideEndgame:s.glideEndgame??null,equityGlideEnabled:s.equityGlideEnabled??!1,spendingProfile:s.spendingProfile??e.spendingProfile??"flat",accessMethod:s.accessMethod??e.accessMethod??"drawdown",ufplsYears:s.ufplsYears??e.ufplsYears??null,ufplsThenPcls:s.ufplsThenPcls??e.ufplsThenPcls??!1,bandFillRecycle:s.bandFillRecycle??e.bandFillRecycle??!1,seededFrom:"decision",seededAt:n,decisionChecksum:La(s)}}function zI(t,e={}){const n=t||{};return{...Wd(),...e,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,duration:n.duration,baseSalary:n.baseSalary,spStartDate:n.spStartDate??e.spStartDate??null,spWeeklyAmount:n.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:n.consecutiveLimit??e.consecutiveLimit,recoveryBuffer:n.recoveryBuffer??e.recoveryBuffer,disableProtection:n.disableProtection??e.disableProtection??!1,protectionFactor:n.protectionMult!=null?Math.round((1-n.protectionMult)*100):e.protectionFactor,isaBalance:n.isaBalance??0,isaReturn:n.isaReturn??Lt.RETURN,isaMin:n.isaMin??Lt.MIN,isaDrawdownStrategy:n.isaDrawdownStrategy??Lt.DRAWDOWN_STRATEGY,taggedFunds:(n.taggedFunds||[]).map(s=>({...s})),allocMode:n.allocMode??e.allocMode,subAsset:n.subAsset??null,diversifierStart:n.diversifierStart??0,glideEndgame:n.glideEndgame??null,equityGlideEnabled:n.equityGlideEnabled??!1,spendingProfile:n.spendingProfile??e.spendingProfile??"flat",accessMethod:n.accessMethod??e.accessMethod??"drawdown",ufplsYears:n.ufplsYears??e.ufplsYears??null,ufplsThenPcls:n.ufplsThenPcls??e.ufplsThenPcls??!1,bandFillRecycle:n.bandFillRecycle??e.bandFillRecycle??!1,configured:!0,seededFrom:"stress"}}function Pg(){return{}}function Mg(){return Yr()}function $I(t="My Plan",e="",n=["stress","decision"]){return{planDetails:{name:t,description:e},enabledTools:n,isActive:!0,decisionTool:{settings:Wd(),history:[],taxYears:Pg()},stressTool:{settings:Hd()},budgetTool:{settings:Mg()}}}async function Gd(){if(Ci)return Ci;if(!Ns())return[];try{const t=await nl();return Ci=t,t}catch(t){return console.error("Error listing scenarios:",t),[]}}async function jt(){if(Ce)return Ce;if(!Ns())return null;try{const e=(await Gd()).find(n=>n.isActive);return e?(Ce=e,e):null}catch(t){return console.error("Error getting active scenario:",t),null}}async function UI(t,e,n,s={},i=!0){if(!Ns())throw new Error("Must be logged in to create scenarios");const r=$I(t,e,n);if(s.stressSettings&&(r.stressTool.settings={...r.stressTool.settings,...s.stressSettings}),s.decisionSettings&&(r.decisionTool.settings={...r.decisionTool.settings,...s.decisionSettings}),s.taxYears&&(r.decisionTool.taxYears=s.taxYears),r.isActive=i,i&&Ci){const l=Ci.find(c=>c.isActive);l&&(await Ud(null),await Ls(l.id,{isActive:!1}))}const o=await wg(r);return Cn(),o}async function qI(t){if(!Ns())throw new Error("Must be logged in to switch scenarios");await Ud(t),Cn()}async function HI(t,e){if(!Ns())throw new Error("Must be logged in to duplicate scenarios");const n=await CI(t);if(!n)throw new Error("Source scenario not found");const{id:s,createdAt:i,lastModified:r,...o}=n;o.planDetails={...o.planDetails,name:e},o.isActive=!1;const l=await wg(o);return Cn(),l}async function WI(t,e){if(!Ns())throw new Error("Must be logged in to rename scenarios");await Ls(t,{"planDetails.name":e}),Cn()}async function GI(t,e){if(!Ns())throw new Error("Must be logged in to update scenarios");await Ls(t,{enabledTools:e}),Cn()}async function YI(t){if(!Ns())throw new Error("Must be logged in to delete scenarios");const e=await Gd();if(e.length<=1)throw new Error("Cannot delete the last scenario");const n=e.find(s=>s.id===t);if(n!=null&&n.isActive){const s=e.find(i=>i.id!==t);s&&await Ud(s.id)}await RI(t),Cn()}async function jI(){var e;const t=await jt();return((e=t==null?void 0:t.stressTool)==null?void 0:e.settings)||Hd()}async function Dg(t){const e=await jt();if(!e)throw new Error("No active scenario");await Ls(e.id,{"stressTool.settings":t}),Ce&&(Ce.stressTool||(Ce.stressTool={}),Ce.stressTool.settings=t)}async function KI(){var e;const t=await jt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.settings)||Wd()}async function QI(t){const e=await jt();if(!e)throw new Error("No active scenario");await Ls(e.id,{"decisionTool.settings":t}),Ce&&(Ce.decisionTool||(Ce.decisionTool={}),Ce.decisionTool.settings=t)}async function JI(){var e;const t=await jt();return((e=t==null?void 0:t.budgetTool)==null?void 0:e.settings)||Mg()}async function XI(t){const e=await jt();if(!e)throw new Error("No active scenario");await Ls(e.id,{"budgetTool.settings":t}),Ce&&(Ce.budgetTool||(Ce.budgetTool={}),Ce.budgetTool.settings=t)}async function ZI(){var e;const t=await jt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.taxYears)||Pg()}async function eS(t){const e=await jt();if(!e)throw new Error("No active scenario");await Ls(e.id,{"decisionTool.taxYears":t}),Ce&&(Ce.decisionTool||(Ce.decisionTool={}),Ce.decisionTool.taxYears=t)}async function tS(){var e;const t=await jt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.history)||[]}async function Bg(t){const e=await jt();if(!e)throw new Error("No active scenario");await Ls(e.id,{"decisionTool.history":t}),Ce&&(Ce.decisionTool||(Ce.decisionTool={}),Ce.decisionTool.history=t)}async function Lg(){const t=await jt();return(t==null?void 0:t.enabledTools)||["stress","decision"]}let As=null;function ia(){return{settings:{equityMin:pe.EQUITY_MIN,bondMin:pe.BOND_MIN,cashTarget:pe.CASH_TARGET,duration:pe.DURATION_YEARS,equityGlideEnabled:!1,locked:!1,baseSalary:pe.BASE_SALARY,spendingProfile:"flat",protectionFactor:pe.PROTECTION_FACTOR,recoveryBuffer:pe.RECOVERY_BUFFER,consecutiveLimit:pe.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function il(){return De()&&lt()}function Ps(){As=null}function Ng(){return As||ia()}async function Rn(){if(As)return As;if(!il())return console.warn("Firebase not available - returning defaults"),ia();try{const[t,e,n]=await Promise.all([KI(),ZI(),tS()]),s={settings:t||ia().settings,taxYears:e||{},history:n||[],lastModified:new Date().toISOString(),checksum:null};return s.checksum=Og(s),As=s,s}catch(t){console.error("Error loading decision data:",t)}return ia()}async function rl(t){if(!il())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=Og(t),await Promise.all([QI(t.settings),eS(t.taxYears)]),As=t}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function Og(t){const e={settings:t.settings,taxYears:t.taxYears,historyCount:t.history.length,lastHistoryDate:t.history.length>0?t.history[t.history.length-1].date:null};return La(e)}function Fg(t){if(!t)return"";const{locked:e,...n}=t;return La(n)}async function bt(){return(await Rn()).settings}async function ri(t){const e=await Rn();e.settings={...e.settings,...t},await rl(e)}function Yd(){return{pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,cpi:Ba,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function nS(t){const n=Ng().taxYears[t];return n||Yd()}async function ol(t){const n=(await Rn()).taxYears[t];return n||Yd()}async function hi(t,e){console.log(`saveTaxYearConfig: Saving tax year ${t}`,e);const n=await Rn();n.taxYears[t]={...nS(t),...e},await rl(n),console.log(`saveTaxYearConfig: Saved tax year ${t}, yearSetupComplete=${n.taxYears[t].yearSetupComplete}`)}async function sS(t){const e=As||await Rn(),n=(e.history||[]).filter(i=>i.taxYear===t),s=n.reduce((i,r)=>i+(r.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${t}, found ${n.length} records, total ISA used: ${s}`),console.log("recalculateIsaSavingsUsed: History records:",n.map(i=>({date:i.date,isa:i.isa}))),e.taxYears[t]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${t}, creating default`),e.taxYears[t]=Yd()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),e.taxYears[t].isaSavingsUsed=s,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),await rl(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),s}async function iS(t){const e=await ol(t),n=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${t}, yearSetupComplete=${e.yearSetupComplete}, result=${n}`),n}async function cs(){return(await Rn()).taxYears}function rS(t={}){let n=[...Ng().history];return t.taxYear&&(n=n.filter(s=>s.taxYear===t.taxYear)),t.startDate&&(n=n.filter(s=>s.date>=t.startDate)),t.endDate&&(n=n.filter(s=>s.date<=t.endDate)),t.sortDesc?n.sort((s,i)=>i.date.localeCompare(s.date)):n.sort((s,i)=>s.date.localeCompare(i.date)),t.limit&&(n=n.slice(0,t.limit)),n}async function fi(t={}){return await Rn(),rS(t)}async function oS(t){if(!il())throw new Error("Must be logged in to save history");const e=await Rn(),n=e.history.findIndex(s=>s.date===t.date);n>=0?e.history[n]=t:e.history.push(t),e.history.sort((s,i)=>s.date.localeCompare(i.date)),await Bg(e.history)}async function Vg(t){if(!il())throw new Error("Must be logged in to delete history");const e=await Rn();e.history=e.history.filter(n=>n.date!==t),await Bg(e.history)}async function jd(t){const e=await bt(),n=await cs(),s=e.spStartDate,i=e.spWeeklyAmount||0;if(!s||!i){let h=null;if(s){const{formatStatePensionDate:m}=await oh(async()=>{const{formatStatePensionDate:p}=await Promise.resolve().then(()=>Mf);return{formatStatePensionDate:p}},void 0,import.meta.url);h=m(s)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:h}}const{calculateStatePensionForTaxYear:r,getTimeUntilStatePension:o,parseStatePensionDate:l}=await oh(async()=>{const{calculateStatePensionForTaxYear:h,getTimeUntilStatePension:m,parseStatePensionDate:p}=await Promise.resolve().then(()=>Mf);return{calculateStatePensionForTaxYear:h,getTimeUntilStatePension:m,parseStatePensionDate:p}},void 0,import.meta.url),c=r({taxYear:t,spStartDate:s,weeklyAmount:i,taxYearConfigs:n}),d=o(s);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function aS(t){const e=dv(t);e.stdSipp=t.stdSipp||t.sippDraw;try{const n=await bt();e.settingsChecksum=Fg(n)}catch(n){console.warn("Could not stamp settings checksum on decision:",n)}await oS(e),t.taxYear&&await sS(t.taxYear)}const Sf={55:{m:[84,91,96],f:[87,93,97]},60:{m:[85,91,96],f:[87,93,97]},65:{m:[85,92,96],f:[88,93,98]},70:{m:[86,92,96],f:[88,94,98]},75:{m:[87,92,97],f:[89,94,98]}},lS={50:0,25:1,10:2};function cS(t,e="m",n=10){const s=lS[n]??2,i=e==="f"?"f":"m",r=Math.max(55,Math.min(75,t||65)),o=Math.floor(r/5)*5,l=Math.min(75,o+5),c=Sf[o][i][s],d=Sf[l][i][s],h=l===o?0:(r-o)/(l-o);return Math.round(c+(d-c)*h)}function Qn(t,e,n,s,i){if(i){const r=Math.max(0,1-e/n);return t*s*r}return t*s}const ns={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,cash:.25},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.4,cash:.1},adventurous:{key:"adventurous",label:"Adventurous",equity:.7,bond:.25,cash:.05}};function al(t,e,n){if(!t)return null;const s=Math.max(5,n-20),i=Math.min(1,e/s);return t.start+(t.end-t.start)*i}function wo(t,e,n=.22){const s=t+e;if(s<=0)return{start:0,end:0};const i=t/s;return{start:Math.max(0,i-n),end:i}}const dS=.12;function zg(t,e,n=null,s=dS){const i=t+e;if(i<=0)return{start:0,end:0};const r=t/i;let o;return n&&n.equityPct+n.bondPct>0?o=n.equityPct/(n.equityPct+n.bondPct):o=Math.min(1,r+s),{start:r,end:o}}function $g(t){const e=!!(t.subAsset&&t.subAsset.bondWeights&&Object.keys(t.subAsset.bondWeights).length>0),n=t.glideEndgame&&t.glideEndgame.equityPct+t.glideEndgame.bondPct>0?t.glideEndgame:null;return e?zg(t.equityMin,t.bondMin,n):wo(t.equityMin,t.bondMin)}function _c(t,e,n){const s=t.cash,i=Math.max(0,1-s),r=al(t.equityGlide,e,n);return r==null?{equity:t.equity,bond:t.bond,cash:s}:{equity:i*r,bond:i*(1-r),cash:s}}function uS(t,e,n){const s=Qn(t.equityMin,e,t.duration,n,!0),i=Qn(t.bondMin,e,t.duration,n,!0),r=Qn(t.cashTarget,e,t.duration,n,!1);return{equity:s,bond:i,cash:r,totalGrowth:s+i,total:s+i+r}}function hS(t,e=Kf.ASSUMED_CPI){const n=[],s=t.equityGlideEnabled?wo(t.equityMin,t.bondMin):null;for(let i=0;i<=t.duration;i++){const r=Math.pow(1+e,i),o=uS(t,i,r);let l=o.equity,c=o.bond;if(s){const d=al(s,i,t.duration),h=l+c;l=h*d,c=h*(1-d)}n.push({year:i,cumulativeInflation:r,equityMin:l,bondMin:c,cashTarget:o.cash,totalMin:l+c+o.cash})}return n}function ra(t,e,n,s=Xe.HIGHER_RATE_LIMIT){if(t<=0)return 0;let i=e;if(t>Xe.PA_TAPER_THRESHOLD){const h=(t-Xe.PA_TAPER_THRESHOLD)*Xe.PA_TAPER_RATE;i=Math.max(0,e-h)}const r=Math.max(0,t-i),o=Math.max(0,n-i),l=s-n;let c=0;const d=Math.min(r,o);if(c+=d*Xe.BASIC_RATE,r>o){const h=Math.min(r-o,l);c+=h*Xe.HIGHER_RATE}if(r>o+l){const h=r-o-l;c+=h*Xe.ADDITIONAL_RATE}return c}function Wt(t,e,n,s=Xe.HIGHER_RATE_LIMIT){return t-ra(t,e,n,s)}function fS(t,e,n,s=Xe.HIGHER_RATE_LIMIT){if(t<=0)return 0;let i=t,r=t+1;for(;Wt(r,e,n,s)<t&&r<1e12;)r*=2;for(let o=0;o<60;o++){const l=(i+r)/2;Wt(l,e,n,s)<t?i=l:r=l}return(i+r)/2}const Gl={TAX_EFFICIENT:"minimiseEarlyTax",LONGEVITY:"maximiseLongevity"};function pS(t,e){return t<=0?t:t*Math.pow(1+e,1/12)}function Aa({targetGross:t,fixedIncome:e=0,pa:n,brl:s,hrl:i,isaBalance:r=0,strategy:o=Gl.TAX_EFFICIENT,yearsUntilSp:l=0,taxFreeFraction:c=0}){const d=Math.max(0,Math.min(.75,c||0));if(d===0){const E=Wt(t,n,s,i),x=Math.max(0,Math.min(s,t)-e),y=Wt(x+e,n,s,i),te=Math.max(0,E-y),re=o===Gl.LONGEVITY&&l>0?r/l:1/0,q=Math.max(0,Math.min(te,Math.max(0,r),re)),ne=r-q,se=te-q;let oe=x;if(se>0){const ie=fS(y+se,n,s,i);oe=Math.max(x,ie-e)}const ve=oe+e,Te=Wt(ve,n,s,i);return{sippGross:oe,isaDraw:q,remainingIsa:ne,taxable:ve,tax:ve-Te,net:Te+q,taxFree:0}}const h=Wt(t,n,s,i),m=Wt(e,n,s,i),p=E=>E*d/(1-d)+Wt(e+E,n,s,i)-m,w=E=>{if(E<=0)return 0;let x=0,y=Math.max(1e3,E*(1-d)*1.5);for(;p(y)<E&&y<1e12;)y*=2;for(let te=0;te<80;te++){const re=(x+y)/2;p(re)<E?x=re:y=re}return(x+y)/2},I=Math.max(0,s-e),S=w(Math.max(0,h-m)),A=Math.min(I,S),P=m+p(A),C=Math.max(0,h-P),L=o===Gl.LONGEVITY&&l>0?r/l:1/0,D=Math.max(0,Math.min(C,Math.max(0,r),L)),O=r-D,U=C-D;let T=A;U>0&&(T=w(Math.max(0,h-m-D)));const v=T/(1-d),_=T+e,b=Wt(_,n,s,i);return{sippGross:v,isaDraw:D,remainingIsa:O,taxable:_,tax:_-b,net:b+v*d+D,taxFree:v*d}}const ka={CONSECUTIVE_LIMIT:3,RECOVERY_BUFFER:pe.RECOVERY_BUFFER};function Ug({totalGrowth:t,minGrowth:e,consecCashDraws:n,wasInProtection:s,consecutiveLimit:i=ka.CONSECUTIVE_LIMIT,recoveryBuffer:r=ka.RECOVERY_BUFFER}){let o=!1;return s&&(o=t<=e+r),!o&&t<e&&n+1>=i&&(o=!0),o}const Ri={MAX_FRACTION:.5,MIN_BOOST:50,SURPLUS_BUFFER:15e3};function oa({shortfall:t,standardMonthly:e,remainingMonths:n,surplus:s,brlHeadroom:i=1/0,maxFraction:r=Ri.MAX_FRACTION,minBoost:o=Ri.MIN_BOOST}){if(!(t>0)||!(s>0)||n<1)return 0;const l=[t/n,s/n];if(Number.isFinite(i)){if(i<=0)return 0;l.push(i/n)}l.push(e*r);const c=Math.min(...l);return c>o?c:0}const Kd={ISA_ANNUAL_ALLOWANCE:2e4,MIN_RECYCLE:50};function qg({brlHeadroom:t,remainingMonths:e,isaAllowanceLeft:n,basicRate:s=.2}){if(!(t>0)||!(e>=1)||!(n>0))return{gross:0,net:0};let i=t/e,r=i*(1-s);const o=n/e;return r>o&&(r=o,i=r/(1-s)),r<Kd.MIN_RECYCLE?{gross:0,net:0}:{gross:i,net:r}}const mS=[[{ticker:"ATST",name:"Alliance Trust",subClass:"worldGrowth"},{ticker:"ATT",name:"Allianz Technology Trust",subClass:"worldGrowth"},{ticker:"BGFD",name:"Baillie Gifford Japan Trust",subClass:"worldGrowth"},{ticker:"BNKR",name:"Bankers Investment Trust",subClass:"worldGrowth"},{ticker:"BUT",name:"Brunner Investment Trust",subClass:"worldGrowth"},{ticker:"CLDN",name:"Caledonia Investments",subClass:"worldGrowth"},{ticker:"CSP1",name:"iShares Core S&P 500 (Acc)",subClass:"worldGrowth"},{ticker:"CUKX",name:"iShares Core FTSE 100 (Acc)",subClass:"ukEquityIncome"},{ticker:"EQQQ",name:"Invesco Nasdaq-100",subClass:"worldGrowth"},{ticker:"FCIT",name:"F&C Investment Trust",subClass:"worldGrowth"},{ticker:"FWRA",name:"Invesco FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"FWRG",name:"Invesco FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"GSPX",name:"iShares S&P 500 GBP-Hedged",subClass:"worldGrowth"},{ticker:"HGT",name:"HgCapital Trust",subClass:"worldGrowth"},{ticker:"HMWO",name:"HSBC MSCI World",subClass:"worldGrowth"},{ticker:"HVPE",name:"HarbourVest Global Private Equity",subClass:"worldGrowth"},{ticker:"IBT",name:"International Biotechnology Trust",subClass:"worldGrowth"},{ticker:"IITU",name:"iShares S&P 500 Information Technology",subClass:"worldGrowth"},{ticker:"IMEU",name:"iShares Core MSCI Europe",subClass:"worldGrowth"},{ticker:"INRG",name:"iShares Global Clean Energy",subClass:"worldGrowth"},{ticker:"ISAC",name:"iShares MSCI ACWI (Acc)",subClass:"worldGrowth"},{ticker:"IUHC",name:"iShares S&P 500 Health Care",subClass:"worldGrowth"},{ticker:"IUSA",name:"iShares Core S&P 500 (Dist)",subClass:"worldGrowth"},{ticker:"IWDA",name:"iShares Core MSCI World (Acc, USD line)",subClass:"worldGrowth"},{ticker:"IWDG",name:"iShares Core MSCI World GBP-Hedged",subClass:"worldGrowth"},{ticker:"IJPN",name:"iShares MSCI Japan",subClass:"worldGrowth"},{ticker:"JAM",name:"JPMorgan American Investment Trust",subClass:"worldGrowth"},{ticker:"LCWL",name:"Amundi (Lyxor) Core MSCI World",subClass:"worldGrowth"},{ticker:"MNKS",name:"Monks Investment Trust",subClass:"worldGrowth"},{ticker:"MWY",name:"Mid Wynd International",subClass:"worldGrowth"},{ticker:"PACW",name:"Amundi Prime All Country World",subClass:"worldGrowth"},{ticker:"PCT",name:"Polar Capital Technology Trust",subClass:"worldGrowth"},{ticker:"PIN",name:"Pantheon International",subClass:"worldGrowth"},{ticker:"RCP",name:"RIT Capital Partners",subClass:"worldGrowth"},{ticker:"SJG",name:"Schroder Japan Trust",subClass:"worldGrowth"},{ticker:"SMT",name:"Scottish Mortgage Investment Trust",subClass:"worldGrowth"},{ticker:"SSAC",name:"iShares MSCI ACWI",subClass:"worldGrowth"},{ticker:"SWDA",name:"iShares Core MSCI World",subClass:"worldGrowth"},{ticker:"SWLD",name:"SPDR MSCI World",subClass:"worldGrowth"},{ticker:"VAPX",name:"Vanguard FTSE Dev Asia Pacific ex-Japan",subClass:"worldGrowth"},{ticker:"VERX",name:"Vanguard FTSE Developed Europe ex-UK",subClass:"worldGrowth"},{ticker:"VEUR",name:"Vanguard FTSE Developed Europe",subClass:"worldGrowth"},{ticker:"VEVE",name:"Vanguard FTSE Developed World (Dist)",subClass:"worldGrowth"},{ticker:"VHVG",name:"Vanguard FTSE Developed World (Acc)",subClass:"worldGrowth"},{ticker:"VJPN",name:"Vanguard FTSE Japan",subClass:"worldGrowth"},{ticker:"VNRT",name:"Vanguard FTSE North America",subClass:"worldGrowth"},{ticker:"VUAG",name:"Vanguard S&P 500 (Acc)",subClass:"worldGrowth"},{ticker:"VUSA",name:"Vanguard S&P 500 (Dist)",subClass:"worldGrowth"},{ticker:"VWRL",name:"Vanguard FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"VWRP",name:"Vanguard FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"WTAN",name:"Witan Investment Trust",subClass:"worldGrowth"},{ticker:"WWH",name:"Worldwide Healthcare Trust",subClass:"worldGrowth"}],[{ticker:"3IN",name:"3i Infrastructure",subClass:"ukEquityIncome"},{ticker:"AEI",name:"abrdn Equity Income Trust",subClass:"ukEquityIncome"},{ticker:"BBGI",name:"BBGI Global Infrastructure",subClass:"ukEquityIncome"},{ticker:"BSIF",name:"Bluefield Solar Income Fund",subClass:"ukEquityIncome"},{ticker:"CTY",name:"City of London Investment Trust",subClass:"ukEquityIncome"},{ticker:"DIG",name:"Dunedin Income Growth",subClass:"ukEquityIncome"},{ticker:"EDIN",name:"Edinburgh Investment Trust",subClass:"ukEquityIncome"},{ticker:"FGT",name:"Finsbury Growth & Income Trust",subClass:"ukEquityIncome"},{ticker:"FSFL",name:"Foresight Solar Fund",subClass:"ukEquityIncome"},{ticker:"FTAL",name:"SPDR FTSE UK All Share",subClass:"ukEquityIncome"},{ticker:"GRID",name:"Gresham House Energy Storage",subClass:"ukEquityIncome"},{ticker:"GSF",name:"Gore Street Energy Storage",subClass:"ukEquityIncome"},{ticker:"HHI",name:"Henderson High Income Trust",subClass:"ukEquityIncome"},{ticker:"HICL",name:"HICL Infrastructure",subClass:"ukEquityIncome"},{ticker:"HUKX",name:"HSBC FTSE 100",subClass:"ukEquityIncome"},{ticker:"INPP",name:"International Public Partnerships",subClass:"ukEquityIncome"},{ticker:"ISF",name:"iShares Core FTSE 100 (Dist)",subClass:"ukEquityIncome"},{ticker:"IUKD",name:"iShares UK Dividend",subClass:"ukEquityIncome"},{ticker:"JCH",name:"JPMorgan Claverhouse",subClass:"ukEquityIncome"},{ticker:"JLEN",name:"JLEN Environmental Assets",subClass:"ukEquityIncome"},{ticker:"LWDB",name:"Law Debenture Corporation",subClass:"ukEquityIncome"},{ticker:"MRCH",name:"Merchants Trust",subClass:"ukEquityIncome"},{ticker:"MUT",name:"Murray Income Trust",subClass:"ukEquityIncome"},{ticker:"NESF",name:"NextEnergy Solar Fund",subClass:"ukEquityIncome"},{ticker:"ORIT",name:"Octopus Renewables Infrastructure",subClass:"ukEquityIncome"},{ticker:"SEIT",name:"SDCL Energy Efficiency Income",subClass:"ukEquityIncome"},{ticker:"SHRS",name:"Shires Income",subClass:"ukEquityIncome"},{ticker:"TIGT",name:"Troy Income & Growth Trust",subClass:"ukEquityIncome"},{ticker:"TMPL",name:"Temple Bar Investment Trust",subClass:"ukEquityIncome"},{ticker:"TRIG",name:"The Renewables Infrastructure Group",subClass:"ukEquityIncome"},{ticker:"UKDV",name:"SPDR UK Dividend Aristocrats",subClass:"ukEquityIncome"},{ticker:"UKW",name:"Greencoat UK Wind",subClass:"ukEquityIncome"},{ticker:"VMID",name:"Vanguard FTSE 250",subClass:"ukEquityIncome"},{ticker:"VUKE",name:"Vanguard FTSE 100",subClass:"ukEquityIncome"}],[{ticker:"GBDV",name:"SPDR Global Dividend Aristocrats",subClass:"globalEquityIncome"},{ticker:"HFEL",name:"Henderson Far East Income",subClass:"globalEquityIncome"},{ticker:"IAPD",name:"iShares Asia Pacific Dividend",subClass:"globalEquityIncome"},{ticker:"IDVY",name:"iShares Euro Dividend",subClass:"globalEquityIncome"},{ticker:"JGGI",name:"JPMorgan Global Growth & Income",subClass:"globalEquityIncome"},{ticker:"MYI",name:"Murray International Trust",subClass:"globalEquityIncome"},{ticker:"SAIN",name:"Scottish American Investment Co",subClass:"globalEquityIncome"},{ticker:"STS",name:"STS Global Income & Growth (Troy)",subClass:"globalEquityIncome"},{ticker:"USDV",name:"SPDR US Dividend Aristocrats",subClass:"globalEquityIncome"},{ticker:"VHYL",name:"Vanguard FTSE All-World High Div Yield",subClass:"globalEquityIncome"}],[{ticker:"BBOX",name:"Tritax Big Box REIT",subClass:"reit"},{ticker:"BLND",name:"British Land",subClass:"reit"},{ticker:"BYG",name:"Big Yellow Group",subClass:"reit"},{ticker:"DLN",name:"Derwent London",subClass:"reit"},{ticker:"IHR",name:"Impact Healthcare REIT",subClass:"reit"},{ticker:"IUKP",name:"iShares UK Property",subClass:"reit"},{ticker:"IWDP",name:"iShares Developed Markets Property Yield",subClass:"reit"},{ticker:"LAND",name:"Land Securities (Landsec)",subClass:"reit"},{ticker:"LMP",name:"LondonMetric Property",subClass:"reit"},{ticker:"PHP",name:"Primary Health Properties",subClass:"reit"},{ticker:"SAFE",name:"Safestore Holdings",subClass:"reit"},{ticker:"SGRO",name:"Segro",subClass:"reit"},{ticker:"SHED",name:"Urban Logistics REIT",subClass:"reit"},{ticker:"SRE",name:"Sirius Real Estate",subClass:"reit"},{ticker:"SUPR",name:"Supermarket Income REIT",subClass:"reit"},{ticker:"THRL",name:"Target Healthcare REIT",subClass:"reit"},{ticker:"TRY",name:"TR Property Investment Trust",subClass:"reit"},{ticker:"UTG",name:"Unite Group",subClass:"reit"},{ticker:"WHR",name:"Warehouse REIT",subClass:"reit"}],[{ticker:"AAS",name:"abrdn Asia Focus",subClass:"emEquity"},{ticker:"EMIM",name:"iShares Core MSCI EM IMI",subClass:"emEquity"},{ticker:"FCSS",name:"Fidelity China Special Situations",subClass:"emEquity"},{ticker:"FEML",name:"Fidelity Emerging Markets Limited",subClass:"emEquity"},{ticker:"HMEF",name:"HSBC MSCI Emerging Markets",subClass:"emEquity"},{ticker:"JII",name:"JPMorgan Indian Investment Trust",subClass:"emEquity"},{ticker:"JMG",name:"JPMorgan Emerging Markets",subClass:"emEquity"},{ticker:"SEMA",name:"SPDR MSCI Emerging Markets",subClass:"emEquity"},{ticker:"TEM",name:"Templeton Emerging Markets",subClass:"emEquity"},{ticker:"VEIL",name:"Vietnam Enterprise Investments",subClass:"emEquity"},{ticker:"VFEG",name:"Vanguard FTSE Emerging Markets (Acc)",subClass:"emEquity"},{ticker:"VFEM",name:"Vanguard FTSE Emerging Markets (Dist)",subClass:"emEquity"},{ticker:"VOF",name:"VinaCapital Vietnam Opportunity",subClass:"emEquity"}],[{ticker:"ASL",name:"Aberforth Smaller Companies",subClass:"globalSmallCap"},{ticker:"BRSC",name:"BlackRock Smaller Companies",subClass:"globalSmallCap"},{ticker:"EWI",name:"Edinburgh Worldwide",subClass:"globalSmallCap"},{ticker:"HSL",name:"Henderson Smaller Companies",subClass:"globalSmallCap"},{ticker:"ISP6",name:"iShares S&P SmallCap 600",subClass:"globalSmallCap"},{ticker:"MTU",name:"Montanaro UK Smaller Companies",subClass:"globalSmallCap"},{ticker:"SSON",name:"Smithson Investment Trust",subClass:"globalSmallCap"},{ticker:"THRG",name:"BlackRock Throgmorton Trust",subClass:"globalSmallCap"},{ticker:"USSC",name:"SPDR MSCI USA Small Cap Value Weighted",subClass:"globalSmallCap"},{ticker:"WLDS",name:"iShares MSCI World Small Cap",subClass:"globalSmallCap"},{ticker:"WOSC",name:"SPDR MSCI World Small Cap",subClass:"globalSmallCap"}],[{ticker:"AGBP",name:"iShares Core Global Agg GBP-Hedged",subClass:"globalAggHedged"},{ticker:"GLTL",name:"SPDR Bloomberg 15+ Year Gilt",subClass:"longGilts"},{ticker:"GLTS",name:"SPDR Bloomberg 1-5 Year Gilt",subClass:"shortGilts"},{ticker:"IBTL",name:"iShares $ Treasury 20+yr",subClass:"usTreasHedged"},{ticker:"IBTM",name:"iShares $ Treasury 7-10yr",subClass:"usTreasHedged"},{ticker:"IBTS",name:"iShares $ Treasury 1-3yr",subClass:"usTreasHedged"},{ticker:"IDTG",name:"iShares $ Treasury 7-10yr GBP-Hedged",subClass:"usTreasHedged"},{ticker:"IGLS",name:"iShares UK Gilts 0-5yr",subClass:"shortGilts"},{ticker:"IGLT",name:"iShares Core UK Gilts",subClass:"longGilts"},{ticker:"INXG",name:"iShares £ Index-Linked Gilts",subClass:"indexLinked"},{ticker:"IS15",name:"iShares £ Corp Bond 0-5yr",subClass:"corporateIG"},{ticker:"ITPS",name:"iShares $ TIPS",subClass:"indexLinked"},{ticker:"SLXX",name:"iShares Core £ Corp Bond",subClass:"corporateIG"},{ticker:"TI5G",name:"iShares $ TIPS 0-5 (GBP-Hedged)",subClass:"indexLinked"},{ticker:"VAGP",name:"Vanguard Global Aggregate (GBP-Hedged, Dist)",subClass:"globalAggHedged"},{ticker:"VAGS",name:"Vanguard Global Aggregate (GBP-Hedged, Acc)",subClass:"globalAggHedged"},{ticker:"VGOV",name:"Vanguard UK Gilt",subClass:"longGilts"},{ticker:"VUTY",name:"Vanguard USD Treasury Bond",subClass:"usTreasHedged"}],[{ticker:"BIPS",name:"Invesco Bond Income Plus",subClass:"highYield"},{ticker:"GHYS",name:"iShares Global High Yield GBP-Hedged",subClass:"highYield"},{ticker:"IHYG",name:"iShares € High Yield Corp Bond",subClass:"highYield"},{ticker:"IHYU",name:"iShares $ High Yield Corp Bond",subClass:"highYield"},{ticker:"NCYF",name:"CQS New City High Yield",subClass:"highYield"}],[{ticker:"GCP",name:"GCP Infrastructure Investments",subClass:"infraDebt"},{ticker:"SEQI",name:"Sequoia Economic Infrastructure",subClass:"infraDebt"}],[{ticker:"CSH2",name:"Amundi Smart Overnight Return",subClass:"moneyMarket"},{ticker:"ERNS",name:"iShares £ Ultrashort Bond",subClass:"moneyMarket"},{ticker:"XSTR",name:"Xtrackers II Sterling Overnight Rate",subClass:"moneyMarket"}],[{ticker:"PHAU",name:"WisdomTree Physical Gold (USD)",subClass:"gold"},{ticker:"PHGP",name:"WisdomTree Physical Gold (GBP)",subClass:"gold"},{ticker:"RMAU",name:"Royal Mint Physical Gold",subClass:"gold"},{ticker:"SGLD",name:"Invesco Physical Gold",subClass:"gold"},{ticker:"SGLN",name:"iShares Physical Gold",subClass:"gold"}],[{ticker:"BHMG",name:"BH Macro",subClass:"trendMacro"},{ticker:"CGT",name:"Capital Gearing Trust",subClass:"trendMacro"},{ticker:"PNL",name:"Personal Assets Trust",subClass:"trendMacro"},{ticker:"RICA",name:"Ruffer Investment Company",subClass:"trendMacro"}],[{ticker:"AIGC",name:"WisdomTree Broad Commodities",subClass:"commodities"},{ticker:"BRNT",name:"WisdomTree Brent Crude Oil",subClass:"commodities"},{ticker:"CMOD",name:"Invesco Bloomberg Commodity",subClass:"commodities"},{ticker:"COPA",name:"WisdomTree Copper",subClass:"commodities"},{ticker:"CRUD",name:"WisdomTree WTI Crude Oil",subClass:"commodities"},{ticker:"PHSP",name:"WisdomTree Physical Silver (GBP)",subClass:"commodities"},{ticker:"WCOA",name:"WisdomTree Enhanced Commodity (USD)",subClass:"commodities"}]],Qd=Object.freeze(mS.flat().sort((t,e)=>t.ticker.localeCompare(e.ticker))),ge=Object.freeze({SHARES:"shares",BONDS:"bonds",DIVERSIFIERS:"diversifiers",CASH:"cash"}),Nt={ukEquityIncome:{bucket:ge.SHARES,label:"UK equity income",nominalReturn:.068,yield:.04,vol:.16,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.07},globalEquityIncome:{bucket:ge.SHARES,label:"Global equity income",nominalReturn:.07,yield:.03,vol:.16,eqCorr:.95,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.05},worldGrowth:{bucket:ge.SHARES,label:"World growth / tracker",nominalReturn:.07,yield:.02,vol:.17,eqCorr:1,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},reit:{bucket:ge.SHARES,label:"Property / REITs",nominalReturn:.065,yield:.045,vol:.19,eqCorr:.65,duration:4,inflationBeta:.3,creditBeta:.2,crisisBeta:0,idioVol:.13,note:"listed property: equity-like with rate sensitivity; rents partly inflation-linked"},emEquity:{bucket:ge.SHARES,label:"Emerging-markets equity",nominalReturn:.075,yield:.028,vol:.22,eqCorr:.8,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.13},globalSmallCap:{bucket:ge.SHARES,label:"Global smaller companies",nominalReturn:.075,yield:.018,vol:.2,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.09},shortGilts:{bucket:ge.BONDS,label:"Short gilts 0-5y (buffer)",nominalReturn:.043,yield:.043,vol:.026,eqCorr:.1,duration:2.5,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.01},longGilts:{bucket:ge.BONDS,label:"Long gilts 15y+",nominalReturn:.064,yield:.055,vol:.108,eqCorr:.2,duration:15,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.02},indexLinked:{bucket:ge.BONDS,label:"Index-linked gilts (long)",nominalReturn:.047,yieldReal:.023,vol:.1,eqCorr:.33,duration:15,inflationBeta:1,creditBeta:0,crisisBeta:0,idioVol:.03,realYield:!0},corporateIG:{bucket:ge.BONDS,label:"£ IG corporate",nominalReturn:.053,yield:.052,vol:.065,eqCorr:.41,duration:6.5,inflationBeta:0,creditBeta:.4,crisisBeta:0,idioVol:.03},globalAggHedged:{bucket:ge.BONDS,label:"Global-agg £-hedged",nominalReturn:.045,yield:.045,vol:.053,eqCorr:.3,duration:6,inflationBeta:0,creditBeta:.2,crisisBeta:0,idioVol:.02},usTreasHedged:{bucket:ge.BONDS,label:"US treasuries £-hedged",nominalReturn:.04,yield:.04,vol:.068,eqCorr:.1,duration:7,inflationBeta:0,creditBeta:0,crisisBeta:.15,idioVol:.02},infraDebt:{bucket:ge.BONDS,label:"Infrastructure debt",nominalReturn:.064,yield:.06,vol:.07,eqCorr:.3,duration:8,inflationBeta:.3,creditBeta:.3,crisisBeta:0,idioVol:.03,note:"IG + ~115bps illiquidity premium"},highYield:{bucket:ge.BONDS,label:"Global high-yield (£-hedged)",nominalReturn:.058,yield:.065,vol:.1,eqCorr:.6,duration:3.5,inflationBeta:0,creditBeta:.8,crisisBeta:0,idioVol:.05,note:"credit carry net of defaults; spreads blow out with equities in a crash"},moneyMarket:{bucket:ge.CASH,label:"Money-market fund",nominalReturn:.034,yield:.034,vol:.002,eqCorr:0,duration:.1,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0,note:"FCA -1% real; = engine cash model"},savings:{bucket:ge.CASH,label:"Savings / NS&I",nominalReturn:.034,yield:.034,vol:.001,eqCorr:0,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},gold:{bucket:ge.DIVERSIFIERS,label:"Gold",nominalReturn:.055,yield:0,vol:.155,eqCorr:.05,duration:0,inflationBeta:.3,creditBeta:0,crisisBeta:.5,idioVol:.14,note:"near-uncorrelated; rises when stocks AND bonds fall (2022)"},trendMacro:{bucket:ge.DIVERSIFIERS,label:"Trend / macro",nominalReturn:.045,yield:0,vol:.12,eqCorr:.07,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,momentumBeta:.6,idioVol:.1,note:"lagged path-momentum; pays in prolonged 2008/2022, whipsaws in V-shaped 2020"},commodities:{bucket:ge.DIVERSIFIERS,label:"Broad commodities",nominalReturn:.045,yield:0,vol:.16,eqCorr:.25,duration:0,inflationBeta:.8,creditBeta:0,crisisBeta:0,idioVol:.14,note:"the strongest inflation hedge (2022); long flat stretches otherwise; crashes WITH equities in a demand shock (2008)"}},Jd=Object.freeze(JSON.parse(JSON.stringify(Nt))),xf=Object.freeze(["nominalReturn","yield","yieldReal","vol","eqCorr","duration","inflationBeta","creditBeta","crisisBeta","momentumBeta","idioVol"]);function Hg(t){for(const[e,n]of Object.entries(Jd)){const s=Nt[e];for(const r of xf)n[r]!==void 0?s[r]=n[r]:delete s[r];const i=t&&t[e];if(i)for(const r of xf)i[r]!==void 0&&Number.isFinite(+i[r])&&(s[r]=+i[r])}}const gS=Qd,Wg=Object.freeze(Object.fromEntries(gS.map(t=>[t.ticker,t.subClass])));function Gg(){const t={};for(const[e,n]of Object.entries(Nt))(t[n.bucket]=t[n.bucket]||[]).push({key:e,label:n.label});return t}const yS=.036,vS=.4,bS=.005,wS=.35,Yg=.01,Xd=-.15,jg=.045;function Af(t,e=.1){let n=yS+vS*t;return e<Xd&&t<jg&&(n-=Yg),n}function kf(t,e=.1){let n=bS+wS*(t-.025);return e<Xd&&t<jg&&(n-=Yg),n}function _S(t){return t.inf>.045?"inflation":t.eqReturn<Xd?"crash":"normal"}const ES=Object.freeze({shortGilts:{normal:.05,inflation:.3,crash:-.2},longGilts:{normal:.1,inflation:.45,crash:-.35},indexLinked:{normal:.15,inflation:.35,crash:-.15},corporateIG:{normal:.35,inflation:.45,crash:.55},globalAggHedged:{normal:.25,inflation:.4,crash:.1},usTreasHedged:{normal:.05,inflation:.25,crash:-.4},infraDebt:{normal:.3,inflation:.35,crash:.35},gold:{normal:0,inflation:-.05,crash:-.2},trendMacro:{normal:.05,inflation:-.1,crash:-.3},highYield:{normal:.5,inflation:.55,crash:.6},commodities:{normal:.2,inflation:-.1,crash:.4}});function ll(t,e){const n=ES[t];if(!n)return 0;const s=n[_S(e)];return s??n.normal}const TS=new Map(Object.entries(Nt).map(([t,e])=>[e,t]));function cl(t,e,n,s){if(!t)return 0;const i=(n-.1)/.17,r=wi(0,1,s),o=e*i+Math.sqrt(Math.max(0,1-e*e))*r;return t*o}function IS(t,e,n){const{inf:s,prevInf:i,eqReturn:r,prevEqReturn:o=.1}=e,l=!!t.realYield,c=t.duration||0,d=l?kf(s,r)-kf(i,o):Af(s,r)-Af(i,o),h=l?(t.yieldReal||0)+s:t.yield||0,m=-c*d,p=l?0:(t.inflationBeta||0)*(s-.025),w=cl(t.idioVol||0,ll(TS.get(t),e),r,n);return h+m+p+w}const SS=Object.freeze({shortGilts:.3,longGilts:.2,indexLinked:.2,corporateIG:.3});function Cf(t,e,n=SS){let s=0;for(const i of Object.keys(n)){const r=n[i];if(!r)continue;const o=Nt[i];o&&(s+=r*IS(o,t,e))}return s}const xS=.048,AS=.045;function kS(t,e){const{inf:n,eqReturn:s}=t,i=Nt.gold,r=(i.inflationBeta||0)*(n-.025),o=cl(i.idioVol||0,ll("gold",t),s,e);return xS+r+o}function CS(t,e,n){const s=Nt.trendMacro,i=t.eqReturn-.05,r=(s.momentumBeta||0)*n*i,o=cl(s.idioVol||0,ll("trendMacro",t),t.eqReturn,e);return AS+r+o}const Rf=.6,RS=.15;function PS(t,e){return Rf*t+(1-Rf)*e}function MS(t){return Math.max(-1,Math.min(1,t/RS))}const DS=.035;function BS(t,e){const{inf:n}=t,s=Nt.commodities,i=(s.inflationBeta||0)*(n-.025),r=cl(s.idioVol||0,ll("commodities",t),t.eqReturn,e);return DS+i+r}const LS=Object.freeze({gold:.5,trendMacro:.5});function Pf(t,e,n,s=LS){let i=0;return s.gold&&(i+=s.gold*kS(t,e)),s.trendMacro&&(i+=s.trendMacro*CS(t,e,n)),s.commodities&&(i+=s.commodities*BS(t,e)),i}const NS=5,OS=20,FS=.01;function VS(t){return Math.min(Math.max(0,Math.floor(t)-NS+1),OS)}function Ca(t,e="declining"){return e!=="declining"?1:Math.pow(1-FS,VS(t))}function zS(t,e="declining"){if(e!=="declining")return 0;const n=Ca(t-1,e);return n===0?0:1-Ca(t,e)/n}const $S=-.01,US=5;function Kg(t){return Math.max(0,t+$S)}function Ui(t,e,n=0){const s=Fc(n);let i=t.equityStart,r=t.bondStart,o=t.cashStart,l=t.hodlEnabled?t.hodlStart!==void 0?t.hodlStart:t.hodlValue:0,c=0,d=t.diversifierStart||0,h=0,m=0,p=0,w=t.isaBalance||0,I=t.accessMethod==="ufpls"?268275:0,S=0,A=!1,P=null;const C=t.isaBalance||0,L=Math.max(1e3,C*.05);let D=null,O=0,U=0;const T=new Array(t.years+1).fill(null),v=new Array(t.years+1).fill(null);let _=0,b=0,E=0,x=0,y=!1,te=!1,re=null,q=0,ne=0,se=-1;const oe=[],ve=t.trace?[]:null,Te=[];let ie=1;oe.push({year:0,month:0,equity:i,bond:r,cash:o,hodl:l,total:i+r+o,draw:0,source:"None",inProtection:!1,equityMin:t.equityMin,bondMin:t.bondMin,cashMax:t.cashTarget});for(let me=0;me<t.years*12;me++){const de=Math.floor(me/12),Qe=me%12,sn=de;if(sn!==se&&(q=0,ne=0,se=sn),me>0&&me%12===0){const G=e.inflation[de]||.025;Te.push(G),ie*=1+G}const Kt=al(t.equityGlide,de,t.duration);if(Kt!=null&&Qe===0){const G=i+r;G>0&&(i=G*Kt,r=G*(1-Kt))}d>0&&Qe===0&&(de>0&&(m=PS(m,e.equity[de-1]||0)),p=MS(m));const ze=e.equity[de]||0,$e=e.inflation[de]||.025,pn=de>0?e.inflation[de-1]||.025:$e;let Rt=Qn(t.equityMin,de,t.duration,ie,!0),zt=Qn(t.bondMin,de,t.duration,ie,!0);if(Kt!=null){const G=Rt+zt;Rt=G*Kt,zt=G*(1-Kt)}const Os=Qn(t.cashTarget,de,t.duration,ie,!1),mn=Rt+zt,Mn=y;if(y=t.disableProtection?!1:Ug({totalGrowth:i+r,minGrowth:mn,consecCashDraws:x,wasInProtection:Mn,consecutiveLimit:t.consecutiveLimit,recoveryBuffer:t.recoveryBuffer??ka.RECOVERY_BUFFER}),y?(_++,E++):(b=Math.max(b,E),E=0),t.accessMethod==="ufpls"&&t.ufplsThenPcls&&t.ufplsYears>0&&de>=t.ufplsYears&&Qe===0&&!A){A=!0;const G=i+r+o+d,Se=Math.max(0,Math.min(.25*G,I));if(Se>0&&G>0){const ct=1-Se/G;i*=ct,r*=ct,o*=ct,d*=ct,w+=Se,I-=Se,S=Se}}const{sippMonthly:Fs,isaMonthly:rn,planInputs:Pt,taxAnnual:gn,higherRate:Oe,taxFreeMonthly:Ue,recycleGrossMonthly:Mt,recycleNetMonthly:us}=YS(t,de,ie,Te,w,I);Qe===0&&(T[de]=w/ie,v[de]=(i+r+o+d)/ie),U+=gn/12/ie,Oe&&O++;const on=Fs,$t=on;let Ut=y?on*t.protectionMult:on,Le=Ut;const an=!y&&Mt>0?Mt:0,Dn=an>0?us:0;an>0&&(Le+=an,U+=(an-Dn)/ie);const yn=rn,Bn=ve?{month:me,year:de,monthInYear:Qe,cumInf:ie,equityStart:i,bondStart:r,cashStart:o,isaStart:w,sippMonthly:Fs,isaMonthly:rn,effectiveSipp:Ut,effectiveIsa:yn,boostAmount:0,inProtection:y,planInputs:Pt}:null;Bn&&ve.push(Bn),y&&(q+=$t-Le);const Ln=de>0?e.equity[de-1]||0:ze,pi=t.subAsset?Cf({inf:$e,prevInf:pn,eqReturn:ze,prevEqReturn:Ln},s,t.subAsset.bondWeights):qS($e,ze,pn,s),Nn=Kg(pn),qt=G=>Math.pow(1+(Number.isFinite(G)?Math.max(-.99,G):-.99),1/12);if(i*=qt(ze),r*=qt(pi),o*=qt(Nn),t.isaMix&&w>0){const G=t.isaMix;let Se=(G.shares||0)*ze+(G.cash||0)*Nn;G.bonds&&(Se+=G.bonds*Cf({inf:$e,prevInf:pn,eqReturn:ze,prevEqReturn:Ln},s,G.bondWeights)),G.diversifiers&&(Se+=G.diversifiers*Pf({inf:$e,eqReturn:ze},s,p,G.diversifierWeights)),w*=qt(Se)}else w=pS(w,t.isaReturn||Lt.RETURN);if(l>0){const ct=(s()-.5)*2*.06;let Tt=0;ze<-.1?Tt=Math.min(.15,Math.abs(ze)*.4):ze<-.05&&(Tt=Math.abs(ze)*.2);let Jt=.069+ct+Tt;Jt=Math.max(-.08,Math.min(.18,Jt)),l*=qt(Jt)}if(d>0){const G=Pf({inf:$e,eqReturn:ze},s,p,t.subAsset&&t.subAsset.diversifierWeights);d*=qt(G)}const On=i+r;let Qt=0;if(!y){const G=12-Qe,Se=ne+$t*G+Pt.fixed;Qt=oa({shortfall:q,standardMonthly:$t,remainingMonths:G,surplus:On-mn-Ri.SURPLUS_BUFFER,brlHeadroom:Pt.brl-Se}),Qt>50&&(Le+=Qt,q-=Qt)}ne+=Le,Bn&&(Bn.effectiveSipp=Le,Bn.boostAmount=Qt>50?Qt:0);let Fe="Growth";if(!y&&On>=mn+Le){const G=Math.max(0,i-Rt),Se=Math.max(0,r-zt),ct=G+Se;if(ct>0){if(i-=Le*G/ct,r-=Le*Se/ct,Fe="Growth",o<Os){const Tt=On-mn-Le;if(Tt>5e3){const Jt=Math.min((Os-o)*.3,Tt*.5);i-=Jt*G/ct,r-=Jt*Se/ct,o+=Jt}}}else o-=Le,Fe="Cash"}else if(o>=Le)o-=Le,Fe="Cash";else{const G=Le-o;o=0,d>G?(d-=G,h+=G,Fe="Diversifier"):r>G?(r-=G,Fe="Bond"):i>G?(i-=G,Fe="Equity"):l>G?(l-=G,c+=G,P===null&&(P=me),Fe="HODL"):(te=!0,re=me)}if(x=Fe==="Growth"?0:x+1,w=Math.max(0,w-Math.min(yn,w))+Dn,I>0&&(I=Math.max(0,I-(Ue||0))),D===null&&C>0&&w/ie<L&&(D=me),i=Math.max(0,i),r=Math.max(0,r),o=Math.max(0,o),d=Math.max(0,d),(Qe===0||me===t.years*12-1||te)&&oe.push({year:de+Qe/12,month:me,equity:i,bond:r,cash:o,hodl:l,diversifier:d,total:i+r+o+d,draw:Le,boostAmount:Qt,source:Fe,inProtection:y,equityMin:Rt,bondMin:zt,cashMax:Os}),te)break}if(b=Math.max(b,E),!te)T[t.years]=w/(ie||1),v[t.years]=(i+r+o+d)/(ie||1);else for(let me=Math.floor(re/12)+1;me<=t.years;me++)v[me]=0;let F=0,X=0,Ie=0,Et=0,Vt=1;for(let me=0;me<t.years;me++){const de=e.inflation[me]??.025;F+=de,Vt*=1+de,X+=e.equity[me]??0,me<5&&(Ie+=e.equity[me]??0,Et++)}const Ye=i+r+o+d;return{failed:te,duration:t.years,years:te?re/12:t.years,failMonth:re,avgInflation:F/t.years,avgEquityReturn:X/t.years,earlyEquityReturn:Et?Ie/Et:0,cumInflation:Vt,finalReal:Ye/Vt,final:Ye,finalEquity:i,finalBond:r,finalCash:o,finalHodl:l,finalDiversifier:d,divUsed:h,protMonths:_,maxConsec:b,hodlUsed:c,hodlUsedMonth:P,startIsa:C,finalIsa:w,pclsTaken:S,isaDepletedMonth:D,isaLastedYears:D===null?t.years:D/12,higherRateYears:O/12,totalTaxReal:U,isaByYear:T,potByYear:v,hist:oe,trace:ve,seed:n}}function qS(t,e,n,s){let i=.15,r=.3,o=.2,l=.1,c=.1,d=.15;const h=n!==void 0?n:t,m=h>.045,p=h>.07;if(m){const U=s()>.3?1:.5;p?(i=.15+.35*U,r=.3-.2*U,d=.15-.1*U,l=.1+.05*U):(i=.15+.2*U,r=.3-.1*U,d=.15-.05*U)}m&&s()<.15&&(i=.2,r=.25,d=.12);const w=t+.005+wi(0,.03,s),I=.04-(t>.04?(t-.04)*.5:0)+wi(0,.05,s),S=.03+t*.3+wi(0,.08,s),A=t*.8+wi(0,.15,s),P=Kg(n),C=e*.5+wi(0,.02,s),L=i*w+r*I+o*S+l*A+c*P+d*C,D=HS(t,e),O=(e-.1)/.17;return L+D*O*.055}function HS(t,e){return t>.045?.4:e<-.15?-.3:.1}function WS(t,e){return Ca(e,t.spendingProfile||"flat")}function GS(t,e){return t.spStartYear!==void 0?Math.max(0,t.spStartYear-e):t.statePensionYear!==void 0?Math.max(0,t.statePensionYear-e):0}function YS(t,e,n,s,i=0,r=0){const o=t.taxMode==="frozen"?t.pa:t.pa*n,l=t.taxMode==="frozen"?t.brl:t.brl*n,c=t.taxMode==="frozen"?t.hrl:(t.hrl||125140)*n,h=(Array.isArray(t.targetSchedule)&&t.targetSchedule[e]!=null?t.targetSchedule[e]:t.baseSalary)*n*WS(t,e),m=ah(t.other,s);let p=0;if(t.spStartYear!==void 0){if(e>=t.spStartYear&&t.spWeeklyAmount>0){const O=t.spWeeklyAmount*52;e===t.spStartYear&&t.spFirstYearRatio!==void 0?p=O*t.spFirstYearRatio*n:p=O*n}}else t.statePensionYear!==void 0&&(p=e>=t.statePensionYear?(t.statePension||0)*n:0);let w=0;if(t.dbAmount>0&&e>=(t.dbStartYear||0)){const O=t.dbIndexation||"lpi5";O==="level"?w=t.dbAmount:O==="cpi"?w=t.dbAmount*n:w=ah(t.dbAmount,s,.05)}const I=m+p+w,S=GS(t,e),A=!t.ufplsYears||e<t.ufplsYears,P=t.accessMethod==="ufpls"&&A&&r>0?.25:0,C=Aa({targetGross:h,fixedIncome:I,pa:o,brl:l,hrl:c,isaBalance:i,strategy:t.isaDrawdownStrategy||Lt.DRAWDOWN_STRATEGY,yearsUntilSp:S,taxFreeFraction:P});let L=0,D=0;if(t.bandFillRecycle&&P===0){const O=qg({brlHeadroom:l-C.taxable,remainingMonths:12,isaAllowanceLeft:Kd.ISA_ANNUAL_ALLOWANCE});L=O.gross,D=O.net}return{sippMonthly:C.sippGross/12,isaMonthly:C.isaDraw/12,taxFreeMonthly:(C.taxFree||0)/12,recycleGrossMonthly:L,recycleNetMonthly:D,taxAnnual:C.tax,higherRate:C.taxable>l+1,planInputs:{target:h,other:m,statePension:p,fixed:I,pa:o,brl:l,hrl:c,yearsUntilSp:S}}}function Qg(t,e=1e3){const n=[];for(let s=0;s<e;s++)n.push(Ui(t,Zd(t,s),s));return n}function Zd(t,e){const n=Object.keys(Xs).map(Number).sort((c,d)=>c-d),s=n.length,i=Fc(e*12345),r={equity:{},inflation:{}},o=t.blockYears||US;let l=0;for(;l<t.years;){const c=Math.floor(i()*s);for(let d=0;d<o&&l<t.years;d++,l++){const h=n[(c+d)%s];r.equity[l]=Xs[h],r.inflation[l]=Da[h]||.025}}return r}function Jg(t){const e=Object.keys(Xs).map(Number).sort((i,r)=>i-r),n=Math.max(...e),s=[];for(const i of e){if(i+t.years-1>n)continue;const r={equity:{},inflation:{}};for(let l=0;l<t.years;l++)r.equity[l]=Xs[i+l]||0,r.inflation[l]=Da[i+l]||.025;const o=Ui(t,r,i);o.startYear=i,s.push(o)}return s}function jS(t,e){const n={equity:{},inflation:{}};for(let s=0;s<t.years;s++)n.equity[s]=e.equity[s%e.equity.length],n.inflation[s]=e.inflation[s%e.inflation.length];return Ui(t,n,999)}function KS(t){const e=t.filter(n=>n.failed).length;return(t.length-e)/t.length*100}function QS(t){if(!t||t.failCount===0)return"No shortfalls: every simulated future funded the whole plan.";const e=d=>(d*100).toFixed(1)+"%",n=Math.round(t.medianFailYear),s=t.duration,i=Math.round(t.pctNearMiss);let r;t.pctNearMiss>=60?r=`and when they do it's usually late — the typical shortfall is at year ${n} of ${s}, and ${i}% happen only in the final years, after funding almost the whole of retirement`:t.pctNearMiss<=30?r=`and they tend to come EARLY — the typical shortfall is at year ${n} of ${s}, with only ${i}% holding on to the final years. An early shortfall is the serious kind, with little retirement left to adjust`:r=`spread through retirement — the typical shortfall is at year ${n} of ${s}`;const o=[{mag:t.succEarlyEq-t.failEarlyEq,text:`a poor first few years of markets (sequence-of-returns risk): the futures that fell short averaged ${e(t.failEarlyEq)} equity in the opening 5 years versus ${e(t.succEarlyEq)} for those that lasted`},{mag:t.succAvgEq-t.failAvgEq,text:`weak markets across the whole plan: ${e(t.failAvgEq)} average equity return versus ${e(t.succAvgEq)} for those that lasted`},{mag:t.failAvgInf-t.succAvgInf,text:`higher inflation eroding spending power: ${e(t.failAvgInf)} a year versus ${e(t.succAvgInf)} for those that lasted`}].filter(d=>d.mag>.005).sort((d,h)=>h.mag-d.mag),l=`About ${Math.round(t.failRate||0)}% of futures fall short`;if(!o.length)return`${l}, ${r}. No single market driver stands out — the shortfalls come down to broadly bad luck across returns and inflation.`;let c=`The common thread is ${o[0].text}`;return o[1]&&o[1].mag>o[0].mag*.5&&(c+=`. A secondary factor is ${o[1].text}`),`${l}, ${r}. ${c}.`}function Xg(t){const e=t.filter(l=>!l.failed),n=t.filter(l=>l.failed),s=t.map(l=>l.years).sort((l,c)=>l-c),i=e.map(l=>l.final).sort((l,c)=>l-c),r=t.map(l=>l.protMonths).sort((l,c)=>l-c),o=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:t.length,successCount:e.length,failCount:n.length,successRate:KS(t),survival:{p5:o(s,.05),p10:o(s,.1),p25:o(s,.25),p50:o(s,.5),p75:o(s,.75),p90:o(s,.9),p95:o(s,.95),min:s[0],max:s[s.length-1]},finalValue:{p5:o(i,.05),p10:o(i,.1),p25:o(i,.25),p50:o(i,.5),p75:o(i,.75),p90:o(i,.9),p95:o(i,.95),min:i[0]||0,max:i[i.length-1]||0,avg:e.reduce((l,c)=>l+c.final,0)/(e.length||1)},minYears:s[0],p10Years:o(s,.1),medianYears:o(s,.5),medianFinal:o(i,.5),p10Final:o(i,.1),p90Final:o(i,.9),avgFinal:e.reduce((l,c)=>l+c.final,0)/(e.length||1),protection:{runsWithProtection:t.filter(l=>l.protMonths>0).length,pctWithProtection:t.filter(l=>l.protMonths>0).length/t.length*100,avgMonths:r.reduce((l,c)=>l+c,0)/t.length,maxMonths:Math.max(...r),maxConsecutive:Math.max(...t.map(l=>l.maxConsec)),avgConsecutive:t.reduce((l,c)=>l+c.maxConsec,0)/t.length,p50Months:o(r,.5),p90Months:o(r,.9),p95Months:o(r,.95)},runsWithProtection:t.filter(l=>l.protMonths>0).length,avgProtMonths:r.reduce((l,c)=>l+c,0)/t.length,maxProtMonths:Math.max(...r),maxConsecutive:Math.max(...t.map(l=>l.maxConsec)),avgConsecutive:t.reduce((l,c)=>l+c.maxConsec,0)/t.length,hodl:{runsUsingHodl:t.filter(l=>l.hodlUsed>0).length,pctUsingHodl:t.filter(l=>l.hodlUsed>0).length/t.length*100,avgUsed:t.filter(l=>l.hodlUsed>0).length>0?t.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/t.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...t.map(l=>l.hodlUsed||0))},runsUsingHodl:t.filter(l=>l.hodlUsed>0).length,avgHodlUsed:t.filter(l=>l.hodlUsed>0).length>0?t.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/t.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...t.map(l=>l.hodlUsed||0)),severity:(()=>{const l=Math.max(...t.map(S=>S.duration||S.years),1),c=t.filter(S=>S.failed),d=t.filter(S=>!S.failed),h=c.map(S=>S.years).sort((S,A)=>S-A),m=l*.85,p=(S,A)=>S.length?S.reduce((P,C)=>P+(C[A]||0),0)/S.length:0,w={duration:l,coverage:t.reduce((S,A)=>S+Math.min(1,(A.years||0)/l),0)/t.length*100,failCount:c.length,failRate:t.length?c.length/t.length*100:0,medianFailYear:h.length?o(h,.5):0,pctNearMiss:c.length?c.filter(S=>S.years>=m).length/c.length*100:0,failEarlyEq:p(c,"earlyEquityReturn"),succEarlyEq:p(d,"earlyEquityReturn"),failAvgEq:p(c,"avgEquityReturn"),succAvgEq:p(d,"avgEquityReturn"),failAvgInf:p(c,"avgInflation"),succAvgInf:p(d,"avgInflation")};w.diagnosis=QS(w);const I=[{k:"sequence",m:w.succEarlyEq-w.failEarlyEq},{k:"market",m:w.succAvgEq-w.failAvgEq},{k:"inflation",m:w.failAvgInf-w.succAvgInf}].filter(S=>S.m>.005).sort((S,A)=>A.m-S.m);return w.primaryDriver=w.failCount>0&&I.length?I[0].k:null,w})(),finalReal:(()=>{const l=t.map(c=>c.failed?0:c.finalReal||0).sort((c,d)=>c-d);return{p5:o(l,.05),p10:o(l,.1),p25:o(l,.25),p50:o(l,.5),p75:o(l,.75),p90:o(l,.9),p95:o(l,.95),min:l[0]||0,max:l[l.length-1]||0}})(),chartData:(()=>{const l=Math.max(...t.map(m=>m.duration||m.years),1),c=l+1,d={p10:[],p25:[],p50:[],p75:[],p90:[]},h=[];for(let m=0;m<c;m++){const p=t.map(I=>I.potByYear&&I.potByYear[m]!=null?I.potByYear[m]:0).sort((I,S)=>I-S);d.p10.push(o(p,.1)),d.p25.push(o(p,.25)),d.p50.push(o(p,.5)),d.p75.push(o(p,.75)),d.p90.push(o(p,.9));const w=t.filter(I=>(I.failed?I.failMonth/12:l)>=m).length;h.push(t.length?w/t.length*100:0)}return{years:c,potBand:d,solvency:h}})(),isa:(()=>{const l=t.filter(S=>(S.startIsa||0)>0);if(!l.length)return{funded:!1};const c=l.map(S=>S.isaLastedYears).sort((S,A)=>S-A),d=l.map(S=>S.finalIsa).sort((S,A)=>S-A),h=l.map(S=>S.higherRateYears),m=l.map(S=>S.totalTaxReal).sort((S,A)=>S-A),p=Math.max(...l.map(S=>(S.isaByYear||[]).length)),w=[],I=[];for(let S=0;S<p;S++){const A=l.filter(C=>C.isaByYear&&C.isaByYear[S]>0).length;w.push(l.length?A/l.length*100:0);const P=l.map(C=>C.isaByYear&&C.isaByYear[S]!=null?C.isaByYear[S]:0).sort((C,L)=>C-L);I.push(P[Math.floor(P.length/2)])}return{funded:!0,runs:l.length,startBalance:l[0].startIsa,medianLastedYears:o(c,.5),minLastedYears:c[0],pctSurviveFullTerm:l.filter(S=>S.isaDepletedMonth===null).length/l.length*100,finalBalance:{p10:o(d,.1),p50:o(d,.5),p90:o(d,.9)},avgHigherRateYears:h.reduce((S,A)=>S+A,0)/l.length,maxHigherRateYears:Math.max(...h),pctEverHigherRate:l.filter(S=>S.higherRateYears>0).length/l.length*100,medianTotalTax:o(m,.5),p90TotalTax:o(m,.9),pctHoldingByYear:w,medianIsaByYear:I}})(),failures:n.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function dl(t){const e=typeof t=="string"?new Date(t):t,n=e.getFullYear(),s=e.getMonth()+1,i=e.getDate();if(s<_n.START_MONTH||s===_n.START_MONTH&&i<_n.START_DAY){const r=n-1;return`${String(r).slice(-2)}/${String(n).slice(-2)}`}return`${String(n).slice(-2)}/${String(n+1).slice(-2)}`}function Yl(t){const e=parseInt(t.split("/")[0]),n=e<50?2e3+e:1900+e;return new Date(n,_n.START_MONTH-1,_n.START_DAY)}function JS(t){const e=parseInt(t.split("/")[1]),n=e<50?2e3+e:1900+e;return new Date(n,_n.START_MONTH-1,_n.START_DAY-1)}function XS(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`}function eu(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,15)}function ZS(t){const n=(typeof t=="string"?new Date(t):t).getMonth()+1;return n>=_n.START_MONTH?12-(n-_n.START_MONTH):_n.START_MONTH-n}function er(t){if(!t)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},n=t.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(n)){const i=new Date(n);if(!isNaN(i.getTime()))return i}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[i,r,o]=n.split("/").map(Number);return new Date(o,r-1,i)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(n)){const[i,r,o]=n.split("-").map(Number);return new Date(o,r-1,i)}let s=n.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(s){const i=parseInt(s[1]),r=e[s[2].toLowerCase()],o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}if(s=n.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),s){const i=e[s[1].toLowerCase()],r=parseInt(s[2]),o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}if(s=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),s){const i=e[s[1].toLowerCase()],r=parseInt(s[2]),o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}if(s=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),s){const i=parseInt(s[1]),r=e[s[2].toLowerCase()],o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}return null}function aa(t){const e=typeof t=="string"?er(t):t;if(!e||isNaN(e.getTime()))return"";const n=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${n[e.getMonth()]} ${e.getFullYear()}`}function ex(t){const{taxYear:e,spStartDate:n,weeklyAmount:s,taxYearConfigs:i={}}=t;if(!n||!s||s<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const r=typeof n=="string"?er(n):n;if(!r||isNaN(r.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const o=dl(r);Yl(e);const l=JS(e),c=[...new Set([o,e,...Object.keys(i)])].sort((S,A)=>Yl(S).getTime()-Yl(A).getTime()),d=c.indexOf(o),h=c.indexOf(e);if(h<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:aa(r)};let m=1;for(let S=d;S<h;S++){const A=c[S],P=i[A],C=(P==null?void 0:P.cpi)||.025;m*=1+C}const p=s*m;if(e===o){const A=Math.max(0,(l.getTime()-r.getTime())/6048e5),P=p*A;return{annual:P,monthly:P/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(A*10)/10,startDate:aa(r)}}const I=p*52;return{annual:I,monthly:I/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:aa(r)}}function tx(t,e=new Date){const n=typeof t=="string"?er(t):t;if(!n||isNaN(n.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const s=n.getTime()-e.getTime(),i=s<=0;if(i)return{years:0,months:0,totalMonths:0,isPast:!0};const r=Math.floor(s/(30.44*24*60*60*1e3)),o=Math.floor(r/12),l=r%12;return{years:o,months:l,totalMonths:r,isPast:i}}const Zg=2016;function ul(t,{now:e=new Date}={}){if(!t||!String(t).trim())return{valid:!0,error:null,warning:null,date:null};const n=er(t);if(!n||isNaN(n.getTime()))return{valid:!1,error:'Could not read that date. Try a format like "6 May 2040".',warning:null,date:null};const s=n.getFullYear();return s<Zg?{valid:!1,error:`That looks like a date of birth (${s}), not a State Pension start date. Enter the date your State Pension begins — check gov.uk/check-your-state-pension.`,warning:null,date:n}:n.getTime()<e.getTime()?{valid:!0,error:null,warning:`This date is in the past — State Pension will be treated as already in payment from ${s}.`,date:n}:{valid:!0,error:null,warning:null,date:n}}function tu(t,e=new Date){if(!t.spStartDate||!t.spWeeklyAmount)return null;const n=er(t.spStartDate);if(!n)return null;const s=365.25*24*60*60*1e3,i=Math.max(0,(n.getTime()-e.getTime())/s),r=Math.floor(i),o=365,l=Math.floor((n-new Date(n.getFullYear(),0,0))/(24*60*60*1e3)),c=(o-l)/o;return{spStartYear:r,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:c}}const Mf=Object.freeze(Object.defineProperty({__proto__:null,MIN_SP_START_YEAR:Zg,calculateStatePensionForTaxYear:ex,formatStatePensionDate:aa,getTimeUntilStatePension:tx,parseStatePensionDate:er,spSimConfigFromSettings:tu,validateStatePensionDate:ul},Symbol.toStringTag,{value:"Module"}));function ey(t,e,n=.025){const s=[];let i=t.isaBalance||0;const r=Math.max(0,n-.01),o=tu(t),l=o?o.spStartYear:t.statePensionYear??1/0,c=o?o.spWeeklyAmount*52:t.statePension||0,d=o?o.spFirstYearRatio:1;let h=t.accessMethod==="ufpls"?268275:0;for(let m=0;m<=e;m++){const p=Math.pow(1+n,m),w=t.taxMode==="frozen"?t.pa:t.pa*p,I=t.taxMode==="frozen"?t.brl:t.brl*p,S=t.taxMode==="frozen"?t.hrl||125140:(t.hrl||125140)*p,A=Ca(m,t.spendingProfile||"flat"),C=(Array.isArray(t.targetSchedule)&&t.targetSchedule[m]!=null?t.targetSchedule[m]:t.baseSalary||0)*p*A,L=(t.other||0)*Math.pow(1+Math.min(n,Qf),m);let D=0;m>=l&&c>0&&(D=c*(m===l?d:1)*p);let O=0;if(t.dbAmount>0&&m>=(t.dbStartYear||0)){const y=t.dbIndexation||"lpi5";y==="level"?O=t.dbAmount:y==="cpi"?O=t.dbAmount*p:O=t.dbAmount*Math.pow(1+Math.min(n,.05),m)}const U=L+D+O,T=Math.max(0,l===1/0?0:l-m),v=!t.ufplsYears||m<t.ufplsYears,_=t.accessMethod==="ufpls"&&v&&h>0?.25:0,b=Aa({targetGross:C,fixedIncome:U,pa:w,brl:I,hrl:S,isaBalance:i,strategy:t.isaDrawdownStrategy,yearsUntilSp:T,taxFreeFraction:_});h>0&&(h=Math.max(0,h-(b.taxFree||0)));const E=b.taxable-b.tax,x=i;i=b.remainingIsa*(1+r),s.push({year:m,brl:I,other:L,statePension:D,sippDraw:b.sippGross,totalTaxable:b.taxable,tax:b.tax,netIncome:E,target:C,isaDraw:b.isaDraw,isaBalance:x,spendable:b.net})}return s}function hl(t){const e={[ge.SHARES]:0,[ge.BONDS]:0,[ge.DIVERSIFIERS]:0,[ge.CASH]:0},n={},s=[],i=[];let r=0,o=0;for(const l of t){const c=+l.value||0,d=l.subClass||(l.ticker?Wg[l.ticker]:void 0),h=d?Nt[d]:null;if(!h){i.push({...l});continue}if(r+=c,s.push({...l,subClass:d,bucket:h.bucket,label:h.label}),(l.wrapper||"").toUpperCase()==="ISA"){o+=c;continue}e[h.bucket]+=c,n[d]=(n[d]||0)+c}return{buckets:e,subClassTotals:n,bondWeights:Df(n,ge.BONDS),diversifierWeights:Df(n,ge.DIVERSIFIERS),total:r,isaTotal:o,tagged:s,untagged:i}}function Df(t,e){const n=Object.entries(t).filter(([r])=>Nt[r].bucket===e),s=n.reduce((r,[,o])=>r+o,0);if(s<=0)return{};const i={};for(const[r,o]of n)i[r]=o/s;return i}function nx(t){const e=t.buckets[ge.DIVERSIFIERS]||0,n={equityStart:t.buckets[ge.SHARES]||0,bondStart:t.buckets[ge.BONDS]||0,cashStart:t.buckets[ge.CASH]||0,isaBalance:t.isaTotal||0};return e>0&&(n.diversifierStart=e,n.subAsset={}),Object.keys(t.bondWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.bondWeights=t.bondWeights),Object.keys(t.diversifierWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.diversifierWeights=t.diversifierWeights),n}let _s=null;function jr(){return{settings:{equityMin:pe.EQUITY_MIN,bondMin:pe.BOND_MIN,cashTarget:pe.CASH_TARGET,duration:pe.DURATION_YEARS,baseSalary:pe.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Es.PROTECTION_MULTIPLIER,consecutiveLimit:pe.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Es.HODL_ENABLED,hodlValue:Es.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function nu(){return De()&&lt()}function ss(){_s=null}function sx(){return _s||jr()}async function ty(){if(_s)return _s;if(!nu())return console.warn("Firebase not available - returning defaults"),jr();try{const t=await jI();if(t){const e={settings:t,lastModified:new Date().toISOString(),checksum:null};return _s=ox(e),_s}}catch(t){console.error("Error loading stress data:",t)}return jr()}async function ix(t){if(!nu())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=rx(t),await Dg(t.settings),_s=t}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function rx(t){return La(t.settings)}function ox(t){const e={...jr()};return t.settings&&(e.settings={...e.settings,...t.settings},t.settings.pacwMin!==void 0&&t.settings.equityMin===void 0&&(e.settings.equityMin=t.settings.pacwMin),t.settings.cgtMin!==void 0&&t.settings.bondMin===void 0&&(e.settings.bondMin=t.settings.cgtMin),t.settings.csh2Target!==void 0&&t.settings.cashTarget===void 0&&(e.settings.cashTarget=t.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=t.lastModified,e.checksum=t.checksum,e}function ax(){return sx().settings}async function wt(){return(await ty()).settings}async function _o(t){const e=await ty();e.settings={...e.settings,...t},await ix(e)}async function lx(){if(!nu())throw new Error("Must be logged in to reset settings");const t=jr();await Dg(t.settings),ss()}function cx(t){return tu(t)}function Eo(t={},e=null){const n=e||ax(),s=cx(n),i=s?{spStartYear:s.spStartYear,spWeeklyAmount:s.spWeeklyAmount,spFirstYearRatio:s.spFirstYearRatio}:{statePension:n.statePension||0,statePensionYear:n.statePensionYear??999},r=dx(n.taggedFunds);return{...r?{isaMix:r}:{},equityStart:t.equityStart??n.equityMin,bondStart:t.bondStart??n.bondMin,cashStart:t.cashStart??n.cashTarget,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,years:t.years??n.duration,duration:n.duration,baseSalary:n.baseSalary,other:n.other,...i,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode,protectionMult:n.protectionMult??(n.protectionFactor!=null?1-n.protectionFactor/100:Es.PROTECTION_MULTIPLIER),consecutiveLimit:n.consecutiveLimit,disableProtection:n.disableProtection,hodlEnabled:n.hodlEnabled,hodlValue:n.hodlValue,isaBalance:n.isaBalance||0,isaReturn:n.isaReturn,accessMethod:n.accessMethod||"drawdown",recoveryBuffer:n.recoveryBuffer??pe.RECOVERY_BUFFER,ufplsYears:n.ufplsYears||null,ufplsThenPcls:!!n.ufplsThenPcls,bandFillRecycle:!!n.bandFillRecycle,targetSchedule:Array.isArray(n.targetSchedule)?n.targetSchedule:null,dbAmount:n.dbAmount||0,dbStartYear:n.dbStartYear||0,dbIndexation:n.dbIndexation||"lpi5",isaDrawdownStrategy:n.isaDrawdownStrategy,spendingProfile:n.spendingProfile||"flat",equityGlide:n.equityGlideEnabled?$g(n):void 0,diversifierStart:t.diversifierStart??(n.diversifierStart||void 0),subAsset:n.subAsset||void 0}}function dx(t){const e=(t||[]).filter(i=>(i.wrapper||"").toUpperCase()==="ISA"&&+i.value>0);if(!e.length)return null;const n=hl(e.map(i=>({...i,wrapper:"SIPP"})));if(!(n.total>0))return null;const s={shares:n.buckets.shares/n.total,bonds:n.buckets.bonds/n.total,diversifiers:n.buckets.diversifiers/n.total,cash:n.buckets.cash/n.total};return Object.keys(n.bondWeights).length&&(s.bondWeights=n.bondWeights),Object.keys(n.diversifierWeights).length&&(s.diversifierWeights=n.diversifierWeights),s}async function su(){try{const t=await JI();return{...Yr(),...t||{}}}catch(t){return console.error("Error loading budget:",t),Yr()}}async function iu(t){const e={...t,derived:Zi(t)};return await XI(e),e}function j(t,e=null){const n=Math.abs(t),s=e!==null?e:n<100,i=Math.abs(t).toLocaleString("en-GB",{minimumFractionDigits:s?2:0,maximumFractionDigits:s?2:0});return t<0?`-£${i}`:`£${i}`}function Bf(t,e){const n=ux(t);e.innerHTML=n}function ux(t){var E,x,y,te,re;const e=t,n=e.calculationDetails||{};let s="";const i=e.isTaxEfficientYear??e.taxEfficient,r=e.protectionInducedTaxEfficiency||!1,o=e.boostAmount>0;let l,c,d;if(e.inProtection?(l="warning",c="Protection Mode",d="⚡"):o?(l="boost",c="Tax Boost (Catch-up)",d="↑"):r?(l="info",c="Protection-Induced Tax Efficiency",d="↑"):i?(l="success",c="Tax-Efficient Year",d="✓"):(l="warning",c="Tax-Inefficient Year",d="!"),s+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,i&&e.yearlyIsaSavingsAllocation>0){const q=e.cumulativeIsaSavingsUsed||0,ne=e.yearlyIsaSavingsAllocation,se=Math.max(0,ne-q),oe=ne>0?q/ne*100:0;s+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(oe,100)}%"></div>
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
    </div>`),e.alerts&&e.alerts.length>0){s+='<div class="alerts">';for(const q of e.alerts){const ne=hx(q.severity);s+=`<div class="alert ${ne}">${q.message}</div>`}s+="</div>"}s+='<div class="recommendation-card">',s+="<h3>Monthly Recommendation</h3>",s+='<div class="draw-row primary">',s+='<span class="label">SIPP Withdrawal</span>',s+=`<span class="value">${j(e.sippDraw)}</span>`,s+="</div>",e.isaDraw>0&&(s+='<div class="draw-row">',s+='<span class="label">ISA Top-up</span>',s+=`<span class="value">${j(e.isaDraw)}</span>`,s+="</div>"),e.recycleNet>0&&(s+='<div class="draw-row">',s+='<span class="label">of which: recycle to ISA (band-fill)</span>',s+=`<span class="value">${j(e.recycleNet)}</span>`,s+="</div>",s+=`<div class="alert alert-info" style="margin:6px 0;">💡 Your SIPP withdrawal above includes an extra ${j(e.recycleGross)} to fill your basic-rate band. After 20% tax, contribute <strong>${j(e.recycleNet)}</strong> of it to your ISA — it comes out tax-free later. (Counts toward your £20,000 ISA allowance.)</div>`),e.other>0&&(s+='<div class="draw-row muted">',s+='<span class="label">Other Pension</span>',s+=`<span class="value">${j(e.other)}</span>`,s+="</div>"),e.statePension>0&&(s+='<div class="draw-row muted">',s+='<span class="label">State Pension</span>',s+=`<span class="value">${j(e.statePension)}</span>`,s+="</div>"),s+='<div class="divider"></div>';const h=e.sippDraw+e.other+e.statePension,m=h*12,p=e.pa||12570,w=e.brl||50270;let I=0;m>p&&(m<=w?I=(m-p)*.2:I=(w-p)*.2+(m-w)*.4);const S=h-I/12+e.isaDraw;s+='<div class="draw-row total">',s+='<span class="label">Total Monthly Income</span>',s+=`<span class="value">${j(S)}</span>`,s+="</div>",e.boostAmount>0&&(s+='<div class="boost-indicator">',s+='<span class="boost-label">Includes Tax Boost:</span>',s+=`<span class="boost-value">+${j(e.boostAmount)}</span>`,s+="</div>"),s+="</div>",s+='<div class="source-card">',s+="<h4>Withdraw From</h4>",s+=`<div class="source-label ${e.source.toLowerCase().replace(/[^a-z]+/g,"-")}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(s+='<div class="source-breakdown">',e.drawFromEquity>0&&(s+=`<div class="source-item">Equity: ${j(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(s+=`<div class="source-item">Bond: ${j(e.drawFromBond)}</div>`),s+="</div>"),e.drawFromDiversifier>0&&(s+='<div class="source-breakdown">',e.drawFromCash>0&&(s+=`<div class="source-item">Cash: ${j(e.drawFromCash)}</div>`),s+=`<div class="source-item">Diversifier reserve: ${j(e.drawFromDiversifier)}</div>`,s+="</div>"),s+="</div>",s+='<div class="fund-status">',s+="<h4>Fund Status</h4>";const A=e.equity+e.bond+e.cash+(e.diversifier||0),P=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,C=A-P,L=P>0?C/P*100:0;s+='<div class="fund-grid">';const D=e.equity-e.adjEquityMin;s+=Yo("Equity",e.equity,e.adjEquityMin,D);const O=e.bond-e.adjBondMin;s+=Yo("Bond",e.bond,e.adjBondMin,O);const U=e.cash-e.adjCashTarget;s+=Yo("Cash",e.cash,e.adjCashTarget,U),e.diversifier!=null&&(s+=Yo("Diversifiers",e.diversifier,0,e.diversifier)),s+="</div>";const T=C>=0?"healthy":"warning";s+=`<div class="overall-status ${T}">`,s+=`<span>Total Surplus: ${j(C)}</span>`,s+=`<span>(${L.toFixed(1)}% above target)</span>`,s+="</div>",s+="</div>",s+='<div class="tax-info">',s+="<h4>Tax Summary</h4>",s+='<div class="tax-thresholds">',s+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${j(e.pa)}</span></div>`,s+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${j(e.brl)}</span></div>`,n.taxInfo&&(s+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${n.taxInfo.headroomToBRL>0?"success":"warning"}">${j(n.taxInfo.headroomToBRL)}</span></div>`),s+="</div>",s+='<div class="tax-comparison">',s+='<div class="tax-comparison-header">',s+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",s+="</div>";const v=((E=n.taxInfo)==null?void 0:E.monthlyTax)||I/12,_=e.taxPaidYTD||v,b=e.taxProjectedAnnual||((x=n.taxInfo)==null?void 0:x.annualTax)||I;if(s+='<div class="tax-comparison-row">',s+='<div class="label">Tax Paid</div>',s+=`<div>${j(v)}</div>`,s+=`<div>${j(_)}</div>`,s+=`<div>${j(b)}</div>`,s+="</div>",i||((y=n.taxInfo)==null?void 0:y.taxSavedAnnual)>0){const q=e.taxSavedMonthly||((te=n.taxInfo)==null?void 0:te.taxSavedMonthly)||0,ne=e.taxSavedYTD||q,se=e.taxSavedProjectedAnnual||((re=n.taxInfo)==null?void 0:re.taxSavedAnnual)||0;se>0&&(s+='<div class="tax-comparison-row saved">',s+='<div class="label">Tax Saved</div>',s+=`<div class="success">-${j(q)}</div>`,s+=`<div class="success">-${j(ne)}</div>`,s+=`<div class="success">-${j(se)}</div>`,s+="</div>")}if(s+="</div>",n.taxInfo&&typeof n.taxInfo.effectiveRate=="number"&&!isNaN(n.taxInfo.effectiveRate)){const q=n.taxInfo.effectiveRate*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${q<=20?"success":q<=40?"warning":"danger"}">${q.toFixed(1)}%</span>
    </div>`}else if(n.taxInfo&&n.taxInfo.annualTaxable>0&&n.taxInfo.annualTax>=0){const q=n.taxInfo.annualTax/n.taxInfo.annualTaxable*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${q<=20?"success":q<=40?"warning":"danger"}">${q.toFixed(1)}%</span>
    </div>`}if(s+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){s+='<div class="rebalance-card">',s+="<h4>Rebalancing Suggestions</h4>",s+="<ul>";for(const q of e.rebalanceActions)s+=`<li>${q}</li>`;s+="</ul>",s+="</div>"}return s+='<div class="mode-explanation">',s+="<h4>Why This Recommendation?</h4>",s+=`<p>${n.reason||"Standard calculation based on your settings."}</p>`,!n.hasSufficientIsa&&n.isaNeededMonthly>0&&(s+=`<p class="isa-warning">To enable tax-efficient mode, you need ${j(n.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),s+="</div>",s+='<details class="debug-section">',s+="<summary>Calculation Details</summary>",s+="<pre>"+JSON.stringify(n,null,2)+"</pre>",s+="</details>",s}function Yo(t,e,n,s){return`<div class="fund-cell ${s>=0?"healthy":"deficit"}">
    <div class="fund-name">${t}</div>
    <div class="fund-current">${j(e)}</div>
    <div class="fund-min">Min: ${j(n)}</div>
    <div class="fund-surplus">${s>=0?"+":""}${j(s)}</div>
  </div>`}function hx(t){switch(t){case $o.DANGER:return"alert-danger";case $o.WARNING:return"alert-warning";case $o.SUCCESS:return"alert-success";case $o.INFO:default:return"alert-info"}}function fx(){return`
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
  `}async function px(t){const e=eu(t),n=dl(e),s=e.getMonth()+1;return await iS(n)?{showWizard:!1,taxYear:n,isApril:s===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:n,isApril:s===4,reason:`Tax year ${n} has not been set up`}}function mx(t,e,n=0){return t*(1+e-n)}function gx(t){const{targetAnnualGross:e,brl:n,pa:s=12570,remainingMonths:i,grossIncomeToDate:r=0}=t,o=I=>I<=s?0:I<=n?(I-s)*.2:(n-s)*.2+(I-n)*.4,l=Math.max(0,n-r);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=n)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=o(e),d=e-c,h=o(n),m=n-h,p=Math.max(0,d-m),w=p/12*i;return{isaNeeded:w,isaNeededAnnual:p,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:h,reason:`Need £${Math.round(w).toLocaleString()} ISA/Savings for tax efficiency`}}function yx(t,e,n){return n?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:t>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-t,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function vx(t){const e=eu(t),n=dl(e),i=e.getMonth()+1===4,r=ZS(e),o=await bt(),l=await ol(n),c=await cs(),h=Object.keys(c).sort().filter(L=>L<n).pop()||null,m=h?c[h]:null,p=await jd(n),w=(m==null?void 0:m.cpi)||Ba,I=o.spendingProfile||"flat",S=Math.max(0,2e3+(parseInt(n.split("/")[0],10)||26)-2026),A=zS(S,I),P=m&&m.confirmedSalary||o.baseSalary,C=mx(P,w,A);return{taxYear:n,selectedMonth:t,isApril:i,remainingMonths:r,baseSalary:o.baseSalary,suggestionBase:P,spendingProfile:I,declineRate:A,suggestedSalary:C,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:w,other:(m==null?void 0:m.other)||0},statePension:p,existingConfig:l.yearSetupComplete?l:null}}function ny(t){const{targetSalary:e,brl:n,pa:s=12570,other:i=0,statePension:r=0,isaSavingsAllocation:o=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=t,h=x=>x<=s?0:x<=n?(x-s)*.2:(n-s)*.2+(x-n)*.4,m=i/12,p=r/12,w=m+p;let I,S;if(!d)I=e/12-w,S=0;else{const x=Math.max(0,n-c),y=Math.max(0,x/l-w);I=Math.min(e/12-w,y),S=o/l}const A=(I+w)*12,C=h(A)/12,L=I+w,D=L>0?C/L:0,O=I*D,U=m*D,T=p*D,v=I-O,_=m-U,b=p-T,E=v+_+b+S;return{sipp:{gross:I,tax:O,net:v},other:{gross:m,tax:U,net:_},statePension:{gross:p,tax:T,net:b},isa:{gross:S,tax:0,net:S},totalGross:I+m+p+S,totalTax:C,totalNet:E,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:I,monthlyIsa:S,monthlyOther:m,monthlyStatePension:p,monthlyTotal:E}}function bx(t){var S,A,P,C,L,D,O,U,T,v,_;const{pa:e,brl:n,hrl:s,cpi:i,other:r,isaSavingsAllocation:o,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:h,confirmedSalary:m,remainingMonths:p,statePension:w,monthlyBreakdown:I}=t;return{pa:e,brl:n,hrl:s,cpi:i,other:r,isaSavingsAllocation:l?o:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:h||4,remainingMonths:p||12,yearSetupComplete:!0,confirmedSalary:m,statePension:w||0,expectedMonthly:I?{sipp:{gross:((S=I.sipp)==null?void 0:S.gross)||0,tax:((A=I.sipp)==null?void 0:A.tax)||0,net:((P=I.sipp)==null?void 0:P.net)||0},other:{gross:((C=I.other)==null?void 0:C.gross)||0,tax:((L=I.other)==null?void 0:L.tax)||0,net:((D=I.other)==null?void 0:D.net)||0},statePension:{gross:((O=I.statePension)==null?void 0:O.gross)||0,tax:((U=I.statePension)==null?void 0:U.tax)||0,net:((T=I.statePension)==null?void 0:T.net)||0},isa:{gross:((v=I.isa)==null?void 0:v.gross)||0,tax:0,net:((_=I.isa)==null?void 0:_.net)||0},totalGross:I.totalGross||0,totalTax:I.totalTax||0,totalNet:I.totalNet||0}:null}}let Qs=null,Kr=null,en=1,J=null,z={};async function wx(t,e,n){Qs=t,Kr=n,en=1,z={},J=await vx(e),z={pa:J.defaults.pa,brl:J.defaults.brl,hrl:J.defaults.hrl,cpi:J.defaults.cpi,other:J.defaults.other,grossIncomeToDate:0,confirmedSalary:J.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},Mr()}async function _x(t){return await px(t)}function Mr(){if(!Qs||!J)return;const t=J.isApril?6:7;Qs.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${J.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${J.isApril?"Setting up for the full tax year":`Starting in ${ru(J.selectedMonth)} - ${J.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${Ix(t,en)}
        </div>

        ${Ex()}
      </div>
    </div>
  `,Sx()}function Ex(){if(J.isApril,J.isApril)switch(en){case 1:return Lf();case 2:return Nf();case 3:return Of();case 4:return Ff();case 5:return Vf();case 6:return zf();default:return""}else switch(en){case 1:return Lf();case 2:return Tx();case 3:return Nf();case 4:return Of();case 5:return Ff();case 6:return Vf();case 7:return zf();default:return""}}function Lf(){return`
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
  `}function Tx(){const t=ru(J.selectedMonth),e=Cx(J.selectedMonth);return`
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
  `}function Nf(){const t=z.cpi!==void 0?z.cpi:J.defaults.cpi,e=(t*100).toFixed(1),n=J.suggestionBase??J.baseSalary,s=J.declineRate||0,i=Math.round(n*(1+t-s)),r=s>0,o=((t-s)*100).toFixed(1);return`
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
        ${r?`<p>Your plan uses <strong>declining spending</strong> (~${(s*100).toFixed(0)}%/yr real). Last year's salary rises with <span id="cpiDisplay">${e}</span>% CPI less that decline — a net <strong><span id="netUpliftDisplay">${o}</span>%</strong> — to:</p>`:`<p>Based on <span id="cpiDisplay">${e}</span>% inflation, your target salary should be:<span id="netUpliftDisplay" hidden>${o}</span></p>`}
        <p style="font-size: 24px; color: var(--primary); margin: 12px 0;">£<span id="suggestedSalaryDisplay">${i.toLocaleString()}</span></p>
        <p>per year (gross)</p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Confirm or adjust your target salary:
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizSalary" value="${Math.round(z.confirmedSalary||i)}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function Of(){const t=J.statePension,e=t.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(t.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${t.yearsUntil} years until state pension</span>`;return`
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
  `}function Ff(){To();const t=gx({targetAnnualGross:z.confirmedSalary,brl:z.brl,pa:z.pa,other:z.other,statePension:J.statePension.amount,remainingMonths:J.remainingMonths,grossIncomeToDate:z.grossIncomeToDate});return z._isaCalc=t,t.brlExhausted?`
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
  `}function Vf(){To();const t=z._isaCalc,e=yx(z.isaSavingsAllocation,(t==null?void 0:t.isaNeeded)||0,(t==null?void 0:t.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return z.isTaxEfficient=!0,z.taxEfficiencyChoice="efficient",setTimeout(()=>{en++,Mr()},0),`
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
  `}function zf(){To();const t=ny({targetSalary:z.confirmedSalary,brl:z.brl,pa:z.pa,other:z.other,statePension:J.statePension.amount,isaSavingsAllocation:z.isaSavingsAllocation,remainingMonths:J.remainingMonths,grossIncomeToDate:z.grossIncomeToDate,isTaxEfficient:z.isTaxEfficient}),e=z.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",n=z.isTaxEfficient?"success":"warning",s=i=>`£${Math.round(i).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${J.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${ru(J.selectedMonth)}</span>
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
  `}function Ix(t,e){let n="";for(let s=1;s<=t;s++){const i=s<e?"done":s===e?"active":"";n+=`<div class="wizard-dot ${i}"></div>`}return n}function Sx(){Qs.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>xx(e.dataset.action))}),window._updateWizardSalary=function(){const e=document.getElementById("wizCPI"),n=document.getElementById("wizSalary"),s=document.getElementById("cpiDisplay"),i=document.getElementById("suggestedSalaryDisplay");if(e&&n&&s&&i){const r=parseFloat(e.value)||0,o=r/100,l=J.suggestionBase??J.baseSalary,c=J.declineRate||0,d=Math.round(l*(1+o-c));s.textContent=r.toFixed(1),i.textContent=d.toLocaleString();const h=document.getElementById("netUpliftDisplay");h&&(h.textContent=((o-c)*100).toFixed(1)),n.value=d,z.cpi=o,z.confirmedSalary=d}}}function xx(t){To();const e=J.isApril?6:7;switch(t){case"cancel":sy(),Kr&&Kr({completed:!1,cancelled:!0});break;case"next":en<e&&(en++,Mr());break;case"back":en>1&&(en--,Mr());break;case"apply-choice":Ax(),en++,Mr();break;case"finish":kx();break}}function Ax(){var e;const t=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch(z.taxEfficiencyChoice=t,t){case"increase":z.isaSavingsAllocation=z._isaCalc.isaNeeded,z.isTaxEfficient=!0;break;case"reduced":z.confirmedSalary=z.brl,z.isaSavingsAllocation=0,z.isTaxEfficient=!0;break;case"inefficient":z.isaSavingsAllocation=0,z.isTaxEfficient=!1;break}}function To(){const t=document.getElementById("wizPA");t&&(z.pa=parseFloat(t.value)||12570);const e=document.getElementById("wizBRL");e&&(z.brl=parseFloat(e.value)||50270);const n=document.getElementById("wizHRL");n&&(z.hrl=parseFloat(n.value)||125140);const s=document.getElementById("wizCPI");s&&(z.cpi=(parseFloat(s.value)||Ba*100)/100);const i=document.getElementById("wizSalary");i&&(z.confirmedSalary=parseFloat(i.value)||3e4);const r=document.getElementById("wizOther");r&&(z.other=parseFloat(r.value)||0);const o=document.getElementById("wizISA");o&&(z.isaSavingsAllocation=parseFloat(o.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(z.grossIncomeToDate=parseFloat(l.value)||0)}async function kx(){To();const t=ny({targetSalary:z.confirmedSalary,brl:z.brl,pa:z.pa,other:z.other,statePension:J.statePension.amount,isaSavingsAllocation:z.isaSavingsAllocation,remainingMonths:J.remainingMonths,grossIncomeToDate:z.grossIncomeToDate,isTaxEfficient:z.isTaxEfficient}),e=bx({pa:z.pa,brl:z.brl,hrl:z.hrl,cpi:z.cpi,other:z.other,isaSavingsAllocation:z.isaSavingsAllocation,isTaxEfficient:z.isTaxEfficient,taxEfficiencyChoice:z.taxEfficiencyChoice,grossIncomeToDate:z.grossIncomeToDate,startMonth:parseInt(J.selectedMonth.split("-")[1]),confirmedSalary:z.confirmedSalary,remainingMonths:J.remainingMonths,statePension:J.statePension.amount,monthlyBreakdown:t});console.log(`Tax Year Wizard: Saving config for ${J.taxYear}`,e);try{await hi(J.taxYear,e),console.log(`Tax Year Wizard: Successfully saved config for ${J.taxYear}`)}catch(n){console.error(`Tax Year Wizard: Failed to save config for ${J.taxYear}`,n),typeof window.showToast=="function"&&window.showToast(`Error saving tax year configuration: ${n.message}`,"error");return}sy(),Kr&&Kr({completed:!0,taxYear:J.taxYear,config:e,wizardInputs:z})}function sy(){Qs&&(Qs.innerHTML="",Qs.style.display="none")}function ru(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function Cx(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-2,1).toLocaleString("default",{month:"long"})}function Rx(){return`
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
  `}function Px(t={},e=null){const n=Eo(t,e),s=Qg(n),i=Xg(s);return{results:s,stats:i,config:n}}function Mx(t={},e=null){const n=Eo(t,e),s=Jg(n),i=Xg(s);return{results:s,stats:i,config:n}}function Dx(t={}){const e=Eo(t),n={};for(const[s,i]of Object.entries(fv))n[s]={...i,result:jS(e,i)};return n}let oi=Qd,Dr=null,$f=!1,Ec=!1,iy=null;function fl(){return oi}function qi(t){const e=(t||"").toUpperCase().trim();return oi.find(n=>n.ticker===e)||null}function Bx(){return Ec}function Lx(){return iy}function Nx(){return Dr}async function Ox(){if(!($f||!De()||!we)){$f=!0;try{const t=await Tr(St(we,"adminPrivate","access"));Ec=!0,iy=t.exists()&&t.data().passphrase||null}catch{Ec=!1}try{const[t,e,n]=await Promise.all([Tr(St(we,"admin","fundCatalogue")),Tr(St(we,"admin","subAssetProfiles")),Tr(St(we,"admin","typicalAmounts"))]);if(t.exists()){const s=t.data().funds;Array.isArray(s)&&s.length&&s.every(i=>i.ticker&&i.subClass)&&(oi=Object.freeze([...s].sort((i,r)=>i.ticker.localeCompare(r.ticker))),console.log("AdminConfig: fund catalogue override active ("+oi.length+" funds)"))}if(e.exists()&&(Dr=e.data().overrides||null,Dr&&(Hg(Dr),console.log("AdminConfig: sub-asset profile overrides active"))),n.exists()){const s=n.data().tiers;s&&typeof s=="object"&&(BI(s),console.log("AdminConfig: typical-amounts override active"))}}catch(t){console.warn("AdminConfig: using code defaults ("+t.message+")")}}}async function Fx(t){const e=(t||[]).filter(n=>n.ticker&&n.subClass).map(n=>({ticker:String(n.ticker).toUpperCase().trim(),name:String(n.name||""),subClass:n.subClass}));return await Fd(St(we,"admin","fundCatalogue"),{funds:e,updatedAt:Vd()}),oi=Object.freeze([...e].sort((n,s)=>n.ticker.localeCompare(s.ticker))),oi.length}async function Vx(){await tl(St(we,"admin","fundCatalogue")),oi=Qd}async function ry(t){const e=t&&Object.keys(t).length?t:null;e?await Fd(St(we,"admin","subAssetProfiles"),{overrides:e,updatedAt:Vd()}):await tl(St(we,"admin","subAssetProfiles")),Dr=e,Hg(e)}function zx({ticker:t,name:e,subClass:n}){try{const s=kn();if(!s||!De()||!we||!t)return;pg(Ed(we,"fundSuggestions"),{ticker:String(t).toUpperCase().trim().slice(0,12),name:String(e||"").slice(0,80),subClass:String(n||"").slice(0,40),uid:s.uid,createdAt:Vd()}).catch(()=>{})}catch{}}async function $x(t=100){return(await fg(dI(Ed(we,"fundSuggestions"),uI("createdAt","desc"),hI(t)))).docs.map(n=>({id:n.id,...n.data()}))}async function Ux(t){await tl(St(we,"fundSuggestions",t))}function oy(t){return dl(eu(t))}function qx(t){const[e,n]=t.split("-").map(Number);return Math.max(0,(n>=4?e:e-1)-2026)}async function Hx(t,e,n,s,i){var xo,Vn,Ao,ko;const r=i.settings,o=i.history,l=i.allTaxYears,c=oy(t),d=qx(t),[h,m]=t.split("-").map(Number);if(!l[c])throw new Error(`Tax year ${c} is not configured. Please add it in the Settings tab before calculating.`);const p=l[c],w=p.pa||12570,I=p.brl||50270,S=p.hrl||125140,A=p.other||0,P=p.isTaxEfficient!==!1,C=p.isaSavingsAllocation||0,L=p.grossIncomeToDate||0,D=p.confirmedSalary||r.baseSalary,O=o.find(W=>W.date===t),U=(O==null?void 0:O.isa)||0,T=Math.max(0,(p.isaSavingsUsed||0)-U),_=i.spInfo.amount||0;let b=1;for(let W=0;W<d;W++){const Re=String((26+W)%100).padStart(2,"0")+"/"+String((27+W)%100).padStart(2,"0"),je=(l[Re]||{}).cpi||Ba;b*=1+je}let E=Qn(r.equityMin,d,r.duration,b,!0),x=Qn(r.bondMin,d,r.duration,b,!0);const y=Math.round(Qn(r.cashTarget,d,r.duration,b,!1)),te=al(r.equityGlide,d,r.duration);if(te!=null){const W=E+x;E=W*te,x=W*(1-te)}E=Math.round(E),x=Math.round(x);const re=e+n,q=E+x;let ne=0;const se=o.filter(W=>W.date<t);for(let W=se.length-1;W>=0&&se[W].source==="Cash";W--)ne++;const oe=r.disableProtection?!1:Ug({totalGrowth:re,minGrowth:q,consecCashDraws:ne,wasInProtection:se.length>0&&se[se.length-1].inProtection,consecutiveLimit:r.consecutiveLimit||3,recoveryBuffer:r.recoveryBuffer||ka.RECOVERY_BUFFER}),ve=m>=4?16-m:4-m,Te=Math.max(1,ve),ie=p.confirmedSalary?p.confirmedSalary:r.baseSalary*b,F=A+_;Wt(ie,w,I,S);let X,Ie,Et,Vt=0,Ye=0,me=!1,de=0;const Qe=268275,sn=o.reduce((W,Re)=>W+(Re.taxFree||0),0),Kt=!r.ufplsYears||d<r.ufplsYears,ze=r.accessMethod==="ufpls"&&Kt&&sn<Qe,$e=ze?.25:0;let pn=0;r.accessMethod==="ufpls"&&r.ufplsThenPcls&&r.ufplsYears>0&&d===Math.floor(r.ufplsYears)&&sn<Qe&&(pn=Math.max(0,Math.min(.25*(e+n+s),Qe-sn)));const Rt=Math.max(1,Math.min(12,p.remainingMonths||12)),zt=Rt<12&&L||0,mn=Math.max(0,C-T)/Te;if(P){const W=F/12;o.filter(ue=>ue.taxYear===c&&ue.date<t);const Re=ie/12,je=i.isaBalance||0;let qe,He;if(je>0){const ue=Aa({targetGross:ie,fixedIncome:F+zt,pa:w,brl:I,hrl:S,taxFreeFraction:$e,isaBalance:je,strategy:r.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0});qe=ue.sippGross/Rt,He=ue.isaDraw/Rt}else{if(((Vn=(xo=p.expectedMonthly)==null?void 0:xo.sipp)==null?void 0:Vn.gross)>0)qe=p.expectedMonthly.sipp.gross;else{const Dt=Math.max(0,I-L-F)/(1-$e)/12;qe=Math.min(Re-W,Dt)}const ue=Wt(ie,w,I,S)/12,dt=Math.min(ie,I),tt=Wt(dt,w,I,S)/12,vn=Math.max(0,ue-tt);He=Math.min(vn,mn)}if(de=He,Vt=qe,oe){const ue=(r.protectionFactor||20)/100;X=qe*(1-ue),Ie=He,Et="Protection"}else{X=qe,Ie=He,Et="Tax-Efficient";const ue=m>=4?h:h-1,dt=se.filter(Dt=>{const[Co,mi]=Dt.date.split("-").map(Number);return(mi>=4?Co:Co-1)===ue});let tt=0,vn=0;dt.forEach(Dt=>{vn+=Dt.sipp||0,Dt.inProtection&&Dt.stdSipp&&(tt+=Dt.stdSipp-Dt.sipp),Dt.boostAmount>0&&(tt-=Dt.boostAmount)});const or=(vn+X*Te)*(1-$e)+F;Ye=oa({shortfall:tt,standardMonthly:qe,remainingMonths:Te,surplus:re-q-Ri.SURPLUS_BUFFER,brlHeadroom:I-or}),Ye>50&&(X+=Ye,Et="Tax Boost")}}else{let W;((ko=(Ao=p.expectedMonthly)==null?void 0:Ao.sipp)==null?void 0:ko.gross)>0?W=p.expectedMonthly.sipp.gross:W=Aa({targetGross:ie,fixedIncome:F+zt,pa:w,brl:I,hrl:S,taxFreeFraction:$e,isaBalance:0,strategy:r.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0}).sippGross/Rt,Vt=W,Ie=0;const Re=m>=4?h:h-1,je=se.filter(ue=>{const[dt,tt]=ue.date.split("-").map(Number);return(tt>=4?dt:dt-1)===Re});let qe=0,He=0;if(je.forEach(ue=>{He+=ue.sipp||0,ue.inProtection&&ue.stdSipp&&(qe+=ue.stdSipp-ue.sipp),ue.boostAmount>0&&(qe-=ue.boostAmount)}),oe){const ue=(r.protectionFactor||20)/100;X=W*(1-ue),Et="Protection";const dt=(He+X*Te)*(1-$e)+F,tt=I-dt;Ye=oa({shortfall:tt,standardMonthly:W,remainingMonths:Te,surplus:re-q-Ri.SURPLUS_BUFFER,brlHeadroom:tt}),Ye>0&&(X+=Ye,me=!0,Et="Protection-Induced Efficiency")}else{X=W,Et="Tax-Inefficient";const ue=(He+X*Te)*(1-$e)+F;Ye=oa({shortfall:qe,standardMonthly:W,remainingMonths:Te,surplus:re-q-Ri.SURPLUS_BUFFER,brlHeadroom:I-ue}),Ye>0&&(X+=Ye,Et="Tax Boost")}}let Mn=0,Fs=0;if(r.bandFillRecycle&&$e===0&&!oe){const W=m>=4?h:h-1,Re=se.filter(dt=>{const[tt,vn]=dt.date.split("-").map(Number);return(vn>=4?tt:tt-1)===W});let je=0,qe=0;Re.forEach(dt=>{je+=dt.sipp||0,qe+=dt.recycleNet||0});const He=je+X*Te+F+zt,ue=qg({brlHeadroom:I-He,remainingMonths:Te,isaAllowanceLeft:Kd.ISA_ANNUAL_ALLOWANCE-qe});Mn=ue.gross,Fs=ue.net,Mn>0&&(X+=Mn)}const rn=i.diversifier||0;let Pt,gn,Oe=0,Ue=0,Mt=0,us=0,on="";if(!oe&&re>=q+X){Pt="Growth";const W=Math.max(0,e-E),Re=Math.max(0,n-x),je=W+Re;je>0?(Oe=X*W/je,Ue=X*Re/je,gn="Healthy"):(Pt="Cash",Mt=X,gn="At min")}else if(Pt="Cash",gn=oe?"Protection":"Below min",rn>0){Mt=Math.min(s,X);let W=X-Mt;W>0&&(us=Math.min(rn,W),W-=us,Pt=Mt>0?"Cash + Diversifier":"Diversifier"),W>0&&(on="Cash low!")}else Mt=X,s<X&&(on="Cash low!");let $t="";const Ut=e-E,Le=n-x;if(Ut>5e3&&Le<-5e3){const W=Math.floor(Math.min(Ut,-Le)/1e3)*1e3;W>=5e3&&($t=`Move £${W.toLocaleString()} Equity→Bond`)}else if(Le>5e3&&Ut<-5e3){const W=Math.floor(Math.min(Le,-Ut)/1e3)*1e3;W>=5e3&&($t=`Move £${W.toLocaleString()} Bond→Equity`)}let an="";const Dn=y-s;if(Dn>5e3&&Pt==="Growth"&&!oe){const W=re-q-X;if(W>1e4){const Re=Math.floor(Math.min(Dn*.3,W*.5)/1e3)*1e3;Re>=5e3&&(an=`Replenish Cash: Move £${Re.toLocaleString()} from growth funds`)}}const yn=[];on&&yn.push({message:on,severity:"danger",type:"low-cash"}),Ye>50&&yn.push({message:`Tax Boost: +£${Math.round(Ye).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),$t&&yn.push({message:$t,severity:"warning",type:"rebalance"}),an&&yn.push({message:an,severity:"info",type:"cash-replenish"});const Bn=m>=4?h:h-1,Ln=se.filter(W=>{const[Re,je]=W.date.split("-").map(Number);return(je>=4?Re:Re-1)===Bn}),pi=Ln.reduce((W,Re)=>W+(Re.sipp||0),0),Nn=Ln.length+1,On=Math.max(0,Rt-Nn)*Vt,Fe=(pi+X+On)*(1-$e)+A+_+zt,G=ra(Fe,w,I,S),Se=(G-ra(zt,w,I,S))/Rt,Tt=X+A/12+_/12-Se+Ie,Jt=Se*Nn,et=G,So=ie/12,Vs=ra(So*12,w,I,S),Fn=Math.max(0,Vs/12-G/12),El=T+de;return{date:t,taxYear:c,yearNumber:d,remainingMonths:Te,equity:e,bond:n,cash:s,isa:0,adjEquityMin:E,adjBondMin:x,adjCashTarget:y,pa:w,brl:I,other:A/12,statePension:_/12,sippDraw:X,stdSipp:Vt,isaDraw:Ie,totalMonthlyNet:Tt,monthlyTax:Se,taxFree:X*$e,accessMethod:ze?"ufpls":"drawdown",lsaRemaining:ze?Math.max(0,Qe-sn):null,pclsSuggestion:pn,recycleGross:Mn,recycleNet:Fs,isTaxEfficientYear:P,yearlyIsaSavingsAllocation:C,cumulativeIsaSavingsUsed:El,isaSavingsUsedThisMonth:de,taxPaidYTD:Jt,taxProjectedAnnual:et,taxSavedMonthly:Fn,taxSavedYTD:Fn*Nn,taxSavedProjectedAnnual:Fn*12,taxEfficient:P&&!me,inProtection:oe,protectionReason:oe?gn:null,consecutiveCashDraws:ne,protectionInducedTaxEfficiency:me,boostAmount:Ye>50?Ye:0,boostEligible:Ye>50,source:Pt,drawFromEquity:Oe,drawFromBond:Ue,drawFromCash:Mt,...rn>0?{drawFromDiversifier:us,diversifier:rn}:{},rebalanceNeeded:$t!=="",rebalanceActions:$t?[$t]:[],alerts:yn,calculationDetails:{mode:Et,reason:`${gn} | ${Et}`,totalGrowth:re,minGrowth:q,consec:ne,stdSipp:X,inputs:{baseSalary:r.baseSalary,confirmedSalary:D,targetGross:ie,cumInf:b,yearNum:d,taxYear:c,OTHER:A,STATE:_,PA:w,BRL:I,isTaxEfficientYear:P,yearlyIsaSavingsAllocation:C,grossIncomeToDate:L},taxInfo:{annualTaxable:Fe,headroomToBRL:I-Fe,annualTax:G,monthlyNet:Tt}}}}let Qr=null;function Wx(t,e){Qr=t,Gx(e)}function Gx({onGetStarted:t,onSignIn:e}){Qr&&(Qr.innerHTML=`
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
  `,document.getElementById("landingGetStarted").addEventListener("click",t),document.getElementById("landingSignIn").addEventListener("click",e))}function Jr(){Qr&&(Qr.style.display="none")}function Yx(){return`
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
  `}let ot=null,Br=null,bs=!1;function jx(t,e){console.log("initAuthScreen: initializing"),ot=t,Br=e,bs=!1,yg(n=>{if(console.log("AuthScreen: auth state change received:",n?n.email:"null","processed:",bs),n&&!n.emailVerified){eA(n);return}n&&Br&&!bs?(console.log("AuthScreen: calling onAuthSuccessCallback"),bs=!0,ay(),Br(n)):n?console.log("AuthScreen: skipping callback, already processed or no callback"):(bs=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),ou(),console.log("initAuthScreen: complete")}function ou(){if(ot){if(!De()){ot.innerHTML=`
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
  `,Kx()}}function Kx(){const t=ot.querySelectorAll(".auth-screen-tab");t.forEach(r=>{r.addEventListener("click",()=>{t.forEach(c=>c.classList.remove("active")),r.classList.add("active");const o=document.getElementById("signinForm"),l=document.getElementById("signupForm");r.dataset.tab==="signin"?(o.style.display="block",l.style.display="none"):(o.style.display="none",l.style.display="block"),ai()})}),document.getElementById("signinForm").addEventListener("submit",Qx),document.getElementById("signupForm").addEventListener("submit",Jx),document.getElementById("forgotPasswordBtn").addEventListener("click",Xx),document.getElementById("googleSigninBtn").addEventListener("click",Zx)}function hn(t){const e=document.getElementById("authScreenError");e&&(e.textContent=t,e.style.display="block")}function ai(){const t=document.getElementById("authScreenError");t&&(t.style.display="none")}async function Qx(t){t.preventDefault(),ai();const e=document.getElementById("signinEmail").value.trim(),n=document.getElementById("signinPassword").value;if(!e||!n){hn("Please enter email and password");return}try{await II(e,n)}catch(s){console.error("Sign in error:",s),hn(pl(s.code))}}async function Jx(t){t.preventDefault(),ai();const e=document.getElementById("signupName").value.trim(),n=document.getElementById("signupEmail").value.trim(),s=document.getElementById("signupPassword").value;if(!e||!n||!s){hn("Please fill in all fields");return}if(s.length<6){hn("Password must be at least 6 characters");return}try{await _I(n,s,e)}catch(i){console.error("Sign up error:",i),hn(pl(i.code))}}async function Xx(){ai();const t=document.getElementById("signinEmail").value.trim();if(!t){hn("Please enter your email address first");return}try{await xI(t),typeof window.showToast=="function"&&window.showToast("Password reset email sent. Check your inbox.","success",5e3)}catch(e){console.error("Reset password error:",e),hn(pl(e.code))}}async function Zx(){ai();try{await SI()}catch(t){console.error("Google sign in error:",t),hn(pl(t.code))}}function pl(t){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[t]||"An error occurred. Please try again."}function eA(t){ot&&(ot.style.display="block",ot.innerHTML=`
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
  `,document.getElementById("verifiedContinueBtn").addEventListener("click",async()=>{ai();try{const e=await TI();e&&e.emailVerified?Br&&!bs&&(bs=!0,ay(),Br(e)):hn("Not verified yet. Click the link in the email first (check spam), then try again.")}catch(e){console.error("Verification check error:",e),hn("Could not check verification status. Please try again.")}}),document.getElementById("resendVerificationBtn").addEventListener("click",async()=>{ai();try{await EI(),typeof window.showToast=="function"&&window.showToast("Verification email sent. Check your inbox.","success",5e3)}catch(e){console.error("Resend verification error:",e),hn(e.code==="auth/too-many-requests"?"Too many attempts. Please wait a few minutes and try again.":"Could not send the email. Please try again.")}}),document.getElementById("verifySignOutBtn").addEventListener("click",async()=>{try{await zd(),ou()}catch(e){console.error("Sign out error:",e)}}))}function ay(){ot&&(ot.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function ly(){console.log("hideAuthScreen: hiding auth screen, element=",!!ot),ot&&(ot.style.display="none",console.log("hideAuthScreen: set display to none"))}function tA(){bs=!1,ot&&(ot.style.display="block",ou())}function Xr(t="signin"){tA(),ot.querySelectorAll(".auth-screen-tab").forEach(r=>r.classList.remove("active"));const n=ot.querySelector(`.auth-screen-tab[data-tab="${t}"]`);n&&n.classList.add("active");const s=document.getElementById("signinForm"),i=document.getElementById("signupForm");s&&i&&(s.style.display=t==="signin"?"block":"none",i.style.display=t==="signup"?"block":"none")}function nA(){return`
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
  `}let Zr=null;function cy(t,e,n,s={}){Zr=t,sA(e,n,s)}function sA(t,e,n={}){if(!Zr)return;const s=t||"there",i=n.title||`Welcome, ${s}!`,r=n.subtitle||"Your account is set up and ready to go. Here's what Pension Planner can do for you.",o=n.ctaLabel||"Set Up Your First Plan";Zr.innerHTML=`
    <div class="onboarding-page">
      <div class="onboarding-content">

        <div class="onboarding-welcome">
          <h1>${i}</h1>
          <p>${r}</p>
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

        <!-- Future: Accumulation -->
        <div class="onboarding-tool-section future">
          <div class="onboarding-tool-header">
            <span class="onboarding-tool-badge future">Coming Soon</span>
            <h2>Accumulation Planner</h2>
          </div>
          <p class="onboarding-tool-question">"Am I saving enough for retirement?"</p>
          <p>A future tool for people still building their pension. Project how your contributions and investment growth could add up over time.</p>
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
  `,document.getElementById("onboardingStartWizard").addEventListener("click",e),n.onSkip&&document.getElementById("onboardingSkip").addEventListener("click",n.onSkip)}function tr(){Zr&&(Zr.style.display="none")}function iA(){return`
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
  `}let is=null,Ra=null,Tc=null,B={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35},It="scenario",ke=1;function dy(){It="scenario",ke=1,B={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35}}function uy(t,e,n=null){is=t,Ra=e,Tc=n,dy(),Xt()}function Xt(){is&&(It==="scenario"?rA():It==="stress"?lA():It==="decision"&&dA())}function rA(){is.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${au(2,ke)}
        </div>

        ${ke===1?oA():aA()}
      </div>
    </div>
  `,lu()}function oA(){const t=B.household==="couple";return`
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

      ${Uf("You","wiz",B.currentAge,B.retirementAge,B.retired)}
      <div id="wizPartnerBlock" style="display:${t?"block":"none"};">
        ${Uf("Your partner","wizPartner",B.partnerAge,B.partnerRetirementAge,B.partnerRetired)}
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
  `}function Uf(t,e,n,s,i){const r=i?"Age you retired":"Target retirement age",o=e+"CurrentAge",l=e+"RetireAge",c=e+"Retired";return`
    <div style="border:1px solid var(--border); border-radius:10px; padding:12px 14px; margin-bottom:12px;">
      <strong style="font-size:14px;">${t}</strong>
      <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end; margin-top:8px;">
        <div class="wizard-input" style="flex:0 0 auto;">
          <label style="display:block; font-size:13px; margin-bottom:4px;">Age today</label>
          <input type="number" id="${o}" value="${n||""}" placeholder="e.g. 52" style="max-width:110px;">
        </div>
        <div class="wizard-input" style="flex:0 0 auto;">
          <label id="${l}Label" style="display:block; font-size:13px; margin-bottom:4px;">${r}</label>
          <input type="number" id="${l}" value="${s||""}" placeholder="e.g. 60" style="max-width:150px;">
        </div>
        <label style="flex:0 0 auto; display:flex; align-items:center; gap:6px; font-size:13px; padding-bottom:8px; cursor:pointer;">
          <input type="checkbox" id="${c}" ${i?"checked":""} style="width:auto;"
            onchange="document.getElementById('${l}Label').textContent = this.checked ? 'Age you retired' : 'Target retirement age'">
          Already retired
        </label>
      </div>
    </div>
  `}function aA(){return`
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
  `}function lA(){is.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${au(6,ke)}
        </div>

        ${cA(ke)}
      </div>
    </div>
  `,lu()}function cA(t){switch(t){case 1:return`
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
      `;default:return""}}function dA(){is.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${au(4,ke)}
        </div>

        ${uA(ke)}
      </div>
    </div>
  `,lu()}function uA(t){switch(t){case 1:return`
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
      `;default:return""}}function au(t,e){let n="";for(let s=1;s<=t;s++){const i=s<e?"done":s===e?"active":"";n+=`<div class="wizard-dot ${i}"></div>`}return n}function lu(){if(is.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>hA(e.dataset.action))}),document.getElementById("wizRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wiz",B.equityMin,B.bondMin,B.cashTarget);const e=document.getElementById("wizEquityGlide");e&&(e.checked=!!B.equityGlideEnabled,window.updateAllocDisplay("wiz"))}if(document.getElementById("wizDRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wizD",B.decisionEquity,B.decisionBond,B.decisionCash);const e=document.getElementById("wizDEquityGlide");e&&(e.checked=!!B.decisionEquityGlideEnabled,window.updateAllocDisplay("wizD"))}}function hA(t){switch(hy(),t){case"skip-all":if(Tc){Tc();break}B.startAt="budget",Ys();break;case"to-router":{const e=parseInt(B.currentAge),n=parseInt(B.retirementAge),s=i=>{typeof window.showToast=="function"&&window.showToast(i,"error")};if(!n||n<40||n>95){s(B.retired?"Please enter the age you retired":"Please enter a target retirement age");return}if(e&&n>e&&B.retired){s("You ticked 'already retired' but the age is in the future — untick it, or lower the age.");return}if(e&&n<e&&!B.retired){s("That retirement age is in the past — tick 'already retired' if you've already retired.");return}ke=2,Xt();break}case"start-budget":case"start-stress":case"start-decision":B.startAt=t.replace("start-",""),Ys();break;case"next":{const e=ul(B.spStartDate);if(!e.valid){typeof window.showToast=="function"&&window.showToast(e.error,"error");return}It==="scenario"?ke<2&&(ke++,Xt()):It==="stress"?ke<6&&(ke++,Xt()):It==="decision"&&ke<4&&(ke++,Xt());break}case"back":(It==="scenario"&&ke>1||It==="stress"&&ke>1||It==="decision"&&ke>1)&&(ke--,Xt());break;case"start-tools":if(!B.enabledTools||B.enabledTools.length===0){typeof window.showToast=="function"&&window.showToast("Please select at least one tool","error");return}jl("scenario");break;case"skip-stress":jl("stress");break;case"finish-stress":B.decisionSalary=B.baseSalary,B.decisionEquity=B.equityMin,B.decisionBond=B.bondMin,B.decisionCash=B.cashTarget,B.decisionIsaBalance=B.isaBalance,B.decisionDuration=B.duration,B.decisionEquityGlideEnabled=B.equityGlideEnabled,jl("stress");break;case"skip-decision":Ys();break;case"finish":Ys();break}}function jl(t){const e=B.enabledTools.includes("stress"),n=B.enabledTools.includes("decision");t==="scenario"?e?(It="stress",ke=1,Xt()):n?(It="decision",ke=1,Xt()):Ys():t==="stress"&&n?(It="decision",ke=1,Xt()):Ys()}function hy(){const t=document.getElementById("wizScenarioName");t&&(B.scenarioName=t.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(B.scenarioDescription=e.value.trim()||"");const n=document.querySelector('input[name="wizHousehold"]:checked');n&&(B.household=n.value);const s=document.getElementById("wizCurrentAge");s&&(B.currentAge=parseInt(s.value)||"");const i=document.getElementById("wizRetireAge");i&&(B.retirementAge=parseInt(i.value)||"");const r=document.getElementById("wizRetired");r&&(B.retired=r.checked);const o=document.getElementById("wizPartnerCurrentAge");o&&(B.partnerAge=parseInt(o.value)||"");const l=document.getElementById("wizPartnerRetireAge");l&&(B.partnerRetirementAge=parseInt(l.value)||"");const c=document.getElementById("wizPartnerRetired");c&&(B.partnerRetired=c.checked);const d=document.getElementById("wizToolStress"),h=document.getElementById("wizToolDecision");if(d!==null||h!==null){const T=[];d&&d.checked&&T.push("stress"),h&&h.checked&&T.push("decision"),B.enabledTools=T}const m=document.getElementById("wizBaseSalary");m&&(B.baseSalary=parseFloat(m.value)||3e4);const p=document.getElementById("wizOther");p&&(B.otherIncome=parseFloat(p.value)||0);const w=document.getElementById("wizSpStartDate");w&&(B.spStartDate=w.value.trim()||"");const I=document.getElementById("wizSpWeeklyAmount");if(I&&(B.spWeeklyAmount=parseFloat(I.value)||0),document.getElementById("wizPot")&&typeof window.readAlloc=="function"){const T=window.readAlloc("wiz");B.equityMin=T.equityMin,B.bondMin=T.bondMin,B.cashTarget=T.cashTarget}const S=document.getElementById("wizEquityGlide");S&&(B.equityGlideEnabled=S.checked);const A=document.getElementById("wizIsaBalance");A&&(B.isaBalance=parseFloat(A.value)||0);const P=document.getElementById("wizDuration");P&&(B.duration=parseInt(P.value)||35);const C=document.getElementById("wizTaxMode");C&&(B.taxMode=C.value);const L=document.getElementById("wizDBaseSalary");if(L&&(B.decisionSalary=parseFloat(L.value)||3e4),document.getElementById("wizDPot")&&typeof window.readAlloc=="function"){const T=window.readAlloc("wizD");B.decisionEquity=T.equityMin,B.decisionBond=T.bondMin,B.decisionCash=T.cashTarget}const D=document.getElementById("wizDEquityGlide");D&&(B.decisionEquityGlideEnabled=D.checked);const O=document.getElementById("wizDIsaBalance");O&&(B.decisionIsaBalance=parseFloat(O.value)||0);const U=document.getElementById("wizDDuration");U&&(B.decisionDuration=parseInt(U.value)||35)}function Ys(){hy(),Ra&&Ra(B)}function nr(){is&&(is.style.display="none")}function fA(t,e,n,s){if(is=t,Ra=n,dy(),B.enabledTools=e,s&&(e.includes("stress")&&s.source==="decision"&&(B.baseSalary=s.baseSalary||3e4,B.equityMin=s.equityMin||25e4,B.bondMin=s.bondMin||2e5,B.cashTarget=s.cashTarget||5e4,B.isaBalance=s.isaBalance||0,B.duration=s.duration||35,B.spStartDate=s.spStartDate||"",B.spWeeklyAmount=s.spWeeklyAmount||0),e.includes("decision")&&s.source==="stress"&&(B.decisionSalary=s.baseSalary||3e4,B.decisionEquity=s.equityMin||25e4,B.decisionBond=s.bondMin||2e5,B.decisionCash=s.cashTarget||5e4,B.decisionIsaBalance=s.isaBalance||0,B.decisionDuration=s.duration||35)),e.includes("stress"))It="stress";else if(e.includes("decision"))It="decision";else{n&&n(B);return}ke=1,Xt()}function pA(){return`
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
  `}function mA(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}function gA(t,e,n={}){const s=mA(),i=t.getContext("2d"),{width:r,height:o}=t,l={top:50,right:180,bottom:60,left:80},c=r-l.left-l.right,d=o-l.top-l.bottom;i.fillStyle=s.bg,i.fillRect(0,0,r,o);const h=Object.keys(e),m=n.years||35;let p=0;h.forEach(A=>{const P=e[A].result;P&&P.hist&&P.hist.forEach(C=>{C.total>p&&(p=C.total)})}),p*=1.1;const w=A=>l.left+A/m*c,I=A=>l.top+d-A/p*d;yA(i,l,c,d,m,p,n.title||"Scenario Comparison",s);const S=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];h.forEach((A,P)=>{const C=e[A].result;if(!C||!C.hist)return;i.beginPath(),i.strokeStyle=S[P%S.length],i.lineWidth=2.5,C.hist.forEach((D,O)=>{const U=w(D.year),T=I(D.total);O===0?i.moveTo(U,T):i.lineTo(U,T)}),i.stroke();const L=l.top+15+P*24;i.fillStyle=S[P%S.length],i.fillRect(r-l.right+15,L,20,4),i.font="11px system-ui, sans-serif",i.fillStyle=s.text,i.textAlign="left",i.fillText(e[A].name||A,r-l.right+40,L+5),C.final/1e3,i.fillStyle=s.muted,i.fillText(`${fy(C.final)}`,r-l.right+40,L+18)})}function yA(t,e,n,s,i,r,o,l){t.font="bold 14px system-ui, sans-serif",t.fillStyle=l.text,t.textAlign="center",t.fillText(o,e.left+n/2,e.top-20),t.strokeStyle=l.grid,t.lineWidth=1;for(let c=0;c<=5;c++){const d=e.top+s*c/5;t.beginPath(),t.moveTo(e.left,d),t.lineTo(e.left+n,d),t.stroke();const h=r*(5-c)/5;t.font="11px system-ui, sans-serif",t.fillStyle=l.muted,t.textAlign="right",t.fillText(fy(h),e.left-10,d+4)}for(let c=0;c<=i;c+=5){const d=e.left+c/i*n;t.beginPath(),t.moveTo(d,e.top),t.lineTo(d,e.top+s),t.stroke(),t.textAlign="center",t.fillText(`Y${c}`,d,e.top+s+20)}t.font="12px system-ui, sans-serif",t.textAlign="center",t.fillText("Years",e.left+n/2,e.top+s+45),t.save(),t.translate(20,e.top+s/2),t.rotate(-Math.PI/2),t.fillText("Fund Value",0,0),t.restore()}function fy(t){return t>=1e6?`£${(t/1e6).toFixed(1)}M`:t>=1e3?`£${(t/1e3).toFixed(0)}k`:`£${t.toFixed(0)}`}function vA(){return`
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
  `}window._simEngine={runMonteCarlo:Qg,runHistorical:Jg,simulate:Ui,monteCarloReturns:Zd};window._constants={EQUITY_RETURNS:Xs,INFLATION:Da};window._mathUtils={seededRng:Fc};let py=null,my=null;function gy(){py=null,my=null;const t=document.getElementById("mcResults"),e=document.getElementById("histResults");t&&(t.innerHTML=""),e&&(e.innerHTML="");const n=document.getElementById("optimiseResultsMC"),s=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),s&&(s.innerHTML="")}function yy(){document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-stresstab="montecarlo"]');t&&t.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("stress-montecarlo");e&&e.classList.remove("hidden")}function vy(){document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-decisiontab="entry"]');t&&t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("decision-entry");e&&e.classList.remove("hidden")}const by=document.createElement("style");by.textContent=fx()+Yx()+nA()+iA()+pA()+Rx()+vA();document.head.appendChild(by);const cu=document.getElementById("globalLoadingOverlay"),bA=cu.querySelector(".loading-text");function kt(t="Loading..."){bA.textContent=t,cu.classList.add("active")}function Ct(){cu.classList.remove("active")}window.showToast=function(e,n="info",s=3e3){const i=document.querySelector(".toast-notification");i&&i.remove();const r=document.createElement("div");r.className=`toast-notification ${n}`,r.innerHTML=`
        <span class="toast-icon">${n==="success"?"✓":n==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${e}</span>
      `,document.body.appendChild(r),requestAnimationFrame(()=>r.classList.add("show")),setTimeout(()=>{r.classList.remove("show"),setTimeout(()=>r.remove(),300)},s)};document.getElementById("versionDisplay").textContent=`v${jf}`;document.getElementById("entryMonth").value=XS();function Ic(t){const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");if(!e||!n)return;const s=parseFloat(e.value)||0;n.value=s>0?Math.round(s*52):"",n._updateOverlay&&n._updateOverlay()}["ds","ss"].forEach(t=>{const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");e&&n&&(e.addEventListener("input",()=>{const s=parseFloat(e.value)||0;n.value=s>0?Math.round(s*52):"",n._updateOverlay&&n._updateOverlay()}),n.addEventListener("input",()=>{const s=parseFloat(n.value)||0;e.value=s>0?+(s/52).toFixed(2):"",e._updateOverlay&&e._updateOverlay()}))});function du(t){const e=parseFloat(t);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function wy(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(n){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(n){!n.shiftKey&&!n.ctrlKey&&!n.metaKey&&this.select()})})}function _y(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted||e.closest("#budget-content")||e.closest("#budWizardOverlay")||e.closest("#adminPanelOverlay"))return;e.dataset.formatted="true";let n=e.closest(".input-with-unit");const s=!!n;n||(n=document.createElement("span"),n.className="num-format-wrap",n.style.cssText="position:relative; display:block;",e.parentNode.insertBefore(n,e),n.appendChild(e));const i=document.createElement("span");i.className="number-format-overlay";const r=s?"34px":"14px";i.style.cssText=`
          position: absolute;
          left: ${r};
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: inherit;
          font-size: inherit;
          font-family: inherit;
          background: transparent;
          z-index: 1;
        `,getComputedStyle(n).position==="static"&&(n.style.position="relative");function o(){const l=parseFloat(e.value);!isNaN(l)&&l>=1e3&&document.activeElement!==e?(i.textContent=du(l),i.style.display="block",e.style.color="transparent"):(i.style.display="none",e.style.color="")}e._updateOverlay=o,e.addEventListener("focus",()=>{i.style.display="none",e.style.color=""}),e.addEventListener("blur",o),e.addEventListener("input",()=>{document.activeElement===e&&(i.style.display="none",e.style.color="")}),n.appendChild(i),o()})}function ml(){document.querySelectorAll('input[type="number"]').forEach(t=>{t._updateOverlay&&t._updateOverlay()})}setTimeout(()=>{wy(),_y()},100);const wA=new MutationObserver(t=>{let e=!1;t.forEach(n=>{n.addedNodes.forEach(s=>{var i,r;s.nodeType===1&&((i=s.matches)!=null&&i.call(s,'input[type="number"]')||(r=s.querySelector)!=null&&r.call(s,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{wy(),_y()},50)});wA.observe(document.body,{childList:!0,subtree:!0});let Ii=null;async function uu(t,e=null){Jr(),ly(),tr(),nr(),document.getElementById("mainApp").classList.remove("hidden"),Ox().then(()=>{li("ss",!0),li("ds",!0);const o=document.getElementById("adminGearBtn");o&&(o.style.display=Bx()?"inline-block":"none")}),document.getElementById("userEmail").textContent=t.email,await Pi();const n=await Lg();hu(n),await xn(),await ci(),xc(),yy(),vy(),gy();const s=e||(n.includes("decision")?"decision":"stress");document.querySelectorAll(".tab").forEach(o=>o.classList.remove("active"));const i=document.querySelector(`.tab[data-tab="${s}"]`);i&&i.classList.add("active"),document.querySelectorAll(".tab-content").forEach(o=>o.classList.remove("active"));const r=document.getElementById(`${s}-content`);r&&r.classList.add("active")}function hu(t){const e={decision:["decision"],stress:["stress"]};document.querySelectorAll(".tab").forEach(s=>{const i=s.dataset.tab;let r=!1;for(const[o,l]of Object.entries(e))if(l.includes(i)){r=t.includes(o);break}Object.values(e).flat().includes(i)||(r=!0),s.style.display=r?"":"none"})}window.openToolSettingsTab=function(t){const e=t==="decision"?'.sub-tab[data-decisiontab="decisionsettings"]':'.sub-tab[data-stresstab="stresssettings"]',n=document.querySelector(e);n&&n.click()};async function Sc(t){try{const e=s=>!!s.baseSalary&&+s.baseSalary!=3e4;if(t==="decision"){const s=await bt();return!!s.configured||e(s)||await rr()}const n=await wt();return!!n.configured||e(n)}catch{return!0}}async function fu(){const t=document.getElementById("dsSetupBanner"),e=document.getElementById("ssSetupBanner");t&&(t.style.display=await Sc("decision")?"none":"block"),e&&(e.style.display=await Sc("stress")?"none":"block")}async function xc(){try{const t=await wt(),e=await bt();fu(),document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",document.getElementById("dsDuration").value=e.duration||35,writeAlloc("ds",e.equityMin??25e4,e.bondMin??2e5,e.cashTarget??5e4,e.diversifierStart||0),restoreCustomAllocFromSettings("ds",e),window._taggedFunds.ds=(e.taggedFunds||[]).map(s=>({...s})),setAllocMode("ds",e.allocMode||(e.taggedFunds&&e.taggedFunds.length?"funds":"risk")),updateEntryTagPrompt(),document.getElementById("dsEquityGlide").checked=e.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsIsaBalance").value=e.isaBalance||0,document.getElementById("dsAccessMethod").value=e.accessMethod||"drawdown",document.getElementById("dsUfplsYears").value=e.ufplsYears||"",document.getElementById("dsUfplsPcls").checked=!!e.ufplsThenPcls,document.getElementById("dsBandFillRecycle").checked=!!e.bandFillRecycle,syncAccessButtons("ds"),document.getElementById("dsSpendingProfile").value=e.spendingProfile||"flat",document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",Ic("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||15e3,document.getElementById("dsDisableProtection").checked=e.disableProtection||!1,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,mu(t),document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(s=>({...s})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssDbAmount").value=t.dbAmount||0,document.getElementById("ssDbStartYear").value=t.dbStartYear||0,document.getElementById("ssDbIndexation").value=t.dbIndexation||"lpi5",document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",Ic("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0,document.getElementById("ssAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("ssUfplsYears").value=t.ufplsYears||"",document.getElementById("ssUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("ssBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ss");const n=document.getElementById("ssSeedNote");n&&(n.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),ml(),console.log("All inputs initialized from stored settings")}catch(t){console.error("Error initializing inputs from settings:",t)}}async function Ey(t){console.log("Wizard completed with data:",t);const e=parseInt(t.retirementAge)||60,n=parseInt(t.currentAge)||e,s=95,i=Math.max(5,s-Math.max(n,e));try{const c={duration:i},d={duration:i};await UI(t.scenarioName||"My plan","",["stress","decision"],{stressSettings:c,decisionSettings:d},!0),Ps(),ss();try{const h=await su();h.currentAge=parseInt(t.currentAge)||h.currentAge,h.retirementAge=e,h.endAge=s,h.retired=!!t.retired,h.sharedWithPartner=t.household==="couple",t.household==="couple"&&(h.partnerAge=parseInt(t.partnerAge)||null,h.partnerRetirementAge=parseInt(t.partnerRetirementAge)||null,h.partnerRetired=!!t.partnerRetired),await iu(h)}catch(h){console.warn("Could not seed budget from wizard:",h)}}catch(c){console.error("Error creating scenario from wizard:",c)}const r=kn(),o=t.startAt||"budget";o==="budget"&&(window._budWizAutoOpen=!0),await uu(r);const l=document.querySelector('.tab[data-tab="'+o+'"]');l&&l.click(),(o==="decision"||o==="stress")&&!await Sc(o)&&(openToolSettingsTab(o),showToast("First, set up this plan: your pot, spending need and State Pension.","info",6e3))}async function Ty(){if(nr(),await Eg()){document.getElementById("mainApp").classList.remove("hidden");const e=document.getElementById("scenarioDropdown");e&&e.classList.add("open"),showToast("Plan creation cancelled — you’re back on your current plan.","info",3500)}else Pa(kn())}function Pa(t){Jr(),ly();const e=t.displayName||t.email.split("@")[0];document.getElementById("onboardingPage").style.display="block",cy(document.getElementById("onboardingPage"),e,()=>{tr(),document.getElementById("setupWizard").style.display="block",uy(document.getElementById("setupWizard"),Ey,Ty)})}jx(document.getElementById("authScreen"),async t=>{console.log("Auth success callback triggered for:",t.email);try{console.log("Checking for existing cloud data...");const e=await Eg();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),Jr(),uu(t)):(console.log("New user - showing onboarding page"),Pa(t))}catch(e){console.error("Error in auth callback:",e),Pa(t)}});Wx(document.getElementById("landingPage"),{onGetStarted:()=>{Jr(),Xr("signup")},onSignIn:()=>{Jr(),Xr("signin")}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{Ps(),ss(),Cn(),await zd(),document.getElementById("mainApp").classList.add("hidden"),tr(),nr(),Xr("signin")}catch(t){console.error("Logout error:",t)}});async function Ac(){const t=document.getElementById("planLockChip");if(!t)return;const e=await rr();t.style.display="inline-block",t.textContent=e?"🔒 locked":"✏️ draft",t.title=e?"This plan’s settings are committed so your recorded entries stay consistent. Click for details.":"This plan’s settings are still editable. Saving the Decision settings commits (locks) the plan. Click for details.",t.style.cursor="pointer",t.onclick=n=>{n.stopPropagation(),explainPlanLock(e)}}window.explainPlanLock=function(t){let e=document.getElementById("planLockExplainer");e&&e.remove(),e=document.createElement("div"),e.id="planLockExplainer",e.style.cssText="position:fixed; inset:0; z-index:1300; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; padding:20px;",e.innerHTML=`<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; max-width:560px; width:100%; padding:26px; font-size:15px; line-height:1.6;"><h2 style="margin-bottom:12px;">Plans — and why they lock 🔒</h2><p style="margin-bottom:10px; color:var(--text-muted);">A <strong style="color:var(--text);">plan</strong> is a named scenario: its settings (pots, spending target, State Pension, rules) plus everything you record against them — monthly decisions and tax years. You can keep several plans and switch or duplicate them from this dropdown.</p><p style="margin-bottom:10px; color:var(--text-muted);">When you save a plan’s Decision settings, the plan <strong style="color:var(--text);">locks</strong>: the settings freeze so your recorded history stays meaningful — a decision saved under one set of rules shouldn’t be silently re-judged under another.</p><ul style="margin:0 0 12px 18px; color:var(--text-muted);"><li><strong style="color:var(--text);">✏️ draft</strong> — settings still editable; nothing committed yet.</li><li><strong style="color:var(--text);">🔒 locked, nothing recorded</strong> — you can unlock and edit freely.</li><li><strong style="color:var(--text);">🔒 locked with history</strong> — settings can’t change; duplicate into a new plan instead.</li></ul><p style="margin-bottom:16px; color:var(--text-muted);">The Budget and the Stress Tester are never locked — the budget autosaves like a document, and Stress is a sandbox for what-ifs.</p><div style="display:flex; gap:10px; flex-wrap:wrap;"><button type="button" onclick="document.getElementById('planLockExplainer').remove()">Got it</button>`+(t?`<button type="button" class="risk-btn" onclick="document.getElementById('planLockExplainer').remove(); document.querySelector('.tab[data-tab=&quot;decision&quot;]').click(); openToolSettingsTab('decision');">View the locked settings</button>`:"")+"</div></div>",e.addEventListener("click",n=>{n.target===e&&e.remove()}),document.body.appendChild(e)};async function Pi(){var i;const t=await Gd(),e=t.find(r=>r.isActive),n=document.getElementById("scenarioActiveName");n&&(n.textContent=e&&(((i=e.planDetails)==null?void 0:i.name)||e.name)||"No Plan"),await Ac();const s=document.getElementById("scenarioList");if(s){if(t.length===0){s.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}s.innerHTML=t.map(r=>{var c,d;const o=((c=r.planDetails)==null?void 0:c.name)||r.name||"Unnamed Plan",l=((d=r.planDetails)==null?void 0:d.description)||r.description||"";return`
        <div class="scenario-dropdown-item ${r.isActive?"active":""}" data-scenario-id="${r.id}">
          <div>
            <div class="scenario-item-name">${o}</div>
            ${l?`<div class="scenario-item-desc">${l}</div>`:""}
          </div>
          <div class="scenario-item-actions">
            ${r.isActive?`<button class="scenario-tools-btn" data-id="${r.id}" data-tools="${(r.enabledTools||["stress","decision"]).join(",")}" title="Edit Tools">&#9881;</button>`:""}
            <button class="scenario-rename-btn" data-id="${r.id}" data-name="${o}" title="Rename">&#9998;</button>
            ${t.length>1?`<button class="scenario-delete-btn" data-id="${r.id}" data-name="${o}" title="Delete">&times;</button>`:""}
          </div>
        </div>
      `}).join(""),s.querySelectorAll(".scenario-dropdown-item").forEach(r=>{r.addEventListener("click",async o=>{if(o.target.closest(".scenario-item-actions"))return;const l=r.dataset.scenarioId;if(!l)return;const c=t.find(d=>d.isActive);if(c&&c.id===l){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await qI(l),Ps(),ss(),document.getElementById("scenarioDropdown").classList.remove("open"),gy(),yy(),vy();const d=await Lg();hu(d);const h=document.querySelector(".tab.active");if(h&&h.style.display==="none"){const m=document.querySelector('.tab:not([style*="display: none"])');if(m){document.querySelectorAll(".tab").forEach(I=>I.classList.remove("active")),m.classList.add("active"),document.querySelectorAll(".tab-content").forEach(I=>I.classList.remove("active"));const p=m.dataset.tab+"-content",w=document.getElementById(p);w&&w.classList.add("active")}}await xn(),await ci(),await xc(),await Pi()}catch(d){console.error("Error switching scenario:",d),showToast("Failed to switch plan: "+d.message,"error")}})}),s.querySelectorAll(".scenario-rename-btn").forEach(r=>{r.addEventListener("click",async o=>{o.stopPropagation();const l=r.dataset.id,c=r.dataset.name,d=prompt("Rename plan:",c);if(d&&d.trim()&&d.trim()!==c)try{await WI(l,d.trim()),await Pi()}catch(h){console.error("Error renaming scenario:",h),showToast("Failed to rename plan: "+h.message,"error")}})}),s.querySelectorAll(".scenario-tools-btn").forEach(r=>{r.addEventListener("click",async o=>{o.stopPropagation();const l=r.dataset.id,c=(r.dataset.tools||"stress,decision").split(",");document.getElementById("scenarioDropdown").classList.remove("open"),_A(l,c)})}),s.querySelectorAll(".scenario-delete-btn").forEach(r=>{r.addEventListener("click",async o=>{o.stopPropagation();const l=r.dataset.id,c=r.dataset.name;if(confirm(`Delete plan "${c}"? This cannot be undone.`))try{await YI(l),Ps(),ss(),await xn(),await ci(),await xc(),await Pi()}catch(d){console.error("Error deleting scenario:",d),showToast("Failed to delete plan: "+d.message,"error")}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",t=>{t.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",t=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(t.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden");const t=()=>{tr(),document.getElementById("setupWizard").style.display="block",uy(document.getElementById("setupWizard"),Ey,Ty)},e=kn(),n=e&&(e.displayName||(e.email||"").split("@")[0])||"there",s=document.getElementById("onboardingPage");s.style.display="block",cy(s,n,t,{title:"A new plan — here’s the flow",subtitle:"A quick refresher on how the pieces fit together before you set it up.",ctaLabel:"Set up the new plan",onSkip:t})});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{var s;document.getElementById("scenarioDropdown").classList.remove("open");const t=await jt();if(!t){showToast("No active plan to duplicate.","error");return}const e=((s=t.planDetails)==null?void 0:s.name)||t.name||"My Plan",n=prompt("Name for the copy:",e+" (copy)");if(!(!n||!n.trim()))try{await HI(t.id,n.trim()),await Pi()}catch(i){console.error("Error duplicating scenario:",i),showToast("Failed to duplicate plan: "+i.message,"error")}});function _A(t,e){const n=document.getElementById("editToolsModal");n&&n.remove();const s=e.includes("stress"),i=e.includes("decision"),r=document.createElement("div");r.id="editToolsModal",r.className="edit-tools-overlay",r.innerHTML=`
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
              <input type="checkbox" id="editToolDecision" ${i?"checked":""}>
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
      `,document.body.appendChild(r),document.getElementById("editToolsCancel").addEventListener("click",()=>r.remove()),r.addEventListener("click",o=>{o.target===r&&r.remove()}),document.getElementById("editToolsSave").addEventListener("click",async()=>{const o=[];if(document.getElementById("editToolStress").checked&&o.push("stress"),document.getElementById("editToolDecision").checked&&o.push("decision"),o.length===0){showToast("Please select at least one tool","error");return}const l=o.filter(c=>!e.includes(c));try{await GI(t,o);const c=await jt();if(c&&c.id===t){hu(o);const d=document.querySelector(".tab.active");if(d&&d.style.display==="none"){const h=document.querySelector('.tab:not([style*="display: none"])');if(h){document.querySelectorAll(".tab").forEach(w=>w.classList.remove("active")),h.classList.add("active"),document.querySelectorAll(".tab-content").forEach(w=>w.classList.remove("active"));const m=h.dataset.tab+"-content",p=document.getElementById(m);p&&p.classList.add("active")}}}if(await Pi(),r.remove(),l.length>0){let d=null;try{if(l.includes("stress")&&e.includes("decision")){const p=await bt();p&&(d={source:"decision",...p})}else if(l.includes("decision")&&e.includes("stress")){const p=await wt();p&&(d={source:"stress",...p})}}catch(p){console.warn("Could not load existing settings for pre-fill:",p)}const h=document.getElementById("setupWizard");h.style.display="block",document.getElementById("mainApp").style.display="none",fA(h,l,async p=>{nr();try{l.includes("stress")&&(await _o({equityMin:p.equityMin,bondMin:p.bondMin,cashTarget:p.cashTarget,isaBalance:p.isaBalance||0,duration:p.duration,baseSalary:p.baseSalary,other:p.otherIncome||0,taxMode:p.taxMode||"inflates",equityGlideEnabled:p.equityGlideEnabled||!1}),ss()),l.includes("decision")&&(await ri({equityMin:p.decisionEquity,bondMin:p.decisionBond,cashTarget:p.decisionCash,isaBalance:p.decisionIsaBalance||0,duration:p.decisionDuration,baseSalary:p.decisionSalary,spStartDate:p.spStartDate||null,spWeeklyAmount:p.spWeeklyAmount||0,equityGlideEnabled:p.decisionEquityGlideEnabled||!1}),Ps())}catch(w){console.error("Error saving new tool settings:",w)}await uu(),showToast("New tool configured successfully","success")},d)}else showToast("Tools updated","success")}catch(c){console.error("Error updating scenario tools:",c),showToast("Failed to update tools: "+c.message,"error")}})}const kc=60*60*1e3,Iy="pt_lastActivity";let la=null,qf=0;function Sy(){const t=Date.now();if(t-qf>1e4){qf=t;try{localStorage.setItem(Iy,String(t))}catch{}}}function EA(){try{return+localStorage.getItem(Iy)||0}catch{return 0}}async function xy(){if(!lt())return;const t=Date.now()-EA();if(t<kc){la=setTimeout(xy,Math.max(6e4,kc-t));return}showToast("You have been logged out due to inactivity (1 hour).","info",5e3);try{Ps(),ss(),Cn(),await zd(),document.getElementById("mainApp").classList.add("hidden"),tr(),nr(),Xr("signin")}catch(e){console.error("Auto-logout error:",e)}}function Ay(){la&&clearTimeout(la),lt()&&(la=setTimeout(xy,kc))}const TA=["mousedown","mousemove","keydown","scroll","touchstart","click"];TA.forEach(t=>{document.addEventListener(t,()=>{Sy(),Ay()},{passive:!0})});Sy();Ay();yg(t=>{const e=!document.getElementById("mainApp").classList.contains("hidden");!t&&e&&(document.getElementById("mainApp").classList.add("hidden"),tr(),nr(),Xr("signin"),showToast("You’ve been signed out — sign in again to continue. Unsaved changes in open forms were not stored.","warning",8e3))});document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await _g(),console.log("Data wiped successfully"),Ps(),ss(),Cn(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden");const n=kn();Pa(n),showToast("All data has been deleted. Set up a new plan to start fresh.","success",4e3)}catch(n){console.error("Reset error:",n),showToast("Error resetting data: "+n.message,"error")}});document.getElementById("deleteAccountBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ DELETE YOUR ACCOUNT?

This permanently deletes your login AND all saved data:

• All plans and settings
• All portfolio/decision history
• Your household budget

This cannot be undone.`)||!confirm(`FINAL WARNING

Your account and every piece of data will be gone forever.

Delete everything?`)))try{await _g(),Ps(),ss(),Cn(),localStorage.clear(),await AI(),showToast("Your account and all data have been deleted.","success",4e3),setTimeout(()=>window.location.reload(),1500)}catch(n){console.error("Delete account error:",n),n.code==="auth/requires-recent-login"?showToast("For security, please sign out, sign back in, and press Delete Account again.","error",8e3):showToast("Error deleting account: "+n.message,"error")}});document.querySelectorAll(".tab").forEach(t=>{t.addEventListener("click",async()=>{if(t.dataset.tab!=="stress"){IA();const e=document.getElementById("optimiseResultsMC"),n=document.getElementById("optimiseResultsHist");e&&(e.innerHTML=""),n&&(n.innerHTML="")}document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${t.dataset.tab}-content`).classList.add("active"),t.dataset.tab==="stress"&&await yl(),t.dataset.tab==="budget"&&await WA()})});const gr=document.querySelector(".tabs"),Hf=document.querySelector(".tabs-wrapper");if(gr&&Hf){const t=()=>{const e=gr.scrollLeft+gr.clientWidth>=gr.scrollWidth-10;Hf.classList.toggle("scrolled-end",e)};gr.addEventListener("scroll",t),t()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>{t.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${t.dataset.stresstab}`).classList.remove("hidden"),t.dataset.stresstab==="stresssettings"&&await yl()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>{t.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${t.dataset.decisiontab}`).classList.remove("hidden"),t.dataset.decisiontab==="decisionsettings"&&await vl(),t.dataset.decisiontab==="history"&&await xn(),t.dataset.decisiontab==="taxyears"&&await ci()})});async function Wf(t,e,n,s){var o,l;const i=await bt(),r=i.equityGlideEnabled?{...i,equityGlide:$g(i)}:i;return Hx(t,e,n,s,{settings:r,history:await fi(),allTaxYears:await cs(),spInfo:await jd(oy(t)),isaBalance:parseFloat((o=document.getElementById("entryIsa"))==null?void 0:o.value)||0,diversifier:parseFloat((l=document.getElementById("entryDiversifier"))==null?void 0:l.value)||0})}function pu(t,e,n){if(t<1e4&&e<1e4&&n<1e4&&t+e+n>0){const i=r=>"£"+Math.round(r||0).toLocaleString();return confirm(`These fund values look low — Equity ${i(t)}, Bond ${i(e)}, Cash ${i(n)}.

Enter absolute amounts in pounds, to the single pound (e.g. 250000, not 250).

Continue anyway?`)}return!0}window.handleDecisionSubmit=async function(t){t.preventDefault();const e=document.getElementById("entryMonth").value,n=parseFloat(document.getElementById("entryEquity").value)||0,s=parseFloat(document.getElementById("entryBond").value)||0,i=parseFloat(document.getElementById("entryCash").value)||0,r=[];if(e||r.push("Month"),!n&&n!==0&&r.push("Equity Fund"),!s&&s!==0&&r.push("Bond Balance"),!i&&i!==0&&r.push("Cash Balance"),r.length>0){showToast("Missing: "+r.join(", "),"error",4e3);return}if(!pu(n,s,i))return;if((await fi({limit:1e3})).find(c=>c.date===e)){showToast(`${Wi(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await _x(e)).showWizard){const h=document.getElementById("taxYearWizard");h.style.display="block",window._pendingDecisionForm={dateStr:e,equity:n,bond:s,cash:i},wx(h,e,async m=>{if(h.style.display="none",m&&m.completed)try{Ii=await Wf(e,n,s,i);const p=document.getElementById("decisionOutput");Bf(Ii,p),document.getElementById("saveBtn").disabled=!1}catch(p){console.error("Decision error after wizard:",p),showToast("Error: "+p.message,"error")}});return}Ii=await Wf(e,n,s,i);const d=document.getElementById("decisionOutput");Bf(Ii,d),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),showToast("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const t=document.getElementById("saveBtn");if(!Ii){showToast("No decision to save","error");return}if(!lt()){showToast("Please sign in to save decisions","error");return}t.classList.add("loading"),t.disabled=!0;try{await aS(Ii),showToast("Decision saved to history","success"),await xn()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error"),t.disabled=!1}finally{t.classList.remove("loading")}};function mu(t){const e=i=>"£"+Math.round(i||0).toLocaleString(),n=(t.diversifierStart||0)>0?` · Diversifiers ${e(t.diversifierStart)}`:"",s=`Starting balances come from your <strong>Settings</strong> (Fund Minimums): Equity ${e(t.equityMin)} · Bond ${e(t.bondMin)}${n} · Cash ${e(t.cashTarget)}. Edit them in the Settings tab.`;["mcStartSummary","histStartSummary","scenStartSummary"].forEach(i=>{const r=document.getElementById(i);r&&(r.innerHTML=s)}),["mcYears","histYears"].forEach(i=>{const r=document.getElementById(i);r&&(r.value=t.duration)})}window.runMonteCarloUI=async function(){const t=await wt(),e={years:parseInt(document.getElementById("mcYears").value)||t.duration},n=document.getElementById("optimiseResultsMC");n&&(n.innerHTML=""),document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:s,stats:i}=Px(e);py=s,Ry(i,s,"Monte Carlo (1000 runs)","mcResults",e.years)}catch(s){console.error("Simulation error:",s),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${s.message}</div>`}},50)};window.runHistoricalUI=async function(){const t=await wt(),e={years:parseInt(document.getElementById("histYears").value)||t.duration},n=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:s,stats:i}=Mx(e);my=s,Ry(i,s,"Historical Analysis","histResults",e.years)}catch(s){console.error("Simulation error:",s),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${s.message}</div>`}},50)};window.runScenariosUI=async function(){await wt();const t={};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',setTimeout(()=>{try{const e=Dx(t);DA(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};let ms=!1,Ir=0;function IA(){Ir++}window.runOptimisationUI=async function(t){if(ms)return;ms=!0;const e=++Ir,n=document.getElementById("optimiseBtn"+t),s=document.getElementById("optimiseResults"+t);n&&(n.disabled=!0),n&&(n.textContent="Optimising..."),s.innerHTML='<div class="loading"><div class="spinner"></div>Preparing optimisation...</div>';const i=await wt(),r=JSON.parse(JSON.stringify(i)),o=document.getElementById(t==="MC"?"mcYears":"histYears"),l=parseInt(o&&o.value)||r.duration,c=(r.equityMin||0)+(r.bondMin||0)+(r.cashTarget||0);if(e!==Ir){ms=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const d=[];for(let b=5;b<=90;b+=5)for(let E=5;E<=95-b;E+=5){const x=100-b-E;x>=0&&d.push({equity:Math.round(c*E/100),bond:Math.round(c*x/100),cash:Math.round(c*b/100)})}const{EQUITY_RETURNS:h,INFLATION:m}=window._constants,{simulate:p,monteCarloReturns:w}=window._simEngine,I=Object.keys(h).map(Number).sort((b,E)=>b-E),S=Math.max(...I),A=b=>{const E={...r,equityMin:b.equity,bondMin:b.bond,cashTarget:b.cash},x=Eo({years:l},E),y=[];if(t==="MC")for(let F=0;F<1e3;F++)y.push(p(x,w(x,F),F));else I.forEach(F=>{if(F+l-1>S)return;const X={equity:{},inflation:{}};for(let Ie=0;Ie<l;Ie++)X.equity[Ie]=h[F+Ie]||0,X.inflation[Ie]=m[F+Ie]||.025;y.push(p(x,X,F))});const te=y.filter(F=>F.failed);y.filter(F=>!F.failed);const re=(y.length-te.length)/y.length*100,q=y.reduce((F,X)=>F+Math.min(1,(X.years||0)/(X.duration||l)),0)/y.length*100,se=y.map(F=>F.protMonths).reduce((F,X)=>F+X,0)/y.length,oe=y.filter(F=>F.protMonths>0).length,ve=y.map(F=>F.failed?0:F.finalReal||0).sort((F,X)=>F-X),Te=ve.length?ve[Math.floor(ve.length*.5)]:0,ie=ve.length?ve[Math.floor(ve.length*.9)]:0;return{equity:b.equity,bond:b.bond,cash:b.cash,rate:re,coverage:q,avgProt:se,withProt:oe,totalRuns:y.length,medianFinal:Te,p90Final:ie}};let P;try{const b={equity:r.equityMin||0,bond:r.bondMin||0,cash:r.cashTarget||0},E=A(b);P={...b,...E}}catch(b){console.error("Optimisation error (original):",b),s.innerHTML='<div class="alert alert-danger">Error: '+b.message+"</div>",ms=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const C=10;let L=0;const D=[];let O=null;function U(b){const E=Math.max(...b.map(y=>y.coverage)),x=b.filter(y=>y.coverage>=E-.5);return x.sort((y,te)=>y.avgProt-te.avgProt||te.medianFinal-y.medianFinal),x[0]}function T(b,E){return Math.round(b.equity)===Math.round(E.equity)&&Math.round(b.bond)===Math.round(E.bond)&&Math.round(b.cash)===Math.round(E.cash)}function v(){if(e!==Ir){ms=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),s.innerHTML="";return}try{const b=Math.min(L+C,d.length);for(;L<b;L++)D.push(A(d[L]));s.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations... '+L+"/"+d.length+"</div>",L<d.length?setTimeout(v,0):(O=U([...D,P]),_())}catch(b){console.error("Optimisation error:",b),s.innerHTML='<div class="alert alert-danger">Error: '+b.message+"</div>",ms=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}}function _(){if(e!==Ir){ms=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),s.innerHTML="";return}const b=c>0?P.cash/c*100:0,E=c>0?P.equity/c*100:0,y=b>90||b<5||E<5?'<div class="alert alert-info" style="margin-bottom:16px;font-size:13px;">Your current split is outside the range the optimiser sweeps, but it was included in this comparison.</div>':"",te=O&&!T(O,P)&&(O.coverage>P.coverage+.5||O.coverage>=P.coverage-.01&&O.avgProt<P.avgProt-3),re=(ne,se)=>{const oe=ve=>Math.round(ve/c*100);return'<div style="padding:16px;border-radius:8px;'+(se?"background:rgba(46,160,67,0.1);border:1px solid var(--success);":"background:rgba(0,0,0,0.2);")+'"><div style="font-weight:500;margin-bottom:10px;color:var(--'+(se?"success":"text-muted")+');">'+(se?"Optimised split":"Your current split")+'</div><div style="font-size:26px;font-weight:700;color:var(--'+(se?"success":"warning")+');">'+ne.coverage.toFixed(0)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">of retirement years funded'+(se?" ("+(O.coverage-P.coverage>=0?"+":"")+(O.coverage-P.coverage).toFixed(0)+"%)":"")+'</div><div style="font-size:13px;">Equity '+oe(ne.equity)+"% · Bonds "+oe(ne.bond)+"% · Cash "+oe(ne.cash)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">'+ne.rate.toFixed(0)+"% never run out · "+j(ne.medianFinal)+" typically left</div></div>"};let q="";if(te){const ne=O.medianFinal-P.medianFinal,se=P.medianFinal>0?ne/P.medianFinal*100:0;q+='<div class="card" style="margin-top:20px;border-color:var(--success);">',q+='<h3 style="color:var(--success);margin-top:0;">A better fund split</h3>',q+='<p style="color:var(--text-muted);margin-bottom:16px;">This split funds more of your retirement (higher coverage). Coverage credits a plan for every year it pays for, so it prefers splits that fall short late over ones that fail early.</p>',q+=y,q+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">'+re(P,!1)+re(O,!0)+"</div>",ne<0?q+='<div class="alert alert-warning" style="margin-bottom:16px;"><strong>Trade-off:</strong> it typically leaves '+Math.abs(se).toFixed(0)+"% less at the end (usually less equity) — more safety, a bit less upside.</div>":ne>0&&(q+='<div class="alert alert-info" style="margin-bottom:16px;"><strong>Bonus:</strong> it also typically leaves '+se.toFixed(0)+"% more at the end.</div>"),q+='<button onclick="applyOptimisedAllocationUI('+O.equity+","+O.bond+","+O.cash+')" style="width:100%;">Apply this split to your Settings</button>',q+="</div>"}else q+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',q+='<h3 style="color:var(--primary);margin-top:0;">Your split is already about as good as it gets</h3>',q+=y,q+='<p style="color:var(--text-muted);">We tested '+d.length+" fund splits. Yours funds "+P.coverage.toFixed(0)+"% of retirement years — the best, or within 0.5% of it, with no clearly better low-protection alternative.</p>",q+='<p style="font-size:13px;color:var(--text-muted);">Your split — Equity '+Math.round(E)+"% · Bonds "+Math.round(P.bond/c*100)+"% · Cash "+Math.round(b)+"% · "+P.rate.toFixed(0)+"% never run out.</p>",q+="</div>";s.innerHTML=q,ms=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}setTimeout(v,0)};window.applyOptimisedAllocationUI=async function(t,e,n){if(writeAlloc("ss",t,e,n),writeAlloc("ds",t,e,n),mu({equityMin:t,bondMin:e,cashTarget:n,duration:parseInt(document.getElementById("ssDuration").value)||35}),ml(),lt())try{await _o({equityMin:t,bondMin:e,cashTarget:n})}catch(s){console.error("Error saving optimised settings:",s)}showToast("Optimised allocation applied to settings and starting values. Scroll up to re-run.","success",4e3)};const SA={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function xA(t){if(!t||t.length===0)return"";const e=t.filter(r=>r.failed).sort((r,o)=>r.years-o.years),n=t.filter(r=>r.protMonths>0).sort((r,o)=>o.protMonths-r.protMonths),s=e.length>0?e.slice(0,5):n.slice(0,5);if(s.length===0)return"";let i=`
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
      `;return s.forEach(r=>{const o=r.startYear||r.seed,l=SA[o]||"-",c=r.failed?"danger":"success";i+=`
          <tr>
            <td>${o}</td>
            <td style="font-size: 12px;">${l}</td>
            <td>${r.years.toFixed(1)}</td>
            <td>${r.protMonths}</td>
            <td>${j(r.final)}</td>
            <td style="color: var(--${c});">${r.failed?"FAILED":"OK"}</td>
          </tr>
        `}),i+=`
              </tbody>
            </table>
          </div>
        </details>
      `,i}function Yn(t){return`<span class="hlp" tabindex="0" data-tip="${String(t).replace(/"/g,"&quot;")}">?</span>`}function AA(){if(window.__helpTipInit)return;window.__helpTipInit=!0;const t=document.createElement("div");t.className="help-tip",t.style.display="none",document.body.appendChild(t);let e=null;const n=i=>{const r=i.getAttribute("data-tip");if(!r)return;clearTimeout(e),t.textContent=r,t.style.display="block";const o=i.getBoundingClientRect(),l=Math.min(260,window.innerWidth-24);t.style.width=l+"px";let c=o.left+o.width/2-l/2+window.scrollX;c=Math.max(12+window.scrollX,Math.min(c,window.scrollX+window.innerWidth-l-12)),t.style.left=c+"px";const d=t.offsetHeight;let h=o.top+window.scrollY-d-8;o.top<d+12&&(h=o.bottom+window.scrollY+8),t.style.top=h+"px"},s=()=>{e=setTimeout(()=>{t.style.display="none"},80)};document.addEventListener("mouseover",i=>{const r=i.target.closest&&i.target.closest("[data-tip]");r&&n(r)}),document.addEventListener("mouseout",i=>{i.target.closest&&i.target.closest("[data-tip]")&&s()}),document.addEventListener("focusin",i=>{const r=i.target.closest&&i.target.closest("[data-tip]");r&&n(r)}),document.addEventListener("focusout",i=>{i.target.closest&&i.target.closest("[data-tip]")&&s()}),document.addEventListener("click",i=>{const r=i.target.closest&&i.target.closest("[data-tip]");r&&(t.style.display==="block"?s():n(r))})}function kA(){if(window.__chartHoverInit)return;window.__chartHoverInit=!0;const t=e=>e.querySelectorAll("circle[data-tip]").forEach(n=>{n.setAttribute("fill","transparent"),n.removeAttribute("stroke")});document.addEventListener("mousemove",e=>{const n=e.target.closest&&e.target.closest(".ichart");if(!n)return;const s=n.querySelectorAll("circle[data-tip]");if(!s.length)return;let i=null,r=1/0;s.forEach(o=>{const l=o.getBoundingClientRect(),c=Math.abs(l.left+l.width/2-e.clientX);c<r&&(r=c,i=o)}),i&&(t(n),i.setAttribute("fill","#60a5fa"),i.setAttribute("stroke","var(--surface,#161b22)"),i.setAttribute("stroke-width","2"),i.dispatchEvent(new MouseEvent("mouseover",{bubbles:!0})))}),document.addEventListener("mouseout",e=>{const n=e.target.closest&&e.target.closest(".ichart");n&&t(n)})}const js=t=>"£"+Math.round(t).toLocaleString();function ky(t,e,n){return`<svg class="ichart" viewBox="0 0 ${e} ${n}" style="width:100%;height:auto;overflow:visible;display:block" role="img">${t}</svg>`}function Cy(t,{max:e,valueFmt:n=js,tip:s,pct:i=!1}={}){const m=t.length;if(m<2)return"";const p=e??(i?100:Math.max(1,...t)),w=D=>56+D/(m-1)*590,I=D=>174-Math.max(0,Math.min(i?100:1/0,D))/p*160,S=t.map((D,O)=>`${w(O).toFixed(1)},${I(D).toFixed(1)}`).join(" "),A=`56,${174 .toFixed(1)} ${S} ${w(m-1).toFixed(1)},${174 .toFixed(1)}`,P=i?[0,50,100]:[0,p/2,p],C=[0,Math.floor((m-1)/2),m-1],L=s||((D,O)=>`Year ${O}: ${n(D)}`);return ky(P.map(D=>`<line x1="56" y1="${I(D).toFixed(1)}" x2="646" y2="${I(D).toFixed(1)}" stroke="var(--border,#8883)" opacity=".45"/><text x="50" y="${(I(D)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${n(D)}</text>`).join("")+`<polygon points="${A}" fill="rgba(96,165,250,.13)"/><polyline points="${S}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.map((D,O)=>`<circle cx="${w(O).toFixed(1)}" cy="${I(D).toFixed(1)}" r="8" fill="transparent" data-tip="${L(D,O).replace(/"/g,"&quot;")}"></circle>`).join("")+C.map(D=>`<text x="${w(D).toFixed(1)}" y="192" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${D}</text>`).join(""),660,200)}function CA(t){const l=t.p50.length;if(l<2)return"";const c=Math.max(1,...t.p90),d=S=>60+S/(l-1)*606,h=S=>222-Math.max(0,S)/c*208,m=(S,A)=>S.map((P,C)=>`${d(C).toFixed(1)},${h(P).toFixed(1)}`).concat(A.map((P,C)=>`${d(l-1-C).toFixed(1)},${h(A[l-1-C]).toFixed(1)}`)).join(" "),p=S=>S.map((A,P)=>`${d(P).toFixed(1)},${h(A).toFixed(1)}`).join(" "),w=[0,c/4,c/2,3*c/4,c],I=[0,Math.floor((l-1)/2),l-1];return ky(w.map(S=>`<line x1="60" y1="${h(S).toFixed(1)}" x2="666" y2="${h(S).toFixed(1)}" stroke="var(--border,#8883)" opacity=".4"/><text x="54" y="${(h(S)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${js(S)}</text>`).join("")+`<polygon points="${m(t.p90,t.p10)}" fill="rgba(96,165,250,.12)"/><polygon points="${m(t.p75,t.p25)}" fill="rgba(96,165,250,.22)"/><polyline points="${p(t.p50)}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.p50.map((S,A)=>`<circle cx="${d(A).toFixed(1)}" cy="${h(S).toFixed(1)}" r="8" fill="transparent" data-tip="Year ${A}: middle ${js(S)}; likely range ${js(t.p10[A])} to ${js(t.p90[A])}"></circle>`).join("")+I.map(S=>`<text x="${d(S).toFixed(1)}" y="242" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${S}</text>`).join(""),680,250)}function RA(t){if(!t||!t.funded)return"";const e=i=>(i||0).toFixed(i>=10?0:1),n=t.pctSurviveFullTerm>=80?"success":t.pctSurviveFullTerm>=50?"warning":"danger",s=t.avgHigherRateYears<1?"success":t.avgHigherRateYears<4?"warning":"danger";return`
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
          ${Cy(t.medianIsaByYear,{valueFmt:js,tip:(i,r)=>`Year ${r}: typically ${js(i)} of ISA left`})}
        </div>`}function PA(t){return t==="sequence"?"The failing futures were sunk by a bad first few years of markets. Holding a bigger cash/bond buffer for the early years, or starting with a slightly lower withdrawal, would let the plan ride out an early slump.":t==="inflation"?"The failing futures were driven by high inflation eroding your spending power. More inflation protection (e.g. index-linked gilts) and less plain cash would help — cash loses to inflation over time.":t==="market"?"The failing futures simply had weak markets throughout. A slightly lower withdrawal rate, or more growth assets (equities) accepting more short-term ups and downs, gives more headroom.":"Lowering your target income, delaying the start, or a larger starting pot would all raise the odds."}function MA(t,e){const n=t.severity||{},s=t.successRate,i=s>=90?{t:"Very likely to last",c:"success"}:s>=75?{t:"Likely to last — with some risk",c:"success"}:s>=50?{t:"At real risk of running out",c:"warning"}:{t:"Unlikely to last as planned",c:"danger"};let r=`<div class="verdict verdict-${i.c}">
        <div class="verdict-title">Will your money last? — ${i.t}</div>
        <div class="verdict-heroes">
          <div><span class="hero">${s.toFixed(0)}%</span>
            <span class="hero-sub">chance your money lasts the whole plan ${Yn("Out of "+e+", the share where your pot never runs out before the end of the plan. Higher is better.")}</span></div>
          <div><span class="hero" style="font-size:30px;">${(n.coverage||0).toFixed(0)}%</span>
            <span class="hero-sub">of retirement years funded (coverage) ${Yn('The average share of retirement years your plan pays for, across every simulated future — so a plan that funds 34 of 35 years scores 97%, and a late shortfall counts far less than an early one. Based on the retirement "coverage ratio" (Estrada & Kritzman, 2019). Note: it is capped at 100% and ignores any money left over, and it is an average — check the worst-case minimum below.')}</span></div>
        </div>
        <div class="verdict-basis">Based on ${e}. Pot and income values are shown in today's money.</div>
      </div>`;return n.failCount>0&&(r+=`<div class="callout">
          <div class="callout-title">Why it might fall short</div>
          <p>${n.diagnosis}</p>
          <p class="lever"><strong>What could help:</strong> ${PA(n.primaryDriver)}</p>
        </div>`),r}function Ry(t,e,n,s,i){AA(),kA();const r=t.survival||{},o=t.finalReal||{},l=t.protection||{},c=l.pctWithProtection!=null?l.pctWithProtection:(l.runsWithProtection||0)/(e.length||1)*100,d=s==="mcResults",h=d?`${e.length.toLocaleString()} simulated futures`:`${e.length} historical periods since 1928`;let m=`
        <div class="card">
          <h2>${n}</h2>

          ${MA(t,h)}

          <div class="keynums">
            <div class="keynum">
              <div class="kn-val">${Math.round(r.min||0)} / ${i} yrs</div>
              <div class="kn-label">worst simulated future — money lasted this long ${Yn("The single unluckiest of all the simulated futures — the true tail. The average coverage can look reassuring; this is the worst it ever got. (10th-percentile: at least "+(r.p10||0).toFixed(0)+" years.)")}</div>
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
          ${CA(t.chartData.potBand)}

          <h3 style="margin:22px 0 4px;">Chance your plan is still going, year by year</h3>
          <div class="chart-caption">Share of futures in which the money hasn't run out yet — starts at 100% and dips where plans tend to fail. A late dip means most shortfalls happen late.</div>
          ${Cy(t.chartData.solvency,{pct:!0,valueFmt:p=>p.toFixed(0)+"%",tip:(p,w)=>`Year ${w}: ${p.toFixed(0)}% of plans still going`})}

          ${RA(t.isa)}

          <details style="margin-top:22px;">
            <summary style="cursor:pointer;font-weight:600;color:var(--primary);">More detail — worst historical periods &amp; full statistics</summary>
            <div style="margin-top:16px;">
              ${s==="histResults"?xA(e):""}

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
      `;document.getElementById(s).innerHTML=m}function DA(t,e){let n='<div class="card"><h2>Scenario Analysis</h2>';n+=`
        <div class="chart-container" style="margin-bottom: 24px;">
          <canvas id="scenCompChart" width="900" height="400"></canvas>
        </div>
      `,n+='<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">';for(const[s,i]of Object.entries(t)){const r=i.result,o=r.failed?"danger":"success";n+=`
          <div class="history-item" style="border-left: 4px solid ${i.color};">
            <div>
              <div class="history-date">${i.name}</div>
              <div class="history-details">
                Protection: ${r.protMonths} mo | Max streak: ${r.maxConsec} mo
                ${r.hodlUsed>0?` | HODL used: ${j(r.hodlUsed)}`:""}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 24px; color: var(--${o});">${r.years.toFixed(1)} yrs</div>
              <div style="font-size: 12px; color: var(--${o});">${r.failed?"FAILED":"OK"}</div>
              <div style="font-size: 11px; color: var(--text-muted);">Final: ${j(r.final)}</div>
            </div>
          </div>
        `}n+="</div></div>",document.getElementById(e).innerHTML=n,setTimeout(()=>{const s=document.getElementById("scenCompChart");s&&t&&gA(s,t,{years:35,title:"Scenario Comparison"})},50)}const gl={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,diversifiers:.12,cash:.13},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.3,diversifiers:.15,cash:.05},adventurous:{key:"adventurous",label:"Adventurous",equity:.65,bond:.15,diversifiers:.15,cash:.05}};function Py(t){const e=document.getElementById(t+"Diversifiers");return!!(e&&e.checked)}window._customAlloc=window._customAlloc||{};window._allocMode=window._allocMode||{};function gu(t){return window._allocMode[t]||"risk"}function My(t){if(window._customAlloc[t])return window._customAlloc[t];const e=document.querySelector("#"+t+"Risks .risk-card.active"),n=e&&e.dataset.risk||"balanced",s=Py(t)?gl:ns;return s[n]||s.balanced}function Dy(t,e,n,s){s=s||0;const i=s>.001?gl:ns;let r="balanced",o=1/0;for(const l in i){const c=i[l],d=(c.equity-t)**2+(c.bond-e)**2+((c.diversifiers||0)-s)**2+(c.cash-n)**2;d<o&&(o=d,r=l)}return r}window.updateAllocDisplay=function(t){const e=My(t),n=Math.round(e.equity*100),s=Math.round(e.bond*100),i=Math.round(e.cash*100),r=Math.round((e.diversifiers||0)*100),o=document.getElementById(t+"AllocAmounts"),l=window._customAlloc[t],c=document.getElementById(t+"Pot");if(l&&c){const U=Math.round((l.equityMin||0)+(l.bondMin||0)+(l.cashTarget||0)+(l.diversifierStart||0));+c.value!==U&&(c.value=U,c._updateOverlay&&c._updateOverlay());const T=document.getElementById(t+"PotDisplay");T&&(T.textContent="£"+U.toLocaleString())}const d=+document.getElementById(t+"Pot").value||0,h=l?l.equityMin:Math.round(d*n/100),m=l?l.bondMin:Math.round(d*s/100),p=l?l.cashTarget:Math.round(d*i/100),w=l?l.diversifierStart||0:Math.round(d*r/100),I=r>0?" &middot; "+r+"% diversifiers":"",S=r>0?" &middot; £"+w.toLocaleString()+" diversifiers":"",A=Math.round(+(document.getElementById(t+"IsaBalance")||{}).value||0),P=A>0?'<br><span style="color:var(--text-muted);">+ £'+A.toLocaleString()+" ISA kept separate (the tax-free bridge)</span>":"";o&&(o.innerHTML="<strong>"+e.label+"</strong> &mdash; "+n+"% shares &middot; "+s+"% bonds"+I+" &middot; "+i+'% cash<br><span style="color:var(--text-muted);">£'+h.toLocaleString()+" shares &middot; £"+m.toLocaleString()+" bonds"+S+" &middot; £"+p.toLocaleString()+" cash</span>"+P);const C=document.getElementById(t+"EquityGlide"),L=!!(C&&C.checked),D=document.getElementById(t+"GlideEndgame");D&&(L&&l?(D.style.display="block",D.innerHTML=LA(t)):D.style.display="none");const O=document.getElementById(t+"GlideMinNote");O&&(L?(O.style.display="block",O.innerHTML=BA(t,e)):O.style.display="none")};function BA(t,e){const n=document.getElementById(t+"Duration"),s=n&&+n.value||35,i=Math.max(5,s-20),r=e.cash,o=e.diversifiers||0,l=1-r-o,c=window._customAlloc[t],d=!!c,h=d&&c.glideEndgame?c.glideEndgame:null,m=d?zg(e.equity,e.bond,h):wo(e.equity,e.bond),p=Math.round(l*m.start*100),w=Math.round(l*m.end*100),I=Math.round(l*(1-m.start)*100),S=Math.round(l*(1-m.end)*100),A=Math.round(r*100),P=Math.round(o*100),C=6,L=314,D=18,O=104,U=O-D,T=Ie=>(O-Ie*U).toFixed(1),v=(C+(L-C)*Math.min(1,i/s)).toFixed(1),_=T(r),b=T(r+o),E=T(r+o+l*(1-m.start)),x=T(r+o+l*(1-m.end)),y="#6366f1",te="#14b8a6",re="#94a3b8",q="#f59e0b",ne=o>0?`<polygon points="${C},${_} ${L},${_} ${L},${b} ${C},${b}" fill="${q}"></polygon>`:"",se=`<svg viewBox="0 0 320 122" style="width:100%;height:auto;display:block;" preserveAspectRatio="none"><polygon points="${C},${O} ${L},${O} ${L},${_} ${C},${_}" fill="${re}"></polygon>`+ne+`<polygon points="${C},${b} ${L},${b} ${L},${x} ${v},${x} ${C},${E}" fill="${te}"></polygon><polygon points="${C},${E} ${v},${x} ${L},${x} ${L},${D} ${C},${D}" fill="${y}"></polygon><line x1="${v}" y1="${D}" x2="${v}" y2="${O}" stroke="rgba(148,163,184,0.9)" stroke-width="1" stroke-dasharray="3,2"></line></svg>`,oe=Ie=>`<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${Ie};vertical-align:middle;"></span>`,ve=o>0?" · "+P+"% diversifiers":"",Te=o>0?" &nbsp; "+oe(q)+" Diversifiers":"",ie=d?"Now (your funds)":"Starts",F=d?"Rises to"+(h&&h.label?" ("+h.label+")":""):"Then holds ("+e.label+")",X=d?"rises from your holdings, levels off at year "+i:"reaches your mix at year "+i+", then holds";return'<div style="font-weight:600;margin-bottom:6px;">How your mix glides over '+s+" years</div>"+se+'<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:3px;"><span>Now</span><span>'+X+'</span></div><div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:8px;"><span><strong>'+ie+"</strong><br>"+p+"% shares · "+I+"% bonds"+ve+" · "+A+'% cash</span><span style="text-align:right;"><strong>'+F+"</strong><br>"+w+"% shares · "+S+"% bonds"+ve+" · "+A+'% cash</span></div><div style="font-size:12px;margin-top:8px;">'+oe(y)+" Shares &nbsp; "+oe(te)+" Bonds"+Te+" &nbsp; "+oe(re)+" Cash</div>"}window.setRiskPreset=function(t,e){ns[e]&&(window._allocMode[t]="risk",delete window._customAlloc[t],document.querySelectorAll("#"+t+"Risks .risk-card").forEach(n=>n.classList.toggle("active",n.dataset.risk===e)),updateAllocDisplay(t))};window.setAllocMode=function(t,e){window._allocMode[t]=e;const n=document.getElementById(t+"ModeRisk"),s=document.getElementById(t+"ModeFunds");n&&n.classList.toggle("active",e==="risk"),s&&s.classList.toggle("active",e==="funds");const i=document.getElementById(t+"RiskMode"),r=document.getElementById(t+"FundsMode");if(i&&(i.style.display=e==="risk"?"":"none"),r&&(r.style.display=e==="funds"?"":"none"),e==="funds")renderFunds(t),vu(t);else if(delete window._customAlloc[t],!document.querySelector("#"+t+"Risks .risk-card.active")){const o=document.querySelector("#"+t+'Risks .risk-card[data-risk="balanced"]');o&&o.classList.add("active")}updateAllocDisplay(t),typeof updateEntryTagPrompt=="function"&&updateEntryTagPrompt()};function LA(t){const e=window._customAlloc[t]&&window._customAlloc[t].glideEndgame&&window._customAlloc[t].glideEndgame.key||"",n=(s,i)=>'<button type="button" class="risk-btn'+(e===s?" active":"")+`" style="padding:6px 12px;" onclick="setGlideEndgame('`+t+"','"+s+`')">`+i+"</button>";return'<div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;"><strong>Glide towards</strong> — your funds are the start; the tent raises shares over time to this level:</div><div style="display:flex;gap:8px;flex-wrap:wrap;">'+n("cautious","Cautious")+n("balanced","Balanced")+n("adventurous","Adventurous")+"</div>"}window.setGlideEndgame=function(t,e){const n=window._customAlloc[t];if(!n)return;const i=(Py(t)?gl:ns)[e];if(!i)return;n.glideEndgame={equityPct:i.equity,bondPct:i.bond,key:e,label:i.label};const r=n.equity/(n.equity+n.bond||1);i.equity/(i.equity+i.bond||1)<=r&&showToast("That endgame isn’t more share-heavy than your holdings — the glide would flatten or decline, not rise.","warning",5e3),updateAllocDisplay(t)};window.readAlloc=function(t){const e=window._customAlloc[t];if(e){const o={equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget};return e.diversifierStart>0&&(o.diversifierStart=e.diversifierStart),e.subAsset&&(o.subAsset=e.subAsset),e.glideEndgame&&(o.glideEndgame=e.glideEndgame),o}const n=+document.getElementById(t+"Pot").value||0,s=My(t),i={equityMin:Math.round(n*s.equity),bondMin:Math.round(n*s.bond),cashTarget:Math.round(n*s.cash)},r=s.diversifiers||0;return r>0&&(i.diversifierStart=Math.round(n*r),i.subAsset={}),i};window.writeAlloc=function(t,e,n,s,i){const r=+i||0,o=(+e||0)+(+n||0)+(+s||0)+r;document.getElementById(t+"Pot").value=Math.round(o);const l=document.getElementById(t+"Diversifiers");l&&(l.checked=r>0);const c=o>0?Math.round((+e||0)/o*100):50,d=o>0?Math.round((+n||0)/o*100):40,h=o>0?Dy((+e||0)/o,(+n||0)/o,(+s||0)/o,r/o):"balanced";document.querySelectorAll("#"+t+"Risks .risk-card").forEach(p=>p.classList.toggle("active",p.dataset.risk===h)),updateAllocDisplay(t);const m=(r>0?gl:ns)[h];if(o>0&&(c!==Math.round(m.equity*100)||d!==Math.round(m.bond*100))){const p=document.getElementById(t+"AllocAmounts");p&&(p.innerHTML+='<div style="margin-top:8px;color:#b45309;font-size:12px;">Your saved split ('+c+"% / "+d+"% / "+Math.max(0,100-c-d)+"%) was matched to the nearest risk level (<strong>"+m.label+"</strong>). Pick another if you prefer — saving keeps this one.</div>")}};window._taggedFunds=window._taggedFunds||{};function Yt(t){return window._taggedFunds[t]=window._taggedFunds[t]||[]}const yu={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};function li(t,e=!1){const n=document.getElementById(t+"FundCatalogue");n&&(e||!n.childElementCount)&&(n.innerHTML=fl().map(s=>'<option value="'+s.ticker+'">'+s.ticker+" — "+s.name+"</option>").join(""))}function Cc(t){const e=(t.ticker||"").toUpperCase().trim(),n=qi(e);return t.subClass||n&&n.subClass||Wg[e]||""}window.reformatMoney=function(t){const e=parseFloat(String(t.value).replace(/[^0-9.]/g,""));t.value=isNaN(e)||e===0?"":du(e)};function NA(t,e,n){if(t=t.toLowerCase().trim(),!t)return 0;const s=e.toLowerCase(),i=n.toLowerCase();if(s===t)return 1e3;if(s.startsWith(t))return 900-(s.length-t.length);if(i.split(/[^a-z0-9]+/).filter(Boolean).some(l=>l.startsWith(t)))return 820;if(s.includes(t))return 720;if(i.includes(t))return 660-Math.min(50,i.indexOf(t));const o=l=>{let c=0;for(const d of l)if(d===t[c]&&c++,c===t.length)return!0;return!1};return o(s)?360:o(i)?300:0}function OA(t,e=8){return fl().map(n=>({f:n,s:NA(t,n.ticker,n.name)})).filter(n=>n.s>0).sort((n,s)=>s.s-n.s||n.f.ticker.localeCompare(s.f.ticker)).slice(0,e).map(n=>n.f)}window.showFundSearch=function(t,e){const n=document.getElementById(t+"FundSearchResults");if(!n)return;const s=OA(e);if(!e.trim()||!s.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=s.map(i=>`<div class="fund-search-item" onmousedown="addFundFromSearch('`+t+"','"+i.ticker+`')" style="padding:7px 10px; cursor:pointer;"><strong>`+i.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+i.name+"</span></div>").join(""),n.style.display="block"};window.hideFundSearch=function(t){const e=document.getElementById(t+"FundSearchResults");e&&(e.style.display="none")};window.addFundFromSearch=function(t,e){const n=qi(e);Yt(t).push({ticker:e,value:"",wrapper:"SIPP",subClass:n?n.subClass:""});const s=document.getElementById(t+"FundSearch");s&&(s.value=""),hideFundSearch(t),renderFunds(t)};function FA(t,e,n){const s=Gg();let i='<option value="">— not set —</option>';for(const r of["shares","bonds","diversifiers","cash"]){const o=s[r]||[];o.length&&(i+='<optgroup label="'+yu[r]+'">'+o.map(l=>'<option value="'+l.key+'"'+(l.key===n?" selected":"")+">"+l.label+"</option>").join("")+"</optgroup>")}return`<select onchange="updateFundField('`+t+"',"+e+`,'subClass',this.value)" style="width:190px;">`+i+"</select>"}function VA(t){const e=encodeURIComponent((t||"").toUpperCase().trim()),n=(s,i)=>'<a href="'+s+'" target="_blank" rel="noopener" style="margin-right:8px;">'+i+"</a>";return'<div style="font-size:11px; margin-top:3px; color:var(--text-muted);">Not in our list — how is it invested? Look it up: '+n("https://markets.ft.com/data/search?query="+e,"FT")+n("https://www.morningstar.co.uk/uk/util/SecuritySearchResults.aspx?search="+e,"Morningstar")+n("https://www.justetf.com/uk/search.html?query="+e,"justETF")+"then pick a category.</div>"}function By(t,e,n){const s=(n.ticker||"").toUpperCase().trim(),i=s&&!qi(s);return FA(t,e,Cc(n))+(i?VA(s):"")}window.renderFunds=function(t){const e=document.getElementById(t+"FundRows");e&&(li(t),e.innerHTML=Yt(t).map((n,s)=>'<tr><td style="padding:3px 6px;"><input type="text" list="'+t+'FundCatalogue" value="'+(n.ticker||"")+`" oninput="updateFundField('`+t+"',"+s+`,'ticker',this.value)" style="width:92px;text-transform:uppercase;" placeholder="e.g. VWRL"></td><td style="padding:3px 6px;"><input type="text" inputmode="numeric" value="`+(n.value?du(n.value):"")+`" oninput="updateFundField('`+t+"',"+s+`,'value',this.value)" onblur="reformatMoney(this)" style="width:110px;" placeholder="0"></td><td style="padding:3px 6px;"><select onchange="updateFundField('`+t+"',"+s+`,'wrapper',this.value)" style="width:74px;"><option`+(n.wrapper!=="ISA"?" selected":"")+">SIPP</option><option"+(n.wrapper==="ISA"?" selected":"")+'>ISA</option></select></td><td id="'+t+"_fcat_"+s+'" style="padding:3px 6px;">'+By(t,s,n)+`</td><td style="padding:3px 6px;"><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="removeFund('`+t+"',"+s+')">&times;</button></td></tr>').join(""),Ly(t))};window.updateFundField=function(t,e,n,s){const i=Yt(t)[e];if(i){if(n==="value")i.value=parseFloat(String(s).replace(/[^0-9.]/g,""))||0;else if(n==="ticker"){i.ticker=s;const r=qi(s);r&&(i.subClass=r.subClass);const o=document.getElementById(t+"_fcat_"+e);o&&(o.innerHTML=By(t,e,i))}else n==="subClass"?(i.subClass=s,s&&i.ticker&&!qi(i.ticker)&&zx({ticker:i.ticker,name:"",subClass:s})):i[n]=s;Ly(t)}};window.addFundRow=function(t){Yt(t).push({ticker:"",value:"",wrapper:"SIPP"}),renderFunds(t)};window.removeFund=function(t,e){Yt(t).splice(e,1),renderFunds(t)};window.clearFunds=function(t){window._taggedFunds[t]=[],renderFunds(t)};function Ly(t){const e=document.getElementById(t+"FundSummary");if(!e)return;const n=Yt(t).filter(d=>d.ticker&&d.value>0);if(!n.length){e.innerHTML='<span style="color:var(--text-muted);font-size:12px;">Add holdings above to see the bucket roll-up.</span>';return}const s=hl(n),i=s.total-s.isaTotal,r=d=>i?Math.round(s.buckets[d]/i*100):0,o=d=>"£"+Math.round(d).toLocaleString(),l=d=>Object.entries(d).map(([h,m])=>Nt[h].label+" "+Math.round(m*100)+"%").join(" · ");let c='<div style="font-weight:600;margin-bottom:6px;">Rolls up to '+o(i)+" pot"+(s.isaTotal?" + "+o(s.isaTotal)+" ISA (separate tax-free bridge, modelled at its own tagged mix)":"")+"</div>";c+='<div style="font-size:13px;">';for(const d of["shares","bonds","diversifiers","cash"])s.buckets[d]&&(c+="<div><strong>"+yu[d]+"</strong>: "+o(s.buckets[d])+" ("+r(d)+"%)"+(d==="bonds"&&Object.keys(s.bondWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+l(s.bondWeights)+"</span>":"")+(d==="diversifiers"&&Object.keys(s.diversifierWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+l(s.diversifierWeights)+"</span>":"")+"</div>");c+="</div>",s.untagged.length&&(c+='<div style="color:#b45309;font-size:12px;margin-top:6px;">Not recognised (ignored): '+s.untagged.map(d=>d.ticker).join(", ")+"</div>"),e.innerHTML=c,gu(t)==="funds"&&(vu(t),updateAllocDisplay(t))}function vu(t){const e=Yt(t).filter(c=>c.ticker&&c.value>0);if(!e.length)return delete window._customAlloc[t],null;const n=hl(e),s=nx(n),i=window._customAlloc[t]||{};window._customAlloc[t]={label:"Your funds",equity:n.total?n.buckets.shares/n.total:0,bond:n.total?n.buckets.bonds/n.total:0,diversifiers:n.total?n.buckets.diversifiers/n.total:0,cash:n.total?n.buckets.cash/n.total:0,equityMin:s.equityStart,bondMin:s.bondStart,cashTarget:s.cashStart,diversifierStart:s.diversifierStart||0,subAsset:s.subAsset||null,glideEndgame:i.glideEndgame||null};const r=document.getElementById(t+"Pot");r&&(r.value=Math.round(n.total-n.isaTotal),r._updateOverlay&&r._updateOverlay());const o=document.getElementById(t+"Diversifiers");o&&(o.checked=(s.diversifierStart||0)>0);const l=document.getElementById(t+"IsaBalance");return l&&(l.value=Math.round(n.isaTotal||0),l._updateOverlay&&l._updateOverlay()),n}window.applyTaggedPortfolio=function(t){if(window._allocMode[t]="funds",!vu(t)){showToast("Add some holdings first","warning");return}updateAllocDisplay(t)};window.restoreCustomAllocFromSettings=function(t,e){if(e&&e.subAsset&&e.subAsset.bondWeights&&Object.keys(e.subAsset.bondWeights).length){const n=(e.equityMin||0)+(e.bondMin||0)+(e.cashTarget||0)+(e.diversifierStart||0);window._customAlloc[t]={label:"Your funds",equity:n?e.equityMin/n:0,bond:n?e.bondMin/n:0,diversifiers:n?(e.diversifierStart||0)/n:0,cash:n?e.cashTarget/n:0,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset,glideEndgame:e.glideEndgame||null}}else delete window._customAlloc[t]};function zA(t){const e={shares:[],bonds:[],diversifiers:[],cash:[]},n=[];t.tagged.forEach(o=>{(o.wrapper||"").toUpperCase()==="ISA"?n.push(o):e[o.bucket]&&e[o.bucket].push(o)});const s=o=>"£"+Math.round(o).toLocaleString(),i={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};let r='<div style="font-size:12px;border:1px solid var(--border,#cbd5e1);border-radius:8px;padding:10px 12px;">';r+='<div style="font-weight:600;margin-bottom:6px;">Which of your funds went where</div>';for(const o of["shares","bonds","diversifiers","cash"]){if(!e[o].length)continue;const l=e[o].reduce((c,d)=>c+(+d.value||0),0);r+='<div style="margin:3px 0;"><strong>'+i[o]+"</strong> "+s(l)+': <span style="color:var(--text-muted);">'+e[o].map(c=>c.ticker).join(", ")+"</span></div>"}return n.length&&(r+='<div style="margin:3px 0;"><strong>ISA (separate tax-free pool)</strong> '+s(t.isaTotal)+': <span style="color:var(--text-muted);">'+n.map(o=>o.ticker).join(", ")+"</span></div>"),t.untagged.length&&(r+='<div style="color:#b45309;margin-top:4px;">Not recognised: '+t.untagged.map(o=>o.ticker).join(", ")+"</div>"),r+="</div>",r}window._fundModal={fieldId:null,subtotal:0};window.openFundBucketModal=function(t,e,n){const s=Yt("ds").filter(r=>{const o=Cc(r);return r.ticker&&o&&Nt[o]&&Nt[o].bucket===t});window._fundModal={fieldId:e,subtotal:0},document.getElementById("fundModalTitle").textContent=n;const i=document.getElementById("fundModalRows");s.length?i.innerHTML=s.map(r=>{const o=qi(r.ticker),l=Nt[Cc(r)],c=o?o.name:l?l.label:"";return'<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin:8px 0;"><span><strong>'+r.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+c+'</span></span><span style="white-space:nowrap;">£ <input type="number" class="fund-modal-input" oninput="updateFundModalSubtotal()" style="width:120px;" placeholder="0"></span></div>'}).join(""):i.innerHTML='<p style="color:var(--text-muted);">No '+n.toLowerCase()+" tagged yet. Define your holdings in <strong>Settings → Build from my funds</strong>, then come back — or just type the total into the box.</p>",updateFundModalSubtotal(),document.getElementById("fundBucketModal").style.display="flex"};window.updateFundModalSubtotal=function(){let t=0;document.querySelectorAll("#fundModalRows .fund-modal-input").forEach(e=>{t+=+e.value||0}),window._fundModal.subtotal=t,document.getElementById("fundModalSubtotal").textContent="Total: £"+Math.round(t).toLocaleString()};window.applyFundBucketModal=function(){const t=document.getElementById(window._fundModal.fieldId);t&&(t.value=Math.round(window._fundModal.subtotal||0)),closeFundBucketModal()};window.closeFundBucketModal=function(){document.getElementById("fundBucketModal").style.display="none"};window.updateEntryTagPrompt=function(){const t=document.getElementById("entryTagPrompt");if(!t)return;if(Yt("ds").filter(n=>n.ticker).length>0){t.style.display="none",t.innerHTML="";return}t.style.display="block",t.innerHTML='<div class="alert alert-info" style="font-size:13px;">The Decision Tool works from your real portfolio. Tag your funds in <strong>Settings → “Build from my funds”</strong> to enter values per fund via the <em>enter per fund ▸</em> links. You can still type bucket totals directly.</div>'};window.fillDecisionFromTaggedFunds=async function(){let t=Yt("ds").filter(i=>i.ticker&&i.value>0);if(t.length||(t=Yt("ss").filter(i=>i.ticker&&i.value>0)),!t.length)try{t=((await wt()).taggedFunds||[]).filter(r=>r.ticker&&r.value>0)}catch{}if(!t.length){showToast('No tagged funds yet — tag your holdings in Settings → "Build from my funds", then come back.',"info",6e3);return}const e=hl(t),n=(i,r)=>{const o=document.getElementById(i);o&&(o.value=Math.round(r))};n("entryEquity",e.buckets.shares),n("entryBond",e.buckets.bonds),n("entryCash",e.buckets.cash),n("entryDiversifier",e.buckets.diversifiers),e.isaTotal&&n("entryIsa",e.isaTotal);const s=document.getElementById("entryFundTagHelp");s&&(s.innerHTML=zA(e)),showToast("Filled your fund values from "+t.length+" tagged funds","success")};function Ny(t,e){const n=(t.equityMin||0)+(t.bondMin||0)+(t.cashTarget||0),s=n>0?Dy(t.equityMin/n,t.bondMin/n,t.cashTarget/n):"balanced",i=ns[s],r=l=>"£"+Math.round(l||0).toLocaleString(),o=Math.round(i.equity*100)+"/"+Math.round(i.bond*100)+"/"+Math.round(i.cash*100);return`<div class="rpt-header">
        <h1>Pension Decision Plan</h1>
        <div class="rpt-sub">${e||""}</div>
        <table class="rpt-meta"><tbody>
          <tr><td>Total pot</td><td>${r(n)}</td><td>Risk level</td><td>${i.label} (${o})</td></tr>
          <tr><td>Bond tent</td><td>${t.equityGlideEnabled?"On — rising-equity glidepath":"Off"}</td><td>Target income</td><td>${r(t.baseSalary)}/yr</td></tr>
          <tr><td>Duration</td><td>${t.duration||35} yrs</td><td>Generated</td><td>${new Date().toLocaleDateString("en-GB")}</td></tr>
        </tbody></table>
      </div>`}function Oy(t){let e=document.getElementById("printPortal");e||(e=document.createElement("div"),e.id="printPortal",document.body.appendChild(e)),e.innerHTML=t,document.body.classList.add("printing"),window.print()}window.addEventListener("afterprint",()=>{document.body.classList.remove("printing");const t=document.getElementById("printPortal");t&&(t.innerHTML="")});function $A(t,e,n){const s=new Blob([e],{type:n}),i=URL.createObjectURL(s),r=document.createElement("a");r.href=i,r.download=t,document.body.appendChild(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}window.printAnnualReport=async function(t){const e=await bt();Oy(Ny(e,"Annual report — tax year "+t)+document.getElementById("taxYearDetail").innerHTML)};window.printMonthlyReport=async function(t){const e=await bt();Oy(Ny(e,"Monthly record — "+t)+document.getElementById("historyDetail").innerHTML)};window.exportAnnualCsv=function(t){const e=(typeof bn<"u"?bn:[]).filter(o=>o.taxYear===t).sort((o,l)=>(o.date||"").localeCompare(l.date||"")),n=o=>(o=o==null?"":String(o),/[",\n]/.test(o)?'"'+o.replace(/"/g,'""')+'"':o),s=o=>Math.round(o||0);let r=["Date","Draw source","SIPP draw","ISA draw","From equity","From bond","From cash","Protection","Equity target","Bond target","Cash target","Total pot","Rebalance"].map(n).join(",")+`
`;for(const o of e)r+=[o.date,o.source,s(o.sipp),s(o.isa),s(o.dEquity),s(o.dBond),s(o.dCash),o.inProtection?"Yes":"No",s(o.adjEquity),s(o.adjBond),s(o.adjCash),s(o.total),o.rebal||""].map(n).join(",")+`
`;e.length||(r+=`(no monthly records saved for this tax year yet)
`),$A("decision-plan-"+t.replace("/","-")+".csv",r,"text/csv;charset=utf-8;")};window.runCompareStrategiesUI=async function(t){const e=document.getElementById("optimiseBtn"+t),n=document.getElementById("optimiseResults"+t);e&&(e.disabled=!0,e.textContent="Comparing..."),n&&(n.innerHTML='<div class="loading"><div class="spinner"></div>Running six strategies…</div>');const s=JSON.parse(JSON.stringify(await wt())),i=document.getElementById(t==="MC"?"mcYears":"histYears"),r=parseInt(i&&i.value)||s.duration,o=(s.equityMin||0)+(s.bondMin||0)+(s.cashTarget||0),l=Object.keys(Xs).map(Number).sort((p,w)=>p-w),c=Math.max(...l),d=p=>{const w=[];if(t==="MC")for(let C=0;C<1e3;C++)w.push(Ui(p,Zd(p,C),C));else l.forEach(C=>{if(C+r-1>c)return;const L={equity:{},inflation:{}};for(let D=0;D<r;D++)L.equity[D]=Xs[C+D]||0,L.inflation[D]=Da[C+D]||.025;w.push(Ui(p,L,C))});const I=w.length||1,S=w.reduce((C,L)=>C+Math.min(1,(L.years||0)/(L.duration||r)),0)/I*100,A=w.filter(C=>!C.failed).length/I*100,P=w.reduce((C,L)=>Math.min(C,L.years||0),1/0);return{coverage:S,rate:A,minYears:P===1/0?0:P}},h=["cautious","balanced","adventurous"],m={};for(const p of h){const w=ns[p];m[p]={};for(const I of[!1,!0]){const S={...s,equityMin:Math.round(o*w.equity),bondMin:Math.round(o*w.bond),cashTarget:Math.round(o*w.cash),equityGlideEnabled:I},A=Eo({years:r},S);m[p][I?"tent":"flat"]=d(A),await new Promise(P=>setTimeout(P,0))}}UA(n,m,h),e&&(e.disabled=!1,e.textContent="Compare strategies")};function UA(t,e,n){let s={cov:-1,key:null,tent:null};for(const o of n)for(const l of["flat","tent"])e[o][l].coverage>s.cov&&(s={cov:e[o][l].coverage,key:o,tent:l});const i=(o,l)=>`<td style="text-align:center;padding:10px;border:1px solid var(--border);${l?"background:rgba(16,185,129,0.12);":""}">
          <div style="font-size:22px;font-weight:700;color:var(--${l?"success":"text"});">${o.coverage.toFixed(0)}%</div>
          <div style="font-size:11px;color:var(--text-muted);">worst case ${o.minYears.toFixed(0)} yrs</div>
        </td>`;let r='<h3 style="margin-bottom:6px;">Compare strategies</h3>';r+=`<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px;">Coverage = the share of your retirement years the pot funds (worst case = the fewest years it lasted in any run). More shares usually buys a little more coverage but a rougher ride; the bond tent mainly lifts the worst case. Pick the risk level you're comfortable holding — the tool won't change it for you.</p>`,r+='<table style="border-collapse:collapse;width:100%;max-width:520px;"><thead><tr><th style="text-align:left;padding:8px;"></th><th style="padding:8px;">Flat</th><th style="padding:8px;">+ Bond tent</th></tr></thead><tbody>';for(const o of n){const l=ns[o];r+=`<tr><td style="padding:8px;border:1px solid var(--border);"><strong>${l.label}</strong><br><span style="font-size:11px;color:var(--text-muted);">${Math.round(l.equity*100)}/${Math.round(l.bond*100)}/${Math.round(l.cash*100)}</span></td>`,r+=i(e[o].flat,s.key===o&&s.tent==="flat"),r+=i(e[o].tent,s.key===o&&s.tent==="tent"),r+="</tr>"}r+="</tbody></table>",r+=`<p style="margin-top:12px;font-size:13px;">Best coverage: <strong>${ns[s.key].label}${s.tent==="tent"?" + bond tent":""}</strong> at ${s.cov.toFixed(0)}%. Set it in Settings if you'd like it.</p>`,t&&(t.innerHTML=r)}window.applyLongevitySuggestion=function(){const t=+document.getElementById("ssLongevityAge").value;if(!t){showToast("Enter your current age first","warning");return}const e=document.getElementById("ssLongevitySex").value,n=+document.getElementById("ssLongevityPct").value,s=cS(t,e,n);document.getElementById("ssDuration").value=Math.max(1,s-t),document.getElementById("ssLongevityNote").textContent="Set to age "+s+" ("+Math.max(1,s-t)+" years). Approximate ONS-style cohort figures — planning to the average means a 50% chance of outliving the plan."};window.setAccessMethod=function(t,e){const n=document.getElementById(t+"AccessMethod");n&&(n.value=e),syncAccessButtons(t)};window.syncAccessButtons=function(t){const e=(document.getElementById(t+"AccessMethod")||{}).value||"drawdown";document.querySelectorAll(`[onclick^="setAccessMethod('`+t+`'"]`).forEach(s=>{s.classList.toggle("active",s.dataset.access===e)});const n=document.getElementById(t+"UfplsPhase");n&&(n.style.display=e==="ufpls"?"block":"none")};syncAccessButtons("ss");syncAccessButtons("ds");const Mi={ss:"mo",ds:"mo"};window.netSpendChanged=function(t,e){const n=+e||0,s=Mi[t]==="mo"?n*12:n;document.getElementById(t+"BaseSalary").value=Math.round(Gr(s)),Fy(t)};window.toggleNetPeriod=function(t){Mi[t]=Mi[t]==="mo"?"yr":"mo",document.getElementById(t+"NetPeriodBtn").textContent="/"+Mi[t],syncNetFromGross(t)};window.syncNetFromGross=function(t){const e=+document.getElementById(t+"BaseSalary").value||0,n=Wt(e,sa.pa,sa.brl,sa.hrl),s=document.getElementById(t+"NetSpend");s&&(s.value=e?Math.round(Mi[t]==="mo"?n/12:n):""),Fy(t),qA(t)};function Fy(t){const e=Math.round(+document.getElementById(t+"BaseSalary").value||0),n=document.getElementById(t+"NetGrossNote");n&&(n.textContent=e?"≈ "+_e(e)+"/yr before tax — withdrawals are sized to cover the tax":"")}async function qA(t){const e=document.getElementById(t+"BudgetChipRow"),n=document.getElementById(t+"BudgetChip");if(!(!e||!n)){try{const s=window._budget||Rc(await su()),i=Zi(s);if(i.allInComfortableMonthly>0){n.textContent="From your budget: "+_e(i.allInComfortableMonthly)+"/mo — use",n.dataset.monthly=Math.round(i.allInComfortableMonthly),e.style.display="block";return}}catch{}e.style.display="none"}}window.useBudgetSpend=function(t){const e=document.getElementById(t+"BudgetChip"),n=+(e&&e.dataset.monthly||0);n&&(Mi[t]="mo",document.getElementById(t+"NetPeriodBtn").textContent="/mo",document.getElementById(t+"NetSpend").value=n,netSpendChanged(t,n))};async function yl(){kt("Loading settings...");try{const t=await wt();document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(n=>({...n})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssDbAmount").value=t.dbAmount||0,document.getElementById("ssDbStartYear").value=t.dbStartYear||0,document.getElementById("ssDbIndexation").value=t.dbIndexation||"lpi5",document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",Ic("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0,document.getElementById("ssAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("ssUfplsYears").value=t.ufplsYears||"",document.getElementById("ssUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("ssBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ss");const e=document.getElementById("ssSeedNote");e&&(e.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),ml()}catch(t){console.error("Error loading stress settings:",t)}finally{Ct()}}window.saveStressSettingsUI=async function(){if(!lt()){showToast("Please sign in to save settings","error");return}const t=ul(document.getElementById("ssSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ss");if(pu(e.equityMin,e.bondMin,e.cashTarget)){kt("Saving settings...");try{const n=await wt(),s=+document.getElementById("ssBaseSalary").value,i=Array.isArray(n.targetSchedule)&&Math.abs(s-(n.targetSchedule[0]||0))<1;await _o({configured:!0,accessMethod:document.getElementById("ssAccessMethod").value||"drawdown",ufplsYears:+document.getElementById("ssUfplsYears").value||null,ufplsThenPcls:document.getElementById("ssUfplsPcls").checked,bandFillRecycle:document.getElementById("ssBandFillRecycle").checked,targetSchedule:i?n.targetSchedule:null,baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,dbAmount:+document.getElementById("ssDbAmount").value||0,dbStartYear:+document.getElementById("ssDbStartYear").value||0,dbIndexation:document.getElementById("ssDbIndexation").value||"lpi5",spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,recoveryBuffer:+document.getElementById("ssRecoveryBuffer").value||15e3,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value,isaBalance:+document.getElementById("ssIsaBalance").value||0,spendingProfile:document.getElementById("ssSpendingProfile").value,equityGlideEnabled:document.getElementById("ssEquityGlide").checked,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:gu("ss"),taggedFunds:Yt("ss").filter(r=>r.ticker&&r.value>0)}),mu({...e,duration:+document.getElementById("ssDuration").value||35}),fu(),showToast("Settings saved successfully","success")}catch(n){console.error("Error saving stress settings:",n),showToast("Error saving: "+n.message,"error")}finally{Ct()}}};window.copyDecisionFromStressUI=async function(t){if(!lt()){showToast("Please sign in first","error");return}if(await rr()){showToast("This plan is locked — unlock it (Settings) or create a new plan before copying settings into it.","warning",6e3);return}kt("Copying from Stress Tester…");try{const e=await wt();if(t==="target")await ri({baseSalary:e.baseSalary});else{const n=await bt();await ri(zI(e,n))}await vl(),showToast(t==="target"?"Target copied from the Stress Tester ("+_e(e.baseSalary||0)+"/yr gross).":"All Stress settings copied — review them and press Save Settings to commit the plan.","success",5e3)}catch(e){console.error("Copy from stress error:",e),showToast("Could not copy: "+e.message,"error")}finally{Ct()}};window.copyStressFromDecisionUI=async function(){if(!lt()){showToast("Please sign in first","error");return}if(confirm("Copy your Decision Tool plan basics (funds, income, State Pension, ISA, protection) into the Stress Tester? Your Stress-specific what-ifs (tax mode, HODL) are kept.")){kt("Copying from Decision...");try{const t=await bt(),e=await wt(),n=VI(t,e);await _o(n),await yl(),showToast("Stress Tester seeded from your Decision plan","success")}catch(t){console.error("Error copying from decision:",t),showToast("Error copying: "+t.message,"error")}finally{Ct()}}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){kt("Resetting settings...");try{await lx(),await yl(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{Ct()}}};async function vl(){kt("Loading settings...");try{const t=await bt();document.getElementById("dsDuration").value=t.duration||35,writeAlloc("ds",t.equityMin??25e4,t.bondMin??2e5,t.cashTarget??5e4,t.diversifierStart||0),restoreCustomAllocFromSettings("ds",t),window._taggedFunds.ds=(t.taggedFunds||[]).map(e=>({...e})),setAllocMode("ds",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("dsEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=t.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("dsProtectionFactor").value=t.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("dsDisableProtection").checked=t.disableProtection||!1,document.getElementById("dsConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("dsIsaBalance").value=t.isaBalance||0,document.getElementById("dsAccessMethod").value=t.accessMethod||"drawdown",document.getElementById("dsUfplsYears").value=t.ufplsYears||"",document.getElementById("dsUfplsPcls").checked=!!t.ufplsThenPcls,document.getElementById("dsBandFillRecycle").checked=!!t.bandFillRecycle,syncAccessButtons("ds"),document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",ml(),await Su()}catch(t){console.error("Error loading decision settings:",t)}finally{Ct()}}let HA=0;const Ot=()=>"b"+ ++HA,_e=t=>"£"+Math.round(+t||0).toLocaleString(),Ee=t=>String(t??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");function Rc(t){const e={...Yr(),...t||{}};return e.lines=(Array.isArray(e.lines)?e.lines:[]).map(n=>({id:n.id||Ot(),...n})),e.oneOffs=(Array.isArray(e.oneOffs)?e.oneOffs:[]).map(n=>({id:n.id||Ot(),...n})),e}async function WA(){Pc=!1;try{window._budget=Rc(await su())}catch(e){console.error("Budget load error:",e),window._budget=Rc(Yr())}window._budget.lines.length||(window._budget.lines=xg().map(e=>({id:Ot(),...e})),window._budget.oneOffs.length||(window._budget.oneOffs=Ag().map(e=>({id:Ot(),...e})))),document.getElementById("budCurrentAge").value=window._budget.currentAge,document.getElementById("budRetireAge").value=window._budget.retirementAge,document.getElementById("budEndAge").value=window._budget.endAge,document.getElementById("budShared").checked=!!window._budget.sharedWithPartner,document.getElementById("budSharePct").value=window._budget.mySharePct??50,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",Ft(),Pn(),Be(),Vy();const t=!window._budget.lines.some(e=>e.annual)&&!window._budget.oneOffs.some(e=>e.amount);document.getElementById("budWizBanner").style.display=t?"block":"none",Pc=!0,Js("Autosaves as you edit"),window._budWizAutoOpen&&(window._budWizAutoOpen=!1,openBudgetWizard())}function Vy(){const t=bo(window._budget);document.querySelectorAll("#budTierBtns [data-tier], #budWizTierBtns [data-tier]").forEach(e=>{e.classList.toggle("active",e.dataset.tier===t)})}window.setPlsaTier=function(t){window._budget.plsaTier=t,Vy(),document.getElementById("budWizardOverlay").style.display!=="none"&&_t(!0);const n=window.scrollY;Ft(),Pn(),Be(),window.scrollTo(0,n)};function bl(t,e){const n=t.paidBy||"me",s=(o,l)=>'<option value="'+o+'"'+(n===o?" selected":"")+">"+l+"</option>",i=window._budget.mySharePct??50,r=n==="shared"?'<input type="number" min="0" max="100" placeholder="'+i+'%" title="Your % of this shared cost (blank = the overall split)" value="'+(t.mySharePct??"")+'" oninput="'+e+"('"+t.id+`','mySharePct',this.value)" style="flex:0 0 62px;">`:"";return'<select title="Who pays this?" onchange="'+e+"('"+t.id+`','paidBy',this.value)" style="flex:0 0 96px;">`+s("me","Me")+s("partner","Partner")+s("shared","Shared")+"</select>"+r}window.onBudgetSharedToggle=function(){window._budget.sharedWithPartner=document.getElementById("budShared").checked,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",Ft(),Pn(),Be()};window.onBudgetSharePctChange=function(){window._budget.mySharePct=+document.getElementById("budSharePct").value||0,Be()};function Gf(t){const e=t.hint?'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.3;">'+Ee(t.hint)+"</div>":"",n=t.period||"yr",s=t.annual==null?"":n==="mo"?Math.round(t.annual/12):t.annual,i=Xi(t.label,window._budget),r=i!=null?"≈"+(n==="mo"?i:i*12):"Amount",o=window._budget.sharedWithPartner?`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Add a copy for your partner (e.g. their car)" onclick="duplicateBudgetLine('`+t.id+`')">⧉</button>`:"";return'<div class="bud-row" data-id="'+t.id+'" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;"><div style="flex:1 1 200px; min-width:170px;"><input type="text" placeholder="Category" value="'+Ee(t.label)+`" oninput="updateBudgetLine('`+t.id+`','label',this.value)" style="width:100%;">`+e+'</div><div style="display:flex; gap:4px; flex:0 0 186px; align-items:center;"><input type="text" inputmode="decimal" id="bm-amt-'+t.id+'" placeholder="'+r+`" title="Amount in today's money — sums welcome: 11.99+8.99 or =4×52/12`+(i!=null?" (typical shown)":"")+'" value="'+s+`" onchange="updateBudgetAmount('`+t.id+`',this.value,this)" style="flex:1 1 auto; min-width:0;"><button type="button" class="risk-btn" style="padding:4px 8px; flex:0 0 auto;" title="Switch monthly / yearly" onclick="toggleBudgetPeriod('`+t.id+`')">`+(n==="mo"?"/mo":"/yr")+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" style="padding:4px 8px; flex:0 0 auto;" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bm','`+t.id+`')">&Sigma;</button></div>`+(window._budget.sharedWithPartner?bl(t,"updateBudgetLine"):"")+'<input type="number" placeholder="from age" title="From age (blank = retirement). For temporary costs — e.g. a car lease with 3 years left — set when it starts and stops." value="'+(t.fromAge??"")+`" oninput="updateBudgetLine('`+t.id+`','fromAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="to age" title="To age (blank = end of plan)" value="`+(t.toAge??"")+`" oninput="updateBudgetLine('`+t.id+`','toAge',this.value)" style="flex:0 0 84px;">`+o+`<button type="button" class="risk-btn" style="padding:4px 10px;" title="Remove" onclick="removeBudgetLine('`+t.id+`')">&times;</button>`+(t.breakdownOpen?'<div style="flex-basis:100%;">'+$y("bm",t)+"</div>":"")+"</div>"}function Ft(){const t=window._budget.lines.filter(n=>n.tier==="essential"),e=window._budget.lines.filter(n=>n.tier==="discretionary");document.getElementById("budEssentialRows").innerHTML=t.map(Gf).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No essentials yet — add housing, bills, food, transport…</p>',document.getElementById("budDiscretionaryRows").innerHTML=e.map(Gf).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No lifestyle spending yet — holidays, hobbies, eating out…</p>',bu()}function GA(t){const e=t.hint?'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.3;">'+Ee(t.hint)+"</div>":"";return'<div class="bud-row" data-id="'+t.id+'" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;"><div style="flex:1 1 170px; min-width:150px;"><input type="text" placeholder="e.g. Car" value="'+Ee(t.label)+`" oninput="updateBudgetOneOff('`+t.id+`','label',this.value)" style="width:100%;">`+e+`</div><input type="number" placeholder="£ amount" title="Total cost in today's money" value="`+(t.amount??"")+`" oninput="updateBudgetOneOff('`+t.id+`','amount',this.value)" style="flex:0 0 120px;">`+(window._budget.sharedWithPartner?bl(t,"updateBudgetOneOff"):"")+'<input type="number" placeholder="at age" value="'+(t.atAge??"")+`" oninput="updateBudgetOneOff('`+t.id+`','atAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="every N yrs" title="Leave blank for a one-time cost" value="`+(t.everyYears??"")+`" oninput="updateBudgetOneOff('`+t.id+`','everyYears',this.value)" style="flex:0 0 110px;">`+(window._budget.sharedWithPartner?`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Add a copy for your partner" onclick="duplicateBudgetOneOff('`+t.id+`')">⧉</button>`:"")+`<button type="button" class="risk-btn" style="padding:4px 10px;" title="Remove" onclick="removeBudgetOneOff('`+t.id+`')">&times;</button></div>`}function Pn(){document.getElementById("budOneOffRows").innerHTML=window._budget.oneOffs.map(GA).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No one-off costs yet — a car every ~8 years, a new roof, a milestone trip…</p>'}function bu(){const t=Wr(window._budget),e=document.getElementById("budSuggestionsSection"),n=document.getElementById("budSuggestions");if(!t.length){e.style.display="none",n.innerHTML="";return}e.style.display="block",n.innerHTML=t.map(s=>'<button type="button" class="risk-btn" style="padding:5px 10px;" title="'+Ee(s.hint||"")+`" onclick="addBudgetSuggestion('`+Ee(s.label).replace(/'/g,"\\'")+`')">+ `+Ee(s.label)+"</button>").join("")}window.addBudgetSuggestion=function(t){const e=Wr(window._budget).find(n=>n.label===t);e&&(window._budget.lines.push({id:Ot(),label:e.label,tier:e.tier,annual:null,fromAge:null,toAge:null,hint:e.hint||"",period:e.period||"yr",paidBy:e.paidBy||"me"}),Ft(),bu(),Be())};function wu(){window._budget.currentAge=+document.getElementById("budCurrentAge").value||0,window._budget.retirementAge=+document.getElementById("budRetireAge").value||0,window._budget.endAge=+document.getElementById("budEndAge").value||100}window.onBudgetHorizonChange=function(){wu(),Be()};window.updateBudgetLine=function(t,e,n){const s=window._budget.lines.find(i=>i.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="fromAge"||e==="toAge"?s[e]=n===""?null:_l(n):s[e]=n===""?null:+n,e==="label"&&bu(),e==="paidBy"&&Ft(),Be())};window.updateBudgetAmount=function(t,e,n){const s=window._budget.lines.find(r=>r.id===t);if(!s)return;const i=String(e).trim();if(i==="")s.annual=null;else{const r=sl(i);if(r==null)return;s.annual=(s.period||"yr")==="mo"?r*12:r,n&&(n.value=r)}budTouch(),Be()};window.toggleBudgetPeriod=function(t){const e=window._budget.lines.find(s=>s.id===t);if(!e)return;e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch();const n=window.scrollY;Ft(),Be(),window.scrollTo(0,n)};window.updateBudgetOneOff=function(t,e,n){const s=window._budget.oneOffs.find(i=>i.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="atAge"?s[e]=n===""?null:_l(n):s[e]=n===""?null:+n,e==="paidBy"&&Pn(),Be())};window.addBudgetLine=function(t){window._budget.lines.push({id:Ot(),label:"",tier:t,annual:null,fromAge:null,toAge:null}),Ft(),Be()};window.addBudgetOneOff=function(){window._budget.oneOffs.push({id:Ot(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),Pn(),Be()};window.removeBudgetLine=function(t){const e=window._budget.lines.findIndex(n=>n.id===t);e<0||(wl("line",window._budget.lines[e],e),window._budget.lines.splice(e,1),Ft(),Be())};window.removeBudgetOneOff=function(t){const e=window._budget.oneOffs.findIndex(n=>n.id===t);e<0||(wl("oneOff",window._budget.oneOffs[e],e),window._budget.oneOffs.splice(e,1),Pn(),Be())};window.duplicateBudgetLine=function(t){const e=window._budget.lines,n=e.find(i=>i.id===t);if(!n)return;const s={...n,id:Ot(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,s),Ft(),Be()};window.duplicateBudgetOneOff=function(t){const e=window._budget.oneOffs,n=e.find(i=>i.id===t);if(!n)return;const s={...n,id:Ot(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,s),Pn(),Be()};window.fillTypicalAmounts=function(){let t=0;for(const e of window._budget.lines)if(e.annual==null||e.annual===""){const n=Xi(e.label,window._budget);n!=null&&(e.annual=n*12,t++)}Ft(),Be(),showToast(t?"Filled "+t+" blank categories with "+Ig[bo(window._budget)]+" figures — adjust freely":"No blank categories with a typical figure",t?"success":"info")};function Be(){budTouch(),wu();const t=window._budget,e=t.retirementAge,n=bc(t,e,"essential"),s=bc(t,e,"all");document.getElementById("budEssentialSubtotal").textContent=_e(n),document.getElementById("budDiscretionarySubtotal").textContent=_e(s-n);const i=Zi(t),r=A=>_e(A),o=t.oneOffs.filter(A=>(+A.everyYears||0)>0&&(+A.amount||0)>0),l=t.oneOffs.filter(A=>!((+A.everyYears||0)>0)&&(+A.amount||0)>0),c=Tg.single,d=i.allInComfortableAnnual,h=d>=c.comfortable?"at/above Comfortable":d>=c.moderate?"between Moderate and Comfortable":d>=c.minimum?"between Minimum and Moderate":"below the Minimum",m=i.sharedWithPartner;let p="";if(p+='<div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;">',p+='<div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(m?" — your share":"")+'</div><div style="font-size:22px;font-weight:700;">'+r(i.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div>',p+='<div><div style="font-size:12px;color:var(--text-muted);">'+(m?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:26px;font-weight:800;color:var(--primary,#6366f1);">'+r(i.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+r(d)+"/yr — what your plan funds</div></div>",m&&(p+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:22px;font-weight:700;">'+r(i.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+r(i.partnerAllInAnnual)+"/yr — their side of this budget</div></div>",p+='<div><div style="font-size:12px;color:var(--text-muted);">Household all-in</div><div style="font-size:22px;font-weight:700;">'+r(i.householdComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">everything, both of you</div></div>'),p+="</div>",m&&i.partnerAllInAnnual>0&&(p+='<div class="alert alert-info" style="margin-bottom:12px;">Your partner’s share is <strong>'+r(i.partnerAllInMonthly)+"/mo</strong> ("+r(i.partnerAllInAnnual)+'/yr). They can create their own free plan and use that as <em>their</em> target income. <span style="color:var(--text-muted);">Note: this plan only funds <em>your</em> share — it doesn’t check your partner can fund theirs.</span></div>'),p+='<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">= comfortable recurring <strong style="color:var(--text);">'+r(i.comfortableMonthlyNet)+"/mo</strong>"+(i.periodicMonthlyAverage>0?' + periodic set-aside <strong style="color:var(--text);">'+r(i.periodicMonthlyAverage)+"/mo</strong> <span>(averaged from the big periodic costs below)</span>":"")+".</div>",p+='<div class="alert alert-info" style="margin-bottom:12px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+r(c.minimum)+" · Moderate "+r(c.moderate)+" · Comfortable "+r(c.comfortable)+" per year. Your all-in spend is <strong>"+h+'</strong>. <span style="color:var(--text-muted);">(Assumes home owned outright; excludes care costs.)</span></div>',o.length){p+='<div style="font-size:13px;margin-bottom:8px;"><strong>Periodic costs</strong> (averaged into the monthly need, but the cash lands lumpily):<ul style="margin:6px 0 0; padding-left:18px;">';for(const A of o){const P=+A.amount/+A.everyYears;p+="<li>"+Ee(A.label||"item")+": "+r(A.amount)+" every "+ +A.everyYears+" yrs ≈ <strong>"+r(P)+"/yr</strong> ("+r(P/12)+"/mo)</li>"}p+="</ul></div>"}if(l.length){p+='<div style="font-size:13px;margin-bottom:12px;"><strong>One-time costs</strong> (not in the monthly average — planned for the year they fall):<ul style="margin:6px 0 0; padding-left:18px;">';for(const A of l)p+="<li>"+Ee(A.label||"item")+": "+r(A.amount)+(A.atAge?" at age "+ +A.atAge:"")+"</li>";p+="</ul></div>"}const w=+window._budget.targetHeadroomMonthly||0,I=i.allInComfortableMonthly+w,S=Gr(i.allInComfortableAnnual+w*12);p+='<div style="border-top:1px solid var(--border); padding-top:12px;">',p+='<div style="font-size:13px; margin-bottom:8px;">Your all-in take-home of <strong>'+r(i.allInComfortableMonthly)+"/mo</strong> becomes the <strong>target both tools work to</strong>: the Stress Tester asks “will my pots deliver this for life?” and the Decision Tool works out each month’s withdrawal to hit it tax-efficiently.</div>",p+='<div style="font-size:13px; margin-bottom:10px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">Optional headroom on top: £<input type="number" min="0" value="'+(window._budget.targetHeadroomMonthly??"")+'" placeholder="0" onchange="budHeadroomChanged(this.value)" style="width:90px;">/mo <span style="color:var(--text-muted);">— breathing room above the budget, so the plan isn’t cut to the bone.</span></div>',p+='<div style="font-size:13px; margin-bottom:8px;">Plan target: <strong>'+r(I)+'/mo take-home</strong> <span style="color:var(--text-muted);">(≈ '+r(S)+"/yr before tax"+(w?" — budget + "+r(w)+"/mo headroom":"")+")</span></div>",p+='<button type="button" onclick="applyBudgetToPlan()">Set as my plan’s target (Stress + Decision)</button>',p+="</div>",document.getElementById("budSummary").innerHTML=p}let Pc=!1,eo=null;function Js(t){if(Jn)return;const e=document.getElementById("budSaveStatus");e&&(e.textContent=t)}let Jn=null,Mc=null;function wl(t,e,n){Jn={kind:t,item:e,index:n},clearTimeout(Mc),Mc=setTimeout(()=>{Jn=null,Dc()},12e3),Dc()}function Dc(){const t=Jn?Jn.item.label||"item":null,e=Jn?"Removed “"+Ee(t)+'” — <button type="button" class="budwiz-chip" onclick="budUndoRemove()">Undo</button>':null,n=document.getElementById("budSaveStatus");n&&e?n.innerHTML=e:n&&!e&&Js("Saved ✓");const s=document.getElementById("budWizUndoSlot");s&&(s.innerHTML=e||"")}window.budUndoRemove=function(){if(!Jn)return;const{kind:t,item:e,index:n}=Jn;Jn=null,clearTimeout(Mc);const s=t==="line"?window._budget.lines:window._budget.oneOffs;if(s.splice(Math.min(n,s.length),0,e),budTouch(),document.getElementById("budWizardOverlay").style.display!=="none")_t(!0);else{const r=window.scrollY;Ft(),Pn(),Be(),window.scrollTo(0,r)}Dc()};window.budTouch=function(){!Pc||!window._budget||(Js("Saving…"),clearTimeout(eo),eo=setTimeout(_u,1200))};function zy(){return{...window._budget,lines:window._budget.lines.filter(t=>t.label&&t.label.trim()||t.annual||t.breakdown&&t.breakdown.some(e=>e.label&&e.label.trim()||e.amount)),oneOffs:window._budget.oneOffs.filter(t=>t.label&&t.label.trim()||t.amount)}}async function _u(){if(!lt()){Js("Sign in to save");return}try{await iu(zy()),Js("Saved ✓")}catch(t){console.error("Budget autosave error:",t),Js("Not saved — retrying…"),clearTimeout(eo),eo=setTimeout(_u,4e3)}}window.resetBudgetUI=async function(){confirm(`Reset the budget?

All amounts, sub-sheets and custom lines go back to a fresh start. Your ages and partner-sharing setting are kept.

This saves immediately and cannot be undone.`)&&(window._budget.lines=xg().map(t=>({id:Ot(),...t})),window._budget.oneOffs=Ag().map(t=>({id:Ot(),...t})),Ft(),Pn(),Be(),await _u(),showToast("Budget reset to a fresh start","success"))};window.saveBudgetUI=async function(){if(!lt()){showToast("Please sign in to save your budget","error");return}wu(),kt("Saving budget…");try{clearTimeout(eo),await iu(zy()),Js("Saved ✓"),showToast("Budget saved","success")}catch(t){console.error("Budget save error:",t),showToast("Error saving budget: "+t.message,"error")}finally{Ct()}};window.budHeadroomChanged=function(t){window._budget.targetHeadroomMonthly=t===""?null:Math.max(0,+t||0),Be()};window.applyBudgetToPlan=async function(){const t=Zi(window._budget),e=+window._budget.targetHeadroomMonthly||0,n=Math.round(Gr(t.allInComfortableAnnual+e*12));if(!n){showToast("Add some spending first","warning");return}kt("Applying to plan…");try{const i=(await wt()).duration||35,o=FI(window._budget,i).map(h=>Math.round(Gr(h+e*12)));await _o({baseSalary:n,targetSchedule:o});const l=await rr();l||await ri({baseSalary:n});const c=document.getElementById("ssBaseSalary");c&&(c.value=n,syncNetFromGross("ss"));const d=document.getElementById("dsBaseSalary");d&&!l&&(d.value=n,syncNetFromGross("ds")),showToast("Target set: both tools now work to "+_e(t.allInComfortableMonthly+e)+"/mo take-home"+(e?" (incl. "+_e(e)+"/mo headroom)":"")+" — "+_e(n)+"/yr gross"+(l?". Stress only; the Decision plan is locked":""),"success",5e3)}catch(s){console.error("Apply-to-plan error:",s),showToast("Could not apply: "+s.message,"error")}finally{Ct()}};const Io=[{key:"home",title:"Home & bills",tier:"essential",tip:"Will your mortgage still exist at retirement? If it ends earlier, use the ⏱ button on its row to set the age it stops. Bills mostly carry on — but you'll be home more, so heating often rises.",labels:["Rent / mortgage","Council tax","Gas","Electricity","Water","Broadband","Mobile phones","TV licence","Home insurance","Boiler service","Home upkeep","Premier banking / account fees","Cleaner / gardener","Second / holiday home","Storage / lock-up"]},{key:"food",title:"Food, drink & eating out",tier:"essential",tip:"With more free time most retirees eat OUT more, not less. Check 2–3 months of bank statements for what you really spend — real numbers beat guesses.",labels:["Groceries & household","Eating out & takeaways","Alcohol"]},{key:"transport",title:"Transport",tier:"essential",tip:"Commuting disappears at retirement, but running costs are easy to underestimate — servicing, MOT, tyres, repairs. Replacing the car itself goes in One-off costs (a later step).",labels:["Car insurance","Car tax","Petrol / fuel","Car servicing & maintenance","Breakdown cover","Parking & permits","Public transport"]},{key:"health",title:"Health & protection",tier:"essential",tip:"Health spending tends to RISE with age — and the PLSA benchmarks exclude long-term care entirely. A monthly care set-aside is easy to add now and painful to discover missing later.",labels:["Personal health","Health / dental insurance","Dental & optical","Hearing","Life insurance / income protection","Long-term care set-aside"]},{key:"leisure",title:"Holidays, hobbies & leisure",tier:"discretionary",tip:'Most people spend MORE on holidays and hobbies in the early "go-go" years. Budget for the retirement you actually want — the spending smile tapers it in later life.',labels:["Main holiday","UK breaks","Day trips","Streaming & entertainment","Digital subscriptions","Gym & fitness","Sports & equipment","Sports clothes","Hobbies & leisure","Newspapers, books & media"]},{key:"personal",title:"Personal, family & giving",tier:"discretionary",tip:'The easiest category to underestimate: gifts, grandchildren, Christmas. A personal "spends" line per person keeps day-to-day money simple.',labels:["Clothes","Gifts & family","Charity","Pets","Personal spending money","Kids / dependents","Christmas & birthdays","Hairdressing & grooming","Grandchildren","Professional memberships","My personal spending","Partner's personal spending"]},{key:"extras",title:"Around the home & everything else",tier:"discretionary",tip:"Furniture wears out, technology needs refreshing, and a small emergency buffer stops a bad month becoming a plan problem. Anything of yours that didn't fit an earlier screen appears here too.",labels:["Home furnishings & décor","Home technology","Emergency buffer"]}],Eu=(()=>{const t={};for(const e of Io)for(const n of e.labels)t[n.toLowerCase()]=e.key;return t})(),Sr=["intro",...Io.map(t=>t.key),"oneoffs","review"];let Un=0;function YA(t){return t.wizGroup&&Io.some(e=>e.key===t.wizGroup)?t.wizGroup:Eu[(t.label||"").trim().toLowerCase()]||"extras"}window.openBudgetWizard=function(){window._budget&&(Un=0,document.getElementById("budWizardOverlay").style.display="block",_t())};window.closeBudgetWizard=function(){document.getElementById("budWizardOverlay").style.display="none",Ft(),Pn(),Be()};window.budWizGo=function(t){Un=Math.max(0,Math.min(Sr.length-1,Un+t)),_t()};function jA(t){return t.annual==null?"":(t.period||"yr")==="mo"?Math.round(t.annual/12):t.annual}function KA(t){const e=t.period||"yr",n=Xi(t.label,window._budget),s=Ig[bo(window._budget)].replace("PLSA ",""),i=n!=null&&n>0?s+" "+_e(e==="mo"?n:n*12)+"/"+e:null,o=!!Eu[(t.label||"").trim().toLowerCase()]?'<div style="font-weight:600;">'+Ee(t.label)+"</div>":'<input type="text" placeholder="What is it?" value="'+Ee(t.label)+`" oninput="budWizField('`+t.id+`','label',this.value)" style="width:100%;">`,l=t.hint?'<div class="budwiz-hint">'+Ee(t.hint)+"</div>":"",c=Rg(t.label,t.annual,window._budget),d=c?'<div class="budwiz-nudge" id="bw-n-'+t.id+'">'+(c==="low"?"Well below typical ("+_e(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+_e(n)+"/mo) — worth double-checking.")+"</div>":'<div class="budwiz-nudge" id="bw-n-'+t.id+'"></div>';return'<div class="budwiz-row" id="bw-row-'+t.id+'"><div class="budwiz-name">'+o+l+'</div><div class="budwiz-amt"><input type="text" inputmode="decimal" id="bw-amt-'+t.id+`" placeholder="£ or e.g. =12+9.50" title="Amount in today's money — sums welcome: 11.99+8.99, =4×52/12" value="`+jA(t)+`" onchange="budWizAmount('`+t.id+`',this.value,this)" style="flex:1 1 auto; min-width:0;"><button type="button" class="risk-btn" style="padding:6px 9px;" title="Switch monthly / yearly" onclick="budWizTogglePeriod('`+t.id+`')">/`+e+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" style="padding:6px 9px;" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bw','`+t.id+`')">&Sigma;</button></div><div class="budwiz-chipslot">`+(i?`<button type="button" class="budwiz-chip" onclick="budWizUseTypical('`+t.id+`')" title="ONS retired-household average — a starting point">`+i+" — use</button>":"")+"</div>"+(window._budget.sharedWithPartner?bl(t,"budWizField"):"")+(ca(t)?'<input type="number" placeholder="from age" title="From age (blank = retirement)" value="'+(t.fromAge??"")+`" oninput="budWizField('`+t.id+`','fromAge',this.value)" style="flex:0 0 78px;"><input type="number" placeholder="to age" title="To age (blank = end of plan). E.g. a car lease with 3 years left: to retirement age + 3." value="`+(t.toAge??"")+`" oninput="budWizField('`+t.id+`','toAge',this.value)" style="flex:0 0 78px;">`:"")+'<button type="button" class="risk-btn'+(ca(t)?" active":"")+'" style="padding:6px 9px;" title="'+(ca(t)?"Remove the age limits — make this a whole-of-retirement cost again":"Assumed for the whole retirement. Click to limit it to an age range — for temporary costs like a lease or a mortgage that ends.")+`" onclick="budWizBandToggle('`+t.id+`')">&#x23F1;</button><button type="button" class="risk-btn" style="padding:6px 11px;" title="Remove" onclick="budWizRemove('`+t.id+`')">&times;</button><div id="bw-err-`+t.id+'" class="budwiz-err"></div>'+d+(t.breakdownOpen?'<div style="flex-basis:100%;">'+$y("bw",t)+"</div>":"")+"</div>"}window.budWizField=function(t,e,n){const s=window._budget.lines.find(i=>i.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="fromAge"||e==="toAge"?s[e]=n===""?null:_l(n):s[e]=n===""?null:+n,e==="paidBy"&&_t(!0),budTouch(),ir())};window.budWizAmount=function(t,e,n){const s=window._budget.lines.find(o=>o.id===t);if(!s)return;const i=document.getElementById("bw-err-"+t),r=String(e).trim();if(r==="")s.annual=null,i&&(i.textContent="");else{const o=sl(r);if(o==null){i&&(i.textContent="Couldn’t read that — a number or a simple sum like 12.99+8.50 works.");return}i&&(i.textContent=""),s.annual=(s.period||"yr")==="mo"?o*12:o,n&&(n.value=(s.period||"yr")==="mo"?Math.round(s.annual/12):s.annual)}Bc(s),budTouch(),ir()};function Bc(t){const e=document.getElementById("bw-n-"+t.id);if(!e)return;const n=Xi(t.label,window._budget),s=Rg(t.label,t.annual,window._budget);e.textContent=s?s==="low"?"Well below typical ("+_e(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+_e(n)+"/mo) — worth double-checking.":""}function _l(t){const e=+t;if(!Number.isFinite(e))return null;if(e>1e3){const n=new Date().getFullYear()-(+window._budget.currentAge||0);return Math.max(0,e-n)}return e}function ca(t){return t.fromAge!=null||t.toAge!=null||t._bandOpen}window.budWizBandToggle=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(ca(e)?(e._bandOpen=!1,e.fromAge=null,e.toAge=null,budTouch()):e._bandOpen=!0,_t(!0))};window.budWizTogglePeriod=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch(),_t(!0))};window.budWizUseTypical=function(t){const e=window._budget.lines.find(s=>s.id===t);if(!e)return;const n=Xi(e.label,window._budget);n!=null&&(e.annual=n*12,budTouch(),_t(!0))};window.budWizRemove=function(t){const e=window._budget.lines.findIndex(n=>n.id===t);e<0||(wl("line",window._budget.lines[e],e),window._budget.lines.splice(e,1),budTouch(),_t(!0))};window.budWizAddLine=function(t){const e=Io.find(n=>n.key===t);window._budget.lines.push({id:Ot(),label:"",tier:e&&e.tier||"discretionary",annual:null,fromAge:null,toAge:null,period:"mo",wizGroup:t}),budTouch(),_t(!0)};window.budWizSuggest=function(t,e){const n=Wr(window._budget).find(s=>s.label===t);n&&(window._budget.lines.push({id:Ot(),label:n.label,tier:n.tier,annual:null,fromAge:null,toAge:null,hint:n.hint||"",period:n.period||"yr",paidBy:n.paidBy||"me",wizGroup:e}),budTouch(),_t(!0))};const sr=t=>window._budget.lines.find(e=>e.id===t);function Tu(t){if(t==="bw"){_t(!0);return}const e=window.scrollY;Ft(),Be(),window.scrollTo(0,e)}function $y(t,e){return'<div style="background:var(--card-alt); border:1px solid var(--border); border-radius:8px; padding:10px; margin-top:6px;"><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Break it into parts — mix /mo and /yr freely; sums (or =sums) are fine in each box. The total is written to the line for you, and the parts are saved.</div>'+(e.breakdown||[]).map((s,i)=>'<div style="display:flex; gap:6px; margin-bottom:6px; align-items:center;"><input type="text" placeholder="'+(i===0?"e.g. insurance":i===1?"e.g. fuel":"part "+(i+1))+'" value="'+Ee(s.label)+`" oninput="budBreakField('`+t+"','"+e.id+"',"+i+`,'label',this.value)" style="flex:1 1 auto; min-width:0;"><input type="text" inputmode="decimal" placeholder="£ or =12+8" value="`+(s.amount??"")+`" onchange="budBreakField('`+t+"','"+e.id+"',"+i+`,'amount',this.value,this)" style="flex:0 0 104px;"><button type="button" class="risk-btn" style="padding:4px 8px;" title="This part is per month / per year" onclick="budBreakTogglePeriod('`+t+"','"+e.id+"',"+i+',this)">/'+(s.period||"yr")+`</button><button type="button" class="risk-btn" style="padding:4px 9px;" title="Remove part" onclick="budBreakRemoveRow('`+t+"','"+e.id+"',"+i+')">&times;</button></div>').join("")+`<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;"><button type="button" class="risk-btn" style="padding:4px 12px;" onclick="budBreakAddRow('`+t+"','"+e.id+`')">+ add part</button><div style="font-size:13px;">Adds up to <strong id="`+t+"-bsum-"+e.id+'">'+Uy(e)+"</strong></div></div></div>"}function Uy(t){const e=Cg(t.breakdown);return(t.period||"yr")==="mo"?_e(e/12)+"/mo":_e(e)+"/yr"}function Iu(t,e){const n=sr(e);if(!n)return;if((n.breakdown||[]).some(i=>+i.amount)){n.annual=Cg(n.breakdown);const i=document.getElementById(t+"-amt-"+e);i&&(i.value=(n.period||"yr")==="mo"?Math.round(n.annual/12):n.annual)}const s=document.getElementById(t+"-bsum-"+e);s&&(s.textContent=Uy(n)),t==="bw"?(ir(),typeof Bc=="function"&&Bc(n)):Be(),budTouch()}window.budBreakToggle=function(t,e){const n=sr(e);n&&(n.breakdownOpen=!n.breakdownOpen,n.breakdownOpen&&!Array.isArray(n.breakdown)&&(n.breakdown=[{label:"",amount:null,period:"mo"},{label:"",amount:null,period:"mo"}]),budTouch(),Tu(t))};window.budBreakAddRow=function(t,e){const n=sr(e);n&&((n.breakdown=n.breakdown||[]).push({label:"",amount:null,period:"mo"}),Tu(t))};window.budBreakRemoveRow=function(t,e,n){const s=sr(e);!s||!s.breakdown||(s.breakdown.splice(n,1),Iu(t,e),Tu(t))};window.budBreakField=function(t,e,n,s,i,r){const o=sr(e),l=o&&o.breakdown&&o.breakdown[n];if(!l)return;if(s==="label"){l.label=i,budTouch();return}const c=String(i).trim();if(c==="")l.amount=null;else{const d=sl(c);if(d==null)return;l.amount=d,r&&(r.value=d)}Iu(t,e)};window.budBreakTogglePeriod=function(t,e,n,s){const i=sr(e),r=i&&i.breakdown&&i.breakdown[n];r&&(r.period=(r.period||"yr")==="mo"?"yr":"mo",s&&(s.textContent="/"+r.period),Iu(t,e))};function QA(t){return'<div class="budwiz-row"><input type="text" placeholder="e.g. Replacement car" value="'+Ee(t.label)+`" oninput="budWizOneOff('`+t.id+`','label',this.value)" style="flex:1 1 170px; min-width:150px;"><input type="text" inputmode="decimal" placeholder="£ total" title="Total cost in today's money — sums welcome" value="`+(t.amount??"")+`" onchange="budWizOneOffAmount('`+t.id+`',this.value,this)" style="flex:0 0 110px;"><input type="number" placeholder="at age" title="Age it first happens" value="`+(t.atAge??"")+`" oninput="budWizOneOff('`+t.id+`','atAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="every N yrs" title="Blank = one-time" value="`+(t.everyYears??"")+`" oninput="budWizOneOff('`+t.id+`','everyYears',this.value)" style="flex:0 0 104px;">`+(window._budget.sharedWithPartner?bl(t,"budWizOneOff"):"")+`<button type="button" class="risk-btn" style="padding:4px 10px;" onclick="budWizRemoveOneOff('`+t.id+`')">&times;</button><div id="bw-oerr-`+t.id+'" class="budwiz-err"></div></div>'}window.budWizOneOff=function(t,e,n){const s=window._budget.oneOffs.find(i=>i.id===t);s&&(e==="label"||e==="paidBy"?s[e]=n:e==="atAge"?s[e]=n===""?null:_l(n):s[e]=n===""?null:+n,e==="paidBy"&&_t(!0),budTouch(),ir())};window.budWizOneOffAmount=function(t,e,n){const s=window._budget.oneOffs.find(o=>o.id===t);if(!s)return;const i=document.getElementById("bw-oerr-"+t),r=String(e).trim();if(r==="")s.amount=null,i&&(i.textContent="");else{const o=sl(r);if(o==null){i&&(i.textContent="Couldn’t read that — a number or a simple sum works.");return}i&&(i.textContent=""),s.amount=o,n&&(n.value=o)}budTouch(),ir()};window.budWizAddOneOff=function(){window._budget.oneOffs.push({id:Ot(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),budTouch(),_t(!0)};window.budWizRemoveOneOff=function(t){const e=window._budget.oneOffs.findIndex(n=>n.id===t);e<0||(wl("oneOff",window._budget.oneOffs[e],e),window._budget.oneOffs.splice(e,1),budTouch(),_t(!0))};window.budWizClearAmounts=function(){for(const t of window._budget.lines)t.annual=null;for(const t of window._budget.oneOffs)t.amount=null;budTouch(),_t(),showToast("Amounts cleared — nothing is saved until you choose Save.","info",4e3)};window.budWizSave=async function(t){await saveBudgetUI(),t&&await applyBudgetToPlan(),closeBudgetWizard()};function ir(){const t=document.getElementById("budWizTotals");if(!t)return;const e=window._budget,n=Zi(e);t.innerHTML="Essential <strong>"+_e(n.essentialMonthlyNet)+"</strong>/mo · Lifestyle <strong>"+_e(n.comfortableMonthlyNet-n.essentialMonthlyNet)+"</strong>/mo · All-in"+(n.sharedWithPartner?" (your share)":"")+' <strong style="color:var(--primary,#6366f1);">'+_e(n.allInComfortableMonthly)+"</strong>/mo"}function JA(t){if(t==="intro"){const r=window._budget.lines.some(c=>c.annual)||window._budget.oneOffs.some(c=>c.amount)?'<div class="alert alert-warning" style="margin-bottom:12px;"><strong>You already have a saved budget</strong> — the totals in the bar below are your own saved figures, and each screen shows them ready to edit. Prefer a clean slate? <button type="button" class="risk-btn" style="padding:4px 12px; margin-left:4px;" onclick="budWizClearAmounts()">Start fresh — clear all amounts</button><span style="color:var(--text-muted);"> (nothing is saved until you choose Save at the end)</span></div>':"",o=bo(window._budget),l=(c,d)=>'<button type="button" class="risk-btn'+(o===c?" active":"")+'" data-tier="'+c+`" onclick="setPlsaTier('`+c+`')">`+d+"</button>";return'<h2 style="margin-bottom:10px;">Let’s build your budget</h2><p style="margin-bottom:12px;">We’ll walk through your spending one category at a time — bills first, then the fun stuff, then the big occasional costs. Skip anything; you can come back any time.</p>'+r+'<div style="margin-bottom:12px;"><div style="font-size:15px; margin-bottom:6px;"><strong>What are you aiming for?</strong> <span style="color:var(--text-muted);">— sets every typical-£ suggestion</span></div><div id="budWizTierBtns" style="display:flex; gap:8px; flex-wrap:wrap;">'+l("minimum","Minimum")+l("moderate","Moderate")+l("comfortable","Comfortable")+'</div><div style="font-size:13px; color:var(--text-muted); margin-top:6px;">PLSA Retirement Living Standards: Minimum = essentials, no car; Moderate = a car + two weeks in Europe; Comfortable = more of everything.</div></div><div class="alert alert-info" style="margin-bottom:12px;"><strong>Before you start:</strong> open your banking app and look at the last 2–3 months of statements. Real numbers beat guesses — most people who guess miss 20% of their spending.</div><ul style="padding-left:18px; color:var(--text-muted); line-height:1.8;"><li>Every amount box is a <strong>calculator</strong> — type <code>11.99+8.99+5.99</code> or <code>4×52/12</code> and it does the maths.</li><li><strong>Typical UK figures</strong> (ONS retired households) appear as one-tap chips when you’re unsure.</li><li>The <strong>&Sigma;</strong> button breaks a cost into parts (fuel + insurance + MOT…) so nothing gets forgotten.</li><li>Everything is in <strong>today’s money</strong>.</li>'+(window._budget.sharedWithPartner?"<li>Mark each line <strong>Me / Partner / Shared</strong> — your plan funds your share; your partner sees theirs.</li>":"")+"</ul>"}if(t==="oneoffs")return'<h2 style="margin-bottom:6px;">One-off & periodic costs</h2><p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">Big costs that land in a specific year: cars, roofs, weddings, milestone trips, helping the kids. Give recurring ones an "every N years" and we average them into your monthly need; one-time items stay as dated events.</p>'+(window._budget.oneOffs.map(QA).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing yet — add the big things below.</p>')+'<button type="button" class="risk-btn" style="margin-top:10px;" onclick="budWizAddOneOff()">+ Add a one-off</button>';if(t==="review"){const i=Zi(window._budget),r=Tg.single,o=i.allInComfortableAnnual,l=o>=r.comfortable?"at or above <strong>Comfortable</strong>":o>=r.moderate?"between <strong>Moderate</strong> and <strong>Comfortable</strong>":o>=r.minimum?"between <strong>Minimum</strong> and <strong>Moderate</strong>":"below the <strong>Minimum</strong>";let c='<h2 style="margin-bottom:10px;">Your spending picture</h2><div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;"><div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(i.sharedWithPartner?" — your share":"")+'</div><div style="font-size:24px;font-weight:700;">'+_e(i.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div><div><div style="font-size:12px;color:var(--text-muted);">'+(i.sharedWithPartner?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:28px;font-weight:800;color:var(--primary,#6366f1);">'+_e(i.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+_e(o)+"/yr — what your plan funds</div></div>";i.sharedWithPartner&&(c+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:24px;font-weight:700;">'+_e(i.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">their side — they can plan with this</div></div>'),c+="</div>",c+='<div class="alert alert-info" style="margin-bottom:14px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+_e(r.minimum)+" · Moderate "+_e(r.moderate)+" · Comfortable "+_e(r.comfortable)+" per year — you’re "+l+'. <span style="color:var(--text-muted);">(Home owned outright; excludes care costs.)</span></div>';const d=Wr(window._budget).slice(0,8);return d.length&&(c+='<div style="margin-bottom:14px;"><div style="font-size:13px; margin-bottom:6px;"><strong>Did you miss anything?</strong> Tap to add, then find it on its category screen:</div><div style="display:flex; flex-wrap:wrap; gap:6px;">'+d.map(h=>'<button type="button" class="budwiz-chip" title="'+Ee(h.hint||"")+`" onclick="budWizSuggest('`+Ee(h.label).replace(/'/g,"\\'")+`', null)">+ `+Ee(h.label)+"</button>").join("")+"</div></div>"),c+='<div style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">Everything is saved automatically as you type.</div>',c+='<div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:6px;"><button type="button" onclick="budWizSave(false)">Done</button><button type="button" onclick="budWizSave(true)">Set as my plan’s target (Stress + Decision) &amp; finish</button></div>',c}const e=Io.find(i=>i.key===t),n=window._budget.lines.filter(i=>YA(i)===e.key),s=Wr(window._budget).filter(i=>(Eu[i.label.toLowerCase()]||"extras")===e.key);return'<h2 style="margin-bottom:6px;">'+e.title+'</h2><div class="alert alert-info" style="margin-bottom:10px; font-size:13px;">'+e.tip+"</div>"+(n.map(KA).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing here yet — add below.</p>')+`<div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; align-items:center;"><button type="button" class="risk-btn" onclick="budWizAddLine('`+e.key+`')">+ Add your own</button>`+(s.length?'<span style="font-size:12px;color:var(--text-muted);">Often forgotten:</span>'+s.map(i=>'<button type="button" class="budwiz-chip" title="'+Ee(i.hint||"")+`" onclick="budWizSuggest('`+Ee(i.label).replace(/'/g,"\\'")+"','"+e.key+`')">+ `+Ee(i.label)+"</button>").join(""):"")+"</div>"}function _t(t=!1){const e=document.getElementById("budWizardOverlay"),n=e.querySelector(".budwiz-body"),s=t&&n?n.scrollTop:0,i=Sr[Un],r=Un===Sr.length-1,o=Sr.map((l,c)=>'<span class="budwiz-dot '+(c===Un?"on":c<Un?"done":"")+'"></span>').join("");e.innerHTML='<div class="budwiz-shell"><div class="budwiz-head" style="display:flex; justify-content:space-between; align-items:center;"><div style="font-size:13px; color:var(--text-muted);">Budget walk-through · step '+(Un+1)+" of "+Sr.length+'</div><button type="button" class="risk-btn" style="padding:4px 12px;" title="Close (your entries are kept)" onclick="closeBudgetWizard()">&times;</button></div><div class="budwiz-body">'+JA(i)+'</div><div class="budwiz-foot"><button type="button" class="risk-btn" onclick="budWizGo(-1)"'+(Un===0?" disabled":"")+">Back</button>"+(r?"":'<button type="button" onclick="budWizGo(1)">'+(i==="intro"?"Start":"Next")+"</button>")+'<div class="budwiz-dots">'+o+'</div><div id="budWizUndoSlot" style="font-size:13px; color:var(--text-muted);"></div><div id="budWizTotals" style="margin-left:auto; font-size:13px; color:var(--text-muted);"></div></div></div>',ir(),e.querySelector(".budwiz-body").scrollTop=s}window.openStressExplainer=function(t){let e=document.getElementById("stressExplainer");e&&e.remove(),e=document.createElement("div"),e.id="stressExplainer",e.style.cssText="position:fixed; inset:0; z-index:1300; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; padding:20px;",e.innerHTML=`<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; max-width:720px; width:100%; max-height:88vh; overflow-y:auto; padding:28px; font-size:15px; line-height:1.65;"><h2 style="margin-bottom:4px;">What the Stress Tester is doing</h2><p style="color:var(--text-muted); margin-bottom:18px;">Every run asks the same question — <em>“if the future looked like this, would your money last?”</em> — and simulates your plan month by month: withdrawals sized to your spending need, tax paid, the ISA bridge drawn tax-free, protection mode in downturns. The three tabs differ only in <strong>where the “future” comes from</strong>.</p><div id="sx-mc" style="border-left:3px solid var(--primary,#6366f1); padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">🎲 Monte Carlo — a thousand plausible futures</h3><p style="color:var(--text-muted);">We deal 1,000 different futures by <strong>shuffling real history</strong>: each simulated year is a randomly-drawn year from 1928–2024, keeping that year’s stock market return and inflation together as they actually happened. Your plan is run through all 1,000; the headline number is how many survive. It answers: <em>“across a wide spread of plausible futures, what are my odds?”</em></p></div><div id="sx-hist" style="border-left:3px solid #14b8a6; padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">📜 Historical — every real retirement since 1928</h3><p style="color:var(--text-muted);">No shuffling: we replay history <strong>in order</strong>, once for every possible start year — retiring into 1929, into 1966, into 1973, into 2000… This is the classic sequence-of-returns test: the <em>order</em> of good and bad years matters as much as the average, and this tab shows exactly which real-world start years would have sunk your plan.</p></div><div id="sx-scen" style="border-left:3px solid #e67e22; padding-left:14px; margin-bottom:16px;"><h3 style="margin-bottom:6px;">🔥 Scenarios — named nightmares, on repeat</h3><p style="color:var(--text-muted);">Five hand-picked 10-year sequences — the Great Depression, 1970s stagflation, the 2000s lost decade, 2008, and a synthetic worst-case — <strong>looped for your whole horizon</strong>. Deliberately unfair: a 35-year plan gets the 1970s three and a half times over. If your plan survives these, sequence risk is well covered; treat them as a stress rig, not a forecast.</p></div><h3 style="margin:20px 0 6px;">How each asset category is modelled</h3><p style="color:var(--text-muted); margin-bottom:8px;">Every future is built from just <strong>two primitives per year: the equity return and inflation</strong>. Everything else is derived from them, the same way in all three tabs:</p><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:12px; line-height:1.8;"><li><strong>Shares</strong> (trackers, income, REITs, EM, small-cap) ride the equity path directly.</li><li><strong>Bonds</strong> earn their own yield, and gain or lose as a <strong>gilt-yield path derived from inflation</strong> moves — so long gilts crash in a 2022-style inflation spike (big duration × rising yields) and rally in a 2008-style flight to quality. Your own bond-class mix (short gilts, linkers, credit…) drives the blend.</li><li><strong>Diversifiers</strong>: gold hedges inflation and tends to rise in crashes; trend-following holds a lagged momentum position (pays in long grinding bear markets, whipsaws in V-shapes); commodities hedge inflation hardest but fall <em>with</em> shares in a demand shock.</li><li><strong>Cash</strong> follows a rate model tied to inflation (roughly −1% real — the FCA convention).</li><li><strong>Your ISA</strong>: if you tagged your own funds, it’s modelled at <em>its</em> mix through all of the above; with a risk level only, it grows at a deliberately modest flat rate (the cash-like “bridge”).</li></ul><h3 style="margin:16px 0 6px;">Are the asset classes correlated? Yes — three ways</h3><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:12px; line-height:1.8;"><li><strong>Equity↔inflation:</strong> years are sampled (or replayed) whole, so “bad market + high inflation” arrive together exactly as often as they did in real history.</li><li><strong>Structural:</strong> bonds are mechanically linked to inflation through the yield path; gold, commodities and trend are functions of the same two primitives.</li><li><strong>Regime-aware residuals:</strong> each bond and diversifier class carries a correlation to equities that <em>changes with the regime</em> — in a normal year gilts barely co-move; in an inflation shock everything falls together (2022); in a deflationary crash gilts flip <em>negative</em> (flight to quality) while credit blows out <em>with</em> equities.</li></ul><h3 style="margin:16px 0 6px;">Honest limitations</h3><ul style="color:var(--text-muted); padding-left:20px; margin-bottom:16px; line-height:1.8;"><li>In Historical replays, only shares-and-inflation are literal history — bond, gold and commodity returns are <em>model-implied</em> from those primitives, not the measured returns of that year.</li><li>Monte Carlo samples each year independently — real markets have some momentum and mean-reversion it doesn’t capture (the Historical tab covers that gap).</li><li>Categories are modelled, not individual funds — your specific fund can beat or trail its category.</li><li>The calibration figures are long-run estimates, not predictions. This is modelling, not advice.</li></ul><button type="button" onclick="document.getElementById('stressExplainer').remove()">Got it</button></div>`,e.addEventListener("click",s=>{s.target===e&&e.remove()}),document.body.appendChild(e);const n={mc:"sx-mc",hist:"sx-hist",scen:"sx-scen"}[t];if(n){const s=document.getElementById(n);s&&(s.scrollIntoView({block:"start"}),s.style.background="rgba(99,102,241,0.08)")}};let to="funds",rs=null,cn=null,Hi=[];window.openAdminPanel=function(){const t=Lx();if(t){const e=prompt("Admin passphrase:");if(e!==t){e!==null&&showToast("Wrong passphrase","error");return}}rs=fl().map(e=>({...e})),cn=JSON.parse(JSON.stringify(Nx()||{})),document.getElementById("adminPanelOverlay").style.display="block",ds()};window.closeAdminPanel=function(){document.getElementById("adminPanelOverlay").style.display="none"};window.adminSetTab=function(t){to=t,ds(!0)};function XA(t,e){const n=Gg();let s="";for(const i of["shares","bonds","diversifiers","cash"]){const r=n[i]||[];s+='<optgroup label="'+yu[i]+'">'+r.map(o=>'<option value="'+o.key+'"'+(o.key===e?" selected":"")+">"+o.label+"</option>").join("")+"</optgroup>"}return'<select onchange="adminFundField('+t+`,'subClass',this.value)" style="width:200px;">`+s+"</select>"}window.adminFundField=function(t,e,n){const s=rs[t];s&&(s[e]=e==="ticker"?String(n).toUpperCase():n)};window.adminFundRemove=function(t){rs.splice(t,1),ds(!0)};window.adminFundAdd=function(){rs.push({ticker:"",name:"",subClass:"worldGrowth"}),ds(!0)};window.adminSaveFunds=async function(){try{const t=await Fx(rs);li("ss",!0),li("ds",!0),showToast("Fund catalogue saved to cloud ("+t+" funds) — live for all users.","success")}catch(t){showToast("Save failed: "+t.message,"error")}};window.adminRevertFunds=async function(){if(confirm("Remove the cloud fund-catalogue override and return to the shipped default list?"))try{await Vx(),rs=fl().map(t=>({...t})),li("ss",!0),li("ds",!0),ds(!0),showToast("Reverted to the shipped catalogue.","success")}catch(t){showToast("Revert failed: "+t.message,"error")}};window.adminProfileField=function(t,e,n){const s=Jd[t][e],i=n===""?void 0:+n;i===void 0||!Number.isFinite(i)||i===s?cn[t]&&(delete cn[t][e],Object.keys(cn[t]).length||delete cn[t]):(cn[t]=cn[t]||{})[e]=i};window.adminSaveProfiles=async function(){try{await ry(cn),showToast(Object.keys(cn).length?"Category model overrides saved — live for all users.":"No overrides — shipped calibration active.","success")}catch(t){showToast("Save failed: "+t.message,"error")}};window.adminResetProfiles=async function(){if(confirm("Clear ALL category-model overrides and return to the shipped calibration?")){cn={};try{await ry(null),ds(!0),showToast("Shipped calibration restored.","success")}catch(t){showToast("Reset failed: "+t.message,"error")}}};window.adminLoadSuggestions=async function(){try{Hi=await $x(),ds(!0)}catch(t){showToast("Could not load suggestions: "+t.message,"error")}};window.adminSuggestionToFunds=function(t){const e=Hi[t];e&&(rs.push({ticker:e.ticker,name:e.name||"",subClass:e.subClass||"worldGrowth"}),adminDeleteSuggestion(t,!0),to="funds",ds(!0),showToast(e.ticker+' added to the funds editor — press "Save to cloud" to publish.',"info",4500))};window.adminDeleteSuggestion=async function(t,e){const n=Hi[t];if(n){Hi.splice(t,1);try{await Ux(n.id)}catch{}e||ds(!0)}};function ZA(){if(to==="funds"){const e=rs.map((n,s)=>'<tr><td><input type="text" value="'+Ee(n.ticker)+'" oninput="adminFundField('+s+`,'ticker',this.value)" style="width:80px;text-transform:uppercase;"></td><td><input type="text" value="`+Ee(n.name)+'" oninput="adminFundField('+s+`,'name',this.value)" style="width:280px;"></td><td>`+XA(s,n.subClass)+'</td><td><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminFundRemove('+s+')">&times;</button></td></tr>').join("");return'<p style="font-size:13px;color:var(--text-muted);">The shared catalogue every user sees. Saving publishes a cloud override; revert returns to the list shipped in code. Each fund’s category decides which model it runs through.</p><div style="display:flex;gap:8px;margin:8px 0;"><button type="button" class="risk-btn" onclick="adminFundAdd()">+ Add fund</button><button type="button" onclick="adminSaveFunds()">Save to cloud</button><button type="button" class="risk-btn" onclick="adminRevertFunds()">Revert to shipped list</button><span style="font-size:12px;color:var(--text-muted);align-self:center;">'+rs.length+' funds</span></div><div style="overflow-x:auto;"><table style="font-size:13px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Ticker</th><th style="text-align:left;">Name</th><th style="text-align:left;">Category (model)</th><th></th></tr></thead><tbody>'+e+"</tbody></table></div>"}if(to==="categories"){const e=["nominalReturn","yield","vol","eqCorr","duration","inflationBeta","creditBeta","idioVol"],n=Object.entries(Jd).map(([s,i])=>{const r=cn[s]||{},o=e.map(l=>{if(i[l]===void 0&&r[l]===void 0)return'<td style="color:var(--text-muted);text-align:center;">—</td>';const c=r[l]!==void 0?r[l]:i[l],d=r[l]!==void 0;return'<td><input type="number" step="0.001" value="'+c+'" title="Shipped default: '+i[l]+`" onchange="adminProfileField('`+s+"','"+l+`',this.value)" style="width:74px;`+(d?"border-color:#eab308;":"")+'"></td>'}).join("");return'<tr><td style="white-space:nowrap;"><strong>'+i.label+'</strong><br><span style="font-size:11px;color:var(--text-muted);">'+s+" · "+i.bucket+"</span></td>"+o+"</tr>"}).join("");return'<p style="font-size:13px;color:var(--text-muted);">The calibration seeds behind each category’s model (nominal figures; see SubAssetModel.js for the driver decomposition). Amber border = overridden vs shipped. Changes go live for all users on save — tune with care; the golden tests only protect the shipped values.</p><div style="display:flex;gap:8px;margin:8px 0;"><button type="button" onclick="adminSaveProfiles()">Save overrides to cloud</button><button type="button" class="risk-btn" onclick="adminResetProfiles()">Reset all to shipped</button></div><div style="overflow-x:auto;"><table style="font-size:12px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Category</th>'+e.map(s=>"<th>"+s+"</th>").join("")+"</tr></thead><tbody>"+n+"</tbody></table></div>"}return'<p style="font-size:13px;color:var(--text-muted);">Unknown tickers users categorised themselves. “Add to funds” copies one into the Funds editor (publish from there).</p><button type="button" class="risk-btn" onclick="adminLoadSuggestions()" style="margin:8px 0;">Refresh</button><div style="overflow-x:auto;"><table style="font-size:13px;border-collapse:collapse;"><thead><tr><th style="text-align:left;">Ticker</th><th style="text-align:left;">Chosen category</th><th style="text-align:left;">Name</th><th></th></tr></thead><tbody>'+(Hi.length?Hi.map((e,n)=>"<tr><td><strong>"+Ee(e.ticker)+"</strong></td><td>"+Ee(e.subClass||"(none)")+'</td><td style="color:var(--text-muted);">'+Ee(e.name||"")+'</td><td><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminSuggestionToFunds('+n+')">Add to funds</button> <button type="button" class="risk-btn" style="padding:2px 8px;" onclick="adminDeleteSuggestion('+n+')">Dismiss</button></td></tr>').join(""):'<tr><td colspan="4" style="color:var(--text-muted);">Nothing loaded — press Refresh.</td></tr>')+"</tbody></table></div>"}function ds(t=!1){const e=document.getElementById("adminPanelOverlay"),n=e.querySelector(".budwiz-body"),s=t&&n?n.scrollTop:0,i=(r,o)=>'<button type="button" class="risk-btn'+(to===r?" active":"")+`" onclick="adminSetTab('`+r+`')">`+o+"</button>";e.innerHTML='<div class="budwiz-shell"><div class="budwiz-head" style="display:flex; justify-content:space-between; align-items:center;"><div style="display:flex; gap:8px; align-items:center;"><strong>⚙ Administration</strong>'+i("funds","Funds")+i("categories","Category models")+i("suggestions","Suggestions")+'</div><button type="button" class="risk-btn" style="padding:4px 12px;" onclick="closeAdminPanel()">&times;</button></div><div class="budwiz-body">'+ZA()+"</div></div>",e.querySelector(".budwiz-body").scrollTop=s}let Lc=!1,Nc=!1;async function rr(){try{const t=await bt();return!!(t&&t.locked)}catch(t){return console.warn("Could not read decision settings for lock state:",t),!1}}async function qy(){try{const[t,e,n]=await Promise.all([bt(),fi({limit:1e3}),cs()]);if(n&&Object.values(n).some(r=>r&&r.yearSetupComplete))return!0;const s=Fg(t);return(Array.isArray(e)?e:[]).some(r=>r.settingsChecksum===void 0||r.settingsChecksum===s)}catch(t){return console.warn("Could not determine derived-data state:",t),!0}}function Yf(t){const e=document.getElementById("decision-decisionsettings");e&&e.querySelectorAll("input, select, textarea, button").forEach(n=>{n.closest("#dsLockBanner")||n.id!=="dsSaveBtn"&&(n.disabled=!t)})}async function Su(){const t=document.getElementById("dsLockBanner"),e=document.getElementById("dsSaveBtn");if(!(!t||!e)){if(Lc=await rr(),!Lc){t.style.display="none",Yf(!0),e.textContent="Save Settings",e.classList.remove("btn-locked"),Ac();return}Nc=!await qy(),t.style.display="flex",t.className="lock-banner",Nc?t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Nothing has been recorded against them yet — no tax years, no monthly entries — so you can unlock and edit them.</span><button type="button" onclick="unlockDecisionSettings()">Unlock to edit</button>':t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Tax years or monthly entries have been recorded against them, so they can’t be changed. To use different settings, create a new plan.</span><button type="button" onclick="createNewPlanForSettings()">Create new plan</button>',Yf(!1),e.textContent="🔒 Locked",e.classList.add("btn-locked"),Ac()}}window.unlockDecisionSettings=async function(){if(await qy()){showToast("Can’t unlock — tax years or entries now depend on these settings. Create a new plan.","warning"),await Su();return}kt("Unlocking…");try{await ri({locked:!1}),await vl(),showToast("Settings unlocked — you can edit them now.","success")}catch(t){console.error("Unlock error:",t),showToast("Could not unlock: "+t.message,"error")}finally{Ct()}};window.createNewPlanForSettings=function(){const t=document.getElementById("scenarioNewBtn");t&&t.click()};window.saveDecisionSettingsUI=async function(){if(!lt()){showToast("Please sign in to save settings","error");return}if(Lc||await rr()){showToast(Nc?"These settings are locked. Use “Unlock to edit” above to change them.":"These settings are locked. Define a new plan to use different settings.","info");return}const t=ul(document.getElementById("dsSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ds");if(pu(e.equityMin,e.bondMin,e.cashTarget)){kt("Saving settings...");try{await ri({configured:!0,accessMethod:document.getElementById("dsAccessMethod").value||"drawdown",ufplsYears:+document.getElementById("dsUfplsYears").value||null,ufplsThenPcls:document.getElementById("dsUfplsPcls").checked,bandFillRecycle:document.getElementById("dsBandFillRecycle").checked,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("dsDuration").value,equityGlideEnabled:document.getElementById("dsEquityGlide").checked,baseSalary:+document.getElementById("dsBaseSalary").value,spendingProfile:document.getElementById("dsSpendingProfile").value||"flat",spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,disableProtection:document.getElementById("dsDisableProtection").checked,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value,isaBalance:+document.getElementById("dsIsaBalance").value||0,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:gu("ds"),taggedFunds:Yt("ds").filter(n=>n.ticker&&n.value>0),locked:!0}),fu(),showToast("Settings saved and locked. Create a new plan to use different settings.","success",4e3),await Su()}catch(n){console.error("Error saving decision settings:",n),showToast("Error saving: "+n.message,"error")}finally{Ct()}}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){kt("Resetting settings...");try{await ri({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await vl(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{Ct()}}};window.showDrawdownScheduleUI=async function(){const t=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const n=await wt();n.duration=e;const s=ey(n,e,t);let i='<div class="card"><h2>Projected Drawdown Schedule (SIPP + ISA bridge)</h2>';i+='<div class="alert alert-info" style="margin-bottom:16px;">SIPP is drawn to fill the basic-rate band; the tax-free <strong>ISA tops your income up to the target</strong> and runs down over the years (the bridge to the State Pension). Deterministic projection at your assumed inflation — the stochastic ISA path is in the Monte-Carlo / Historical results.</div>',i+='<div style="overflow-x: auto;"><table>',i+="<thead><tr><th>Year</th><th>SIPP Draw</th><th>State</th><th>Tax</th><th>Net (SIPP+SP)</th><th>ISA Top-up</th><th>Spendable</th><th>ISA Left</th></tr></thead>",i+="<tbody>";for(const r of s)i+=`<tr>
            <td>${r.year}</td>
            <td style="color: var(--primary); font-weight: 600;">${j(r.sippDraw)}</td>
            <td>${j(r.statePension)}</td>
            <td style="color: var(--danger);">-${j(r.tax)}</td>
            <td>${j(r.netIncome)}</td>
            <td style="color: var(--info);">${j(r.isaDraw)}</td>
            <td style="color: var(--success); font-weight: 600;">${j(r.spendable)}</td>
            <td>${j(r.isaBalance)}</td>
          </tr>`;i+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=i}catch(n){console.error("Drawdown error:",n),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};window.showGlidepathUI=async function(){const t=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const n=await wt();n.duration=e;const s=hS(n,t),i=ey(n,e,t),r={};i.forEach(h=>{r[h.year]=h.isaBalance});const o=!!n.equityGlideEnabled,l=(n.equityMin||0)+(n.bondMin||0)+(n.cashTarget||0),c={equity:l>0?n.equityMin/l:.5,bond:l>0?n.bondMin/l:.4,cash:l>0?n.cashTarget/l:.1,equityGlide:o?wo(n.equityMin,n.bondMin):void 0};let d='<div class="card"><h2>Fund Glidepath Over Time</h2>';d+='<div class="alert alert-info" style="margin-bottom: 20px;">',d+=o?"<strong>Bond tent on:</strong> the equity share (Shares %) RISES over the early years then holds; the £ floors inflate with CPI and deplete over time, cash holds its real value, and the ISA bridge runs down as it tops up income.":"<strong>Glidepath:</strong> Equity & Bond minimums inflate with CPI but deplete over time to £0; cash inflates only (holds real value); the ISA bridge runs down as it tops up income. Turn on the bond tent in Settings to see the equity share rise.",d+="</div>",d+='<div style="overflow-x: auto;"><table>',d+="<thead><tr><th>Year</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Shares % (of pot)</th><th>ISA Balance</th><th>Total Min</th></tr></thead>",d+="<tbody>";for(const h of s){const m=Math.round(_c(c,h.year,n.duration).equity*100);d+=`<tr>
            <td>${h.year}</td>
            <td style="color: var(--success);">${j(h.equityMin)}</td>
            <td style="color: var(--info);">${j(h.bondMin)}</td>
            <td style="color: var(--warning);">${j(h.cashTarget)}</td>
            <td style="font-weight: 600;">${m}%</td>
            <td>${j(r[h.year]||0)}</td>
            <td style="font-weight: 600;">${j(h.totalMin)}</td>
          </tr>`}d+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=d}catch(n){console.error("Glidepath error:",n),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};let Zt=null,bn=[],wn="all";async function xn(){const t=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),n=document.getElementById("historyYearFilter"),s=document.getElementById("deleteAllHistoryBtn"),i=document.getElementById("deleteYearBtn");if(!t||!e)return;if(t.innerHTML='<span class="loading">Loading...</span>',bn=await fi({sortDesc:!1,limit:500}),s&&(s.style.display=bn.length>0?"":"none"),i&&(i.style.display="none"),bn.length===0){t.innerHTML="",n&&(n.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const r=[...new Set(bn.map(d=>d.date.split("-")[0]))].sort().reverse();if(n){let d='<option value="all">All Years</option>';r.forEach(h=>{d+=`<option value="${h}">${h}</option>`}),n.innerHTML=d,n.value=wn}i&&(i.style.display=wn!=="all"&&bn.length>0?"":"none");const o=wn==="all"?bn:bn.filter(d=>d.date.startsWith(wn));if(o.length===0){t.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${wn}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let l="";o.forEach(d=>{const h=d.date===Zt,m=["history-tab"];h&&m.push("active"),d.inProtection&&m.push("protection");const[p,w]=d.date.split("-").map(Number),I=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],S=wn==="all"?`${I[w-1]} ${p}`:I[w-1];l+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${d.date}')">${S}</button>`}),t.innerHTML=l;const c=document.getElementById("historyMobileSelector");if(c){let d="";o.forEach(h=>{const m=Wi(h.date),p=h.inProtection?" (Protection)":"";d+=`<option value="${h.date}">${m}${p}</option>`}),c.innerHTML=d}(!Zt||!o.find(d=>d.date===Zt))&&(Zt=o[o.length-1].date),c&&(c.value=Zt),Hy(Zt),setTimeout(()=>{const d=t.querySelector(".history-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(t){wn=t,Zt=null,xn()};function Wi(t){const[e,n]=t.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][n-1]} ${e}`}function Hy(t){const e=document.getElementById("historyDetail"),n=bn.find(d=>d.date===t);if(!n){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const s=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",i=n.isTaxEfficientYear!==!1&&n.mode==="Tax-Efficient",r=n.inProtection?"warning":i?"efficient":"inefficient",o=n.inProtection?`Protection${n.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:i?"Tax-Efficient":"Standard";let l=n.source||"Unknown";n.source==="Growth"&&(n.dEquity>0||n.dBond>0)?l=`Growth (Equity: ${s(n.dEquity||0)}, Bond: ${s(n.dBond||0)})`:n.source==="Cash"&&(l=`Cash (${s(n.dCash||n.sipp||0)})`);let c=`
        <div class="no-print" style="display:flex;justify-content:flex-end;margin-bottom:12px;">
          <button class="btn secondary" onclick="printMonthlyReport('${n.date}')">Download PDF</button>
        </div>
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${Wi(n.date)}</h3>
              <div style="color:var(--text-muted);font-size:13px;">Tax Year ${n.taxYear} • Year ${n.yearNum||0}</div>
            </div>
            <span class="tax-mode-badge ${r}">${o}</span>
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
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===Wi(t))})}window.selectHistoryEntry=function(t){Zt=t,Hy(t);const e=document.getElementById("historyMobileSelector");e&&(e.value=t);const s=document.getElementById("historyTabs").querySelector(".history-tab.active");s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(t){const e=document.getElementById("historyTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function Ma(t){const[e,n]=t.split("-").map(Number);return n>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function Oc(t){const e={};for(const s of t){const i=s.taxYear||Ma(s.date);e[i]||(e[i]=0),e[i]+=s.isaSavingsUsedThisMonth||s.isa||0}for(const s of t)await Vg(s.date);const n=await cs();for(const[s,i]of Object.entries(e))if(n[s]){const r=n[s].isaSavingsUsed||0,o=Math.max(0,r-i);await hi(s,{...n[s],isaSavingsUsed:o})}}window.deleteHistoryEntry=async function(t){if(!lt()){showToast("Please sign in to delete entries","error");return}const e=await fi({sortDesc:!1,limit:1e3}),n=Ma(t),i=e.filter(c=>(c.taxYear||Ma(c.date))===n).sort((c,d)=>c.date.localeCompare(d.date)),r=i.findIndex(c=>c.date===t);if(r===-1){showToast("Entry not found","error");return}const o=r===i.length-1,l=Wi(t);if(o){if(!confirm(`Delete entry for ${l}?`))return;kt("Deleting entry...");try{await Oc([i[r]]),showToast(`Deleted ${l}`,"success"),Zt=null,await xn()}catch(c){console.error("Delete error:",c),showToast("Error deleting: "+c.message,"error")}finally{Ct()}}else{const c=i.slice(r),d=Wi(c[c.length-1].date);if(!confirm(`This will delete ${c.length} entries from ${l} to ${d} in tax year ${n}.

Continue?`))return;kt(`Deleting ${c.length} entries...`);try{await Oc(c),showToast(`Deleted ${c.length} entries`,"success"),Zt=null,await xn()}catch(h){console.error("Delete error:",h),showToast("Error deleting: "+h.message,"error")}finally{Ct()}}};window.deleteHistoryForTaxYear=async function(t){if(!lt()){showToast("Please sign in to delete entries","error");return}const n=(await fi({sortDesc:!1,limit:1e3})).filter(s=>(s.taxYear||Ma(s.date))===t);if(n.length===0){showToast(`No history entries for tax year ${t}`,"info");return}if(confirm(`Delete all ${n.length} history entries for tax year ${t}?`)){kt(`Deleting tax year ${t}...`);try{await Oc(n);const s=await cs();s[t]&&await hi(t,{...s[t],isaSavingsUsed:0}),showToast(`Deleted all entries for ${t}`,"success"),Zt=null,await xn()}catch(s){console.error("Delete error:",s),showToast("Error deleting: "+s.message,"error")}finally{Ct()}}};window.deleteHistoryForSelectedYear=async function(){if(wn==="all"){showToast("Select a specific year first","error");return}const t=`${parseInt(wn)%100}/${(parseInt(wn)+1)%100}`;await deleteHistoryForTaxYear(t)};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!lt()){showToast("Please sign in to delete entries","error");return}kt("Deleting all history...");try{const t=await fi({limit:1e3});for(const n of t)await Vg(n.date);const e=await cs();for(const[n,s]of Object.entries(e))s.isaSavingsUsed>0&&await hi(n,{...s,isaSavingsUsed:0});showToast(`Deleted ${t.length} entries`,"success"),Zt=null,await xn()}catch(t){console.error("Delete all error:",t),showToast("Error deleting: "+t.message,"error")}finally{Ct()}}};let Hs=null;async function ci(){const t=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!t||!e)return;t.innerHTML='<span class="loading">Loading...</span>';const n=await cs(),s=await bt(),i=Object.keys(n).sort(),r=e1(),o=t1(i,r,40);let l="";o.forEach(h=>{const m=n[h],p=m&&m.yearSetupComplete,w=h===Hs,I=["tax-year-tab"];w&&I.push("active"),p||I.push("not-setup"),l+=`<button class="${I.join(" ")}" onclick="selectTaxYear('${h}')">${h}</button>`}),t.innerHTML=l;const c=document.getElementById("taxYearMobileSelector");if(c){let h="";o.forEach(m=>{const p=n[m],I=p&&p.yearSetupComplete?m:`${m} (not set up)`;h+=`<option value="${m}">${I}</option>`}),c.innerHTML=h}if(!Hs){const h=i.filter(m=>{var p;return(p=n[m])==null?void 0:p.yearSetupComplete});Hs=h.length>0?h[h.length-1]:r}c&&(c.value=Hs),await Wy(Hs,n,s);const d=t.querySelector(".tax-year-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function e1(){const t=new Date,e=t.getFullYear(),n=t.getMonth()+1;return n<4||n===4&&t.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function t1(t,e,n){const s=new Set(t),[i]=e.split("/").map(Number),r=i<50?2e3+i:1900+i;for(let o=0;o<n&&s.size<n;o++){const l=r+o,c=l+1;s.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(s).sort()}async function Wy(t,e,n){var _,b,E,x,y,te,re,q,ne,se,oe,ve,Te,ie;const s=document.getElementById("taxYearDetail"),i=e[t];if(!i||!i.yearSetupComplete){s.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${t} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${t}')">Set Up ${t}</button>
          </div>
        `;return}const r=await jd(t),o=Math.round(r.amount||0),l=r.startDate||"Not configured",c=r.isReceiving;r.yearsUntil;const d=F=>F!=null?"£"+Math.round(F).toLocaleString():"—",h=(n.equityMin||0)+(n.bondMin||0)+(n.cashTarget||0),m=n.duration||35,p=Math.max(0,2e3+(parseInt(t.split("/")[0],10)||26)-2026),w=!!n.equityGlideEnabled,I={equity:h>0?n.equityMin/h:.5,bond:h>0?n.bondMin/h:.4,cash:h>0?n.cashTarget/h:.1,equityGlide:w?wo(n.equityMin,n.bondMin):void 0},S=_c(I,p,m),A=_c(I,Math.max(0,p-1),m),P=F=>Math.round(F*100),C=Math.max(5,m-20),L=P(S.equity)-P(A.equity),D=`${P(S.equity)}% shares / ${P(S.bond)}% bonds / ${P(S.cash)}% cash`;let O,U;w?p>C?(U=`Holding — reached your mix at year ${C}`,O=`You've reached your endgame mix. Hold ${D}; no glide change this year.`):L>0?(U=`Rising — year ${p} of ${C}`,O=`Shift about ${L}% of your pot from bonds into shares this year, reaching ${D}.`):(U=`Rising — year ${p} of ${C}`,O=`Hold ${D}.`):(U="Flat (bond tent off)",O=`Hold a steady ${D}. Rebalance back to this whenever it drifts.`);const T=`
        <div class="tax-year-detail-card">
          <h3>This Year's Target Mix${w?" — Bond Tent":""}</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field"><label>Shares</label><span class="value">${P(S.equity)}% · ${d(h*S.equity)}</span></div>
            <div class="tax-year-field"><label>Bonds</label><span class="value">${P(S.bond)}% · ${d(h*S.bond)}</span></div>
            <div class="tax-year-field"><label>Cash</label><span class="value">${P(S.cash)}% · ${d(h*S.cash)}</span></div>
            <div class="tax-year-field"><label>Glide stage</label><span class="value">${U}</span></div>
          </div>
          <div class="alert alert-info" style="margin-top:12px;"><strong>Rebalance:</strong> ${O}</div>
        </div>`;let v=`<div class="no-print" style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:12px;"><button class="btn secondary" onclick="printAnnualReport('${t}')">Download PDF</button> <button class="btn secondary" onclick="exportAnnualCsv('${t}')">Export CSV</button></div>`+T+`
        <!-- Tax Thresholds -->
        <div class="tax-year-detail-card">
          <h3>Tax Thresholds</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Personal Allowance</label>
              <input type="number" value="${i.pa||12570}" onchange="updateTaxYear('${t}','pa',this.value)">
            </div>
            <div class="tax-year-field">
              <label>Basic Rate Limit</label>
              <input type="number" value="${i.brl||50270}" onchange="updateTaxYear('${t}','brl',this.value)">
            </div>
            <div class="tax-year-field">
              <label>Higher Rate Limit</label>
              <input type="number" value="${i.hrl||125140}" onchange="updateTaxYear('${t}','hrl',this.value)">
            </div>
            <div class="tax-year-field">
              <label>CPI (Previous Year)</label>
              <input type="number" step="0.1" value="${((i.cpi||.04)*100).toFixed(1)}" onchange="updateTaxYear('${t}','cpi',this.value/100)">
            </div>
          </div>
        </div>

        <!-- Income Configuration -->
        <div class="tax-year-detail-card">
          <h3>Income Configuration</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Target Annual Salary</label>
              <span class="value">${d(i.confirmedSalary)}</span>
            </div>
            <div class="tax-year-field">
              <label>Other Taxable Income (Annual)</label>
              <input type="number" value="${i.other||0}" onchange="updateTaxYear('${t}','other',this.value)">
            </div>
            <div class="tax-year-field">
              <label>State Pension (Annual)</label>
              <span class="value">${c?d(o)+(r.isFirstYear?" (partial year)":""):l!=="Not configured"?`Starts ${l}`:"Not configured"}</span>
            </div>
            <div class="tax-year-field">
              <label>Income Before Pension Start</label>
              <span class="value">${d(i.grossIncomeToDate)}</span>
            </div>
          </div>
        </div>

        <!-- Tax Efficiency -->
        <div class="tax-year-detail-card">
          <h3>Tax Efficiency</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Mode</label>
              <span class="tax-mode-badge ${i.isTaxEfficient?"efficient":"inefficient"}">
                ${i.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient"}
              </span>
            </div>
            <div class="tax-year-field">
              <label>ISA/Savings Allocation</label>
              <span class="value">${d(i.isaSavingsAllocation)}</span>
            </div>
            <div class="tax-year-field">
              <label>ISA/Savings Used</label>
              <span class="value">${d(i.isaSavingsUsed||0)}</span>
            </div>
            <div class="tax-year-field">
              <label>Start Month</label>
              <span class="value">${n1(i.startMonth||4)}</span>
            </div>
            <div class="tax-year-field">
              <label>Remaining Months (at setup)</label>
              <span class="value">${i.remainingMonths||12}</span>
            </div>
          </div>
        </div>
      `;if(i.expectedMonthly){const F=i.expectedMonthly;v+=`
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
                  <td class="net-col">${d((re=F.other)==null?void 0:re.net)}</td>
                </tr>
                `:""}
                ${((q=F.statePension)==null?void 0:q.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${d((ne=F.statePension)==null?void 0:ne.gross)}</td>
                  <td class="tax-col">-${d((se=F.statePension)==null?void 0:se.tax)}</td>
                  <td class="net-col">${d((oe=F.statePension)==null?void 0:oe.net)}</td>
                </tr>
                `:""}
                ${((ve=F.isa)==null?void 0:ve.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${d((Te=F.isa)==null?void 0:Te.gross)}</td>
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
      `,s.innerHTML=v,document.querySelectorAll(".tax-year-tab").forEach(F=>{F.classList.toggle("active",F.textContent===t)})}window.selectTaxYear=async function(t){Hs=t;const e=await cs(),n=await bt();await Wy(t,e,n),document.querySelectorAll(".tax-year-tab").forEach(o=>{o.classList.toggle("active",o.textContent===t)});const s=document.getElementById("taxYearMobileSelector");s&&(s.value=t);const r=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${t}')"]`);r&&r.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(t){const e=document.getElementById("taxYearTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function n1(t){return["January","February","March","April","May","June","July","August","September","October","November","December"][(t-1)%12]||"April"}window.triggerWizardForYear=async function(t){const[e]=t.split("/").map(Number),n=e<50?2e3+e:1900+e,s=`${n}-04`,i=document.getElementById("entryMonth");i&&(i.value=s,i.dispatchEvent(new Event("input"))),document.querySelectorAll(".tab").forEach(r=>r.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(r=>r.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(r=>r.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(r=>r.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),showToast(`Please click "Calculate" with April ${n} selected to set up tax year ${t}`,"info",5e3)};window.reconfigureTaxYear=async function(t){if(confirm(`This will allow you to reconfigure tax year ${t}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await ol(t);e.yearSetupComplete=!1,await hi(t,e),await ci(),showToast(`Tax year ${t} marked for reconfiguration. Calculate a decision for this year to run the wizard again.`,"success",5e3)}catch(e){console.error("Error:",e),showToast("Error: "+e.message,"error")}};window.updateTaxYear=async function(t,e,n){try{const s=await ol(t);s[e]=parseFloat(n),await hi(t,s)}catch(s){console.error("Error updating tax year:",s),showToast("Error saving: "+s.message,"error")}};window.deleteTaxYear=async function(t){if(confirm("Delete tax year "+t+"? This will remove all configuration for this year."))try{const e=await Rn();delete e.taxYears[t],await rl(e),Hs=null,await ci()}catch(e){console.error("Error deleting tax year:",e),showToast("Error deleting: "+e.message,"error")}};window.addTaxYear=async function(){if(!lt()){showToast("Please sign in to add tax years","error");return}const t=prompt("Enter tax year (e.g., 25/26):");if(!t||!/^\d{2}\/\d{2}$/.test(t)){showToast("Invalid format. Use YY/YY (e.g., 25/26)","error");return}try{await hi(t,{}),await ci()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error")}};console.log("Pension Planner v"+jf+" loaded");
